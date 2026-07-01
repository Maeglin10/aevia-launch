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
import { ArrowRight, ChevronDown, Feather, MapPin } from 'lucide-react';

/* ════════════════════════════════════════════════════════════════════════════
   PEAU & PLUME — Atelier de Tatouage & Illustration · Lille
   Scroll choreography éditoriale : crossfade 320vh · sticky SafetyPanel ·
   formulaire interactif · 10 sous-composants nommés. 'use client'.
   ════════════════════════════════════════════════════════════════════════════ */

/* ── Google Fonts ────────────────────────────────────────────────────────── */
const FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400;1,600&family=Lato:wght@300;400;700&display=swap';

/* ── Palette ─────────────────────────────────────────────────────────────── */
const C = {
  bg: '#f8f6f2',
  bgAlt: '#eeece4',
  bgDark: '#100e0a',
  bgDarkAlt: '#080604',
  bgCard: '#ffffff',
  accent: '#6a9060',
  accentDark: '#507848',
  accentLight: '#ccdec4',
  white: '#ffffff',
  ink: '#100e0a',
  textMuted: '#302c20',
  textFaint: '#807860',
  border: '#d8d4c8',
  borderDark: 'rgba(106,144,96,0.2)',
  rust: '#b05030',
} as const;

const SERIF = "'Playfair Display', Georgia, serif" as const;
const SANS = "'Lato', system-ui, sans-serif" as const;

/* ── Easing partagé ──────────────────────────────────────────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ════════════════════════════════════════════════════════════════════════════
   Interfaces TypeScript
   ════════════════════════════════════════════════════════════════════════════ */

interface Style {
  src: string;
  alt: string;
  index: string;
  label: string;
  desc: string;
}

interface Artist {
  name: string;
  specialty: string;
  badge: string;
  img: string;
  alt: string;
}

interface EditRow {
  eyebrow: string;
  img: string;
  alt: string;
  title: React.ReactNode;
  body: string;
  reverse?: boolean;
  numeral: string;
}

interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

interface SafetyItem {
  num: string;
  title: string;
  body: string;
}

/* ════════════════════════════════════════════════════════════════════════════
   Data
   ════════════════════════════════════════════════════════════════════════════ */

const BASE = 'https://images.unsplash.com/photo-';
const ph = (id: string, w = 1600) =>
  `${BASE}${id}?q=80&w=${w}&auto=format&fit=crop`;

const STYLES: Style[] = [
  {
    src: ph('1611501579-4d7dc8532cc1'),
    alt: 'Tatouage nature et plumes',
    index: 'I',
    label: 'NATURE & PLUMES',
    desc: "Oiseaux en vol, plumes délicates, branches fleuries — l'encre noire qui capture la légèreté du vivant.",
  },
  {
    src: ph('1547036967-23136a0f3b86'),
    alt: 'Tatouage surréaliste',
    index: 'II',
    label: 'SURRÉALISME',
    desc: "Montres qui fondent, œils floraux, univers de Dalí transposés sur peau — l'imaginaire sans limites.",
  },
  {
    src: ph('1567401893-56e3d64e7b2c'),
    alt: 'Tatouage old school revisité',
    index: 'III',
    label: 'OLD SCHOOL REVISITÉ',
    desc: 'Ancres, roses, aigles — les codes traditionnels réinterprétés avec des couleurs modernes et un trait affiné.',
  },
];

const ARTISTS: Artist[] = [
  {
    name: 'CLAIRE',
    specialty: 'Nature & illustration',
    badge: 'Nature & illustration',
    img: ph('1611501579-4d7dc8532cc1', 800),
    alt: 'Claire — artiste tatouage nature et illustration',
  },
  {
    name: 'HUGO',
    specialty: 'Surréalisme & dreamlike',
    badge: 'Surréalisme',
    img: ph('1547036967-23136a0f3b86', 800),
    alt: 'Hugo — artiste tatouage surréaliste',
  },
  {
    name: 'ANNA',
    specialty: 'Old school revisité',
    badge: 'Old school',
    img: ph('1567401893-56e3d64e7b2c', 800),
    alt: 'Anna — artiste tatouage old school revisité',
  },
  {
    name: 'THÉO',
    specialty: 'Script & lettering poétique',
    badge: 'Lettering',
    img: ph('1611501579-4d7dc8532cc1', 800),
    alt: 'Théo — artiste tatouage script et lettering',
  },
];

