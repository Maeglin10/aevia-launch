'use client';

import React, { useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  MotionValue,
  useMotionValue,
  animate,
} from 'framer-motion';
import {
  ArrowRight,
  ChevronDown,
  MapPin,
  Quote,
  Ruler,
  Scissors,
  Star,
} from 'lucide-react';

/* ════════════════════════════════════════════════════════════════════════════
   MAISON CÉLESTE — Couture sur mesure & retouches luxe · Paris 8e (Madeleine)
   Photographie Unsplash réelle + chorégraphie éditoriale au défilement.
   Auto-suffisant. 'use client'. Minimum 1900 lignes.
   ════════════════════════════════════════════════════════════════════════════ */

/* ── Palette ─────────────────────────────────────────────────────────────── */
const C = {
  black: '#0d0d0d',
  blackDeep: '#080808',
  blackMid: '#1a1a1a',
  champagne: '#e8d5b0',
  champagneDeep: '#d4bc93',
  champagneLight: '#f2e8d0',
  white: '#ffffff',
  offWhite: '#faf8f4',
  gold: '#c9a55a',
  goldLight: '#dfc07c',
  ink: '#111111',
  fog: '#2a2a2a',
} as const;

const SERIF = "'EB Garamond', Georgia, serif" as const;
const SANS = "'Raleway', system-ui, sans-serif" as const;

/* ── Photographie (Unsplash IDs réels — NE PAS modifier) ─────────────────── */
const PHOTO = {
  atelier:
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1600&auto=format&fit=crop',
  mode:
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1600&auto=format&fit=crop',
  mannequin:
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1600&auto=format&fit=crop',
  tissu:
    'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1600&auto=format&fit=crop',
  atelierWide:
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2000&auto=format&fit=crop',
  modeFull:
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2000&auto=format&fit=crop',
} as const;

/* ── Easing partagé ──────────────────────────────────────────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ════════════════════════════════════════════════════════════════════════════
   Primitives partagées
   ════════════════════════════════════════════════════════════════════════════ */

/** Étiquette fine, capitales, interlettrage large, filet doré. */
function Eyebrow({
  children,
  color = C.gold,
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
    flexShrink: 0,
  };
  const label: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 11,
    letterSpacing: '0.42em',
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

/** Bouton doré, contour fin, flèche qui glisse au survol. */
function GoldButton({
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
    padding: '15px 30px',
    fontFamily: SANS,
    fontSize: 12,
    letterSpacing: '0.26em',
    textTransform: 'uppercase',
    fontWeight: 500,
    cursor: 'pointer',
    border: `1px solid ${C.gold}`,
    background: filled ? C.gold : 'transparent',
    color: filled ? C.black : C.gold,
    transition: 'all .5s cubic-bezier(.16,1,.3,1)',
    position: 'relative',
  };
  const hov: React.CSSProperties = hover
    ? filled
      ? { background: C.goldLight, transform: 'translateY(-2px)' }
      : { background: 'rgba(201,165,90,0.10)', transform: 'translateY(-2px)' }
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

/** Image avec léger drift parallaxe interne. */
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
   Navigation : transparente → solide au défilement
   ════════════════════════════════════════════════════════════════════════════ */
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
        letterSpacing: '0.20em',
        textTransform: 'uppercase',
        color: h ? C.gold : C.champagne,
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

function Nav() {
  const [solid, setSolid] = useState(false);
  React.useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: 'Savoir-faire', href: '#services' },
    { label: 'Notre Maison', href: '#atelier' },
    { label: 'Créations', href: '#creations' },
    { label: 'Matières', href: '#materiaux' },
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
      ? '16px clamp(20px,5vw,64px)'
      : '26px clamp(20px,5vw,64px)',
    background: solid ? 'rgba(13,13,13,0.94)' : 'transparent',
    backdropFilter: solid ? 'blur(14px) saturate(120%)' : 'none',
    WebkitBackdropFilter: solid ? 'blur(14px) saturate(120%)' : 'none',
    borderBottom: solid
      ? `1px solid rgba(201,165,90,0.20)`
      : '1px solid transparent',
    transition: 'all .6s cubic-bezier(.16,1,.3,1)',
  };

  const brand: React.CSSProperties = {
    fontFamily: SERIF,
    fontSize: 20,
    letterSpacing: '0.34em',
    color: C.champagne,
    textTransform: 'uppercase',
    fontWeight: 400,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  };

  const linkRow: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'clamp(18px,2.4vw,38px)',
  };

  return (
    <nav style={bar} aria-label="Navigation principale">
      <div style={brand}>
        <Scissors size={18} color={C.gold} strokeWidth={1.3} />
        Maison&nbsp;Céleste
      </div>
      <div style={linkRow} className="r281-navlinks">
        {links.map((l) => (
          <NavLink key={l.label} label={l.label} href={l.href} />
        ))}
      </div>
      <div className="r281-navcta">
        <a href="#rendez-vous" style={{ textDecoration: 'none' }}>
          <GoldButton>Prendre RDV</GoldButton>
        </a>
      </div>
      <style>{`
        @media (max-width: 860px) {
          .r281-navlinks { display: none !important; }
          .r281-navcta { display: none !important; }
        }
      `}</style>
    </nav>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   1 · HeroSection — Hero minimaliste luxe
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
    background: C.black,
  };

  return (
    <section id="hero" ref={ref} style={section}>
      {/* Photo plein cadre — atelier couture */}
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
          src={PHOTO.atelierWide}
          alt="L'atelier de couture Maison Céleste, Paris 8e"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          priority-hint="high"
        />
      </motion.div>

      {/* Voile sombre progressif */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(13,13,13,0.52) 0%, rgba(13,13,13,0.12) 38%, rgba(13,13,13,0.50) 70%, rgba(13,13,13,0.90) 100%)',
        }}
      />
      {/* Voile radial latéral */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(110% 90% at 50% 40%, transparent 40%, rgba(13,13,13,0.50) 100%)',
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
          padding: '0 clamp(24px,6vw,96px)',
          y: titleY,
          opacity: titleOpacity,
        }}
      >
        <Reveal y={20}>
          <Eyebrow color={C.goldLight} align="center">
            Couture sur mesure · Madeleine, Paris 8e
          </Eyebrow>
        </Reveal>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.15 }}
          style={{
            fontFamily: SERIF,
            fontWeight: 400,
            color: C.champagne,
            fontSize: 'clamp(52px, 8.5vw, 132px)',
            lineHeight: 0.97,
            letterSpacing: '-0.01em',
            margin: '28px 0 24px',
            textShadow: '0 12px 60px rgba(0,0,0,0.55)',
          }}
        >
          L&apos;excellence{' '}
          <span style={{ fontStyle: 'italic', color: C.goldLight }}>
            à vos mesures
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.45 }}
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 'clamp(16px, 2vw, 22px)',
            color: 'rgba(232,213,176,0.88)',
            maxWidth: 560,
            lineHeight: 1.65,
          }}
        >
          Depuis 1987, Maison Céleste perpétue l&apos;art de la coupe haute couture
          dans le cœur du 8e arrondissement de Paris.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.72 }}
          style={{ marginTop: 44 }}
        >
          <a href="#rendez-vous" style={{ textDecoration: 'none' }}>
            <GoldButton filled>Prendre rendez-vous</GoldButton>
          </a>
        </motion.div>
      </motion.div>

      {/* Indice de défilement */}
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
            color: 'rgba(232,213,176,0.7)',
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
   2 · ScrollCrossfade — 320vh sticky crossfade 3 visuels
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
    src: PHOTO.mannequin,
    alt: "Mannequin lors d'un essayage chez Maison Céleste",
    index: 'I',
    caption: 'L\'Essayage',
    sub: "Chaque silhouette naît d'un dialogue entre la couturière et vous.",
  },
  {
    src: PHOTO.tissu,
    alt: 'Détail de broderie et tissu luxe Maison Céleste',
    index: 'II',
    caption: 'La Broderie',
    sub: "Fils d'or, soie grège, dentelle de Calais — la matière comme langage.",
  },
  {
    src: PHOTO.atelier,
    alt: "L'atelier de couture Maison Céleste à Paris",
    index: 'III',
    caption: 'L\'Atelier',
    sub: 'Trente-cinq ans de gestes précis, transmis de génération en génération.',
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
        padding: '0 clamp(24px,6vw,96px)',
        opacity,
        y,
      }}
    >
      <span
        style={{
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontSize: 'clamp(40px, 9vw, 120px)',
          color: 'rgba(201,165,90,0.30)',
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
          color: C.champagne,
          lineHeight: 1,
          margin: 0,
          textShadow: '0 8px 40px rgba(0,0,0,0.60)',
        }}
      >
        {chapter.caption}
      </h2>
      <p
        style={{
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontSize: 'clamp(15px, 1.8vw, 21px)',
          color: 'rgba(232,213,176,0.88)',
          marginTop: 18,
          maxWidth: 480,
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
    <motion.div style={{ height: 2, width, background: C.gold, opacity }} />
  );
}

