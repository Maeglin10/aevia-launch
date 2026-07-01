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
import {
  ArrowRight,
  Award,
  Battery,
  Car,
  CheckCircle,
  ChevronDown,
  Home,
  MapPin,
  Phone,
  Send,
  Shield,
  Star,
  Sun,
  Wrench,
  Zap,
  ZapOff,
} from 'lucide-react';

/* ════════════════════════════════════════════════════════════════════════════
   AMPÈRE & FILS — Électricien artisan · Nantes & Loire-Atlantique
   Template premium calqué sur impact-218. Auto-suffisant. 'use client'.
   10 sous-composants : Hero · Crossfade · Services · Process · Testimonials
                        DevisForm · IRVE · Solaire · Certif · Footer
   ════════════════════════════════════════════════════════════════════════════ */

/* ── Palette ─────────────────────────────────────────────────────────────── */
const C = {
  navy: '#1b2a4a',
  navyDeep: '#111d35',
  navyMid: '#243660',
  green: '#00b894',
  greenLight: '#00d4aa',
  greenDim: 'rgba(0,184,148,0.18)',
  white: '#ffffff',
  gray: '#f0f0f0',
  grayDark: '#d8d8d8',
  ink: '#0e1929',
  muted: 'rgba(27,42,74,0.55)',
} as const;

/* ── Typographie ─────────────────────────────────────────────────────────── */
const SERIF = "'Poppins', system-ui, sans-serif" as const;
const SANS = "'Roboto', system-ui, sans-serif" as const;

/* ── Easing partagé ──────────────────────────────────────────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ── Photos Unsplash ─────────────────────────────────────────────────────── */
const PHOTO = {
  tableau:
    'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1600&auto=format&fit=crop',
  technicien:
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1600&auto=format&fit=crop',
  solaire:
    'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=1600&auto=format&fit=crop',
  borne:
    'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=1600&auto=format&fit=crop',
} as const;

/* ════════════════════════════════════════════════════════════════════════════
   Primitives partagées
   ════════════════════════════════════════════════════════════════════════════ */

/** Étiquette fine capitales vert électrique + filet */
function Eyebrow({
  children,
  color = C.green,
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
    borderRadius: 2,
    opacity: 0.8,
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

/** Révélation au scroll — fondu + translation verticale, une seule fois */
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

/** Bouton vert électrique, contour fin, flèche animée au survol */
function GreenButton({
  children,
  onClick,
  filled = false,
  type = 'button',
  small = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  filled?: boolean;
  type?: 'button' | 'submit';
  small?: boolean;
}) {
  const [hover, setHover] = useState(false);
  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 10,
    padding: small ? '11px 22px' : '15px 32px',
    fontFamily: SANS,
    fontSize: small ? 12 : 13,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    fontWeight: 700,
    cursor: 'pointer',
    border: `2px solid ${C.green}`,
    borderRadius: 4,
    background: filled ? C.green : 'transparent',
    color: filled ? C.white : C.green,
    transition: 'all .45s cubic-bezier(.16,1,.3,1)',
    textDecoration: 'none',
  };
  const hov: React.CSSProperties = hover
    ? filled
      ? { background: C.greenLight, borderColor: C.greenLight, transform: 'translateY(-2px)', boxShadow: `0 12px 32px ${C.green}44` }
      : { background: C.greenDim, transform: 'translateY(-2px)', boxShadow: `0 8px 24px ${C.green}22` }
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
        size={small ? 13 : 16}
        style={{
          transform: hover ? 'translateX(5px)' : 'none',
          transition: 'transform .45s cubic-bezier(.16,1,.3,1)',
        }}
      />
    </button>
  );
}

/** Étoiles de notation */
function Stars({ n = 5 }: { n?: number }) {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={15}
          fill={i < n ? C.green : 'none'}
          color={i < n ? C.green : C.grayDark}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   Navigation fixe — transparente → solide au défilement
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
    { label: 'Services', href: '#services' },
    { label: 'IRVE', href: '#irve' },
    { label: 'Solaire', href: '#solaire' },
    { label: 'Certifications', href: '#certif' },
    { label: 'Contact', href: '#devis' },
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
    padding: solid ? '14px clamp(20px,5vw,60px)' : '24px clamp(20px,5vw,60px)',
    background: solid ? 'rgba(17,29,53,0.94)' : 'transparent',
    backdropFilter: solid ? 'blur(16px) saturate(130%)' : 'none',
    WebkitBackdropFilter: solid ? 'blur(16px) saturate(130%)' : 'none',
    borderBottom: solid ? `1px solid rgba(0,184,148,0.18)` : '1px solid transparent',
    transition: 'all .55s cubic-bezier(.16,1,.3,1)',
  };
  const brand: React.CSSProperties = {
    fontFamily: SERIF,
    fontSize: 20,
    letterSpacing: '0.08em',
    color: C.white,
    fontWeight: 700,
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
        <Zap size={20} color={C.green} strokeWidth={2.5} />
        Ampère&nbsp;&amp;&nbsp;Fils
      </a>
      <div style={linkRow} className="r288-navlinks">
        {links.map((l) => (
          <NavLink key={l.label} label={l.label} href={l.href} />
        ))}
      </div>
      <div className="r288-navcta">
        <a href="#devis" style={{ textDecoration: 'none' }}>
          <GreenButton filled small>Devis gratuit</GreenButton>
        </a>
      </div>
      
        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="r288-burger"
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
          .r288-navlinks{ display:none !important; }
          .r288-burger { display: flex !important; flex-direction: column; }
          .r288-navcta{ display:none !important; }
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
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        color: h ? C.green : 'rgba(255,255,255,0.88)',
        textDecoration: 'none',
        transition: 'color .35s',
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
          height: 2,
          width: h ? '100%' : '0%',
          background: C.green,
          borderRadius: 2,
          transition: 'width .45s cubic-bezier(.16,1,.3,1)',
        }}
      />
    </a>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   1 · HERO SECTION
   Fond bleu nuit, tableau de distribution, titre, sous-titre, CTA devis
   ════════════════════════════════════════════════════════════════════════════ */
