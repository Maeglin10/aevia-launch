'use client';

import React, { useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  MotionValue,
} from 'framer-motion';
import {
  ArrowRight,
  ChevronDown,
  Smile,
  Star,
  Sparkles,
  MapPin,
  Phone,
  Clock,
  CheckCircle,
  Shield,
  Zap,
  Camera,
  Activity,
} from 'lucide-react';

/* ════════════════════════════════════════════════════════════════════════════
   CABINET DENT'OR — Chirurgien-dentiste & implantologie · Bordeaux Chartrons
   Photographie réelle Unsplash + choreographie de défilement éditoriale
   (style premium × élégance médicale). Fichier 'use client' auto-suffisant.
   ════════════════════════════════════════════════════════════════════════════ */

/* ── Palette ─────────────────────────────────────────────────────────────── */
const C = {
  navy: '#0c2340',
  navyDeep: '#071829',
  navyMid: '#143260',
  gold: '#d4af37',
  goldLight: '#e2c766',
  goldDeep: '#b8961f',
  white: '#ffffff',
  pearl: '#e8e8e8',
  pearlDeep: '#d4d4d4',
  ink: '#0a1a2e',
  fog: '#f5f7fa',
} as const;

/* ── Typographie ─────────────────────────────────────────────────────────── */
const SERIF = "'Playfair Display', Georgia, serif" as const;
const SANS = "'Lato', system-ui, sans-serif" as const;

/* ── Photos Unsplash (IDs réels — ne pas modifier) ──────────────────────── */
const PHOTO = {
  dentiste:
    'https://images.unsplash.com/photo-1606811841689-23dfddce3e66?q=80&w=1600&auto=format&fit=crop',
  cabinet:
    'https://images.unsplash.com/photo-1588776814546-1ffbb172ef46?q=80&w=1600&auto=format&fit=crop',
  sourire:
    'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=1600&auto=format&fit=crop',
  traitement:
    'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=1600&auto=format&fit=crop',
  equipe:
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1600&auto=format&fit=crop',
  consult:
    'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1600&auto=format&fit=crop',
} as const;

/* ── Easing partagé ──────────────────────────────────────────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ════════════════════════════════════════════════════════════════════════════
   Primitives partagées
   ════════════════════════════════════════════════════════════════════════════ */

/** Étiquette fine, capitales, interlettrage, filet doré. */
function Eyebrow({
  children,
  color = C.gold,
  align = 'left',
  dark = false,
}: {
  children: React.ReactNode;
  color?: string;
  align?: 'left' | 'center';
  dark?: boolean;
}) {
  void dark;
  const wrap: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    justifyContent: align === 'center' ? 'center' : 'flex-start',
  };
  const rule: React.CSSProperties = {
    width: 44,
    height: 1,
    background: color,
    opacity: 0.75,
    flexShrink: 0,
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

/** Révélation au scroll — fondu + translation verticale. */
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

/** Bouton doré, contour fin, flèche animée. */
function GoldButton({
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
    gap: 12,
    padding: small ? '11px 22px' : '15px 30px',
    fontFamily: SANS,
    fontSize: small ? 11 : 12,
    letterSpacing: '0.24em',
    textTransform: 'uppercase',
    fontWeight: 600,
    cursor: 'pointer',
    border: `1px solid ${C.gold}`,
    background: filled ? C.gold : 'transparent',
    color: filled ? C.navyDeep : C.gold,
    transition: 'all .5s cubic-bezier(.16,1,.3,1)',
  };
  const hov: React.CSSProperties = hover
    ? filled
      ? { background: C.goldLight, transform: 'translateY(-2px)', boxShadow: `0 14px 40px -16px rgba(212,175,55,0.55)` }
      : { background: 'rgba(212,175,55,0.10)', transform: 'translateY(-2px)' }
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
   Navigation : transparente → solide au défilement
   ════════════════════════════════════════════════════════════════════════════ */
function NavBar() {
  const [solid, setSolid] = useState(false);
  React.useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: 'Soins', href: '#soins' },
    { label: 'Techniques', href: '#techniques' },
    { label: 'Équipe', href: '#equipe' },
    { label: 'Témoignages', href: '#temoignages' },
    { label: 'Bilan gratuit', href: '#bilan' },
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
    background: solid ? 'rgba(7,24,41,0.94)' : 'transparent',
    backdropFilter: solid ? 'blur(16px) saturate(130%)' : 'none',
    WebkitBackdropFilter: solid ? 'blur(16px) saturate(130%)' : 'none',
    borderBottom: solid
      ? `1px solid rgba(212,175,55,0.24)`
      : '1px solid transparent',
    transition: 'all .6s cubic-bezier(.16,1,.3,1)',
  };
  const brand: React.CSSProperties = {
    fontFamily: SERIF,
    fontSize: 20,
    letterSpacing: '0.12em',
    color: C.white,
    textTransform: 'uppercase',
    fontWeight: 400,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    textDecoration: 'none',
  };
  const linkRow: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'clamp(18px,2.2vw,36px)',
  };

  return (
    <nav style={bar}>
      <a href="#hero" style={brand}>
        <span style={{ color: C.gold, fontStyle: 'italic' }}>Dent&apos;Or</span>
      </a>
      <div style={linkRow} className="r284-navlinks">
        {links.map((l) => (
          <NavLink key={l.label} label={l.label} href={l.href} />
        ))}
      </div>
      <div className="r284-navcta">
        <a href="#bilan" style={{ textDecoration: 'none' }}>
          <GoldButton small filled>Bilan gratuit</GoldButton>
        </a>
      </div>
      <style>{`
        @media (max-width: 860px) {
          .r284-navlinks { display: none !important; }
          .r284-navcta { display: none !important; }
        }
      `}</style>
    </nav>
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
        color: h ? C.gold : 'rgba(255,255,255,0.9)',
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
          background: C.gold,
          transition: 'width .5s cubic-bezier(.16,1,.3,1)',
        }}
      />
    </a>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   1 · HERO SECTION — Élégant, haut de gamme
   ════════════════════════════════════════════════════════════════════════════ */
