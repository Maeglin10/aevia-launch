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
import { ArrowRight, ChevronDown, MapPin, Quote, Trophy } from 'lucide-react';

/* ════════════════════════════════════════════════════════════════════════════
   KINESPORT ÉLITE — Kinésithérapie du Sport & Rééducation · Paris 15e
   Template premium Next.js 'use client'. Chorégraphie de défilement éditoriale,
   crossfade 320vh, panneau collant, formulaire interactif.
   ════════════════════════════════════════════════════════════════════════════ */

/* ── Palette ─────────────────────────────────────────────────────────────── */
// Lightens (positive percent) or darkens (negative) a #rrggbb hex color —
// used to derive companion shades from the client's brand color.
function shadeColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  if (isNaN(num)) return hex;
  const amt = Math.round(2.55 * percent);
  const r = Math.max(0, Math.min(255, (num >> 16) + amt));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amt));
  const b = Math.max(0, Math.min(255, (num & 0x0000ff) + amt));
  return `#${(0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1)}`;
}

let C: Record<string, string> = {
  bg: '#f4f6f2',
  bgAlt: '#e8eee4',
  bgDark: '#0c1a10',
  bgDarkAlt: '#081208',
  bgCard: '#ffffff',
  accent: '#2d7a4a',
  accentDark: '#226038',
  accentLight: '#c4dccc',
  white: '#ffffff',
  ink: '#0c1a10',
  textMuted: '#2c4a30',
  textFaint: '#6a8a6e',
  border: '#c0d4c4',
  borderDark: 'rgba(45,122,74,0.2)',
  orange: '#e05c20',
};

const SERIF = "'Playfair Display', Georgia, serif" as const;
const SANS = "'Barlow', system-ui, sans-serif" as const;

/* ── Easing partagé ──────────────────────────────────────────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ── Google Fonts ────────────────────────────────────────────────────────── */
const FONTS_CSS = `@import url('https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap');`;

/* ════════════════════════════════════════════════════════════════════════════
   TypeScript Interfaces
   ════════════════════════════════════════════════════════════════════════════ */

interface Protocol {
  id: string;
  index: string;
  label: string;
  title: string;
  body: string;
  imgId: string;
}

interface Specialty {
  title: string;
  icon: string;
}

interface EditRow {
  eyebrow: string;
  imgId: string;
  imgW: number;
  reverse: boolean;
  romanNumeral: string;
  titleLine1: string;
  titleLine2: string;
  bodyLines: string[];
}

interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

interface MethodItem {
  number: string;
  title: string;
  body: string;
}

/* ════════════════════════════════════════════════════════════════════════════
   Data
   ════════════════════════════════════════════════════════════════════════════ */

const PROTOCOLS: Protocol[] = [
  {
    id: 'sport',
    index: 'I',
    label: 'BLESSURES SPORTIVES',
    title: 'Blessures sportives',
    body: 'Entorses, déchirures musculaires, tendinites — protocoles de récupération validés par les staffs de ligue 1.',
    imgId: '1544367745-a81e18eb7be2',
  },
  {
    id: 'postop',
    index: 'II',
    label: 'POST-OPÉRATOIRE',
    title: 'Post-opératoire',
    body: 'Ligament croisé, ménisque, épaule — rééducation progressive avec objectifs de reprise fixés dès J1.',
    imgId: '1498804103-78838778a06b',
  },
  {
    id: 'perf',
    index: 'III',
    label: 'PERFORMANCE',
    title: 'Performance',
    body: 'Biomécanique de course, prévention des blessures, optimisation gestuelle — pour aller plus loin sans se blesser.',
    imgId: '1506126613-423d21668e8b',
  },
];

const SPECIALTIES: Specialty[] = [
  { title: 'Blessures sportives', icon: '⚡' },
  { title: 'Rééducation post-op', icon: '🔬' },
  { title: 'Lombalgies & cervicalgies', icon: '🩻' },
  { title: 'Kinésithérapie respiratoire', icon: '🫁' },
  { title: 'Préparation physique', icon: '💪' },
  { title: 'Électrothérapie & ultrasons', icon: '⚙️' },
];

const EDIT_ROWS: EditRow[] = [
  {
    eyebrow: 'Notre expertise',
    imgId: '1544367745-a81e18eb7be2',
    imgW: 800,
    reverse: false,
    romanNumeral: 'I',
    titleLine1: 'Retour au jeu /',
    titleLine2: 'optimisé.',
    bodyLines: [
      'Partenaire officiel de trois clubs sportifs parisiens, notre cabinet intègre des kinésithérapeutes du sport formés aux protocoles des staffs professionnels.',
      'Chaque plan de rééducation est co-construit avec le sportif : objectifs de reprise, délais réalistes, critères de retour validés par nos praticiens.',
    ],
  },
  {
    eyebrow: "L'équipement",
    imgId: '1498804103-78838778a06b',
    imgW: 800,
    reverse: true,
    romanNumeral: 'II',
    titleLine1: 'Plateau technique /',
    titleLine2: 'complet.',
    bodyLines: [
      'Isocinétisme, bain à remous de kinésithérapie, plateforme vibratoire, analyse vidéo biomécanique de course — un équipement de niveau centre médical du sport.',
      "Nos outils permettent de mesurer objectivement les progrès et d'ajuster les protocoles en temps réel.",
    ],
  },
];