function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.10]);
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '14%']);
  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '-40%']);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const section: React.CSSProperties = {
    position: 'relative',
    height: '100vh',
    minHeight: 660,
    overflow: 'hidden',
    background: C.navyDeep,
  };

  return (
    <section id="hero" ref={ref} style={section}>
      {/* Photo tableau de distribution */}
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
          src={PHOTO.tableau}
          alt="Tableau de distribution électrique Ampère et Fils"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          priority-fetch="true"
        />
      </motion.div>

      {/* Voiles : gradient sombre + teinte navy */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(17,29,53,0.55) 0%, rgba(17,29,53,0.10) 35%, rgba(17,29,53,0.50) 68%, rgba(17,29,53,0.93) 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(130% 80% at 50% 25%, transparent 38%, rgba(27,42,74,0.50) 100%)',
          mixBlendMode: 'multiply',
        }}
      />
      {/* Accent vert sur les côtés */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(105deg, rgba(0,184,148,0.08) 0%, transparent 45%, transparent 55%, rgba(0,184,148,0.06) 100%)',
        }}
      />

      {/* Contenu principal avec parallaxe */}
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
          padding: '80px 24px 24px',
          y: titleY,
          opacity: titleOpacity,
        }}
      >
        <Reveal y={18}>
          <Eyebrow color={C.green} align="center">
            Artisan électricien · Depuis 1989
          </Eyebrow>
        </Reveal>

        <motion.h1
          initial={{ opacity: 0, y: 44 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3, ease: EASE, delay: 0.12 }}
          style={{
            fontFamily: SERIF,
            fontWeight: 700,
            color: C.white,
            fontSize: 'clamp(46px, 8.5vw, 128px)',
            lineHeight: 0.98,
            letterSpacing: '-0.02em',
            margin: '28px 0 20px',
            textShadow: '0 12px 60px rgba(0,0,0,0.55)',
          }}
        >
          L&apos;électricité{' '}
          <span
            style={{
              color: C.green,
              display: 'block',
            }}
          >
            de confiance
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.40 }}
          style={{
            fontFamily: SANS,
            fontSize: 'clamp(15px, 1.8vw, 20px)',
            color: 'rgba(255,255,255,0.82)',
            maxWidth: 580,
            lineHeight: 1.65,
            fontWeight: 400,
            marginBottom: 0,
          }}
        >
          Installations électriques, bornes IRVE et panneaux photovoltaïques à
          Nantes et partout en Loire-Atlantique. Certifié RGE, QualiPV, Qualifelec.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.65 }}
          style={{ marginTop: 44, display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <a href="#devis" style={{ textDecoration: 'none' }}>
            <GreenButton filled>Devis gratuit</GreenButton>
          </a>
          <a href={`tel:${fd?.phone ?? "0240000000"}`} style={{ textDecoration: 'none' }}>
            <GreenButton>
              <Phone size={15} />
              02 40 00 00 00
            </GreenButton>
          </a>
        </motion.div>

        {/* Bandeau chiffres clés */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.9 }}
          style={{
            marginTop: 60,
            display: 'flex',
            gap: 'clamp(24px,5vw,72px)',
            flexWrap: 'wrap',
            justifyContent: 'center',
            borderTop: '1px solid rgba(255,255,255,0.12)',
            paddingTop: 32,
          }}
        >
          {[
            { v: '+35 ans', l: "d'expérience" },
            { v: '1 200+', l: 'chantiers réalisés' },
            { v: '100%', l: 'certifié RGE' },
          ].map((s) => (
            <div key={s.l} style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontFamily: SERIF,
                  fontWeight: 700,
                  fontSize: 'clamp(26px,4vw,44px)',
                  color: C.green,
                  lineHeight: 1,
                }}
              >
                {s.v}
              </div>
              <div
                style={{
                  fontFamily: SANS,
                  fontSize: 12,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.60)',
                  marginTop: 6,
                  fontWeight: 500,
                }}
              >
                {s.l}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Cue de défilement */}
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
            letterSpacing: '0.34em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.55)',
            fontWeight: 500,
          }}
        >
          Découvrir
        </span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2.0, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={20} color={C.green} strokeWidth={2} />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   2 · SCROLL CROSSFADE — 320vh sticky, 3 visuels
   Installation tableau / Borne recharge / Solaire photovoltaïque
   ════════════════════════════════════════════════════════════════════════════ */
type CrossfadeSlide = {
  src: string;
  alt: string;
  index: string;
  title: string;
  sub: string;
};

const SLIDES: CrossfadeSlide[] = [
  {
    src: PHOTO.tableau,
    alt: 'Installation tableau électrique Ampère et Fils',
    index: '01',
    title: 'Installation & rénovation',
    sub: 'Mise aux normes NF C 15-100, tableaux modulaires, câblage neuf ou rénovation complète.',
  },
  {
    src: PHOTO.borne,
    alt: 'Borne de recharge véhicule électrique IRVE',
    index: '02',
    title: 'Borne IRVE recharge VE',
    sub: 'Installation de bornes de recharge pour véhicules électriques — particuliers, copropriétés, entreprises.',
  },
  {
    src: PHOTO.solaire,
    alt: 'Panneaux solaires photovoltaïques installation Loire-Atlantique',
    index: '03',
    title: 'Solaire & photovoltaïque',
    sub: "Poses de panneaux photovoltaïques, autoconsommation, revente EDF, aides MaPrimeRénov'.",
  },
];

