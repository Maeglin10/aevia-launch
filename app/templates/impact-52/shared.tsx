"use client";

import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { useState, useRef, useEffect } from "react";
import {
  Terminal,
  Cpu,
  Radio,
  Globe,
  Layers,
  Code2,
} from "lucide-react";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

export const PINK = "#ff2d78";
export const CYAN = "#00f5ff";
export const PURPLE = "#b44fff";
export const BG = "#06000f";
export const CARD_BG = "#0d0018";

export const C = { PINK, CYAN, PURPLE, BG, CARD_BG };

export const F = {
  mono: "'Courier New', monospace",
};

export const BASE_PATH = "/templates/impact-52";

export const NAV_LINKS = [
  { label: "NETWORK", href: `${BASE_PATH}` },
  { label: "SERVICES", href: `${BASE_PATH}/services` },
  { label: "WORKS", href: `${BASE_PATH}/portfolio` },
  { label: "TEAM", href: `${BASE_PATH}/team` },
  { label: "CONTACT", href: `${BASE_PATH}/contact` },
];

// ─── DATA ────────────────────────────────────────────────────────────────────

export const SERVICES = [
  {
    icon: Terminal,
    name: "NEURAL DESIGN",
    code: "SVC_01",
    desc: "Architecting hyper-visual interfaces that bleed neon into every pixel. We weaponize aesthetics and deliver interfaces that feel like the future.",
    color: PINK,
    tags: ["UI/UX", "MOTION", "IDENTITY"],
  },
  {
    icon: Cpu,
    name: "BYTE ARCHITECTURE",
    code: "SVC_02",
    desc: "Systems built in silicon and shadow. Full-stack structures engineered for zero-latency throughput and infinite scale under any load.",
    color: CYAN,
    tags: ["REACT", "NODE", "POSTGRES"],
  },
  {
    icon: Radio,
    name: "VOID ENGINEERING",
    code: "SVC_03",
    desc: "We build in the dark. Signal-layer protocols, encrypted pipelines, and spectral backend meshes that power mission-critical systems.",
    color: PURPLE,
    tags: ["API", "SECURITY", "INFRA"],
  },
  {
    icon: Globe,
    name: "GRID DEPLOYMENT",
    code: "SVC_04",
    desc: "Edge-distributed, globally replicated, zero-downtime. We launch into production and stay there — monitored, optimized, evolving.",
    color: CYAN,
    tags: ["DEVOPS", "CDN", "CI/CD"],
  },
  {
    icon: Layers,
    name: "SIGNAL STRATEGY",
    code: "SVC_05",
    desc: "Before the first line of code: roadmaps, architecture decisions, tech stack selection, and growth trajectories written in data.",
    color: PINK,
    tags: ["AUDIT", "ROADMAP", "GROWTH"],
  },
  {
    icon: Code2,
    name: "PHANTOM SYSTEMS",
    code: "SVC_06",
    desc: "AI-augmented automation, LLM integrations, and machine intelligence woven into products. We make software that learns.",
    color: PURPLE,
    tags: ["AI", "LLM", "AUTOMATION"],
  },
];

export const STATS = [
  { value: "∞", unit: "FPS", label: "RENDER RATE", color: PINK },
  { value: "0", unit: "ms", label: "LAG TOLERANCE", color: CYAN },
  { value: "147", unit: "+", label: "PROJECTS SHIPPED", color: PURPLE },
  { value: "24/7", unit: "", label: "UPTIME STATUS", color: PINK },
  { value: "99.9", unit: "%", label: "CLIENT RETENTION", color: CYAN },
  { value: "12", unit: "YRS", label: "IN THE GRID", color: PURPLE },
];

export const PORTFOLIO = [
  {
    title: "NEON_DRIFT",
    category: "VISUAL SYSTEMS",
    gradient: `linear-gradient(135deg, ${PINK}55 0%, ${PURPLE}22 50%, #06000f 100%)`,
    accent: PINK,
    year: "2024",
    desc: "E-commerce platform with real-time 3D product visualization",
  },
  {
    title: "MATRIX_CORE",
    category: "BYTE ARCHITECTURE",
    gradient: `linear-gradient(135deg, ${CYAN}44 0%, #06000f 70%)`,
    accent: CYAN,
    year: "2024",
    desc: "Distributed ledger system processing 2M+ tx/day",
  },
  {
    title: "GHOST_WIRE",
    category: "VOID ENGINEERING",
    gradient: `linear-gradient(135deg, ${PURPLE}55 0%, #06000f 60%)`,
    accent: PURPLE,
    year: "2023",
    desc: "Zero-trust security mesh for Fortune 500 enterprise",
  },
  {
    title: "BLADE_RUN",
    category: "NEURAL DESIGN",
    gradient: `linear-gradient(135deg, ${PINK}33 0%, ${CYAN}33 100%)`,
    accent: CYAN,
    year: "2023",
    desc: "AI-driven creative suite with real-time collaboration",
  },
  {
    title: "CYBER_FLUX",
    category: "GRID DEPLOYMENT",
    gradient: `linear-gradient(135deg, ${CYAN}22 0%, ${PURPLE}44 100%)`,
    accent: PURPLE,
    year: "2023",
    desc: "Global CDN orchestration for 40+ regional nodes",
  },
  {
    title: "PHANTOM_X",
    category: "PHANTOM SYSTEMS",
    gradient: `linear-gradient(135deg, ${PURPLE}22 0%, ${PINK}44 100%)`,
    accent: PINK,
    year: "2022",
    desc: "LLM-powered content engine serving 500K+ users",
  },
];

