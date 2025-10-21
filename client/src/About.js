// client/src/About.js
import React, { useEffect } from "react";

export default function About() {
  useEffect(() => {
    // ✅ Set page title for SEO
    document.title = "About Wakiee | Random Video and voice Chat Platform for Fun & Learning";

    // ✅ Add canonical tag
    const canonicalLink = document.querySelector("link[rel='canonical']");
    if (canonicalLink) {
      canonicalLink.setAttribute("href", "https://wakiee.live/about");
    } else {
      const link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      link.setAttribute("href", "https://wakiee.live/about");
      document.head.appendChild(link);
    }

    // ✅ Add meta description
    const metaDesc = document.querySelector("meta[name='description']");
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "Learn about Wakiee — a global random video and voice calling platform where you can meet new people, share ideas, and learn language and culture safely through  video and voicecalls."
      );
    } else {
      const meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      meta.setAttribute(
        "content",
        "Learn about Wakiee — a global random video and voice calling platform where you can meet new people, share ideas, and learn language and culture safely through  video and voice calls."
      );
      document.head.appendChild(meta);
    }

    // ✅ Add meta keywords
    const metaKeywords = document.querySelector("meta[name='keywords']");
    const keywords =
      "random video chat, anonymous video calls, chat with strangers, random webcam chat, talk to strangers anonymously, video call app, 
      random video chat platform, free voice calls, anonymous chat online, meet strangers online, safe video chat, video call with strangers, global video chatting, talk online, random people video chat";
      
    if (metaKeywords) {
      metaKeywords.setAttribute("content", keywords);
    } else {
      const meta = document.createElement("meta");
      meta.setAttribute("name", "keywords");
      meta.setAttribute("content", keywords);
      document.head.appendChild(meta);
    }

    // ✅ Add Open Graph meta (for social sharing)
    const ogTitle = document.createElement("meta");
    ogTitle.setAttribute("property", "og:title");
    ogTitle.setAttribute("content", "About Wakiee | Random Video Chat Platform for Fun & Learning");

    const ogDesc = document.createElement("meta");
    ogDesc.setAttribute(
      "property",
      "og:description",
      "Discover Wakiee — an anonymous video chat app connecting people worldwide for fun, learning, and friendship."
    );

    const ogUrl = document.createElement("meta");
    ogUrl.setAttribute("property", "og:url");
    ogUrl.setAttribute("content", "https://wakiee.live/about");

    const ogImg = document.createElement("meta");
    ogImg.setAttribute("property", "og:image");
    ogImg.setAttribute("content", "https://wakiee.live/og-image.jpg");

    document.head.append(ogTitle, ogDesc, ogUrl, ogImg);

    // ✅ Add JSON-LD structured data for Google
    const ldJson = document.createElement("script");
    ldJson.type = "application/ld+json";
    ldJson.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "url": "https://wakiee.live/about",
      "name": "About Wakiee",
      "description":
        "Wakiee is a random video chat platform that connects people globally for fun, learning, and safe conversations.",
      "publisher": {
        "@type": "Organization",
        "name": "Wakiee",
        "url": "https://wakiee.live",
        "logo": "https://wakiee.live/android-chrome-192x192.png",
      },
    });
    document.head.appendChild(ldJson);
  }, []);

  return (
    <div
      style={{
        padding: "40px 20px",
        color: "white",
        textAlign: "center",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      {/* ✅ Banner with alt text */}
      <img
        src="/banner.webp"
        alt="About Wakiee Banner - Random Video Chat Platform"
        style={{ maxWidth: "340px", margin: "0 auto 30px", display: "block" }}
      />

      {/* Introduction */}
      <h1 style={{ fontSize: "2rem", marginBottom: "20px" }}>About Wakiee</h1>
      <p style={{ maxWidth: "720px", margin: "20px auto", lineHeight: "1.8", fontSize: "18px" }}>
        <strong>Wakiee</strong> is a modern random video chat platform that helps you{" "}
        <strong>connect, learn, and talk</strong> with people from across the world — safely and instantly.  
        Whether you want to learn a new language, explore another culture, or just make friends, Wakiee makes it simple and fun.
      </p>

      {/* Mission */}
      <h2 style={{ marginTop: "50px" }}>Our Mission</h2>
      <p style={{ maxWidth: "720px", margin: "20px auto", lineHeight: "1.8" }}>
        We built Wakiee to bring people closer through meaningful, respectful, and fun conversations.  
        The internet can be a positive place — and we’re here to prove that every chat can inspire confidence and friendship.
      </p>

      {/* What You Can Do */}
      <h2 style={{ marginTop: "50px" }}>What You Can Do on Wakiee</h2>
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          maxWidth: "600px",
          margin: "20px auto 40px",
          textAlign: "left",
          lineHeight: "1.8",
          fontSize: "17px",
        }}
      >
        <li>🌍 Learn new languages by talking to native speakers</li>
        <li>🤝 Discover global cultures and lifestyles</li>
        <li>😊 Overcome shyness and improve communication</li>
        <li>🎭 Share thoughts, ideas, and laughter</li>
        <li>👨‍👩‍👧‍👦 Make new online friends safely and easily</li>
      </ul>

      {/* Why Choose Wakiee */}
      <h2>Why Choose Wakiee?</h2>
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          maxWidth: "600px",
          margin: "20px auto 40px",
          textAlign: "left",
          lineHeight: "1.8",
          fontSize: "17px",
        }}
      >
        <li>✅ <strong>No registration</strong> — connect instantly, no sign-up needed</li>
        <li>✅ <strong>Privacy first</strong> — we never store your personal data</li>
        <li>✅ <strong>Global community</strong> — meet real people from anywhere</li>
        <li>✅ <strong>AI moderation</strong> — keeping the platform safe and friendly</li>
        <li>✅ <strong>Mobile-friendly design</strong> — works smoothly on any device</li>
        <li>✅ <strong>Fast connections</strong> — start chatting within seconds</li>
      </ul>

      {/* Core Values */}
      <h2>Our Core Values</h2>
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          maxWidth: "600px",
          margin: "20px auto 40px",
          textAlign: "left",
          lineHeight: "1.8",
          fontSize: "17px",
        }}
      >
        <li>💙 Respect & kindness toward everyone</li>
        <li>🔒 Privacy & anonymity as a right</li>
        <li>🛡️ Safety — our highest priority</li>
        <li>🌎 Equality — every voice matters</li>
      </ul>

      {/* Safety Commitment */}
      <h2>Commitment to Safety</h2>
      <p style={{ maxWidth: "720px", margin: "20px auto", lineHeight: "1.8" }}>
        We believe a friendly, safe, and welcoming environment is key to positive experiences.  
        That’s why Wakiee uses a combination of <strong>AI-based moderation</strong> and a clear set of community guidelines to protect users.
      </p>
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          maxWidth: "600px",
          margin: "0 auto 40px",
          textAlign: "left",
          lineHeight: "1.8",
          fontSize: "17px",
        }}
      >
        <li>⚠️ One-click <strong>report system</strong> for any misconduct</li>
        <li>🚫 <strong>Zero tolerance</strong> for harassment, nudity, or abuse</li>
        <li>⛔ Instant bans for repeat or severe violations</li>
      </ul>

      {/* Closing Note */}
      <p
        style={{
          maxWidth: "700px",
          margin: "40px auto",
          fontWeight: "bold",
          lineHeight: "1.8",
          fontSize: "18px",
        }}
      >
        <em>Wakiee is more than just a chat — it’s where confidence grows, friendships begin, cultural exchange happens  
        and the world feels a little closer. 🌍💬</em>
      </p>
    </div>
  );
}
