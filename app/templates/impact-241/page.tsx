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
  Home,
  MapPin,
  Quote,
} from 'lucide-react';

/* ════════════════════════════════════════════════════════════════════════════
   CLÉ DE VOÛTE IMMOBILIER — Agence immobilière premium · Bordeaux
   Chorégraphie éditoriale, crossfade 320vh, panneau collant, formulaire.
   Auto-suffisant. 'use client'.
   ════════════════════════════════════════════════════════════════════════════ */

/* ── Palette ─────────────────────────────────────────────────────────────── */
const C = {
  bg: '#faf8f4',
  bgAlt: '#f2ede3',
  bgDark: '#131008',
  bgDarkAlt: '#1e1a0e',
  bgCard: '#ffffff',
  accent: '#b8862a',
  accentDark: '#96701f',
  accentLight: '#f0deb0',
  white: '#ffffff',
  ink: '#131008',
  textMuted: '#6b5e3a',
  textFaint: '#a09070',
  border: '#ddd0b0',
  borderDark: 'rgba(184,134,42,0.25)',
} as const;

const SERIF = "Georgia, 'Times New Roman', Cambria, serif" as const;
const SANS = "'Helvetica Neue', Helvetica, Arial, system-ui, sans-serif" as const;

/* ── Photos ───────────────────────────────────────────────────────────────── */
const PHOTO = {
  heroLiving: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2000&auto=format&fit=crop',
  seqLiving: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1600&auto=format&fit=crop',
  seqOffice: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1600&auto=format&fit=crop',
  seqVineyard: 'https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?q=80&w=1600&auto=format&fit=crop',
  editRow1: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800&auto=format&fit=crop',
  editRow2: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop',
  expertiseSticky: 'https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?q=80&w=900&auto=format&fit=crop',
} as const;

/* ── Easing partagé ──────────────────────────────────────────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ════════════════════════════════════════════════════════════════════════════
   Interfaces de données
   ════════════════════════════════════════════════════════════════════════════ */

interface Property {
  src: string;
  alt: string;
  index: string;
  caption: string;
  sub: string;
}

interface Service {
  title: string;
  desc: string;
  badge: string;
}

interface EditRow {
  eyebrow: string;
  imgSrc: string;
  imgAlt: string;
  ghostNum: string;
  title: React.ReactNode;
  body: string;
  stat: string;
  statLabel: string;
  reverse: boolean;
}

