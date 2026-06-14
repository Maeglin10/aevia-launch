// @ts-nocheck
"use client";

import { motion, useInView, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import React, { useRef, useState } from "react";

/* ==========================================================================
   DESIGN TOKENS & SYSTEM DATA
   ========================================================================= */

export const C = {
  bg: "#0A0A14",
  bgCard: "#0F0F1E",
  bgLight: "#141428",
  text: "#F0F0FF",
  textMuted: "#7070A0",
  textDim: "#2A2A4A",
  border: "#1A1A30",
  borderBright: "#252540",
  amber: "#CA8A04",
  amberLight: "#FCD34D",
  amberGlow: "rgba(202,138,4,0.15)",
  indigo: "#1E1B4B",
  white: "#F8FAFC",
};

export const FILMS = [
  {
    id: "01",
    title: "MIROIR DES OMBRES",
    director: "Clément Aubert",
    type: "Long-métrage",
    genre: "Thriller psychologique",
    year: "2024",
    runtime: "1h 48min",
    festival: "Cannes — Compétition officielle",
    color: "#CA8A04",
    desc: "Un détective se retrouve piégé dans une enquête qui efface la frontière entre le rêve et la réalité. Lauréat de la Caméra d'Or.",
  },
  {
    id: "02",
    title: "VIDE SANITAIRE",
    director: "Sonia Kremetz",
    type: "Documentaire",
    genre: "Cinéma du réel",
    year: "2024",
    runtime: "1h 22min",
    festival: "IDFA — Grand Prix",
    color: "#6B8BFF",
    desc: "Portraits de travailleurs de l'ombre dans un entrepôt logistique. Prix de la mise en scène au festival IDFA 2024.",
  },
  {
    id: "03",
    title: "ALTITUDE ZÉRO",
    director: "Marcus Levi",
    type: "Court-métrage",
    genre: "Science-fiction",
    year: "2023",
    runtime: "22min",
    festival: "Sundance — Best Short Film",
    color: "#4ADE80",
    desc: "Dans un monde où la gravité a disparu, deux enfants cherchent leur mère. Primé à Sundance et à Berlin.",
  },
  {
    id: "04",
    title: "LE DERNIER NUIT",
    director: "Yara Sousa",
    type: "Long-métrage",
    genre: "Drame",
    year: "2023",
    runtime: "2h 04min",
    festival: "Venise — Lion d'Argent",
    color: "#F472B6",
    desc: "Une famille se retrouve pour la dernière fois avant la démolition de leur maison d'enfance. Lion d'Argent à Venise.",
  },
];

export const SERVICES = [
  { code: "PRD", title: "Production", desc: "Development, financement, casting. On accompagne les projets de la page blanche à la première bobine." },
  { code: "PST", title: "Post-Production", desc: "Montage, étalonnage, mixage son, VFX. Notre studio est équipé Avid, DaVinci, Pro Tools." },
  { code: "DST", title: "Distribution", desc: "Festivals internationaux, sorties salles, VOD. 23 ans de relations avec les distributeurs mondiaux." },
  { code: "COM", title: "Films Publicitaires", desc: "Campagnes TV et digitales pour les grandes marques. Réalisation, production, post-production intégrée." },
];

export const PRESS = [
  { outlet: "Le Monde", quote: "Stack Unit est la maison de production qui a redéfini l'exigence artistique en France.", year: "2024" },
  { outlet: "Variety", quote: "The most consistently excellent French production house of the last decade.", year: "2023" },
  { outlet: "Les Inrockuptibles", quote: "Chaque film de Stack Unit est un événement cinématographique.", year: "2024" },
];

/* ==========================================================================
   UI COMPONENTS
   ========================================================================= */

export function TextReveal({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <div ref={ref} style={{ overflow: "hidden", ...style }}>
      <motion.div
        initial={{ y: "110%" }}
        animate={inView ? { y: 0 } : {}}
        transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export function MagneticButton({ children, style = {}, onClick, className = "" }: { children: React.ReactNode; style?: React.CSSProperties; onClick?: () => void; className?: string }) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 150, damping: 15 });
  const sy = useSpring(y, { stiffness: 150, damping: 15 });
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.3);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.3);
  };
  const handleMouseLeave = () => { x.set(0); y.set(0); };
  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={className}
      style={{ x: sx, y: sy, cursor: "pointer", ...style }}
    >
      {children}
    </motion.button>
  );
}

