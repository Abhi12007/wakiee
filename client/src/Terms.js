import React, { useEffect } from "react";

const Terms = () => {
  useEffect(() => {
    // ✅ SEO Title
    document.title = "Terms of Service | Wakiee — Random Video & Voice Chat Platform";


    // ✅ Canonical Tag
    const canonicalLink = document.querySelector("link[rel='canonical']");
    if (canonicalLink) {
      canonicalLink.setAttribute("href", "https://wakiee.live/terms");
    } else {
      const link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      link.setAttribute("href", "https://wakiee.live/terms");
      document.head.appendChild(link);
    }

    // ✅ Meta Description
    const metaDesc = document.querySelector("meta[name='description']");
    const description =
      "Read Wakiee’s Terms of Service outlining user responsibilities, privacy protection, AdSense compliance, and rules for safe, anonymous video chats.";
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
      "wakiee terms of service, random video calls rules, anonymous chat policy, video call guidelines, user agreement, safe chatting, online safety, content moderation, AdSense compliance, privacy protection, chat app terms, wakiee policies";
    const metaKeywords = document.querySelector("meta[name='keywords']");
    if (metaKeywords) {
      metaKeywords.setAttribute("content", keywords);
    } else {
      const meta = document.createElement("meta");
      meta.setAttribute("name", "keywords");
      meta.setAttribute("content", keywords);
      document.head.appendChild(meta);
    }

    // ✅ Open Graph Tags
    const ogTags = [
      { property: "og:title", content: "Terms of Service | Wakiee — Safe Random Video Chat Platform" },
      {
        property: "og:description",
        content:
          "Understand Wakiee's terms, user responsibilities, and safety rules for using the anonymous video chat platform securely.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://wakiee.live/terms" },
      { property: "og:image", content: "https://wakiee.live/og-image.jpg" },
      { property: "og:site_name", content: "Wakiee" },
    ];
    ogTags.forEach((tag) => {
      const meta = document.createElement("meta");
      meta.setAttribute("property", tag.property);
      meta.setAttribute("content", tag.content);
      document.head.appendChild(meta);
    });

    // ✅ JSON-LD Structured Data
   ldJson.text = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Terms of Service | Wakiee",
  "url": "https://wakiee.live/terms",
  "description":
    "Read Wakiee's official Terms of Service — learn about AI moderation, AdSense compliance, user behavior rules, and privacy protection for safe random video chats.",
  "publisher": {
    "@type": "Organization",
    "name": "Wakiee",
    "url": "https://wakiee.live",
    "logo": "https://wakiee.live/android-chrome-192x192.png",
  }
});

    document.head.appendChild(ldJson);
  }, []);

  return (
    <div style={{ padding: "30px", maxWidth: "900px", margin: "auto", lineHeight: "1.6" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Terms of Service for Wakiee</h1>
      <p><strong>Last updated:</strong> October 2025</p>

      <p>
        Welcome to <strong>Wakiee</strong> (the “Website”, “Site”, “We”, “Us”, or “Our”),
        accessible from{" "}
        <a
          href="https://wakiee.live"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#4FA3FF" }}
        >
          https://wakiee.live
        </a>.
        This Website is owned and operated by <strong>Wakiee Technologies</strong> (“the Owner”),
        located in India.
      </p>
      <p>
        Use of this Website constitutes your agreement to abide by the most current version of
        these Terms of Service (“Terms”). Please read these Terms carefully along with our{" "}
        <a href="/privacy" style={{ color: "#4FA3FF" }}>
          Privacy Policy
        </a>
        , which explains how we handle your personal information.
      </p>

      <h2>1. Your Agreement</h2>
      <p>By accessing or using <strong>Wakiee</strong>, you confirm that:</p>
      <ul>
        <li>You are at least 18 years old.</li>
        <li>You have read, understood, and agree to these Terms.</li>
        <li>You will comply with all applicable laws and community standards while using the Website.</li>
      </ul>
      <p>If you disagree with any part of these Terms, please discontinue use of the Website immediately.</p>

      <h2>2. Services Overview</h2>
      <p>Wakiee provides an online platform designed for users to:</p>
      <ul>
        <li>Engage in peer-to-peer video calls with strangers without the need for an account or profile.</li>
        <li>Use camera and microphone features temporarily for live sessions.</li>
        <li>Participate in text-based chats without the need for an account or profile.</li>
        <li>Read and engage with blogs published on the Wakiee website.</li>
      </ul>
      <p>All chats are anonymous, and Wakiee does not store messages, video streams, or any personal data.</p>
      <p>
        The platform includes a <strong>Report</strong> button that allows users to flag inappropriate behavior.
        All moderation is performed by human moderators to maintain safety and compliance with community guidelines.
      </p>

      <h2>3. Eligibility</h2>
      <p>
        Wakiee is strictly intended for users 18 years or older. Any person under 18 is prohibited from
        using the Website. We reserve the right to deny or terminate access to anyone found violating this rule.
      </p>

      <h2>4. No Account Registration & Data Storage</h2>
      <p>
        Wakiee does not require or support user account creation. We do not maintain personal profiles,
        login systems, or chat/call history. All communication is temporary and ends once you disconnect.
        No personal data, chat content, or media is stored or shared.
      </p>

      <h2>5. Refund Policy</h2>
      <p>
        Wakiee currently offers its services free of charge. If paid features or subscriptions are introduced
        in the future, our refund process will follow these principles:
      </p>
      <ul>
        <li>Refunds are only issued in cases of fraudulent or duplicate payments.</li>
        <li>All refund requests must be submitted to contact@wakiee.live within 7 days of payment.</li>
        <li>Approved refunds will be processed to the original payment method within 7–10 business days.</li>
      </ul>
      <p>Wakiee reserves the right to deny refunds for misuse or violations of these Terms.</p>

      <h2>6. User Conduct and Responsibility</h2>
      <h3>6.1 Acceptable Use</h3>
      <ul>
        <li>Engage respectfully and lawfully with other users.</li>
        <li>Use chat, camera, and microphone features responsibly.</li>
        <li>Avoid sharing personal, financial, or sensitive information.</li>
        <li>Treat all users with dignity and respect.</li>
      </ul>

      <h3>6.2 Prohibited Conduct</h3>
      <ul>
        <li>Share, record, or distribute any live or recorded session.</li>
        <li>Engage in nudity, harassment, hate speech, or abusive content.</li>
        <li>Impersonate others, spread misinformation, or engage in illegal activity.</li>
        <li>Circumvent moderation tools or harm the Website’s operation.</li>
        <li>Target minors or engage in predatory or sexually explicit behavior.</li>
      </ul>

      <h3>6.3 Reporting</h3>
      <p>
        Users can report inappropriate behavior using the <strong>Report</strong> feature available during a chat.
        Reported users may be reviewed and banned by moderators without prior notice.
      </p>

          <h2>7. Content Moderation & Safety Policy</h2>
<p>
  Wakiee uses a combination of <strong>AI-based and human moderation</strong> systems to ensure that all
  interactions remain respectful and safe. Content that violates community standards — such as nudity,
  hate speech, harassment, or illegal activity — may be automatically flagged and removed.
</p>
<p>
  Repeat or severe violations may result in immediate suspension or permanent bans.
  For details, please visit our{" "}
  <a href="/guidelines" style={{ color: "#4FA3FF" }}>Community Guidelines</a>.
</p>

      <h2>8. Limitation of Liability</h2>
      <p>
        Wakiee provides its services on an “as-is” basis. We make no warranties, express or implied,
        regarding continuous availability, safety, or user-generated content.
      </p>
      <p>
        By using Wakiee, you acknowledge that you interact at your own risk. We are not liable for damages,
        loss, or injury arising from user interactions or technical interruptions.
      </p>

      <h2>9. Termination</h2>
      <p>
        We may terminate or suspend access without notice if you violate these Terms or applicable laws,
        or if repeated reports of misconduct occur. Upon termination, access ceases immediately.
      </p>

      <h2>10. Changes to Terms</h2>
      <p>
        Wakiee may update or modify these Terms at any time. Updates will be posted with a revised “Last Updated” date.
        Continued use means acceptance of revised Terms.
      </p>

      <h2>11. Governing Law</h2>
      <p>
        These Terms are governed by the laws of India. All disputes are subject to the exclusive jurisdiction
        of the courts in Delhi, India.
      </p>

      <h2>12. Contact</h2>
      <p>
        For questions or legal notices, contact:<br />
        📧 <strong>contact@wakiee.live</strong><br />
        📍 <strong>Wakiee Technologies, Delhi, India</strong>
      </p>

      <h2>13. Third-Party Content Disclaimer</h2>
      <p>
        Wakiee may display third-party advertisements or content for information purposes.
        We do not control, endorse, or assume responsibility for any third-party websites or services.
      </p>

      <h2>14. Intellectual Property</h2>
      <p>
        All trademarks, logos, and materials on Wakiee belong to Wakiee Technologies or its licensors.
        Unauthorized copying, reproduction, or redistribution is prohibited.
      </p>

      <h2>15. Indemnification</h2>
      <p>
        You agree to indemnify and hold harmless Wakiee Technologies, its owners, employees, and partners
        from claims, damages, or liabilities resulting from your actions or violations of these Terms.
      </p>

          <h2>15.1 Google AdSense & Cookies</h2>
<p>
  Wakiee displays ads served by <strong>Google AdSense</strong> and other third-party partners. 
  These vendors may use cookies to collect non-personal browsing data to deliver personalized advertisements. 
  By using Wakiee, you consent to the use of such cookies as described in our{" "}
  <a href="/privacy" style={{ color: "#4FA3FF" }}>Privacy Policy</a>.
</p>
<p>
  Users may opt out of personalized ads by visiting{" "}
  <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" style={{ color: "#4FA3FF" }}>
    Google Ads Settings
  </a>.
</p>


      <h2>16. Cookies and Analytics</h2>
      <p>
        Wakiee uses cookies and analytics tools to enhance user experience and deliver relevant advertisements.
        By using Wakiee, you consent to cookies as described in our{" "}
        <a href="/privacy" style={{ color: "#4FA3FF" }}>
          Privacy Policy
        </a>.
      </p>

      <h2>17. Service Availability (Force Majeure)</h2>
      <p>
        Wakiee does not guarantee uninterrupted service. Temporary outages may occur due to maintenance,
        network issues, or factors beyond our control. We are not responsible for any data loss or interruption
        caused by such events.
      </p>
          <p style={{ marginTop: "40px", textAlign: "center", opacity: 0.8 }}>
  Learn more about our{" "}
  <a href="/privacy" style={{ color: "#4FA3FF" }}>Privacy Policy</a>,{" "}
  <a href="/guidelines" style={{ color: "#4FA3FF" }}>Community Guidelines</a>, and{" "}
  <a href="/contact" style={{ color: "#4FA3FF" }}>Contact Page</a>.
</p>

    </div>
  );
};

export default Terms;
