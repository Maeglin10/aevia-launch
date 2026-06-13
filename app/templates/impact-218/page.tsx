'use client';

import React, { useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
} from 'framer-motion';
import {
  Grape,
  Wine,
  MapPin,
  Award,
  ArrowRight,
  Leaf,
  Quote,
} from 'lucide-react';

/* ════════════════════════════════════════════════════════════════════════════
   Domaine Miroir — French Wine Estate E-commerce
   Scroll sequence: vine grows → zoom to bottle → wine pours into glass
   ════════════════════════════════════════════════════════════════════════════ */

const C = {
  burgundy: '#4a0e1f',
  burgundyDeep: '#2e0813',
  burgundyMid: '#6e1a30',
  wine: '#7a1228',
  wineLight: '#9c2842',
  cream: '#f4ecdd',
  creamDim: '#e3d6bf',
  parchment: '#faf5ea',
  gold: '#c9a24b',
  goldLight: '#e0c479',
  ink: '#2a1118',
  inkSoft: '#5c3a44',
  leaf: '#5a6b3b',
  leafDeep: '#3c4926',
  fontSerif: "'Cormorant Garamond', 'Georgia', serif",
  fontSans: "'Inter', system-ui, sans-serif",
} as const;

const pageStyle: React.CSSProperties = {
  background: C.parchment,
  color: C.ink,
  fontFamily: C.fontSerif,
  overflowX: 'hidden',
  WebkitFontSmoothing: 'antialiased',
};

const sectionPad: React.CSSProperties = {
  paddingInline: 'clamp(20px, 7vw, 140px)',
};

const serifHead: React.CSSProperties = {
  fontFamily: C.fontSerif,
  fontWeight: 500,
  letterSpacing: '0.01em',
  lineHeight: 1.04,
};

const overline: React.CSSProperties = {
  fontFamily: C.fontSans,
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: '0.28em',
  textTransform: 'uppercase',
};

/* ════════════════════════════════════════════════════════════════════════════
   1. SCROLL HERO — vine → bottle → glass
   ════════════════════════════════════════════════════════════════════════════ */

function ScrollHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  /* ── Phase 1 (0 → 0.3): vine grows across screen ── */
  const vineLength = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const vineOpacity = useTransform(scrollYProgress, [0, 0.05, 0.32, 0.42], [0, 1, 1, 0]);
  const leavesOpacity = useTransform(scrollYProgress, [0.1, 0.25, 0.34, 0.42], [0, 1, 1, 0]);

  /* ── Phase 2 (0.3 → 0.6): zoom into bottle ── */
  const bottleScale = useTransform(scrollYProgress, [0.3, 0.6], [0.3, 1]);
  const bottleOpacity = useTransform(scrollYProgress, [0.3, 0.4, 0.62, 0.72], [0, 1, 1, 0]);
  const bottleY = useTransform(scrollYProgress, [0.3, 0.6], [80, 0]);
  const bottleRotate = useTransform(scrollYProgress, [0.6, 0.78], [0, 18]);

  /* ── Phase 3 (0.6 → 1.0): pour into glass ── */
  const glassOpacity = useTransform(scrollYProgress, [0.62, 0.72], [0, 1]);
  const glassScale = useTransform(scrollYProgress, [0.62, 0.78], [0.7, 1]);
  // wine fill level: 0 (empty) → full
  const fillHeight = useTransform(scrollYProgress, [0.74, 0.98], [0, 78]);
  const fillY = useTransform(scrollYProgress, [0.74, 0.98], [178, 100]);
  const streamOpacity = useTransform(scrollYProgress, [0.7, 0.76, 0.92, 0.98], [0, 1, 1, 0]);
  const finalTextOpacity = useTransform(scrollYProgress, [0.9, 1], [0, 1]);

  /* ── Scene background hue shifts through phases ── */
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  /* ── Phase labels ── */
  const label1 = useTransform(scrollYProgress, [0, 0.08, 0.28, 0.34], [0, 1, 1, 0]);
  const label2 = useTransform(scrollYProgress, [0.34, 0.42, 0.58, 0.64], [0, 1, 1, 0]);
  const label3 = useTransform(scrollYProgress, [0.64, 0.72, 1, 1], [0, 1, 1, 1]);

  return (
    <section
      ref={containerRef}
      style={{ height: '360vh', position: 'relative', background: C.burgundyDeep }}
    >
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
          display: 'grid',
          placeItems: 'center',
          background: `radial-gradient(circle at 50% 30%, ${C.burgundy} 0%, ${C.burgundyDeep} 70%)`,
        }}
      >
        {/* Soft grain / vignette */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at 50% 50%, transparent 40%, rgba(0,0,0,0.45) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Estate name top */}
        <div style={{ position: 'absolute', top: '7%', textAlign: 'center', zIndex: 5 }}>
          <p style={{ ...overline, color: C.gold, margin: 0 }}>Estd. 1847 · Bourgogne, France</p>
          <h1
            style={{
              ...serifHead,
              color: C.cream,
              fontSize: 'clamp(34px, 6vw, 76px)',
              margin: '8px 0 0',
              fontStyle: 'italic',
            }}
          >
            Domaine Miroir
          </h1>
        </div>

        {/* ── The animated SVG scene ── */}
        <div style={{ position: 'relative', width: 'min(90vw, 720px)', height: '64vh' }}>
          <svg
            viewBox="0 0 600 460"
            width="100%"
            height="100%"
            fill="none"
            aria-label="Animated wine sequence: vine growing, bottle, and pouring glass"
            role="img"
            style={{ position: 'absolute', inset: 0 }}
          >
            <defs>
              <linearGradient id="dm-vine" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={C.leafDeep} />
                <stop offset="100%" stopColor={C.leaf} />
              </linearGradient>
              <linearGradient id="dm-bottle" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1a3320" />
                <stop offset="50%" stopColor="#28492f" />
                <stop offset="100%" stopColor="#10241a" />
              </linearGradient>
              <linearGradient id="dm-wine" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C.wineLight} />
                <stop offset="100%" stopColor={C.wine} />
              </linearGradient>
              <radialGradient id="dm-glow" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0%" stopColor={C.goldLight} stopOpacity="0.5" />
                <stop offset="100%" stopColor={C.goldLight} stopOpacity="0" />
              </radialGradient>
              <clipPath id="dm-glass-clip">
                <path d="M236 100 Q236 178 300 196 Q364 178 364 100 Z" />
              </clipPath>
            </defs>

            {/* ───── PHASE 1: VINE ───── */}
            <motion.g style={{ opacity: vineOpacity }}>
              <motion.path
                d="M40 420 C 120 380, 110 300, 180 280 C 260 256, 250 180, 330 168 C 410 156, 430 90, 540 70"
                stroke="url(#dm-vine)"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
                style={{ pathLength: vineLength }}
              />
              {/* tendrils */}
              <motion.path
                d="M180 280 q -30 -28 -10 -54"
                stroke={C.leaf}
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                style={{ pathLength: vineLength }}
              />
              <motion.path
                d="M330 168 q 34 -24 22 -56"
                stroke={C.leaf}
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                style={{ pathLength: vineLength }}
              />
            </motion.g>

            {/* grape clusters + leaves */}
            <motion.g style={{ opacity: leavesOpacity }}>
              {[
                { x: 180, y: 268 },
                { x: 330, y: 156 },
                { x: 470, y: 96 },
              ].map((g, gi) => (
                <g key={gi}>
                  {/* leaf */}
                  <path
                    d={`M${g.x - 22} ${g.y - 4} q -18 -16 -2 -30 q 16 6 14 28 q -6 6 -12 2 Z`}
                    fill={C.leaf}
                    opacity="0.9"
                  />
                  {/* grape cluster */}
                  {[
                    [0, 8],
                    [-7, 16],
                    [7, 16],
                    [-3, 24],
                    [4, 24],
                    [0, 32],
                  ].map(([dx, dy], bi) => (
                    <circle
                      key={bi}
                      cx={g.x + dx}
                      cy={g.y + dy}
                      r="6"
                      fill={C.wine}
                      stroke={C.wineLight}
                      strokeWidth="0.5"
                    />
                  ))}
                </g>
              ))}
            </motion.g>

            {/* ───── PHASE 2: BOTTLE ───── */}
            <motion.g
              style={{
                opacity: bottleOpacity,
                scale: bottleScale,
                y: bottleY,
                rotate: bottleRotate,
                transformOrigin: '300px 360px',
              }}
            >
              <ellipse cx="300" cy="120" rx="120" ry="120" fill="url(#dm-glow)" />
              {/* bottle body */}
              <path
                d="M280 70 L280 150 Q260 170 260 210 L260 400 Q260 420 280 420 L320 420 Q340 420 340 400 L340 210 Q340 170 320 150 L320 70 Z"
                fill="url(#dm-bottle)"
                stroke="#0c1c12"
                strokeWidth="1.5"
              />
              {/* neck highlight */}
              <rect x="286" y="74" width="5" height="120" rx="2.5" fill="#3e6b48" opacity="0.55" />
              {/* cork */}
              <rect x="282" y="50" width="36" height="24" rx="3" fill="#9c6b3f" />
              {/* foil */}
              <rect x="280" y="60" width="40" height="20" rx="2" fill={C.gold} opacity="0.92" />
              {/* label */}
              <rect x="262" y="250" width="76" height="120" rx="4" fill={C.parchment} />
              <rect x="262" y="250" width="76" height="120" rx="4" fill="none" stroke={C.gold} strokeWidth="1" />
              <text
                x="300"
                y="284"
                textAnchor="middle"
                fontFamily={C.fontSerif}
                fontStyle="italic"
                fontSize="15"
                fill={C.burgundy}
              >
                Miroir
              </text>
              <line x1="276" y1="294" x2="324" y2="294" stroke={C.gold} strokeWidth="0.8" />
              <text x="300" y="316" textAnchor="middle" fontFamily={C.fontSans} fontSize="8" fill={C.inkSoft}>
                GRAND CRU
              </text>
              <text x="300" y="350" textAnchor="middle" fontFamily={C.fontSerif} fontSize="20" fill={C.burgundy}>
                2018
              </text>
            </motion.g>

            {/* ───── PHASE 3: GLASS + POUR ───── */}
            <motion.g
              style={{
                opacity: glassOpacity,
                scale: glassScale,
                transformOrigin: '300px 300px',
              }}
            >
              {/* wine fill (clipped to bowl) */}
              <g clipPath="url(#dm-glass-clip)">
                <motion.rect
                  x="230"
                  width="140"
                  fill="url(#dm-wine)"
                  style={{ y: fillY, height: fillHeight }}
                />
                {/* surface ellipse shimmer */}
                <motion.ellipse cx="300" rx="62" ry="6" fill={C.wineLight} style={{ cy: fillY }} />
              </g>
              {/* glass bowl outline */}
              <path
                d="M236 100 Q236 178 300 196 Q364 178 364 100 Z"
                fill="rgba(255,255,255,0.04)"
                stroke="rgba(244,236,221,0.7)"
                strokeWidth="2"
              />
              {/* stem */}
              <rect x="297" y="196" width="6" height="120" fill="rgba(244,236,221,0.5)" />
              {/* base */}
              <ellipse cx="300" cy="320" rx="54" ry="10" fill="rgba(244,236,221,0.5)" />
              <ellipse cx="300" cy="318" rx="54" ry="10" fill="none" stroke="rgba(244,236,221,0.8)" strokeWidth="1.5" />
              {/* rim highlight */}
              <path
                d="M236 100 Q236 96 300 96 Q364 96 364 100"
                stroke={C.cream}
                strokeWidth="2"
                fill="none"
                opacity="0.85"
              />
            </motion.g>

            {/* pour stream */}
            <motion.path
              d="M300 56 C 304 90, 300 120, 300 100"
              stroke="url(#dm-wine)"
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
              style={{ opacity: streamOpacity }}
            />
            <motion.circle cx="300" cy="100" r="5" fill={C.wine} style={{ opacity: streamOpacity }} />
          </svg>

          {/* Floating phase labels */}
          <motion.p style={phaseLabel(C)}>
            <motion.span style={{ opacity: label1, position: 'absolute', inset: 0 }}>
              From a single vine in our south-facing parcel…
            </motion.span>
            <motion.span style={{ opacity: label2, position: 'absolute', inset: 0 }}>
              …pressed, aged 18 months in French oak…
            </motion.span>
            <motion.span style={{ opacity: label3, position: 'absolute', inset: 0 }}>
              …to the glass in your hand. Santé.
            </motion.span>
          </motion.p>
        </div>

        {/* Final scroll cue / CTA */}
        <motion.div
          style={{
            position: 'absolute',
            bottom: '8%',
            textAlign: 'center',
            opacity: finalTextOpacity,
            zIndex: 5,
          }}
        >
          <a
            href="#vintages"
            style={{
              ...overline,
              color: C.burgundyDeep,
              background: C.gold,
              padding: '14px 30px',
              borderRadius: 2,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            Explore the Vintages <ArrowRight size={15} />
          </a>
        </motion.div>

        {/* scroll progress */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 3, background: 'rgba(244,236,221,0.15)' }}>
          <motion.div style={{ height: '100%', background: C.gold, width: progressWidth }} />
        </div>
      </div>
    </section>
  );
}

