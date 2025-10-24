import React, { useEffect, useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  // ✅ Handle form data changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle form submit (simulated)
  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulated form submission
    setTimeout(() => {
      setSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
    }, 1000);
  };

  // ✅ SEO + AdSense Meta Data Injection
  useEffect(() => {
    // Title
    document.title = "Contact Wakiee | Connect, Support & Feedback";

    // Canonical
    const canonical = document.querySelector("link[rel='canonical']");
    if (canonical) {
      canonical.setAttribute("href", "https://wakiee.live/contact");
    } else {
      const link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      link.setAttribute("href", "https://wakiee.live/contact");
      document.head.appendChild(link);
    }

    // Meta Description
    const descContent =
      "Get in touch with Wakiee — the random video chat platform. Contact our support team for help, feedback, or partnership inquiries.";
    let descTag = document.querySelector("meta[name='description']");
    if (!descTag) {
      descTag = document.createElement("meta");
      descTag.setAttribute("name", "description");
      document.head.appendChild(descTag);
    }
    descTag.setAttribute("content", descContent);

    // Meta Keywords
    const keywords =
      "contact wakiee, wakiee support, random video chat help, contact random chat team, wakiee feedback, partnership with wakiee, adsense contact page, wakiee support email, chat support form, wakiee live chat contact";
    let keywordTag = document.querySelector("meta[name='keywords']");
    if (!keywordTag) {
      keywordTag = document.createElement("meta");
      keywordTag.setAttribute("name", "keywords");
      document.head.appendChild(keywordTag);
    }
    keywordTag.setAttribute("content", keywords);

    // Open Graph
   // ✅ Open Graph (safe injection, prevents duplicate tags)
const ogData = [
  { property: "og:title", content: "Contact Wakiee | Connect, Support & Feedback" },
  {
    property: "og:description",
    content:
      "Have questions or feedback? Reach out to Wakiee’s team for support or collaboration. We’re here to help you chat safely and globally.",
  },
  { property: "og:type", content: "website" },
  { property: "og:url", content: "https://wakiee.live/contact" },
  { property: "og:image", content: "https://wakiee.live/og-image.jpg" },
  { property: "og:site_name", content: "Wakiee" },
];

ogData.forEach((data) => {
  // only create if it doesn't already exist
  if (!document.querySelector(`meta[property='${data.property}']`)) {
    const meta = document.createElement("meta");
    meta.setAttribute("property", data.property);
    meta.setAttribute("content", data.content);
    document.head.appendChild(meta);
  }
});


    // JSON-LD Structured Data for Google
    const ldJson = document.createElement("script");
    ldJson.type = "application/ld+json";
    ldJson.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "name": "Contact Wakiee",
      "url": "https://wakiee.live/contact",
      "description":
        "Official contact page for Wakiee — reach our support team, share feedback, or inquire about collaborations.",
      "publisher": {
        "@type": "Organization",
        "name": "Wakiee",
        "url": "https://wakiee.live",
        "logo": "https://wakiee.live/android-chrome-192x192.png",
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "email": "contact@wakiee.live",
        "contactType": "Customer Support",
        "areaServed": "Worldwide",
        "availableLanguage": "English",
      },
    });
    document.head.appendChild(ldJson);
  }, []);

  return (
    <div
      style={{
        padding: "40px 20px",
        maxWidth: "900px",
        margin: "auto",
        lineHeight: "1.6",
        fontFamily: "Poppins, sans-serif",
        color: "white",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        Contact Wakiee
      </h1>

      <p style={{ textAlign: "center", marginBottom: "20px" }}>
        Have a question, feedback, or collaboration idea? We’d love to hear from
        you! Our team is here to help ensure that your experience on Wakiee is
        smooth, safe, and enjoyable.
      </p>

      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "#1f1f1f",
          borderRadius: "12px",
          padding: "30px",
          boxShadow: "0 0 20px rgba(0,0,0,0.4)",
        }}
      >
        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="contact-name" style={{ display: "block", marginBottom: "10px" }}>
            Your Name:
          </label>
          <input
            id="contact-name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            aria-required="true"
            autoComplete="name"
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="contact-email" style={{ display: "block", marginBottom: "10px" }}>
            Your Email:
          </label>
          <input
            id="contact-email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            aria-required="true"
            autoComplete="email"
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="contact-message" style={{ display: "block", marginBottom: "10px" }}>
            Your Message:
          </label>
          <textarea
            id="contact-message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            aria-required="true"
            rows={5}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              resize: "vertical",
            }}
          ></textarea>
        </div>

        <button
          type="submit"
          style={{
            backgroundColor: "#00c3ff",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "12px 20px",
            cursor: "pointer",
            width: "100%",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          Submit
        </button>

        {submitted && (
          <div
            role="status"
            aria-live="polite"
            style={{
              marginTop: "20px",
              padding: "15px",
              backgroundColor: "#28a745",
              borderRadius: "8px",
              color: "#fff",
              textAlign: "center",
              fontWeight: "600",
            }}
          >
            ✅ Thank you for contacting us! We’ll get back to you soon.
          </div>
        )}
<p
  style={{
    fontSize: "13px",
    marginTop: "12px",
    opacity: 0.8,
    lineHeight: "1.6",
  }}
>
  By submitting this form, you agree that Wakiee may temporarily store your message
  for support and response purposes. We do not sell or share your personal data.
  Learn more in our{" "}
  <a href="/privacy" style={{ color: "#00c3ff" }}>
    Privacy Policy
  </a>
  .
</p>

      </form>

      <p
        style={{
          marginTop: "30px",
          textAlign: "center",
          fontSize: "17px",
          lineHeight: "1.8",
        }}
      >
        📧 You can also email us directly at:{" "}
        <a
          href="mailto:contact@wakiee.live"
          style={{ color: "#00c3ff", textDecoration: "none" }}
        >
          contact@wakiee.live
        </a>
        <br />
        📍 <strong>Wakiee Technologies, Delhi, India</strong>
      </p>

      <p style={{ textAlign: "center", marginTop: "20px", opacity: 0.8 }}>
        Wakiee ensures your privacy and does not share your contact details with
        anyone. By submitting this form, you agree to our{" "}
        <a href="/privacy-policy" style={{ color: "#00c3ff" }}>
          Privacy Policy
        </a>{" "}
        and{" "}
        <a href="/terms" style={{ color: "#00c3ff" }}>
          Terms of Service
        </a>
        .
      </p>
    </div>
  );
};

export default Contact;
