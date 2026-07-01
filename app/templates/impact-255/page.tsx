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
import { ArrowRight, ChevronDown, Shield, Star } from 'lucide-react';

/* ════════════════════════════════════════════════════════════════════════════
   MAÎTRE GÉRALDINE VOSS — Avocate en Droit des Affaires & Contentieux
   Commercial · Toulouse
   Template premium : chorégraphie de défilement éditoriale, police Spectral
   + Inter, palette ambre-or sur fond parchemin et encre.
   ════════════════════════════════════════════════════════════════════════════ */

/* ── Google Fonts ────────────────────────────────────────────────────────── */
const FONTS_HREF =
  'https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap';

/* ── Palette ─────────────────────────────────────────────────────────────── */
const C = {
  bg: '#f7f5f0',
  bgAlt: '#ece9e0',
  bgDark: '#100e08',
  bgDarkAlt: '#0a0906',
  bgCard: '#ffffff',
  accent: '#8c6c2c',
  accentDark: '#6e5420',
  accentLight: '#e8d8b0',
  white: '#ffffff',
  ink: '#100e08',
  textMuted: '#403828',
  textFaint: '#9a8c70',
  border: '#ddd8c8',
  borderDark: 'rgba(140,108,44,0.2)',
  ink2: '#2c2418',
} as const;

const SERIF = "'Spectral', Georgia, serif" as const;
const SANS = "'Inter', system-ui, sans-serif" as const;

/* ── Easing partagé ──────────────────────────────────────────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ── Photo helper ────────────────────────────────────────────────────────── */
function img(id: string, w = 1600) {
  return `https://images.unsplash.com/photo-${id}?q=80&w=${w}&auto=format&fit=crop`;
}

/* ── TypeScript interfaces ───────────────────────────────────────────────── */
interface Practice {
  index: string;
  title: string;
  body: string;
  imgId: string;
  alt: string;
}

interface Service {
  title: string;
  desc: string;
}

interface EditRow {
  eyebrow: string;
  imgId: string;
  alt: string;
  title: React.ReactNode;
  body: string;
  reverse: boolean;
}

interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

interface ValueItem {
  index: string;
  title: string;
  desc: string;
}

/* ── Data ────────────────────────────────────────────────────────────────── */
const PRACTICES: Practice[] = [
  {
    index: 'I',
    title: 'DROIT DES SOCIÉTÉS',
    body: 'Création, transformation, fusion-acquisition — accompagner la vie juridique de votre entreprise à chaque étape.',
    imgId: '1554224155-6726b3ff858f',
    alt: 'Cabinet juridique — conseil en droit des sociétés',
  },
  {
    index: 'II',
    title: 'CONTENTIEUX COMMERCIAL',
    body: 'Impayés, rupture de contrat, concurrence déloyale — défendre vos intérêts avec détermination.',
    imgId: '1507679799987-c73779587ccf',
    alt: 'Réunion de négociation commerciale',
  },
  {
    index: 'III',
    title: 'DROIT DU TRAVAIL',
    body: "Licenciement, harcèlement, accord collectif — protéger l\'employeur comme le salarié avec équité.",
    imgId: '1551135049-8a33b5883817',
    alt: 'Palais de justice — Tribunal de Commerce de Toulouse',
  },
];

const SERVICES: Service[] = [
  { title: 'Droit des sociétés', desc: "Création, cession, fusion, pactes d\'associés et gouvernance." },
  { title: 'Contentieux commercial', desc: 'Litiges contractuels, impayés, résolution amiable et judiciaire.' },
  { title: 'Droit du travail', desc: 'Licenciements, accords collectifs, négociation, conseil RH.' },
  { title: 'Recouvrement de créances', desc: 'Procédures amiables et contentieuses, injonctions de payer.' },
  { title: 'Droit immobilier', desc: 'Baux commerciaux, VEFA, litiges entre propriétaires et locataires.' },
  { title: 'Médiation & arbitrage', desc: 'Résolution alternative des conflits pour éviter les délais judiciaires.' },
];

const EDIT_ROWS: EditRow[] = [
  {
    eyebrow: 'Notre approche',
    imgId: '1554224155-6726b3ff858f',
    alt: 'Dossiers juridiques ouverts sur un bureau',
    title: (
      <>
        Clarté{' '}
        <span style={{ fontStyle: 'italic' }}>/ et détermination.</span>
      </>
    ),
    body: 'Chaque dossier est expliqué dans un langage accessible, sans jargon juridique superflu. La stratégie est pensée en amont — anticipation, pas seulement réaction. Vous êtes informé à chaque étape, et chaque choix est le vôtre.',
    reverse: false,
  },
  {
    eyebrow: 'Le cabinet',
    imgId: '1507679799987-c73779587ccf',
    alt: 'Maître Voss en réunion de conseil',
    title: (
      <>
        Toulouse{' '}
        <span style={{ fontStyle: 'italic' }}>/ depuis 2008.</span>
      </>
    ),
    body: 'Inscrite au Barreau de Toulouse, spécialisée devant le Tribunal de Commerce depuis 15 ans. Plus de 400 clients PME et ETI accompagnés. Une connaissance approfondie du tissu économique local et des juridictions toulousaines.',
    reverse: true,
  },
];

