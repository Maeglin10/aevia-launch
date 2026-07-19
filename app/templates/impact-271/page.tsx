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
import { ArrowRight, ChevronDown, Sun, MapPin, Leaf } from 'lucide-react';

/* ════════════════════════════════════════════════════════════════════════════
   JARDINS D'ALSACE — Paysagiste & Horticulture · Strasbourg & Bas-Rhin
   Photographie réelle + chorégraphie de défilement éditoriale.
   Auto-suffisant. 'use client'.
   ════════════════════════════════════════════════════════════════════════════ */

/* ── Google Fonts ─────────────────────────────────────────────────────────── */
const GOOGLE_FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Vollkorn:ital,wght@0,400;0,600;1,400;1,600&family=Source+Sans+3:wght@300;400;500;600&display=swap';

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
  bg: '#f4f6f0',
  bgAlt: '#e6ece0',
  bgDark: '#0a1406',
  bgDarkAlt: '#060e04',
  bgCard: '#ffffff',
  accent: '#5a8040',
  accentDark: '#446030',
  accentLight: '#c8dcc0',
  white: '#ffffff',
  ink: '#0a1406',
  textMuted: '#223818',
  textFaint: '#6a8860',
  border: '#bcd4b0',
  borderDark: 'rgba(90,128,64,0.2)',
  terracotta: '#a05a30',
};

const SERIF = "'Vollkorn', Georgia, serif" as const;
const SANS = "'Source Sans 3', system-ui, sans-serif" as const;

/* ── Easing partagé ──────────────────────────────────────────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ── Photographies Unsplash ──────────────────────────────────────────────── */
const IMG = (id: string) =>
  `https://images.unsplash.com/photo-${id}?q=80&w=1600&auto=format&fit=crop`;

/* ════════════════════════════════════════════════════════════════════════════
   Interfaces TypeScript
   ════════════════════════════════════════════════════════════════════════════ */

interface Project {
  id: string;
  img: string;
  index: string;
  label: string;
  body: string;
}

