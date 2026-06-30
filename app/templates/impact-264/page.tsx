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
import { ArrowRight, ChevronDown, Heart, MapPin } from 'lucide-react';

/* ════════════════════════════════════════════════════════════════════════════
   OSTÉO ATLANTIQUE — Cabinet d'Ostéopathie & Thérapies Manuelles · Nantes
   Chorégraphie de défilement éditoriale. Auto-suffisant. 'use client'.
   ════════════════════════════════════════════════════════════════════════════ */

/* ── Polices Google ──────────────────────────────────────────────────────── */
const FONTS_HREF =
  'https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400;1,600&family=Poppins:wght@300;400;500;600&display=swap';

/* ── Palette ─────────────────────────────────────────────────────────────── */
const C = {
  bg: '#f5f8f6',
  bgAlt: '#e8f0ec',
  bgDark: '#0a1810',
  bgDarkAlt: '#060e08',
  bgCard: '#ffffff',
  accent: '#2e7a5e',
  accentDark: '#206048',
  accentLight: '#c0dcd0',
  white: '#ffffff',
  ink: '#0a1810',
  textMuted: '#204830',
  textFaint: '#60887a',
  border: '#b8d4c8',
  borderDark: 'rgba(46,122,94,0.2)',
  sand: '#c8a870',
} as const;

const SERIF = "'Lora', Georgia, serif" as const;
const SANS = "'Poppins', system-ui, sans-serif" as const;

/* ── Easing partagé ──────────────────────────────────────────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ── Unsplash helper ─────────────────────────────────────────────────────── */
const photo = (id: string) =>
  `https://images.unsplash.com/photo-${id}?q=80&w=1600&auto=format&fit=crop`;

/* ── Types ───────────────────────────────────────────────────────────────── */
interface Domain {
  img: string;
  index: string;
  title: string;
  body: string;
}

interface Specialty {
  label: string;
}

interface EditRow {
  eyebrow: string;
  img: string;
  titleNode: React.ReactNode;
  body: string;
  reverse: boolean;
}

interface PrincipleItem {
  num: string;
  title: string;
  body: string;
}

interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

/* ── Data ────────────────────────────────────────────────────────────────── */
const DOMAINS: Domain[] = [
  {
    img: photo('1544367745-a81e18eb7be2'),
    index: 'I',
    title: 'MUSCULO-SQUELETTIQUE',
    body: 'Colonne vertébrale, articulations, muscles — libérer les tensions pour rétablir le mouvement naturel du corps.',
  },
  {
    img: photo('1498804103-78838778a06b'),
    index: 'II',
    title: 'VISCÉRAL & FONCTIONNEL',
    body: "Foie, intestins, poumons — les organes ont leur propre rythme que l'ostéopathie apprend à lire et à respecter.",
  },
  {
    img: photo('1570295999-41bbf40f8fb5'),
    index: 'III',
    title: 'PÉDIATRIE & PÉRINATAL',
    body: "Nourrissons, grossesse, post-partum — le corps en transformation a besoin d'un accompagnement doux et précis.",
  },
];

const SPECIALTIES: Specialty[] = [
  { label: 'Lombalgies & sciatique' },
  { label: 'Cervicalgies & migraines' },
  { label: 'Suivi sportif' },
  { label: 'Nourrissons & coliques' },
  { label: 'Grossesse & post-partum' },
  { label: 'Troubles digestifs' },
];

const EDIT_ROWS: EditRow[] = [
  {
    eyebrow: 'Notre pratique',
    img: photo('1544367745-a81e18eb7be2') + '&w=800',
    titleNode: (
      <>
        Le corps{' '}
        <span style={{ fontStyle: 'italic' }}>comme boussole.</span>
      </>
    ),
    body: "Une approche globale qui traite la cause, pas uniquement le symptôme. Chaque séance dure 45 minutes, sans précipitation. Nous prenons le temps d'écouter, d'observer, de comprendre avant d'agir — parce que le corps parle quand on lui laisse l'espace pour le faire.",
    reverse: false,
  },
  {
    eyebrow: 'Le cabinet',
    img: photo('1498804103-78838778a06b') + '&w=800',
    titleNode: (
      <>
        Nantes{' '}
        <span style={{ fontStyle: 'italic' }}>/ Île de Nantes.</span>
      </>
    ),
    body: "Installé au cœur de l'Île de Nantes, le cabinet est accessible en tramway (ligne 1) et dispose de places de stationnement à proximité. Des téléconsultations sont également disponibles pour le suivi à distance.",
    reverse: true,
  },
];

