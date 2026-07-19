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
import { ArrowRight, ChevronDown, Leaf, MapPin } from 'lucide-react';

/* ════════════════════════════════════════════════════════════════════════════
   ATELIER TERRA — Paysagiste & Aménagement Extérieur · Nantes
   Chorégraphie de défilement éditoriale, fond clair/sombre, sticky parallax.
   Auto-suffisant. 'use client'.
   ════════════════════════════════════════════════════════════════════════════ */

/* Google Fonts */
const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Cardo:ital,wght@0,400;0,700;1,400&family=Lato:wght@300;400;700&display=swap');
`;

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
  bg: '#f4f7f2',
  bgAlt: '#e6ede0',
  bgDark: '#0d1a0a',
  bgDarkAlt: '#080f06',
  bgCard: '#ffffff',
  accent: '#4a7c3f',
  accentDark: '#366030',
  accentLight: '#c8dfc4',
  white: '#ffffff',
  ink: '#0d1a0a',
  textMuted: '#2c4a28',
  textFaint: '#6a8a60',
  border: '#c4d8bc',
  borderDark: 'rgba(74,124,63,0.2)',
  earth: '#8b6040',
};

const SERIF = "'Cardo', Georgia, serif" as const;
const SANS = "'Lato', system-ui, sans-serif" as const;

/* ── Easing ──────────────────────────────────────────────────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ── Photo helper ────────────────────────────────────────────────────────── */
const photo = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?q=80&w=${w}&auto=format&fit=crop`;

/* ════════════════════════════════════════════════════════════════════════════
   TypeScript interfaces
   ════════════════════════════════════════════════════════════════════════════ */
interface Project {
  img: string;
  alt: string;
  index: string;
  label: string;
  caption: string;
  sub: string;
}

interface Service {
  title: string;
  desc: string;
  icon: string;
}

interface EditRow {
  eyebrow: string;
  img: string;
  alt: string;
  title: React.ReactNode;
  body: string;
  reverse: boolean;
  roman: string;
}

interface PhilosophyItem {
  num: string;
  title: string;
  body: string;
}

interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

/* ════════════════════════════════════════════════════════════════════════════
   Data
   ════════════════════════════════════════════════════════════════════════════ */
const PROJECTS: Project[] = [
  {
    img: photo('1558618047-b62e0e6e8517'),
    alt: 'Conception de jardin à la française — Atelier Terra',
    index: 'I',
    label: 'CONCEPTION',
    caption: 'Conception',
    sub: "Plan 3D, sélection végétale, coordination des corps de métier — votre jardin imaginé avant d\'être creusé.",
  },
  {
    img: photo('1416879347-58da7a5ecbb7'),
    alt: 'Plantation naturaliste à Nantes — Atelier Terra',
    index: 'II',
    label: 'PLANTATION',
    caption: 'Plantation',
    sub: 'Végétaux de pépinière locale, essences rustiques adaptées au climat nantais, plantations en pleine lune.',
  },
  {
    img: photo('1578662996442-48f60103fc96'),
    alt: 'Aménagement terrasse extérieure — Atelier Terra',
    index: 'III',
    label: 'AMÉNAGEMENT',
    caption: 'Aménagement',
    sub: "Terrasses pierre, allées dallage, bassin naturel, éclairage LED — l\'extérieur comme une pièce de plus.",
  },
];

const SERVICES: Service[] = [
  { title: 'Création de jardin', desc: 'Conception sur-mesure, plan 3D et réalisation complète — de la terre nue au jardin abouti.', icon: '🌿' },
  { title: 'Aménagement terrasse', desc: 'Dallage naturel, bois exotique, pergolas et mobilier extérieur choisis avec vous.', icon: '🪨' },
  { title: 'Entretien & tonte', desc: 'Forfaits saisonniers, taille raisonnée, désherbage naturel. Votre jardin toujours au meilleur.', icon: '✂️' },
  { title: 'Potager & permaculture', desc: 'Conception de buttes, lasagnes, carrés surélevés. Produire beau et utile depuis votre terrain.', icon: '🥕' },
  { title: 'Bassin & piscine naturelle', desc: "Bassin de baignade biologique, piscine naturelle, mare ornementale — l\'eau vivante chez vous.", icon: '💧' },
  { title: 'Éclairage extérieur', desc: 'Ambiances LED basse consommation, guirlandes, spots encastrés — le jardin habité la nuit.', icon: '✨' },
];

