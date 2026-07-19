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

// Hoisted above the design tokens: several templates read `brand` in a
// module-level const — declaring it lower caused a TDZ ReferenceError (500).
let brand: any = null;

/* ════════════════════════════════════════════════════════════════════════════
   MAISON BRÛLOT — Boulangerie-Pâtisserie Artisanale · Lyon 1er
   Photographie Unsplash + chorégraphie de défilement éditoriale
   (style boulangerie premium × typographie chapitrée). Auto-suffisant.
   ════════════════════════════════════════════════════════════════════════════ */

/* ── Google Fonts injection ──────────────────────────────────────────────── */
const FONTS_CSS = `@import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Nunito:wght@300;400;500;600&display=swap');`;

/* ── Palette ─────────────────────────────────────────────────────────────── */
const C = {
  bg: '#faf5ee',
  bgAlt: '#f0e8d8',
  bgDark: '#1c1008',
  bgDarkAlt: '#140c06',
  bgCard: '#ffffff',
  accent: '#b85c2b',
  accentDark: '#8f4520',
  accentLight: '#f5dcc8',
  white: '#ffffff',
  ink: '#1c1008',
  textMuted: '#5c3d20',
  textFaint: '#9a7050',
  border: '#e0d0b8',
  borderDark: 'rgba(184,92,43,0.2)',
  gold: '#c8901e',
} as const;

const SERIF = "'Libre Baskerville', Georgia, serif" as const;
const SANS = "'Nunito', system-ui, sans-serif" as const;

