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

// 🧩 When reported (client-side)
useEffect(() => {
  socket.on("client-report", ({ targetId, reason }) => {
  if (socket.id === targetId) {
    // 🕒 set 60 sec block
    const banUntil = Date.now() + 60000;
    localStorage.setItem("isBlocked", "true");
    localStorage.setItem("banUntil", banUntil.toString());
    setIsBlocked(true);
    setBlockCountdown(60);

    // 🚫 Immediately remove from queue and disconnect
    socket.emit("leave");        // stop any ongoing match or call
    socket.emit("leave-voice");  // also cover voice mode, just in case
    cleanupCall(true);           // stop local media
    setMessages([]);             // clear chat
    setPartnerId?.(null);        // optional: if you pass this from parent
    setStatus("idle");           // go back to landing

    // 🏠 Navigate back to landing/home page if using react-router
    try {
      window.history.pushState({}, "", "/");
    } catch (err) {
      console.warn("Navigation failed, fallback to reload");
      window.location.href = "/"; // fallback
    }

    // 🎭 After small delay, show overlay (smooth transition)
    setTimeout(() => {
      setIsBlocked(true);
    }, 300);
  }
});

  return () => socket.off("client-report");
}, [socket]);


 // 🧩 Report modal functions
function openReportModal() {
  setShowReportModal(true);
}

function closeReportModal() {
  setShowReportModal(false);
  setReportReason("");
}

function submitReport(partnerId) {
  if (!reportReason) return alert("Please select a reason");

  // ✅ Send private message directly to partner (not broadcasted by server)
  socket.emit("client-report", { targetId: partnerId, reason: reportReason });

  // ✅ Locally handle the reporter side
  socket.emit("leave"); // disconnect current call
  cleanupCall(true);
  setMessages([]); // clear chat

  // Optional: keep track of who you blocked locally
  const updated = [...blockedUsers, partnerId];
  setBlockedUsers(updated);
  localStorage.setItem("blockedUsers", JSON.stringify(updated));

  // ✅ Immediately go back to searching for new partner
  socket.emit("join", { name, gender, blocked: updated });
  setStatus("searching");

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
