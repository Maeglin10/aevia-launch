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
import { ArrowRight, ChevronDown, Heart, Leaf, MapPin } from 'lucide-react';

// Hoisted above the design tokens: several templates read `brand` in a
// module-level const — declaring it lower caused a TDZ ReferenceError (500).
let brand: any = null;

/* ════════════════════════════════════════════════════════════════════════════
   DR. ALEXANDRE MOULIN — Médecin Généraliste & Médecine Fonctionnelle · Bordeaux
   Chorégraphie de défilement éditoriale × photographie réelle.
   'use client'. Auto-suffisant. ~2000 lignes.
   ════════════════════════════════════════════════════════════════════════════ */

/* Google Fonts */
const FONTS = `
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;1,300;1,400&family=Source+Sans+3:wght@300;400;500;600&display=swap');
  </style>
`;

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
  bg: '#f6f8f5',
  bgAlt: '#eaeee6',
  bgDark: '#0a1408',
  bgDarkAlt: '#060e04',
  bgCard: '#ffffff',
  accent: '#3c7a52',
  accentDark: '#2c6040',
  accentLight: '#c8e0d0',
  white: '#ffffff',
  ink: '#0a1408',
  textMuted: '#2c4830',
  textFaint: '#6a8870',
  border: '#c4d8c8',
  borderDark: 'rgba(60,122,82,0.2)',
  warm: '#c89050',
};

const SERIF = "'Merriweather', Georgia, serif" as const;
const SANS = "'Source Sans 3', system-ui, sans-serif" as const;

/* ── Photos Unsplash ─────────────────────────────────────────────────────── */
const P = {
  doctor:
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2000&auto=format&fit=crop',
  doctorMd:
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop',
  wellness:
    'https://images.unsplash.com/photo-1498804103-78838778a06b?q=80&w=1600&auto=format&fit=crop',
  wellnessMd:
    'https://images.unsplash.com/photo-1498804103-78838778a06b?q=80&w=800&auto=format&fit=crop',
  functional:
    'https://images.unsplash.com/photo-1544367745-a81e18eb7be2?q=80&w=1600&auto=format&fit=crop',
  functionalMd:
    'https://images.unsplash.com/photo-1544367745-a81e18eb7be2?q=80&w=900&auto=format&fit=crop',
} as const;

/* ── Easing ──────────────────────────────────────────────────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ════════════════════════════════════════════════════════════════════════════
   Interfaces
   ════════════════════════════════════════════════════════════════════════════ */
interface Pillar {
  img: string;
  alt: string;
  index: string;
  label: string;
  body: string;
}

interface Specialty {
  title: string;
  desc: string;
}

interface EditRow {
  eyebrow: string;
  img: string;
  imgAlt: string;
  title: React.ReactNode;
  body: string;
  reverse: boolean;
  roman: string;
}

interface ApproachItem {
  num: string;
  title: string;
  desc: string;
}

interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

/* ════════════════════════════════════════════════════════════════════════════
   Data
   ════════════════════════════════════════════════════════════════════════════ */
const PILLARS: Pillar[] = [
  {
    img: P.doctor,
    alt: 'Médecin en consultation avec un patient',
    index: 'I',
    label: 'MÉDECINE GÉNÉRALE',
    body: "Suivi au long cours, pathologies courantes, prescriptions — la médecine de famille avec le temps qu'elle mérite.",
  },
  {
    img: P.wellness,
    alt: 'Bilan de santé fonctionnel et micronutrition',
    index: 'II',
    label: 'MÉDECINE FONCTIONNELLE',
    body: 'Fatigue chronique, troubles digestifs, hormones — trouver la cause racine, pas seulement soigner le symptôme.',
  },
  {
    img: P.functional,
    alt: 'Médecine fonctionnelle et nutrition thérapeutique',
    index: 'III',
    label: 'MICRONUTRITION',
    body: 'Bilan en acides aminés, vitamines, minéraux — rééquilibrer la biochimie pour retrouver vitalité et clarté mentale.',
  },
];

const SPECIALTIES: Specialty[] = [
  {
    title: 'Médecine générale',
    desc: 'Suivi global, maladies aiguës, ordonnances, certificats médicaux et orientations spécialisées.',
  },
  {
    title: 'Médecine fonctionnelle',
    desc: 'Approche holistique centrée sur la cause racine des déséquilibres chroniques.',
  },
  {
    title: 'Micronutrition',
    desc: 'Bilans en vitamines, minéraux et acides aminés pour un rééquilibrage biochimique précis.',
  },
  {
    title: 'Fatigue chronique',
    desc: 'Diagnostic différentiel approfondi et protocoles de récupération énergétique personnalisés.',
  },
  {
    title: 'Dysbiose intestinale',
    desc: 'Analyse du microbiome, protocoles de restauration et alimentation thérapeutique.',
  },
  {
    title: 'Bilan de santé complet',
    desc: 'Bilan annuel complet : biologie fonctionnelle, composition corporelle, marqueurs préventifs.',
  },
];

