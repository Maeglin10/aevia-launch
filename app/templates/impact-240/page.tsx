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
import { ArrowRight, ChevronDown, Zap } from 'lucide-react';

// Hoisted above the design tokens: several templates read `brand` in a
// module-level const — declaring it lower caused a TDZ ReferenceError (500).
let brand: any = null;

/* ════════════════════════════════════════════════════════════════════════════
   STUDIO ATHLETIC — Coach sportif personnel · Lyon 6e
   Photographie réelle + chorégraphie de défilement éditoriale (athletic ×
   performance × coaching premium). Auto-suffisant. 'use client'.
   ════════════════════════════════════════════════════════════════════════════ */

/* ── Google Fonts ────────────────────────────────────────────────────────── */
const FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,600;0,700;0,900;1,400&family=Barlow:wght@300;400;500;600&display=swap';

/* ── Palette ─────────────────────────────────────────────────────────────── */
const C = {
  bg: '#0a0a0a',
  bgAlt: '#111111',
  bgCard: '#161616',
  bgCardHover: '#1e1e1e',
  accent: '#e63c1e',
  accentDim: '#c02e14',
  white: '#f2f2f2',
  textMuted: '#8a8a8a',
  textFaint: '#555555',
  border: '#252525',
  borderBright: '#333333',
} as const;

const DISPLAY = "'Barlow Condensed', 'Arial Narrow', sans-serif" as const;
const BODY = "'Barlow', system-ui, sans-serif" as const;

/* ── Easing partagé ──────────────────────────────────────────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ── Interfaces TypeScript ───────────────────────────────────────────────── */
interface Program {
  id: string;
  number: string;
  caption: string;
  sub: string;
  img: string;
}

interface Offer {
  number: string;
  title: string;
  desc: string;
}

interface EditRow {
  eyebrow: string;
  ghostNumber: string;
  img: string;
  imgAlt: string;
  title: React.ReactNode;
  body: string;
  reverse: boolean;
}

interface MethodItem {
  key: string;
  title: string;
  body: string;
}

interface Transformation {
  stat: string;
  name: string;
  age: string;
  goal: string;
  quote: string;
}

/* ── Data ────────────────────────────────────────────────────────────────── */
const PHOTO_BASE = 'https://images.unsplash.com/photo-';

const PROGRAMS: Program[] = [
  {
    id: 'prive',
    number: '01',
    caption: 'COACHING PRIVÉ',
    sub: '1-on-1 avec votre coach. Bilan complet, programme sur mesure, ajusté chaque semaine selon vos résultats.',
    img: `${PHOTO_BASE}1534438327489-9e9a11e32e26?q=80&w=1600&auto=format&fit=crop`,
  },
  {
    id: 'hiit',
    number: '02',
    caption: 'HIIT & CIRCUIT',
    sub: 'Séances haute intensité en petit groupe (4 max). Brûleur de calories, renforceur de mental — 45 min chrono.',
    img: `${PHOTO_BASE}1571019613454-1cb2f99b2d8b?q=80&w=1600&auto=format&fit=crop`,
  },
  {
    id: 'nutrition',
    number: '03',
    caption: 'NUTRITION & LIFESTYLE',
    sub: 'Plan alimentaire intégré, suivi macros, sommeil et récupération. Le corps change quand la vie change.',
    img: `${PHOTO_BASE}1541534741688-7079b500b2f9?q=80&w=1600&auto=format&fit=crop`,
  },
];

const OFFERS: Offer[] = [
  {
    number: '01',
    title: 'Coaching privé',
    desc: 'Séance individuelle sur rendez-vous, programme 100 % personnalisé, bilan mensuel inclus.',
  },
  {
    number: '02',
    title: 'HIIT groupe',
    desc: 'Petits groupes de 4, intensité maximale, 45 min chrono. 3 créneaux par semaine.',
  },
  {
    number: '03',
    title: 'Bilan Corps',
    desc: 'Analyse posturale, composition corporelle, test cardio — point de départ de tout changement réel.',
  },
  {
    number: '04',
    title: 'Nutrition',
    desc: 'Plan alimentaire ajusté à vos objectifs et à votre mode de vie. Pas de régime, des habitudes.',
  },
  {
    number: '05',
    title: 'Suivi app',
    desc: 'Accès à notre application mobile : séances, nutrition, messages coach, progression en temps réel.',
  },
  {
    number: '06',
    title: 'Stage intensif',
    desc: 'Semaine immersive full-coaching : entraînement quotidien, nutrition, récupération, mindset.',
  },
];

const EDIT_ROWS: EditRow[] = [
  {
    eyebrow: 'Votre transformation',
    ghostNumber: '01',
    img: `${PHOTO_BASE}1534438327489-9e9a11e32e26?q=80&w=800&auto=format&fit=crop`,
    imgAlt: 'Séance de coaching privé au Studio Athletic Lyon',
    title: (
      <>
        PAS DE MIRACLE.{' '}
        <em style={{ color: C.accent, fontStyle: 'italic' }}>DU TRAVAIL.</em>
      </>
    ),
    body: 'Notre méthode repose sur trois ans de résultats mesurés : 94 % de nos clients atteignent leur objectif principal dans les 3 premiers mois. Pas de raccourci, pas de promesse creuse — un protocole rigoureux, un suivi humain, et des ajustements hebdomadaires basés sur vos données.',
    reverse: false,
  },
  {
    eyebrow: 'Le studio',
    ghostNumber: '02',
    img: `${PHOTO_BASE}1571019613454-1cb2f99b2d8b?q=80&w=800&auto=format&fit=crop`,
    imgAlt: 'Studio Athletic Lyon 6e — équipements professionnels',
    title: (
      <>
        LYON 6E,{' '}
        <em style={{ color: C.accent, fontStyle: 'italic' }}>
          ÉQUIPÉ POUR PERFORMER.
        </em>
      </>
    ),
    body: "600 m² dédiés à la performance, équipements professionnels renouvelés chaque année, parking privé à 50 m. Un espace pensé pour que rien ne s'interpose entre vous et vos résultats. Climatisé en été, chauffé en hiver — vous n'avez aucune excuse.",
    reverse: true,
  },
];

