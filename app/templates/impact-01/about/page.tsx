"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Code2, Layers, Palette } from "lucide-react";
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

const VALUES = [
  {
    icon: <Palette size={24} />,
    title: "Detail",
    text: "Every pixel is intentional. We believe excellence lives in the details no one consciously notices.",
  },
  {
    icon: <Code2 size={24} />,
    title: "Rigor",
    text: "From design to code, we anticipate edge cases and build to last. A beautiful site that breaks is just a broken promise.",
  },
  {
    icon: <Layers size={24} />,
    title: "Impact",
    text: "Beautiful work that doesn't convert is just decoration. We measure our success by our clients' results.",
  },
];

export default function AboutPage() {
  return (
    <div style={{ minHeight: "100dvh", backgroundColor: T.bg, color: T.text, fontFamily: FONT_BODY }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px" }}>
        <Link href="/templates/impact-01" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: T.muted, textDecoration: "none", marginBottom: 60, fontSize: "0.9rem", transition: "color 0.2s" }} onMouseOver={(e) => (e.currentTarget.style.color = T.text)} onMouseOut={(e) => (e.currentTarget.style.color = T.muted)}>
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 style={{ fontFamily: FONT_HEADING, fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 800, margin: "0 0 24px 0", letterSpacing: "-0.02em" }}>
            We build digital <span style={{ color: T.accent }}>experiences.</span>
          </h1>
          <p style={{ color: T.muted, fontSize: "1.125rem", maxWidth: 600, lineHeight: 1.6, margin: "0 0 60px 0" }}>
            We are a creative agency bridging the gap between exceptional design and world-class engineering. We partner with visionaries to craft digital products that leave a lasting impact.
          </p>
        </motion.div>

        <div style={{ marginTop: 80 }}>
          <h2 style={{ fontFamily: FONT_HEADING, fontSize: "2rem", fontWeight: 700, margin: "0 0 40px 0" }}>Our Values</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: 32 }}>
            {VALUES.map((val, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + 0.1 * idx }}
                style={{ padding: 32, backgroundColor: T.surface, border: `1px solid ${T.border}`, borderRadius: 16 }}
              >
                <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: T.accentDim, color: T.accent, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                  {val.icon}
                </div>
                <h3 style={{ fontFamily: FONT_HEADING, fontSize: "1.25rem", fontWeight: 700, margin: "0 0 12px 0" }}>{val.title}</h3>
                <p style={{ color: T.muted, lineHeight: 1.6, margin: 0 }}>{val.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
