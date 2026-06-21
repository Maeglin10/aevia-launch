"use client";

import React, { useState } from "react";
import { Mail, MessageSquare, Terminal, Send } from "lucide-react";
import { Reveal } from "../shared";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "", company: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main style={{ background: "#050510", padding: "120px 24px" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        
        {/* Header */}
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 80 }}>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "#00ffd1",
                marginBottom: 12,
                display: "block",
              }}
            >
              Early Access & Support
            </span>
            <h1
              style={{
                fontSize: "clamp(32px, 5vw, 64px)",
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                lineHeight: 1.25,
                paddingBottom: "8px",
                letterSpacing: "-0.03em",
                color: "#e8e8ff",
                marginBottom: 16,
              }}
            >
              Connect with raw compute.
            </h1>
            <p
              style={{
                fontSize: 16,
                color: "rgba(232,232,255,0.45)",
                lineHeight: 1.6,
                maxWidth: 600,
                margin: "0 auto",
              }}
            >
              Request sandbox access credentials or contact our core engineering team for custom model training.
            </p>
          </div>
        </Reveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.2fr",
            gap: 48,
          }}
          className="grid grid-cols-1 md:grid-cols-2"
        >
          {/* Info cards */}
          <Reveal>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div
                style={{
                  background: "rgba(124, 58, 237, 0.02)",
                  border: "1px solid rgba(124, 58, 237, 0.1)",
                  borderRadius: 16,
                  padding: 32,
                }}
              >
                <div style={{ display: "flex", gap: 16, alignItems: "start" }}>
                  <div style={{ padding: 10, background: "rgba(0, 255, 209, 0.08)", color: "#00ffd1", borderRadius: 8 }}>
                    <Terminal size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: "#e8e8ff", marginBottom: 6 }}>API Sandbox Keys</h3>
                    <p style={{ fontSize: 13, color: "rgba(232,232,255,0.45)", lineHeight: 1.5 }}>
                      Need automated keys to test high-volume canvas renders? Get tokens instantly via early preview queue.
                    </p>
                  </div>
                </div>
              </div>

              <div
                style={{
                  background: "rgba(124, 58, 237, 0.02)",
                  border: "1px solid rgba(124, 58, 237, 0.1)",
                  borderRadius: 16,
                  padding: 32,
                }}
              >
                <div style={{ display: "flex", gap: 16, alignItems: "start" }}>
                  <div style={{ padding: 10, background: "rgba(124, 58, 237, 0.08)", color: "#7c3aed", borderRadius: 8 }}>
                    <Mail size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: "#e8e8ff", marginBottom: 6 }}>Direct Outreach</h3>
                    <p style={{ fontSize: 13, color: "rgba(232,232,255,0.45)", lineHeight: 1.5, marginBottom: 8 }}>
                      For custom cluster quotes and on-prem SLA configurations:
                    </p>
                    <a href="mailto:support@artgen.studio" style={{ color: "#00ffd1", fontSize: 13, textDecoration: "none" }}>
                      support@artgen.studio
                    </a>
                  </div>
                </div>
              </div>

              <div
                style={{
                  background: "rgba(124, 58, 237, 0.02)",
                  border: "1px solid rgba(124, 58, 237, 0.1)",
                  borderRadius: 16,
                  padding: 32,
                }}
              >
                <div style={{ display: "flex", gap: 16, alignItems: "start" }}>
                  <div style={{ padding: 10, background: "rgba(124, 58, 237, 0.08)", color: "#7c3aed", borderRadius: 8 }}>
                    <MessageSquare size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: "#e8e8ff", marginBottom: 6 }}>General Inquiries</h3>
                    <p style={{ fontSize: 13, color: "rgba(232,232,255,0.45)", lineHeight: 1.5 }}>
                      For licensing, partnership requests, and media assets. Expect reply in under 24 hours.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Form */}
          <Reveal delay={0.1}>
            <div
              style={{
                background: "rgba(124, 58, 237, 0.04)",
                border: "1px solid rgba(124, 58, 237, 0.15)",
                borderRadius: 20,
                padding: 40,
              }}
            >
              {submitted ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <div style={{ width: 48, height: 48, background: "rgba(0, 255, 209, 0.1)", borderRadius: 24, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                    <Send style={{ width: 20, height: 20, color: "#00ffd1" }} />
                  </div>
                  <h3 style={{ fontSize: 20, fontFamily: "'Syne', sans-serif", fontWeight: 700, marginBottom: 12 }}>
                    Early Access Request Queued
                  </h3>
                  <p style={{ fontSize: 14, color: "rgba(232,232,255,0.45)", lineHeight: 1.6 }}>
                    Merci, nous vous répondrons sous 24h.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", color: "rgba(232,232,255,0.4)" }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      style={{
                        background: "rgba(5,5,16,0.6)",
                        border: "1px solid rgba(124,58,237,0.2)",
                        borderRadius: 8,
                        padding: "12px 16px",
                        color: "#e8e8ff",
                        fontSize: 14,
                        outline: "none",
                      }}
                      placeholder="Jane Doe"
                    />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", color: "rgba(232,232,255,0.4)" }}>
                      Work Email
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{
                        background: "rgba(5,5,16,0.6)",
                        border: "1px solid rgba(124,58,237,0.2)",
                        borderRadius: 8,
                        padding: "12px 16px",
                        color: "#e8e8ff",
                        fontSize: 14,
                        outline: "none",
                      }}
                      placeholder="jane@studio.com"
                    />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", color: "rgba(232,232,255,0.4)" }}>
                      Company / Studio
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      style={{
                        background: "rgba(5,5,16,0.6)",
                        border: "1px solid rgba(124,58,237,0.2)",
                        borderRadius: 8,
                        padding: "12px 16px",
                        color: "#e8e8ff",
                        fontSize: 14,
                        outline: "none",
                      }}
                      placeholder="Atelier Labs"
                    />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", color: "rgba(232,232,255,0.4)" }}>
                      Message / Use Case
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      style={{
                        background: "rgba(5,5,16,0.6)",
                        border: "1px solid rgba(124,58,237,0.2)",
                        borderRadius: 8,
                        padding: "12px 16px",
                        color: "#e8e8ff",
                        fontSize: 14,
                        outline: "none",
                        resize: "none",
                      }}
                      placeholder="Tell us about the generative rendering layout you want to scale..."
                    />
                  </div>

                  <button
                    type="submit"
                    style={{
                      background: "linear-gradient(135deg, #7c3aed, #5b21b6)",
                      border: "none",
                      color: "#fff",
                      fontSize: 13,
                      fontWeight: 600,
                      padding: "14px 0",
                      borderRadius: 8,
                      cursor: "pointer",
                      boxShadow: "0 0 20px rgba(124,58,237,0.4)",
                      marginTop: 8,
                    }}
                  >
                    Request Early Sandbox Key
                  </button>
                </form>
              )}
            </div>
          </Reveal>
        </div>

      </div>
    </main>
  );
}
