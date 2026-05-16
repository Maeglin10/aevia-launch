"use client";

import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { useRef, useState, useEffect } from "react";

const C = {
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

const FONT = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');
`;

const PROJECTS = [
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

const SERVICES = [
  { n: "01", title: "Brand Identity", desc: "Systèmes visuels qui persistent. Logos, typographies, guidelines — construits pour durer une décennie." },
  { n: "02", title: "Motion Design", desc: "Animation qui raconte. Titres cinétiques, transitions d'état, transitions de marque." },
  { n: "03", title: "Digital Experience", desc: "Interfaces qui surprennent. Webgl, scroll storytelling, expériences immersives." },
  { n: "04", title: "Art Direction", desc: "Regard éditorial sur chaque pixel. Du brief à la livraison, une vision cohérente." },
];

const STATS = [
  { n: "180+", label: "Projets livrés" },
  { n: "38", label: "Awards AWWWARDS" },
  { n: "12", label: "Années d'expertise" },
  { n: "6", label: "Continents" },
];

const TEAM = [
  { name: "Axel Mörk", role: "Creative Director", specialty: "Art Direction" },
  { name: "Yuki Tanaka", role: "Motion Lead", specialty: "3D · Animation" },
  { name: "Célia Rousset", role: "Brand Strategist", specialty: "Identity · Systems" },
  { name: "Dev Kapoor", role: "Tech Director", specialty: "WebGL · Three.js" },
];

// ── Cursor follower ──────────────────────────────────────────────────────────
function CustomCursor() {
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
function MaskedTitle({ text, delay = 0 }: { text: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <div ref={ref} style={{ overflow: "hidden" }}>
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
function ProjectRow({ project, index }: { project: typeof PROJECTS[0]; index: number }) {
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

// ── Page ─────────────────────────────────────────────────────────────────────
export default function MaskUnit() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: containerRef });
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });

  const heroScale = useTransform(heroScroll, [0, 1], [1, 1.1]);
  const heroOpacity = useTransform(heroScroll, [0, 0.7], [1, 0]);
  const navOpacity = useTransform(scrollYProgress, [0, 0.04], [0, 1]);
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={containerRef} style={{ background: C.bg, color: C.text, fontFamily: "'Space Grotesk', sans-serif", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{FONT}</style>
      <CustomCursor />

      {/* Progress bar */}
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "2px",
          background: C.accent,
          width: progressWidth,
          zIndex: 200,
          transformOrigin: "left",
        }}
      />

      {/* ── Navigation ─────────────────────────────────────────────────── */}
      <motion.nav
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          opacity: navOpacity,
          background: "rgba(5,5,5,0.9)",
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${C.border}`,
          padding: "0 2.5rem",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.9rem", fontWeight: 700, letterSpacing: "0.05em" }}>
          MASK<span style={{ color: C.accent }}>_</span>UNIT
        </div>
        <div style={{ display: "flex", gap: "3rem" }}>
          {["Work", "Studio", "Services", "Contact"].map((item) => (
            <motion.button
              key={item} onClick={() => document.getElementById(({"Work": "work", "Studio": "studio", "Services": "services", "Contact": "contact"})[item] || "")?.scrollIntoView({behavior:"smooth"})}
              style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.7rem", color: C.textMuted, textDecoration: "none", cursor: "pointer" }}
              whileHover={{ color: C.accent }}
            >
              {item}
            </motion.button>
          ))}
        </div>
        <motion.button
          whileHover={{ backgroundColor: C.accent, color: C.bg }}
          style={{
            background: "transparent",
            border: `1px solid ${C.border}`,
            color: C.textMuted,
            padding: "0.5rem 1.25rem",
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.65rem",
            letterSpacing: "0.1em",
            cursor: "pointer",
            transition: "all 0.3s",
          }}
        >
          START A PROJECT
        </motion.button>
      </motion.nav>

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        style={{ height: "100vh", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "3rem", position: "relative", overflow: "hidden" }}
      >
        {/* Massive background text */}
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            scale: heroScale,
            userSelect: "none",
            pointerEvents: "none",
          }}
        >
          <div style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "clamp(8rem, 22vw, 20rem)",
            fontWeight: 700,
            color: "#0A0A0A",
            letterSpacing: "-0.04em",
            lineHeight: 0.85,
            textAlign: "center",
          }}>
            MASK<br />UNIT
          </div>
        </motion.div>

        {/* Top left counter */}
        <div style={{ position: "absolute", top: "2rem", left: "3rem" }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", color: C.textDim, letterSpacing: "0.2em" }}>
            CREATIVE STUDIO
          </div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", color: C.textDim, marginTop: "0.25rem" }}>
            EST. 2012 · PARIS
          </div>
        </div>

        {/* Top right */}
        <div style={{ position: "absolute", top: "2rem", right: "3rem", textAlign: "right" }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", color: C.textDim }}>
            AWWWARDS SOTD ×38
          </div>
        </div>

        {/* Bottom content */}
        <motion.div
          style={{ position: "relative", zIndex: 1, opacity: heroOpacity }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "flex-end" }}>
            <div>
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "clamp(2rem, 4.5vw, 4rem)",
                  fontWeight: 700,
                  lineHeight: 1.05,
                  letterSpacing: "-0.03em",
                  color: C.text,
                  marginBottom: "1.5rem",
                }}
              >
                <MaskedTitle text="We Build" delay={0.3} />
                <MaskedTitle text="Brands That" delay={0.4} />
                <span style={{ color: C.accent }}>
                  <MaskedTitle text="Break Rules." delay={0.5} />
                </span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.9 }}
                style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.85rem", color: C.textMuted, lineHeight: 1.8, maxWidth: "45ch" }}
              >
                Studio créatif spécialisé dans les identités de marque disruptives, le motion design et les expériences digitales immersives.
              </motion.p>
            </div>
            <div style={{ textAlign: "right" }}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 1 }}
                style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "flex-end" }}
              >
                <motion.button
                  whileHover={{ scale: 1.04, backgroundColor: C.accentAlt }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    background: C.accent,
                    color: C.bg,
                    border: "none",
                    padding: "1rem 2.5rem",
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "0.75rem",
                    letterSpacing: "0.1em",
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "background 0.3s",
                  }}
                >
                  SEE OUR WORK →
                </motion.button>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", color: C.textDim }}>
                  Available for Q3 2025
                </span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Stats strip ─────────────────────────────────────────────────── */}
      <section id="work" style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: "0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
          {STATS.map((stat, i) => {
            const ref = useRef<HTMLDivElement>(null);
            const inView = useInView(ref, { once: true });
            return (
              <motion.div
                key={stat.label}
                ref={ref}
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                style={{
                  padding: "2.5rem 2rem",
                  borderRight: i < 3 ? `1px solid ${C.border}` : "none",
                  textAlign: "center",
                }}
              >
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "2.5rem", fontWeight: 700, color: C.accent, letterSpacing: "-0.02em" }}>
                  {stat.n}
                </div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.15em", color: C.textMuted, marginTop: "0.4rem" }}>
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── Selected Work ──────────────────────────────────────────────── */}
      <section id="studio" style={{ padding: "6rem 3rem" }}>
        <div style={{ maxWidth: "1300px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "3rem" }}>
            <div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.25em", color: C.textDim, marginBottom: "0.75rem" }}>
                / SELECTED WORK
              </div>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, letterSpacing: "-0.03em", color: C.text }}>
                Recent Projects
              </h2>
            </div>
            <motion.a
              href="#"
              style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", color: C.textMuted, textDecoration: "none", display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer" }}
              whileHover={{ color: C.accent }}
            >
              ALL PROJECTS
              <div style={{ width: "2rem", height: "1px", background: "currentcolor" }} />
            </motion.a>
          </div>

          {/* Project list */}
          <div style={{ borderTop: `1px solid ${C.border}` }}>
            {PROJECTS.map((project, i) => (
              <ProjectRow key={project.id} project={project} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ───────────────────────────────────────────────────── */}
      <section id="services" style={{ padding: "6rem 3rem", background: C.bgLight, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: "1300px", margin: "0 auto" }}>
          <div style={{ marginBottom: "4rem" }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.25em", color: C.textDim, marginBottom: "0.75rem" }}>
              / WHAT WE DO
            </div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, letterSpacing: "-0.03em", color: C.text }}>
              Services
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1px", background: C.border }}>
            {SERVICES.map((svc, i) => {
              const ref = useRef<HTMLDivElement>(null);
              const inView = useInView(ref, { once: true, margin: "-60px" });
              return (
                <motion.div
                  key={svc.title}
                  ref={ref}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: (i % 2) * 0.1 }}
                  whileHover={{ backgroundColor: C.bgCard }}
                  style={{ background: C.bgLight, padding: "3rem", position: "relative", cursor: "default" }}
                >
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", color: C.accent, marginBottom: "1.5rem" }}>
                    {svc.n}
                  </div>
                  <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.4rem", fontWeight: 700, color: C.text, marginBottom: "0.75rem", letterSpacing: "-0.02em" }}>
                    {svc.title}
                  </h3>
                  <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.8rem", color: C.textMuted, lineHeight: 1.75 }}>
                    {svc.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Team ───────────────────────────────────────────────────────── */}
      <section id="contact" style={{ padding: "6rem 3rem" }}>
        <div style={{ maxWidth: "1300px", margin: "0 auto" }}>
          <div style={{ marginBottom: "4rem" }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.25em", color: C.textDim, marginBottom: "0.75rem" }}>
              / THE TEAM
            </div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, letterSpacing: "-0.03em", color: C.text }}>
              Qui Sommes-Nous
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "2px", background: C.border }}>
            {TEAM.map((member, i) => {
              const ref = useRef<HTMLDivElement>(null);
              const inView = useInView(ref, { once: true });
              return (
                <motion.div
                  key={member.name}
                  ref={ref}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.08 }}
                  style={{ background: C.bg, padding: "2.5rem 2rem" }}
                >
                  <div style={{ width: "48px", height: "48px", background: i % 2 === 0 ? C.accent : C.accentAlt, marginBottom: "1.5rem" }} />
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1rem", fontWeight: 600, color: C.text, marginBottom: "0.25rem" }}>
                    {member.name}
                  </div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", color: C.textMuted, marginBottom: "1rem" }}>
                    {member.role}
                  </div>
                  <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                    {member.specialty.split(" · ").map((s) => (
                      <span key={s} style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.55rem", padding: "0.25rem 0.5rem", border: `1px solid ${C.border}`, color: C.textDim }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Contact CTA ────────────────────────────────────────────────── */}
      <section style={{ padding: "8rem 3rem", background: C.accent, position: "relative", overflow: "hidden" }}>
        {/* BG text */}
        <div style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          userSelect: "none",
          pointerEvents: "none",
        }}>
          <div style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "clamp(6rem, 18vw, 16rem)",
            fontWeight: 700,
            color: "rgba(0,0,0,0.06)",
            letterSpacing: "-0.04em",
            whiteSpace: "nowrap",
          }}>
            LET'S WORK
          </div>
        </div>
        <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "clamp(2.5rem, 6vw, 5.5rem)",
            fontWeight: 700,
            color: C.bg,
            letterSpacing: "-0.03em",
            lineHeight: 0.95,
            marginBottom: "2rem",
          }}>
            Prêt à Casser<br />
            Les Codes ?
          </h2>
          <p style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.9rem",
            color: "rgba(0,0,0,0.6)",
            lineHeight: 1.75,
            marginBottom: "3rem",
            maxWidth: "50ch",
            margin: "0 auto 3rem",
          }}>
            On a de la place pour 3 nouveaux clients en Q3 2025. Si votre projet nous intrigue, on peut en parler.
          </p>
          <motion.button
            whileHover={{ backgroundColor: C.bg, color: C.accent }}
            whileTap={{ scale: 0.97 }}
            style={{
              background: "transparent",
              border: `2px solid ${C.bg}`,
              color: C.bg,
              padding: "1rem 3rem",
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.8rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              cursor: "pointer",
              transition: "all 0.3s",
            }}
          >
            PARLONS-EN →
          </motion.button>
          <div style={{ marginTop: "2rem", fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", color: "rgba(0,0,0,0.5)" }}>
            hello@maskunit.studio
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer style={{ borderTop: `1px solid ${C.border}`, padding: "3rem", background: C.bg }}>
        <div style={{ maxWidth: "1300px", margin: "0 auto", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "3rem" }}>
          <div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "1rem", fontWeight: 700, color: C.text, marginBottom: "0.75rem" }}>
              MASK<span style={{ color: C.accent }}>_</span>UNIT
            </div>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.7rem", color: C.textDim, lineHeight: 1.8, maxWidth: "32ch" }}>
              Studio créatif indépendant. Paris, France. Branding · Motion · Digital.
            </p>
          </div>
          {[
            { title: "WORK", items: ["Selected Projects", "All Work", "Awards", "Process"] },
            { title: "STUDIO", items: ["About", "Team", "Values", "Careers"] },
            { title: "CONTACT", items: ["Start a Project", "Press", "Instagram", "LinkedIn"] },
          ].map((col) => (
            <div key={col.title}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.55rem", letterSpacing: "0.25em", color: C.textDim, marginBottom: "1.5rem" }}>
                {col.title}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {col.items.map((item) => (
                  <motion.a
                    key={item}
                    href="#"
                    style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.7rem", color: C.textMuted, textDecoration: "none", cursor: "pointer" }}
                    whileHover={{ color: C.accent }}
                  >
                    {item}
                  </motion.a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ maxWidth: "1300px", margin: "2.5rem auto 0", paddingTop: "2rem", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between" }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.55rem", color: C.textDim }}>
            © 2025 MASK UNIT STUDIO
          </div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.55rem", color: C.textDim }}>
            PARIS · BRANDING · MOTION · DIGITAL
          </div>
        </div>
      </footer>
    </div>
  );
}
