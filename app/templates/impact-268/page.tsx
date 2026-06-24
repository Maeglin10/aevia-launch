'use client';

import React, { useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  MotionValue,
  useMotionValue,
  animate,
} from 'framer-motion';
import { ArrowRight, ChevronDown, Leaf, MapPin } from 'lucide-react';

/* ════════════════════════════════════════════════════════════════════════════
   VERT HORIZON — Paysagiste & Architecture de Jardin · Île-de-France
   Chorégraphie de défilement éditoriale, crossfade chapitré 320vh,
   panneau de méthodologie collant, formulaire de devis interactif.
   Auto-suffisant. 'use client'.
   ════════════════════════════════════════════════════════════════════════════ */

/* ── Google Fonts ────────────────────────────────────────────────────────── */
const FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Tenor+Sans&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap';

/* ── Palette ─────────────────────────────────────────────────────────────── */
const C = {
  bg: '#f3f6f0',
  bgAlt: '#e4ebe0',
  bgDark: '#0a1408',
  bgDarkAlt: '#060c04',
  bgCard: '#ffffff',
  accent: '#4a7a3a',
  accentDark: '#366030',
  accentLight: '#c8dcc0',
  white: '#ffffff',
  ink: '#0a1408',
  textMuted: '#284020',
  textFaint: '#6a8a60',
  border: '#c0d4b8',
  borderDark: 'rgba(74,122,58,0.2)',
  stone: '#8a7a60',
} as const;

const SERIF = "'Crimson Pro', Georgia, serif" as const;
const SANS = "'Tenor Sans', system-ui, sans-serif" as const;

/* ── Easing partagé ──────────────────────────────────────────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ── Photo helper ────────────────────────────────────────────────────────── */
function photo(id: string, w = 1600) {
  return `https://images.unsplash.com/photo-${id}?q=80&w=${w}&auto=format&fit=crop`;
}

/* ════════════════════════════════════════════════════════════════════════════
   TypeScript interfaces
   ════════════════════════════════════════════════════════════════════════════ */

interface Project {
  imgId: string;
  index: string;
  title: string;
  sub: string;
}

interface Service {
  label: string;
  desc: string;
}

interface EditRow {
  eyebrow: string;
  imgId: string;
  imgW?: number;
  reverse: boolean;
  titleLines: string[];
  body: string;
}

interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

interface DesignStep {
  num: string;
  title: string;
  body: string;
}

/* ════════════════════════════════════════════════════════════════════════════
   Data
   ════════════════════════════════════════════════════════════════════════════ */

const PHASES: Project[] = [
  {
    imgId: '1558618047-b62e0e6e8517',
    index: 'I',
    title: 'JARDINS CONTEMPORAINS',
    sub: "Lignes épurées, végétaux structurants, minéral et vivant en dialogue — le jardin comme prolongement de l\'architecture.",
  },
  {
    imgId: '1416879347-58da7a5ecbb7',
    index: 'II',
    title: 'POTAGERS & JARDINS NOURRICIERS',
    sub: "Carrés surélevés, serre tunnel, composteur intégré — produire bio à 30min de Paris, c\'est possible.",
  },
  {
    imgId: '1578662996442-48f60103fc96',
    index: 'III',
    title: 'TERRASSES & ROOFTOPS',
    sub: 'Bacs sur mesure, pergola végétalisée, éclairage doux — transformer un toit parisien en espace de vie.',
  },
];

const SERVICES: Service[] = [
  { label: 'Conception paysagère', desc: 'Étude de site, relevé topographique, plan masse et palette végétale adaptée à votre micro-climat.' },
  { label: 'Jardin contemporain', desc: 'Architecture minérale et végétale, sélection de graminées et vivaces structurantes, esprit zen urbain.' },
  { label: 'Potager biologique', desc: 'Carrés potagers surélevés, buttes en lasagne, composteur intégré, sélection variétale ancienne.' },
  { label: 'Terrasse & rooftop', desc: 'Bacs légers et étanches, pergola végétalisée, arrosage goutte-à-goutte, luminaires doux.' },
  { label: 'Entretien mensuel', desc: 'Contrat annuel : taille, désherbage, fertilisation organique, bilan photographique saisonnier.' },
  { label: 'Espaces verts copropriété', desc: 'Diagnostic, plan de gestion différenciée, éco-pâturage, plaidoyer auprès des syndics.' },
];

