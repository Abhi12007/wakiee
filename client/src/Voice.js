// Voice.js
import React, { useEffect, useRef, useState } from "react";
import "./Voice.css";
import io from "socket.io-client";

 // import { useBanSystem } from "./ban"; 


// 📶 Helps STUN/TURN connect faster through NAT/VPN by forcing IPv4
window.RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection;



// ========== SVG  ICONS ==========
function MicIcon({ active }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <g
        stroke={active ? "#ffffff" : "#ffffff"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3z" />
        <path d="M19 11v1a7 7 0 0 1-14 0v-1" />
        <path d="M12 19v3" />
      </g>
      {!active && (
        <line
          x1="4"
          y1="20"
          x2="20"
          y2="4"
          stroke="#ff4040"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

function NextIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <g
        stroke="#1e3a8a"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        <path d="M5 19V5l14 7-14 7z" />
      </g>
    </svg>
  );
}

function StopIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <g stroke="none" strokeWidth="0" fill="#ff5252">
        <rect x="5.5" y="5.5" width="13" height="13" rx="2" />
      </g>
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <g
        stroke="#22c55e"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        <path d="M5 3l14 9-14 9V3z" />
      </g>
    </svg>
  );
}

function ReportIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 2L1 21h22L12 2z"
        stroke="#facc15"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <line
        x1="12"
        y1="8"
        x2="12"
        y2="13"
        stroke="#facc15"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="12" cy="17" r="1.2" fill="#facc15" />
    </svg>
  );
}


