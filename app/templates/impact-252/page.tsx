"use client";
// @ts-nocheck

import React, {useRef, useState, useEffect} from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  MotionValue,
  useMotionValue,
} from 'framer-motion';
import { ArrowRight, ChevronDown, Star } from 'lucide-react';

/* ════════════════════════════════════════════════════════════════════════════
   SMILE & CO — Cabinet Dentaire Esthétique · Lyon 6e
   Chorégraphie de défilement premium, crossfade sticky 320vh, panneau tech
   collant, formulaire de RDV. 'use client'. Auto-suffisant.
   ════════════════════════════════════════════════════════════════════════════ */

/* ── Google Fonts ──────────────────────────────────────────────────────────── */
const FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,300;0,400;0,600;0,700;1,300&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap';

/* ── Palette ─────────────────────────────────────────────────────────────── */
const C = {
  bg: '#f8fafb',
  bgAlt: '#edf4f8',
  bgDark: '#081420',
  bgDarkAlt: '#040c16',
  bgCard: '#ffffff',
  accent: '#1a8a9a',
  accentDark: '#147080',
  accentLight: '#c8eaf0',
  white: '#ffffff',
  ink: '#081420',
  textMuted: '#2c4858',
  textFaint: '#7a9aaa',
  border: '#c0dae4',
  borderDark: 'rgba(26,138,154,0.2)',
  gold: '#c8a84c',
} as const;

const SERIF = "'Crimson Pro', Georgia, serif" as const;
const SANS = "'Josefin Sans', system-ui, sans-serif" as const;

/* ── Easing partagé ──────────────────────────────────────────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ════════════════════════════════════════════════════════════════════════════
   Interfaces TypeScript
   ════════════════════════════════════════════════════════════════════════════ */

interface Treatment {
  id: string;
  imgId: string;
  index: string;
  label: string;
  description: string;
}

interface Specialty {
  title: string;
  icon: string;
}

interface EditRow {
  eyebrow: string;
  imgId: string;
  reverse: boolean;
  titleLine1: string;
  titleLine2: string;
  body: string;
}

interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

interface TechItem {
  number: string;
  title: string;
  description: string;
}

/* ════════════════════════════════════════════════════════════════════════════
   Data
   ════════════════════════════════════════════════════════════════════════════ */

const TREATMENTS: Treatment[] = [
  {
    id: 'conservateurs',
    imgId: '1598300402640-cf52ea77e6da',
    index: 'I',
    label: 'SOINS CONSERVATEURS',
    description:
      'Caries, inlays/onlays, traitement de canal — préserver vos dents naturelles avec les meilleures techniques.',
  },
  {
    id: 'esthetique',
    imgId: '1606811671440-28c0f2b8b3c4',
    index: 'II',
    label: 'ESTHÉTIQUE',
    description:
      'Blanchiment LED, facettes e.max, composite direct — le sourire que vous méritez.',
  },
  {
    id: 'implantologie',
    imgId: '1588776814546-daab0f1cdc02',
    index: 'III',
    label: 'IMPLANTOLOGIE',
    description:
      'Implants zircone et titane, prothèses sur implant — retrouver une dentition complète et fonctionnelle.',
  },
];

const SPECIALTIES: Specialty[] = [
  { title: 'Soins conservateurs', icon: '◇' },
  { title: 'Blanchiment LED', icon: '◈' },
  { title: 'Facettes e.max', icon: '◆' },
  { title: 'Implantologie', icon: '⬡' },
  { title: 'Orthodontie invisible', icon: '◎' },
  { title: 'Chirurgie orale', icon: '⬢' },
];

const EDIT_ROWS: EditRow[] = [
  {
    eyebrow: 'Notre approche',
    imgId: '1598300402640-cf52ea77e6da',
    reverse: false,
    titleLine1: 'Le sourire',
    titleLine2: 'sans compromis.',
    body: "Chaque soin est réalisé sous MEOPA et anesthésie locale adaptée — zéro douleur, zéro appréhension. Nos créneaux de 60 à 90 minutes vous garantissent des consultations sans précipitation, où chaque détail compte.",
  },
  {
    eyebrow: 'Technologie',
    imgId: '1606811671440-28c0f2b8b3c4',
    reverse: true,
    titleLine1: 'Radiologie 3D',
    titleLine2: '& CFAO.',
    body: 'Cone beam 3D pour une planification implantaire précise au millimètre. Scanner intraoral iTero pour des empreintes numériques parfaites. Prothèses CEREC fabriquées et posées en une seule séance, sans empreinte en alginate.',
  },
];

