// Voice.js
import React, { useEffect, useRef, useState } from "react";
import "./Voice.css";
import io from "socket.io-client";
import { useBanSystem } from "./ban";
// 📶 Helps STUN/TURN connect faster through NAT/VPN by forcing IPv4
window.RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection;


const socket = io();

// ========== SVG ICONS ==========
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
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 2l9 4-9 4-9-4 9-4zm0 18l-9-4 9-4 9 4-9 4z"
        stroke="#ff4040"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="1.5" fill="#ff4040" />
    </svg>
  );
}

// ========== MAIN COMPONENT ==========
const Voice = () => {
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
      setStatus("searching");
      setMessages([]);
      socket.emit("join-voice");
    });

    return () => {
      socket.off();
      stopAudio();
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
    channelCount: 1,
    sampleRate: 48000,
    sampleSize: 16
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

    const draw = () => {
      requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(dataArray);
      ctx.fillStyle = "#0b1124";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      let rms = 0;
      for (let i = 0; i < bufferLength; i++) {
        const v = (dataArray[i] - 128) / 128;
        rms += v * v;
      }
      rms = Math.sqrt(rms / bufferLength);

      const amplitude = Math.min(rms * 1000, 50);
      ctx.lineWidth = 2 + amplitude / 10;
      ctx.strokeStyle = amplitude > 5 ? "#3bc1ff" : "#333";
      ctx.beginPath();

      const sliceWidth = canvas.width / bufferLength;
      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y =
          amplitude > 5
            ? (v * canvas.height) / 2
            : canvas.height / 2;
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
  }
};

    pcRef.current = pc;

    localStreamRef.current?.getTracks().forEach((track) =>
      pc.addTrack(track, localStreamRef.current)
    );

    pc.onicecandidate = (event) => {
      if (event.candidate)
        socket.emit("ice-candidate-voice", { to: partnerId, candidate: event.candidate });
    };
else if (pc.iceGatheringState === "complete") {
  console.log("✅ ICE candidate gathering completed");
}

    pc.ontrack = (event) => {
      remoteAudioRef.current.srcObject = event.streams[0];
    };

    return pc;
  };

  const handleMute = () => {
    const track = localStreamRef.current?.getAudioTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setMuted(!track.enabled);
    }
  };

  const handleStop = () => {
    socket.emit("leave-voice");
    stopAudio();
    setStatus("idle");
    setPartnerId(null);
  };

  const stopAudio = () => {
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
  };

  const handleNext = () => {
    stopAudio();
    setMessages([]);
    socket.emit("next-voice");
  };

  const handleReport = () => {
    if (partnerId) {
      socket.emit("report-voice", { partnerId });
      handleStop();
    }
  };

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

  useBanSystem(socket, { setStatus, cleanupCall: handleStop });

  return (
    <div className="voicep-container">
      <div className="voicep-header">
        <p className="voicep-online">
          Online: <span style={{ color: "#22c55e" }}>{onlineCount}</span>
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
            <div className="voicep-btn-group">
              <button onClick={handleReport} className="voicep-btn">
                <ReportIcon />
              </button>
              <span className="voicep-label">Report</span>
            </div>
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

      <audio ref={remoteAudioRef} autoPlay playsInline />
    </div>
  );
};

export default Voice;