const METHOD_ITEMS: MethodItem[] = [
  {
    number: '01',
    title: 'Bilan fonctionnel initial',
    body: 'Test de force, amplitude articulaire, seuils de douleur — un diagnostic complet avant toute prise en charge.',
  },
  {
    number: '02',
    title: 'Protocole individualisé',
    body: "Pas de « programme standard ». Chaque patient reçoit un plan construit sur son profil, son sport et ses objectifs précis.",
  },
  {
    number: '03',
    title: 'Exercices proprioceptifs & renforcement progressif',
    body: 'Progression par paliers mesurables : force, stabilité, coordination — rééducation neuromusculaire intégrée.',
  },
  {
    number: '04',
    title: 'Retour sport accompagné',
    body: 'Test de reprise validé par nos kinés + plan de prévention personnalisé pour éviter les récidives.',
  },
];

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Coureur amateur avec des douleurs récurrentes au genou, j'avais presque renoncé à courir. Après 8 séances chez KinéSport Élite, j'ai repris l'entraînement marathon. Leur approche biomécanique a tout changé.",
    name: 'Thomas R.',
    role: 'Coureur amateur · Paris',
  },
  {
    quote:
      "Opéré du ligament croisé en janvier, les médecins m'annonçaient 9 mois de rééducation. Grâce au protocole individualisé de l'équipe, j'ai repris avec mon club de handball 6 mois avant le calendrier prévu.",
    name: 'Yasmine B.',
    role: 'Handballeuse semi-pro · Paris 15e',
  },
];

/* ── Photo helper ─────────────────────────────────────────────────────────── */
function photo(id: string, w = 1600): string {
  return `https://images.unsplash.com/photo-${id}?q=80&w=${w}&auto=format&fit=crop`;
}

/* ════════════════════════════════════════════════════════════════════════════
   Primitives partagées
   ════════════════════════════════════════════════════════════════════════════ */