interface ExpertiseItem {
  step: string;
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

const PROPERTIES: Property[] = [
  {
    src: PHOTO.seqLiving,
    alt: "Salon d'appartement de prestige, Bordeaux Chartrons",
    index: 'I',
    caption: 'RÉSIDENTIEL PRESTIGE',
    sub: "Appartements, maisons, villas — de 300 000 € à 3 M€. Quartiers Chartrons, Saint-Pierre, Triangle d'Or.",
  },
  {
    src: PHOTO.seqOffice,
    alt: 'Immeuble moderne, investissement locatif Bordeaux',
    index: 'II',
    caption: 'INVESTISSEMENT LOCATIF',
    sub: 'Rendements optimisés, gestion intégrale, défiscalisation Pinel & Malraux — votre patrimoine, notre métier.',
  },
  {
    src: PHOTO.seqVineyard,
    alt: 'Domaine viticole Gironde, propriété bordelaise',
    index: 'III',
    caption: 'PROPRIÉTÉS & VIGNOBLES',
    sub: 'Domaines viticoles, chartreuses, châteaux — expertise exclusive sur le marché bordelais et Gironde.',
  },
];

const SERVICES: Service[] = [
  {
    title: 'Estimation gratuite',
    desc: 'Évaluation précise de votre bien en 48h, fondée sur 2 000+ transactions et les données du marché bordelais en temps réel.',
    badge: '48h',
  },
  {
    title: 'Vente exclusive',
    desc: "Mandat exclusif, mise en valeur photographique professionnelle et accès à notre réseau d'acheteurs qualifiés pré-validés.",
    badge: 'Exclusif',
  },
  {
    title: 'Recherche sur mesure',
    desc: "Vous décrivez, nous trouvons. Nos chasseurs immobiliers activent l'ensemble de notre réseau pour dénicher le bien rare.",
    badge: 'Sur-mesure',
  },
  {
    title: 'Gestion locative',
    desc: 'Sélection locataire, rédaction des baux, état des lieux, suivi des travaux et reversements mensuels — zéro stress.',
    badge: 'Full-service',
  },
  {
    title: 'Investissement & Défiscalisation',
    desc: 'Stratégies Pinel, Malraux, déficit foncier et LMNP : nous construisons avec vous le meilleur montage patrimonial.',
    badge: 'Fiscal',
  },
  {
    title: 'Expertise & Conseil',
    desc: 'Audit de marché, analyse de risques et conseils stratégiques pour les investisseurs, family offices et promoteurs.',
    badge: 'Conseil',
  },
];

const EDIT_ROWS: EditRow[] = [
  {
    eyebrow: 'Notre approche',
    imgSrc: PHOTO.editRow1,
    imgAlt: 'Appartement premium Bordeaux, approche exclusive',
    ghostNum: 'I',
    title: (
      <>
        Votre bien,{' '}
        <span style={{ fontStyle: 'italic' }}>une histoire unique.</span>
      </>
    ),
    body: "Nous ne signons pas de mandats simples. Chaque bien que nous accompagnons bénéficie d'une stratégie de commercialisation dédiée : valorisation scénographique, ciblage acheteur et négociation à haut niveau. Notre taux de concrétisation dépasse 98 % en mandat exclusif.",
    stat: '98%',
    statLabel: 'de succès en mandat exclusif',
    reverse: false,
  },
  {
    eyebrow: 'Notre réseau',
    imgSrc: PHOTO.editRow2,
    imgAlt: 'Réseau international Bordeaux, partenaires Knight Frank',
    ghostNum: 'II',
    title: (
      <>
        Bordeaux,{' '}
        <span style={{ fontStyle: 'italic' }}>et bien au-delà.</span>
      </>
    ),
    body: "Partenaire agréé Knight Frank, nous relions vos biens à un réseau de 800 bureaux dans 60 pays. Investisseurs suisses, acheteurs britanniques, fonds familiaux luxembourgeois — notre carnet d'adresses internationale fait la différence sur les biens d'exception.",
    stat: '60',
    statLabel: 'pays dans notre réseau',
    reverse: true,
  },
];

const EXPERTISE_ITEMS: ExpertiseItem[] = [
  {
    step: 'I',
    title: 'Estimation précise',
    body: "Fondée sur plus de 2 000 transactions réalisées à Bordeaux et en Gironde depuis 2003, notre méthode d'évaluation croise données de marché, analyse comparatives et réalité terrain pour un prix juste — et vendable.",
  },
  {
    step: 'II',
    title: "Réseau d'acheteurs qualifiés",
    body: "Chaque acheteur enregistré dans notre base est pré-validé financièrement. Quand vous nous confiez un bien, nos premiers appels partent dans l'heure. Le délai moyen de vente en mandat exclusif est de 34 jours.",
  },
  {
    step: 'III',
    title: 'Accompagnement juridique & notarial',
    body: 'Dès la promesse de vente, notre juriste interne et nos notaires partenaires sécurisent chaque étape : audit de titre, clauses suspensives, fiscalité de la cession, purge des préemptions. Aucune surprise à la signature.',
  },
  {
    step: 'IV',
    title: 'Après-vente & suivi patrimonial',
    body: "Notre relation ne s'arrête pas à l'acte. Nous assurons un suivi patrimonial annuel : valorisation du parc, opportunités de réinvestissement et alertes marché pour que votre patrimoine immobilier continue de travailler pour vous.",
  },
];

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Nous avions mis notre appartement des Chartrons en vente deux fois sans succès avec d'autres agences. Clé de Voûte l'a vendu en 8 jours, au-dessus de notre prix de réserve. Leur méthode est radicalement différente : photos de qualité studio, acheteurs ciblés, négociation sans concession. Nous ne saurions recommander personne d'autre.",
    name: 'Sophie & Thomas D.',
    role: 'Vendeurs · Chartrons, Bordeaux',
  },
  {
    quote:
      "En trois ans, j'ai constitué un portefeuille de quatre appartements à Bordeaux via Clé de Voûte. Ils m'ont guidé sur le choix des quartiers, le montage fiscal et la gestion locative. Chaque acquisition a performé au-delà des projections initiales. C'est une vraie relation de confiance, sur le long terme — exactement ce qu'un investisseur sérieux recherche.",
    name: 'Laurent M.',
    role: 'Investisseur privé · Bordeaux & Lyon',
  },
];

/* ════════════════════════════════════════════════════════════════════════════
   Primitives
   ════════════════════════════════════════════════════════════════════════════ */

function Eyebrow({
  children,
  color = C.accent,
  align = 'left',
  dark = false,
}: {
  children: React.ReactNode;
  color?: string;
  align?: 'left' | 'center';
  dark?: boolean;
}) {
  void dark;
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
    flexShrink: 0,
  };
  const label: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 10.5,
    letterSpacing: '0.44em',
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

