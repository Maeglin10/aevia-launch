"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  motion,
  useInView,
  useScroll,
  useVelocity,
  useSpring,
  useTransform,
  useMotionValue,
  AnimatePresence,
} from "framer-motion";
import { ArrowUpRight, CheckCircle } from "lucide-react";

// ─── TYPES ───────────────────────────────────────────────────────────────────
export interface Project {
  num: string;
  name: string;
  category: string;
  year: string;
  accentColor: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface Service {
  num: string;
  title: string;
  desc: string;
}

// ─── DATA ────────────────────────────────────────────────────────────────────
export const PROJECTS: Project[] = [
  {
    num: "01",
    name: "FORM COLLAPSE",
    category: "Identity Design",
    year: "2026",
    accentColor: "#ff3300",
  },
  {
    num: "02",
    name: "RAW SIGNAL",
    category: "Brand Strategy",
    year: "2025",
    accentColor: "#ffffff",
  },
  {
    num: "03",
    name: "DEAD WEIGHT",
    category: "Campaign Direction",
    year: "2025",
    accentColor: "#ffffff",
  },
  {
    num: "04",
    name: "GRID BREACH",
    category: "Digital Experience",
    year: "2025",
    accentColor: "#ffffff",
  },
  {
    num: "05",
    name: "NO MERCY",
    category: "Visual Identity",
    year: "2024",
    accentColor: "#ffffff",
  },
  {
    num: "06",
    name: "HARD RESET",
    category: "Art Direction",
    year: "2024",
    accentColor: "#ffffff",
  },
];

export const STATS: Stat[] = [
  { value: "06", label: "YEARS" },
  { value: "312", label: "PROJECTS" },
  { value: "48", label: "AWARDS" },
  { value: "19", label: "COUNTRIES" },
];

export const SERVICES: Service[] = [
  {
    num: "S·01",
    title: "BRAND IDENTITY",
    desc: "Naming, visual systems, typographic language, colour philosophy. We build marks that outlast the trend cycle — anchored in concept, ruthless in execution.",
  },
  {
    num: "S·02",
    title: "ART DIRECTION",
    desc: "We own the visual logic from first brief to final file. Campaign concepting, set direction, editorial sequencing — the whole frame, not just the corner.",
  },
  {
    num: "S·03",
    title: "DIGITAL EXPERIENCE",
    desc: "Interaction design, motion language, front-end architecture. Websites that breathe and respond. Interfaces that reward attention.",
  },
  {
    num: "S·04",
    title: "MOTION & FILM",
    desc: "Title sequences, brand films, animated identities. We treat motion as a second language — not decoration, but argument. Every frame earns its place.",
  },
];

export const MARQUEE_TEXT =
  "DESIGN · STRATEGY · CODE · IDENTITY · MOTION · DESIGN · STRATEGY · CODE · IDENTITY · MOTION · ";

export const HERO_WORDS = ["WE", "BREAK.", "WE", "BUILD.", "WE", "SHIP."];

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
export const C = {
  black: "#000000",
  white: "#ffffff",
  red: "#ff3300",
  dim: "rgba(255,255,255,0.18)",
  dimDark: "rgba(255,255,255,0.06)",
};

export const FONT_SYNE = "'Syne', 'Arial Black', 'Helvetica Neue', Arial, sans-serif";
export const FONT_MONO = "'JetBrains Mono', 'Courier New', monospace";
export const FONT_LINK =
  "https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&display=swap";

// ─── NAV LINKS ─────────────────────────────────────────────────────────────
export const NAV_LINKS = [
  { label: "WORK", href: "/templates/impact-53" },
  { label: "SERVICES", href: "/templates/impact-53/projects" },
  { label: "ABOUT", href: "/templates/impact-53/about" },
  { label: "CONTACT", href: "/templates/impact-53/contact" },
  { label: "LEGAL", href: "/templates/impact-53/legal" },
] as const;

// ─── WORD-BY-WORD HERO REVEAL ─────────────────────────────────────────────────
export function HeroWordReveal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, margin: "-10%" });

  return (
    <div
      ref={containerRef}
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0 0.35em",
        lineHeight: 0.88,
      }}
    >
      {HERO_WORDS.map((word, i) => {
        const isAccent = word === "BREAK." || word === "BUILD." || word === "SHIP.";
        return (
          <span
            key={`${word}-${i}`}
            style={{
              overflow: "hidden",
              display: "inline-block",
              verticalAlign: "top",
            }}
          >
            <motion.span
              initial={{ y: "105%" }}
              animate={inView ? { y: "0%" } : { y: "105%" }}
              transition={{
                duration: 0.78,
                delay: i * 0.11,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{
                display: "block",
                fontFamily: FONT_SYNE,
                fontWeight: 800,
                fontSize: "clamp(4.5rem, 16vw, 13rem)",
                letterSpacing: "-0.045em",
                lineHeight: 0.88,
                color: isAccent ? C.red : C.white,
                WebkitTextStroke: isAccent ? "0px" : "0px",
              }}
            >
              {word}
            </motion.span>
          </span>
        );
      })}
    </div>
  );
}

