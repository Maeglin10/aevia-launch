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
import { ArrowRight, ChevronDown, PenLine } from 'lucide-react';

/* ════════════════════════════════════════════════════════════════════════════
   ATELIER ENCRE VIVANTE — Tatouage Contemporain & Art Corporel · Lyon 1er
   Chorégraphie de défilement éditoriale : crossfade 320vh, panneau latéral
   collant, formulaire de réservation. Auto-suffisant. 'use client'.
   ════════════════════════════════════════════════════════════════════════════ */

/* ── Google Fonts ─────────────────────────────────────────────────────────── */
const FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Karla:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap';

/* ── Palette ─────────────────────────────────────────────────────────────── */
const C = {
  bg: '#f5f3ef',
  bgAlt: '#eae6df',
  bgDark: '#0c0a08',
  bgDarkAlt: '#060504',
  bgCard: '#ffffff',
  accent: '#d45c20',
  accentDark: '#aa4818',
  accentLight: '#f8dac8',
  white: '#ffffff',
  ink: '#0c0a08',
  textMuted: '#3c2c20',
  textFaint: '#8a7060',
  border: '#ddd4c8',
  borderDark: 'rgba(212,92,32,0.2)',
  charcoal: '#505050',
} as const;

const SERIF = "'Abril Fatface', Georgia, serif" as const;
const SANS = "'Karla', system-ui, sans-serif" as const;

/* ── Easing partagé ──────────────────────────────────────────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ════════════════════════════════════════════════════════════════════════════
   Interfaces TypeScript
   ════════════════════════════════════════════════════════════════════════════ */

interface Style {
  id: string;
  index: string;
  label: string;
  sub: string;
  img: string;
}

interface Artist {
  name: string;
  specialty: string;
  img: string;
  since: string;
}

interface EditRow {
  eyebrow: string;
  title: React.ReactNode;
  body: string;
  img: string;
  alt: string;
  reverse: boolean;
}

interface Testimonial {
  quote: string;
  name: string;
  context: string;
}

interface SafetyItem {
  number: string;
  title: string;
  body: string;
}

/* ════════════════════════════════════════════════════════════════════════════
   DATA
   ════════════════════════════════════════════════════════════════════════════ */

const PHOTO_BASE = 'https://images.unsplash.com/photo-';

const STYLES: Style[] = [
  {
    id: 'geo',
    index: 'I',
    label: 'GÉOMÉTRIQUE',
    sub: 'Mandalas, polyèdres, lignes sacrées — précision mathématique et symbolisme dans chaque composition.',
    img: `${PHOTO_BASE}1611501579-4d7dc8532cc1?q=80&w=1600&auto=format&fit=crop`,
  },
  {
    id: 'veg',
    index: 'II',
    label: 'VÉGÉTAL & BOTANIQUE',
    sub: "Fleurs, feuilles, branches — l'encre noire qui capture la vie organique avec une finesse extrême.",
  img: `${PHOTO_BASE}1547036967-23136a0f3b86?q=80&w=1600&auto=format&fit=crop`,
  },
  {
    id: 'por',
    index: 'III',
    label: 'PORTRAITURE',
    sub: "Visages, yeux, expressions — le réalisme psychologique au service d'un tatouage qui vous représente.",
    img: `${PHOTO_BASE}1567401893-56e3d64e7b2c?q=80&w=1600&auto=format&fit=crop`,
  },
];

const ARTISTS: Artist[] = [
  {
    name: 'ELENA',
    specialty: 'Géométrique & Mandala',
    img: `${PHOTO_BASE}1611501579-4d7dc8532cc1?q=80&w=800&auto=format&fit=crop`,
    since: 'Depuis 2016',
  },
  {
    name: 'LUCAS',
    specialty: 'Botanique & Fineline',
    img: `${PHOTO_BASE}1547036967-23136a0f3b86?q=80&w=800&auto=format&fit=crop`,
    since: 'Depuis 2018',
  },
  {
    name: 'MIRA',
    specialty: 'Portraiture réaliste',
    img: `${PHOTO_BASE}1567401893-56e3d64e7b2c?q=80&w=800&auto=format&fit=crop`,
    since: 'Depuis 2014',
  },
  {
    name: 'SAMUEL',
    specialty: 'Abstract & Watercolor',
    img: `${PHOTO_BASE}1611501579-4d7dc8532cc1?q=80&w=800&auto=format&fit=crop`,
    since: 'Depuis 2020',
  },
];

