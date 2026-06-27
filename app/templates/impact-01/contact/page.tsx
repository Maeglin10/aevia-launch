"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, MapPin, Phone, Send } from "lucide-react";
import Link from "next/link";

const T = {
  bg: "#0a0a0a",
  text: "#f0f0f0",
  muted: "#666666",
  dimmed: "#333333",
  accent: "#0066ff",
  accentDim: "rgba(0,102,255,0.15)",
  accentBorder: "rgba(0,102,255,0.3)",
  border: "rgba(240,240,240,0.06)",
  surface: "rgba(240,240,240,0.03)",
  surfaceHover: "rgba(240,240,240,0.06)",
};

const FONT_HEADING = "'Syne', sans-serif";
const FONT_BODY = "'Inter', sans-serif";

export default function ContactPage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: T.bg, color: T.text, fontFamily: FONT_BODY }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px" }}>
        <Link href="/templates/impact-01" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: T.muted, textDecoration: "none", marginBottom: 60, fontSize: "0.9rem", transition: "color 0.2s" }} onMouseOver={(e) => (e.currentTarget.style.color = T.text)} onMouseOut={(e) => (e.currentTarget.style.color = T.muted)}>
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 style={{ fontFamily: FONT_HEADING, fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 800, margin: "0 0 24px 0", letterSpacing: "-0.02em" }}>
            Let's start a <span style={{ color: T.accent }}>project.</span>
          </h1>
          <p style={{ color: T.muted, fontSize: "1.125rem", maxWidth: 600, lineHeight: 1.6, margin: "0 0 60px 0" }}>
            Ready to elevate your digital presence? We're currently accepting new projects for Q3. Fill out the form below and we'll get back to you within 24 hours.
          </p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 60 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
            <form style={{ display: "flex", flexDirection: "column", gap: 24 }} onSubmit={(e) => e.preventDefault()}>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label style={{ fontSize: "0.875rem", fontWeight: 500, color: T.text }}>Name</label>
                <input type="text" placeholder="John Doe" style={{ width: "100%", padding: "16px", backgroundColor: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, color: T.text, outline: "none", fontSize: "1rem", fontFamily: FONT_BODY }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label style={{ fontSize: "0.875rem", fontWeight: 500, color: T.text }}>Email</label>
                <input type="email" placeholder="john@example.com" style={{ width: "100%", padding: "16px", backgroundColor: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, color: T.text, outline: "none", fontSize: "1rem", fontFamily: FONT_BODY }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label style={{ fontSize: "0.875rem", fontWeight: 500, color: T.text }}>Project Details</label>
                <textarea placeholder="Tell us about your project..." rows={5} style={{ width: "100%", padding: "16px", backgroundColor: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, color: T.text, outline: "none", fontSize: "1rem", fontFamily: FONT_BODY, resize: "vertical" }} />
              </div>
              <button style={{ backgroundColor: T.accent, color: "#fff", border: "none", borderRadius: 8, padding: "16px", fontSize: "1rem", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer", transition: "background-color 0.2s" }} onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#0052cc")} onMouseOut={(e) => (e.currentTarget.style.backgroundColor = T.accent)}>
                Send Message <Send size={18} />
              </button>
            </form>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} style={{ display: "flex", flexDirection: "column", gap: 40 }}>
            <div>
              <h3 style={{ fontFamily: FONT_HEADING, fontSize: "1.5rem", fontWeight: 700, margin: "0 0 24px 0" }}>Contact Information</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16, color: T.muted }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", backgroundColor: T.surface, display: "flex", alignItems: "center", justifyContent: "center", color: T.accent }}>
                    <Mail size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.875rem", marginBottom: 4 }}>Email Us</div>
                    <div style={{ color: T.text, fontWeight: 500 }}>hello@impact-agency.com</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 16, color: T.muted }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", backgroundColor: T.surface, display: "flex", alignItems: "center", justifyContent: "center", color: T.accent }}>
                    <Phone size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.875rem", marginBottom: 4 }}>Call Us</div>
                    <div style={{ color: T.text, fontWeight: 500 }}>+33 1 23 45 67 89</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 16, color: T.muted }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", backgroundColor: T.surface, display: "flex", alignItems: "center", justifyContent: "center", color: T.accent }}>
                    <MapPin size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.875rem", marginBottom: 4 }}>Visit Us</div>
                    <div style={{ color: T.text, fontWeight: 500 }}>123 Creative Ave, Paris, France</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
