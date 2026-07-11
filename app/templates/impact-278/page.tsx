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
  Droplets,
  Home,
  MapPin,
  Phone,
  Quote,
  Shield,
  Star,
  Thermometer,
  Wrench,
  CheckCircle,
  Clock,
  Award,
  Flame,
} from 'lucide-react';

// Hoisted above the design tokens: several templates read `brand` in a
// module-level const — declaring it lower caused a TDZ ReferenceError (500).
let brand: any = null;

/* ════════════════════════════════════════════════════════════════════════════
   PLOMBERIE GARONNE — Plombier-chauffagiste certifié · Toulouse & agglo
   Photographie réelle + architecture éditoriale 10 sections.
   Fichier autonome : 'use client', pas d'imports externes sauf react,
   framer-motion, lucide-react.
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
  brick: '#8b2020',
  brickDeep: '#6a1818',
  brickMid: '#a52828',
  brickLight: '#c43030',
  beige: '#f0e8d8',
  beigeDeep: '#e0d4bf',
  white: '#ffffff',
  dark: '#2c2c2c',
  darkMid: '#3d3d3d',
  darkLight: '#555555',
  overlay: 'rgba(44,44,44,0.88)',
};

/* ── Typographie ─────────────────────────────────────────────────────────── */
const SERIF = "'Montserrat', system-ui, sans-serif" as const;
const SANS = "'Open Sans', system-ui, sans-serif" as const;

/* ── Easing partagé ──────────────────────────────────────────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ── Photos Unsplash (IDs réels plomberie / habitat) ─────────────────────── */
const PHOTO = {
  salleBain:
    'https://images.unsplash.com/photo-1585771724684-38269d6639fd?q=80&w=1600&auto=format&fit=crop',
  plombier:
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1600&auto=format&fit=crop',
  chaudiere:
    'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?q=80&w=1600&auto=format&fit=crop',
  tuyauterie:
    'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=1600&auto=format&fit=crop',
  cuisine:
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=1600&auto=format&fit=crop',
  salleBainDesign:
    'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=1600&auto=format&fit=crop',
  heroWide:
    'https://images.unsplash.com/photo-1585771724684-38269d6639fd?q=80&w=1600&auto=format&fit=crop',
} as const;

/* ════════════════════════════════════════════════════════════════════════════
   Primitives partagées
   ════════════════════════════════════════════════════════════════════════════ */

/** Étiquette fine, capitales, interlettrage large, filet brique. */
function Eyebrow({
  children,
  color = C.brick,
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
    width: 46,
    height: 1,
    background: color,
    opacity: 0.7,
    flexShrink: 0,
  };
  const label: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 11,
    letterSpacing: '0.36em',
    textTransform: 'uppercase',
    color,
    fontWeight: 600,
  };
  return (
    <div style={wrap}>
      <span style={rule} />
      <span style={label}>{children}</span>
      {align === 'center' ? <span style={rule} /> : null}
    </div>
  );
}

/** Révélation au scroll : fondu + translation verticale, une seule fois. */
function Reveal({
  children,
  delay = 0,
  y = 38,
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

/** Bouton brique, flèche qui glisse au survol. */
function BrickButton({
  children,
  onClick,
  filled = false,
  type = 'button',
  href,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  filled?: boolean;
  type?: 'button' | 'submit';
  href?: string;
}) {
  const [hover, setHover] = useState(false);
  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 12,
    padding: '15px 28px',
    fontFamily: SANS,
    fontSize: 13,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    fontWeight: 700,
    cursor: 'pointer',
    border: `2px solid ${C.brick}`,
    background: filled ? C.brick : 'transparent',
    color: filled ? C.white : C.brick,
    transition: 'all .45s cubic-bezier(.16,1,.3,1)',
    textDecoration: 'none',
    borderRadius: 2,
  };
  const hov: React.CSSProperties = hover
    ? filled
      ? { background: C.brickDeep, borderColor: C.brickDeep, transform: 'translateY(-2px)', boxShadow: `0 12px 36px -10px rgba(139,32,32,0.55)` }
      : { background: 'rgba(139,32,32,0.08)', transform: 'translateY(-2px)' }
    : {};

  const inner = (
    <>
      {children}
      <ArrowRight
        size={16}
        style={{
          transform: hover ? 'translateX(5px)' : 'none',
          transition: 'transform .45s cubic-bezier(.16,1,.3,1)',
          flexShrink: 0,
        }}
      />
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{ ...base, ...hov }}
      >
        {inner}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ ...base, ...hov }}
    >
      {inner}
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
    const onScroll = () => setSolid(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: 'Services', href: '#services' },
    { label: 'Notre méthode', href: '#process' },
    { label: 'Réalisations', href: '#realisations' },
    { label: 'Certifications', href: '#certifications' },
    { label: 'Contact', href: '#devis' },
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
    padding: solid ? '14px clamp(20px,5vw,64px)' : '22px clamp(20px,5vw,64px)',
    background: solid ? 'rgba(44,44,44,0.96)' : 'transparent',
    backdropFilter: solid ? 'blur(16px) saturate(130%)' : 'none',
    WebkitBackdropFilter: solid ? 'blur(16px) saturate(130%)' : 'none',
    borderBottom: solid ? `1px solid rgba(139,32,32,0.35)` : '1px solid transparent',
    transition: 'all .55s cubic-bezier(.16,1,.3,1)',
  };
  const brand: React.CSSProperties = {
    fontFamily: SERIF,
    fontSize: 20,
    letterSpacing: '0.06em',
    color: C.white,
    textTransform: 'uppercase',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    textDecoration: 'none',
  };
  const linkRow: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'clamp(16px,2vw,34px)',
  };

  return (
    <>
      <nav style={bar}>
      <a href="#hero" style={brand}>
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
            <Droplets size={22} color={C.brick} strokeWidth={2} />
            Plomberie&nbsp;Garonne
          </>
        )}
      </a>
      <div style={linkRow} className="r278-navlinks">
        {links.map((l) => (
          <NavLink key={l.label} label={l.label} href={l.href} />
        ))}
      </div>
      <div className="r278-navcta">
        <BrickButton filled href="#devis">
          Devis gratuit
        </BrickButton>
      </div>
      
        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="r278-burger"
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
          .r278-navlinks{ display:none !important; }
          .r278-burger { display: flex !important; flex-direction: column; }
          .r278-navcta{ display:none !important; }
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
        letterSpacing: '0.06em',
        fontWeight: 600,
        color: h ? C.brick : 'rgba(255,255,255,0.88)',
        textDecoration: 'none',
        transition: 'color .35s',
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
          background: C.brick,
          transition: 'width .45s cubic-bezier(.16,1,.3,1)',
          borderRadius: 1,
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
  const titleOpacity = useTransform(scrollYProgress, [0, 0.72], [1, 0]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const section: React.CSSProperties = {
    position: 'relative',
    height: '100vh',
    minHeight: 640,
    overflow: 'hidden',
    background: C.dark,
  };

  return (
    <section id="hero" ref={ref} style={section}>
      {/* Photo plein cadre */}
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
          alt="Salle de bain moderne rénovée par Plomberie Garonne à Toulouse"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </motion.div>

      {/* Voile sombre */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(44,44,44,0.60) 0%, rgba(44,44,44,0.20) 35%, rgba(44,44,44,0.55) 68%, rgba(44,44,44,0.92) 100%)',
        }}
      />
      {/* Teinte brique sur le côté gauche */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(80% 80% at 20% 50%, rgba(139,32,32,0.30) 0%, transparent 70%)',
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
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '0 clamp(24px,8vw,120px)',
          maxWidth: 1240,
          y: titleY,
          opacity: titleOpacity,
        }}
      >
        <Reveal y={20}>
          <Eyebrow color="rgba(240,232,216,0.9)" align="left">
            Plombier-chauffagiste certifié · Toulouse &amp; agglo
          </Eyebrow>
        </Reveal>

        <motion.h1
          initial={{ opacity: 0, y: 44 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.12 }}
          style={{
            fontFamily: SERIF,
            fontWeight: 800,
            color: C.white,
            fontSize: 'clamp(46px, 7.5vw, 110px)',
            lineHeight: 1.0,
            letterSpacing: '-0.02em',
            margin: '28px 0 22px',
            textShadow: '0 8px 40px rgba(0,0,0,0.5)',
            maxWidth: 900,
          }}
        >
          L&apos;eau maîtrisée,{' '}
          <span style={{color: brand ?? '#e87070' }}>votre confort</span>{' '}
          assuré
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.38 }}
          style={{
            fontFamily: SANS,
            fontSize: 'clamp(16px, 1.8vw, 20px)',
            color: 'rgba(240,232,216,0.9)',
            maxWidth: 540,
            lineHeight: 1.7,
            fontWeight: 400,
            marginBottom: 36,
          }}
        >
          Intervention rapide sur toutes vos installations de plomberie,
          chauffage et salle de bain. Devis gratuit, tarifs transparents,
          garantie biennale sur tous nos travaux.
        </motion.p>

        {/* Badge urgence */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.54 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            background: 'rgba(139,32,32,0.90)',
            border: `1px solid rgba(200,80,80,0.6)`,
            padding: '10px 20px',
            borderRadius: 2,
            marginBottom: 32,
          }}
        >
          <Clock size={16} color="#e87070" strokeWidth={2} />
          <span
            style={{
              fontFamily: SANS,
              fontSize: 13,
              fontWeight: 700,
              color: C.white,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            Urgence fuite — Intervention sous 2h · 7j/7
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.7 }}
          style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}
        >
          <BrickButton filled href="#devis">
            Demander un devis gratuit
          </BrickButton>
          <BrickButton href={`tel:${fd?.phone ?? "+33561000000"}`}>
            <Phone size={15} strokeWidth={2} />
            05 61 00 00 00
          </BrickButton>
        </motion.div>
      </motion.div>

      {/* Cue défilement */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: 34,
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
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'rgba(240,232,216,0.65)',
            fontWeight: 600,
          }}
        >
          Découvrir
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={20} color="rgba(240,232,216,0.7)" strokeWidth={2} />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   2 · SCROLL CROSSFADE — 320vh sticky, 3 visuels + ProgressDots
   ════════════════════════════════════════════════════════════════════════════ */
