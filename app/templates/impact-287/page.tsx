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
  Activity,
  ArrowRight,
  Award,
  ChevronDown,
  Heart,
  Camera,
  MapPin,
  Mountain,
  Quote,
  Star,
  Sun,
  Sunset,
  Wind,
} from 'lucide-react';

// Hoisted above the design tokens: several templates read `brand` in a
// module-level const — declaring it lower caused a TDZ ReferenceError (500).
let brand: any = null;

/* ════════════════════════════════════════════════════════════════════════════
   CÔTE D'AZUR COACHING — Coach bien-être & remise en forme · Nice Promenade
   Photographies plein cadre + chorégraphie de défilement méditerranéenne
   (style Riviera × énergie outdoor). Auto-suffisant. 'use client'.
   ════════════════════════════════════════════════════════════════════════════ */

/* ── Palette ─────────────────────────────────────────────────────────────── */
const C = {
  azure: '#0077b6',
  azureDeep: '#005f92',
  azureMid: '#0096c7',
  azureLight: '#48cae4',
  sand: '#f4e4c1',
  sandDeep: '#e8d4a8',
  sandLight: '#faf4e8',
  white: '#ffffff',
  coral: '#e07b54',
  coralLight: '#e8936e',
  ink: '#0a1f2e',
  paper: '#fdfaf5',
} as const;

const SERIF = "'Nunito', system-ui, sans-serif" as const;
const SANS = "'Open Sans', system-ui, sans-serif" as const;

/* ── Photographie (URLs Unsplash pré-vérifiées — NE PAS modifier les IDs) ── */
const PHOTO = {
  yogaBeach:
    'https://images.unsplash.com/photo-1502224562085-639556652f33?q=80&w=1600&auto=format&fit=crop',
  runningMer:
    'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=1600&auto=format&fit=crop',
  training:
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1600&auto=format&fit=crop',
  nutrition:
    'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1600&auto=format&fit=crop',
  heroWide:
    'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=1600&auto=format&fit=crop',
  outdoor:
    'https://images.unsplash.com/photo-1502224562085-639556652f33?q=80&w=1600&auto=format&fit=crop',
} as const;

/* ── Easing partagé ──────────────────────────────────────────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ════════════════════════════════════════════════════════════════════════════
   Primitives
   ════════════════════════════════════════════════════════════════════════════ */

/** Étiquette fine, capitales, interlettrage, filet corail/azur. */
function Eyebrow({
  children,
  color = C.coral,
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
    height: 2,
    background: color,
    opacity: 0.75,
    borderRadius: 2,
  };
  const label: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 11,
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
      transition={{ duration: 1.0, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Bouton corail ou azur, hover lumineux, flèche glissante. */
function CoachButton({
  children,
  onClick,
  variant = 'coral',
  type = 'button',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'coral' | 'azure' | 'outline';
  type?: 'button' | 'submit';
}) {
  const [hover, setHover] = useState(false);

  const bgMap = {
    coral: hover ? C.coralLight : C.coral,
    azure: hover ? C.azureMid : C.azure,
    outline: hover ? 'rgba(0,119,182,0.10)' : 'transparent',
  };
  const colorMap = {
    coral: C.white,
    azure: C.white,
    outline: C.azure,
  };
  const borderMap = {
    coral: 'none',
    azure: 'none',
    outline: `2px solid ${C.azure}`,
  };

  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 10,
    padding: '14px 28px',
    fontFamily: SANS,
    fontSize: 13,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    fontWeight: 700,
    cursor: 'pointer',
    border: borderMap[variant],
    borderRadius: 50,
    background: bgMap[variant],
    color: colorMap[variant],
    transition: 'all .4s cubic-bezier(.16,1,.3,1)',
    transform: hover ? 'translateY(-2px)' : 'none',
    boxShadow: hover
      ? variant === 'outline'
        ? 'none'
        : '0 12px 30px -10px rgba(0,0,0,0.35)'
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
        size={15}
        style={{
          transform: hover ? 'translateX(4px)' : 'none',
          transition: 'transform .4s cubic-bezier(.16,1,.3,1)',
        }}
      />
    </button>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   Navigation : transparente → solide azur au défilement
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
    { label: 'Méthode', href: '#methode' },
    { label: 'Planning', href: '#planning' },
    { label: 'Outdoor', href: '#outdoor' },
    { label: 'Nutrition', href: '#nutrition' },
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
    background: solid ? 'rgba(0,95,146,0.94)' : 'transparent',
    backdropFilter: solid ? 'blur(16px) saturate(130%)' : 'none',
    WebkitBackdropFilter: solid ? 'blur(16px) saturate(130%)' : 'none',
    borderBottom: solid
      ? '1px solid rgba(255,255,255,0.18)'
      : '1px solid transparent',
    transition: 'all .5s cubic-bezier(.16,1,.3,1)',
  };
  const brand: React.CSSProperties = {
    fontFamily: SERIF,
    fontSize: 19,
    letterSpacing: '0.04em',
    color: C.white,
    fontWeight: 800,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    textDecoration: 'none',
  };
  const linkRow: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'clamp(16px,2.2vw,36px)',
  };

  return (
    <>
      <nav style={bar}>
      <a href="#hero" style={brand}>
        <Sun size={22} color={C.coral} strokeWidth={2} />{fd?.businessName ?? "Côte d'Azur Coaching"}</a>
      <div style={linkRow} className="r287-navlinks">
        {links.map((l) => (
          <NavLink key={l.label} label={l.label} href={l.href} />
        ))}
      </div>
      <div className="r287-navcta">
        <a href="#bilan" style={{ textDecoration: 'none' }}>
          <CoachButton variant="coral">Séance gratuite</CoachButton>
        </a>
      </div>
      
        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="r287-burger"
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
          .r287-navlinks{ display:none !important; }
          .r287-burger { display: flex !important; flex-direction: column; }
          .r287-navcta{ display:none !important; }
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
        color: h ? C.sand : 'rgba(255,255,255,0.92)',
        textDecoration: 'none',
        transition: 'color .3s',
        position: 'relative',
        paddingBottom: 4,
        cursor: 'pointer',
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
          background: C.coral,
          transition: 'width .45s cubic-bezier(.16,1,.3,1)',
          borderRadius: 2,
        }}
      />
    </a>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   1 · HERO — lumière méditerranéenne, parallaxe
   ════════════════════════════════════════════════════════════════════════════ */
function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.14]);
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '16%']);
  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '-42%']);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);

  const section: React.CSSProperties = {
    position: 'relative',
    height: '100vh',
    minHeight: 640,
    overflow: 'hidden',
    background: C.azureDeep,
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
          src={PHOTO.heroWide}
          alt="Running sur la Promenade des Anglais à Nice au lever du soleil"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </motion.div>

      {/* Voile dégradé azur → transparent → sable */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(0,95,146,0.55) 0%, rgba(0,95,146,0.10) 38%, rgba(0,31,46,0.48) 72%, rgba(0,31,46,0.92) 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(120% 70% at 50% 20%, transparent 40%, rgba(0,95,146,0.38) 100%)',
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
        <Reveal y={18}>
          <Eyebrow color={C.sand} align="center">
            Coach bien-être & remise en forme · Nice Promenade
          </Eyebrow>
        </Reveal>

        <motion.h1
          initial={{ opacity: 0, y: 44 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.14 }}
          style={{
            fontFamily: SERIF,
            fontWeight: 800,
            color: C.white,
            fontSize: 'clamp(46px, 8.5vw, 130px)',
            lineHeight: 1.0,
            letterSpacing: '-0.02em',
            margin: '28px 0 20px',
            textShadow: '0 10px 50px rgba(0,0,0,0.45)',
          }}
        >
          Ton corps,{' '}
          <span
            style={{
              color: C.coral,
              display: 'block',
            }}
          >
            ta meilleure version
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.42 }}
          style={{
            fontFamily: SANS,
            fontSize: 'clamp(16px, 1.9vw, 21px)',
            color: 'rgba(255,255,255,0.90)',
            maxWidth: 580,
            lineHeight: 1.65,
            fontWeight: 400,
          }}
        >
          Coaching outdoor & bien-être sur la Côte d&apos;Azur. Séances en
          plein air, yoga face à la mer, running & nutrition méditerranéenne.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.68 }}
          style={{ marginTop: 44, display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <a href="#bilan" style={{ textDecoration: 'none' }}>
            <CoachButton variant="coral">Séance découverte gratuite</CoachButton>
          </a>
          <a href="#programmes" style={{ textDecoration: 'none' }}>
            <CoachButton variant="outline">Voir les programmes</CoachButton>
          </a>
        </motion.div>

        {/* Badges sociaux proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.0, ease: EASE, delay: 1.1 }}
          style={{
            marginTop: 52,
            display: 'flex',
            gap: 'clamp(18px, 3vw, 48px)',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {[
            { value: '8+', label: "Années d'expérience" },
            { value: '340+', label: 'Clients transformés' },
            { value: '98%', label: 'Satisfaction client' },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontFamily: SERIF,
                  fontWeight: 800,
                  fontSize: 'clamp(26px, 3.5vw, 40px)',
                  color: C.sand,
                  lineHeight: 1,
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontFamily: SANS,
                  fontSize: 11,
                  letterSpacing: '0.20em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.72)',
                  marginTop: 8,
                  fontWeight: 500,
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Indice de défilement */}
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
            color: 'rgba(255,255,255,0.72)',
            fontWeight: 600,
          }}
        >
          Découvrir
        </span>
        <motion.div
          animate={{ y: [0, 9, 0] }}
          transition={{ duration: 2.0, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={22} color={C.sand} strokeWidth={2} />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   2 · ScrollCrossfade 320vh collant — 3 visuels avec ProgressDots animés
   ════════════════════════════════════════════════════════════════════════════ */
type CrossfadeSlide = {
  src: string;
  alt: string;
  index: string;
  caption: string;
  sub: string;
};

const CROSSFADE_SLIDES: CrossfadeSlide[] = [
  {
    src: PHOTO.yogaBeach,
    alt: 'Yoga sur la plage de Nice au lever du soleil',
    index: 'I',
    caption: 'Yoga plage',
    sub: 'Salut au soleil face à la Méditerranée. Corps, souffle, sérénité.',
  },
  {
    src: PHOTO.runningMer,
    alt: 'Running le long du bord de mer à Nice',
    index: 'II',
    caption: 'Running bord mer',
    sub: 'Les pieds dans le vent, la mer à portée de regard. Courir autrement.',
  },
  {
    src: PHOTO.training,
    alt: 'Séance de stretching et remise en forme outdoor',
    index: 'III',
    caption: 'Stretching & force',
    sub: 'Mobilité, équilibre, endurance — tout ce dont ton corps a besoin.',
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
          fontWeight: 800,
          fontSize: 'clamp(38px, 8.5vw, 110px)',
          color: 'rgba(224,123,84,0.28)',
          lineHeight: 1,
          marginBottom: 8,
        }}
      >
        {slide.index}
      </span>
      <h2
        style={{
          fontFamily: SERIF,
          fontSize: 'clamp(38px, 6.5vw, 90px)',
          fontWeight: 800,
          color: C.white,
          lineHeight: 1.05,
          margin: 0,
          textShadow: '0 6px 36px rgba(0,0,0,0.5)',
        }}
      >
        {slide.caption}
      </h2>
      <p
        style={{
          fontFamily: SANS,
          fontSize: 'clamp(15px, 1.7vw, 20px)',
          color: 'rgba(255,255,255,0.88)',
          marginTop: 18,
          maxWidth: 460,
          lineHeight: 1.6,
          fontWeight: 400,
        }}
      >
        {slide.sub}
      </p>
    </motion.div>
  );
}

