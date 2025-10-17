// Voice.js — Optimized WebRTC Audio Page with fallback STUN/TURN/Relay
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
      <g stroke="#00ff9d" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none">
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

  const pcRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const canvasRef = useRef(null);
  const analyserRef = useRef(null);

  // Ban/Report Hook
  useBanSystem(socket, { setStatus, cleanupCall: handleStop });

  // ✅ Socket event setup (unchanged)
  useEffect(() => {
    socket.on("online-count", (count) => setOnlineCount(count));
    socket.on("waiting", () => setStatus("searching"));
    socket.on("paired-voice", async ({ partnerId, initiator }) => {
      setStatus("connected");
      setPartnerId(partnerId);

      if (initiator) {
        const pc = await createPeerConnection(partnerId);
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit("offer-voice", { to: partnerId, sdp: offer });
      }
    });

    socket.on("offer-voice", async ({ from, sdp }) => {
      const pc = await createPeerConnection(from);
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

  // =========================================================
  // 🔊 FUNCTIONS
  // =========================================================

  const startMatching = async () => {
    await startAudio();
    socket.emit("join-voice");
    setStatus("searching");
  };

  // ✅ Optimized audio: no echo, best clarity
  const startAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1,
          sampleRate: 48000,
          sampleSize: 16,
          latency: 0,
        },
      });
      localStreamRef.current = stream;
      visualizeAudio(stream);
    } catch (err) {
      console.error("Audio error:", err);
    }
  };

  // ✅ Fallback-based PeerConnection
  const createPeerConnection = async (partnerId) => {
    // Start with fast STUN
    let config = {
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      iceTransportPolicy: "all",
    };

    let pc = new RTCPeerConnection(config);

    // If STUN fails → retry with TURN
    const setupTurnFallback = async () => {
      if (pc.iceConnectionState === "failed" || pc.connectionState === "failed") {
        console.warn("STUN failed, switching to TURN server...");
        pc.close();
        pc = new RTCPeerConnection({
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            {
              urls: "turn:yourdomain_or_ip:5349?transport=tcp",
              username: "wakiee",
              credential: "your_turn_password",
            },
          ],
          iceTransportPolicy: "relay",
        });
        attachTracksAndListeners(pc, partnerId);
      }
    };

    // Express relay fallback (pseudo TURN)
    const setupExpressFallback = async () => {
      if (pc.iceConnectionState === "failed") {
        console.warn("TURN failed, using relay via server socket...");
        socket.emit("relay-fallback", { partnerId });
      }
    };

    // Attach common listeners
    const attachTracksAndListeners = (pc, partnerId) => {
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

      pc.oniceconnectionstatechange = async () => {
        if (["failed", "disconnected"].includes(pc.iceConnectionState)) {
          await setupTurnFallback();
          await setupExpressFallback();
        }
      };
    };

    attachTracksAndListeners(pc, partnerId);
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
    socket.emit("next-voice");
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    socket.emit("chat-message-voice", { to: partnerId, text: input });
    setMessages((prev) => [...prev, { text: input, self: true }]);
    setInput("");
  };

  // ✅ Enhanced Wave Visualization
  const visualizeAudio = (stream) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    source.connect(analyser);
    analyserRef.current = analyser;

    const draw = () => {
      requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(dataArray);
      ctx.fillStyle = "#0b1124";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.lineWidth = 2;
      ctx.strokeStyle = status === "connected" ? "#3bc1ff" : "#333";
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

  // ✅ UI Rendering
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

      {/* Waveform */}
      <canvas ref={canvasRef} width="400" height="100" className="voicep-waveform" />

      {/* Controls */}
      <div className="voicep-controls">
        {status === "idle" && (
          <button onClick={startMatching} title="Start" className="voicep-btn">
            <PlayIcon />
          </button>
        )}
        {status !== "idle" && (
          <>
            <button onClick={handleMute} title="Mute / Unmute" className="voicep-btn">
              <MicIcon active={!muted} />
            </button>
            <button onClick={handleNext} title="Next" className="voicep-btn">
              <NextIcon />
            </button>
            <button onClick={handleStop} title="Stop" className="voicep-btn">
              <StopIcon />
            </button>
          </>
        )}
      </div>

      {/* Chat */}
      <div className="voicep-chat-section">
        <div className="voicep-chat-window">
          {messages.map((m, i) => (
            <div key={i} className={`voicep-chat-bubble ${m.self ? "voicep-self" : ""}`}>
              {m.text}
            </div>
          ))}
        </div>
        <div className="voicep-chat-input">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
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
