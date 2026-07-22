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
  Flame,
  Dumbbell,
  Trophy,
  Star,
  Check,
  MapPin,
  Phone,
  Mail,
  Camera,
  Play,
  Clock,
  Award,
  Target,
  Users,
  TrendingUp,
  Zap,
  Heart,
  Leaf,
  BarChart2,
} from 'lucide-react';

/* ════════════════════════════════════════════════════════════════════════════
   THOMAS LEBRUN COACH — Coach sportif & nutrition · Bordeaux Caudéran
   Template Skylaunch premium · style sport/impact · 'use client' · auto-suffisant.
   Palette : noir intense / orange vif / blanc pur / gris acier
   ════════════════════════════════════════════════════════════════════════════ */

/* ── Palette ─────────────────────────────────────────────────────────────── */
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
  black: '#111111',
  blackDeep: '#0a0a0a',
  steel: '#2a2a2a',
  steelMid: '#3a3a3a',
  steelLight: '#4a4a4a',
  orange: '#e8520a',
  orangeHot: '#ff6a1a',
  orangeDark: '#c44408',
  white: '#ffffff',
  offWhite: '#f5f5f5',
  muted: '#999999',
  mutedLight: '#bbbbbb',
  border: 'rgba(255,255,255,0.10)',
  borderOrange: 'rgba(232,82,10,0.35)',
  overlay: 'rgba(17,17,17,0.70)',
  overlayHeavy: 'rgba(17,17,17,0.85)',
};

/* ── Typographies ────────────────────────────────────────────────────────── */
const SERIF = "'Barlow Condensed', Impact, sans-serif" as const;
const SANS = "'DM Sans', system-ui, sans-serif" as const;

/* ── Photos Unsplash (IDs réels vérifiés) ───────────────────────────────── */
const PHOTO = {
  gym: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1600&auto=format&fit=crop',
  training: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1600&auto=format&fit=crop',
  nutrition: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1600&auto=format&fit=crop',
  coach: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1600&auto=format&fit=crop',
  outdoor: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=1600&auto=format&fit=crop',
  results: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1600&auto=format&fit=crop',
} as const;

/* ── Easing partagé ──────────────────────────────────────────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ════════════════════════════════════════════════════════════════════════════
   Primitives partagées
   ════════════════════════════════════════════════════════════════════════════ */

/** Étiquette fine capitales orange avec filet latéral. */
function Eyebrow({
  children,
  align = 'left',
  light = false,
}: {
  children: React.ReactNode;
  align?: 'left' | 'center';
  light?: boolean;
}) {
  const wrap: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    justifyContent: align === 'center' ? 'center' : 'flex-start',
  };
  const rule: React.CSSProperties = {
    width: 40,
    height: 2,
    background: C.orange,
    flexShrink: 0,
  };
  const label: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 11,
    letterSpacing: '0.38em',
    textTransform: 'uppercase',
    color: light ? C.orange : C.orange,
    fontWeight: 600,
  };
  return (
    <div style={wrap}>
      <span style={rule} />
      <span style={label}>{children}</span>
      {align === 'center' && <span style={rule} />}
    </div>
  );
}

/** Révélation au scroll : fondu + translation verticale, une seule fois. */
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