function ScrollCrossfade() {
  const n = CROSSFADE_CHAPTERS.length;
  const progress = useMotionValue(0.5 / n);
  const [active, setActive] = useState(0);
  const goTo = (i: number) => {
    setActive(i);
    animate(progress, (i + 0.5) / n, { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] });
  };

  return (
    <section
      style={{ height: '100vh', overflow: 'hidden', position: 'relative', background: C.black }}
      aria-label="Savoir-faire Maison Céleste"
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
              'linear-gradient(to bottom, rgba(13,13,13,0.32), rgba(13,13,13,0.08) 45%, rgba(13,13,13,0.65))',
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

        {/* Points de progression */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 12,
          }}
          aria-hidden="true"
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
   3 · ServicesSection — 3 métiers de la maison
   ════════════════════════════════════════════════════════════════════════════ */
type Service = {
  icon: React.ReactNode;
  titre: string;
  sous: string;
  detail: string;
};

const SERVICES: Service[] = [
  {
    icon: <Scissors size={32} strokeWidth={1.3} color={C.gold} />,
    titre: 'Robe sur mesure',
    sous: 'De la toile à la tenue finale',
    detail:
      "Chaque robe naît d'un patron unique tracé à vos mensurations. De la mousseline de calage à l'étoffe définitive, trois essayages jalonnent un savoir-faire de plus de trente ans.",
  },
  {
    icon: <Ruler size={32} strokeWidth={1.3} color={C.gold} />,
    titre: 'Costume homme',
    sous: 'La coupe au service de la posture',
    detail:
      'Veste, pantalon, gilet : chaque pièce est construite sur un buste personnel. Épaules, plastron, emmanchures — la structure du vêtement épouse la morphologie avec une précision millimétrique.',
  },
  {
    icon: <Star size={32} strokeWidth={1.3} color={C.gold} />,
    titre: 'Retouches prestige',
    sous: 'Préserver, ajuster, sublimer',
    detail:
      "Robe de mariée, couture de maison, pièce de collection : notre atelier reçoit et retouche des vêtements d'exception. Chaque intervention respecte la structure d'origine et le fil de la matière.",
  },
];

function ServiceCard({ svc, i }: { svc: Service; i: number }) {
  const [hover, setHover] = useState(false);
  const card: React.CSSProperties = {
    padding: 'clamp(36px,4vw,52px)',
    border: `1px solid ${hover ? 'rgba(201,165,90,0.55)' : 'rgba(201,165,90,0.20)'}`,
    background: hover ? 'rgba(201,165,90,0.04)' : 'transparent',
    transition: 'all .5s cubic-bezier(.16,1,.3,1)',
    cursor: 'default',
    display: 'flex',
    flexDirection: 'column',
    gap: 22,
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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `1px solid rgba(201,165,90,0.30)`,
            background: 'rgba(201,165,90,0.06)',
            transition: 'border-color .5s',
          }}
        >
          {svc.icon}
        </div>
        <div>
          <h3
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(26px,2.8vw,34px)',
              fontWeight: 400,
              color: C.champagne,
              margin: '0 0 8px',
              lineHeight: 1.1,
            }}
          >
            {svc.titre}
          </h3>
          <p
            style={{
              fontFamily: SANS,
              fontSize: 11,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: C.gold,
              margin: 0,
              fontWeight: 500,
            }}
          >
            {svc.sous}
          </p>
        </div>
        <p
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 'clamp(15px,1.5vw,18px)',
            lineHeight: 1.75,
            color: 'rgba(232,213,176,0.72)',
            margin: 0,
          }}
        >
          {svc.detail}
        </p>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 9,
            fontFamily: SANS,
            fontSize: 11,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: hover ? C.goldLight : C.gold,
            fontWeight: 500,
            transition: 'color .4s',
            marginTop: 'auto',
          }}
        >
          En savoir plus
          <ArrowRight
            size={14}
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