const VALUES: ValueItem[] = [
  {
    index: 'I',
    title: 'Confidentialité absolue',
    desc: 'Le secret professionnel est garanti par serment. Vos affaires ne quittent jamais le cabinet.',
  },
  {
    index: 'II',
    title: 'Tarification transparente',
    desc: 'Honoraires clairs dès le premier rendez-vous. Aucune surprise sur la facture finale.',
  },
  {
    index: 'III',
    title: 'Réactivité',
    desc: 'Disponibilité permanente pour les urgences. Réponse garantie sous 24 heures.',
  },
  {
    index: 'IV',
    title: 'Résultats',
    desc: '87 % de dossiers résolus favorablement en 2024, mesurés sur objectifs définis avec chaque client.',
  },
];

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Nous avons subi une résiliation abusive de notre contrat distributeur après 12 ans de relation. Maître Voss a construit un dossier implacable. L\'affaire a été tranchée en notre faveur en appel — 180 000 € récupérés. Une avocate qui ne lâche rien.",
    name: 'Thomas Marchand',
    role: 'PDG — entreprise de 40 personnes, secteur distribution',
  },
  {
    quote:
      'Un conflit collectif dans nos restaurants aurait pu nous bloquer des mois. En 6 semaines, Maître Voss avait trouvé un accord négocié. Son sang-froid et sa maîtrise du droit du travail ont évité le pire. Je la recommande sans réserve.',
    name: 'Isabelle Cornu',
    role: 'Directrice générale — chaîne de restauration, Toulouse',
  },
];

/* ════════════════════════════════════════════════════════════════════════════
   Primitives
   ════════════════════════════════════════════════════════════════════════════ */

/** Étiquette fine, capitales, filet doré. */
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
    opacity: dark ? 0.6 : 0.8,
    flexShrink: 0,
  };
  const label: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 10.5,
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

/** Révélation au scroll : fondu + translation verticale. */
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

/** Image avec drift parallaxe interne. */
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

