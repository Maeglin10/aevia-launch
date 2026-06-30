'use client';

import React, { useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  MotionValue,
  useMotionValue,
} from 'framer-motion';
import { ArrowRight, ChevronDown, Scissors } from 'lucide-react';

/* ════════════════════════════════════════════════════════════════════════════
   L'ATELIER SOIE — Couture & Broderie sur-mesure · Lyon 2e
   Photographie réelle + chorégraphie de défilement éditoriale (style maison
   de couture × patrimoine lyonnais × soie). Auto-suffisant. 'use client'.
   ════════════════════════════════════════════════════════════════════════════ */

/* ── Google Fonts ─────────────────────────────────────────────────────────── */
const FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Didact+Gothic&family=Cormorant:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&display=swap';

/* ── Palette ─────────────────────────────────────────────────────────────── */
const C = {
  bg: '#faf9f6',
  bgAlt: '#f2efea',
  bgDark: '#14100c',
  bgDarkAlt: '#0c0806',
  bgCard: '#ffffff',
  accent: '#7c6850',
  accentDark: '#604e3a',
  accentLight: '#e8ddd0',
  white: '#ffffff',
  ink: '#14100c',
  textMuted: '#3c3028',
  textFaint: '#9a8c80',
  border: '#ddd4c8',
  borderDark: 'rgba(124,104,80,0.2)',
  silk: '#c8b090',
} as const;

const SERIF = "'Cormorant', Georgia, serif" as const;
const SANS = "'Didact Gothic', system-ui, sans-serif" as const;