/** Bouton CTA orange plein ou contour. */
function OrangeButton({
  children,
  onClick,
  filled = true,
  type = 'button',
  large = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  filled?: boolean;
  type?: 'button' | 'submit';
  large?: boolean;
}) {
  const [hover, setHover] = useState(false);
  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 10,
    padding: large ? '18px 40px' : '14px 30px',
    fontFamily: SERIF,
    fontSize: large ? 20 : 16,
    letterSpacing: '0.10em',
    textTransform: 'uppercase',
    fontWeight: 700,
    cursor: 'pointer',
    border: `2px solid ${C.orange}`,
    background: filled ? (hover ? C.orangeHot : C.orange) : 'transparent',
    color: filled ? C.white : hover ? C.orange : C.white,
    transition: 'all .3s cubic-bezier(.16,1,.3,1)',
    outline: 'none',
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
        size={large ? 20 : 16}
        style={{
          transform: hover ? 'translateX(5px)' : 'none',
          transition: 'transform .3s cubic-bezier(.16,1,.3,1)',
        }}
      />
    </button>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   Navigation : transparente → noire au scroll
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

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const navStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 40px',
    height: 70,
    background: solid ? C.black : 'transparent',
    borderBottom: solid ? `1px solid ${C.border}` : 'none',
    transition: 'background .4s ease, border-bottom .4s ease',
  };

  const logoStyle: React.CSSProperties = {
    fontFamily: SERIF,
    fontSize: 22,
    fontWeight: 900,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: C.white,
  };

  const linkStyle: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 13,
    fontWeight: 500,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: C.mutedLight,
    cursor: 'pointer',
    transition: 'color .2s',
    background: 'none',
    border: 'none',
    padding: 0,
  };

  const links = [
    { label: 'Programmes', id: 'programmes' },
    { label: 'Méthode', id: 'methode' },
    { label: 'Résultats', id: 'transformations' },
    { label: 'Planning', id: 'planning' },
  ];

  return (
    <>
      
        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="r276-burger"
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
        .r276-nav-links { display: flex; gap: 32px; }
        .r276-nav-link:hover { color: ${C.white} !important; }
        @media (max-width: 860px) {
          .r276-nav-links { display: none; }
          .r276-burger { display: flex !important; flex-direction: column; }
          .r276-nav-cta { display: none; }
        }
      `}</style>
      <nav style={navStyle}>
        {fd?.logoBase64 ? (
          // Client logo (uploaded in the brief) replaces the placeholder mark —
          // essential for the client to recognise their brand in the render.
          <img
            src={fd.logoBase64}
            alt={fd?.businessName ?? 'logo'}
            style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
          />
        ) : (
          <span style={logoStyle}>
            {fd?.businessName ?? (<>TL<span style={{ color: C.orange }}>Coach</span></>)}
          </span>
        )}
        <div className="r276-nav-links">
          {links.map((l) => (
            <button
              key={l.id}
              className="r276-nav-link"
              style={linkStyle}
              onClick={() => scrollTo(l.id)}
            >
              {l.label}
            </button>
          ))}
        </div>
        <div className="r276-nav-cta">
          <button
            style={{
              ...linkStyle,
              color: C.orange,
              border: `1px solid ${C.orange}`,
              padding: '8px 20px',
              fontFamily: SERIF,
              fontSize: 14,
              fontWeight: 700,
            }}
            onClick={() => scrollTo('bilan')}
          >
            Bilan Gratuit
          </button>
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
              href={`#${l.id}`}
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

/* ════════════════════════════════════════════════════════════════════════════
   1 · HeroSection — fond salle de sport, titre impactant, CTA bilan
   ════════════════════════════════════════════════════════════════════════════ */
function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.10]);
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);
  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const scrollDown = () => {
    document.getElementById('crossfade')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <style>{`
        .r276-hero-title {
          font-family: ${SERIF};
          font-size: clamp(72px, 12vw, 160px);
          font-weight: 900;
          line-height: 0.88;
          letter-spacing: -0.02em;
          text-transform: uppercase;
          color: ${C.white};
        }
        .r276-hero-sub {
          font-family: ${SANS};
          font-size: clamp(16px, 2vw, 22px);
          color: ${C.mutedLight};
          line-height: 1.6;
          max-width: 480px;
        }
        .r276-hero-orange { color: ${C.orange}; }
        @media (max-width: 860px) {
          .r276-hero-inner { padding: 0 24px !important; }
          .r276-hero-title { font-size: clamp(56px, 16vw, 80px) !important; }
        }
      `}</style>
      <section
        ref={ref}
        id="hero"
        style={{
          position: 'relative',
          height: '100dvh',
          minHeight: 640,
          overflow: 'hidden',
          background: C.blackDeep,
        }}
      >
        {/* Photo fond parallaxe */}
        <motion.div
          style={{
            position: 'absolute',
            inset: '-10% 0',
            y: imgY,
          }}
        >
          <motion.img
            src={fd?.photoUrls?.[0] || PHOTO.gym}
            alt="Salle de sport Thomas Lebrun Coach Bordeaux"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              scale: imgScale,
            }}
          />
        </motion.div>

        {/* Overlay gradient */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(to right, rgba(17,17,17,0.92) 40%, rgba(17,17,17,0.50) 100%)`,
          }}
        />
        {/* Ligne orange décorative bas */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 3,
            background: C.orange,
          }}
        />

        {/* Contenu */}
        <motion.div
          className="r276-hero-inner"
          style={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            height: '100%',
            padding: '0 80px',
            y: titleY,
            opacity: titleOpacity,
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
          >
            <Eyebrow>Coach sportif & nutrition · Bordeaux Caudéran</Eyebrow>
          </motion.div>

          <motion.h1
            className="r276-hero-title"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, ease: EASE, delay: 0.25 }}
            style={{ marginTop: 24, marginBottom: 0 }}
          >
            DÉPASSE<br />
            <span className="r276-hero-orange">TES</span><br />
            LIMITES
          </motion.h1>

          <motion.p
            className="r276-hero-sub"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, ease: EASE, delay: 0.45 }}
            style={{ marginTop: 28, marginBottom: 36 }}
          >
            Coaching personnalisé pour des résultats réels et durables.
            Performance, nutrition et suivi sur-mesure à Bordeaux.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.65 }}
            style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}
          >
            <OrangeButton
              large
              onClick={() =>
                document.getElementById('bilan')?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              Bilan Gratuit
            </OrangeButton>
            <button
              onClick={() =>
                document.getElementById('programmes')?.scrollIntoView({ behavior: 'smooth' })
              }
              style={{
                fontFamily: SANS,
                fontSize: 14,
                fontWeight: 500,
                color: C.mutedLight,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                letterSpacing: '0.06em',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                textTransform: 'uppercase',
              }}
            >
              Voir les programmes
              <ArrowRight size={16} />
            </button>
          </motion.div>

          {/* Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.9 }}
            style={{
              display: 'flex',
              gap: 24,
              marginTop: 56,
              flexWrap: 'wrap',
            }}
          >
            {[
              { value: '8 ans', label: "d'expérience" },
              { value: '+300', label: 'clients transformés' },
              { value: '98%', label: 'de satisfaction' },
            ].map((b) => (
              <div key={b.label} style={{ borderLeft: `2px solid ${C.orange}`, paddingLeft: 14 }}>
                <div
                  style={{
                    fontFamily: SERIF,
                    fontSize: 28,
                    fontWeight: 900,
                    color: C.white,
                    lineHeight: 1,
                  }}
                >
                  {b.value}
                </div>
                <div
                  style={{
                    fontFamily: SANS,
                    fontSize: 12,
                    color: C.muted,
                    marginTop: 4,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  {b.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll cue */}
        <motion.button
          onClick={scrollDown}
          style={{
            position: 'absolute',
            bottom: 32,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            zIndex: 3,
          }}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={30} color={C.orange} />
        </motion.button>
      </section>
    </>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   2 · ScrollCrossfade — 320vh sticky, 3 visuels + ProgressDots
   ════════════════════════════════════════════════════════════════════════════ */
type CrossfadeSlide = {
  src: string;
  alt: string;
  num: string;
  title: string;
  sub: string;
  tag: string;
};

const SLIDES: CrossfadeSlide[] = [
  {
    src: PHOTO.training,
    alt: "Séance d'entraînement avec Thomas Lebrun Coach",
    num: '01',
    tag: 'Entraînement',
    title: 'CHAQUE SÉANCE\nCOMPTE',
    sub: "Des programmes d'entraînement taillés pour votre corps, votre niveau et vos objectifs. Intensité progressive, technique irréprochable.",
  },
  {
    src: PHOTO.nutrition,
    alt: 'Plan nutrition personnalisé Thomas Lebrun Coach',
    num: '02',
    tag: 'Nutrition',
    title: 'MANGER\nPOUR PERFORMER',
    sub: 'La nutrition comme levier de performance — pas comme une contrainte. Plans sur-mesure, flexibles et durables dans le temps.',
  },
  {
    src: PHOTO.results,
    alt: 'Résultats avant/après coaching sportif Bordeaux',
    num: '03',
    tag: 'Résultats',
    title: 'DES RÉSULTATS\nMESURABLES',
    sub: 'Transformations réelles, chiffres concrets. Perte de poids, prise de masse, endurance — chaque objectif atteint avec méthode.',
  },
];

function SlideImage({
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
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          scale,
        }}
      />
      {/* Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(17,17,17,0.85) 25%, rgba(17,17,17,0.30) 70%, transparent 100%)',
        }}
      />
    </motion.div>
  );
}

function SlideCaption({
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
    i === 0 ? [1, 1, 1, 0] : i === total - 1 ? [0, 1, 1, 1] : [0, 1, 1, 0],
  );
  const y = useTransform(progress, [start, end], [28, -28]);

  const lines = slide.title.split('\n');

  return (
    <motion.div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '60px 80px',
        opacity,
        y,
      }}
      className="r276-slide-caption"
    >
      <div
        style={{
          fontFamily: SANS,
          fontSize: 11,
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          color: C.orange,
          fontWeight: 600,
          marginBottom: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <span
          style={{
            display: 'inline-block',
            width: 32,
            height: 2,
            background: C.orange,
          }}
        />
        {slide.tag}
      </div>
      <h2
        style={{
          fontFamily: SERIF,
          fontSize: 'clamp(48px, 7vw, 96px)',
          fontWeight: 900,
          lineHeight: 0.9,
          textTransform: 'uppercase',
          color: C.white,
          margin: 0,
        }}
      >
        {lines[0]}<br />
        <span style={{ color: C.orange }}>{lines[1]}</span>
      </h2>
      <p
        style={{
          fontFamily: SANS,
          fontSize: 'clamp(14px, 1.2vw, 17px)',
          color: C.mutedLight,
          lineHeight: 1.65,
          maxWidth: 520,
          marginTop: 18,
        }}
      >
        {slide.sub}
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
    [i * seg, (i + 0.5) * seg, (i + 1) * seg],
    [0.35, 1, 0.35],
  );
  const width = useTransform(progress, [i * seg, (i + 1) * seg], [8, 28]);

  return (
    <motion.div
      style={{
        height: 3,
        background: C.orange,
        borderRadius: 2,
        opacity,
        width,
      }}
    />
  );
}

function ScrollCrossfade() {
  const n = SLIDES.length;
  const progress = useMotionValue(0.5 / n);
  const [active, setActive] = useState(0);
  const goTo = (i: number) => {
    setActive(i);
    progress.set((i + 0.5) / n);
  };

  return (
    <>
      <style>{`
        .r276-slide-caption { padding: 60px 80px !important; }
        @media (max-width: 860px) {
          .r276-slide-caption { padding: 32px 24px !important; }
        }
      `}</style>
      <section
        id="crossfade"
        style={{ height: '100dvh', overflow: 'hidden', position: 'relative', background: C.blackDeep }}
      >
        <div
          style={{
            position: 'sticky',
            top: 0,
            height: '100dvh',
            overflow: 'hidden',
          }}
        >
          {/* Images en crossfade */}
          {SLIDES.map((slide, i) => (
            <SlideImage
              key={slide.num}
              slide={slide}
              i={i}
              total={SLIDES.length}
              progress={progress}
            />
          ))}

          {/* Numéro grand format */}
          {SLIDES.map((slide, i) => {
            const seg = 1 / SLIDES.length;
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const numOpacity = useTransform(
              progress,
              [i * seg, (i + 0.15) * seg, (i + 0.85) * seg, (i + 1) * seg],
              i === 0 ? [1, 1, 1, 0] : i === SLIDES.length - 1 ? [0, 1, 1, 1] : [0, 1, 1, 0],
            );
            return (
              <motion.div
                key={slide.num + '-num'}
                style={{
                  position: 'absolute',
                  top: 20,
                  right: 48,
                  fontFamily: SERIF,
                  fontSize: 'clamp(90px, 14vw, 180px)',
                  fontWeight: 900,
                  color: 'rgba(255,255,255,0.05)',
                  lineHeight: 1,
                  userSelect: 'none',
                  opacity: numOpacity,
                  zIndex: 1,
                }}
              >
                {slide.num}
              </motion.div>
            );
          })}

          {/* Captions */}
          {SLIDES.map((slide, i) => (
            <SlideCaption
              key={slide.num + '-cap'}
              slide={slide}
              i={i}
              total={SLIDES.length}
              progress={progress}
            />
          ))}

          {/* Progress Dots */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              right: 32,
              transform: 'translateY(-50%)',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              zIndex: 5,
            }}
          >
            {SLIDES.map((_, i) => (
              <ProgressDot
                key={i}
                i={i}
                total={SLIDES.length}
                progress={progress}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   3 · ProgramsSection — 3 programmes avec icônes Lucide
   ════════════════════════════════════════════════════════════════════════════ */
const PROGRAMS = [
  {
    icon: Flame,
    tag: 'Programme 01',
    title: 'Perte de Poids',
    headline: 'BRÛLE LA GRAISSE,\nGARDE LE MUSCLE',
    desc: "Un protocole d'entraînement et nutritionnel scientifiquement conçu pour fondre la masse grasse tout en préservant votre musculature. Résultats visibles dès la 3e semaine.",
    items: [
      '3 à 5 séances semaine',
      'Plan nutrition hypocalorique ajusté',
      'Suivi corporel hebdomadaire',
      'Coaching motivation inclus',
    ],
    result: '-12 kg en moyenne sur 4 mois',
    cta: 'Démarrer ce programme',
  },
  {
    icon: Dumbbell,
    tag: 'Programme 02',
    title: 'Prise de Masse',
    headline: 'CONSTRUIS\nTON CORPS',
    desc: "Développez votre masse musculaire avec précision. Périodisation, surcharge progressive et apport protéique optimisé pour une prise de masse propre et durable.",
    items: [
      '4 à 6 séances semaine',
      'Plan nutrition hyperprotéiné',
      'Mensurations & bilan force',
      'Technicité des mouvements',
    ],
    result: '+8 kg de muscle en 5 mois',
    cta: 'Prendre de la masse',
  },
  {
    icon: Trophy,
    tag: 'Programme 03',
    title: 'Performance Athlétique',
    headline: 'ATTEINS\nTON PEAK',
    desc: "Pour les sportifs souhaitant franchir un cap : endurance, force maximale, explosivité. Préparation physique de haut niveau accessible à tous les niveaux.",
    items: [
      'Analyse biomécanique',
      'Périodisation sport spécifique',
      'Nutrition performance & récup',
      'Tests VO2max & force',
    ],
    result: 'Performance +40% en 3 mois',
    cta: 'Dépasser mes limites',
  },
];

function ProgramsSection() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <>
      <style>{`
        .r276-programs-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2px;
        }
        @media (max-width: 860px) {
          .r276-programs-grid { grid-template-columns: 1fr !important; }
          .r276-prog-inner { padding: 36px 24px !important; }
        }
      `}</style>
      <section
        id="programmes"
        style={{ background: C.black, padding: '100px 0 0' }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '0 40px',
            marginBottom: 60,
          }}
          className="r276-section-header"
        >
          <Reveal>
            <Eyebrow>Programmes coaching</Eyebrow>
          </Reveal>
          <Reveal delay={0.1}>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(44px, 7vw, 88px)',
                fontWeight: 900,
                textTransform: 'uppercase',
                color: C.white,
                lineHeight: 0.92,
                margin: '20px 0 0',
              }}
            >
              CHOISIS<br />
              <span style={{ color: C.orange }}>TON OBJECTIF</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p
              style={{
                fontFamily: SANS,
                fontSize: 17,
                color: C.muted,
                maxWidth: 520,
                lineHeight: 1.65,
                marginTop: 20,
              }}
            >
              Trois programmes premium, conçus pour trois types de transformation.
              Thomas s'adapte à votre niveau, votre emploi du temps et vos objectifs.
            </p>
          </Reveal>
        </div>

        <div className="r276-programs-grid">
          {PROGRAMS.map((prog, i) => {
            const Icon = prog.icon;
            const isHov = hovered === i;
            return (
              <Reveal key={prog.title} delay={i * 0.12}>
                <div
                  className="r276-prog-inner"
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    background: isHov ? C.orange : C.steel,
                    padding: '56px 48px',
                    cursor: 'pointer',
                    transition: 'background .35s cubic-bezier(.16,1,.3,1)',
                    minHeight: 560,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {/* Tag + Icône */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: 32,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: SANS,
                        fontSize: 11,
                        letterSpacing: '0.32em',
                        textTransform: 'uppercase',
                        color: isHov ? 'rgba(255,255,255,0.75)' : C.muted,
                        fontWeight: 600,
                        transition: 'color .3s',
                      }}
                    >
                      {prog.tag}
                    </span>
                    <div
                      style={{
                        width: 52,
                        height: 52,
                        border: `1.5px solid ${isHov ? 'rgba(255,255,255,0.5)' : C.orange}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'border-color .3s',
                      }}
                    >
                      <Icon
                        size={24}
                        color={isHov ? C.white : C.orange}
                        strokeWidth={1.5}
                        style={{ transition: 'color .3s' }}
                      />
                    </div>
                  </div>

                  {/* Titre programme */}
                  <div
                    style={{
                      fontFamily: SERIF,
                      fontSize: 13,
                      letterSpacing: '0.25em',
                      textTransform: 'uppercase',
                      color: isHov ? 'rgba(255,255,255,0.80)' : C.orange,
                      fontWeight: 700,
                      marginBottom: 8,
                      transition: 'color .3s',
                    }}
                  >
                    {prog.title}
                  </div>

                  {/* Headline */}
                  <h3
                    style={{
                      fontFamily: SERIF,
                      fontSize: 'clamp(34px, 3.5vw, 52px)',
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      color: C.white,
                      lineHeight: 0.92,
                      margin: '0 0 20px',
                      whiteSpace: 'pre-line',
                    }}
                  >
                    {prog.headline}
                  </h3>

                  {/* Description */}
                  <p
                    style={{
                      fontFamily: SANS,
                      fontSize: 15,
                      color: isHov ? 'rgba(255,255,255,0.82)' : C.muted,
                      lineHeight: 1.65,
                      marginBottom: 28,
                      transition: 'color .3s',
                      flexGrow: 1,
                    }}
                  >
                    {prog.desc}
                  </p>

                  {/* Items liste */}
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {prog.items.map((item) => (
                      <li
                        key={item}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          fontFamily: SANS,
                          fontSize: 14,
                          color: isHov ? 'rgba(255,255,255,0.85)' : C.mutedLight,
                          transition: 'color .3s',
                        }}
                      >
                        <Check
                          size={14}
                          color={isHov ? C.white : C.orange}
                          strokeWidth={2.5}
                          style={{ flexShrink: 0, transition: 'color .3s' }}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>

                  {/* Résultat moyen */}
                  <div
                    style={{
                      borderTop: `1px solid ${isHov ? 'rgba(255,255,255,0.25)' : C.border}`,
                      paddingTop: 20,
                      marginBottom: 24,
                      transition: 'border-color .3s',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: SERIF,
                        fontSize: 15,
                        fontWeight: 700,
                        color: isHov ? C.white : C.orange,
                        letterSpacing: '0.06em',
                        transition: 'color .3s',
                      }}
                    >
                      Résultat moyen : {prog.result}
                    </span>
                  </div>

                  {/* CTA */}
                  <button
                    onClick={() =>
                      document.getElementById('bilan')?.scrollIntoView({ behavior: 'smooth' })
                    }
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      fontFamily: SERIF,
                      fontSize: 15,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.12em',
                      color: isHov ? C.white : C.orange,
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      transition: 'color .3s',
                    }}
                  >
                    {prog.cta}
                    <ArrowRight size={16} style={{ transition: 'transform .3s' }} />
                  </button>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>
    </>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   4 · MethodSection — photo sticky gauche + scroll 4 étapes droite
   ════════════════════════════════════════════════════════════════════════════ */