const EDIT_ROWS: EditRow[] = [
  {
    eyebrow: 'Notre approche',
    imgId: '1558618047-b62e0e6e8517',
    imgW: 800,
    reverse: false,
    titleLines: ['Chaque jardin', 'raconte une histoire.'],
    body: "Avant tout crayon, nous étudions la lumière heure par heure, les usages réels de l\'espace et la nature du sol. Les contraintes de l\'urban climate parisien — îlot de chaleur, substrat calcaire, variations hygrométriques — sont intégrées dès l\'esquisse. Résultat : trois propositions en vue 3D, calibrées budget, que vous choisissez ou mixez librement.",
  },
  {
    eyebrow: 'Île-de-France',
    imgId: '1416879347-58da7a5ecbb7',
    imgW: 800,
    reverse: true,
    titleLines: ['Paris &', 'petite couronne.'],
    body: "Nous intervenons dans les huit départements franciliens. Paris intra-muros, Hauts-de-Seine, Seine-Saint-Denis, Val-de-Marne, Essonne, Yvelines, Val-d\'Oise, Seine-et-Marne — chaque territoire impose ses spécificités : argile des Limons, sable des Moraines, calcaire des plateaux. Cette connaissance fine du sol local nourrit chaque plan.",
  },
];

const DESIGN_STEPS: DesignStep[] = [
  {
    num: '01',
    title: 'Étude de faisabilité & relevé du terrain',
    body: '1 heure gratuite sur site : lumière, orientation, sol, accès, contraintes réglementaires.',
  },
  {
    num: '02',
    title: 'Plan 3D & palette végétale',
    body: '3 scénarios selon budget, rendus photoréalistes, liste variétale nominative avec fiches culture.',
  },
  {
    num: '03',
    title: 'Réalisation en équipe propre',
    body: "Pas de sous-traitance : nos jardiniers paysagistes réalisent l\'intégralité du chantier.",
  },
  {
    num: '04',
    title: 'Suivi 1 an',
    body: 'Garantie reprise des végétaux, entretien saisonnier, bilan photographique avant/après.',
  },
];

const TESTIMONIALS: Testimonial[] = [
  {
    quote: "J\'avais une cour bétonnée de 40 m² à Neuilly — un no man\'s land gris. Vert Horizon l\'a transformée en jardin japonais luxuriant. Les voisins me demandent leur contact sans arrêt.",
    name: 'Sophie M.',
    role: 'Propriétaire, Neuilly-sur-Seine',
  },
  {
    quote: "En tant que syndic de notre immeuble parisien (15e), j\'avais besoin d\'un prestataire fiable pour végétaliser notre toit-terrasse commun. Depuis la livraison, l\'espace est utilisé quotidiennement par les résidents.",
    name: 'Thierry B.',
    role: 'Gestionnaire de copropriété, Paris 15e',
  },
];

/* ════════════════════════════════════════════════════════════════════════════
   Primitives
   ════════════════════════════════════════════════════════════════════════════ */

