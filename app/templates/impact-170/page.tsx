"use client";
// @ts-nocheck

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";

// ─── Design tokens ─────────────────────────────────────────────────────────────
// Lightens (positive percent) or darkens (negative) a #rrggbb hex color —
// used to derive light/dark shades from the client's brand color.
function shadeColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  if (isNaN(num)) return hex;
  const amt = Math.round(2.55 * percent);
  const r = Math.max(0, Math.min(255, (num >> 16) + amt));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amt));
  const b = Math.max(0, Math.min(255, (num & 0x0000ff) + amt));
  return `#${(0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1)}`;
}

let C: Record<string, string> = {
  bg: "#0e1117",
  surface: "#131720",
  card: "#181f2d",
  cardBorder: "#1e2a3a",
  green: "#00ff41",
  greenDim: "rgba(0,255,65,0.12)",
  greenGlow: "rgba(0,255,65,0.08)",
  cyan: "#00e5ff",
  purple: "#818cf8",
  amber: "#f59e0b",
  text: "#e2e8f0",
  muted: "#64748b",
  subtle: "#1e293b",
  border: "rgba(0,255,65,0.12)",
  font: "'JetBrains Mono', 'Fira Code', monospace",
  fontSans: "'Inter', system-ui, sans-serif",
};

// ─── Data ──────────────────────────────────────────────────────────────────────
const SKILLS = [
  { name: "TypeScript / JavaScript", level: 97, category: "Frontend", color: C.green },
  { name: "React / Next.js", level: 95, category: "Frontend", color: C.green },
  { name: "Node.js / NestJS", level: 91, category: "Backend", color: C.cyan },
  { name: "PostgreSQL / Prisma", level: 86, category: "Backend", color: C.cyan },
  { name: "System Design", level: 88, category: "Architecture", color: C.purple },
  { name: "API Design (REST/GraphQL)", level: 93, category: "Architecture", color: C.purple },
  { name: "Docker / Kubernetes", level: 79, category: "DevOps", color: C.amber },
  { name: "CI/CD (GitHub Actions)", level: 82, category: "DevOps", color: C.amber },
];

const TIMELINE = [
  {
    year: "2023 — Présent",
    role: "Lead Engineer",
    company: "Arkéo SaaS",
    desc: "Architecture full-stack d'une plateforme de gestion documentaire IA. Supervision d'une équipe de 8 ingénieurs. Croissance 0 → 3 200 clients en 18 mois, €2.4M ARR.",
    tags: ["Next.js 15", "NestJS", "Prisma", "PostgreSQL", "OpenAI"],
    color: C.green,
    highlight: true,
  },
  {
    year: "2021 — 2023",
    role: "Senior Frontend Engineer",
    company: "Volta Finance",
    desc: "Refonte complète du dashboard d'investissement temps réel. Réduction de 65% du temps de chargement initial. Conformité MiFID II. 80K+ utilisateurs actifs.",
    tags: ["React", "TypeScript", "D3.js", "WebSockets", "Jest"],
    color: C.purple,
    highlight: false,
  },
  {
    year: "2019 — 2021",
    role: "Fullstack Developer",
    company: "Agence Pixel & Co",
    desc: "Développement de 14 projets web pour des clients PME/ETI. Spécialisation e-commerce Shopify + architectures headless CMS.",
    tags: ["Vue.js", "Shopify", "PHP 8", "MySQL"],
    color: C.amber,
    highlight: false,
  },
  {
    year: "2018",
    role: "Freelance Developer",
    company: "Indépendant",
    desc: "Premiers projets client — sites vitrine, APIs REST, intégrations tierces. Apprentissage accéléré en conditions réelles.",
    tags: ["React", "Express", "MongoDB"],
    color: C.muted,
    highlight: false,
  },
];

const PROJECTS = [
  {
    name: "Arkéo Platform",
    status: "production",
    desc: "SaaS B2B de gestion documentaire avec IA embarquée. Classification automatique, extraction d'entités, workflows de validation.",
    tech: ["Next.js", "NestJS", "OpenAI", "Prisma"],
    metrics: ["3 200+ clients", "€2.4M ARR", "99.97% uptime"],
    link: "#",
    color: C.green,
  },
  {
    name: "Volta Dashboard",
    status: "production",
    desc: "Interface temps réel pour portfolio d'investissement. Graphiques D3.js, flux WebSocket, rapports PDF automatisés.",
    tech: ["React", "D3.js", "WebSockets", "PostgreSQL"],
    metrics: ["80K+ users", "120K req/day", "<80ms p99"],
    link: "#",
    color: C.purple,
  },
  {
    name: "use-scroll-animation",
    status: "open-source",
    desc: "Hook React pour animations au scroll déclaratives. API simple, performant avec ResizeObserver + IntersectionObserver.",
    tech: ["TypeScript", "Framer Motion", "Rollup"],
    metrics: ["1.4K GitHub ★", "230K npm dl/mo", "MIT license"],
    link: "#",
    color: C.amber,
  },
  {
    name: "Helix CLI",
    status: "open-source",
    desc: "Outil CLI pour scaffolding de projets NestJS avec architecture hexagonale préconfigurée. Templates opinionated.",
    tech: ["Node.js", "Commander.js", "Handlebars"],
    metrics: ["680 GitHub ★", "45K npm dl/mo", "12 contributors"],
    link: "#",
    color: C.cyan,
  },
];

const OPEN_SOURCE = [
  { repo: "vercel/next.js", contribution: "Fix: RSC streaming avec headers customs", pr: "#58291", merged: true },
  { repo: "nestjs/nest", contribution: "Feat: support async guards dans le decorateur @UseGuards", pr: "#13847", merged: true },
  { repo: "prisma/prisma", contribution: "Docs: exemples transactions imbriquées avec savepoints", pr: "#24139", merged: false },
  { repo: "framer/motion", contribution: "Fix: memory leak useScroll avec container ref", pr: "#2841", merged: true },
];