export const TEAM = [
  {
    name: "ARIA_VOSS",
    role: "CREATIVE DIRECTOR",
    handle: "@aria.exe",
    color: PINK,
    bio: "Former lead at IDEO. 14 years shaping digital identities for global brands.",
    stat: "73 AWARDS",
  },
  {
    name: "KAI_NEXUS",
    role: "CHIEF ARCHITECT",
    handle: "@kai.sys",
    color: CYAN,
    bio: "Ex-Google infra. Built systems processing 10B+ daily requests at scale.",
    stat: "10B+ REQS",
  },
  {
    name: "ZARA_VOID",
    role: "AI ENGINEER",
    handle: "@zara.null",
    color: PURPLE,
    bio: "PhD in ML. Pioneering the integration of generative AI in production products.",
    stat: "12 PATENTS",
  },
  {
    name: "REX_SIGNAL",
    role: "SECURITY LEAD",
    handle: "@rex.enc",
    color: PINK,
    bio: "Zero-day researcher. Keeps our systems — and yours — bulletproof.",
    stat: "0 BREACHES",
  },
];

// ─── GLOBAL CSS ──────────────────────────────────────────────────────────────

export const GLOBAL_STYLES = `
  * { cursor: none !important; }

  @keyframes crt-flicker {
    0%   { opacity: 0.013; }
    5%   { opacity: 0.015; }
    10%  { opacity: 0.012; }
    15%  { opacity: 0.016; }
    25%  { opacity: 0.013; }
    30%  { opacity: 0.015; }
    35%  { opacity: 0.012; }
    40%  { opacity: 0.014; }
    45%  { opacity: 0.013; }
    50%  { opacity: 0.016; }
    55%  { opacity: 0.013; }
    60%  { opacity: 0.015; }
    70%  { opacity: 0.012; }
    80%  { opacity: 0.015; }
    90%  { opacity: 0.014; }
    100% { opacity: 0.013; }
  }

  @keyframes scanline-move {
    0%   { transform: translateY(0); }
    100% { transform: translateY(4px); }
  }

  body::after {
    content: '';
    position: fixed;
    inset: 0;
    z-index: 9997;
    pointer-events: none;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0, 245, 255, 0.015) 2px,
      rgba(0, 245, 255, 0.015) 3px
    );
    animation: crt-flicker 0.15s infinite, scanline-move 8s linear infinite;
  }

  @keyframes glitch-clip-1 {
    0%   { clip-path: inset(40% 0 61% 0); transform: translate(-4px, 0); }
    20%  { clip-path: inset(92% 0 1% 0);  transform: translate(4px, 0); }
    40%  { clip-path: inset(43% 0 1% 0);  transform: translate(0, 0); }
    60%  { clip-path: inset(25% 0 58% 0); transform: translate(3px, 0); }
    80%  { clip-path: inset(54% 0 7% 0);  transform: translate(-3px, 0); }
    100% { clip-path: inset(58% 0 43% 0); transform: translate(0, 0); }
  }

  @keyframes glitch-clip-2 {
    0%   { clip-path: inset(50% 0 30% 0); transform: translate(4px, 0); }
    20%  { clip-path: inset(10% 0 80% 0); transform: translate(-4px, 0); }
    40%  { clip-path: inset(60% 0 5% 0);  transform: translate(0, 0); }
    60%  { clip-path: inset(30% 0 50% 0); transform: translate(-3px, 0); }
    80%  { clip-path: inset(75% 0 15% 0); transform: translate(3px, 0); }
    100% { clip-path: inset(20% 0 70% 0); transform: translate(0, 0); }
  }

  .glitch-card {
    position: relative;
    overflow: hidden;
  }

  .glitch-card[data-text]::before,
  .glitch-card[data-text]::after {
    content: attr(data-text);
    position: absolute;
    top: 0; left: 0; right: 0;
    font-family: 'Courier New', monospace;
    font-weight: 900;
    font-size: inherit;
    letter-spacing: inherit;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.1s;
  }

  .glitch-card:hover[data-text]::before {
    color: ${PINK};
    text-shadow: -2px 0 ${CYAN};
    opacity: 0.85;
    animation: glitch-clip-1 0.4s infinite linear;
    left: 2px;
  }

  .glitch-card:hover[data-text]::after {
    color: ${CYAN};
    text-shadow: 2px 0 ${PINK};
    opacity: 0.85;
    animation: glitch-clip-2 0.4s infinite linear;
    left: -2px;
  }

  @keyframes border-draw {
    from { transform: scaleX(0); }
    to   { transform: scaleX(1); }
  }

  .neon-divider {
    transform-origin: left center;
    transform: scaleX(0);
    transition: transform 0.8s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .neon-divider.in-view {
    transform: scaleX(1);
  }

  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 8px currentColor, 0 0 20px currentColor; }
    50%       { box-shadow: 0 0 16px currentColor, 0 0 40px currentColor, 0 0 60px currentColor; }
  }

  .portfolio-card-centered {
    animation: pulse-glow 2s ease-in-out infinite;
  }

  @keyframes hero-grid-pulse {
    0%, 100% { opacity: 0.07; }
    50%       { opacity: 0.14; }
  }
`;

