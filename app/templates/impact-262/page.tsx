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
   STUDIO NOIR ABSOLU — Tatouage Fine Art & Illustration · Paris 3e Marais
   Chorégraphie de défilement éditoriale : crossfade 320vh + panneau collant
   hygiènes + formulaire de réservation artistique. Auto-suffisant. 'use client'.
   ════════════════════════════════════════════════════════════════════════════ */

/* ── Google Fonts ─────────────────────────────────────────────────────────── */
const FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,600;1,6..96,400;1,6..96,600&family=Space+Grotesk:wght@300;400;500;600&display=swap';

/* ── Palette ─────────────────────────────────────────────────────────────── */
const C = {
  bg: '#f6f4f0',
  bgAlt: '#eceae4',
  bgDark: '#0a0806',
  bgDarkAlt: '#050402',
  bgCard: '#ffffff',
  accent: '#e8c060',
  accentDark: '#c0980c',
  accentLight: '#f8ecc8',
  white: '#ffffff',
  ink: '#0a0806',
  textMuted: '#302820',
  textFaint: '#888070',
  border: '#ddd8d0',
  borderDark: 'rgba(232,192,96,0.2)',
  red: '#b83020',
} as const;

const SERIF = "'Bodoni Moda', Georgia, serif" as const;
const SANS = "'Space Grotesk', system-ui, sans-serif" as const;

/* ── Easing partagé ──────────────────────────────────────────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ── Photo helper ────────────────────────────────────────────────────────── */
function photo(id: string, w = 1600) {
  return `https://images.unsplash.com/photo-${id}?q=80&w=${w}&auto=format&fit=crop`;
}

/* ════════════════════════════════════════════════════════════════════════════
   Interfaces TypeScript
   ════════════════════════════════════════════════════════════════════════════ */

interface Style {
  num: string;
  roman: string;
  label: string;
  body: string;
  imgId: string;
}

interface Artist {
  name: string;
  specialty: string;
  wait: string;
  bio: string;
  imgId: string;
}

interface EditRow {
  eyebrow: string;
  imgId: string;
  reverse: boolean;
  title: React.ReactNode;
  body: string;
}

interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

interface SafetyItem {
  num: string;
  title: string;
  body: string;
}

/* ════════════════════════════════════════════════════════════════════════════
   Données
   ════════════════════════════════════════════════════════════════════════════ */

const STYLES: Style[] = [
  {
    num: '1',
    roman: 'I',
    label: 'ILLUSTRATION',
    body: 'Personnages, scènes narratives, univers manga & bande dessinée — chaque pièce raconte une histoire unique.',
    imgId: '1611501579-4d7dc8532cc1',
  },
  {
    num: '2',
    roman: 'II',
    label: 'NEO-TRADITIONNEL',
    body: 'Réinterprétation des codes old school avec palettes contemporaines et trait bold — intemporel et audacieux.',
    imgId: '1567401893-56e3d64e7b2c',
  },
  {
    num: '3',
    roman: 'III',
    label: 'BOTANICA & GRAVURE',
    body: 'Flore, faune, gravure sur bois transposée en encre — finesse extrême, compositions équilibrées.',
    imgId: '1547036967-23136a0f3b86',
  },
];

const ARTISTS: Artist[] = [
  {
    name: 'KIRA',
    specialty: 'Illustration & manga',
    wait: '3 mois',
    bio: "9 ans d\'expérience, collections muséales et fanzines underground.",
    imgId: '1611501579-4d7dc8532cc1',
  },
  {
    name: 'THÉO',
    specialty: 'Neo-traditionnel & animaux',
    wait: '5 semaines',
    bio: 'Spécialiste couleur, influences tatami et botanique victorienne.',
    imgId: '1567401893-56e3d64e7b2c',
  },
  {
    name: 'JADE',
    specialty: 'Botanica & gravure',
    wait: '6 semaines',
    bio: 'Fineline expert, tracé au quart de millimètre, adepte du noir pur.',
    imgId: '1547036967-23136a0f3b86',
  },
  {
    name: 'MAX',
    specialty: 'Lettering & géométrie',
    wait: '4 semaines',
    bio: 'Typographie custom, design graphique, chaque lettre est une composition.',
    imgId: '1611501579-4d7dc8532cc1',
  },
];

const EDIT_ROWS: EditRow[] = [
  {
    eyebrow: 'Notre ADN',
    imgId: '1611501579-4d7dc8532cc1',
    reverse: false,
    title: (
      <>
        L&apos;encre /{' '}
        <span style={{ fontStyle: 'italic' }}>comme langage.</span>
      </>
    ),
    body: "Aucun flash. 100 % designs sur mesure. Nous imposons un minimum d\'une heure de consultation avant toute réservation — pour comprendre votre univers, votre peau, vos intentions.",
  },
  {
    eyebrow: 'Le studio',
    imgId: '1547036967-23136a0f3b86',
    reverse: true,
    title: (
      <>
        Marais, /{' '}
        <span style={{ fontStyle: 'italic' }}>Paris 3e.</span>
      </>
    ),
    body: 'Studio lumineux en cœur de Marais, sur rendez-vous uniquement. Quatre artistes travaillent simultanément dans un espace ouvert. Collectionneurs internationaux, clients locaux — même exigence.',
  },
];

