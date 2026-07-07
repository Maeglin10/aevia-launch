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
  Phone,
  MapPin,
  Shield,
  CheckCircle,
  Wrench,
  Clock,
} from 'lucide-react';

/* ════════════════════════════════════════════════════════════════════════════
   THERMOFIX PRO — Plombier-Chauffagiste & Climatisation · Marseille
   Photographie réelle + chorégraphie de défilement éditoriale (urgence pro
   × sérieux technique). Auto-suffisant. 'use client'.
   ════════════════════════════════════════════════════════════════════════════ */

/* ── Google Fonts ─────────────────────────────────────────────────────────── */
const FONTS = `
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <style>@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');</style>
`;

/* ── Palette ─────────────────────────────────────────────────────────────── */
const C = {
  bg: '#f4f6f8',
  bgAlt: '#e8edf4',
  bgDark: '#0a1628',
  bgDarkAlt: '#071020',
  bgCard: '#ffffff',
  accent: '#1a6fc4',
  accentDark: '#1458a0',
  accentLight: '#d6e8f8',
  white: '#ffffff',
  ink: '#0a1628',
  textMuted: '#3a5070',
  textFaint: '#7a90a8',
  border: '#c8d8e8',
  borderDark: 'rgba(26,111,196,0.2)',
  orange: '#e87020',
} as const;

const SERIF = "'DM Serif Display', Georgia, serif" as const;
const SANS = "'Outfit', system-ui, sans-serif" as const;

/* ── Easing partagé ──────────────────────────────────────────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ── Photos Unsplash ─────────────────────────────────────────────────────── */
const PHOTO = {
  plumber:
    'https://images.unsplash.com/photo-1581578485-dea47a32cc3f?q=80&w=2000&auto=format&fit=crop',
  plumberMd:
    'https://images.unsplash.com/photo-1581578485-dea47a32cc3f?q=80&w=800&auto=format&fit=crop',
  heating:
    'https://images.unsplash.com/photo-1585771724684-38269d6639fd?q=80&w=1600&auto=format&fit=crop',
  heatingMd:
    'https://images.unsplash.com/photo-1585771724684-38269d6639fd?q=80&w=800&auto=format&fit=crop',
  ac:
    'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=1600&auto=format&fit=crop',
  acMd:
    'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=900&auto=format&fit=crop',
} as const;

/* ════════════════════════════════════════════════════════════════════════════
   Data & Interfaces
   ════════════════════════════════════════════════════════════════════════════ */

interface Service {
  icon: React.ReactNode;
  title: string;
  desc: string;
  urgency?: boolean;
}

interface Intervention {
  src: string;
  alt: string;
  index: string;
  label: string;
  title: string;
  sub: string;
}

interface EditRow {
  eyebrow: string;
  numeral: string;
  src: string;
  alt: string;
  title: React.ReactNode;
  body: string;
  reverse: boolean;
}

interface TechSpec {
  num: string;
  title: string;
  desc: string;
}

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  stars: number;
}

/* ── Services ────────────────────────────────────────────────────────────── */
const SERVICES: Service[] = [
  {
    icon: <Clock size={22} strokeWidth={1.5} />,
    title: 'Dépannage urgent 24h/7j',
    desc: "Intervention en moins d'une heure sur Marseille et sa métropole. Disponible nuits, week-ends et jours fériés.",
    urgency: true,
  },
  {
    icon: <Wrench size={22} strokeWidth={1.5} />,
    title: 'Installation chauffe-eau',
    desc: "Chauffe-eau électrique, thermodynamique ou solaire. Installation conforme aux normes, garantie main-d'œuvre 2 ans.",
  },
  {
    icon: <CheckCircle size={22} strokeWidth={1.5} />,
    title: 'Chauffage central',
    desc: 'Entretien annuel obligatoire, remplacement de chaudière gaz/fioul, installation de plancher chauffant.',
  },
  {
    icon: <Shield size={22} strokeWidth={1.5} />,
    title: 'Climatisation réversible',
    desc: "Pose et entretien de systèmes mono et multi-split. Certifiés RGE, éligibles aux aides de l'État.",
  },
  {
    icon: <Wrench size={22} strokeWidth={1.5} />,
    title: 'Débouchage canalisations',
    desc: 'Hydrocurage haute pression, inspection caméra, détartrage. Résultat garanti ou intervention offerte.',
  },
  {
    icon: <CheckCircle size={22} strokeWidth={1.5} />,
    title: 'Rénovation salle de bain',
    desc: 'De la plomberie brute au carrelage. Conception, approvisionnement, pose et finitions par une seule équipe.',
  },
];

/* ── Interventions (crossfade) ───────────────────────────────────────────── */
const INTERVENTIONS: Intervention[] = [
  {
    src: PHOTO.plumber,
    alt: 'Intervention plomberie ThermoFix Pro',
    index: 'I',
    label: 'Plomberie',
    title: 'PLOMBERIE',
    sub: 'Fuites, ruptures, rénovation complète de réseaux — diagnostic précis, intervention le jour même.',
  },
  {
    src: PHOTO.heating,
    alt: 'Installation chauffage ThermoFix Pro',
    index: 'II',
    label: 'Chauffage',
    title: 'CHAUFFAGE',
    sub: 'Chaudières gaz et fioul, poêles à granulés, radiateurs — installation, entretien annuel, dépannage.',
  },
  {
    src: PHOTO.ac,
    alt: 'Climatisation réversible ThermoFix Pro',
    index: 'III',
    label: 'Climatisation',
    title: 'CLIMATISATION',
    sub: 'Climatisation réversible, pompes à chaleur — devis gratuit, pose certifiée RGE.',
  },
];