/** Étiquette fine capitales filet vert. */
function Eyebrow({
  children,
  color = C.accent,
  align = 'left',
  light = false,
}: {
  children: React.ReactNode;
  color?: string;
  align?: 'left' | 'center';
  light?: boolean;
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
    opacity: light ? 0.5 : 0.7,
    flexShrink: 0,
  };
  const label: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 11,
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

/** Bouton vert, contour fin, flèche glissante. */
function GreenButton({
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
    fontWeight: 400,
    cursor: 'pointer',
    border: `1px solid ${C.accent}`,
    background: filled ? C.accent : 'transparent',
    color: filled ? C.white : dark ? C.accentLight : C.accent,
    transition: 'all .5s cubic-bezier(.16,1,.3,1)',
  };
  const hov: React.CSSProperties = hover
    ? filled
      ? { background: C.accentDark, transform: 'translateY(-2px)' }
      : { background: 'rgba(74,122,58,0.08)', transform: 'translateY(-2px)' }
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
   1 · Nav : transparente → sombre au défilement
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
    { label: 'Nos jardins', href: '#jardins' },
    { label: 'Services', href: '#services' },
    { label: 'Approche', href: '#approche' },
    { label: 'Méthode', href: '#methode' },
    { label: 'Contact', href: '#devis' },
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
    background: solid ? 'rgba(10,20,8,0.95)' : 'transparent',
    backdropFilter: solid ? 'blur(14px) saturate(120%)' : 'none',
    WebkitBackdropFilter: solid ? 'blur(14px) saturate(120%)' : 'none',
    borderBottom: solid
      ? '1px solid rgba(74,122,58,0.22)'
      : '1px solid transparent',
    transition: 'all .6s cubic-bezier(.16,1,.3,1)',
  };

  const brand: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 18,
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    color: C.white,
    fontWeight: 400,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  };

  const linkRow: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'clamp(18px,2.2vw,36px)',
  };

  return (
    <nav style={bar}>
      <div style={brand}>
        <Leaf size={18} color={C.accent} strokeWidth={1.6} />
        Vert&nbsp;Horizon
      </div>
      <div style={linkRow} className="vh-navlinks">
        {links.map((l) => (
          <NavLink key={l.label} label={l.label} href={l.href} />
        ))}
      </div>
      <div className="vh-navcta">
        <a href="#devis" style={{ textDecoration: 'none' }}>
          <GreenButton filled dark>
            Devis gratuit
          </GreenButton>
        </a>
      </div>
      <style>{`
        @media (max-width: 860px) {
          .vh-navlinks { display: none !important; }
          .vh-navcta { display: none !important; }
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
        fontSize: 11,
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
   2 · Hero 100vh parallaxe
   ════════════════════════════════════════════════════════════════════════════ */
function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '16%']);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '-44%']);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.72], [1, 0]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const section: React.CSSProperties = {
    position: 'relative',
    height: '100vh',
    minHeight: 640,
    overflow: 'hidden',
    background: C.bgDark,
  };

  return (
    <section id="hero" ref={ref} style={section}>
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
          src={photo('1558618047-b62e0e6e8517', 2000)}
          alt="Jardin contemporain Vert Horizon Île-de-France"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </motion.div>

      {/* Voiles */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(10,20,8,0.40) 0%, rgba(10,20,8,0.06) 36%, rgba(10,20,8,0.44) 68%, rgba(10,20,8,0.90) 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(130% 90% at 60% 20%, transparent 40%, rgba(10,20,8,0.38) 100%)',
          mixBlendMode: 'multiply',
        }}
      />

      {/* Titre parallaxe — bas gauche */}
      <motion.div
        style={{
          position: 'relative',
          zIndex: 2,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding:
            'clamp(90px,14vh,140px) clamp(24px,6vw,90px) clamp(60px,9vh,100px)',
          y: titleY,
          opacity: titleOpacity,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.1 }}
        >
          <Eyebrow color={C.accentLight}>
            Paysagiste · Île-de-France
          </Eyebrow>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 44 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.22 }}
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontWeight: 300,
            color: C.white,
            fontSize: 'clamp(3rem,7.5vw,9rem)',
            lineHeight: 0.97,
            letterSpacing: '-0.01em',
            margin: '24px 0 22px',
            textShadow: '0 14px 64px rgba(0,0,0,0.5)',
            maxWidth: 860,
          }}
        >
          Jardins
          <br />
          en ville.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.50 }}
          style={{
            fontFamily: SANS,
            fontWeight: 300,
            fontSize: 'clamp(14px,1.5vw,18px)',
            color: 'rgba(255,255,255,0.80)',
            maxWidth: 480,
            lineHeight: 1.7,
            letterSpacing: '0.04em',
            marginBottom: 38,
          }}
        >
          Architecture paysagère sur mesure pour Paris et la petite couronne.
          Du potager biologique au rooftop végétalisé.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.72 }}
        >
          <GreenButton filled dark>
            Devis gratuit
          </GreenButton>
        </motion.div>
      </motion.div>

      {/* Indice de défilement */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: 34,
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
            color: 'rgba(255,255,255,0.6)',
            writingMode: 'vertical-rl',
          }}
        >
          Défiler
        </span>
        <motion.div
          animate={{ y: [0, 9, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={18} color={C.accentLight} strokeWidth={1.4} />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   3 · Intro : manifeste centré sur fond bgAlt
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
        <p
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: 'clamp(22px,3.2vw,44px)',
            lineHeight: 1.38,
            color: C.ink,
            maxWidth: 920,
            margin: '0 auto',
          }}
        >
          À Paris, chaque m² de verdure est un acte de résistance.
          <br />
          Nous les plantons un à un.
        </p>
      </Reveal>
      <Reveal delay={0.14}>
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
   4 · ProjectSequence : crossfade chapitré collant 320vh
   ════════════════════════════════════════════════════════════════════════════ */
function PhaseImage({
  phase,
  i,
  total,
  progress,
}: {
  phase: Project;
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
        src={photo(phase.imgId)}
        alt={phase.title}
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

function PhaseCaption({
  phase,
  i,
  total,
  progress,
}: {
  phase: Project;
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
        top: 'clamp(60px,10vh,120px)',
        right: 'clamp(24px,5vw,72px)',
        textAlign: 'right',
        opacity,
        y,
        maxWidth: 520,
      }}
    >
      <div
        style={{
          fontFamily: SANS,
          fontSize: 10,
          letterSpacing: '0.42em',
          textTransform: 'uppercase',
          color: C.accentLight,
          marginBottom: 8,
        }}
      >
        {phase.index}
      </div>
      <h2
        style={{
          fontFamily: SANS,
          fontSize: 'clamp(16px,2vw,24px)',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          fontWeight: 400,
          color: C.white,
          margin: '0 0 16px',
          textShadow: '0 4px 20px rgba(0,0,0,0.6)',
        }}
      >
        {phase.title}
      </h2>
      <p
        style={{
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontWeight: 300,
          fontSize: 'clamp(15px,1.7vw,20px)',
          color: 'rgba(255,255,255,0.82)',
          lineHeight: 1.62,
          margin: 0,
        }}
      >
        {phase.sub}
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
    [0.3, 1, 1, 0.3],
  );
  const width = useTransform(progress, [i * seg, (i + 1) * seg], [10, 34]);
  return (
    <motion.div style={{ height: 2, width, background: C.accent, opacity }} />
  );
}

function ProjectSequence() {
  const n = PHASES.length;
  const progress = useMotionValue(0.5 / n);
  const [active, setActive] = useState(0);
  const goTo = (i: number) => {
    setActive(i);
    animate(progress, (i + 0.5) / n, { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] });
  };

  return (
    <section
      id="jardins"
      style={{ height: '100vh', overflow: 'hidden', position: 'relative', background: C.bgDark }}
    >
      <div
        style={{
          position: 'relative',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {PHASES.map((p, i) => (
          <PhaseImage
            key={p.index}
            phase={p}
            i={i}
            total={PHASES.length}
            progress={progress}
          />
        ))}
        {/* voile lisibilité */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to bottom, rgba(10,20,8,0.20), rgba(10,20,8,0.06) 42%, rgba(10,20,8,0.55))',
          }}
        />
        {PHASES.map((p, i) => (
          <PhaseCaption
            key={p.index}
            phase={p}
            i={i}
            total={PHASES.length}
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
   5 · ServiceCards : 6 cartes, bordure gauche verte
   ════════════════════════════════════════════════════════════════════════════ */
function ServiceCard({ s, i }: { s: Service; i: number }) {
  const [hover, setHover] = useState(false);
  const card: React.CSSProperties = {
    background: hover ? C.bgAlt : C.bgCard,
    border: `1px solid ${C.border}`,
    borderLeft: `3px solid ${C.accent}`,
    padding: 'clamp(24px,3vw,36px)',
    transform: hover ? 'translateY(-6px)' : 'none',
    boxShadow: hover
      ? '0 28px 60px -30px rgba(10,20,8,0.22)'
      : '0 2px 16px -10px rgba(10,20,8,0.10)',
    transition: 'all .55s cubic-bezier(.16,1,.3,1)',
    cursor: 'default',
  };
  return (
    <Reveal delay={i * 0.06} style={{ height: '100%' }}>
      <div
        style={card}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div
          style={{
            fontFamily: SANS,
            fontSize: 10.5,
            letterSpacing: '0.30em',
            textTransform: 'uppercase',
            color: C.accent,
            marginBottom: 14,
          }}
        >
          0{i + 1}
        </div>
        <h3
          style={{
            fontFamily: SERIF,
            fontWeight: 400,
            fontSize: 'clamp(20px,2.2vw,26px)',
            color: C.ink,
            margin: '0 0 14px',
            lineHeight: 1.18,
          }}
        >
          {s.label}
        </h3>
        <p
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 'clamp(14px,1.4vw,16px)',
            lineHeight: 1.72,
            color: C.textMuted,
            margin: 0,
          }}
        >
          {s.desc}
        </p>
      </div>
    </Reveal>
  );
}

function ServiceCards() {
  const sec: React.CSSProperties = {
    background: C.bg,
    padding: 'clamp(96px,13vw,180px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 'clamp(20px,2.4vw,32px)',
    maxWidth: 1240,
    margin: '0 auto',
  };
  return (
    <section style={sec} id="services">
      <div style={{ maxWidth: 1240, margin: '0 auto 56px' }}>
        <Reveal>
          <Eyebrow>Nos Prestations</Eyebrow>
        </Reveal>
        <Reveal delay={0.09}>
          <h2
            style={{
              fontFamily: SERIF,
              fontWeight: 400,
              fontSize: 'clamp(34px,5vw,68px)',
              color: C.ink,
              margin: '20px 0 0',
              lineHeight: 1.06,
            }}
          >
            Six façons de{' '}
            <span style={{ fontStyle: 'italic', color: C.accent }}>
              verdir
            </span>{' '}
            votre espace
          </h2>
        </Reveal>
      </div>
      <div style={grid}>
        {SERVICES.map((s, i) => (
          <ServiceCard key={s.label} s={s} i={i} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   6 · EditorialRows : 2 lignes alternées image / texte
   ════════════════════════════════════════════════════════════════════════════ */
function EditRowBlock({ row, rowIdx }: { row: EditRow; rowIdx: number }) {
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
    position: 'relative',
  };
  const txt: React.CSSProperties = { order: row.reverse ? 1 : 2 };

  /* Ghost numeral */
  const ghostNum: React.CSSProperties = {
    position: 'absolute',
    top: -60,
    [row.reverse ? 'right' : 'left']: -20,
    fontFamily: SERIF,
    fontSize: 'clamp(120px,18vw,220px)',
    fontWeight: 600,
    color: C.stone,
    opacity: 0.07,
    lineHeight: 1,
    pointerEvents: 'none',
    userSelect: 'none',
    zIndex: 0,
  };

  return (
    <div style={{ position: 'relative' }}>
      <span style={ghostNum} aria-hidden="true">
        {rowIdx + 1}
      </span>
      <div style={wrap} className="vh-editrow">
        <Reveal y={50} style={{ ...imgWrap, zIndex: 1 }}>
          <ParallaxImg
            src={photo(row.imgId, row.imgW ?? 1600)}
            alt={row.eyebrow}
          />
        </Reveal>
        <div style={{ ...txt, zIndex: 1 }}>
          <Reveal>
            <Eyebrow>{row.eyebrow}</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h3
              style={{
                fontFamily: SERIF,
                fontStyle: 'italic',
                fontWeight: 300,
                fontSize: 'clamp(30px,4.2vw,58px)',
                color: C.ink,
                margin: '20px 0 24px',
                lineHeight: 1.1,
              }}
            >
              {row.titleLines.map((line, li) => (
                <React.Fragment key={li}>
                  {line}
                  {li < row.titleLines.length - 1 ? <br /> : null}
                </React.Fragment>
              ))}
            </h3>
          </Reveal>
          <Reveal delay={0.16}>
            <p
              style={{
                fontFamily: SERIF,
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
      </div>
      <style>{`
        @media (max-width: 860px) {
          .vh-editrow { grid-template-columns: 1fr !important; }
          .vh-editrow > * { order: initial !important; }
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
    <section style={sec} id="approche">
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(100px,14vw,180px)',
        }}
      >
        {EDIT_ROWS.map((r, i) => (
          <EditRowBlock key={r.eyebrow} row={r} rowIdx={i} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   7 · DesignPanel : image collante à gauche, 4 étapes à droite
   ════════════════════════════════════════════════════════════════════════════ */
function DesignPanel() {
  const sec: React.CSSProperties = {
    background: C.bgDark,
    padding: 'clamp(80px,11vw,150px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '0.95fr 1.05fr',
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
    <section style={sec} id="methode">
      <div style={grid} className="vh-despanel">
        {/* Image collante */}
        <div style={stickySide} className="vh-despanel-sticky">
          <div
            style={{
              overflow: 'hidden',
              border: `1px solid ${C.borderDark}`,
              aspectRatio: '4 / 5',
            }}
          >
            <img
              src={photo('1578662996442-48f60103fc96', 900)}
              alt="Terrasse végétalisée Vert Horizon"
              loading="lazy"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </div>
          <div style={{ marginTop: 20 }}>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 10.5,
                letterSpacing: '0.26em',
                textTransform: 'uppercase',
                color: C.textFaint,
                marginBottom: 8,
              }}
            >
              Notre garantie
            </div>
            <div
              style={{
                fontFamily: SERIF,
                fontStyle: 'italic',
                fontWeight: 300,
                fontSize: 17,
                color: 'rgba(255,255,255,0.70)',
                lineHeight: 1.6,
              }}
            >
              Reprise des végétaux garantie 12 mois, sans condition.
            </div>
          </div>
        </div>

        {/* Étapes qui défilent */}
        <div>
          <Reveal>
            <Eyebrow color={C.accentLight} light>
              Méthodologie
            </Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2
              style={{
                fontFamily: SERIF,
                fontWeight: 400,
                fontSize: 'clamp(32px,4.6vw,62px)',
                color: C.white,
                margin: '20px 0 52px',
                lineHeight: 1.06,
              }}
            >
              De l&apos;esquisse au{' '}
              <span
                style={{ fontStyle: 'italic', color: C.accentLight }}
              >
                premier bourgeon.
              </span>
            </h2>
          </Reveal>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {DESIGN_STEPS.map((step, i) => (
              <Reveal key={step.num} delay={0.05 * i}>
                <div
                  style={{
                    padding: 'clamp(28px,3.5vw,42px) 0',
                    borderTop: `1px solid rgba(74,122,58,0.28)`,
                    display: 'flex',
                    gap: 'clamp(20px,3vw,36px)',
                    alignItems: 'baseline',
                  }}
                >
                  <span
                    style={{
                      fontFamily: SERIF,
                      fontStyle: 'italic',
                      fontSize: 'clamp(22px,2.6vw,32px)',
                      color: C.stone,
                      opacity: 0.8,
                      minWidth: 42,
                      flexShrink: 0,
                    }}
                  >
                    {step.num}
                  </span>
                  <div>
                    <h4
                      style={{
                        fontFamily: SERIF,
                        fontWeight: 400,
                        fontSize: 'clamp(20px,2.2vw,26px)',
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
                        fontWeight: 300,
                        fontSize: 'clamp(14px,1.4vw,17px)',
                        lineHeight: 1.72,
                        color: 'rgba(255,255,255,0.64)',
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
          .vh-despanel { grid-template-columns: 1fr !important; }
          .vh-despanel-sticky { position: static !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   8 · Testimonials : fond bgAlt, icône Leaf accent, SERIF italique
   ════════════════════════════════════════════════════════════════════════════ */
function TestimonialCard({
  t,
  i,
}: {
  t: Testimonial;
  i: number;
}) {
  return (
    <Reveal delay={i * 0.12} style={{ height: '100%' }}>
      <figure
        style={{
          background: C.white,
          border: `1px solid ${C.border}`,
          padding: 'clamp(32px,4vw,50px)',
          margin: 0,
          height: '100%',
          boxSizing: 'border-box',
          boxShadow: '0 20px 50px -36px rgba(10,20,8,0.28)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Leaf size={30} color={C.accent} strokeWidth={1.4} />
        <blockquote
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: 'clamp(17px,1.9vw,22px)',
            lineHeight: 1.64,
            color: C.ink,
            margin: '24px 0 28px',
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
              color: C.accent,
              fontWeight: 400,
              marginBottom: 6,
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
    gap: 'clamp(28px,3.5vw,52px)',
    maxWidth: 1180,
    margin: '0 auto',
  };
  return (
    <section id="contact" style={sec}>
      <div style={{ maxWidth: 1180, margin: '0 auto 56px', textAlign: 'center' }}>
        <Reveal>
          <Eyebrow align="center">Ils nous ont fait confiance</Eyebrow>
        </Reveal>
        <Reveal delay={0.09}>
          <h2
            style={{
              fontFamily: SERIF,
              fontWeight: 400,
              fontSize: 'clamp(32px,4.8vw,64px)',
              color: C.ink,
              margin: '20px 0 0',
              lineHeight: 1.06,
            }}
          >
            La parole de nos{' '}
            <span style={{ fontStyle: 'italic', color: C.accent }}>
              clients
            </span>
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
   9 · QuoteForm : fond bgDark, 720px centré, état envoyé chaleureux
   ════════════════════════════════════════════════════════════════════════════ */
function QuoteForm() {
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [tel, setTel] = useState('');
  const [type, setType] = useState('');
  const [dept, setDept] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

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
    borderBottom: '1px solid rgba(74,122,58,0.4)',
    padding: '15px 2px',
    fontFamily: SERIF,
    fontSize: 18,
    color: C.white,
    outline: 'none',
    transition: 'border-color .3s',
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 10.5,
    letterSpacing: '0.26em',
    textTransform: 'uppercase',
    color: C.textFaint,
    display: 'block',
    marginBottom: 4,
  };

  const types = [
    'Jardin privatif',
    'Terrasse toit',
    'Jardin contemporain',
    'Espace vert copropriété',
    'Jardin potager',
    'Autre',
  ];

  return (
    <section style={sec} id="devis">
      {/* Photo décorative en filigrane */}
      <img
        src={photo('1558618047-b62e0e6e8517', 1600)}
        alt=""
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
          <Eyebrow color={C.accentLight} align="center" light>
            Demande de devis
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.09}>
          <h2
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontWeight: 300,
              fontSize: 'clamp(34px,5.5vw,72px)',
              color: C.white,
              margin: '20px 0 16px',
              lineHeight: 1.06,
            }}
          >
            Parlons de votre jardin.
          </h2>
        </Reveal>
        <Reveal delay={0.18}>
          <p
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontWeight: 300,
              fontSize: 'clamp(15px,1.6vw,19px)',
              lineHeight: 1.72,
              color: 'rgba(255,255,255,0.72)',
              maxWidth: 520,
              margin: '0 auto 52px',
            }}
          >
            Visite diagnostic gratuite dans les 5 jours. Sans engagement.
          </p>
        </Reveal>

        {sent ? (
          <Reveal>
            <div
              style={{
                border: `1px solid rgba(74,122,58,0.50)`,
                padding: 'clamp(36px,5vw,56px)',
                background: 'rgba(74,122,58,0.07)',
                textAlign: 'center',
              }}
            >
              <Leaf size={36} color={C.accentLight} strokeWidth={1.3} />
              <h3
                style={{
                  fontFamily: SERIF,
                  fontWeight: 400,
                  fontSize: 'clamp(26px,3vw,36px)',
                  color: C.white,
                  margin: '18px 0 14px',
                }}
              >
                Merci {prenom}&nbsp;!
              </h3>
              <p
                style={{
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  fontWeight: 300,
                  fontSize: 18,
                  color: 'rgba(255,255,255,0.74)',
                  margin: 0,
                  lineHeight: 1.7,
                }}
              >
                Nous vous proposons une visite diagnostic gratuite dans les 5 jours.
                <br />
                Un message de confirmation arrive à{' '}
                <span style={{ color: C.accentLight }}>{email}</span>.
              </p>
            </div>
          </Reveal>
        ) : (
          <Reveal delay={0.26}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 32,
                textAlign: 'left',
              }}
            >
              {/* Row : Prénom + Email */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 24,
                }}
                className="vh-formrow"
              >
                <div>
                  <label style={labelStyle} htmlFor="vh-prenom">
                    Prénom
                  </label>
                  <input
                    id="vh-prenom"
                    style={fieldBase}
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    placeholder="Marie"
                    autoComplete="given-name"
                    suppressHydrationWarning
                  />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="vh-email">
                    Email
                  </label>
                  <input
                    id="vh-email"
                    style={fieldBase}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="marie@exemple.fr"
                    autoComplete="email"
                    suppressHydrationWarning
                  />
                </div>
              </div>

              {/* Row : Téléphone + Département */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 24,
                }}
                className="vh-formrow"
              >
                <div>
                  <label style={labelStyle} htmlFor="vh-tel">
                    Téléphone
                  </label>
                  <input
                    id="vh-tel"
                    style={fieldBase}
                    type="tel"
                    value={tel}
                    onChange={(e) => setTel(e.target.value)}
                    placeholder="06 00 00 00 00"
                    autoComplete="tel"
                    suppressHydrationWarning
                  />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="vh-dept">
                    Département
                  </label>
                  <input
                    id="vh-dept"
                    style={fieldBase}
                    value={dept}
                    onChange={(e) => setDept(e.target.value)}
                    placeholder="75, 92, 93…"
                    suppressHydrationWarning
                  />
                </div>
              </div>

              {/* Type de projet */}
              <div>
                <label style={labelStyle} htmlFor="vh-type">
                  Type de projet
                </label>
                <select
                  id="vh-type"
                  style={{
                    ...fieldBase,
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    cursor: 'pointer',
                    color: type ? C.white : 'rgba(255,255,255,0.38)',
                  }}
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  suppressHydrationWarning
                >
                  <option value="" style={{ color: '#111' }}>
                    Choisir un type…
                  </option>
                  {types.map((t) => (
                    <option key={t} value={t} style={{ color: '#111' }}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div>
                <label style={labelStyle} htmlFor="vh-message">
                  Message (optionnel)
                </label>
                <textarea
                  id="vh-message"
                  rows={4}
                  style={{
                    ...fieldBase,
                    resize: 'vertical',
                    borderBottom: 'none',
                    border: '1px solid rgba(74,122,58,0.30)',
                    padding: '14px 14px',
                    lineHeight: 1.68,
                  }}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Décrivez votre espace, vos envies, vos contraintes…"
                  suppressHydrationWarning
                />
              </div>

              <div style={{ textAlign: 'center', marginTop: 8 }}>
                <GreenButton filled dark onClick={onSubmit} type="button">
                  Envoyer ma demande
                </GreenButton>
              </div>
            </div>
          </Reveal>
        )}
      </div>
      <style>{`
        @media (max-width: 860px) {
          .vh-formrow { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   10 · Footer : bgDarkAlt, 4 colonnes, en-têtes verts
   ════════════════════════════════════════════════════════════════════════════ */
function Footer() {
  const cols: { title: string; items: { label: string; href: string }[] }[] = [
    {
      title: 'Nos jardins',
      items: [
        { label: 'Jardins contemporains', href: '#jardins' },
        { label: 'Potagers & nourriciers', href: '#jardins' },
        { label: 'Terrasses & rooftops', href: '#jardins' },
      ],
    },
    {
      title: 'Prestations',
      items: [
        { label: 'Conception paysagère', href: '#services' },
        { label: 'Entretien mensuel', href: '#services' },
        { label: 'Espaces copropriété', href: '#services' },
      ],
    },
    {
      title: 'Notre méthode',
      items: [
        { label: 'Étude de faisabilité', href: '#methode' },
        { label: 'Plan 3D & palette', href: '#methode' },
        { label: 'Réalisation & suivi', href: '#methode' },
      ],
    },
    {
      title: 'Contact',
      items: [
        { label: 'Devis gratuit', href: '#devis' },
        { label: 'Nos références', href: '#approche' },
        { label: "Zone d\'intervention", href: '#approche' },
      ],
    },
  ];

  const foot: React.CSSProperties = {
    background: C.bgDarkAlt,
    borderTop: '1px solid rgba(74,122,58,0.16)',
    padding: 'clamp(70px,9vw,110px) clamp(24px,6vw,96px) 40px',
  };

  return (
    <footer style={foot}>
      {/* Brand row */}
      <div style={{ maxWidth: 1240, margin: '0 auto 56px' }}>
        <div
          style={{
            fontFamily: SANS,
            fontSize: 20,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: C.white,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 16,
          }}
        >
          <Leaf size={18} color={C.accent} strokeWidth={1.5} />
          Vert Horizon
        </div>
        <p
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: 16,
            lineHeight: 1.7,
            color: 'rgba(255,255,255,0.52)',
            margin: '0 0 16px',
            maxWidth: 420,
          }}
        >
          Paysagiste & Architecture de Jardin · Île-de-France
        </p>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontFamily: SANS,
            fontSize: 11,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.42)',
          }}
        >
          <MapPin size={13} color={C.textFaint} strokeWidth={1.5} />
          Paris & Île-de-France
        </div>
      </div>

      {/* Colonnes */}
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 'clamp(28px,4vw,56px)',
        }}
        className="vh-footgrid"
      >
        {cols.map((c) => (
          <div key={c.title}>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 10.5,
                letterSpacing: '0.28em',
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
                      color: 'rgba(255,255,255,0.62)',
                      textDecoration: 'none',
                      transition: 'color .3s',
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
          margin: '60px auto 0',
          paddingTop: 26,
          borderTop: '1px solid rgba(74,122,58,0.12)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 14,
          fontFamily: SANS,
          fontSize: 10.5,
          letterSpacing: '0.12em',
          color: 'rgba(255,255,255,0.36)',
        }}
      >
        <span>© 2026 Vert Horizon · Paysagiste Île-de-France</span>
        <span style={{ display: 'flex', gap: 22 }}>
          <a
            href="#devis"
            style={{ color: 'inherit', textDecoration: 'none' }}
          >
            Mentions légales
          </a>
          <a
            href="#devis"
            style={{ color: 'inherit', textDecoration: 'none' }}
          >
            Confidentialité
          </a>
        </span>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .vh-footgrid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .vh-footgrid { grid-template-columns: 1fr !important; }
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
      <ProjectSequence />
      <ServiceCards />
      <EditorialRows />
      <DesignPanel />
      <Testimonials />
      <QuoteForm />
      <Footer />
    </main>
  );
}
