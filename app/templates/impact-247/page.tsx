"use client";
// @ts-nocheck

import React, {useRef, useState, useEffect} from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  MotionValue,
  useMotionValue,
} from 'framer-motion';
import { ArrowRight, ChevronDown, Zap } from 'lucide-react';

/* ════════════════════════════════════════════════════════════════════════════
   VOLT & LUX — Électricien Certifié & Domotique · Toulouse
   Photographie réelle + chorégraphie de défilement éditoriale. 'use client'.
   ════════════════════════════════════════════════════════════════════════════ */

/* Google Fonts */
const FONTS = `
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
`;

/* ── Palette ─────────────────────────────────────────────────────────────── */
const C = {
  bg: '#f2f4f8',
  bgAlt: '#e4e8f2',
  bgDark: '#0d0f1a',
  bgDarkAlt: '#080910',
  bgCard: '#ffffff',
  accent: '#3d5afe',
  accentDark: '#2c46d6',
  accentLight: '#dde4ff',
  white: '#ffffff',
  ink: '#0d0f1a',
  textMuted: '#3a4060',
  textFaint: '#7a80a0',
  border: '#c8cce8',
  borderDark: 'rgba(61,90,254,0.2)',
  yellow: '#f5c518',
} as const;

const SERIF = "'Playfair Display', Georgia, serif" as const;
const SANS = "'Space Grotesk', system-ui, sans-serif" as const;

/* ── Photos Unsplash ─────────────────────────────────────────────────────── */
const BASE = 'https://images.unsplash.com/photo-';
const PHOTO = {
  electrical: `${BASE}1504328517-cf9d8d765e72?q=80&w=1600&auto=format&fit=crop`,
  electricalHero: `${BASE}1504328517-cf9d8d765e72?q=80&w=2000&auto=format&fit=crop`,
  electricalSm: `${BASE}1504328517-cf9d8d765e72?q=80&w=800&auto=format&fit=crop`,
  smartHome: `${BASE}1484154133-338c7e4c5861?q=80&w=1600&auto=format&fit=crop`,
  smartHomeSm: `${BASE}1484154133-338c7e4c5861?q=80&w=800&auto=format&fit=crop`,
  ev: `${BASE}1560472354-b33ff0c44a43?q=80&w=1600&auto=format&fit=crop`,
  evSm: `${BASE}1560472354-b33ff0c44a43?q=80&w=900&auto=format&fit=crop`,
} as const;

/* ── Easing partagé ──────────────────────────────────────────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ════════════════════════════════════════════════════════════════════════════
   Primitives
   ════════════════════════════════════════════════════════════════════════════ */

/** Étiquette fine capitales avec filet bleu. */
function Eyebrow({
  children,
  color = C.accent,
  align = 'left',
}: {
  children: React.ReactNode;
  color?: string;
  align?: 'left' | 'center';
}) {
  const wrap: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    justifyContent: align === 'center' ? 'center' : 'flex-start',
  };
  const rule: React.CSSProperties = {
    width: 40,
    height: 1,
    background: color,
    opacity: 0.7,
    flexShrink: 0,
  };
  const label: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 11,
    letterSpacing: '0.38em',
    textTransform: 'uppercase',
    color,
    fontWeight: 500,
  };
  return (
    <div style={wrap}>
      <span style={rule} />
      <span style={label}>{children}</span>
      {align === 'center' ? <span style={rule} /> : null}
    </div>
  );
}

