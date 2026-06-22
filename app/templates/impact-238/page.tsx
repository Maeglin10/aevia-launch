'use client';

import React, { useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  MotionValue,
} from 'framer-motion';
import {
  ArrowRight,
  ChevronDown,
  Leaf,
  MapPin,
  Quote,
  Star,
  CheckCircle2,
} from 'lucide-react';

/* ════════════════════════════════════════════════════════════════════════════
   CENTRE KINÉ ATLANTIQUE — Cabinet de kinésithérapie · Rennes
   Template premium, scroll chorégraphié, composants décomposés.
   'use client' · Auto-suffisant · Polices Nunito + Merriweather.
   ════════════════════════════════════════════════════════════════════════════ */

/* ── Google Fonts ─────────────────────────────────────────────────────────── */
const FONT_URL =
  'https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700;800&family=Merriweather:ital,wght@0,400;0,700;1,400&display=swap';

/* ── Palette ─────────────────────────────────────────────────────────────── */
const C = {
  bg: '#f5f8f7',
  bgSection: '#eaf0ee',
  bgDark: '#0c1e1a',
  bgDarkAlt: '#112820',
  bgCard: '#ffffff',
  accent: '#1a7a5a',
  accentDark: '#125c43',
  accentLight: '#c8e6d8',
  white: '#ffffff',
  ink: '#0c1e1a',
  textMuted: '#4a6b5a',
  textFaint: '#8aab98',
  border: '#c4dcd2',
  gold: '#c9a84c',
} as const;

const SERIF = "'Merriweather', Georgia, serif" as const;
const SANS = "'Nunito', system-ui, sans-serif" as const;

/* ── Easing partagé ──────────────────────────────────────────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ── Photo URLs Unsplash ─────────────────────────────────────────────────── */
const PHOTO = {
  hero: 'https://images.unsplash.com/photo-1571019614235-5ba94de9a89d?q=80&w=2000&auto=format&fit=crop',
  sports: 'https://images.unsplash.com/photo-1544367572-5d0c17d45d9f?q=80&w=1600&auto=format&fit=crop',
  manual: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=1600&auto=format&fit=crop',
  approach: 'https://images.unsplash.com/photo-1571019614235-5ba94de9a89d?q=80&w=800&auto=format&fit=crop',
  team: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=800&auto=format&fit=crop',
  method: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=1200&auto=format&fit=crop',
} as const;

/* ════════════════════════════════════════════════════════════════════════════
   Interfaces de données
   ════════════════════════════════════════════════════════════════════════════ */

interface Program {
  src: string;
  alt: string;
  roman: string;
  caption: string;
  sub: string;
}

interface Specialty {
  number: string;
  title: string;
  desc: string;
}

interface Review {
  quote: string;
  name: string;
  role: string;
}

interface Spec {
  step: string;
  title: string;
  body: string;
}

interface EditRow {
  eyebrow: string;
  img: string;
  alt: string;
  title: string;
  body: string;
  reverse: boolean;
  outline: string;
}

/* ════════════════════════════════════════════════════════════════════════════
   Données
   ════════════════════════════════════════════════════════════════════════════ */

const PROGRAMS: Program[] = [
  {
    src: PHOTO.hero,
    alt: 'Séance de kinésithérapie en cabinet',
    roman: 'I',
    caption: 'RÉÉDUCATION',
    sub: 'Post-opératoire, orthopédique, neurologique — protocoles personnalisés avec suivi hebdomadaire.',
  },
  {
    src: PHOTO.sports,
    alt: 'Kinésithérapie du sport et récupération',
    roman: 'II',
    caption: 'KINÉ DU SPORT',
    sub: 'Préparation physique, récupération après blessure, prévention — pour amateurs et professionnels.',
  },
  {
    src: PHOTO.manual,
    alt: 'Thérapie manuelle et mobilisations articulaires',
    roman: 'III',
    caption: 'THÉRAPIE MANUELLE',
    sub: 'Mobilisations articulaires, techniques myofasciales, dry needling — soulagement rapide et durable.',
  },
];

const SPECIALTIES: Specialty[] = [
  {
    number: '01',
    title: 'Rééducation post-opératoire',
    desc: 'Protocoles adaptés après ligamentoplastie, prothèse, arthroscopie — retour à la mobilité complète.',
  },
  {
    number: '02',
    title: 'Lombalgie & Cervicalgie',
    desc: 'Prise en charge des douleurs chroniques du dos et du cou, renforcement musculaire profond.',
  },
  {
    number: '03',
    title: 'Kiné du sport',
    desc: 'Accompagnement des sportifs de tous niveaux : blessures musculaires, tendines, entorses.',
  },
  {
    number: '04',
    title: 'Thérapie manuelle',
    desc: 'Mobilisations articulaires douces, techniques myofasciales et dry needling ciblé.',
  },
  {
    number: '05',
    title: 'Respiratoire & Enfants',
    desc: 'Kinésithérapie respiratoire pédiatrique, désencombrement bronchique, asthme.',
  },
  {
    number: '06',
    title: 'Drainage lymphatique',
    desc: 'Drainage manuel certifié, traitement des oedèmes et des lymphoedèmes post-chirurgicaux.',
  },
];