const PRINCIPLES: PrincipleItem[] = [
  {
    num: 'I',
    title: "L'unité du corps",
    body: "Structure, fonction et psyché sont interdépendants. Traiter une zone isolée sans considérer l'ensemble conduit à une impasse thérapeutique.",
  },
  {
    num: 'II',
    title: "L'autoguérison",
    body: "Le corps contient ses propres ressources thérapeutiques. Le rôle de l'ostéopathe est d'ôter les obstacles qui empêchent cette capacité de s'exprimer.",
  },
  {
    num: 'III',
    title: 'La structure gouverne la fonction',
    body: "Tout blocage a une cause mécanique identifiable. Restaurer la mobilité structurelle, c'est restaurer la fonction physiologique.",
  },
  {
    num: 'IV',
    title: 'Le mouvement est vie',
    body: "L'immobilité est la source de toute pathologie. Là où le mouvement est libre, la santé peut s'installer et se maintenir.",
  },
];

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Maçon depuis vingt ans, j'avais des lombalgies chroniques depuis sept ans. Quatre séances ont suffi à résoudre complètement le problème. Je n'aurais jamais cru ça possible.",
    name: 'Thierry M.',
    role: 'Artisan · Nantes',
  },
  {
    quote:
      "Notre nourrisson souffrait de reflux et pleurait sans arrêt. Après deux séances, c'était un autre bébé — calme, apaisé. Une révélation pour toute la famille.",
    name: 'Sophie & Julien R.',
    role: 'Parents · Saint-Herblain',
  },
];

/* ════════════════════════════════════════════════════════════════════════════
   Primitives
   ════════════════════════════════════════════════════════════════════════════ */

/** Étiquette fine, capitales, interlettrage, filet teal. */
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
    width: 42,
    height: 1,
    background: color,
    opacity: 0.7,
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

/** Révélation au scroll — fondu + translation verticale. */
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
  const inView = useInView(ref, { once: true, margin: '-12% 0px -12% 0px' });
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

/** Bouton teal, contour fin, flèche animée. */
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
      : { background: 'rgba(46,122,94,0.08)', transform: 'translateY(-2px)' }
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
    { label: 'Approche', href: '#approche' },
    { label: 'Spécialités', href: '#specialites' },
    { label: 'Le cabinet', href: '#cabinet' },
    { label: 'Témoignages', href: '#temoignages' },
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
    background: solid ? 'rgba(10,24,16,0.95)' : 'transparent',
    backdropFilter: solid ? 'blur(14px) saturate(130%)' : 'none',
    WebkitBackdropFilter: solid ? 'blur(14px) saturate(130%)' : 'none',
    borderBottom: solid
      ? '1px solid rgba(46,122,94,0.28)'
      : '1px solid transparent',
    transition: 'all .6s cubic-bezier(.16,1,.3,1)',
  };
  const brand: React.CSSProperties = {
    fontFamily: SERIF,
    fontSize: 20,
    fontStyle: 'italic',
    color: solid ? C.white : C.white,
    letterSpacing: '0.04em',
    fontWeight: 400,
  };
  const linkRow: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'clamp(18px,2.2vw,38px)',
  };

  return (
    <>
      <nav style={bar}>
      <div style={brand}>Ostéo Atlantique</div>
      <div style={linkRow} className="oa-navlinks">
        {links.map((l) => (
          <NavLink key={l.label} label={l.label} href={l.href} />
        ))}
      </div>
      <div className="oa-navcta">
        <a href="#reserver" style={{ textDecoration: 'none' }}>
          <TealButton filled>Réserver</TealButton>
        </a>
      </div>
      
        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="oa-burger"
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
        @media (max-width: 860px) {
          .oa-navlinks { display: none !important; }
          .oa-burger { display: flex !important; flex-direction: column; }
          .oa-navcta { display: none !important; }
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
   2 · HERO (100vh, parallaxe)
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
          src={`https://images.unsplash.com/photo-1544367745-a81e18eb7be2?q=80&w=2000&auto=format&fit=crop`}
          alt="Cabinet Ostéo Atlantique — salle de soin lumineuse"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </motion.div>

      {/* Voiles */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(10,24,16,0.48) 0%, rgba(10,24,16,0.10) 38%, rgba(10,24,16,0.46) 68%, rgba(10,24,16,0.92) 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(110% 75% at 50% 30%, transparent 38%, rgba(10,24,16,0.42) 100%)',
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
          padding: '0 24px',
          y: titleY,
          opacity: titleOpacity,
        }}
      >
        <Reveal y={18}>
          <Eyebrow color={C.accentLight} align="center">
            Ostéopathie D.O. · Nantes
          </Eyebrow>
        </Reveal>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.15 }}
          style={{
            fontFamily: SERIF,
            fontWeight: 400,
            fontStyle: 'italic',
            color: C.white,
            fontSize: 'clamp(3rem,7vw,8rem)',
            lineHeight: 0.96,
            letterSpacing: '-0.01em',
            margin: '28px 0 22px',
            textShadow: '0 12px 60px rgba(0,0,0,0.5)',
          }}
        >
          Retrouver{' '}
          <span style={{ fontStyle: 'normal', color: C.accentLight }}>/</span>
          <br />
          le mouvement.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.46 }}
          style={{
            fontFamily: SANS,
            fontWeight: 300,
            fontSize: 'clamp(15px,1.8vw,20px)',
            color: 'rgba(255,255,255,0.82)',
            maxWidth: 540,
            lineHeight: 1.65,
          }}
        >
          Un soin manuel précis et personnalisé pour que votre corps retrouve
          sa liberté de mouvement.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.72 }}
          style={{ marginTop: 42 }}
        >
          <TealButton filled>Prendre rendez-vous</TealButton>
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
   3 · INTRO
   ════════════════════════════════════════════════════════════════════════════ */
