"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Monitor, Code2, Palette, Layers } from "lucide-react";
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

const SERVICES = [
  {
    icon: <Monitor size={28} />,
    title: "Web Design",
    desc: "Bespoke interfaces crafted with pixel-perfect precision and strategic UX thinking that converts visitors into customers.",
    tag: "UI/UX",
  },
  {
    icon: <Code2 size={28} />,
    title: "Development",
    desc: "High-performance applications built on modern stacks with seamless integrations and bulletproof reliability.",
    tag: "Engineering",
  },
  {
    icon: <Palette size={28} />,
    title: "Branding",
    desc: "Distinctive visual identities that resonate deeply with your target audience and stand apart from competitors.",
    tag: "Identity",
  },
  {
    icon: <Layers size={28} />,
    title: "Strategy",
    desc: "Data-driven growth strategies that compound over time, converting visitors into loyal brand advocates.",
    tag: "Growth",
  },
];

export default function ServicesPage() {
  return (
    <div style={{ minHeight: "100dvh", backgroundColor: T.bg, color: T.text, fontFamily: FONT_BODY }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px" }}>
        <Link href="/templates/impact-01" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: T.muted, textDecoration: "none", marginBottom: 60, fontSize: "0.9rem", transition: "color 0.2s" }} onMouseOver={(e) => (e.currentTarget.style.color = T.text)} onMouseOut={(e) => (e.currentTarget.style.color = T.muted)}>
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 style={{ fontFamily: FONT_HEADING, fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 800, margin: "0 0 24px 0", letterSpacing: "-0.02em" }}>
            Our <span style={{ color: T.accent }}>Services.</span>
          </h1>
          <p style={{ color: T.muted, fontSize: "1.125rem", maxWidth: 600, lineHeight: 1.6, margin: "0 0 60px 0" }}>
            We provide end-to-end digital solutions, from strategic consulting and brand identity to full-stack engineering and motion design.
          </p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
          {SERVICES.map((srv, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * idx }}
              style={{
                backgroundColor: T.surface,
                border: `1px solid ${T.border}`,
                borderRadius: 16,
                padding: 32,
                display: "flex",
                flexDirection: "column",
                gap: 20,
                transition: "background-color 0.3s, transform 0.3s",
                cursor: "default"
              }}
              whileHover={{ y: -5, backgroundColor: T.surfaceHover }}
            >
              <div style={{ color: T.accent }}>{srv.icon}</div>
              <div style={{ display: "inline-block", padding: "4px 12px", backgroundColor: T.accentDim, color: T.accent, borderRadius: 100, fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", alignSelf: "flex-start" }}>
                {srv.tag}
              </div>
              <h3 style={{ fontFamily: FONT_HEADING, fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>{srv.title}</h3>
              <p style={{ color: T.muted, lineHeight: 1.6, margin: 0 }}>{srv.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