const EDIT_ROWS: EditRow[] = [
  {
    eyebrow: "L'atelier",
    title: (
      <>
        Art /{' '}
        <span style={{ fontStyle: 'italic' }}>sans compromis.</span>
      </>
    ),
    body: "Au cœur des Pentes de la Croix-Rousse, notre galerie-atelier accueille chaque client avec une consultation d'au moins une heure. Aucun flash, aucun copié-collé — chaque tatouage est un dessin original pensé pour vous, une seule fois.",
    img: `${PHOTO_BASE}1611501579-4d7dc8532cc1?q=80&w=800&auto=format&fit=crop`,
    alt: "Vue de l'atelier Encre Vivante à Lyon",
    reverse: false,
  },
  {
    eyebrow: 'Lyon',
    title: (
      <>
        La Croix-Rousse /{' '}
        <span style={{ fontStyle: 'italic' }}>rebelle.</span>
      </>
    ),
    body: "Nous avons choisi les Pentes pour leur ADN : artisanat, indépendance, créativité. Nos clients viennent de toute la France et du monde entier pour un rendez-vous qui peut se réserver six mois à l'avance. La rareté, c'est une forme de respect.",
    img: `${PHOTO_BASE}1547036967-23136a0f3b86?q=80&w=800&auto=format&fit=crop`,
    alt: 'Vue des Pentes de la Croix-Rousse à Lyon',
    reverse: true,
  },
];

const SAFETY_ITEMS: SafetyItem[] = [
  {
    number: '01',
    title: 'Matériel stérile à usage unique',
    body: 'Chaque aiguille, chaque cartouche et chaque consommable est neuf et détruit après votre session. Jamais réutilisé.',
  },
  {
    number: '02',
    title: 'Encres vegan sans métaux lourds',
    body: 'Toutes nos encres sont certifiées ISO 21388, exemptes de métaux lourds et de composés allergènes. Sans cruauté animale.',
  },
  {
    number: '03',
    title: 'Espace stérilisé autoclave',
    body: "Nos postes de travail sont stérilisés à l'autoclave avant chaque client. Les surfaces sont désinfectées avec des produits hospitaliers.",
  },
  {
    number: '04',
    title: 'Suivi de cicatrisation inclus',
    body: "Un rendez-vous de contrôle J+7 et J+21 est inclus dans chaque prestation. Nous répondons à vos questions tout au long de la guérison.",
  },
];

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "J'avais une idée vague en tête — quelque chose de géométrique dans le dos, inspiré de l'astronomie. Elena a passé 90 minutes à traduire mes envies en un dessin que je n'aurais jamais imaginé seule. Après 8 séances, le résultat est absolument hors du commun. La précision géométrique est à couper le souffle.",
    name: 'Camille R.',
    context: 'Sleeve géométrique — 8 séances avec Elena',
  },
  {
    quote:
      "J'ai apporté la seule photo de mon père que j'avais — une photo floue des années 80. Mira a regardé l'image en silence, puis m'a dit : 'Je vais capturer ce qu'il y a derrière ses yeux.' Elle a réussi. Chaque fois que je baisse les yeux sur ce portrait, j'ai l'impression qu'il est là.",
    name: 'Thomas B.',
    context: 'Portrait — séance unique avec Mira',
  },
];

/* ════════════════════════════════════════════════════════════════════════════
   Primitives partagées
   ════════════════════════════════════════════════════════════════════════════ */

