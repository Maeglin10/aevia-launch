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
import {
  ArrowRight,
  ChevronDown,
  Star,
  Check,
  Phone,
  MapPin,
  Clock,
  Shield,
} from 'lucide-react';

/* ════════════════════════════════════════════════════════════════════════════
   CABINET DENTAIRE ROSENFELD — Dentisterie & Implantologie · Strasbourg
   Premium editorial template · 'use client' · auto-suffisant.
   ════════════════════════════════════════════════════════════════════════════ */

/* ── Google Fonts ──────────────────────────────────────────────────────────── */
const FONTS = `https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap`;

/* ── Palette ─────────────────────────────────────────────────────────────── */
const C = {
  bg: '#f6f8fa',
  bgAlt: '#eaf0f6',
  bgDark: '#060c18',
  bgDarkAlt: '#030810',
  bgCard: '#ffffff',
  accent: '#2460a8',
  accentDark: '#1a4880',
  accentLight: '#c8d8f0',
  white: '#ffffff',
  ink: '#060c18',
  textMuted: '#1a3050',
  textFaint: '#7090b0',
  border: '#b8cce0',
  borderDark: 'rgba(36,96,168,0.2)',
  silver: '#c8a84c',
} as const;

const SERIF = "'Libre Baskerville', Georgia, serif" as const;
const SANS = "'Inter', system-ui, sans-serif" as const;

/* ── Easing partagé ──────────────────────────────────────────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ── Interfaces TypeScript ───────────────────────────────────────────────── */
interface Treatment {
  id: string;
  src: string;
  numeral: string;
  title: string;
  body: string;
}

interface Care {
  icon: string;
  title: string;
  desc: string;
}

interface EditRow {
  eyebrow: string;
  imgId: string;
  title: React.ReactNode;
  body: string;
  reverse: boolean;
  numeral: string;
}

interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

interface TechItem {
  num: string;
  name: string;
  desc: string;
}

/* ── Data ───────────────────────────────────────────────────────────────── */
const PHASES: Treatment[] = [
  {
    id: 'preventif',
    src: 'https://images.unsplash.com/photo-1598300402640-cf52ea77e6da?q=80&w=1600&auto=format&fit=crop',
    numeral: 'I',
    title: 'SOINS PRÉVENTIFS',
    body: 'Détartrage ultrason, scellement de sillons, fluoration professionnelle — prévenir pour ne pas avoir à soigner.',
  },
  {
    id: 'esthetique',
    src: 'https://images.unsplash.com/photo-1606811671440-28c0f2b8b3c4?q=80&w=1600&auto=format&fit=crop',
    numeral: 'II',
    title: 'DENTISTERIE ESTHÉTIQUE',
    body: 'Blanchiment Phillips Zoom, facettes composites directes, couronne céramique — le sourire qui correspond à votre visage.',
  },
  {
    id: 'implantologie',
    src: 'https://images.unsplash.com/photo-1588776814546-daab0f1cdc02?q=80&w=1600&auto=format&fit=crop',
    numeral: 'III',
    title: 'IMPLANTOLOGIE',
    body: 'Implants Nobel Biocare, all-on-4, bridge implanto-porté — retrouver une dentition complète sans compromis.',
  },
];

const CARE_CARDS: Care[] = [
  {
    icon: '🦷',
    title: 'Soins conservateurs',
    desc: 'Obturations composites, inlays/onlays, traitement de carie à tous les stades.',
  },
  {
    icon: '✨',
    title: 'Détartrage & hygiène',
    desc: 'Nettoyage professionnel ultrasonique, conseils personnalisés en hygiène bucco-dentaire.',
  },
  {
    icon: '⚡',
    title: 'Blanchiment',
    desc: 'Blanchiment Phillips Zoom en cabinet ou gouttières sur-mesure pour un résultat durable.',
  },
  {
    icon: '💎',
    title: 'Facettes & esthétique',
    desc: 'Facettes composites ou céramiques, couronne tout-céramique, remodelage du sourire.',
  },
  {
    icon: '🔩',
    title: 'Implants',
    desc: 'Implants Nobel Biocare, all-on-4, bridge implanto-porté. Planification 3D systématique.',
  },
  {
    icon: '🌀',
    title: 'Orthodontie invisible',
    desc: 'Aligneurs transparents Invisalign pour adultes et adolescents. Résultat discret, efficacité prouvée.',
  },
];