function CrossfadeProgressDot({
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
    [0.35, 1, 1, 0.35],
  );
  const width = useTransform(progress, [i * seg, (i + 1) * seg], [10, 36]);
  return (
    <motion.div
      style={{
        height: 3,
        width,
        background: C.coral,
        opacity,
        borderRadius: 3,
      }}
    />
  );
}

function ScrollCrossfade() {
  const n = CROSSFADE_SLIDES.length;
  const progress = useMotionValue(0.5 / n);
  const [active, setActive] = useState(0);
  const goTo = (i: number) => {
    setActive(i);
    progress.set((i + 0.5) / n);
  };

  return (
    <section
      style={{ height: '100vh', overflow: 'hidden', position: 'relative', background: C.azureDeep }}
    >
      <div
        style={{
          position: 'relative',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {CROSSFADE_SLIDES.map((s, i) => (
          <CrossfadeImage
            key={s.caption}
            slide={s}
            i={i}
            total={CROSSFADE_SLIDES.length}
            progress={progress}
          />
        ))}
        {/* voile lisibilité */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to bottom, rgba(0,95,146,0.28), rgba(0,95,146,0.08) 45%, rgba(0,31,46,0.65))',
          }}
        />
        {CROSSFADE_SLIDES.map((s, i) => (
          <CrossfadeCaption
            key={s.caption}
            slide={s}
            i={i}
            total={CROSSFADE_SLIDES.length}
            progress={progress}
          />
        ))}

        {/* ProgressDots animés */}
        <div
          style={{
            position: 'absolute',
            bottom: 42,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 12,
          }}
        >
          {CROSSFADE_SLIDES.map((s, i) => (
            <CrossfadeProgressDot
              key={s.index}
              i={i}
              total={CROSSFADE_SLIDES.length}
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
   3 · ProgramsSection — 3 offres avec icônes Lucide
   ════════════════════════════════════════════════════════════════════════════ */
type Program = {
  icon: React.ReactNode;
  name: string;
  tagline: string;
  description: string;
  price: string;
  features: string[];
  highlight: boolean;
};

const PROGRAMS: Program[] = [
  {
    icon: <Sun size={34} color={C.coral} strokeWidth={1.8} />,
    name: 'Coaching outdoor Nice',
    tagline: 'Séances personnalisées en plein air',
    description:
      'Entraînements sur mesure face à la Méditerranée. Circuit training, renforcement musculaire et cardio sur les spots emblématiques de Nice.',
    price: '75 € / séance',
    features: [
      'Bilan initial complet',
      'Programme 100% personnalisé',
      'Spots outdoor sélectionnés',
      'Suivi nutrition inclus',
      'Application de suivi',
    ],
    highlight: false,
  },
  {
    icon: <Wind size={34} color={C.white} strokeWidth={1.8} />,
    name: 'Yoga & Mobilité',
    tagline: 'Souplesse, équilibre & respiration',
    description:
      'Sessions de yoga vinyasa et mobilité articulaire sur la plage ou en parc. Retrouve fluidité, posture et sérénité au rythme de la nature.',
    price: '60 € / séance',
    features: [
      'Yoga vinyasa & yin',
      'Mobilité fonctionnelle',
      'Exercices de respiration',
      'Méditation guidée',
      'Mat fourni',
    ],
    highlight: true,
  },
  {
    icon: <Activity size={34} color={C.coral} strokeWidth={1.8} />,
    name: 'Running & Cardio',
    tagline: 'Progresser en course, gagner en endurance',
    description:
      'Plan d&apos;entraînement running adapté à ton niveau. De la Prom&apos; des Anglais aux collines niçoises, repousse tes limites dans un cadre unique.',
    price: '65 € / séance',
    features: [
      'Analyse foulée',
      'Plan 8-12 semaines',
      'Running Promenade & collines',
      'Cardio & HIIT',
      'Objectif course possible',
    ],
    highlight: false,
  },
];

function ProgramCard({ p, i }: { p: Program; i: number }) {
  const [hover, setHover] = useState(false);

  const card: React.CSSProperties = {
    background: p.highlight
      ? `linear-gradient(145deg, ${C.azure}, ${C.azureDeep})`
      : C.white,
    border: p.highlight
      ? 'none'
      : `1px solid ${hover ? C.azureLight : '#e8eef2'}`,
    borderRadius: 24,
    padding: 'clamp(28px, 4vw, 44px)',
    boxShadow: hover
      ? '0 32px 72px -28px rgba(0,119,182,0.35)'
      : p.highlight
        ? '0 24px 60px -20px rgba(0,95,146,0.5)'
        : '0 8px 32px -16px rgba(0,0,0,0.12)',
    transform: hover ? 'translateY(-10px)' : 'none',
    transition: 'all .55s cubic-bezier(.16,1,.3,1)',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
  };

  const titleColor = p.highlight ? C.white : C.ink;
  const textColor = p.highlight ? 'rgba(255,255,255,0.85)' : '#4a5568';
  const priceColor = p.highlight ? C.sand : C.azure;
  const featureColor = p.highlight ? 'rgba(255,255,255,0.78)' : '#6b7280';
  const dotColor = p.highlight ? C.sand : C.coral;

  return (
    <Reveal delay={i * 0.10} style={{ height: '100%' }}>
      <article
        style={card}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {p.highlight && (
          <div
            style={{
              position: 'absolute',
              top: 20,
              right: 20,
              background: C.coral,
              color: C.white,
              fontFamily: SANS,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              padding: '6px 14px',
              borderRadius: 20,
            }}
          >
            Populaire
          </div>
        )}

        <div style={{ marginBottom: 22 }}>{p.icon}</div>

        <div
          style={{
            fontFamily: SANS,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: p.highlight ? 'rgba(255,255,255,0.7)' : C.coral,
            marginBottom: 12,
          }}
        >
          {p.tagline}
        </div>

        <h3
          style={{
            fontFamily: SERIF,
            fontSize: 'clamp(22px, 2.6vw, 30px)',
            fontWeight: 800,
            color: titleColor,
            margin: '0 0 16px',
            lineHeight: 1.15,
          }}
        >
          {p.name}
        </h3>

        <p
          style={{
            fontFamily: SANS,
            fontSize: 15,
            lineHeight: 1.68,
            color: textColor,
            margin: '0 0 28px',
            flex: 1,
            fontWeight: 400,
          }}
        >
          {p.description}
        </p>

        <ul
          style={{
            listStyle: 'none',
            margin: '0 0 28px',
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          {p.features.map((f) => (
            <li
              key={f}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                fontFamily: SANS,
                fontSize: 14,
                color: featureColor,
                fontWeight: 400,
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  background: dotColor,
                  borderRadius: '50%',
                  flexShrink: 0,
                }}
              />
              {f}
            </li>
          ))}
        </ul>

        <div
          style={{
            borderTop: p.highlight
              ? '1px solid rgba(255,255,255,0.2)'
              : '1px solid #e8eef2',
            paddingTop: 22,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              fontFamily: SERIF,
              fontSize: 24,
              fontWeight: 800,
              color: priceColor,
            }}
          >
            {p.price}
          </span>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontFamily: SANS,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: p.highlight ? C.sand : C.azure,
              transition: 'gap .3s',
            }}
          >
            Découvrir
            <ArrowRight
              size={15}
              style={{
                transform: hover ? 'translateX(5px)' : 'none',
                transition: 'transform .45s cubic-bezier(.16,1,.3,1)',
              }}
            />
          </div>
        </div>
      </article>
    </Reveal>
  );
}

function ProgramsSection() {
  const sec: React.CSSProperties = {
    background: C.paper,
    padding: 'clamp(88px, 12vw, 170px) clamp(24px, 6vw, 96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: 'clamp(22px, 3vw, 42px)',
    maxWidth: 1240,
    margin: '0 auto',
  };

  return (
    <section style={sec} id="programmes">
      <div style={{ maxWidth: 1240, margin: '0 auto 56px', textAlign: 'center' }}>
        <Reveal>
          <Eyebrow color={C.azure} align="center">
            Mes programmes
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(36px, 5.5vw, 72px)',
              fontWeight: 800,
              color: C.ink,
              margin: '18px 0 0',
              lineHeight: 1.06,
            }}
          >
            Choisis ton{' '}
            <span style={{ color: C.azure }}>parcours</span>
          </h2>
        </Reveal>
        <Reveal delay={0.14}>
          <p
            style={{fontFamily: SANS,
              fontSize: 'clamp(16px, 1.7vw, 19px)',
              color: brand ?? '#4a5568',
              maxWidth: 560,
              margin: '18px auto 0',
              lineHeight: 1.7,
              fontWeight: 400,
            }}
          >
            Trois formules pensées pour s&apos;adapter à ton rythme, tes
            objectifs et ton mode de vie sur la Côte d&apos;Azur.
          </p>
        </Reveal>
      </div>
      <div style={grid} className="r287-programs">
        {PROGRAMS.map((p, i) => (
          <ProgramCard key={p.name} p={p} i={i} />
        ))}
      </div>
      <style>{`
        @media (max-width: 860px){
          .r287-programs{ grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   4 · MethodSection — photo coach sticky + 4 piliers qui défilent
   ════════════════════════════════════════════════════════════════════════════ */
type Pillar = { number: string; title: string; body: string };

const PILLARS: Pillar[] = [
  {
    number: '01',
    title: 'Bilan forme complet',
    body: 'Avant tout programme, on fait le point ensemble : condition physique, habitudes, objectifs, contraintes. Un bilan de 45 minutes pour construire quelque chose de solide.',
  },
  {
    number: '02',
    title: 'Programme sur-mesure',
    body: "Chaque corps est unique. Ton programme est créé spécifiquement pour toi — progression, intensité, variété — et évolue chaque semaine selon tes retours et tes performances.",
  },
  {
    number: '03',
    title: 'Séances plein air',
    body: 'La Méditerranée comme décor, les éléments comme partenaires. Toutes les séances se déroulent en extérieur sur les sites les plus beaux de la Côte d&apos;Azur.',
  },
  {
    number: '04',
    title: 'Nutrition méditerranéenne',
    body: 'Des conseils nutritionnels ancrés dans la diète méditerranéenne : légumes, huile d\'olive, protéines maigres, légumineuses. Manger bien sans se priver.',
  },
];

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

function MethodSection() {
  const sec: React.CSSProperties = {
    background: C.paper,
    padding: 'clamp(80px, 11vw, 150px) clamp(24px, 6vw, 96px)',
    borderTop: `1px solid ${C.sandDeep}`,
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '0.9fr 1.1fr',
    gap: 'clamp(40px, 7vw, 100px)',
    maxWidth: 1240,
    margin: '0 auto',
    alignItems: 'start',
  };
  const stickyPhoto: React.CSSProperties = {
    position: 'sticky',
    top: 90,
    alignSelf: 'start',
  };

  return (
    <section style={sec} id="methode">
      <div style={grid} className="r287-method">
        {/* Photo sticky */}
        <div style={stickyPhoto} className="r287-method-sticky">
          <div
            style={{
              overflow: 'hidden',
              borderRadius: 20,
              aspectRatio: '4 / 5',
              boxShadow: '0 32px 80px -30px rgba(0,119,182,0.3)',
            }}
          >
            <ParallaxImg
              src={PHOTO.training}
              alt="Coach sportif Côte d'Azur en séance outdoor"
            />
          </div>
          <div
            style={{
              marginTop: 24,
              background: C.azure,
              borderRadius: 16,
              padding: '24px 28px',
              display: 'flex',
              alignItems: 'center',
              gap: 20,
            }}
          >
            <Award size={36} color={C.sand} strokeWidth={1.6} />
            <div>
              <div
                style={{
                  fontFamily: SERIF,
                  fontSize: 18,
                  fontWeight: 800,
                  color: C.white,
                  lineHeight: 1.2,
                }}
              >
                Certifié BPJEPS & CQP
              </div>
              <div
                style={{
                  fontFamily: SANS,
                  fontSize: 13,
                  color: 'rgba(255,255,255,0.78)',
                  marginTop: 4,
                  lineHeight: 1.5,
                  fontWeight: 400,
                }}
              >
                Coach diplômé d&apos;État · 8 ans d&apos;expérience à Nice
              </div>
            </div>
          </div>
        </div>

        {/* Piliers qui défilent */}
        <div>
          <Reveal>
            <Eyebrow color={C.coral}>Ma méthode</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(32px, 4.8vw, 64px)',
                fontWeight: 800,
                color: C.ink,
                margin: '18px 0 48px',
                lineHeight: 1.08,
              }}
            >
              Une approche{' '}
              <span style={{ color: C.azure }}>globale</span> & durable
            </h2>
          </Reveal>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {PILLARS.map((p, i) => (
              <Reveal key={p.number} delay={0.06 * i}>
                <div
                  style={{
                    padding: '34px 0',
                    borderTop: `1px solid ${C.sandDeep}`,
                    display: 'flex',
                    gap: 28,
                    alignItems: 'flex-start',
                  }}
                >
                  <span
                    style={{
                      fontFamily: SERIF,
                      fontWeight: 800,
                      fontSize: 'clamp(28px, 3vw, 42px)',
                      color: `rgba(0,119,182,0.22)`,
                      lineHeight: 1,
                      minWidth: 60,
                      flexShrink: 0,
                    }}
                  >
                    {p.number}
                  </span>
                  <div>
                    <h3
                      style={{
                        fontFamily: SERIF,
                        fontSize: 'clamp(20px, 2.2vw, 26px)',
                        fontWeight: 800,
                        color: C.ink,
                        margin: '0 0 12px',
                      }}
                    >
                      {p.title}
                    </h3>
                    <p
                      style={{fontFamily: SANS,
                        fontSize: 15.5,
                        lineHeight: 1.72,
                        color: brand ?? '#4a5568',
                        margin: 0,
                        fontWeight: 400,
                      }}
                    >
                      {p.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.3}>
            <div style={{ marginTop: 44 }}>
              <a href="#bilan" style={{ textDecoration: 'none' }}>
                <CoachButton variant="azure">
                  Commencer maintenant
                </CoachButton>
              </a>
            </div>
          </Reveal>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px){
          .r287-method{ grid-template-columns: 1fr !important; }
          .r287-method-sticky{ position: static !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   5 · TransformationSection — 3 témoignages avec résultats et étoiles
   ════════════════════════════════════════════════════════════════════════════ */
type Testimonial = {
  quote: string;
  name: string;
  role: string;
  result: string;
  resultLabel: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'En 3 mois avec Thomas, j&apos;ai perdu 12 kg sans jamais me sentir à court d&apos;énergie. Les séances outdoor me donnaient envie de me lever le matin. La Prom&apos; des Anglais, c&apos;est devenu mon terrain de jeu.',
    name: 'Céline R.',
    role: 'Responsable marketing · Nice',
    result: '-12 kg',
    resultLabel: 'en 3 mois',
  },
  {
    quote:
      'Je n&apos;arrivais pas à toucher mes genoux avec mes mains. Aujourd&apos;hui je fais des salutations au soleil face à la mer chaque matin. Le programme yoga & mobilité a tout changé. Mon dos ne me fait plus mal.',
    name: 'Laurent M.',
    role: 'Chef de projet IT · Sophia Antipolis',
    result: '+45%',
    resultLabel: 'de souplesse',
  },
  {
    quote:
      'Objectif : terminer le marathon de Nice. Mission accomplie. Thomas a adapté le plan à mes contraintes de boulot, les entraînements collines m&apos;ont préparé à tout. Je recommande les yeux fermés.',
    name: 'Amandine T.',
    role: 'Infirmière · Antibes',
    result: '4h12',
    resultLabel: 'marathon de Nice',
  },
];

function TransformationSection() {
  const sec: React.CSSProperties = {
    background: C.azureDeep,
    padding: 'clamp(88px, 12vw, 170px) clamp(24px, 6vw, 96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: 'clamp(22px, 3vw, 40px)',
    maxWidth: 1240,
    margin: '0 auto',
  };

  return (
    <section style={sec} id="temoignages">
      <div style={{ maxWidth: 1240, margin: '0 auto 56px', textAlign: 'center' }}>
        <Reveal>
          <Eyebrow color={C.sand} align="center">
            Transformations réelles
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(34px, 5.5vw, 70px)',
              fontWeight: 800,
              color: C.white,
              margin: '18px 0 0',
              lineHeight: 1.06,
            }}
          >
            Ils ont changé{' '}
            <span style={{ color: C.coral }}>leur vie</span>
          </h2>
        </Reveal>
      </div>

      <div style={grid} className="r287-testim">
        {TESTIMONIALS.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.12} style={{ height: '100%' }}>
            <figure
              style={{
                background: 'rgba(255,255,255,0.08)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.14)',
                borderRadius: 20,
                padding: 'clamp(28px, 4vw, 44px)',
                margin: 0,
                height: '100%',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 18,
                  marginBottom: 24,
                }}
              >
                <div
                  style={{
                    background: C.coral,
                    borderRadius: 14,
                    padding: '12px 18px',
                    textAlign: 'center',
                    minWidth: 80,
                  }}
                >
                  <div
                    style={{
                      fontFamily: SERIF,
                      fontWeight: 800,
                      fontSize: 28,
                      color: C.white,
                      lineHeight: 1,
                    }}
                  >
                    {t.result}
                  </div>
                  <div
                    style={{
                      fontFamily: SANS,
                      fontSize: 10,
                      fontWeight: 600,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: 'rgba(255,255,255,0.85)',
                      marginTop: 4,
                    }}
                  >
                    {t.resultLabel}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 3 }}>
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star
                      key={s}
                      size={16}
                      fill={C.sand}
                      color={C.sand}
                      strokeWidth={0}
                    />
                  ))}
                </div>
              </div>

              <Quote size={28} color={C.coral} strokeWidth={1.4} />

              <blockquote
                style={{
                  fontFamily: SANS,
                  fontSize: 'clamp(15px, 1.7vw, 17px)',
                  lineHeight: 1.7,
                  color: 'rgba(255,255,255,0.90)',
                  margin: '16px 0 24px',
                  flex: 1,
                  fontWeight: 400,
                  fontStyle: 'italic',
                }}
              >
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              <figcaption
                style={{
                  borderTop: '1px solid rgba(255,255,255,0.15)',
                  paddingTop: 18,
                }}
              >
                <div
                  style={{
                    fontFamily: SERIF,
                    fontSize: 18,
                    fontWeight: 700,
                    color: C.sand,
                  }}
                >
                  {t.name}
                </div>
                <div
                  style={{
                    fontFamily: SANS,
                    fontSize: 12,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.55)',
                    marginTop: 5,
                    fontWeight: 500,
                  }}
                >
                  {t.role}
                </div>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
      <style>{`
        @media (max-width: 860px){
          .r287-testim{ grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   6 · BilanFormSection — formulaire séance découverte gratuite
   ════════════════════════════════════════════════════════════════════════════ */
function BilanFormSection() {
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [objectif, setObjectif] = useState('');
  const [dispo, setDispo] = useState('');
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prenom || !nom || !email || !objectif || !dispo) return;
    setSent(true);
  };

  const sec: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    background: C.paper,
    padding: 'clamp(90px, 13vw, 180px) clamp(24px, 6vw, 96px)',
    borderTop: `1px solid ${C.sandDeep}`,
  };
  const fieldBase: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    background: C.white,
    border: `2px solid ${C.sandDeep}`,
    borderRadius: 12,
    padding: '14px 18px',
    fontFamily: SANS,
    fontSize: 16,
    color: C.ink,
    outline: 'none',
    transition: 'border-color .3s',
    fontWeight: 400,
  };
  const labelStyle: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    color: C.azure,
    display: 'block',
    marginBottom: 8,
  };

  return (
    <section style={sec} id="bilan">
      {/* Décoration blob azur */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '-120px',
          right: '-120px',
          width: 480,
          height: 480,
          background: `radial-gradient(circle, ${C.azureLight}22 0%, transparent 70%)`,
          borderRadius: '50%',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: 760,
          margin: '0 auto',
        }}
      >
        <Reveal>
          <Eyebrow color={C.coral} align="center">
            Séance découverte
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(34px, 5vw, 68px)',
              fontWeight: 800,
              color: C.ink,
              margin: '18px 0 12px',
              lineHeight: 1.06,
              textAlign: 'center',
            }}
          >
            Ta première séance est{' '}
            <span style={{ color: C.azure }}>gratuite</span>
          </h2>
        </Reveal>
        <Reveal delay={0.14}>
          <p
            style={{fontFamily: SANS,
              fontSize: 'clamp(16px, 1.7vw, 19px)',
              lineHeight: 1.7,
              color: brand ?? '#4a5568',
              maxWidth: 540,
              margin: '0 auto 48px',
              textAlign: 'center',
              fontWeight: 400,
            }}
          >
            Remplis le formulaire ci-dessous. Je te recontacte sous 24h pour
            organiser ton bilan forme et ta première séance offerte.
          </p>
        </Reveal>

        {sent ? (
          <Reveal>
            <div
              style={{
                background: `linear-gradient(145deg, ${C.azure}, ${C.azureDeep})`,
                borderRadius: 24,
                padding: 'clamp(40px, 6vw, 64px)',
                textAlign: 'center',
                boxShadow: '0 32px 80px -28px rgba(0,119,182,0.45)',
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  background: 'rgba(255,255,255,0.15)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                }}
              >
                <Heart size={30} color={C.sand} strokeWidth={2} />
              </div>
              <h3
                style={{
                  fontFamily: SERIF,
                  fontSize: 32,
                  fontWeight: 800,
                  color: C.white,
                  margin: '0 0 14px',
                }}
              >
                Super {prenom}&nbsp;!
              </h3>
              <p
                style={{
                  fontFamily: SANS,
                  fontSize: 17,
                  color: 'rgba(255,255,255,0.86)',
                  margin: 0,
                  lineHeight: 1.6,
                  fontWeight: 400,
                }}
              >
                Ta demande pour <strong style={{ color: C.sand }}>{objectif}</strong>{' '}
                est bien reçue. Je te recontacte à{' '}
                <strong style={{ color: C.sand }}>{email}</strong> dans les 24h
                pour planifier ta séance découverte gratuite.
              </p>
              <div
                style={{
                  marginTop: 28,
                  fontFamily: SANS,
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.65)',
                }}
              >
                À très vite sur la Prom&apos; des Anglais
              </div>
            </div>
          </Reveal>
        ) : (
          <Reveal delay={0.2}>
            <form onSubmit={onSubmit}>
              <div
                style={{
                  background: C.white,
                  borderRadius: 24,
                  padding: 'clamp(32px, 5vw, 56px)',
                  boxShadow: '0 24px 60px -30px rgba(0,119,182,0.18)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 26,
                }}
              >
                {/* Prénom + Nom */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 20,
                  }}
                  className="r287-form-names"
                >
                  <div>
                    <label style={labelStyle} htmlFor="r287-prenom">
                      Prénom
                    </label>
                    <input
                      id="r287-prenom"
                      style={fieldBase}
                      value={prenom}
                      onChange={(e) => setPrenom(e.target.value)}
                      placeholder="Marie"
                      autoComplete="given-name"
                      required
                      onFocus={(e) =>
                        (e.currentTarget.style.borderColor = C.azure)
                      }
                      onBlur={(e) =>
                        (e.currentTarget.style.borderColor = C.sandDeep)
                      }
                    />
                  </div>
                  <div>
                    <label style={labelStyle} htmlFor="r287-nom">
                      Nom
                    </label>
                    <input
                      id="r287-nom"
                      style={fieldBase}
                      value={nom}
                      onChange={(e) => setNom(e.target.value)}
                      placeholder="Dupont"
                      autoComplete="family-name"
                      required
                      onFocus={(e) =>
                        (e.currentTarget.style.borderColor = C.azure)
                      }
                      onBlur={(e) =>
                        (e.currentTarget.style.borderColor = C.sandDeep)
                      }
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label style={labelStyle} htmlFor="r287-email">
                    Email
                  </label>
                  <input
                    id="r287-email"
                    style={fieldBase}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="marie@email.fr"
                    autoComplete="email"
                    required
                    onFocus={(e) =>
                      (e.currentTarget.style.borderColor = C.azure)
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderColor = C.sandDeep)
                    }
                  />
                </div>

                {/* Objectif */}
                <div>
                  <label style={labelStyle} htmlFor="r287-objectif">
                    Mon objectif
                  </label>
                  <select
                    id="r287-objectif"
                    style={{
                      ...fieldBase,
                      appearance: 'none',
                      WebkitAppearance: 'none',
                      cursor: 'pointer',
                      color: objectif ? C.ink : '#9ca3af',
                    }}
                    value={objectif}
                    onChange={(e) => setObjectif(e.target.value)}
                    required
                    onFocus={(e) =>
                      (e.currentTarget.style.borderColor = C.azure)
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderColor = C.sandDeep)
                    }
                  >
                    <option value="" style={{ color: '#9ca3af' }}>
                      Choisir un objectif…
                    </option>
                    <option value="Perte de poids" style={{ color: C.ink }}>
                      Perte de poids
                    </option>
                    <option value="Remise en forme" style={{ color: C.ink }}>
                      Remise en forme générale
                    </option>
                    <option value="Bien-être & anti-stress" style={{ color: C.ink }}>
                      Bien-être & anti-stress
                    </option>
                    <option value="Running & endurance" style={{ color: C.ink }}>
                      Running & endurance
                    </option>
                    <option value="Yoga & souplesse" style={{ color: C.ink }}>
                      Yoga & souplesse
                    </option>
                  </select>
                </div>

                {/* Disponibilité */}
                <div>
                  <label style={labelStyle} htmlFor="r287-dispo">
                    Mes disponibilités
                  </label>
                  <select
                    id="r287-dispo"
                    style={{
                      ...fieldBase,
                      appearance: 'none',
                      WebkitAppearance: 'none',
                      cursor: 'pointer',
                      color: dispo ? C.ink : '#9ca3af',
                    }}
                    value={dispo}
                    onChange={(e) => setDispo(e.target.value)}
                    required
                    onFocus={(e) =>
                      (e.currentTarget.style.borderColor = C.azure)
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderColor = C.sandDeep)
                    }
                  >
                    <option value="" style={{ color: '#9ca3af' }}>
                      Choisir une plage horaire…
                    </option>
                    <option value="Matin (7h–12h)" style={{ color: C.ink }}>
                      Matin (7h–12h)
                    </option>
                    <option value="Soir (17h–20h)" style={{ color: C.ink }}>
                      Soir (17h–20h)
                    </option>
                    <option value="Week-end" style={{ color: C.ink }}>
                      Week-end
                    </option>
                    <option value="Flexible" style={{ color: C.ink }}>
                      Flexible
                    </option>
                  </select>
                </div>

                <div style={{ textAlign: 'center', marginTop: 8 }}>
                  <button
                    type="submit"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '16px 40px',
                      fontFamily: SANS,
                      fontSize: 14,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: 'none',
                      borderRadius: 50,
                      background: C.coral,
                      color: C.white,
                      transition: 'all .4s cubic-bezier(.16,1,.3,1)',
                      boxShadow: '0 12px 32px -10px rgba(224,123,84,0.5)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = C.coralLight;
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = C.coral;
                      e.currentTarget.style.transform = 'none';
                    }}
                  >
                    Réserver ma séance gratuite
                    <ArrowRight size={16} />
                  </button>
                  <p
                    style={{
                      fontFamily: SANS,
                      fontSize: 13,
                      color: '#9ca3af',
                      marginTop: 16,
                      fontWeight: 400,
                    }}
                  >
                    Sans engagement · Réponse sous 24h · 100% gratuit
                  </p>
                </div>
              </div>
            </form>
          </Reveal>
        )}
      </div>
      <style>{`
        @media (max-width: 860px){
          .r287-form-names{ grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   7 · PlanningSection — cours de la semaine
   ════════════════════════════════════════════════════════════════════════════ */
type ClassItem = {
  day: string;
  dayShort: string;
  time: string;
  name: string;
  type: string;
  spots: number;
  icon: React.ReactNode;
};

const WEEKLY_CLASSES: ClassItem[] = [
  {
    day: 'Lundi',
    dayShort: 'LUN',
    time: '7h00 – 8h00',
    name: 'Yoga Flow',
    type: 'Yoga & mobilité',
    spots: 6,
    icon: <Wind size={20} color={C.azure} strokeWidth={2} />,
  },
  {
    day: 'Mardi',
    dayShort: 'MAR',
    time: '6h30 – 7h30',
    name: 'Running Prom\'',
    type: 'Running & cardio',
    spots: 8,
    icon: <Activity size={20} color={C.coral} strokeWidth={2} />,
  },
  {
    day: 'Jeudi',
    dayShort: 'JEU',
    time: '18h30 – 19h30',
    name: 'HIIT Outdoor',
    type: 'Circuit training',
    spots: 10,
    icon: <Sun size={20} color={C.coral} strokeWidth={2} />,
  },
  {
    day: 'Samedi',
    dayShort: 'SAM',
    time: '8h00 – 9h30',
    name: 'Boot Camp Plage',
    type: 'Collectif intense',
    spots: 12,
    icon: <Sunset size={20} color={C.azure} strokeWidth={2} />,
  },
  {
    day: 'Dimanche',
    dayShort: 'DIM',
    time: '9h00 – 12h00',
    name: 'Randonnée Nature',
    type: 'Marche & ressourcement',
    spots: 15,
    icon: <Mountain size={20} color={C.azure} strokeWidth={2} />,
  },
];

function PlanningSection() {
  const sec: React.CSSProperties = {
    background: C.ink,
    padding: 'clamp(88px, 12vw, 170px) clamp(24px, 6vw, 96px)',
  };

  return (
    <section style={sec} id="planning">
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <Reveal>
            <Eyebrow color={C.coral} align="center">
              Planning hebdomadaire
            </Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(34px, 5vw, 66px)',
                fontWeight: 800,
                color: C.white,
                margin: '18px 0 0',
                lineHeight: 1.06,
              }}
            >
              Cours de la{' '}
              <span style={{ color: C.azureLight }}>semaine</span>
            </h2>
          </Reveal>
          <Reveal delay={0.14}>
            <p
              style={{
                fontFamily: SANS,
                fontSize: 'clamp(15px, 1.6vw, 18px)',
                color: 'rgba(255,255,255,0.68)',
                maxWidth: 500,
                margin: '16px auto 0',
                lineHeight: 1.68,
                fontWeight: 400,
              }}
            >
              Sessions en groupe ou individuelles selon tes disponibilités.
              Inscriptions via message ou formulaire.
            </p>
          </Reveal>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          {WEEKLY_CLASSES.map((c, i) => (
            <PlanningRow key={c.day} item={c} i={i} />
          ))}
        </div>

        <Reveal delay={0.4}>
          <div style={{ textAlign: 'center', marginTop: 52 }}>
            <a href="#bilan" style={{ textDecoration: 'none' }}>
              <CoachButton variant="coral">
                Réserver une place
              </CoachButton>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function PlanningRow({ item, i }: { item: ClassItem; i: number }) {
  const [hover, setHover] = useState(false);

  return (
    <Reveal delay={i * 0.07}>
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          display: 'grid',
          gridTemplateColumns: '80px 1fr auto',
          gap: 24,
          alignItems: 'center',
          background: hover
            ? 'rgba(255,255,255,0.08)'
            : 'rgba(255,255,255,0.04)',
          border: `1px solid ${hover ? 'rgba(72,202,228,0.35)' : 'rgba(255,255,255,0.08)'}`,
          borderRadius: 16,
          padding: 'clamp(18px, 2.5vw, 26px) clamp(20px, 3vw, 36px)',
          transition: 'all .35s cubic-bezier(.16,1,.3,1)',
          cursor: 'pointer',
        }}
        className="r287-plan-row"
      >
        {/* Jour */}
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontFamily: SANS,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: C.azureLight,
              marginBottom: 4,
            }}
          >
            {item.dayShort}
          </div>
          <div
            style={{
              fontFamily: SANS,
              fontSize: 12,
              color: 'rgba(255,255,255,0.5)',
              fontWeight: 400,
            }}
          >
            {item.time}
          </div>
        </div>

        {/* Infos cours */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 44,
              height: 44,
              background: 'rgba(255,255,255,0.06)',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {item.icon}
          </div>
          <div>
            <div
              style={{
                fontFamily: SERIF,
                fontSize: 20,
                fontWeight: 800,
                color: C.white,
                lineHeight: 1.2,
              }}
            >
              {item.name}
            </div>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 12,
                color: 'rgba(255,255,255,0.55)',
                marginTop: 3,
                fontWeight: 500,
                letterSpacing: '0.06em',
              }}
            >
              {item.type}
            </div>
          </div>
        </div>

        {/* Places dispo */}
        <div style={{ textAlign: 'right' }}>
          <div
            style={{
              fontFamily: SERIF,
              fontWeight: 800,
              fontSize: 22,
              color: C.sand,
              lineHeight: 1,
            }}
          >
            {item.spots}
          </div>
          <div
            style={{
              fontFamily: SANS,
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.45)',
              marginTop: 4,
            }}
          >
            places
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 860px){
          .r287-plan-row{ grid-template-columns: 60px 1fr !important; }
          .r287-plan-row > :last-child{ display: none !important; }
        }
      `}</style>
    </Reveal>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   8 · OutdoorSection — séances emblématiques de Nice
   ════════════════════════════════════════════════════════════════════════════ */
