// client/src/blog/BlogIndex.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PostCard from "./components/PostCard"; // ✅ correct path
import { posts } from "./BlogData";            // ✅ named import
import "./blog.css";

const BlogIndex = () => {
  const navigate = useNavigate();
  const [showUnbannedPopup, setShowUnbannedPopup] = useState(false);

 useEffect(() => {
  document.title = "Wakiee Blog — Stories & Tips for Random Video Call";

  const desc =
    "Read blogs from Wakiee about meeting strangers, safe chatting, online learning, and idea sharing through random video calls.";
  const canonical = "https://wakiee.live/blog";

  // 🧹 Step 2: Remove any existing canonical links before adding a new one
  let oldLinks = document.querySelectorAll("link[rel='canonical']");
  oldLinks.forEach((el) => el.remove());

  // 🪶 Add new canonical
  const link = document.createElement("link");
  link.rel = "canonical";
  link.href = canonical;
  document.head.appendChild(link);

  // 📝 Meta Description
  let metaDesc = document.querySelector("meta[name='description']");
  if (!metaDesc) {
    metaDesc = document.createElement("meta");
    metaDesc.name = "description";
    document.head.appendChild(metaDesc);
  }
  metaDesc.content = desc;
}, []);



  // 🧠 Check every 2 seconds if the user is unbanned while on blogs
  useEffect(() => {
    const checkUnban = setInterval(() => {
      const flag = sessionStorage.getItem("unbannedReady");
      if (flag === "true") {
        setShowUnbannedPopup(true);
        clearInterval(checkUnban);
      }
    }, 2000);

    return () => clearInterval(checkUnban);
  }, []);

  // 🟢 Handle continue button
  const handleContinue = () => {
    sessionStorage.removeItem("unbannedReady");
    navigate("/"); // Redirect to video call page
  };

  return (
    <div className="blog-container">
      <h1 className="blog-title">Wakiee Blog</h1>
      <p className="blog-subtitle">
        Explore stories, tips, and experiences about learning cultures,
        friendships, and online communication through <strong>Wakiee</strong>.
      </p>

      <div className="blog-grid">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>

      {/* ✅ UNBANNED POPUP */}
      {showUnbannedPopup && (
        <div className="unbanned-popup">
          <div className="popup-box">
            <h2 style={{ color: "limegreen" }}>✅ You’ve been unbanned!</h2>
            <p>You can now join video calls again.</p>
            <button className="continue-btn" onClick={handleContinue}>
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogIndex;