/** Bouton doré, contour fin. */
function GoldButton({
  children,
  onClick,
  filled = false,
  type = 'button',
  dark = false,
  href,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  filled?: boolean;
  type?: 'button' | 'submit';
  dark?: boolean;
  href?: string;
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
    color: filled ? (dark ? C.bgDark : C.white) : C.accent,
    transition: 'all .5s cubic-bezier(.16,1,.3,1)',
    textDecoration: 'none',
  };
  const hov: React.CSSProperties = hover
    ? filled
      ? { background: C.accentDark, transform: 'translateY(-2px)', boxShadow: '0 16px 40px -20px rgba(140,108,44,0.5)' }
      : { background: 'rgba(140,108,44,0.08)', transform: 'translateY(-2px)' }
    : {};

  const content = (
    <>
      {children}
      <ArrowRight
        size={14}
        style={{
          transform: hover ? 'translateX(5px)' : 'none',
          transition: 'transform .5s cubic-bezier(.16,1,.3,1)',
        }}
      />
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{ ...base, ...hov }}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ ...base, ...hov }}
    >
      {content}
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
    { label: 'Pratiques', href: '#pratiques' },
    { label: 'Services', href: '#services' },
    { label: 'Cabinet', href: '#cabinet' },
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
    padding: solid ? '14px clamp(20px,5vw,64px)' : '24px clamp(20px,5vw,64px)',
    background: solid ? 'rgba(16,14,8,0.96)' : 'transparent',
    backdropFilter: solid ? 'blur(16px) saturate(130%)' : 'none',
    WebkitBackdropFilter: solid ? 'blur(16px) saturate(130%)' : 'none',
    borderBottom: solid ? `1px solid rgba(140,108,44,0.22)` : '1px solid transparent',
    transition: 'all .6s cubic-bezier(.16,1,.3,1)',
  };

  const brand: React.CSSProperties = {
    fontFamily: SERIF,
    fontSize: 19,
    fontStyle: 'italic',
    fontWeight: 400,
    color: solid ? C.accentLight : C.white,
    letterSpacing: '0.02em',
    transition: 'color .5s',
    textDecoration: 'none',
  };

  const linkRow: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'clamp(20px,2.6vw,40px)',
  };

  return (
    <>
      <nav style={bar}>
      <a href="#hero" style={brand}>{fd?.businessName ?? "Maître Voss"}</a>
      <div style={linkRow} className="gv-navlinks">
        {links.map((l) => (
          <NavLink key={l.label} label={l.label} href={l.href} />
        ))}
      </div>
      <div className="gv-navcta">
        <a href="#contact" style={{ textDecoration: 'none' }}>
          <GoldButton filled dark>Consultation</GoldButton>
        </a>
      </div>
      
        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="gv-burger"
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
          .gv-navlinks { display: none !important; }
          .gv-burger { display: flex !important; flex-direction: column; }
          .gv-navcta { display: none !important; }
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
        fontWeight: 400,
        color: h ? C.accentLight : 'rgba(255,255,255,0.84)',
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
   2 · HERO (100vh)
   ════════════════════════════════════════════════════════════════════════════ */
function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '14%']);
  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '-40%']);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
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
          src={img('1554224155-6726b3ff858f', 2000)}
          alt="Cabinet d'avocats — bureau élégant à Toulouse"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </motion.div>

      {/* Voile principal */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(16,14,8,0.38) 0%, rgba(16,14,8,0.12) 38%, rgba(16,14,8,0.52) 70%, rgba(16,14,8,0.90) 100%)',
        }}
      />
      {/* Voile latéral gauche */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to right, rgba(16,14,8,0.68) 0%, rgba(16,14,8,0.22) 50%, transparent 100%)',
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
          padding: 'clamp(24px,6vw,96px) clamp(24px,6vw,96px) clamp(64px,8vw,100px)',
          y: titleY,
          opacity: titleOpacity,
        }}
      >
        <Reveal y={20}>
          <Eyebrow color={C.accentLight}>
            Avocate au Barreau de Toulouse
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
            fontSize: 'clamp(3rem,6.5vw,7.5rem)',
            lineHeight: 1.0,
            letterSpacing: '-0.01em',
            margin: 'clamp(20px,2.5vw,36px) 0 clamp(18px,2vw,28px)',
            maxWidth: '16ch',
            textShadow: '0 12px 60px rgba(0,0,0,0.45)',
          }}
        >
          Votre droit{' '}
          <span style={{ color: C.accentLight }}>/</span>
          <br />
          défendu.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.42 }}
          style={{
            fontFamily: SANS,
            fontWeight: 300,
            fontSize: 'clamp(15px,1.6vw,19px)',
            color: 'rgba(255,255,255,0.80)',
            maxWidth: 480,
            lineHeight: 1.7,
            marginBottom: 'clamp(28px,3.5vw,48px)',
          }}
        >
          Droit des affaires et contentieux commercial. 15 ans d'expérience au service des entreprises qui ne transigent pas sur leurs droits.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.66 }}
        >
          <GoldButton filled dark href="#contact">
            Prendre rendez-vous
          </GoldButton>
        </motion.div>
      </motion.div>

      {/* Cue défilement */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: 34,
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
            fontSize: 9.5,
            letterSpacing: '0.36em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.6)',
            writingMode: 'vertical-rl',
          }}
        >
          Défiler
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
   3 · INTRO (citation éditoriale)
   ════════════════════════════════════════════════════════════════════════════ */
function Intro() {
  const sec: React.CSSProperties = {
    background: C.bgAlt,
    padding: 'clamp(96px,14vw,200px) clamp(24px,8vw,160px)',
    textAlign: 'center',
  };
  return (
    <section style={sec} id="intro">
      <Reveal>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 40 }}>
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
            fontWeight: 300,
            fontSize: 'clamp(24px,3.4vw,48px)',
            lineHeight: 1.38,
            maxWidth: '24ch',
            margin: '0 auto',
            color: C.ink,
          }}
        >
          "Le droit n&apos;est pas un obstacle à votre développement. C&apos;est votre meilleure protection."
        </p>
      </Reveal>
      <Reveal delay={0.2}>
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
   4 · PRACTICE SEQUENCE — crossfade sticky 320vh
   ════════════════════════════════════════════════════════════════════════════ */
function PracticeLayer({
  practice,
  i,
  total,
  progress,
}: {
  practice: Practice;
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
        src={img(practice.imgId)}
        alt={practice.alt}
        loading="lazy"
        style={{ width: '100%', height: '100%', objectFit: 'cover', scale }}
      />
    </motion.div>
  );
}