const EDIT_ROWS: EditRow[] = [
  {
    eyebrow: 'Notre engagement',
    imgId: '1598300402640-cf52ea77e6da?w=800',
    numeral: '01',
    title: (
      <>
        Le sourire{' '}
        <span style={{ fontStyle: 'italic' }}>sans angoisse.</span>
      </>
    ),
    body: 'Cabinet certifié pour la prise en charge des patients anxieux. Sédation MEOPA disponible sur simple demande. Nos rendez-vous de 45 minutes ne sont jamais bousculés — chaque patient est accompagné, pas traité.',
    reverse: false,
  },
  {
    eyebrow: 'Strasbourg-Centre',
    imgId: '1606811671440-28c0f2b8b3c4?w=800',
    numeral: '02',
    title: (
      <>
        Place Kléber{' '}
        <span style={{ fontStyle: 'italic' }}>accessible.</span>
      </>
    ),
    body: 'À 3 minutes des lignes de tram A & D, accès PMR, parking Place Kléber. Prise de rendez-vous en ligne 24h/24. Créneaux urgence disponibles le jour même sur appel.',
    reverse: true,
  },
];

const TECH_ITEMS: TechItem[] = [
  {
    num: '01',
    name: 'Scanner 3D Cone Beam',
    desc: 'Planification implant millimétrique, sans surprise. Acquisition en 14 secondes, dose réduite.',
  },
  {
    num: '02',
    name: 'Empreintes numériques iTero',
    desc: "Adieu l'alginate, précision supérieure. Visualisation immédiate du résultat prévisible.",
  },
  {
    num: '03',
    name: 'Laser Er:YAG',
    desc: 'Soins des gencives indolores, guérison accélérée. Zéro bistouri, zéro suture dans la plupart des cas.',
  },
  {
    num: '04',
    name: 'Blanchiment Phillips Zoom',
    desc: "6 à 8 teintes en une séance d'1h30. Protocole de désensibilisation intégré.",
  },
];

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "J'avais une phobie du dentiste depuis 15 ans. Le protocole MEOPA du Dr Rosenfeld a tout changé. Je viens maintenant tous les 6 mois sans appréhension. Une équipe qui écoute vraiment.",
    name: 'Nathalie B.',
    role: 'Patiente · Strasbourg',
  },
  {
    quote:
      "Après une perte dentaire, j'ai opté pour l'all-on-4 au cabinet Rosenfeld. Le scanner 3D m'a montré le résultat avant même l'intervention. Je mange et souris normalement à nouveau.",
    name: 'Michel V.',
    role: 'Patient · Schiltigheim',
  },
];