const EDIT_ROWS: EditRow[] = [
  {
    eyebrow: 'Notre démarche',
    img: photo('1558618047-b62e0e6e8517', 800),
    alt: 'Jardin écologique conçu par Atelier Terra',
    title: (
      <>
        Le vivant{' '}
        <span style={{ fontStyle: 'italic' }}>d'abord.</span>
      </>
    ),
    body: "Notre approche écologique bannit herbicides et pesticides. Nous amendons les sols au compost produit sur site, sélectionnons des plantes indigènes adaptées au terroir nantais et favorisons les associations bénéfiques. Un jardin sain n\'a besoin d\'aucune chimie — il s\'auto-régule et s\'enrichit d\'année en année.",
    reverse: false,
    roman: 'I',
  },
  {
    eyebrow: 'Notre territoire',
    img: photo('1416879347-58da7a5ecbb7', 800),
    alt: 'Plantation naturaliste Loire-Atlantique',
    title: (
      <>
        Nantes{' '}
        <span style={{ fontStyle: 'italic' }}>et sa région.</span>
      </>
    ),
    body: "Depuis 15 ans, nous intervenons en Loire-Atlantique et en Vendée. Cette ancrage nous a permis de constituer une connaissance précise des sols, des micro-climats et des essences qui prospèrent ici. Argile de bocage, sable ligérien, vent d\'ouest atlantique — chaque chantier tient compte de ce qui existe déjà.",
    reverse: true,
    roman: 'II',
  },
];

const PHILOSOPHY: PhilosophyItem[] = [
  {
    num: 'I',
    title: 'Sol vivant',
    body: 'Amendement naturel, apport de compost et de mycorrhizes. Zéro herbicide, zéro pesticide. Le sol travaillé avec respect devient la meilleure assurance-vie de vos plantations.',
  },
  {
    num: 'II',
    title: 'Biodiversité',
    body: 'Haies mellifères à floraison étalée, mare écologique, hôtels à insectes intégrés au design. Un jardin vivant accueille oiseaux, pollinisateurs et vie microscopique.',
  },
  {
    num: 'III',
    title: 'Eau maîtrisée',
    body: 'Récupération des eaux pluviales, arrosage goutte-à-goutte temporisé, paillage naturel. Nous concevons des jardins qui résistent à la sécheresse sans dépenser une goutte inutile.',
  },
  {
    num: 'IV',
    title: 'Durabilité',
    body: "Essences locales plantées en automne pour un enracinement profond. Garantie reprise 2 ans. Nos jardins gagnent en beauté avec le temps — c\'est la seule promesse qui compte.",
  },
];

const TESTIMONIALS: Testimonial[] = [
  {
    quote: "En trois mois, Atelier Terra a transformé 800 m² de béton nu en un jardin luxuriant que je n\'aurais jamais osé imaginer. Leur patience et leur vision ont été remarquables du premier plan jusqu\'à la dernière plante.",
    name: 'Isabelle Moreau',
    role: 'Propriétaire · Saint-Herblain',
  },
  {
    quote: "Notre terrasse redessinée est devenue l\'attraction de la maison. Les clients viennent désormais spécifiquement pour profiter de l\'espace extérieur. Le retour sur investissement a été immédiat.",
    name: 'Thomas Guillou',
    role: 'Gérant · Restaurant Les Jardins de Loire, Nantes',
  },
];

/* ════════════════════════════════════════════════════════════════════════════
   Primitives partagés
   ════════════════════════════════════════════════════════════════════════════ */

/** Étiquette fine, capitales, filet vert. */
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
  const rule: React.CSSProperties = { width: 40, height: 1, background: color, opacity: 0.75 };
  const label: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 10.5,
    letterSpacing: '0.42em',
    textTransform: 'uppercase',
    color,
    fontWeight: light ? 300 : 400,
  };
  return (
    <div style={wrap}>
      <span style={rule} />
      <span style={label}>{children}</span>
      {align === 'center' ? <span style={rule} /> : null}
    </div>
  );
}

/** Révélation au scroll — fondu + translation verticale, une seule fois. */
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

