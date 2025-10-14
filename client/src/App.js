import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import React, { useEffect, useRef, useState, lazy, Suspense } from "react";
import io from "socket.io-client";
const About = lazy(() => import("./About"));
const Contact = lazy(() => import("./Contact"));
const Privacy = lazy(() => import("./Privacy"));
const Terms = lazy(() => import("./Terms"));
const Guidelines = lazy(() => import("./Guidelines"));
const BlogIndex = lazy(() => import("./blog/BlogIndex"));
const BlogPost = lazy(() => import("./blog/BlogPost"));
import "./App.css";
import OnboardingModal from "./OnboardingModal";

import img10 from "./blog/pictures/10.webp";
import img14 from "./blog/pictures/14.webp";
import img16 from "./blog/pictures/16.webp";
import img4 from "./blog/pictures/4.webp";
import { useBanSystem } from "./ban";





const socket = io(); // assumes same origin

/* ---------- NavBar Component ---------- */
function NavBar({ joined }) {
  const navigate = useNavigate();
  const location = useLocation();

  

// End call if user leaves the video page  not working when user presses back arrow in laptop
useEffect(() => {
  if (joined && location.pathname !== "/") {
    endCall();
  }
}, [location]);

const endCall = () => {
  try {
    // Stop local video/audio
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }

    // Tell server
    socket.emit("leave");

    // Reset state
    setJoined(false);
    setPartnerInfo(null);
    setStatus("idle");
  } catch (err) {
    console.error("Error ending call:", err);
  }
};





  const showBack = location.pathname !== "/" && !joined;

  return ( 
    <header className="landing-header-nav">
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        {/* Left Side: Wakiee Logo */}
        <div className="wakiee-logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
          <h1 className="wakiee-text">wakiee</h1>
        </div>

        {/*  Right Side: Navigation Links */}
        <div style={{ display: "flex", alignItems: "center",marginLeft: "80px", gap: "14px" }}>
          {showBack && (
           

            <button
              onClick={() => navigate("/")}
              style={{
                background: "transparent",
                border: "none",
                color: "white",
                fontSize: "25px",
                cursor: "pointer",
              }}
              title="Go Back"
            >
              ⬅
            </button>
          )}
        {!joined ? (
          <>
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact Us</Link>
            <Link to="/blog">Blog</Link>
          </>
        ) : (
          <>
            <Link to="/">Home</Link>
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact Us</Link>
            <Link to="/blog">Blog</Link>
          </>
        )}
</div>
      </nav>
    </header>
  );
}



/* ---------- SVG Icons ---------- */
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

function CameraIcon({ active }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <g stroke={active ? "#ffffff" : "#ffffff"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <rect x="3.5" y="6" width="13" height="9" rx="2" />
        <path d="M17.5 8l4-2v11l-4-2" />
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

function ReloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M20 8v6h-6" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 12a8 8 0 0114-5.3L20 8" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}




// Utility: detect mobile screen    use when needed   const isMobile = window.innerWidth <= 768;




/* ---------- App ---------- */
export default function App() {   useEffect(() => {
    // ✅ Basic SEO setup for homepage
    document.title = "Wakiee — Random Video Chat | Meet, Learn & Talk Online";

    const setMeta = (name, content) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", name);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    setMeta(
      "description",
      "Join Wakiee — free random video chat to meet strangers, share ideas, and connect globally in a fun, safe space."
    );

    setMeta(
      "keywords",
      "random video chat, anonymous video call, talk to strangers, omegle alternative,chathub,omegle,uhmegle,ometv, meet new people, wakiee live, random webcam chat"
    );

    // ✅ Canonical
    let canonical = document.querySelector("link[rel='canonical']");
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", "https://wakiee.live/");

    // ✅ Structured Data (minimal)
    const ld = document.createElement("script");
    ld.type = "application/ld+json";
    ld.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Wakiee",
      "url": "https://wakiee.live",
      "description":
        "Wakiee connects people through random video chat to talk, learn, and exchange ideas safely.",
    });
    document.head.appendChild(ld);
  }, []);

   
  // Reporting / Block removed ,now inside ban.js
 

  // Onboarding
