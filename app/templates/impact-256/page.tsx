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
import { ArrowRight, ChevronDown, Trophy, Dumbbell, MapPin } from 'lucide-react';

/* ════════════════════════════════════════════════════════════════════════════
   FORCE BRUTE — Coach Sportif Personnel & Remise en Forme · Marseille
   Chorégraphie de défilement premium × typographie éditoriale sportive.
   Auto-suffisant. 'use client'.
   ════════════════════════════════════════════════════════════════════════════ */

/* ── Google Fonts ──────────────────────────────────────────────────────────── */
const FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500;600;700&family=Lora:ital,wght@0,400;0,600;1,400&display=swap';

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
  bg: '#f5f4f2',
  bgAlt: '#eae8e2',
  bgDark: '#0e0a06',
  bgDarkAlt: '#080602',
  bgCard: '#ffffff',
  accent: '#c83820',
  accentDark: '#a02c18',
  accentLight: '#f8d8d0',
  white: '#ffffff',
  ink: '#0e0a06',
  textMuted: '#3c2c20',
  textFaint: '#8a7060',
  border: '#dcd8d0',
  borderDark: 'rgba(200,56,32,0.2)',
  steel: '#6080a0',
};

const SERIF = "'Lora', Georgia, serif" as const;
const SANS = "'Oswald', system-ui, sans-serif" as const;

/* ── Easing partagé ──────────────────────────────────────────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ── Photos Unsplash ─────────────────────────────────────────────────────── */
const PHOTO = {
  weights: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2000&auto=format&fit=crop',
  weightsCard: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1600&auto=format&fit=crop',
  weightsEdit: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop',
  hiit: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1600&auto=format&fit=crop',
  hiitSticky: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=900&auto=format&fit=crop',
  outdoor: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=1600&auto=format&fit=crop',
  outdoorEdit: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=800&auto=format&fit=crop',
} as const;

/* ════════════════════════════════════════════════════════════════════════════
   Interfaces
   ════════════════════════════════════════════════════════════════════════════ */
interface Program {
  id: string;
  romanNumeral: string;
  label: string;
  title: string;
  body: string;
  img: string;
}

interface Offer {
  id: string;
  title: string;
  price: string;
  description: string;
  tags: string[];
  featured?: boolean;
}

interface EditRow {
  eyebrow: string;
  img: string;
  imgAlt: string;
  title: React.ReactNode;
  body: string;
  ghostNumeral: string;
  reverse?: boolean;
}

interface PillarItem {
  number: string;
  title: string;
  body: string;
}

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  result: string;
}

/* ════════════════════════════════════════════════════════════════════════════
   Data
   ════════════════════════════════════════════════════════════════════════════ */

const PROGRAMS: Program[] = [
  {
    id: 'force',
    romanNumeral: 'I',
    label: 'FORCE & MUSCULATION',
    title: 'Force & Musculation',
    body: 'Prise de masse, définition musculaire, powerlifting — des programmes périodisés sur mesure.',
    img: PHOTO.weights,
  },
  {
    id: 'cardio',
    romanNumeral: 'II',
    label: 'CARDIO & HIIT',
    title: 'Cardio & HIIT',
    body: 'Perte de poids accélérée, endurance, VO2max — séances courtes et intenses pour des résultats rapides.',
    img: PHOTO.hiit,
  },
  {
    id: 'wellness',
    romanNumeral: 'III',
    label: 'BIEN-ÊTRE & MOBILITÉ',
    title: 'Bien-être & Mobilité',
    body: "Yoga sportif, stretching actif, récupération — l'entraînement qui préserve votre corps sur le long terme.",
    img: PHOTO.outdoor,
  },
];

const OFFERS: Offer[] = [
  {
    id: 'decouverte',
    title: 'Séance découverte offerte',
    price: 'Gratuit',
    description: 'Une heure ensemble pour définir vos objectifs, tester mon approche, et décider sans pression.',
    tags: ['1 séance', 'Bilan inclus'],
  },
  {
    id: 'pack10',
    title: 'Pack 10 séances',
    price: '550 €',
    description: 'Idéal pour lancer votre transformation. Programmes complets, suivi entre les séances.',
    tags: ['10 séances', 'Programme inclus'],
    featured: true,
  },
  {
    id: 'mensuel',
    title: 'Suivi mensuel illimité',
    price: '290 €/mois',
    description: 'Coaching hebdomadaire intensif, ajustements continuels, disponibilité prioritaire.',
    tags: ['Illimité', 'Prioritaire'],
  },
  {
    id: 'online',
    title: 'Coaching en ligne',
    price: '149 €/mois',
    description: 'Programmes personnalisés + suivi vidéo. Où que vous soyez dans le monde.',
    tags: ['À distance', 'Flexible'],
  },
  {
    id: 'competition',
    title: 'Préparation compétition',
    price: 'Sur devis',
    description: 'Trail, triathlon, compétition de force — périodisation avancée pour performer au bon moment.',
    tags: ['Spécifique', 'Périodisé'],
  },
  {
    id: 'nutrition',
    title: 'Programme nutrition',
    price: '99 €',
    description: 'Plan alimentaire adapté à vos objectifs et votre mode de vie. Sans restriction obsessionnelle.',
    tags: ['Nutrition', '30 jours'],
  },
];

