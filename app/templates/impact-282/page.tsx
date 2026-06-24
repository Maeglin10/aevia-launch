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
import {
  ArrowRight,
  ChevronDown,
  Wheat,
  MapPin,
  Quote,
  Star,
  Clock,
  Flame,
  Leaf,
  Award,
  ShoppingBag,
  Phone,
  Mail,
  Truck,
  Calendar,
  ChefHat,
  Sun,
  Heart,
} from 'lucide-react';

/* ════════════════════════════════════════════════════════════════════════════
   BOULANGERIE DU BEFFROI — Boulangerie artisanale & pâtisserie · Lille Vieux-Bourg
   Pain chaud + chorégraphie de défilement éditoriale (style artisan ×
   chaleur chapitrée). Auto-suffisant. 'use client'.
   ════════════════════════════════════════════════════════════════════════════ */

/* ── Palette ─────────────────────────────────────────────────────────────── */
const C = {
  brown: '#5c3a1e',
  brownDeep: '#3d2510',
  brownMid: '#7a4f2c',
  wheat: '#e8b84b',
  wheatLight: '#f2d07e',
  cream: '#fdf6e3',
  creamDeep: '#f0e4c4',
  red: '#c0392b',
  redDeep: '#922b21',
  ink: '#2c1a0e',
  paper: '#fdf6e3',
} as const;

const SERIF = "'Libre Baskerville', Georgia, serif" as const;
const SANS = "'Nunito', system-ui, sans-serif" as const;

/* ── Photographie (URLs Unsplash pré-vérifiées — NE PAS modifier les IDs) ── */
const PHOTO = {
  pain:
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1600&auto=format&fit=crop',
  croissants:
    'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1600&auto=format&fit=crop',
  boulanger:
    'https://images.unsplash.com/photo-1568254183919-78a4f43a2877?q=80&w=1600&auto=format&fit=crop',
  patisseries:
    'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?q=80&w=1600&auto=format&fit=crop',
  painHero:
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1600&auto=format&fit=crop',
  levain:
    'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1600&auto=format&fit=crop',
} as const;

/* ── Easing partagé ──────────────────────────────────────────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ════════════════════════════════════════════════════════════════════════════
   Primitives
   ════════════════════════════════════════════════════════════════════════════ */

/** Étiquette fine, capitales, interlettrage large, filet doré. */
function Eyebrow({
  children,
  color = C.wheat,
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
    width: 46,
    height: 1,
    background: color,
    opacity: 0.7,
  };
  const labelStyle: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 11,
    letterSpacing: '0.42em',
    textTransform: 'uppercase',
    color,
    fontWeight: 700,
  };
  return (
    <div style={wrap}>
      <span style={rule} />
      <span style={labelStyle}>{children}</span>
      {align === 'center' ? <span style={rule} /> : null}
    </div>
  );
}

/** Révélation au scroll : fondu + translation verticale, une seule fois. */
function Reveal({
  children,
  delay = 0,
  y = 38,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-12% 0px -12% 0px' });
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

/** Bouton brun chaud, contour doré, flèche qui glisse au survol. */
function BreadButton({
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
    fontSize: 13,
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    fontWeight: 700,
    cursor: 'pointer',
    border: filled
      ? `1px solid ${C.wheat}`
      : dark
        ? `1px solid rgba(92,58,30,0.4)`
        : `1px solid rgba(232,184,75,0.6)`,
    background: filled ? C.wheat : dark ? 'transparent' : 'transparent',
    color: filled ? C.brownDeep : dark ? C.brown : C.cream,
    transition: 'all .5s cubic-bezier(.16,1,.3,1)',
  };
  const hov: React.CSSProperties = hover
    ? filled
      ? { background: C.wheatLight, transform: 'translateY(-2px)' }
      : dark
        ? { background: 'rgba(92,58,30,0.08)', transform: 'translateY(-2px)' }
        : { background: 'rgba(232,184,75,0.12)', transform: 'translateY(-2px)' }
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
   Navigation : transparente → solide au défilement
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
    { label: 'Notre pain', href: '#specialites' },
    { label: 'Le processus', href: '#processus' },
    { label: 'La carte', href: '#menu' },
    { label: 'Horaires', href: '#horaires' },
    { label: 'Commander', href: '#commande' },
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
    padding: solid ? '16px clamp(20px,5vw,64px)' : '26px clamp(20px,5vw,64px)',
    background: solid ? 'rgba(61,37,16,0.95)' : 'transparent',
    backdropFilter: solid ? 'blur(14px) saturate(120%)' : 'none',
    WebkitBackdropFilter: solid ? 'blur(14px) saturate(120%)' : 'none',
    borderBottom: solid
      ? `1px solid rgba(232,184,75,0.22)`
      : '1px solid transparent',
    transition: 'all .6s cubic-bezier(.16,1,.3,1)',
  };
  const brand: React.CSSProperties = {
    fontFamily: SERIF,
    fontSize: 19,
    letterSpacing: '0.10em',
    color: C.cream,
    textTransform: 'uppercase',
    fontWeight: 400,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  };
  const linkRow: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'clamp(18px,2.4vw,38px)',
  };

  return (
    <>
      <nav style={bar}>
      <div style={brand}>
        <Wheat size={22} color={C.wheat} strokeWidth={1.4} />
        Boulangerie&nbsp;du&nbsp;Beffroi
      </div>
      <div style={linkRow} className="r282-navlinks">
        {links.map((l) => (
          <NavLink key={l.label} label={l.label} href={l.href} />
        ))}
      </div>
      <div className="r282-navcta">
        <a href="#commande" style={{ textDecoration: 'none' }}>
          <BreadButton filled>Commander</BreadButton>
        </a>
      </div>
      
        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="r282-burger"
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
          .r282-navlinks{ display:none !important; }
          .r282-burger { display: flex !important; flex-direction: column; }
          .r282-navcta{ display:none !important; }
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
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        fontWeight: 600,
        color: h ? C.wheat : C.cream,
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
          background: C.wheat,
          transition: 'width .5s cubic-bezier(.16,1,.3,1)',
        }}
      />
    </a>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   1 · HERO — four à bois, titre chaud, CTA commander
   ════════════════════════════════════════════════════════════════════════════ */