/* ── Lignes éditoriales ──────────────────────────────────────────────────── */
const EDIT_ROWS: EditRow[] = [
  {
    eyebrow: 'Notre engagement',
    numeral: 'I',
    src: PHOTO.plumberMd,
    alt: "Plombier ThermoFix Pro à l'œuvre",
    title: (
      <>
        Urgence /{' '}
        <span style={{ fontStyle: 'italic' }}>résolue.</span>
      </>
    ),
    body: "Disponibles 24h/24 et 7j/7, nos techniciens interviennent en moins d'une heure sur l'ensemble de la métropole marseillaise. Aucune majoration cachée en dehors des heures ouvrables — notre tarif est transparent avant même notre arrivée.",
    reverse: false,
  },
  {
    eyebrow: "Zone d'intervention",
    numeral: 'II',
    src: PHOTO.heatingMd,
    alt: "Zone d'intervention ThermoFix Pro Marseille et alentours",
    title: (
      <>
        Marseille /{' '}
        <span style={{ fontStyle: 'italic' }}>et alentours.</span>
      </>
    ),
    body: "Nous intervenons dans les 16 arrondissements de Marseille, ainsi qu'à Aix-en-Provence, Aubagne, Cassis, et Vitrolles. Une seule équipe, une seule facture, zéro sous-traitance.",
    reverse: true,
  },
];

/* ── Certifications tech ─────────────────────────────────────────────────── */
const TECH_SPECS: TechSpec[] = [
  {
    num: '01',
    title: 'Certifié RGE & QualiPAC',
    desc: "Qualification reconnue par l'État — nos chantiers sont éligibles aux aides MaPrimeRénov' et aux CEE.",
  },
  {
    num: '02',
    title: 'Garantie décennale & RC Pro',
    desc: 'Assurance responsabilité civile professionnelle et garantie décennale complètes sur chaque chantier.',
  },
  {
    num: '03',
    title: 'Devis gratuit en 2h, pose sous 24h',
    desc: 'Réponse écrite sous deux heures, planning confirmé dès la signature, intervention le lendemain au plus tard.',
  },
  {
    num: '04',
    title: "Pièces d'origine, facture transparente",
    desc: 'Uniquement des pièces constructeur garanties. Devis détaillé pièce par pièce — aucune surprise à la réception.',
  },
];

/* ── Témoignages ─────────────────────────────────────────────────────────── */
const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Rupture de canalisation un dimanche soir, eau dans le couloir. Ils ont débarqué en 40 minutes, tout réparé avant minuit. Tarif annoncé à l'avance, respecté à l'euro. Je n'appelle plus que ThermoFix.",
    author: 'Nathalie Ferrero',
    role: 'Propriétaire · 8e arrondissement, Marseille',
    stars: 5,
  },
  {
    quote:
      'Ma chaudière a lâché en plein hiver, restaurant fermé le lendemain impossible. Ils ont commandé la pièce en urgence et remis le chauffage en route le matin même. Professionnalisme irréprochable.',
    author: 'Karim Bouzid',
    role: 'Restaurateur · Cours Julien, Marseille',
    stars: 5,
  },
];

/* ════════════════════════════════════════════════════════════════════════════
   Primitives
   ════════════════════════════════════════════════════════════════════════════ */

/** Étiquette fine, capitales, interlettrage, filet bleu ou orange. */
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
      <span style={{ width: 40, height: 1, background: color, opacity: 0.8, flexShrink: 0 }} />
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
        <span style={{ width: 40, height: 1, background: color, opacity: 0.8, flexShrink: 0 }} />
      )}
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

/** Bouton bleu primaire ou contour, flèche qui glisse au survol. */
function BlueButton({
  children,
  onClick,
  filled = false,
  type = 'button',
  urgent = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  filled?: boolean;
  type?: 'button' | 'submit';
  urgent?: boolean;
}) {
  const [hover, setHover] = useState(false);
  const bg = urgent ? C.orange : filled ? C.accent : 'transparent';
  const bgHover = urgent
    ? '#d0601a'
    : filled
    ? C.accentDark
    : 'rgba(26,111,196,0.10)';
  const col = filled || urgent ? C.white : C.accent;
  const border = urgent ? C.orange : C.accent;

  return (
    <button
      type={type}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 12,
        padding: '15px 30px',
        fontFamily: SANS,
        fontSize: 13,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        fontWeight: 600,
        cursor: 'pointer',
        border: `2px solid ${border}`,
        background: hover ? bgHover : bg,
        color: col,
        transition: 'all .45s cubic-bezier(.16,1,.3,1)',
        transform: hover ? 'translateY(-2px)' : 'none',
        boxShadow: hover
          ? urgent
            ? '0 12px 32px -10px rgba(232,112,32,0.55)'
            : filled
            ? '0 12px 32px -10px rgba(26,111,196,0.45)'
            : 'none'
          : 'none',
      }}
    >
      {children}
      <ArrowRight
        size={15}
        style={{
          transform: hover ? 'translateX(5px)' : 'none',
          transition: 'transform .45s cubic-bezier(.16,1,.3,1)',
        }}
      />
    </button>
  );
}