// ========== MAIN COMPONENT ==========
const Voice = ({ endCall }) => {
    const [socket] = useState(() => io());

  const [status, setStatus] = useState("idle");
  const [muted, setMuted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [partnerId, setPartnerId] = useState(null);
  const [onlineCount, setOnlineCount] = useState(0);
  const [typing, setTyping] = useState(false);

  const pcRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const canvasRef = useRef(null);
  const analyserRef = useRef(null);
  const chatWindowRef = useRef(null);

  // ✅ Socket Listeners
  useEffect(() => {
    socket.on("online-count", (count) => setOnlineCount(count));
    socket.on("waiting", () => setStatus("searching"));
    socket.on("paired-voice", async ({ partnerId, initiator }) => {
      setStatus("connected");
      setPartnerId(partnerId);

      if (initiator) {
        const pc = createPeerConnection(partnerId);
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit("offer-voice", { to: partnerId, sdp: offer });
      }
    });

    socket.on("offer-voice", async ({ from, sdp }) => {
      const pc = createPeerConnection(from);
      await pc.setRemoteDescription(new RTCSessionDescription(sdp));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit("answer-voice", { to: from, sdp: answer });
    });

    socket.on("answer-voice", async ({ sdp }) => {
      await pcRef.current?.setRemoteDescription(new RTCSessionDescription(sdp));
    });

    socket.on("ice-candidate-voice", ({ candidate }) => {
      if (candidate && pcRef.current)
        pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
    });

    socket.on("chat-message-voice", (msg) => {
      setMessages((prev) => [...prev, msg]);
      scrollToBottom();
    });

    socket.on("typing-voice", () => {
      setTyping(true);
      setTimeout(() => setTyping(false), 2000);
      scrollToBottom();
    });

    // Partner leaves → immediately search again
   socket.on("partner-left-voice", () => {
  console.log("👋 Partner disconnected, rejoining queue...");
  setMessages([]); // 🧹 Clear messages
  stopAudio();
  setPartnerId(null);
  setStatus("searching");

  // Rejoin queue after a short delay to prevent race conditions
  setTimeout(() => {
    socket.emit("join-voice");
  }, 1500);  //1.5 sec delay
});


    return () => {
      socket.off();
      stopAudio();
    };
  }, []);
 
 {/*// ✅ Rejoin voice queue safely after returning to /voice
  useEffect(() => {
    const timer = setTimeout(() => {
      if (socket && socket.connected) {
        console.log("🔄 Rejoining voice queue after delay..."); //automatic rejoin  once in voice page after navigating
        socket.emit("join-voice");
      }
    }, 400); // Wait 400ms to ensure server cleanup

    return () => clearTimeout(timer);
  }, []);*/}

 // ✅ Disconnect & cleanup if component unmounts or user navigates away
 useEffect(() => {
  return async () => {
    console.log("🔴 Voice component unmounted — cleaning up call");

    try {
      // 1️⃣ Send leave event to server
      socket.emit("leave-voice");
      console.log("📤 Sent leave-voice signal");

      // 2️⃣ Give time for it to actually reach server
      await new Promise((r) => setTimeout(r, 100));

      // 3️⃣ Disconnect socket gracefully (optional, but ensures no ghost events)
      socket.disconnect();

      // 4️⃣ Stop local tracks
      localStreamRef.current?.getTracks().forEach((t) => t.stop());

      // 5️⃣ Close peer connection
      if (pcRef.current) {
        pcRef.current.close();
        pcRef.current = null;
      }

      console.log("✅ Voice cleanup complete");
    } catch (err) {
      console.warn("⚠️ Error during voice cleanup:", err);
    }
  };
}, []);


  const scrollToBottom = () => {
    setTimeout(() => {
      if (chatWindowRef.current)
        chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }, 100);
  };

  // ✅ Logic Functions (UNCHANGED)
  const startMatching = async () => {
    await startAudio();
    socket.emit("join-voice");
    setStatus("searching");
  };

  const startAudio = async () => {
    try {
     // 🎧 High quality audio with echo cancellation and natural tone
const stream = await navigator.mediaDevices.getUserMedia({
  audio: {
    echoCancellation: true,
  noiseSuppression: true,
   autoGainControl: true,
   channelCount: 2, // stereo if available
   sampleRate: 48000,
   sampleSize: 16,
   latency: 0.005, // ultra-low latency
   googAudioMirroring: false,
   googHighpassFilter: true,
   googTypingNoiseDetection: false
  }
});


      localStreamRef.current = stream;
      visualizeAudio(stream);
    } catch (err) {
      console.error("Audio error:", err);
    }
  };

  const visualizeAudio = (stream) => {
  const canvas = canvasRef.current;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const audioContext = new AudioContext();
  const source = audioContext.createMediaStreamSource(stream);
  const analyser = audioContext.createAnalyser();
  analyser.fftSize = 512;

  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  source.connect(analyser);
  analyserRef.current = analyser;

  let smoothAmplitude = 0;

  const draw = () => {
    requestAnimationFrame(draw);
    analyser.getByteTimeDomainData(dataArray);

    // Background stays constant — no flicker
    ctx.fillStyle = "#0b1124";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Calculate RMS (volume)
    let rms = 0;
    for (let i = 0; i < bufferLength; i++) {
      const v = (dataArray[i] - 128) / 128;
      rms += v * v;
    }
    rms = Math.sqrt(rms / bufferLength);

    // Smooth out amplitude (no blinking)
    const targetAmplitude = Math.min(rms * 800, 40);
    smoothAmplitude += (targetAmplitude - smoothAmplitude) * 0.2; // smooth transition

    // Draw smooth waveform
    ctx.lineWidth = 0.8 + smoothAmplitude / 25; // thin waveform
    ctx.strokeStyle = "#3bc1ff"; // static color, no flicker
    ctx.beginPath();

    const sliceWidth = canvas.width / bufferLength;
    let x = 0;
    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0;
      const y = (v * canvas.height) / 2;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
      x += sliceWidth;
    }
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
  };

  draw();
};

  

  const createPeerConnection = (partnerId) => {
   // 🌍 1️⃣ Multi-layer ICE Server Strategy: STUN → TURN → Express relay
const pc = new RTCPeerConnection({
  iceServers: [
    // ✅ Primary: Google STUN (fastest and public)
    { urls: "stun:stun.l.google.com:19302" },

    // ✅ Secondary: Your Coturn TURN server
    {
      urls: [
        "turn:yourdomain_or_ip:3478?transport=udp",
        "turn:yourdomain_or_ip:5349?transport=tcp"
      ],
      username: "wakiee", // 🔁 replace with your actual TURN username
      credential: "your_turn_password"
    },

    // ✅ Fallback: Express relay (simple signaling audio forwarding)
    {
      urls: "turn:wakiee-express-fallback",
      credential: "socket-relay",
      username: "wakiee-app"
    }
  ],
  iceTransportPolicy: "all"
});




    
// ⚡ Catch ICE failure and auto fallback
pc.oniceconnectionstatechange = () => {
  if (pc.iceConnectionState === "failed") {
    console.warn("⚠️ ICE connection failed, switching to Express relay fallback");
    socket.emit("fallback-express-relay", { partnerId });
  } else if (pc.iceConnectionState === "connected") {
    console.log("✅ ICE connection successful");
  }
};

// ✅ Log ICE candidate completion
pc.onicegatheringstatechange = () => {
  if (pc.iceGatheringState === "complete") {
    console.log("✅ ICE candidate gathering completed");
  }
};

pcRef.current = pc;



// 🧠 Monitor audio stats for adaptive quality
const monitorQuality = setInterval(async () => {
  if (!pcRef.current) return clearInterval(monitorQuality);
  const stats = await pcRef.current.getStats();
  stats.forEach((report) => {
    if (report.type === "outbound-rtp" && report.kind === "audio" && report.bytesSent) {
      const bitrate = (8 * report.bytesSent) / 1024; // kbps
      if (bitrate < 32) console.warn("🟥 Low audio bitrate detected");
      if (bitrate > 128) console.log("🟢 Excellent audio network");
    }
  });
}, 2000);


    
// ✅ Add local audio tracks
localStreamRef.current?.getTracks().forEach((track) =>
  pc.addTrack(track, localStreamRef.current)
);



// ✅ Apply custom audio bitrate for high-quality Opus encoding
setAudioBitrate(pc);

    


    
// ✅ Send ICE candidates
pc.onicecandidate = (event) => {
  if (event.candidate)
    socket.emit("ice-candidate-voice", { to: partnerId, candidate: event.candidate });
};



 // ✅ Remote audio pipeline
pc.ontrack = (event) => {
  const remoteStream = event.streams[0];
  remoteAudioRef.current.srcObject = remoteStream;

  // 🔊 Smooth playback with Web Audio API for better tone & auto volume leveling
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioCtx.createMediaStreamSource(remoteStream);
    const gainNode = audioCtx.createGain();
    gainNode.gain.value = 1.0; // base volume

    // 🎧 Auto volume leveling (compressor)
    const compressor = audioCtx.createDynamicsCompressor();
    compressor.threshold.value = -30;
    compressor.knee.value = 40;
    compressor.ratio.value = 12;
    compressor.attack.value = 0;
    compressor.release.value = 0.25;

    // ✅ Connect nodes: stream → compressor → gain → speakers
    source.connect(compressor).connect(gainNode).connect(audioCtx.destination);

    console.log("🎧 Audio pipeline initialized with dynamic compressor + gain");
  } catch (err) {
    console.warn("AudioContext playback setup failed:", err);
  }
};


    return pc;
  };

