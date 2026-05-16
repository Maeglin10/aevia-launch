"use client";

import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useVelocity,
} from "framer-motion";
import React, { useRef, useState, useEffect } from "react";

// ── Design System: Dark Mode OLED, Archivo/Space Grotesk (ui-ux-pro-max) ──
const C = {
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

const FONT = `
  @import url('https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,300;0,400;0,500;0,700;0,900;1,300;1,400&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
`;

const FILMS = [
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

const SERVICES = [
  { code: "PRD", title: "Production", desc: "Development, financement, casting. On accompagne les projets de la page blanche à la première bobine." },
  { code: "PST", title: "Post-Production", desc: "Montage, étalonnage, mixage son, VFX. Notre studio est équipé Avid, DaVinci, Pro Tools." },
  { code: "DST", title: "Distribution", desc: "Festivals internationaux, sorties salles, VOD. 23 ans de relations avec les distributeurs mondiaux." },
  { code: "COM", title: "Films Publicitaires", desc: "Campagnes TV et digitales pour les grandes marques. Réalisation, production, post-production intégrée." },
];

const PRESS = [
  { outlet: "Le Monde", quote: "Stack Unit est la maison de production qui a redéfini l'exigence artistique en France.", year: "2024" },
  { outlet: "Variety", quote: "The most consistently excellent French production house of the last decade.", year: "2023" },
  { outlet: "Les Inrockuptibles", quote: "Chaque film de Stack Unit est un événement cinématographique.", year: "2024" },
];

// ── 21st.dev: TextReveal ─────────────────────────────────────────────────────
function TextReveal({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
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

// ── 21st.dev: MagneticButton ─────────────────────────────────────────────────
function MagneticButton({ children, style = {}, onClick }: { children: React.ReactNode; style?: React.CSSProperties; onClick?: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 150, damping: 15 });
  const sy = useSpring(y, { stiffness: 150, damping: 15 });
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current!.getBoundingClientRect();
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
      style={{ x: sx, y: sy, cursor: "pointer", ...style }}
    >
      {children}
    </motion.button>
  );
}

// ── 21st.dev: Marquee / Ticker ────────────────────────────────────────────────
function Marquee({ items, speed = 30 }: { items: string[]; speed?: number }) {
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

// ── 21st.dev: SpotlightCard ──────────────────────────────────────────────────
function SpotlightCard({ children, spotColor = "rgba(202,138,4,0.1)", style = {} }: { children: React.ReactNode; spotColor?: string; style?: React.CSSProperties }) {
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

// ── 3D Spring Stacked Cards (signature element) ────────────────────────────
function StackedCards({ films }: { films: typeof FILMS }) {
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
              <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 900, color: C.text, letterSpacing: "-0.02em", lineHeight: 0.95 }}>
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

// ── ServiceCard (extracted to follow hooks rules) ─────────────────────────────
function ServiceCard({ svc, index }: { svc: typeof SERVICES[0]; index: number }) {
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

// ── Page ─────────────────────────────────────────────────────────────────────
export default function StackUnit() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const navOpacity = useTransform(scrollYProgress, [0, 0.04], [0, 1]);
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const heroGlow = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  const TICKER_ITEMS = [
    "MAISON DE PRODUCTION", "CANNES 2024", "SUNDANCE 2024", "VENISE 2023",
    "IDFA 2024", "BERLIN 2023", "23 ANS D'EXCELLENCE", "STACK UNIT FILMS",
  ];

  return (
    <div ref={containerRef} style={{ background: C.bg, color: C.text, fontFamily: "'Space Grotesk', sans-serif", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{FONT}</style>

      {/* Progress */}
      <motion.div style={{ position: "fixed", top: 0, left: 0, height: "2px", background: C.amber, width: progressWidth, zIndex: 200 }} />

      {/* ── Navigation ─────────────────────────────────────────────────── */}
      <motion.nav
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          opacity: navOpacity,
          background: "rgba(10,10,20,0.92)",
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${C.border}`,
          padding: "0 3rem",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <span style={{ fontFamily: "'Archivo', sans-serif", fontSize: "0.9rem", fontWeight: 900, letterSpacing: "0.08em", color: C.text }}>
            STACK
          </span>
          <span style={{ color: C.amber }}>_</span>
          <span style={{ fontFamily: "'Archivo', sans-serif", fontSize: "0.9rem", fontWeight: 300, letterSpacing: "0.08em", color: C.text }}>
            UNIT
          </span>
        </div>
        <div style={{ display: "flex", gap: "3rem" }}>
          {[
            { label: "Films", id: "films" },
            { label: "Services", id: "services" },
            { label: "Studio", id: "studio" },
            { label: "Contact", id: "contact" },
          ].map(({ label, id }) => (
            <motion.button
              key={label}
              onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.78rem", color: C.textMuted, background: "none", border: "none", cursor: "pointer" }}
              whileHover={{ color: C.amberLight }}
            >
              {label}
            </motion.button>
          ))}
        </div>
        <MagneticButton
          style={{
            background: C.amber,
            color: C.bg,
            border: "none",
            padding: "0.5rem 1.25rem",
            fontFamily: "'Archivo', sans-serif",
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
          }}
        >
          SOUMETTRE UN PROJET
        </MagneticButton>
      </motion.nav>

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "3rem", position: "relative", overflow: "hidden" }}>
        {/* Glow effect (21st.dev spotlight) */}
        <motion.div
          style={{
            position: "absolute",
            top: "20%",
            left: "30%",
            width: "600px",
            height: "600px",
            background: "radial-gradient(circle, rgba(202,138,4,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
            opacity: heroGlow,
          }}
        />

        {/* Film grain texture */}
        <div style={{ position: "absolute", inset: 0, opacity: 0.02, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize: "200px" }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: "1300px", margin: "0 auto", width: "100%" }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.65rem", letterSpacing: "0.4em", color: C.textDim, marginBottom: "2rem" }}
          >
            MAISON DE PRODUCTION INDÉPENDANTE · PARIS · EST. 2001
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
            <div>
              <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: "clamp(3.5rem, 9vw, 8rem)", fontWeight: 900, lineHeight: 0.87, letterSpacing: "-0.04em", color: C.text }}>
                <TextReveal delay={0.3}>L'ART</TextReveal>
                <TextReveal delay={0.45} style={{ color: C.amber }}>DU FILM</TextReveal>
                <TextReveal delay={0.6} style={{ fontStyle: "italic", fontWeight: 300 }}>EXIGEANT</TextReveal>
              </div>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 1 }}
                style={{ fontSize: "0.95rem", color: C.textMuted, lineHeight: 1.8, maxWidth: "45ch", marginTop: "2.5rem", marginBottom: "2.5rem" }}
              >
                Stack Unit produit des films qui résistent au temps. Long-métrages, documentaires, courts et films publicitaires — toujours avec la même exigence artistique absolue.
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.2 }}
                style={{ display: "flex", gap: "1rem" }}
              >
                <MagneticButton
                  style={{
                    background: C.amber,
                    color: C.bg,
                    border: "none",
                    padding: "0.9rem 2rem",
                    fontFamily: "'Archivo', sans-serif",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                  }}
                >
                  VOIR LA FILMOGRAPHIE →
                </MagneticButton>
                <MagneticButton
                  style={{
                    background: "transparent",
                    color: C.textMuted,
                    border: `1px solid ${C.border}`,
                    padding: "0.9rem 2rem",
                    fontFamily: "'Archivo', sans-serif",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    letterSpacing: "0.1em",
                  }}
                >
                  SOUMETTRE UN PROJET
                </MagneticButton>
              </motion.div>
            </div>

            {/* Stats panel */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: C.border }}>
                {[
                  { n: "62", label: "films produits" },
                  { n: "23", label: "ans d'existence" },
                  { n: "140+", label: "distinctions" },
                  { n: "18", label: "pays distribués" },
                ].map((stat, i) => (
                  <div key={stat.label} style={{ background: C.bgCard, padding: "2rem" }}>
                    <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: "2.5rem", fontWeight: 900, color: i % 2 === 0 ? C.amber : C.text, letterSpacing: "-0.03em" }}>
                      {stat.n}
                    </div>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.65rem", letterSpacing: "0.15em", color: C.textDim, marginTop: "0.25rem" }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Ticker ─────────────────────────────────────────────────────── */}
      <div style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: "0.75rem 0", background: C.bgCard }}>
        <Marquee items={TICKER_ITEMS} speed={25} />
      </div>

      {/* ── Films Stacked Cards ──────────────────────────────────────── */}
      <section id="films" style={{ padding: "7rem 3rem", background: C.bgCard, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "6rem", alignItems: "start" }}>
            <div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: C.amber, marginBottom: "1.5rem" }}>
                FILMOGRAPHIE RÉCENTE
              </div>
              <TextReveal style={{ fontFamily: "'Archivo', sans-serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 900, letterSpacing: "-0.03em", color: C.text, marginBottom: "1.5rem" }}>
                Nos Films
              </TextReveal>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.9rem", color: C.textMuted, lineHeight: 1.75, marginBottom: "3rem" }}>
                Chaque film est une collaboration profonde avec ses auteurs. Stack Unit ne produit pas — elle co-crée.
              </p>

              {/* Film list */}
              {FILMS.map((film, i) => (
                <motion.div
                  key={film.id}
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  style={{
                    display: "flex",
                    gap: "1rem",
                    alignItems: "center",
                    padding: "0.85rem 0",
                    borderBottom: `1px solid ${C.border}`,
                    cursor: "pointer",
                  }}
                >
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: film.color, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: "0.9rem", fontWeight: 700, color: C.text }}>
                      {film.title}
                    </div>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.65rem", color: C.textMuted }}>
                      {film.director} · {film.year}
                    </div>
                  </div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.6rem", letterSpacing: "0.1em", color: film.color, padding: "0.2rem 0.5rem", border: `1px solid ${film.color}30` }}>
                    {film.type}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Stacked cards */}
            <div>
              <StackedCards films={FILMS} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Services ────────────────────────────────────────────────── */}
      <section id="services" style={{ padding: "7rem 3rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ marginBottom: "4rem" }}>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: C.amber, marginBottom: "1rem" }}>
              NOS MÉTIERS
            </div>
            <TextReveal style={{ fontFamily: "'Archivo', sans-serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 900, letterSpacing: "-0.03em", color: C.text }}>
              Ce Que Nous Faisons
            </TextReveal>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1px", background: C.border }}>
            {SERVICES.map((svc, i) => (
              <ServiceCard key={svc.code} svc={svc} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Press ───────────────────────────────────────────────────── */}
      <section id="studio" style={{ padding: "6rem 3rem", background: C.bgCard, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: C.amber, marginBottom: "3rem" }}>
            LA PRESSE PARLE DE NOUS
          </div>
          {PRESS.map((p, i) => {
            const ref = useRef<HTMLDivElement>(null);
            const inView = useInView(ref, { once: true });
            return (
              <motion.div
                key={p.outlet}
                ref={ref}
                initial={{ opacity: 0, y: 15 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                style={{ display: "grid", gridTemplateColumns: "8rem 1fr", gap: "3rem", padding: "2rem 0", borderBottom: i < PRESS.length - 1 ? `1px solid ${C.border}` : "none", alignItems: "center" }}
              >
                <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: "0.8rem", fontWeight: 700, color: C.textMuted }}>
                  {p.outlet}
                </div>
                <p style={{ fontFamily: "'Archivo', sans-serif", fontSize: "1.1rem", fontStyle: "italic", color: C.text, lineHeight: 1.5 }}>
                  "{p.quote}"
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────── */}
      <section id="contact" style={{ padding: "8rem 3rem", background: C.indigo, textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "600px", height: "600px", background: "radial-gradient(circle, rgba(202,138,4,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: "700px", margin: "0 auto" }}>
          <TextReveal style={{ fontFamily: "'Archivo', sans-serif", fontSize: "clamp(2.5rem, 6vw, 5rem)", fontWeight: 900, color: C.text, letterSpacing: "-0.03em", lineHeight: 0.93, marginBottom: "2rem" }}>
            Votre histoire<br />mérite un film.
          </TextReveal>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            style={{ fontSize: "1rem", color: C.textMuted, lineHeight: 1.75, marginBottom: "3rem" }}
          >
            Stack Unit accepte 6 nouveaux projets par an. Nous lisons chaque dossier, répondons à tous. Si votre projet nous touche, tout devient possible.
          </motion.p>
          <MagneticButton
            style={{
              background: C.amber,
              color: C.bg,
              border: "none",
              padding: "1.1rem 3rem",
              fontFamily: "'Archivo', sans-serif",
              fontSize: "0.8rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
            }}
          >
            SOUMETTRE UN PROJET →
          </MagneticButton>
          <div style={{ marginTop: "2rem", fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.7rem", color: C.textMuted }}>
            projets@stackunit.fr · +33 1 XX XX XX XX
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer style={{ borderTop: `1px solid ${C.border}`, padding: "3rem", background: C.bg }}>
        <div style={{ maxWidth: "1300px", margin: "0 auto", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "3rem" }}>
          <div>
            <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: "1rem", fontWeight: 900, color: C.text, letterSpacing: "0.1em", marginBottom: "0.5rem" }}>
              STACK<span style={{ color: C.amber }}>_</span>UNIT
            </div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.55rem", letterSpacing: "0.25em", color: C.textDim, marginBottom: "1.5rem" }}>
              MAISON DE PRODUCTION · PARIS · EST. 2001
            </div>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.8rem", color: C.textDim, lineHeight: 1.65 }}>
              Agréé CNC. Membre du SPI.
            </p>
          </div>
          {[
            { title: "FILMS", items: ["Filmographie", "En production", "En développement", "Archives"] },
            { title: "SERVICES", items: ["Production", "Post-production", "Distribution", "Publicitaire"] },
            { title: "STUDIO", items: ["Notre histoire", "Équipe", "Presse", "Recrutement"] },
          ].map((col) => (
            <div key={col.title}>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.55rem", letterSpacing: "0.25em", color: C.textDim, marginBottom: "1.5rem" }}>
                {col.title}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {col.items.map((item) => (
                  <motion.a key={item} href="#" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.8rem", color: C.textMuted, textDecoration: "none", cursor: "pointer" }} whileHover={{ color: C.amberLight }}>
                    {item}
                  </motion.a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ maxWidth: "1300px", margin: "2.5rem auto 0", paddingTop: "2rem", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between" }}>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.55rem", color: C.textDim }}>© 2025 STACK UNIT. TOUS DROITS RÉSERVÉS.</div>
          <div style={{ display: "flex", gap: "2rem" }}>
            {["Mentions légales", "RGPD"].map((item) => (
              <motion.a key={item} href="#" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.55rem", color: C.textDim, textDecoration: "none", cursor: "pointer" }} whileHover={{ color: C.textMuted }}>
                {item}
              </motion.a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