/** Étiquette fine, capitales, interlettrage large. */
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
    letterSpacing: '0.40em',
    textTransform: 'uppercase',
    color,
    fontWeight: 600,
  };
  return (
    <div style={wrap}>
      <span style={rule} />
      <span style={label}>{children}</span>
      {align === 'center' && <span style={rule} />}
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
      transition={{ duration: 1.05, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Bouton vert, contour ou plein, flèche animée au survol. */
function GreenButton({
  children,
  onClick,
  filled = false,
  type = 'button',
  small = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  filled?: boolean;
  type?: 'button' | 'submit';
  small?: boolean;
}) {
  const [hover, setHover] = useState(false);
  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 10,
    padding: small ? '11px 22px' : '14px 28px',
    fontFamily: SANS,
    fontSize: small ? 11 : 12,
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    fontWeight: 600,
    cursor: 'pointer',
    border: `1.5px solid ${C.accent}`,
    background: filled
      ? hover
        ? C.accentDark
        : C.accent
      : hover
        ? 'rgba(45,122,74,0.08)'
        : 'transparent',
    color: filled ? C.white : hover ? C.accentDark : C.accent,
    transition: 'all .45s cubic-bezier(.16,1,.3,1)',
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
          transition: 'transform .45s cubic-bezier(.16,1,.3,1)',
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
    const onScroll = () => setSolid(window.scrollY > 72);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: 'Soins', href: '#soins' },
    { label: 'Méthode', href: '#methode' },
    { label: 'Équipement', href: '#equipement' },
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
    background: solid ? 'rgba(12,26,16,0.95)' : 'transparent',
    backdropFilter: solid ? 'blur(16px) saturate(130%)' : 'none',
    WebkitBackdropFilter: solid ? 'blur(16px) saturate(130%)' : 'none',
    borderBottom: solid
      ? `1px solid rgba(45,122,74,0.3)`
      : '1px solid transparent',
    transition: 'all .55s cubic-bezier(.16,1,.3,1)',
  };

  const brand: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 'clamp(15px,1.8vw,18px)',
    fontWeight: 600,
    color: C.white,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  };

  const linkRow: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'clamp(20px,2.6vw,40px)',
  };

  return (
    <>
      <nav style={bar}>
      <a href="#hero" style={brand}>
        {fd?.logoBase64 ? (
          // Client logo (uploaded in the brief) replaces the placeholder mark —
          // essential for the client to recognise their brand in the render.
          <img
            src={fd.logoBase64}
            alt={fd?.businessName ?? 'logo'}
            style={{ height: 28, maxWidth: 160, objectFit: 'contain', display: 'block' }}
          />
        ) : (
          <>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: C.accent,
                flexShrink: 0,
              }}
            />
            KinéSport&nbsp;Élite
          </>
        )}
      </a>
      <div style={linkRow} className="ks-navlinks">
        {links.map((l) => (
          <NavLink key={l.label} label={l.label} href={l.href} />
        ))}
      </div>
      <div className="ks-navcta">
        <a href="#rdv" style={{ textDecoration: 'none' }}>
          <GreenButton filled small>
            Prendre RDV
          </GreenButton>
        </a>
      </div>
      
        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="ks-burger"
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
        @media (max-width:860px){
          .ks-navlinks{ display:none !important; }
          .ks-burger { display: flex !important; flex-direction: column; }
          .ks-navcta{ display:none !important; }
        }
      
        /* mobile: stack 2-col grids to single column (added by responsive fix) */
        @media (max-width: 768px) {
          .imx-mobstack { grid-template-columns: 1fr !important; }
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
        fontSize: 11.5,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        fontWeight: 500,
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
          transition: 'width .45s cubic-bezier(.16,1,.3,1)',
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

  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.13]);
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);
  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '-44%']);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const sec: React.CSSProperties = {
    position: 'relative',
    height: '100dvh',
    minHeight: 640,
    overflow: 'hidden',
    background: C.bgDark,
  };

  return (
    <section ref={ref} style={sec} id="hero">
      {/* Photo parallaxe */}
      <motion.div
        style={{
          position: 'absolute',
          inset: '-6% 0 0 0',
          height: '114%',
          scale: imgScale,
          y: imgY,
        }}
      >
        <img
          src={photo('1544367745-a81e18eb7be2', 2000)}
          alt="Kinésithérapeute du sport au travail"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </motion.div>

      {/* Scrims */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(12,26,16,0.48) 0%, rgba(12,26,16,0.10) 36%, rgba(12,26,16,0.46) 68%, rgba(12,26,16,0.90) 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(130% 90% at 60% 30%, transparent 30%, rgba(12,26,16,0.5) 100%)',
          mixBlendMode: 'multiply',
        }}
      />

      {/* Contenu */}
      <motion.div
        style={{
          position: 'relative',
          zIndex: 2,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: 'clamp(24px,5vw,80px) clamp(24px,5vw,72px) clamp(56px,9vw,120px)',
          y: titleY,
          opacity: titleOpacity,
        }}
      >
        <Reveal y={18}>
          <Eyebrow color="rgba(196,220,204,0.9)">
            Kinésithérapie du sport · Paris 15e
          </Eyebrow>
        </Reveal>

        <motion.h1
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.12 }}
          style={{
            fontFamily: SERIF,
            fontWeight: 400,
            fontStyle: 'italic',
            color: C.white,
            fontSize: 'clamp(3rem,7vw,8.5rem)',
            lineHeight: 0.95,
            letterSpacing: '-0.01em',
            margin: '22px 0 0',
            textShadow: '0 10px 56px rgba(0,0,0,0.55)',
            maxWidth: '14ch',
          }}
        >
          Récupérer /{' '}
          <span style={{ color: C.accentLight }}>plus vite.</span>
        </motion.h1>

        {/* Filet orange énergie */}
        <motion.div
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.5 }}
          style={{
            height: 3,
            width: 'clamp(60px,12vw,160px)',
            background: C.orange,
            margin: '26px 0 24px',
            transformOrigin: 'left',
          }}
        />

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.42 }}
          style={{
            fontFamily: SANS,
            fontWeight: 300,
            fontSize: 'clamp(15px,1.6vw,19px)',
            color: 'rgba(255,255,255,0.84)',
            maxWidth: 480,
            lineHeight: 1.72,
            margin: '0 0 38px',
          }}
        >
          Cabinet spécialisé sport & rééducation. Protocoles validés. Retour
          terrain optimisé.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.65 }}
          style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}
        >
          <a href="#rdv" style={{ textDecoration: 'none' }}>
            <GreenButton filled>Prendre rendez-vous</GreenButton>
          </a>
          <a href="#soins" style={{ textDecoration: 'none' }}>
            <GreenButton>Nos soins</GreenButton>
          </a>
        </motion.div>
      </motion.div>

      {/* Cue défilement */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: 32,
          right: 'clamp(24px,5vw,72px)',
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
            letterSpacing: '0.38em',
            textTransform: 'uppercase',
            color: 'rgba(196,220,204,0.8)',
            writingMode: 'vertical-rl',
          }}
        >
          Défiler
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={18} color={C.accentLight} strokeWidth={1.5} />
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
    <section style={sec}>
      <Reveal>
        <p
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 'clamp(24px,3.4vw,48px)',
            lineHeight: 1.36,
            fontWeight: 400,
            color: C.ink,
            maxWidth: 900,
            margin: '0 auto',
          }}
        >
          La blessure n&apos;est pas une fin.{' '}
          <span style={{ color: C.accent }}>C&apos;est un point de départ</span>{' '}
          pour revenir plus fort.
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
   4 · ProtocolSequence — crossfade 320vh sticky
   ════════════════════════════════════════════════════════════════════════════ */