/** Image avec drift parallaxe interne doux. */
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
        style={{ width: '100%', height: '115%', objectFit: 'cover', y }}
      />
    </div>
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
    { label: 'Urgences', href: '#interventions' },
    { label: 'Services', href: '#services' },
    { label: 'Zone', href: '#zone' },
    { label: 'Devis', href: '#devis' },
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
        padding: solid ? '14px clamp(20px,5vw,64px)' : '22px clamp(20px,5vw,64px)',
        background: solid ? 'rgba(10,22,40,0.95)' : 'transparent',
        backdropFilter: solid ? 'blur(14px) saturate(120%)' : 'none',
        WebkitBackdropFilter: solid ? 'blur(14px) saturate(120%)' : 'none',
        borderBottom: solid ? '1px solid rgba(26,111,196,0.25)' : '1px solid transparent',
        transition: 'all .55s cubic-bezier(.16,1,.3,1)',
      }}
    >
      {/* Brand */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 'clamp(16px, 2vw, 20px)',
          color: C.white,
          letterSpacing: '0.01em',
        }}
      >
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
            <Wrench size={20} color={C.accent} strokeWidth={2} />
            ThermoFix&nbsp;<span style={{ color: C.accent }}>Pro</span>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.accent, display: 'inline-block', marginLeft: 2 }} />
          </>
        )}
      </div>

      {/* Links */}
      <div
        style={{ display: 'flex', alignItems: 'center', gap: 'clamp(16px,2.2vw,36px)' }}
        className="tf-navlinks"
      >
        {links.map((l) => (
          <NavLink key={l.label} label={l.label} href={l.href} />
        ))}
      </div>

      {/* CTA urgent */}
      <div className="tf-navcta">
        <a href={`tel:${fd?.phone ?? "0491000000"}`} style={{ textDecoration: 'none' }}>
          <BlueButton urgent>
            <Phone size={14} strokeWidth={2} /> Appel urgent
          </BlueButton>
        </a>
      </div>

      
        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="tf-burger"
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
          .tf-navlinks { display: none !important; }
          .tf-burger { display: flex !important; flex-direction: column; }
          .tf-navcta { display: none !important; }
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
        fontSize: 12,
        fontWeight: 500,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: h ? C.accent : 'rgba(255,255,255,0.88)',
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
   2 · HERO
   ════════════════════════════════════════════════════════════════════════════ */