/* ════════════════════════════════════════════════════════════════════════════
   Primitives partagées
   ════════════════════════════════════════════════════════════════════════════ */

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
    width: 40,
    height: 1,
    background: color,
    opacity: 0.65,
    flexShrink: 0,
  };
  const lbl: React.CSSProperties = {
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
      <span style={lbl}>{children}</span>
      {align === 'center' && <span style={rule} />}
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

function BlueButton({
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
    fontWeight: 500,
    cursor: 'pointer',
    border: `1px solid ${C.accent}`,
    background: filled ? C.accent : 'transparent',
    color: filled ? C.white : C.accent,
    transition: 'all .5s cubic-bezier(.16,1,.3,1)',
  };
  const hov: React.CSSProperties = hover
    ? filled
      ? { background: C.accentDark, borderColor: C.accentDark, transform: 'translateY(-2px)' }
      : { background: 'rgba(36,96,168,0.08)', transform: 'translateY(-2px)' }
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
  const [mobileOpen, setMobileOpen] = useState(false);
  React.useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: 'Soins', href: '#soins' },
    { label: 'Approche', href: '#approche' },
    { label: 'Technologies', href: '#technologie' },
    { label: 'Témoignages', href: '#temoignages' },
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
    background: solid ? 'rgba(6,12,24,0.96)' : 'transparent',
    backdropFilter: solid ? 'blur(16px) saturate(140%)' : 'none',
    WebkitBackdropFilter: solid ? 'blur(16px) saturate(140%)' : 'none',
    borderBottom: solid
      ? `1px solid rgba(36,96,168,0.22)`
      : '1px solid transparent',
    transition: 'all .6s cubic-bezier(.16,1,.3,1)',
  };

  const brand: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 17,
    fontWeight: 600,
    letterSpacing: '0.05em',
    color: C.white,
    textDecoration: 'none',
  };

  const linkRow: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'clamp(18px,2.2vw,36px)',
  };

  return (
    <>
      <nav style={bar} suppressHydrationWarning>
      
        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="cr-burger"
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
          .cr-navlinks { display: none !important; }
          .cr-burger { display: flex !important; flex-direction: column; }
          .cr-navcta { display: none !important; }
        }
      `}</style>
      <a href="/templates/impact-273" style={brand}>
        Cabinet Rosenfeld
      </a>
      <div style={linkRow} className="cr-navlinks">
        {links.map((l) => (
          <NavLink key={l.label} label={l.label} href={l.href} />
        ))}
      </div>
      <div className="cr-navcta">
        <a href="#contact" style={{ textDecoration: 'none' }}>
          <BlueButton filled>Prendre RDV</BlueButton>
        </a>
      </div>
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
        fontWeight: 500,
        color: h ? C.accentLight : 'rgba(255,255,255,0.82)',
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
   2 · Hero
   ════════════════════════════════════════════════════════════════════════════ */
function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '14%']);
  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '-42%']);
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
          src="https://images.unsplash.com/photo-1598300402640-cf52ea77e6da?q=80&w=2000&auto=format&fit=crop"
          alt="Cabinet dentaire Rosenfeld Strasbourg"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </motion.div>

      {/* Voiles */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(6,12,24,0.55) 0%, rgba(6,12,24,0.12) 40%, rgba(6,12,24,0.50) 72%, rgba(6,12,24,0.90) 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(120% 80% at 50% 30%, transparent 36%, rgba(6,12,24,0.50) 100%)',
          mixBlendMode: 'multiply',
        }}
      />

      {/* Titre */}
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
          padding: '0 clamp(20px,6vw,96px)',
          y: titleY,
          opacity: titleOpacity,
        }}
      >
        <Reveal y={20}>
          <Eyebrow color={C.accentLight} align="center">
            Dentisterie &amp; Implantologie · Strasbourg
          </Eyebrow>
        </Reveal>

        <motion.h1
          initial={{ opacity: 0, y: 44 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: EASE, delay: 0.18 }}
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontWeight: 400,
            color: C.white,
            fontSize: 'clamp(3rem,6.5vw,7.5rem)',
            lineHeight: 0.97,
            letterSpacing: '-0.01em',
            margin: '28px 0 24px',
            textShadow: '0 12px 60px rgba(0,0,0,0.45)',
          }}
        >
          Le sourire{' '}
          <br />
          que vous méritez.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.46 }}
          style={{
            fontFamily: SANS,
            fontWeight: 300,
            fontSize: 'clamp(16px,1.8vw,20px)',
            color: 'rgba(255,255,255,0.82)',
            maxWidth: 540,
            lineHeight: 1.65,
          }}
        >
          Soins préventifs, esthétiques et implantologie avancée au cœur
          de Strasbourg. Protocole anti-douleur. Patients anxieux bienvenus.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.72 }}
          style={{ marginTop: 44, display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <a href="#contact" style={{ textDecoration: 'none' }}>
            <BlueButton filled>Prendre rendez-vous</BlueButton>
          </a>
          <a href="#soins" style={{ textDecoration: 'none' }}>
            <BlueButton>Découvrir nos soins</BlueButton>
          </a>
        </motion.div>
      </motion.div>

      {/* Cue défilement */}
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
            color: 'rgba(255,255,255,0.60)',
          }}
        >
          Explorer
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
   3 · Intro
   ════════════════════════════════════════════════════════════════════════════ */
function Intro() {
  const sec: React.CSSProperties = {
    background: C.bgAlt,
    padding: 'clamp(88px,13vw,190px) clamp(24px,8vw,160px)',
    textAlign: 'center',
  };
  return (
    <section style={sec} id="approche">
      <Reveal>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 36 }}>
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
            fontSize: 'clamp(24px,3.4vw,48px)',
            lineHeight: 1.36,
            fontWeight: 400,
            maxWidth: 960,
            margin: '0 auto',
            color: C.ink,
          }}
        >
          "La peur du dentiste, c&rsquo;est souvent la peur de l&rsquo;inconnu.
          Nous vous expliquons tout avant de commencer."
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
   4 · TreatmentSequence — 320vh crossfade collant
   ════════════════════════════════════════════════════════════════════════════ */
function PhaseImage({
  phase,
  i,
  total,
  progress,
}: {
  phase: Treatment;
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
    i === 0 ? [1, 1, 1, 0] : i === total - 1 ? [0, 1, 1, 1] : [0, 1, 1, 0],
  );
  const scale = useTransform(progress, [start - fadeLen, end], [1.1, 1.0]);

  return (
    <motion.div style={{ position: 'absolute', inset: 0, opacity }}>
      <motion.img
        src={phase.src}
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

function PhaseLabel({
  phase,
  i,
  total,
  progress,
}: {
  phase: Treatment;
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
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '0 clamp(20px,6vw,96px)',
        opacity,
        y,
      }}
    >
      {/* Numeral décor */}
      <span
        style={{
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontSize: 'clamp(52px,11vw,140px)',
          color: 'rgba(36,96,168,0.28)',
          lineHeight: 1,
          marginBottom: 4,
        }}
      >
        {phase.numeral}
      </span>

      {/* Étiquette top-right */}
      <div
        style={{
          position: 'absolute',
          top: 'clamp(100px,16vw,160px)',
          right: 'clamp(24px,5vw,72px)',
          textAlign: 'right',
        }}
      >
        <span
          style={{
            fontFamily: SANS,
            fontSize: 10,
            letterSpacing: '0.38em',
            textTransform: 'uppercase',
            color: C.accentLight,
            fontWeight: 500,
          }}
        >
          {phase.title}
        </span>
      </div>

      <h2
        style={{
          fontFamily: SERIF,
          fontSize: 'clamp(28px,5vw,72px)',
          fontWeight: 400,
          color: C.white,
          lineHeight: 1.04,
          margin: '0 0 18px',
          textShadow: '0 8px 40px rgba(0,0,0,0.60)',
          maxWidth: 780,
        }}
      >
        {phase.title}
      </h2>
      <p
        style={{
          fontFamily: SANS,
          fontWeight: 300,
          fontSize: 'clamp(15px,1.6vw,19px)',
          color: 'rgba(255,255,255,0.82)',
          maxWidth: 520,
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
    [0.3, 1, 1, 0.3],
  );
  const width = useTransform(progress, [i * seg, (i + 1) * seg], [10, 36]);
  return (
    <motion.div
      style={{ height: 2, width, background: C.accent, opacity, borderRadius: 2 }}
    />
  );
}

function TreatmentSequence() {
  const n = PHASES.length;
  const progress = useMotionValue(0.5 / n);
  const [active, setActive] = useState(0);
  const goTo = (i: number) => {
    setActive(i);
    progress.set((i + 0.5) / n);
  };

  return (
    <section
      style={{ height: '100vh', overflow: 'hidden', position: 'relative', background: C.bgDark }}
      id="soins"
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
            key={p.id}
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
              'linear-gradient(to bottom, rgba(6,12,24,0.38), rgba(6,12,24,0.08) 40%, rgba(6,12,24,0.60))',
          }}
        />

        {PHASES.map((p, i) => (
          <PhaseLabel
            key={p.id}
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
            bottom: 42,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 12,
          }}
        >
          {PHASES.map((p, i) => (
            <ProgressDot
              key={p.id}
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
   5 · CareCards
   ════════════════════════════════════════════════════════════════════════════ */
function CareCard({ care, i }: { care: Care; i: number }) {
  const [hover, setHover] = useState(false);
  const card: React.CSSProperties = {
    background: C.bgCard,
    borderLeft: `3px solid ${hover ? C.accent : C.accentLight}`,
    padding: 'clamp(28px,3.5vw,40px)',
    transform: hover ? 'translateY(-8px)' : 'none',
    boxShadow: hover
      ? '0 32px 64px -28px rgba(36,96,168,0.20)'
      : '0 4px 24px -16px rgba(36,96,168,0.10)',
    transition: 'all .55s cubic-bezier(.16,1,.3,1)',
    cursor: 'default',
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  };
  return (
    <Reveal delay={i * 0.08} style={{ height: '100%' }}>
      <article
        style={card}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <span style={{ fontSize: 28 }}>{care.icon}</span>
        <h3
          style={{
            fontFamily: SERIF,
            fontSize: 'clamp(18px,1.8vw,22px)',
            fontWeight: 700,
            color: C.ink,
            margin: 0,
          }}
        >
          {care.title}
        </h3>
        <p
          style={{
            fontFamily: SANS,
            fontWeight: 300,
            fontSize: 'clamp(14px,1.3vw,16px)',
            lineHeight: 1.7,
            color: C.textMuted,
            margin: 0,
          }}
        >
          {care.desc}
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
            fontWeight: 500,
            color: hover ? C.accentDark : C.accent,
            transition: 'color .35s',
            marginTop: 'auto',
            paddingTop: 8,
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

function CareCards() {
  const sec: React.CSSProperties = {
    background: C.bg,
    padding: 'clamp(88px,12vw,170px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 'clamp(20px,2.6vw,36px)',
    maxWidth: 1280,
    margin: '0 auto',
  };
  return (
    <section style={sec}>
      <div style={{ maxWidth: 1280, margin: '0 auto 60px' }}>
        <Reveal>
          <Eyebrow>Nos prestations</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(34px,5vw,68px)',
              fontWeight: 400,
              color: C.ink,
              margin: '20px 0 0',
              lineHeight: 1.06,
            }}
          >
            Un cabinet{' '}
            <span style={{ fontStyle: 'italic', color: C.accent }}>complet</span>
          </h2>
        </Reveal>
      </div>
      <div style={grid}>
        {CARE_CARDS.map((c, i) => (
          <CareCard key={c.title} care={c} i={i} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   6 · EditorialRows
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

function EditRow({ row }: { row: EditRow }) {
  const imgWrap: React.CSSProperties = {
    overflow: 'hidden',
    order: row.reverse ? 2 : 1,
    aspectRatio: '5 / 6',
    position: 'relative',
  };
  const txtWrap: React.CSSProperties = { order: row.reverse ? 1 : 2 };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'clamp(36px,6vw,90px)',
        alignItems: 'center',
      }}
      className="cr-editrow"
    >
      {/* Numéral fantôme */}
      <span
        style={{
          position: 'absolute',
          top: '-0.1em',
          left: row.reverse ? 'auto' : '-0.08em',
          right: row.reverse ? '-0.08em' : 'auto',
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontSize: 'clamp(80px,16vw,220px)',
          color: C.ink,
          opacity: 0.06,
          lineHeight: 1,
          pointerEvents: 'none',
          userSelect: 'none',
          zIndex: 0,
        }}
      >
        {row.numeral}
      </span>

      <Reveal y={50} style={imgWrap}>
        <ParallaxImg
          src={`https://images.unsplash.com/photo-${row.imgId}&auto=format&fit=crop`}
          alt={`Cabinet Rosenfeld — ${row.eyebrow}`}
        />
      </Reveal>

      <div style={{ ...txtWrap, position: 'relative', zIndex: 1 }}>
        <Reveal>
          <Eyebrow>{row.eyebrow}</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h3
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(28px,4vw,56px)',
              fontWeight: 400,
              color: C.ink,
              margin: '20px 0 22px',
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
              lineHeight: 1.82,
              color: C.textMuted,
              maxWidth: 460,
            }}
          >
            {row.body}
          </p>
        </Reveal>
        <Reveal delay={0.24}>
          <a href="#contact" style={{ textDecoration: 'none', display: 'inline-block', marginTop: 28 }}>
            <BlueButton>Prendre rendez-vous</BlueButton>
          </a>
        </Reveal>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .cr-editrow { grid-template-columns: 1fr !important; }
          .cr-editrow > * { order: initial !important; }
        }
      `}</style>
    </div>
  );
}

function EditorialRows() {
  const sec: React.CSSProperties = {
    background: C.bg,
    padding: 'clamp(72px,10vw,150px) clamp(24px,6vw,96px)',
    position: 'relative',
    overflow: 'hidden',
  };
  return (
    <section style={sec} id="engagement">
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(80px,11vw,150px)',
          position: 'relative',
        }}
      >
        {EDIT_ROWS.map((r) => (
          <EditRow key={r.eyebrow} row={r} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   7 · TechPanel — image collante gauche + 4 technologies droite
   ════════════════════════════════════════════════════════════════════════════ */
function TechPanel() {
  const sec: React.CSSProperties = {
    background: C.bgDark,
    padding: 'clamp(88px,12vw,170px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '0.95fr 1.05fr',
    gap: 'clamp(40px,6vw,100px)',
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
    <section style={sec} id="technologie">
      <div style={grid} className="cr-techpanel">
        {/* Image collante */}
        <div style={stickyImg} className="cr-techpanel-sticky">
          <div
            style={{
              overflow: 'hidden',
              border: `1px solid rgba(36,96,168,0.30)`,
              aspectRatio: '4 / 5',
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1588776814546-daab0f1cdc02?q=80&w=900&auto=format&fit=crop"
              alt="Technologies de pointe Cabinet Rosenfeld"
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
          <div style={{ marginTop: 22 }}>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 10.5,
                letterSpacing: '0.26em',
                textTransform: 'uppercase',
                color: C.accent,
                marginBottom: 8,
              }}
            >
              Équipements de dernière génération
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
              "Investir dans la technologie, c'est réduire votre inconfort."
            </div>
          </div>
        </div>

        {/* Technologies qui défilent */}
        <div>
          <Reveal>
            <Eyebrow color={C.accentLight}>Nos technologies</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(32px,4.5vw,60px)',
                fontWeight: 400,
                color: C.white,
                margin: '22px 0 52px',
                lineHeight: 1.06,
              }}
            >
              L&rsquo;innovation{' '}
              <span style={{ fontStyle: 'italic', color: C.accentLight }}>
                au service de votre confort
              </span>
            </h2>
          </Reveal>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {TECH_ITEMS.map((item, i) => (
              <Reveal key={item.num} delay={0.06 * i}>
                <div
                  style={{
                    padding: 'clamp(28px,3.5vw,40px) 0',
                    borderTop: `1px solid rgba(36,96,168,0.30)`,
                    display: 'flex',
                    gap: 28,
                    alignItems: 'baseline',
                  }}
                >
                  <span
                    style={{
                      fontFamily: SANS,
                      fontSize: 12,
                      fontWeight: 600,
                      letterSpacing: '0.12em',
                      color: C.silver,
                      minWidth: 36,
                      flexShrink: 0,
                    }}
                  >
                    {item.num}
                  </span>
                  <div>
                    <h4
                      style={{
                        fontFamily: SERIF,
                        fontSize: 'clamp(20px,2.2vw,26px)',
                        fontWeight: 700,
                        color: C.white,
                        margin: '0 0 10px',
                      }}
                    >
                      {item.name}
                    </h4>
                    <p
                      style={{
                        fontFamily: SANS,
                        fontWeight: 300,
                        fontSize: 'clamp(14px,1.4vw,16px)',
                        lineHeight: 1.72,
                        color: 'rgba(255,255,255,0.62)',
                        margin: 0,
                      }}
                    >
                      {item.desc}
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
          .cr-techpanel { grid-template-columns: 1fr !important; }
          .cr-techpanel-sticky { position: static !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   8 · Testimonials
   ════════════════════════════════════════════════════════════════════════════ */
function Testimonials() {
  const sec: React.CSSProperties = {
    background: C.bgAlt,
    padding: 'clamp(88px,12vw,170px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: 'clamp(28px,3.8vw,56px)',
    maxWidth: 1180,
    margin: '0 auto',
  };
  return (
    <section style={sec} id="temoignages">
      <div style={{ maxWidth: 1180, margin: '0 auto 60px', textAlign: 'center' }}>
        <Reveal>
          <Eyebrow color={C.textMuted} align="center">
            Ils nous font confiance
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
            La parole de{' '}
            <span style={{ fontStyle: 'italic', color: C.accent }}>nos patients</span>
          </h2>
        </Reveal>
      </div>
      <div style={grid}>
        {TESTIMONIALS.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.14} style={{ height: '100%' }}>
            <figure
              style={{
                background: C.bgCard,
                border: `1px solid ${C.border}`,
                padding: 'clamp(32px,4vw,48px)',
                margin: 0,
                height: '100%',
                boxSizing: 'border-box',
                boxShadow: '0 20px 50px -36px rgba(36,96,168,0.22)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Étoiles */}
              <div style={{ display: 'flex', gap: 4, marginBottom: 22 }}>
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} size={14} fill={C.silver} color={C.silver} strokeWidth={0} />
                ))}
              </div>

              <blockquote
                style={{
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  fontSize: 'clamp(17px,1.8vw,21px)',
                  lineHeight: 1.64,
                  color: C.ink,
                  margin: '0 0 28px',
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
                    fontWeight: 700,
                    color: C.textMuted,
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
   9 · AppointmentForm
   ════════════════════════════════════════════════════════════════════════════ */
function AppointmentForm() {
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [motif, setMotif] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prenom || !email || !motif) return;
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
    boxSizing: 'border-box' as const,
    background: 'transparent',
    border: 'none',
    borderBottom: `1px solid rgba(36,96,168,0.45)`,
    padding: '15px 2px',
    fontFamily: SANS,
    fontWeight: 300,
    fontSize: 16,
    color: C.white,
    outline: 'none',
    transition: 'border-color .35s',
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 10.5,
    letterSpacing: '0.26em',
    textTransform: 'uppercase',
    color: C.accent,
    fontWeight: 500,
    display: 'block',
    marginBottom: 4,
  };

  return (
    <section style={sec} id="contact">
      {/* Fond photo fantôme */}
      <img
        src="https://images.unsplash.com/photo-1598300402640-cf52ea77e6da?q=80&w=1600&auto=format&fit=crop"
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
              fontSize: 'clamp(34px,5.5vw,74px)',
              fontWeight: 400,
              color: C.white,
              margin: '22px 0 18px',
              lineHeight: 1.06,
            }}
          >
            Prenons{' '}
            <span style={{ fontStyle: 'italic', color: C.accentLight }}>
              soin de vous
            </span>
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p
            style={{
              fontFamily: SANS,
              fontWeight: 300,
              fontSize: 'clamp(15px,1.6vw,18px)',
              lineHeight: 1.72,
              color: 'rgba(255,255,255,0.72)',
              maxWidth: 500,
              margin: '0 auto 52px',
            }}
          >
            Remplissez ce formulaire, nous vous confirmons votre
            rendez-vous sous 24h. Urgences : appelez directement le
            +33 3 88 XX XX XX.
          </p>
        </Reveal>

        {sent ? (
          <Reveal>
            <div
              style={{
                border: `1px solid ${C.accent}`,
                padding: 'clamp(36px,5vw,56px)',
                background: 'rgba(36,96,168,0.08)',
              }}
            >
              <div style={{ marginBottom: 18 }}>
                <Check size={38} color={C.accentLight} strokeWidth={1.5} />
              </div>
              <h3
                style={{
                  fontFamily: SERIF,
                  fontSize: 30,
                  fontWeight: 400,
                  color: C.white,
                  margin: '0 0 12px',
                }}
              >
                Merci {prenom}&nbsp;!
              </h3>
              <p
                style={{
                  fontFamily: SANS,
                  fontWeight: 300,
                  fontSize: 17,
                  color: 'rgba(255,255,255,0.72)',
                  margin: 0,
                  lineHeight: 1.65,
                }}
              >
                Nous vous confirmons votre RDV sous 24h à{' '}
                <strong style={{ color: C.accentLight, fontWeight: 500 }}>
                  {email}
                </strong>
                . À très bientôt au cabinet.
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
                <label style={labelStyle} htmlFor="cr-prenom">
                  Prénom
                </label>
                <input
                  id="cr-prenom"
                  style={fieldBase}
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  placeholder="Marie"
                  autoComplete="given-name"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label style={labelStyle} htmlFor="cr-email">
                  Email
                </label>
                <input
                  id="cr-email"
                  type="email"
                  style={fieldBase}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="marie@exemple.fr"
                  autoComplete="email"
                  required
                />
              </div>

              {/* Téléphone */}
              <div>
                <label style={labelStyle} htmlFor="cr-tel">
                  Téléphone
                </label>
                <input
                  id="cr-tel"
                  type="tel"
                  style={fieldBase}
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  placeholder="+33 6 XX XX XX XX"
                  autoComplete="tel"
                />
              </div>

              {/* Motif */}
              <div>
                <label style={labelStyle} htmlFor="cr-motif">
                  Motif de consultation
                </label>
                <select
                  id="cr-motif"
                  style={{
                    ...fieldBase,
                    appearance: 'none' as const,
                    WebkitAppearance: 'none' as const,
                    cursor: 'pointer',
                    color: motif ? C.white : 'rgba(255,255,255,0.38)',
                  }}
                  value={motif}
                  onChange={(e) => setMotif(e.target.value)}
                  required
                >
                  <option value="" style={{ color: '#111' }}>
                    Choisir un motif…
                  </option>
                  <option value="Bilan annuel" style={{ color: '#111' }}>
                    Bilan annuel
                  </option>
                  <option value="Détartrage" style={{ color: '#111' }}>
                    Détartrage
                  </option>
                  <option value="Urgence" style={{ color: '#111' }}>
                    Urgence
                  </option>
                  <option value="Blanchiment" style={{ color: '#111' }}>
                    Blanchiment
                  </option>
                  <option value="Implant" style={{ color: '#111' }}>
                    Implant
                  </option>
                  <option value="Orthodontie" style={{ color: '#111' }}>
                    Orthodontie
                  </option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label style={labelStyle} htmlFor="cr-message">
                  Message (optionnel)
                </label>
                <textarea
                  id="cr-message"
                  style={{
                    ...fieldBase,
                    resize: 'vertical' as const,
                    minHeight: 90,
                    paddingTop: 12,
                  }}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Précisions, antécédents ou questions…"
                />
              </div>

              <div style={{ textAlign: 'center', marginTop: 8 }}>
                <BlueButton filled type="submit">
                  Envoyer ma demande
                </BlueButton>
              </div>
            </form>
          </Reveal>
        )}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   10 · Footer
   ════════════════════════════════════════════════════════════════════════════ */
function Footer() {
  const cols: { title: string; items: { label: string; href: string }[] }[] = [
    {
      title: 'Soins',
      items: [
        { label: 'Soins conservateurs', href: '#soins' },
        { label: 'Détartrage', href: '#soins' },
        { label: 'Blanchiment', href: '#soins' },
        { label: 'Implants', href: '#soins' },
        { label: 'Orthodontie', href: '#soins' },
      ],
    },
    {
      title: 'Cabinet',
      items: [
        { label: 'Notre approche', href: '#approche' },
        { label: 'Technologies', href: '#technologie' },
        { label: 'Témoignages', href: '#temoignages' },
        { label: 'Prendre RDV', href: '#contact' },
      ],
    },
    {
      title: 'Informations',
      items: [
        { label: 'Mentions légales', href: "/templates/impact-273" },
        { label: 'Confidentialité', href: "/templates/impact-273" },
        { label: 'Accessibilité', href: "/templates/impact-273" },
        { label: 'Plan du cabinet', href: '#contact' },
      ],
    },
  ];

  const foot: React.CSSProperties = {
    background: C.bgDarkAlt,
    borderTop: `1px solid rgba(36,96,168,0.20)`,
    padding: 'clamp(64px,9vw,110px) clamp(24px,6vw,96px) 40px',
  };

  return (
    <footer style={foot}>
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.5fr repeat(3, 1fr)',
          gap: 'clamp(36px,5vw,72px)',
        }}
        className="cr-footgrid"
      >
        {/* Brand */}
        <div>
          <div
            style={{
              fontFamily: SANS,
              fontSize: 20,
              fontWeight: 600,
              letterSpacing: '0.06em',
              color: C.white,
              marginBottom: 20,
            }}
          >
            Cabinet Rosenfeld
          </div>
          <p
            style={{
              fontFamily: SANS,
              fontWeight: 300,
              fontSize: 15,
              lineHeight: 1.7,
              color: 'rgba(255,255,255,0.55)',
              marginTop: 0,
              marginBottom: 24,
              maxWidth: 320,
            }}
          >
            Dentisterie &amp; Implantologie au cœur de Strasbourg. Patients
            anxieux bienvenus. Équipements de dernière génération.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                fontFamily: SANS,
                fontSize: 13,
                fontWeight: 300,
                color: 'rgba(255,255,255,0.55)',
              }}
            >
              <MapPin size={14} color={C.accent} strokeWidth={1.5} />
              2 Place Kléber, 67000 Strasbourg
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                fontFamily: SANS,
                fontSize: 13,
                fontWeight: 300,
                color: 'rgba(255,255,255,0.55)',
              }}
            >
              <Phone size={14} color={C.accent} strokeWidth={1.5} />
              +33 3 88 XX XX XX
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                fontFamily: SANS,
                fontSize: 13,
                fontWeight: 300,
                color: 'rgba(255,255,255,0.55)',
              }}
            >
              <Clock size={14} color={C.accent} strokeWidth={1.5} />
              Lun–Ven 8h30–19h · Sam 9h–13h
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                fontFamily: SANS,
                fontSize: 13,
                fontWeight: 300,
                color: 'rgba(255,255,255,0.55)',
              }}
            >
              <Shield size={14} color={C.accent} strokeWidth={1.5} />
              Secteur 2 · Carte Vitale acceptée
            </div>
          </div>
        </div>

        {/* Colonnes liens */}
        {cols.map((c) => (
          <div key={c.title}>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 10.5,
                letterSpacing: '0.26em',
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
                gap: 13,
              }}
            >
              {c.items.map((it) => (
                <li key={it.label}>
                  <a
                    href={it.href}
                    style={{
                      fontFamily: SANS,
                      fontWeight: 300,
                      fontSize: 15,
                      color: 'rgba(255,255,255,0.62)',
                      textDecoration: 'none',
                      transition: 'color .3s',
                    }}
                    onMouseEnter={(e) =>
                      ((e.target as HTMLElement).style.color = C.white)
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
          paddingTop: 26,
          borderTop: `1px solid rgba(36,96,168,0.15)`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 14,
          fontFamily: SANS,
          fontWeight: 300,
          fontSize: 11,
          letterSpacing: '0.08em',
          color: 'rgba(255,255,255,0.38)',
        }}
      >
        <span>
          © 2026 Cabinet Dentaire Rosenfeld · Strasbourg. Tous droits réservés.
        </span>
        <span style={{ display: 'flex', gap: 22 }}>
          <a href="/templates/impact-273" style={{ color: 'inherit', textDecoration: 'none' }}>
            Mentions légales
          </a>
          <a href="/templates/impact-273" style={{ color: 'inherit', textDecoration: 'none' }}>
            Confidentialité
          </a>
        </span>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .cr-footgrid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 540px) {
          .cr-footgrid { grid-template-columns: 1fr !important; }
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
    fontFamily: SANS,
    overflowX: 'hidden',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
  };

  return (
    <main style={root} suppressHydrationWarning>
      {/* Google Fonts */}
      <style>{`@import url('${FONTS}');`}</style>

      <Nav />
      <Hero />
      <Intro />
      <TreatmentSequence />
      <CareCards />
      <EditorialRows />
      <TechPanel />
      <Testimonials />
      <AppointmentForm />
      <Footer />
    </main>
  );
}