const EDIT_ROWS: EditRow[] = [
  {
    eyebrow: 'Notre univers',
    img: ph('1611501579-4d7dc8532cc1', 800),
    alt: 'Illustration et tatouage — Peau & Plume',
    numeral: '01',
    title: (
      <>
        L&apos;illustration{' '}
        <span style={{ fontStyle: 'italic' }}>sur peau.</span>
      </>
    ),
    body: "Nos quatre artistes ont tous étudié les beaux-arts avant de poser l'aiguille sur peau. Chaque tatouage est une œuvre unique, dessinée à la main, jamais reproduite à l'identique. Ce n'est pas un motif choisi dans un catalogue — c'est une conversation entre vous et l'artiste.",
  },
  {
    eyebrow: 'Lille',
    img: ph('1547036967-23136a0f3b86', 800),
    alt: 'Atelier lumineux Peau & Plume — Vieux-Lille',
    numeral: '02',
    title: (
      <>
        Vieux-Lille{' '}
        <span style={{ fontStyle: 'italic' }}>lumineux.</span>
      </>
    ),
    body: "Notre atelier baigne dans la lumière naturelle d'un loft du Vieux-Lille, à deux pas de la Grand'Place. Sur rendez-vous uniquement, pour garantir la tranquillité et le temps nécessaire à chaque projet. Nous accueillons régulièrement des clients internationaux.",
    reverse: true,
  },
];

const SAFETY_ITEMS: SafetyItem[] = [
  {
    num: '01',
    title: 'Matériel stérile à usage unique',
    body: 'Aiguilles et cartouches neuves à chaque session, déballées devant vous. Aucun compromis.',
  },
  {
    num: '02',
    title: 'Encres vegan, sans nickel, sans alcool benzylique',
    body: "Notre sélection d'encres est certifiée vegan et dermatologiquement testée. Patch test disponible sur demande.",
  },
  {
    num: '03',
    title: 'Stérilisation autoclave entre chaque client',
    body: "L'ensemble de l'espace et des instruments réutilisables passe en autoclave. Traçabilité complète.",
  },
  {
    num: '04',
    title: 'Guide de soin post-tatouage + consultation J+14',
    body: 'Vous repartez avec un guide de cicatrisation détaillé et un rendez-vous de contrôle J+14 inclus dans le prix.',
  },
];

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Je suis historienne de l'art et je voulais une pièce inspirée de Magritte. L'interprétation d'Hugo a dépassé la référence — il a construit quelque chose d'entièrement neuf qui respire le surréalisme sans en copier les codes. Un tatouage que j'explique à chaque vernissage.",
    name: 'Margaux Delcourt',
    role: "Historienne de l'art · Bruxelles",
  },
  {
    quote:
      "Claire m'a tatoué un oiseau en vol pour symboliser une migration que j'ai faite. Je l'ai porté à travers trois continents maintenant — il a traversé des hivers, des saisons, des versions de moi-même. Il est toujours aussi précis, aussi vivant.",
    name: "Liam O'Brien",
    role: 'Voyageur & photographe · Dublin',
  },
];