const EDIT_ROWS: EditRow[] = [
  {
    eyebrow: 'La méthode',
    img: PHOTO.weightsEdit,
    imgAlt: 'Entraînement de force avec haltères',
    title: (
      <>
        Progresser /{' '}
        <em>vraiment.</em>
      </>
    ),
    body: "12 ans d'expérience terrain, BPJEPS + D.E. STAPS et certification coach nutrition. Je construis des programmes périodisés sur mesure — pas de plans génériques copiés d'internet. Chaque client est un cas unique.",
    ghostNumeral: '01',
  },
  {
    eyebrow: 'Où vous entraîner',
    img: PHOTO.outdoorEdit,
    imgAlt: 'Coaching sportif en extérieur à Marseille',
    title: (
      <>
        À domicile /{' '}
        <em>ou en salle.</em>
      </>
    ),
    body: "Je me déplace chez vous ou dans votre salle sur Marseille, Aix-en-Provence et Aubagne. Le coaching en ligne est disponible pour toute la France et l'international — mêmes résultats, même exigence.",
    ghostNumeral: '02',
    reverse: true,
  },
];

const PILLARS: PillarItem[] = [
  {
    number: '01',
    title: 'Bilan initial complet',
    body: "Morphologie, mobilité, objectifs, mode de vie — on commence par vous connaître vraiment avant d'écrire une seule ligne de programme.",
  },
  {
    number: '02',
    title: 'Programme 100% personnalisé',
    body: "Pas de copier-coller d'internet. Votre programme est écrit pour vous, revu chaque mois, adapté à vos contraintes réelles.",
  },
  {
    number: '03',
    title: 'Suivi hebdomadaire & ajustements',
    body: "On s'adapte à vos progrès. Chaque semaine, on analyse, on ajuste, on avance. La progression n'est jamais linéaire — et c'est normal.",
  },
  {
    number: '04',
    title: 'Nutrition coaching intégré',
    body: "Les séances ne suffisent pas sans l'alimentation. Je vous accompagne sur les deux piliers pour des résultats durables.",
  },
];

const TESTIMONIALS: Testimonial[] = [
  {
    quote: "Après 10 régimes ratés, je n'y croyais plus. En 5 mois avec lui, j'ai perdu 18 kg sans jamais me sentir privée. Sa méthode change tout.",
    name: 'Sandrine M.',
    role: 'Cadre administrative · Marseille',
    result: '−18 kg en 5 mois',
  },
  {
    quote: "J'ai terminé mon premier triathlon après 6 mois de préparation coaching. Le programme de périodisation était chirurgical. Je n'aurais pas pu sans lui.",
    name: 'Thomas R.',
    role: 'Cycliste amateur · Aix-en-Provence',
    result: 'Triathlon complété',
  },
];

/* ════════════════════════════════════════════════════════════════════════════
   Primitives
   ════════════════════════════════════════════════════════════════════════════ */

/** Étiquette fine avec filet rouge. */
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
  const _ = dark;
  const wrap: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    justifyContent: align === 'center' ? 'center' : 'flex-start',
  };
  const rule: React.CSSProperties = {
    width: 40,
    height: 2,
    background: color,
    flexShrink: 0,
  };
  const label: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 11,
    letterSpacing: '0.38em',
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

/** Révélation scroll : fondu + translation, une seule fois. */
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
      transition={{ duration: 1.0, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Bouton rouge ou contour rouge. */
function AccentButton({
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
    padding: '15px 32px',
    fontFamily: SANS,
    fontSize: 12,
    letterSpacing: '0.24em',
    textTransform: 'uppercase',
    fontWeight: 600,
    cursor: 'pointer',
    border: `2px solid ${C.accent}`,
    background: filled ? C.accent : 'transparent',
    color: filled ? C.white : dark ? C.white : C.accent,
    transition: 'all .45s cubic-bezier(.16,1,.3,1)',
  };
  const hov: React.CSSProperties = hover
    ? filled
      ? { background: C.accentDark, borderColor: C.accentDark, transform: 'translateY(-2px)', boxShadow: '0 12px 32px -10px rgba(200,56,32,0.55)' }
      : { background: 'rgba(200,56,32,0.10)', transform: 'translateY(-2px)' }
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
        size={15}
        style={{
          transform: hover ? 'translateX(5px)' : 'none',
          transition: 'transform .45s cubic-bezier(.16,1,.3,1)',
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
    { label: 'Programmes', href: '#programmes' },
    { label: 'Tarifs', href: '#tarifs' },
    { label: 'Méthode', href: '#methode' },
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
    background: solid ? 'rgba(14,10,6,0.96)' : 'transparent',
    backdropFilter: solid ? 'blur(16px) saturate(130%)' : 'none',
    WebkitBackdropFilter: solid ? 'blur(16px) saturate(130%)' : 'none',
    borderBottom: solid ? '1px solid rgba(200,56,32,0.22)' : '1px solid transparent',
    transition: 'all .55s cubic-bezier(.16,1,.3,1)',
  };
  const brand: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 22,
    fontWeight: 700,
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    color: C.white,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  };
  const brandAccent: React.CSSProperties = {
    color: C.accent,
  };
  const linkRow: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'clamp(20px,2.6vw,42px)',
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
            style={{ height: 34, maxWidth: 160, objectFit: 'contain', display: 'block' }}
          />
        ) : (
          <>
            <Dumbbell size={20} color={C.accent} strokeWidth={2} />
            <span>FORCE<span style={brandAccent}> BRUTE</span></span>
          </>
        )}
      </div>
      <div style={linkRow} className="fb-navlinks">
        {links.map((l) => (
          <NavLink key={l.label} label={l.label} href={l.href} />
        ))}
      </div>
      <div className="fb-navcta">
        <a href="#contact" style={{ textDecoration: 'none' }}>
          <AccentButton filled>Séance offerte</AccentButton>
        </a>
      </div>
      
        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="fb-burger"
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
          .fb-navlinks { display: none !important; }
          .fb-burger { display: flex !important; flex-direction: column; }
          .fb-navcta { display: none !important; }
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
        letterSpacing: '0.20em',
        textTransform: 'uppercase',
        color: h ? C.accent : C.white,
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
          height: 2,
          width: h ? '100%' : '0%',
          background: C.accent,
          transition: 'width .45s cubic-bezier(.16,1,.3,1)',
        }}
      />
    </a>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   Hero (100vh) — parallaxe + titre bloc SANS
   ════════════════════════════════════════════════════════════════════════════ */