const SAFETY_ITEMS: SafetyItem[] = [
  {
    num: '01',
    title: 'Aiguilles & cartouches stériles à usage unique',
    body: "Chaque aiguille est issue d\'un emballage scellé ouvert devant vous. Destruction certifiée après chaque session en conteneur DASRI agréé.",
  },
  {
    num: '02',
    title: 'Encres vegan certifiées ISO',
    body: "Pigments testés toxicologiquement, sans métaux lourds, sans ingrédients d\'origine animale. Fiches de sécurité disponibles sur demande.",
  },
  {
    num: '03',
    title: "Cabines désinfectées à l\'autoclave",
    body: "Chaque poste de travail est désinfecté et re-stérilisé à l\'autoclave avant chaque client, selon le protocole clinique classe IIb.",
  },
  {
    num: '04',
    title: 'Guide de cicatrisation + suivi J14 inclus',
    body: 'Un document de soin personnalisé vous est remis à la sortie. Une consultation de suivi à J14 est incluse dans tous les projets.',
  },
];

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "J\'ai 12 tatouages signés de mains différentes à travers le monde. La manche réalisée par Kira est la pièce maîtresse de ma collection — un univers narratif complet sur une seule peau.",
    name: 'Adrien Leclercq',
    role: 'Collectionneur · Bruxelles',
  },
  {
    quote:
      "Premier tatouage, j\'étais terrorisée. Le processus de création — les croquis, les allers-retours, la consultation — m\'a complètement rassurée. Je suis repartie avec quelque chose qui me ressemble vraiment.",
    name: 'Camille Moreau',
    role: 'Cliente première fois · Paris',
  },
];

/* ════════════════════════════════════════════════════════════════════════════
   Primitives partagées
   ════════════════════════════════════════════════════════════════════════════ */

/** Étiquette fine, capitales, interlettrage large. */
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
  void dark;
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