function phaseLabel(c: typeof C): React.CSSProperties {
  return {
    position: 'absolute',
    bottom: -56,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 'min(90vw, 540px)',
    height: 40,
    textAlign: 'center',
    fontStyle: 'italic',
    fontSize: 'clamp(16px, 2.4vw, 24px)',
    color: c.cream,
  };
}

/* ════════════════════════════════════════════════════════════════════════════
   2. NAV
   ════════════════════════════════════════════════════════════════════════════ */

function Nav() {
  const links = ['Terroir', 'Vintages', 'Cellar', 'Pairings'];
  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 50,
        ...sectionPad,
        height: 76,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(46,8,19,0.55)',
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${C.gold}33`,
      }}
    >
      <span style={{ ...serifHead, fontStyle: 'italic', fontSize: 24, color: C.cream }}>
        Domaine&nbsp;Miroir
      </span>
      <nav className="dm-nav" style={{ display: 'flex', gap: 32 }}>
        {links.map((l) => (
          <a
            key={l}
            href={`#${l.toLowerCase()}`}
            style={{
              ...overline,
              color: C.creamDim,
              textDecoration: 'none',
              fontSize: 11,
            }}
          >
            {l}
          </a>
        ))}
      </nav>
      <a
        href="#order"
        style={{
          ...overline,
          fontSize: 11,
          color: C.burgundyDeep,
          background: C.gold,
          padding: '11px 22px',
          textDecoration: 'none',
        }}
      >
        Order Wine
      </a>
    </header>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   3. TERROIR
   ════════════════════════════════════════════════════════════════════════════ */