const TERMINAL_LINES = [
  { delay: 0.1, text: "$ whoami", color: C.green },
  { delay: 0.5, text: "rafael.moreau — lead engineer & open-source contributor", color: C.text },
  { delay: 1.0, text: "$ cat skills.txt", color: C.green },
  { delay: 1.4, text: "TypeScript · React · Next.js · NestJS · PostgreSQL · System Design", color: C.text },
  { delay: 2.0, text: "$ git log --oneline -3", color: C.green },
  { delay: 2.4, text: "a3f8c2d feat: implement streaming SSE for AI responses", color: C.cyan },
  { delay: 2.7, text: "b91e4a1 fix: race condition in concurrent request handler", color: C.cyan },
  { delay: 3.0, text: "4c72b8e perf: reduce p99 latency by 40% with query optimization", color: C.cyan },
  { delay: 3.6, text: "$ node --version && npx tsc --version", color: C.green },
  { delay: 4.0, text: "v22.4.0  TypeScript 5.5.3", color: C.text },
  { delay: 4.6, text: "$ echo $AVAILABLE_FOR_WORK", color: C.green },
  { delay: 5.0, text: "true — open to senior / staff positions (remote preferred)", color: "#00ff41" },
  { delay: 5.6, text: "$ _", color: C.green },
];

const NAV_LINKS = [
  { label: "skills", id: "skills" },
  { label: "experience", id: "experience" },
  { label: "projects", id: "projects" },
  { label: "oss", id: "oss" },
  { label: "contact", id: "contact" },
];

const MARQUEE_ITEMS = [
  "TypeScript",
  "React 19",
  "Next.js 15",
  "NestJS",
  "PostgreSQL",
  "Prisma",
  "Docker",
  "GraphQL",
  "WebSockets",
  "OpenAI API",
  "System Design",
  "TDD",
];

// ─── Font loader ───────────────────────────────────────────────────────────────
function useFonts() {
  useEffect(() => {
    const id = "rafael-fonts";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600&family=Inter:wght@300;400;500;600&display=swap');`;
    document.head.appendChild(style);
  }, []);
}

// ─── Reusable components ───────────────────────────────────────────────────────
function TextReveal({
  children,
  delay = 0,
  style: externalStyle,
}: {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}) {
  return (
    <div style={{ overflow: "hidden", ...externalStyle }}>
      <motion.div
        initial={{ y: "110%", opacity: 0 }}
        whileInView={{ y: "0%", opacity: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.9, delay, ease: [0.76, 0, 0.24, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}

function MagneticButton({
  children,
  style: externalStyle,
  onClick,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: () => void;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 25 });
  const springY = useSpring(y, { stiffness: 300, damping: 25 });
  const ref = useRef<HTMLButtonElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      x.set((e.clientX - (rect.left + rect.width / 2)) * 0.35);
      y.set((e.clientY - (rect.top + rect.height / 2)) * 0.35);
    },
    [x, y]
  );

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.button
      ref={ref}
      style={{ ...externalStyle, x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
    >
      {children}
    </motion.button>
  );
}

function SpotlightCard({
  children,
  style: externalStyle,
  accentColor = "rgba(0,255,65,0.08)",
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  accentColor?: string;
}) {
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50, active: false });
  

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setSpotlight({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
      active: true,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setSpotlight((s) => ({ ...s, active: false }));
  }, []);

  const bg = externalStyle?.background || C.card;

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        ...externalStyle,
        background: spotlight.active
          ? `radial-gradient(circle at ${spotlight.x}% ${spotlight.y}%, ${accentColor} 0%, ${bg} 65%)`
          : bg,
        transition: "background 0.1s ease",
      }}
    >
      {children}
    </div>
  );
}

