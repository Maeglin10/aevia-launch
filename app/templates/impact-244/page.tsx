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
import { ArrowRight, ChevronDown, Heart } from 'lucide-react';

/* ════════════════════════════════════════════════════════════════════════════
   ATELIER CÉLESTE — Wedding Planner & Design Floral · Paris 8e
   Chorégraphie de défilement éditoriale · Palettes rosées & terracotta.
   Auto-suffisant. 'use client'.
   ════════════════════════════════════════════════════════════════════════════ */

/* ── Google Fonts ─────────────────────────────────────────────────────────── */
const FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400;1,600&family=Jost:wght@300;400;500;600&display=swap';

/* ── Palette ─────────────────────────────────────────────────────────────── */
const C = {
  bg: '#fdf8f4',
  bgAlt: '#f5ede4',
  bgDark: '#1a0f0a',
  bgDarkAlt: '#120b07',
  bgCard: '#ffffff',
  accent: '#c9826b',
  accentDark: '#a8644e',
  accentLight: '#f0d8cf',
  white: '#ffffff',
  ink: '#1a0f0a',
  textMuted: '#6b4a3a',
  textFaint: '#a08070',
  border: '#e8d4c8',
  borderDark: 'rgba(201,130,107,0.2)',
  gold: '#c4924c',
} as const;

const SERIF = "'Playfair Display', Georgia, serif";
const SANS = "'Jost', system-ui, sans-serif";

/* ── Easing partagé ──────────────────────────────────────────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ── Photo helper ────────────────────────────────────────────────────────── */
const photo = (id: string) =>
  `https://images.unsplash.com/photo-${id}?q=80&w=1600&auto=format&fit=crop`;

/* ════════════════════════════════════════════════════════════════════════════
   TypeScript interfaces
   ════════════════════════════════════════════════════════════════════════════ */
interface Collection {
  index: string;
  caption: string;
  sub: string;
  imgId: string;
  alt: string;
}

interface Service {
  title: string;
  desc: string;
  num: string;
}