const TECH_ITEMS: TechItem[] = [
  {
    number: '01',
    title: 'Scanner intraoral iTero',
    description:
      "Empreintes numériques d'une précision sub-micronique — plus d'alginate, plus d'inconfort, simulation du résultat en temps réel.",
  },
  {
    number: '02',
    title: 'CEREC',
    description:
      'Couronnes, facettes et inlays fabriqués et posés en une seule séance grâce à notre bloc de fraisage CEREC in-office.',
  },
  {
    number: '03',
    title: 'Radiologie 3D Cone Beam',
    description:
      'Imagerie volumétrique pour planifier chaque implant avec une précision au millimètre et anticiper chaque anatomie.',
  },
  {
    number: '04',
    title: 'Laser dentaire',
    description:
      'Soins des gencives et décontamination des poches parodontales sans scalpel, sans douleur, cicatrisation accélérée.',
  },
];

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "J'avais évité les dentistes pendant dix ans à cause d'une phobie intense. Smile & Co a tout changé — une équipe d'une patience et d'une douceur rares. Aujourd'hui je souris sans me cacher. Je ne pensais pas que c'était encore possible.",
    name: 'Camille D.',
    role: 'Patiente · Lyon 7e',
  },
  {
    quote:
      "Je passais à la télévision quelques semaines plus tard et je voulais des facettes irréprochables. Le résultat a dépassé tout ce que j'espérais — des proportions naturelles, une luminosité incroyable. J'ai reçu des compliments de chaque personne sur le plateau.",
    name: 'Antoine M.',
    role: 'Journaliste · Paris',
  },
];

/* ── Photo helper ────────────────────────────────────────────────────────── */
function unsplash(id: string, w = 1600) {
  return `https://images.unsplash.com/photo-${id}?q=80&w=${w}&auto=format&fit=crop`;
}

/* ════════════════════════════════════════════════════════════════════════════
   Primitives partagées
   ════════════════════════════════════════════════════════════════════════════ */

/** Étiquette fine à filet teal. */
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

/** Révélation au scroll — fondu + translation. */
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