function ServicesSection() {
  const sec: React.CSSProperties = {
    background: C.black,
    padding: 'clamp(96px,13vw,180px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
    gap: 'clamp(24px,3vw,44px)',
    maxWidth: 1240,
    margin: '0 auto',
  };

  return (
    <section style={sec} id="services">
      <div style={{ maxWidth: 1240, margin: '0 auto 64px' }}>
        <Reveal>
          <Eyebrow>Nos métiers</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(38px,6vw,78px)',
              fontWeight: 400,
              color: C.champagne,
              margin: '20px 0 0',
              lineHeight: 1.04,
            }}
          >
            Trois savoir-faire,{' '}
            <span style={{ fontStyle: 'italic', color: C.goldLight }}>
              une exigence
            </span>
          </h2>
        </Reveal>
      </div>
      <div style={grid}>
        {SERVICES.map((svc, i) => (
          <ServiceCard key={svc.titre} svc={svc} i={i} />
        ))}
      </div>
      <style>{`
        @media (max-width: 860px) {
          .r281-services-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   4 · ProcessSection — Left sticky photo + right scroll 4 étapes
   ════════════════════════════════════════════════════════════════════════════ */
type ProcessStep = { num: string; titre: string; body: string };

const PROCESS_STEPS: ProcessStep[] = [
  {
    num: '01',
    titre: 'Consultation & mesures',
    body: 'Notre première rencontre est un dialogue : votre silhouette, votre occasion, vos envies. Nous prenons plus de quarante mesures pour construire un patron entièrement personnel.',
  },
  {
    num: '02',
    titre: 'Choix des étoffes',
    body: 'Nous vous guidons dans notre sélection de tissus nobles — soie de Lyon, lainage anglais, dentelle de Calais — pour trouver la matière qui sublimera votre tenue.',
  },
  {
    num: '03',
    titre: 'Essayages',
    body: "Deux à trois essayages permettent d'affiner la coupe, ajuster chaque couture et s'assurer que le vêtement épouse parfaitement votre corps en mouvement.",
  },
  {
    num: '04',
    titre: 'Livraison',
    body: "Votre création vous est remise dans une housse de protection sur mesure, accompagnée d'une fiche d'entretien personnalisée. La maison reste disponible pour tout ajustement.",
  },
];

function ProcessSection() {
  const sec: React.CSSProperties = {
    background: C.offWhite,
    padding: 'clamp(80px,11vw,160px) clamp(24px,6vw,96px)',
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
    top: 90,
    alignSelf: 'start',
  };

  return (
    <section style={sec} id="processus">
      <div style={grid} className="r281-process-grid">
        {/* Photo collante */}
        <div style={stickySide} className="r281-process-sticky">
          <div
            style={{
              overflow: 'hidden',
              border: `1px solid rgba(201,165,90,0.25)`,
              aspectRatio: '4 / 5',
            }}
          >
            <img
              src={PHOTO.atelier}
              alt="La couturière principale de Maison Céleste à l'ouvrage"
              loading="lazy"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </div>
          <div style={{ marginTop: 22 }}>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 10.5,
                letterSpacing: '0.26em',
                textTransform: 'uppercase',
                color: C.gold,
                marginBottom: 8,
                fontWeight: 500,
              }}
            >
              Maison Céleste · Depuis 1987
            </div>
            <div
              style={{
                fontFamily: SERIF,
                fontStyle: 'italic',
                fontSize: 18,
                color: 'rgba(13,13,13,0.72)',
              }}
            >
              « La couture, c'est écouter avant de couper. »
            </div>
          </div>
        </div>

        {/* Étapes qui défilent */}
        <div>
          <Reveal>
            <Eyebrow color={C.gold}>Notre processus</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(34px,5vw,66px)',
                fontWeight: 400,
                color: C.ink,
                margin: '20px 0 56px',
                lineHeight: 1.05,
              }}
            >
              De la première mesure{' '}
              <span style={{ fontStyle: 'italic', color: '#7a5c2e' }}>
                à la dernière épingle
              </span>
            </h2>
          </Reveal>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {PROCESS_STEPS.map((step, i) => (
              <Reveal key={step.num} delay={0.06 * i}>
                <div
                  style={{
                    padding: 'clamp(28px,3.5vw,44px) 0',
                    borderTop: `1px solid rgba(13,13,13,0.12)`,
                    display: 'flex',
                    gap: 28,
                    alignItems: 'flex-start',
                  }}
                >
                  <span
                    style={{
                      fontFamily: SERIF,
                      fontStyle: 'italic',
                      fontSize: 'clamp(26px,3vw,40px)',
                      color: 'rgba(201,165,90,0.55)',
                      minWidth: 56,
                      lineHeight: 1,
                      paddingTop: 4,
                    }}
                  >
                    {step.num}
                  </span>
                  <div>
                    <h4
                      style={{
                        fontFamily: SERIF,
                        fontSize: 'clamp(22px,2.2vw,28px)',
                        fontWeight: 400,
                        color: C.ink,
                        margin: '0 0 12px',
                      }}
                    >
                      {step.titre}
                    </h4>
                    <p
                      style={{
                        fontFamily: SERIF,
                        fontStyle: 'italic',
                        fontSize: 'clamp(15px,1.5vw,17.5px)',
                        lineHeight: 1.75,
                        color: 'rgba(13,13,13,0.68)',
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
            <div style={{ marginTop: 48 }}>
              <a href="#rendez-vous" style={{ textDecoration: 'none' }}>
                <GoldButton filled>Démarrer mon projet</GoldButton>
              </a>
            </div>
          </Reveal>
        </div>
      </div>
      <style>{`
        @media (max-width: 860px) {
          .r281-process-grid { grid-template-columns: 1fr !important; }
          .r281-process-sticky { position: static !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   5 · TestimonialsSection — 3 témoignages avec étoiles
   ════════════════════════════════════════════════════════════════════════════ */
type Testimonial = {
  quote: string;
  name: string;
  role: string;
  occasion: string;
  stars: number;
};

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Maison Céleste a réalisé ma robe de mariée. Du premier essayage à la livraison, chaque détail a été pensé avec une attention que je n'avais jamais rencontrée. Je n'ai jamais été aussi belle de ma vie.",
    name: 'Claire Fontaine',
    role: 'Mariée',
    occasion: 'Robe de mariée sur mesure',
    stars: 5,
  },
  {
    quote:
      "Mon costume pour la remise de la Légion d'honneur devait être irréprochable. Maison Céleste a su capter mon style et livrer une pièce d'une élégance rare, taillée comme une seconde peau.",
    name: 'Antoine de Mauroy',
    role: 'Dirigeant, Paris',
    occasion: 'Costume cérémonie sur mesure',
    stars: 5,
  },
  {
    quote:
      "J'avais une robe de gala héritée de ma mère, fragilisée et démodée. L'atelier a su la restaurer et la moderniser sans trahir son âme. Un travail d'orfèvre, incomparable.",
    name: 'Isabelle Theron',
    role: 'Collectionneuse de mode',
    occasion: 'Retouche prestige robe de gala',
    stars: 5,
  },
];

function TestimonialCard({ t, i }: { t: Testimonial; i: number }) {
  return (
    <Reveal delay={i * 0.12} style={{ height: '100%' }}>
      <figure
        style={{
          background: C.white,
          border: `1px solid rgba(13,13,13,0.10)`,
          padding: 'clamp(34px,4vw,52px)',
          margin: 0,
          height: '100%',
          boxSizing: 'border-box',
          boxShadow: '0 24px 60px -42px rgba(0,0,0,0.18)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Quote size={32} color={C.gold} strokeWidth={1.2} />

        <div style={{ display: 'flex', gap: 4, margin: '18px 0 16px' }}>
          {Array.from({ length: t.stars }).map((_, s) => (
            <Star key={s} size={14} fill={C.gold} color={C.gold} strokeWidth={0} />
          ))}
        </div>

        <div
          style={{
            fontFamily: SANS,
            fontSize: 10.5,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: C.gold,
            marginBottom: 16,
            fontWeight: 500,
          }}
        >
          {t.occasion}
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
          &ldquo;{t.quote}&rdquo;
        </blockquote>

        <figcaption
          style={{
            borderTop: `1px solid rgba(13,13,13,0.10)`,
            paddingTop: 20,
          }}
        >
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 19,
              color: C.black,
              fontWeight: 400,
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
              color: 'rgba(13,13,13,0.50)',
              marginTop: 6,
              fontWeight: 400,
            }}
          >
            {t.role}
          </div>
        </figcaption>
      </figure>
    </Reveal>
  );
}

function TestimonialsSection() {
  const sec: React.CSSProperties = {
    background: C.offWhite,
    padding: 'clamp(90px,12vw,170px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: 'clamp(28px,3.5vw,48px)',
    maxWidth: 1240,
    margin: '0 auto',
  };

  return (
    <section style={sec} id="temoignages">
      <div style={{ maxWidth: 1240, margin: '0 auto 64px', textAlign: 'center' }}>
        <Reveal>
          <Eyebrow color={C.gold} align="center">
            Ils nous ont fait confiance
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(34px,5vw,66px)',
              fontWeight: 400,
              color: C.ink,
              margin: '20px 0 0',
            }}
          >
            Des moments{' '}
            <span style={{ fontStyle: 'italic', color: '#7a5c2e' }}>
              inoubliables
            </span>
          </h2>
        </Reveal>
      </div>
      <div style={grid}>
        {TESTIMONIALS.map((t, i) => (
          <TestimonialCard key={t.name} t={t} i={i} />
        ))}
      </div>
      <style>{`
        @media (max-width: 860px) {
          .r281-temoignages-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   6 · AppointmentFormSection — Formulaire de prise de rendez-vous
   ════════════════════════════════════════════════════════════════════════════ */
const PRESTATIONS = [
  'Robe sur mesure',
  'Costume homme',
  'Retouche',
  'Autre',
] as const;

function AppointmentFormSection() {
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [prestation, setPrestation] = useState('');
  const [occasion, setOccasion] = useState('');
  const [telephone, setTelephone] = useState('');
  const [sent, setSent] = useState(false);

  const onSubmit = () => {
    if (!prenom || !nom || !prestation || !telephone) return;
    setSent(true);
  };

  const sec: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    background: C.black,
    padding: 'clamp(96px,13vw,180px) clamp(24px,6vw,96px)',
  };

  const fieldBase: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    background: 'transparent',
    border: 'none',
    borderBottom: `1px solid rgba(201,165,90,0.40)`,
    padding: '16px 2px',
    fontFamily: SERIF,
    fontSize: 18,
    color: C.champagne,
    outline: 'none',
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 10.5,
    letterSpacing: '0.24em',
    textTransform: 'uppercase',
    color: C.gold,
    display: 'block',
    marginBottom: 4,
    fontWeight: 500,
  };

  return (
    <section style={sec} id="rendez-vous">
      {/* Fond photo discret */}
      <img
        src={PHOTO.modeFull}
        alt=""
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
          maxWidth: 740,
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <Reveal>
          <Eyebrow color={C.goldLight} align="center">
            Prise de rendez-vous
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(38px,6vw,80px)',
              fontWeight: 400,
              color: C.champagne,
              margin: '22px 0 18px',
              lineHeight: 1.04,
            }}
          >
            Votre projet{' '}
            <span style={{ fontStyle: 'italic', color: C.goldLight }}>commence ici</span>
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: 'clamp(16px,1.7vw,20px)',
              lineHeight: 1.7,
              color: 'rgba(232,213,176,0.82)',
              maxWidth: 520,
              margin: '0 auto 52px',
            }}
          >
            Chaque tenue est un projet unique. Partagez vos coordonnées et votre besoin :
            notre équipe vous contactera dans les 48 heures pour convenir d&apos;un premier rendez-vous.
          </p>
        </Reveal>

        {sent ? (
          <Reveal>
            <div
              style={{
                border: `1px solid ${C.gold}`,
                padding: 'clamp(36px,5vw,56px)',
                background: 'rgba(201,165,90,0.05)',
              }}
            >
              <Scissors size={36} color={C.goldLight} strokeWidth={1.2} />
              <h3
                style={{
                  fontFamily: SERIF,
                  fontSize: 32,
                  fontWeight: 400,
                  color: C.champagne,
                  margin: '20px 0 14px',
                }}
              >
                Merci, {prenom}.
              </h3>
              <p
                style={{
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  fontSize: 18,
                  color: 'rgba(232,213,176,0.80)',
                  margin: '0 0 8px',
                }}
              >
                Votre demande pour{' '}
                <strong style={{ color: C.goldLight, fontStyle: 'normal' }}>
                  {prestation}
                </strong>{' '}
                a bien été transmise à notre atelier.
              </p>
              <p
                style={{
                  fontFamily: SANS,
                  fontSize: 12,
                  letterSpacing: '0.20em',
                  textTransform: 'uppercase',
                  color: 'rgba(232,213,176,0.55)',
                  margin: 0,
                  fontWeight: 500,
                }}
              >
                Nous vous rappelons au {telephone} sous 48 h.
              </p>
            </div>
          </Reveal>
        ) : (
          <Reveal delay={0.24}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 34,
                textAlign: 'left',
              }}
            >
              {/* Prénom + Nom */}
              <div
                style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}
                className="r281-form-row"
              >
                <div>
                  <label style={labelStyle} htmlFor="mc-prenom">
                    Prénom
                  </label>
                  <input
                    id="mc-prenom"
                    style={fieldBase}
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    placeholder="Marie"
                    autoComplete="given-name"
                  />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="mc-nom">
                    Nom
                  </label>
                  <input
                    id="mc-nom"
                    style={fieldBase}
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    placeholder="Beaumont"
                    autoComplete="family-name"
                  />
                </div>
              </div>

              {/* Type de prestation */}
              <div>
                <label style={labelStyle} htmlFor="mc-prestation">
                  Type de prestation
                </label>
                <select
                  id="mc-prestation"
                  style={{
                    ...fieldBase,
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    cursor: 'pointer',
                    color: prestation ? C.champagne : 'rgba(232,213,176,0.42)',
                  }}
                  value={prestation}
                  onChange={(e) => setPrestation(e.target.value)}
                >
                  <option value="" style={{ color: '#000' }}>
                    Choisir une prestation…
                  </option>
                  {PRESTATIONS.map((p) => (
                    <option key={p} value={p} style={{ color: '#000' }}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              {/* Occasion */}
              <div>
                <label style={labelStyle} htmlFor="mc-occasion">
                  Occasion <span style={{ opacity: 0.55, fontWeight: 400 }}>(facultatif)</span>
                </label>
                <input
                  id="mc-occasion"
                  style={fieldBase}
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  placeholder="Mariage, gala, remise de prix…"
                />
              </div>

              {/* Téléphone */}
              <div>
                <label style={labelStyle} htmlFor="mc-telephone">
                  Téléphone
                </label>
                <input
                  id="mc-telephone"
                  style={fieldBase}
                  type="tel"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  placeholder="+33 6 12 34 56 78"
                  autoComplete="tel"
                />
              </div>

              <div style={{ marginTop: 8, textAlign: 'center' }}>
                <GoldButton filled onClick={onSubmit} type="button">
                  Envoyer ma demande
                </GoldButton>
              </div>
            </div>
          </Reveal>
        )}
      </div>
      <style>{`
        @media (max-width: 860px) {
          .r281-form-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   7 · MaterialsSection — Les matières nobles
   ════════════════════════════════════════════════════════════════════════════ */
type Material = {
  nom: string;
  origine: string;
  description: string;
  accent: string;
};

const MATERIALS: Material[] = [
  {
    nom: 'Soie',
    origine: 'Soie de Lyon · France',
    description:
      "Tissée sur les métiers jacquard lyonnais, notre soie charmeuse capte la lumière avec une fluidité incomparable. Elle habille aussi bien une robe de cocktail qu'un chemisier de soirée.",
    accent: 'Légèreté · Lumière · Sensualité',
  },
  {
    nom: 'Cachemire',
    origine: "Cachemire d'Écosse · Grande-Bretagne",
    description:
      'Issu des chèvres du Cachemire, sélectionné et filé en Écosse, notre cachemire deux épaisseurs est la matière de prédilection des costumes homme et des manteaux sur mesure.',
    accent: 'Chaleur · Douceur · Noblesse',
  },
  {
    nom: 'Dentelle de Calais',
    origine: 'Dentelle · Calais, France',
    description:
      "Fabriquée sur des métiers Leavers datant du XIXe siècle, la dentelle de Calais est l'âme de nos robes de mariée. Chaque motif est tissé fil à fil, dans une tradition centenaire.",
    accent: 'Élégance · Tradition · Finesse',
  },
  {
    nom: 'Lin premium',
    origine: 'Lin de Normandie · France',
    description:
      "Cultivé sur les terres normandes et rouie à l'ancienne, notre lin haut de gamme est le choix idéal pour les tenues estivales : structuré, respirant, d'une beauté naturelle incomparable.",
    accent: 'Naturel · Structure · Authenticité',
  },
];

function MaterialCard({ mat, i }: { mat: Material; i: number }) {
  const [hover, setHover] = useState(false);
  const card: React.CSSProperties = {
    padding: 'clamp(30px,3.5vw,44px)',
    background: hover ? C.black : '#f5f0e8',
    border: `1px solid ${hover ? 'rgba(201,165,90,0.45)' : 'rgba(13,13,13,0.10)'}`,
    transition: 'all .5s cubic-bezier(.16,1,.3,1)',
    cursor: 'default',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    height: '100%',
    boxSizing: 'border-box',
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
            fontFamily: SANS,
            fontSize: 10,
            letterSpacing: '0.30em',
            textTransform: 'uppercase',
            color: C.gold,
            fontWeight: 500,
          }}
        >
          {mat.origine}
        </div>
        <h3
          style={{
            fontFamily: SERIF,
            fontSize: 'clamp(30px,3vw,42px)',
            fontWeight: 400,
            color: hover ? C.champagne : C.ink,
            margin: 0,
            lineHeight: 1.1,
            transition: 'color .5s',
          }}
        >
          {mat.nom}
        </h3>
        <p
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 'clamp(14px,1.4vw,17px)',
            lineHeight: 1.75,
            color: hover ? 'rgba(232,213,176,0.72)' : 'rgba(13,13,13,0.68)',
            margin: 0,
            flex: 1,
            transition: 'color .5s',
          }}
        >
          {mat.description}
        </p>
        <div
          style={{
            fontFamily: SANS,
            fontSize: 10,
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color: hover ? 'rgba(201,165,90,0.85)' : 'rgba(13,13,13,0.40)',
            fontWeight: 500,
            transition: 'color .5s',
          }}
        >
          {mat.accent}
        </div>
      </article>
    </Reveal>
  );
}

