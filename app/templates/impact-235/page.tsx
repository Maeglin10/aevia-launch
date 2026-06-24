'use client';

import React, { useRef, useState, useEffect } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  type MotionValue,
  useMotionValue,
} from 'framer-motion';
import {
  ArrowRight,
  ChevronDown,
  Quote,
  Star,
  Scissors,
} from 'lucide-react';

/* ════════════════════════════════════════════════════════════════════════════
   Atelier Marguerite Voss — Couturière créatrice sur mesure, Paris 8e
   Premium haute couture landing page
   (Vogue × Maison Margiela × Azzedine Alaïa editorial aesthetic)
   ════════════════════════════════════════════════════════════════════════════ */

/* ── Design tokens ───────────────────────────────────────────────────────── */
const C = {
  ecru: '#f7f3ec',
  ecruDeep: '#ede5d4',
  anthracite: '#1a1a22',
  anthraciteMid: '#2a2a36',
  ink: '#0d0d14',
  blue: '#1a4d8f',
  blueDim: '#1a3d72',
  gold: '#c4a86e',
  paper: '#faf8f4',
  textMuted: '#7a7060',
  textFaint: '#b0a898',
  border: '#e0d8cc',
  borderDark: '#2e2e3a',
} as const;

const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "'Helvetica Neue', Helvetica, Arial, sans-serif";

/* ── Unsplash helper ─────────────────────────────────────────────────────── */
const u = (id: string, w = 1600, q = 80): string =>
  `https://images.unsplash.com/photo-${id}?q=${q}&w=${w}&auto=format&fit=crop`;

const IMG = {
  hero: u('1558769132-cb1aea458c5e', 2000, 85),
  seq1: u('1558769132-cb1aea458c5e', 1600, 80),
  seq2: u('1490481560344-2c2de11cb0e7', 1600, 80),
  seq3: u('1515372534613-5d720f7da6b1', 1600, 80),
  atelier: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80&auto=format&fit=crop',
  fabric: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4e28?w=1600&q=80&auto=format&fit=crop',
  sticky: u('1490481560344-2c2de11cb0e7', 1400, 85),
} as const;

/* ════════════════════════════════════════════════════════════════════════════
   Data interfaces + constants
   ════════════════════════════════════════════════════════════════════════════ */

interface Collection {
  num: string;
  season: string;
  caption: string;
  sub: string;
  img: string;
}

const COLLECTIONS: Collection[] = [
  {
    num: 'I',
    season: 'Automne / Hiver',
    caption: 'La nuit commence à neuf heures',
    sub: "Des drapés architecturaux, une palette de nuit profonde. Tailoring à l\'os, coupes au millimètre.",
    img: IMG.seq1,
  },
  {
    num: 'II',
    season: 'Printemps / Été',
    caption: 'La lumière entre sans frapper',
    sub: "Lin irlandais, lin souple, soie grège. Une légèreté qui n\'a rien d\'anodin.",
    img: IMG.seq2,
  },
  {
    num: 'III',
    season: 'Mariages',
    caption: 'Ce jour-là, seulement vous',
    sub: "Robes sur mesure, ajustées sept fois, cousues une seule. Pour ne jamais l\'oublier.",
    img: IMG.seq3,
  },
];

interface Material {
  name: string;
  origin: string;
  description: string;
}

const MATERIALS: Material[] = [
  {
    name: 'Soie de Lyon',
    origin: 'Fabrique Bucol, Rhône-Alpes',
    description:
      "Tissée sur les métiers jacquard de la Maison Bucol depuis 1878. Éclat d\'un satin, douceur d\'un nuage. La soie de Lyon répond à la lumière comme nulle autre.",
  },
  {
    name: 'Laine Loro Piana',
    origin: 'Piedmont, Italie',
    description:
      "Cueillie une fois l\'an sur les hauts plateaux andins, cette laine storm system ® allie chaleur extrême et imperméabilité naturelle. Le toucher redéfinit ce que signifie doux.",
  },
  {
    name: 'Dentelle de Calais',
    origin: 'Maison Sophie Hallette, Pas-de-Calais',
    description:
      'Sur des métiers Leavers datant de 1815, des dentelliers produisent 1 centimètre par heure. Chaque centimètre de robe en porte la patience.',
  },
  {
    name: 'Linon irlandais',
    origin: 'Comté de Down, Irlande du Nord',
    description:
      "Le lin Ulster, cultivé dans les pluies atlantiques, possède une résistance singulière et un tomber rectiligne parfait. Il vieillit en s\'embellissant, comme doit le faire une pièce sur mesure.",
  },
];

interface PressItem {
  outlet: string;
  quote: string;
  issue: string;
}