const EDIT_ROWS: EditRow[] = [
  {
    eyebrow: 'Notre approche',
    img: PHOTO.approach,
    alt: 'Kinésithérapeute en consultation au cabinet',
    title: 'Traiter la cause, /pas le symptôme.',
    body: "Chez Centre Kiné Atlantique, chaque prise en charge commence par un bilan postural complet. Nous analysons la biomécanique globale — pas uniquement la zone douloureuse — afin de corriger les déséquilibres à l'origine de la douleur. Résultat : moins de rechutes, des progrès durables.",
    reverse: false,
    outline: '01',
  },
  {
    eyebrow: "L'équipe",
    img: PHOTO.team,
    alt: 'Équipe de kinésithérapeutes du cabinet',
    title: '3 kinés, /une vision partagée.',
    body: "Trois kinésithérapeutes diplômés d'État, chacun spécialisé dans un domaine complémentaire — sport, neurologie, pédiatrie — travaillent en concertation régulière. Ce regard croisé garantit la cohérence et la qualité de chaque suivi.",
    reverse: true,
    outline: '02',
  },
];

const METHOD_ITEMS: Spec[] = [
  {
    step: '01',
    title: 'Bilan initial 45 min',
    body: 'Évaluation posturale complète : mobilité articulaire, force musculaire, analyse de la marche et des chaînes kinétiques.',
  },
  {
    step: '02',
    title: 'Programme individualisé sur 4-8 semaines',
    body: 'Un protocole sur mesure établi dès la première séance, ajusté chaque semaine selon vos progrès et vos retours.',
  },
  {
    step: '03',
    title: 'Rééducation active + passive combinée',
    body: 'Techniques manuelles passives (mobilisations, massages) combinées à des exercices actifs progressifs pour une récupération optimale.',
  },
  {
    step: '04',
    title: "Exercices d\'automaintien remis après chaque séance",
    body: "Un programme d\'exercices personnalisés à réaliser chez vous, illustré et expliqué, pour consolider les acquis entre les séances.",
  },
];

const REVIEWS: Review[] = [
  {
    quote: "Après mon opération du genou, j'avais très peur de ne jamais récupérer pleinement. L'équipe m'a suivi avec une rigueur et une bienveillance exemplaires. En 8 semaines, j'ai retrouvé 95 % de mes capacités.",
    name: 'Sophie L.',
    role: 'Patiente · Rééducation post-LCA',
  },
  {
    quote: "Coureur amateur, j'avais une tendinite d'Achille chronique qui durait depuis deux ans. Après un bilan approfondi et 12 séances ciblées, je cours à nouveau sans douleur. La kinésiologie du sport ici, c'est du sérieux.",
    name: 'Thomas R.',
    role: 'Patient · Kiné du sport',
  },
  {
    quote: "Mon lombalgie me paralysait depuis des mois. La thérapie manuelle combinée aux exercices de renforcement a tout changé. Merci pour l'écoute et la pédagogie — je comprends enfin ma douleur.",
    name: 'Isabelle M.',
    role: 'Patiente · Lombalgie chronique',
  },
];

/* ════════════════════════════════════════════════════════════════════════════
   Primitives partagées
   ════════════════════════════════════════════════════════════════════════════ */

/** Étiquette fine, capitales, filet vert. */
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
    opacity: 0.7,
    flexShrink: 0,
  };
  const label: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 11,
    letterSpacing: '0.38em',
    textTransform: 'uppercase',
    color,
    fontWeight: 700,
  };
  return (
    <div style={wrap}>
      <span style={rule} />
      <span style={label}>{children}</span>
      {align === 'center' && <span style={rule} />}
    </div>
  );
}

/** Révélation au scroll : fondu + translation, une seule fois. */
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

