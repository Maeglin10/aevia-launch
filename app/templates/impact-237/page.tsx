'use client';

import React, { useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  MotionValue,
} from 'framer-motion';
import { ArrowRight, ChevronDown, Quote, Star } from 'lucide-react';

/* ════════════════════════════════════════════════════════════════════════════
   CABINET DENTAIRE SORRENTO — Dr. Clara Sorrento & Associés · Nice
   Photographie réelle + chorégraphie de défilement éditoriale.
   Auto-suffisant. 'use client'.
   ════════════════════════════════════════════════════════════════════════════ */

/* ── Google Fonts ─────────────────────────────────────────────────────────── */
const FONT_LINK =
  'https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap';

/* ── Palette ─────────────────────────────────────────────────────────────── */
const C = {
  bg: '#f8fffd',
  bgAlt: '#edf7f4',
  bgDark: '#091f1c',
  bgDarkAlt: '#0d2c28',
  bgCard: '#ffffff',
  accent: '#0d9488',
  accentDark: '#0a7569',
  accentLight: '#ccf0ec',
  white: '#ffffff',
  ink: '#091f1c',
  textMuted: '#456b64',
  textFaint: '#8ab5ae',
  border: '#c8e6e2',
  borderDark: 'rgba(13,148,136,0.25)',
  gold: '#c9a84c',
} as const;

const SERIF = "'DM Serif Display', Georgia, serif" as const;
const SANS = "'DM Sans', system-ui, sans-serif" as const;

/* ── Easing partagé ──────────────────────────────────────────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ── Photos Unsplash ─────────────────────────────────────────────────────── */
const PHOTO_BASE = 'https://images.unsplash.com/photo-';
const P = {
  clinic: `${PHOTO_BASE}1629909785548-a5e48e93e4ae?q=80&w=2000&auto=format&fit=crop`,
  clinicMed: `${PHOTO_BASE}1629909785548-a5e48e93e4ae?q=80&w=1600&auto=format&fit=crop`,
  clinicSm: `${PHOTO_BASE}1629909785548-a5e48e93e4ae?q=80&w=800&auto=format&fit=crop`,
  treatment: `${PHOTO_BASE}1606811971618-4486d14f3f99?q=80&w=1600&auto=format&fit=crop`,
  treatmentSm: `${PHOTO_BASE}1606811971618-4486d14f3f99?q=80&w=800&auto=format&fit=crop`,
  implant: `${PHOTO_BASE}1581391549275-3b1e0f2d7aa4?q=80&w=1600&auto=format&fit=crop`,
} as const;

/* ════════════════════════════════════════════════════════════════════════════
   Types
   ════════════════════════════════════════════════════════════════════════════ */
interface Treatment {
  label: string;
  tag: string;
  desc: string;
  icon: string;
}

interface Review {
  quote: string;
  name: string;
  role: string;
}

interface Spec {
  num: string;
  title: string;
  detail: string;
}

interface EditRow {
  eyebrow: string;
  img: string;
  alt: string;
  num: string;
  title: React.ReactNode;
  body: string;
  reverse: boolean;
}

interface Phase {
  src: string;
  alt: string;
  roman: string;
  caption: string;
  sub: string;
  label: string;
}

/* ════════════════════════════════════════════════════════════════════════════
   Data
   ════════════════════════════════════════════════════════════════════════════ */
const PHASES: Phase[] = [
  {
    src: P.clinicMed,
    alt: 'Cabinet dentaire Sorrento — salle de soins',
    roman: 'I',
    caption: 'PRÉVENTION',
    label: 'Prévention',
    sub: 'Bilan complet, détartrage, radiographies panoramiques — la base de tout sourire durable.',
  },
  {
    src: P.treatment,
    alt: 'Traitement esthétique dentaire',
    roman: 'II',
    caption: 'ESTHÉTIQUE',
    label: 'Esthétique',
    sub: 'Blanchiment professionnel, facettes céramique, composite direct — sourires sur mesure.',
  },
  {
    src: P.implant,
    alt: "Pose d'implant dentaire",
    roman: 'III',
    caption: 'IMPLANTOLOGIE',
    label: 'Implantologie',
    sub: 'Implants Nobel Biocare, pose en cabinet, protocole numérique — sans chirurgie hospitalière.',
  },
];

const TREATMENTS: Treatment[] = [
  {
    label: 'Bilan & Détartrage',
    tag: 'Prévention',
    desc: 'Examen clinique complet, radiographies numériques, détartrage et polissage pour des gencives saines.',
    icon: '◎',
  },
  {
    label: 'Blanchiment',
    tag: 'Esthétique',
    desc: 'Blanchiment Philips Zoom en cabinet ou gouttières personnalisées — résultats visibles dès la 1re séance.',
    icon: '◈',
  },
  {
    label: 'Facettes Céramique',
    tag: 'Esthétique',
    desc: 'Facettes ultra-minces e.max, teintes personnalisées, sourire Hollywood naturel et durable.',
    icon: '◇',
  },
  {
    label: 'Implants',
    tag: 'Implantologie',
    desc: 'Implants Nobel Biocare Active, planification 3D, pose guidée — couronne définitive en une seule visite.',
    icon: '◉',
  },
  {
    label: 'Orthodontie Invisible',
    tag: 'Orthodontie',
    desc: 'Aligneurs transparents sur mesure, traitement discret et amovible pour adultes et adolescents.',
    icon: '◌',
  },
  {
    label: 'Pédodontie',
    tag: 'Enfants',
    desc: 'Consultations douces dès 3 ans, prévention précoce, environment ludique et bienveillant.',
    icon: '◁',
  },
];