/* ════════════════════════════════════════════════════════════════════════════
   Primitives
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
    width: 40,
    height: 1,
    background: color,
    opacity: 0.7,
    flexShrink: 0,
  };
  const label: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 10.5,
    letterSpacing: '0.40em',
    textTransform: 'uppercase',
    color,
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
}: {
  children: React.ReactNode;
  onClick?: () => void;
  filled?: boolean;
  type?: 'button' | 'submit';
}) {
  const [hover, setHover] = useState(false);
  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 12,
    padding: '14px 28px',
    fontFamily: SANS,
    fontSize: 11.5,
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    fontWeight: 700,
    cursor: 'pointer',
    border: `1.5px solid ${C.accent}`,
    background: filled ? C.accent : 'transparent',
    color: filled ? C.white : C.accent,
    transition: 'all .5s cubic-bezier(.16,1,.3,1)',
  };
  const hov: React.CSSProperties = hover
    ? filled
      ? { background: C.accentDark, borderColor: C.accentDark, transform: 'translateY(-2px)' }
      : { background: 'rgba(106,144,96,0.10)', transform: 'translateY(-2px)' }
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

  const links = [
    { label: 'Styles', href: '#styles' },
    { label: 'Artistes', href: '#artistes' },
    { label: 'Atelier', href: '#atelier' },
    { label: 'Hygiène', href: '#hygiene' },
    { label: 'Réserver', href: '#reserver' },
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
    background: solid ? 'rgba(16,14,10,0.96)' : 'transparent',
    backdropFilter: solid ? 'blur(14px) saturate(120%)' : 'none',
    WebkitBackdropFilter: solid ? 'blur(14px) saturate(120%)' : 'none',
    borderBottom: solid
      ? `1px solid rgba(106,144,96,0.20)`
      : '1px solid transparent',
    transition: 'all .6s cubic-bezier(.16,1,.3,1)',
  };
  const brand: React.CSSProperties = {
    fontFamily: SERIF,
    fontStyle: 'italic',
    fontSize: 'clamp(18px,1.8vw,22px)',
    color: C.white,
    letterSpacing: '0.04em',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  };
  const linkRow: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'clamp(16px,2.2vw,36px)',
  };

  return (
    <>
      <nav style={bar} suppressHydrationWarning>
      <a href="#hero" style={brand}>
        <Feather size={18} color={C.accent} strokeWidth={1.6} />
        Peau &amp; Plume
      </a>
      <div style={linkRow} className="pp-navlinks">
        {links.slice(0, 4).map((l) => (
          <NavLink key={l.label} label={l.label} href={l.href} />
        ))}
      </div>
      <div className="pp-navcta">
        <a href="#reserver" style={{ textDecoration: 'none' }}>
          <GreenButton filled>Réserver</GreenButton>
        </a>
      </div>
      
        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="pp-burger"
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
          .pp-navlinks { display: none !important; }
          .pp-burger { display: flex !important; flex-direction: column; }
          .pp-navcta { display: none !important; }
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
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        fontWeight: 700,
        color: h ? C.accent : 'rgba(248,246,242,0.85)',
        textDecoration: 'none',
        transition: 'color .4s',
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
          transition: 'width .5s cubic-bezier(.16,1,.3,1)',
        }}
      />
    </a>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   2 · Hero
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
  const titleOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);

  const sec: React.CSSProperties = {
    position: 'relative',
    height: '100vh',
    minHeight: 640,
    overflow: 'hidden',
    background: C.bgDark,
  };

  return (
    <section ref={ref} style={sec} id="hero">
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
          src={ph('1611501579-4d7dc8532cc1', 2000)}
          alt="Tatouage nature et plumes — Peau & Plume Lille"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </motion.div>

      {/* Voile global */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(16,14,10,0.38) 0%, rgba(16,14,10,0.08) 38%, rgba(16,14,10,0.38) 65%, rgba(16,14,10,0.84) 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(110% 80% at 50% 30%, transparent 42%, rgba(16,14,10,0.40) 100%)',
          mixBlendMode: 'multiply',
        }}
      />

      {/* Titre parallaxe */}
      <motion.div
        style={{
          position: 'relative',
          zIndex: 2,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: 'clamp(24px,5vw,80px)',
          paddingBottom: 'clamp(56px,8vw,100px)',
          y: titleY,
          opacity: titleOpacity,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.1 }}
        >
          <Eyebrow color={C.accentLight}>
            Tatouage &amp; Illustration · Lille
          </Eyebrow>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 44 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.22 }}
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontWeight: 400,
            color: C.white,
            fontSize: 'clamp(3.5rem,8vw,10rem)',
            lineHeight: 0.94,
            letterSpacing: '-0.01em',
            margin: 'clamp(16px,2vw,28px) 0 clamp(14px,2vw,22px)',
            textShadow: '0 12px 60px rgba(0,0,0,0.5)',
          }}
        >
          Peau&nbsp;/
          <br />
          &amp;&nbsp;plume.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.5 }}
          style={{
            fontFamily: SANS,
            fontWeight: 300,
            fontSize: 'clamp(15px,1.6vw,20px)',
            color: 'rgba(248,246,242,0.80)',
            maxWidth: 480,
            lineHeight: 1.7,
          }}
        >
          Atelier de tatouage artistique et d&apos;illustration à Vieux-Lille.
          Sur rendez-vous uniquement.
        </motion.p>
      </motion.div>

      {/* Cue défilement */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: 32,
          right: 'clamp(20px,4vw,64px)',
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
            fontSize: 9.5,
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: 'rgba(248,246,242,0.65)',
          }}
        >
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={18} color={C.accentLight} strokeWidth={1.5} />
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
    padding: 'clamp(88px,12vw,180px) clamp(24px,8vw,160px)',
    textAlign: 'center',
  };
  return (
    <section style={sec}>
      <Reveal>
        <p
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 'clamp(22px,3.2vw,44px)',
            lineHeight: 1.38,
            fontWeight: 400,
            maxWidth: 900,
            margin: '0 auto',
            color: C.ink,
          }}
        >
          Un tatouage doit vous surprendre encore 10&nbsp;ans après.
          C&apos;est ce que nous dessinons.
        </p>
      </Reveal>
      <Reveal delay={0.16}>
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
   4 · StyleSequence — sticky crossfade 320vh
   ════════════════════════════════════════════════════════════════════════════ */