/** Bouton vert principal, flèche glissante. */
function GreenButton({
  children,
  onClick,
  filled = false,
  dark = false,
  type = 'button',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  filled?: boolean;
  dark?: boolean;
  type?: 'button' | 'submit';
}) {
  const [hover, setHover] = useState(false);
  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 12,
    padding: '15px 30px',
    fontFamily: SANS,
    fontSize: 12,
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    fontWeight: 700,
    cursor: 'pointer',
    border: `2px solid ${filled ? C.accent : dark ? C.accentLight : C.accent}`,
    background: filled
      ? hover
        ? C.accentDark
        : C.accent
      : hover
        ? dark
          ? 'rgba(200,230,216,0.12)'
          : 'rgba(26,122,90,0.08)'
        : 'transparent',
    color: filled ? C.white : dark ? C.accentLight : C.accent,
    transition: 'all .45s cubic-bezier(.16,1,.3,1)',
    transform: hover ? 'translateY(-2px)' : 'none',
    boxShadow: hover && filled ? '0 12px 36px -10px rgba(26,122,90,0.5)' : 'none',
    borderRadius: 2,
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

  const NAV_LINKS = [
    { label: 'Spécialités', href: '#specialites' },
    { label: 'Notre méthode', href: '#methode' },
    { label: "L'équipe", href: '#equipe' },
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
    background: solid ? 'rgba(12,30,26,0.94)' : 'transparent',
    backdropFilter: solid ? 'blur(14px) saturate(130%)' : 'none',
    WebkitBackdropFilter: solid ? 'blur(14px) saturate(130%)' : 'none',
    borderBottom: solid
      ? `1px solid rgba(26,122,90,0.28)`
      : '1px solid transparent',
    transition: 'all .55s cubic-bezier(.16,1,.3,1)',
  };

  const brand: React.CSSProperties = {
    fontFamily: SERIF,
    fontWeight: 700,
    fontSize: 'clamp(16px,1.5vw,20px)',
    color: C.white,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    letterSpacing: '0.01em',
    textDecoration: 'none',
  };

  return (
    <nav style={bar} role="navigation" aria-label="Navigation principale">
      <a href="#accueil" style={brand}>
        <Leaf size={20} color={C.accentLight} strokeWidth={1.6} />
        Kiné Atlantique
      </a>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(18px,2.2vw,36px)' }} className="ka-navlinks">
        {NAV_LINKS.map((l) => (
          <NavLink key={l.label} label={l.label} href={l.href} />
        ))}
      </div>

      <div className="ka-navcta">
        <a href="#rdv" style={{ textDecoration: 'none' }}>
          <GreenButton filled>Prendre RDV</GreenButton>
        </a>
      </div>

      <style>{`
        @media (max-width: 860px){
          .ka-navlinks{ display:none !important; }
          .ka-navcta{ display:none !important; }
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
        fontWeight: 600,
        letterSpacing: '0.16em',
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
          background: C.accentLight,
          transition: 'width .45s cubic-bezier(.16,1,.3,1)',
        }}
      />
    </a>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   HERO — 100vh, parallaxe scale + Y, scrim double, text bas-gauche
   ════════════════════════════════════════════════════════════════════════════ */
function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.14]);
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '16%']);
  const txtY = useTransform(scrollYProgress, [0, 1], ['0%', '-42%']);
  const txtOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const section: React.CSSProperties = {
    position: 'relative',
    height: '100vh',
    minHeight: 680,
    overflow: 'hidden',
    background: C.bgDark,
  };

  return (
    <section ref={ref} style={section} id="accueil">
      {/* Image parallaxe */}
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
          src={PHOTO.hero}
          alt="Cabinet de kinésithérapie Centre Kiné Atlantique Rennes"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          priority-hint="high"
        />
      </motion.div>

      {/* Scrim bas */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to top, rgba(12,30,26,0.88) 0%, rgba(12,30,26,0.28) 50%, rgba(12,30,26,0.38) 100%)',
        }}
      />
      {/* Scrim latéral gauche */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to right, rgba(12,30,26,0.72) 0%, rgba(12,30,26,0.12) 55%, transparent 100%)',
        }}
      />

      {/* Texte bas-gauche */}
      <motion.div
        style={{
          position: 'relative',
          zIndex: 2,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: 'clamp(32px,5vw,80px)',
          paddingBottom: 'clamp(60px,8vw,110px)',
          y: txtY,
          opacity: txtOpacity,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.1 }}
        >
          <Eyebrow color={C.accentLight}>Kinésithérapie · Rennes</Eyebrow>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.25 }}
          style={{
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 'clamp(3rem,10vw,9rem)',
            lineHeight: 0.94,
            color: C.white,
            margin: 'clamp(20px,2.5vw,36px) 0 clamp(18px,2vw,28px)',
            letterSpacing: '-0.02em',
            textShadow: '0 8px 48px rgba(0,0,0,0.4)',
            maxWidth: '14ch',
          }}
        >
          RETROUVER
          <br />
          LE MOUVEMENT
          <br />
          <span style={{ color: C.accentLight, WebkitTextStroke: '0px' }}>
            LIBREMENT
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.5 }}
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 'clamp(16px,1.8vw,21px)',
            color: 'rgba(255,255,255,0.84)',
            maxWidth: 500,
            lineHeight: 1.65,
            marginBottom: 'clamp(28px,4vw,48px)',
          }}
        >
          Cabinet pluridisciplinaire à Rennes — bilan personnalisé, suivi rigoureux, résultats durables.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.7 }}
          style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}
        >
          <GreenButton filled dark>
            Prendre RDV
          </GreenButton>
          <GreenButton dark>
            Nos spécialités
          </GreenButton>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: 32,
          right: 'clamp(32px,5vw,80px)',
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
            fontWeight: 600,
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.6)',
            writingMode: 'vertical-rl',
          }}
        >
          Découvrir
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={18} color={C.accentLight} strokeWidth={2} />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   INTRO — Citation centrée, bgSection
   ════════════════════════════════════════════════════════════════════════════ */
function Intro() {
  const sec: React.CSSProperties = {
    background: C.bgSection,
    padding: 'clamp(90px,13vw,180px) clamp(24px,8vw,140px)',
    textAlign: 'center',
  };
  return (
    <section style={sec} id="presentation">
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <Reveal>
          <Eyebrow color={C.accent} align="center">
            Notre philosophie
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.1}>
          <p
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(24px,3.4vw,46px)',
              lineHeight: 1.38,
              fontWeight: 400,
              color: C.ink,
              margin: 'clamp(24px,3vw,44px) 0 0',
            }}
          >
            Le mouvement est la première{' '}
            <span style={{ fontStyle: 'italic', color: C.accent }}>médecine</span>.
            Chaque séance est une invitation à retrouver confiance en votre corps —
            progressivement, durablement,{' '}
            <span style={{ fontStyle: 'italic', color: C.accent }}>librement</span>.
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <div
            style={{
              width: 1,
              height: 80,
              background: `linear-gradient(${C.accent}, transparent)`,
              margin: 'clamp(48px,6vw,80px) auto 0',
              opacity: 0.6,
            }}
          />
        </Reveal>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   PROGRAM SEQUENCE — Sticky crossfade 320vh, 3 programmes
   ════════════════════════════════════════════════════════════════════════════ */

function ProgramImage({
  prog,
  i,
  total,
  progress,
}: {
  prog: Program;
  i: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const seg = 1 / total;
  const start = i * seg;
  const end = start + seg;
  const fadeIn = seg * 0.3;

  const opacity = useTransform(
    progress,
    [Math.max(0, start - fadeIn), start, end - fadeIn, Math.min(1, end)],
    i === 0
      ? [1, 1, 1, 0]
      : i === total - 1
        ? [0, 1, 1, 1]
        : [0, 1, 1, 0],
  );
  const scale = useTransform(progress, [start - fadeIn, end], [1.12, 1.0]);

  return (
    <motion.div style={{ position: 'absolute', inset: 0, opacity }}>
      <motion.img
        src={prog.src}
        alt={prog.alt}
        loading={i === 0 ? 'eager' : 'lazy'}
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

function ProgramCaption({
  prog,
  i,
  total,
  progress,
}: {
  prog: Program;
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
    i === 0 ? [1, 1, 1, 0] : i === total - 1 ? [0, 1, 1, 1] : [0, 1, 1, 0],
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
        padding: '0 24px',
        opacity,
        y,
      }}
    >
      {/* Chiffre romain */}
      <span
        style={{
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontSize: 'clamp(80px,14vw,180px)',
          color: 'rgba(200,230,216,0.18)',
          lineHeight: 1,
          letterSpacing: '-0.04em',
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      >
        {prog.roman}
      </span>

      {/* Titre */}
      <h2
        style={{
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 'clamp(36px,6.5vw,88px)',
          lineHeight: 1,
          color: C.white,
          letterSpacing: '0.06em',
          margin: '-8px 0 0',
          textShadow: '0 8px 40px rgba(0,0,0,0.55)',
        }}
      >
        {prog.caption}
      </h2>

      {/* Filet */}
      <div
        style={{
          width: 48,
          height: 2,
          background: C.accentLight,
          margin: '22px 0',
          opacity: 0.9,
        }}
      />

      {/* Sous-titre */}
      <p
        style={{
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontSize: 'clamp(16px,1.8vw,22px)',
          color: 'rgba(255,255,255,0.86)',
          maxWidth: 520,
          lineHeight: 1.6,
          margin: 0,
        }}
      >
        {prog.sub}
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
  const width = useTransform(progress, [i * seg, (i + 1) * seg], [8, 32]);
  return (
    <motion.div
      style={{
        height: 2,
        width,
        background: C.accentLight,
        opacity,
        borderRadius: 2,
      }}
    />
  );
}

function ProgramSequence() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  return (
    <section
      ref={ref}
      style={{ height: '320vh', position: 'relative', background: C.bgDark }}
      id="programmes"
    >
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        {/* Images crossfade */}
        {PROGRAMS.map((p, i) => (
          <ProgramImage
            key={p.roman}
            prog={p}
            i={i}
            total={PROGRAMS.length}
            progress={scrollYProgress}
          />
        ))}

        {/* Scrim de lisibilité */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to bottom, rgba(12,30,26,0.35) 0%, rgba(12,30,26,0.08) 40%, rgba(12,30,26,0.62) 100%)',
          }}
        />

        {/* Captions crossfade */}
        {PROGRAMS.map((p, i) => (
          <ProgramCaption
            key={p.roman}
            prog={p}
            i={i}
            total={PROGRAMS.length}
            progress={scrollYProgress}
          />
        ))}

        {/* Points de progression */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 10,
            alignItems: 'center',
          }}
        >
          {PROGRAMS.map((p, i) => (
            <ProgressDot
              key={p.roman}
              i={i}
              total={PROGRAMS.length}
              progress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   SPECIALTY CARDS — 6 cartes, fond clair, hover lift
   ════════════════════════════════════════════════════════════════════════════ */
function SpecialtyCard({ sp, i }: { sp: Specialty; i: number }) {
  const [hover, setHover] = useState(false);
  const card: React.CSSProperties = {
    background: C.bgCard,
    border: `1px solid ${hover ? C.accent : C.border}`,
    padding: 'clamp(28px,3.5vw,44px)',
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    transition: 'all .5s cubic-bezier(.16,1,.3,1)',
    transform: hover ? 'translateY(-8px)' : 'none',
    boxShadow: hover
      ? '0 32px 64px -30px rgba(26,122,90,0.22)'
      : '0 4px 20px -14px rgba(12,30,26,0.1)',
    cursor: 'default',
    borderRadius: 3,
  };

  return (
    <Reveal delay={i * 0.08} style={{ height: '100%' }}>
      <article
        style={card}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {/* Badge numéro */}
        <span
          style={{
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 'clamp(32px,4vw,52px)',
            color: hover ? C.accent : C.accentLight,
            lineHeight: 1,
            transition: 'color .45s',
            letterSpacing: '-0.02em',
          }}
        >
          {sp.number}
        </span>

        <h3
          style={{
            fontFamily: SERIF,
            fontWeight: 700,
            fontSize: 'clamp(18px,1.8vw,22px)',
            color: C.ink,
            lineHeight: 1.25,
            margin: 0,
          }}
        >
          {sp.title}
        </h3>

        <div
          style={{
            width: 32,
            height: 2,
            background: C.accent,
            opacity: hover ? 1 : 0.35,
            transition: 'opacity .45s',
            borderRadius: 2,
          }}
        />

        <p
          style={{
            fontFamily: SANS,
            fontSize: 'clamp(14px,1.4vw,16px)',
            lineHeight: 1.65,
            color: C.textMuted,
            margin: 0,
          }}
        >
          {sp.desc}
        </p>
      </article>
    </Reveal>
  );
}

function SpecialtyCards() {
  const sec: React.CSSProperties = {
    background: C.bg,
    padding: 'clamp(90px,12vw,160px) clamp(24px,6vw,96px)',
  };

  return (
    <section style={sec} id="specialites">
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ marginBottom: 'clamp(48px,6vw,80px)' }}>
          <Reveal>
            <Eyebrow>Nos spécialités</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2
              style={{
                fontFamily: SANS,
                fontWeight: 800,
                fontSize: 'clamp(34px,5.5vw,72px)',
                color: C.ink,
                margin: 'clamp(16px,2vw,24px) 0 0',
                lineHeight: 1.06,
                letterSpacing: '-0.02em',
              }}
            >
              Ce que nous{' '}
              <span style={{ color: C.accent }}>traitons</span>
            </h2>
          </Reveal>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
            gap: 'clamp(18px,2.5vw,32px)',
          }}
        >
          {SPECIALTIES.map((sp, i) => (
            <SpecialtyCard key={sp.number} sp={sp} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   EDITORIAL ROWS — 2 lignes alternées, numéros outline, bgSection
   ════════════════════════════════════════════════════════════════════════════ */

function ParallaxImg({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['-7%', '7%']);
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
  const imgOrder = row.reverse ? 2 : 1;
  const txtOrder = row.reverse ? 1 : 2;

  const titleParts = row.title.split('/');

  return (
    <div
      className="ka-editrow"
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'clamp(40px,6vw,96px)',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      {/* Numéro outline décoratif */}
      <span
        style={{
          position: 'absolute',
          top: -40,
          right: row.reverse ? 'auto' : -20,
          left: row.reverse ? -20 : 'auto',
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 'clamp(100px,16vw,220px)',
          color: 'transparent',
          WebkitTextStroke: `2px ${C.border}`,
          lineHeight: 1,
          userSelect: 'none',
          pointerEvents: 'none',
          zIndex: 0,
          opacity: 0.6,
        }}
        aria-hidden="true"
      >
        {row.outline}
      </span>

      {/* Photo */}
      <Reveal
        y={60}
        style={{
          order: imgOrder,
          overflow: 'hidden',
          aspectRatio: '4 / 5',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <ParallaxImg src={row.img} alt={row.alt} />
      </Reveal>

      {/* Texte */}
      <div style={{ order: txtOrder, position: 'relative', zIndex: 1 }}>
        <Reveal>
          <Eyebrow>{row.eyebrow}</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h3
            style={{
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 'clamp(28px,4vw,56px)',
              color: C.ink,
              margin: 'clamp(16px,2vw,24px) 0 clamp(18px,2.5vw,32px)',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
            }}
          >
            {titleParts.map((part, pi) => (
              <React.Fragment key={pi}>
                {pi > 0 && <br />}
                {part}
              </React.Fragment>
            ))}
          </h3>
        </Reveal>
        <Reveal delay={0.16}>
          <p
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(15px,1.5vw,18px)',
              lineHeight: 1.8,
              color: C.textMuted,
              maxWidth: 480,
              margin: 0,
            }}
          >
            {row.body}
          </p>
        </Reveal>
        <Reveal delay={0.24}>
          <div style={{ marginTop: 'clamp(24px,3vw,40px)' }}>
            <a
              href="#rdv"
              style={{
                fontFamily: SANS,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '0.20em',
                textTransform: 'uppercase',
                color: C.accent,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                borderBottom: `1px solid ${C.accent}`,
                paddingBottom: 4,
              }}
            >
              En savoir plus
              <ArrowRight size={13} />
            </a>
          </div>
        </Reveal>
      </div>

      <style>{`
        @media (max-width: 860px){
          .ka-editrow {
            grid-template-columns: 1fr !important;
          }
          .ka-editrow > *{
            order: initial !important;
          }
        }
      `}</style>
    </div>
  );
}

function EditorialRows() {
  const sec: React.CSSProperties = {
    background: C.bgSection,
    padding: 'clamp(80px,11vw,150px) clamp(24px,6vw,96px)',
  };
  return (
    <section style={sec} id="equipe">
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(80px,12vw,160px)',
        }}
      >
        {EDIT_ROWS.map((row, idx) => (
          <EditRowItem key={row.eyebrow} row={row} idx={idx} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   METHOD PANEL — Panneau collant gauche, items droite avec bordure top
   ════════════════════════════════════════════════════════════════════════════ */
function MethodPanel() {
  const sec: React.CSSProperties = {
    background: C.bgDark,
    padding: 'clamp(90px,12vw,160px) clamp(24px,6vw,96px)',
  };

  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1.1fr',
    gap: 'clamp(48px,7vw,110px)',
    maxWidth: 1280,
    margin: '0 auto',
    alignItems: 'start',
  };

  return (
    <section style={sec} id="methode">
      <div style={grid} className="ka-methpanel">
        {/* Image sticky gauche */}
        <div className="ka-methpanel-sticky" style={{ position: 'sticky', top: 100, alignSelf: 'start' }}>
          <Reveal>
            <div
              style={{
                overflow: 'hidden',
                border: `1px solid rgba(26,122,90,0.35)`,
                aspectRatio: '3 / 4',
              }}
            >
              <img
                src={PHOTO.method}
                alt="Kinésithérapeute pratiquant la thérapie manuelle"
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div style={{ marginTop: 28 }}>
              <div
                style={{
                  fontFamily: SANS,
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase',
                  color: C.textFaint,
                  marginBottom: 10,
                }}
              >
                Notre protocole
              </div>
              <div
                style={{
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  fontSize: 'clamp(17px,1.8vw,21px)',
                  color: 'rgba(200,230,216,0.78)',
                  lineHeight: 1.5,
                }}
              >
                « Un bilan sérieux est la moitié de la guérison. »
              </div>
            </div>
          </Reveal>
        </div>

        {/* Items droite qui défilent */}
        <div>
          <Reveal>
            <Eyebrow color={C.accentLight}>Notre méthode</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2
              style={{
                fontFamily: SANS,
                fontWeight: 800,
                fontSize: 'clamp(32px,4.5vw,62px)',
                color: C.white,
                margin: 'clamp(18px,2.5vw,32px) 0 clamp(44px,6vw,72px)',
                lineHeight: 1.08,
                letterSpacing: '-0.02em',
              }}
            >
              Un cadre{' '}
              <span style={{ color: C.accentLight }}>structuré</span>{' '}
              pour des résultats{' '}
              <span style={{ fontStyle: 'italic', fontFamily: SERIF, fontWeight: 400 }}>
                prévisibles
              </span>
            </h2>
          </Reveal>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {METHOD_ITEMS.map((item, i) => (
              <Reveal key={item.step} delay={0.06 * i}>
                <div
                  style={{
                    padding: 'clamp(28px,3.5vw,44px) 0',
                    borderTop: `1px solid rgba(26,122,90,0.28)`,
                    display: 'flex',
                    gap: 'clamp(20px,2.5vw,36px)',
                    alignItems: 'baseline',
                  }}
                >
                  <span
                    style={{
                      fontFamily: SANS,
                      fontWeight: 800,
                      fontSize: 'clamp(28px,3vw,44px)',
                      color: 'rgba(26,122,90,0.45)',
                      lineHeight: 1,
                      minWidth: 56,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {item.step}
                  </span>
                  <div>
                    <h4
                      style={{
                        fontFamily: SANS,
                        fontWeight: 700,
                        fontSize: 'clamp(17px,1.8vw,22px)',
                        color: C.white,
                        margin: '0 0 10px',
                        lineHeight: 1.2,
                      }}
                    >
                      {item.title}
                    </h4>
                    <p
                      style={{
                        fontFamily: SERIF,
                        fontStyle: 'italic',
                        fontSize: 'clamp(14px,1.4vw,17px)',
                        lineHeight: 1.7,
                        color: 'rgba(200,230,216,0.68)',
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
        @media (max-width: 860px){
          .ka-methpanel{ grid-template-columns: 1fr !important; }
          .ka-methpanel-sticky{ position: static !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   REVIEWS — 3 avis patients, étoiles accent, fond clair
   ════════════════════════════════════════════════════════════════════════════ */
function ReviewCard({ rev, i }: { rev: Review; i: number }) {
  const card: React.CSSProperties = {
    background: C.bgCard,
    border: `1px solid ${C.border}`,
    padding: 'clamp(28px,3.5vw,44px)',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    boxSizing: 'border-box',
    boxShadow: '0 16px 48px -32px rgba(12,30,26,0.14)',
    borderRadius: 3,
  };
  return (
    <Reveal delay={i * 0.1} style={{ height: '100%' }}>
      <figure style={card}>
        <Quote size={30} color={C.accent} strokeWidth={1.4} />
        <div style={{ display: 'flex', gap: 3, margin: '18px 0 16px' }}>
          {Array.from({ length: 5 }).map((_, s) => (
            <Star key={s} size={14} fill={C.accent} color={C.accent} strokeWidth={0} />
          ))}
        </div>
        <blockquote
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 'clamp(16px,1.6vw,19px)',
            lineHeight: 1.68,
            color: C.ink,
            margin: '0 0 28px',
            flex: 1,
          }}
        >
          &ldquo;{rev.quote}&rdquo;
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
              fontWeight: 700,
              fontSize: 'clamp(15px,1.5vw,18px)',
              color: C.ink,
            }}
          >
            {rev.name}
          </div>
          <div
            style={{
              fontFamily: SANS,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: C.textFaint,
              marginTop: 5,
            }}
          >
            {rev.role}
          </div>
        </figcaption>
      </figure>
    </Reveal>
  );
}

function Reviews() {
  const sec: React.CSSProperties = {
    background: C.bg,
    padding: 'clamp(90px,12vw,160px) clamp(24px,6vw,96px)',
  };
  return (
    <section style={sec} id="avis">
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ marginBottom: 'clamp(48px,6vw,76px)', textAlign: 'center' }}>
          <Reveal>
            <Eyebrow color={C.accent} align="center">
              Témoignages
            </Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2
              style={{
                fontFamily: SANS,
                fontWeight: 800,
                fontSize: 'clamp(32px,5vw,68px)',
                color: C.ink,
                margin: 'clamp(16px,2vw,24px) 0 0',
                lineHeight: 1.06,
                letterSpacing: '-0.02em',
              }}
            >
              Ce que disent nos{' '}
              <span style={{ color: C.accent }}>patients</span>
            </h2>
          </Reveal>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 'clamp(20px,2.8vw,36px)',
          }}
        >
          {REVIEWS.map((rev, i) => (
            <ReviewCard key={rev.name} rev={rev} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   BOOKING FORM — Fond sombre, champs underline, état envoyé
   ════════════════════════════════════════════════════════════════════════════ */
function BookingForm() {
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [tel, setTel] = useState('');
  const [motif, setMotif] = useState('');
  const [dispos, setDispos] = useState('');
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prenom || !email || !tel || !motif) return;
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
    borderBottom: `1px solid rgba(26,122,90,0.45)`,
    padding: '16px 2px',
    fontFamily: SERIF,
    fontSize: 18,
    color: C.white,
    outline: 'none',
    transition: 'border-color .3s',
    borderRadius: 0,
    WebkitAppearance: 'none',
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 10.5,
    fontWeight: 700,
    letterSpacing: '0.26em',
    textTransform: 'uppercase',
    color: C.textFaint,
    display: 'block',
    marginBottom: 4,
  };

  return (
    <section style={sec} id="rdv">
      {/* Image de fond subtile */}
      <img
        src={PHOTO.hero}
        alt=""
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
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 'clamp(34px,5.5vw,72px)',
              color: C.white,
              margin: 'clamp(18px,2.5vw,32px) 0 clamp(14px,2vw,22px)',
              lineHeight: 1.06,
              letterSpacing: '-0.02em',
            }}
          >
            Commençons{' '}
            <span style={{ color: C.accentLight }}>ensemble</span>
          </h2>
        </Reveal>
        <Reveal delay={0.14}>
          <p
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: 'clamp(16px,1.7vw,20px)',
              lineHeight: 1.7,
              color: 'rgba(200,230,216,0.78)',
              maxWidth: 540,
              margin: '0 auto clamp(44px,6vw,72px)',
            }}
          >
            Remplissez ce formulaire et nous vous contacterons sous 24h pour confirmer votre premier rendez-vous.
          </p>
        </Reveal>

        {sent ? (
          <Reveal>
            <div
              style={{
                border: `1px solid rgba(26,122,90,0.5)`,
                padding: 'clamp(40px,6vw,64px)',
                background: 'rgba(26,122,90,0.08)',
                borderRadius: 4,
              }}
            >
              <CheckCircle2
                size={48}
                color={C.accentLight}
                strokeWidth={1.4}
                style={{ marginBottom: 20 }}
              />
              <h3
                style={{
                  fontFamily: SANS,
                  fontWeight: 800,
                  fontSize: 'clamp(24px,3vw,36px)',
                  color: C.white,
                  margin: '0 0 14px',
                  letterSpacing: '-0.01em',
                }}
              >
                Merci, {prenom} !
              </h3>
              <p
                style={{
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  fontSize: 17,
                  color: 'rgba(200,230,216,0.75)',
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                Votre demande de rendez-vous pour{' '}
                <strong style={{ color: C.accentLight, fontStyle: 'normal' }}>
                  {motif}
                </strong>{' '}
                a bien été reçue. Nous vous répondrons à{' '}
                <strong style={{ color: C.accentLight, fontStyle: 'normal' }}>
                  {email}
                </strong>{' '}
                sous 24h.
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
              noValidate
            >
              <div>
                <label style={labelStyle} htmlFor="ka-prenom">
                  Prénom *
                </label>
                <input
                  id="ka-prenom"
                  style={fieldBase}
                  type="text"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  placeholder="Marie"
                  autoComplete="given-name"
                  required
                />
              </div>

              <div>
                <label style={labelStyle} htmlFor="ka-email">
                  Adresse e-mail *
                </label>
                <input
                  id="ka-email"
                  style={fieldBase}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="marie@exemple.fr"
                  autoComplete="email"
                  required
                />
              </div>

              <div>
                <label style={labelStyle} htmlFor="ka-tel">
                  Téléphone *
                </label>
                <input
                  id="ka-tel"
                  style={fieldBase}
                  type="tel"
                  value={tel}
                  onChange={(e) => setTel(e.target.value)}
                  placeholder="06 12 34 56 78"
                  autoComplete="tel"
                  required
                />
              </div>

              <div>
                <label style={labelStyle} htmlFor="ka-motif">
                  Motif de consultation *
                </label>
                <select
                  id="ka-motif"
                  style={{
                    ...fieldBase,
                    cursor: 'pointer',
                    color: motif ? C.white : 'rgba(255,255,255,0.38)',
                  }}
                  value={motif}
                  onChange={(e) => setMotif(e.target.value)}
                  required
                >
                  <option value="" style={{ color: '#111', background: '#fff' }}>
                    Choisir un motif…
                  </option>
                  <option value="Rééducation post-opératoire" style={{ color: '#111', background: '#fff' }}>
                    Rééducation post-opératoire
                  </option>
                  <option value="Lombalgie" style={{ color: '#111', background: '#fff' }}>
                    Lombalgie
                  </option>
                  <option value="Cervicalgie" style={{ color: '#111', background: '#fff' }}>
                    Cervicalgie
                  </option>
                  <option value="Sportif" style={{ color: '#111', background: '#fff' }}>
                    Sportif
                  </option>
                  <option value="Autre" style={{ color: '#111', background: '#fff' }}>
                    Autre
                  </option>
                </select>
              </div>

              <div>
                <label style={labelStyle} htmlFor="ka-dispos">
                  Disponibilités
                </label>
                <textarea
                  id="ka-dispos"
                  style={{
                    ...fieldBase,
                    resize: 'vertical',
                    minHeight: 90,
                    fontFamily: SERIF,
                    fontSize: 16,
                  }}
                  value={dispos}
                  onChange={(e) => setDispos(e.target.value)}
                  placeholder="Ex : mardis matin, vendredi après-midi..."
                />
              </div>

              <div style={{ textAlign: 'center', marginTop: 8 }}>
                <GreenButton filled dark type="submit">
                  Envoyer ma demande
                </GreenButton>
              </div>
            </form>
          </Reveal>
        )}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   FOOTER — bgDark, grille 4 colonnes
   ════════════════════════════════════════════════════════════════════════════ */
function Footer() {
  const COLS: { title: string; items: { label: string; href: string }[] }[] = [
    {
      title: 'Spécialités',
      items: [
        { label: 'Rééducation post-op', href: '#specialites' },
        { label: 'Lombalgie & Cervicalgie', href: '#specialites' },
        { label: 'Kiné du sport', href: '#specialites' },
        { label: 'Thérapie manuelle', href: '#specialites' },
      ],
    },
    {
      title: 'Cabinet',
      items: [
        { label: 'Notre approche', href: '#equipe' },
        { label: "L'équipe", href: '#equipe' },
        { label: 'Notre méthode', href: '#methode' },
        { label: 'Témoignages', href: '#avis' },
      ],
    },
    {
      title: 'Pratique',
      items: [
        { label: 'Prendre RDV', href: '#rdv' },
        { label: 'Horaires', href: '#rdv' },
        { label: 'Accès & Contact', href: '#rdv' },
        { label: 'Remboursement', href: '#rdv' },
      ],
    },
  ];

  const foot: React.CSSProperties = {
    background: C.bgDarkAlt,
    borderTop: `1px solid rgba(26,122,90,0.2)`,
    padding: 'clamp(64px,9vw,110px) clamp(24px,6vw,96px) 40px',
  };

  return (
    <footer id="contact" style={foot}>
      <div
        className="ka-footgrid"
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.4fr repeat(3, 1fr)',
          gap: 'clamp(32px,5vw,70px)',
        }}
      >
        {/* Colonne marque */}
        <div>
          <div
            style={{
              fontFamily: SERIF,
              fontWeight: 700,
              fontSize: 'clamp(18px,2vw,24px)',
              color: C.white,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <Leaf size={20} color={C.accentLight} strokeWidth={1.6} />
            Kiné Atlantique
          </div>
          <p
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: 'clamp(14px,1.4vw,17px)',
              lineHeight: 1.7,
              color: 'rgba(200,230,216,0.62)',
              marginTop: 20,
              maxWidth: 320,
            }}
          >
            Cabinet pluridisciplinaire de kinésithérapie au cœur de Rennes. Bilan personnalisé, suivi rigoureux.
          </p>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginTop: 20,
              fontFamily: SANS,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'rgba(200,230,216,0.5)',
            }}
          >
            <MapPin size={13} color={C.accent} strokeWidth={2} />
            Rennes, Bretagne
          </div>
          <div
            style={{
              marginTop: 28,
            }}
          >
            <a href="#rdv" style={{ textDecoration: 'none' }}>
              <GreenButton dark>
                Prendre RDV
              </GreenButton>
            </a>
          </div>
        </div>

        {/* Colonnes liens */}
        {COLS.map((col) => (
          <div key={col.title}>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 10.5,
                fontWeight: 700,
                letterSpacing: '0.26em',
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
                <li key={item.label}>
                  <a
                    href={item.href}
                    style={{
                      fontFamily: SANS,
                      fontSize: 'clamp(14px,1.4vw,16px)',
                      fontWeight: 400,
                      color: 'rgba(200,230,216,0.68)',
                      textDecoration: 'none',
                      transition: 'color .3s',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color = C.accentLight;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(200,230,216,0.68)';
                    }}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Barre inférieure */}
      <div
        style={{
          maxWidth: 1280,
          margin: 'clamp(56px,7vw,80px) auto 0',
          paddingTop: 28,
          borderTop: `1px solid rgba(26,122,90,0.15)`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 14,
          fontFamily: SANS,
          fontSize: 11,
          fontWeight: 400,
          letterSpacing: '0.10em',
          color: 'rgba(200,230,216,0.4)',
        }}
      >
        <span>
          © 2026 Centre Kiné Atlantique — Kinésithérapie à Rennes
        </span>
        <span style={{ display: 'flex', gap: 24 }}>
          <a href="#rdv" style={{ color: 'inherit', textDecoration: 'none' }}>
            Mentions légales
          </a>
          <a href="#rdv" style={{ color: 'inherit', textDecoration: 'none' }}>
            Confidentialité
          </a>
          <a href="#rdv" style={{ color: 'inherit', textDecoration: 'none' }}>
            RGPD
          </a>
        </span>
      </div>

      <style>{`
        @media (max-width: 860px){
          .ka-footgrid{ grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px){
          .ka-footgrid{ grid-template-columns: 1fr !important; }
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
    fontFamily: SANS,
    overflowX: 'hidden',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
  };

  return (
    <>
      {/* Polices Google */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link href={FONT_URL} rel="stylesheet" />

      <main style={root} suppressHydrationWarning>
        <Nav />
        <Hero />
        <Intro />
        <ProgramSequence />
        <SpecialtyCards />
        <EditorialRows />
        <MethodPanel />
        <Reviews />
        <BookingForm />
        <Footer />
      </main>
    </>
  );
}
