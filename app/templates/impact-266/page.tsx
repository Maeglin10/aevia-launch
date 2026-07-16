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
import { ArrowRight, ChevronDown, Diamond, MapPin } from 'lucide-react';

/* ════════════════════════════════════════════════════════════════════════════
   VILLA ÉMERAUDE EVENTS — Wedding Planner & Événements Luxe · Nice & Côte d'Azur
   Chorégraphie de défilement éditoriale premium. 'use client'.
   ════════════════════════════════════════════════════════════════════════════ */

/* ── Google Fonts ─────────────────────────────────────────────────────────── */
const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Marcellus:wght@400&family=Raleway:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap');
`;

/* ── Palette ──────────────────────────────────────────────────────────────── */
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
  bg: '#faf8f4',
  bgAlt: '#f2ede4',
  bgDark: '#0e0c08',
  bgDarkAlt: '#080604',
  bgCard: '#ffffff',
  accent: '#c8a040',
  accentDark: '#a07e2c',
  accentLight: '#f0e0b0',
  white: '#ffffff',
  ink: '#0e0c08',
  textMuted: '#3c3020',
  textFaint: '#9a8c70',
  border: '#e0d4b8',
  borderDark: 'rgba(200,160,64,0.2)',
  azure: '#3a7ab8',
};

const SERIF = "'Marcellus', Georgia, serif" as const;
const SANS = "'Raleway', system-ui, sans-serif" as const;

/* ── Photo URL helper ────────────────────────────────────────────────────── */
const ph = (id: string) =>
  `https://images.unsplash.com/photo-${id}?q=80&w=1600&auto=format&fit=crop`;

/* ── Easing partagé ──────────────────────────────────────────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ════════════════════════════════════════════════════════════════════════════
   TypeScript Interfaces
   ════════════════════════════════════════════════════════════════════════════ */

interface EventPhase {
  id: string;
  img: string;
  index: string;
  label: string;
  body: string;
}

interface Service {
  title: string;
  description: string;
  icon: string;
}

interface EditRow {
  eyebrow: string;
  img: string;
  title: React.ReactNode;
  body: string;
  reverse: boolean;
}

interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

interface ProcessStep {
  number: string;
  title: string;
  body: string;
}

/* ════════════════════════════════════════════════════════════════════════════
   Data
   ════════════════════════════════════════════════════════════════════════════ */

const PHASES: EventPhase[] = [
  {
    id: 'villa',
    img: ph('1519225421783-bda591ac3db3'),
    index: 'I',
    label: 'VILLA PRIVÉE',
    body: "Villas Belle Époque, bastides de Provence, domaines viticoles — des lieux d'exception pour des mariages inoubliables.",
  },
  {
    id: 'plage',
    img: ph('1511285560929-f9bf7f036830'),
    index: 'II',
    label: 'PLAGE & MER',
    body: "Cérémonie au coucher du soleil sur la Méditerranée, cocktail les pieds dans l'eau — l'azur comme décor absolu.",
  },
  {
    id: 'gastro',
    img: ph('1478146896981-b80fe463b330'),
    index: 'III',
    label: 'GASTRONOMIE & LUXE',
    body: "Chefs étoilés, caves à champagne, fleurs exotiques — chaque détail de table pensé comme une œuvre d'art.",
  },
];

const SERVICES: Service[] = [
  {
    title: 'Organisation complète',
    description: 'De la vision à la réalité — nous gérons chaque étape de votre mariage, de la recherche du lieu au dernier bouton de fleur.',
    icon: '◇',
  },
  {
    title: 'Coordination Jour J',
    description: 'Vous profitez pleinement de votre journée. Notre équipe orchestre chaque prestataire dans les coulisses.',
    icon: '◇',
  },
  {
    title: "Lieux d'exception",
    description: "Un carnet d'adresses de plus de 300 propriétés exclusives sur la Côte d'Azur, accessibles uniquement par notre réseau.",
    icon: '◇',
  },
  {
    title: 'Traiteur gastronomique',
    description: 'Des menus signés par des chefs étoilés, un service de salle irréprochable, une oenothèque triée sur le volet.',
    icon: '◇',
  },
  {
    title: 'Décoration florale',
    description: 'Arches de fleurs fraîches, installations botaniques monumentales, art floral sur-mesure créé pour votre palette de couleurs.',
    icon: '◇',
  },
  {
    title: 'Honeymoon & transfers',
    description: 'Transferts en voiture de luxe, yacht privatisé, villa secrète pour votre lune de miel — nous pensons à tout.',
    icon: '◇',
  },
];