/** Bouton accent — contour ou plein. Flèche qui glisse au survol. */
function AccentButton({
  children,
  filled = false,
  onClick,
  type = 'button',
}: {
  children: React.ReactNode;
  filled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit';
}) {
  const [hover, setHover] = useState(false);
  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 12,
    padding: '14px 28px',
    fontFamily: SANS,
    fontSize: 11.5,
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    fontWeight: 400,
    cursor: 'pointer',
    border: `1px solid ${C.accent}`,
    background: filled ? C.accent : 'transparent',
    color: filled ? C.white : C.accent,
    transition: 'all .5s cubic-bezier(.16,1,.3,1)',
  };
  const hov: React.CSSProperties = hover
    ? filled
      ? { background: C.accentDark, borderColor: C.accentDark, transform: 'translateY(-2px)' }
      : { background: 'rgba(74,124,63,0.08)', transform: 'translateY(-2px)' }
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

  const navLinks = [
    { label: 'Réalisations', href: '#realisations' },
    { label: 'Services', href: '#services' },
    { label: 'Philosophie', href: '#philosophie' },
    { label: 'Devis', href: '#devis' },
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
    padding: solid ? '14px clamp(20px,5vw,64px)' : '24px clamp(20px,5vw,64px)',
    background: solid ? 'rgba(13,26,10,0.95)' : 'transparent',
    backdropFilter: solid ? 'blur(14px) saturate(130%)' : 'none',
    WebkitBackdropFilter: solid ? 'blur(14px) saturate(130%)' : 'none',
    borderBottom: solid ? `1px solid rgba(74,124,63,0.25)` : '1px solid transparent',
    transition: 'all .6s cubic-bezier(.16,1,.3,1)',
  };
  const brand: React.CSSProperties = {
    fontFamily: SERIF,
    fontSize: 21,
    letterSpacing: '0.12em',
    color: C.white,
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  };
  const linkRow: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'clamp(18px,2.4vw,38px)',
  };

  return (
    <>
      <nav style={bar}>
      <a href="#realisations" style={brand}>
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
            <Leaf size={18} color={C.accent} strokeWidth={1.5} />
            Atelier Terra
          </>
        )}
      </a>
      <div style={linkRow} className="at-navlinks">
        {navLinks.map((l) => (
          <NavLink key={l.label} label={l.label} href={l.href} />
        ))}
      </div>
      <div className="at-navcta">
        <a href="#devis" style={{ textDecoration: 'none' }}>
          <AccentButton filled>Devis gratuit</AccentButton>
        </a>
      </div>
      
        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="at-burger"
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
        @media (max-width: 860px){
          .at-navlinks{ display:none !important; }
          .at-burger { display: flex !important; flex-direction: column; }
          .at-navcta{ display:none !important; }
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
        fontSize: 11,
        letterSpacing: '0.20em',
        textTransform: 'uppercase',
        color: h ? C.accentLight : 'rgba(255,255,255,0.88)',
        textDecoration: 'none',
        transition: 'color .4s',
        position: 'relative',
        paddingBottom: 4,
        fontWeight: 300,
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

  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.14]);
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '14%']);
  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '-44%']);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.72], [1, 0]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.20], [1, 0]);

  const sec: React.CSSProperties = {
    position: 'relative',
    height: '100dvh',
    minHeight: 640,
    overflow: 'hidden',
    background: C.bgDark,
  };

  return (
    <section ref={ref} style={sec}>
      {/* Photo plein cadre + parallaxe */}
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
          src={photo('1558618047-b62e0e6e8517', 2000)}
          alt="Jardin formel conçu par Atelier Terra à Nantes"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </motion.div>

      {/* Voile bas */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(13,26,10,0.38) 0%, rgba(13,26,10,0.06) 36%, rgba(13,26,10,0.42) 68%, rgba(13,26,10,0.92) 100%)',
        }}
      />
      {/* Voile radial */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(130% 90% at 50% 25%, transparent 36%, rgba(13,26,10,0.40) 100%)',
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
          justifyContent: 'flex-end',
          padding: '0 clamp(24px,6vw,96px) clamp(64px,9vw,120px)',
          y: titleY,
          opacity: titleOpacity,
        }}
      >
        <Reveal y={20}>
          <Eyebrow color={C.accentLight} light>
            Paysagiste · Nantes &amp; Loire-Atlantique
          </Eyebrow>
        </Reveal>

        <motion.h1
          initial={{ opacity: 0, y: 44 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.1 }}
          style={{
            fontFamily: SERIF,
            fontWeight: 400,
            fontStyle: 'italic',
            color: C.white,
            fontSize: 'clamp(3rem,7.5vw,9rem)',
            lineHeight: 0.97,
            letterSpacing: '-0.01em',
            margin: '24px 0 20px',
            textShadow: '0 10px 50px rgba(0,0,0,0.45)',
          }}
        >
          Jardins{' '}
          <span style={{ fontStyle: 'normal', color: C.accentLight }}>vivants.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.38 }}
          style={{
            fontFamily: SANS,
            fontWeight: 300,
            fontSize: 'clamp(15px,1.7vw,20px)',
            color: 'rgba(255,255,255,0.82)',
            maxWidth: 520,
            lineHeight: 1.68,
            marginBottom: 40,
          }}
        >
          Conception, plantation et aménagement extérieur sur-mesure. Nous
          créons des espaces verts qui respirent, produisent et enchantent —
          saison après saison.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.62 }}
          style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}
        >
          <AccentButton filled>
            Devis gratuit
          </AccentButton>
          <AccentButton>
            Nos réalisations
          </AccentButton>
        </motion.div>
      </motion.div>

      {/* Cue scroll */}
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
            fontFamily: SANS,
            fontSize: 9.5,
            letterSpacing: '0.36em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.6)',
            writingMode: 'vertical-rl',
          }}
        >
          Découvrir
        </span>
        <motion.div
          animate={{ y: [0, 9, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={18} color={C.accentLight} strokeWidth={1.3} />
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
    padding: 'clamp(88px,12vw,180px) clamp(24px,8vw,160px)',
    textAlign: 'center',
  };
  return (
    <section style={sec}>
      <Reveal>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 36 }}>
          <Eyebrow color={C.textMuted} align="center">
            Notre philosophie
          </Eyebrow>
        </div>
      </Reveal>
      <Reveal delay={0.10}>
        <p
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 'clamp(22px,3.2vw,46px)',
            lineHeight: 1.36,
            fontWeight: 400,
            maxWidth: 980,
            margin: '0 auto',
            color: C.ink,
          }}
        >
          Un jardin ne se commande pas.
          <br />
          Il se cultive, avec patience et intention.
        </p>
      </Reveal>
      <Reveal delay={0.20}>
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
   4 · ProjectSequence — crossfade sticky 320vh
   ════════════════════════════════════════════════════════════════════════════ */