interface EditRow {
  eyebrow: string;
  imgId: string;
  alt: string;
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

interface FlowerItem {
  index: string;
  title: string;
  desc: string;
}

/* ════════════════════════════════════════════════════════════════════════════
   Data
   ════════════════════════════════════════════════════════════════════════════ */

/** CelebrationSequence — 3 phases de mood */
const PHASES: Collection[] = [
  {
    index: 'I',
    caption: 'CÉRÉMONIE',
    sub: 'Chaque cérémonie est une histoire unique. Nous la racontons avec des fleurs, de la lumière et des mots qui durent.',
    imgId: '1519225421783-bda591ac3db3',
    alt: 'Fleurs romantiques de cérémonie de mariage',
  },
  {
    index: 'II',
    caption: 'RÉCEPTION',
    sub: 'De la mise en place au minuit, chaque table, chaque bougie, chaque détail porte votre vision.',
    imgId: '1511285560929-f9bf7f036830',
    alt: 'Réception de mariage élégante',
  },
  {
    index: 'III',
    caption: 'DESIGN FLORAL',
    sub: 'Compositions sur mesure, fleurs de saison, palettes chromatiques pensées pour votre univers.',
    imgId: '1478146896981-b80fe463b330',
    alt: 'Bouquet de mariée en gros plan',
  },
];

/** 6 cartes de services */
const SERVICES: Service[] = [
  {
    num: '01',
    title: 'Wedding Planner Intégral',
    desc: 'Accompagnement complet de A à Z — budget, prestataires, logistique — pour vivre votre mariage sans stress.',
  },
  {
    num: '02',
    title: 'Coordination Jour J',
    desc: 'Vous profitez de chaque instant. Nous veillons à ce que tout se déroule exactement comme prévu.',
  },
  {
    num: '03',
    title: 'Design & Décoration',
    desc: 'Scénographie, moodboard, mobilier, lumières : nous créons une atmosphère unique qui vous ressemble.',
  },
  {
    num: '04',
    title: 'Art Floral',
    desc: 'Compositions florales sur mesure, bouquets, arches, centres de table — signature végétale de votre journée.',
  },
  {
    num: '05',
    title: 'Mise en Scène Photo',
    desc: 'Stylisme de scènes et de détails pour que vos photos racontent la même histoire que vous.',
  },
  {
    num: '06',
    title: 'Événements Privés',
    desc: 'Fiançailles, anniversaires, dîners de gala : nous orchestrons chaque célébration avec la même exigence.',
  },
];

/** 2 rangées éditoriales */
const EDIT_ROWS: EditRow[] = [
  {
    eyebrow: 'Notre démarche',
    imgId: '1519225421783-bda591ac3db3',
    alt: 'Cérémonie de mariage en fleurs',
    title: (
      <>
        Un mariage{' '}
        <span style={{ fontStyle: 'italic' }}>à votre image.</span>
      </>
    ),
    body: "Nous commençons toujours par écouter. Pas de formule, pas de modèle imposé. Chaque couple est unique, et c'est cette singularité qui guide chacune de nos décisions — du choix du lieu à la couleur des rubans sur les bouquets. Notre rôle : traduire fidèlement qui vous êtes en une journée inoubliable.",
    reverse: false,
    numeral: 'I',
  },
  {
    eyebrow: 'Paris & environs',
    imgId: '1511285560929-f9bf7f036830',
    alt: 'Réception élégante en Île-de-France',
    title: (
      <>
        Île-de-France{' '}
        <span style={{ fontStyle: 'italic' }}>et destination.</span>
      </>
    ),
    body: "Ancrés à Paris 8e, nous intervenons dans toute l'Île-de-France — châteaux, hôtels particuliers, domaines — mais aussi en Loire, sur la Côte d'Azur et à l'international. La distance n'est jamais un obstacle à la perfection.",
    reverse: true,
    numeral: 'II',
  },
];

/** 4 piliers de design floral */
const FLORAL_ITEMS: FlowerItem[] = [
  {
    index: 'I',
    title: 'Palette chromatique & Moodboard personnalisé',
    desc: "Chaque projet commence par un moodboard sur mesure qui capture l'ambiance, les couleurs et les textures qui vous correspondent.",
  },
  {
    index: 'II',
    title: 'Fleurs de saison & Fournisseurs artisanaux',
    desc: 'Nous travaillons exclusivement avec des fleuristes et producteurs locaux pour des compositions vivantes, naturelles et responsables.',
  },
  {
    index: 'III',
    title: 'Compositions free-form pour cérémonie & réception',
    desc: 'Arches organiques, centres de table libres, installations florales monumentales — chaque pièce est unique et réalisée le matin même.',
  },
  {
    index: 'IV',
    title: 'Fleurs séchées, préservées & alternatives durables',
    desc: 'Pour ceux qui souhaitent garder un souvenir vivant ou opter pour une approche plus durable, nous proposons de belles alternatives.',
  },
];

/** 2 témoignages de couples */
const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Atelier Céleste a transformé notre mariage au Château de Vaux-le-Vicomte en quelque chose d'absolument magique. Leur obsession du détail — chaque fleur, chaque bougie, chaque ruban — était visible. Nous vivions pleinement notre journée pendant qu'ils veillaient sur tout.",
    name: 'Sophie & Alexandre M.',
    role: 'Mariés à Vaux-le-Vicomte · Paris',
  },
  {
    quote:
      "Nous étions à Lyon et voulions un mariage en destination sur la Côte d'Azur. La coordination à distance d'Atelier Céleste a été sans faille. Les retours étaient toujours rapides, précis et rassurants. Le jour J a dépassé tout ce que nous imaginions.",
    name: 'Camille & Thomas R.',
    role: "Mariage en destination · Côte d'Azur",
  },
];

/* ════════════════════════════════════════════════════════════════════════════
   Primitives
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
  const label: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 11,
    letterSpacing: '0.38em',
    textTransform: 'uppercase',
    color,
    fontWeight: 500,
  };
  return (
    <div style={wrap}>
      <span style={rule} />
      <span style={label}>{children}</span>
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
      transition={{ duration: 1.1, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

function AccentButton({
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
    fontSize: 11.5,
    letterSpacing: '0.24em',
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
      : { background: 'rgba(201,130,107,0.08)', transform: 'translateY(-2px)' }
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
   Nav
   ════════════════════════════════════════════════════════════════════════════ */