const METHOD_ITEMS: MethodItem[] = [
  {
    key: '01',
    title: 'Bilan initial 90 min',
    body: "Corps, objectifs, historique sportif, mode de vie, nutrition actuelle. On part de vous, pas d'un programme générique.",
  },
  {
    key: '02',
    title: 'Programme actualisé toutes les 4 semaines',
    body: 'Votre plan évolue avec vous. Chaque mois, révision complète sur la base de vos résultats réels.',
  },
  {
    key: '03',
    title: 'App mobile — suivi en temps réel',
    body: 'Séances, nutrition, historique de progression. Disponible 24/7. Votre coach répond dans la journée.',
  },
  {
    key: '04',
    title: 'Check-in hebdomadaire',
    body: 'Message ou visio de 15 min avec votre coach chaque semaine. Rien ne glisse entre les mailles.',
  },
];

const TRANSFORMATIONS: Transformation[] = [
  {
    stat: '−18 kg',
    name: 'Marie',
    age: '34 ans',
    goal: 'Perte de poids',
    quote: "En 5 mois, j'ai perdu ce que je traînais depuis 10 ans. La méthode est exigeante, les résultats sont réels.",
  },
  {
    stat: '+8 kg',
    name: 'Karim',
    age: '28 ans',
    goal: 'Prise de muscle',
    quote: 'En 6 mois de muscle net, sans prise de gras. Le suivi nutrition a tout changé.',
  },
  {
    stat: '70.3',
    name: 'Sophie',
    age: '41 ans',
    goal: 'Prépa sportive',
    quote: "Ironman 70.3 finisher. Jamais je n'aurais cru y arriver sans ce préparation structurée.",
  },
];

/* ════════════════════════════════════════════════════════════════════════════
   Primitives
   ════════════════════════════════════════════════════════════════════════════ */

