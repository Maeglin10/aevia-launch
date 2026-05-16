"use client";

import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from "framer-motion";
import { useRef, useState, useEffect } from "react";

const C = {
  bg: "#F8F6F3",
  bgDark: "#0A0A0A",
  text: "#0A0A0A",
  textLight: "#F8F6F3",
  textMuted: "#6B6B6B",
  textDim: "#B0B0B0",
  border: "#E0DDD8",
  borderDark: "#1E1E1E",
  accent: "#C8A882",
  accentDark: "#8A6840",
};

const FONT = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap');
`;

const EDITORIALS = [
  {
    id: 1,
    title: "NOIR TOTAL",
    subtitle: "La disparition du superflu",
    category: "Cover Story",
    issue: "Vol. XII",
    size: "hero",
    color: "#0A0A0A",
    textColor: "#F8F6F3",
  },
  {
    id: 2,
    title: "GEOMETRY OF DESIRE",
    subtitle: "Structures qui séduisent",
    category: "Editorial",
    issue: "Mai 2024",
    size: "tall",
    color: "#1C1C1C",
    textColor: "#F8F6F3",
  },
  {
    id: 3,
    title: "WHITE NOISE",
    subtitle: "L'éloquence du vide",
    category: "Portfolio",
    issue: "Série Exclusive",
    size: "wide",
    color: "#F0EDE8",
    textColor: "#0A0A0A",
  },
  {
    id: 4,
    title: "OMBRES PORTÉES",
    subtitle: "Lumière et absence",
    category: "Photography",
    issue: "Collection Hiver",
    size: "sq",
    color: "#3A3A3A",
    textColor: "#F8F6F3",
  },
  {
    id: 5,
    title: "CORPS RADICAL",
    subtitle: "Formes qui résistent",
    category: "Fashion",
    issue: "SS 2025",
    size: "sq",
    color: "#E8E4DE",
    textColor: "#0A0A0A",
  },
  {
    id: 6,
    title: "INVISIBLE EMPIRE",
    subtitle: "Le luxe sans signature",
    category: "Luxury",
    issue: "Hors-série",
    size: "tall",
    color: "#C8A882",
    textColor: "#0A0A0A",
  },
];

const ISSUES = [
  { season: "Printemps", year: "2025", theme: "Dissolution", cover: "#0A0A0A", num: "Vol. XIV" },
  { season: "Hiver", year: "2024", theme: "Architecture", cover: "#1C1C1C", num: "Vol. XIII" },
  { season: "Automne", year: "2024", theme: "Disparition", cover: "#3A3A3A", num: "Vol. XII" },
  { season: "Été", year: "2024", theme: "Corps", cover: "#C8A882", num: "Vol. XI" },
];

const CONTRIBUTORS = [
  { name: "Solène Varga", role: "Directrice artistique", initials: "SV" },
  { name: "Marcus Leth", role: "Photographie", initials: "ML" },
  { name: "Ida Reuter", role: "Rédactrice en chef", initials: "IR" },
  { name: "Pham Duc Anh", role: "Direction mode", initials: "PA" },
];

const MANIFESTE = [
  "Vogue Noire ne suit pas la mode.",
  "Elle la précède, la questionne, la défait.",
  "Chaque numéro est un acte éditorial.",
  "Chaque image, un argument visuel.",
];

// ── Ticker ─────────────────────────────────────────────────────────────────
function Ticker() {
  const items = ["VOGUE NOIRE", "NO. XIV", "PRINTEMPS 2025", "DISSOLUTION", "ARCHITECTURE ÉDITORIALE", "PHOTOGRAPHIE HAUTE COUTURE", "PARIS · MILAN · TOKYO"];
  const doubled = [...items, ...items];
  return (
    <div style={{ overflow: "hidden", borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: "0.6rem 0", background: C.bg }}>
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        style={{ display: "flex", gap: "4rem", whiteSpace: "nowrap" }}
      >
        {doubled.map((item, i) => (
          <span key={i} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: C.textMuted }}>
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ── Mosaic Card ─────────────────────────────────────────────────────────────
function MosaicCard({ item, delay }: { item: typeof EDITORIALS[0]; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: item.color,
        padding: "2.5rem",
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        minHeight: item.size === "hero" ? "500px" : item.size === "tall" ? "380px" : item.size === "wide" ? "260px" : "280px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        border: `1px solid ${item.color === C.bg ? C.border : "transparent"}`,
      }}
    >
      {/* Category chip */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "0.6rem",
          letterSpacing: "0.25em",
          color: item.textColor,
          opacity: 0.6,
        }}>
          {item.category}
        </span>
        <span style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "0.6rem",
          letterSpacing: "0.15em",
          color: item.textColor,
          opacity: 0.4,
        }}>
          {item.issue}
        </span>
      </div>

      {/* Decorative element */}
      <motion.div
        animate={hovered ? { scale: 1.5, opacity: 0.06 } : { scale: 1, opacity: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          position: "absolute",
          inset: 0,
          background: item.textColor,
        }}
      />

      {/* Title */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <motion.div
          animate={hovered ? { x: 6 } : { x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: item.size === "hero" ? "clamp(2.5rem, 5vw, 4.5rem)" : "clamp(1.5rem, 3vw, 2.5rem)",
            fontWeight: 900,
            color: item.textColor,
            lineHeight: 0.9,
            letterSpacing: "-0.02em",
            textTransform: "uppercase",
            marginBottom: "0.75rem",
          }}>
            {item.title}
          </div>
          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1rem",
            fontStyle: "italic",
            color: item.textColor,
            opacity: 0.65,
          }}>
            {item.subtitle}
          </div>
        </motion.div>
        {/* Arrow on hover */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              style={{ marginTop: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <div style={{ width: "2rem", height: "1px", background: item.textColor, opacity: 0.5 }} />
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.65rem", letterSpacing: "0.2em", color: item.textColor, opacity: 0.7 }}>
                LIRE
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function VogueNoire() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [activeIssue, setActiveIssue] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const { scrollYProgress } = useScroll({ target: containerRef });
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });

  const heroY = useTransform(heroScroll, [0, 1], ["0%", "30%"]);
  const navBg = useTransform(scrollYProgress, [0, 0.06], ["rgba(248,246,243,0)", "rgba(248,246,243,0.97)"]);

  return (
    <div ref={containerRef} style={{ background: C.bg, color: C.text, fontFamily: "'DM Sans', sans-serif", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{FONT}</style>

      {/* ── Navigation ─────────────────────────────────────────────────── */}
      <motion.nav
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          background: navBg,
          backdropFilter: "blur(16px)",
          borderBottom: `1px solid ${C.border}`,
          padding: "0 2.5rem",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", gap: "2.5rem" }}>
          {["Éditorial", "Collections", "Archives"].map((item) => (
            <motion.button key={item} onClick={() => document.getElementById(({"Éditorial": "editorial", "Collections": "collections", "Archives": "archives"})[item] || "")?.scrollIntoView({behavior:"smooth"})}
              
              
              style={{ fontSize: "0.7rem", letterSpacing: "0.2em", color: C.textMuted, textDecoration: "none", cursor: "pointer" }}
              whileHover={{ color: C.text }}
            >
              {item}
            </motion.button>
          ))}
        </div>

        {/* Masthead */}
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 900, color: C.text, letterSpacing: "0.12em", lineHeight: 1 }}>
            VOGUE NOIRE
          </div>
        </div>

        <div style={{ display: "flex", gap: "2.5rem", justifyContent: "flex-end" }}>
          {["Boutique", "Abonnement"].map((item) => (
            <motion.button key={item} onClick={() => document.getElementById(({"Éditorial": "editorial", "Collections": "collections", "Archives": "archives"})[item] || "")?.scrollIntoView({behavior:"smooth"})}
              
              
              style={{ fontSize: "0.7rem", letterSpacing: "0.2em", color: C.textMuted, textDecoration: "none", cursor: "pointer" }}
              whileHover={{ color: C.text }}
            >
              {item}
            </motion.button>
          ))}
        </div>
      </motion.nav>

      {/* ── Hero: Full-bleed masthead ───────────────────────────────────── */}
      <section
        ref={heroRef}
        style={{
          height: "100vh",
          background: C.bgDark,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "0 3rem 4rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Animated typographic background */}
        <motion.div
          style={{ position: "absolute", inset: 0, y: heroY, display: "flex", alignItems: "center", justifyContent: "center", userSelect: "none" }}
        >
          <div style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(10rem, 25vw, 22rem)",
            fontWeight: 900,
            color: "#111",
            letterSpacing: "-0.05em",
            lineHeight: 0.85,
            textTransform: "uppercase",
            textAlign: "center",
          }}>
            NOIR
          </div>
        </motion.div>

        {/* Top bar */}
        <div style={{ position: "absolute", top: "5.5rem", left: "3rem", right: "3rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.6rem", letterSpacing: "0.3em", color: "#555" }}>
            VOL. XIV · PRINTEMPS 2025
          </span>
          <div style={{ display: "flex", gap: "2rem" }}>
            {["MODE", "BEAUTÉ", "ART", "CULTURE"].map((cat) => (
              <span key={cat} style={{ fontSize: "0.6rem", letterSpacing: "0.25em", color: "#444" }}>{cat}</span>
            ))}
          </div>
          <span style={{ fontSize: "0.6rem", letterSpacing: "0.25em", color: "#444" }}>
            PARIS · MILAN · TOKYO
          </span>
        </div>

        {/* Bottom content */}
        <div style={{ position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "flex-end" }}>
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{ fontSize: "0.6rem", letterSpacing: "0.3em", color: C.accent, marginBottom: "1rem" }}
            >
              COUVERTURE CE NUMÉRO
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2.5rem, 6vw, 5rem)",
                fontWeight: 900,
                color: C.textLight,
                lineHeight: 0.9,
                letterSpacing: "-0.02em",
                textTransform: "uppercase",
                marginBottom: "1.5rem",
              }}
            >
              DISSOLUTION<br />
              <em style={{ fontWeight: 400, color: C.accent }}>du Regard</em>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              style={{ fontSize: "1rem", color: "#888", lineHeight: 1.7, maxWidth: "40ch" }}
            >
              Quand la mode cesse d'être un vêtement pour devenir une philosophie du corps dans l'espace.
            </motion.p>
          </div>
          <div style={{ textAlign: "right" }}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              <div style={{ fontSize: "0.6rem", letterSpacing: "0.2em", color: "#555", marginBottom: "0.75rem" }}>
                AVEC
              </div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontStyle: "italic", color: C.textLight, marginBottom: "0.25rem" }}>
                Mila Forsberg
              </div>
              <div style={{ fontSize: "0.7rem", color: "#666" }}>
                Photographiée par Marcus Leth
              </div>
              <div style={{ marginTop: "2rem" }}>
                <motion.button
                  whileHover={{ backgroundColor: C.accent }}
                  style={{
                    background: C.textLight,
                    color: C.bgDark,
                    border: "none",
                    padding: "0.75rem 2rem",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.65rem",
                    letterSpacing: "0.25em",
                    cursor: "pointer",
                    transition: "background 0.3s",
                  }}
                >
                  LIRE LE NUMÉRO
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ position: "absolute", bottom: "2rem", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}
        >
          <div style={{ width: "1px", height: "3rem", background: "linear-gradient(180deg, transparent, #444)" }} />
        </motion.div>
      </section>

      {/* ── Ticker ─────────────────────────────────────────────────────────── */}
      <Ticker />

      {/* ── Mosaic Grid ────────────────────────────────────────────────────── */}
      <section id="editorial" style={{ padding: "4rem clamp(1.5rem, 4vw, 4rem)" }}>
        <div style={{ maxWidth: "1300px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "3rem" }}>
            <div>
              <div style={{ fontSize: "0.6rem", letterSpacing: "0.3em", color: C.textMuted, marginBottom: "0.5rem" }}>
                SOMMAIRE
              </div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 900, color: C.text, lineHeight: 0.9 }}>
                Ce Numéro
              </h2>
            </div>
            <div style={{ fontSize: "0.7rem", letterSpacing: "0.15em", color: C.textMuted }}>
              6 éditoriaux exclusifs
            </div>
          </div>

          {/* Asymmetric grid */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gridTemplateRows: "auto", gap: "2px" }}>
            {/* Hero item */}
            <div style={{ gridRow: "1 / 3" }}>
              <MosaicCard item={EDITORIALS[0]} delay={0} />
            </div>
            {/* Tall right */}
            <div style={{ gridRow: "1 / 2" }}>
              <MosaicCard item={EDITORIALS[1]} delay={0.1} />
            </div>
            <div style={{ gridRow: "1 / 2" }}>
              <MosaicCard item={EDITORIALS[5]} delay={0.15} />
            </div>
            {/* Bottom row */}
            <div style={{ gridColumn: "2 / 3" }}>
              <MosaicCard item={EDITORIALS[3]} delay={0.2} />
            </div>
            <div style={{ gridColumn: "3 / 4" }}>
              <MosaicCard item={EDITORIALS[4]} delay={0.25} />
            </div>
          </div>

          {/* Wide card */}
          <div style={{ marginTop: "2px" }}>
            <MosaicCard item={EDITORIALS[2]} delay={0.3} />
          </div>
        </div>
      </section>

      {/* ── Manifeste ─────────────────────────────────────────────────────── */}
      <section id="collections" style={{ padding: "8rem clamp(2rem, 6vw, 6rem)", background: C.bgDark, overflow: "hidden" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ marginBottom: "3rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
              <div style={{ width: "2rem", height: "1px", background: C.accent }} />
              <span style={{ fontSize: "0.6rem", letterSpacing: "0.3em", color: C.accent }}>MANIFESTE</span>
            </div>
          </div>
          {MANIFESTE.map((line, i) => {
            const ref = useRef<HTMLDivElement>(null);
            const inView = useInView(ref, { once: true, margin: "-40px" });
            return (
              <motion.div
                key={i}
                ref={ref}
                initial={{ opacity: 0, x: -30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(1.5rem, 3.5vw, 3rem)",
                  fontWeight: i === 0 ? 900 : 400,
                  color: i === 0 ? C.textLight : i === 3 ? C.accent : "#666",
                  lineHeight: 1.2,
                  paddingBottom: "1.5rem",
                  marginBottom: "1.5rem",
                  borderBottom: i < 3 ? `1px solid #1E1E1E` : "none",
                  fontStyle: i % 2 === 1 ? "italic" : "normal",
                }}
              >
                {line}
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── Archives Issues ───────────────────────────────────────────────── */}
      <section id="archives" style={{ padding: "8rem clamp(2rem, 6vw, 6rem)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "4rem" }}>
            <div>
              <div style={{ fontSize: "0.6rem", letterSpacing: "0.3em", color: C.textMuted, marginBottom: "0.5rem" }}>
                NUMÉROS PRÉCÉDENTS
              </div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 3vw, 3rem)", fontWeight: 900, color: C.text }}>
                Les Archives
              </h2>
            </div>
            <motion.a
              href="#"
              style={{ fontSize: "0.65rem", letterSpacing: "0.2em", color: C.textMuted, textDecoration: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }}
              whileHover={{ color: C.text }}
            >
              TOUTES LES ARCHIVES
              <div style={{ width: "1.5rem", height: "1px", background: "currentcolor" }} />
            </motion.a>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "2px" }}>
            {ISSUES.map((issue, i) => {
              const ref = useRef<HTMLDivElement>(null);
              const inView = useInView(ref, { once: true });
              return (
                <motion.div
                  key={i}
                  ref={ref}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  style={{
                    background: issue.cover,
                    padding: "2.5rem 2rem",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    minHeight: "320px",
                    border: `1px solid ${issue.cover === "#C8A882" ? "transparent" : "#111"}`,
                  }}
                >
                  <div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.55rem", letterSpacing: "0.25em", color: "#888", marginBottom: "0.75rem" }}>
                      {issue.num}
                    </div>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", fontWeight: 900, color: "#F0EDE8", lineHeight: 0.9, textTransform: "uppercase" }}>
                      {issue.theme}
                    </div>
                  </div>
                  <div>
                    <div style={{ width: "100%", height: "1px", background: "#222", marginBottom: "1rem" }} />
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "0.85rem", color: "#999" }}>
                      {issue.season} {issue.year}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Contributors ──────────────────────────────────────────────────── */}
      <section style={{ padding: "6rem clamp(2rem, 6vw, 6rem)", borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ fontSize: "0.6rem", letterSpacing: "0.3em", color: C.textMuted, marginBottom: "3rem" }}>
            COLLABORATRICES & COLLABORATEURS
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "3rem" }}>
            {CONTRIBUTORS.map((c, i) => {
              const ref = useRef<HTMLDivElement>(null);
              const inView = useInView(ref, { once: true });
              return (
                <motion.div
                  key={c.name}
                  ref={ref}
                  initial={{ opacity: 0, y: 15 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                >
                  <div style={{ width: "56px", height: "56px", background: C.bgDark, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem" }}>
                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", fontWeight: 700, color: C.textLight }}>
                      {c.initials}
                    </span>
                  </div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", fontWeight: 700, color: C.text, marginBottom: "0.25rem" }}>
                    {c.name}
                  </div>
                  <div style={{ fontSize: "0.7rem", letterSpacing: "0.1em", color: C.textMuted }}>
                    {c.role}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Newsletter CTA ────────────────────────────────────────────────── */}
      <section style={{ padding: "8rem clamp(2rem, 6vw, 6rem)", background: C.bgDark }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
          <div style={{ width: "1px", height: "3rem", background: "#222", margin: "0 auto 2rem" }} />
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 900, color: C.textLight, marginBottom: "1rem", lineHeight: 0.95 }}>
            Ne Ratez Plus<br />
            <em style={{ fontWeight: 400, color: C.accent }}>un Numéro</em>
          </h2>
          <p style={{ fontSize: "0.95rem", color: "#777", lineHeight: 1.75, marginBottom: "2.5rem" }}>
            Chaque saison, Vogue Noire sort en édition limitée. Abonnez-vous pour recevoir votre exemplaire avant épuisement des stocks.
          </p>
          <div style={{ display: "flex", gap: "0", maxWidth: "440px", margin: "0 auto" }}>
            <input
              type="email"
              placeholder="votre@email.com"
              style={{
                flex: 1,
                background: "#111",
                border: "none",
                borderBottom: "1px solid #333",
                padding: "0.85rem 1rem",
                color: C.textLight,
                fontSize: "0.85rem",
                fontFamily: "'DM Sans', sans-serif",
                outline: "none",
              }}
            />
            <motion.button
              whileHover={{ backgroundColor: C.accent }}
              style={{
                background: C.textLight,
                color: C.bgDark,
                border: "none",
                padding: "0.85rem 1.5rem",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.65rem",
                letterSpacing: "0.2em",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "background 0.3s",
              }}
            >
              S'ABONNER
            </motion.button>
          </div>
          <div style={{ marginTop: "1rem", fontSize: "0.65rem", color: "#444", letterSpacing: "0.1em" }}>
            ÉDITION LIMITÉE · LIVRAISON MONDIALE · SANS ENGAGEMENT
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer style={{ borderTop: `1px solid #1E1E1E`, padding: "3rem clamp(2rem, 6vw, 6rem)", background: C.bgDark }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "3rem" }}>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 900, color: C.textLight, letterSpacing: "0.12em", marginBottom: "0.5rem" }}>
              VOGUE NOIRE
            </div>
            <div style={{ fontSize: "0.6rem", letterSpacing: "0.2em", color: "#444", marginBottom: "1.5rem" }}>
              MAGAZINE · PARIS
            </div>
            <p style={{ fontSize: "0.85rem", color: "#555", lineHeight: 1.65 }}>
              La mode comme langage.<br />
              L'image comme argument.<br />
              Trimestriel depuis 2018.
            </p>
          </div>
          {[
            { title: "MAGAZINE", items: ["Éditoriaux", "Archives", "Collections", "Manifeste"] },
            { title: "BOUTIQUE", items: ["Abonnement", "Numéros précédents", "Tirages photos", "Livres"] },
            { title: "MAISON", items: ["À propos", "Collaborer", "Presse", "Contact"] },
          ].map((col) => (
            <div key={col.title}>
              <div style={{ fontSize: "0.55rem", letterSpacing: "0.3em", color: "#444", marginBottom: "1.5rem" }}>
                {col.title}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {col.items.map((item) => (
                  <motion.a
                    key={item}
                    href="#"
                    style={{ fontSize: "0.85rem", color: "#555", textDecoration: "none", cursor: "pointer" }}
                    whileHover={{ color: C.textLight }}
                  >
                    {item}
                  </motion.a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ maxWidth: "1200px", margin: "2.5rem auto 0", paddingTop: "2rem", borderTop: "1px solid #1E1E1E", display: "flex", justifyContent: "space-between" }}>
          <div style={{ fontSize: "0.55rem", letterSpacing: "0.2em", color: "#333" }}>
            © 2025 VOGUE NOIRE. TOUS DROITS RÉSERVÉS.
          </div>
          <div style={{ display: "flex", gap: "2rem" }}>
            {["Mentions légales", "Confidentialité"].map((item) => (
              <motion.a key={item} href="#" style={{ fontSize: "0.55rem", letterSpacing: "0.15em", color: "#333", textDecoration: "none", cursor: "pointer" }} whileHover={{ color: "#666" }}>
                {item}
              </motion.a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
