"use client";
// @ts-nocheck

import React, {useRef, useState, useEffect} from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useMotionValue,
} from 'framer-motion';
import {
  ArrowRight,
  ChevronDown,
  Droplets,
  Wind,
  Sun,
  Star,
  Phone,
  MapPin,
  CheckCircle,
  Award,
  Leaf,
  Euro,
  Wrench,
  ClipboardList,
  CalendarCheck,
  Shield,
  Zap,
} from 'lucide-react';

/* ════════════════════════════════════════════════════════════════════════════
   EAU & HABITAT BRETAGNE — Plombier-chauffagiste Rennes & agglo
   Template premium autonome. 'use client'. Framer Motion + Lucide React.
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
  forest: '#2d5a3d',
  forestDeep: '#1e3d29',
  forestMid: '#3d7252',
  forestLight: '#4a8a64',
  white: '#ffffff',
  offWhite: '#f7faf8',
  lightGray: '#f0f4f2',
  slate: '#5b7fa6',
  slateDark: '#3d5a7a',
  slateLight: '#7a9cbf',
  wood: '#8b6941',
  woodLight: '#a68252',
  ink: '#1a2820',
  inkLight: '#2d3f35',
  textMuted: '#6b7c72',
};

/* ── Typographie ─────────────────────────────────────────────────────────── */
const SERIF = "'Raleway', system-ui, sans-serif" as const;
const SANS = "'Mulish', system-ui, sans-serif" as const;

/* ── Photos Unsplash ─────────────────────────────────────────────────────── */
const PHOTO = {
  bathroom:
    'https://images.unsplash.com/photo-1585771724684-38269d6639fd?q=80&w=1600&auto=format&fit=crop',
  pac:
    'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?q=80&w=1600&auto=format&fit=crop',
  artisan:
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1600&auto=format&fit=crop',
  solar:
    'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=1600&auto=format&fit=crop',
} as const;

/* ── Easing partagé ──────────────────────────────────────────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ════════════════════════════════════════════════════════════════════════════
   Primitives utilitaires
   ════════════════════════════════════════════════════════════════════════════ */

/** Étiquette en capitales avec filet vert. */
function Eyebrow({
  children,
  color = C.forestMid,
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
    gap: 12,
    justifyContent: align === 'center' ? 'center' : 'flex-start',
  };
  const rule: React.CSSProperties = {
    width: 40,
    height: 1.5,
    background: color,
    opacity: light ? 0.55 : 0.75,
  };
  const label: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 11,
    letterSpacing: '0.38em',
    textTransform: 'uppercase',
    color: light ? 'rgba(255,255,255,0.75)' : color,
    fontWeight: 700,
  };
  return (
    <div style={wrap}>
      <span style={rule} />
      <span style={label}>{children}</span>
      {align === 'center' && <span style={rule} />}
    </div>
  );
}

/** Animation d'entrée au scroll — fondu + translation Y, déclenchée une fois. */
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

/** Bouton vert forêt avec flèche animée au survol. */
function ForestButton({
  children,
  onClick,
  filled = false,
  type = 'button',
  light = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  filled?: boolean;
  type?: 'button' | 'submit';
  light?: boolean;
}) {
  const [hover, setHover] = useState(false);
  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 11,
    padding: '15px 30px',
    fontFamily: SANS,
    fontSize: 12,
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    fontWeight: 700,
    cursor: 'pointer',
    border: light
      ? '1.5px solid rgba(255,255,255,0.7)'
      : `1.5px solid ${C.forest}`,
    background: filled
      ? C.forest
      : light
      ? 'rgba(255,255,255,0.08)'
      : 'transparent',
    color: filled ? C.white : light ? C.white : C.forest,
    transition: 'all .45s cubic-bezier(.16,1,.3,1)',
    borderRadius: 2,
    transform: hover ? 'translateY(-2px)' : 'none',
    boxShadow: hover && filled ? '0 8px 32px rgba(45,90,61,0.32)' : 'none',
  };
  const hoverStyles: React.CSSProperties = hover
    ? filled
      ? { background: C.forestMid }
      : light
      ? { background: 'rgba(255,255,255,0.14)' }
      : { background: 'rgba(45,90,61,0.07)' }
    : {};
  return (
    <button
      type={type}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ ...base, ...hoverStyles }}
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
   1 · HERO SECTION
   ════════════════════════════════════════════════════════════════════════════ */
function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: progress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const imgScale = useTransform(progress, [0, 1], [1, 1.1]);
  const imgY = useTransform(progress, [0, 1], ['0%', '12%']);
  const titleY = useTransform(progress, [0, 1], ['0%', '-40%']);
  const titleOpacity = useTransform(progress, [0, 0.72], [1, 0]);
  const cueOpacity = useTransform(progress, [0, 0.2], [1, 0]);

  return (
    <section
      id="hero"
      ref={ref}
      style={{
        position: 'relative',
        height: '100vh',
        minHeight: 660,
        overflow: 'hidden',
        background: C.forestDeep,
      }}
    >
      {/* Photo plein cadre — salle de bain épurée */}
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
          src={PHOTO.bathroom}
          alt="Salle de bain rénovée par Eau & Habitat Bretagne"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </motion.div>

      {/* Voile dégradé vert forêt */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(30,61,41,0.50) 0%, rgba(30,61,41,0.12) 35%, rgba(30,61,41,0.48) 68%, rgba(30,61,41,0.92) 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(110% 70% at 50% 30%, transparent 42%, rgba(29,58,40,0.52) 100%)',
          mixBlendMode: 'multiply',
        }}
      />

      {/* Contenu Hero */}
      <motion.div
        style={{
          position: 'relative',
          zIndex: 2,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '0 clamp(20px,6vw,80px)',
          y: titleY,
          opacity: titleOpacity,
        }}
      >
        {/* Badge RGE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, ease: EASE, delay: 0.05 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(45,90,61,0.55)',
            border: '1px solid rgba(255,255,255,0.28)',
            borderRadius: 40,
            padding: '7px 18px',
            marginBottom: 28,
            backdropFilter: 'blur(8px)',
          }}
        >
          <Award size={13} color="rgba(255,255,255,0.85)" strokeWidth={2} />
          <span
            style={{
              fontFamily: SANS,
              fontSize: 11,
              letterSpacing: '0.30em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.85)',
              fontWeight: 700,
            }}
          >
            Artisan RGE certifié · Rennes &amp; Ille-et-Vilaine
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 44 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.18 }}
          style={{
            fontFamily: SERIF,
            fontWeight: 700,
            color: C.white,
            fontSize: 'clamp(44px, 8vw, 120px)',
            lineHeight: 1.0,
            letterSpacing: '-0.02em',
            margin: '0 0 22px',
            textShadow: '0 10px 50px rgba(0,0,0,0.45)',
            maxWidth: 900,
          }}
        >
          Votre confort,{' '}
          <span
            style={{
              fontStyle: 'italic',
              color: 'rgba(255,255,255,0.72)',
              fontWeight: 400,
            }}
          >
            notre expertise
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.42 }}
          style={{
            fontFamily: SANS,
            fontSize: 'clamp(16px, 1.8vw, 21px)',
            color: 'rgba(255,255,255,0.82)',
            maxWidth: 600,
            lineHeight: 1.65,
            fontWeight: 400,
            marginBottom: 42,
          }}
        >
          Plomberie, sanitaires, pompes à chaleur air-eau et chauffe-eau solaires —
          installation, rénovation &amp; entretien à Rennes Thabor et toute l'agglo.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.68 }}
          style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <a href="#devis" style={{ textDecoration: 'none' }}>
            <ForestButton filled>Devis sous 24h</ForestButton>
          </a>
          <a href={`tel:${fd?.phone ?? "+33299000000"}`} style={{ textDecoration: 'none' }}>
            <ForestButton light>
              <Phone size={14} />
              Appeler maintenant
            </ForestButton>
          </a>
        </motion.div>

        {/* Indicateurs de confiance */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.0, ease: EASE, delay: 1.1 }}
          style={{
            display: 'flex',
            gap: 'clamp(16px,3vw,40px)',
            marginTop: 48,
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {[
            { value: '12+', label: 'ans d\'expérience' },
            { value: '850+', label: 'chantiers réalisés' },
            { value: '4,9★', label: 'note Google' },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                textAlign: 'center',
                borderLeft: '1px solid rgba(255,255,255,0.22)',
                paddingLeft: 'clamp(16px,2vw,30px)',
              }}
            >
              <div
                style={{
                  fontFamily: SERIF,
                  fontSize: 'clamp(26px,3.5vw,38px)',
                  fontWeight: 700,
                  color: C.white,
                  lineHeight: 1,
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontFamily: SANS,
                  fontSize: 11,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.62)',
                  marginTop: 6,
                  fontWeight: 600,
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Indicateur scroll */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: 32,
          left: '50%',
          transform: 'translateX(-50%)',
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
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.62)',
            fontWeight: 600,
          }}
        >
          Découvrir
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={19} color="rgba(255,255,255,0.62)" strokeWidth={1.5} />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   2 · SCROLL CROSSFADE — 320vh sticky, 3 visuels
   ════════════════════════════════════════════════════════════════════════════ */