/** Filet rouge 28px + label majuscule. */
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
    gap: 12,
    justifyContent: align === 'center' ? 'center' : 'flex-start',
  };
  const rule: React.CSSProperties = {
    width: 28,
    height: 2,
    background: color,
    flexShrink: 0,
  };
  const label: React.CSSProperties = {
    fontFamily: BODY,
    fontSize: 11,
    letterSpacing: '0.34em',
    textTransform: 'uppercase',
    color,
    fontWeight: 600,
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
      transition={{ duration: 1.0, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Bouton rouge avec flèche animée. */
function RedButton({
  children,
  onClick,
  outline = false,
  type = 'button',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  outline?: boolean;
  type?: 'button' | 'submit';
}) {
  const [hover, setHover] = useState(false);
  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 10,
    padding: '14px 28px',
    fontFamily: BODY,
    fontSize: 13,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    fontWeight: 600,
    cursor: 'pointer',
    border: `2px solid ${C.accent}`,
    background: outline ? 'transparent' : hover ? C.accentDim : C.accent,
    color: outline ? (hover ? C.white : C.white) : C.white,
    transition: 'all .45s cubic-bezier(.16,1,.3,1)',
    transform: hover ? 'translateY(-2px)' : 'none',
    boxShadow: hover && !outline ? `0 12px 36px -12px rgba(230,60,30,0.6)` : 'none',
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
   Navigation
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
    { label: 'Programmes', href: '#programmes' },
    { label: 'Méthode', href: '#methode' },
    { label: 'Résultats', href: '#resultats' },
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
    background: solid ? 'rgba(10,10,10,0.95)' : 'transparent',
    backdropFilter: solid ? 'blur(16px) saturate(120%)' : 'none',
    WebkitBackdropFilter: solid ? 'blur(16px) saturate(120%)' : 'none',
    borderBottom: solid
      ? `1px solid ${C.border}`
      : '1px solid transparent',
    transition: 'all .55s cubic-bezier(.16,1,.3,1)',
  };

  const brand: React.CSSProperties = {
    fontFamily: DISPLAY,
    fontSize: 22,
    fontWeight: 900,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: C.white,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  };

  const linkRow: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'clamp(20px,2.6vw,40px)',
  };

  return (
    <>
      <nav style={bar}>
      <div style={brand}>
        {fd?.logoBase64 ? (
          // Client logo (uploaded in the brief) replaces the placeholder mark —
          // essential for the client to recognise their brand in the render.
          <img
            src={fd.logoBase64}
            alt={fd?.businessName ?? 'logo'}
            style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
          />
        ) : (
          <>
            <span style={{ color: C.accent }}>▶</span>
            STUDIO ATHLETIC
          </>
        )}
      </div>
      <div style={linkRow} className="sa-navlinks">
        {links.map((l) => (
          <NavLink key={l.label} label={l.label} href={l.href} />
        ))}
      </div>
      <a href="#contact" style={{ textDecoration: 'none' }} className="sa-navlinks">
        <RedButton>Essai gratuit</RedButton>
      </a>
      
        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="sa-burger"
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
        @media (max-width: 900px) {
          .sa-navlinks { display: none !important; }
          .sa-burger { display: flex !important; flex-direction: column; }
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
        fontFamily: BODY,
        fontSize: 13,
        letterSpacing: '0.10em',
        textTransform: 'uppercase',
        fontWeight: 500,
        color: h ? C.white : C.textMuted,
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
          height: 2,
          width: h ? '100%' : '0%',
          background: C.accent,
          transition: 'width .45s cubic-bezier(.16,1,.3,1)',
        }}
      />
    </a>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   1 · HERO parallaxe 100vh
   ════════════════════════════════════════════════════════════════════════════ */
function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.18]);
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '16%']);
  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '-40%']);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);

  const section: React.CSSProperties = {
    position: 'relative',
    height: '100vh',
    minHeight: 660,
    overflow: 'hidden',
    background: C.bg,
  };

  return (
    <section id="hero" ref={ref} style={section}>
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
          src={`${PHOTO_BASE}1534438327489-9e9a11e32e26?q=80&w=2000&auto=format&fit=crop`}
          alt="Séance de coaching au Studio Athletic Lyon 6e"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </motion.div>

      {/* Scrims */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(10,10,10,0.5) 0%, rgba(10,10,10,0.10) 35%, rgba(10,10,10,0.55) 72%, rgba(10,10,10,0.93) 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(110% 80% at 70% 20%, transparent 40%, rgba(10,10,10,0.55) 100%)',
        }}
      />

      {/* Contenu bas-gauche */}
      <motion.div
        style={{
          position: 'relative',
          zIndex: 2,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding:
            'clamp(80px,12vh,130px) clamp(24px,6vw,96px) clamp(64px,10vh,110px)',
          y: titleY,
          opacity: titleOpacity,
        }}
      >
        <Reveal y={16}>
          <Eyebrow>Coach sportif personnel · Lyon</Eyebrow>
        </Reveal>

        <motion.h1
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3, ease: EASE, delay: 0.12 }}
          style={{
            fontFamily: DISPLAY,
            fontWeight: 900,
            fontStyle: 'italic',
            textTransform: 'uppercase',
            color: C.white,
            fontSize: 'clamp(4rem,13vw,14rem)',
            lineHeight: 0.85,
            letterSpacing: '-0.01em',
            margin: 'clamp(20px,3vh,36px) 0 clamp(18px,3vh,30px)',
            textShadow: '0 16px 70px rgba(0,0,0,0.55)',
          }}
        >
          LE CORPS
          <br />
          QUE VOUS
          <br />
          <span style={{ color: C.accent }}>MÉRITEZ</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.38 }}
          style={{
            fontFamily: BODY,
            fontWeight: 400,
            fontSize: 'clamp(15px,1.8vw,20px)',
            lineHeight: 1.65,
            color: 'rgba(242,242,242,0.82)',
            maxWidth: 460,
            marginBottom: 'clamp(28px,4vh,44px)',
          }}
        >
          Coaching sportif premium à Lyon 6e. Résultats garantis ou remboursés.
          Bilan offert pour toute première séance.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.62 }}
          style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}
        >
          <RedButton>Réserver un bilan</RedButton>
          <RedButton outline>Voir les programmes</RedButton>
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
          gap: 8,
          opacity: cueOpacity,
        }}
      >
        <span
          style={{
            fontFamily: BODY,
            fontSize: 10,
            letterSpacing: '0.34em',
            textTransform: 'uppercase',
            color: 'rgba(242,242,242,0.6)',
            writingMode: 'vertical-rl',
          }}
        >
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={18} color={C.accent} strokeWidth={2} />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   2 · STRIP marquee rapide
   ════════════════════════════════════════════════════════════════════════════ */