const PRESS: PressItem[] = [
  {
    outlet: 'Vogue Paris',
    quote: "« La couturière qui réenchante le tailleur féminin. Une technique d\'une rigueur absolue au service d\'une sensibilité rare. »",
    issue: 'Septembre 2024',
  },
  {
    outlet: 'Elle',
    quote: '« Dans son atelier parisien, Marguerite Voss impose le rythme lent et précis de la haute couture au sur-mesure contemporain. »',
    issue: 'Mars 2024',
  },
  {
    outlet: 'Madame Figaro',
    quote: "« Dix rendez-vous, sept essayages, une robe. C\'est ainsi que Marguerite Voss s\'assure que vous êtes parfaite. »",
    issue: 'Hors-série Mode 2025',
  },
];

/* ════════════════════════════════════════════════════════════════════════════
   Shared motion helpers
   ════════════════════════════════════════════════════════════════════════════ */

const easeOut = [0.16, 1, 0.3, 1] as const;

interface RevealProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  delay?: number;
  as?: 'div' | 'section' | 'p' | 'h2' | 'h3' | 'li';
}

function Reveal({ children, style, delay = 0, as = 'div' }: RevealProps) {
  const MotionTag = motion[as] as typeof motion.div;
  return (
    <MotionTag
      style={style}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 1.0, ease: easeOut, delay }}
    >
      {children}
    </MotionTag>
  );
}

/* ── Eyebrow ─────────────────────────────────────────────────────────────── */
function Eyebrow({
  children,
  style,
  light = false,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  light?: boolean;
}) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 12,
        fontSize: 11,
        fontWeight: 400,
        letterSpacing: '0.32em',
        textTransform: 'uppercase',
        fontFamily: SANS,
        color: light ? C.gold : C.gold,
        ...style,
      }}
    >
      <span
        style={{
          width: 32,
          height: 1,
          background: C.gold,
          display: 'inline-block',
          flexShrink: 0,
        }}
      />
      {children}
    </span>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   NAV — transparent → anthracite on scroll
   ════════════════════════════════════════════════════════════════════════════ */

function Nav() {
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const unsub = scrollY.on('change', (v) => setSolid(v > 80));
    return () => unsub();
  }, [scrollY]);

  const links = [
    { label: 'Maison', href: '#maison' },
    { label: 'Collections', href: '#collections' },
    { label: 'Sur mesure', href: '#sur-mesure' },
    { label: 'Presse', href: '#presse' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <>
      <motion.nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: solid ? '16px clamp(20px, 5vw, 64px)' : '28px clamp(20px, 5vw, 64px)',
        background: solid ? 'rgba(26,26,34,0.92)' : 'transparent',
        backdropFilter: solid ? 'blur(20px) saturate(140%)' : 'none',
        WebkitBackdropFilter: solid ? 'blur(20px) saturate(140%)' : 'none',
        borderBottom: solid ? `1px solid ${C.borderDark}` : '1px solid transparent',
        transition:
          'padding 0.45s cubic-bezier(0.16,1,0.3,1), background 0.45s ease, border-color 0.45s ease',
      }}
    >
      {/* Brand */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          textDecoration: 'none',
        }}
      >
        <Scissors size={16} color={C.gold} strokeWidth={1.4} />
        <span
          style={{
            fontFamily: SERIF,
            fontWeight: 400,
            fontSize: 18,
            letterSpacing: '0.12em',
            color: C.ecru,
            whiteSpace: 'nowrap',
          }}
        >
          Atelier Voss
        </span>
      </div>

      {/* Links */}
      <div
        className="mv-navlinks"
        style={{ display: 'flex', alignItems: 'center', gap: 'clamp(18px, 2.8vw, 40px)' }}
      >
        {links.map((l) => (
          <a
            key={l.label}
            href={l.href}
            className="mv-navlink"
            style={{
              color: C.ecru,
              textDecoration: 'none',
              fontSize: 12,
              fontFamily: SANS,
              fontWeight: 400,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              opacity: 0.72,
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.72')}
          >
            {l.label}
          </a>
        ))}

        <a
          href="#contact"
          style={{
            fontFamily: SANS,
            fontSize: 12,
            fontWeight: 400,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: C.ink,
            background: C.gold,
            border: 'none',
            padding: '10px 22px',
            cursor: 'pointer',
            textDecoration: 'none',
            display: 'inline-block',
            transition: 'background 0.2s, color 0.2s',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = C.ecruDeep;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = C.gold;
          }}
        >
          Prendre RDV
        </a>
      </div>
    
        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="mv-burger"
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
        </motion.nav>
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
   HERO — parallax full-bleed photo + centered headline
   ════════════════════════════════════════════════════════════════════════════ */

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.14]);
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '14%']);
  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '-55%']);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <section
      ref={ref}
      id="maison"
      style={{
        position: 'relative',
        height: '100vh',
        minHeight: 680,
        overflow: 'hidden',
        background: C.ink,
      }}
    >
      {/* Parallax photo */}
      <motion.div
        style={{
          position: 'absolute',
          inset: '-6% 0 0 0',
          height: '112%',
          scale: imgScale,
          y: imgY,
          willChange: 'transform',
        }}
      >
        <img
          src={IMG.hero}
          alt="Atelier Marguerite Voss — couture sur mesure"
          loading="eager"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 30%',
            display: 'block',
          }}
        />
      </motion.div>

      {/* Multi-layer scrim for legibility */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(13,13,20,0.52) 0%, rgba(13,13,20,0.15) 30%, rgba(13,13,20,0.55) 75%, rgba(13,13,20,0.96) 100%)',
        }}
      />

      {/* Hero text — centered */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '0 clamp(20px, 6vw, 80px)',
          y: titleY,
          opacity: titleOpacity,
          willChange: 'transform, opacity',
        }}
      >
        <Eyebrow style={{ marginBottom: 28 }}>Couture sur mesure · Depuis 2008</Eyebrow>

        <h1
          style={{
            fontFamily: SERIF,
            fontWeight: 400,
            fontSize: 'clamp(3rem, 9vw, 8.5rem)',
            lineHeight: 1.0,
            letterSpacing: '-0.01em',
            color: C.ecru,
            margin: '0 0 28px',
            maxWidth: 900,
          }}
        >
          L&apos;art de vous<br />
          <em style={{ fontStyle: 'italic', color: C.ecruDeep }}>habiller juste</em>
        </h1>

        <p
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 'clamp(1rem, 1.8vw, 1.35rem)',
            color: C.textFaint,
            margin: '0 0 44px',
            maxWidth: 520,
            lineHeight: 1.65,
          }}
        >
          Chaque vêtement naît d&apos;une rencontre — entre votre corps, votre histoire, et les mains de l&apos;atelier.
        </p>

        <a
          href="#contact"
          style={{
            fontFamily: SANS,
            fontSize: 12,
            fontWeight: 400,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: C.ink,
            background: C.gold,
            padding: '16px 38px',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = C.ecruDeep)}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = C.gold)}
        >
          Prendre contact
          <ArrowRight size={14} strokeWidth={1.5} />
        </a>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: 32,
          left: '50%',
          transform: 'translateX(-50%)',
          opacity: cueOpacity,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span
          style={{
            fontFamily: SANS,
            fontSize: 10,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: C.textFaint,
          }}
        >
          Défiler
        </span>
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={18} color={C.gold} strokeWidth={1.3} />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   MANIFESTO — large centered serif quote
   ════════════════════════════════════════════════════════════════════════════ */

