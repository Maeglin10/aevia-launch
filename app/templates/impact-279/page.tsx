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
  Activity,
  Baby,
  Zap,
  ArrowRight,
  ChevronDown,
  Star,
  Quote,
  MapPin,
  Phone,
  Clock,
  CreditCard,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';

/* ════════════════════════════════════════════════════════════════════════════
   CABINET SOLER — Ostéopathe D.O., Lyon 6e · Brotteaux
   Template premium holistique. Palette forêt × beige lin × terracotta.
   Auto-suffisant. 'use client'. Calqué sur le style éditorial impact-218.
   ════════════════════════════════════════════════════════════════════════════ */

/* ── Palette ─────────────────────────────────────────────────────────────── */
const C = {
  forest: '#2a4a35',
  forestDeep: '#1c3326',
  forestMid: '#3d6b4a',
  forestLight: '#4e8a60',
  linen: '#f5efe6',
  linenDeep: '#ede4d7',
  linenDarker: '#dfd4c5',
  terra: '#c4785a',
  terraLight: '#d4906f',
  terraDark: '#a85e3f',
  white: '#ffffff',
  ink: '#1e2d25',
  muted: 'rgba(42,74,53,0.6)',
} as const;

/* ── Typographies ────────────────────────────────────────────────────────── */
const SERIF = "'Cormorant Garamond', Georgia, serif" as const;
const SANS = "'Mulish', system-ui, sans-serif" as const;

/* ── Easing partagé ──────────────────────────────────────────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ── Photos Unsplash (IDs réels santé / bien-être) ───────────────────────── */
const PHOTO = {
  therapy:
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1600&auto=format&fit=crop',
  clinic:
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1600&auto=format&fit=crop',
  consultation:
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=1600&auto=format&fit=crop',
  zen:
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1600&auto=format&fit=crop',
  hero:
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2000&auto=format&fit=crop',
} as const;

/* ════════════════════════════════════════════════════════════════════════════
   Primitives partagées
   ════════════════════════════════════════════════════════════════════════════ */

/** Étiquette fine, capitales, interlettrage large, filet terracotta. */
function Eyebrow({
  children,
  color = C.terra,
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
  const label: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 11,
    letterSpacing: '0.40em',
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

/** Bouton principal — forêt rempli ou contour lin. */
function ForestButton({
  children,
  onClick,
  filled = false,
  type = 'button',
  href,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  filled?: boolean;
  type?: 'button' | 'submit';
  href?: string;
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
    fontWeight: 600,
    cursor: 'pointer',
    border: `1.5px solid ${filled ? C.forest : C.terra}`,
    background: filled ? C.forest : 'transparent',
    color: filled ? C.white : C.terra,
    transition: 'all .5s cubic-bezier(.16,1,.3,1)',
    textDecoration: 'none',
    outline: 'none',
  };
  const hov: React.CSSProperties = hover
    ? filled
      ? { background: C.forestMid, transform: 'translateY(-2px)', boxShadow: '0 16px 40px -16px rgba(42,74,53,0.5)' }
      : { background: 'rgba(196,120,90,0.10)', transform: 'translateY(-2px)' }
    : {};

  const inner = (
    <>
      {children}
      <ArrowRight
        size={15}
        style={{
          transform: hover ? 'translateX(5px)' : 'none',
          transition: 'transform .5s cubic-bezier(.16,1,.3,1)',
        }}
      />
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{ ...base, ...hov }}
      >
        {inner}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ ...base, ...hov }}
    >
      {inner}
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
    { label: 'Indications', href: '#indications' },
    { label: 'Techniques', href: '#techniques' },
    { label: 'Cabinet', href: '#cabinet' },
    { label: 'Praticien', href: '#praticien' },
    { label: 'Contact', href: '#rdv' },
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
    background: solid ? 'rgba(28,51,38,0.94)' : 'transparent',
    backdropFilter: solid ? 'blur(14px) saturate(120%)' : 'none',
    WebkitBackdropFilter: solid ? 'blur(14px) saturate(120%)' : 'none',
    borderBottom: solid
      ? '1px solid rgba(196,120,90,0.22)'
      : '1px solid transparent',
    transition: 'all .6s cubic-bezier(.16,1,.3,1)',
  };
  const brand: React.CSSProperties = {
    fontFamily: SERIF,
    fontSize: 21,
    letterSpacing: '0.24em',
    color: C.linen,
    textTransform: 'uppercase',
    fontWeight: 400,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  };
  const dot: React.CSSProperties = {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: C.terra,
    flexShrink: 0,
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
        <span style={dot} />
        Cabinet&nbsp;Soler
      </div>
      <div style={linkRow} className="r279-navlinks">
        {links.map((l) => (
          <NavLink key={l.label} label={l.label} href={l.href} />
        ))}
      </div>
      <div className="r279-navcta">
        <ForestButton filled href="#rdv">
          Prendre RDV
        </ForestButton>
      </div>
      
        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="r279-burger"
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
          .r279-navlinks { display: none !important; }
          .r279-burger { display: flex !important; flex-direction: column; }
          .r279-navcta { display: none !important; }
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
        color: h ? C.terra : C.linen,
        textDecoration: 'none',
        transition: 'color .4s',
        position: 'relative',
        paddingBottom: 4,
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
          background: C.terra,
          transition: 'width .5s cubic-bezier(.16,1,.3,1)',
        }}
      />
    </a>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   1 · HERO — épuré, photo cabinet zen en fond
   ════════════════════════════════════════════════════════════════════════════ */
