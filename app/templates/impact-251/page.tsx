'use client';

import React, { useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  MotionValue,
  useMotionValue,
} from 'framer-motion';
import { ArrowRight, ChevronDown, Heart, MapPin } from 'lucide-react';

/* ════════════════════════════════════════════════════════════════════════════
   MAISON NUPTIALE — Organisateur de Mariage & Événements · Bordeaux
   Chorégraphie de défilement éditoriale · Crossfade chapitré · Panneau collant
   Auto-suffisant. 'use client'.
   ════════════════════════════════════════════════════════════════════════════ */

/* ── Polices ─────────────────────────────────────────────────────────────── */
const FONT_LINK = `https://fonts.googleapis.com/css2?family=Italiana&family=Raleway:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap`;

/* ── Palette ─────────────────────────────────────────────────────────────── */
const C = {
  bg: '#fdf9f5',
  bgAlt: '#f5ede4',
  bgDark: '#1c140e',
  bgDarkAlt: '#130d09',
  bgCard: '#ffffff',
  accent: '#9b7248',
  accentDark: '#7a5838',
  accentLight: '#ecdccc',
  white: '#ffffff',
  ink: '#1c140e',
  textMuted: '#5c4030',
  textFaint: '#9a8070',
  border: '#e4d4c0',
  borderDark: 'rgba(155,114,72,0.2)',
  blush: '#d4a0a0',
} as const;

const SERIF = "'Italiana', 'Didot', 'Bodoni MT', Georgia, serif" as const;
const SANS = "'Raleway', system-ui, sans-serif" as const;

