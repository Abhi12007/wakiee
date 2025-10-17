// Voice.js
import React, { useEffect, useRef, useState } from "react";
import "./Voice.css";
import io from "socket.io-client";
import useBanSystem from "./hooks/useBanSystem"; // ✅ reuse your existing hook

const socket = io(); // reuse same socket connection

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

  // 🔹 Setup Ban/Report System
  useBanSystem(socket, { setStatus, cleanupCall: handleStop });

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
      ctx.strokeStyle = "#3bc1ff";
      ctx.beginPath();
      let sliceWidth = (canvas.width * 1.0) / bufferLength;
      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        let v = dataArray[i] / 128.0;
        let y = (v * canvas.height) / 2;
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
    handleStop();
    startMatching();
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    socket.emit("chat-message-voice", { to: partnerId, text: input });
    setMessages((prev) => [...prev, { text: input, self: true }]);
    setInput("");
  };

  return (
    <div className="voice-container">
      <header>
        <div className="logo">wakiee</div>
        <div className="online-count">Online: {onlineCount}</div>
      </header>

      <h2>Audio Matching</h2>
      <canvas ref={canvasRef} width="400" height="100" className="waveform" />

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