const EDIT_ROWS: EditRow[] = [
  {
    eyebrow: 'Notre territoire',
    img: `https://images.unsplash.com/photo-1478146896981-b80fe463b330?q=80&w=800&auto=format&fit=crop`,
    title: (
      <>
        Côte d'Azur /{' '}
        <span style={{ fontStyle: 'italic' }}>à votre service.</span>
      </>
    ),
    body: '180 kilomètres de littoral entre Monaco et Marseille. Plus de 300 lieux partenaires. 15 ans de réseau exclusif tissé auprès des meilleurs artisans de la Riviera — pour que votre mariage soit exactement ce que vous avez imaginé.',
    reverse: false,
  },
  {
    eyebrow: 'Notre signature',
    img: `https://images.unsplash.com/photo-1478146896981-b80fe463b330?q=80&w=800&auto=format&fit=crop`,
    title: (
      <>
        Jamais / deux fois / <span style={{ fontStyle: 'italic' }}>pareil.</span>
      </>
    ),
    body: "Maximum 8 mariages par an. Un wedding planner dédié, disponible 24h/24 le jour J. Une session de planning de 3 heures pour capturer votre vision dans ses moindres nuances. Parce qu'un mariage ne se répète pas, nous ne nous répétons pas.",
    reverse: true,
  },
];

const PROCESS_STEPS: ProcessStep[] = [
  {
    number: '01',
    title: 'Rencontre découverte à Nice ou en visio',
    body: '90 minutes sans engagement pour comprendre votre vision, votre histoire et vos envies. Un échange humain avant tout.',
  },
  {
    number: '02',
    title: 'Sélection des prestataires exclusifs',
    body: "Nous puisons dans notre réseau Côte d'Azur pour vous proposer une sélection de prestataires triés sur le volet, adaptés à votre style.",
  },
  {
    number: '03',
    title: 'Répétitions & logistique',
    body: 'Un briefing complet avec tous les intervenants la veille. Chaque minute de votre journée est orchestrée à la perfection.',
  },
  {
    number: '04',
    title: 'Jour J — vous profitez, nous orchestrons',
    body: "Notre équipe gère chaque détail en coulisse pour que vous ne pensiez à rien d'autre qu'à vivre ce moment unique.",
  },
];

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Un couple franco-américain, 80 invités venus de 12 pays différents, dans une villa Belle Époque à Cannes. Villa Émeraude a tout orchestré avec une fluidité remarquable. Nos invités américains parlent encore de ce mariage comme du plus beau qu'ils aient jamais vu.",
    name: 'Claire & James',
    role: 'Mariés à Cannes · Villa Belle Époque',
  },
  {
    quote:
      "Renouvellement de vœux organisé surprise, sans que mon mari sache quoi que ce soit. L'équipe de Villa Émeraude a tout géré dans le secret le plus absolu, au Cap d'Antibes. Sa réaction en arrivant… je n'ai pas de mots. Un travail d'orfèvre.",
    name: 'Isabelle M.',
    role: "Renouvellement de vœux · Cap d'Antibes",
  },
];

/* ════════════════════════════════════════════════════════════════════════════
   Primitives partagées
   ════════════════════════════════════════════════════════════════════════════ */

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
      <span style={{ width: 44, height: 1, background: color, opacity: 0.7 }} />
      <span
        style={{
          fontFamily: SANS,
          fontSize: 11,
          letterSpacing: '0.40em',
          textTransform: 'uppercase',
          color,
          fontWeight: 500,
        }}
      >
        {children}
      </span>
      {align === 'center' && (
        <span style={{ width: 44, height: 1, background: color, opacity: 0.7 }} />
      )}
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

/* ════════════════════════════════════════════════════════════════════════════
   1 · NAV
   ════════════════════════════════════════════════════════════════════════════ */
