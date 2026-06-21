"use client";

import React, { useState } from "react";
import { Mail, MessageSquare, Phone } from "lucide-react";
import { T, Reveal } from "../shared";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main style={{ background: "#ffffff", paddingTop: 140, paddingBottom: 100 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 40px" }}>
        <Reveal>
          <div style={{ marginBottom: 80, maxWidth: 640 }}>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: T.accent,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                fontFamily: T.bodyFont,
                marginBottom: 12,
                display: "block",
              }}
            >
              Contact Us
            </span>
            <h1
              style={{
                fontSize: "clamp(32px, 5vw, 56px)",
                fontWeight: 700,
                letterSpacing: "-0.04em",
                color: T.text,
                fontFamily: T.headingFont,
                lineHeight: 1.25,
                paddingBottom: "8px",
                marginBottom: 12,
              }}
            >
              Let's build together
            </h1>
            <p
              style={{
                fontSize: 16,
                color: T.muted,
                fontFamily: T.bodyFont,
                lineHeight: 1.5,
              }}
            >
              Have a question about volume pricing, SOC 2 compliance, or custom database integrations? Reach out and we'll reply shortly.
            </p>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 64, alignItems: "start" }}>
          {/* Form */}
          <Reveal>
            <div
              style={{
                background: "#fafafa",
                border: `1px solid ${T.border}`,
                borderRadius: 16,
                padding: 40,
              }}
            >
              {submitted ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <h3 style={{ fontSize: 20, fontWeight: 700, fontFamily: T.headingFont, marginBottom: 8 }}>
                    Message sent!
                  </h3>
                  <p style={{ fontSize: 14, color: T.muted, fontFamily: T.bodyFont }}>
                    Merci, nous vous répondrons sous 24h.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <div style={{ display: "flex", gap: 16 }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: "block", fontSize: 11, fontWeight: 650, color: T.text, marginBottom: 8, fontFamily: T.bodyFont, textTransform: "uppercase" }}>
                        Name
                      </label>
                      <input
                        type="text"
                        required
                        style={{
                          width: "100%",
                          padding: "12px 14px",
                          borderRadius: 8,
                          border: `1px solid ${T.border}`,
                          fontSize: 13,
                          outline: "none",
                          fontFamily: T.bodyFont,
                        }}
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 650, color: T.text, marginBottom: 8, fontFamily: T.bodyFont, textTransform: "uppercase" }}>
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      style={{
                        width: "100%",
                        padding: "12px 14px",
                        borderRadius: 8,
                        border: `1px solid ${T.border}`,
                        fontSize: 13,
                        outline: "none",
                        fontFamily: T.bodyFont,
                      }}
                      placeholder="you@company.com"
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 650, color: T.text, marginBottom: 8, fontFamily: T.bodyFont, textTransform: "uppercase" }}>
                      Message
                    </label>
                    <textarea
                      required
                      rows={5}
                      style={{
                        width: "100%",
                        padding: "12px 14px",
                        borderRadius: 8,
                        border: `1px solid ${T.border}`,
                        fontSize: 13,
                        outline: "none",
                        fontFamily: T.bodyFont,
                        resize: "none",
                      }}
                      placeholder="Tell us about your pipeline integration or volume needs..."
                    />
                  </div>
                  <button
                    type="submit"
                    style={{
                      background: T.text,
                      color: "#fff",
                      border: "none",
                      borderRadius: 8,
                      padding: "14px 0",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: T.bodyFont,
                      marginTop: 8,
                    }}
                  >
                    Send message
                  </button>
                </form>
              )}
            </div>
          </Reveal>

          {/* Info */}
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            {[
              {
                icon: <Mail style={{ width: 18, height: 18, color: T.accent }} />,
                title: "Email Channels",
                value: "hello@nexus.io",
                desc: "General inquiries, developer reports, partnerships.",
              },
              {
                icon: <Phone style={{ width: 18, height: 18, color: T.green }} />,
                title: "Phone Escalation",
                value: "+33 4 74 12 34 56",
                desc: "For active customers and volume sales queries.",
              },
              {
                icon: <MessageSquare style={{ width: 18, height: 18, color: T.orange }} />,
                title: "Live Chat Support",
                value: "discord.gg/nexus",
                desc: "Get real-time feedback from our engineers in the server.",
              },
            ].map((info, idx) => (
              <Reveal key={idx} delay={idx * 0.1}>
                <div style={{ display: "flex", gap: 16 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: T.accentLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                    {info.icon}
                  </div>
                  <div>
                    <h4 style={{ fontSize: 14, fontWeight: 700, fontFamily: T.headingFont, marginBottom: 2 }}>
                      {info.title}
                    </h4>
                    <p style={{ fontSize: 13, fontWeight: 650, color: T.accent, fontFamily: T.bodyFont, marginBottom: 4 }}>
                      {info.value}
                    </p>
                    <p style={{ fontSize: 12, color: T.muted, fontFamily: T.bodyFont, lineHeight: 1.5 }}>
                      {info.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