const EDIT_ROWS: EditRow[] = [
  {
    eyebrow: 'Notre approche',
    img: P.doctorMd,
    imgAlt: 'Dr. Moulin en consultation approfondie',
    title: (
      <>
        Comprendre /{' '}
        <span style={{ fontStyle: 'italic' }}>avant de prescrire.</span>
      </>
    ),
    body: "Là où la médecine conventionnelle offre 10 minutes, nous en offrons 45. Chaque consultation commence par une anamnèse complète : votre histoire de vie, vos antécédents familiaux, votre environnement, vos habitudes. Parce qu'une ordonnance sans contexte n'est qu'une réponse à moitié.",
    reverse: false,
    roman: 'I',
  },
  {
    eyebrow: 'Le cabinet',
    img: P.wellnessMd,
    imgAlt: 'Cabinet médical du Dr. Moulin à Bordeaux Chartrons',
    title: (
      <>
        Bordeaux /{' '}
        <span style={{ fontStyle: 'italic' }}>Chartrons.</span>
      </>
    ),
    body: 'Notre cabinet de quartier est accessible à pied depuis le tramway, avec stationnement à proximité. Pour celles et ceux qui ne peuvent pas se déplacer, la téléconsultation est disponible. La prise de rendez-vous en ligne permet souvent une consultation le jour même.',
    reverse: true,
    roman: 'II',
  },
];

const APPROACH_ITEMS: ApproachItem[] = [
  {
    num: '01',
    title: 'Anamnèse approfondie',
    desc: 'Votre histoire de vie comme outil diagnostique : antécédents, environnement, événements marquants, habitudes alimentaires et stress chroniques.',
  },
  {
    num: '02',
    title: 'Bilan biologique fonctionnel',
    desc: 'Pas les normes de labo standards, mais les normes optimales : ferritine, cortisol salivaire, zinc, magnésium érythrocytaire, microbiome.',
  },
  {
    num: '03',
    title: 'Plan thérapeutique individualisé',
    desc: 'Combinaison de nutrition, compléments ciblés, gestion du stress et hygiène de vie — un protocole unique, conçu pour vous.',
  },
  {
    num: '04',
    title: 'Suivi à 3, 6 et 12 mois',
    desc: 'Réajustements biologiques et cliniques à chaque étape. La guérison est un processus, pas un événement.',
  },
];

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'Cinq ans de fatigue inexpliquée, trois spécialistes, aucune réponse. En deux consultations, le Dr. Moulin a identifié une hypothyroïdie fonctionnelle couplée à une dysbiose intestinale. Six mois plus tard, je me sens enfin vivante.',
    name: 'Sophie L.',
    role: 'Patiente · Bordeaux',
  },
  {
    quote:
      "Burn-out complet après quinze ans de direction. Grâce au protocole micronutrition et au suivi mensuel du Dr. Moulin, j'ai retrouvé toute ma capacité en quatre mois. Une approche qui va vraiment au fond des choses.",
    name: 'Thomas R.',
    role: 'Dirigeant · Bordeaux',
  },
];

/* ════════════════════════════════════════════════════════════════════════════
   Primitives partagées
   ════════════════════════════════════════════════════════════════════════════ */