function ProtocolLayer({
  protocol,
  i,
  total,
  progress,
}: {
  protocol: Protocol;
  i: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const seg = 1 / total;
  const start = i * seg;
  const end = start + seg;
  const fadeIn = seg * 0.26;

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
        src={photo(protocol.imgId)}
        alt={protocol.title}
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

function ProtocolCaption({
  protocol,
  i,
  total,
  progress,
}: {
  protocol: Protocol;
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
        justifyContent: 'flex-end',
        padding: 'clamp(36px,5vw,80px)',
        opacity,
        y,
      }}
    >
      <div style={{ maxWidth: 640 }}>
        <span
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 'clamp(48px,8vw,100px)',
            color: `rgba(45,122,74,0.28)`,
            lineHeight: 1,
            display: 'block',
            marginBottom: 6,
          }}
        >
          {protocol.index}
        </span>
        <h2
          style={{
            fontFamily: SERIF,
            fontSize: 'clamp(36px,5.5vw,76px)',
            fontWeight: 400,
            color: C.white,
            lineHeight: 1.05,
            margin: '0 0 18px',
            textShadow: '0 8px 36px rgba(0,0,0,0.6)',
          }}
        >
          {protocol.title}
        </h2>
        <p
          style={{
            fontFamily: SANS,
            fontWeight: 300,
            fontSize: 'clamp(15px,1.5vw,19px)',
            color: 'rgba(255,255,255,0.82)',
            lineHeight: 1.7,
            maxWidth: 480,
            margin: 0,
          }}
        >
          {protocol.body}
        </p>
      </div>

      {/* Label top-right */}
      <div
        style={{
          position: 'absolute',
          top: 'clamp(20px,4vw,60px)',
          right: 'clamp(20px,4vw,60px)',
        }}
      >
        <span
          style={{
            fontFamily: SANS,
            fontSize: 10,
            letterSpacing: '0.36em',
            textTransform: 'uppercase',
            color: C.accentLight,
            fontWeight: 500,
          }}
        >
          {protocol.label}
        </span>
      </div>
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
  const width = useTransform(progress, [i * seg, (i + 1) * seg], [10, 36]);
  return (
    <motion.div
      style={{ height: 2, width, background: C.accent, opacity, borderRadius: 2 }}
    />
  );
}

