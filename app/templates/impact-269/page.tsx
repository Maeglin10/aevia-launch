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
import { ArrowRight, ChevronDown, Coffee, MapPin } from 'lucide-react';

/* ════════════════════════════════════════════════════════════════════════════
   BOULANGERIE DES CHARTRONS — Boulangerie-Pâtisserie & Café · Bordeaux
   Photographie réelle + chorégraphie de défilement éditoriale.
   Auto-suffisant. 'use client'.
   ════════════════════════════════════════════════════════════════════════════ */

/* ── Google Fonts ─────────────────────────────────────────────────────────── */
const FONT_LINK =
  "https://fonts.googleapis.com/css2?family=Zilla+Slab:ital,wght@0,400;0,600;1,400&family=Mulish:wght@300;400;500;600&display=swap";

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
  bg: '#faf6ee',
  bgAlt: '#f0e8d4',
  bgDark: '#1a1206',
  bgDarkAlt: '#100c04',
  bgCard: '#ffffff',
  accent: '#c87e28',
  accentDark: '#a06018',
  accentLight: '#f0d8a8',
  white: '#ffffff',
  ink: '#1a1206',
  textMuted: '#503810',
  textFaint: '#9a8060',
  border: '#e0c890',
  borderDark: 'rgba(200,126,40,0.22)',
  wine: '#8c3030',
};

const SERIF = "'Zilla Slab', Georgia, serif" as const;
const SANS = "'Mulish', system-ui, sans-serif" as const;

/* ── Easing partagé ──────────────────────────────────────────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ════════════════════════════════════════════════════════════════════════════
   Interfaces métier
   ════════════════════════════════════════════════════════════════════════════ */
interface Bread {
  id: string;
  roman: string;
  category: string;
  description: string;
  imgId: string;
}

interface Specialty {
  name: string;
  desc: string;
  tag: string;
}

interface EditRow {
  eyebrow: string;
  imgId: string;
  imgW: number;
  title: string;
  titleItalic?: string;
  body: string;
  reverse: boolean;
  ghostNum: string;
}

interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

interface CraftStep {
  num: string;
  label: string;
  detail: string;
}

/* ════════════════════════════════════════════════════════════════════════════
   Données
   ════════════════════════════════════════════════════════════════════════════ */
const PHASES: Bread[] = [
  {
    id: 'pain',
    roman: 'I',
    category: 'LES PAINS',
    description:
      "Seigle au miel des Landes, baguette à l'ancienne, pain aux noix du Périgord — le terroir de Gascogne dans chaque mie.",
    imgId: '1509440159258-1c1c3e5f3f5b',
  },
  {
    id: 'patisserie',
    roman: 'II',
    category: 'LA PÂTISSERIE',
    description:
      "Canelé bordelais, tarte aux pruneaux d'Agen, mille-feuille à la crème légère — les classiques revisités avec précision.",
    imgId: '1549931319-a545dcf3bc7b',
  },
  {
    id: 'cafe',
    roman: 'III',
    category: 'LE CAFÉ & BRUNCH',
    description:
      "Café d'Ethiopie en filtre, brunch du dimanche avec produits locaux, planches apéro — l'âme des Chartrons dans un verre.",
    imgId: '1495474472359-6f5ea1e3c9a3',
  },
];

const SPECIALTIES: Specialty[] = [
  {
    name: 'Canelé bordelais',
    desc: 'Caramélisé dehors, fondant à cœur, à la vanille de Madagascar.',
    tag: 'Pâtisserie signature',
  },
  {
    name: 'Pain de seigle au miel',
    desc: 'Miel des ruches landaises, levain naturel de 12 ans, croûte dorée.',
    tag: 'Terroir Gascogne',
  },
  {
    name: 'Baguette tradition',
    desc: 'Farine T65 Label Rouge, fermentation lente 20h, alvéolage généreux.',
    tag: 'Classique revisité',
  },
  {
    name: 'Brunch dominical',
    desc: 'De 9h à 14h, produits locaux, planche sucrée-salée, café filtre.',
    tag: 'Dimanche matin',
  },
  {
    name: 'Tarte aux pruneaux',
    desc: "Pruneaux d'Agen mi-cuits, crème pâtissière légère, pâte feuilletée.",
    tag: 'Sud-Ouest',
  },
  {
    name: 'Commandes traiteur',
    desc: 'Buffets événements, wedding cakes, plateaux petits-fours sur mesure.',
    tag: 'Sur commande',
  },
];