/** Étiquette fine, capitales, interlettrage, filet accent. */
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
    width: 36,
    height: 1,
    background: color,
    opacity: dark ? 0.5 : 0.7,
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
      transition={{ duration: 1.05, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Bouton accent, filet fin, flèche qui glisse au survol. */
function AccentButton({
  children,
  onClick,
  filled = false,
  type = 'button',
  dark = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  filled?: boolean;
  type?: 'button' | 'submit';
  dark?: boolean;
}) {
  const [hover, setHover] = useState(false);
  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 12,
    padding: '15px 32px',
    fontFamily: SANS,
    fontSize: 12,
    letterSpacing: '0.24em',
    textTransform: 'uppercase',
    fontWeight: 600,
    cursor: 'pointer',
    border: `1.5px solid ${C.accent}`,
    background: filled ? C.accent : 'transparent',
    color: filled ? C.white : dark ? C.white : C.accent,
    transition: 'all .45s cubic-bezier(.16,1,.3,1)',
  };
  const hov: React.CSSProperties = hover
    ? filled
      ? { background: C.accentDark, borderColor: C.accentDark, transform: 'translateY(-2px)' }
      : { background: 'rgba(212,92,32,0.08)', transform: 'translateY(-2px)' }
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
   1 · NAV — transparente → sombre au défilement
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
    { label: "L'Atelier", href: '#atelier' },
    { label: 'Hygiène', href: '#hygiene' },
    { label: 'Témoignages', href: '#temoignages' },
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
    background: solid ? 'rgba(12,10,8,0.97)' : 'transparent',
    backdropFilter: solid ? 'blur(16px) saturate(140%)' : 'none',
    WebkitBackdropFilter: solid ? 'blur(16px) saturate(140%)' : 'none',
    borderBottom: solid
      ? `1px solid rgba(212,92,32,0.2)`
      : '1px solid transparent',
    transition: 'all .55s cubic-bezier(.16,1,.3,1)',
  };

  const brand: React.CSSProperties = {
    fontFamily: SERIF,
    fontSize: 20,
    color: C.white,
    letterSpacing: '0.01em',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    textDecoration: 'none',
  };

  const linkRow: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'clamp(18px,2.4vw,40px)',
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
            <PenLine size={18} color={C.accent} strokeWidth={1.5} />
            Atelier Encre Vivante
          </>
        )}
      </a>
      <div style={linkRow} className="ev-navlinks">
        {navLinks.map((l) => (
          <NavLink key={l.label} label={l.label} href={l.href} />
        ))}
      </div>
      <div className="ev-navcta">
        <a href="#reservation" style={{ textDecoration: 'none' }}>
          <AccentButton filled dark>
            Réserver
          </AccentButton>
        </a>
      </div>
      
        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="ev-burger"
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
          .ev-navlinks { display: none !important; }
          .ev-burger { display: flex !important; flex-direction: column; }
          .ev-navcta { display: none !important; }
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
          {navLinks.map((l) => (
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
        fontSize: 12,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        fontWeight: 500,
        color: h ? C.accent : 'rgba(245,243,239,0.85)',
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
   2 · HERO — 100vh, parallaxe lourd, texte bas-gauche
   ════════════════════════════════════════════════════════════════════════════ */
function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.14]);
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-40%']);
  const textOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);

  const sec: React.CSSProperties = {
    position: 'relative',
    height: '100vh',
    minHeight: 640,
    overflow: 'hidden',
    background: C.bgDark,
  };

  return (
    <section ref={ref} id="hero" style={sec}>
      {/* Photo parallaxe */}
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
          src={`${PHOTO_BASE}1611501579-4d7dc8532cc1?q=80&w=2000&auto=format&fit=crop`}
          alt="Artiste en train de tatouer un motif géométrique"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </motion.div>

      {/* Voiles */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to right, rgba(12,10,8,0.82) 0%, rgba(12,10,8,0.30) 60%, rgba(12,10,8,0.10) 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to top, rgba(12,10,8,0.75) 0%, rgba(12,10,8,0.0) 55%)',
        }}
      />

      {/* Contenu bas-gauche */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: 'clamp(56px, 9vh, 110px)',
          left: 'clamp(24px, 6vw, 100px)',
          right: 'clamp(24px, 6vw, 100px)',
          zIndex: 2,
          y: textY,
          opacity: textOpacity,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, ease: EASE, delay: 0 }}
        >
          <Eyebrow color={C.accent} align="left">
            Tatouage · Lyon Croix-Rousse
          </Eyebrow>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.12 }}
          style={{
            fontFamily: SERIF,
            fontWeight: 400,
            color: C.white,
            fontSize: 'clamp(4rem, 10vw, 12rem)',
            lineHeight: 0.85,
            letterSpacing: '-0.01em',
            margin: 'clamp(20px, 3vh, 36px) 0 clamp(18px, 2.5vh, 28px)',
            textShadow: '0 12px 60px rgba(0,0,0,0.6)',
            maxWidth: '14ch',
          }}
        >
          Encre /{' '}
          <span style={{ color: C.accent }}>vivante.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.38 }}
          style={{
            fontFamily: SANS,
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: 'clamp(16px, 1.8vw, 22px)',
            color: 'rgba(245,243,239,0.80)',
            maxWidth: 520,
            lineHeight: 1.65,
            marginBottom: 'clamp(28px, 4vh, 48px)',
          }}
        >
          Art corporel sur-mesure. 100 % création originale.
          Chaque tatouage naît d&apos;une conversation unique.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, ease: EASE, delay: 0.58 }}
        >
          <AccentButton filled dark>
            Prendre rendez-vous
          </AccentButton>
        </motion.div>
      </motion.div>

      {/* Indice de défilement */}
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
            letterSpacing: '0.34em',
            textTransform: 'uppercase',
            color: 'rgba(245,243,239,0.55)',
            writingMode: 'vertical-lr',
          }}
        >
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.0, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={18} color={C.accent} strokeWidth={1.5} />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   3 · INTRO — bgAlt, centré, citation SERIF
   ════════════════════════════════════════════════════════════════════════════ */