// ─── CURSOR TRAIL ────────────────────────────────────────────────────────────

const TRAIL_LENGTH = 8;

export function CursorTrail() {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { stiffness: 220, damping: 22, mass: 0.6 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  const [trail, setTrail] = useState<{ x: number; y: number }[]>(
    Array.from({ length: TRAIL_LENGTH }, () => ({ x: -100, y: -100 }))
  );

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    const interval = setInterval(() => {
      const cx = cursorX.get();
      const cy = cursorY.get();
      setTrail((prev) => {
        const next = [{ x: cx, y: cy }, ...prev.slice(0, TRAIL_LENGTH - 1)];
        return next;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [cursorX, cursorY]);

  return (
    <>
      {trail.map((pos, i) => {
        const opacity = ((TRAIL_LENGTH - i) / TRAIL_LENGTH) * 0.55;
        const size = Math.max(2, 10 - i * 1.1);
        const colors = [PINK, CYAN, PURPLE];
        const color = colors[i % colors.length];
        return (
          <div
            key={i}
            style={{
              position: "fixed",
              left: pos.x - size / 2,
              top: pos.y - size / 2,
              width: size,
              height: size,
              borderRadius: "50%",
              background: color,
              opacity,
              pointerEvents: "none",
              zIndex: 99999,
              boxShadow: `0 0 ${size * 2}px ${color}`,
              transition: "none",
            }}
          />
        );
      })}
      {/* Main cursor dot */}
      <motion.div
        style={{
          position: "fixed",
          left: cursorX,
          top: cursorY,
          x: -6,
          y: -6,
          width: 12,
          height: 12,
          borderRadius: "50%",
          background: PINK,
          boxShadow: `0 0 12px ${PINK}, 0 0 24px ${PINK}88`,
          pointerEvents: "none",
          zIndex: 100000,
        }}
      />
      {/* Outer ring */}
      <motion.div
        style={{
          position: "fixed",
          left: cursorX,
          top: cursorY,
          x: -18,
          y: -18,
          width: 36,
          height: 36,
          borderRadius: "50%",
          border: `1px solid ${CYAN}88`,
          pointerEvents: "none",
          zIndex: 99999,
        }}
      />
    </>
  );
}

// ─── REUSABLE COMPONENTS ─────────────────────────────────────────────────────

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
      transition={{ duration: 0.9, delay, ease: [0.23, 1, 0.32, 1] }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

export function NeonDivider({ color = PINK }: { color?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, {
    once: true,
    margin: "-60px",
  });

  useEffect(() => {
    if (!ref.current) return;
    if (inView) {
      ref.current.classList.add("in-view");
    }
  }, [inView]);

  return (
    <div
      ref={ref}
      className="neon-divider"
      style={{
        height: "1px",
        background: `linear-gradient(90deg, ${color}, ${color}00)`,
        boxShadow: `0 0 8px ${color}`,
        color,
        margin: "0",
      }}
    />
  );
}

export function SectionLabel({
  code,
  color = CYAN,
}: {
  code: string;
  color?: string;
}) {
  return (
    <span
      style={{
        fontSize: "0.58rem",
        fontFamily: F.mono,
        color,
        letterSpacing: "0.4em",
        textShadow: `0 0 10px ${color}`,
        display: "block",
        marginBottom: "1rem",
      }}
    >
      {code}
    </span>
  );
}

export function GlitchHeadline({
  text,
  color = PINK,
  outlineText,
  outlineColor = CYAN,
}: {
  text: string;
  color?: string;
  outlineText?: string;
  outlineColor?: string;
}) {
  const [ticking, setTicking] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setTicking(true);
      setTimeout(() => setTicking(false), 200);
    }, 4000 + Math.random() * 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.h2
      animate={ticking ? { x: [0, -4, 4, -2, 2, 0], skewX: [0, -1, 1, 0] } : {}}
      transition={{ duration: 0.2 }}
      style={{
        fontSize: "clamp(2.8rem, 7vw, 6rem)",
        fontFamily: F.mono,
        fontWeight: 900,
        lineHeight: 0.9,
        letterSpacing: "-0.02em",
        margin: "0 0 2rem",
      }}
    >
      <span
        style={{
          display: "block",
          color,
          textShadow: `0 0 30px ${color}, 0 0 60px ${color}44`,
        }}
      >
        {text}
      </span>
      {outlineText && (
        <span
          style={{
            display: "block",
            color: "transparent",
            WebkitTextStroke: `2px ${outlineColor}`,
            textShadow: `0 0 20px ${outlineColor}44`,
          }}
        >
          {outlineText}
        </span>
      )}
    </motion.h2>
  );
}
