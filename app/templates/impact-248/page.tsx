'use client';

import React, { useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  MotionValue,
} from 'framer-motion';
import { ArrowRight, ChevronDown, Leaf, MapPin } from 'lucide-react';

/* ════════════════════════════════════════════════════════════════════════════
   OSTÉO RÉPUBLIQUE — Cabinet d'Ostéopathie · Paris 11e
   Chorégraphie éditoriale premium : crossfade sticky 320vh, panneau principe
   collant, formulaire RDV interactif. Auto-suffisant. 'use client'.
   ════════════════════════════════════════════════════════════════════════════ */

/* ── Google Fonts ──────────────────────────────────────────────────────────── */
const GOOGLE_FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Mulish:wght@300;400;500;600&display=swap';

/* ── Palette ─────────────────────────────────────────────────────────────── */
const C = {
  bg: '#f6f4f0',
  bgAlt: '#ede9e2',
  bgDark: '#1a1510',
  bgDarkAlt: '#120e0b',
  bgCard: '#ffffff',
  accent: '#6b7c5a',
  accentDark: '#506048',
  accentLight: '#d8e0cc',
  white: '#ffffff',
  ink: '#1a1510',
  textMuted: '#4a4438',
  textFaint: '#8a8070',
  border: '#ddd8d0',
  borderDark: 'rgba(107,124,90,0.2)',
  warm: '#c4945c',
} as const;

const SERIF = "'Cormorant Garamond', Georgia, serif" as const;
const SANS = "'Mulish', system-ui, sans-serif" as const;

/* ── Easing partagé ──────────────────────────────────────────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ════════════════════════════════════════════════════════════════════════════
   Interfaces typées
   ════════════════════════════════════════════════════════════════════════════ */
interface Approach {
  id: string;
  index: string;
  label: string;
  title: string;
  body: string;
  imgId: string;
}

interface Specialty {
  title: string;
  description: string;
}

interface EditRow {
  eyebrow: string;
  title: React.ReactNode;
  body: string;
  imgId: string;
  alt: string;
  reverse: boolean;
  numeralLabel: string;
}

interface PrincipleItem {
  index: string;
  title: string;
  body: string;
}

interface Testimonial {
  quote: string;
  name: string;
  context: string;
}

/* ── Data ─────────────────────────────────────────────────────────────────── */
const PHASES: Approach[] = [
  {
    id: 'structure',
    index: 'I',
    label: 'STRUCTURE',
    title: 'Structure',
    body: "Colonne vertébrale, bassin, membres — rétablir l'équilibre musculo-squelettique pour libérer les tensions.",
    imgId: '1544367745-a81e18eb7be2',
  },
  {
    id: 'visceral',
    index: 'II',
    label: 'VISCÉRAL',
    title: 'Viscéral',
    body: "Foie, intestins, diaphragme — les organes ont leur propre mobilité que l'ostéopathie sait écouter.",
    imgId: '1498804103-78838778a06b',
  },
  {
    id: 'cranien',
    index: 'III',
    label: 'CRÂNIEN',
    title: 'Crânien',
    body: 'Micro-mouvements du crâne et des méninges — approche douce pour nourrissons, migraineux et post-traumatismes.',
    imgId: '1570295999-41bbf40f8fb5',
  },
];

const SPECIALTIES: Specialty[] = [
  {
    title: 'Douleurs dorsales & lombaires',
    description:
      'Lombalgies aiguës ou chroniques, hernies discales, douleurs postérales liées au travail ou au sport.',
  },
  {
    title: 'Cervicalgies & migraines',
    description:
      "Raideurs cervicales, maux de tête de tension, vertiges cervicogènes et névralgie d'Arnold.",
  },
  {
    title: 'Suivi sportif',
    description:
      'Prévention des blessures, récupération post-effort, entorses, tendinites et optimisation des performances.',
  },
  {
    title: 'Nourrissons & pédiatrie',
    description:
      'Plagiocéphalie, torticolis congénital, coliques, troubles du sommeil et suivi post-natal.',
  },
  {
    title: 'Femmes enceintes',
    description:
      "Lombalgies de grossesse, préparation à l'accouchement, suivi post-partum et douleurs du bassin.",
  },
  {
    title: 'Stress & anxiété somato',
    description:
      'Manifestations physiques du stress : tensions musculaires, troubles digestifs fonctionnels, insomnies.',
  },
];

const EDIT_ROWS: EditRow[] = [
  {
    eyebrow: 'Notre approche',
    title: (
      <>
        Écouter /{' '}
        <span style={{ fontStyle: 'italic' }}>le corps.</span>
      </>
    ),
    body: "Chaque consultation est unique. Le corps est traité comme un système global — structure, viscères, crâne sont interdépendants. Nous n'imposons pas de protocole : nous écoutons, palpons, adaptons. Aucune séance ne ressemble à la précédente, parce qu'aucun patient ne ressemble à un autre.",
    imgId: '1544367745-a81e18eb7be2',
    alt: 'Ostéopathe en consultation, écoute du corps',
    reverse: false,
    numeralLabel: 'I',
  },
  {
    eyebrow: 'Le cabinet',
    title: (
      <>
        Paris 11e, /{' '}
        <span style={{ fontStyle: 'italic' }}>accessible.</span>
      </>
    ),
    body: "Le cabinet est situé à deux pas des stations Oberkampf et République. Accessible aux personnes à mobilité réduite, le lieu est conçu pour la sérénité. La prise de rendez-vous en ligne est disponible 24h/24 — les premières disponibilités s'affichent en temps réel.",
    imgId: '1498804103-78838778a06b',
    alt: 'Cabinet ostéopathie Paris 11e, espace de soin lumineux',
    reverse: true,
    numeralLabel: 'II',
  },
];