function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.10]);
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);
  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '-44%']);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.68], [1, 0]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.20], [1, 0]);

  const section: React.CSSProperties = {
    position: 'relative',
    height: '100vh',
    minHeight: 640,
    overflow: 'hidden',
    background: C.forestDeep,
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
          src={PHOTO.hero}
          alt="Cabinet d'ostéopathie Soler à Lyon — espace zen et lumineux"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </motion.div>

      {/* Voile dégradé forêt */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(28,51,38,0.52) 0%, rgba(28,51,38,0.12) 38%, rgba(28,51,38,0.50) 70%, rgba(28,51,38,0.92) 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(120% 80% at 50% 30%, transparent 40%, rgba(42,74,53,0.40) 100%)',
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
          padding: '0 clamp(24px, 5vw, 80px)',
          y: titleY,
          opacity: titleOpacity,
        }}
      >
        <Reveal y={20}>
          <Eyebrow color={C.terraLight} align="center">
            Ostéopathe D.O. · Lyon 6e · Brotteaux
          </Eyebrow>
        </Reveal>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.15 }}
          style={{
            fontFamily: SERIF,
            fontWeight: 400,
            color: C.linen,
            fontSize: 'clamp(48px, 8.5vw, 130px)',
            lineHeight: 0.97,
            letterSpacing: '-0.01em',
            margin: '28px 0 24px',
            textShadow: '0 12px 60px rgba(0,0,0,0.45)',
            maxWidth: 1000,
          }}
        >
          Le mouvement libre,{' '}
          <span style={{ fontStyle: 'italic', color: C.terraLight }}>
            la santé retrouvée
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
            color: 'rgba(245,239,230,0.88)',
            maxWidth: 580,
            lineHeight: 1.65,
          }}
        >
          Une approche holistique du corps — écouter, comprendre et accompagner
          chaque patient vers une santé durable et un mouvement retrouvé.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.72 }}
          style={{ marginTop: 44, display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <ForestButton filled href="#rdv">
            Prendre rendez-vous
          </ForestButton>
          <ForestButton href="#indications">
            Découvrir
          </ForestButton>
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
            color: 'rgba(245,239,230,0.7)',
            fontWeight: 500,
          }}
        >
          Découvrir
        </span>
        <motion.div
          animate={{ y: [0, 9, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={20} color={C.terraLight} strokeWidth={1.3} />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   2 · ScrollCrossfade — 320vh sticky, 3 visuels, ProgressDots
   ════════════════════════════════════════════════════════════════════════════ */
type CrossfadeSlide = {
  src: string;
  alt: string;
  index: string;
  caption: string;
  sub: string;
};

const SLIDES: CrossfadeSlide[] = [
  {
    src: PHOTO.therapy,
    alt: 'Manipulation ostéopathique du dos par le Dr Soler',
    index: 'I',
    caption: 'Le corps',
    sub: 'Manipulation structurelle douce — libérer les tensions profondes.',
  },
  {
    src: PHOTO.clinic,
    alt: 'Colonne vertébrale et anatomie ostéopathique',
    index: 'II',
    caption: "L'équilibre",
    sub: 'Chaque vertèbre, chaque fascia — une chaîne à harmoniser.',
  },
  {
    src: PHOTO.zen,
    alt: 'Espace zen du cabinet ostéopathique à Lyon',
    index: 'III',
    caption: 'La sérénité',
    sub: 'Un cabinet conçu pour le calme et la restauration intérieure.',
  },
];

function CrossfadeImage({
  slide,
  i,
  total,
  progress,
}: {
  slide: CrossfadeSlide;
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
  const scale = useTransform(progress, [start - fadeIn, end], [1.12, 1.0]);

  return (
    <motion.div style={{ position: 'absolute', inset: 0, opacity }}>
      <motion.img
        src={slide.src}
        alt={slide.alt}
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
  slide,
  i,
  total,
  progress,
}: {
  slide: CrossfadeSlide;
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
          fontSize: 'clamp(38px, 8vw, 110px)',
          color: 'rgba(196,120,90,0.30)',
          lineHeight: 1,
          marginBottom: 6,
        }}
      >
        {slide.index}
      </span>
      <h2
        style={{
          fontFamily: SERIF,
          fontSize: 'clamp(38px, 6.5vw, 90px)',
          fontWeight: 400,
          color: C.linen,
          lineHeight: 1,
          margin: 0,
          textShadow: '0 8px 40px rgba(0,0,0,0.5)',
        }}
      >
        {slide.caption}
      </h2>
      <p
        style={{
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontSize: 'clamp(15px, 1.7vw, 20px)',
          color: 'rgba(245,239,230,0.84)',
          marginTop: 18,
          maxWidth: 460,
        }}
      >
        {slide.sub}
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
    <motion.div style={{ height: 2, width, background: C.terra, opacity }} />
  );
}

function ScrollCrossfade() {
  const n = SLIDES.length;
  const progress = useMotionValue(0.5 / n);
  const [active, setActive] = useState(0);
  const goTo = (i: number) => {
    setActive(i);
    progress.set((i + 0.5) / n);
  };

  return (
    <section
      style={{ height: '100vh', overflow: 'hidden', position: 'relative', background: C.forestDeep }}
    >
      <div
        style={{
          position: 'relative',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {SLIDES.map((s, i) => (
          <CrossfadeImage
            key={s.caption}
            slide={s}
            i={i}
            total={SLIDES.length}
            progress={progress}
          />
        ))}
        {/* Voile lisibilité */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to bottom, rgba(28,51,38,0.28), rgba(28,51,38,0.08) 45%, rgba(28,51,38,0.60))',
          }}
        />
        {SLIDES.map((s, i) => (
          <CrossfadeCaption
            key={s.caption}
            slide={s}
            i={i}
            total={SLIDES.length}
            progress={progress}
          />
        ))}

        {/* ProgressDots */}
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
          {SLIDES.map((s, i) => (
            <ProgressDot
              key={s.index}
              i={i}
              total={SLIDES.length}
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
   3 · IndicationsSection — 3 spécialités
   ════════════════════════════════════════════════════════════════════════════ */
type Indication = {
  icon: React.ReactNode;
  title: string;
  description: string;
  details: string[];
};

const INDICATIONS: Indication[] = [
  {
    icon: <Activity size={32} color={C.terra} strokeWidth={1.4} />,
    title: 'Douleurs chroniques',
    description:
      'Lombalgies persistantes, cervicalgies, migraines, sciatiques — le Dr Soler traite les douleurs récurrentes en identifiant leur origine mécanique profonde.',
    details: ['Lombalgies & sciatiques', 'Cervicalgies & migraines', 'Douleurs post-opératoires', 'Fibromyalgie'],
  },
  {
    icon: <Baby size={32} color={C.terra} strokeWidth={1.4} />,
    title: 'Nourrissons & pédiatrie',
    description:
      'Spécialisation pédiatrique — coliques, plagiocéphalie, troubles du sommeil, difficultés d\'allaitement. Techniques crânio-sacrées douces adaptées dès la naissance.',
    details: ['Coliques & pleurs', 'Plagiocéphalie', 'Troubles du sommeil', 'Suivi post-natal'],
  },
  {
    icon: <Zap size={32} color={C.terra} strokeWidth={1.4} />,
    title: 'Sportifs & performance',
    description:
      'Prévention des blessures, récupération optimisée, performance améliorée. Suivi régulier pour les sportifs amateurs et de compétition de la région lyonnaise.',
    details: ['Entorses & contractures', 'Récupération sportive', 'Prévention des blessures', 'Préparation compétition'],
  },
];

function IndicationCard({ ind, i }: { ind: Indication; i: number }) {
  const [hover, setHover] = useState(false);
  const card: React.CSSProperties = {
    background: hover ? C.white : C.linen,
    border: `1.5px solid ${hover ? C.terra : C.linenDarker}`,
    padding: 'clamp(32px,4vw,48px)',
    transition: 'all .55s cubic-bezier(.16,1,.3,1)',
    transform: hover ? 'translateY(-10px)' : 'none',
    boxShadow: hover
      ? '0 32px 64px -24px rgba(42,74,53,0.22)'
      : '0 8px 28px -20px rgba(42,74,53,0.14)',
    cursor: 'default',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    boxSizing: 'border-box',
  };

  return (
    <Reveal delay={i * 0.12} style={{ height: '100%' }}>
      <article
        style={card}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: hover ? 'rgba(196,120,90,0.12)' : 'rgba(196,120,90,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 28,
            transition: 'background .5s',
          }}
        >
          {ind.icon}
        </div>
        <h3
          style={{
            fontFamily: SERIF,
            fontSize: 'clamp(24px, 2.6vw, 32px)',
            fontWeight: 400,
            color: C.forest,
            margin: '0 0 16px',
            lineHeight: 1.15,
          }}
        >
          {ind.title}
        </h3>
        <p
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 16.5,
            lineHeight: 1.72,
            color: 'rgba(30,45,37,0.76)',
            margin: '0 0 26px',
            flex: 1,
          }}
        >
          {ind.description}
        </p>
        <ul
          style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            borderTop: `1px solid ${hover ? C.linenDarker : C.linenDarker}`,
            paddingTop: 22,
          }}
        >
          {ind.details.map((d) => (
            <li
              key={d}
              style={{
                fontFamily: SANS,
                fontSize: 12.5,
                letterSpacing: '0.06em',
                color: C.forestMid,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                fontWeight: 500,
              }}
            >
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  background: C.terra,
                  flexShrink: 0,
                }}
              />
              {d}
            </li>
          ))}
        </ul>
      </article>
    </Reveal>
  );
}