function ProtocolSequence() {
  const n = PROTOCOLS.length;
  const progress = useMotionValue(0.5 / n);
  const [active, setActive] = useState(0);
  const goTo = (i: number) => {
    setActive(i);
    progress.set((i + 0.5) / n);
  };

  return (
    <section
      style={{ height: '100dvh', overflow: 'hidden', position: 'relative', background: C.bgDark }}
      id="soins"
    >
      <div
        style={{
          position: 'relative',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {/* Images crossfade */}
        {PROTOCOLS.map((p, i) => (
          <ProtocolLayer
            key={p.id}
            protocol={p}
            i={i}
            total={PROTOCOLS.length}
            progress={progress}
          />
        ))}

        {/* Voile lisibilité */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to top, rgba(12,26,16,0.85) 0%, rgba(12,26,16,0.15) 55%, rgba(12,26,16,0.40) 100%)',
          }}
        />

        {/* Légendes */}
        {PROTOCOLS.map((p, i) => (
          <ProtocolCaption
            key={p.id}
            protocol={p}
            i={i}
            total={PROTOCOLS.length}
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
          {PROTOCOLS.map((p, i) => (
            <ProgressDot
              key={p.id}
              i={i}
              total={PROTOCOLS.length}
              progress={progress}
            />
          ))}
        </div>
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
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   5 · SpecialtyCards
   ════════════════════════════════════════════════════════════════════════════ */
function SpecialtyCard({ spec, i }: { spec: Specialty; i: number }) {
  const [hover, setHover] = useState(false);
  return (
    <Reveal delay={i * 0.07} style={{ height: '100%' }}>
      <article
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          background: C.bgCard,
          borderLeft: `4px solid ${hover ? C.accent : C.border}`,
          padding: 'clamp(24px,3vw,38px)',
          height: '100%',
          boxSizing: 'border-box',
          transform: hover ? 'translateY(-8px)' : 'none',
          boxShadow: hover
            ? '0 30px 60px -24px rgba(12,26,16,0.22)'
            : '0 8px 24px -16px rgba(12,26,16,0.12)',
          transition: 'all .5s cubic-bezier(.16,1,.3,1)',
          cursor: 'default',
        }}
      >
        <span style={{ fontSize: 28, display: 'block', marginBottom: 16 }}>
          {spec.icon}
        </span>
        <h3
          style={{
            fontFamily: SERIF,
            fontSize: 'clamp(18px,1.8vw,23px)',
            fontWeight: 400,
            color: C.ink,
            margin: '0 0 10px',
            lineHeight: 1.25,
          }}
        >
          {spec.title}
        </h3>
        <div
          style={{
            width: hover ? 48 : 24,
            height: 2,
            background: C.accent,
            transition: 'width .5s cubic-bezier(.16,1,.3,1)',
            marginTop: 12,
          }}
        />
      </article>
    </Reveal>
  );
}

function SpecialtyCards() {
  const sec: React.CSSProperties = {
    background: C.bg,
    padding: 'clamp(88px,12vw,170px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px, 100%), 1fr))',
    gap: 'clamp(18px,2.4vw,30px)',
    maxWidth: 1280,
    margin: '0 auto',
  };
  return (
    <section id="contact" style={sec}>
      <div style={{ maxWidth: 1280, margin: '0 auto 56px' }}>
        <Reveal>
          <Eyebrow>Nos spécialités</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(34px,5.2vw,68px)',
              fontWeight: 400,
              color: C.ink,
              margin: '18px 0 0',
              lineHeight: 1.06,
            }}
          >
            Chaque blessure,{' '}
            <span style={{ fontStyle: 'italic', color: C.accent }}>
              un protocole.
            </span>
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
   6 · EditorialRows
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
        style={{ width: '100%', height: '114%', objectFit: 'cover', y }}
      />
    </div>
  );
}

function EditRowItem({ row, index }: { row: EditRow; index: number }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'clamp(32px,6vw,90px)',
        alignItems: 'center',
        position: 'relative',
      }}
      className="ks-editrow"
    >
      {/* Roman numeral ghost */}
      <span
        style={{
          position: 'absolute',
          top: '-0.1em',
          right: row.reverse ? 'auto' : '-0.05em',
          left: row.reverse ? '-0.05em' : 'auto',
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontSize: 'clamp(100px,14vw,200px)',
          color: C.orange,
          opacity: 0.12,
          lineHeight: 1,
          pointerEvents: 'none',
          userSelect: 'none',
          zIndex: 0,
        }}
      >
        {row.romanNumeral}
      </span>

      {/* Image */}
      <Reveal
        y={48}
        style={{
          overflow: 'hidden',
          order: row.reverse ? 2 : 1,
          aspectRatio: '5 / 6',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <ParallaxImg src={photo(row.imgId, row.imgW)} alt={row.titleLine1} />
      </Reveal>

      {/* Texte */}
      <div
        style={{
          order: row.reverse ? 1 : 2,
          position: 'relative',
          zIndex: 1,
        }}
        id={index === 1 ? 'equipement' : undefined}
      >
        <Reveal>
          <Eyebrow>{row.eyebrow}</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h3
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: 'clamp(30px,4vw,56px)',
              fontWeight: 400,
              color: C.ink,
              margin: '18px 0 24px',
              lineHeight: 1.1,
            }}
          >
            {row.titleLine1}
            <br />
            {row.titleLine2}
          </h3>
        </Reveal>
        {row.bodyLines.map((line, li) => (
          <Reveal key={li} delay={0.12 + li * 0.07}>
            <p
              style={{
                fontFamily: SANS,
                fontWeight: 400,
                fontSize: 'clamp(15px,1.4vw,17px)',
                lineHeight: 1.78,
                color: C.textMuted,
                margin: '0 0 16px',
                maxWidth: 460,
              }}
            >
              {line}
            </p>
          </Reveal>
        ))}
      </div>
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
          maxWidth: 1280,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(80px,11vw,150px)',
        }}
      >
        {EDIT_ROWS.map((row, i) => (
          <EditRowItem key={row.eyebrow} row={row} index={i} />
        ))}
      </div>
      <style>{`
        @media (max-width:860px){
          .ks-editrow{ grid-template-columns:1fr !important; }
          .ks-editrow > *{ order:initial !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   7 · MethodPanel — panneau collant
   ════════════════════════════════════════════════════════════════════════════ */
function MethodPanel() {
  const sec: React.CSSProperties = {
    background: C.bgDark,
    padding: 'clamp(80px,11vw,150px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '0.9fr 1.1fr',
    gap: 'clamp(40px,6vw,96px)',
    maxWidth: 1280,
    margin: '0 auto',
    alignItems: 'start',
  };

  return (
    <section style={sec} id="methode">
      <div style={grid} className="ks-methpanel">
        {/* Image collante */}
        <div
          style={{ position: 'sticky', top: 100, alignSelf: 'start' }}
          className="ks-methpanel-sticky"
        >
          <div
            style={{
              overflow: 'hidden',
              border: `1px solid rgba(45,122,74,0.35)`,
              aspectRatio: '4 / 5',
            }}
          >
            <img
              src={photo('1506126613-423d21668e8b', 900)}
              alt="Rééducation sportive — méthode KinéSport Élite"
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
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                color: C.accentLight,
                marginBottom: 10,
              }}
            >
              Notre méthode
            </div>
            <div
              style={{
                fontFamily: SERIF,
                fontStyle: 'italic',
                fontSize: 17,
                color: 'rgba(196,220,204,0.82)',
                lineHeight: 1.6,
              }}
            >
              « Pas de programme standard — chaque sportif mérite un protocole
              sur mesure. »
            </div>
          </div>
        </div>

        {/* Piliers qui défilent */}
        <div>
          <Reveal>
            <Eyebrow color={C.accentLight}>Protocole</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(32px,4.8vw,62px)',
                fontWeight: 400,
                color: C.white,
                margin: '18px 0 52px',
                lineHeight: 1.06,
              }}
            >
              En 4 étapes /
              <br />
              <span style={{ fontStyle: 'italic', color: C.accentLight }}>
                vers la reprise.
              </span>
            </h2>
          </Reveal>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {METHOD_ITEMS.map((item, i) => (
              <Reveal key={item.number} delay={i * 0.06}>
                <div className="imx-mobstack"
                  style={{
                    padding: 'clamp(26px,3vw,40px) 0',
                    borderTop: `1px solid rgba(45,122,74,0.35)`,
                    display: 'grid',
                    gridTemplateColumns: '56px 1fr',
                    gap: 24,
                    alignItems: 'start',
                  }}
                >
                  <span
                    style={{
                      fontFamily: SANS,
                      fontSize: 'clamp(22px,2.4vw,30px)',
                      fontWeight: 700,
                      color: C.orange,
                      lineHeight: 1,
                      marginTop: 2,
                    }}
                  >
                    {item.number}
                  </span>
                  <div>
                    <h4
                      style={{
                        fontFamily: SERIF,
                        fontSize: 'clamp(18px,1.9vw,23px)',
                        fontWeight: 400,
                        color: C.white,
                        margin: '0 0 10px',
                        lineHeight: 1.2,
                      }}
                    >
                      {item.title}
                    </h4>
                    <p
                      style={{
                        fontFamily: SANS,
                        fontWeight: 300,
                        fontSize: 'clamp(14px,1.3vw,16px)',
                        lineHeight: 1.72,
                        color: 'rgba(196,220,204,0.75)',
                        margin: 0,
                      }}
                    >
                      {item.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
            <div
              style={{
                borderTop: `1px solid rgba(45,122,74,0.35)`,
                marginTop: 0,
              }}
            />
          </div>

          <Reveal delay={0.2}>
            <div style={{ marginTop: 40 }}>
              <a href="#rdv" style={{ textDecoration: 'none' }}>
                <GreenButton filled>Commencer mon bilan</GreenButton>
              </a>
            </div>
          </Reveal>
        </div>
      </div>
      <style>{`
        @media (max-width:860px){
          .ks-methpanel{ grid-template-columns:1fr !important; }
          .ks-methpanel-sticky{ position:static !important; }
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))',
    gap: 'clamp(28px,3.5vw,52px)',
    maxWidth: 1220,
    margin: '0 auto',
  };
  return (
    <section id="about" style={sec}>
      <div style={{ maxWidth: 1220, margin: '0 auto 60px', textAlign: 'center' }}>
        <Reveal>
          <Eyebrow align="center">Ils témoignent</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(32px,4.8vw,64px)',
              fontWeight: 400,
              color: C.ink,
              margin: '18px 0 0',
              lineHeight: 1.06,
            }}
          >
            Des sportifs{' '}
            <span style={{ fontStyle: 'italic', color: C.accent }}>
              qui reviennent.
            </span>
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
                padding: 'clamp(32px,4vw,50px)',
                margin: 0,
                height: '100%',
                boxSizing: 'border-box',
                boxShadow: '0 20px 50px -36px rgba(12,26,16,0.25)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Trophy
                size={30}
                color={C.orange}
                strokeWidth={1.4}
                style={{ marginBottom: 20, flexShrink: 0 }}
              />
              <Quote
                size={24}
                color={C.accentLight}
                strokeWidth={1.3}
                style={{ marginBottom: 14, flexShrink: 0 }}
              />
              <blockquote
                style={{
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  fontSize: 'clamp(17px,1.7vw,20px)',
                  lineHeight: 1.68,
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
                    fontSize: 19,
                    color: C.accent,
                    marginBottom: 4,
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
  const [tel, setTel] = useState('');
  const [motif, setMotif] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

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
    boxSizing: 'border-box',
    background: 'transparent',
    border: 'none',
    borderBottom: `1px solid rgba(45,122,74,0.45)`,
    padding: '14px 2px',
    fontFamily: SANS,
    fontWeight: 300,
    fontSize: 16,
    color: C.white,
    outline: 'none',
    transition: 'border-color .35s',
  };

  const fieldFocused: React.CSSProperties = {
    borderBottomColor: C.accent,
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 10.5,
    letterSpacing: '0.26em',
    textTransform: 'uppercase',
    color: C.accentLight,
    display: 'block',
    marginBottom: 4,
    fontWeight: 500,
  };

  const motifs = [
    'Blessure sportive',
    'Post-opératoire',
    'Lombalgies',
    'Cervicalgies',
    'Rééducation genou',
    'Autre',
  ];

  return (
    <section style={sec} id="rdv">
      {/* Fond subtil */}
      <img
        src={photo('1506126613-423d21668e8b')}
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
        }}
      >
        <Reveal>
          <Eyebrow color={C.accentLight} align="center">
            Prise en charge
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: 'clamp(36px,5.5vw,72px)',
              fontWeight: 400,
              color: C.white,
              margin: '20px 0 16px',
              lineHeight: 1.04,
              textAlign: 'center',
            }}
          >
            Prendre rendez-vous.
          </h2>
        </Reveal>
        <Reveal delay={0.14}>
          <p
            style={{
              fontFamily: SANS,
              fontWeight: 300,
              fontSize: 'clamp(15px,1.5vw,18px)',
              lineHeight: 1.72,
              color: 'rgba(196,220,204,0.8)',
              textAlign: 'center',
              margin: '0 auto 52px',
              maxWidth: 520,
            }}
          >
            Premier bilan sous 48h. Décrivez votre motif — nous confirmons le
            créneau par retour.
          </p>
        </Reveal>

        {sent ? (
          <Reveal>
            <div
              style={{
                border: `1px solid rgba(45,122,74,0.5)`,
                padding: 'clamp(36px,5vw,60px)',
                background: 'rgba(45,122,74,0.08)',
                textAlign: 'center',
              }}
            >
              <div
                style={{ fontSize: 40, marginBottom: 18, lineHeight: 1 }}
              >
                ✦
              </div>
              <h3
                style={{
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  fontSize: 'clamp(24px,3vw,36px)',
                  fontWeight: 400,
                  color: C.white,
                  margin: '0 0 14px',
                }}
              >
                Merci {prenom}, nous vous confirmons votre RDV dans les 24h.
              </h3>
              <p
                style={{
                  fontFamily: SANS,
                  fontWeight: 300,
                  fontSize: 16,
                  color: 'rgba(196,220,204,0.75)',
                  margin: 0,
                }}
              >
                Un message de confirmation sera envoyé à{' '}
                <strong style={{ color: C.accentLight, fontWeight: 500 }}>
                  {email}
                </strong>
                .
              </p>
            </div>
          </Reveal>
        ) : (
          <Reveal delay={0.2}>
            <form
              onSubmit={onSubmit}
              style={{ display: 'flex', flexDirection: 'column', gap: 32 }}
            >
              {/* Prénom */}
              <div>
                <label style={labelStyle} htmlFor="ks-prenom">
                  Prénom
                </label>
                <input
                  id="ks-prenom"
                  type="text"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  onFocus={() => setFocused('prenom')}
                  onBlur={() => setFocused(null)}
                  placeholder="Marie"
                  autoComplete="given-name"
                  style={{
                    ...fieldBase,
                    ...(focused === 'prenom' ? fieldFocused : {}),
                  }}
                />
              </div>

              {/* Email */}
              <div>
                <label style={labelStyle} htmlFor="ks-email">
                  Email
                </label>
                <input
                  id="ks-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused(null)}
                  placeholder="marie@exemple.fr"
                  autoComplete="email"
                  style={{
                    ...fieldBase,
                    ...(focused === 'email' ? fieldFocused : {}),
                  }}
                />
              </div>

              {/* Téléphone */}
              <div>
                <label style={labelStyle} htmlFor="ks-tel">
                  Téléphone
                </label>
                <input
                  id="ks-tel"
                  type="tel"
                  value={tel}
                  onChange={(e) => setTel(e.target.value)}
                  onFocus={() => setFocused('tel')}
                  onBlur={() => setFocused(null)}
                  placeholder="06 00 00 00 00"
                  autoComplete="tel"
                  style={{
                    ...fieldBase,
                    ...(focused === 'tel' ? fieldFocused : {}),
                  }}
                />
              </div>

              {/* Motif */}
              <div>
                <label style={labelStyle} htmlFor="ks-motif">
                  Motif
                </label>
                <select
                  id="ks-motif"
                  value={motif}
                  onChange={(e) => setMotif(e.target.value)}
                  onFocus={() => setFocused('motif')}
                  onBlur={() => setFocused(null)}
                  style={{
                    ...fieldBase,
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    cursor: 'pointer',
                    color: motif ? C.white : 'rgba(196,220,204,0.45)',
                    ...(focused === 'motif' ? fieldFocused : {}),
                  }}
                >
                  <option value="" style={{ color: '#111' }}>
                    Choisir un motif…
                  </option>
                  {motifs.map((m) => (
                    <option key={m} value={m} style={{ color: '#111' }}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div>
                <label style={labelStyle} htmlFor="ks-message">
                  Message (optionnel)
                </label>
                <textarea
                  id="ks-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onFocus={() => setFocused('message')}
                  onBlur={() => setFocused(null)}
                  placeholder="Décrivez votre situation, votre sport, vos disponibilités…"
                  rows={4}
                  style={{
                    ...fieldBase,
                    resize: 'none',
                    lineHeight: 1.6,
                    ...(focused === 'message' ? fieldFocused : {}),
                  }}
                />
              </div>

              <div style={{ textAlign: 'center', marginTop: 8 }}>
                <GreenButton filled type="submit">
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
   10 · Footer
   ════════════════════════════════════════════════════════════════════════════ */
function Footer() {
  const cols: { title: string; items: { label: string; href: string }[] }[] = [
    {
      title: 'Soins',
      items: [
        { label: 'Blessures sportives', href: '#soins' },
        { label: 'Post-opératoire', href: '#soins' },
        { label: 'Lombalgies', href: '#soins' },
        { label: 'Préparation physique', href: '#soins' },
      ],
    },
    {
      title: 'Méthode',
      items: [
        { label: 'Bilan initial', href: '#methode' },
        { label: 'Protocole individualisé', href: '#methode' },
        { label: 'Équipement', href: '#equipement' },
        { label: 'Retour sport', href: '#methode' },
      ],
    },
    {
      title: 'Contact',
      items: [
        { label: 'Prendre RDV', href: '#rdv' },
        { label: 'Cabinet Paris 15e', href: '#rdv' },
        { label: 'Urgence sportive', href: '#rdv' },
        { label: 'Partenariats clubs', href: '#rdv' },
      ],
    },
  ];

  const foot: React.CSSProperties = {
    background: C.bgDarkAlt,
    borderTop: `1px solid rgba(45,122,74,0.22)`,
    padding: 'clamp(64px,9vw,110px) clamp(24px,6vw,96px) 38px',
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
        className="ks-footgrid"
      >
        {/* Brand */}
        <div>
          <div
            style={{
              fontFamily: SANS,
              fontSize: 'clamp(15px,1.6vw,19px)',
              fontWeight: 600,
              color: C.white,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 20,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: C.accent,
                flexShrink: 0,
              }}
            />{fd?.businessName ?? "KinéSport Élite"}</div>
          <p
            style={{
              fontFamily: SANS,
              fontWeight: 300,
              fontSize: 15,
              lineHeight: 1.72,
              color: 'rgba(196,220,204,0.65)',
              margin: '0 0 22px',
              maxWidth: 300,
            }}
          >
            Kinésithérapie du sport &amp; rééducation. Protocoles validés par les
            staffs professionnels.
          </p>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 9,
              fontFamily: SANS,
              fontSize: 11.5,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'rgba(196,220,204,0.58)',
            }}
          >
            <MapPin size={13} color={C.accent} strokeWidth={1.6} /> Paris 15e
          </div>
        </div>

        {/* Colonnes nav */}
        {cols.map((col) => (
          <div key={col.title}>
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
                      fontWeight: 300,
                      fontSize: 15,
                      color: 'rgba(196,220,204,0.72)',
                      textDecoration: 'none',
                      transition: 'color .3s',
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLElement).style.color = C.accentLight)
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLElement).style.color =
                        'rgba(196,220,204,0.72)')
                    }
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Barre basse */}
      <div
        style={{
          maxWidth: 1280,
          margin: '60px auto 0',
          paddingTop: 26,
          borderTop: `1px solid rgba(45,122,74,0.18)`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 14,
          fontFamily: SANS,
          fontSize: 11,
          letterSpacing: '0.10em',
          color: 'rgba(196,220,204,0.46)',
        }}
      >
        <span>© 2026 KinéSport Élite · Paris 15e</span>
        <span style={{ display: 'flex', gap: 22 }}>
          <a href="#rdv" style={{ color: 'inherit', textDecoration: 'none' }}>
            Mentions légales
          </a>
          <a href="#rdv" style={{ color: 'inherit', textDecoration: 'none' }}>
            Confidentialité
          </a>
        </span>
      </div>

      <style>{`
        @media (max-width:860px){
          .ks-footgrid{ grid-template-columns:1fr 1fr !important; }
        }
        @media (max-width:520px){
          .ks-footgrid{ grid-template-columns:1fr !important; }
        }
      `}</style>
    </footer>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   Responsive global
   ════════════════════════════════════════════════════════════════════════════ */
const RESPONSIVE_CSS = `
  @media (max-width: 860px) {
    .ks-navlinks { display: none !important; }
    .ks-navcta   { display: none !important; }
    .ks-editrow  { grid-template-columns: 1fr !important; }
    .ks-editrow > * { order: initial !important; }
    .ks-methpanel { grid-template-columns: 1fr !important; }
    .ks-methpanel-sticky { position: static !important; }
    .ks-footgrid { grid-template-columns: 1fr 1fr !important; }
  }
  @media (max-width: 520px) {
    .ks-footgrid { grid-template-columns: 1fr !important; }
  }
  input, select, textarea {
    font-size: 16px !important;
  }
`;

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
  if (brand) {
    C = { ...C, accent: brand, accentLight: shadeColor(brand, 25), accentDark: shadeColor(brand, -20) };
  }

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
      <style>{FONTS_CSS}</style>
      <style>{RESPONSIVE_CSS}</style>
      <Nav />
      <Hero />
      <Intro />
      <ProtocolSequence />
      <SpecialtyCards />
      <EditorialRows />
      <MethodPanel />
      <Testimonials />
      <AppointmentForm />
      <Footer />
    </main>
  );
}
