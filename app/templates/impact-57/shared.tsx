"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useInView } from "framer-motion";

export const C = {
  bg: "#050505",
  bgCard: "#0D0D0D",
  bgLight: "#111111",
  text: "#F0EDE8",
  textMuted: "#888",
  textDim: "#3A3A3A",
  accent: "#E8FF00",
  accentAlt: "#FF4D00",
  border: "#1A1A1A",
};

export const PROJECTS = [
  {
    id: "01",
    title: "ARCANE",
    client: "Balenciaga",
    type: "Brand Identity · Campaign",
    year: "2024",
    tags: ["Identity", "Film", "3D"],
    color: "#E8FF00",
    dark: true,
  },
  {
    id: "02",
    title: "VOID",
    client: "Nike x Off-White",
    type: "Digital Experience · AR",
    year: "2024",
    tags: ["XR", "Web", "Motion"],
    color: "#FF4D00",
    dark: false,
  },
  {
    id: "03",
    title: "CIPHER",
    client: "Hermès",
    type: "Editorial · Motion",
    year: "2023",
    tags: ["Editorial", "Motion", "Film"],
    color: "#F0EDE8",
    dark: true,
  },
  {
    id: "04",
    title: "PULSE",
    client: "Dior Beauty",
    type: "Campaign · Digital",
    year: "2023",
    tags: ["Campaign", "CGI", "Social"],
    color: "#8B5CF6",
    dark: false,
  },
  {
    id: "05",
    title: "GHOST",
    client: "Maison Margiela",
    type: "Brand Film · Identity",
    year: "2023",
    tags: ["Film", "Identity", "3D"],
    color: "#1A1A1A",
    dark: false,
  },
];

export const SERVICES = [
  { n: "01", title: "Brand Identity", desc: "Systèmes visuels qui persistent. Logos, typographies, guidelines — construits pour durer une décennie." },
  { n: "02", title: "Motion Design", desc: "Animation qui raconte. Titres cinétiques, transitions d'état, transitions de marque." },
  { n: "03", title: "Digital Experience", desc: "Interfaces qui surprennent. Webgl, scroll storytelling, expériences immersives." },
  { n: "04", title: "Art Direction", desc: "Regard éditorial sur chaque pixel. Du brief à la livraison, une vision cohérente." },
];

export const STATS = [
  { n: "180+", label: "Projets livrés" },
  { n: "38", label: "Awards AWWWARDS" },
  { n: "12", label: "Années d'expertise" },
  { n: "6", label: "Continents" },
];

export const TEAM = [
  { name: "Axel Mörk", role: "Creative Director", specialty: "Art Direction" },
  { name: "Yuki Tanaka", role: "Motion Lead", specialty: "3D · Animation" },
  { name: "Célia Rousset", role: "Brand Strategist", specialty: "Identity · Systems" },
  { name: "Dev Kapoor", role: "Tech Director", specialty: "WebGL · Three.js" },
];

export const NAV_LINKS = [
  { label: "Work", href: "/templates/impact-57/work" },
  { label: "Studio", href: "/templates/impact-57/studio" },
  { label: "Services", href: "/templates/impact-57/services" },
  { label: "Contact", href: "/templates/impact-57/contact" },
] as const;

// ── Cursor follower ──────────────────────────────────────────────────────────
export function CustomCursor() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 20 });
  const sy = useSpring(y, { stiffness: 200, damping: 20 });

  useEffect(() => {
    const move = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  return (
    <motion.div
      style={{
        position: "fixed",
        left: sx,
        top: sy,
        width: "8px",
        height: "8px",
        background: C.accent,
        borderRadius: "50%",
        pointerEvents: "none",
        zIndex: 9999,
        transform: "translate(-50%, -50%)",
        mixBlendMode: "difference",
      }}
    />
  );
}

// ── Masked title (signature element) ────────────────────────────────────────
export function MaskedTitle({ text, delay = 0 }: { text: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <div ref={ref} style={{ overflow: "hidden", paddingBottom: "0.15em" }}>
      <motion.div
        initial={{ y: "110%" }}
        animate={inView ? { y: 0 } : {}}
        transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {text}
      </motion.div>
    </div>
  );
}

// ── Project row ──────────────────────────────────────────────────────────────
export function ProjectRow({ project, index }: { project: typeof PROJECTS[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "grid",
        gridTemplateColumns: "4rem 1fr auto auto",
        alignItems: "center",
        gap: "3rem",
        padding: "2rem 0",
        borderBottom: `1px solid ${C.border}`,
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Hover background fill */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            exit={{ scaleX: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "absolute",
              inset: 0,
              background: project.color,
              transformOrigin: "left",
              zIndex: 0,
            }}
          />
        )}
      </AnimatePresence>

      <div style={{ position: "relative", zIndex: 1 }}>
        <span style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "0.7rem",
          color: hovered ? (project.dark ? C.bg : C.text) : C.textDim,
          transition: "color 0.3s",
        }}>
          {project.id}
        </span>
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
          fontWeight: 700,
          color: hovered ? (project.dark ? C.bg : C.text) : C.text,
          letterSpacing: "-0.02em",
          transition: "color 0.3s",
        }}>
          {project.title}
        </div>
        <div style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "0.65rem",
          color: hovered ? (project.dark ? "#333" : "#aaa") : C.textMuted,
          marginTop: "0.2rem",
          transition: "color 0.3s",
        }}>
          {project.type}
        </div>
      </div>

      <div style={{ position: "relative", zIndex: 1, display: "flex", gap: "0.5rem" }}>
        {project.tags.map((tag) => (
          <span key={tag} style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.55rem",
            letterSpacing: "0.1em",
            padding: "0.3rem 0.6rem",
            border: `1px solid ${hovered ? (project.dark ? "#33330A" : C.border) : C.border}`,
            color: hovered ? (project.dark ? C.bg : C.textMuted) : C.textMuted,
            transition: "all 0.3s",
          }}>
            {tag}
          </span>
        ))}
      </div>

      <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: "1rem" }}>
        <span style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "0.65rem",
          color: hovered ? (project.dark ? C.bg : C.textMuted) : C.textDim,
          transition: "color 0.3s",
        }}>
          {project.year}
        </span>
        <motion.div
          animate={hovered ? { x: 0, opacity: 1 } : { x: -10, opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{ width: "2rem", height: "1px", background: hovered ? (project.dark ? C.bg : C.text) : C.text }}
        />
      </div>
    </motion.div>
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
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');
  
  body {
    background: #050505;
    color: #F0EDE8;
    font-family: 'Space Grotesk', sans-serif;
  }
`;

export function StyleInjector() {
  useEffect(() => {
    const existing = document.getElementById("impact-57-styles");
    if (existing) return;
    const tag = document.createElement("style");
    tag.id = "impact-57-styles";
    tag.textContent = GLOBAL_STYLES;
    document.head.appendChild(tag);
    return () => {
      const el = document.getElementById("impact-57-styles");
      if (el) el.remove();
    };
  }, []);
  return null;
}
