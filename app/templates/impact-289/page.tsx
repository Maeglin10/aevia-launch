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
  ArrowRight,
  Calculator,
  ChevronDown,
  FileText,
  MapPin,
  Quote,
  Scale,
  Star,
  TrendingUp,
  Users,
} from 'lucide-react';

/* ════════════════════════════════════════════════════════════════════════════
   SCHREIBER & ASSOCIÉS — Expert-comptable & commissaires aux comptes
   Strasbourg Neudorf · Alsace-Moselle
   Page premium auto-suffisante. 'use client'. Framer Motion + Lucide React.
   ════════════════════════════════════════════════════════════════════════════ */

/* ── Palette ─────────────────────────────────────────────────────────────── */
const C = {
  blue: '#1c3f6e',
  blueDeep: '#142d50',
  blueMid: '#254f8a',
  bluePale: '#e8f0f8',
  silver: '#e8e8e8',
  silverDeep: '#c8c8c8',
  white: '#ffffff',
  offwhite: '#f7f8fa',
  red: '#a32020',
  redLight: '#c43232',
  ink: '#111827',
  muted: 'rgba(17,24,39,0.62)',
} as const;

/* ── Typographies ──────────────────────────────────────────────────────────── */
const SERIF = "'Libre Baskerville', Georgia, serif" as const;
const SANS = "'Source Sans 3', system-ui, sans-serif" as const;

/* ── Photos Unsplash (IDs réels, ne pas modifier) ─────────────────────────── */
const PHOTO = {
  hero: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1600&auto=format&fit=crop',
  finance: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1600&auto=format&fit=crop',
  meeting: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1600&auto=format&fit=crop',
  charts: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600&auto=format&fit=crop',
  expert: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1600&auto=format&fit=crop',
  bureau: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1600&auto=format&fit=crop',
} as const;

/* ── Easing partagé ──────────────────────────────────────────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ════════════════════════════════════════════════════════════════════════════
   Primitives
   ════════════════════════════════════════════════════════════════════════════ */

/** Étiquette fine, capitales, interlettrage large, filet bleu Rhin. */
function Eyebrow({
  children,
  color = C.red,
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

/** Bouton principal bleu Rhin, contour fin, flèche animée. */
function BlueButton({
  children,
  onClick,
  filled = false,
  type = 'button',
  light = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  filled?: boolean;
  type?: 'button' | 'submit';
  light?: boolean;
}) {
  const [hover, setHover] = useState(false);
  const bg = light
    ? filled
      ? hover ? C.white : 'rgba(255,255,255,0.95)'
      : hover ? 'rgba(255,255,255,0.12)' : 'transparent'
    : filled
    ? hover ? C.blueMid : C.blue
    : hover ? 'rgba(28,63,110,0.08)' : 'transparent';

  const textColor = light
    ? filled
      ? C.blue
      : C.white
    : filled
    ? C.white
    : C.blue;

  const borderColor = light ? 'rgba(255,255,255,0.7)' : C.blue;

  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 11,
    padding: '14px 28px',
    fontFamily: SANS,
    fontSize: 13,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    fontWeight: 600,
    cursor: 'pointer',
    border: `1.5px solid ${borderColor}`,
    background: bg,
    color: textColor,
    transition: 'all .45s cubic-bezier(.16,1,.3,1)',
    transform: hover ? 'translateY(-2px)' : 'none',
    boxShadow: hover && filled ? '0 8px 28px -10px rgba(28,63,110,0.4)' : 'none',
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
          transform: hover ? 'translateX(5px)' : 'none',
          transition: 'transform .45s cubic-bezier(.16,1,.3,1)',
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
    const onScroll = () => setSolid(window.scrollY > 70);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: 'Services', href: '#services' },
    { label: 'Notre méthode', href: '#processus' },
    { label: 'Spécificités', href: '#specificites' },
    { label: 'Témoignages', href: '#temoignages' },
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
    background: solid ? 'rgba(20,45,80,0.95)' : 'transparent',
    backdropFilter: solid ? 'blur(16px) saturate(130%)' : 'none',
    WebkitBackdropFilter: solid ? 'blur(16px) saturate(130%)' : 'none',
    borderBottom: solid ? `1px solid rgba(232,232,232,0.16)` : '1px solid transparent',
    transition: 'all .55s cubic-bezier(.16,1,.3,1)',
  };
  const brand: React.CSSProperties = {
    fontFamily: SERIF,
    fontSize: 18,
    letterSpacing: '0.04em',
    color: C.white,
    textTransform: 'none',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    lineHeight: 1.2,
  };
  const brandSub: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 10,
    letterSpacing: '0.26em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.7)',
    fontWeight: 400,
    display: 'block',
    marginTop: 1,
  };
  const linkRow: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'clamp(16px,2.2vw,36px)',
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
            style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
          />
        ) : (
          <>
            <Scale size={20} color="rgba(255,255,255,0.85)" strokeWidth={1.6} />
            <div>{fd?.businessName ?? "Schreiber & Associés"}<span style={brandSub}>Expert-comptable · Strasbourg</span>
            </div>
          </>
        )}
      </div>
      <div style={linkRow} className="r289-navlinks">
        {links.map((l) => (
          <NavLink key={l.label} label={l.label} href={l.href} />
        ))}
      </div>
      <div className="r289-navcta">
        <a href="#contact" style={{ textDecoration: 'none' }}>
          <BlueButton filled light>
            Bilan gratuit
          </BlueButton>
        </a>
      </div>
      
        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="r289-burger"
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
          .r289-navlinks { display: none !important; }
          .r289-burger { display: flex !important; flex-direction: column; }
          .r289-navcta { display: none !important; }
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
        color: h ? C.white : 'rgba(255,255,255,0.82)',
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
          height: 1.5,
          width: h ? '100%' : '0%',
          background: C.red,
          transition: 'width .45s cubic-bezier(.16,1,.3,1)',
        }}
      />
    </a>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   1 · HeroSection
   ════════════════════════════════════════════════════════════════════════════ */