type OutdoorSpot = {
  name: string;
  subtitle: string;
  description: string;
  emoji_alt: string;
  icon: React.ReactNode;
};

const OUTDOOR_SPOTS: OutdoorSpot[] = [
  {
    name: "Prom' des Anglais",
    subtitle: 'Running & cardio face à la mer',
    description:
      "7 km de perspective bleue à perte de vue. Le terrain de running le plus inspirant de la Méditerranée. Séances cardio, fartlek et sorties longues.",
    emoji_alt: 'Promenade',
    icon: <Activity size={28} color={C.azure} strokeWidth={1.8} />,
  },
  {
    name: 'Colline du Château',
    subtitle: 'HIIT & renforcement avec vue',
    description:
      'Montées explosives, circuits au sommet, descente active. Une vue panoramique sur la Baie des Anges comme récompense. Intensité garantie.',
    emoji_alt: 'Château',
    icon: <Mountain size={28} color={C.coral} strokeWidth={1.8} />,
  },
  {
    name: 'Parc Phoenix',
    subtitle: 'Yoga, mobilité & stretching',
    description:
      'Au cœur du parc, entre palmiers et bassins. Un cadre serein pour le yoga en plein air, la mobilité et les séances de récupération active.',
    emoji_alt: 'Parc',
    icon: <Wind size={28} color={C.azure} strokeWidth={1.8} />,
  },
  {
    name: 'Col de Vence',
    subtitle: 'Randonnée & trail découverte',
    description:
      "Montée jusqu'au col avec vue sur mer et arrière-pays. Effort progressif, air pur, paysages préalpins spectaculaires. Randonnée dominicale.",
    emoji_alt: 'Col',
    icon: <Sun size={28} color={C.coral} strokeWidth={1.8} />,
  },
];