function Intro() {
  const sec: React.CSSProperties = {
    background: C.bgAlt,
    padding: 'clamp(88px, 13vw, 180px) clamp(24px, 8vw, 160px)',
    textAlign: 'center',
  };
  return (
    <section style={sec} id="intro">
      <Reveal>
        <Eyebrow color={C.textMuted} align="center">
          Notre philosophie
        </Eyebrow>
      </Reveal>
      <Reveal delay={0.1}>
        <p
          style={{
            fontFamily: SERIF,
            fontSize: 'clamp(24px, 3.4vw, 48px)',
            fontWeight: 400,
            lineHeight: 1.30,
            color: C.ink,
            maxWidth: 980,
            margin: 'clamp(24px, 4vw, 44px) auto 0',
          }}
        >
          À Lyon, l&apos;art descend des murs des musées pour{' '}
          <span style={{ color: C.accent }}>vivre sur la peau des gens.</span>
        </p>
      </Reveal>
      <Reveal delay={0.22}>
        <div
          style={{
            width: 1,
            height: 80,
            background: `linear-gradient(${C.accent}, transparent)`,
            margin: 'clamp(40px, 6vh, 72px) auto 0',
            opacity: 0.5,
          }}
        />
      </Reveal>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   4 · STYLE SEQUENCE — crossfade 320vh collant, 3 styles, dots animés
   ════════════════════════════════════════════════════════════════════════════ */

function StyleImage({
  style: s,
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
        src={s.img}
        alt={`Style ${s.label} — Atelier Encre Vivante`}
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

function StyleLabel({
  style: s,
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
  const y = useTransform(progress, [start, end], [30, -30]);

  return (
    <motion.div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        padding: 'clamp(90px,10vh,130px) clamp(24px,5vw,72px) 0',
        opacity,
        y,
      }}
    >
      <div
        style={{
          textAlign: 'right',
          maxWidth: 360,
        }}
      >
        <div
          style={{
            fontFamily: SANS,
            fontSize: 11,
            letterSpacing: '0.42em',
            textTransform: 'uppercase',
            color: C.accent,
            marginBottom: 12,
          }}
        >
          Style {s.index}
        </div>
        <div
          style={{
            fontFamily: SERIF,
            fontSize: 'clamp(28px, 4vw, 52px)',
            fontWeight: 400,
            color: C.white,
            lineHeight: 1.1,
            textShadow: '0 6px 30px rgba(0,0,0,0.7)',
            marginBottom: 16,
          }}
        >
          {s.label}
        </div>
        <p
          style={{
            fontFamily: SANS,
            fontStyle: 'italic',
            fontSize: 'clamp(14px, 1.4vw, 17px)',
            fontWeight: 300,
            color: 'rgba(245,243,239,0.80)',
            lineHeight: 1.65,
          }}
        >
          {s.sub}
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
      style={{ height: '100vh', overflow: 'hidden', position: 'relative', background: C.bgDark }}
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
            key={s.id}
            style={s}
            i={i}
            total={STYLES.length}
            progress={progress}
          />
        ))}

        {/* Voile global */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to bottom, rgba(12,10,8,0.35), rgba(12,10,8,0.05) 50%, rgba(12,10,8,0.55))',
            pointerEvents: 'none',
          }}
        />

        {/* Labels top-right */}
        {STYLES.map((s, i) => (
          <StyleLabel
            key={s.id}
            style={s}
            i={i}
            total={STYLES.length}
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
            zIndex: 4,
          }}
        >
          {STYLES.map((s, i) => (
            <ProgressDot
              key={s.id}
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
   5 · ARTIST CARDS — bgAlt, 4 cartes, badge nom en orange
   ════════════════════════════════════════════════════════════════════════════ */

function ArtistCard({ artist, i }: { artist: Artist; i: number }) {
  const [hover, setHover] = useState(false);
  const card: React.CSSProperties = {
    background: C.bgCard,
    border: `1px solid ${hover ? C.accent : C.border}`,
    overflow: 'hidden',
    transform: hover ? 'translateY(-10px)' : 'none',
    boxShadow: hover
      ? `0 36px 72px -28px rgba(12,10,8,0.22), 0 0 0 1px ${C.accent}22`
      : '0 8px 32px -20px rgba(12,10,8,0.14)',
    transition: 'all .55s cubic-bezier(.16,1,.3,1)',
    cursor: 'default',
  };

  return (
    <Reveal delay={i * 0.1} style={{ height: '100%' }}>
      <article
        style={card}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            aspectRatio: '3 / 4',
          }}
        >
          <img
            src={artist.img}
            alt={`${artist.name} — tatoueur(euse) Encre Vivante`}
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: hover ? 'scale(1.06)' : 'scale(1)',
              transition: 'transform 1s cubic-bezier(.16,1,.3,1)',
              display: 'block',
            }}
          />
          {/* Voile bas */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to top, rgba(12,10,8,0.72) 0%, transparent 55%)',
            }}
          />
          {/* Badge nom */}
          <div
            style={{
              position: 'absolute',
              bottom: 18,
              left: 18,
              background: C.accent,
              color: C.white,
              fontFamily: SERIF,
              fontSize: 22,
              padding: '6px 14px',
              letterSpacing: '0.04em',
            }}
          >
            {artist.name}
          </div>
        </div>
        <div style={{ padding: '22px 22px 26px' }}>
          <div
            style={{
              fontFamily: SANS,
              fontSize: 11,
              letterSpacing: '0.26em',
              textTransform: 'uppercase',
              color: C.accent,
              marginBottom: 8,
              fontWeight: 500,
            }}
          >
            {artist.specialty}
          </div>
          <div
            style={{
              fontFamily: SANS,
              fontSize: 12,
              color: C.textFaint,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
            }}
          >
            {artist.since}
          </div>
        </div>
      </article>
    </Reveal>
  );
}

