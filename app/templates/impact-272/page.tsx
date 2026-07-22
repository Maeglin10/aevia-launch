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
import { ArrowRight, ChevronDown, Heart, MapPin, Quote } from 'lucide-react';

/* ════════════════════════════════════════════════════════════════════════════
   KINÉPÉDIATRIE BORDEAUX — Kinésithérapie Pédiatrique & Respiratoire · Bordeaux
   Photographie réelle + chorégraphie éditoriale au défilement (style cabinet
   premium pédiatrique × chaleur familiale). Auto-suffisant. 'use client'.
   ════════════════════════════════════════════════════════════════════════════ */

/* ── Google Fonts ─────────────────────────────────────────────────────────── */
const FONTS_HREF =
  'https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,300;0,400;0,600;0,700;1,400&family=Merriweather:ital,wght@0,300;0,400;1,300;1,400&display=swap';

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
  bg: '#f4f8fc',
  bgAlt: '#e4f0f8',
  bgDark: '#081428',
  bgDarkAlt: '#040c18',
  bgCard: '#ffffff',
  accent: '#2878c0',
  accentDark: '#1c60a0',
  accentLight: '#bcd8f4',
  white: '#ffffff',
  ink: '#081428',
  textMuted: '#1c3a58',
  textFaint: '#6888a8',
  border: '#b8d4ec',
  borderDark: 'rgba(40,120,192,0.2)',
  peach: '#e08060',
};

const SERIF = "'Merriweather', Georgia, serif" as const;
const SANS = "'Nunito', system-ui, sans-serif" as const;

/* ── Photos Unsplash ──────────────────────────────────────────────────────── */
const BASE = 'https://images.unsplash.com/photo-';
const P = {
  hero: `${BASE}1544367745-a81e18eb7be2?q=80&w=2000&auto=format&fit=crop`,
  resp: `${BASE}1544367745-a81e18eb7be2?q=80&w=1600&auto=format&fit=crop`,
  motor: `${BASE}1498804103-78838778a06b?q=80&w=1600&auto=format&fit=crop`,
  postop: `${BASE}1506126613-423d21668e8b?q=80&w=1600&auto=format&fit=crop`,
  editorial1: `${BASE}1544367745-a81e18eb7be2?q=80&w=800&auto=format&fit=crop`,
  editorial2: `${BASE}1498804103-78838778a06b?q=80&w=800&auto=format&fit=crop`,
  method: `${BASE}1506126613-423d21668e8b?q=80&w=900&auto=format&fit=crop`,
} as const;

/* ── Easing partagé ──────────────────────────────────────────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ════════════════════════════════════════════════════════════════════════════
   Interfaces TypeScript
   ════════════════════════════════════════════════════════════════════════════ */
interface Specialty {
  src: string;
  alt: string;
  index: string;
  label: string;
  description: string;
}

interface Care {
  title: string;
  icon: string;
}

interface EditRow {
  eyebrow: string;
  img: string;
  alt: string;
  titleLine1: string;
  titleLine2: string;
  bullets: string[];
  reverse: boolean;
  num: string;
}

interface Testimonial {
  quote: string;
  author: string;
  context: string;
}

interface MethodItem {
  num: string;
  title: string;
  body: string;
}

/* ════════════════════════════════════════════════════════════════════════════
   Données
   ════════════════════════════════════════════════════════════════════════════ */
const PHASES: Specialty[] = [
  {
    src: P.resp,
    alt: 'Kinésithérapie respiratoire pédiatrique',
    index: 'I',
    label: 'KINÉSITHÉRAPIE RESPIRATOIRE',
    description:
      'Mucoviscidose, asthme, bronchiolite, BPCO — désencombrement bronchique et rééducation de la fonction ventilatoire.',
  },
  {
    src: P.motor,
    alt: "Rééducation du développement moteur de l'enfant",
    index: 'II',
    label: 'DÉVELOPPEMENT MOTEUR',
    description:
      "Retard moteur, hypotonie, paralysie cérébrale — accompagner chaque enfant à son propre rythme vers l'autonomie.",
  },
  {
    src: P.postop,
    alt: 'Kinésithérapie post-opératoire pédiatrique',
    index: 'III',
    label: 'POST-OPÉRATOIRE PÉDIATRIQUE',
    description:
      'Scoliose opérée, chirurgie orthopédique, traumatologie — retour à la mobilité adapté aux jeunes patients.',
  },
];

const CARE_CARDS: Care[] = [
  { title: 'Kinésithérapie respiratoire', icon: '🫁' },
  { title: 'Développement psychomoteur', icon: '🧠' },
  { title: 'Rééducation post-op', icon: '🩹' },
  { title: 'Plagiocéphalie & torticolis', icon: '👶' },
  { title: 'Troubles neuro-développementaux', icon: '🌱' },
  { title: 'Drainage lymphatique pédiatrique', icon: '💙' },
];

