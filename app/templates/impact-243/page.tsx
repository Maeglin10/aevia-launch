// @ts-nocheck
'use client';

import React, {useRef, useState, useEffect} from 'react';
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
  Heart,
  MapPin,
  Quote,
  Phone,
  Mail,
} from 'lucide-react';

/* ════════════════════════════════════════════════════════════════════════════
   DR. ÉLODIE BEAUMONT — Cabinet médecine générale & préventive · Strasbourg
   Chorégraphie de défilement éditoriale, design calme et médical.
   Auto-suffisant. 'use client'.
   ════════════════════════════════════════════════════════════════════════════ */

/* ── Google Fonts ─────────────────────────────────────────────────────────── */
const FONT_LINK =
  'https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400;1,600&family=Inter:wght@300;400;500;600&display=swap';

/* ── Palette ─────────────────────────────────────────────────────────────── */
const C = {
  bg: '#f7f9fc',
  bgAlt: '#edf1f8',
  bgDark: '#0b1220',
  bgDarkAlt: '#111a2e',
  bgCard: '#ffffff',
  accent: '#1e5fa8',
  accentDark: '#174d8a',
  accentLight: '#d6e6f8',
  white: '#ffffff',
  ink: '#0b1220',
  textMuted: '#4a5e7a',
  textFaint: '#8a9bb8',
  border: '#c4d4e8',
  borderDark: 'rgba(30,95,168,0.22)',
  warm: '#c9a84c',
} as const;

const SERIF = "'Lora', Georgia, serif" as const;
const SANS = "'Inter', system-ui, sans-serif" as const;

/* ── Easing ─────────────────────────────────────────────────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ════════════════════════════════════════════════════════════════════════════
   Types
   ════════════════════════════════════════════════════════════════════════════ */

interface Phase {
  id: string;
  index: string;
  caption: string;
  sub: string;
  imgId: string;
}

interface Consultation {
  title: string;
  desc: string;
  tag: string;
}

interface EditRow {
  eyebrow: string;
  ghostNum: string;
  titleLine1: string;
  titleLine2: string;
  body: string;
  imgId: string;
  reverse: boolean;
}

interface PreventionItem {
  num: string;
  title: string;
  body: string;
}

interface Testimonial {
  quote: string;
  name: string;
  situation: string;
}

/* ════════════════════════════════════════════════════════════════════════════
   Data
   ════════════════════════════════════════════════════════════════════════════ */

const PHASES: Phase[] = [
  {
    id: 'generale',
    index: 'I',
    caption: 'MÉDECINE GÉNÉRALE',
    sub: 'Suivi au long cours, pathologies courantes, maladies chroniques — votre santé vue dans sa globalité.',
    imgId: '1559757148-5c350d0d3c56',
  },
  {
    id: 'preventive',
    index: 'II',
    caption: 'MÉDECINE PRÉVENTIVE',
    sub: 'Bilan de santé complet, dépistages ciblés, vaccination — anticiper plutôt que guérir.',
    imgId: '1571019613454-1cb2f99b2d8b',
  },
  {
    id: 'sport',
    index: 'III',
    caption: 'MÉDECINE DU SPORT',
    sub: 'Certificats médicaux, suivi de performance, prévention des blessures — pour amateurs et licenciés.',
    imgId: '1551601651-2a8158c5a73e',
  },
];

const CONSULTATIONS: Consultation[] = [
  {
    title: 'Consultation générale',
    desc: "Diagnostic, ordonnances, suivi de santé au quotidien. Créneaux de 30 min pour prendre le temps qu'il faut.",
    tag: 'Généraliste',
  },
  {
    title: 'Médecine préventive',
    desc: 'Bilan annuel, dépistages recommandés selon âge et antécédents. Mieux vaut prévenir.',
    tag: 'Prévention',
  },
  {
    title: 'Suivi pathologies chroniques',
    desc: 'Hypertension, diabète, asthme — un suivi structuré et personnalisé sur la durée.',
    tag: 'Chronique',
  },
  {
    title: 'Médecine du sport',
    desc: 'Certificat médical, bilan cardio-respiratoire, conseils en entraînement et prévention des blessures.',
    tag: 'Sport',
  },
  {
    title: 'Pédiatrie adulte & ado',
    desc: 'Accompagnement des jeunes adultes et adolescents en transition de soins, vaccins, vie scolaire.',
    tag: 'Ado & jeunes',
  },
  {
    title: 'Téléconsultation',
    desc: "Suivi de vos pathologies connues, renouvellement, résultats d'analyses à distance, sans déplacement.",
    tag: 'À distance',
  },
];