function Nav() {
  const [solid, setSolid] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  React.useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 70);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: 'Mariages', href: '#evenements' },
    { label: 'Services', href: '#services' },
    { label: 'Notre histoire', href: '#territoire' },
    { label: 'Processus', href: '#processus' },
    { label: 'Témoignages', href: '#temoignages' },
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
        padding: solid
          ? '14px clamp(20px,5vw,64px)'
          : '24px clamp(20px,5vw,64px)',
        background: solid ? 'rgba(14,12,8,0.96)' : 'transparent',
        backdropFilter: solid ? 'blur(16px) saturate(130%)' : 'none',
        WebkitBackdropFilter: solid ? 'blur(16px) saturate(130%)' : 'none',
        borderBottom: solid
          ? `1px solid ${C.borderDark}`
          : '1px solid transparent',
        transition: 'all .55s cubic-bezier(.16,1,.3,1)',
      }}
    >
      {/* Brand */}
      <div
        style={{
          fontFamily: SERIF,
          fontSize: 'clamp(16px,1.6vw,21px)',
          letterSpacing: '0.12em',
          color: C.white,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        {fd?.logoBase64 ? (
          // Client logo (uploaded in the brief) replaces the placeholder mark —
          // essential for the client to recognise their brand in the render.
          <img
            src={fd.logoBase64}
            alt={fd?.businessName ?? 'logo'}
            style={{ height: 28, maxWidth: 160, objectFit: 'contain', display: 'block' }}
          />
        ) : (
          <>
            {fd?.businessName ?? "Villa Émeraude"}<span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: C.accent,
                display: 'inline-block',
                flexShrink: 0,
              }}
            />
          </>
        )}
      </div>

      {/* Links */}
      <div
        className="ve-navlinks"
        style={{ display: 'flex', alignItems: 'center', gap: 'clamp(18px,2.2vw,36px)' }}
      >
        {links.map((l) => (
          <NavLink key={l.label} label={l.label} href={l.href} />
        ))}
      </div>

      {/* CTA */}
      <div className="ve-navcta">
        <a href="#contact" style={{ textDecoration: 'none' }}>
          <button
            style={{
              fontFamily: SANS,
              fontSize: 11.5,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              fontWeight: 600,
              padding: '12px 26px',
              background: C.accent,
              color: C.ink,
              border: 'none',
              cursor: 'pointer',
              transition: 'background .4s',
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background = C.accentLight)
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background = C.accent)
            }
          >
            Commencer
          </button>
        </a>
      </div>

      
        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="ve-burger"
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
          .ve-navlinks { display: none !important; }
          .ve-burger { display: flex !important; flex-direction: column; }
          .ve-navcta { display: none !important; }
        }
      
        /* mobile: stack 2-col grids to single column (added by responsive fix) */
        @media (max-width: 768px) {
          .imx-mobstack { grid-template-columns: 1fr !important; }
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
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: h ? C.accent : 'rgba(255,255,255,0.88)',
        textDecoration: 'none',
        transition: 'color .35s',
        position: 'relative',
        paddingBottom: 3,
        fontWeight: 500,
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

  const imgScale = useTransform(scrollYProgress, [0, 1], [1.0, 1.12]);
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '16%']);
  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '-42%']);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <section
      ref={ref}
      style={{
        position: 'relative',
        height: '100dvh',
        minHeight: 640,
        overflow: 'hidden',
        background: C.bgDark,
      }}
    >
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
          src={`https://images.unsplash.com/photo-1478146896981-b80fe463b330?q=80&w=2000&auto=format&fit=crop`}
          alt="Villa Belle Époque sur la Côte d'Azur"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </motion.div>

      {/* Voile */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(14,12,8,0.36) 0%, rgba(14,12,8,0.06) 38%, rgba(14,12,8,0.46) 70%, rgba(14,12,8,0.92) 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(120% 80% at 50% 30%, transparent 35%, rgba(14,12,8,0.4) 100%)',
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
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '0 clamp(20px,5vw,80px)',
          y: titleY,
          opacity: titleOpacity,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.1 }}
        >
          <Eyebrow color={C.accentLight} align="center">
            Wedding Planner · Nice &amp; Côte d&apos;Azur
          </Eyebrow>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 44 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: EASE, delay: 0.22 }}
          style={{
            fontFamily: SERIF,
            fontWeight: 400,
            color: C.white,
            fontSize: 'clamp(3rem,7vw,8.5rem)',
            lineHeight: 0.96,
            letterSpacing: '-0.01em',
            margin: '26px 0 20px',
            textShadow: '0 14px 60px rgba(0,0,0,0.5)',
          }}
        >
          Mariages /{' '}
          <span style={{ fontStyle: 'italic', color: C.accentLight }}>
            Côte d&apos;Azur.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3, ease: EASE, delay: 0.48 }}
          style={{
            fontFamily: SANS,
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: 'clamp(15px,1.9vw,22px)',
            color: 'rgba(255,255,255,0.84)',
            maxWidth: 560,
            lineHeight: 1.65,
          }}
        >
          Chaque mariage est une œuvre unique. Nous sommes là pour lui donner la
          lumière qu&apos;il mérite.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.72 }}
          style={{ marginTop: 40 }}
        >
          <a href="#contact" style={{ textDecoration: 'none' }}>
            <button
              style={{
                fontFamily: SANS,
                fontSize: 11.5,
                letterSpacing: '0.26em',
                textTransform: 'uppercase',
                fontWeight: 600,
                padding: '16px 36px',
                background: C.accent,
                color: C.ink,
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 12,
                transition: 'background .4s, transform .4s',
              }}
            >
              Nous contacter <ArrowRight size={15} />
            </button>
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
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
            color: 'rgba(255,255,255,0.66)',
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
   3 · INTRO
   ════════════════════════════════════════════════════════════════════════════ */