const EDIT_ROWS: EditRow[] = [
  {
    eyebrow: 'Notre approche',
    img: P.editorial1,
    alt: 'Séance de kinésithérapie pédiatrique par le jeu',
    titleLine1: "L'enfant",
    titleLine2: "d'abord.",
    bullets: [
      "Thérapie par le jeu — l'enfant progresse sans savoir qu'il travaille.",
      "Séances adaptées au rythme et à l'âge de chaque enfant.",
      'Parents présents et impliqués dans chaque séance.',
    ],
    reverse: false,
    num: '01',
  },
  {
    eyebrow: 'Le cabinet',
    img: P.editorial2,
    alt: 'Cabinet de kinésithérapie pédiatrique à Bordeaux Mériadeck',
    titleLine1: 'Bordeaux',
    titleLine2: 'Mériadeck.',
    bullets: [
      'Environnement dédié aux enfants — jouets, couleurs vives, aucun blanc médical.',
      'Rez-de-chaussée entièrement accessible.',
      "Parking validé à l'entrée du cabinet.",
    ],
    reverse: true,
    num: '02',
  },
];

const METHOD_ITEMS: MethodItem[] = [
  {
    num: '01',
    title: 'Bilan initial 45 min',
    body: "Histoire de l'enfant, observation motrice, bilan fonctionnel complet.",
  },
  {
    num: '02',
    title: 'Objectifs co-construits',
    body: "Avec les parents et l'équipe médicale référente de l'enfant.",
  },
  {
    num: '03',
    title: 'Séances par le jeu',
    body: "L'enfant progresse sans savoir qu'il travaille — chaque séance est une aventure.",
  },
  {
    num: '04',
    title: 'Compte-rendu mensuel',
    body: 'Transmission structurée aux médecins référents et aux spécialistes.',
  },
];

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Notre fils avait des bronchiolites à répétition. En quelques séances, on a appris à le désengorger nous-mêmes à la maison. À 3 ans, il respire enfin facilement — c'est un autre enfant.",
    author: 'Famille Leclerc',
    context: "Parent d'un enfant suivi en kinésithérapie respiratoire",
  },
  {
    quote:
      'Notre fille ne marchait toujours pas à 19 mois. Après 8 séances à son rythme, elle a fait ses premiers pas à 22 mois, confiante et heureuse. Ce cabinet a changé notre vie.',
    author: 'Famille Moreau',
    context: "Parent d'un enfant en retard moteur à la marche",
  },
];

/* ════════════════════════════════════════════════════════════════════════════
   Primitives partagées
   ════════════════════════════════════════════════════════════════════════════ */
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

function Eyebrow({
  children,
  light = false,
  centered = false,
}: {
  children: React.ReactNode;
  light?: boolean;
  centered?: boolean;
}) {
  const color = light ? C.accentLight : C.accent;
  const wrap: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    justifyContent: centered ? 'center' : 'flex-start',
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
    fontWeight: 600,
  };
  return (
    <div style={wrap}>
      <span style={rule} />
      <span style={label}>{children}</span>
      {centered ? <span style={rule} /> : null}
    </div>
  );
}

function BlueButton({
  children,
  onClick,
  filled = false,
  type = 'button',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  filled?: boolean;
  type?: 'button' | 'submit';
}) {
  const [hover, setHover] = useState(false);
  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 12,
    padding: '15px 32px',
    fontFamily: SANS,
    fontSize: 13,
    letterSpacing: '0.14em',
    fontWeight: 700,
    cursor: 'pointer',
    border: `2px solid ${C.accent}`,
    background: filled ? C.accent : 'transparent',
    color: filled ? C.white : C.accent,
    borderRadius: 4,
    transition: 'all .45s cubic-bezier(.16,1,.3,1)',
    textDecoration: 'none',
  };
  const hov: React.CSSProperties = hover
    ? filled
      ? { background: C.accentDark, borderColor: C.accentDark, transform: 'translateY(-2px)', boxShadow: '0 12px 36px -12px rgba(40,120,192,0.55)' }
      : { background: 'rgba(40,120,192,0.08)', transform: 'translateY(-2px)' }
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
        size={15}
        style={{
          transform: hover ? 'translateX(5px)' : 'none',
          transition: 'transform .45s cubic-bezier(.16,1,.3,1)',
        }}
      />
    </button>
  );
}

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

/* ════════════════════════════════════════════════════════════════════════════
   1 · NAV
   ════════════════════════════════════════════════════════════════════════════ */
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
        fontWeight: 600,
        letterSpacing: '0.06em',
        color: h ? C.accent : 'rgba(255,255,255,0.90)',
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
          background: C.accentLight,
          borderRadius: 2,
          transition: 'width .45s cubic-bezier(.16,1,.3,1)',
        }}
      />
    </a>
  );
}