function Nav() {
  const [solid, setSolid] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  React.useEffect(() => {
    const fn = () => setSolid(window.scrollY > 72);
    fn();
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const links = [
    { label: 'Mariage', href: '#mariage' },
    { label: 'Floral', href: '#floral' },
    { label: 'À propos', href: '#apropos' },
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
    background: solid ? 'rgba(26,15,10,0.94)' : 'transparent',
    backdropFilter: solid ? 'blur(14px) saturate(110%)' : 'none',
    WebkitBackdropFilter: solid ? 'blur(14px) saturate(110%)' : 'none',
    borderBottom: solid
      ? '1px solid rgba(201,130,107,0.18)'
      : '1px solid transparent',
    transition: 'all .6s cubic-bezier(.16,1,.3,1)',
  };

  const brand: React.CSSProperties = {
    fontFamily: SERIF,
    fontSize: 20,
    letterSpacing: '0.12em',
    color: C.white,
    fontWeight: 400,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    textDecoration: 'none',
  };

  const dot: React.CSSProperties = {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: C.accent,
    display: 'inline-block',
    flexShrink: 0,
  };

  return (
    <>
      <nav style={bar}>
      <a href="#apropos" style={brand}>
        Atelier Céleste
        <span style={dot} />
      </a>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(18px,2.4vw,36px)' }} className="ac-navlinks">
        {links.map((l) => (
          <NavLink key={l.label} label={l.label} href={l.href} />
        ))}
      </div>

      <div className="ac-navcta">
        <a href="#contact" style={{ textDecoration: 'none' }}>
          <AccentButton filled>Commencer</AccentButton>
        </a>
      </div>

      
        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="ac-burger"
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
          .ac-navlinks{ display:none !important; }
          .ac-burger { display: flex !important; flex-direction: column; }
          .ac-navcta{ display:none !important; }
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
        fontSize: 11.5,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: h ? C.accent : 'rgba(255,255,255,0.88)',
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
   Hero — parallaxe 100vh
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
  const cueOpacity = useTransform(scrollYProgress, [0, 0.16], [1, 0]);

  return (
    <section id="hero"
      ref={ref}
      style={{
        position: 'relative',
        height: '100vh',
        minHeight: 640,
        overflow: 'hidden',
        background: C.bgDark,
      }}
    >
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
          src={`https://images.unsplash.com/photo-1519225421783-bda591ac3db3?q=80&w=2000&auto=format&fit=crop`}
          alt="Cérémonie de mariage romantique fleurie"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </motion.div>

      {/* Voiles */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(26,15,10,0.52) 0%, rgba(26,15,10,0.08) 40%, rgba(26,15,10,0.52) 75%, rgba(26,15,10,0.82) 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(110% 70% at 50% 40%, transparent 40%, rgba(26,15,10,0.38) 100%)',
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
          padding: '0 clamp(24px,6vw,80px)',
          y: titleY,
          opacity: titleOpacity,
        }}
      >
        <Reveal y={16}>
          <Eyebrow color="rgba(240,216,207,0.88)" align="center">
            Wedding Planner & Design Floral · Paris
          </Eyebrow>
        </Reveal>

        <motion.h1
          initial={{ opacity: 0, y: 44 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: EASE, delay: 0.14 }}
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontWeight: 400,
            color: C.white,
            fontSize: 'clamp(3rem,7vw,8rem)',
            lineHeight: 0.96,
            letterSpacing: '-0.01em',
            margin: '28px 0 20px',
            textShadow: '0 12px 64px rgba(0,0,0,0.44)',
          }}
        >
          L&apos;art d&apos;un&nbsp;/
          <br />
          mariage parfait.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.45 }}
          style={{
            fontFamily: SANS,
            fontWeight: 300,
            fontSize: 'clamp(15px,1.8vw,20px)',
            color: 'rgba(255,255,255,0.82)',
            maxWidth: 520,
            lineHeight: 1.7,
          }}
        >
          Atelier Céleste orchestre vos plus belles célébrations avec une obsession : que chaque détail soit à votre image.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.7 }}
          style={{ marginTop: 42 }}
        >
          <AccentButton filled>Imaginer notre mariage</AccentButton>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
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
          gap: 8,
          opacity: cueOpacity,
        }}
      >
        <span
          style={{
            fontFamily: SANS,
            fontSize: 10,
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.66)',
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
   Intro — citation centrale
   ════════════════════════════════════════════════════════════════════════════ */
function Intro() {
  return (
    <section
      style={{
        background: C.bgAlt,
        padding: 'clamp(96px,14vw,196px) clamp(24px,8vw,140px)',
        textAlign: 'center',
      }}
      id="apropos"
    >
      <Reveal>
        <p
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontWeight: 400,
            fontSize: 'clamp(26px,3.8vw,52px)',
            lineHeight: 1.34,
            color: C.ink,
            maxWidth: 900,
            margin: '0 auto',
          }}
        >
          &ldquo;Un mariage ne se déroule qu&apos;une fois.
          <br />
          Il mérite d&apos;être parfait.&rdquo;
        </p>
      </Reveal>
      <Reveal delay={0.18}>
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
   CelebrationSequence — crossfade 320vh
   ════════════════════════════════════════════════════════════════════════════ */
function PhaseImage({
  phase,
  i,
  total,
  progress,
}: {
  phase: Collection;
  i: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const seg = 1 / total;
  const start = i * seg;
  const end = start + seg;
  const fade = seg * 0.28;

  const opacity = useTransform(
    progress,
    [Math.max(0, start - fade), start, end - fade, Math.min(1, end)],
    i === 0
      ? [1, 1, 1, 0]
      : i === total - 1
        ? [0, 1, 1, 1]
        : [0, 1, 1, 0],
  );
  const scale = useTransform(progress, [start - fade, end], [1.1, 1.0]);

  return (
    <motion.div style={{ position: 'absolute', inset: 0, opacity }}>
      <motion.img
        src={photo(phase.imgId)}
        alt={phase.alt}
        loading="lazy"
        style={{ width: '100%', height: '100%', objectFit: 'cover', scale }}
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
  phase: Collection;
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
      {/* Eyebrow section label — top right */}
      <div
        style={{
          position: 'absolute',
          top: 'clamp(90px,12vh,120px)',
          right: 'clamp(24px,4vw,56px)',
          fontFamily: SANS,
          fontSize: 10,
          letterSpacing: '0.36em',
          textTransform: 'uppercase',
          color: 'rgba(240,216,207,0.72)',
          fontWeight: 500,
        }}
      >
        Atelier Céleste · {phase.caption}
      </div>

      {/* Roman numeral ghost */}
      <span
        style={{
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontSize: 'clamp(48px,10vw,128px)',
          color: 'rgba(201,130,107,0.28)',
          lineHeight: 1,
          marginBottom: 4,
        }}
      >
        {phase.index}
      </span>

      <h2
        style={{
          fontFamily: SERIF,
          fontWeight: 400,
          fontSize: 'clamp(38px,6.5vw,88px)',
          color: C.white,
          lineHeight: 1,
          margin: 0,
          letterSpacing: '0.14em',
          textShadow: '0 8px 40px rgba(0,0,0,0.48)',
        }}
      >
        {phase.caption}
      </h2>
      <p
        style={{
          fontFamily: SANS,
          fontWeight: 300,
          fontSize: 'clamp(14px,1.6vw,19px)',
          color: 'rgba(255,255,255,0.82)',
          marginTop: 18,
          maxWidth: 520,
          lineHeight: 1.72,
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
    [0.28, 1, 1, 0.28],
  );
  const width = useTransform(progress, [i * seg, (i + 1) * seg], [10, 32]);
  return (
    <motion.div
      style={{ height: 2, width, background: C.accent, opacity, borderRadius: 1 }}
    />
  );
}

function CelebrationSequence() {
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
      id="mariage"
    >
      <div
        style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}
      >
        {/* Phase images */}
        {PHASES.map((p, i) => (
          <PhaseImage
            key={p.caption}
            phase={p}
            i={i}
            total={PHASES.length}
            progress={progress}
          />
        ))}

        {/* Voile */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to bottom, rgba(26,15,10,0.34), rgba(26,15,10,0.08) 42%, rgba(26,15,10,0.56))',
          }}
        />

        {/* Captions */}
        {PHASES.map((p, i) => (
          <PhaseCaption
            key={p.caption}
            phase={p}
            i={i}
            total={PHASES.length}
            progress={progress}
          />
        ))}

        {/* Progress dots */}
        <div
          style={{
            position: 'absolute',
            bottom: 38,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 10,
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
   ServiceCards — 6 cartes
   ════════════════════════════════════════════════════════════════════════════ */
function ServiceCard({ s, i }: { s: Service; i: number }) {
  const [hover, setHover] = useState(false);
  return (
    <Reveal delay={i * 0.08} style={{ height: '100%' }}>
      <article
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          background: C.bgCard,
          borderLeft: `3px solid ${hover ? C.accent : C.border}`,
          padding: 'clamp(28px,3.5vw,44px)',
          height: '100%',
          boxSizing: 'border-box',
          boxShadow: hover
            ? '0 24px 60px -28px rgba(201,130,107,0.28)'
            : '0 8px 32px -20px rgba(26,15,10,0.10)',
          transform: hover ? 'translateY(-8px)' : 'none',
          transition: 'all .55s cubic-bezier(.16,1,.3,1)',
        }}
      >
        <div
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 44,
            color: hover ? C.accent : C.border,
            lineHeight: 1,
            marginBottom: 16,
            transition: 'color .4s',
          }}
        >
          {s.num}
        </div>
        <h3
          style={{
            fontFamily: SERIF,
            fontSize: 'clamp(19px,2vw,24px)',
            fontWeight: 400,
            color: C.ink,
            margin: '0 0 12px',
          }}
        >
          {s.title}
        </h3>
        <p
          style={{
            fontFamily: SANS,
            fontWeight: 300,
            fontSize: 15,
            lineHeight: 1.72,
            color: C.textMuted,
            margin: 0,
          }}
        >
          {s.desc}
        </p>
      </article>
    </Reveal>
  );
}

