'use client';

import React, { useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  MotionValue,
} from 'framer-motion';
import { ArrowRight, ChevronDown, Heart, MapPin } from 'lucide-react';

/* ════════════════════════════════════════════════════════════════════════════
   MAISON SOLAL — Couture & Mode Sur-Mesure · Marseille
   Photographie réelle + chorégraphie de défilement éditoriale (style Maison
   de couture × élégance méditerranéenne). Auto-suffisant. 'use client'.
   ════════════════════════════════════════════════════════════════════════════ */

/* ── Google Fonts ────────────────────────────────────────────────────────── */
const FONT_LINK =
  'https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Jost:wght@300;400;500;600&display=swap';

/* ── Palette ─────────────────────────────────────────────────────────────── */
const C = {
  bg: '#faf8f4',
  bgAlt: '#f0ece4',
  bgDark: '#12100c',
  bgDarkAlt: '#0a0906',
  bgCard: '#ffffff',
  accent: '#8c7248',
  accentDark: '#6e5838',
  accentLight: '#e8dcc8',
  white: '#ffffff',
  ink: '#12100c',
  textMuted: '#403828',
  textFaint: '#9a8870',
  border: '#e0d8c8',
  borderDark: 'rgba(140,114,72,0.2)',
  terracotta: '#c86840',
} as const;

const SERIF = "'Cormorant', Georgia, serif" as const;
const SANS = "'Jost', system-ui, sans-serif" as const;

/* ── Easing partagé ──────────────────────────────────────────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ── Photo helper ────────────────────────────────────────────────────────── */
const photo = (id: string) =>
  `https://images.unsplash.com/photo-${id}?q=80&w=1600&auto=format&fit=crop`;

/* ════════════════════════════════════════════════════════════════════════════
   TypeScript Interfaces
   ════════════════════════════════════════════════════════════════════════════ */

interface Collection {
  img: string;
  index: string;
  label: string;
  caption: string;
}

interface Piece {
  title: string;
  sub: string;
}

interface EditRow {
  eyebrow: string;
  img: string;
  title: React.ReactNode;
  body: string;
  reverse: boolean;
}

interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

interface AtélierStep {
  num: string;
  title: string;
  body: string;
}

/* ════════════════════════════════════════════════════════════════════════════
   Data
   ════════════════════════════════════════════════════════════════════════════ */

const COLLECTIONS: Collection[] = [
  {
    img: photo('1483985985-e99f93b85d2a'),
    index: 'I',
    label: 'ROBES DE SOIRÉE',
    caption:
      'Soie, organza, broderies main — chaque robe est pensée pour la femme qui la portera, pas pour un catalogue.',
  },
  {
    img: photo('1515372931673-a36374d4af61'),
    index: 'II',
    label: 'MARIÉES',
    caption:
      'Robe de mariée sur-mesure, ajustements en 5 essayages, finitions à la main — le vêtement le plus important de votre vie.',
  },
  {
    img: photo('1469334031925-4650d4192253'),
    index: 'III',
    label: 'TAILLEUR & COSTUME',
    caption:
      'Tailleur femme, smoking, costume homme — la coupe italienne interprétée par des mains marseillaises.',
  },
];

const PIECES: Piece[] = [
  { title: 'Robe de soirée', sub: 'Soie · Organza · Dentelle' },
  { title: 'Robe de mariée', sub: 'Mikado · Crépon · Broderie' },
  { title: 'Tailleur femme', sub: 'Lainage · Lin · Soie' },
  { title: 'Costume homme', sub: 'Flanelle · Mohair · Laine' },
  { title: 'Manteau couture', sub: 'Cachemire · Alpaga · Drap' },
  { title: 'Broderie & personnalisation', sub: "Fil d\'or · Soie · Main" },
];

const EDIT_ROWS: EditRow[] = [
  {
    eyebrow: 'Notre philosophie',
    img: photo('1483985985-e99f93b85d2a') + '&w=800',
    title: (
      <>
        La coupe /{' '}
        <span style={{ fontStyle: 'italic' }}>qui révèle.</span>
      </>
    ),
    body: "Marseille rencontre la technique parisienne : chaque silhouette naît d\'un dialogue entre la femme et l\'atelier. La lumière méditerranéenne guide notre palette, le caractère du Sud notre façon de couper. Trois semaines minimum par pièce — le temps que mérite votre vêtement.",
    reverse: false,
  },
  {
    eyebrow: "L'atelier",
    img: photo('1515372931673-a36374d4af61') + '&w=800',
    title: (
      <>
        Le Panier, /{' '}
        <span style={{ fontStyle: 'italic' }}>Marseille.</span>
      </>
    ),
    body: "Au cœur du quartier historique du Panier, l\'atelier est visible depuis la rue — vitrine ouverte sur le geste couture. Sur rendez-vous uniquement, nous y recevons depuis douze ans des femmes et des hommes qui ont choisi de ne plus faire de compromis avec leur apparence.",
    reverse: true,
  },
];