function Manifesto() {
  return (
    <section
      style={{
        background: C.paper,
        padding: 'clamp(80px, 14vw, 160px) clamp(20px, 8vw, 120px)',
        textAlign: 'center',
      }}
    >
      <Reveal>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: 36,
          }}
        >
          <Quote size={36} color={C.gold} strokeWidth={1} />
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <blockquote
          style={{
            fontFamily: SERIF,
            fontWeight: 400,
            fontStyle: 'italic',
            fontSize: 'clamp(1.6rem, 4vw, 3.4rem)',
            lineHeight: 1.3,
            letterSpacing: '-0.01em',
            color: C.anthracite,
            margin: '0 auto 40px',
            maxWidth: 900,
          }}
        >
          Un vêtement sur mesure ne se porte pas — il se vit. Il connaît votre corps mieux que vous ne croyez le connaître vous-même.
        </blockquote>
      </Reveal>

      <Reveal delay={0.2}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
          }}
        >
          <div style={{ width: 40, height: 1, background: C.textFaint }} />
          <span
            style={{
              fontFamily: SANS,
              fontSize: 12,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: C.textMuted,
            }}
          >
            Marguerite Voss, fondatrice
          </span>
          <div style={{ width: 40, height: 1, background: C.textFaint }} />
        </div>
      </Reveal>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   COLLECTION SEQUENCE — sticky crossfade 320vh
   ════════════════════════════════════════════════════════════════════════════ */

function SeqLayer({
  col,
  index,
  progress,
}: {
  col: Collection;
  index: number;
  progress: MotionValue<number>;
}) {
  const n = COLLECTIONS.length;
  const seg = 1 / n;
  const start = index * seg;
  const end = start + seg;
  const fadeIn = start + seg * 0.14;
  const fadeOut = end - seg * 0.14;

  const opacity = useTransform(
    progress,
    index === 0
      ? [0, fadeOut, end]
      : index === n - 1
        ? [start, fadeIn, 1]
        : [start, fadeIn, fadeOut, end],
    index === 0
      ? [1, 1, 0]
      : index === n - 1
        ? [0, 1, 1]
        : [0, 1, 1, 0],
  );

  const scale = useTransform(progress, [start, end], [1.07, 1.0]);

  return (
    <motion.div
      style={{
        position: 'absolute',
        inset: 0,
        opacity,
        willChange: 'opacity',
      }}
    >
      <motion.img
        src={col.img}
        alt={col.season}
        loading="lazy"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center 25%',
          scale,
          willChange: 'transform',
        }}
      />
    </motion.div>
  );
}

