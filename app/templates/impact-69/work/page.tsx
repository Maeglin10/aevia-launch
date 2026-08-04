"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { C, SERIES, CATEGORIES, SeriesCard, TextReveal } from "../shared";

// Variables de module lues par toute la page : le contrat les reçoit au rendu.
let sessionData: any = null;
let fd: any = null;
let bp: any = null;
let c: any = null;


export default function WorkPage() {
  const [__session, __setSession] = useState<any>(null);
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("session");
    if (!id) return;
    fetch(`/api/sessions?id=${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((s) => s && __setSession(s))
      .catch(() => {});
  }, []);

  sessionData = __session;
  fd = __session?.formData;
  bp = __session?.businessProfile;
  c = __session?.generatedContent;

  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All" ? SERIES : SERIES.filter(s => s.category === activeCategory);

  return (
    <section style={{ padding: "80px 0", maxWidth: 1200, margin: "0 auto", paddingInline: 32, minHeight: "80vh" }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 48 }} className="flex-header-69">
        <div>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, letterSpacing: "0.35em", color: C.moss, textTransform: "uppercase", marginBottom: 16 }}>Portfolio</p>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.02em", color: C.cream }}>
            <TextReveal text="Selected Series" />
          </h2>
        </div>
        {/* Category filter */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: activeCategory === cat ? C.bg : C.muted, background: activeCategory === cat ? C.moss : "transparent", border: `1px solid ${activeCategory === cat ? C.moss : C.border}`, padding: "7px 16px", borderRadius: 2, cursor: "pointer", letterSpacing: "0.08em", transition: "all 0.2s" }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Masonry-style grid */}
      <motion.div layout style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }} className="grid-hero-68">
        <AnimatePresence mode="popLayout">
          {filtered.map((series, i) => (
            <motion.div
              key={series.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, delay: i * 0.06, ease: [0.4, 0, 0.2, 1] }}
              style={i === 1 || i === 4 ? { gridRow: "span 1", transform: "translateY(32px)" } : {}}
            >
              <SeriesCard series={series} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
