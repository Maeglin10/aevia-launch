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
import { ArrowRight, ChevronDown, TrendingUp } from 'lucide-react';

/* ════════════════════════════════════════════════════════════════════════════
   AXIOM CONSEIL — Expert-Comptable & Conseil en Gestion · Bordeaux
   Photographie réelle + chorégraphie de défilement éditoriale.
   Auto-suffisant. 'use client'.
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
  bg: '#f8f6f2',
  bgAlt: '#eeebe4',
  bgDark: '#0c100e',
  bgDarkAlt: '#060a08',
  bgCard: '#ffffff',
  accent: '#1a5c38',
  accentDark: '#134828',
  accentLight: '#c8e0d0',
  white: '#ffffff',
  ink: '#0c100e',
  textMuted: '#2c3c30',
  textFaint: '#7a8a80',
  border: '#c8d8cc',
  borderDark: 'rgba(26,92,56,0.2)',
  gold: '#b89040',
};

const SERIF = "'DM Serif Display', Georgia, serif" as const;
const SANS = "'Outfit', system-ui, sans-serif" as const;

/* ── Interfaces ──────────────────────────────────────────────────────────── */
interface Domain {
  id: string;
  index: string;
  title: string;
  sub: string;
  imgId: string;
}

interface Service {
  label: string;
  desc: string;
}

interface EditRow {
  eyebrow: string;
  imgId: string;
  imgW?: string;
  reverse: boolean;
  title: React.ReactNode;
  body: string;
}

interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

interface PillarItem {
  num: string;
  title: string;
  body: string;
}