function SeqCaption({
  col,
  index,
  progress,
}: {
  col: Collection;
  index: number;
  progress: MotionValue<number>;
}) {
  const n = COLLECTIONS.length;
  const seg = 1 / n;
  const start = index * seg;
  const end = start + seg;
  const mid = start + seg / 2;

  const opacity = useTransform(
    progress,
    [start, start + seg * 0.18, end - seg * 0.18, end],
    [0, 1, 1, 0],
  );
  const y = useTransform(progress, [start, mid, end], [28, 0, -28]);

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: 'clamp(20px, 5vw, 72px)',
        bottom: 'clamp(52px, 11vh, 104px)',
        opacity,
        y,
        maxWidth: 580,
        willChange: 'transform, opacity',
      }}
    >
      <div
        style={{
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontSize: 'clamp(3.5rem, 7vw, 6.5rem)',
          lineHeight: 1,
          color: C.ecru,
          opacity: 0.12,
          marginBottom: -24,
          userSelect: 'none',
        }}
      >
        {col.num}
      </div>
      <Eyebrow style={{ marginBottom: 16 }}>{col.season}</Eyebrow>
      <h3
        style={{
          fontFamily: SERIF,
          fontWeight: 400,
          fontStyle: 'italic',
          fontSize: 'clamp(1.8rem, 4.5vw, 4rem)',
          lineHeight: 1.05,
          color: C.ecru,
          margin: '12px 0 18px',
        }}
      >
        {col.caption}
      </h3>
      <p
        style={{
          fontFamily: SANS,
          fontSize: 'clamp(0.88rem, 1.2vw, 1rem)',
          color: C.textFaint,
          lineHeight: 1.7,
          margin: 0,
        }}
      >
        {col.sub}
      </p>
    </motion.div>
  );
}

function CollectionSequence() {
  const n = COLLECTIONS.length;
  const progress = useMotionValue(0.5 / n);
  const [active, setActive] = useState(0);
  const goTo = (i: number) => {
    setActive(i);
    progress.set((i + 0.5) / n);
  };

  const barScale = useTransform(progress, [0, 1], [0, 1]);

  return (
    <section
      id="collections"
      style={{ position: 'relative', height: '100vh', overflow: 'hidden', background: C.ink }}
    >
      <div
        style={{
          position: 'relative',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {/* Layers */}
        {COLLECTIONS.map((col, i) => (
          <SeqLayer key={i} col={col} index={i} progress={progress} />
        ))}

        {/* Scrim */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(90deg, rgba(13,13,20,0.82) 0%, rgba(13,13,20,0.20) 50%, transparent 72%), linear-gradient(0deg, rgba(13,13,20,0.75) 0%, transparent 45%)',
          }}
        />

        {/* Section label */}
        <div
          style={{
            position: 'absolute',
            top: 'clamp(96px, 15vh, 148px)',
            right: 'clamp(20px, 5vw, 64px)',
            textAlign: 'right',
          }}
        >
          <Eyebrow style={{ flexDirection: 'row-reverse' }}>Les collections</Eyebrow>
        </div>

        {/* Captions */}
        {COLLECTIONS.map((col, i) => (
          <SeqCaption key={i} col={col} index={i} progress={progress} />
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
        {/* Progress bar */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            height: 2,
            width: '100%',
            background: 'rgba(247,243,236,0.12)',
          }}
        >
          <motion.div
            style={{
              height: '100%',
              background: C.gold,
              transformOrigin: 'left',
              scaleX: barScale,
            }}
          />
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   ATELIER ROWS — editorial split rows
   ════════════════════════════════════════════════════════════════════════════ */

interface AtelierRowProps {
  img: string;
  imgAlt: string;
  eyebrow: string;
  heading: string;
  body: string;
  reverse?: boolean;
}

function AtelierRow({ img, imgAlt, eyebrow, heading, body, reverse = false }: AtelierRowProps) {
  const imgRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: imgRef,
    offset: ['start end', 'end start'],
  });
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.07, 1.0]);

  return (
    <div
      className="mv-editrow"
      style={{
        display: 'flex',
        flexDirection: reverse ? 'row-reverse' : 'row',
        minHeight: 'clamp(420px, 60vh, 700px)',
      }}
    >
      {/* Image side */}
      <div
        ref={imgRef}
        style={{ flex: 1, overflow: 'hidden', position: 'relative' }}
      >
        <motion.img
          src={img}
          alt={imgAlt}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            scale: imgScale,
            display: 'block',
            willChange: 'transform',
          }}
        />
      </div>

      {/* Text side */}
      <div
        style={{
          flex: 1,
          background: C.paper,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 'clamp(48px, 7vw, 96px) clamp(32px, 5.5vw, 80px)',
        }}
      >
        <Reveal>
          <Eyebrow style={{ marginBottom: 24 }}>{eyebrow}</Eyebrow>
        </Reveal>
        <Reveal delay={0.1}>
          <h2
            style={{
              fontFamily: SERIF,
              fontWeight: 400,
              fontStyle: 'italic',
              fontSize: 'clamp(2rem, 4vw, 3.4rem)',
              lineHeight: 1.1,
              color: C.anthracite,
              margin: '0 0 28px',
            }}
          >
            {heading}
          </h2>
        </Reveal>
        <Reveal delay={0.18}>
          <p
            style={{
              fontFamily: SANS,
              fontSize: 'clamp(0.92rem, 1.3vw, 1.05rem)',
              lineHeight: 1.8,
              color: C.textMuted,
              margin: '0 0 36px',
              maxWidth: 440,
            }}
          >
            {body}
          </p>
        </Reveal>
        <Reveal delay={0.26}>
          <a
            href="#contact"
            style={{
              fontFamily: SANS,
              fontSize: 12,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: C.anthracite,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              borderBottom: `1px solid ${C.gold}`,
              paddingBottom: 2,
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = C.gold)}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = C.anthracite)}
          >
            En savoir plus
            <ArrowRight size={13} strokeWidth={1.5} />
          </a>
        </Reveal>
      </div>
    </div>
  );
}