function Intro() {
  return (
    <section id="hero"
      style={{
        background: C.bgAlt,
        padding: 'clamp(90px,13vw,180px) clamp(24px,8vw,160px)',
        textAlign: 'center',
      }}
    >
      <Reveal>
        <p
          style={{
            fontFamily: SERIF,
            fontSize: 'clamp(24px,3.2vw,46px)',
            fontWeight: 400,
            lineHeight: 1.38,
            color: C.ink,
            maxWidth: 920,
            margin: '0 auto',
          }}
        >
          Sur la Côte d&apos;Azur, chaque mariage mérite la lumière qui lui
          ressemble.
        </p>
      </Reveal>
      <Reveal delay={0.14}>
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
   4 · EVENT SEQUENCE — Sticky crossfade 320vh
   ════════════════════════════════════════════════════════════════════════════ */
function PhaseImage({
  phase,
  i,
  total,
  progress,
}: {
  phase: EventPhase;
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
    i === 0 ? [1, 1, 1, 0] : i === total - 1 ? [0, 1, 1, 1] : [0, 1, 1, 0],
  );
  const scale = useTransform(progress, [start - fadeIn, end], [1.1, 1.0]);

  return (
    <motion.div style={{ position: 'absolute', inset: 0, opacity }}>
      <motion.img
        src={phase.img}
        alt={phase.label}
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
  phase: EventPhase;
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
          fontSize: 'clamp(38px,8vw,110px)',
          color: 'rgba(200,160,64,0.28)',
          lineHeight: 1,
          marginBottom: 4,
        }}
      >
        {phase.index}
      </span>
      <h2
        style={{
          fontFamily: SERIF,
          fontSize: 'clamp(32px,5.5vw,80px)',
          fontWeight: 400,
          color: C.white,
          lineHeight: 1.04,
          margin: '0 0 16px',
          textShadow: '0 8px 40px rgba(0,0,0,0.6)',
          letterSpacing: '0.12em',
        }}
      >
        {phase.label}
      </h2>
      <p
        style={{
          fontFamily: SANS,
          fontStyle: 'italic',
          fontWeight: 300,
          fontSize: 'clamp(15px,1.7vw,20px)',
          color: 'rgba(255,255,255,0.84)',
          maxWidth: 520,
          lineHeight: 1.68,
        }}
      >
        {phase.body}
      </p>

      {/* Section label top-right */}
      <div
        style={{
          position: 'absolute',
          top: 'clamp(90px,10vw,120px)',
          right: 'clamp(20px,4vw,56px)',
          fontFamily: SANS,
          fontSize: 10,
          letterSpacing: '0.38em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.55)',
          fontWeight: 500,
        }}
      >
        Villa Émeraude · {phase.index}
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
    [0.3, 1, 1, 0.3],
  );
  const width = useTransform(progress, [i * seg, (i + 1) * seg], [10, 32]);
  return (
    <motion.div
      style={{ height: 2, width, background: C.accent, opacity }}
    />
  );
}

