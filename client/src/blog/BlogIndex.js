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

  // 🧹 Step 1: Remove any existing canonical links before adding a new one
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

  // ✅ Structured Data (JSON-LD for BlogIndex page)
  const blogSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://wakiee.live/blog#webpage",
        "url": "https://wakiee.live/blog",
        "name": "Wakiee Blog — Stories & Tips for Random Video Call",
        "description": desc,
        "mainEntityOfPage": { "@id": "https://wakiee.live/#organization" },
        "publisher": {
          "@type": "Organization",
          "@id": "https://wakiee.live/#organization",
          "name": "Wakiee",
          "url": "https://wakiee.live",
          "logo": "https://wakiee.live/android-chrome-192x192.png"
        }
      },
      {
        "@type": "Blog",
        "@id": "https://wakiee.live/#blog",
        "name": "Wakiee Blog",
        "url": "https://wakiee.live/blog",
        "description": "Insights and stories from Wakiee users about random video chats, learning, and meeting people globally.",
        "publisher": { "@id": "https://wakiee.live/#organization" },
        "inLanguage": "en"
      }
    ]
  };

  // 🧹 Remove any existing JSON-LD to prevent duplicates
  const oldLD = document.querySelector('script[type="application/ld+json"][data-schema="blog"]');
  if (oldLD) oldLD.remove();

  // 🧠 Inject new JSON-LD
  const ld = document.createElement("script");
  ld.type = "application/ld+json";
  ld.dataset.schema = "blog";
  ld.text = JSON.stringify(blogSchema);
  document.head.appendChild(ld);

  // ✅ Optional: Robots meta (for AdSense clarity)
  let robots = document.querySelector("meta[name='robots']");
  if (!robots) {
    robots = document.createElement("meta");
    robots.name = "robots";
    robots.content = "index, follow";
    document.head.appendChild(robots);
  }
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