const [showOnboarding, setShowOnboarding] = useState(false);
const [onboardingSeen, setOnboardingSeen] = useState(
  localStorage.getItem("onboardingSeen") === "true"
);

  
  // Refs
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pcRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteContainerRef = useRef(null);
  

  // App state
  const [name, setName] = useState("");
  const [gender, setGender] = useState("male");
  const [joined, setJoined] = useState(false);
  const [status, setStatus] = useState("init"); // init | searching | waiting | paired | in-call
  const [partnerId, setPartnerId] = useState(null);
  const [partnerInfo, setPartnerInfo] = useState(null);
  const [onlineCount, setOnlineCount] = useState(0);



 function cleanupCall(stopCamera = false) {
    if (pcRef.current) {
      try { pcRef.current.close(); } catch {}
      pcRef.current = null;
    }
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;

    if (stopCamera && localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
      if (localVideoRef.current) localVideoRef.current.srcObject = null;
    } else if (localStreamRef.current && localVideoRef.current) {
      localVideoRef.current.srcObject = localStreamRef.current;
    }
    setMessages([]);
  }
  

  

  // 🚫 Ban / Report System Hook
const {
  isBlocked,
  blockCountdown,
  blockedUsers,
  showReportModal,
  openReportModal,
  closeReportModal,
  submitReport,
  BlockedOverlay,
  ReportModal,
} = useBanSystem(socket, { name, gender, setStatus, cleanupCall });
  

  // chat
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typingIndicator, setTypingIndicator] = useState("");

  // controls
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  // stored prefs for Next (persist while app open)
  const storedPrefsRef = useRef({ micOn: true, camOn: true, localPos: null });

  // draggable preview
  const localSize = { w: 120, h: 80 };
  const [localPos, setLocalPos] = useState({ x: null, y: null });
  const draggingRef = useRef(false);
  const dragStartRef = useRef({ sx: 0, sy: 0, lx: 0, ly: 0 });

  const chatWindowRef = useRef(null);

  /* ---------- Socket listeners ---------- */
  useEffect(() => {
    socket.on("online-count", (c) => setOnlineCount(c));
    socket.on("online-users", (c) => setOnlineCount(c));

    socket.on("waiting", () => setStatus("waiting"));

    socket.on("paired", async ({ partnerId, initiator, partnerInfo }) => {
      setPartnerId(partnerId);
      setPartnerInfo(partnerInfo || { name: "Stranger", gender: "other" });
      setStatus("paired");
      await startLocalStream();
      applyStoredPrefsToTracks();
      await createPeerConnection(partnerId, initiator);
    });

    socket.on("offer", async ({ from, sdp }) => {
      await startLocalStream();
      applyStoredPrefsToTracks();
      await createPeerConnection(from, false, sdp);
    });

    socket.on("answer", async ({ from, sdp }) => {
      if (pcRef.current) {
        await pcRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
        setStatus("in-call");
      }
    });

    socket.on("ice-candidate", async ({ from, candidate }) => {
      if (candidate && pcRef.current) await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
    });

    socket.on("chat-message", ({ fromName, message }) => {
      setTypingIndicator("");
      setMessages((prev) => [...prev, { from: fromName || "Stranger", message, mine: false }]);
    });

    socket.on("typing", ({ fromName }) => {
      setTypingIndicator(`${fromName || "Stranger"} is typing...`);
      setTimeout(() => setTypingIndicator(""), 1600);
    });

    socket.on("partner-left", () => {
      cleanupCall(false);
      setPartnerId(null);
      setPartnerInfo(null);
      setStatus("waiting");
      if (name && gender) socket.emit("join", { name, gender });
    });
       // ⬇️ Step 5: handle when THIS user is reported removed now inside ban.js
   

    return () => socket.removeAllListeners();
  }, [name, gender]);

  useEffect(() => {
    if (chatWindowRef.current) chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
  }, [messages, typingIndicator]);

  /* ---------- local preview default position (top-right) ---------- */
  useEffect(() => {
    function setDefault() {
      const cont = remoteContainerRef.current;
      if (!cont) return;
      const rect = cont.getBoundingClientRect();
      const x = rect.width - localSize.w - 16;
      const y = 16;
      const stored = storedPrefsRef.current.localPos;
      if (stored) setLocalPos(stored);
      else setLocalPos({ x, y });
    }
    const t = setTimeout(setDefault, 200);
    window.addEventListener("resize", setDefault);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", setDefault);
    };
  }, []);

  /* ---------- Media & Peer ---------- */
  async function startLocalStream(forceEnable = false) {
  if (localStreamRef.current) {
    if (forceEnable) {
      localStreamRef.current.getTracks().forEach((t) => (t.enabled = true));
      setMicOn(true);
      setCamOn(true);
    }
    return localStreamRef.current;
  }

  try {
    // 📸 Step 1: Smart getUserMedia — pick best possible quality automatically
    const supported = navigator.mediaDevices.getSupportedConstraints();
    const videoConstraints = {
      width: { ideal: supported.width ? 1920 : 1280 }, // try Full HD if supported
      height: { ideal: supported.height ? 1080 : 720 },
      frameRate: { ideal: 30, max: 30 },
    };

    const audioConstraints = {
      channelCount: 2,
      sampleRate: 48000,
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
    };

    const s = await navigator.mediaDevices.getUserMedia({
      video: videoConstraints,
      audio: audioConstraints,
    });

    // 🔊 Step 2: Respect your mic/cam toggle states
    s.getAudioTracks().forEach((t) => (t.enabled = micOn));
    s.getVideoTracks().forEach((t) => (t.enabled = camOn));

    // 🖥 Step 3: Show local preview
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = s;
      localVideoRef.current.muted = true;
      await localVideoRef.current.play().catch(() => {});
    }

    localStreamRef.current = s;
    return s;
  } catch (err) {
    console.error("getUserMedia failed", err);
    alert("Camera or microphone access denied. Please allow permissions.");
    throw err;
  }
}


  function applyStoredPrefsToTracks() {
    if (!localStreamRef.current) return;
    const { micOn: storedMic, camOn: storedCam } = storedPrefsRef.current;
    if (typeof storedMic === "boolean") {
      localStreamRef.current.getAudioTracks().forEach((t) => (t.enabled = storedMic));
      setMicOn(storedMic);
    }
    if (typeof storedCam === "boolean") {
      localStreamRef.current.getVideoTracks().forEach((t) => (t.enabled = storedCam));
      setCamOn(storedCam);
    }
    if (storedPrefsRef.current.localPos) setLocalPos(storedPrefsRef.current.localPos);
  }

 async function createPeerConnection(partnerSocketId, initiator = false, remoteOffer = null) {
  if (pcRef.current) {
    try { pcRef.current.close(); } catch {}
    pcRef.current = null;
  }

  // 🌍 Step 1: Create PeerConnection with TURN/STUN servers
  const pc = new RTCPeerConnection({
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      {
        urls: "turn:relay1.expressturn.com:3478",
        username: "000000002074682235",
        credential: "tN/jre4jo0Rpoi0z5MXgby3QAqo=",
      },
    ],
  });
  pcRef.current = pc;

  // 🎥 Step 2: Handle remote video
  pc.ontrack = (e) => {
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = e.streams[0];
      remoteVideoRef.current.muted = false;
      remoteVideoRef.current.play().catch(() => {});
    }
  };

  pc.onicecandidate = (e) => {
    if (e.candidate) socket.emit("ice-candidate", { to: partnerSocketId, candidate: e.candidate });
  };

  // 🔊 Step 3: Add local media tracks
  const localStream = await startLocalStream();
  localStream.getTracks().forEach((t) => pc.addTrack(t, localStream));

  // 🧠 Step 4: Adaptive quality based on network stats
  const monitorQuality = setInterval(async () => {
    if (!pcRef.current) return clearInterval(monitorQuality);

    const stats = await pcRef.current.getStats();
    let outbound = null;
    stats.forEach((report) => {
      if (report.type === "outbound-rtp" && report.kind === "video") outbound = report;
    });

    if (outbound && outbound.bytesSent && outbound.framesEncoded) {
      const bitrate = (8 * outbound.bytesSent) / 1024; // kbps
      // auto adjust resolution or bitrate based on network
      if (bitrate < 500) {
        // 🟥 Poor connection → reduce video quality
        localStream.getVideoTracks().forEach((track) => track.applyConstraints({
          width: { ideal: 640 },
          height: { ideal: 360 },
        }));
      } else if (bitrate > 1000) {
        // 🟢 Strong connection → boost to 1080p if available
        localStream.getVideoTracks().forEach((track) => track.applyConstraints({
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        }));
      } else {
        // ⚪ Medium → keep at 720p
        localStream.getVideoTracks().forEach((track) => track.applyConstraints({
          width: { ideal: 1280 },
          height: { ideal: 720 },
        }));
      }
    }
  }, 2000); // check every 2 seconds

  // 🎧 Step 5: Optimize audio (Opus)
  pc.getSenders().forEach((sender) => {
    if (sender.track && sender.track.kind === "audio") {
      const params = sender.getParameters();
      if (!params.encodings) params.encodings = [{}];
      params.encodings[0].maxBitrate = 128000; // up to 128kbps HD voice
      sender.setParameters(params).catch(() => {});
    }
  });

  // 🎬 Step 6: Create offer / answer
  if (initiator) {
    let offer = await pc.createOffer();
    offer.sdp = offer.sdp.replace("VP8", "H264"); // or "VP9" if both sides Chrome
    await pc.setLocalDescription(offer);
    socket.emit("offer", { to: partnerSocketId, sdp: pc.localDescription });
  } else if (remoteOffer) {
    await pc.setRemoteDescription(new RTCSessionDescription(remoteOffer));
    let answer = await pc.createAnswer();
    answer.sdp = answer.sdp.replace("VP8", "H264");
    await pc.setLocalDescription(answer);
    socket.emit("answer", { to: partnerSocketId, sdp: pc.localDescription });
  }
}


 

  /* ---------- Actions ---------- */
  async function handleConnect() {
    // initial connect: force mic & camera ON
    setMicOn(true);
    setCamOn(true);
    storedPrefsRef.current.micOn = true;
    storedPrefsRef.current.camOn = true;

    await startLocalStream(true);

    // default top-right
    const cont = remoteContainerRef.current;
    if (cont) {
      const rect = cont.getBoundingClientRect();
      const pos = { x: rect.width - localSize.w - 16, y: 16 };
      storedPrefsRef.current.localPos = pos;
      setLocalPos(pos);
    }

    socket.emit("join", { name, gender });
    setJoined(true);
    setStatus("searching");
  }

  function handleNext() {
    storedPrefsRef.current.micOn = micOn;
    storedPrefsRef.current.camOn = camOn;
    storedPrefsRef.current.localPos = localPos;
    if (partnerId) socket.emit("leave");
    cleanupCall(false);
    setPartnerId(null);
    setPartnerInfo(null);
    socket.emit("join", { name, gender });
    setStatus("searching");
  }

  function handleStop() {
    if (partnerId) socket.emit("leave");
    cleanupCall(true);
    storedPrefsRef.current = { micOn: true, camOn: true, localPos: null };
    setMicOn(true); setCamOn(true); setLocalPos({ x: null, y: null });
    setName(""); setGender("male"); setJoined(false); setPartnerId(null); setPartnerInfo(null); setStatus("init");
    socket.emit("leave");
  }

  function toggleMic() {
    const s = localStreamRef.current;
    if (!s) {
      storedPrefsRef.current.micOn = !micOn;
      setMicOn(!micOn);
      return;
    }
    const tracks = s.getAudioTracks();
    if (tracks.length === 0) return;
    const willEnable = !tracks[0].enabled;
    tracks.forEach((t) => (t.enabled = willEnable));
    setMicOn(willEnable);
    storedPrefsRef.current.micOn = willEnable;
  }

  function toggleCam() {
    const s = localStreamRef.current;
    if (!s) {
      storedPrefsRef.current.camOn = !camOn;
      setCamOn(!camOn);
      return;
    }
    const tracks = s.getVideoTracks();
    if (tracks.length === 0) return;
    const willEnable = !tracks[0].enabled;
    tracks.forEach((t) => (t.enabled = willEnable));
    setCamOn(willEnable);
    storedPrefsRef.current.camOn = willEnable;
  }

  // reload local stream: reacquire and replace tracks on the current pc
  async function reloadLocalStream() {
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      newStream.getAudioTracks().forEach((t) => (t.enabled = storedPrefsRef.current.micOn ?? true));
      newStream.getVideoTracks().forEach((t) => (t.enabled = storedPrefsRef.current.camOn ?? true));

      // update preview
      localStreamRef.current = newStream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = newStream;
        localVideoRef.current.muted = true;
        await localVideoRef.current.play().catch(() => {});
      }

      // replace tracks on existing RTCPeerConnection
      if (pcRef.current) {
        const senders = pcRef.current.getSenders();
        const audioTrack = newStream.getAudioTracks()[0];
        const videoTrack = newStream.getVideoTracks()[0];

        const audioSender = senders.find((s) => s.track && s.track.kind === "audio");
        const videoSender = senders.find((s) => s.track && s.track.kind === "video");

        if (audioSender && audioTrack) await audioSender.replaceTrack(audioTrack);
        else if (audioTrack) pcRef.current.addTrack(audioTrack, newStream);

        if (videoSender && videoTrack) await videoSender.replaceTrack(videoTrack);
        else if (videoTrack) pcRef.current.addTrack(videoTrack, newStream);
      }

      setMicOn(newStream.getAudioTracks().some((t) => t.enabled));
      setCamOn(newStream.getVideoTracks().some((t) => t.enabled));
      storedPrefsRef.current.micOn = micOn;
      storedPrefsRef.current.camOn = camOn;
    } catch (err) {
      console.error("reloadLocalStream error", err);
      alert("Unable to access camera/microphone. Check browser permissions.");
    }
  }

  /* ---------- Chat ---------- */
  function sendChat() {
    if (!input.trim()) return;
    if (partnerId) {
      socket.emit("chat-message", { to: partnerId, message: input });
      setMessages((prev) => [...prev, { from: "Me", message: input, mine: true }]);
      setInput("");
    }
  }
  function handleTyping(e) {
    setInput(e.target.value);
    if (partnerId) socket.emit("typing", { to: partnerId, fromName: name });
  }

  /* ---------- Drag handlers for local preview ---------- */
  function onLocalPointerDown(e) {
    e.preventDefault();
    draggingRef.current = true;
    const container = remoteContainerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const startX = (e.clientX ?? e.touches?.[0]?.clientX) - rect.left;
    const startY = (e.clientY ?? e.touches?.[0]?.clientY) - rect.top;
    dragStartRef.current = {
      sx: startX,
      sy: startY,
      lx: localPos.x ?? rect.width - localSize.w - 16,
      ly: localPos.y ?? 16,
      cw: rect.width,
      ch: rect.height,
    };
    window.addEventListener("pointermove", onLocalPointerMove);
    window.addEventListener("pointerup", onLocalPointerUp);
  }

  function onLocalPointerMove(e) {
    if (!draggingRef.current) return;
    const container = remoteContainerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const moveX = (e.clientX ?? e.touches?.[0]?.clientX) - rect.left;
    const moveY = (e.clientY ?? e.touches?.[0]?.clientY) - rect.top;
    const { sx, sy, lx, ly, cw, ch } = dragStartRef.current;
    let nx = lx + (moveX - sx);
    let ny = ly + (moveY - sy);

    // constrain inside remote and avoid overlapping bottom controls area (reserve 120px)
    const controlsMargin = 120;
    nx = Math.max(6, Math.min(nx, cw - localSize.w - 6));
    ny = Math.max(6, Math.min(ny, ch - localSize.h - controlsMargin));
    setLocalPos({ x: nx, y: ny });
    storedPrefsRef.current.localPos = { x: nx, y: ny };
  }

  function onLocalPointerUp() {
    draggingRef.current = false;
    window.removeEventListener("pointermove", onLocalPointerMove);
    window.removeEventListener("pointerup", onLocalPointerUp);
  }

  const previewStyle = {};
  if (localPos.x !== null && localPos.y !== null) {
    previewStyle.left = `${localPos.x}px`;
    previewStyle.top = `${localPos.y}px`;
    previewStyle.position = "absolute";
  } else {
    previewStyle.right = "16px";
    previewStyle.top = "16px";
    previewStyle.position = "absolute";
  }

  /* ---------- Typing bubble ---------- */
  function TypingBubble() {
    if (!typingIndicator) return null;
    return (
      <div className="chat-bubble theirs typing-bubble">
        <div className="dots"><span /><span /><span /></div>
      </div>
    );
  }

  /* ---------- Render ---------- */
  return (
   <Router>
    {/* ✅ Show NavBar on all pages except during video calls */}
   {!joined && <NavBar joined={joined} />}
    
  {/* ✅ Wrap all routes with Suspense so lazy pages load gracefully */}
  <Suspense fallback={<div className="loader">Loading...</div>}>
    <Routes>
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/guidelines" element={<Guidelines />} />

      <Route path="/blog" element={<BlogIndex />} />
      <Route path="/blog/:slug" element={<BlogPost />} />

         
         {/* Landing / In-app page */}
        
        <Route path="/*" element={
          <div className="page">    
            
            

            {!joined ? (
              /* ----- LANDING ----- */
              <div className="center-card">
                <div className="landing-header">
                  {/* banner from public */}
                  <img src="/banner.webp" alt="Banner" className="landing-banner" />

              {/* ✨ Typing text beside banner */}
{/* ✨ Static heading text (replaces typing effect) */}
<div className="typing-heading">
  <span className="static-heading">The world is ready to Connect, Are you ?</span>
</div>




              
                  <div className="landing-title">
                    <div className="sub">🟢Online: {onlineCount}</div>
                  </div>

                  
                </div>

                <input className="input" placeholder="Enter your name" value={name} onChange={(e)=>setName(e.target.value)} />

                <div className="gender-vertical">
                  <div className={`gender-option-vertical ${gender==="male"?"active":""}`} onClick={()=>setGender("male")}>♂️ Male</div>
                  <div className={`gender-option-vertical ${gender==="female"?"active":""}`} onClick={()=>setGender("female")}>♀️ Female</div>
                  <div className={`gender-option-vertical ${gender==="other"?"active":""}`} onClick={()=>setGender("other")}>⚧️ Other</div>
                </div>

              <button
  className="primary glow-button"
     style={{ marginBottom: "80px" }}
  onClick={async () => {
    if (!onboardingSeen) {
      setShowOnboarding(true);  // show onboarding first time
    } else {
      await startLocalStream(true);
      socket.emit("join", { name, gender });
      setJoined(true);
      setStatus("searching");
    }
  }}
>
  Connect to a stranger
</button>

  {/* warning box talks a lot of time lowers performance
              <div className="warning-box">
  ⚠️ Important: Wakiee is a safe space for everyone. Any form of nudity, harassment, or abusive behaviour 
  is strictly prohibited and will result in a permanent ban without warning.
             </div>
*/}

{/* After this → read Blogs Guidelines Section */}
                    
<>             
 
    <h2 style={{ fontSize: "2rem", color: "#f90", marginBottom: "40px" }}>📰 Read Our Blogs</h2>

  {/* Slider Container   deleted */}
<div className="blog-row">
                                                                                          {/* Blog Card 1 */}
  <div>
        <img
          src={img14}
          alt="Random Video Call - Talk to Strangers Online in 2025"
           loading="lazy"       // ✅ Lazy loads only when near viewport
          style={{ width: "100%", borderRadius: "10px", marginBottom: "15px" }}
        />
        <h2>Random Video Call to Strangers Online in 2025</h2>
        <p style={{ fontSize: "10px", opacity: 0.8 }}>
          Discover the best ways to meet and chat with real people safely in 2025.
        </p>
        <a href="/blog/random-video-call-talk-to-strangers-online-in-2025" style={{ color: "#66fcf1", textDecoration: "none" }}>
          Read More →
        </a>
      </div>

      {/* Blog Card 2 */}
    <div>
        <img
          src={img10}
          alt="How AI Is Changing Online Connections"
          loading="lazy"       
          style={{ width: "100%", borderRadius: "10px", marginBottom: "15px" }}
        />
        <h2>How AI Is Changing Online Connections</h2>
        <p style={{ fontSize: "10px", opacity: 0.8 }}>
          Explore how AI-powered matching enhances how people meet online.
        </p>
        <a href="/blog/how-ai-is-changing-the-way-we-meet-new-people-online" style={{ color: "#66fcf1", textDecoration: "none" }}>
          Read More →
        </a>
      </div>

      {/* Blog Card 3 */}
     <div>
        <img
          src={img16}
          alt="Why Did Omegle Shut Down?" 
          loading="lazy"       
          style={{ width: "100%", borderRadius: "10px", marginBottom: "15px" }}
        />
        <h2>Why Did Omegle Shut Down?</h2>
        <p style={{ fontSize: "10px", opacity: 0.8 }}>
          The real story behind Omegle’s shutdown and what comes next.
        </p>
        <a href="/blog/why-did-omegle-shut-down-real-reason-behind-it" style={{ color: "#66fcf1", textDecoration: "none" }}>
          Read More →
        </a>
      </div>


   







{/* Blog Card 4 */}
     <div>
        <img
          src={img4}
          alt="How to Make Friends Online Respectfully Across Cultures"
          loading="lazy"     
          style={{ width: "100%", borderRadius: "10px", marginBottom: "15px" }}
        />
        <h2>How to Make Friends Online Across Cultures</h2>
        <p style={{ fontSize: "10px", opacity: 0.8 }}>
          A Global Village Connected by Conversation
        </p>
        <a href="/blog/make-friends-online-across-cultures" style={{ color: "#66fcf1", textDecoration: "none" }}>
          Read More →
        </a>
      </div>
                       
    </div>    
     
                  <div className="view-all-container">
                  <a href="/blog" className="view-all-link">View all Blogs →</a>
                  </div>
  


                  
     <section id="guidelines" style={{ padding: "40px", textAlign: "center"}}>
        <h3>📜Communication Guidelines</h3>
        <ul style={{ listStyle: "none", textAlign: "center",margin: "0 auto", padding: 0 }}>
    <li>✅ You must be 18+ to use Wakiee</li>
    <li>⚠️ Report inappropriate behaviour immediately</li>
    <li>🤝 Respect others — no bullying or hate speech</li>
    <li>🚫 Do not share personal info (phone, address, etc.)</li>
    <li>🛡️ Stay anonymous — that’s the fun of talking to strangers</li>
    <li>💬 Be kind and open-minded — every conversation is unique</li>
     </ul>
</section>

<footer className="landing-footer">
  <div className="footer-left">
    Follow us on{" "}
    <a
      href="https://instagram.com/wakiee.live"
      target="_blank"
      rel="noopener noreferrer"
      className="insta-icon"
      aria-label="Follow Wakiee on Instagram"
      title="Follow Wakiee on Instagram"
      style={{ marginLeft: "8px", display: "inline-flex", alignItems: "center" }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="currentColor"
        role="img"
        aria-hidden="true"
        focusable="false"
      >
        <title>Instagram icon</title>
        <path d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm5 6.3a4.7 4.7 0 1 1 0 9.4 4.7 4.7 0 0 1 0-9.4zm0 7.7a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm5.2-8.8a1.1 1.1 0 1 1 0-2.2 1.1 1.1 0 0 1 0 2.2z" />
      </svg>
    </a>
  </div>

  <div className="footer-center">
    ©2025 Wakiee
  </div>

  <div className="footer-right">
    <a href="/about">About Us</a>
    <a href="/contact">Contact Us</a>
    <a href="/privacy">Privacy Policy</a>
    <a href="/terms">Terms of Service</a>
    <a href="/guidelines">Community Guidelines</a>
  </div>
</footer>


            </>
                  
              </div>
            ) : (
              /* ----- IN-APP  (video + chat) ----- */
              <div className="inapp-wrapper">
                <div className="topbar">🟢Online: {onlineCount} • Status: {status}</div>

                <div className="content">
                  <div className="video-container" ref={remoteContainerRef}>
                    <video ref={remoteVideoRef} className="remote-video" autoPlay playsInline />
                   


{!partnerId && (
  <div className="waiting-message">
    <p className="waiting-subtext"> Searching for someone friendly...</p>
  </div>
)}


                   {partnerInfo && (
  <div className="overlay green-glow">
    {partnerInfo.name}{" "}
    {partnerInfo.gender === "male" && "♂️"}
    {partnerInfo.gender === "female" && "♀️"}
    {partnerInfo.gender === "other" && "⚧️"}
  </div>
)}


                    <video
                      ref={localVideoRef}
                      className="local-video-floating green-glow"
                      autoPlay muted playsInline
                      onPointerDown={onLocalPointerDown}
                      style={previewStyle}
                    />

                    {/* reload button positioned relative to small preview
                        ensure it stays within preview bounds by computing left/top inline */}
                    <button
                      className="preview-reload"
                      onClick={reloadLocalStream}
                      style={{
                        left: localPos.x !== null ? `${localPos.x + localSize.w - 20}px` : undefined,
                        top: localPos.y !== null ? `${localPos.y - 10}px` : undefined,
                        right: localPos.x === null ? "18px" : undefined,
                        position: "absolute",
                      }}
                      title="Reload camera"
                    >
                      ↻
                    </button>

                    <div className="controls centered">
                      <button className={`control ${micOn ? "active" : "inactive"}`} onClick={toggleMic} title={micOn ? "Mute" : "Unmute"}>
                        <MicIcon active={micOn} />
                        <div className="label">Mute</div>
                      </button>

                      <button className={`control ${camOn ? "active" : "inactive"}`} onClick={toggleCam} title={camOn ? "Camera Off" : "Camera On"}>
                        <CameraIcon active={camOn} />
                        <div className="label">Camera</div>
                      </button>

                      <button className="control next" onClick={handleNext} title="Next">
                        <NextIcon />
                        <div className="label">Next</div>
                      </button>

                      <button className="control stop" onClick={handleStop} title="Stop">
                        <StopIcon />
                        <div className="label">Stop</div>
                      </button> 
                         {/* ⬇️ PLACE REPORT BUTTON HERE    handler changes calling from ban.js*/}
                         {partnerId && !isBlocked && (
                          <button
                            className="report-btn"
                             onClick={() => openReportModal()}

                               title="Report User"
                             >
                               <div style={{ fontSize: "22px" }}>⚠️</div>
                               <div className="label">Report</div>
                             </button>
                           )}
                    </div>
                       
                  </div>

                  <div className="chat-card">
                    <div className="chat-window" ref={chatWindowRef}>
                      {messages.map((m, i) => (
                        <div key={i} className={`chat-bubble ${m.mine ? "mine" : "theirs"}`}>
                          <strong style={{display: m.mine ? "none" : "inline"}}>{m.from}: </strong>
                          {m.message}
                        </div>
                      ))}

                      {typingIndicator && <TypingBubble />}
                    </div>

                    <div className="chat-input modern">
                      
                      <input value={input} onChange={handleTyping} placeholder="Type your message" onKeyDown={(e)=>{ if(e.key==="Enter") sendChat(); }} />
                      <button onClick={sendChat}>Send</button>
                      
                    </div>
                  </div>
                </div>
              </div>
            )}
               {/* ⬇️ PLACE REPORT MODAL HERE  removed now in ban.js*/} 
           


{/* Onboarding Modal */}
{showOnboarding && (
  <OnboardingModal
    onContinue={async () => {
      localStorage.setItem("onboardingSeen", "true"); // remember forever
      setShowOnboarding(false);

      // ✅ Start connection after continue
      await startLocalStream(true);
      socket.emit("join", { name, gender });
      setJoined(true);
      setStatus("searching");
    }}
  />
)}

               {/* ⬇️ BLOCKED OVERLAY (Step 4)  removed now in ban.js    */}
               {showReportModal && <ReportModal partnerId={partnerId} />}
                 {isBlocked && <BlockedOverlay />}
           

          </div>
        } />
      </Routes>
         </Suspense>
    </Router>
  );
}