function Nav() {
  const [solid, setSolid] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  React.useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 72);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: 'Soins', href: '#soins' },
    { label: 'Notre approche', href: '#approche' },
    { label: 'Méthode', href: '#methode' },
    { label: 'Témoignages', href: '#temoignages' },
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
      ? '14px clamp(20px,5vw,60px)'
      : '24px clamp(20px,5vw,60px)',
    background: solid ? 'rgba(8,20,40,0.95)' : 'transparent',
    backdropFilter: solid ? 'blur(16px) saturate(130%)' : 'none',
    WebkitBackdropFilter: solid ? 'blur(16px) saturate(130%)' : 'none',
    borderBottom: solid
      ? `1px solid rgba(40,120,192,0.22)`
      : '1px solid transparent',
    transition: 'all .55s cubic-bezier(.16,1,.3,1)',
  };

  const brand: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 'clamp(15px, 1.6vw, 18px)',
    fontWeight: 700,
    color: C.white,
    letterSpacing: '0.02em',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    textDecoration: 'none',
  };

  const linkRow: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'clamp(18px, 2.4vw, 36px)',
  };

  return (
    <>
      <nav style={bar} suppressHydrationWarning>
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
            <Heart size={18} color={C.accentLight} strokeWidth={2} />
            {fd?.businessName ?? "KinéPédiatrie Bordeaux"}
          </>
        )}
      </a>
      <div style={linkRow} className="kp-navlinks">
        {links.map((l) => (
          <NavLink key={l.label} label={l.label} href={l.href} />
        ))}
      </div>
      <div className="kp-navcta">
        <a
          href="#rdv"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '11px 22px',
            background: C.accent,
            color: C.white,
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 13,
            borderRadius: 4,
            textDecoration: 'none',
            letterSpacing: '0.06em',
            transition: 'background .3s',
          }}
        >
          Prendre RDV <ArrowRight size={14} />
        </a>
      </div>
      
        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="kp-burger"
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
          .kp-navlinks { display: none !important; }
          .kp-burger { display: flex !important; flex-direction: column; }
          .kp-navcta { display: none !important; }
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

/* ════════════════════════════════════════════════════════════════════════════
   2 · HERO — 100vh, parallaxe
   ════════════════════════════════════════════════════════════════════════════ */
function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '14%']);
  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '-44%']);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <section
      ref={ref}
      id="hero"
      style={{
        position: 'relative',
        height: '100dvh',
        minHeight: 640,
        overflow: 'hidden',
        background: C.bgDark,
      }}
    >
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
          src={fd?.photoUrls?.[0] || P.hero}
          alt="Kinésithérapeute pédiatrique avec un enfant à Bordeaux"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </motion.div>

      {/* Voile dégradé */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(8,20,40,0.55) 0%, rgba(8,20,40,0.10) 35%, rgba(8,20,40,0.45) 68%, rgba(8,20,40,0.90) 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(130% 80% at 50% 30%, transparent 40%, rgba(4,12,24,0.50) 100%)',
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
          <Eyebrow light centered>
            Kinésithérapie Pédiatrique · Bordeaux
          </Eyebrow>
        </Reveal>

        <motion.h1
          initial={{ opacity: 0, y: 44 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.16 }}
          style={{
            fontFamily: SERIF,
            fontWeight: 300,
            fontStyle: 'italic',
            color: C.white,
            fontSize: 'clamp(3rem,6.5vw,7.5rem)',
            lineHeight: 0.97,
            letterSpacing: '-0.01em',
            margin: '28px 0 24px',
            textShadow: '0 10px 60px rgba(0,0,0,0.55)',
          }}
        >
          Kiné{' '}
          <span style={{ fontStyle: 'normal', color: C.accentLight }}>
            /
          </span>{' '}
          pour les tout-petits.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.42 }}
          style={{
            fontFamily: SANS,
            fontWeight: 300,
            fontSize: 'clamp(16px, 1.9vw, 21px)',
            color: 'rgba(255,255,255,0.82)',
            maxWidth: 560,
            lineHeight: 1.65,
            letterSpacing: '0.01em',
          }}
        >
          Rééducation respiratoire, motrice et post-opératoire pour les
          nourrissons, enfants et adolescents — au cœur de Bordeaux Mériadeck.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.68 }}
          style={{ marginTop: 40 }}
        >
          <BlueButton filled>Prendre rendez-vous</BlueButton>
        </motion.div>
      </motion.div>

      {/* Indicateur de défilement */}
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
            letterSpacing: '0.30em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.65)',
          }}
        >
          Découvrir
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={20} color={C.accentLight} strokeWidth={1.5} />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   3 · INTRO
   ════════════════════════════════════════════════════════════════════════════ */
function Intro() {
  return (
    <section id="contact"
      style={{
        background: C.bgAlt,
        padding: 'clamp(90px,13vw,180px) clamp(24px,8vw,160px)',
        textAlign: 'center',
      }}
    >
      <Reveal>
        <p
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: 'clamp(22px,3.2vw,44px)',
            lineHeight: 1.38,
            color: C.ink,
            maxWidth: 900,
            margin: '0 auto',
          }}
        >
          Chaque enfant a son propre calendrier. Notre rôle est de
          l&apos;accompagner,{' '}
          <span style={{ color: C.accent, fontStyle: 'normal', fontWeight: 400 }}>
            pas de le presser.
          </span>
        </p>
      </Reveal>
      <Reveal delay={0.18}>
        <div
          style={{
            width: 1,
            height: 80,
            background: `linear-gradient(${C.accent}, transparent)`,
            margin: '52px auto 0',
            opacity: 0.5,
          }}
        />
      </Reveal>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   4 · SPECIALTY SEQUENCE — sticky crossfade 320vh
   ════════════════════════════════════════════════════════════════════════════ */
function SpecialtyImage({
  phase,
  i,
  total,
  progress,
}: {
  phase: Specialty;
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
    [0.3, 1, 1, 0.3],
  );
  const width = useTransform(progress, [i * seg, (i + 1) * seg], [10, 34]);
  return (
    <motion.div
      style={{ height: 2, width, background: C.accentLight, opacity, borderRadius: 2 }}
    />
  );
}

