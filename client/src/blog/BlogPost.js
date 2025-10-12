// client/src/blog/BlogPost.js
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { posts } from "./BlogData"; // ✅ shared blog data
import "./blog.css"; // ✅ includes popup CSS too

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const post = posts.find((p) => p.slug === slug);

  // 🟢 State to show the unbanned popup
  const [showUnbannedPopup, setShowUnbannedPopup] = useState(false);

  // 🧠 Check every 2s if the unban flag is set in sessionStorage
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

  // 🟢 Handle Continue button click
  const handleContinue = () => {
    sessionStorage.removeItem("unbannedReady");
    navigate("/"); // redirect to video call page
  };

  // 🧩 Fallback if post not found
  if (!post) {
    return (
      <div className="blog-post-container">
        <h2>Post not found 😕</h2>
        <Link to="/blog" className="back-link">← Back to Blog</Link>
      </div>
    );
  }

  return (
    <div className="blog-post-container">
      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          className="blog-post-image"
          loading="lazy"
        />
      )}

      <div className="blog-post-content">
        <h1>{post.title}</h1>
        <p className="blog-post-date">{post.date}</p>

        {/* ✅ Safely render post HTML */}
        <div
          className="blog-post-body"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <Link to="/blog" className="back-link">← Back to Blog</Link>
      </div>

      {/* ✅ Unbanned Popup */}
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

export default BlogPost;