function MarqueeStrip({
  items,
  bg,
  color,
}: {
  items: string[];
  bg: string;
  color: string;
}) {
  const doubled = [...items, ...items];
  return (
    <div
      style={{
        overflow: "hidden",
        background: bg,
        paddingTop: 18,
        paddingBottom: 18,
        borderTop: `1px solid ${C.border}`,
        borderBottom: `1px solid ${C.border}`,
      }}
    >
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        style={{ display: "flex", whiteSpace: "nowrap", width: "max-content" }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            style={{
              fontFamily: C.font,
              fontSize: 11,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color,
              paddingLeft: 48,
              paddingRight: 48,
              display: "inline-flex",
              alignItems: "center",
              gap: 24,
            }}
          >
            {item}
            <span
              style={{
                width: 4,
                height: 4,
                borderRadius: "50%",
                background: C.green,
                display: "inline-block",
                opacity: 0.5,
              }}
            />
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ─── Terminal typing line (extracted component) ───────────────────────────────
function TerminalLine({
  line,
  isVisible,
}: {
  line: (typeof TERMINAL_LINES)[0];
  isVisible: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={isVisible ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.3, ease: "easeOut" }}
      style={{
        fontFamily: C.font,
        fontSize: 13,
        lineHeight: 1.7,
        color: line.color,
        paddingLeft: line.text.startsWith("$") ? 0 : 16,
      }}
    >
      {line.text}
    </motion.div>
  );
}

// ─── Skill bar (extracted component) ──────────────────────────────────────────
function SkillBar({ skill, index }: { skill: (typeof SKILLS)[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      style={{ marginBottom: 20 }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 8,
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontFamily: C.font,
            fontSize: 12,
            color: C.text,
          }}
        >
          {skill.name}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span
            style={{
              fontFamily: C.font,
              fontSize: 9,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: skill.color,
              opacity: 0.7,
            }}
          >
            {skill.category}
          </span>
          <span
            style={{
              fontFamily: C.font,
              fontSize: 12,
              color: skill.color,
            }}
          >
            {skill.level}%
          </span>
        </div>
      </div>

      <div
        style={{
          height: 2,
          background: "rgba(255,255,255,0.06)",
          borderRadius: 1,
          overflow: "hidden",
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${skill.level}%` } : {}}
          transition={{
            duration: 1.2,
            delay: index * 0.07 + 0.2,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{
            height: "100%",
            background: `linear-gradient(90deg, ${skill.color}, ${skill.color}99)`,
            borderRadius: 1,
            boxShadow: `0 0 8px ${skill.color}66`,
          }}
        />
      </div>
    </motion.div>
  );
}

// ─── Timeline item (extracted component) ──────────────────────────────────────
function TimelineItem({
  item,
  index,
  isLast,
}: {
  item: (typeof TIMELINE)[0];
  index: number;
  isLast: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -40 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      style={{ display: "flex", gap: 32 }}
    >
      {/* Timeline line */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <motion.div
          animate={{
            background: hovered ? item.color : "rgba(255,255,255,0.1)",
            boxShadow: hovered ? `0 0 16px ${item.color}88` : "none",
          }}
          transition={{ duration: 0.3 }}
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            border: `2px solid ${item.color}`,
            marginTop: 4,
            flexShrink: 0,
          }}
        />
        {!isLast && (
          <div
            style={{
              width: 1,
              flex: 1,
              background: `linear-gradient(to bottom, ${item.color}44, transparent)`,
              marginTop: 8,
            }}
          />
        )}
      </div>

      {/* Content */}
      <div
        style={{ paddingBottom: isLast ? 0 : 56 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div
          style={{
            fontFamily: C.font,
            fontSize: 11,
            color: item.color,
            letterSpacing: "0.1em",
            marginBottom: 8,
            opacity: 0.8,
          }}
        >
          {item.year}
        </div>
        <div
          style={{
            fontFamily: C.fontSans,
            fontSize: 20,
            fontWeight: 600,
            color: C.text,
            marginBottom: 4,
          }}
        >
          {item.role}
        </div>
        <div
          style={{
            fontFamily: C.font,
            fontSize: 12,
            color: item.color,
            marginBottom: 16,
            opacity: 0.7,
          }}
        >
          @ {item.company}
        </div>
        <p
          style={{
            fontFamily: C.fontSans,
            fontSize: 14,
            lineHeight: 1.75,
            color: "rgba(226,232,240,0.6)",
            marginBottom: 16,
            maxWidth: 600,
          }}
        >
          {item.desc}
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {item.tags.map((tag) => (
            <span
              key={tag}
              style={{
                fontFamily: C.font,
                fontSize: 10,
                color: item.color,
                background: `${item.color}12`,
                border: `1px solid ${item.color}30`,
                padding: "4px 10px",
                borderRadius: 2,
                letterSpacing: "0.08em",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Project card (extracted component) ───────────────────────────────────────
function ProjectCard({
  project,
  index,
}: {
  project: (typeof PROJECTS)[0];
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <SpotlightCard
        accentColor={`${project.color}10`}
        style={{
          background: C.card,
          border: `1px solid ${hovered ? project.color + "44" : C.cardBorder}`,
          borderRadius: 4,
          padding: "32px 28px",
          height: "100%",
          cursor: "default",
          transition: "border-color 0.3s ease",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Bullseye reveal on hover */}
        <motion.div
          animate={{
            opacity: hovered ? 1 : 0,
            scale: hovered ? 1.5 : 0.5,
          }}
          transition={{ duration: 0.5 }}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: 200,
            height: 200,
            borderRadius: "50%",
            border: `1px solid ${project.color}20`,
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
          }}
        />
        <motion.div
          animate={{
            opacity: hovered ? 1 : 0,
            scale: hovered ? 1.2 : 0.3,
          }}
          transition={{ duration: 0.5, delay: 0.05 }}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: 120,
            height: 120,
            borderRadius: "50%",
            border: `1px solid ${project.color}15`,
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 16,
            }}
          >
            <span
              style={{
                fontFamily: C.font,
                fontSize: 9,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: project.color,
                background: `${project.color}12`,
                border: `1px solid ${project.color}30`,
                padding: "4px 10px",
                borderRadius: 2,
              }}
            >
              {project.status}
            </span>
            <motion.span
              animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : 10 }}
              transition={{ duration: 0.25 }}
              style={{
                fontFamily: C.font,
                fontSize: 16,
                color: project.color,
              }}
            >
              ↗
            </motion.span>
          </div>

          <div
            style={{
              fontFamily: C.fontSans,
              fontSize: 20,
              fontWeight: 600,
              color: C.text,
              marginBottom: 12,
            }}
          >
            {project.name}
          </div>

          <p
            style={{
              fontFamily: C.fontSans,
              fontSize: 13,
              lineHeight: 1.7,
              color: "rgba(226,232,240,0.55)",
              marginBottom: 20,
            }}
          >
            {project.desc}
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              marginBottom: 20,
              paddingBottom: 20,
              borderBottom: `1px solid ${C.cardBorder}`,
            }}
          >
            {project.metrics.map((m) => (
              <div
                key={m}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background: project.color,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: C.font,
                    fontSize: 11,
                    color: project.color,
                    opacity: 0.8,
                  }}
                >
                  {m}
                </span>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {project.tech.map((t) => (
              <span
                key={t}
                style={{
                  fontFamily: C.font,
                  fontSize: 9,
                  color: C.muted,
                  background: C.subtle,
                  padding: "3px 8px",
                  borderRadius: 2,
                  letterSpacing: "0.08em",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </SpotlightCard>
    </motion.div>
  );
}

// ─── OSS row (extracted component) ────────────────────────────────────────────
function OssRow({
  item,
  index,
}: {
  item: (typeof OPEN_SOURCE)[0];
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "20px 24px",
        background: hovered ? C.card : "transparent",
        border: `1px solid ${hovered ? C.border : "transparent"}`,
        borderRadius: 4,
        cursor: "default",
        transition: "all 0.25s ease",
        flexWrap: "wrap",
        gap: 12,
      }}
    >
      <div>
        <div
          style={{
            fontFamily: C.font,
            fontSize: 13,
            color: C.green,
            marginBottom: 4,
          }}
        >
          {item.repo}
        </div>
        <div
          style={{
            fontFamily: C.fontSans,
            fontSize: 14,
            color: "rgba(226,232,240,0.7)",
          }}
        >
          {item.contribution}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span
          style={{
            fontFamily: C.font,
            fontSize: 11,
            color: C.muted,
          }}
        >
          {item.pr}
        </span>
        <span
          style={{
            fontFamily: C.font,
            fontSize: 9,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: item.merged ? C.green : C.amber,
            background: item.merged ? `${C.green}12` : `${C.amber}12`,
            border: `1px solid ${item.merged ? `${C.green}30` : `${C.amber}30`}`,
            padding: "4px 10px",
            borderRadius: 2,
          }}
        >
          {item.merged ? "merged" : "open"}
        </span>
      </div>
    </motion.div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function Impact170Page() {
  const [session, setSession] = useState<{
    formData?: {
      businessName?: string; businessType?: string; tagline?: string;
      city?: string; mainService?: string; benefits?: string[];
      priceRange?: string; targetAudience?: string; brandColor?: string;
      email?: string; phone?: string; instagram?: string; linkedin?: string;
    };
    generatedContent?: {
      heroHeadline?: string; heroSubline?: string; aboutTitle?: string;
      aboutText?: string; ctaText?: string; metaTitle?: string;
      metaDescription?: string;
      services?: { title?: string; description?: string }[];
      testimonials?: { name?: string; role?: string; text?: string; rating?: number }[];
    };
  } | null>(null);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("session");
    if (!id) return;
    fetch(`/api/sessions?id=${id}`)
      .then((r) => r.json())
      .then(setSession)
      .catch(() => {});
  }, []);

  fd = session?.formData;
  c = session?.generatedContent;
  brand = fd?.brandColor ?? null; // null = keep template's original color

  if (brand) {
    C = {
      ...C,
      green: brand,
    };
  }

  useFonts();

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [terminalVisible, setTerminalVisible] = useState(false);
  const [visibleLines, setVisibleLines] = useState(0);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    type: "",
    message: "",
  });
  const [formSent, setFormSent] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();
  const { scrollY } = useScroll();

  const scaleX = useSpring(scrollYProgress, { stiffness: 400, damping: 40 });

  // Hero parallax
  const heroY = useTransform(scrollY, [0, 600], ["0%", "25%"]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);

  useEffect(() => {
    const unsub = scrollY.on("change", (v) => setScrolled(v > 60));
    return unsub;
  }, [scrollY]);

  // Terminal typing animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTerminalVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (terminalRef.current) observer.observe(terminalRef.current);
    return () => observer.disconnect();
  }, []);

  // Dynamic Services & Testimonials Mutation for Session Data
  useEffect(() => {
    if (c?.services) {
      const services_arrays = [
        typeof SERVICES !== 'undefined' ? SERVICES : null,
        typeof features !== 'undefined' ? features : null,
        typeof services !== 'undefined' ? services : null,
        typeof FEATURES !== 'undefined' ? FEATURES : null,
      ];
      services_arrays.forEach(arr => {
        if (arr && Array.isArray(arr)) {
          arr.forEach((s, idx) => {
            if (idx < 3 && c.services[idx]) {
              if (s && typeof s === 'object') {
                s.title = c.services[idx].title ?? s.title;
                if ('desc' in s) s.desc = c.services[idx].description ?? s.desc;
                if ('description' in s) s.description = c.services[idx].description ?? s.description;
              }
            }
          });
        }
      });
    }
    if (c?.testimonials) {
      const testimonials_arrays = [
        typeof TESTIMONIALS !== 'undefined' ? TESTIMONIALS : null,
        typeof testimonials !== 'undefined' ? testimonials : null,
        typeof REVIEWS !== 'undefined' ? REVIEWS : null,
        typeof reviews !== 'undefined' ? reviews : null,
      ];
      testimonials_arrays.forEach(arr => {
        if (arr && Array.isArray(arr)) {
          arr.forEach((t, idx) => {
            if (idx < 3 && c.testimonials[idx]) {
              if (t && typeof t === 'object') {
                t.name = c.testimonials[idx].name ?? t.name;
                if ('role' in t) t.role = c.testimonials[idx].role ?? t.role;
                if ('text' in t) t.text = c.testimonials[idx].text ?? t.text;
                if ('quote' in t) t.quote = c.testimonials[idx].text ?? t.quote;
                if ('desc' in t) t.desc = c.testimonials[idx].text ?? t.desc;
              }
            }
          });
        }
      });
    }
  }, [c]);

  useEffect(() => {
    if (!terminalVisible) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    TERMINAL_LINES.forEach((line, i) => {
      const t = setTimeout(() => {
        setVisibleLines((v) => Math.max(v, i + 1));
      }, line.delay * 1000);
      timers.push(t);
    });
    return () => timers.forEach(clearTimeout);
  }, [terminalVisible]);

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  }, []);

  const handleFormSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setFormSent(true);
  }, []);

  return (
    <div
      style={{
        background: C.bg,
        color: C.text,
        fontFamily: C.fontSans,
        minHeight: "100dvh",
        overflowX: "hidden",
      }}
    >
      {/* Scroll progress bar */}
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: `linear-gradient(90deg, ${C.green}, ${C.cyan})`,
          transformOrigin: "0%",
          scaleX,
          zIndex: 200,
        }}
      />

      {/* Scanline overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.008) 2px, rgba(0,255,65,0.008) 4px)`,
        }}
      />

      {/* ── Navigation ── */}
      <motion.nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 40px",
          height: 64,
          background: scrolled ? "rgba(14,17,23,0.95)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? `1px solid ${C.border}` : "1px solid transparent",
          transition: "all 0.4s ease",
        }}
      >
        <div
          style={{
            fontFamily: C.font,
            fontSize: 14,
            fontWeight: 500,
            color: C.green,
            cursor: "pointer",
            letterSpacing: "0.05em",
          }}
          onClick={() => scrollTo("hero")}
        >
          {fd?.logoBase64 ? (
            <img
              src={fd.logoBase64}
              alt={fd?.businessName ?? 'logo'}
              style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
            />
          ) : (
            <>
          rafael.moreau<span style={{ opacity: 0.5 }}>@dev</span>
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1.1, repeat: Infinity }}
          >
            _
          </motion.span>
            </>
          )}
        </div>

        <div id="mb170-nav" style={{ display: "flex", gap: 32, alignItems: "center" }}>      {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: C.font,
                fontSize: 11,
                letterSpacing: "0.1em",
                color: C.muted,
                padding: 0,
                transition: "color 0.25s ease",
              }}
              onMouseEnter={(e) =>
                ((e.target as HTMLButtonElement).style.color = C.green)
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLButtonElement).style.color = C.muted)
              }
            >
              ./{link.label}
            </button>
          ))}
          <MagneticButton
            onClick={() => scrollTo("contact")}
            style={{
              background: "none",
              border: `1px solid ${C.green}`,
              color: C.green,
              fontFamily: C.font,
              fontSize: 11,
              letterSpacing: "0.12em",
              padding: "8px 20px",
              cursor: "pointer",
              borderRadius: 2,
            }}
          >
            hire_me()
          </MagneticButton>
      </div>
        <button
          className="mb170-burger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
          style={{ display: "none", flexDirection: "column", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 4 }}
        >
          <span style={{ display: "block", width: 24, height: 1.5, background: "currentColor", transition: "all 0.3s", transform: menuOpen ? "rotate(45deg) translate(4.5px, 4.5px)" : "none" }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: "currentColor", transition: "all 0.3s", opacity: menuOpen ? 0 : 1 }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: "currentColor", transition: "all 0.3s", transform: menuOpen ? "rotate(-45deg) translate(4.5px, -4.5px)" : "none" }} />
        </button>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 8,
            display: "none",
          }}
        >
          <div style={{ width: 22, height: 1.5, background: C.green, marginBottom: 5 }} />
          <div style={{ width: 22, height: 1.5, background: C.green, marginBottom: 5, opacity: menuOpen ? 0 : 1 }} />
          <div style={{ width: 22, height: 1.5, background: C.green }} />
        </button>
      </motion.nav>
      {menuOpen && (
        <div style={{ position: "fixed", top: 64, left: 0, right: 0, zIndex: 99, background: "rgba(255,255,255,0.98)", borderBottom: "1px solid #e5e5e5", padding: "24px 32px", display: "flex", flexDirection: "column", gap: 20, backdropFilter: "blur(12px)" }}>
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: C.font,
                fontSize: 11,
                letterSpacing: "0.1em",
                color: C.muted,
                padding: 0,
                transition: "color 0.25s ease",
              }}
              onMouseEnter={(e) =>
                ((e.target as HTMLButtonElement).style.color = C.green)
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLButtonElement).style.color = C.muted)
              }
            >
              ./{link.label}
            </button>
          ))}
          <MagneticButton
            onClick={() => scrollTo("contact")}
            style={{
              background: "none",
              border: `1px solid ${C.green}`,
              color: C.green,
              fontFamily: C.font,
              fontSize: 11,
              letterSpacing: "0.12em",
              padding: "8px 20px",
              cursor: "pointer",
              borderRadius: 2,
            }}
          >
            hire_me()
          </MagneticButton>
        </div>
      )}
      <style>{`@media (max-width: 900px) { #mb170-nav { display: none !important; } .mb170-burger { display: flex !important; } }
        /* mobile: stack 2-col grids to single column (added by responsive fix) */
        @media (max-width: 768px) {
          .imx-mobstack { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            style={{
              position: "fixed",
              top: 64,
              left: 0,
              right: 0,
              background: "rgba(14,17,23,0.98)",
              zIndex: 99,
              padding: "32px 40px",
              display: "flex",
              flexDirection: "column",
              gap: 20,
              borderBottom: `1px solid ${C.border}`,
            }}
          >
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: C.font,
                  fontSize: 18,
                  color: C.green,
                  textAlign: "left",
                  padding: 0,
                }}
              >
                $ cd ./{link.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HERO ── */}
      <section
        id="hero"
        ref={heroRef}
        style={{
          position: "relative",
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          padding: "120px 40px 80px",
        }}
      >
        {/* Background grid */}
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            y: heroY,
            opacity: heroOpacity,
            backgroundImage: `
              linear-gradient(rgba(0,255,65,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,255,65,0.04) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Glow */}
        <div
          style={{
            position: "absolute",
            top: "30%",
            left: "60%",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${C.green}08 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />

        <div className="imx-mobstack"
          style={{
            position: "relative",
            zIndex: 2,
            maxWidth: 1200,
            width: "100%",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 80,
            alignItems: "center",
          }}
        >
          {/* Left: intro */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{
                fontFamily: C.font,
                fontSize: 11,
                color: C.green,
                letterSpacing: "0.15em",
                marginBottom: 24,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: C.green,
                  boxShadow: `0 0 8px ${C.green}`,
                }}
              />
              Available for work — Remote / Paris
            </motion.div>

            <TextReveal>
              <h1
                style={{
                  fontFamily: C.font,
                  fontSize: "clamp(36px, 5vw, 62px)",
                  fontWeight: 600,
                  color: C.text,
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                }}
              >{c?.heroHeadline ?? <>
                Rafaël
                <br />
                <span style={{ color: C.green }}>Moreau</span>
              </>}</h1>
            </TextReveal>

            <TextReveal delay={0.1}>
              <div
                style={{
                  fontFamily: C.font,
                  fontSize: "clamp(16px, 2vw, 22px)",
                  color: C.muted,
                  marginTop: 12,
                  marginBottom: 32,
                  lineHeight: 1.4,
                }}
              >
                Lead Engineer · TypeScript · React · NestJS
              </div>
            </TextReveal>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              style={{
                fontFamily: C.fontSans,
                fontSize: 15,
                lineHeight: 1.85,
                color: "rgba(226,232,240,0.6)",
                marginBottom: 40,
                maxWidth: 480,
              }}
            >{c?.heroSubline ?? fd?.tagline ?? <>
              8 ans d'expérience sur des systèmes distribués à haute disponibilité.
              Je construis des APIs qui tiennent à l'échelle, des frontends qui se
              chargent en 80ms, et des équipes qui livrent sans drama.
            </>}</motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.65 }}
              style={{ display: "flex", gap: 16, flexWrap: "wrap" }}
            >
              <MagneticButton
                onClick={() => scrollTo("projects")}
                style={{
                  background: C.green,
                  border: "none",
                  color: C.bg,
                  fontFamily: C.font,
                  fontSize: 11,
                  letterSpacing: "0.12em",
                  fontWeight: 600,
                  padding: "14px 32px",
                  cursor: "pointer",
                  borderRadius: 2,
                }}
              >
                ./view_projects
              </MagneticButton>
              <MagneticButton
                onClick={() => scrollTo("contact")}
                style={{
                  background: "none",
                  border: `1px solid rgba(226,232,240,0.2)`,
                  color: C.text,
                  fontFamily: C.font,
                  fontSize: 11,
                  letterSpacing: "0.12em",
                  padding: "14px 32px",
                  cursor: "pointer",
                  borderRadius: 2,
                }}
              >
                ./contact
              </MagneticButton>
            </motion.div>
          </div>

          {/* Right: Terminal */}
          <motion.div
            ref={terminalRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 6,
              overflow: "hidden",
              boxShadow: `0 0 60px rgba(0,255,65,0.06), 0 24px 80px rgba(0,0,0,0.5)`,
            }}
          >
            {/* Terminal header */}
            <div
              style={{
                background: C.card,
                padding: "12px 20px",
                display: "flex",
                alignItems: "center",
                gap: 8,
                borderBottom: `1px solid ${C.border}`,
              }}
            >
              <div style={{ display: "flex", gap: 6 }}>
                {["#ff5f57", "#ffbd2e", "#28c840"].map((c, i) => (
                  <div
                    key={i}
                    style={{
                      width: 11,
                      height: 11,
                      borderRadius: "50%",
                      background: c,
                    }}
                  />
                ))}
              </div>
              <span
                style={{
                  fontFamily: C.font,
                  fontSize: 11,
                  color: C.muted,
                  marginLeft: 12,
                }}
              >
                zsh — rafael@macbook
              </span>
            </div>

            {/* Terminal body */}
            <div style={{ padding: "24px 20px", minHeight: 320 }}>
              {TERMINAL_LINES.slice(0, visibleLines).map((line, i) => (
                <TerminalLine key={i} line={line} isVisible={true} />
              ))}
              {visibleLines < TERMINAL_LINES.length && (
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  style={{
                    fontFamily: C.font,
                    fontSize: 13,
                    color: C.green,
                  }}
                >
                  ▌
                </motion.span>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Marquee ── */}
      <MarqueeStrip items={MARQUEE_ITEMS} bg={C.surface} color={C.muted} />

      {/* ── Skills ── */}
      <section
        id="skills"
        style={{
          padding: "100px 40px",
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <div className="imx-mobstack"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            gap: 80,
            alignItems: "flex-start",
          }}
        >
          <div style={{ position: "sticky", top: 100 }}>
            <TextReveal>
              <div
                style={{
                  fontFamily: C.font,
                  fontSize: 10,
                  color: C.green,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  marginBottom: 16,
                }}
              >
                // skills.json
              </div>
            </TextReveal>
            <TextReveal delay={0.1}>
              <h2
                style={{
                  fontFamily: C.fontSans,
                  fontSize: "clamp(28px, 3vw, 44px)",
                  fontWeight: 700,
                  color: C.text,
                  lineHeight: 1.15,
                  letterSpacing: "-0.02em",
                  marginBottom: 24,
                }}
              >{c?.aboutTitle ?? fd?.businessName ?? <>
                Stack technique
              </>}</h2>
            </TextReveal>
            <p
              style={{
                fontFamily: C.fontSans,
                fontSize: 14,
                lineHeight: 1.8,
                color: "rgba(226,232,240,0.5)",
              }}
            >{c?.aboutText ?? <>
              8 ans de pratique intensive. Les niveaux reflètent une honnêteté
              brutale — 100% n'existe pas.
            </>}</p>

            <div
              style={{
                marginTop: 32,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {[
                { cat: "Frontend", color: C.green },
                { cat: "Backend", color: C.cyan },
                { cat: "Architecture", color: C.purple },
                { cat: "DevOps", color: C.amber },
              ].map((c) => (
                <div
                  key={c.cat}
                  style={{ display: "flex", alignItems: "center", gap: 10 }}
                >
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: c.color,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: C.font,
                      fontSize: 11,
                      color: c.color,
                      opacity: 0.8,
                    }}
                  >
                    {c.cat}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            {SKILLS.map((skill, i) => (
              <SkillBar key={skill.name} skill={skill} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Experience ── */}
      <section
        id="experience"
        style={{
          padding: "100px 40px",
          background: C.surface,
          borderTop: `1px solid ${C.border}`,
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ marginBottom: 72 }}>
            <TextReveal>
              <div
                style={{
                  fontFamily: C.font,
                  fontSize: 10,
                  color: C.green,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  marginBottom: 16,
                }}
              >
                // career_timeline.json
              </div>
            </TextReveal>
            <TextReveal delay={0.1}>
              <h2
                style={{
                  fontFamily: C.fontSans,
                  fontSize: "clamp(28px, 3vw, 44px)",
                  fontWeight: 700,
                  color: C.text,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.15,
                }}
              >
                Expérience
              </h2>
            </TextReveal>
          </div>

          <div>
            {TIMELINE.map((item, i) => (
              <TimelineItem
                key={item.company}
                item={item}
                index={i}
                isLast={i === TIMELINE.length - 1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Projects ── */}
      <section
        id="projects"
        style={{
          padding: "100px 40px",
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <div style={{ marginBottom: 64 }}>
          <TextReveal>
            <div
              style={{
                fontFamily: C.font,
                fontSize: 10,
                color: C.green,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              // featured_projects[]
            </div>
          </TextReveal>
          <TextReveal delay={0.1}>
            <h2
              style={{
                fontFamily: C.fontSans,
                fontSize: "clamp(28px, 3vw, 44px)",
                fontWeight: 700,
                color: C.text,
                letterSpacing: "-0.02em",
                lineHeight: 1.15,
              }}
            >
              Projets notables
            </h2>
          </TextReveal>
        </div>

        <div className="imx-mobstack"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 20,
          }}
        >
          {PROJECTS.map((project, i) => (
            <ProjectCard key={project.name} project={project} index={i} />
          ))}
        </div>
      </section>

      {/* ── Open Source ── */}
      <section
        id="oss"
        style={{
          padding: "100px 40px",
          background: C.surface,
          borderTop: `1px solid ${C.border}`,
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ marginBottom: 56 }}>
            <TextReveal>
              <div
                style={{
                  fontFamily: C.font,
                  fontSize: 10,
                  color: C.green,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  marginBottom: 16,
                }}
              >
                // open_source_contributions[]
              </div>
            </TextReveal>
            <TextReveal delay={0.1}>
              <h2
                style={{
                  fontFamily: C.fontSans,
                  fontSize: "clamp(28px, 3vw, 44px)",
                  fontWeight: 700,
                  color: C.text,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.15,
                }}
              >
                Open Source
              </h2>
            </TextReveal>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {OPEN_SOURCE.map((item, i) => (
              <OssRow key={item.pr} item={item} index={i} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{
              marginTop: 48,
              padding: "24px 28px",
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: C.font,
                  fontSize: 13,
                  color: C.green,
                  marginBottom: 4,
                }}
              >
                github.com/rafael-moreau
              </div>
              <div
                style={{
                  fontFamily: C.fontSans,
                  fontSize: 13,
                  color: "rgba(226,232,240,0.5)",
                }}
              >
                2 projets maintenus · 12 PRs mergées sur des projets tiers · ~280K dl/mois cumulés
              </div>
            </div>
            <a
              href="#contact"
              style={{
                fontFamily: C.font,
                fontSize: 11,
                color: C.green,
                textDecoration: "none",
                border: `1px solid ${C.green}`,
                padding: "8px 20px",
                borderRadius: 2,
                letterSpacing: "0.1em",
              }}
            >{c?.ctaText ?? <>
              voir le profil →
            </>}</a>
          </motion.div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section
        id="contact"
        style={{
          padding: "100px 40px",
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <div className="imx-mobstack"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 80,
            alignItems: "flex-start",
          }}
        >
          <div>
            <TextReveal>
              <div
                style={{
                  fontFamily: C.font,
                  fontSize: 10,
                  color: C.green,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  marginBottom: 16,
                }}
              >
                // contact.ts
              </div>
            </TextReveal>
            <TextReveal delay={0.1}>
              <h2
                style={{
                  fontFamily: C.fontSans,
                  fontSize: "clamp(28px, 3vw, 44px)",
                  fontWeight: 700,
                  color: C.text,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.15,
                  marginBottom: 24,
                }}
              >
                Travaillons ensemble
              </h2>
            </TextReveal>
            <p
              style={{
                fontFamily: C.fontSans,
                fontSize: 14,
                lineHeight: 1.85,
                color: "rgba(226,232,240,0.5)",
                marginBottom: 40,
              }}
            >
              Ouvert aux postes Lead / Staff Engineer (remote préféré), aux missions
              freelance de 3+ mois, et aux partenariats techniques sur des projets
              ambitieux.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { label: "email", value: "rafael@moreau.dev" },
                { label: "linkedin", value: "/in/rafael-moreau" },
                { label: "github", value: "@rafael-moreau" },
                { label: "location", value: "Paris, France (remote OK)" },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    display: "flex",
                    gap: 16,
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontFamily: C.font,
                      fontSize: 11,
                      color: C.green,
                      opacity: 0.7,
                      width: 80,
                      flexShrink: 0,
                    }}
                  >
                    {item.label}:
                  </span>
                  <span
                    style={{
                      fontFamily: C.font,
                      fontSize: 13,
                      color: C.text,
                    }}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <AnimatePresence mode="wait">
              {formSent ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    padding: "48px",
                    background: C.card,
                    border: `1px solid ${C.green}44`,
                    borderRadius: 4,
                    textAlign: "center",
                    boxShadow: `0 0 40px ${C.green}08`,
                  }}
                >
                  <div
                    style={{
                      fontFamily: C.font,
                      fontSize: 14,
                      color: C.green,
                      marginBottom: 12,
                    }}
                  >
                    ✓ message.sent === true
                  </div>
                  <p
                    style={{
                      fontFamily: C.fontSans,
                      fontSize: 14,
                      color: "rgba(226,232,240,0.5)",
                    }}
                  >
                    Je réponds en 24–48h. Check your inbox.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onSubmit={handleFormSubmit}
                  style={{
                    background: C.card,
                    border: `1px solid ${C.cardBorder}`,
                    borderRadius: 4,
                    padding: "36px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 20,
                  }}
                >
                  <div
                    style={{
                      fontFamily: C.font,
                      fontSize: 11,
                      color: C.muted,
                      borderBottom: `1px solid ${C.cardBorder}`,
                      paddingBottom: 16,
                      marginBottom: 4,
                    }}
                  >
                    {"// new ContactRequest({"}
                  </div>

                  {[
                    { key: "name", label: "name", type: "text", placeholder: '"Julien Bernard"' },
                    { key: "email", label: "email", type: "email", placeholder: '"julien@company.io"' },
                    { key: "type", label: "opportunity", type: "text", placeholder: '"Freelance 3 mois / CDI Lead Eng"' },
                  ].map((field) => (
                    <div key={field.key}>
                      <label
                        style={{
                          fontFamily: C.font,
                          fontSize: 10,
                          color: C.muted,
                          display: "block",
                          marginBottom: 6,
                          letterSpacing: "0.1em",
                        }}
                      >
                        {field.label}:{" "}
                      </label>
                      <input
                        type={field.type}
                        placeholder={field.placeholder}
                        value={contactForm[field.key as keyof typeof contactForm]}
                        onChange={(e) =>
                          setContactForm((f) => ({ ...f, [field.key]: e.target.value }))
                        }
                        required
                        style={{
                          width: "100%",
                          background: C.surface,
                          border: `1px solid ${C.cardBorder}`,
                          borderRadius: 2,
                          padding: "12px 14px",
                          fontFamily: C.font,
                          fontSize: 13,
                          color: C.text,
                          outline: "none",
                          boxSizing: "border-box",
                          transition: "border-color 0.25s ease",
                        }}
                        onFocus={(e) =>
                          (e.target.style.borderColor = C.green)
                        }
                        onBlur={(e) =>
                          (e.target.style.borderColor = C.cardBorder)
                        }
                      />
                    </div>
                  ))}

                  <div>
                    <label
                      style={{
                        fontFamily: C.font,
                        fontSize: 10,
                        color: C.muted,
                        display: "block",
                        marginBottom: 6,
                        letterSpacing: "0.1em",
                      }}
                    >
                      message:{" "}
                    </label>
                    <textarea
                      placeholder='"Décris ton projet ou poste ici..."'
                      value={contactForm.message}
                      onChange={(e) =>
                        setContactForm((f) => ({ ...f, message: e.target.value }))
                      }
                      required
                      rows={5}
                      style={{
                        width: "100%",
                        background: C.surface,
                        border: `1px solid ${C.cardBorder}`,
                        borderRadius: 2,
                        padding: "12px 14px",
                        fontFamily: C.font,
                        fontSize: 13,
                        color: C.text,
                        outline: "none",
                        resize: "vertical",
                        boxSizing: "border-box",
                        transition: "border-color 0.25s ease",
                      }}
                      onFocus={(e) =>
                        (e.target.style.borderColor = C.green)
                      }
                      onBlur={(e) =>
                        (e.target.style.borderColor = C.cardBorder)
                      }
                    />
                  </div>

                  <div
                    style={{
                      fontFamily: C.font,
                      fontSize: 11,
                      color: C.muted,
                      marginTop: -4,
                    }}
                  >
                    {"})"}
                  </div>

                  <MagneticButton
                    style={{
                      background: C.green,
                      border: "none",
                      color: C.bg,
                      fontFamily: C.font,
                      fontSize: 12,
                      letterSpacing: "0.1em",
                      fontWeight: 600,
                      padding: "16px 32px",
                      cursor: "pointer",
                      borderRadius: 2,
                      marginTop: 4,
                    }}
                  >
                    send()
                  </MagneticButton>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        style={{
          padding: "36px 40px",
          borderTop: `1px solid ${C.border}`,
          background: C.surface,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div
            style={{
              fontFamily: C.font,
              fontSize: 13,
              color: C.green,
              opacity: 0.7,
            }}
          >
            rafael.moreau@dev
          </div>
          <div
            style={{
              fontFamily: C.font,
              fontSize: 11,
              color: C.muted,
              textAlign: "center",
            }}
          >
            © 2025 · Built with Next.js 15 + TypeScript · No trackers, no cookies
          </div>
          <div style={{ display: "flex", gap: 24 }}>
            {["github", "linkedin", "twitter"].map((s) => (
              <a
                key={s}
                href="#hero"
                style={{
                  fontFamily: C.font,
                  fontSize: 11,
                  color: C.muted,
                  textDecoration: "none",
                  letterSpacing: "0.1em",
                }}
              >
                {s}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
