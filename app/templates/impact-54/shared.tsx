"use client";

import React, { useRef, useState, useEffect, useMemo, memo } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  useSpring,
  useInView,
} from "framer-motion";
import { Zap, Layers, Shield, Cpu, Terminal, Activity } from "lucide-react";

// ─── DATA ─────────────────────────────────────────────────────────────────────
export const FEATURES = [
  {
    icon: Zap,
    title: "Zero-Latency Engine",
    desc: "Sub-millisecond computation pipeline with predictive cache warming. Your users never wait.",
    color: "#7c3aed",
  },
  {
    icon: Layers,
    title: "Infinite Composition",
    desc: "Stack visual primitives with mathematical precision. Every layer is GPU-accelerated.",
    color: "#00ffd1",
  },
  {
    icon: Shield,
    title: "Cryptographic Core",
    desc: "End-to-end encryption baked into the data layer. Zero-knowledge proofs by default.",
    color: "#7c3aed",
  },
  {
    icon: Cpu,
    title: "Neural Synthesis",
    desc: "Generative models trained on 10B creative samples. Art that thinks for itself.",
    color: "#00ffd1",
  },
  {
    icon: Terminal,
    title: "Dev-First API",
    desc: "GraphQL + REST with auto-generated TypeScript types. Ship in hours, not days.",
    color: "#7c3aed",
  },
  {
    icon: Activity,
    title: "Live Telemetry",
    desc: "Real-time observability with sub-second metric refresh. See everything, always.",
    color: "#00ffd1",
  },
];

export const STATS = [
  { value: "10B+", label: "Samples Processed" },
  { value: "0.3ms", label: "P99 Latency" },
  { value: "99.99%", label: "Uptime SLA" },
  { value: "420K+", label: "Active Studios" },
];

export const CODE_LINES = [
  "import { Genesis } from '@artgen/core';",
  "",
  "const canvas = new Genesis({",
  "  resolution: [3840, 2160],",
  "  depth: 'infinite',",
  "  renderer: 'gpu-accelerated',",
  "});",
  "",
  "canvas.layer('particle-field', {",
  "  count: 60_000,",
  "  physics: 'newtonian',",
  "  color: palette.neon,",
  "});",
  "",
  "canvas.layer('geometry', {",
  "  type: 'procedural',",
  "  seed: crypto.randomUUID(),",
  "  mutation: 'drift',",
  "});",
  "",
  "await canvas.render({ format: 'webp', quality: 1 });",
  "// ✓ 4K frame rendered in 12ms",
];

export const PRICING = [
  {
    tier: "Studio",
    price: "$49",
    period: "/mo",
    desc: "For independent artists and small creative teams.",
    features: [
      "50K renders / month",
      "4K resolution output",
      "5 concurrent layers",
      "Community API access",
      "Basic telemetry",
    ],
    accent: false,
  },
  {
    tier: "Atelier",
    price: "$149",
    period: "/mo",
    desc: "For serious studios pushing creative boundaries.",
    features: [
      "Unlimited renders",
      "8K + HDR output",
      "Infinite layer depth",
      "Priority GPU cluster",
      "Real-time telemetry",
      "Neural synthesis beta",
    ],
    accent: true,
  },
  {
    tier: "Enterprise",
    price: "Custom",
    period: "",
    desc: "White-label deployment on your infrastructure.",
    features: [
      "On-prem or cloud",
      "SLA 99.99%",
      "Dedicated GPU pool",
      "Custom model training",
      "24/7 dedicated support",
      "Compliance & audit logs",
    ],
    accent: false,
  },
];

export const NAV_LINKS = [
  { label: "Product", href: "/templates/impact-54" },
  { label: "About", href: "/templates/impact-54/about" },
  { label: "Pricing", href: "/templates/impact-54/pricing" },
  { label: "Blog", href: "/templates/impact-54/blog" },
  { label: "Contact", href: "/templates/impact-54/contact" },
  { label: "Legal", href: "/templates/impact-54/legal" },
] as const;