function AtelierRows() {
  return (
    <section id="sur-mesure" style={{ background: C.paper }}>
      <AtelierRow
        img={IMG.atelier}
        imgAlt="L'atelier Marguerite Voss — geste de couture"
        eyebrow="Le Geste"
        heading="Cousue à la main, ajustée à votre âme"
        body="Dans l'atelier du 8e arrondissement, chaque pièce passe entre les mains d'une seule couturière, du premier tracé au dernier point invisible. Ce n'est pas de l'artisanat — c'est une discipline. Nous refusons la délégation qui dilue."
        reverse={false}
      />
      <AtelierRow
        img={IMG.fabric}
        imgAlt="Sélection de tissus — Atelier Marguerite Voss"
        eyebrow="Le Tissu"
        heading="Des matières qui méritent votre peau"
        body="Nous ne choisissons pas les tissus sur catalogue. Chaque saison, Marguerite Voss se rend à Lyon, Milan et Calais pour toucher, tendre, plier. Seuls les roulés qui résistent à cette exigence rejoignent l'atelier."
        reverse={true}
      />
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   MATERIALS PANEL — sticky left image, scrolling right content
   ════════════════════════════════════════════════════════════════════════════ */

function MaterialsPanel() {
  return (
    <section
      style={{ background: C.ecru, position: 'relative' }}
    >
      <div
        className="mv-sticky"
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          maxWidth: '100%',
        }}
      >
        {/* Sticky left image */}
        <div
          style={{
            position: 'sticky',
            top: 0,
            width: '48%',
            height: '100vh',
            overflow: 'hidden',
            flexShrink: 0,
          }}
        >
          <img
            src={IMG.sticky}
            alt="Matières — Atelier Marguerite Voss"
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 20%',
              display: 'block',
            }}
          />
          {/* Overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, transparent 60%, rgba(247,243,236,0.25) 100%)',
            }}
          />
        </div>

        {/* Scrolling right side */}
        <div
          style={{
            flex: 1,
            padding: 'clamp(80px, 12vw, 140px) clamp(40px, 6vw, 88px)',
          }}
        >
          <div style={{ marginBottom: 'clamp(48px, 7vw, 80px)' }}>
            <Reveal>
              <Eyebrow style={{ marginBottom: 20 }}>La matière</Eyebrow>
            </Reveal>
            <Reveal delay={0.1}>
              <h2
                style={{
                  fontFamily: SERIF,
                  fontWeight: 400,
                  fontStyle: 'italic',
                  fontSize: 'clamp(1.8rem, 3.5vw, 3rem)',
                  color: C.anthracite,
                  margin: '12px 0 0',
                  lineHeight: 1.15,
                }}
              >
                Nos tissus ont une biographie
              </h2>
            </Reveal>
          </div>

          {MATERIALS.map((mat, i) => (
            <Reveal key={mat.name} delay={i * 0.08}>
              <div
                style={{
                  paddingBottom: 'clamp(36px, 5vw, 60px)',
                  marginBottom: 'clamp(36px, 5vw, 60px)',
                  borderBottom: i < MATERIALS.length - 1 ? `1px solid ${C.border}` : 'none',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: 16,
                    marginBottom: 12,
                  }}
                >
                  <span
                    style={{
                      fontFamily: SERIF,
                      fontStyle: 'italic',
                      fontSize: 'clamp(1.3rem, 2.2vw, 1.8rem)',
                      color: C.anthracite,
                    }}
                  >
                    {mat.name}
                  </span>
                  <span
                    style={{
                      fontFamily: SANS,
                      fontSize: 11,
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      color: C.gold,
                    }}
                  >
                    {mat.origin}
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: SANS,
                    fontSize: 'clamp(0.88rem, 1.2vw, 1rem)',
                    lineHeight: 1.82,
                    color: C.textMuted,
                    margin: 0,
                    maxWidth: 420,
                  }}
                >
                  {mat.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   PRESS — 3 press mentions
   ════════════════════════════════════════════════════════════════════════════ */

function Press() {
  return (
    <section
      id="presse"
      style={{
        background: C.paper,
        padding: 'clamp(72px, 12vw, 140px) clamp(20px, 6vw, 80px)',
      }}
    >
      <Reveal style={{ textAlign: 'center', marginBottom: 'clamp(48px, 8vw, 88px)' }}>
        <Eyebrow style={{ justifyContent: 'center', marginBottom: 20 }}>Presse</Eyebrow>
        <h2
          style={{
            fontFamily: SERIF,
            fontWeight: 400,
            fontStyle: 'italic',
            fontSize: 'clamp(1.8rem, 3.5vw, 3rem)',
            color: C.anthracite,
            margin: 0,
          }}
        >
          Ils en parlent
        </h2>
      </Reveal>

      <div
        className="mv-pressgrid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 'clamp(20px, 3vw, 40px)',
          maxWidth: 1200,
          margin: '0 auto',
        }}
      >
        {PRESS.map((item, i) => (
          <Reveal key={item.outlet} delay={i * 0.1}>
            <div
              style={{
                background: C.ecru,
                padding: 'clamp(28px, 4vw, 48px)',
                display: 'flex',
                flexDirection: 'column',
                gap: 20,
                height: '100%',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span
                  style={{
                    fontFamily: SERIF,
                    fontWeight: 400,
                    fontStyle: 'italic',
                    fontSize: 'clamp(1rem, 1.4vw, 1.2rem)',
                    color: C.anthracite,
                  }}
                >
                  {item.outlet}
                </span>
                <span
                  style={{
                    fontFamily: SANS,
                    fontSize: 11,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: C.textFaint,
                  }}
                >
                  {item.issue}
                </span>
              </div>

              <div
                style={{
                  width: 28,
                  height: 1,
                  background: C.gold,
                }}
              />

              <p
                style={{
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  fontSize: 'clamp(0.92rem, 1.2vw, 1.05rem)',
                  lineHeight: 1.72,
                  color: C.textMuted,
                  margin: 0,
                  flex: 1,
                }}
              >
                {item.quote}
              </p>

              <div style={{ display: 'flex', gap: 4 }}>
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} size={12} color={C.gold} fill={C.gold} strokeWidth={0} />
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   ORDER FORM — dark section with underline-only inputs
   ════════════════════════════════════════════════════════════════════════════ */

type ProjectType = 'Robe de mariée' | 'Robe de soirée' | 'Costume' | 'Autre';

interface FormState {
  nom: string;
  email: string;
  type: ProjectType | '';
  message: string;
}

function OrderForm() {
  const [form, setForm] = useState<FormState>({
    nom: '',
    email: '',
    type: '',
    message: '',
  });
  const [sent, setSent] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  const fieldStyle = (name: string): React.CSSProperties => ({
    background: 'transparent',
    border: 'none',
    borderBottom: `1px solid ${focused === name ? C.gold : C.borderDark}`,
    outline: 'none',
    padding: '12px 0',
    width: '100%',
    fontFamily: SANS,
    fontSize: 'clamp(0.9rem, 1.2vw, 1rem)',
    color: C.ecru,
    transition: 'border-color 0.25s',
    letterSpacing: '0.04em',
  });

  const labelStyle: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 11,
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    color: C.textFaint,
    display: 'block',
    marginBottom: 6,
  };

  return (
    <section
      id="contact"
      style={{
        background: C.anthracite,
        padding: 'clamp(72px, 12vw, 140px) clamp(20px, 6vw, 80px)',
      }}
    >
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <Reveal style={{ textAlign: 'center', marginBottom: 'clamp(48px, 7vw, 72px)' }}>
          <Eyebrow style={{ justifyContent: 'center', marginBottom: 20 }}>Commencer</Eyebrow>
          <h2
            style={{
              fontFamily: SERIF,
              fontWeight: 400,
              fontStyle: 'italic',
              fontSize: 'clamp(1.8rem, 3.5vw, 3rem)',
              color: C.ecru,
              margin: '12px 0 16px',
            }}
          >
            Prenons rendez-vous
          </h2>
          <p
            style={{
              fontFamily: SANS,
              fontSize: 'clamp(0.9rem, 1.2vw, 1rem)',
              color: C.textFaint,
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            Dites-nous qui vous êtes et ce que vous portez en tête. Nous vous répondrons sous 48 h.
          </p>
        </Reveal>

        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div
              key="thanks"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: easeOut }}
              style={{ textAlign: 'center', padding: 'clamp(40px, 6vw, 72px) 0' }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  border: `1px solid ${C.gold}`,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 28px',
                }}
              >
                <Scissors size={22} color={C.gold} strokeWidth={1.3} />
              </div>
              <h3
                style={{
                  fontFamily: SERIF,
                  fontWeight: 400,
                  fontStyle: 'italic',
                  fontSize: 'clamp(1.4rem, 2.5vw, 2rem)',
                  color: C.ecru,
                  margin: '0 0 16px',
                }}
              >
                Votre demande est entre de bonnes mains
              </h3>
              <p
                style={{
                  fontFamily: SANS,
                  fontSize: 'clamp(0.88rem, 1.1vw, 0.98rem)',
                  color: C.textFaint,
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                Nous vous répondrons dans les 48 heures pour convenir d&apos;un premier rendez-vous à l&apos;atelier.
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 36 }}
            >
              <div className="mv-formgrid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
                {/* Nom */}
                <div>
                  <label style={labelStyle} htmlFor="mv-nom">Nom</label>
                  <input
                    id="mv-nom"
                    type="text"
                    required
                    placeholder="Votre nom"
                    value={form.nom}
                    onChange={(e) => setForm((f) => ({ ...f, nom: e.target.value }))}
                    onFocus={() => setFocused('nom')}
                    onBlur={() => setFocused(null)}
                    style={fieldStyle('nom')}
                  />
                </div>

                {/* Email */}
                <div>
                  <label style={labelStyle} htmlFor="mv-email">Email</label>
                  <input
                    id="mv-email"
                    type="email"
                    required
                    placeholder="votre@email.com"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused(null)}
                    style={fieldStyle('email')}
                  />
                </div>
              </div>

              {/* Type de projet */}
              <div>
                <label style={labelStyle} htmlFor="mv-type">Type de projet</label>
                <select
                  id="mv-type"
                  required
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as ProjectType }))}
                  onFocus={() => setFocused('type')}
                  onBlur={() => setFocused(null)}
                  style={{
                    ...fieldStyle('type'),
                    cursor: 'pointer',
                    appearance: 'none',
                    WebkitAppearance: 'none',
                  }}
                >
                  <option value="" disabled style={{ background: C.anthraciteMid }}>
                    Choisissez un type…
                  </option>
                  {(['Robe de mariée', 'Robe de soirée', 'Costume', 'Autre'] as ProjectType[]).map(
                    (t) => (
                      <option key={t} value={t} style={{ background: C.anthraciteMid }}>
                        {t}
                      </option>
                    ),
                  )}
                </select>
              </div>

              {/* Message */}
              <div>
                <label style={labelStyle} htmlFor="mv-message">Votre projet</label>
                <textarea
                  id="mv-message"
                  required
                  placeholder="Décrivez votre projet, l'occasion, vos envies…"
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  onFocus={() => setFocused('message')}
                  onBlur={() => setFocused(null)}
                  style={{
                    ...fieldStyle('message'),
                    resize: 'none',
                    lineHeight: 1.7,
                  }}
                />
              </div>

              <div>
                <button
                  type="submit"
                  style={{
                    fontFamily: SANS,
                    fontSize: 12,
                    fontWeight: 400,
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: C.ink,
                    background: C.gold,
                    border: 'none',
                    padding: '18px 44px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 12,
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = C.ecruDeep)}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = C.gold)}
                >
                  Envoyer ma demande
                  <ArrowRight size={14} strokeWidth={1.5} />
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   FOOTER — 4-column grid
   ════════════════════════════════════════════════════════════════════════════ */