const EDIT_ROWS: EditRow[] = [
  {
    eyebrow: 'Nos valeurs',
    imgId: '1509440159258-1c1c3e5f3f5b',
    imgW: 800,
    title: 'Bordelais / ',
    titleItalic: 'de cœur.',
    body: "Farine de Gironde du Moulin de Roquefort, miel des Landes, noix du Périgord — chaque ingrédient vient d'un producteur nommé, à moins de 150 km. Zéro kilomètre alimentaire. La qualité ne voyage pas loin.",
    reverse: false,
    ghostNum: '01',
  },
  {
    eyebrow: 'Le lieu',
    imgId: '1495474472359-6f5ea1e3c9a3',
    imgW: 800,
    title: 'Chartrons, / ',
    titleItalic: 'depuis 2007.',
    body: "Au cœur du quartier des négociants en vin, dans une maison de ville du XVIIIe siècle. 45 couverts, lumière d'atelier, brunch du dimanche de 9h à 14h. Fermé lundi et mardi — pour mieux ouvrir le reste de la semaine.",
    reverse: true,
    ghostNum: '02',
  },
];

const CRAFT_STEPS: CraftStep[] = [
  {
    num: '01',
    label: 'Farine T65 Label Rouge',
    detail: 'Moulin de Roquefort, Gironde',
  },
  {
    num: '02',
    label: 'Levain naturel de 12 ans',
    detail: 'Pain sans additif ni levure industrielle',
  },
  {
    num: '03',
    label: 'Fermentation 20h en chambre froide',
    detail: 'La lenteur pour le goût',
  },
  {
    num: '04',
    label: 'Cuisson sole pierre 240°C',
    detail: 'Croûte caramélisée, mie alvéolée',
  },
];

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Je passais devant leur vitrine chaque matin en allant chez le fromager d'à côté. Un jour j'ai poussé la porte. Maintenant le brunch du dimanche aux Chartrons est un rituel que rien ne déplace — ni voyage, ni rhume, ni mauvais temps.",
    name: 'Isabelle Moreau',
    role: 'Cliente fidèle · Quartier des Chartrons',
  },
  {
    quote:
      "J'ai confié à leur équipe le buffet de notre conférence annuelle — 120 personnes. La ponctualité, la présentation, la qualité des produits : tout était irréprochable. Trois mois plus tard, j'en entends encore parler par nos participants.",
    name: 'Thomas Lefranc',
    role: "Organisateur d'événements · Bordeaux",
  },
];

/* ── URL helper ──────────────────────────────────────────────────────────── */
function photo(id: string, w = 1600): string {
  return `https://images.unsplash.com/photo-${id}?q=80&w=${w}&auto=format&fit=crop`;
}

/* ════════════════════════════════════════════════════════════════════════════
   Primitives
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
    width: 44,
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

/** Bouton ambré, contour fin, flèche qui glisse au survol. */
function AmberButton({
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
    padding: '15px 30px',
    fontFamily: SANS,
    fontSize: 12,
    letterSpacing: '0.24em',
    textTransform: 'uppercase',
    fontWeight: 600,
    cursor: 'pointer',
    border: `1px solid ${C.accent}`,
    background: filled ? C.accent : 'transparent',
    color: filled
      ? C.white
      : dark
        ? C.accentLight
        : C.accent,
    transition: 'all .5s cubic-bezier(.16,1,.3,1)',
  };
  const hov: React.CSSProperties = hover
    ? filled
      ? { background: C.accentDark, transform: 'translateY(-2px)' }
      : { background: 'rgba(200,126,40,0.10)', transform: 'translateY(-2px)' }
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

/** Image avec léger drift parallaxe interne. */
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
    { label: 'Nos pains', href: '#pains' },
    { label: 'Pâtisserie', href: '#patisserie' },
    { label: 'Le lieu', href: '#lieu' },
    { label: 'Notre savoir-faire', href: '#savoirfaire' },
    { label: 'Commander', href: '#commander' },
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
    background: solid ? 'rgba(26,18,6,0.96)' : 'transparent',
    backdropFilter: solid ? 'blur(14px) saturate(120%)' : 'none',
    WebkitBackdropFilter: solid ? 'blur(14px) saturate(120%)' : 'none',
    borderBottom: solid
      ? `1px solid rgba(200,126,40,0.22)`
      : '1px solid transparent',
    transition: 'all .6s cubic-bezier(.16,1,.3,1)',
  };

  const brand: React.CSSProperties = {
    fontFamily: SERIF,
    fontSize: 'clamp(15px,1.4vw,19px)',
    letterSpacing: '0.06em',
    color: C.accentLight,
    fontWeight: 400,
  };

  const linkRow: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'clamp(16px,2.2vw,36px)',
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
            style={{ height: 28, maxWidth: 160, objectFit: 'contain', display: 'block' }}
          />
        ) : (
          "Boulangerie des Chartrons"
        )}
      </div>
      <div style={linkRow} className="bc-navlinks">
        {links.map((l) => (
          <NavLink key={l.label} label={l.label} href={l.href} />
        ))}
      </div>
      <div className="bc-navcta">
        <a href="#commander" style={{ textDecoration: 'none' }}>
          <AmberButton filled dark>Commander</AmberButton>
        </a>
      </div>
      
        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="bc-burger"
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
          .bc-navlinks{ display:none !important; }
          .bc-burger { display: flex !important; flex-direction: column; }
          .bc-navcta{ display:none !important; }
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
        color: h ? C.accentLight : 'rgba(240,216,168,0.78)',
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
   2 · Hero — 100vh, parallaxe
   ════════════════════════════════════════════════════════════════════════════ */