/* ── Easing partagé ──────────────────────────────────────────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ── Photo helper ────────────────────────────────────────────────────────── */
const unsplash = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?q=80&w=${w}&auto=format&fit=crop`;

/* ── Data interfaces ─────────────────────────────────────────────────────── */
interface CraftPhase {
  img: string;
  index: string;
  title: string;
  body: string;
}

interface Specialty {
  name: string;
}

interface EditRow {
  eyebrow: string;
  img: string;
  imgAlt: string;
  titleLine1: string;
  titleLine2: string;
  body: string;
  reverse: boolean;
  romanNumeral: string;
}

interface CraftStep {
  num: string;
  body: string;
}

interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

/* ── Data ────────────────────────────────────────────────────────────────── */
const PHASES: CraftPhase[] = [
  {
    img: unsplash('1509440159258-1c1c3e5f3f5b'),
    index: 'I',
    title: 'LA PÂTE',
    body: 'Farine Label Rouge, levain naturel de 8 ans, pétrissage à la main. Rien ne presse quand on fait bien.',
  },
  {
    img: unsplash('1558618666-fcd25c85cd64'),
    index: 'II',
    title: 'LA CUISSON',
    body: "Four à sole, 250°C, enfournement à 5h du matin. La croûte se forme dans le premier quart d'heure.",
  },
  {
    img: unsplash('1549931319-a545dcf3bc7b'),
    index: 'III',
    title: 'LA VIENNOISERIE',
    body: 'Croissants feuilletés 27 tours, brioches pur beurre AOP, pain au chocolat à la couverture Barry.',
  },
];

const SPECIALTIES: Specialty[] = [
  { name: 'Pain de campagne au levain' },
  { name: 'Baguette de tradition' },
  { name: 'Croissant pur beurre AOP' },
  { name: 'Brioche tressée maison' },
  { name: 'Tarte aux fruits de saison' },
  { name: 'Cake personnalisé' },
];

const EDIT_ROWS: EditRow[] = [
  {
    eyebrow: 'Notre philosophie',
    img: unsplash('1509440159258-1c1c3e5f3f5b', 800),
    imgAlt: 'Boulanger pétrissant la pâte à la main',
    titleLine1: 'Lenteur /',
    titleLine2: 'assumée.',
    body: 'Fermentation lente de 18 heures, sans additif, sans levure de boulanger. Notre levain a 8 ans — il est la mémoire de la maison. Chaque fournée est une décision, pas une routine.',
    reverse: false,
    romanNumeral: 'I',
  },
  {
    eyebrow: "L'atelier",
    img: unsplash('1549931319-a545dcf3bc7b', 800),
    imgAlt: 'Viennoiseries dorées à la sortie du four',
    titleLine1: 'Lyon 1er, /',
    titleLine2: 'depuis 2011.',
    body: "Boulangerie de quartier ouverte du mardi au dimanche de 7h à 13h, fermée le lundi. Un four, deux boulangers, une règle : ce qui n'est pas parfait ne passe pas le comptoir.",
    reverse: true,
    romanNumeral: 'II',
  },
];

const PROCESS_STEPS: CraftStep[] = [
  { num: '01', body: 'Autolyse 1h, hydratation 72%, farines bio sélectionnées' },
  { num: '02', body: 'Levain naturel actif — aucune levure de boulanger' },
  { num: '03', body: 'Fermentation longue, 16 à 18h en chambre froide' },
  { num: '04', body: 'Cuisson sur sole réfractaire, vapeur naturelle' },
];

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "J'ai déménagé dans le 6e il y a deux ans, mais le samedi matin je traverse Lyon pour venir chercher mon pain. Ce levain, c'est une addiction honnête.",
    name: 'Camille R.',
    role: 'Cliente fidèle · Lyon',
  },
  {
    quote:
      "Je commande chaque semaine pour la table de mon restaurant. Mes clients le remarquent immédiatement — c'est le niveau de régularité que je cherchais.",
    name: 'Thomas M.',
    role: 'Chef restaurateur · Lyon 2e',
  },
];

/* ════════════════════════════════════════════════════════════════════════════
   Primitives partagées
   ════════════════════════════════════════════════════════════════════════════ */

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

/** Étiquette fine, capitales, interlettrage large. */
function Eyebrow({
  children,
  color = C.accent,
  align = 'left',
}: {
  children: React.ReactNode;
  color?: string;
  align?: 'left' | 'center';
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        justifyContent: align === 'center' ? 'center' : 'flex-start',
      }}
    >
      <span style={{ width: 40, height: 1, background: color, opacity: 0.7 }} />
      <span
        style={{
          fontFamily: SANS,
          fontSize: 11,
          letterSpacing: '0.40em',
          textTransform: 'uppercase',
          color,
          fontWeight: 600,
        }}
      >
        {children}
      </span>
      {align === 'center' && (
        <span style={{ width: 40, height: 1, background: color, opacity: 0.7 }} />
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   1 · NAV
   ════════════════════════════════════════════════════════════════════════════ */
function Nav() {
  const [solid, setSolid] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoverCta, setHoverCta] = useState(false);

  React.useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: 'Pains & Viennoiseries', href: '#specialites' },
    { label: "L'atelier", href: '#atelier' },
    { label: 'Commandes', href: '#commande' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <>
      <nav
      style={{
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
        background: solid ? 'rgba(28,16,8,0.95)' : 'transparent',
        backdropFilter: solid ? 'blur(16px) saturate(130%)' : 'none',
        WebkitBackdropFilter: solid ? 'blur(16px) saturate(130%)' : 'none',
        borderBottom: solid
          ? `1px solid rgba(184,92,43,0.25)`
          : '1px solid transparent',
        transition: 'all .55s cubic-bezier(.16,1,.3,1)',
      }}
    >
      {/* Brand */}
      <a
        href="#craft"
        style={{
          fontFamily: SERIF,
          fontSize: 20,
          letterSpacing: '0.08em',
          color: C.bg,
          textDecoration: 'none',
          fontWeight: 700,
          lineHeight: 1,
        }}
      >
        {fd?.logoBase64 ? (
          // Client logo (uploaded in the brief) replaces the placeholder mark —
          // essential for the client to recognise their brand in the render.
          <img
            src={fd.logoBase64}
            alt={fd?.businessName ?? 'logo'}
            style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
          />
        ) : (
          fd?.businessName ?? "Maison Brûlot"
        )}
      </a>

      {/* Links */}
      <div
        className="mb-navlinks"
        style={{ display: 'flex', alignItems: 'center', gap: 'clamp(18px,2.2vw,36px)' }}
      >
        {navLinks.map((l) => (
          <NavLink key={l.label} label={l.label} href={l.href} />
        ))}
      </div>

      {/* CTA */}
      <a
        href="#commande"
        className="mb-navlinks"
        onMouseEnter={() => setHoverCta(true)}
        onMouseLeave={() => setHoverCta(false)}
        style={{
          fontFamily: SANS,
          fontSize: 11.5,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          fontWeight: 600,
          padding: '12px 24px',
          background: hoverCta ? C.accentDark : C.accent,
          color: C.white,
          textDecoration: 'none',
          transition: 'background .4s',
        }}
      >
        Commander
      </a>

      
        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="mb-burger"
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
          .mb-navlinks { display: none !important; }
          .mb-burger { display: flex !important; flex-direction: column; }
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
        fontSize: 11.5,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        fontWeight: 500,
        color: h ? C.accentLight : 'rgba(250,245,238,0.88)',
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
          transition: 'width .5s cubic-bezier(.16,1,.3,1)',
        }}
      />
    </a>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   2 · HERO — 100vh, parallax scale + imgY
   ════════════════════════════════════════════════════════════════════════════ */
function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '16%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-44%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.72], [1, 0]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const [h1Hover, setH1Hover] = useState(false);

  return (
    <section
      ref={ref}
      style={{
        position: 'relative',
        height: '100dvh',
        minHeight: 640,
        overflow: 'hidden',
        background: C.bgDark,
      }}
    >
      {/* Photo parallaxe */}
      <motion.div
        style={{
          position: 'absolute',
          inset: '-8% 0 0 0',
          height: '118%',
          scale: imgScale,
          y: imgY,
        }}
      >
        <img
          src={unsplash('1509440159258-1c1c3e5f3f5b', 2000)}
          alt="Boulanger pétrissant la pâte à la Maison Brûlot"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </motion.div>

      {/* Scrims */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(28,16,8,0.40) 0%, rgba(28,16,8,0.06) 34%, rgba(28,16,8,0.38) 66%, rgba(28,16,8,0.92) 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(130% 90% at 30% 60%, transparent 35%, rgba(28,16,8,0.50) 100%)',
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
          padding: 'clamp(24px,5vw,80px) clamp(24px,6vw,96px) clamp(64px,8vw,112px)',
          y: contentY,
          opacity: contentOpacity,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.1 }}
        >
          <Eyebrow color={C.accentLight}>Boulangerie artisanale · Lyon 1er</Eyebrow>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.26 }}
          onMouseEnter={() => setH1Hover(true)}
          onMouseLeave={() => setH1Hover(false)}
          style={{
            fontFamily: SERIF,
            fontSize: 'clamp(3.5rem,8vw,10rem)',
            fontStyle: 'italic',
            fontWeight: 400,
            color: C.bg,
            lineHeight: 0.96,
            margin: 'clamp(20px,2.4vw,38px) 0 clamp(18px,2vw,30px)',
            textShadow: '0 12px 56px rgba(0,0,0,0.55)',
            letterSpacing: '-0.01em',
            cursor: 'default',
          }}
        >
          Pain de{' '}
          <span
            style={{
              display: 'block',
              color: h1Hover ? C.accentLight : C.bg,
              transition: 'color .5s',
            }}
          >
            levain.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.5 }}
          style={{
            fontFamily: SANS,
            fontWeight: 300,
            fontSize: 'clamp(16px,1.8vw,21px)',
            color: 'rgba(250,245,238,0.82)',
            maxWidth: 500,
            lineHeight: 1.65,
            marginBottom: 'clamp(30px,4vw,52px)',
          }}
        >
          Levain de 8 ans, farine Label Rouge, pétrissage à la main.
          Chaque fournée depuis 7h du matin — pour que vous arriviez à l'heure.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.7 }}
          style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}
        >
          <HeroButton href="#commande" filled>
            Passer une commande
          </HeroButton>
          <HeroButton href="#specialites">
            Nos pains
          </HeroButton>
        </motion.div>
      </motion.div>

      {/* Cue défilement */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: 36,
          right: 'clamp(24px,5vw,64px)',
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
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: 'rgba(250,245,238,0.6)',
            writingMode: 'vertical-rl',
          }}
        >
          Défiler
        </span>
        <motion.div
          animate={{ y: [0, 9, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={18} color={C.accentLight} strokeWidth={1.5} />
        </motion.div>
      </motion.div>
    </section>
  );
}

function HeroButton({
  children,
  href,
  filled = false,
}: {
  children: React.ReactNode;
  href: string;
  filled?: boolean;
}) {
  const [h, setH] = useState(false);
  return (
    <a
      href={href}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        padding: '15px 30px',
        fontFamily: SANS,
        fontSize: 12,
        letterSpacing: '0.24em',
        textTransform: 'uppercase',
        fontWeight: 600,
        border: `1px solid ${filled ? C.accent : 'rgba(250,245,238,0.55)'}`,
        background: filled
          ? h ? C.accentDark : C.accent
          : h ? 'rgba(250,245,238,0.12)' : 'transparent',
        color: filled ? C.white : 'rgba(250,245,238,0.92)',
        textDecoration: 'none',
        transition: 'all .45s cubic-bezier(.16,1,.3,1)',
        transform: h ? 'translateY(-2px)' : 'none',
      }}
    >
      {children}
      <ArrowRight
        size={14}
        style={{
          transform: h ? 'translateX(4px)' : 'none',
          transition: 'transform .45s cubic-bezier(.16,1,.3,1)',
        }}
      />
    </a>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   3 · INTRO — citation éditoriale centrée
   ════════════════════════════════════════════════════════════════════════════ */
function Intro() {
  return (
    <section id="hero"
      style={{
        background: C.bgAlt,
        padding: 'clamp(96px,14vw,200px) clamp(24px,8vw,160px)',
        textAlign: 'center',
      }}
    >
      <Reveal>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 36 }}>
          <Eyebrow color={C.textMuted} align="center">La maison</Eyebrow>
        </div>
      </Reveal>
      <Reveal delay={0.1}>
        <p
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 'clamp(24px,3.4vw,48px)',
            lineHeight: 1.36,
            fontWeight: 400,
            maxWidth: 980,
            margin: '0 auto',
            color: C.ink,
            letterSpacing: '-0.005em',
          }}
        >
          La boulangerie artisanale, c'est refuser la vitesse pour retrouver le goût.
        </p>
      </Reveal>
      <Reveal delay={0.2}>
        <div
          style={{
            width: 1,
            height: 88,
            background: `linear-gradient(${C.accent}, transparent)`,
            margin: '54px auto 0',
          }}
        />
      </Reveal>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   4 · CRAFT SEQUENCE — sticky crossfade 320vh
   ════════════════════════════════════════════════════════════════════════════ */
function CraftPhaseLayer({
  phase,
  i,
  total,
  progress,
}: {
  phase: CraftPhase;
  i: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const seg = 1 / total;
  const start = i * seg;
  const end = start + seg;
  const fadeLen = seg * 0.28;

  const opacity = useTransform(
    progress,
    [Math.max(0, start - fadeLen), start, end - fadeLen, Math.min(1, end)],
    i === 0
      ? [1, 1, 1, 0]
      : i === total - 1
        ? [0, 1, 1, 1]
        : [0, 1, 1, 0],
  );
  const scale = useTransform(progress, [start - fadeLen, end], [1.1, 1.0]);

  return (
    <motion.div style={{ position: 'absolute', inset: 0, opacity }}>
      <motion.img
        src={phase.img}
        alt={`Étape artisanale ${phase.index} — ${phase.title}`}
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

function CraftCaption({
  phase,
  i,
  total,
  progress,
}: {
  phase: CraftPhase;
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
        padding: '0 clamp(24px,6vw,80px)',
        opacity,
        y,
      }}
    >
      <span
        style={{
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontSize: 'clamp(38px,8vw,110px)',
          color: 'rgba(200,144,30,0.30)',
          lineHeight: 1,
          marginBottom: 4,
          display: 'block',
        }}
      >
        {phase.index}
      </span>
      <h2
        style={{
          fontFamily: SERIF,
          fontSize: 'clamp(32px,5.5vw,80px)',
          fontWeight: 700,
          letterSpacing: '0.20em',
          color: C.bg,
          lineHeight: 1,
          margin: '0 0 22px',
          textShadow: '0 8px 40px rgba(0,0,0,0.6)',
          textTransform: 'uppercase',
        }}
      >
        {phase.title}
      </h2>
      <p
        style={{
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontSize: 'clamp(15px,1.7vw,20px)',
          color: 'rgba(250,245,238,0.84)',
          maxWidth: 460,
          lineHeight: 1.65,
        }}
      >
        {phase.body}
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
      style={{ height: 2, width, background: C.gold, opacity, borderRadius: 1 }}
    />
  );
}

function CraftSequence() {
  const n = PHASES.length;
  const progress = useMotionValue(0.5 / n);
  const [active, setActive] = useState(0);
  const goTo = (i: number) => {
    setActive(i);
    progress.set((i + 0.5) / n);
  };

  return (
    <section
      id="craft"
      style={{ height: '100dvh', overflow: 'hidden', position: 'relative', background: C.bgDark }}
    >
      <div
        style={{
          position: 'relative',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {/* Couches photo en crossfade */}
        {PHASES.map((p, i) => (
          <CraftPhaseLayer
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
              'linear-gradient(to bottom, rgba(28,16,8,0.28), rgba(28,16,8,0.08) 40%, rgba(28,16,8,0.60))',
          }}
        />

        {/* Captions superposées */}
        {PHASES.map((p, i) => (
          <CraftCaption
            key={p.index}
            phase={p}
            i={i}
            total={PHASES.length}
            progress={progress}
          />
        ))}

        {/* Etiquette section top-right */}
        <div
          style={{
            position: 'absolute',
            top: 'clamp(90px,10vw,120px)',
            right: 'clamp(20px,4vw,56px)',
            zIndex: 4,
          }}
        >
          <Eyebrow color="rgba(250,245,238,0.5)">L'art du pain</Eyebrow>
        </div>

        {/* Points de progression */}
        <div
          style={{
            position: 'absolute',
            bottom: 44,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 12,
            zIndex: 4,
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
   5 · SPECIALTY CARDS — 6 cartes fond blanc, bordure accent gauche
   ════════════════════════════════════════════════════════════════════════════ */
function SpecialtyCard({ item, i }: { item: Specialty; i: number }) {
  const [h, setH] = useState(false);
  return (
    <Reveal delay={i * 0.08}>
      <article
        onMouseEnter={() => setH(true)}
        onMouseLeave={() => setH(false)}
        style={{
          background: C.bgCard,
          borderLeft: `3px solid ${h ? C.accent : C.border}`,
          padding: 'clamp(24px,3vw,38px) clamp(22px,2.8vw,36px)',
          transform: h ? 'translateY(-8px)' : 'none',
          boxShadow: h
            ? '0 28px 60px -30px rgba(28,16,8,0.22)'
            : '0 8px 28px -20px rgba(28,16,8,0.14)',
          transition: 'all .55s cubic-bezier(.16,1,.3,1)',
          cursor: 'default',
        }}
      >
        <div
          style={{
            fontFamily: SANS,
            fontSize: 10,
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: h ? C.accent : C.textFaint,
            marginBottom: 12,
            fontWeight: 600,
            transition: 'color .4s',
          }}
        >{fd?.businessName ?? "Maison Brûlot"}</div>
        <h3
          style={{
            fontFamily: SERIF,
            fontSize: 'clamp(19px,2vw,26px)',
            fontWeight: 400,
            color: C.ink,
            margin: 0,
            lineHeight: 1.25,
          }}
        >
          {item.name}
        </h3>
        <div
          style={{
            marginTop: 18,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            fontFamily: SANS,
            fontSize: 11,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: h ? C.accent : C.textFaint,
            fontWeight: 500,
            transition: 'color .4s',
          }}
        >
          Découvrir
          <ArrowRight
            size={12}
            style={{
              transform: h ? 'translateX(4px)' : 'none',
              transition: 'transform .5s cubic-bezier(.16,1,.3,1)',
            }}
          />
        </div>
      </article>
    </Reveal>
  );
}

function SpecialtyCards() {
  return (
    <section
      id="specialites"
      style={{
        background: C.bg,
        padding: 'clamp(96px,13vw,180px) clamp(24px,6vw,96px)',
      }}
    >
      <div style={{ maxWidth: 1260, margin: '0 auto 60px' }}>
        <Reveal>
          <Eyebrow>Nos spécialités</Eyebrow>
        </Reveal>
        <Reveal delay={0.09}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(36px,5.5vw,74px)',
              fontWeight: 400,
              color: C.ink,
              margin: '20px 0 0',
              lineHeight: 1.06,
            }}
          >
            Du four{' '}
            <span style={{ fontStyle: 'italic', color: C.accent }}>
              au comptoir.
            </span>
          </h2>
        </Reveal>
      </div>
      <div
        style={{
          maxWidth: 1260,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
          gap: 'clamp(16px,2vw,28px)',
        }}
      >
        {SPECIALTIES.map((s, i) => (
          <SpecialtyCard key={s.name} item={s} i={i} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   6 · EDITORIAL ROWS — 2 rangées image / texte avec numéro romain fantôme
   ════════════════════════════════════════════════════════════════════════════ */
function ParallaxImg({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);
  return (
    <div
      ref={ref}
      style={{ width: '100%', height: '100%', overflow: 'hidden' }}
    >
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        style={{
          width: '100%',
          height: '116%',
          objectFit: 'cover',
          display: 'block',
          y,
        }}
      />
    </div>
  );
}

function EditRowItem({ row, i }: { row: EditRow; i: number }) {
  const imgOrder = row.reverse ? 2 : 1;
  const txtOrder = row.reverse ? 1 : 2;
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'clamp(36px,6vw,88px)',
        alignItems: 'center',
        position: 'relative',
      }}
      className="mb-editrow"
    >
      {/* Numéro romain fantôme */}
      <span
        style={{
          position: 'absolute',
          top: '-0.12em',
          left: row.reverse ? 'auto' : '-0.04em',
          right: row.reverse ? '-0.04em' : 'auto',
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontSize: 'clamp(120px,16vw,240px)',
          color: 'rgba(184,92,43,0.06)',
          lineHeight: 1,
          pointerEvents: 'none',
          userSelect: 'none',
          zIndex: 0,
        }}
      >
        {row.romanNumeral}
      </span>

      {/* Image */}
      <Reveal
        y={50}
        delay={0.04}
        style={{
          order: imgOrder,
          overflow: 'hidden',
          aspectRatio: '4 / 5',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <ParallaxImg src={row.img} alt={row.imgAlt} />
      </Reveal>

      {/* Texte */}
      <div style={{ order: txtOrder, position: 'relative', zIndex: 1 }}>
        <Reveal>
          <Eyebrow>{row.eyebrow}</Eyebrow>
        </Reveal>
        <Reveal delay={0.09}>
          <h3
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: 'clamp(30px,4.2vw,60px)',
              fontWeight: 400,
              color: C.ink,
              margin: '20px 0 22px',
              lineHeight: 1.1,
            }}
          >
            {row.titleLine1}
            <br />
            {row.titleLine2}
          </h3>
        </Reveal>
        <Reveal delay={0.17}>
          <p
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(15px,1.55vw,18px)',
              lineHeight: 1.82,
              color: C.textMuted,
              maxWidth: 440,
            }}
          >
            {row.body}
          </p>
        </Reveal>
      </div>
    </div>
  );
}

function EditorialRows() {
  return (
    <section
      id="atelier"
      style={{
        background: C.bg,
        padding: 'clamp(80px,11vw,156px) clamp(24px,6vw,96px)',
      }}
    >
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(80px,11vw,148px)',
        }}
      >
        {EDIT_ROWS.map((r, i) => (
          <EditRowItem key={r.eyebrow} row={r} i={i} />
        ))}
      </div>
      <style>{`
        @media (max-width: 860px) {
          .mb-editrow { grid-template-columns: 1fr !important; }
          .mb-editrow > * { order: initial !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   7 · PROCESS PANEL — image sticky gauche, 4 étapes de process à droite
   ════════════════════════════════════════════════════════════════════════════ */
function ProcessPanel() {
  return (
    <section
      style={{
        background: C.bgDark,
        padding: 'clamp(80px,11vw,150px) clamp(24px,6vw,96px)',
      }}
    >
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '0.92fr 1.08fr',
          gap: 'clamp(40px,6vw,96px)',
          alignItems: 'start',
        }}
        className="mb-processpanel"
      >
        {/* Image sticky */}
        <div
          style={{ position: 'sticky', top: 100, alignSelf: 'start' }}
          className="mb-processpanel-sticky"
        >
          <div
            style={{
              overflow: 'hidden',
              border: `1px solid rgba(184,92,43,0.30)`,
              aspectRatio: '3 / 4',
            }}
          >
            <img
              src={unsplash('1558618666-fcd25c85cd64', 900)}
              alt="Pain en cuisson dans le four à sole de la Maison Brûlot"
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
            <div
              style={{
                fontFamily: SANS,
                fontSize: 10.5,
                letterSpacing: '0.26em',
                textTransform: 'uppercase',
                color: C.gold,
                marginBottom: 8,
                fontWeight: 600,
              }}
            >
              Le four à sole
            </div>
            <div
              style={{
                fontFamily: SERIF,
                fontStyle: 'italic',
                fontSize: 17,
                color: 'rgba(250,245,238,0.72)',
                lineHeight: 1.55,
              }}
            >
              250°C, enfournement à 5h. La croûte naît dans le premier quart d'heure.
            </div>
          </div>
        </div>

        {/* Étapes process */}
        <div>
          <Reveal>
            <Eyebrow color={C.accentLight}>Notre méthode</Eyebrow>
          </Reveal>
          <Reveal delay={0.09}>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(32px,4.8vw,66px)',
                fontWeight: 400,
                color: C.bg,
                margin: '20px 0 56px',
                lineHeight: 1.06,
              }}
            >
              Le process du{' '}
              <span style={{ fontStyle: 'italic', color: C.accentLight }}>
                pain vivant.
              </span>
            </h2>
          </Reveal>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {PROCESS_STEPS.map((s, i) => (
              <Reveal key={s.num} delay={0.06 * i}>
                <div
                  style={{
                    padding: 'clamp(28px,3.5vw,44px) 0',
                    borderTop: `1px solid rgba(184,92,43,0.22)`,
                    display: 'flex',
                    gap: 'clamp(22px,3vw,40px)',
                    alignItems: 'flex-start',
                  }}
                >
                  <span
                    style={{
                      fontFamily: SERIF,
                      fontStyle: 'italic',
                      fontSize: 'clamp(28px,3vw,42px)',
                      color: C.gold,
                      lineHeight: 1,
                      minWidth: 52,
                      flexShrink: 0,
                    }}
                  >
                    {s.num}
                  </span>
                  <p
                    style={{
                      fontFamily: SERIF,
                      fontSize: 'clamp(16px,1.65vw,20px)',
                      lineHeight: 1.7,
                      color: 'rgba(250,245,238,0.78)',
                      margin: 0,
                      paddingTop: 6,
                    }}
                  >
                    {s.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 860px) {
          .mb-processpanel { grid-template-columns: 1fr !important; }
          .mb-processpanel-sticky { position: static !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   8 · TESTIMONIALS — 2 cartes blanches avec étoiles or
   ════════════════════════════════════════════════════════════════════════════ */
function Testimonials() {
  return (
    <section
      style={{
        background: C.bgAlt,
        padding: 'clamp(90px,12vw,170px) clamp(24px,6vw,96px)',
      }}
    >
      <div style={{ maxWidth: 1180, margin: '0 auto 62px', textAlign: 'center' }}>
        <Reveal>
          <Eyebrow color={C.textMuted} align="center">
            Ce qu'ils disent
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.1}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(34px,5vw,66px)',
              fontWeight: 400,
              color: C.ink,
              margin: '20px 0 0',
              lineHeight: 1.06,
            }}
          >
            Paroles de{' '}
            <span style={{ fontStyle: 'italic', color: C.accent }}>
              fidèles.
            </span>
          </h2>
        </Reveal>
      </div>
      <div
        style={{
          maxWidth: 1180,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))',
          gap: 'clamp(28px,3.5vw,52px)',
        }}
      >
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
                boxShadow: '0 20px 56px -38px rgba(28,16,8,0.30)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Étoiles or */}
              <div
                style={{ display: 'flex', gap: 4, marginBottom: 22 }}
                aria-label="5 étoiles"
              >
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star
                    key={s}
                    size={15}
                    fill={C.gold}
                    color={C.gold}
                    strokeWidth={0}
                  />
                ))}
              </div>
              <blockquote
                style={{
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  fontSize: 'clamp(17px,1.85vw,22px)',
                  lineHeight: 1.65,
                  color: C.ink,
                  margin: '0 0 28px',
                  flex: 1,
                }}
              >
                "{t.quote}"
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
                    fontSize: 19,
                    color: C.accent,
                    marginBottom: 4,
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
                    fontWeight: 500,
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
   9 · ORDER FORM — fond bgDark, champs underline uniquement
   ════════════════════════════════════════════════════════════════════════════ */
