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
import {
  ArrowRight,
  ChevronDown,
  Zap,
  MapPin,
  Quote,
  Star,
  Shield,
} from 'lucide-react';

/* ════════════════════════════════════════════════════════════════════════════
   ÉLECTROPRO — Électricien · Domotique · Île-de-France
   Template impact-236. Premium scroll choreography. 'use client'.
   ════════════════════════════════════════════════════════════════════════════ */

/* ── Google Fonts ─────────────────────────────────────────────────────────── */
const GFONTS =
  "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');";

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
  bg: '#09090c',
  bgAlt: '#0f0f14',
  bgCard: '#13131a',
  bgCardHover: '#1a1a24',
  accent: '#f59e0b',
  accentDim: '#d97706',
  white: '#f1f2f4',
  textMuted: '#8a8d9a',
  textFaint: '#56596a',
  border: '#1e1e28',
  borderBright: '#2e2e3c',
};

const FONT = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

/* ── Shared easing ───────────────────────────────────────────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ══════════════════════════════════════════════════════════════════════════════
   DATA TYPES & CONSTANTS
   ══════════════════════════════════════════════════════════════════════════════ */

interface Phase {
  id: string;
  img: string;
  caption: string;
  sub: string;
}

interface Service {
  num: string;
  title: string;
  desc: string;
}

interface EditRow {
  eyebrow: string;
  num: string;
  img: string;
  alt: string;
  title: string;
  body: string;
}

interface Spec {
  key: string;
  title: string;
  desc: string;
}

interface Review {
  quote: string;
  name: string;
  role: string;
  city: string;
}