/* ── Easing partagé ──────────────────────────────────────────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ── URLs photos ─────────────────────────────────────────────────────────── */
const PH = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?q=80&w=${w}&auto=format&fit=crop`;

/* ════════════════════════════════════════════════════════════════════════════
   TYPES
   ════════════════════════════════════════════════════════════════════════════ */
interface Chapter {
  id: string;
  img: string;
  alt: string;
  roman: string;
  title: string;
  sub: string;
}

interface Service {
  title: string;
  desc: string;
  icon: string;
}

interface EditRow {
  eyebrow: string;
  roman: string;
  title: React.ReactNode;
  body: string;
  img: string;
  alt: string;
  reverse: boolean;
}

interface ProcessStep {
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
   DATA
   ════════════════════════════════════════════════════════════════════════════ */
const CHAPTERS: Chapter[] = [
  {
    id: 'ch1',
    img: PH('1519225421783-bda591ac3db3', 1600),
    alt: 'Décoration de cérémonie de mariage',
    roman: 'I',
    title: 'LA CÉRÉMONIE',
    sub: 'Laïque ou religieuse, intime ou grandiose — chaque cérémonie est une promesse mise en scène avec soin.',
  },
  {
    id: 'ch2',
    img: PH('1511285560929-f9bf7f036830', 1600),
    alt: 'Tables de réception élégantes',
    roman: 'II',
    title: 'LA RÉCEPTION',
    sub: 'Art de table, ambiance musicale, menu gastronomique — vos convives se souviennent de chaque détail.',
  },
  {
    id: 'ch3',
    img: PH('1478146896981-b80fe463b330', 1600),
    alt: 'Fleurs de mariée — bouquet nuptial',
    roman: 'III',
    title: 'LES INSTANTS',
    sub: 'Photos de couple au coucher du soleil, lancer de bouquet, premier baiser — les moments immortels.',
  },
];

const SERVICES: Service[] = [
  {
    title: 'Organisation complète',
    desc: 'De la première esquisse à la dernière danse — nous orchestrons chaque détail pour vous.',
    icon: '✦',
  },
  {
    title: 'Coordination Jour J',
    desc: 'Vous profitez pleinement de votre journée pendant que notre équipe gère tout en coulisse.',
    icon: '✦',
  },
  {
    title: 'Décoration & scénographie',
    desc: 'Un univers visuel cohérent, de la cérémonie à la salle de réception, signé Maison Nuptiale.',
    icon: '✦',
  },
  {
    title: 'Traiteur & menu',
    desc: 'Des menus gastronomiques construits avec nos chefs partenaires, adaptés à vos envies.',
    icon: '✦',
  },
  {
    title: 'Photographie & vidéo',
    desc: "Nos photographes et vidéastes partenaires capturent l'émotion brute de votre journée.",
    icon: '✦',
  },
  {
    title: 'Voyage de noces',
    desc: "Nous prolongeons la magie avec un voyage de noces sur-mesure, organisé jusqu'au dernier vol.",
    icon: '✦',
  },
];

const EDIT_ROWS: EditRow[] = [
  {
    eyebrow: 'Notre approche',
    roman: 'I',
    title: (
      <>
        Un seul{' '}
        <span style={{ fontStyle: 'italic' }}>mariage.</span>
      </>
    ),
    body: 'Chaque couple reçoit un wedding planner dédié, disponible 7j/7. Nous ne fabriquons pas des mariages en série — nous créons votre mariage. Maximum 12 couples par an, pour que chaque histoire reste unique.',
    img: PH('1519225421783-bda591ac3db3', 800),
    alt: 'Cérémonie de mariage — Maison Nuptiale',
    reverse: false,
  },
  {
    eyebrow: 'Nos lieux partenaires',
    roman: 'II',
    title: (
      <>
        Bordeaux{' '}
        <span style={{ fontStyle: 'italic' }}>& Vignobles.</span>
      </>
    ),
    body: "Châteaux du Médoc, bastides de Dordogne, villas du Bassin d'Arcachon et destinations à travers l'Europe — notre réseau de lieux d'exception vous ouvre des portes inaccessibles au grand public.",
    img: PH('1511285560929-f9bf7f036830', 800),
    alt: 'Vignoble partenaire — Bordeaux',
    reverse: true,
  },
];

const PROCESS: ProcessStep[] = [
  {
    num: '01',
    title: 'Rencontre découverte gratuite',
    body: '1h pour imaginer votre mariage ensemble, sans engagement. On apprend à vous connaître, à entendre votre histoire.',
  },
  {
    num: '02',
    title: 'Carnet de mariage personnalisé',
    body: 'Budget prévisionnel, sélection de prestataires, planning détaillé et moodboard — tout est posé noir sur blanc.',
  },
  {
    num: '03',
    title: 'Suivi mensuel + visites lieux',
    body: 'Vous validez chaque décision à votre rythme. Nous coordonnons chaque prestataire, chaque confirmation.',
  },
  {
    num: '04',
    title: 'Jour J clé en main',
    body: "Vous profitez pleinement de chaque instant. Nous gérons chaque détail en coulisse, du premier vendeur au dernier feu d'artifice.",
  },
];

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Notre mariage dans un château du Médoc, 120 invités, a été d'une fluidité absolue. L'équipe de Maison Nuptiale a tout géré avec une élégance et un calme remarquables. Chaque détail était exactement comme nous l'avions rêvé — souvent mieux.",
    name: 'Camille & Julien Ferraud',
    role: 'Château du Médoc · 120 invités',
  },
  {
    quote:
      "On voulait quelque chose d'intime : 20 personnes dans un jardin, une cérémonie civile sans chichis. Maison Nuptiale a transformé notre simplicité en quelque chose de magique. Une journée que nous n'oublierons jamais.",
    name: 'Sophie & Antoine Martel',
    role: 'Réception jardin · 20 invités',
  },
];

/* ════════════════════════════════════════════════════════════════════════════
   PRIMITIVES
   ════════════════════════════════════════════════════════════════════════════ */

/** Étiquette fine en capitales avec filets latéraux. */
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
    width: 40,
    height: 1,
    background: light ? 'rgba(236,220,204,0.5)' : color,
    opacity: light ? 0.6 : 0.8,
  };
  const label: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 10.5,
    letterSpacing: '0.46em',
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

/** Bouton cognac, variante pleine ou contour, flèche animée. */
function MNButton({
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
    fontSize: 11.5,
    letterSpacing: '0.28em',
    textTransform: 'uppercase',
    fontWeight: 500,
    cursor: 'pointer',
    border: `1px solid ${filled ? C.accent : dark ? 'rgba(155,114,72,0.7)' : C.accent}`,
    background: filled ? C.accent : 'transparent',
    color: filled ? C.white : dark ? C.accentLight : C.accent,
    transition: 'all .5s cubic-bezier(.16,1,.3,1)',
  };
  const hov: React.CSSProperties = hover
    ? filled
      ? { background: C.accentDark, borderColor: C.accentDark, transform: 'translateY(-2px)' }
      : { background: 'rgba(155,114,72,0.08)', transform: 'translateY(-2px)' }
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
    { label: 'Services', href: '#services' },
    { label: 'Lieux', href: '#lieux' },
    { label: 'Galerie', href: '#chapitres' },
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
    background: solid ? 'rgba(28,20,14,0.95)' : 'transparent',
    backdropFilter: solid ? 'blur(16px) saturate(130%)' : 'none',
    WebkitBackdropFilter: solid ? 'blur(16px) saturate(130%)' : 'none',
    borderBottom: solid
      ? '1px solid rgba(155,114,72,0.2)'
      : '1px solid transparent',
    transition: 'all .55s cubic-bezier(.16,1,.3,1)',
  };

  const brand: React.CSSProperties = {
    fontFamily: SERIF,
    fontSize: 'clamp(17px,1.6vw,22px)',
    fontStyle: 'italic',
    letterSpacing: '0.08em',
    color: C.white,
    textDecoration: 'none',
  };

  const linkRow: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'clamp(20px,2.4vw,40px)',
  };

  return (
    <>
      <nav style={bar}>
      <a href="#hero" style={brand}>
        Maison Nuptiale
      </a>
      <div style={linkRow} className="mn-navlinks">
        {links.map((l) => (
          <NavLink key={l.label} label={l.label} href={l.href} />
        ))}
      </div>
      <div className="mn-navcta">
        <a href="#contact" style={{ textDecoration: 'none' }}>
          <MNButton filled dark>
            Nous rencontrer
          </MNButton>
        </a>
      </div>
      
        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="mn-burger"
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
          .mn-navlinks{ display:none !important; }
          .mn-burger { display: flex !important; flex-direction: column; }
          .mn-navcta{ display:none !important; }
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
        fontSize: 11,
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        fontWeight: 500,
        color: h ? C.accentLight : 'rgba(255,255,255,0.85)',
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
          background: C.accentLight,
          transition: 'width .45s cubic-bezier(.16,1,.3,1)',
        }}
      />
    </a>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   2 · HERO — parallaxe + pétales décoratifs
   ════════════════════════════════════════════════════════════════════════════ */
function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '14%']);
  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '-42%']);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.72], [1, 0]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);

  const petals = [
    { top: '18%', left: '7%', size: 28, rot: -20, delay: 0 },
    { top: '72%', left: '4%', size: 18, rot: 14, delay: 0.3 },
    { top: '30%', right: '8%', size: 22, rot: 35, delay: 0.15 },
    { top: '64%', right: '5%', size: 16, rot: -10, delay: 0.55 },
    { top: '82%', left: '18%', size: 12, rot: 55, delay: 0.4 },
    { top: '10%', right: '22%', size: 14, rot: -40, delay: 0.2 },
  ];

  return (
    <section
      ref={ref}
      id="hero"
      style={{
        position: 'relative',
        height: '100vh',
        minHeight: 640,
        overflow: 'hidden',
        background: C.bgDark,
      }}
    >
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
          src={PH('1519225421783-bda591ac3db3', 2000)}
          alt="Mariage élégant organisé par Maison Nuptiale à Bordeaux"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          priority-fetch="high"
        />
      </motion.div>

      {/* Voile gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(28,20,14,0.38) 0%, rgba(28,20,14,0.06) 36%, rgba(28,20,14,0.44) 68%, rgba(28,20,14,0.92) 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(130% 90% at 50% 24%, transparent 35%, rgba(28,20,14,0.42) 100%)',
          mixBlendMode: 'multiply',
        }}
      />

      {/* Pétales CSS décoratifs */}
      <style>{`
        @keyframes mn-float {
          0%, 100% { transform: translateY(0) rotate(var(--r)); }
          50% { transform: translateY(-14px) rotate(calc(var(--r) + 8deg)); }
        }
      `}</style>
      {petals.map((p, i) => (
        <span
          key={i}
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: p.top,
            left: 'left' in p ? (p as {left: string}).left : undefined,
            right: 'right' in p ? (p as {right: string}).right : undefined,
            width: p.size,
            height: p.size * 1.4,
            borderRadius: '50% 0 50% 0',
            background: C.blush,
            opacity: 0.22,
            '--r': `${p.rot}deg`,
            transform: `rotate(${p.rot}deg)`,
            animation: `mn-float ${3.5 + p.delay * 2}s ease-in-out ${p.delay}s infinite`,
          } as React.CSSProperties}
        />
      ))}

      {/* Contenu centré */}
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
          padding: '0 clamp(24px,6vw,80px)',
          y: titleY,
          opacity: titleOpacity,
        }}
      >
        <Reveal y={18}>
          <Eyebrow color="rgba(236,220,204,0.9)" align="center">
            Organisateur de Mariage · Bordeaux
          </Eyebrow>
        </Reveal>

        <motion.h1
          initial={{ opacity: 0, y: 44 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.15 }}
          style={{
            fontFamily: SERIF,
            fontWeight: 400,
            fontStyle: 'italic',
            color: C.white,
            fontSize: 'clamp(3rem,7.5vw,9rem)',
            lineHeight: 0.9,
            letterSpacing: '-0.01em',
            margin: '28px 0 26px',
            textShadow: '0 12px 64px rgba(0,0,0,0.45)',
          }}
        >
          Votre jour
          <br />
          <span style={{ color: C.accentLight }}>parfait.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.45 }}
          style={{
            fontFamily: SANS,
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: 'clamp(15px,1.8vw,20px)',
            color: 'rgba(253,249,245,0.84)',
            maxWidth: 520,
            lineHeight: 1.72,
          }}
        >
          De la première esquisse à la dernière danse — nous orchestrons chaque
          instant pour que vous n'ayez qu'à vivre.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.72 }}
          style={{ marginTop: 44 }}
        >
          <MNButton filled dark>
            Commencer notre histoire
          </MNButton>
        </motion.div>
      </motion.div>

      {/* Cue défilement */}
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
            letterSpacing: '0.36em',
            textTransform: 'uppercase',
            color: 'rgba(253,249,245,0.65)',
          }}
        >
          Découvrir
        </span>
        <motion.div
          animate={{ y: [0, 9, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={20} color={C.accentLight} strokeWidth={1.3} />
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
    <section
      style={{
        background: C.bgAlt,
        padding: 'clamp(96px,14vw,200px) clamp(24px,8vw,160px)',
        textAlign: 'center',
      }}
    >
      <Reveal>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 38 }}>
          <Eyebrow color={C.textMuted} align="center">
            Notre philosophie
          </Eyebrow>
        </div>
      </Reveal>
      <Reveal delay={0.1}>
        <p
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 'clamp(26px,3.6vw,52px)',
            lineHeight: 1.28,
            fontWeight: 400,
            maxWidth: 960,
            margin: '0 auto',
            color: C.ink,
          }}
        >
          Il n&apos;y a qu&apos;un seul jour parfait.
          <br />
          <span style={{ color: C.accent }}>Ensemble, nous le créons.</span>
        </p>
      </Reveal>
      <Reveal delay={0.22}>
        <div
          style={{
            width: 1,
            height: 90,
            background: `linear-gradient(${C.accent}, transparent)`,
            margin: '56px auto 0',
            opacity: 0.5,
          }}
        />
      </Reveal>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   4 · CHAPTER SEQUENCE — crossfade collant 320vh
   ════════════════════════════════════════════════════════════════════════════ */
function ChapterLayer({
  chapter,
  i,
  total,
  progress,
}: {
  chapter: Chapter;
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
        src={chapter.img}
        alt={chapter.alt}
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

function ChapterText({
  chapter,
  i,
  total,
  progress,
}: {
  chapter: Chapter;
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
  const y = useTransform(progress, [start, end], [32, -32]);

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
        padding: '0 clamp(24px,6vw,80px)',
        opacity,
        y,
      }}
    >
      {/* Numéro romain en filigrane */}
      <span
        style={{
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontSize: 'clamp(64px,12vw,160px)',
          color: `rgba(155,114,72,0.18)`,
          lineHeight: 1,
          userSelect: 'none',
          marginBottom: 0,
        }}
      >
        {chapter.roman}
      </span>

      {/* Étiquette section en haut à droite */}
      <div
        style={{
          position: 'absolute',
          top: 'clamp(80px,10vw,120px)',
          right: 'clamp(24px,4vw,64px)',
          fontFamily: SANS,
          fontSize: 10,
          letterSpacing: '0.38em',
          textTransform: 'uppercase',
          color: 'rgba(236,220,204,0.6)',
        }}
      >
        {chapter.roman} / III
      </div>

      <h2
        style={{
          fontFamily: SERIF,
          fontSize: 'clamp(38px,6.5vw,92px)',
          fontWeight: 400,
          color: C.white,
          lineHeight: 1,
          margin: '-12px 0 0',
          letterSpacing: '0.06em',
          textShadow: '0 8px 48px rgba(0,0,0,0.5)',
        }}
      >
        {chapter.title}
      </h2>
      <p
        style={{
          fontFamily: SANS,
          fontStyle: 'italic',
          fontWeight: 300,
          fontSize: 'clamp(14px,1.6vw,19px)',
          color: 'rgba(253,249,245,0.82)',
          marginTop: 22,
          maxWidth: 500,
          lineHeight: 1.72,
        }}
      >
        {chapter.sub}
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
      style={{ height: 2, background: C.accent, opacity, width }}
    />
  );
}

function ChapterSequence() {
  const n = CHAPTERS.length;
  const progress = useMotionValue(0.5 / n);
  const [active, setActive] = useState(0);
  const goTo = (i: number) => {
    setActive(i);
    progress.set((i + 0.5) / n);
  };

  return (
    <section
      id="chapitres"
      style={{ height: '100vh', overflow: 'hidden', position: 'relative', background: C.bgDark }}
    >
      <div
        style={{
          position: 'relative',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {/* Couches photo */}
        {CHAPTERS.map((c, i) => (
          <ChapterLayer
            key={c.id}
            chapter={c}
            i={i}
            total={CHAPTERS.length}
            progress={progress}
          />
        ))}

        {/* Voile lisibilité */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to bottom, rgba(28,20,14,0.28) 0%, rgba(28,20,14,0.08) 42%, rgba(28,20,14,0.52) 100%)',
          }}
        />

        {/* Textes chapitres */}
        {CHAPTERS.map((c, i) => (
          <ChapterText
            key={c.id}
            chapter={c}
            i={i}
            total={CHAPTERS.length}
            progress={progress}
          />
        ))}

        {/* Points de progression cognac */}
        <div
          style={{
            position: 'absolute',
            bottom: 44,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 14,
            alignItems: 'center',
          }}
        >
          {CHAPTERS.map((c, i) => (
            <ProgressDot
              key={c.id}
              i={i}
              total={CHAPTERS.length}
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
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          background: C.bgCard,
          borderLeft: `3px solid ${hover ? C.blush : C.accent}`,
          padding: 'clamp(28px,3.5vw,42px)',
          height: '100%',
          boxSizing: 'border-box',
          transform: hover ? 'translateY(-8px)' : 'none',
          boxShadow: hover
            ? '0 32px 72px -28px rgba(28,20,14,0.22)'
            : '0 8px 32px -22px rgba(28,20,14,0.12)',
          transition: 'all .5s cubic-bezier(.16,1,.3,1)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <span
          style={{
            fontFamily: SERIF,
            fontSize: 26,
            color: hover ? C.blush : C.accent,
            display: 'block',
            marginBottom: 18,
            transition: 'color .4s',
          }}
        >
          {service.icon}
        </span>
        <h3
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 'clamp(22px,2.2vw,28px)',
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
            fontSize: 14.5,
            fontWeight: 300,
            lineHeight: 1.78,
            color: C.textMuted,
            margin: 0,
            flex: 1,
          }}
        >
          {service.desc}
        </p>
        <div
          style={{
            marginTop: 24,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontFamily: SANS,
            fontSize: 10.5,
            letterSpacing: '0.22em',
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
      id="services"
      style={{
        background: C.bg,
        padding: 'clamp(90px,12vw,170px) clamp(24px,6vw,96px)',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ maxWidth: 720, marginBottom: 'clamp(52px,7vw,90px)' }}>
          <Reveal>
            <Eyebrow>Nos services</Eyebrow>
          </Reveal>
          <Reveal delay={0.1}>
            <h2
              style={{
                fontFamily: SERIF,
                fontStyle: 'italic',
                fontSize: 'clamp(36px,5.5vw,74px)',
                fontWeight: 400,
                color: C.ink,
                margin: '20px 0 0',
                lineHeight: 1.06,
              }}
            >
              Tout ce dont votre{' '}
              <span style={{ color: C.accent }}>mariage</span> a besoin.
            </h2>
          </Reveal>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'clamp(20px,2.5vw,36px)',
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

function EditorialRow({ row }: { row: EditRow }) {
  return (
    <div style={{ position: 'relative' }} className="mn-editrow">
      {/* Numéro romain fantôme */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '-0.1em',
          right: row.reverse ? undefined : '-0.05em',
          left: row.reverse ? '-0.05em' : undefined,
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontSize: 'clamp(120px,16vw,220px)',
          color: C.blush,
          opacity: 0.15,
          lineHeight: 1,
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      >
        {row.roman}
      </span>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'clamp(36px,6vw,90px)',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        {/* Image */}
        <div
          style={{
            overflow: 'hidden',
            order: row.reverse ? 2 : 1,
            aspectRatio: '5 / 6',
          }}
        >
          <Reveal y={50} style={{ width: '100%', height: '100%' }}>
            <ParallaxImg src={row.img} alt={row.alt} />
          </Reveal>
        </div>

        {/* Texte */}
        <div style={{ order: row.reverse ? 1 : 2 }}>
          <Reveal>
            <Eyebrow color={C.textMuted}>{row.eyebrow}</Eyebrow>
          </Reveal>
          <Reveal delay={0.1}>
            <h3
              style={{
                fontFamily: SERIF,
                fontStyle: 'italic',
                fontSize: 'clamp(30px,4.2vw,58px)',
                fontWeight: 400,
                color: C.ink,
                margin: '20px 0 26px',
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
                fontSize: 'clamp(15px,1.55vw,18px)',
                lineHeight: 1.84,
                color: C.textMuted,
                maxWidth: 460,
                margin: '0 0 36px',
              }}
            >
              {row.body}
            </p>
          </Reveal>
          <Reveal delay={0.26}>
            <a href="#contact" style={{ textDecoration: 'none' }}>
              <MNButton>Nous contacter</MNButton>
            </a>
          </Reveal>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px){
          .mn-editrow > div:last-child > div{ grid-template-columns: 1fr !important; }
          .mn-editrow > div:last-child > div > *{ order: initial !important; }
        }
      `}</style>
    </div>
  );
}

