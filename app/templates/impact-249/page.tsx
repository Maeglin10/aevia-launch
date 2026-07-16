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
import { ArrowRight, ChevronDown, Star } from 'lucide-react';

/* ════════════════════════════════════════════════════════════════════════════
   DERMIS STUDIO — Tatouage & Piercing · Montpellier
   Chorégraphie de défilement éditoriale. 'use client'. Auto-suffisant.
   ════════════════════════════════════════════════════════════════════════════ */

/* ── Google Fonts ────────────────────────────────────────────────────────── */
const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');`;

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
  bg: '#f8f6f2',
  bgAlt: '#ede9e4',
  bgDark: '#0e0c0a',
  bgDarkAlt: '#080706',
  bgCard: '#ffffff',
  accent: '#c4813a',
  accentDark: '#a0642a',
  accentLight: '#f0d8be',
  white: '#ffffff',
  ink: '#0e0c0a',
  textMuted: '#3c3228',
  textFaint: '#8a7860',
  border: '#ddd4c8',
  borderDark: 'rgba(196,129,58,0.2)',
  red: '#c42c2c',
};

const SERIF = "'DM Serif Display', Georgia, serif" as const;
const SANS = "'DM Sans', system-ui, sans-serif" as const;

/* ── Easing ──────────────────────────────────────────────────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ── Photos Unsplash ─────────────────────────────────────────────────────── */
const PHOTO = {
  blackwork: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?q=80&w=1600&auto=format&fit=crop',
  realism: 'https://images.unsplash.com/photo-1565058379802-bbe93b2f703a?q=80&w=1600&auto=format&fit=crop',
  watercolor: 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?q=80&w=1600&auto=format&fit=crop',
  heroWide: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?q=80&w=2000&auto=format&fit=crop',
  safetyLeft: 'https://images.unsplash.com/photo-1565058379802-bbe93b2f703a?q=80&w=900&auto=format&fit=crop',
} as const;

/* ════════════════════════════════════════════════════════════════════════════
   TypeScript Interfaces
   ════════════════════════════════════════════════════════════════════════════ */
interface Style {
  src: string;
  alt: string;
  index: string;
  label: string;
  body: string;
}

interface Artist {
  name: string;
  specialty: string;
  experience: string;
  colorHint: string;
}

interface EditRow {
  eyebrow: string;
  img: string;
  imgAlt: string;
  titleLine1: string;
  titleLine2: string;
  body: string;
  reverse: boolean;
}

interface Testimonial {
  quote: string;
  author: string;
  context: string;
}

interface SafetyStep {
  number: string;
  title: string;
  body: string;
}

/* ════════════════════════════════════════════════════════════════════════════
   Data
   ════════════════════════════════════════════════════════════════════════════ */
const STYLES: Style[] = [
  {
    src: PHOTO.blackwork,
    alt: 'Tatouage blackwork géométrique sur avant-bras',
    index: 'I',
    label: 'BLACKWORK',
    body: "Géométrie, mandala, dotwork — l\'encre noire dans toute sa profondeur. Chaque trait pensé pour durer.",
  },
  {
    src: PHOTO.realism,
    alt: 'Tatouage réaliste portrait en noir et gris',
    index: 'II',
    label: 'RÉALISME',
    body: 'Portraits, animaux, paysages — techniques photographiques transcrites sur peau avec précision millimétrée.',
  },
  {
    src: PHOTO.watercolor,
    alt: 'Tatouage fineline et aquarelle délicat',
    index: 'III',
    label: 'FINELINE & WATERCOLOR',
    body: 'Traits fins comme des gravures, aquarelle sans contours — délicatesse et originalité pour les designs minimalistes.',
  },
];

const ARTISTS: Artist[] = [
  {
    name: 'MATHIS',
    specialty: 'Blackwork & Géométrie',
    experience: '8 ans d\'expérience',
    colorHint: C.accent,
  },
  {
    name: 'SORA',
    specialty: 'Réalisme & Portraits',
    experience: 'Spécialiste couleur',
    colorHint: C.accentDark,
  },
  {
    name: 'LÉONIE',
    specialty: 'Fineline & Botanical',
    experience: 'Minimalisme délicat',
    colorHint: C.accent,
  },
  {
    name: 'ROMAIN',
    specialty: 'Japonais traditionnel',
    experience: 'Tebori',
    colorHint: C.accentDark,
  },
];

const EDIT_ROWS: EditRow[] = [
  {
    eyebrow: 'Notre philosophie',
    img: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?q=80&w=800&auto=format&fit=crop',
    imgAlt: 'Artiste au travail dans le studio Dermis',
    titleLine1: 'Un tatouage,',
    titleLine2: 'c\'est pour la vie.',
    body: "Chaque pièce commence par une consultation gratuite de 30 minutes. Pas de flash importé d\'internet — chaque design est original, conçu pour vous. Notre processus créatif garantit un résultat unique qui vieillit avec élégance.",
    reverse: false,
  },
  {
    eyebrow: 'Le studio',
    img: 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?q=80&w=800&auto=format&fit=crop',
    imgAlt: 'Intérieur lumineux du studio Dermis à Montpellier',
    titleLine1: 'Montpellier',
    titleLine2: 'Écusson.',
    body: 'Au cœur du centre historique, dans un studio lumineux aux volumes généreux. Sur rendez-vous uniquement — pas de walk-ins. Parce que votre tatouage mérite toute notre attention, du premier croquis à la cicatrisation.',
    reverse: true,
  },
];