type CrossfadeSlide = {
  src: string;
  alt: string;
  index: string;
  caption: string;
  sub: string;
};

const CROSSFADE_SLIDES: CrossfadeSlide[] = [
  {
    src: PHOTO.chaudiere,
    alt: 'Installation de chaudière à condensation par Plomberie Garonne',
    index: '01',
    caption: 'Chauffage',
    sub: 'Chaudière à condensation, pompe à chaleur, plancher chauffant — votre confort thermique entre de bonnes mains.',
  },
  {
    src: PHOTO.salleBainDesign,
    alt: 'Rénovation salle de bain design Toulouse',
    index: '02',
    caption: 'Salle de bain',
    sub: 'De la conception au carrelage, nous rénovons votre salle de bain clé en main, dans le respect des délais et du budget.',
  },
  {
    src: PHOTO.tuyauterie,
    alt: 'Tuyauterie cuivre installée par Plomberie Garonne',
    index: '03',
    caption: 'Tuyauterie',
    sub: 'Remplacement de canalisations, détection de fuites, mise aux normes — une plomberie invisible et fiable.',
  },
];

function CrossfadeImage({
  slide,
  i,
  total,
  progress,
}: {
  slide: CrossfadeSlide;
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
        src={slide.src}
        alt={slide.alt}
        loading="lazy"
        style={{ width: '100%', height: '100%', objectFit: 'cover', scale }}
      />
    </motion.div>
  );
}

function CrossfadeCaption({
  slide,
  i,
  total,
  progress,
}: {
  slide: CrossfadeSlide;
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
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '0 24px',
        opacity,
        y,
      }}
    >
      <span
        style={{
          fontFamily: SERIF,
          fontWeight: 800,
          fontSize: 'clamp(60px,11vw,140px)',
          color: 'rgba(240,232,216,0.12)',
          lineHeight: 1,
          marginBottom: 4,
          letterSpacing: '-0.04em',
        }}
      >
        {slide.index}
      </span>
      <h2
        style={{
          fontFamily: SERIF,
          fontSize: 'clamp(38px, 6.5vw, 90px)',
          fontWeight: 800,
          color: C.white,
          lineHeight: 1.0,
          margin: 0,
          textShadow: '0 8px 40px rgba(0,0,0,0.55)',
          letterSpacing: '-0.02em',
        }}
      >
        {slide.caption}
      </h2>
      <p
        style={{
          fontFamily: SANS,
          fontSize: 'clamp(15px, 1.7vw, 19px)',
          color: 'rgba(240,232,216,0.86)',
          marginTop: 18,
          maxWidth: 480,
          lineHeight: 1.65,
          fontWeight: 400,
        }}
      >
        {slide.sub}
      </p>
    </motion.div>
  );
}

function ProgressDot278({
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
    <motion.div style={{ height: 3, width, background: C.brick, opacity, borderRadius: 2 }} />
  );
}