function ScrollCrossfade() {
  const n = 3;
  const progress = useMotionValue(0.5 / n);
  const [active, setActive] = useState(0);
  const goTo = (i: number) => {
    setActive(i);
    progress.set((i + 0.5) / n);
  };

  // Opacités des 3 photos (entrée/sortie smooth)
  const op0 = useTransform(progress, [0, 0.2, 0.38, 0.5], [1, 1, 0, 0]);
  const op1 = useTransform(progress, [0.3, 0.48, 0.64, 0.75], [0, 1, 1, 0]);
  const op2 = useTransform(progress, [0.62, 0.78, 1, 1], [0, 1, 1, 1]);

  // Textes superposés
  const textOp0 = useTransform(progress, [0, 0.16, 0.36, 0.44], [1, 1, 0, 0]);
  const textOp1 = useTransform(progress, [0.34, 0.50, 0.62, 0.70], [0, 1, 1, 0]);
  const textOp2 = useTransform(progress, [0.62, 0.76, 1, 1], [0, 1, 1, 1]);

  // ProgressDots
  const dot0 = useTransform(progress, [0, 0.38], [1, 0.3]);
  const dot1 = useTransform(progress, [0.3, 0.5, 0.72], [0.3, 1, 0.3]);
  const dot2 = useTransform(progress, [0.62, 0.78], [0.3, 1]);

  const panels = [
    {
      photo: PHOTO.pac,
      alt: 'Installation pompe à chaleur air-eau',
      eyebrow: 'Pompe à chaleur',
      title: "Jusqu'à -70% sur votre facture de chauffage",
      text:
        "Installation et mise en service de PAC air-eau certifiées QualiPAC. Dimensionnement sur mesure, aides MaPrimeRénov' déduites d'emblée.",
      op: op0,
      textOp: textOp0,
    },
    {
      photo: PHOTO.bathroom,
      alt: 'Salle de bain rénovée clé en main',
      eyebrow: 'Salle de bain',
      title: 'Rénovation complète clé en main',
      text:
        'Démolition, plomberie, carrelage, pose de sanitaires — un interlocuteur unique, un chantier propre, un résultat impeccable.',
      op: op1,
      textOp: textOp1,
    },
    {
      photo: PHOTO.solar,
      alt: 'Panneaux solaires thermiques pour chauffe-eau',
      eyebrow: 'Solaire thermique',
      title: "L'énergie du soleil pour votre eau chaude",
      text:
        'Chauffe-eau solaires individuels certifiés QualiSol. Production couvrant 60 à 80% de vos besoins en eau chaude sanitaire.',
      op: op2,
      textOp: textOp2,
    },
  ];

  return (
    <div style={{ height: '100vh', overflow: 'hidden', position: 'relative' }}>
      <div
        style={{
          position: 'relative',
          height: '100%',
          overflow: 'hidden',
          background: C.forestDeep,
        }}
      >
        {/* Photos superposées en crossfade */}
        {panels.map((p, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: p.op,
            }}
          >
            <img
              src={p.photo}
              alt={p.alt}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {/* Voile sombre */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(to right, rgba(30,61,41,0.75) 0%, rgba(30,61,41,0.30) 55%, rgba(30,61,41,0.12) 100%)',
              }}
            />
          </motion.div>
        ))}

        {/* Textes crossfadés */}
        {panels.map((p, i) => (
          <motion.div
            key={`text-${i}`}
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: 'clamp(32px,6vw,96px)',
              maxWidth: 680,
              opacity: p.textOp,
            }}
          >
            <Eyebrow light align="left">
              {p.eyebrow}
            </Eyebrow>
            <h2
              style={{
                fontFamily: SERIF,
                fontWeight: 700,
                fontSize: 'clamp(32px,5.5vw,72px)',
                color: C.white,
                lineHeight: 1.1,
                margin: '24px 0 20px',
                textShadow: '0 6px 32px rgba(0,0,0,0.35)',
              }}
            >
              {p.title}
            </h2>
            <p
              style={{
                fontFamily: SANS,
                fontSize: 'clamp(15px,1.5vw,19px)',
                color: 'rgba(255,255,255,0.82)',
                lineHeight: 1.7,
                maxWidth: 480,
              }}
            >
              {p.text}
            </p>
          </motion.div>
        ))}

        {/* Progress Dots */}
        <div
          style={{
            position: 'absolute',
            bottom: 36,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 10,
            zIndex: 4,
          }}
        >
          {[dot0, dot1, dot2].map((d, i) => (
            <motion.div
              key={i}
              style={{
                width: i === 0 ? 28 : 8,
                height: 8,
                borderRadius: 4,
                background: C.white,
                opacity: d,
              }}
            />
          ))}
        </div>

        {/* Numéro de slide */}
        <div
          style={{
            position: 'absolute',
            bottom: 36,
            right: 'clamp(24px,4vw,64px)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span
            style={{
              fontFamily: SANS,
              fontSize: 11,
              letterSpacing: '0.22em',
              color: 'rgba(255,255,255,0.55)',
              textTransform: 'uppercase',
              fontWeight: 600,
            }}
          >
            Nos spécialités
          </span>
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
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   3 · SERVICES SECTION — 3 spécialités
   ════════════════════════════════════════════════════════════════════════════ */
function ServicesSection() {
  const services = [
    {
      Icon: Droplets,
      title: 'Plomberie & sanitaire',
      description:
        'Installation, rénovation et dépannage toute urgence. Salle de bain clé en main, remplacement de chaudière, détection de fuite, mise aux normes.',
      points: [
        'Dépannage sous 2h en urgence',
        'Rénovation salle de bain complète',
        'Remplacement chaudière gaz',
        'Détection de fuite non destructive',
      ],
      color: C.slate,
    },
    {
      Icon: Wind,
      title: 'Pompes à chaleur',
      description:
        'Conception et pose de PAC air-eau haute performance. Dimensionnement thermique précis, raccordements hydrauliques et électriques, mise en service et suivi.',
      points: [
        'Audit énergétique préalable gratuit',
        'PAC air-eau toutes marques',
        'Certification QualiPAC',
        "Dossier MaPrimeRénov' inclus",
      ],
      color: C.forest,
    },
    {
      Icon: Sun,
      title: 'Chauffe-eau solaires',
      description:
        "Chauffe-eau solaires individuels (CESI) et systèmes solaires combinés (SSC). Installation optimisée selon l'exposition de votre toiture.",
      points: [
        "60 à 80% d'eau chaude gratuite",
        'Certification QualiSol',
        'Aide CEE et TVA 5,5%',
        'Garantie décennale',
      ],
      color: C.wood,
    },
  ];

  return (
    <section
      id="services"
      style={{
        background: C.offWhite,
        padding: 'clamp(80px,12vw,160px) clamp(20px,6vw,80px)',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Reveal>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <Eyebrow align="center">Nos spécialités</Eyebrow>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontWeight: 700,
              fontSize: 'clamp(32px,5vw,62px)',
              color: C.ink,
              textAlign: 'center',
              lineHeight: 1.12,
              margin: '0 0 14px',
            }}
          >
            Un seul artisan,
            <br />
            <span style={{ color: C.forest }}>toute la filière eau & énergie</span>
          </h2>
        </Reveal>
        <Reveal delay={0.14}>
          <p
            style={{
              fontFamily: SANS,
              fontSize: 'clamp(15px,1.4vw,18px)',
              color: C.textMuted,
              textAlign: 'center',
              maxWidth: 560,
              margin: '0 auto 64px',
              lineHeight: 1.7,
            }}
          >
            Plombier-chauffagiste qualifié RGE, nous couvrons l'ensemble des besoins
            en eau chaude et en chauffage des logements et locaux professionnels
            de Rennes et de l'Ille-et-Vilaine.
          </p>
        </Reveal>

        <div
          className="r290-services-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 28,
          }}
        >
          {services.map((s, i) => (
            <ServiceCard key={i} {...s} delay={i * 0.1} />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .r290-services-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

function ServiceCard({
  Icon,
  title,
  description,
  points,
  color,
  delay,
}: {
  Icon: React.ElementType;
  title: string;
  description: string;
  points: string[];
  color: string;
  delay: number;
}) {
  const [hover, setHover] = useState(false);
  return (
    <Reveal delay={delay}>
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          background: C.white,
          border: `1px solid ${hover ? color : 'rgba(45,90,61,0.10)'}`,
          borderRadius: 8,
          padding: 'clamp(28px,3.5vw,44px)',
          transition: 'all .45s cubic-bezier(.16,1,.3,1)',
          transform: hover ? 'translateY(-6px)' : 'none',
          boxShadow: hover
            ? `0 20px 60px rgba(0,0,0,0.10), 0 0 0 1px ${color}22`
            : '0 2px 16px rgba(0,0,0,0.04)',
          cursor: 'default',
        }}
      >
        <div
          style={{
            width: 54,
            height: 54,
            borderRadius: 12,
            background: `${color}14`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 24,
            transition: 'background .35s',
          }}
        >
          <Icon size={26} color={color} strokeWidth={1.7} />
        </div>
        <h3
          style={{
            fontFamily: SERIF,
            fontWeight: 700,
            fontSize: 22,
            color: C.ink,
            margin: '0 0 14px',
            lineHeight: 1.2,
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontFamily: SANS,
            fontSize: 14.5,
            color: C.textMuted,
            lineHeight: 1.7,
            margin: '0 0 24px',
          }}
        >
          {description}
        </p>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {points.map((pt) => (
            <li
              key={pt}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                fontFamily: SANS,
                fontSize: 13.5,
                color: C.inkLight,
                fontWeight: 600,
                marginBottom: 9,
              }}
            >
              <CheckCircle size={14} color={color} strokeWidth={2.2} />
              {pt}
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   4 · PROCESS SECTION — sticky photo artisan + 4 étapes au scroll
   ════════════════════════════════════════════════════════════════════════════ */
function ProcessSection() {
  const steps = [
    {
      Icon: ClipboardList,
      num: '01',
      title: 'Diagnostic énergétique',
      text:
        'Visite sur site gratuite. Évaluation thermique de votre logement, étude de vos besoins et mesure de la performance actuelle. Rapport détaillé remis sous 48h.',
    },
    {
      Icon: Euro,
      num: '02',
      title: 'Devis aides déduites',
      text:
        "Devis transparent avec MaPrimeRénov', CEE et TVA réduite déduites d'emblée. Vous ne payez que le reste à charge réel — aucune avance sur aides à faire.",
    },
    {
      Icon: Wrench,
      num: '03',
      title: 'Pose certifiée RGE',
      text:
        "Installation par nos techniciens certifiés. Chantier propre, respectueux de votre habitat. Mise en service complète et formation à l'utilisation.",
    },
    {
      Icon: CalendarCheck,
      num: '04',
      title: 'Entretien annuel',
      text:
        'Contrat de maintenance annuel inclus la première année. Contrôle performances, nettoyage, réglages — pour garantir votre confort et votre garantie constructeur.',
    },
  ];

  return (
    <section
      id="processus"
      style={{
        background: C.white,
        padding: 'clamp(80px,12vw,160px) clamp(20px,6vw,80px)',
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Reveal>
          <Eyebrow align="left">Notre méthode</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontWeight: 700,
              fontSize: 'clamp(30px,4.5vw,56px)',
              color: C.ink,
              margin: '18px 0 60px',
              lineHeight: 1.12,
              maxWidth: 560,
            }}
          >
            De l'audit à la mise en service — sans surprise
          </h2>
        </Reveal>

        <div
          className="r290-process-layout"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'clamp(40px,5vw,80px)',
            alignItems: 'start',
          }}
        >
          {/* Photo sticky */}
          <div className="r290-process-photo" style={{ position: 'sticky', top: 96 }}>
            <Reveal>
              <div
                style={{
                  borderRadius: 10,
                  overflow: 'hidden',
                  aspectRatio: '4/5',
                  position: 'relative',
                }}
              >
                <img
                  src={PHOTO.artisan}
                  alt="Technicien Eau & Habitat Bretagne en intervention"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {/* Badge flottant */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 28,
                    left: 28,
                    background: C.forest,
                    borderRadius: 8,
                    padding: '16px 22px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                  }}
                >
                  <span
                    style={{
                      fontFamily: SERIF,
                      fontSize: 28,
                      fontWeight: 700,
                      color: C.white,
                      lineHeight: 1,
                    }}
                  >
                    12+
                  </span>
                  <span
                    style={{
                      fontFamily: SANS,
                      fontSize: 11,
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      color: 'rgba(255,255,255,0.72)',
                      fontWeight: 600,
                    }}
                  >
                    ans d'expérience
                  </span>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Étapes */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
            {steps.map((s, i) => (
              <ProcessStep key={i} {...s} delay={i * 0.08} />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .r290-process-layout { grid-template-columns: 1fr !important; }
          .r290-process-photo { position: static !important; }
        }
      `}</style>
    </section>
  );
}

function ProcessStep({
  Icon,
  num,
  title,
  text,
  delay,
}: {
  Icon: React.ElementType;
  num: string;
  title: string;
  text: string;
  delay: number;
}) {
  return (
    <Reveal delay={delay}>
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        <div style={{ flexShrink: 0 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              background: C.offWhite,
              border: `1px solid rgba(45,90,61,0.14)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <Icon size={24} color={C.forest} strokeWidth={1.7} />
            <span
              style={{
                position: 'absolute',
                top: -8,
                right: -8,
                fontFamily: SANS,
                fontSize: 10,
                fontWeight: 800,
                color: C.white,
                background: C.forest,
                borderRadius: 20,
                padding: '2px 7px',
                letterSpacing: '0.05em',
              }}
            >
              {num}
            </span>
          </div>
        </div>
        <div>
          <h3
            style={{
              fontFamily: SERIF,
              fontWeight: 700,
              fontSize: 20,
              color: C.ink,
              margin: '0 0 10px',
              lineHeight: 1.2,
            }}
          >
            {title}
          </h3>
          <p
            style={{
              fontFamily: SANS,
              fontSize: 14.5,
              color: C.textMuted,
              lineHeight: 1.72,
              margin: 0,
            }}
          >
            {text}
          </p>
        </div>
      </div>
    </Reveal>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   5 · TESTIMONIALS SECTION
   ════════════════════════════════════════════════════════════════════════════ */
function TestimonialsSection() {
  const reviews = [
    {
      name: 'Bertrand M.',
      location: 'Rennes Thabor',
      service: 'Installation PAC air-eau',
      stars: 5,
      text:
        "Installation parfaite de notre pompe à chaleur en février dernier. L'équipe a géré le dossier MaPrimeRénov' de A à Z. Résultat : notre facture de chauffage a été divisée par trois dès le premier hiver. Un professionnalisme exemplaire.",
      savings: '-68% sur la facture de chauffage',
    },
    {
      name: 'Sandrine & Loïc K.',
      location: 'Cesson-Sévigné',
      service: 'Rénovation salle de bain',
      stars: 5,
      text:
        "Rénovation complète de notre salle de bain en deux semaines chrono, comme promis. Chantier propre, devis respecté à l'euro près, finitions soignées. On recommande sans hésiter — toute la famille est ravie du résultat.",
      savings: 'Chantier livré dans les délais',
    },
    {
      name: 'Martine L.',
      location: 'Rennes Sud',
      service: 'Chauffe-eau solaire',
      stars: 5,
      text:
        "Chauffe-eau solaire posé en novembre. Malgré la météo bretonne, 70% de notre eau chaude est produite gratuitement depuis l'installation. Très satisfaite du suivi et de la qualité des explications de l'équipe.",
      savings: "70% d'eau chaude gratuite",
    },
  ];

  return (
    <section
      id="avis"
      style={{
        background: C.forestDeep,
        padding: 'clamp(80px,12vw,160px) clamp(20px,6vw,80px)',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Reveal>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <Eyebrow light align="center">
              Témoignages clients
            </Eyebrow>
          </div>
        </Reveal>
        <Reveal delay={0.07}>
          <h2
            style={{
              fontFamily: SERIF,
              fontWeight: 700,
              fontSize: 'clamp(30px,4.5vw,56px)',
              color: C.white,
              textAlign: 'center',
              margin: '0 0 14px',
              lineHeight: 1.12,
            }}
          >
            Ce que disent nos clients
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p
            style={{
              fontFamily: SANS,
              fontSize: 16,
              color: 'rgba(255,255,255,0.58)',
              textAlign: 'center',
              maxWidth: 480,
              margin: '0 auto 64px',
              lineHeight: 1.7,
            }}
          >
            4,9/5 sur Google · 850+ chantiers en Ille-et-Vilaine
          </p>
        </Reveal>

        <div
          className="r290-testimonials-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 24,
          }}
        >
          {reviews.map((r, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  borderRadius: 10,
                  padding: 'clamp(24px,3vw,38px)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 20,
                }}
              >
                {/* Étoiles */}
                <div style={{ display: 'flex', gap: 4 }}>
                  {Array.from({ length: r.stars }).map((_, si) => (
                    <Star
                      key={si}
                      size={14}
                      fill={C.wood}
                      color={C.wood}
                      strokeWidth={0}
                    />
                  ))}
                </div>

                {/* Texte */}
                <p
                  style={{
                    fontFamily: SANS,
                    fontSize: 14.5,
                    color: 'rgba(255,255,255,0.80)',
                    lineHeight: 1.72,
                    fontStyle: 'italic',
                    margin: 0,
                    flexGrow: 1,
                  }}
                >
                  « {r.text} »
                </p>

                {/* Badge économies */}
                <div
                  style={{
                    background: `${C.forestMid}40`,
                    border: `1px solid ${C.forestMid}60`,
                    borderRadius: 6,
                    padding: '8px 14px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <Leaf size={12} color={C.forestLight} strokeWidth={2} />
                  <span
                    style={{
                      fontFamily: SANS,
                      fontSize: 12,
                      color: C.forestLight,
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                    }}
                  >
                    {r.savings}
                  </span>
                </div>

                {/* Auteur */}
                <div>
                  <div
                    style={{
                      fontFamily: SANS,
                      fontWeight: 700,
                      fontSize: 14,
                      color: C.white,
                    }}
                  >
                    {r.name}
                  </div>
                  <div
                    style={{
                      fontFamily: SANS,
                      fontSize: 12,
                      color: 'rgba(255,255,255,0.45)',
                      marginTop: 3,
                    }}
                  >
                    {r.location} · {r.service}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .r290-testimonials-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   6 · DEVIS FORM SECTION
   ════════════════════════════════════════════════════════════════════════════ */
function DevisFormSection() {
  const [form, setForm] = useState({
    prenom: '',
    nom: '',
    logement: '',
    travaux: '',
    telephone: '',
  });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
    setSent(true);
  };

  const inputStyle = (name: string): React.CSSProperties => ({
    width: '100%',
    padding: '15px 18px',
    fontFamily: SANS,
    fontSize: 15,
    color: C.ink,
    background: focused === name ? C.white : C.offWhite,
    border: `1.5px solid ${focused === name ? C.forest : 'rgba(45,90,61,0.18)'}`,
    borderRadius: 6,
    outline: 'none',
    transition: 'all .3s',
    boxSizing: 'border-box',
    boxShadow: focused === name ? `0 0 0 3px ${C.forest}18` : 'none',
    appearance: 'none',
  });

  const labelStyle: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: C.inkLight,
    marginBottom: 7,
    display: 'block',
  };

  if (sent) {
    return (
      <section
        id="devis"
        style={{
          background: C.offWhite,
          padding: 'clamp(80px,12vw,160px) clamp(20px,6vw,80px)',
        }}
      >
        <div
          style={{
            maxWidth: 600,
            margin: '0 auto',
            textAlign: 'center',
          }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: C.forest,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 32px',
              }}
            >
              <CheckCircle size={38} color={C.white} strokeWidth={2} />
            </div>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: 36,
                fontWeight: 700,
                color: C.ink,
                margin: '0 0 16px',
              }}
            >
              Demande bien reçue !
            </h2>
            <p
              style={{
                fontFamily: SANS,
                fontSize: 17,
                color: C.textMuted,
                lineHeight: 1.7,
                margin: '0 0 32px',
              }}
            >
              Bonjour {form.prenom}, votre demande de devis a été transmise à notre
              équipe. Nous vous rappelons sous 24h pour convenir d'une visite
              diagnostic gratuite.
            </p>
            <div
              style={{
                background: C.white,
                border: `1px solid rgba(45,90,61,0.16)`,
                borderRadius: 10,
                padding: '20px 28px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <Phone size={18} color={C.forest} />
              <div style={{ textAlign: 'left' }}>
                <div
                  style={{
                    fontFamily: SANS,
                    fontSize: 12,
                    color: C.textMuted,
                    fontWeight: 600,
                    letterSpacing: '0.10em',
                    textTransform: 'uppercase',
                  }}
                >
                  Besoin urgent ?
                </div>
                <div
                  style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 700, color: C.ink }}
                >
                  02 99 00 00 00
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="devis"
      style={{
        background: C.offWhite,
        padding: 'clamp(80px,12vw,160px) clamp(20px,6vw,80px)',
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div
          className="r290-devis-layout"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.35fr',
            gap: 'clamp(40px,6vw,96px)',
            alignItems: 'start',
          }}
        >
          {/* Colonne gauche — argumentaire */}
          <div>
            <Reveal>
              <Eyebrow>Devis gratuit</Eyebrow>
            </Reveal>
            <Reveal delay={0.07}>
              <h2
                style={{
                  fontFamily: SERIF,
                  fontWeight: 700,
                  fontSize: 'clamp(28px,4vw,50px)',
                  color: C.ink,
                  margin: '18px 0 20px',
                  lineHeight: 1.14,
                }}
              >
                Réponse sous 24h,
                <br />
                <span style={{ color: C.forest }}>visite offerte</span>
              </h2>
            </Reveal>
            <Reveal delay={0.13}>
              <p
                style={{
                  fontFamily: SANS,
                  fontSize: 16,
                  color: C.textMuted,
                  lineHeight: 1.72,
                  margin: '0 0 36px',
                }}
              >
                Remplissez le formulaire ci-contre. Notre technicien vous rappelle
                pour planifier la visite diagnostic à votre domicile —
                entièrement gratuite et sans engagement.
              </p>
            </Reveal>

            {/* Points forts */}
            <Reveal delay={0.18}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { Icon: CheckCircle, text: 'Devis détaillé aides incluses' },
                  { Icon: Shield, text: 'Artisan assuré décennale' },
                  { Icon: Award, text: 'Certifié RGE QualiPAC & QualiSol' },
                  { Icon: Zap, text: 'Urgences traitées sous 2h' },
                ].map((pt) => (
                  <div
                    key={pt.text}
                    style={{ display: 'flex', alignItems: 'center', gap: 12 }}
                  >
                    <pt.Icon size={16} color={C.forest} strokeWidth={2} />
                    <span
                      style={{
                        fontFamily: SANS,
                        fontSize: 14.5,
                        color: C.inkLight,
                        fontWeight: 600,
                      }}
                    >
                      {pt.text}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Formulaire */}
          <Reveal delay={0.1}>
            <form
              onSubmit={handleSubmit}
              style={{
                background: C.white,
                border: '1px solid rgba(45,90,61,0.12)',
                borderRadius: 12,
                padding: 'clamp(28px,4vw,48px)',
                boxShadow: '0 4px 32px rgba(0,0,0,0.06)',
              }}
            >
              {/* Ligne Prénom + Nom */}
              <div
                className="r290-form-row"
                style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}
              >
                <div>
                  <label style={labelStyle} htmlFor="prenom">
                    Prénom
                  </label>
                  <input
                    id="prenom"
                    name="prenom"
                    type="text"
                    required
                    placeholder="Marie"
                    value={form.prenom}
                    onChange={handleChange}
                    onFocus={() => setFocused('prenom')}
                    onBlur={() => setFocused(null)}
                    style={inputStyle('prenom')}
                  />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="nom">
                    Nom
                  </label>
                  <input
                    id="nom"
                    name="nom"
                    type="text"
                    required
                    placeholder="Dupont"
                    value={form.nom}
                    onChange={handleChange}
                    onFocus={() => setFocused('nom')}
                    onBlur={() => setFocused(null)}
                    style={inputStyle('nom')}
                  />
                </div>
              </div>

              {/* Type logement */}
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle} htmlFor="logement">
                  Type de logement
                </label>
                <div style={{ position: 'relative' }}>
                  <select
                    id="logement"
                    name="logement"
                    required
                    value={form.logement}
                    onChange={handleChange}
                    onFocus={() => setFocused('logement')}
                    onBlur={() => setFocused(null)}
                    style={{ ...inputStyle('logement'), paddingRight: 42 }}
                  >
                    <option value="">Sélectionner…</option>
                    <option value="maison">Maison individuelle</option>
                    <option value="appartement">Appartement</option>
                    <option value="local_pro">Local professionnel</option>
                  </select>
                  <ChevronDown
                    size={16}
                    color={C.textMuted}
                    style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                  />
                </div>
              </div>

              {/* Type travaux */}
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle} htmlFor="travaux">
                  Type de travaux
                </label>
                <div style={{ position: 'relative' }}>
                  <select
                    id="travaux"
                    name="travaux"
                    required
                    value={form.travaux}
                    onChange={handleChange}
                    onFocus={() => setFocused('travaux')}
                    onBlur={() => setFocused(null)}
                    style={{ ...inputStyle('travaux'), paddingRight: 42 }}
                  >
                    <option value="">Sélectionner…</option>
                    <option value="pac">Pompe à chaleur (PAC air-eau)</option>
                    <option value="plomberie">Plomberie & sanitaires</option>
                    <option value="solaire">Chauffe-eau solaire</option>
                    <option value="urgence">Urgence plomberie</option>
                  </select>
                  <ChevronDown
                    size={16}
                    color={C.textMuted}
                    style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                  />
                </div>
              </div>

              {/* Téléphone */}
              <div style={{ marginBottom: 32 }}>
                <label style={labelStyle} htmlFor="telephone">
                  Téléphone
                </label>
                <input
                  id="telephone"
                  name="telephone"
                  type="tel"
                  required
                  placeholder="06 12 34 56 78"
                  value={form.telephone}
                  onChange={handleChange}
                  onFocus={() => setFocused('telephone')}
                  onBlur={() => setFocused(null)}
                  style={inputStyle('telephone')}
                />
              </div>

              {/* Bouton envoi */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '17px 32px',
                  fontFamily: SANS,
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: '0.20em',
                  textTransform: 'uppercase',
                  color: C.white,
                  background: loading ? C.forestMid : C.forest,
                  border: 'none',
                  borderRadius: 6,
                  cursor: loading ? 'wait' : 'pointer',
                  transition: 'all .35s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                }}
              >
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        border: '2px solid rgba(255,255,255,0.3)',
                        borderTopColor: C.white,
                      }}
                    />
                    Envoi en cours…
                  </>
                ) : (
                  <>
                    Demander mon devis gratuit
                    <ArrowRight size={15} />
                  </>
                )}
              </button>

              <p
                style={{
                  fontFamily: SANS,
                  fontSize: 12,
                  color: C.textMuted,
                  textAlign: 'center',
                  margin: '16px 0 0',
                  lineHeight: 1.6,
                }}
              >
                Aucun engagement · Réponse sous 24h · Données confidentielles
              </p>
            </form>
          </Reveal>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .r290-devis-layout { grid-template-columns: 1fr !important; }
          .r290-form-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   7 · AIDES FINANCIÈRES SECTION
   ════════════════════════════════════════════════════════════════════════════ */
function AidesSection() {
  const aides = [
    {
      label: "MaPrimeRénov'",
      montant: "Jusqu'à 11 000€",
      description:
        "Aide de l'État pour le remplacement de votre système de chauffage par une PAC ou un chauffe-eau solaire. Cumulable avec d'autres aides.",
      color: C.forest,
    },
    {
      label: 'CEE',
      montant: "Jusqu'à 4 000€",
      description:
        "Certificats d'Économie d'Énergie versés par les fournisseurs d'énergie. Accordés automatiquement pour les travaux réalisés par un artisan RGE.",
      color: C.slate,
    },
    {
      label: 'TVA 5,5%',
      montant: 'Au lieu de 20%',
      description:
        'Taux réduit applicable à tous les travaux de rénovation énergétique dans les logements de plus de 2 ans. Déduit directement sur notre facture.',
      color: C.wood,
    },
    {
      label: 'Éco-PTZ',
      montant: "Jusqu'à 30 000€",
      description:
        "Prêt à taux zéro pour financer vos travaux d'économies d'énergie sans avance de trésorerie. Remboursement sur 15 ans sans intérêts.",
      color: C.forestMid,
    },
    {
      label: 'ANAH',
      montant: "Jusqu'à 50% du coût",
      description:
        "Programme MaPrimeAdapt' pour les ménages modestes et très modestes. Peut couvrir jusqu'à 70% des travaux sous conditions de ressources.",
      color: C.slateDark,
    },
  ];

  return (
    <section
      id="aides"
      style={{
        background: C.white,
        padding: 'clamp(80px,12vw,160px) clamp(20px,6vw,80px)',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Reveal>
          <Eyebrow align="center">Aides &amp; financements</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontWeight: 700,
              fontSize: 'clamp(30px,4.5vw,56px)',
              color: C.ink,
              textAlign: 'center',
              margin: '16px 0 16px',
              lineHeight: 1.12,
            }}
          >
            Réduisez votre reste à charge
            <br />
            <span style={{ color: C.forest }}>jusqu'à 70%</span>
          </h2>
        </Reveal>
        <Reveal delay={0.13}>
          <p
            style={{
              fontFamily: SANS,
              fontSize: 16,
              color: C.textMuted,
              textAlign: 'center',
              maxWidth: 540,
              margin: '0 auto 60px',
              lineHeight: 1.7,
            }}
          >
            Nous montons tous vos dossiers d'aides et les déduisons directement du
            devis — vous ne payez que le reste à charge réel, sans avance.
          </p>
        </Reveal>

        <div
          className="r290-aides-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 20,
          }}
        >
          {aides.map((a, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div
                style={{
                  border: `1.5px solid ${a.color}28`,
                  borderRadius: 10,
                  padding: '28px 26px',
                  position: 'relative',
                  overflow: 'hidden',
                  background: `linear-gradient(135deg, ${a.color}06 0%, transparent 60%)`,
                }}
              >
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '5px 12px',
                    borderRadius: 20,
                    background: `${a.color}14`,
                    border: `1px solid ${a.color}28`,
                    marginBottom: 14,
                  }}
                >
                  <span
                    style={{
                      fontFamily: SANS,
                      fontSize: 11,
                      fontWeight: 800,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: a.color,
                    }}
                  >
                    {a.label}
                  </span>
                </div>
                <div
                  style={{
                    fontFamily: SERIF,
                    fontSize: 26,
                    fontWeight: 700,
                    color: a.color,
                    margin: '0 0 12px',
                    lineHeight: 1.1,
                  }}
                >
                  {a.montant}
                </div>
                <p
                  style={{
                    fontFamily: SANS,
                    fontSize: 13.5,
                    color: C.textMuted,
                    lineHeight: 1.68,
                    margin: 0,
                  }}
                >
                  {a.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* CTA en dessous */}
        <Reveal delay={0.2}>
          <div
            style={{
              marginTop: 52,
              padding: 'clamp(28px,4vw,44px)',
              background: C.offWhite,
              border: '1px solid rgba(45,90,61,0.12)',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 24,
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: SERIF,
                  fontSize: 22,
                  fontWeight: 700,
                  color: C.ink,
                  marginBottom: 8,
                }}
              >
                Simulez vos aides en 5 minutes
              </div>
              <p
                style={{
                  fontFamily: SANS,
                  fontSize: 14.5,
                  color: C.textMuted,
                  margin: 0,
                  lineHeight: 1.65,
                }}
              >
                Notre technicien calcule précisément vos droits lors de la visite
                diagnostic gratuite.
              </p>
            </div>
            <a href="#devis" style={{ textDecoration: 'none' }}>
              <ForestButton filled>Obtenir mon estimation</ForestButton>
            </a>
          </div>
        </Reveal>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .r290-aides-grid { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 861px) and (max-width: 1080px) {
          .r290-aides-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   8 · ÉCOLOGIE SECTION
   ════════════════════════════════════════════════════════════════════════════ */
function EcologieSection() {
  const engagements = [
    {
      Icon: Leaf,
      title: 'Matériaux durables',
      text:
        'Sélection rigoureuse de fabricants engagés : systèmes labellisés, durée de vie garantie 20 ans minimum, filières locales favorisées.',
    },
    {
      Icon: Zap,
      title: "Économies d'énergie",
      text:
        'Chaque installation est dimensionnée pour maximiser les économies réelles — nous ne vendons pas de la puissance, nous vendons de la performance.',
    },
    {
      Icon: Wind,
      title: 'Bilan carbone optimisé',
      text:
        "Remplacement des chaudières fioul et gaz par des solutions électriques basse température : -70% d'émissions de CO₂ pour votre logement.",
    },
    {
      Icon: Shield,
      title: 'Label RGE actif',
      text:
        "Notre certification Reconnu Garant de l'Environnement est renouvelée chaque année. Gage de qualité et condition d'accès à toutes les aides.",
    },
  ];

  return (
    <section
      id="ecologie"
      style={{
        background: C.forest,
        padding: 'clamp(80px,12vw,160px) clamp(20px,6vw,80px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Cercle décoratif */}
      <div
        style={{
          position: 'absolute',
          top: -160,
          right: -160,
          width: 520,
          height: 520,
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.08)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -200,
          left: -80,
          width: 460,
          height: 460,
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.06)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div
          className="r290-eco-layout"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'clamp(48px,6vw,96px)',
            alignItems: 'center',
          }}
        >
          {/* Colonne gauche — texte */}
          <div>
            <Reveal>
              <Eyebrow light>Engagement écologique</Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              <h2
                style={{
                  fontFamily: SERIF,
                  fontWeight: 700,
                  fontSize: 'clamp(30px,4.5vw,56px)',
                  color: C.white,
                  margin: '20px 0 20px',
                  lineHeight: 1.12,
                }}
              >
                Artisan vert,
                <br />
                résultats durables
              </h2>
            </Reveal>
            <Reveal delay={0.14}>
              <p
                style={{
                  fontFamily: SANS,
                  fontSize: 16,
                  color: 'rgba(255,255,255,0.72)',
                  lineHeight: 1.72,
                  margin: '0 0 36px',
                }}
              >
                Nous croyons que la transition énergétique commence chez soi.
                Chaque PAC installée, chaque chauffe-eau solaire posé, c'est une
                facture qui baisse et une tonne de CO₂ en moins pour la Bretagne.
              </p>
            </Reveal>

            {/* Chiffre impact */}
            <Reveal delay={0.18}>
              <div
                style={{
                  display: 'flex',
                  gap: 32,
                  flexWrap: 'wrap',
                }}
              >
                {[
                  { v: '850+', l: 'Installations\nréalisées' },
                  { v: '1 200t', l: 'CO₂ évitées\npar an' },
                  { v: '62%', l: 'Économies\nmoyennes' },
                ].map((st) => (
                  <div key={st.l}>
                    <div
                      style={{
                        fontFamily: SERIF,
                        fontSize: 36,
                        fontWeight: 700,
                        color: C.white,
                        lineHeight: 1,
                      }}
                    >
                      {st.v}
                    </div>
                    <div
                      style={{
                        fontFamily: SANS,
                        fontSize: 12,
                        color: 'rgba(255,255,255,0.58)',
                        marginTop: 6,
                        fontWeight: 600,
                        letterSpacing: '0.10em',
                        textTransform: 'uppercase',
                        whiteSpace: 'pre-line',
                      }}
                    >
                      {st.l}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Colonne droite — 4 engagements */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 20,
            }}
          >
            {engagements.map((e, i) => (
              <Reveal key={i} delay={i * 0.09}>
                <div
                  style={{
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 10,
                    padding: '24px 22px',
                  }}
                >
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 10,
                      background: 'rgba(255,255,255,0.10)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 16,
                    }}
                  >
                    <e.Icon size={20} color={C.white} strokeWidth={1.7} />
                  </div>
                  <h4
                    style={{
                      fontFamily: SANS,
                      fontWeight: 700,
                      fontSize: 14.5,
                      color: C.white,
                      margin: '0 0 10px',
                      lineHeight: 1.3,
                    }}
                  >
                    {e.title}
                  </h4>
                  <p
                    style={{
                      fontFamily: SANS,
                      fontSize: 13,
                      color: 'rgba(255,255,255,0.65)',
                      lineHeight: 1.65,
                      margin: 0,
                    }}
                  >
                    {e.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .r290-eco-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   9 · CERTIFICATIONS SECTION
   ════════════════════════════════════════════════════════════════════════════ */
function CertifSection() {
  const certifs = [
    {
      label: 'QualiPAC',
      sublabel: 'Pompes à chaleur',
      Icon: Wind,
      color: C.slate,
      description: "Qualification pour l'installation et la maintenance des pompes à chaleur air-eau et géothermiques.",
    },
    {
      label: 'QualiSol',
      sublabel: 'Solaire thermique',
      Icon: Sun,
      color: C.wood,
      description: 'Certification pour la pose de chauffe-eau solaires individuels et de systèmes solaires combinés.',
    },
    {
      label: 'RGE',
      sublabel: "Reconnu Garant\nde l'Env.",
      Icon: Leaf,
      color: C.forest,
      description: "Label national qui conditionne l'accès de vos travaux aux aides de l'État (MaPrimeRénov', CEE…).",
    },
    {
      label: 'Qualibat',
      sublabel: 'Plomberie & CVC',
      Icon: Droplets,
      color: C.forestMid,
      description: "Qualification professionnelle couvrant l'ensemble des travaux de plomberie et chauffage-ventilation.",
    },
    {
      label: 'Décennale',
      sublabel: 'Assurance 10 ans',
      Icon: Shield,
      color: C.slateDark,
      description: 'Assurance responsabilité décennale couvrant tous nos chantiers pendant 10 ans après réception des travaux.',
    },
  ];

  return (
    <section
      id="certifications"
      style={{
        background: C.offWhite,
        padding: 'clamp(80px,12vw,160px) clamp(20px,6vw,80px)',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Reveal>
          <Eyebrow align="center">Certifications &amp; qualifications</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontWeight: 700,
              fontSize: 'clamp(28px,4vw,52px)',
              color: C.ink,
              textAlign: 'center',
              margin: '16px 0 14px',
              lineHeight: 1.13,
            }}
          >
            Qualifié, certifié, assuré
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p
            style={{
              fontFamily: SANS,
              fontSize: 16,
              color: C.textMuted,
              textAlign: 'center',
              maxWidth: 520,
              margin: '0 auto 64px',
              lineHeight: 1.7,
            }}
          >
            Nos certifications ne sont pas des badges décoratifs : elles conditionnent
            légalement votre droit aux aides d'État et garantissent la qualité
            de chaque intervention.
          </p>
        </Reveal>

        <div
          className="r290-certif-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: 16,
          }}
        >
          {certifs.map((c, i) => (
            <Reveal key={i} delay={i * 0.07}>
              <CertifBadge {...c} />
            </Reveal>
          ))}
        </div>

        {/* Bande de réassurance */}
        <Reveal delay={0.25}>
          <div
            style={{
              marginTop: 56,
              display: 'flex',
              justifyContent: 'center',
              gap: 'clamp(24px,4vw,56px)',
              flexWrap: 'wrap',
              padding: '32px clamp(20px,4vw,56px)',
              background: C.white,
              border: '1px solid rgba(45,90,61,0.10)',
              borderRadius: 12,
            }}
          >
            {[
              { v: 'Depuis 2012', l: 'Certifié RGE en continu' },
              { v: '100%', l: 'Chantiers assurés décennale' },
              { v: '0€', l: 'Frais de dossier aides' },
            ].map((r) => (
              <div key={r.l} style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontFamily: SERIF,
                    fontSize: 28,
                    fontWeight: 700,
                    color: C.forest,
                    lineHeight: 1,
                  }}
                >
                  {r.v}
                </div>
                <div
                  style={{
                    fontFamily: SANS,
                    fontSize: 12,
                    color: C.textMuted,
                    marginTop: 6,
                    fontWeight: 600,
                    letterSpacing: '0.10em',
                    textTransform: 'uppercase',
                  }}
                >
                  {r.l}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .r290-certif-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .r290-certif-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

function CertifBadge({
  label,
  sublabel,
  Icon,
  color,
  description,
}: {
  label: string;
  sublabel: string;
  Icon: React.ElementType;
  color: string;
  description: string;
}) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: C.white,
        border: `1.5px solid ${hover ? color : 'rgba(45,90,61,0.10)'}`,
        borderRadius: 10,
        padding: '28px 20px',
        textAlign: 'center',
        transition: 'all .4s cubic-bezier(.16,1,.3,1)',
        transform: hover ? 'translateY(-5px)' : 'none',
        boxShadow: hover ? `0 16px 48px ${color}18` : '0 2px 12px rgba(0,0,0,0.04)',
        cursor: 'default',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Fond coloré léger au survol */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `${color}06`,
          opacity: hover ? 1 : 0,
          transition: 'opacity .4s',
        }}
      />
      <div
        style={{
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: `${color}14`,
            border: `2px solid ${color}28`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            transition: 'all .4s',
          }}
        >
          <Icon size={24} color={color} strokeWidth={1.7} />
        </div>
        <div
          style={{
            fontFamily: SERIF,
            fontSize: 18,
            fontWeight: 700,
            color: C.ink,
            lineHeight: 1.1,
            marginBottom: 6,
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontFamily: SANS,
            fontSize: 11,
            color: color,
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: 14,
            whiteSpace: 'pre-line',
          }}
        >
          {sublabel}
        </div>
        <p
          style={{
            fontFamily: SANS,
            fontSize: 12.5,
            color: C.textMuted,
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          {description}
        </p>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   10 · FOOTER SECTION
   ════════════════════════════════════════════════════════════════════════════ */
function FooterSection() {
  const zones = [
    'Rennes (Thabor, Villejean, Beaulieu)',
    'Cesson-Sévigné',
    'Saint-Grégoire',
    'Bruz',
    'Pacé',
    'Betton',
    'Chartres-de-Bretagne',
    'Acigné',
    "Toute l'Ille-et-Vilaine",
  ];

  const links = [
    { label: 'Plomberie & sanitaires', href: '#services' },
    { label: 'Pompes à chaleur', href: '#services' },
    { label: 'Chauffe-eau solaires', href: '#services' },
    { label: 'Aides financières', href: '#aides' },
    { label: 'Certifications RGE', href: '#certifications' },
    { label: 'Devis gratuit', href: '#devis' },
  ];

  return (
    <footer
      style={{
        background: C.ink,
        padding: 'clamp(64px,10vw,120px) clamp(20px,6vw,80px) 0',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div
          className="r290-footer-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1.6fr 1fr 1fr',
            gap: 'clamp(40px,6vw,80px)',
            paddingBottom: 64,
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {/* Colonne identité */}
          <div>
            {/* Logo texte */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: 22,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: C.forest,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Droplets size={22} color={C.white} strokeWidth={1.8} />
              </div>
              <div>
                <div
                  style={{
                    fontFamily: SERIF,
                    fontWeight: 700,
                    fontSize: 18,
                    color: C.white,
                    lineHeight: 1.15,
                    letterSpacing: '-0.01em',
                  }}
                >
                  Eau &amp; Habitat
                </div>
                <div
                  style={{
                    fontFamily: SANS,
                    fontSize: 11,
                    color: 'rgba(255,255,255,0.48)',
                    letterSpacing: '0.20em',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                  }}
                >
                  Bretagne
                </div>
              </div>
            </div>

            <p
              style={{
                fontFamily: SANS,
                fontSize: 14.5,
                color: 'rgba(255,255,255,0.55)',
                lineHeight: 1.72,
                margin: '0 0 28px',
                maxWidth: 320,
              }}
            >
              Plombier-chauffagiste certifié RGE à Rennes depuis 2012.
              Plomberie, pompes à chaleur, chauffe-eau solaires —
              installation, rénovation et entretien à Rennes Thabor
              et dans toute l'Ille-et-Vilaine.
            </p>

            {/* Contact */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <a
                href={`tel:${fd?.phone ?? "+33299000000"}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  textDecoration: 'none',
                }}
              >
                <Phone size={14} color={C.forestLight} strokeWidth={2} />
                <span
                  style={{
                    fontFamily: SANS,
                    fontSize: 14.5,
                    color: 'rgba(255,255,255,0.72)',
                    fontWeight: 600,
                  }}
                >
                  02 99 00 00 00
                </span>
              </a>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <MapPin size={14} color={C.forestLight} strokeWidth={2} style={{ marginTop: 2 }} />
                <span
                  style={{
                    fontFamily: SANS,
                    fontSize: 14,
                    color: 'rgba(255,255,255,0.55)',
                    lineHeight: 1.55,
                  }}
                >
                  12 allée des Artisans,
                  <br />
                  35000 Rennes
                </span>
              </div>
            </div>

            {/* Badges certif */}
            <div
              style={{
                display: 'flex',
                gap: 10,
                marginTop: 28,
                flexWrap: 'wrap',
              }}
            >
              {['RGE', 'QualiPAC', 'QualiSol', 'Décennale'].map((b) => (
                <span
                  key={b}
                  style={{
                    fontFamily: SANS,
                    fontSize: 10.5,
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: C.forestLight,
                    border: `1px solid ${C.forestLight}40`,
                    borderRadius: 20,
                    padding: '4px 11px',
                  }}
                >
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* Colonne services */}
          <div>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.38)',
                marginBottom: 22,
              }}
            >
              Services
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {links.map((l) => (
                <FooterLink key={l.label} {...l} />
              ))}
            </ul>
          </div>

          {/* Colonne zones d'intervention */}
          <div>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.38)',
                marginBottom: 22,
              }}
            >
              Zones d'intervention
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {zones.map((z) => (
                <li
                  key={z}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontFamily: SANS,
                    fontSize: 13.5,
                    color: 'rgba(255,255,255,0.52)',
                    marginBottom: 10,
                    lineHeight: 1.4,
                  }}
                >
                  <MapPin size={11} color={C.forestMid} strokeWidth={2} />
                  {z}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bas de footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16,
            padding: '24px 0 28px',
          }}
        >
          <span
            style={{
              fontFamily: SANS,
              fontSize: 12.5,
              color: 'rgba(255,255,255,0.30)',
            }}
          >
            © 2024 Eau &amp; Habitat Bretagne · SIRET 000 000 000 00000 ·
            Artisan RGE · Assurance décennale souscrite
          </span>
          <div style={{ display: 'flex', gap: 24 }}>
            {['Mentions légales', 'Politique de confidentialité', 'CGV'].map(
              (m) => (
                <a
                  key={m}
                  href="#"
                  style={{
                    fontFamily: SANS,
                    fontSize: 12,
                    color: 'rgba(255,255,255,0.32)',
                    textDecoration: 'none',
                    transition: 'color .3s',
                  }}
                >
                  {m}
                </a>
              )
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .r290-footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}

function FooterLink({ label, href }: { label: string; href: string }) {
  const [h, setH] = useState(false);
  return (
    <li style={{ marginBottom: 12 }}>
      <a
        href={href}
        onMouseEnter={() => setH(true)}
        onMouseLeave={() => setH(false)}
        style={{
          fontFamily: SANS,
          fontSize: 14,
          color: h ? C.white : 'rgba(255,255,255,0.52)',
          textDecoration: 'none',
          transition: 'color .3s',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontWeight: h ? 600 : 400,
        }}
      >
        <span
          style={{
            width: h ? 18 : 8,
            height: 1,
            background: h ? C.forestLight : 'rgba(255,255,255,0.22)',
            transition: 'all .35s cubic-bezier(.16,1,.3,1)',
            flexShrink: 0,
          }}
        />
        {label}
      </a>
    </li>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   ROOT PAGE — Impact290Page
   ════════════════════════════════════════════════════════════════════════════ */

// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
function Impact290Page() {
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
    C = { ...C, forest: brand, forestLight: shadeColor(brand, 25) };
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
    <main id="hero" style={{ fontFamily: SANS, background: C.white }}>
      {/* Fonts Google (chargement via style tag pour autonomie totale) */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Mulish:ital,wght@0,300;0,400;0,600;0,700;0,800;1,400&family=Raleway:ital,wght@0,400;0,600;0,700;0,800;1,400;1,700&display=swap');

        *, *::before, *::after { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { margin: 0; padding: 0; }
        button { cursor: pointer; }
        input, select, textarea { font-family: inherit; }

        /* Scrollbar discrète */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(45,90,61,0.28); border-radius: 3px; }

        /* Responsive global */
        @media (max-width: 860px) {
          .r290-navlinks { display: none !important; }
          .r290-burger { display: flex !important; flex-direction: column; }
          .r290-navcta { display: none !important; }
        }
      `}</style>

      {/* Navigation */}
      <Nav290 />

      {/* Sections */}
      <HeroSection />
      <ScrollCrossfade />
      <ServicesSection />
      <ProcessSection />
      <TestimonialsSection />
      <DevisFormSection />
      <AidesSection />
      <EcologieSection />
      <CertifSection />
      <FooterSection />
    </main>
  );
}

/* ── Navigation interne ───────────────────────────────────────────────────── */
function Nav290() {
  const [solid, setSolid] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  React.useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: 'Services', href: '#services' },
    { label: 'Notre méthode', href: '#processus' },
    { label: 'Avis clients', href: '#avis' },
    { label: 'Aides', href: '#aides' },
    { label: 'Certifications', href: '#certifications' },
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
    padding: solid ? '14px clamp(20px,5vw,64px)' : '22px clamp(20px,5vw,64px)',
    background: solid ? 'rgba(26,40,32,0.93)' : 'transparent',
    backdropFilter: solid ? 'blur(14px) saturate(130%)' : 'none',
    WebkitBackdropFilter: solid ? 'blur(14px) saturate(130%)' : 'none',
    borderBottom: solid ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
    transition: 'all .55s cubic-bezier(.16,1,.3,1)',
  };

  const brand: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    textDecoration: 'none',
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
            style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
          />
        ) : (
          <>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: C.forest,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Droplets size={18} color={C.white} strokeWidth={2} />
            </div>
            <div>
              <div
                style={{
                  fontFamily: SERIF,
                  fontSize: 15,
                  fontWeight: 700,
                  color: C.white,
                  lineHeight: 1.1,
                  letterSpacing: '-0.01em',
                }}
              >
                Eau &amp; Habitat Bretagne
              </div>
              <div
                style={{
                  fontFamily: SANS,
                  fontSize: 10,
                  color: 'rgba(255,255,255,0.50)',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                }}
              >
                Plombier-chauffagiste · RGE
              </div>
            </div>
          </>
        )}
      </a>

      <div
        className="r290-navlinks"
        style={{ display: 'flex', alignItems: 'center', gap: 'clamp(16px,2.2vw,34px)' }}
      >
        {navLinks.map((l) => (
          <NavLink290 key={l.label} label={l.label} href={l.href} />
        ))}
      </div>

      <div className="r290-navcta">
        <a href="#devis" style={{ textDecoration: 'none' }}>
          <ForestButton filled>Devis gratuit</ForestButton>
        </a>
      </div>
    
        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="r290-burger"
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

function NavLink290({ label, href }: { label: string; href: string }) {
  const [h, setH] = useState(false);
  return (
    <a
      href={href}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        fontFamily: SANS,
        fontSize: 12,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        color: h ? C.white : 'rgba(255,255,255,0.68)',
        textDecoration: 'none',
        transition: 'color .35s',
        fontWeight: 700,
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
          height: 1.5,
          width: h ? '100%' : '0%',
          background: C.forestLight,
          transition: 'width .45s cubic-bezier(.16,1,.3,1)',
        }}
      />
    </a>
  );
}

export default Impact290Page;
