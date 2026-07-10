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
import { ArrowRight, Briefcase, ChevronDown, Star } from 'lucide-react';

/* ════════════════════════════════════════════════════════════════════════════
   CABINET VAILLANT & ASSOCIÉS — Expert-Comptable & Commissariat aux Comptes
   Paris 8e · Photographie réelle + chorégraphie éditoriale au défilement.
   Auto-suffisant. 'use client'.
   ════════════════════════════════════════════════════════════════════════════ */

/* ── Google Fonts ─────────────────────────────────────────────────────────── */
const FONTS_URL =
  'https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap';

/* ── Palette ─────────────────────────────────────────────────────────────── */
// Lightens (positive percent) or darkens (negative) a #rrggbb hex color —
// used to derive light/dark shades from the client's brand color.
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
  bg: '#f8f7f4',
  bgAlt: '#eeece6',
  bgDark: '#0f0e0b',
  bgDarkAlt: '#080706',
  bgCard: '#ffffff',
  accent: '#2c4a8c',
  accentDark: '#1e3570',
  accentLight: '#d4ddf0',
  white: '#ffffff',
  ink: '#0f0e0b',
  textMuted: '#3a3828',
  textFaint: '#8a8870',
  border: '#dcdacc',
  borderDark: 'rgba(44,74,140,0.2)',
  gold: '#b8960c',
};

const SERIF = "'EB Garamond', Georgia, serif" as const;
const SANS = "'IBM Plex Sans', system-ui, sans-serif" as const;