function ArtistCards() {
  const sec: React.CSSProperties = {
    background: C.bgAlt,
    padding: 'clamp(88px, 12vw, 160px) clamp(24px, 6vw, 96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: 'clamp(20px, 2.8vw, 40px)',
    maxWidth: 1240,
    margin: '0 auto',
  };

  return (
    <section style={sec} id="artistes">
      <div style={{ maxWidth: 1240, margin: '0 auto clamp(48px,7vw,80px)' }}>
        <Reveal>
          <Eyebrow color={C.textMuted} align="left">
            L&apos;équipe
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.1}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(34px, 5.5vw, 72px)',
              fontWeight: 400,
              color: C.ink,
              margin: 'clamp(16px,2.5vw,28px) 0 0',
              lineHeight: 1.04,
            }}
          >
            Quatre artistes,{' '}
            <span style={{ color: C.accent }}>un seul standard.</span>
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
   6 · EDITORIAL ROWS — bg, 2 rangées alternées image / texte
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

function EditorialRow({ row, index }: { row: EditRow; index: number }) {
  const numStyle: React.CSSProperties = {
    fontFamily: SERIF,
    fontSize: 'clamp(100px, 16vw, 220px)',
    fontWeight: 400,
    color: C.charcoal,
    opacity: 0.08,
    position: 'absolute',
    top: '-0.18em',
    left: row.reverse ? 'auto' : '-0.1em',
    right: row.reverse ? '-0.1em' : 'auto',
    lineHeight: 1,
    userSelect: 'none',
    pointerEvents: 'none',
    zIndex: 0,
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'clamp(36px, 6vw, 96px)',
        alignItems: 'center',
        position: 'relative',
      }}
      className="ev-editrow"
    >
      <Reveal
        y={48}
        style={{
          overflow: 'hidden',
          order: row.reverse ? 2 : 1,
          aspectRatio: '5 / 6',
        }}
      >
        <ParallaxImg src={row.img} alt={row.alt} />
      </Reveal>

      <div
        style={{
          order: row.reverse ? 1 : 2,
          position: 'relative',
        }}
      >
        <span style={numStyle} aria-hidden="true">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Reveal>
            <Eyebrow color={C.textMuted}>{row.eyebrow}</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h3
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(30px, 4.2vw, 58px)',
                fontWeight: 400,
                color: C.ink,
                margin: 'clamp(16px,2.2vw,26px) 0 clamp(18px,2.5vw,30px)',
                lineHeight: 1.08,
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
                fontSize: 'clamp(15px, 1.5vw, 18px)',
                lineHeight: 1.82,
                color: C.textMuted,
                maxWidth: 460,
                marginBottom: 'clamp(24px,3.5vw,40px)',
              }}
            >
              {row.body}
            </p>
          </Reveal>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .ev-editrow { grid-template-columns: 1fr !important; }
          .ev-editrow > * { order: initial !important; }
        }
      `}</style>
    </div>
  );
}

function EditorialRows() {
  const sec: React.CSSProperties = {
    background: C.bg,
    padding: 'clamp(80px, 11vw, 150px) clamp(24px, 6vw, 96px)',
  };
  return (
    <section style={sec} id="atelier">
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(80px, 12vw, 160px)',
        }}
      >
        {EDIT_ROWS.map((r, i) => (
          <EditorialRow key={r.eyebrow} row={r} index={i} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   7 · SAFETY PANEL — bgDark, image sticky gauche, 4 étapes qui défilent
   ════════════════════════════════════════════════════════════════════════════ */
function SafetyPanel() {
  const sec: React.CSSProperties = {
    background: C.bgDark,
    padding: 'clamp(80px, 11vw, 150px) clamp(24px, 6vw, 96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '0.85fr 1.15fr',
    gap: 'clamp(40px, 6vw, 100px)',
    maxWidth: 1240,
    margin: '0 auto',
    alignItems: 'start',
  };
  const stickyImg: React.CSSProperties = {
    position: 'sticky',
    top: 90,
    alignSelf: 'start',
  };

  return (
    <section style={sec} id="hygiene">
      <div style={grid} className="ev-safepanel">
        {/* Image sticky gauche */}
        <div style={stickyImg} className="ev-safepanel-sticky">
          <div
            style={{
              overflow: 'hidden',
              border: `1px solid ${C.borderDark}`,
              aspectRatio: '3 / 4',
            }}
          >
            <img
              src={`${PHOTO_BASE}1567401893-56e3d64e7b2c?q=80&w=900&auto=format&fit=crop`}
              alt="Poste de travail stérilisé — Atelier Encre Vivante"
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
              marginTop: 20,
              fontFamily: SANS,
              fontSize: 11,
              letterSpacing: '0.26em',
              textTransform: 'uppercase',
              color: 'rgba(245,243,239,0.40)',
            }}
          >
            Protocole certifié · Lyon 1er
          </div>
        </div>

        {/* Étapes qui défilent, côté droit */}
        <div>
          <Reveal>
            <Eyebrow color={C.accent} dark>
              Hygiène & Sécurité
            </Eyebrow>
          </Reveal>
          <Reveal delay={0.1}>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(32px, 4.8vw, 64px)',
                fontWeight: 400,
                color: C.white,
                margin: 'clamp(16px,2.2vw,28px) 0 clamp(40px,5vw,72px)',
                lineHeight: 1.06,
              }}
            >
              Votre peau mérite{' '}
              <span style={{ color: C.accent }}>le meilleur.</span>
            </h2>
          </Reveal>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {SAFETY_ITEMS.map((item, i) => (
              <Reveal key={item.number} delay={0.06 * i}>
                <div
                  style={{
                    padding: 'clamp(28px,3.5vw,44px) 0',
                    borderTop: `1px solid rgba(212,92,32,0.22)`,
                    display: 'flex',
                    gap: 'clamp(20px,3vw,36px)',
                    alignItems: 'flex-start',
                  }}
                >
                  <span
                    style={{
                      fontFamily: SERIF,
                      fontSize: 'clamp(28px, 3vw, 42px)',
                      color: C.accent,
                      minWidth: '2.2ch',
                      lineHeight: 1,
                      flexShrink: 0,
                      opacity: 0.8,
                    }}
                  >
                    {item.number}
                  </span>
                  <div>
                    <h4
                      style={{
                        fontFamily: SANS,
                        fontWeight: 600,
                        fontSize: 'clamp(15px, 1.6vw, 19px)',
                        color: C.white,
                        margin: '0 0 10px',
                        letterSpacing: '0.01em',
                      }}
                    >
                      {item.title}
                    </h4>
                    <p
                      style={{
                        fontFamily: SANS,
                        fontWeight: 300,
                        fontSize: 'clamp(14px, 1.3vw, 16px)',
                        lineHeight: 1.75,
                        color: 'rgba(245,243,239,0.62)',
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
          .ev-safepanel { grid-template-columns: 1fr !important; }
          .ev-safepanel-sticky { position: static !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   8 · TESTIMONIALS — bg, 2 cartes blanches, icône Plume en orange
   ════════════════════════════════════════════════════════════════════════════ */
function Testimonials() {
  const sec: React.CSSProperties = {
    background: C.bg,
    padding: 'clamp(88px, 12vw, 170px) clamp(24px, 6vw, 96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: 'clamp(28px, 4vw, 56px)',
    maxWidth: 1180,
    margin: '0 auto',
  };

  return (
    <section style={sec} id="temoignages">
      <div style={{ maxWidth: 1180, margin: '0 auto clamp(52px,7vw,80px)', textAlign: 'center' }}>
        <Reveal>
          <Eyebrow color={C.textMuted} align="center">
            Ce qu&apos;ils disent
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.1}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(32px, 5vw, 64px)',
              fontWeight: 400,
              color: C.ink,
              margin: 'clamp(16px,2.2vw,26px) 0 0',
              lineHeight: 1.06,
            }}
          >
            L&apos;encre raconte{' '}
            <span style={{ color: C.accent }}>leurs histoires.</span>
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
                padding: 'clamp(32px, 4vw, 52px)',
                margin: 0,
                height: '100%',
                boxSizing: 'border-box',
                boxShadow: '0 16px 48px -30px rgba(12,10,8,0.18)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <PenLine size={30} color={C.accent} strokeWidth={1.4} />
              <blockquote
                style={{
                  fontFamily: SANS,
                  fontStyle: 'italic',
                  fontWeight: 300,
                  fontSize: 'clamp(16px, 1.7vw, 20px)',
                  lineHeight: 1.72,
                  color: C.ink,
                  margin: 'clamp(20px,3vw,30px) 0 clamp(24px,3.5vw,36px)',
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
                    fontSize: 16,
                    color: C.ink,
                    marginBottom: 6,
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
   9 · BOOKING FORM — bgDark, 720px max, état "envoyé" artistique
   ════════════════════════════════════════════════════════════════════════════ */
function BookingForm() {
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [tel, setTel] = useState('');
  const [styleChoice, setStyleChoice] = useState('');
  const [taille, setTaille] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prenom || !email || !styleChoice) return;
    setSent(true);
  };

  const sec: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    background: C.bgDark,
    padding: 'clamp(96px, 13vw, 180px) clamp(24px, 6vw, 96px)',
  };

  const fieldBase: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    background: 'transparent',
    border: 'none',
    borderBottom: `1px solid rgba(212,92,32,0.30)`,
    padding: '14px 2px',
    fontFamily: SANS,
    fontWeight: 400,
    fontSize: 17,
    color: C.white,
    outline: 'none',
    transition: 'border-color .3s',
    borderRadius: 0,
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 10.5,
    letterSpacing: '0.28em',
    textTransform: 'uppercase',
    fontWeight: 500,
    color: C.accent,
    display: 'block',
    marginBottom: 6,
  };

  if (sent) {
    return (
      <section style={sec} id="reservation">
        {/* Texture de fond subtile */}
        <img
          src={`${PHOTO_BASE}1611501579-4d7dc8532cc1?q=80&w=1600&auto=format&fit=crop`}
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
            <div
              style={{
                border: `1px solid ${C.accent}`,
                padding: 'clamp(44px, 6vw, 72px)',
                background: 'rgba(212,92,32,0.05)',
              }}
            >
              <PenLine size={38} color={C.accent} strokeWidth={1.3} />
              <h3
                style={{
                  fontFamily: SERIF,
                  fontSize: 'clamp(28px, 4vw, 46px)',
                  fontWeight: 400,
                  color: C.white,
                  margin: 'clamp(18px,3vw,28px) 0 clamp(12px,2vw,18px)',
                  lineHeight: 1.1,
                }}
              >
                Merci {prenom},
              </h3>
              <p
                style={{
                  fontFamily: SANS,
                  fontStyle: 'italic',
                  fontWeight: 300,
                  fontSize: 'clamp(15px, 1.6vw, 19px)',
                  color: 'rgba(245,243,239,0.75)',
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                L&apos;équipe vous répond sous 48h pour planifier votre consultation.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    );
  }

  return (
    <section style={sec} id="reservation">
      <img
        src={`${PHOTO_BASE}1567401893-56e3d64e7b2c?q=80&w=1600&auto=format&fit=crop`}
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
          <Eyebrow color={C.accent} align="center" dark>
            Prise de rendez-vous
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.1}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(34px, 5.5vw, 72px)',
              fontWeight: 400,
              color: C.white,
              margin: 'clamp(18px,2.5vw,30px) 0 clamp(14px,2vw,20px)',
              lineHeight: 1.04,
            }}
          >
            Votre projet{' '}
            <span style={{ color: C.accent }}>commence ici.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.18}>
          <p
            style={{
              fontFamily: SANS,
              fontStyle: 'italic',
              fontWeight: 300,
              fontSize: 'clamp(15px, 1.5vw, 18px)',
              lineHeight: 1.72,
              color: 'rgba(245,243,239,0.70)',
              maxWidth: 520,
              margin: '0 auto clamp(44px,6vw,70px)',
            }}
          >
            Remplissez ce formulaire et nous vous contactons sous 48h pour
            organiser une consultation gratuite d&apos;une heure.
          </p>
        </Reveal>

        <Reveal delay={0.24}>
          <form
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'clamp(26px, 3.5vw, 36px)',
              textAlign: 'left',
            }}
          >
            {/* Prénom */}
            <div>
              <label style={labelStyle} htmlFor="ev-prenom">
                Prénom
              </label>
              <input
                id="ev-prenom"
                style={fieldBase}
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                placeholder="Votre prénom"
                autoComplete="given-name"
                required
                suppressHydrationWarning
              />
            </div>

            {/* Email */}
            <div>
              <label style={labelStyle} htmlFor="ev-email">
                Email
              </label>
              <input
                id="ev-email"
                style={fieldBase}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@exemple.fr"
                autoComplete="email"
                required
                suppressHydrationWarning
              />
            </div>

            {/* Téléphone */}
            <div>
              <label style={labelStyle} htmlFor="ev-tel">
                Téléphone
              </label>
              <input
                id="ev-tel"
                style={fieldBase}
                type="tel"
                value={tel}
                onChange={(e) => setTel(e.target.value)}
                placeholder="+33 6 xx xx xx xx"
                autoComplete="tel"
                suppressHydrationWarning
              />
            </div>

            {/* Style */}
            <div>
              <label style={labelStyle} htmlFor="ev-style">
                Style souhaité
              </label>
              <select
                id="ev-style"
                style={{
                  ...fieldBase,
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  cursor: 'pointer',
                  color: styleChoice ? C.white : 'rgba(245,243,239,0.38)',
                }}
                value={styleChoice}
                onChange={(e) => setStyleChoice(e.target.value)}
                required
                suppressHydrationWarning
              >
                <option value="" style={{ color: '#000' }}>
                  Choisissez un style…
                </option>
                {[
                  'Géométrique',
                  'Abstract',
                  'Portraiture',
                  'Végétal',
                  'Script & Lettering',
                  'Autre',
                ].map((s) => (
                  <option key={s} value={s} style={{ color: '#000' }}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Taille */}
            <div>
              <label style={labelStyle} htmlFor="ev-taille">
                Taille approximative
              </label>
              <input
                id="ev-taille"
                style={fieldBase}
                value={taille}
                onChange={(e) => setTaille(e.target.value)}
                placeholder="Ex. : paume de main, avant-bras complet…"
                suppressHydrationWarning
              />
            </div>

            {/* Message */}
            <div>
              <label style={labelStyle} htmlFor="ev-message">
                Votre projet (décrivez votre idée)
              </label>
              <textarea
                id="ev-message"
                style={{
                  ...fieldBase,
                  resize: 'vertical',
                  minHeight: 120,
                  lineHeight: 1.65,
                }}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Décrivez votre tatouage, son emplacement, ce qu'il représente pour vous…"
                rows={4}
                suppressHydrationWarning
              />
            </div>

            {/* Submit */}
            <div style={{ marginTop: 8, textAlign: 'center' }}>
              <AccentButton filled dark type="submit">
                Envoyer ma demande
              </AccentButton>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   10 · FOOTER — bgDarkAlt, 4 colonnes, titres orange
   ════════════════════════════════════════════════════════════════════════════ */
function Footer() {
  const cols: { title: string; items: { label: string; href: string }[] }[] = [
    {
      title: 'Nos styles',
      items: [
        { label: 'Géométrique', href: '#styles' },
        { label: 'Végétal & Botanique', href: '#styles' },
        { label: 'Portraiture', href: '#styles' },
        { label: 'Abstract & Watercolor', href: '#styles' },
      ],
    },
    {
      title: "L'équipe",
      items: [
        { label: 'Elena', href: '#artistes' },
        { label: 'Lucas', href: '#artistes' },
        { label: 'Mira', href: '#artistes' },
        { label: 'Samuel', href: '#artistes' },
      ],
    },
    {
      title: 'Infos pratiques',
      items: [
        { label: "Notre atelier", href: '#atelier' },
        { label: 'Hygiène & Sécurité', href: '#hygiene' },
        { label: 'Témoignages', href: '#temoignages' },
        { label: 'Prendre RDV', href: '#reservation' },
      ],
    },
  ];

  const foot: React.CSSProperties = {
    background: C.bgDarkAlt,
    borderTop: `1px solid rgba(212,92,32,0.15)`,
    padding: 'clamp(64px, 9vw, 110px) clamp(24px, 6vw, 96px) 40px',
  };

  return (
    <footer id="contact" style={foot}>
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.4fr repeat(3, 1fr)',
          gap: 'clamp(36px, 5vw, 70px)',
        }}
        className="ev-footgrid"
      >
        {/* Colonne marque */}
        <div>
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 22,
              color: C.white,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 20,
            }}
          >
            <PenLine size={20} color={C.accent} strokeWidth={1.4} />
            Atelier Encre Vivante
          </div>
          <p
            style={{
              fontFamily: SANS,
              fontStyle: 'italic',
              fontWeight: 300,
              fontSize: 15,
              lineHeight: 1.72,
              color: 'rgba(245,243,239,0.55)',
              maxWidth: 300,
              marginBottom: 22,
            }}
          >
            Tatouage contemporain & art corporel.
            Pentes de la Croix-Rousse — Lyon 1er.
          </p>
          <div
            style={{
              fontFamily: SANS,
              fontSize: 11,
              letterSpacing: '0.20em',
              textTransform: 'uppercase',
              color: 'rgba(245,243,239,0.38)',
            }}
          >
            Sur rendez-vous uniquement
          </div>
        </div>

        {/* Colonnes de navigation */}
        {cols.map((c) => (
          <div key={c.title}>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 11,
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                fontWeight: 600,
                color: C.accent,
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
                gap: 12,
              }}
            >
              {c.items.map((it) => (
                <li key={it.label}>
                  <FooterLink label={it.label} href={it.href} />
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
          margin: 'clamp(48px,7vw,80px) auto 0',
          paddingTop: 26,
          borderTop: `1px solid rgba(212,92,32,0.12)`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 14,
          fontFamily: SANS,
          fontSize: 11,
          letterSpacing: '0.10em',
          color: 'rgba(245,243,239,0.35)',
        }}
      >
        <span>
          © 2024–2026 Atelier Encre Vivante — Tous droits réservés
        </span>
        <span style={{ display: 'flex', gap: 24 }}>
          <a href="#hygiene" style={{ color: 'inherit', textDecoration: 'none' }}>
            Mentions légales
          </a>
          <a href="#hygiene" style={{ color: 'inherit', textDecoration: 'none' }}>
            Confidentialité
          </a>
        </span>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .ev-footgrid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 520px) {
          .ev-footgrid { grid-template-columns: 1fr !important; }
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
        fontWeight: 400,
        fontSize: 15,
        color: h ? 'rgba(245,243,239,0.90)' : 'rgba(245,243,239,0.56)',
        textDecoration: 'none',
        transition: 'color .3s',
      }}
    >
      {label}
    </a>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   PAGE — composition
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
    <main style={root} suppressHydrationWarning>
      {/* Google Fonts */}
      <style>{`@import url('${FONTS_URL}');`}</style>

      {/* Réinitialisation minimale */}
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: ${C.bgDark}; }
        input, select, textarea, button {
          font-family: inherit;
          -webkit-text-size-adjust: 100%;
          font-size: max(16px, 1em);
        }
        @media (max-width: 860px) {
          .ev-editrow { grid-template-columns: 1fr !important; }
          .ev-editrow > * { order: initial !important; }
          .ev-safepanel { grid-template-columns: 1fr !important; }
          .ev-safepanel-sticky { position: static !important; }
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