function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.10]);
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);
  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '-42%']);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.68], [1, 0]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.16], [1, 0]);

  const section: React.CSSProperties = {
    position: 'relative',
    height: '100vh',
    minHeight: 660,
    overflow: 'hidden',
    background: C.navyDeep,
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
          src={PHOTO.cabinet}
          alt="Cabinet Dent'Or — Cabinet dentaire haut de gamme à Bordeaux Chartrons"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </motion.div>

      {/* Voiles dégradés */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(7,24,41,0.52) 0%, rgba(7,24,41,0.12) 35%, rgba(7,24,41,0.50) 68%, rgba(7,24,41,0.92) 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(130% 90% at 50% 20%, transparent 38%, rgba(12,35,64,0.48) 100%)',
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
          padding: '0 clamp(20px,6vw,80px)',
          y: titleY,
          opacity: titleOpacity,
        }}
      >
        <Reveal y={18}>
          <Eyebrow color={C.goldLight} align="center">
            Cabinet dentaire · Bordeaux Chartrons
          </Eyebrow>
        </Reveal>

        <motion.h1
          initial={{ opacity: 0, y: 44 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: EASE, delay: 0.12 }}
          style={{
            fontFamily: SERIF,
            fontWeight: 400,
            color: C.white,
            fontSize: 'clamp(50px, 8.5vw, 130px)',
            lineHeight: 0.97,
            letterSpacing: '-0.01em',
            margin: '28px 0 22px',
            textShadow: '0 14px 60px rgba(0,0,0,0.45)',
          }}
        >
          Le sourire que{' '}
          <span style={{ fontStyle: 'italic', color: C.goldLight }}>
            vous méritez
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.40 }}
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 'clamp(16px, 1.9vw, 22px)',
            color: 'rgba(255,255,255,0.86)',
            maxWidth: 580,
            lineHeight: 1.62,
          }}
        >
          Implantologie avancée, orthodontie invisible et esthétique dentaire —
          au cœur des Chartrons, par une équipe passionnée et ultra-équipée.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.68 }}
          style={{ marginTop: 44, display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <GoldButton filled>
            <a href="#bilan" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: 8 }}>
              Bilan sourire gratuit
            </a>
          </GoldButton>
          <GoldButton>
            <a href="#soins" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: 8 }}>
              Nos spécialités
            </a>
          </GoldButton>
        </motion.div>

        {/* Badges de confiance */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: EASE, delay: 1.0 }}
          style={{
            display: 'flex',
            gap: 'clamp(18px,3vw,44px)',
            marginTop: 56,
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {[
            { val: '98%', label: 'Patients satisfaits' },
            { val: '15 ans', label: "d'expérience" },
            { val: '+800', label: 'Implants posés' },
          ].map((b) => (
            <div key={b.label} style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  fontSize: 'clamp(26px,3vw,40px)',
                  color: C.goldLight,
                  lineHeight: 1,
                }}
              >
                {b.val}
              </div>
              <div
                style={{
                  fontFamily: SANS,
                  fontSize: 10,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.60)',
                  marginTop: 8,
                  fontWeight: 500,
                }}
              >
                {b.label}
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
          gap: 9,
          opacity: cueOpacity,
        }}
      >
        <span
          style={{
            fontFamily: SANS,
            fontSize: 10,
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.68)',
            fontWeight: 500,
          }}
        >
          Découvrir
        </span>
        <motion.div
          animate={{ y: [0, 9, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={20} color={C.goldLight} strokeWidth={1.3} />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   2 · SCROLL CROSSFADE — 3 visuels en sticky 320vh
   ════════════════════════════════════════════════════════════════════════════ */
type CrossSlide = {
  src: string;
  alt: string;
  index: string;
  title: string;
  sub: string;
};

const CROSS_SLIDES: CrossSlide[] = [
  {
    src: PHOTO.cabinet,
    alt: 'Fauteuil dentaire dernier cri au cabinet Dent\'Or',
    index: 'I',
    title: 'Un cadre d\'exception',
    sub: 'Fauteuil dernière génération, luminosité étudiée, confort absolu à chaque rendez-vous.',
  },
  {
    src: PHOTO.sourire,
    alt: 'Sourire parfait après traitement au cabinet Dent\'Or',
    index: 'II',
    title: 'Le sourire parfait',
    sub: 'Des résultats esthétiques naturels, durables et adaptés à votre personnalité.',
  },
  {
    src: PHOTO.traitement,
    alt: 'Radio panoramique numérique 3D au cabinet Dent\'Or',
    index: 'III',
    title: 'Imagerie numérique 3D',
    sub: 'Diagnostic de précision par scanner CBCT pour des traitements planifiés à la fraction de millimètre.',
  },
];

function CrossSlideImage({
  slide,
  i,
  total,
  progress,
}: {
  slide: CrossSlide;
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
  const scale = useTransform(progress, [start - fadeIn, end], [1.13, 1.0]);

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

function CrossSlideCaption({
  slide,
  i,
  total,
  progress,
}: {
  slide: CrossSlide;
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
        padding: '0 clamp(20px,6vw,80px)',
        opacity,
        y,
      }}
    >
      <span
        style={{
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontSize: 'clamp(36px, 8vw, 110px)',
          color: 'rgba(212,175,55,0.30)',
          lineHeight: 1,
          marginBottom: 6,
        }}
      >
        {slide.index}
      </span>
      <h2
        style={{
          fontFamily: SERIF,
          fontSize: 'clamp(36px, 6.5vw, 90px)',
          fontWeight: 400,
          color: C.white,
          lineHeight: 1.02,
          margin: 0,
          textShadow: '0 8px 40px rgba(0,0,0,0.55)',
        }}
      >
        {slide.title}
      </h2>
      <p
        style={{
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontSize: 'clamp(15px, 1.7vw, 20px)',
          color: 'rgba(255,255,255,0.84)',
          marginTop: 18,
          maxWidth: 480,
          lineHeight: 1.7,
        }}
      >
        {slide.sub}
      </p>
    </motion.div>
  );
}

function ScrollCrossfade() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  return (
    <section
      ref={ref}
      style={{ height: '320vh', position: 'relative', background: C.navyDeep }}
    >
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        {CROSS_SLIDES.map((s, i) => (
          <CrossSlideImage
            key={s.index}
            slide={s}
            i={i}
            total={CROSS_SLIDES.length}
            progress={scrollYProgress}
          />
        ))}
        {/* Voile lisibilité */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to bottom, rgba(7,24,41,0.30), rgba(7,24,41,0.08) 42%, rgba(7,24,41,0.62))',
          }}
        />
        {CROSS_SLIDES.map((s, i) => (
          <CrossSlideCaption
            key={s.index}
            slide={s}
            i={i}
            total={CROSS_SLIDES.length}
            progress={scrollYProgress}
          />
        ))}

        {/* Progress dots animés */}
        <div
          style={{
            position: 'absolute',
            bottom: 38,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 12,
          }}
        >
          {CROSS_SLIDES.map((s, i) => (
            <ProgressDot
              key={s.index}
              i={i}
              total={CROSS_SLIDES.length}
              progress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </section>
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
    <motion.div style={{ height: 2, width, background: C.gold, opacity }} />
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   3 · SOINS SECTION — 3 spécialités
   ════════════════════════════════════════════════════════════════════════════ */
type Soin = {
  icon: React.ReactNode;
  titre: string;
  description: string;
  details: string[];
  cta: string;
};

const SOINS: Soin[] = [
  {
    icon: <Smile size={32} strokeWidth={1.4} color={C.gold} />,
    titre: 'Implantologie',
    description:
      'Retrouvez une dentition complète et fonctionnelle grâce à des implants en titane de dernière génération, posés par un chirurgien-dentiste spécialisé.',
    details: [
      'Implants unitaires et bridges sur implants',
      'Technique guidée par scanner 3D CBCT',
      'Mise en charge immédiate possible',
      'Garantie 10 ans sur nos implants',
    ],
    cta: 'Consulter pour un implant',
  },
  {
    icon: <Star size={32} strokeWidth={1.4} color={C.gold} />,
    titre: 'Orthodontie invisible',
    description:
      'Alignez vos dents discrètement avec des gouttières Invisalign sur-mesure, confortables et amovibles. Traitement adapté aux adolescents et adultes.',
    details: [
      'Gouttières Invisalign certifiées',
      'Traitement adulte et adolescent',
      'Suivi digital et simulation 3D',
      'Résultats en 6 à 18 mois',
    ],
    cta: 'Simuler mon sourire',
  },
  {
    icon: <Sparkles size={32} strokeWidth={1.4} color={C.gold} />,
    titre: 'Blanchiment & esthétique',
    description:
      'Facettes en céramique, blanchiment professionnel et composite : révélez l'éclat de votre sourire avec des techniques douces et durables.',
    details: [
      'Facettes céramique ultra-minces',
      'Blanchiment au laser Phillips Zoom',
      'Composite stratifié naturel',
      'Résultats immédiats et durables',
    ],
    cta: 'Découvrir les soins esthétiques',
  },
];

function SoinCard({ soin, i }: { soin: Soin; i: number }) {
  const [hover, setHover] = useState(false);
  const card: React.CSSProperties = {
    background: hover ? C.navy : C.white,
    border: `1px solid ${hover ? C.gold : C.pearlDeep}`,
    padding: 'clamp(30px,4vw,48px)',
    transition: 'all .6s cubic-bezier(.16,1,.3,1)',
    transform: hover ? 'translateY(-10px)' : 'none',
    boxShadow: hover
      ? `0 36px 72px -28px rgba(12,35,64,0.28)`
      : '0 10px 32px -22px rgba(12,35,64,0.18)',
    cursor: 'pointer',
    height: '100%',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
  };
  return (
    <Reveal delay={i * 0.10} style={{ height: '100%' }}>
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
            background: hover ? 'rgba(212,175,55,0.15)' : 'rgba(212,175,55,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 24,
            transition: 'background .5s',
          }}
        >
          {soin.icon}
        </div>
        <h3
          style={{
            fontFamily: SERIF,
            fontSize: 'clamp(24px,2.6vw,32px)',
            fontWeight: 400,
            color: hover ? C.white : C.navy,
            margin: '0 0 14px',
            transition: 'color .5s',
          }}
        >
          {soin.titre}
        </h3>
        <p
          style={{
            fontFamily: SANS,
            fontSize: 15,
            lineHeight: 1.72,
            color: hover ? 'rgba(255,255,255,0.78)' : 'rgba(10,26,46,0.70)',
            margin: '0 0 24px',
            flex: 1,
            transition: 'color .5s',
          }}
        >
          {soin.description}
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
          {soin.details.map((d) => (
            <li
              key={d}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                fontFamily: SANS,
                fontSize: 13.5,
                color: hover ? 'rgba(255,255,255,0.72)' : 'rgba(10,26,46,0.68)',
                transition: 'color .5s',
              }}
            >
              <CheckCircle
                size={15}
                color={C.gold}
                strokeWidth={2}
                style={{ flexShrink: 0, marginTop: 2 }}
              />
              {d}
            </li>
          ))}
        </ul>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 9,
            fontFamily: SANS,
            fontSize: 11,
            letterSpacing: '0.20em',
            textTransform: 'uppercase',
            color: hover ? C.goldLight : C.gold,
            fontWeight: 600,
            transition: 'color .4s',
          }}
        >
          {soin.cta}
          <ArrowRight
            size={13}
            style={{
              transform: hover ? 'translateX(5px)' : 'none',
              transition: 'transform .5s cubic-bezier(.16,1,.3,1)',
            }}
          />
        </div>
      </article>
    </Reveal>
  );
}