/** Bouton doré — variante remplie (gold bg, ink text) ou contour. */
function GoldButton({
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
    fontSize: 11.5,
    letterSpacing: '0.26em',
    textTransform: 'uppercase',
    fontWeight: 500,
    cursor: 'pointer',
    border: `1px solid ${C.accent}`,
    background: filled ? C.accent : 'transparent',
    color: filled ? C.ink : C.accent,
    transition: 'all .5s cubic-bezier(.16,1,.3,1)',
  };
  const hov: React.CSSProperties = hover
    ? filled
      ? { background: C.accentLight, transform: 'translateY(-2px)' }
      : {
          background: 'rgba(232,192,96,0.10)',
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
   1 · NAV — transparente → solide au défilement
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

  const navLinks = [
    { label: 'Styles', href: '#styles' },
    { label: 'Artistes', href: '#artistes' },
    { label: 'Le Studio', href: '#studio' },
    { label: 'Hygiène', href: '#hygiene' },
    { label: 'Contact', href: '#reservation' },
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
    background: solid ? 'rgba(10,8,6,0.97)' : 'transparent',
    backdropFilter: solid ? 'blur(16px) saturate(140%)' : 'none',
    WebkitBackdropFilter: solid ? 'blur(16px) saturate(140%)' : 'none',
    borderBottom: solid
      ? `1px solid rgba(232,192,96,0.18)`
      : '1px solid transparent',
    transition: 'all .6s cubic-bezier(.16,1,.3,1)',
  };

  const brand: React.CSSProperties = {
    fontFamily: SERIF,
    fontStyle: 'italic',
    fontSize: 'clamp(17px,1.6vw,22px)',
    color: C.white,
    letterSpacing: '0.04em',
    textDecoration: 'none',
  };

  const linkRow: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'clamp(18px,2.2vw,36px)',
  };

  return (
    <>
      <nav style={bar}>
      <a href="#hero" style={brand}>{fd?.businessName ?? "Studio Noir Absolu"}</a>
      <div style={linkRow} className="sna-navlinks">
        {navLinks.map((l) => (
          <NavLink key={l.label} label={l.label} href={l.href} />
        ))}
      </div>
      <div className="sna-navcta">
        <a href="#reservation" style={{ textDecoration: 'none' }}>
          <GoldButton filled>Réserver</GoldButton>
        </a>
      </div>
      
        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="sna-burger"
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
        @media (max-width: 860px){
          .sna-navlinks { display: none !important; }
          .sna-burger { display: flex !important; flex-direction: column; }
          .sna-navcta   { display: none !important; }
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
          {navLinks.map((l) => (
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
        fontSize: 11,
        letterSpacing: '0.20em',
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
   2 · HERO — 100vh, parallaxe scale + Y, scrims lourds
   ════════════════════════════════════════════════════════════════════════════ */
function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '-42%']);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
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
          src={photo('1611501579-4d7dc8532cc1', 2000)}
          alt="Studio Noir Absolu — Fine Art Tattoo Paris 3e"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          priority-hint="high"
        />
      </motion.div>

      {/* Scrims */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(10,8,6,0.55) 0%, rgba(10,8,6,0.10) 35%, rgba(10,8,6,0.55) 72%, rgba(10,8,6,0.92) 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(130% 90% at 50% 20%, transparent 30%, rgba(10,8,6,0.50) 100%)',
        }}
      />

      {/* Contenu parallaxe */}
      <motion.div
        style={{
          position: 'relative',
          zIndex: 2,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding:
            '0 clamp(24px,6vw,96px) clamp(60px,8vh,110px) clamp(24px,6vw,96px)',
          y: titleY,
          opacity: titleOpacity,
        }}
      >
        <Reveal y={16}>
          <Eyebrow color={C.accentLight} align="left">
            Fine Art Tattoo · Paris 3e Marais
          </Eyebrow>
        </Reveal>

        <motion.h1
          initial={{ opacity: 0, y: 48 }}
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
            margin: 'clamp(20px,2.5vh,36px) 0 clamp(18px,2vh,28px)',
            textShadow: '0 14px 70px rgba(0,0,0,0.60)',
            maxWidth: 900,
          }}
        >
          Art /
          <br />
          permanent.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.38 }}
          style={{
            fontFamily: SANS,
            fontWeight: 300,
            fontSize: 'clamp(15px,1.8vw,20px)',
            color: 'rgba(255,255,255,0.80)',
            maxWidth: 520,
            lineHeight: 1.65,
          }}
        >
          Quatre artistes, zéro flash, cent pour cent sur mesure. Chaque tatouage
          est une œuvre conçue pour une seule peau.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.62 }}
          style={{ marginTop: 'clamp(28px,3.5vh,44px)' }}
        >
          <GoldButton filled>Réserver une consultation</GoldButton>
        </motion.div>
      </motion.div>

      {/* Indice défilement */}
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
          gap: 10,
          opacity: cueOpacity,
        }}
      >
        <span
          style={{
            fontFamily: SANS,
            fontSize: 9.5,
            letterSpacing: '0.40em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.65)',
          }}
        >
          Découvrir
        </span>
        <motion.div
          animate={{ y: [0, 9, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={20} color={C.accentLight} strokeWidth={1.4} />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   3 · INTRO — citation éditoriale centrée, bgAlt
   ════════════════════════════════════════════════════════════════════════════ */
function Intro() {
  const sec: React.CSSProperties = {
    background: C.bgAlt,
    padding:
      'clamp(96px,14vw,200px) clamp(24px,10vw,200px)',
    textAlign: 'center',
  };
  return (
    <section id="contact" style={sec}>
      <Reveal>
        <div
          style={{ display: 'flex', justifyContent: 'center', marginBottom: 36 }}
        >
          <Eyebrow color={C.textMuted} align="center">
            Notre philosophie
          </Eyebrow>
        </div>
      </Reveal>
      <Reveal delay={0.1}>
        <p
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 'clamp(22px,3.4vw,48px)',
            lineHeight: 1.34,
            color: C.ink,
            maxWidth: 960,
            margin: '0 auto',
            fontWeight: 400,
          }}
        >
          Un tatouage ne s&apos;efface pas. C&apos;est une raison de plus pour le
          confier à un artiste.
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
   4 · STYLE SEQUENCE — sticky crossfade 320vh, bgDark, gold dots
   ════════════════════════════════════════════════════════════════════════════ */
function StyleImage({
  style,
  i,
  total,
  progress,
}: {
  style: Style;
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
        src={photo(style.imgId)}
        alt={`Style ${style.label} — Studio Noir Absolu`}
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
  style,
  i,
  total,
  progress,
}: {
  style: Style;
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
        justifyContent: 'flex-end',
        padding: 'clamp(36px,5vw,80px)',
        opacity,
        y,
      }}
    >
      {/* Section label top-right */}
      <div
        style={{
          position: 'absolute',
          top: 'clamp(80px,10vh,120px)',
          right: 'clamp(24px,4vw,64px)',
          textAlign: 'right',
        }}
      >
        <span
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 'clamp(64px,10vw,140px)',
            color: 'rgba(232,192,96,0.18)',
            lineHeight: 1,
            display: 'block',
          }}
        >
          {style.roman}
        </span>
        <span
          style={{
            fontFamily: SANS,
            fontSize: 11,
            letterSpacing: '0.38em',
            textTransform: 'uppercase',
            color: 'rgba(232,192,96,0.65)',
          }}
        >
          {style.label}
        </span>
      </div>

      {/* Contenu bas */}
      <div style={{ maxWidth: 640 }}>
        <h2
          style={{
            fontFamily: SERIF,
            fontSize: 'clamp(38px,6.5vw,88px)',
            fontWeight: 400,
            color: C.white,
            lineHeight: 1.0,
            margin: '0 0 20px',
            textShadow: '0 8px 48px rgba(0,0,0,0.60)',
          }}
        >
          {style.label.charAt(0) +
            style.label.slice(1).toLowerCase().replace(/-/g, '‑')}
        </h2>
        <p
          style={{
            fontFamily: SANS,
            fontWeight: 300,
            fontSize: 'clamp(14px,1.5vw,18px)',
            lineHeight: 1.7,
            color: 'rgba(255,255,255,0.78)',
            maxWidth: 460,
          }}
        >
          {style.body}
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
    [0.28, 1, 1, 0.28],
  );
  const width = useTransform(progress, [i * seg, (i + 1) * seg], [10, 36]);
  return (
    <motion.div
      style={{ height: 2, width, background: C.accent, opacity, borderRadius: 2 }}
    />
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
      style={{
        height: '100vh', overflow: 'hidden',
        position: 'relative',
        background: C.bgDark,
      }}
      id="styles"
    >
      <div
        style={{
          position: 'relative',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {STYLES.map((s, i) => (
          <StyleImage
            key={s.label}
            style={s}
            i={i}
            total={STYLES.length}
            progress={progress}
          />
        ))}
        {/* Scrims */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to bottom, rgba(10,8,6,0.38), rgba(10,8,6,0.06) 40%, rgba(10,8,6,0.72))',
          }}
        />
        {STYLES.map((s, i) => (
          <StyleCaption
            key={s.label}
            style={s}
            i={i}
            total={STYLES.length}
            progress={progress}
          />
        ))}

        {/* Progress dots */}
        <div
          style={{
            position: 'absolute',
            bottom: 38,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 12,
          }}
        >
          {STYLES.map((s, i) => (
            <ProgressDot
              key={s.num}
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

/* ════════════════════════════════════════════════════════════════════════════
   5 · ARTIST CARDS — bgAlt, 4 cartes larges, badge attente rouge
   ════════════════════════════════════════════════════════════════════════════ */
function ArtistCard({ artist, i }: { artist: Artist; i: number }) {
  const [hover, setHover] = useState(false);

  const card: React.CSSProperties = {
    background: C.bgCard,
    border: `1px solid ${hover ? 'rgba(232,192,96,0.55)' : C.border}`,
    overflow: 'hidden',
    transform: hover ? 'translateY(-10px)' : 'none',
    boxShadow: hover
      ? '0 40px 80px -24px rgba(10,8,6,0.22)'
      : '0 6px 28px -18px rgba(10,8,6,0.14)',
    transition: 'all .6s cubic-bezier(.16,1,.3,1)',
    cursor: 'default',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  };

  return (
    <Reveal delay={i * 0.1} style={{ height: '100%' }}>
      <article
        style={card}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {/* Photo carrée sur fond gold */}
        <div
          style={{
            position: 'relative',
            aspectRatio: '1 / 1',
            background: C.accentLight,
            overflow: 'hidden',
          }}
        >
          <img
            src={photo(artist.imgId, 600)}
            alt={`Tatoueur ${artist.name} — Studio Noir Absolu`}
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: hover ? 'scale(1.06)' : 'scale(1)',
              transition: 'transform 1s cubic-bezier(.16,1,.3,1)',
              mixBlendMode: 'multiply',
              opacity: 0.85,
            }}
          />
          {/* Badge attente */}
          <div
            style={{
              position: 'absolute',
              top: 14,
              right: 14,
              background: C.red,
              padding: '5px 12px',
              fontFamily: SANS,
              fontSize: 10,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: C.white,
              fontWeight: 500,
            }}
          >
            {artist.wait}
          </div>
        </div>

        {/* Texte */}
        <div
          style={{
            padding: 'clamp(20px,2.5vw,30px)',
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
          }}
        >
          <h3
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(22px,2.2vw,28px)',
              fontWeight: 400,
              color: C.ink,
              margin: '0 0 6px',
              letterSpacing: '0.04em',
            }}
          >
            {artist.name}
          </h3>
          <div
            style={{
              fontFamily: SANS,
              fontSize: 11,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: C.accentDark,
              fontWeight: 500,
              marginBottom: 14,
            }}
          >
            {artist.specialty}
          </div>
          <p
            style={{
              fontFamily: SANS,
              fontWeight: 300,
              fontSize: 14,
              lineHeight: 1.65,
              color: C.textMuted,
              margin: 0,
              flex: 1,
            }}
          >
            {artist.bio}
          </p>
        </div>
      </article>
    </Reveal>
  );
}