function Strip() {
  const items = [
    'COACHING PRIVÉ',
    'HIIT · CIRCUIT',
    'NUTRITION',
    'RÉSULTATS GARANTIS',
    'LYON 6E',
  ];

  const text: React.CSSProperties = {
    fontFamily: DISPLAY,
    fontWeight: 700,
    fontSize: 'clamp(14px,2vw,20px)',
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: C.accent,
    whiteSpace: 'nowrap',
    display: 'flex',
    alignItems: 'center',
    gap: 'clamp(24px,4vw,52px)',
  };

  const track: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'clamp(24px,4vw,52px)',
    animation: 'sa-marquee 18s linear infinite',
  };

  const Sep = () => (
    <Zap
      size={14}
      color={C.accent}
      fill={C.accent}
      strokeWidth={0}
      style={{ flexShrink: 0 }}
    />
  );

  return (
    <div
      style={{
        background: C.bg,
        borderTop: `1px solid ${C.border}`,
        borderBottom: `1px solid ${C.border}`,
        padding: 'clamp(16px,2.5vh,22px) 0',
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', overflow: 'hidden' }}>
        <div style={track}>
          {[...items, ...items, ...items].map((item, i) => (
            <React.Fragment key={i}>
              <span style={text}>{item}</span>
              <Sep />
            </React.Fragment>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes sa-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.333%); }
        }
      `}</style>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   3 · ProgramSequence — crossfade collant 320vh
   ════════════════════════════════════════════════════════════════════════════ */
function ProgramLayer({
  program,
  i,
  total,
  progress,
}: {
  program: Program;
  i: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const seg = 1 / total;
  const start = i * seg;
  const end = start + seg;
  const fade = seg * 0.26;

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
        src={program.img}
        alt={program.caption}
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

function ProgramCaption({
  program,
  i,
  total,
  progress,
}: {
  program: Program;
  i: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const seg = 1 / total;
  const start = i * seg;
  const end = start + seg;
  const fade = seg * 0.20;

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
        bottom: 'clamp(60px,10vh,120px)',
        left: 'clamp(24px,6vw,96px)',
        opacity,
        y,
      }}
    >
      <Eyebrow>{program.number}</Eyebrow>
      <h2
        style={{
          fontFamily: DISPLAY,
          fontWeight: 900,
          textTransform: 'uppercase',
          color: C.white,
          fontSize: 'clamp(2.8rem,8vw,9rem)',
          lineHeight: 0.88,
          letterSpacing: '-0.01em',
          margin: 'clamp(16px,2vh,24px) 0 clamp(14px,2vh,22px)',
          textShadow: '0 12px 60px rgba(0,0,0,0.6)',
        }}
      >
        {program.caption}
      </h2>
      <p
        style={{
          fontFamily: BODY,
          fontWeight: 400,
          fontSize: 'clamp(14px,1.6vw,18px)',
          lineHeight: 1.6,
          color: 'rgba(242,242,242,0.84)',
          maxWidth: 480,
        }}
      >
        {program.sub}
      </p>
    </motion.div>
  );
}

function ProgramSequence() {
  const n = PROGRAMS.length;
  const progress = useMotionValue(0.5 / n);
  const [active, setActive] = useState(0);
  const goTo = (i: number) => {
    setActive(i);
    progress.set((i + 0.5) / n);
  };

  const barScaleX = useTransform(progress, [0, 1], [0, 1]);

  return (
    <section
      id="programmes"
      style={{ height: '100vh', overflow: 'hidden', position: 'relative', background: C.bg }}
    >
      <div
        style={{
          position: 'relative',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {/* Layers image */}
        {PROGRAMS.map((p, i) => (
          <ProgramLayer
            key={p.id}
            program={p}
            i={i}
            total={PROGRAMS.length}
            progress={progress}
          />
        ))}

        {/* Voile lisibilité */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to top, rgba(10,10,10,0.86) 0%, rgba(10,10,10,0.22) 50%, rgba(10,10,10,0.40) 100%)',
          }}
        />

        {/* Section label Eyebrow top-right */}
        <div
          style={{
            position: 'absolute',
            top: 'clamp(90px,12vh,130px)',
            right: 'clamp(24px,5vw,64px)',
            zIndex: 4,
          }}
        >
          <Eyebrow align="center">NOS PROGRAMMES</Eyebrow>
        </div>

        {/* Captions */}
        {PROGRAMS.map((p, i) => (
          <ProgramCaption
            key={p.id}
            program={p}
            i={i}
            total={PROGRAMS.length}
            progress={progress}
          />
        ))}

        {/* Barre de progression rouge scaleX */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 3,
            background: C.border,
          }}
        >
          <motion.div
            style={{
              height: '100%',
              background: C.accent,
              transformOrigin: 'left',
              scaleX: barScaleX,
            }}
          />
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
   4 · OfferCards — 6 cartes
   ════════════════════════════════════════════════════════════════════════════ */
function OfferCard({ offer, i }: { offer: Offer; i: number }) {
  const [hover, setHover] = useState(false);

  const card: React.CSSProperties = {
    background: hover ? C.bgCardHover : C.bgCard,
    border: `1px solid ${hover ? C.accent : C.border}`,
    padding: 'clamp(28px,4vw,40px)',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    transition: 'all .5s cubic-bezier(.16,1,.3,1)',
    cursor: 'pointer',
    transform: hover ? 'translateY(-6px)' : 'none',
    boxShadow: hover
      ? '0 24px 60px -30px rgba(0,0,0,0.8)'
      : '0 8px 30px -20px rgba(0,0,0,0.6)',
  };

  return (
    <Reveal delay={i * 0.07}>
      <article
        style={card}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div
          style={{
            fontFamily: DISPLAY,
            fontWeight: 900,
            fontSize: 'clamp(2rem,5vw,4rem)',
            color: hover ? C.accent : C.textFaint,
            lineHeight: 1,
            transition: 'color .4s',
          }}
        >
          {offer.number}
        </div>
        <h3
          style={{
            fontFamily: DISPLAY,
            fontWeight: 700,
            fontSize: 'clamp(1.4rem,3vw,2rem)',
            textTransform: 'uppercase',
            color: C.white,
            letterSpacing: '0.02em',
            margin: 0,
          }}
        >
          {offer.title}
        </h3>
        <p
          style={{
            fontFamily: BODY,
            fontWeight: 400,
            fontSize: 'clamp(14px,1.4vw,16px)',
            lineHeight: 1.65,
            color: C.textMuted,
            margin: 0,
            flex: 1,
          }}
        >
          {offer.desc}
        </p>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            fontFamily: BODY,
            fontSize: 12,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            fontWeight: 600,
            color: hover ? C.accent : C.textFaint,
            transition: 'color .4s',
          }}
        >
          Découvrir
          <ArrowRight
            size={13}
            style={{
              transform: hover ? 'translateX(5px)' : 'none',
              transition: 'transform .45s cubic-bezier(.16,1,.3,1)',
            }}
          />
        </div>
      </article>
    </Reveal>
  );
}

function OfferCards() {
  const sec: React.CSSProperties = {
    background: C.bgAlt,
    padding: 'clamp(80px,12vw,160px) clamp(24px,6vw,96px)',
  };

  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 'clamp(16px,2vw,28px)',
    maxWidth: 1280,
    margin: '0 auto',
  };

  return (
    <section style={sec}>
      <div style={{ maxWidth: 1280, margin: '0 auto clamp(48px,7vh,72px)' }}>
        <Reveal>
          <Eyebrow>Ce qu'on fait</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: DISPLAY,
              fontWeight: 900,
              textTransform: 'uppercase',
              color: C.white,
              fontSize: 'clamp(2.2rem,6vw,6rem)',
              lineHeight: 0.9,
              letterSpacing: '-0.01em',
              margin: 'clamp(16px,2.5vh,24px) 0 0',
            }}
          >
            NOS PROGRAMMES
          </h2>
        </Reveal>
      </div>
      <div style={grid}>
        {OFFERS.map((o, i) => (
          <OfferCard key={o.number} offer={o} i={i} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   5 · EditorialRows — 2 lignes alternées image / texte
   ════════════════════════════════════════════════════════════════════════════ */
function ParallaxImg({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);
  return (
    <div
      ref={ref}
      style={{ width: '100%', height: '100%', overflow: 'hidden' }}
    >
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        style={{
          width: '100%',
          height: '116%',
          objectFit: 'cover',
          display: 'block',
          y,
        }}
      />
    </div>
  );
}

function EditRow({ row }: { row: EditRow }) {
  const wrap: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 'clamp(32px,5vw,80px)',
    alignItems: 'center',
  };

  const imgWrap: React.CSSProperties = {
    overflow: 'hidden',
    aspectRatio: '4 / 5',
    order: row.reverse ? 2 : 1,
    position: 'relative',
  };

  const txtWrap: React.CSSProperties = {
    order: row.reverse ? 1 : 2,
    position: 'relative',
  };

  return (
    <div style={wrap} className="sa-editrow">
      <Reveal y={50} style={imgWrap}>
        <ParallaxImg src={row.img} alt={row.imgAlt} />
      </Reveal>
      <div style={txtWrap}>
        {/* Ghost number */}
        <div
          aria-hidden="true"
          style={{
            fontFamily: DISPLAY,
            fontWeight: 900,
            fontSize: 'clamp(6rem,16vw,18rem)',
            color: 'transparent',
            WebkitTextStroke: `1px ${C.border}`,
            lineHeight: 1,
            position: 'absolute',
            top: '-0.2em',
            left: '-0.1em',
            userSelect: 'none',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        >
          {row.ghostNumber}
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Reveal>
            <Eyebrow>{row.eyebrow}</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h3
              style={{
                fontFamily: DISPLAY,
                fontWeight: 900,
                fontSize: 'clamp(2rem,5vw,5.5rem)',
                lineHeight: 0.9,
                letterSpacing: '-0.01em',
                color: C.white,
                margin: 'clamp(16px,2.5vh,24px) 0 clamp(18px,3vh,28px)',
                textTransform: 'uppercase',
              }}
            >
              {row.title}
            </h3>
          </Reveal>
          <Reveal delay={0.16}>
            <p
              style={{
                fontFamily: BODY,
                fontWeight: 400,
                fontSize: 'clamp(15px,1.6vw,18px)',
                lineHeight: 1.75,
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
        @media (max-width: 900px) {
          .sa-editrow { grid-template-columns: 1fr !important; }
          .sa-editrow > * { order: initial !important; }
        }
      `}</style>
    </div>
  );
}