const EDIT_ROWS: EditRow[] = [
  {
    eyebrow: 'Notre philosophie',
    ghostNum: 'I',
    titleLine1: "Écouter d'abord,",
    titleLine2: "soigner ensuite.",
    body: 'Dans un monde médical où le temps manque, le cabinet du Dr. Beaumont a choisi de résister. Chaque consultation dure 30 minutes minimum. Pas de chronomètre, pas de patient suivant qui attend derrière la porte. Seulement vous, votre histoire, et le soin que vous méritez.',
    imgId: '1559757148-5c350d0d3c56',
    reverse: false,
  },
  {
    eyebrow: 'Le cabinet',
    ghostNum: 'II',
    titleLine1: 'Strasbourg-Centre,',
    titleLine2: 'accessible.',
    body: "Situ\u00e9 en plein c\u0153ur de Strasbourg, le cabinet est accessible en tram et dispose d'un parking \u00e0 200 m. Entr\u00e9e de plain-pied, acc\u00e8s fauteuil roulant. Pour ceux qui ne peuvent pas se d\u00e9placer, la t\u00e9l\u00e9consultation est disponible sur rendez-vous \u2014 m\u00eame qualit\u00e9 d'\u00e9coute, depuis chez vous.",
    imgId: '1571019613454-1cb2f99b2d8b',
    reverse: true,
  },
];

const PREVENTION_ITEMS: PreventionItem[] = [
  {
    num: '01',
    title: 'Bilan biologique annuel personnalisé',
    body: 'NFS, bilan lipidique, glycémie, thyroïde — adapté à votre âge, votre mode de vie et vos antécédents familiaux.',
  },
  {
    num: '02',
    title: 'Dépistages cardiovasculaires et cancérologiques',
    body: 'ECG, pression artérielle 24h, orientation mammographie, coloscopie — les dépistages qui sauvent des vies.',
  },
  {
    num: '03',
    title: 'Suivi vaccinal adulte (DTP, grippe, HPV…)',
    body: 'Mise à jour de votre carnet, rappels personnalisés, vaccination grippe et recommandations OMS à jour.',
  },
  {
    num: '04',
    title: 'Conseils nutrition, sommeil et prévention du burnout',
    body: "Alimentation, gestion du stress, hygiène de sommeil — la santé globale, pas seulement l'absence de maladie.",
  },
];

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Hypertendu depuis cinq ans, je changeais de médecin tous les deux ans faute de suivi. Avec le Dr. Beaumont, pour la première fois, je me sens vraiment écouté. Mon traitement est enfin ajusté, ma tension est stable. C'est ça, un médecin traitant.",
    name: 'Thomas R.',
    situation: 'Patient suivi pour hypertension artérielle',
  },
  {
    quote:
      "Je cours des semi-marathons et j'avais peur des blessures à répétition. Le Dr. Beaumont a fait un bilan complet, ajusté mes entraînements avec moi, et depuis deux saisons, zéro pépins. Je me sens entre de bonnes mains.",
    name: 'Isabelle M.',
    situation: 'Coureuse suivie en médecine du sport',
  },
];

const MOTIFS = [
  'Consultation générale',
  'Renouvellement ordonnance',
  'Bilan de santé',
  'Médecine du sport',
  'Urgence',
  'Autre',
];

/* ════════════════════════════════════════════════════════════════════════════
   Helpers
   ════════════════════════════════════════════════════════════════════════════ */

function photoUrl(id: string, w = 1600) {
  return `https://images.unsplash.com/photo-${id}?q=80&w=${w}&auto=format&fit=crop`;
}

/* ════════════════════════════════════════════════════════════════════════════
   Primitives
   ════════════════════════════════════════════════════════════════════════════ */

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

