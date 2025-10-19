// 🔹 ban.js — Countdown continues in real time even while on Blogs page

import { useEffect, useRef, useState } from "react";

export function useBanSystem(socket, { name, gender, setStatus, cleanupCall }) {
  const [isBlocked, setIsBlocked] = useState(false);
  // Identify current page (used for reconnect logic)
const path = window.location.pathname;
const isVoicePage = path === "/voice" || path.startsWith("/voice/");
// const isVideoPage = path === "/video" || path.startsWith("/video/");

  const [blockCountdown, setBlockCountdown] = useState(60);
  const [blockedUsers, setBlockedUsers] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("blockedUsers") || "[]");
    } catch {
      return [];
    }
  });

  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const countdownInterval = useRef(null);
  
    // ✅ Define modal helpers BEFORE ReportModal is declared
  function openReportModal() {
    setShowReportModal(true);
  }

  function closeReportModal() {
    setShowReportModal(false);
    setReportReason("");
  }

  // 🧠 Load saved state
  useEffect(() => {
    const savedBlocked = localStorage.getItem("isBlocked");
    const banUntil = Number(localStorage.getItem("banUntil") || 0);

    if (savedBlocked === "true" && banUntil > Date.now()) {
      setIsBlocked(true);
      const remaining = Math.ceil((banUntil - Date.now()) / 1000);
      setBlockCountdown(remaining);
    } else {
      // Cleanup old ban if expired
      localStorage.removeItem("isBlocked");
      localStorage.removeItem("banUntil");
      setIsBlocked(false);
      setBlockCountdown(60);
    }
  }, []);

  // 🕒 Countdown updater — live timer that keeps running based on timestamp
  useEffect(() => {
    if (!isBlocked) return;
    if (countdownInterval.current) clearInterval(countdownInterval.current);

    countdownInterval.current = setInterval(() => {
      const banUntil = Number(localStorage.getItem("banUntil") || 0);
      const now = Date.now();
      const remaining = Math.ceil((banUntil - now) / 1000);

 if (remaining <= 0) {
  clearInterval(countdownInterval.current);
  countdownInterval.current = null;

  localStorage.removeItem("isBlocked");
  localStorage.removeItem("banUntil");
  setIsBlocked(false);
  setBlockCountdown(0);

  // ✅ Mark unban ready
  sessionStorage.setItem("unbannedReady", "true");

  // ✅ Detect current path
  const path = window.location.pathname;
  const isBlogPage = path === "/blog" || path.startsWith("/blog/");
  const isLandingPage = path === "/"; // 👈 new check

   if (!isBlogPage && !isLandingPage && isVideoPage) {
    // 🟢 Only auto-rejoin automatically if user is inside the video page
    socket.emit("join", { name, gender });
    setStatus("searching");
  } else if (isVoicePage) {
    // 🔇 For Voice page → do NOT rejoin automatically
    console.log("⏳ Voice ban ended — user must press Start manually to match again.");
  } else {
    // 🧘 Stay idle (blog or landing) – user must press “Connect”
    console.log("Unban complete — waiting for user action on landing/blog page.");
  }
} else {
  // Continue countdown normally
  setBlockCountdown(remaining);
}
    }, 1000);

    return () => clearInterval(countdownInterval.current);
  }, [isBlocked]);

  // 🧩 When reported
// 🧩 When reported — only the targeted user is affected
useEffect(() => {
  socket.on("reported", async ({ to, clearChat, forceStop }) => {
    try {
      // Wait for socket.id to exist (can sometimes be undefined briefly)
      const myId = socket.id || (await new Promise((resolve) => {
        const check = setInterval(() => {
          if (socket.id) {
            clearInterval(check);
            resolve(socket.id);
          }
        }, 100);
      }));

      // ✅ Only proceed if YOU are the target
      if (to !== myId) return;

      // 1️⃣ End current call
      if (typeof cleanupCall === "function") cleanupCall(true);

      // 2️⃣ Remove from matching queue (no auto requeue)
      socket.emit("leave-voice");
      setStatus("idle");

      // 3️⃣ Clear chat if needed
      if (clearChat) {
        const chatWindow = document.querySelector(".voicep-chat-window, .chat-window");
        if (chatWindow) chatWindow.innerHTML = "";
      }

      // 4️⃣ Apply local ban for 60 seconds
      const banUntil = Date.now() + 60000;
      localStorage.setItem("isBlocked", "true");
      localStorage.setItem("banUntil", banUntil.toString());
      setIsBlocked(true);
      setBlockCountdown(60);

      // Prevent premature rejoin
      sessionStorage.removeItem("unbannedReady");

      console.log("🚫 You have been reported — blocked for 60 seconds");
    } catch (err) {
      console.error("Error in reported handler:", err);
    }
  });

  return () => socket.off("reported");
}, [socket, cleanupCall, setStatus]);