// 🎚️ Enhance outgoing audio encoding quality (Opus @ 64kbps)
const setAudioBitrate = (pc) => {
  pc.getSenders().forEach((sender) => {
    if (sender.track && sender.track.kind === "audio") {
      const parameters = sender.getParameters();
      if (!parameters.encodings) parameters.encodings = [{}];
      parameters.encodings[0].maxBitrate = 128000; // 128 kbps HD voice
      parameters.encodings[0].maxFramerate = 30;
      sender.setParameters(parameters).catch((err) => {
        console.warn("Failed to set audio bitrate:", err);
      });
    }
  });
};
  

  const handleMute = () => {
    const track = localStreamRef.current?.getAudioTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setMuted(!track.enabled);
    }
  };

  const handleStop = () => {
  // Notify server that this user left
  socket.emit("leave-voice");

  // 🔄 Reset UI and state
  stopAudio();
  setStatus("idle");
  setPartnerId(null);
  setMessages([]); // 🧹 Clear messages when call ends
};

  const stopAudio = () => {
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
  };

 const handleNext = () => {
  // 🔇 Stop audio and clear chat
  stopAudio();
  setMessages([]);

  // 🚪 Notify server to unpair both users
  socket.emit("leave-voice");

  // ⏳ Wait 1 second before rejoining queue
  setTimeout(() => {
    socket.emit("join-voice"); // Try to find a new partner
    setStatus("searching");
  }, 1000);
};