interface Service {
  name: string;
  description: string;
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

interface SeasonItem {
  season: string;
  tasks: string;
}

/* ════════════════════════════════════════════════════════════════════════════
   Données
   ════════════════════════════════════════════════════════════════════════════ */

const PHASES: Project[] = [
  {
    id: 'p1',
    img: IMG('1558618047-b62e0e6e8517'),
    index: 'I',
    label: 'JARDINS ALSACIENS',
    body: "Rosiers grimpants sur colombages, haies de buis taillées, verger en espalier — l\'horticulture traditionnelle alsacienne sublimée.",
  },
  {
    id: 'p2',
    img: IMG('1416879347-58da7a5ecbb7'),
    index: 'II',
    label: 'JARDINS CONTEMPORAINS',
    body: 'Vivaces structurantes, graminées, minéral naturel — la modernité qui respecte le style architectural de votre maison.',
  },
  {
    id: 'p3',
    img: IMG('1578662996442-48f60103fc96'),
    index: 'III',
    label: 'TERRASSES & BALCONS',
    body: "Jardinières sur mesure, treillis végétalisé, plantes en pots hivernables — l\'espace extérieur quelle que soit la surface.",
  },
];

const SERVICES: Service[] = [
  {
    name: 'Création jardin',
    description: "Conception et réalisation complète, de l\'étude du terrain à la plantation finale.",
  },
  {
    name: 'Taille et entretien',
    description: "Entretien régulier, taille d\'arbustes et de haies, désherbage et soins saisonniers.",
  },
  {
    name: 'Haies et clôtures',
    description: 'Haies naturelles ou taillées, clôtures bois et métal végétalisées pour intimiser votre espace.',
  },
  {
    name: 'Plantations bulbes & vivaces',
    description: 'Sélection et mise en terre de vivaces rustiques adaptées au climat alsacien.',
  },
  {
    name: 'Gazon & engazonnement',
    description: 'Préparation du sol, semis ou gazon en rouleaux pour une pelouse dense et durable.',
  },
  {
    name: 'Arrosage automatique',
    description: "Installation de systèmes goutte-à-goutte et asperseurs programmables pour économiser l\'eau.",
  },
];

const EDIT_ROWS: EditRow[] = [
  {
    eyebrow: 'Notre territoire',
    img: '1558618047-b62e0e6e8517?w=800',
    title: (
      <>
        Le Bas-Rhin /{' '}
        <span style={{ fontStyle: 'italic' }}>dans nos mains.</span>
      </>
    ),
    body: "Les sols alsaciens sont parmi les plus complexes de France : argiles lourdes dans la plaine du Rhin, calcaires sur les coteaux, limons riches dans la campagne strasbourgeoise. Nous connaissons chaque type de terrain et sélectionnons uniquement des végétaux capables d\'affronter nos hivers continentaux pouvant descendre à -15 °C, nos étés chauds et notre pluviométrie particulière.",
    reverse: false,
  },
  {
    eyebrow: "L\'entreprise",
    img: '1416879347-58da7a5ecbb7?w=800',
    title: (
      <>
        Depuis 2003, /{' '}
        <span style={{ fontStyle: 'italic' }}>génération en génération.</span>
      </>
    ),
    body: "Fondée par Pierre Reinhardt et aujourd\'hui menée avec son fils Julien, notre entreprise familiale compte 35 collaborateurs. En vingt ans de présence dans le Bas-Rhin, nous avons créé plus de 600 jardins en Alsace-Moselle — chacun unique, chacun pensé pour durer. Notre ancrage local et notre passion de l\'horticulture alsacienne font notre réputation depuis la première taille.",
    reverse: true,
  },
];

const SEASONS: SeasonItem[] = [
  {
    season: 'Printemps',
    tasks: 'Plantations, tonte du gazon, taille des rosiers, semis annuels',
  },
  {
    season: 'Été',
    tasks: 'Entretien hebdomadaire, arrosage, taille des haies, désherbage',
  },
  {
    season: 'Automne',
    tasks: 'Plantation des bulbes, taille des arbustes, semis de gazon',
  },
  {
    season: 'Hiver',
    tasks: 'Taille des arbres fruitiers, protection des espèces fragiles, planification',
  },
];

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Nous rêvions d\'un jardin de rosiers comme on en voyait autrefois dans les fermes alsaciennes. L\'équipe a planté 45 variétés en respectant nos envies et le terrain. Notre jardin a même remporté le prix du plus beau jardin fleuri de la commune l\'année suivante.",
    name: 'Marie-Thérèse & Roland Schmitt',
    role: 'Retraités · Obernai',
  },
  {
    quote:
      "J\'avais besoin d\'une terrasse qui évoque l\'Alsace pour mes clients. Jardins d\'Alsace a créé un véritable écrin végétal avec géraniums, vignes vierges et buis sculptés. Notre terrasse est désormais dans plusieurs guides touristiques de la région.",
    name: 'Christophe Wagner',
    role: 'Restaurateur · Strasbourg',
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
  const wrap: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    justifyContent: align === 'center' ? 'center' : 'flex-start',
  };
  const rule: React.CSSProperties = {
    width: 42,
    height: 1,
    background: color,
    opacity: 0.7,
    flexShrink: 0,
  };
  const label: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 11,
    letterSpacing: '0.40em',
    textTransform: 'uppercase',
    color,
    fontWeight: 500,
  };
  return (
    <div style={wrap}>
      <span style={rule} />
      <span style={label}>{children}</span>
      {align === 'center' && <span style={rule} />}
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

function GreenButton({
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
    fontSize: 12,
    letterSpacing: '0.24em',
    textTransform: 'uppercase',
    fontWeight: 500,
    cursor: 'pointer',
    border: filled
      ? 'none'
      : `1px solid ${dark ? 'rgba(90,128,64,0.6)' : C.accent}`,
    background: filled ? C.accent : 'transparent',
    color: filled ? C.white : dark ? C.accentLight : C.accent,
    transition: 'all .5s cubic-bezier(.16,1,.3,1)',
  };
  const hov: React.CSSProperties = hover
    ? filled
      ? { background: C.accentDark, transform: 'translateY(-2px)' }
      : { background: 'rgba(90,128,64,0.10)', transform: 'translateY(-2px)' }
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

  const LINKS = [
    { label: 'Créations', href: '#creations' },
    { label: 'Services', href: '#services' },
    { label: 'Notre histoire', href: '#histoire' },
    { label: 'Saisons', href: '#saisons' },
    { label: 'Témoignages', href: '#temoignages' },
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
    background: solid ? 'rgba(10,20,6,0.96)' : 'transparent',
    backdropFilter: solid ? 'blur(14px) saturate(130%)' : 'none',
    WebkitBackdropFilter: solid ? 'blur(14px) saturate(130%)' : 'none',
    borderBottom: solid
      ? `1px solid rgba(90,128,64,0.28)`
      : '1px solid transparent',
    transition: 'all .6s cubic-bezier(.16,1,.3,1)',
  };

  const brand: React.CSSProperties = {
    fontFamily: SERIF,
    fontSize: 'clamp(17px,1.6vw,22px)',
    letterSpacing: '0.06em',
    color: C.white,
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    textDecoration: 'none',
  };

  const linkRow: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'clamp(18px,2vw,36px)',
  };

  return (
    <>
      <nav style={bar} suppressHydrationWarning>
      <a href="/templates/impact-271" style={brand}>
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
            <Leaf size={19} color={C.accent} strokeWidth={1.6} />{fd?.businessName ?? "Jardins d'Alsace"}
          </>
        )}
      </a>
      <div style={linkRow} className="ja-navlinks">
        {LINKS.map((l) => (
          <NavLink key={l.label} label={l.label} href={l.href} />
        ))}
      </div>
      <div className="ja-navcta">
        <a href="#devis" style={{ textDecoration: 'none' }}>
          <GreenButton filled dark>
            Devis gratuit
          </GreenButton>
        </a>
      </div>
      
        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="ja-burger"
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
          .ja-navlinks{ display:none !important; }
          .ja-burger { display: flex !important; flex-direction: column; }
          .ja-navcta{ display:none !important; }
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
          background: 'rgba(10,10,10,0.97)',
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
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: h ? C.accentLight : 'rgba(255,255,255,0.88)',
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
   2 · Hero — parallaxe 100vh
   ════════════════════════════════════════════════════════════════════════════ */