function BlueButton({
  children,
  onClick,
  type = 'button',
  filled = true,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  filled?: boolean;
}) {
  const [hover, setHover] = useState(false);
  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 12,
    padding: '14px 28px',
    fontFamily: SANS,
    fontSize: 13,
    fontWeight: 500,
    letterSpacing: '0.04em',
    cursor: 'pointer',
    border: `1.5px solid ${C.accent}`,
    background: filled
      ? hover
        ? C.accentDark
        : C.accent
      : hover
      ? C.accentLight
      : 'transparent',
    color: filled ? C.white : hover ? C.accentDark : C.accent,
    transition: 'all .45s cubic-bezier(.16,1,.3,1)',
    transform: hover ? 'translateY(-2px)' : 'none',
    boxShadow: hover && filled ? '0 8px 28px -10px rgba(30,95,168,0.55)' : 'none',
  };
  return (
    <button
      type={type}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={base}
    >
      {children}
      <ArrowRight
        size={15}
        style={{
          transform: hover ? 'translateX(5px)' : 'none',
          transition: 'transform .45s cubic-bezier(.16,1,.3,1)',
        }}
      />
    </button>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   NAV
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
    { label: 'Consultations', href: '#consultations' },
    { label: 'Prévention', href: '#prevention' },
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
      ? '14px clamp(20px,5vw,64px)'
      : '24px clamp(20px,5vw,64px)',
    background: solid ? 'rgba(11,18,32,0.94)' : 'transparent',
    backdropFilter: solid ? 'blur(16px) saturate(130%)' : 'none',
    WebkitBackdropFilter: solid ? 'blur(16px) saturate(130%)' : 'none',
    borderBottom: solid
      ? `1px solid rgba(30,95,168,0.22)`
      : '1px solid transparent',
    transition: 'all .55s cubic-bezier(.16,1,.3,1)',
  };

  const brand: React.CSSProperties = {
    fontFamily: SERIF,
    fontSize: 19,
    fontWeight: 600,
    color: C.white,
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    letterSpacing: '-0.01em',
  };

  const linkRow: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'clamp(18px,2.4vw,38px)',
  };

  return (
    <>
      <nav style={bar}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href={FONT_LINK} rel="stylesheet" />
      <a href="#accueil" style={brand}>
        <Heart size={18} color={C.accent} strokeWidth={2} fill={C.accent} />
        Dr.&nbsp;Beaumont
      </a>
      <div style={linkRow} className="eb-navlinks">
        {navLinks.map((l) => (
          <NavLink key={l.label} label={l.label} href={l.href} />
        ))}
      </div>
      <div className="eb-navcta">
        <a href="#rdv" style={{ textDecoration: 'none' }}>
          <BlueButton>Prendre RDV</BlueButton>
        </a>
      </div>
      
        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="eb-burger"
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
          .eb-navlinks { display: none !important; }
          .eb-burger { display: flex !important; flex-direction: column; }
          .eb-navcta { display: none !important; }
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
        fontSize: 13,
        fontWeight: 400,
        color: h ? C.white : 'rgba(255,255,255,0.8)',
        textDecoration: 'none',
        transition: 'color .35s',
        position: 'relative',
        paddingBottom: 4,
        letterSpacing: '0.01em',
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
          background: C.accentLight,
          transition: 'width .45s cubic-bezier(.16,1,.3,1)',
        }}
      />
    </a>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   HERO
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
    <section ref={ref} style={section} id="accueil">
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
          src={photoUrl('1559757148-5c350d0d3c56', 2000)}
          alt="Consultation médicale avec le Dr. Beaumont"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </motion.div>

      {/* Scrim principal */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(11,18,32,0.52) 0%, rgba(11,18,32,0.12) 38%, rgba(11,18,32,0.50) 70%, rgba(11,18,32,0.90) 100%)',
        }}
      />
      {/* Scrim centre */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(110% 80% at 50% 40%, transparent 30%, rgba(11,18,32,0.50) 100%)',
        }}
      />

      {/* Contenu hero */}
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, ease: EASE, delay: 0 }}
        >
          <span
            style={{
              fontFamily: SANS,
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: C.accentLight,
              display: 'block',
              marginBottom: 28,
            }}
          >
            Médecin généraliste · Strasbourg
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.14 }}
          style={{
            fontFamily: SERIF,
            fontWeight: 400,
            fontStyle: 'italic',
            color: C.white,
            fontSize: 'clamp(3rem,7vw,8rem)',
            lineHeight: 1.0,
            letterSpacing: '-0.02em',
            margin: '0 0 26px',
            textShadow: '0 12px 56px rgba(0,0,0,0.45)',
          }}
        >
          La médecine
          <br />
          qui vous écoute.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.38 }}
          style={{
            fontFamily: SANS,
            fontSize: 'clamp(15px,1.8vw,19px)',
            fontWeight: 300,
            color: 'rgba(255,255,255,0.82)',
            maxWidth: 540,
            lineHeight: 1.7,
            marginBottom: 42,
          }}
        >
          Cabinet de médecine générale et préventive au cœur de Strasbourg.
          Consultations de 30 minutes, sans précipitation.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.58 }}
        >
          <BlueButton>Prendre rendez-vous</BlueButton>
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
            color: 'rgba(255,255,255,0.60)',
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
   INTRO
   ════════════════════════════════════════════════════════════════════════════ */