function ProjectLayer({
  project,
  i,
  total,
  progress,
}: {
  project: Project;
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
        src={project.img}
        alt={project.alt}
        loading="lazy"
        style={{ width: '100%', height: '100%', objectFit: 'cover', scale }}
      />
    </motion.div>
  );
}

function ProjectCaption({
  project,
  i,
  total,
  progress,
}: {
  project: Project;
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
        bottom: 'clamp(60px,8vw,100px)',
        left: 'clamp(24px,6vw,96px)',
        opacity,
        y,
      }}
    >
      <div
        style={{
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontSize: 'clamp(56px,10vw,130px)',
          color: 'rgba(200,223,196,0.18)',
          lineHeight: 1,
          marginBottom: -8,
          userSelect: 'none',
        }}
      >
        {project.index}
      </div>
      <h2
        style={{
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontSize: 'clamp(36px,5.5vw,80px)',
          fontWeight: 400,
          color: C.white,
          margin: '0 0 14px',
          textShadow: '0 8px 40px rgba(0,0,0,0.55)',
        }}
      >
        {project.caption}
      </h2>
      <p
        style={{
          fontFamily: SANS,
          fontWeight: 300,
          fontSize: 'clamp(14px,1.5vw,18px)',
          color: 'rgba(255,255,255,0.80)',
          maxWidth: 480,
          lineHeight: 1.65,
          margin: 0,
        }}
      >
        {project.sub}
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
      style={{ height: 2, width, background: C.accent, opacity, borderRadius: 2 }}
    />
  );
}