// ─── ROTATING MARQUEE BELT ────────────────────────────────────────────────────
export function MarqueeBelt() {
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });

  const velocityFactor = useTransform(smoothVelocity, [-3000, 0, 3000], [-1.5, 1, 2.5], {
    clamp: false,
  });

  const baseX = useMotionValue(0);

  useEffect(() => {
    let raf: number;
    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = now - lastTime;
      lastTime = now;
      const vel = velocityFactor.get();
      const delta = -0.04 * dt * (vel || 1);
      let next = baseX.get() + delta;
      const charWidth = 100;
      if (next < -charWidth) next = 0;
      if (next > 0) next = -charWidth;
      baseX.set(next);
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [baseX, velocityFactor]);

  const x = useTransform(baseX, (v) => `${v}%`);

  return (
    <div
      style={{
        overflow: "hidden",
        borderTop: `1px solid ${C.dim}`,
        borderBottom: `1px solid ${C.dim}`,
        background: C.black,
        padding: "1.1rem 0",
        cursor: "default",
        userSelect: "none",
      }}
    >
      <motion.div
        style={{
          x,
          display: "flex",
          whiteSpace: "nowrap",
          width: "200%",
        }}
      >
        {[0, 1].map((copy) => (
          <div
            key={copy}
            style={{
              width: "50%",
              display: "flex",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontFamily: FONT_SYNE,
                fontWeight: 800,
                fontSize: "clamp(0.75rem, 1.5vw, 1rem)",
                letterSpacing: "0.28em",
                color: C.white,
                textTransform: "uppercase",
              }}
            >
              {MARQUEE_TEXT}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

// ─── MAGNETIC BUTTON ──────────────────────────────────────────────────────────
export function MagneticCTA() {
  const ref = useRef<HTMLButtonElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springX = useSpring(rawX, { stiffness: 220, damping: 22 });
  const springY = useSpring(rawY, { stiffness: 220, damping: 22 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const RADIUS = 100;
      if (dist < RADIUS) {
        const strength = 1 - dist / RADIUS;
        rawX.set(dx * strength * 0.4);
        rawY.set(dy * strength * 0.4);
      } else {
        rawX.set(0);
        rawY.set(0);
      }
    },
    [rawX, rawY]
  );

  const handleMouseLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{ display: "inline-block", position: "relative" }}
      onMouseMove={(e) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const RADIUS = 120;
        if (dist < RADIUS) {
          const strength = 1 - dist / RADIUS;
          rawX.set(dx * strength * 0.4);
          rawY.set(dy * strength * 0.4);
        }
      }}
      onMouseLeave={() => {
        rawX.set(0);
        rawY.set(0);
        setHovered(false);
      }}
    >
      <motion.button
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={() => setHovered(true)}
        style={{
          x: springX,
          y: springY,
          fontFamily: FONT_SYNE,
          fontWeight: 800,
          fontSize: "0.72rem",
          letterSpacing: "0.22em",
          background: hovered ? C.red : C.white,
          color: hovered ? C.white : C.black,
          border: "none",
          padding: "1rem 2.2rem",
          cursor: "pointer",
          textTransform: "uppercase",
          position: "relative",
          zIndex: 1,
          transition: "background 0.15s ease, color 0.15s ease",
          boxShadow: hovered
            ? `6px 6px 0 ${C.red}, 12px 12px 0 rgba(255,51,0,0.25)`
            : "6px 6px 0 rgba(255,255,255,0.15)",
        }}
      >
        START A PROJECT
      </motion.button>
    </div>
  );
}

// ─── PROJECT ACCORDION ────────────────────────────────────────────────────────
export function ProjectAccordion({ project }: { project: Project }) {
  const [open, setOpen] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rowRef, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={rowRef}
      initial={{ opacity: 0, x: -24 }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -24 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      style={{
        borderBottom: `1px solid ${C.dim}`,
      }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width: "100%",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "1.6rem 2.5rem",
          display: "grid",
          gridTemplateColumns: "5rem 1fr auto auto",
          gap: "1.5rem",
          alignItems: "center",
          textAlign: "left",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background =
            "rgba(255,255,255,0.03)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "none";
        }}
      >
        <span
          style={{
            fontFamily: FONT_MONO,
            fontSize: "0.62rem",
            letterSpacing: "0.14em",
            color: C.dim,
          }}
        >
          {project.num}
        </span>

        <span
          style={{
            fontFamily: FONT_SYNE,
            fontWeight: 800,
            fontSize: "clamp(1.4rem, 3.5vw, 2.8rem)",
            letterSpacing: "-0.04em",
            lineHeight: 1,
            color: C.white,
          }}
        >
          {project.name}
        </span>

        <span
          style={{
            fontFamily: FONT_MONO,
            fontSize: "0.6rem",
            letterSpacing: "0.14em",
            color: C.dim,
            whiteSpace: "nowrap",
          }}
        >
          {project.year}
        </span>

        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{
            display: "inline-flex",
            color: open ? C.red : C.dim,
            fontSize: "1.4rem",
            lineHeight: 1,
            fontFamily: FONT_SYNE,
            fontWeight: 800,
          }}
        >
          +
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: "hidden" }}
            layout
          >
            <div
              style={{
                display: "flex",
                gap: 0,
                margin: "0 2.5rem 1.8rem",
                height: "120px",
                overflow: "hidden",
              }}
            >
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
                style={{
                  transformOrigin: "left",
                  background: project.accentColor === "#ff3300" ? C.red : "rgba(255,255,255,0.08)",
                  width: "8px",
                  flexShrink: 0,
                  marginRight: "2rem",
                }}
              />

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  gap: "0.6rem",
                }}
              >
                <span
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: "0.6rem",
                    letterSpacing: "0.22em",
                    color: C.red,
                    textTransform: "uppercase",
                  }}
                >
                  {project.category}
                </span>
                <span
                  style={{
                    fontFamily: FONT_SYNE,
                    fontWeight: 800,
                    fontSize: "clamp(1.8rem, 4vw, 3.5rem)",
                    letterSpacing: "-0.05em",
                    lineHeight: 0.9,
                    color: "rgba(255,255,255,0.07)",
                  }}
                >
                  {project.name}
                </span>
              </div>

              <div
                style={{
                  marginLeft: "auto",
                  display: "flex",
                  alignItems: "center",
                  paddingRight: "0.5rem",
                }}
              >
                <ArrowUpRight size={28} color={C.dim} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── STATS COUNTER SECTION ────────────────────────────────────────────────────