function StyleImage({
  s,
  i,
  total,
  progress,
}: {
  s: Style;
  i: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const seg = 1 / total;
  const start = i * seg;
  const end = start + seg;
  const fadeW = seg * 0.28;

  const opacity = useTransform(
    progress,
    [Math.max(0, start - fadeW), start, end - fadeW, Math.min(1, end)],
    i === 0
      ? [1, 1, 1, 0]
      : i === total - 1
        ? [0, 1, 1, 1]
        : [0, 1, 1, 0],
  );
  const scale = useTransform(progress, [start - fadeW, end], [1.1, 1.0]);

  return (
    <motion.div style={{ position: 'absolute', inset: 0, opacity }}>
      <motion.img
        src={s.src}
        alt={s.alt}
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

function StyleCaption({
  s,
  i,
  total,
  progress,
}: {
  s: Style;
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
        padding: 'clamp(24px,5vw,80px)',
        paddingBottom: 'clamp(60px,8vw,110px)',
        opacity,
        y,
      }}
    >
      {/* Label top-right */}
      <motion.div
        style={{
          position: 'absolute',
          top: 'clamp(90px,8vw,120px)',
          right: 'clamp(24px,5vw,64px)',
          textAlign: 'right',
        }}
      >
        <div
          style={{
            fontFamily: SANS,
            fontSize: 9.5,
            letterSpacing: '0.48em',
            textTransform: 'uppercase',
            color: C.accentLight,
            fontWeight: 700,
            marginBottom: 6,
          }}
        >
          {s.index}
        </div>
        <div
          style={{
            fontFamily: SANS,
            fontSize: 11,
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: 'rgba(248,246,242,0.85)',
            fontWeight: 700,
          }}
        >
          {s.label}
        </div>
      </motion.div>

      {/* Caption bas-gauche */}
      <div style={{ maxWidth: 560 }}>
        <p
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 'clamp(16px,1.8vw,22px)',
            lineHeight: 1.65,
            color: 'rgba(248,246,242,0.84)',
            margin: 0,
          }}
        >
          {s.desc}
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
      style={{ height: 2, width, background: C.accent, opacity }}
    />
  );
}

function StyleSequence() {
  const n = STYLES.length;
  const progress = useMotionValue(0.5 / n);
  const [active, setActive] = useState(0);
  const goTo = (i: number) => {
    setActive(i);
    progress.set((i + 0.5) / n);
  };

  return (
    <section
      id="styles"
      style={{ height: '100vh', overflow: 'hidden', position: 'relative', background: C.bgDark }}
    >
      <div
        style={{
          position: 'relative',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {STYLES.map((s, i) => (
          <StyleImage
            key={s.index}
            s={s}
            i={i}
            total={STYLES.length}
            progress={progress}
          />
        ))}

        {/* Voile lisibilité */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to bottom, rgba(16,14,10,0.26), rgba(16,14,10,0.06) 40%, rgba(16,14,10,0.60))',
          }}
        />

        {STYLES.map((s, i) => (
          <StyleCaption
            key={s.index}
            s={s}
            i={i}
            total={STYLES.length}
            progress={progress}
          />
        ))}

        {/* Dots de progression */}
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
          {STYLES.map((s, i) => (
            <ProgressDot
              key={s.index}
              i={i}
              total={STYLES.length}
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
   5 · ArtistCards
   ════════════════════════════════════════════════════════════════════════════ */
function ArtistCard({ a, i }: { a: Artist; i: number }) {
  const [hover, setHover] = useState(false);
  const card: React.CSSProperties = {
    background: C.bgCard,
    border: `1px solid ${hover ? C.accent : C.border}`,
    overflow: 'hidden',
    transform: hover ? 'translateY(-10px)' : 'none',
    boxShadow: hover
      ? '0 32px 72px -24px rgba(16,14,10,0.22)'
      : '0 8px 32px -16px rgba(16,14,10,0.10)',
    transition: 'all .6s cubic-bezier(.16,1,.3,1)',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  };
  return (
    <Reveal delay={i * 0.10} style={{ height: '100%' }}>
      <article
        style={card}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '3/4' }}>
          <img
            src={a.img}
            alt={a.alt}
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: hover ? 'scale(1.07)' : 'scale(1)',
              transition: 'transform 1s cubic-bezier(.16,1,.3,1)',
              display: 'block',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to top, rgba(16,14,10,0.72), transparent 55%)',
            }}
          />
          {/* Badge spécialité */}
          <span
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              fontFamily: SANS,
              fontSize: 9.5,
              letterSpacing: '0.20em',
              textTransform: 'uppercase',
              fontWeight: 700,
              color: C.white,
              background: C.rust,
              padding: '5px 10px',
            }}
          >
            {a.badge}
          </span>
          {/* Accent vert bas-gauche */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: hover ? '100%' : '40px',
              height: 3,
              background: C.accent,
              transition: 'width .7s cubic-bezier(.16,1,.3,1)',
            }}
          />
        </div>

        <div style={{ padding: 'clamp(20px,2.4vw,28px)', flex: 1 }}>
          <div
            style={{
              fontFamily: SANS,
              fontSize: 9.5,
              letterSpacing: '0.34em',
              textTransform: 'uppercase',
              fontWeight: 700,
              color: C.accent,
              marginBottom: 8,
            }}
          >
            {a.specialty}
          </div>
          <h3
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(22px,2.2vw,28px)',
              fontWeight: 400,
              color: C.ink,
              margin: 0,
              letterSpacing: '0.06em',
            }}
          >
            {a.name}
          </h3>
        </div>
      </article>
    </Reveal>
  );
}