// ─── GLOBAL STYLE INJECTION ───────────────────────────────────────────────────
export const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Syne:wght@400;600;700;800&display=swap');

  :root {
    --bg: #050510;
    --text: #e8e8ff;
    --accent: #7c3aed;
    --neon: #00ffd1;
    --muted: rgba(232,232,255,0.35);
    --card-bg: rgba(124,58,237,0.06);
    --border: rgba(124,58,237,0.18);
  }

  body { background: var(--bg); color: var(--text); font-family: 'Inter', sans-serif; overflow-x: hidden; }

  ::selection { background: var(--accent); color: #fff; }

  @keyframes particleDrift {
    0%   { opacity: 0.08; transform: translateY(0px) translateX(0px) scale(1); }
    33%  { opacity: 0.45; transform: translateY(-14px) translateX(7px) scale(1.3); }
    66%  { opacity: 0.15; transform: translateY(-6px) translateX(-5px) scale(0.85); }
    100% { opacity: 0.08; transform: translateY(0px) translateX(0px) scale(1); }
  }

  @keyframes float {
    0%   { transform: translateY(0px); }
    50%  { transform: translateY(-8px); }
    100% { transform: translateY(0px); }
  }

  @keyframes cursorBlink {
    0%, 49%  { opacity: 1; }
    50%, 100%{ opacity: 0; }
  }

  @keyframes rotateSlow {
    from { transform: rotateZ(0deg); }
    to   { transform: rotateZ(360deg); }
  }

  @keyframes pulseGlow {
    0%, 100% { box-shadow: 0 0 20px rgba(124,58,237,0.3); }
    50%       { box-shadow: 0 0 60px rgba(0,255,209,0.5), 0 0 100px rgba(124,58,237,0.3); }
  }

  @keyframes scanLine {
    0%   { transform: translateY(-100%); }
    100% { transform: translateY(100vh); }
  }

  @keyframes neonFlicker {
    0%, 95%, 100% { opacity: 1; }
    96%, 98%      { opacity: 0.4; }
  }

  .particle {
    position: absolute;
    border-radius: 50%;
    background: var(--neon);
    animation: particleDrift linear infinite;
    pointer-events: none;
  }

  .float-card {
    animation: float ease-in-out infinite;
  }

  .cursor-blink::after {
    content: '|';
    display: inline-block;
    color: var(--neon);
    animation: cursorBlink 0.8s step-end infinite;
    margin-left: 1px;
  }

  .neon-text {
    animation: neonFlicker 4s ease-in-out infinite;
  }

  .scan-line {
    position: fixed;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(0,255,209,0.15), transparent);
    animation: scanLine 8s linear infinite;
    pointer-events: none;
    z-index: 9998;
  }
