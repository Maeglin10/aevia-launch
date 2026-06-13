'use client';

import React, { useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
  type MotionValue,
} from 'framer-motion';
import {
  ShoppingBag,
  Star,
  Truck,
  ShieldCheck,
  ArrowRight,
  Plus,
  Minus,
  Check,
  Zap,
  Heart,
} from 'lucide-react';

/* ════════════════════════════════════════════════════════════════════════════
   AirForge — Premium Sneaker Brand E-commerce
   Scroll-driven SVG "shoe assembly" hero (exploded → assembled)
   ════════════════════════════════════════════════════════════════════════════ */

const C = {
  bg: '#08090b',
  bgAlt: '#0e1013',
  bgCard: '#14171c',
  bgCardHover: '#1b1f26',
  neon: '#e3ff34',
  neonDim: '#b8cf1f',
  white: '#f4f6f8',
  textMuted: '#8a909c',
  textFaint: '#565b66',
  border: '#23272f',
  borderLight: '#333a45',
  red: '#ff4d4d',
  fontDisplay:
    "'Inter', 'Helvetica Neue', system-ui, -apple-system, sans-serif",
  fontBody: "'Inter', system-ui, -apple-system, sans-serif",
} as const;

/* ─── Shared style helpers ────────────────────────────────────────────────── */
const pageStyle: React.CSSProperties = {
  background: C.bg,
  color: C.white,
  fontFamily: C.fontBody,
  overflowX: 'hidden',
  WebkitFontSmoothing: 'antialiased',
};

const sectionPad: React.CSSProperties = {
  paddingInline: 'clamp(20px, 6vw, 120px)',
};

const condensed: React.CSSProperties = {
  fontFamily: C.fontDisplay,
  fontWeight: 900,
  letterSpacing: '-0.03em',
  textTransform: 'uppercase',
};

/* ════════════════════════════════════════════════════════════════════════════
   1. SCROLL HERO — exploded sneaker assembly
   ════════════════════════════════════════════════════════════════════════════ */

interface PartProps {
  scroll: MotionValue<number>;
  fromX: number;
  fromY: number;
  fromRot: number;
  children: React.ReactNode;
  delayBand?: [number, number];
}

function ShoePart({
  scroll,
  fromX,
  fromY,
  fromRot,
  children,
  delayBand = [0, 1],
}: PartProps) {
  const [a, b] = delayBand;
  const x = useTransform(scroll, [a, b], [fromX, 0]);
  const y = useTransform(scroll, [a, b], [fromY, 0]);
  const rotate = useTransform(scroll, [a, b], [fromRot, 0]);
  const opacity = useTransform(scroll, [a, Math.min(a + 0.12, b)], [0.15, 1]);

  return (
    <motion.g style={{ x, y, rotate, opacity }}>{children}</motion.g>
  );
}

function ScrollHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Headline transforms
  const titleOpacity = useTransform(scrollYProgress, [0, 0.18, 0.85, 1], [1, 1, 1, 0]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const assembledLabelOpacity = useTransform(
    scrollYProgress,
    [0.75, 0.95],
    [0, 1],
  );
  const glowScale = useTransform(scrollYProgress, [0, 1], [0.6, 1.25]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.2, 0.5, 0.85]);
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section
      ref={containerRef}
      style={{ height: '320vh', position: 'relative', background: C.bg }}
    >
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Background radial glow */}
        <motion.div
          aria-hidden
          style={{
            position: 'absolute',
            width: '90vmin',
            height: '90vmin',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${C.neon}22 0%, transparent 65%)`,
            scale: glowScale,
            opacity: glowOpacity,
            filter: 'blur(20px)',
          }}
        />

        {/* Giant background word */}
        <motion.h1
          style={{
            ...condensed,
            position: 'absolute',
            top: '6%',
            fontSize: 'clamp(48px, 16vw, 280px)',
            color: 'transparent',
            WebkitTextStroke: `1px ${C.border}`,
            opacity: titleOpacity,
            y: titleY,
            zIndex: 0,
            userSelect: 'none',
            lineHeight: 0.85,
            textAlign: 'center',
          }}
        >
          ASSEMBLE
        </motion.h1>

        {/* The shoe SVG */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <svg
            width="min(78vw, 620px)"
            viewBox="0 0 600 360"
            fill="none"
            aria-label="AirForge sneaker exploded assembly animation"
            role="img"
          >
            <defs>
              <linearGradient id="af-upper" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#2b2f38" />
                <stop offset="100%" stopColor="#15181d" />
              </linearGradient>
              <linearGradient id="af-sole" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C.neon} />
                <stop offset="100%" stopColor={C.neonDim} />
              </linearGradient>
              <linearGradient id="af-mid" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f4f6f8" />
                <stop offset="100%" stopColor="#c4c8d0" />
              </linearGradient>
              <filter id="af-shadow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow
                  dx="0"
                  dy="8"
                  stdDeviation="14"
                  floodColor="#000"
                  floodOpacity="0.55"
                />
              </filter>
            </defs>

            <g filter="url(#af-shadow)" transform="translate(70 30)">
              {/* SOLE — comes from bottom */}
              <ShoePart
                scroll={scrollYProgress}
                fromX={0}
                fromY={260}
                fromRot={-8}
                delayBand={[0, 0.7]}
              >
                <path
                  d="M10 250 Q20 290 70 292 L400 292 Q455 290 460 258 L455 248 L60 248 Q22 244 10 250 Z"
                  fill="url(#af-sole)"
                />
                {/* tread lines */}
                {[80, 140, 200, 260, 320, 380].map((tx) => (
                  <rect
                    key={tx}
                    x={tx}
                    y={272}
                    width="8"
                    height="16"
                    rx="2"
                    fill="#1a1d12"
                    opacity="0.55"
                  />
                ))}
              </ShoePart>

              {/* MIDSOLE — comes from left */}
              <ShoePart
                scroll={scrollYProgress}
                fromX={-360}
                fromY={20}
                fromRot={6}
                delayBand={[0.05, 0.78]}
              >
                <path
                  d="M14 246 Q14 222 55 220 L450 220 Q462 234 458 252 L60 252 Q18 254 14 246 Z"
                  fill="url(#af-mid)"
                />
                <path
                  d="M14 246 Q14 222 55 220 L450 220"
                  stroke="#9ca0a8"
                  strokeWidth="1.5"
                  fill="none"
                  opacity="0.6"
                />
              </ShoePart>

              {/* UPPER (body) — comes from right */}
              <ShoePart
                scroll={scrollYProgress}
                fromX={420}
                fromY={-30}
                fromRot={10}
                delayBand={[0.12, 0.88]}
              >
                <path
                  d="M60 222 Q56 150 130 132 Q190 118 240 120 Q300 122 360 150 Q430 178 450 222 Z"
                  fill="url(#af-upper)"
                  stroke={C.borderLight}
                  strokeWidth="1.5"
                />
                {/* heel */}
                <path
                  d="M388 150 Q446 168 450 222 L416 222 Q410 178 372 162 Z"
                  fill="#0f1115"
                />
                {/* swoosh-style accent panel */}
                <path
                  d="M150 200 Q230 150 360 180 Q300 168 240 175 Q190 184 158 208 Z"
                  fill={C.neon}
                  opacity="0.9"
                />
                {/* toe cap stitch */}
                <path
                  d="M64 216 Q70 168 120 150"
                  stroke={C.textFaint}
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  fill="none"
                />
              </ShoePart>

              {/* TONGUE — comes from top */}
              <ShoePart
                scroll={scrollYProgress}
                fromX={-40}
                fromY={-300}
                fromRot={-12}
                delayBand={[0.2, 0.92]}
              >
                <path
                  d="M188 132 Q186 96 206 92 L268 92 Q286 98 282 134 Q236 122 188 132 Z"
                  fill="#2e333d"
                  stroke={C.borderLight}
                  strokeWidth="1.5"
                />
                <rect x="220" y="100" width="32" height="9" rx="4" fill={C.neon} />
                <text
                  x="236"
                  y="108"
                  fontSize="7"
                  fill="#0f1115"
                  textAnchor="middle"
                  fontWeight="900"
                  fontFamily={C.fontDisplay}
                >
                  AF
                </text>
              </ShoePart>

              {/* LACES — come from top-right, last to assemble */}
              <ShoePart
                scroll={scrollYProgress}
                fromX={300}
                fromY={-260}
                fromRot={20}
                delayBand={[0.3, 1]}
              >
                {[0, 1, 2, 3].map((i) => {
                  const ly = 150 + i * 18;
                  return (
                    <g key={i}>
                      <line
                        x1={158}
                        y1={ly}
                        x2={296}
                        y2={ly - 4}
                        stroke={C.white}
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                      <circle cx={158} cy={ly} r="3" fill={C.neon} />
                      <circle cx={296} cy={ly - 4} r="3" fill={C.neon} />
                    </g>
                  );
                })}
                {/* crossing lace */}
                <line
                  x1={170}
                  y1={148}
                  x2={285}
                  y2={216}
                  stroke={C.white}
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity="0.85"
                />
                <line
                  x1={285}
                  y1={148}
                  x2={170}
                  y2={216}
                  stroke={C.white}
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity="0.85"
                />
              </ShoePart>
            </g>
          </svg>

          {/* "Fully assembled" floating badge */}
          <motion.div
            style={{
              position: 'absolute',
              right: '-2%',
              bottom: '8%',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 16px',
              borderRadius: 999,
              background: C.neon,
              color: '#0f1115',
              fontWeight: 800,
              fontSize: 13,
              opacity: assembledLabelOpacity,
              boxShadow: `0 0 30px ${C.neon}66`,
            }}
          >
            <Check size={16} strokeWidth={3} /> AirForge X-1 — Built
          </motion.div>
        </div>

        {/* Headline text */}
        <motion.div
          style={{
            position: 'absolute',
            bottom: '7%',
            textAlign: 'center',
            zIndex: 3,
            opacity: titleOpacity,
          }}
        >
          <p
            style={{
              ...condensed,
              fontSize: 'clamp(28px, 5vw, 64px)',
              lineHeight: 0.95,
              margin: 0,
            }}
          >
            Engineered{' '}
            <span style={{ color: C.neon }}>To Move.</span>
          </p>
          <p style={{ color: C.textMuted, marginTop: 10, fontSize: 14 }}>
            Scroll to assemble the AirForge X-1 — every part, in motion.
          </p>
        </motion.div>

        {/* Scroll progress bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: 4,
            background: C.border,
          }}
        >
          <motion.div
            style={{ height: '100%', background: C.neon, width: progressWidth }}
          />
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   2. NAVIGATION
   ════════════════════════════════════════════════════════════════════════════ */

function Nav() {
  const [open, setOpen] = useState(false);
  const links = ['Drops', 'Colorways', 'Tech', 'Reviews'];
  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        ...sectionPad,
        height: 72,
        background: 'rgba(8,9,11,0.72)',
        backdropFilter: 'blur(14px)',
        borderBottom: `1px solid ${C.border}`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            background: C.neon,
            display: 'grid',
            placeItems: 'center',
            color: '#0f1115',
          }}
        >
          <Zap size={18} strokeWidth={3} />
        </div>
        <span style={{ ...condensed, fontSize: 20 }}>AirForge</span>
      </div>

      <nav
        style={{
          display: 'flex',
          gap: 28,
          fontSize: 14,
          fontWeight: 600,
          letterSpacing: '0.02em',
        }}
        className="af-desktop-nav"
      >
        {links.map((l) => (
          <a
            key={l}
            href={`#${l.toLowerCase()}`}
            style={{ color: C.textMuted, textDecoration: 'none' }}
          >
            {l}
          </a>
        ))}
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <button
          aria-label="Cart"
          onClick={() => setOpen((v) => !v)}
          style={{
            position: 'relative',
            background: 'transparent',
            border: 'none',
            color: C.white,
            cursor: 'pointer',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <ShoppingBag size={20} />
          <span
            style={{
              position: 'absolute',
              top: -6,
              right: -8,
              background: C.neon,
              color: '#0f1115',
              fontSize: 10,
              fontWeight: 800,
              borderRadius: 999,
              minWidth: 16,
              height: 16,
              display: 'grid',
              placeItems: 'center',
              padding: '0 4px',
            }}
          >
            2
          </span>
        </button>
        <a
          href="#drops"
          style={{
            ...condensed,
            fontSize: 13,
            background: C.neon,
            color: '#0f1115',
            padding: '10px 18px',
            borderRadius: 8,
            textDecoration: 'none',
          }}
        >
          Shop Now
        </a>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              position: 'absolute',
              top: 72,
              right: 'clamp(20px, 6vw, 120px)',
              width: 280,
              background: C.bgCard,
              border: `1px solid ${C.border}`,
              borderRadius: 14,
              padding: 18,
            }}
          >
            <p style={{ ...condensed, fontSize: 13, marginTop: 0 }}>Your Cart (2)</p>
            {['AirForge X-1 — Volt', 'AirForge Pro — Onyx'].map((it) => (
              <div
                key={it}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  fontSize: 13,
                  color: C.textMuted,
                  borderTop: `1px solid ${C.border}`,
                }}
              >
                <span>{it}</span>
                <span style={{ color: C.white }}>€189</span>
              </div>
            ))}
            <a
              href="#cta"
              style={{
                display: 'block',
                textAlign: 'center',
                marginTop: 12,
                background: C.neon,
                color: '#0f1115',
                padding: '10px',
                borderRadius: 8,
                textDecoration: 'none',
                fontWeight: 800,
                fontSize: 13,
              }}
            >
              Checkout · €378
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   3. MARQUEE STRIP
   ════════════════════════════════════════════════════════════════════════════ */