const EDIT_ROWS: EditRow[] = [
  {
    eyebrow: 'Notre philosophie',
    img: P.clinicSm,
    alt: 'Cabinet dentaire Sorrento — salle moderne',
    num: '01',
    title: (
      <>
        Soigner{' '}
        <span style={{ fontStyle: 'italic' }}>sans douleur.</span>
      </>
    ),
    body: "Chez Sorrento, chaque geste est pensé pour votre confort. Anesthésie topique systématique, technique Wand d'injection sans aiguille visible, musique d'ambiance et protocole anti-anxiété — nous avons réinventé la consultation dentaire pour ceux qui redoutaient le fauteuil.",
    reverse: false,
  },
  {
    eyebrow: 'Technologie',
    img: P.treatmentSm,
    alt: 'Scanner 3D iTero en cabinet',
    num: '02',
    title: (
      <>
        Numérique,{' '}
        <span style={{ fontStyle: 'italic' }}>précis.</span>
      </>
    ),
    body: "Scanner iTero intraoral pour empreintes sans silicone, logiciel de planification 3D Implant Studio, CEREC pour couronnes en une séance — notre bloc numérique élimine les marges d'erreur et raccourcit vos délais. La technologie au service de votre temps.",
    reverse: true,
  },
];

const SPECS: Spec[] = [
  {
    num: '01',
    title: 'Scanner 3D iTero intraoral',
    detail: 'Empreintes numériques en 60 secondes. Aucun silicone, aucune nausée, précision submillimétrique.',
  },
  {
    num: '02',
    title: 'CEREC — couronne en 1 séance',
    detail: 'Conception et fraisage en cabinet. Votre couronne céramique définitive le jour même.',
  },
  {
    num: '03',
    title: 'Blanchiment Philips Zoom',
    detail: "Lampe LED haute intensité + gel peroxyde calibré. Jusqu'à 8 teintes en 45 minutes.",
  },
  {
    num: '04',
    title: 'Implants Nobel Biocare Active',
    detail: 'Référence mondiale. Taux de succès > 99 % à 10 ans. Pose guidée par planification 3D.',
  },
];

const REVIEWS: Review[] = [
  {
    quote:
      "J'avais une phobie du dentiste depuis 20 ans. La première consultation avec le Dr Sorrento a tout changé. Zéro douleur, équipe rassurante, résultat parfait. Je ne savais pas que ça pouvait être aussi simple.",
    name: 'Isabelle M.',
    role: 'Patiente depuis 2 ans · Nice',
  },
  {
    quote:
      "Facettes céramique posées il y a 8 mois — les gens me demandent si j'ai changé de coiffure. En fait, c'est juste mon sourire. Le travail est bluffant de naturel, je recommande sans hésiter.",
    name: 'Raphaël D.',
    role: 'Facettes + blanchiment · Cannes',
  },
  {
    quote:
      "Deux implants, planification 3D, couronne le jour même. L'équipe est professionnelle, le cabinet impeccable, et le suivi post-opératoire irréprochable. Une référence sur la Côte d'Azur.",
    name: 'Nathalie V.',
    role: 'Implantologie · Antibes',
  },
];

/* ════════════════════════════════════════════════════════════════════════════
   Primitives
   ════════════════════════════════════════════════════════════════════════════ */

/** Étiquette fine, capitales, interlettrage large, filet teal. */
function Eyebrow({
  children,
  color = C.accent,
  align = 'left',
  secondLine,
}: {
  children: React.ReactNode;
  color?: string;
  align?: 'left' | 'center';
  secondLine?: React.ReactNode;
}) {
  const wrap: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: align === 'center' ? 'center' : 'flex-start',
    gap: 10,
  };
  const row: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    justifyContent: align === 'center' ? 'center' : 'flex-start',
  };
  const rule: React.CSSProperties = {
    width: 46,
    height: 1,
    background: color,
    opacity: 0.75,
    flexShrink: 0,
  };
  const labelStyle: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 11,
    letterSpacing: '0.42em',
    textTransform: 'uppercase',
    color,
    fontWeight: 500,
  };
  return (
    <div style={wrap}>
      <div style={row}>
        <span style={rule} />
        <span style={labelStyle}>{children}</span>
        {align === 'center' && <span style={rule} />}
      </div>
      {secondLine && (
        <div style={row}>
          <span style={{ ...rule, opacity: 0 }} />
          <span style={{ ...labelStyle, opacity: 0.65 }}>{secondLine}</span>
        </div>
      )}
    </div>
  );
}