/** Bouton teal avec flèche animée. */
function TealButton({
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
    padding: '14px 28px',
    fontFamily: SANS,
    fontSize: 12,
    letterSpacing: '0.24em',
    textTransform: 'uppercase',
    fontWeight: 400,
    cursor: 'pointer',
    border: `1px solid ${filled ? C.accent : dark ? 'rgba(26,138,154,0.5)' : C.accent}`,
    background: filled
      ? hover
        ? C.accentDark
        : C.accent
      : hover
        ? 'rgba(26,138,154,0.1)'
        : 'transparent',
    color: filled ? C.white : C.accent,
    transition: 'all .5s cubic-bezier(.16,1,.3,1)',
    transform: hover ? 'translateY(-2px)' : 'none',
    outline: 'none',
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
    const onScroll = () => setSolid(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: 'Soins', href: '#soins' },
    { label: 'Esthétique', href: '#esthetique' },
    { label: 'Technologie', href: '#technologie' },
    { label: 'RDV', href: '#rdv' },
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
    background: solid ? 'rgba(8,20,32,0.95)' : 'transparent',
    backdropFilter: solid ? 'blur(16px) saturate(130%)' : 'none',
    WebkitBackdropFilter: solid ? 'blur(16px) saturate(130%)' : 'none',
    borderBottom: solid
      ? '1px solid rgba(26,138,154,0.18)'
      : '1px solid transparent',
    transition: 'all .6s cubic-bezier(.16,1,.3,1)',
  };

  const brand: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 18,
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    color: C.white,
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    textDecoration: 'none',
  };

  const dot: React.CSSProperties = {
    width: 7,
    height: 7,
    borderRadius: '50%',
    background: C.accent,
    flexShrink: 0,
  };

  return (
    <>
      <nav style={bar}>
      <a href="#hero" style={brand}>
        Smile&nbsp;&amp;&nbsp;Co
        <span style={dot} />
      </a>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(16px,2.4vw,36px)',
        }}
        className="sc-navlinks"
      >
        {links.map((l) => (
          <NavLink key={l.label} label={l.label} href={l.href} />
        ))}
      </div>

      <a href="#rdv" style={{ textDecoration: 'none' }} className="sc-navlinks">
        <TealButton filled>Prendre RDV</TealButton>
      </a>

      
        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="sc-burger"
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
          .sc-navlinks { display: none !important; }
          .sc-burger { display: flex !important; flex-direction: column; }
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
        fontSize: 11,
        letterSpacing: '0.20em',
        textTransform: 'uppercase',
        color: h ? C.accent : 'rgba(255,255,255,0.85)',
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
   2 · Hero (100vh, parallaxe)
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
  const cueOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const section: React.CSSProperties = {
    position: 'relative',
    height: '100vh',
    minHeight: 640,
    overflow: 'hidden',
    background: C.bgDark,
  };

  return (
    <section ref={ref} style={section} id="hero">
      {/* Photo plein cadre avec parallaxe */}
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
          src={unsplash('1598300402640-cf52ea77e6da', 2000)}
          alt="Cabinet dentaire Smile & Co Lyon 6e"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          priority-fetch="high"
        />
      </motion.div>

      {/* Scrims */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(8,20,32,0.50) 0%, rgba(8,20,32,0.10) 36%, rgba(8,20,32,0.46) 68%, rgba(8,20,32,0.90) 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(110% 80% at 50% 35%, transparent 38%, rgba(8,20,32,0.50) 100%)',
          mixBlendMode: 'multiply',
        }}
      />

      {/* Contenu centré */}
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
        <Reveal y={20}>
          <Eyebrow color="rgba(200,234,240,0.9)" align="center">
            Cabinet dentaire esthétique · Lyon 6e
          </Eyebrow>
        </Reveal>

        <motion.h1
          initial={{ opacity: 0, y: 44 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.18 }}
          style={{
            fontFamily: SERIF,
            fontWeight: 400,
            fontStyle: 'italic',
            color: C.white,
            fontSize: 'clamp(3rem,7vw,8rem)',
            lineHeight: 0.97,
            letterSpacing: '-0.01em',
            margin: '28px 0 24px',
            textShadow: '0 14px 64px rgba(0,0,0,0.55)',
          }}
        >
          Le sourire
          <br />
          <span style={{ fontStyle: 'normal', color: C.accentLight }}>
            que vous rêvez.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.44 }}
          style={{
            fontFamily: SANS,
            fontWeight: 300,
            fontSize: 'clamp(14px,1.5vw,17px)',
            color: 'rgba(255,255,255,0.78)',
            maxWidth: 480,
            lineHeight: 1.7,
            letterSpacing: '0.04em',
          }}
        >
          Soins conservateurs, esthétique dentaire et implantologie — une
          expertise complète dans un cabinet pensé pour votre confort.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.68 }}
          style={{ marginTop: 44 }}
        >
          <TealButton filled>Prendre rendez-vous</TealButton>
        </motion.div>
      </motion.div>

      {/* Cue de défilement */}
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
            letterSpacing: '0.36em',
            textTransform: 'uppercase',
            color: 'rgba(200,234,240,0.75)',
          }}
        >
          Découvrir
        </span>
        <motion.div
          animate={{ y: [0, 9, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
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
    padding: 'clamp(88px,13vw,180px) clamp(24px,8vw,160px)',
    textAlign: 'center',
  };
  return (
    <section id="contact" style={sec}>
      <Reveal>
        <p
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 'clamp(24px,3.4vw,48px)',
            lineHeight: 1.36,
            fontWeight: 400,
            color: C.ink,
            maxWidth: 920,
            margin: '0 auto',
          }}
        >
          Chaque sourire mérite des soins à la hauteur de son importance.
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
   4 · TreatmentSequence — sticky 320vh crossfade
   ════════════════════════════════════════════════════════════════════════════ */
function TreatmentImage({
  treatment,
  i,
  total,
  progress,
}: {
  treatment: Treatment;
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
  const scale = useTransform(progress, [start - fadeIn, end], [1.1, 1.0]);

  return (
    <motion.div style={{ position: 'absolute', inset: 0, opacity }}>
      <motion.img
        src={unsplash(treatment.imgId)}
        alt={treatment.label}
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

function TreatmentCaption({
  treatment,
  i,
  total,
  progress,
}: {
  treatment: Treatment;
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
        padding: '0 clamp(24px,8vw,140px)',
        opacity,
        y,
      }}
    >
      <span
        style={{
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontSize: 'clamp(36px,8vw,108px)',
          color: 'rgba(26,138,154,0.28)',
          lineHeight: 1,
          marginBottom: 8,
        }}
      >
        {treatment.index}
      </span>
      <h2
        style={{
          fontFamily: SANS,
          fontWeight: 300,
          fontSize: 'clamp(13px,1.4vw,16px)',
          letterSpacing: '0.42em',
          textTransform: 'uppercase',
          color: C.accentLight,
          margin: '0 0 20px',
        }}
      >
        {treatment.label}
      </h2>
      <p
        style={{
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontSize: 'clamp(18px,2.2vw,26px)',
          color: 'rgba(255,255,255,0.88)',
          maxWidth: 560,
          lineHeight: 1.5,
          margin: 0,
          textShadow: '0 4px 20px rgba(0,0,0,0.5)',
        }}
      >
        {treatment.description}
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

function TreatmentSequence() {
  const n = TREATMENTS.length;
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
        {/* Images en crossfade */}
        {TREATMENTS.map((t, i) => (
          <TreatmentImage
            key={t.id}
            treatment={t}
            i={i}
            total={TREATMENTS.length}
            progress={progress}
          />
        ))}

        {/* Voile de lisibilité */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to bottom, rgba(8,20,32,0.35), rgba(8,20,32,0.08) 42%, rgba(8,20,32,0.65))',
          }}
        />

        {/* Légende section — top right */}
        <div
          style={{
            position: 'absolute',
            top: 100,
            right: 'clamp(24px,4vw,64px)',
            fontFamily: SANS,
            fontSize: 10,
            letterSpacing: '0.36em',
            textTransform: 'uppercase',
            color: 'rgba(200,234,240,0.6)',
          }}
        >
          Nos expertises
        </div>

        {/* Captions crossfade */}
        {TREATMENTS.map((t, i) => (
          <TreatmentCaption
            key={t.id}
            treatment={t}
            i={i}
            total={TREATMENTS.length}
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
          {TREATMENTS.map((t, i) => (
            <ProgressDot
              key={t.id}
              i={i}
              total={TREATMENTS.length}
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
   5 · SpecialtyCards
   ════════════════════════════════════════════════════════════════════════════ */
function SpecialtyCard({ sp, i }: { sp: Specialty; i: number }) {
  const [hover, setHover] = useState(false);
  const card: React.CSSProperties = {
    background: C.bgCard,
    borderLeft: `3px solid ${hover ? C.accent : C.border}`,
    padding: 'clamp(28px,3vw,40px) clamp(24px,2.6vw,34px)',
    transform: hover ? 'translateY(-8px)' : 'none',
    boxShadow: hover
      ? `0 32px 64px -28px rgba(26,138,154,0.28)`
      : '0 8px 32px -20px rgba(8,20,32,0.12)',
    transition: 'all .55s cubic-bezier(.16,1,.3,1)',
    cursor: 'default',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  };
  return (
    <Reveal delay={i * 0.08}>
      <article
        style={card}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <span
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 28,
            color: hover ? C.accent : C.border,
            lineHeight: 1,
            transition: 'color .5s',
          }}
        >
          {sp.icon}
        </span>
        <h3
          style={{
            fontFamily: SERIF,
            fontSize: 'clamp(20px,2vw,26px)',
            fontWeight: 400,
            color: C.ink,
            margin: 0,
          }}
        >
          {sp.title}
        </h3>
      </article>
    </Reveal>
  );
}

function SpecialtyCards() {
  const sec: React.CSSProperties = {
    background: C.bg,
    padding: 'clamp(88px,12vw,160px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: 'clamp(20px,2.4vw,32px)',
    maxWidth: 1240,
    margin: '0 auto',
  };
  return (
    <section style={sec} id="esthetique">
      <div style={{ maxWidth: 1240, margin: '0 auto 56px' }}>
        <Reveal>
          <Eyebrow>Nos spécialités</Eyebrow>
        </Reveal>
        <Reveal delay={0.09}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(32px,5vw,70px)',
              fontWeight: 400,
              color: C.ink,
              margin: '20px 0 0',
              lineHeight: 1.05,
            }}
          >
            Un soin,{' '}
            <span style={{ fontStyle: 'italic', color: C.accent }}>
              une expertise
            </span>
          </h2>
        </Reveal>
      </div>
      <div style={grid}>
        {SPECIALTIES.map((sp, i) => (
          <SpecialtyCard key={sp.title} sp={sp} i={i} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   6 · EditorialRows (2 lignes alternées)
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

function EditRow({ row, romanIndex }: { row: EditRow; romanIndex: string }) {
  const wrap: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 'clamp(32px,5.6vw,84px)',
    alignItems: 'center',
    position: 'relative',
  };
  const imgWrap: React.CSSProperties = {
    overflow: 'hidden',
    order: row.reverse ? 2 : 1,
    aspectRatio: '4 / 5',
    position: 'relative',
  };
  const txt: React.CSSProperties = { order: row.reverse ? 1 : 2 };

  return (
    <div style={wrap} className="sc-editrow">
      {/* Chiffre romain fantôme en or */}
      <span
        style={{
          position: 'absolute',
          top: -30,
          [row.reverse ? 'right' : 'left']: 0,
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontSize: 'clamp(80px,14vw,180px)',
          color: C.gold,
          opacity: 0.12,
          lineHeight: 1,
          pointerEvents: 'none',
          userSelect: 'none',
          zIndex: 0,
        }}
      >
        {romanIndex}
      </span>
      <Reveal y={50} style={imgWrap}>
        <ParallaxImg
          src={unsplash(row.imgId, 800)}
          alt={row.eyebrow}
        />
      </Reveal>
      <div style={{ ...txt, position: 'relative', zIndex: 1 }}>
        <Reveal>
          <Eyebrow>{row.eyebrow}</Eyebrow>
        </Reveal>
        <Reveal delay={0.09}>
          <h3
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(28px,4vw,56px)',
              fontWeight: 400,
              color: C.ink,
              margin: '20px 0 24px',
              lineHeight: 1.1,
            }}
          >
            <em>{row.titleLine1}</em>
            <br />
            {row.titleLine2}
          </h3>
        </Reveal>
        <Reveal delay={0.17}>
          <p
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(16px,1.5vw,18.5px)',
              lineHeight: 1.82,
              color: C.textMuted,
              maxWidth: 440,
            }}
          >
            {row.body}
          </p>
        </Reveal>
      </div>
      <style>{`
        @media (max-width: 860px) {
          .sc-editrow { grid-template-columns: 1fr !important; }
          .sc-editrow > * { order: initial !important; }
        }
      `}</style>
    </div>
  );
}

function EditorialRows() {
  const romans = ['I', 'II'];
  return (
    <section
      style={{
        background: C.bg,
        padding: 'clamp(72px,10vw,144px) clamp(24px,6vw,96px)',
      }}
    >
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(72px,10vw,140px)',
        }}
      >
        {EDIT_ROWS.map((r, i) => (
          <EditRow key={r.eyebrow} row={r} romanIndex={romans[i]} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   7 · TechPanel — sticky image left, scroll items right
   ════════════════════════════════════════════════════════════════════════════ */
function TechPanel() {
  const sec: React.CSSProperties = {
    background: C.bgDark,
    padding: 'clamp(80px,11vw,148px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '0.95fr 1.05fr',
    gap: 'clamp(36px,6vw,96px)',
    maxWidth: 1240,
    margin: '0 auto',
    alignItems: 'start',
  };
  const stickyLeft: React.CSSProperties = {
    position: 'sticky',
    top: 100,
    alignSelf: 'start',
  };

  return (
    <section style={sec} id="technologie">
      <div style={grid} className="sc-techpanel">
        {/* Image collante */}
        <div style={stickyLeft} className="sc-techpanel-sticky">
          <div
            style={{
              overflow: 'hidden',
              border: `1px solid rgba(26,138,154,0.25)`,
              aspectRatio: '3 / 4',
            }}
          >
            <img
              src={unsplash('1588776814546-daab0f1cdc02', 900)}
              alt="Équipement technologique cabinet Smile & Co"
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
            <Eyebrow color={C.accent}>Technologie de pointe</Eyebrow>
          </div>
        </div>

        {/* Items défilants */}
        <div>
          <Reveal>
            <Eyebrow color={C.accentLight}>Notre plateau technique</Eyebrow>
          </Reveal>
          <Reveal delay={0.09}>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(30px,4.4vw,60px)',
                fontWeight: 400,
                color: C.white,
                margin: '20px 0 56px',
                lineHeight: 1.06,
              }}
            >
              Une clinique,{' '}
              <span style={{ fontStyle: 'italic', color: C.accentLight }}>
                quatre technologies
              </span>{' '}
              exclusives
            </h2>
          </Reveal>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {TECH_ITEMS.map((item, i) => (
              <Reveal key={item.number} delay={0.06 * i}>
                <div
                  style={{
                    padding: 'clamp(28px,3.5vw,44px) 0',
                    borderTop: `1px solid rgba(26,138,154,0.2)`,
                    display: 'flex',
                    gap: 28,
                    alignItems: 'flex-start',
                  }}
                >
                  <span
                    style={{
                      fontFamily: SANS,
                      fontSize: 11,
                      letterSpacing: '0.18em',
                      color: C.gold,
                      minWidth: 32,
                      paddingTop: 6,
                      fontWeight: 600,
                    }}
                  >
                    {item.number}
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
                      {item.title}
                    </h4>
                    <p
                      style={{
                        fontFamily: SERIF,
                        fontStyle: 'italic',
                        fontSize: 'clamp(15px,1.4vw,17.5px)',
                        lineHeight: 1.72,
                        color: 'rgba(200,234,240,0.7)',
                        margin: 0,
                      }}
                    >
                      {item.description}
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
          .sc-techpanel { grid-template-columns: 1fr !important; }
          .sc-techpanel-sticky { position: static !important; }
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
    padding: 'clamp(88px,12vw,168px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: 'clamp(28px,3.6vw,52px)',
    maxWidth: 1180,
    margin: '0 auto',
  };
  return (
    <section style={sec}>
      <div style={{ maxWidth: 1180, margin: '0 auto 60px', textAlign: 'center' }}>
        <Reveal>
          <Eyebrow color={C.textMuted} align="center">
            Témoignages
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.09}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(30px,4.4vw,60px)',
              fontWeight: 400,
              color: C.ink,
              margin: '20px 0 0',
              lineHeight: 1.06,
            }}
          >
            Ils ont retrouvé{' '}
            <span style={{ fontStyle: 'italic', color: C.accent }}>
              confiance
            </span>
          </h2>
        </Reveal>
      </div>
      <div style={grid}>
        {TESTIMONIALS.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.13} style={{ height: '100%' }}>
            <figure
              style={{
                background: C.bgCard,
                border: `1px solid ${C.border}`,
                padding: 'clamp(32px,3.6vw,48px)',
                margin: 0,
                height: '100%',
                boxSizing: 'border-box',
                boxShadow: '0 20px 56px -36px rgba(8,20,32,0.18)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ display: 'flex', gap: 3, marginBottom: 22 }}>
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} size={15} fill={C.gold} color={C.gold} strokeWidth={0} />
                ))}
              </div>
              <blockquote
                style={{
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  fontSize: 'clamp(17px,1.8vw,21px)',
                  lineHeight: 1.62,
                  color: C.ink,
                  margin: '0 0 28px',
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
                    fontWeight: 400,
                    color: C.accent,
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
    if (!prenom || !email) return;
    setSent(true);
  };

  const sec: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    background: C.bgDark,
    padding: 'clamp(88px,12vw,168px) clamp(24px,6vw,96px)',
  };

  const fieldBase: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    background: 'transparent',
    border: 'none',
    borderBottom: `1px solid rgba(26,138,154,0.35)`,
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
    color: C.accent,
    display: 'block',
    marginBottom: 4,
  };

  const motifOptions = [
    'Bilan & détartrage',
    'Blanchiment',
    'Facettes',
    'Implant',
    'Orthodontie',
    'Urgence',
  ];

  return (
    <section style={sec} id="rdv">
      {/* Fond subtil */}
      <img
        src={unsplash('1598300402640-cf52ea77e6da', 1600)}
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
          <Eyebrow color={C.accentLight} align="center">
            Prise de rendez-vous
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.09}>
          <h2
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: 'clamp(32px,5.4vw,72px)',
              fontWeight: 400,
              color: C.white,
              margin: '22px 0 18px',
              lineHeight: 1.04,
            }}
          >
            Votre premier
            <br />
            <span style={{ fontStyle: 'normal', color: C.accentLight }}>
              rendez-vous
            </span>
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: 'clamp(15px,1.6vw,18px)',
              lineHeight: 1.72,
              color: 'rgba(200,234,240,0.78)',
              maxWidth: 500,
              margin: '0 auto 52px',
            }}
          >
            Répondez à quelques questions — nous vous confirmons votre créneau
            dans les 24 heures.
          </p>
        </Reveal>

        {sent ? (
          <Reveal>
            <div
              style={{
                border: `1px solid rgba(26,138,154,0.45)`,
                padding: 'clamp(36px,5vw,56px)',
                background: 'rgba(26,138,154,0.07)',
              }}
            >
              <div
                style={{
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  fontSize: 'clamp(18px,2.4vw,32px)',
                  color: C.accentLight,
                  marginBottom: 16,
                }}
              >
                ✦
              </div>
              <h3
                style={{
                  fontFamily: SERIF,
                  fontSize: 'clamp(22px,3vw,36px)',
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
                  color: 'rgba(200,234,240,0.80)',
                  margin: 0,
                  lineHeight: 1.68,
                }}
              >
                nous vous confirmons votre RDV dans les 24h à{' '}
                <strong style={{ color: C.accentLight, fontStyle: 'normal' }}>
                  {email}
                </strong>
                .
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
              {/* Prénom */}
              <div>
                <label style={labelStyle} htmlFor="sc-prenom">
                  Prénom
                </label>
                <input
                  id="sc-prenom"
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
                <label style={labelStyle} htmlFor="sc-email">
                  Email
                </label>
                <input
                  id="sc-email"
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
                <label style={labelStyle} htmlFor="sc-tel">
                  Téléphone
                </label>
                <input
                  id="sc-tel"
                  type="tel"
                  style={fieldBase}
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  placeholder="06 00 00 00 00"
                  autoComplete="tel"
                />
              </div>

              {/* Motif */}
              <div>
                <label style={labelStyle} htmlFor="sc-motif">
                  Motif de consultation
                </label>
                <select
                  id="sc-motif"
                  style={{
                    ...fieldBase,
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    cursor: 'pointer',
                    color: motif ? C.white : 'rgba(200,234,240,0.45)',
                  }}
                  value={motif}
                  onChange={(e) => setMotif(e.target.value)}
                >
                  <option value="" style={{ color: '#111', background: '#fff' }}>
                    Choisir un motif…
                  </option>
                  {motifOptions.map((o) => (
                    <option
                      key={o}
                      value={o}
                      style={{ color: '#111', background: '#fff' }}
                    >
                      {o}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div>
                <label style={labelStyle} htmlFor="sc-message">
                  Message (facultatif)
                </label>
                <textarea
                  id="sc-message"
                  rows={3}
                  style={{
                    ...fieldBase,
                    resize: 'vertical',
                    minHeight: 80,
                  }}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Précisez votre demande ou vos disponibilités…"
                />
              </div>

              <div style={{ textAlign: 'center', marginTop: 8 }}>
                <TealButton filled type="submit">
                  Envoyer ma demande
                </TealButton>
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
  const foot: React.CSSProperties = {
    background: C.bgDarkAlt,
    borderTop: '1px solid rgba(26,138,154,0.14)',
    padding: 'clamp(64px,8vw,100px) clamp(24px,6vw,96px) 40px',
  };

  const cols: { title: string; items: { label: string; href: string }[] }[] = [
    {
      title: 'Soins',
      items: [
        { label: 'Soins conservateurs', href: '#soins' },
        { label: 'Traitement de canal', href: '#soins' },
        { label: 'Inlays / Onlays', href: '#soins' },
        { label: 'Chirurgie orale', href: '#soins' },
      ],
    },
    {
      title: 'Esthétique',
      items: [
        { label: 'Blanchiment LED', href: '#esthetique' },
        { label: 'Facettes e.max', href: '#esthetique' },
        { label: 'Composite direct', href: '#esthetique' },
        { label: 'Implantologie', href: '#technologie' },
      ],
    },
    {
      title: 'Contact & Urgences',
      items: [
        { label: 'Prendre RDV', href: '#rdv' },
        { label: 'Cabinet · Lyon 6e', href: '#rdv' },
        { label: 'Urgence dentaire', href: '#rdv' },
        { label: 'Accès & horaires', href: '#rdv' },
      ],
    },
  ];

  return (
    <footer style={foot}>
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.5fr repeat(3, 1fr)',
          gap: 'clamp(32px,4.6vw,64px)',
        }}
        className="sc-footgrid"
      >
        {/* Brand */}
        <div>
          <div
            style={{
              fontFamily: SANS,
              fontSize: 20,
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: C.white,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 9,
            }}
          >
            Smile &amp; Co
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: C.accent,
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
              color: 'rgba(200,234,240,0.58)',
              marginTop: 18,
              maxWidth: 320,
            }}
          >
            Cabinet dentaire esthétique au cœur de Lyon 6e. Soins, esthétique
            et implantologie pour toute la famille.
          </p>
          <div
            style={{
              marginTop: 24,
              fontFamily: SANS,
              fontSize: 10.5,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'rgba(200,234,240,0.45)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span style={{ color: C.accent }}>◎</span>
            Lyon 6e · Rhône
          </div>
        </div>

        {/* Colonnes */}
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
                fontWeight: 600,
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
                      color: 'rgba(200,234,240,0.65)',
                      textDecoration: 'none',
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

      {/* Bottom bar */}
      <div
        style={{
          maxWidth: 1240,
          margin: '60px auto 0',
          paddingTop: 26,
          borderTop: '1px solid rgba(26,138,154,0.12)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 14,
          fontFamily: SANS,
          fontSize: 10.5,
          letterSpacing: '0.10em',
          color: 'rgba(200,234,240,0.38)',
        }}
      >
        <span>© 2025–2026 Smile &amp; Co · Cabinet Dentaire · Lyon 6e</span>
        <span style={{ display: 'flex', gap: 22 }}>
          <a href="#rdv" style={{ color: 'inherit', textDecoration: 'none' }}>
            Mentions légales
          </a>
          <a href="#rdv" style={{ color: 'inherit', textDecoration: 'none' }}>
            Politique de confidentialité
          </a>
        </span>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .sc-footgrid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .sc-footgrid { grid-template-columns: 1fr !important; }
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
    fontFamily: SERIF,
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
      {/* Google Fonts */}
      <style>{`@import url('${FONTS_URL}');`}</style>

      {/* Responsive overrides globales */}
      <style>{`
        @media (max-width: 860px) {
          .sc-navlinks { display: none !important; }
        }
        *, *::before, *::after { box-sizing: border-box; }
        img { display: block; }
        button { font-family: inherit; }
        select option { font-family: system-ui, sans-serif; }
        input::placeholder, textarea::placeholder {
          color: rgba(200,234,240,0.32);
        }
        input:focus, textarea:focus, select:focus {
          border-bottom-color: rgba(26,138,154,0.7) !important;
        }
      `}</style>

      <Nav />
      <Hero />
      <Intro />
      <TreatmentSequence />
      <SpecialtyCards />
      <EditorialRows />
      <TechPanel />
      <Testimonials />
      <AppointmentForm />
      <Footer />
    </main>
  );
}