/* ── Photo helper ─────────────────────────────────────────────────────────── */
const PHOTO = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?q=80&w=${w}&auto=format&fit=crop`;

/* ── Work Sequence phases (3) ─────────────────────────────────────────────── */
const PHASES: Phase[] = [
  {
    id: 'phase-1',
    img: PHOTO('1621905251189-08b45d6a269e'),
    caption: 'INSTALLATION ÉLECTRIQUE',
    sub: 'Tableaux basse tension, circuits dédiés, câblage conforme NF C 15-100.',
  },
  {
    id: 'phase-2',
    img: PHOTO('1558618666-fcd25c85cd64'),
    caption: 'DOMOTIQUE & SMART HOME',
    sub: 'KNX, Zigbee, pilotage vocal — votre maison intelligente, clé en main.',
  },
  {
    id: 'phase-3',
    img: PHOTO('1574267432-5579e42a41c5'),
    caption: 'MISE AUX NORMES',
    sub: 'Diagnostic, CONSUEL, ERDF — conformité garantie avant vente ou location.',
  },
];

/* ── Services (6) ─────────────────────────────────────────────────────────── */
const SERVICES: Service[] = [
  {
    num: '01',
    title: 'Installation électrique',
    desc: 'Création et mise en œuvre de tableaux électriques, circuits dédiés et prises de courant conformes NF C 15-100.',
  },
  {
    num: '02',
    title: 'Tableau électrique',
    desc: 'Remplacement, mise à niveau et sécurisation de votre tableau : disjoncteurs, différentiels, protection parafoudre.',
  },
  {
    num: '03',
    title: 'Domotique',
    desc: 'Intégration KNX, Zigbee ou Z-Wave, scénarios lumineux, volets, chauffage et sécurité pilotés depuis votre smartphone.',
  },
  {
    num: '04',
    title: 'Mise aux normes',
    desc: "Diagnostic complet, attestation CONSUEL et mise en conformité pour vente, location ou simple tranquillité d'esprit.",
  },
  {
    num: '05',
    title: 'Éclairage LED',
    desc: 'Conception lumineuse et remplacement intégral : spots, rails, luminaires architecturaux — économies garanties.',
  },
  {
    num: '06',
    title: 'Bornes IRVE',
    desc: 'Installation de bornes de recharge pour véhicules électriques, agréées IRVE P1/P2/P3, avec subvention ADVENIR.',
  },
];

/* ── Editorial rows (2) ───────────────────────────────────────────────────── */
const EDIT_ROWS: EditRow[] = [
  {
    eyebrow: 'Notre méthode',
    num: '01',
    img: PHOTO('1621905251189-08b45d6a269e', 800),
    alt: 'Électricien au travail dans un tableau électrique',
    title: "Précis jusqu'au dernier fil.",
    body: "Avec plus de 15 ans d'expérience en Île-de-France, ÉlectroPro réalise chaque installation avec rigueur et méthode. Notre équipe Qualibat accompagne particuliers et professionnels, du diagnostic initial à la réception des travaux, en respectant les délais et les normes en vigueur.",
  },
  {
    eyebrow: 'Certifications',
    num: '02',
    img: PHOTO('1558618666-fcd25c85cd64', 800),
    alt: 'Tableau domotique KNX installé par ÉlectroPro',
    title: 'Qualibat, IRVE, Qualifelec.',
    body: 'Nos certifications ne sont pas de simples labels : elles représentent des audits annuels, des formations continues et un engagement envers la qualité. Qualibat 5311/5312, agrément IRVE P1/P2/P3, habilitations électriques BR/B2V/BC/BE et garantie décennale — votre chantier est entre les mains de professionnels reconnus.',
  },
];

/* ── Tech specs (4) ───────────────────────────────────────────────────────── */
const SPECS: Spec[] = [
  {
    key: '01',
    title: 'Habilitation BR / B2V / BC / BE',
    desc: "Nos techniciens sont habilités pour travailler sur tous types d'installations, y compris en présence de tension.",
  },
  {
    key: '02',
    title: 'Certification Qualibat 5311 / 5312',
    desc: 'Reconnaissance officielle de notre savoir-faire en installation électrique résidentielle et tertiaire.',
  },
  {
    key: '03',
    title: 'Agrément IRVE P1 / P2 / P3',
    desc: "Seuls les installateurs agréés IRVE peuvent poser des bornes de recharge éligibles aux aides de l'État.",
  },
  {
    key: '04',
    title: 'Garantie décennale — RC Pro',
    desc: 'Chaque chantier est couvert par notre assurance décennale et notre responsabilité civile professionnelle.',
  },
];

/* ── Reviews (3) ─────────────────────────────────────────────────────────── */
const REVIEWS: Review[] = [
  {
    quote:
      'Tableau électrique entièrement refait en une journée, câblage impeccable et nettoyage du chantier inclus. Je recommande sans hésiter.',
    name: 'Marie-Claire Fontaine',
    role: 'Propriétaire',
    city: 'Versailles (78)',
  },
  {
    quote:
      "Installation d'une borne IRVE et mise aux normes complète de l'appartement. Équipe ponctuelle, travail propre et attestation CONSUEL obtenue en 3 jours.",
    name: 'Julien Marchetti',
    role: 'Gestionnaire de patrimoine',
    city: 'Boulogne-Billancourt (92)',
  },
  {
    quote:
      'Domotique KNX installée dans notre maison de 220 m². Le résultat dépasse nos attentes — éclairage, volets et alarme pilotés depuis une seule application.',
    name: 'Sophie et Thomas Renard',
    role: 'Particuliers',
    city: 'Saint-Germain-en-Laye (78)',
  },
];

/* ── Marquee items ────────────────────────────────────────────────────────── */
const MARQUEE_ITEMS = [
  'INSTALLATION ÉLECTRIQUE',
  'DOMOTIQUE KNX',
  'MISE AUX NORMES',
  'BORNES IRVE',
  'QUALIBAT CERTIFIÉ',
  'ÎLE-DE-FRANCE',
];

/* ══════════════════════════════════════════════════════════════════════════════
   PRIMITIVES
   ══════════════════════════════════════════════════════════════════════════════ */

/** Amber line + uppercase label eyebrow. */
function Eyebrow({
  children,
  align = 'left',
  dark = false,
}: {
  children: React.ReactNode;
  align?: 'left' | 'center';
  dark?: boolean;
}) {
  const color = dark ? C.bg : C.accent;
  const wrap: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    justifyContent: align === 'center' ? 'center' : 'flex-start',
  };
  const rule: React.CSSProperties = {
    width: 28,
    height: 1.5,
    background: color,
    flexShrink: 0,
  };
  const label: React.CSSProperties = {
    fontFamily: FONT,
    fontSize: 10.5,
    letterSpacing: '0.38em',
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

/** Fade + slide reveal on scroll, fires once. */
function Reveal({
  children,
  delay = 0,
  y = 32,
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
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Amber CTA button with arrow. */
function AmberButton({
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
    fontFamily: FONT,
    fontSize: 12,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    fontWeight: 700,
    cursor: 'pointer',
    border: `1.5px solid ${C.accent}`,
    background: outline ? 'transparent' : C.accent,
    color: outline ? C.accent : C.bg,
    transition: 'all .45s cubic-bezier(.16,1,.3,1)',
    transform: hover ? 'translateY(-2px)' : 'none',
    boxShadow: hover
      ? outline
        ? '0 0 0 1px rgba(245,158,11,0.3)'
        : '0 12px 32px -8px rgba(245,158,11,0.45)'
      : 'none',
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
          transform: hover ? 'translateX(4px)' : 'none',
          transition: 'transform .45s cubic-bezier(.16,1,.3,1)',
        }}
      />
    </button>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   NAV
   ══════════════════════════════════════════════════════════════════════════════ */
function NavLink({ label, href }: { label: string; href: string }) {
  const [h, setH] = useState(false);
  return (
    <a
      href={href}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        fontFamily: FONT,
        fontSize: 12,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        fontWeight: 500,
        color: h ? C.accent : C.textMuted,
        textDecoration: 'none',
        transition: 'color .35s',
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
          background: C.accent,
          transition: 'width .45s cubic-bezier(.16,1,.3,1)',
        }}
      />
    </a>
  );
}

function Nav() {
  const [solid, setSolid] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  React.useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 70);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const LINKS = [
    { label: 'Services', href: '#services' },
    { label: 'Réalisations', href: '#realisations' },
    { label: 'Certifications', href: '#certifications' },
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
    background: solid ? 'rgba(9,9,12,0.9)' : 'transparent',
    backdropFilter: solid ? 'blur(16px) saturate(140%)' : 'none',
    WebkitBackdropFilter: solid ? 'blur(16px) saturate(140%)' : 'none',
    borderBottom: solid
      ? `1px solid ${C.border}`
      : '1px solid transparent',
    transition: 'all .55s cubic-bezier(.16,1,.3,1)',
  };
  const brand: React.CSSProperties = {
    fontFamily: FONT,
    fontSize: 18,
    fontWeight: 800,
    color: C.white,
    letterSpacing: '-0.01em',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
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
      <a href="#realisations" style={brand}>
        {fd?.logoBase64 ? (
          // Client logo (uploaded in the brief) replaces the placeholder mark —
          // essential for the client to recognise their brand in the render.
          <img
            src={fd.logoBase64}
            alt={fd?.businessName ?? 'logo'}
            style={{ height: 30, maxWidth: 160, objectFit: 'contain', display: 'block' }}
          />
        ) : (
          <>
            <Zap size={18} color={C.accent} fill={C.accent} strokeWidth={0} />{fd?.businessName ?? "ÉlectroPro"}
          </>
        )}
      </a>
      <div style={linkRow} className="ep-navlinks">
        {LINKS.map((l) => (
          <NavLink key={l.label} label={l.label} href={l.href} />
        ))}
      </div>
      <div className="ep-navcta">
        <a href="#contact" style={{ textDecoration: 'none' }}>
          <AmberButton>Devis gratuit</AmberButton>
        </a>
      </div>
      
        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="ep-burger"
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
        @media (max-width: 900px) {
          .ep-navlinks { display: none !important; }
          .ep-burger { display: flex !important; flex-direction: column; }
          .ep-navcta { display: none !important; }
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
          {LINKS.map((l) => (
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

/* ══════════════════════════════════════════════════════════════════════════════
   HERO
   ══════════════════════════════════════════════════════════════════════════════ */
function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-40%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const section: React.CSSProperties = {
    position: 'relative',
    height: '100vh',
    minHeight: 640,
    overflow: 'hidden',
    background: C.bg,
  };

  return (
    <section id="hero" ref={ref} style={section}>
      {/* Background image with parallax */}
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
          src={PHOTO('1621905251189-08b45d6a269e', 2000)}
          alt="Électricien en intervention — ÉlectroPro Île-de-France"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </motion.div>

      {/* Dark bottom scrim */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(9,9,12,0.52) 0%, rgba(9,9,12,0.12) 40%, rgba(9,9,12,0.60) 72%, rgba(9,9,12,0.92) 100%)',
        }}
      />
      {/* Radial vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(110% 80% at 60% 40%, transparent 38%, rgba(9,9,12,0.55) 100%)',
        }}
      />

      {/* Content */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: 'clamp(70px,12vw,130px)',
          left: 'clamp(20px,5vw,80px)',
          right: 'clamp(20px,5vw,80px)',
          zIndex: 2,
          y: contentY,
          opacity: contentOpacity,
        }}
      >
        <Reveal>
          <Eyebrow>Électricien certifié · Île-de-France</Eyebrow>
        </Reveal>

        <motion.h1
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3, ease: EASE, delay: 0.1 }}
          style={{
            fontFamily: FONT,
            fontWeight: 900,
            color: C.white,
            fontSize: 'clamp(3rem,11vw,11rem)',
            lineHeight: 0.92,
            letterSpacing: '-0.03em',
            textTransform: 'uppercase',
            margin: '24px 0 28px',
            textShadow: '0 8px 50px rgba(0,0,0,0.55)',
          }}
        >
          CÂBLÉ
          <br />
          <span style={{ color: C.accent }}>/POUR</span>
          <br />
          DURER
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.35 }}
          style={{
            fontFamily: FONT,
            fontSize: 'clamp(15px,1.6vw,19px)',
            color: 'rgba(241,242,244,0.80)',
            maxWidth: 520,
            lineHeight: 1.7,
            marginBottom: 38,
            fontWeight: 400,
          }}
        >
          Électricien qualifié depuis 2009 en Île-de-France. Installation,
          domotique, mise aux normes et bornes IRVE — du devis à la réception,
          sans compromis.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.58 }}
        >
          <a href="#contact" style={{ textDecoration: 'none' }}>
            <AmberButton>Demander un devis</AmberButton>
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: 28,
          right: 'clamp(20px,5vw,64px)',
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
            fontFamily: FONT,
            fontSize: 9.5,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'rgba(241,242,244,0.55)',
            writingMode: 'vertical-lr',
          }}
        >
          Défiler
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

/* ══════════════════════════════════════════════════════════════════════════════
   MARQUEE
   ══════════════════════════════════════════════════════════════════════════════ */
function Marquee() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  const track: React.CSSProperties = {
    background: C.accent,
    overflow: 'hidden',
    padding: '18px 0',
  };
  const inner: React.CSSProperties = {
    display: 'flex',
    gap: 0,
  };
  const ticker: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 0,
    flexShrink: 0,
    animation: 'ep-marquee 28s linear infinite',
  };
  const item: React.CSSProperties = {
    fontFamily: FONT,
    fontWeight: 800,
    fontSize: 'clamp(11px,1.1vw,13px)',
    letterSpacing: '0.28em',
    textTransform: 'uppercase',
    color: C.bg,
    whiteSpace: 'nowrap',
    padding: '0 clamp(20px,2.5vw,38px)',
    display: 'flex',
    alignItems: 'center',
    gap: 'clamp(20px,2.5vw,38px)',
  };
  return (
    <div style={track} aria-hidden="true">
      <div style={inner}>
        {[0, 1].map((idx) => (
          <div key={idx} style={ticker}>
            {items.map((t, i) => (
              <span key={i} style={item}>
                {t}
                <Zap
                  size={12}
                  color={C.bg}
                  fill={C.bg}
                  strokeWidth={0}
                  style={{ flexShrink: 0 }}
                />
              </span>
            ))}
          </div>
        ))}
      </div>
      <style>{`
        @keyframes ep-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   WORK SEQUENCE — 320vh sticky crossfade
   ══════════════════════════════════════════════════════════════════════════════ */