function submitReport(partnerId) {
  if (!reportReason) return alert("Please select a reason");

  // 🧠 Detect current page
  const path = window.location.pathname;
  const isVoicePage = path.includes("/voice");
  const isVideoPage = !isVoicePage; // landing page acts as video page

  // 🚫 1️⃣ Tell the reported user to stop and show ban overlay (only they react)
  socket.emit("reported", { to: partnerId, clearChat: true, forceStop: true });

  // ⚠️ 2️⃣ Keep compatibility for video/landing reporting
  socket.emit("report", { partnerId, reason: reportReason });

  // 🔚 3️⃣ End your own current call and clear chat
  if (typeof cleanupCall === "function") cleanupCall(true);
  const chatWindow = document.querySelector(".voicep-chat-window, .chat-window");
  if (chatWindow) chatWindow.innerHTML = "";

  // 🔄 4️⃣ Leave appropriate queue
  if (isVoicePage) {
    socket.emit("leave-voice"); // voice queue
  } else if (isVideoPage) {
    socket.emit("leave"); // video/landing queue
  }

  // ⏳ 5️⃣ Auto rejoin (voice only)
  if (isVoicePage) {
    setTimeout(() => {
      socket.emit("join-voice");
      setStatus("searching");
    }, 1000);
  } else {
    // for video (landing), keep current logic
    socket.emit("join", { name, gender });
    setStatus("searching");
  }

  // 🧾 6️⃣ Save reported user locally
  const updated = [...blockedUsers, partnerId];
  setBlockedUsers(updated);
  localStorage.setItem("blockedUsers", JSON.stringify(updated));

  // 🧩 7️⃣ Close the red report modal
  closeReportModal();
}


  // 🟢 Read Blogs → Go to blog, but keep countdown running
  function handleBlogRedirect() {
    try {
      if (countdownInterval.current) {
        clearInterval(countdownInterval.current);
        countdownInterval.current = null;
      }

      // Do NOT clear localStorage — keep banUntil running
      sessionStorage.setItem("fromBlog", "true");
      window.location.assign("/blog");
    } catch (err) {
      console.error("Error during blog redirect:", err);
    }
  }

  /* ---------- UI Components ---------- */
  function BlockedOverlay() {
    if (!isBlocked) return null;
    return (
      <div className="blocked-overlay">
        <div className="blocked-box">
          <h2>🚫 You have been reported</h2>
          <p>Avoid Nudity, Harassment, Spam, or other violations.</p>
          <p>
            Please wait <strong>{blockCountdown}</strong> seconds before reconnecting.
          </p>

          <div className="or-divider">— OR —</div>

          <button className="blog-btn" onClick={handleBlogRedirect}>
            Click here to read blogs
          </button>
        </div>
      </div>
    );
  }

 function ReportModal({ partnerId }) {
  const reasons = ["Nudity", "Harassment", "Spam", "Other"];

  return (
    <div className="report-overlay">
      <div className="report-box red-theme">
        <h3>⚠️ Report This User</h3>
        <p>Select a reason below:</p>

        {/* 🔴 Reason buttons */}
        <div className="report-reasons">
          {reasons.map((reason) => (
            <button
              key={reason}
              className={`reason-btn ${reportReason === reason.toLowerCase() ? "active" : ""}`}
              onClick={() => setReportReason(reason.toLowerCase())}
            >
              {reason}
            </button>
          ))}
        </div>

        <div className="report-actions">
          <button className="cancel-btn" onClick={closeReportModal}>
            Cancel
          </button>
          <button
            className="submit-btn"
            onClick={() => submitReport(partnerId)}
            disabled={!reportReason}
          >
            Submit Report
          </button>
        </div>
      </div>
    </div>
  );
}


  return {
    isBlocked,
    blockCountdown,
    blockedUsers,
    showReportModal,
    openReportModal,
    closeReportModal,
    submitReport,
    BlockedOverlay,
    ReportModal,
  };
}