function PracticeCaption({
  practice,
  i,
  total,
  progress,
}: {
  practice: Practice;
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
  const y = useTransform(progress, [start, end], [28, -28]);

  return (
    <motion.div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: 'clamp(32px,5vw,80px) clamp(24px,6vw,80px)',
        opacity,
        y,
      }}
    >
      {/* Section label top-right */}
      <div
        style={{
          position: 'absolute',
          top: 'clamp(90px,9vw,130px)',
          right: 'clamp(24px,4vw,64px)',
          textAlign: 'right',
        }}
      >
        <span
          style={{
            fontFamily: SANS,
            fontSize: 10.5,
            letterSpacing: '0.36em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.55)',
          }}
        >
          Pratique {practice.index} / {total}
        </span>
      </div>

      <div style={{ maxWidth: 680 }}>
        <span
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 'clamp(56px,10vw,130px)',
            color: `rgba(140,108,44,0.18)`,
            lineHeight: 1,
            display: 'block',
            marginBottom: 4,
          }}
        >
          {practice.index}
        </span>
        <h2
          style={{
            fontFamily: SANS,
            fontWeight: 500,
            fontSize: 'clamp(22px,3.2vw,42px)',
            letterSpacing: '0.18em',
            color: C.white,
            margin: '0 0 clamp(14px,1.8vw,22px)',
            textShadow: '0 4px 30px rgba(0,0,0,0.5)',
          }}
        >
          {practice.title}
        </h2>
        <p
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 'clamp(15px,1.6vw,20px)',
            lineHeight: 1.7,
            color: 'rgba(255,255,255,0.82)',
            maxWidth: 520,
            margin: 0,
          }}
        >
          {practice.body}
        </p>
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
      style={{ height: 2, width, background: C.accent, opacity, flexShrink: 0 }}
    />
  );
}

