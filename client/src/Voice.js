// Voice.js
import React, { useEffect, useRef, useState } from "react";
import "./Voice.css";
import io from "socket.io-client";
import useBanSystem from "./ban"; // reuse your moderation system

const socket = io(); // same socket as other pages

const Voice = () => {
  const [status, setStatus] = useState("idle"); // idle, searching, connected
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

  // Ban/report system hook
  useBanSystem(socket, { setStatus, cleanupCall: handleStop });

  // ✅ Setup socket listeners
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
    });

    // ✅ Auto-rematch when partner leaves
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
      ctx.strokeStyle = status === "connected" ? "#3bc1ff" : "#444";
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
    socket.emit("next-voice");
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    socket.emit("chat-message-voice", { to: partnerId, text: input });
    setMessages((prev) => [...prev, { text: input, self: true }]);
    setInput("");
  };

  // =========================================================
  // 🎨 UI
  // =========================================================

  return (
    <div className="voice-container">
      {/* ✅ NAVBAR */}
      <nav className="navbar">
        <div className="nav-left">wakiee</div>
        <div className="nav-links">
          <a href="/">Home</a>
          <a href="/voice">Voice</a>
          <a href="/video">Video</a>
          <a href="/about">About</a>
          <a href="/blog">Blog</a>
          <a href="/contact">Contact</a>
        </div>
      </nav>

      {/* ✅ HEADER */}
      <div className="voice-header">
        <h2>Audio Matching</h2>
        <p className="online">Online: {onlineCount}</p>
        <p className="status-text">
          {status === "idle"
            ? "Press Start to find someone"
            : status === "searching"
            ? "Searching..."
            : "Connected"}
        </p>
      </div>

      {/* ✅ WAVEFORM */}
      <canvas ref={canvasRef} width="400" height="100" className="waveform" />

      {/* ✅ CONTROLS */}
      <div className="controls">
        {status === "idle" && <button onClick={startMatching}>Start</button>}
        {status !== "idle" && (
          <>
            <button onClick={handleMute}>{muted ? "Unmute" : "Mute"}</button>
            <button onClick={handleNext}>Next</button>
            <button onClick={handleStop}>Stop</button>
          </>
        )}
      </div>

      {/* ✅ CHAT SECTION */}
      <div className="chat-section">
        <div className="chat-window">
          {messages.map((m, i) => (
            <div key={i} className={m.self ? "chat-bubble self" : "chat-bubble"}>
              {m.text}
            </div>
          ))}
        </div>
        <div className="chat-input">
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
