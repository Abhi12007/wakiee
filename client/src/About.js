// client/src/About.js
import React, { useEffect } from "react";

export default function About() {
 useEffect(() => {
    // ✅ SEO + META Setup
    document.title = "About Wakiee | Random Video and Voice Chat Platform for Fun & Learning";

    // ✅ Canonical
    let canonical = document.querySelector("link[rel='canonical']");
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", "https://wakiee.live/about");

    // ✅ Description
    const description =
      "Learn about Wakiee — a global random video and voice calling platform where you can meet new people, share ideas, and learn languages and cultures safely through live chats.";

    let metaDesc = document.querySelector("meta[name='description']");
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", description);

    // ✅ Keywords
    const keywords = `
random video chat, anonymous video calls, chat with strangers, random webcam chat, talk to strangers anonymously, video call app,
random video chat platform, free voice calls, anonymous chat online, meet strangers online, safe video chat, talk with strangers site,
stranger chat website, global video chatting, talk online, random people video chat, about wakiee, what is wakiee, wakiee live platform
`;

    let metaKeywords = document.querySelector("meta[name='keywords']");
    if (!metaKeywords) {
      metaKeywords = document.createElement("meta");
      metaKeywords.setAttribute("name", "keywords");
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute("content", keywords);

    // ✅ Open Graph
    const ogTags = [
      { property: "og:title", content: "About Wakiee | Random Video Chat Platform for Fun & Learning" },
      { property: "og:description", content: "Discover Wakiee — a safe, anonymous video chat app connecting people worldwide for fun, learning, and conversation." },
      { property: "og:url", content: "https://wakiee.live/about" },
      { property: "og:image", content: "https://wakiee.live/android-chrome-192x192.png" },
    ];

    ogTags.forEach(({ property, content }) => {
      let tag = document.querySelector(`meta[property='${property}']`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("property", property);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    });

    // ✅ JSON-LD Schema
  // ✅ JSON-LD Schema
const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://wakiee.live/about",
      "url": "https://wakiee.live/about",
      "name": "About Wakiee",
      "description": description,
      "isPartOf": { "@id": "https://wakiee.live/#website" },
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://wakiee.live/" },
          { "@type": "ListItem", "position": 2, "name": "About", "item": "https://wakiee.live/about" }
        ]
      }
    },
    {
      "@type": "Organization",
      "@id": "https://wakiee.live/#organization",
      "name": "Wakiee",
      "url": "https://wakiee.live",
      "logo": {
        "@type": "ImageObject",
        "url": "https://wakiee.live/android-chrome-192x192.png"
      },
      "sameAs": [
        "https://www.instagram.com/wakiee.live"
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Is Wakiee free to use?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Wakiee is completely free to use for random video and voice chats."
          }
        },
        {
          "@type": "Question",
          "name": "Does Wakiee store my video chats?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. Wakiee never stores or records your chats. All connections are peer-to-peer and temporary."
          }
        }
      ]
    }
  ]
};

   
    const oldLd = document.querySelector('script[type="application/ld+json"][data-schema="about"]');
    if (oldLd) oldLd.remove();

    const ldJson = document.createElement("script");
    ldJson.type = "application/ld+json";
    ldJson.dataset.schema = "about";
    ldJson.text = JSON.stringify(schema);
    document.head.appendChild(ldJson);

    // ✅ Cleanup on unmount
    return () => {
      if (ldJson) ldJson.remove();
    };
  }, []); // <-- ✅ end of useEffect
  
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
    margin: "10px auto 40px",
    fontSize: "16px",
    lineHeight: "1.8",
    opacity: 0.85,
  }}
>
  Learn more about our{" "}
  <a href="/privacy" style={{ color: "#4FA3FF" }}>Privacy Policy</a>,{" "}
  <a href="/terms" style={{ color: "#4FA3FF" }}>Terms of Service</a>, and{" "}
  <a href="/contact" style={{ color: "#4FA3FF" }}>Contact Page</a> to understand how we
  keep your experience safe, transparent, and community-driven.
</p>

    </div>
  );
}
