// Track blocked users by IP: { ip: unblockTimestamp }
const blockedUsers = new Map();
// server/src/index.js
const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*", methods: ["GET","POST"] } });

const waitingQueue = [];
const partners = {};
const userInfo = {};

function removeFromQueue(socketId) {
  const idx = waitingQueue.indexOf(socketId);
  if (idx !== -1) waitingQueue.splice(idx, 1);
}

io.on('connection', (socket) => {           // video call logic
  console.log('User connected:', socket.id);

  io.emit('online-count', io.engine.clientsCount);
  io.emit('online-users', io.engine.clientsCount);

    // Join event with blocked IP check
  socket.on('join', (data) => {
    const ip = socket.handshake.headers['x-forwarded-for']?.split(',')[0] || socket.handshake.address;
    const unblockAt = blockedUsers.get(ip);

    if (unblockAt && unblockAt > Date.now()) {
      const remaining = Math.ceil((unblockAt - Date.now()) / 1000);
      console.log(`Blocked IP ${ip} tried to join. ${remaining}s left.`);

      // tell user they are still blocked with actual remaining time
      socket.emit("reported", { remaining });
      return;
    }

    // normal join flow
    userInfo[socket.id] = data || { name: 'Anonymous', gender: 'other' };
    if (partners[socket.id]) return;

    removeFromQueue(socket.id);

    if (waitingQueue.length === 0) {
      waitingQueue.push(socket.id);
      socket.emit('waiting');
      return;
    }

    let peerIndex = -1;
    for (let i = 0; i < waitingQueue.length; i++) {
      const cand = waitingQueue[i];
      if (cand !== socket.id && io.sockets.sockets.get(cand)) {
        peerIndex = i;
        break;
      }
    }

    if (peerIndex === -1) {
      waitingQueue.push(socket.id);
      socket.emit('waiting');
      return;
    }

    const peerId = waitingQueue.splice(peerIndex, 1)[0];

    partners[peerId] = socket.id;
    partners[socket.id] = peerId;

    io.to(peerId).emit('paired', {
      partnerId: socket.id,
      initiator: true,
      partnerInfo: userInfo[socket.id]
    });
    io.to(socket.id).emit('paired', {
      partnerId: peerId,
      initiator: false,
      partnerInfo: userInfo[peerId]
    });
  });


  // signaling
  socket.on('offer', ({ to, sdp }) => { if (to) io.to(to).emit('offer', { from: socket.id, sdp }); });
  socket.on('answer', ({ to, sdp }) => { if (to) io.to(to).emit('answer', { from: socket.id, sdp }); });
  socket.on('ice-candidate', ({ to, candidate }) => { if (to) io.to(to).emit('ice-candidate', { from: socket.id, candidate }); });

  // chat
  socket.on('chat-message', ({ to, message }) => {
    if (!to) return;
    const info = userInfo[socket.id] || { name: 'Stranger', gender: 'other' };
    io.to(to).emit('chat-message', { from: socket.id, fromName: info.name, message });
  });

  // typing indicator
  socket.on('typing', ({ to, fromName }) => {
    if (to) {
      io.to(to).emit('typing', { from: socket.id, fromName });
    }
  });

     // --- Report Event ---
  socket.on("report", ({ partnerId, reason }) => {
    console.log(`User ${socket.id} reported ${partnerId} for: ${reason}`);

    const partnerSocket = io.sockets.sockets.get(partnerId);
    if (!partnerSocket) return;

    // --- Block partner’s IP ---
    const partnerIp = partnerSocket.handshake.headers['x-forwarded-for']?.split(',')[0] || partnerSocket.handshake.address;
    const now = Date.now();
    const cooldown = 60 * 1000; // 60 seconds
    blockedUsers.set(partnerIp, now + cooldown);

    // tell partner they are reported, send remaining time (always 60s at report time)
    io.to(partnerId).emit("reported", { remaining: 60 });

    // end session for partner
    io.to(partnerId).emit("partner-left");
    removeFromQueue(partnerId);
    delete partners[partnerId];

    // ✅ reporter is re-queued back into matchmaking immediately
    io.to(socket.id).emit("partner-left");
    removeFromQueue(socket.id);
    waitingQueue.push(socket.id);
    delete partners[socket.id];
  }); 
    // add handler
   socket.on("skip-block", () => {
  const ip = socket.handshake.headers['x-forwarded-for']?.split(',')[0] || socket.handshake.address;
  if (blockedUsers.has(ip)) {
    blockedUsers.delete(ip); // ✅ allow immediate rejoin
    console.log(`Block skipped for IP: ${ip}`);
    }
    });


  // leave
  socket.on('leave', () => {
    const partner = partners[socket.id];
    if (partner) {
      io.to(partner).emit('partner-left');
      removeFromQueue(partner);
      waitingQueue.push(partner); // partner requeued
      delete partners[partner];
      delete partners[socket.id];
    } else {
      removeFromQueue(socket.id);
    }
    delete userInfo[socket.id];
    io.emit('online-count', io.engine.clientsCount);
    io.emit('online-users', io.engine.clientsCount);
  });

 socket.on("disconnect", () => {
  console.log("💀 Disconnected:", socket.id);

  // ===== VIDEO CLEANUP =====
  const videoPartner = partners[socket.id];
  if (videoPartner) {
    io.to(videoPartner).emit("partner-left");
    removeFromQueue(videoPartner);
    waitingQueue.push(videoPartner);
    delete partners[videoPartner];
    delete partners[socket.id];
  } else {
    removeFromQueue(socket.id);
  }

  // ===== VOICE CLEANUP =====
  if (global.voiceQueue) {
    // Remove this socket from queue if still present
    global.voiceQueue = global.voiceQueue.filter((id) => id !== socket.id);
  }

  const voicePartner = global.voicePartners?.[socket.id];
  if (voicePartner) {
    console.log(`🎤 Voice disconnect: notifying partner ${voicePartner}`);
    io.to(voicePartner).emit("partner-left-voice");

    // Full unpair for both sides
    delete global.voicePartners[voicePartner];
    delete global.voicePartners[socket.id];
  } else {
    // Ensure any stray mapping is cleaned up
    delete global.voicePartners[socket.id];
  }

  // ===== USER INFO + COUNTS =====
  delete userInfo[socket.id];
  io.emit("online-count", io.engine.clientsCount);
  io.emit("online-users", io.engine.clientsCount);
});


  // =========================================================
  // 🎧 VOICE PAGE CODE (AUDIO-ONLY MATCHING LOGIC)
  // =========================================================

  // define globally for connection scope
  if (!global.voiceQueue) global.voiceQueue = [];
  if (!global.voicePartners) global.voicePartners = {};

  // when user presses Start on /voice page
  socket.on("join-voice", () => {
    console.log(`🎧 [VOICE] ${socket.id} joined voice queue`);

    // ensure not already queued
    global.voiceQueue = global.voiceQueue.filter((id) => id !== socket.id);

    // if another user waiting, pair them
    if (global.voiceQueue.length > 0) {
      const partnerId = global.voiceQueue.shift();
      global.voicePartners[socket.id] = partnerId;
      global.voicePartners[partnerId] = socket.id;

      io.to(socket.id).emit("paired-voice", { partnerId, initiator: true });
      io.to(partnerId).emit("paired-voice", { partnerId: socket.id, initiator: false });

      console.log(`✅ [VOICE] Paired ${socket.id} <--> ${partnerId}`);
    } else {
      // no one waiting — add to queue
      global.voiceQueue.push(socket.id);
      socket.emit("waiting");
      console.log(`🕓 [VOICE] ${socket.id} waiting for match`);
    }
  });

  // leave or stop voice call
  socket.on("leave-voice", () => {
  console.log(`🚪 [VOICE] ${socket.id} left voice`);

  // Remove from waiting queue
  global.voiceQueue = global.voiceQueue.filter((id) => id !== socket.id);

  // Notify and unpair partner if exists
  const partnerId = global.voicePartners[socket.id];
  if (partnerId) {
    io.to(partnerId).emit("partner-left-voice");
    delete global.voicePartners[partnerId];
    delete global.voicePartners[socket.id];
  }

  // Final cleanup — ensures this socket has no lingering pairing
  delete global.voicePartners[socket.id];
});


  // Next button: leave then instantly rejoin
  socket.on("next-voice", () => {
    console.log(`➡️ [VOICE] ${socket.id} requested next`);
    const partnerId = global.voicePartners[socket.id];
    if (partnerId) {
      io.to(partnerId).emit("partner-left-voice");
      delete global.voicePartners[partnerId];
      delete global.voicePartners[socket.id];
    }
    // rejoin matchmaking immediately
    socket.emit("leave-voice");
    setTimeout(() => socket.emit("join-voice"), 300);
  });

  // signaling
  socket.on("offer-voice", ({ to, sdp }) => {
    if (to) io.to(to).emit("offer-voice", { from: socket.id, sdp });
  });
  socket.on("answer-voice", ({ to, sdp }) => {
    if (to) io.to(to).emit("answer-voice", { from: socket.id, sdp });
  });
  socket.on("ice-candidate-voice", ({ to, candidate }) => {
    if (to) io.to(to).emit("ice-candidate-voice", { from: socket.id, candidate });
  });

  // chat messages
  socket.on("chat-message-voice", ({ to, text }) => {
    if (to) io.to(to).emit("chat-message-voice", { text });
  });

  // typing
  socket.on("typing-voice", ({ to }) => {
    if (to) io.to(to).emit("typing-voice");
  });

  // report
  socket.on("report-voice", ({ partnerId }) => {
    console.log(`🚫 [VOICE] ${socket.id} reported ${partnerId}`);
    io.to(partnerId).emit("reported-voice");
  });
  
    // 🛰️ Fallback: Socket-based Express relay for audio
socket.on("fallback-express-relay", ({ partnerId }) => {
  console.log(`⚠️ Express relay fallback between ${socket.id} and ${partnerId}`);
  io.to(partnerId).emit("express-relay-start", { from: socket.id });
});

 

  // =========================================================
  // 🎧 END OF VOICE PAGE CODE
  // =========================================================
}); // ✅ closes io.on('connection', socket => { ... })


if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../client/build')));
  app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '../../client/build', 'index.html'))
  );
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