/*  const handleReport = () => {
  if (partnerId) {
    openReportModal(); // opens the red report modal from ban.js
  }
};  */


  const sendMessage = () => {
    if (!input.trim()) return;
    socket.emit("chat-message-voice", { to: partnerId, text: input });
    setMessages((prev) => [...prev, { text: input, self: true }]);
    setInput("");
    scrollToBottom();
  };

  const handleTyping = () => {
    socket.emit("typing-voice", { to: partnerId });
  };

/*  const {
  isBlocked,
  BlockedOverlay,
  ReportModal,
  openReportModal,
  closeReportModal,
  showReportModal,
} = useBanSystem(socket, { setStatus, cleanupCall: handleStop }); */


  return (
    <div className="voicep-container">
      <div className="voicep-header">
        <p className="voicep-online">
   {/*    Online: <span style={{ color: "#22c55e" }}>{onlineCount}</span>                                temporary off until lagre users come  */}
        </p>
        <p className="voicep-status">
          {status === "idle"
            ? "Press Start to find someone"
            : status === "searching"
            ? "Searching..."
            : "Connected"}
        </p>
      </div>

      <canvas ref={canvasRef} width="400" height="120" className="voicep-waveform" />

      <div className="voicep-controls">
        {status === "idle" ? (
          <div className="voicep-btn-group">
            <button onClick={startMatching} className="voicep-btn">
              <PlayIcon />
            </button>
            <span className="voicep-label">Start</span>
          </div>
        ) : (
          <>
            <div className="voicep-btn-group">
              <button onClick={handleMute} className="voicep-btn">
                <MicIcon active={!muted} />
              </button>
              <span className="voicep-label">{muted ? "Unmute" : "Mute"}</span>
            </div>
            <div className="voicep-btn-group">
              <button onClick={handleNext} className="voicep-btn">
                <NextIcon />
              </button>
              <span className="voicep-label">Next</span>
            </div>
             <div className="voicep-btn-group">
              <button onClick={handleStop} className="voicep-btn">
                <StopIcon />
              </button>
              <span className="voicep-label">Stop</span>
            </div>

   { /*   {status === "connected" && (
  <div className="voicep-btn-group">
    <button onClick={handleReport} className="voicep-btn report">
      <ReportIcon />
    </button>
    <span className="voicep-label">Report</span>
  </div>
)}                        */}

       

          </>
        )}
      </div>

      <div className="voicep-chat-section">
        <div className="voicep-chat-window" ref={chatWindowRef}>
          {messages.length === 0 ? (
            <div className="voicep-empty-chat"></div>
          ) : (
            messages.map((m, i) => (
              <div key={i} className={`voicep-chat-bubble ${m.self ? "voicep-self" : ""}`}>
                {m.text}
              </div>
            ))
          )}
          {typing && (
            <div className="voicep-typing-bubble">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          )}
        </div>
            <div className="voicep-chat-ring">
  <div className="voicep-chat-input">
    <input
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyDown={handleTyping}
      placeholder="Type a message..."
    />
    <button onClick={sendMessage}>Send</button>
  </div>
</div>


          
      </div>
      
       {/*                      {showReportModal && <ReportModal partnerId={partnerId} />}
                            <BlockedOverlay />               */}

      <audio ref={remoteAudioRef} autoPlay playsInline />
    </div>
  );
};

export default Voice;
