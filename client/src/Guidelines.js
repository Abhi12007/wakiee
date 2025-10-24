import React, { useEffect } from "react";

const Community = () => {
  useEffect(() => {
    // ✅ SEO Title
    document.title =
      "Community Guidelines | Wakiee — Safe Random Video Chat Rules & Policy";

    // ✅ Canonical Tag
    const canonicalLink = document.querySelector("link[rel='canonical']");
    if (canonicalLink) {
      canonicalLink.setAttribute(
        "href",
        "https://wakiee.live/guidelines"
      );
    } else {
      const link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      link.setAttribute("href", "https://wakiee.live/guidelines");
      document.head.appendChild(link);
    }

    // ✅ Meta Description
    const description =
      "Read Wakiee’s Community Guidelines to ensure safe, respectful, and AdSense-compliant random video chats. Learn what’s allowed and what’s not.";
    const metaDesc = document.querySelector("meta[name='description']");
    if (metaDesc) {
      metaDesc.setAttribute("content", description);
    } else {
      const meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      meta.setAttribute("content", description);
      document.head.appendChild(meta);
    }

    // ✅ Meta Keywords
    const keywords =
      "wakiee community guidelines, random video chat rules, anonymous chat policy, safe video calls, online behavior policy, moderation rules, AdSense compliance, talk to strangers safely, anti-harassment rules, online chat safety";
    const metaKeywords = document.querySelector("meta[name='keywords']");
    if (metaKeywords) {
      metaKeywords.setAttribute("content", keywords);
    } else {
      const meta = document.createElement("meta");
      meta.setAttribute("name", "keywords");
      meta.setAttribute("content", keywords);
      document.head.appendChild(meta);
    }

    // ✅ Open Graph Meta (safe insert)
const ogTags = [
  {
    property: "og:title",
    content: "Community Guidelines | Wakiee — Safe Random Video Chat Rules & Policy",
  },
  {
    property: "og:description",
    content:
      "Follow Wakiee’s Community Guidelines for respectful, safe, and AdSense-compliant random video chatting worldwide.",
  },
  { property: "og:type", content: "website" },
  { property: "og:url", content: "https://wakiee.live/guidelines" },
  { property: "og:image", content: "https://wakiee.live/og-image.jpg" },
  { property: "og:site_name", content: "Wakiee" },
];

ogTags.forEach((tag) => {
  if (!document.querySelector(`meta[property='${tag.property}']`)) {
    const meta = document.createElement("meta");
    meta.setAttribute("property", tag.property);
    meta.setAttribute("content", tag.content);
    document.head.appendChild(meta);
  }
});


    // ✅ JSON-LD Structured Data (Enhanced with FAQPage)
const ldJson = document.createElement("script");
ldJson.type = "application/ld+json";
ldJson.text = JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://wakiee.live/guidelines",
      "url": "https://wakiee.live/guidelines",
      "name": "Wakiee Community Guidelines",
      "description":
        "Official Wakiee Community Guidelines outlining safety, moderation, and AdSense-compliant behavior for random video chat users.",
      "publisher": {
        "@type": "Organization",
        "name": "Wakiee",
        "url": "https://wakiee.live",
        "logo": "https://wakiee.live/android-chrome-192x192.png"
      }
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What behavior is prohibited on Wakiee?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Wakiee prohibits nudity, hate speech, harassment, illegal activities, impersonation, and spam. Violators may be permanently banned."
          }
        },
        {
          "@type": "Question",
          "name": "Does Wakiee record or store video chats?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. Wakiee never records or stores video or voice chats. All sessions are temporary, secure, and peer-to-peer."
          }
        },
        {
          "@type": "Question",
          "name": "Is Wakiee suitable for minors?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. Wakiee is strictly for users aged 18 and above. Underage access is prohibited, and suspected minors are removed immediately."
          }
        }
      ]
    }
  ]
});
document.head.appendChild(ldJson);

  }, []);

  return (
    <div
      style={{
        padding: "30px",
        maxWidth: "900px",
        margin: "auto",
        lineHeight: "1.6",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        Community Guidelines (Rules)
      </h1>
      <p>
        <strong>Last Updated:</strong> October 2025
      </p>

      <p>
        Welcome to <strong>Wakiee</strong> — a platform designed for spontaneous,
        real-time conversations with new people across the world. To ensure a
        positive, respectful, and safe experience for everyone,{" "}
        <strong>all users must follow these rules</strong>. These guidelines form
        an integral part of our{" "}
        <a
          href="/terms"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#4FA3FF" }}
        >
          Terms of Service
        </a>
        .
      </p>

      <h2>🚫 STRICTLY 18+ ONLY</h2>
      <p>
        Wakiee is a service for <strong>adults only</strong>. ALL USERS MUST BE 18
        YEARS OF AGE OR OLDER. Access by minors is strictly forbidden under any
        circumstances, including with parental permission. By using Wakiee, you
        affirm that you are at least 18 years old.
      </p>
      <p>
        Users are expected to use the <strong>Report</strong> button to flag any
        suspected underage users — this helps support our multi-layered{" "}
        <strong>human moderation</strong> system to maintain safety and
        compliance.
      </p>

      <h2>⚠️ Inappropriate Conduct</h2>
      <p>
        Any form of illegal, harmful, or inappropriate behavior is strictly
        prohibited and may result in an immediate permanent ban. This includes,
        but is not limited to:
      </p>

      <h3>Abuse &amp; Harassment</h3>
      <ul>
        <li>Do not insult, bully, threaten, or demean others.</li>
        <li>
          Hate speech, racism, or discrimination based on gender, sexuality,
          ethnicity, religion, or appearance is forbidden.
        </li>
        <li>Use respectful, positive language in both chat and video.</li>
      </ul>

      <h3>Nudity &amp; Sexual Content</h3>
      <ul>
        <li>Absolutely no nudity, partial nudity, or sexual behavior of any kind.</li>
        <li>
          Do not display or imply sexual gestures, body exposure, or adult
          content. Video chats must remain appropriate and focus on your face.
        </li>
      </ul>

      <h3>Illegal Activities</h3>
      <ul>
        <li>Do not display, encourage, or discuss illegal acts.</li>
        <li>This includes drug use, violence, or any form of self-harm.</li>
        <li>Displaying weapons or dangerous items is strictly prohibited.</li>
      </ul>

      <h3>Spam &amp; Solicitation</h3>
      <ul>
        <li>Wakiee is a personal communication platform, not a marketplace.</li>
        <li>Do not promote websites, social media handles, or products.</li>
        <li>
          Unsolicited advertising, spamming links, or repeated messages will lead
          to a ban.
        </li>
      </ul>

      <h2>🚷 Gender-Based Solicitation</h2>
      <p>
        Wakiee is <strong>not a dating site</strong>. It is a space for open
        conversation and cultural exchange. Users must not indicate gender
        preferences or use symbols suggesting such behavior.
      </p>

      <h2>🕵️ Impersonation</h2>
      <ul>
        <li>Do not pretend to be another person, organization, or brand.</li>
        <li>
          The use of fake identities, filters, or pre-recorded videos to
          impersonate someone else is forbidden.
        </li>
        <li>Always show your real live video — no replayed or altered footage.</li>
      </ul>

      <h2>💬 Advertising, Spam, and Disruptive Content</h2>
      <p>
        Any form of advertising or disruptive behavior in text or video is
        strictly prohibited. This includes:
      </p>
      <ul>
        <li>Posting repetitive, irrelevant, or commercial content.</li>
        <li>Showing printed signs, posters, or advertising material.</li>
        <li>Directing your camera at any object or screen instead of your face.</li>
      </ul>
      <p>Keep the experience personal and interactive — that’s the spirit of Wakiee.</p>

      <h2>🧠 Third-Party Scripts, Bots, and Software</h2>
      <ul>
        <li>Using unauthorized software, scripts, or automation tools is forbidden.</li>
        <li>Do not attempt to hack, scrape, or manipulate Wakiee’s system.</li>
        <li>Any such activity may result in a permanent ban and legal action.</li>
      </ul>

     <h2>🛡️ Moderation &amp; User Responsibility</h2>
<p>
  Wakiee uses a combination of <strong>AI-based and human moderation</strong> to detect
  and remove unsafe or inappropriate content in real time. Our moderation systems
  automatically flag potentially harmful behavior, and human reviewers ensure fairness
  and accuracy in enforcement.
</p>

      <ul>
        <li>You are connecting with real people in real time.</li>
        <li>
          You are fully responsible for your own behavior and any content you
          display or share.
        </li>
        <li>Violations may lead to a temporary or permanent ban without notice.</li>
      </ul>
      <p>
        Bans cannot be lifted by payment, and repeated offenders will be
        permanently restricted.
      </p>

      <h2>🧒 Protecting Minors</h2>
      <ul>
        <li>Wakiee strictly prohibits anyone under 18 from accessing the platform.</li>
        <li>Report suspected minors immediately using the Report button.</li>
        <li>Sessions found to involve minors will be terminated instantly.</li>
      </ul>

      <h2>📝 Content Ownership and Privacy</h2>
      <ul>
        <li>Do not record, screenshot, or share any chat without consent.</li>
        <li>Conversations are temporary — Wakiee does not store interactions.</li>
        <li>Always respect others’ privacy and boundaries.</li>
      </ul>

      <h2>💬 Blog and Public Interaction Rules</h2>
      <ul>
        <li>Do not post spam, offensive language, or unrelated links.</li>
        <li>Stay on-topic and avoid self-promotion.</li>
        <li>Do not include personal contact information in comments.</li>
        <li>Comments may be removed if found inappropriate.</li>
      </ul>

      <h2>🚨 Reporting Misconduct</h2>
      <ul>
        <li>Use the Report button for any rule violations.</li>
        <li>Reports are reviewed by moderators for action.</li>
        <li>False or abusive reporting may lead to penalties.</li>
      </ul>
          <h2>📢 Advertising, Cookies &amp; AdSense Compliance</h2>
<p>
  Wakiee displays advertisements through <strong>Google AdSense</strong> and other
  trusted ad networks. These third-party vendors may use cookies to deliver
  personalized ads based on user interests and prior visits.
</p>
<p>
  By using Wakiee, you consent to the use of cookies and similar technologies as
  described in our{" "}
  <a href="/privacy" style={{ color: "#4FA3FF" }}>
    Privacy Policy
  </a>
  . You can manage or disable personalized ads through{" "}
  <a
    href="https://adssettings.google.com"
    target="_blank"
    rel="noopener noreferrer"
    style={{ color: "#4FA3FF" }}
  >
    Google Ads Settings
  </a>
  .
</p>
<p>
  Wakiee complies with Google’s Publisher Policies and ensures that user-generated
  content is actively moderated to maintain AdSense-safe environments.
</p>


      <h2>⏳ Enforcement</h2>
      <p>
        Violations may lead to immediate disconnection, suspension, or a permanent
        ban. Wakiee may report illegal activity to authorities when required.
      </p>

      <h2>🔄 Updates to the Rules</h2>
      <p>
        Guidelines may be updated periodically to improve safety and moderation.
        By continuing to use Wakiee, you agree to the latest version.
      </p>

      <h2>📬 Contact Us</h2>
      <p>
        For questions or suggestions about these Community Guidelines, contact us
        at:<br />
        📧 <strong>contact@wakiee.live</strong>
        <br />
        📍 <strong>Wakiee Technologies, Delhi, India</strong>
      </p>
          <p
  style={{
    textAlign: "center",
    marginTop: "40px",
    fontSize: "15px",
    opacity: 0.8,
    lineHeight: "1.8",
  }}
>
  Learn more about our{" "}
  <a href="/privacy" style={{ color: "#4FA3FF" }}>Privacy Policy</a>,{" "}
  <a href="/terms" style={{ color: "#4FA3FF" }}>Terms of Service</a>, and{" "}
  <a href="/contact" style={{ color: "#4FA3FF" }}>Contact Page</a>.
</p>

    </div>
  );
};

export default Community;
