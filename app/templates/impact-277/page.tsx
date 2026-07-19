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
import {
  ArrowRight,
  ChevronDown,
  Zap,
  Shield,
  Wifi,
  Star,
  Quote,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  Award,
  ClipboardList,
  Wrench,
  FileCheck,
  Home,
  Building2,
  Smartphone,
} from 'lucide-react';

/* ════════════════════════════════════════════════════════════════════════════
   ÉLECTRICITÉ DUMONT — Électricien certifié · Paris 11e & Île-de-France
   Photographie réelle + chorégraphie de défilement éditoriale (style Impact ×
   fiabilité artisanale × urgence). Fichier entièrement autonome. 'use client'.
   ════════════════════════════════════════════════════════════════════════════ */

/* ── Palette ─────────────────────────────────────────────────────────────── */
// Lightens (positive percent) or darkens (negative) a #rrggbb hex color —
// used to derive companion shades from the client's brand color.
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
  electric: '#003b8e',
  electricDeep: '#002a66',
  electricMid: '#0050c0',
  electricLight: '#1a6fd4',
  yellow: '#f5c518',
  yellowLight: '#fdd94a',
  yellowDeep: '#d4a800',
  white: '#ffffff',
  dark: '#1e1e2e',
  darkMid: '#2a2a3e',
  darkLight: '#3a3a52',
  gray: '#f5f6fa',
  grayMid: '#e8eaf0',
  ink: '#0d0d1a',
  muted: 'rgba(255,255,255,0.72)',
};

const SERIF = "'Oswald', Impact, sans-serif" as const;
const SANS = "'Source Sans 3', system-ui, sans-serif" as const;

/* ── Photographie (URLs Unsplash pré-vérifiées) ──────────────────────────── */
const PHOTO = {
  panel:
    'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1600&auto=format&fit=crop',
  wiring:
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1600&auto=format&fit=crop',
  domotique:
    'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=1600&auto=format&fit=crop',
  worker:
    'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1600&auto=format&fit=crop',
  haussmann:
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1600&auto=format&fit=crop',
  villa:
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop',
  commercial:
    'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600&auto=format&fit=crop',
} as const;

/* ── Easing partagé ──────────────────────────────────────────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ════════════════════════════════════════════════════════════════════════════
   Primitives
   ════════════════════════════════════════════════════════════════════════════ */

/** Étiquette technique, jaune électrique, filet. */
function Eyebrow({
  children,
  color = C.yellow,
  align = 'left',
  dark = false,
}: {
  children: React.ReactNode;
  color?: string;
  align?: 'left' | 'center';
  dark?: boolean;
}) {
  const wrap: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    justifyContent: align === 'center' ? 'center' : 'flex-start',
  };
  const rule: React.CSSProperties = {
    width: 46,
    height: 2,
    background: color,
    opacity: 0.8,
  };
  const label: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 11,
    letterSpacing: '0.36em',
    textTransform: 'uppercase',
    color,
    fontWeight: 700,
  };
  void dark;
  return (
    <div style={wrap}>
      <span style={rule} />
      <span style={label}>{children}</span>
      {align === 'center' ? <span style={rule} /> : null}
    </div>
  );
}