function OrderForm() {
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [commande, setCommande] = useState('');
  const [date, setDate] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prenom || !email || !commande) return;
    setSent(true);
  };

  const fieldStyle: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    background: 'transparent',
    border: 'none',
    borderBottom: `1px solid rgba(200,144,30,0.38)`,
    padding: '14px 2px',
    fontFamily: SERIF,
    fontSize: 18,
    color: C.bg,
    outline: 'none',
    transition: 'border-color .35s',
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 10.5,
    letterSpacing: '0.26em',
    textTransform: 'uppercase',
    color: C.gold,
    display: 'block',
    marginBottom: 4,
    fontWeight: 600,
  };

  return (
    <section
      id="commande"
      style={{
        background: C.bgDark,
        padding: 'clamp(96px,13vw,180px) clamp(24px,6vw,96px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Motif de fond discret */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(circle at 20% 50%, rgba(184,92,43,0.06) 0%, transparent 50%), radial-gradient(circle at 80% 30%, rgba(200,144,30,0.04) 0%, transparent 40%)',
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
            Commandes spéciales
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.09}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(36px,5.6vw,76px)',
              fontWeight: 400,
              color: C.bg,
              margin: '22px 0 18px',
              lineHeight: 1.06,
            }}
          >
            Sur mesure,{' '}
            <span style={{ fontStyle: 'italic', color: C.accentLight }}>
              pour vous.
            </span>
          </h2>
        </Reveal>
        <Reveal delay={0.17}>
          <p
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: 'clamp(16px,1.65vw,19px)',
              lineHeight: 1.72,
              color: 'rgba(250,245,238,0.78)',
              maxWidth: 520,
              margin: '0 auto 52px',
            }}
          >
            Pièces montées, wedding cakes, plateaux sucrés pour événements.
            Dites-nous ce que vous rêvez — nous verrons ce que la pâte
            peut faire.
          </p>
        </Reveal>

        {sent ? (
          <Reveal>
            <div
              style={{
                border: `1px solid rgba(200,144,30,0.50)`,
                padding: 'clamp(36px,5vw,56px)',
                background: 'rgba(200,144,30,0.06)',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontFamily: SERIF,
                  fontSize: 42,
                  color: C.gold,
                  marginBottom: 18,
                  lineHeight: 1,
                }}
              >
                ✦
              </div>
              <h3
                style={{
                  fontFamily: SERIF,
                  fontSize: 'clamp(24px,3vw,36px)',
                  fontWeight: 400,
                  color: C.bg,
                  margin: '0 0 14px',
                }}
              >
                Merci{prenom ? `, ${prenom}` : ''}, votre commande est notée.
              </h3>
              <p
                style={{
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  fontSize: 17,
                  color: 'rgba(250,245,238,0.76)',
                  margin: 0,
                  lineHeight: 1.65,
                }}
              >
                On vous confirme par retour d'email à{' '}
                <strong style={{ color: C.accentLight, fontStyle: 'normal' }}>
                  {email}
                </strong>{' '}
                dans les 24 heures.
              </p>
            </div>
          </Reveal>
        ) : (
          <Reveal delay={0.24}>
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
                <label htmlFor="mb-prenom" style={labelStyle}>
                  Prénom
                </label>
                <input
                  id="mb-prenom"
                  style={fieldStyle}
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  placeholder="Marie"
                  autoComplete="given-name"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="mb-email" style={labelStyle}>
                  Adresse e-mail
                </label>
                <input
                  id="mb-email"
                  type="email"
                  style={fieldStyle}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="marie@exemple.fr"
                  autoComplete="email"
                  required
                />
              </div>

              {/* Téléphone */}
              <div>
                <label htmlFor="mb-tel" style={labelStyle}>
                  Téléphone
                </label>
                <input
                  id="mb-tel"
                  type="tel"
                  style={fieldStyle}
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  placeholder="06 xx xx xx xx"
                  autoComplete="tel"
                />
              </div>

              {/* Commande */}
              <div>
                <label htmlFor="mb-commande" style={labelStyle}>
                  Type de commande
                </label>
                <select
                  id="mb-commande"
                  style={{
                    ...fieldStyle,
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    cursor: 'pointer',
                    color: commande ? C.bg : 'rgba(250,245,238,0.44)',
                  }}
                  value={commande}
                  onChange={(e) => setCommande(e.target.value)}
                  required
                >
                  <option value="" style={{color: brand ?? '#1c1008' }}>
                    Choisir…
                  </option>
                  <option value="Pièce montée" style={{color: brand ?? '#1c1008' }}>
                    Pièce montée
                  </option>
                  <option value="Buffet sucré" style={{color: brand ?? '#1c1008' }}>
                    Buffet sucré
                  </option>
                  <option value="Wedding cake" style={{color: brand ?? '#1c1008' }}>
                    Wedding cake
                  </option>
                  <option
                    value="Plateau petits-fours"
                    style={{color: brand ?? '#1c1008' }}
                  >
                    Plateau petits-fours
                  </option>
                  <option value="Commande spéciale" style={{color: brand ?? '#1c1008' }}>
                    Commande spéciale
                  </option>
                </select>
              </div>

              {/* Date */}
              <div>
                <label htmlFor="mb-date" style={labelStyle}>
                  Date souhaitée
                </label>
                <input
                  id="mb-date"
                  type="date"
                  style={{
                    ...fieldStyle,
                    colorScheme: 'dark',
                  }}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="mb-message" style={labelStyle}>
                  Message (détails, allergènes…)
                </label>
                <textarea
                  id="mb-message"
                  rows={4}
                  style={{
                    ...fieldStyle,
                    resize: 'vertical',
                    borderBottom: 'none',
                    border: `1px solid rgba(200,144,30,0.30)`,
                    padding: '14px 16px',
                  }}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Décrivez votre commande, nombre de personnes, date…"
                />
              </div>

              {/* Submit */}
              <div style={{ marginTop: 8, textAlign: 'center' }}>
                <SubmitButton />
              </div>
            </form>
          </Reveal>
        )}
      </div>
    </section>
  );
}