function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '14%']);
  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '-44%']);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.72], [1, 0]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);

  const section: React.CSSProperties = {
    position: 'relative',
    height: '100dvh',
    minHeight: 640,
    overflow: 'hidden',
    background: C.bgDark,
  };

  return (
    <section id="hero" ref={ref} style={section}>
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
          src={`https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=2000&auto=format&fit=crop`}
          alt="Jardin alsacien fleuri par Jardins d'Alsace"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </motion.div>

      {/* Voiles */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(10,20,6,0.35) 0%, rgba(10,20,6,0.08) 40%, rgba(10,20,6,0.50) 72%, rgba(10,20,6,0.90) 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(130% 80% at 50% 30%, transparent 40%, rgba(6,14,4,0.42) 100%)',
          mixBlendMode: 'multiply',
        }}
      />

      {/* Contenu bas-gauche */}
      <motion.div
        style={{
          position: 'relative',
          zIndex: 2,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding:
            '0 clamp(24px,6vw,96px) clamp(60px,8vw,110px)',
          y: titleY,
          opacity: titleOpacity,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.1 }}
        >
          <Eyebrow color={C.accentLight}>
            Paysagiste · Strasbourg &amp; Bas-Rhin
          </Eyebrow>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 46 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.22 }}
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontWeight: 400,
            color: C.white,
            fontSize: 'clamp(3rem,7.5vw,9rem)',
            lineHeight: 0.96,
            letterSpacing: '-0.01em',
            margin: 'clamp(18px,2vw,28px) 0 clamp(14px,1.6vw,22px)',
            textShadow: '0 12px 60px rgba(0,0,0,0.45)',
            maxWidth: 900,
          }}
        >
          L&apos;Alsace&nbsp;/
          <br />
          en fleurs.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.5 }}
          style={{
            fontFamily: SANS,
            fontWeight: 300,
            fontSize: 'clamp(15px,1.6vw,20px)',
            color: 'rgba(255,255,255,0.80)',
            maxWidth: 480,
            lineHeight: 1.6,
            marginBottom: 'clamp(28px,3.5vw,46px)',
          }}
        >
          Création, plantation et entretien de jardins alsaciens et contemporains
          depuis 2003. Plus de 600 jardins réalisés dans le Bas-Rhin.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.72 }}
          style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}
        >
          <a href="#devis" style={{ textDecoration: 'none' }}>
            <GreenButton filled dark>
              Demander un devis
            </GreenButton>
          </a>
          <a href="#creations" style={{ textDecoration: 'none' }}>
            <GreenButton dark>Nos réalisations</GreenButton>
          </a>
        </motion.div>
      </motion.div>

      {/* Indice défilement */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: 32,
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
            fontSize: 10,
            letterSpacing: '0.34em',
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
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   3 · Intro
   ════════════════════════════════════════════════════════════════════════════ */
function Intro() {
  const sec: React.CSSProperties = {
    background: C.bgAlt,
    padding: 'clamp(90px,13vw,190px) clamp(24px,8vw,160px)',
    textAlign: 'center',
  };
  return (
    <section id="contact" style={sec}>
      <Reveal>
        <p
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 'clamp(24px,3.4vw,48px)',
            lineHeight: 1.38,
            fontWeight: 400,
            maxWidth: 960,
            margin: '0 auto',
            color: C.ink,
          }}
        >
          En Alsace, le jardin est une extension naturelle de la maison.
          Nous le cultivons avec le même soin.
        </p>
      </Reveal>
      <Reveal delay={0.18}>
        <div
          style={{
            width: 1,
            height: 86,
            background: `linear-gradient(${C.accent}, transparent)`,
            margin: 'clamp(42px,5vw,64px) auto 0',
          }}
        />
      </Reveal>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   4 · ProjectSequence — sticky crossfade 320vh
   ════════════════════════════════════════════════════════════════════════════ */
function ProjectImage({
  phase,
  i,
  total,
  progress,
}: {
  phase: Project;
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

function ProjectCaption({
  phase,
  i,
  total,
  progress,
}: {
  phase: Project;
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
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
        padding:
          'clamp(32px,5vw,72px) clamp(24px,6vw,96px)',
        opacity,
        y,
      }}
    >
      {/* Label top-right */}
      <motion.div
        style={{
          position: 'absolute',
          top: 'clamp(90px,10vw,130px)',
          right: 'clamp(24px,5vw,72px)',
          textAlign: 'right',
          opacity,
        }}
      >
        <div
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 'clamp(54px,10vw,140px)',
            color: 'rgba(200,220,192,0.18)',
            lineHeight: 1,
          }}
        >
          {phase.index}
        </div>
        <div
          style={{
            fontFamily: SANS,
            fontSize: 11,
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: C.accentLight,
            marginTop: 8,
          }}
        >
          {phase.label}
        </div>
      </motion.div>

      <h2
        style={{
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontSize: 'clamp(34px,6vw,82px)',
          fontWeight: 400,
          color: C.white,
          lineHeight: 1.04,
          margin: '0 0 clamp(14px,2vw,22px)',
          textShadow: '0 8px 40px rgba(0,0,0,0.55)',
          maxWidth: 700,
        }}
      >
        {phase.label
          .split(' ')
          .map((w, wi) => (wi === 0 ? w : w.toLowerCase()))
          .join(' ')}
      </h2>
      <p
        style={{
          fontFamily: SANS,
          fontWeight: 300,
          fontSize: 'clamp(15px,1.5vw,19px)',
          color: 'rgba(255,255,255,0.80)',
          maxWidth: 520,
          lineHeight: 1.65,
        }}
      >
        {phase.body}
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
  const width = useTransform(progress, [i * seg, (i + 1) * seg], [10, 34]);
  return (
    <motion.div
      style={{ height: 2, width, background: C.accent, opacity }}
    />
  );
}