const ATELIER_STEPS: AtélierStep[] = [
  {
    num: 'I',
    title: 'Première rencontre',
    body: 'Écoute, morphologie, couleurs, circonstances. Nous prenons le temps de comprendre qui vous êtes avant de dessiner une ligne.',
  },
  {
    num: 'II',
    title: 'Croquis & sélection des matières',
    body: '3 propositions sur mesure, accompagnées de nos tissus sélectionnés chez nos fournisseurs italiens et français.',
  },
  {
    num: 'III',
    title: '3 à 5 essayages',
    body: "Ajustements progressifs jusqu\'à la perfection. Chaque couture est reprise autant de fois que nécessaire.",
  },
  {
    num: 'IV',
    title: 'Finitions main',
    body: 'Coutures invisibles, boutons nacre, broderies finales — les détails que seul le regard averti remarque, mais que le corps ressent.',
  },
];

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Ma robe de mariée a été confectionnée ici, en cinq essayages d'une patience extraordinaire. L'atelier a capturé quelque chose que je n'aurais su décrire — une présence que je n'avais jamais eue dans un vêtement.",
    name: 'Camille R.',
    role: 'Mariée · Marseille',
  },
  {
    quote:
      "Je confie ma garde-robe de travail exclusivement à Maison Solal depuis quatre ans. La coupe a changé ma façon d\'entrer dans une pièce. C\'est un investissement dans qui l\'on veut être.",
    name: 'Isabelle M.',
    role: 'Directrice générale · Aix-en-Provence',
  },
];

const PIECE_TYPES = [
  'Robe de mariée',
  'Robe de soirée',
  'Tailleur femme',
  'Manteau',
  'Pièce homme',
  'Broderie & retouche',
] as const;

/* ════════════════════════════════════════════════════════════════════════════
   Primitives
   ════════════════════════════════════════════════════════════════════════════ */