const METHOD_STEPS = [
  {
    num: '01',
    title: 'Bilan Initial',
    desc: 'Une séance de 45 minutes pour analyser votre composition corporelle, vos antécédents sportifs, vos objectifs et vos contraintes. Le point de départ de votre transformation.',
    icon: Target,
  },
  {
    num: '02',
    title: 'Programme Sur-Mesure',
    desc: "Construction d'un plan d'entraînement 100% personnalisé basé sur votre bilan. Fréquence, intensité, exercices et progressions adaptés à votre profil unique.",
    icon: BarChart2,
  },
  {
    num: '03',
    title: 'Coaching Individuel',
    desc: "Séances en face-à-face ou en ligne avec Thomas. Correction technique en temps réel, motivation, ajustements permanents. Vous n'êtes jamais seul dans votre parcours.",
    icon: Users,
  },
  {
    num: '04',
    title: 'Suivi Nutrition',
    desc: "Un plan alimentaire flexible et réaliste qui s'intègre à votre vie. Pas de régimes drastiques — une éducation nutritionnelle qui dure toute la vie.",
    icon: Leaf,
  },
];

function MethodSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);

  return (
    <>
      <style>{`
        .r276-method-wrap {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 100dvh;
        }
        .r276-method-sticky {
          position: sticky;
          top: 0;
          height: 100dvh;
          overflow: hidden;
        }
        .r276-method-steps {
          padding: 100px 72px 100px 80px;
        }
        @media (max-width: 860px) {
          .r276-method-wrap { grid-template-columns: 1fr !important; }
          .r276-method-sticky { position: static !important; height: 55vw !important; }
          .r276-method-steps { padding: 48px 24px !important; }
        }
      `}</style>
      <section
        id="methode"
        ref={ref}
        style={{ background: C.black }}
      >
        <div className="r276-method-wrap">
          {/* Colonne gauche : photo sticky */}
          <div className="r276-method-sticky">
            <motion.div style={{ position: 'absolute', inset: '-8% 0', y: imgY }}>
              <img
                src={fd?.photoUrls?.[1] || PHOTO.coach}
                alt="Thomas Lebrun coach en action Bordeaux"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </motion.div>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to right, transparent 60%, rgba(17,17,17,0.6) 100%)',
              }}
            />
            {/* Badge sur la photo */}
            <div
              style={{
                position: 'absolute',
                bottom: 40,
                left: 40,
                background: C.orange,
                padding: '18px 28px',
              }}
            >
              <div
                style={{
                  fontFamily: SERIF,
                  fontSize: 36,
                  fontWeight: 900,
                  color: C.white,
                  lineHeight: 1,
                }}
              >
                BPJEPS
              </div>
              <div
                style={{
                  fontFamily: SANS,
                  fontSize: 12,
                  color: 'rgba(255,255,255,0.85)',
                  marginTop: 4,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                Certification nationale
              </div>
            </div>
          </div>

          {/* Colonne droite : étapes */}
          <div className="r276-method-steps">
            <Reveal>
              <Eyebrow>La méthode Thomas Lebrun</Eyebrow>
            </Reveal>
            <Reveal delay={0.1}>
              <h2
                style={{
                  fontFamily: SERIF,
                  fontSize: 'clamp(42px, 5.5vw, 76px)',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  color: C.white,
                  lineHeight: 0.92,
                  margin: '20px 0 48px',
                }}
              >
                4 ÉTAPES<br />
                <span style={{ color: C.orange }}>VERS LA VICTOIRE</span>
              </h2>
            </Reveal>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {METHOD_STEPS.map((step, i) => {
                const Icon = step.icon;
                return (
                  <Reveal key={step.num} delay={0.15 + i * 0.12}>
                    <div
                      style={{
                        display: 'flex',
                        gap: 32,
                        paddingBottom: 40,
                        borderBottom: i < METHOD_STEPS.length - 1 ? `1px solid ${C.border}` : 'none',
                        marginBottom: i < METHOD_STEPS.length - 1 ? 40 : 0,
                      }}
                    >
                      {/* Numéro */}
                      <div
                        style={{
                          fontFamily: SERIF,
                          fontSize: 52,
                          fontWeight: 900,
                          color: 'rgba(232,82,10,0.18)',
                          lineHeight: 1,
                          flexShrink: 0,
                          width: 64,
                        }}
                      >
                        {step.num}
                      </div>
                      {/* Contenu */}
                      <div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            marginBottom: 10,
                          }}
                        >
                          <Icon size={18} color={C.orange} strokeWidth={1.8} />
                          <h3
                            style={{
                              fontFamily: SERIF,
                              fontSize: 24,
                              fontWeight: 800,
                              textTransform: 'uppercase',
                              color: C.white,
                              letterSpacing: '0.06em',
                              margin: 0,
                            }}
                          >
                            {step.title}
                          </h3>
                        </div>
                        <p
                          style={{
                            fontFamily: SANS,
                            fontSize: 15,
                            color: C.muted,
                            lineHeight: 1.7,
                            margin: 0,
                          }}
                        >
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>

            <Reveal delay={0.6}>
              <div style={{ marginTop: 48 }}>
                <OrangeButton
                  onClick={() =>
                    document.getElementById('bilan')?.scrollIntoView({ behavior: 'smooth' })
                  }
                >
                  Commencer ma transformation
                </OrangeButton>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   5 · TransformationSection — 3 témoignages avec résultats chiffrés
   ════════════════════════════════════════════════════════════════════════════ */
const TESTIMONIALS = [
  {
    name: 'Margaux D.',
    age: 34,
    city: 'Bordeaux Caudéran',
    result: '-12 kg en 4 mois',
    program: 'Programme Perte de Poids',
    stars: 5,
    quote: "Thomas a changé ma vie. Après des années de régimes yo-yo, j'ai enfin trouvé une méthode qui marche et que je peux tenir dans la durée. Le suivi nutrition est exceptionnel. Je recommande à 200%.",
  },
  {
    name: 'Julien P.',
    age: 28,
    city: 'Mérignac',
    result: '+9 kg de muscle en 5 mois',
    program: 'Programme Prise de Masse',
    stars: 5,
    quote: "En 5 mois, j'ai pris 9 kg de muscle propre. Thomas sait exactement comment structurer l'entraînement et la nutrition pour maximiser les résultats. Technique irréprochable et pédagogie au top.",
  },
  {
    name: 'Sophie L.',
    age: 42,
    city: 'Le Bouscat',
    result: 'Semi-marathon en 1h52',
    program: 'Programme Performance',
    stars: 5,
    quote: "Je voulais courir mon premier semi-marathon. Thomas m'a préparé physiquement et mentalement. Résultat : 1h52 au finish et aucune blessure. Son plan était parfaitement adapté à mon niveau.",
  },
];

function TransformationSection() {
  return (
    <>
      <style>{`
        .r276-testi-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-top: 60px;
        }
        @media (max-width: 860px) {
          .r276-testi-grid { grid-template-columns: 1fr !important; }
          .r276-testi-card { padding: 32px 24px !important; }
        }
      `}</style>
      <section
        id="transformations"
        style={{ background: C.steel, padding: '100px 0' }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px' }}>
          <Reveal>
            <Eyebrow align="center">Témoignages & transformations</Eyebrow>
          </Reveal>
          <Reveal delay={0.1}>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(44px, 7vw, 88px)',
                fontWeight: 900,
                textTransform: 'uppercase',
                color: C.white,
                lineHeight: 0.92,
                textAlign: 'center',
                margin: '20px 0 0',
              }}
            >
              ILS ONT<br />
              <span style={{ color: C.orange }}>TRANSFORMÉ</span><br />
              LEUR VIE
            </h2>
          </Reveal>

          <div className="r276-testi-grid">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.14}>
                <div
                  className="r276-testi-card"
                  style={{
                    background: C.black,
                    padding: '44px 40px',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                  }}
                >
                  {/* Étoiles */}
                  <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
                    {Array.from({ length: t.stars }).map((_, s) => (
                      <Star
                        key={s}
                        size={16}
                        color={C.orange}
                        fill={C.orange}
                        strokeWidth={0}
                      />
                    ))}
                  </div>

                  {/* Résultat mis en avant */}
                  <div
                    style={{
                      background: C.orange,
                      display: 'inline-block',
                      padding: '6px 16px',
                      marginBottom: 20,
                      fontFamily: SERIF,
                      fontSize: 18,
                      fontWeight: 800,
                      color: C.white,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      alignSelf: 'flex-start',
                    }}
                  >
                    {t.result}
                  </div>

                  {/* Citation */}
                  <p
                    style={{
                      fontFamily: SANS,
                      fontSize: 15,
                      color: C.mutedLight,
                      lineHeight: 1.7,
                      fontStyle: 'italic',
                      flex: 1,
                      margin: 0,
                    }}
                  >
                    "{t.quote}"
                  </p>

                  {/* Auteur */}
                  <div
                    style={{
                      borderTop: `1px solid ${C.border}`,
                      paddingTop: 20,
                      marginTop: 24,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: SERIF,
                        fontSize: 18,
                        fontWeight: 800,
                        color: C.white,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                      }}
                    >
                      {t.name}, {t.age} ans
                    </div>
                    <div
                      style={{
                        fontFamily: SANS,
                        fontSize: 12,
                        color: C.muted,
                        marginTop: 4,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <MapPin size={11} color={C.orange} />
                      {t.city} · {t.program}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   6 · BilanFormSection — formulaire bilan gratuit + état envoyé
   ════════════════════════════════════════════════════════════════════════════ */
function BilanFormSection() {
  const [form, setForm] = useState({
    prenom: '',
    nom: '',
    objectif: '',
    niveau: '',
    email: '',
  });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handle = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.prenom || !form.email || !form.objectif) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1400);
  };

  const inputStyle: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 15,
    color: C.white,
    background: C.steelMid,
    border: `1px solid ${C.border}`,
    padding: '15px 18px',
    outline: 'none',
    width: '100%',
    transition: 'border-color .25s',
    boxSizing: 'border-box',
    appearance: 'none',
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 12,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: C.muted,
    fontWeight: 600,
    display: 'block',
    marginBottom: 8,
  };

  return (
    <>
      <style>{`
        .r276-bilan-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 56px;
          align-items: center;
        }
        .r276-form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .r276-bilan-input:focus { border-color: ${C.orange} !important; }
        .r276-bilan-select option { background: ${C.steel}; color: ${C.white}; }
        @media (max-width: 860px) {
          .r276-bilan-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .r276-form-row { grid-template-columns: 1fr !important; }
          .r276-bilan-info { display: none; }
        }
      `}</style>
      <section
        id="bilan"
        style={{
          background: C.black,
          padding: '100px 0',
          borderTop: `3px solid ${C.orange}`,
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px' }}>
          <div className="r276-bilan-grid">
            {/* Info gauche */}
            <div className="r276-bilan-info">
              <Reveal>
                <Eyebrow>Offre découverte</Eyebrow>
              </Reveal>
              <Reveal delay={0.1}>
                <h2
                  style={{
                    fontFamily: SERIF,
                    fontSize: 'clamp(48px, 6.5vw, 84px)',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    color: C.white,
                    lineHeight: 0.9,
                    margin: '20px 0 28px',
                  }}
                >
                  BILAN<br />
                  <span style={{ color: C.orange }}>GRATUIT</span><br />
                  45 MIN
                </h2>
              </Reveal>
              <Reveal delay={0.2}>
                <p
                  style={{
                    fontFamily: SANS,
                    fontSize: 16,
                    color: C.muted,
                    lineHeight: 1.7,
                    maxWidth: 400,
                    marginBottom: 36,
                  }}
                >
                  Lors de ce bilan offert, Thomas analyse votre profil, répond
                  à toutes vos questions et vous propose un plan d'action concret.
                  Sans engagement, sans pression.
                </p>
              </Reveal>
              <Reveal delay={0.3}>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {[
                    'Analyse de votre composition corporelle',
                    'Définition de vos objectifs réels',
                    'Présentation du programme adapté',
                    '100% gratuit, sans obligation',
                  ].map((item) => (
                    <li
                      key={item}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 12,
                        fontFamily: SANS,
                        fontSize: 15,
                        color: C.mutedLight,
                      }}
                    >
                      <Check
                        size={15}
                        color={C.orange}
                        strokeWidth={2.5}
                        style={{ flexShrink: 0, marginTop: 2 }}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            {/* Formulaire droite */}
            <Reveal delay={0.2}>
              <div
                style={{
                  background: C.steel,
                  padding: '48px',
                }}
              >
                {sent ? (
                  /* État envoyé */
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '40px 0',
                    }}
                  >
                    <div
                      style={{
                        width: 72,
                        height: 72,
                        background: C.orange,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 24px',
                      }}
                    >
                      <Check size={32} color={C.white} strokeWidth={2.5} />
                    </div>
                    <h3
                      style={{
                        fontFamily: SERIF,
                        fontSize: 32,
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        color: C.white,
                        margin: '0 0 12px',
                      }}
                    >
                      Merci {form.prenom} !
                    </h3>
                    <p
                      style={{
                        fontFamily: SANS,
                        fontSize: 16,
                        color: C.muted,
                        lineHeight: 1.65,
                        maxWidth: 380,
                        margin: '0 auto',
                      }}
                    >
                      Votre demande de bilan gratuit a bien été reçue.
                      Thomas vous contactera sous 24h pour fixer votre rendez-vous.
                    </p>
                    <div
                      style={{
                        marginTop: 32,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        fontFamily: SANS,
                        fontSize: 14,
                        color: C.orange,
                      }}
                    >
                      <Phone size={14} color={C.orange} />
                      06 XX XX XX XX
                    </div>
                  </div>
                ) : (
                  /* Formulaire */
                  <>
                    <h3
                      style={{
                        fontFamily: SERIF,
                        fontSize: 26,
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        color: C.white,
                        margin: '0 0 8px',
                        letterSpacing: '0.06em',
                      }}
                    >
                      Demander mon bilan
                    </h3>
                    <p
                      style={{
                        fontFamily: SANS,
                        fontSize: 14,
                        color: C.muted,
                        marginBottom: 32,
                      }}
                    >
                      Réponse garantie sous 24h
                    </p>

                    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                      <div className="r276-form-row">
                        <div>
                          <label style={labelStyle} htmlFor="prenom276">Prénom *</label>
                          <input
                            id="prenom276"
                            name="prenom"
                            type="text"
                            required
                            value={form.prenom}
                            onChange={handle}
                            placeholder="Thomas"
                            className="r276-bilan-input"
                            style={{ ...inputStyle }}
                          />
                        </div>
                        <div>
                          <label style={labelStyle} htmlFor="nom276">Nom</label>
                          <input
                            id="nom276"
                            name="nom"
                            type="text"
                            value={form.nom}
                            onChange={handle}
                            placeholder="Dupont"
                            className="r276-bilan-input"
                            style={{ ...inputStyle }}
                          />
                        </div>
                      </div>

                      <div>
                        <label style={labelStyle} htmlFor="objectif276">Votre objectif *</label>
                        <select
                          id="objectif276"
                          name="objectif"
                          required
                          value={form.objectif}
                          onChange={handle}
                          className="r276-bilan-input r276-bilan-select"
                          style={{
                            ...inputStyle,
                            cursor: 'pointer',
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23e8520a' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 14px center',
                            paddingRight: 40,
                          }}
                        >
                          <option value="" disabled>Sélectionner un objectif</option>
                          <option value="perte-poids">Perte de poids</option>
                          <option value="prise-masse">Prise de masse musculaire</option>
                          <option value="endurance">Endurance / Cardio</option>
                          <option value="remise-forme">Remise en forme générale</option>
                        </select>
                      </div>

                      <div>
                        <label style={labelStyle} htmlFor="niveau276">Niveau actuel</label>
                        <select
                          id="niveau276"
                          name="niveau"
                          value={form.niveau}
                          onChange={handle}
                          className="r276-bilan-input r276-bilan-select"
                          style={{
                            ...inputStyle,
                            cursor: 'pointer',
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23e8520a' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 14px center',
                            paddingRight: 40,
                          }}
                        >
                          <option value="" disabled>Mon niveau sportif</option>
                          <option value="debutant">Débutant (peu ou pas de sport)</option>
                          <option value="intermediaire">Intermédiaire (sport occasionnel)</option>
                          <option value="avance">Avancé (sport régulier)</option>
                          <option value="confirme">Confirmé (compétiteur)</option>
                        </select>
                      </div>

                      <div>
                        <label style={labelStyle} htmlFor="email276">Email *</label>
                        <input
                          id="email276"
                          name="email"
                          type="email"
                          required
                          value={form.email}
                          onChange={handle}
                          placeholder="thomas@exemple.fr"
                          className="r276-bilan-input"
                          style={{ ...inputStyle }}
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        style={{
                          fontFamily: SERIF,
                          fontSize: 18,
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          letterSpacing: '0.12em',
                          color: C.white,
                          background: loading ? C.orangeDark : C.orange,
                          border: 'none',
                          padding: '18px 24px',
                          cursor: loading ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 10,
                          transition: 'background .25s',
                          marginTop: 8,
                        }}
                      >
                        {loading ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                              style={{
                                width: 18,
                                height: 18,
                                border: `2px solid rgba(255,255,255,0.3)`,
                                borderTopColor: C.white,
                                borderRadius: '50%',
                              }}
                            />
                            Envoi en cours...
                          </>
                        ) : (
                          <>
                            Réserver mon bilan gratuit
                            <ArrowRight size={18} />
                          </>
                        )}
                      </button>

                      <p
                        style={{
                          fontFamily: SANS,
                          fontSize: 12,
                          color: C.steelLight,
                          textAlign: 'center',
                          margin: 0,
                        }}
                      >
                        Vos données restent confidentielles. Aucun spam.
                      </p>
                    </form>
                  </>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   7 · StatsSection — 4 chiffres clés
   ════════════════════════════════════════════════════════════════════════════ */
const STATS = [
  { value: '8', unit: 'ans', label: 'de coaching professionnel', icon: Award },
  { value: '+300', unit: '', label: 'clients transformés', icon: Users },
  { value: '-12kg', unit: '', label: 'perte moyenne en 4 mois', icon: TrendingUp },
  { value: '98%', unit: '', label: 'taux de satisfaction', icon: Heart },
];

function StatsSection() {
  return (
    <>
      <style>{`
        .r276-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2px;
        }
        @media (max-width: 860px) {
          .r276-stats-grid { grid-template-columns: 1fr 1fr !important; }
          .r276-stat-cell { padding: 36px 24px !important; }
        }
      `}</style>
      <section style={{ background: C.orange }}>
        <div className="r276-stats-grid">
          {STATS.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal key={s.label} delay={i * 0.1}>
                <div
                  className="r276-stat-cell"
                  style={{
                    padding: '60px 48px',
                    borderRight: i < STATS.length - 1 ? `1px solid rgba(255,255,255,0.25)` : 'none',
                    textAlign: 'center',
                  }}
                >
                  <Icon
                    size={28}
                    color="rgba(255,255,255,0.6)"
                    strokeWidth={1.5}
                    style={{ marginBottom: 16 }}
                  />
                  <div
                    style={{
                      fontFamily: SERIF,
                      fontSize: 'clamp(48px, 5vw, 72px)',
                      fontWeight: 900,
                      color: C.white,
                      lineHeight: 1,
                      marginBottom: 8,
                    }}
                  >
                    {s.value}
                    {s.unit && (
                      <span style={{ fontSize: '0.5em', marginLeft: 4 }}>{s.unit}</span>
                    )}
                  </div>
                  <div
                    style={{
                      fontFamily: SANS,
                      fontSize: 13,
                      color: 'rgba(255,255,255,0.80)',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      lineHeight: 1.4,
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>
    </>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   8 · ScheduleSection — planning hebdomadaire
   ════════════════════════════════════════════════════════════════════════════ */
type ScheduleItem = {
  day: string;
  type: 'individuel' | 'collectif' | 'outdoor';
  sessions: { time: string; label: string; duration: string }[];
};

const SCHEDULE: ScheduleItem[] = [
  {
    day: 'Lundi',
    type: 'individuel',
    sessions: [
      { time: '07:00', label: 'Séance individuelle — Force', duration: '60 min' },
      { time: '09:00', label: 'Séance individuelle — Cardio HIIT', duration: '45 min' },
      { time: '18:00', label: 'Séance individuelle — Full body', duration: '60 min' },
    ],
  },
  {
    day: 'Mardi',
    type: 'collectif',
    sessions: [
      { time: '07:30', label: 'Bootcamp collectif — Cardio / Force', duration: '55 min' },
      { time: '12:00', label: 'Bootcamp mid-day — Express', duration: '30 min' },
      { time: '19:00', label: 'Bootcamp soir — Mixte', duration: '60 min' },
    ],
  },
  {
    day: 'Mercredi',
    type: 'individuel',
    sessions: [
      { time: '08:00', label: 'Séance individuelle — Prise de masse', duration: '70 min' },
      { time: '17:00', label: 'Séance individuelle — Mobility & stretch', duration: '45 min' },
    ],
  },
  {
    day: 'Jeudi',
    type: 'outdoor',
    sessions: [
      { time: '07:00', label: 'Outdoor parc Bordelais — Run & circuit', duration: '60 min' },
      { time: '09:30', label: 'Outdoor — Fractionné & core', duration: '50 min' },
      { time: '18:30', label: 'Outdoor soir — Cardio endurance', duration: '55 min' },
    ],
  },
  {
    day: 'Vendredi',
    type: 'individuel',
    sessions: [
      { time: '07:00', label: 'Séance individuelle — Force max', duration: '65 min' },
      { time: '12:00', label: 'Séance individuelle — Express lunch', duration: '45 min' },
      { time: '19:00', label: 'Séance individuelle — Mobilité active', duration: '50 min' },
    ],
  },
  {
    day: 'Samedi',
    type: 'collectif',
    sessions: [
      { time: '08:00', label: 'Bootcamp week-end — Full body', duration: '75 min' },
      { time: '10:00', label: 'Outdoor parc Bordelais — Trail & circuit', duration: '90 min' },
    ],
  },
];

const TYPE_COLORS = {
  individuel: C.orange,
  collectif: '#4a90d9',
  outdoor: '#4db87a',
} as const;

const TYPE_LABELS = {
  individuel: 'Séances individuelles',
  collectif: 'Bootcamp collectif',
  outdoor: 'Outdoor parc',
} as const;

function ScheduleSection() {
  const [activeDay, setActiveDay] = useState(0);
  const current = SCHEDULE[activeDay];

  return (
    <>
      <style>{`
        .r276-schedule-wrap {
          display: grid;
          grid-template-columns: 220px 1fr;
          gap: 2px;
          margin-top: 60px;
          min-height: 480px;
        }
        @media (max-width: 860px) {
          .r276-schedule-wrap { grid-template-columns: 1fr !important; }
          .r276-sched-days { flex-direction: row !important; overflow-x: auto !important; }
          .r276-sched-day-btn { min-width: 80px !important; }
        }
      `}</style>
      <section
        id="planning"
        style={{ background: C.black, padding: '100px 0' }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px' }}>
          <Reveal>
            <Eyebrow>Planning hebdomadaire</Eyebrow>
          </Reveal>
          <Reveal delay={0.1}>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(44px, 7vw, 88px)',
                fontWeight: 900,
                textTransform: 'uppercase',
                color: C.white,
                lineHeight: 0.92,
                margin: '20px 0 0',
              }}
            >
              TROUVE<br />
              <span style={{ color: C.orange }}>TON CRÉNEAU</span>
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p style={{ fontFamily: SANS, fontSize: 16, color: C.muted, maxWidth: 500, lineHeight: 1.65, marginTop: 16 }}>
              Séances individuelles personnalisées, cours collectifs bootcamp,
              et entraînements outdoor au parc Bordelais. Flexibilité totale.
            </p>
          </Reveal>

          {/* Légende */}
          <Reveal delay={0.2}>
            <div style={{ display: 'flex', gap: 24, marginTop: 24, flexWrap: 'wrap' }}>
              {(Object.keys(TYPE_COLORS) as (keyof typeof TYPE_COLORS)[]).map((type) => (
                <div
                  key={type}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontFamily: SANS,
                    fontSize: 13,
                    color: C.muted,
                  }}
                >
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      background: TYPE_COLORS[type],
                    }}
                  />
                  {TYPE_LABELS[type]}
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.25}>
            <div className="r276-schedule-wrap">
              {/* Jours sidebar */}
              <div
                className="r276-sched-days"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  background: C.steel,
                }}
              >
                {SCHEDULE.map((day, i) => (
                  <button
                    key={day.day}
                    className="r276-sched-day-btn"
                    onClick={() => setActiveDay(i)}
                    style={{
                      fontFamily: SERIF,
                      fontSize: 18,
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.10em',
                      color: activeDay === i ? C.white : C.muted,
                      background: activeDay === i ? C.orange : 'transparent',
                      border: 'none',
                      padding: '20px 24px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all .25s',
                      borderLeft: activeDay === i ? `4px solid ${C.orangeHot}` : '4px solid transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>{day.day}</span>
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: TYPE_COLORS[day.type],
                      }}
                    />
                  </button>
                ))}
              </div>

              {/* Sessions du jour */}
              <motion.div
                key={activeDay}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, ease: EASE }}
                style={{ background: C.steelMid, padding: '40px 48px' }}
              >
                <div
                  style={{
                    fontFamily: SANS,
                    fontSize: 11,
                    letterSpacing: '0.32em',
                    textTransform: 'uppercase',
                    color: TYPE_COLORS[current.type],
                    fontWeight: 700,
                    marginBottom: 8,
                  }}
                >
                  {TYPE_LABELS[current.type]}
                </div>
                <h3
                  style={{
                    fontFamily: SERIF,
                    fontSize: 36,
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    color: C.white,
                    margin: '0 0 32px',
                  }}
                >
                  {current.day}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {current.sessions.map((session) => (
                    <div
                      key={session.time + session.label}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 20,
                        padding: '18px 22px',
                        background: C.black,
                        borderLeft: `3px solid ${TYPE_COLORS[current.type]}`,
                      }}
                    >
                      <div style={{ flexShrink: 0, minWidth: 56 }}>
                        <div
                          style={{
                            fontFamily: SERIF,
                            fontSize: 22,
                            fontWeight: 900,
                            color: C.white,
                            lineHeight: 1,
                          }}
                        >
                          {session.time}
                        </div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontFamily: SANS,
                            fontSize: 15,
                            color: C.white,
                            fontWeight: 500,
                          }}
                        >
                          {session.label}
                        </div>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          fontFamily: SANS,
                          fontSize: 13,
                          color: C.muted,
                          flexShrink: 0,
                        }}
                      >
                        <Clock size={13} color={C.muted} />
                        {session.duration}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 32 }}>
                  <OrangeButton
                    onClick={() =>
                      document.getElementById('bilan')?.scrollIntoView({ behavior: 'smooth' })
                    }
                  >
                    Réserver ce créneau
                  </OrangeButton>
                </div>
              </motion.div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   9 · NutritionSection — 3 principes nutritionnels
   ════════════════════════════════════════════════════════════════════════════ */
const NUTRITION_PRINCIPLES = [
  {
    icon: Zap,
    num: '01',
    title: 'Sans régime draconien',
    desc: "Finies les privations insoutenables. L'approche de Thomas repose sur l'équilibre et l'éducation alimentaire — manger varié, manger bien, sans frustration. Une alimentation que vous pouvez tenir à vie.",
    highlight: 'Pas de déficit extrême',
  },
  {
    icon: Target,
    num: '02',
    title: 'Plan personnalisé',
    desc: "Chaque plan nutritionnel est construit selon votre métabolisme, vos goûts, vos intolérances et votre rythme de vie. 100% sur-mesure — pas de programme copié-collé.",
    highlight: 'Calculé selon votre profil',
  },
  {
    icon: Heart,
    num: '03',
    title: 'Flexibilité totale',
    desc: "Les sorties entre amis, les restaurants, les week-ends en famille — tout s'intègre. Thomas vous apprend à naviguer dans la vraie vie avec votre plan nutritionnel sans culpabilité.",
    highlight: 'Adaptable à votre vie sociale',
  },
];

function NutritionSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);

  return (
    <>
      <style>{`
        .r276-nutri-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }
        .r276-nutri-principles {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }
        @media (max-width: 860px) {
          .r276-nutri-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
          .r276-nutri-photo { height: 280px !important; }
        }
      `}</style>
      <section
        style={{
          background: C.steel,
          padding: '100px 0',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px' }}>
          <div className="r276-nutri-grid">
            {/* Photo gauche */}
            <Reveal>
              <div
                className="r276-nutri-photo"
                style={{
                  position: 'relative',
                  height: 580,
                  overflow: 'hidden',
                }}
              >
                <motion.img
                  src={PHOTO.nutrition}
                  alt="Nutrition personnalisée Thomas Lebrun Coach Bordeaux"
                  style={{
                    width: '100%',
                    height: '120%',
                    objectFit: 'cover',
                    y: imgY,
                    position: 'absolute',
                    top: '-10%',
                  }}
                />
                {/* Badge nutrition */}
                <div
                  style={{
                    position: 'absolute',
                    top: 32,
                    left: 32,
                    background: C.orange,
                    padding: '14px 20px',
                  }}
                >
                  <div
                    style={{
                      fontFamily: SERIF,
                      fontSize: 14,
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      letterSpacing: '0.12em',
                      color: C.white,
                    }}
                  >
                    Nutrition coach
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Principes droite */}
            <div>
              <Reveal>
                <Eyebrow>Approche nutritionnelle</Eyebrow>
              </Reveal>
              <Reveal delay={0.1}>
                <h2
                  style={{
                    fontFamily: SERIF,
                    fontSize: 'clamp(42px, 5.5vw, 72px)',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    color: C.white,
                    lineHeight: 0.92,
                    margin: '20px 0 40px',
                  }}
                >
                  MANGE MIEUX,<br />
                  <span style={{ color: C.orange }}>PERFORME PLUS</span>
                </h2>
              </Reveal>

              <div className="r276-nutri-principles">
                {NUTRITION_PRINCIPLES.map((p, i) => {
                  const Icon = p.icon;
                  return (
                    <Reveal key={p.num} delay={0.2 + i * 0.12}>
                      <div
                        style={{
                          display: 'flex',
                          gap: 24,
                          padding: '28px 0',
                          borderBottom: i < NUTRITION_PRINCIPLES.length - 1
                            ? `1px solid ${C.border}`
                            : 'none',
                        }}
                      >
                        <div style={{ flexShrink: 0 }}>
                          <div
                            style={{
                              width: 48,
                              height: 48,
                              border: `1.5px solid ${C.orange}`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Icon size={20} color={C.orange} strokeWidth={1.8} />
                          </div>
                        </div>
                        <div>
                          <h3
                            style={{
                              fontFamily: SERIF,
                              fontSize: 22,
                              fontWeight: 800,
                              textTransform: 'uppercase',
                              color: C.white,
                              letterSpacing: '0.06em',
                              margin: '0 0 8px',
                            }}
                          >
                            {p.title}
                          </h3>
                          <p
                            style={{
                              fontFamily: SANS,
                              fontSize: 15,
                              color: C.muted,
                              lineHeight: 1.7,
                              margin: '0 0 12px',
                            }}
                          >
                            {p.desc}
                          </p>
                          <span
                            style={{
                              fontFamily: SANS,
                              fontSize: 12,
                              color: C.orange,
                              fontWeight: 700,
                              letterSpacing: '0.10em',
                              textTransform: 'uppercase',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6,
                            }}
                          >
                            <Check size={12} color={C.orange} strokeWidth={2.5} />
                            {p.highlight}
                          </span>
                        </div>
                      </div>
                    </Reveal>
                  );
                })}
              </div>

              <Reveal delay={0.55}>
                <div style={{ marginTop: 40 }}>
                  <OrangeButton
                    onClick={() =>
                      document.getElementById('bilan')?.scrollIntoView({ behavior: 'smooth' })
                    }
                  >
                    Mon plan nutrition offert
                  </OrangeButton>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   10 · FooterSection — logo, réseaux, mentions légales, certifications
   ════════════════════════════════════════════════════════════════════════════ */
function FooterSection() {
  const SOCIALS = [
    {
      icon: Camera,
      label: 'Instagram',
      href: 'https://instagram.com',
    },
    {
      icon: Play,
      label: 'YouTube',
      href: 'https://youtube.com',
    },
  ];

  const CERTIFS = [
    'BPJEPS Activités Physiques pour Tous',
    'Certification Nutrition Sportive',
    'Diplôme Coach Crossfit Niveau 1',
    'Certification Préparation Physique FFA',
  ];

  const LINKS = [
    'Mentions légales',
    'Politique de confidentialité',
    'CGV / CGU',
    'Cookies',
  ];

  return (
    <>
      <style>{`
        .r276-footer-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr;
          gap: 60px;
          padding-bottom: 60px;
          border-bottom: 1px solid ${C.border};
        }
        .r276-footer-social-btn:hover { background: ${C.orange} !important; border-color: ${C.orange} !important; }
        @media (max-width: 860px) {
          .r276-footer-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
      <footer
        style={{
          background: C.blackDeep,
          padding: '80px 0 40px',
          borderTop: `3px solid ${C.orange}`,
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px' }}>
          <div className="r276-footer-grid">
            {/* Colonne 1 : Logo + description */}
            <div>
              <div
                style={{
                  fontFamily: SERIF,
                  fontSize: 32,
                  fontWeight: 900,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  color: C.white,
                  marginBottom: 16,
                }}
              >
                Thomas<br />
                <span style={{ color: C.orange }}>Lebrun</span>
                <span style={{ color: C.muted, fontSize: 18, display: 'block', marginTop: 2 }}>
                  Coach
                </span>
              </div>
              <p
                style={{
                  fontFamily: SANS,
                  fontSize: 14,
                  color: C.muted,
                  lineHeight: 1.7,
                  maxWidth: 280,
                  marginBottom: 28,
                }}
              >
                Coach sportif & nutritionnel certifié BPJEPS à Bordeaux Caudéran.
                Transformations réelles, méthode personnalisée, résultats garantis.
              </p>

              {/* Réseaux sociaux */}
              <div style={{ display: 'flex', gap: 12 }}>
                {SOCIALS.map((s) => {
                  const Icon = s.icon;
                  return (
                    <a
                      key={s.label}
                      href={s.href}
                      aria-label={s.label}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="r276-footer-social-btn"
                      style={{
                        width: 40,
                        height: 40,
                        border: `1px solid ${C.border}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        textDecoration: 'none',
                        transition: 'background .25s, border-color .25s',
                      }}
                    >
                      <Icon size={16} color={C.white} strokeWidth={1.8} />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Colonne 2 : Certifications */}
            <div>
              <h4
                style={{
                  fontFamily: SERIF,
                  fontSize: 16,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.18em',
                  color: C.orange,
                  margin: '0 0 24px',
                }}
              >
                Certifications
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {CERTIFS.map((c) => (
                  <div
                    key={c}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 10,
                      fontFamily: SANS,
                      fontSize: 13,
                      color: C.muted,
                      lineHeight: 1.5,
                    }}
                  >
                    <Award
                      size={13}
                      color={C.orange}
                      strokeWidth={1.8}
                      style={{ flexShrink: 0, marginTop: 2 }}
                    />
                    {c}
                  </div>
                ))}
              </div>
            </div>

            {/* Colonne 3 : Contact */}
            <div>
              <h4
                style={{
                  fontFamily: SERIF,
                  fontSize: 16,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.18em',
                  color: C.orange,
                  margin: '0 0 24px',
                }}
              >
                Contact
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { icon: MapPin, label: 'Bordeaux Caudéran, 33200' },
                  { icon: Phone, label: '06 XX XX XX XX' },
                  { icon: Mail, label: 'thomas@lebruncoach.fr' },
                  { icon: Clock, label: 'Lun–Sam · 7h–20h' },
                ].map((c) => {
                  const Icon = c.icon;
                  return (
                    <div
                      key={c.label}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        fontFamily: SANS,
                        fontSize: 14,
                        color: C.muted,
                      }}
                    >
                      <Icon size={15} color={C.orange} strokeWidth={1.8} />
                      {c.label}
                    </div>
                  );
                })}
              </div>

              {/* CTA contact */}
              <div style={{ marginTop: 32 }}>
                <button
                  onClick={() =>
                    document.getElementById('bilan')?.scrollIntoView({ behavior: 'smooth' })
                  }
                  style={{
                    fontFamily: SERIF,
                    fontSize: 14,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    color: C.white,
                    background: C.orange,
                    border: 'none',
                    padding: '12px 24px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  Bilan gratuit
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Bas footer */}
          <div
            style={{
              paddingTop: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 16,
            }}
          >
            <p
              style={{
                fontFamily: SANS,
                fontSize: 13,
                color: C.steelLight,
                margin: 0,
              }}
            >
              © 2025 Thomas Lebrun Coach — Bordeaux Caudéran. Tous droits réservés.
            </p>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              {LINKS.map((l) => (
                <a
                  key={l}
                  href="/templates/impact-276"
                  onClick={(e) => e.preventDefault()}
                  style={{
                    fontFamily: SANS,
                    fontSize: 12,
                    color: C.steelLight,
                    textDecoration: 'none',
                    letterSpacing: '0.04em',
                    transition: 'color .2s',
                  }}
                  onMouseEnter={(e) =>
                    ((e.target as HTMLAnchorElement).style.color = C.muted)
                  }
                  onMouseLeave={(e) =>
                    ((e.target as HTMLAnchorElement).style.color = C.steelLight)
                  }
                >
                  {l}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   Styles globaux responsive
   ════════════════════════════════════════════════════════════════════════════ */
function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=DM+Sans:wght@300;400;500;600;700&display=swap');

      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

      html { scroll-behavior: smooth; }

      body, #impact276-root {
        background: ${C.black};
        color: ${C.white};
        font-family: ${SANS};
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        overflow-x: hidden;
      }

      /* Inputs */
      input, select, button { font-family: inherit; }
      input[type="text"],
      input[type="email"],
      select {
        -webkit-appearance: none;
        font-size: 16px;
      }

      /* prefers-reduced-motion */
      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }

      /* Responsive global */
      @media (max-width: 860px) {
        .r276-section-header { padding: 0 24px !important; }
        .r276-hero-inner { padding: 0 24px !important; }
      }
    `}</style>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   Page principale — assemblage des 10 sections
   ════════════════════════════════════════════════════════════════════════════ */

// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
function Impact276Page() {
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
    C = { ...C, orange: brand };
  }

  
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
    <>
      <GlobalStyles />
      <main id="hero">
        <Nav />
        <HeroSection />
        <StatsSection />
        <ScrollCrossfade />
        <ProgramsSection />
        <MethodSection />
        <NutritionSection />
        <TransformationSection />
        <ScheduleSection />
        <BilanFormSection />
        <FooterSection />
      </main>
    </>
  );
}

export default Impact276Page;