function SubmitButton() {
  const [h, setH] = useState(false);
  return (
    <button
      type="submit"
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 12,
        padding: '16px 38px',
        fontFamily: SANS,
        fontSize: 12,
        letterSpacing: '0.24em',
        textTransform: 'uppercase',
        fontWeight: 600,
        background: h ? C.accentDark : C.accent,
        color: C.white,
        border: 'none',
        cursor: 'pointer',
        transition: 'all .45s cubic-bezier(.16,1,.3,1)',
        transform: h ? 'translateY(-2px)' : 'none',
      }}
    >
      Envoyer ma demande
      <ArrowRight
        size={14}
        style={{
          transform: h ? 'translateX(4px)' : 'none',
          transition: 'transform .45s cubic-bezier(.16,1,.3,1)',
        }}
      />
    </button>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   10 · FOOTER — bgDarkAlt, 4 colonnes
   ════════════════════════════════════════════════════════════════════════════ */
function Footer() {
  const cols: { title: string; items: string[] }[] = [
    {
      title: 'Nos pains',
      items: [
        'Pain de campagne',
        'Baguette tradition',
        'Croissant beurre',
        'Brioche tressée',
        'Tarte aux fruits',
      ],
    },
    {
      title: 'Horaires & Accès',
      items: [
        'Mar–Dim : 7h – 13h',
        'Fermé le lundi',
        'Lyon 1er arrondissement',
        'Métro : Hôtel de Ville',
        '04 XX XX XX XX',
      ],
    },
    {
      title: 'Commandes spéciales',
      items: [
        'Pièces montées',
        'Wedding cakes',
        'Buffets sucrés',
        'Plateaux petits-fours',
        'Commander en ligne',
      ],
    },
  ];

  return (
    <footer
      id="contact"
      style={{
        background: C.bgDarkAlt,
        borderTop: `1px solid rgba(184,92,43,0.18)`,
        padding: 'clamp(70px,9vw,110px) clamp(24px,6vw,96px) 40px',
      }}
    >
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.5fr repeat(3, 1fr)',
          gap: 'clamp(32px,4.5vw,66px)',
        }}
        className="mb-footgrid"
      >
        {/* Brand col */}
        <div>
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(20px,2vw,28px)',
              fontWeight: 700,
              color: C.bg,
              marginBottom: 18,
              lineHeight: 1.1,
            }}
          >{fd?.businessName ?? "Maison Brûlot"}</div>
          <p
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: 'clamp(14px,1.4vw,16px)',
              lineHeight: 1.75,
              color: 'rgba(250,245,238,0.62)',
              margin: '0 0 24px',
              maxWidth: 300,
            }}
          >
            Boulangerie-pâtisserie artisanale. Levain naturel depuis 2011.
            Lyon 1er.
          </p>
          <div
            style={{
              display: 'flex',
              gap: 6,
            }}
          >
            {[C.gold, C.gold, C.gold, C.gold, C.gold].map((c, i) => (
              <Star key={i} size={13} fill={c} color={c} strokeWidth={0} />
            ))}
            <span
              style={{
                fontFamily: SANS,
                fontSize: 11,
                letterSpacing: '0.10em',
                color: 'rgba(250,245,238,0.5)',
                marginLeft: 8,
                alignSelf: 'center',
              }}
            >
              Google · 4.9/5
            </span>
          </div>
        </div>

        {/* 3 other cols */}
        {cols.map((col) => (
          <div key={col.title}>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 10.5,
                letterSpacing: '0.26em',
                textTransform: 'uppercase',
                color: C.gold,
                marginBottom: 20,
                fontWeight: 600,
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
                <li key={it}>
                  <span
                    style={{
                      fontFamily: SERIF,
                      fontSize: 'clamp(14px,1.3vw,16px)',
                      color: 'rgba(250,245,238,0.68)',
                      lineHeight: 1.4,
                    }}
                  >
                    {it}
                  </span>
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
          margin: '64px auto 0',
          paddingTop: 26,
          borderTop: `1px solid rgba(184,92,43,0.14)`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 14,
          fontFamily: SANS,
          fontSize: 11,
          letterSpacing: '0.10em',
          color: 'rgba(250,245,238,0.42)',
        }}
      >
        <span>© 2011–2026 Maison Brûlot. Tous droits réservés.</span>
        <span style={{ display: 'flex', gap: 22 }}>
          <a href="#contact" style={{ color: 'inherit', textDecoration: 'none' }}>
            Mentions légales
          </a>
          <a href="#contact" style={{ color: 'inherit', textDecoration: 'none' }}>
            Confidentialité
          </a>
        </span>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .mb-footgrid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .mb-footgrid { grid-template-columns: 1fr !important; }
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
      <style>{FONTS_CSS}</style>
      <main
        suppressHydrationWarning
        style={{
          background: C.bgDark,
          color: C.ink,
          fontFamily: SERIF,
          overflowX: 'hidden',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        }}
      >
        <Nav />
        <Hero />
        <Intro />
        <CraftSequence />
        <SpecialtyCards />
        <EditorialRows />
        <ProcessPanel />
        <Testimonials />
        <OrderForm />
        <Footer />
      </main>
    </>
  );
}