function Intro() {
  const sec: React.CSSProperties = {
    background: C.bgAlt,
    color: C.ink,
    padding: 'clamp(90px,13vw,190px) clamp(24px,8vw,160px)',
    textAlign: 'center',
  };
  return (
    <section style={sec} id="approche">
      <Reveal>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 34 }}>
          <Eyebrow color={C.accent} align="center">
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
            lineHeight: 1.38,
            fontWeight: 400,
            maxWidth: 960,
            margin: '0 auto',
            color: C.ink,
          }}
        >
          Le corps guérit quand on lui laisse retrouver son équilibre.
          C&apos;est tout ce que fait l&apos;ostéopathie.
        </p>
      </Reveal>
      <Reveal delay={0.22}>
        <div
          style={{
            width: 1,
            height: 86,
            background: `linear-gradient(${C.accent}, transparent)`,
            margin: '54px auto 0',
          }}
        />
      </Reveal>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   4 · DOMAIN SEQUENCE — crossfade 320vh sticky
   ════════════════════════════════════════════════════════════════════════════ */
function DomainImage({
  domain,
  i,
  total,
  progress,
}: {
  domain: Domain;
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
        src={domain.img}
        alt={domain.title}
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

function DomainCaption({
  domain,
  i,
  total,
  progress,
}: {
  domain: Domain;
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
        padding: '0 clamp(24px,8vw,120px)',
        opacity,
        y,
      }}
    >
      {/* Index top-right */}
      <div
        style={{
          position: 'absolute',
          top: 'clamp(80px,12vh,140px)',
          right: 'clamp(24px,5vw,64px)',
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontSize: 'clamp(56px,8vw,110px)',
          color: 'rgba(192,220,208,0.22)',
          lineHeight: 1,
          userSelect: 'none',
        }}
      >
        {domain.index}
      </div>

      {/* Label top-right small */}
      <div
        style={{
          position: 'absolute',
          top: 'clamp(82px,12.4vh,148px)',
          right: 'clamp(24px,5vw,64px)',
          paddingTop: 'clamp(52px,7.5vw,105px)',
          fontFamily: SANS,
          fontSize: 11,
          letterSpacing: '0.38em',
          textTransform: 'uppercase',
          color: C.accentLight,
          fontWeight: 500,
        }}
      >
        {domain.title}
      </div>

      <h2
        style={{
          fontFamily: SERIF,
          fontSize: 'clamp(36px,5.6vw,84px)',
          fontWeight: 400,
          fontStyle: 'italic',
          color: C.white,
          lineHeight: 1.05,
          margin: '0 0 22px',
          textShadow: '0 8px 40px rgba(0,0,0,0.6)',
          maxWidth: 760,
        }}
      >
        {domain.title}
      </h2>
      <p
        style={{
          fontFamily: SANS,
          fontWeight: 300,
          fontSize: 'clamp(15px,1.6vw,19px)',
          color: 'rgba(255,255,255,0.82)',
          maxWidth: 520,
          lineHeight: 1.7,
        }}
      >
        {domain.body}
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
    <motion.div
      style={{ height: 2, width, background: C.accent, opacity, borderRadius: 2 }}
    />
  );
}