function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '14%']);
  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '-46%']);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);

  const section: React.CSSProperties = {
    position: 'relative',
    height: '100vh',
    minHeight: 640,
    overflow: 'hidden',
    background: C.brownDeep,
  };

  return (
    <section id="hero" ref={ref} style={section}>
      {/* Photo plein cadre — four à bois, pain artisan */}
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
          src={PHOTO.painHero}
          alt="Pain artisan chaud sorti du four à bois de la Boulangerie du Beffroi"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </motion.div>

      {/* Voiles : ambiance feu de bois */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(61,37,16,0.55) 0%, rgba(61,37,16,0.15) 36%, rgba(61,37,16,0.50) 68%, rgba(61,37,16,0.92) 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(120% 80% at 50% 30%, transparent 38%, rgba(92,58,30,0.50) 100%)',
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
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '0 24px',
          y: titleY,
          opacity: titleOpacity,
        }}
      >
        <Reveal y={20}>
          <Eyebrow color={C.wheatLight} align="center">
            Boulangerie artisanale · Depuis 1978
          </Eyebrow>
        </Reveal>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.15 }}
          style={{
            fontFamily: SERIF,
            fontWeight: 400,
            color: C.cream,
            fontSize: 'clamp(48px, 8.5vw, 128px)',
            lineHeight: 0.98,
            letterSpacing: '-0.01em',
            margin: '28px 0 22px',
            textShadow: '0 12px 60px rgba(0,0,0,0.5)',
          }}
        >
          Le pain de nos{' '}
          <span style={{ fontStyle: 'italic', color: C.wheatLight }}>
            grands-pères
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.45 }}
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 'clamp(16px, 1.9vw, 22px)',
            color: 'rgba(253,246,227,0.88)',
            maxWidth: 580,
            lineHeight: 1.65,
          }}
        >
          Artisan boulanger depuis 1978 au cœur du Vieux-Bourg, nous pétrissons
          chaque matin des pains au levain naturel, des viennoiseries feuilletées
          et des pâtisseries de saison.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.72 }}
          style={{ marginTop: 44, display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <BreadButton filled>Commander une spécialité</BreadButton>
          <BreadButton>Voir la carte</BreadButton>
        </motion.div>
      </motion.div>

      {/* Indice de défilement */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: 34,
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
            color: 'rgba(253,246,227,0.7)',
            fontWeight: 600,
          }}
        >
          Découvrir
        </span>
        <motion.div
          animate={{ y: [0, 9, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={20} color={C.wheatLight} strokeWidth={1.3} />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   2 · ScrollCrossfade — 320vh sticky, 3 visuels avec ProgressDots
   ════════════════════════════════════════════════════════════════════════════ */
type CrossfadeChapter = {
  src: string;
  alt: string;
  index: string;
  caption: string;
  sub: string;
};

const CROSSFADE_CHAPTERS: CrossfadeChapter[] = [
  {
    src: PHOTO.pain,
    alt: 'Pain artisan chaud sorti du four à bois',
    index: 'I',
    caption: 'Pain chaud',
    sub: 'Croûte dorée, mie alvéolée, levain naturel — sorti du four à 6h du matin.',
  },
  {
    src: PHOTO.croissants,
    alt: 'Croissants et viennoiseries feuilletées dorées',
    index: 'II',
    caption: 'Viennoiseries',
    sub: 'Beurre AOP, feuilletage 27 couches, croque sous la dent.',
  },
  {
    src: PHOTO.patisseries,
    alt: 'Pâtisseries artisanales de saison',
    index: 'III',
    caption: 'Pâtisseries',
    sub: 'Tartes aux fruits de saison, entremets, créations du chef pâtissier.',
  },
];

function CrossfadeImage({
  chapter,
  i,
  total,
  progress,
}: {
  chapter: CrossfadeChapter;
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
  const scale = useTransform(progress, [start - fadeIn, end], [1.14, 1.0]);

  return (
    <motion.div style={{ position: 'absolute', inset: 0, opacity }}>
      <motion.img
        src={chapter.src}
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

function CrossfadeCaption({
  chapter,
  i,
  total,
  progress,
}: {
  chapter: CrossfadeChapter;
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
  const y = useTransform(progress, [start, end], [34, -34]);

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
          fontSize: 'clamp(40px, 9vw, 120px)',
          color: 'rgba(232,184,75,0.30)',
          lineHeight: 1,
          marginBottom: 6,
        }}
      >
        {chapter.index}
      </span>
      <h2
        style={{
          fontFamily: SERIF,
          fontSize: 'clamp(40px, 7vw, 96px)',
          fontWeight: 400,
          color: C.cream,
          lineHeight: 1,
          margin: 0,
          textShadow: '0 8px 40px rgba(0,0,0,0.55)',
        }}
      >
        {chapter.caption}
      </h2>
      <p
        style={{
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontSize: 'clamp(15px, 1.8vw, 21px)',
          color: 'rgba(253,246,227,0.86)',
          marginTop: 18,
          maxWidth: 460,
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
    [0.3, 1, 1, 0.3],
  );
  const width = useTransform(progress, [i * seg, (i + 1) * seg], [10, 34]);
  return (
    <motion.div style={{ height: 2, width, background: C.wheat, opacity }} />
  );
}

function ScrollCrossfade() {
  const n = CROSSFADE_CHAPTERS.length;
  const progress = useMotionValue(0.5 / n);
  const [active, setActive] = useState(0);
  const goTo = (i: number) => {
    setActive(i);
    progress.set((i + 0.5) / n);
  };

  return (
    <section
      style={{ height: '100vh', overflow: 'hidden', position: 'relative', background: C.brownDeep }}
    >
      <div
        style={{
          position: 'relative',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {CROSSFADE_CHAPTERS.map((c, i) => (
          <CrossfadeImage
            key={c.caption}
            chapter={c}
            i={i}
            total={CROSSFADE_CHAPTERS.length}
            progress={progress}
          />
        ))}
        {/* voile lisibilité */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to bottom, rgba(61,37,16,0.35), rgba(61,37,16,0.10) 44%, rgba(61,37,16,0.65))',
          }}
        />
        {CROSSFADE_CHAPTERS.map((c, i) => (
          <CrossfadeCaption
            key={c.caption}
            chapter={c}
            i={i}
            total={CROSSFADE_CHAPTERS.length}
            progress={progress}
          />
        ))}

        {/* ProgressDots animés */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 12,
          }}
        >
          {CROSSFADE_CHAPTERS.map((c, i) => (
            <ProgressDot
              key={c.index}
              i={i}
              total={CROSSFADE_CHAPTERS.length}
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
   3 · SpecialitesSection — 3 spécialités phares
   ════════════════════════════════════════════════════════════════════════════ */
type Specialite = {
  icon: React.ReactNode;
  titre: string;
  sous: string;
  description: string;
  detail: string;
};

const SPECIALITES: Specialite[] = [
  {
    icon: <Wheat size={36} strokeWidth={1.3} color={C.wheat} />,
    titre: 'Pains au levain',
    sous: 'Levain naturel 24h · farines locales',
    description:
      'Notre levain mère, entretenu depuis 1978, donne à chaque miche sa saveur légèrement acidulée et sa conservation exceptionnelle.',
    detail: 'Pain de campagne · Seigle · Épeautre · Sarrasin',
  },
  {
    icon: <ChefHat size={36} strokeWidth={1.3} color={C.wheat} />,
    titre: 'Viennoiseries feuilletées',
    sous: 'Beurre AOP · 27 couches',
    description:
      'Croissants, pains au chocolat et kouign-amann façonnés chaque matin avec un beurre de qualité supérieure pour un feuilletage parfait.',
    detail: 'Croissant · Pain au chocolat · Kouign-amann · Pain aux raisins',
  },
  {
    icon: <Heart size={36} strokeWidth={1.3} color={C.wheat} />,
    titre: 'Pâtisseries de saison',
    sous: 'Fruits locaux · Créations du chef',
    description:
      'Des entremets, tartes et gâteaux qui changent au fil des saisons, élaborés avec les fruits des producteurs partenaires du Nord.',
    detail: 'Tarte au citron · Fraisier · Millefeuille · Opéra maison',
  },
];

function SpecialiteCard({ s, i }: { s: Specialite; i: number }) {
  const [hover, setHover] = useState(false);
  const card: React.CSSProperties = {
    background: hover ? C.brownMid : 'rgba(92,58,30,0.08)',
    border: `1px solid ${hover ? 'rgba(232,184,75,0.6)' : 'rgba(232,184,75,0.22)'}`,
    padding: 'clamp(32px,4vw,48px)',
    transition: 'all .6s cubic-bezier(.16,1,.3,1)',
    cursor: 'default',
    display: 'flex',
    flexDirection: 'column',
    gap: 18,
  };

  return (
    <Reveal delay={i * 0.12}>
      <div
        style={card}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div style={{ padding: '10px 0 4px' }}>{s.icon}</div>
        <div>
          <div
            style={{
              fontFamily: SANS,
              fontSize: 10.5,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: C.wheatLight,
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            {s.sous}
          </div>
          <h3
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(26px, 3vw, 34px)',
              fontWeight: 400,
              color: C.cream,
              margin: '0 0 14px',
              lineHeight: 1.12,
            }}
          >
            {s.titre}
          </h3>
          <p
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: 16,
              lineHeight: 1.72,
              color: 'rgba(253,246,227,0.76)',
              margin: '0 0 18px',
            }}
          >
            {s.description}
          </p>
        </div>
        <div
          style={{
            paddingTop: 16,
            borderTop: `1px solid rgba(232,184,75,0.22)`,
            fontFamily: SANS,
            fontSize: 12,
            letterSpacing: '0.12em',
            color: hover ? C.wheat : 'rgba(232,184,75,0.6)',
            lineHeight: 1.8,
            transition: 'color .4s',
          }}
        >
          {s.detail}
        </div>
      </div>
    </Reveal>
  );
}

function SpecialitesSection() {
  const sec: React.CSSProperties = {
    background: C.brownDeep,
    padding: 'clamp(90px,12vw,170px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
    gap: 'clamp(20px,2.5vw,36px)',
    maxWidth: 1240,
    margin: '0 auto',
  };
  return (
    <section style={sec} id="specialites">
      <div style={{ maxWidth: 1240, margin: '0 auto 60px' }}>
        <Reveal>
          <Eyebrow>Nos spécialités</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(36px, 5.5vw, 74px)',
              fontWeight: 400,
              color: C.cream,
              margin: '20px 0 0',
              lineHeight: 1.05,
            }}
          >
            L&apos;artisanat au{' '}
            <span style={{ fontStyle: 'italic', color: C.wheatLight }}>
              quotidien
            </span>
          </h2>
        </Reveal>
        <Reveal delay={0.14}>
          <p
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: 'clamp(16px,1.7vw,20px)',
              color: 'rgba(253,246,227,0.72)',
              maxWidth: 560,
              lineHeight: 1.7,
              marginTop: 20,
            }}
          >
            Trois familles de produits, une seule obsession : le goût vrai,
            sans compromis.
          </p>
        </Reveal>
      </div>
      <div style={grid}>
        {SPECIALITES.map((s, i) => (
          <SpecialiteCard key={s.titre} s={s} i={i} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   4 · ProcessSection — left sticky photo + right scroll 4 étapes
   ════════════════════════════════════════════════════════════════════════════ */
type ProcessEtape = {
  num: string;
  titre: string;
  body: string;
  icon: React.ReactNode;
};

const PROCESS_ETAPES: ProcessEtape[] = [
  {
    num: '01',
    titre: 'Levain naturel 24h',
    body: 'Notre levain mère fermente 24 heures minimum. Pas de levure industrielle : la fermentation lente développe les arômes complexes, améliore la digestibilité et garantit une conservation naturelle de 4 à 5 jours.',
    icon: <Leaf size={22} strokeWidth={1.4} color={C.wheat} />,
  },
  {
    num: '02',
    titre: 'Farines locales',
    body: 'Nous travaillons exclusivement avec des minoteries du Nord-Pas-de-Calais. Farines de blé T65, seigle, épeautre et sarrasin — toutes issues de l\'agriculture raisonnée, moulues sur meule de pierre pour préserver les nutriments.',
    icon: <Wheat size={22} strokeWidth={1.4} color={C.wheat} />,
  },
  {
    num: '03',
    titre: 'Cuisson four à bois',
    body: 'Notre four à bois en briques réfractaires, restauré en 2004, atteint 280°C et maintient une chaleur homogène incomparable. La sole absorbe l\'humidité et crée cette croûte craquante unique, impossible à reproduire avec un four électrique.',
    icon: <Flame size={22} strokeWidth={1.4} color={C.wheat} />,
  },
  {
    num: '04',
    titre: 'Fraîcheur du jour',
    body: 'Tout est préparé la nuit et le matin même. Aucun produit surgelé, aucun améliorant. Ce qui n\'est pas vendu en journée repart avec des associations locales — zéro gaspillage, engagement constant.',
    icon: <Sun size={22} strokeWidth={1.4} color={C.wheat} />,
  },
];

function ParallaxImg282({ src, alt }: { src: string; alt: string }) {
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

function ProcessSection() {
  const sec: React.CSSProperties = {
    background: C.paper,
    padding: 'clamp(80px,11vw,160px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '0.9fr 1.1fr',
    gap: 'clamp(40px,6vw,96px)',
    maxWidth: 1240,
    margin: '0 auto',
    alignItems: 'start',
  };
  const stickySide: React.CSSProperties = {
    position: 'sticky',
    top: 90,
    alignSelf: 'start',
  };

  return (
    <section style={sec} id="processus">
      <div style={grid} className="r282-process-grid">
        {/* Photo boulanger — sticky gauche */}
        <div style={stickySide} className="r282-process-sticky">
          <div
            style={{
              overflow: 'hidden',
              border: `1px solid ${C.creamDeep}`,
              aspectRatio: '4 / 5',
              boxShadow: '0 32px 64px -32px rgba(92,58,30,0.28)',
            }}
          >
            <ParallaxImg282
              src={PHOTO.boulanger}
              alt="Boulanger artisan pétrissant la pâte à la Boulangerie du Beffroi"
            />
          </div>
          <div
            style={{
              marginTop: 22,
              padding: '18px 22px',
              background: C.cream,
              border: `1px solid ${C.creamDeep}`,
            }}
          >
            <div
              style={{
                fontFamily: SANS,
                fontSize: 10.5,
                letterSpacing: '0.26em',
                textTransform: 'uppercase',
                color: C.brownMid,
                fontWeight: 700,
                marginBottom: 8,
              }}
            >
              Notre savoir-faire
            </div>
            <div
              style={{
                fontFamily: SERIF,
                fontStyle: 'italic',
                fontSize: 17,
                color: C.ink,
                lineHeight: 1.6,
              }}
            >
              « Le bon pain ne se fabrique pas, il se cultive — nuit après
              nuit, avec patience. »
            </div>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 11,
                color: 'rgba(44,26,14,0.55)',
                marginTop: 12,
                letterSpacing: '0.12em',
              }}
            >
              — Marc Dubois, Maître Boulanger MOF
            </div>
          </div>
        </div>

        {/* Étapes qui défilent à droite */}
        <div>
          <Reveal>
            <Eyebrow color={C.brownMid}>Le processus</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(32px,4.8vw,64px)',
                fontWeight: 400,
                color: C.ink,
                margin: '20px 0 52px',
                lineHeight: 1.06,
              }}
            >
              De la nuit au{' '}
              <span style={{ fontStyle: 'italic', color: C.red }}>
                matin
              </span>
            </h2>
          </Reveal>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {PROCESS_ETAPES.map((e, i) => (
              <Reveal key={e.num} delay={0.06 * i}>
                <div
                  style={{
                    padding: '34px 0',
                    borderTop: `1px solid ${C.creamDeep}`,
                    display: 'flex',
                    gap: 28,
                  }}
                >
                  <div style={{ flexShrink: 0, paddingTop: 4 }}>
                    <span
                      style={{
                        display: 'block',
                        fontFamily: SERIF,
                        fontStyle: 'italic',
                        fontSize: 42,
                        color: 'rgba(232,184,75,0.35)',
                        lineHeight: 1,
                        marginBottom: 8,
                      }}
                    >
                      {e.num}
                    </span>
                    {e.icon}
                  </div>
                  <div>
                    <h3
                      style={{
                        fontFamily: SERIF,
                        fontSize: 24,
                        fontWeight: 400,
                        color: C.ink,
                        margin: '0 0 12px',
                      }}
                    >
                      {e.titre}
                    </h3>
                    <p
                      style={{
                        fontFamily: SERIF,
                        fontStyle: 'italic',
                        fontSize: 16,
                        lineHeight: 1.76,
                        color: 'rgba(44,26,14,0.72)',
                        margin: 0,
                      }}
                    >
                      {e.body}
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
          .r282-process-grid{ grid-template-columns: 1fr !important; }
          .r282-process-sticky{ position: static !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   5 · TestimonialsSection — 3 avis clients fidèles
   ════════════════════════════════════════════════════════════════════════════ */
type Avis = {
  quote: string;
  prenom: string;
  quartier: string;
  produit: string;
  note: number;
};

const AVIS: Avis[] = [
  {
    quote:
      'Ça fait dix ans que je commence ma journée ici. Le pain de campagne au levain est le meilleur que j\'ai mangé — une croûte incroyable, une mie qui a du goût. On sent que c\'est fait avec amour et passion.',
    prenom: 'Martine L.',
    quartier: 'Vieux-Bourg · cliente depuis 2014',
    produit: 'Pain de campagne au levain',
    note: 5,
  },
  {
    quote:
      'Les croissants du samedi matin, c\'est un rituel familial immuable. Mes enfants ne veulent plus aller ailleurs. La viennoiserie est d\'une légèreté et d\'un beurre qui font oublier tous les autres.',
    prenom: 'Julien M.',
    quartier: 'Fives · client depuis 2019',
    produit: 'Croissants du week-end',
    note: 5,
  },
  {
    quote:
      'J\'ai commandé une pièce montée pour le mariage de ma fille : un chef-d\'œuvre. Ponctuel, parfaitement emballé, et d\'un goût qui a émerveillé nos 120 invités. Merci pour cette journée inoubliable.',
    prenom: 'Sylvie D.',
    quartier: 'Lambersart · cliente depuis 2020',
    produit: 'Pièce montée mariage',
    note: 5,
  },
];

function AvisCard({ a, i }: { a: Avis; i: number }) {
  return (
    <Reveal delay={i * 0.11} style={{ height: '100%' }}>
      <figure
        style={{
          background: '#fff',
          border: `1px solid ${C.creamDeep}`,
          padding: 'clamp(28px,3.5vw,44px)',
          margin: 0,
          height: '100%',
          boxSizing: 'border-box',
          boxShadow: '0 24px 60px -42px rgba(92,58,30,0.32)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Quote size={30} color={C.wheat} strokeWidth={1.3} />
        <div style={{ display: 'flex', gap: 4, margin: '18px 0 16px' }}>
          {Array.from({ length: a.note }).map((_, s) => (
            <Star key={s} size={14} fill={C.wheat} color={C.wheat} strokeWidth={0} />
          ))}
        </div>
        <blockquote
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 'clamp(17px,1.9vw,21px)',
            lineHeight: 1.64,
            color: C.ink,
            margin: '0 0 24px',
            flex: 1,
          }}
        >
          "{a.quote}"
        </blockquote>
        <figcaption
          style={{
            borderTop: `1px solid ${C.creamDeep}`,
            paddingTop: 18,
          }}
        >
          <div style={{ fontFamily: SERIF, fontSize: 18, color: C.brown, fontWeight: 400 }}>
            {a.prenom}
          </div>
          <div
            style={{
              fontFamily: SANS,
              fontSize: 10.5,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'rgba(44,26,14,0.52)',
              marginTop: 5,
            }}
          >
            {a.quartier}
          </div>
          <div
            style={{
              fontFamily: SANS,
              fontSize: 11.5,
              color: C.brownMid,
              fontWeight: 600,
              marginTop: 10,
              display: 'flex',
              alignItems: 'center',
              gap: 7,
            }}
          >
            <Heart size={12} fill={C.wheat} color={C.wheat} strokeWidth={0} />
            {a.produit}
          </div>
        </figcaption>
      </figure>
    </Reveal>
  );
}

function TestimonialsSection() {
  const sec: React.CSSProperties = {
    background: C.paper,
    padding: 'clamp(90px,12vw,170px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: 'clamp(24px,3vw,44px)',
    maxWidth: 1200,
    margin: '0 auto',
  };
  return (
    <section style={sec} id="avis">
      <div style={{ maxWidth: 1200, margin: '0 auto 58px', textAlign: 'center' }}>
        <Reveal>
          <Eyebrow color={C.brownMid} align="center">
            Ils nous font confiance
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(32px,5vw,64px)',
              fontWeight: 400,
              color: C.ink,
              margin: '20px 0 0',
            }}
          >
            Clients fidèles du{' '}
            <span style={{ fontStyle: 'italic', color: C.red }}>
              Vieux-Bourg
            </span>
          </h2>
        </Reveal>
      </div>
      <div style={grid}>
        {AVIS.map((a, i) => (
          <AvisCard key={a.prenom} a={a} i={i} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   6 · CommandeFormSection — formulaire commande spéciale
   ════════════════════════════════════════════════════════════════════════════ */
type FormState = {
  prenom: string;
  nom: string;
  type: string;
  date: string;
  details: string;
};

function CommandeFormSection() {
  const [form, setForm] = useState<FormState>({
    prenom: '',
    nom: '',
    type: '',
    date: '',
    details: '',
  });
  const [sent, setSent] = useState(false);

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.prenom || !form.nom || !form.type || !form.date) return;
    setSent(true);
  };

  const sec: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    background: C.brownDeep,
    padding: 'clamp(90px,12vw,170px) clamp(24px,6vw,96px)',
  };
  const fieldBase: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    background: 'transparent',
    border: 'none',
    borderBottom: `1px solid rgba(232,184,75,0.40)`,
    padding: '15px 2px',
    fontFamily: SERIF,
    fontSize: 17,
    color: C.cream,
    outline: 'none',
    lineHeight: 1.5,
  };
  const labelStyle: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 10.5,
    letterSpacing: '0.24em',
    textTransform: 'uppercase',
    color: C.wheat,
    display: 'block',
    marginBottom: 4,
    fontWeight: 700,
  };

  return (
    <section style={sec} id="commande">
      <img
        src={PHOTO.pain}
        alt=""
        aria-hidden="true"
        loading="lazy"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.10,
        }}
      />
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: 740,
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <Reveal>
          <Eyebrow color={C.wheatLight} align="center">
            Commande spéciale
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(36px,5.5vw,76px)',
              fontWeight: 400,
              color: C.cream,
              margin: '22px 0 18px',
              lineHeight: 1.05,
            }}
          >
            Votre{' '}
            <span style={{ fontStyle: 'italic', color: C.wheatLight }}>
              commande sur mesure
            </span>
          </h2>
        </Reveal>
        <Reveal delay={0.14}>
          <p
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: 'clamp(16px,1.7vw,20px)',
              lineHeight: 1.72,
              color: 'rgba(253,246,227,0.80)',
              maxWidth: 520,
              margin: '0 auto 52px',
            }}
          >
            Gâteau d&apos;anniversaire, pain spécial, pièce montée, abonnement
            hebdomadaire — contactez-nous au moins 48h à l&apos;avance.
          </p>
        </Reveal>

        {sent ? (
          <Reveal>
            <div
              style={{
                border: `1px solid ${C.wheat}`,
                padding: 'clamp(36px,5vw,56px)',
                background: 'rgba(232,184,75,0.07)',
              }}
            >
              <Award size={38} color={C.wheatLight} strokeWidth={1.2} />
              <h3
                style={{
                  fontFamily: SERIF,
                  fontSize: 32,
                  fontWeight: 400,
                  color: C.cream,
                  margin: '18px 0 12px',
                }}
              >
                Merci {form.prenom}&nbsp;!
              </h3>
              <p
                style={{
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  fontSize: 18,
                  color: 'rgba(253,246,227,0.80)',
                  margin: '0 0 14px',
                  lineHeight: 1.65,
                }}
              >
                Votre demande pour{' '}
                <strong style={{ color: C.wheatLight, fontStyle: 'normal' }}>
                  {form.type}
                </strong>{' '}
                le{' '}
                <strong style={{ color: C.wheatLight, fontStyle: 'normal' }}>
                  {form.date}
                </strong>{' '}
                est bien enregistrée.
              </p>
              <p
                style={{
                  fontFamily: SANS,
                  fontSize: 13,
                  color: 'rgba(253,246,227,0.60)',
                  margin: 0,
                  letterSpacing: '0.08em',
                }}
              >
                Nous vous recontactons dans les 24h pour confirmer. Boulangerie du Beffroi — 03 20 XX XX XX
              </p>
            </div>
          </Reveal>
        ) : (
          <Reveal delay={0.22}>
            <form
              onSubmit={onSubmit}
              style={{ display: 'flex', flexDirection: 'column', gap: 32, textAlign: 'left' }}
            >
              <div
                style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}
                className="r282-form-row"
              >
                <div>
                  <label style={labelStyle} htmlFor="r282-prenom">
                    Prénom
                  </label>
                  <input
                    id="r282-prenom"
                    style={fieldBase}
                    value={form.prenom}
                    onChange={set('prenom')}
                    placeholder="Marie"
                    autoComplete="given-name"
                    required
                  />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="r282-nom">
                    Nom
                  </label>
                  <input
                    id="r282-nom"
                    style={fieldBase}
                    value={form.nom}
                    onChange={set('nom')}
                    placeholder="Dupont"
                    autoComplete="family-name"
                    required
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle} htmlFor="r282-type">
                  Type de commande
                </label>
                <select
                  id="r282-type"
                  style={{
                    ...fieldBase,
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    cursor: 'pointer',
                    color: form.type ? C.cream : 'rgba(253,246,227,0.42)',
                  }}
                  value={form.type}
                  onChange={set('type')}
                  required
                >
                  <option value="" style={{ color: '#1a1a1a' }}>
                    Choisir un type…
                  </option>
                  <option value="Gâteau d'anniversaire" style={{ color: '#1a1a1a' }}>
                    Gâteau d&apos;anniversaire
                  </option>
                  <option value="Pain spécial" style={{ color: '#1a1a1a' }}>
                    Pain spécial
                  </option>
                  <option value="Pièce montée" style={{ color: '#1a1a1a' }}>
                    Pièce montée
                  </option>
                  <option value="Livraison hebdomadaire" style={{ color: '#1a1a1a' }}>
                    Livraison hebdomadaire
                  </option>
                </select>
              </div>

              <div>
                <label style={labelStyle} htmlFor="r282-date">
                  Date souhaitée
                </label>
                <input
                  id="r282-date"
                  style={{
                    ...fieldBase,
                    colorScheme: 'dark',
                  }}
                  type="date"
                  value={form.date}
                  onChange={set('date')}
                  required
                />
              </div>

              <div>
                <label style={labelStyle} htmlFor="r282-details">
                  Détails & précisions
                </label>
                <textarea
                  id="r282-details"
                  style={{
                    ...fieldBase,
                    borderBottom: 'none',
                    border: `1px solid rgba(232,184,75,0.32)`,
                    padding: '14px 16px',
                    resize: 'vertical',
                    minHeight: 110,
                    background: 'rgba(232,184,75,0.04)',
                  }}
                  value={form.details}
                  onChange={set('details')}
                  placeholder="Nombre de personnes, parfum, inscription, allergies éventuelles…"
                  rows={4}
                />
              </div>

              <div style={{ textAlign: 'center', marginTop: 8 }}>
                <BreadButton filled type="submit">
                  Envoyer ma commande
                </BreadButton>
              </div>
            </form>
          </Reveal>
        )}
      </div>
      <style>{`
        @media (max-width: 860px){
          .r282-form-row{ grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   7 · MenuSection — Pains / Viennoiseries / Pâtisseries avec prix
   ════════════════════════════════════════════════════════════════════════════ */
type MenuItem = { nom: string; detail: string; prix: string };
type MenuCat = { titre: string; items: MenuItem[] };

const MENU_CATEGORIES: MenuCat[] = [
  {
    titre: 'Pains',
    items: [
      { nom: 'Pain de campagne', detail: 'Levain naturel, farine T65 locale', prix: '4,20 €' },
      { nom: 'Miche au seigle', detail: 'Seigle 30%, longue fermentation', prix: '4,80 €' },
      { nom: 'Pain à l\'épeautre', detail: 'Épeautre complet, graines de lin', prix: '5,10 €' },
      { nom: 'Pain au sarrasin', detail: 'Sarrasin 20%, sans gluten partiel', prix: '4,90 €' },
      { nom: 'Baguette tradition', detail: 'Label Tradition Française', prix: '1,30 €' },
      { nom: 'Fougasse aux olives', detail: 'Olives noires, thym du Midi', prix: '3,50 €' },
    ],
  },
  {
    titre: 'Viennoiseries',
    items: [
      { nom: 'Croissant pur beurre', detail: 'Beurre AOP Charentes-Poitou', prix: '1,60 €' },
      { nom: 'Pain au chocolat', detail: 'Deux barres de chocolat noir Valrhona', prix: '1,80 €' },
      { nom: 'Kouign-amann', detail: 'Beurre salé breton, caramel', prix: '2,40 €' },
      { nom: 'Pain aux raisins', detail: 'Crème pâtissière vanille, raisins Corinthes', prix: '2,00 €' },
      { nom: 'Chausson aux pommes', detail: 'Pommes Reinette, cannelle légère', prix: '2,20 €' },
    ],
  },
  {
    titre: 'Pâtisseries',
    items: [
      { nom: 'Tarte au citron meringuée', detail: 'Curd citron jaune, meringue italienne', prix: '4,50 €' },
      { nom: 'Fraisier de saison', detail: 'Fraises de Plougastel, crème mousseline', prix: '5,20 €' },
      { nom: 'Millefeuille maison', detail: 'Feuilletage caramélisé, crème vanille', prix: '4,80 €' },
      { nom: 'Opéra', detail: 'Biscuit joconde, ganache café, buttercream', prix: '5,00 €' },
    ],
  },
];

function MenuCatBlock({ cat, i }: { cat: MenuCat; i: number }) {
  return (
    <Reveal delay={i * 0.10}>
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginBottom: 28,
          }}
        >
          <span
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: 36,
              color: 'rgba(232,184,75,0.35)',
              lineHeight: 1,
            }}
          >
            0{i + 1}
          </span>
          <h3
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(24px,3vw,36px)',
              fontWeight: 400,
              color: C.ink,
              margin: 0,
            }}
          >
            {cat.titre}
          </h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {cat.items.map((item, j) => (
            <MenuItemRow key={item.nom} item={item} j={j} total={cat.items.length} />
          ))}
        </div>
      </div>
    </Reveal>
  );
}

function MenuItemRow({ item, j, total }: { item: MenuItem; j: number; total: number }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        padding: '16px 0',
        borderTop: `1px solid ${C.creamDeep}`,
        borderBottom: j === total - 1 ? `1px solid ${C.creamDeep}` : 'none',
        gap: 16,
        background: hover ? 'rgba(232,184,75,0.04)' : 'transparent',
        transition: 'background .3s',
        cursor: 'default',
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontFamily: SERIF,
            fontSize: 18,
            color: C.ink,
            fontWeight: 400,
            marginBottom: 4,
          }}
        >
          {item.nom}
        </div>
        <div
          style={{
            fontFamily: SANS,
            fontSize: 12,
            color: 'rgba(44,26,14,0.56)',
            letterSpacing: '0.06em',
          }}
        >
          {item.detail}
        </div>
      </div>
      <div
        style={{
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontSize: 20,
          color: C.brownMid,
          flexShrink: 0,
          fontWeight: 400,
        }}
      >
        {item.prix}
      </div>
    </div>
  );
}

function MenuSection() {
  const sec: React.CSSProperties = {
    background: C.cream,
    padding: 'clamp(90px,12vw,170px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: 'clamp(48px,6vw,80px)',
    maxWidth: 1240,
    margin: '0 auto',
  };
  return (
    <section style={sec} id="menu">
      <div style={{ maxWidth: 1240, margin: '0 auto 64px' }}>
        <Reveal>
          <Eyebrow color={C.brownMid}>La carte</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(34px,5.2vw,68px)',
              fontWeight: 400,
              color: C.ink,
              margin: '20px 0 0',
              lineHeight: 1.06,
            }}
          >
            Nos créations du{' '}
            <span style={{ fontStyle: 'italic', color: C.red }}>
              four
            </span>
          </h2>
        </Reveal>
        <Reveal delay={0.14}>
          <p
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: 'clamp(15px,1.6vw,18px)',
              color: 'rgba(44,26,14,0.65)',
              maxWidth: 520,
              lineHeight: 1.7,
              marginTop: 18,
            }}
          >
            Tarifs en vigueur. Disponibilités variables selon la production du jour — arrivez tôt pour les pièces rares.
          </p>
        </Reveal>
      </div>
      <div style={grid}>
        {MENU_CATEGORIES.map((cat, i) => (
          <MenuCatBlock key={cat.titre} cat={cat} i={i} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   8 · AgriculteurSection — 3 producteurs partenaires locaux
   ════════════════════════════════════════════════════════════════════════════ */
type Producteur = {
  nom: string;
  region: string;
  produit: string;
  description: string;
  icon: React.ReactNode;
  depuis: string;
};

const PRODUCTEURS: Producteur[] = [
  {
    nom: 'Ferme Dupuis',
    region: 'Hauts-de-France · Douai',
    produit: 'Farine de blé & seigle',
    description:
      'La famille Dupuis cultive 320 hectares de blé panifiable en agriculture raisonnée depuis trois générations. Leur moulin à meule de pierre préserve intégralement les minéraux et le goût du grain.',
    icon: <Wheat size={30} strokeWidth={1.4} color={C.wheat} />,
    depuis: 'Partenaire depuis 2003',
  },
  {
    nom: 'Laiterie des Flandres',
    region: 'Flandres Intérieures · Cassel',
    produit: 'Beurre AOP & crème fraîche',
    description:
      'Ce groupement de 12 éleveurs produit un beurre extra-fin issu de vaches Holstein nourries à l\'herbe. Leur beurre de tourage, avec 84% de matière grasse, est la clé de nos feuilletages.',
    icon: <Heart size={30} strokeWidth={1.4} color={C.wheat} />,
    depuis: 'Partenaire depuis 2009',
  },
  {
    nom: 'Maraîchage Lecomte',
    region: 'Plaine de la Scarpe · Arras',
    produit: 'Fruits de saison & aromates',
    description:
      'Antoine Lecomte cultive en plein air fraises, framboises, poires et pommes avec zéro pesticide de synthèse. Ses récoltes dictent notre carte pâtissière de mars à novembre.',
    icon: <Leaf size={30} strokeWidth={1.4} color={C.wheat} />,
    depuis: 'Partenaire depuis 2015',
  },
];

function ProducteurCard({ p, i }: { p: Producteur; i: number }) {
  return (
    <Reveal delay={i * 0.11}>
      <div
        style={{
          border: `1px solid ${C.creamDeep}`,
          padding: 'clamp(28px,3.5vw,44px)',
          background: '#fff',
          boxShadow: '0 16px 48px -32px rgba(92,58,30,0.18)',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          height: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 10,
                letterSpacing: '0.30em',
                textTransform: 'uppercase',
                color: C.brownMid,
                fontWeight: 700,
                marginBottom: 6,
                display: 'flex',
                alignItems: 'center',
                gap: 7,
              }}
            >
              <MapPin size={12} strokeWidth={1.8} color={C.brownMid} />
              {p.region}
            </div>
            <h3
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(22px,2.6vw,28px)',
                fontWeight: 400,
                color: C.ink,
                margin: 0,
              }}
            >
              {p.nom}
            </h3>
          </div>
          {p.icon}
        </div>
        <div
          style={{
            fontFamily: SANS,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: C.red,
            paddingBottom: 14,
            borderBottom: `1px solid ${C.creamDeep}`,
          }}
        >
          {p.produit}
        </div>
        <p
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 16,
            lineHeight: 1.72,
            color: 'rgba(44,26,14,0.72)',
            margin: 0,
            flex: 1,
          }}
        >
          {p.description}
        </p>
        <div
          style={{
            fontFamily: SANS,
            fontSize: 11,
            letterSpacing: '0.14em',
            color: 'rgba(44,26,14,0.46)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Award size={12} strokeWidth={1.8} color={C.wheat} />
          {p.depuis}
        </div>
      </div>
    </Reveal>
  );
}

function AgriculteurSection() {
  const sec: React.CSSProperties = {
    background: C.brownDeep,
    padding: 'clamp(90px,12vw,170px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: 'clamp(20px,2.5vw,36px)',
    maxWidth: 1240,
    margin: '0 auto',
  };
  return (
    <section style={sec} id="agriculteurs">
      <div style={{ maxWidth: 1240, margin: '0 auto 60px' }}>
        <Reveal>
          <Eyebrow>Nos partenaires</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(34px,5.2vw,68px)',
              fontWeight: 400,
              color: C.cream,
              margin: '20px 0 0',
              lineHeight: 1.06,
            }}
          >
            Agriculteurs du{' '}
            <span style={{ fontStyle: 'italic', color: C.wheatLight }}>
              Nord
            </span>
          </h2>
        </Reveal>
        <Reveal delay={0.14}>
          <p
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: 'clamp(15px,1.6vw,19px)',
              color: 'rgba(253,246,227,0.70)',
              maxWidth: 580,
              lineHeight: 1.72,
              marginTop: 20,
            }}
          >
            Nos meilleurs ingrédients sont signés par des noms, des familles,
            des terres. Voici ceux qui rendent notre pain possible.
          </p>
        </Reveal>
      </div>
      <div style={grid}>
        {PRODUCTEURS.map((p, i) => (
          <ProducteurCard key={p.nom} p={p} i={i} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   9 · HorairesSection — horaires, fermeture lundi, livraison, abonnement
   ════════════════════════════════════════════════════════════════════════════ */
type JourHoraire = { jour: string; heures: string; ferme?: boolean };

const HORAIRES: JourHoraire[] = [
  { jour: 'Lundi', heures: 'Fermé', ferme: true },
  { jour: 'Mardi', heures: '7h00 – 19h30' },
  { jour: 'Mercredi', heures: '7h00 – 19h30' },
  { jour: 'Jeudi', heures: '7h00 – 19h30' },
  { jour: 'Vendredi', heures: '7h00 – 20h00' },
  { jour: 'Samedi', heures: '7h00 – 20h00' },
  { jour: 'Dimanche', heures: '7h30 – 13h00' },
];

function HorairesSection() {
  const sec: React.CSSProperties = {
    background: C.cream,
    padding: 'clamp(80px,11vw,160px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 'clamp(40px,6vw,90px)',
    maxWidth: 1160,
    margin: '0 auto',
    alignItems: 'start',
  };

  return (
    <section style={sec} id="horaires">
      <div style={grid} className="r282-horaires-grid">
        {/* Horaires */}
        <div>
          <Reveal>
            <Eyebrow color={C.brownMid}>Ouverture</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(30px,4.4vw,56px)',
                fontWeight: 400,
                color: C.ink,
                margin: '20px 0 36px',
                lineHeight: 1.08,
              }}
            >
              Quand nous{' '}
              <span style={{ fontStyle: 'italic', color: C.red }}>
                trouver
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <div>
              {HORAIRES.map((h, i) => (
                <div
                  key={h.jour}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '15px 0',
                    borderTop: `1px solid ${C.creamDeep}`,
                    borderBottom: i === HORAIRES.length - 1 ? `1px solid ${C.creamDeep}` : 'none',
                  }}
                >
                  <span
                    style={{
                      fontFamily: SERIF,
                      fontSize: 18,
                      color: h.ferme ? 'rgba(44,26,14,0.38)' : C.ink,
                    }}
                  >
                    {h.jour}
                  </span>
                  <span
                    style={{
                      fontFamily: h.ferme ? SANS : SERIF,
                      fontStyle: h.ferme ? 'normal' : 'italic',
                      fontSize: h.ferme ? 12 : 17,
                      letterSpacing: h.ferme ? '0.22em' : 0,
                      textTransform: h.ferme ? 'uppercase' : 'none',
                      color: h.ferme ? 'rgba(192,57,43,0.65)' : C.brownMid,
                      fontWeight: h.ferme ? 700 : 400,
                    }}
                  >
                    {h.heures}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.20}>
            <div
              style={{
                marginTop: 24,
                padding: '16px 20px',
                background: 'rgba(92,58,30,0.07)',
                border: `1px solid ${C.creamDeep}`,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
              }}
            >
              <Clock size={18} strokeWidth={1.6} color={C.brownMid} style={{ flexShrink: 0, marginTop: 2 }} />
              <p
                style={{
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  fontSize: 14.5,
                  color: 'rgba(44,26,14,0.65)',
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                Le pain sort du four entre 6h et 7h30. Arrivez tôt pour les
                pièces du jour — viennoiseries et pains spéciaux partent vite
                le week-end.
              </p>
            </div>
          </Reveal>
        </div>

        {/* Livraison + abonnement */}
        <div>
          <Reveal>
            <Eyebrow color={C.brownMid}>Livraison & abonnement</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(30px,4.4vw,56px)',
                fontWeight: 400,
                color: C.ink,
                margin: '20px 0 36px',
                lineHeight: 1.08,
              }}
            >
              Le pain chez{' '}
              <span style={{ fontStyle: 'italic', color: C.red }}>
                vous
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div
                style={{
                  padding: 'clamp(22px,3vw,32px)',
                  border: `1px solid ${C.creamDeep}`,
                  background: '#fff',
                  boxShadow: '0 8px 32px -20px rgba(92,58,30,0.15)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    marginBottom: 14,
                  }}
                >
                  <Truck size={22} strokeWidth={1.5} color={C.red} />
                  <span
                    style={{
                      fontFamily: SANS,
                      fontSize: 11,
                      letterSpacing: '0.26em',
                      textTransform: 'uppercase',
                      color: C.red,
                      fontWeight: 700,
                    }}
                  >
                    Livraison quartier
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: SERIF,
                    fontStyle: 'italic',
                    fontSize: 15.5,
                    lineHeight: 1.7,
                    color: 'rgba(44,26,14,0.7)',
                    margin: 0,
                  }}
                >
                  Livraison à domicile dans le Vieux-Bourg, Fives et
                  Saint-Maurice. Commande avant 19h pour le lendemain matin
                  8h. Frais de livraison : 1,50 € — offerts dès 15 € d&apos;achat.
                </p>
              </div>

              <div
                style={{
                  padding: 'clamp(22px,3vw,32px)',
                  border: `1px solid ${C.wheat}`,
                  background: 'rgba(232,184,75,0.05)',
                  boxShadow: '0 8px 32px -20px rgba(92,58,30,0.15)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    marginBottom: 14,
                  }}
                >
                  <Calendar size={22} strokeWidth={1.5} color={C.brownMid} />
                  <span
                    style={{
                      fontFamily: SANS,
                      fontSize: 11,
                      letterSpacing: '0.26em',
                      textTransform: 'uppercase',
                      color: C.brownMid,
                      fontWeight: 700,
                    }}
                  >
                    Abonnement pain hebdo
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: SERIF,
                    fontStyle: 'italic',
                    fontSize: 15.5,
                    lineHeight: 1.7,
                    color: 'rgba(44,26,14,0.7)',
                    margin: '0 0 18px',
                  }}
                >
                  Recevez votre pain chaque semaine — choisissez votre jour et
                  votre type. Engagement mensuel sans frais de livraison.
                  Tarif préférentiel : 10% de réduction sur tous vos pains.
                </p>
                <a
                  href="#commande"
                  style={{
                    fontFamily: SANS,
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: C.brownMid,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  S&apos;abonner
                  <ArrowRight size={14} />
                </a>
              </div>

              <div
                style={{
                  padding: 'clamp(18px,2.5vw,26px)',
                  background: 'rgba(192,57,43,0.06)',
                  border: `1px solid rgba(192,57,43,0.22)`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                }}
              >
                <Phone size={18} strokeWidth={1.6} color={C.red} style={{ flexShrink: 0 }} />
                <div>
                  <div
                    style={{
                      fontFamily: SANS,
                      fontSize: 11,
                      letterSpacing: '0.20em',
                      textTransform: 'uppercase',
                      color: C.red,
                      fontWeight: 700,
                      marginBottom: 4,
                    }}
                  >
                    Réservation téléphonique
                  </div>
                  <div
                    style={{
                      fontFamily: SERIF,
                      fontSize: 19,
                      color: C.ink,
                    }}
                  >
                    03 20 XX XX XX
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
      <style>{`
        @media (max-width: 860px){
          .r282-horaires-grid{ grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   10 · FooterSection — logo, adresse Vieux-Bourg, MOF
   ════════════════════════════════════════════════════════════════════════════ */
function FooterSection() {
  const cols: { title: string; items: { label: string; href: string }[] }[] = [
    {
      title: 'La boutique',
      items: [
        { label: 'Notre histoire', href: '#specialites' },
        { label: 'Le processus', href: '#processus' },
        { label: 'Nos agriculteurs', href: '#agriculteurs' },
        { label: 'Horaires & accès', href: '#horaires' },
      ],
    },
    {
      title: 'Nos produits',
      items: [
        { label: 'Pains', href: '#menu' },
        { label: 'Viennoiseries', href: '#menu' },
        { label: 'Pâtisseries', href: '#menu' },
        { label: 'Commandes spéciales', href: '#commande' },
      ],
    },
    {
      title: 'Commander',
      items: [
        { label: 'Commande en ligne', href: '#commande' },
        { label: 'Livraison quartier', href: '#horaires' },
        { label: 'Abonnement pain', href: '#horaires' },
        { label: 'Contact & devis', href: '#commande' },
      ],
    },
  ];

  const foot: React.CSSProperties = {
    background: C.brownMid,
    borderTop: `1px solid rgba(232,184,75,0.22)`,
    padding: 'clamp(64px,8vw,100px) clamp(24px,6vw,96px) 40px',
  };

  return (
    <footer style={foot} id="contact">
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.5fr repeat(3, 1fr)',
          gap: 'clamp(32px,4.5vw,64px)',
        }}
        className="r282-footgrid"
      >
        {/* Brand block */}
        <div>
          {/* Logo texte */}
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(18px,2vw,24px)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: C.cream,
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              lineHeight: 1.2,
            }}
          >
            <Wheat size={26} color={C.wheat} strokeWidth={1.4} />
            <span>
              Boulangerie<br />
              <span style={{ color: C.wheatLight, letterSpacing: '0.14em' }}>du Beffroi</span>
            </span>
          </div>

          {/* Adresse */}
          <div
            style={{
              fontFamily: SANS,
              fontSize: 13,
              color: 'rgba(253,246,227,0.68)',
              marginTop: 22,
              lineHeight: 1.75,
              letterSpacing: '0.04em',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <MapPin size={14} color={C.wheat} strokeWidth={1.5} style={{ marginTop: 3, flexShrink: 0 }} />
              <span>
                12 rue du Grand-Beffroi<br />
                Vieux-Bourg · 59000 Lille
              </span>
            </div>
          </div>

          {/* Contact */}
          <div
            style={{
              marginTop: 18,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <div
              style={{
                fontFamily: SANS,
                fontSize: 13,
                color: 'rgba(253,246,227,0.68)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Phone size={13} color={C.wheat} strokeWidth={1.5} />
              03 20 XX XX XX
            </div>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 13,
                color: 'rgba(253,246,227,0.68)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Mail size={13} color={C.wheat} strokeWidth={1.5} />
              contact@beffroi-boulangerie.fr
            </div>
          </div>

          {/* Badge MOF */}
          <div
            style={{
              marginTop: 26,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 16px',
              border: `1px solid rgba(232,184,75,0.45)`,
              background: 'rgba(232,184,75,0.08)',
            }}
          >
            <Award size={18} color={C.wheat} strokeWidth={1.4} />
            <div>
              <div
                style={{
                  fontFamily: SANS,
                  fontSize: 9,
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase',
                  color: C.wheat,
                  fontWeight: 700,
                  lineHeight: 1,
                  marginBottom: 3,
                }}
              >
                Meilleur Ouvrier de France
              </div>
              <div
                style={{
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  fontSize: 13,
                  color: 'rgba(253,246,227,0.80)',
                }}
              >
                Marc Dubois · Promotion 2000
              </div>
            </div>
          </div>
        </div>

        {/* Colonnes liens */}
        {cols.map((c) => (
          <div key={c.title}>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 10.5,
                letterSpacing: '0.26em',
                textTransform: 'uppercase',
                color: C.wheat,
                marginBottom: 20,
                fontWeight: 700,
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
                      fontFamily: SERIF,
                      fontSize: 16,
                      color: 'rgba(253,246,227,0.72)',
                      textDecoration: 'none',
                      transition: 'color .3s',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color = C.wheatLight;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(253,246,227,0.72)';
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

      {/* Pied de pied */}
      <div
        style={{
          maxWidth: 1240,
          margin: '56px auto 0',
          paddingTop: 26,
          borderTop: `1px solid rgba(232,184,75,0.16)`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
          fontFamily: SANS,
          fontSize: 11,
          letterSpacing: '0.10em',
          color: 'rgba(253,246,227,0.45)',
        }}
      >
        <span>
          © 1978–2026 Boulangerie du Beffroi · SARL Dubois &amp; Fils · Siret 000 000 000 00000
        </span>
        <span style={{ display: 'flex', gap: 24 }}>
          <a href="#hero" style={{ color: 'inherit', textDecoration: 'none' }}>
            Mentions légales
          </a>
          <a href="#hero" style={{ color: 'inherit', textDecoration: 'none' }}>
            Confidentialité
          </a>
          <a href="#hero" style={{ color: 'inherit', textDecoration: 'none' }}>
            CGV
          </a>
        </span>
      </div>
      <style>{`
        @media (max-width: 860px){
          .r282-footgrid{ grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 520px){
          .r282-footgrid{ grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   PAGE — Impact282Page
   ════════════════════════════════════════════════════════════════════════════ */
export default function Impact282Page() {
  const root: React.CSSProperties = {
    background: C.brownDeep,
    color: C.cream,
    fontFamily: SERIF,
    overflowX: 'hidden',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
  };
  return (
    <main id="hero" style={root} suppressHydrationWarning>
      <Nav />
      <HeroSection />
      <ScrollCrossfade />
      <SpecialitesSection />
      <ProcessSection />
      <TestimonialsSection />
      <CommandeFormSection />
      <MenuSection />
      <AgriculteurSection />
      <HorairesSection />
      <FooterSection />
    </main>
  );
}