/** Révélation au scroll : fondu + translation verticale, une seule fois. */
function Reveal({
  children,
  delay = 0,
  y = 38,
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

/** Bouton teal rempli ou contour. */
function TealButton({
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
    fontSize: 12,
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    fontWeight: 600,
    cursor: 'pointer',
    border: `1.5px solid ${C.accent}`,
    background: filled ? C.accent : 'transparent',
    color: filled ? C.white : C.accent,
    transition: 'all .5s cubic-bezier(.16,1,.3,1)',
    borderRadius: 2,
  };
  const hov: React.CSSProperties = hover
    ? filled
      ? { background: C.accentDark, borderColor: C.accentDark, transform: 'translateY(-2px)' }
      : { background: 'rgba(13,148,136,0.08)', transform: 'translateY(-2px)' }
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
          transition: 'transform .5s cubic-bezier(.16,1,.3,1)',
        }}
      />
    </button>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   NAV — transparente → sombre au défilement
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
    { label: 'Soins', href: '#soins' },
    { label: 'Technologie', href: '#technologie' },
    { label: "L'Équipe", href: '#equipe' },
    { label: 'Contact', href: '#rdv' },
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
    background: solid ? 'rgba(9,31,28,0.94)' : 'transparent',
    backdropFilter: solid ? 'blur(16px) saturate(130%)' : 'none',
    WebkitBackdropFilter: solid ? 'blur(16px) saturate(130%)' : 'none',
    borderBottom: solid
      ? `1px solid rgba(13,148,136,0.20)`
      : '1px solid transparent',
    transition: 'all .6s cubic-bezier(.16,1,.3,1)',
  };

  const brand: React.CSSProperties = {
    fontFamily: SERIF,
    fontSize: 20,
    letterSpacing: '0.04em',
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
    gap: 'clamp(18px,2.4vw,38px)',
  };

  return (
    <nav style={bar}>
      <a href="#soins" style={brand}>
        <span style={{ color: C.accent, fontSize: 22 }}>◉</span>
        Sorrento
      </a>
      <div style={linkRow} className="cs-navlinks">
        {links.map((l) => (
          <NavLink key={l.label} label={l.label} href={l.href} />
        ))}
      </div>
      <div className="cs-navcta">
        <a href="#rdv" style={{ textDecoration: 'none' }}>
          <TealButton filled>Prendre RDV</TealButton>
        </a>
      </div>
      <style>{`
        @media (max-width: 860px) {
          .cs-navlinks { display: none !important; }
          .cs-navcta { display: none !important; }
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
        fontSize: 12,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        color: h ? C.accent : C.white,
        textDecoration: 'none',
        fontWeight: 500,
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
   HERO — 100vh, centre, parallaxe
   ════════════════════════════════════════════════════════════════════════════ */
function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const imgScale = useTransform(scrollYProgress, [0, 1], [1.0, 1.12]);
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '14%']);
  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '-40%']);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);

  return (
    <section
      ref={ref}
      style={{
        position: 'relative',
        height: '100vh',
        minHeight: 640,
        overflow: 'hidden',
        background: C.bgDark,
      }}
    >
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
          src={P.clinic}
          alt="Cabinet Dentaire Sorrento — Nice"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          priority-hint="high"
        />
      </motion.div>

      {/* Voile 1 : dégradé lisibilité */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(9,31,28,0.55) 0%, rgba(9,31,28,0.10) 35%, rgba(9,31,28,0.55) 72%, rgba(9,31,28,0.92) 100%)',
        }}
      />
      {/* Voile 2 : vignette teintée */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(110% 75% at 50% 30%, transparent 42%, rgba(9,31,28,0.55) 100%)',
          mixBlendMode: 'multiply',
        }}
      />

      {/* Texte centré */}
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
          padding: '0 clamp(24px,6vw,120px)',
          y: titleY,
          opacity: titleOpacity,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.1 }}
          style={{ marginBottom: 28 }}
        >
          <Eyebrow color="rgba(204,240,236,0.9)" align="center">
            Cabinet dentaire · Nice
          </Eyebrow>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 42 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.2 }}
          style={{
            fontFamily: SERIF,
            fontWeight: 400,
            fontStyle: 'italic',
            color: C.white,
            fontSize: 'clamp(52px,8vw,110px)',
            lineHeight: 1.0,
            letterSpacing: '-0.01em',
            margin: '0 0 28px',
            textShadow: '0 12px 56px rgba(0,0,0,0.45)',
          }}
        >
          L&apos;éclat /{' '}
          <span style={{ fontStyle: 'normal', color: C.accentLight }}>d&apos;un sourire</span> /{' '}
          confiant
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.42 }}
          style={{
            fontFamily: SANS,
            fontWeight: 300,
            fontSize: 'clamp(16px,1.8vw,21px)',
            color: 'rgba(255,255,255,0.84)',
            maxWidth: 540,
            lineHeight: 1.7,
            marginBottom: 44,
          }}
        >
          Soins sans douleur, technologie numérique, expertise esthétique — le cabinet de référence de la Côte d&apos;Azur.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.64 }}
        >
          <a href="#rdv" style={{ textDecoration: 'none' }}>
            <TealButton filled>Prendre rendez-vous</TealButton>
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: 36,
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
            color: 'rgba(255,255,255,0.65)',
            fontWeight: 500,
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
   MANIFESTO — citation large, fond papier
   ════════════════════════════════════════════════════════════════════════════ */
function Manifesto() {
  return (
    <section
      style={{
        background: C.bgAlt,
        padding: 'clamp(96px,14vw,200px) clamp(24px,8vw,160px)',
        textAlign: 'center',
      }}
    >
      <Reveal>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 36 }}>
          <Eyebrow color={C.textMuted} align="center">
            Notre engagement
          </Eyebrow>
        </div>
      </Reveal>
      <Reveal delay={0.1}>
        <p
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 'clamp(24px,3.4vw,48px)',
            lineHeight: 1.38,
            fontWeight: 400,
            maxWidth: 900,
            margin: '0 auto',
            color: C.ink,
          }}
        >
          &ldquo;Un sourire n&apos;est pas qu&apos;une apparence —{' '}
          <span style={{ color: C.accent }}>c&apos;est la première chose que le monde retient de vous.</span>{' '}
          Nous le soignons avec la même exigence que vous lui accordez.&rdquo;
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
   CARE SEQUENCE — 320vh sticky crossfade
   ════════════════════════════════════════════════════════════════════════════ */
function PhaseImage({
  phase,
  i,
  total,
  progress,
}: {
  phase: Phase;
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

function PhaseCaption({
  phase,
  i,
  total,
  progress,
}: {
  phase: Phase;
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
  const y = useTransform(progress, [start, end], [28, -28]);

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
          fontSize: 'clamp(38px,9vw,120px)',
          color: 'rgba(13,148,136,0.25)',
          lineHeight: 1,
          marginBottom: 4,
        }}
      >
        {phase.roman}
      </span>
      <h2
        style={{
          fontFamily: SERIF,
          fontSize: 'clamp(38px,7vw,92px)',
          fontWeight: 400,
          color: C.white,
          lineHeight: 1,
          margin: '0 0 20px',
          textShadow: '0 8px 40px rgba(0,0,0,0.55)',
          letterSpacing: '0.08em',
        }}
      >
        {phase.caption}
      </h2>
      <p
        style={{
          fontFamily: SANS,
          fontWeight: 300,
          fontSize: 'clamp(15px,1.7vw,20px)',
          color: 'rgba(255,255,255,0.84)',
          maxWidth: 480,
          lineHeight: 1.7,
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
  const width = useTransform(progress, [i * seg, (i + 1) * seg], [10, 36]);
  return (
    <motion.div style={{ height: 2, width, background: C.accent, opacity }} />
  );
}

function CareSequence() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  return (
    <section
      ref={ref}
      style={{ height: '320vh', position: 'relative', background: C.bgDark }}
      id="soins"
    >
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        {/* Section label top-right */}
        <div
          style={{
            position: 'absolute',
            top: 28,
            right: 'clamp(20px,4vw,52px)',
            zIndex: 4,
            fontFamily: SANS,
            fontSize: 10,
            letterSpacing: '0.34em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.5)',
            fontWeight: 500,
          }}
        >
          Nos soins
        </div>

        {/* Images en crossfade */}
        {PHASES.map((p, i) => (
          <PhaseImage
            key={p.caption}
            phase={p}
            i={i}
            total={PHASES.length}
            progress={scrollYProgress}
          />
        ))}

        {/* Voile lisibilité */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to bottom, rgba(9,31,28,0.40), rgba(9,31,28,0.08) 40%, rgba(9,31,28,0.65))',
          }}
        />

        {/* Légendes en crossfade */}
        {PHASES.map((p, i) => (
          <PhaseCaption
            key={p.caption}
            phase={p}
            i={i}
            total={PHASES.length}
            progress={scrollYProgress}
          />
        ))}

        {/* Dots de progression */}
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
              key={p.roman}
              i={i}
              total={PHASES.length}
              progress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   TREATMENT CARDS — 6 cartes sur fond clair
   ════════════════════════════════════════════════════════════════════════════ */
function TreatmentCard({ t, i }: { t: Treatment; i: number }) {
  const [hover, setHover] = useState(false);
  const card: React.CSSProperties = {
    background: C.bgCard,
    border: `1px solid ${hover ? C.border : 'rgba(200,230,226,0.5)'}`,
    borderTop: `3px solid ${hover ? C.accent : C.border}`,
    padding: 'clamp(28px,3.5vw,42px)',
    transform: hover ? 'translateY(-10px)' : 'none',
    boxShadow: hover
      ? '0 36px 72px -30px rgba(9,31,28,0.18)'
      : '0 8px 32px -20px rgba(9,31,28,0.10)',
    transition: 'all .6s cubic-bezier(.16,1,.3,1)',
    cursor: 'default',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    boxSizing: 'border-box',
  };
  return (
    <Reveal delay={i * 0.09} style={{ height: '100%' }}>
      <article
        style={card}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div
          style={{
            fontFamily: SANS,
            fontSize: 10,
            letterSpacing: '0.36em',
            textTransform: 'uppercase',
            color: C.accent,
            fontWeight: 600,
            padding: '4px 10px',
            background: C.accentLight,
            display: 'inline-block',
            marginBottom: 22,
            borderRadius: 2,
          }}
        >
          {t.tag}
        </div>
        <div
          style={{
            fontFamily: SERIF,
            fontSize: 'clamp(28px,2.8vw,36px)',
            color: C.textFaint,
            lineHeight: 1,
            marginBottom: 16,
          }}
        >
          {t.icon}
        </div>
        <h3
          style={{
            fontFamily: SERIF,
            fontSize: 'clamp(20px,2.2vw,26px)',
            fontWeight: 400,
            color: C.ink,
            margin: '0 0 14px',
            lineHeight: 1.15,
          }}
        >
          {t.label}
        </h3>
        <p
          style={{
            fontFamily: SANS,
            fontSize: 'clamp(14px,1.3vw,15px)',
            lineHeight: 1.72,
            color: C.textMuted,
            margin: '0 0 24px',
            flex: 1,
            fontWeight: 300,
          }}
        >
          {t.desc}
        </p>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            fontFamily: SANS,
            fontSize: 11,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: hover ? C.accentDark : C.accent,
            fontWeight: 600,
            transition: 'color .4s',
          }}
        >
          En savoir plus
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

function TreatmentCards() {
  return (
    <section
      style={{
        background: C.bg,
        padding: 'clamp(96px,13vw,180px) clamp(24px,6vw,96px)',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto 60px' }}>
        <Reveal>
          <Eyebrow>Nos soins</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(36px,5.5vw,72px)',
              fontWeight: 400,
              color: C.ink,
              margin: '22px 0 0',
              lineHeight: 1.05,
            }}
          >
            Une expertise complète,{' '}
            <span style={{ fontStyle: 'italic', color: C.accent }}>
              sur mesure
            </span>
          </h2>
        </Reveal>
      </div>
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'clamp(20px,2.5vw,36px)',
        }}
      >
        {TREATMENTS.map((t, i) => (
          <TreatmentCard key={t.label} t={t} i={i} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   EDITORIAL ROWS — 2 rangées alternées photo / texte
   ════════════════════════════════════════════════════════════════════════════ */
function EditorialRowItem({ row }: { row: EditRow }) {
  const wrap: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 'clamp(40px,6vw,96px)',
    alignItems: 'center',
  };
  const imgWrap: React.CSSProperties = {
    overflow: 'hidden',
    order: row.reverse ? 2 : 1,
    aspectRatio: '4 / 5',
  };
  const txt: React.CSSProperties = { order: row.reverse ? 1 : 2 };

  return (
    <div style={wrap} className="cs-editrow">
      <Reveal y={50} style={imgWrap}>
        <ParallaxImg src={row.img} alt={row.alt} />
      </Reveal>
      <div style={txt}>
        <Reveal>
          <Eyebrow color={C.textMuted}>{row.eyebrow}</Eyebrow>
        </Reveal>
        <Reveal delay={0.07}>
          <div
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: 'clamp(52px,7vw,96px)',
              color: 'rgba(13,148,136,0.10)',
              lineHeight: 1,
              fontWeight: 400,
              marginTop: 12,
              userSelect: 'none',
            }}
          >
            {row.num}
          </div>
        </Reveal>
        <Reveal delay={0.12}>
          <h3
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(30px,4vw,56px)',
              fontWeight: 400,
              color: C.ink,
              margin: '0 0 22px',
              lineHeight: 1.1,
              marginTop: -16,
            }}
          >
            {row.title}
          </h3>
        </Reveal>
        <Reveal delay={0.18}>
          <p
            style={{
              fontFamily: SANS,
              fontSize: 'clamp(15px,1.5vw,17px)',
              lineHeight: 1.82,
              color: C.textMuted,
              fontWeight: 300,
              maxWidth: 480,
            }}
          >
            {row.body}
          </p>
        </Reveal>
      </div>
      <style>{`
        @media (max-width: 860px) {
          .cs-editrow { grid-template-columns: 1fr !important; }
          .cs-editrow > * { order: initial !important; }
        }
      `}</style>
    </div>
  );
}

function EditorialRows() {
  return (
    <section
      style={{
        background: C.bgAlt,
        padding: 'clamp(80px,11vw,160px) clamp(24px,6vw,96px)',
      }}
      id="equipe"
    >
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(80px,11vw,150px)',
        }}
      >
        {EDIT_ROWS.map((row) => (
          <EditorialRowItem key={row.num} row={row} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   TECH PANEL — image sticky gauche, specs qui défilent à droite
   ════════════════════════════════════════════════════════════════════════════ */
function TechPanel() {
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 'clamp(48px,7vw,108px)',
    maxWidth: 1280,
    margin: '0 auto',
    alignItems: 'start',
  };
  const stickySide: React.CSSProperties = {
    position: 'sticky',
    top: 100,
    alignSelf: 'start',
  };

  return (
    <section
      style={{
        background: C.bgDark,
        padding: 'clamp(80px,11vw,160px) clamp(24px,6vw,96px)',
      }}
      id="technologie"
    >
      <div style={grid} className="cs-techpanel">
        {/* Image collante */}
        <div style={stickySide} className="cs-techpanel-sticky">
          <div
            style={{
              overflow: 'hidden',
              border: `1px solid ${C.borderDark}`,
              aspectRatio: '3 / 4',
            }}
          >
            <img
              src={P.treatment}
              alt="Technologie dentaire numérique — Cabinet Sorrento"
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
          <div style={{ marginTop: 28 }}>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 10,
                letterSpacing: '0.32em',
                textTransform: 'uppercase',
                color: C.accent,
                fontWeight: 600,
                marginBottom: 10,
              }}
            >
              Cabinet Sorrento · Nice
            </div>
            <div
              style={{
                fontFamily: SERIF,
                fontStyle: 'italic',
                fontSize: 18,
                color: 'rgba(255,255,255,0.72)',
                lineHeight: 1.55,
              }}
            >
              &ldquo;La technologie ne remplace pas le soin — elle le rend parfait.&rdquo;
            </div>
          </div>
        </div>

        {/* Specs défilantes */}
        <div>
          <Reveal>
            <Eyebrow color={C.accent}>Équipement</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(32px,4.8vw,62px)',
                fontWeight: 400,
                color: C.white,
                margin: '22px 0 52px',
                lineHeight: 1.06,
              }}
            >
              Numérique{' '}
              <span style={{ fontStyle: 'italic', color: C.accentLight }}>
                de bout en bout
              </span>
            </h2>
          </Reveal>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {SPECS.map((spec, i) => (
              <Reveal key={spec.num} delay={0.05 * i}>
                <div
                  style={{
                    padding: 'clamp(28px,3.5vw,42px) 0',
                    borderTop: `1px solid ${C.borderDark}`,
                    display: 'flex',
                    gap: 'clamp(20px,3vw,40px)',
                    alignItems: 'flex-start',
                  }}
                >
                  <span
                    style={{
                      fontFamily: SANS,
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: '0.16em',
                      color: C.accent,
                      minWidth: 36,
                      paddingTop: 4,
                      flexShrink: 0,
                    }}
                  >
                    {spec.num}
                  </span>
                  <div>
                    <h4
                      style={{
                        fontFamily: SERIF,
                        fontSize: 'clamp(20px,2.2vw,26px)',
                        fontWeight: 400,
                        color: C.white,
                        margin: '0 0 10px',
                      }}
                    >
                      {spec.title}
                    </h4>
                    <p
                      style={{
                        fontFamily: SANS,
                        fontWeight: 300,
                        fontSize: 'clamp(14px,1.4vw,15.5px)',
                        lineHeight: 1.72,
                        color: 'rgba(255,255,255,0.62)',
                        margin: 0,
                      }}
                    >
                      {spec.detail}
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
          .cs-techpanel { grid-template-columns: 1fr !important; }
          .cs-techpanel-sticky { position: static !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   TESTIMONIALS — 3 cartes, icône Quote or, étoiles teal
   ════════════════════════════════════════════════════════════════════════════ */
function Testimonials() {
  return (
    <section
      style={{
        background: C.bg,
        padding: 'clamp(90px,12vw,170px) clamp(24px,6vw,96px)',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto 60px', textAlign: 'center' }}>
        <Reveal>
          <Eyebrow color={C.textMuted} align="center">
            Témoignages
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(34px,5vw,66px)',
              fontWeight: 400,
              color: C.ink,
              margin: '22px 0 0',
              lineHeight: 1.05,
            }}
          >
            Ce que disent{' '}
            <span style={{ fontStyle: 'italic', color: C.accent }}>nos patients</span>
          </h2>
        </Reveal>
      </div>
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'clamp(24px,3vw,40px)',
        }}
      >
        {REVIEWS.map((r, i) => (
          <ReviewCard key={r.name} r={r} i={i} />
        ))}
      </div>
    </section>
  );
}

function ReviewCard({ r, i }: { r: Review; i: number }) {
  return (
    <Reveal delay={i * 0.12} style={{ height: '100%' }}>
      <figure
        style={{
          background: C.bgCard,
          border: `1px solid ${C.border}`,
          padding: 'clamp(32px,4vw,50px)',
          margin: 0,
          height: '100%',
          boxSizing: 'border-box',
          boxShadow: '0 20px 56px -36px rgba(9,31,28,0.16)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Quote size={32} color={C.gold} strokeWidth={1.3} />
        <div
          style={{
            display: 'flex',
            gap: 4,
            margin: '20px 0 18px',
          }}
        >
          {Array.from({ length: 5 }).map((_, s) => (
            <Star key={s} size={14} fill={C.accent} color={C.accent} strokeWidth={0} />
          ))}
        </div>
        <blockquote
          style={{
            fontFamily: SANS,
            fontWeight: 300,
            fontSize: 'clamp(15px,1.5vw,17px)',
            lineHeight: 1.76,
            color: C.ink,
            margin: '0 0 28px',
            flex: 1,
          }}
        >
          &ldquo;{r.quote}&rdquo;
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
              marginBottom: 4,
            }}
          >
            {r.name}
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
            {r.role}
          </div>
        </figcaption>
      </figure>
    </Reveal>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   APPOINTMENT FORM — fond sombre, champs underline
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

  const fieldBase: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    background: 'transparent',
    border: 'none',
    borderBottom: `1px solid rgba(13,148,136,0.35)`,
    padding: '16px 2px',
    fontFamily: SANS,
    fontSize: 17,
    fontWeight: 300,
    color: C.white,
    outline: 'none',
    transition: 'border-color .3s',
  };

  const labelBase: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 10,
    letterSpacing: '0.38em',
    textTransform: 'uppercase',
    color: C.accent,
    fontWeight: 600,
    display: 'block',
    marginBottom: 4,
  };

  return (
    <section
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: C.bgDark,
        padding: 'clamp(96px,13vw,180px) clamp(24px,6vw,96px)',
      }}
      id="rdv"
    >
      {/* Background texture subtle */}
      <img
        src={P.clinicMed}
        alt=""
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
          maxWidth: 700,
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <Reveal>
          <Eyebrow color={C.accentLight} align="center">
            Prise de rendez-vous
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(36px,5.5vw,74px)',
              fontWeight: 400,
              color: C.white,
              margin: '22px 0 18px',
              lineHeight: 1.04,
            }}
          >
            Votre sourire{' '}
            <span style={{ fontStyle: 'italic', color: C.accentLight }}>
              commence ici
            </span>
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <p
            style={{
              fontFamily: SANS,
              fontWeight: 300,
              fontSize: 'clamp(15px,1.6vw,18px)',
              lineHeight: 1.74,
              color: 'rgba(255,255,255,0.72)',
              maxWidth: 520,
              margin: '0 auto 52px',
            }}
          >
            Renseignez vos coordonnées — notre équipe vous recontactera sous 24 h pour confirmer votre créneau.
          </p>
        </Reveal>

        {sent ? (
          <Reveal>
            <div
              style={{
                border: `1px solid ${C.borderDark}`,
                padding: 'clamp(36px,5vw,56px)',
                background: 'rgba(13,148,136,0.06)',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: 'rgba(13,148,136,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 22px',
                  fontSize: 26,
                }}
              >
                ✓
              </div>
              <h3
                style={{
                  fontFamily: SERIF,
                  fontSize: 'clamp(28px,3.5vw,40px)',
                  fontWeight: 400,
                  color: C.white,
                  margin: '0 0 14px',
                  fontStyle: 'italic',
                }}
              >
                Merci {prenom}.
              </h3>
              <p
                style={{
                  fontFamily: SANS,
                  fontWeight: 300,
                  fontSize: 16,
                  color: 'rgba(255,255,255,0.72)',
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                Votre demande de rendez-vous pour{' '}
                <strong style={{ color: C.accentLight, fontWeight: 500 }}>{motif}</strong>{' '}
                a bien été reçue. Nous vous contacterons à{' '}
                <strong style={{ color: C.accentLight, fontWeight: 500 }}>{email}</strong>{' '}
                sous 24 h.
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
                gap: 34,
                textAlign: 'left',
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 28,
                }}
                className="cs-formrow"
              >
                <div>
                  <label style={labelBase} htmlFor="cs-prenom">Prénom</label>
                  <input
                    id="cs-prenom"
                    style={fieldBase}
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    placeholder="Clara"
                    autoComplete="given-name"
                    required
                  />
                </div>
                <div>
                  <label style={labelBase} htmlFor="cs-email">Email</label>
                  <input
                    id="cs-email"
                    style={fieldBase}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="clara@exemple.fr"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div>
                <label style={labelBase} htmlFor="cs-tel">Téléphone</label>
                <input
                  id="cs-tel"
                  style={fieldBase}
                  type="tel"
                  value={tel}
                  onChange={(e) => setTel(e.target.value)}
                  placeholder="+33 6 00 00 00 00"
                  autoComplete="tel"
                />
              </div>

              <div>
                <label style={labelBase} htmlFor="cs-motif">Motif de consultation</label>
                <select
                  id="cs-motif"
                  style={{
                    ...fieldBase,
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    cursor: 'pointer',
                    color: motif ? C.white : 'rgba(255,255,255,0.42)',
                  }}
                  value={motif}
                  onChange={(e) => setMotif(e.target.value)}
                  required
                >
                  <option value="" style={{ color: '#000' }}>Choisir un motif…</option>
                  <option value="Bilan" style={{ color: '#000' }}>Bilan</option>
                  <option value="Détartrage" style={{ color: '#000' }}>Détartrage</option>
                  <option value="Blanchiment" style={{ color: '#000' }}>Blanchiment</option>
                  <option value="Implant" style={{ color: '#000' }}>Implant</option>
                  <option value="Urgence" style={{ color: '#000' }}>Urgence</option>
                  <option value="Autre" style={{ color: '#000' }}>Autre</option>
                </select>
              </div>

              <div>
                <label style={labelBase} htmlFor="cs-message">Message (optionnel)</label>
                <textarea
                  id="cs-message"
                  style={{
                    ...fieldBase,
                    resize: 'none',
                    minHeight: 100,
                    paddingTop: 14,
                  }}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Précisions, antécédents médicaux, disponibilités préférées…"
                  rows={4}
                />
              </div>

              <div style={{ textAlign: 'center', paddingTop: 8 }}>
                <TealButton filled type="submit">
                  Envoyer ma demande
                </TealButton>
              </div>
            </form>
          </Reveal>
        )}
      </div>
      <style>{`
        @media (max-width: 580px) {
          .cs-formrow { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   FOOTER — 4 colonnes
   ════════════════════════════════════════════════════════════════════════════ */
function Footer() {
  const cols: { title: string; items: { label: string; href: string }[] }[] = [
    {
      title: 'Soins',
      items: [
        { label: 'Bilan & Détartrage', href: '#soins' },
        { label: 'Blanchiment', href: '#soins' },
        { label: 'Facettes Céramique', href: '#soins' },
        { label: 'Implants', href: '#soins' },
        { label: 'Orthodontie Invisible', href: '#soins' },
        { label: 'Pédodontie', href: '#soins' },
      ],
    },
    {
      title: 'Cabinet',
      items: [
        { label: "L'Équipe", href: '#equipe' },
        { label: 'Technologie', href: '#technologie' },
        { label: 'Notre philosophie', href: '#equipe' },
        { label: 'Témoignages', href: '#rdv' },
      ],
    },
    {
      title: 'Légal',
      items: [
        { label: 'Mentions légales', href: '#' },
        { label: 'Confidentialité', href: '#' },
        { label: 'Accessibilité', href: '#' },
      ],
    },
  ];

  return (
    <footer
      style={{
        background: C.bgDarkAlt,
        borderTop: `1px solid rgba(13,148,136,0.16)`,
        padding: 'clamp(70px,9vw,110px) clamp(24px,6vw,96px) 40px',
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.5fr repeat(3, 1fr)',
          gap: 'clamp(36px,5vw,72px)',
        }}
        className="cs-footgrid"
      >
        {/* Branding */}
        <div>
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 24,
              letterSpacing: '0.06em',
              color: C.white,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 20,
            }}
          >
            <span style={{ color: C.accent, fontSize: 22 }}>◉</span>
            Sorrento
          </div>
          <p
            style={{
              fontFamily: SANS,
              fontWeight: 300,
              fontSize: 14,
              lineHeight: 1.8,
              color: 'rgba(255,255,255,0.55)',
              maxWidth: 300,
              marginBottom: 24,
            }}
          >
            Cabinet dentaire Dr. Clara Sorrento &amp; Associés — 12 rue de la Liberté, 06000 Nice.
          </p>
          <div
            style={{
              fontFamily: SANS,
              fontSize: 12,
              fontWeight: 500,
              color: C.accent,
              letterSpacing: '0.06em',
            }}
          >
            04 93 00 00 00
          </div>
          <div
            style={{
              fontFamily: SANS,
              fontSize: 12,
              fontWeight: 300,
              color: 'rgba(255,255,255,0.45)',
              marginTop: 6,
            }}
          >
            contact@sorrento-dentaire.fr
          </div>
        </div>

        {/* Colonnes */}
        {cols.map((col) => (
          <div key={col.title}>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 10,
                letterSpacing: '0.36em',
                textTransform: 'uppercase',
                color: C.accent,
                fontWeight: 600,
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
                      fontSize: 14,
                      fontWeight: 300,
                      color: 'rgba(255,255,255,0.62)',
                      textDecoration: 'none',
                      transition: 'color .3s',
                    }}
                    onMouseEnter={(e) =>
                      ((e.target as HTMLAnchorElement).style.color = C.accentLight)
                    }
                    onMouseLeave={(e) =>
                      ((e.target as HTMLAnchorElement).style.color =
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
          margin: '64px auto 0',
          paddingTop: 28,
          borderTop: `1px solid rgba(13,148,136,0.12)`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
          fontFamily: SANS,
          fontSize: 11,
          fontWeight: 300,
          letterSpacing: '0.08em',
          color: 'rgba(255,255,255,0.38)',
        }}
      >
        <span>
          © 2026 Cabinet Dentaire Sorrento. Tous droits réservés.
        </span>
        <span>
          Dr. Clara Sorrento · RPPS 00000000000 · Ordre des Chirurgiens-Dentistes
        </span>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .cs-footgrid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 520px) {
          .cs-footgrid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════════════════════════════════════ */
export default function Page() {
  return (
    <>
      {/* Google Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href={FONT_LINK} rel="stylesheet" />

      <main
        suppressHydrationWarning
        style={{
          background: C.bgDark,
          color: C.ink,
          fontFamily: SANS,
          overflowX: 'hidden',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        }}
      >
        <Nav />
        <Hero />
        <Manifesto />
        <CareSequence />
        <TreatmentCards />
        <EditorialRows />
        <TechPanel />
        <Testimonials />
        <AppointmentForm />
        <Footer />
      </main>
    </>
  );
}