function PhaseImage({
  phase,
  i,
  total,
  progress,
}: {
  phase: Phase;
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
  const scale = useTransform(progress, [start - fade, end], [1.08, 1.0]);

  return (
    <motion.div style={{ position: 'absolute', inset: 0, opacity }}>
      <motion.img
        src={phase.img}
        alt={phase.caption}
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
  phase: Phase;
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
    i === 0 ? [1, 1, 1, 0] : i === total - 1 ? [0, 1, 1, 1] : [0, 1, 1, 0],
  );
  const y = useTransform(progress, [start, end], [28, -28]);

  return (
    <motion.div
      style={{
        position: 'absolute',
        bottom: 'clamp(60px,10vw,110px)',
        left: 'clamp(24px,6vw,96px)',
        maxWidth: 640,
        opacity,
        y,
      }}
    >
      <Eyebrow>{`0${i + 1}`}</Eyebrow>
      <h2
        style={{
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 'clamp(28px,5.5vw,72px)',
          color: C.white,
          textTransform: 'uppercase',
          letterSpacing: '-0.02em',
          lineHeight: 1,
          margin: '16px 0 14px',
          textShadow: '0 6px 30px rgba(0,0,0,0.7)',
        }}
      >
        {phase.caption}
      </h2>
      <p
        style={{
          fontFamily: FONT,
          fontSize: 'clamp(14px,1.4vw,17px)',
          color: 'rgba(241,242,244,0.80)',
          lineHeight: 1.65,
          fontWeight: 400,
          maxWidth: 460,
        }}
      >
        {phase.sub}
      </p>
    </motion.div>
  );
}

function ProgressBar({
  total,
  progress,
}: {
  total: number;
  progress: MotionValue<number>;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 28,
        left: 'clamp(24px,6vw,96px)',
        right: 'clamp(24px,6vw,96px)',
        display: 'flex',
        gap: 8,
        zIndex: 4,
      }}
    >
      {Array.from({ length: total }).map((_, i) => (
        <ProgressSegment key={i} i={i} total={total} progress={progress} />
      ))}
    </div>
  );
}