function ArtistCards() {
  const sec: React.CSSProperties = {
    background: C.bgAlt,
    padding:
      'clamp(88px,12vw,170px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: 'clamp(20px,2.5vw,36px)',
    maxWidth: 1280,
    margin: '0 auto',
  };

  return (
    <section style={sec} id="artistes">
      <div style={{ maxWidth: 1280, margin: '0 auto 52px' }}>
        <Reveal>
          <Eyebrow color={C.textMuted} align="left">
            Nos artistes
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(34px,5.5vw,74px)',
              fontWeight: 400,
              color: C.ink,
              margin: '18px 0 0',
              lineHeight: 1.05,
            }}
          >
            Quatre univers,{' '}
            <span style={{ fontStyle: 'italic' }}>une exigence.</span>
          </h2>
        </Reveal>
      </div>
      <div style={grid}>
        {ARTISTS.map((a, i) => (
          <ArtistCard key={a.name} artist={a} i={i} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   6 · EDITORIAL ROWS — 2 rangées alternées avec chiffre fantôme rouge
   ════════════════════════════════════════════════════════════════════════════ */
/** Image avec dérive parallaxe légère. */
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

function EditRowItem({ row, index }: { row: EditRow; index: number }) {
  const wrap: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 'clamp(32px,5.5vw,88px)',
    alignItems: 'center',
    position: 'relative',
  };
  const imgWrap: React.CSSProperties = {
    overflow: 'hidden',
    order: row.reverse ? 2 : 1,
    aspectRatio: '4 / 5',
  };
  const txt: React.CSSProperties = {
    order: row.reverse ? 1 : 2,
    position: 'relative',
  };

  return (
    <div style={wrap} className="sna-editrow">
      {/* Chiffre fantôme */}
      <span
        style={{
          position: 'absolute',
          top: -40,
          left: row.reverse ? undefined : -20,
          right: row.reverse ? -20 : undefined,
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontSize: 'clamp(140px,16vw,220px)',
          color: C.red,
          opacity: 0.08,
          lineHeight: 1,
          pointerEvents: 'none',
          userSelect: 'none',
          zIndex: 0,
        }}
      >
        {String(index + 1).padStart(2, '0')}
      </span>

      <Reveal y={50} style={{ ...imgWrap, position: 'relative', zIndex: 1 }}>
        <ParallaxImg
          src={photo(row.imgId, 800)}
          alt={`Studio Noir Absolu — ${row.eyebrow}`}
        />
      </Reveal>

      <div style={{ ...txt, zIndex: 1 }}>
        <Reveal>
          <Eyebrow color={C.textFaint}>{row.eyebrow}</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h3
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(28px,4vw,56px)',
              fontWeight: 400,
              color: C.ink,
              margin: 'clamp(16px,1.8vw,24px) 0 clamp(16px,1.8vw,24px)',
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
              lineHeight: 1.8,
              color: C.textMuted,
              maxWidth: 480,
            }}
          >
            {row.body}
          </p>
        </Reveal>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .sna-editrow { grid-template-columns: 1fr !important; }
          .sna-editrow > * { order: initial !important; }
        }
      `}</style>
    </div>
  );
}

function EditorialRows() {
  const sec: React.CSSProperties = {
    background: C.bg,
    padding:
      'clamp(80px,11vw,160px) clamp(24px,6vw,96px)',
  };

  return (
    <section style={sec} id="studio">
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(80px,12vw,160px)',
        }}
      >
        {EDIT_ROWS.map((row, i) => (
          <EditRowItem key={row.eyebrow} row={row} index={i} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   7 · SAFETY PANEL — bgDark, image sticky gauche, 4 étapes défilent à droite
   ════════════════════════════════════════════════════════════════════════════ */
function SafetyPanel() {
  const sec: React.CSSProperties = {
    background: C.bgDark,
    padding:
      'clamp(80px,11vw,150px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '0.85fr 1.15fr',
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
    <section style={sec} id="hygiene">
      <div style={grid} className="sna-safepanel">
        {/* Image collante à gauche */}
        <div style={stickySide} className="sna-safepanel-img">
          <div
            style={{
              overflow: 'hidden',
              border: `1px solid ${C.borderDark}`,
              aspectRatio: '3 / 4',
            }}
          >
            <img
              src={photo('1567401893-56e3d64e7b2c', 900)}
              alt="Hygiène et protocoles — Studio Noir Absolu"
              loading="lazy"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </div>
          <div style={{ marginTop: 22 }}>
            <Eyebrow color={C.accent}>Protocoles & sécurité</Eyebrow>
            <p
              style={{
                fontFamily: SERIF,
                fontStyle: 'italic',
                fontSize: 15,
                color: 'rgba(255,255,255,0.58)',
                marginTop: 14,
                lineHeight: 1.65,
              }}
            >
              Notre engagement dépasse la réglementation. Chaque protocole est
              documenté et vérifiable.
            </p>
          </div>
        </div>

        {/* Étapes défilantes */}
        <div>
          <Reveal>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(32px,5vw,66px)',
                fontWeight: 400,
                color: C.white,
                margin: '0 0 clamp(40px,5vw,70px)',
                lineHeight: 1.06,
              }}
            >
              Votre sécurité,{' '}
              <span style={{ fontStyle: 'italic', color: C.accent }}>
                notre standard.
              </span>
            </h2>
          </Reveal>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {SAFETY_ITEMS.map((item, i) => (
              <Reveal key={item.num} delay={0.05 * i}>
                <div
                  style={{
                    padding: 'clamp(28px,3.5vw,42px) 0',
                    borderTop: `1px solid ${C.red}`,
                    display: 'flex',
                    gap: 'clamp(20px,3vw,40px)',
                    alignItems: 'baseline',
                  }}
                >
                  {/* Numéro gold */}
                  <span
                    style={{
                      fontFamily: SERIF,
                      fontStyle: 'italic',
                      fontSize: 'clamp(26px,3vw,38px)',
                      color: C.accent,
                      minWidth: 50,
                      lineHeight: 1,
                      flexShrink: 0,
                    }}
                  >
                    {item.num}
                  </span>
                  <div>
                    <h4
                      style={{
                        fontFamily: SANS,
                        fontWeight: 500,
                        fontSize: 'clamp(14px,1.4vw,17px)',
                        color: C.white,
                        margin: '0 0 10px',
                        letterSpacing: '0.02em',
                      }}
                    >
                      {item.title}
                    </h4>
                    <p
                      style={{
                        fontFamily: SANS,
                        fontWeight: 300,
                        fontSize: 'clamp(13px,1.3vw,15px)',
                        lineHeight: 1.72,
                        color: 'rgba(255,255,255,0.62)',
                        margin: 0,
                      }}
                    >
                      {item.body}
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
          .sna-safepanel { grid-template-columns: 1fr !important; }
          .sna-safepanel-img { position: static !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   8 · TESTIMONIALS — bg, 2 cartes blanches, étoiles gold, SERIF italic
   ════════════════════════════════════════════════════════════════════════════ */
function Testimonials() {
  const sec: React.CSSProperties = {
    background: C.bg,
    padding:
      'clamp(88px,12vw,170px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: 'clamp(28px,3.5vw,56px)',
    maxWidth: 1180,
    margin: '0 auto',
  };

  return (
    <section style={sec}>
      <div
        style={{ maxWidth: 1180, margin: '0 auto 60px', textAlign: 'center' }}
      >
        <Reveal>
          <Eyebrow color={C.textFaint} align="center">
            Témoignages
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(32px,5vw,64px)',
              fontWeight: 400,
              color: C.ink,
              margin: '18px 0 0',
            }}
          >
            Ce qu&apos;ils{' '}
            <span style={{ fontStyle: 'italic' }}>portent.</span>
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
                padding: 'clamp(32px,4vw,52px)',
                margin: 0,
                height: '100%',
                boxSizing: 'border-box',
                boxShadow: '0 20px 60px -40px rgba(10,8,6,0.22)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Stars gold */}
              <div style={{ display: 'flex', gap: 4, marginBottom: 22 }}>
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star
                    key={s}
                    size={15}
                    fill={C.accent}
                    color={C.accent}
                    strokeWidth={0}
                  />
                ))}
              </div>

              <blockquote
                style={{
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  fontSize: 'clamp(17px,1.9vw,22px)',
                  lineHeight: 1.62,
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
                    fontFamily: SERIF,
                    fontSize: 18,
                    color: C.ink,
                    marginBottom: 5,
                  }}
                >
                  {t.name}
                </div>
                <div
                  style={{
                    fontFamily: SANS,
                    fontSize: 10.5,
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: C.textFaint,
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
   9 · BOOKING FORM — bgDark, 720px, état envoyé warm
   ════════════════════════════════════════════════════════════════════════════ */
function BookingForm() {
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [tel, setTel] = useState('');
  const [style, setStyle] = useState('');
  const [taille, setTaille] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [touched, setTouched] = useState(false);

  const valid = prenom.trim() !== '' && email.includes('@') && style !== '';

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!valid) return;
    setSent(true);
  };

  const sec: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    background: C.bgDark,
    padding:
      'clamp(96px,13vw,180px) clamp(24px,6vw,96px)',
  };

  const fieldBase: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    background: 'transparent',
    border: 'none',
    borderBottom: `1px solid rgba(232,192,96,0.35)`,
    padding: '15px 2px',
    fontFamily: SANS,
    fontWeight: 300,
    fontSize: 17,
    color: C.white,
    outline: 'none',
    transition: 'border-color .3s',
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 10,
    letterSpacing: '0.32em',
    textTransform: 'uppercase',
    color: C.accent,
    fontWeight: 500,
    display: 'block',
    marginBottom: 4,
  };

  const STYLE_OPTIONS = [
    'Illustration',
    'Neo-traditionnel',
    'Botanica',
    'Gravure',
    'Lettering',
    'Autre',
  ];

  return (
    <section style={sec} id="reservation">
      {/* Texture de fond discrète */}
      <img
        src={photo('1611501579-4d7dc8532cc1', 1200)}
        alt="Image de présentation"
        aria-hidden="true"
        loading="lazy"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.06,
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
            Réservation
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: 'clamp(36px,6vw,80px)',
              fontWeight: 400,
              color: C.white,
              margin: '20px 0 16px',
              lineHeight: 1.04,
            }}
          >
            Démarrer votre projet.
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p
            style={{
              fontFamily: SANS,
              fontWeight: 300,
              fontSize: 'clamp(14px,1.6vw,17px)',
              lineHeight: 1.72,
              color: 'rgba(255,255,255,0.70)',
              maxWidth: 520,
              margin: '0 auto 52px',
            }}
          >
            Remplissez ce formulaire pour initier votre consultation. Un artiste
            vous contacte sous 48h pour discuter de votre vision.
          </p>
        </Reveal>

        {sent ? (
          <Reveal>
            <div
              style={{
                border: `1px solid rgba(232,192,96,0.45)`,
                padding: 'clamp(40px,5vw,64px)',
                background: 'rgba(232,192,96,0.06)',
              }}
            >
              {/* Ornement */}
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  border: `1px solid ${C.accent}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                }}
              >
                <span style={{ color: C.accent, fontSize: 22 }}>✦</span>
              </div>
              <h3
                style={{
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  fontSize: 'clamp(26px,3.5vw,38px)',
                  fontWeight: 400,
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
                Notre équipe revient vers vous sous 48h pour planifier votre
                consultation.
              </p>
            </div>
          </Reveal>
        ) : (
          <Reveal delay={0.24}>
            <form
              onSubmit={onSubmit}
              noValidate
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 30,
                textAlign: 'left',
              }}
            >
              {/* Prénom */}
              <div>
                <label style={labelStyle} htmlFor="sna-prenom">
                  Prénom *
                </label>
                <input
                  id="sna-prenom"
                  style={{
                    ...fieldBase,
                    borderColor:
                      touched && !prenom.trim()
                        ? C.red
                        : 'rgba(232,192,96,0.35)',
                  }}
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  placeholder="Votre prénom"
                  autoComplete="given-name"
                />
              </div>

              {/* Email */}
              <div>
                <label style={labelStyle} htmlFor="sna-email">
                  Email *
                </label>
                <input
                  id="sna-email"
                  style={{
                    ...fieldBase,
                    borderColor:
                      touched && !email.includes('@')
                        ? C.red
                        : 'rgba(232,192,96,0.35)',
                  }}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@exemple.fr"
                  autoComplete="email"
                />
              </div>

              {/* Téléphone */}
              <div>
                <label style={labelStyle} htmlFor="sna-tel">
                  Téléphone
                </label>
                <input
                  id="sna-tel"
                  style={fieldBase}
                  type="tel"
                  value={tel}
                  onChange={(e) => setTel(e.target.value)}
                  placeholder="+33 6 00 00 00 00"
                  autoComplete="tel"
                />
              </div>

              {/* Style */}
              <div>
                <label style={labelStyle} htmlFor="sna-style">
                  Style *
                </label>
                <select
                  id="sna-style"
                  style={{
                    ...fieldBase,
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    cursor: 'pointer',
                    color: style ? C.white : 'rgba(255,255,255,0.40)',
                    borderColor:
                      touched && !style
                        ? C.red
                        : 'rgba(232,192,96,0.35)',
                    fontSize: 16,
                  }}
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                >
                  <option value="" style={{ color: '#000' }}>
                    Choisir un style…
                  </option>
                  {STYLE_OPTIONS.map((o) => (
                    <option key={o} value={o} style={{ color: '#000' }}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>

              {/* Taille estimée */}
              <div>
                <label style={labelStyle} htmlFor="sna-taille">
                  Taille estimée
                </label>
                <input
                  id="sna-taille"
                  style={fieldBase}
                  value={taille}
                  onChange={(e) => setTaille(e.target.value)}
                  placeholder="Ex : poing, avant-bras complet, timbre…"
                />
              </div>

              {/* Message */}
              <div>
                <label style={labelStyle} htmlFor="sna-message">
                  Votre projet
                </label>
                <textarea
                  id="sna-message"
                  rows={4}
                  style={{
                    ...fieldBase,
                    resize: 'vertical',
                    lineHeight: 1.65,
                    minHeight: 90,
                  }}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Décrivez votre vision, références, emplacement, contexte…"
                />
              </div>

              {touched && !valid && (
                <p
                  style={{
                    fontFamily: SANS,
                    fontSize: 12,
                    color: C.red,
                    margin: '-10px 0 0',
                  }}
                >
                  Merci de remplir les champs obligatoires (prénom, email,
                  style).
                </p>
              )}

              <div style={{ textAlign: 'center', marginTop: 8 }}>
                <GoldButton filled type="submit">
                  Envoyer ma demande
                </GoldButton>
              </div>
            </form>
          </Reveal>
        )}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   10 · FOOTER — bgDarkAlt, 4 colonnes, en-têtes gold
   ════════════════════════════════════════════════════════════════════════════ */
function Footer() {
  const footerCols: { title: string; items: { label: string; href: string }[] }[] =
    [
      {
        title: 'Le Studio',
        items: [
          { label: 'Notre ADN', href: '#studio' },
          { label: 'Nos artistes', href: '#artistes' },
          { label: 'Hygiène & protocoles', href: '#hygiene' },
          { label: 'Réservation', href: '#reservation' },
        ],
      },
      {
        title: 'Styles',
        items: [
          { label: 'Illustration', href: '#styles' },
          { label: 'Neo-traditionnel', href: '#styles' },
          { label: 'Botanica & Gravure', href: '#styles' },
          { label: 'Lettering', href: '#styles' },
        ],
      },
      {
        title: 'Informations',
        items: [
          { label: 'Consultation', href: '#reservation' },
          { label: 'Tarifs & devis', href: '#reservation' },
          { label: 'Cicatrisation', href: '#hygiene' },
          { label: 'FAQ', href: '#reservation' },
        ],
      },
      {
        title: 'Contact',
        items: [
          { label: 'Paris 3e Marais', href: '#reservation' },
          { label: 'Sur rendez-vous', href: '#reservation' },
          { label: 'studio@noirAbsolu.fr', href: 'mailto:studio@noirAbsolu.fr' },
          { label: 'Instagram', href: "/templates/impact-262" },
        ],
      },
    ];

  const foot: React.CSSProperties = {
    background: C.bgDarkAlt,
    borderTop: `1px solid rgba(232,192,96,0.14)`,
    padding:
      'clamp(70px,9vw,110px) clamp(24px,6vw,96px) 40px',
  };

  return (
    <footer style={foot}>
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.3fr repeat(3, 1fr)',
          gap: 'clamp(36px,4vw,64px)',
        }}
        className="sna-footgrid"
      >
        {/* Brand col */}
        <div>
          <div
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: 'clamp(18px,1.8vw,24px)',
              color: C.white,
              marginBottom: 16,
            }}
          >{fd?.businessName ?? "Studio Noir Absolu"}</div>
          <p
            style={{
              fontFamily: SANS,
              fontWeight: 300,
              fontSize: 13.5,
              lineHeight: 1.7,
              color: 'rgba(255,255,255,0.50)',
              maxWidth: 280,
              marginBottom: 22,
            }}
          >
            Tatouage Fine Art & Illustration sur mesure. Paris 3e Marais, sur
            rendez-vous uniquement.
          </p>
          <div
            style={{
              display: 'flex',
              gap: 6,
              flexWrap: 'wrap',
            }}
          >
            {['Illustration', 'Neo-Trad', 'Botanica'].map((tag) => (
              <span
                key={tag}
                style={{
                  fontFamily: SANS,
                  fontSize: 9.5,
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase',
                  color: C.accent,
                  border: `1px solid rgba(232,192,96,0.30)`,
                  padding: '4px 10px',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Link cols */}
        {footerCols.map((col) => (
          <div key={col.title}>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 10,
                letterSpacing: '0.32em',
                textTransform: 'uppercase',
                color: C.accent,
                fontWeight: 500,
                marginBottom: 20,
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
                  <a
                    href={it.href}
                    style={{
                      fontFamily: SANS,
                      fontWeight: 300,
                      fontSize: 14,
                      color: 'rgba(255,255,255,0.62)',
                      textDecoration: 'none',
                      transition: 'color .3s',
                    }}
                    onMouseEnter={(e) =>
                      ((e.target as HTMLElement).style.color = C.accent)
                    }
                    onMouseLeave={(e) =>
                      ((e.target as HTMLElement).style.color =
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

      {/* Bottom bar */}
      <div
        style={{
          maxWidth: 1280,
          margin: '60px auto 0',
          paddingTop: 28,
          borderTop: `1px solid rgba(232,192,96,0.12)`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
          fontFamily: SANS,
          fontWeight: 300,
          fontSize: 11,
          letterSpacing: '0.10em',
          color: 'rgba(255,255,255,0.36)',
        }}
      >
        <span>
          © 2026 Studio Noir Absolu. Paris 3e Marais. Tous droits réservés.
        </span>
        <span style={{ display: 'flex', gap: 22 }}>
          <a
            href="/templates/impact-262"
            style={{ color: 'inherit', textDecoration: 'none' }}
          >
            Mentions légales
          </a>
          <a
            href="/templates/impact-262"
            style={{ color: 'inherit', textDecoration: 'none' }}
          >
            Confidentialité
          </a>
          <a
            href="/templates/impact-262"
            style={{ color: 'inherit', textDecoration: 'none' }}
          >
            CGV
          </a>
        </span>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .sna-footgrid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 500px) {
          .sna-footgrid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   PAGE — assemblage
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
    background: C.bgDark,
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
      {/* Google Fonts */}
      <style>{`@import url('${FONTS_URL}');`}</style>

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
