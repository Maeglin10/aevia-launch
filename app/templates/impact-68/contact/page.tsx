"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Clock, Shield } from "lucide-react";
import { C } from "../shared";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    budget: "€8,000 - €15,000",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section style={{ padding: "80px 40px", background: C.bg, minHeight: "80vh" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "start" }} className="grid-hero-68">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.2em",
                color: C.accent,
                textTransform: "uppercase",
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <span style={{ display: "inline-block", width: "24px", height: "1px", background: C.accent }} />
              Let's Talk
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "clamp(36px, 5vw, 60px)",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: C.text,
                marginBottom: "32px",
                lineHeight: 1.05,
                textAlign: "left",
              }}
            >
              Ready to build
              <br />
              <span style={{ color: C.accent }}>something real?</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "17px",
                lineHeight: 1.7,
                color: C.textMuted,
                marginBottom: "48px",
                textAlign: "left",
              }}
            >
              We're selective about new projects. Tell us what you're building and we'll respond within 48 hours with an honest assessment of how we can help — or who else might.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center" }}
            >
              <a
                href="mailto:valentinmilliand@aevia.services"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "15px",
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                  color: C.white,
                  background: C.accent,
                  padding: "18px 40px",
                  textDecoration: "none",
                  borderRadius: "2px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  transition: "transform 0.15s, background 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "scale(0.97)";
                  (e.currentTarget as HTMLElement).style.background = C.accentDark;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                  (e.currentTarget as HTMLElement).style.background = C.accent;
                }}
              >
                <Mail size={16} />
                valentinmilliand@aevia.services
              </a>
              <div
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "13px",
                  color: C.textMuted,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Clock size={14} />
                Responding within 48h
              </div>
            </motion.div>
          </div>

          <div>
            {submitted ? (
              <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, padding: "60px", textAlign: "center" }}>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "14px", color: C.accent }}>Merci, nous vous répondrons sous 24h.</p>
              </div>
            ) : (
            <form onSubmit={handleSubmit} style={{ background: C.bgCard, border: `1px solid ${C.border}`, padding: "40px", display: "flex", flexDirection: "column", gap: "24px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", textAlign: "left" }}>
                <label style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "11px", fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.1em" }}>YOUR NAME</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ background: C.bg, border: `1px solid ${C.border}`, padding: "12px 16px", color: C.text, fontFamily: "'Space Grotesk', sans-serif", outline: "none" }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px", textAlign: "left" }}>
                <label style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "11px", fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.1em" }}>YOUR EMAIL</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{ background: C.bg, border: `1px solid ${C.border}`, padding: "12px 16px", color: C.text, fontFamily: "'Space Grotesk', sans-serif", outline: "none" }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px", textAlign: "left" }}>
                <label style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "11px", fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.1em" }}>ESTIMATED BUDGET</label>
                <select
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  style={{ background: C.bg, border: `1px solid ${C.border}`, padding: "12px 16px", color: C.text, fontFamily: "'Space Grotesk', sans-serif", outline: "none" }}
                >
                  <option>Below €8,000</option>
                  <option>€8,000 - €15,000</option>
                  <option>€15,000 - €30,000</option>
                  <option>Above €30,000</option>
                </select>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px", textAlign: "left" }}>
                <label style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "11px", fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.1em" }}>PROJECT BRIEF</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  style={{ background: C.bg, border: `1px solid ${C.border}`, padding: "12px 16px", color: C.text, fontFamily: "'Space Grotesk', sans-serif", outline: "none", resize: "none" }}
                />
              </div>

              <button
                type="submit"
                style={{
                  background: C.accent,
                  color: C.white,
                  border: "none",
                  padding: "16px",
                  fontWeight: 600,
                  fontFamily: "'Space Grotesk', sans-serif",
                  cursor: "pointer",
                  letterSpacing: "0.05em",
                }}
              >
                Send Brief
              </button>
            </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