const PRINCIPLES: PrincipleItem[] = [
  {
    index: 'I',
    title: 'Le corps est une unité',
    body: "Structure, fonction et psyché sont indissociables. Traiter une épaule sans considérer la posture globale, la respiration, l'état émotionnel du patient serait incomplet.",
  },
  {
    index: 'II',
    title: "Le corps possède ses propres mécanismes d'autoguérison",
    body: "L'ostéopathe n'impose pas : il lève les obstacles. Une fois les tensions relâchées, les processus naturels de récupération peuvent s'exprimer pleinement.",
  },
  {
    index: 'III',
    title: 'La structure gouverne la fonction',
    body: "Tout désalignement mécanique a des conséquences fonctionnelles en cascade. Rétablir la mobilité structurelle, c'est restaurer la physiologie.",
  },
  {
    index: 'IV',
    title: "L'ostéopathie traite le patient, pas le symptôme",
    body: "La douleur est un signal, pas une maladie. La consulte vise à comprendre son origine profonde plutôt qu'à la masquer — pour un résultat durable.",
  },
];

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Dix ans de douleurs lombaires chroniques. Trois séances et je gère maintenant de façon autonome, avec les conseils posturaux donnés en fin de consultation. Je n'aurais pas cru que c'était possible.",
    name: 'Laurent M.',
    context: 'Patient · Douleurs lombaires chroniques',
  },
  {
    quote:
      "Notre fils de six semaines souffrait de coliques intenses. Après deux séances adaptées aux nourrissons, l'amélioration a été spectaculaire. L'approche douce et rassurante de l'ostéopathe nous a mis en confiance dès le premier rendez-vous.",
    name: 'Camille & Thomas B.',
    context: 'Parents · Nourrisson, coliques',
  },
];

/* ── Photo helper ─────────────────────────────────────────────────────────── */
function photo(id: string, w = 1600) {
  return `https://images.unsplash.com/photo-${id}?q=80&w=${w}&auto=format&fit=crop`;
}

/* ════════════════════════════════════════════════════════════════════════════
   Primitives partagées
   ════════════════════════════════════════════════════════════════════════════ */

/** Étiquette fine, capitales, filet vert sauge. */
function Eyebrow({
  children,
  color = C.accent,
  align = 'left',
}: {
  children: React.ReactNode;
  color?: string;
  align?: 'left' | 'center' | 'right';
}) {
  const wrap: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    justifyContent: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start',
  };
  const rule: React.CSSProperties = {
    width: 40,
    height: 1,
    background: color,
    opacity: 0.65,
    flexShrink: 0,
  };
  const label: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 10.5,
    letterSpacing: '0.44em',
    textTransform: 'uppercase' as const,
    color,
    fontWeight: 500,
  };
  return (
    <div style={wrap}>
      {align !== 'right' && <span style={rule} />}
      <span style={label}>{children}</span>
      {(align === 'center' || align === 'right') && <span style={rule} />}
    </div>
  );
}