function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);
  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '-40%']);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.72], [1, 0]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const section: React.CSSProperties = {
    position: 'relative',
    height: '100vh',
    minHeight: 640,
    overflow: 'hidden',
    background: C.blueDeep,
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
          alt="Expert-comptable Schreiber & Associés, Strasbourg"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%' }}
        />
      </motion.div>

      {/* Voiles bleu nuit */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(20,45,80,0.55) 0%, rgba(20,45,80,0.12) 36%, rgba(20,45,80,0.52) 68%, rgba(20,45,80,0.93) 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(110% 80% at 50% 25%, transparent 38%, rgba(28,63,110,0.52) 100%)',
          mixBlendMode: 'multiply',
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
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '0 clamp(24px,6vw,80px)',
          y: titleY,
          opacity: titleOpacity,
        }}
      >
        <Reveal y={18}>
          <Eyebrow color="rgba(255,255,255,0.78)" align="center">
            Expert-comptable & commissaires aux comptes · Strasbourg Neudorf
          </Eyebrow>
        </Reveal>

        <motion.h1
          initial={{ opacity: 0, y: 44 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.15 }}
          style={{
            fontFamily: SERIF,
            fontWeight: 700,
            color: C.white,
            fontSize: 'clamp(44px, 7.5vw, 112px)',
            lineHeight: 1.02,
            letterSpacing: '-0.015em',
            margin: '26px 0 20px',
            textShadow: '0 10px 50px rgba(0,0,0,0.42)',
            maxWidth: 960,
          }}
        >
          La rigueur au service{' '}
          <span style={{ fontStyle: 'italic', color: 'rgba(232,240,248,0.9)' }}>
            de votre réussite
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.42 }}
          style={{
            fontFamily: SANS,
            fontSize: 'clamp(17px, 2vw, 22px)',
            color: 'rgba(255,255,255,0.84)',
            maxWidth: 580,
            lineHeight: 1.65,
            fontWeight: 400,
          }}
        >
          Depuis 28 ans, nous accompagnons les TPE et PME d&apos;Alsace dans leur
          comptabilité, leur fiscalité et leur développement. Experts du droit local
          Alsace-Moselle.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.68 }}
          style={{ marginTop: 40, display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <BlueButton filled light>
            Demander un bilan gratuit
          </BlueButton>
          <BlueButton light>
            Nos services
          </BlueButton>
        </motion.div>

        {/* Badge confiance */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: EASE, delay: 1.0 }}
          style={{
            marginTop: 52,
            display: 'flex',
            gap: 'clamp(24px,4vw,56px)',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {[
            { v: '28 ans', l: "d'expertise" },
            { v: '340+', l: 'clients accompagnés' },
            { v: '12', l: 'experts dédiés' },
          ].map((s) => (
            <div key={s.v} style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  fontSize: 'clamp(28px,3.2vw,42px)',
                  color: C.white,
                  lineHeight: 1,
                }}
              >
                {s.v}
              </div>
              <div
                style={{
                  fontFamily: SANS,
                  fontSize: 11,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.62)',
                  marginTop: 8,
                }}
              >
                {s.l}
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
            color: 'rgba(255,255,255,0.65)',
          }}
        >
          Découvrir
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.0, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={19} color="rgba(255,255,255,0.7)" strokeWidth={1.4} />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   2 · ScrollCrossfade — 320vh sticky, 3 visuels avec progress dots
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
    src: PHOTO.finance,
    alt: 'Analyse financière et bilan comptable',
    index: 'I',
    caption: 'Analyse financière',
    sub: 'Des bilans précis pour des décisions éclairées, chaque exercice.',
  },
  {
    src: PHOTO.charts,
    alt: 'Tableaux de bord et indicateurs financiers',
    index: 'II',
    caption: 'Vision stratégique',
    sub: 'Indicateurs, ratios, projections — la donnée au service du dirigeant.',
  },
  {
    src: PHOTO.meeting,
    alt: 'Réunion avec les dirigeants',
    index: 'III',
    caption: 'Conseil de direction',
    sub: 'Vos experts à vos côtés pour chaque moment décisif de votre entreprise.',
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
  const scale = useTransform(progress, [start - fadeIn, end], [1.12, 1.0]);

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
        padding: '0 clamp(24px,6vw,80px)',
        opacity,
        y,
      }}
    >
      <span
        style={{
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontSize: 'clamp(36px,8vw,110px)',
          color: 'rgba(232,232,232,0.22)',
          lineHeight: 1,
          marginBottom: 4,
        }}
      >
        {chapter.index}
      </span>
      <h2
        style={{
          fontFamily: SERIF,
          fontSize: 'clamp(36px,6.5vw,90px)',
          fontWeight: 700,
          color: C.white,
          lineHeight: 1.04,
          margin: 0,
          textShadow: '0 8px 40px rgba(0,0,0,0.5)',
        }}
      >
        {chapter.caption}
      </h2>
      <p
        style={{
          fontFamily: SANS,
          fontSize: 'clamp(15px,1.8vw,20px)',
          color: 'rgba(255,255,255,0.82)',
          marginTop: 18,
          maxWidth: 480,
          lineHeight: 1.65,
        }}
      >
        {chapter.sub}
      </p>
    </motion.div>
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
      style={{ height: '100vh', overflow: 'hidden', position: 'relative', background: C.blueDeep }}
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
        {/* Voile lisibilité */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to bottom, rgba(20,45,80,0.38), rgba(20,45,80,0.12) 44%, rgba(20,45,80,0.65))',
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

        {/* Progress dots animés */}
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
  const width = useTransform(progress, [i * seg, (i + 1) * seg], [10, 36]);
  return (
    <motion.div
      style={{ height: 2, width, background: C.white, opacity }}
    />
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   3 · ServicesSection — 3 missions avec icônes lucide-react
   ════════════════════════════════════════════════════════════════════════════ */
type Service = {
  icon: React.ReactNode;
  title: string;
  sub: string;
  body: string;
  tags: string[];
};

const SERVICES: Service[] = [
  {
    icon: <Calculator size={32} strokeWidth={1.5} color={C.blue} />,
    title: 'Comptabilité & bilan',
    sub: 'La fondation de votre gestion',
    body: 'Tenue de comptabilité, établissement des comptes annuels, liasses fiscales, rapports de gestion. Nous gérons votre obligation légale avec rigueur pour que vous puissiez vous concentrer sur votre cœur de métier.',
    tags: ['Tenue comptable', 'Bilan annuel', 'Liasse fiscale', 'Tableau de bord'],
  },
  {
    icon: <TrendingUp size={32} strokeWidth={1.5} color={C.blue} />,
    title: 'Fiscalité & optimisation',
    sub: 'Réduire la charge légalement',
    body: "Déclarations IS, TVA, IR des associés. Nous identifions les leviers fiscaux adaptés à votre situation — régimes d'imposition, crédits d'impôt, dispositifs d'optimisation — pour préserver votre trésorerie.",
    tags: ['IS / TVA / IR', 'Crédit impôt recherche', 'Optimisation patrimoniale', 'Contrôle fiscal'],
  },
  {
    icon: <Users size={32} strokeWidth={1.5} color={C.blue} />,
    title: 'Paie & social',
    sub: 'Vos équipes, notre responsabilité',
    body: 'Établissement des bulletins de salaire, déclarations sociales (DSN), conseils en droit du travail, gestion des entrées/sorties. Une équipe dédiée pour sécuriser votre relation avec vos collaborateurs.',
    tags: ['Bulletins de paie', 'DSN mensuelle', 'Droit du travail', 'Audits sociaux'],
  },
];

function ServiceCard({ s, i }: { s: Service; i: number }) {
  const [hover, setHover] = useState(false);
  const card: React.CSSProperties = {
    background: hover ? C.white : C.offwhite,
    border: `1.5px solid ${hover ? C.blue : C.silver}`,
    padding: 'clamp(32px,4vw,48px)',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    boxSizing: 'border-box',
    transform: hover ? 'translateY(-10px)' : 'none',
    boxShadow: hover
      ? '0 32px 72px -30px rgba(28,63,110,0.28)'
      : '0 6px 24px -18px rgba(28,63,110,0.14)',
    transition: 'all .55s cubic-bezier(.16,1,.3,1)',
    cursor: 'default',
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
            background: hover ? C.bluePale : C.silver,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 28,
            transition: 'background .45s',
          }}
        >
          {s.icon}
        </div>
        <div
          style={{
            fontFamily: SANS,
            fontSize: 10.5,
            letterSpacing: '0.26em',
            textTransform: 'uppercase',
            color: C.red,
            marginBottom: 10,
            fontWeight: 600,
          }}
        >
          {s.sub}
        </div>
        <h3
          style={{
            fontFamily: SERIF,
            fontSize: 'clamp(22px,2.4vw,30px)',
            fontWeight: 700,
            color: C.blue,
            margin: '0 0 16px',
            lineHeight: 1.15,
          }}
        >
          {s.title}
        </h3>
        <p
          style={{
            fontFamily: SANS,
            fontSize: 16,
            lineHeight: 1.7,
            color: C.muted,
            margin: '0 0 28px',
            flex: 1,
          }}
        >
          {s.body}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {s.tags.map((t) => (
            <span
              key={t}
              style={{
                fontFamily: SANS,
                fontSize: 11,
                letterSpacing: '0.08em',
                padding: '5px 12px',
                background: hover ? C.bluePale : C.silver,
                color: hover ? C.blue : C.ink,
                fontWeight: 600,
                transition: 'all .45s',
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </article>
    </Reveal>
  );
}

function ServicesSection() {
  const sec: React.CSSProperties = {
    background: C.offwhite,
    padding: 'clamp(88px,12vw,168px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: 'clamp(20px,3vw,36px)',
    maxWidth: 1280,
    margin: '0 auto',
  };

  return (
    <section style={sec} id="services">
      <div style={{ maxWidth: 1280, margin: '0 auto 60px' }}>
        <Reveal>
          <Eyebrow color={C.red}>Nos missions</Eyebrow>
        </Reveal>
        <Reveal delay={0.09}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(36px,5.5vw,72px)',
              fontWeight: 700,
              color: C.blue,
              margin: '18px 0 0',
              lineHeight: 1.06,
            }}
          >
            Un accompagnement{' '}
            <span style={{ fontStyle: 'italic', fontWeight: 400 }}>
              complet
            </span>
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p
            style={{
              fontFamily: SANS,
              fontSize: 'clamp(16px,1.6vw,19px)',
              lineHeight: 1.72,
              color: C.muted,
              maxWidth: 580,
              marginTop: 20,
            }}
          >
            Du premier bilan aux audits les plus complexes, nos équipes couvrent
            l&apos;ensemble de vos obligations et de vos ambitions.
          </p>
        </Reveal>
      </div>
      <div style={grid}>
        {SERVICES.map((s, i) => (
          <ServiceCard key={s.title} s={s} i={i} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   4 · ProcessSection — Photo sticky gauche + 4 étapes droite
   ════════════════════════════════════════════════════════════════════════════ */
type ProcessStep = {
  num: string;
  title: string;
  body: string;
};

const PROCESS_STEPS: ProcessStep[] = [
  {
    num: '01',
    title: 'Diagnostic gratuit',
    body: "Un entretien de 60 minutes avec l'un de nos associés pour analyser votre situation comptable, fiscale et sociale. Sans engagement. À votre cabinet ou par visioconférence.",
  },
  {
    num: '02',
    title: 'Mission personnalisée',
    body: 'Nous construisons une lettre de mission taillée à vos besoins réels : fréquence des rendez-vous, périmètre de délégation, outils collaboratifs. Pas de forfait générique.',
  },
  {
    num: '03',
    title: 'Suivi mensuel',
    body: "Tableaux de bord envoyés chaque mois, alertes en temps réel sur vos indicateurs critiques, accès à votre espace client sécurisé. Vous ne découvrez jamais une mauvaise surprise en fin d'année.",
  },
  {
    num: '04',
    title: 'Conseil stratégique',
    body: "Au-delà des chiffres, nous vous accompagnons dans vos décisions : transmission, holding, investissement, développement à l'international. Votre expert-comptable devient un vrai partenaire de croissance.",
  },
];

function ProcessSection() {
  const sec: React.CSSProperties = {
    background: C.white,
    padding: 'clamp(88px,12vw,168px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '0.85fr 1.15fr',
    gap: 'clamp(40px,7vw,100px)',
    maxWidth: 1280,
    margin: '0 auto',
    alignItems: 'start',
  };
  const sticky: React.CSSProperties = {
    position: 'sticky',
    top: 96,
    alignSelf: 'start',
  };

  return (
    <section style={sec} id="processus">
      <div style={grid} className="r289-process">
        {/* Photo sticky */}
        <div style={sticky} className="r289-process-sticky">
          <div
            style={{
              overflow: 'hidden',
              aspectRatio: '4 / 5',
              border: `3px solid ${C.blue}`,
              position: 'relative',
            }}
          >
            <img
              src={PHOTO.expert}
              alt="Expert-comptable Schreiber & Associés en consultation"
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            {/* Badge accréditation */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'rgba(20,45,80,0.92)',
                padding: '20px 24px',
                backdropFilter: 'blur(8px)',
              }}
            >
              <div
                style={{
                  fontFamily: SANS,
                  fontSize: 11,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.65)',
                  marginBottom: 6,
                }}
              >
                Membre accrédité
              </div>
              <div
                style={{
                  fontFamily: SERIF,
                  fontSize: 16,
                  color: C.white,
                  fontWeight: 700,
                }}
              >
                Ordre des Experts-Comptables
              </div>
              <div
                style={{
                  fontFamily: SANS,
                  fontSize: 12,
                  color: 'rgba(255,255,255,0.72)',
                  marginTop: 2,
                }}
              >
                Grand Est · Région Alsace-Moselle
              </div>
            </div>
          </div>
        </div>

        {/* Étapes qui défilent */}
        <div>
          <Reveal>
            <Eyebrow color={C.red}>Notre méthode</Eyebrow>
          </Reveal>
          <Reveal delay={0.09}>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(32px,4.8vw,64px)',
                fontWeight: 700,
                color: C.blue,
                margin: '18px 0 50px',
                lineHeight: 1.07,
              }}
            >
              Quatre étapes,{' '}
              <span style={{ fontStyle: 'italic', fontWeight: 400 }}>
                zéro incertitude
              </span>
            </h2>
          </Reveal>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {PROCESS_STEPS.map((step, i) => (
              <Reveal key={step.num} delay={0.06 * i}>
                <div
                  style={{
                    padding: '34px 0',
                    borderTop: `1.5px solid ${C.silver}`,
                    display: 'flex',
                    gap: 28,
                  }}
                >
                  <span
                    style={{
                      fontFamily: SERIF,
                      fontStyle: 'italic',
                      fontSize: 28,
                      color: C.red,
                      minWidth: 48,
                      lineHeight: 1,
                      paddingTop: 4,
                    }}
                  >
                    {step.num}
                  </span>
                  <div>
                    <h3
                      style={{
                        fontFamily: SERIF,
                        fontSize: 'clamp(20px,2.2vw,26px)',
                        fontWeight: 700,
                        color: C.blue,
                        margin: '0 0 12px',
                      }}
                    >
                      {step.title}
                    </h3>
                    <p
                      style={{
                        fontFamily: SANS,
                        fontSize: 16,
                        lineHeight: 1.72,
                        color: C.muted,
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
          <Reveal delay={0.28}>
            <div style={{ marginTop: 40 }}>
              <a href="#contact" style={{ textDecoration: 'none' }}>
                <BlueButton filled>
                  Démarrer mon diagnostic
                </BlueButton>
              </a>
            </div>
          </Reveal>
        </div>
      </div>
      <style>{`
        @media (max-width: 860px) {
          .r289-process { grid-template-columns: 1fr !important; }
          .r289-process-sticky { position: static !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   5 · TestimonialsSection — 3 témoignages avec étoiles et économies
   ════════════════════════════════════════════════════════════════════════════ */
type Testimonial = {
  quote: string;
  name: string;
  role: string;
  saving: string;
  stars: number;
};

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Je suis artisan plombier depuis 18 ans. Schreiber & Associés ont restructuré ma comptabilité en 3 mois. Aujourd'hui, je comprends mes chiffres et j'ai récupéré 6 800 € de trop-perçu fiscal sur les deux dernières années.",
    name: 'Patrick Heiss',
    role: 'Artisan plombier chauffagiste — Auto-entrepreneur',
    saving: '6 800 € récupérés',
    stars: 5,
  },
  {
    quote:
      "Nous avons créé notre SAS en 2021. Grâce à leur accompagnement, nous avons optimisé nos rémunérations dirigeants et mis en place un plan d'intéressement. Le conseil dépasse largement la simple comptabilité.",
    name: 'Ambre & Julien Wittmer',
    role: 'Co-gérants SAS Wittmer Traiteur — Strasbourg',
    saving: "14 200 € d'économies annuelles",
    stars: 5,
  },
  {
    quote:
      "Notre holding familiale gère cinq SCI. Les équipes de Schreiber ont restructuré l'ensemble du schéma fiscal. La réactivité et la profondeur de leur analyse sont celles d'un grand cabinet parisien — avec la proximité alsacienne en plus.",
    name: 'Famille Obermeyer',
    role: 'Holding familiale · 5 entités · Strasbourg Neudorf',
    saving: "38 500 € d'optimisation annuelle",
    stars: 5,
  },
];

function TestimonialsSection() {
  const sec: React.CSSProperties = {
    background: C.blueDeep,
    padding: 'clamp(88px,12vw,168px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: 'clamp(24px,3vw,40px)',
    maxWidth: 1280,
    margin: '0 auto',
  };

  return (
    <section style={sec} id="temoignages">
      <div style={{ maxWidth: 1280, margin: '0 auto 60px', textAlign: 'center' }}>
        <Reveal>
          <Eyebrow color="rgba(255,255,255,0.7)" align="center">
            Ils nous font confiance
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.09}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(34px,5vw,68px)',
              fontWeight: 700,
              color: C.white,
              margin: '18px 0 0',
              lineHeight: 1.07,
            }}
          >
            La parole de{' '}
            <span style={{ fontStyle: 'italic', fontWeight: 400, color: C.silverDeep }}>
              nos clients
            </span>
          </h2>
        </Reveal>
      </div>
      <div style={grid}>
        {TESTIMONIALS.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.12} style={{ height: '100%' }}>
            <figure
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: `1px solid rgba(255,255,255,0.14)`,
                padding: 'clamp(30px,3.5vw,46px)',
                margin: 0,
                height: '100%',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Économies réalisées */}
              <div
                style={{
                  background: C.red,
                  color: C.white,
                  fontFamily: SANS,
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  padding: '7px 14px',
                  alignSelf: 'flex-start',
                  marginBottom: 22,
                }}
              >
                {t.saving}
              </div>

              <Quote size={28} color="rgba(232,232,232,0.3)" strokeWidth={1.2} />

              <div style={{ display: 'flex', gap: 4, margin: '14px 0 16px' }}>
                {Array.from({ length: t.stars }).map((_, s) => (
                  <Star key={s} size={14} fill={C.red} color={C.red} strokeWidth={0} />
                ))}
              </div>

              <blockquote
                style={{
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  fontSize: 'clamp(16px,1.8vw,20px)',
                  lineHeight: 1.62,
                  color: 'rgba(255,255,255,0.88)',
                  margin: '0 0 28px',
                  flex: 1,
                }}
              >
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              <figcaption
                style={{
                  borderTop: '1px solid rgba(255,255,255,0.14)',
                  paddingTop: 18,
                }}
              >
                <div
                  style={{
                    fontFamily: SERIF,
                    fontSize: 18,
                    color: C.white,
                    fontWeight: 700,
                  }}
                >
                  {t.name}
                </div>
                <div
                  style={{
                    fontFamily: SANS,
                    fontSize: 12,
                    color: 'rgba(255,255,255,0.55)',
                    marginTop: 5,
                    lineHeight: 1.5,
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
   6 · ContactFormSection
   ════════════════════════════════════════════════════════════════════════════ */
const STATUTS = [
  'Auto-entrepreneur',
  'SARL',
  'SAS',
  'SA',
  'Association',
  'Autre',
];

const CA_TRANCHES = [
  'Moins de 30 000 €',
  '30 000 € – 150 000 €',
  '150 000 € – 500 000 €',
  '500 000 € – 2 M€',
  '2 M€ – 10 M€',
  'Plus de 10 M€',
];

function ContactFormSection() {
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [statut, setStatut] = useState('');
  const [ca, setCa] = useState('');
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const onSubmit = () => {
    if (!prenom || !nom || !email) return;
    setSent(true);
  };

  const sec: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    background: C.offwhite,
    padding: 'clamp(88px,12vw,168px) clamp(24px,6vw,96px)',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    background: 'transparent',
    border: 'none',
    borderBottom: `1.5px solid ${C.silverDeep}`,
    padding: '14px 2px',
    fontFamily: SANS,
    fontSize: 17,
    color: C.ink,
    outline: 'none',
    transition: 'border-color .3s',
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 10.5,
    letterSpacing: '0.26em',
    textTransform: 'uppercase',
    color: C.blue,
    display: 'block',
    marginBottom: 4,
    fontWeight: 700,
  };

  return (
    <section style={sec} id="contact">
      {/* Fond photo décoratif */}
      <img
        src={PHOTO.bureau}
        alt="Image de présentation"
        aria-hidden="true"
        loading="lazy"
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          width: '45%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.08,
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
        <Reveal>
          <Eyebrow color={C.red}>Demande de contact</Eyebrow>
        </Reveal>
        <Reveal delay={0.09}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(36px,5.5vw,72px)',
              fontWeight: 700,
              color: C.blue,
              margin: '18px 0 16px',
              lineHeight: 1.07,
            }}
          >
            Votre bilan{' '}
            <span style={{ fontStyle: 'italic', fontWeight: 400 }}>gratuit</span>
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p
            style={{
              fontFamily: SANS,
              fontSize: 'clamp(16px,1.7vw,19px)',
              lineHeight: 1.7,
              color: C.muted,
              maxWidth: 560,
              marginBottom: 52,
            }}
          >
            Un entretien sans engagement avec l&apos;un de nos associés pour analyser
            votre situation et vous proposer une mission adaptée.
          </p>
        </Reveal>

        {sent ? (
          <Reveal>
            <div
              style={{
                border: `2px solid ${C.blue}`,
                padding: 'clamp(36px,5vw,56px)',
                background: C.bluePale,
                textAlign: 'center',
              }}
            >
              <FileText size={40} color={C.blue} strokeWidth={1.4} style={{ marginBottom: 16 }} />
              <h3
                style={{
                  fontFamily: SERIF,
                  fontSize: 'clamp(24px,2.8vw,34px)',
                  fontWeight: 700,
                  color: C.blue,
                  margin: '0 0 12px',
                }}
              >
                Merci {prenom}&nbsp;!
              </h3>
              <p
                style={{
                  fontFamily: SANS,
                  fontSize: 17,
                  color: C.muted,
                  margin: 0,
                  lineHeight: 1.65,
                }}
              >
                Votre demande a bien été transmise. Un associé de Schreiber &amp;
                Associés vous contactera sous 24 h à l&apos;adresse{' '}
                <strong style={{ color: C.blue }}>{email}</strong> pour fixer votre
                rendez-vous de diagnostic gratuit.
              </p>
            </div>
          </Reveal>
        ) : (
          <Reveal delay={0.22}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              {/* Ligne Prénom / Nom */}
              <div
                style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}
                className="r289-formrow"
              >
                <div>
                  <label style={labelStyle} htmlFor="r289-prenom">
                    Prénom
                  </label>
                  <input
                    id="r289-prenom"
                    style={inputStyle}
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    placeholder="Marie"
                    autoComplete="given-name"
                  />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="r289-nom">
                    Nom
                  </label>
                  <input
                    id="r289-nom"
                    style={inputStyle}
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    placeholder="Dupont"
                    autoComplete="family-name"
                  />
                </div>
              </div>

              {/* Statut juridique */}
              <div>
                <label style={labelStyle} htmlFor="r289-statut">
                  Statut juridique
                </label>
                <select
                  id="r289-statut"
                  style={{
                    ...inputStyle,
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    cursor: 'pointer',
                    color: statut ? C.ink : 'rgba(17,24,39,0.4)',
                  }}
                  value={statut}
                  onChange={(e) => setStatut(e.target.value)}
                >
                  <option value="" style={{ color: '#000' }}>
                    Sélectionner votre statut…
                  </option>
                  {STATUTS.map((s) => (
                    <option key={s} value={s} style={{ color: '#000' }}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* CA annuel */}
              <div>
                <label style={labelStyle} htmlFor="r289-ca">
                  CA annuel estimé
                </label>
                <select
                  id="r289-ca"
                  style={{
                    ...inputStyle,
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    cursor: 'pointer',
                    color: ca ? C.ink : 'rgba(17,24,39,0.4)',
                  }}
                  value={ca}
                  onChange={(e) => setCa(e.target.value)}
                >
                  <option value="" style={{ color: '#000' }}>
                    Sélectionner une tranche…
                  </option>
                  {CA_TRANCHES.map((t) => (
                    <option key={t} value={t} style={{ color: '#000' }}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Email */}
              <div>
                <label style={labelStyle} htmlFor="r289-email">
                  Adresse e-mail
                </label>
                <input
                  id="r289-email"
                  style={inputStyle}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="marie.dupont@entreprise.fr"
                  autoComplete="email"
                />
              </div>

              <div style={{ marginTop: 8 }}>
                <BlueButton filled onClick={onSubmit} type="button">
                  Demander mon diagnostic gratuit
                </BlueButton>
              </div>
            </div>
          </Reveal>
        )}
      </div>
      <style>{`
        @media (max-width: 620px) {
          .r289-formrow { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   7 · StatsSection — 4 chiffres clés
   ════════════════════════════════════════════════════════════════════════════ */
type Stat = { value: string; label: string; sub: string };

const STATS: Stat[] = [
  {
    value: '28 ans',
    label: "d'expertise",
    sub: 'Fondé en 1997 à Strasbourg Neudorf',
  },
  {
    value: '340+',
    label: 'clients actifs',
    sub: 'TPE, PME, associations, professions libérales',
  },
  {
    value: '12',
    label: 'experts dédiés',
    sub: 'Comptables, fiscalistes, juristes sociaux',
  },
  {
    value: 'Alsace‑Moselle',
    label: 'spécialiste',
    sub: 'Droit local, régime concordataire, Livre Foncier',
  },
];

function StatsSection() {
  const sec: React.CSSProperties = {
    background: C.blue,
    padding: 'clamp(72px,10vw,130px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 'clamp(32px,4vw,56px)',
    maxWidth: 1280,
    margin: '0 auto',
  };

  return (
    <section style={sec}>
      <div style={grid}>
        {STATS.map((s, i) => (
          <Reveal key={s.value} delay={i * 0.1}>
            <div
              style={{
                borderLeft: `3px solid ${C.red}`,
                paddingLeft: 'clamp(20px,2.5vw,32px)',
              }}
            >
              <div
                style={{
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  fontSize: 'clamp(32px,3.8vw,52px)',
                  color: C.white,
                  lineHeight: 1,
                  marginBottom: 10,
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontFamily: SANS,
                  fontSize: 12,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.65)',
                  marginBottom: 8,
                  fontWeight: 600,
                }}
              >
                {s.label}
              </div>
              <div
                style={{
                  fontFamily: SANS,
                  fontSize: 13.5,
                  color: 'rgba(255,255,255,0.52)',
                  lineHeight: 1.55,
                }}
              >
                {s.sub}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   8 · SpecificiteSection — Droit local Alsace-Moselle, 3 particularités
   ════════════════════════════════════════════════════════════════════════════ */
type Specificite = {
  num: string;
  title: string;
  body: string;
  impact: string;
};

const SPECIFICITES: Specificite[] = [
  {
    num: '§ 1',
    title: 'Régime concordataire',
    body: "L'Alsace-Moselle dispose d'un régime de faillite spécifique issu du Code de Commerce allemand de 1900. Le concordat judiciaire (renommé redressement judiciaire en 1985 dans le reste de la France mais maintenu localement dans certaines procédures) offre des modalités de négociation avec les créanciers distinctes du droit commun. Nos experts maîtrisent ces procédures et vous représentent devant le Tribunal de Commerce de Strasbourg.",
    impact: 'Procédures de sauvegarde spécifiques',
  },
  {
    num: '§ 2',
    title: 'Livre Foncier',
    body: "Contrairement au reste de la France qui utilise le fichier immobilier de la Conservation des Hypothèques, l'Alsace-Moselle est dotée du Livre Foncier, registre cadastral d'origine germanique qui confère un droit réel inattaquable. Les transactions immobilières, la constitution de garanties et les montages SCI obéissent à des règles distinctes. Notre pôle juridique et fiscal intègre cette dimension dans tous les dossiers patrimoniaux.",
    impact: 'Impact direct sur les montages SCI et garanties',
  },
  {
    num: '§ 3',
    title: 'Assurance maladie spécifique',
    body: "Les salariés d'Alsace-Moselle bénéficient d'un régime local d'assurance maladie complémentaire obligatoire, financé par une cotisation supplémentaire à la charge exclusive du salarié (1,5 % en 2024). Ce régime offre un meilleur remboursement des soins mais implique des obligations déclaratives spécifiques dans les DSN. Nos gestionnaires paie sont formés à ces particularités pour éviter tout contentieux avec l'URSSAF.",
    impact: 'Cotisations DSN et remboursements différenciés',
  },
];

function SpecificiteSection() {
  const sec: React.CSSProperties = {
    background: C.offwhite,
    padding: 'clamp(88px,12vw,168px) clamp(24px,6vw,96px)',
    position: 'relative',
    overflow: 'hidden',
  };

  return (
    <section style={sec} id="specificites">
      {/* Filigrane décoratif */}
      <div
        style={{
          position: 'absolute',
          right: '-5%',
          top: '10%',
          fontFamily: SERIF,
          fontSize: 'clamp(160px,22vw,340px)',
          fontStyle: 'italic',
          color: 'rgba(28,63,110,0.04)',
          lineHeight: 1,
          userSelect: 'none',
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      >
        AM
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <Reveal>
          <Eyebrow color={C.red}>Expertise locale</Eyebrow>
        </Reveal>
        <Reveal delay={0.09}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(34px,5.2vw,68px)',
              fontWeight: 700,
              color: C.blue,
              margin: '18px 0 16px',
              lineHeight: 1.07,
              maxWidth: 780,
            }}
          >
            Droit local{' '}
            <span style={{ fontStyle: 'italic', fontWeight: 400 }}>
              Alsace-Moselle
            </span>{' '}
            : 3 particularités que votre expert doit maîtriser
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p
            style={{
              fontFamily: SANS,
              fontSize: 'clamp(16px,1.6vw,19px)',
              lineHeight: 1.72,
              color: C.muted,
              maxWidth: 640,
              marginBottom: 60,
            }}
          >
            Le droit applicable en Alsace-Moselle est le fruit d&apos;une histoire
            juridique unique. Ignorer ces spécificités peut coûter cher à votre
            entreprise. Voici ce que nous gérons pour vous.
          </p>
        </Reveal>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {SPECIFICITES.map((sp, i) => (
            <Reveal key={sp.num} delay={i * 0.1}>
              <div
                style={{
                  padding: 'clamp(36px,4.5vw,54px) 0',
                  borderTop: `1.5px solid ${C.silver}`,
                  display: 'grid',
                  gridTemplateColumns: '80px 1fr auto',
                  gap: 'clamp(20px,3vw,44px)',
                  alignItems: 'start',
                }}
                className="r289-specificite-row"
              >
                <span
                  style={{
                    fontFamily: SERIF,
                    fontStyle: 'italic',
                    fontSize: 22,
                    color: C.red,
                    paddingTop: 4,
                  }}
                >
                  {sp.num}
                </span>
                <div>
                  <h3
                    style={{
                      fontFamily: SERIF,
                      fontSize: 'clamp(22px,2.4vw,30px)',
                      fontWeight: 700,
                      color: C.blue,
                      margin: '0 0 14px',
                    }}
                  >
                    {sp.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: SANS,
                      fontSize: 16,
                      lineHeight: 1.75,
                      color: C.muted,
                      margin: 0,
                      maxWidth: 680,
                    }}
                  >
                    {sp.body}
                  </p>
                </div>
                <div
                  style={{
                    background: C.blue,
                    color: C.white,
                    fontFamily: SANS,
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    padding: '8px 16px',
                    whiteSpace: 'nowrap',
                    alignSelf: 'start',
                  }}
                  className="r289-specificite-badge"
                >
                  {sp.impact}
                </div>
              </div>
            </Reveal>
          ))}
          {/* Bordure finale */}
          <div style={{ borderTop: `1.5px solid ${C.silver}` }} />
        </div>
      </div>
      <style>{`
        @media (max-width: 860px) {
          .r289-specificite-row { grid-template-columns: 60px 1fr !important; }
          .r289-specificite-badge { display: none !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   9 · PartnersSection — Réseau de partenaires Strasbourg
   ════════════════════════════════════════════════════════════════════════════ */
type PartnerCategory = {
  category: string;
  partners: { name: string; detail: string }[];
};

const PARTNER_CATEGORIES: PartnerCategory[] = [
  {
    category: 'Notaires',
    partners: [
      { name: 'Étude Schmitt & Kœnig', detail: 'Strasbourg — Patrimoine & transmission' },
      { name: 'Maître Hoffmann', detail: 'Neudorf — Immobilier & SCI' },
    ],
  },
  {
    category: 'Avocats',
    partners: [
      { name: 'Cabinet Reiss Droit des Affaires', detail: 'Strasbourg — M&A, cessions' },
      { name: 'Me Burger & Associés', detail: 'Droit social & contentieux prud\'homal' },
    ],
  },
  {
    category: 'Banques',
    partners: [
      { name: "Caisse d\'Épargne Grand Est Europe", detail: 'Crédit entreprise & financement' },
      { name: 'BNP Paribas Strasbourg Centre', detail: 'Trésorerie & placements dirigeants' },
    ],
  },
  {
    category: 'Assureurs',
    partners: [
      { name: 'Groupama Grand Est', detail: 'Prévoyance dirigeant & RC Pro' },
      { name: 'Allianz Strasbourg Neudorf', detail: 'Assurance homme-clé & épargne salariale' },
    ],
  },
];

function PartnersSection() {
  const sec: React.CSSProperties = {
    background: C.white,
    padding: 'clamp(88px,12vw,168px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: 'clamp(24px,3vw,40px)',
    maxWidth: 1280,
    margin: '0 auto',
  };

  return (
    <section style={sec}>
      <div style={{ maxWidth: 1280, margin: '0 auto 60px' }}>
        <Reveal>
          <Eyebrow color={C.red}>Réseau de confiance</Eyebrow>
        </Reveal>
        <Reveal delay={0.09}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(34px,5vw,66px)',
              fontWeight: 700,
              color: C.blue,
              margin: '18px 0 16px',
              lineHeight: 1.07,
            }}
          >
            Nos partenaires{' '}
            <span style={{ fontStyle: 'italic', fontWeight: 400 }}>à Strasbourg</span>
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p
            style={{
              fontFamily: SANS,
              fontSize: 'clamp(16px,1.6vw,19px)',
              lineHeight: 1.72,
              color: C.muted,
              maxWidth: 560,
            }}
          >
            Pour les questions qui dépassent notre périmètre, nous vous orientons
            vers des partenaires sélectionnés pour leur rigueur et leur
            connaissance du tissu économique alsacien.
          </p>
        </Reveal>
      </div>
      <div style={grid}>
        {PARTNER_CATEGORIES.map((cat, i) => (
          <Reveal key={cat.category} delay={i * 0.1}>
            <div
              style={{
                background: C.offwhite,
                border: `1.5px solid ${C.silver}`,
                padding: 'clamp(28px,3.5vw,40px)',
              }}
            >
              <div
                style={{
                  fontFamily: SANS,
                  fontSize: 10.5,
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase',
                  color: C.red,
                  fontWeight: 700,
                  marginBottom: 20,
                }}
              >
                {cat.category}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {cat.partners.map((p) => (
                  <div
                    key={p.name}
                    style={{
                      borderLeft: `2px solid ${C.blue}`,
                      paddingLeft: 14,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: SERIF,
                        fontSize: 17,
                        fontWeight: 700,
                        color: C.blue,
                        marginBottom: 4,
                      }}
                    >
                      {p.name}
                    </div>
                    <div
                      style={{
                        fontFamily: SANS,
                        fontSize: 13,
                        color: C.muted,
                        lineHeight: 1.5,
                      }}
                    >
                      {p.detail}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* CTA réseau */}
      <Reveal delay={0.3}>
        <div
          style={{
            maxWidth: 1280,
            margin: '64px auto 0',
            background: C.bluePale,
            border: `1.5px solid ${C.blue}`,
            padding: 'clamp(32px,4vw,48px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 24,
            flexWrap: 'wrap',
          }}
        >
          <div>
            <div
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(20px,2.4vw,28px)',
                fontWeight: 700,
                color: C.blue,
                marginBottom: 8,
              }}
            >
              Besoin d&apos;une mise en relation&nbsp;?
            </div>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 16,
                color: C.muted,
              }}
            >
              Nous orientons nos clients vers le bon interlocuteur en moins de
              48 h.
            </div>
          </div>
          <a href="#contact" style={{ textDecoration: 'none' }}>
            <BlueButton filled>
              Nous contacter
            </BlueButton>
          </a>
        </div>
      </Reveal>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   10 · FooterSection
   ════════════════════════════════════════════════════════════════════════════ */
function FooterSection() {
  const cols: { title: string; items: { label: string; href: string }[] }[] = [
    {
      title: 'Services',
      items: [
        { label: 'Comptabilité & bilan', href: '#services' },
        { label: 'Fiscalité & optimisation', href: '#services' },
        { label: 'Paie & social', href: '#services' },
        { label: 'Commissariat aux comptes', href: '#services' },
      ],
    },
    {
      title: 'Cabinet',
      items: [
        { label: 'Notre méthode', href: '#processus' },
        { label: 'Spécificités Alsace-Moselle', href: '#specificites' },
        { label: 'Notre réseau', href: '#partners' },
        { label: 'Témoignages clients', href: '#temoignages' },
      ],
    },
    {
      title: 'Contact',
      items: [
        { label: 'Diagnostic gratuit', href: '#contact' },
        { label: '03 88 XX XX XX', href: 'tel:+33388000000' },
        { label: 'contact@schreiber-ec.fr', href: 'mailto:contact@schreiber-ec.fr' },
        { label: '14 rue de Neudorf, Strasbourg', href: '#contact' },
      ],
    },
  ];

  const foot: React.CSSProperties = {
    background: C.blueDeep,
    borderTop: `3px solid ${C.red}`,
    padding: 'clamp(64px,9vw,110px) clamp(24px,6vw,96px) 40px',
  };

  return (
    <footer style={foot}>
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.5fr repeat(3, 1fr)',
          gap: 'clamp(32px,5vw,70px)',
        }}
        className="r289-footgrid"
      >
        {/* Colonne marque */}
        <div>
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 22,
              fontWeight: 700,
              color: C.white,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 6,
            }}
          >
            <Scale size={22} color="rgba(255,255,255,0.75)" strokeWidth={1.6} />{fd?.businessName ?? "Schreiber & Associés"}</div>
          <div
            style={{
              fontFamily: SANS,
              fontSize: 11,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.5)',
              marginBottom: 22,
            }}
          >
            Expert-comptable & commissaires aux comptes
          </div>
          <p
            style={{
              fontFamily: SANS,
              fontSize: 14.5,
              lineHeight: 1.7,
              color: 'rgba(255,255,255,0.58)',
              maxWidth: 320,
            }}
          >
            Cabinet indépendant fondé en 1997. Spécialiste du droit local
            Alsace-Moselle. Membre de l&apos;Ordre des Experts-Comptables — Grand
            Est.
          </p>

          {/* Certifications */}
          <div
            style={{
              marginTop: 28,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            <div
              style={{
                fontFamily: SANS,
                fontSize: 12,
                color: 'rgba(255,255,255,0.7)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  background: C.red,
                  display: 'inline-block',
                }}
              />
              Ordre des Experts-Comptables — Grand Est
            </div>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 12,
                color: 'rgba(255,255,255,0.7)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  background: C.red,
                  display: 'inline-block',
                }}
              />
              SIRET : 412 XXX XXX 00014
            </div>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 12,
                color: 'rgba(255,255,255,0.7)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  background: C.red,
                  display: 'inline-block',
                }}
              />
              Compagnie des Commissaires aux Comptes
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginTop: 24,
              fontFamily: SANS,
              fontSize: 12,
              color: 'rgba(255,255,255,0.5)',
            }}
          >
            <MapPin size={14} color={C.red} strokeWidth={1.6} />
            14 rue de Neudorf · 67100 Strasbourg
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
                color: C.red,
                marginBottom: 22,
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
                      fontFamily: SANS,
                      fontSize: 15,
                      color: 'rgba(255,255,255,0.62)',
                      textDecoration: 'none',
                      transition: 'color .3s',
                    }}
                    onMouseEnter={(e) =>
                      ((e.target as HTMLElement).style.color = C.white)
                    }
                    onMouseLeave={(e) =>
                      ((e.target as HTMLElement).style.color = 'rgba(255,255,255,0.62)')
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

      {/* Barre de bas de page */}
      <div
        style={{
          maxWidth: 1280,
          margin: '60px auto 0',
          paddingTop: 24,
          borderTop: `1px solid rgba(255,255,255,0.12)`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
          fontFamily: SANS,
          fontSize: 11.5,
          letterSpacing: '0.08em',
          color: 'rgba(255,255,255,0.4)',
        }}
      >
        <span>
          © 1997–2026 Schreiber & Associés — Cabinet d&apos;expertise comptable
          agréé. Tous droits réservés.
        </span>
        <span style={{ display: 'flex', gap: 24 }}>
          <a href="#hero" style={{ color: 'inherit', textDecoration: 'none' }}>
            Mentions légales
          </a>
          <a href="#hero" style={{ color: 'inherit', textDecoration: 'none' }}>
            Politique de confidentialité
          </a>
          <a href="#hero" style={{ color: 'inherit', textDecoration: 'none' }}>
            CGV
          </a>
        </span>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .r289-footgrid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 520px) {
          .r289-footgrid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   PAGE PRINCIPALE
   ════════════════════════════════════════════════════════════════════════════ */

// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function Impact289Page() {
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
    background: C.blueDeep,
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
      <StatsSection />
      <ScrollCrossfade />
      <ServicesSection />
      <ProcessSection />
      <SpecificiteSection />
      <TestimonialsSection />
      <PartnersSection />
      <ContactFormSection />
      <FooterSection />
    </main>
  );
}