function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.18]);
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '16%']);
  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '-44%']);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.72], [1, 0]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const section: React.CSSProperties = {
    position: 'relative',
    height: '100dvh',
    minHeight: 640,
    overflow: 'hidden',
    background: C.bgDark,
  };

  return (
    <section id="hero" ref={ref} style={section}>
      {/* Photo plein cadre avec parallaxe */}
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
          src={PHOTO.weights}
          alt="Coach sportif Force Brute — entraînement de force à Marseille"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </motion.div>

      {/* Voile gradient sombre */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(14,10,6,0.55) 0%, rgba(14,10,6,0.10) 30%, rgba(14,10,6,0.55) 68%, rgba(14,10,6,0.92) 100%)',
        }}
      />
      {/* Voile latéral pour lisibilité du texte */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to right, rgba(14,10,6,0.72) 0%, rgba(14,10,6,0.22) 60%, transparent 100%)',
        }}
      />

      {/* Contenu parallaxe */}
      <motion.div
        style={{
          position: 'relative',
          zIndex: 2,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: 'clamp(24px,5vw,80px) clamp(24px,6vw,96px)',
          paddingBottom: 'clamp(80px,10vw,120px)',
          y: titleY,
          opacity: titleOpacity,
        }}
      >
        <Reveal y={16}>
          <Eyebrow color={C.accent}>Coach Sportif · Marseille</Eyebrow>
        </Reveal>

        {/* Stripe rouge sous l'eyebrow, au-dessus du titre */}
        <div style={{ width: 80, height: 4, background: C.accent, margin: '20px 0 16px' }} />

        <motion.h1
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3, ease: EASE, delay: 0.12 }}
          style={{
            fontFamily: SANS,
            fontWeight: 700,
            textTransform: 'uppercase',
            color: C.white,
            fontSize: 'clamp(4rem,12vw,13rem)',
            lineHeight: 0.85,
            letterSpacing: '-0.01em',
            margin: '0 0 28px',
            textShadow: '0 8px 48px rgba(0,0,0,0.55)',
          }}
        >
          DEVENEZ<br />
          <span style={{ color: C.accent }}>PLUS</span> FORT.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.38 }}
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: 'clamp(17px,2vw,24px)',
            color: 'rgba(255,255,255,0.84)',
            maxWidth: 520,
            lineHeight: 1.6,
            marginBottom: 40,
          }}
        >
          Coaching personnalisé · Résultats garantis. La méthode qui transforme
          réellement votre corps et votre santé.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, ease: EASE, delay: 0.6 }}
          style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}
        >
          <AccentButton filled dark>
            Séance découverte offerte
          </AccentButton>
          <AccentButton dark>
            Voir les programmes
          </AccentButton>
        </motion.div>
      </motion.div>

      {/* Cue de défilement */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: 32,
          right: 'clamp(24px,5vw,80px)',
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
            color: 'rgba(255,255,255,0.6)',
          }}
        >
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 9, 0] }}
          transition={{ duration: 2.0, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={18} color="rgba(255,255,255,0.6)" strokeWidth={1.5} />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   Intro — citation centrale SERIF italique
   ════════════════════════════════════════════════════════════════════════════ */
function Intro() {
  const sec: React.CSSProperties = {
    background: C.bgAlt,
    padding: 'clamp(96px,13vw,190px) clamp(24px,8vw,160px)',
    textAlign: 'center',
  };
  return (
    <section style={sec}>
      <Reveal>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 36 }}>
          <Eyebrow color={C.textMuted} align="center">La philosophie</Eyebrow>
        </div>
      </Reveal>
      <Reveal delay={0.1}>
        <p
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 'clamp(24px,3.4vw,46px)',
            lineHeight: 1.38,
            fontWeight: 400,
            maxWidth: 900,
            margin: '0 auto',
            color: C.ink,
          }}
        >
          "Les résultats arrivent quand la méthode rencontre la constance.
          Je vous apporte les deux."
        </p>
      </Reveal>
      <Reveal delay={0.2}>
        <div
          style={{
            width: 2,
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
   ProgramSequence — crossfade sticky 320vh (3 programmes)
   ════════════════════════════════════════════════════════════════════════════ */
function ProgramLayer({
  program,
  i,
  total,
  progress,
}: {
  program: Program;
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
        src={program.img}
        alt={program.title}
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

function ProgramCaption({
  program,
  i,
  total,
  progress,
}: {
  program: Program;
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
  const y = useTransform(progress, [start, end], [30, -30]);

  return (
    <motion.div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: 'clamp(32px,5vw,80px) clamp(24px,6vw,96px)',
        paddingBottom: 'clamp(80px,10vw,120px)',
        opacity,
        y,
      }}
    >
      {/* Section label top-right */}
      <div
        style={{
          position: 'absolute',
          top: 'clamp(80px,10vw,120px)',
          right: 'clamp(24px,4vw,64px)',
          textAlign: 'right',
        }}
      >
        <div
          style={{
            fontFamily: SANS,
            fontSize: 10,
            letterSpacing: '0.38em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.55)',
            fontWeight: 500,
            marginBottom: 6,
          }}
        >
          {program.label}
        </div>
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 'clamp(48px,8vw,110px)',
            color: 'rgba(200,56,32,0.22)',
            lineHeight: 1,
          }}
        >
          {program.romanNumeral}
        </div>
      </div>

      <div style={{ maxWidth: 580 }}>
        <div
          style={{
            fontFamily: SANS,
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.38em',
            textTransform: 'uppercase',
            color: C.accent,
            marginBottom: 14,
          }}
        >
          {program.romanNumeral} — {program.label}
        </div>
        <h2
          style={{
            fontFamily: SANS,
            fontWeight: 700,
            textTransform: 'uppercase',
            fontSize: 'clamp(36px,5.5vw,78px)',
            color: C.white,
            lineHeight: 0.92,
            margin: '0 0 18px',
            textShadow: '0 6px 36px rgba(0,0,0,0.6)',
          }}
        >
          {program.title.toUpperCase()}
        </h2>
        <p
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 'clamp(16px,1.8vw,21px)',
            color: 'rgba(255,255,255,0.84)',
            lineHeight: 1.6,
            maxWidth: 460,
          }}
        >
          {program.body}
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
      style={{ height: 3, width, background: C.accent, opacity }}
    />
  );
}