/** Révélation fondu + translation, une seule fois au scroll. */
function Reveal({
  children,
  delay = 0,
  y = 36,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px -10% 0px' });
  return (
    <motion.div
      ref={ref}
      style={style}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 1.05, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Bouton accent bleu avec flèche animée. */
function AccentButton({
  children,
  onClick,
  filled = true,
  type = 'button',
  small = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  filled?: boolean;
  type?: 'button' | 'submit';
  small?: boolean;
}) {
  const [hover, setHover] = useState(false);
  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 10,
    padding: small ? '11px 22px' : '15px 30px',
    fontFamily: SANS,
    fontSize: small ? 12 : 13,
    letterSpacing: '0.12em',
    fontWeight: 600,
    cursor: 'pointer',
    border: `2px solid ${C.accent}`,
    background: filled ? C.accent : 'transparent',
    color: filled ? C.white : C.accent,
    transition: 'all .45s cubic-bezier(.16,1,.3,1)',
    borderRadius: 2,
  };
  const hov: React.CSSProperties = hover
    ? filled
      ? { background: C.accentDark, borderColor: C.accentDark, transform: 'translateY(-2px)', boxShadow: `0 12px 32px -8px rgba(61,90,254,0.5)` }
      : { background: 'rgba(61,90,254,0.08)', transform: 'translateY(-2px)' }
    : {};
  return (
    <button
      type={type}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ ...base, ...hov }}
    >
      {children}
      <ArrowRight
        size={14}
        style={{
          transform: hover ? 'translateX(5px)' : 'none',
          transition: 'transform .45s cubic-bezier(.16,1,.3,1)',
        }}
      />
    </button>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   Nav
   ════════════════════════════════════════════════════════════════════════════ */
function Nav() {
  const [solid, setSolid] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  React.useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 70);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: 'Services', href: '#services' },
    { label: 'Domotique', href: '#domotique' },
    { label: 'Certifications', href: '#certifications' },
    { label: 'Devis', href: '#devis' },
  ];

  const bar: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 60,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: solid ? '14px clamp(20px,5vw,64px)' : '24px clamp(20px,5vw,64px)',
    background: solid ? 'rgba(13,15,26,0.95)' : 'transparent',
    backdropFilter: solid ? 'blur(16px) saturate(150%)' : 'none',
    WebkitBackdropFilter: solid ? 'blur(16px) saturate(150%)' : 'none',
    borderBottom: solid ? `1px solid rgba(61,90,254,0.25)` : '1px solid transparent',
    transition: 'all .55s cubic-bezier(.16,1,.3,1)',
  };
  const brand: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 20,
    fontWeight: 700,
    letterSpacing: '-0.02em',
    color: C.white,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    textDecoration: 'none',
  };
  const linkRow: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'clamp(20px,2.6vw,40px)',
  };

  return (
    <>
      
        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="vl-burger"
          aria-label="Menu"
          style={{
            display: 'none',
            flexDirection: 'column',
            gap: 5,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 4,
          }}
        >
          <span style={{ width: 22, height: 2, background: '#1a1a1a', borderRadius: 1, display: 'block', transition: 'transform 0.3s', transform: mobileOpen ? 'rotate(45deg) translate(0, 7px)' : 'none' }} />
          <span style={{ width: 22, height: 2, background: '#1a1a1a', borderRadius: 1, display: 'block', opacity: mobileOpen ? 0 : 1, transition: 'opacity 0.3s' }} />
          <span style={{ width: 22, height: 2, background: '#1a1a1a', borderRadius: 1, display: 'block', transition: 'transform 0.3s', transform: mobileOpen ? 'rotate(-45deg) translate(0, -7px)' : 'none' }} />
        </button>
        <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap');
        @media (max-width: 860px){
          .vl-navlinks{ display:none !important; }
          .vl-burger { display: flex !important; flex-direction: column; }
          .vl-navcta{ display:none !important; }
        }
      
        /* mobile: stack 2-col grids to single column (added by responsive fix) */
        @media (max-width: 768px) {
          .imx-mobstack { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <nav style={bar}>
        <a href="#domotique" style={brand}>
          {fd?.logoBase64 ? (
            // Client logo (uploaded in the brief) replaces the placeholder mark —
            // essential for the client to recognise their brand in the render.
            <img
              src={fd.logoBase64}
              alt={fd?.businessName ?? 'logo'}
              style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
            />
          ) : (
            <>
              <Zap size={20} color={C.yellow} strokeWidth={2.5} fill={C.yellow} />
              Volt &amp; Lux
            </>
          )}
        </a>
        <div style={linkRow} className="vl-navlinks">
          {links.map((l) => (
            <NavLink key={l.label} label={l.label} href={l.href} />
          ))}
        </div>
        <div className="vl-navcta">
          <a href="#devis" style={{ textDecoration: 'none' }}>
            <AccentButton small>Devis gratuit</AccentButton>
          </a>
        </div>
      </nav>
      {mobileOpen && (
        <div style={{
          position: 'fixed',
          top: 58,
          left: 0,
          right: 0,
          zIndex: 98,
          background: 'rgba(250,248,244,0.98)',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          padding: '20px clamp(20px,5vw,48px) 28px',
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
        }}>
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              style={{
                color: '#1a1a1a',
                textDecoration: 'none',
                fontSize: 15,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                opacity: 0.85,
              }}
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </>
  );
}

function NavLink({ label, href }: { label: string; href: string }) {
  const [h, setH] = useState(false);
  return (
    <a
      href={href}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        fontFamily: SANS,
        fontSize: 13,
        fontWeight: 500,
        letterSpacing: '0.04em',
        color: h ? C.white : 'rgba(255,255,255,0.80)',
        textDecoration: 'none',
        transition: 'color .3s',
        position: 'relative',
        paddingBottom: 4,
      }}
    >
      {label}
      <span
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          height: 1,
          width: h ? '100%' : '0%',
          background: C.accent,
          transition: 'width .45s cubic-bezier(.16,1,.3,1)',
        }}
      />
    </a>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   Hero
   ════════════════════════════════════════════════════════════════════════════ */
function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '-40%']);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const section: React.CSSProperties = {
    position: 'relative',
    height: '100dvh',
    minHeight: 640,
    overflow: 'hidden',
    background: C.bgDark,
  };

  return (
    <section id="hero" ref={ref} style={section}>
      {/* Photo plein cadre avec parallaxe */}
      <motion.div
        style={{
          position: 'absolute',
          inset: '-8% 0 0 0',
          height: '116%',
          scale: imgScale,
          y: imgY,
        }}
      >
        <img
          src={PHOTO.electricalHero}
          alt="Tableau électrique professionnel Volt & Lux Toulouse"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          priority-fetch="high"
        />
      </motion.div>

      {/* Scrims */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(13,15,26,0.55) 0%, rgba(13,15,26,0.10) 36%, rgba(13,15,26,0.48) 68%, rgba(13,15,26,0.92) 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to right, rgba(13,15,26,0.65) 0%, rgba(13,15,26,0.0) 70%)',
        }}
      />

      {/* Titre parallaxe */}
      <motion.div
        style={{
          position: 'relative',
          zIndex: 2,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: 'clamp(80px,10vw,140px) clamp(24px,6vw,96px) clamp(60px,8vw,100px)',
          y: titleY,
          opacity: titleOpacity,
        }}
      >
        <Reveal y={16}>
          <Eyebrow color={C.yellow}>Électricien certifié · Toulouse</Eyebrow>
        </Reveal>

        <motion.h1
          initial={{ opacity: 0, y: 44 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3, ease: EASE, delay: 0.12 }}
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontWeight: 400,
            color: C.white,
            fontSize: 'clamp(3rem,7vw,8.5rem)',
            lineHeight: 0.98,
            letterSpacing: '-0.01em',
            margin: '22px 0 26px',
            maxWidth: '14ch',
            textShadow: '0 16px 60px rgba(0,0,0,0.6)',
          }}
        >
          L&apos;électricité{' '}
          <span style={{ fontStyle: 'italic', color: C.yellow }}>/ sans</span>
          {' '}compromis.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.38 }}
          style={{
            fontFamily: SANS,
            fontWeight: 300,
            fontSize: 'clamp(1rem,1.7vw,1.3rem)',
            color: 'rgba(255,255,255,0.82)',
            maxWidth: 520,
            lineHeight: 1.65,
            marginBottom: 36,
          }}
        >
          Mise aux normes, domotique clé en main, bornes IRVE — 12 ans d&apos;expertise
          certifiée Qualifelec au service des particuliers et professionnels toulousains.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.6 }}
          style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}
        >
          <a href="#devis" style={{ textDecoration: 'none' }}>
            <AccentButton>Devis gratuit</AccentButton>
          </a>
          <a href="#services" style={{ textDecoration: 'none' }}>
            <AccentButton filled={false}>Nos services</AccentButton>
          </a>
        </motion.div>
      </motion.div>

      {/* Cue défilement */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: 32,
          right: 'clamp(24px,5vw,64px)',
          zIndex: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          opacity: cueOpacity,
        }}
      >
        <span
          style={{
            fontFamily: SANS,
            fontSize: 10,
            letterSpacing: '0.30em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.6)',
            writingMode: 'vertical-rl',
          }}
        >
          Découvrir
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={18} color={C.yellow} strokeWidth={1.5} />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   Intro
   ════════════════════════════════════════════════════════════════════════════ */