/** Étiquette fine, capitales, filet accent. */
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
    opacity: dark ? 0.6 : 0.8,
  };
  const label: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 10.5,
    letterSpacing: '0.40em',
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
      transition={{ duration: 1.1, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Bouton CTA vert avec flèche. */
function AccentButton({
  children,
  onClick,
  filled = false,
  dark = false,
  type = 'button',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  filled?: boolean;
  dark?: boolean;
  type?: 'button' | 'submit';
}) {
  const [hover, setHover] = useState(false);
  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 12,
    padding: '15px 30px',
    fontFamily: SANS,
    fontSize: 12,
    letterSpacing: '0.24em',
    textTransform: 'uppercase',
    fontWeight: 500,
    cursor: 'pointer',
    border: `1px solid ${dark ? C.accentLight : C.accent}`,
    background: filled
      ? dark
        ? C.accentLight
        : C.accent
      : 'transparent',
    color: filled
      ? dark
        ? C.ink
        : C.white
      : dark
        ? C.accentLight
        : C.accent,
    transition: 'all .5s cubic-bezier(.16,1,.3,1)',
  };
  const hov: React.CSSProperties = hover
    ? filled
      ? {
          background: dark ? C.white : C.accentDark,
          transform: 'translateY(-2px)',
          boxShadow: '0 12px 40px -16px rgba(60,122,82,0.5)',
        }
      : {
          background: dark
            ? 'rgba(200,224,208,0.12)'
            : 'rgba(60,122,82,0.08)',
          transform: 'translateY(-2px)',
        }
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
    const onScroll = () => setSolid(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: 'Consultations', href: '#consultations' },
    { label: 'Médecine fonctionnelle', href: '#approche' },
    { label: 'À propos', href: '#editorial' },
    { label: 'RDV', href: '#rdv' },
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
    padding: solid
      ? '16px clamp(20px,5vw,64px)'
      : '26px clamp(20px,5vw,64px)',
    background: solid ? 'rgba(10,20,8,0.95)' : 'transparent',
    backdropFilter: solid ? 'blur(14px) saturate(130%)' : 'none',
    WebkitBackdropFilter: solid ? 'blur(14px) saturate(130%)' : 'none',
    borderBottom: solid
      ? `1px solid rgba(60,122,82,0.25)`
      : '1px solid transparent',
    transition: 'all .6s cubic-bezier(.16,1,.3,1)',
  };

  const brand: React.CSSProperties = {
    fontFamily: SERIF,
    fontSize: 20,
    letterSpacing: '0.06em',
    color: C.white,
    fontWeight: 400,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    textDecoration: 'none',
  };

  const linkRow: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'clamp(18px,2.4vw,36px)',
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
            style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
          />
        ) : (
          <>
            <Leaf size={18} color={C.accent} strokeWidth={1.5} />
            Dr.&nbsp;Moulin
          </>
        )}
      </a>
      <div style={linkRow} className="am-navlinks">
        {links.map((l) => (
          <NavLink key={l.label} label={l.label} href={l.href} />
        ))}
      </div>
      <div className="am-navcta">
        <a href="#rdv" style={{ textDecoration: 'none' }}>
          <AccentButton filled dark>
            Prendre RDV
          </AccentButton>
        </a>
      </div>
      
        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="am-burger"
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
          <span style={{ width: 22, height: 2, background: '#ffffff', borderRadius: 1, display: 'block', transition: 'transform 0.3s', transform: mobileOpen ? 'rotate(45deg) translate(0, 7px)' : 'none' }} />
          <span style={{ width: 22, height: 2, background: '#ffffff', borderRadius: 1, display: 'block', opacity: mobileOpen ? 0 : 1, transition: 'opacity 0.3s' }} />
          <span style={{ width: 22, height: 2, background: '#ffffff', borderRadius: 1, display: 'block', transition: 'transform 0.3s', transform: mobileOpen ? 'rotate(-45deg) translate(0, -7px)' : 'none' }} />
        </button>
        <style>{`
        @media (max-width: 860px) {
          .am-navlinks { display: none !important; }
          .am-burger { display: flex !important; flex-direction: column; }
          .am-navcta { display: none !important; }
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
          background: 'rgba(10,10,10,0.97)',
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
                color: '#ffffff',
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
        color: h ? C.accentLight : 'rgba(255,255,255,0.88)',
        textDecoration: 'none',
        transition: 'color .4s',
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
          transition: 'width .5s cubic-bezier(.16,1,.3,1)',
        }}
      />
    </a>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   2 · HERO (100vh, parallax scale + imgY)
   ════════════════════════════════════════════════════════════════════════════ */
function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '14%']);
  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '-42%']);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.72], [1, 0]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const sec: React.CSSProperties = {
    position: 'relative',
    height: '100vh',
    minHeight: 640,
    overflow: 'hidden',
    background: C.bgDark,
  };

  return (
    <section ref={ref} style={sec} id="hero">
      {/* Photo plein cadre avec parallax */}
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
          src={P.doctor}
          alt="Cabinet du Dr. Alexandre Moulin, médecin fonctionnel à Bordeaux"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </motion.div>

      {/* Deux scrims */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(10,20,8,0.38) 0%, rgba(10,20,8,0.06) 36%, rgba(10,20,8,0.44) 70%, rgba(10,20,8,0.90) 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(130% 80% at 50% 28%, transparent 38%, rgba(10,20,8,0.42) 100%)',
          mixBlendMode: 'multiply',
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
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '0 24px',
          y: titleY,
          opacity: titleOpacity,
        }}
      >
        <Reveal y={18}>
          <Eyebrow color={C.accentLight} align="center" dark>
            Médecin Généraliste &amp; Médecine Fonctionnelle · Bordeaux
          </Eyebrow>
        </Reveal>

        <motion.h1
          initial={{ opacity: 0, y: 42 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.15 }}
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontWeight: 400,
            color: C.white,
            fontSize: 'clamp(3rem,6.5vw,7.5rem)',
            lineHeight: 1.0,
            letterSpacing: '-0.01em',
            margin: '28px 0 24px',
            textShadow: '0 14px 60px rgba(0,0,0,0.48)',
          }}
        >
          Médecine /{' '}
          <span style={{ color: C.accentLight }}>qui va</span>
          {' '}/ au fond.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.45 }}
          style={{
            fontFamily: SANS,
            fontWeight: 300,
            fontSize: 'clamp(15px,1.8vw,20px)',
            color: 'rgba(255,255,255,0.82)',
            maxWidth: 520,
            lineHeight: 1.68,
            letterSpacing: '0.01em',
          }}
        >
          Consultations de 45 minutes, bilan fonctionnel complet, protocole
          personnalisé. La santé que vous méritez vraiment.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.72 }}
          style={{ marginTop: 42 }}
        >
          <AccentButton filled dark>
            Réserver une consultation
          </AccentButton>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
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
          gap: 10,
          opacity: cueOpacity,
        }}
      >
        <span
          style={{
            fontFamily: SANS,
            fontSize: 10,
            letterSpacing: '0.34em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.62)',
          }}
        >
          Découvrir
        </span>
        <motion.div
          animate={{ y: [0, 9, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={20} color={C.accentLight} strokeWidth={1.4} />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   3 · INTRO (bgAlt, centré, SERIF italic)
   ════════════════════════════════════════════════════════════════════════════ */
function Intro() {
  const sec: React.CSSProperties = {
    background: C.bgAlt,
    padding: 'clamp(96px,14vw,200px) clamp(24px,8vw,160px)',
    textAlign: 'center',
  };
  return (
    <section style={sec}>
      <Reveal>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 36 }}>
          <Eyebrow color={C.textMuted} align="center">
            Philosophie de soin
          </Eyebrow>
        </div>
      </Reveal>
      <Reveal delay={0.1}>
        <p
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: 'clamp(24px,3.4vw,48px)',
            lineHeight: 1.38,
            color: C.ink,
            maxWidth: 1000,
            margin: '0 auto',
          }}
        >
          La santé n&apos;est pas l&apos;absence de maladie. C&apos;est une
          énergie que vous méritez de retrouver.
        </p>
      </Reveal>
      <Reveal delay={0.2}>
        <div
          style={{
            width: 1,
            height: 80,
            background: `linear-gradient(${C.accent}, transparent)`,
            margin: '56px auto 0',
          }}
        />
      </Reveal>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   4 · PILLAR SEQUENCE — sticky crossfade 320vh
   ════════════════════════════════════════════════════════════════════════════ */
function PillarImage({
  pillar,
  i,
  total,
  progress,
}: {
  pillar: Pillar;
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
        src={pillar.img}
        alt={pillar.alt}
        loading="lazy"
        style={{ width: '100%', height: '100%', objectFit: 'cover', scale }}
      />
    </motion.div>
  );
}

function PillarCaption({
  pillar,
  i,
  total,
  progress,
}: {
  pillar: Pillar;
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
  const yMotion = useTransform(progress, [start, end], [30, -30]);

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
        y: yMotion,
      }}
    >
      <span
        style={{
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontSize: 'clamp(40px,8vw,110px)',
          color: `rgba(200,224,208,0.22)`,
          lineHeight: 1,
          marginBottom: 4,
        }}
      >
        {pillar.index}
      </span>
      <h2
        style={{
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: 'clamp(12px,1.4vw,16px)',
          letterSpacing: '0.36em',
          textTransform: 'uppercase',
          color: C.accentLight,
          margin: '0 0 20px',
        }}
      >
        {pillar.label}
      </h2>
      <p
        style={{
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontWeight: 300,
          fontSize: 'clamp(17px,2vw,24px)',
          color: 'rgba(255,255,255,0.88)',
          maxWidth: 520,
          lineHeight: 1.62,
          textShadow: '0 4px 24px rgba(0,0,0,0.5)',
        }}
      >
        {pillar.body}
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
    [0.28, 1, 1, 0.28],
  );
  const width = useTransform(progress, [i * seg, (i + 1) * seg], [10, 36]);
  return (
    <motion.div
      style={{ height: 2, width, background: C.accent, opacity }}
    />
  );
}

function PillarSequence() {
  const n = PILLARS.length;
  const progress = useMotionValue(0.5 / n);
  const [active, setActive] = useState(0);
  const goTo = (i: number) => {
    setActive(i);
    progress.set((i + 0.5) / n);
  };

  /* Label section top-right */
  const labelY = useTransform(progress, [0, 1], [0, 0]);

  return (
    <section
      style={{ height: '100vh', overflow: 'hidden', position: 'relative', background: C.bgDark }}
      id="consultations"
    >
      <div
        style={{
          position: 'relative',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {PILLARS.map((p, i) => (
          <PillarImage
            key={p.index}
            pillar={p}
            i={i}
            total={PILLARS.length}
            progress={progress}
          />
        ))}

        {/* Scrim lisibilité */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to bottom, rgba(10,20,8,0.30), rgba(10,20,8,0.08) 40%, rgba(10,20,8,0.60))',
          }}
        />

        {PILLARS.map((p, i) => (
          <PillarCaption
            key={p.index}
            pillar={p}
            i={i}
            total={PILLARS.length}
            progress={progress}
          />
        ))}

        {/* Section label top-right */}
        <motion.div
          style={{
            position: 'absolute',
            top: 32,
            right: 'clamp(20px,5vw,64px)',
            y: labelY,
            zIndex: 4,
          }}
        >
          <span
            style={{
              fontFamily: SANS,
              fontSize: 10,
              letterSpacing: '0.36em',
              textTransform: 'uppercase',
              color: 'rgba(200,224,208,0.55)',
            }}
          >
            Les trois piliers
          </span>
        </motion.div>

        {/* Progress dots bas de page */}
        <div
          style={{
            position: 'absolute',
            bottom: 36,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 12,
          }}
        >
          {PILLARS.map((p, i) => (
            <ProgressDot
              key={p.index}
              i={i}
              total={PILLARS.length}
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
   5 · SPECIALTY CARDS — 6 cartes blanches, bordure verte gauche, hover lift
   ════════════════════════════════════════════════════════════════════════════ */
function SpecialtyCard({
  s,
  i,
}: {
  s: Specialty;
  i: number;
}) {
  const [hover, setHover] = useState(false);
  const card: React.CSSProperties = {
    background: C.bgCard,
    border: `1px solid ${hover ? C.border : 'rgba(196,216,200,0.5)'}`,
    borderLeft: `3px solid ${hover ? C.accent : C.accentLight}`,
    padding: 'clamp(26px,3vw,36px)',
    transform: hover ? 'translateY(-8px)' : 'none',
    boxShadow: hover
      ? '0 32px 64px -28px rgba(60,122,82,0.22)'
      : '0 8px 32px -20px rgba(60,122,82,0.10)',
    transition: 'all .55s cubic-bezier(.16,1,.3,1)',
    cursor: 'default',
  };
  return (
    <Reveal delay={i * 0.08}>
      <article
        style={card}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <h3
          style={{
            fontFamily: SERIF,
            fontWeight: 400,
            fontSize: 'clamp(18px,1.8vw,22px)',
            color: C.ink,
            margin: '0 0 12px',
            lineHeight: 1.2,
          }}
        >
          {s.title}
        </h3>
        <p
          style={{
            fontFamily: SANS,
            fontWeight: 300,
            fontSize: 15,
            lineHeight: 1.68,
            color: C.textMuted,
            margin: 0,
          }}
        >
          {s.desc}
        </p>
      </article>
    </Reveal>
  );
}

function SpecialtyCards() {
  const sec: React.CSSProperties = {
    background: C.bg,
    padding: 'clamp(90px,12vw,170px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 'clamp(20px,2.4vw,32px)',
    maxWidth: 1240,
    margin: '0 auto',
  };
  return (
    <section id="contact" style={sec}>
      <div style={{ maxWidth: 1240, margin: '0 auto 56px' }}>
        <Reveal>
          <Eyebrow color={C.textMuted}>Domaines d&apos;expertise</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontWeight: 400,
              fontSize: 'clamp(34px,5vw,66px)',
              color: C.ink,
              margin: '20px 0 0',
              lineHeight: 1.06,
            }}
          >
            Ce que nous{' '}
            <span style={{ fontStyle: 'italic', color: C.accent }}>traitons</span>
          </h2>
        </Reveal>
      </div>
      <div style={grid}>
        {SPECIALTIES.map((s, i) => (
          <SpecialtyCard key={s.title} s={s} i={i} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   6 · EDITORIAL ROWS — 2 lignes image / texte alternées, chiffres romains
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

function EditorialRowItem({ row }: { row: EditRow }) {
  const wrap: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 'clamp(36px,6vw,88px)',
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
  return (
    <div style={wrap} className="am-editrow">
      {/* Chiffre romain fantôme */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          right: row.reverse ? 'auto' : -20,
          left: row.reverse ? -20 : 'auto',
          top: -40,
          fontFamily: SERIF,
          fontSize: 'clamp(100px,16vw,200px)',
          fontWeight: 700,
          color: C.warm,
          opacity: 0.12,
          lineHeight: 1,
          userSelect: 'none',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        {row.roman}
      </span>

      <Reveal y={48} style={{ ...imgWrap, position: 'relative', zIndex: 1 }}>
        <ParallaxImg src={row.img} alt={row.imgAlt} />
      </Reveal>

      <div style={{ ...txt, zIndex: 1 }}>
        <Reveal>
          <Eyebrow color={C.textMuted}>{row.eyebrow}</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h3
            style={{
              fontFamily: SERIF,
              fontWeight: 400,
              fontSize: 'clamp(28px,4vw,56px)',
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
              fontWeight: 300,
              fontSize: 'clamp(15px,1.5vw,18px)',
              lineHeight: 1.82,
              color: C.textMuted,
              maxWidth: 460,
            }}
          >
            {row.body}
          </p>
        </Reveal>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .am-editrow { grid-template-columns: 1fr !important; }
          .am-editrow > * { order: initial !important; }
        }
      `}</style>
    </div>
  );
}