function ProjectSequence() {
  const n = PHASES.length;
  const progress = useMotionValue(0.5 / n);
  const [active, setActive] = useState(0);
  const goTo = (i: number) => {
    setActive(i);
    progress.set((i + 0.5) / n);
  };

  return (
    <section
      style={{
        height: '100dvh', overflow: 'hidden',
        position: 'relative',
        background: C.bgDark,
      }}
      id="creations"
    >
      <div
        style={{
          position: 'relative',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {PHASES.map((p, i) => (
          <ProjectImage
            key={p.id}
            phase={p}
            i={i}
            total={PHASES.length}
            progress={progress}
          />
        ))}

        {/* Voile lisibilité bas */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to bottom, rgba(10,20,6,0.24) 0%, rgba(10,20,6,0.04) 40%, rgba(10,20,6,0.70) 100%)',
          }}
        />

        {PHASES.map((p, i) => (
          <ProjectCaption
            key={p.id}
            phase={p}
            i={i}
            total={PHASES.length}
            progress={progress}
          />
        ))}

        {/* Dots de progression */}
        <div
          style={{
            position: 'absolute',
            bottom: 38,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 10,
          }}
        >
          {PHASES.map((_p, i) => (
            <ProgressDot
              key={i}
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
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   5 · ServiceCards
   ════════════════════════════════════════════════════════════════════════════ */
function ServiceCard({ service, i }: { service: Service; i: number }) {
  const [hover, setHover] = useState(false);
  const card: React.CSSProperties = {
    background: C.bgCard,
    border: `1px solid ${hover ? C.accent : C.border}`,
    borderLeft: `3px solid ${C.accent}`,
    padding: 'clamp(26px,3vw,38px)',
    transform: hover ? 'translateY(-8px)' : 'none',
    boxShadow: hover
      ? '0 32px 64px -28px rgba(10,20,6,0.22)'
      : '0 8px 28px -20px rgba(10,20,6,0.14)',
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
        <div
          style={{
            fontFamily: SANS,
            fontSize: 10.5,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: C.accent,
            marginBottom: 14,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Leaf size={13} strokeWidth={1.6} />
          Service
        </div>
        <h3
          style={{
            fontFamily: SERIF,
            fontSize: 'clamp(20px,2vw,26px)',
            fontWeight: 600,
            color: C.ink,
            margin: '0 0 12px',
            lineHeight: 1.18,
          }}
        >
          {service.name}
        </h3>
        <p
          style={{
            fontFamily: SANS,
            fontWeight: 300,
            fontSize: 15,
            lineHeight: 1.68,
            color: C.textMuted,
            margin: 0,
          }}
        >
          {service.description}
        </p>
      </article>
    </Reveal>
  );
}

function ServiceCards() {
  const sec: React.CSSProperties = {
    background: C.bg,
    padding: 'clamp(90px,12vw,170px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
    gap: 'clamp(20px,2.5vw,34px)',
    maxWidth: 1240,
    margin: '0 auto',
  };
  return (
    <section style={sec} id="services">
      <div style={{ maxWidth: 1240, margin: '0 auto clamp(52px,7vw,86px)' }}>
        <Reveal>
          <Eyebrow>Nos services</Eyebrow>
        </Reveal>
        <Reveal delay={0.1}>
          <h2
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: 'clamp(34px,5.5vw,72px)',
              fontWeight: 400,
              color: C.ink,
              margin: 'clamp(16px,2vw,24px) 0 0',
              lineHeight: 1.06,
            }}
          >
            Tout pour votre{' '}
            <span style={{ color: C.accent }}>jardin</span>
          </h2>
        </Reveal>
      </div>
      <div style={grid}>
        {SERVICES.map((s, i) => (
          <ServiceCard key={s.name} service={s} i={i} />
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
        src={`https://images.unsplash.com/photo-${src}&auto=format&fit=crop`}
        alt={alt}
        loading="lazy"
        style={{ width: '100%', height: '116%', objectFit: 'cover', y }}
      />
    </div>
  );
}

function EditRowBlock({ row, num }: { row: EditRow; num: number }) {
  const wrap: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 'clamp(36px,6vw,90px)',
    alignItems: 'center',
  };
  const imgWrap: React.CSSProperties = {
    overflow: 'hidden',
    order: row.reverse ? 2 : 1,
    aspectRatio: '5 / 6',
    position: 'relative',
  };
  const txt: React.CSSProperties = { order: row.reverse ? 1 : 2 };
  const ghost: React.CSSProperties = {
    position: 'absolute',
    top: -24,
    left: row.reverse ? 'auto' : -32,
    right: row.reverse ? -32 : 'auto',
    fontFamily: SERIF,
    fontStyle: 'italic',
    fontSize: 'clamp(100px,16vw,220px)',
    fontWeight: 600,
    color: C.terracotta,
    opacity: 0.09,
    lineHeight: 1,
    userSelect: 'none',
    zIndex: 0,
  };

  return (
    <div style={{ position: 'relative' }} className="ja-editrow">
      <div style={ghost}>{num}</div>
      <div className="imx-mobstack" style={wrap}>
        <Reveal y={50} style={imgWrap}>
          <ParallaxImg
            src={row.img}
            alt={`Jardins d'Alsace — ${row.eyebrow}`}
          />
        </Reveal>
        <div style={{ ...txt, position: 'relative', zIndex: 1 }}>
          <Reveal>
            <Eyebrow color={C.accentDark}>{row.eyebrow}</Eyebrow>
          </Reveal>
          <Reveal delay={0.09}>
            <h3
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(30px,4vw,56px)',
                fontWeight: 400,
                color: C.ink,
                margin: 'clamp(16px,2vw,22px) 0 clamp(16px,2vw,24px)',
                lineHeight: 1.12,
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
                lineHeight: 1.78,
                color: C.textMuted,
                maxWidth: 460,
              }}
            >
              {row.body}
            </p>
          </Reveal>
        </div>
      </div>
      <style>{`
        @media (max-width: 860px){
          .ja-editrow > div:last-child{ grid-template-columns: 1fr !important; }
          .ja-editrow > div:last-child > *{ order: initial !important; }
        }
      `}</style>
    </div>
  );
}

function EditorialRows() {
  const sec: React.CSSProperties = {
    background: C.bg,
    padding: 'clamp(80px,11vw,150px) clamp(24px,6vw,96px)',
  };
  return (
    <section style={sec} id="histoire">
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(80px,11vw,148px)',
        }}
      >
        {EDIT_ROWS.map((r, i) => (
          <EditRowBlock key={r.eyebrow} row={r} num={i + 1} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   7 · SeasonPanel — sticky left image, right scrolls
   ════════════════════════════════════════════════════════════════════════════ */
function SeasonPanel() {
  const sec: React.CSSProperties = {
    background: C.bgDark,
    padding: 'clamp(80px,11vw,150px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 'clamp(40px,6vw,96px)',
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
    <section style={sec} id="saisons">
      <div style={grid} className="ja-seapanel">
        {/* Image collante */}
        <div style={stickyLeft} className="ja-seapanel-sticky">
          <div
            style={{
              overflow: 'hidden',
              border: `1px solid ${C.borderDark}`,
              aspectRatio: '3 / 4',
            }}
          >
            <img
              src={`https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=900&auto=format&fit=crop`}
              alt="Jardin alsacien en automne"
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
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: C.accent,
                marginBottom: 10,
              }}
            >
              Calendrier des travaux
            </div>
            <div
              style={{
                fontFamily: SERIF,
                fontStyle: 'italic',
                fontSize: 17,
                color: 'rgba(200,220,192,0.72)',
                lineHeight: 1.6,
              }}
            >
              En Alsace, chaque saison a ses urgences — et ses beautés.
            </div>
          </div>
        </div>

        {/* Saisons qui défilent */}
        <div>
          <Reveal>
            <Eyebrow color={C.accentLight}>Les quatre saisons</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2
              style={{
                fontFamily: SERIF,
                fontStyle: 'italic',
                fontSize: 'clamp(32px,4.8vw,62px)',
                fontWeight: 400,
                color: C.white,
                margin: 'clamp(16px,2vw,22px) 0 clamp(40px,5vw,60px)',
                lineHeight: 1.06,
              }}
            >
              Un jardin en{' '}
              <span style={{ color: C.accentLight }}>mouvement</span>
            </h2>
          </Reveal>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {SEASONS.map((item, i) => (
              <Reveal key={item.season} delay={0.06 * i}>
                <div
                  style={{
                    padding: 'clamp(28px,3.5vw,40px) 0',
                    borderTop: `1px solid rgba(90,128,64,0.32)`,
                    display: 'flex',
                    gap: 'clamp(20px,3vw,38px)',
                    alignItems: 'baseline',
                  }}
                >
                  <span
                    style={{
                      fontFamily: SANS,
                      fontSize: 10,
                      letterSpacing: '0.30em',
                      textTransform: 'uppercase',
                      color: C.terracotta,
                      minWidth: 72,
                      flexShrink: 0,
                      paddingTop: 4,
                    }}
                  >
                    {item.season}
                  </span>
                  <p
                    style={{
                      fontFamily: SANS,
                      fontWeight: 300,
                      fontSize: 'clamp(16px,1.5vw,19px)',
                      lineHeight: 1.68,
                      color: 'rgba(200,220,192,0.80)',
                      margin: 0,
                    }}
                  >
                    {item.tasks}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 860px){
          .ja-seapanel{ grid-template-columns: 1fr !important; }
          .ja-seapanel-sticky{ position: static !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   8 · Testimonials
   ════════════════════════════════════════════════════════════════════════════ */
function Testimonials() {
  const sec: React.CSSProperties = {
    background: C.bgAlt,
    padding: 'clamp(90px,12vw,170px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))',
    gap: 'clamp(28px,3.5vw,52px)',
    maxWidth: 1180,
    margin: '0 auto',
  };
  return (
    <section style={sec} id="temoignages">
      <div style={{ maxWidth: 1180, margin: '0 auto clamp(52px,7vw,80px)', textAlign: 'center' }}>
        <Reveal>
          <Eyebrow color={C.accentDark} align="center">
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
              margin: 'clamp(16px,2vw,24px) 0 0',
              lineHeight: 1.08,
            }}
          >
            La confiance de{' '}
            <span style={{ color: C.accent }}>nos clients</span>
          </h2>
        </Reveal>
      </div>
      <div style={grid}>
        {TESTIMONIALS.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.12} style={{ height: '100%' }}>
            <figure
              style={{
                background: C.bgCard,
                border: `1px solid ${C.border}`,
                padding: 'clamp(30px,4vw,48px)',
                margin: 0,
                height: '100%',
                boxSizing: 'border-box',
                boxShadow: '0 18px 50px -36px rgba(10,20,6,0.28)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Sun
                size={30}
                color={C.terracotta}
                strokeWidth={1.4}
                style={{ marginBottom: 22, flexShrink: 0 }}
              />
              <blockquote
                style={{
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  fontSize: 'clamp(17px,1.7vw,21px)',
                  lineHeight: 1.64,
                  color: C.ink,
                  margin: '0 0 clamp(22px,3vw,32px)',
                  flex: 1,
                }}
              >
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption
                style={{
                  borderTop: `1px solid ${C.border}`,
                  paddingTop: 18,
                }}
              >
                <div
                  style={{
                    fontFamily: SERIF,
                    fontSize: 18,
                    fontWeight: 600,
                    color: C.accent,
                  }}
                >
                  {t.name}
                </div>
                <div
                  style={{
                    fontFamily: SANS,
                    fontSize: 11,
                    letterSpacing: '0.18em',
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
  const [type, setType] = useState('');
  const [surface, setSurface] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prenom || !email || !type) return;
    setSent(true);
  };

  const sec: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    background: C.bgDark,
    padding: 'clamp(90px,12vw,170px) clamp(24px,6vw,96px)',
  };

  const fieldBase: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    background: 'transparent',
    border: 'none',
    borderBottom: `1px solid rgba(90,128,64,0.40)`,
    padding: '15px 2px',
    fontFamily: SANS,
    fontWeight: 300,
    fontSize: 17,
    color: C.white,
    outline: 'none',
    fontSize16: 16,
  } as React.CSSProperties;

  const labelStyle: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 10.5,
    letterSpacing: '0.24em',
    textTransform: 'uppercase',
    color: C.accent,
    display: 'block',
    marginBottom: 4,
  };

  const fieldStyle: React.CSSProperties = {
    ...fieldBase,
    fontSize: 'clamp(15px,1.5vw,17px)',
  };

  const placeholderColor = 'rgba(200,220,192,0.32)';

  return (
    <section style={sec} id="devis">
      {/* Arrière-plan subtil */}
      <img
        src={`https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1600&auto=format&fit=crop`}
        alt="Image de présentation"
        aria-hidden="true"
        loading="lazy"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.08,
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
        <Reveal delay={0.09}>
          <h2
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: 'clamp(34px,5.5vw,74px)',
              fontWeight: 400,
              color: C.white,
              margin: 'clamp(16px,2vw,22px) 0 clamp(14px,2vw,20px)',
              lineHeight: 1.06,
            }}
          >
            Parlons de votre{' '}
            <span style={{ color: C.accentLight }}>projet</span>
          </h2>
        </Reveal>
        <Reveal delay={0.17}>
          <p
            style={{
              fontFamily: SANS,
              fontWeight: 300,
              fontSize: 'clamp(15px,1.5vw,18px)',
              lineHeight: 1.68,
              color: 'rgba(200,220,192,0.75)',
              maxWidth: 520,
              margin: '0 auto clamp(44px,6vw,64px)',
            }}
          >
            Décrivez votre terrain et vos envies. Nous vous proposons une
            visite gratuite et un devis détaillé sous 5 jours ouvrés.
          </p>
        </Reveal>

        {sent ? (
          <Reveal>
            <div
              style={{
                border: `1px solid rgba(90,128,64,0.55)`,
                padding: 'clamp(36px,5vw,56px)',
                background: 'rgba(90,128,64,0.08)',
              }}
            >
              <Leaf
                size={36}
                color={C.accentLight}
                strokeWidth={1.4}
                style={{ marginBottom: 18 }}
              />
              <h3
                style={{
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  fontSize: 'clamp(26px,3vw,38px)',
                  fontWeight: 400,
                  color: C.white,
                  margin: '0 0 14px',
                }}
              >
                Merci {prenom}&nbsp;!
              </h3>
              <p
                style={{
                  fontFamily: SANS,
                  fontWeight: 300,
                  fontSize: 17,
                  color: 'rgba(200,220,192,0.80)',
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                Nous vous proposons une visite de terrain gratuite dans les
                5 jours. Vous recevrez notre confirmation à{' '}
                <strong style={{ color: C.accentLight, fontWeight: 400 }}>
                  {email}
                </strong>
                .
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
                gap: 'clamp(26px,3vw,36px)',
                textAlign: 'left',
              }}
            >
              <style>{`
                .ja-field::placeholder{ color: ${placeholderColor}; }
                .ja-select option{ color: #0a1406; background: #fff; }
              `}</style>

              {/* Row: prénom + email */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 'clamp(18px,2.5vw,32px)',
                }}
                className="ja-form-row"
              >
                <div>
                  <label style={labelStyle} htmlFor="ja-prenom">
                    Prénom
                  </label>
                  <input
                    id="ja-prenom"
                    className="ja-field"
                    style={fieldStyle}
                    type="text"
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    placeholder="Marie"
                    autoComplete="given-name"
                    required
                  />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="ja-email">
                    Email
                  </label>
                  <input
                    id="ja-email"
                    className="ja-field"
                    style={fieldStyle}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="marie@exemple.fr"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              {/* Row: téléphone + type */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 'clamp(18px,2.5vw,32px)',
                }}
                className="ja-form-row"
              >
                <div>
                  <label style={labelStyle} htmlFor="ja-tel">
                    Téléphone
                  </label>
                  <input
                    id="ja-tel"
                    className="ja-field"
                    style={fieldStyle}
                    type="tel"
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                    placeholder="06 00 00 00 00"
                    autoComplete="tel"
                  />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="ja-type">
                    Type de projet
                  </label>
                  <select
                    id="ja-type"
                    className="ja-field ja-select"
                    style={{
                      ...fieldStyle,
                      appearance: 'none',
                      WebkitAppearance: 'none',
                      cursor: 'pointer',
                      color: type ? C.white : placeholderColor,
                    }}
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    required
                  >
                    <option value="">Choisir…</option>
                    <option value="Jardin alsacien">Jardin alsacien</option>
                    <option value="Jardin contemporain">Jardin contemporain</option>
                    <option value="Haies & clôtures">Haies &amp; clôtures</option>
                    <option value="Pelouse & gazon">Pelouse &amp; gazon</option>
                    <option value="Taille & entretien">Taille &amp; entretien</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
              </div>

              {/* Surface */}
              <div>
                <label style={labelStyle} htmlFor="ja-surface">
                  Surface approximative (m²)
                </label>
                <input
                  id="ja-surface"
                  className="ja-field"
                  style={fieldStyle}
                  type="text"
                  value={surface}
                  onChange={(e) => setSurface(e.target.value)}
                  placeholder="Ex. 200 m²"
                />
              </div>

              {/* Message */}
              <div>
                <label style={labelStyle} htmlFor="ja-message">
                  Votre projet en quelques mots
                </label>
                <textarea
                  id="ja-message"
                  className="ja-field"
                  style={{
                    ...fieldStyle,
                    resize: 'vertical',
                    minHeight: 110,
                    borderBottom: 'none',
                    border: `1px solid rgba(90,128,64,0.40)`,
                    padding: '14px 14px',
                  }}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Décrivez votre terrain, vos envies, vos contraintes…"
                />
              </div>

              <div style={{ textAlign: 'center', marginTop: 8 }}>
                <GreenButton filled dark type="submit">
                  Envoyer ma demande
                </GreenButton>
              </div>
            </form>
            <style>{`
              @media (max-width: 860px){
                .ja-form-row{ grid-template-columns: 1fr !important; }
              }
            `}</style>
          </Reveal>
        )}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   10 · Footer
   ════════════════════════════════════════════════════════════════════════════ */
function Footer() {
  const COLS: { title: string; items: { label: string; href: string }[] }[] = [
    {
      title: 'Créations',
      items: [
        { label: 'Jardins alsaciens', href: '#creations' },
        { label: 'Jardins contemporains', href: '#creations' },
        { label: 'Terrasses & balcons', href: '#creations' },
        { label: 'Nos réalisations', href: '#creations' },
      ],
    },
    {
      title: 'Services',
      items: [
        { label: 'Création jardin', href: '#services' },
        { label: 'Taille & entretien', href: '#services' },
        { label: 'Haies & clôtures', href: '#services' },
        { label: 'Arrosage automatique', href: '#services' },
      ],
    },
    {
      title: 'Contact',
      items: [
        { label: 'Devis gratuit', href: '#devis' },
        { label: 'Notre histoire', href: '#histoire' },
        { label: 'Témoignages', href: '#temoignages' },
        { label: 'Strasbourg & Bas-Rhin', href: '#devis' },
      ],
    },
  ];

  const foot: React.CSSProperties = {
    background: C.bgDarkAlt,
    borderTop: `1px solid rgba(90,128,64,0.22)`,
    padding: 'clamp(64px,8vw,100px) clamp(24px,6vw,96px) 36px',
  };

  return (
    <footer style={foot}>
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.5fr repeat(3, 1fr)',
          gap: 'clamp(32px,4.5vw,60px)',
        }}
        className="ja-footgrid"
      >
        {/* Brand */}
        <div>
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(18px,1.8vw,24px)',
              fontWeight: 600,
              color: C.white,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <Leaf size={20} color={C.accent} strokeWidth={1.6} />{fd?.businessName ?? "Jardins d'Alsace"}</div>
          <p
            style={{
              fontFamily: SANS,
              fontWeight: 300,
              fontSize: 15,
              lineHeight: 1.7,
              color: 'rgba(200,220,192,0.60)',
              marginTop: 18,
              maxWidth: 320,
            }}
          >
            Paysagiste et horticulteur depuis 2003 dans le Bas-Rhin.
            600 jardins créés, 35 collaborateurs, passion alsacienne.
          </p>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginTop: 20,
              fontFamily: SANS,
              fontSize: 11,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'rgba(200,220,192,0.50)',
            }}
          >
            <MapPin size={13} color={C.accent} strokeWidth={1.6} />
            Strasbourg · Bas-Rhin
          </div>
        </div>

        {/* Colonnes */}
        {COLS.map((col) => (
          <div key={col.title}>
            <div
              style={{
                fontFamily: SANS,
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
              {col.items.map((it) => (
                <li key={it.label}>
                  <a
                    href={it.href}
                    style={{
                      fontFamily: SANS,
                      fontWeight: 300,
                      fontSize: 15,
                      color: 'rgba(200,220,192,0.68)',
                      textDecoration: 'none',
                      transition: 'color .35s',
                    }}
                    onMouseEnter={(e) =>
                      ((e.target as HTMLElement).style.color = C.accentLight)
                    }
                    onMouseLeave={(e) =>
                      ((e.target as HTMLElement).style.color =
                        'rgba(200,220,192,0.68)')
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
          maxWidth: 1240,
          margin: 'clamp(52px,6vw,72px) auto 0',
          paddingTop: 24,
          borderTop: `1px solid rgba(90,128,64,0.16)`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 14,
          fontFamily: SANS,
          fontSize: 11,
          letterSpacing: '0.12em',
          color: 'rgba(200,220,192,0.42)',
        }}
      >
        <span>
          © 2003–2026 Jardins d&apos;Alsace · SARL Reinhardt Paysage ·
          Strasbourg, Bas-Rhin
        </span>
        <span style={{ display: 'flex', gap: 22 }}>
          <a href="#devis" style={{ color: 'inherit', textDecoration: 'none' }}>
            Mentions légales
          </a>
          <a href="#devis" style={{ color: 'inherit', textDecoration: 'none' }}>
            Confidentialité
          </a>
        </span>
      </div>

      <style>{`
        @media (max-width: 860px){
          .ja-footgrid{ grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px){
          .ja-footgrid{ grid-template-columns: 1fr !important; }
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
    background: C.bgDark,
    color: C.ink,
    fontFamily: SANS,
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
      {/* Google Fonts */}
      <style>{`@import url('${GOOGLE_FONTS_URL}');`}</style>

      <Nav />
      <Hero />
      <Intro />
      <ProjectSequence />
      <ServiceCards />
      <EditorialRows />
      <SeasonPanel />
      <Testimonials />
      <QuoteForm />
      <Footer />
    </main>
  );
}