function SpecialtyCaption({
  phase,
  i,
  total,
  progress,
}: {
  phase: Specialty;
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
      {/* Label top-right */}
      <div
        style={{
          position: 'absolute',
          top: 'clamp(100px,13vw,160px)',
          right: 'clamp(24px,5vw,64px)',
          textAlign: 'right',
        }}
      >
        <span
          style={{
            fontFamily: SANS,
            fontSize: 10,
            letterSpacing: '0.40em',
            textTransform: 'uppercase',
            color: C.accentLight,
            display: 'block',
            marginBottom: 6,
          }}
        >
          {phase.index}
        </span>
        <span
          style={{
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 'clamp(11px,1.2vw,13px)',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.80)',
          }}
        >
          {phase.label}
        </span>
      </div>

      <span
        style={{
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontSize: 'clamp(36px,8vw,110px)',
          color: 'rgba(40,120,192,0.25)',
          lineHeight: 1,
          marginBottom: 8,
        }}
      >
        {phase.index}
      </span>
      <h2
        style={{
          fontFamily: SERIF,
          fontSize: 'clamp(34px,6vw,88px)',
          fontWeight: 300,
          fontStyle: 'italic',
          color: C.white,
          lineHeight: 1.05,
          margin: 0,
          textShadow: '0 8px 40px rgba(0,0,0,0.6)',
          maxWidth: 800,
        }}
      >
        {phase.label}
      </h2>
      <p
        style={{
          fontFamily: SANS,
          fontWeight: 300,
          fontSize: 'clamp(15px,1.7vw,20px)',
          color: 'rgba(255,255,255,0.80)',
          marginTop: 20,
          maxWidth: 520,
          lineHeight: 1.7,
        }}
      >
        {phase.description}
      </p>
    </motion.div>
  );
}

function SpecialtySequence() {
  const n = PHASES.length;
  const progress = useMotionValue(0.5 / n);
  const [active, setActive] = useState(0);
  const goTo = (i: number) => {
    setActive(i);
    progress.set((i + 0.5) / n);
  };

  return (
    <section
      style={{ height: '100dvh', overflow: 'hidden', position: 'relative', background: C.bgDark }}
      id="soins"
    >
      <div
        style={{
          position: 'relative',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {PHASES.map((p, i) => (
          <SpecialtyImage
            key={p.index}
            phase={p}
            i={i}
            total={PHASES.length}
            progress={progress}
          />
        ))}
        {/* Voile lisibilité */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to bottom, rgba(8,20,40,0.38), rgba(8,20,40,0.10) 40%, rgba(8,20,40,0.60))',
          }}
        />
        {PHASES.map((p, i) => (
          <SpecialtyCaption
            key={p.index}
            phase={p}
            i={i}
            total={PHASES.length}
            progress={progress}
          />
        ))}
        {/* Points de progression */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 12,
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

/* ════════════════════════════════════════════════════════════════════════════
   5 · CARE CARDS — 6 cartes avec bordure bleue gauche et hover lift
   ════════════════════════════════════════════════════════════════════════════ */
function CareCardItem({ care, i }: { care: Care; i: number }) {
  const [hover, setHover] = useState(false);
  return (
    <Reveal delay={i * 0.08} style={{ height: '100%' }}>
      <article
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          background: C.bgCard,
          border: `1px solid ${hover ? C.accentLight : C.border}`,
          borderLeft: `4px solid ${hover ? C.accentDark : C.accent}`,
          padding: 'clamp(24px,3vw,36px)',
          height: '100%',
          boxSizing: 'border-box',
          transform: hover ? 'translateY(-8px)' : 'none',
          boxShadow: hover
            ? '0 32px 64px -30px rgba(40,120,192,0.30)'
            : '0 4px 24px -16px rgba(8,20,40,0.12)',
          transition: 'all .55s cubic-bezier(.16,1,.3,1)',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}
      >
        <span style={{ fontSize: 28 }} role="img" aria-hidden="true">
          {care.icon}
        </span>
        <h3
          style={{
            fontFamily: SERIF,
            fontSize: 'clamp(17px,1.8vw,21px)',
            fontWeight: 400,
            color: C.ink,
            margin: 0,
            lineHeight: 1.3,
          }}
        >
          {care.title}
        </h3>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontFamily: SANS,
            fontSize: 12,
            fontWeight: 700,
            color: hover ? C.accentDark : C.accent,
            letterSpacing: '0.08em',
            marginTop: 'auto',
            transition: 'color .35s',
          }}
        >
          En savoir plus
          <ArrowRight
            size={13}
            style={{
              transform: hover ? 'translateX(4px)' : 'none',
              transition: 'transform .45s cubic-bezier(.16,1,.3,1)',
            }}
          />
        </div>
      </article>
    </Reveal>
  );
}