function Marquee() {
  const items = [
    'FREE 48H DELIVERY',
    'CARBON-NEUTRAL SHIPPING',
    '30-DAY RETURNS',
    'LIMITED DROPS WEEKLY',
    'HANDCRAFTED IN PORTUGAL',
  ];
  return (
    <div
      style={{
        background: C.neon,
        color: '#0f1115',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        borderBlock: `1px solid ${C.neonDim}`,
      }}
    >
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 22, ease: 'linear', repeat: Infinity }}
        style={{ display: 'inline-flex', gap: 0 }}
      >
        {[...items, ...items, ...items, ...items].map((it, i) => (
          <span
            key={i}
            style={{
              ...condensed,
              fontSize: 14,
              padding: '12px 28px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 28,
            }}
          >
            {it}
            <Zap size={13} strokeWidth={3} />
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   4. FEATURED DROPS
   ════════════════════════════════════════════════════════════════════════════ */

interface Drop {
  name: string;
  tag: string;
  price: string;
  hue1: string;
  hue2: string;
  soldPct: number;
}

const DROPS: Drop[] = [
  { name: 'X-1 Volt', tag: 'NEW DROP', price: '€189', hue1: '#e3ff34', hue2: '#1b1f26', soldPct: 78 },
  { name: 'Pro Onyx', tag: 'BESTSELLER', price: '€219', hue1: '#5a6172', hue2: '#0e1013', soldPct: 92 },
  { name: 'Flux Coral', tag: 'LIMITED', price: '€199', hue1: '#ff6f61', hue2: '#1b1014', soldPct: 41 },
];

function FeaturedDrops() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <section id="drops" style={{ ...sectionPad, paddingBlock: 100 }} ref={ref}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: 16,
          marginBottom: 44,
        }}
      >
        <h2 style={{ ...condensed, fontSize: 'clamp(32px, 5vw, 64px)', margin: 0, lineHeight: 0.9 }}>
          This Week&apos;s
          <br />
          <span style={{ color: C.neon }}>Featured Drops</span>
        </h2>
        <a
          href="#colorways"
          style={{
            color: C.textMuted,
            fontSize: 14,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            textDecoration: 'none',
          }}
        >
          View all releases <ArrowRight size={15} />
        </a>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 24,
        }}
      >
        {DROPS.map((d, i) => (
          <motion.article
            key={d.name}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -8 }}
            style={{
              background: C.bgCard,
              border: `1px solid ${C.border}`,
              borderRadius: 20,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: 240,
                background: `radial-gradient(circle at 50% 40%, ${d.hue1}33, ${d.hue2})`,
                position: 'relative',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  top: 14,
                  left: 14,
                  ...condensed,
                  fontSize: 11,
                  background: C.neon,
                  color: '#0f1115',
                  padding: '4px 10px',
                  borderRadius: 6,
                }}
              >
                {d.tag}
              </span>
              {/* mini shoe glyph */}
              <svg width="160" height="90" viewBox="0 0 160 90">
                <path
                  d="M8 64 Q6 40 44 36 Q80 30 110 44 Q140 56 150 66 Q152 78 130 78 L24 78 Q8 76 8 64 Z"
                  fill={d.hue1}
                  opacity="0.92"
                />
                <path d="M8 70 L150 70 Q150 80 130 80 L24 80 Q8 80 8 70 Z" fill="#0f1115" />
                <path d="M40 50 Q80 36 120 52" stroke="#0f1115" strokeWidth="3" fill="none" />
              </svg>
            </div>
            <div style={{ padding: 22 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h3 style={{ ...condensed, fontSize: 22, margin: 0 }}>{d.name}</h3>
                <span style={{ ...condensed, fontSize: 20, color: C.neon }}>{d.price}</span>
              </div>
              {/* sold bar */}
              <div style={{ marginTop: 16 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: 11,
                    color: C.textMuted,
                    marginBottom: 6,
                  }}
                >
                  <span>{d.soldPct}% claimed</span>
                  <span>Limited run</span>
                </div>
                <div style={{ height: 6, background: C.border, borderRadius: 999 }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={inView ? { width: `${d.soldPct}%` } : {}}
                    transition={{ delay: 0.3 + i * 0.12, duration: 0.9 }}
                    style={{ height: '100%', background: C.neon, borderRadius: 999 }}
                  />
                </div>
              </div>
              <button
                style={{
                  marginTop: 18,
                  width: '100%',
                  background: C.bgCardHover,
                  border: `1px solid ${C.borderLight}`,
                  color: C.white,
                  padding: '11px',
                  borderRadius: 10,
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <Plus size={15} /> Add to bag
              </button>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   5. COLORWAYS GRID — hover flip cards
   ════════════════════════════════════════════════════════════════════════════ */

interface Colorway {
  name: string;
  front: string;
  back: string;
  desc: string;
}

const COLORWAYS: Colorway[] = [
  { name: 'Volt Strike', front: '#e3ff34', back: '#1b1f26', desc: 'Hi-vis upper, carbon sole.' },
  { name: 'Onyx Mono', front: '#3a3f4a', back: '#0e1013', desc: 'Triple-black stealth build.' },
  { name: 'Coral Flux', front: '#ff6f61', back: '#2a1714', desc: 'Coral knit, ivory midsole.' },
  { name: 'Glacier', front: '#9fd8e0', back: '#10222a', desc: 'Ice-blue translucent shell.' },
  { name: 'Ember', front: '#ff9d3c', back: '#241204', desc: 'Sunset gradient woven mesh.' },
  { name: 'Lunar', front: '#c9c4ff', back: '#16142a', desc: 'Reflective lilac 3M panels.' },
];

function FlipCard({ cw, index }: { cw: Colorway; index: number }) {
  const [flip, setFlip] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay: index * 0.06, duration: 0.5 }}
      onMouseEnter={() => setFlip(true)}
      onMouseLeave={() => setFlip(false)}
      style={{ perspective: 1000, height: 220, cursor: 'pointer' }}
    >
      <motion.div
        animate={{ rotateY: flip ? 180 : 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* front */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            borderRadius: 18,
            background: `linear-gradient(135deg, ${cw.front}, ${cw.back})`,
            display: 'grid',
            placeItems: 'center',
            border: `1px solid ${C.border}`,
          }}
        >
          <svg width="120" height="70" viewBox="0 0 160 90">
            <path
              d="M8 64 Q6 40 44 36 Q80 30 110 44 Q140 56 150 66 Q152 78 130 78 L24 78 Q8 76 8 64 Z"
              fill="#0f1115"
              opacity="0.4"
            />
          </svg>
          <span
            style={{
              position: 'absolute',
              bottom: 14,
              left: 16,
              ...condensed,
              fontSize: 16,
              color: '#0f1115',
            }}
          >
            {cw.name}
          </span>
        </div>
        {/* back */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            borderRadius: 18,
            background: C.bgCard,
            border: `1px solid ${C.borderLight}`,
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <span style={{ ...condensed, fontSize: 16 }}>{cw.name}</span>
            <p style={{ color: C.textMuted, fontSize: 13, marginTop: 8, lineHeight: 1.5 }}>
              {cw.desc}
            </p>
          </div>
          <button
            style={{
              background: C.neon,
              color: '#0f1115',
              border: 'none',
              padding: '9px',
              borderRadius: 8,
              fontWeight: 800,
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            Select colorway
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Colorways() {
  return (
    <section id="colorways" style={{ ...sectionPad, paddingBlock: 90, background: C.bgAlt }}>
      <h2 style={{ ...condensed, fontSize: 'clamp(30px, 4.5vw, 56px)', margin: '0 0 12px' }}>
        Pick Your <span style={{ color: C.neon }}>Colorway</span>
      </h2>
      <p style={{ color: C.textMuted, maxWidth: 520, marginBottom: 44, fontSize: 15 }}>
        Six signature finishes, each engineered with the same X-1 carbon plate.
        Hover to reveal the build spec.
      </p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 18,
        }}
      >
        {COLORWAYS.map((cw, i) => (
          <FlipCard key={cw.name} cw={cw} index={i} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   6. SIZE GUIDE
   ════════════════════════════════════════════════════════════════════════════ */

function SizeGuide() {
  const [selected, setSelected] = useState<number | null>(42);
  const sizes = [38, 39, 40, 41, 42, 43, 44, 45, 46];
  const lowStock = [39, 46];
  return (
    <section id="tech" style={{ ...sectionPad, paddingBlock: 90 }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 50,
          alignItems: 'center',
        }}
      >
        <div>
          <h2 style={{ ...condensed, fontSize: 'clamp(30px, 4.5vw, 54px)', margin: '0 0 18px' }}>
            Find Your
            <br />
            Perfect Fit
          </h2>
          <p style={{ color: C.textMuted, fontSize: 15, lineHeight: 1.6, marginBottom: 28 }}>
            AirForge runs true to size with our adaptive knit collar. If you&apos;re
            between sizes, we recommend sizing down for a locked-in ride.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {sizes.map((s) => {
              const isLow = lowStock.includes(s);
              const active = selected === s;
              return (
                <button
                  key={s}
                  onClick={() => setSelected(s)}
                  style={{
                    width: 58,
                    height: 58,
                    borderRadius: 12,
                    border: `1px solid ${active ? C.neon : C.border}`,
                    background: active ? C.neon : C.bgCard,
                    color: active ? '#0f1115' : C.white,
                    fontWeight: 800,
                    fontSize: 15,
                    cursor: 'pointer',
                    position: 'relative',
                    fontFamily: C.fontDisplay,
                  }}
                >
                  {s}
                  {isLow && (
                    <span
                      style={{
                        position: 'absolute',
                        top: -5,
                        right: -5,
                        width: 12,
                        height: 12,
                        borderRadius: 999,
                        background: C.red,
                        border: `2px solid ${C.bg}`,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
          <p style={{ color: C.textFaint, fontSize: 12, marginTop: 14 }}>
            <span style={{ color: C.red }}>●</span> Low stock — fewer than 10 pairs left.
          </p>
        </div>

        {/* size chart card */}
        <div
          style={{
            background: C.bgCard,
            border: `1px solid ${C.border}`,
            borderRadius: 20,
            padding: 28,
          }}
        >
          <p style={{ ...condensed, fontSize: 16, marginTop: 0 }}>EU → US → CM</p>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ color: C.textMuted, textAlign: 'left' }}>
                <th style={{ padding: '8px 0' }}>EU</th>
                <th>US</th>
                <th>UK</th>
                <th>CM</th>
              </tr>
            </thead>
            <tbody>
              {[
                [40, 7, 6, 25],
                [42, 9, 8, 27],
                [44, 10.5, 9.5, 28.5],
                [46, 12, 11, 30],
              ].map((row) => (
                <tr
                  key={row[0]}
                  style={{
                    borderTop: `1px solid ${C.border}`,
                    color: selected === row[0] ? C.neon : C.white,
                  }}
                >
                  {row.map((cell, ci) => (
                    <td key={ci} style={{ padding: '11px 0' }}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   7. REVIEWS
   ════════════════════════════════════════════════════════════════════════════ */

interface Review {
  name: string;
  role: string;
  body: string;
  rating: number;
}

const REVIEWS: Review[] = [
  { name: 'Marcus Bell', role: 'Marathon runner', rating: 5, body: 'The carbon plate is no joke. Shaved 4 minutes off my half-marathon PB. Best €189 I have spent on running gear.' },
  { name: 'Lena Hofer', role: 'Verified buyer', rating: 5, body: 'Fit is perfect straight out of the box. The knit collar hugs the ankle without any pressure points. Obsessed.' },
  { name: 'Dario Costa', role: 'Sneaker collector', rating: 4, body: 'Build quality rivals shoes twice the price. Only wish the Volt colorway came in more sizes — sold out fast.' },
  { name: 'Amara Singh', role: 'Gym coach', rating: 5, body: 'My clients keep asking what I am wearing. Stable enough for lifting, light enough for sprints. Versatile beast.' },
];

function Reviews() {
  return (
    <section id="reviews" style={{ ...sectionPad, paddingBlock: 90, background: C.bgAlt }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 40, flexWrap: 'wrap' }}>
        <h2 style={{ ...condensed, fontSize: 'clamp(30px, 4.5vw, 54px)', margin: 0 }}>
          4.8 / 5
        </h2>
        <div>
          <div style={{ display: 'flex', gap: 2 }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <Star key={i} size={18} fill={C.neon} color={C.neon} />
            ))}
          </div>
          <p style={{ color: C.textMuted, fontSize: 14, margin: '6px 0 0' }}>
            Based on 3,412 verified reviews
          </p>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 20,
        }}
      >
        {REVIEWS.map((r, i) => (
          <motion.div
            key={r.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            style={{
              background: C.bgCard,
              border: `1px solid ${C.border}`,
              borderRadius: 18,
              padding: 24,
            }}
          >
            <div style={{ display: 'flex', gap: 2, marginBottom: 12 }}>
              {Array.from({ length: 5 }).map((_, s) => (
                <Star
                  key={s}
                  size={14}
                  fill={s < r.rating ? C.neon : 'transparent'}
                  color={s < r.rating ? C.neon : C.borderLight}
                />
              ))}
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: C.white, margin: '0 0 18px' }}>
              &ldquo;{r.body}&rdquo;
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 999,
                  background: `linear-gradient(135deg, ${C.neon}, ${C.neonDim})`,
                  display: 'grid',
                  placeItems: 'center',
                  color: '#0f1115',
                  fontWeight: 800,
                  fontSize: 14,
                }}
              >
                {r.name.charAt(0)}
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 14 }}>{r.name}</p>
                <p style={{ margin: 0, color: C.textMuted, fontSize: 12 }}>{r.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   8. ADD-TO-CART CTA
   ════════════════════════════════════════════════════════════════════════════ */

function FinalCTA() {
  const [qty, setQty] = useState(1);
  return (
    <section id="cta" style={{ ...sectionPad, paddingBlock: 100 }}>
      <div
        style={{
          background: `linear-gradient(135deg, ${C.bgCard}, ${C.bgAlt})`,
          border: `1px solid ${C.borderLight}`,
          borderRadius: 28,
          padding: 'clamp(28px, 5vw, 64px)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 40,
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: '-40%',
            right: '-10%',
            width: 420,
            height: 420,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${C.neon}22, transparent 70%)`,
          }}
        />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <span
            style={{
              ...condensed,
              fontSize: 11,
              color: C.neon,
              border: `1px solid ${C.neon}55`,
              padding: '5px 12px',
              borderRadius: 999,
            }}
          >
            FINAL CALL
          </span>
          <h2 style={{ ...condensed, fontSize: 'clamp(34px, 5vw, 68px)', margin: '18px 0 12px', lineHeight: 0.92 }}>
            Lace Up The
            <br />
            <span style={{ color: C.neon }}>AirForge X-1</span>
          </h2>
          <p style={{ color: C.textMuted, fontSize: 15, maxWidth: 420, lineHeight: 1.6 }}>
            The drop that sold out in 11 minutes is back — for 48 hours only.
            Free express shipping and 30-day returns on every pair.
          </p>
          <div style={{ display: 'flex', gap: 22, marginTop: 26, flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: C.textMuted, fontSize: 13 }}>
              <Truck size={16} color={C.neon} /> 48h delivery
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: C.textMuted, fontSize: 13 }}>
              <ShieldCheck size={16} color={C.neon} /> 2-year warranty
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: C.textMuted, fontSize: 13 }}>
              <Heart size={16} color={C.neon} /> 18k wishlisted
            </span>
          </div>
        </div>

        {/* purchase panel */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            background: C.bg,
            border: `1px solid ${C.border}`,
            borderRadius: 20,
            padding: 28,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ ...condensed, fontSize: 22 }}>X-1 Volt</span>
            <span style={{ ...condensed, fontSize: 30, color: C.neon }}>€189</span>
          </div>
          <p style={{ color: C.textMuted, fontSize: 13, margin: '6px 0 20px' }}>
            <s style={{ color: C.textFaint }}>€229</s> · Save €40 today
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              border: `1px solid ${C.border}`,
              borderRadius: 12,
              padding: '6px 14px',
              marginBottom: 16,
            }}
          >
            <span style={{ fontSize: 14, color: C.textMuted }}>Quantity</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <button
                aria-label="Decrease quantity"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                style={qtyBtn}
              >
                <Minus size={14} />
              </button>
              <span style={{ fontWeight: 800, minWidth: 20, textAlign: 'center' }}>{qty}</span>
              <button
                aria-label="Increase quantity"
                onClick={() => setQty((q) => Math.min(5, q + 1))}
                style={qtyBtn}
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            style={{
              width: '100%',
              background: C.neon,
              color: '#0f1115',
              border: 'none',
              padding: '15px',
              borderRadius: 12,
              ...condensed,
              fontSize: 15,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
            }}
          >
            <ShoppingBag size={18} /> Add {qty} to bag · €{189 * qty}
          </motion.button>
          <p style={{ textAlign: 'center', color: C.textFaint, fontSize: 12, marginTop: 12 }}>
            Or 3× €{Math.round((189 * qty) / 3)} interest-free
          </p>
        </div>
      </div>
    </section>
  );
}

const qtyBtn: React.CSSProperties = {
  width: 30,
  height: 30,
  borderRadius: 8,
  border: `1px solid ${C.borderLight}`,
  background: C.bgCard,
  color: C.white,
  display: 'grid',
  placeItems: 'center',
  cursor: 'pointer',
};

/* ════════════════════════════════════════════════════════════════════════════
   9. FOOTER
   ════════════════════════════════════════════════════════════════════════════ */

function Footer() {
  const cols: { title: string; links: string[] }[] = [
    { title: 'Shop', links: ['New Drops', 'Colorways', 'Sale', 'Gift Cards'] },
    { title: 'Support', links: ['Size Guide', 'Shipping', 'Returns', 'Contact'] },
    { title: 'Company', links: ['About', 'Sustainability', 'Careers', 'Press'] },
  ];
  return (
    <footer style={{ ...sectionPad, paddingBlock: 60, borderTop: `1px solid ${C.border}` }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 36,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: C.neon,
                display: 'grid',
                placeItems: 'center',
                color: '#0f1115',
              }}
            >
              <Zap size={16} strokeWidth={3} />
            </div>
            <span style={{ ...condensed, fontSize: 18 }}>AirForge</span>
          </div>
          <p style={{ color: C.textMuted, fontSize: 13, maxWidth: 220, lineHeight: 1.6 }}>
            Performance footwear, engineered in Portugal. Built to move.
          </p>
        </div>
        {cols.map((col) => (
          <div key={col.title}>
            <p style={{ ...condensed, fontSize: 13, marginBottom: 14 }}>{col.title}</p>
            {col.links.map((l) => (
              <a
                key={l}
                href="#"
                style={{
                  display: 'block',
                  color: C.textMuted,
                  fontSize: 13,
                  textDecoration: 'none',
                  padding: '5px 0',
                }}
              >
                {l}
              </a>
            ))}
          </div>
        ))}
      </div>
      <div
        style={{
          marginTop: 44,
          paddingTop: 20,
          borderTop: `1px solid ${C.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          color: C.textFaint,
          fontSize: 12,
        }}
      >
        <span>© 2026 AirForge. All rights reserved.</span>
        <span>Privacy · Terms · Cookies</span>
      </div>
    </footer>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════════════════════════════════════ */

export default function Impact217Page() {
  return (
    <main style={pageStyle}>
      <style>{`
        @media (max-width: 760px) { .af-desktop-nav { display: none !important; } }
        html { scroll-behavior: smooth; }
      `}</style>
      <Nav />
      <ScrollHero />
      <Marquee />
      <FeaturedDrops />
      <Colorways />
      <SizeGuide />
      <Reviews />
      <FinalCTA />
      <Footer />
    </main>
  );
}
