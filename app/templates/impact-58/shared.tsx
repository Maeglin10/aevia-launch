"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useSpring, useMotionValue, useTransform, useInView } from "framer-motion";

export const C = {
  bg: "#07070A",
  bgCard: "#0E0E14",
  text: "#E8E8F0",
  textMuted: "#7A7A90",
  textDim: "#2E2E40",
  border: "#14141E",
  borderBright: "#1E1E2E",
  violet: "#8B5CF6",
  violetLight: "#C4B5FD",
  violetDim: "#4C1D95",
  cyan: "#22D3EE",
  white: "#F0F0FF",
};

export const PROJECTS = [
  {
    id: "01",
    title: "FLUX",
    client: "Adidas Originals",
    type: "Brand Film",
    year: "2024",
    duration: "1:30",
    awards: ["Cannes Lions Silver", "D&AD Wood Pencil"],
    tags: ["3D", "Motion", "Film"],
    color: C.violet,
  },
  {
    id: "02",
    title: "THRESHOLD",
    client: "Apple iPhone 16",
    type: "Product Reveal",
    year: "2024",
    duration: "3:00",
    awards: ["Cannes Lions Gold"],
    tags: ["Motion", "VFX", "Sound Design"],
    color: C.cyan,
  },
  {
    id: "03",
    title: "DISSOLVE",
    client: "Vuitton x Yayoi Kusama",
    type: "Installation Film",
    year: "2023",
    duration: "5:45",
    awards: ["SXSW Best Short", "FWA SOTM"],
    tags: ["Installation", "3D", "Generative"],
    color: "#FF4DAD",
  },
  {
    id: "04",
    title: "SIGNAL",
    client: "Spotify Wrapped",
    type: "Social Campaign",
    year: "2023",
    duration: "0:15 × 8",
    awards: ["Shorty Award Gold"],
    tags: ["Social", "Motion", "Loop"],
    color: "#1DB954",
  },
  {
    id: "05",
    title: "ECHOES",
    client: "Balenciaga",
    type: "Fashion Film",
    year: "2023",
    duration: "2:20",
    awards: ["British Arrows Gold", "D&AD Graphite"],
    tags: ["Fashion", "Film", "CGI"],
    color: C.white,
  },
];

export const SERVICES = [
  { code: "01", title: "Brand Films", desc: "De 15 secondes à 6 minutes. Narration, esthétique, cut — chaque décision au service de la marque." },
  { code: "02", title: "Motion Design", desc: "Systèmes d'animation, titres génériques, motion guidelines. Le mouvement comme identité." },
  { code: "03", title: "CGI & VFX", desc: "3D photoréaliste, simulations physiques, compositing. Aucune limite technique." },
  { code: "04", title: "Installations", desc: "Expériences immersives pour espaces physiques. Son, image, espace fusionnés." },
];

export const AWARDS_LIST = [
  "Cannes Lions — 3 Gold · 5 Silver · 8 Bronze",
  "D&AD — 1 Black Pencil · 4 Yellow Pencils",
  "SXSW Film — 2 Best Short",
  "FWA Site of the Month — 6×",
];

export const NAV_LINKS = [
  { label: "Work", href: "/templates/impact-58/work" },
  { label: "Services", href: "/templates/impact-58/services" },
  { label: "Studio", href: "/templates/impact-58/studio" },
  { label: "Contact", href: "/templates/impact-58/contact" },
] as const;

// ── Skew hover (signature element) ────────────────────────────────────────────
export function SkewProjectItem({ project, index }: { project: typeof PROJECTS[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 25 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ borderBottom: `1px solid ${C.border}`, cursor: "pointer", position: "relative", overflow: "hidden" }}
    >
      {/* Hover background */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ scaleX: 0, skewX: "-5deg" }}
            animate={{ scaleX: 1, skewX: "0deg" }}
            exit={{ scaleX: 0, skewX: "5deg" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: "absolute", inset: 0, background: project.color + "18", transformOrigin: "left" }}
          />
        )}
      </AnimatePresence>

      <motion.div
        animate={hovered ? { skewX: "-1.5deg", x: 8 } : { skewX: "0deg", x: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{ display: "grid", gridTemplateColumns: "5rem 1fr auto auto", gap: "3rem", padding: "2rem 0", alignItems: "center", position: "relative", zIndex: 1 }}
      >
        <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: "0.65rem", color: C.textDim }}>
          {project.id}
        </div>
        <div>
          <div style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(1.8rem, 3.5vw, 3rem)",
            fontWeight: 800,
            color: hovered ? project.color : C.text,
            letterSpacing: "-0.02em",
            lineHeight: 1.15,
            paddingBottom: "0.1em",
            transition: "color 0.3s",
          }}>
            {project.title}
          </div>
          <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: "0.65rem", color: C.textMuted, marginTop: "0.3rem" }}>
            {project.client} · {project.type}
          </div>
        </div>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {project.tags.map((tag) => (
            <span key={tag} style={{
              fontFamily: "'Syne Mono', monospace",
              fontSize: "0.55rem",
              letterSpacing: "0.1em",
              padding: "0.25rem 0.6rem",
              border: `1px solid ${hovered ? project.color + "60" : C.border}`,
              color: hovered ? project.color : C.textMuted,
              transition: "all 0.3s",
            }}>
              {tag}
            </span>
          ))}
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: "0.65rem", color: C.textMuted }}>{project.year}</div>
          <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: "0.55rem", color: C.textDim }}>{project.duration}</div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Distorted title (key visual element) ─────────────────────────────────────
export function DistortedTitle() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const skewX = useSpring(useTransform(x, [-300, 300], [-8, 8]), { stiffness: 80, damping: 15 });
  const skewY = useSpring(useTransform(y, [-200, 200], [-4, 4]), { stiffness: 80, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };
  const handleMouseLeave = () => { x.set(0); y.set(0); };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ cursor: "default" }}
    >
      <motion.div style={{ skewX, skewY }}>
        <div style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "clamp(4rem, 14vw, 14rem)",
          fontWeight: 800,
          color: C.text,
          lineHeight: 1.15,
          letterSpacing: "-0.04em",
          userSelect: "none",
          paddingBottom: "0.15em"
        }}>
          SKEW
        </div>
        <div style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "clamp(4rem, 14vw, 14rem)",
          fontWeight: 800,
          color: "transparent",
          lineHeight: 1.15,
          letterSpacing: "-0.04em",
          WebkitTextStroke: `1px ${C.violet}`,
          userSelect: "none",
          paddingBottom: "0.15em"
        }}>
          STUDIO
        </div>
      </motion.div>
    </div>
  );
}

// ─── REVEAL COMPONENT ────────────────────────────────────────────────────────
export function Reveal({ children, delay = 0, y = 30 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=Syne+Mono&family=DM+Sans:wght@300;400;500&display=swap');
  
  body {
    background: #07070A;
    color: #E8E8F0;
    font-family: 'DM Sans', sans-serif;
  }
`;

export function StyleInjector() {
  useEffect(() => {
    const existing = document.getElementById("impact-58-styles");
    if (existing) return;
    const tag = document.createElement("style");
    tag.id = "impact-58-styles";
    tag.textContent = GLOBAL_STYLES;
    document.head.appendChild(tag);
    return () => {
      const el = document.getElementById("impact-58-styles");
      if (el) el.remove();
    };
  }, []);
  return null;
}