function Footer() {
  const year = new Date().getFullYear();

  const colLinks = [
    {
      heading: 'La Maison',
      href: '#maison',
      links: ['Notre histoire', "L'atelier", 'Marguerite Voss', 'Nos engagements'],
    },
    {
      heading: 'Collections',
      href: '#collections',
      links: ['Automne / Hiver', 'Printemps / Été', 'Mariages', 'Sur commande'],
    },
    {
      heading: 'Contact',
      href: '#contact',
      links: ['Prendre RDV', '12 avenue Hoche, Paris 8e', 'contact@ateliervoss.fr', '+33 1 44 XX XX XX'],
    },
  ];

  return (
    <footer
      style={{
        background: C.ink,
        borderTop: `1px solid ${C.borderDark}`,
        padding: 'clamp(60px, 10vw, 112px) clamp(20px, 5vw, 64px) clamp(28px, 4vw, 48px)',
      }}
    >
      <div
        className="mv-footgrid"
        style={{
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr 1fr 1fr',
          gap: 'clamp(32px, 4vw, 60px)',
          marginBottom: 'clamp(48px, 7vw, 80px)',
        }}
      >
        {/* Brand column */}
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 20,
            }}
          >
            <Scissors size={15} color={C.gold} strokeWidth={1.3} />
            <span
              style={{
                fontFamily: SERIF,
                fontWeight: 400,
                fontSize: 17,
                letterSpacing: '0.12em',
                color: C.ecru,
              }}
            >
              Atelier Voss
            </span>
          </div>
          <p
            style={{
              fontFamily: SANS,
              fontSize: 13,
              lineHeight: 1.78,
              color: C.textFaint,
              margin: '0 0 28px',
              maxWidth: 240,
            }}
          >
            Couture sur mesure au cœur de Paris 8e. Depuis 2008, chaque vêtement est une promesse tenue.
          </p>
          <div
            style={{
              display: 'flex',
              gap: 3,
            }}
          >
            {['I', 'G', 'P'].map((s) => (
              <a
                key={s}
                href="#maison"
                style={{
                  width: 32,
                  height: 32,
                  border: `1px solid ${C.borderDark}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: SANS,
                  fontSize: 11,
                  color: C.textFaint,
                  textDecoration: 'none',
                  transition: 'border-color 0.2s, color 0.2s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = C.gold;
                  (e.currentTarget as HTMLElement).style.color = C.gold;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = C.borderDark;
                  (e.currentTarget as HTMLElement).style.color = C.textFaint;
                }}
              >
                {s}
              </a>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {colLinks.map((col) => (
          <div key={col.heading}>
            <h4
              style={{
                fontFamily: SANS,
                fontSize: 11,
                fontWeight: 400,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: C.gold,
                margin: '0 0 20px',
              }}
            >
              {col.heading}
            </h4>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {col.links.map((l) => (
                <li key={l}>
                  <a
                    href={col.href}
                    style={{
                      fontFamily: SANS,
                      fontSize: 13,
                      color: C.textFaint,
                      textDecoration: 'none',
                      lineHeight: 1.5,
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = C.ecru)}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = C.textFaint)}
                  >
                    {l}
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
          borderTop: `1px solid ${C.borderDark}`,
          paddingTop: 24,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <span
          style={{
            fontFamily: SANS,
            fontSize: 12,
            color: C.textFaint,
            letterSpacing: '0.06em',
          }}
        >
          © {year} Atelier Marguerite Voss. Tous droits réservés.
        </span>
        <div style={{ display: 'flex', gap: 24 }}>
          {['Mentions légales', 'Politique de confidentialité', 'CGV'].map((l) => (
            <a
              key={l}
              href="#contact"
              style={{
                fontFamily: SANS,
                fontSize: 12,
                color: C.textFaint,
                textDecoration: 'none',
                letterSpacing: '0.06em',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = C.ecru)}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = C.textFaint)}
            >
              {l}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   ROOT PAGE
   ════════════════════════════════════════════════════════════════════════════ */

export default function AtlierMargueriteVossPage() {
  return (
    <main
      suppressHydrationWarning
      style={{
        fontFamily: SANS,
        background: C.paper,
        color: C.anthracite,
        overflowX: 'hidden',
      }}
    >
      <Nav />
      <Hero />
      <Manifesto />
      <CollectionSequence />
      <AtelierRows />
      <MaterialsPanel />
      <Press />
      <OrderForm />
      <Footer />

      {/* ── Responsive + hover CSS ──────────────────────────────────────────── */}
      <style>{`
        /* Nav links hidden on mobile */
        @media (max-width: 860px) {
          .mv-navlinks {
            display: none !important;
          }
          .mv-burger { display: flex !important; flex-direction: column; }
        }

        /* Edit rows: stack on mobile */
        @media (max-width: 768px) {
          .mv-editrow {
            flex-direction: column !important;
          }
          .mv-editrow > div:first-child {
            height: 55vw !important;
          }
        }

        /* Sticky panel: stack on mobile */
        @media (max-width: 768px) {
          .mv-sticky {
            flex-direction: column !important;
          }
          .mv-sticky > div:first-child {
            position: relative !important;
            width: 100% !important;
            height: 70vw !important;
          }
        }

        /* Press grid: 1 col on mobile */
        @media (max-width: 640px) {
          .mv-pressgrid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (min-width: 641px) and (max-width: 900px) {
          .mv-pressgrid {
            grid-template-columns: 1fr 1fr !important;
          }
        }

        /* Form grid: 1 col on mobile */
        @media (max-width: 560px) {
          .mv-formgrid {
            grid-template-columns: 1fr !important;
          }
        }

        /* Footer grid: 2 col on tablet, 1 on mobile */
        @media (max-width: 760px) {
          .mv-footgrid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 480px) {
          .mv-footgrid {
            grid-template-columns: 1fr !important;
          }
        }

        /* Prevent iOS input zoom */
        input, select, textarea {
          font-size: max(16px, 1rem);
        }

        /* Smooth scroll */
        html {
          scroll-behavior: smooth;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </main>
  );
}