function Intro() {
  const sec: React.CSSProperties = {
    background: C.bgAlt,
    padding: 'clamp(88px,12vw,180px) clamp(24px,8vw,140px)',
    textAlign: 'center',
  };
  return (
    <section style={sec} id="apropos">
      <Reveal>
        <p
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 'clamp(22px,3.2vw,44px)',
            lineHeight: 1.42,
            fontWeight: 400,
            color: C.ink,
            maxWidth: 900,
            margin: '0 auto',
          }}
        >
          « La médecine est avant tout une relation humaine. Chaque consultation
          est un{' '}
          <span style={{ color: C.accent }}>moment de confiance</span> — celui
          où vous choisissez de vous confier, et où je m'engage à vous entendre
          vraiment. »
        </p>
      </Reveal>
      <Reveal delay={0.16}>
        <p
          style={{
            fontFamily: SANS,
            fontSize: 14,
            fontWeight: 400,
            color: C.textMuted,
            marginTop: 32,
            letterSpacing: '0.08em',
          }}
        >
          — Dr. Élodie Beaumont, médecin généraliste
        </p>
      </Reveal>
      <Reveal delay={0.24}>
        <div
          style={{
            width: 1,
            height: 80,
            background: `linear-gradient(${C.accent}, transparent)`,
            margin: '48px auto 0',
            opacity: 0.5,
          }}
        />
      </Reveal>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   CARE SEQUENCE (Sticky crossfade 320vh)
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
        src={photoUrl(phase.imgId)}
        alt={phase.caption}
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
        padding: '0 clamp(24px,8vw,120px)',
        opacity,
        y,
      }}
    >
      {/* Section label top-right */}
      <span
        style={{
          position: 'absolute',
          top: 'clamp(90px,10vw,120px)',
          right: 'clamp(24px,4vw,60px)',
          fontFamily: SANS,
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: '0.32em',
          textTransform: 'uppercase',
          color: 'rgba(214,230,248,0.75)',
        }}
      >
        Domaines de soin
      </span>

      <span
        style={{
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontSize: 'clamp(60px,12vw,160px)',
          color: 'rgba(30,95,168,0.22)',
          lineHeight: 1,
          marginBottom: 8,
          display: 'block',
          fontWeight: 400,
        }}
      >
        {phase.index}
      </span>
      <h2
        style={{
          fontFamily: SANS,
          fontSize: 'clamp(18px,2.2vw,26px)',
          fontWeight: 600,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: C.accentLight,
          margin: '0 0 18px',
        }}
      >
        {phase.caption}
      </h2>
      <p
        style={{
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontSize: 'clamp(16px,1.9vw,22px)',
          color: 'rgba(255,255,255,0.88)',
          maxWidth: 520,
          lineHeight: 1.65,
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
  const width = useTransform(progress, [i * seg, (i + 1) * seg], [10, 36]);
  return (
    <motion.div
      style={{ height: 2, width, background: C.accentLight, opacity, borderRadius: 1 }}
    />
  );
}

function CareSequence() {
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
    >
      <div
        style={{
          position: 'relative',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {PHASES.map((ph, i) => (
          <PhaseImage
            key={ph.id}
            phase={ph}
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
              'linear-gradient(to bottom, rgba(11,18,32,0.38), rgba(11,18,32,0.12) 42%, rgba(11,18,32,0.62))',
          }}
        />
        {PHASES.map((ph, i) => (
          <PhaseCaption
            key={ph.id}
            phase={ph}
            i={i}
            total={PHASES.length}
            progress={progress}
          />
        ))}

        {/* ProgressDots */}
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
          {PHASES.map((ph, i) => (
            <ProgressDot
              key={ph.id}
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
   CONSULTATION CARDS
   ════════════════════════════════════════════════════════════════════════════ */
function ConsultationCard({ c, i }: { c: Consultation; i: number }) {
  const [hover, setHover] = useState(false);
  const card: React.CSSProperties = {
    background: C.bgCard,
    border: `1.5px solid ${hover ? C.border : 'rgba(196,212,232,0.5)'}`,
    padding: 'clamp(28px,3.5vw,40px)',
    transform: hover ? 'translateY(-8px)' : 'none',
    boxShadow: hover
      ? '0 32px 72px -36px rgba(30,95,168,0.28)'
      : '0 8px 32px -24px rgba(11,18,32,0.14)',
    transition: 'all .55s cubic-bezier(.16,1,.3,1)',
    cursor: 'default',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
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
        <span
          style={{
            fontFamily: SANS,
            fontSize: 10.5,
            fontWeight: 600,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: C.accent,
            padding: '5px 11px',
            background: C.accentLight,
            alignSelf: 'flex-start',
          }}
        >
          {c.tag}
        </span>
        <h3
          style={{
            fontFamily: SERIF,
            fontSize: 'clamp(19px,2vw,24px)',
            fontWeight: 600,
            color: C.ink,
            margin: 0,
            lineHeight: 1.25,
          }}
        >
          {c.title}
        </h3>
        <p
          style={{
            fontFamily: SANS,
            fontSize: 14.5,
            fontWeight: 300,
            color: C.textMuted,
            margin: 0,
            lineHeight: 1.7,
            flex: 1,
          }}
        >
          {c.desc}
        </p>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontFamily: SANS,
            fontSize: 12,
            fontWeight: 500,
            color: hover ? C.accentDark : C.accent,
            transition: 'color .35s',
            marginTop: 8,
          }}
        >
          Prendre rendez-vous
          <ArrowRight
            size={13}
            style={{
              transform: hover ? 'translateX(4px)' : 'none',
              transition: 'transform .45s cubic-bezier(.16,1,.3,1)',
            }}
          />
        </div>
      </article>
    </Reveal>
  );
}

function ConsultationCards() {
  const sec: React.CSSProperties = {
    background: C.bg,
    padding: 'clamp(90px,12vw,170px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 'clamp(20px,2.6vw,36px)',
    maxWidth: 1240,
    margin: '0 auto',
  };
  return (
    <section style={sec} id="consultations">
      <div style={{ maxWidth: 1240, margin: '0 auto 60px' }}>
        <Reveal>
          <span
            style={{
              fontFamily: SANS,
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: C.accent,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <span style={{ width: 40, height: 1, background: C.accent, opacity: 0.6, display: 'inline-block' }} />
            Nos consultations
          </span>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(32px,5vw,66px)',
              fontWeight: 400,
              color: C.ink,
              margin: '18px 0 0',
              lineHeight: 1.08,
            }}
          >
            Tout ce dont{' '}
            <span style={{ fontStyle: 'italic', color: C.accent }}>
              vous avez besoin
            </span>
          </h2>
        </Reveal>
      </div>
      <div style={grid}>
        {CONSULTATIONS.map((c, i) => (
          <ConsultationCard key={c.title} c={c} i={i} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   EDITORIAL ROWS
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

function EditRowBlock({ row }: { row: EditRow }) {
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
  };
  const txt: React.CSSProperties = {
    order: row.reverse ? 1 : 2,
  };
  return (
    <div style={wrap} className="eb-editrow">
      <Reveal y={48} style={imgWrap}>
        <ParallaxImg src={photoUrl(row.imgId, 800)} alt={row.titleLine1} />
      </Reveal>
      <div style={txt}>
        <Reveal>
          <span
            style={{
              fontFamily: SANS,
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: '0.26em',
              textTransform: 'uppercase',
              color: C.accent,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <span style={{ width: 34, height: 1, background: C.accent, opacity: 0.6, display: 'inline-block' }} />
            {row.eyebrow}
          </span>
        </Reveal>
        <Reveal delay={0.08}>
          {/* Ghost number */}
          <span
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: 'clamp(56px,8vw,110px)',
              fontWeight: 400,
              color: C.bgAlt,
              lineHeight: 1,
              display: 'block',
              marginTop: 4,
              marginBottom: -16,
              WebkitTextStroke: `1.5px ${C.border}`,
            }}
          >
            {row.ghostNum}
          </span>
        </Reveal>
        <Reveal delay={0.12}>
          <h3
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: 'clamp(28px,4vw,52px)',
              fontWeight: 400,
              color: C.ink,
              margin: '0 0 22px',
              lineHeight: 1.16,
              position: 'relative',
              zIndex: 1,
            }}
          >
            {row.titleLine1}
            <br />
            {row.titleLine2}
          </h3>
        </Reveal>
        <Reveal delay={0.2}>
          <p
            style={{
              fontFamily: SANS,
              fontSize: 'clamp(15px,1.5vw,17px)',
              fontWeight: 300,
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
          .eb-editrow { grid-template-columns: 1fr !important; }
          .eb-editrow > * { order: initial !important; }
        }
      `}</style>
    </div>
  );
}

function EditorialRows() {
  const sec: React.CSSProperties = {
    background: C.bg,
    padding: 'clamp(80px,10vw,150px) clamp(24px,6vw,96px)',
  };
  return (
    <section style={sec}>
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(80px,10vw,140px)',
        }}
      >
        {EDIT_ROWS.map((row) => (
          <EditRowBlock key={row.eyebrow} row={row} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   PREVENTION PANEL (sticky side)
   ════════════════════════════════════════════════════════════════════════════ */
function PreventionPanel() {
  const sec: React.CSSProperties = {
    background: C.bgDark,
    padding: 'clamp(80px,11vw,160px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '0.95fr 1.05fr',
    gap: 'clamp(40px,6vw,96px)',
    maxWidth: 1240,
    margin: '0 auto',
    alignItems: 'start',
  };
  const stickyImg: React.CSSProperties = {
    position: 'sticky',
    top: 100,
    alignSelf: 'start',
  };

  return (
    <section style={sec} id="prevention">
      <div style={grid} className="eb-prepanel">
        {/* Image collante gauche */}
        <div style={stickyImg} className="eb-prepanel-img">
          <div
            style={{
              overflow: 'hidden',
              border: `1px solid ${C.borderDark}`,
              aspectRatio: '4 / 5',
            }}
          >
            <img
              src={photoUrl('1551601651-2a8158c5a73e', 900)}
              alt="Médecine préventive — cabinet Dr. Beaumont"
              loading="lazy"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </div>
          <div style={{ marginTop: 24 }}>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                color: C.accent,
                marginBottom: 10,
              }}
            >
              Prévention — 4 piliers
            </div>
            <p
              style={{
                fontFamily: SERIF,
                fontStyle: 'italic',
                fontSize: 16,
                color: 'rgba(255,255,255,0.66)',
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              La meilleure médecine est celle que l'on n'a jamais besoin de pratiquer.
            </p>
          </div>
        </div>

        {/* Checkpoints droite */}
        <div>
          <Reveal>
            <span
              style={{
                fontFamily: SANS,
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: C.accentLight,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <span style={{ width: 34, height: 1, background: C.accentLight, opacity: 0.5, display: 'inline-block' }} />
              Médecine préventive
            </span>
          </Reveal>
          <Reveal delay={0.08}>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(32px,4.6vw,60px)',
                fontWeight: 400,
                color: C.white,
                margin: '18px 0 48px',
                lineHeight: 1.1,
              }}
            >
              Anticiper
              <br />
              <span style={{ fontStyle: 'italic', color: C.accentLight }}>
                plutôt que guérir.
              </span>
            </h2>
          </Reveal>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {PREVENTION_ITEMS.map((item, i) => (
              <Reveal key={item.num} delay={0.06 * i}>
                <div
                  style={{
                    padding: 'clamp(28px,3.5vw,40px) 0',
                    borderTop: `1px solid rgba(30,95,168,0.30)`,
                    display: 'flex',
                    gap: 28,
                    alignItems: 'baseline',
                  }}
                >
                  <span
                    style={{
                      fontFamily: SERIF,
                      fontStyle: 'italic',
                      fontSize: 'clamp(26px,2.8vw,36px)',
                      color: C.warm,
                      minWidth: 52,
                      flexShrink: 0,
                      lineHeight: 1,
                    }}
                  >
                    {item.num}
                  </span>
                  <div>
                    <h4
                      style={{
                        fontFamily: SERIF,
                        fontSize: 'clamp(17px,1.8vw,22px)',
                        fontWeight: 600,
                        color: C.white,
                        margin: '0 0 10px',
                        lineHeight: 1.3,
                      }}
                    >
                      {item.title}
                    </h4>
                    <p
                      style={{
                        fontFamily: SANS,
                        fontSize: 14.5,
                        fontWeight: 300,
                        lineHeight: 1.7,
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

          <Reveal delay={0.28}>
            <div style={{ marginTop: 48 }}>
              <a href="#rdv" style={{ textDecoration: 'none' }}>
                <BlueButton filled={false}>Consulter pour un bilan</BlueButton>
              </a>
            </div>
          </Reveal>
        </div>
      </div>
      <style>{`
        @media (max-width: 860px) {
          .eb-prepanel { grid-template-columns: 1fr !important; }
          .eb-prepanel-img { position: static !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   TESTIMONIALS
   ════════════════════════════════════════════════════════════════════════════ */
function TestimonialCard({ t, i }: { t: Testimonial; i: number }) {
  const card: React.CSSProperties = {
    background: C.bgCard,
    border: `1.5px solid ${C.border}`,
    padding: 'clamp(32px,4vw,48px)',
    boxShadow: '0 20px 56px -38px rgba(30,95,168,0.22)',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    boxSizing: 'border-box',
  };
  return (
    <Reveal delay={i * 0.14} style={{ height: '100%' }}>
      <figure style={card}>
        <Quote size={32} color={C.warm} strokeWidth={1.3} style={{ marginBottom: 22, flexShrink: 0 }} />
        <blockquote
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 'clamp(17px,1.9vw,21px)',
            lineHeight: 1.65,
            color: C.ink,
            margin: '0 0 28px',
            flex: 1,
          }}
        >
          « {t.quote} »
        </blockquote>
        <figcaption
          style={{
            borderTop: `1px solid ${C.border}`,
            paddingTop: 20,
          }}
        >
          <div style={{ fontFamily: SERIF, fontSize: 17, fontWeight: 600, color: C.ink }}>
            {t.name}
          </div>
          <div
            style={{
              fontFamily: SANS,
              fontSize: 12,
              fontWeight: 400,
              color: C.textMuted,
              marginTop: 5,
            }}
          >
            {t.situation}
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
    gridTemplateColumns: '1fr 1fr',
    gap: 'clamp(24px,3.5vw,52px)',
    maxWidth: 1180,
    margin: '0 auto',
  };
  return (
    <section style={sec}>
      <div style={{ maxWidth: 1180, margin: '0 auto 56px', textAlign: 'center' }}>
        <Reveal>
          <span
            style={{
              fontFamily: SANS,
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: C.accent,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
            }}
          >
            <span style={{ width: 34, height: 1, background: C.accent, opacity: 0.6, display: 'inline-block' }} />
            Témoignages
            <span style={{ width: 34, height: 1, background: C.accent, opacity: 0.6, display: 'inline-block' }} />
          </span>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(30px,4.5vw,58px)',
              fontWeight: 400,
              color: C.ink,
              margin: '18px 0 0',
              lineHeight: 1.1,
            }}
          >
            La parole de{' '}
            <span style={{ fontStyle: 'italic', color: C.accent }}>
              nos patients
            </span>
          </h2>
        </Reveal>
      </div>
      <div style={grid} className="eb-testgrid">
        {TESTIMONIALS.map((t, i) => (
          <TestimonialCard key={t.name} t={t} i={i} />
        ))}
      </div>
      <style>{`
        @media (max-width: 860px) {
          .eb-testgrid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   APPOINTMENT FORM
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
    background: C.bgDark,
    padding: 'clamp(96px,13vw,180px) clamp(24px,6vw,96px)',
    position: 'relative',
    overflow: 'hidden',
  };

  const fieldBase: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    background: 'transparent',
    border: 'none',
    borderBottom: `1px solid rgba(196,212,232,0.38)`,
    padding: '14px 2px',
    fontFamily: SERIF,
    fontSize: 17,
    color: C.white,
    outline: 'none',
    transition: 'border-color .3s',
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    color: C.accent,
    display: 'block',
    marginBottom: 6,
  };

  return (
    <section style={sec} id="rdv">
      {/* Fond décoratif subtil */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(80% 60% at 50% 100%, rgba(30,95,168,0.10) 0%, transparent 70%)',
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
          <span
            style={{
              fontFamily: SANS,
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: C.accentLight,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
            }}
          >
            <span style={{ width: 28, height: 1, background: C.accentLight, opacity: 0.5, display: 'inline-block' }} />
            Prise de rendez-vous
            <span style={{ width: 28, height: 1, background: C.accentLight, opacity: 0.5, display: 'inline-block' }} />
          </span>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: 'clamp(32px,5vw,68px)',
              fontWeight: 400,
              color: C.white,
              margin: '20px 0 16px',
              lineHeight: 1.06,
            }}
          >
            Consulter le Dr.&nbsp;Beaumont
          </h2>
        </Reveal>
        <Reveal delay={0.14}>
          <p
            style={{
              fontFamily: SANS,
              fontSize: 15,
              fontWeight: 300,
              lineHeight: 1.7,
              color: 'rgba(255,255,255,0.68)',
              maxWidth: 520,
              margin: '0 auto 52px',
            }}
          >
            Remplissez ce formulaire pour une prise de contact. Nous vous
            confirmons votre rendez-vous par e-mail sous 24h.
          </p>
        </Reveal>

        {sent ? (
          <Reveal>
            <div
              style={{
                border: `1.5px solid rgba(30,95,168,0.50)`,
                padding: 'clamp(36px,5vw,56px)',
                background: 'rgba(30,95,168,0.08)',
              }}
            >
              <Heart
                size={36}
                color={C.accentLight}
                strokeWidth={1.5}
                fill="rgba(214,230,248,0.2)"
              />
              <h3
                style={{
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  fontSize: 32,
                  fontWeight: 400,
                  color: C.white,
                  margin: '22px 0 14px',
                }}
              >
                Merci {prenom}, nous confirmons votre RDV par email.
              </h3>
              <p
                style={{
                  fontFamily: SANS,
                  fontSize: 15,
                  fontWeight: 300,
                  color: 'rgba(255,255,255,0.70)',
                  margin: 0,
                  lineHeight: 1.65,
                }}
              >
                Vous recevrez une confirmation à{' '}
                <strong style={{ color: C.accentLight }}>{email}</strong> dans
                les plus brefs délais.
              </p>
            </div>
          </Reveal>
        ) : (
          <Reveal delay={0.2}>
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
                <label style={labelStyle} htmlFor="eb-prenom">
                  Prénom
                </label>
                <input
                  id="eb-prenom"
                  style={fieldBase}
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  placeholder="Votre prénom"
                  autoComplete="given-name"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label style={labelStyle} htmlFor="eb-email">
                  Email
                </label>
                <input
                  id="eb-email"
                  type="email"
                  style={fieldBase}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.fr"
                  autoComplete="email"
                  required
                />
              </div>

              {/* Téléphone */}
              <div>
                <label style={labelStyle} htmlFor="eb-tel">
                  Téléphone
                </label>
                <input
                  id="eb-tel"
                  type="tel"
                  style={fieldBase}
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  placeholder="06 xx xx xx xx"
                  autoComplete="tel"
                />
              </div>

              {/* Motif */}
              <div>
                <label style={labelStyle} htmlFor="eb-motif">
                  Motif de consultation
                </label>
                <select
                  id="eb-motif"
                  required
                  style={{
                    ...fieldBase,
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    cursor: 'pointer',
                    color: motif ? C.white : 'rgba(255,255,255,0.40)',
                  }}
                  value={motif}
                  onChange={(e) => setMotif(e.target.value)}
                >
                  <option value="" style={{ color: '#111' }}>
                    Choisir un motif…
                  </option>
                  {MOTIFS.map((m) => (
                    <option key={m} value={m} style={{ color: '#111' }}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div>
                <label style={labelStyle} htmlFor="eb-message">
                  Message (optionnel)
                </label>
                <textarea
                  id="eb-message"
                  rows={4}
                  style={{
                    ...fieldBase,
                    resize: 'none',
                    fontFamily: SANS,
                    fontSize: 15,
                    lineHeight: 1.6,
                  }}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Informations complémentaires…"
                />
              </div>

              <div style={{ textAlign: 'center', marginTop: 8 }}>
                <BlueButton type="submit" filled>
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
   FOOTER
   ════════════════════════════════════════════════════════════════════════════ */
function Footer() {
  const COLS: { title: string; items: string[] }[] = [
    {
      title: 'Consultations',
      items: [
        'Consultation générale',
        'Médecine préventive',
        'Pathologies chroniques',
        'Médecine du sport',
        'Téléconsultation',
      ],
    },
    {
      title: 'Cabinet',
      items: [
        'Notre philosophie',
        'Dr. Élodie Beaumont',
        'Équipe médicale',
        'Certifications',
      ],
    },
    {
      title: 'Informations pratiques',
      items: [
        'Prendre rendez-vous',
        'Accès & transports',
        'Urgences',
        'Téléconsultation',
      ],
    },
  ];

  const foot: React.CSSProperties = {
    background: C.bgDarkAlt,
    borderTop: `1px solid rgba(30,95,168,0.18)`,
    padding: 'clamp(68px,9vw,110px) clamp(24px,6vw,96px) 40px',
  };

  return (
    <footer id="contact" style={foot}>
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.4fr repeat(3, 1fr)',
          gap: 'clamp(32px,5vw,64px)',
        }}
        className="eb-footgrid"
      >
        {/* Brand */}
        <div>
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 22,
              fontWeight: 600,
              color: C.white,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <Heart size={18} color={C.accent} strokeWidth={2} fill={C.accent} />
            Dr.&nbsp;Beaumont
          </div>
          <p
            style={{
              fontFamily: SANS,
              fontSize: 14,
              fontWeight: 300,
              lineHeight: 1.72,
              color: 'rgba(255,255,255,0.56)',
              marginTop: 20,
              maxWidth: 320,
            }}
          >
            Cabinet de médecine générale & préventive au cœur de Strasbourg.
            Consultations sans précipitation.
          </p>
          <div
            style={{
              marginTop: 22,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 9,
                fontFamily: SANS,
                fontSize: 13,
                color: 'rgba(255,255,255,0.54)',
              }}
            >
              <MapPin size={13} color={C.accent} strokeWidth={1.6} />
              12 rue du Dôme · 67000 Strasbourg
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 9,
                fontFamily: SANS,
                fontSize: 13,
                color: 'rgba(255,255,255,0.54)',
              }}
            >
              <Phone size={13} color={C.accent} strokeWidth={1.6} />
              03 88 00 00 00
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 9,
                fontFamily: SANS,
                fontSize: 13,
                color: 'rgba(255,255,255,0.54)',
              }}
            >
              <Mail size={13} color={C.accent} strokeWidth={1.6} />{fd?.email ?? "contact@dr-beaumont.fr"}</div>
          </div>
        </div>

        {/* Colonnes */}
        {COLS.map((col) => (
          <div key={col.title}>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: C.accent,
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
              {col.items.map((item) => (
                <li key={item}>
                  <a
                    href="#rdv"
                    style={{
                      fontFamily: SANS,
                      fontSize: 14,
                      fontWeight: 300,
                      color: 'rgba(255,255,255,0.62)',
                      textDecoration: 'none',
                      transition: 'color .3s',
                    }}
                  >
                    {item}
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
          maxWidth: 1240,
          margin: '60px auto 0',
          paddingTop: 26,
          borderTop: `1px solid rgba(30,95,168,0.14)`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 14,
          fontFamily: SANS,
          fontSize: 12,
          fontWeight: 300,
          letterSpacing: '0.04em',
          color: 'rgba(255,255,255,0.36)',
        }}
      >
        <span>© 2026 Cabinet Dr. Élodie Beaumont — Médecin généraliste · Strasbourg</span>
        <span style={{ display: 'flex', gap: 22 }}>
          <a href="#rdv" style={{ color: 'inherit', textDecoration: 'none' }}>
            Mentions légales
          </a>
          <a href="#rdv" style={{ color: 'inherit', textDecoration: 'none' }}>
            Politique de confidentialité
          </a>
          <a href="#rdv" style={{ color: 'inherit', textDecoration: 'none' }}>
            RGPD
          </a>
        </span>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .eb-footgrid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 520px) {
          .eb-footgrid { grid-template-columns: 1fr !important; }
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
    background: C.bg,
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
      <Nav />
      <Hero />
      <Intro />
      <CareSequence />
      <ConsultationCards />
      <EditorialRows />
      <PreventionPanel />
      <Testimonials />
      <AppointmentForm />
      <Footer />
    </main>
  );
}
