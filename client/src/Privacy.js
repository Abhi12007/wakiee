// client/src/Privacy.js
import React, { useEffect } from "react";

const Privacy = () => {
  useEffect(() => {
    // ✅ Set SEO Title
    document.title = "Privacy Policy | Wakiee — Safe Anonymous Video Chat Platform";

    // ✅ Canonical Tag
    const canonicalLink = document.querySelector("link[rel='canonical']");
    if (canonicalLink) {
      canonicalLink.setAttribute("href", "https://wakiee.live/privacy");
    } else {
      const link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      link.setAttribute("href", "https://wakiee.live/privacy");
      document.head.appendChild(link);
    }

    // ✅ Meta Description
    const metaDesc = document.querySelector("meta[name='description']");
    const description =
      "Read Wakiee's Privacy Policy — learn how we protect your data, ensure safe anonymous video chats, comply with AdSense policies, and respect your online privacy.";
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
      "wakiee privacy policy, anonymous video chat privacy, data safety, random chat protection, secure video calling, COPPA compliance, AdSense privacy policy, GDPR compliant chat, online safety, private video calls, safe chatting platform";
    const metaKeywords = document.querySelector("meta[name='keywords']");
    if (metaKeywords) {
      metaKeywords.setAttribute("content", keywords);
    } else {
      const meta = document.createElement("meta");
      meta.setAttribute("name", "keywords");
      meta.setAttribute("content", keywords);
      document.head.appendChild(meta);
    }

    // ✅ Open Graph / Social Meta Tags
    const ogTags = [
      { property: "og:title", content: "Privacy Policy | Wakiee — Safe Anonymous Video Chat" },
      {
        property: "og:description",
        content:
          "Discover how Wakiee keeps your video chats private and secure. No tracking, no data storage — just safe global connections.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://wakiee.live/privacy" },
      { property: "og:image", content: "https://wakiee.live/og-image.jpg" },
      { property: "og:site_name", content: "Wakiee" },
    ];
    ogTags.forEach((tag) => {
      const meta = document.createElement("meta");
      meta.setAttribute("property", tag.property);
      meta.setAttribute("content", tag.content);
      document.head.appendChild(meta);
    });

    // ✅ JSON-LD Structured Data (Google Rich Snippet)
    const ldJson = document.createElement("script");
    ldJson.text = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Privacy Policy | Wakiee",
  "url": "https://wakiee.live/privacy",
  "description":
    "Official Privacy Policy of Wakiee — learn how we handle data, cookies, and Google AdSense ads safely and transparently.",
  "publisher": {
    "@type": "Organization",
    "name": "Wakiee",
    "url": "https://wakiee.live",
    "logo": "https://wakiee.live/android-chrome-192x192.png"
  }
});

    document.head.appendChild(ldJson);
  }, []);

  return (
    <div style={{ padding: "30px", maxWidth: "900px", margin: "auto", lineHeight: "1.6", fontFamily: "Poppins, sans-serif", color: "white" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Privacy Policy for Wakiee</h1>
      <p><strong>Last Updated:</strong> October 2025</p>

      <p>
        Welcome to <strong>Wakiee</strong> (the “Website”, “Site”, “We”, “Us”, or “Our”), accessible from{" "}
        <a href="https://wakiee.live" target="_blank" rel="noopener noreferrer" style={{ color: "#4FA3FF" }}>
          https://wakiee.live
        </a>.
        This Privacy Policy explains how we collect, use, and protect your information when you use our services, including video chat, blog access, and related features.
      </p>
      <p>
        By using Wakiee, you agree to this Privacy Policy and our{" "}
        <a href="/terms" style={{ color: "#4FA3FF" }}>Terms of Service</a>.
      </p>

      <h2>1. Who We Are</h2>
      <p>
        Wakiee is an online platform operated by <strong>Wakiee Technologies</strong>, based in India.
        We provide anonymous peer-to-peer video chat and communication features that allow users to connect, talk, and share experiences safely and respectfully. Our goal is to create a fun, global, and privacy-conscious environment for all users.
      </p>

      <h3>Data Controller</h3>
      <p>
        The data controller responsible for your personal information is <strong>Wakiee Technologies</strong>,
        operating in India. For privacy-related matters, contact us at <strong>contact@wakiee.live</strong>.
      </p>

      <h2>2. Information We Process</h2>
      <p>
        Wakiee is designed to operate anonymously. We do not collect personally identifiable information
        such as names, phone numbers, or email addresses for chat participation. However, we may process
        limited technical and operational data to maintain and improve our services.
      </p>
      <ul>
        <li>Technical Information: Browser type, IP address (anonymized), device type, and session duration.</li>
        <li>Video & Audio Permissions: Temporary access to your camera and microphone is granted only when you start a chat. We do not record, store, or share this data.</li>
        <li>Chat Functionality: Text messages are temporary and not stored once you disconnect.</li>
        <li>Cookies: We use cookies for analytics, ad performance, and user experience improvements.</li>
        <li>Blog Section: If you comment or interact with blog content, basic analytics (like views or device data) may be collected.</li>
        <li>Moderation: Wakiee uses a combination of <strong> AI-based and human moderation</strong> systems to detect and remove inappropriate or unsafe content in real time.This helps maintain a respectful and positive environment for all users.</li>
</ul>

      <h2>3. How We Use the Information</h2>
      <ul>
        <li>Maintain site functionality and user experience.</li>
        <li>Detect and resolve technical issues.</li>
        <li>Analyze usage trends for performance improvements.</li>
        <li>Deliver and personalize third-party advertisements (Google AdSense).</li>
      </ul>

      <h2>4. Third-Party Advertising & Cookies</h2>
      <p>
        Wakiee displays third-party ads, including Google AdSense. These networks may use cookies, web beacons,
        and tracking pixels to show personalized ads based on user interests.
      </p>
      <p>
        Google uses the DoubleClick DART cookie to serve ads to users based on their previous visits to our
        site and other websites. You can opt out of personalized advertising by visiting{" "}
        <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" style={{ color: "#4FA3FF" }}>
          Google Ads Settings
        </a>.
      </p>
      <ul>
        <li>Understand how visitors use our website.</li>
        <li>Show relevant advertisements.</li>
        <li>Improve site functionality and analytics.</li>
      </ul>
      <p>You can disable cookies through your browser settings, but some parts of the site may not function properly.</p>
            <h2>4.1 Cookie Consent and AdSense Compliance</h2>
<p>
  Wakiee uses cookies, localStorage, and similar technologies to improve functionality, 
  analyze performance, and deliver personalized advertisements through <strong>Google AdSense</strong>.
</p>
<p>
  By using Wakiee, you consent to the use of these cookies in accordance with this Privacy Policy. 
  You may manage or withdraw consent anytime via your browser settings.
</p>
<p>
  <strong>Third-party vendors, including Google</strong>, use cookies to serve ads based on a user's 
  previous visits to Wakiee or other websites. 
  Google's use of the <strong>DoubleClick DART cookie</strong> enables it and its partners 
  to serve ads based on your activity across the web. 
  You can opt out of personalized advertising by visiting 
  <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" style={{ color: "#4FA3FF" }}>
    Google Ads Settings
  </a>.
</p>


      <h3>Behavioral Advertising Opt-Out</h3>
      <p>
        You can opt out of personalized Google advertising by visiting{" "}
        <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" style={{ color: "#4FA3FF" }}>
          https://adssettings.google.com
        </a>. To learn more about third-party ad practices, visit{" "}
        <a href="https://www.aboutads.info/choices" target="_blank" rel="noopener noreferrer" style={{ color: "#4FA3FF" }}>
          https://www.aboutads.info/choices
        </a>.
      </p>

      <h3>Sponsored Content & Affiliate Links</h3>
      <p>
        Wakiee may occasionally include sponsored or affiliate links in its blog posts. Clicking on these
        links may result in a small commission to Wakiee, at no extra cost to you. We ensure all such
        partnerships are disclosed transparently.
      </p>

    <h2>5. Information We Collect</h2>
      <ul>
        <li>IP address (anonymized)</li>
        <li>Device and browser type</li>
        <li>Operating system</li>
        <li>Referring URLs and session duration</li>
      </ul>

      <h2>6. How We Protect Your Information</h2>
      <p>
        We implement strong security practices to safeguard data. Although no online system is 100% secure,
        Wakiee takes reasonable precautions to prevent unauthorized access, including encryption, firewall
        protection, and limited data retention.
      </p>

      <h2>7. Compliance with COPPA (Children's Online Privacy Protection Act)</h2>
      <p>
        Wakiee complies fully with COPPA and does not knowingly collect information from anyone under 18
        years of age. Our services are intended for adults only. If a parent or guardian believes a minor
        has accessed Wakiee, they should contact us immediately so we can remove any related data or restrict
        access.
      </p>

      

      <h2>9. Your Data Protection Rights</h2>
      <ul>
        <li>The right to access any data we may hold about you.</li>
        <li>The right to request correction or deletion of data.</li>
        <li>The right to object to data processing for marketing purposes.</li>
        <li>The right to withdraw consent to cookie-based tracking.</li>
      </ul>
      <p>To exercise these rights, please contact us at <strong>contact@wakiee.live</strong>.</p>

      <h2>10. Children’s Privacy</h2>
      <p>
        Wakiee does not knowingly allow users under the age of 18. We encourage parents and guardians to
        monitor their children’s internet usage. If we discover that a child has accessed our services,
        their session will be terminated, and no data will be retained.
      </p>

      <h2>11. Blog and Community Interaction</h2>
      <p>
        Our Blog section provides educational and community-related content. Comments, if enabled, should
        not include personal information. We may moderate blog comments to maintain a respectful environment.
      </p>

      <h2>12. External Links</h2>
      <p>
        Wakiee may contain links to third-party websites. We are not responsible for the content or privacy
        practices of these sites. We encourage users to read the privacy policies of any linked websites
        they visit.
      </p>

      <h2>13. Use of Analytics</h2>
      <p>
        We use analytics tools such as Google Analytics to understand how users interact with Wakiee. This
        data is anonymous and used solely for improving our services.
      </p>

      <h2>14. Retention of Data</h2>
      <p>
        Since Wakiee operates anonymously, we retain minimal technical data temporarily for troubleshooting
        and security monitoring. No chat, video, or personal information is permanently stored.
      </p>

      <h2>15. Data Sharing</h2>
      <p>
        We do not sell, trade, or share user data with any third party. Data may be shared only with trusted
        service providers (like hosting or analytics) under strict confidentiality agreements.
      </p>
          <h2>15.1 Third-Party Ad Vendors</h2>
<p>
  Wakiee partners with third-party vendors, including <strong>Google AdSense</strong>, 
  to display relevant advertisements. These vendors may use cookies and similar technologies 
  to collect non-personal browsing data for ad personalization and measurement.
</p>
<p>
  Users may opt out of the use of personalized advertising cookies by visiting 
  <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" style={{ color: "#4FA3FF" }}>
    Google Ad Settings
  </a>.
</p>


      <h2>16. Legal Compliance</h2>
      <p>
        Wakiee may disclose limited data if required by law, government request, or legal process, but only
        when necessary and permitted under applicable regulations.
      </p>

      <h3>International Data Transfers</h3>
      <p>
        Our hosting servers may be located outside of India. By using Wakiee, you consent to the transfer
        and processing of your data in accordance with this Privacy Policy.
      </p>

      <h2>17. Security & Changes</h2>
      <p>
        We continuously update our security measures to address evolving threats. You are encouraged to use
        updated browsers and devices for optimal protection while using Wakiee.
      </p>

      <h2>18. Changes to Our Privacy Policy</h2>
      <p>
        We may update this Privacy Policy periodically. The “Last Updated” date will reflect the most recent
        revision. Continued use of Wakiee after any update signifies your acceptance of the changes.
      </p>

      <h2>19. Breach of Privacy Policy</h2>
      <p>
        Any breach or suspected misuse of personal data will be promptly investigated. If necessary, we will
        notify affected users and relevant authorities in compliance with applicable data protection laws.
      </p>

      <h2>20. California Privacy Rights (CCPA)</h2>
      <p>
        Under the California Consumer Privacy Act (CCPA), California residents have the right to request
        details about personal information collected, disclosed, or sold. Wakiee does not sell or share
        personal data. California users can contact <strong>contact@wakiee.live</strong> to request access
        or deletion of any related information.
      </p>

      <h2>21. Consent</h2>
      <p>
        By using Wakiee, you consent to our Privacy Policy and agree to its terms. If you do not agree,
        please stop using our website immediately.
      </p>

      <h2>22. Governing Law</h2>
      <p>
        This Privacy Policy is governed by the laws of India, and any disputes shall be subject to the
        jurisdiction of the courts in Delhi, India.
      </p>

      <h2>23. Contact Us</h2>
      <p>
        For questions, concerns, or privacy-related requests, contact us at:<br />
        📧 <strong>contact@wakiee.live</strong><br />
        📍 <strong>Wakiee Technologies, Delhi, India</strong>
      </p>
    </div>
  );
};

export default Privacy;