function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.13]);
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '14%']);
  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '-42%']);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);

  const section: React.CSSProperties = {
    position: 'relative',
    height: '100dvh',
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
          src={photo('1509440159258-1c1c3e5f3f5b', 2000)}
          alt="Devanture de la Boulangerie des Chartrons à Bordeaux"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </motion.div>

      {/* Voiles */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(26,18,6,0.50) 0%, rgba(26,18,6,0.12) 38%, rgba(26,18,6,0.52) 72%, rgba(26,18,6,0.90) 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(110% 70% at 60% 40%, transparent 40%, rgba(26,18,6,0.38) 100%)',
          mixBlendMode: 'multiply',
        }}
      />

      {/* Titre parallaxe — ancré bas-gauche */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: 'clamp(60px, 10vh, 120px)',
          left: 'clamp(24px, 6vw, 96px)',
          right: 'clamp(24px, 6vw, 96px)',
          zIndex: 2,
          y: titleY,
          opacity: titleOpacity,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.1 }}
        >
          <Eyebrow color={C.accentLight}>
            Boulangerie-Café · Bordeaux Chartrons
          </Eyebrow>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 44 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.25 }}
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontWeight: 400,
            color: C.accentLight,
            fontSize: 'clamp(3.5rem,7.5vw,9rem)',
            lineHeight: 0.95,
            letterSpacing: '-0.01em',
            margin: 'clamp(18px,2.4vw,32px) 0 clamp(16px,2vw,28px)',
            textShadow: '0 10px 50px rgba(0,0,0,0.45)',
          }}
        >
          Le pain&nbsp;/ de Bordeaux.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.5 }}
          style={{
            fontFamily: SANS,
            fontWeight: 300,
            fontSize: 'clamp(16px,1.7vw,20px)',
            color: 'rgba(240,216,168,0.86)',
            maxWidth: 520,
            lineHeight: 1.65,
            marginBottom: 'clamp(28px,3.5vw,44px)',
          }}
        >
          Pains au levain, canelés bordelais, brunch du dimanche — depuis 2007 dans le
          quartier des Chartrons.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.72 }}
        >
          <AmberButton filled dark>
            Commander en ligne
          </AmberButton>
        </motion.div>
      </motion.div>

      {/* Indice de défilement */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: 32,
          right: 'clamp(24px,5vw,64px)',
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
            color: 'rgba(240,216,168,0.7)',
            writingMode: 'vertical-rl',
          }}
        >
          Défiler
        </span>
        <motion.div
          animate={{ y: [0, 9, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={20} color={C.accentLight} strokeWidth={1.3} />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   3 · Intro — bgAlt, SERIF centré
   ════════════════════════════════════════════════════════════════════════════ */
function Intro() {
  const sec: React.CSSProperties = {
    background: C.bgAlt,
    color: C.ink,
    padding: 'clamp(90px,13vw,190px) clamp(24px,8vw,160px)',
    textAlign: 'center',
  };

  return (
    <section style={sec} id="pains">
      <Reveal>
        <Eyebrow color={C.wine} align="center">
          L'esprit de la maison
        </Eyebrow>
      </Reveal>
      <Reveal delay={0.1}>
        <p
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 'clamp(24px,3.4vw,48px)',
            lineHeight: 1.36,
            fontWeight: 400,
            maxWidth: 980,
            margin: 'clamp(22px,2.8vw,38px) auto 0',
            color: C.ink,
          }}
        >
          À Bordeaux, le bon pain est aussi sérieux que le bon vin.
          C'est ainsi depuis toujours.
        </p>
      </Reveal>
      <Reveal delay={0.2}>
        <div
          style={{
            width: 1,
            height: 80,
            background: `linear-gradient(${C.accent}, transparent)`,
            margin: 'clamp(44px,6vw,70px) auto 0',
          }}
        />
      </Reveal>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   4 · BreadSequence — sticky crossfade 320vh
   ════════════════════════════════════════════════════════════════════════════ */
function PhaseImage({
  phase,
  i,
  total,
  progress,
}: {
  phase: Bread;
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
        src={photo(phase.imgId)}
        alt={phase.category}
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
  phase: Bread;
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
        top: 'clamp(80px,12vh,140px)',
        right: 'clamp(24px,5vw,72px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        textAlign: 'right',
        maxWidth: 'clamp(280px,38vw,480px)',
        opacity,
        y,
      }}
    >
      <span
        style={{
          fontFamily: SANS,
          fontSize: 10,
          letterSpacing: '0.36em',
          textTransform: 'uppercase',
          color: C.accent,
          marginBottom: 10,
        }}
      >
        {phase.roman}
      </span>
      <h2
        style={{
          fontFamily: SERIF,
          fontSize: 'clamp(28px,5vw,68px)',
          fontWeight: 600,
          color: C.accentLight,
          lineHeight: 1,
          margin: '0 0 16px',
          textShadow: '0 6px 32px rgba(0,0,0,0.6)',
        }}
      >
        {phase.category}
      </h2>
      <p
        style={{
          fontFamily: SANS,
          fontWeight: 300,
          fontSize: 'clamp(14px,1.5vw,18px)',
          color: 'rgba(240,216,168,0.86)',
          lineHeight: 1.7,
          margin: 0,
        }}
      >
        {phase.description}
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
  return (
    <motion.div
      style={{ height: 2, width, background: C.accent, opacity }}
    />
  );
}

function BreadSequence() {
  const n = PHASES.length;
  const progress = useMotionValue(0.5 / n);
  const [active, setActive] = useState(0);
  const goTo = (i: number) => {
    setActive(i);
    progress.set((i + 0.5) / n);
  };

  return (
    <section
      id="patisserie"
      style={{
        height: '100dvh', overflow: 'hidden',
        position: 'relative',
        background: C.bgDark,
      }}
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

        {/* Voile */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to bottom, rgba(26,18,6,0.38), rgba(26,18,6,0.10) 45%, rgba(26,18,6,0.55))',
          }}
        />

        {PHASES.map((p, i) => (
          <PhaseCaption
            key={p.id}
            phase={p}
            i={i}
            total={PHASES.length}
            progress={progress}
          />
        ))}

        {/* Indicateurs de progression */}
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
          {PHASES.map((p, i) => (
            <ProgressDot
              key={p.roman}
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
   5 · SpecialtyCards — 6 cartes, bordure ambré à gauche, hover lift
   ════════════════════════════════════════════════════════════════════════════ */
function SpecialtyCard({
  s,
  i,
}: {
  s: Specialty;
  i: number;
}) {
  const [hover, setHover] = useState(false);
  const card: React.CSSProperties = {
    background: C.bgCard,
    border: `1px solid ${hover ? C.border : 'rgba(224,200,144,0.5)'}`,
    borderLeft: `3px solid ${C.accent}`,
    padding: 'clamp(26px,3.2vw,36px)',
    transform: hover ? 'translateY(-10px)' : 'none',
    boxShadow: hover
      ? '0 32px 64px -28px rgba(26,18,6,0.22)'
      : '0 4px 24px -16px rgba(26,18,6,0.12)',
    transition: 'all .6s cubic-bezier(.16,1,.3,1)',
    cursor: 'default',
    display: 'flex',
    flexDirection: 'column',
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
            fontSize: 10,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: C.accent,
            fontWeight: 500,
            marginBottom: 12,
          }}
        >
          {s.tag}
        </span>
        <h3
          style={{
            fontFamily: SERIF,
            fontSize: 'clamp(20px,2vw,26px)',
            fontWeight: 600,
            color: C.ink,
            margin: '0 0 10px',
            lineHeight: 1.15,
          }}
        >
          {s.name}
        </h3>
        <p
          style={{
            fontFamily: SANS,
            fontWeight: 300,
            fontSize: 'clamp(14px,1.3vw,16px)',
            lineHeight: 1.7,
            color: C.textMuted,
            margin: 0,
            flex: 1,
          }}
        >
          {s.desc}
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
    gap: 'clamp(20px,2.8vw,36px)',
    maxWidth: 1240,
    margin: '0 auto',
  };

  return (
    <section style={sec} id="specialites">
      <div style={{ maxWidth: 1240, margin: '0 auto clamp(50px,6vw,72px)' }}>
        <Reveal>
          <Eyebrow>La carte</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(34px,5.5vw,72px)',
              fontWeight: 400,
              color: C.ink,
              margin: 'clamp(16px,2vw,24px) 0 0',
              lineHeight: 1.06,
            }}
          >
            Nos{' '}
            <span style={{ fontStyle: 'italic', color: C.wine }}>
              incontournables
            </span>
          </h2>
        </Reveal>
      </div>
      <div style={grid}>
        {SPECIALTIES.map((s, i) => (
          <SpecialtyCard key={s.name} s={s} i={i} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   6 · EditorialRows — 2 rangées image / texte, numéros fantômes vin
   ════════════════════════════════════════════════════════════════════════════ */
function EditRow({ row }: { row: EditRow }) {
  const wrap: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 'clamp(32px,6vw,90px)',
    alignItems: 'center',
    position: 'relative',
  };
  const imgWrap: React.CSSProperties = {
    overflow: 'hidden',
    order: row.reverse ? 2 : 1,
    aspectRatio: '5 / 6',
  };
  const txt: React.CSSProperties = {
    order: row.reverse ? 1 : 2,
    position: 'relative',
  };

  return (
    <div style={wrap} className="bc-editrow">
      {/* Numéro fantôme */}
      <span
        style={{
          position: 'absolute',
          top: row.reverse ? 'auto' : '-0.12em',
          bottom: row.reverse ? '-0.12em' : 'auto',
          [row.reverse ? 'left' : 'right']: '-0.08em',
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontSize: 'clamp(120px,14vw,200px)',
          color: C.wine,
          opacity: 0.08,
          lineHeight: 1,
          userSelect: 'none',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        {row.ghostNum}
      </span>

      <Reveal y={50} style={imgWrap}>
        <ParallaxImg src={photo(row.imgId, row.imgW)} alt={row.title} />
      </Reveal>

      <div style={{ ...txt, zIndex: 1 }}>
        <Reveal>
          <Eyebrow color={C.wine}>{row.eyebrow}</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h3
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(28px,4vw,56px)',
              fontWeight: 400,
              color: C.ink,
              margin: 'clamp(14px,2vw,22px) 0 clamp(16px,2vw,24px)',
              lineHeight: 1.1,
              whiteSpace: 'pre-line',
            }}
          >
            {row.title}
            {row.titleItalic && (
              <span style={{ fontStyle: 'italic', color: C.wine }}>
                {row.titleItalic}
              </span>
            )}
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
              margin: 0,
            }}
          >
            {row.body}
          </p>
        </Reveal>
      </div>

      <style>{`
        @media (max-width: 860px){
          .bc-editrow{ grid-template-columns:1fr !important; }
          .bc-editrow > *{ order:initial !important; }
        }
      `}</style>
    </div>
  );
}

function EditorialRows() {
  const sec: React.CSSProperties = {
    background: C.bg,
    padding: 'clamp(70px,10vw,150px) clamp(24px,6vw,96px)',
  };
  return (
    <section style={sec} id="lieu">
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(80px,11vw,150px)',
        }}
      >
        {EDIT_ROWS.map((r) => (
          <EditRow key={r.ghostNum} row={r} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   7 · CraftPanel — image sticky gauche, 4 étapes défilent à droite
   ════════════════════════════════════════════════════════════════════════════ */
function CraftPanel() {
  const sec: React.CSSProperties = {
    background: C.bgDark,
    padding: 'clamp(80px,11vw,150px) clamp(24px,6vw,96px)',
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
    <section style={sec} id="savoirfaire">
      <div style={grid} className="bc-craftpanel">
        {/* Image sticky */}
        <div style={stickyImg} className="bc-craftpanel-img">
          <div
            style={{
              overflow: 'hidden',
              border: `1px solid ${C.borderDark}`,
              aspectRatio: '4 / 5',
            }}
          >
            <img
              src={photo('1549931319-a545dcf3bc7b', 900)}
              alt="Pains artisanaux en cuisson au four à sole"
              loading="lazy"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </div>
          <div style={{ marginTop: 22 }}>
            <span
              style={{
                fontFamily: SANS,
                fontSize: 10.5,
                letterSpacing: '0.26em',
                textTransform: 'uppercase',
                color: C.accent,
              }}
            >
              Artisan boulanger depuis 2007
            </span>
            <p
              style={{
                fontFamily: SERIF,
                fontStyle: 'italic',
                fontSize: 16,
                color: 'rgba(240,216,168,0.72)',
                marginTop: 10,
                lineHeight: 1.6,
              }}
            >
              « Ici, la patience est le premier ingrédient. »
            </p>
          </div>
        </div>

        {/* Étapes qui défilent */}
        <div>
          <Reveal>
            <Eyebrow color={C.accent}>Notre savoir-faire</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(32px,5vw,64px)',
                fontWeight: 400,
                color: C.accentLight,
                margin: 'clamp(16px,2vw,24px) 0 clamp(40px,5vw,60px)',
                lineHeight: 1.06,
              }}
            >
              Du grain au{' '}
              <span style={{ fontStyle: 'italic', color: C.accent }}>
                four
              </span>
            </h2>
          </Reveal>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {CRAFT_STEPS.map((step, i) => (
              <Reveal key={step.num} delay={0.06 * i}>
                <div
                  style={{
                    padding: 'clamp(28px,3.5vw,40px) 0',
                    borderTop: `1px solid ${C.accent}`,
                    display: 'flex',
                    gap: 'clamp(20px,3vw,36px)',
                    alignItems: 'baseline',
                  }}
                >
                  <span
                    style={{
                      fontFamily: SERIF,
                      fontStyle: 'italic',
                      fontSize: 'clamp(28px,3vw,42px)',
                      color: C.wine,
                      minWidth: 52,
                      lineHeight: 1,
                    }}
                  >
                    {step.num}
                  </span>
                  <div>
                    <h4
                      style={{
                        fontFamily: SERIF,
                        fontSize: 'clamp(18px,2vw,24px)',
                        fontWeight: 600,
                        color: C.accentLight,
                        margin: '0 0 8px',
                        lineHeight: 1.2,
                      }}
                    >
                      {step.label}
                    </h4>
                    <p
                      style={{
                        fontFamily: SANS,
                        fontWeight: 300,
                        fontSize: 'clamp(14px,1.3vw,16px)',
                        color: 'rgba(240,216,168,0.62)',
                        margin: 0,
                        lineHeight: 1.65,
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
        @media (max-width: 860px){
          .bc-craftpanel{ grid-template-columns:1fr !important; }
          .bc-craftpanel-img{ position:static !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   8 · Testimonials — bgAlt, icône café, SERIF italique
   ════════════════════════════════════════════════════════════════════════════ */
function Testimonials() {
  const sec: React.CSSProperties = {
    background: C.bgAlt,
    padding: 'clamp(90px,12vw,170px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: 'clamp(28px,4vw,56px)',
    maxWidth: 1180,
    margin: '0 auto',
  };

  return (
    <section style={sec}>
      <div
        style={{
          maxWidth: 1180,
          margin: '0 auto clamp(50px,6vw,72px)',
          textAlign: 'center',
        }}
      >
        <Reveal>
          <Eyebrow color={C.wine} align="center">
            Ce qu'ils en disent
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(32px,5vw,64px)',
              fontWeight: 400,
              color: C.ink,
              margin: 'clamp(16px,2vw,24px) 0 0',
            }}
          >
            Fidèles{' '}
            <span style={{ fontStyle: 'italic', color: C.wine }}>
              et heureux
            </span>
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
                padding: 'clamp(32px,4vw,48px)',
                margin: 0,
                height: '100%',
                boxSizing: 'border-box',
                boxShadow: '0 20px 50px -36px rgba(26,18,6,0.28)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Coffee
                size={30}
                color={C.accent}
                strokeWidth={1.4}
                style={{ marginBottom: 20 }}
              />
              <blockquote
                style={{
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  fontSize: 'clamp(17px,1.8vw,22px)',
                  lineHeight: 1.62,
                  color: C.ink,
                  margin: '0 0 28px',
                  flex: 1,
                }}
              >
                "{t.quote}"
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
                    color: C.wine,
                    fontWeight: 600,
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
   9 · OrderForm — bgDark, 720px, sent state personnalisé
   ════════════════════════════════════════════════════════════════════════════ */
function OrderForm() {
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [tel, setTel] = useState('');
  const [typeCommande, setTypeCommande] = useState('');
  const [date, setDate] = useState('');
  const [nbPersonnes, setNbPersonnes] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!prenom || !email || !typeCommande) {
      setError('Merci de renseigner au moins votre prénom, votre email et le type de commande.');
      return;
    }
    setError('');
    setSent(true);
  };

  const field: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    background: 'transparent',
    border: 'none',
    borderBottom: `1px solid rgba(200,126,40,0.40)`,
    padding: '16px 2px',
    fontFamily: SANS,
    fontWeight: 300,
    fontSize: 'clamp(15px,1.5vw,18px)',
    color: C.accentLight,
    outline: 'none',
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

  const sec: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    background: C.bgDark,
    padding: 'clamp(90px,12vw,170px) clamp(24px,6vw,96px)',
  };

  return (
    <section style={sec} id="commander">
      {/* Photo d'ambiance en fond */}
      <img
        src={photo('1509440159258-1c1c3e5f3f5b', 1600)}
        alt="Image de présentation"
        aria-hidden="true"
        loading="lazy"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.09,
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
            Commandes &amp; événements
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(34px,6vw,76px)',
              fontWeight: 400,
              color: C.accentLight,
              margin: 'clamp(18px,2.4vw,30px) 0 clamp(14px,1.8vw,20px)',
              lineHeight: 1.05,
            }}
          >
            Parlons de{' '}
            <span style={{ fontStyle: 'italic', color: C.accent }}>votre</span>{' '}
            projet
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <p
            style={{
              fontFamily: SANS,
              fontWeight: 300,
              fontSize: 'clamp(15px,1.6vw,18px)',
              lineHeight: 1.72,
              color: 'rgba(240,216,168,0.75)',
              maxWidth: 520,
              margin: '0 auto clamp(44px,5.5vw,64px)',
            }}
          >
            Brunch privatif, wedding cake, plateau petits-fours ou buffet — remplissez
            ce formulaire et nous vous répondons sous 24h.
          </p>
        </Reveal>

        {sent ? (
          <Reveal>
            <div
              style={{
                border: `1px solid ${C.accent}`,
                padding: 'clamp(36px,5vw,56px)',
                background: 'rgba(200,126,40,0.06)',
                textAlign: 'center',
              }}
            >
              <Coffee
                size={36}
                color={C.accentLight}
                strokeWidth={1.3}
                style={{ marginBottom: 18 }}
              />
              <h3
                style={{
                  fontFamily: SERIF,
                  fontSize: 'clamp(22px,3vw,34px)',
                  fontWeight: 400,
                  color: C.accentLight,
                  margin: '0 0 14px',
                }}
              >
                Merci {prenom}, votre commande est notée.
              </h3>
              <p
                style={{
                  fontFamily: SANS,
                  fontWeight: 300,
                  fontSize: 'clamp(14px,1.4vw,17px)',
                  color: 'rgba(240,216,168,0.76)',
                  margin: 0,
                  lineHeight: 1.7,
                }}
              >
                On confirme par email dans les 24h !
              </p>
            </div>
          </Reveal>
        ) : (
          <Reveal delay={0.22}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'clamp(24px,3vw,34px)',
                textAlign: 'left',
              }}
            >
              {/* Prénom + Email */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 'clamp(16px,2.5vw,32px)',
                }}
                className="bc-formgrid"
              >
                <div>
                  <label style={labelStyle} htmlFor="bc-prenom">
                    Prénom *
                  </label>
                  <input
                    id="bc-prenom"
                    style={{ ...field, fontSize: '16px' }}
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    placeholder="Camille"
                    autoComplete="given-name"
                  />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="bc-email">
                    Email *
                  </label>
                  <input
                    id="bc-email"
                    type="email"
                    style={{ ...field, fontSize: '16px' }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="camille@exemple.fr"
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Téléphone */}
              <div>
                <label style={labelStyle} htmlFor="bc-tel">
                  Téléphone
                </label>
                <input
                  id="bc-tel"
                  type="tel"
                  style={{ ...field, fontSize: '16px' }}
                  value={tel}
                  onChange={(e) => setTel(e.target.value)}
                  placeholder="06 12 34 56 78"
                  autoComplete="tel"
                />
              </div>

              {/* Type de commande */}
              <div>
                <label style={labelStyle} htmlFor="bc-type">
                  Type de commande *
                </label>
                <select
                  id="bc-type"
                  style={{
                    ...field,
                    fontSize: '16px',
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    cursor: 'pointer',
                    color: typeCommande
                      ? C.accentLight
                      : 'rgba(240,216,168,0.40)',
                  }}
                  value={typeCommande}
                  onChange={(e) => setTypeCommande(e.target.value)}
                >
                  <option value="" style={{ color: '#000', background: '#fff' }}>
                    Choisir un type…
                  </option>
                  {[
                    'Brunch privatif',
                    'Wedding cake',
                    'Plateau petits-fours',
                    'Pain personnalisé',
                    'Buffet événement',
                    'Autre',
                  ].map((opt) => (
                    <option
                      key={opt}
                      value={opt}
                      style={{ color: '#000', background: '#fff' }}
                    >
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date + Nb personnes */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 'clamp(16px,2.5vw,32px)',
                }}
                className="bc-formgrid"
              >
                <div>
                  <label style={labelStyle} htmlFor="bc-date">
                    Date souhaitée
                  </label>
                  <input
                    id="bc-date"
                    type="date"
                    style={{ ...field, fontSize: '16px', colorScheme: 'dark' }}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="bc-nb">
                    Nombre de personnes
                  </label>
                  <input
                    id="bc-nb"
                    type="number"
                    min="1"
                    style={{ ...field, fontSize: '16px' }}
                    value={nbPersonnes}
                    onChange={(e) => setNbPersonnes(e.target.value)}
                    placeholder="20"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label style={labelStyle} htmlFor="bc-message">
                  Votre message
                </label>
                <textarea
                  id="bc-message"
                  rows={4}
                  style={{
                    ...field,
                    fontSize: '16px',
                    borderBottom: 'none',
                    border: `1px solid rgba(200,126,40,0.40)`,
                    padding: '14px 16px',
                    resize: 'vertical',
                    minHeight: 110,
                    display: 'block',
                  }}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Décrivez votre projet : thème, contraintes alimentaires, livraison…"
                />
              </div>

              {error && (
                <p
                  style={{
                    fontFamily: SANS,
                    fontSize: 13,
                    color: '#e87070',
                    margin: 0,
                    textAlign: 'left',
                  }}
                >
                  {error}
                </p>
              )}

              <div style={{ textAlign: 'center', marginTop: 8 }}>
                <AmberButton filled dark onClick={handleSubmit} type="button">
                  Envoyer ma demande
                </AmberButton>
              </div>
            </div>
          </Reveal>
        )}
      </div>
      <style>{`
        @media (max-width: 860px){
          .bc-formgrid{ grid-template-columns:1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   10 · Footer — bgDarkAlt, 4 colonnes, headers ambrés
   ════════════════════════════════════════════════════════════════════════════ */
function Footer() {
  const cols: { title: string; items: { label: string; href: string }[] }[] = [
    {
      title: 'Nos créations',
      items: [
        { label: 'Les pains', href: '#pains' },
        { label: 'La pâtisserie', href: '#patisserie' },
        { label: 'Café & brunch', href: '#patisserie' },
        { label: 'Traiteur & événements', href: '#commander' },
      ],
    },
    {
      title: 'Le lieu',
      items: [
        { label: 'Qui sommes-nous', href: '#lieu' },
        { label: 'Notre savoir-faire', href: '#savoirfaire' },
        { label: 'Les producteurs', href: '#lieu' },
        { label: 'Fermetures hebdo.', href: '#lieu' },
      ],
    },
    {
      title: 'Commander',
      items: [
        { label: 'Commande en ligne', href: '#commander' },
        { label: 'Brunch privatif', href: '#commander' },
        { label: 'Wedding cake', href: '#commander' },
        { label: 'Buffet événement', href: '#commander' },
      ],
    },
  ];

  const foot: React.CSSProperties = {
    background: C.bgDarkAlt,
    borderTop: `1px solid rgba(200,126,40,0.18)`,
    padding: 'clamp(64px,9vw,110px) clamp(24px,6vw,96px) 40px',
  };

  return (
    <footer id="contact" style={foot}>
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.5fr repeat(3, 1fr)',
          gap: 'clamp(32px,5vw,64px)',
        }}
        className="bc-footgrid"
      >
        {/* Colonne identité */}
        <div>
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(18px,1.8vw,22px)',
              color: C.accentLight,
              fontWeight: 400,
              marginBottom: 18,
            }}
          >
            Boulangerie des Chartrons
          </div>
          <p
            style={{
              fontFamily: SANS,
              fontWeight: 300,
              fontSize: 'clamp(13px,1.2vw,15px)',
              lineHeight: 1.75,
              color: 'rgba(240,216,168,0.58)',
              marginBottom: 22,
              maxWidth: 320,
            }}
          >
            Pains au levain, pâtisserie bordelaise &amp; brunch du dimanche.
            Quartier des Chartrons, Bordeaux — depuis 2007.
          </p>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontFamily: SANS,
              fontSize: 11,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'rgba(240,216,168,0.5)',
            }}
          >
            <MapPin size={13} color={C.accent} strokeWidth={1.5} />
            Bordeaux Chartrons · France
          </div>
          <div
            style={{
              marginTop: 24,
              fontFamily: SANS,
              fontSize: 12,
              color: 'rgba(240,216,168,0.42)',
              lineHeight: 1.7,
            }}
          >
            Ouvert Mer–Dim · 7h–19h
            <br />
            Fermé lundi &amp; mardi
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
                color: C.accent,
                fontWeight: 600,
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
                      fontSize: 'clamp(13px,1.3vw,15px)',
                      color: 'rgba(240,216,168,0.64)',
                      textDecoration: 'none',
                      transition: 'color .3s',
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

      {/* Barre de bas */}
      <div
        style={{
          maxWidth: 1240,
          margin: 'clamp(52px,7vw,80px) auto 0',
          paddingTop: 26,
          borderTop: `1px solid rgba(200,126,40,0.14)`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 14,
          fontFamily: SANS,
          fontSize: 11,
          letterSpacing: '0.10em',
          color: 'rgba(240,216,168,0.40)',
        }}
      >
        <span>
          © 2007–2026 Boulangerie des Chartrons. Tous droits réservés.
        </span>
        <span style={{ display: 'flex', gap: 22 }}>
          <a href="#commander" style={{ color: 'inherit', textDecoration: 'none' }}>
            Mentions légales
          </a>
          <a href="#commander" style={{ color: 'inherit', textDecoration: 'none' }}>
            Confidentialité
          </a>
        </span>
      </div>

      <style>{`
        @media (max-width: 860px){
          .bc-footgrid{ grid-template-columns:1fr 1fr !important; }
        }
        @media (max-width: 480px){
          .bc-footgrid{ grid-template-columns:1fr !important; }
        }
      `}</style>
    </footer>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   PAGE
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
    C = {
      ...C,
      accent: brand,
      accentDark: shadeColor(brand, -20),
      accentLight: shadeColor(brand, 25),
    };
  }

  const root: React.CSSProperties = {
    background: C.bgDark,
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
      {/* Google Fonts */}
      <style>{`@import url('${FONT_LINK}');`}</style>

      <Nav />
      <Hero />
      <Intro />
      <BreadSequence />
      <SpecialtyCards />
      <EditorialRows />
      <CraftPanel />
      <Testimonials />
      <OrderForm />
      <Footer />
    </main>
  );
}