/** Étiquette fine, capitales, interlettrage large, filet accent. */
function Eyebrow({
  children,
  color = C.accent,
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
    width: 44,
    height: 1,
    background: color,
    opacity: 0.65,
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

/** Bouton accent camel, contour fin, flèche au survol. */
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
    padding: '15px 30px',
    fontFamily: SANS,
    fontSize: 11.5,
    letterSpacing: '0.24em',
    textTransform: 'uppercase',
    fontWeight: 500,
    cursor: 'pointer',
    border: `1px solid ${C.accent}`,
    background: filled ? C.accent : 'transparent',
    color: filled ? C.white : dark ? C.accentLight : C.accent,
    transition: 'all .5s cubic-bezier(.16,1,.3,1)',
  };
  const hov: React.CSSProperties = hover
    ? filled
      ? { background: C.accentDark, borderColor: C.accentDark, transform: 'translateY(-2px)' }
      : { background: 'rgba(140,114,72,0.10)', transform: 'translateY(-2px)' }
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
   1 · Nav
   ════════════════════════════════════════════════════════════════════════════ */
function Nav() {
  const [solid, setSolid] = useState(false);
  React.useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: 'Collections', href: '#collections' },
    { label: "L'atelier", href: '#atelier' },
    { label: 'Sur-mesure', href: '#surmesure' },
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
      ? '16px clamp(20px,5vw,64px)'
      : '26px clamp(20px,5vw,64px)',
    background: solid ? 'rgba(18,16,12,0.95)' : 'transparent',
    backdropFilter: solid ? 'blur(14px) saturate(130%)' : 'none',
    WebkitBackdropFilter: solid ? 'blur(14px) saturate(130%)' : 'none',
    borderBottom: solid
      ? `1px solid rgba(140,114,72,0.22)`
      : '1px solid transparent',
    transition: 'all .6s cubic-bezier(.16,1,.3,1)',
  };
  const brand: React.CSSProperties = {
    fontFamily: SERIF,
    fontStyle: 'italic',
    fontSize: 'clamp(18px,2vw,24px)',
    letterSpacing: '0.06em',
    color: C.white,
    fontWeight: 400,
    textDecoration: 'none',
  };

  return (
    <nav style={bar}>
      <a href="#collections" style={brand}>
        Maison Solal
      </a>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(18px,2.4vw,38px)' }} className="ms-navlinks">
        {links.map((l) => (
          <NavLink key={l.label} label={l.label} href={l.href} />
        ))}
      </div>
      <div className="ms-navcta">
        <a href="#contact" style={{ textDecoration: 'none' }}>
          <AccentButton filled dark>
            Prendre rendez-vous
          </AccentButton>
        </a>
      </div>
      <style>{`
        @media (max-width: 860px) {
          .ms-navlinks { display: none !important; }
          .ms-navcta { display: none !important; }
        }
      `}</style>
    </nav>
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
   2 · Hero (100vh, parallaxe scale + imgY)
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
  const titleOpacity = useTransform(scrollYProgress, [0, 0.72], [1, 0]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.20], [1, 0]);

  const section: React.CSSProperties = {
    position: 'relative',
    height: '100vh',
    minHeight: 640,
    overflow: 'hidden',
    background: C.bgDark,
  };

  return (
    <section ref={ref} style={section}>
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
          src={`https://images.unsplash.com/photo-1483985985-e99f93b85d2a?q=80&w=2000&auto=format&fit=crop`}
          alt="Détail de couture — Maison Solal Marseille"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </motion.div>

      {/* Voile principal */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(18,16,12,0.52) 0%, rgba(18,16,12,0.08) 38%, rgba(18,16,12,0.44) 70%, rgba(18,16,12,0.90) 100%)',
        }}
      />
      {/* Voile radial */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(120% 80% at 50% 30%, transparent 40%, rgba(12,10,8,0.5) 100%)',
          mixBlendMode: 'multiply',
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
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '0 clamp(24px,6vw,80px)',
          y: titleY,
          opacity: titleOpacity,
        }}
      >
        <Reveal y={18}>
          <Eyebrow color={C.accentLight} align="center">
            Couture Sur-Mesure · Marseille
          </Eyebrow>
        </Reveal>

        <motion.h1
          initial={{ opacity: 0, y: 44 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.16 }}
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontWeight: 400,
            color: C.white,
            fontSize: 'clamp(3.5rem,7.5vw,9rem)',
            lineHeight: 0.88,
            letterSpacing: '-0.01em',
            margin: '28px 0 24px',
            textShadow: '0 12px 60px rgba(0,0,0,0.55)',
          }}
        >
          L&apos;élégance
          <br />
          qui vous
          <br />
          appartient.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.46 }}
          style={{
            fontFamily: SANS,
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: 'clamp(15px,1.8vw,20px)',
            color: 'rgba(255,255,255,0.80)',
            maxWidth: 520,
            lineHeight: 1.7,
          }}
        >
          Vêtements uniques, construits à la main, pour une personne à la fois.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.72 }}
          style={{ marginTop: 42 }}
        >
          <AccentButton filled dark>
            Prendre rendez-vous
          </AccentButton>
        </motion.div>
      </motion.div>

      {/* Cue de défilement */}
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
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.65)',
          }}
        >
          Découvrir
        </span>
        <motion.div
          animate={{ y: [0, 9, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={20} color={C.accentLight} strokeWidth={1.3} />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   3 · Intro — manifeste centré bgAlt
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
            La maison
          </Eyebrow>
        </div>
      </Reveal>
      <Reveal delay={0.1}>
        <p
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 'clamp(24px,3.4vw,48px)',
            lineHeight: 1.34,
            fontWeight: 400,
            maxWidth: 960,
            margin: '0 auto',
            color: C.ink,
          }}
        >
          Un vêtement sur mesure n&apos;est pas un luxe. C&apos;est la décision
          de ne plus accepter le compromis.
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
   4 · CollectionSequence — crossfade 320vh, bgDark
   ════════════════════════════════════════════════════════════════════════════ */

function CollectionLayer({
  col,
  i,
  total,
  progress,
}: {
  col: Collection;
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
        src={col.img}
        alt={col.label}
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

function CollectionCaption({
  col,
  i,
  total,
  progress,
}: {
  col: Collection;
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
        padding: '0 24px',
        opacity,
        y,
      }}
    >
      <span
        style={{
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontSize: 'clamp(38px,8vw,110px)',
          color: 'rgba(140,114,72,0.30)',
          lineHeight: 1,
          marginBottom: 6,
        }}
      >
        {col.index}
      </span>
      <h2
        style={{
          fontFamily: SERIF,
          fontSize: 'clamp(14px,1.6vw,18px)',
          fontWeight: 400,
          letterSpacing: '0.38em',
          textTransform: 'uppercase',
          color: C.accentLight,
          margin: '0 0 18px',
        }}
      >
        {col.label}
      </h2>
      <p
        style={{
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontSize: 'clamp(16px,1.9vw,22px)',
          color: 'rgba(255,255,255,0.82)',
          maxWidth: 560,
          lineHeight: 1.6,
          margin: 0,
        }}
      >
        {col.caption}
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
      style={{ height: 2, width, background: C.accent, opacity }}
    />
  );
}

function CollectionSequence() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  return (
    <section
      ref={ref}
      id="collections"
      style={{ height: '320vh', position: 'relative', background: C.bgDark }}
    >
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        {COLLECTIONS.map((c, i) => (
          <CollectionLayer
            key={c.index}
            col={c}
            i={i}
            total={COLLECTIONS.length}
            progress={scrollYProgress}
          />
        ))}
        {/* Voile lisibilité */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to bottom, rgba(18,16,12,0.35), rgba(18,16,12,0.10) 42%, rgba(18,16,12,0.65))',
          }}
        />
        {COLLECTIONS.map((c, i) => (
          <CollectionCaption
            key={c.index}
            col={c}
            i={i}
            total={COLLECTIONS.length}
            progress={scrollYProgress}
          />
        ))}

        {/* Section label top-right */}
        <div
          style={{
            position: 'absolute',
            top: 90,
            right: 'clamp(20px,4vw,64px)',
            fontFamily: SANS,
            fontSize: 10,
            letterSpacing: '0.36em',
            textTransform: 'uppercase',
            color: 'rgba(232,220,200,0.55)',
          }}
        >
          Collections
        </div>

        {/* Points de progression */}
        <div
          style={{
            position: 'absolute',
            bottom: 42,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 10,
          }}
        >
          {COLLECTIONS.map((c, i) => (
            <ProgressDot
              key={c.index}
              i={i}
              total={COLLECTIONS.length}
              progress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   5 · PieceCards — 6 cartes blanches, bordure accent gauche
   ════════════════════════════════════════════════════════════════════════════ */
function PieceCard({ piece, i }: { piece: Piece; i: number }) {
  const [hover, setHover] = useState(false);
  const card: React.CSSProperties = {
    background: C.bgCard,
    border: `1px solid ${C.border}`,
    borderLeft: `3px solid ${hover ? C.accentDark : C.accent}`,
    padding: 'clamp(28px,3.5vw,42px) clamp(24px,3vw,36px)',
    transform: hover ? 'translateY(-8px)' : 'none',
    boxShadow: hover
      ? '0 32px 64px -28px rgba(18,16,12,0.22)'
      : '0 8px 28px -18px rgba(18,16,12,0.14)',
    transition: 'all .6s cubic-bezier(.16,1,.3,1)',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
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
            fontStyle: 'italic',
            fontSize: 'clamp(22px,2.4vw,30px)',
            fontWeight: 400,
            color: C.ink,
            margin: 0,
          }}
        >
          {piece.title}
        </h3>
        <p
          style={{
            fontFamily: SANS,
            fontSize: 11,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: C.textFaint,
            margin: 0,
            fontWeight: 400,
          }}
        >
          {piece.sub}
        </p>
        <div
          style={{
            marginTop: 16,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            fontFamily: SANS,
            fontSize: 11,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: hover ? C.accentDark : C.accent,
            transition: 'color .4s',
          }}
        >
          Sur-mesure
          <ArrowRight
            size={13}
            style={{
              transform: hover ? 'translateX(4px)' : 'none',
              transition: 'transform .5s cubic-bezier(.16,1,.3,1)',
            }}
          />
        </div>
      </article>
    </Reveal>
  );
}

function PieceCards() {
  const sec: React.CSSProperties = {
    background: C.bg,
    padding: 'clamp(88px,12vw,170px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 'clamp(18px,2.4vw,32px)',
    maxWidth: 1240,
    margin: '0 auto',
  };
  return (
    <section style={sec}>
      <div style={{ maxWidth: 1240, margin: '0 auto 56px' }}>
        <Reveal>
          <Eyebrow>Nos pièces</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(36px,5.5vw,72px)',
              fontWeight: 400,
              color: C.ink,
              margin: '20px 0 0',
              lineHeight: 1.05,
            }}
          >
            Chaque vêtement,{' '}
            <span style={{ fontStyle: 'italic', color: C.accent }}>unique.</span>
          </h2>
        </Reveal>
      </div>
      <div style={grid}>
        {PIECES.map((p, i) => (
          <PieceCard key={p.title} piece={p} i={i} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   6 · EditorialRows — 2 lignes alternées image / texte, numéros fantôme
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

function EditRowItem({ row, idx }: { row: EditRow; idx: number }) {
  const ghosts = ['01', '02'];
  const ghost = ghosts[idx] ?? '01';
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
    <div style={wrap} className="ms-editrow">
      {/* Numéro fantôme terracotta */}
      <span
        style={{
          position: 'absolute',
          top: '50%',
          [row.reverse ? 'left' : 'right']: '-40px',
          transform: 'translateY(-50%)',
          fontFamily: SERIF,
          fontSize: 'clamp(80px,12vw,180px)',
          fontWeight: 600,
          color: C.terracotta,
          opacity: 0.08,
          lineHeight: 1,
          pointerEvents: 'none',
          userSelect: 'none',
          zIndex: 0,
        }}
      >
        {ghost}
      </span>
      <Reveal y={50} style={imgWrap}>
        <ParallaxImg src={row.img} alt={row.eyebrow} />
      </Reveal>
      <div style={txt}>
        <Reveal>
          <Eyebrow color={C.textMuted}>{row.eyebrow}</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h3
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(30px,4.2vw,58px)',
              fontWeight: 400,
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
              fontFamily: SERIF,
              fontSize: 'clamp(16px,1.6vw,19px)',
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
          .ms-editrow { grid-template-columns: 1fr !important; }
          .ms-editrow > * { order: initial !important; }
        }
      `}</style>
    </div>
  );
}

function EditorialRows() {
  const sec: React.CSSProperties = {
    background: C.bg,
    padding: 'clamp(80px,11vw,160px) clamp(24px,6vw,96px)',
    overflow: 'hidden',
  };
  return (
    <section style={sec} id="surmesure">
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(80px,11vw,150px)',
        }}
      >
        {EDIT_ROWS.map((r, i) => (
          <EditRowItem key={r.eyebrow} row={r} idx={i} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   7 · AtélierPanel — sticky left image, 4 étapes à droite
   ════════════════════════════════════════════════════════════════════════════ */
function AtélierPanel() {
  const sec: React.CSSProperties = {
    background: C.bgDark,
    padding: 'clamp(88px,12vw,160px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '0.9fr 1.1fr',
    gap: 'clamp(40px,6vw,96px)',
    maxWidth: 1240,
    margin: '0 auto',
    alignItems: 'start',
  };
  const sticky: React.CSSProperties = {
    position: 'sticky',
    top: 100,
    alignSelf: 'start',
  };

  return (
    <section style={sec} id="atelier">
      <div style={grid} className="ms-atelipanel">
        {/* Image collante */}
        <div style={sticky} className="ms-atelipanel-sticky">
          <div
            style={{
              overflow: 'hidden',
              border: `1px solid ${C.borderDark}`,
              aspectRatio: '4 / 5',
            }}
          >
            <img
              src={`https://images.unsplash.com/photo-1469334031925-4650d4192253?q=80&w=900&auto=format&fit=crop`}
              alt="L'atelier Maison Solal — Le Panier, Marseille"
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
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                color: C.accent,
                marginBottom: 8,
              }}
            >
              L&apos;atelier · Le Panier
            </div>
            <div
              style={{
                fontFamily: SERIF,
                fontStyle: 'italic',
                fontSize: 17,
                color: 'rgba(232,220,200,0.72)',
                lineHeight: 1.6,
              }}
            >
              Marseille, depuis 12 ans.
            </div>
          </div>
        </div>

        {/* Étapes qui défilent */}
        <div>
          <Reveal>
            <Eyebrow color={C.accentLight}>Le processus</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(32px,4.8vw,64px)',
                fontWeight: 400,
                color: C.white,
                margin: '20px 0 56px',
                lineHeight: 1.06,
              }}
            >
              De la rencontre{' '}
              <span style={{ fontStyle: 'italic', color: C.accentLight }}>
                aux finitions
              </span>
            </h2>
          </Reveal>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {ATELIER_STEPS.map((step, i) => (
              <Reveal key={step.num} delay={0.05 * i}>
                <div
                  style={{
                    padding: '34px 0',
                    borderTop: `1px solid ${C.terracotta}`,
                    display: 'flex',
                    gap: 28,
                    alignItems: 'baseline',
                    borderTopWidth: i === 0 ? 0 : 1,
                    paddingTop: i === 0 ? 0 : 34,
                  }}
                >
                  <span
                    style={{
                      fontFamily: SERIF,
                      fontStyle: 'italic',
                      fontSize: 22,
                      color: `rgba(140,114,72,0.6)`,
                      minWidth: 36,
                    }}
                  >
                    {step.num}
                  </span>
                  <div>
                    <h4
                      style={{
                        fontFamily: SERIF,
                        fontSize: 'clamp(20px,2.2vw,28px)',
                        fontWeight: 400,
                        color: C.white,
                        margin: '0 0 10px',
                      }}
                    >
                      {step.title}
                    </h4>
                    <p
                      style={{
                        fontFamily: SERIF,
                        fontStyle: 'italic',
                        fontSize: 'clamp(15px,1.5vw,17px)',
                        lineHeight: 1.72,
                        color: 'rgba(232,220,200,0.68)',
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
          .ms-atelipanel { grid-template-columns: 1fr !important; }
          .ms-atelipanel-sticky { position: static !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   8 · Testimonials — 2 cartes blanches, cœur terracotta
   ════════════════════════════════════════════════════════════════════════════ */
function Testimonials() {
  const sec: React.CSSProperties = {
    background: C.bgAlt,
    padding: 'clamp(88px,12vw,170px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: 'clamp(28px,3.6vw,56px)',
    maxWidth: 1100,
    margin: '0 auto',
  };
  return (
    <section style={sec}>
      <div style={{ maxWidth: 1100, margin: '0 auto 58px', textAlign: 'center' }}>
        <Reveal>
          <Eyebrow color={C.textMuted} align="center">
            Elles &amp; ils témoignent
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(32px,4.8vw,64px)',
              fontWeight: 400,
              color: C.ink,
              margin: '20px 0 0',
              lineHeight: 1.06,
            }}
          >
            La parole des{' '}
            <span style={{ fontStyle: 'italic', color: C.accent }}>clients</span>
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
                boxShadow: '0 20px 56px -36px rgba(18,16,12,0.22)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Heart
                size={28}
                color={C.terracotta}
                fill={C.terracotta}
                strokeWidth={0}
              />
              <blockquote
                style={{
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  fontSize: 'clamp(17px,1.9vw,22px)',
                  lineHeight: 1.64,
                  color: C.ink,
                  margin: '22px 0 28px',
                  flex: 1,
                }}
              >
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption style={{ borderTop: `1px solid ${C.border}`, paddingTop: 20 }}>
                <div
                  style={{
                    fontFamily: SERIF,
                    fontSize: 19,
                    fontWeight: 400,
                    color: C.ink,
                  }}
                >
                  {t.name}
                </div>
                <div
                  style={{
                    fontFamily: SANS,
                    fontSize: 10.5,
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
   9 · OrderForm — bgDark, champs underline, sent state
   ════════════════════════════════════════════════════════════════════════════ */
function OrderForm() {
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [tel, setTel] = useState('');
  const [type, setType] = useState('');
  const [occasion, setOccasion] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const onSubmit = () => {
    if (!prenom || !email || !type) return;
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
    borderBottom: `1px solid rgba(140,114,72,0.38)`,
    padding: '16px 2px',
    fontFamily: SERIF,
    fontSize: 18,
    color: C.white,
    outline: 'none',
    transition: 'border-color .4s',
  };

  const fieldFocused: React.CSSProperties = {
    borderBottomColor: C.accent,
  };

  const labelSty: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 10.5,
    letterSpacing: '0.24em',
    textTransform: 'uppercase',
    color: C.accent,
    display: 'block',
    marginBottom: 4,
    fontWeight: 400,
  };

  const mkField = (id: string): React.CSSProperties => ({
    ...fieldBase,
    ...(focused === id ? fieldFocused : {}),
  });

  return (
    <section style={sec} id="contact">
      {/* Fond photo fantôme */}
      <img
        src={`https://images.unsplash.com/photo-1483985985-e99f93b85d2a?q=80&w=1600&auto=format&fit=crop`}
        alt=""
        aria-hidden="true"
        loading="lazy"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.10,
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
              fontStyle: 'italic',
              fontSize: 'clamp(36px,5.6vw,76px)',
              fontWeight: 400,
              color: C.white,
              margin: '22px 0 18px',
              lineHeight: 1.05,
            }}
          >
            Commençons par nous rencontrer
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: 'clamp(15px,1.7vw,19px)',
              lineHeight: 1.72,
              color: 'rgba(232,220,200,0.76)',
              maxWidth: 520,
              margin: '0 auto 52px',
            }}
          >
            La première rencontre est gratuite et sans engagement. Nous vous
            proposons un créneau de 45 minutes au Panier, Marseille.
          </p>
        </Reveal>

        {sent ? (
          <Reveal>
            <div
              style={{
                border: `1px solid ${C.accent}`,
                padding: 'clamp(36px,5vw,56px)',
                background: 'rgba(140,114,72,0.06)',
                textAlign: 'center',
              }}
            >
              <Heart
                size={34}
                color={C.terracotta}
                fill={C.terracotta}
                strokeWidth={0}
                style={{ marginBottom: 18 }}
              />
              <h3
                style={{
                  fontFamily: SERIF,
                  fontSize: 'clamp(26px,3vw,36px)',
                  fontWeight: 400,
                  color: C.white,
                  margin: '0 0 14px',
                }}
              >
                Merci {prenom},
              </h3>
              <p
                style={{
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  fontSize: 17,
                  color: 'rgba(232,220,200,0.76)',
                  margin: 0,
                  lineHeight: 1.7,
                }}
              >
                nous vous proposons un rendez-vous découverte dans les 48h.
                <br />
                Un message sera envoyé à{' '}
                <strong style={{ color: C.accentLight, fontStyle: 'normal' }}>
                  {email}
                </strong>
                .
              </p>
            </div>
          </Reveal>
        ) : (
          <Reveal delay={0.24}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 32,
                textAlign: 'left',
              }}
            >
              {/* Prénom */}
              <div>
                <label style={labelSty} htmlFor="ms-prenom">
                  Prénom
                </label>
                <input
                  id="ms-prenom"
                  style={mkField('prenom')}
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  onFocus={() => setFocused('prenom')}
                  onBlur={() => setFocused(null)}
                  placeholder="Marie"
                  autoComplete="given-name"
                />
              </div>

              {/* Email */}
              <div>
                <label style={labelSty} htmlFor="ms-email">
                  Adresse e-mail
                </label>
                <input
                  id="ms-email"
                  type="email"
                  style={mkField('email')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused(null)}
                  placeholder="marie@exemple.fr"
                  autoComplete="email"
                />
              </div>

              {/* Téléphone */}
              <div>
                <label style={labelSty} htmlFor="ms-tel">
                  Téléphone
                </label>
                <input
                  id="ms-tel"
                  type="tel"
                  style={mkField('tel')}
                  value={tel}
                  onChange={(e) => setTel(e.target.value)}
                  onFocus={() => setFocused('tel')}
                  onBlur={() => setFocused(null)}
                  placeholder="+33 6 00 00 00 00"
                  autoComplete="tel"
                />
              </div>

              {/* Type de pièce */}
              <div>
                <label style={labelSty} htmlFor="ms-type">
                  Type de pièce
                </label>
                <select
                  id="ms-type"
                  style={{
                    ...mkField('type'),
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    cursor: 'pointer',
                    color: type ? C.white : 'rgba(232,220,200,0.42)',
                  }}
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  onFocus={() => setFocused('type')}
                  onBlur={() => setFocused(null)}
                >
                  <option value="" style={{ color: '#12100c', background: '#faf8f4' }}>
                    Choisir un type de pièce…
                  </option>
                  {PIECE_TYPES.map((pt) => (
                    <option
                      key={pt}
                      value={pt}
                      style={{ color: '#12100c', background: '#faf8f4' }}
                    >
                      {pt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Occasion */}
              <div>
                <label style={labelSty} htmlFor="ms-occasion">
                  Occasion (optionnel)
                </label>
                <input
                  id="ms-occasion"
                  style={mkField('occasion')}
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  onFocus={() => setFocused('occasion')}
                  onBlur={() => setFocused(null)}
                  placeholder="Mariage, événement professionnel…"
                />
              </div>

              {/* Message */}
              <div>
                <label style={labelSty} htmlFor="ms-message">
                  Message (optionnel)
                </label>
                <textarea
                  id="ms-message"
                  rows={4}
                  style={{
                    ...mkField('message'),
                    resize: 'vertical',
                    fontFamily: SERIF,
                    fontSize: 18,
                  }}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onFocus={() => setFocused('message')}
                  onBlur={() => setFocused(null)}
                  placeholder="Décrivez votre projet, vos envies, vos contraintes…"
                />
              </div>

              <div style={{ marginTop: 8, textAlign: 'center' }}>
                <AccentButton filled dark onClick={onSubmit} type="button">
                  Envoyer ma demande
                </AccentButton>
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   10 · Footer — bgDarkAlt, 4 colonnes
   ════════════════════════════════════════════════════════════════════════════ */
function Footer() {
  const cols: { title: string; items: { label: string; href: string }[] }[] = [
    {
      title: 'Collections',
      items: [
        { label: 'Robes de soirée', href: '#collections' },
        { label: 'Mariées', href: '#collections' },
        { label: 'Tailleur & Costume', href: '#collections' },
        { label: 'Manteaux', href: '#collections' },
      ],
    },
    {
      title: "L'atelier",
      items: [
        { label: 'Notre philosophie', href: '#surmesure' },
        { label: 'Le processus', href: '#atelier' },
        { label: 'Matières premières', href: '#atelier' },
        { label: 'Finitions main', href: '#atelier' },
      ],
    },
    {
      title: 'Contact',
      items: [
        { label: 'Prendre rendez-vous', href: '#contact' },
        { label: 'Le Panier, Marseille', href: '#contact' },
        { label: 'Tarifs & délais', href: '#contact' },
        { label: 'Entretien & retouche', href: '#contact' },
      ],
    },
  ];

  const foot: React.CSSProperties = {
    background: C.bgDarkAlt,
    borderTop: `1px solid rgba(140,114,72,0.18)`,
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
          gap: 'clamp(32px,5vw,64px)',
        }}
        className="ms-footgrid"
      >
        {/* Brand */}
        <div>
          <div
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: 'clamp(22px,2.4vw,30px)',
              color: C.white,
              fontWeight: 400,
              letterSpacing: '0.04em',
            }}
          >
            Maison Solal
          </div>
          <p
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: 15,
              lineHeight: 1.72,
              color: 'rgba(232,220,200,0.58)',
              marginTop: 20,
              maxWidth: 320,
            }}
          >
            Couture &amp; mode sur-mesure depuis 2012. Le Panier, Marseille.
          </p>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginTop: 22,
              fontFamily: SANS,
              fontSize: 10.5,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'rgba(232,220,200,0.50)',
            }}
          >
            <MapPin size={13} color={C.accent} strokeWidth={1.5} />
            Le Panier · 13002 Marseille
          </div>
        </div>

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
                fontWeight: 500,
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
                      fontFamily: SERIF,
                      fontSize: 16,
                      color: 'rgba(232,220,200,0.68)',
                      textDecoration: 'none',
                      transition: 'color .3s',
                    }}
                    onMouseEnter={(e) =>
                      ((e.target as HTMLAnchorElement).style.color = C.accentLight)
                    }
                    onMouseLeave={(e) =>
                      ((e.target as HTMLAnchorElement).style.color =
                        'rgba(232,220,200,0.68)')
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

      {/* Barre basse */}
      <div
        style={{
          maxWidth: 1240,
          margin: '64px auto 0',
          paddingTop: 26,
          borderTop: `1px solid rgba(140,114,72,0.14)`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 14,
          fontFamily: SANS,
          fontSize: 10.5,
          letterSpacing: '0.12em',
          color: 'rgba(232,220,200,0.42)',
        }}
      >
        <span>© 2012–2026 Maison Solal. Tous droits réservés.</span>
        <span style={{ display: 'flex', gap: 24 }}>
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
          .ms-footgrid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 520px) {
          .ms-footgrid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   PAGE ROOT
   ════════════════════════════════════════════════════════════════════════════ */
export default function Page() {
  const root: React.CSSProperties = {
    background: C.bg,
    color: C.ink,
    fontFamily: SERIF,
    overflowX: 'hidden',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
  };
  return (
    <main style={root} suppressHydrationWarning>
      {/* Google Fonts */}
      <style>{`@import url('${FONT_LINK}');`}</style>

      <Nav />
      <Hero />
      <Intro />
      <CollectionSequence />
      <PieceCards />
      <EditorialRows />
      <AtélierPanel />
      <Testimonials />
      <OrderForm />
      <Footer />
    </main>
  );
}