function EditorialRows() {
  const sec: React.CSSProperties = {
    background: C.bgAlt,
    padding: 'clamp(80px,11vw,150px) clamp(24px,6vw,96px)',
  };

  return (
    <section style={sec}>
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(80px,12vw,160px)',
        }}
      >
        {EDIT_ROWS.map((row) => (
          <EditRow key={row.ghostNumber} row={row} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   6 · MethodPanel — sticky image gauche, scroll droit
   ════════════════════════════════════════════════════════════════════════════ */
function MethodPanel() {
  const sec: React.CSSProperties = {
    background: C.bg,
    padding: 'clamp(80px,11vw,150px) clamp(24px,6vw,96px)',
  };

  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '0.95fr 1.05fr',
    gap: 'clamp(40px,6vw,96px)',
    maxWidth: 1280,
    margin: '0 auto',
    alignItems: 'start',
  };

  const stickyImg: React.CSSProperties = {
    position: 'sticky',
    top: 100,
    alignSelf: 'start',
    overflow: 'hidden',
  };

  return (
    <section style={sec} id="methode">
      <div style={grid} className="sa-methpanel">
        {/* Image collante */}
        <div style={stickyImg} className="sa-methpanel-sticky">
          <div style={{ overflow: 'hidden', aspectRatio: '4 / 5' }}>
            <img
              src={`${PHOTO_BASE}1571019613454-1cb2f99b2d8b?q=80&w=900&auto=format&fit=crop`}
              alt="Coach Studio Athletic Lyon — méthode d'entraînement"
              loading="lazy"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </div>
          <div
            style={{
              padding: 'clamp(20px,3vw,32px)',
              background: C.accent,
              marginTop: -1,
            }}
          >
            <div
              style={{
                fontFamily: DISPLAY,
                fontWeight: 900,
                fontSize: 'clamp(1.4rem,3vw,2.2rem)',
                color: C.white,
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
              }}
            >
              MÉTHODE PROUVÉE
            </div>
            <div
              style={{
                fontFamily: BODY,
                fontWeight: 400,
                fontSize: 'clamp(13px,1.4vw,15px)',
                color: 'rgba(242,242,242,0.88)',
                marginTop: 6,
              }}
            >
              94 % d'objectifs atteints en 3 mois
            </div>
          </div>
        </div>

        {/* Contenu qui défile à droite */}
        <div>
          <Reveal>
            <Eyebrow>Notre approche</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2
              style={{
                fontFamily: DISPLAY,
                fontWeight: 900,
                textTransform: 'uppercase',
                fontSize: 'clamp(2.2rem,5.5vw,5.5rem)',
                lineHeight: 0.88,
                letterSpacing: '-0.01em',
                color: C.white,
                margin: 'clamp(16px,2.5vh,24px) 0 clamp(40px,6vh,64px)',
              }}
            >
              COMMENT
              <br />
              ÇA MARCHE
            </h2>
          </Reveal>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {METHOD_ITEMS.map((item, i) => (
              <Reveal key={item.key} delay={0.05 * i}>
                <div
                  style={{
                    padding: 'clamp(28px,4vw,40px) 0',
                    borderTop: `1px solid ${C.border}`,
                    display: 'flex',
                    gap: 'clamp(20px,3vw,36px)',
                    alignItems: 'flex-start',
                  }}
                >
                  <span
                    style={{
                      fontFamily: DISPLAY,
                      fontWeight: 900,
                      fontSize: 'clamp(2rem,4vw,3.5rem)',
                      color: C.accent,
                      lineHeight: 1,
                      minWidth: 56,
                      flexShrink: 0,
                    }}
                  >
                    {item.key}
                  </span>
                  <div>
                    <h4
                      style={{
                        fontFamily: DISPLAY,
                        fontWeight: 700,
                        fontSize: 'clamp(1.2rem,2.5vw,1.9rem)',
                        textTransform: 'uppercase',
                        color: C.white,
                        letterSpacing: '0.02em',
                        margin: '0 0 10px',
                      }}
                    >
                      {item.title}
                    </h4>
                    <p
                      style={{
                        fontFamily: BODY,
                        fontWeight: 400,
                        fontSize: 'clamp(14px,1.5vw,17px)',
                        lineHeight: 1.68,
                        color: C.textMuted,
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
        @media (max-width: 900px) {
          .sa-methpanel { grid-template-columns: 1fr !important; }
          .sa-methpanel-sticky { position: static !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   7 · Transformations — 3 cartes before/after
   ════════════════════════════════════════════════════════════════════════════ */
function TransformationCard({
  t,
  i,
}: {
  t: Transformation;
  i: number;
}) {
  const [hover, setHover] = useState(false);

  const card: React.CSSProperties = {
    background: hover ? C.bgCardHover : C.bgCard,
    border: `1px solid ${hover ? C.accent : C.border}`,
    padding: 'clamp(28px,4vw,44px)',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    transition: 'all .5s cubic-bezier(.16,1,.3,1)',
    transform: hover ? 'translateY(-8px)' : 'none',
    boxShadow: hover
      ? '0 28px 64px -32px rgba(0,0,0,0.8)'
      : '0 8px 30px -20px rgba(0,0,0,0.5)',
    cursor: 'default',
  };

  return (
    <Reveal delay={i * 0.10} style={{ height: '100%' }}>
      <article
        style={card}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div
          style={{
            fontFamily: DISPLAY,
            fontWeight: 900,
            fontSize: 'clamp(3rem,8vw,7rem)',
            color: C.accent,
            lineHeight: 0.85,
            letterSpacing: '-0.02em',
          }}
        >
          {t.stat}
        </div>
        <div
          style={{
            borderTop: `1px solid ${C.border}`,
            paddingTop: 18,
            marginTop: 4,
          }}
        >
          <div
            style={{
              fontFamily: DISPLAY,
              fontWeight: 700,
              fontSize: 'clamp(1.2rem,2.5vw,1.6rem)',
              textTransform: 'uppercase',
              color: C.white,
              letterSpacing: '0.02em',
            }}
          >
            {t.name}
          </div>
          <div
            style={{
              fontFamily: BODY,
              fontSize: 12,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: C.textFaint,
              marginTop: 4,
            }}
          >
            {t.age} · {t.goal}
          </div>
        </div>
        <blockquote
          style={{
            fontFamily: BODY,
            fontWeight: 400,
            fontStyle: 'italic',
            fontSize: 'clamp(14px,1.5vw,17px)',
            lineHeight: 1.68,
            color: C.textMuted,
            margin: 0,
            borderLeft: `2px solid ${C.accent}`,
            paddingLeft: 16,
          }}
        >
          "{t.quote}"
        </blockquote>
      </article>
    </Reveal>
  );
}

function Transformations() {
  const sec: React.CSSProperties = {
    background: C.bgAlt,
    padding: 'clamp(80px,12vw,160px) clamp(24px,6vw,96px)',
  };

  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 'clamp(16px,2.5vw,32px)',
    maxWidth: 1280,
    margin: '0 auto',
  };

  return (
    <section style={sec} id="resultats">
      <div style={{ maxWidth: 1280, margin: '0 auto clamp(48px,7vh,72px)' }}>
        <Reveal>
          <Eyebrow>Ils ont fait le saut</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: DISPLAY,
              fontWeight: 900,
              textTransform: 'uppercase',
              fontSize: 'clamp(2.2rem,6vw,6rem)',
              lineHeight: 0.9,
              letterSpacing: '-0.01em',
              color: C.white,
              margin: 'clamp(16px,2.5vh,24px) 0 0',
            }}
          >
            VRAIES PERSONNES.
            <br />
            <span style={{ color: C.accent }}>VRAIS RÉSULTATS.</span>
          </h2>
        </Reveal>
      </div>
      <div style={grid}>
        {TRANSFORMATIONS.map((t, i) => (
          <TransformationCard key={t.name} t={t} i={i} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   8 · BookingForm — centré 720px, champs underline
   ════════════════════════════════════════════════════════════════════════════ */
function BookingForm() {
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [objectif, setObjectif] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prenom || !email || !objectif) return;
    setSent(true);
  };

  const sec: React.CSSProperties = {
    background: C.bg,
    padding: 'clamp(96px,13vw,180px) clamp(24px,6vw,96px)',
  };

  const fieldBase: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    background: 'transparent',
    border: 'none',
    borderBottom: `1px solid ${C.borderBright}`,
    padding: 'clamp(12px,2vh,18px) 0',
    fontFamily: BODY,
    fontWeight: 400,
    fontSize: 'clamp(15px,1.6vw,18px)',
    color: C.white,
    outline: 'none',
    transition: 'border-color .3s',
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: BODY,
    fontWeight: 600,
    fontSize: 11,
    letterSpacing: '0.26em',
    textTransform: 'uppercase',
    color: C.accent,
    display: 'block',
    marginBottom: 4,
  };

  return (
    <section style={sec} id="contact">
      <div
        style={{
          maxWidth: 720,
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <Reveal>
          <Eyebrow align="center">Prêt à commencer ?</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: DISPLAY,
              fontWeight: 900,
              textTransform: 'uppercase',
              fontSize: 'clamp(2.4rem,7vw,7rem)',
              lineHeight: 0.88,
              letterSpacing: '-0.01em',
              color: C.white,
              margin: 'clamp(16px,2.5vh,24px) 0 clamp(14px,2vh,22px)',
            }}
          >
            RÉSERVER
            <br />
            UN BILAN
          </h2>
        </Reveal>
        <Reveal delay={0.14}>
          <p
            style={{
              fontFamily: BODY,
              fontWeight: 400,
              fontSize: 'clamp(14px,1.6vw,17px)',
              lineHeight: 1.68,
              color: C.textMuted,
              maxWidth: 500,
              margin: '0 auto clamp(40px,6vh,64px)',
            }}
          >
            Premier bilan 100 % offert. On regarde ensemble où vous en êtes,
            ce que vous voulez atteindre, et comment y arriver.
          </p>
        </Reveal>

        {sent ? (
          <Reveal>
            <div
              style={{
                border: `1px solid ${C.accent}`,
                padding: 'clamp(36px,5vw,56px)',
                background: 'rgba(230,60,30,0.06)',
              }}
            >
              <div
                style={{
                  fontSize: '2.5rem',
                  marginBottom: 16,
                }}
              >
                🔥
              </div>
              <h3
                style={{
                  fontFamily: DISPLAY,
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  fontSize: 'clamp(1.8rem,4vw,3rem)',
                  color: C.white,
                  margin: '0 0 12px',
                }}
              >
                C&apos;est parti, {prenom} 🔥
              </h3>
              <p
                style={{
                  fontFamily: BODY,
                  fontWeight: 400,
                  fontSize: 'clamp(14px,1.5vw,17px)',
                  color: C.textMuted,
                  margin: 0,
                }}
              >
                On revient vers vous à{' '}
                <strong style={{ color: C.accent }}>{email}</strong> dans les
                24h pour fixer votre bilan.
              </p>
            </div>
          </Reveal>
        ) : (
          <Reveal delay={0.20}>
            <form
              onSubmit={onSubmit}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'clamp(24px,4vh,36px)',
                textAlign: 'left',
              }}
            >
              <div>
                <label style={labelStyle} htmlFor="sa-prenom">
                  Prénom
                </label>
                <input
                  id="sa-prenom"
                  type="text"
                  style={fieldBase}
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  placeholder="Votre prénom"
                  autoComplete="given-name"
                  required
                />
              </div>
              <div>
                <label style={labelStyle} htmlFor="sa-email">
                  Email
                </label>
                <input
                  id="sa-email"
                  type="email"
                  style={fieldBase}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.fr"
                  autoComplete="email"
                  required
                />
              </div>
              <div>
                <label style={labelStyle} htmlFor="sa-tel">
                  Téléphone
                </label>
                <input
                  id="sa-tel"
                  type="tel"
                  style={fieldBase}
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  placeholder="06 00 00 00 00"
                  autoComplete="tel"
                />
              </div>
              <div>
                <label style={labelStyle} htmlFor="sa-objectif">
                  Objectif
                </label>
                <select
                  id="sa-objectif"
                  style={{
                    ...fieldBase,
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    cursor: 'pointer',
                    color: objectif ? C.white : C.textFaint,
                  }}
                  value={objectif}
                  onChange={(e) => setObjectif(e.target.value)}
                  required
                >
                  <option value="" style={{ color: '#111', background: '#111' }}>
                    Choisir un objectif…
                  </option>
                  <option
                    value="Perte de poids"
                    style={{color: '#fff', background: brand ?? '#161616' }}
                  >
                    Perte de poids
                  </option>
                  <option
                    value="Prise de muscle"
                    style={{color: '#fff', background: brand ?? '#161616' }}
                  >
                    Prise de muscle
                  </option>
                  <option
                    value="Remise en forme"
                    style={{color: '#fff', background: brand ?? '#161616' }}
                  >
                    Remise en forme
                  </option>
                  <option
                    value="Préparation sportive"
                    style={{color: '#fff', background: brand ?? '#161616' }}
                  >
                    Préparation sportive
                  </option>
                  <option
                    value="Autre"
                    style={{color: '#fff', background: brand ?? '#161616' }}
                  >
                    Autre
                  </option>
                </select>
              </div>
              <div>
                <label style={labelStyle} htmlFor="sa-message">
                  Message (optionnel)
                </label>
                <textarea
                  id="sa-message"
                  rows={4}
                  style={{
                    ...fieldBase,
                    resize: 'vertical',
                    minHeight: 90,
                  }}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Parlez-nous de votre situation, de vos contraintes…"
                />
              </div>
              <div style={{ textAlign: 'center', marginTop: 8 }}>
                <RedButton type="submit">Envoyer ma demande</RedButton>
              </div>
            </form>
          </Reveal>
        )}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   9 · Footer — 4 colonnes
   ════════════════════════════════════════════════════════════════════════════ */
function Footer() {
  const cols: { title: string; items: { label: string; href: string }[] }[] = [
    {
      title: 'Programmes',
      items: [
        { label: 'Coaching privé', href: '#programmes' },
        { label: 'HIIT groupe', href: '#programmes' },
        { label: 'Bilan Corps', href: '#programmes' },
        { label: 'Nutrition', href: '#programmes' },
      ],
    },
    {
      title: 'Studio',
      items: [
        { label: 'Notre méthode', href: '#methode' },
        { label: 'Résultats', href: '#resultats' },
        { label: 'Le coach', href: '#methode' },
        { label: 'Tarifs', href: '#programmes' },
      ],
    },
    {
      title: 'Légal',
      items: [
        { label: 'Mentions légales', href: '#contact' },
        { label: 'Confidentialité', href: '#contact' },
        { label: 'CGV', href: '#contact' },
        { label: 'Contact', href: '#contact' },
      ],
    },
  ];

  const foot: React.CSSProperties = {
    background: C.bg,
    borderTop: `1px solid ${C.border}`,
    padding: 'clamp(64px,9vw,110px) clamp(24px,6vw,96px) 40px',
  };

  return (
    <footer style={foot}>
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.6fr repeat(3, 1fr)',
          gap: 'clamp(32px,5vw,64px)',
        }}
        className="sa-footgrid"
      >
        {/* Brand col */}
        <div>
          <div
            style={{
              fontFamily: DISPLAY,
              fontWeight: 900,
              fontSize: 'clamp(1.4rem,3vw,2rem)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: C.white,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span style={{ color: C.accent }}>▶</span>
            STUDIO ATHLETIC
          </div>
          <p
            style={{
              fontFamily: BODY,
              fontWeight: 400,
              fontSize: 'clamp(14px,1.4vw,16px)',
              lineHeight: 1.7,
              color: C.textMuted,
              marginTop: 18,
              maxWidth: 320,
            }}
          >
            Coach sportif personnel premium à Lyon 6e. Résultats garantis,
            méthode prouvée, suivi 24/7.
          </p>
          <div
            style={{
              marginTop: 22,
              fontFamily: BODY,
              fontSize: 12,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: C.textFaint,
            }}
          >
            📍 Lyon 6e · Rhône · France
          </div>
          <a
            href="#contact"
            style={{
              display: 'inline-block',
              marginTop: 24,
              textDecoration: 'none',
            }}
          >
            <RedButton>Bilan gratuit</RedButton>
          </a>
        </div>

        {/* Link cols */}
        {cols.map((col) => (
          <div key={col.title}>
            <div
              style={{
                fontFamily: BODY,
                fontWeight: 600,
                fontSize: 11,
                letterSpacing: '0.24em',
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
                  <FootLink label={item.label} href={item.href} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div
        style={{
          maxWidth: 1280,
          margin: 'clamp(48px,7vh,72px) auto 0',
          paddingTop: 24,
          borderTop: `1px solid ${C.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 14,
          fontFamily: BODY,
          fontSize: 12,
          letterSpacing: '0.08em',
          color: C.textFaint,
        }}
      >
        <span>© 2026 Studio Athletic. Tous droits réservés.</span>
        <span>Conçu pour performer.</span>
      </div>
      <style>{`
        @media (max-width: 900px) {
          .sa-footgrid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 520px) {
          .sa-footgrid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}

function FootLink({ label, href }: { label: string; href: string }) {
  const [h, setH] = useState(false);
  return (
    <a
      href={href}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        fontFamily: BODY,
        fontWeight: 400,
        fontSize: 'clamp(14px,1.4vw,16px)',
        color: h ? C.white : C.textMuted,
        textDecoration: 'none',
        transition: 'color .3s',
      }}
    >
      {label}
    </a>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════════════════════════════════════ */

// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
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
    color: C.white,
    fontFamily: BODY,
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
      <style>{`
        @import url('${FONTS_URL}');

        *, *::before, *::after { box-sizing: border-box; }

        ::selection {
          background: ${C.accent};
          color: ${C.white};
        }

        input::placeholder,
        textarea::placeholder {
          color: ${C.textFaint};
        }

        select option {
          background: ${C.bgCard};
          color: ${C.white};
        }

        input:focus,
        textarea:focus,
        select:focus {
          border-bottom-color: ${C.accent} !important;
        }

        /* Scroll smooth */
        html { scroll-behavior: smooth; }
      `}</style>

      <Nav />
      <Hero />
      <Strip />
      <ProgramSequence />
      <OfferCards />
      <EditorialRows />
      <MethodPanel />
      <Transformations />
      <BookingForm />
      <Footer />
    </main>
  );
}