function SlideImage({
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

function SlideCaption({
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
        padding: '0 24px',
        opacity,
        y,
      }}
    >
      <span
        style={{
          fontFamily: SERIF,
          fontWeight: 700,
          fontSize: 'clamp(36px,8vw,108px)',
          color: 'rgba(0,184,148,0.22)',
          lineHeight: 1,
          marginBottom: 4,
        }}
      >
        {slide.index}
      </span>
      <h2
        style={{
          fontFamily: SERIF,
          fontSize: 'clamp(36px,6.5vw,88px)',
          fontWeight: 700,
          color: C.white,
          lineHeight: 1.05,
          margin: 0,
          textShadow: '0 8px 40px rgba(0,0,0,0.60)',
        }}
      >
        {slide.title}
      </h2>
      <p
        style={{
          fontFamily: SANS,
          fontSize: 'clamp(14px, 1.7vw, 19px)',
          color: 'rgba(255,255,255,0.82)',
          marginTop: 18,
          maxWidth: 480,
          lineHeight: 1.65,
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
    [0.28, 1, 1, 0.28],
  );
  const width = useTransform(progress, [i * seg, (i + 1) * seg], [10, 36]);
  return (
    <motion.div
      style={{ height: 3, width, background: C.green, opacity, borderRadius: 3 }}
    />
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
      style={{ height: '100vh', overflow: 'hidden', position: 'relative', background: C.navyDeep }}
    >
      <div
        style={{
          position: 'relative',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {SLIDES.map((s, i) => (
          <SlideImage
            key={s.index}
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
              'linear-gradient(to bottom, rgba(17,29,53,0.32), rgba(17,29,53,0.08) 40%, rgba(17,29,53,0.66))',
          }}
        />

        {SLIDES.map((s, i) => (
          <SlideCaption
            key={s.index}
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
            bottom: 42,
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
   3 · SERVICES SECTION — 3 spécialités avec icônes Lucide
   Installation & rénovation / Bornes IRVE / Solaire photovoltaïque
   ════════════════════════════════════════════════════════════════════════════ */
const SERVICES = [
  {
    icon: Zap,
    title: 'Installation & rénovation',
    subtitle: 'Électricité générale',
    desc: "Mise aux normes NF C 15-100, création ou rénovation complète de l'installation électrique. Tableaux de répartition, prises, éclairage, VMC, domotique.",
    items: [
      'Audit et diagnostic électrique',
      'Tableau modulaire dernière génération',
      'Câblage neuf ou reprise existant',
      'Éclairage LED et domotique',
    ],
  },
  {
    icon: Car,
    title: 'Bornes IRVE recharge VE',
    subtitle: 'Véhicule électrique',
    desc: "Installation et maintenance de bornes de recharge pour véhicules électriques. Agréé IRVE P1/P2/P3 — pour particuliers, copropriétés et entreprises.",
    items: [
      'Étude technique et devis offert',
      'Wallbox, Schneider, Legrand',
      'Aide ADVENIR jusqu\'à 50 %',
      'Garantie 2 ans pièces et main-d\'œuvre',
    ],
  },
  {
    icon: Sun,
    title: 'Solaire & photovoltaïque',
    subtitle: 'Énergie renouvelable',
    desc: "Pose de panneaux photovoltaïques, autoconsommation avec ou sans revente du surplus. Certifié QualiPV — aides MaPrimeRénov' et TVA à 10 %.",
    items: [
      'Bilan de production personnalisé',
      'Panneaux monocristallins A+',
      'Micro-onduleurs ou onduleur central',
      "MaPrimeRénov' jusqu'à 1 000 €",
    ],
  },
] as const;

function ServiceCard({
  svc,
  i,
}: {
  svc: (typeof SERVICES)[number];
  i: number;
}) {
  const [hover, setHover] = useState(false);
  const Icon = svc.icon;

  const card: React.CSSProperties = {
    background: hover ? C.navy : C.white,
    border: `1.5px solid ${hover ? C.green : C.grayDark}`,
    borderRadius: 8,
    padding: 'clamp(28px,3vw,44px)',
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
    transition: 'all .5s cubic-bezier(.16,1,.3,1)',
    cursor: 'default',
    boxShadow: hover
      ? `0 32px 72px -24px rgba(0,184,148,0.22)`
      : '0 4px 24px -8px rgba(27,42,74,0.08)',
    transform: hover ? 'translateY(-8px)' : 'none',
    height: '100%',
  };

  return (
    <Reveal delay={i * 0.12} style={{ height: '100%' }}>
      <article
        style={card}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {/* Icône */}
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 12,
            background: hover ? C.greenDim : `${C.green}18`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 22,
            transition: 'background .4s',
          }}
        >
          <Icon size={26} color={C.green} strokeWidth={2} />
        </div>

        <div
          style={{
            fontFamily: SANS,
            fontSize: 11,
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: C.green,
            fontWeight: 600,
            marginBottom: 8,
          }}
        >
          {svc.subtitle}
        </div>

        <h3
          style={{
            fontFamily: SERIF,
            fontWeight: 700,
            fontSize: 'clamp(20px,2vw,26px)',
            color: hover ? C.white : C.navy,
            margin: '0 0 14px',
            lineHeight: 1.2,
            transition: 'color .4s',
          }}
        >
          {svc.title}
        </h3>

        <p
          style={{
            fontFamily: SANS,
            fontSize: 14.5,
            color: hover ? 'rgba(255,255,255,0.75)' : C.muted,
            lineHeight: 1.7,
            margin: '0 0 22px',
            transition: 'color .4s',
          }}
        >
          {svc.desc}
        </p>

        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {svc.items.map((it) => (
            <li
              key={it}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                fontFamily: SANS,
                fontSize: 13.5,
                color: hover ? 'rgba(255,255,255,0.82)' : C.ink,
                lineHeight: 1.5,
                transition: 'color .4s',
              }}
            >
              <CheckCircle
                size={15}
                color={C.green}
                strokeWidth={2}
                style={{ flexShrink: 0, marginTop: 2 }}
              />
              {it}
            </li>
          ))}
        </ul>
      </article>
    </Reveal>
  );
}

function ServicesSection() {
  return (
    <section
      id="services"
      style={{
        background: C.gray,
        padding: 'clamp(80px,12vw,160px) clamp(24px,6vw,80px)',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Reveal>
          <Eyebrow align="center">Nos expertises</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontWeight: 700,
              fontSize: 'clamp(32px,5vw,64px)',
              color: C.navy,
              textAlign: 'center',
              margin: '18px 0 14px',
              lineHeight: 1.1,
            }}
          >
            Trois spécialités,
            <br />
            <span style={{ color: C.green }}>un seul artisan de confiance</span>
          </h2>
        </Reveal>
        <Reveal delay={0.14}>
          <p
            style={{
              fontFamily: SANS,
              fontSize: 'clamp(14px,1.6vw,18px)',
              color: C.muted,
              textAlign: 'center',
              maxWidth: 640,
              margin: '0 auto 60px',
              lineHeight: 1.7,
            }}
          >
            De la mise aux normes à l'installation solaire, Ampère &amp; Fils
            couvre l'ensemble de vos besoins électriques à Nantes et en
            Loire-Atlantique.
          </p>
        </Reveal>

        <div
          className="r288-services-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 24,
            alignItems: 'stretch',
          }}
        >
          {SERVICES.map((s, i) => (
            <ServiceCard key={s.title} svc={s} i={i} />
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 860px){
          .r288-services-grid{ grid-template-columns:1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   4 · PROCESS SECTION
   Left sticky photo technicien + Right scroll 4 étapes
   ════════════════════════════════════════════════════════════════════════════ */
const STEPS = [
  {
    num: '01',
    title: 'Visite technique',
    desc: "Un technicien Ampère & Fils se déplace chez vous, gratuitement, pour évaluer votre installation existante et comprendre vos besoins. Diagnostic complet inclus.",
    icon: Home,
  },
  {
    num: '02',
    title: 'Devis détaillé',
    desc: "Nous vous adressons un devis transparent, postes par postes, sans surprise. Délai de réponse sous 48h ouvrées. Financement possible.",
    icon: CheckCircle,
  },
  {
    num: '03',
    title: 'Installation certifiée',
    desc: "Nos électriciens qualifiés réalisent les travaux dans les règles de l'art, dans le respect des normes NF C 15-100 et des délais convenus.",
    icon: Wrench,
  },
  {
    num: '04',
    title: 'Réception CONSUEL',
    desc: "Nous vous accompagnons pour l'obtention de l'attestation CONSUEL et la mise en service. Votre installation est vérifiée, conforme et opérationnelle.",
    icon: Shield,
  },
] as const;

function StepBlock({ step, i }: { step: (typeof STEPS)[number]; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15% 0px -15% 0px' });
  const Icon = step.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 40 }}
      animate={inView ? { opacity: 1, x: 0 } : undefined}
      transition={{ duration: 0.9, ease: EASE, delay: i * 0.1 }}
      style={{
        display: 'flex',
        gap: 24,
        alignItems: 'flex-start',
        paddingBottom: i < STEPS.length - 1 ? 56 : 0,
        position: 'relative',
      }}
    >
      {/* Filet vertical */}
      {i < STEPS.length - 1 && (
        <div
          style={{
            position: 'absolute',
            left: 27,
            top: 56,
            bottom: 0,
            width: 2,
            background: `linear-gradient(${C.green}44, transparent)`,
            borderRadius: 2,
          }}
        />
      )}

      {/* Numéro + icône */}
      <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: C.navy,
            border: `2px solid ${C.green}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon size={22} color={C.green} strokeWidth={2} />
        </div>
        <span
          style={{
            fontFamily: SERIF,
            fontWeight: 700,
            fontSize: 11,
            color: C.green,
            letterSpacing: '0.16em',
          }}
        >
          {step.num}
        </span>
      </div>

      <div style={{ paddingTop: 6 }}>
        <h3
          style={{
            fontFamily: SERIF,
            fontWeight: 700,
            fontSize: 'clamp(18px,1.8vw,23px)',
            color: C.navy,
            margin: '0 0 10px',
          }}
        >
          {step.title}
        </h3>
        <p
          style={{
            fontFamily: SANS,
            fontSize: 14.5,
            color: C.muted,
            lineHeight: 1.72,
            margin: 0,
          }}
        >
          {step.desc}
        </p>
      </div>
    </motion.div>
  );
}

function ProcessSection() {
  const stickyRef = useRef<HTMLDivElement>(null);

  return (
    <section
      style={{
        background: C.white,
        padding: 'clamp(80px,12vw,160px) clamp(24px,6vw,80px)',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Reveal>
          <Eyebrow>Notre méthode</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontWeight: 700,
              fontSize: 'clamp(30px,4.5vw,58px)',
              color: C.navy,
              margin: '16px 0 48px',
              lineHeight: 1.1,
              maxWidth: 600,
            }}
          >
            Un accompagnement
            <br />
            <span style={{ color: C.green }}>de bout en bout</span>
          </h2>
        </Reveal>

        <div
          className="r288-process-layout"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'clamp(40px,6vw,96px)',
            alignItems: 'start',
          }}
        >
          {/* Photo sticky gauche */}
          <div
            ref={stickyRef}
            className="r288-process-photo"
            style={{
              position: 'sticky',
              top: 120,
              borderRadius: 12,
              overflow: 'hidden',
              aspectRatio: '4 / 5',
              boxShadow: `0 40px 80px -28px rgba(27,42,74,0.22)`,
            }}
          >
            <img
              src={PHOTO.technicien}
              alt="Électricien Ampère et Fils au travail"
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(to top, rgba(27,42,74,0.72) 0%, transparent 55%)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: 28,
                left: 28,
                right: 28,
              }}
            >
              <div
                style={{
                  fontFamily: SERIF,
                  fontWeight: 700,
                  fontSize: 22,
                  color: C.white,
                  lineHeight: 1.2,
                }}
              >
                Ampère &amp; Fils
              </div>
              <div
                style={{
                  fontFamily: SANS,
                  fontSize: 13,
                  color: 'rgba(255,255,255,0.70)',
                  marginTop: 4,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <MapPin size={12} color={C.green} />
                Nantes · Loire-Atlantique
              </div>
            </div>
          </div>

          {/* Étapes droite */}
          <div style={{ paddingTop: 8 }}>
            {STEPS.map((s, i) => (
              <StepBlock key={s.num} step={s} i={i} />
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 860px){
          .r288-process-layout{ grid-template-columns:1fr !important; }
          .r288-process-photo{ position:relative !important; top:auto !important; margin-bottom:40px; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   5 · TESTIMONIALS SECTION — 3 avis clients avec étoiles
   ════════════════════════════════════════════════════════════════════════════ */
const TESTIMONIALS = [
  {
    name: 'Sophie M.',
    city: 'Nantes (44000)',
    project: 'Rénovation électrique complète',
    text: "Ampère & Fils a refait l'intégralité de notre installation dans une maison de 1972. Travail soigné, tableau flambant neuf, CONSUEL obtenu en une semaine. Tarif juste et équipe très pro. Je recommande sans hésitation !",
    stars: 5,
  },
  {
    name: 'Thomas L.',
    city: 'Saint-Herblain (44800)',
    project: 'Borne de recharge Wallbox Tesla',
    text: "Installation de ma borne Wallbox pour ma Tesla Model 3. Prise de rendez-vous rapide, technicien ponctuel, installation impeccable. L'aide ADVENIR a été gérée directement par eux. Parfait !",
    stars: 5,
  },
  {
    name: 'Martine &amp; Jean-Pierre R.',
    city: 'Rezé (44400)',
    project: 'Panneaux solaires 6 kWc',
    text: "Pose de 16 panneaux photovoltaïques sur notre toit. Bilan de production sérieux, dossier MaPrimeRénov' géré de A à Z. Premier mois : 80 % de notre consommation couverte. Bravo pour le suivi !",
    stars: 5,
  },
] as const;

function TestimonialCard({ t, i }: { t: (typeof TESTIMONIALS)[number]; i: number }) {
  return (
    <Reveal delay={i * 0.12} style={{ height: '100%' }}>
      <article
        style={{
          background: C.white,
          border: `1.5px solid ${C.grayDark}`,
          borderRadius: 8,
          padding: 'clamp(24px,2.5vw,38px)',
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
          height: '100%',
          boxShadow: '0 4px 20px -6px rgba(27,42,74,0.08)',
        }}
      >
        {/* Étoiles */}
        <Stars n={t.stars} />

        {/* Citation */}
        <p
          style={{
            fontFamily: SANS,
            fontSize: 14.5,
            color: C.ink,
            lineHeight: 1.72,
            margin: '18px 0 20px',
            flex: 1,
          }}
          dangerouslySetInnerHTML={{ __html: `"${t.text}"` }}
        />

        {/* Auteur */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            paddingTop: 18,
            borderTop: `1px solid ${C.gray}`,
          }}
        >
          {/* Avatar initiales */}
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: C.navy,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: SERIF,
              fontWeight: 700,
              fontSize: 16,
              color: C.green,
              flexShrink: 0,
            }}
          >
            {t.name.charAt(0)}
          </div>
          <div>
            <div
              style={{
                fontFamily: SERIF,
                fontWeight: 700,
                fontSize: 14.5,
                color: C.navy,
              }}
              dangerouslySetInnerHTML={{ __html: t.name }}
            />
            <div
              style={{
                fontFamily: SANS,
                fontSize: 12,
                color: C.muted,
                marginTop: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <MapPin size={11} color={C.green} />
              {t.city}
            </div>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 11.5,
                color: C.green,
                marginTop: 3,
                fontWeight: 500,
              }}
            >
              {t.project}
            </div>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

function TestimonialsSection() {
  return (
    <section
      style={{
        background: C.gray,
        padding: 'clamp(80px,12vw,160px) clamp(24px,6vw,80px)',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Reveal>
          <Eyebrow align="center">Témoignages</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontWeight: 700,
              fontSize: 'clamp(30px,4.5vw,58px)',
              color: C.navy,
              textAlign: 'center',
              margin: '16px 0 14px',
              lineHeight: 1.1,
            }}
          >
            Ils nous font confiance
          </h2>
        </Reveal>
        <Reveal delay={0.14}>
          <p
            style={{
              fontFamily: SANS,
              fontSize: 'clamp(13px,1.5vw,17px)',
              color: C.muted,
              textAlign: 'center',
              maxWidth: 520,
              margin: '0 auto 52px',
              lineHeight: 1.7,
            }}
          >
            Plus de 1 200 clients satisfaits en Loire-Atlantique depuis 1989.
          </p>
        </Reveal>

        <div
          className="r288-testi-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 24,
            alignItems: 'stretch',
          }}
        >
          {TESTIMONIALS.map((t, i) => (
            <TestimonialCard key={t.name} t={t} i={i} />
          ))}
        </div>

        {/* Note globale */}
        <Reveal delay={0.2}>
          <div
            style={{
              marginTop: 48,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 16,
              flexWrap: 'wrap',
            }}
          >
            <Stars n={5} />
            <span
              style={{
                fontFamily: SERIF,
                fontWeight: 700,
                fontSize: 22,
                color: C.navy,
              }}
            >
              5,0 / 5
            </span>
            <span
              style={{
                fontFamily: SANS,
                fontSize: 13,
                color: C.muted,
              }}
            >
              · Basé sur 87 avis vérifiés Google
            </span>
          </div>
        </Reveal>
      </div>
      <style>{`
        @media (max-width: 860px){
          .r288-testi-grid{ grid-template-columns:1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   6 · DEVIS FORM SECTION
   Prénom, Nom, Type de projet (select), Surface/puissance, Téléphone
   État "envoyé" personnalisé
   ════════════════════════════════════════════════════════════════════════════ */
type FormData = {
  prenom: string;
  nom: string;
  projet: string;
  detail: string;
  telephone: string;
};

const FORM_INIT: FormData = {
  prenom: '',
  nom: '',
  projet: '',
  detail: '',
  telephone: '',
};

function DevisFormSection() {
  const [form, setForm] = useState<FormData>(FORM_INIT);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 16px',
    fontFamily: SANS,
    fontSize: 14.5,
    color: C.navy,
    background: C.white,
    border: `1.5px solid ${C.grayDark}`,
    borderRadius: 6,
    outline: 'none',
    transition: 'border-color .3s',
    boxSizing: 'border-box',
  };
  const labelStyle: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: C.navy,
    marginBottom: 7,
    display: 'block',
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    // Simulation d'envoi
    setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 1400);
  };

  return (
    <section
      id="devis"
      style={{
        background: C.navy,
        padding: 'clamp(80px,12vw,160px) clamp(24px,6vw,80px)',
      }}
    >
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <Reveal>
          <Eyebrow color={C.green} align="center">
            Demande de devis
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontWeight: 700,
              fontSize: 'clamp(30px,4.5vw,58px)',
              color: C.white,
              textAlign: 'center',
              margin: '16px 0 12px',
              lineHeight: 1.1,
            }}
          >
            Votre devis gratuit
            <br />
            <span style={{ color: C.green }}>sous 48 heures</span>
          </h2>
        </Reveal>
        <Reveal delay={0.14}>
          <p
            style={{
              fontFamily: SANS,
              fontSize: 'clamp(13px,1.5vw,17px)',
              color: 'rgba(255,255,255,0.65)',
              textAlign: 'center',
              maxWidth: 520,
              margin: '0 auto 48px',
              lineHeight: 1.7,
            }}
          >
            Remplissez le formulaire ci-dessous. Nous revenons vers vous rapidement
            pour planifier une visite technique gratuite et sans engagement.
          </p>
        </Reveal>

        <Reveal delay={0.18}>
          {sent ? (
            // État "envoyé"
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: EASE }}
              style={{
                background: 'rgba(0,184,148,0.10)',
                border: `2px solid ${C.green}`,
                borderRadius: 12,
                padding: 'clamp(44px,6vw,80px) clamp(24px,4vw,60px)',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 20,
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
              >
                <CheckCircle size={64} color={C.green} strokeWidth={1.5} />
              </motion.div>
              <h3
                style={{
                  fontFamily: SERIF,
                  fontWeight: 700,
                  fontSize: 'clamp(22px,3vw,34px)',
                  color: C.white,
                  margin: 0,
                }}
              >
                Demande envoyée avec succès !
              </h3>
              <p
                style={{
                  fontFamily: SANS,
                  fontSize: 16,
                  color: 'rgba(255,255,255,0.72)',
                  maxWidth: 420,
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                Merci {form.prenom} ! Nous avons bien reçu votre demande de devis
                pour <strong style={{ color: C.green }}>{form.projet || 'votre projet'}</strong>.
                Un technicien Ampère &amp; Fils vous contactera sous 48h ouvrées.
              </p>
              <div style={{ marginTop: 8, display: 'flex', gap: 12, alignItems: 'center' }}>
                <Phone size={16} color={C.green} />
                <span style={{ fontFamily: SANS, fontSize: 15, color: 'rgba(255,255,255,0.80)' }}>
                  Besoin urgent ? <strong style={{ color: C.green }}>02 40 00 00 00</strong>
                </span>
              </div>
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit}
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 12,
                padding: 'clamp(32px,4vw,56px)',
                display: 'flex',
                flexDirection: 'column',
                gap: 24,
              }}
            >
              {/* Rangée prénom / nom */}
              <div
                className="r288-form-row"
                style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}
              >
                <div>
                  <label style={labelStyle} htmlFor="prenom">Prénom</label>
                  <input
                    id="prenom"
                    name="prenom"
                    type="text"
                    required
                    placeholder="Sophie"
                    value={form.prenom}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="nom">Nom</label>
                  <input
                    id="nom"
                    name="nom"
                    type="text"
                    required
                    placeholder="Martin"
                    value={form.nom}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Type de projet */}
              <div>
                <label style={labelStyle} htmlFor="projet">Type de projet</label>
                <select
                  id="projet"
                  name="projet"
                  required
                  value={form.projet}
                  onChange={handleChange}
                  style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' }}
                >
                  <option value="">Sélectionnez votre projet…</option>
                  <option value="Rénovation électrique">Rénovation électrique</option>
                  <option value="Borne de recharge IRVE">Borne de recharge IRVE</option>
                  <option value="Panneaux solaires">Panneaux solaires (photovoltaïque)</option>
                  <option value="Dépannage urgent">Dépannage urgent</option>
                  <option value="Construction neuve">Construction neuve</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>

              {/* Surface ou puissance */}
              <div>
                <label style={labelStyle} htmlFor="detail">
                  Surface (m²) ou puissance souhaitée (kWc)
                </label>
                <input
                  id="detail"
                  name="detail"
                  type="text"
                  placeholder="Ex : 120 m² / 6 kWc / Tesla Model 3…"
                  value={form.detail}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              {/* Téléphone */}
              <div>
                <label style={labelStyle} htmlFor="telephone">Téléphone</label>
                <input
                  id="telephone"
                  name="telephone"
                  type="tel"
                  required
                  placeholder="06 12 34 56 78"
                  value={form.telephone}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              {/* Mentions */}
              <p
                style={{
                  fontFamily: SANS,
                  fontSize: 11.5,
                  color: 'rgba(255,255,255,0.40)',
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                Vos données sont utilisées uniquement pour vous contacter. Aucune
                revente à des tiers. Conformité RGPD garantie.
              </p>

              {/* Bouton submit */}
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
                <motion.button
                  type="submit"
                  disabled={sending}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '17px 44px',
                    fontFamily: SANS,
                    fontSize: 14,
                    letterSpacing: '0.20em',
                    textTransform: 'uppercase',
                    fontWeight: 700,
                    cursor: sending ? 'not-allowed' : 'pointer',
                    border: 'none',
                    borderRadius: 6,
                    background: sending ? C.navyMid : C.green,
                    color: C.white,
                    opacity: sending ? 0.7 : 1,
                    transition: 'all .4s',
                    boxShadow: `0 12px 40px -12px ${C.green}66`,
                  }}
                >
                  {sending ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        style={{ width: 16, height: 16, border: `2px solid ${C.white}44`, borderTopColor: C.white, borderRadius: '50%' }}
                      />
                      Envoi en cours…
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Envoyer ma demande
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          )}
        </Reveal>
      </div>
      <style>{`
        @media (max-width: 860px){
          .r288-form-row{ grid-template-columns:1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   7 · IRVE SECTION
   Focus bornes de recharge, marques, aide ADVENIR
   ════════════════════════════════════════════════════════════════════════════ */
function IrveSection() {
  const BRANDS = ['Wallbox', 'Schneider Electric', 'Legrand', 'Hager', 'Keba'];

  return (
    <section
      id="irve"
      style={{
        background: C.white,
        padding: 'clamp(80px,12vw,160px) clamp(24px,6vw,80px)',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div
          className="r288-irve-layout"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'clamp(40px,7vw,100px)',
            alignItems: 'center',
          }}
        >
          {/* Texte gauche */}
          <div>
            <Reveal>
              <Eyebrow>IRVE · Borne de recharge</Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              <h2
                style={{
                  fontFamily: SERIF,
                  fontWeight: 700,
                  fontSize: 'clamp(28px,4vw,54px)',
                  color: C.navy,
                  margin: '18px 0 18px',
                  lineHeight: 1.1,
                }}
              >
                Rechargez votre VE
                <br />
                <span style={{ color: C.green }}>à domicile ou en entreprise</span>
              </h2>
            </Reveal>
            <Reveal delay={0.14}>
              <p
                style={{
                  fontFamily: SANS,
                  fontSize: 15,
                  color: C.muted,
                  lineHeight: 1.72,
                  marginBottom: 28,
                }}
              >
                Ampère &amp; Fils est agréé <strong style={{ color: C.navy }}>IRVE P1/P2/P3</strong> par l'INERIS.
                Nous installons des bornes de recharge pour tous types de véhicules
                électriques et hybrides rechargeables — chez le particulier, en
                copropriété et pour les flottes d'entreprise.
              </p>
            </Reveal>

            {/* Aide ADVENIR */}
            <Reveal delay={0.18}>
              <div
                style={{
                  background: C.greenDim,
                  border: `1.5px solid ${C.green}44`,
                  borderRadius: 8,
                  padding: '20px 24px',
                  marginBottom: 28,
                  display: 'flex',
                  gap: 16,
                  alignItems: 'flex-start',
                }}
              >
                <Battery size={28} color={C.green} strokeWidth={1.8} style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div
                    style={{
                      fontFamily: SERIF,
                      fontWeight: 700,
                      fontSize: 16,
                      color: C.navy,
                      marginBottom: 6,
                    }}
                  >
                    Aide ADVENIR — jusqu'à 50 % de subvention
                  </div>
                  <p
                    style={{
                      fontFamily: SANS,
                      fontSize: 13.5,
                      color: C.muted,
                      lineHeight: 1.65,
                      margin: 0,
                    }}
                  >
                    Le programme ADVENIR finance jusqu'à 50 % du coût de votre borne
                    en copropriété ou en entreprise. Ampère &amp; Fils constitue le
                    dossier pour vous, gratuitement.
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Marques */}
            <Reveal delay={0.22}>
              <div
                style={{
                  fontFamily: SANS,
                  fontSize: 11,
                  letterSpacing: '0.32em',
                  textTransform: 'uppercase',
                  color: C.muted,
                  marginBottom: 14,
                  fontWeight: 600,
                }}
              >
                Marques installées
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {BRANDS.map((b) => (
                  <span
                    key={b}
                    style={{
                      fontFamily: SANS,
                      fontSize: 13,
                      fontWeight: 600,
                      color: C.navy,
                      background: C.gray,
                      border: `1px solid ${C.grayDark}`,
                      borderRadius: 4,
                      padding: '6px 14px',
                    }}
                  >
                    {b}
                  </span>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.28}>
              <div style={{ marginTop: 36 }}>
                <a href="#devis" style={{ textDecoration: 'none' }}>
                  <GreenButton filled>
                    <Car size={16} />
                    Devis borne IRVE gratuit
                  </GreenButton>
                </a>
              </div>
            </Reveal>
          </div>

          {/* Photo droite */}
          <Reveal delay={0.1}>
            <div
              style={{
                borderRadius: 12,
                overflow: 'hidden',
                aspectRatio: '4/5',
                boxShadow: `0 40px 80px -28px rgba(27,42,74,0.20)`,
                position: 'relative',
              }}
            >
              <img
                src={PHOTO.borne}
                alt="Borne de recharge véhicule électrique installée par Ampère et Fils"
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              {/* Badge IRVE */}
              <div
                style={{
                  position: 'absolute',
                  top: 24,
                  right: 24,
                  background: C.navy,
                  border: `2px solid ${C.green}`,
                  borderRadius: 8,
                  padding: '10px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <ZapOff size={18} color={C.green} strokeWidth={2} />
                <span
                  style={{
                    fontFamily: SERIF,
                    fontWeight: 700,
                    fontSize: 13,
                    color: C.white,
                  }}
                >
                  Certifié IRVE P1/P2/P3
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
      <style>{`
        @media (max-width: 860px){
          .r288-irve-layout{ grid-template-columns:1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   8 · SOLAIRE SECTION
   Panneaux photovoltaïques, autoconsommation, MaPrimeRénov', rendement
   ════════════════════════════════════════════════════════════════════════════ */
function SolaireSection() {
  const STATS = [
    { v: '6–10 kWc', l: 'puissance installée typique' },
    { v: 'TVA 10 %', l: 'sur les travaux éligibles' },
    { v: "MaPrimeRénov'", l: "jusqu'à 1 000 € d'aide" },
    { v: '25 ans', l: 'durée de vie des panneaux' },
  ];

  return (
    <section
      id="solaire"
      style={{
        background: C.navy,
        padding: 'clamp(80px,12vw,160px) clamp(24px,6vw,80px)',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div
          className="r288-solaire-layout"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'clamp(40px,7vw,100px)',
            alignItems: 'center',
          }}
        >
          {/* Photo gauche */}
          <Reveal delay={0.1}>
            <div
              style={{
                borderRadius: 12,
                overflow: 'hidden',
                aspectRatio: '4/5',
                boxShadow: `0 40px 80px -28px rgba(0,0,0,0.5)`,
                position: 'relative',
              }}
            >
              <img
                src={PHOTO.solaire}
                alt="Panneaux solaires photovoltaïques posés par Ampère et Fils Loire-Atlantique"
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(to top, rgba(17,29,53,0.65) 0%, transparent 55%)',
                }}
              />
              {/* Badge rendement */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 28,
                  left: 28,
                  right: 28,
                  background: 'rgba(0,184,148,0.18)',
                  border: `1.5px solid ${C.green}`,
                  borderRadius: 8,
                  padding: '14px 18px',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <div
                  style={{
                    fontFamily: SERIF,
                    fontWeight: 700,
                    fontSize: 20,
                    color: C.white,
                    marginBottom: 4,
                  }}
                >
                  Jusqu'à 80 % d'économies
                </div>
                <div
                  style={{
                    fontFamily: SANS,
                    fontSize: 12.5,
                    color: 'rgba(255,255,255,0.70)',
                    lineHeight: 1.5,
                  }}
                >
                  sur votre facture d'électricité annuelle
                </div>
              </div>
            </div>
          </Reveal>

          {/* Texte droite */}
          <div>
            <Reveal>
              <Eyebrow color={C.green}>Énergie solaire</Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              <h2
                style={{
                  fontFamily: SERIF,
                  fontWeight: 700,
                  fontSize: 'clamp(28px,4vw,54px)',
                  color: C.white,
                  margin: '18px 0 18px',
                  lineHeight: 1.1,
                }}
              >
                Produisez votre propre
                <br />
                <span style={{ color: C.green }}>électricité solaire</span>
              </h2>
            </Reveal>
            <Reveal delay={0.14}>
              <p
                style={{
                  fontFamily: SANS,
                  fontSize: 15,
                  color: 'rgba(255,255,255,0.70)',
                  lineHeight: 1.72,
                  marginBottom: 28,
                }}
              >
                Certifiés <strong style={{ color: C.green }}>QualiPV RGE</strong>, nous installons
                des panneaux photovoltaïques monocristallins à haut rendement. Autoconsommation
                totale ou partielle avec revente du surplus à EDF — nous vous guidons vers
                la solution la plus rentable pour votre logement.
              </p>
            </Reveal>

            {/* Grille de stats */}
            <Reveal delay={0.18}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 16,
                  marginBottom: 32,
                }}
              >
                {STATS.map((s) => (
                  <div
                    key={s.l}
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.10)',
                      borderRadius: 8,
                      padding: '18px 20px',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: SERIF,
                        fontWeight: 700,
                        fontSize: 'clamp(16px,2vw,20px)',
                        color: C.green,
                        lineHeight: 1,
                        marginBottom: 6,
                      }}
                    >
                      {s.v}
                    </div>
                    <div
                      style={{
                        fontFamily: SANS,
                        fontSize: 12,
                        color: 'rgba(255,255,255,0.55)',
                        lineHeight: 1.4,
                      }}
                    >
                      {s.l}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Étapes clés */}
            <Reveal delay={0.22}>
              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: '0 0 32px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}
              >
                {[
                  "Étude d'ensoleillement et simulation de production",
                  'Demande de raccordement Enedis prise en charge',
                  'Installation en 1 à 2 jours selon la puissance',
                  "Contrat de revente EDF OA accompagné",
                ].map((item) => (
                  <li
                    key={item}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 10,
                      fontFamily: SANS,
                      fontSize: 14,
                      color: 'rgba(255,255,255,0.78)',
                      lineHeight: 1.5,
                    }}
                  >
                    <Sun size={14} color={C.green} strokeWidth={2} style={{ flexShrink: 0, marginTop: 3 }} />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.26}>
              <a href="#devis" style={{ textDecoration: 'none' }}>
                <GreenButton filled>
                  <Sun size={16} />
                  Simuler mon projet solaire
                </GreenButton>
              </a>
            </Reveal>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 860px){
          .r288-solaire-layout{ grid-template-columns:1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   9 · CERTIF SECTION
   IRVE P1/P2/P3, QualiPV, RGE, Qualifelec, assurance décennale
   ════════════════════════════════════════════════════════════════════════════ */
const CERTIFS = [
  {
    code: 'RGE',
    name: 'Reconnu Garant de l\'Environnement',
    desc: 'Label attribué par l\'État. Ouvre droit aux aides fiscales et subventions (MaPrimeRénov\', CEE).',
    icon: Award,
  },
  {
    code: 'IRVE P1/P2/P3',
    name: 'Installation bornes de recharge',
    desc: 'Certification INERIS obligatoire pour installer des bornes de charge pour véhicules électriques.',
    icon: Car,
  },
  {
    code: 'QualiPV',
    name: 'Qualification photovoltaïque',
    desc: 'Certification Qualibat pour l\'installation de systèmes photovoltaïques. Exigée pour toucher les aides.',
    icon: Sun,
  },
  {
    code: 'Qualifelec',
    name: 'Excellence en électricité',
    desc: 'Qualification professionnelle indépendante attestant la compétence technique et la qualité des travaux.',
    icon: Zap,
  },
  {
    code: 'Assurance décennale',
    name: 'Garantie 10 ans',
    desc: 'Couverture décennale sur tous les travaux réalisés. Vos installations sont protégées 10 ans après réception.',
    icon: Shield,
  },
] as const;

function CertifCard({ c, i }: { c: (typeof CERTIFS)[number]; i: number }) {
  const [hover, setHover] = useState(false);
  const Icon = c.icon;

  return (
    <Reveal delay={i * 0.08} style={{ height: '100%' }}>
      <article
        style={{
          background: hover ? C.navyMid : C.white,
          border: `1.5px solid ${hover ? C.green : C.grayDark}`,
          borderRadius: 8,
          padding: '28px 26px',
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
          height: '100%',
          transition: 'all .45s cubic-bezier(.16,1,.3,1)',
          transform: hover ? 'translateY(-6px)' : 'none',
          boxShadow: hover ? `0 24px 56px -20px rgba(0,184,148,0.18)` : 'none',
          cursor: 'default',
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            marginBottom: 14,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              background: hover ? C.greenDim : `${C.green}18`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'background .4s',
            }}
          >
            <Icon size={20} color={C.green} strokeWidth={2} />
          </div>
          <div
            style={{
              fontFamily: SERIF,
              fontWeight: 700,
              fontSize: 15,
              color: hover ? C.white : C.navy,
              transition: 'color .4s',
              lineHeight: 1.2,
            }}
          >
            {c.code}
          </div>
        </div>

        <div
          style={{
            fontFamily: SANS,
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.10em',
            textTransform: 'uppercase',
            color: C.green,
            marginBottom: 8,
          }}
        >
          {c.name}
        </div>
        <p
          style={{
            fontFamily: SANS,
            fontSize: 13.5,
            color: hover ? 'rgba(255,255,255,0.68)' : C.muted,
            lineHeight: 1.66,
            margin: 0,
            transition: 'color .4s',
          }}
        >
          {c.desc}
        </p>
      </article>
    </Reveal>
  );
}

function CertifSection() {
  return (
    <section
      id="certif"
      style={{
        background: C.gray,
        padding: 'clamp(80px,12vw,160px) clamp(24px,6vw,80px)',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Reveal>
          <Eyebrow align="center">Qualité & confiance</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontWeight: 700,
              fontSize: 'clamp(30px,4.5vw,58px)',
              color: C.navy,
              textAlign: 'center',
              margin: '16px 0 12px',
              lineHeight: 1.1,
            }}
          >
            Des certifications qui
            <br />
            <span style={{ color: C.green }}>parlent d'elles-mêmes</span>
          </h2>
        </Reveal>
        <Reveal delay={0.14}>
          <p
            style={{
              fontFamily: SANS,
              fontSize: 'clamp(13px,1.5vw,17px)',
              color: C.muted,
              textAlign: 'center',
              maxWidth: 560,
              margin: '0 auto 52px',
              lineHeight: 1.7,
            }}
          >
            Ampère &amp; Fils détient toutes les certifications nécessaires pour
            vous ouvrir l'accès aux aides et subventions de l'État. Vous êtes
            entre de bonnes mains.
          </p>
        </Reveal>

        <div
          className="r288-certif-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: 20,
            alignItems: 'stretch',
          }}
        >
          {CERTIFS.map((c, i) => (
            <CertifCard key={c.code} c={c} i={i} />
          ))}
        </div>

        {/* CTA central */}
        <Reveal delay={0.3}>
          <div
            style={{
              marginTop: 56,
              background: C.navy,
              borderRadius: 12,
              padding: 'clamp(36px,5vw,64px) clamp(24px,4vw,56px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: 20,
            }}
          >
            <Zap size={40} color={C.green} strokeWidth={1.8} />
            <h3
              style={{
                fontFamily: SERIF,
                fontWeight: 700,
                fontSize: 'clamp(22px,3vw,36px)',
                color: C.white,
                margin: 0,
                lineHeight: 1.15,
              }}
            >
              Prêt à démarrer votre projet&nbsp;?
            </h3>
            <p
              style={{
                fontFamily: SANS,
                fontSize: 15,
                color: 'rgba(255,255,255,0.65)',
                maxWidth: 460,
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              Devis gratuit et sans engagement sous 48h. Visite technique offerte
              sur toute la Loire-Atlantique.
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
              <a href="#devis" style={{ textDecoration: 'none' }}>
                <GreenButton filled>Demander un devis</GreenButton>
              </a>
              <a href={`tel:${fd?.phone ?? "0240000000"}`} style={{ textDecoration: 'none' }}>
                <GreenButton>
                  <Phone size={15} />
                  Appeler maintenant
                </GreenButton>
              </a>
            </div>
          </div>
        </Reveal>
      </div>
      <style>{`
        @media (max-width: 1100px){
          .r288-certif-grid{ grid-template-columns:repeat(3,1fr) !important; }
        }
        @media (max-width: 860px){
          .r288-certif-grid{ grid-template-columns:1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   10 · FOOTER SECTION
   Logo Ampère & Fils, zones Loire-Atlantique, mentions RGE/IRVE, SIRET
   ════════════════════════════════════════════════════════════════════════════ */
const ZONES = [
  'Nantes', 'Saint-Nazaire', 'Saint-Herblain', 'Rezé',
  'Orvault', 'Vertou', 'Carquefou', 'La Baule',
  'Ancenis', 'Châteaubriant', 'Machecoul', 'Pornic',
];

const NAV_LINKS = [
  { label: 'Accueil', href: '#hero' },
  { label: 'Services', href: '#services' },
  { label: 'Notre méthode', href: '#process' },
  { label: 'Bornes IRVE', href: '#irve' },
  { label: 'Énergie solaire', href: '#solaire' },
  { label: 'Certifications', href: '#certif' },
  { label: 'Devis gratuit', href: '#devis' },
];

function FooterSection() {
  const footerBase: React.CSSProperties = {
    background: C.navyDeep,
    color: 'rgba(255,255,255,0.65)',
    fontFamily: SANS,
  };
  const heading: React.CSSProperties = {
    fontFamily: SERIF,
    fontWeight: 700,
    fontSize: 13,
    color: C.white,
    letterSpacing: '0.20em',
    textTransform: 'uppercase',
    marginBottom: 18,
  };
  const linkStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: SANS,
    fontSize: 13.5,
    color: 'rgba(255,255,255,0.58)',
    textDecoration: 'none',
    marginBottom: 9,
    transition: 'color .3s',
    lineHeight: 1.5,
  };

  return (
    <footer style={footerBase}>
      {/* Corps du footer */}
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: 'clamp(56px,8vw,100px) clamp(24px,6vw,80px) clamp(40px,5vw,64px)',
        }}
      >
        <div
          className="r288-footer-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1.6fr 1fr 1fr 1.3fr',
            gap: 48,
          }}
        >
          {/* Colonne brand */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 18,
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 10,
                  background: C.green,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Zap size={22} color={C.white} strokeWidth={2.5} />
              </div>
              <div>
                <div
                  style={{
                    fontFamily: SERIF,
                    fontWeight: 700,
                    fontSize: 18,
                    color: C.white,
                    lineHeight: 1,
                  }}
                >
                  Ampère &amp; Fils
                </div>
                <div
                  style={{
                    fontFamily: SANS,
                    fontSize: 11,
                    color: C.green,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    marginTop: 3,
                    fontWeight: 600,
                  }}
                >
                  Électricien artisan
                </div>
              </div>
            </div>

            <p
              style={{
                fontSize: 14,
                color: 'rgba(255,255,255,0.55)',
                lineHeight: 1.72,
                maxWidth: 280,
                margin: '0 0 22px',
              }}
            >
              Électricien artisan à Nantes depuis 1989. Installation, rénovation,
              bornes IRVE et panneaux solaires en Loire-Atlantique.
            </p>

            {/* Badges */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['RGE', 'IRVE P1/P2/P3', 'QualiPV', 'Qualifelec'].map((b) => (
                <span
                  key={b}
                  style={{
                    fontFamily: SANS,
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: C.green,
                    border: `1px solid ${C.green}44`,
                    borderRadius: 4,
                    padding: '4px 10px',
                  }}
                >
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <div style={heading}>Navigation</div>
            {NAV_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                style={linkStyle}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = C.green;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.58)';
                }}
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Zones d'intervention */}
          <div>
            <div style={heading}>Zones desservies</div>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '4px 12px',
              }}
            >
              {ZONES.map((z) => (
                <span
                  key={z}
                  style={{
                    fontFamily: SANS,
                    fontSize: 12.5,
                    color: 'rgba(255,255,255,0.52)',
                    lineHeight: 2,
                  }}
                >
                  {z}
                </span>
              ))}
            </div>
            <div
              style={{
                marginTop: 16,
                fontFamily: SANS,
                fontSize: 12,
                color: 'rgba(255,255,255,0.38)',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <MapPin size={12} color={C.green} />
              Loire-Atlantique (44) et départements limitrophes
            </div>
          </div>

          {/* Contact */}
          <div>
            <div style={heading}>Contact</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <a
                href={`tel:${fd?.phone ?? "0240000000"}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  fontFamily: SERIF,
                  fontWeight: 700,
                  fontSize: 17,
                  color: C.white,
                  textDecoration: 'none',
                  transition: 'color .3s',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = C.green; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = C.white; }}
              >
                <Phone size={16} color={C.green} />
                02 40 00 00 00
              </a>
              <div
                style={{
                  fontFamily: SANS,
                  fontSize: 13,
                  color: 'rgba(255,255,255,0.52)',
                  lineHeight: 1.6,
                }}
              >
                Du lundi au vendredi
                <br />
                8h – 18h · Urgences 24h/7j
              </div>
              <a
                href={`mailto:${fd?.email ?? "contact@ampere-fils.fr"}`}
                style={{
                  fontFamily: SANS,
                  fontSize: 13,
                  color: C.green,
                  textDecoration: 'none',
                }}
              >{fd?.email ?? "contact@ampere-fils.fr"}</a>
              <div
                style={{
                  marginTop: 8,
                  fontFamily: SANS,
                  fontSize: 12,
                  color: 'rgba(255,255,255,0.35)',
                  lineHeight: 1.6,
                }}
              >
                12 rue de la Chabossière
                <br />
                44300 Nantes
              </div>

              {/* Devis CTA footer */}
              <div style={{ marginTop: 12 }}>
                <a href="#devis" style={{ textDecoration: 'none' }}>
                  <GreenButton filled small>Devis gratuit</GreenButton>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Barre de bas */}
      <div
        style={{
          borderTop: '1px solid rgba(255,255,255,0.07)',
          padding: '20px clamp(24px,6vw,80px)',
        }}
      >
        <div
          className="r288-footer-bottom"
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div
            style={{
              fontFamily: SANS,
              fontSize: 12,
              color: 'rgba(255,255,255,0.30)',
              lineHeight: 1.6,
            }}
          >
            © {new Date().getFullYear()} Ampère &amp; Fils · SIRET 000 000 000 00000 ·
            RGE n°E-E210000 · IRVE certifié INERIS · Assurance décennale Allianz n°SIN-XXX-XXXXX
          </div>
          <div
            style={{
              display: 'flex',
              gap: 20,
            }}
          >
            {['Mentions légales', 'Politique de confidentialité'].map((lbl) => (
              <a
                key={lbl}
                href="/templates/impact-288"
                style={{
                  fontFamily: SANS,
                  fontSize: 12,
                  color: 'rgba(255,255,255,0.30)',
                  textDecoration: 'none',
                  transition: 'color .3s',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = C.green; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.30)'; }}
              >
                {lbl}
              </a>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 860px){
          .r288-footer-grid{ grid-template-columns:1fr !important; gap:36px !important; }
          .r288-footer-bottom{ flex-direction:column !important; align-items:flex-start !important; }
        }
      `}</style>
    </footer>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   PAGE PRINCIPALE — Impact 288
   ════════════════════════════════════════════════════════════════════════════ */

// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function Impact288Page() {
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
    <main id="hero">
      {/* Polices système importées via link */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Roboto:wght@400;500;700&display=swap');

        *, *::before, *::after {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          padding: 0;
          font-family: ${SANS};
          background: ${C.white};
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        input:focus, select:focus, textarea:focus {
          outline: none;
          border-color: ${C.green} !important;
          box-shadow: 0 0 0 3px ${C.green}22;
        }

        input::placeholder, textarea::placeholder {
          color: rgba(27,42,74,0.35);
        }

        img {
          max-width: 100%;
          display: block;
        }

        @media (max-width: 860px) {
          .r288-hide-mobile {
            display: none !important;
          }
        }
      `}</style>

      <Nav />
      <HeroSection />
      <ScrollCrossfade />
      <ServicesSection />
      <ProcessSection />
      <TestimonialsSection />
      <DevisFormSection />
      <IrveSection />
      <SolaireSection />
      <CertifSection />
      <FooterSection />
    </main>
  );
}