/* ── Easing partagé ──────────────────────────────────────────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ── Photo URL factory ───────────────────────────────────────────────────── */
const photo = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?q=80&w=${w}&auto=format&fit=crop`;

/* ════════════════════════════════════════════════════════════════════════════
   Interfaces de données
   ════════════════════════════════════════════════════════════════════════════ */

interface Creation {
  index: string;
  label: string;
  title: string;
  body: string;
  imgId: string;
}

interface Piece {
  name: string;
  sub: string;
}

interface EditRow {
  eyebrow: string;
  imgId: string;
  title: React.ReactNode;
  body: string;
  reverse: boolean;
}

interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

interface CraftStep {
  num: string;
  title: string;
  body: string;
}

/* ════════════════════════════════════════════════════════════════════════════
   Données
   ════════════════════════════════════════════════════════════════════════════ */

const CREATIONS: Creation[] = [
  {
    index: 'I',
    label: 'SOIE & ORGANZA',
    title: 'Soie & Organza',
    body: 'Robe du soir en soie naturelle, étole brodée à la main, bustier organza — Lyon, capitale mondiale de la soie, dans chaque fil.',
    imgId: '1483985985-e99f93b85d2a',
  },
  {
    index: 'II',
    label: 'BRODERIE MAIN',
    title: 'Broderie Main',
    body: "Broderie lyonnaise, fil d\'or, sequins cousus un à un — techniques transmises depuis les canuts du 18e siècle.",
    imgId: '1515372931673-a36374d4af61',
  },
  {
    index: 'III',
    label: 'SCÈNE & SPECTACLE',
    title: 'Scène & Spectacle',
    body: 'Costumes de théâtre, opéra, ballet — précision de coupe pour permettre le mouvement sans jamais brider la performance.',
    imgId: '1469334031925-4650d4192253',
  },
];

const PIECES: Piece[] = [
  { name: 'Robe de soirée soie', sub: 'Couture sur-mesure' },
  { name: 'Robe de mariée', sub: 'Création exclusive' },
  { name: 'Broderie lyonnaise', sub: 'Technique traditionnelle' },
  { name: 'Costume de scène', sub: 'Théâtre · Opéra · Ballet' },
  { name: 'Retouche haute couture', sub: 'Précision & soin' },
  { name: 'Personnalisation & monogramme', sub: 'Broderie & impression' },
];

const EDIT_ROWS: EditRow[] = [
  {
    eyebrow: 'Notre héritage',
    imgId: '1483985985-e99f93b85d2a',
    title: (
      <>
        Lyon,{' '}
        <span style={{ fontStyle: 'italic' }}>
          la soie
          <br />
          dans l&rsquo;âme.
        </span>
      </>
    ),
    body: "Lyon est la capitale mondiale de la soie depuis le XVIIIe siècle. L'Atelier Soie travaille en partenariat avec la Maison Prelle, fournisseur de soie grège de Croix-Rousse, pour perpétuer les techniques des canuts lyonnais — passeurs d'un savoir-faire textile sans équivalent.",
    reverse: false,
  },
  {
    eyebrow: "L\'atelier",
    imgId: '1515372931673-a36374d4af61',
    title: (
      <>
        Vieux-Lyon
        <br />
        <span style={{ fontStyle: 'italic' }}>&amp; Lyon 2e.</span>
      </>
    ),
    body: "Deux ateliers, une même exigence. Le premier, dans le Vieux-Lyon, accueille consultations et essayages. Le second, dans le 2e arrondissement, abrite la salle de coupe et les métiers à broder. Visites sur rendez-vous. Visites de l'atelier possibles pour les curieux du geste.",
    reverse: true,
  },
];

const CRAFT_STEPS: CraftStep[] = [
  {
    num: 'I',
    title: 'Consultation & croquis',
    body: 'Votre vision traduite en dessin technique en 1h — proportions, matières, silhouette. Chaque croquis est personnel et reste votre propriété.',
  },
  {
    num: 'II',
    title: 'Sélection des matières',
    body: 'Soie de Croix-Rousse, dentelle de Calais, crêpe de chine, organza plissé — nous vous guidons vers la matière qui épouse votre projet.',
  },
  {
    num: 'III',
    title: '4 à 6 essayages',
    body: "Corrections progressives jusqu\'à l\'ajustement parfait. Chaque essayage est une conversation entre votre corps, le tissu et notre œil.",
  },
  {
    num: 'IV',
    title: 'Finitions broderie',
    body: "Chaque couture intérieure aussi soignée que l\'extérieur. Broderies, surpiqûres, biais cousus à la main — les finitions sont notre signature.",
  },
];

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Je chante à l'Opéra de Lyon depuis dix ans, et L'Atelier Soie habille tous mes rôles. Leurs costumes vibrent avec ma voix — la soie suit le souffle, le bustier tient sans jamais contraindre. Ce sont des artisanes qui comprennent le corps en mouvement.",
    name: 'Isabelle Carron',
    role: 'Soprano · Opéra de Lyon',
  },
  {
    quote:
      "Je voulais une robe qui soit un hommage à la robe de mariée de ma grand-mère. Elles ont tout reconstitué depuis une photographie de 1962 — le col, la broderie, le tombé. Je ne pensais pas que c'était possible. C'était au-delà.",
    name: 'Camille Berthet',
    role: 'Mariée · Lyon, juin 2025',
  },
];

/* ════════════════════════════════════════════════════════════════════════════
   Primitives
   ════════════════════════════════════════════════════════════════════════════ */

/** Étiquette fine en capitales avec filets taupe. */
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
    fontSize: 10.5,
    letterSpacing: '0.40em',
    textTransform: 'uppercase',
    color,
    fontWeight: 400,
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

/** Bouton taupe, contour fin, flèche qui glisse au survol. */
function TaupeButton({
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
    fontSize: 11,
    letterSpacing: '0.28em',
    textTransform: 'uppercase',
    fontWeight: 400,
    cursor: 'pointer',
    border: `1px solid ${C.accent}`,
    background: filled ? C.accent : 'transparent',
    color: filled ? C.white : C.accent,
    transition: 'all .5s cubic-bezier(.16,1,.3,1)',
  };
  const hov: React.CSSProperties = hover
    ? filled
      ? { background: C.accentDark, borderColor: C.accentDark, transform: 'translateY(-2px)' }
      : { background: 'rgba(124,104,80,0.08)', transform: 'translateY(-2px)' }
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

/** Image avec léger drift parallaxe interne. */
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
    { label: "L\'atelier", href: '#intro' },
    { label: 'Créations', href: '#creations' },
    { label: 'Savoir-faire', href: '#craft' },
    { label: 'Témoignages', href: '#temoignages' },
    { label: 'Contact', href: '#commande' },
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
    background: solid ? 'rgba(20,16,12,0.96)' : 'transparent',
    backdropFilter: solid ? 'blur(14px) saturate(110%)' : 'none',
    WebkitBackdropFilter: solid ? 'blur(14px) saturate(110%)' : 'none',
    borderBottom: solid
      ? `1px solid rgba(124,104,80,0.28)`
      : '1px solid transparent',
    transition: 'all .6s cubic-bezier(.16,1,.3,1)',
  };

  const brand: React.CSSProperties = {
    fontFamily: SERIF,
    fontStyle: 'italic',
    fontSize: 'clamp(18px,1.5vw,22px)',
    letterSpacing: '0.04em',
    color: C.white,
    fontWeight: 400,
    textDecoration: 'none',
  };

  const linkRow: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'clamp(18px,2.4vw,38px)',
  };

  return (
    <>
      <nav style={bar}>
      <a href="#hero" style={brand}>
        L&rsquo;Atelier Soie
      </a>
      <div style={linkRow} className="as-navlinks">
        {links.map((l) => (
          <NavLink key={l.label} label={l.label} href={l.href} />
        ))}
      </div>
      <div className="as-navcta">
        <a href="#commande" style={{ textDecoration: 'none' }}>
          <TaupeButton filled>Prendre rendez-vous</TaupeButton>
        </a>
      </div>
      
        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="as-burger"
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
          .as-navlinks{ display:none !important; }
          .as-burger { display: flex !important; flex-direction: column; }
          .as-navcta{ display:none !important; }
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
        fontSize: 11,
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color: h ? C.silk : 'rgba(255,255,255,0.82)',
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
          background: C.silk,
          transition: 'width .5s cubic-bezier(.16,1,.3,1)',
        }}
      />
    </a>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   2 · HERO
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
  const cueOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);

  const section: React.CSSProperties = {
    position: 'relative',
    height: '100vh',
    minHeight: 640,
    overflow: 'hidden',
    background: C.bgDark,
  };

  return (
    <section ref={ref} style={section} id="hero">
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
          src={photo('1483985985-e99f93b85d2a', 2000)}
          alt="Atelier de couture soie naturelle Lyon"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </motion.div>

      {/* Voile sombre bas + voile taupe */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(20,16,12,0.38) 0%, rgba(20,16,12,0.06) 38%, rgba(20,16,12,0.44) 70%, rgba(20,16,12,0.90) 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(120% 80% at 50% 30%, transparent 38%, rgba(124,104,80,0.28) 100%)',
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
          <Eyebrow color={C.silk} align="center">
            Couture &amp; Broderie · Lyon
          </Eyebrow>
        </Reveal>

        <motion.h1
          initial={{ opacity: 0, y: 44 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.18 }}
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontWeight: 300,
            color: C.white,
            fontSize: 'clamp(3.5rem,7.5vw,9rem)',
            lineHeight: 0.96,
            letterSpacing: '-0.01em',
            margin: '28px 0 24px',
            textShadow: '0 12px 60px rgba(0,0,0,0.45)',
          }}
        >
          Couture
          <br />
          lyonnaise.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.48 }}
          style={{
            fontFamily: SANS,
            fontWeight: 300,
            fontStyle: 'italic',
            fontSize: 'clamp(14px,1.6vw,18px)',
            color: 'rgba(255,255,255,0.82)',
            maxWidth: 500,
            lineHeight: 1.65,
            letterSpacing: '0.02em',
          }}
        >
          Robes de soirée, robes de mariée, costumes de scène — confectionnés
          à la main au cœur de Lyon, ville de la soie.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.72 }}
          style={{ marginTop: 44 }}
        >
          <TaupeButton filled>Prendre rendez-vous</TaupeButton>
        </motion.div>
      </motion.div>

      {/* Indice de défilement */}
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
            letterSpacing: '0.36em',
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
          <ChevronDown size={20} color={C.silk} strokeWidth={1.3} />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   3 · INTRO
   ════════════════════════════════════════════════════════════════════════════ */
function Intro() {
  const sec: React.CSSProperties = {
    background: C.bgAlt,
    padding: 'clamp(96px,14vw,200px) clamp(24px,8vw,160px)',
    textAlign: 'center',
  };
  return (
    <section style={sec} id="intro">
      <Reveal>
        <p
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: 'clamp(22px,3.2vw,44px)',
            lineHeight: 1.36,
            color: C.ink,
            maxWidth: 900,
            margin: '0 auto',
          }}
        >
          La couture lyonnaise ne copie pas la mode. Elle l&rsquo;ignore pour mieux la
          définir.
        </p>
      </Reveal>
      <Reveal delay={0.16}>
        <div
          style={{
            width: 1,
            height: 88,
            background: `linear-gradient(${C.accent}, transparent)`,
            margin: '56px auto 0',
          }}
        />
      </Reveal>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   4 · CREATION SEQUENCE — sticky crossfade 320vh
   ════════════════════════════════════════════════════════════════════════════ */

function CreationImage({
  creation,
  i,
  total,
  progress,
}: {
  creation: Creation;
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
        src={photo(creation.imgId)}
        alt={creation.title}
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

function CreationCaption({
  creation,
  i,
  total,
  progress,
}: {
  creation: Creation;
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
          fontWeight: 300,
          fontSize: 'clamp(36px,8vw,110px)',
          color: 'rgba(200,176,144,0.28)',
          lineHeight: 1,
          marginBottom: 8,
        }}
      >
        {creation.index}
      </span>
      <h2
        style={{
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontWeight: 300,
          fontSize: 'clamp(36px,6vw,88px)',
          color: C.white,
          lineHeight: 1.02,
          margin: 0,
          textShadow: '0 8px 40px rgba(0,0,0,0.5)',
        }}
      >
        {creation.title}
      </h2>
      <p
        style={{
          fontFamily: SANS,
          fontSize: 'clamp(13px,1.4vw,16px)',
          color: 'rgba(255,255,255,0.78)',
          marginTop: 20,
          maxWidth: 480,
          lineHeight: 1.7,
          letterSpacing: '0.01em',
        }}
      >
        {creation.body}
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
  const width = useTransform(progress, [i * seg, (i + 1) * seg], [10, 34]);
  return (
    <motion.div
      style={{ height: 2, width, background: C.silk, opacity }}
    />
  );
}

function CreationSequence() {
  const n = CREATIONS.length;
  const progress = useMotionValue(0.5 / n);
  const [active, setActive] = useState(0);
  const goTo = (i: number) => {
    setActive(i);
    progress.set((i + 0.5) / n);
  };

  return (
    <section
      style={{ height: '100vh', overflow: 'hidden', position: 'relative', background: C.bgDark }}
      id="creations"
    >
      <div
        style={{
          position: 'relative',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {/* Section label top-right */}
        <div
          style={{
            position: 'absolute',
            top: 32,
            right: 36,
            zIndex: 10,
            fontFamily: SANS,
            fontSize: 10,
            letterSpacing: '0.38em',
            textTransform: 'uppercase',
            color: 'rgba(200,176,144,0.6)',
          }}
        >
          Créations
        </div>

        {/* Images crossfade */}
        {CREATIONS.map((c, i) => (
          <CreationImage
            key={c.index}
            creation={c}
            i={i}
            total={CREATIONS.length}
            progress={progress}
          />
        ))}

        {/* Voile lisibilité */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to bottom, rgba(20,16,12,0.28), rgba(20,16,12,0.08) 42%, rgba(20,16,12,0.60))',
          }}
        />

        {/* Captions crossfade */}
        {CREATIONS.map((c, i) => (
          <CreationCaption
            key={c.index}
            creation={c}
            i={i}
            total={CREATIONS.length}
            progress={progress}
          />
        ))}

        {/* Points de progression taupe */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 12,
            zIndex: 4,
          }}
        >
          {CREATIONS.map((c, i) => (
            <ProgressDot
              key={c.index}
              i={i}
              total={CREATIONS.length}
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
   5 · PIECE CARDS
   ════════════════════════════════════════════════════════════════════════════ */
function PieceCard({ piece, i }: { piece: Piece; i: number }) {
  const [hover, setHover] = useState(false);
  const card: React.CSSProperties = {
    background: hover ? C.bgCard : C.bgCard,
    border: `1px solid ${hover ? C.accent : C.border}`,
    borderLeft: `3px solid ${C.accent}`,
    padding: 'clamp(24px,3vw,38px)',
    transform: hover ? 'translateY(-8px)' : 'none',
    boxShadow: hover
      ? '0 32px 64px -32px rgba(20,16,12,0.18)'
      : '0 8px 28px -20px rgba(20,16,12,0.10)',
    transition: 'all .55s cubic-bezier(.16,1,.3,1)',
    cursor: 'pointer',
  };
  return (
    <Reveal delay={i * 0.08} style={{ height: '100%' }}>
      <article
        style={card}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div
          style={{
            fontFamily: SANS,
            fontSize: 10,
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: C.textFaint,
            marginBottom: 12,
          }}
        >
          {piece.sub}
        </div>
        <h3
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontWeight: 400,
            fontSize: 'clamp(20px,2vw,26px)',
            color: C.ink,
            margin: '0 0 16px',
            lineHeight: 1.2,
          }}
        >
          {piece.name}
        </h3>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            fontFamily: SANS,
            fontSize: 10.5,
            letterSpacing: '0.20em',
            textTransform: 'uppercase',
            color: hover ? C.accentDark : C.accent,
            transition: 'color .4s',
          }}
        >
          Découvrir
          <ArrowRight
            size={13}
            style={{
              transform: hover ? 'translateX(5px)' : 'none',
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
    padding: 'clamp(90px,12vw,170px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 'clamp(18px,2.4vw,30px)',
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
              fontStyle: 'italic',
              fontWeight: 300,
              fontSize: 'clamp(34px,5.2vw,70px)',
              color: C.ink,
              margin: '20px 0 0',
              lineHeight: 1.06,
            }}
          >
            Ce que nous{' '}
            <span style={{ color: C.accent }}>créons</span>
          </h2>
        </Reveal>
      </div>
      <div style={grid}>
        {PIECES.map((p, i) => (
          <PieceCard key={p.name} piece={p} i={i} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   6 · EDITORIAL ROWS
   ════════════════════════════════════════════════════════════════════════════ */
function EditorialRowItem({ row, num }: { row: EditRow; num: number }) {
  const wrap: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 'clamp(36px,6vw,90px)',
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
  const ghost: React.CSSProperties = {
    position: 'absolute',
    top: -30,
    right: row.reverse ? 'auto' : -20,
    left: row.reverse ? -20 : 'auto',
    fontFamily: SERIF,
    fontStyle: 'italic',
    fontWeight: 600,
    fontSize: 'clamp(100px,14vw,200px)',
    color: C.silk,
    opacity: 0.10,
    lineHeight: 1,
    userSelect: 'none',
    pointerEvents: 'none',
    zIndex: 0,
  };
  return (
    <div style={wrap} className="as-editrow">
      <span style={ghost}>{String(num).padStart(2, '0')}</span>
      <Reveal y={50} style={imgWrap}>
        <ParallaxImg src={photo(row.imgId, 800)} alt={typeof row.title === 'string' ? row.title : row.eyebrow} />
      </Reveal>
      <div style={{ ...txt, zIndex: 1 }}>
        <Reveal>
          <Eyebrow color={C.accent}>{row.eyebrow}</Eyebrow>
        </Reveal>
        <Reveal delay={0.1}>
          <h3
            style={{
              fontFamily: SERIF,
              fontWeight: 400,
              fontSize: 'clamp(30px,4vw,56px)',
              color: C.ink,
              margin: '18px 0 22px',
              lineHeight: 1.1,
            }}
          >
            {row.title}
          </h3>
        </Reveal>
        <Reveal delay={0.18}>
          <p
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: 'clamp(15px,1.5vw,18px)',
              lineHeight: 1.78,
              color: C.textMuted,
              maxWidth: 440,
            }}
          >
            {row.body}
          </p>
        </Reveal>
      </div>
      <style>{`
        @media (max-width: 860px){
          .as-editrow{ grid-template-columns: 1fr !important; }
          .as-editrow > *{ order: initial !important; }
        }
      `}</style>
    </div>
  );
}

function EditorialRows() {
  const sec: React.CSSProperties = {
    background: C.bg,
    padding: 'clamp(70px,10vw,140px) clamp(24px,6vw,96px)',
  };
  return (
    <section style={sec}>
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
          <EditorialRowItem key={r.eyebrow} row={r} num={i + 1} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   7 · CRAFT PANEL — sticky image gauche, 4 étapes défilent à droite
   ════════════════════════════════════════════════════════════════════════════ */
function CraftPanel() {
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
    <section style={sec} id="craft">
      <div style={grid} className="as-craftpanel">
        {/* Image collante gauche */}
        <div style={stickySide} className="as-craftpanel-sticky">
          <div
            style={{
              overflow: 'hidden',
              border: `1px solid ${C.borderDark}`,
              aspectRatio: '4 / 5',
            }}
          >
            <img
              src={photo('1469334031925-4650d4192253', 900)}
              alt="Atelier L'Atelier Soie — savoir-faire lyonnais"
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
                fontSize: 10,
                letterSpacing: '0.32em',
                textTransform: 'uppercase',
                color: C.silk,
                marginBottom: 8,
              }}
            >
              L&rsquo;Atelier Soie · Lyon
            </div>
            <div
              style={{
                fontFamily: SERIF,
                fontStyle: 'italic',
                fontSize: 17,
                color: 'rgba(255,255,255,0.65)',
                lineHeight: 1.55,
              }}
            >
              «&thinsp;Chaque pièce est une conversation entre votre corps et le
              tissu.&thinsp;»
            </div>
          </div>
        </div>

        {/* Étapes défilantes droite */}
        <div>
          <Reveal>
            <Eyebrow color={C.silk}>Notre processus</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2
              style={{
                fontFamily: SERIF,
                fontStyle: 'italic',
                fontWeight: 300,
                fontSize: 'clamp(32px,4.6vw,64px)',
                color: C.white,
                margin: '20px 0 52px',
                lineHeight: 1.06,
              }}
            >
              De la consultation
              <br />
              <span style={{ color: C.silk }}>aux finitions.</span>
            </h2>
          </Reveal>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {CRAFT_STEPS.map((step, i) => (
              <Reveal key={step.num} delay={0.06 * i}>
                <div
                  style={{
                    padding: 'clamp(28px,3.5vw,44px) 0',
                    borderTop: `1px solid rgba(200,176,144,0.20)`,
                    display: 'flex',
                    gap: 'clamp(20px,3vw,36px)',
                    alignItems: 'baseline',
                  }}
                >
                  <span
                    style={{
                      fontFamily: SERIF,
                      fontStyle: 'italic',
                      fontWeight: 300,
                      fontSize: 'clamp(20px,2.2vw,28px)',
                      color: 'rgba(200,176,144,0.50)',
                      minWidth: 32,
                      flexShrink: 0,
                    }}
                  >
                    {step.num}
                  </span>
                  <div>
                    <h4
                      style={{
                        fontFamily: SERIF,
                        fontSize: 'clamp(20px,2vw,26px)',
                        fontWeight: 400,
                        color: C.white,
                        margin: '0 0 10px',
                        lineHeight: 1.2,
                      }}
                    >
                      {step.title}
                    </h4>
                    <p
                      style={{
                        fontFamily: SERIF,
                        fontStyle: 'italic',
                        fontSize: 'clamp(14px,1.3vw,16.5px)',
                        lineHeight: 1.72,
                        color: 'rgba(255,255,255,0.60)',
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
        @media (max-width: 860px){
          .as-craftpanel{ grid-template-columns: 1fr !important; }
          .as-craftpanel-sticky{ position: static !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   8 · TESTIMONIALS
   ════════════════════════════════════════════════════════════════════════════ */
function TestimonialCard({ t, i }: { t: Testimonial; i: number }) {
  return (
    <Reveal delay={i * 0.12} style={{ height: '100%' }}>
      <figure
        style={{
          background: C.bgCard,
          border: `1px solid ${C.border}`,
          padding: 'clamp(32px,4vw,52px)',
          margin: 0,
          height: '100%',
          boxSizing: 'border-box',
          boxShadow: '0 20px 56px -40px rgba(20,16,12,0.22)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Scissors size={28} color={C.accent} strokeWidth={1.3} />
        <blockquote
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: 'clamp(17px,1.8vw,22px)',
            lineHeight: 1.62,
            color: C.ink,
            margin: '22px 0 28px',
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
              fontSize: 18,
              color: C.accentDark,
              fontWeight: 400,
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
  );
}

function Testimonials() {
  const sec: React.CSSProperties = {
    background: C.bgAlt,
    padding: 'clamp(90px,12vw,170px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: 'clamp(28px,3.6vw,52px)',
    maxWidth: 1180,
    margin: '0 auto',
  };
  return (
    <section style={sec} id="temoignages">
      <div style={{ maxWidth: 1180, margin: '0 auto 60px', textAlign: 'center' }}>
        <Reveal>
          <Eyebrow color={C.accent} align="center">
            Elles témoignent
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.1}>
          <h2
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontWeight: 300,
              fontSize: 'clamp(32px,4.8vw,64px)',
              color: C.ink,
              margin: '20px 0 0',
              lineHeight: 1.06,
            }}
          >
            La parole de nos{' '}
            <span style={{ color: C.accent }}>clientes</span>
          </h2>
        </Reveal>
      </div>
      <div style={grid}>
        {TESTIMONIALS.map((t, i) => (
          <TestimonialCard key={t.name} t={t} i={i} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   9 · ORDER FORM
   ════════════════════════════════════════════════════════════════════════════ */
function OrderForm() {
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [piece, setPiece] = useState('');
  const [occasion, setOccasion] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prenom || !email || !piece) return;
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
    borderBottom: `1px solid rgba(200,176,144,0.38)`,
    padding: '15px 2px',
    fontFamily: SERIF,
    fontSize: 17,
    color: C.white,
    outline: 'none',
    transition: 'border-color .4s',
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 10,
    letterSpacing: '0.28em',
    textTransform: 'uppercase',
    color: C.silk,
    display: 'block',
    marginBottom: 4,
  };

  const PIECE_OPTIONS = [
    'Robe de soirée',
    'Robe de mariée',
    'Costume scénique',
    'Broderie & personnalisation',
    'Retouche haute couture',
    'Autre',
  ];

  return (
    <section style={sec} id="commande">
      {/* Photo de fond subtile */}
      <img
        src={photo('1483985985-e99f93b85d2a', 1200)}
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
          <Eyebrow color={C.silk} align="center">
            Prendre rendez-vous
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontWeight: 300,
              fontSize: 'clamp(36px,5.5vw,76px)',
              color: C.white,
              margin: '22px 0 18px',
              lineHeight: 1.04,
            }}
          >
            Parlons de votre{' '}
            <span style={{ color: C.silk }}>projet</span>
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontWeight: 300,
              fontSize: 'clamp(15px,1.5vw,18px)',
              lineHeight: 1.72,
              color: 'rgba(255,255,255,0.72)',
              maxWidth: 520,
              margin: '0 auto 52px',
            }}
          >
            Chaque création commence par une rencontre. Décrivez-nous votre pièce
            souhaitée et nous vous proposerons un premier rendez-vous dans les 48h.
          </p>
        </Reveal>

        {sent ? (
          <Reveal>
            <div
              style={{
                border: `1px solid rgba(200,176,144,0.45)`,
                padding: 'clamp(36px,5vw,56px)',
                background: 'rgba(124,104,80,0.08)',
              }}
            >
              <Scissors size={32} color={C.silk} strokeWidth={1.2} />
              <h3
                style={{
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  fontWeight: 300,
                  fontSize: 'clamp(26px,3vw,36px)',
                  color: C.white,
                  margin: '20px 0 14px',
                }}
              >
                Merci {prenom}, nous vous proposons un premier
                rendez-vous dans les 48h.
              </h3>
              <p
                style={{
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  fontSize: 16,
                  color: 'rgba(255,255,255,0.66)',
                  margin: 0,
                }}
              >
                Nous vous contacterons à{' '}
                <strong style={{ color: C.silk, fontStyle: 'normal' }}>
                  {email}
                </strong>
                {telephone ? ` ou au ${telephone}` : ''}.
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
              {/* Ligne prénom + email */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 24,
                }}
                className="as-form-row"
              >
                <div>
                  <label style={labelStyle} htmlFor="as-prenom">
                    Prénom *
                  </label>
                  <input
                    id="as-prenom"
                    required
                    style={fieldBase}
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    placeholder="Marie"
                    autoComplete="given-name"
                  />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="as-email">
                    Email *
                  </label>
                  <input
                    id="as-email"
                    required
                    type="email"
                    style={fieldBase}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="marie@exemple.fr"
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Téléphone */}
              <div>
                <label style={labelStyle} htmlFor="as-telephone">
                  Téléphone
                </label>
                <input
                  id="as-telephone"
                  type="tel"
                  style={fieldBase}
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  placeholder="+33 6 00 00 00 00"
                  autoComplete="tel"
                />
              </div>

              {/* Pièce souhaitée */}
              <div>
                <label style={labelStyle} htmlFor="as-piece">
                  Pièce souhaitée *
                </label>
                <select
                  id="as-piece"
                  required
                  style={{
                    ...fieldBase,
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    cursor: 'pointer',
                    color: piece ? C.white : 'rgba(255,255,255,0.38)',
                  }}
                  value={piece}
                  onChange={(e) => setPiece(e.target.value)}
                >
                  <option value="" style={{ color: '#000' }}>
                    Choisir une pièce…
                  </option>
                  {PIECE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt} style={{ color: '#000' }}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Occasion */}
              <div>
                <label style={labelStyle} htmlFor="as-occasion">
                  Occasion
                </label>
                <input
                  id="as-occasion"
                  style={fieldBase}
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  placeholder="Soirée de gala, mariage, représentation…"
                />
              </div>

              {/* Message */}
              <div>
                <label style={labelStyle} htmlFor="as-message">
                  Message
                </label>
                <textarea
                  id="as-message"
                  rows={4}
                  style={{
                    ...fieldBase,
                    resize: 'vertical',
                    minHeight: 100,
                  }}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Décrivez votre projet, inspirations, couleurs, délais souhaités…"
                />
              </div>

              <div style={{ textAlign: 'center', marginTop: 8 }}>
                <TaupeButton filled type="submit">
                  Envoyer ma demande
                </TaupeButton>
              </div>
            </form>
          </Reveal>
        )}
      </div>
      <style>{`
        @media (max-width: 860px){
          .as-form-row{ grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   10 · FOOTER
   ════════════════════════════════════════════════════════════════════════════ */
function Footer() {
  const cols: { title: string; items: { label: string; href: string }[] }[] = [
    {
      title: 'Créations',
      items: [
        { label: 'Robes de soirée', href: '#creations' },
        { label: 'Robes de mariée', href: '#creations' },
        { label: 'Broderie main', href: '#creations' },
        { label: 'Costumes de scène', href: '#creations' },
      ],
    },
    {
      title: "L\'atelier",
      items: [
        { label: 'Notre héritage', href: '#intro' },
        { label: 'Savoir-faire', href: '#craft' },
        { label: 'Témoignages', href: '#temoignages' },
        { label: 'Prendre rendez-vous', href: '#commande' },
      ],
    },
    {
      title: 'Informations',
      items: [
        { label: 'Lyon 2e — sur rendez-vous', href: '#commande' },
        { label: 'Vieux-Lyon — sur rendez-vous', href: '#commande' },
        { label: 'Mentions légales', href: "/templates/impact-265" },
        { label: 'Confidentialité', href: "/templates/impact-265" },
      ],
    },
  ];

  const foot: React.CSSProperties = {
    background: C.bgDarkAlt,
    borderTop: `1px solid rgba(124,104,80,0.18)`,
    padding: 'clamp(70px,9vw,110px) clamp(24px,6vw,96px) 40px',
  };

  return (
    <footer id="contact" style={foot}>
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.5fr repeat(3, 1fr)',
          gap: 'clamp(32px,4.5vw,60px)',
        }}
        className="as-footgrid"
      >
        {/* Brand col */}
        <div>
          <a
            href="#hero"
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: 'clamp(20px,1.8vw,26px)',
              color: C.white,
              textDecoration: 'none',
              display: 'block',
              marginBottom: 18,
            }}
          >
            L&rsquo;Atelier Soie
          </a>
          <p
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: 15,
              lineHeight: 1.68,
              color: 'rgba(255,255,255,0.52)',
              maxWidth: 300,
              margin: '0 0 22px',
            }}
          >
            Couture &amp; Broderie sur-mesure. Lyon, capitale de la soie.
          </p>
          <div
            style={{
              fontFamily: SANS,
              fontSize: 10,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: C.silk,
              opacity: 0.7,
            }}
          >
            Lyon 2e · Vieux-Lyon
          </div>
        </div>

        {/* Nav cols */}
        {cols.map((c) => (
          <div key={c.title}>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 10,
                letterSpacing: '0.30em',
                textTransform: 'uppercase',
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
                  <a
                    href={it.href}
                    style={{
                      fontFamily: SERIF,
                      fontSize: 15.5,
                      color: 'rgba(255,255,255,0.60)',
                      textDecoration: 'none',
                      transition: 'color .3s',
                    }}
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
          margin: '60px auto 0',
          paddingTop: 26,
          borderTop: `1px solid rgba(124,104,80,0.14)`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
          fontFamily: SANS,
          fontSize: 10.5,
          letterSpacing: '0.10em',
          color: 'rgba(255,255,255,0.38)',
        }}
      >
        <span>
          © 2026 L&rsquo;Atelier Soie — Lyon. Tous droits réservés.
        </span>
        <span>
          Couture &amp; Broderie sur-mesure · Haute Couture Lyonnaise
        </span>
      </div>
      <style>{`
        @media (max-width: 860px){
          .as-footgrid{ grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 540px){
          .as-footgrid{ grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════════════════════════════════════ */
export default function Page() {
  const root: React.CSSProperties = {
    background: C.bgDark,
    color: C.ink,
    fontFamily: SERIF,
    overflowX: 'hidden',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
  };

  return (
    <main style={root} suppressHydrationWarning>
      {/* Google Fonts */}
      <style>{`@import url('${FONTS_URL}');`}</style>

      <Nav />
      <Hero />
      <Intro />
      <CreationSequence />
      <PieceCards />
      <EditorialRows />
      <CraftPanel />
      <Testimonials />
      <OrderForm />
      <Footer />
    </main>
  );
}