function Intro() {
  const sec: React.CSSProperties = {
    background: C.bgAlt,
    padding: 'clamp(90px,13vw,180px) clamp(24px,8vw,160px)',
    textAlign: 'center',
  };
  return (
    <section style={sec}>
      <Reveal>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
          <Eyebrow color={C.textMuted} align="center">
            Notre philosophie
          </Eyebrow>
        </div>
      </Reveal>
      <Reveal delay={0.1}>
        <p
          style={{
            fontFamily: SERIF,
            fontSize: 'clamp(1.6rem,3.4vw,3.2rem)',
            fontWeight: 400,
            lineHeight: 1.34,
            color: C.ink,
            maxWidth: 980,
            margin: '0 auto',
          }}
        >
          L&apos;électricité, c&apos;est{' '}
          <span style={{ fontStyle: 'italic', color: C.accent }}>invisible</span>.
          Notre travail, lui, doit être{' '}
          <span style={{ fontStyle: 'italic' }}>irréprochable</span>.
        </p>
      </Reveal>
      <Reveal delay={0.22}>
        <div
          style={{
            width: 2,
            height: 80,
            background: `linear-gradient(${C.accent}, transparent)`,
            margin: '52px auto 0',
            borderRadius: 2,
          }}
        />
      </Reveal>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   WorkSequence — Crossfade collant 320vh
   ════════════════════════════════════════════════════════════════════════════ */
interface Phase {
  src: string;
  alt: string;
  index: string;
  title: string;
  body: string;
}

const PHASES: Phase[] = [
  {
    src: PHOTO.electrical,
    alt: 'Mise aux normes tableau électrique NF C 15-100',
    index: 'I',
    title: 'MISE AUX NORMES',
    body: 'Tableaux électriques NF C 15-100, mise à la terre, protection différentielle — votre installation en conformité.',
  },
  {
    src: PHOTO.smartHome,
    alt: 'Installation domotique maison connectée',
    index: 'II',
    title: 'DOMOTIQUE',
    body: 'Pilotage lumière, volets, chauffage et sécurité depuis votre smartphone — maison connectée clé en main.',
  },
  {
    src: PHOTO.ev,
    alt: 'Installation borne de recharge IRVE véhicule électrique',
    index: 'III',
    title: 'BORNE DE RECHARGE',
    body: 'Installation IRVE pour particuliers et professionnels — éligible à la prime Advenir.',
  },
];

function PhaseImage({
  phase,
  i,
  total,
  progress,
}: {
  phase: Phase;
  i: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const seg = 1 / total;
  const start = i * seg;
  const end = start + seg;
  const fadeIn = seg * 0.28;

  const opacity = useTransform(
    progress,
    [Math.max(0, start - fadeIn), start, end - fadeIn, Math.min(1, end)],
    i === 0
      ? [1, 1, 1, 0]
      : i === total - 1
        ? [0, 1, 1, 1]
        : [0, 1, 1, 0],
  );
  const scale = useTransform(progress, [start - fadeIn, end], [1.1, 1.0]);

  return (
    <motion.div style={{ position: 'absolute', inset: 0, opacity }}>
      <motion.img
        src={phase.src}
        alt={phase.alt}
        loading="lazy"
        style={{ width: '100%', height: '100%', objectFit: 'cover', scale }}
      />
    </motion.div>
  );
}

function PhaseCaption({
  phase,
  i,
  total,
  progress,
}: {
  phase: Phase;
  i: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const seg = 1 / total;
  const start = i * seg;
  const end = start + seg;
  const fade = seg * 0.22;

  const opacity = useTransform(
    progress,
    [start, start + fade, end - fade, end],
    i === 0 ? [1, 1, 1, 0] : [0, 1, 1, 0],
  );
  const y = useTransform(progress, [start, end], [30, -30]);

  return (
    <motion.div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
        padding: 'clamp(40px,6vw,80px)',
        opacity,
        y,
      }}
    >
      <div
        style={{
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontSize: 'clamp(5rem,12vw,16rem)',
          color: 'rgba(61,90,254,0.18)',
          lineHeight: 1,
          position: 'absolute',
          top: 'clamp(40px,8vw,100px)',
          right: 'clamp(24px,5vw,64px)',
          userSelect: 'none',
        }}
      >
        {phase.index}
      </div>

      {/* Section label top-right */}
      <div
        style={{
          position: 'absolute',
          top: 'clamp(40px,6vw,80px)',
          right: 'clamp(24px,5vw,64px)',
        }}
      >
        <span
          style={{
            fontFamily: SANS,
            fontSize: 10,
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.55)',
          }}
        >
          {phase.index} / {total}
        </span>
      </div>

      <div style={{ maxWidth: 680 }}>
        <h2
          style={{
            fontFamily: SANS,
            fontSize: 'clamp(1.8rem,5vw,6rem)',
            fontWeight: 700,
            letterSpacing: '0.06em',
            color: C.white,
            lineHeight: 1,
            margin: '0 0 20px',
            textShadow: '0 8px 40px rgba(0,0,0,0.6)',
          }}
        >
          {phase.title}
        </h2>
        <p
          style={{
            fontFamily: SANS,
            fontWeight: 300,
            fontSize: 'clamp(1rem,1.6vw,1.3rem)',
            color: 'rgba(255,255,255,0.82)',
            lineHeight: 1.6,
            maxWidth: 520,
          }}
        >
          {phase.body}
        </p>
      </div>
    </motion.div>
  );
}

function ProgressDot({
  i,
  total,
  progress,
}: {
  i: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const seg = 1 / total;
  const opacity = useTransform(
    progress,
    [i * seg, i * seg + 0.02, (i + 1) * seg - 0.02, (i + 1) * seg],
    [0.35, 1, 1, 0.35],
  );
  const width = useTransform(progress, [i * seg, (i + 1) * seg], [10, 36]);
  return (
    <motion.div style={{ height: 2, width, background: C.accent, opacity, borderRadius: 2 }} />
  );
}

function WorkSequence() {
  const n = PHASES.length;
  const progress = useMotionValue(0.5 / n);
  const [active, setActive] = useState(0);
  const goTo = (i: number) => {
    setActive(i);
    progress.set((i + 0.5) / n);
  };

  return (
    <section
      id="domotique"
      style={{ height: '100dvh', overflow: 'hidden', position: 'relative', background: C.bgDark }}
    >
      <div style={{ position: 'sticky', top: 0, height: '100dvh', overflow: 'hidden' }}>
        {PHASES.map((p, i) => (
          <PhaseImage
            key={p.title}
            phase={p}
            i={i}
            total={PHASES.length}
            progress={progress}
          />
        ))}

        {/* Scrim lisibilité */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to bottom, rgba(13,15,26,0.35) 0%, rgba(13,15,26,0.05) 40%, rgba(13,15,26,0.65) 100%)',
          }}
        />

        {PHASES.map((p, i) => (
          <PhaseCaption
            key={p.title}
            phase={p}
            i={i}
            total={PHASES.length}
            progress={progress}
          />
        ))}

        {/* Dots de progression */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 10,
          }}
        >
          {PHASES.map((p, i) => (
            <ProgressDot
              key={p.index}
              i={i}
              total={PHASES.length}
              progress={progress}
            />
          ))}
        {/* Carousel navigation */}
        <button
          onClick={() => goTo((active - 1 + n) % n)}
          aria-label="Slide précédent"
          style={{ position: 'absolute', left: 'clamp(16px,3vw,36px)', top: '50%', transform: 'translateY(-50%)', zIndex: 10, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', width: 44, height: 44, borderRadius: '50%', cursor: 'pointer', fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}
        >&#8249;</button>
        <button
          onClick={() => goTo((active + 1) % n)}
          aria-label="Slide suivant"
          style={{ position: 'absolute', right: 'clamp(16px,3vw,36px)', top: '50%', transform: 'translateY(-50%)', zIndex: 10, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', width: 44, height: 44, borderRadius: '50%', cursor: 'pointer', fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}
        >&#8250;</button>
        <div style={{ position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8, zIndex: 10 }}>
          {Array.from({ length: n }, (_, i) => (
            <button key={i} onClick={() => goTo(i)} aria-label={`Slide ${i + 1}`} style={{ width: 8, height: 8, borderRadius: '50%', background: active === i ? '#fff' : 'rgba(255,255,255,0.35)', border: 'none', cursor: 'pointer', padding: 0, transition: 'background 0.3s' }} />
          ))}
        </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   ServiceCards
   ════════════════════════════════════════════════════════════════════════════ */
interface Service {
  icon: string;
  title: string;
  description: string;
}

const SERVICES: Service[] = [
  {
    icon: '⚡',
    title: 'Mise aux normes NF C 15-100',
    description: 'Diagnostic complet, tableau conforme, protection différentielle — attestation CONSUEL fournie.',
  },
  {
    icon: '🔧',
    title: 'Tableau électrique',
    description: 'Remplacement ou extension de tableau, disjoncteurs différentiels, parafoudre intégré.',
  },
  {
    icon: '🏠',
    title: 'Installation domotique',
    description: 'Legrand, Somfy, KNX — programmation, mise en service et SAV inclus.',
  },
  {
    icon: '💡',
    title: 'Éclairage LED professionnel',
    description: "Conception lumineuse, installation et raccordement — économies d\'énergie jusqu\'à 70%.",
  },
  {
    icon: '🚗',
    title: 'Borne de recharge IRVE',
    description: 'Habilitation IRVE, installation P1/P2, éligible prime Advenir pour particuliers et pros.',
  },
  {
    icon: '🚨',
    title: 'Dépannage électrique 24h',
    description: 'Intervention rapide à Toulouse et agglomération — coupure, court-circuit, panne générale.',
  },
];

function ServiceCard({ s, i }: { s: Service; i: number }) {
  const [hover, setHover] = useState(false);
  const card: React.CSSProperties = {
    background: C.bgCard,
    border: `1px solid ${hover ? C.accent : C.border}`,
    borderLeft: `3px solid ${C.accent}`,
    padding: 'clamp(28px,3vw,38px)',
    boxShadow: hover
      ? `0 24px 56px -24px rgba(61,90,254,0.28), 0 4px 16px -8px rgba(0,0,0,0.1)`
      : '0 2px 20px -10px rgba(0,0,0,0.1)',
    transform: hover ? 'translateY(-8px)' : 'none',
    transition: 'all .5s cubic-bezier(.16,1,.3,1)',
    cursor: 'default',
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  };
  return (
    <Reveal delay={i * 0.08} style={{ height: '100%' }}>
      <article
        style={card}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <span style={{ fontSize: 28 }}>{s.icon}</span>
        <h3
          style={{
            fontFamily: SERIF,
            fontSize: 'clamp(1.1rem,1.5vw,1.35rem)',
            fontWeight: 600,
            color: C.ink,
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          {s.title}
        </h3>
        <p
          style={{
            fontFamily: SANS,
            fontWeight: 400,
            fontSize: 15,
            lineHeight: 1.65,
            color: C.textMuted,
            margin: 0,
          }}
        >
          {s.description}
        </p>
      </article>
    </Reveal>
  );
}

function ServiceCards() {
  const sec: React.CSSProperties = {
    background: C.bg,
    padding: 'clamp(90px,12vw,160px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 'clamp(20px,2.5vw,32px)',
    maxWidth: 1280,
    margin: '0 auto',
  };
  return (
    <section style={sec} id="services">
      <div style={{ maxWidth: 1280, margin: '0 auto 56px' }}>
        <Reveal>
          <Eyebrow>Nos Prestations</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(2rem,5vw,4.5rem)',
              fontWeight: 400,
              color: C.ink,
              margin: '20px 0 0',
              lineHeight: 1.06,
            }}
          >
            Tout ce qu&apos;il faut,{' '}
            <span style={{ fontStyle: 'italic', color: C.accent }}>
              bien fait
            </span>
          </h2>
        </Reveal>
      </div>
      <div style={grid}>
        {SERVICES.map((s, i) => (
          <ServiceCard key={s.title} s={s} i={i} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   EditorialRows
   ════════════════════════════════════════════════════════════════════════════ */
interface EditRow {
  eyebrow: string;
  numeral: string;
  title: React.ReactNode;
  body: string;
  img: string;
  alt: string;
  reverse?: boolean;
}

const EDIT_ROWS: EditRow[] = [
  {
    eyebrow: 'Notre expertise',
    numeral: 'I',
    title: (
      <>
        Courant{' '}
        <span style={{ fontStyle: 'italic' }}>/ maîtrisé.</span>
      </>
    ),
    body: "12 ans d\'expérience, certification Qualifelec E1/E2, plus de 500 chantiers menés à Toulouse et sa région. Chaque installation respecte les normes en vigueur et les délais convenus. Attestation CONSUEL fournie après chaque mise aux normes.",
    img: PHOTO.electricalSm,
    alt: 'Électricien certifié Qualifelec intervention tableau Toulouse',
  },
  {
    eyebrow: 'Innovation',
    numeral: 'II',
    title: (
      <>
        La maison{' '}
        <span style={{ fontStyle: 'italic' }}>/ intelligente.</span>
      </>
    ),
    body: "Solutions domotiques Legrand, Somfy et KNX — programmation personnalisée, formation et service après-vente assurés. Votre maison répond à votre mode de vie : confort, économies d\'énergie et sécurité réunis.",
    img: PHOTO.smartHomeSm,
    alt: 'Installation domotique maison connectée Toulouse',
    reverse: true,
  },
];

function ParallaxImg({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['-7%', '7%']);
  return (
    <div ref={ref} style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        style={{ width: '100%', height: '116%', objectFit: 'cover', y, display: 'block' }}
      />
    </div>
  );
}

function EditRowBlock({ row, idx }: { row: EditRow; idx: number }) {
  const wrap: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 'clamp(36px,6vw,96px)',
    alignItems: 'center',
    position: 'relative',
  };
  const imgWrap: React.CSSProperties = {
    overflow: 'hidden',
    order: row.reverse ? 2 : 1,
    aspectRatio: '4 / 5',
    position: 'relative',
  };
  const txt: React.CSSProperties = { order: row.reverse ? 1 : 2 };
  return (
    <div style={wrap} className="vl-editrow">
      {/* Ghost numeral */}
      <div
        style={{
          position: 'absolute',
          top: '-0.15em',
          [row.reverse ? 'right' : 'left']: '-0.05em',
          fontFamily: SERIF,
          fontSize: 'clamp(8rem,16vw,22rem)',
          fontWeight: 700,
          color: C.yellow,
          opacity: 0.1,
          lineHeight: 1,
          pointerEvents: 'none',
          userSelect: 'none',
          zIndex: 0,
        }}
      >
        {row.numeral}
      </div>

      <Reveal y={50} style={{ ...imgWrap, zIndex: 1 }}>
        <ParallaxImg src={row.img} alt={row.alt} />
      </Reveal>

      <div style={{ ...txt, zIndex: 1 }}>
        <Reveal>
          <Eyebrow>{row.eyebrow}</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h3
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(1.8rem,4vw,3.8rem)',
              fontWeight: 400,
              color: C.ink,
              margin: '20px 0 24px',
              lineHeight: 1.1,
            }}
          >
            {row.title}
          </h3>
        </Reveal>
        <Reveal delay={0.16}>
          <p
            style={{
              fontFamily: SANS,
              fontWeight: 400,
              fontSize: 'clamp(1rem,1.4vw,1.15rem)',
              lineHeight: 1.8,
              color: C.textMuted,
              maxWidth: 460,
            }}
          >
            {row.body}
          </p>
        </Reveal>
        <Reveal delay={0.24}>
          <div style={{ marginTop: 32 }}>
            <a href="#devis" style={{ textDecoration: 'none' }}>
              <AccentButton>Demander un devis</AccentButton>
            </a>
          </div>
        </Reveal>
      </div>

      <style>{`
        @media (max-width: 860px){
          .vl-editrow{ grid-template-columns: 1fr !important; }
          .vl-editrow > *{ order: initial !important; }
        }
      `}</style>
    </div>
  );
}

function EditorialRows() {
  const sec: React.CSSProperties = {
    background: C.bg,
    padding: 'clamp(80px,10vw,140px) clamp(24px,6vw,96px)',
  };
  return (
    <section style={sec}>
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(80px,12vw,160px)',
        }}
      >
        {EDIT_ROWS.map((r, i) => (
          <EditRowBlock key={r.eyebrow} row={r} idx={i} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   CertPanel — Sticky image + 4 certifications
   ════════════════════════════════════════════════════════════════════════════ */
interface CertItem {
  num: string;
  title: string;
  body: string;
}

const CERTS: CertItem[] = [
  {
    num: '01',
    title: 'Certifié Qualifelec',
    body: "Qualification officielle des électriciens professionnels — gage de compétence reconnue par les assureurs et maîtres d\'ouvrage.",
  },
  {
    num: '02',
    title: 'IRVE certifié',
    body: "Habilitation officielle pour l\'installation de bornes de recharge pour véhicules électriques (P1 et P2).",
  },
  {
    num: '03',
    title: 'Garantie décennale & RC pro',
    body: 'Assurance responsabilité civile professionnelle et garantie décennale en vigueur sur tous nos chantiers.',
  },
  {
    num: '04',
    title: 'Attestation CONSUEL',
    body: 'Attestation de conformité électrique fournie après chaque mise aux normes — indispensable pour votre assurance habitation.',
  },
];

function CertPanel() {
  const sec: React.CSSProperties = {
    background: C.bgDark,
    padding: 'clamp(80px,10vw,140px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '0.85fr 1.15fr',
    gap: 'clamp(40px,6vw,100px)',
    maxWidth: 1240,
    margin: '0 auto',
    alignItems: 'start',
  };
  const stickyImg: React.CSSProperties = {
    position: 'sticky',
    top: 100,
    alignSelf: 'start',
  };

  return (
    <section style={sec} id="certifications">
      <div style={grid} className="vl-certpanel">
        {/* Image sticky */}
        <div style={stickyImg} className="vl-certpanel-img">
          <div
            style={{
              overflow: 'hidden',
              border: `1px solid ${C.borderDark}`,
              aspectRatio: '3 / 4',
              position: 'relative',
            }}
          >
            <img
              src={PHOTO.evSm}
              alt="Installation borne de recharge IRVE certifiée Toulouse"
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            {/* Badge overlay */}
            <div
              style={{
                position: 'absolute',
                bottom: 24,
                left: 24,
                background: C.accent,
                color: C.white,
                fontFamily: SANS,
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: '0.08em',
                padding: '10px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Zap size={14} fill={C.white} strokeWidth={0} />
              Certifié Qualifelec
            </div>
          </div>
          <div style={{ marginTop: 20 }}>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 12,
                letterSpacing: '0.06em',
                color: C.textFaint,
                marginBottom: 6,
              }}
            >
              +500 chantiers · depuis 2012
            </div>
            <div
              style={{
                fontFamily: SERIF,
                fontStyle: 'italic',
                fontSize: 18,
                color: 'rgba(255,255,255,0.75)',
              }}
            >
              « La sécurité électrique n&apos;est pas une option. »
            </div>
          </div>
        </div>

        {/* Certifications qui défilent */}
        <div>
          <Reveal>
            <Eyebrow color={C.accent}>Qualifications & Garanties</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(2rem,4.5vw,4rem)',
                fontWeight: 400,
                color: C.white,
                margin: '22px 0 52px',
                lineHeight: 1.08,
              }}
            >
              Des garanties{' '}
              <span style={{ fontStyle: 'italic', color: C.yellow }}>
                solides
              </span>
            </h2>
          </Reveal>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {CERTS.map((c, i) => (
              <Reveal key={c.num} delay={0.06 * i}>
                <div className="imx-mobstack"
                  style={{
                    padding: 'clamp(28px,3.5vw,42px) 0',
                    borderTop: `1px solid rgba(61,90,254,0.28)`,
                    display: 'grid',
                    gridTemplateColumns: '56px 1fr',
                    gap: 28,
                    alignItems: 'baseline',
                  }}
                >
                  <span
                    style={{
                      fontFamily: SERIF,
                      fontStyle: 'italic',
                      fontSize: 26,
                      color: C.yellow,
                      opacity: 0.85,
                      lineHeight: 1,
                    }}
                  >
                    {c.num}
                  </span>
                  <div>
                    <h4
                      style={{
                        fontFamily: SANS,
                        fontWeight: 600,
                        fontSize: 'clamp(1rem,1.4vw,1.2rem)',
                        color: C.white,
                        margin: '0 0 10px',
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {c.title}
                    </h4>
                    <p
                      style={{
                        fontFamily: SANS,
                        fontWeight: 300,
                        fontSize: 15,
                        lineHeight: 1.7,
                        color: 'rgba(255,255,255,0.65)',
                        margin: 0,
                      }}
                    >
                      {c.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 860px){
          .vl-certpanel{ grid-template-columns: 1fr !important; }
          .vl-certpanel-img{ position: static !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   Testimonials
   ════════════════════════════════════════════════════════════════════════════ */
interface Testimonial {
  quote: string;
  name: string;
  role: string;
  detail: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Rénovation électrique complète de notre maison de 180 m² + installation domotique Somfy. Coordination parfaite, délais tenus à la journée. L\'attestation CONSUEL reçue en 48h après la fin du chantier.",
    name: 'Sophie & Mathieu R.',
    role: 'Propriétaires · Toulouse Lardenne',
    detail: 'Mise aux normes + domotique',
  },
  {
    quote:
      "Panne électrique totale un vendredi soir dans notre restaurant — intervention en moins de 2h. Le lendemain, Volt & Lux revenait pour l\'upgrade LED de toute la salle. Professionnels, propres, efficaces.",
    name: 'David Anselmi',
    role: 'Gérant · Brasserie Le Capitole, Toulouse',
    detail: 'Dépannage urgence + LED',
  },
];

function TestimonialCard({ t, i }: { t: Testimonial; i: number }) {
  const card: React.CSSProperties = {
    background: C.bgCard,
    border: `1px solid ${C.border}`,
    padding: 'clamp(30px,4vw,48px)',
    boxShadow: '0 20px 60px -40px rgba(13,15,26,0.25)',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    boxSizing: 'border-box',
  };
  return (
    <Reveal delay={i * 0.12} style={{ height: '100%' }}>
      <figure style={card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
          <Zap size={28} color={C.yellow} fill={C.yellow} strokeWidth={0} />
          <span
            style={{
              fontFamily: SANS,
              fontSize: 11,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: C.textFaint,
            }}
          >
            {t.detail}
          </span>
        </div>
        <blockquote
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 'clamp(1.05rem,1.7vw,1.3rem)',
            lineHeight: 1.65,
            color: C.ink,
            margin: '0 0 28px',
            flex: 1,
          }}
        >
          &ldquo;{t.quote}&rdquo;
        </blockquote>
        <figcaption style={{ borderTop: `1px solid ${C.border}`, paddingTop: 20 }}>
          <div
            style={{ fontFamily: SANS, fontWeight: 600, fontSize: 16, color: C.accent }}
          >
            {t.name}
          </div>
          <div
            style={{
              fontFamily: SANS,
              fontSize: 12,
              letterSpacing: '0.1em',
              color: C.textFaint,
              marginTop: 5,
            }}
          >
            {t.role}
          </div>
        </figcaption>
      </figure>
    </Reveal>
  );
}

function Testimonials() {
  const sec: React.CSSProperties = {
    background: C.bgAlt,
    padding: 'clamp(90px,12vw,160px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: 'clamp(28px,3.5vw,52px)',
    maxWidth: 1180,
    margin: '0 auto',
  };
  return (
    <section style={sec}>
      <div style={{ maxWidth: 1180, margin: '0 auto 56px', textAlign: 'center' }}>
        <Reveal>
          <Eyebrow color={C.textMuted} align="center">
            Ils nous font confiance
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(2rem,4.5vw,4rem)',
              fontWeight: 400,
              color: C.ink,
              margin: '20px 0 0',
              lineHeight: 1.1,
            }}
          >
            La parole de{' '}
            <span style={{ fontStyle: 'italic', color: C.accent }}>
              nos clients
            </span>
          </h2>
        </Reveal>
      </div>
      <div style={grid}>
        {TESTIMONIALS.map((t, i) => (
          <TestimonialCard key={t.name} t={t} i={i} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   QuoteForm
   ════════════════════════════════════════════════════════════════════════════ */
function QuoteForm() {
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [tel, setTel] = useState('');
  const [projet, setProjet] = useState('');
  const [cp, setCp] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prenom || !email || !projet) return;
    setSent(true);
  };

  const sec: React.CSSProperties = {
    background: C.bgDark,
    padding: 'clamp(90px,13vw,180px) clamp(24px,6vw,96px)',
    position: 'relative',
    overflow: 'hidden',
  };

  const fieldBase: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    background: 'transparent',
    border: 'none',
    borderBottom: `1px solid rgba(255,255,255,0.2)`,
    padding: '14px 2px',
    fontFamily: SANS,
    fontWeight: 400,
    fontSize: 17,
    color: C.white,
    outline: 'none',
    transition: 'border-color .3s',
  };
  const labelStyle: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 11,
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    color: C.accent,
    display: 'block',
    marginBottom: 4,
    fontWeight: 500,
  };

  return (
    <section style={sec} id="devis">
      {/* Glow de fond */}
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '70%',
          height: '60%',
          background: 'radial-gradient(ellipse, rgba(61,90,254,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: 720,
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <Reveal>
          <Eyebrow color={C.yellow} align="center">
            Devis gratuit &amp; sans engagement
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(2.2rem,5vw,5rem)',
              fontWeight: 400,
              color: C.white,
              margin: '22px 0 18px',
              lineHeight: 1.06,
            }}
          >
            Votre projet{' '}
            <span style={{ fontStyle: 'italic', color: C.yellow }}>commence ici</span>
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p
            style={{
              fontFamily: SANS,
              fontWeight: 300,
              fontSize: 'clamp(1rem,1.5vw,1.15rem)',
              lineHeight: 1.7,
              color: 'rgba(255,255,255,0.72)',
              maxWidth: 520,
              margin: '0 auto 52px',
            }}
          >
            Réponse sous 24h — diagnostic téléphonique inclus, sans engagement.
            Interventions à Toulouse et dans un rayon de 30 km.
          </p>
        </Reveal>

        {sent ? (
          <Reveal>
            <div
              style={{
                border: `1px solid ${C.accent}`,
                background: 'rgba(61,90,254,0.08)',
                padding: 'clamp(36px,5vw,56px)',
                textAlign: 'center',
              }}
            >
              <Zap size={36} color={C.yellow} fill={C.yellow} strokeWidth={0} />
              <h3
                style={{
                  fontFamily: SERIF,
                  fontSize: 'clamp(1.5rem,2.5vw,2.2rem)',
                  fontWeight: 400,
                  color: C.white,
                  margin: '20px 0 14px',
                }}
              >
                Merci {prenom ? prenom.split(' ')[0] : ''}, nous vous envoyons votre devis sous 24h.
              </h3>
              <p
                style={{
                  fontFamily: SANS,
                  fontWeight: 300,
                  fontSize: 16,
                  color: 'rgba(255,255,255,0.72)',
                  margin: 0,
                  lineHeight: 1.65,
                }}
              >
                Un électricien Volt &amp; Lux prendra contact avec vous à l&apos;adresse{' '}
                <strong style={{ color: C.accentLight, fontWeight: 500 }}>{email}</strong>{' '}
                pour affiner votre demande.
              </p>
            </div>
          </Reveal>
        ) : (
          <Reveal delay={0.24}>
            <form
              onSubmit={onSubmit}
              style={{ display: 'flex', flexDirection: 'column', gap: 34, textAlign: 'left' }}
              noValidate
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }} className="vl-formgrid">
                <div>
                  <label style={labelStyle} htmlFor="vl-prenom">Prénom</label>
                  <input
                    id="vl-prenom"
                    style={fieldBase}
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    placeholder="Jean"
                    autoComplete="given-name"
                    required
                  />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="vl-email">Email</label>
                  <input
                    id="vl-email"
                    style={fieldBase}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jean@exemple.fr"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }} className="vl-formgrid">
                <div>
                  <label style={labelStyle} htmlFor="vl-tel">Téléphone</label>
                  <input
                    id="vl-tel"
                    style={fieldBase}
                    type="tel"
                    value={tel}
                    onChange={(e) => setTel(e.target.value)}
                    placeholder="06 XX XX XX XX"
                    autoComplete="tel"
                  />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="vl-cp">Code postal</label>
                  <input
                    id="vl-cp"
                    style={fieldBase}
                    type="text"
                    value={cp}
                    onChange={(e) => setCp(e.target.value)}
                    placeholder="31000"
                    autoComplete="postal-code"
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle} htmlFor="vl-projet">Type de projet</label>
                <select
                  id="vl-projet"
                  style={{
                    ...fieldBase,
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    cursor: 'pointer',
                    color: projet ? C.white : 'rgba(255,255,255,0.40)',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%237a80a0' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 4px center',
                    paddingRight: 28,
                  }}
                  value={projet}
                  onChange={(e) => setProjet(e.target.value)}
                  required
                >
                  <option value="" style={{ color: C.ink, background: C.bgDark }}>
                    Choisir un type de projet…
                  </option>
                  <option value="Mise aux normes" style={{ color: C.ink, background: C.bgDark }}>
                    Mise aux normes
                  </option>
                  <option value="Tableau électrique" style={{ color: C.ink, background: C.bgDark }}>
                    Tableau électrique
                  </option>
                  <option value="Installation domotique" style={{ color: C.ink, background: C.bgDark }}>
                    Installation domotique
                  </option>
                  <option value="Éclairage LED" style={{ color: C.ink, background: C.bgDark }}>
                    Éclairage LED
                  </option>
                  <option value="Borne de recharge" style={{ color: C.ink, background: C.bgDark }}>
                    Borne de recharge
                  </option>
                  <option value="Autre" style={{ color: C.ink, background: C.bgDark }}>
                    Autre
                  </option>
                </select>
              </div>

              <div>
                <label style={labelStyle} htmlFor="vl-message">Message (optionnel)</label>
                <textarea
                  id="vl-message"
                  style={{
                    ...fieldBase,
                    resize: 'vertical',
                    minHeight: 100,
                    lineHeight: 1.6,
                  }}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Décrivez votre projet en quelques mots…"
                  rows={4}
                />
              </div>

              <div style={{ textAlign: 'center', marginTop: 8 }}>
                <AccentButton type="submit">Envoyer ma demande</AccentButton>
              </div>
            </form>
          </Reveal>
        )}
      </div>
      <style>{`
        @media (max-width: 640px){
          .vl-formgrid{ grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   Footer
   ════════════════════════════════════════════════════════════════════════════ */
function Footer() {
  const foot: React.CSSProperties = {
    background: C.bgDarkAlt,
    borderTop: `1px solid rgba(61,90,254,0.2)`,
    padding: 'clamp(64px,9vw,110px) clamp(24px,6vw,96px) 40px',
  };

  const cols = [
    {
      title: 'Services',
      items: ['Mise aux normes', 'Tableau électrique', 'Domotique', 'Éclairage LED', 'Borne de recharge', 'Dépannage 24h'],
      hrefs: ['#services', '#services', '#domotique', '#services', '#services', '#devis'],
    },
    {
      title: 'Certifications',
      items: ['Qualifelec', 'IRVE certifié', 'Garantie décennale', 'Attestation CONSUEL'],
      hrefs: ['#certifications', '#certifications', '#certifications', '#certifications'],
    },
    {
      title: 'Contact & Urgences',
      items: ['📍 Toulouse & agglomération', '📞 05 XX XX XX XX', '📧 contact@voltlux.fr', '🚨 Urgences 24h/7j'],
      hrefs: ['#devis', 'tel:+33500000000', 'mailto:contact@voltlux.fr', 'tel:+33500000000'],
    },
  ];

  return (
    <footer id="contact" style={foot}>
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.4fr repeat(3, 1fr)',
          gap: 'clamp(32px,5vw,64px)',
        }}
        className="vl-footgrid"
      >
        {/* Brand col */}
        <div>
          <div
            style={{
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: 22,
              color: C.white,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              letterSpacing: '-0.02em',
            }}
          >
            <Zap size={20} color={C.yellow} fill={C.yellow} strokeWidth={0} />
            Volt &amp; Lux
          </div>
          <p
            style={{
              fontFamily: SANS,
              fontWeight: 300,
              fontSize: 15,
              lineHeight: 1.7,
              color: 'rgba(255,255,255,0.55)',
              marginTop: 18,
              maxWidth: 300,
            }}
          >
            Électricien certifié Qualifelec à Toulouse. Mise aux normes,
            domotique &amp; bornes IRVE depuis 2012.
          </p>
          <div
            style={{
              marginTop: 24,
              fontFamily: SANS,
              fontSize: 12,
              letterSpacing: '0.06em',
              color: 'rgba(255,255,255,0.4)',
            }}
          >
            N° SIRET : 000 000 000 00000
          </div>
        </div>

        {/* Nav cols */}
        {cols.map((c) => (
          <div key={c.title}>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 11,
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: C.yellow,
                fontWeight: 600,
                marginBottom: 20,
              }}
            >
              {c.title}
            </div>
            <ul
              style={{
                listStyle: 'none',
                margin: 0,
                padding: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              {c.items.map((it, i) => (
                <li key={it}>
                  <a
                    href={c.hrefs[i]}
                    style={{
                      fontFamily: SANS,
                      fontWeight: 400,
                      fontSize: 14,
                      color: 'rgba(255,255,255,0.60)',
                      textDecoration: 'none',
                      transition: 'color .3s',
                    }}
                  >
                    {it}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div
        style={{
          maxWidth: 1240,
          margin: '56px auto 0',
          paddingTop: 24,
          borderTop: `1px solid rgba(255,255,255,0.08)`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 14,
          fontFamily: SANS,
          fontSize: 12,
          color: 'rgba(255,255,255,0.38)',
        }}
      >
        <span>© 2012–2026 Volt &amp; Lux · Tous droits réservés</span>
        <span style={{ display: 'flex', gap: 24 }}>
          <a href="#vl-projet" style={{ color: 'inherit', textDecoration: 'none' }}>
            Mentions légales
          </a>
          <a href="#vl-projet" style={{ color: 'inherit', textDecoration: 'none' }}>
            Politique de confidentialité
          </a>
        </span>
      </div>

      <style>{`
        @media (max-width: 860px){
          .vl-footgrid{ grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 540px){
          .vl-footgrid{ grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   PAGE ROOT
   ════════════════════════════════════════════════════════════════════════════ */

// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function Page() {
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

  const root: React.CSSProperties = {
    background: C.bg,
    color: C.ink,
    fontFamily: SANS,
    overflowX: 'hidden',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
  };

  
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
return (
    <main style={root} suppressHydrationWarning>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.35); }
        select option { background: #0d0f1a; color: #fff; }

        @media (max-width: 860px){
          .vl-editrow{ grid-template-columns: 1fr !important; }
          .vl-editrow > *{ order: initial !important; }
          .vl-certpanel{ grid-template-columns: 1fr !important; }
          .vl-certpanel-img{ position: static !important; }
          .vl-navlinks{ display:none !important; }
          .vl-navcta{ display:none !important; }
          .vl-footgrid{ grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 540px){
          .vl-footgrid{ grid-template-columns: 1fr !important; }
          .vl-formgrid{ grid-template-columns: 1fr !important; }
        }
      `}</style>
      <Nav />
      <Hero />
      <Intro />
      <WorkSequence />
      <ServiceCards />
      <EditorialRows />
      <CertPanel />
      <Testimonials />
      <QuoteForm />
      <Footer />
    </main>
  );
}