function ProgramSequence() {
  const n = PROGRAMS.length;
  const progress = useMotionValue(0.5 / n);
  const [active, setActive] = useState(0);
  const goTo = (i: number) => {
    setActive(i);
    progress.set((i + 0.5) / n);
  };

  return (
    <section
      id="programmes"
      style={{ height: '100dvh', overflow: 'hidden', position: 'relative', background: C.bgDark }}
    >
      <div
        style={{
          position: 'relative',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {/* Calques photo crossfade */}
        {PROGRAMS.map((p, i) => (
          <ProgramLayer
            key={p.id}
            program={p}
            i={i}
            total={PROGRAMS.length}
            progress={progress}
          />
        ))}

        {/* Voile lisibilité */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to bottom, rgba(14,10,6,0.38) 0%, rgba(14,10,6,0.08) 40%, rgba(14,10,6,0.60) 75%, rgba(14,10,6,0.88) 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to right, rgba(14,10,6,0.52) 0%, rgba(14,10,6,0.10) 50%, transparent 100%)',
          }}
        />

        {/* Légendes */}
        {PROGRAMS.map((p, i) => (
          <ProgramCaption
            key={p.id}
            program={p}
            i={i}
            total={PROGRAMS.length}
            progress={progress}
          />
        ))}

        {/* Points de progression */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 10,
          }}
        >
          {PROGRAMS.map((p, i) => (
            <ProgressDot
              key={p.id}
              i={i}
              total={PROGRAMS.length}
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
   OfferCards — 6 cartes tarifs
   ════════════════════════════════════════════════════════════════════════════ */
function OfferCard({ offer, i }: { offer: Offer; i: number }) {
  const [hover, setHover] = useState(false);
  const card: React.CSSProperties = {
    background: C.bgCard,
    border: `1px solid ${hover ? C.accent : C.border}`,
    borderLeft: `4px solid ${offer.featured ? C.accent : hover ? C.accent : C.border}`,
    padding: 'clamp(28px,3.5vw,42px)',
    transform: hover ? 'translateY(-8px)' : 'none',
    boxShadow: hover
      ? '0 32px 64px -28px rgba(200,56,32,0.22)'
      : '0 4px 24px -12px rgba(14,10,6,0.10)',
    transition: 'all .5s cubic-bezier(.16,1,.3,1)',
    cursor: 'pointer',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    boxSizing: 'border-box',
  };
  return (
    <Reveal delay={i * 0.08} style={{ height: '100%' }}>
      <article
        style={card}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {offer.featured && (
          <div
            style={{
              position: 'absolute',
              top: 18,
              right: 18,
              fontFamily: SANS,
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: C.white,
              background: C.accent,
              padding: '5px 10px',
            }}
          >
            Populaire
          </div>
        )}
        <h3
          style={{
            fontFamily: SANS,
            fontWeight: 600,
            textTransform: 'uppercase',
            fontSize: 'clamp(15px,1.6vw,20px)',
            letterSpacing: '0.06em',
            color: C.ink,
            margin: '0 0 8px',
          }}
        >
          {offer.title}
        </h3>
        <div
          style={{
            fontFamily: SANS,
            fontSize: 'clamp(22px,2.4vw,30px)',
            fontWeight: 700,
            color: C.accent,
            marginBottom: 16,
            lineHeight: 1,
          }}
        >
          {offer.price}
        </div>
        <p
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 'clamp(14px,1.4vw,17px)',
            lineHeight: 1.65,
            color: C.textMuted,
            margin: '0 0 20px',
            flex: 1,
          }}
        >
          {offer.description}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 'auto' }}>
          {offer.tags.map((tag) => (
            <span
              key={tag}
              style={{
                fontFamily: SANS,
                fontSize: 9,
                fontWeight: 600,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: C.accent,
                background: C.accentLight,
                padding: '4px 10px',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </article>
    </Reveal>
  );
}

function OfferCards() {
  const sec: React.CSSProperties = {
    background: C.bg,
    padding: 'clamp(90px,12vw,170px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
    gap: 'clamp(20px,2.4vw,36px)',
    maxWidth: 1260,
    margin: '0 auto',
  };
  return (
    <section style={sec} id="tarifs">
      <div style={{ maxWidth: 1260, margin: '0 auto 56px' }}>
        <Reveal>
          <Eyebrow color={C.accent}>Tarifs & Formules</Eyebrow>
        </Reveal>
        <Reveal delay={0.09}>
          <h2
            style={{
              fontFamily: SANS,
              fontWeight: 700,
              textTransform: 'uppercase',
              fontSize: 'clamp(36px,5.5vw,72px)',
              color: C.ink,
              margin: '20px 0 0',
              lineHeight: 0.92,
              letterSpacing: '-0.01em',
            }}
          >
            INVESTISSEZ<br />
            <span style={{ color: C.accent }}>EN VOUS.</span>
          </h2>
        </Reveal>
      </div>
      <div style={grid}>
        {OFFERS.map((o, i) => (
          <OfferCard key={o.id} offer={o} i={i} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   EditorialRows — 2 rangées image/texte alternées
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

function EditRowItem({ row, i }: { row: EditRow; i: number }) {
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
    aspectRatio: '4 / 5',
  };
  const txt: React.CSSProperties = {
    order: row.reverse ? 1 : 2,
    position: 'relative',
  };
  return (
    <div style={wrap} className="fb-editrow">
      <Reveal y={50} style={imgWrap}>
        <ParallaxImg src={row.img} alt={row.imgAlt} />
      </Reveal>
      <div style={txt}>
        {/* Numéral fantôme */}
        <div
          style={{
            position: 'absolute',
            top: -60,
            right: row.reverse ? undefined : -20,
            left: row.reverse ? -20 : undefined,
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 'clamp(100px,14vw,200px)',
            color: C.steel,
            opacity: 0.10,
            lineHeight: 1,
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        >
          {row.ghostNumeral}
        </div>
        <Reveal>
          <Eyebrow color={C.accent}>{row.eyebrow}</Eyebrow>
        </Reveal>
        <Reveal delay={0.09}>
          <h3
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(30px,4.2vw,58px)',
              fontWeight: 400,
              color: C.ink,
              margin: '20px 0 24px',
              lineHeight: 1.1,
            }}
          >
            {row.title}
          </h3>
        </Reveal>
        <Reveal delay={0.18}>
          <p
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(15px,1.55vw,18px)',
              lineHeight: 1.8,
              color: C.textMuted,
              maxWidth: 440,
              marginBottom: 32,
            }}
          >
            {row.body}
          </p>
        </Reveal>
        <Reveal delay={0.26}>
          <AccentButton>En savoir plus</AccentButton>
        </Reveal>
      </div>
      <style>{`
        @media (max-width: 860px) {
          .fb-editrow { grid-template-columns: 1fr !important; }
          .fb-editrow > * { order: initial !important; }
        }
      `}</style>
    </div>
  );
}

function EditorialRows() {
  const sec: React.CSSProperties = {
    background: C.bg,
    padding: 'clamp(80px,10vw,150px) clamp(24px,6vw,96px)',
  };
  return (
    <section style={sec} id="methode">
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(80px,11vw,150px)',
        }}
      >
        {EDIT_ROWS.map((row, i) => (
          <EditRowItem key={row.eyebrow} row={row} i={i} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   PillarPanel — image sticky gauche, 4 piliers droite
   ════════════════════════════════════════════════════════════════════════════ */
function PillarPanel() {
  const sec: React.CSSProperties = {
    background: C.bgDark,
    padding: 'clamp(90px,12vw,160px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '0.95fr 1.05fr',
    gap: 'clamp(48px,7vw,100px)',
    maxWidth: 1240,
    margin: '0 auto',
    alignItems: 'start',
  };
  const stickyLeft: React.CSSProperties = {
    position: 'sticky',
    top: 100,
    alignSelf: 'start',
  };

  return (
    <section style={sec}>
      <div style={grid} className="fb-pilpanel">
        {/* Image sticky gauche */}
        <div style={stickyLeft} className="fb-pilpanel-sticky">
          <Reveal>
            <div
              style={{
                overflow: 'hidden',
                aspectRatio: '3 / 4',
                border: `1px solid ${C.borderDark}`,
              }}
            >
              <img
                src={PHOTO.hiitSticky}
                alt="Méthode de coaching Force Brute"
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
            <div style={{ marginTop: 22 }}>
              <div
                style={{
                  fontFamily: SANS,
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  color: C.accent,
                  marginBottom: 10,
                }}
              >
                Coach Certifié · BPJEPS + D.E. STAPS
              </div>
              <div
                style={{
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  fontSize: 17,
                  color: 'rgba(255,255,255,0.72)',
                  lineHeight: 1.6,
                }}
              >
                "12 ans à transformer des corps et des
                habitudes — la méthode s'affine à chaque client."
              </div>
            </div>
          </Reveal>
        </div>

        {/* Piliers droite */}
        <div>
          <Reveal>
            <Eyebrow color={C.accent}>La méthode en 4 étapes</Eyebrow>
          </Reveal>
          <Reveal delay={0.09}>
            <h2
              style={{
                fontFamily: SANS,
                fontWeight: 700,
                textTransform: 'uppercase',
                fontSize: 'clamp(34px,4.8vw,62px)',
                color: C.white,
                margin: '20px 0 52px',
                lineHeight: 0.92,
                letterSpacing: '-0.01em',
              }}
            >
              UNE APPROCHE<br />
              <span style={{ color: C.accent }}>SANS COMPROMIS.</span>
            </h2>
          </Reveal>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {PILLARS.map((pillar, i) => (
              <Reveal key={pillar.number} delay={0.06 * i}>
                <div
                  style={{
                    padding: 'clamp(28px,3.5vw,40px) 0',
                    borderTop: `1px solid rgba(96,128,160,0.28)`,
                    display: 'flex',
                    gap: 'clamp(22px,3vw,40px)',
                    alignItems: 'baseline',
                  }}
                >
                  <span
                    style={{
                      fontFamily: SANS,
                      fontWeight: 700,
                      fontSize: 'clamp(28px,3vw,40px)',
                      color: C.accent,
                      minWidth: 52,
                      lineHeight: 1,
                      flexShrink: 0,
                    }}
                  >
                    {pillar.number}
                  </span>
                  <div>
                    <h4
                      style={{
                        fontFamily: SANS,
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        fontSize: 'clamp(16px,1.7vw,21px)',
                        color: C.white,
                        margin: '0 0 10px',
                      }}
                    >
                      {pillar.title}
                    </h4>
                    <p
                      style={{
                        fontFamily: SERIF,
                        fontStyle: 'italic',
                        fontSize: 'clamp(14px,1.4vw,17px)',
                        lineHeight: 1.7,
                        color: 'rgba(255,255,255,0.66)',
                        margin: 0,
                      }}
                    >
                      {pillar.body}
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
          .fb-pilpanel { grid-template-columns: 1fr !important; }
          .fb-pilpanel-sticky { position: static !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   Testimonials — 2 cartes blanches sur bgAlt
   ════════════════════════════════════════════════════════════════════════════ */
function Testimonials() {
  const sec: React.CSSProperties = {
    background: C.bgAlt,
    padding: 'clamp(90px,12vw,170px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))',
    gap: 'clamp(28px,4vw,56px)',
    maxWidth: 1100,
    margin: '0 auto',
  };
  return (
    <section style={sec}>
      <div style={{ maxWidth: 1100, margin: '0 auto 60px', textAlign: 'center' }}>
        <Reveal>
          <Eyebrow color={C.textMuted} align="center">Témoignages</Eyebrow>
        </Reveal>
        <Reveal delay={0.09}>
          <h2
            style={{
              fontFamily: SANS,
              fontWeight: 700,
              textTransform: 'uppercase',
              fontSize: 'clamp(32px,5vw,64px)',
              color: C.ink,
              margin: '20px 0 0',
              lineHeight: 0.9,
              letterSpacing: '-0.01em',
            }}
          >
            ILS ONT<br />
            <span style={{ color: C.accent }}>CHANGÉ.</span>
          </h2>
        </Reveal>
      </div>
      <div style={grid}>
        {TESTIMONIALS.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.13} style={{ height: '100%' }}>
            <figure
              style={{
                background: C.bgCard,
                border: `1px solid ${C.border}`,
                borderTop: `4px solid ${C.accent}`,
                padding: 'clamp(32px,4vw,50px)',
                margin: 0,
                height: '100%',
                boxSizing: 'border-box',
                boxShadow: '0 20px 52px -34px rgba(14,10,6,0.22)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Trophy size={30} color={C.accent} strokeWidth={1.6} />
              <div
                style={{
                  fontFamily: SANS,
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase',
                  color: C.accent,
                  margin: '16px 0 20px',
                }}
              >
                {t.result}
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
                    fontFamily: SANS,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    fontSize: 16,
                    color: C.ink,
                    marginBottom: 4,
                  }}
                >
                  {t.name}
                </div>
                <div
                  style={{
                    fontFamily: SERIF,
                    fontStyle: 'italic',
                    fontSize: 13,
                    color: C.textFaint,
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
   BookingForm — formulaire contact bgDark centré 720px
   ════════════════════════════════════════════════════════════════════════════ */
function BookingForm() {
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [tel, setTel] = useState('');
  const [objectif, setObjectif] = useState('');
  const [dispo, setDispo] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prenom || !email || !objectif) return;
    setSent(true);
  };

  const sec: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    background: C.bgDark,
    padding: 'clamp(96px,13vw,180px) clamp(24px,6vw,96px)',
  };

  const fieldBase: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box' as const,
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid rgba(200,56,32,0.38)',
    padding: '14px 2px',
    fontFamily: SERIF,
    fontSize: 17,
    color: C.white,
    outline: 'none',
    transition: 'border-color .35s',
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: '0.30em',
    textTransform: 'uppercase',
    color: C.accent,
    display: 'block',
    marginBottom: 4,
  };

  return (
    <section style={sec} id="contact">
      {/* Fond photo fantôme */}
      <img
        src={PHOTO.outdoor}
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
          <Eyebrow color={C.accent} align="center">Première séance offerte</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SANS,
              fontWeight: 700,
              textTransform: 'uppercase',
              fontSize: 'clamp(36px,5.5vw,72px)',
              color: C.white,
              margin: '22px 0 16px',
              lineHeight: 0.9,
              letterSpacing: '-0.01em',
            }}
          >
            COMMENÇONS<br />
            <span style={{ color: C.accent }}>MAINTENANT.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: 'clamp(15px,1.6vw,19px)',
              lineHeight: 1.7,
              color: 'rgba(255,255,255,0.74)',
              maxWidth: 500,
              margin: '0 auto 52px',
            }}
          >
            Une séance découverte gratuite pour se rencontrer, définir
            vos objectifs et décider ensemble. Sans engagement.
          </p>
        </Reveal>

        {sent ? (
          <Reveal>
            <div
              style={{
                border: `1px solid ${C.accent}`,
                padding: 'clamp(36px,5vw,60px)',
                background: 'rgba(200,56,32,0.07)',
              }}
            >
              <Trophy size={38} color={C.accent} strokeWidth={1.5} />
              <h3
                style={{
                  fontFamily: SANS,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  fontSize: 28,
                  color: C.white,
                  margin: '20px 0 14px',
                  letterSpacing: '0.05em',
                }}
              >
                C'est parti{prenom ? ` ${prenom}` : ''} !
              </h3>
              <p
                style={{
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  fontSize: 18,
                  color: 'rgba(255,255,255,0.78)',
                  margin: 0,
                  lineHeight: 1.65,
                }}
              >
                On vous recontacte dans les 24h pour fixer votre première séance.
                Préparez-vous — ça commence vraiment là.
              </p>
            </div>
          </Reveal>
        ) : (
          <Reveal delay={0.24}>
            <form
              onSubmit={onSubmit}
              style={{ display: 'flex', flexDirection: 'column', gap: 32, textAlign: 'left' }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }} className="fb-form-grid">
                <div>
                  <label style={labelStyle} htmlFor="fb-prenom">Prénom *</label>
                  <input
                    id="fb-prenom"
                    style={fieldBase}
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    placeholder="Votre prénom"
                    autoComplete="given-name"
                    required
                  />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="fb-email">Email *</label>
                  <input
                    id="fb-email"
                    type="email"
                    style={fieldBase}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.fr"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle} htmlFor="fb-tel">Téléphone</label>
                <input
                  id="fb-tel"
                  type="tel"
                  style={fieldBase}
                  value={tel}
                  onChange={(e) => setTel(e.target.value)}
                  placeholder="06 00 00 00 00"
                  autoComplete="tel"
                />
              </div>

              <div>
                <label style={labelStyle} htmlFor="fb-objectif">Votre objectif *</label>
                <select
                  id="fb-objectif"
                  style={{
                    ...fieldBase,
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    cursor: 'pointer',
                    color: objectif ? C.white : 'rgba(255,255,255,0.42)',
                  }}
                  value={objectif}
                  onChange={(e) => setObjectif(e.target.value)}
                  required
                >
                  <option value="" style={{ color: '#000' }}>Choisir un objectif…</option>
                  <option value="Perte de poids" style={{ color: '#000' }}>Perte de poids</option>
                  <option value="Prise de masse" style={{ color: '#000' }}>Prise de masse</option>
                  <option value="Remise en forme" style={{ color: '#000' }}>Remise en forme</option>
                  <option value="Préparation sportive" style={{ color: '#000' }}>Préparation sportive</option>
                  <option value="Bien-être" style={{ color: '#000' }}>Bien-être</option>
                  <option value="Autre" style={{ color: '#000' }}>Autre</option>
                </select>
              </div>

              <div>
                <label style={labelStyle} htmlFor="fb-dispo">Disponibilités</label>
                <input
                  id="fb-dispo"
                  style={fieldBase}
                  value={dispo}
                  onChange={(e) => setDispo(e.target.value)}
                  placeholder="Ex : Lundi matin, mercredi soir…"
                />
              </div>

              <div>
                <label style={labelStyle} htmlFor="fb-message">Message</label>
                <textarea
                  id="fb-message"
                  style={{
                    ...fieldBase,
                    resize: 'none',
                    minHeight: 100,
                    display: 'block',
                  }}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Parlez-moi de votre situation actuelle, vos contraintes…"
                  rows={4}
                />
              </div>

              <div style={{ textAlign: 'center', marginTop: 8 }}>
                <AccentButton filled type="submit" dark>
                  Réserver ma séance offerte
                </AccentButton>
              </div>
            </form>
          </Reveal>
        )}
      </div>
      <style>{`
        @media (max-width: 860px) {
          .fb-form-grid { grid-template-columns: 1fr !important; }
        }
        input::placeholder,
        textarea::placeholder { color: rgba(255,255,255,0.38) !important; font-family: ${SERIF}; font-style: italic; }
        select option { background: #1c1c1c; }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   Footer — bgDarkAlt, 4 colonnes, headers rouges
   ════════════════════════════════════════════════════════════════════════════ */
function Footer() {
  const cols = [
    {
      title: 'Programmes',
      items: ['Force & Musculation', 'Cardio & HIIT', 'Bien-être & Mobilité', 'Préparation compétition'],
      hrefs: ['#programmes', '#programmes', '#programmes', '#tarifs'],
    },
    {
      title: 'Services',
      items: ['Coaching à domicile', 'Coaching en salle', 'Coaching en ligne', 'Nutrition'],
      hrefs: ['#methode', '#methode', '#tarifs', '#tarifs'],
    },
    {
      title: 'Contact',
      items: ['Séance offerte', 'Réserver', 'Marseille · Aix · Aubagne', 'contact@forcebrute.fr'],
      hrefs: ['#contact', '#contact', '#contact', '#contact'],
    },
  ];

  const foot: React.CSSProperties = {
    background: C.bgDarkAlt,
    borderTop: `1px solid rgba(200,56,32,0.18)`,
    padding: 'clamp(70px,9vw,110px) clamp(24px,6vw,96px) 40px',
  };

  return (
    <footer style={foot}>
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.5fr repeat(3, 1fr)',
          gap: 'clamp(32px,4.5vw,68px)',
        }}
        className="fb-footgrid"
      >
        {/* Brand colonne */}
        <div>
          <div
            style={{
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: 24,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: C.white,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 18,
            }}
          >
            <Dumbbell size={22} color={C.accent} strokeWidth={2} />
            FORCE<span style={{ color: C.accent }}>&nbsp;BRUTE</span>
          </div>
          <p
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: 15,
              lineHeight: 1.72,
              color: 'rgba(255,255,255,0.56)',
              maxWidth: 300,
              marginBottom: 24,
            }}
          >
            Coach sportif personnel certifié à Marseille. Programmes sur mesure,
            résultats prouvés.
          </p>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              fontFamily: SANS,
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: '0.20em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.5)',
            }}
          >
            <MapPin size={13} color={C.accent} strokeWidth={1.8} />
            Marseille · Aix · Aubagne · Online
          </div>
        </div>

        {/* Colonnes de liens */}
        {cols.map((col) => (
          <div key={col.title}>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.30em',
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
                gap: 14,
              }}
            >
              {col.items.map((item, idx) => (
                <li key={item}>
                  <a
                    href={col.hrefs[idx]}
                    style={{
                      fontFamily: SERIF,
                      fontSize: 15,
                      color: 'rgba(255,255,255,0.62)',
                      textDecoration: 'none',
                      transition: 'color .3s',
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLAnchorElement).style.color = C.white;
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.62)';
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

      {/* Bas de page */}
      <div
        style={{
          maxWidth: 1240,
          margin: '64px auto 0',
          paddingTop: 28,
          borderTop: '1px solid rgba(200,56,32,0.14)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
          fontFamily: SANS,
          fontSize: 10,
          fontWeight: 400,
          letterSpacing: '0.14em',
          color: 'rgba(255,255,255,0.38)',
        }}
      >
        <span>© 2026 Force Brute · Coach Sportif Marseille. Tous droits réservés.</span>
        <span style={{ display: 'flex', gap: 24 }}>
          <a href="#contact" style={{ color: 'inherit', textDecoration: 'none' }}>Mentions légales</a>
          <a href="#contact" style={{ color: 'inherit', textDecoration: 'none' }}>Confidentialité</a>
          <a href="#contact" style={{ color: 'inherit', textDecoration: 'none' }}>BPJEPS + D.E. STAPS</a>
        </span>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .fb-footgrid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 520px) {
          .fb-footgrid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   PAGE — composition finale
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
    C = { ...C, accent: brand, accentLight: shadeColor(brand, 25), accentDark: shadeColor(brand, -20) };
  }

  const root: React.CSSProperties = {
    background: C.bg,
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
    <main style={root} suppressHydrationWarning>
      {/* Google Fonts */}
      <style>{`@import url('${FONTS_URL}');`}</style>

      <Nav />
      <Hero />
      <Intro />
      <ProgramSequence />
      <OfferCards />
      <EditorialRows />
      <PillarPanel />
      <Testimonials />
      <BookingForm />
      <Footer />

      {/* Responsive global */}
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        html { scroll-behavior: smooth; }

        @media (max-width: 860px) {
          .fb-navlinks { display: none !important; }
          .fb-navcta { display: none !important; }
          .fb-editrow { grid-template-columns: 1fr !important; }
          .fb-editrow > * { order: initial !important; }
          .fb-pilpanel { grid-template-columns: 1fr !important; }
          .fb-pilpanel-sticky { position: static !important; }
          .fb-form-grid { grid-template-columns: 1fr !important; }
          .fb-footgrid { grid-template-columns: 1fr 1fr !important; }
        }

        @media (max-width: 520px) {
          .fb-footgrid { grid-template-columns: 1fr !important; }
        }

        input, select, textarea {
          font-size: 16px !important;
        }
      `}</style>
    </main>
  );
}