export function Marquee({ items, speed = 30 }: { items: string[]; speed?: number }) {
  const doubled = [...items, ...items];
  return (
    <div style={{ overflow: "hidden", display: "flex" }}>
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
        style={{ display: "flex", gap: "4rem", whiteSpace: "nowrap" }}
      >
        {doubled.map((item, i) => (
          <span key={i} style={{ fontFamily: "'Archivo', sans-serif", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.3em", color: C.textDim }}>
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export function SpotlightCard({ children, spotColor = "rgba(202,138,4,0.1)", style = {} }: { children: React.ReactNode; spotColor?: string; style?: React.CSSProperties }) {
  const divRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };
  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position: "relative", overflow: "hidden", cursor: "pointer", ...style }}
    >
      {hovered && (
        <div style={{
          position: "absolute",
          pointerEvents: "none",
          width: "400px",
          height: "400px",
          left: pos.x - 200,
          top: pos.y - 200,
          background: `radial-gradient(circle, ${spotColor} 0%, transparent 70%)`,
          zIndex: 0,
        }} />
      )}
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}

export function StackedCards({ films }: { films: typeof FILMS }) {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);

  const next = () => { setDirection(1); setActive((prev) => (prev + 1) % films.length); };
  const prev = () => { setDirection(-1); setActive((prev) => (prev - 1 + films.length) % films.length); };

  return (
    <div style={{ position: "relative", height: "520px" }}>
      {/* Background cards (stack effect) */}
      {[2, 1].map((offset) => {
        const idx = (active + offset) % films.length;
        return (
          <motion.div
            key={`bg-${offset}`}
            animate={{
              y: offset * 12,
              x: offset * 8,
              scale: 1 - offset * 0.04,
              rotateX: offset * 2,
            }}
            transition={{ type: "spring", stiffness: 200, damping: 30 }}
            style={{
              position: "absolute",
              inset: 0,
              background: C.bgCard,
              border: `1px solid ${C.border}`,
              transformOrigin: "top center",
            }}
          />
        );
      })}

      {/* Active card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ x: direction * 60, opacity: 0, rotateY: direction * 8 }}
          animate={{ x: 0, opacity: 1, rotateY: 0 }}
          exit={{ x: -direction * 60, opacity: 0, rotateY: -direction * 8 }}
          transition={{ type: "spring", stiffness: 200, damping: 30 }}
          style={{
            position: "absolute",
            inset: 0,
            background: C.bgCard,
            border: `1px solid ${C.borderBright}`,
            padding: "3rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {/* Card header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.6rem", letterSpacing: "0.25em", color: films[active].color, marginBottom: "0.5rem" }}>
                {films[active].type.toUpperCase()} · {films[active].festival}
              </div>
              <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 900, color: C.text, letterSpacing: "-0.02em", lineHeight: 1.15, paddingBottom: "0.15em" }}>
                {films[active].title}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.65rem", color: C.textMuted }}>
                {films[active].year}
              </div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.6rem", color: C.textDim }}>
                {films[active].runtime}
              </div>
            </div>
          </div>

          {/* Accent line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ height: "1px", background: `linear-gradient(90deg, ${films[active].color}, transparent)`, transformOrigin: "left" }}
          />

          {/* Director & Description */}
          <div>
            <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: "0.8rem", fontStyle: "italic", color: C.textMuted, marginBottom: "1rem" }}>
              Réalisé par {films[active].director}
            </div>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.9rem", color: C.textMuted, lineHeight: 1.7, maxWidth: "55ch" }}>
              {films[active].desc}
            </p>
          </div>

          {/* Controls */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {films.map((_, i) => (
                <motion.div
                  key={i}
                  onClick={() => { setDirection(i > active ? 1 : -1); setActive(i); }}
                  animate={{
                    width: i === active ? "1.5rem" : "6px",
                    height: "6px",
                    backgroundColor: i === active ? films[active].color : C.textDim,
                    borderRadius: i === active ? "3px" : "50%",
                  }}
                  transition={{ duration: 0.3 }}
                  style={{ cursor: "pointer" }}
                />
              ))}
            </div>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <motion.button
                whileHover={{ borderColor: films[active].color }}
                onClick={prev}
                style={{
                  width: "40px", height: "40px",
                  background: "transparent",
                  border: `1px solid ${C.border}`,
                  color: C.textMuted,
                  cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1rem",
                  transition: "border-color 0.2s",
                }}
              >
                ←
              </motion.button>
              <motion.button
                whileHover={{ borderColor: films[active].color, backgroundColor: films[active].color + "20" }}
                onClick={next}
                style={{
                  width: "40px", height: "40px",
                  background: "transparent",
                  border: `1px solid ${C.border}`,
                  color: C.textMuted,
                  cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1rem",
                  transition: "all 0.2s",
                }}
              >
                →
              </motion.button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export function ServiceCard({ svc, index }: { svc: typeof SERVICES[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <SpotlightCard spotColor="rgba(202,138,4,0.07)" style={{ background: C.bg, border: "none" }}>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        style={{ padding: "2.5rem 2rem" }}
      >
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.55rem", letterSpacing: "0.25em", color: C.amber, marginBottom: "1.5rem" }}>
          {svc.code}
        </div>
        <h3 style={{ fontFamily: "'Archivo', sans-serif", fontSize: "1.2rem", fontWeight: 700, color: C.text, marginBottom: "0.75rem" }}>
          {svc.title}
        </h3>
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.82rem", color: C.textMuted, lineHeight: 1.75 }}>
          {svc.desc}
        </p>
      </motion.div>
    </SpotlightCard>
  );
}