/** Révélation au scroll : fondu + translation, une seule fois. */
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
      transition={{ duration: 1.0, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Bouton principal bleu / jaune, flèche animée. */
function PrimaryButton({
  children,
  onClick,
  filled = true,
  type = 'button',
  yellow = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  filled?: boolean;
  type?: 'button' | 'submit';
  yellow?: boolean;
}) {
  const [hover, setHover] = useState(false);
  const bg = yellow
    ? hover
      ? C.yellowLight
      : C.yellow
    : filled
    ? hover
      ? C.electricMid
      : C.electric
    : 'transparent';
  const col = yellow ? C.dark : filled ? C.white : C.electric;
  const border = yellow ? C.yellow : C.electric;

  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 10,
    padding: '15px 28px',
    fontFamily: SANS,
    fontSize: 14,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    fontWeight: 700,
    cursor: 'pointer',
    border: `2px solid ${border}`,
    background: bg,
    color: col,
    transition: 'all .4s cubic-bezier(.16,1,.3,1)',
    transform: hover ? 'translateY(-2px)' : 'none',
    boxShadow: hover
      ? yellow
        ? '0 12px 32px -10px rgba(245,197,24,0.5)'
        : '0 12px 32px -10px rgba(0,59,142,0.5)'
      : 'none',
  };
  return (
    <button
      type={type}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={base}
    >
      {children}
      <ArrowRight
        size={16}
        style={{
          transform: hover ? 'translateX(5px)' : 'none',
          transition: 'transform .4s cubic-bezier(.16,1,.3,1)',
        }}
      />
    </button>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   Navigation
   ════════════════════════════════════════════════════════════════════════════ */
function Nav() {
  const [solid, setSolid] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  React.useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: 'Services', href: '#services' },
    { label: 'Réalisations', href: '#projets' },
    { label: 'Processus', href: '#processus' },
    { label: 'Avis', href: '#avis' },
    { label: 'Urgence', href: '#urgence' },
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
    padding: solid ? '14px clamp(20px,5vw,60px)' : '22px clamp(20px,5vw,60px)',
    background: solid ? 'rgba(30,30,46,0.95)' : 'transparent',
    backdropFilter: solid ? 'blur(16px) saturate(130%)' : 'none',
    WebkitBackdropFilter: solid ? 'blur(16px) saturate(130%)' : 'none',
    borderBottom: solid
      ? `1px solid rgba(245,197,24,0.18)`
      : '1px solid transparent',
    transition: 'all .5s cubic-bezier(.16,1,.3,1)',
  };
  const brand: React.CSSProperties = {
    fontFamily: SERIF,
    fontSize: 20,
    letterSpacing: '0.12em',
    color: C.white,
    textTransform: 'uppercase',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  };

  return (
    <>
      <nav style={bar}>
      <div style={brand}>
        {fd?.logoBase64 ? (
          // Client logo (uploaded in the brief) replaces the placeholder mark —
          // essential for the client to recognise their brand in the render.
          <img
            src={fd.logoBase64}
            alt={fd?.businessName ?? 'logo'}
            style={{ height: 28, maxWidth: 160, objectFit: 'contain', display: 'block' }}
          />
        ) : (
          <>
            <Zap size={22} color={C.yellow} strokeWidth={2} />
            Électricité&nbsp;Dumont
          </>
        )}
      </div>
      <div
        style={{ display: 'flex', alignItems: 'center', gap: 'clamp(16px,2.2vw,34px)' }}
        className="r277-navlinks"
      >
        {links.map((l) => (
          <NavLink key={l.label} label={l.label} href={l.href} />
        ))}
      </div>
      <a href="#devis" style={{ textDecoration: 'none' }} className="r277-navcta">
        <PrimaryButton yellow>Devis gratuit</PrimaryButton>
      </a>
      
        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="r277-burger"
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
        @media (max-width: 860px){
          .r277-navlinks{ display:none !important; }
          .r277-burger { display: flex !important; flex-direction: column; }
          .r277-navcta{ display:none !important; }
        }
      `}</style>
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
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        fontWeight: 600,
        color: h ? C.yellow : C.white,
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
          height: 2,
          width: h ? '100%' : '0%',
          background: C.yellow,
          transition: 'width .4s cubic-bezier(.16,1,.3,1)',
        }}
      />
    </a>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   1 · HERO SECTION
   ════════════════════════════════════════════════════════════════════════════ */
function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);
  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '-40%']);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const section: React.CSSProperties = {
    position: 'relative',
    height: '100dvh',
    minHeight: 640,
    overflow: 'hidden',
    background: C.electricDeep,
  };

  return (
    <section id="hero" ref={ref} style={section}>
      {/* Fond tableau électrique */}
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
          src={PHOTO.panel}
          alt="Tableau électrique — Électricité Dumont Paris"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </motion.div>

      {/* Voile gradient bleu profond */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(0,42,102,0.70) 0%, rgba(0,42,102,0.35) 40%, rgba(0,42,102,0.72) 70%, rgba(0,42,102,0.96) 100%)',
        }}
      />
      {/* Voile radial droite */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(140% 90% at 80% 20%, transparent 35%, rgba(0,20,60,0.55) 100%)',
          mixBlendMode: 'multiply',
        }}
      />

      {/* Ligne décorative jaune gauche */}
      <div
        style={{
          position: 'absolute',
          left: 'clamp(20px,5vw,60px)',
          top: 0,
          bottom: 0,
          width: 3,
          background: `linear-gradient(to bottom, transparent, ${C.yellow}, transparent)`,
          opacity: 0.6,
        }}
      />

      {/* Contenu héro */}
      <motion.div
        style={{
          position: 'relative',
          zIndex: 2,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '0 clamp(24px,8vw,120px)',
          y: titleY,
          opacity: titleOpacity,
        }}
      >
        <Reveal y={20}>
          <Eyebrow color={C.yellow}>
            Électricien certifié · Paris 11e & Île-de-France
          </Eyebrow>
        </Reveal>

        <motion.h1
          initial={{ opacity: 0, y: 44 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3, ease: EASE, delay: 0.14 }}
          style={{
            fontFamily: SERIF,
            fontWeight: 700,
            color: C.white,
            fontSize: 'clamp(52px, 8.5vw, 130px)',
            lineHeight: 0.94,
            letterSpacing: '-0.01em',
            margin: '28px 0 20px',
            textShadow: '0 8px 50px rgba(0,0,0,0.5)',
            textTransform: 'uppercase',
            maxWidth: 900,
          }}
        >
          L&apos;électricité{' '}
          <span style={{ color: C.yellow }}>sans</span>
          <br />
          compromis
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.42 }}
          style={{
            fontFamily: SANS,
            fontSize: 'clamp(17px, 2vw, 22px)',
            color: 'rgba(255,255,255,0.88)',
            maxWidth: 520,
            lineHeight: 1.6,
            fontWeight: 400,
            marginBottom: 12,
          }}
        >
          Installation, rénovation, mise aux normes NFC 15-100, domotique.
          Intervention 7j/7 sur Paris et l&apos;Île-de-France.
        </motion.p>

        {/* Badges urgence */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, ease: EASE, delay: 0.62 }}
          style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 36 }}
        >
          {['7j/7 · 24h/24', 'Devis gratuit', 'Qualifelec RGE'].map((badge) => (
            <span
              key={badge}
              style={{
                fontFamily: SANS,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: C.dark,
                background: C.yellow,
                padding: '6px 14px',
              }}
            >
              {badge}
            </span>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.78 }}
          style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}
        >
          <a href="#devis" style={{ textDecoration: 'none' }}>
            <PrimaryButton yellow>Devis gratuit en ligne</PrimaryButton>
          </a>
          <a href="#urgence" style={{ textDecoration: 'none' }}>
            <PrimaryButton filled={false}>
              <Phone size={15} />
              Urgence 24h
            </PrimaryButton>
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: 32,
          left: '50%',
          transform: 'translateX(-50%)',
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
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.65)',
            fontWeight: 600,
          }}
        >
          Découvrir
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.0, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={20} color={C.yellow} strokeWidth={2} />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   2 · SCROLL CROSSFADE — 320vh sticky, 3 visuels
   ════════════════════════════════════════════════════════════════════════════ */
type CrossfadeChapter = {
  src: string;
  alt: string;
  index: string;
  caption: string;
  sub: string;
  icon: React.ReactNode;
};

const CROSSFADE_CHAPTERS: CrossfadeChapter[] = [
  {
    src: PHOTO.panel,
    alt: 'Installation de tableau électrique par Électricité Dumont',
    index: '01',
    caption: 'Installation tableau',
    sub: 'Tableaux divisionnaires, disjoncteurs différentiels, mise en sécurité complète.',
    icon: <Zap size={28} color={C.yellow} strokeWidth={2} />,
  },
  {
    src: PHOTO.wiring,
    alt: 'Câblage électrique professionnel',
    index: '02',
    caption: 'Câblage & rénovation',
    sub: 'Passage de câbles, goulotte, encastrement : chaque fil posé avec précision.',
    icon: <Wrench size={28} color={C.yellow} strokeWidth={2} />,
  },
  {
    src: PHOTO.domotique,
    alt: 'Installation domotique et maison connectée',
    index: '03',
    caption: 'Domotique connectée',
    sub: 'Volets, éclairage, thermostats, prises USB-C — votre maison obéit à votre smartphone.',
    icon: <Wifi size={28} color={C.yellow} strokeWidth={2} />,
  },
];

function CrossfadeImage({
  chapter,
  i,
  total,
  progress,
}: {
  chapter: CrossfadeChapter;
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
  const scale = useTransform(progress, [start - fadeIn, end], [1.12, 1.0]);

  return (
    <motion.div style={{ position: 'absolute', inset: 0, opacity }}>
      <motion.img
        src={chapter.src}
        alt={chapter.alt}
        loading="lazy"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          scale,
        }}
      />
    </motion.div>
  );
}

function CrossfadeCaption({
  chapter,
  i,
  total,
  progress,
}: {
  chapter: CrossfadeChapter;
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
  const y = useTransform(progress, [start, end], [32, -32]);

  return (
    <motion.div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '0 24px',
        opacity,
        y,
      }}
    >
      <div style={{ marginBottom: 16 }}>{chapter.icon}</div>
      <span
        style={{
          fontFamily: SERIF,
          fontSize: 'clamp(60px, 12vw, 160px)',
          color: 'rgba(245,197,24,0.18)',
          lineHeight: 1,
          letterSpacing: '-0.02em',
          fontWeight: 700,
          marginBottom: 4,
          textTransform: 'uppercase',
        }}
      >
        {chapter.index}
      </span>
      <h2
        style={{
          fontFamily: SERIF,
          fontSize: 'clamp(38px, 6.5vw, 90px)',
          fontWeight: 700,
          color: C.white,
          lineHeight: 1,
          margin: 0,
          textTransform: 'uppercase',
          textShadow: '0 6px 40px rgba(0,0,0,0.6)',
        }}
      >
        {chapter.caption}
      </h2>
      <p
        style={{
          fontFamily: SANS,
          fontSize: 'clamp(15px, 1.7vw, 20px)',
          color: 'rgba(255,255,255,0.84)',
          marginTop: 18,
          maxWidth: 480,
          lineHeight: 1.6,
        }}
      >
        {chapter.sub}
      </p>
    </motion.div>
  );
}

function ScrollCrossfade() {
  const n = CROSSFADE_CHAPTERS.length;
  const progress = useMotionValue(0.5 / n);
  const [active, setActive] = useState(0);
  const goTo = (i: number) => {
    setActive(i);
    progress.set((i + 0.5) / n);
  };

  return (
    <section
      style={{ height: '100dvh', overflow: 'hidden', position: 'relative', background: C.electricDeep }}
    >
      <div
        style={{
          position: 'relative',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {CROSSFADE_CHAPTERS.map((c, i) => (
          <CrossfadeImage
            key={c.index}
            chapter={c}
            i={i}
            total={CROSSFADE_CHAPTERS.length}
            progress={progress}
          />
        ))}
        {/* voile de lisibilité */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to bottom, rgba(0,42,102,0.40), rgba(0,42,102,0.14) 40%, rgba(0,42,102,0.70))',
          }}
        />
        {CROSSFADE_CHAPTERS.map((c, i) => (
          <CrossfadeCaption
            key={c.index}
            chapter={c}
            i={i}
            total={CROSSFADE_CHAPTERS.length}
            progress={progress}
          />
        ))}

        {/* Progress dots */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 10,
            alignItems: 'center',
          }}
        >
          {CROSSFADE_CHAPTERS.map((c, i) => (
            <CrossfadeDot
              key={c.index}
              i={i}
              total={CROSSFADE_CHAPTERS.length}
              progress={progress}
            />
          ))}
        </div>
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
    </section>
  );
}

function CrossfadeDot({
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
    [0.3, 1, 1, 0.3],
  );
  const width = useTransform(progress, [i * seg, (i + 1) * seg], [10, 36]);
  return (
    <motion.div
      style={{ height: 3, width, background: C.yellow, opacity, borderRadius: 2 }}
    />
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   3 · SERVICES SECTION
   ════════════════════════════════════════════════════════════════════════════ */
type Service = {
  icon: React.ReactNode;
  title: string;
  sub: string;
  items: string[];
};

const SERVICES: Service[] = [
  {
    icon: <Zap size={34} color={C.yellow} strokeWidth={1.8} />,
    title: 'Installation électrique',
    sub: 'Du tableau au point lumineux, chaque installation est réalisée selon les règles de l’art.',
    items: [
      'Tableau divisionnaire neuf ou remplacement',
      'Circuits dédiés (four, lave-linge, AC)',
      'Prises, interrupteurs, luminaires',
      'Éclairage LED sur mesure',
    ],
  },
  {
    icon: <Shield size={34} color={C.yellow} strokeWidth={1.8} />,
    title: 'Mise aux normes NFC 15-100',
    sub: 'Votre installation mise en conformité pour la vente, la location ou la tranquillité d’esprit.',
    items: [
      'Diagnostic complet de l’installation',
      'Mise aux normes NFC 15-100',
      'Attestation de conformité CONSUEL',
      'Rapport détaillé remis à l’issue',
    ],
  },
  {
    icon: <Wifi size={34} color={C.yellow} strokeWidth={1.8} />,
    title: 'Domotique & connecté',
    sub: 'Pilotez votre habitat depuis votre smartphone : confort, sécurité et économies d’énergie.',
    items: [
      'Volets roulants motorisés',
      'Éclairage connecté (Philips Hue, KNX)',
      'Thermostat intelligent',
      'Prises USB-C & bornes de recharge',
    ],
  },
];

function ServiceCard({ s, i }: { s: Service; i: number }) {
  const [hover, setHover] = useState(false);
  const card: React.CSSProperties = {
    background: hover ? C.electricDeep : C.dark,
    border: `2px solid ${hover ? C.yellow : 'rgba(245,197,24,0.18)'}`,
    padding: 'clamp(30px,4vw,48px)',
    transition: 'all .5s cubic-bezier(.16,1,.3,1)',
    transform: hover ? 'translateY(-10px)' : 'none',
    boxShadow: hover
      ? '0 32px 64px -24px rgba(0,0,0,0.6)'
      : '0 8px 30px -20px rgba(0,0,0,0.4)',
    cursor: 'default',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  };
  return (
    <Reveal delay={i * 0.1} style={{ height: '100%' }}>
      <div
        style={card}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div
          style={{
            width: 64,
            height: 64,
            background: hover ? 'rgba(245,197,24,0.18)' : 'rgba(245,197,24,0.10)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 24,
            transition: 'background .4s',
          }}
        >
          {s.icon}
        </div>
        <h3
          style={{
            fontFamily: SERIF,
            fontSize: 'clamp(22px, 2.4vw, 30px)',
            fontWeight: 700,
            color: C.white,
            textTransform: 'uppercase',
            margin: '0 0 14px',
            lineHeight: 1.1,
          }}
        >
          {s.title}
        </h3>
        <p
          style={{
            fontFamily: SANS,
            fontSize: 16,
            lineHeight: 1.65,
            color: 'rgba(255,255,255,0.72)',
            margin: '0 0 24px',
            flex: 1,
          }}
        >
          {s.sub}
        </p>
        <ul
          style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          {s.items.map((it) => (
            <li
              key={it}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                fontFamily: SANS,
                fontSize: 14.5,
                color: 'rgba(255,255,255,0.8)',
                lineHeight: 1.5,
              }}
            >
              <CheckCircle
                size={16}
                color={C.yellow}
                strokeWidth={2}
                style={{ flexShrink: 0, marginTop: 2 }}
              />
              {it}
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}

function ServicesSection() {
  const sec: React.CSSProperties = {
    background: C.dark,
    padding: 'clamp(90px,13vw,180px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(290px, 100%), 1fr))',
    gap: 'clamp(20px, 2.8vw, 36px)',
    maxWidth: 1240,
    margin: '0 auto',
  };
  return (
    <section style={sec} id="services">
      <div style={{ maxWidth: 1240, margin: '0 auto 60px' }}>
        <Reveal>
          <Eyebrow>Nos prestations</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(36px, 5.5vw, 74px)',
              fontWeight: 700,
              color: C.white,
              margin: '18px 0 0',
              lineHeight: 1.0,
              textTransform: 'uppercase',
              maxWidth: 760,
            }}
          >
            3 expertises,{' '}
            <span style={{ color: C.yellow }}>1 interlocuteur</span>
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
   4 · PROCESS SECTION — sticky photo + 4 étapes
   ════════════════════════════════════════════════════════════════════════════ */
type Step = {
  num: string;
  icon: React.ReactNode;
  title: string;
  body: string;
};

const STEPS: Step[] = [
  {
    num: '01',
    icon: <ClipboardList size={22} color={C.yellow} strokeWidth={2} />,
    title: 'Visite diagnostic',
    body: 'Déplacement gratuit sur Paris & petite couronne. Nous évaluons l’état de votre installation, identifions les risques et mesurons vos besoins en présence.',
  },
  {
    num: '02',
    icon: <FileCheck size={22} color={C.yellow} strokeWidth={2} />,
    title: 'Devis détaillé',
    body: 'Chiffrage précis poste par poste, remis sous 24h. Pas de mauvaise surprise : le devis est ferme et inclut la main d’œuvre, les matériaux et les frais de déplacement.',
  },
  {
    num: '03',
    icon: <Wrench size={22} color={C.yellow} strokeWidth={2} />,
    title: 'Intervention certifiée',
    body: 'Nos techniciens Qualifelec interviennent aux dates convenues. Chantier propre, câbles étiquetés, travaux réalisés conformément aux normes NFC 15-100 en vigueur.',
  },
  {
    num: '04',
    icon: <Award size={22} color={C.yellow} strokeWidth={2} />,
    title: 'CONSUEL & attestation',
    body: 'En fin de chantier, nous accompagnons l’obtention du visa CONSUEL et remettons l’attestation de conformité, indispensable pour Enedis ou la mise en vente.',
  },
];

function ProcessSection() {
  const sec: React.CSSProperties = {
    background: C.electricDeep,
    padding: 'clamp(90px,13vw,170px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 'clamp(36px,6vw,100px)',
    maxWidth: 1240,
    margin: '0 auto',
    alignItems: 'start',
  };
  const sticky: React.CSSProperties = {
    position: 'sticky',
    top: 88,
    alignSelf: 'start',
  };

  return (
    <section style={sec} id="processus">
      <div style={grid} className="r277-process">
        {/* Photo sticky */}
        <div style={sticky} className="r277-process-sticky">
          <div
            style={{
              position: 'relative',
              overflow: 'hidden',
              aspectRatio: '4 / 5',
              border: `3px solid rgba(245,197,24,0.25)`,
            }}
          >
            <img
              src={PHOTO.worker}
              alt="Électricien Dumont au travail — Paris"
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            {/* Badge numéro urgence */}
            <div
              style={{
                position: 'absolute',
                bottom: 20,
                left: 20,
                right: 20,
                background: C.yellow,
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <Phone size={18} color={C.dark} strokeWidth={2} />
              <div>
                <div
                  style={{
                    fontFamily: SERIF,
                    fontSize: 20,
                    fontWeight: 700,
                    color: C.dark,
                    letterSpacing: '0.04em',
                  }}
                >
                  01 23 45 67 89
                </div>
                <div
                  style={{
                    fontFamily: SANS,
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: C.electricDeep,
                    marginTop: 2,
                  }}
                >
                  Urgence 24h/7j
                </div>
              </div>
            </div>
          </div>
          <div style={{ marginTop: 22 }}>
            <Eyebrow color={C.yellow}>Notre méthode</Eyebrow>
            <p
              style={{
                fontFamily: SANS,
                fontSize: 16,
                lineHeight: 1.65,
                color: 'rgba(255,255,255,0.68)',
                marginTop: 12,
              }}
            >
              De la visite diagnostic jusqu’à l’attestation CONSUEL, un seul électricien
              référent pilote votre chantier de A à Z.
            </p>
          </div>
        </div>

        {/* Étapes */}
        <div>
          <Reveal>
            <Eyebrow color={C.yellow}>Comment ça se passe</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(34px, 5vw, 64px)',
                fontWeight: 700,
                color: C.white,
                margin: '18px 0 52px',
                lineHeight: 1.0,
                textTransform: 'uppercase',
              }}
            >
              4 étapes,{' '}
              <span style={{ color: C.yellow }}>zéro stress</span>
            </h2>
          </Reveal>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {STEPS.map((step, i) => (
              <Reveal key={step.num} delay={0.06 * i}>
                <div
                  style={{
                    padding: '32px 0',
                    borderTop: `1px solid rgba(245,197,24,0.18)`,
                    display: 'flex',
                    gap: 24,
                  }}
                >
                  <div
                    style={{
                      minWidth: 48,
                      height: 48,
                      background: C.yellow,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {step.icon}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                      <span
                        style={{
                          fontFamily: SERIF,
                          fontSize: 13,
                          fontWeight: 700,
                          color: 'rgba(245,197,24,0.55)',
                          letterSpacing: '0.1em',
                        }}
                      >
                        {step.num}
                      </span>
                      <h3
                        style={{
                          fontFamily: SERIF,
                          fontSize: 'clamp(20px, 2vw, 26px)',
                          fontWeight: 700,
                          color: C.white,
                          margin: 0,
                          textTransform: 'uppercase',
                        }}
                      >
                        {step.title}
                      </h3>
                    </div>
                    <p
                      style={{
                        fontFamily: SANS,
                        fontSize: 15.5,
                        lineHeight: 1.7,
                        color: 'rgba(255,255,255,0.70)',
                        margin: 0,
                      }}
                    >
                      {step.body}
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
          .r277-process{ grid-template-columns: 1fr !important; }
          .r277-process-sticky{ position: static !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   5 · TESTIMONIALS SECTION — 3 avis clients
   ════════════════════════════════════════════════════════════════════════════ */
type Testimonial = { quote: string; name: string; job: string; travaux: string };

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'Intervention rapide après une panne de tableau. M. Dumont a tout réparé en 2 heures, proprement, avec un devis respecté à l’euro. Je recommande sans hésiter à tous mes voisins du 11e.',
    name: 'Sophie Marchand',
    job: 'Propriétaire — Paris 11e',
    travaux: 'Remplacement tableau + mise aux normes',
  },
  {
    quote:
      'Rénovation électrique complète de mon appartement haussmannien. Câblage impeccable, suivi rigoureux, CONSUEL obtenu sans accroc. Un artisan sérieux qui respecte les délais et les budgets.',
    name: 'Thomas Leclerc',
    job: 'Propriétaire — Paris 10e',
    travaux: 'Rénovation complète 85 m²',
  },
  {
    quote:
      'Installation domotique KNX dans notre villa. M. Dumont maîtrise aussi bien l’électricité traditionnelle que les systèmes connectés. Résultat bluffant, économies d’énergie au rendez-vous.',
    name: 'Isabelle & Renaud Faure',
    job: 'Propriétaires — Vincennes',
    travaux: 'Domotique complète + borne IRVE',
  },
];

function TestimonialCard({ t, i }: { t: Testimonial; i: number }) {
  const card: React.CSSProperties = {
    background: C.white,
    border: `1px solid ${C.grayMid}`,
    padding: 'clamp(28px,3.6vw,44px)',
    boxShadow: '0 16px 48px -30px rgba(0,59,142,0.18)',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    boxSizing: 'border-box',
  };
  return (
    <Reveal delay={i * 0.1} style={{ height: '100%' }}>
      <figure style={card} role="figure">
        <Quote size={30} color={C.electric} strokeWidth={1.4} />
        <div style={{ display: 'flex', gap: 4, margin: '14px 0 12px' }}>
          {Array.from({ length: 5 }).map((_, s) => (
            <Star key={s} size={14} fill={C.yellow} color={C.yellow} strokeWidth={0} />
          ))}
        </div>
        <blockquote
          style={{
            fontFamily: SANS,
            fontSize: 'clamp(16px, 1.7vw, 18px)',
            lineHeight: 1.68,
            color: C.ink,
            margin: '0 0 20px',
            flex: 1,
            fontWeight: 400,
          }}
        >
          &ldquo;{t.quote}&rdquo;
        </blockquote>
        <div
          style={{
            fontFamily: SANS,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: C.electric,
            marginBottom: 10,
            background: 'rgba(0,59,142,0.07)',
            padding: '5px 10px',
            display: 'inline-block',
          }}
        >
          {t.travaux}
        </div>
        <figcaption
          style={{
            borderTop: `1px solid ${C.grayMid}`,
            paddingTop: 16,
            marginTop: 6,
          }}
        >
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 18,
              fontWeight: 700,
              color: C.dark,
              textTransform: 'uppercase',
            }}
          >
            {t.name}
          </div>
          <div
            style={{
              fontFamily: SANS,
              fontSize: 12,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'rgba(30,30,46,0.5)',
              marginTop: 5,
            }}
          >
            {t.job}
          </div>
        </figcaption>
      </figure>
    </Reveal>
  );
}

function TestimonialsSection() {
  const sec: React.CSSProperties = {
    background: C.gray,
    padding: 'clamp(90px,13vw,170px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))',
    gap: 'clamp(20px, 2.8vw, 32px)',
    maxWidth: 1240,
    margin: '0 auto',
  };
  return (
    <section style={sec} id="avis">
      <div style={{ maxWidth: 1240, margin: '0 auto 56px', textAlign: 'center' }}>
        <Reveal>
          <Eyebrow color={C.electric} align="center">
            Avis clients
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(34px, 5vw, 66px)',
              fontWeight: 700,
              color: C.dark,
              margin: '18px 0 0',
              textTransform: 'uppercase',
              lineHeight: 1.05,
            }}
          >
            Ils nous font{' '}
            <span style={{ color: C.electric }}>confiance</span>
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
   6 · DEVIS FORM SECTION
   ════════════════════════════════════════════════════════════════════════════ */
function DevisFormSection() {
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [typeWork, setTypeWork] = useState('');
  const [surface, setSurface] = useState('');
  const [tel, setTel] = useState('');
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prenom || !nom || !typeWork || !tel) return;
    setSent(true);
  };

  const sec: React.CSSProperties = {
    position: 'relative',
    background: C.electric,
    padding: 'clamp(90px,13vw,170px) clamp(24px,6vw,96px)',
    overflow: 'hidden',
  };

  const fieldBase: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.22)',
    borderBottom: `2px solid rgba(245,197,24,0.55)`,
    padding: '14px 16px',
    fontFamily: SANS,
    fontSize: 16,
    color: C.white,
    outline: 'none',
    transition: 'border-color .3s',
  };
  const labelStyle: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    color: 'rgba(245,197,24,0.9)',
    display: 'block',
    marginBottom: 6,
  };

  return (
    <section style={sec} id="devis">
      {/* Pattern de fond */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(255,255,255,0.03) 39px, rgba(255,255,255,0.03) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(255,255,255,0.03) 39px, rgba(255,255,255,0.03) 40px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: 820,
          margin: '0 auto',
        }}
      >
        <Reveal>
          <Eyebrow color={C.yellow} align="center">
            Demande de devis
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(36px,5.5vw,72px)',
              fontWeight: 700,
              color: C.white,
              margin: '18px 0 14px',
              lineHeight: 1.0,
              textAlign: 'center',
              textTransform: 'uppercase',
            }}
          >
            Votre devis{' '}
            <span style={{ color: C.yellow }}>gratuit</span>
          </h2>
        </Reveal>
        <Reveal delay={0.14}>
          <p
            style={{
              fontFamily: SANS,
              fontSize: 17,
              lineHeight: 1.65,
              color: 'rgba(255,255,255,0.80)',
              textAlign: 'center',
              maxWidth: 540,
              margin: '0 auto 48px',
            }}
          >
            Remplissez ce formulaire, nous vous contactons sous 2h en jours ouvrés
            pour convenir d&apos;une visite diagnostic sans engagement.
          </p>
        </Reveal>

        {sent ? (
          <Reveal>
            <div
              style={{
                border: `2px solid ${C.yellow}`,
                background: 'rgba(245,197,24,0.08)',
                padding: 'clamp(36px,5vw,56px)',
                textAlign: 'center',
              }}
            >
              <CheckCircle size={48} color={C.yellow} strokeWidth={1.5} style={{ margin: '0 auto' }} />
              <h3
                style={{
                  fontFamily: SERIF,
                  fontSize: 32,
                  fontWeight: 700,
                  color: C.white,
                  margin: '18px 0 10px',
                  textTransform: 'uppercase',
                }}
              >
                Merci {prenom} !
              </h3>
              <p
                style={{
                  fontFamily: SANS,
                  fontSize: 17,
                  color: 'rgba(255,255,255,0.78)',
                  margin: 0,
                  lineHeight: 1.65,
                }}
              >
                Votre demande pour{' '}
                <strong style={{ color: C.yellow }}>
                  {typeWork}
                  {surface ? ` (${surface} m²)` : ''}
                </strong>{' '}
                a bien été reçue. Nous vous rappelons au{' '}
                <strong style={{ color: C.yellow }}>{tel}</strong> sous 2h.
              </p>
            </div>
          </Reveal>
        ) : (
          <Reveal delay={0.2}>
            <form
              onSubmit={onSubmit}
              style={{ display: 'flex', flexDirection: 'column', gap: 28 }}
            >
              <div
                style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}
                className="r277-form-row"
              >
                <div>
                  <label htmlFor="d277-prenom" style={labelStyle}>
                    Prénom *
                  </label>
                  <input
                    id="d277-prenom"
                    style={fieldBase}
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    placeholder="Marie"
                    autoComplete="given-name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="d277-nom" style={labelStyle}>
                    Nom *
                  </label>
                  <input
                    id="d277-nom"
                    style={fieldBase}
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    placeholder="Dupont"
                    autoComplete="family-name"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="d277-type" style={labelStyle}>
                  Type de travaux *
                </label>
                <select
                  id="d277-type"
                  style={{
                    ...fieldBase,
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    cursor: 'pointer',
                    color: typeWork ? C.white : 'rgba(255,255,255,0.45)',
                  }}
                  value={typeWork}
                  onChange={(e) => setTypeWork(e.target.value)}
                  required
                >
                  <option value="" style={{ color: '#000' }}>
                    Sélectionnez une prestation…
                  </option>
                  <option value="Installation électrique" style={{ color: '#000' }}>
                    Installation électrique
                  </option>
                  <option value="Rénovation complète" style={{ color: '#000' }}>
                    Rénovation complète
                  </option>
                  <option value="Mise aux normes NFC 15-100" style={{ color: '#000' }}>
                    Mise aux normes NFC 15-100
                  </option>
                  <option value="Dépannage urgent" style={{ color: '#000' }}>
                    Dépannage urgent
                  </option>
                  <option value="Domotique & connecté" style={{ color: '#000' }}>
                    Domotique &amp; connecté
                  </option>
                </select>
              </div>

              <div
                style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}
                className="r277-form-row"
              >
                <div>
                  <label htmlFor="d277-surface" style={labelStyle}>
                    Surface (m²)
                  </label>
                  <input
                    id="d277-surface"
                    style={fieldBase}
                    value={surface}
                    onChange={(e) => setSurface(e.target.value)}
                    placeholder="ex : 65"
                    type="number"
                    min="1"
                  />
                </div>
                <div>
                  <label htmlFor="d277-tel" style={labelStyle}>
                    Téléphone *
                  </label>
                  <input
                    id="d277-tel"
                    style={fieldBase}
                    value={tel}
                    onChange={(e) => setTel(e.target.value)}
                    placeholder="06 12 34 56 78"
                    type="tel"
                    autoComplete="tel"
                    required
                  />
                </div>
              </div>

              <div style={{ marginTop: 8, textAlign: 'center' }}>
                <PrimaryButton type="submit" yellow>
                  Envoyer ma demande
                </PrimaryButton>
              </div>
            </form>
          </Reveal>
        )}
      </div>
      <style>{`
        @media (max-width: 860px){
          .r277-form-row{ grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   7 · CERTIFICATIONS SECTION — 4 badges qualifications
   ════════════════════════════════════════════════════════════════════════════ */
type Certification = {
  abbr: string;
  title: string;
  body: string;
  icon: React.ReactNode;
};

const CERTIFICATIONS: Certification[] = [
  {
    abbr: 'Qualifelec',
    title: 'Qualifelec RGE',
    body: 'Qualification reconnue de l’État pour les installations électriques résidentielles et tertiaires.',
    icon: <Award size={28} color={C.yellow} strokeWidth={1.8} />,
  },
  {
    abbr: 'RGE',
    title: 'Reconnu Garant Environnement',
    body: 'Éligibilité MaPrimeRénov’ et CEE pour vos travaux d’efficacité énergétique.',
    icon: <Shield size={28} color={C.yellow} strokeWidth={1.8} />,
  },
  {
    abbr: 'CONSUEL',
    title: 'Habilitation CONSUEL',
    body: 'Délivrance de l’attestation de conformité, indispensable pour le raccordement Enedis.',
    icon: <FileCheck size={28} color={C.yellow} strokeWidth={1.8} />,
  },
  {
    abbr: 'Décennale',
    title: 'Assurance décennale',
    body: 'Garantie 10 ans sur tous les travaux réalisés. Attestation fournie systématiquement.',
    icon: <CheckCircle size={28} color={C.yellow} strokeWidth={1.8} />,
  },
];

function CertificationBadge({ c, i }: { c: Certification; i: number }) {
  const [hover, setHover] = useState(false);
  const badge: React.CSSProperties = {
    background: hover ? C.electricMid : C.electricDeep,
    border: `2px solid ${hover ? C.yellow : 'rgba(245,197,24,0.22)'}`,
    padding: 'clamp(24px,3vw,36px)',
    transition: 'all .45s cubic-bezier(.16,1,.3,1)',
    transform: hover ? 'translateY(-8px)' : 'none',
    boxShadow: hover ? '0 24px 50px -18px rgba(0,0,0,0.55)' : 'none',
    cursor: 'default',
    textAlign: 'center',
  };
  return (
    <Reveal delay={i * 0.08}>
      <div
        style={badge}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div
          style={{
            width: 60,
            height: 60,
            background: hover ? 'rgba(245,197,24,0.22)' : 'rgba(245,197,24,0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            transition: 'background .4s',
          }}
        >
          {c.icon}
        </div>
        <div
          style={{
            fontFamily: SERIF,
            fontSize: 'clamp(12px, 1.4vw, 15px)',
            fontWeight: 700,
            color: C.yellow,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            marginBottom: 6,
          }}
        >
          {c.abbr}
        </div>
        <h3
          style={{
            fontFamily: SERIF,
            fontSize: 'clamp(18px, 1.8vw, 22px)',
            fontWeight: 700,
            color: C.white,
            margin: '0 0 12px',
            textTransform: 'uppercase',
            lineHeight: 1.15,
          }}
        >
          {c.title}
        </h3>
        <p
          style={{
            fontFamily: SANS,
            fontSize: 14.5,
            lineHeight: 1.6,
            color: 'rgba(255,255,255,0.68)',
            margin: 0,
          }}
        >
          {c.body}
        </p>
      </div>
    </Reveal>
  );
}

function CertificationsSection() {
  const sec: React.CSSProperties = {
    background: C.dark,
    padding: 'clamp(80px,12vw,160px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(220px, 100%), 1fr))',
    gap: 'clamp(16px,2.4vw,28px)',
    maxWidth: 1200,
    margin: '0 auto',
  };
  return (
    <section style={sec} id="certifications">
      <div style={{ maxWidth: 1200, margin: '0 auto 52px', textAlign: 'center' }}>
        <Reveal>
          <Eyebrow color={C.yellow} align="center">
            Qualifications & garanties
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(32px, 4.8vw, 62px)',
              fontWeight: 700,
              color: C.white,
              margin: '18px 0 0',
              textTransform: 'uppercase',
              lineHeight: 1.05,
            }}
          >
            Certifié,{' '}
            <span style={{ color: C.yellow }}>assuré, garanti</span>
          </h2>
        </Reveal>
      </div>
      <div style={grid}>
        {CERTIFICATIONS.map((c, i) => (
          <CertificationBadge key={c.abbr} c={c} i={i} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   8 · PROJECTS SECTION — 3 réalisations récentes
   ════════════════════════════════════════════════════════════════════════════ */
type Project = {
  img: string;
  alt: string;
  tag: string;
  title: string;
  desc: string;
  detail: string;
  icon: React.ReactNode;
};

const PROJECTS: Project[] = [
  {
    img: PHOTO.haussmann,
    alt: 'Rénovation électrique appartement haussmannien Paris',
    tag: 'Rénovation complète',
    title: 'Appartement haussmannien',
    desc: 'Rénovation électrique intégrale d’un 120 m² de 1890. Remplacement du tableau, passage de 42 circuits neufs, pose de 110 points lumineux, mise aux normes CONSUEL.',
    detail: 'Paris 16e · 120 m² · NFC 15-100 · CONSUEL obtenu',
    icon: <Home size={18} color={C.yellow} strokeWidth={2} />,
  },
  {
    img: PHOTO.villa,
    alt: 'Villa connectée domotique installation',
    tag: 'Domotique complète',
    title: 'Villa connectée',
    desc: 'Installation KNX sur 240 m² : volets, éclairage scénarisé, thermostat multi-zones, borne IRVE 22 kW. Pilotage depuis un seul smartphone pour toute la famille.',
    detail: 'Vincennes · 240 m² · KNX · IRVE 22 kW',
    icon: <Smartphone size={18} color={C.yellow} strokeWidth={2} />,
  },
  {
    img: PHOTO.commercial,
    alt: 'Local commercial mise aux normes électrique',
    tag: 'Local commercial',
    title: 'Local commercial',
    desc: 'Mise aux normes ERP d’un restaurant de 180 m². Tableau TGBT, éclairage de sécurité, prises cuisson, extraction ventilée. Ouverture respectée grâce à une intervention en 4 jours.',
    detail: 'Paris 3e · 180 m² · ERP catégorie 4 · 4 jours',
    icon: <Building2 size={18} color={C.yellow} strokeWidth={2} />,
  },
];

function ProjectCard({ p, i }: { p: Project; i: number }) {
  const [hover, setHover] = useState(false);
  const card: React.CSSProperties = {
    overflow: 'hidden',
    border: `2px solid ${hover ? C.yellow : 'rgba(245,197,24,0.14)'}`,
    transition: 'all .5s cubic-bezier(.16,1,.3,1)',
    transform: hover ? 'translateY(-10px)' : 'none',
    boxShadow: hover
      ? '0 32px 64px -24px rgba(0,0,0,0.65)'
      : '0 8px 28px -18px rgba(0,0,0,0.45)',
    cursor: 'default',
    background: C.dark,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  };
  return (
    <Reveal delay={i * 0.11} style={{ height: '100%' }}>
      <article
        style={card}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '16/10' }}>
          <img
            src={p.img}
            alt={p.alt}
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: hover ? 'scale(1.06)' : 'scale(1)',
              transition: 'transform .9s cubic-bezier(.16,1,.3,1)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to top, rgba(30,30,46,0.90), transparent 50%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 16,
              left: 16,
              background: C.yellow,
              padding: '5px 12px',
              fontFamily: SANS,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: C.dark,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            {p.icon}
            {p.tag}
          </div>
        </div>
        <div style={{ padding: 'clamp(22px,3vw,32px)', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h3
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(20px, 2vw, 26px)',
              fontWeight: 700,
              color: C.white,
              margin: '0 0 12px',
              textTransform: 'uppercase',
            }}
          >
            {p.title}
          </h3>
          <p
            style={{
              fontFamily: SANS,
              fontSize: 15,
              lineHeight: 1.68,
              color: 'rgba(255,255,255,0.70)',
              margin: '0 0 20px',
              flex: 1,
            }}
          >
            {p.desc}
          </p>
          <div
            style={{
              fontFamily: SANS,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: hover ? C.yellow : 'rgba(245,197,24,0.65)',
              transition: 'color .4s',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <ArrowRight size={14} />
            {p.detail}
          </div>
        </div>
      </article>
    </Reveal>
  );
}

function ProjectsSection() {
  const sec: React.CSSProperties = {
    background: C.darkMid,
    padding: 'clamp(90px,13vw,170px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))',
    gap: 'clamp(20px, 2.8vw, 32px)',
    maxWidth: 1240,
    margin: '0 auto',
  };
  return (
    <section style={sec} id="projets">
      <div style={{ maxWidth: 1240, margin: '0 auto 56px' }}>
        <Reveal>
          <Eyebrow color={C.yellow}>Réalisations récentes</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(34px, 5vw, 66px)',
              fontWeight: 700,
              color: C.white,
              margin: '18px 0 0',
              textTransform: 'uppercase',
              lineHeight: 1.02,
              maxWidth: 720,
            }}
          >
            Chantiers <span style={{ color: C.yellow }}>livrés</span>,
            clients <span style={{ color: C.yellow }}>satisfaits</span>
          </h2>
        </Reveal>
      </div>
      <div style={grid}>
        {PROJECTS.map((p, i) => (
          <ProjectCard key={p.title} p={p} i={i} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   9 · URGENCY SECTION — dépannage 24h/7j
   ════════════════════════════════════════════════════════════════════════════ */
function UrgencySection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);

  const sec: React.CSSProperties = {
    position: 'relative',
    minHeight: '80vh',
    display: 'flex',
    alignItems: 'center',
    overflow: 'hidden',
    background: C.dark,
    padding: 'clamp(80px,12vw,160px) clamp(24px,6vw,96px)',
  };

  const zones = ['Paris 75', 'Hauts-de-Seine 92', 'Seine-Saint-Denis 93', 'Val-de-Marne 94'];

  return (
    <section ref={ref} style={sec} id="urgence">
      {/* Fond photo parallaxe */}
      <motion.div
        style={{ position: 'absolute', inset: '-8% 0', height: '116%', y }}
      >
        <img
          src={PHOTO.worker}
          alt="Électricien Dumont — intervention d'urgence Paris"
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }}
        />
      </motion.div>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to right, rgba(0,42,102,0.96) 0%, rgba(0,42,102,0.80) 50%, rgba(0,42,102,0.40) 100%)',
        }}
      />

      <div style={{ position: 'relative', zIndex: 2, maxWidth: 680 }}>
        <Reveal>
          <Eyebrow color={C.yellow}>Dépannage d&apos;urgence</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(38px, 6vw, 80px)',
              fontWeight: 700,
              color: C.white,
              margin: '18px 0 18px',
              lineHeight: 1.0,
              textTransform: 'uppercase',
            }}
          >
            Panne ? Coupure ?
            <br />
            <span style={{ color: C.yellow }}>On arrive.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.14}>
          <p
            style={{
              fontFamily: SANS,
              fontSize: 'clamp(16px,1.7vw,20px)',
              lineHeight: 1.65,
              color: 'rgba(255,255,255,0.82)',
              maxWidth: 520,
              marginBottom: 32,
            }}
          >
            Court-circuit, disjoncteur bloqué, prise qui chauffe, compteur coupé :
            nos techniciens interviennent sous 2 heures sur Paris et la petite couronne,
            7 jours sur 7, de 7h à 22h.
          </p>
        </Reveal>

        {/* Numéro d'urgence mis en avant */}
        <Reveal delay={0.2}>
          <a
            href={`tel:${fd?.phone ?? "0123456789"}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 16,
              background: C.yellow,
              padding: 'clamp(16px,2.5vw,22px) clamp(24px,3.5vw,36px)',
              textDecoration: 'none',
              marginBottom: 36,
              transition: 'background .3s',
            }}
          >
            <Phone size={24} color={C.dark} strokeWidth={2} />
            <div>
              <div
                style={{
                  fontFamily: SERIF,
                  fontSize: 'clamp(22px, 2.8vw, 32px)',
                  fontWeight: 700,
                  color: C.dark,
                  letterSpacing: '0.04em',
                }}
              >
                01 23 45 67 89
              </div>
              <div
                style={{
                  fontFamily: SANS,
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.20em',
                  textTransform: 'uppercase',
                  color: C.electricDeep,
                  marginTop: 3,
                }}
              >
                Urgence 24h/7j — Sous 2h
              </div>
            </div>
          </a>
        </Reveal>

        {/* Garanties urgence */}
        <Reveal delay={0.26}>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 36 }}>
            {[
              { icon: <Clock size={16} color={C.yellow} strokeWidth={2} />, text: 'Intervention sous 2h' },
              { icon: <CheckCircle size={16} color={C.yellow} strokeWidth={2} />, text: 'Devis avant intervention' },
              { icon: <Shield size={16} color={C.yellow} strokeWidth={2} />, text: 'Sans majoration cachée' },
            ].map((item) => (
              <div
                key={item.text}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontFamily: SANS,
                  fontSize: 14,
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.86)',
                }}
              >
                {item.icon}
                {item.text}
              </div>
            ))}
          </div>
        </Reveal>

        {/* Zones */}
        <Reveal delay={0.32}>
          <div>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'rgba(245,197,24,0.7)',
                marginBottom: 12,
              }}
            >
              Zones d&apos;intervention
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {zones.map((z) => (
                <span
                  key={z}
                  style={{
                    fontFamily: SANS,
                    fontSize: 12,
                    fontWeight: 600,
                    color: 'rgba(255,255,255,0.80)',
                    border: '1px solid rgba(245,197,24,0.3)',
                    padding: '5px 12px',
                    letterSpacing: '0.08em',
                  }}
                >
                  {z}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   10 · FOOTER SECTION
   ════════════════════════════════════════════════════════════════════════════ */
function FooterSection() {
  const cols: { title: string; items: { label: string; href: string }[] }[] = [
    {
      title: 'Prestations',
      items: [
        { label: 'Installation électrique', href: '#services' },
        { label: 'Mise aux normes NFC 15-100', href: '#services' },
        { label: 'Domotique & connecté', href: '#services' },
        { label: 'Dépannage urgent', href: '#urgence' },
      ],
    },
    {
      title: 'Informations',
      items: [
        { label: 'Notre méthode', href: '#processus' },
        { label: 'Réalisations', href: '#projets' },
        { label: 'Avis clients', href: '#avis' },
        { label: 'Certifications', href: '#certifications' },
      ],
    },
    {
      title: 'Contact',
      items: [
        { label: 'Devis gratuit', href: '#devis' },
        { label: 'Urgence 24h/7j', href: '#urgence' },
        { label: 'Paris & Île-de-France', href: '#urgence' },
        { label: 'Mentions légales', href: '#hero' },
      ],
    },
  ];

  const foot: React.CSSProperties = {
    background: C.ink,
    borderTop: `3px solid ${C.yellow}`,
    padding: 'clamp(60px,9vw,100px) clamp(24px,6vw,96px) 36px',
  };

  return (
    <footer style={foot}>
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.5fr repeat(3, 1fr)',
          gap: 'clamp(32px,5vw,64px)',
        }}
        className="r277-footgrid"
      >
        {/* Logo & baseline */}
        <div>
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: '0.10em',
              color: C.white,
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <Zap size={24} color={C.yellow} strokeWidth={2} />{fd?.businessName ?? "Électricité Dumont"}</div>
          <p
            style={{
              fontFamily: SANS,
              fontSize: 15,
              lineHeight: 1.68,
              color: 'rgba(255,255,255,0.58)',
              marginTop: 18,
              maxWidth: 300,
            }}
          >
            Électricien certifié Qualifelec RGE depuis 2009. Installation, rénovation,
            domotique et dépannage sur Paris et l&apos;Île-de-France.
          </p>

          {/* SIRET & zone */}
          <div
            style={{
              marginTop: 20,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontFamily: SANS,
                fontSize: 12,
                color: 'rgba(255,255,255,0.45)',
                letterSpacing: '0.10em',
              }}
            >
              <MapPin size={13} color={C.yellow} strokeWidth={2} />
              Paris 11e · 75011
            </div>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 12,
                color: 'rgba(255,255,255,0.40)',
                letterSpacing: '0.10em',
              }}
            >
              SIRET : 123 456 789 00012
            </div>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 12,
                color: 'rgba(255,255,255,0.40)',
                letterSpacing: '0.10em',
              }}
            >
              Qualifelec RGE · CONSUEL · Assurance décennale
            </div>
          </div>

          {/* Numéro urgence footer */}
          <a
            href={`tel:${fd?.phone ?? "0123456789"}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              marginTop: 22,
              textDecoration: 'none',
            }}
          >
            <Phone size={16} color={C.yellow} strokeWidth={2} />
            <span
              style={{
                fontFamily: SERIF,
                fontSize: 18,
                fontWeight: 700,
                color: C.yellow,
                letterSpacing: '0.06em',
              }}
            >
              01 23 45 67 89
            </span>
          </a>
        </div>

        {cols.map((c) => (
          <div key={c.title}>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                color: C.yellow,
                marginBottom: 18,
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
              {c.items.map((it) => (
                <li key={it.label}>
                  <a
                    href={it.href}
                    style={{
                      fontFamily: SANS,
                      fontSize: 15,
                      color: 'rgba(255,255,255,0.66)',
                      textDecoration: 'none',
                      transition: 'color .3s',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color = C.yellow;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.66)';
                    }}
                  >
                    {it.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div
        style={{
          maxWidth: 1240,
          margin: '52px auto 0',
          paddingTop: 24,
          borderTop: '1px solid rgba(255,255,255,0.10)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 14,
          fontFamily: SANS,
          fontSize: 12,
          letterSpacing: '0.10em',
          color: 'rgba(255,255,255,0.36)',
        }}
      >
        <span>
          © 2009–2026 Électricité Dumont. Tous droits réservés.
        </span>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <span
            style={{
              background: C.electric,
              color: C.yellow,
              fontWeight: 700,
              fontSize: 10,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              padding: '3px 8px',
            }}
          >
            Qualifelec RGE
          </span>
          <span
            style={{
              background: C.electric,
              color: C.yellow,
              fontWeight: 700,
              fontSize: 10,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              padding: '3px 8px',
            }}
          >
            CONSUEL
          </span>
          <span
            style={{
              background: C.electric,
              color: C.yellow,
              fontWeight: 700,
              fontSize: 10,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              padding: '3px 8px',
            }}
          >
            Décennale
          </span>
        </div>
        <span style={{ display: 'flex', gap: 20 }}>
          <a href="#hero" style={{ color: 'inherit', textDecoration: 'none' }}>
            Mentions légales
          </a>
          <a href="#hero" style={{ color: 'inherit', textDecoration: 'none' }}>
            Confidentialité
          </a>
        </span>
      </div>
      <style>{`
        @media (max-width: 860px){
          .r277-footgrid{ grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 520px){
          .r277-footgrid{ grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   PAGE PRINCIPALE
   ════════════════════════════════════════════════════════════════════════════ */

// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function Impact277Page() {
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
    C = { ...C, yellow: brand, yellowLight: shadeColor(brand, 25) };
  }

  const root: React.CSSProperties = {
    background: C.dark,
    color: C.white,
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
    <main id="hero" style={root} suppressHydrationWarning>
      <Nav />
      <HeroSection />
      <ScrollCrossfade />
      <ServicesSection />
      <ProcessSection />
      <TestimonialsSection />
      <DevisFormSection />
      <CertificationsSection />
      <ProjectsSection />
      <UrgencySection />
      <FooterSection />
    </main>
  );
}