function ProgressSegment({
  i,
  total,
  progress,
}: {
  i: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const seg = 1 / total;
  const width = useTransform(
    progress,
    [i * seg, (i + 1) * seg],
    ['0%', '100%'],
  );
  const opacity = useTransform(
    progress,
    [i * seg, i * seg + 0.02, (i + 1) * seg - 0.02, (i + 1) * seg],
    [0.3, 1, 1, 0.3],
  );

  return (
    <div
      style={{
        flex: 1,
        height: 2,
        background: 'rgba(241,242,244,0.2)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <motion.div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          background: C.accent,
          width,
          opacity,
        }}
      />
    </div>
  );
}

function WorkSequence() {
  const n = PHASES.length;
  const progress = useMotionValue(0.5 / n);
  const [active, setActive] = useState(0);
  const goTo = (i: number) => {
    setActive(i);
    progress.set((i + 0.5) / n);
  };

  return (
    <section
      style={{ height: '100vh', overflow: 'hidden', position: 'relative', background: C.bg }}
      id="realisations"
    >
      <div
        style={{
          position: 'relative',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {/* Images layer */}
        {PHASES.map((p, i) => (
          <PhaseImage
            key={p.id}
            phase={p}
            i={i}
            total={PHASES.length}
            progress={progress}
          />
        ))}

        {/* Dark overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to top, rgba(9,9,12,0.82) 0%, rgba(9,9,12,0.22) 55%, rgba(9,9,12,0.12) 100%)',
            zIndex: 1,
          }}
        />

        {/* Section label top-right */}
        <div
          style={{
            position: 'absolute',
            top: 'clamp(80px,10vw,110px)',
            right: 'clamp(24px,5vw,80px)',
            zIndex: 3,
          }}
        >
          <Eyebrow align="left">Nos Réalisations</Eyebrow>
        </div>

        {/* Captions */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
          {PHASES.map((p, i) => (
            <PhaseCaption
              key={p.id}
              phase={p}
              i={i}
              total={PHASES.length}
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
        {/* Progress bar */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none' }}>
          <ProgressBar total={PHASES.length} progress={progress} />
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   SERVICE CARDS
   ══════════════════════════════════════════════════════════════════════════════ */
function ServiceCard({ svc, i }: { svc: Service; i: number }) {
  const [hover, setHover] = useState(false);
  const card: React.CSSProperties = {
    background: hover ? C.bgCardHover : C.bgCard,
    border: `1px solid ${hover ? C.borderBright : C.border}`,
    padding: 'clamp(28px,3.5vw,44px)',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    transition: 'all .45s cubic-bezier(.16,1,.3,1)',
    cursor: 'default',
    transform: hover ? 'translateY(-6px)' : 'none',
    boxShadow: hover ? '0 24px 60px -24px rgba(245,158,11,0.15)' : 'none',
  };
  return (
    <Reveal delay={i * 0.07} style={{ height: '100%' }}>
      <article
        style={card}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <span
          style={{
            fontFamily: FONT,
            fontSize: 13,
            fontWeight: 700,
            color: hover ? C.accent : C.textFaint,
            letterSpacing: '0.12em',
            transition: 'color .4s',
          }}
        >
          {svc.num}
        </span>
        <h3
          style={{
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: 'clamp(17px,1.6vw,21px)',
            color: C.white,
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          {svc.title}
        </h3>
        <p
          style={{
            fontFamily: FONT,
            fontSize: 14.5,
            lineHeight: 1.68,
            color: C.textMuted,
            margin: 0,
            flex: 1,
          }}
        >
          {svc.desc}
        </p>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            fontFamily: FONT,
            fontSize: 11,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            fontWeight: 600,
            color: hover ? C.accent : C.textFaint,
            transition: 'color .4s',
          }}
        >
          En savoir plus
          <ArrowRight
            size={13}
            style={{
              transform: hover ? 'translateX(4px)' : 'none',
              transition: 'transform .4s cubic-bezier(.16,1,.3,1)',
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
    padding:
      'clamp(80px,11vw,160px) clamp(24px,6vw,96px)',
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
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto clamp(48px,6vw,80px)',
        }}
      >
        <Reveal>
          <Eyebrow>Nos Prestations</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: 'clamp(32px,5vw,68px)',
              color: C.white,
              margin: '18px 0 0',
              letterSpacing: '-0.025em',
              lineHeight: 1.04,
            }}
          >
            L'électricité en toute{' '}
            <span style={{ color: C.accent }}>expertise.</span>
          </h2>
        </Reveal>
      </div>
      <div style={grid}>
        {SERVICES.map((s, i) => (
          <ServiceCard key={s.num} svc={s} i={i} />
        ))}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   EDITORIAL ROWS
   ══════════════════════════════════════════════════════════════════════════════ */
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
        style={{ width: '100%', height: '116%', objectFit: 'cover', y }}
      />
    </div>
  );
}

function EditorialRow({ row, reverse }: { row: EditRow; reverse: boolean }) {
  const wrap: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 'clamp(32px,5vw,80px)',
    alignItems: 'center',
  };
  const imgBox: React.CSSProperties = {
    overflow: 'hidden',
    order: reverse ? 2 : 1,
    aspectRatio: '4 / 5',
    position: 'relative',
  };
  const numStyle: React.CSSProperties = {
    fontFamily: FONT,
    fontWeight: 900,
    fontSize: 'clamp(80px,10vw,140px)',
    color: 'rgba(241,242,244,0.04)',
    lineHeight: 1,
    position: 'absolute',
    top: -30,
    right: -20,
    letterSpacing: '-0.05em',
    userSelect: 'none',
    pointerEvents: 'none',
  };
  const txt: React.CSSProperties = {
    order: reverse ? 1 : 2,
    position: 'relative',
  };

  return (
    <div style={wrap} className="ep-editrow">
      <Reveal y={48} style={imgBox}>
        <>
          <span style={numStyle}>{row.num}</span>
          <ParallaxImg src={row.img} alt={row.alt} />
        </>
      </Reveal>
      <div style={txt}>
        <Reveal>
          <Eyebrow>{row.eyebrow}</Eyebrow>
        </Reveal>
        <Reveal delay={0.1}>
          <h3
            style={{
              fontFamily: FONT,
              fontWeight: 800,
              fontSize: 'clamp(26px,4vw,52px)',
              color: C.white,
              margin: '20px 0 22px',
              letterSpacing: '-0.025em',
              lineHeight: 1.1,
            }}
          >
            {row.title}
          </h3>
        </Reveal>
        <Reveal delay={0.18}>
          <p
            style={{
              fontFamily: FONT,
              fontSize: 'clamp(15px,1.5vw,18px)',
              lineHeight: 1.78,
              color: C.textMuted,
              maxWidth: 480,
            }}
          >
            {row.body}
          </p>
        </Reveal>
      </div>
      <style>{`
        @media (max-width: 900px) {
          .ep-editrow { grid-template-columns: 1fr !important; }
          .ep-editrow > * { order: initial !important; }
        }
      `}</style>
    </div>
  );
}

function EditorialRows() {
  const sec: React.CSSProperties = {
    background: C.bgAlt,
    padding:
      'clamp(72px,10vw,140px) clamp(24px,6vw,96px)',
    borderTop: `1px solid ${C.border}`,
  };
  return (
    <section style={sec}>
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(72px,10vw,130px)',
        }}
      >
        {EDIT_ROWS.map((r, i) => (
          <EditorialRow key={r.num} row={r} reverse={i % 2 === 1} />
        ))}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   TECH PANEL — sticky left image, scrolling right specs
   ══════════════════════════════════════════════════════════════════════════════ */
function TechPanel() {
  const sec: React.CSSProperties = {
    background: C.bg,
    padding:
      'clamp(80px,11vw,150px) clamp(24px,6vw,96px)',
    borderTop: `1px solid ${C.border}`,
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 'clamp(40px,6vw,100px)',
    maxWidth: 1280,
    margin: '0 auto',
    alignItems: 'start',
  };
  const stickyLeft: React.CSSProperties = {
    position: 'sticky',
    top: 100,
    alignSelf: 'start',
  };

  return (
    <section style={sec} id="certifications">
      <div style={grid} className="ep-techpanel">
        {/* Left sticky image */}
        <div style={stickyLeft} className="ep-techpanel-img">
          <div
            style={{
              overflow: 'hidden',
              border: `1px solid ${C.border}`,
              aspectRatio: '3 / 4',
            }}
          >
            <img
              src={PHOTO('1574267432-5579e42a41c5')}
              alt="Certification et habilitations ÉlectroPro"
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
          <div style={{ marginTop: 28 }}>
            <Eyebrow>Habilitations & certifications</Eyebrow>
            <p
              style={{
                fontFamily: FONT,
                fontSize: 13.5,
                lineHeight: 1.7,
                color: C.textMuted,
                marginTop: 14,
              }}
            >
              Chaque technicien ÉlectroPro est habilité, assuré et formé en
              continu. Nos certifications sont renouvelées chaque année.
            </p>
          </div>
        </div>

        {/* Right scrolling specs */}
        <div>
          <Reveal>
            <Eyebrow>Nos Qualifications</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2
              style={{
                fontFamily: FONT,
                fontWeight: 900,
                fontSize: 'clamp(28px,4vw,54px)',
                color: C.white,
                margin: '18px 0 48px',
                letterSpacing: '-0.025em',
                lineHeight: 1.06,
              }}
            >
              Un niveau d'exigence{' '}
              <span style={{ color: C.accent }}>certifié.</span>
            </h2>
          </Reveal>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {SPECS.map((spec, i) => (
              <Reveal key={spec.key} delay={0.06 * i}>
                <div
                  style={{
                    padding: 'clamp(28px,3.5vw,40px) 0',
                    borderTop: `1px solid ${C.border}`,
                    display: 'grid',
                    gridTemplateColumns: '56px 1fr',
                    gap: 24,
                    alignItems: 'start',
                  }}
                >
                  <span
                    style={{
                      fontFamily: FONT,
                      fontWeight: 800,
                      fontSize: 28,
                      color: C.accent,
                      lineHeight: 1,
                      opacity: 0.85,
                    }}
                  >
                    {spec.key}
                  </span>
                  <div>
                    <h4
                      style={{
                        fontFamily: FONT,
                        fontWeight: 700,
                        fontSize: 'clamp(16px,1.5vw,20px)',
                        color: C.white,
                        margin: '0 0 10px',
                        lineHeight: 1.2,
                      }}
                    >
                      {spec.title}
                    </h4>
                    <p
                      style={{
                        fontFamily: FONT,
                        fontSize: 14.5,
                        lineHeight: 1.66,
                        color: C.textMuted,
                        margin: 0,
                      }}
                    >
                      {spec.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
            {/* Bottom border */}
            <div style={{ borderTop: `1px solid ${C.border}` }} />
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) {
          .ep-techpanel { grid-template-columns: 1fr !important; }
          .ep-techpanel-img { position: static !important; }
        }
      `}</style>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   REVIEWS
   ══════════════════════════════════════════════════════════════════════════════ */
function ReviewCard({ review, i }: { review: Review; i: number }) {
  const card: React.CSSProperties = {
    background: C.bgCard,
    border: `1px solid ${C.border}`,
    padding: 'clamp(32px,4vw,48px)',
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
    height: '100%',
    boxSizing: 'border-box',
  };
  return (
    <Reveal delay={i * 0.1} style={{ height: '100%' }}>
      <figure style={card}>
        <Quote size={28} color={C.accent} strokeWidth={1.5} style={{ marginBottom: 20 }} />
        <div style={{ display: 'flex', gap: 3, marginBottom: 20 }}>
          {Array.from({ length: 5 }).map((_, s) => (
            <Star key={s} size={13} fill={C.accent} color={C.accent} strokeWidth={0} />
          ))}
        </div>
        <blockquote
          style={{
            fontFamily: FONT,
            fontSize: 'clamp(15px,1.5vw,17px)',
            lineHeight: 1.72,
            color: C.white,
            margin: '0 0 auto',
            fontWeight: 400,
            paddingBottom: 28,
          }}
        >
          "{review.quote}"
        </blockquote>
        <figcaption
          style={{
            borderTop: `1px solid ${C.border}`,
            paddingTop: 22,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          <span
            style={{
              fontFamily: FONT,
              fontWeight: 700,
              fontSize: 15,
              color: C.white,
            }}
          >
            {review.name}
          </span>
          <span
            style={{
              fontFamily: FONT,
              fontSize: 12,
              color: C.textFaint,
              letterSpacing: '0.06em',
            }}
          >
            {review.role} · {review.city}
          </span>
        </figcaption>
      </figure>
    </Reveal>
  );
}

function Reviews() {
  const sec: React.CSSProperties = {
    background: C.bg,
    padding:
      'clamp(80px,11vw,150px) clamp(24px,6vw,96px)',
    borderTop: `1px solid ${C.border}`,
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: 'clamp(16px,2vw,28px)',
    maxWidth: 1280,
    margin: '0 auto',
  };
  return (
    <section style={sec}>
      <div style={{ maxWidth: 1280, margin: '0 auto clamp(48px,6vw,80px)' }}>
        <Reveal>
          <Eyebrow align="left">Avis clients</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: 'clamp(32px,5vw,66px)',
              color: C.white,
              margin: '18px 0 0',
              letterSpacing: '-0.025em',
              lineHeight: 1.04,
            }}
          >
            Ce que disent{' '}
            <span style={{ color: C.accent }}>nos clients.</span>
          </h2>
        </Reveal>
      </div>
      <div style={grid}>
        {REVIEWS.map((r, i) => (
          <ReviewCard key={r.name} review={r} i={i} />
        ))}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   QUOTE FORM
   ══════════════════════════════════════════════════════════════════════════════ */
function QuoteForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [service, setService] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !email || !service) return;
    setSent(true);
  };

  const FIELD: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    background: 'transparent',
    border: 'none',
    borderBottom: `1px solid ${C.border}`,
    padding: '14px 0',
    fontFamily: FONT,
    fontSize: 16,
    color: C.white,
    outline: 'none',
    transition: 'border-color .35s',
  };
  const LABEL: React.CSSProperties = {
    fontFamily: FONT,
    fontSize: 10,
    letterSpacing: '0.32em',
    textTransform: 'uppercase',
    fontWeight: 700,
    color: C.accent,
    display: 'block',
    marginBottom: 2,
  };

  const sec: React.CSSProperties = {
    background: C.bgAlt,
    padding:
      'clamp(88px,12vw,168px) clamp(24px,6vw,96px)',
    borderTop: `1px solid ${C.border}`,
  };
  const inner: React.CSSProperties = {
    maxWidth: 720,
    margin: '0 auto',
  };

  return (
    <section style={sec} id="contact">
      <div style={inner}>
        <Reveal>
          <Eyebrow align="center">Demande de devis gratuit</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: 'clamp(30px,5vw,62px)',
              color: C.white,
              margin: '20px 0 14px',
              letterSpacing: '-0.025em',
              lineHeight: 1.05,
              textAlign: 'center',
            }}
          >
            Parlons de{' '}
            <span style={{ color: C.accent }}>votre projet.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.14}>
          <p
            style={{
              fontFamily: FONT,
              fontSize: 'clamp(14px,1.4vw,17px)',
              color: C.textMuted,
              lineHeight: 1.7,
              textAlign: 'center',
              marginBottom: 'clamp(40px,5vw,64px)',
            }}
          >
            Réponse sous 24 h. Déplacement gratuit en Île-de-France pour tout
            devis.
          </p>
        </Reveal>

        {sent ? (
          <Reveal>
            <div
              style={{
                border: `1px solid ${C.accent}`,
                background: 'rgba(245,158,11,0.06)',
                padding: 'clamp(36px,5vw,56px)',
                textAlign: 'center',
              }}
            >
              <Shield
                size={36}
                color={C.accent}
                strokeWidth={1.5}
                style={{ marginBottom: 20 }}
              />
              <h3
                style={{
                  fontFamily: FONT,
                  fontWeight: 800,
                  fontSize: 28,
                  color: C.white,
                  margin: '0 0 14px',
                }}
              >
                Demande envoyée{firstName ? `, ${firstName}` : ''} !
              </h3>
              <p
                style={{
                  fontFamily: FONT,
                  fontSize: 16,
                  color: C.textMuted,
                  margin: 0,
                  lineHeight: 1.7,
                }}
              >
                Nous reviendrons vers vous à{' '}
                <strong style={{ color: C.accent }}>{email}</strong> dans les
                24 heures ouvrées.
              </p>
            </div>
          </Reveal>
        ) : (
          <Reveal delay={0.2}>
            <form onSubmit={handleSubmit} noValidate>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 'clamp(20px,3vw,36px)',
                  marginBottom: 'clamp(24px,3vw,36px)',
                }}
                className="ep-formgrid"
              >
                <div>
                  <label style={LABEL} htmlFor="ep-prenom">
                    Prénom
                  </label>
                  <input
                    id="ep-prenom"
                    style={FIELD}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Jean"
                    autoComplete="given-name"
                    required
                    onFocus={(e) =>
                      (e.currentTarget.style.borderBottomColor = C.accent)
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderBottomColor = C.border)
                    }
                  />
                </div>
                <div>
                  <label style={LABEL} htmlFor="ep-nom">
                    Nom
                  </label>
                  <input
                    id="ep-nom"
                    style={FIELD}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Dupont"
                    autoComplete="family-name"
                    onFocus={(e) =>
                      (e.currentTarget.style.borderBottomColor = C.accent)
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderBottomColor = C.border)
                    }
                  />
                </div>
              </div>

              <div style={{ marginBottom: 'clamp(24px,3vw,36px)' }}>
                <label style={LABEL} htmlFor="ep-email">
                  Email
                </label>
                <input
                  id="ep-email"
                  style={FIELD}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jean.dupont@exemple.fr"
                  autoComplete="email"
                  required
                  onFocus={(e) =>
                    (e.currentTarget.style.borderBottomColor = C.accent)
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderBottomColor = C.border)
                  }
                />
              </div>

              <div style={{ marginBottom: 'clamp(24px,3vw,36px)' }}>
                <label style={LABEL} htmlFor="ep-service">
                  Type de prestation
                </label>
                <select
                  id="ep-service"
                  style={{
                    ...FIELD,
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    cursor: 'pointer',
                    color: service ? C.white : C.textFaint,
                  }}
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  required
                  onFocus={(e) =>
                    (e.currentTarget.style.borderBottomColor = C.accent)
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderBottomColor = C.border)
                  }
                >
                  <option value="" style={{ color: '#111', background: '#fff' }}>
                    Choisir une prestation…
                  </option>
                  <option value="Installation électrique" style={{ color: '#111', background: '#fff' }}>
                    Installation électrique
                  </option>
                  <option value="Tableau électrique" style={{ color: '#111', background: '#fff' }}>
                    Tableau électrique
                  </option>
                  <option value="Domotique" style={{ color: '#111', background: '#fff' }}>
                    Domotique
                  </option>
                  <option value="Mise aux normes" style={{ color: '#111', background: '#fff' }}>
                    Mise aux normes
                  </option>
                  <option value="Autre" style={{ color: '#111', background: '#fff' }}>
                    Autre
                  </option>
                </select>
              </div>

              <div style={{ marginBottom: 'clamp(36px,5vw,52px)' }}>
                <label style={LABEL} htmlFor="ep-message">
                  Message
                </label>
                <textarea
                  id="ep-message"
                  rows={4}
                  style={{
                    ...FIELD,
                    resize: 'none',
                    lineHeight: 1.7,
                  }}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Décrivez votre projet ou vos besoins…"
                  onFocus={(e) =>
                    (e.currentTarget.style.borderBottomColor = C.accent)
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderBottomColor = C.border)
                  }
                />
              </div>

              <div style={{ textAlign: 'center' }}>
                <AmberButton type="submit">Envoyer ma demande</AmberButton>
              </div>
            </form>
          </Reveal>
        )}
      </div>
      <style>{`
        @media (max-width: 900px) {
          .ep-formgrid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   FOOTER
   ══════════════════════════════════════════════════════════════════════════════ */
function Footer() {
  const COLS: { title: string; items: { label: string; href: string }[] }[] = [
    {
      title: 'Services',
      items: [
        { label: 'Installation électrique', href: '#services' },
        { label: 'Tableau électrique', href: '#services' },
        { label: 'Domotique KNX', href: '#services' },
        { label: 'Mise aux normes', href: '#services' },
        { label: 'Bornes IRVE', href: '#services' },
      ],
    },
    {
      title: 'Zone',
      items: [
        { label: 'Paris (75)', href: '#contact' },
        { label: 'Hauts-de-Seine (92)', href: '#contact' },
        { label: 'Yvelines (78)', href: '#contact' },
        { label: 'Essonne (91)', href: '#contact' },
        { label: 'Val-de-Marne (94)', href: '#contact' },
      ],
    },
    {
      title: 'Légal',
      items: [
        { label: 'Mentions légales', href: '#contact' },
        { label: 'Politique de confidentialité', href: '#contact' },
        { label: 'CGV', href: '#contact' },
      ],
    },
  ];

  const foot: React.CSSProperties = {
    background: C.bgCard,
    borderTop: `1px solid ${C.border}`,
    padding:
      'clamp(64px,9vw,110px) clamp(24px,6vw,96px) clamp(32px,4vw,48px)',
  };

  return (
    <footer style={foot}>
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.5fr repeat(3, 1fr)',
          gap: 'clamp(32px,5vw,64px)',
        }}
        className="ep-footgrid"
      >
        {/* Brand column */}
        <div>
          <div
            style={{
              fontFamily: FONT,
              fontWeight: 800,
              fontSize: 20,
              color: C.white,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 20,
            }}
          >
            <Zap size={18} color={C.accent} fill={C.accent} strokeWidth={0} />{fd?.businessName ?? "ÉlectroPro"}</div>
          <p
            style={{
              fontFamily: FONT,
              fontSize: 14,
              lineHeight: 1.72,
              color: C.textMuted,
              maxWidth: 300,
              marginBottom: 22,
            }}
          >
            Électricien qualibat en Île-de-France. Installation, domotique,
            mise aux normes et bornes IRVE depuis 2009.
          </p>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontFamily: FONT,
              fontSize: 12,
              color: C.textFaint,
              letterSpacing: '0.08em',
            }}
          >
            <MapPin size={13} color={C.accent} strokeWidth={1.8} />
            Île-de-France · 75 · 92 · 78 · 91 · 94
          </div>
        </div>

        {/* Nav columns */}
        {COLS.map((col) => (
          <div key={col.title}>
            <div
              style={{
                fontFamily: FONT,
                fontSize: 10,
                letterSpacing: '0.32em',
                textTransform: 'uppercase',
                fontWeight: 700,
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
                  <a
                    href={item.href}
                    style={{
                      fontFamily: FONT,
                      fontSize: 14,
                      color: C.textMuted,
                      textDecoration: 'none',
                      transition: 'color .3s',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = C.white)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = C.textMuted)
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

      {/* Bottom bar */}
      <div
        style={{
          maxWidth: 1280,
          margin: 'clamp(48px,6vw,72px) auto 0',
          paddingTop: 24,
          borderTop: `1px solid ${C.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 14,
          fontFamily: FONT,
          fontSize: 12,
          color: C.textFaint,
          letterSpacing: '0.06em',
        }}
      >
        <span>© 2009–2026 ÉlectroPro — SIRET 000 000 000 00000</span>
        <span style={{ display: 'flex', gap: 22 }}>
          <a href="#contact" style={{ color: C.textFaint, textDecoration: 'none' }}>
            Mentions légales
          </a>
          <a href="#contact" style={{ color: C.textFaint, textDecoration: 'none' }}>
            Confidentialité
          </a>
        </span>
      </div>
      <style>{`
        @media (max-width: 900px) {
          .ep-footgrid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 540px) {
          .ep-footgrid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   PAGE ROOT
   ══════════════════════════════════════════════════════════════════════════════ */

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

  const root: React.CSSProperties = {
    background: C.bg,
    color: C.white,
    fontFamily: FONT,
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
      <style>{`
        ${GFONTS}
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: rgba(245,158,11,0.3); color: #f1f2f4; }
        input::placeholder, textarea::placeholder, select option:first-child {
          color: #56596a;
        }
        body { background: #09090c; }
      `}</style>

      <Nav />
      <Hero />
      <Marquee />
      <WorkSequence />
      <ServiceCards />
      <EditorialRows />
      <TechPanel />
      <Reviews />
      <QuoteForm />
      <Footer />
    </main>
  );
}