function EventSequence() {
  const n = PHASES.length;
  const progress = useMotionValue(0.5 / n);
  const [active, setActive] = useState(0);
  const goTo = (i: number) => {
    setActive(i);
    progress.set((i + 0.5) / n);
  };

  return (
    <section
      id="evenements"
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

        {/* Voile lisibilité */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to bottom, rgba(14,12,8,0.28), rgba(14,12,8,0.08) 40%, rgba(14,12,8,0.58))',
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
          {PHASES.map((p, i) => (
            <ProgressDot
              key={p.id}
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
   5 · SERVICE CARDS
   ════════════════════════════════════════════════════════════════════════════ */
function ServiceCard({ service, i }: { service: Service; i: number }) {
  const [hover, setHover] = useState(false);
  return (
    <Reveal delay={i * 0.09} style={{ height: '100%' }}>
      <article
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          background: C.bgCard,
          borderLeft: `3px solid ${hover ? C.accent : C.border}`,
          padding: 'clamp(28px,3vw,40px) clamp(24px,2.4vw,34px)',
          transform: hover ? 'translateY(-8px)' : 'none',
          boxShadow: hover
            ? '0 32px 64px -28px rgba(14,12,8,0.22)'
            : '0 8px 32px -20px rgba(14,12,8,0.14)',
          transition: 'all .55s cubic-bezier(.16,1,.3,1)',
          cursor: 'default',
          height: '100%',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            fontFamily: SERIF,
            fontSize: 22,
            color: hover ? C.accent : C.border,
            marginBottom: 18,
            transition: 'color .4s',
          }}
        >
          {service.icon}
        </div>
        <h3
          style={{
            fontFamily: SERIF,
            fontSize: 'clamp(20px,2vw,26px)',
            fontWeight: 400,
            color: C.ink,
            margin: '0 0 14px',
          }}
        >
          {service.title}
        </h3>
        <p
          style={{
            fontFamily: SANS,
            fontWeight: 300,
            fontSize: 'clamp(14px,1.3vw,16px)',
            lineHeight: 1.75,
            color: C.textMuted,
            margin: 0,
            flex: 1,
          }}
        >
          {service.description}
        </p>
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
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ marginBottom: 'clamp(48px,6vw,80px)' }}>
          <Reveal>
            <Eyebrow>Nos services</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(34px,5vw,68px)',
                fontWeight: 400,
                color: C.ink,
                margin: '18px 0 0',
                lineHeight: 1.06,
              }}
            >
              Une présence à chaque{' '}
              <span style={{ fontStyle: 'italic', color: C.accentDark }}>
                étape.
              </span>
            </h2>
          </Reveal>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
            gap: 'clamp(18px,2.4vw,32px)',
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

function EditorialRow({ row, num }: { row: EditRow; num: number }) {
  const numStr = String(num).padStart(2, '0');
  return (
    <div style={{ position: 'relative' }} className="ve-editrow">
      {/* Ghost numeral */}
      <span
        style={{
          position: 'absolute',
          top: -20,
          left: row.reverse ? 'auto' : -30,
          right: row.reverse ? -30 : 'auto',
          fontFamily: SERIF,
          fontSize: 'clamp(100px,14vw,180px)',
          fontWeight: 400,
          color: C.azure,
          opacity: 0.1,
          lineHeight: 1,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        {numStr}
      </span>

      <div className="imx-mobstack"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'clamp(32px,5.5vw,88px)',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        {/* Image */}
        <Reveal
          y={50}
          style={{
            order: row.reverse ? 2 : 1,
            aspectRatio: '4 / 5',
            overflow: 'hidden',
          }}
        >
          <ParallaxImg src={row.img} alt={row.eyebrow} />
        </Reveal>

        {/* Text */}
        <div style={{ order: row.reverse ? 1 : 2 }}>
          <Reveal>
            <Eyebrow color={C.accentDark}>{row.eyebrow}</Eyebrow>
          </Reveal>
          <Reveal delay={0.09}>
            <h3
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(28px,4vw,58px)',
                fontWeight: 400,
                color: C.ink,
                margin: '18px 0 22px',
                lineHeight: 1.1,
              }}
            >
              {row.title}
            </h3>
          </Reveal>
          <Reveal delay={0.18}>
            <p
              style={{
                fontFamily: SANS,
                fontWeight: 300,
                fontSize: 'clamp(15px,1.5vw,18px)',
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
      </div>

      <style>{`
        @media (max-width: 860px) {
          .ve-editrow > div > * { order: initial !important; }
          .ve-editrow > div { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function EditorialRows() {
  return (
    <section
      id="territoire"
      style={{
        background: C.bg,
        padding: 'clamp(80px,11vw,160px) clamp(24px,6vw,96px)',
      }}
    >
      <div
        style={{
          maxWidth: 1260,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(80px,11vw,150px)',
        }}
      >
        {EDIT_ROWS.map((r, i) => (
          <EditorialRow key={r.eyebrow} row={r} num={i + 1} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   7 · PROCESS PANEL — Sticky left image + scrolling milestones
   ════════════════════════════════════════════════════════════════════════════ */
function ProcessPanel() {
  return (
    <section
      id="processus"
      style={{
        background: C.bgDark,
        padding: 'clamp(80px,11vw,150px) clamp(24px,6vw,96px)',
      }}
    >
      <div
        style={{
          maxWidth: 1260,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '0.95fr 1.05fr',
          gap: 'clamp(40px,6vw,96px)',
          alignItems: 'start',
        }}
        className="ve-procpanel"
      >
        {/* Sticky image */}
        <div style={{ position: 'sticky', top: 100, alignSelf: 'start' }} className="ve-procsticky">
          <div
            style={{
              overflow: 'hidden',
              border: `1px solid ${C.borderDark}`,
              aspectRatio: '4 / 5',
            }}
          >
            <img
              src={`https://images.unsplash.com/photo-1478146896981-b80fe463b330?q=80&w=900&auto=format&fit=crop`}
              alt="Planning de mariage Côte d'Azur"
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
          <div style={{ marginTop: 22 }}>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 10,
                letterSpacing: '0.34em',
                textTransform: 'uppercase',
                color: C.accent,
                marginBottom: 10,
              }}
            >
              Notre processus
            </div>
            <div
              style={{
                fontFamily: SERIF,
                fontStyle: 'italic',
                fontSize: 'clamp(16px,1.6vw,20px)',
                color: 'rgba(255,255,255,0.72)',
                lineHeight: 1.6,
              }}
            >
              Du premier échange à l&apos;ultime instant, nous sommes là.
            </div>
          </div>
        </div>

        {/* Scrolling milestones */}
        <div>
          <Reveal>
            <Eyebrow color={C.accentLight}>Comment ça se passe</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(32px,4.6vw,64px)',
                fontWeight: 400,
                color: C.white,
                margin: '18px 0 52px',
                lineHeight: 1.06,
              }}
            >
              De la vision à la{' '}
              <span style={{ fontStyle: 'italic', color: C.accentLight }}>
                réalité.
              </span>
            </h2>
          </Reveal>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {PROCESS_STEPS.map((step, i) => (
              <Reveal key={step.number} delay={0.06 * i}>
                <div
                  style={{
                    padding: 'clamp(28px,3vw,42px) 0',
                    borderTop: `1px solid rgba(200,160,64,0.22)`,
                    display: 'flex',
                    gap: 'clamp(20px,3vw,36px)',
                    alignItems: 'baseline',
                  }}
                >
                  <span
                    style={{
                      fontFamily: SERIF,
                      fontSize: 'clamp(18px,2vw,26px)',
                      color: C.azure,
                      minWidth: 42,
                      flexShrink: 0,
                      opacity: 0.9,
                    }}
                  >
                    {step.number}
                  </span>
                  <div>
                    <h4
                      style={{
                        fontFamily: SERIF,
                        fontSize: 'clamp(18px,1.9vw,24px)',
                        fontWeight: 400,
                        color: C.white,
                        margin: '0 0 10px',
                        lineHeight: 1.22,
                      }}
                    >
                      {step.title}
                    </h4>
                    <p
                      style={{
                        fontFamily: SANS,
                        fontWeight: 300,
                        fontSize: 'clamp(14px,1.3vw,16px)',
                        lineHeight: 1.75,
                        color: 'rgba(255,255,255,0.66)',
                        margin: 0,
                      }}
                    >
                      {step.body}
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
          .ve-procpanel { grid-template-columns: 1fr !important; }
          .ve-procsticky { position: static !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   8 · TESTIMONIALS
   ════════════════════════════════════════════════════════════════════════════ */
function Testimonials() {
  return (
    <section
      id="temoignages"
      style={{
        background: C.bgAlt,
        padding: 'clamp(90px,12vw,170px) clamp(24px,6vw,96px)',
      }}
    >
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(48px,6vw,80px)' }}>
          <Reveal>
            <Eyebrow color={C.accentDark} align="center">
              Ils nous ont fait confiance
            </Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(32px,4.8vw,64px)',
                fontWeight: 400,
                color: C.ink,
                margin: '18px 0 0',
                lineHeight: 1.06,
              }}
            >
              Des mariages{' '}
              <span style={{ fontStyle: 'italic', color: C.accentDark }}>
                inoubliables.
              </span>
            </h2>
          </Reveal>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))',
            gap: 'clamp(28px,3.5vw,52px)',
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
                  boxShadow: '0 20px 60px -38px rgba(14,12,8,0.28)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ marginBottom: 24 }}>
                  <Diamond
                    size={28}
                    color={C.accent}
                    strokeWidth={1.2}
                    fill="none"
                  />
                </div>
                <blockquote
                  style={{
                    fontFamily: SERIF,
                    fontStyle: 'italic',
                    fontSize: 'clamp(17px,1.8vw,21px)',
                    lineHeight: 1.65,
                    color: C.ink,
                    margin: '0 0 30px',
                    flex: 1,
                  }}
                >
                  &ldquo;{t.quote}&rdquo;
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
                      color: C.accentDark,
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
                      marginTop: 5,
                    }}
                  >
                    {t.role}
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   9 · CONTACT FORM
   ════════════════════════════════════════════════════════════════════════════ */
function ContactForm() {
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [typeEvent, setTypeEvent] = useState('');
  const [date, setDate] = useState('');
  const [invites, setInvites] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prenom || !email) return;
    setSent(true);
  };

  const fieldBase: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    background: 'transparent',
    border: 'none',
    borderBottom: `1px solid rgba(200,160,64,0.35)`,
    padding: '14px 2px',
    fontFamily: SANS,
    fontWeight: 300,
    fontSize: 'clamp(15px,1.5vw,17px)',
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
    fontWeight: 500,
  };

  const eventTypes = [
    'Mariage villa',
    'Mariage plage',
    'Renouvellement vœux',
    'Événement privé',
    'Séminaire luxe',
    'Autre',
  ];

  return (
    <section
      id="contact"
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: C.bgDark,
        padding: 'clamp(96px,13vw,180px) clamp(24px,6vw,96px)',
      }}
    >
      {/* Background image très atténuée */}
      <img
        src={ph('1519225421783-bda591ac3db3')}
        alt="Image de présentation"
        aria-hidden="true"
        loading="lazy"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.1,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(14,12,8,0.72)',
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: 720,
          margin: '0 auto',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 'clamp(40px,5vw,64px)' }}>
          <Reveal>
            <Eyebrow color={C.accentLight} align="center">
              Prenons contact
            </Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(34px,5.5vw,76px)',
                fontWeight: 400,
                color: C.white,
                margin: '18px 0 16px',
                lineHeight: 1.04,
              }}
            >
              Votre mariage{' '}
              <span style={{ fontStyle: 'italic', color: C.accentLight }}>
                commence ici.
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p
              style={{
                fontFamily: SANS,
                fontStyle: 'italic',
                fontWeight: 300,
                fontSize: 'clamp(15px,1.6vw,18px)',
                lineHeight: 1.7,
                color: 'rgba(255,255,255,0.75)',
                maxWidth: 500,
                margin: '0 auto',
              }}
            >
              Dites-nous tout. Nous revenons vers vous dans les 48 heures pour
              organiser votre rencontre découverte.
            </p>
          </Reveal>
        </div>

        {sent ? (
          <Reveal>
            <div
              style={{
                border: `1px solid ${C.accent}`,
                padding: 'clamp(40px,5.5vw,64px)',
                background: 'rgba(200,160,64,0.06)',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  border: `2px solid ${C.accent}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 22px',
                }}
              >
                <Diamond size={22} color={C.accent} strokeWidth={1.4} />
              </div>
              <h3
                style={{
                  fontFamily: SERIF,
                  fontSize: 'clamp(24px,3vw,36px)',
                  fontWeight: 400,
                  color: C.white,
                  margin: '0 0 14px',
                }}
              >
                Merci {prenom}, nous vous proposons un rendez-vous découverte dans les 48h.
              </h3>
              <p
                style={{
                  fontFamily: SANS,
                  fontWeight: 300,
                  fontStyle: 'italic',
                  fontSize: 16,
                  color: 'rgba(255,255,255,0.72)',
                  margin: 0,
                }}
              >
                Un email de confirmation vous a été envoyé à{' '}
                <span style={{ color: C.accentLight }}>{email}</span>.
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
              }}
            >
              {/* Row: Prénom + Email */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 'clamp(20px,3vw,36px)',
                }}
                className="ve-formgrid"
              >
                <div>
                  <label style={labelStyle} htmlFor="ve-prenom">
                    Prénom
                  </label>
                  <input
                    id="ve-prenom"
                    style={fieldBase}
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    placeholder="Sophie"
                    autoComplete="given-name"
                    required
                  />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="ve-email">
                    Email
                  </label>
                  <input
                    id="ve-email"
                    style={fieldBase}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sophie@exemple.fr"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              {/* Téléphone */}
              <div>
                <label style={labelStyle} htmlFor="ve-telephone">
                  Téléphone
                </label>
                <input
                  id="ve-telephone"
                  style={fieldBase}
                  type="tel"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  placeholder="+33 6 12 34 56 78"
                  autoComplete="tel"
                />
              </div>

              {/* Type d'événement */}
              <div>
                <label style={labelStyle} htmlFor="ve-type">
                  Type d&apos;événement
                </label>
                <select
                  id="ve-type"
                  style={{
                    ...fieldBase,
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    cursor: 'pointer',
                    color: typeEvent
                      ? C.white
                      : 'rgba(255,255,255,0.38)',
                  }}
                  value={typeEvent}
                  onChange={(e) => setTypeEvent(e.target.value)}
                >
                  <option value="" style={{ color: '#111' }}>
                    Choisir…
                  </option>
                  {eventTypes.map((t) => (
                    <option key={t} value={t} style={{ color: '#111' }}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Row: Date + Invités */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 'clamp(20px,3vw,36px)',
                }}
                className="ve-formgrid"
              >
                <div>
                  <label style={labelStyle} htmlFor="ve-date">
                    Date envisagée
                  </label>
                  <input
                    id="ve-date"
                    style={fieldBase}
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="Été 2026…"
                  />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="ve-invites">
                    Nombre d&apos;invités
                  </label>
                  <input
                    id="ve-invites"
                    style={fieldBase}
                    type="number"
                    min="1"
                    value={invites}
                    onChange={(e) => setInvites(e.target.value)}
                    placeholder="80"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label style={labelStyle} htmlFor="ve-message">
                  Votre message
                </label>
                <textarea
                  id="ve-message"
                  style={{
                    ...fieldBase,
                    resize: 'vertical',
                    minHeight: 110,
                    lineHeight: 1.7,
                  }}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Décrivez votre vision, votre lieu de rêve, vos envies…"
                />
              </div>

              {/* Submit */}
              <div style={{ textAlign: 'center', marginTop: 8 }}>
                <button
                  type="submit"
                  style={{
                    fontFamily: SANS,
                    fontSize: 11.5,
                    letterSpacing: '0.26em',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    padding: '16px 44px',
                    background: C.accent,
                    color: C.ink,
                    border: 'none',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 12,
                    transition: 'background .4s, transform .4s',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = C.accentLight;
                    (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = C.accent;
                    (e.currentTarget as HTMLButtonElement).style.transform = 'none';
                  }}
                >
                  Envoyer ma demande <ArrowRight size={15} />
                </button>
              </div>
            </form>
          </Reveal>
        )}
      </div>

      <style>{`
        @media (max-width: 860px) {
          .ve-formgrid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   10 · FOOTER
   ════════════════════════════════════════════════════════════════════════════ */
function Footer() {
  const cols: { title: string; items: { label: string; href: string }[] }[] = [
    {
      title: 'Mariages',
      items: [
        { label: 'Villa privée', href: '#evenements' },
        { label: 'Plage & mer', href: '#evenements' },
        { label: 'Gastronomie & luxe', href: '#evenements' },
        { label: 'Honeymoon', href: '#services' },
      ],
    },
    {
      title: 'Services',
      items: [
        { label: 'Organisation complète', href: '#services' },
        { label: 'Coordination Jour J', href: '#services' },
        { label: 'Décoration florale', href: '#services' },
        { label: 'Traiteur gastronomique', href: '#services' },
      ],
    },
    {
      title: 'À propos',
      items: [
        { label: 'Notre territoire', href: '#territoire' },
        { label: 'Notre signature', href: '#territoire' },
        { label: 'Processus', href: '#processus' },
        { label: 'Témoignages', href: '#temoignages' },
      ],
    },
  ];

  return (
    <footer
      style={{
        background: C.bgDarkAlt,
        borderTop: `1px solid ${C.borderDark}`,
        padding: 'clamp(64px,9vw,110px) clamp(24px,6vw,96px) 36px',
      }}
    >
      <div
        style={{
          maxWidth: 1260,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.5fr repeat(3, 1fr)',
          gap: 'clamp(32px,4.5vw,64px)',
        }}
        className="ve-footgrid"
      >
        {/* Brand col */}
        <div>
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(18px,1.8vw,24px)',
              letterSpacing: '0.10em',
              color: C.white,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >{fd?.businessName ?? "Villa Émeraude"}<span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: C.accent,
                display: 'inline-block',
              }}
            />
          </div>
          <p
            style={{
              fontFamily: SANS,
              fontStyle: 'italic',
              fontWeight: 300,
              fontSize: 15,
              lineHeight: 1.72,
              color: 'rgba(255,255,255,0.58)',
              marginTop: 18,
              maxWidth: 320,
            }}
          >
            Wedding Planner de luxe sur la Côte d&apos;Azur. Nice, Cannes,
            Monaco, Antibes — et partout où la lumière mérite un mariage.
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
              color: 'rgba(255,255,255,0.5)',
            }}
          >
            <MapPin size={13} color={C.accent} strokeWidth={1.5} />
            Nice · Côte d&apos;Azur · France
          </div>
        </div>

        {/* Link cols */}
        {cols.map((c) => (
          <div key={c.title}>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 10,
                letterSpacing: '0.30em',
                textTransform: 'uppercase',
                color: C.accent,
                marginBottom: 20,
                fontWeight: 600,
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
                <li key={it.label}>
                  <a
                    href={it.href}
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
                    {it.label}
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
          maxWidth: 1260,
          margin: '56px auto 0',
          paddingTop: 24,
          borderTop: `1px solid rgba(200,160,64,0.14)`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 14,
          fontFamily: SANS,
          fontSize: 11,
          letterSpacing: '0.10em',
          color: 'rgba(255,255,255,0.38)',
        }}
      >
        <span>© 2026 Villa Émeraude Events. Tous droits réservés.</span>
        <span style={{ display: 'flex', gap: 22 }}>
          <a href="#contact" style={{ color: 'inherit', textDecoration: 'none' }}>
            Mentions légales
          </a>
          <a href="#contact" style={{ color: 'inherit', textDecoration: 'none' }}>
            Confidentialité
          </a>
        </span>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .ve-footgrid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 520px) {
          .ve-footgrid { grid-template-columns: 1fr !important; }
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
    <>
      <style>{FONTS}</style>
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
        <EventSequence />
        <ServiceCards />
        <EditorialRows />
        <ProcessPanel />
        <Testimonials />
        <ContactForm />
        <Footer />
      </main>
    </>
  );
}