function ProjectSequence() {
  const n = PROJECTS.length;
  const progress = useMotionValue(0.5 / n);
  const [active, setActive] = useState(0);
  const goTo = (i: number) => {
    setActive(i);
    progress.set((i + 0.5) / n);
  };

  return (
    <section
      style={{ height: '100dvh', overflow: 'hidden', position: 'relative', background: C.bgDark }}
      id="realisations"
    >
      <div
        style={{
          position: 'relative',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {PROJECTS.map((p, i) => (
          <ProjectLayer
            key={p.index}
            project={p}
            i={i}
            total={PROJECTS.length}
            progress={progress}
          />
        ))}

        {/* Voile bas */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to top, rgba(13,26,10,0.82) 0%, rgba(13,26,10,0.0) 45%)',
            pointerEvents: 'none',
          }}
        />

        {PROJECTS.map((p, i) => (
          <ProjectCaption
            key={p.index}
            project={p}
            i={i}
            total={PROJECTS.length}
            progress={progress}
          />
        ))}

        {/* Label section top-right */}
        <div
          style={{
            position: 'absolute',
            top: 'clamp(90px,10vw,120px)',
            right: 'clamp(24px,5vw,64px)',
            fontFamily: SANS,
            fontSize: 10,
            letterSpacing: '0.38em',
            textTransform: 'uppercase',
            color: 'rgba(200,223,196,0.55)',
          }}
        >
          Nos Réalisations
        </div>

        {/* Progress dots */}
        <div
          style={{
            position: 'absolute',
            bottom: 36,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 10,
          }}
        >
          {PROJECTS.map((p, i) => (
            <ProgressDot
              key={p.index}
              i={i}
              total={PROJECTS.length}
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
   5 · ServiceCards
   ════════════════════════════════════════════════════════════════════════════ */
function ServiceCard({ s, i }: { s: Service; i: number }) {
  const [hover, setHover] = useState(false);
  const card: React.CSSProperties = {
    background: C.bgCard,
    borderLeft: `3px solid ${hover ? C.accent : C.accentLight}`,
    padding: 'clamp(28px,3vw,40px)',
    boxShadow: hover
      ? `0 24px 60px -24px rgba(74,124,63,0.32)`
      : '0 8px 32px -20px rgba(13,26,10,0.12)',
    transform: hover ? 'translateY(-8px)' : 'none',
    transition: 'all .55s cubic-bezier(.16,1,.3,1)',
    cursor: 'default',
  };
  return (
    <Reveal delay={i * 0.08}>
      <article
        style={card}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div style={{ fontSize: 26, marginBottom: 14 }}>{s.icon}</div>
        <h3
          style={{
            fontFamily: SERIF,
            fontSize: 'clamp(20px,2vw,26px)',
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
  const sec: React.CSSProperties = {
    background: C.bg,
    padding: 'clamp(88px,12vw,170px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(290px, 100%), 1fr))',
    gap: 'clamp(20px,2.5vw,36px)',
    maxWidth: 1240,
    margin: '0 auto',
  };
  return (
    <section style={sec} id="services">
      <div style={{ maxWidth: 1240, margin: '0 auto 56px' }}>
        <Reveal>
          <Eyebrow>Nos prestations</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: 'clamp(34px,5vw,68px)',
              fontWeight: 400,
              color: C.ink,
              margin: '18px 0 0',
              lineHeight: 1.06,
            }}
          >
            Six façons de transformer{' '}
            <span style={{ color: C.accent, fontStyle: 'normal' }}>votre extérieur</span>
          </h2>
        </Reveal>
      </div>
      <div style={grid}>
        {SERVICES.map((s, i) => (
          <ServiceCard key={s.title} s={s} i={i} />
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

function EditRowItem({ row }: { row: EditRow }) {
  const wrap: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 'clamp(36px,6vw,90px)',
    alignItems: 'center',
    position: 'relative',
  };
  const imgWrap: React.CSSProperties = {
    overflow: 'hidden',
    order: row.reverse ? 2 : 1,
    aspectRatio: '5 / 6',
    position: 'relative',
  };
  const txt: React.CSSProperties = { order: row.reverse ? 1 : 2 };

  return (
    <div style={wrap} className="at-editrow">
      {/* Ghost roman numeral */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: row.reverse ? 'auto' : '-0.04em',
          right: row.reverse ? '-0.04em' : 'auto',
          transform: 'translateY(-50%)',
          fontFamily: SERIF,
          fontSize: 'clamp(100px,18vw,260px)',
          fontStyle: 'italic',
          color: C.earth,
          opacity: 0.08,
          lineHeight: 1,
          userSelect: 'none',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        {row.roman}
      </div>
      <Reveal y={50} style={{ ...imgWrap, zIndex: 1 }}>
        <ParallaxImg src={row.img} alt={row.alt} />
      </Reveal>
      <div style={{ ...txt, position: 'relative', zIndex: 1 }}>
        <Reveal>
          <Eyebrow color={C.textMuted}>{row.eyebrow}</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h3
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(30px,4vw,58px)',
              fontWeight: 700,
              color: C.ink,
              margin: '18px 0 22px',
              lineHeight: 1.08,
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
              lineHeight: 1.80,
              color: C.textMuted,
              maxWidth: 460,
            }}
          >
            {row.body}
          </p>
        </Reveal>
      </div>
      <style>{`
        @media (max-width: 860px){
          .at-editrow{ grid-template-columns: 1fr !important; }
          .at-editrow > *{ order: initial !important; }
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
    <section style={sec}>
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(80px,11vw,140px)',
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
   7 · PhilosophyPanel — sticky image gauche, principes défilants droite
   ════════════════════════════════════════════════════════════════════════════ */
function PhilosophyPanel() {
  const sec: React.CSSProperties = {
    background: C.bgDark,
    padding: 'clamp(80px,11vw,150px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '0.9fr 1.1fr',
    gap: 'clamp(44px,6vw,96px)',
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
    <section style={sec} id="philosophie">
      <div style={grid} className="at-philopanel">
        {/* Sticky image */}
        <div style={stickySide} className="at-philosticky">
          <div
            style={{
              overflow: 'hidden',
              border: `1px solid rgba(74,124,63,0.28)`,
              aspectRatio: '4 / 5',
            }}
          >
            <img
              src={photo('1578662996442-48f60103fc96', 900)}
              alt="Terrasse aménagée par Atelier Terra"
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
          <div
            style={{
              marginTop: 24,
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: 17,
              color: 'rgba(200,223,196,0.72)',
              lineHeight: 1.6,
            }}
          >
            « Chaque jardin est un engagement de long terme entre un sol, des plantes et un humain. »
          </div>
        </div>

        {/* Principes défilants */}
        <div>
          <Reveal>
            <Eyebrow color={C.accentLight} light>
              Notre approche
            </Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2
              style={{
                fontFamily: SERIF,
                fontStyle: 'italic',
                fontSize: 'clamp(32px,4.5vw,62px)',
                fontWeight: 400,
                color: C.white,
                margin: '18px 0 52px',
                lineHeight: 1.06,
              }}
            >
              Quatre principes{' '}
              <span style={{ color: C.accentLight, fontStyle: 'normal' }}>fondateurs</span>
            </h2>
          </Reveal>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {PHILOSOPHY.map((item, i) => (
              <Reveal key={item.num} delay={0.06 * i}>
                <div
                  style={{
                    padding: 'clamp(28px,3.5vw,44px) 0',
                    borderTop: `1px solid rgba(74,124,63,0.28)`,
                    display: 'flex',
                    gap: 28,
                    alignItems: 'baseline',
                  }}
                >
                  <span
                    style={{
                      fontFamily: SERIF,
                      fontStyle: 'italic',
                      fontSize: 22,
                      color: C.earth,
                      opacity: 0.85,
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
                        fontSize: 'clamp(20px,2.2vw,28px)',
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
                        fontSize: 15.5,
                        lineHeight: 1.72,
                        color: 'rgba(200,223,196,0.72)',
                        margin: 0,
                      }}
                    >
                      {item.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
            <div style={{ borderTop: '1px solid rgba(74,124,63,0.28)' }} />
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 860px){
          .at-philopanel{ grid-template-columns: 1fr !important; }
          .at-philosticky{ position: static !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   8 · Testimonials
   ════════════════════════════════════════════════════════════════════════════ */
function TestimonialCard({ t, i }: { t: Testimonial; i: number }) {
  const card: React.CSSProperties = {
    background: C.bgCard,
    border: `1px solid ${C.border}`,
    padding: 'clamp(32px,4vw,50px)',
    boxShadow: '0 18px 50px -36px rgba(13,26,10,0.3)',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    boxSizing: 'border-box',
  };
  return (
    <Reveal delay={i * 0.12} style={{ height: '100%' }}>
      <figure style={card}>
        <Leaf size={30} color={C.accent} strokeWidth={1.3} />
        <blockquote
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 'clamp(17px,1.8vw,22px)',
            lineHeight: 1.62,
            color: C.ink,
            margin: '22px 0 28px',
            flex: 1,
          }}
        >
          "{t.quote}"
        </blockquote>
        <figcaption style={{ borderTop: `1px solid ${C.border}`, paddingTop: 20 }}>
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 18,
              color: C.accent,
            }}
          >
            {t.name}
          </div>
          <div
            style={{
              fontFamily: SANS,
              fontWeight: 300,
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
  );
}

function Testimonials() {
  const sec: React.CSSProperties = {
    background: C.bgAlt,
    padding: 'clamp(88px,12vw,170px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))',
    gap: 'clamp(28px,3.5vw,52px)',
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
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: 'clamp(32px,4.8vw,64px)',
              fontWeight: 400,
              color: C.ink,
              margin: '18px 0 0',
            }}
          >
            Ce qu'ils{' '}
            <span style={{ color: C.accent, fontStyle: 'normal' }}>nous confient</span>
          </h2>
        </Reveal>
      </div>
      <div style={grid}>
        {TESTIMONIALS.map((t, i) => (
          <TestimonialCard key={t.name} t={t} i={i} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   9 · QuoteForm
   ════════════════════════════════════════════════════════════════════════════ */
function QuoteForm() {
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [typeProjet, setTypeProjet] = useState('');
  const [surface, setSurface] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const projectTypes = [
    'Jardin complet',
    'Terrasse & allée',
    'Piscine & pool house',
    'Potager & verger',
    'Entretien annuel',
    'Autre',
  ];

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prenom || !email) return;
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
    borderBottom: `1px solid rgba(74,124,63,0.38)`,
    padding: '14px 2px',
    fontFamily: SERIF,
    fontSize: 17,
    color: C.white,
    outline: 'none',
    transition: 'border-color .3s',
  };

  const label: React.CSSProperties = {
    fontFamily: SANS,
    fontWeight: 300,
    fontSize: 10,
    letterSpacing: '0.30em',
    textTransform: 'uppercase',
    color: C.accentLight,
    display: 'block',
    marginBottom: 4,
  };

  return (
    <section style={sec} id="devis">
      {/* Fond subtil */}
      <img
        src={photo('1558618047-b62e0e6e8517', 1200)}
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
          <Eyebrow color={C.accentLight} align="center" light>
            Devis gratuit &amp; sans engagement
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: 'clamp(34px,5.5vw,76px)',
              fontWeight: 400,
              color: C.white,
              margin: '20px 0 16px',
              lineHeight: 1.06,
            }}
          >
            Parlons de votre{' '}
            <span style={{ color: C.accentLight, fontStyle: 'normal' }}>jardin</span>
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p
            style={{
              fontFamily: SANS,
              fontWeight: 300,
              fontSize: 'clamp(15px,1.6vw,18px)',
              lineHeight: 1.72,
              color: 'rgba(200,223,196,0.80)',
              maxWidth: 520,
              margin: '0 auto 52px',
            }}
          >
            Décrivez votre projet, nous vous recontactons sous 48h pour organiser
            un rendez-vous découverte sur site, entièrement gratuit.
          </p>
        </Reveal>

        {sent ? (
          <Reveal>
            <div
              style={{
                border: `1px solid rgba(74,124,63,0.45)`,
                padding: 'clamp(40px,6vw,60px)',
                background: 'rgba(74,124,63,0.08)',
              }}
            >
              <Leaf size={36} color={C.accentLight} strokeWidth={1.2} />
              <h3
                style={{
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  fontSize: 32,
                  fontWeight: 400,
                  color: C.white,
                  margin: '20px 0 14px',
                }}
              >
                Merci {prenom ? `${prenom},` : ','} votre message est bien reçu !
              </h3>
              <p
                style={{
                  fontFamily: SANS,
                  fontWeight: 300,
                  fontSize: 17,
                  color: 'rgba(200,223,196,0.80)',
                  margin: 0,
                  lineHeight: 1.65,
                }}
              >
                Nous vous proposons un rendez-vous découverte gratuit sur site.
                <br />
                Notre équipe vous contacte à{' '}
                <span style={{ color: C.accentLight }}>{email}</span> sous 48h.
              </p>
            </div>
          </Reveal>
        ) : (
          <Reveal delay={0.22}>
            <form
              onSubmit={onSubmit}
              style={{ display: 'flex', flexDirection: 'column', gap: 32, textAlign: 'left' }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }} className="at-form2col">
                <div>
                  <label style={label} htmlFor="at-prenom">Prénom</label>
                  <input
                    id="at-prenom"
                    style={fieldBase}
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    placeholder="Marie"
                    autoComplete="given-name"
                    required
                  />
                </div>
                <div>
                  <label style={label} htmlFor="at-email">Email</label>
                  <input
                    id="at-email"
                    style={fieldBase}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="marie@exemple.fr"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }} className="at-form2col">
                <div>
                  <label style={label} htmlFor="at-tel">Téléphone</label>
                  <input
                    id="at-tel"
                    style={fieldBase}
                    type="tel"
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                    placeholder="06 12 34 56 78"
                    autoComplete="tel"
                  />
                </div>
                <div>
                  <label style={label} htmlFor="at-surface">Surface approximative</label>
                  <input
                    id="at-surface"
                    style={fieldBase}
                    value={surface}
                    onChange={(e) => setSurface(e.target.value)}
                    placeholder="ex : 300 m²"
                  />
                </div>
              </div>

              <div>
                <label style={label} htmlFor="at-type">Type de projet</label>
                <select
                  id="at-type"
                  style={{
                    ...fieldBase,
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    cursor: 'pointer',
                    color: typeProjet ? C.white : 'rgba(200,223,196,0.45)',
                  }}
                  value={typeProjet}
                  onChange={(e) => setTypeProjet(e.target.value)}
                >
                  <option value="" style={{ color: '#111', background: '#fff' }}>
                    Choisir un type de projet…
                  </option>
                  {projectTypes.map((pt) => (
                    <option key={pt} value={pt} style={{ color: '#111', background: '#fff' }}>
                      {pt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={label} htmlFor="at-message">Message</label>
                <textarea
                  id="at-message"
                  rows={4}
                  style={{
                    ...fieldBase,
                    resize: 'vertical',
                    borderBottom: 'none',
                    border: `1px solid rgba(74,124,63,0.38)`,
                    padding: '14px 12px',
                  }}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Décrivez votre projet, vos contraintes, vos envies…"
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
      <style>{`
        @media (max-width: 860px){
          .at-form2col{ grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   10 · Footer
   ════════════════════════════════════════════════════════════════════════════ */
function Footer() {
  const cols: { title: string; items: string[]; href: string }[] = [
    {
      title: 'Services',
      href: '#services',
      items: ['Création de jardin', 'Aménagement terrasse', 'Entretien & tonte', 'Potager & permaculture', 'Bassin & piscine naturelle'],
    },
    {
      title: "Zone d'action",
      href: '#realisations',
      items: ['Nantes', 'Saint-Herblain', 'Rezé', 'Ancenis', 'La Roche-sur-Yon'],
    },
    {
      title: 'Approche & Contact',
      href: '#philosophie',
      items: ['Notre philosophie', 'Biodiversité', 'Garantie reprise 2 ans', 'contact@atelierterranantes.fr', '02 40 XX XX XX'],
    },
  ];

  const foot: React.CSSProperties = {
    background: C.bgDarkAlt,
    borderTop: `1px solid rgba(74,124,63,0.18)`,
    padding: 'clamp(66px,9vw,110px) clamp(24px,6vw,96px) 40px',
  };

  return (
    <footer style={foot}>
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.4fr repeat(3, 1fr)',
          gap: 'clamp(32px,4.5vw,64px)',
        }}
        className="at-footgrid"
      >
        {/* Brand */}
        <div>
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 24,
              letterSpacing: '0.10em',
              color: C.white,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <Leaf size={20} color={C.accent} strokeWidth={1.4} />
            Atelier Terra
          </div>
          <p
            style={{
              fontFamily: SANS,
              fontWeight: 300,
              fontStyle: 'italic',
              fontSize: 15,
              lineHeight: 1.70,
              color: 'rgba(200,223,196,0.62)',
              marginTop: 20,
              maxWidth: 320,
            }}
          >
            Paysagiste & aménagement extérieur à Nantes depuis 2010. Jardins vivants, durables et sans chimie.
          </p>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginTop: 22,
              fontFamily: SANS,
              fontWeight: 300,
              fontSize: 11,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'rgba(200,223,196,0.52)',
            }}
          >
            <MapPin size={13} color={C.accent} strokeWidth={1.5} />
            Nantes, Loire-Atlantique
          </div>
        </div>

        {/* Columns */}
        {cols.map((col) => (
          <div key={col.title}>
            <div
              style={{
                fontFamily: SANS,
                fontWeight: 400,
                fontSize: 10.5,
                letterSpacing: '0.28em',
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
                    href={col.href}
                    style={{
                      fontFamily: SANS,
                      fontWeight: 300,
                      fontSize: 15,
                      color: 'rgba(200,223,196,0.70)',
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
          borderTop: `1px solid rgba(74,124,63,0.14)`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 14,
          fontFamily: SANS,
          fontWeight: 300,
          fontSize: 11,
          letterSpacing: '0.10em',
          color: 'rgba(200,223,196,0.44)',
        }}
      >
        <span>© 2010–2026 Atelier Terra. Tous droits réservés.</span>
        <span style={{ display: 'flex', gap: 24 }}>
          <a href="#at-type" style={{ color: 'inherit', textDecoration: 'none' }}>Mentions légales</a>
          <a href="#at-type" style={{ color: 'inherit', textDecoration: 'none' }}>Confidentialité</a>
        </span>
      </div>
      <style>{`
        @media (max-width: 860px){
          .at-footgrid{ grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 540px){
          .at-footgrid{ grid-template-columns: 1fr !important; }
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
    };
  }

  const root: React.CSSProperties = {
    background: C.bg,
    color: C.ink,
    fontFamily: SERIF,
    overflowX: 'hidden',
    WebkitFontSmoothing: 'antialiased',
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
      <style>{FONTS}</style>
      <Nav />
      <Hero />
      <Intro />
      <ProjectSequence />
      <ServiceCards />
      <EditorialRows />
      <PhilosophyPanel />
      <Testimonials />
      <QuoteForm />
      <Footer />
    </main>
  );
}