function Terroir() {
  const stats: { value: string; label: string }[] = [
    { value: '32', label: 'Hectares of vineyard' },
    { value: '177', label: 'Years of family craft' },
    { value: '18', label: 'Months in oak' },
    { value: '4', label: 'Grand Cru parcels' },
  ];
  return (
    <section id="terroir" style={{ ...sectionPad, paddingBlock: 110, background: C.parchment }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 64,
          alignItems: 'center',
        }}
      >
        <div>
          <p style={{ ...overline, color: C.wine }}>
            <MapPin size={12} style={{ display: 'inline', marginRight: 6 }} />
            Côte de Nuits, Bourgogne
          </p>
          <h2 style={{ ...serifHead, fontSize: 'clamp(36px, 5vw, 66px)', margin: '14px 0 24px' }}>
            A terroir shaped by limestone, mist &amp; time.
          </h2>
          <p style={{ fontFamily: C.fontSans, fontSize: 16, lineHeight: 1.8, color: C.inkSoft, maxWidth: 520 }}>
            Our vines root deep into Jurassic limestone, drawing minerality that
            defines every bottle. Hand-harvested at dawn, fermented with native
            yeasts, and rested in barrels coopered from our own forest oak. Nothing
            rushed. Everything intentional.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 28,
              marginTop: 44,
              maxWidth: 460,
            }}
          >
            {stats.map((s) => (
              <div key={s.label}>
                <p style={{ ...serifHead, fontSize: 52, color: C.wine, margin: 0 }}>{s.value}</p>
                <p style={{ fontFamily: C.fontSans, fontSize: 13, color: C.inkSoft, margin: '4px 0 0' }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* decorative terroir illustration */}
        <div
          style={{
            aspectRatio: '4/5',
            borderRadius: 4,
            background: `linear-gradient(160deg, ${C.burgundy}, ${C.burgundyDeep})`,
            position: 'relative',
            overflow: 'hidden',
            border: `1px solid ${C.gold}44`,
          }}
        >
          <svg viewBox="0 0 400 500" width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
            {/* rolling hill rows of vines */}
            {Array.from({ length: 7 }).map((_, r) => {
              const y = 120 + r * 50;
              return (
                <path
                  key={r}
                  d={`M-20 ${y} Q200 ${y - 40} 420 ${y}`}
                  stroke={C.leaf}
                  strokeWidth="2"
                  fill="none"
                  opacity={0.3 + r * 0.08}
                />
              );
            })}
            {/* sun */}
            <circle cx="300" cy="90" r="44" fill="url(#none)" stroke={C.gold} strokeWidth="1.5" opacity="0.7" />
            <circle cx="300" cy="90" r="30" fill={C.goldLight} opacity="0.25" />
          </svg>
          <div style={{ position: 'absolute', bottom: 22, left: 22, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Leaf size={16} color={C.gold} />
            <span style={{ ...overline, fontSize: 10, color: C.cream }}>Certified Organic · Biodynamic</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   4. VINTAGE SELECTION
   ════════════════════════════════════════════════════════════════════════════ */

interface Vintage {
  name: string;
  year: string;
  notes: string;
  price: string;
  score: string;
}

const VINTAGES: Vintage[] = [
  { name: 'Pinot Noir Réserve', year: '2018', notes: 'Cherry, violet, forest floor', price: '€78', score: '95' },
  { name: 'Chardonnay Grand Cru', year: '2019', notes: 'Hazelnut, white peach, flint', price: '€92', score: '94' },
  { name: 'Cuvée du Miroir', year: '2016', notes: 'Blackberry, leather, truffle', price: '€145', score: '98' },
  { name: 'Rosé de Saignée', year: '2021', notes: 'Wild strawberry, citrus zest', price: '€54', score: '91' },
];

function Vintages() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <section id="vintages" style={{ ...sectionPad, paddingBlock: 110, background: C.burgundyDeep, color: C.cream }} ref={ref}>
      <div style={{ textAlign: 'center', marginBottom: 56 }}>
        <p style={{ ...overline, color: C.gold }}>The Cellar Selection</p>
        <h2 style={{ ...serifHead, fontSize: 'clamp(36px, 5vw, 66px)', margin: '10px 0 0' }}>
          Our Finest Vintages
        </h2>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 26,
        }}
      >
        {VINTAGES.map((v, i) => (
          <motion.article
            key={v.name}
            initial={{ opacity: 0, y: 44 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -10 }}
            style={{
              background: `linear-gradient(180deg, ${C.burgundy}, ${C.burgundyDeep})`,
              border: `1px solid ${C.gold}33`,
              borderRadius: 4,
              padding: 28,
              textAlign: 'center',
              position: 'relative',
            }}
          >
            <span
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                ...overline,
                fontSize: 10,
                color: C.burgundyDeep,
                background: C.gold,
                padding: '4px 8px',
                borderRadius: 2,
              }}
            >
              {v.score} pts
            </span>
            {/* mini bottle */}
            <svg width="46" height="130" viewBox="0 0 46 130" style={{ margin: '8px auto 18px', display: 'block' }}>
              <rect x="18" y="2" width="10" height="22" rx="2" fill={C.gold} />
              <path
                d="M16 24 L16 40 Q8 50 8 70 L8 122 Q8 128 16 128 L30 128 Q38 128 38 122 L38 70 Q38 50 30 40 L30 24 Z"
                fill="url(#none)"
                stroke={C.gold}
                strokeWidth="1.2"
                fillOpacity="0"
              />
              <path
                d="M16 24 L16 40 Q8 50 8 70 L8 122 Q8 128 16 128 L30 128 Q38 128 38 122 L38 70 Q38 50 30 40 L30 24 Z"
                fill={C.wine}
                opacity="0.6"
              />
              <rect x="11" y="78" width="24" height="36" rx="2" fill={C.parchment} opacity="0.92" />
            </svg>

            <h3 style={{ ...serifHead, fontSize: 24, margin: 0 }}>{v.name}</h3>
            <p style={{ ...serifHead, fontSize: 18, fontStyle: 'italic', color: C.gold, margin: '4px 0 12px' }}>
              {v.year}
            </p>
            <p style={{ fontFamily: C.fontSans, fontSize: 13, color: C.creamDim, lineHeight: 1.6, minHeight: 38 }}>
              {v.notes}
            </p>
            <div
              style={{
                marginTop: 18,
                paddingTop: 18,
                borderTop: `1px solid ${C.gold}22`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ ...serifHead, fontSize: 26 }}>{v.price}</span>
              <button
                style={{
                  ...overline,
                  fontSize: 10,
                  background: 'transparent',
                  border: `1px solid ${C.gold}`,
                  color: C.gold,
                  padding: '9px 16px',
                  cursor: 'pointer',
                }}
              >
                Add to cellar
              </button>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   5. CELLAR EXPERIENCE
   ════════════════════════════════════════════════════════════════════════════ */

function Cellar() {
  const experiences: { icon: React.ReactNode; title: string; body: string }[] = [
    {
      icon: <Wine size={22} />,
      title: 'Private Tastings',
      body: 'Descend into our 12th-century stone cellar for a guided vertical tasting across four decades of harvests.',
    },
    {
      icon: <Grape size={22} />,
      title: 'Harvest Days',
      body: 'Join the vendange each September — pick, press, and dine at the long table beneath the chestnut trees.',
    },
    {
      icon: <Award size={22} />,
      title: 'Allocation Club',
      body: 'Members receive first access to micro-cuvées, library releases, and barrels reserved before bottling.',
    },
  ];
  return (
    <section id="cellar" style={{ ...sectionPad, paddingBlock: 110, background: C.parchment }}>
      <div style={{ maxWidth: 640, marginBottom: 56 }}>
        <p style={{ ...overline, color: C.wine }}>Visit the Estate</p>
        <h2 style={{ ...serifHead, fontSize: 'clamp(34px, 5vw, 60px)', margin: '12px 0 0' }}>
          The Cellar Experience
        </h2>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 0,
          border: `1px solid ${C.creamDim}`,
        }}
      >
        {experiences.map((e, i) => (
          <motion.div
            key={e.title}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, duration: 0.6 }}
            style={{
              padding: 40,
              borderRight: i < experiences.length - 1 ? `1px solid ${C.creamDim}` : 'none',
              background: C.parchment,
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                border: `1px solid ${C.wine}`,
                color: C.wine,
                marginBottom: 22,
              }}
            >
              {e.icon}
            </div>
            <h3 style={{ ...serifHead, fontSize: 28, margin: '0 0 12px' }}>{e.title}</h3>
            <p style={{ fontFamily: C.fontSans, fontSize: 14, lineHeight: 1.8, color: C.inkSoft, margin: 0 }}>
              {e.body}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   6. FOOD PAIRING
   ════════════════════════════════════════════════════════════════════════════ */

function Pairings() {
  const pairs: { wine: string; dish: string; note: string }[] = [
    { wine: 'Pinot Noir Réserve', dish: 'Coq au vin & wild mushrooms', note: 'Earthy tannins echo the forest notes.' },
    { wine: 'Chardonnay Grand Cru', dish: 'Roasted Bresse chicken, beurre blanc', note: 'Buttery oak meets buttery sauce.' },
    { wine: 'Cuvée du Miroir', dish: 'Aged Comté & black truffle', note: 'Structure to match the cheese’s depth.' },
    { wine: 'Rosé de Saignée', dish: 'Niçoise salad, grilled sardines', note: 'Bright acidity cuts the oil cleanly.' },
  ];
  return (
    <section id="pairings" style={{ ...sectionPad, paddingBlock: 110, background: C.burgundy, color: C.cream }}>
      <div style={{ textAlign: 'center', marginBottom: 50 }}>
        <p style={{ ...overline, color: C.gold }}>À Table</p>
        <h2 style={{ ...serifHead, fontSize: 'clamp(34px, 5vw, 60px)', margin: '10px 0 0' }}>
          The Art of Pairing
        </h2>
      </div>
      <div style={{ maxWidth: 820, margin: '0 auto' }}>
        {pairs.map((p, i) => (
          <motion.div
            key={p.wine}
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto 1.4fr',
              gap: 24,
              alignItems: 'center',
              padding: '26px 0',
              borderBottom: `1px solid ${C.gold}22`,
            }}
          >
            <span style={{ ...serifHead, fontSize: 22, fontStyle: 'italic', color: C.gold }}>{p.wine}</span>
            <span style={{ color: C.gold }}>—</span>
            <div>
              <p style={{ ...serifHead, fontSize: 22, margin: 0 }}>{p.dish}</p>
              <p style={{ fontFamily: C.fontSans, fontSize: 13, color: C.creamDim, margin: '4px 0 0' }}>
                {p.note}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   7. TESTIMONIAL
   ════════════════════════════════════════════════════════════════════════════ */

function Testimonial() {
  return (
    <section style={{ ...sectionPad, paddingBlock: 110, background: C.parchment }}>
      <motion.blockquote
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        style={{ maxWidth: 820, margin: '0 auto', textAlign: 'center' }}
      >
        <Quote size={40} color={C.wine} style={{ opacity: 0.4 }} />
        <p style={{ ...serifHead, fontSize: 'clamp(26px, 3.6vw, 44px)', fontStyle: 'italic', lineHeight: 1.3, margin: '20px 0 28px' }}>
          “The 2016 Cuvée du Miroir is a study in restraint and power — one of the
          most complete Burgundies I have tasted this decade.”
        </p>
        <p style={{ ...overline, color: C.wine }}>Camille Roux · Le Guide des Vins</p>
      </motion.blockquote>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   8. ORDER CTA
   ════════════════════════════════════════════════════════════════════════════ */

function OrderCTA() {
  const [email, setEmail] = useState('');
  return (
    <section id="order" style={{ ...sectionPad, paddingBlock: 120, background: C.burgundyDeep, color: C.cream, textAlign: 'center' }}>
      <p style={{ ...overline, color: C.gold }}>Shipped worldwide · Temperature-controlled</p>
      <h2 style={{ ...serifHead, fontSize: 'clamp(38px, 6vw, 80px)', margin: '14px auto 20px', maxWidth: 820 }}>
        Bring the estate to your table.
      </h2>
      <p style={{ fontFamily: C.fontSans, fontSize: 16, color: C.creamDim, maxWidth: 540, margin: '0 auto 36px', lineHeight: 1.7 }}>
        Order by the bottle or the case. Join the allocation list for first access
        to our rarest cuvées before they ever reach a shelf.
      </p>
      <form
        onSubmit={(e) => e.preventDefault()}
        style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', maxWidth: 480, margin: '0 auto' }}
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          aria-label="Email address"
          style={{
            flex: '1 1 240px',
            background: 'transparent',
            border: `1px solid ${C.gold}66`,
            color: C.cream,
            padding: '15px 18px',
            fontFamily: C.fontSans,
            fontSize: 14,
            borderRadius: 2,
          }}
        />
        <button
          type="submit"
          style={{
            ...overline,
            fontSize: 11,
            background: C.gold,
            color: C.burgundyDeep,
            border: 'none',
            padding: '15px 28px',
            cursor: 'pointer',
            borderRadius: 2,
          }}
        >
          Join the list
        </button>
      </form>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   9. FOOTER
   ════════════════════════════════════════════════════════════════════════════ */

function Footer() {
  const cols: { title: string; links: string[] }[] = [
    { title: 'The Estate', links: ['Our Story', 'Terroir', 'Sustainability', 'Visit'] },
    { title: 'The Wines', links: ['Vintages', 'Allocation Club', 'Gift Sets', 'Pairings'] },
    { title: 'Service', links: ['Shipping', 'Returns', 'Trade Enquiries', 'Contact'] },
  ];
  return (
    <footer style={{ ...sectionPad, paddingBlock: 64, background: C.burgundyDeep, color: C.creamDim, borderTop: `1px solid ${C.gold}22` }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 40 }}>
        <div>
          <span style={{ ...serifHead, fontStyle: 'italic', fontSize: 24, color: C.cream }}>
            Domaine&nbsp;Miroir
          </span>
          <p style={{ fontFamily: C.fontSans, fontSize: 13, lineHeight: 1.7, maxWidth: 220, marginTop: 14 }}>
            Family-owned since 1847. Bourgogne, France. Drink responsibly.
          </p>
        </div>
        {cols.map((col) => (
          <div key={col.title}>
            <p style={{ ...overline, fontSize: 11, color: C.gold, marginBottom: 16 }}>{col.title}</p>
            {col.links.map((l) => (
              <a
                key={l}
                href="#"
                style={{ display: 'block', fontFamily: C.fontSans, fontSize: 13, color: C.creamDim, textDecoration: 'none', padding: '5px 0' }}
              >
                {l}
              </a>
            ))}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 44, paddingTop: 22, borderTop: `1px solid ${C.gold}22`, fontFamily: C.fontSans, fontSize: 12, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <span>© 2026 Domaine Miroir. L’abus d’alcool est dangereux pour la santé.</span>
        <span>Mentions légales · CGV · Confidentialité</span>
      </div>
    </footer>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════════════════════════════════════ */

export default function Impact218Page() {
  return (
    <main style={pageStyle}>
      <style>{`
        @media (max-width: 800px){ .dm-nav { display: none !important; } }
        html { scroll-behavior: smooth; }
      `}</style>
      <Nav />
      <ScrollHero />
      <Terroir />
      <Vintages />
      <Cellar />
      <Pairings />
      <Testimonial />
      <OrderCTA />
      <Footer />
    </main>
  );
}