function IndicationsSection() {
  const sec: React.CSSProperties = {
    background: C.linen,
    padding: 'clamp(96px,13vw,180px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
    gap: 'clamp(24px,3vw,40px)',
    maxWidth: 1240,
    margin: '0 auto',
  };

  return (
    <section style={sec} id="indications">
      <div style={{ maxWidth: 1240, margin: '0 auto 60px' }}>
        <Reveal>
          <Eyebrow>Indications</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(36px,5.8vw,76px)',
              fontWeight: 400,
              color: C.forest,
              margin: '20px 0 0',
              lineHeight: 1.05,
            }}
          >
            Trois spécialités,{' '}
            <span style={{ fontStyle: 'italic', color: C.terra }}>
              une approche globale
            </span>
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: 'clamp(16px,1.7vw,20px)',
              color: 'rgba(30,45,37,0.72)',
              maxWidth: 560,
              lineHeight: 1.72,
              marginTop: 22,
            }}
          >
            L&apos;ostéopathie considère le corps dans sa totalité. Chaque motif
            de consultation est abordé avec la même rigueur diagnostique et la
            même bienveillance thérapeutique.
          </p>
        </Reveal>
      </div>
      <div style={grid}>
        {INDICATIONS.map((ind, i) => (
          <IndicationCard key={ind.title} ind={ind} i={i} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   4 · TechniqueSection — left sticky photo + right scroll 4 techniques
   ════════════════════════════════════════════════════════════════════════════ */
type Technique = {
  step: string;
  title: string;
  body: string;
};

const TECHNIQUES: Technique[] = [
  {
    step: '01',
    title: 'Ostéopathie structurelle',
    body: 'Manipulation articulaire précise des vertèbres et des articulations périphériques. Cette approche traite les restrictions de mobilité responsables de douleurs mécaniques, en rétablissant le jeu articulaire optimal avec des techniques douces et controlées.',
  },
  {
    step: '02',
    title: 'Crânio-sacrée',
    body: 'Technique très douce utilisant des pressions légères sur le crâne, la colonne et le sacrum. Particulièrement indiquée pour les nourrissons, les migraines chroniques et les états de stress intense. Travail sur le rythme crânio-sacré propre à chaque patient.',
  },
  {
    step: '03',
    title: 'Viscérale',
    body: 'Les organes internes ont leur propre mobilité — le péritoine, le diaphragme, le foie, les intestins. Des restrictions viscérales peuvent générer des douleurs lombaires ou digestives. Le traitement viscéral libère ces tensions avec des pressions lentes et profondes.',
  },
  {
    step: '04',
    title: 'Fasciale',
    body: 'Les fascias sont des membranes conjonctives qui enveloppent chaque structure du corps. Des adhérences fasciales créent des chaînes de tension à distance du symptôme. Le relâchement fascial agit sur la posture globale et la qualité de mouvement du patient.',
  },
];

function TechniqueSection() {
  const sec: React.CSSProperties = {
    background: C.white,
    padding: 'clamp(80px,11vw,150px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '0.95fr 1.05fr',
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
    <section style={sec} id="techniques">
      <div style={grid} className="r279-technique-grid">
        {/* Visuel collant */}
        <div style={stickySide} className="r279-technique-sticky">
          <div
            style={{
              overflow: 'hidden',
              aspectRatio: '4 / 5',
              border: `1px solid ${C.linenDarker}`,
            }}
          >
            <img
              src={PHOTO.consultation}
              alt="Consultation ostéopathique au cabinet Soler Lyon"
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
          <div style={{ marginTop: 24 }}>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 10.5,
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                color: C.terra,
                marginBottom: 10,
                fontWeight: 600,
              }}
            >
              Dr Soler · Ostéopathe D.O.
            </div>
            <div
              style={{
                fontFamily: SERIF,
                fontStyle: 'italic',
                fontSize: 18,
                color: 'rgba(30,45,37,0.78)',
                lineHeight: 1.6,
              }}
            >
              « Chaque corps raconte une histoire — mon rôle est de l&apos;écouter
              avant de le traiter. »
            </div>
          </div>
        </div>

        {/* Techniques qui défilent */}
        <div>
          <Reveal>
            <Eyebrow>Approches thérapeutiques</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(34px,5vw,64px)',
                fontWeight: 400,
                color: C.forest,
                margin: '20px 0 52px',
                lineHeight: 1.05,
              }}
            >
              Quatre techniques,{' '}
              <span style={{ fontStyle: 'italic', color: C.terra }}>
                un seul objectif
              </span>
            </h2>
          </Reveal>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {TECHNIQUES.map((t, i) => (
              <Reveal key={t.step} delay={0.06 * i}>
                <div
                  style={{
                    padding: '34px 0',
                    borderTop: `1px solid ${C.linenDarker}`,
                    display: 'flex',
                    gap: 28,
                    alignItems: 'baseline',
                  }}
                >
                  <span
                    style={{
                      fontFamily: SERIF,
                      fontStyle: 'italic',
                      fontSize: 22,
                      color: 'rgba(196,120,90,0.55)',
                      minWidth: 42,
                      flexShrink: 0,
                    }}
                  >
                    {t.step}
                  </span>
                  <div>
                    <h4
                      style={{
                        fontFamily: SERIF,
                        fontSize: 24,
                        fontWeight: 400,
                        color: C.forest,
                        margin: '0 0 12px',
                      }}
                    >
                      {t.title}
                    </h4>
                    <p
                      style={{
                        fontFamily: SERIF,
                        fontStyle: 'italic',
                        fontSize: 16.5,
                        lineHeight: 1.72,
                        color: 'rgba(30,45,37,0.72)',
                        margin: 0,
                      }}
                    >
                      {t.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
            <div style={{ paddingTop: 10, borderTop: `1px solid ${C.linenDarker}` }} />
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 860px) {
          .r279-technique-grid { grid-template-columns: 1fr !important; }
          .r279-technique-sticky { position: static !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   5 · TestimonialsSection — 3 témoignages avec étoiles et situation
   ════════════════════════════════════════════════════════════════════════════ */
type Testimonial = {
  quote: string;
  name: string;
  situation: string;
  stars: number;
};

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'J&apos;avais une lombalgie chronique depuis trois ans. En deux séances, le Dr Soler a identifié une restriction que personne n&apos;avait vue. Après quatre séances, je n&apos;ai plus de douleurs quotidiennes. Un praticien exceptionnel.',
    name: 'Sophie M.',
    situation: 'Lombalgie chronique · 38 ans',
    stars: 5,
  },
  {
    quote:
      'Notre fils avait des coliques insupportables depuis ses deux semaines. Une séance de crânio-sacrée et les nuits sont redevenues paisibles. Je recommande à toutes les jeunes mamans de la région lyonnaise.',
    name: 'Camille & Hugo D.',
    situation: 'Colique nourrisson · 6 semaines',
    stars: 5,
  },
  {
    quote:
      'Triathlète amateur, je venais pour une tendinite récidivante. Le Dr Soler a trouvé une déséquilibre pelvien à l&apos;origine du problème. Je cours maintenant sans douleur et je vois le cabinet tous les deux mois en préventif.',
    name: 'Thomas L.',
    situation: 'Sportif · Triathlète amateur',
    stars: 5,
  },
];

function TestimonialsSection() {
  const sec: React.CSSProperties = {
    background: C.linen,
    padding: 'clamp(90px,12vw,170px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: 'clamp(28px,3.5vw,52px)',
    maxWidth: 1240,
    margin: '0 auto',
  };

  return (
    <section style={sec} id="temoignages">
      <div style={{ maxWidth: 1240, margin: '0 auto 64px', textAlign: 'center' }}>
        <Reveal>
          <Eyebrow color={C.forest} align="center">
            Témoignages
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(34px,5vw,66px)',
              fontWeight: 400,
              color: C.forest,
              margin: '20px 0 0',
            }}
          >
            Ce que disent{' '}
            <span style={{ fontStyle: 'italic', color: C.terra }}>
              nos patients
            </span>
          </h2>
        </Reveal>
      </div>
      <div style={grid}>
        {TESTIMONIALS.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.12} style={{ height: '100%' }}>
            <figure
              style={{
                background: C.white,
                border: `1.5px solid ${C.linenDarker}`,
                padding: 'clamp(30px,3.5vw,44px)',
                margin: 0,
                height: '100%',
                boxSizing: 'border-box',
                boxShadow: '0 20px 54px -36px rgba(42,74,53,0.28)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Quote size={30} color={C.terra} strokeWidth={1.3} />
              <div style={{ display: 'flex', gap: 4, margin: '18px 0 16px' }}>
                {Array.from({ length: t.stars }).map((_, s) => (
                  <Star key={s} size={14} fill={C.terra} color={C.terra} strokeWidth={0} />
                ))}
              </div>
              <blockquote
                style={{
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  fontSize: 'clamp(17px,1.8vw,21px)',
                  lineHeight: 1.65,
                  color: C.ink,
                  margin: '0 0 26px',
                  flex: 1,
                }}
              >
                "{t.quote}"
              </blockquote>
              <figcaption
                style={{
                  borderTop: `1px solid ${C.linenDarker}`,
                  paddingTop: 20,
                }}
              >
                <div
                  style={{
                    fontFamily: SERIF,
                    fontSize: 18,
                    color: C.forest,
                    fontWeight: 400,
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
                    color: C.terra,
                    marginTop: 6,
                    fontWeight: 500,
                  }}
                >
                  {t.situation}
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
   6 · AppointmentFormSection — formulaire complet + état envoyé
   ════════════════════════════════════════════════════════════════════════════ */
function AppointmentFormSection() {
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [motif, setMotif] = useState('');
  const [commentaire, setCommentaire] = useState('');
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prenom || !nom || !telephone || !motif) return;
    setSent(true);
  };

  const sec: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    background: C.forestDeep,
    padding: 'clamp(96px,13vw,180px) clamp(24px,6vw,96px)',
  };
  const fieldBase: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    background: 'transparent',
    border: 'none',
    borderBottom: `1.5px solid rgba(196,120,90,0.4)`,
    padding: '16px 2px',
    fontFamily: SERIF,
    fontSize: 18,
    color: C.linen,
    outline: 'none',
    transition: 'border-color .3s',
  };
  const labelStyle: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 10.5,
    letterSpacing: '0.24em',
    textTransform: 'uppercase',
    color: C.terra,
    display: 'block',
    marginBottom: 4,
    fontWeight: 600,
  };

  return (
    <section style={sec} id="rdv">
      <img
        src={PHOTO.zen}
        alt="Image de présentation"
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
          maxWidth: 760,
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <Reveal>
          <Eyebrow color={C.terraLight} align="center">
            Prise de rendez-vous
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(36px,6vw,78px)',
              fontWeight: 400,
              color: C.linen,
              margin: '22px 0 18px',
              lineHeight: 1.04,
            }}
          >
            Commencer{' '}
            <span style={{ fontStyle: 'italic', color: C.terraLight }}>
              votre suivi
            </span>
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: 'clamp(16px,1.7vw,20px)',
              lineHeight: 1.72,
              color: 'rgba(245,239,230,0.80)',
              maxWidth: 540,
              margin: '0 auto 52px',
            }}
          >
            Décrivez votre situation ci-dessous. Le Dr Soler reviendra vers vous
            dans les 24 heures pour confirmer votre rendez-vous au cabinet de
            Lyon 6e.
          </p>
        </Reveal>

        {sent ? (
          <Reveal>
            <div
              style={{
                border: `1.5px solid rgba(196,120,90,0.5)`,
                padding: 'clamp(36px,5vw,56px)',
                background: 'rgba(196,120,90,0.07)',
              }}
            >
              <CheckCircle size={42} color={C.terra} strokeWidth={1.3} />
              <h3
                style={{
                  fontFamily: SERIF,
                  fontSize: 32,
                  fontWeight: 400,
                  color: C.linen,
                  margin: '20px 0 14px',
                }}
              >
                Merci{prenom ? `, ${prenom}` : ''}.
              </h3>
              <p
                style={{
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  fontSize: 18,
                  color: 'rgba(245,239,230,0.80)',
                  margin: '0 0 10px',
                  lineHeight: 1.65,
                }}
              >
                Votre demande pour{' '}
                <strong style={{ color: C.terraLight, fontStyle: 'normal' }}>
                  {motif}
                </strong>{' '}
                a bien été reçue.
              </p>
              <p
                style={{
                  fontFamily: SANS,
                  fontSize: 12.5,
                  letterSpacing: '0.12em',
                  color: 'rgba(245,239,230,0.58)',
                  margin: 0,
                  fontWeight: 500,
                }}
              >
                Le Dr Soler vous contactera au {telephone} dans les 24 heures.
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
                gap: 34,
                textAlign: 'left',
              }}
            >
              {/* Ligne Prénom / Nom */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 32,
                }}
                className="r279-name-grid"
              >
                <div>
                  <label style={labelStyle} htmlFor="r279-prenom">
                    Prénom
                  </label>
                  <input
                    id="r279-prenom"
                    style={fieldBase}
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    placeholder="Marie"
                    autoComplete="given-name"
                    required
                  />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="r279-nom">
                    Nom
                  </label>
                  <input
                    id="r279-nom"
                    style={fieldBase}
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    placeholder="Dupont"
                    autoComplete="family-name"
                    required
                  />
                </div>
              </div>

              {/* Téléphone */}
              <div>
                <label style={labelStyle} htmlFor="r279-tel">
                  Téléphone
                </label>
                <input
                  id="r279-tel"
                  style={fieldBase}
                  type="tel"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  placeholder="06 12 34 56 78"
                  autoComplete="tel"
                  required
                />
              </div>

              {/* Motif */}
              <div>
                <label style={labelStyle} htmlFor="r279-motif">
                  Motif de consultation
                </label>
                <select
                  id="r279-motif"
                  style={{
                    ...fieldBase,
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    cursor: 'pointer',
                    color: motif ? C.linen : 'rgba(245,239,230,0.42)',
                  }}
                  value={motif}
                  onChange={(e) => setMotif(e.target.value)}
                  required
                >
                  <option value="" style={{ color: '#1e2d25' }}>
                    Choisir un motif…
                  </option>
                  <option value="Douleur dos" style={{ color: '#1e2d25' }}>
                    Douleur dos / lombalgie
                  </option>
                  <option value="Cervicales" style={{ color: '#1e2d25' }}>
                    Cervicales / nuque / migraine
                  </option>
                  <option value="Nourrisson" style={{ color: '#1e2d25' }}>
                    Nourrisson / pédiatrie
                  </option>
                  <option value="Sportif" style={{ color: '#1e2d25' }}>
                    Sportif / blessure / performance
                  </option>
                  <option value="Autre" style={{ color: '#1e2d25' }}>
                    Autre motif
                  </option>
                </select>
              </div>

              {/* Commentaire */}
              <div>
                <label style={labelStyle} htmlFor="r279-comment">
                  Commentaire (optionnel)
                </label>
                <textarea
                  id="r279-comment"
                  style={{
                    ...fieldBase,
                    resize: 'vertical',
                    minHeight: 100,
                    lineHeight: 1.6,
                  }}
                  value={commentaire}
                  onChange={(e) => setCommentaire(e.target.value)}
                  placeholder="Décrivez vos douleurs, leur ancienneté, traitements en cours…"
                />
              </div>

              <div style={{ marginTop: 8, textAlign: 'center' }}>
                <ForestButton filled type="submit">
                  Envoyer ma demande
                </ForestButton>
              </div>
            </form>
          </Reveal>
        )}
      </div>
      <style>{`
        @media (max-width: 600px) {
          .r279-name-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   7 · PhilosophySection — Corps / Esprit / Mouvement
   ════════════════════════════════════════════════════════════════════════════ */
type Principle = {
  index: string;
  title: string;
  body: string;
};

const PRINCIPLES: Principle[] = [
  {
    index: 'I',
    title: 'Le corps',
    body: 'Le corps est une unité parfaite — chaque structure, chaque organe interagit avec les autres. Une douleur au genou peut naître d\'une restriction de cheville, une migraine d\'une tension diaphragmatique. L\'ostéopathie refuse la fragmentation anatomique pour embrasser la totalité de l\'être.',
  },
  {
    index: 'II',
    title: "L'esprit",
    body: 'L\'état émotionnel influence la posture, la respiration, la tonicité musculaire. Le stress chronique se cristallise dans les tissus. Le Dr Soler intègre cette dimension dans chaque consultation, prenant le temps d\'écouter non seulement le corps mais la vie du patient qui l\'habite.',
  },
  {
    index: 'III',
    title: 'Le mouvement',
    body: 'La santé, c\'est le mouvement — celui des articulations, des fluides, des organes, de l\'énergie vitale. Restaurer la mobilité là où elle est contrainte, c\'est redonner au corps les conditions de son auto-guérison. C\'est le cœur de chaque séance au cabinet Soler.',
  },
];

function PhilosophySection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);

  const sec: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    background: C.forestDeep,
    padding: 'clamp(90px,12vw,170px) clamp(24px,6vw,96px)',
  };

  return (
    <section ref={ref} style={sec} id="philosophie">
      {/* Fond parallaxe */}
      <motion.div
        style={{
          position: 'absolute',
          inset: '-8% 0',
          height: '116%',
          y: bgY,
          opacity: 0.10,
        }}
      >
        <img
          src={PHOTO.zen}
          alt="Image de présentation"
          aria-hidden="true"
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </motion.div>

      <div style={{ position: 'relative', zIndex: 2, maxWidth: 1240, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 72 }}>
          <Reveal>
            <Eyebrow color={C.terraLight} align="center">
              Notre philosophie
            </Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(34px,5.5vw,72px)',
                fontWeight: 400,
                color: C.linen,
                margin: '22px 0 0',
                lineHeight: 1.06,
              }}
            >
              Soigner la personne,{' '}
              <span style={{ fontStyle: 'italic', color: C.terraLight }}>
                pas le symptôme
              </span>
            </h2>
          </Reveal>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'clamp(32px,4vw,60px)',
          }}
        >
          {PRINCIPLES.map((p, i) => (
            <Reveal key={p.index} delay={i * 0.14}>
              <div
                style={{
                  borderLeft: `2px solid rgba(196,120,90,0.40)`,
                  paddingLeft: 28,
                }}
              >
                <span
                  style={{
                    fontFamily: SERIF,
                    fontStyle: 'italic',
                    fontSize: 42,
                    color: 'rgba(196,120,90,0.35)',
                    lineHeight: 1,
                    display: 'block',
                    marginBottom: 12,
                  }}
                >
                  {p.index}
                </span>
                <h3
                  style={{
                    fontFamily: SERIF,
                    fontSize: 'clamp(26px,3vw,36px)',
                    fontWeight: 400,
                    color: C.linen,
                    margin: '0 0 18px',
                  }}
                >
                  {p.title}
                </h3>
                <p
                  style={{
                    fontFamily: SERIF,
                    fontStyle: 'italic',
                    fontSize: 16.5,
                    lineHeight: 1.74,
                    color: 'rgba(245,239,230,0.72)',
                    margin: 0,
                  }}
                >
                  {p.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   8 · PractitionerSection — Bio Dr. Soler
   ════════════════════════════════════════════════════════════════════════════ */
function PractitionerSection() {
  const sec: React.CSSProperties = {
    background: C.linen,
    padding: 'clamp(80px,11vw,160px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1.2fr',
    gap: 'clamp(40px,6vw,96px)',
    maxWidth: 1240,
    margin: '0 auto',
    alignItems: 'center',
  };

  const formations = [
    { year: '2010', label: 'Diplôme d\'Ostéopathie D.O. — IFSO Lyon' },
    { year: '2012', label: 'Formation pédiatrique — Institut Méditerranéen' },
    { year: '2015', label: 'Spécialisation crânio-sacrée — Sutherland College' },
    { year: '2018', label: 'Ostéopathie du sportif — CDES Paris' },
    { year: '2022', label: 'Thérapie fasciale avancée — Stecco Method' },
  ];

  return (
    <section style={sec} id="praticien">
      <div style={grid} className="r279-practitioner-grid">
        {/* Photo praticien */}
        <Reveal y={50}>
          <div
            style={{
              overflow: 'hidden',
              aspectRatio: '4 / 5',
              border: `1px solid ${C.linenDarker}`,
            }}
          >
            <img
              src={PHOTO.consultation}
              alt="Dr Soler, ostéopathe D.O. à Lyon 6e Brotteaux"
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
        </Reveal>

        {/* Biographie */}
        <div>
          <Reveal>
            <Eyebrow>Le praticien</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(36px,5vw,66px)',
                fontWeight: 400,
                color: C.forest,
                margin: '20px 0 8px',
                lineHeight: 1.05,
              }}
            >
              Dr. Antoine Soler
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p
              style={{
                fontFamily: SANS,
                fontSize: 12,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: C.terra,
                fontWeight: 600,
                marginBottom: 28,
              }}
            >
              Ostéopathe D.O. · 14 ans d&apos;expérience
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <p
              style={{
                fontFamily: SERIF,
                fontStyle: 'italic',
                fontSize: 'clamp(16px,1.7vw,20px)',
                lineHeight: 1.74,
                color: 'rgba(30,45,37,0.76)',
                marginBottom: 38,
              }}
            >
              Diplômé de l&apos;Institut de Formation en Ostéopathie de Lyon en 2010,
              le Dr Antoine Soler exerce depuis 14 ans dans le quartier des Brotteaux.
              Sa pratique conjugue rigueur diagnostique et écoute profonde — chaque
              consultation dure 45 minutes, sans chronomètre.
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <p
              style={{
                fontFamily: SERIF,
                fontStyle: 'italic',
                fontSize: 'clamp(15px,1.5vw,18px)',
                lineHeight: 1.7,
                color: 'rgba(30,45,37,0.66)',
                marginBottom: 42,
              }}
            >
              Spécialisé en ostéopathie pédiatrique depuis 2012, il reçoit nourrissons
              et jeunes enfants avec des techniques particulièrement douces, adaptées
              à leur fragilité anatomique. Il assure également le suivi ostéopathique
              de plusieurs clubs sportifs lyonnais.
            </p>
          </Reveal>

          {/* Parcours */}
          <Reveal delay={0.30}>
            <div
              style={{
                borderTop: `1px solid ${C.linenDarker}`,
                paddingTop: 32,
              }}
            >
              <div
                style={{
                  fontFamily: SANS,
                  fontSize: 10.5,
                  letterSpacing: '0.24em',
                  textTransform: 'uppercase',
                  color: C.terra,
                  fontWeight: 600,
                  marginBottom: 22,
                }}
              >
                Formations & diplômes
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {formations.map((f) => (
                  <div
                    key={f.year}
                    style={{
                      display: 'flex',
                      gap: 20,
                      alignItems: 'baseline',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: SERIF,
                        fontStyle: 'italic',
                        fontSize: 16,
                        color: C.terra,
                        minWidth: 38,
                        flexShrink: 0,
                      }}
                    >
                      {f.year}
                    </span>
                    <span
                      style={{
                        fontFamily: SERIF,
                        fontSize: 16,
                        color: 'rgba(30,45,37,0.76)',
                        lineHeight: 1.5,
                      }}
                    >
                      {f.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
      <style>{`
        @media (max-width: 860px) {
          .r279-practitioner-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   8b · ParallaxImg utilitaire
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

/* ════════════════════════════════════════════════════════════════════════════
   9 · PracticalSection — Cabinet Lyon 6e Brotteaux
   ════════════════════════════════════════════════════════════════════════════ */
type InfoBlock = {
  icon: React.ReactNode;
  title: string;
  lines: string[];
};

function PracticalSection() {
  const sec: React.CSSProperties = {
    background: C.forest,
    padding: 'clamp(80px,11vw,150px) clamp(24px,6vw,96px)',
  };

  const blocks: InfoBlock[] = [
    {
      icon: <MapPin size={26} color={C.terra} strokeWidth={1.4} />,
      title: 'Adresse',
      lines: [
        '18 rue de la Barre',
        '69006 Lyon — Brotteaux',
        'Métro A — Foch ou Masséna',
        'Tram T1 — Saxe-Gambetta',
      ],
    },
    {
      icon: <Clock size={26} color={C.terra} strokeWidth={1.4} />,
      title: 'Horaires',
      lines: [
        'Lundi — Jeudi : 9h – 19h',
        'Vendredi : 9h – 18h',
        'Samedi : 9h – 13h',
        'Dimanche : fermé',
      ],
    },
    {
      icon: <CreditCard size={26} color={C.terra} strokeWidth={1.4} />,
      title: 'Tarifs & remboursements',
      lines: [
        'Consultation adulte : 70 €',
        'Nourrisson / enfant : 65 €',
        'Séance sportive : 75 €',
        'Remboursement mutuelles : oui *',
      ],
    },
    {
      icon: <Phone size={26} color={C.terra} strokeWidth={1.4} />,
      title: 'Contact',
      lines: [
        '04 78 XX XX XX',
        'cabinet.soler@gmail.com',
        'Urgences : via Doctolib',
        'Réponse sous 24h',
      ],
    },
  ];

  return (
    <section style={sec} id="cabinet">
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        <div style={{ marginBottom: 64, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(32px,5vw,80px)', alignItems: 'end' }} className="r279-practical-header">
          <div>
            <Reveal>
              <Eyebrow color={C.terraLight}>Informations pratiques</Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              <h2
                style={{
                  fontFamily: SERIF,
                  fontSize: 'clamp(34px,5vw,66px)',
                  fontWeight: 400,
                  color: C.linen,
                  margin: '20px 0 0',
                  lineHeight: 1.06,
                }}
              >
                Cabinet Lyon 6e,{' '}
                <span style={{ fontStyle: 'italic', color: C.terraLight }}>
                  Brotteaux
                </span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.16}>
            <p
              style={{
                fontFamily: SERIF,
                fontStyle: 'italic',
                fontSize: 'clamp(16px,1.6vw,19px)',
                lineHeight: 1.72,
                color: 'rgba(245,239,230,0.74)',
              }}
            >
              Le cabinet est accessible depuis toute l&apos;agglomération lyonnaise.
              Parking à proximité, accès PMR disponible sur demande. Toutes les
              mutuelles remboursent l&apos;ostéopathie — renseignez-vous auprès de
              votre assurance complémentaire.
            </p>
          </Reveal>
        </div>

        {/* Grille infos */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 'clamp(20px,2.5vw,36px)',
          }}
        >
          {blocks.map((b, i) => (
            <Reveal key={b.title} delay={i * 0.10}>
              <div
                style={{
                  background: 'rgba(245,239,230,0.07)',
                  border: '1px solid rgba(245,239,230,0.12)',
                  padding: 'clamp(24px,3vw,36px)',
                  height: '100%',
                  boxSizing: 'border-box',
                }}
              >
                <div style={{ marginBottom: 18 }}>{b.icon}</div>
                <h4
                  style={{
                    fontFamily: SANS,
                    fontSize: 11,
                    letterSpacing: '0.26em',
                    textTransform: 'uppercase',
                    color: C.terra,
                    fontWeight: 600,
                    margin: '0 0 18px',
                  }}
                >
                  {b.title}
                </h4>
                <ul
                  style={{
                    listStyle: 'none',
                    margin: 0,
                    padding: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                  }}
                >
                  {b.lines.map((l) => (
                    <li
                      key={l}
                      style={{
                        fontFamily: SERIF,
                        fontSize: 16.5,
                        color: 'rgba(245,239,230,0.80)',
                        lineHeight: 1.45,
                      }}
                    >
                      {l}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Note mutuelles */}
        <Reveal delay={0.3}>
          <p
            style={{
              fontFamily: SANS,
              fontSize: 11.5,
              color: 'rgba(245,239,230,0.45)',
              marginTop: 28,
              letterSpacing: '0.06em',
            }}
          >
            * Les remboursements varient selon votre contrat mutuelle. La plupart des
            complémentaires remboursent entre 25 € et 60 € par séance.
          </p>
        </Reveal>

        {/* Visuel en bas de section */}
        <Reveal delay={0.2}>
          <div
            style={{
              marginTop: 64,
              overflow: 'hidden',
              aspectRatio: '16/5',
              border: '1px solid rgba(245,239,230,0.12)',
            }}
            className="r279-map-visual"
          >
            <ParallaxImg src={PHOTO.clinic} alt="Vue extérieure du cabinet Soler à Lyon 6e Brotteaux" />
          </div>
        </Reveal>
      </div>
      <style>{`
        @media (max-width: 860px) {
          .r279-practical-header { grid-template-columns: 1fr !important; }
          .r279-map-visual { aspect-ratio: 16/7 !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   10 · FooterSection
   ════════════════════════════════════════════════════════════════════════════ */
function FooterSection() {
  const foot: React.CSSProperties = {
    background: C.forestDeep,
    borderTop: '1px solid rgba(196,120,90,0.20)',
    padding: 'clamp(70px,9vw,110px) clamp(24px,6vw,96px) 44px',
  };

  const cols: { title: string; items: { label: string; href: string }[] }[] = [
    {
      title: 'Le cabinet',
      items: [
        { label: 'Présentation', href: '#praticien' },
        { label: 'Notre philosophie', href: '#philosophie' },
        { label: 'Indications', href: '#indications' },
        { label: 'Techniques', href: '#techniques' },
      ],
    },
    {
      title: 'Patients',
      items: [
        { label: 'Prendre rendez-vous', href: '#rdv' },
        { label: 'Témoignages', href: '#temoignages' },
        { label: 'Tarifs & mutuelles', href: '#cabinet' },
        { label: 'Doctolib', href: 'https://www.doctolib.fr' },
      ],
    },
    {
      title: 'Accès',
      items: [
        { label: 'Lyon 6e — Brotteaux', href: '#cabinet' },
        { label: 'Métro A — Foch', href: '#cabinet' },
        { label: '04 78 XX XX XX', href: 'tel:+33478000000' },
        { label: 'Email', href: 'mailto:cabinet.soler@gmail.com' },
      ],
    },
  ];

  return (
    <footer style={foot}>
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.4fr repeat(3, 1fr)',
          gap: 'clamp(36px,5vw,70px)',
        }}
        className="r279-footgrid"
      >
        {/* Marque */}
        <div>
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 24,
              letterSpacing: '0.20em',
              textTransform: 'uppercase',
              color: C.linen,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              fontWeight: 400,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: C.terra,
                flexShrink: 0,
              }}
            />
            Cabinet Soler · D.O.
          </div>
          <p
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: 15.5,
              lineHeight: 1.72,
              color: 'rgba(245,239,230,0.62)',
              marginTop: 20,
              maxWidth: 320,
            }}
          >
            Ostéopathie holistique · Lyon 6e Brotteaux · Depuis 2010.
          </p>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginTop: 22,
              fontFamily: SANS,
              fontSize: 11,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'rgba(245,239,230,0.52)',
              fontWeight: 500,
            }}
          >
            <MapPin size={13} color={C.terra} strokeWidth={1.5} />
            18 rue de la Barre · 69006 Lyon
          </div>
          <div style={{ marginTop: 28 }}>
            <a
              href="https://www.doctolib.fr"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                fontFamily: SANS,
                fontSize: 11,
                letterSpacing: '0.20em',
                textTransform: 'uppercase',
                color: C.terra,
                textDecoration: 'none',
                fontWeight: 600,
                border: `1px solid rgba(196,120,90,0.35)`,
                padding: '10px 18px',
                transition: 'all .4s',
              }}
            >
              <ExternalLink size={13} strokeWidth={1.6} />
              Doctolib
            </a>
          </div>
        </div>

        {/* Colonnes */}
        {cols.map((c) => (
          <div key={c.title}>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 10.5,
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                color: C.terra,
                fontWeight: 600,
                marginBottom: 22,
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
                gap: 13,
              }}
            >
              {c.items.map((it) => (
                <li key={it.label}>
                  <a
                    href={it.href}
                    style={{
                      fontFamily: SERIF,
                      fontSize: 16,
                      color: 'rgba(245,239,230,0.70)',
                      textDecoration: 'none',
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

      {/* Bas de pied */}
      <div
        style={{
          maxWidth: 1240,
          margin: '60px auto 0',
          paddingTop: 26,
          borderTop: '1px solid rgba(196,120,90,0.14)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
          fontFamily: SANS,
          fontSize: 11,
          letterSpacing: '0.10em',
          color: 'rgba(245,239,230,0.42)',
        }}
      >
        <span>
          © 2026 Cabinet Soler · Ostéopathe D.O. · ADELI&nbsp;69XXXXXXX ·
          Registre ARS Auvergne-Rhône-Alpes
        </span>
        <span style={{ display: 'flex', gap: 22 }}>
          <a
            href="#hero"
            style={{ color: 'inherit', textDecoration: 'none' }}
          >
            Mentions légales
          </a>
          <a
            href="#hero"
            style={{ color: 'inherit', textDecoration: 'none' }}
          >
            Politique de confidentialité
          </a>
          <a
            href="#hero"
            style={{ color: 'inherit', textDecoration: 'none' }}
          >
            Consentement cookies
          </a>
        </span>
      </div>
      <style>{`
        @media (max-width: 860px) {
          .r279-footgrid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .r279-footgrid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   PAGE PRINCIPALE
   ════════════════════════════════════════════════════════════════════════════ */
export default function Impact279Page() {
  const root: React.CSSProperties = {
    background: C.forestDeep,
    color: C.linen,
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
      <IndicationsSection />
      <TechniqueSection />
      <TestimonialsSection />
      <AppointmentFormSection />
      <PhilosophySection />
      <PractitionerSection />
      <PracticalSection />
      <FooterSection />
    </main>
  );
}
