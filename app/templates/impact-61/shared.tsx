"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useInView } from "framer-motion";

// ── Design System ──
export const C = {
  bg: "#FFFFFF",
  bgOff: "#F7F7F5",
  bgDark: "#171717",
  text: "#171717",
  textLight: "#FFFFFF",
  textMuted: "#404040",
  textDim: "#A0A0A0",
  border: "#E8E8E8",
  borderDark: "#2A2A2A",
  gold: "#D4AF37",
  goldDark: "#8A7020",
};

export const FONT = `
  @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@300;400;500;600;700;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
`;

export const PROJECTS = [
  {
    id: "S.01",
    title: "Maison Flottante",
    type: "Résidence privée",
    location: "Lac d'Annecy",
    year: "2024",
    area: "420 m²",
    status: "Réalisé",
    desc: "Habitation suspendue au-dessus de l'eau. Structure en acier cor-ten, toiture végétalisée, vue panoramique 270°. Prix Pritzker régional 2024.",
    tags: ["Résidentiel", "Acier", "Bois"],
  },
  {
    id: "S.02",
    title: "Pavillon Négatif",
    type: "Espace culturel",
    location: "Bordeaux",
    year: "2024",
    area: "1 200 m²",
    status: "Réalisé",
    desc: "Centre d'art contemporain dont l'architecture est définie par ses vides. Béton brut, lumière zénithale, acoustique de salle de concert.",
    tags: ["Culturel", "Béton", "Lumière"],
  },
  {
    id: "S.03",
    title: "Tour Ombre",
    type: "Immeuble de bureaux",
    location: "Paris 13e",
    year: "2023",
    area: "8 400 m²",
    status: "Réalisé",
    desc: "18 étages de bureaux collaboratifs. Façade en peaux d'aluminium perforées qui changent d'aspect selon l'heure. Certifié HQE Exceptionnel.",
    tags: ["Tertiaire", "Aluminium", "Façade"],
  },
  {
    id: "S.04",
    title: "Bibliothèque du Vide",
    type: "Équipement public",
    location: "Lyon",
    year: "2023",
    area: "3 600 m²",
    status: "Réalisé",
    desc: "Médiathèque de quartier où l'espace intérieur est conçu comme un creux dans la masse bâtie. Bois lamellé-croisé, patio central, double peau.",
    tags: ["Public", "Bois", "CLT"],
  },
  {
    id: "S.05",
    title: "Résidence Séquence",
    type: "Logements collectifs",
    location: "Nantes",
    year: "2022",
    area: "5 200 m²",
    status: "Réalisé",
    desc: "48 logements sociaux dont chaque unité est une variation sur un même thème. Béton blanc, terrasses filantes, jardin partagé en pleine terre.",
    tags: ["Logement", "Social", "Béton blanc"],
  },
];

export const TEAM = [
  { name: "Laurent Segré", role: "Associé fondateur", credential: "DPLG · HMONP" },
  { name: "Mei Zhang", role: "Architecte senior", credential: "MArch Harvard" },
  { name: "Antoine Brel", role: "Chef de projet", credential: "DPLG · HQE" },
];

export const AWARDS = [
  { year: "2024", title: "Prix Équerre d'Argent — Mention spéciale", project: "Maison Flottante" },
  { year: "2024", title: "Trophées Bâtiments Publics Or", project: "Pavillon Négatif" },
  { year: "2023", title: "Prix National de la Construction Bois", project: "Bibliothèque du Vide" },
  { year: "2022", title: "Prix Éco-quartier Argent", project: "Résidence Séquence" },
];

// ── TextReveal (mask slide) ──
export function TextReveal({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <div ref={ref} style={{ overflow: "hidden", ...style }}>
      <motion.div
        initial={{ y: "110%" }}
        animate={inView ? { y: 0 } : {}}
        transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
        style={{ paddingBottom: "0.15em" }} // Prevents descender character clipping (g, p, y)
      >
        {children}
      </motion.div>
    </div>
  );
}

// ── MagneticButton ──
export function MagneticButton({ children, style = {}, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { style?: React.CSSProperties }) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 150, damping: 15 });
  const sy = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = ref.current!.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.35);
    y.set((e.clientY - cy) * 0.35);
  };
  const handleMouseLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: sx, y: sy, ...style }}
      {...(props as any)}
    >
      {children}
    </motion.button>
  );
}

// ── SpotlightCard ──
export function SpotlightCard({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const divRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = divRef.current!.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        ...style,
      }}
    >
      {hovered && (
        <div style={{
          position: "absolute",
          pointerEvents: "none",
          borderRadius: "50%",
          width: "400px",
          height: "400px",
          left: pos.x - 200,
          top: pos.y - 200,
          background: "radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)",
          transition: "opacity 0.2s",
          zIndex: 0,
        }} />
      )}
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}

// ── Dot navigation (signature element) ──
export function DotNav({ sections, active }: { sections: string[]; active: number }) {
  return (
    <div style={{
      position: "fixed",
      right: "2rem",
      top: "50%",
      transform: "translateY(-50%)",
      zIndex: 50,
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
    }}>
      {sections.map((label, i) => (
        <div key={label} style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
          <motion.div
            animate={{
              width: i === active ? "1.5rem" : "6px",
              height: "6px",
              backgroundColor: i === active ? C.gold : C.textDim,
              borderRadius: i === active ? "3px" : "50%",
            }}
            transition={{ duration: 0.3 }}
          />
        </div>
      ))}
    </div>
  );
}

// ── Count-up ──
export function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = Date.now();
    const duration = 1500;
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(ease * target));
      if (progress >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

// ── Style Injector ──
export function StyleInjector() {
  useEffect(() => {
    const existing = document.getElementById("impact-61-styles");
    if (existing) return;
    const tag = document.createElement("style");
    tag.id = "impact-61-styles";
    tag.textContent = FONT;
    document.head.appendChild(tag);
    return () => {
      const el = document.getElementById("impact-61-styles");
      if (el) el.remove();
    };
  }, []);
  return null;
}