function EditorialRows() {
  const sec: React.CSSProperties = {
    background: C.bg,
    padding: 'clamp(80px,11vw,160px) clamp(24px,6vw,96px)',
  };
  return (
    <section style={sec} id="editorial">
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(80px,12vw,160px)',
        }}
      >
        {EDIT_ROWS.map((r) => (
          <EditorialRowItem key={r.eyebrow} row={r} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   7 · APPROACH PANEL — sticky image gauche, 4 steps droite
   ════════════════════════════════════════════════════════════════════════════ */
function ApproachPanel() {
  const sec: React.CSSProperties = {
    background: C.bgDark,
    padding: 'clamp(80px,11vw,150px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '0.9fr 1.1fr',
    gap: 'clamp(40px,6vw,96px)',
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
    <section style={sec} id="approche">
      <div style={grid} className="am-apppanel">
        {/* Image collante */}
        <div style={stickySide} className="am-apppanel-sticky">
          <div
            style={{
              overflow: 'hidden',
              border: `1px solid rgba(60,122,82,0.3)`,
              aspectRatio: '3 / 4',
            }}
          >
            <img
              src={P.functionalMd}
              alt="Médecine fonctionnelle — bilan approfondi"
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
                letterSpacing: '0.26em',
                textTransform: 'uppercase',
                color: C.accentLight,
                marginBottom: 10,
              }}
            >
              Médecine fonctionnelle
            </div>
            <div
              style={{
                fontFamily: SERIF,
                fontStyle: 'italic',
                fontWeight: 300,
                fontSize: 17,
                color: 'rgba(255,255,255,0.72)',
                lineHeight: 1.6,
              }}
            >
              « Chercher la cause, pas seulement le symptôme. »
            </div>
          </div>
        </div>

        {/* Steps qui défilent */}
        <div>
          <Reveal>
            <Eyebrow color={C.accent} dark>Notre protocole</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2
              style={{
                fontFamily: SERIF,
                fontWeight: 400,
                fontSize: 'clamp(32px,4.5vw,62px)',
                color: C.white,
                margin: '20px 0 56px',
                lineHeight: 1.06,
              }}
            >
              La méthode{' '}
              <span style={{ fontStyle: 'italic', color: C.accentLight }}>
                fonctionnelle
              </span>
            </h2>
          </Reveal>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {APPROACH_ITEMS.map((item, i) => (
              <Reveal key={item.num} delay={0.06 * i}>
                <div
                  style={{
                    padding: 'clamp(28px,3vw,38px) 0',
                    borderTop: `1px solid rgba(60,122,82,0.25)`,
                    display: 'flex',
                    gap: 28,
                    alignItems: 'baseline',
                  }}
                >
                  <span
                    style={{
                      fontFamily: SERIF,
                      fontStyle: 'italic',
                      fontSize: 'clamp(22px,2.4vw,30px)',
                      color: C.warm,
                      minWidth: 48,
                      lineHeight: 1,
                    }}
                  >
                    {item.num}
                  </span>
                  <div>
                    <h4
                      style={{
                        fontFamily: SERIF,
                        fontWeight: 400,
                        fontSize: 'clamp(18px,1.9vw,24px)',
                        color: C.white,
                        margin: '0 0 10px',
                      }}
                    >
                      {item.title}
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
                      {item.desc}
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
          .am-apppanel { grid-template-columns: 1fr !important; }
          .am-apppanel-sticky { position: static !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   8 · TESTIMONIALS — bgAlt, 2 cartes blanches, icône Heart
   ════════════════════════════════════════════════════════════════════════════ */
function Testimonials() {
  const sec: React.CSSProperties = {
    background: C.bgAlt,
    padding: 'clamp(90px,12vw,170px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: 'clamp(28px,3.6vw,56px)',
    maxWidth: 1180,
    margin: '0 auto',
  };
  return (
    <section style={sec}>
      <div style={{ maxWidth: 1180, margin: '0 auto 60px', textAlign: 'center' }}>
        <Reveal>
          <Eyebrow color={C.textMuted} align="center">
            Témoignages patients
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontWeight: 400,
              fontSize: 'clamp(32px,5vw,64px)',
              color: C.ink,
              margin: '20px 0 0',
              lineHeight: 1.06,
            }}
          >
            Ils ont{' '}
            <span style={{ fontStyle: 'italic', color: C.accent }}>retrouvé</span>
          </h2>
        </Reveal>
      </div>
      <div style={grid}>
        {TESTIMONIALS.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.12} style={{ height: '100%' }}>
            <figure
              style={{
                background: C.bgCard,
                border: `1px solid ${C.border}`,
                padding: 'clamp(32px,4vw,50px)',
                margin: 0,
                height: '100%',
                boxSizing: 'border-box',
                boxShadow: '0 20px 56px -36px rgba(60,122,82,0.22)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Heart
                size={30}
                color={C.accent}
                strokeWidth={1.4}
                style={{ marginBottom: 22 }}
              />
              <blockquote
                style={{
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  fontWeight: 300,
                  fontSize: 'clamp(16px,1.8vw,20px)',
                  lineHeight: 1.66,
                  color: C.ink,
                  margin: '0 0 28px',
                  flex: 1,
                }}
              >
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption
                style={{ borderTop: `1px solid ${C.border}`, paddingTop: 20 }}
              >
                <div
                  style={{
                    fontFamily: SERIF,
                    fontWeight: 400,
                    fontSize: 18,
                    color: C.accent,
                  }}
                >
                  {t.name}
                </div>
                <div
                  style={{
                    fontFamily: SANS,
                    fontSize: 11,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: C.textFaint,
                    marginTop: 6,
                  }}
                >
                  {t.role}
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
   9 · APPOINTMENT FORM — bgDark, 720px centré, champs underline, sent state
   ════════════════════════════════════════════════════════════════════════════ */
function AppointmentForm() {
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [tel, setTel] = useState('');
  const [motif, setMotif] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prenom || !email || !motif) return;
    setSent(true);
  };

  const sec: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    background: C.bgDark,
    padding: 'clamp(96px,13vw,180px) clamp(24px,6vw,96px)',
  };

  const fieldBase: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    background: 'transparent',
    border: 'none',
    borderBottom: `1px solid rgba(60,122,82,0.4)`,
    padding: '16px 2px',
    fontFamily: SERIF,
    fontWeight: 300,
    fontSize: 17,
    color: C.white,
    outline: 'none',
    transition: 'border-color .35s',
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 10,
    letterSpacing: '0.28em',
    textTransform: 'uppercase',
    color: C.accentLight,
    display: 'block',
    marginBottom: 4,
  };

  return (
    <section style={sec} id="rdv">
      {/* Photo arrière-plan fantôme */}
      <img
        src={P.doctor}
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
          maxWidth: 720,
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <Reveal>
          <Eyebrow color={C.accentLight} align="center" dark>
            Prendre rendez-vous
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontWeight: 400,
              fontSize: 'clamp(36px,5.5vw,74px)',
              color: C.white,
              margin: '22px 0 18px',
              lineHeight: 1.06,
            }}
          >
            Commencer votre{' '}
            <span style={{ fontStyle: 'italic', color: C.accentLight }}>
              parcours
            </span>
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <p
            style={{
              fontFamily: SANS,
              fontWeight: 300,
              fontSize: 'clamp(15px,1.6vw,18px)',
              lineHeight: 1.72,
              color: 'rgba(255,255,255,0.72)',
              maxWidth: 500,
              margin: '0 auto 52px',
            }}
          >
            Première consultation ou suivi fonctionnel — nous répondons sous
            24 heures pour confirmer votre créneau.
          </p>
        </Reveal>

        {sent ? (
          <Reveal>
            <div
              style={{
                border: `1px solid rgba(60,122,82,0.5)`,
                padding: 'clamp(36px,5vw,60px)',
                background: 'rgba(60,122,82,0.08)',
              }}
            >
              <Leaf
                size={36}
                color={C.accentLight}
                strokeWidth={1.3}
                style={{ margin: '0 auto 18px', display: 'block' }}
              />
              <h3
                style={{
                  fontFamily: SERIF,
                  fontWeight: 400,
                  fontSize: 'clamp(24px,3vw,36px)',
                  color: C.white,
                  margin: '0 0 14px',
                }}
              >
                Merci {prenom},
              </h3>
              <p
                style={{
                  fontFamily: SANS,
                  fontWeight: 300,
                  fontSize: 16,
                  color: 'rgba(255,255,255,0.72)',
                  margin: 0,
                  lineHeight: 1.7,
                }}
              >
                nous confirmons votre RDV sous 24h à l&apos;adresse{' '}
                <strong style={{ color: C.accentLight, fontWeight: 500 }}>
                  {email}
                </strong>
                .
              </p>
            </div>
          </Reveal>
        ) : (
          <Reveal delay={0.22}>
            <form
              onSubmit={onSubmit}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 32,
                textAlign: 'left',
              }}
            >
              {/* Prénom */}
              <div>
                <label style={labelStyle} htmlFor="am-prenom">
                  Prénom
                </label>
                <input
                  id="am-prenom"
                  style={fieldBase}
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  placeholder="Alexandre"
                  autoComplete="given-name"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label style={labelStyle} htmlFor="am-email">
                  Adresse e-mail
                </label>
                <input
                  id="am-email"
                  style={fieldBase}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alexandre@exemple.fr"
                  autoComplete="email"
                  required
                />
              </div>

              {/* Téléphone */}
              <div>
                <label style={labelStyle} htmlFor="am-tel">
                  Téléphone
                </label>
                <input
                  id="am-tel"
                  style={fieldBase}
                  type="tel"
                  value={tel}
                  onChange={(e) => setTel(e.target.value)}
                  placeholder="+33 6 00 00 00 00"
                  autoComplete="tel"
                />
              </div>

              {/* Motif */}
              <div>
                <label style={labelStyle} htmlFor="am-motif">
                  Motif de consultation
                </label>
                <select
                  id="am-motif"
                  style={{
                    ...fieldBase,
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    cursor: 'pointer',
                    color: motif ? C.white : 'rgba(255,255,255,0.38)',
                  }}
                  value={motif}
                  onChange={(e) => setMotif(e.target.value)}
                  required
                >
                  <option value="" style={{color: '#111', background: brand ?? '#1a2a18' }}>
                    Choisir un motif…
                  </option>
                  <option value="Consultation générale" style={{color: '#111', background: brand ?? '#1a2a18' }}>
                    Consultation générale
                  </option>
                  <option value="Médecine fonctionnelle" style={{color: '#111', background: brand ?? '#1a2a18' }}>
                    Médecine fonctionnelle
                  </option>
                  <option value="Bilan de santé" style={{color: '#111', background: brand ?? '#1a2a18' }}>
                    Bilan de santé
                  </option>
                  <option value="Maladies chroniques" style={{color: '#111', background: brand ?? '#1a2a18' }}>
                    Maladies chroniques
                  </option>
                  <option value="Micronutrition" style={{color: '#111', background: brand ?? '#1a2a18' }}>
                    Micronutrition
                  </option>
                  <option value="Autre" style={{color: '#111', background: brand ?? '#1a2a18' }}>
                    Autre
                  </option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label style={labelStyle} htmlFor="am-message">
                  Message (optionnel)
                </label>
                <textarea
                  id="am-message"
                  style={{
                    ...fieldBase,
                    resize: 'vertical',
                    minHeight: 100,
                    paddingTop: 12,
                  }}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Décrivez brièvement vos symptômes ou votre demande…"
                  rows={4}
                />
              </div>

              <div style={{ textAlign: 'center', marginTop: 8 }}>
                <AccentButton filled dark type="submit">
                  Envoyer ma demande
                </AccentButton>
              </div>
            </form>
          </Reveal>
        )}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   10 · FOOTER — bgDarkAlt, 4 colonnes, en-têtes verts
   ════════════════════════════════════════════════════════════════════════════ */
function Footer() {
  const cols: { title: string; items: { label: string; href: string }[] }[] = [
    {
      title: 'Consultations',
      items: [
        { label: 'Médecine générale', href: '#consultations' },
        { label: 'Médecine fonctionnelle', href: '#consultations' },
        { label: 'Micronutrition', href: '#consultations' },
        { label: 'Bilan de santé', href: '#consultations' },
      ],
    },
    {
      title: 'Approche',
      items: [
        { label: 'Notre protocole', href: '#approche' },
        { label: 'Anamnèse', href: '#approche' },
        { label: 'Bilan biologique', href: '#approche' },
        { label: 'Suivi personnalisé', href: '#approche' },
      ],
    },
    {
      title: 'Contact',
      items: [
        { label: 'Prendre RDV', href: '#rdv' },
        { label: 'Téléconsultation', href: '#rdv' },
        { label: 'Bordeaux · Chartrons', href: '#rdv' },
        { label: 'dr.moulin@exemple.fr', href: '#rdv' },
      ],
    },
  ];

  const foot: React.CSSProperties = {
    background: C.bgDarkAlt,
    borderTop: `1px solid rgba(60,122,82,0.18)`,
    padding: 'clamp(70px,9vw,110px) clamp(24px,6vw,96px) 40px',
  };

  return (
    <footer style={foot}>
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.4fr repeat(3, 1fr)',
          gap: 'clamp(36px,5vw,70px)',
        }}
        className="am-footgrid"
      >
        {/* Brand */}
        <div>
          <div
            style={{
              fontFamily: SERIF,
              fontWeight: 400,
              fontSize: 22,
              letterSpacing: '0.04em',
              color: C.white,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <Leaf size={20} color={C.accent} strokeWidth={1.5} />
            Dr.&nbsp;Alexandre&nbsp;Moulin
          </div>
          <p
            style={{
              fontFamily: SANS,
              fontWeight: 300,
              fontSize: 15,
              lineHeight: 1.72,
              color: 'rgba(255,255,255,0.55)',
              marginTop: 20,
              maxWidth: 320,
            }}
          >
            Médecin généraliste &amp; médecine fonctionnelle à Bordeaux.
            Consultations approfondies, bilans personnalisés.
          </p>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginTop: 22,
              fontFamily: SANS,
              fontSize: 11,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.45)',
            }}
          >
            <MapPin size={13} color={C.accent} strokeWidth={1.5} />
            Bordeaux · Chartrons
          </div>
        </div>

        {cols.map((c) => (
          <div key={c.title}>
            <div
              style={{
                fontFamily: SANS,
                fontWeight: 500,
                fontSize: 10.5,
                letterSpacing: '0.26em',
                textTransform: 'uppercase',
                color: C.accent,
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
                gap: 13,
              }}
            >
              {c.items.map((it) => (
                <li key={it.label}>
                  <a
                    href={it.href}
                    style={{
                      fontFamily: SANS,
                      fontWeight: 300,
                      fontSize: 15,
                      color: 'rgba(255,255,255,0.62)',
                      textDecoration: 'none',
                      transition: 'color .35s',
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLAnchorElement).style.color =
                        C.accentLight)
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLAnchorElement).style.color =
                        'rgba(255,255,255,0.62)')
                    }
                  >
                    {it.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bas de page */}
      <div
        style={{
          maxWidth: 1240,
          margin: '64px auto 0',
          paddingTop: 28,
          borderTop: `1px solid rgba(60,122,82,0.14)`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
          fontFamily: SANS,
          fontWeight: 300,
          fontSize: 11,
          letterSpacing: '0.10em',
          color: 'rgba(255,255,255,0.38)',
        }}
      >
        <span>
          © 2026 Dr. Alexandre Moulin. Médecin conventionné secteur 2 · RPPS
          xxxxxxxxx.
        </span>
        <span style={{ display: 'flex', gap: 24 }}>
          <a href="#rdv" style={{ color: 'inherit', textDecoration: 'none' }}>
            Mentions légales
          </a>
          <a href="#rdv" style={{ color: 'inherit', textDecoration: 'none' }}>
            Politique de confidentialité
          </a>
        </span>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .am-footgrid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .am-footgrid { grid-template-columns: 1fr !important; }
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
    C = { ...C, accent: brand, accentLight: shadeColor(brand, 25), accentDark: shadeColor(brand, -20) };
  }

  const root: React.CSSProperties = {
    background: C.bg,
    color: C.ink,
    fontFamily: SERIF,
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
      {/* Google Fonts injection */}
      <div dangerouslySetInnerHTML={{ __html: FONTS }} />

      <Nav />
      <Hero />
      <Intro />
      <PillarSequence />
      <SpecialtyCards />
      <EditorialRows />
      <ApproachPanel />
      <Testimonials />
      <AppointmentForm />
      <Footer />
    </main>
  );
}