function EditorialRows() {
  return (
    <section
      id="lieux"
      style={{
        background: C.bg,
        padding: 'clamp(80px,11vw,160px) clamp(24px,6vw,96px)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(80px,12vw,160px)',
        }}
      >
        {EDIT_ROWS.map((r) => (
          <EditorialRow key={r.eyebrow} row={r} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   7 · PROCESS PANEL — image collante + jalons à droite
   ════════════════════════════════════════════════════════════════════════════ */
function ProcessPanel() {
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
          gridTemplateColumns: '0.9fr 1.1fr',
          gap: 'clamp(48px,7vw,110px)',
          alignItems: 'start',
        }}
        className="mn-procpanel"
      >
        {/* Image collante */}
        <div
          style={{
            position: 'sticky',
            top: 100,
            alignSelf: 'start',
          }}
          className="mn-procpanel-sticky"
        >
          <div
            style={{
              overflow: 'hidden',
              border: `1px solid ${C.borderDark}`,
              aspectRatio: '4 / 5',
            }}
          >
            <img
              src={PH('1478146896981-b80fe463b330', 900)}
              alt="Bouquet nuptial — Maison Nuptiale"
              loading="lazy"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </div>
          <div style={{ marginTop: 24 }}>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 10.5,
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: C.accent,
                marginBottom: 10,
              }}
            >
              Notre méthode
            </div>
            <div
              style={{
                fontFamily: SERIF,
                fontStyle: 'italic',
                fontSize: 18,
                color: 'rgba(236,220,204,0.72)',
                lineHeight: 1.5,
              }}
            >
              « Vous rêvez, nous organisons. »
            </div>
          </div>
        </div>

        {/* Jalons qui défilent */}
        <div>
          <Reveal>
            <Eyebrow color={C.accent} light>
              Comment ça marche
            </Eyebrow>
          </Reveal>
          <Reveal delay={0.1}>
            <h2
              style={{
                fontFamily: SERIF,
                fontStyle: 'italic',
                fontSize: 'clamp(32px,5vw,66px)',
                fontWeight: 400,
                color: C.white,
                margin: '20px 0 52px',
                lineHeight: 1.06,
              }}
            >
              De la première rencontre{' '}
              <span style={{ color: C.accentLight }}>au Jour J.</span>
            </h2>
          </Reveal>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {PROCESS.map((step, i) => (
              <Reveal key={step.num} delay={0.06 * i}>
                <div
                  style={{
                    padding: 'clamp(28px,4vw,44px) 0',
                    borderTop: `1px solid rgba(212,160,160,0.22)`,
                    display: 'flex',
                    gap: 'clamp(20px,3vw,40px)',
                    alignItems: 'baseline',
                  }}
                >
                  <span
                    style={{
                      fontFamily: SERIF,
                      fontStyle: 'italic',
                      fontSize: 'clamp(32px,3.5vw,48px)',
                      color: C.accent,
                      minWidth: 'clamp(42px,4vw,64px)',
                      lineHeight: 1,
                    }}
                  >
                    {step.num}
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
                      {step.title}
                    </h4>
                    <p
                      style={{
                        fontFamily: SANS,
                        fontWeight: 300,
                        fontSize: 'clamp(14px,1.4vw,16px)',
                        lineHeight: 1.78,
                        color: 'rgba(236,220,204,0.68)',
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
        @media (max-width: 860px){
          .mn-procpanel{ grid-template-columns: 1fr !important; }
          .mn-procpanel-sticky{ position: static !important; }
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
    <section id="about"
      style={{
        background: C.bgAlt,
        padding: 'clamp(90px,12vw,172px) clamp(24px,6vw,96px)',
      }}
    >
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(52px,7vw,88px)' }}>
          <Reveal>
            <Eyebrow color={C.textMuted} align="center">
              Ils nous ont fait confiance
            </Eyebrow>
          </Reveal>
          <Reveal delay={0.1}>
            <h2
              style={{
                fontFamily: SERIF,
                fontStyle: 'italic',
                fontSize: 'clamp(34px,5vw,66px)',
                fontWeight: 400,
                color: C.ink,
                margin: '20px 0 0',
              }}
            >
              Des histoires{' '}
              <span style={{ color: C.accent }}>inoubliables.</span>
            </h2>
          </Reveal>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'clamp(28px,3.5vw,52px)',
          }}
        >
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.14} style={{ height: '100%' }}>
              <figure
                style={{
                  background: C.bgCard,
                  border: `1px solid ${C.border}`,
                  padding: 'clamp(34px,4vw,52px)',
                  margin: 0,
                  height: '100%',
                  boxSizing: 'border-box',
                  boxShadow: '0 20px 56px -36px rgba(28,20,14,0.28)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Heart
                  size={32}
                  color={C.blush}
                  strokeWidth={1.3}
                  style={{ marginBottom: 22 }}
                />
                <blockquote
                  style={{
                    fontFamily: SERIF,
                    fontStyle: 'italic',
                    fontSize: 'clamp(17px,1.8vw,22px)',
                    lineHeight: 1.64,
                    color: C.ink,
                    margin: '0 0 28px',
                    flex: 1,
                  }}
                >
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption
                  style={{ borderTop: `1px solid ${C.border}`, paddingTop: 22 }}
                >
                  <div
                    style={{
                      fontFamily: SERIF,
                      fontSize: 19,
                      color: C.accent,
                    }}
                  >
                    {t.name}
                  </div>
                  <div
                    style={{
                      fontFamily: SANS,
                      fontSize: 10.5,
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      color: C.textFaint,
                      marginTop: 6,
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
  const [tel, setTel] = useState('');
  const [typeEvenement, setTypeEvenement] = useState('');
  const [dateSouhaitee, setDateSouhaitee] = useState('');
  const [nbInvites, setNbInvites] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = () => {
    if (!prenom || !email || !typeEvenement) return;
    setSent(true);
  };

  const fieldStyle: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid rgba(155,114,72,0.45)',
    padding: '16px 2px',
    fontFamily: SANS,
    fontWeight: 300,
    fontSize: 16,
    color: C.white,
    outline: 'none',
    transition: 'border-color .35s',
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 10.5,
    letterSpacing: '0.28em',
    textTransform: 'uppercase',
    color: C.accent,
    display: 'block',
    marginBottom: 4,
    fontWeight: 500,
  };

  const gridTwo: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 'clamp(20px,3vw,40px)',
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
      {/* Motif de fond discret */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `radial-gradient(circle at 80% 20%, rgba(155,114,72,0.06) 0%, transparent 60%),
            radial-gradient(circle at 20% 80%, rgba(212,160,160,0.04) 0%, transparent 50%)`,
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
            Rencontrons-nous
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.1}>
          <h2
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: 'clamp(36px,5.5vw,78px)',
              fontWeight: 400,
              color: C.white,
              margin: '22px 0 18px',
              lineHeight: 1.04,
            }}
          >
            Commençons à{' '}
            <span style={{ color: C.accentLight }}>imaginer.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.18}>
          <p
            style={{
              fontFamily: SANS,
              fontStyle: 'italic',
              fontWeight: 300,
              fontSize: 'clamp(15px,1.6vw,18px)',
              lineHeight: 1.76,
              color: 'rgba(236,220,204,0.75)',
              maxWidth: 500,
              margin: '0 auto 56px',
            }}
          >
            Parlez-nous de votre projet — une première rencontre découverte gratuite
            pour imaginer ensemble votre journée parfaite.
          </p>
        </Reveal>

        {sent ? (
          <Reveal>
            <div
              style={{
                border: `1px solid rgba(155,114,72,0.45)`,
                padding: 'clamp(40px,5vw,60px)',
                background: 'rgba(155,114,72,0.06)',
              }}
            >
              <Heart
                size={36}
                color={C.blush}
                strokeWidth={1.2}
                style={{ marginBottom: 20 }}
              />
              <h3
                style={{
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  fontSize: 'clamp(26px,3.2vw,38px)',
                  fontWeight: 400,
                  color: C.white,
                  margin: '0 0 14px',
                }}
              >
                Merci {prenom && <span style={{ color: C.accentLight }}>{prenom}</span>},
              </h3>
              <p
                style={{
                  fontFamily: SANS,
                  fontWeight: 300,
                  fontSize: 16,
                  color: 'rgba(236,220,204,0.75)',
                  margin: 0,
                  lineHeight: 1.7,
                }}
              >
                nous vous proposons une rencontre découverte dans les 48h.
                <br />
                On a hâte d&apos;entendre votre histoire.
              </p>
            </div>
          </Reveal>
        ) : (
          <Reveal delay={0.26}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'clamp(28px,4vw,40px)',
                textAlign: 'left',
              }}
            >
              {/* Ligne Prénom + Email */}
              <div style={gridTwo} className="mn-formgrid">
                <div>
                  <label style={labelStyle} htmlFor="mn-prenom">Prénom</label>
                  <input
                    id="mn-prenom"
                    style={fieldStyle}
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    placeholder="Camille"
                    autoComplete="given-name"
                  />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="mn-email">Email</label>
                  <input
                    id="mn-email"
                    type="email"
                    style={fieldStyle}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="camille@exemple.fr"
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Ligne Téléphone + Type d'événement */}
              <div style={gridTwo} className="mn-formgrid">
                <div>
                  <label style={labelStyle} htmlFor="mn-tel">Téléphone</label>
                  <input
                    id="mn-tel"
                    type="tel"
                    style={fieldStyle}
                    value={tel}
                    onChange={(e) => setTel(e.target.value)}
                    placeholder="+33 6 00 00 00 00"
                    autoComplete="tel"
                  />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="mn-type">Type d&apos;événement</label>
                  <select
                    id="mn-type"
                    style={{
                      ...fieldStyle,
                      appearance: 'none',
                      WebkitAppearance: 'none',
                      cursor: 'pointer',
                      color: typeEvenement ? C.white : 'rgba(253,249,245,0.38)',
                    }}
                    value={typeEvenement}
                    onChange={(e) => setTypeEvenement(e.target.value)}
                  >
                    <option value="" style={{ color: '#1c140e', background: '#fdf9f5' }}>
                      Choisir…
                    </option>
                    <option value="Mariage civil" style={{ color: '#1c140e', background: '#fdf9f5' }}>Mariage civil</option>
                    <option value="Mariage religieux" style={{ color: '#1c140e', background: '#fdf9f5' }}>Mariage religieux</option>
                    <option value="PACS" style={{ color: '#1c140e', background: '#fdf9f5' }}>PACS</option>
                    <option value="Renouvellement des vœux" style={{ color: '#1c140e', background: '#fdf9f5' }}>Renouvellement des vœux</option>
                    <option value="Événement privé" style={{ color: '#1c140e', background: '#fdf9f5' }}>Événement privé</option>
                    <option value="Autre" style={{ color: '#1c140e', background: '#fdf9f5' }}>Autre</option>
                  </select>
                </div>
              </div>

              {/* Ligne Date souhaitée + Nombre d'invités */}
              <div style={gridTwo} className="mn-formgrid">
                <div>
                  <label style={labelStyle} htmlFor="mn-date">Date souhaitée</label>
                  <input
                    id="mn-date"
                    type="text"
                    style={fieldStyle}
                    value={dateSouhaitee}
                    onChange={(e) => setDateSouhaitee(e.target.value)}
                    placeholder="Ex : Juin 2026"
                  />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="mn-invites">Nombre d&apos;invités</label>
                  <input
                    id="mn-invites"
                    type="number"
                    min="1"
                    style={fieldStyle}
                    value={nbInvites}
                    onChange={(e) => setNbInvites(e.target.value)}
                    placeholder="Ex : 80"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label style={labelStyle} htmlFor="mn-message">Message</label>
                <textarea
                  id="mn-message"
                  rows={4}
                  style={{
                    ...fieldStyle,
                    resize: 'vertical',
                    fontFamily: SANS,
                  }}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Dites-nous en plus sur votre mariage idéal…"
                />
              </div>

              {/* Bouton submit */}
              <div style={{ textAlign: 'center', marginTop: 8 }}>
                <MNButton filled dark type="button" onClick={handleSubmit}>
                  Envoyer notre histoire
                </MNButton>
              </div>
            </div>
          </Reveal>
        )}
      </div>

      <style>{`
        @media (max-width: 600px){
          .mn-formgrid{ grid-template-columns: 1fr !important; }
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
      title: 'Services',
      items: [
        { label: 'Organisation complète', href: '#services' },
        { label: 'Coordination Jour J', href: '#services' },
        { label: 'Décoration & scénographie', href: '#services' },
        { label: 'Traiteur & menu', href: '#services' },
        { label: 'Voyage de noces', href: '#services' },
      ],
    },
    {
      title: 'Lieux & Destinations',
      items: [
        { label: 'Châteaux du Médoc', href: '#lieux' },
        { label: 'Bastides de Dordogne', href: '#lieux' },
        { label: "Bassin d'Arcachon", href: '#lieux' },
        { label: 'Destinations Europe', href: '#lieux' },
        { label: 'Sur-mesure', href: '#contact' },
      ],
    },
    {
      title: 'Contact',
      items: [
        { label: 'Rencontre découverte', href: '#contact' },
        { label: 'Nous écrire', href: '#contact' },
        { label: 'Bordeaux, France', href: '#contact' },
      ],
    },
  ];

  return (
    <footer
      style={{
        background: C.bgDarkAlt,
        borderTop: `1px solid rgba(155,114,72,0.16)`,
        padding: 'clamp(70px,9vw,110px) clamp(24px,6vw,96px) 40px',
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.5fr repeat(3, 1fr)',
          gap: 'clamp(36px,5vw,72px)',
        }}
        className="mn-footgrid"
      >
        {/* Colonne marque */}
        <div>
          <div
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: 'clamp(20px,2vw,26px)',
              letterSpacing: '0.06em',
              color: C.white,
            }}
          >
            Maison Nuptiale
          </div>
          <p
            style={{
              fontFamily: SANS,
              fontWeight: 300,
              fontSize: 14.5,
              lineHeight: 1.78,
              color: 'rgba(236,220,204,0.58)',
              marginTop: 20,
              maxWidth: 300,
            }}
          >
            Organisateur de mariage & événements. Bordeaux & vignobles. Maximum 12 couples par an.
          </p>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginTop: 24,
              fontFamily: SANS,
              fontSize: 11,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'rgba(236,220,204,0.5)',
            }}
          >
            <MapPin size={14} color={C.accent} strokeWidth={1.5} />
            Bordeaux, France
          </div>
        </div>

        {/* Colonnes liens */}
        {cols.map((col) => (
          <div key={col.title}>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 10.5,
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: C.accent,
                fontWeight: 500,
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
                      fontSize: 14.5,
                      color: 'rgba(236,220,204,0.64)',
                      textDecoration: 'none',
                      transition: 'color .3s',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color = C.accentLight;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(236,220,204,0.64)';
                    }}
                  >
                    {item.label}
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
          maxWidth: 1280,
          margin: '64px auto 0',
          paddingTop: 28,
          borderTop: '1px solid rgba(155,114,72,0.12)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
          fontFamily: SANS,
          fontWeight: 300,
          fontSize: 11,
          letterSpacing: '0.1em',
          color: 'rgba(236,220,204,0.38)',
        }}
      >
        <span>© 2026 Maison Nuptiale · Tous droits réservés</span>
        <span style={{ display: 'flex', gap: 24 }}>
          <a href="#contact" style={{ color: 'inherit', textDecoration: 'none' }}>
            Mentions légales
          </a>
          <a href="#contact" style={{ color: 'inherit', textDecoration: 'none' }}>
            Confidentialité
          </a>
        </span>
      </div>

      <style>{`
        @media (max-width: 860px){
          .mn-footgrid{ grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px){
          .mn-footgrid{ grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   PAGE ROOT
   ════════════════════════════════════════════════════════════════════════════ */
export default function Page() {
  return (
    <>
      <style>{`
        @import url('${FONT_LINK}');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        ::selection {
          background: rgba(155,114,72,0.28);
          color: #1c140e;
        }

        input::placeholder, textarea::placeholder {
          color: rgba(253,249,245,0.32);
          font-style: italic;
        }

        input:focus, textarea:focus, select:focus {
          border-bottom-color: rgba(155,114,72,0.9) !important;
        }

        /* iOS zoom prevention */
        @media (max-width: 860px){
          input, textarea, select { font-size: 16px !important; }
        }

        /* Responsive editorial rows */
        @media (max-width: 860px){
          .mn-editrow-inner{
            grid-template-columns: 1fr !important;
          }
          .mn-editrow-inner > *{ order: initial !important; }
        }
      `}</style>

      <main
        suppressHydrationWarning
        style={{
          background: C.bg,
          color: C.ink,
          fontFamily: SANS,
          overflowX: 'hidden',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        }}
      >
        <Nav />
        <Hero />
        <Intro />
        <ChapterSequence />
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