export function StatCounter({ stat, index }: { stat: Stat; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      style={{
        overflow: "hidden",
        borderRight: index < 3 ? `1px solid ${C.dim}` : "none",
        padding: "3rem 2.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.4rem",
      }}
    >
      <motion.div
        initial={{ clipPath: "inset(0 100% 0 0)" }}
        animate={inView ? { clipPath: "inset(0 0% 0 0)" } : { clipPath: "inset(0 100% 0 0)" }}
        transition={{
          duration: 0.9,
          delay: index * 0.12,
          ease: [0.16, 1, 0.3, 1],
        }}
        style={{
          fontFamily: FONT_SYNE,
          fontWeight: 800,
          fontSize: "clamp(6rem, 15vw, 14rem)",
          letterSpacing: "-0.06em",
          lineHeight: 0.85,
          color: C.white,
        }}
      >
        {stat.value}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{
          duration: 0.5,
          delay: index * 0.12 + 0.35,
          ease: "easeOut",
        }}
        style={{
          fontFamily: FONT_MONO,
          fontSize: "0.68rem",
          letterSpacing: "0.3em",
          color: C.dim,
          textTransform: "uppercase",
        }}
      >
        {stat.label}
      </motion.div>
    </motion.div>
  );
}

// ─── SERVICE ROW ─────────────────────────────────────────────────────────────
export function ServiceRow({ service, index }: { service: Service; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderBottom: `1px solid ${C.dim}`,
        padding: "2rem 2.5rem",
        display: "grid",
        gridTemplateColumns: "5rem 1fr 2fr auto",
        gap: "2rem",
        alignItems: "start",
        background: hovered ? "rgba(255,255,255,0.03)" : "transparent",
        transition: "background 0.2s ease",
        cursor: "default",
      }}
    >
      <span
        style={{
          fontFamily: FONT_MONO,
          fontSize: "0.6rem",
          letterSpacing: "0.15em",
          color: C.dim,
          paddingTop: "0.2rem",
        }}
      >
        {service.num}
      </span>

      <h3
        style={{
          fontFamily: FONT_SYNE,
          fontWeight: 800,
          fontSize: "clamp(1rem, 2vw, 1.4rem)",
          letterSpacing: "-0.03em",
          lineHeight: 1.1,
          color: hovered ? C.red : C.white,
          margin: 0,
          transition: "color 0.2s ease",
        }}
      >
        {service.title}
      </h3>

      <p
        style={{
          fontFamily: FONT_MONO,
          fontSize: "0.75rem",
          lineHeight: 1.65,
          letterSpacing: "0.01em",
          color: "rgba(255,255,255,0.45)",
          margin: 0,
        }}
      >
        {service.desc}
      </p>

      <motion.div
        animate={{ x: hovered ? 4 : 0, opacity: hovered ? 1 : 0.25 }}
        transition={{ duration: 0.2 }}
      >
        <ArrowUpRight size={18} color={hovered ? C.red : C.white} />
      </motion.div>
    </motion.div>
  );
}

// ─── REUSABLE HELPERS ────────────────────────────────────────────────────────
export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        fontFamily: FONT_MONO,
        fontSize: "0.62rem",
        letterSpacing: "0.28em",
        color: C.dim,
        textTransform: "uppercase",
      }}
    >
      {children}
    </span>
  );
}

export function SectionHeading({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.h2
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{
        fontFamily: FONT_SYNE,
        fontWeight: 800,
        fontSize: "clamp(2rem, 5vw, 4.5rem)",
        letterSpacing: "-0.045em",
        lineHeight: 1.05,
        paddingBottom: "0.15em",
        color: C.white,
        margin: 0,
      }}
    >
      {children}
    </motion.h2>
  );
}

export function useFonts() {
  useEffect(() => {
    const id = "syne-font-inject";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = FONT_LINK;
    document.head.appendChild(link);
  }, []);
}

export function Reveal({
  children,
  delay = 0,
  y = 40,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  style?: React.CSSProperties;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      style={style}
    >
      {children}
    </motion.div>
  );
}
