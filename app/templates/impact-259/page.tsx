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
import { ArrowRight, ChevronDown, Coffee, MapPin, Quote, Star } from 'lucide-react';

/* ════════════════════════════════════════════════════════════════════════════
   LE FOURNIL DU PARLEMENT — Boulangerie-Café Bistronomique · Strasbourg
   Chorégraphie scroll éditoriale : crossfade artisan 320vh, panneau sourcing
   collant, formulaire de réservation interactif. Auto-suffisant. 'use client'.
   ════════════════════════════════════════════════════════════════════════════ */

/* ── Polices ─────────────────────────────────────────────────────────────── */
const FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;1,9..144,300;1,9..144,400&family=DM+Sans:wght@300;400;500;600&display=swap';

/* ── Palette ─────────────────────────────────────────────────────────────── */
const C = {
  bg: '#faf7f0',
  bgAlt: '#f0ead8',
  bgDark: '#1a1408',
  bgDarkAlt: '#100d04',
  bgCard: '#ffffff',
  accent: '#a06828',
  accentDark: '#7a5020',
  accentLight: '#f0ddb8',
  white: '#ffffff',
  ink: '#1a1408',
  textMuted: '#4a3818',
  textFaint: '#9a8060',
  border: '#ddd0b0',
  borderDark: 'rgba(160,104,40,0.22)',
  sage: '#5a7848',
} as const;

const SERIF = "'Fraunces', Georgia, serif" as const;
const SANS = "'DM Sans', system-ui, sans-serif" as const;

/* ── Easing partagé ──────────────────────────────────────────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ════════════════════════════════════════════════════════════════════════════
   Interfaces TypeScript
   ════════════════════════════════════════════════════════════════════════════ */

interface Creation {
  id: string;
  index: string;
  label: string;
  description: string;
  imgId: string;
}

interface MenuItem {
  name: string;
  tagline: string;
  category: string;
  emoji: string;
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

interface SourcingStep {
  num: string;
  title: string;
  origin: string;
  detail: string;
}

/* ════════════════════════════════════════════════════════════════════════════
   Données
   ════════════════════════════════════════════════════════════════════════════ */

const CREATIONS: Creation[] = [
  {
    id: 'pains',
    index: 'I',
    label: 'LES PAINS',
    description:
      "Levain de seigle, semoule de blé dur, graines torréfiées maison — notre gamme s'inspire des terroirs alsacien et méditerranéen.",
    imgId: '1509440159258-1c1c3e5f3f5b',
  },
  {
    id: 'patisserie',
    index: 'II',
    label: 'LA PÂTISSERIE',
    description:
      'Kouglof, tarte flambée sucrée, millefeuille vanille Bourbon — tradition alsacienne réinterprétée avec légèreté.',
    imgId: '1546069901-ba9599a7e63c',
  },
  {
    id: 'cafe',
    index: 'III',
    label: 'LE CAFÉ',
    description:
      'Café de spécialité torréfié localement, brunch du samedi, lunch du mardi au vendredi — le carrefour du quartier.',
    imgId: '1495474472359-6f5ea1e3c9a3',
  },
];

const MENU_ITEMS: MenuItem[] = [
  {
    name: 'Pain de seigle alsacien',
    tagline: 'Levain naturel, croûte épaisse, mie serrée et parfumée.',
    category: 'Boulangerie',
    emoji: '🌾',
  },
  {
    name: 'Kouglof pur beurre',
    tagline: 'Recette traditionnelle, raisins macérés, amandes entières.',
    category: 'Pâtisserie',
    emoji: '🥐',
  },
  {
    name: 'Brunch du samedi',
    tagline: 'Buffet complet 9h–14h · viennoiseries, œufs, charcuteries locales.',
    category: 'Café & brunch',
    emoji: '☕',
  },
  {
    name: 'Lunch du midi',
    tagline: 'Formule tartine + soupe + dessert · mar–ven 12h–14h30.',
    category: 'Restauration',
    emoji: '🥗',
  },
  {
    name: 'Café de spécialité',
    tagline: 'Torréfacteur strasbourgeois, extraction filtre ou espresso.',
    category: 'Boissons',
    emoji: '☕',
  },
  {
    name: 'Commandes traiteur',
    tagline: 'Buffets, buffets sucrés, gâteaux sur mesure dès 10 pers.',
    category: 'Événements',
    emoji: '🎂',
  },
];

const EDIT_ROWS: EditRow[] = [
  {
    eyebrow: 'Notre ancrage',
    imgId: '1509440159258-1c1c3e5f3f5b?w=800',
    title: (
      <>
        Strasbourg /{' '}
        <span style={{ fontStyle: 'italic' }}>dans chaque mie.</span>
      </>
    ),
    body: 'Farine Label Rouge du Moulin Klein en Alsace, œufs de la ferme à 3 km, lait biologique de la coopérative du Bas-Rhin : chaque ingrédient porte une adresse, un nom, une histoire. Notre pain est alsacien de la graine à la croûte.',
    reverse: false,
    numeral: '01',
  },
  {
    eyebrow: "L'espace",
    imgId: '1495474472359-6f5ea1e3c9a3?w=800',
    title: (
      <>
        50 couverts /{' '}
        <span style={{ fontStyle: 'italic' }}>en plein cœur.</span>
      </>
    ),
    body: 'Place du Parlement, à deux pas de la cathédrale : 50 places en salle, 20 en terrasse, un comptoir ouvert du mardi au dimanche de 7h à 18h. Un espace à la fois boulangerie de quartier et café bistronomique.',
    reverse: true,
    numeral: '02',
  },
];

const SOURCING: SourcingStep[] = [
  {
    num: '01',
    title: 'Farine Label Rouge',
    origin: 'Moulin Klein, Alsace, filière paysanne',
    detail:
      'Meunerie artisanale, contrat direct avec 12 agriculteurs alsaciens, traçabilité parcelle à parcelle.',
  },
  {
    num: '02',
    title: 'Beurre AOP Charentes-Poitou',
    origin: 'pâtisseries 100 % beurre cru',
    detail:
      "Issu de lait cru d'une seule laiterie. Pas de margarine, pas de substitut : le beurre est notre signature.",
  },
  {
    num: '03',
    title: 'Café de spécialité',
    origin: 'torréfacteur Strasbourg, grains tracés parcelle',
    detail:
      'Partenariat exclusif avec un torréfacteur strasbourgeois. Score Q-arabica ≥ 82, microlots saisonniers.',
  },
  {
    num: '04',
    title: 'Fruits & œufs',
    origin: 'fermes à moins de 30 km, livrés 3×/semaine',
    detail:
      'Poules élevées en plein air, fruits de saison du Bas-Rhin. Aucun produit surgelé dans notre pâtisserie.',
  },
];

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Je viens chaque mardi pour le lunch depuis deux ans. La soupe à l'oignon est la meilleure de tout Strasbourg — et le pain qui l'accompagne vaut à lui seul le déplacement.",
    name: 'Camille R.',
    role: 'Cliente fidèle depuis 2022',
  },
  {
    quote:
      "Nous avons organisé un brunch d'entreprise pour 40 personnes. Zéro stress, qualité incroyable, équipe aux petits soins. Le Fournil a géré tout le buffet, de la viennoiserie au gâteau.",
    name: 'Thomas K.',
    role: 'Directeur associé · Cabinet RH Strasbourg',
  },
];