const SAFETY_STEPS: SafetyStep[] = [
  {
    number: '01',
    title: 'Matériel stérile à usage unique',
    body: 'Aiguilles et cartouches jetées après chaque session. Zéro compromis sur la stérilisation.',
  },
  {
    number: '02',
    title: 'Encres véganes certifiées',
    body: "Pigments testés dermatologiquement, formulés sans produits d\'origine animale.",
  },
  {
    number: '03',
    title: 'Stérilisation autoclave',
    body: "Salle de tatouage stérilisée à l\'autoclave avant chaque client, sans exception.",
  },
  {
    number: '04',
    title: 'Suivi post-tatouage inclus',
    body: "Guide de cicatrisation personnalisé + suivi complet jusqu\'à la guérison totale.",
  },
];

const TESTIMONIALS: Testimonial[] = [
  {
    quote: "Six séances avec Mathis pour un sleeve complet — chaque détail est d\'une précision hallucinante. Le blackwork tient parfaitement, même deux ans après. C\'est du vrai travail d\'artiste.",
    author: 'Camille D.',
    context: 'Sleeve blackwork, 6 séances',
  },
  {
    quote: "J\'avais vraiment peur de la douleur, mais Sora a su me mettre complètement à l\'aise. Le résultat a largement dépassé ce que j\'imaginais — mes amis n\'en reviennent pas.",
    author: 'Thomas R.',
    context: 'Portrait réaliste, séance unique',
  },
];

/* ════════════════════════════════════════════════════════════════════════════
   Primitives partagés
   ════════════════════════════════════════════════════════════════════════════ */

/** Étiquette fine capitales avec filet doré */
function Eyebrow({
  children,
  color = C.accent,
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
    width: 40,
    height: 1,
    background: color,
    opacity: 0.8,
    flexShrink: 0,
  };
  const label: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 10.5,
    letterSpacing: '0.38em',
    textTransform: 'uppercase',
    color,
    fontWeight: 500,
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

/** Révélation scroll : fade + translation, once */
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
      transition={{ duration: 1.1, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Bouton amber — filled ou outline */
function AmberButton({
  children,
  onClick,
  filled = false,
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
    gap: 11,
    padding: small ? '12px 24px' : '15px 30px',
    fontFamily: SANS,
    fontSize: small ? 11 : 12,
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    fontWeight: 500,
    cursor: 'pointer',
    border: `1px solid ${C.accent}`,
    background: filled ? C.accent : 'transparent',
    color: filled ? C.white : C.accent,
    transition: 'all .5s cubic-bezier(.16,1,.3,1)',
    outline: 'none',
  };
  const hov: React.CSSProperties = hover
    ? filled
      ? { background: C.accentDark, borderColor: C.accentDark, transform: 'translateY(-2px)' }
      : { background: 'rgba(196,129,58,0.1)', transform: 'translateY(-2px)' }
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
        size={13}
        style={{
          transform: hover ? 'translateX(4px)' : 'none',
          transition: 'transform .5s cubic-bezier(.16,1,.3,1)',
        }}
      />
    </button>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   1 · NAV
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
    { label: 'Styles', href: '#styles' },
    { label: 'Artistes', href: '#artistes' },
    { label: 'Hygiène', href: '#hygiene' },
    { label: 'Réserver', href: '#reserver' },
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
    background: solid ? 'rgba(14,12,10,0.96)' : 'transparent',
    backdropFilter: solid ? 'blur(14px) saturate(120%)' : 'none',
    WebkitBackdropFilter: solid ? 'blur(14px) saturate(120%)' : 'none',
    borderBottom: solid ? `1px solid ${C.borderDark}` : '1px solid transparent',
    transition: 'all .6s cubic-bezier(.16,1,.3,1)',
  };

  const brand: React.CSSProperties = {
    fontFamily: SERIF,
    fontSize: 'clamp(17px,2vw,22px)',
    letterSpacing: '0.12em',
    color: C.white,
    textDecoration: 'none',
    fontWeight: 400,
  };

  const linkRow: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'clamp(16px,2.2vw,36px)',
  };

  return (
    <>
      <nav style={bar}>
      <a href="#styles" style={brand}>
        {fd?.logoBase64 ? (
          // Client logo (uploaded in the brief) replaces the placeholder mark —
          // essential for the client to recognise their brand in the render.
          <img
            src={fd.logoBase64}
            alt={fd?.businessName ?? 'logo'}
            style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
          />
        ) : (
          fd?.businessName ?? "Dermis Studio"
        )}
      </a>
      <div style={linkRow} className="ds-navlinks">
        {links.map((l) => (
          <NavLink key={l.label} label={l.label} href={l.href} />
        ))}
      </div>
      <div className="ds-navcta">
        <a href="#reserver" style={{ textDecoration: 'none' }}>
          <AmberButton filled small>
            Réserver
          </AmberButton>
        </a>
      </div>
      
        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="ds-burger"
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
        @media (max-width: 860px) {
          .ds-navlinks { display: none !important; }
          .ds-burger { display: flex !important; flex-direction: column; }
          .ds-navcta { display: none !important; }
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
        fontSize: 11.5,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: h ? C.accent : 'rgba(255,255,255,0.85)',
        textDecoration: 'none',
        transition: 'color .4s',
        position: 'relative',
        paddingBottom: 4,
        fontWeight: 400,
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
          transition: 'width .5s cubic-bezier(.16,1,.3,1)',
        }}
      />
    </a>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   2 · HERO
   ════════════════════════════════════════════════════════════════════════════ */
function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '16%']);
  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '-44%']);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.72], [1, 0]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);

  const section: React.CSSProperties = {
    position: 'relative',
    height: '100dvh',
    minHeight: 640,
    overflow: 'hidden',
    background: C.bgDark,
  };

  return (
    <section ref={ref} style={section}>
      {/* Photo plein cadre parallaxe */}
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
          src={PHOTO.heroWide}
          alt="Artiste tatoueur au travail, Dermis Studio Montpellier"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </motion.div>

      {/* Scrims */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(14,12,10,0.55) 0%, rgba(14,12,10,0.10) 40%, rgba(14,12,10,0.50) 72%, rgba(14,12,10,0.92) 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(110% 75% at 50% 40%, transparent 42%, rgba(14,12,10,0.38) 100%)',
          mixBlendMode: 'multiply',
        }}
      />

      {/* Contenu */}
      <motion.div
        style={{
          position: 'relative',
          zIndex: 2,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: 'clamp(120px,15vw,180px) clamp(24px,6vw,80px) clamp(64px,9vw,100px)',
          y: titleY,
          opacity: titleOpacity,
        }}
      >
        <Reveal y={16}>
          <Eyebrow color={C.accentLight} align="left">
            Tatouage &amp; Piercing · Montpellier
          </Eyebrow>
        </Reveal>

        <motion.h1
          initial={{ opacity: 0, y: 44 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.12 }}
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontWeight: 400,
            color: C.white,
            fontSize: 'clamp(3.5rem,8vw,10rem)',
            lineHeight: 0.88,
            letterSpacing: '-0.01em',
            margin: 'clamp(20px,3vw,34px) 0 clamp(22px,3vw,36px)',
            textShadow: '0 14px 60px rgba(0,0,0,0.55)',
            maxWidth: '10em',
          }}
        >
          L&apos;encre
          <br />
          comme art.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.38 }}
          style={{
            fontFamily: SANS,
            fontWeight: 300,
            fontSize: 'clamp(15px,1.6vw,19px)',
            color: 'rgba(255,255,255,0.82)',
            maxWidth: 480,
            lineHeight: 1.72,
            marginBottom: 'clamp(28px,4vw,44px)',
          }}
        >
          Quatre artistes, une obsession partagée : chaque tatouage est une
          œuvre originale conçue spécialement pour vous.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.62 }}
          style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}
        >
          <a href="#reserver" style={{ textDecoration: 'none' }}>
            <AmberButton filled>Prendre rendez-vous</AmberButton>
          </a>
          <a href="#styles" style={{ textDecoration: 'none' }}>
            <AmberButton>Nos styles</AmberButton>
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: 32,
          right: 'clamp(24px,6vw,80px)',
          zIndex: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 9,
          opacity: cueOpacity,
        }}
      >
        <span
          style={{
            fontFamily: SANS,
            fontSize: 9.5,
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.6)',
          }}
        >
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 9, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={18} color={C.accentLight} strokeWidth={1.4} />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   3 · INTRO
   ════════════════════════════════════════════════════════════════════════════ */
