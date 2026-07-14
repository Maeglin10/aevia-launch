"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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

const PROJECTS = [
  {
    id: 1,
    title: "Aether Labs",
    category: "Web Ecosystem",
    year: "2025",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Noir Studio",
    category: "Brand Identity",
    year: "2025",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Prisme Finance",
    category: "Fintech App",
    year: "2024",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1200&auto=format&fit=crop",
  },
];

export default function WorkPage() {
  return (
    <div style={{ minHeight: "100dvh", backgroundColor: T.bg, color: T.text, fontFamily: FONT_BODY }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px" }}>
        <Link href="/templates/impact-01" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: T.muted, textDecoration: "none", marginBottom: 60, fontSize: "0.9rem", transition: "color 0.2s" }} onMouseOver={(e) => (e.currentTarget.style.color = T.text)} onMouseOut={(e) => (e.currentTarget.style.color = T.muted)}>
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 style={{ fontFamily: FONT_HEADING, fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 800, margin: "0 0 24px 0", letterSpacing: "-0.02em" }}>
            Selected <span style={{ color: T.accent }}>Work.</span>
          </h1>
          <p style={{ color: T.muted, fontSize: "1.125rem", maxWidth: 600, lineHeight: 1.6, margin: "0 0 60px 0" }}>
            A curated selection of our recent projects. We partner with ambitious brands to create digital experiences that stand out and deliver results.
          </p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: 32 }}>
          {PROJECTS.map((project, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * idx }}
              style={{ display: "flex", flexDirection: "column", gap: 16, cursor: "pointer" }}
            >
              <div style={{ position: "relative", width: "100%", aspectRatio: "4/3", borderRadius: 16, overflow: "hidden", backgroundColor: T.surface }}>
                <Image src={project.image} alt={project.title} fill style={{ objectFit: "cover", transition: "transform 0.5s ease" }} />
                <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.2)", opacity: 0, transition: "opacity 0.3s ease", display: "flex", alignItems: "center", justifyContent: "center" }} className="overlay">
                  <div style={{ width: 64, height: 64, borderRadius: "50%", backgroundColor: T.accent, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <ArrowUpRight size={28} />
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <h3 style={{ fontFamily: FONT_HEADING, fontSize: "1.25rem", fontWeight: 700, margin: "0 0 4px 0", color: T.text }}>{project.title}</h3>
                  <div style={{ color: T.muted, fontSize: "0.875rem" }}>{project.category}</div>
                </div>
                <div style={{ color: T.muted, fontSize: "0.875rem", fontFamily: FONT_HEADING, fontWeight: 600 }}>{project.year}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