/* ── Utilitaire photo ────────────────────────────────────────────────────── */
const photo = (id: string) =>
  `https://images.unsplash.com/photo-${id}&q=80&w=1600&auto=format&fit=crop`;

/* ════════════════════════════════════════════════════════════════════════════
   Primitives
   ════════════════════════════════════════════════════════════════════════════ */

/** Étiquette fine, capitales, filet ambré. */
function Eyebrow({
  children,
  color = C.accent,
  align = 'left',
  light = false,
}: {
  children: React.ReactNode;
  color?: string;
  align?: 'left' | 'center';
  light?: boolean;
}) {
  const wrap: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    justifyContent: align === 'center' ? 'center' : 'flex-start',
  };
  const rule: React.CSSProperties = {
    width: 44,
    height: 1,
    background: color,
    opacity: light ? 0.5 : 0.7,
    flexShrink: 0,
  };
  const label: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 11,
    letterSpacing: '0.42em',
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
      transition={{ duration: 1.1, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Bouton ambré, contour fin, flèche qui glisse au survol. */
function AmberButton({
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
    padding: '15px 30px',
    fontFamily: SANS,
    fontSize: 12,
    letterSpacing: '0.26em',
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
      : { background: 'rgba(160,104,40,0.10)', transform: 'translateY(-2px)' }
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
    { label: 'Le Fournil', href: '#intro' },
    { label: 'Créations', href: '#creations' },
    { label: 'La Carte', href: '#menu' },
    { label: 'Nos Sources', href: '#sourcing' },
    { label: 'Réserver', href: '#reservation' },
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
    background: solid ? 'rgba(26,20,8,0.95)' : 'transparent',
    backdropFilter: solid ? 'blur(14px) saturate(120%)' : 'none',
    WebkitBackdropFilter: solid ? 'blur(14px) saturate(120%)' : 'none',
    borderBottom: solid
      ? `1px solid rgba(160,104,40,0.22)`
      : '1px solid transparent',
    transition: 'all .6s cubic-bezier(.16,1,.3,1)',
  };
  const brand: React.CSSProperties = {
    fontFamily: SERIF,
    fontWeight: 400,
    fontSize: 'clamp(16px,1.4vw,19px)',
    letterSpacing: '0.06em',
    color: C.accentLight,
    textDecoration: 'none',
    lineHeight: 1.2,
  };

  return (
    <>
      <nav style={bar}>
      <a href="#hero" style={brand}>
        Le Fournil<br />
        <span style={{ fontStyle: 'italic', fontSize: '0.78em', color: 'rgba(240,221,184,0.7)', letterSpacing: '0.04em' }}>
          du Parlement
        </span>
      </a>

      <div className="fp-navlinks" style={{ display: 'flex', alignItems: 'center', gap: 'clamp(18px,2.2vw,36px)' }}>
        {links.map((l) => (
          <NavLink key={l.label} label={l.label} href={l.href} />
        ))}
      </div>

      <div className="fp-navcta">
        <a href="#reservation" style={{ textDecoration: 'none' }}>
          <AmberButton filled>Réserver</AmberButton>
        </a>
      </div>

      
        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="fp-burger"
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
          .fp-navlinks { display: none !important; }
          .fp-burger { display: flex !important; flex-direction: column; }
          .fp-navcta { display: none !important; }
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
        color: h ? C.accentLight : 'rgba(240,221,184,0.82)',
        textDecoration: 'none',
        transition: 'color .35s',
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
   2 · Hero
   ════════════════════════════════════════════════════════════════════════════ */
function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '16%']);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.10]);
  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '-44%']);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.72], [1, 0]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.20], [1, 0]);

  const sec: React.CSSProperties = {
    position: 'relative',
    height: '100vh',
    minHeight: 640,
    overflow: 'hidden',
    background: C.bgDark,
  };

  return (
    <section ref={ref} style={sec} id="hero">
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
          src={`https://images.unsplash.com/photo-1509440159258-1c1c3e5f3f5b?q=80&w=2000&auto=format&fit=crop`}
          alt="Fournil du Parlement — pains au levain en boulangerie artisanale"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          priority-fetch="high"
        />
      </motion.div>

      {/* Voiles superposés */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(26,20,8,0.44) 0%, rgba(26,20,8,0.08) 38%, rgba(26,20,8,0.46) 72%, rgba(26,20,8,0.90) 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(110% 70% at 60% 40%, transparent 35%, rgba(26,20,8,0.38) 100%)',
          mixBlendMode: 'multiply',
        }}
      />

      {/* Titre — bas-gauche */}
      <motion.div
        style={{
          position: 'absolute',
          zIndex: 2,
          bottom: 'clamp(56px,9vh,120px)',
          left: 'clamp(24px,6vw,96px)',
          maxWidth: 780,
          y: titleY,
          opacity: titleOpacity,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.1 }}
        >
          <Eyebrow color={C.accentLight} align="left" light>
            Boulangerie-Café Bistronomique · Strasbourg depuis 2009
          </Eyebrow>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 44 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.2 }}
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontWeight: 300,
            color: C.bgAlt,
            fontSize: 'clamp(3.5rem,7.5vw,9rem)',
            lineHeight: 0.96,
            letterSpacing: '-0.01em',
            margin: 'clamp(20px,2.4vw,34px) 0 0',
            textShadow: '0 14px 64px rgba(0,0,0,0.55)',
          }}
        >
          Pain vivant /{' '}
          <span style={{ color: C.accentLight, fontStyle: 'italic' }}>
            café vivant.
          </span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.55 }}
          style={{ marginTop: 36 }}
        >
          <AmberButton filled>Passer une commande</AmberButton>
        </motion.div>
      </motion.div>

      {/* Cue défilement */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: 32,
          right: 'clamp(24px,5vw,80px)',
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
            color: 'rgba(240,221,184,0.65)',
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
          }}
        >
          Découvrir
        </span>
        <motion.div
          animate={{ y: [0, 9, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={18} color={C.accentLight} strokeWidth={1.4} />
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
    color: C.ink,
    padding: 'clamp(88px,13vw,190px) clamp(24px,8vw,160px)',
    textAlign: 'center',
  };
  return (
    <section style={sec} id="intro">
      <Reveal>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
          <Eyebrow color={C.accentDark} align="center">
            Le Fournil du Parlement
          </Eyebrow>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <p
          style={{
            fontFamily: SERIF,
            fontSize: 'clamp(1.6rem,3.4vw,3.1rem)',
            lineHeight: 1.34,
            fontWeight: 300,
            maxWidth: 960,
            margin: '0 auto',
            color: C.ink,
          }}
        >
          Nourrir Strasbourg depuis 2009,{' '}
          <span style={{ fontStyle: 'italic', color: C.accent }}>
            avec les mains et avec le cœur.
          </span>
        </p>
      </Reveal>

      <Reveal delay={0.2}>
        <p
          style={{
            fontFamily: SANS,
            fontSize: 'clamp(15px,1.5vw,18px)',
            lineHeight: 1.9,
            color: C.textMuted,
            maxWidth: 660,
            margin: 'clamp(24px,3vw,38px) auto 0',
            fontWeight: 300,
          }}
        >
          Chaque matin, nos boulangers façonnent à la main des pains au levain naturel,
          des viennoiseries pur beurre et des pâtisseries alsaciennes revisitées.
          Le soir venu, le café prend le relais.
        </p>
      </Reveal>

      <Reveal delay={0.28}>
        <div
          style={{
            width: 1,
            height: 88,
            background: `linear-gradient(${C.accent}, transparent)`,
            margin: '52px auto 0',
          }}
        />
      </Reveal>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   4 · CreationSequence — crossfade sticky 320vh
   ════════════════════════════════════════════════════════════════════════════ */
function CreationLayer({
  creation,
  i,
  total,
  progress,
}: {
  creation: Creation;
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
        src={`https://images.unsplash.com/photo-${creation.imgId}?q=80&w=1600&auto=format&fit=crop`}
        alt={creation.label}
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

function CreationCaption({
  creation,
  i,
  total,
  progress,
}: {
  creation: Creation;
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
        padding: '0 24px',
        opacity,
        y,
        zIndex: 3,
      }}
    >
      {/* Numéro romain fantôme */}
      <span
        style={{
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontSize: 'clamp(60px,10vw,140px)',
          color: 'rgba(160,104,40,0.28)',
          lineHeight: 1,
          marginBottom: 4,
          display: 'block',
        }}
      >
        {creation.index}
      </span>

      <h2
        style={{
          fontFamily: SERIF,
          fontWeight: 300,
          fontSize: 'clamp(2.8rem,6.4vw,7rem)',
          color: C.bgAlt,
          lineHeight: 1,
          margin: 0,
          letterSpacing: '0.06em',
          textShadow: '0 8px 40px rgba(0,0,0,0.6)',
        }}
      >
        {creation.label}
      </h2>

      <p
        style={{
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontSize: 'clamp(15px,1.8vw,21px)',
          color: 'rgba(240,221,184,0.88)',
          marginTop: 20,
          maxWidth: 520,
          lineHeight: 1.7,
        }}
      >
        {creation.description}
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
  const width = useTransform(progress, [i * seg, (i + 1) * seg], [10, 36]);
  return <motion.div style={{ height: 2, width, background: C.accent, opacity }} />;
}

function CreationSequence() {
  const n = CREATIONS.length;
  const progress = useMotionValue(0.5 / n);
  const [active, setActive] = useState(0);
  const goTo = (i: number) => {
    setActive(i);
    progress.set((i + 0.5) / n);
  };

  return (
    <section
      style={{ height: '100vh', overflow: 'hidden', position: 'relative', background: C.bgDark }}
      id="creations"
    >
      <div
        style={{
          position: 'relative',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {/* Photos en crossfade */}
        {CREATIONS.map((c, i) => (
          <CreationLayer
            key={c.id}
            creation={c}
            i={i}
            total={CREATIONS.length}
            progress={progress}
          />
        ))}

        {/* Voile de lisibilité */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 2,
            background:
              'linear-gradient(to bottom, rgba(26,20,8,0.34), rgba(26,20,8,0.12) 42%, rgba(26,20,8,0.60))',
          }}
        />

        {/* Légendes animées */}
        {CREATIONS.map((c, i) => (
          <CreationCaption
            key={c.id}
            creation={c}
            i={i}
            total={CREATIONS.length}
            progress={progress}
          />
        ))}

        {/* Label en haut à droite */}
        <div
          style={{
            position: 'absolute',
            top: 'clamp(90px,12vh,130px)',
            right: 'clamp(24px,4vw,64px)',
            zIndex: 4,
            textAlign: 'right',
          }}
        >
          <span
            style={{
              fontFamily: SANS,
              fontSize: 10,
              letterSpacing: '0.36em',
              textTransform: 'uppercase',
              color: 'rgba(240,221,184,0.55)',
            }}
          >
            L'atelier
          </span>
        </div>

        {/* Dots de progression */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 5,
            display: 'flex',
            gap: 12,
          }}
        >
          {CREATIONS.map((c, i) => (
            <ProgressDot
              key={c.index}
              i={i}
              total={CREATIONS.length}
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
   5 · MenuCards
   ════════════════════════════════════════════════════════════════════════════ */
function MenuCard({ item, i }: { item: MenuItem; i: number }) {
  const [hover, setHover] = useState(false);
  const card: React.CSSProperties = {
    background: C.bgCard,
    borderLeft: `3px solid ${hover ? C.accent : C.border}`,
    borderTop: `1px solid ${C.border}`,
    borderRight: `1px solid ${C.border}`,
    borderBottom: `1px solid ${C.border}`,
    padding: 'clamp(22px,2.8vw,36px)',
    transition: 'all .5s cubic-bezier(.16,1,.3,1)',
    transform: hover ? 'translateY(-8px)' : 'none',
    boxShadow: hover
      ? '0 28px 60px -30px rgba(26,20,8,0.22)'
      : '0 6px 24px -16px rgba(26,20,8,0.12)',
    cursor: 'default',
  };
  return (
    <Reveal delay={i * 0.08}>
      <article
        style={card}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div
          style={{
            fontFamily: SANS,
            fontSize: 10.5,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: hover ? C.accent : C.textFaint,
            transition: 'color .4s',
            marginBottom: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span style={{ fontSize: 16 }}>{item.emoji}</span>
          {item.category}
        </div>

        <h3
          style={{
            fontFamily: SERIF,
            fontSize: 'clamp(18px,2vw,24px)',
            fontWeight: 400,
            color: C.ink,
            margin: '0 0 10px',
            lineHeight: 1.2,
          }}
        >
          {item.name}
        </h3>

        <p
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 'clamp(14px,1.3vw,16px)',
            lineHeight: 1.65,
            color: C.textMuted,
            margin: 0,
          }}
        >
          {item.tagline}
        </p>
      </article>
    </Reveal>
  );
}

function MenuCards() {
  const sec: React.CSSProperties = {
    background: C.bg,
    padding: 'clamp(88px,12vw,170px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 'clamp(18px,2.4vw,32px)',
    maxWidth: 1240,
    margin: '0 auto',
  };

  return (
    <section style={sec} id="menu">
      <div style={{ maxWidth: 1240, margin: '0 auto 56px' }}>
        <Reveal>
          <Eyebrow color={C.accent}>La Carte</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(2.2rem,5vw,4.8rem)',
              fontWeight: 300,
              color: C.ink,
              margin: '18px 0 0',
              lineHeight: 1.06,
            }}
          >
            De 7h à 18h,{' '}
            <span style={{ fontStyle: 'italic', color: C.accent }}>
              tout est fait maison.
            </span>
          </h2>
        </Reveal>
      </div>
      <div style={grid}>
        {MENU_ITEMS.map((item, i) => (
          <MenuCard key={item.name} item={item} i={i} />
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

function EditorialRow({ row }: { row: EditRow }) {
  const imgWrap: React.CSSProperties = {
    overflow: 'hidden',
    order: row.reverse ? 2 : 1,
    aspectRatio: '4 / 5',
    position: 'relative',
  };
  const txt: React.CSSProperties = {
    order: row.reverse ? 1 : 2,
    position: 'relative',
  };

  return (
    <div className="fp-editrow" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(36px,6vw,90px)', alignItems: 'center' }}>
      <Reveal y={50} style={imgWrap}>
        <ParallaxImg
          src={`https://images.unsplash.com/photo-${row.imgId}&q=80&w=1600&auto=format&fit=crop`}
          alt={typeof row.title === 'string' ? row.title : row.eyebrow}
        />
      </Reveal>

      <div style={txt}>
        {/* Numéral fantôme */}
        <div
          style={{
            position: 'absolute',
            top: -24,
            right: row.reverse ? 'auto' : -16,
            left: row.reverse ? -16 : 'auto',
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 'clamp(90px,12vw,160px)',
            color: C.ink,
            opacity: 0.12,
            lineHeight: 1,
            userSelect: 'none',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        >
          {row.numeral}
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <Reveal>
            <Eyebrow color={C.accent}>{row.eyebrow}</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h3
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(1.8rem,3.8vw,3.4rem)',
                fontWeight: 400,
                color: C.ink,
                margin: '18px 0 22px',
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
                fontSize: 'clamp(15px,1.4vw,17px)',
                lineHeight: 1.85,
                color: C.textMuted,
                fontWeight: 300,
                maxWidth: 460,
              }}
            >
              {row.body}
            </p>
          </Reveal>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .fp-editrow { grid-template-columns: 1fr !important; }
          .fp-editrow > * { order: initial !important; }
        }
      `}</style>
    </div>
  );
}

function EditorialRows() {
  const sec: React.CSSProperties = {
    background: C.bg,
    padding: 'clamp(80px,11vw,160px) clamp(24px,6vw,96px)',
  };
  return (
    <section style={sec} id="editorial">
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
          <EditorialRow key={row.numeral} row={row} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   7 · SourcingPanel — image collante + défilement des engagements
   ════════════════════════════════════════════════════════════════════════════ */
function SourcingPanel() {
  const sec: React.CSSProperties = {
    background: C.bgDark,
    padding: 'clamp(80px,11vw,150px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1.1fr',
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
    <section style={sec} id="sourcing">
      <div style={grid} className="fp-srcpanel">
        {/* Image collante */}
        <div style={stickySide} className="fp-srcpanel-sticky">
          <div
            style={{
              overflow: 'hidden',
              border: `1px solid ${C.borderDark}`,
              aspectRatio: '3 / 4',
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=900&auto=format&fit=crop"
              alt="Nos sourcing — ingrédients artisanaux au Fournil du Parlement"
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
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
                marginBottom: 8,
              }}
            >
              Notre philosophie
            </div>
            <p
              style={{
                fontFamily: SERIF,
                fontStyle: 'italic',
                fontSize: 17,
                color: 'rgba(240,221,184,0.72)',
                lineHeight: 1.65,
                margin: 0,
              }}
            >
              « Chaque ingrédient a un prénom, une adresse, une histoire. »
            </p>
          </div>
        </div>

        {/* Engagements qui défilent */}
        <div>
          <Reveal>
            <Eyebrow color={C.accent}>Nos Sources</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(2rem,4.4vw,3.8rem)',
                fontWeight: 300,
                color: C.bgAlt,
                margin: '18px 0 52px',
                lineHeight: 1.06,
              }}
            >
              Local par{' '}
              <span style={{ fontStyle: 'italic', color: C.accentLight }}>
                conviction.
              </span>
            </h2>
          </Reveal>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {SOURCING.map((step, i) => (
              <Reveal key={step.num} delay={0.06 * i}>
                <div
                  style={{
                    padding: 'clamp(28px,3.5vw,44px) 0',
                    borderTop: `1px solid rgba(160,104,40,0.22)`,
                    display: 'flex',
                    gap: 28,
                  }}
                >
                  <span
                    style={{
                      fontFamily: SERIF,
                      fontStyle: 'italic',
                      fontSize: 'clamp(28px,2.6vw,36px)',
                      color: C.sage,
                      minWidth: 52,
                      lineHeight: 1,
                      marginTop: 3,
                      flexShrink: 0,
                    }}
                  >
                    {step.num}
                  </span>
                  <div>
                    <h4
                      style={{
                        fontFamily: SERIF,
                        fontSize: 'clamp(18px,1.8vw,23px)',
                        fontWeight: 400,
                        color: C.bgAlt,
                        margin: '0 0 4px',
                      }}
                    >
                      {step.title}
                    </h4>
                    <div
                      style={{
                        fontFamily: SANS,
                        fontSize: 11,
                        letterSpacing: '0.18em',
                        textTransform: 'uppercase',
                        color: C.sage,
                        marginBottom: 10,
                      }}
                    >
                      {step.origin}
                    </div>
                    <p
                      style={{
                        fontFamily: SERIF,
                        fontStyle: 'italic',
                        fontSize: 'clamp(14px,1.3vw,16px)',
                        lineHeight: 1.7,
                        color: 'rgba(240,221,184,0.68)',
                        margin: 0,
                      }}
                    >
                      {step.detail}
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
          .fp-srcpanel { grid-template-columns: 1fr !important; }
          .fp-srcpanel-sticky { position: static !important; }
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
    gap: 'clamp(28px,3.6vw,56px)',
    maxWidth: 1160,
    margin: '0 auto',
  };

  return (
    <section style={sec} id="temoignages">
      <div style={{ maxWidth: 1160, margin: '0 auto 58px', textAlign: 'center' }}>
        <Reveal>
          <Eyebrow color={C.accentDark} align="center">
            Ils nous font confiance
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(2rem,4.6vw,4rem)',
              fontWeight: 300,
              color: C.ink,
              margin: '18px 0 0',
              lineHeight: 1.08,
            }}
          >
            La parole de{' '}
            <span style={{ fontStyle: 'italic', color: C.accent }}>
              nos habitués.
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
                padding: 'clamp(32px,3.6vw,48px)',
                margin: 0,
                height: '100%',
                boxSizing: 'border-box',
                boxShadow: '0 20px 52px -38px rgba(26,20,8,0.28)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Icône café */}
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: `rgba(160,104,40,0.10)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 18,
                }}
              >
                <Coffee size={20} color={C.accent} strokeWidth={1.5} />
              </div>

              <div style={{ display: 'flex', gap: 3, marginBottom: 16 }}>
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} size={13} fill={C.accent} color={C.accent} strokeWidth={0} />
                ))}
              </div>

              <blockquote
                style={{
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  fontSize: 'clamp(17px,1.7vw,21px)',
                  lineHeight: 1.65,
                  color: C.ink,
                  margin: '0 0 26px',
                  flex: 1,
                }}
              >
                "{t.quote}"
              </blockquote>

              <figcaption
                style={{
                  borderTop: `1px solid ${C.border}`,
                  paddingTop: 18,
                }}
              >
                <div
                  style={{
                    fontFamily: SERIF,
                    fontSize: 18,
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
   9 · ReservationForm
   ════════════════════════════════════════════════════════════════════════════ */
function ReservationForm() {
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [tel, setTel] = useState('');
  const [typeCommande, setTypeCommande] = useState('');
  const [date, setDate] = useState('');
  const [nbPersonnes, setNbPersonnes] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = () => {
    if (!prenom || !email || !typeCommande) return;
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
    borderBottom: `1px solid rgba(160,104,40,0.38)`,
    padding: '15px 2px',
    fontFamily: SERIF,
    fontSize: 18,
    color: C.bgAlt,
    outline: 'none',
    transition: 'border-color .3s',
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

  const half: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 'clamp(20px,3vw,40px)',
  };

  return (
    <section style={sec} id="reservation">
      {/* Photo fantôme en fond */}
      <img
        src="https://images.unsplash.com/photo-1509440159258-1c1c3e5f3f5b?q=80&w=2000&auto=format&fit=crop"
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
            Commander ou privatiser
          </Eyebrow>
        </Reveal>

        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(2.2rem,5.5vw,4.8rem)',
              fontWeight: 300,
              color: C.bgAlt,
              margin: '20px 0 14px',
              lineHeight: 1.04,
            }}
          >
            Votre commande,{' '}
            <span style={{ fontStyle: 'italic', color: C.accentLight }}>
              sur mesure.
            </span>
          </h2>
        </Reveal>

        <Reveal delay={0.14}>
          <p
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: 'clamp(15px,1.6vw,19px)',
              lineHeight: 1.72,
              color: 'rgba(240,221,184,0.76)',
              maxWidth: 500,
              margin: '0 auto 48px',
            }}
          >
            Brunch privatif, buffet traiteur, gâteau d'anniversaire ou wedding cake :
            dites-nous ce que vous rêvez, nous le façonnons.
          </p>
        </Reveal>

        {sent ? (
          <Reveal>
            <div
              style={{
                border: `1px solid ${C.accent}`,
                padding: 'clamp(36px,5vw,56px)',
                background: 'rgba(160,104,40,0.07)',
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: '50%',
                  background: 'rgba(160,104,40,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 18px',
                }}
              >
                <Coffee size={24} color={C.accentLight} strokeWidth={1.5} />
              </div>
              <h3
                style={{
                  fontFamily: SERIF,
                  fontSize: 'clamp(22px,2.4vw,30px)',
                  fontWeight: 400,
                  color: C.bgAlt,
                  margin: '0 0 12px',
                }}
              >
                Merci {prenom}, on vous confirme votre commande par email !
              </h3>
              <p
                style={{
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  fontSize: 17,
                  color: 'rgba(240,221,184,0.74)',
                  margin: 0,
                }}
              >
                Notre équipe vous recontacte sous 48h à{' '}
                <strong style={{ color: C.accentLight, fontStyle: 'normal' }}>
                  {email}
                </strong>{' '}
                pour finaliser les détails.
              </p>
            </div>
          </Reveal>
        ) : (
          <Reveal delay={0.22}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 30, textAlign: 'left' }}>

              {/* Prénom + Email */}
              <div style={half} className="fp-form-half">
                <div>
                  <label style={labelStyle} htmlFor="fp-prenom">Prénom</label>
                  <input
                    id="fp-prenom"
                    style={fieldBase}
                    type="text"
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    placeholder="Marie"
                    autoComplete="given-name"
                  />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="fp-email">Email</label>
                  <input
                    id="fp-email"
                    style={fieldBase}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="marie@exemple.fr"
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Téléphone */}
              <div>
                <label style={labelStyle} htmlFor="fp-tel">Téléphone</label>
                <input
                  id="fp-tel"
                  style={fieldBase}
                  type="tel"
                  value={tel}
                  onChange={(e) => setTel(e.target.value)}
                  placeholder="+33 6 00 00 00 00"
                  autoComplete="tel"
                />
              </div>

              {/* Type de commande */}
              <div>
                <label style={labelStyle} htmlFor="fp-type">Type de commande</label>
                <select
                  id="fp-type"
                  style={{
                    ...fieldBase,
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    cursor: 'pointer',
                    color: typeCommande ? C.bgAlt : 'rgba(240,221,184,0.42)',
                  }}
                  value={typeCommande}
                  onChange={(e) => setTypeCommande(e.target.value)}
                >
                  <option value="" style={{ color: '#000' }}>Choisir une prestation…</option>
                  <option value="Petit-déjeuner groupe" style={{ color: '#000' }}>Petit-déjeuner groupe</option>
                  <option value="Brunch privatif" style={{ color: '#000' }}>Brunch privatif</option>
                  <option value="Buffet traiteur" style={{ color: '#000' }}>Buffet traiteur</option>
                  <option value="Gâteau d'anniversaire" style={{ color: '#000' }}>Gâteau d'anniversaire</option>
                  <option value="Wedding cake" style={{ color: '#000' }}>Wedding cake</option>
                  <option value="Commande spéciale" style={{ color: '#000' }}>Commande spéciale</option>
                </select>
              </div>

              {/* Date + Nb de personnes */}
              <div style={half} className="fp-form-half">
                <div>
                  <label style={labelStyle} htmlFor="fp-date">Date souhaitée</label>
                  <input
                    id="fp-date"
                    style={{
                      ...fieldBase,
                      colorScheme: 'dark',
                    }}
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="fp-nb">Nombre de personnes</label>
                  <input
                    id="fp-nb"
                    style={fieldBase}
                    type="number"
                    min={1}
                    value={nbPersonnes}
                    onChange={(e) => setNbPersonnes(e.target.value)}
                    placeholder="ex. 25"
                  />
                </div>
              </div>

              {/* Submit */}
              <div style={{ marginTop: 8, textAlign: 'center' }}>
                <AmberButton filled onClick={handleSubmit} type="button">
                  Envoyer ma demande
                </AmberButton>
              </div>
            </div>
          </Reveal>
        )}
      </div>

      <style>{`
        @media (max-width: 860px) {
          .fp-form-half { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   10 · Footer
   ════════════════════════════════════════════════════════════════════════════ */
function Footer() {
  const foot: React.CSSProperties = {
    background: C.bgDarkAlt,
    borderTop: `1px solid rgba(160,104,40,0.18)`,
    padding: 'clamp(64px,8vw,110px) clamp(24px,6vw,96px) 40px',
  };

  const cols: { title: string; items: { label: string; href: string }[] }[] = [
    {
      title: 'Le Fournil',
      items: [
        { label: 'Notre histoire', href: '#intro' },
        { label: "L'équipe", href: '#intro' },
        { label: 'Le lieu', href: '#editorial' },
        { label: 'Nos engagements', href: '#sourcing' },
      ],
    },
    {
      title: 'La Carte',
      items: [
        { label: 'Boulangerie', href: '#menu' },
        { label: 'Pâtisserie', href: '#menu' },
        { label: 'Café & brunch', href: '#menu' },
        { label: 'Traiteur', href: '#menu' },
      ],
    },
    {
      title: 'Commandes',
      items: [
        { label: 'Brunch privatif', href: '#reservation' },
        { label: 'Buffet traiteur', href: '#reservation' },
        { label: 'Wedding cake', href: '#reservation' },
        { label: 'Événements', href: '#reservation' },
      ],
    },
  ];

  return (
    <footer id="contact" style={foot}>
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.5fr repeat(3, 1fr)',
          gap: 'clamp(32px,5vw,70px)',
        }}
        className="fp-footgrid"
      >
        {/* Brand */}
        <div>
          <a
            href="#hero"
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(18px,1.8vw,23px)',
              letterSpacing: '0.04em',
              color: C.bgAlt,
              textDecoration: 'none',
              display: 'block',
              lineHeight: 1.3,
            }}
          >
            Le Fournil
            <br />
            <span style={{ fontStyle: 'italic', color: C.accentLight, fontSize: '0.82em' }}>
              du Parlement
            </span>
          </a>

          <p
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: 15,
              lineHeight: 1.72,
              color: 'rgba(240,221,184,0.58)',
              marginTop: 20,
              maxWidth: 300,
            }}
          >
            Boulangerie-café bistronomique. Pain vivant, café vivant.
            Strasbourg, depuis 2009.
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 9,
              marginTop: 22,
              fontFamily: SANS,
              fontSize: 11,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'rgba(240,221,184,0.52)',
            }}
          >
            <MapPin size={13} color={C.accent} strokeWidth={1.5} />
            Place du Parlement · 67000 Strasbourg
          </div>

          <div
            style={{
              marginTop: 10,
              fontFamily: SANS,
              fontSize: 11,
              letterSpacing: '0.14em',
              color: 'rgba(240,221,184,0.48)',
            }}
          >
            Mar–Dim · 7h–18h
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
                color: C.accent,
                marginBottom: 20,
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
                gap: 12,
              }}
            >
              {col.items.map((it) => (
                <li key={it.label}>
                  <a
                    href={it.href}
                    style={{
                      fontFamily: SERIF,
                      fontSize: 16,
                      color: 'rgba(240,221,184,0.68)',
                      textDecoration: 'none',
                      transition: 'color .3s',
                    }}
                    onMouseEnter={(e) =>
                      ((e.target as HTMLAnchorElement).style.color = C.accentLight)
                    }
                    onMouseLeave={(e) =>
                      ((e.target as HTMLAnchorElement).style.color = 'rgba(240,221,184,0.68)')
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

      {/* Baseline */}
      <div
        style={{
          maxWidth: 1240,
          margin: '60px auto 0',
          paddingTop: 26,
          borderTop: `1px solid rgba(160,104,40,0.14)`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 14,
          fontFamily: SANS,
          fontSize: 11,
          letterSpacing: '0.12em',
          color: 'rgba(240,221,184,0.40)',
        }}
      >
        <span>© 2009–2026 Le Fournil du Parlement · Strasbourg</span>
        <span style={{ display: 'flex', gap: 22 }}>
          <a href="#reservation" style={{ color: 'inherit', textDecoration: 'none' }}>
            Mentions légales
          </a>
          <a href="#reservation" style={{ color: 'inherit', textDecoration: 'none' }}>
            Politique de confidentialité
          </a>
        </span>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .fp-footgrid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .fp-footgrid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   PAGE — Composition
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

      {/* Responsive globale */}
      <style>{`
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        input::placeholder { color: rgba(240,221,184,0.35); }
        select option { background: #2a2010; color: #f0ead8; }
        @media (max-width: 860px) {
          .fp-navlinks { display: none !important; }
          .fp-navcta  { display: none !important; }
          .fp-editrow { grid-template-columns: 1fr !important; }
          .fp-editrow > * { order: initial !important; }
          .fp-srcpanel { grid-template-columns: 1fr !important; }
          .fp-srcpanel-sticky { position: static !important; }
          .fp-footgrid { grid-template-columns: 1fr 1fr !important; }
          .fp-form-half { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .fp-footgrid { grid-template-columns: 1fr !important; }
        }
        /* iOS zoom prevention */
        input, select, textarea {
          font-size: max(16px, 1em);
        }
      `}</style>

      <Nav />
      <Hero />
      <Intro />
      <CreationSequence />
      <MenuCards />
      <EditorialRows />
      <SourcingPanel />
      <Testimonials />
      <ReservationForm />
      <Footer />
    </main>
  );
}