function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '14%']);
  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '-40%']);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);

  return (
    <section
      ref={ref}
      style={{
        position: 'relative',
        height: '100vh',
        minHeight: 660,
        overflow: 'hidden',
        background: C.bgDark,
      }}
    >
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
          src={PHOTO.plumber}
          alt="Plombier-chauffagiste ThermoFix Pro en intervention à Marseille"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          priority-fetch="true"
        />
      </motion.div>

      {/* Deux voiles */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(10,22,40,0.55) 0%, rgba(10,22,40,0.10) 35%, rgba(10,22,40,0.50) 65%, rgba(10,22,40,0.92) 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to right, rgba(10,22,40,0.72) 0%, rgba(10,22,40,0.18) 60%, transparent 100%)',
        }}
      />

      {/* Badge urgence top-right */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: EASE, delay: 0.9 }}
        style={{
          position: 'absolute',
          top: 120,
          right: 'clamp(20px,5vw,64px)',
          zIndex: 4,
          background: C.orange,
          color: C.white,
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 'clamp(12px,1.4vw,14px)',
          letterSpacing: '0.08em',
          padding: '12px 22px',
          borderRadius: 100,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          boxShadow: '0 8px 28px -8px rgba(232,112,32,0.7)',
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: C.white,
            display: 'inline-block',
            animation: 'tf-pulse 1.8s ease-in-out infinite',
          }}
        />
        24h/7j — 04 91 XX XX XX
      </motion.div>

      {/* Contenu centré gauche */}
      <motion.div
        style={{
          position: 'relative',
          zIndex: 3,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: 'clamp(80px,10vw,140px) clamp(24px,6vw,96px)',
          y: titleY,
          opacity: titleOpacity,
          maxWidth: 860,
        }}
      >
        <Reveal y={18} delay={0.1}>
          <Eyebrow color="rgba(214,232,248,0.9)">
            Plombier-Chauffagiste · Marseille
          </Eyebrow>
        </Reveal>

        <motion.h1
          initial={{ opacity: 0, y: 44 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.2 }}
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontWeight: 400,
            color: C.white,
            fontSize: 'clamp(3rem,7vw,8.5rem)',
            lineHeight: 0.96,
            letterSpacing: '-0.01em',
            margin: 'clamp(22px,3vw,36px) 0 clamp(18px,2.5vw,28px)',
            textShadow: '0 10px 50px rgba(0,0,0,0.55)',
          }}
        >
          Dépannage /{' '}
          <br />
          en 1h.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.45 }}
          style={{
            fontFamily: SANS,
            fontWeight: 300,
            fontSize: 'clamp(15px,1.7vw,20px)',
            color: 'rgba(255,255,255,0.84)',
            maxWidth: 540,
            lineHeight: 1.65,
            marginBottom: 'clamp(32px,4vw,48px)',
          }}
        >
          Plomberie, chauffage, climatisation — intervention d'urgence en moins
          d'une heure sur Marseille et sa métropole. Devis gratuit avant toute
          action.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.68 }}
          style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}
        >
          <a href={`tel:${fd?.phone ?? "0491000000"}`} style={{ textDecoration: 'none' }}>
            <BlueButton urgent>
              <Phone size={15} strokeWidth={2} /> Appeler maintenant
            </BlueButton>
          </a>
          <a href="#devis" style={{ textDecoration: 'none' }}>
            <BlueButton filled>Devis gratuit</BlueButton>
          </a>
        </motion.div>
      </motion.div>

      {/* Indicateur défilement */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: 36,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 4,
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
            color: 'rgba(255,255,255,0.65)',
          }}
        >
          Découvrir
        </span>
        <motion.div
          animate={{ y: [0, 9, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={20} color={C.accentLight} strokeWidth={1.4} />
        </motion.div>
      </motion.div>

      <style>{`
        @keyframes tf-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.75); }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   3 · INTRO
   ════════════════════════════════════════════════════════════════════════════ */
function Intro() {
  return (
    <section id="hero"
      style={{
        background: C.bgAlt,
        padding: 'clamp(90px,13vw,190px) clamp(24px,8vw,160px)',
        textAlign: 'center',
      }}
    >
      <Reveal>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 30 }}>
          <Eyebrow color={C.accent} align="center">
            ThermoFix Pro — Marseille
          </Eyebrow>
        </div>
      </Reveal>
      <Reveal delay={0.1}>
        <p
          style={{
            fontFamily: SERIF,
            fontSize: 'clamp(26px,3.8vw,52px)',
            lineHeight: 1.3,
            fontWeight: 400,
            maxWidth: 980,
            margin: '0 auto',
            color: C.ink,
          }}
        >
          Votre urgence plomberie ne peut pas attendre.{' '}
          <span style={{ fontStyle: 'italic', color: C.accent }}>
            Nous non plus.
          </span>
        </p>
      </Reveal>
      <Reveal delay={0.2}>
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
   4 · INTERVENTION SEQUENCE (sticky crossfade 320vh)
   ════════════════════════════════════════════════════════════════════════════ */
function InterventionLayer({
  item,
  i,
  total,
  progress,
}: {
  item: Intervention;
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
    i === 0 ? [1, 1, 1, 0] : i === total - 1 ? [0, 1, 1, 1] : [0, 1, 1, 0],
  );
  const scale = useTransform(progress, [start - fadeIn, end], [1.1, 1.0]);

  return (
    <motion.div style={{ position: 'absolute', inset: 0, opacity }}>
      <motion.img
        src={item.src}
        alt={item.alt}
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

function InterventionCaption({
  item,
  i,
  total,
  progress,
}: {
  item: Intervention;
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
        padding: 'clamp(24px,5vw,80px)',
        opacity,
        y,
      }}
    >
      <span
        style={{
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontSize: 'clamp(36px,8vw,110px)',
          color: 'rgba(26,111,196,0.30)',
          lineHeight: 1,
          marginBottom: 6,
        }}
      >
        {item.index}
      </span>
      <h2
        style={{
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 'clamp(32px,5.5vw,76px)',
          color: C.white,
          lineHeight: 1,
          margin: 0,
          letterSpacing: '0.20em',
          textShadow: '0 6px 36px rgba(0,0,0,0.7)',
        }}
      >
        {item.title}
      </h2>
      <p
        style={{
          fontFamily: SANS,
          fontWeight: 300,
          fontSize: 'clamp(15px,1.7vw,20px)',
          color: 'rgba(255,255,255,0.84)',
          marginTop: 20,
          maxWidth: 520,
          lineHeight: 1.65,
        }}
      >
        {item.sub}
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
  const width = useTransform(progress, [i * seg, (i + 1) * seg], [10, 38]);
  return (
    <motion.div
      style={{ height: 2, width, background: C.accent, opacity }}
    />
  );
}

function InterventionSequence() {
  const n = INTERVENTIONS.length;
  const progress = useMotionValue(0.5 / n);
  const [active, setActive] = useState(0);
  const goTo = (i: number) => {
    setActive(i);
    progress.set((i + 0.5) / n);
  };

  return (
    <section
      style={{ height: '100vh', overflow: 'hidden', position: 'relative', background: C.bgDark }}
      id="interventions"
    >
      <div
        style={{
          position: 'relative',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {/* Images crossfade */}
        {INTERVENTIONS.map((item, i) => (
          <InterventionLayer
            key={item.title}
            item={item}
            i={i}
            total={INTERVENTIONS.length}
            progress={progress}
          />
        ))}

        {/* Voile lisibilité */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to bottom, rgba(10,22,40,0.40), rgba(10,22,40,0.12) 40%, rgba(10,22,40,0.60))',
          }}
        />

        {/* Captions */}
        {INTERVENTIONS.map((item, i) => (
          <InterventionCaption
            key={item.title}
            item={item}
            i={i}
            total={INTERVENTIONS.length}
            progress={progress}
          />
        ))}

        {/* Section label top-right */}
        <div
          style={{
            position: 'absolute',
            top: 'clamp(100px,12vh,140px)',
            right: 'clamp(20px,4vw,54px)',
            fontFamily: SANS,
            fontSize: 10,
            letterSpacing: '0.36em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.55)',
            writingMode: 'vertical-rl',
          }}
        >
          Nos domaines d'expertise
        </div>

        {/* Progress dots */}
        <div
          style={{
            position: 'absolute',
            bottom: 42,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 12,
            zIndex: 4,
          }}
        >
          {INTERVENTIONS.map((item, i) => (
            <ProgressDot
              key={item.index}
              i={i}
              total={INTERVENTIONS.length}
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

  return (
    <Reveal delay={i * 0.08} style={{ height: '100%' }}>
      <article
        style={{
          background: C.bgCard,
          border: `1px solid ${hover ? C.accent : C.border}`,
          borderLeft: `3px solid ${service.urgency ? C.orange : C.accent}`,
          padding: 'clamp(26px,3.5vw,40px)',
          height: '100%',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          transition: 'all .45s cubic-bezier(.16,1,.3,1)',
          transform: hover ? 'translateY(-8px)' : 'none',
          boxShadow: hover
            ? '0 28px 64px -32px rgba(26,111,196,0.28)'
            : '0 4px 24px -16px rgba(10,22,40,0.12)',
          cursor: 'default',
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div
          style={{
            color: service.urgency ? C.orange : C.accent,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          {service.icon}
          {service.urgency && (
            <span
              style={{
                fontFamily: SANS,
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: C.orange,
                background: 'rgba(232,112,32,0.10)',
                padding: '4px 10px',
                borderRadius: 100,
              }}
            >
              Urgent
            </span>
          )}
        </div>
        <h3
          style={{
            fontFamily: SERIF,
            fontSize: 'clamp(20px,2.2vw,26px)',
            fontWeight: 400,
            color: C.ink,
            margin: 0,
            lineHeight: 1.15,
          }}
        >
          {service.title}
        </h3>
        <p
          style={{
            fontFamily: SANS,
            fontSize: 'clamp(14px,1.4vw,16px)',
            fontWeight: 300,
            lineHeight: 1.7,
            color: C.textMuted,
            margin: 0,
            flex: 1,
          }}
        >
          {service.desc}
        </p>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontFamily: SANS,
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: hover ? C.accent : C.textFaint,
            transition: 'color .35s',
            marginTop: 8,
          }}
        >
          En savoir plus
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

function ServiceCards() {
  return (
    <section
      style={{
        background: C.bg,
        padding: 'clamp(90px,12vw,170px) clamp(24px,6vw,96px)',
      }}
      id="services"
    >
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ marginBottom: 'clamp(52px,7vw,80px)' }}>
          <Reveal>
            <Eyebrow>Nos prestations</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(34px,5.5vw,70px)',
                fontWeight: 400,
                color: C.ink,
                margin: 'clamp(16px,2.5vw,24px) 0 0',
                lineHeight: 1.06,
              }}
            >
              Tout ce qu'un foyer{' '}
              <span style={{ fontStyle: 'italic', color: C.accent }}>
                peut demander.
              </span>
            </h2>
          </Reveal>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'clamp(20px,2.5vw,32px)',
          }}
        >
          {SERVICES.map((s, i) => (
            <ServiceCard key={s.title} service={s} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   6 · EDITORIAL ROWS
   ════════════════════════════════════════════════════════════════════════════ */
function EditorialRow({ row }: { row: EditRow }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'clamp(36px,6vw,96px)',
        alignItems: 'center',
      }}
      className="tf-editrow"
    >
      {/* Image */}
      <Reveal
        y={48}
        style={{
          overflow: 'hidden',
          aspectRatio: '5 / 6',
          order: row.reverse ? 2 : 1,
          position: 'relative',
        }}
      >
        <ParallaxImg src={row.src} alt={row.alt} />
        {/* Ghost numeral */}
        <div
          style={{
            position: 'absolute',
            bottom: -20,
            right: row.reverse ? 'auto' : -20,
            left: row.reverse ? -20 : 'auto',
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 'clamp(80px,12vw,160px)',
            color: 'rgba(26,111,196,0.10)',
            lineHeight: 1,
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        >
          {row.numeral}
        </div>
      </Reveal>

      {/* Text */}
      <div style={{ order: row.reverse ? 1 : 2 }}>
        <Reveal>
          <Eyebrow>{row.eyebrow}</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h3
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(30px,4.2vw,58px)',
              fontWeight: 400,
              color: C.ink,
              margin: 'clamp(16px,2.2vw,24px) 0 clamp(16px,2vw,22px)',
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
              lineHeight: 1.78,
              color: C.textMuted,
              maxWidth: 460,
              margin: '0 0 clamp(28px,3.5vw,40px)',
            }}
          >
            {row.body}
          </p>
        </Reveal>
        <Reveal delay={0.22}>
          <a href="#devis" style={{ textDecoration: 'none' }}>
            <BlueButton filled>Demander un devis</BlueButton>
          </a>
        </Reveal>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .tf-editrow { grid-template-columns: 1fr !important; }
          .tf-editrow > * { order: initial !important; }
        }
      `}</style>
    </div>
  );
}

function EditorialRows() {
  return (
    <section
      style={{
        background: C.bg,
        padding: 'clamp(80px,11vw,150px) clamp(24px,6vw,96px)',
      }}
      id="zone"
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(80px,11vw,140px)',
        }}
      >
        {EDIT_ROWS.map((row) => (
          <EditorialRow key={row.eyebrow} row={row} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   7 · TECH PANEL (sticky image left, certifs right)
   ════════════════════════════════════════════════════════════════════════════ */
function TechPanel() {
  return (
    <section
      style={{
        background: C.bgDark,
        padding: 'clamp(90px,12vw,170px) clamp(24px,6vw,96px)',
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1.1fr',
          gap: 'clamp(40px,6vw,100px)',
          alignItems: 'start',
        }}
        className="tf-techpanel"
      >
        {/* Image collante */}
        <div
          className="tf-techpanel-sticky"
          style={{ position: 'sticky', top: 100, alignSelf: 'start' }}
        >
          <div
            style={{
              overflow: 'hidden',
              border: `1px solid ${C.borderDark}`,
              aspectRatio: '3 / 4',
            }}
          >
            <img
              src={PHOTO.acMd}
              alt="Technicien certifié ThermoFix Pro"
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
          <div
            style={{
              marginTop: 22,
              padding: '22px 26px',
              background: 'rgba(26,111,196,0.10)',
              borderLeft: `3px solid ${C.accent}`,
            }}
          >
            <div
              style={{
                fontFamily: SANS,
                fontSize: 10,
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: C.accent,
                marginBottom: 8,
              }}
            >
              Notre engagement
            </div>
            <p
              style={{
                fontFamily: SERIF,
                fontStyle: 'italic',
                fontSize: 17,
                color: 'rgba(255,255,255,0.82)',
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              « Certifiés, assurés, transparents — sur chaque chantier à Marseille. »
            </p>
          </div>
        </div>

        {/* Certifications défilantes */}
        <div>
          <Reveal>
            <Eyebrow color={C.accentLight}>Certifications & Garanties</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(32px,4.8vw,64px)',
                fontWeight: 400,
                color: C.white,
                margin: 'clamp(18px,2.5vw,26px) 0 clamp(36px,5vw,56px)',
                lineHeight: 1.06,
              }}
            >
              La confiance,{' '}
              <span style={{ fontStyle: 'italic', color: C.accentLight }}>
                prouvée.
              </span>
            </h2>
          </Reveal>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {TECH_SPECS.map((spec, i) => (
              <Reveal key={spec.num} delay={0.05 * i}>
                <div
                  style={{
                    padding: 'clamp(26px,4vw,40px) 0',
                    borderTop: `1px solid rgba(26,111,196,0.25)`,
                    display: 'flex',
                    gap: 'clamp(20px,3vw,34px)',
                    alignItems: 'flex-start',
                  }}
                >
                  <span
                    style={{
                      fontFamily: SANS,
                      fontWeight: 700,
                      fontSize: 'clamp(22px,2.6vw,34px)',
                      color: C.orange,
                      minWidth: 48,
                      lineHeight: 1,
                      flexShrink: 0,
                    }}
                  >
                    {spec.num}
                  </span>
                  <div>
                    <h4
                      style={{
                        fontFamily: SANS,
                        fontWeight: 600,
                        fontSize: 'clamp(16px,1.8vw,21px)',
                        color: C.white,
                        margin: '0 0 10px',
                        lineHeight: 1.25,
                      }}
                    >
                      {spec.title}
                    </h4>
                    <p
                      style={{
                        fontFamily: SANS,
                        fontWeight: 300,
                        fontSize: 'clamp(14px,1.4vw,16px)',
                        lineHeight: 1.7,
                        color: 'rgba(255,255,255,0.65)',
                        margin: 0,
                      }}
                    >
                      {spec.desc}
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
          .tf-techpanel { grid-template-columns: 1fr !important; }
          .tf-techpanel-sticky { position: static !important; }
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
  return (
    <Reveal delay={i * 0.12} style={{ height: '100%' }}>
      <figure
        style={{
          background: C.bgCard,
          border: `1px solid ${C.border}`,
          padding: 'clamp(32px,4vw,50px)',
          margin: 0,
          height: '100%',
          boxSizing: 'border-box',
          boxShadow: '0 20px 60px -40px rgba(10,22,40,0.20)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Shield icon */}
        <Shield
          size={32}
          color={C.accent}
          strokeWidth={1.4}
          style={{ marginBottom: 20 }}
        />
        {/* Stars */}
        <div
          style={{
            display: 'flex',
            gap: 4,
            marginBottom: 22,
          }}
        >
          {Array.from({ length: t.stars }).map((_, s) => (
            <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill={C.orange}>
              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
            </svg>
          ))}
        </div>
        <blockquote
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 'clamp(17px,1.9vw,22px)',
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
              color: C.accent,
              marginBottom: 4,
            }}
          >
            {t.author}
          </div>
          <div
            style={{
              fontFamily: SANS,
              fontSize: 11,
              fontWeight: 500,
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
  );
}

function Testimonials() {
  return (
    <section id="contact"
      style={{
        background: C.bgAlt,
        padding: 'clamp(90px,12vw,170px) clamp(24px,6vw,96px)',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(52px,7vw,72px)' }}>
          <Reveal>
            <Eyebrow color={C.accent} align="center">
              Avis clients
            </Eyebrow>
          </Reveal>
          <Reveal delay={0.1}>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(34px,5vw,66px)',
                fontWeight: 400,
                color: C.ink,
                margin: 'clamp(16px,2.5vw,24px) 0 0',
                lineHeight: 1.06,
              }}
            >
              Ils nous ont fait{' '}
              <span style={{ fontStyle: 'italic', color: C.accent }}>
                confiance.
              </span>
            </h2>
          </Reveal>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'clamp(28px,4vw,52px)',
          }}
        >
          {TESTIMONIALS.map((t, i) => (
            <TestimonialCard key={t.author} t={t} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   9 · QUOTE FORM
   ════════════════════════════════════════════════════════════════════════════ */
type FormState = {
  prenom: string;
  email: string;
  telephone: string;
  type: string;
  codePostal: string;
  message: string;
};

const FIELD_STYLE: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  background: 'transparent',
  border: 'none',
  borderBottom: '1px solid rgba(26,111,196,0.45)',
  padding: '16px 2px',
  fontFamily: SANS,
  fontWeight: 300,
  fontSize: 17,
  color: C.white,
  outline: 'none',
  transition: 'border-color .35s',
};

const LABEL_STYLE: React.CSSProperties = {
  fontFamily: SANS,
  fontSize: 10.5,
  fontWeight: 500,
  letterSpacing: '0.26em',
  textTransform: 'uppercase',
  color: C.accent,
  display: 'block',
  marginBottom: 4,
};

function QuoteForm() {
  const [form, setForm] = useState<FormState>({
    prenom: '',
    email: '',
    telephone: '',
    type: '',
    codePostal: '',
    message: '',
  });
  const [sent, setSent] = useState(false);

  const set = (k: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.prenom || !form.email || !form.type) return;
    setSent(true);
  };

  const INTERVENTION_TYPES = [
    "Fuite d'eau",
    'Chauffe-eau',
    'Chauffage central',
    'Climatisation',
    'Débouchage',
    'Autre',
  ];

  return (
    <section
      style={{
        background: C.bgDark,
        padding: 'clamp(96px,13vw,180px) clamp(24px,6vw,96px)',
        position: 'relative',
        overflow: 'hidden',
      }}
      id="devis"
    >
      {/* Photo de fond subtile */}
      <img
        src={PHOTO.heating}
        alt="Image de présentation"
        aria-hidden="true"
        loading="lazy"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.06,
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
            Devis gratuit
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(34px,5.5vw,72px)',
              fontWeight: 400,
              color: C.white,
              margin: 'clamp(18px,2.5vw,26px) 0 clamp(12px,1.8vw,18px)',
              lineHeight: 1.04,
            }}
          >
            Décrivez votre{' '}
            <span style={{ fontStyle: 'italic', color: C.accentLight }}>besoin.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <p
            style={{
              fontFamily: SANS,
              fontWeight: 300,
              fontSize: 'clamp(15px,1.6vw,18px)',
              lineHeight: 1.7,
              color: 'rgba(255,255,255,0.72)',
              maxWidth: 520,
              margin: '0 auto clamp(48px,6vw,64px)',
            }}
          >
            Un technicien analyse votre situation et vous rappelle dans l'heure
            avec un devis précis — sans engagement.
          </p>
        </Reveal>

        {sent ? (
          <Reveal>
            <div
              style={{
                border: `1px solid rgba(26,111,196,0.50)`,
                padding: 'clamp(40px,6vw,60px)',
                background: 'rgba(26,111,196,0.08)',
                textAlign: 'center',
              }}
            >
              <CheckCircle
                size={40}
                color={C.accent}
                strokeWidth={1.5}
                style={{ marginBottom: 20 }}
              />
              <h3
                style={{
                  fontFamily: SERIF,
                  fontSize: 'clamp(24px,3vw,34px)',
                  fontWeight: 400,
                  color: C.white,
                  margin: '0 0 14px',
                }}
              >
                Merci{form.prenom ? `, ${form.prenom}` : ''} !
              </h3>
              <p
                style={{
                  fontFamily: SANS,
                  fontWeight: 300,
                  fontSize: 17,
                  color: 'rgba(255,255,255,0.76)',
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                Un technicien vous rappelle dans l'heure au{' '}
                <strong style={{ color: C.accentLight, fontWeight: 600 }}>
                  {form.telephone || form.email}
                </strong>
                .
              </p>
            </div>
          </Reveal>
        ) : (
          <Reveal delay={0.22}>
            <form
              onSubmit={onSubmit}
              style={{ display: 'flex', flexDirection: 'column', gap: 30, textAlign: 'left' }}
            >
              {/* Row 1: Prénom + Email */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }} className="tf-form-row">
                <div>
                  <label style={LABEL_STYLE} htmlFor="tf-prenom">Prénom</label>
                  <input
                    id="tf-prenom"
                    style={FIELD_STYLE}
                    value={form.prenom}
                    onChange={set('prenom')}
                    placeholder="Jean"
                    autoComplete="given-name"
                    required
                  />
                </div>
                <div>
                  <label style={LABEL_STYLE} htmlFor="tf-email">Email</label>
                  <input
                    id="tf-email"
                    style={FIELD_STYLE}
                    type="email"
                    value={form.email}
                    onChange={set('email')}
                    placeholder="jean@exemple.fr"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              {/* Row 2: Téléphone + Code postal */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }} className="tf-form-row">
                <div>
                  <label style={LABEL_STYLE} htmlFor="tf-tel">Téléphone</label>
                  <input
                    id="tf-tel"
                    style={FIELD_STYLE}
                    type="tel"
                    value={form.telephone}
                    onChange={set('telephone')}
                    placeholder="06 XX XX XX XX"
                    autoComplete="tel"
                  />
                </div>
                <div>
                  <label style={LABEL_STYLE} htmlFor="tf-cp">Code postal</label>
                  <input
                    id="tf-cp"
                    style={FIELD_STYLE}
                    value={form.codePostal}
                    onChange={set('codePostal')}
                    placeholder="13001"
                    autoComplete="postal-code"
                  />
                </div>
              </div>

              {/* Type d'intervention */}
              <div>
                <label style={LABEL_STYLE} htmlFor="tf-type">Type d'intervention</label>
                <select
                  id="tf-type"
                  style={{
                    ...FIELD_STYLE,
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    cursor: 'pointer',
                    color: form.type ? C.white : 'rgba(255,255,255,0.42)',
                  }}
                  value={form.type}
                  onChange={set('type')}
                  required
                >
                  <option value="" style={{ color: '#1a2030' }}>
                    Choisir…
                  </option>
                  {INTERVENTION_TYPES.map((t) => (
                    <option key={t} value={t} style={{ color: '#1a2030' }}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div>
                <label style={LABEL_STYLE} htmlFor="tf-msg">Message (optionnel)</label>
                <textarea
                  id="tf-msg"
                  style={{
                    ...FIELD_STYLE,
                    resize: 'vertical',
                    minHeight: 100,
                    borderBottom: 'none',
                    border: '1px solid rgba(26,111,196,0.35)',
                    padding: 16,
                  }}
                  value={form.message}
                  onChange={set('message')}
                  placeholder="Décrivez brièvement votre problème…"
                  rows={4}
                />
              </div>

              {/* Submit */}
              <div style={{ textAlign: 'center', marginTop: 8 }}>
                <button
                  type="submit"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '17px 38px',
                    fontFamily: SANS,
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: C.white,
                    background: C.accent,
                    border: `2px solid ${C.accent}`,
                    cursor: 'pointer',
                    transition: 'all .4s',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = C.accentDark;
                    (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 12px 32px -10px rgba(26,111,196,0.55)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = C.accent;
                    (e.currentTarget as HTMLButtonElement).style.transform = 'none';
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
                  }}
                >
                  <Phone size={15} strokeWidth={2} /> Envoyer ma demande
                </button>
              </div>
            </form>
          </Reveal>
        )}
      </div>

      <style>{`
        @media (max-width: 860px) {
          .tf-form-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   10 · FOOTER
   ════════════════════════════════════════════════════════════════════════════ */
function Footer() {
  const cols = [
    {
      title: 'Services',
      items: [
        { label: 'Dépannage urgent 24h/7j', href: '#services' },
        { label: 'Installation chauffe-eau', href: '#services' },
        { label: 'Chauffage central', href: '#services' },
        { label: 'Climatisation réversible', href: '#services' },
        { label: 'Débouchage', href: '#services' },
      ],
    },
    {
      title: "Zone d'action",
      items: [
        { label: 'Marseille (1er–16e)', href: '#zone' },
        { label: 'Aix-en-Provence', href: '#zone' },
        { label: 'Aubagne', href: '#zone' },
        { label: 'Cassis', href: '#zone' },
        { label: 'Vitrolles', href: '#zone' },
      ],
    },
    {
      title: 'Urgences & Contact',
      items: [
        { label: '04 91 XX XX XX', href: 'tel:0491000000' },
        { label: 'Devis en ligne', href: '#devis' },
        { label: 'Interventions 24h/7j', href: '#interventions' },
        { label: 'Certifications RGE', href: "/templates/impact-246" },
        { label: 'contact@thermofix-pro.fr', href: 'mailto:contact@thermofix-pro.fr' },
      ],
    },
  ];

  return (
    <footer
      style={{
        background: C.bgDarkAlt,
        borderTop: '1px solid rgba(26,111,196,0.18)',
        padding: 'clamp(70px,9vw,110px) clamp(24px,6vw,96px) 40px',
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.4fr repeat(3, 1fr)',
          gap: 'clamp(32px,5vw,64px)',
        }}
        className="tf-footgrid"
      >
        {/* Brand col */}
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: 22,
              color: C.white,
            }}
          >
            <Wrench size={20} color={C.accent} strokeWidth={2} />
            ThermoFix&nbsp;<span style={{ color: C.accent }}>Pro</span>
          </div>
          <p
            style={{
              fontFamily: SANS,
              fontWeight: 300,
              fontSize: 15,
              lineHeight: 1.7,
              color: 'rgba(255,255,255,0.60)',
              marginTop: 20,
              maxWidth: 320,
            }}
          >
            Plombier-Chauffagiste & Climatisation à Marseille. Intervention
            d'urgence 24h/7j, certifié RGE, devis gratuit.
          </p>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginTop: 22,
              fontFamily: SANS,
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.55)',
            }}
          >
            <MapPin size={13} color={C.accent} strokeWidth={1.5} />
            Marseille, Bouches-du-Rhône
          </div>

          {/* Orange urgent CTA */}
          <div style={{ marginTop: 28 }}>
            <a
              href={`tel:${fd?.phone ?? "0491000000"}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                padding: '13px 22px',
                background: C.orange,
                color: C.white,
                fontFamily: SANS,
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                borderRadius: 4,
                boxShadow: '0 8px 28px -8px rgba(232,112,32,0.6)',
                transition: 'all .35s',
              }}
            >
              <Phone size={14} strokeWidth={2} />
              04 91 XX XX XX
            </a>
          </div>
        </div>

        {/* Navigation cols */}
        {cols.map((col) => (
          <div key={col.title}>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 10.5,
                fontWeight: 600,
                letterSpacing: '0.26em',
                textTransform: 'uppercase',
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
                gap: 13,
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
                      color: 'rgba(255,255,255,0.66)',
                      textDecoration: 'none',
                      transition: 'color .3s',
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLAnchorElement).style.color = C.white)
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLAnchorElement).style.color =
                        'rgba(255,255,255,0.66)')
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
          margin: 'clamp(52px,7vw,72px) auto 0',
          paddingTop: 26,
          borderTop: '1px solid rgba(26,111,196,0.14)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 14,
          fontFamily: SANS,
          fontSize: 11,
          fontWeight: 300,
          letterSpacing: '0.10em',
          color: 'rgba(255,255,255,0.42)',
        }}
      >
        <span>© 2026 ThermoFix Pro · Marseille · SIRET 000 000 000 00000</span>
        <span style={{ display: 'flex', gap: 22 }}>
          <a href="#tf-msg" style={{ color: 'inherit', textDecoration: 'none' }}>
            Mentions légales
          </a>
          <a href="#tf-msg" style={{ color: 'inherit', textDecoration: 'none' }}>
            Politique de confidentialité
          </a>
        </span>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .tf-footgrid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 560px) {
          .tf-footgrid { grid-template-columns: 1fr !important; }
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
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        /* Prevent iOS input zoom */
        input, select, textarea { font-size: 16px !important; }
        @media (min-width: 561px) {
          input, select, textarea { font-size: inherit !important; }
        }

        /* Responsive utilities */
        @media (max-width: 860px) {
          .tf-navlinks { display: none !important; }
          .tf-navcta { display: none !important; }
          .tf-editrow { grid-template-columns: 1fr !important; }
          .tf-editrow > * { order: initial !important; }
          .tf-techpanel { grid-template-columns: 1fr !important; }
          .tf-techpanel-sticky { position: static !important; }
          .tf-form-row { grid-template-columns: 1fr !important; }
          .tf-footgrid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 560px) {
          .tf-footgrid { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <main
        suppressHydrationWarning
        style={{
          background: C.bgDark,
          color: C.white,
          fontFamily: SANS,
          overflowX: 'hidden',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        }}
      >
        <Nav />
        <Hero />
        <Intro />
        <InterventionSequence />
        <ServiceCards />
        <EditorialRows />
        <TechPanel />
        <Testimonials />
        <QuoteForm />
        <Footer />
      </main>
    </>
  );
}