function DomainSequence() {
  const n = DOMAINS.length;
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
        {DOMAINS.map((d, i) => (
          <DomainImage
            key={d.index}
            domain={d}
            i={i}
            total={DOMAINS.length}
            progress={progress}
          />
        ))}

        {/* Voile lisibilité */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to bottom, rgba(10,24,16,0.36), rgba(10,24,16,0.08) 40%, rgba(10,24,16,0.58))',
          }}
        />

        {DOMAINS.map((d, i) => (
          <DomainCaption
            key={d.index}
            domain={d}
            i={i}
            total={DOMAINS.length}
            progress={progress}
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
            gap: 12,
          }}
        >
          {DOMAINS.map((d, i) => (
            <ProgressDot
              key={d.index}
              i={i}
              total={DOMAINS.length}
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
   5 · SPECIALTY CARDS
   ════════════════════════════════════════════════════════════════════════════ */
function SpecialtyCard({ s, i }: { s: Specialty; i: number }) {
  const [hover, setHover] = useState(false);
  const card: React.CSSProperties = {
    background: C.bgCard,
    borderLeft: `3px solid ${hover ? C.accent : C.border}`,
    padding: 'clamp(22px,3vw,32px) clamp(22px,3vw,32px) clamp(22px,3vw,32px) clamp(24px,3.2vw,36px)',
    boxShadow: hover
      ? '0 24px 60px -30px rgba(10,24,16,0.18)'
      : '0 6px 24px -16px rgba(10,24,16,0.10)',
    transform: hover ? 'translateY(-6px)' : 'none',
    transition: 'all .55s cubic-bezier(.16,1,.3,1)',
    cursor: 'default',
    display: 'flex',
    alignItems: 'center',
    gap: 18,
  };
  return (
    <Reveal delay={i * 0.08}>
      <div
        style={card}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <span
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 'clamp(28px,2.8vw,38px)',
            color: hover ? C.accent : C.border,
            lineHeight: 1,
            transition: 'color .45s',
            userSelect: 'none',
          }}
        >
          {String(i + 1).padStart(2, '0')}
        </span>
        <h3
          style={{
            fontFamily: SERIF,
            fontSize: 'clamp(18px,1.8vw,22px)',
            fontWeight: 400,
            color: hover ? C.ink : C.textMuted,
            margin: 0,
            transition: 'color .45s',
          }}
        >
          {s.label}
        </h3>
      </div>
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
    gap: 'clamp(16px,2vw,28px)',
    maxWidth: 1200,
    margin: '0 auto',
  };
  return (
    <section style={sec} id="specialites">
      <div style={{ maxWidth: 1200, margin: '0 auto 56px' }}>
        <Reveal>
          <Eyebrow color={C.accent}>Nos spécialités</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(34px,5vw,66px)',
              fontWeight: 400,
              color: C.ink,
              margin: '22px 0 0',
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
          <SpecialtyCard key={s.label} s={s} i={i} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   6 · EDITORIAL ROWS
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
    gap: 'clamp(32px,6vw,88px)',
    alignItems: 'center',
  };
  const imgWrap: React.CSSProperties = {
    overflow: 'hidden',
    order: row.reverse ? 2 : 1,
    aspectRatio: '4 / 5',
    position: 'relative',
  };
  const txt: React.CSSProperties = { order: row.reverse ? 1 : 2 };

  return (
    <div style={wrap} className="oa-editrow">
      {/* Ghost numeral */}
      <div
        style={{
          position: 'absolute',
          pointerEvents: 'none',
          top: -30,
          left: row.reverse ? 'auto' : -20,
          right: row.reverse ? -20 : 'auto',
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontSize: 'clamp(100px,14vw,180px)',
          color: C.ink,
          opacity: 0.06,
          lineHeight: 1,
          userSelect: 'none',
          zIndex: 0,
        }}
      >
        {row.reverse ? '02' : '01'}
      </div>

      <Reveal y={48} style={{ ...imgWrap, zIndex: 1 }}>
        <ParallaxImg src={row.img} alt={row.eyebrow} />
      </Reveal>

      <div style={{ ...txt, position: 'relative', zIndex: 1 }}>
        <Reveal>
          <Eyebrow color={C.accent}>{row.eyebrow}</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h3
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(30px,4vw,56px)',
              fontWeight: 400,
              color: C.ink,
              margin: '20px 0 24px',
              lineHeight: 1.1,
            }}
          >
            {row.titleNode}
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
              maxWidth: 440,
            }}
          >
            {row.body}
          </p>
        </Reveal>
        <Reveal delay={0.24}>
          <div style={{ marginTop: 34 }}>
            <a href="#reserver" style={{ textDecoration: 'none' }}>
              <TealButton>Prendre rendez-vous</TealButton>
            </a>
          </div>
        </Reveal>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .oa-editrow { grid-template-columns: 1fr !important; }
          .oa-editrow > * { order: initial !important; }
        }
      `}</style>
    </div>
  );
}

function EditorialRows() {
  const sec: React.CSSProperties = {
    background: C.bg,
    padding: 'clamp(80px,11vw,150px) clamp(24px,6vw,96px)',
    overflow: 'hidden',
  };
  return (
    <section style={sec} id="cabinet">
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(80px,11vw,150px)',
          position: 'relative',
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
   7 · PRINCIPLES PANEL — sticky image, 4 principes défilants
   ════════════════════════════════════════════════════════════════════════════ */
function PrinciplesPanel() {
  const sec: React.CSSProperties = {
    background: C.bgDark,
    padding: 'clamp(80px,11vw,150px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '0.95fr 1.05fr',
    gap: 'clamp(40px,6vw,96px)',
    maxWidth: 1200,
    margin: '0 auto',
    alignItems: 'start',
  };
  const stickyImg: React.CSSProperties = {
    position: 'sticky',
    top: 100,
    alignSelf: 'start',
  };

  return (
    <section style={sec}>
      <div style={grid} className="oa-prinpanel">
        {/* Sticky image */}
        <div style={stickyImg} className="oa-prinpanel-img">
          <div
            style={{
              overflow: 'hidden',
              border: `1px solid rgba(46,122,94,0.3)`,
              aspectRatio: '4 / 5',
            }}
          >
            <img
              src={`https://images.unsplash.com/photo-1570295999-41bbf40f8fb5?q=80&w=900&auto=format&fit=crop`}
              alt="Soin ostéopathique doux — Ostéo Atlantique"
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
                fontSize: 10.5,
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: C.accent,
                marginBottom: 10,
              }}
            >
              Les piliers de l&apos;ostéopathie
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
              « Trouver la santé devrait être le but du médecin. »
              <br />
              <span
                style={{
                  fontFamily: SANS,
                  fontStyle: 'normal',
                  fontSize: 11,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: C.textFaint,
                  display: 'block',
                  marginTop: 10,
                }}
              >
                A.T. Still — fondateur de l&apos;ostéopathie
              </span>
            </div>
          </div>
        </div>

        {/* Principes défilants */}
        <div>
          <Reveal>
            <Eyebrow color={C.accent}>Nos principes</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(32px,4.6vw,62px)',
                fontWeight: 400,
                color: C.white,
                margin: '22px 0 54px',
                lineHeight: 1.06,
              }}
            >
              Quatre lois{' '}
              <span style={{ fontStyle: 'italic', color: C.accentLight }}>
                fondatrices
              </span>
            </h2>
          </Reveal>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {PRINCIPLES.map((p, i) => (
              <Reveal key={p.num} delay={0.06 * i}>
                <div
                  style={{
                    padding: 'clamp(28px,3.5vw,42px) 0',
                    borderTop: `1px solid rgba(46,122,94,0.35)`,
                    display: 'flex',
                    gap: 26,
                    alignItems: 'baseline',
                  }}
                >
                  <span
                    style={{
                      fontFamily: SERIF,
                      fontStyle: 'italic',
                      fontSize: 'clamp(22px,2.5vw,30px)',
                      color: C.sand,
                      minWidth: 46,
                      lineHeight: 1,
                    }}
                  >
                    {p.num}
                  </span>
                  <div>
                    <h4
                      style={{
                        fontFamily: SERIF,
                        fontSize: 'clamp(20px,2vw,26px)',
                        fontWeight: 400,
                        color: C.white,
                        margin: '0 0 12px',
                      }}
                    >
                      {p.title}
                    </h4>
                    <p
                      style={{
                        fontFamily: SANS,
                        fontWeight: 300,
                        fontSize: 'clamp(14px,1.4vw,16.5px)',
                        lineHeight: 1.76,
                        color: 'rgba(255,255,255,0.62)',
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
          .oa-prinpanel { grid-template-columns: 1fr !important; }
          .oa-prinpanel-img { position: static !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   8 · TESTIMONIALS
   ════════════════════════════════════════════════════════════════════════════ */
function Testimonials() {
  const sec: React.CSSProperties = {
    background: C.bgAlt,
    padding: 'clamp(90px,12vw,170px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: 'clamp(28px,4vw,56px)',
    maxWidth: 1160,
    margin: '0 auto',
  };
  return (
    <section style={sec} id="temoignages">
      <div style={{ maxWidth: 1160, margin: '0 auto 60px', textAlign: 'center' }}>
        <Reveal>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
            <Heart size={28} color={C.accent} strokeWidth={1.3} fill="none" />
          </div>
          <Eyebrow color={C.accent} align="center">
            Témoignages
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.09}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(32px,4.6vw,62px)',
              fontWeight: 400,
              color: C.ink,
              margin: '22px 0 0',
              lineHeight: 1.06,
            }}
          >
            Ce qu&apos;ils{' '}
            <span style={{ fontStyle: 'italic', color: C.accent }}>ressentent</span>
          </h2>
        </Reveal>
      </div>
      <div style={grid}>
        {TESTIMONIALS.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.12} style={{ height: '100%' }}>
            <figure
              style={{
                background: C.white,
                border: `1px solid ${C.border}`,
                padding: 'clamp(34px,4vw,50px)',
                margin: 0,
                height: '100%',
                boxSizing: 'border-box',
                boxShadow: '0 20px 54px -36px rgba(10,24,16,0.20)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 3,
                  background: C.accent,
                  marginBottom: 28,
                  borderRadius: 2,
                }}
              />
              <blockquote
                style={{
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  fontSize: 'clamp(17px,1.8vw,21px)',
                  lineHeight: 1.66,
                  color: C.ink,
                  margin: '0 0 30px',
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
                  }}
                >
                  {t.name}
                </div>
                <div
                  style={{
                    fontFamily: SANS,
                    fontSize: 11,
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
   9 · BOOKING FORM
   ════════════════════════════════════════════════════════════════════════════ */
function BookingForm() {
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [motif, setMotif] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const onSubmit = () => {
    if (!prenom || !email) return;
    setSent(true);
  };

  const sec: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    background: C.bgDark,
    padding: 'clamp(90px,13vw,180px) clamp(24px,6vw,96px)',
  };
  const fieldBase: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    background: 'transparent',
    border: 'none',
    borderBottom: `1px solid rgba(46,122,94,0.45)`,
    padding: '15px 2px',
    fontFamily: SERIF,
    fontSize: 17,
    color: C.white,
    outline: 'none',
    transition: 'border-color .4s',
  };
  const labelStyle: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 10.5,
    letterSpacing: '0.26em',
    textTransform: 'uppercase',
    color: C.accent,
    display: 'block',
    marginBottom: 4,
    fontWeight: 500,
  };

  return (
    <section style={sec} id="reserver">
      {/* Background image subtle */}
      <img
        src={`https://images.unsplash.com/photo-1570295999-41bbf40f8fb5?q=80&w=1600&auto=format&fit=crop`}
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
              fontSize: 'clamp(34px,5.5vw,72px)',
              fontWeight: 400,
              fontStyle: 'italic',
              color: C.white,
              margin: '22px 0 18px',
              lineHeight: 1.06,
            }}
          >
            Votre premier pas
          </h2>
        </Reveal>
        <Reveal delay={0.14}>
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
            Décrivez votre situation en quelques mots. Nous vous répondons
            sous 24h pour confirmer votre rendez-vous.
          </p>
        </Reveal>

        {sent ? (
          <Reveal>
            <div
              style={{
                border: `1px solid rgba(46,122,94,0.55)`,
                padding: 'clamp(36px,5vw,56px)',
                background: 'rgba(46,122,94,0.08)',
              }}
            >
              <Heart size={32} color={C.accent} strokeWidth={1.4} />
              <h3
                style={{
                  fontFamily: SERIF,
                  fontSize: 'clamp(24px,2.8vw,34px)',
                  fontWeight: 400,
                  color: C.white,
                  margin: '18px 0 14px',
                }}
              >
                Merci {prenom}, nous vous confirmons
                <br />votre RDV sous 24h.
              </h3>
              <p
                style={{
                  fontFamily: SANS,
                  fontWeight: 300,
                  fontSize: 16,
                  color: 'rgba(255,255,255,0.68)',
                  margin: 0,
                }}
              >
                Un email de confirmation sera envoyé à{' '}
                <strong style={{ color: C.accentLight, fontWeight: 500 }}>
                  {email}
                </strong>
                .
              </p>
            </div>
          </Reveal>
        ) : (
          <Reveal delay={0.22}>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: 32, textAlign: 'left' }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 28,
                }}
                className="oa-formgrid"
              >
                <div>
                  <label style={labelStyle} htmlFor="oa-prenom">
                    Prénom
                  </label>
                  <input
                    id="oa-prenom"
                    style={fieldBase}
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    placeholder="Marie"
                    autoComplete="given-name"
                  />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="oa-email">
                    Email
                  </label>
                  <input
                    id="oa-email"
                    style={fieldBase}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="marie@exemple.fr"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle} htmlFor="oa-telephone">
                  Téléphone
                </label>
                <input
                  id="oa-telephone"
                  style={fieldBase}
                  type="tel"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  placeholder="06 12 34 56 78"
                  autoComplete="tel"
                />
              </div>

              <div>
                <label style={labelStyle} htmlFor="oa-motif">
                  Motif de consultation
                </label>
                <select
                  id="oa-motif"
                  style={{
                    ...fieldBase,
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    cursor: 'pointer',
                    color: motif ? C.white : 'rgba(255,255,255,0.4)',
                  }}
                  value={motif}
                  onChange={(e) => setMotif(e.target.value)}
                >
                  <option value="" style={{ color: '#222' }}>
                    Choisir un motif…
                  </option>
                  <option value="Douleurs dorsales" style={{ color: '#222' }}>
                    Douleurs dorsales
                  </option>
                  <option value="Cervicalgies" style={{ color: '#222' }}>
                    Cervicalgies
                  </option>
                  <option value="Sportif" style={{ color: '#222' }}>
                    Sportif
                  </option>
                  <option value="Nourrisson & pédiatrie" style={{ color: '#222' }}>
                    Nourrisson &amp; pédiatrie
                  </option>
                  <option value="Femme enceinte" style={{ color: '#222' }}>
                    Femme enceinte
                  </option>
                  <option value="Autre" style={{ color: '#222' }}>
                    Autre
                  </option>
                </select>
              </div>

              <div>
                <label style={labelStyle} htmlFor="oa-message">
                  Message (optionnel)
                </label>
                <textarea
                  id="oa-message"
                  style={{
                    ...fieldBase,
                    resize: 'vertical',
                    minHeight: 90,
                    lineHeight: 1.65,
                  }}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Décrivez brièvement votre situation…"
                />
              </div>

              <div style={{ textAlign: 'center', marginTop: 8 }}>
                <TealButton filled onClick={onSubmit} type="button">
                  Envoyer ma demande
                </TealButton>
              </div>
            </div>
          </Reveal>
        )}
      </div>

      <style>{`
        @media (max-width: 860px) {
          .oa-formgrid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   10 · FOOTER
   ════════════════════════════════════════════════════════════════════════════ */
function Footer() {
  const cols: { title: string; items: string[] }[] = [
    {
      title: 'Soins',
      items: [
        'Musculo-squelettique',
        'Viscéral & fonctionnel',
        'Pédiatrie & périnatal',
        'Suivi sportif',
      ],
    },
    {
      title: 'Informations',
      items: [
        'Première consultation',
        'Tarifs',
        'Remboursement',
        'FAQ',
      ],
    },
    {
      title: 'Cabinet',
      items: [
        'Île de Nantes',
        'Tram ligne 1',
        'Téléconsultation',
        'Contact',
      ],
    },
  ];

  const foot: React.CSSProperties = {
    background: C.bgDarkAlt,
    borderTop: `1px solid rgba(46,122,94,0.22)`,
    padding: 'clamp(64px,9vw,110px) clamp(24px,6vw,96px) 42px',
  };

  return (
    <footer id="contact" style={foot}>
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.5fr repeat(3, 1fr)',
          gap: 'clamp(32px,5vw,64px)',
        }}
        className="oa-footgrid"
      >
        {/* Brand */}
        <div>
          <div
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: 24,
              color: C.white,
              fontWeight: 400,
              marginBottom: 20,
            }}
          >
            Ostéo Atlantique
          </div>
          <p
            style={{
              fontFamily: SANS,
              fontWeight: 300,
              fontSize: 15,
              lineHeight: 1.72,
              color: 'rgba(255,255,255,0.56)',
              marginTop: 0,
              maxWidth: 300,
            }}
          >
            Cabinet d&apos;Ostéopathie &amp; Thérapies Manuelles. Soins pour
            toute la famille à Nantes.
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
              color: 'rgba(255,255,255,0.5)',
            }}
          >
            <MapPin size={13} color={C.accent} strokeWidth={1.6} />
            Île de Nantes · 44000
          </div>
          <div
            style={{
              marginTop: 28,
            }}
          >
            <a href="#reserver" style={{ textDecoration: 'none' }}>
              <TealButton filled>Réserver</TealButton>
            </a>
          </div>
        </div>

        {/* Columns */}
        {cols.map((c) => (
          <div key={c.title}>
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
                <li key={it}>
                  <a
                    href="#reserver"
                    style={{
                      fontFamily: SANS,
                      fontWeight: 300,
                      fontSize: 15,
                      color: 'rgba(255,255,255,0.64)',
                      textDecoration: 'none',
                      transition: 'color .35s',
                    }}
                    onMouseEnter={(e) =>
                      ((e.target as HTMLAnchorElement).style.color = C.accentLight)
                    }
                    onMouseLeave={(e) =>
                      ((e.target as HTMLAnchorElement).style.color =
                        'rgba(255,255,255,0.64)')
                    }
                  >
                    {it}
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
          maxWidth: 1200,
          margin: '60px auto 0',
          paddingTop: 26,
          borderTop: `1px solid rgba(46,122,94,0.16)`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 14,
          fontFamily: SANS,
          fontSize: 11,
          letterSpacing: '0.12em',
          color: 'rgba(255,255,255,0.38)',
        }}
      >
        <span>© 2026 Ostéo Atlantique · Nantes</span>
        <span style={{ display: 'flex', gap: 24 }}>
          <a href="#reserver" style={{ color: 'inherit', textDecoration: 'none' }}>
            Mentions légales
          </a>
          <a href="#reserver" style={{ color: 'inherit', textDecoration: 'none' }}>
            Confidentialité
          </a>
        </span>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .oa-footgrid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 540px) {
          .oa-footgrid { grid-template-columns: 1fr !important; }
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
    background: C.bg,
    color: C.ink,
    fontFamily: SANS,
    overflowX: 'hidden',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
  };

  return (
    <>
      <style>{`
        @import url('${FONTS_HREF}');
        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.32); }
        input:focus, textarea:focus, select:focus {
          border-bottom-color: rgba(46,122,94,0.9) !important;
        }
        @media (max-width: 860px) {
          .oa-navlinks { display: none !important; }
          .oa-navcta { display: none !important; }
        }
      `}</style>
      <main style={root} suppressHydrationWarning>
        <Nav />
        <Hero />
        <Intro />
        <DomainSequence />
        <SpecialtyCards />
        <EditorialRows />
        <PrinciplesPanel />
        <Testimonials />
        <BookingForm />
        <Footer />
      </main>
    </>
  );
}