function MaterialsSection() {
  const sec: React.CSSProperties = {
    background: C.champagneLight,
    padding: 'clamp(96px,13vw,180px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: 'clamp(20px,2.5vw,36px)',
    maxWidth: 1240,
    margin: '0 auto',
  };

  return (
    <section style={sec} id="materiaux">
      <div style={{ maxWidth: 1240, margin: '0 auto 64px' }}>
        <Reveal>
          <Eyebrow color={C.gold}>Les matières nobles</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(36px,5.5vw,72px)',
              fontWeight: 400,
              color: C.ink,
              margin: '20px 0 0',
              lineHeight: 1.06,
            }}
          >
            L&apos;étoffe fait{' '}
            <span style={{ fontStyle: 'italic', color: '#7a5c2e' }}>
              la tenue
            </span>
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: 'clamp(15px,1.6vw,19px)',
              lineHeight: 1.78,
              color: 'rgba(13,13,13,0.65)',
              maxWidth: 580,
              marginTop: 20,
            }}
          >
            Nous sélectionnons nos tissus auprès des meilleures maisons européennes.
            Chaque matière est choisie pour son toucher, sa tenue et sa capacité
            à vieillir avec grâce.
          </p>
        </Reveal>
      </div>
      <div style={grid}>
        {MATERIALS.map((mat, i) => (
          <MaterialCard key={mat.nom} mat={mat} i={i} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   8 · AtlierSection — Présentation de l'atelier et de la fondatrice
   ════════════════════════════════════════════════════════════════════════════ */
function AtelierSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);

  const sec: React.CSSProperties = {
    position: 'relative',
    minHeight: '90vh',
    display: 'flex',
    alignItems: 'center',
    overflow: 'hidden',
    background: C.black,
    padding: 'clamp(80px,12vw,160px) clamp(24px,6vw,96px)',
  };

  const stats: { k: string; v: string }[] = [
    { k: '1987', v: 'Fondation de la maison' },
    { k: '35 ans', v: 'D\'excellence couture' },
    { k: '2', v: 'Couturières principales' },
  ];

  return (
    <section ref={ref} style={sec} id="atelier">
      {/* Photo parallaxe en fond */}
      <motion.div
        style={{ position: 'absolute', inset: '-10% 0', height: '120%', y }}
      >
        <img
          src={PHOTO.mode}
          alt="Ambiance de l'atelier Maison Céleste, Paris"
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </motion.div>

      {/* Voile gauche → transparent à droite */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to right, rgba(13,13,13,0.94) 0%, rgba(13,13,13,0.66) 48%, rgba(13,13,13,0.28) 100%)',
        }}
      />

      <div style={{ position: 'relative', zIndex: 2, maxWidth: 640 }}>
        <Reveal>
          <Eyebrow>Notre Maison</Eyebrow>
        </Reveal>
        <Reveal delay={0.10}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(36px,5.5vw,76px)',
              fontWeight: 400,
              color: C.champagne,
              margin: '22px 0 26px',
              lineHeight: 1.05,
            }}
          >
            Trente-cinq ans{' '}
            <span style={{ fontStyle: 'italic', color: C.goldLight }}>
              d&apos;excellence
            </span>
          </h2>
        </Reveal>
        <Reveal delay={0.18}>
          <p
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(16px,1.7vw,20px)',
              lineHeight: 1.82,
              color: 'rgba(232,213,176,0.83)',
              maxWidth: 520,
              marginBottom: 16,
              fontStyle: 'italic',
            }}
          >
            Maison Céleste a été fondée en 1987 par Isabelle Céleste, formée aux
            ateliers Balenciaga et Christian Lacroix avant d&apos;ouvrir sa propre maison
            rue de Surène, à deux pas de la Madeleine.
          </p>
        </Reveal>
        <Reveal delay={0.24}>
          <p
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(15px,1.5vw,18px)',
              lineHeight: 1.8,
              color: 'rgba(232,213,176,0.68)',
              maxWidth: 520,
              marginBottom: 40,
            }}
          >
            Aujourd&apos;hui secondée par sa fille Sophie, également formée à l&apos;ESMOD Paris,
            la maison accueille une clientèle d&apos;exception sur rendez-vous, dans un atelier
            intimiste où chaque tenue est traitée comme une œuvre unique.
          </p>
        </Reveal>
        <Reveal delay={0.30}>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <a href="#rendez-vous" style={{ textDecoration: 'none' }}>
              <GoldButton filled>Prendre rendez-vous</GoldButton>
            </a>
            <a href="#services" style={{ textDecoration: 'none' }}>
              <GoldButton>Nos prestations</GoldButton>
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.38}>
          <div
            style={{
              display: 'flex',
              gap: 'clamp(28px,4vw,56px)',
              marginTop: 58,
              flexWrap: 'wrap',
            }}
          >
            {stats.map((s) => (
              <div key={s.k}>
                <div
                  style={{
                    fontFamily: SERIF,
                    fontStyle: 'italic',
                    fontSize: 'clamp(28px,3.2vw,44px)',
                    color: C.goldLight,
                    lineHeight: 1,
                  }}
                >
                  {s.k}
                </div>
                <div
                  style={{
                    fontFamily: SANS,
                    fontSize: 10.5,
                    letterSpacing: '0.20em',
                    textTransform: 'uppercase',
                    color: 'rgba(232,213,176,0.60)',
                    marginTop: 10,
                    fontWeight: 400,
                  }}
                >
                  {s.v}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   9 · CreationsSection — 3 créations signatures
   ════════════════════════════════════════════════════════════════════════════ */
type Creation = {
  img: string;
  alt: string;
  titre: string;
  sous: string;
  description: string;
};

const CREATIONS: Creation[] = [
  {
    img: PHOTO.mode,
    alt: 'Robe cocktail signature Maison Céleste',
    titre: 'La Robe Cocktail',
    sous: 'Soie & dentelle · Sur mesure',
    description:
      'Silhouette ajustée en soie crêpe de Chine ivoire, encolure asymétrique et détails de dentelle de Calais. Une pièce qui marie modernité et raffinement classique.',
  },
  {
    img: PHOTO.mannequin,
    alt: 'Smoking sur mesure Maison Céleste',
    titre: 'Le Smoking',
    sous: 'Lainage anglais · Sur mesure',
    description:
      'Smoking deux boutons en lainage superfin 180s, revers en satin de soie, pantalon à galon. Coupe italienne revisitée par la tradition de la maison.',
  },
  {
    img: PHOTO.atelier,
    alt: 'Robe de mariée Maison Céleste',
    titre: 'La Robe de Mariée',
    sous: 'Dentelle Leavers · Sur mesure',
    description:
      "Robe de mariée en dentelle de Calais sur fond de soie, traîne amovible et dos travaillé bouton par bouton. Chaque robe est unique, aucun patron n'est réutilisé.",
  },
];

function CreationCard({ c, i }: { c: Creation; i: number }) {
  const [hover, setHover] = useState(false);
  const card: React.CSSProperties = {
    overflow: 'hidden',
    background: C.black,
    border: `1px solid ${hover ? 'rgba(201,165,90,0.52)' : 'rgba(201,165,90,0.18)'}`,
    transform: hover ? 'translateY(-12px)' : 'none',
    boxShadow: hover
      ? '0 42px 80px -28px rgba(0,0,0,0.70)'
      : '0 14px 40px -28px rgba(0,0,0,0.50)',
    transition: 'all .6s cubic-bezier(.16,1,.3,1)',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
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
            position: 'relative',
            overflow: 'hidden',
            aspectRatio: '3 / 4',
          }}
        >
          <img
            src={c.img}
            alt={c.alt}
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
                'linear-gradient(to top, rgba(13,13,13,0.82), transparent 55%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 20,
              left: 22,
              right: 22,
              fontFamily: SANS,
              fontSize: 10,
              letterSpacing: '0.26em',
              textTransform: 'uppercase',
              color: 'rgba(232,213,176,0.78)',
              fontWeight: 500,
            }}
          >
            {c.sous}
          </div>
        </div>

        <div
          style={{
            padding: 'clamp(24px,3vw,36px)',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          <h3
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(24px,2.4vw,32px)',
              fontWeight: 400,
              color: C.champagne,
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            {c.titre}
          </h3>
          <p
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: 'clamp(14px,1.4vw,16.5px)',
              lineHeight: 1.72,
              color: 'rgba(232,213,176,0.68)',
              margin: 0,
              flex: 1,
            }}
          >
            {c.description}
          </p>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 9,
              fontFamily: SANS,
              fontSize: 11,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: hover ? C.goldLight : C.gold,
              fontWeight: 500,
              transition: 'color .4s',
            }}
          >
            Voir la création
            <ArrowRight
              size={14}
              style={{
                transform: hover ? 'translateX(5px)' : 'none',
                transition: 'transform .5s cubic-bezier(.16,1,.3,1)',
              }}
            />
          </div>
        </div>
      </article>
    </Reveal>
  );
}