function ServiceCards() {
  return (
    <section
      style={{
        background: C.bg,
        padding: 'clamp(90px,12vw,170px) clamp(24px,6vw,96px)',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ maxWidth: 720, marginBottom: 'clamp(52px,7vw,88px)' }}>
          <Reveal>
            <Eyebrow>Nos Services</Eyebrow>
          </Reveal>
          <Reveal delay={0.1}>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(36px,5.5vw,72px)',
                fontWeight: 400,
                color: C.ink,
                margin: '20px 0 0',
                lineHeight: 1.06,
              }}
            >
              Tout ce dont votre{' '}
              <span style={{ fontStyle: 'italic', color: C.accent }}>
                mariage a besoin
              </span>
            </h2>
          </Reveal>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'clamp(20px,2.4vw,32px)',
          }}
        >
          {SERVICES.map((s, i) => (
            <ServiceCard key={s.num} s={s} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   EditorialRows — 2 rangées image / texte alternées
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
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(36px,6vw,88px)', alignItems: 'center' }} className="ac-editrow">
      {/* Image */}
      <Reveal
        y={48}
        style={{
          overflow: 'hidden',
          order: row.reverse ? 2 : 1,
          aspectRatio: '4 / 5',
          position: 'relative',
        }}
      >
        <ParallaxImg src={`https://images.unsplash.com/photo-${row.imgId}?q=80&w=800&auto=format&fit=crop`} alt={row.alt} />
        {/* Ghost numeral behind */}
        <span
          style={{
            position: 'absolute',
            bottom: -18,
            left: row.reverse ? 'auto' : -20,
            right: row.reverse ? -20 : 'auto',
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 'clamp(72px,9vw,130px)',
            color: 'rgba(201,130,107,0.10)',
            lineHeight: 1,
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          {row.numeral}
        </span>
      </Reveal>

      {/* Texte */}
      <div style={{ order: row.reverse ? 1 : 2 }}>
        <Reveal>
          <Eyebrow>{row.eyebrow}</Eyebrow>
        </Reveal>
        <Reveal delay={0.1}>
          <h3
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(30px,4.2vw,58px)',
              fontWeight: 400,
              color: C.ink,
              margin: '20px 0 22px',
              lineHeight: 1.1,
            }}
          >
            {row.title}
          </h3>
        </Reveal>
        <Reveal delay={0.18}>
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
        <Reveal delay={0.28}>
          <div style={{ marginTop: 34 }}>
            <AccentButton>En savoir plus</AccentButton>
          </div>
        </Reveal>
      </div>

      <style>{`
        @media (max-width: 860px){
          .ac-editrow{ grid-template-columns: 1fr !important; }
          .ac-editrow > *{ order: initial !important; }
        }
      `}</style>
    </div>
  );
}

function EditorialRows() {
  return (
    <section
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
        {EDIT_ROWS.map((r) => (
          <EditRowItem key={r.eyebrow} row={r} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   FloralPanel — panneau collant image gauche / piliers droite
   ════════════════════════════════════════════════════════════════════════════ */
function FloralPanel() {
  return (
    <section
      style={{
        background: C.bgDark,
        padding: 'clamp(80px,11vw,150px) clamp(24px,6vw,96px)',
      }}
      id="floral"
    >
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '0.95fr 1.05fr',
          gap: 'clamp(40px,6vw,96px)',
          alignItems: 'start',
        }}
        className="ac-floralpanel"
      >
        {/* Image collante */}
        <div
          style={{
            position: 'sticky',
            top: 100,
            alignSelf: 'start',
          }}
          className="ac-floralpanel-sticky"
        >
          <div
            style={{
              overflow: 'hidden',
              border: `1px solid ${C.borderDark}`,
              aspectRatio: '3 / 4',
            }}
          >
            <img
              src={`https://images.unsplash.com/photo-1478146896981-b80fe463b330?q=80&w=900&auto=format&fit=crop`}
              alt="Bouquet de mariée artisanal"
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
          <div
            style={{
              marginTop: 22,
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: 17,
              color: 'rgba(240,216,207,0.7)',
              lineHeight: 1.6,
            }}
          >
            &ldquo;Des fleurs qui parlent de vous, cueillies pour vous.&rdquo;
          </div>
        </div>

        {/* Piliers qui défilent */}
        <div>
          <Reveal>
            <Eyebrow color={C.accent}>Design Floral</Eyebrow>
          </Reveal>
          <Reveal delay={0.1}>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(32px,4.8vw,64px)',
                fontWeight: 400,
                color: C.white,
                margin: '20px 0 52px',
                lineHeight: 1.06,
              }}
            >
              Notre approche{' '}
              <span style={{ fontStyle: 'italic', color: C.accent }}>
                végétale
              </span>
            </h2>
          </Reveal>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {FLORAL_ITEMS.map((item, i) => (
              <Reveal key={item.index} delay={0.06 * i}>
                <div
                  style={{
                    padding: 'clamp(28px,3.5vw,44px) 0',
                    borderTop: `1px solid rgba(201,130,107,0.22)`,
                    display: 'flex',
                    gap: 28,
                    alignItems: 'flex-start',
                  }}
                >
                  <span
                    style={{
                      fontFamily: SERIF,
                      fontStyle: 'italic',
                      fontSize: 22,
                      color: C.gold,
                      minWidth: 30,
                      lineHeight: 1.2,
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    {item.index}
                  </span>
                  <div>
                    <h4
                      style={{
                        fontFamily: SERIF,
                        fontSize: 'clamp(17px,1.8vw,22px)',
                        fontWeight: 400,
                        color: C.white,
                        margin: '0 0 10px',
                      }}
                    >
                      {item.title}
                    </h4>
                    <p
                      style={{
                        fontFamily: SANS,
                        fontWeight: 300,
                        fontSize: 15,
                        lineHeight: 1.74,
                        color: 'rgba(240,216,207,0.68)',
                        margin: 0,
                      }}
                    >
                      {item.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
            {/* Dernière bordure */}
            <div style={{ borderTop: `1px solid rgba(201,130,107,0.22)` }} />
          </div>

          <Reveal delay={0.3}>
            <div style={{ marginTop: 48 }}>
              <AccentButton>Voir nos créations</AccentButton>
            </div>
          </Reveal>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px){
          .ac-floralpanel{ grid-template-columns: 1fr !important; }
          .ac-floralpanel-sticky{ position: static !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   Testimonials
   ════════════════════════════════════════════════════════════════════════════ */
function Testimonials() {
  return (
    <section
      style={{
        background: C.bgAlt,
        padding: 'clamp(90px,12vw,168px) clamp(24px,6vw,96px)',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(52px,7vw,88px)' }}>
          <Reveal>
            <Eyebrow color={C.accentDark} align="center">
              Témoignages
            </Eyebrow>
          </Reveal>
          <Reveal delay={0.1}>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(32px,4.8vw,64px)',
                fontWeight: 400,
                color: C.ink,
                margin: '20px 0 0',
              }}
            >
              Ils nous ont fait{' '}
              <span style={{ fontStyle: 'italic', color: C.accent }}>confiance</span>
            </h2>
          </Reveal>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'clamp(28px,3.6vw,52px)',
          }}
        >
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.14} style={{ height: '100%' }}>
              <figure
                style={{
                  background: C.white,
                  border: `1px solid ${C.border}`,
                  padding: 'clamp(34px,4vw,52px)',
                  margin: 0,
                  height: '100%',
                  boxSizing: 'border-box',
                  boxShadow: '0 20px 56px -36px rgba(201,130,107,0.32)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Heart
                  size={30}
                  fill={C.accentLight}
                  color={C.accent}
                  strokeWidth={1.2}
                />
                <blockquote
                  style={{
                    fontFamily: SERIF,
                    fontStyle: 'italic',
                    fontSize: 'clamp(17px,1.9vw,21px)',
                    lineHeight: 1.66,
                    color: C.ink,
                    margin: '22px 0 28px',
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
                      fontWeight: 600,
                      color: C.accentDark,
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
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   ContactForm
   ════════════════════════════════════════════════════════════════════════════ */
type FormData = {
  prenom: string;
  email: string;
  tel: string;
  ceremonie: string;
  date: string;
  budget: string;
  message: string;
};

function ContactForm() {
  const [form, setForm] = useState<FormData>({
    prenom: '',
    email: '',
    tel: '',
    ceremonie: '',
    date: '',
    budget: '',
    message: '',
  });
  const [sent, setSent] = useState(false);

  const set = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.prenom || !form.email) return;
    setSent(true);
  };

  const fieldBase: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid rgba(201,130,107,0.35)',
    padding: '14px 2px',
    fontFamily: SERIF,
    fontSize: 17,
    color: C.white,
    outline: 'none',
    transition: 'border-color .3s',
  };

  const lbl: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 10.5,
    letterSpacing: '0.24em',
    textTransform: 'uppercase' as const,
    color: C.accent,
    display: 'block',
    marginBottom: 4,
  };

  return (
    <section
      style={{
        background: C.bgDark,
        padding: 'clamp(96px,13vw,176px) clamp(24px,6vw,96px)',
        position: 'relative',
        overflow: 'hidden',
      }}
      id="contact"
    >
      {/* Texture de fond subtile */}
      <img
        src={`https://images.unsplash.com/photo-1519225421783-bda591ac3db3?q=80&w=1600&auto=format&fit=crop`}
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
            Prenons contact
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.1}>
          <h2
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: 'clamp(36px,5.6vw,74px)',
              fontWeight: 400,
              color: C.white,
              margin: '20px 0 16px',
              lineHeight: 1.06,
            }}
          >
            Parlons de votre mariage
          </h2>
        </Reveal>
        <Reveal delay={0.18}>
          <p
            style={{
              fontFamily: SANS,
              fontWeight: 300,
              fontSize: 'clamp(15px,1.6vw,18px)',
              lineHeight: 1.74,
              color: 'rgba(255,255,255,0.72)',
              maxWidth: 480,
              margin: '0 auto 52px',
            }}
          >
            Remplissez ce formulaire et nous vous recontacterons dans les 48h pour une première conversation, sans engagement.
          </p>
        </Reveal>

        {sent ? (
          <Reveal>
            <div
              style={{
                border: `1px solid rgba(201,130,107,0.5)`,
                padding: 'clamp(38px,5vw,60px)',
                background: 'rgba(201,130,107,0.06)',
              }}
            >
              <Heart size={36} fill={C.accentLight} color={C.accent} strokeWidth={1.2} />
              <h3
                style={{
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  fontSize: 32,
                  fontWeight: 400,
                  color: C.white,
                  margin: '18px 0 12px',
                }}
              >
                Merci {form.prenom ? `${form.prenom}` : ''}, votre message est envoyé.
              </h3>
              <p
                style={{
                  fontFamily: SANS,
                  fontWeight: 300,
                  fontSize: 17,
                  color: 'rgba(255,255,255,0.72)',
                  margin: 0,
                  lineHeight: 1.7,
                }}
              >
                Nous vous contactons dans les 48h pour une première conversation. À très vite !
              </p>
            </div>
          </Reveal>
        ) : (
          <Reveal delay={0.24}>
            <form
              onSubmit={onSubmit}
              style={{ display: 'flex', flexDirection: 'column', gap: 32, textAlign: 'left' }}
            >
              {/* Prénom */}
              <div>
                <label style={lbl} htmlFor="ac-prenom">Prénom</label>
                <input
                  id="ac-prenom"
                  style={fieldBase}
                  value={form.prenom}
                  onChange={set('prenom')}
                  placeholder="Sophie"
                  autoComplete="given-name"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label style={lbl} htmlFor="ac-email">Email</label>
                <input
                  id="ac-email"
                  type="email"
                  style={fieldBase}
                  value={form.email}
                  onChange={set('email')}
                  placeholder="sophie@exemple.fr"
                  autoComplete="email"
                  required
                />
              </div>

              {/* Téléphone */}
              <div>
                <label style={lbl} htmlFor="ac-tel">Téléphone</label>
                <input
                  id="ac-tel"
                  type="tel"
                  style={fieldBase}
                  value={form.tel}
                  onChange={set('tel')}
                  placeholder="+33 6 00 00 00 00"
                  autoComplete="tel"
                />
              </div>

              {/* Type de cérémonie */}
              <div>
                <label style={lbl} htmlFor="ac-ceremonie">Type de cérémonie</label>
                <select
                  id="ac-ceremonie"
                  style={{
                    ...fieldBase,
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    cursor: 'pointer',
                    color: form.ceremonie ? C.white : 'rgba(255,255,255,0.4)',
                  }}
                  value={form.ceremonie}
                  onChange={set('ceremonie')}
                >
                  <option value="" style={{ color: '#1a0f0a', background: '#fdf8f4' }}>Choisir…</option>
                  <option value="Mariage" style={{ color: '#1a0f0a', background: '#fdf8f4' }}>Mariage</option>
                  <option value="Fiançailles" style={{ color: '#1a0f0a', background: '#fdf8f4' }}>Fiançailles</option>
                  <option value="Anniversaire" style={{ color: '#1a0f0a', background: '#fdf8f4' }}>Anniversaire</option>
                  <option value="PACS" style={{ color: '#1a0f0a', background: '#fdf8f4' }}>PACS</option>
                  <option value="Événement privé" style={{ color: '#1a0f0a', background: '#fdf8f4' }}>Événement privé</option>
                </select>
              </div>

              {/* Date souhaitée */}
              <div>
                <label style={lbl} htmlFor="ac-date">Date souhaitée</label>
                <input
                  id="ac-date"
                  type="text"
                  style={fieldBase}
                  value={form.date}
                  onChange={set('date')}
                  placeholder="Printemps 2026, été 2027…"
                />
              </div>

              {/* Budget estimé */}
              <div>
                <label style={lbl} htmlFor="ac-budget">Budget estimé</label>
                <input
                  id="ac-budget"
                  type="text"
                  style={fieldBase}
                  value={form.budget}
                  onChange={set('budget')}
                  placeholder="10 000 € – 25 000 € – 50 000 €+"
                />
              </div>

              {/* Message */}
              <div>
                <label style={lbl} htmlFor="ac-message">Message</label>
                <textarea
                  id="ac-message"
                  style={{
                    ...fieldBase,
                    resize: 'none',
                    minHeight: 120,
                    display: 'block',
                  }}
                  value={form.message}
                  onChange={set('message')}
                  placeholder="Parlez-nous de votre projet, votre vision, vos envies…"
                  rows={4}
                />
              </div>

              <div style={{ textAlign: 'center', marginTop: 8 }}>
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
   Footer
   ════════════════════════════════════════════════════════════════════════════ */
function Footer() {
  const cols: { title: string; items: string[] }[] = [
    {
      title: 'Services',
      items: ['Wedding Planner', 'Coordination Jour J', 'Design & Décoration', 'Art Floral', 'Événements Privés'],
    },
    {
      title: 'Destinations',
      items: ["Paris & \u00cele-de-France", "Loire", "C\u00f4te d'Azur", "International"],
    },
    {
      title: 'Informations',
      items: ['À propos', 'Témoignages', 'Contact', 'Mentions légales'],
    },
  ];

  return (
    <footer
      style={{
        background: C.bgDarkAlt,
        borderTop: `1px solid rgba(201,130,107,0.18)`,
        padding: 'clamp(70px,9vw,110px) clamp(24px,6vw,96px) 40px',
      }}
    >
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.4fr repeat(3, 1fr)',
          gap: 'clamp(36px,5vw,64px)',
        }}
        className="ac-footgrid"
      >
        {/* Brand */}
        <div>
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 22,
              letterSpacing: '0.10em',
              color: C.white,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            Atelier Céleste
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: C.accent,
                display: 'inline-block',
                flexShrink: 0,
              }}
            />
          </div>
          <p
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: 15.5,
              lineHeight: 1.72,
              color: 'rgba(255,255,255,0.55)',
              marginTop: 18,
              maxWidth: 300,
            }}
          >
            Wedding Planner & Design Floral. Paris 8e. Chaque mariage est une histoire qui mérite d&apos;être parfaite.
          </p>
          <div
            style={{
              marginTop: 26,
              fontFamily: SANS,
              fontSize: 11,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.45)',
            }}
          >
            Paris 8e · +33 1 00 00 00 00
          </div>
        </div>

        {/* Columns */}
        {cols.map((col) => (
          <div key={col.title}>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 10.5,
                letterSpacing: '0.26em',
                textTransform: 'uppercase',
                color: C.accent,
                marginBottom: 22,
                fontWeight: 500,
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
                gap: 13,
              }}
            >
              {col.items.map((item) => (
                <li key={item}>
                  <a
                    href="#contact"
                    style={{
                      fontFamily: SANS,
                      fontWeight: 300,
                      fontSize: 15,
                      color: 'rgba(255,255,255,0.65)',
                      textDecoration: 'none',
                      transition: 'color .3s',
                    }}
                    onMouseEnter={(e) => ((e.target as HTMLElement).style.color = C.accent)}
                    onMouseLeave={(e) => ((e.target as HTMLElement).style.color = 'rgba(255,255,255,0.65)')}
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
          margin: '64px auto 0',
          paddingTop: 26,
          borderTop: '1px solid rgba(201,130,107,0.12)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 14,
          fontFamily: SANS,
          fontSize: 11,
          letterSpacing: '0.10em',
          color: 'rgba(255,255,255,0.36)',
        }}
      >
        <span>© 2026 Atelier Céleste. Tous droits réservés.</span>
        <span style={{ display: 'flex', gap: 24 }}>
          <a href="#contact" style={{ color: 'inherit', textDecoration: 'none' }}>Mentions légales</a>
          <a href="#contact" style={{ color: 'inherit', textDecoration: 'none' }}>Confidentialité</a>
        </span>
      </div>

      <style>{`
        @media (max-width: 860px){
          .ac-footgrid{ grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 540px){
          .ac-footgrid{ grid-template-columns: 1fr !important; }
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
      <style>{`
        @import url('${FONTS_URL}');
        *, *::before, *::after { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { margin: 0; padding: 0; }
        input::placeholder, textarea::placeholder, select option[value=""] {
          color: rgba(255,255,255,0.38);
        }
        select option {
          background: #fdf8f4;
          color: #1a0f0a;
        }
        @media (max-width: 860px){
          .ac-editrow{ grid-template-columns: 1fr !important; }
          .ac-editrow > *{ order: initial !important; }
          .ac-floralpanel{ grid-template-columns: 1fr !important; }
          .ac-floralpanel-sticky{ position: static !important; }
        }
      `}</style>
      <main
        suppressHydrationWarning
        style={{
          background: C.bg,
          color: C.ink,
          fontFamily: SANS,
          overflowX: 'hidden',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        }}
      >
        <Nav />
        <Hero />
        <Intro />
        <CelebrationSequence />
        <ServiceCards />
        <EditorialRows />
        <FloralPanel />
        <Testimonials />
        <ContactForm />
        <Footer />
      </main>
    </>
  );
}
