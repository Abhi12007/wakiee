import React, { useEffect, useRef, useState } from "react";
import "./Voice.css";
import io from "socket.io-client";
import { useBanSystem } from "./ban";

const socket = io();

// ====================== SVG ICONS ======================
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

// ====================== MAIN COMPONENT ======================

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

  // ✅ Socket Listeners (Logic unchanged)
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
      if (candidate && pcRef.current) {
        pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
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

    socket.on("partner-left-voice", () => {
      setStatus("searching");
      socket.emit("join-voice");
    });

    return () => {
      socket.off();
      stopAudio();
    };
  }, []);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (chatWindowRef.current) {
        chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
      }
    }, 100);
  };

  // =========================================================
  // 🔊 FUNCTIONS (unchanged, only waveform improved)
  // =========================================================

  const startMatching = async () => {
    await startAudio();
    socket.emit("join-voice");
    setStatus("searching");
  };

  const startAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
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
    analyser.fftSize = 1024;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    source.connect(analyser);
    analyserRef.current = analyser;

    const draw = () => {
      requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(dataArray);

      const avg =
        dataArray.reduce((a, b) => a + Math.abs(b - 128), 0) / bufferLength;
      const pulse = Math.min(avg / 20, 1); // 0–1 pulse intensity

      ctx.fillStyle = "#0b1124";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.lineWidth = 2 + pulse * 2;
      ctx.strokeStyle =
        status === "connected"
          ? pulse > 0.2
            ? `rgba(59,193,255,${0.8 + pulse * 0.2})`
            : "#333"
          : "#333";

      ctx.beginPath();
      const sliceWidth = canvas.width / bufferLength;
      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y =
          pulse > 0.2
            ? (v * canvas.height) / 2
            : canvas.height / 2; // flat line when no voice
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
    const pc = new RTCPeerConnection();
    pcRef.current = pc;

    localStreamRef.current?.getTracks().forEach((track) => {
      pc.addTrack(track, localStreamRef.current);
    });

    pc.onicecandidate = (event) => {
      if (event.candidate)
        socket.emit("ice-candidate-voice", { to: partnerId, candidate: event.candidate });
    };

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
    setStatus("searching");
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    socket.emit("chat-message-voice", { to: partnerId, text: input });
    setMessages((prev) => [...prev, { text: input, self: true }]);
    setInput("");
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
          </>
        )}
      </div>

      <div className="voicep-chat-section">
        <div className="voicep-chat-window" ref={chatWindowRef}>
          {messages.length === 0 ? null : messages.map((m, i) => (
            <div key={i} className={`voicep-chat-bubble ${m.self ? "voicep-self" : ""}`}>
              {m.text}
            </div>
          ))}
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