function ScrollCrossfade() {
  const n = CROSSFADE_SLIDES.length;
  const progress = useMotionValue(0.5 / n);
  const [active, setActive] = useState(0);
  const goTo = (i: number) => {
    setActive(i);
    progress.set((i + 0.5) / n);
  };

  return (
    <div
      style={{ height: '100vh', overflow: 'hidden', position: 'relative', background: C.dark }}
    >
      <div
        style={{
          position: 'relative',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {CROSSFADE_SLIDES.map((slide, i) => (
          <CrossfadeImage
            key={slide.caption}
            slide={slide}
            i={i}
            total={CROSSFADE_SLIDES.length}
            progress={progress}
          />
        ))}
        {/* Voile lisibilité */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to bottom, rgba(44,44,44,0.42), rgba(44,44,44,0.12) 40%, rgba(44,44,44,0.62))',
          }}
        />
        {CROSSFADE_SLIDES.map((slide, i) => (
          <CrossfadeCaption
            key={slide.caption}
            slide={slide}
            i={i}
            total={CROSSFADE_SLIDES.length}
            progress={progress}
          />
        ))}

        {/* ProgressDots */}
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
          {CROSSFADE_SLIDES.map((slide, i) => (
            <ProgressDot278
              key={slide.index}
              i={i}
              total={CROSSFADE_SLIDES.length}
              progress={progress}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   3 · SERVICES SECTION
   ════════════════════════════════════════════════════════════════════════════ */
type Service = {
  icon: React.ReactNode;
  title: string;
  desc: string;
  items: string[];
};

const SERVICES: Service[] = [
  {
    icon: <Droplets size={36} strokeWidth={1.5} />,
    title: 'Plomberie générale',
    desc: 'Fuites, canalisations bouchées, installation sanitaire, mise aux normes — nous intervenons rapidement sur tous types de travaux de plomberie à Toulouse et dans un rayon de 30 km.',
    items: [
      'Détection et réparation de fuites',
      'Débouchage canalisations',
      'Remplacement robinetterie',
      'Mise aux normes NF',
      'Plomberie neuf et rénovation',
    ],
  },
  {
    icon: <Thermometer size={36} strokeWidth={1.5} />,
    title: 'Chauffage & PAC',
    desc: 'Installation et entretien de chaudières à condensation, pompes à chaleur air-eau et planchers chauffants. Experts RGE QualiPAC pour vos aides à la rénovation énergétique.',
    items: [
      'Chaudière gaz à condensation',
      'Pompe à chaleur air-eau',
      'Plancher chauffant hydraulique',
      'Entretien annuel chaudière',
      'Diagnostic énergétique',
    ],
  },
  {
    icon: <Home size={36} strokeWidth={1.5} />,
    title: 'Salle de bain clé en main',
    desc: "De la démolition au carrelage en passant par la plomberie, l'électricité et la faïence : votre salle de bain renovée de A à Z, dans le respect du cahier des charges et du budget.",
    items: [
      'Conception sur mesure',
      'Fourniture et pose sanitaires',
      'Carrelage & faïence',
      "Douche à l'italienne",
      'Accessibilité PMR',
    ],
  },
];

function ServiceCard({ svc, i }: { svc: Service; i: number }) {
  const [hover, setHover] = useState(false);
  const card: React.CSSProperties = {
    background: hover ? C.brick : C.white,
    border: `2px solid ${hover ? C.brick : C.beigeDeep}`,
    padding: 'clamp(32px,4vw,48px)',
    transform: hover ? 'translateY(-8px)' : 'none',
    boxShadow: hover
      ? `0 32px 64px -24px rgba(139,32,32,0.40)`
      : '0 8px 32px -20px rgba(44,44,44,0.15)',
    transition: 'all .5s cubic-bezier(.16,1,.3,1)',
    cursor: 'default',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    borderRadius: 2,
    boxSizing: 'border-box',
  };
  const iconWrap: React.CSSProperties = {
    width: 68,
    height: 68,
    borderRadius: 2,
    background: hover ? 'rgba(255,255,255,0.15)' : 'rgba(139,32,32,0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    color: hover ? C.white : C.brick,
    transition: 'all .5s cubic-bezier(.16,1,.3,1)',
    flexShrink: 0,
  };
  return (
    <Reveal delay={i * 0.1} style={{ height: '100%' }}>
      <article
        style={card}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div style={iconWrap}>{svc.icon}</div>
        <h3
          style={{
            fontFamily: SERIF,
            fontSize: 'clamp(22px,2.4vw,28px)',
            fontWeight: 700,
            color: hover ? C.white : C.dark,
            margin: '0 0 14px',
            transition: 'color .5s',
          }}
        >
          {svc.title}
        </h3>
        <p
          style={{
            fontFamily: SANS,
            fontSize: 15,
            lineHeight: 1.7,
            color: hover ? 'rgba(255,255,255,0.84)' : C.darkLight,
            margin: '0 0 24px',
            flex: 1,
            transition: 'color .5s',
          }}
        >
          {svc.desc}
        </p>
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {svc.items.map((item) => (
            <li
              key={item}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                fontFamily: SANS,
                fontSize: 13.5,
                color: hover ? 'rgba(255,255,255,0.88)' : C.darkMid,
                fontWeight: 600,
                transition: 'color .5s',
              }}
            >
              <CheckCircle
                size={15}
                color={hover ? 'rgba(255,255,255,0.7)' : C.brick}
                strokeWidth={2}
                style={{ flexShrink: 0, marginTop: 1 }}
              />
              {item}
            </li>
          ))}
        </ul>
      </article>
    </Reveal>
  );
}

function ServicesSection() {
  const sec: React.CSSProperties = {
    background: C.beige,
    padding: 'clamp(96px,13vw,180px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: 'clamp(24px,3vw,40px)',
    maxWidth: 1240,
    margin: '0 auto',
  };
  return (
    <section style={sec} id="services">
      <div style={{ maxWidth: 1240, margin: '0 auto 60px', textAlign: 'center' }}>
        <Reveal>
          <Eyebrow color={C.brick} align="center">
            Nos expertises
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(34px,5.5vw,68px)',
              fontWeight: 800,
              color: C.dark,
              margin: '20px 0 18px',
              lineHeight: 1.06,
              letterSpacing: '-0.02em',
            }}
          >
            Trois métiers,{' '}
            <span style={{ color: C.brick }}>une seule équipe</span>
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p
            style={{
              fontFamily: SANS,
              fontSize: 'clamp(16px,1.6vw,18px)',
              lineHeight: 1.75,
              color: C.darkLight,
              maxWidth: 600,
              margin: '0 auto',
            }}
          >
            Plomberie Garonne intervient sur l&apos;ensemble des corps de métier
            liés à l&apos;eau et au chauffage, du dépannage d&apos;urgence à la
            rénovation complète.
          </p>
        </Reveal>
      </div>
      <div style={grid}>
        {SERVICES.map((svc, i) => (
          <ServiceCard key={svc.title} svc={svc} i={i} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   4 · PROCESS SECTION — Left sticky photo + right scroll 4 étapes
   ════════════════════════════════════════════════════════════════════════════ */
type ProcessStep = {
  num: string;
  title: string;
  body: string;
  detail: string;
};

const PROCESS_STEPS: ProcessStep[] = [
  {
    num: '01',
    title: 'Diagnostic gratuit',
    body: 'Nous analysons votre installation sur place sans engagement. Bilan complet, identification des problèmes et conseils immédiats — aucun frais de déplacement en zone Toulouse.',
    detail: 'Réponse sous 24h · Déplacement offert',
  },
  {
    num: '02',
    title: 'Devis transparent',
    body: 'Un devis détaillé, ligne par ligne, sans coûts cachés. Nous expliquons chaque poste budgétaire et respectons le montant annoncé, quoi qu\'il arrive pendant les travaux.',
    detail: 'Devis écrit sous 48h · Prix ferme et définitif',
  },
  {
    num: '03',
    title: 'Intervention soignée',
    body: 'Nos plombiers arrivent à l\'heure, protègent vos sols et meubles, et laissent le chantier impeccable. Nous travaillons en silence et en respect de votre quotidien.',
    detail: 'Protection bâche · Nettoyage inclus',
  },
  {
    num: '04',
    title: 'Garantie biennale',
    body: 'Tous nos travaux sont couverts deux ans pièces et main-d\'œuvre. En cas de problème lié à notre intervention, nous revenons gratuitement, sans discussion.',
    detail: 'Garantie 2 ans · Assurance décennale',
  },
];

function ProcessSection() {
  const sec: React.CSSProperties = {
    background: C.white,
    padding: 'clamp(96px,13vw,180px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '0.95fr 1.05fr',
    gap: 'clamp(48px,7vw,100px)',
    maxWidth: 1240,
    margin: '0 auto',
    alignItems: 'start',
  };
  const stickySide: React.CSSProperties = {
    position: 'sticky',
    top: 100,
    alignSelf: 'start',
  };

  return (
    <section style={sec} id="process">
      <div style={grid} className="r278-process">
        {/* Photo collante du plombier */}
        <div style={stickySide} className="r278-process-sticky">
          <div
            style={{
              overflow: 'hidden',
              aspectRatio: '4 / 5',
              border: `2px solid ${C.beigeDeep}`,
              position: 'relative',
              borderRadius: 2,
            }}
          >
            <img
              src={PHOTO.plombier}
              alt="Plombier Plomberie Garonne au travail à Toulouse"
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            {/* Badge expérience */}
            <div
              style={{
                position: 'absolute',
                bottom: 24,
                left: 24,
                background: C.brick,
                padding: '14px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                borderRadius: 2,
              }}
            >
              <span
                style={{
                  fontFamily: SERIF,
                  fontSize: 30,
                  fontWeight: 800,
                  color: C.white,
                  lineHeight: 1,
                }}
              >
                15+
              </span>
              <span
                style={{
                  fontFamily: SANS,
                  fontSize: 11,
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.82)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                ans d&apos;expérience
              </span>
            </div>
          </div>
          <div style={{ marginTop: 24 }}>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: C.brick,
                marginBottom: 8,
              }}
            >
              Notre engagement qualité
            </div>
            <p
              style={{
                fontFamily: SANS,
                fontSize: 15,
                lineHeight: 1.7,
                color: C.darkLight,
                margin: 0,
              }}
            >
              Chaque chantier est suivi par un chef d&apos;équipe qualifié.
              Satisfaction garantie ou nous revenons.
            </p>
          </div>
        </div>

        {/* Étapes qui défilent */}
        <div>
          <Reveal>
            <Eyebrow color={C.brick}>Notre méthode</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(32px,4.8vw,62px)',
                fontWeight: 800,
                color: C.dark,
                margin: '20px 0 52px',
                lineHeight: 1.06,
                letterSpacing: '-0.02em',
              }}
            >
              Comment ça{' '}
              <span style={{ color: C.brick }}>se passe&nbsp;?</span>
            </h2>
          </Reveal>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {PROCESS_STEPS.map((step, i) => (
              <Reveal key={step.num} delay={0.06 * i}>
                <div
                  style={{
                    padding: 'clamp(28px,4vw,40px) 0',
                    borderTop: `2px solid ${C.beigeDeep}`,
                    display: 'grid',
                    gridTemplateColumns: '56px 1fr',
                    gap: 24,
                    alignItems: 'start',
                  }}
                >
                  <span
                    style={{
                      fontFamily: SERIF,
                      fontWeight: 800,
                      fontSize: 'clamp(28px,3vw,40px)',
                      color: C.brick,
                      lineHeight: 1,
                      opacity: 0.5,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {step.num}
                  </span>
                  <div>
                    <h3
                      style={{
                        fontFamily: SERIF,
                        fontSize: 'clamp(20px,2vw,24px)',
                        fontWeight: 700,
                        color: C.dark,
                        margin: '0 0 12px',
                      }}
                    >
                      {step.title}
                    </h3>
                    <p
                      style={{
                        fontFamily: SANS,
                        fontSize: 15,
                        lineHeight: 1.7,
                        color: C.darkLight,
                        margin: '0 0 14px',
                      }}
                    >
                      {step.body}
                    </p>
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        fontFamily: SANS,
                        fontSize: 12,
                        fontWeight: 700,
                        color: C.brick,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                      }}
                    >
                      <CheckCircle size={13} strokeWidth={2.5} />
                      {step.detail}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.3}>
            <div style={{ marginTop: 40 }}>
              <BrickButton filled href="#devis">
                Demander un devis gratuit
              </BrickButton>
            </div>
          </Reveal>
        </div>
      </div>
      <style>{`
        @media (max-width: 860px){
          .r278-process{ grid-template-columns: 1fr !important; }
          .r278-process-sticky{ position: static !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   5 · TESTIMONIALS SECTION
   ════════════════════════════════════════════════════════════════════════════ */
type Testimonial278 = {
  quote: string;
  name: string;
  role: string;
  work: string;
};

const TESTIMONIALS278: Testimonial278[] = [
  {
    quote:
      'Plomberie Garonne a rénové notre salle de bain en 8 jours, exactement dans le budget prévu. Le résultat est magnifique — douche à l\'italienne, plan vasque suspendu, tout est parfait. Je recommande les yeux fermés.',
    name: 'Sophie M.',
    role: 'Toulouse — Quartier Saint-Aubin',
    work: 'Rénovation salle de bain complète',
  },
  {
    quote:
      'Fuite sous l\'évier à 22h le dimanche soir. Appelé Plomberie Garonne, un technicien était chez moi 1h45 plus tard. Problème réglé en 40 minutes, tarif dimanche honnête et annoncé avant l\'intervention. Bluffant.',
    name: 'Thomas R.',
    role: 'Colomiers — Quartier Plein Sud',
    work: 'Urgence fuite 7j/7',
  },
  {
    quote:
      'Installation d\'une chaudière gaz à condensation + robinet thermostatique dans chaque pièce. Travail soigné, équipe propre et ponctuelle. La facture de gaz a baissé de 28% cet hiver. Excellent investissement.',
    name: 'Pierre et Claire D.',
    role: 'Tournefeuille',
    work: 'Installation chaudière condensation',
  },
];

function TestimonialCard({ t, i }: { t: Testimonial278; i: number }) {
  return (
    <Reveal delay={i * 0.12} style={{ height: '100%' }}>
      <figure
        style={{
          background: C.white,
          border: `1px solid ${C.beigeDeep}`,
          padding: 'clamp(30px,4vw,44px)',
          margin: 0,
          height: '100%',
          boxSizing: 'border-box',
          boxShadow: '0 16px 48px -32px rgba(44,44,44,0.20)',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 2,
        }}
      >
        <Quote size={32} color={C.brick} strokeWidth={1.5} style={{ flexShrink: 0 }} />
        {/* Étoiles */}
        <div style={{ display: 'flex', gap: 4, margin: '18px 0 16px' }}>
          {Array.from({ length: 5 }).map((_, s) => (
            <Star key={s} size={15} fill={C.brick} color={C.brick} strokeWidth={0} />
          ))}
        </div>
        {/* Type de travaux */}
        <div
          style={{
            fontFamily: SANS,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: C.brick,
            marginBottom: 14,
          }}
        >
          {t.work}
        </div>
        <blockquote
          style={{
            fontFamily: SANS,
            fontSize: 'clamp(15px,1.6vw,17px)',
            lineHeight: 1.7,
            color: C.dark,
            margin: '0 0 24px',
            flex: 1,
            fontStyle: 'italic',
            fontWeight: 400,
          }}
        >
          &ldquo;{t.quote}&rdquo;
        </blockquote>
        <figcaption
          style={{
            borderTop: `1px solid ${C.beigeDeep}`,
            paddingTop: 18,
          }}
        >
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 17,
              fontWeight: 700,
              color: C.dark,
            }}
          >
            {t.name}
          </div>
          <div
            style={{
              fontFamily: SANS,
              fontSize: 12,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: C.darkLight,
              marginTop: 4,
              fontWeight: 600,
            }}
          >
            {t.role}
          </div>
        </figcaption>
      </figure>
    </Reveal>
  );
}

function TestimonialsSection() {
  const sec: React.CSSProperties = {
    background: C.beige,
    padding: 'clamp(96px,13vw,180px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: 'clamp(24px,3vw,40px)',
    maxWidth: 1240,
    margin: '0 auto',
  };
  return (
    <section style={sec}>
      <div style={{ maxWidth: 1240, margin: '0 auto 60px', textAlign: 'center' }}>
        <Reveal>
          <Eyebrow color={C.brick} align="center">
            Avis clients
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(34px,5.5vw,68px)',
              fontWeight: 800,
              color: C.dark,
              margin: '20px 0 0',
              lineHeight: 1.06,
              letterSpacing: '-0.02em',
            }}
          >
            Ils nous font{' '}
            <span style={{ color: C.brick }}>confiance</span>
          </h2>
        </Reveal>
      </div>
      <div style={grid}>
        {TESTIMONIALS278.map((t, i) => (
          <TestimonialCard key={t.name} t={t} i={i} />
        ))}
      </div>
      {/* Note globale */}
      <Reveal delay={0.2}>
        <div
          style={{
            maxWidth: 1240,
            margin: '56px auto 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 32,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontFamily: SERIF,
                fontSize: 52,
                fontWeight: 800,
                color: C.brick,
                lineHeight: 1,
                letterSpacing: '-0.02em',
              }}
            >
              4.9
            </div>
            <div style={{ display: 'flex', gap: 3, justifyContent: 'center', margin: '6px 0 6px' }}>
              {Array.from({ length: 5 }).map((_, s) => (
                <Star key={s} size={16} fill={C.brick} color={C.brick} strokeWidth={0} />
              ))}
            </div>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 12,
                fontWeight: 600,
                color: C.darkLight,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              Note moyenne · 247 avis Google
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   6 · DEVIS FORM SECTION
   ════════════════════════════════════════════════════════════════════════════ */
type FormState = {
  prenom: string;
  nom: string;
  typeIntervention: string;
  adresse: string;
  telephone: string;
};

function DevisFormSection() {
  const [form, setForm] = useState<FormState>({
    prenom: '',
    nom: '',
    typeIntervention: '',
    adresse: '',
    telephone: '',
  });
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Partial<FormState>>({});

  const interventions = [
    'Urgence (fuite, dégât des eaux)',
    'Rénovation salle de bain',
    'Chauffage & PAC',
    'Installation sanitaire',
    'Entretien chaudière',
  ];

  const validate = (): boolean => {
    const newErrors: Partial<FormState> = {};
    if (!form.prenom.trim()) newErrors.prenom = 'Requis';
    if (!form.nom.trim()) newErrors.nom = 'Requis';
    if (!form.typeIntervention) newErrors.typeIntervention = 'Requis';
    if (!form.adresse.trim()) newErrors.adresse = 'Requis';
    if (!form.telephone.trim()) newErrors.telephone = 'Requis';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSent(true);
  };

  const sec: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    background: C.dark,
    padding: 'clamp(96px,13vw,180px) clamp(24px,6vw,96px)',
  };
  const fieldStyle: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    background: 'rgba(255,255,255,0.06)',
    border: `1.5px solid rgba(240,232,216,0.22)`,
    borderRadius: 2,
    padding: '16px 18px',
    fontFamily: SANS,
    fontSize: 16,
    color: C.white,
    outline: 'none',
    transition: 'border-color .3s',
  };
  const labelStyle: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 11,
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    color: C.beige,
    display: 'block',
    marginBottom: 8,
    fontWeight: 700,
  };
  const errorStyle: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 12,
    color: '#e87070',
    marginTop: 4,
    fontWeight: 600,
  };

  return (
    <section style={sec} id="devis">
      {/* Image de fond subtile */}
      <img
        src={PHOTO.salleBain}
        alt="Image de présentation"
        aria-hidden="true"
        loading="lazy"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.08,
        }}
      />
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: 760,
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <Reveal>
          <Eyebrow color="rgba(240,232,216,0.8)" align="center">
            Devis gratuit
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(36px,5.5vw,70px)',
              fontWeight: 800,
              color: C.white,
              margin: '22px 0 18px',
              lineHeight: 1.06,
              letterSpacing: '-0.02em',
            }}
          >
            Votre projet{' '}
            <span style={{color: brand ?? '#e87070' }}>en 48h</span>
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p
            style={{
              fontFamily: SANS,
              fontSize: 'clamp(15px,1.6vw,18px)',
              lineHeight: 1.75,
              color: 'rgba(240,232,216,0.78)',
              maxWidth: 520,
              margin: '0 auto 50px',
            }}
          >
            Remplissez le formulaire, nous vous répondons sous 48h avec un
            devis détaillé, sans engagement. Urgence ? Appelez directement le{' '}
            <strong style={{color: brand ?? '#e87070' }}>05 61 00 00 00</strong>.
          </p>
        </Reveal>

        {sent ? (
          <Reveal>
            <div
              style={{
                border: `2px solid rgba(139,32,32,0.6)`,
                padding: 'clamp(36px,5vw,56px)',
                background: 'rgba(139,32,32,0.12)',
                borderRadius: 2,
                textAlign: 'center',
              }}
            >
              <CheckCircle size={44} color={C.brick} strokeWidth={1.5} style={{ margin: '0 auto 20px' }} />
              <h3
                style={{
                  fontFamily: SERIF,
                  fontSize: 'clamp(24px,3vw,32px)',
                  fontWeight: 700,
                  color: C.white,
                  margin: '0 0 16px',
                }}
              >
                Demande reçue, {form.prenom}&nbsp;!
              </h3>
              <p
                style={{
                  fontFamily: SANS,
                  fontSize: 17,
                  color: 'rgba(240,232,216,0.82)',
                  margin: 0,
                  lineHeight: 1.65,
                }}
              >
                Nous avons bien enregistré votre demande pour{' '}
                <strong style={{color: brand ?? '#e87070', fontStyle: 'normal' }}>
                  {form.typeIntervention}
                </strong>{' '}
                à{' '}
                <strong style={{color: brand ?? '#e87070' }}>{form.adresse}</strong>.
                Nous vous rappelons au{' '}
                <strong style={{color: brand ?? '#e87070' }}>{form.telephone}</strong>{' '}
                sous 48h ouvrées.
              </p>
            </div>
          </Reveal>
        ) : (
          <Reveal delay={0.24}>
            <form
              onSubmit={onSubmit}
              noValidate
              style={{ display: 'flex', flexDirection: 'column', gap: 28, textAlign: 'left' }}
            >
              {/* Prénom + Nom côte à côte */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }} className="r278-formgrid">
                <div>
                  <label style={labelStyle} htmlFor="pg-prenom">Prénom</label>
                  <input
                    id="pg-prenom"
                    style={{
                      ...fieldStyle,
                      borderColor: errors.prenom ? '#e87070' : 'rgba(240,232,216,0.22)',
                    }}
                    value={form.prenom}
                    onChange={(e) => setForm({ ...form, prenom: e.target.value })}
                    placeholder="Sophie"
                    autoComplete="given-name"
                  />
                  {errors.prenom && <div style={errorStyle}>{errors.prenom}</div>}
                </div>
                <div>
                  <label style={labelStyle} htmlFor="pg-nom">Nom</label>
                  <input
                    id="pg-nom"
                    style={{
                      ...fieldStyle,
                      borderColor: errors.nom ? '#e87070' : 'rgba(240,232,216,0.22)',
                    }}
                    value={form.nom}
                    onChange={(e) => setForm({ ...form, nom: e.target.value })}
                    placeholder="Martin"
                    autoComplete="family-name"
                  />
                  {errors.nom && <div style={errorStyle}>{errors.nom}</div>}
                </div>
              </div>

              {/* Type d'intervention */}
              <div>
                <label style={labelStyle} htmlFor="pg-type">Type d&apos;intervention</label>
                <select
                  id="pg-type"
                  style={{
                    ...fieldStyle,
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    cursor: 'pointer',
                    color: form.typeIntervention ? C.white : 'rgba(240,232,216,0.4)',
                    borderColor: errors.typeIntervention ? '#e87070' : 'rgba(240,232,216,0.22)',
                  }}
                  value={form.typeIntervention}
                  onChange={(e) => setForm({ ...form, typeIntervention: e.target.value })}
                >
                  <option value="" style={{ color: C.dark }}>
                    Choisir un type d&apos;intervention…
                  </option>
                  {interventions.map((opt) => (
                    <option key={opt} value={opt} style={{ color: C.dark }}>
                      {opt}
                    </option>
                  ))}
                </select>
                {errors.typeIntervention && <div style={errorStyle}>{errors.typeIntervention}</div>}
              </div>

              {/* Adresse */}
              <div>
                <label style={labelStyle} htmlFor="pg-adresse">Adresse du chantier</label>
                <input
                  id="pg-adresse"
                  style={{
                    ...fieldStyle,
                    borderColor: errors.adresse ? '#e87070' : 'rgba(240,232,216,0.22)',
                  }}
                  value={form.adresse}
                  onChange={(e) => setForm({ ...form, adresse: e.target.value })}
                  placeholder="12 rue de la Garonne, 31000 Toulouse"
                  autoComplete="street-address"
                />
                {errors.adresse && <div style={errorStyle}>{errors.adresse}</div>}
              </div>

              {/* Téléphone */}
              <div>
                <label style={labelStyle} htmlFor="pg-tel">Téléphone</label>
                <input
                  id="pg-tel"
                  style={{
                    ...fieldStyle,
                    borderColor: errors.telephone ? '#e87070' : 'rgba(240,232,216,0.22)',
                  }}
                  value={form.telephone}
                  onChange={(e) => setForm({ ...form, telephone: e.target.value })}
                  placeholder="06 12 34 56 78"
                  autoComplete="tel"
                  type="tel"
                />
                {errors.telephone && <div style={errorStyle}>{errors.telephone}</div>}
              </div>

              <div style={{ textAlign: 'center', marginTop: 10 }}>
                <BrickButton filled type="submit">
                  Envoyer ma demande
                </BrickButton>
              </div>
            </form>
          </Reveal>
        )}
      </div>
      <style>{`
        @media (max-width: 860px){
          .r278-formgrid{ grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   7 · REALIZE SECTION — 3 réalisations photo
   ════════════════════════════════════════════════════════════════════════════ */
type Realization = {
  src: string;
  alt: string;
  title: string;
  detail: string;
  tag: string;
};

const REALIZATIONS: Realization[] = [
  {
    src: PHOTO.salleBainDesign,
    alt: 'Rénovation salle de bain design Toulouse — Plomberie Garonne',
    title: 'Salle de bain design',
    detail: 'Douche à l\'italienne, vasque suspendue, radiateur sèche-serviettes. Rénovation complète en 10 jours.',
    tag: 'Rénovation salle de bain',
  },
  {
    src: PHOTO.chaudiere,
    alt: 'Installation chaudière gaz condensation — Plomberie Garonne Toulouse',
    title: 'Chaudière gaz à condensation',
    detail: 'Remplacement d\'une ancienne chaudière fioul par une chaudière gaz haute performance. Économie estimée 35% sur la facture.',
    tag: 'Chauffage',
  },
  {
    src: PHOTO.cuisine,
    alt: 'Plomberie cuisine aménagée Toulouse — Plomberie Garonne',
    title: 'Cuisine équipée',
    detail: 'Raccordement plomberie cuisine complète — évier, lave-vaisselle, machine à café encastrée, alimentation îlot central.',
    tag: 'Plomberie générale',
  },
];

function RealizationCard({ r, i }: { r: Realization; i: number }) {
  const [hover, setHover] = useState(false);
  const card: React.CSSProperties = {
    overflow: 'hidden',
    transform: hover ? 'translateY(-6px)' : 'none',
    boxShadow: hover
      ? '0 32px 64px -24px rgba(44,44,44,0.30)'
      : '0 8px 32px -20px rgba(44,44,44,0.18)',
    transition: 'all .5s cubic-bezier(.16,1,.3,1)',
    cursor: 'default',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    borderRadius: 2,
    border: `1px solid ${C.beigeDeep}`,
  };
  return (
    <Reveal delay={i * 0.1} style={{ height: '100%' }}>
      <article
        style={card}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '4 / 3' }}>
          <img
            src={r.src}
            alt={r.alt}
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: hover ? 'scale(1.06)' : 'scale(1)',
              transition: 'transform .9s cubic-bezier(.16,1,.3,1)',
              display: 'block',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(44,44,44,0.60), transparent 60%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 18,
              left: 18,
              background: C.brick,
              padding: '6px 14px',
              borderRadius: 2,
              fontFamily: SANS,
              fontSize: 11,
              fontWeight: 700,
              color: C.white,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            {r.tag}
          </div>
        </div>
        <div
          style={{
            padding: 'clamp(20px,2.5vw,30px)',
            background: C.white,
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <h3
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(18px,2vw,22px)',
              fontWeight: 700,
              color: C.dark,
              margin: '0 0 10px',
            }}
          >
            {r.title}
          </h3>
          <p
            style={{
              fontFamily: SANS,
              fontSize: 14.5,
              lineHeight: 1.65,
              color: C.darkLight,
              margin: 0,
              flex: 1,
            }}
          >
            {r.detail}
          </p>
        </div>
      </article>
    </Reveal>
  );
}

function RealizeSection() {
  const sec: React.CSSProperties = {
    background: C.beige,
    padding: 'clamp(96px,13vw,180px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: 'clamp(24px,3vw,36px)',
    maxWidth: 1240,
    margin: '0 auto',
  };
  return (
    <section style={sec} id="realisations">
      <div style={{ maxWidth: 1240, margin: '0 auto 60px', textAlign: 'center' }}>
        <Reveal>
          <Eyebrow color={C.brick} align="center">
            Nos réalisations
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(34px,5.5vw,68px)',
              fontWeight: 800,
              color: C.dark,
              margin: '20px 0 18px',
              lineHeight: 1.06,
              letterSpacing: '-0.02em',
            }}
          >
            Du projet à la{' '}
            <span style={{ color: C.brick }}>réalité</span>
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p
            style={{
              fontFamily: SANS,
              fontSize: 'clamp(15px,1.6vw,18px)',
              lineHeight: 1.75,
              color: C.darkLight,
              maxWidth: 560,
              margin: '0 auto',
            }}
          >
            Chaque chantier est une référence. Voici quelques exemples récents
            de nos travaux réalisés à Toulouse et dans l&apos;agglomération.
          </p>
        </Reveal>
      </div>
      <div style={grid}>
        {REALIZATIONS.map((r, i) => (
          <RealizationCard key={r.title} r={r} i={i} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   8 · CERTIFICATIONS SECTION
   ════════════════════════════════════════════════════════════════════════════ */
type Certification = {
  icon: React.ReactNode;
  label: string;
  title: string;
  desc: string;
  benefit: string;
};

const CERTIFICATIONS: Certification[] = [
  {
    icon: <Award size={32} strokeWidth={1.5} />,
    label: 'RGE',
    title: 'Reconnu Garant de l\'Environnement',
    desc: 'Notre certification RGE vous permet d\'accéder aux aides de l\'État (MaPrimeRénov\', CEE) pour vos travaux de rénovation énergétique.',
    benefit: 'Jusqu\'à 10 000 € d\'aides',
  },
  {
    icon: <Flame size={32} strokeWidth={1.5} />,
    label: 'PG',
    title: 'Professionnel du Gaz',
    desc: 'Habilitation gaz obligatoire pour l\'installation, la modification et l\'entretien de tout équipement à gaz. Sécurité maximale garantie.',
    benefit: 'Conformité totale NF DTU',
  },
  {
    icon: <Thermometer size={32} strokeWidth={1.5} />,
    label: 'QualiPAC',
    title: 'Qualibat QualiPAC',
    desc: 'Qualification spécifique pour l\'installation de pompes à chaleur et systèmes géothermiques. Accès aux subventions pompe à chaleur.',
    benefit: 'Éligible aides PAC',
  },
  {
    icon: <Shield size={32} strokeWidth={1.5} />,
    label: 'Décennale',
    title: 'Assurance décennale',
    desc: 'Tous nos travaux de construction et rénovation sont couverts par notre assurance décennale pendant 10 ans. Votre investissement est protégé.',
    benefit: 'Protection 10 ans',
  },
];

function CertifCard({ c, i }: { c: Certification; i: number }) {
  const [hover, setHover] = useState(false);
  return (
    <Reveal delay={i * 0.1} style={{ height: '100%' }}>
      <div
        style={{
          background: hover ? C.dark : C.white,
          border: `2px solid ${hover ? C.dark : C.beigeDeep}`,
          padding: 'clamp(28px,3.5vw,40px)',
          transform: hover ? 'translateY(-6px)' : 'none',
          boxShadow: hover
            ? '0 28px 56px -20px rgba(44,44,44,0.40)'
            : '0 6px 24px -16px rgba(44,44,44,0.12)',
          transition: 'all .5s cubic-bezier(.16,1,.3,1)',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          height: '100%',
          boxSizing: 'border-box',
          borderRadius: 2,
          cursor: 'default',
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {/* Icône + label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: 2,
              background: hover ? 'rgba(255,255,255,0.12)' : 'rgba(139,32,32,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: hover ? C.white : C.brick,
              flexShrink: 0,
              transition: 'all .5s',
            }}
          >
            {c.icon}
          </div>
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 22,
              fontWeight: 800,
              color: hover ? 'rgba(255,255,255,0.5)' : C.brick,
              letterSpacing: '-0.02em',
              transition: 'color .5s',
            }}
          >
            {c.label}
          </div>
        </div>
        <h3
          style={{
            fontFamily: SERIF,
            fontSize: 'clamp(17px,1.8vw,20px)',
            fontWeight: 700,
            color: hover ? C.white : C.dark,
            margin: 0,
            transition: 'color .5s',
          }}
        >
          {c.title}
        </h3>
        <p
          style={{
            fontFamily: SANS,
            fontSize: 14.5,
            lineHeight: 1.65,
            color: hover ? 'rgba(255,255,255,0.75)' : C.darkLight,
            margin: 0,
            flex: 1,
            transition: 'color .5s',
          }}
        >
          {c.desc}
        </p>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            fontFamily: SANS,
            fontSize: 12,
            fontWeight: 700,
            color: hover ? '#e87070' : C.brick,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            transition: 'color .5s',
          }}
        >
          <CheckCircle size={14} strokeWidth={2.5} />
          {c.benefit}
        </div>
      </div>
    </Reveal>
  );
}

function CertificationsSection() {
  const sec: React.CSSProperties = {
    background: C.white,
    padding: 'clamp(96px,13vw,180px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: 'clamp(20px,2.5vw,32px)',
    maxWidth: 1240,
    margin: '0 auto',
  };
  return (
    <section style={sec} id="certifications">
      <div style={{ maxWidth: 1240, margin: '0 auto 60px', textAlign: 'center' }}>
        <Reveal>
          <Eyebrow color={C.brick} align="center">
            Qualifications &amp; certifications
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(34px,5.5vw,68px)',
              fontWeight: 800,
              color: C.dark,
              margin: '20px 0 18px',
              lineHeight: 1.06,
              letterSpacing: '-0.02em',
            }}
          >
            Des garanties{' '}
            <span style={{ color: C.brick }}>officielles</span>
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p
            style={{
              fontFamily: SANS,
              fontSize: 'clamp(15px,1.6vw,18px)',
              lineHeight: 1.75,
              color: C.darkLight,
              maxWidth: 580,
              margin: '0 auto',
            }}
          >
            Nos certifications vous protègent et vous permettent d&apos;accéder
            aux meilleures aides de l&apos;État pour vos travaux de rénovation
            énergétique.
          </p>
        </Reveal>
      </div>
      <div style={grid}>
        {CERTIFICATIONS.map((c, i) => (
          <CertifCard key={c.label} c={c} i={i} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   9 · URGENCY SECTION — Intervention urgence fuite
   ════════════════════════════════════════════════════════════════════════════ */
function UrgencySection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['-9%', '9%']);

  const sec: React.CSSProperties = {
    position: 'relative',
    minHeight: '80vh',
    display: 'flex',
    alignItems: 'center',
    overflow: 'hidden',
    background: C.dark,
    padding: 'clamp(80px,12vw,150px) clamp(24px,6vw,96px)',
  };

  const stats: { icon: React.ReactNode; k: string; v: string }[] = [
    { icon: <Clock size={20} strokeWidth={2} />, k: '< 2h', v: 'Délai d\'intervention' },
    { icon: <MapPin size={20} strokeWidth={2} />, k: '30 km', v: 'Rayon d\'intervention' },
    { icon: <CheckCircle size={20} strokeWidth={2} />, k: '7j/7', v: 'Disponibilité' },
    { icon: <Wrench size={20} strokeWidth={2} />, k: 'Prix fixe', v: 'Dimanche & nuit' },
  ];

  return (
    <section ref={ref} style={sec} id="urgence">
      <motion.div
        style={{ position: 'absolute', inset: '-10% 0', height: '120%', y }}
      >
        <img
          src={PHOTO.tuyauterie}
          alt="Intervention urgence plomberie Toulouse — Plomberie Garonne"
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </motion.div>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to right, rgba(139,32,32,0.92) 0%, rgba(44,44,44,0.85) 50%, rgba(44,44,44,0.40) 100%)',
        }}
      />
      <div style={{ position: 'relative', zIndex: 2, maxWidth: 1240, width: '100%' }}>
        <div style={{ maxWidth: 700 }}>
          <Reveal>
            <Eyebrow color="rgba(240,232,216,0.85)">
              Urgence 24h/7j
            </Eyebrow>
          </Reveal>
          <Reveal delay={0.1}>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(36px,5.5vw,76px)',
                fontWeight: 800,
                color: C.white,
                margin: '22px 0 20px',
                lineHeight: 1.05,
                letterSpacing: '-0.02em',
              }}
            >
              Une fuite ?{' '}
              <span style={{color: brand ?? '#e87070' }}>
                On arrive.
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.18}>
            <p
              style={{
                fontFamily: SANS,
                fontSize: 'clamp(15px,1.7vw,19px)',
                lineHeight: 1.75,
                color: 'rgba(240,232,216,0.86)',
                maxWidth: 520,
                marginBottom: 40,
              }}
            >
              Fuite d&apos;eau, canalisation bouchée, chaudière en panne — nos
              techniciens sont disponibles 7 jours sur 7, dimanches et jours
              fériés inclus. Prix fixe annoncé avant toute intervention.
              Aucune mauvaise surprise.
            </p>
          </Reveal>
          <Reveal delay={0.26}>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 56 }}>
              <BrickButton filled href={`tel:${fd?.phone ?? "+33561000000"}`}>
                <Phone size={16} strokeWidth={2} />
                Appeler maintenant
              </BrickButton>
              <BrickButton href="#devis">
                Devis en ligne
              </BrickButton>
            </div>
          </Reveal>
          <Reveal delay={0.34}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: 'clamp(16px,2.5vw,28px)',
              }}
            >
              {stats.map((s) => (
                <div
                  key={s.k}
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.14)',
                    padding: 'clamp(16px,2vw,22px)',
                    borderRadius: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                  }}
                >
                  <div style={{color: brand ?? '#e87070' }}>{s.icon}</div>
                  <div
                    style={{
                      fontFamily: SERIF,
                      fontSize: 'clamp(22px,2.6vw,32px)',
                      fontWeight: 800,
                      color: C.white,
                      lineHeight: 1,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {s.k}
                  </div>
                  <div
                    style={{
                      fontFamily: SANS,
                      fontSize: 12,
                      fontWeight: 600,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: 'rgba(240,232,216,0.65)',
                    }}
                  >
                    {s.v}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   10 · FOOTER SECTION
   ════════════════════════════════════════════════════════════════════════════ */
function FooterSection() {
  const zones = [
    'Toulouse',
    'Blagnac',
    'Colomiers',
    'Tournefeuille',
    'L\'Union',
    'Balma',
    'Castanet-Tolosan',
    'Ramonville',
    'Muret',
    'Saint-Orens',
  ];

  const colServices = [
    { label: 'Plomberie générale', href: '#services' },
    { label: 'Chauffage & PAC', href: '#services' },
    { label: 'Salle de bain clé en main', href: '#services' },
    { label: 'Urgence 7j/7', href: '#urgence' },
    { label: 'Devis gratuit', href: '#devis' },
  ];

  const colInfos = [
    { label: 'Notre méthode', href: '#process' },
    { label: 'Réalisations', href: '#realisations' },
    { label: 'Certifications', href: '#certifications' },
    { label: 'Avis clients', href: '#avis' },
  ];

  const foot: React.CSSProperties = {
    background: C.dark,
    borderTop: `3px solid ${C.brick}`,
    padding: 'clamp(70px,9vw,110px) clamp(24px,6vw,96px) 40px',
  };

  return (
    <footer style={foot} id="contact">
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.6fr 1fr 1fr',
          gap: 'clamp(36px,5vw,70px)',
        }}
        className="r278-footgrid"
      >
        {/* Colonne brand */}
        <div>
          <a
            href="#hero"
            style={{
              fontFamily: SERIF,
              fontSize: 24,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: C.white,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              textDecoration: 'none',
              fontWeight: 800,
              marginBottom: 18,
            }}
          >
            <Droplets size={24} color={C.brick} strokeWidth={2} />{fd?.businessName ?? "Plomberie Garonne"}</a>
          <p
            style={{
              fontFamily: SANS,
              fontSize: 15,
              lineHeight: 1.7,
              color: 'rgba(240,232,216,0.66)',
              marginTop: 0,
              marginBottom: 22,
              maxWidth: 320,
            }}
          >
            Plombier-chauffagiste certifié RGE et QualiPAC à Toulouse.
            Devis gratuit, intervention sous 48h. Urgences 7j/7.
          </p>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 12,
              fontFamily: SANS,
              fontSize: 14,
              color: 'rgba(240,232,216,0.72)',
              fontWeight: 600,
            }}
          >
            <MapPin size={16} color={C.brick} strokeWidth={2} />
            Toulouse &amp; agglo (30 km)
          </div>
          <a
            href={`tel:${fd?.phone ?? "+33561000000"}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              fontFamily: SANS,
              fontSize: 18,
              fontWeight: 700,
              color: C.white,
              textDecoration: 'none',
              marginBottom: 20,
            }}
          >
            <Phone size={17} color={C.brick} strokeWidth={2} />
            05 61 00 00 00
          </a>
          {/* Zones */}
          <div style={{ marginTop: 8 }}>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 10.5,
                letterSpacing: '0.20em',
                textTransform: 'uppercase',
                color: C.brick,
                marginBottom: 12,
                fontWeight: 700,
              }}
            >
              Zones d&apos;intervention
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 10px' }}>
              {zones.map((z) => (
                <span
                  key={z}
                  style={{
                    fontFamily: SANS,
                    fontSize: 12.5,
                    color: 'rgba(240,232,216,0.58)',
                    fontWeight: 500,
                  }}
                >
                  {z}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Colonne services */}
        <div>
          <div
            style={{
              fontFamily: SANS,
              fontSize: 10.5,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: C.brick,
              marginBottom: 22,
              fontWeight: 700,
            }}
          >
            Nos services
          </div>
          <ul
            style={{
              listStyle: 'none',
              margin: 0,
              padding: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
            }}
          >
            {colServices.map((it) => (
              <li key={it.label}>
                <a
                  href={it.href}
                  style={{
                    fontFamily: SANS,
                    fontSize: 15,
                    color: 'rgba(240,232,216,0.70)',
                    textDecoration: 'none',
                    fontWeight: 500,
                    transition: 'color .3s',
                  }}
                  onMouseEnter={(e) => { (e.target as HTMLElement).style.color = C.white; }}
                  onMouseLeave={(e) => { (e.target as HTMLElement).style.color = 'rgba(240,232,216,0.70)'; }}
                >
                  {it.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Colonne infos */}
        <div>
          <div
            style={{
              fontFamily: SANS,
              fontSize: 10.5,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: C.brick,
              marginBottom: 22,
              fontWeight: 700,
            }}
          >
            Informations
          </div>
          <ul
            style={{
              listStyle: 'none',
              margin: 0,
              padding: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
            }}
          >
            {colInfos.map((it) => (
              <li key={it.label}>
                <a
                  href={it.href}
                  style={{
                    fontFamily: SANS,
                    fontSize: 15,
                    color: 'rgba(240,232,216,0.70)',
                    textDecoration: 'none',
                    fontWeight: 500,
                    transition: 'color .3s',
                  }}
                  onMouseEnter={(e) => { (e.target as HTMLElement).style.color = C.white; }}
                  onMouseLeave={(e) => { (e.target as HTMLElement).style.color = 'rgba(240,232,216,0.70)'; }}
                >
                  {it.label}
                </a>
              </li>
            ))}
          </ul>
          {/* CTA urgence */}
          <div
            style={{
              marginTop: 36,
              background: 'rgba(139,32,32,0.22)',
              border: `1px solid rgba(139,32,32,0.45)`,
              borderRadius: 2,
              padding: '20px 18px',
            }}
          >
            <div
              style={{fontFamily: SANS,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: brand ?? '#e87070',
                marginBottom: 8,
              }}
            >
              Urgence plomberie
            </div>
            <a
              href={`tel:${fd?.phone ?? "+33561000000"}`}
              style={{
                fontFamily: SERIF,
                fontSize: 20,
                fontWeight: 800,
                color: C.white,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Phone size={16} strokeWidth={2} color="#e87070" />
              05 61 00 00 00
            </a>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 12,
                color: 'rgba(240,232,216,0.55)',
                marginTop: 6,
                fontWeight: 500,
              }}
            >
              7j/7 · 24h/24 · Intervention &lt; 2h
            </div>
          </div>
        </div>
      </div>

      {/* Barre du bas */}
      <div
        style={{
          maxWidth: 1240,
          margin: '60px auto 0',
          paddingTop: 26,
          borderTop: `1px solid rgba(240,232,216,0.12)`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 14,
          fontFamily: SANS,
          fontSize: 12,
          letterSpacing: '0.04em',
          color: 'rgba(240,232,216,0.45)',
        }}
      >
        <span>
          © 2024 Plomberie Garonne — SIRET 000 000 000 00000 · Toulouse (31)
        </span>
        <span style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <a href="#hero" style={{ color: 'inherit', textDecoration: 'none' }}>
            Mentions légales
          </a>
          <a href="#hero" style={{ color: 'inherit', textDecoration: 'none' }}>
            Politique de confidentialité
          </a>
          <a href="#devis" style={{ color: 'inherit', textDecoration: 'none' }}>
            Devis gratuit
          </a>
        </span>
      </div>
      <style>{`
        @media (max-width: 860px){
          .r278-footgrid{ grid-template-columns: 1fr 1fr !important; }
          .r278-footgrid > *:first-child{ grid-column: 1 / -1; }
        }
        @media (max-width: 540px){
          .r278-footgrid{ grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   PAGE — Impact278Page
   ════════════════════════════════════════════════════════════════════════════ */

// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
function Impact278Page() {
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
    C = { ...C, brick: brand, brickLight: shadeColor(brand, 25) };
  }

  const root: React.CSSProperties = {
    background: C.dark,
    color: C.dark,
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
      {/* Import Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&family=Open+Sans:wght@400;500;600;700&display=swap');

        /* ── Reset & base ── */
        *, *::before, *::after { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        img { max-width: 100%; }
        input, select, textarea { font-size: 16px; } /* iOS zoom prevention */

        /* ── Focus visible ── */
        a:focus-visible,
        button:focus-visible,
        input:focus-visible,
        select:focus-visible,
        textarea:focus-visible {
          outline: 2px solid #8b2020;
          outline-offset: 3px;
        }

        /* ── Input placeholder ── */
        input::placeholder,
        textarea::placeholder {
          color: rgba(240,232,216,0.35);
        }
        select option {
          background: #2c2c2c;
          color: #f0e8d8;
        }

        /* ── Responsive breakpoints (préfixe r278-) ── */
        @media (max-width: 860px) {
          .r278-navlinks { display: none !important; }
          .r278-navcta { display: none !important; }
          .r278-process { grid-template-columns: 1fr !important; }
          .r278-process-sticky { position: static !important; }
          .r278-formgrid { grid-template-columns: 1fr !important; }
          .r278-footgrid { grid-template-columns: 1fr 1fr !important; }
          .r278-footgrid > *:first-child { grid-column: 1 / -1; }
        }

        @media (max-width: 540px) {
          .r278-footgrid { grid-template-columns: 1fr !important; }
        }

        /* ── prefers-reduced-motion ── */
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <Nav />
      <HeroSection />
      <ScrollCrossfade />
      <ServicesSection />
      <ProcessSection />
      <TestimonialsSection />
      <DevisFormSection />
      <RealizeSection />
      <CertificationsSection />
      <UrgencySection />
      <FooterSection />
    </main>
  );
}

export default Impact278Page;