function Intro() {
  const sec: React.CSSProperties = {
    background: C.bgAlt,
    padding: 'clamp(96px,13vw,180px) clamp(24px,8vw,160px)',
    textAlign: 'center',
  };
  return (
    <section style={sec}>
      <Reveal>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
          <Eyebrow color={C.textMuted} align="center">
            Notre approche
          </Eyebrow>
        </div>
      </Reveal>
      <Reveal delay={0.1}>
        <p
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 'clamp(26px,3.6vw,52px)',
            lineHeight: 1.28,
            fontWeight: 400,
            maxWidth: 980,
            margin: '0 auto',
            color: C.ink,
          }}
        >
          Un bon tatouage commence par une vraie conversation.
        </p>
      </Reveal>
      <Reveal delay={0.2}>
        <div
          style={{
            width: 1,
            height: 88,
            background: `linear-gradient(${C.accent}, transparent)`,
            margin: '52px auto 0',
          }}
        />
      </Reveal>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   4 · STYLE SEQUENCE — sticky crossfade 320vh
   ════════════════════════════════════════════════════════════════════════════ */
function StyleImage({
  s,
  i,
  total,
  progress,
}: {
  s: Style;
  i: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const seg = 1 / total;
  const start = i * seg;
  const end = start + seg;
  const fade = seg * 0.28;

  const opacity = useTransform(
    progress,
    [Math.max(0, start - fade), start, end - fade, Math.min(1, end)],
    i === 0
      ? [1, 1, 1, 0]
      : i === total - 1
        ? [0, 1, 1, 1]
        : [0, 1, 1, 0],
  );
  const scale = useTransform(progress, [start - fade, end], [1.1, 1.0]);

  return (
    <motion.div style={{ position: 'absolute', inset: 0, opacity }}>
      <motion.img
        src={s.src}
        alt={s.alt}
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

function StyleCaption({
  s,
  i,
  total,
  progress,
}: {
  s: Style;
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
        bottom: 'clamp(80px,11vw,130px)',
        left: 'clamp(24px,6vw,80px)',
        maxWidth: 540,
        opacity,
        y,
      }}
    >
      <div
        style={{
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontSize: 'clamp(48px,8vw,110px)',
          color: 'rgba(196,129,58,0.28)',
          lineHeight: 1,
          marginBottom: 4,
        }}
      >
        {s.index}
      </div>
      <h2
        style={{
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: 'clamp(11px,1.2vw,13px)',
          letterSpacing: '0.42em',
          textTransform: 'uppercase',
          color: C.accentLight,
          margin: '0 0 16px',
        }}
      >
        {s.label}
      </h2>
      <p
        style={{
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontSize: 'clamp(16px,1.7vw,22px)',
          color: 'rgba(255,255,255,0.88)',
          lineHeight: 1.6,
          margin: 0,
        }}
      >
        {s.body}
      </p>
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
    [0.32, 1, 1, 0.32],
  );
  const width = useTransform(progress, [i * seg, (i + 1) * seg], [10, 36]);
  return (
    <motion.div style={{ height: 2, width, background: C.accent, opacity }} />
  );
}

function StyleSequence() {
  const n = STYLES.length;
  const progress = useMotionValue(0.5 / n);
  const [active, setActive] = useState(0);
  const goTo = (i: number) => {
    setActive(i);
    progress.set((i + 0.5) / n);
  };

  return (
    <section
      id="styles"
      style={{ height: '100dvh', overflow: 'hidden', position: 'relative', background: C.bgDark }}
    >
      <div
        style={{
          position: 'relative',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {/* Images crossfade */}
        {STYLES.map((s, i) => (
          <StyleImage
            key={s.label}
            s={s}
            i={i}
            total={STYLES.length}
            progress={progress}
          />
        ))}

        {/* Voile lisibilité */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to top, rgba(14,12,10,0.80) 0%, rgba(14,12,10,0.16) 55%, rgba(14,12,10,0.32) 100%)',
          }}
        />

        {/* Label top-right */}
        {STYLES.map((s, i) => {
          const seg = 1 / STYLES.length;
          return (
            <StyleLabelTopRight
              key={s.label + '-tr'}
              label={s.label}
              i={i}
              seg={seg}
              progress={progress}
            />
          );
        })}

        {/* Captions */}
        {STYLES.map((s, i) => (
          <StyleCaption
            key={s.label + '-cap'}
            s={s}
            i={i}
            total={STYLES.length}
            progress={progress}
          />
        ))}

        {/* Progress dots */}
        <div
          style={{
            position: 'absolute',
            bottom: 'clamp(40px,5vw,56px)',
            right: 'clamp(24px,6vw,80px)',
            display: 'flex',
            gap: 10,
            alignItems: 'center',
          }}
        >
          {STYLES.map((s, i) => (
            <ProgressDot
              key={s.index}
              i={i}
              total={STYLES.length}
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

function StyleLabelTopRight({
  label,
  i,
  seg,
  progress,
}: {
  label: string;
  i: number;
  seg: number;
  progress: MotionValue<number>;
}) {
  const fade = seg * 0.22;
  const start = i * seg;
  const end = start + seg;
  const opacity = useTransform(
    progress,
    [start, start + fade, end - fade, end],
    i === 0 ? [1, 1, 1, 0] : [0, 1, 1, 0],
  );
  return (
    <motion.div
      style={{
        position: 'absolute',
        top: 'clamp(90px,12vw,130px)',
        right: 'clamp(24px,6vw,80px)',
        opacity,
        fontFamily: SANS,
        fontWeight: 600,
        fontSize: 10,
        letterSpacing: '0.42em',
        textTransform: 'uppercase',
        color: 'rgba(240,216,190,0.75)',
        writingMode: 'vertical-rl',
        textOrientation: 'mixed',
      }}
    >
      {label}
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   5 · ARTIST CARDS
   ════════════════════════════════════════════════════════════════════════════ */
function ArtistCard({ a, i }: { a: Artist; i: number }) {
  const [hover, setHover] = useState(false);
  const card: React.CSSProperties = {
    background: C.bgCard,
    border: `1px solid ${hover ? C.accent : C.border}`,
    overflow: 'hidden',
    transform: hover ? 'translateY(-10px)' : 'none',
    boxShadow: hover
      ? '0 36px 72px -28px rgba(14,12,10,0.22)'
      : '0 10px 32px -20px rgba(14,12,10,0.12)',
    transition: 'all .55s cubic-bezier(.16,1,.3,1)',
    cursor: 'pointer',
  };
  return (
    <Reveal delay={i * 0.1}>
      <article
        style={card}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {/* Photo placeholder */}
        <div
          style={{
            aspectRatio: '4 / 5',
            background: hover
              ? `linear-gradient(135deg, ${C.accent} 0%, ${C.accentDark} 100%)`
              : `linear-gradient(135deg, ${C.accentLight} 0%, ${C.bgAlt} 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background .55s cubic-bezier(.16,1,.3,1)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <span
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: 'clamp(52px,8vw,80px)',
              color: hover ? 'rgba(255,255,255,0.28)' : 'rgba(196,129,58,0.32)',
              userSelect: 'none',
              transition: 'color .55s',
            }}
          >
            {a.name[0]}
          </span>
        </div>

        <div style={{ padding: 'clamp(22px,3vw,30px)' }}>
          <h3
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(22px,2.4vw,28px)',
              fontWeight: 400,
              color: C.ink,
              margin: '0 0 8px',
              letterSpacing: '0.04em',
            }}
          >
            {a.name}
          </h3>
          <div
            style={{
              fontFamily: SANS,
              fontSize: 13,
              fontWeight: 400,
              color: C.textMuted,
              marginBottom: 12,
            }}
          >
            {a.specialty}
          </div>
          <span
            style={{
              display: 'inline-block',
              fontFamily: SANS,
              fontSize: 10.5,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: C.white,
              background: hover ? C.accentDark : C.accent,
              padding: '5px 12px',
              transition: 'background .4s',
            }}
          >
            {a.experience}
          </span>
        </div>
      </article>
    </Reveal>
  );
}

function ArtistCards() {
  const sec: React.CSSProperties = {
    background: C.bgAlt,
    padding: 'clamp(88px,12vw,160px) clamp(24px,6vw,80px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(240px, 100%), 1fr))',
    gap: 'clamp(20px,3vw,36px)',
    maxWidth: 1200,
    margin: '0 auto',
  };
  return (
    <section style={sec} id="artistes">
      <div style={{ maxWidth: 1200, margin: '0 auto clamp(48px,7vw,72px)' }}>
        <Reveal>
          <Eyebrow color={C.textMuted} align="left">
            L&apos;équipe
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(36px,5.5vw,72px)',
              fontWeight: 400,
              color: C.ink,
              margin: 'clamp(16px,2vw,22px) 0 0',
              lineHeight: 1.06,
            }}
          >
            Nos{' '}
            <span style={{ fontStyle: 'italic', color: C.accent }}>
              artistes
            </span>
          </h2>
        </Reveal>
      </div>
      <div style={grid}>
        {ARTISTS.map((a, i) => (
          <ArtistCard key={a.name} a={a} i={i} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   6 · EDITORIAL ROWS
   ════════════════════════════════════════════════════════════════════════════ */
function ParallaxImg({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);
  return (
    <div ref={ref} style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        style={{ width: '100%', height: '116%', objectFit: 'cover', y }}
      />
    </div>
  );
}

function EditorialRow({ row, rowIndex }: { row: EditRow; rowIndex: number }) {
  const wrap: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 'clamp(32px,6vw,90px)',
    alignItems: 'center',
    position: 'relative',
  };
  const imgWrap: React.CSSProperties = {
    overflow: 'hidden',
    order: row.reverse ? 2 : 1,
    aspectRatio: '5 / 6',
  };
  const txt: React.CSSProperties = {
    order: row.reverse ? 1 : 2,
    position: 'relative',
  };

  /* Ghost roman numeral */
  const ghost: React.CSSProperties = {
    position: 'absolute',
    top: -20,
    right: row.reverse ? 'auto' : -10,
    left: row.reverse ? -10 : 'auto',
    fontFamily: SERIF,
    fontSize: 'clamp(80px,12vw,160px)',
    fontStyle: 'italic',
    color: C.red,
    opacity: 0.08,
    lineHeight: 1,
    userSelect: 'none',
    pointerEvents: 'none',
    zIndex: 0,
  };

  return (
    <div style={wrap} className="ds-editrow">
      <Reveal y={48} style={imgWrap}>
        <ParallaxImg src={row.img} alt={row.imgAlt} />
      </Reveal>
      <div style={txt}>
        <span style={ghost}>{rowIndex === 0 ? 'I' : 'II'}</span>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Reveal>
            <Eyebrow color={C.textMuted}>{row.eyebrow}</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h3
              style={{
                fontFamily: SERIF,
                fontStyle: 'italic',
                fontSize: 'clamp(30px,4.2vw,58px)',
                fontWeight: 400,
                color: C.ink,
                margin: 'clamp(16px,2vw,22px) 0 clamp(18px,2.5vw,28px)',
                lineHeight: 1.1,
              }}
            >
              {row.titleLine1}
              <br />
              {row.titleLine2}
            </h3>
          </Reveal>
          <Reveal delay={0.16}>
            <p
              style={{
                fontFamily: SANS,
                fontWeight: 300,
                fontSize: 'clamp(15px,1.5vw,17px)',
                lineHeight: 1.82,
                color: C.textMuted,
                maxWidth: 460,
              }}
            >
              {row.body}
            </p>
          </Reveal>
        </div>
      </div>
      <style>{`
        @media (max-width: 860px) {
          .ds-editrow { grid-template-columns: 1fr !important; }
          .ds-editrow > * { order: initial !important; }
        }
      `}</style>
    </div>
  );
}

function EditorialRows() {
  const sec: React.CSSProperties = {
    background: C.bg,
    padding: 'clamp(80px,11vw,150px) clamp(24px,6vw,80px)',
  };
  return (
    <section style={sec}>
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(80px,12vw,160px)',
        }}
      >
        {EDIT_ROWS.map((row, i) => (
          <EditorialRow key={row.eyebrow} row={row} rowIndex={i} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   7 · SAFETY PANEL — sticky side image
   ════════════════════════════════════════════════════════════════════════════ */
function SafetyPanel() {
  const sec: React.CSSProperties = {
    background: C.bgDark,
    padding: 'clamp(80px,11vw,150px) clamp(24px,6vw,80px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '0.9fr 1.1fr',
    gap: 'clamp(40px,6vw,96px)',
    maxWidth: 1200,
    margin: '0 auto',
    alignItems: 'start',
  };
  const stickySide: React.CSSProperties = {
    position: 'sticky',
    top: 100,
    alignSelf: 'start',
  };

  return (
    <section style={sec} id="hygiene">
      <div style={grid} className="ds-safepanel">
        {/* Sticky image */}
        <div style={stickySide} className="ds-safepanel-sticky">
          <div
            style={{
              overflow: 'hidden',
              border: `1px solid ${C.borderDark}`,
              aspectRatio: '4 / 5',
            }}
          >
            <img
              src={PHOTO.safetyLeft}
              alt="Matériel stérile et préparation au Dermis Studio"
              loading="lazy"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </div>
          <div style={{ marginTop: 24 }}>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 10.5,
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: C.accent,
                marginBottom: 10,
              }}
            >
              Certifié · Contrôlé · Sécurisé
            </div>
            <p
              style={{
                fontFamily: SERIF,
                fontStyle: 'italic',
                fontSize: 17,
                color: 'rgba(255,255,255,0.72)',
                lineHeight: 1.65,
                margin: 0,
              }}
            >
              Notre protocole d&apos;hygiène dépasse les exigences légales.
              Parce que votre santé ne se négocie pas.
            </p>
          </div>
        </div>

        {/* Steps scrollables */}
        <div>
          <Reveal>
            <Eyebrow color={C.accent}>Protocole hygiène</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(32px,4.8vw,64px)',
                fontWeight: 400,
                color: C.white,
                margin: 'clamp(16px,2vw,22px) 0 clamp(36px,5vw,56px)',
                lineHeight: 1.06,
              }}
            >
              Votre sécurité,{' '}
              <span style={{ fontStyle: 'italic', color: C.accentLight }}>
                notre priorité
              </span>
            </h2>
          </Reveal>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {SAFETY_STEPS.map((step, i) => (
              <Reveal key={step.number} delay={0.06 * i}>
                <div
                  style={{
                    padding: 'clamp(28px,4vw,38px) 0',
                    borderTop: `1px solid rgba(196,129,58,0.22)`,
                    display: 'flex',
                    gap: 'clamp(20px,3vw,34px)',
                    alignItems: 'baseline',
                  }}
                >
                  <span
                    style={{
                      fontFamily: SERIF,
                      fontStyle: 'italic',
                      fontSize: 'clamp(28px,3.5vw,42px)',
                      color: C.accent,
                      minWidth: 60,
                      lineHeight: 1,
                      flexShrink: 0,
                    }}
                  >
                    {step.number}
                  </span>
                  <div>
                    <h4
                      style={{
                        fontFamily: SERIF,
                        fontSize: 'clamp(18px,2vw,24px)',
                        fontWeight: 400,
                        color: C.white,
                        margin: '0 0 10px',
                      }}
                    >
                      {step.title}
                    </h4>
                    <p
                      style={{
                        fontFamily: SANS,
                        fontWeight: 300,
                        fontSize: 'clamp(14px,1.4vw,16px)',
                        lineHeight: 1.75,
                        color: 'rgba(255,255,255,0.65)',
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
        @media (max-width: 860px) {
          .ds-safepanel { grid-template-columns: 1fr !important; }
          .ds-safepanel-sticky { position: static !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   8 · TESTIMONIALS
   ════════════════════════════════════════════════════════════════════════════ */
function Testimonials() {
  const sec: React.CSSProperties = {
    background: C.bg,
    padding: 'clamp(88px,12vw,168px) clamp(24px,6vw,80px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))',
    gap: 'clamp(28px,4vw,56px)',
    maxWidth: 1100,
    margin: '0 auto',
  };
  return (
    <section style={sec}>
      <div style={{ maxWidth: 1100, margin: '0 auto clamp(48px,7vw,72px)', textAlign: 'center' }}>
        <Reveal>
          <Eyebrow color={C.textMuted} align="center">
            Ils nous font confiance
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(32px,5vw,64px)',
              fontWeight: 400,
              color: C.ink,
              margin: 'clamp(16px,2vw,22px) 0 0',
              lineHeight: 1.06,
            }}
          >
            La parole de nos{' '}
            <span style={{ fontStyle: 'italic', color: C.accent }}>clients</span>
          </h2>
        </Reveal>
      </div>
      <div style={grid}>
        {TESTIMONIALS.map((t, i) => (
          <Reveal key={t.author} delay={i * 0.12} style={{ height: '100%' }}>
            <figure
              style={{
                background: C.bgCard,
                border: `1px solid ${C.border}`,
                padding: 'clamp(32px,4vw,48px)',
                margin: 0,
                height: '100%',
                boxSizing: 'border-box',
                boxShadow: '0 20px 56px -36px rgba(14,12,10,0.18)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ display: 'flex', gap: 4, marginBottom: 22 }}>
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} size={14} fill={C.accent} color={C.accent} strokeWidth={0} />
                ))}
              </div>
              <blockquote
                style={{
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  fontSize: 'clamp(17px,1.9vw,22px)',
                  lineHeight: 1.62,
                  color: C.ink,
                  margin: '0 0 clamp(24px,3vw,32px)',
                  flex: 1,
                }}
              >
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption
                style={{
                  borderTop: `1px solid ${C.border}`,
                  paddingTop: 20,
                }}
              >
                <div
                  style={{
                    fontFamily: SERIF,
                    fontSize: 18,
                    color: C.textMuted,
                    marginBottom: 6,
                  }}
                >
                  {t.author}
                </div>
                <div
                  style={{
                    fontFamily: SANS,
                    fontSize: 10.5,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: C.textFaint,
                  }}
                >
                  {t.context}
                </div>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   9 · BOOKING FORM
   ════════════════════════════════════════════════════════════════════════════ */
function BookingForm() {
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [tel, setTel] = useState('');
  const [style, setStyle] = useState('');
  const [taille, setTaille] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prenom || !email) return;
    setSent(true);
  };

  const fieldBase: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    background: 'transparent',
    border: 'none',
    borderBottom: `1px solid rgba(196,129,58,0.40)`,
    padding: '16px 2px',
    fontFamily: SERIF,
    fontSize: 'clamp(16px,1.6vw,19px)',
    color: C.white,
    outline: 'none',
    transition: 'border-color .4s',
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 10.5,
    letterSpacing: '0.26em',
    textTransform: 'uppercase',
    color: C.accent,
    display: 'block',
    marginBottom: 4,
    fontWeight: 500,
  };

  const selectStyle: React.CSSProperties = {
    ...fieldBase,
    appearance: 'none',
    WebkitAppearance: 'none',
    cursor: 'pointer',
    color: style ? C.white : 'rgba(255,255,255,0.38)',
  };

  const textareaStyle: React.CSSProperties = {
    ...fieldBase,
    resize: 'vertical',
    minHeight: 90,
  };

  const sec: React.CSSProperties = {
    background: C.bgDark,
    padding: 'clamp(96px,13vw,180px) clamp(24px,6vw,80px)',
    position: 'relative',
    overflow: 'hidden',
  };

  return (
    <section style={sec} id="reserver">
      {/* Fond discret */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 70% 60% at 50% 100%, rgba(196,129,58,0.06) 0%, transparent 70%)',
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
          <Eyebrow color={C.accentLight} align="center">
            Prendre rendez-vous
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(36px,6vw,80px)',
              fontWeight: 400,
              color: C.white,
              margin: 'clamp(18px,2vw,24px) 0 clamp(14px,2vw,20px)',
              lineHeight: 1.04,
            }}
          >
            Votre projet,{' '}
            <span style={{ fontStyle: 'italic', color: C.accentLight }}>
              notre art.
            </span>
          </h2>
        </Reveal>
        <Reveal delay={0.14}>
          <p
            style={{
              fontFamily: SANS,
              fontWeight: 300,
              fontSize: 'clamp(14px,1.5vw,17px)',
              lineHeight: 1.78,
              color: 'rgba(255,255,255,0.72)',
              maxWidth: 500,
              margin: '0 auto clamp(44px,6vw,60px)',
            }}
          >
            Décrivez votre projet, nous vous répondrons sous 24 h pour planifier
            votre consultation gratuite de 30 minutes.
          </p>
        </Reveal>

        {sent ? (
          <Reveal>
            <div
              style={{
                border: `1px solid ${C.accent}`,
                padding: 'clamp(36px,5vw,56px)',
                background: 'rgba(196,129,58,0.07)',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  fontSize: 'clamp(28px,3vw,38px)',
                  color: C.accentLight,
                  marginBottom: 16,
                }}
              >
                ✦
              </div>
              <h3
                style={{
                  fontFamily: SERIF,
                  fontSize: 'clamp(24px,2.8vw,34px)',
                  fontWeight: 400,
                  color: C.white,
                  margin: '0 0 14px',
                }}
              >
                Merci {prenom}, notre équipe vous confirme votre RDV sous 24h.
              </h3>
              <p
                style={{
                  fontFamily: SANS,
                  fontWeight: 300,
                  fontSize: 16,
                  color: 'rgba(255,255,255,0.68)',
                  margin: 0,
                }}
              >
                Un email de confirmation sera envoyé à{' '}
                <strong style={{ color: C.accentLight, fontWeight: 400 }}>
                  {email}
                </strong>
                .
              </p>
            </div>
          </Reveal>
        ) : (
          <Reveal delay={0.2}>
            <form
              onSubmit={onSubmit}
              style={{ display: 'flex', flexDirection: 'column', gap: 32, textAlign: 'left' }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }} className="ds-formgrid">
                <div>
                  <label style={labelStyle} htmlFor="ds-prenom">
                    Prénom
                  </label>
                  <input
                    id="ds-prenom"
                    style={fieldBase}
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    placeholder="Marie"
                    autoComplete="given-name"
                    required
                  />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="ds-email">
                    Email
                  </label>
                  <input
                    id="ds-email"
                    type="email"
                    style={fieldBase}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="marie@exemple.fr"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle} htmlFor="ds-tel">
                  Téléphone
                </label>
                <input
                  id="ds-tel"
                  type="tel"
                  style={fieldBase}
                  value={tel}
                  onChange={(e) => setTel(e.target.value)}
                  placeholder="+33 6 12 34 56 78"
                  autoComplete="tel"
                />
              </div>

              <div>
                <label style={labelStyle} htmlFor="ds-style">
                  Style souhaité
                </label>
                <select
                  id="ds-style"
                  style={selectStyle}
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                >
                  <option value="" style={{ color: '#111' }}>
                    Choisir un style…
                  </option>
                  {['Blackwork', 'Réalisme', 'Japonais', 'Watercolor', 'Fineline', 'Autre'].map(
                    (s) => (
                      <option key={s} value={s} style={{ color: '#111' }}>
                        {s}
                      </option>
                    ),
                  )}
                </select>
              </div>

              <div>
                <label style={labelStyle} htmlFor="ds-taille">
                  Taille approximative
                </label>
                <input
                  id="ds-taille"
                  style={fieldBase}
                  value={taille}
                  onChange={(e) => setTaille(e.target.value)}
                  placeholder="ex. paume de main, avant-bras complet…"
                />
              </div>

              <div>
                <label style={labelStyle} htmlFor="ds-message">
                  Message
                </label>
                <textarea
                  id="ds-message"
                  style={textareaStyle}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Décrivez votre projet, inspirations, emplacement…"
                />
              </div>

              <div style={{ textAlign: 'center', marginTop: 8 }}>
                <AmberButton filled type="submit">
                  Envoyer ma demande
                </AmberButton>
              </div>
            </form>
          </Reveal>
        )}
      </div>
      <style>{`
        @media (max-width: 860px) {
          .ds-formgrid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   10 · FOOTER
   ════════════════════════════════════════════════════════════════════════════ */
function Footer() {
  const foot: React.CSSProperties = {
    background: C.bgDarkAlt,
    borderTop: `1px solid rgba(196,129,58,0.16)`,
    padding: 'clamp(64px,9vw,110px) clamp(24px,6vw,80px) 40px',
  };

  const cols: { title: string; items: { label: string; href: string }[] }[] = [
    {
      title: 'Styles',
      items: [
        { label: 'Blackwork', href: '#styles' },
        { label: 'Réalisme', href: '#styles' },
        { label: 'Fineline', href: '#styles' },
        { label: 'Watercolor', href: '#styles' },
      ],
    },
    {
      title: 'Artistes',
      items: [
        { label: 'Mathis', href: '#artistes' },
        { label: 'Sora', href: '#artistes' },
        { label: 'Léonie', href: '#artistes' },
        { label: 'Romain', href: '#artistes' },
      ],
    },
    {
      title: 'Infos pratiques',
      items: [
        { label: 'Prendre RDV', href: '#reserver' },
        { label: 'Hygiène & Protocole', href: '#hygiene' },
        { label: 'Montpellier Écusson', href: '#reserver' },
        { label: 'Consultation offerte', href: '#reserver' },
      ],
    },
  ];

  return (
    <footer style={foot}>
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.5fr repeat(3, 1fr)',
          gap: 'clamp(32px,5vw,70px)',
        }}
        className="ds-footgrid"
      >
        {/* Brand */}
        <div>
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(20px,2.2vw,26px)',
              letterSpacing: '0.10em',
              color: C.white,
              fontWeight: 400,
              marginBottom: 16,
            }}
          >{fd?.businessName ?? "Dermis Studio"}</div>
          <p
            style={{
              fontFamily: SANS,
              fontWeight: 300,
              fontSize: 14,
              lineHeight: 1.78,
              color: 'rgba(255,255,255,0.55)',
              maxWidth: 300,
              margin: '0 0 24px',
            }}
          >
            Tatouage &amp; Piercing sur mesure. Montpellier Écusson.
            Sur rendez-vous uniquement.
          </p>
          <div
            style={{
              fontFamily: SANS,
              fontSize: 10.5,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: C.textFaint,
            }}
          >
            Lun–Sam · 10h–19h
          </div>
        </div>

        {/* Cols */}
        {cols.map((col) => (
          <div key={col.title}>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 10.5,
                letterSpacing: '0.26em',
                textTransform: 'uppercase',
                color: C.accent,
                marginBottom: 20,
                fontWeight: 500,
              }}
            >
              {col.title}
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
              {col.items.map((it) => (
                <li key={it.label}>
                  <FooterLink label={it.label} href={it.href} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div
        style={{
          maxWidth: 1200,
          margin: 'clamp(52px,7vw,80px) auto 0',
          paddingTop: 28,
          borderTop: `1px solid rgba(196,129,58,0.14)`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 14,
          fontFamily: SANS,
          fontSize: 11,
          letterSpacing: '0.10em',
          color: 'rgba(255,255,255,0.38)',
        }}
      >
        <span>© 2024 Dermis Studio · Montpellier. Tous droits réservés.</span>
        <span style={{ display: 'flex', gap: 24 }}>
          <a href="#reserver" style={{ color: 'inherit', textDecoration: 'none' }}>
            Mentions légales
          </a>
          <a href="#reserver" style={{ color: 'inherit', textDecoration: 'none' }}>
            Confidentialité
          </a>
        </span>
      </div>
      <style>{`
        @media (max-width: 860px) {
          .ds-footgrid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 560px) {
          .ds-footgrid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}

function FooterLink({ label, href }: { label: string; href: string }) {
  const [h, setH] = useState(false);
  return (
    <a
      href={href}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        fontFamily: SANS,
        fontWeight: 300,
        fontSize: 14,
        color: h ? C.accentLight : 'rgba(255,255,255,0.62)',
        textDecoration: 'none',
        transition: 'color .4s',
      }}
    >
      {label}
    </a>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   PAGE PRINCIPALE
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

  if (brand) {
    C = {
      ...C,
      accent: brand,
      accentDark: shadeColor(brand, -20),
    };
  }

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
        ${FONT_IMPORT}

        *, *::before, *::after {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        /* iOS zoom prevention */
        input, select, textarea {
          font-size: 16px;
        }

        @media (max-width: 860px) {
          input, select, textarea {
            font-size: 16px;
          }
        }

        /* Placeholder styling */
        input::placeholder,
        textarea::placeholder {
          color: rgba(255,255,255,0.32);
          font-family: '${SERIF}';
          font-style: italic;
        }

        select option {
          background: #1a1612;
          color: #f8f6f2;
        }
      `}</style>
      <Nav />
      <Hero />
      <Intro />
      <StyleSequence />
      <ArtistCards />
      <EditorialRows />
      <SafetyPanel />
      <Testimonials />
      <BookingForm />
      <Footer />
    </main>
  );
}