/** Révélation au scroll : fondu + translation verticale, une seule fois. */
function Reveal({
  children,
  delay = 0,
  y = 34,
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

/** Bouton accent, fond vert sauge ou contour. */
function AccentButton({
  children,
  onClick,
  filled = false,
  type = 'button',
  href,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  filled?: boolean;
  type?: 'button' | 'submit';
  href?: string;
}) {
  const [hover, setHover] = useState(false);
  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 12,
    padding: '15px 30px',
    fontFamily: SANS,
    fontSize: 11.5,
    letterSpacing: '0.22em',
    textTransform: 'uppercase' as const,
    fontWeight: 500,
    cursor: 'pointer',
    border: `1px solid ${C.accent}`,
    background: filled ? C.accent : 'transparent',
    color: filled ? C.white : C.accent,
    textDecoration: 'none',
    transition: 'all .5s cubic-bezier(.16,1,.3,1)',
  };
  const hov: React.CSSProperties = hover
    ? filled
      ? { background: C.accentDark, borderColor: C.accentDark, transform: 'translateY(-2px)' }
      : { background: 'rgba(107,124,90,0.08)', transform: 'translateY(-2px)' }
    : {};

  const inner = (
    <>
      {children}
      <ArrowRight
        size={14}
        style={{
          transform: hover ? 'translateX(5px)' : 'none',
          transition: 'transform .5s cubic-bezier(.16,1,.3,1)',
        }}
      />
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        style={{ ...base, ...hov }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {inner}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ ...base, ...hov }}
    >
      {inner}
    </button>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   NAV — transparente → sombre au défilement
   ════════════════════════════════════════════════════════════════════════════ */
function Nav() {
  const [solid, setSolid] = useState(false);

  React.useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 72);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: 'Consultations', href: '#consultations' },
    { label: 'Approche', href: '#approche' },
    { label: 'À propos', href: '#apropos' },
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
      ? '15px clamp(20px,5vw,64px)'
      : '24px clamp(20px,5vw,64px)',
    background: solid ? 'rgba(26,21,16,0.94)' : 'transparent',
    backdropFilter: solid ? 'blur(16px) saturate(130%)' : 'none',
    WebkitBackdropFilter: solid ? 'blur(16px) saturate(130%)' : 'none',
    borderBottom: solid
      ? `1px solid rgba(107,124,90,0.22)`
      : '1px solid transparent',
    transition: 'all .6s cubic-bezier(.16,1,.3,1)',
  };

  const brand: React.CSSProperties = {
    fontFamily: SERIF,
    fontSize: 'clamp(18px,1.5vw,22px)',
    letterSpacing: '0.10em',
    color: C.white,
    fontWeight: 400,
    textDecoration: 'none',
  };

  const linkRow: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'clamp(20px,2.4vw,40px)',
  };

  return (
    <nav style={bar} aria-label="Navigation principale">
      <a href="#haut" style={brand}>
        Ostéo&nbsp;République
      </a>
      <div style={linkRow} className="or-navlinks">
        {links.map((l) => (
          <NavLink key={l.label} label={l.label} href={l.href} />
        ))}
      </div>
      <div className="or-navcta">
        <AccentButton filled href="#rdv">
          Prendre RDV
        </AccentButton>
      </div>
      <style>{`
        @media (max-width: 860px) {
          .or-navlinks { display: none !important; }
          .or-navcta { display: none !important; }
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
        letterSpacing: '0.20em',
        textTransform: 'uppercase',
        color: h ? C.accentLight : 'rgba(255,255,255,0.88)',
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
          transition: 'width .5s cubic-bezier(.16,1,.3,1)',
        }}
      />
    </a>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   HERO — 100vh, parallaxe, motif feuilles
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
  const cueOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);

  const section: React.CSSProperties = {
    position: 'relative',
    height: '100vh',
    minHeight: 640,
    overflow: 'hidden',
    background: C.bgDark,
  };

  return (
    <section ref={ref} style={section} id="haut">
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
          src={photo('1544367745-a81e18eb7be2', 2000)}
          alt="Soin ostéopathique — mains de l'ostéopathe sur le dos d'un patient"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          priority-hint="high"
        />
      </motion.div>

      {/* Voile sombre dégradé */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(26,21,16,0.50) 0%, rgba(26,21,16,0.12) 36%, rgba(26,21,16,0.50) 68%, rgba(26,21,16,0.90) 100%)',
        }}
      />
      {/* Teinte verte subtile */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(130% 80% at 50% 30%, transparent 45%, rgba(26,30,20,0.50) 100%)',
          mixBlendMode: 'multiply',
        }}
      />

      {/* Motif feuilles CSS — décoration douce */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '18%',
          left: '8%',
          width: 60,
          height: 90,
          borderRadius: '50% 5% 50% 5%',
          background: 'rgba(107,124,90,0.08)',
          transform: 'rotate(-35deg)',
          pointerEvents: 'none',
        }}
      />
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '24%',
          right: '9%',
          width: 44,
          height: 70,
          borderRadius: '50% 5% 50% 5%',
          background: 'rgba(107,124,90,0.06)',
          transform: 'rotate(28deg)',
          pointerEvents: 'none',
        }}
      />
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '22%',
          right: '14%',
          width: 34,
          height: 54,
          borderRadius: '50% 5% 50% 5%',
          background: 'rgba(107,124,90,0.07)',
          transform: 'rotate(-18deg)',
          pointerEvents: 'none',
        }}
      />

      {/* Titre avec parallaxe */}
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
          padding: '0 clamp(24px,6vw,96px)',
          y: titleY,
          opacity: titleOpacity,
        }}
      >
        <Reveal y={16}>
          <Eyebrow color={C.accentLight} align="center">
            Ostéopathie D.O. · Paris 11e
          </Eyebrow>
        </Reveal>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.15 }}
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontWeight: 400,
            color: C.white,
            fontSize: 'clamp(3rem,7vw,8rem)',
            lineHeight: 0.98,
            letterSpacing: '-0.01em',
            margin: 'clamp(22px,3vw,36px) 0 clamp(18px,2vw,28px)',
            textShadow: '0 12px 60px rgba(0,0,0,0.5)',
          }}
        >
          Le mouvement&nbsp;/
          <br />
          retrouvé.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.46 }}
          style={{
            fontFamily: SANS,
            fontWeight: 300,
            fontSize: 'clamp(15px,1.6vw,19px)',
            color: 'rgba(255,255,255,0.82)',
            maxWidth: 520,
            lineHeight: 1.7,
          }}
        >
          Cabinet d'ostéopathie générale — adultes, sportifs, nourrissons et femmes
          enceintes. Approche globale, mains expertes, résultats durables.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.72 }}
          style={{ marginTop: 'clamp(32px,4vw,48px)' }}
        >
          <AccentButton filled href="#rdv">
            Réserver une séance
          </AccentButton>
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
            letterSpacing: '0.38em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.62)',
          }}
        >
          Découvrir
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={18} color={C.accentLight} strokeWidth={1.4} />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   INTRO — citation centrée sur fond bgAlt
   ════════════════════════════════════════════════════════════════════════════ */
function Intro() {
  const sec: React.CSSProperties = {
    background: C.bgAlt,
    padding: 'clamp(90px,13vw,180px) clamp(24px,10vw,180px)',
    textAlign: 'center',
  };
  return (
    <section style={sec} id="apropos">
      <Reveal>
        <p
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: 'clamp(22px,3.2vw,44px)',
            lineHeight: 1.42,
            color: C.ink,
            maxWidth: 880,
            margin: '0 auto',
          }}
        >
          Le corps sait guérir.
          <br />
          L'ostéopathie lui rappelle comment.
        </p>
      </Reveal>
      <Reveal delay={0.18}>
        <div
          style={{
            width: 1,
            height: 80,
            background: `linear-gradient(${C.accent}, transparent)`,
            margin: '52px auto 0',
            opacity: 0.6,
          }}
        />
      </Reveal>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   APPROACH SEQUENCE — crossfade sticky 320vh
   ════════════════════════════════════════════════════════════════════════════ */
function ApproachImage({
  phase,
  i,
  total,
  progress,
}: {
  phase: Approach;
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
    i === 0 ? [1, 1, 1, 0] : i === total - 1 ? [0, 1, 1, 1] : [0, 1, 1, 0],
  );
  const scale = useTransform(progress, [start - fadeIn, end], [1.1, 1.0]);

  return (
    <motion.div style={{ position: 'absolute', inset: 0, opacity }}>
      <motion.img
        src={photo(phase.imgId)}
        alt={`Ostéopathie ${phase.title} — soin ${phase.label.toLowerCase()}`}
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

function ApproachCaption({
  phase,
  i,
  total,
  progress,
}: {
  phase: Approach;
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
        padding: '0 clamp(24px,8vw,120px)',
        opacity,
        y,
      }}
    >
      {/* Index en grand — watermark */}
      <span
        style={{
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontSize: 'clamp(60px,12vw,160px)',
          color: 'rgba(107,124,90,0.28)',
          lineHeight: 1,
          marginBottom: 4,
          userSelect: 'none',
        }}
      >
        {phase.index}
      </span>
      <h2
        style={{
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontSize: 'clamp(36px,6.5vw,90px)',
          fontWeight: 400,
          color: C.white,
          lineHeight: 1.02,
          margin: 0,
          textShadow: '0 8px 40px rgba(0,0,0,0.55)',
        }}
      >
        {phase.title}
      </h2>
      <p
        style={{
          fontFamily: SANS,
          fontWeight: 300,
          fontSize: 'clamp(14px,1.5vw,18px)',
          color: 'rgba(255,255,255,0.82)',
          marginTop: 18,
          maxWidth: 480,
          lineHeight: 1.72,
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
  const width = useTransform(progress, [i * seg, (i + 1) * seg], [10, 32]);
  return (
    <motion.div
      style={{ height: 2, width, background: C.accent, opacity }}
    />
  );
}

function ApproachSequence() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  return (
    <section
      ref={ref}
      style={{ height: '320vh', position: 'relative', background: C.bgDark }}
      id="approche"
    >
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        {/* Images en crossfade */}
        {PHASES.map((p, i) => (
          <ApproachImage
            key={p.id}
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
              'linear-gradient(to bottom, rgba(26,21,16,0.38), rgba(26,21,16,0.12) 42%, rgba(26,21,16,0.62))',
          }}
        />

        {/* Légendes animées */}
        {PHASES.map((p, i) => (
          <ApproachCaption
            key={p.id}
            phase={p}
            i={i}
            total={PHASES.length}
            progress={scrollYProgress}
          />
        ))}

        {/* Label section — coin supérieur droit */}
        <div
          style={{
            position: 'absolute',
            top: 'clamp(90px,10vh,120px)',
            right: 'clamp(24px,4vw,56px)',
            zIndex: 4,
          }}
        >
          <Eyebrow color={C.accentLight} align="right">
            Les champs de l'ostéopathie
          </Eyebrow>
        </div>

        {/* Points de progression */}
        <div
          style={{
            position: 'absolute',
            bottom: 36,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 12,
            zIndex: 4,
          }}
        >
          {PHASES.map((p, i) => (
            <ProgressDot
              key={p.id}
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
   SPECIALTY CARDS — 6 cartes sur fond bg
   ════════════════════════════════════════════════════════════════════════════ */
function SpecialtyCard({
  spec,
  i,
}: {
  spec: Specialty;
  i: number;
}) {
  const [hover, setHover] = useState(false);
  const card: React.CSSProperties = {
    background: C.bgCard,
    borderLeft: `3px solid ${hover ? C.accent : C.accentLight}`,
    padding: 'clamp(24px,3vw,36px)',
    boxShadow: hover
      ? '0 28px 60px -28px rgba(26,21,16,0.22)'
      : '0 8px 24px -16px rgba(26,21,16,0.10)',
    transform: hover ? 'translateY(-8px)' : 'none',
    transition: 'all .55s cubic-bezier(.16,1,.3,1)',
    cursor: 'default',
    height: '100%',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
  };
  return (
    <Reveal delay={i * 0.08} style={{ height: '100%' }}>
      <article
        style={card}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <h3
          style={{
            fontFamily: SERIF,
            fontSize: 'clamp(20px,1.8vw,24px)',
            fontWeight: 400,
            color: C.ink,
            margin: '0 0 14px',
            lineHeight: 1.2,
          }}
        >
          {spec.title}
        </h3>
        <p
          style={{
            fontFamily: SANS,
            fontWeight: 300,
            fontSize: 'clamp(13px,1.1vw,15px)',
            lineHeight: 1.72,
            color: C.textMuted,
            margin: 0,
            flex: 1,
          }}
        >
          {spec.description}
        </p>
      </article>
    </Reveal>
  );
}

function SpecialtyCards() {
  const sec: React.CSSProperties = {
    background: C.bg,
    padding: 'clamp(90px,12vw,170px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 'clamp(20px,2.5vw,36px)',
    maxWidth: 1240,
    margin: '0 auto',
  };
  return (
    <section style={sec} id="consultations">
      <div style={{ maxWidth: 1240, margin: '0 auto clamp(52px,7vw,80px)' }}>
        <Reveal>
          <Eyebrow>Consultations</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(32px,5vw,66px)',
              fontWeight: 400,
              color: C.ink,
              margin: 'clamp(16px,2vw,22px) 0 0',
              lineHeight: 1.06,
            }}
          >
            Ce que nous{' '}
            <span style={{ fontStyle: 'italic', color: C.accent }}>traitons</span>
          </h2>
        </Reveal>
      </div>
      <div style={grid}>
        {SPECIALTIES.map((s, i) => (
          <SpecialtyCard key={s.title} spec={s} i={i} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   EDITORIAL ROWS — 2 lignes alternées image / texte
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

function EditRowItem({ row }: { row: EditRow }) {
  const wrap: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 'clamp(36px,6vw,90px)',
    alignItems: 'center',
  };
  const imgWrap: React.CSSProperties = {
    overflow: 'hidden',
    order: row.reverse ? 2 : 1,
    aspectRatio: '5 / 6',
    position: 'relative',
  };
  const txt: React.CSSProperties = {
    order: row.reverse ? 1 : 2,
    position: 'relative',
  };
  return (
    <div style={wrap} className="or-editrow">
      <Reveal y={44} style={imgWrap}>
        <ParallaxImg src={photo(row.imgId, 800)} alt={row.alt} />
        {/* Numéral fantôme */}
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: -20,
            right: row.reverse ? 'auto' : -24,
            left: row.reverse ? -24 : 'auto',
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 'clamp(80px,12vw,160px)',
            color: `rgba(196,148,92,0.10)`,
            lineHeight: 1,
            userSelect: 'none',
            zIndex: 0,
          }}
        >
          {row.numeralLabel}
        </span>
      </Reveal>
      <div style={txt}>
        <Reveal>
          <Eyebrow>{row.eyebrow}</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h3
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(28px,4vw,54px)',
              fontWeight: 400,
              color: C.ink,
              margin: 'clamp(16px,2vw,22px) 0 clamp(18px,2vw,26px)',
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
              fontSize: 'clamp(14px,1.3vw,16.5px)',
              lineHeight: 1.84,
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
          .or-editrow { grid-template-columns: 1fr !important; }
          .or-editrow > * { order: initial !important; }
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
          gap: 'clamp(80px,12vw,160px)',
        }}
      >
        {EDIT_ROWS.map((r) => (
          <EditRowItem key={r.eyebrow} row={r} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   PRINCIPLES PANEL — image sticky gauche, principes défilent à droite
   ════════════════════════════════════════════════════════════════════════════ */
function PrinciplesPanel() {
  const sec: React.CSSProperties = {
    background: C.bgDark,
    padding: 'clamp(90px,12vw,160px) clamp(24px,6vw,96px)',
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
    <section style={sec}>
      <div style={grid} className="or-prinpanel">
        {/* Image collante */}
        <div style={stickySide} className="or-prinpanel-sticky">
          <div
            style={{
              overflow: 'hidden',
              border: `1px solid ${C.borderDark}`,
              aspectRatio: '3 / 4',
            }}
          >
            <img
              src={photo('1570295999-41bbf40f8fb5', 900)}
              alt="Ostéopathie crânienne — soin délicat sur le crâne"
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
          <div style={{ marginTop: 24 }}>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 10,
                letterSpacing: '0.30em',
                textTransform: 'uppercase',
                color: C.accent,
                marginBottom: 10,
              }}
            >
              Fondements de l'ostéopathie
            </div>
            <div
              style={{
                fontFamily: SERIF,
                fontStyle: 'italic',
                fontSize: 'clamp(16px,1.6vw,20px)',
                color: 'rgba(255,255,255,0.72)',
                lineHeight: 1.5,
              }}
            >
              « Trouver la santé devrait être l'objectif du médecin. N'importe qui peut trouver la maladie. »
              <span
                style={{
                  display: 'block',
                  fontFamily: SANS,
                  fontStyle: 'normal',
                  fontSize: 10.5,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: C.textFaint,
                  marginTop: 14,
                }}
              >
                Andrew T. Still, fondateur de l'ostéopathie
              </span>
            </div>
          </div>
        </div>

        {/* Principes à droite */}
        <div>
          <Reveal>
            <Eyebrow color={C.accent}>Nos principes</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(32px,4.8vw,62px)',
                fontWeight: 400,
                color: C.white,
                margin: 'clamp(18px,2vw,24px) 0 clamp(36px,5vw,60px)',
                lineHeight: 1.06,
              }}
            >
              Ce en quoi{' '}
              <span style={{ fontStyle: 'italic', color: C.accentLight }}>
                nous croyons
              </span>
            </h2>
          </Reveal>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {PRINCIPLES.map((p, i) => (
              <Reveal key={p.index} delay={0.06 * i}>
                <div
                  style={{
                    padding: 'clamp(28px,3.5vw,44px) 0',
                    borderTop: `1px solid rgba(107,124,90,0.30)`,
                    display: 'flex',
                    gap: 'clamp(20px,3vw,36px)',
                    alignItems: 'baseline',
                  }}
                >
                  <span
                    style={{
                      fontFamily: SERIF,
                      fontStyle: 'italic',
                      fontSize: 'clamp(22px,2.4vw,30px)',
                      color: C.warm,
                      opacity: 0.7,
                      minWidth: 36,
                      flexShrink: 0,
                    }}
                  >
                    {p.index}
                  </span>
                  <div>
                    <h4
                      style={{
                        fontFamily: SERIF,
                        fontSize: 'clamp(18px,1.8vw,23px)',
                        fontWeight: 400,
                        color: C.white,
                        margin: '0 0 10px',
                        lineHeight: 1.2,
                      }}
                    >
                      {p.title}
                    </h4>
                    <p
                      style={{
                        fontFamily: SANS,
                        fontWeight: 300,
                        fontSize: 'clamp(13px,1.2vw,15px)',
                        lineHeight: 1.76,
                        color: 'rgba(255,255,255,0.60)',
                        margin: 0,
                      }}
                    >
                      {p.body}
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
          .or-prinpanel { grid-template-columns: 1fr !important; }
          .or-prinpanel-sticky { position: static !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   TESTIMONIALS — 2 cartes blanches sur bgAlt
   ════════════════════════════════════════════════════════════════════════════ */
function Testimonials() {
  const sec: React.CSSProperties = {
    background: C.bgAlt,
    padding: 'clamp(90px,12vw,168px) clamp(24px,6vw,96px)',
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
      <div style={{ maxWidth: 1180, margin: '0 auto clamp(52px,7vw,80px)', textAlign: 'center' }}>
        <Reveal>
          <Eyebrow color={C.accent} align="center">
            Ils témoignent
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(32px,5vw,64px)',
              fontWeight: 400,
              color: C.ink,
              margin: 'clamp(16px,2vw,22px) 0 0',
              lineHeight: 1.06,
            }}
          >
            La parole des{' '}
            <span style={{ fontStyle: 'italic', color: C.accent }}>patients</span>
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
                boxShadow: '0 20px 56px -36px rgba(26,21,16,0.22)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Leaf size={28} color={C.accent} strokeWidth={1.2} />
              <blockquote
                style={{
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  fontSize: 'clamp(17px,1.8vw,21px)',
                  lineHeight: 1.64,
                  color: C.ink,
                  margin: '22px 0 28px',
                  flex: 1,
                }}
              >
                "{t.quote}"
              </blockquote>
              <figcaption
                style={{ borderTop: `1px solid ${C.border}`, paddingTop: 18 }}
              >
                <div
                  style={{
                    fontFamily: SERIF,
                    fontSize: 18,
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
                    marginTop: 5,
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
   BOOKING FORM — formulaire RDV, fond bgDark, champs underline
   ════════════════════════════════════════════════════════════════════════════ */
function BookingForm() {
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [motif, setMotif] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prenom || !email || !motif) {
      setError('Merci de renseigner votre prénom, email et motif.');
      return;
    }
    setError('');
    setSent(true);
  };

  const sec: React.CSSProperties = {
    background: C.bgDark,
    padding: 'clamp(96px,13vw,180px) clamp(24px,6vw,96px)',
    position: 'relative',
    overflow: 'hidden',
  };

  const fieldStyle: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    background: 'transparent',
    border: 'none',
    borderBottom: `1px solid rgba(107,124,90,0.40)`,
    padding: '15px 2px',
    fontFamily: SERIF,
    fontSize: 18,
    color: C.white,
    outline: 'none',
    transition: 'border-color .3s',
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 10,
    letterSpacing: '0.30em',
    textTransform: 'uppercase' as const,
    color: C.accent,
    display: 'block',
    marginBottom: 4,
  };

  const selectStyle: React.CSSProperties = {
    ...fieldStyle,
    appearance: 'none',
    WebkitAppearance: 'none',
    cursor: 'pointer',
    color: motif ? C.white : 'rgba(255,255,255,0.40)',
  };

  return (
    <section style={sec} id="rdv">
      {/* Filigrane végétal de fond */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '-5%',
          right: '-3%',
          width: 'clamp(200px,30vw,420px)',
          height: 'clamp(300px,45vw,640px)',
          borderRadius: '50% 5% 50% 5%',
          background: 'rgba(107,124,90,0.04)',
          transform: 'rotate(-20deg)',
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
          <Eyebrow color={C.accent} align="center">
            Prise de rendez-vous
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(34px,5.5vw,72px)',
              fontWeight: 400,
              color: C.white,
              margin: 'clamp(18px,2vw,26px) 0 clamp(16px,2vw,22px)',
              lineHeight: 1.04,
            }}
          >
            Réservez votre{' '}
            <span style={{ fontStyle: 'italic', color: C.accentLight }}>
              séance
            </span>
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p
            style={{
              fontFamily: SANS,
              fontWeight: 300,
              fontSize: 'clamp(14px,1.4vw,16.5px)',
              lineHeight: 1.78,
              color: 'rgba(255,255,255,0.66)',
              maxWidth: 520,
              margin: '0 auto clamp(44px,6vw,64px)',
            }}
          >
            Première consultation ou suivi — renseignez le formulaire et nous
            confirmons votre créneau par email sous 24h.
          </p>
        </Reveal>

        {sent ? (
          <Reveal>
            <div
              style={{
                border: `1px solid ${C.accent}`,
                padding: 'clamp(36px,5vw,56px)',
                background: 'rgba(107,124,90,0.06)',
                textAlign: 'center',
              }}
            >
              <Leaf size={32} color={C.accent} strokeWidth={1.3} />
              <h3
                style={{
                  fontFamily: SERIF,
                  fontSize: 'clamp(24px,3vw,34px)',
                  fontWeight: 400,
                  color: C.white,
                  margin: 'clamp(14px,2vw,20px) 0 clamp(12px,1.5vw,16px)',
                }}
              >
                Merci {prenom}, votre demande est envoyée.
              </h3>
              <p
                style={{
                  fontFamily: SANS,
                  fontWeight: 300,
                  fontSize: 'clamp(13px,1.2vw,15.5px)',
                  color: 'rgba(255,255,255,0.66)',
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                Nous confirmons votre rendez-vous par email dans les 24h à{' '}
                <span style={{ color: C.accentLight }}>{email}</span>.
              </p>
            </div>
          </Reveal>
        ) : (
          <Reveal delay={0.24}>
            <form
              onSubmit={onSubmit}
              style={{ display: 'flex', flexDirection: 'column', gap: 36, textAlign: 'left' }}
              noValidate
            >
              {/* Prénom */}
              <div>
                <label style={labelStyle} htmlFor="or-prenom">
                  Prénom *
                </label>
                <input
                  id="or-prenom"
                  style={fieldStyle}
                  type="text"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  placeholder="Marie"
                  autoComplete="given-name"
                />
              </div>

              {/* Email */}
              <div>
                <label style={labelStyle} htmlFor="or-email">
                  Email *
                </label>
                <input
                  id="or-email"
                  style={fieldStyle}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="marie@exemple.fr"
                  autoComplete="email"
                />
              </div>

              {/* Téléphone */}
              <div>
                <label style={labelStyle} htmlFor="or-telephone">
                  Téléphone
                </label>
                <input
                  id="or-telephone"
                  style={fieldStyle}
                  type="tel"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  placeholder="+33 6 12 34 56 78"
                  autoComplete="tel"
                />
              </div>

              {/* Motif */}
              <div>
                <label style={labelStyle} htmlFor="or-motif">
                  Motif de consultation *
                </label>
                <select
                  id="or-motif"
                  style={selectStyle}
                  value={motif}
                  onChange={(e) => setMotif(e.target.value)}
                >
                  <option value="" style={{ color: '#000' }}>
                    Choisir un motif…
                  </option>
                  <option value="Douleurs dorsales" style={{ color: '#000' }}>
                    Douleurs dorsales
                  </option>
                  <option value="Cervicalgie" style={{ color: '#000' }}>
                    Cervicalgie
                  </option>
                  <option value="Douleurs sportives" style={{ color: '#000' }}>
                    Douleurs sportives
                  </option>
                  <option value="Nourrisson" style={{ color: '#000' }}>
                    Nourrisson
                  </option>
                  <option value="Grossesse" style={{ color: '#000' }}>
                    Grossesse
                  </option>
                  <option value="Autre" style={{ color: '#000' }}>
                    Autre
                  </option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label style={labelStyle} htmlFor="or-message">
                  Message (facultatif)
                </label>
                <textarea
                  id="or-message"
                  rows={4}
                  style={{
                    ...fieldStyle,
                    resize: 'vertical',
                    minHeight: 80,
                    lineHeight: 1.6,
                  }}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Précisez votre situation si vous le souhaitez…"
                />
              </div>

              {error && (
                <div
                  style={{
                    fontFamily: SANS,
                    fontSize: 13,
                    color: '#d45c3c',
                    textAlign: 'center',
                    letterSpacing: '0.04em',
                  }}
                >
                  {error}
                </div>
              )}

              <div style={{ textAlign: 'center', marginTop: 4 }}>
                <AccentButton filled type="submit">
                  Envoyer ma demande
                </AccentButton>
              </div>
            </form>
          </Reveal>
        )}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   FOOTER — 4 colonnes sur bgDarkAlt
   ════════════════════════════════════════════════════════════════════════════ */
function Footer() {
  const cols: { title: string; items: { label: string; href: string }[] }[] = [
    {
      title: 'Consultations',
      items: [
        { label: 'Douleurs dorsales', href: '#consultations' },
        { label: 'Cervicalgies', href: '#consultations' },
        { label: 'Suivi sportif', href: '#consultations' },
        { label: 'Nourrissons', href: '#consultations' },
      ],
    },
    {
      title: 'Cabinet',
      items: [
        { label: 'Notre approche', href: '#approche' },
        { label: 'Principes', href: '#apropos' },
        { label: 'Témoignages', href: '#rdv' },
        { label: 'Équipe', href: '#apropos' },
      ],
    },
    {
      title: 'Informations pratiques',
      items: [
        { label: 'Prendre rendez-vous', href: '#rdv' },
        { label: 'Accès & métro', href: '#rdv' },
        { label: 'Tarifs', href: '#rdv' },
        { label: 'Mentions légales', href: '#rdv' },
      ],
    },
  ];

  const foot: React.CSSProperties = {
    background: C.bgDarkAlt,
    borderTop: `1px solid rgba(107,124,90,0.16)`,
    padding: 'clamp(64px,9vw,110px) clamp(24px,6vw,96px) 40px',
  };

  return (
    <footer style={foot}>
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.5fr repeat(3, 1fr)',
          gap: 'clamp(32px,5vw,70px)',
        }}
        className="or-footgrid"
      >
        {/* Colonne marque */}
        <div>
          <a
            href="#haut"
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(18px,1.8vw,24px)',
              letterSpacing: '0.08em',
              color: C.white,
              textDecoration: 'none',
              display: 'block',
            }}
          >
            Ostéo République
          </a>
          <p
            style={{
              fontFamily: SANS,
              fontWeight: 300,
              fontSize: 'clamp(12px,1.1vw,14px)',
              lineHeight: 1.8,
              color: 'rgba(255,255,255,0.50)',
              marginTop: 18,
              maxWidth: 300,
            }}
          >
            Cabinet d'ostéopathie D.O. · Paris 11e.
            <br />
            Adultes, sportifs, nourrissons, femmes enceintes.
          </p>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginTop: 22,
              fontFamily: SANS,
              fontSize: 11,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.44)',
            }}
          >
            <MapPin size={13} color={C.accent} strokeWidth={1.5} />
            Paris 11e · Oberkampf / République
          </div>
        </div>

        {/* Colonnes de liens */}
        {cols.map((c) => (
          <div key={c.title}>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 10,
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
                      fontFamily: SANS,
                      fontWeight: 300,
                      fontSize: 'clamp(12px,1.1vw,14px)',
                      color: 'rgba(255,255,255,0.58)',
                      textDecoration: 'none',
                      transition: 'color .3s',
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLElement).style.color = C.accentLight)
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.58)')
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

      {/* Barre bas de page */}
      <div
        style={{
          maxWidth: 1240,
          margin: 'clamp(48px,6vw,72px) auto 0',
          paddingTop: 26,
          borderTop: `1px solid rgba(107,124,90,0.12)`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 14,
          fontFamily: SANS,
          fontSize: 11,
          letterSpacing: '0.10em',
          color: 'rgba(255,255,255,0.34)',
        }}
      >
        <span>
          © 2024–2026 Ostéo République · Paris 11e. Tous droits réservés.
        </span>
        <span style={{ display: 'flex', gap: 24 }}>
          <a href="#rdv" style={{ color: 'inherit', textDecoration: 'none' }}>
            Mentions légales
          </a>
          <a href="#rdv" style={{ color: 'inherit', textDecoration: 'none' }}>
            Confidentialité
          </a>
        </span>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .or-footgrid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .or-footgrid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   PAGE PRINCIPALE
   ════════════════════════════════════════════════════════════════════════════ */
export default function Page() {
  const root: React.CSSProperties = {
    background: C.bg,
    color: C.ink,
    fontFamily: SANS,
    overflowX: 'hidden',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
  };

  return (
    <main style={root} suppressHydrationWarning>
      {/* Google Fonts */}
      <style>{`
        @import url('${GOOGLE_FONTS_URL}');

        *,
        *::before,
        *::after { box-sizing: border-box; }

        /* iOS zoom prevention */
        input, select, textarea {
          font-size: max(16px, 1em);
        }

        /* Underline inputs focus glow */
        input:focus,
        select:focus,
        textarea:focus {
          border-bottom-color: rgba(107,124,90,0.85) !important;
        }

        /* Placeholder color */
        ::placeholder { color: rgba(255,255,255,0.32); }

        /* Select option background fix */
        option { background: #1a1510; }

        /* Smooth scroll */
        html { scroll-behavior: smooth; }

        /* Mobile responsive globals */
        @media (max-width: 860px) {
          .or-navlinks { display: none !important; }
          .or-navcta   { display: none !important; }
          .or-editrow  { grid-template-columns: 1fr !important; }
          .or-editrow > * { order: initial !important; }
          .or-prinpanel { grid-template-columns: 1fr !important; }
          .or-prinpanel-sticky { position: static !important; }
          .or-footgrid  { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .or-footgrid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <Nav />
      <Hero />
      <Intro />
      <ApproachSequence />
      <SpecialtyCards />
      <EditorialRows />
      <PrinciplesPanel />
      <Testimonials />
      <BookingForm />
      <Footer />
    </main>
  );
}