function CreationsSection() {
  const sec: React.CSSProperties = {
    background: C.blackMid,
    padding: 'clamp(96px,13vw,180px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
    gap: 'clamp(24px,3vw,44px)',
    maxWidth: 1240,
    margin: '0 auto',
  };

  return (
    <section style={sec} id="creations">
      <div style={{ maxWidth: 1240, margin: '0 auto 64px' }}>
        <Reveal>
          <Eyebrow>Créations signatures</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(38px,6vw,78px)',
              fontWeight: 400,
              color: C.champagne,
              margin: '20px 0 0',
              lineHeight: 1.04,
            }}
          >
            L&apos;art de la{' '}
            <span style={{ fontStyle: 'italic', color: C.goldLight }}>
              silhouette
            </span>
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: 'clamp(15px,1.6vw,19px)',
              lineHeight: 1.78,
              color: 'rgba(232,213,176,0.65)',
              maxWidth: 560,
              marginTop: 20,
            }}
          >
            Trois pièces emblématiques qui résument l&apos;identité de Maison Céleste :
            la précision de la coupe, la qualité des matières, la singularité de chaque tenue.
          </p>
        </Reveal>
      </div>
      <div style={grid}>
        {CREATIONS.map((c, i) => (
          <CreationCard key={c.titre} c={c} i={i} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   10 · FooterSection — Logo, adresse, horaires, mentions légales
   ════════════════════════════════════════════════════════════════════════════ */
function FooterSection() {
  const cols: { title: string; items: { label: string; href: string }[] }[] = [
    {
      title: 'Savoir-faire',
      items: [
        { label: 'Robe sur mesure', href: '#services' },
        { label: 'Costume homme', href: '#services' },
        { label: 'Retouches prestige', href: '#services' },
        { label: 'Notre processus', href: '#processus' },
      ],
    },
    {
      title: 'La Maison',
      items: [
        { label: 'Notre histoire', href: '#atelier' },
        { label: 'Créations', href: '#creations' },
        { label: 'Les matières', href: '#materiaux' },
        { label: 'Témoignages', href: '#temoignages' },
      ],
    },
    {
      title: 'Contact',
      items: [
        { label: 'Prendre rendez-vous', href: '#rendez-vous' },
        { label: '01 42 65 XX XX', href: 'tel:+33142650000' },
        { label: 'contact@maissonceleste.fr', href: 'mailto:contact@maisonceleste.fr' },
        { label: 'Instagram', href: '#' },
      ],
    },
  ];

  const foot: React.CSSProperties = {
    background: C.black,
    borderTop: `1px solid rgba(201,165,90,0.20)`,
    padding: 'clamp(72px,9vw,110px) clamp(24px,6vw,96px) 40px',
  };

  return (
    <footer style={foot} id="footer">
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.5fr repeat(3, 1fr)',
          gap: 'clamp(36px,5vw,70px)',
        }}
        className="r281-footgrid"
      >
        {/* Brand */}
        <div>
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 24,
              letterSpacing: '0.30em',
              textTransform: 'uppercase',
              color: C.champagne,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <Scissors size={20} color={C.gold} strokeWidth={1.3} />
            Maison&nbsp;Céleste
          </div>
          <p
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: 16,
              lineHeight: 1.72,
              color: 'rgba(232,213,176,0.62)',
              marginTop: 20,
              maxWidth: 340,
            }}
          >
            Couture sur mesure & retouches prestige. Sur rendez-vous uniquement.
          </p>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginTop: 22,
              fontFamily: SANS,
              fontSize: 11,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'rgba(232,213,176,0.56)',
              fontWeight: 400,
            }}
          >
            <MapPin size={14} color={C.gold} strokeWidth={1.5} />
            Rue de Surène · Paris 8e · Madeleine
          </div>
          <div
            style={{
              marginTop: 14,
              fontFamily: SANS,
              fontSize: 11,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'rgba(232,213,176,0.45)',
              fontWeight: 400,
            }}
          >
            Ouvert sur rendez-vous · Lun–Sam
          </div>
        </div>

        {/* Colonnes de liens */}
        {cols.map((col) => (
          <div key={col.title}>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 10.5,
                letterSpacing: '0.26em',
                textTransform: 'uppercase',
                color: C.gold,
                marginBottom: 22,
                fontWeight: 500,
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
              {col.items.map((it) => (
                <li key={it.label}>
                  <a
                    href={it.href}
                    style={{
                      fontFamily: SERIF,
                      fontSize: 16,
                      color: 'rgba(232,213,176,0.68)',
                      textDecoration: 'none',
                      transition: 'color .3s',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color = C.champagne;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color =
                        'rgba(232,213,176,0.68)';
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

      {/* Barre de bas de page */}
      <div
        style={{
          maxWidth: 1240,
          margin: '64px auto 0',
          paddingTop: 28,
          borderTop: `1px solid rgba(201,165,90,0.14)`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
          fontFamily: SANS,
          fontSize: 11,
          letterSpacing: '0.12em',
          color: 'rgba(232,213,176,0.45)',
          fontWeight: 400,
        }}
      >
        <span>© 1987–2026 Maison Céleste. Tous droits réservés.</span>
        <span style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <a
            href="#"
            style={{ color: 'inherit', textDecoration: 'none' }}
          >
            Mentions légales
          </a>
          <a
            href="#"
            style={{ color: 'inherit', textDecoration: 'none' }}
          >
            Politique de confidentialité
          </a>
          <a
            href="#"
            style={{ color: 'inherit', textDecoration: 'none' }}
          >
            CGV
          </a>
        </span>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .r281-footgrid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 520px) {
          .r281-footgrid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   PAGE PRINCIPALE — Impact281Page
   ════════════════════════════════════════════════════════════════════════════ */
export default function Impact281Page() {
  const root: React.CSSProperties = {
    background: C.black,
    color: C.champagne,
    fontFamily: SERIF,
    overflowX: 'hidden',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
  };

  return (
    <main id="hero" style={root} suppressHydrationWarning>
      {/* Styles globaux responsifs — préfixés r281- */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=Raleway:wght@400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        /* Inputs/selects — reset placeholder couleur */
        #mc-prenom::placeholder,
        #mc-nom::placeholder,
        #mc-occasion::placeholder,
        #mc-telephone::placeholder {
          color: rgba(232,213,176,0.38);
          font-family: ${SERIF};
          font-style: italic;
        }

        /* Hover liens footer */
        .r281-footlink:hover { color: ${C.champagne} !important; }

        /* Scrollbar discrète */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${C.black}; }
        ::-webkit-scrollbar-thumb { background: rgba(201,165,90,0.35); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(201,165,90,0.55); }

        /* Responsif global — préfixe r281 */
        @media (max-width: 860px) {
          .r281-navlinks { display: none !important; }
          .r281-navcta { display: none !important; }
          .r281-process-grid { grid-template-columns: 1fr !important; }
          .r281-process-sticky { position: static !important; }
          .r281-form-row { grid-template-columns: 1fr !important; }
          .r281-footgrid { grid-template-columns: 1fr 1fr !important; }
        }

        @media (max-width: 520px) {
          .r281-footgrid { grid-template-columns: 1fr !important; }
        }

        /* Réduction des mouvements pour accessibilité */
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <Nav />
      <HeroSection />
      <ScrollCrossfade />
      <ServicesSection />
      <ProcessSection />
      <TestimonialsSection />
      <AppointmentFormSection />
      <MaterialsSection />
      <AtelierSection />
      <CreationsSection />
      <FooterSection />
    </main>
  );
}
