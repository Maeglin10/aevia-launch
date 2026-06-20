"use client";

import React, { useState } from "react";
import { C, TextReveal, MagneticButton } from "../shared";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inputStyle = {
    width: "100%",
    background: C.bgCard,
    border: `1px solid ${C.border}`,
    borderRadius: 2,
    padding: "12px 16px",
    color: C.cream,
    fontSize: 14,
    fontFamily: "'Space Grotesk', sans-serif",
    outline: "none",
    marginTop: 6,
    boxSizing: "border-box" as const,
  };

  const labelStyle = {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: "0.15em",
    color: C.moss,
    textTransform: "uppercase" as const,
  };

  return (
    <div style={{ background: C.bg, minHeight: "85vh", padding: "60px 0" }}>
      <div style={{ maxWidth: 720, margin: "0 auto", paddingInline: 32 }}>
        
        {/* Header */}
        <div style={{ borderBottom: `1px solid ${C.border}`, paddingBottom: 40, marginBottom: 48 }}>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, letterSpacing: "0.35em", color: C.moss, textTransform: "uppercase", marginBottom: 16 }}>Inquiries</p>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 900, letterSpacing: "-0.03em", color: C.cream, lineHeight: 1.1 }}>
            <TextReveal text="Get in Touch" />
          </h1>
        </div>

        {/* Content */}
        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, padding: 40, borderRadius: 4 }}>
          {submitted ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", border: `2px solid ${C.amber}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.amber} strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3 style={{ fontFamily: "'Archivo', sans-serif", fontSize: 24, fontWeight: 700, color: C.cream, marginBottom: 12 }}>Merci</h3>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, color: C.muted, lineHeight: 1.6 }}>
                Merci, nous vous répondrons sous 24h.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div>
                <label style={labelStyle}>Full Name</label>
                <input type="text" required style={inputStyle} placeholder="Your name" />
              </div>

              <div>
                <label style={labelStyle}>Email Address</label>
                <input type="email" required style={inputStyle} placeholder="name@domain.com" />
              </div>

              <div>
                <label style={labelStyle}>Inquiry Type</label>
                <select style={{ ...inputStyle, appearance: "none" }} required>
                  <option value="collect">Fine Art Prints & Collecting</option>
                  <option value="license">Image Licensing</option>
                  <option value="commission">Commercial Commission</option>
                  <option value="other">General Inquiry</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Message</label>
                <textarea required rows={5} style={{ ...inputStyle, resize: "vertical" }} placeholder="Describe your inquiry..." />
              </div>

              <div style={{ marginTop: 12 }}>
                <MagneticButton style={{ width: "100%", fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: C.bg, background: C.cream, padding: "16px", borderRadius: 2, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, border: "none", cursor: "pointer" }}>
                  Send Message
                </MagneticButton>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