function CareCards() {
  return (
    <section
      style={{
        background: C.bg,
        padding: 'clamp(90px,12vw,160px) clamp(24px,6vw,96px)',
      }}
    >
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        <Reveal>
          <Eyebrow>Domaines de prise en charge</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontWeight: 300,
              fontStyle: 'italic',
              fontSize: 'clamp(32px,5vw,64px)',
              color: C.ink,
              margin: '18px 0 52px',
              lineHeight: 1.1,
            }}
          >
            Six domaines,{' '}
            <span style={{ color: C.accent, fontStyle: 'normal', fontWeight: 400 }}>
              une seule priorité.
            </span>
          </h2>
        </Reveal>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
            gap: 'clamp(20px,2.5vw,32px)',
          }}
        >
          {CARE_CARDS.map((c, i) => (
            <CareCardItem key={c.title} care={c} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   6 · EDITORIAL ROWS — 2 lignes alternées avec numéros fantômes
   ════════════════════════════════════════════════════════════════════════════ */
function EditRow({ row }: { row: EditRow }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'clamp(36px,6vw,96px)',
        alignItems: 'center',
        position: 'relative',
      }}
      className="kp-editrow"
    >
      {/* Numéro fantôme */}
      <div
        style={{
          position: 'absolute',
          top: '-0.2em',
          left: row.reverse ? 'auto' : '-0.05em',
          right: row.reverse ? '-0.05em' : 'auto',
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontSize: 'clamp(80px,12vw,160px)',
          color: C.ink,
          opacity: 0.06,
          lineHeight: 1,
          pointerEvents: 'none',
          userSelect: 'none',
          zIndex: 0,
        }}
      >
        {row.num}
      </div>

      <Reveal
        y={50}
        style={{
          overflow: 'hidden',
          order: row.reverse ? 2 : 1,
          aspectRatio: '4 / 5',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <ParallaxImg src={row.img} alt={row.alt} />
      </Reveal>

      <div
        style={{
          order: row.reverse ? 1 : 2,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Reveal>
          <Eyebrow>{row.eyebrow}</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h3
            style={{
              fontFamily: SERIF,
              fontWeight: 300,
              fontStyle: 'italic',
              fontSize: 'clamp(30px,4vw,56px)',
              color: C.ink,
              margin: '18px 0 26px',
              lineHeight: 1.1,
            }}
          >
            {row.titleLine1}{' '}
            <span style={{ color: C.accent, fontStyle: 'normal', fontWeight: 400 }}>
              /
            </span>{' '}
            {row.titleLine2}
          </h3>
        </Reveal>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {row.bullets.map((b, bi) => (
            <Reveal key={bi} delay={0.12 + bi * 0.07}>
              <div
                style={{
                  display: 'flex',
                  gap: 14,
                  alignItems: 'flex-start',
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    background: C.accent,
                    borderRadius: '50%',
                    flexShrink: 0,
                    marginTop: 8,
                  }}
                />
                <p
                  style={{
                    fontFamily: SANS,
                    fontSize: 'clamp(15px,1.6vw,18px)',
                    lineHeight: 1.7,
                    color: C.textMuted,
                    margin: 0,
                    fontWeight: 300,
                  }}
                >
                  {b}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}

function EditorialRows() {
  return (
    <section
      style={{
        background: C.bg,
        padding: 'clamp(80px,11vw,150px) clamp(24px,6vw,96px)',
      }}
      id="approche"
    >
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(90px,13vw,160px)',
        }}
      >
        {EDIT_ROWS.map((r) => (
          <EditRow key={r.eyebrow} row={r} />
        ))}
      </div>
      <style>{`
        @media (max-width: 860px) {
          .kp-editrow { grid-template-columns: 1fr !important; }
          .kp-editrow > * { order: initial !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   7 · METHOD PANEL — image sticky à gauche, 4 étapes à droite
   ════════════════════════════════════════════════════════════════════════════ */
function MethodPanel() {
  return (
    <section
      style={{
        background: C.bgDark,
        padding: 'clamp(90px,12vw,160px) clamp(24px,6vw,96px)',
      }}
      id="methode"
    >
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '0.85fr 1.15fr',
          gap: 'clamp(44px,6vw,100px)',
          alignItems: 'start',
        }}
        className="kp-methpanel"
      >
        {/* Image sticky */}
        <div
          style={{
            position: 'sticky',
            top: 100,
            alignSelf: 'start',
          }}
          className="kp-methpanel-sticky"
        >
          <Reveal>
            <div
              style={{
                overflow: 'hidden',
                border: `1px solid ${C.borderDark}`,
                aspectRatio: '4 / 5',
              }}
            >
              <img
                src={fd?.photoUrls?.[1] || P.method}
                alt="Séance de kinésithérapie pédiatrique à Bordeaux"
                loading="lazy"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </div>
            <div
              style={{
                marginTop: 24,
                padding: '20px 22px',
                background: 'rgba(40,120,192,0.08)',
                border: `1px solid ${C.borderDark}`,
              }}
            >
              <div
                style={{
                  fontFamily: SANS,
                  fontSize: 10.5,
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase',
                  color: C.accentLight,
                  marginBottom: 8,
                }}
              >
                Notre protocole
              </div>
              <div
                style={{
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  fontSize: 16,
                  color: 'rgba(255,255,255,0.75)',
                  lineHeight: 1.6,
                }}
              >
                &ldquo;Chaque prise en charge est unique, structurée, et
                co-construite avec la famille.&rdquo;
              </div>
            </div>
          </Reveal>
        </div>

        {/* Étapes */}
        <div>
          <Reveal>
            <Eyebrow light>Méthode</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2
              style={{
                fontFamily: SERIF,
                fontWeight: 300,
                fontStyle: 'italic',
                fontSize: 'clamp(30px,4.5vw,60px)',
                color: C.white,
                margin: '18px 0 52px',
                lineHeight: 1.1,
              }}
            >
              Quatre étapes,{' '}
              <span style={{ color: C.accentLight, fontStyle: 'normal' }}>
                un engagement.
              </span>
            </h2>
          </Reveal>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {METHOD_ITEMS.map((item, i) => (
              <Reveal key={item.num} delay={0.06 * i}>
                <div
                  style={{
                    padding: 'clamp(28px,3.5vw,44px) 0',
                    borderTop: `1px solid rgba(40,120,192,0.25)`,
                    display: 'flex',
                    gap: 28,
                    alignItems: 'baseline',
                  }}
                >
                  <span
                    style={{
                      fontFamily: SERIF,
                      fontStyle: 'italic',
                      fontSize: 'clamp(22px,2.5vw,32px)',
                      color: C.peach,
                      minWidth: 52,
                      flexShrink: 0,
                      opacity: 0.85,
                    }}
                  >
                    {item.num}
                  </span>
                  <div>
                    <h4
                      style={{
                        fontFamily: SERIF,
                        fontSize: 'clamp(19px,2.2vw,26px)',
                        fontWeight: 400,
                        color: C.white,
                        margin: '0 0 10px',
                        lineHeight: 1.2,
                      }}
                    >
                      {item.title}
                    </h4>
                    <p
                      style={{
                        fontFamily: SANS,
                        fontSize: 'clamp(14px,1.5vw,17px)',
                        lineHeight: 1.72,
                        color: 'rgba(255,255,255,0.65)',
                        margin: 0,
                        fontWeight: 300,
                      }}
                    >
                      {item.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.32}>
            <div style={{ marginTop: 48 }}>
              <BlueButton filled>Prendre rendez-vous</BlueButton>
            </div>
          </Reveal>
        </div>
      </div>
      <style>{`
        @media (max-width: 860px) {
          .kp-methpanel { grid-template-columns: 1fr !important; }
          .kp-methpanel-sticky { position: static !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   8 · TESTIMONIALS
   ════════════════════════════════════════════════════════════════════════════ */
function Testimonials() {
  return (
    <section
      style={{
        background: C.bgAlt,
        padding: 'clamp(90px,12vw,170px) clamp(24px,6vw,96px)',
      }}
      id="temoignages"
    >
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <Reveal>
            <Eyebrow centered>Témoignages de familles</Eyebrow>
          </Reveal>
          <Reveal delay={0.1}>
            <h2
              style={{
                fontFamily: SERIF,
                fontWeight: 300,
                fontStyle: 'italic',
                fontSize: 'clamp(30px,4.8vw,62px)',
                color: C.ink,
                margin: '18px 0 0',
                lineHeight: 1.1,
              }}
            >
              Ils nous font{' '}
              <span style={{ color: C.accent, fontStyle: 'normal', fontWeight: 400 }}>
                confiance.
              </span>
            </h2>
          </Reveal>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))',
            gap: 'clamp(28px,3.5vw,52px)',
          }}
        >
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.author} delay={i * 0.14} style={{ height: '100%' }}>
              <figure
                style={{
                  background: C.bgCard,
                  border: `1px solid ${C.border}`,
                  padding: 'clamp(32px,4vw,50px)',
                  margin: 0,
                  height: '100%',
                  boxSizing: 'border-box',
                  boxShadow: '0 20px 60px -40px rgba(8,20,40,0.22)',
                  display: 'flex',
                  flexDirection: 'column',
                  borderTop: `4px solid ${C.accent}`,
                }}
              >
                <Heart
                  size={28}
                  color={C.accent}
                  strokeWidth={1.5}
                  fill="rgba(40,120,192,0.10)"
                />
                <blockquote
                  style={{
                    fontFamily: SERIF,
                    fontStyle: 'italic',
                    fontSize: 'clamp(17px,1.9vw,22px)',
                    lineHeight: 1.65,
                    color: C.ink,
                    margin: '22px 0 28px',
                    flex: 1,
                  }}
                >
                  <Quote
                    size={18}
                    color={C.accentLight}
                    style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }}
                    strokeWidth={1.5}
                  />
                  {t.quote}
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
                      color: C.accent,
                      fontWeight: 400,
                    }}
                  >
                    {t.author}
                  </div>
                  <div
                    style={{
                      fontFamily: SANS,
                      fontSize: 12,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: C.textFaint,
                      marginTop: 5,
                      fontWeight: 300,
                    }}
                  >
                    {t.context}
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   9 · APPOINTMENT FORM
   ════════════════════════════════════════════════════════════════════════════ */
function AppointmentForm() {
  const [prenom, setPrenom] = useState('');
  const [age, setAge] = useState('');
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

  const fieldBase: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    background: 'transparent',
    border: 'none',
    borderBottom: `1px solid rgba(40,120,192,0.35)`,
    padding: '15px 2px',
    fontFamily: SANS,
    fontSize: 16,
    fontWeight: 300,
    color: C.white,
    outline: 'none',
    transition: 'border-color .3s',
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 10.5,
    letterSpacing: '0.26em',
    textTransform: 'uppercase',
    color: C.accentLight,
    fontWeight: 600,
    display: 'block',
    marginBottom: 4,
  };

  const motifs = [
    'Kinésithérapie respiratoire',
    'Retard moteur',
    'Rééducation post-op',
    'Torticolis',
    'Plagiocéphalie',
    'Autre',
  ];

  return (
    <section
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: C.bgDark,
        padding: 'clamp(90px,13vw,180px) clamp(24px,6vw,96px)',
      }}
      id="rdv"
    >
      {/* Fond décoratif */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 80% 70% at 50% 30%, rgba(40,120,192,0.06) 0%, transparent 70%)',
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
          <Eyebrow light centered>
            Demande de rendez-vous
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontWeight: 300,
              fontStyle: 'italic',
              fontSize: 'clamp(32px,5.5vw,72px)',
              color: C.white,
              margin: '20px 0 16px',
              lineHeight: 1.08,
            }}
          >
            Parlons-nous de votre enfant.
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <p
            style={{
              fontFamily: SANS,
              fontWeight: 300,
              fontSize: 'clamp(15px,1.7vw,18px)',
              lineHeight: 1.7,
              color: 'rgba(255,255,255,0.70)',
              maxWidth: 520,
              margin: '0 auto 52px',
            }}
          >
            Nous vous recontacterons sous 24h pour confirmer un créneau adapté
            à votre enfant et à votre agenda.
          </p>
        </Reveal>

        {sent ? (
          <Reveal>
            <div
              style={{
                border: `1px solid rgba(40,120,192,0.40)`,
                padding: 'clamp(36px,5vw,56px)',
                background: 'rgba(40,120,192,0.06)',
              }}
            >
              <Heart size={36} color={C.accentLight} strokeWidth={1.5} fill="rgba(40,120,192,0.15)" />
              <h3
                style={{
                  fontFamily: SERIF,
                  fontWeight: 400,
                  fontSize: 'clamp(24px,3vw,36px)',
                  color: C.white,
                  margin: '20px 0 14px',
                }}
              >
                Merci, nous vous confirmons le RDV de{' '}
                <span style={{ color: C.accentLight }}>{prenom}</span> sous 24h.
              </h3>
              <p
                style={{
                  fontFamily: SANS,
                  fontWeight: 300,
                  fontSize: 16,
                  color: 'rgba(255,255,255,0.70)',
                  margin: 0,
                }}
              >
                Un email de confirmation vous sera envoyé à{' '}
                <strong style={{ color: C.accentLight, fontWeight: 600 }}>
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
              style={{ display: 'flex', flexDirection: 'column', gap: 34, textAlign: 'left' }}
              noValidate
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 28,
                }}
                className="kp-form2col"
              >
                <div>
                  <label style={labelStyle} htmlFor="kp-prenom">
                    Prénom du patient
                  </label>
                  <input
                    id="kp-prenom"
                    style={fieldBase}
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    placeholder="Léa"
                    autoComplete="given-name"
                    required
                    suppressHydrationWarning
                  />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="kp-age">
                    Âge
                  </label>
                  <input
                    id="kp-age"
                    style={fieldBase}
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="3 ans"
                    suppressHydrationWarning
                  />
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 28,
                }}
                className="kp-form2col"
              >
                <div>
                  <label style={labelStyle} htmlFor="kp-email">
                    Adresse e-mail
                  </label>
                  <input
                    id="kp-email"
                    style={fieldBase}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="parent@exemple.fr"
                    autoComplete="email"
                    required
                    suppressHydrationWarning
                  />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="kp-tel">
                    Téléphone
                  </label>
                  <input
                    id="kp-tel"
                    style={fieldBase}
                    type="tel"
                    value={tel}
                    onChange={(e) => setTel(e.target.value)}
                    placeholder="06 00 00 00 00"
                    autoComplete="tel"
                    suppressHydrationWarning
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle} htmlFor="kp-motif">
                  Motif de consultation
                </label>
                <select
                  id="kp-motif"
                  style={{
                    ...fieldBase,
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    cursor: 'pointer',
                    color: motif ? C.white : 'rgba(255,255,255,0.40)',
                  }}
                  value={motif}
                  onChange={(e) => setMotif(e.target.value)}
                  required
                  suppressHydrationWarning
                >
                  <option value="" style={{ color: '#000', background: '#fff' }}>
                    Choisir un motif…
                  </option>
                  {motifs.map((m) => (
                    <option key={m} value={m} style={{ color: '#000', background: '#fff' }}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle} htmlFor="kp-message">
                  Message (optionnel)
                </label>
                <textarea
                  id="kp-message"
                  style={{
                    ...fieldBase,
                    resize: 'vertical',
                    minHeight: 100,
                    borderBottom: 'none',
                    border: `1px solid rgba(40,120,192,0.35)`,
                    padding: '14px 12px',
                  }}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Décrivez brièvement la situation de votre enfant…"
                  rows={4}
                  suppressHydrationWarning
                />
              </div>

              <div style={{ textAlign: 'center', marginTop: 8 }}>
                <BlueButton filled type="submit">
                  Envoyer ma demande de RDV
                </BlueButton>
              </div>
            </form>
          </Reveal>
        )}
      </div>
      <style>{`
        @media (max-width: 600px) {
          .kp-form2col { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   10 · FOOTER — 4 colonnes
   ════════════════════════════════════════════════════════════════════════════ */
function Footer() {
  const cols: { title: string; items: { label: string; href: string }[] }[] = [
    {
      title: 'Soins',
      items: [
        { label: 'Kinésithérapie respiratoire', href: '#soins' },
        { label: 'Développement moteur', href: '#soins' },
        { label: 'Rééducation post-op', href: '#soins' },
        { label: 'Plagiocéphalie & torticolis', href: '#soins' },
      ],
    },
    {
      title: 'Cabinet',
      items: [
        { label: 'Notre approche', href: '#approche' },
        { label: 'Méthode', href: '#methode' },
        { label: 'Témoignages', href: '#temoignages' },
        { label: 'Accès & parking', href: '#approche' },
      ],
    },
    {
      title: 'Informations',
      items: [
        { label: 'Prendre RDV', href: '#rdv' },
        { label: 'Tarifs & remboursements', href: '#rdv' },
        { label: 'Ordonnance nécessaire ?', href: '#rdv' },
        { label: 'Contact', href: '#rdv' },
      ],
    },
  ];

  return (
    <footer
      style={{
        background: C.bgDarkAlt,
        borderTop: `1px solid rgba(40,120,192,0.15)`,
        padding: 'clamp(64px,9vw,110px) clamp(24px,6vw,96px) 40px',
      }}
    >
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.5fr repeat(3, 1fr)',
          gap: 'clamp(36px,5vw,64px)',
        }}
        className="kp-footgrid"
      >
        {/* Brand col */}
        <div>
          <div
            style={{
              fontFamily: SANS,
              fontSize: 'clamp(15px,1.5vw,18px)',
              fontWeight: 700,
              color: C.white,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 18,
            }}
          >
            <Heart size={18} color={C.accentLight} strokeWidth={2} />
            KinéPédiatrie Bordeaux
          </div>
          <p
            style={{
              fontFamily: SANS,
              fontWeight: 300,
              fontSize: 14,
              lineHeight: 1.75,
              color: 'rgba(255,255,255,0.55)',
              maxWidth: 300,
              marginBottom: 22,
            }}
          >
            Kinésithérapie pédiatrique et respiratoire à Bordeaux Mériadeck.
            Une prise en charge adaptée à chaque enfant, du nourrisson à
            l&apos;adolescent.
          </p>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontFamily: SANS,
              fontSize: 12,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.45)',
            }}
          >
            <MapPin size={13} color={C.accentLight} strokeWidth={1.5} />
            Bordeaux · Mériadeck
          </div>
        </div>

        {/* Nav cols */}
        {cols.map((c) => (
          <div key={c.title}>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 11,
                letterSpacing: '0.26em',
                textTransform: 'uppercase',
                color: C.accent,
                fontWeight: 700,
                marginBottom: 22,
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
                      fontSize: 14,
                      color: 'rgba(255,255,255,0.60)',
                      textDecoration: 'none',
                      transition: 'color .3s',
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLAnchorElement).style.color = C.accentLight)
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLAnchorElement).style.color =
                        'rgba(255,255,255,0.60)')
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

      <div
        style={{
          maxWidth: 1240,
          margin: '56px auto 0',
          paddingTop: 24,
          borderTop: `1px solid rgba(40,120,192,0.12)`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 14,
          fontFamily: SANS,
          fontSize: 12,
          letterSpacing: '0.08em',
          color: 'rgba(255,255,255,0.35)',
          fontWeight: 300,
        }}
      >
        <span>© 2026 KinéPédiatrie Bordeaux. Tous droits réservés.</span>
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
          .kp-footgrid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 520px) {
          .kp-footgrid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   PAGE — composition finale
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
    C = { ...C, accent: brand, accentLight: shadeColor(brand, 25), accentDark: shadeColor(brand, -20) };
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
      <style>{`
        @import url('${FONTS_HREF}');
        *, *::before, *::after { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { margin: 0; padding: 0; }
        input::placeholder, textarea::placeholder, select option:first-child {
          color: rgba(255,255,255,0.35);
        }
        input:focus, textarea:focus, select:focus {
          border-bottom-color: rgba(40,120,192,0.75) !important;
        }
        @media (max-width: 860px) {
          .kp-navlinks { display: none !important; }
          .kp-navcta { display: none !important; }
          .kp-editrow { grid-template-columns: 1fr !important; }
          .kp-editrow > * { order: initial !important; }
          .kp-methpanel { grid-template-columns: 1fr !important; }
          .kp-methpanel-sticky { position: static !important; }
          .kp-footgrid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 520px) {
          .kp-footgrid { grid-template-columns: 1fr !important; }
          .kp-form2col { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <main
        style={{
          background: C.bgDark,
          color: C.ink,
          fontFamily: SANS,
          overflowX: 'hidden',
          WebkitFontSmoothing: 'antialiased',
        }}
        suppressHydrationWarning
      >
        <Nav />
        <Hero />
        <Intro />
        <SpecialtySequence />
        <CareCards />
        <EditorialRows />
        <MethodPanel />
        <Testimonials />
        <AppointmentForm />
        <Footer />
      </main>
    </>
  );
}