/* ── Photo helper ────────────────────────────────────────────────────────── */
const photo = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?q=80&w=${w}&auto=format&fit=crop`;

/* ── Data ─────────────────────────────────────────────────────────────────── */
const DOMAINS: Domain[] = [
  {
    id: 'compta',
    index: 'I',
    title: 'COMPTABILITÉ & PAIE',
    sub: 'Tenue comptable, déclarations fiscales, bulletin de paie — vos obligations assurées avec précision et ponctualité.',
    imgId: '1554224155-6726b3ff858f',
  },
  {
    id: 'gestion',
    index: 'II',
    title: 'CONSEIL EN GESTION',
    sub: 'Tableaux de bord, prévisionnel, optimisation de la rentabilité — votre allié pour prendre les bonnes décisions.',
    imgId: '1507679799987-c73779587ccf',
  },
  {
    id: 'creation',
    index: 'III',
    title: 'CRÉATION & TRANSMISSION',
    sub: "Choix du statut juridique, pacte d'actionnaires, cession d'entreprise — structurer pour réussir dès le départ.",
    imgId: '1551135049-8a33b5883817',
  },
];

const SERVICES: Service[] = [
  {
    label: 'Tenue comptable',
    desc: 'Saisie, révision et clôture des comptes dans les délais impartis.',
  },
  {
    label: 'Fiscalité & optimisation',
    desc: 'IS, TVA, liasses fiscales, optimisation de la charge fiscale.',
  },
  {
    label: 'Bulletins de paie',
    desc: 'Gestion complète de la paie, DSN et relations sociales.',
  },
  {
    label: "Création d'entreprise",
    desc: 'Choix de structure, statuts, formalités, plan de financement.',
  },
  {
    label: 'Tableau de bord & KPIs',
    desc: 'Indicateurs sur mesure pour piloter votre activité en temps réel.',
  },
  {
    label: 'Transmission & cession',
    desc: 'Valorisation, audit, négociation et accompagnement à la cession.',
  },
];

const EDIT_ROWS: EditRow[] = [
  {
    eyebrow: 'Notre différence',
    imgId: '1554224155-6726b3ff858f',
    imgW: '800',
    reverse: false,
    title: (
      <>
        Votre chiffre{' '}
        <span style={{ fontStyle: 'italic' }}>d&apos;affaires,</span>
        <br />
        notre obsession.
      </>
    ),
    body: "Là où d'autres cabinets vous voient une fois par an, nous vous rencontrons chaque mois. Accès 24h/24 à votre tableau de bord Pennylane. Nous vous alertons avant les problèmes, pas après.",
  },
  {
    eyebrow: 'Le cabinet',
    imgId: '1507679799987-c73779587ccf',
    imgW: '800',
    reverse: true,
    title: (
      <>
        Bordeaux
        <br />
        <span style={{ fontStyle: 'italic' }}>depuis 2015.</span>
      </>
    ),
    body: "Installé dans le quartier des Chartrons, Axiom Conseil réunit 8 collaborateurs experts. Nous accompagnons 180 clients — de la startup en amorçage à l'ETI à 20 M€ de CA. Membres de l'OEC Bordeaux.",
  },
];

const PILLARS: PillarItem[] = [
  {
    num: 'I',
    title: 'Réactivité',
    body: 'Réponse sous 24h garantie. Un interlocuteur unique dédié à votre dossier, toujours joignable.',
  },
  {
    num: 'II',
    title: 'Digitalisation',
    body: 'Pennylane, Dext, Payfit — outils de référence pour un flux zéro papier et une donnée fiable.',
  },
  {
    num: 'III',
    title: 'Conseil proactif',
    body: 'Nous analysons vos chiffres avant la clôture. Vous êtes prévenus, pas surpris.',
  },
  {
    num: 'IV',
    title: 'Tarification fixe',
    body: 'Honoraires forfaitaires clairs dès le départ. Pas de facturation à la surprise.',
  },
];

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "J'ai lancé mon e-commerce à zéro et franchi les 2 M€ en deux ans. Axiom a structuré la comptabilité, la paie et la fiscalité dès le premier jour. Je n'aurais pas grandi aussi vite sans eux.",
    name: 'Camille Leroy',
    role: 'Fondatrice · e-commerce mode, Bordeaux',
  },
  {
    quote:
      "La cession de mes trois adresses de restauration était un dossier complexe. L'équipe d'Axiom a négocié des conditions excellentes et sécurisé la transmission dans les délais. Un cabinet rare.",
    name: 'Thierry Monceau',
    role: 'Restaurateur · Groupe Monceau, Gironde',
  },
];

/* ── Easing partagé ──────────────────────────────────────────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ════════════════════════════════════════════════════════════════════════════
   Primitives
   ════════════════════════════════════════════════════════════════════════════ */

function Eyebrow({
  children,
  light = false,
  align = 'left',
}: {
  children: React.ReactNode;
  light?: boolean;
  align?: 'left' | 'center';
}) {
  const color = light ? C.accentLight : C.accent;
  const wrap: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    justifyContent: align === 'center' ? 'center' : 'flex-start',
  };
  const rule: React.CSSProperties = { width: 40, height: 1, background: color, opacity: 0.8 };
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

function GreenButton({
  children,
  onClick,
  type = 'button',
  ghost = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  ghost?: boolean;
}) {
  const [hover, setHover] = useState(false);
  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 11,
    padding: '14px 28px',
    fontFamily: SANS,
    fontSize: 12,
    letterSpacing: '0.20em',
    textTransform: 'uppercase',
    fontWeight: 600,
    cursor: 'pointer',
    border: `1.5px solid ${C.accent}`,
    background: ghost ? 'transparent' : hover ? C.accentDark : C.accent,
    color: ghost ? (hover ? C.accent : C.textMuted) : C.white,
    transition: 'all .45s cubic-bezier(.16,1,.3,1)',
    outline: 'none',
    transform: hover ? 'translateY(-2px)' : 'none',
    boxShadow: hover && !ghost ? '0 12px 40px -16px rgba(26,92,56,0.55)' : 'none',
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
        size={14}
        style={{
          transform: hover ? 'translateX(4px)' : 'none',
          transition: 'transform .45s cubic-bezier(.16,1,.3,1)',
        }}
      />
    </button>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   NAV
   ════════════════════════════════════════════════════════════════════════════ */
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
    { label: 'Expertises', href: '#expertises' },
    { label: 'Services', href: '#services' },
    { label: 'Cabinet', href: '#cabinet' },
    { label: 'Valeurs', href: '#valeurs' },
    { label: 'Contact', href: '#contact' },
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
      ? '14px clamp(20px,5vw,64px)'
      : '24px clamp(20px,5vw,64px)',
    background: solid ? 'rgba(12,16,14,0.96)' : 'transparent',
    backdropFilter: solid ? 'blur(16px) saturate(130%)' : 'none',
    WebkitBackdropFilter: solid ? 'blur(16px) saturate(130%)' : 'none',
    borderBottom: solid
      ? '1px solid rgba(26,92,56,0.3)'
      : '1px solid transparent',
    transition: 'all .55s cubic-bezier(.16,1,.3,1)',
  };
  const brand: React.CSSProperties = {
    fontFamily: SERIF,
    fontSize: 21,
    color: C.white,
    fontWeight: 400,
    letterSpacing: '0.01em',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    textDecoration: 'none',
  };
  const brandDot: React.CSSProperties = {
    width: 7,
    height: 7,
    borderRadius: '50%',
    background: C.accent,
    flexShrink: 0,
  };
  const linkRow: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'clamp(18px,2.2vw,36px)',
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
            <span style={brandDot} />{fd?.businessName ?? "Axiom Conseil"}
          </>
        )}</a>
      <div style={linkRow} className="ax-navlinks">
        {links.map((l) => (
          <AxNavLink key={l.label} label={l.label} href={l.href} />
        ))}
      </div>
      <div className="ax-navcta">
        <a href="#contact" style={{ textDecoration: 'none' }}>
          <GreenButton>Premiers échanges</GreenButton>
        </a>
      </div>
      
        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="ax-burger"
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
          .ax-navlinks { display: none !important; }
          .ax-burger { display: flex !important; flex-direction: column; }
          .ax-navcta { display: none !important; }
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

function AxNavLink({ label, href }: { label: string; href: string }) {
  const [h, setH] = useState(false);
  return (
    <a
      href={href}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        fontFamily: SANS,
        fontSize: 12,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        fontWeight: 500,
        color: h ? C.accentLight : 'rgba(255,255,255,0.82)',
        textDecoration: 'none',
        transition: 'color .35s',
        position: 'relative',
        paddingBottom: 3,
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
   HERO — parallaxe 100vh
   ════════════════════════════════════════════════════════════════════════════ */
function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);
  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '-42%']);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.72], [1, 0]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);

  const section: React.CSSProperties = {
    position: 'relative',
    height: '100dvh',
    minHeight: 620,
    overflow: 'hidden',
    background: C.bgDark,
  };

  return (
    <section ref={ref} style={section} id="hero">
      {/* Image parallaxe */}
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
          src={photo('1554224155-6726b3ff858f', 2000)}
          alt="Cabinet Axiom Conseil Bordeaux"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </motion.div>

      {/* Voiles */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(12,16,14,0.55) 0%, rgba(12,16,14,0.15) 40%, rgba(12,16,14,0.50) 70%, rgba(12,16,14,0.90) 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(110% 80% at 20% 60%, rgba(26,92,56,0.18) 0%, transparent 65%)',
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
          padding: '0 clamp(24px,6vw,96px) clamp(64px,9vw,110px)',
          y: titleY,
          opacity: titleOpacity,
        }}
      >
        <Reveal y={18}>
          <Eyebrow light>Expert-Comptable · Bordeaux</Eyebrow>
        </Reveal>

        <motion.h1
          initial={{ opacity: 0, y: 44 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.35, ease: EASE, delay: 0.12 }}
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontWeight: 400,
            color: C.white,
            fontSize: 'clamp(3rem,6.5vw,7.5rem)',
            lineHeight: 1.0,
            letterSpacing: '-0.01em',
            margin: '26px 0 20px',
            textShadow: '0 16px 64px rgba(0,0,0,0.5)',
            maxWidth: 900,
          }}
        >
          Votre croissance,
          <br />
          notre expertise.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.15, ease: EASE, delay: 0.4 }}
          style={{
            fontFamily: SANS,
            fontWeight: 300,
            fontSize: 'clamp(1rem,1.5vw,1.25rem)',
            color: 'rgba(255,255,255,0.82)',
            maxWidth: 520,
            lineHeight: 1.65,
            marginBottom: 38,
          }}
        >
          Cabinet d'expertise comptable et de conseil en gestion à Bordeaux.
          Nous transformons vos chiffres en leviers de croissance.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.64 }}
          style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}
        >
          <GreenButton>Premiers échanges</GreenButton>
          <GreenButton ghost>Nos expertises</GreenButton>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: 32,
          right: 'clamp(24px,5vw,64px)',
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
            fontSize: 10,
            letterSpacing: '0.30em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.55)',
            writingMode: 'vertical-rl',
          }}
        >
          Défiler
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={18} color={C.accentLight} strokeWidth={1.4} />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   INTRO — citation éditoriale
   ════════════════════════════════════════════════════════════════════════════ */
function Intro() {
  const sec: React.CSSProperties = {
    background: C.bgAlt,
    padding: 'clamp(80px,11vw,160px) clamp(24px,8vw,160px)',
    textAlign: 'center',
  };
  return (
    <section style={sec}>
      <Reveal>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
          <Eyebrow align="center">Notre philosophie</Eyebrow>
        </div>
      </Reveal>
      <Reveal delay={0.1}>
        <p
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 'clamp(1.5rem,3.2vw,3.2rem)',
            lineHeight: 1.35,
            fontWeight: 400,
            maxWidth: 980,
            margin: '0 auto',
            color: C.ink,
          }}
        >
          Les chiffres ne mentent pas. Mais seul un expert sait lire ce
          qu&apos;ils disent vraiment.
        </p>
      </Reveal>
      <Reveal delay={0.2}>
        <div
          style={{
            width: 1,
            height: 80,
            background: `linear-gradient(${C.accent}, transparent)`,
            margin: '52px auto 0',
          }}
        />
      </Reveal>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   DOMAIN SEQUENCE — sticky crossfade 320vh
   ════════════════════════════════════════════════════════════════════════════ */
function DomainImage({
  domain,
  i,
  total,
  progress,
}: {
  domain: Domain;
  i: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const seg = 1 / total;
  const start = i * seg;
  const end = start + seg;
  const fadeIn = seg * 0.26;

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
        src={photo(domain.imgId)}
        alt={domain.title}
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

function DomainCaption({
  domain,
  i,
  total,
  progress,
}: {
  domain: Domain;
  i: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const seg = 1 / total;
  const start = i * seg;
  const end = start + seg;
  const fade = seg * 0.20;

  const opacity = useTransform(
    progress,
    [start, start + fade, end - fade, end],
    i === 0 ? [1, 1, 1, 0] : [0, 1, 1, 0],
  );
  const y = useTransform(progress, [start, end], [28, -28]);

  return (
    <motion.div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: 'clamp(40px,6vw,80px)',
        opacity,
        y,
      }}
    >
      {/* Label top-right */}
      <div
        style={{
          position: 'absolute',
          top: 'clamp(80px,8vw,120px)',
          right: 'clamp(24px,5vw,64px)',
          fontFamily: SANS,
          fontSize: 11,
          letterSpacing: '0.30em',
          textTransform: 'uppercase',
          color: C.accentLight,
          fontWeight: 500,
        }}
      >
        {domain.index} · {domain.title}
      </div>

      <span
        style={{
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontSize: 'clamp(72px,12vw,160px)',
          color: 'rgba(200,224,208,0.12)',
          lineHeight: 1,
          marginBottom: 8,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        {domain.index}
      </span>
      <h2
        style={{
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 'clamp(1.5rem,3.5vw,4rem)',
          color: C.white,
          letterSpacing: '0.06em',
          margin: '0 0 16px',
          textShadow: '0 8px 40px rgba(0,0,0,0.6)',
        }}
      >
        {domain.title}
      </h2>
      <p
        style={{
          fontFamily: SANS,
          fontWeight: 300,
          fontSize: 'clamp(15px,1.4vw,19px)',
          color: 'rgba(255,255,255,0.80)',
          maxWidth: 520,
          lineHeight: 1.7,
          margin: 0,
        }}
      >
        {domain.sub}
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
  const width = useTransform(progress, [i * seg, (i + 1) * seg], [10, 32]);
  return (
    <motion.div
      style={{
        height: 2,
        width,
        background: C.accent,
        opacity,
        borderRadius: 2,
      }}
    />
  );
}

function DomainSequence() {
  const n = DOMAINS.length;
  const progress = useMotionValue(0.5 / n);
  const [active, setActive] = useState(0);
  const goTo = (i: number) => {
    setActive(i);
    progress.set((i + 0.5) / n);
  };

  return (
    <section
      style={{ height: '100dvh', overflow: 'hidden', position: 'relative', background: C.bgDark }}
      id="expertises"
    >
      <div
        style={{
          position: 'relative',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {DOMAINS.map((d, i) => (
          <DomainImage
            key={d.id}
            domain={d}
            i={i}
            total={DOMAINS.length}
            progress={progress}
          />
        ))}

        {/* Voile lisibilité */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to top, rgba(12,16,14,0.85) 0%, rgba(12,16,14,0.15) 50%, rgba(12,16,14,0.45) 100%)',
          }}
        />

        {DOMAINS.map((d, i) => (
          <DomainCaption
            key={d.id}
            domain={d}
            i={i}
            total={DOMAINS.length}
            progress={progress}
          />
        ))}

        {/* Dots de progression */}
        <div
          style={{
            position: 'absolute',
            bottom: 36,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 10,
          }}
        >
          {DOMAINS.map((d, i) => (
            <ProgressDot
              key={d.id}
              i={i}
              total={DOMAINS.length}
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
   SERVICE CARDS
   ════════════════════════════════════════════════════════════════════════════ */
function ServiceCard({ svc, i }: { svc: Service; i: number }) {
  const [hover, setHover] = useState(false);
  const card: React.CSSProperties = {
    background: hover ? C.bgCard : C.bgCard,
    border: `1px solid ${hover ? C.accent : C.border}`,
    borderLeft: `3px solid ${C.accent}`,
    padding: 'clamp(28px,3vw,40px)',
    transition: 'all .5s cubic-bezier(.16,1,.3,1)',
    transform: hover ? 'translateY(-6px)' : 'none',
    boxShadow: hover
      ? '0 28px 60px -28px rgba(26,92,56,0.22)'
      : '0 4px 20px -12px rgba(0,0,0,0.08)',
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
            fontSize: 'clamp(18px,1.8vw,24px)',
            fontWeight: 400,
            color: C.ink,
            margin: '0 0 12px',
          }}
        >
          {svc.label}
        </h3>
        <p
          style={{
            fontFamily: SANS,
            fontWeight: 300,
            fontSize: 'clamp(14px,1.1vw,16px)',
            lineHeight: 1.65,
            color: C.textMuted,
            margin: 0,
          }}
        >
          {svc.desc}
        </p>
      </article>
    </Reveal>
  );
}

function ServiceCards() {
  const sec: React.CSSProperties = {
    background: C.bg,
    padding: 'clamp(80px,11vw,160px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 'clamp(20px,2.4vw,32px)',
    maxWidth: 1280,
    margin: '0 auto',
  };
  return (
    <section style={sec} id="services">
      <div style={{ maxWidth: 1280, margin: '0 auto 52px' }}>
        <Reveal>
          <Eyebrow>Nos services</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(2rem,4.5vw,5rem)',
              fontWeight: 400,
              color: C.ink,
              margin: '18px 0 0',
              lineHeight: 1.06,
            }}
          >
            Ce que nous{' '}
            <span style={{ fontStyle: 'italic', color: C.accent }}>
              faisons pour vous
            </span>
          </h2>
        </Reveal>
      </div>
      <div style={grid}>
        {SERVICES.map((s, i) => (
          <ServiceCard key={s.label} svc={s} i={i} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   EDITORIAL ROWS — alternées
   ════════════════════════════════════════════════════════════════════════════ */
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
        style={{ width: '100%', height: '114%', objectFit: 'cover', y }}
      />
    </div>
  );
}

function EditorialRowItem({ row, num }: { row: EditRow; num: number }) {
  const imgStyle: React.CSSProperties = {
    overflow: 'hidden',
    aspectRatio: '4 / 5',
    order: row.reverse ? 2 : 1,
    position: 'relative',
  };
  const txtStyle: React.CSSProperties = {
    order: row.reverse ? 1 : 2,
    position: 'relative',
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'clamp(36px,6vw,96px)',
        alignItems: 'center',
      }}
      className="ax-editrow"
    >
      <Reveal y={48} style={imgStyle}>
        <ParallaxImg
          src={photo(row.imgId, Number(row.imgW ?? '1600'))}
          alt={row.eyebrow}
        />
        {/* Numéral fantôme */}
        <span
          style={{
            position: 'absolute',
            bottom: -24,
            right: row.reverse ? 'auto' : -20,
            left: row.reverse ? -20 : 'auto',
            fontFamily: SERIF,
            fontSize: 'clamp(80px,10vw,140px)',
            color: C.gold,
            opacity: 0.08,
            lineHeight: 1,
            fontWeight: 400,
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          {String(num).padStart(2, '0')}
        </span>
      </Reveal>
      <div style={txtStyle}>
        <Reveal>
          <Eyebrow>{row.eyebrow}</Eyebrow>
        </Reveal>
        <Reveal delay={0.1}>
          <h3
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(1.8rem,3.8vw,4.2rem)',
              fontWeight: 400,
              color: C.ink,
              margin: '20px 0 24px',
              lineHeight: 1.1,
            }}
          >
            {row.title}
          </h3>
        </Reveal>
        <Reveal delay={0.18}>
          <p
            style={{
              fontFamily: SANS,
              fontWeight: 300,
              fontSize: 'clamp(15px,1.3vw,18px)',
              lineHeight: 1.80,
              color: C.textMuted,
              maxWidth: 460,
              margin: '0 0 32px',
            }}
          >
            {row.body}
          </p>
        </Reveal>
        <Reveal delay={0.26}>
          <a href="#contact" style={{ textDecoration: 'none' }}>
            <GreenButton ghost>Parler à un expert</GreenButton>
          </a>
        </Reveal>
      </div>
      <style>{`
        @media (max-width: 860px) {
          .ax-editrow { grid-template-columns: 1fr !important; }
          .ax-editrow > * { order: initial !important; }
        }
      `}</style>
    </div>
  );
}

function EditorialRows() {
  const sec: React.CSSProperties = {
    background: C.bg,
    padding: 'clamp(80px,10vw,150px) clamp(24px,6vw,96px)',
  };
  return (
    <section style={sec} id="cabinet">
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(80px,11vw,150px)',
        }}
      >
        {EDIT_ROWS.map((r, i) => (
          <EditorialRowItem key={r.eyebrow} row={r} num={i + 1} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   PILLAR PANEL — image sticky + 4 piliers
   ════════════════════════════════════════════════════════════════════════════ */
function PillarPanel() {
  const sec: React.CSSProperties = {
    background: C.bgDark,
    padding: 'clamp(80px,10vw,140px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '0.85fr 1.15fr',
    gap: 'clamp(40px,6vw,96px)',
    maxWidth: 1280,
    margin: '0 auto',
    alignItems: 'start',
  };
  const stickyImg: React.CSSProperties = {
    position: 'sticky',
    top: 100,
    alignSelf: 'start',
  };

  return (
    <section style={sec} id="valeurs">
      <div style={grid} className="ax-pilpanel">
        {/* Image sticky */}
        <div style={stickyImg} className="ax-pilpanel-img">
          <div
            style={{
              overflow: 'hidden',
              border: `1px solid rgba(26,92,56,0.35)`,
              aspectRatio: '3 / 4',
            }}
          >
            <img
              src={photo('1551135049-8a33b5883817', 900)}
              alt="L'équipe Axiom Conseil Bordeaux"
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
              padding: '20px 0 0',
              borderTop: `1px solid rgba(26,92,56,0.3)`,
            }}
          >
            <div
              style={{
                fontFamily: SANS,
                fontSize: 11,
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                color: C.accentLight,
                marginBottom: 8,
                fontWeight: 500,
              }}
            >
              Axiom Conseil · Bordeaux
            </div>
            <div
              style={{
                fontFamily: SERIF,
                fontStyle: 'italic',
                fontSize: 17,
                color: 'rgba(255,255,255,0.72)',
                lineHeight: 1.6,
              }}
            >
              8 collaborateurs, 180 clients, un seul engagement : votre réussite.
            </div>
          </div>
        </div>

        {/* Piliers scrollables */}
        <div>
          <Reveal>
            <Eyebrow light>Nos engagements</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(2rem,4vw,4.5rem)',
                fontWeight: 400,
                color: C.white,
                margin: '20px 0 52px',
                lineHeight: 1.06,
              }}
            >
              Ce qui nous{' '}
              <span style={{ fontStyle: 'italic', color: C.accentLight }}>
                distingue
              </span>
            </h2>
          </Reveal>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {PILLARS.map((p, i) => (
              <Reveal key={p.num} delay={0.06 * i}>
                <div
                  style={{
                    padding: 'clamp(28px,3.5vw,44px) 0',
                    borderTop: `1px solid rgba(26,92,56,0.35)`,
                    display: 'flex',
                    gap: 28,
                    alignItems: 'flex-start',
                  }}
                >
                  <span
                    style={{
                      fontFamily: SERIF,
                      fontStyle: 'italic',
                      fontSize: 22,
                      color: C.gold,
                      minWidth: 36,
                      opacity: 0.9,
                      marginTop: 2,
                    }}
                  >
                    {p.num}
                  </span>
                  <div>
                    <h4
                      style={{
                        fontFamily: SANS,
                        fontWeight: 600,
                        fontSize: 'clamp(16px,1.4vw,20px)',
                        color: C.white,
                        margin: '0 0 10px',
                        letterSpacing: '0.02em',
                      }}
                    >
                      {p.title}
                    </h4>
                    <p
                      style={{
                        fontFamily: SANS,
                        fontWeight: 300,
                        fontSize: 'clamp(14px,1.1vw,16px)',
                        lineHeight: 1.7,
                        color: 'rgba(200,224,208,0.78)',
                        margin: 0,
                      }}
                    >
                      {p.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
            {/* Dernière ligne de fermeture */}
            <div
              style={{
                borderTop: `1px solid rgba(26,92,56,0.35)`,
                paddingTop: 'clamp(28px,3.5vw,44px)',
              }}
            />
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 860px) {
          .ax-pilpanel { grid-template-columns: 1fr !important; }
          .ax-pilpanel-img { position: static !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   TESTIMONIALS
   ════════════════════════════════════════════════════════════════════════════ */
function Testimonials() {
  const sec: React.CSSProperties = {
    background: C.bgAlt,
    padding: 'clamp(80px,11vw,160px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: 'clamp(28px,4vw,56px)',
    maxWidth: 1240,
    margin: '0 auto',
  };
  return (
    <section style={sec}>
      <div style={{ maxWidth: 1240, margin: '0 auto 56px', textAlign: 'center' }}>
        <Reveal>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
            <TrendingUp size={28} color={C.gold} strokeWidth={1.5} />
          </div>
        </Reveal>
        <Reveal delay={0.06}>
          <Eyebrow align="center">Ils nous font confiance</Eyebrow>
        </Reveal>
        <Reveal delay={0.14}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(2rem,4vw,4.5rem)',
              fontWeight: 400,
              color: C.ink,
              margin: '20px 0 0',
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
          <Reveal key={t.name} delay={i * 0.10} style={{ height: '100%' }}>
            <figure
              style={{
                background: C.bgCard,
                border: `1px solid ${C.border}`,
                padding: 'clamp(32px,3.5vw,48px)',
                margin: 0,
                height: '100%',
                boxSizing: 'border-box',
                boxShadow: '0 16px 50px -36px rgba(0,0,0,0.14)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <blockquote
                style={{
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  fontSize: 'clamp(17px,1.6vw,21px)',
                  lineHeight: 1.65,
                  color: C.ink,
                  margin: '0 0 28px',
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
                    fontFamily: SANS,
                    fontWeight: 600,
                    fontSize: 15,
                    color: C.ink,
                  }}
                >
                  {t.name}
                </div>
                <div
                  style={{
                    fontFamily: SANS,
                    fontSize: 11,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: C.textFaint,
                    marginTop: 5,
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
   CONTACT FORM — bgDark, état envoyé
   ════════════════════════════════════════════════════════════════════════════ */
function ContactForm() {
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [tel, setTel] = useState('');
  const [profil, setProfil] = useState('');
  const [objet, setObjet] = useState('');
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prenom || !nom || !email) return;
    setSent(true);
  };

  const sec: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    background: C.bgDark,
    padding: 'clamp(80px,11vw,160px) clamp(24px,6vw,96px)',
  };

  const fieldBase: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    background: 'transparent',
    border: 'none',
    borderBottom: `1px solid rgba(200,224,208,0.25)`,
    padding: '14px 2px',
    fontFamily: SANS,
    fontWeight: 300,
    fontSize: 16,
    color: C.white,
    outline: 'none',
    transition: 'border-color .3s',
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 10.5,
    letterSpacing: '0.24em',
    textTransform: 'uppercase',
    color: C.accentLight,
    display: 'block',
    marginBottom: 4,
    fontWeight: 500,
  };

  return (
    <section style={sec} id="contact">
      {/* Fond photo subtil */}
      <img
        src={photo('1551135049-8a33b5883817', 1600)}
        alt="Image de présentation"
        aria-hidden="true"
        loading="lazy"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.07,
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: 720,
          margin: '0 auto',
        }}
      >
        <Reveal>
          <Eyebrow light align="center">
            Prise de contact
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: 'clamp(2rem,4.5vw,5rem)',
              fontWeight: 400,
              color: C.white,
              margin: '22px 0 16px',
              lineHeight: 1.05,
              textAlign: 'center',
            }}
          >
            Commençons à travailler ensemble.
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p
            style={{
              fontFamily: SANS,
              fontWeight: 300,
              fontSize: 'clamp(15px,1.3vw,18px)',
              lineHeight: 1.7,
              color: 'rgba(200,224,208,0.78)',
              textAlign: 'center',
              marginBottom: 52,
            }}
          >
            Un premier échange de 30 minutes, sans engagement, pour comprendre
            vos besoins et vous proposer une mission adaptée.
          </p>
        </Reveal>

        {sent ? (
          <Reveal>
            <div
              style={{
                border: `1px solid ${C.accent}`,
                background: 'rgba(26,92,56,0.10)',
                padding: 'clamp(36px,5vw,56px)',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: '50%',
                  background: 'rgba(26,92,56,0.2)',
                  border: `1.5px solid ${C.accent}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 22px',
                }}
              >
                <TrendingUp size={22} color={C.accentLight} strokeWidth={1.6} />
              </div>
              <h3
                style={{
                  fontFamily: SERIF,
                  fontSize: 'clamp(1.4rem,2.5vw,2.2rem)',
                  fontWeight: 400,
                  color: C.white,
                  margin: '0 0 14px',
                }}
              >
                Merci {prenom}, un expert vous contacte dans les 24h.
              </h3>
              <p
                style={{
                  fontFamily: SANS,
                  fontWeight: 300,
                  fontSize: 16,
                  color: 'rgba(200,224,208,0.75)',
                  margin: 0,
                }}
              >
                Nous reviendrons vers vous à <strong style={{ color: C.accentLight, fontWeight: 500 }}>{email}</strong> pour convenir d'un créneau.
              </p>
            </div>
          </Reveal>
        ) : (
          <Reveal delay={0.22}>
            <form
              onSubmit={onSubmit}
              style={{ display: 'flex', flexDirection: 'column', gap: 34 }}
            >
              {/* Prénom + Nom sur 2 colonnes */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 28,
                }}
                className="ax-formgrid"
              >
                <div>
                  <label style={labelStyle} htmlFor="ax-prenom">
                    Prénom
                  </label>
                  <input
                    id="ax-prenom"
                    style={fieldBase}
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    placeholder="Marie"
                    autoComplete="given-name"
                    required
                  />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="ax-nom">
                    Nom
                  </label>
                  <input
                    id="ax-nom"
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
                <label style={labelStyle} htmlFor="ax-email">
                  Email
                </label>
                <input
                  id="ax-email"
                  style={fieldBase}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="marie@entreprise.fr"
                  autoComplete="email"
                  required
                />
              </div>

              <div>
                <label style={labelStyle} htmlFor="ax-tel">
                  Téléphone
                </label>
                <input
                  id="ax-tel"
                  style={fieldBase}
                  type="tel"
                  value={tel}
                  onChange={(e) => setTel(e.target.value)}
                  placeholder="06 12 34 56 78"
                  autoComplete="tel"
                />
              </div>

              <div>
                <label style={labelStyle} htmlFor="ax-profil">
                  Profil
                </label>
                <select
                  id="ax-profil"
                  style={{
                    ...fieldBase,
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    cursor: 'pointer',
                    color: profil ? C.white : 'rgba(200,224,208,0.42)',
                  }}
                  value={profil}
                  onChange={(e) => setProfil(e.target.value)}
                >
                  <option value="" style={{ color: '#111', background: '#fff' }}>
                    Votre situation…
                  </option>
                  <option value="Créateur d'entreprise" style={{ color: '#111', background: '#fff' }}>
                    Créateur d&apos;entreprise
                  </option>
                  <option value="TPE-PME" style={{ color: '#111', background: '#fff' }}>
                    TPE-PME
                  </option>
                  <option value="Profession libérale" style={{ color: '#111', background: '#fff' }}>
                    Profession libérale
                  </option>
                  <option value="E-commerce" style={{ color: '#111', background: '#fff' }}>
                    E-commerce
                  </option>
                  <option value="Startup" style={{ color: '#111', background: '#fff' }}>
                    Startup
                  </option>
                  <option value="Autre" style={{ color: '#111', background: '#fff' }}>
                    Autre
                  </option>
                </select>
              </div>

              <div>
                <label style={labelStyle} htmlFor="ax-objet">
                  Objet de la demande
                </label>
                <textarea
                  id="ax-objet"
                  style={{
                    ...fieldBase,
                    resize: 'none',
                    minHeight: 100,
                    borderBottom: 'none',
                    border: `1px solid rgba(200,224,208,0.25)`,
                    padding: '14px 16px',
                  }}
                  value={objet}
                  onChange={(e) => setObjet(e.target.value)}
                  placeholder="Décrivez brièvement votre situation ou votre besoin…"
                  rows={4}
                />
              </div>

              <div style={{ textAlign: 'center', marginTop: 8 }}>
                <GreenButton type="submit">Envoyer ma demande</GreenButton>
              </div>
            </form>
          </Reveal>
        )}
      </div>
      <style>{`
        @media (max-width: 860px) {
          .ax-formgrid { grid-template-columns: 1fr !important; }
        }
        input::placeholder, textarea::placeholder {
          color: rgba(200,224,208,0.38);
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   FOOTER
   ════════════════════════════════════════════════════════════════════════════ */
function Footer() {
  const cols: { title: string; items: { label: string; href: string }[] }[] = [
    {
      title: 'Expertises',
      items: [
        { label: 'Comptabilité & Paie', href: '#expertises' },
        { label: 'Conseil en gestion', href: '#expertises' },
        { label: "Création d'entreprise", href: '#expertises' },
        { label: 'Transmission & cession', href: '#expertises' },
      ],
    },
    {
      title: 'Services',
      items: [
        { label: 'Tenue comptable', href: '#services' },
        { label: 'Fiscalité', href: '#services' },
        { label: 'Bulletins de paie', href: '#services' },
        { label: 'Tableaux de bord', href: '#services' },
      ],
    },
    {
      title: 'Cabinet',
      items: [
        { label: 'Notre différence', href: '#cabinet' },
        { label: "L'équipe", href: '#cabinet' },
        { label: 'Valeurs', href: '#valeurs' },
        { label: 'Contact', href: '#contact' },
      ],
    },
  ];

  const foot: React.CSSProperties = {
    background: C.bgDarkAlt,
    borderTop: `1px solid rgba(26,92,56,0.28)`,
    padding: 'clamp(64px,8vw,100px) clamp(24px,6vw,96px) 36px',
  };

  return (
    <footer style={foot}>
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.5fr repeat(3, 1fr)',
          gap: 'clamp(36px,5vw,64px)',
        }}
        className="ax-footgrid"
      >
        {/* Brand */}
        <div>
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 24,
              color: C.white,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 18,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: C.accent,
                flexShrink: 0,
              }}
            />{fd?.businessName ?? "Axiom Conseil"}</div>
          <p
            style={{
              fontFamily: SANS,
              fontWeight: 300,
              fontSize: 14,
              lineHeight: 1.7,
              color: 'rgba(200,224,208,0.62)',
              maxWidth: 300,
              margin: '0 0 24px',
            }}
          >
            Expert-Comptable & Conseil en Gestion à Bordeaux. Membre de
            l&apos;Ordre des Experts-Comptables.
          </p>
          <div
            style={{
              fontFamily: SANS,
              fontSize: 11,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: C.accentLight,
              opacity: 0.8,
            }}
          >
            Bordeaux · Chartrons
          </div>
          <div
            style={{
              marginTop: 10,
              fontFamily: SANS,
              fontSize: 13,
              color: 'rgba(200,224,208,0.55)',
            }}
          >{fd?.email ?? "contact@axiomconseil.fr"}</div>
        </div>

        {/* Colonnes nav */}
        {cols.map((c) => (
          <div key={c.title}>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 10.5,
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                color: C.accent,
                marginBottom: 20,
                fontWeight: 600,
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
                      fontWeight: 300,
                      fontSize: 14,
                      color: 'rgba(200,224,208,0.65)',
                      textDecoration: 'none',
                      transition: 'color .3s',
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLAnchorElement).style.color = C.white)
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLAnchorElement).style.color =
                        'rgba(200,224,208,0.65)')
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
          maxWidth: 1280,
          margin: '56px auto 0',
          paddingTop: 24,
          borderTop: `1px solid rgba(26,92,56,0.20)`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 14,
          fontFamily: SANS,
          fontWeight: 300,
          fontSize: 11,
          letterSpacing: '0.10em',
          color: 'rgba(200,224,208,0.38)',
        }}
      >
        <span>© 2015–2026 Axiom Conseil. Tous droits réservés.</span>
        <span style={{ display: 'flex', gap: 22 }}>
          <a href="#contact" style={{ color: 'inherit', textDecoration: 'none' }}>
            Mentions légales
          </a>
          <a href="#contact" style={{ color: 'inherit', textDecoration: 'none' }}>
            Politique de confidentialité
          </a>
        </span>
      </div>
      <style>{`
        @media (max-width: 860px) {
          .ax-footgrid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 520px) {
          .ax-footgrid { grid-template-columns: 1fr !important; }
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
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Outfit:wght@300;400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        /* Prevent iOS zoom on inputs */
        @media (max-width: 860px) {
          input, select, textarea {
            font-size: 16px !important;
          }
        }
      `}</style>

      <Nav />
      <Hero />
      <Intro />
      <DomainSequence />
      <ServiceCards />
      <EditorialRows />
      <PillarPanel />
      <Testimonials />
      <ContactForm />
      <Footer />
    </main>
  );
}