function ArtistCards() {
  const sec: React.CSSProperties = {
    background: C.bgAlt,
    padding: 'clamp(88px,12vw,170px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: 'clamp(20px,2.8vw,36px)',
    maxWidth: 1240,
    margin: '0 auto',
  };
  return (
    <section style={sec} id="artistes">
      <div style={{ maxWidth: 1240, margin: '0 auto clamp(48px,6vw,72px)' }}>
        <Reveal>
          <Eyebrow>Nos artistes</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(34px,5.2vw,70px)',
              fontWeight: 400,
              color: C.ink,
              margin: 'clamp(14px,2vw,22px) 0 0',
              lineHeight: 1.06,
            }}
          >
            Quatre regards,{' '}
            <span style={{ fontStyle: 'italic', color: C.accent }}>
              une école
            </span>
          </h2>
        </Reveal>
      </div>
      <div style={grid}>
        {ARTISTS.map((a, i) => (
          <ArtistCard key={a.name} a={a} i={i} />
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
  const y = useTransform(scrollYProgress, [0, 1], ['-7%', '7%']);
  return (
    <div ref={ref} style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        style={{
          width: '100%',
          height: '114%',
          objectFit: 'cover',
          display: 'block',
          y,
        }}
      />
    </div>
  );
}

function EditRow({ row }: { row: EditRow }) {
  const wrap: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 'clamp(36px,6vw,90px)',
    alignItems: 'center',
  };
  const imgWrap: React.CSSProperties = {
    overflow: 'hidden',
    order: row.reverse ? 2 : 1,
    aspectRatio: '5/6',
    position: 'relative',
  };
  const txt: React.CSSProperties = { order: row.reverse ? 1 : 2 };

  return (
    <div style={wrap} className="pp-editrow">
      <Reveal y={48} style={imgWrap}>
        <ParallaxImg src={row.img} alt={row.alt} />
        {/* Numéral fantôme */}
        <div
          style={{
            position: 'absolute',
            bottom: -20,
            right: row.reverse ? 'auto' : -10,
            left: row.reverse ? -10 : 'auto',
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 'clamp(80px,12vw,160px)',
            color: C.rust,
            opacity: 0.08,
            lineHeight: 1,
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        >
          {row.numeral}
        </div>
      </Reveal>

      <div style={txt}>
        <Reveal>
          <Eyebrow color={C.accent}>{row.eyebrow}</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h3
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(28px,4vw,54px)',
              fontWeight: 400,
              color: C.ink,
              margin: 'clamp(14px,2vw,20px) 0 clamp(16px,2.2vw,24px)',
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
              fontSize: 'clamp(15px,1.6vw,18px)',
              lineHeight: 1.82,
              color: C.textMuted,
              maxWidth: 440,
            }}
          >
            {row.body}
          </p>
        </Reveal>
      </div>
      <style>{`
        @media (max-width: 860px) {
          .pp-editrow { grid-template-columns: 1fr !important; }
          .pp-editrow > * { order: initial !important; }
        }
      `}</style>
    </div>
  );
}

function EditorialRows() {
  const sec: React.CSSProperties = {
    background: C.bg,
    padding: 'clamp(80px,11vw,155px) clamp(24px,6vw,96px)',
  };
  return (
    <section style={sec} id="atelier">
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(72px,11vw,140px)',
        }}
      >
        {EDIT_ROWS.map((row) => (
          <EditRow key={row.eyebrow} row={row} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   7 · SafetyPanel — sticky image + 4 étapes
   ════════════════════════════════════════════════════════════════════════════ */
function SafetyPanel() {
  const sec: React.CSSProperties = {
    background: C.bgDark,
    padding: 'clamp(80px,11vw,155px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '0.85fr 1.15fr',
    gap: 'clamp(40px,6vw,96px)',
    maxWidth: 1240,
    margin: '0 auto',
    alignItems: 'start',
  };
  const stickySide: React.CSSProperties = {
    position: 'sticky',
    top: 100,
    alignSelf: 'start',
  };

  return (
    <section style={sec} id="hygiene">
      <div style={grid} className="pp-safepanel">
        {/* Image collante */}
        <div style={stickySide} className="pp-safepanel-img">
          <Reveal>
            <div
              style={{
                overflow: 'hidden',
                border: `1px solid rgba(106,144,96,0.28)`,
                aspectRatio: '4/5',
              }}
            >
              <img
                src={ph('1567401893-56e3d64e7b2c', 900)}
                alt="Hygiène irréprochable — Peau & Plume"
                loading="lazy"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </div>
            <div style={{ marginTop: 20 }}>
              <div
                style={{
                  fontFamily: SANS,
                  fontSize: 10,
                  letterSpacing: '0.30em',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  color: C.accent,
                  marginBottom: 6,
                }}
              >
                Certifié · Audité · Traçable
              </div>
              <div
                style={{
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  fontSize: 16,
                  color: 'rgba(248,246,242,0.75)',
                  lineHeight: 1.6,
                }}
              >
                « Un tatouage sûr commence avant l&apos;aiguille. »
              </div>
            </div>
          </Reveal>
        </div>

        {/* Étapes qui défilent */}
        <div>
          <Reveal>
            <Eyebrow color={C.accentLight}>Hygiène &amp; sécurité</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(32px,4.4vw,58px)',
                fontWeight: 400,
                color: C.white,
                margin: 'clamp(14px,2vw,22px) 0 clamp(40px,5vw,60px)',
                lineHeight: 1.08,
              }}
            >
              Des standards{' '}
              <span style={{ fontStyle: 'italic', color: C.accentLight }}>
                sans compromis
              </span>
            </h2>
          </Reveal>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {SAFETY_ITEMS.map((item, i) => (
              <Reveal key={item.num} delay={0.05 * i}>
                <div
                  style={{
                    padding: 'clamp(26px,3.5vw,38px) 0',
                    borderTop: `1px solid ${C.rust}`,
                    display: 'flex',
                    gap: 'clamp(20px,3vw,36px)',
                    alignItems: 'flex-start',
                  }}
                >
                  <span
                    style={{
                      fontFamily: SANS,
                      fontWeight: 700,
                      fontSize: 'clamp(18px,2vw,24px)',
                      color: C.accent,
                      minWidth: 36,
                      paddingTop: 2,
                      flexShrink: 0,
                    }}
                  >
                    {item.num}
                  </span>
                  <div>
                    <h4
                      style={{
                        fontFamily: SERIF,
                        fontSize: 'clamp(18px,2vw,23px)',
                        fontWeight: 600,
                        color: C.white,
                        margin: '0 0 10px',
                        lineHeight: 1.3,
                      }}
                    >
                      {item.title}
                    </h4>
                    <p
                      style={{
                        fontFamily: SANS,
                        fontWeight: 300,
                        fontSize: 'clamp(14px,1.4vw,16.5px)',
                        lineHeight: 1.72,
                        color: 'rgba(248,246,242,0.68)',
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
        </div>
      </div>
      <style>{`
        @media (max-width: 860px) {
          .pp-safepanel { grid-template-columns: 1fr !important; }
          .pp-safepanel-img { position: static !important; }
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
    padding: 'clamp(88px,12vw,170px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: 'clamp(28px,4vw,56px)',
    maxWidth: 1180,
    margin: '0 auto',
  };
  return (
    <section id="about" style={sec}>
      <div
        style={{ maxWidth: 1180, margin: '0 auto clamp(52px,6vw,72px)', textAlign: 'center' }}
      >
        <Reveal>
          <Eyebrow color={C.accent} align="center">
            Ils portent Peau &amp; Plume
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(30px,4.6vw,60px)',
              fontWeight: 400,
              color: C.ink,
              margin: 'clamp(14px,2vw,22px) 0 0',
              lineHeight: 1.08,
            }}
          >
            Des encres qui{' '}
            <span style={{ fontStyle: 'italic', color: C.accent }}>
              voyagent
            </span>
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
                boxShadow: '0 18px 56px -36px rgba(16,14,10,0.18)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Feather
                size={28}
                color={C.accent}
                strokeWidth={1.4}
                style={{ marginBottom: 20 }}
              />
              <blockquote
                style={{
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  fontSize: 'clamp(16px,1.8vw,20px)',
                  lineHeight: 1.65,
                  color: C.ink,
                  margin: '0 0 clamp(22px,3vw,30px)',
                  flex: 1,
                }}
              >
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption
                style={{ borderTop: `1px solid ${C.border}`, paddingTop: 18 }}
              >
                <div
                  style={{
                    fontFamily: SERIF,
                    fontSize: 18,
                    color: C.accent,
                    marginBottom: 4,
                  }}
                >
                  {t.name}
                </div>
                <div
                  style={{
                    fontFamily: SANS,
                    fontSize: 10.5,
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
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   9 · BookingForm
   ════════════════════════════════════════════════════════════════════════════ */
function BookingForm() {
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [tel, setTel] = useState('');
  const [style, setStyle] = useState('');
  const [taille, setTaille] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prenom || !email) return;
    setSent(true);
  };

  const inputBase: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    background: 'transparent',
    border: 'none',
    borderBottom: `1px solid rgba(106,144,96,0.38)`,
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
    letterSpacing: '0.30em',
    textTransform: 'uppercase',
    fontWeight: 700,
    color: C.accent,
    display: 'block',
    marginBottom: 4,
  };
  const sec: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    background: C.bgDark,
    padding: 'clamp(96px,13vw,180px) clamp(24px,6vw,96px)',
  };

  return (
    <section style={sec} id="reserver">
      {/* Fond fantôme */}
      <img
        src={ph('1567401893-56e3d64e7b2c', 1200)}
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
          <Eyebrow color={C.accentLight} align="center">
            Prise de rendez-vous
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(34px,5.5vw,74px)',
              fontWeight: 400,
              color: C.white,
              margin: 'clamp(14px,2vw,22px) 0 clamp(12px,1.8vw,18px)',
              lineHeight: 1.06,
            }}
          >
            Démarrons{' '}
            <span style={{ fontStyle: 'italic', color: C.accentLight }}>
              votre projet
            </span>
          </h2>
        </Reveal>
        <Reveal delay={0.14}>
          <p
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: 'clamp(15px,1.6vw,19px)',
              lineHeight: 1.72,
              color: 'rgba(248,246,242,0.76)',
              maxWidth: 500,
              margin: '0 auto clamp(44px,6vw,60px)',
            }}
          >
            Décrivez votre idée — même imprécise. Nous vous répondrons sous
            48h pour planifier une consultation.
          </p>
        </Reveal>

        {sent ? (
          <Reveal>
            <div
              style={{
                border: `1px solid ${C.accent}`,
                padding: 'clamp(32px,5vw,52px)',
                background: 'rgba(106,144,96,0.07)',
                textAlign: 'center',
              }}
            >
              <Feather size={32} color={C.accentLight} strokeWidth={1.4} />
              <h3
                style={{
                  fontFamily: SERIF,
                  fontSize: 'clamp(24px,3vw,34px)',
                  fontWeight: 400,
                  color: C.white,
                  margin: 'clamp(14px,2vw,22px) 0 clamp(10px,1.4vw,14px)',
                }}
              >
                Merci {prenom},
              </h3>
              <p
                style={{
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  fontSize: 'clamp(15px,1.6vw,18px)',
                  color: 'rgba(248,246,242,0.78)',
                  margin: 0,
                  lineHeight: 1.7,
                }}
              >
                notre équipe vous répondra sous 48h pour planifier
                votre&nbsp;consultation.
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
                gap: 'clamp(24px,3.5vw,34px)',
                textAlign: 'left',
              }}
            >
              {/* Prénom */}
              <div>
                <label style={labelStyle} htmlFor="pp-prenom">
                  Prénom
                </label>
                <input
                  id="pp-prenom"
                  style={inputBase}
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  placeholder="Votre prénom"
                  autoComplete="given-name"
                  required
                />
              </div>

              {/* Email + Téléphone côte à côte */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 'clamp(18px,3vw,36px)',
                }}
                className="pp-form-row"
              >
                <div>
                  <label style={labelStyle} htmlFor="pp-email">
                    Email
                  </label>
                  <input
                    id="pp-email"
                    type="email"
                    style={inputBase}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.fr"
                    autoComplete="email"
                    required
                  />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="pp-tel">
                    Téléphone
                  </label>
                  <input
                    id="pp-tel"
                    type="tel"
                    style={inputBase}
                    value={tel}
                    onChange={(e) => setTel(e.target.value)}
                    placeholder="+33 6 ..."
                    autoComplete="tel"
                  />
                </div>
              </div>

              {/* Style */}
              <div>
                <label style={labelStyle} htmlFor="pp-style">
                  Style de tatouage
                </label>
                <select
                  id="pp-style"
                  style={{
                    ...inputBase,
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    cursor: 'pointer',
                    color: style ? C.white : 'rgba(248,246,242,0.40)',
                  }}
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                >
                  <option value="" style={{color: brand ?? '#100e0a' }}>
                    Choisir un style…
                  </option>
                  <option value="Oiseau & plume" style={{color: brand ?? '#100e0a' }}>
                    Oiseau &amp; plume
                  </option>
                  <option value="Nature morte" style={{color: brand ?? '#100e0a' }}>
                    Nature morte
                  </option>
                  <option value="Surréalisme" style={{color: brand ?? '#100e0a' }}>
                    Surréalisme
                  </option>
                  <option
                    value="Old school revisité"
                    style={{color: brand ?? '#100e0a' }}
                  >
                    Old school revisité
                  </option>
                  <option value="Script poétique" style={{color: brand ?? '#100e0a' }}>
                    Script poétique
                  </option>
                  <option value="Autre" style={{color: brand ?? '#100e0a' }}>
                    Autre
                  </option>
                </select>
              </div>

              {/* Taille */}
              <div>
                <label style={labelStyle} htmlFor="pp-taille">
                  Taille approximative
                </label>
                <input
                  id="pp-taille"
                  style={inputBase}
                  value={taille}
                  onChange={(e) => setTaille(e.target.value)}
                  placeholder="Ex. : paume de main, avant-bras, 10×6 cm…"
                />
              </div>

              {/* Message */}
              <div>
                <label style={labelStyle} htmlFor="pp-message">
                  Votre projet
                </label>
                <textarea
                  id="pp-message"
                  rows={5}
                  style={{
                    ...inputBase,
                    resize: 'vertical',
                    minHeight: 120,
                  }}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Décrivez votre idée, sa signification, les zones du corps envisagées, les références visuelles que vous aimez…"
                />
              </div>

              <div style={{ textAlign: 'center', marginTop: 8 }}>
                <GreenButton filled type="submit">
                  Envoyer ma demande
                </GreenButton>
              </div>
            </form>
          </Reveal>
        )}
      </div>
      <style>{`
        @media (max-width: 860px) {
          .pp-form-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   10 · Footer
   ════════════════════════════════════════════════════════════════════════════ */
function Footer() {
  const cols: { title: string; items: string[] }[] = [
    {
      title: 'Styles',
      items: ['Nature & plumes', 'Surréalisme', 'Old school revisité', 'Script poétique'],
    },
    {
      title: 'Artistes',
      items: ['Claire', 'Hugo', 'Anna', 'Théo'],
    },
    {
      title: 'Atelier',
      items: ['Notre univers', 'Vieux-Lille', 'Hygiène & sécurité', 'Réserver'],
    },
  ];

  const foot: React.CSSProperties = {
    background: C.bgDarkAlt,
    borderTop: `1px solid rgba(106,144,96,0.16)`,
    padding: 'clamp(64px,9vw,106px) clamp(24px,6vw,96px) 36px',
  };

  return (
    <footer id="contact" style={foot}>
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.4fr repeat(3, 1fr)',
          gap: 'clamp(32px,5vw,64px)',
        }}
        className="pp-footgrid"
      >
        {/* Brand */}
        <div>
          <div
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: 'clamp(20px,2vw,26px)',
              color: C.white,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 18,
            }}
          >
            <Feather size={20} color={C.accent} strokeWidth={1.5} />
            Peau &amp; Plume
          </div>
          <p
            style={{
              fontFamily: SANS,
              fontWeight: 300,
              fontSize: 14.5,
              lineHeight: 1.75,
              color: 'rgba(248,246,242,0.60)',
              marginTop: 0,
              marginBottom: 20,
              maxWidth: 300,
            }}
          >
            Atelier de tatouage artistique &amp; d&apos;illustration. Sur
            rendez-vous, Vieux-Lille.
          </p>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontFamily: SANS,
              fontSize: 11,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'rgba(248,246,242,0.54)',
            }}
          >
            <MapPin size={13} color={C.accent} strokeWidth={1.6} />
            Vieux-Lille, Nord · France
          </div>
        </div>

        {/* Colonnes nav */}
        {cols.map((c) => (
          <div key={c.title}>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 10,
                letterSpacing: '0.30em',
                textTransform: 'uppercase',
                fontWeight: 700,
                color: C.accent,
                marginBottom: 18,
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
                    href="#reserver"
                    style={{
                      fontFamily: SANS,
                      fontWeight: 300,
                      fontSize: 14.5,
                      color: 'rgba(248,246,242,0.68)',
                      textDecoration: 'none',
                      transition: 'color .35s',
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

      {/* Baseline */}
      <div
        style={{
          maxWidth: 1240,
          margin: 'clamp(48px,7vw,72px) auto 0',
          paddingTop: 24,
          borderTop: `1px solid rgba(106,144,96,0.12)`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 14,
          fontFamily: SANS,
          fontSize: 11,
          letterSpacing: '0.10em',
          color: 'rgba(248,246,242,0.42)',
        }}
      >
        <span>© 2024–2026 Peau &amp; Plume · Lille</span>
        <span style={{ display: 'flex', gap: 24 }}>
          <a href="#reserver" style={{ color: 'inherit', textDecoration: 'none' }}>
            Mentions légales
          </a>
          <a href="#reserver" style={{ color: 'inherit', textDecoration: 'none' }}>
            Confidentialité
          </a>
        </span>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .pp-footgrid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .pp-footgrid { grid-template-columns: 1fr !important; }
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

  const root: React.CSSProperties = {
    background: C.bgDark,
    color: C.white,
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
      {/* Google Fonts */}
      <style suppressHydrationWarning>{`
        @import url('${FONTS_URL}');

        *, *::before, *::after { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { margin: 0; }

        input::placeholder,
        textarea::placeholder,
        select option:first-child { color: rgba(248,246,242,0.38); }

        input:focus,
        textarea:focus,
        select:focus {
          border-bottom-color: rgba(106,144,96,0.80) !important;
        }

        /* iOS zoom prevention */
        input, textarea, select {
          font-size: 16px;
        }

        @media (max-width: 860px) {
          .pp-navlinks { display: none !important; }
          .pp-navcta { display: none !important; }
          .pp-editrow { grid-template-columns: 1fr !important; }
          .pp-editrow > * { order: initial !important; }
          .pp-safepanel { grid-template-columns: 1fr !important; }
          .pp-safepanel-img { position: static !important; }
          .pp-form-row { grid-template-columns: 1fr !important; }
          .pp-footgrid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .pp-footgrid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <main style={root} suppressHydrationWarning>
        <Nav />
        <Hero />
        <Intro />
        <StyleSequence />
        <ArtistCards />
        <EditorialRows />
        <SafetyPanel />
        <Testimonials />
        <BookingForm />
        <Footer />
      </main>
    </>
  );
}