function GoldButton({
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
    gap: 11,
    padding: small ? '12px 24px' : '15px 30px',
    fontFamily: SANS,
    fontSize: small ? 11 : 11.5,
    letterSpacing: '0.24em',
    textTransform: 'uppercase',
    fontWeight: 500,
    cursor: 'pointer',
    border: `1px solid ${C.accent}`,
    background: filled ? C.accent : 'transparent',
    color: filled ? C.bgDark : C.accent,
    transition: 'all .5s cubic-bezier(.16,1,.3,1)',
  };
  const hov: React.CSSProperties = hover
    ? filled
      ? { background: '#c8952e', transform: 'translateY(-2px)' }
      : { background: 'rgba(184,134,42,0.10)', transform: 'translateY(-2px)' }
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
    const onScroll = () => setSolid(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: 'Biens', href: '#biens' },
    { label: 'Services', href: '#services' },
    { label: 'Notre expertise', href: '#expertise' },
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
    padding: solid ? '15px clamp(20px,5vw,64px)' : '26px clamp(20px,5vw,64px)',
    background: solid ? 'rgba(19,16,8,0.94)' : 'transparent',
    backdropFilter: solid ? 'blur(16px) saturate(120%)' : 'none',
    WebkitBackdropFilter: solid ? 'blur(16px) saturate(120%)' : 'none',
    borderBottom: solid
      ? `1px solid rgba(184,134,42,0.22)`
      : '1px solid transparent',
    transition: 'all .6s cubic-bezier(.16,1,.3,1)',
  };

  const brand: React.CSSProperties = {
    fontFamily: SERIF,
    fontSize: 'clamp(16px,1.6vw,20px)',
    letterSpacing: '0.08em',
    color: C.white,
    fontWeight: 400,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    flexShrink: 0,
  };

  const linkRow: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'clamp(18px,2.4vw,38px)',
  };

  return (
    <>
      <nav style={bar}>
      <div style={brand}>
        <Home size={18} color={C.accent} strokeWidth={1.4} />{fd?.businessName ?? "Clé de Voûte"}</div>
      <div style={linkRow} className="cdv-navlinks">
        {links.map((l) => (
          <NavLink key={l.label} label={l.label} href={l.href} />
        ))}
      </div>
      <div className="cdv-navcta">
        <a href="#contact" style={{ textDecoration: 'none' }}>
          <GoldButton filled small>Estimation gratuite</GoldButton>
        </a>
      </div>
      
        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="cdv-burger"
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
        @media (max-width: 900px){
          .cdv-navlinks{ display:none !important; }
          .cdv-burger { display: flex !important; flex-direction: column; }
          .cdv-navcta{ display:none !important; }
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
        color: h ? C.accent : C.white,
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
   Hero (100vh, parallaxe, texte bas-gauche)
   ════════════════════════════════════════════════════════════════════════════ */
function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '14%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-34%']);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);

  const section: React.CSSProperties = {
    position: 'relative',
    height: '100vh',
    minHeight: 640,
    overflow: 'hidden',
    background: C.bgDark,
  };

  return (
    <section id="hero" ref={ref} style={section}>
      {/* Photo parallaxe */}
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
          src={PHOTO.heroLiving}
          alt="Appartement de prestige Bordeaux — Clé de Voûte Immobilier"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          priority-fetch="high"
        />
      </motion.div>

      {/* Scrim bas */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to top, rgba(19,16,8,0.90) 0%, rgba(19,16,8,0.42) 38%, rgba(19,16,8,0.12) 70%, rgba(19,16,8,0.30) 100%)',
        }}
      />
      {/* Scrim latéral gauche */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to right, rgba(19,16,8,0.68) 0%, rgba(19,16,8,0.10) 55%, transparent 100%)',
        }}
      />

      {/* Contenu bas-gauche */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: 'clamp(48px,8vh,100px)',
          left: 'clamp(24px,6vw,96px)',
          right: 'clamp(24px,6vw,96px)',
          zIndex: 2,
          opacity: contentOpacity,
          y: contentY,
          maxWidth: 780,
        }}
      >
        <Reveal y={16}>
          <Eyebrow color={C.accentLight}>
            Immobilier premium · Bordeaux · Depuis 2003
          </Eyebrow>
        </Reveal>

        <motion.h1
          initial={{ opacity: 0, y: 44 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.14 }}
          style={{
            fontFamily: SERIF,
            fontWeight: 400,
            fontStyle: 'italic',
            color: C.white,
            fontSize: 'clamp(3rem,7.5vw,9rem)',
            lineHeight: 0.97,
            letterSpacing: '-0.01em',
            margin: '22px 0 22px',
            textShadow: '0 12px 60px rgba(0,0,0,0.45)',
          }}
        >
          Trouver le bien
          <br />
          qui vous ressemble.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.44 }}
          style={{
            fontFamily: SANS,
            fontSize: 'clamp(14px,1.5vw,17px)',
            color: 'rgba(255,255,255,0.80)',
            lineHeight: 1.7,
            maxWidth: 500,
            marginBottom: 38,
            letterSpacing: '0.01em',
          }}
        >
          L'agence bordelaise de référence pour l'immobilier de prestige, l'investissement locatif et les propriétés d'exception en Gironde.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.68 }}
          style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}
        >
          <GoldButton filled>Parler de votre projet</GoldButton>
          <GoldButton>Voir nos biens</GoldButton>
        </motion.div>
      </motion.div>

      {/* Cue défilement */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: 32,
          right: 'clamp(24px,6vw,96px)',
          zIndex: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 9,
          opacity: cueOpacity,
        }}
      >
        <span
          style={{
            fontFamily: SANS,
            fontSize: 10,
            letterSpacing: '0.36em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.60)',
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
          <ChevronDown size={18} color={C.accentLight} strokeWidth={1.3} />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   Intro — citation centrée serif sur bgAlt
   ════════════════════════════════════════════════════════════════════════════ */
function Intro() {
  const sec: React.CSSProperties = {
    background: C.bgAlt,
    padding: 'clamp(88px,13vw,180px) clamp(24px,8vw,160px)',
    textAlign: 'center',
  };
  return (
    <section style={sec}>
      <Reveal>
        <p
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 'clamp(24px,3.2vw,44px)',
            lineHeight: 1.38,
            fontWeight: 400,
            maxWidth: 900,
            margin: '0 auto',
            color: C.ink,
          }}
        >
          Un bien immobilier n'est pas qu'une transaction. C'est le décor d'un chapitre de vie — une naissance, un départ, une renaissance. Nous l'abordons avec cette conviction, et cette exigence.
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
   PropertySequence — Crossfade 320vh collant
   ════════════════════════════════════════════════════════════════════════════ */
function PropertyLayer({
  prop,
  i,
  total,
  progress,
}: {
  prop: Property;
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
        src={prop.src}
        alt={prop.alt}
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

function PropertyCaption({
  prop,
  i,
  total,
  progress,
}: {
  prop: Property;
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
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
        padding: 'clamp(40px,7vw,100px)',
        opacity,
        y,
      }}
    >
      <span
        style={{
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontSize: 'clamp(60px,12vw,160px)',
          color: 'rgba(184,134,42,0.22)',
          lineHeight: 1,
          position: 'absolute',
          top: 'clamp(24px,5vw,70px)',
          right: 'clamp(24px,5vw,70px)',
          userSelect: 'none',
        }}
      >
        {prop.index}
      </span>
      <div
        style={{
          fontFamily: SANS,
          fontSize: 10.5,
          letterSpacing: '0.44em',
          textTransform: 'uppercase',
          color: C.accent,
          marginBottom: 16,
        }}
      >
        {prop.caption}
      </div>
      <p
        style={{
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontSize: 'clamp(15px,1.8vw,22px)',
          color: 'rgba(255,255,255,0.86)',
          maxWidth: 540,
          lineHeight: 1.6,
          margin: 0,
        }}
      >
        {prop.sub}
      </p>
    </motion.div>
  );
}

function PropertySequenceDot({
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
  const width = useTransform(progress, [i * seg, (i + 1) * seg], [10, 34]);
  return (
    <motion.div style={{ height: 2, width, background: C.accent, opacity }} />
  );
}

function PropertySequence() {
  const n = PROPERTIES.length;
  const progress = useMotionValue(0.5 / n);
  const [active, setActive] = useState(0);
  const goTo = (i: number) => {
    setActive(i);
    progress.set((i + 0.5) / n);
  };

  return (
    <section
      id="biens"
      style={{ height: '100vh', overflow: 'hidden', position: 'relative', background: C.bgDark }}
    >
      <div
        style={{
          position: 'relative',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {/* Images crossfade */}
        {PROPERTIES.map((p, i) => (
          <PropertyLayer
            key={p.index}
            prop={p}
            i={i}
            total={PROPERTIES.length}
            progress={progress}
          />
        ))}

        {/* Voile lisibilité */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to top, rgba(19,16,8,0.82) 0%, rgba(19,16,8,0.14) 44%, rgba(19,16,8,0.38) 100%)',
          }}
        />

        {/* Captions */}
        {PROPERTIES.map((p, i) => (
          <PropertyCaption
            key={p.index}
            prop={p}
            i={i}
            total={PROPERTIES.length}
            progress={progress}
          />
        ))}

        {/* Label section haut-droite */}
        <div
          style={{
            position: 'absolute',
            top: 'clamp(88px,10vh,110px)',
            right: 'clamp(24px,5vw,70px)',
            fontFamily: SANS,
            fontSize: 10,
            letterSpacing: '0.38em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.45)',
          }}
        >
          Nos marchés
        </div>

        {/* Dots de progression */}
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
          {PROPERTIES.map((p, i) => (
            <PropertySequenceDot
              key={p.index}
              i={i}
              total={PROPERTIES.length}
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
   ServiceCards — 6 cartes sur bgAlt
   ════════════════════════════════════════════════════════════════════════════ */
function ServiceCard({ s, i }: { s: Service; i: number }) {
  const [hover, setHover] = useState(false);
  const card: React.CSSProperties = {
    background: C.bgCard,
    border: `1px solid ${hover ? C.accent : C.border}`,
    padding: 'clamp(28px,3.5vw,44px)',
    transform: hover ? 'translateY(-10px)' : 'none',
    boxShadow: hover
      ? '0 36px 72px -34px rgba(19,16,8,0.28)'
      : '0 12px 32px -24px rgba(19,16,8,0.18)',
    transition: 'all .6s cubic-bezier(.16,1,.3,1)',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  };
  return (
    <Reveal delay={i * 0.08} style={{ height: '100%' }}>
      <article
        style={card}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div
          style={{
            display: 'inline-block',
            fontFamily: SANS,
            fontSize: 9.5,
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: C.bgDark,
            background: C.accentLight,
            padding: '5px 11px',
            marginBottom: 20,
            alignSelf: 'flex-start',
          }}
        >
          {s.badge}
        </div>
        <h3
          style={{
            fontFamily: SERIF,
            fontSize: 'clamp(20px,2.2vw,26px)',
            fontWeight: 400,
            color: C.ink,
            margin: '0 0 14px',
            lineHeight: 1.12,
          }}
        >
          {s.title}
        </h3>
        <p
          style={{
            fontFamily: SANS,
            fontSize: 14.5,
            lineHeight: 1.72,
            color: C.textMuted,
            margin: '0 0 24px',
            flex: 1,
          }}
        >
          {s.desc}
        </p>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            fontFamily: SANS,
            fontSize: 10.5,
            letterSpacing: '0.20em',
            textTransform: 'uppercase',
            color: hover ? C.accentDark : C.accent,
            transition: 'color .4s',
          }}
        >
          En savoir plus
          <ArrowRight
            size={13}
            style={{
              transform: hover ? 'translateX(5px)' : 'none',
              transition: 'transform .5s cubic-bezier(.16,1,.3,1)',
            }}
          />
        </div>
      </article>
    </Reveal>
  );
}

function ServiceCards() {
  const sec: React.CSSProperties = {
    background: C.bgAlt,
    padding: 'clamp(88px,13vw,170px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 'clamp(20px,2.5vw,36px)',
    maxWidth: 1240,
    margin: '0 auto',
  };
  return (
    <section style={sec} id="services">
      <div style={{ maxWidth: 1240, margin: '0 auto 56px' }}>
        <Reveal>
          <Eyebrow color={C.textMuted}>Ce que nous faisons</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(34px,5.5vw,70px)',
              fontWeight: 400,
              color: C.ink,
              margin: '18px 0 0',
              lineHeight: 1.05,
            }}
          >
            Une expertise,{' '}
            <span style={{ fontStyle: 'italic', color: C.accent }}>
              à chaque étape.
            </span>
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
   EditorialRows — 2 lignes alternées avec ghost text
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

function EditorialRowItem({ row }: { row: EditRow }) {
  const imgWrap: React.CSSProperties = {
    overflow: 'hidden',
    order: row.reverse ? 2 : 1,
    aspectRatio: '5 / 6',
    position: 'relative',
  };
  const txt: React.CSSProperties = {
    order: row.reverse ? 1 : 2,
    position: 'relative',
  };
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'clamp(36px,6vw,90px)',
        alignItems: 'center',
        position: 'relative',
      }}
      className="cdv-editrow"
    >
      {/* Image */}
      <Reveal y={44} style={imgWrap}>
        <ParallaxImg src={row.imgSrc} alt={row.imgAlt} />
      </Reveal>

      {/* Texte */}
      <div style={txt}>
        {/* Ghost roman numeral */}
        <span
          style={{
            position: 'absolute',
            top: '-0.2em',
            right: row.reverse ? 'auto' : '-0.1em',
            left: row.reverse ? '-0.1em' : 'auto',
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 'clamp(80px,14vw,200px)',
            color: 'rgba(184,134,42,0.08)',
            lineHeight: 1,
            userSelect: 'none',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        >
          {row.ghostNum}
        </span>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Reveal>
            <Eyebrow color={C.textMuted}>{row.eyebrow}</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h3
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(28px,4vw,54px)',
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
                fontFamily: SERIF,
                fontStyle: 'italic',
                fontSize: 'clamp(15px,1.6vw,18px)',
                lineHeight: 1.82,
                color: C.textMuted,
                maxWidth: 440,
                marginBottom: 28,
              }}
            >
              {row.body}
            </p>
          </Reveal>
          <Reveal delay={0.22}>
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 12,
                borderTop: `1px solid ${C.border}`,
                paddingTop: 24,
              }}
            >
              <span
                style={{
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  fontSize: 'clamp(36px,4vw,56px)',
                  color: C.accent,
                  lineHeight: 1,
                }}
              >
                {row.stat}
              </span>
              <span
                style={{
                  fontFamily: SANS,
                  fontSize: 11,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: C.textFaint,
                }}
              >
                {row.statLabel}
              </span>
            </div>
          </Reveal>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px){
          .cdv-editrow{ grid-template-columns: 1fr !important; }
          .cdv-editrow > *{ order: initial !important; }
        }
      `}</style>
    </div>
  );
}

function EditorialRows() {
  const sec: React.CSSProperties = {
    background: C.bgAlt,
    padding: 'clamp(80px,11vw,160px) clamp(24px,6vw,96px)',
  };
  return (
    <section style={sec}>
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(80px,12vw,160px)',
        }}
      >
        {EDIT_ROWS.map((row) => (
          <EditorialRowItem key={row.eyebrow} row={row} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   ExpertisePanel — image collante gauche, 4 items défilent droite
   ════════════════════════════════════════════════════════════════════════════ */
function ExpertisePanel() {
  const sec: React.CSSProperties = {
    background: C.bgDark,
    padding: 'clamp(88px,12vw,160px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '0.92fr 1.08fr',
    gap: 'clamp(40px,7vw,110px)',
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
    <section style={sec} id="expertise">
      <div style={grid} className="cdv-expanel">
        {/* Image collante */}
        <div style={stickyImg} className="cdv-expanel-sticky">
          <div
            style={{
              overflow: 'hidden',
              border: `1px solid ${C.borderDark}`,
              aspectRatio: '4 / 5',
            }}
          >
            <img
              src={PHOTO.expertiseSticky}
              alt="Propriété d'exception en Gironde — Clé de Voûte"
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
          <div
            style={{
              marginTop: 22,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <MapPin size={14} color={C.accent} strokeWidth={1.4} />
            <span
              style={{
                fontFamily: SANS,
                fontSize: 11,
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                color: C.textFaint,
              }}
            >
              Bordeaux & Gironde
            </span>
          </div>
        </div>

        {/* Colonne droite — expertise items */}
        <div>
          <Reveal>
            <Eyebrow color={C.accent}>Notre méthode</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(32px,5vw,64px)',
                fontWeight: 400,
                color: C.white,
                margin: '18px 0 52px',
                lineHeight: 1.06,
              }}
            >
              L&apos;excellence,{' '}
              <span style={{ fontStyle: 'italic', color: C.accentLight }}>
                à chaque étape.
              </span>
            </h2>
          </Reveal>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {EXPERTISE_ITEMS.map((item, i) => (
              <Reveal key={item.step} delay={0.06 * i}>
                <div
                  style={{
                    padding: 'clamp(26px,3.5vw,38px) 0',
                    borderTop: `1px solid rgba(184,134,42,0.25)`,
                    display: 'flex',
                    gap: 24,
                    alignItems: 'baseline',
                  }}
                >
                  <span
                    style={{
                      fontFamily: SERIF,
                      fontStyle: 'italic',
                      fontSize: 20,
                      color: 'rgba(184,134,42,0.55)',
                      minWidth: 32,
                      flexShrink: 0,
                    }}
                  >
                    {item.step}
                  </span>
                  <div>
                    <h4
                      style={{
                        fontFamily: SERIF,
                        fontSize: 'clamp(20px,2.2vw,26px)',
                        fontWeight: 400,
                        color: C.white,
                        margin: '0 0 10px',
                      }}
                    >
                      {item.title}
                    </h4>
                    <p
                      style={{
                        fontFamily: SERIF,
                        fontStyle: 'italic',
                        fontSize: 15.5,
                        lineHeight: 1.74,
                        color: 'rgba(255,255,255,0.64)',
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
            <div style={{ marginTop: 44 }}>
              <a href="#contact" style={{ textDecoration: 'none' }}>
                <GoldButton filled>Prendre rendez-vous</GoldButton>
              </a>
            </div>
          </Reveal>
        </div>
      </div>
      <style>{`
        @media (max-width: 900px){
          .cdv-expanel{ grid-template-columns: 1fr !important; }
          .cdv-expanel-sticky{ position: static !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   Testimonials — 2 cartes longues, fond clair
   ════════════════════════════════════════════════════════════════════════════ */
function TestimonialCard({ t, i }: { t: Testimonial; i: number }) {
  return (
    <Reveal delay={i * 0.12} style={{ height: '100%' }}>
      <figure
        style={{
          background: C.bgCard,
          border: `1px solid ${C.border}`,
          padding: 'clamp(34px,4vw,52px)',
          margin: 0,
          height: '100%',
          boxSizing: 'border-box',
          boxShadow: '0 20px 56px -36px rgba(19,16,8,0.28)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Quote
          size={32}
          color={C.accent}
          strokeWidth={1.2}
          style={{ marginBottom: 20 }}
        />
        <blockquote
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 'clamp(17px,1.9vw,22px)',
            lineHeight: 1.64,
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
            paddingTop: 22,
          }}
        >
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 19,
              color: C.ink,
              marginBottom: 6,
            }}
          >
            {t.name}
          </div>
          <div
            style={{
              fontFamily: SANS,
              fontSize: 10.5,
              letterSpacing: '0.20em',
              textTransform: 'uppercase',
              color: C.textFaint,
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
    background: C.bg,
    padding: 'clamp(88px,12vw,170px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: 'clamp(28px,4vw,56px)',
    maxWidth: 1220,
    margin: '0 auto',
  };
  return (
    <section style={sec}>
      <div style={{ maxWidth: 1220, margin: '0 auto 60px', textAlign: 'center' }}>
        <Reveal>
          <Eyebrow color={C.textMuted} align="center">
            Ils nous ont fait confiance
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(32px,5vw,64px)',
              fontWeight: 400,
              color: C.ink,
              margin: '18px 0 0',
              lineHeight: 1.06,
            }}
          >
            La parole de{' '}
            <span style={{ fontStyle: 'italic', color: C.accent }}>
              nos clients.
            </span>
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
   ContactForm — champs underline, fond sombre, état "envoyé"
   ════════════════════════════════════════════════════════════════════════════ */
function ContactForm() {
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [tel, setTel] = useState('');
  const [projet, setProjet] = useState('');
  const [budget, setBudget] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prenom || !email || !projet) return;
    setSent(true);
  };

  const sec: React.CSSProperties = {
    background: C.bgDark,
    padding: 'clamp(88px,13vw,170px) clamp(24px,6vw,96px)',
    position: 'relative',
    overflow: 'hidden',
  };

  const fieldStyle: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    background: 'transparent',
    border: 'none',
    borderBottom: `1px solid rgba(184,134,42,0.38)`,
    padding: '15px 2px',
    fontFamily: SERIF,
    fontSize: 17,
    color: C.white,
    outline: 'none',
    transition: 'border-color .3s',
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 10,
    letterSpacing: '0.30em',
    textTransform: 'uppercase',
    color: C.accent,
    display: 'block',
    marginBottom: 4,
  };

  const row2: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 32,
  };

  return (
    <section style={sec} id="contact">
      {/* Fond subtil */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(184,134,42,0.07) 0%, transparent 70%)',
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
          <Eyebrow color={C.accentLight} align="center">
            Parlons de votre projet
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(34px,6vw,76px)',
              fontWeight: 400,
              color: C.white,
              margin: '20px 0 16px',
              lineHeight: 1.05,
            }}
          >
            Estimation{' '}
            <span style={{ fontStyle: 'italic', color: C.accentLight }}>
              gratuite
            </span>
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: 'clamp(15px,1.7vw,19px)',
              lineHeight: 1.72,
              color: 'rgba(255,255,255,0.72)',
              maxWidth: 540,
              margin: '0 auto 52px',
            }}
          >
            Que vous souhaitiez vendre, acheter ou simplement connaître la valeur de votre bien, nous répondons dans les 24 heures.
          </p>
        </Reveal>

        {sent ? (
          <Reveal>
            <div
              style={{
                border: `1px solid ${C.accent}`,
                padding: 'clamp(36px,5vw,56px)',
                background: 'rgba(184,134,42,0.06)',
              }}
            >
              <Home size={32} color={C.accentLight} strokeWidth={1.2} style={{ marginBottom: 20 }} />
              <h3
                style={{
                  fontFamily: SERIF,
                  fontSize: 'clamp(26px,3.5vw,40px)',
                  fontWeight: 400,
                  color: C.white,
                  margin: '0 0 14px',
                  fontStyle: 'italic',
                }}
              >
                Merci {prenom}, nous revenons vers vous dans les 24h.
              </h3>
              <p
                style={{
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  fontSize: 16,
                  color: 'rgba(255,255,255,0.70)',
                  margin: 0,
                }}
              >
                Un conseiller Clé de Voûte vous contactera à{' '}
                <strong style={{ color: C.accentLight, fontStyle: 'normal' }}>
                  {email}
                </strong>{' '}
                pour étudier votre projet.
              </p>
            </div>
          </Reveal>
        ) : (
          <Reveal delay={0.24}>
            <form
              onSubmit={onSubmit}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 30,
                textAlign: 'left',
              }}
            >
              {/* Prénom */}
              <div>
                <label style={labelStyle} htmlFor="cdv-prenom">
                  Prénom
                </label>
                <input
                  id="cdv-prenom"
                  style={fieldStyle}
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  placeholder="Votre prénom"
                  autoComplete="given-name"
                />
              </div>

              {/* Email + Téléphone */}
              <div style={row2} className="cdv-form2col">
                <div>
                  <label style={labelStyle} htmlFor="cdv-email">
                    Email
                  </label>
                  <input
                    id="cdv-email"
                    style={fieldStyle}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.fr"
                    autoComplete="email"
                  />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="cdv-tel">
                    Téléphone
                  </label>
                  <input
                    id="cdv-tel"
                    style={fieldStyle}
                    type="tel"
                    value={tel}
                    onChange={(e) => setTel(e.target.value)}
                    placeholder="+33 6 00 00 00 00"
                    autoComplete="tel"
                  />
                </div>
              </div>

              {/* Projet */}
              <div>
                <label style={labelStyle} htmlFor="cdv-projet">
                  Projet
                </label>
                <select
                  id="cdv-projet"
                  style={{
                    ...fieldStyle,
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    cursor: 'pointer',
                    color: projet ? C.white : 'rgba(255,255,255,0.40)',
                  }}
                  value={projet}
                  onChange={(e) => setProjet(e.target.value)}
                >
                  <option value="" style={{ color: '#000' }}>Votre projet…</option>
                  <option value="Achat" style={{ color: '#000' }}>Achat</option>
                  <option value="Vente" style={{ color: '#000' }}>Vente</option>
                  <option value="Location" style={{ color: '#000' }}>Location</option>
                  <option value="Estimation" style={{ color: '#000' }}>Estimation</option>
                  <option value="Autre" style={{ color: '#000' }}>Autre</option>
                </select>
              </div>

              {/* Budget */}
              <div>
                <label style={labelStyle} htmlFor="cdv-budget">
                  Budget approximatif
                </label>
                <input
                  id="cdv-budget"
                  style={fieldStyle}
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="ex. 450 000 €"
                />
              </div>

              {/* Message */}
              <div>
                <label style={labelStyle} htmlFor="cdv-message">
                  Message
                </label>
                <textarea
                  id="cdv-message"
                  style={{
                    ...fieldStyle,
                    minHeight: 110,
                    resize: 'vertical',
                    fontFamily: SERIF,
                  }}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Décrivez votre projet en quelques mots…"
                />
              </div>

              <div style={{ marginTop: 8, textAlign: 'center' }}>
                <GoldButton filled type="submit">
                  Envoyer ma demande
                </GoldButton>
              </div>
            </form>
          </Reveal>
        )}
      </div>
      <style>{`
        @media (max-width: 900px){
          .cdv-form2col{ grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   Footer — 4 colonnes, fond sombre
   ════════════════════════════════════════════════════════════════════════════ */
function Footer() {
  const cols: { title: string; items: { label: string; href: string }[] }[] = [
    {
      title: 'Services',
      items: [
        { label: 'Estimation gratuite', href: '#contact' },
        { label: 'Vente exclusive', href: '#services' },
        { label: 'Recherche sur mesure', href: '#services' },
        { label: 'Gestion locative', href: '#services' },
        { label: 'Investissement', href: '#services' },
      ],
    },
    {
      title: "Zone d\'action",
      items: [
        { label: 'Bordeaux Centre', href: '#biens' },
        { label: 'Chartrons', href: '#biens' },
        { label: 'Triangle d\'Or', href: '#biens' },
        { label: 'Gironde & Vignobles', href: '#biens' },
        { label: 'Région bordelaise', href: '#biens' },
      ],
    },
    {
      title: 'Légal',
      items: [
        { label: 'Mentions légales', href: '#contact' },
        { label: 'Politique de confidentialité', href: '#contact' },
        { label: 'CGV', href: '#contact' },
        { label: 'Carte professionnelle', href: '#contact' },
      ],
    },
  ];

  const foot: React.CSSProperties = {
    background: C.bgDarkAlt,
    borderTop: `1px solid rgba(184,134,42,0.18)`,
    padding: 'clamp(64px,9vw,110px) clamp(24px,6vw,96px) 40px',
  };

  return (
    <footer style={foot}>
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.4fr repeat(3, 1fr)',
          gap: 'clamp(32px,5vw,70px)',
        }}
        className="cdv-footgrid"
      >
        {/* Brand */}
        <div>
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(18px,2vw,24px)',
              letterSpacing: '0.06em',
              color: C.white,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 20,
            }}
          >
            <Home size={20} color={C.accent} strokeWidth={1.4} />{fd?.businessName ?? "Clé de Voûte"}</div>
          <p
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: 15,
              lineHeight: 1.74,
              color: 'rgba(255,255,255,0.58)',
              maxWidth: 300,
              marginBottom: 22,
            }}
          >
            Agence immobilière premium à Bordeaux. Expertise, réseau exclusif et accompagnement sur mesure depuis 2003.
          </p>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontFamily: SANS,
              fontSize: 10.5,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.44)',
            }}
          >
            <MapPin size={13} color={C.accent} strokeWidth={1.5} />
            12 cours de l'Intendance, 33000 Bordeaux
          </div>
        </div>

        {/* Colonnes */}
        {cols.map((col) => (
          <div key={col.title}>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 10,
                letterSpacing: '0.30em',
                textTransform: 'uppercase',
                color: C.accent,
                marginBottom: 22,
                paddingBottom: 16,
                borderBottom: `1px solid rgba(184,134,42,0.20)`,
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
                <li key={item.label}>
                  <FooterLink label={item.label} href={item.href} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bas de footer */}
      <div
        style={{
          maxWidth: 1240,
          margin: '60px auto 0',
          paddingTop: 26,
          borderTop: `1px solid rgba(184,134,42,0.14)`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 14,
          fontFamily: SANS,
          fontSize: 10.5,
          letterSpacing: '0.10em',
          color: 'rgba(255,255,255,0.38)',
        }}
      >
        <span>© 2003–2026 Clé de Voûte Immobilier · Bordeaux. Tous droits réservés.</span>
        <span style={{ display: 'flex', gap: 22 }}>
          <a href="#contact" style={{ color: 'inherit', textDecoration: 'none' }}>Mentions légales</a>
          <a href="#contact" style={{ color: 'inherit', textDecoration: 'none' }}>Confidentialité</a>
        </span>
      </div>

      <style>{`
        @media (max-width: 900px){
          .cdv-footgrid{ grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 560px){
          .cdv-footgrid{ grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}

function FooterLink({ label, href }: { label: string; href: string }) {
  const [h, setH] = useState(false);
  return (
    <a
      href={href}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        fontFamily: SERIF,
        fontSize: 15.5,
        color: h ? C.accentLight : 'rgba(255,255,255,0.64)',
        textDecoration: 'none',
        transition: 'color .35s',
      }}
    >
      {label}
    </a>
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
      <PropertySequence />
      <ServiceCards />
      <EditorialRows />
      <ExpertisePanel />
      <Testimonials />
      <ContactForm />
      <Footer />
    </main>
  );
}