`;

export function StyleInjector() {
  useEffect(() => {
    const existing = document.getElementById("impact-54-styles");
    if (existing) return;
    const tag = document.createElement("style");
    tag.id = "impact-54-styles";
    tag.textContent = GLOBAL_STYLES;
    document.head.appendChild(tag);
    return () => {
      const el = document.getElementById("impact-54-styles");
      if (el) el.remove();
    };
  }, []);
  return null;
}

// ─── REVEAL ON SCROLL ─────────────────────────────────────────────────────────
export const Reveal = memo(function Reveal({
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
});

// ─── 1. CSS PARTICLE FIELD ────────────────────────────────────────────────────
export function ParticleField() {
  const particles = useMemo(() => {
    return Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: `${2 + ((i * 1.618) % 96)}%`,
      top: `${1 + ((i * 2.718) % 97)}%`,
      size: 2 + (i % 4),
      delay: `${(i * 0.27) % 7}s`,
      duration: `${5 + (i % 6)}s`,
      opacity: 0.08 + (i % 5) * 0.04,
    }));
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            animationDuration: p.duration,
            opacity: p.opacity,
            background:
              p.id % 3 === 0
                ? "#00ffd1"
                : p.id % 3 === 1
                ? "#7c3aed"
                : "#e8e8ff",
          }}
        />
      ))}
    </div>
  );
}

// ─── 2. 3D ROTATING PRODUCT SHOWCASE ─────────────────────────────────────────
export function RotatingProduct({
  scrollYProgress,
}: {
  scrollYProgress: any;
}) {
  const rotateY = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const hue = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    [260, 200, 150, 170, 260]
  );
  const shadowColor = useMotionTemplate`drop-shadow(0px 30px 60px hsl(${hue}deg 80% 55% / 0.5))`;

  const spring = useSpring(rotateY, { stiffness: 40, damping: 20 });

  return (
    <motion.div
      style={{
        width: 280,
        height: 280,
        position: "relative",
        transformStyle: "preserve-3d",
        perspective: 1200,
        rotateY: spring,
        filter: shadowColor,
        margin: "0 auto",
      }}
    >
      <motion.div
        animate={{ rotateZ: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        style={{
          position: "absolute",
          inset: 0,
          border: "2px solid rgba(124,58,237,0.4)",
          borderRadius: "50%",
        }}
      />
      <motion.div
        animate={{ rotateZ: -360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        style={{
          position: "absolute",
          top: "15%",
          left: "15%",
          right: "15%",
          bottom: "15%",
          border: "2px solid rgba(0,255,209,0.5)",
          transform: "rotateZ(45deg)",
          borderRadius: 8,
        }}
      />
      <motion.div
        animate={{ rotateZ: 120 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{
          position: "absolute",
          top: "28%",
          left: "28%",
          right: "28%",
          bottom: "28%",
          background:
            "linear-gradient(135deg, rgba(124,58,237,0.7), rgba(0,255,209,0.4))",
          borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
          border: "1px solid rgba(232,232,255,0.2)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: 16,
          height: 16,
          borderRadius: "50%",
          background: "#00ffd1",
          boxShadow: "0 0 30px #00ffd1, 0 0 60px rgba(0,255,209,0.5)",
          animation: "pulseGlow 2s ease-in-out infinite",
        }}
      />
      {[0, 72, 144, 216, 288].map((angle, i) => (
        <motion.div
          key={i}
          animate={{ rotateZ: 360 }}
          transition={{
            duration: 8 + i * 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            position: "absolute",
            inset: 0,
            transformOrigin: "center",
            transform: `rotateZ(${angle}deg)`,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translate(-50%, 0)",
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: i % 2 === 0 ? "#7c3aed" : "#00ffd1",
              boxShadow: `0 0 12px ${i % 2 === 0 ? "#7c3aed" : "#00ffd1"}`,
            }}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}

// ─── 3. TYPEWRITER CODE REVEAL ────────────────────────────────────────────────
export function TypewriterCode() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [revealedLines, setRevealedLines] = useState<string[]>([]);
  const [currentLineIdx, setCurrentLineIdx] = useState(0);
  const [currentCharIdx, setCurrentCharIdx] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (inView && !started) {
      setStarted(true);
    }
  }, [inView, started]);

  useEffect(() => {
    if (!started) return;
    if (currentLineIdx >= CODE_LINES.length) return;

    const line = CODE_LINES[currentLineIdx];

    if (currentCharIdx >= line.length) {
      const timer = setTimeout(() => {
        setRevealedLines((prev) => [...prev, line]);
        setCurrentLineIdx((i) => i + 1);
        setCurrentCharIdx(0);
      }, line.length === 0 ? 80 : 120);
      return () => clearTimeout(timer);
    }

    const charDelay = line.length === 0 ? 80 : 28 + Math.random() * 20;
    const timer = setTimeout(() => {
      setCurrentCharIdx((c) => c + 1);
    }, charDelay);
    return () => clearTimeout(timer);
  }, [started, currentLineIdx, currentCharIdx]);

  const currentTypingLine =
    currentLineIdx < CODE_LINES.length
      ? CODE_LINES[currentLineIdx].slice(0, currentCharIdx)
      : null;
  const isTypingDone = currentLineIdx >= CODE_LINES.length;

  return (
    <div ref={ref}>
      <div
        style={{
          background: "rgba(5,5,16,0.95)",
          border: "1px solid rgba(124,58,237,0.3)",
          borderRadius: 12,
          overflow: "hidden",
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
          fontSize: 13,
          lineHeight: 1.7,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 16px",
            borderBottom: "1px solid rgba(124,58,237,0.2)",
            background: "rgba(124,58,237,0.08)",
          }}
        >
          {["#ff5f57", "#febc2e", "#28c840"].map((c, i) => (
            <div
              key={i}
              style={{ width: 12, height: 12, borderRadius: "50%", background: c }}
            />
          ))}
          <span
            style={{
              marginLeft: 8,
              color: "rgba(232,232,255,0.3)",
              fontSize: 11,
              fontFamily: "'Inter', sans-serif",
            }}
          >
            artgen-studio — canvas.ts
          </span>
        </div>

        <div style={{ padding: "20px 24px", minHeight: 480 }}>
          {revealedLines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.1 }}
              style={{ display: "flex", gap: 16 }}
            >
              <span
                style={{
                  color: "rgba(232,232,255,0.15)",
                  userSelect: "none",
                  minWidth: 24,
                  textAlign: "right",
                }}
              >
                {i + 1}
              </span>
              <span>{renderColorizedLine(line)}</span>
            </motion.div>
          ))}

          {currentTypingLine !== null && (
            <div style={{ display: "flex", gap: 16 }}>
              <span
                style={{
                  color: "rgba(232,232,255,0.15)",
                  userSelect: "none",
                  minWidth: 24,
                  textAlign: "right",
                }}
              >
                {revealedLines.length + 1}
              </span>
              <span
                className={isTypingDone ? "" : "cursor-blink"}
                style={{ color: "rgba(232,232,255,0.7)" }}
              >
                {renderColorizedLine(currentTypingLine)}
              </span>
            </div>
          )}

          {isTypingDone && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ marginTop: 12, color: "#00ffd1", fontSize: 12 }}
            >
              <span style={{ color: "rgba(232,232,255,0.2)" }}>
                {CODE_LINES.length + 1}
              </span>
              {"  "}
              <span className="neon-text">
                ✓ Genesis compiled in 847ms — ready to render
              </span>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

function renderColorizedLine(line: string): React.ReactNode {
  if (!line) return " ";

  const comments = line.match(/\/\/.*/)?.[0];

  if (comments) {
    const beforeComment = line.slice(0, line.indexOf(comments));
    return (
      <>
        <ColorizedSegment text={beforeComment} />
        <span style={{ color: "rgba(0,255,209,0.5)", fontStyle: "italic" }}>
          {comments}
        </span>
      </>
    );
  }

  return <ColorizedSegment text={line} />;
}

function ColorizedSegment({ text }: { text: string }) {
  const keywords = [
    "import",
    "from",
    "const",
    "new",
    "await",
    "async",
    "return",
    "true",
    "false",
  ];
  const parts = text.split(/(\s+|[.,:{}\[\]()'])/);

  return (
    <>
      {parts.map((part, i) => {
        if (keywords.includes(part.trim())) {
          return (
            <span key={i} style={{ color: "#7c3aed" }}>
              {part}
            </span>
          );
        }
        if (/^['"`]/.test(part) || /['"`]$/.test(part)) {
          return (
            <span key={i} style={{ color: "#00ffd1" }}>
              {part}
            </span>
          );
        }
        if (/^\d/.test(part.trim())) {
          return (
            <span key={i} style={{ color: "#f59e0b" }}>
              {part}
            </span>
          );
        }
        if (/^[A-Z]/.test(part.trim()) && part.trim().length > 1) {
          return (
            <span key={i} style={{ color: "#60a5fa" }}>
              {part}
            </span>
          );
        }
        return (
          <span key={i} style={{ color: "rgba(232,232,255,0.75)" }}>
            {part}
          </span>
        );
      })}
    </>
  );
}

// ─── useScrollTheme ──────────────────────────────────────────────────────────
export function useScrollTheme(scrollYProgress: any) {
  const r1 = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    [5, 5, 20, 5, 5]
  );
  const g1 = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    [5, 10, 5, 30, 5]
  );
  const b1 = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    [16, 60, 16, 40, 16]
  );

  const accentH = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    [262, 220, 280, 160, 262]
  );
  const accentS = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    [80, 90, 85, 80, 80]
  );
  const accentL = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    [58, 65, 55, 50, 58]
  );

  const bgGradient = useMotionTemplate`radial-gradient(ellipse 120% 80% at 50% 0%, rgb(${r1},${g1},${b1}) 0%, #050510 70%)`;
  const accentColor = useMotionTemplate`hsl(${accentH}deg ${accentS}% ${accentL}%)`;

  return { bgGradient, accentColor };
}