function PracticeSequence() {
  const n = PRACTICES.length;
  const progress = useMotionValue(0.5 / n);
  const [active, setActive] = useState(0);
  const goTo = (i: number) => {
    setActive(i);
    progress.set((i + 0.5) / n);
  };

  return (
    <section
      style={{ height: '100vh', overflow: 'hidden', position: 'relative', background: C.bgDark }}
      id="pratiques"
    >
      <div
        style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}
      >
        {PRACTICES.map((p, i) => (
          <PracticeLayer
            key={p.title}
            practice={p}
            i={i}
            total={PRACTICES.length}
            progress={progress}
          />
        ))}

        {/* Voile lisibilité */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to top, rgba(16,14,8,0.75) 0%, rgba(16,14,8,0.22) 40%, rgba(16,14,8,0.30) 100%)',
          }}
        />

        {PRACTICES.map((p, i) => (
          <PracticeCaption
            key={p.title}
            practice={p}
            i={i}
            total={PRACTICES.length}
            progress={progress}
          />
        ))}

        {/* Barre de progression */}
        <div
          style={{
            position: 'absolute',
            bottom: 38,
            left: 'clamp(24px,6vw,80px)',
            display: 'flex',
            gap: 10,
            alignItems: 'center',
          }}
        >
          {PRACTICES.map((p, i) => (
            <ProgressDot
              key={p.index}
              i={i}
              total={PRACTICES.length}
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
   5 · SERVICE CARDS
   ════════════════════════════════════════════════════════════════════════════ */
function ServiceCard({ service, i }: { service: Service; i: number }) {
  const [hover, setHover] = useState(false);

  const card: React.CSSProperties = {
    background: C.bgCard,
    borderLeft: `3px solid ${hover ? C.accent : C.border}`,
    borderTop: `1px solid ${C.border}`,
    borderRight: `1px solid ${C.border}`,
    borderBottom: `1px solid ${C.border}`,
    padding: 'clamp(28px,3vw,40px) clamp(24px,2.5vw,34px)',
    transform: hover ? 'translateY(-8px)' : 'none',
    boxShadow: hover
      ? '0 32px 60px -28px rgba(16,14,8,0.18)'
      : '0 8px 28px -20px rgba(16,14,8,0.10)',
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
        <h3
          style={{
            fontFamily: SERIF,
            fontSize: 'clamp(20px,2vw,26px)',
            fontWeight: 400,
            color: C.ink,
            margin: '0 0 14px',
            lineHeight: 1.2,
          }}
        >
          {service.title}
        </h3>
        <p
          style={{
            fontFamily: SANS,
            fontSize: 14.5,
            lineHeight: 1.7,
            color: C.textMuted,
            margin: 0,
            fontWeight: 300,
          }}
        >
          {service.desc}
        </p>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginTop: 22,
            fontFamily: SANS,
            fontSize: 11,
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
    background: C.bg,
    padding: 'clamp(96px,13vw,180px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 'clamp(16px,2vw,28px)',
    maxWidth: 1280,
    margin: '0 auto',
  };
  return (
    <section style={sec} id="services">
      <div style={{ maxWidth: 1280, margin: '0 auto clamp(52px,6vw,80px)' }}>
        <Reveal>
          <Eyebrow>Domaines d&apos;intervention</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: 'clamp(34px,5vw,66px)',
              fontWeight: 400,
              color: C.ink,
              margin: 'clamp(18px,2vw,28px) 0 0',
              lineHeight: 1.08,
            }}
          >
            Ce que nous défendons
          </h2>
        </Reveal>
      </div>
      <div style={grid}>
        {SERVICES.map((s, i) => (
          <ServiceCard key={s.title} service={s} i={i} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   6 · EDITORIAL ROWS
   ════════════════════════════════════════════════════════════════════════════ */
function EditorialRow({ row, index }: { row: EditRow; index: number }) {
  const wrap: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 'clamp(36px,6vw,96px)',
    alignItems: 'center',
    position: 'relative',
  };

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
    <div style={wrap} className="gv-editrow">
      {/* Numéro fantôme */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '-0.12em',
          right: row.reverse ? 'auto' : '-0.05em',
          left: row.reverse ? '-0.05em' : 'auto',
          fontFamily: SERIF,
          fontSize: 'clamp(120px,18vw,260px)',
          fontWeight: 600,
          color: C.accent,
          opacity: 0.07,
          lineHeight: 1,
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      >
        {index + 1}
      </span>

      <Reveal y={50} style={imgWrap}>
        <ParallaxImg src={img(row.imgId, 800)} alt={row.alt} />
      </Reveal>

      <div style={txt}>
        <Reveal>
          <Eyebrow>{row.eyebrow}</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h3
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(30px,4vw,56px)',
              fontWeight: 400,
              color: C.ink,
              margin: 'clamp(16px,2vw,26px) 0 clamp(18px,2vw,28px)',
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
              fontSize: 'clamp(15px,1.6vw,18px)',
              lineHeight: 1.82,
              color: C.textMuted,
              maxWidth: 460,
              margin: 0,
            }}
          >
            {row.body}
          </p>
        </Reveal>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .gv-editrow { grid-template-columns: 1fr !important; }
          .gv-editrow > * { order: initial !important; }
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
    <section style={sec} id="cabinet">
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(80px,11vw,150px)',
        }}
      >
        {EDIT_ROWS.map((r, i) => (
          <EditorialRow key={r.eyebrow} row={r} index={i} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   7 · VALUES PANEL — sticky image + valeurs qui défilent
   ════════════════════════════════════════════════════════════════════════════ */
function ValuesPanel() {
  const sec: React.CSSProperties = {
    background: C.bgDark,
    padding: 'clamp(96px,13vw,180px) clamp(24px,6vw,96px)',
  };

  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1.1fr',
    gap: 'clamp(48px,6vw,100px)',
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
    <section style={sec}>
      <div style={grid} className="gv-valpanel">
        {/* Image collante */}
        <div style={stickyImg} className="gv-valpanel-sticky">
          <div
            style={{
              overflow: 'hidden',
              border: `1px solid rgba(140,108,44,0.28)`,
              aspectRatio: '3 / 4',
            }}
          >
            <img
              src={img('1551135049-8a33b5883817', 900)}
              alt="Maître Voss — Tribunal de Commerce de Toulouse"
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
          <div style={{ marginTop: 24 }}>
            <Eyebrow color={C.accent} dark>
              Nos engagements
            </Eyebrow>
            <p
              style={{
                fontFamily: SERIF,
                fontStyle: 'italic',
                fontSize: 15,
                color: 'rgba(255,255,255,0.58)',
                marginTop: 14,
                lineHeight: 1.7,
              }}
            >
              Quatre principes non négociables qui guident chaque dossier.
            </p>
          </div>
        </div>

        {/* Valeurs qui défilent */}
        <div>
          <Reveal>
            <Eyebrow color={C.accent} dark>
              Ce qui nous distingue
            </Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2
              style={{
                fontFamily: SERIF,
                fontStyle: 'italic',
                fontSize: 'clamp(32px,4.5vw,58px)',
                fontWeight: 400,
                color: C.white,
                margin: 'clamp(18px,2vw,28px) 0 clamp(40px,5vw,64px)',
                lineHeight: 1.1,
              }}
            >
              L&apos;excellence au service de vos intérêts
            </h2>
          </Reveal>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {VALUES.map((v, i) => (
              <Reveal key={v.index} delay={0.06 * i}>
                <div
                  style={{
                    padding: 'clamp(28px,3.5vw,44px) 0',
                    borderTop: `1px solid rgba(140,108,44,0.28)`,
                    display: 'flex',
                    gap: 'clamp(24px,3vw,40px)',
                    alignItems: 'baseline',
                  }}
                >
                  <span
                    style={{
                      fontFamily: SERIF,
                      fontStyle: 'italic',
                      fontSize: 'clamp(22px,2.4vw,32px)',
                      color: C.accent,
                      minWidth: 40,
                      flexShrink: 0,
                    }}
                  >
                    {v.index}
                  </span>
                  <div>
                    <h4
                      style={{
                        fontFamily: SERIF,
                        fontSize: 'clamp(20px,2vw,26px)',
                        fontWeight: 400,
                        color: C.white,
                        margin: '0 0 10px',
                      }}
                    >
                      {v.title}
                    </h4>
                    <p
                      style={{
                        fontFamily: SANS,
                        fontWeight: 300,
                        fontSize: 15,
                        lineHeight: 1.72,
                        color: 'rgba(255,255,255,0.62)',
                        margin: 0,
                      }}
                    >
                      {v.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
            {/* Séparateur bas */}
            <div style={{ borderTop: `1px solid rgba(140,108,44,0.28)`, paddingTop: 0 }} />
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .gv-valpanel { grid-template-columns: 1fr !important; }
          .gv-valpanel-sticky { position: static !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   8 · TESTIMONIALS
   ════════════════════════════════════════════════════════════════════════════ */
function TestimonialCard({
  t,
  i,
}: {
  t: Testimonial;
  i: number;
}) {
  const card: React.CSSProperties = {
    background: C.bgCard,
    border: `1px solid ${C.border}`,
    padding: 'clamp(32px,4vw,52px)',
    boxShadow: '0 20px 50px -36px rgba(16,14,8,0.22)',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    boxSizing: 'border-box',
  };

  return (
    <Reveal delay={i * 0.12} style={{ height: '100%' }}>
      <figure style={card}>
        <Shield
          size={30}
          color={C.accent}
          strokeWidth={1.3}
          style={{ flexShrink: 0 }}
        />
        <div style={{ display: 'flex', gap: 3, margin: '18px 0 16px' }}>
          {Array.from({ length: 5 }).map((_, s) => (
            <Star key={s} size={13} fill={C.accent} color={C.accent} strokeWidth={0} />
          ))}
        </div>
        <blockquote
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 'clamp(17px,1.8vw,21px)',
            lineHeight: 1.66,
            color: C.ink,
            margin: '0 0 clamp(24px,3vw,36px)',
            flex: 1,
          }}
        >
          &ldquo;{t.quote}&rdquo;
        </blockquote>
        <figcaption style={{ borderTop: `1px solid ${C.border}`, paddingTop: 20 }}>
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 18,
              color: C.ink2,
              fontWeight: 400,
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
  );
}

function Testimonials() {
  const sec: React.CSSProperties = {
    background: C.bgAlt,
    padding: 'clamp(96px,13vw,180px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: 'clamp(24px,3.5vw,48px)',
    maxWidth: 1180,
    margin: '0 auto',
  };

  return (
    <section style={sec}>
      <div style={{ maxWidth: 1180, margin: '0 auto clamp(56px,6vw,80px)', textAlign: 'center' }}>
        <Reveal>
          <Eyebrow color={C.accent} align="center">
            Témoignages clients
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: 'clamp(32px,4.8vw,62px)',
              fontWeight: 400,
              color: C.ink,
              margin: 'clamp(18px,2vw,26px) 0 0',
              lineHeight: 1.08,
            }}
          >
            Ils nous ont confié leur dossier
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
   9 · CONTACT FORM
   ════════════════════════════════════════════════════════════════════════════ */
function ContactForm() {
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [domaine, setDomaine] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prenom || !nom || !email || !domaine) return;
    setSent(true);
  };

  const sec: React.CSSProperties = {
    background: C.bgDark,
    padding: 'clamp(96px,13vw,180px) clamp(24px,6vw,96px)',
  };

  const fieldBase: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    background: 'transparent',
    border: 'none',
    borderBottom: `1px solid rgba(140,108,44,0.35)`,
    padding: '14px 2px',
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
    marginBottom: 6,
    fontWeight: 500,
  };

  const domaines = [
    'Droit des sociétés',
    'Contentieux commercial',
    'Droit du travail',
    'Droit immobilier',
    'Recouvrement',
    'Autre',
  ];

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
          <Eyebrow color={C.accent} align="center" dark>
            Premier rendez-vous
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
              margin: 'clamp(18px,2vw,26px) 0 clamp(14px,1.8vw,22px)',
              lineHeight: 1.06,
            }}
          >
            Parlons de votre dossier
          </h2>
        </Reveal>
        <Reveal delay={0.14}>
          <p
            style={{
              fontFamily: SANS,
              fontWeight: 300,
              fontSize: 'clamp(14px,1.5vw,17px)',
              lineHeight: 1.72,
              color: 'rgba(255,255,255,0.68)',
              maxWidth: 500,
              margin: '0 auto clamp(48px,6vw,72px)',
            }}
          >
            Exposez-nous votre situation. Maître Voss vous répond personnellement dans les 24 heures.
          </p>
        </Reveal>

        {sent ? (
          <Reveal>
            <div
              style={{
                border: `1px solid ${C.accent}`,
                padding: 'clamp(40px,5vw,64px)',
                background: 'rgba(140,108,44,0.06)',
              }}
            >
              <Shield size={36} color={C.accent} strokeWidth={1.2} />
              <h3
                style={{
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  fontSize: 'clamp(24px,3vw,36px)',
                  fontWeight: 400,
                  color: C.white,
                  margin: 'clamp(18px,2vw,26px) 0 14px',
                }}
              >
                Merci {prenom},
              </h3>
              <p
                style={{
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  fontSize: 17,
                  color: 'rgba(255,255,255,0.72)',
                  margin: 0,
                  lineHeight: 1.7,
                }}
              >
                Maître Voss vous contacte dans les 24h à l&apos;adresse{' '}
                <strong style={{ color: C.accentLight, fontStyle: 'normal' }}>
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
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 36,
                textAlign: 'left',
              }}
            >
              {/* Prénom + Nom */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 28,
                }}
                className="gv-namegrid"
              >
                <div>
                  <label style={labelStyle} htmlFor="gv-prenom">
                    Prénom
                  </label>
                  <input
                    id="gv-prenom"
                    style={fieldBase}
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    placeholder="Marie"
                    autoComplete="given-name"
                    required
                  />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="gv-nom">
                    Nom
                  </label>
                  <input
                    id="gv-nom"
                    style={fieldBase}
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    placeholder="Dupont"
                    autoComplete="family-name"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label style={labelStyle} htmlFor="gv-email">
                  Email
                </label>
                <input
                  id="gv-email"
                  type="email"
                  style={fieldBase}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="marie@entreprise.fr"
                  autoComplete="email"
                  required
                />
              </div>

              {/* Téléphone */}
              <div>
                <label style={labelStyle} htmlFor="gv-tel">
                  Téléphone
                </label>
                <input
                  id="gv-tel"
                  type="tel"
                  style={fieldBase}
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  placeholder="+33 6 00 00 00 00"
                  autoComplete="tel"
                />
              </div>

              {/* Domaine */}
              <div>
                <label style={labelStyle} htmlFor="gv-domaine">
                  Domaine juridique
                </label>
                <select
                  id="gv-domaine"
                  style={{
                    ...fieldBase,
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    cursor: 'pointer',
                    color: domaine ? C.white : 'rgba(255,255,255,0.38)',
                  }}
                  value={domaine}
                  onChange={(e) => setDomaine(e.target.value)}
                  required
                >
                  <option value="" style={{ color: '#000' }}>
                    Choisir un domaine…
                  </option>
                  {domaines.map((d) => (
                    <option key={d} value={d} style={{ color: '#000' }}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div>
                <label style={labelStyle} htmlFor="gv-message">
                  Votre situation (en quelques mots)
                </label>
                <textarea
                  id="gv-message"
                  rows={4}
                  style={{
                    ...fieldBase,
                    resize: 'vertical',
                    borderBottom: 'none',
                    border: `1px solid rgba(140,108,44,0.35)`,
                    padding: '14px 12px',
                  }}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Décrivez brièvement votre situation ou la nature du litige…"
                />
              </div>

              <div style={{ textAlign: 'center', marginTop: 8 }}>
                <GoldButton filled dark type="submit">
                  Envoyer ma demande
                </GoldButton>
              </div>
            </form>
          </Reveal>
        )}
      </div>

      <style>{`
        @media (max-width: 860px) {
          .gv-namegrid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   10 · FOOTER
   ════════════════════════════════════════════════════════════════════════════ */
function Footer() {
  const foot: React.CSSProperties = {
    background: C.bgDarkAlt,
    borderTop: `1px solid rgba(140,108,44,0.18)`,
    padding: 'clamp(70px,9vw,110px) clamp(24px,6vw,96px) 40px',
  };

  const cols: { title: string; items: { label: string; href: string }[] }[] = [
    {
      title: 'Domaines',
      items: [
        { label: 'Droit des sociétés', href: '#services' },
        { label: 'Contentieux commercial', href: '#services' },
        { label: 'Droit du travail', href: '#services' },
        { label: 'Recouvrement', href: '#services' },
        { label: 'Droit immobilier', href: '#services' },
      ],
    },
    {
      title: 'Cabinet',
      items: [
        { label: 'Notre approche', href: '#cabinet' },
        { label: 'Maître Voss', href: '#cabinet' },
        { label: 'Nos engagements', href: '#pratiques' },
        { label: 'Témoignages', href: '#services' },
      ],
    },
    {
      title: 'Contact & Mentions légales',
      items: [
        { label: 'Prendre rendez-vous', href: '#contact' },
        { label: 'Cabinet Toulouse', href: '#contact' },
        { label: 'Mentions légales', href: '#contact' },
        { label: 'Politique de confidentialité', href: '#contact' },
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
          gap: 'clamp(36px,5vw,70px)',
        }}
        className="gv-footgrid"
      >
        {/* Brand */}
        <div>
          <div
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: 26,
              color: C.accentLight,
              marginBottom: 20,
            }}
          >{fd?.businessName ?? "Maître Voss"}</div>
          <p
            style={{
              fontFamily: SANS,
              fontWeight: 300,
              fontSize: 14,
              lineHeight: 1.72,
              color: 'rgba(255,255,255,0.50)',
              maxWidth: 310,
              margin: '0 0 24px',
            }}
          >
            Avocate en Droit des Affaires & Contentieux Commercial. Barreau de Toulouse depuis 2008.
          </p>
          <div
            style={{
              fontFamily: SANS,
              fontSize: 12,
              letterSpacing: '0.14em',
              color: 'rgba(255,255,255,0.38)',
            }}
          >
            Toulouse · Place Wilson
          </div>
        </div>

        {/* Colonnes nav */}
        {cols.map((c) => (
          <div key={c.title}>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 10,
                letterSpacing: '0.32em',
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
                gap: 14,
              }}
            >
              {c.items.map((it) => (
                <li key={it.label}>
                  <a
                    href={it.href}
                    style={{
                      fontFamily: SERIF,
                      fontSize: 15.5,
                      color: 'rgba(255,255,255,0.62)',
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

      {/* Bas de page */}
      <div
        style={{
          maxWidth: 1240,
          margin: '60px auto 0',
          paddingTop: 26,
          borderTop: `1px solid rgba(140,108,44,0.14)`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 14,
          fontFamily: SANS,
          fontSize: 11,
          letterSpacing: '0.10em',
          color: 'rgba(255,255,255,0.35)',
        }}
      >
        <span>
          © 2008–2026 Maître Géraldine Voss — Avocate au Barreau de Toulouse. Tous droits réservés.
        </span>
        <span style={{ display: 'flex', gap: 22 }}>
          <a href="#contact" style={{ color: 'inherit', textDecoration: 'none' }}>
            Mentions légales
          </a>
          <a href="#contact" style={{ color: 'inherit', textDecoration: 'none' }}>
            RGPD
          </a>
        </span>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .gv-footgrid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 540px) {
          .gv-footgrid { grid-template-columns: 1fr !important; }
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

  const root: React.CSSProperties = {
    background: C.bgDark,
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
    <>
      <style>{`
        @import url('${FONTS_HREF}');

        *, *::before, *::after { box-sizing: border-box; }

        /* Underline-field focus accent */
        input:focus, textarea:focus, select:focus {
          border-color: rgba(140,108,44,0.75) !important;
        }

        /* Placeholder couleur uniforme */
        ::placeholder { color: rgba(255,255,255,0.30); font-family: ${SERIF}; font-style: italic; }

        /* Option color fix for dark forms */
        select option { background: #1c1a14; color: #f7f5f0; }

        /* Smooth scroll */
        html { scroll-behavior: smooth; }

        @media (max-width: 860px) {
          .gv-navlinks { display: none !important; }
          .gv-navcta { display: none !important; }
          .gv-editrow { grid-template-columns: 1fr !important; }
          .gv-editrow > * { order: initial !important; }
          .gv-valpanel { grid-template-columns: 1fr !important; }
          .gv-valpanel-sticky { position: static !important; }
          .gv-footgrid { grid-template-columns: 1fr 1fr !important; }
          .gv-namegrid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 540px) {
          .gv-footgrid { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <main style={root} suppressHydrationWarning>
        <Nav />
        <Hero />
        <Intro />
        <PracticeSequence />
        <ServiceCards />
        <EditorialRows />
        <ValuesPanel />
        <Testimonials />
        <ContactForm />
        <Footer />
      </main>
    </>
  );
}
