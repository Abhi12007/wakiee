// Voice.js — optimized with ban, thinner pulse, green chat ring, and delayed reconnect
import React, { useEffect, useRef, useState } from "react";
import "./Voice.css";
import io from "socket.io-client";
import { useBanSystem } from "./ban";

const socket = io();

// ICONS
function MicIcon({ active }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <g stroke={active ? "#ffffff" : "#ffffff"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3z" />
        <path d="M19 11v1a7 7 0 0 1-14 0v-1" />
        <path d="M12 19v3" />
      </g>
      {!active && <line x1="4" y1="20" x2="20" y2="4" stroke="#ff4040" strokeWidth="2.2" strokeLinecap="round" />}
    </svg>
  );
}

function NextIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <g stroke="#1e3a8a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none">
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

  // Ban hook (same as video)
  useBanSystem(socket, { setStatus, cleanupCall: handleStop });

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
      if (candidate && pcRef.current) pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
    });

    socket.on("chat-message-voice", (msg) => setMessages((p) => [...p, msg]));

    // partner leaves -> wait 1s before reconnect
    socket.on("partner-left-voice", () => {
      setStatus("searching");
      setMessages([]);
      setTimeout(() => socket.emit("join-voice"), 1000);
    });

    return () => {
      socket.off();
      stopAudio();
    };
  }, []);

  const startMatching = async () => {
    await startAudio();
    socket.emit("join-voice");
    setStatus("searching");
  };

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

  const createPeerConnection = async (partnerId) => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        {
          urls: "turn:yourdomain_or_ip:5349?transport=tcp",
          username: "wakiee",
          credential: "your_turn_password",
        },
      ],
    });

    pcRef.current = pc;

    localStreamRef.current?.getTracks().forEach((track) => pc.addTrack(track, localStreamRef.current));

    pc.onicecandidate = (e) => {
      if (e.candidate) socket.emit("ice-candidate-voice", { to: partnerId, candidate: e.candidate });
    };

    pc.ontrack = (e) => {
      remoteAudioRef.current.srcObject = e.streams[0];
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
    setMessages([]);
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
    setMessages([]);
  };

  const handleReport = () => {
    if (partnerId) {
      socket.emit("report-voice", { partnerId });
      alert("⚠️ User reported. They are banned for 60 seconds.");
    }
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    socket.emit("chat-message-voice", { to: partnerId, text: input });
    setMessages((p) => [...p, { text: input, self: true }]);
    setInput("");
  };

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
      ctx.lineWidth = 1.2; // thinner line
      ctx.strokeStyle = status === "connected" ? "#3bc1ff" : "#333";
      ctx.beginPath();
      const sliceWidth = canvas.width / bufferLength;
      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 4; // half pulse amplitude
        if (i === 0) ctx.moveTo(x, y + canvas.height / 2);
        else ctx.lineTo(x, y + canvas.height / 2);
        x += sliceWidth;
      }
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    };
    draw();
  };

  return (
    <div className="voicep-container">
      <div className="voicep-header">
        <p className="voicep-online">
          Online: <span style={{ color: "#22c55e" }}>{onlineCount}</span>
        </p>
        <p className="voicep-status">
          {status === "idle" ? "Press Start to find someone" : status === "searching" ? "Searching..." : "Connected"}
        </p>
      </div>

      <canvas ref={canvasRef} width="400" height="100" className="voicep-waveform" />

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
            <button onClick={handleReport} title="Report" className="voicep-btn voicep-report-btn">
              ⚠️
            </button>
          </>
        )}
      </div>

      <div className="voicep-chat-section">
        <div className="voicep-chat-window">
          {messages.map((m, i) => (
            <div key={i} className={`voicep-chat-bubble ${m.self ? "voicep-self" : ""}`}>
              {m.text}
            </div>
          ))}
        </div>
        <div className="voicep-chat-input voicep-chat-ring">
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message..." />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>

      <audio ref={remoteAudioRef} autoPlay playsInline />
    </div>
  );
};

export default Voice;