function OutdoorSection() {
  const sec: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    background: C.paper,
    padding: 'clamp(88px, 12vw, 170px) clamp(24px, 6vw, 96px)',
  };

  return (
    <section style={sec} id="outdoor">
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        {/* Header + image plein cadre */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'clamp(36px, 6vw, 80px)',
            alignItems: 'center',
            marginBottom: 'clamp(64px, 9vw, 120px)',
          }}
          className="r287-outdoor-header"
        >
          <div>
            <Reveal>
              <Eyebrow color={C.azure}>Séances emblématiques</Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              <h2
                style={{
                  fontFamily: SERIF,
                  fontSize: 'clamp(34px, 5vw, 66px)',
                  fontWeight: 800,
                  color: C.ink,
                  margin: '18px 0 20px',
                  lineHeight: 1.06,
                }}
              >
                Nice comme{' '}
                <span style={{ color: C.coral }}>terrain de jeu</span>
              </h2>
            </Reveal>
            <Reveal delay={0.14}>
              <p
                style={{fontFamily: SANS,
                  fontSize: 'clamp(15px, 1.6vw, 18px)',
                  color: brand ?? '#4a5568',
                  lineHeight: 1.72,
                  fontWeight: 400,
                  maxWidth: 420,
                }}
              >
                La Côte d&apos;Azur offre des spots de coaching uniques en
                Europe. Chaque séance est pensée pour exploiter le décor naturel
                et rendre l&apos;effort mémorable.
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.1} y={40}>
            <div
              style={{
                borderRadius: 20,
                overflow: 'hidden',
                aspectRatio: '4 / 3',
                boxShadow: '0 32px 80px -28px rgba(0,119,182,0.25)',
              }}
            >
              <ParallaxImg
                src={PHOTO.outdoor}
                alt="Séance outdoor sur la Côte d'Azur"
              />
            </div>
          </Reveal>
        </div>

        {/* Grille des spots */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 'clamp(18px, 2.5vw, 32px)',
          }}
          className="r287-outdoor-grid"
        >
          {OUTDOOR_SPOTS.map((s, i) => (
            <OutdoorSpotCard key={s.name} spot={s} i={i} />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 860px){
          .r287-outdoor-header{ grid-template-columns: 1fr !important; }
          .r287-outdoor-grid{ grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 500px){
          .r287-outdoor-grid{ grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

function OutdoorSpotCard({ spot, i }: { spot: OutdoorSpot; i: number }) {
  const [hover, setHover] = useState(false);

  return (
    <Reveal delay={i * 0.09}>
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          background: hover ? C.azure : C.white,
          border: `2px solid ${hover ? C.azure : C.sandDeep}`,
          borderRadius: 20,
          padding: 'clamp(24px, 3vw, 36px)',
          transition: 'all .45s cubic-bezier(.16,1,.3,1)',
          cursor: 'pointer',
          boxShadow: hover
            ? '0 24px 60px -24px rgba(0,119,182,0.45)'
            : '0 4px 24px -12px rgba(0,0,0,0.08)',
          transform: hover ? 'translateY(-6px)' : 'none',
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            background: hover ? 'rgba(255,255,255,0.14)' : C.sandLight,
            borderRadius: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
            transition: 'background .4s',
          }}
        >
          {React.cloneElement(spot.icon as React.ReactElement<{ color?: string }>, {
            color: hover ? C.white : undefined,
          })}
        </div>
        <div
          style={{
            fontFamily: SANS,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: hover ? 'rgba(255,255,255,0.72)' : C.coral,
            marginBottom: 10,
            transition: 'color .4s',
          }}
        >
          {spot.subtitle}
        </div>
        <h3
          style={{
            fontFamily: SERIF,
            fontSize: 'clamp(18px, 2vw, 23px)',
            fontWeight: 800,
            color: hover ? C.white : C.ink,
            margin: '0 0 12px',
            transition: 'color .4s',
          }}
        >
          {spot.name}
        </h3>
        <p
          style={{
            fontFamily: SANS,
            fontSize: 14,
            lineHeight: 1.68,
            color: hover ? 'rgba(255,255,255,0.82)' : '#4a5568',
            margin: 0,
            fontWeight: 400,
            transition: 'color .4s',
          }}
        >
          {spot.description}
        </p>
      </div>
    </Reveal>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   9 · NutritionSection — 3 principes méditerranéens + image plats sains
   ════════════════════════════════════════════════════════════════════════════ */
type NutritionPrinciple = {
  number: string;
  title: string;
  body: string;
  color: string;
};

const NUTRITION_PRINCIPLES: NutritionPrinciple[] = [
  {
    number: '01',
    title: 'Vrais aliments, circuits courts',
    body: "Légumes du marché provençal, poissons de Méditerranée, huile d'olive extra-vierge, herbes aromatiques fraîches. La base de chaque repas est locale et non transformée.",
    color: C.azure,
  },
  {
    number: '02',
    title: 'Protéines & légumineuses',
    body: "Poulet rôti aux herbes, sardines grillées, pois chiches à l'harissa, lentilles corail. Des protéines variées pour soutenir la récupération musculaire et la satiété durable.",
    color: C.coral,
  },
  {
    number: '03',
    title: 'Plaisir sans culpabilité',
    body: "La diète méditerranéenne n'est pas une privation. Un verre de rosé, une tartelette aux figues — l'équilibre est la clé. On mange bien, on vit mieux.",
    color: C.azure,
  },
];

function NutritionSection() {
  const sec: React.CSSProperties = {
    background: `linear-gradient(160deg, ${C.azureDeep} 0%, ${C.ink} 100%)`,
    padding: 'clamp(88px, 12vw, 170px) clamp(24px, 6vw, 96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1.1fr 0.9fr',
    gap: 'clamp(44px, 7vw, 100px)',
    maxWidth: 1240,
    margin: '0 auto',
    alignItems: 'center',
  };

  return (
    <section style={sec} id="nutrition">
      <div style={grid} className="r287-nutrition">
        {/* Texte gauche */}
        <div>
          <Reveal>
            <Eyebrow color={C.sand}>Nutrition méditerranéenne</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(32px, 4.8vw, 64px)',
                fontWeight: 800,
                color: C.white,
                margin: '18px 0 44px',
                lineHeight: 1.06,
              }}
            >
              Manger{' '}
              <span style={{ color: C.sand }}>comme on vit</span> — avec joie
            </h2>
          </Reveal>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {NUTRITION_PRINCIPLES.map((p, i) => (
              <Reveal key={p.number} delay={0.08 + i * 0.1}>
                <div
                  style={{
                    padding: '30px 0',
                    borderTop: '1px solid rgba(255,255,255,0.12)',
                    display: 'flex',
                    gap: 24,
                    alignItems: 'flex-start',
                  }}
                >
                  <span
                    style={{
                      fontFamily: SERIF,
                      fontWeight: 800,
                      fontSize: 38,
                      color: `${p.color}55`,
                      lineHeight: 1,
                      minWidth: 54,
                      flexShrink: 0,
                    }}
                  >
                    {p.number}
                  </span>
                  <div>
                    <h3
                      style={{
                        fontFamily: SERIF,
                        fontSize: 21,
                        fontWeight: 800,
                        color: C.white,
                        margin: '0 0 10px',
                        lineHeight: 1.25,
                      }}
                    >
                      {p.title}
                    </h3>
                    <p
                      style={{
                        fontFamily: SANS,
                        fontSize: 15,
                        lineHeight: 1.72,
                        color: 'rgba(255,255,255,0.72)',
                        margin: 0,
                        fontWeight: 400,
                      }}
                    >
                      {p.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Image droite */}
        <Reveal delay={0.14} y={40}>
          <div>
            <div
              style={{
                borderRadius: 20,
                overflow: 'hidden',
                aspectRatio: '3 / 4',
                boxShadow: '0 40px 90px -32px rgba(0,0,0,0.55)',
              }}
            >
              <img
                src={PHOTO.nutrition}
                alt="Assiette de cuisine méditerranéenne saine et colorée"
                loading="lazy"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </div>
            <div
              style={{
                marginTop: 24,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 16,
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
              }}
            >
              <Heart size={24} color={C.coral} strokeWidth={2} />
              <p
                style={{
                  fontFamily: SANS,
                  fontSize: 14,
                  color: 'rgba(255,255,255,0.80)',
                  margin: 0,
                  lineHeight: 1.5,
                  fontStyle: 'italic',
                  fontWeight: 400,
                }}
              >
                &ldquo;La diète méditerranéenne réduit de 30% le risque
                cardio-vasculaire. Et c&apos;est délicieux.&rdquo;
              </p>
            </div>
          </div>
        </Reveal>
      </div>

      <style>{`
        @media (max-width: 860px){
          .r287-nutrition{ grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   10 · FooterSection — logo, Instagram, certifications, mentions légales
   ════════════════════════════════════════════════════════════════════════════ */
function FooterSection() {
  const foot: React.CSSProperties = {
    background: C.ink,
    borderTop: `1px solid rgba(255,255,255,0.08)`,
    padding: 'clamp(60px, 9vw, 110px) clamp(24px, 6vw, 96px) 36px',
  };

  const cols: { title: string; items: { label: string; href: string }[] }[] = [
    {
      title: 'Services',
      items: [
        { label: 'Coaching outdoor', href: '#programmes' },
        { label: 'Yoga & mobilité', href: '#programmes' },
        { label: 'Running & cardio', href: '#programmes' },
        { label: 'Nutrition', href: '#nutrition' },
      ],
    },
    {
      title: 'Spots Nice',
      items: [
        { label: "Prom' des Anglais", href: '#outdoor' },
        { label: 'Colline du Château', href: '#outdoor' },
        { label: 'Parc Phoenix', href: '#outdoor' },
        { label: 'Col de Vence', href: '#outdoor' },
      ],
    },
    {
      title: 'Infos',
      items: [
        { label: 'Planning cours', href: '#planning' },
        { label: 'Témoignages', href: '#temoignages' },
        { label: 'Séance gratuite', href: '#bilan' },
        { label: 'Mentions légales', href: '#hero' },
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
          gridTemplateColumns: '1.5fr repeat(3, 1fr)',
          gap: 'clamp(36px, 5vw, 70px)',
        }}
        className="r287-footgrid"
      >
        {/* Brand */}
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 18,
            }}
          >
            <Sun size={26} color={C.coral} strokeWidth={2} />
            <div>
              <div
                style={{
                  fontFamily: SERIF,
                  fontSize: 18,
                  fontWeight: 800,
                  color: C.white,
                  lineHeight: 1.2,
                }}
              >{fd?.businessName ?? "Côte d'Azur Coaching"}</div>
              <div
                style={{
                  fontFamily: SANS,
                  fontSize: 11,
                  color: 'rgba(255,255,255,0.5)',
                  letterSpacing: '0.08em',
                  fontWeight: 400,
                }}
              >
                Nice Promenade
              </div>
            </div>
          </div>

          <p
            style={{
              fontFamily: SANS,
              fontSize: 14,
              lineHeight: 1.7,
              color: 'rgba(255,255,255,0.6)',
              maxWidth: 300,
              margin: '0 0 24px',
              fontWeight: 400,
            }}
          >
            Coach bien-être & remise en forme certifié BPJEPS/CQP. Séances
            outdoor sur les plus beaux spots de la Côte d&apos;Azur.
          </p>

          {/* Localisation */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 20,
              fontFamily: SANS,
              fontSize: 13,
              color: 'rgba(255,255,255,0.55)',
              fontWeight: 400,
            }}
          >
            <MapPin size={15} color={C.coral} strokeWidth={2} />
            Nice, Côte d&apos;Azur — 06000
          </div>

          {/* Instagram */}
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 18px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 50,
              fontFamily: SANS,
              fontSize: 13,
              fontWeight: 700,
              color: C.white,
              textDecoration: 'none',
              transition: 'background .3s',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')
            }
          >
            <Camera size={16} strokeWidth={2} />
            @cotedazurcoaching
          </a>

          {/* Certifications */}
          <div
            style={{
              marginTop: 24,
              display: 'flex',
              gap: 10,
              flexWrap: 'wrap',
            }}
          >
            {['BPJEPS', 'CQP', 'FFTri'].map((cert) => (
              <span
                key={cert}
                style={{
                  fontFamily: SANS,
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: C.azureLight,
                  background: 'rgba(72,202,228,0.12)',
                  border: '1px solid rgba(72,202,228,0.25)',
                  borderRadius: 8,
                  padding: '5px 10px',
                }}
              >
                {cert}
              </span>
            ))}
          </div>
        </div>

        {/* Colonnes liens */}
        {cols.map((c) => (
          <div key={c.title}>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 10.5,
                fontWeight: 700,
                letterSpacing: '0.26em',
                textTransform: 'uppercase',
                color: C.coral,
                marginBottom: 20,
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
                      fontSize: 14,
                      color: 'rgba(255,255,255,0.64)',
                      textDecoration: 'none',
                      fontWeight: 400,
                      transition: 'color .25s',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = C.white)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = 'rgba(255,255,255,0.64)')
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

      {/* Barre basse */}
      <div
        style={{
          maxWidth: 1240,
          margin: '56px auto 0',
          paddingTop: 24,
          borderTop: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 14,
          fontFamily: SANS,
          fontSize: 12,
          color: 'rgba(255,255,255,0.42)',
          fontWeight: 400,
        }}
      >
        <span>
          © 2026 Côte d&apos;Azur Coaching · Thomas Morel · Coach diplômé
          d&apos;État
        </span>
        <span style={{ display: 'flex', gap: 20 }}>
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
            Confidentialité
          </a>
          <a
            href="#hero"
            style={{ color: 'inherit', textDecoration: 'none' }}
          >
            CGU
          </a>
        </span>
      </div>

      <style>{`
        @media (max-width: 860px){
          .r287-footgrid{ grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 500px){
          .r287-footgrid{ grid-template-columns: 1fr !important; }
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
export default function Impact287Page() {
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
    background: C.paper,
    color: C.ink,
    fontFamily: SANS,
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
    <main id="hero" style={root} suppressHydrationWarning>
      <Nav />
      <HeroSection />
      <ScrollCrossfade />
      <ProgramsSection />
      <MethodSection />
      <TransformationSection />
      <BilanFormSection />
      <PlanningSection />
      <OutdoorSection />
      <NutritionSection />
      <FooterSection />
    </main>
  );
}