/* ── Easing partagé ──────────────────────────────────────────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ── Photo helper ────────────────────────────────────────────────────────── */
const photo = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?q=80&w=${w}&auto=format&fit=crop`;

/* ── Typed data interfaces ────────────────────────────────────────────────── */
interface Domain {
  img: string;
  index: string;
  title: string;
  sub: string;
}

interface Service {
  title: string;
  desc: string;
}

interface EditRow {
  eyebrow: string;
  img: string;
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

interface ExpertiseItem {
  num: string;
  title: string;
  body: string;
}

/* ── Data ────────────────────────────────────────────────────────────────── */
const DOMAINS: Domain[] = [
  {
    img: photo('1554224155-6726b3ff858f'),
    index: 'I',
    title: 'COMPTABILITÉ & FISCAL',
    sub: "Tenue comptable, liasses fiscales, optimisation de l'IS — vos obligations transformées en leviers de performance.",
  },
  {
    img: photo('1507679799987-c73779587ccf'),
    index: 'II',
    title: 'AUDIT & CAC',
    sub: 'Commissariat aux comptes, due diligence, audit interne — la certification qui rassure vos partenaires et investisseurs.',
  },
  {
    img: photo('1551135049-8a33b5883817'),
    index: 'III',
    title: 'STRATÉGIE & CROISSANCE',
    sub: "Prévisionnel, levée de fonds, transmission d'entreprise — vos projets structurés pour convaincre.",
  },
];

const SERVICES: Service[] = [
  {
    title: 'Tenue comptable',
    desc: 'Saisie, lettrage, rapprochements bancaires et révision mensuelle. Vos comptes toujours à jour.',
  },
  {
    title: 'Optimisation fiscale',
    desc: 'IS, TVA, CVAE — nous anticipons chaque échéance pour maximiser vos économies légales.',
  },
  {
    title: 'Paie & RH',
    desc: 'Bulletins de salaire, déclarations sociales, DPAE — une gestion sans faille de vos obligations sociales.',
  },
  {
    title: 'Commissariat aux comptes',
    desc: 'Certification légale ou contractuelle, due diligence acquisition et audit de consolidation.',
  },
  {
    title: "Création d'entreprise",
    desc: "Choix du statut, pacte d'associés, prévisionnel de lancement et accompagnement des premières années.",
  },
  {
    title: 'Transmission & cession',
    desc: "Valorisation, structuration de la cession, accompagnement vendeur et acheteur jusqu'à la signature.",
  },
];

const EDIT_ROWS: EditRow[] = [
  {
    eyebrow: 'Notre engagement',
    img: photo('1554224155-6726b3ff858f', 800),
    alt: 'Cabinet Vaillant — bureau expert-comptable Paris',
    title: (
      <>
        Au-delà{' '}
        <span style={{ fontStyle: 'italic' }}>des chiffres.</span>
      </>
    ),
    body: "Nous ne nous limitons pas à la conformité. Chaque dossier bénéficie d'un accompagnement conseil actif : tableaux de bord financiers mensuels, alertes proactives sur vos seuils critiques, et un associé référent joignable à tout moment.",
    reverse: false,
  },
  {
    eyebrow: 'Le cabinet',
    img: photo('1507679799987-c73779587ccf', 800),
    alt: 'Équipe Vaillant & Associés — Paris 8e',
    title: (
      <>
        Paris 8e,{' '}
        <span style={{ fontStyle: 'italic' }}>35 ans d'expertise.</span>
      </>
    ),
    body: "Fondé en 1990, le cabinet compte aujourd'hui 12 associés et accompagne 280 clients, des TPE aux ETI. Membres de l'Ordre des Experts-Comptables, nous combinons la profondeur d'une structure établie et la réactivité d'une équipe à taille humaine.",
    reverse: true,
  },
];

const EXPERTISE: ExpertiseItem[] = [
  {
    num: '01',
    title: 'Secteurs spécialisés',
    body: 'Retail, tech, immobilier, professions libérales — des équipes dédiées qui connaissent vos enjeux sectoriels.',
  },
  {
    num: '02',
    title: 'Logiciels & interfaces',
    body: 'Sage, Cegid, Pennylane — interfaces client en temps réel, tableaux de bord partagés, zéro ressaisie.',
  },
  {
    num: '03',
    title: 'Interlocuteur unique',
    body: 'Un associé dédié par dossier. Pas de rotation, pas de perte de contexte. Votre expert vous connaît.',
  },
  {
    num: '04',
    title: 'Réactivité garantie',
    body: "Réponse sous 24h, disponibilité permanente. Vous n'attendez pas — ni en période fiscale, ni à la levée.",
  },
];

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'Nous avons confié notre comptabilité à Vaillant lors de notre Série A. En six mois, ils ont restructuré nos process, formé notre CFO et nous ont servi de co-pilote financier tout au long de la levée. Un partenaire stratégique, pas un prestataire.',
    name: 'Camille Renaud',
    role: 'CFO · SaaS B2B, Paris',
  },
  {
    quote:
      "L'optimisation fiscale réalisée sur nos holdings nous a permis d'économiser 40 000 € sur l'exercice. En trois ans, l'investissement est remboursé dix fois. L'équipe connaît notre secteur restauration mieux que nous.",
    name: 'Thierry Marchetti',
    role: 'Dirigeant · Groupe restauration, 8 établissements',
  },
];

/* ════════════════════════════════════════════════════════════════════════════
   Primitives partagées
   ════════════════════════════════════════════════════════════════════════════ */

/** Filet + libellé en capitales espacées. */
function Eyebrow({
  children,
  color = C.accent,
  align = 'left',
}: {
  children: React.ReactNode;
  color?: string;
  align?: 'left' | 'center';
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        justifyContent: align === 'center' ? 'center' : 'flex-start',
      }}
    >
      <span style={{ width: 40, height: 1, background: color, opacity: 0.7, flexShrink: 0 }} />
      <span
        style={{
          fontFamily: SANS,
          fontSize: 11,
          letterSpacing: '0.36em',
          textTransform: 'uppercase',
          color,
          fontWeight: 500,
        }}
      >
        {children}
      </span>
      {align === 'center' && (
        <span style={{ width: 40, height: 1, background: color, opacity: 0.7, flexShrink: 0 }} />
      )}
    </div>
  );
}

/** Révélation fondu + translation verticale, une seule fois. */
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

/** Bouton navy, flèche glissante au survol. */
function NavyButton({
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
  return (
    <button
      type={type}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 11,
        padding: '14px 28px',
        fontFamily: SANS,
        fontSize: 12,
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        fontWeight: 500,
        cursor: 'pointer',
        border: `1px solid ${C.accent}`,
        background: filled ? (hover ? C.accentDark : C.accent) : hover ? 'rgba(44,74,140,0.07)' : 'transparent',
        color: filled ? C.white : C.accent,
        transition: 'all .45s cubic-bezier(.16,1,.3,1)',
        transform: hover ? 'translateY(-2px)' : 'none',
      }}
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
   1 · NAV
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
    { label: 'Expertises', href: '#expertises' },
    { label: 'Services', href: '#services' },
    { label: 'Le cabinet', href: '#cabinet' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <>
      <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: solid ? '14px clamp(20px,5vw,64px)' : '24px clamp(20px,5vw,64px)',
        background: solid ? 'rgba(15,14,11,0.95)' : 'transparent',
        backdropFilter: solid ? 'blur(16px) saturate(130%)' : 'none',
        WebkitBackdropFilter: solid ? 'blur(16px) saturate(130%)' : 'none',
        borderBottom: solid ? '1px solid rgba(44,74,140,0.25)' : '1px solid transparent',
        transition: 'all .55s cubic-bezier(.16,1,.3,1)',
      }}
    >
      {/* Brand */}
      <div
        style={{
          fontFamily: SERIF,
          fontSize: 'clamp(17px,1.4vw,21px)',
          color: C.white,
          fontWeight: 400,
          letterSpacing: '0.04em',
          userSelect: 'none',
        }}
      >
        {fd?.logoBase64 ? (
          // Client logo (uploaded in the brief) replaces the placeholder mark —
          // essential for the client to recognise their brand in the render.
          <img
            src={fd.logoBase64}
            alt={fd?.businessName ?? 'logo'}
            style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
          />
        ) : (
          <>Vaillant &amp; Associés</>
        )}
      </div>

      {/* Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(18px,2.4vw,38px)' }} className="va-navlinks">
        {links.map((l) => (
          <NavLink key={l.label} label={l.label} href={l.href} />
        ))}
      </div>

      {/* CTA */}
      <a href="#contact" style={{ textDecoration: 'none' }} className="va-navlinks">
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 9,
            padding: '11px 22px',
            fontFamily: SANS,
            fontSize: 12,
            letterSpacing: '0.20em',
            textTransform: 'uppercase',
            fontWeight: 500,
            background: C.accent,
            color: C.white,
            border: `1px solid ${C.accent}`,
            cursor: 'pointer',
            transition: 'background .4s',
          }}
        >
          Nous contacter
        </span>
      </a>

      
        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="va-burger"
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
          .va-navlinks { display: none !important; }
          .va-burger { display: flex !important; flex-direction: column; }
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
        transition: 'color .38s',
        position: 'relative',
        paddingBottom: 3,
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
          background: C.accentLight,
          transition: 'width .45s cubic-bezier(.16,1,.3,1)',
        }}
      />
    </a>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   2 · HERO — 100vh parallaxe
   ════════════════════════════════════════════════════════════════════════════ */
function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '14%']);
  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '-44%']);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);

  return (
    <section
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
          src={photo('1554224155-6726b3ff858f', 2000)}
          alt="Bureau du cabinet Vaillant & Associés, Paris 8e"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </motion.div>

      {/* Voile sombre principal */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(15,14,11,0.52) 0%, rgba(15,14,11,0.14) 40%, rgba(15,14,11,0.48) 70%, rgba(15,14,11,0.90) 100%)',
        }}
      />
      {/* Voile latéral navy */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(110% 80% at 20% 60%, rgba(44,74,140,0.30) 0%, transparent 65%)',
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
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          padding: 'clamp(80px,10vw,130px) clamp(24px,6vw,96px)',
          y: titleY,
          opacity: titleOpacity,
        }}
      >
        <Reveal y={16}>
          <Eyebrow color="rgba(212,221,240,0.90)">
            Expert-Comptable &amp; Commissaire aux Comptes · Paris 8e
          </Eyebrow>
        </Reveal>

        <motion.h1
          initial={{ opacity: 0, y: 44 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.35, ease: EASE, delay: 0.12 }}
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontWeight: 400,
            color: C.white,
            fontSize: 'clamp(3rem,6.5vw,7.5rem)',
            lineHeight: 1.0,
            letterSpacing: '-0.01em',
            margin: 'clamp(20px,2.5vw,36px) 0 clamp(18px,2vw,28px)',
            textShadow: '0 10px 50px rgba(0,0,0,0.50)',
            maxWidth: '14ch',
          }}
        >
          L&apos;expertise
          <br />
          au service
          <br />
          de votre ambition.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.42 }}
          style={{
            fontFamily: SANS,
            fontWeight: 300,
            fontSize: 'clamp(15px,1.5vw,18px)',
            color: 'rgba(255,255,255,0.80)',
            maxWidth: 500,
            lineHeight: 1.7,
            marginBottom: 'clamp(28px,3vw,44px)',
          }}
        >
          Cabinet indépendant, 35 ans d&apos;ancrage parisien. Nous transformons vos obligations comptables et fiscales en avantages concurrentiels mesurables.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.68 }}
          style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}
        >
          <NavyButton filled>Prendre rendez-vous</NavyButton>
          <NavyButton>Nos expertises</NavyButton>
        </motion.div>
      </motion.div>

      {/* Indicateur de défilement */}
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
            letterSpacing: '0.34em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.6)',
          }}
        >
          Découvrir
        </span>
        <motion.div
          animate={{ y: [0, 9, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={19} color="rgba(255,255,255,0.7)" strokeWidth={1.4} />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   3 · INTRO — citation centrée, fond crème
   ════════════════════════════════════════════════════════════════════════════ */
function Intro() {
  return (
    <section
      style={{
        background: C.bgAlt,
        padding: 'clamp(90px,13vw,180px) clamp(24px,8vw,140px)',
        textAlign: 'center',
      }}
    >
      <Reveal>
        <Eyebrow color={C.textFaint} align="center">
          Notre philosophie
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
            color: C.ink,
            maxWidth: 960,
            margin: 'clamp(24px,3vw,40px) auto 0',
          }}
        >
          "La comptabilité n&apos;est pas une contrainte. C&apos;est la carte de votre entreprise."
        </p>
      </Reveal>
      <Reveal delay={0.2}>
        <div
          style={{
            width: 1,
            height: 80,
            background: `linear-gradient(${C.accent}, transparent)`,
            margin: 'clamp(44px,5vw,68px) auto 0',
            opacity: 0.45,
          }}
        />
      </Reveal>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   4 · DOMAIN SEQUENCE — crossfade sticky 320vh
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
      }}
    >
      <span
        style={{
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontSize: 'clamp(36px,8vw,108px)',
          color: 'rgba(44,74,140,0.28)',
          lineHeight: 1,
          marginBottom: 4,
        }}
      >
        {domain.index}
      </span>
      <h2
        style={{
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: 'clamp(20px,3.6vw,44px)',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: C.white,
          lineHeight: 1.1,
          margin: 0,
          textShadow: '0 6px 32px rgba(0,0,0,0.60)',
        }}
      >
        {domain.title}
      </h2>
      <p
        style={{
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontSize: 'clamp(15px,1.7vw,20px)',
          color: 'rgba(255,255,255,0.84)',
          marginTop: 18,
          maxWidth: 520,
          lineHeight: 1.65,
        }}
      >
        {domain.sub}
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
      id="expertises"
      style={{ height: '100vh', overflow: 'hidden', position: 'relative', background: C.bgDark }}
    >
      <div
        style={{
          position: 'relative',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {/* Images en fondu enchaîné */}
        {DOMAINS.map((d, i) => (
          <DomainImage
            key={d.index}
            domain={d}
            i={i}
            total={DOMAINS.length}
            progress={progress}
          />
        ))}

        {/* Voile sombre pour la lisibilité */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to bottom, rgba(15,14,11,0.38), rgba(15,14,11,0.14) 44%, rgba(15,14,11,0.60))',
          }}
        />

        {/* Textes */}
        {DOMAINS.map((d, i) => (
          <DomainCaption
            key={d.index}
            domain={d}
            i={i}
            total={DOMAINS.length}
            progress={progress}
          />
        ))}

        {/* Libellé section — top right */}
        <div
          style={{
            position: 'absolute',
            top: 'clamp(90px,10vw,120px)',
            right: 'clamp(24px,4vw,56px)',
            fontFamily: SANS,
            fontSize: 10,
            letterSpacing: '0.34em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.50)',
          }}
        >
          Domaines d&apos;expertise
        </div>

        {/* Points de progression navy */}
        <div
          style={{
            position: 'absolute',
            bottom: 44,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 10,
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
   5 · SERVICE CARDS — 6 cartes blanches, bordure navy gauche
   ════════════════════════════════════════════════════════════════════════════ */
function ServiceCard({ svc, i }: { svc: Service; i: number }) {
  const [hover, setHover] = useState(false);
  return (
    <Reveal delay={i * 0.08} style={{ height: '100%' }}>
      <article
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          background: C.bgCard,
          borderLeft: `3px solid ${hover ? C.accentDark : C.accent}`,
          padding: 'clamp(28px,3.2vw,42px)',
          boxShadow: hover
            ? '0 28px 64px -28px rgba(44,74,140,0.22)'
            : '0 8px 32px -24px rgba(15,14,11,0.12)',
          transform: hover ? 'translateY(-8px)' : 'none',
          transition: 'all .5s cubic-bezier(.16,1,.3,1)',
          cursor: 'pointer',
          height: '100%',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <h3
          style={{
            fontFamily: SERIF,
            fontSize: 'clamp(20px,1.8vw,26px)',
            fontWeight: 400,
            color: C.ink,
            margin: '0 0 14px',
            lineHeight: 1.2,
          }}
        >
          {svc.title}
        </h3>
        <p
          style={{
            fontFamily: SANS,
            fontWeight: 300,
            fontSize: 'clamp(13.5px,1.1vw,15px)',
            lineHeight: 1.72,
            color: C.textMuted,
            margin: '0 0 24px',
            flex: 1,
          }}
        >
          {svc.desc}
        </p>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            fontFamily: SANS,
            fontSize: 11,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: hover ? C.accentDark : C.accent,
            fontWeight: 500,
            transition: 'color .4s',
          }}
        >
          En savoir plus
          <ArrowRight
            size={13}
            style={{
              transform: hover ? 'translateX(4px)' : 'none',
              transition: 'transform .45s cubic-bezier(.16,1,.3,1)',
            }}
          />
        </span>
      </article>
    </Reveal>
  );
}

function ServiceCards() {
  return (
    <section
      id="services"
      style={{
        background: C.bg,
        padding: 'clamp(90px,12vw,170px) clamp(24px,6vw,96px)',
      }}
    >
      <div style={{ maxWidth: 1240, margin: '0 auto 56px' }}>
        <Reveal>
          <Eyebrow>Nos services</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(34px,5.2vw,70px)',
              fontWeight: 400,
              color: C.ink,
              margin: 'clamp(16px,2vw,26px) 0 0',
              lineHeight: 1.06,
            }}
          >
            Un accompagnement{' '}
            <span style={{ fontStyle: 'italic', color: C.accent }}>complet</span>
          </h2>
        </Reveal>
      </div>
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'clamp(20px,2.4vw,36px)',
        }}
      >
        {SERVICES.map((s, i) => (
          <ServiceCard key={s.title} svc={s} i={i} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   6 · EDITORIAL ROWS — 2 rangées alternées avec numéros en or fantôme
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

function EditRowItem({ row, romanNum }: { row: EditRow; romanNum: string }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'clamp(36px,6vw,88px)',
        alignItems: 'center',
        position: 'relative',
      }}
      className="va-editrow"
    >
      {/* Numéro romain fantôme en or */}
      <span
        style={{
          position: 'absolute',
          top: '-0.10em',
          left: row.reverse ? 'auto' : '-0.06em',
          right: row.reverse ? '-0.06em' : 'auto',
          fontFamily: SERIF,
          fontSize: 'clamp(100px,16vw,220px)',
          fontStyle: 'italic',
          color: C.gold,
          opacity: 0.12,
          lineHeight: 1,
          pointerEvents: 'none',
          userSelect: 'none',
          zIndex: 0,
        }}
      >
        {romanNum}
      </span>

      {/* Image */}
      <Reveal
        y={46}
        style={{
          overflow: 'hidden',
          order: row.reverse ? 2 : 1,
          aspectRatio: '5 / 6',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <ParallaxImg src={row.img} alt={row.alt} />
      </Reveal>

      {/* Texte */}
      <div style={{ order: row.reverse ? 1 : 2, position: 'relative', zIndex: 1 }}>
        <Reveal>
          <Eyebrow color={C.textFaint}>{row.eyebrow}</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h3
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(28px,3.8vw,56px)',
              fontWeight: 400,
              color: C.ink,
              margin: 'clamp(16px,2vw,26px) 0 clamp(16px,2vw,26px)',
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
              fontWeight: 300,
              fontSize: 'clamp(14px,1.3vw,17px)',
              lineHeight: 1.82,
              color: C.textMuted,
              maxWidth: 460,
            }}
          >
            {row.body}
          </p>
        </Reveal>
      </div>
    </div>
  );
}

function EditorialRows() {
  const romans = ['I', 'II'];
  return (
    <section
      id="cabinet"
      style={{
        background: C.bg,
        padding: 'clamp(80px,11vw,150px) clamp(24px,6vw,96px)',
      }}
    >
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(80px,12vw,160px)',
        }}
      >
        {EDIT_ROWS.map((r, i) => (
          <EditRowItem key={r.eyebrow} row={r} romanNum={romans[i]} />
        ))}
      </div>
      <style>{`
        @media (max-width: 860px) {
          .va-editrow { grid-template-columns: 1fr !important; }
          .va-editrow > * { order: initial !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   7 · EXPERTISE PANEL — image sticky gauche, 4 items défilent à droite
   ════════════════════════════════════════════════════════════════════════════ */
function ExpertisePanel() {
  return (
    <section
      style={{
        background: C.bgDark,
        padding: 'clamp(80px,11vw,150px) clamp(24px,6vw,96px)',
      }}
    >
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1.1fr',
          gap: 'clamp(40px,6vw,100px)',
          alignItems: 'start',
        }}
        className="va-exppanel"
      >
        {/* Image collante */}
        <div
          style={{ position: 'sticky', top: 100, alignSelf: 'start' }}
          className="va-exppanel-sticky"
        >
          <Reveal y={40}>
            <div
              style={{
                overflow: 'hidden',
                border: `1px solid ${C.borderDark}`,
                aspectRatio: '4 / 5',
              }}
            >
              <img
                src={photo('1551135049-8a33b5883817', 900)}
                alt="Expertise cabinet Vaillant & Associés"
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div
              style={{
                marginTop: 24,
                fontFamily: SERIF,
                fontStyle: 'italic',
                fontSize: 17,
                color: 'rgba(255,255,255,0.68)',
                lineHeight: 1.6,
              }}
            >
              "Le conseil qui fait la différence se construit dans la durée."
            </div>
          </Reveal>
        </div>

        {/* Piliers défilants */}
        <div>
          <Reveal>
            <Eyebrow color={C.accentLight}>Ce qui nous distingue</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(32px,4.4vw,62px)',
                fontWeight: 400,
                color: C.white,
                margin: 'clamp(16px,2vw,26px) 0 clamp(40px,5vw,60px)',
                lineHeight: 1.06,
              }}
            >
              Quatre piliers,{' '}
              <span style={{ fontStyle: 'italic', color: C.accentLight }}>une promesse</span>
            </h2>
          </Reveal>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {EXPERTISE.map((ex, i) => (
              <Reveal key={ex.num} delay={0.06 * i}>
                <div
                  style={{
                    padding: 'clamp(28px,3.2vw,42px) 0',
                    borderTop: `1px solid rgba(44,74,140,0.30)`,
                    display: 'flex',
                    gap: 'clamp(18px,2.4vw,32px)',
                    alignItems: 'baseline',
                  }}
                >
                  <span
                    style={{
                      fontFamily: SERIF,
                      fontStyle: 'italic',
                      fontSize: 'clamp(22px,2.2vw,30px)',
                      color: C.gold,
                      minWidth: 44,
                      flexShrink: 0,
                    }}
                  >
                    {ex.num}
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
                      {ex.title}
                    </h4>
                    <p
                      style={{
                        fontFamily: SANS,
                        fontWeight: 300,
                        fontSize: 'clamp(13.5px,1.1vw,15.5px)',
                        lineHeight: 1.74,
                        color: 'rgba(255,255,255,0.66)',
                        margin: 0,
                      }}
                    >
                      {ex.body}
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
          .va-exppanel { grid-template-columns: 1fr !important; }
          .va-exppanel-sticky { position: static !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   8 · TESTIMONIALS — 2 cartes blanches fond crème
   ════════════════════════════════════════════════════════════════════════════ */
function Testimonials() {
  return (
    <section
      style={{
        background: C.bgAlt,
        padding: 'clamp(90px,12vw,170px) clamp(24px,6vw,96px)',
      }}
    >
      <div style={{ maxWidth: 1180, margin: '0 auto 60px', textAlign: 'center' }}>
        <Reveal>
          <Eyebrow color={C.textFaint} align="center">
            Ils nous font confiance
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(32px,4.8vw,64px)',
              fontWeight: 400,
              color: C.ink,
              margin: 'clamp(18px,2vw,28px) 0 0',
              lineHeight: 1.08,
            }}
          >
            La parole de{' '}
            <span style={{ fontStyle: 'italic', color: C.accent }}>nos clients</span>
          </h2>
        </Reveal>
      </div>

      <div
        style={{
          maxWidth: 1180,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'clamp(28px,3.6vw,52px)',
        }}
      >
        {TESTIMONIALS.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.12} style={{ height: '100%' }}>
            <figure
              style={{
                background: C.bgCard,
                border: `1px solid ${C.border}`,
                padding: 'clamp(32px,4vw,52px)',
                margin: 0,
                height: '100%',
                boxSizing: 'border-box',
                boxShadow: '0 20px 56px -36px rgba(44,74,140,0.18)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Briefcase size={30} color={C.gold} strokeWidth={1.4} />
              <div style={{ display: 'flex', gap: 3, margin: '18px 0 16px' }}>
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} size={13} fill={C.gold} color={C.gold} strokeWidth={0} />
                ))}
              </div>
              <blockquote
                style={{
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  fontSize: 'clamp(17px,1.7vw,21px)',
                  lineHeight: 1.64,
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
                    marginBottom: 6,
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
                    fontWeight: 400,
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
   9 · CONTACT FORM — fond sombre, champs à soulignement
   ════════════════════════════════════════════════════════════════════════════ */
function ContactForm() {
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [tel, setTel] = useState('');
  const [typeEntreprise, setTypeEntreprise] = useState('');
  const [objet, setObjet] = useState('');
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prenom || !email) return;
    setSent(true);
  };

  const fieldStyle: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid rgba(255,255,255,0.22)',
    padding: '15px 2px',
    fontFamily: SERIF,
    fontSize: 18,
    color: C.white,
    outline: 'none',
    transition: 'border-color .3s',
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 10.5,
    letterSpacing: '0.24em',
    textTransform: 'uppercase' as const,
    color: 'rgba(255,255,255,0.55)',
    display: 'block',
    marginBottom: 4,
    fontWeight: 400,
  };

  return (
    <section
      id="contact"
      style={{
        background: C.bgDark,
        padding: 'clamp(96px,13vw,180px) clamp(24px,6vw,96px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Léger fond texturé */}
      <img
        src={photo('1554224155-6726b3ff858f', 1200)}
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
          <Eyebrow color="rgba(212,221,240,0.80)" align="center">
            Prendre contact
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(34px,5.6vw,76px)',
              fontWeight: 400,
              color: C.white,
              margin: 'clamp(18px,2vw,28px) 0 clamp(14px,1.5vw,20px)',
              lineHeight: 1.06,
            }}
          >
            Parlons de{' '}
            <span style={{ fontStyle: 'italic', color: C.accentLight }}>
              votre projet
            </span>
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <p
            style={{
              fontFamily: SANS,
              fontWeight: 300,
              fontSize: 'clamp(14px,1.3vw,17px)',
              lineHeight: 1.74,
              color: 'rgba(255,255,255,0.70)',
              maxWidth: 500,
              margin: '0 auto clamp(44px,5vw,64px)',
            }}
          >
            Un associé vous répond personnellement dans les 24 heures. Premier rendez-vous offert, sans engagement.
          </p>
        </Reveal>

        {sent ? (
          <Reveal>
            <div
              style={{
                border: `1px solid ${C.borderDark}`,
                padding: 'clamp(36px,5vw,56px)',
                background: 'rgba(44,74,140,0.08)',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  fontSize: 'clamp(22px,2.5vw,36px)',
                  color: C.white,
                  marginBottom: 16,
                }}
              >
                Merci {prenom},
              </div>
              <p
                style={{
                  fontFamily: SANS,
                  fontWeight: 300,
                  fontSize: 16,
                  color: 'rgba(255,255,255,0.74)',
                  margin: 0,
                  lineHeight: 1.7,
                }}
              >
                Un associé vous contacte dans les 24h à{' '}
                <strong style={{ color: C.accentLight, fontWeight: 400 }}>{email}</strong>.
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
                gap: 'clamp(24px,3vw,36px)',
                textAlign: 'left',
              }}
            >
              {/* Prénom + Nom */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 'clamp(16px,2vw,28px)',
                }}
                className="va-formgrid"
              >
                <div>
                  <label htmlFor="va-prenom" style={labelStyle}>Prénom</label>
                  <input
                    id="va-prenom"
                    style={fieldStyle}
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    placeholder="Marie"
                    autoComplete="given-name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="va-nom" style={labelStyle}>Nom</label>
                  <input
                    id="va-nom"
                    style={fieldStyle}
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    placeholder="Dupont"
                    autoComplete="family-name"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="va-email" style={labelStyle}>Email</label>
                <input
                  id="va-email"
                  type="email"
                  style={fieldStyle}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="marie@societe.fr"
                  autoComplete="email"
                  required
                />
              </div>

              {/* Téléphone */}
              <div>
                <label htmlFor="va-tel" style={labelStyle}>Téléphone</label>
                <input
                  id="va-tel"
                  type="tel"
                  style={fieldStyle}
                  value={tel}
                  onChange={(e) => setTel(e.target.value)}
                  placeholder="+33 6 00 00 00 00"
                  autoComplete="tel"
                />
              </div>

              {/* Type d'entreprise */}
              <div>
                <label htmlFor="va-type" style={labelStyle}>Type d&apos;entreprise</label>
                <select
                  id="va-type"
                  style={{
                    ...fieldStyle,
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    cursor: 'pointer',
                    color: typeEntreprise ? C.white : 'rgba(255,255,255,0.42)',
                  }}
                  value={typeEntreprise}
                  onChange={(e) => setTypeEntreprise(e.target.value)}
                >
                  <option value="" style={{ color: C.ink }}>Sélectionner…</option>
                  <option value="Auto-entrepreneur" style={{ color: C.ink }}>Auto-entrepreneur</option>
                  <option value="SARL/SAS" style={{ color: C.ink }}>SARL / SAS</option>
                  <option value="SA" style={{ color: C.ink }}>SA</option>
                  <option value="Holding" style={{ color: C.ink }}>Holding</option>
                  <option value="Association" style={{ color: C.ink }}>Association</option>
                  <option value="Autre" style={{ color: C.ink }}>Autre</option>
                </select>
              </div>

              {/* Objet */}
              <div>
                <label htmlFor="va-objet" style={labelStyle}>Objet de la demande</label>
                <textarea
                  id="va-objet"
                  style={{
                    ...fieldStyle,
                    resize: 'vertical',
                    minHeight: 90,
                    lineHeight: 1.6,
                  }}
                  value={objet}
                  onChange={(e) => setObjet(e.target.value)}
                  placeholder="Décrivez brièvement votre besoin…"
                  rows={3}
                />
              </div>

              {/* Submit */}
              <div style={{ marginTop: 8, textAlign: 'center' }}>
                <NavyButton filled type="submit">
                  Envoyer ma demande
                </NavyButton>
              </div>
            </form>
          </Reveal>
        )}
      </div>

      <style>{`
        @media (max-width: 860px) {
          .va-formgrid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   10 · FOOTER — fond très sombre, 4 colonnes
   ════════════════════════════════════════════════════════════════════════════ */
function Footer() {
  const cols = [
    {
      title: 'Expertises',
      items: ['Comptabilité & Fiscal', 'Audit & CAC', 'Stratégie & Croissance'],
    },
    {
      title: 'Services',
      items: [
        'Tenue comptable',
        'Optimisation fiscale',
        'Paie & RH',
        'Commissariat aux comptes',
        "Création d'entreprise",
        'Transmission & cession',
      ],
    },
    {
      title: 'Contact',
      items: ['Prendre rendez-vous', '9 rue de Monceau, Paris 8e', 'cabinet@vaillant-assoc.fr', '+33 1 40 00 00 00'],
    },
  ];

  return (
    <footer
      style={{
        background: C.bgDarkAlt,
        borderTop: '1px solid rgba(44,74,140,0.20)',
        padding: 'clamp(70px,9vw,110px) clamp(24px,6vw,96px) 44px',
      }}
    >
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.5fr repeat(3, 1fr)',
          gap: 'clamp(32px,5vw,70px)',
        }}
        className="va-footgrid"
      >
        {/* Brand col */}
        <div>
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(18px,1.6vw,24px)',
              color: C.white,
              fontWeight: 400,
              letterSpacing: '0.04em',
              marginBottom: 18,
            }}
          >
            Vaillant &amp; Associés
          </div>
          <p
            style={{
              fontFamily: SANS,
              fontWeight: 300,
              fontSize: 14,
              lineHeight: 1.78,
              color: 'rgba(255,255,255,0.54)',
              maxWidth: 300,
              margin: '0 0 24px',
            }}
          >
            Expert-Comptable &amp; Commissariat aux Comptes. Paris 8e depuis 1990. Membre de l&apos;OEC.
          </p>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              fontFamily: SANS,
              fontSize: 11,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.40)',
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: C.accent,
                display: 'inline-block',
              }}
            />
            Paris 8e · France
          </div>
        </div>

        {/* Link cols */}
        {cols.map((c) => (
          <div key={c.title}>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 10.5,
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: C.gold,
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
                gap: 12,
              }}
            >
              {c.items.map((it) => (
                <li key={it}>
                  <a
                    href="#contact"
                    style={{
                      fontFamily: SANS,
                      fontWeight: 300,
                      fontSize: 14,
                      color: 'rgba(255,255,255,0.62)',
                      textDecoration: 'none',
                      lineHeight: 1.5,
                    }}
                  >
                    {it}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bas de pied */}
      <div
        style={{
          maxWidth: 1240,
          margin: 'clamp(52px,6vw,80px) auto 0',
          paddingTop: 28,
          borderTop: '1px solid rgba(44,74,140,0.16)',
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
        <span>© 1990–2026 Vaillant &amp; Associés. Tous droits réservés.</span>
        <span style={{ display: 'flex', gap: 22 }}>
          <a href="#contact" style={{ color: 'inherit', textDecoration: 'none' }}>Mentions légales</a>
          <a href="#contact" style={{ color: 'inherit', textDecoration: 'none' }}>Politique de confidentialité</a>
          <a href="#contact" style={{ color: 'inherit', textDecoration: 'none' }}>CGU</a>
        </span>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .va-footgrid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 500px) {
          .va-footgrid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   RESPONSIVE GLOBAL
   ════════════════════════════════════════════════════════════════════════════ */
const GLOBAL_RESPONSIVE = `
  * { box-sizing: border-box; }
  input::placeholder, textarea::placeholder, select option[value=""] {
    color: rgba(255,255,255,0.38);
  }
  input:focus, textarea:focus, select:focus {
    border-bottom-color: rgba(44,74,140,0.70) !important;
  }
  @media (max-width: 860px) {
    .va-navlinks { display: none !important; }
    .va-editrow { grid-template-columns: 1fr !important; }
    .va-editrow > * { order: initial !important; }
    .va-exppanel { grid-template-columns: 1fr !important; }
    .va-exppanel-sticky { position: static !important; }
    .va-footgrid { grid-template-columns: 1fr 1fr !important; }
    .va-formgrid { grid-template-columns: 1fr !important; }
  }
  @media (max-width: 500px) {
    .va-footgrid { grid-template-columns: 1fr !important; }
  }
`;

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
    C = { ...C, accent: brand };
  }

  
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
    <main
      suppressHydrationWarning
      style={{
        background: C.bg,
        color: C.ink,
        fontFamily: SERIF,
        overflowX: 'hidden',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
      }}
    >
      {/* Google Fonts */}
      <style>{`@import url('${FONTS_URL}');`}</style>
      {/* Responsive global */}
      <style>{GLOBAL_RESPONSIVE}</style>

      <Nav />
      <Hero />
      <Intro />
      <DomainSequence />
      <ServiceCards />
      <EditorialRows />
      <ExpertisePanel />
      <Testimonials />
      <ContactForm />
      <Footer />
    </main>
  );
}