function SoinsSection() {
  const sec: React.CSSProperties = {
    background: C.fog,
    padding: 'clamp(90px,13vw,180px) clamp(24px,6vw,90px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: 'clamp(22px,3vw,40px)',
    maxWidth: 1260,
    margin: '0 auto',
  };
  return (
    <section style={sec} id="soins">
      <div style={{ maxWidth: 1260, margin: '0 auto 60px', textAlign: 'center' }}>
        <Reveal>
          <Eyebrow color={C.navyMid} align="center">
            Nos spécialités
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(34px,5.5vw,70px)',
              fontWeight: 400,
              color: C.navy,
              margin: '20px 0 16px',
              lineHeight: 1.06,
            }}
          >
            Des soins d&apos;excellence pour{' '}
            <span style={{ fontStyle: 'italic', color: C.navyMid }}>
              chaque sourire
            </span>
          </h2>
        </Reveal>
        <Reveal delay={0.14}>
          <p
            style={{
              fontFamily: SANS,
              fontSize: 'clamp(16px,1.6vw,18px)',
              lineHeight: 1.7,
              color: 'rgba(10,26,46,0.64)',
              maxWidth: 580,
              margin: '0 auto',
            }}
          >
            Implantologie avancée, orthodontie invisible et esthétique dentaire —
            nous réunissons les meilleures techniques sous un même toit, dans le
            quartier des Chartrons à Bordeaux.
          </p>
        </Reveal>
      </div>
      <div style={grid}>
        {SOINS.map((s, i) => (
          <SoinCard key={s.titre} soin={s} i={i} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   4 · TECHNIQUE SECTION — sticky photo gauche + scroll 4 techniques
   ════════════════════════════════════════════════════════════════════════════ */
type Technique = {
  num: string;
  titre: string;
  corps: string;
};

const TECHNIQUES: Technique[] = [
  {
    num: '01',
    titre: 'Radio panoramique 3D (CBCT)',
    corps:
      'Notre scanner cone-beam (CBCT) génère un volume 3D complet de votre mâchoire en 14 secondes, avec une dose de rayonnement 10× inférieure à un scanner médical traditionnel. Chaque implant, chaque traitement parodontal est planifié dans le volume, non sur une radio 2D.',
  },
  {
    num: '02',
    titre: 'Scanner d\'empreinte intraoral',
    corps:
      'Fini les empreintes à l'alginate ! Notre scanner iTero Element 5D réalise une empreinte numérique précise à 20 microns en quelques minutes. Le modèle 3D est transmis directement au laboratoire de prothèse pour des couronnes et facettes ajustées au dixième de millimètre.',
  },
  {
    num: '03',
    titre: 'Pose d\'implant guidée par ordinateur',
    corps:
      'À partir du CBCT, nous concevons un guide chirurgical stéréolithographique qui positionne l'implant exactement à l'endroit planifié — à 0,2 mm près. La chirurgie sans lambeaux (flapless) réduit le temps d'intervention, les suites post-opératoires et accélère la cicatrisation.',
  },
  {
    num: '04',
    titre: 'Gouttières Invisalign sur-mesure',
    corps:
      'Certifiés Invisalign Diamond Provider, nous planifions votre traitement sur le logiciel ClinCheck et vous projetons le résultat final avant de commencer. Chaque série de gouttières déplace vos dents de 0,25 mm selon un plan de force biomécanique optimal, pour un résultat prévisible et durable.',
  },
];

function TechniqueSection() {
  const sec: React.CSSProperties = {
    background: C.white,
    padding: 'clamp(80px,11vw,150px) clamp(24px,6vw,90px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '0.9fr 1.1fr',
    gap: 'clamp(40px,6vw,96px)',
    maxWidth: 1260,
    margin: '0 auto',
    alignItems: 'start',
  };
  const sticky: React.CSSProperties = {
    position: 'sticky',
    top: 90,
    alignSelf: 'start',
  };

  return (
    <section style={sec} id="techniques">
      <div style={grid} className="r284-techgrid">
        {/* Photo collante du dentiste */}
        <div style={sticky} className="r284-tech-sticky">
          <div
            style={{
              overflow: 'hidden',
              border: `1px solid ${C.pearlDeep}`,
              aspectRatio: '4 / 5',
              position: 'relative',
            }}
          >
            <img
              src={PHOTO.dentiste}
              alt="Dr. Mathieu Prévost, chirurgien-dentiste à Bordeaux Chartrons"
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '28px 26px',
                background:
                  'linear-gradient(to top, rgba(7,24,41,0.88) 0%, transparent 100%)',
              }}
            >
              <div
                style={{
                  fontFamily: SANS,
                  fontSize: 10.5,
                  letterSpacing: '0.24em',
                  textTransform: 'uppercase',
                  color: C.gold,
                  marginBottom: 6,
                  fontWeight: 600,
                }}
              >
                Notre chirurgien-dentiste
              </div>
              <div
                style={{
                  fontFamily: SERIF,
                  fontSize: 22,
                  fontWeight: 400,
                  color: C.white,
                }}
              >
                Dr. Mathieu Prévost
              </div>
              <div
                style={{
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  fontSize: 14,
                  color: 'rgba(255,255,255,0.72)',
                  marginTop: 4,
                }}
              >
                Implantologie & Esthétique dentaire
              </div>
            </div>
          </div>
          <div
            style={{
              marginTop: 20,
              padding: '20px 24px',
              background: C.fog,
              border: `1px solid ${C.pearl}`,
            }}
          >
            <div
              style={{
                fontFamily: SERIF,
                fontStyle: 'italic',
                fontSize: 16,
                color: 'rgba(10,26,46,0.78)',
                lineHeight: 1.7,
              }}
            >
              « Ma conviction : chaque patient mérite une explication complète
              de son traitement et des résultats prévisibles grâce à la
              technologie numérique. »
            </div>
          </div>
        </div>

        {/* Techniques qui défilent */}
        <div>
          <Reveal>
            <Eyebrow color={C.navyMid}>Nos technologies</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(32px,4.5vw,60px)',
                fontWeight: 400,
                color: C.navy,
                margin: '20px 0 52px',
                lineHeight: 1.07,
              }}
            >
              La précision au{' '}
              <span style={{ fontStyle: 'italic', color: C.navyMid }}>
                micron près
              </span>
            </h2>
          </Reveal>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {TECHNIQUES.map((t, i) => (
              <Reveal key={t.num} delay={0.05 * i}>
                <div
                  style={{
                    padding: 'clamp(26px,3.5vw,40px) 0',
                    borderTop: `1px solid ${C.pearl}`,
                    display: 'flex',
                    gap: 'clamp(20px,3vw,36px)',
                    alignItems: 'flex-start',
                  }}
                >
                  <span
                    style={{
                      fontFamily: SERIF,
                      fontStyle: 'italic',
                      fontSize: 'clamp(26px,3vw,40px)',
                      color: 'rgba(212,175,55,0.55)',
                      lineHeight: 1,
                      minWidth: 48,
                      paddingTop: 2,
                    }}
                  >
                    {t.num}
                  </span>
                  <div>
                    <h3
                      style={{
                        fontFamily: SERIF,
                        fontSize: 'clamp(19px,2.2vw,26px)',
                        fontWeight: 400,
                        color: C.navy,
                        margin: '0 0 12px',
                      }}
                    >
                      {t.titre}
                    </h3>
                    <p
                      style={{
                        fontFamily: SANS,
                        fontSize: 15,
                        lineHeight: 1.76,
                        color: 'rgba(10,26,46,0.68)',
                        margin: 0,
                      }}
                    >
                      {t.corps}
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
          .r284-techgrid { grid-template-columns: 1fr !important; }
          .r284-tech-sticky { position: static !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   5 · TESTIMONIALS SECTION — 3 témoignages patients
   ════════════════════════════════════════════════════════════════════════════ */
type Temoignage = {
  quote: string;
  prenom: string;
  role: string;
  resultat: string;
  etoiles: number;
};

const TEMOIGNAGES: Temoignage[] = [
  {
    quote:
      "Après des années à sourire la bouche fermée, deux implants ont tout changé. La mise en charge immédiate m'a permis de repartir avec une couronne provisoire dès le lendemain de l'intervention. Le résultat définitif est bluffant de naturel — aucun de mes proches ne devine que ce n'est pas ma vraie dent.",
    prenom: 'Sophie R.',
    role: 'Cadre, 52 ans · Bordeaux',
    resultat: 'Implant unitaire + couronne céramique',
    etoiles: 5,
  },
  {
    quote:
      "J'avais honte de mes dents de travers à 38 ans. En 14 mois de gouttières Invisalign, mes dents sont parfaitement alignées sans que personne ne s'en soit aperçu au bureau. La simulation 3D avant de commencer m'a totalement convaincue — voir le résultat final avant de signer, c'est rassurant.",
    prenom: 'Camille D.',
    role: 'Architecte, 38 ans · Mérignac',
    resultat: 'Orthodontie Invisalign adulte — 14 mois',
    etoiles: 5,
  },
  {
    quote:
      "Le blanchiment Phillips Zoom suivi de 6 facettes en céramique : le résultat est spectaculaire mais complètement naturel. Dr Prévost a pris le temps de choisir la teinte avec moi, et le laboratoire a réalisé des facettes ultra-fines qui respectent ma morphologie dentaire. Je souris enfin librement.",
    prenom: 'Antoine M.',
    role: 'Avocat, 44 ans · Bordeaux Chartrons',
    resultat: 'Blanchiment + 6 facettes céramique',
    etoiles: 5,
  },
];

function TestimonialsSection() {
  const sec: React.CSSProperties = {
    background: C.navy,
    padding: 'clamp(90px,12vw,170px) clamp(24px,6vw,90px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: 'clamp(24px,3vw,40px)',
    maxWidth: 1260,
    margin: '0 auto',
  };
  return (
    <section style={sec} id="temoignages">
      <div style={{ maxWidth: 1260, margin: '0 auto 60px', textAlign: 'center' }}>
        <Reveal>
          <Eyebrow color={C.goldLight} align="center">
            Témoignages patients
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(32px,5vw,64px)',
              fontWeight: 400,
              color: C.white,
              margin: '20px 0 0',
              lineHeight: 1.06,
            }}
          >
            Ce que disent nos{' '}
            <span style={{ fontStyle: 'italic', color: C.goldLight }}>
              patients
            </span>
          </h2>
        </Reveal>
      </div>
      <div style={grid}>
        {TEMOIGNAGES.map((t, i) => (
          <Reveal key={t.prenom} delay={i * 0.10} style={{ height: '100%' }}>
            <figure
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid rgba(212,175,55,0.22)`,
                padding: 'clamp(30px,4vw,46px)',
                margin: 0,
                height: '100%',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Étoiles */}
              <div style={{ display: 'flex', gap: 5, marginBottom: 20 }}>
                {Array.from({ length: t.etoiles }).map((_, s) => (
                  <Star key={s} size={15} fill={C.gold} color={C.gold} strokeWidth={0} />
                ))}
              </div>
              {/* Badge résultat */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'rgba(212,175,55,0.12)',
                  border: `1px solid rgba(212,175,55,0.30)`,
                  padding: '7px 14px',
                  marginBottom: 22,
                  alignSelf: 'flex-start',
                }}
              >
                <CheckCircle size={13} color={C.gold} strokeWidth={2} />
                <span
                  style={{
                    fontFamily: SANS,
                    fontSize: 11,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: C.gold,
                    fontWeight: 600,
                  }}
                >
                  {t.resultat}
                </span>
              </div>
              <blockquote
                style={{
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  fontSize: 'clamp(15px,1.6vw,18px)',
                  lineHeight: 1.72,
                  color: 'rgba(255,255,255,0.84)',
                  margin: '0 0 26px',
                  flex: 1,
                }}
              >
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption
                style={{
                  borderTop: '1px solid rgba(212,175,55,0.18)',
                  paddingTop: 20,
                }}
              >
                <div
                  style={{
                    fontFamily: SERIF,
                    fontSize: 18,
                    fontWeight: 400,
                    color: C.white,
                  }}
                >
                  {t.prenom}
                </div>
                <div
                  style={{
                    fontFamily: SANS,
                    fontSize: 11,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.48)',
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
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   6 · BILAN FORM SECTION — Formulaire bilan sourire gratuit
   ════════════════════════════════════════════════════════════════════════════ */
function BilanFormSection() {
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [besoin, setBesoin] = useState('');
  const [dateSouhaitee, setDateSouhaitee] = useState('');
  const [sent, setSent] = useState(false);

  const onSubmit = () => {
    if (!prenom || !nom || !telephone || !besoin) return;
    setSent(true);
  };

  const sec: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    background: C.fog,
    padding: 'clamp(90px,13vw,180px) clamp(24px,6vw,90px)',
  };
  const fieldStyle: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    background: C.white,
    border: `1px solid ${C.pearl}`,
    borderBottom: `2px solid ${C.pearlDeep}`,
    padding: '14px 18px',
    fontFamily: SANS,
    fontSize: 15,
    color: C.ink,
    outline: 'none',
    transition: 'border-color .3s',
  };
  const labelStyle: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 11,
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    color: C.navyMid,
    fontWeight: 600,
    display: 'block',
    marginBottom: 7,
  };

  return (
    <section style={sec} id="bilan">
      {/* Motif décoratif */}
      <div
        style={{
          position: 'absolute',
          top: -120,
          right: -120,
          width: 520,
          height: 520,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,175,55,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: 780,
          margin: '0 auto',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <Reveal>
            <Eyebrow color={C.navyMid} align="center">
              Bilan sourire gratuit
            </Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(34px,5.5vw,68px)',
                fontWeight: 400,
                color: C.navy,
                margin: '20px 0 16px',
                lineHeight: 1.06,
              }}
            >
              Votre{' '}
              <span style={{ fontStyle: 'italic', color: C.navyMid }}>
                premier pas
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.14}>
            <p
              style={{
                fontFamily: SANS,
                fontSize: 'clamp(15px,1.6vw,17px)',
                lineHeight: 1.74,
                color: 'rgba(10,26,46,0.64)',
                maxWidth: 520,
                margin: '0 auto',
              }}
            >
              Un bilan complet de 30 minutes offert : examen clinique, radiographie
              panoramique et présentation des solutions adaptées à votre sourire —
              sans engagement.
            </p>
          </Reveal>
        </div>

        {sent ? (
          <Reveal>
            <div
              style={{
                background: C.white,
                border: `1px solid rgba(212,175,55,0.45)`,
                padding: 'clamp(40px,5vw,60px)',
                textAlign: 'center',
                boxShadow: '0 20px 60px -30px rgba(12,35,64,0.16)',
              }}
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  background: 'rgba(212,175,55,0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                }}
              >
                <Smile size={32} color={C.gold} strokeWidth={1.4} />
              </div>
              <h3
                style={{
                  fontFamily: SERIF,
                  fontSize: 30,
                  fontWeight: 400,
                  color: C.navy,
                  margin: '0 0 14px',
                }}
              >
                Merci {prenom}&nbsp;!
              </h3>
              <p
                style={{
                  fontFamily: SANS,
                  fontSize: 15,
                  lineHeight: 1.7,
                  color: 'rgba(10,26,46,0.68)',
                  maxWidth: 440,
                  margin: '0 auto 0',
                }}
              >
                Votre demande de bilan sourire a bien été reçue. Notre secrétariat
                vous rappellera au{' '}
                <strong style={{ color: C.navy }}>{telephone}</strong> dans les 24h
                pour confirmer votre rendez-vous.
              </p>
              {dateSouhaitee && (
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    marginTop: 24,
                    background: C.fog,
                    padding: '10px 18px',
                    fontFamily: SANS,
                    fontSize: 13,
                    color: C.navyMid,
                    fontWeight: 500,
                  }}
                >
                  <Clock size={14} color={C.gold} strokeWidth={2} />
                  Date souhaitée : {dateSouhaitee}
                </div>
              )}
            </div>
          </Reveal>
        ) : (
          <Reveal delay={0.20}>
            <div
              style={{
                background: C.white,
                border: `1px solid ${C.pearl}`,
                padding: 'clamp(34px,4.5vw,56px)',
                boxShadow: '0 16px 50px -24px rgba(12,35,64,0.14)',
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 22,
                  marginBottom: 22,
                }}
                className="r284-formgrid"
              >
                <div>
                  <label style={labelStyle} htmlFor="do284-prenom">
                    Prénom
                  </label>
                  <input
                    id="do284-prenom"
                    style={fieldStyle}
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    placeholder="Marie"
                    autoComplete="given-name"
                  />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="do284-nom">
                    Nom
                  </label>
                  <input
                    id="do284-nom"
                    style={fieldStyle}
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    placeholder="Dupont"
                    autoComplete="family-name"
                  />
                </div>
              </div>
              <div style={{ marginBottom: 22 }}>
                <label style={labelStyle} htmlFor="do284-tel">
                  Téléphone
                </label>
                <input
                  id="do284-tel"
                  style={fieldStyle}
                  type="tel"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  placeholder="06 00 00 00 00"
                  autoComplete="tel"
                />
              </div>
              <div style={{ marginBottom: 22 }}>
                <label style={labelStyle} htmlFor="do284-besoin">
                  Mon besoin principal
                </label>
                <select
                  id="do284-besoin"
                  style={{
                    ...fieldStyle,
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    cursor: 'pointer',
                    color: besoin ? C.ink : 'rgba(10,26,46,0.40)',
                    background: C.white,
                  }}
                  value={besoin}
                  onChange={(e) => setBesoin(e.target.value)}
                >
                  <option value="">Sélectionner un besoin…</option>
                  <option value="Implant dentaire">Implant dentaire</option>
                  <option value="Appareil dentaire invisible">Appareil dentaire invisible</option>
                  <option value="Blanchiment des dents">Blanchiment des dents</option>
                  <option value="Urgence dentaire">Urgence dentaire</option>
                  <option value="Contrôle et détartrage">Contrôle et détartrage</option>
                </select>
              </div>
              <div style={{ marginBottom: 34 }}>
                <label style={labelStyle} htmlFor="do284-date">
                  Date souhaitée (optionnel)
                </label>
                <input
                  id="do284-date"
                  style={fieldStyle}
                  type="date"
                  value={dateSouhaitee}
                  onChange={(e) => setDateSouhaitee(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div style={{ textAlign: 'center' }}>
                <GoldButton filled onClick={onSubmit} type="button">
                  Demander mon bilan gratuit
                </GoldButton>
                <p
                  style={{
                    fontFamily: SANS,
                    fontSize: 12,
                    color: 'rgba(10,26,46,0.44)',
                    marginTop: 16,
                    lineHeight: 1.6,
                  }}
                >
                  Bilan offert, sans engagement. Notre secrétariat vous rappelle
                  dans les 24h ouvrées.
                </p>
              </div>
            </div>
          </Reveal>
        )}
      </div>
      <style>{`
        @media (max-width: 860px) {
          .r284-formgrid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   7 · FINANCEMENT SECTION — Solutions financement
   ════════════════════════════════════════════════════════════════════════════ */
type Finance = {
  icon: React.ReactNode;
  titre: string;
  corps: string;
};

const FINANCES: Finance[] = [
  {
    icon: <Shield size={28} strokeWidth={1.4} color={C.gold} />,
    titre: 'CB en 3-4× sans frais',
    corps:
      'Réglez vos soins en 3 ou 4 fois par carte bancaire, sans frais supplémentaires. Disponible à partir de 300 € et jusqu'à 3 000 €.',
  },
  {
    icon: <CheckCircle size={28} strokeWidth={1.4} color={C.gold} />,
    titre: 'Cetelem Santé',
    corps:
      'Pour les traitements de plus grande ampleur, nous proposons le crédit Cetelem Santé — de 6 à 48 mensualités avec des taux préférentiels, sous réserve d'acceptation.',
  },
  {
    icon: <Star size={28} strokeWidth={1.4} color={C.gold} />,
    titre: 'Mutuelle 100% Santé',
    corps:
      'Couronnes, prothèses et implants : nous vous guidons pour maximiser vos remboursements mutuelle selon le panier 100% Santé. Devis détaillé transmis à votre assureur.',
  },
  {
    icon: <Activity size={28} strokeWidth={1.4} color={C.gold} />,
    titre: 'Devis détaillé transparent',
    corps:
      'Avant chaque traitement, vous recevez un devis détaillé par acte avec le code CCAM, le tarif sécu et votre reste-à-charge estimé après remboursement. Aucune surprise.',
  },
];

function FinancementSection() {
  const sec: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    background: C.navyDeep,
    padding: 'clamp(90px,13vw,180px) clamp(24px,6vw,90px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: 'clamp(20px,2.8vw,36px)',
    maxWidth: 1260,
    margin: '0 auto',
  };

  return (
    <section style={sec} id="financement">
      <div
        style={{
          position: 'absolute',
          bottom: -180,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 700,
          height: 700,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(20,50,96,0.5) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div style={{ maxWidth: 1260, margin: '0 auto 60px', textAlign: 'center', position: 'relative', zIndex: 2 }}>
        <Reveal>
          <Eyebrow color={C.goldLight} align="center">
            Financement & Remboursements
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(32px,5vw,64px)',
              fontWeight: 400,
              color: C.white,
              margin: '20px 0 16px',
              lineHeight: 1.06,
            }}
          >
            Prendre soin de soi ne doit pas{' '}
            <span style={{ fontStyle: 'italic', color: C.goldLight }}>
              coûter cher
            </span>
          </h2>
        </Reveal>
        <Reveal delay={0.14}>
          <p
            style={{
              fontFamily: SANS,
              fontSize: 'clamp(15px,1.5vw,17px)',
              lineHeight: 1.72,
              color: 'rgba(255,255,255,0.60)',
              maxWidth: 560,
              margin: '0 auto',
            }}
          >
            Nous proposons plusieurs solutions pour rendre vos soins accessibles,
            sans compromis sur la qualité.
          </p>
        </Reveal>
      </div>
      <div style={{ ...grid, position: 'relative', zIndex: 2 }}>
        {FINANCES.map((f, i) => (
          <Reveal key={f.titre} delay={i * 0.08} style={{ height: '100%' }}>
            <div
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid rgba(212,175,55,0.18)`,
                padding: 'clamp(26px,3.5vw,40px)',
                height: '100%',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: 'rgba(212,175,55,0.10)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {f.icon}
              </div>
              <h3
                style={{
                  fontFamily: SERIF,
                  fontSize: 'clamp(18px,2vw,22px)',
                  fontWeight: 400,
                  color: C.white,
                  margin: 0,
                }}
              >
                {f.titre}
              </h3>
              <p
                style={{
                  fontFamily: SANS,
                  fontSize: 14.5,
                  lineHeight: 1.74,
                  color: 'rgba(255,255,255,0.60)',
                  margin: 0,
                  flex: 1,
                }}
              >
                {f.corps}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   8 · TECHNO SECTION — 4 équipements du cabinet
   ════════════════════════════════════════════════════════════════════════════ */
type Equip = {
  icon: React.ReactNode;
  nom: string;
  description: string;
  badge: string;
};

const EQUIPEMENTS: Equip[] = [
  {
    icon: <Camera size={30} strokeWidth={1.4} color={C.gold} />,
    nom: 'Scanner CBCT 3D',
    description:
      'Cone Beam Computed Tomography : visualisation volumétrique complète des dents, racines, os alvéolaire et sinus en une seule acquisition, avec une dose de rayonnement minimale.',
    badge: 'Vatech Green 16',
  },
  {
    icon: <Zap size={30} strokeWidth={1.4} color={C.gold} />,
    nom: 'Scanner intraoral',
    description:
      'L'iTero Element 5D capte 6 000 images par seconde pour reconstituer une empreinte 3D parfaite en moins de 3 minutes. Visualisation NIRI des caries proximales sans radiation.',
    badge: 'iTero Element 5D',
  },
  {
    icon: <Activity size={30} strokeWidth={1.4} color={C.gold} />,
    nom: 'Laser dentaire',
    description:
      'Notre laser Er:YAG remplace le bistouri pour les chirurgies parodontales et les décontaminations d'implants — cicatrisation accélérée, moins de douleurs, pas de points de suture.',
    badge: 'Fotona LightWalker',
  },
  {
    icon: <Shield size={30} strokeWidth={1.4} color={C.gold} />,
    nom: 'Fauteuil connecté',
    description:
      'Fauteuil Sirona Intego avec écran patient intégré, caméra intra-orale haute définition et connexion directe au dossier médical numérique pour un accès instantané à toute l'historique.',
    badge: 'Sirona Intego Pro',
  },
];

function TechnoSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);

  const sec: React.CSSProperties = {
    position: 'relative',
    background: C.white,
    padding: 'clamp(90px,12vw,160px) clamp(24px,6vw,90px)',
    overflow: 'hidden',
  };

  return (
    <section ref={ref} style={sec} id="techno">
      {/* Image décorative parallaxe */}
      <motion.div
        style={{
          position: 'absolute',
          right: 0,
          top: '-10%',
          width: '42%',
          height: '120%',
          y: bgY,
          opacity: 0.08,
          pointerEvents: 'none',
        }}
      >
        <img
          src={PHOTO.traitement}
          alt=""
          aria-hidden="true"
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </motion.div>

      <div style={{ maxWidth: 1260, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <div style={{ maxWidth: 680, marginBottom: 64 }}>
          <Reveal>
            <Eyebrow color={C.navyMid}>Technologies du cabinet</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(32px,5vw,64px)',
                fontWeight: 400,
                color: C.navy,
                margin: '20px 0 16px',
                lineHeight: 1.06,
              }}
            >
              Un arsenal technique{' '}
              <span style={{ fontStyle: 'italic', color: C.navyMid }}>
                de pointe
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.14}>
            <p
              style={{
                fontFamily: SANS,
                fontSize: 'clamp(15px,1.6vw,17px)',
                lineHeight: 1.74,
                color: 'rgba(10,26,46,0.62)',
              }}
            >
              Notre cabinet investit en permanence dans les technologies les plus
              récentes pour offrir des soins plus précis, moins invasifs et plus
              confortables à chaque patient.
            </p>
          </Reveal>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
            gap: 'clamp(18px,2.5vw,32px)',
          }}
        >
          {EQUIPEMENTS.map((e, i) => (
            <Reveal key={e.nom} delay={i * 0.08}>
              <div
                style={{
                  background: C.fog,
                  border: `1px solid ${C.pearl}`,
                  padding: 'clamp(24px,3.5vw,40px)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    background: 'rgba(212,175,55,0.09)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {e.icon}
                </div>
                <div>
                  <div
                    style={{
                      display: 'inline-block',
                      background: C.navy,
                      color: C.gold,
                      fontFamily: SANS,
                      fontSize: 10,
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      fontWeight: 600,
                      padding: '4px 10px',
                      marginBottom: 10,
                    }}
                  >
                    {e.badge}
                  </div>
                  <h3
                    style={{
                      fontFamily: SERIF,
                      fontSize: 'clamp(18px,2vw,22px)',
                      fontWeight: 400,
                      color: C.navy,
                      margin: '0 0 10px',
                    }}
                  >
                    {e.nom}
                  </h3>
                  <p
                    style={{
                      fontFamily: SANS,
                      fontSize: 14,
                      lineHeight: 1.74,
                      color: 'rgba(10,26,46,0.65)',
                      margin: 0,
                    }}
                  >
                    {e.description}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   9 · EQUIPE SECTION — Dr. principal + 2 assistantes
   ════════════════════════════════════════════════════════════════════════════ */
type Membre = {
  photo: string;
  prenom: string;
  nom: string;
  titre: string;
  bio: string;
  specialites: string[];
};

const EQUIPE: Membre[] = [
  {
    photo: PHOTO.dentiste,
    prenom: 'Dr. Mathieu',
    nom: 'Prévost',
    titre: 'Chirurgien-dentiste · Directeur du cabinet',
    bio: 'Diplômé de l'Université de Bordeaux en 2009, le Dr Prévost a complété sa formation par un diplôme universitaire d'implantologie à Paris et un certificat Invisalign Diamond. Il exerce aux Chartrons depuis 2014 avec une passion pour les traitements complexes et la dentisterie esthétique. Chaque patient bénéficie d'un plan de traitement individualisé et d'une explication détaillée des options disponibles.',
    specialites: ['Implantologie avancée', 'Facettes céramique', 'Invisalign Diamond Provider', 'Chirurgie parodontale'],
  },
  {
    photo: PHOTO.equipe,
    prenom: 'Camille',
    nom: 'Fontaine',
    titre: 'Assistante dentaire qualifiée',
    bio: 'Camille accompagne les patients depuis leur arrivée jusqu'à la fin de leur traitement. Spécialisée en implantologie, elle assiste le Dr Prévost lors des interventions chirurgicales et assure la coordination des rendez-vous de suivi. Sa bienveillance naturelle met à l'aise les patients les plus appréhensifs.',
    specialites: ['Assistance chirurgicale', 'Stérilisation', 'Accueil & coordination'],
  },
  {
    photo: PHOTO.consult,
    prenom: 'Inès',
    nom: 'Blanchard',
    titre: 'Assistante dentaire & secrétaire médicale',
    bio: 'Inès gère le secrétariat médical, les prises en charge mutuelle et l'accompagnement administratif des patients. Elle est votre interlocutrice privilégiée pour les devis, les remboursements et la prise de rendez-vous. Sa maîtrise des logiciels de facturation médicale assure des dossiers toujours à jour.',
    specialites: ['Gestion administrative', 'Suivi mutuelle & tiers payant', 'Devis & facturation CCAM'],
  },
];

function MembreCard({ m, i }: { m: Membre; i: number }) {
  const isDoctor = i === 0;
  return (
    <Reveal delay={i * 0.10} style={{ height: '100%' }}>
      <article
        style={{
          background: C.white,
          border: `1px solid ${C.pearl}`,
          overflow: 'hidden',
          height: '100%',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 10px 40px -24px rgba(12,35,64,0.14)',
        }}
      >
        <div
          style={{
            position: 'relative',
            aspectRatio: isDoctor ? '3 / 2' : '3 / 2',
            overflow: 'hidden',
          }}
        >
          <img
            src={m.photo}
            alt={`${m.prenom} ${m.nom} — ${m.titre}`}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to top, rgba(12,35,64,0.76) 0%, transparent 55%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 16,
              left: 20,
              right: 20,
            }}
          >
            <div
              style={{
                fontFamily: SERIF,
                fontSize: isDoctor ? 24 : 20,
                fontWeight: 400,
                color: C.white,
                lineHeight: 1.1,
              }}
            >
              {m.prenom} <span style={{ fontStyle: 'italic' }}>{m.nom}</span>
            </div>
          </div>
        </div>
        <div style={{ padding: 'clamp(20px,3vw,32px)', flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div
            style={{
              fontFamily: SANS,
              fontSize: 11,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: C.gold,
              fontWeight: 600,
            }}
          >
            {m.titre}
          </div>
          <p
            style={{
              fontFamily: SANS,
              fontSize: 14,
              lineHeight: 1.76,
              color: 'rgba(10,26,46,0.66)',
              margin: 0,
              flex: 1,
            }}
          >
            {m.bio}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
            {m.specialites.map((s) => (
              <span
                key={s}
                style={{
                  fontFamily: SANS,
                  fontSize: 11,
                  color: C.navyMid,
                  background: C.fog,
                  border: `1px solid ${C.pearl}`,
                  padding: '5px 11px',
                  fontWeight: 500,
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </article>
    </Reveal>
  );
}

function EquipeSection() {
  const sec: React.CSSProperties = {
    background: C.fog,
    padding: 'clamp(90px,12vw,160px) clamp(24px,6vw,90px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: 'clamp(22px,3vw,38px)',
    maxWidth: 1260,
    margin: '0 auto',
  };

  return (
    <section style={sec} id="equipe">
      <div style={{ maxWidth: 1260, margin: '0 auto 60px', textAlign: 'center' }}>
        <Reveal>
          <Eyebrow color={C.navyMid} align="center">
            Notre équipe
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(32px,5vw,64px)',
              fontWeight: 400,
              color: C.navy,
              margin: '20px 0 16px',
              lineHeight: 1.06,
            }}
          >
            Des professionnels à{' '}
            <span style={{ fontStyle: 'italic', color: C.navyMid }}>
              votre écoute
            </span>
          </h2>
        </Reveal>
        <Reveal delay={0.14}>
          <p
            style={{
              fontFamily: SANS,
              fontSize: 'clamp(15px,1.6vw,17px)',
              lineHeight: 1.72,
              color: 'rgba(10,26,46,0.62)',
              maxWidth: 520,
              margin: '0 auto',
            }}
          >
            Une équipe soudée, formée aux dernières techniques et dévouée à votre confort
            à chaque étape de votre parcours de soin.
          </p>
        </Reveal>
      </div>
      <div style={grid}>
        {EQUIPE.map((m, i) => (
          <MembreCard key={m.nom} m={m} i={i} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   10 · FOOTER SECTION — Logo, RPPS, adresse, urgences
   ════════════════════════════════════════════════════════════════════════════ */
function FooterSection() {
  const cols: { title: string; items: { label: string; href: string }[] }[] = [
    {
      title: 'Soins',
      items: [
        { label: 'Implantologie', href: '#soins' },
        { label: 'Orthodontie invisible', href: '#soins' },
        { label: 'Blanchiment & esthétique', href: '#soins' },
        { label: 'Urgence dentaire', href: '#bilan' },
        { label: 'Contrôle & détartrage', href: '#bilan' },
      ],
    },
    {
      title: 'Cabinet',
      items: [
        { label: 'Notre équipe', href: '#equipe' },
        { label: 'Nos technologies', href: '#techno' },
        { label: 'Financement', href: '#financement' },
        { label: 'Témoignages', href: '#temoignages' },
      ],
    },
    {
      title: 'Informations',
      items: [
        { label: 'Bilan gratuit', href: '#bilan' },
        { label: 'Prendre rendez-vous', href: '#bilan' },
        { label: 'Mentions légales', href: '#hero' },
        { label: 'Politique de confidentialité', href: '#hero' },
      ],
    },
  ];

  const foot: React.CSSProperties = {
    background: C.navy,
    borderTop: `1px solid rgba(212,175,55,0.20)`,
    padding: 'clamp(60px,8vw,100px) clamp(24px,6vw,90px) 36px',
  };

  return (
    <footer style={foot}>
      <div
        style={{
          maxWidth: 1260,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.6fr repeat(3, 1fr)',
          gap: 'clamp(30px,4.5vw,64px)',
        }}
        className="r284-footgrid"
      >
        {/* Brand bloc */}
        <div>
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 28,
              letterSpacing: '0.08em',
              color: C.white,
              display: 'flex',
              alignItems: 'center',
              gap: 0,
              marginBottom: 6,
            }}
          >
            <span style={{ color: C.gold, fontStyle: 'italic' }}>Dent&apos;Or</span>
          </div>
          <div
            style={{
              fontFamily: SANS,
              fontSize: 10.5,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.48)',
              fontWeight: 500,
              marginBottom: 20,
            }}
          >
            Cabinet dentaire · Bordeaux
          </div>
          <p
            style={{
              fontFamily: SANS,
              fontSize: 14,
              lineHeight: 1.72,
              color: 'rgba(255,255,255,0.56)',
              maxWidth: 320,
              margin: '0 0 22px',
            }}
          >
            Chirurgie dentaire, implantologie et esthétique dentaire au cœur des
            Chartrons. Cabinet numérique, équipe bienveillante.
          </p>
          {/* Infos pratiques */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                fontFamily: SANS,
                fontSize: 13.5,
                color: 'rgba(255,255,255,0.58)',
                lineHeight: 1.5,
              }}
            >
              <MapPin size={15} color={C.gold} strokeWidth={1.6} style={{ flexShrink: 0, marginTop: 2 }} />
              12 rue Notre-Dame, 33000 Bordeaux Chartrons
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                fontFamily: SANS,
                fontSize: 13.5,
                color: 'rgba(255,255,255,0.58)',
              }}
            >
              <Phone size={15} color={C.gold} strokeWidth={1.6} />
              05 56 XX XX XX
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                fontFamily: SANS,
                fontSize: 13.5,
                color: 'rgba(255,255,255,0.58)',
              }}
            >
              <Clock size={15} color={C.gold} strokeWidth={1.6} />
              Lun – Ven : 8h – 19h
            </div>
          </div>
          {/* RPPS */}
          <div
            style={{
              marginTop: 22,
              paddingTop: 18,
              borderTop: '1px solid rgba(212,175,55,0.14)',
              fontFamily: SANS,
              fontSize: 11,
              letterSpacing: '0.12em',
              color: 'rgba(255,255,255,0.34)',
              lineHeight: 1.7,
            }}
          >
            RPPS : 10 XXXXXXXX
            <br />
            N° ADELI : XX XXXXXXX
            <br />
            Ordre national des chirurgiens-dentistes
          </div>
        </div>

        {/* Colonnes liens */}
        {cols.map((c) => (
          <div key={c.title}>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 10.5,
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                color: C.gold,
                fontWeight: 600,
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
                      transition: 'color .3s',
                      lineHeight: 1.5,
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color = C.gold;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.64)';
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

      {/* Urgences dentaires */}
      <div
        style={{
          maxWidth: 1260,
          margin: '52px auto 0',
        }}
      >
        <Reveal>
          <div
            style={{
              background: 'rgba(212,175,55,0.08)',
              border: `1px solid rgba(212,175,55,0.28)`,
              padding: 'clamp(18px,3vw,28px) clamp(24px,4vw,40px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 18,
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: SANS,
                  fontSize: 10.5,
                  letterSpacing: '0.24em',
                  textTransform: 'uppercase',
                  color: C.gold,
                  fontWeight: 600,
                  marginBottom: 7,
                }}
              >
                Urgences dentaires
              </div>
              <div
                style={{
                  fontFamily: SERIF,
                  fontSize: 'clamp(16px,2vw,22px)',
                  color: C.white,
                  fontWeight: 400,
                }}
              >
                Douleur aiguë, dent cassée ou abcès ? Nous réservons des créneaux
                d&apos;urgence chaque jour.
              </div>
            </div>
            <GoldButton filled>
              <a href="tel:+33556XXXXXX" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: 8 }}>
                Appeler maintenant
              </a>
            </GoldButton>
          </div>
        </Reveal>
      </div>

      {/* Bas de page */}
      <div
        style={{
          maxWidth: 1260,
          margin: '44px auto 0',
          paddingTop: 24,
          borderTop: `1px solid rgba(212,175,55,0.12)`,
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
        <span>
          © 2024 Cabinet Dent&apos;Or — Dr. Mathieu Prévost. Tous droits réservés.
        </span>
        <span>
          Acte médical soumis au secret professionnel · Résultat non garanti · À titre
          informatif uniquement
        </span>
      </div>
      <style>{`
        @media (max-width: 860px) {
          .r284-footgrid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 560px) {
          .r284-footgrid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   PAGE — Impact 284 · Cabinet Dent'Or · Bordeaux Chartrons
   ════════════════════════════════════════════════════════════════════════════ */
export default function Impact284Page() {
  const root: React.CSSProperties = {
    background: C.navyDeep,
    color: C.ink,
    fontFamily: SANS,
    overflowX: 'hidden',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
  };
  return (
    <main id="hero" style={root} suppressHydrationWarning>
      <NavBar />
      <HeroSection />
      <ScrollCrossfade />
      <SoinsSection />
      <TechniqueSection />
      <TestimonialsSection />
      <BilanFormSection />
      <FinancementSection />
      <TechnoSection />
      <EquipeSection />
      <FooterSection />
    </main>
  );
}
