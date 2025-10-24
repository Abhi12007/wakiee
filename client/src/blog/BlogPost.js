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

useEffect(() => {
  if (!post) return;

  // 🧭 Page title and basic metadata
  document.title = `${post.title} | Wakiee Blog`;
  const desc =
    post.excerpt ||
    "Read insightful stories on Wakiee about random video calling and online learning.";
  const canonicalUrl = `https://wakiee.live/blog/${post.slug}`;

  // 🧹 Remove any old canonical links before adding a new one
  const oldLinks = document.querySelectorAll("link[rel='canonical']");
  oldLinks.forEach((el) => el.remove());

  // 🪶 Add new canonical tag
  const canonicalLink = document.createElement("link");
  canonicalLink.setAttribute("rel", "canonical");
  canonicalLink.setAttribute("href", canonicalUrl);
  document.head.appendChild(canonicalLink);

  // 📝 Meta Description
  let metaDesc = document.querySelector("meta[name='description']");
  if (!metaDesc) {
    metaDesc = document.createElement("meta");
    metaDesc.name = "description";
    document.head.appendChild(metaDesc);
  }
  metaDesc.content = desc;

  // 🪞 Open Graph
  const ogTags = [
    { property: "og:title", content: post.title },
    { property: "og:description", content: desc },
    { property: "og:type", content: "article" },
    { property: "og:url", content: canonicalUrl }, // ✅ fixed
    { property: "og:image", content: post.image || "https://wakiee.live/og-image.jpg" },
  ];
  ogTags.forEach((tag) => {
    const el = document.createElement("meta");
    el.setAttribute("property", tag.property);
    el.content = tag.content;
    document.head.appendChild(el);
  });

  // 🧩 JSON-LD Structured Data (BlogPosting schema)
  const ld = document.createElement("script");
  ld.type = "application/ld+json";
  ld.text = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "image": post.image || "https://wakiee.live/og-image.jpg",
    "author": { "@type": "Organization", "name": "Wakiee" },
    "publisher": {
      "@type": "Organization",
      "name": "Wakiee",
      "logo": {
        "@type": "ImageObject",
        "url": "https://wakiee.live/android-chrome-192x192.png",
      },
    },
    "url": canonicalUrl, // ✅ fixed
    "description": desc,
  });
  document.head.appendChild(ld);
}, [post]);


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
