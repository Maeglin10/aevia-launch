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
  Activity,
  ArrowRight,
  ChevronDown,
  Clock,
  Heart,
  MapPin,
  Moon,
  Phone,
  Quote,
  Star,
} from 'lucide-react';

/* ════════════════════════════════════════════════════════════════════════════
   OSTÉOPATHIE ALSACE — Ostéopathe D.O., Strasbourg Orangerie
   Template premium Skylaunch impact-291
   Auto-suffisant · 'use client' · framer-motion + lucide-react uniquement.
   ════════════════════════════════════════════════════════════════════════════ */

/* ── Palette ─────────────────────────────────────────────────────────────── */
const C = {
  terra: '#c4634a',
  terraLight: '#d4836e',
  terraDark: '#a04e39',
  ivory: '#f8f4ed',
  ivoryDeep: '#ede7db',
  slate: '#6b8f9e',
  slateLight: '#8aaab7',
  slateDark: '#4d6e7b',
  dark: '#2e2e2e',
  darkMid: '#4a4a4a',
  darkLight: '#6a6a6a',
  white: '#ffffff',
} as const;

/* ── Typographie ─────────────────────────────────────────────────────────── */
const SERIF = "'Playfair Display', Georgia, serif" as const;
const SANS = "'Inter', system-ui, sans-serif" as const;

/* ── Easing partagé ──────────────────────────────────────────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ── Photos Unsplash (IDs réels, santé & thérapie) ──────────────────────── */
const PHOTO = {
  therapy:
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1600&auto=format&fit=crop',
  cabinet:
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1600&auto=format&fit=crop',
  consultation:
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=1600&auto=format&fit=crop',
  wellness:
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1600&auto=format&fit=crop',
  hero:
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1600&auto=format&fit=crop',
} as const;

/* ════════════════════════════════════════════════════════════════════════════
   Primitives partagées
   ════════════════════════════════════════════════════════════════════════════ */

/** Étiquette fine terracotta avec filet latéral. */
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
    width: 40,
    height: 1,
    background: color,
    opacity: 0.65,
    flexShrink: 0,
  };
  const label: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 10.5,
    letterSpacing: '0.40em',
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

/** Révélation au défilement : fondu + glissement vertical, une seule fois. */
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

/** Bouton terracotta, contour, flèche au survol. */
function TerraButton({
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
    gap: 11,
    padding: '14px 28px',
    fontFamily: SANS,
    fontSize: 12,
    letterSpacing: '0.24em',
    textTransform: 'uppercase',
    fontWeight: 500,
    cursor: 'pointer',
    border: `1.5px solid ${C.terra}`,
    background: filled ? C.terra : 'transparent',
    color: filled ? C.ivory : C.terra,
    transition: 'all .5s cubic-bezier(.16,1,.3,1)',
    borderRadius: 2,
  };
  const hov: React.CSSProperties = hover
    ? filled
      ? { background: C.terraLight, borderColor: C.terraLight, transform: 'translateY(-2px)', boxShadow: '0 12px 40px -16px rgba(196,99,74,0.55)' }
      : { background: 'rgba(196,99,74,0.08)', transform: 'translateY(-2px)' }
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
          transform: hover ? 'translateX(4px)' : 'none',
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

/* ════════════════════════════════════════════════════════════════════════════
   Navigation : transparente → ivoire au défilement
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
    { label: 'Soins', href: '#soins' },
    { label: 'Techniques', href: '#techniques' },
    { label: 'Pédiatrie', href: '#pediatrie' },
    { label: 'Sport', href: '#sport' },
    { label: 'Cabinet', href: '#cabinet' },
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
    padding: solid ? '14px clamp(20px,5vw,60px)' : '22px clamp(20px,5vw,60px)',
    background: solid ? 'rgba(248,244,237,0.94)' : 'transparent',
    backdropFilter: solid ? 'blur(16px) saturate(120%)' : 'none',
    WebkitBackdropFilter: solid ? 'blur(16px) saturate(120%)' : 'none',
    borderBottom: solid ? `1px solid rgba(196,99,74,0.18)` : '1px solid transparent',
    transition: 'all .6s cubic-bezier(.16,1,.3,1)',
  };
  const brand: React.CSSProperties = {
    fontFamily: SERIF,
    fontSize: 18,
    letterSpacing: '0.06em',
    color: solid ? C.dark : C.ivory,
    fontWeight: 700,
    display: 'flex',
    flexDirection: 'column',
    lineHeight: 1.1,
  };
  const brandSub: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 9.5,
    letterSpacing: '0.28em',
    textTransform: 'uppercase',
    color: solid ? C.terra : 'rgba(248,244,237,0.75)',
    fontWeight: 400,
    marginTop: 2,
  };
  const linkRow: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'clamp(16px,2.2vw,34px)',
  };

  return (
    <>
      <nav style={bar}>
      <div style={brand}>{fd?.businessName ?? "Ostéopathie Alsace"}<span style={brandSub}>Strasbourg Orangerie</span>
      </div>
      <div style={linkRow} className="r291-navlinks">
        {links.map((l) => (
          <NavLink291 key={l.label} label={l.label} href={l.href} solid={solid} />
        ))}
      </div>
      <div className="r291-navcta">
        <a href="#rdv" style={{ textDecoration: 'none' }}>
          <TerraButton filled>Prendre RDV</TerraButton>
        </a>
      </div>
      
        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="r291-burger"
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
          .r291-navlinks { display: none !important; }
          .r291-burger { display: flex !important; flex-direction: column; }
          .r291-navcta { display: none !important; }
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

function NavLink291({ label, href, solid }: { label: string; href: string; solid: boolean }) {
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
        color: h ? C.terra : solid ? C.darkMid : 'rgba(248,244,237,0.88)',
        textDecoration: 'none',
        transition: 'color .35s',
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
          background: C.terra,
          transition: 'width .5s cubic-bezier(.16,1,.3,1)',
        }}
      />
    </a>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   1 · HeroSection
   Hero épuré fond ivoire clair, photo thérapie, titre & CTA
   ════════════════════════════════════════════════════════════════════════════ */
function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.10]);
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);
  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '-40%']);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.16], [1, 0]);

  const section: React.CSSProperties = {
    position: 'relative',
    height: '100vh',
    minHeight: 620,
    overflow: 'hidden',
    background: C.ivoryDeep,
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
          alt="Séance d'ostéopathie — thérapie manuelle douce"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </motion.div>

      {/* Voile ivoire-doux en bas, sombre centré */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(46,46,46,0.30) 0%, rgba(46,46,46,0.06) 34%, rgba(46,46,46,0.38) 68%, rgba(46,46,46,0.82) 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(110% 70% at 50% 35%, transparent 40%, rgba(46,46,46,0.35) 100%)',
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
          padding: '0 24px',
          y: titleY,
          opacity: titleOpacity,
        }}
      >
        <Reveal y={16}>
          <Eyebrow color="rgba(248,244,237,0.80)" align="center">
            Ostéopathe D.O. · Strasbourg Orangerie
          </Eyebrow>
        </Reveal>

        <motion.h1
          initial={{ opacity: 0, y: 38 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.12 }}
          style={{
            fontFamily: SERIF,
            fontWeight: 700,
            color: C.ivory,
            fontSize: 'clamp(48px, 8.5vw, 120px)',
            lineHeight: 0.97,
            letterSpacing: '-0.01em',
            margin: '26px 0 20px',
            textShadow: '0 10px 50px rgba(0,0,0,0.42)',
          }}
        >
          Retrouver{' '}
          <span style={{ fontStyle: 'italic', fontWeight: 400, color: 'rgba(212,131,110,0.92)' }}>
            l&apos;équilibre
          </span>
          <br />naturel
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.40 }}
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 'clamp(15px, 1.8vw, 21px)',
            color: 'rgba(248,244,237,0.84)',
            maxWidth: 520,
            lineHeight: 1.65,
            margin: '0 0 12px',
          }}
        >
          Ostéopathie &amp; thérapies manuelles — pour nourrissons, enfants,
          adultes et sportifs. Approche globale, techniques douces.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.68 }}
          style={{ marginTop: 36, display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <TerraButton filled>Prendre rendez-vous</TerraButton>
          <TerraButton>Découvrir l&apos;ostéopathie</TerraButton>
        </motion.div>
      </motion.div>

      {/* Indice de défilement */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: 30,
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
            fontSize: 9.5,
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: 'rgba(248,244,237,0.65)',
          }}
        >
          Explorer
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={18} color="rgba(248,244,237,0.65)" strokeWidth={1.4} />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   2 · ScrollCrossfade — 320vh sticky, 3 visuels, ProgressDots
   ════════════════════════════════════════════════════════════════════════════ */
type CrossfadeScene = {
  src: string;
  alt: string;
  index: string;
  title: string;
  sub: string;
};

const SCENES: CrossfadeScene[] = [
  {
    src: PHOTO.therapy,
    alt: 'Manipulation du dos — thérapie manuelle ostéopathique',
    index: 'I',
    title: 'Manipulation ostéopathique',
    sub: 'Libération des tensions vertébrales et articulaires par des techniques précises et non invasives.',
  },
  {
    src: PHOTO.wellness,
    alt: 'Ostéopathie crânio-sacrée — approche douce et profonde',
    index: 'II',
    title: 'Crânio-sacré',
    sub: 'Écoute fine du rythme cranio-sacré pour rétablir la fluidité des membranes et des fascias.',
  },
  {
    src: PHOTO.consultation,
    alt: 'Bilan ostéopathique du sportif — récupération et performance',
    index: 'III',
    title: 'Ostéo du sportif',
    sub: 'Bilan complet, traitement des blessures sportives et optimisation de la mobilité fonctionnelle.',
  },
];

function CrossfadeImage({
  scene,
  i,
  total,
  progress,
}: {
  scene: CrossfadeScene;
  i: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const seg = 1 / total;
  const start = i * seg;
  const end = start + seg;
  const fadeIn = seg * 0.26;

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
        src={scene.src}
        alt={scene.alt}
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
  scene,
  i,
  total,
  progress,
}: {
  scene: CrossfadeScene;
  i: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const seg = 1 / total;
  const start = i * seg;
  const end = start + seg;
  const fade = seg * 0.20;

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
          fontStyle: 'italic',
          fontSize: 'clamp(36px, 8vw, 110px)',
          color: 'rgba(196,99,74,0.28)',
          lineHeight: 1,
          marginBottom: 4,
        }}
      >
        {scene.index}
      </span>
      <h2
        style={{
          fontFamily: SERIF,
          fontSize: 'clamp(36px, 6.5vw, 88px)',
          fontWeight: 700,
          color: C.ivory,
          lineHeight: 1.02,
          margin: 0,
          textShadow: '0 8px 36px rgba(0,0,0,0.50)',
        }}
      >
        {scene.title}
      </h2>
      <p
        style={{
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontSize: 'clamp(14px, 1.7vw, 20px)',
          color: 'rgba(248,244,237,0.84)',
          marginTop: 16,
          maxWidth: 480,
          lineHeight: 1.65,
        }}
      >
        {scene.sub}
      </p>
    </motion.div>
  );
}

function ProgressDot291({
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
  const width = useTransform(progress, [i * seg, (i + 1) * seg], [8, 30]);
  return (
    <motion.div style={{ height: 2, width, background: C.terra, opacity }} />
  );
}

function ScrollCrossfade() {
  const n = SCENES.length;
  const progress = useMotionValue(0.5 / n);
  const [active, setActive] = useState(0);
  const goTo = (i: number) => {
    setActive(i);
    progress.set((i + 0.5) / n);
  };

  return (
    <section
      id="soins"
      style={{ height: '100vh', overflow: 'hidden', position: 'relative', background: C.dark }}
    >
      <div
        style={{
          position: 'relative',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {SCENES.map((s, i) => (
          <CrossfadeImage
            key={s.index}
            scene={s}
            i={i}
            total={SCENES.length}
            progress={progress}
          />
        ))}
        {/* Voile de lisibilité */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to bottom, rgba(46,46,46,0.28), rgba(46,46,46,0.08) 42%, rgba(46,46,46,0.58))',
          }}
        />
        {SCENES.map((s, i) => (
          <CrossfadeCaption
            key={s.index}
            scene={s}
            i={i}
            total={SCENES.length}
            progress={progress}
          />
        ))}
        {/* ProgressDots */}
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
          {SCENES.map((s, i) => (
            <ProgressDot291
              key={s.index}
              i={i}
              total={SCENES.length}
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
   3 · MotifSection — 3 indications principales
   Musculo-squelettique / Viscéral / Stress & sommeil
   ════════════════════════════════════════════════════════════════════════════ */
type Motif = {
  icon: React.ReactNode;
  title: string;
  body: string;
  tag: string;
};

const MOTIFS: Motif[] = [
  {
    icon: <Activity size={30} color={C.terra} strokeWidth={1.5} />,
    title: 'Douleurs musculo-squelettiques',
    body: 'Lombalgies, cervicalgies, sciatiques, tendinites, hernies discales, douleurs articulaires et tensions chroniques. L\'ostéopathie agit sur les causes structurelles en restaurant la mobilité des tissus.',
    tag: 'Colonne · Articulations · Muscles',
  },
  {
    icon: <Heart size={30} color={C.terra} strokeWidth={1.5} />,
    title: 'Troubles digestifs & viscéraux',
    body: 'Reflux gastro-œsophagien, côlon irritable, troubles du transit, ballonnements chroniques, douleurs pelviennes. L\'approche viscérale libère les tensions du système digestif pour retrouver confort et équilibre.',
    tag: 'Digestif · Viscères · Pelvis',
  },
  {
    icon: <Moon size={30} color={C.terra} strokeWidth={1.5} />,
    title: 'Stress & troubles du sommeil',
    body: 'Fatigue chronique, céphalées, migraines, insomnies, anxiété, bruxisme. Le système nerveux autonome régule le stress — les techniques crânio-sacrées rétablissent l\'équilibre et favorisent la récupération profonde.',
    tag: 'Crânien · Nerveux · Sommeil',
  },
];

function MotifCard({ m, i }: { m: Motif; i: number }) {
  const [hover, setHover] = useState(false);
  const card: React.CSSProperties = {
    background: hover ? C.ivory : C.white,
    border: `1.5px solid ${hover ? C.terra : C.ivoryDeep}`,
    padding: 'clamp(30px,4vw,48px)',
    transition: 'all .55s cubic-bezier(.16,1,.3,1)',
    transform: hover ? 'translateY(-8px)' : 'none',
    boxShadow: hover
      ? '0 30px 70px -32px rgba(196,99,74,0.28)'
      : '0 8px 32px -20px rgba(46,46,46,0.12)',
    cursor: 'default',
    display: 'flex',
    flexDirection: 'column',
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
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: hover ? 'rgba(196,99,74,0.12)' : 'rgba(196,99,74,0.07)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 24,
            transition: 'background .55s',
          }}
        >
          {m.icon}
        </div>
        <h3
          style={{
            fontFamily: SERIF,
            fontSize: 'clamp(20px,2.2vw,26px)',
            fontWeight: 700,
            color: C.dark,
            margin: '0 0 14px',
            lineHeight: 1.22,
          }}
        >
          {m.title}
        </h3>
        <p
          style={{
            fontFamily: SANS,
            fontSize: 'clamp(14px,1.4vw,15.5px)',
            lineHeight: 1.76,
            color: C.darkMid,
            margin: '0 0 20px',
            flex: 1,
          }}
        >
          {m.body}
        </p>
        <div
          style={{
            fontFamily: SANS,
            fontSize: 10,
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color: C.terra,
            fontWeight: 500,
          }}
        >
          {m.tag}
        </div>
      </article>
    </Reveal>
  );
}

function MotifSection() {
  const sec: React.CSSProperties = {
    background: C.ivory,
    padding: 'clamp(88px, 12vw, 180px) clamp(24px, 6vw, 96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 'clamp(22px, 3vw, 38px)',
    maxWidth: 1240,
    margin: '0 auto',
  };
  return (
    <section style={sec}>
      <div style={{ maxWidth: 1240, margin: '0 auto 56px' }}>
        <Reveal>
          <Eyebrow align="center">Indications principales</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(34px, 5.5vw, 70px)',
              fontWeight: 700,
              color: C.dark,
              margin: '18px 0 0',
              lineHeight: 1.05,
              textAlign: 'center',
            }}
          >
            Ce que l&apos;ostéopathie{' '}
            <span style={{ fontStyle: 'italic', fontWeight: 400, color: C.terra }}>
              traite
            </span>
          </h2>
        </Reveal>
        <Reveal delay={0.14}>
          <p
            style={{
              fontFamily: SANS,
              fontSize: 'clamp(14px,1.5vw,17px)',
              lineHeight: 1.75,
              color: C.darkMid,
              maxWidth: 640,
              margin: '20px auto 0',
              textAlign: 'center',
            }}
          >
            L&apos;ostéopathe traite le corps dans sa globalité : os, muscles,
            fascias, viscères et système nerveux sont interdépendants. Une
            consultation permet d&apos;identifier et de corriger les dysfonctions
            à leur source.
          </p>
        </Reveal>
      </div>
      <div style={grid}>
        {MOTIFS.map((m, i) => (
          <MotifCard key={m.title} m={m} i={i} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   4 · TechniqueSection — Left sticky photo + right scroll 4 approches
   ════════════════════════════════════════════════════════════════════════════ */
type Technique = {
  num: string;
  title: string;
  body: string;
};

const TECHNIQUES: Technique[] = [
  {
    num: '01',
    title: 'Ostéopathie structurelle',
    body: 'Techniques de mobilisation et de manipulation des vertèbres et des articulations. Chaque geste est précis, calibré, adapté à la morphologie et à la tolérance du patient. L\'objectif : lever les blocages mécaniques qui perturbent la posture et génèrent douleur ou compensation.',
  },
  {
    num: '02',
    title: 'Technique myofasciale',
    body: 'Les fascias sont les enveloppes de tissu conjonctif qui entourent chaque structure du corps. En cas de tension ou de cicatrice, ils restreignent la mobilité des organes et des muscles. Le travail myofascial relâche ces zones pour restaurer un glissement optimal entre les tissus.',
  },
  {
    num: '03',
    title: 'Approche viscérale',
    body: 'Les organes abdominaux, thoraciques et pelviens ont leurs propres mobilités. Leurs restrictions altèrent la mécanique globale du corps. L\'ostéopathie viscérale sollicite doucement les ligaments et les méso qui suspendent les organes, restaurant leur dynamique naturelle.',
  },
  {
    num: '04',
    title: 'Ostéopathie crânienne',
    body: 'Le crâne et le sacrum sont reliés par les membranes méningées. Une écoute très fine du rythme cranio-sacré (6 à 12 cycles/minute) permet de détecter et de corriger des tensions profondes. Indiquée pour les céphalées, le stress, le bruxisme, les troubles ORL et la pédiatrie.',
  },
];

function TechniqueSection() {
  const sec: React.CSSProperties = {
    background: C.dark,
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
  const stickyLeft: React.CSSProperties = {
    position: 'sticky',
    top: 100,
    alignSelf: 'start',
  };

  return (
    <section style={sec} id="techniques">
      <div style={grid} className="r291-tech">
        {/* Colonne gauche : photo praticien collante */}
        <div style={stickyLeft} className="r291-tech-sticky">
          <div
            style={{
              overflow: 'hidden',
              aspectRatio: '3 / 4',
              border: `1px solid rgba(196,99,74,0.30)`,
            }}
          >
            <img
              src={PHOTO.consultation}
              alt="Praticien ostéopathe — consultation au cabinet Orangerie Strasbourg"
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
          <div style={{ marginTop: 22 }}>
            <Eyebrow color={C.terra}>4 approches thérapeutiques</Eyebrow>
            <p
              style={{
                fontFamily: SERIF,
                fontStyle: 'italic',
                fontSize: 16,
                color: 'rgba(248,244,237,0.72)',
                lineHeight: 1.7,
                marginTop: 14,
              }}
            >
              Chaque séance combine les techniques selon les besoins spécifiques
              du patient. L&apos;ostéopathie ne traite pas une symptôme mais la
              personne dans sa globalité.
            </p>
          </div>
        </div>

        {/* Colonne droite : techniques qui défilent */}
        <div>
          <Reveal>
            <Eyebrow color={C.terra}>Méthodes &amp; Techniques</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(32px,5vw,64px)',
                fontWeight: 700,
                color: C.ivory,
                margin: '18px 0 52px',
                lineHeight: 1.06,
              }}
            >
              L&apos;arsenal{' '}
              <span style={{ fontStyle: 'italic', fontWeight: 400, color: C.terra }}>
                thérapeutique
              </span>
            </h2>
          </Reveal>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {TECHNIQUES.map((t, i) => (
              <Reveal key={t.num} delay={i * 0.06}>
                <div
                  style={{
                    padding: '34px 0',
                    borderTop: `1px solid rgba(196,99,74,0.22)`,
                    display: 'flex',
                    gap: 26,
                  }}
                >
                  <span
                    style={{
                      fontFamily: SERIF,
                      fontStyle: 'italic',
                      fontSize: 20,
                      color: 'rgba(196,99,74,0.55)',
                      minWidth: 36,
                      lineHeight: 1.6,
                    }}
                  >
                    {t.num}
                  </span>
                  <div>
                    <h3
                      style={{
                        fontFamily: SERIF,
                        fontSize: 'clamp(20px,2.2vw,26px)',
                        fontWeight: 700,
                        color: C.ivory,
                        margin: '0 0 12px',
                      }}
                    >
                      {t.title}
                    </h3>
                    <p
                      style={{
                        fontFamily: SANS,
                        fontSize: 15,
                        lineHeight: 1.78,
                        color: 'rgba(248,244,237,0.66)',
                        margin: 0,
                      }}
                    >
                      {t.body}
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
          .r291-tech { grid-template-columns: 1fr !important; }
          .r291-tech-sticky { position: static !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   5 · TestimonialsSection — 3 témoignages avec étoiles
   ════════════════════════════════════════════════════════════════════════════ */
type Testi = {
  quote: string;
  name: string;
  role: string;
  suivi: string;
};

const TESTIMONIALS: Testi[] = [
  {
    quote:
      'Souffrant de lombalgies chroniques depuis trois ans, j\'avais perdu espoir après plusieurs kinés. Dès la deuxième séance, la douleur a régressé de moitié. Après quatre consultations, je peux de nouveau courir. Approche sérieuse, écoute parfaite.',
    name: 'Mathieu L.',
    role: 'Lombalgie chronique',
    suivi: 'Suivi sur 6 semaines',
  },
  {
    quote:
      'Notre bébé de 5 semaines souffrait de coliques et refusait de tourner la tête d\'un côté. L\'ostéopathe a été d\'une douceur impressionnante. Deux séances ont suffi. Le soulagement a été immédiat — pour lui et pour nous.',
    name: 'Sophie &amp; Arthur B.',
    role: 'Coliques nourrisson — 5 semaines',
    suivi: 'Suivi sur 2 séances',
  },
  {
    quote:
      'Je venais pour des céphalées de tension et un stress professionnel intense. Au-delà du soulagement physique, j\'ai retrouvé un sommeil réparateur. Je n\'aurais jamais cru qu\'une manipulation du crâne puisse avoir autant d\'effet sur le mental.',
    name: 'Isabelle M.',
    role: 'Stress chronique &amp; céphalées',
    suivi: 'Suivi mensuel depuis 4 mois',
  },
];

function TestimonialsSection() {
  const sec: React.CSSProperties = {
    background: C.ivory,
    padding: 'clamp(88px,12vw,170px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: 'clamp(24px,3vw,40px)',
    maxWidth: 1240,
    margin: '0 auto',
  };
  return (
    <section style={sec}>
      <div style={{ maxWidth: 1240, margin: '0 auto 56px', textAlign: 'center' }}>
        <Reveal>
          <Eyebrow color={C.terra} align="center">Témoignages patients</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(32px,5vw,66px)',
              fontWeight: 700,
              color: C.dark,
              margin: '18px 0 0',
              lineHeight: 1.05,
            }}
          >
            Ils ont retrouvé{' '}
            <span style={{ fontStyle: 'italic', fontWeight: 400, color: C.terra }}>
              l&apos;équilibre
            </span>
          </h2>
        </Reveal>
      </div>
      <div style={grid}>
        {TESTIMONIALS.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.10} style={{ height: '100%' }}>
            <figure
              style={{
                background: C.white,
                border: `1px solid ${C.ivoryDeep}`,
                padding: 'clamp(28px,4vw,44px)',
                margin: 0,
                height: '100%',
                boxSizing: 'border-box',
                boxShadow: '0 16px 48px -32px rgba(46,46,46,0.16)',
                display: 'flex',
                flexDirection: 'column',
                borderTop: `3px solid ${C.terra}`,
              }}
            >
              <Quote size={28} color={C.terra} strokeWidth={1.3} />
              <div style={{ display: 'flex', gap: 3, margin: '14px 0 16px' }}>
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} size={13} fill={C.terra} color={C.terra} strokeWidth={0} />
                ))}
              </div>
              <blockquote
                style={{
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  fontSize: 'clamp(15px,1.7vw,18px)',
                  lineHeight: 1.66,
                  color: C.darkMid,
                  margin: '0 0 22px',
                  flex: 1,
                }}
                dangerouslySetInnerHTML={{ __html: `"${t.quote}"` }}
              />
              <figcaption style={{ borderTop: `1px solid ${C.ivoryDeep}`, paddingTop: 18 }}>
                <div
                  style={{ fontFamily: SERIF, fontSize: 17, fontWeight: 700, color: C.dark }}
                  dangerouslySetInnerHTML={{ __html: t.name }}
                />
                <div
                  style={{
                    fontFamily: SANS,
                    fontSize: 11,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: C.terra,
                    marginTop: 4,
                    fontWeight: 500,
                  }}
                  dangerouslySetInnerHTML={{ __html: t.role }}
                />
                <div
                  style={{
                    fontFamily: SANS,
                    fontSize: 10.5,
                    color: C.darkLight,
                    marginTop: 4,
                  }}
                >
                  {t.suivi}
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
   6 · AppointmentFormSection
   Prénom, Nom, Âge (select), Motif (select), Téléphone + état envoyé
   ════════════════════════════════════════════════════════════════════════════ */
function AppointmentFormSection() {
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [age, setAge] = useState('');
  const [motif, setMotif] = useState('');
  const [telephone, setTelephone] = useState('');
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prenom || !nom || !age || !motif || !telephone) return;
    setSent(true);
  };

  const sec: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    background: C.slate,
    padding: 'clamp(96px,13vw,180px) clamp(24px,6vw,96px)',
  };
  const fieldBase: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    background: 'rgba(248,244,237,0.08)',
    border: '1.5px solid rgba(248,244,237,0.28)',
    borderRadius: 3,
    padding: '14px 16px',
    fontFamily: SANS,
    fontSize: 15,
    color: C.ivory,
    outline: 'none',
    transition: 'border-color .3s, background .3s',
  };
  const labelStyle: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 10,
    letterSpacing: '0.28em',
    textTransform: 'uppercase',
    color: 'rgba(248,244,237,0.70)',
    display: 'block',
    marginBottom: 6,
    fontWeight: 500,
  };

  return (
    <section style={sec} id="rdv">
      {/* Photo de fond légère */}
      <img
        src={PHOTO.wellness}
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
          mixBlendMode: 'luminosity',
        }}
      />
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: 700,
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <Reveal>
          <Eyebrow color="rgba(248,244,237,0.75)" align="center">
            Prise de rendez-vous
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(34px,6vw,76px)',
              fontWeight: 700,
              color: C.ivory,
              margin: '18px 0 16px',
              lineHeight: 1.04,
            }}
          >
            Réservez votre{' '}
            <span style={{ fontStyle: 'italic', fontWeight: 400, color: 'rgba(212,131,110,0.9)' }}>
              séance
            </span>
          </h2>
        </Reveal>
        <Reveal delay={0.14}>
          <p
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: 'clamp(14px,1.6vw,18px)',
              lineHeight: 1.72,
              color: 'rgba(248,244,237,0.76)',
              maxWidth: 500,
              margin: '0 auto 44px',
            }}
          >
            Consultation de 45 à 60 minutes — 65€. Réponse confirmée sous
            24h par SMS ou appel. Premier rendez-vous : prévoir l&apos;historique
            médical récent si disponible.
          </p>
        </Reveal>

        {sent ? (
          <Reveal>
            <div
              style={{
                border: `1.5px solid rgba(196,99,74,0.60)`,
                borderRadius: 4,
                padding: 'clamp(32px,5vw,52px)',
                background: 'rgba(196,99,74,0.10)',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: 'rgba(196,99,74,0.18)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                }}
              >
                <Heart size={28} color={C.terraLight} strokeWidth={1.5} />
              </div>
              <h3
                style={{
                  fontFamily: SERIF,
                  fontSize: 28,
                  fontWeight: 700,
                  color: C.ivory,
                  margin: '0 0 12px',
                }}
              >
                Merci, {prenom}&nbsp;!
              </h3>
              <p
                style={{
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  fontSize: 16.5,
                  color: 'rgba(248,244,237,0.78)',
                  margin: 0,
                  lineHeight: 1.7,
                }}
              >
                Votre demande de rendez-vous pour{' '}
                <strong style={{ color: C.terraLight, fontStyle: 'normal' }}>
                  {motif.toLowerCase()}
                </strong>{' '}
                a bien été reçue. Vous serez contacté(e) au{' '}
                <strong style={{ color: C.terraLight, fontStyle: 'normal' }}>
                  {telephone}
                </strong>{' '}
                dans les 24h.
              </p>
            </div>
          </Reveal>
        ) : (
          <Reveal delay={0.20}>
            <form onSubmit={onSubmit} style={{ textAlign: 'left' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '20px 24px',
                }}
                className="r291-formgrid"
              >
                <div>
                  <label style={labelStyle} htmlFor="f291-prenom">Prénom</label>
                  <input
                    id="f291-prenom"
                    style={fieldBase}
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    placeholder="Marie"
                    autoComplete="given-name"
                    required
                  />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="f291-nom">Nom</label>
                  <input
                    id="f291-nom"
                    style={fieldBase}
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    placeholder="Dupont"
                    autoComplete="family-name"
                    required
                  />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="f291-age">Tranche d&apos;âge</label>
                  <select
                    id="f291-age"
                    style={{
                      ...fieldBase,
                      appearance: 'none',
                      WebkitAppearance: 'none',
                      cursor: 'pointer',
                      color: age ? C.ivory : 'rgba(248,244,237,0.42)',
                    }}
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    required
                  >
                    <option value="" style={{color: brand ?? '#2e2e2e' }}>Sélectionner…</option>
                    <option value="Nourrisson (0-12 mois)" style={{color: brand ?? '#2e2e2e' }}>Nourrisson (0–12 mois)</option>
                    <option value="Enfant (1-12 ans)" style={{color: brand ?? '#2e2e2e' }}>Enfant (1–12 ans)</option>
                    <option value="Adulte (13-64 ans)" style={{color: brand ?? '#2e2e2e' }}>Adulte (13–64 ans)</option>
                    <option value="Senior (65 ans et +)" style={{color: brand ?? '#2e2e2e' }}>Senior (65 ans et +)</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle} htmlFor="f291-motif">Motif de consultation</label>
                  <select
                    id="f291-motif"
                    style={{
                      ...fieldBase,
                      appearance: 'none',
                      WebkitAppearance: 'none',
                      cursor: 'pointer',
                      color: motif ? C.ivory : 'rgba(248,244,237,0.42)',
                    }}
                    value={motif}
                    onChange={(e) => setMotif(e.target.value)}
                    required
                  >
                    <option value="" style={{color: brand ?? '#2e2e2e' }}>Sélectionner…</option>
                    <option value="Douleur dos / colonne" style={{color: brand ?? '#2e2e2e' }}>Douleur dos / colonne</option>
                    <option value="Douleur cou / cervicales" style={{color: brand ?? '#2e2e2e' }}>Douleur cou / cervicales</option>
                    <option value="Troubles digestifs" style={{color: brand ?? '#2e2e2e' }}>Troubles digestifs</option>
                    <option value="Stress / sommeil / céphalées" style={{color: brand ?? '#2e2e2e' }}>Stress / sommeil / céphalées</option>
                    <option value="Blessure sportive" style={{color: brand ?? '#2e2e2e' }}>Blessure sportive</option>
                    <option value="Autre motif" style={{color: brand ?? '#2e2e2e' }}>Autre motif</option>
                  </select>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle} htmlFor="f291-tel">Téléphone</label>
                  <input
                    id="f291-tel"
                    type="tel"
                    style={fieldBase}
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                    placeholder="06 12 34 56 78"
                    autoComplete="tel"
                    required
                  />
                </div>
              </div>
              <div style={{ marginTop: 30, textAlign: 'center' }}>
                <TerraButton filled type="submit">
                  Envoyer ma demande
                </TerraButton>
              </div>
            </form>
          </Reveal>
        )}
      </div>
      <style>{`
        @media (max-width: 860px) {
          .r291-formgrid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   7 · PediatricSection — Focus nourrissons & enfants
   Torticolis, plagiocéphalie, coliques, troubles ORL
   ════════════════════════════════════════════════════════════════════════════ */
type PedItem = { title: string; body: string; age: string };

const PED_ITEMS: PedItem[] = [
  {
    title: 'Torticolis congénital',
    body: 'Raideur cervicale présente dès la naissance, souvent liée à la position in utero ou à l\'accouchement. Les techniques crânio-sacrées et myofasciales libèrent la tension musculaire et articulaire, permettant à bébé de tourner la tête librement.',
    age: 'Nourrisson — 0-6 mois',
  },
  {
    title: 'Plagiocéphalie positionnelle',
    body: 'Aplatissement asymétrique du crâne du nourrisson, souvent secondaire à un torticolis ou à une préférence de position. L\'ostéopathie crânienne accompagne la déformation précoce en complément des recommandations posturales, avant que les sutures crâniennes ne se ferment.',
    age: 'Nourrisson — 0-6 mois idéalement',
  },
  {
    title: 'Coliques et reflux',
    body: 'Les coliques du nourrisson (pleurs en soirée, ventre dur, difficultés à se nourrir) peuvent être aggravées par des tensions digestives ou diaphragmatiques. Le travail ostéopathique viscéral doux réduit ces tensions et améliore le transit et le confort digestif.',
    age: 'Nourrisson — 3 semaines à 4 mois',
  },
  {
    title: 'Troubles ORL récidivants',
    body: 'Otites à répétition, rhinites chroniques, sinusites de l\'enfant. Des dysfonctions du crâne ou du rachis cervical peuvent perturber le drainage des sinus et de l\'oreille moyenne. L\'ostéopathie facilite ce drainage en restaurant les mobilités osseuses et fasciales impliquées.',
    age: 'Enfant — 1-12 ans',
  },
];

function PediatricSection() {
  const sec: React.CSSProperties = {
    background: C.ivory,
    padding: 'clamp(88px,12vw,170px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 'clamp(40px,6vw,96px)',
    maxWidth: 1240,
    margin: '0 auto',
    alignItems: 'center',
  };

  return (
    <section style={sec} id="pediatrie">
      <div style={grid} className="r291-ped">
        {/* Gauche : photo + badge sécurité */}
        <Reveal y={50} style={{ overflow: 'hidden', aspectRatio: '4 / 5' }}>
          <ParallaxImg
            src={PHOTO.cabinet}
            alt="Cabinet ostéopathie Strasbourg — consultation pédiatrique douce"
          />
        </Reveal>

        {/* Droite : liste des indications */}
        <div>
          <Reveal>
            <Eyebrow>Pédiatrie · Nourrissons &amp; Enfants</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(28px,4.5vw,58px)',
                fontWeight: 700,
                color: C.dark,
                margin: '18px 0 14px',
                lineHeight: 1.08,
              }}
            >
              Une approche{' '}
              <span style={{ fontStyle: 'italic', fontWeight: 400, color: C.terra }}>
                douce
              </span>{' '}
              dès la naissance
            </h2>
          </Reveal>
          <Reveal delay={0.14}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                background: 'rgba(196,99,74,0.10)',
                border: `1px solid rgba(196,99,74,0.28)`,
                borderRadius: 2,
                padding: '8px 16px',
                marginBottom: 28,
              }}
            >
              <Heart size={14} color={C.terra} strokeWidth={1.8} />
              <span
                style={{
                  fontFamily: SANS,
                  fontSize: 10.5,
                  letterSpacing: '0.20em',
                  textTransform: 'uppercase',
                  color: C.terra,
                  fontWeight: 500,
                }}
              >
                Techniques exclusivement douces — aucune manipulation forcée
              </span>
            </div>
          </Reveal>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {PED_ITEMS.map((it, i) => (
              <Reveal key={it.title} delay={i * 0.06}>
                <div
                  style={{
                    padding: '22px 0',
                    borderTop: `1px solid ${C.ivoryDeep}`,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                      marginBottom: 8,
                      gap: 12,
                      flexWrap: 'wrap',
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: SERIF,
                        fontSize: 'clamp(16px,1.8vw,20px)',
                        fontWeight: 700,
                        color: C.dark,
                        margin: 0,
                      }}
                    >
                      {it.title}
                    </h3>
                    <span
                      style={{
                        fontFamily: SANS,
                        fontSize: 9.5,
                        letterSpacing: '0.18em',
                        textTransform: 'uppercase',
                        color: C.slate,
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                      }}
                    >
                      {it.age}
                    </span>
                  </div>
                  <p
                    style={{
                      fontFamily: SANS,
                      fontSize: 14,
                      lineHeight: 1.76,
                      color: C.darkMid,
                      margin: 0,
                    }}
                  >
                    {it.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 860px) {
          .r291-ped { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   8 · SportSection — Ostéo du sportif
   Plein cadre, blessures, performance, récupération, sports traités
   ════════════════════════════════════════════════════════════════════════════ */
type SportBenefit = { title: string; body: string };

const SPORT_BENEFITS: SportBenefit[] = [
  {
    title: 'Blessures sportives',
    body: 'Entorses, tendinites, contractures, périostites, pubalgie — l\'ostéopathie lève les blocages mécaniques qui freinent la guérison et prévient les récidives en traitant les compensations posturales.',
  },
  {
    title: 'Optimisation des performances',
    body: 'Un corps bien aligné est un corps efficace. Libérer les restrictions articulaires et fasciales améliore l\'amplitude de mouvement, l\'économie gestuelle et la coordination. Utilisé par de nombreux athlètes de haut niveau.',
  },
  {
    title: 'Récupération accélérée',
    body: 'Après une compétition intense ou une préparation physique, l\'ostéopathie facilite l\'évacuation des tensions accumulées et restaure la circulation lymphatique et veineuse pour une récupération plus rapide.',
  },
];

const SPORTS_TRAITES = [
  'Running', 'Cyclisme', 'Natation', 'Football', 'Tennis', 'Arts martiaux',
  'Crossfit', 'Trail', 'Escalade', 'Yoga & pilates',
];

function SportSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);

  const sec: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    background: C.dark,
    padding: 'clamp(88px,12vw,170px) clamp(24px,6vw,96px)',
  };

  return (
    <section ref={ref} style={sec} id="sport">
      {/* Photo de fond */}
      <motion.div
        style={{ position: 'absolute', inset: '-8% 0', height: '116%', y: bgY }}
      >
        <img
          src={PHOTO.therapy}
          alt="Bilan ostéopathique sportif — Strasbourg"
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.18 }}
        />
      </motion.div>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(46,46,46,0.82)',
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: 1240,
          margin: '0 auto',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'clamp(40px,7vw,100px)',
            alignItems: 'start',
          }}
          className="r291-sport"
        >
          {/* En-tête */}
          <div>
            <Reveal>
              <Eyebrow color={C.terra}>Ostéopathie du sportif</Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              <h2
                style={{
                  fontFamily: SERIF,
                  fontSize: 'clamp(30px,5vw,62px)',
                  fontWeight: 700,
                  color: C.ivory,
                  margin: '18px 0 22px',
                  lineHeight: 1.06,
                }}
              >
                Performer{' '}
                <span style={{ fontStyle: 'italic', fontWeight: 400, color: C.terra }}>
                  sans douleur
                </span>
              </h2>
            </Reveal>
            <Reveal delay={0.14}>
              <p
                style={{
                  fontFamily: SANS,
                  fontSize: 15.5,
                  lineHeight: 1.78,
                  color: 'rgba(248,244,237,0.68)',
                  maxWidth: 480,
                  marginBottom: 36,
                }}
              >
                Que vous prépariez un marathon, une compétition ou souhaitiez
                simplement pratiquer votre sport sans douleur, l&apos;ostéopathie
                accompagne chaque étape — prévention, traitement, récupération.
              </p>
            </Reveal>
            <Reveal delay={0.20}>
              <div style={{ marginBottom: 40 }}>
                <div
                  style={{
                    fontFamily: SANS,
                    fontSize: 10,
                    letterSpacing: '0.30em',
                    textTransform: 'uppercase',
                    color: C.terra,
                    marginBottom: 14,
                    fontWeight: 500,
                  }}
                >
                  Sports traités
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 10px' }}>
                  {SPORTS_TRAITES.map((s) => (
                    <span
                      key={s}
                      style={{
                        fontFamily: SANS,
                        fontSize: 11.5,
                        padding: '5px 13px',
                        border: '1px solid rgba(196,99,74,0.38)',
                        color: 'rgba(248,244,237,0.80)',
                        borderRadius: 2,
                        letterSpacing: '0.06em',
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.26}>
              <a href="#rdv" style={{ textDecoration: 'none' }}>
                <TerraButton filled>Bilan sportif — prendre RDV</TerraButton>
              </a>
            </Reveal>
          </div>

          {/* Bénéfices */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {SPORT_BENEFITS.map((b, i) => (
              <Reveal key={b.title} delay={0.06 + i * 0.08}>
                <div
                  style={{
                    padding: '28px 0',
                    borderTop: `1px solid rgba(196,99,74,0.22)`,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      marginBottom: 12,
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        background: 'rgba(196,99,74,0.18)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Activity size={17} color={C.terra} strokeWidth={1.8} />
                    </div>
                    <h3
                      style={{
                        fontFamily: SERIF,
                        fontSize: 'clamp(17px,2vw,22px)',
                        fontWeight: 700,
                        color: C.ivory,
                        margin: 0,
                      }}
                    >
                      {b.title}
                    </h3>
                  </div>
                  <p
                    style={{
                      fontFamily: SANS,
                      fontSize: 14.5,
                      lineHeight: 1.76,
                      color: 'rgba(248,244,237,0.64)',
                      margin: 0,
                    }}
                  >
                    {b.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 860px) {
          .r291-sport { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   9 · PracticalSection — Cabinet Orangerie : infos pratiques complètes
   Adresse, Tram C, stationnement, horaires, 65€, mutuelles
   ════════════════════════════════════════════════════════════════════════════ */
type InfoBlock = {
  label: string;
  lines: string[];
};

const INFO_BLOCKS: InfoBlock[] = [
  {
    label: 'Adresse',
    lines: [
      '14 allée de la Robertsau',
      '67000 Strasbourg',
      'Quartier Orangerie',
    ],
  },
  {
    label: 'Accès & Transports',
    lines: [
      'Tram C — arrêt Observatoire (3 min à pied)',
      'Bus 30 — arrêt Palais de l\'Europe',
      'Parking Orangerie : 5 min',
      'Véloparc devant le cabinet',
    ],
  },
  {
    label: 'Horaires',
    lines: [
      'Lundi — Vendredi : 8h — 20h',
      'Samedi : 9h — 13h',
      'Dimanche : fermé',
      'Urgences : sur appel',
    ],
  },
  {
    label: 'Tarifs & Remboursements',
    lines: [
      'Consultation adulte : 65€',
      'Nourrisson & pédiatrie : 55€',
      'Suivi sportif : 65€',
      'Mutuelles : AXA, MGEN, MMA, AG2R…',
    ],
  },
];

function PracticalSection() {
  const sec: React.CSSProperties = {
    background: C.ivory,
    padding: 'clamp(88px,12vw,170px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 'clamp(40px,6vw,90px)',
    maxWidth: 1240,
    margin: '0 auto',
    alignItems: 'start',
  };

  return (
    <section style={sec} id="cabinet">
      <div style={{ maxWidth: 1240, margin: '0 auto 56px' }}>
        <Reveal>
          <Eyebrow>Cabinet Orangerie · Informations pratiques</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(30px,5vw,64px)',
              fontWeight: 700,
              color: C.dark,
              margin: '18px 0 0',
              lineHeight: 1.06,
            }}
          >
            Votre cabinet{' '}
            <span style={{ fontStyle: 'italic', fontWeight: 400, color: C.terra }}>
              au cœur de l&apos;Orangerie
            </span>
          </h2>
        </Reveal>
      </div>

      <div style={grid} className="r291-pract">
        {/* Colonne gauche : photo cabinet + mini-carte */}
        <div>
          <Reveal y={50} style={{ overflow: 'hidden', aspectRatio: '4 / 3', marginBottom: 28 }}>
            <ParallaxImg
              src={PHOTO.cabinet}
              alt="Cabinet ostéopathie Strasbourg Orangerie — salle de consultation"
            />
          </Reveal>
          <Reveal delay={0.10}>
            <div
              style={{
                background: C.dark,
                padding: 'clamp(24px,3.5vw,36px)',
                display: 'flex',
                gap: 16,
                alignItems: 'flex-start',
              }}
            >
              <div
                style={{
                  background: C.terra,
                  padding: 10,
                  borderRadius: 2,
                  flexShrink: 0,
                }}
              >
                <MapPin size={20} color={C.ivory} strokeWidth={1.5} />
              </div>
              <div>
                <div
                  style={{
                    fontFamily: SANS,
                    fontSize: 10,
                    letterSpacing: '0.26em',
                    textTransform: 'uppercase',
                    color: C.terra,
                    marginBottom: 6,
                    fontWeight: 500,
                  }}
                >
                  Accès rapide
                </div>
                <p
                  style={{
                    fontFamily: SERIF,
                    fontSize: 15,
                    color: 'rgba(248,244,237,0.82)',
                    margin: 0,
                    lineHeight: 1.65,
                    fontStyle: 'italic',
                  }}
                >
                  À 8 min à pied du Parlement Européen. Parking gratuit Orangerie.
                  Cabinet accessible PMR, ascenseur disponible.
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Colonne droite : blocs info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {INFO_BLOCKS.map((b, i) => (
            <Reveal key={b.label} delay={i * 0.07}>
              <div
                style={{
                  padding: '26px 0',
                  borderTop: `1px solid ${C.ivoryDeep}`,
                }}
              >
                <div
                  style={{
                    fontFamily: SANS,
                    fontSize: 10,
                    letterSpacing: '0.28em',
                    textTransform: 'uppercase',
                    color: C.terra,
                    marginBottom: 12,
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  {b.label === 'Horaires' ? (
                    <Clock size={12} color={C.terra} strokeWidth={2} />
                  ) : b.label === 'Adresse' ? (
                    <MapPin size={12} color={C.terra} strokeWidth={2} />
                  ) : b.label === 'Tarifs & Remboursements' ? (
                    <Heart size={12} color={C.terra} strokeWidth={2} />
                  ) : (
                    <Activity size={12} color={C.terra} strokeWidth={2} />
                  )}
                  {b.label}
                </div>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {b.lines.map((line) => (
                    <li
                      key={line}
                      style={{
                        fontFamily: SANS,
                        fontSize: 14.5,
                        color: C.darkMid,
                        lineHeight: 1.6,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      <span
                        style={{
                          width: 4,
                          height: 4,
                          borderRadius: '50%',
                          background: C.terra,
                          flexShrink: 0,
                          opacity: 0.6,
                        }}
                      />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}

          <Reveal delay={0.32}>
            <div style={{ paddingTop: 30 }}>
              <a href={`tel:${fd?.phone ?? "+33388000000"}`} style={{ textDecoration: 'none' }}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 12,
                    background: C.terra,
                    color: C.ivory,
                    padding: '14px 24px',
                    borderRadius: 2,
                    fontFamily: SANS,
                    fontSize: 14,
                    fontWeight: 500,
                    letterSpacing: '0.04em',
                    transition: 'background .4s',
                  }}
                >
                  <Phone size={16} strokeWidth={1.8} />
                  03 88 00 00 00
                </div>
              </a>
            </div>
          </Reveal>
        </div>
      </div>
      <style>{`
        @media (max-width: 860px) {
          .r291-pract { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   10 · FooterSection
   Logo Ostéopathie Alsace, registre ADELI, mentions, lien RDV
   ════════════════════════════════════════════════════════════════════════════ */
function FooterSection() {
  const cols: { title: string; items: { label: string; href: string }[] }[] = [
    {
      title: 'Soins',
      items: [
        { label: 'Ostéopathie structurelle', href: '#techniques' },
        { label: 'Crânio-sacré', href: '#techniques' },
        { label: 'Approche viscérale', href: '#techniques' },
        { label: 'Ostéo du sportif', href: '#sport' },
      ],
    },
    {
      title: 'Patients',
      items: [
        { label: 'Nourrissons & Enfants', href: '#pediatrie' },
        { label: 'Adultes', href: '#soins' },
        { label: 'Sportifs', href: '#sport' },
        { label: 'Seniors', href: '#soins' },
      ],
    },
    {
      title: 'Cabinet',
      items: [
        { label: 'Informations pratiques', href: '#cabinet' },
        { label: 'Tarifs & Mutuelles', href: '#cabinet' },
        { label: 'Accès & Transports', href: '#cabinet' },
        { label: 'Prendre rendez-vous', href: '#rdv' },
      ],
    },
  ];

  const foot: React.CSSProperties = {
    background: C.dark,
    borderTop: `1px solid rgba(196,99,74,0.20)`,
    padding: 'clamp(64px,9vw,100px) clamp(24px,6vw,96px) 36px',
  };

  return (
    <footer style={foot}>
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.6fr repeat(3, 1fr)',
          gap: 'clamp(32px,5vw,64px)',
        }}
        className="r291-footgrid"
      >
        {/* Colonne marque */}
        <div>
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 22,
              fontWeight: 700,
              color: C.ivory,
              lineHeight: 1.15,
              marginBottom: 4,
            }}
          >{fd?.businessName ?? "Ostéopathie Alsace"}</div>
          <div
            style={{
              fontFamily: SANS,
              fontSize: 9.5,
              letterSpacing: '0.26em',
              textTransform: 'uppercase',
              color: C.terra,
              marginBottom: 20,
              fontWeight: 500,
            }}
          >
            Strasbourg Orangerie · D.O. diplômé
          </div>
          <p
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: 14.5,
              lineHeight: 1.72,
              color: 'rgba(248,244,237,0.58)',
              maxWidth: 300,
              marginBottom: 20,
            }}
          >
            Ostéopathe diplômé d&apos;état, membre du Registre des Ostéopathes
            de France. Consultation sur rendez-vous, Strasbourg.
          </p>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(196,99,74,0.10)',
              border: '1px solid rgba(196,99,74,0.25)',
              borderRadius: 2,
              padding: '7px 14px',
            }}
          >
            <span
              style={{
                fontFamily: SANS,
                fontSize: 9.5,
                letterSpacing: '0.20em',
                textTransform: 'uppercase',
                color: 'rgba(248,244,237,0.60)',
              }}
            >
              ADELI N° 67 93 0000 0
            </span>
          </div>
          <div style={{ marginTop: 24 }}>
            <a href="#rdv" style={{ textDecoration: 'none' }}>
              <TerraButton filled>Prendre rendez-vous</TerraButton>
            </a>
          </div>
        </div>

        {/* Colonnes liens */}
        {cols.map((c) => (
          <div key={c.title}>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 10,
                letterSpacing: '0.26em',
                textTransform: 'uppercase',
                color: C.terra,
                marginBottom: 18,
                fontWeight: 500,
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
                gap: 11,
              }}
            >
              {c.items.map((it) => (
                <li key={it.label}>
                  <FootLink label={it.label} href={it.href} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Pied de bas de page */}
      <div
        style={{
          maxWidth: 1240,
          margin: '56px auto 0',
          paddingTop: 24,
          borderTop: `1px solid rgba(248,244,237,0.10)`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 14,
          fontFamily: SANS,
          fontSize: 10.5,
          letterSpacing: '0.10em',
          color: 'rgba(248,244,237,0.38)',
        }}
      >
        <span>
          © 2024–2026 Ostéopathie Alsace — Strasbourg. Tous droits réservés.
        </span>
        <span style={{ display: 'flex', gap: 22 }}>
          <a href="#cabinet" style={{ color: 'inherit', textDecoration: 'none' }}>
            Mentions légales
          </a>
          <a href="#cabinet" style={{ color: 'inherit', textDecoration: 'none' }}>
            Politique de confidentialité
          </a>
          <a href="#rdv" style={{ color: 'inherit', textDecoration: 'none' }}>
            Prendre RDV en ligne
          </a>
        </span>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .r291-footgrid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 540px) {
          .r291-footgrid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}

function FootLink({ label, href }: { label: string; href: string }) {
  const [h, setH] = useState(false);
  return (
    <a
      href={href}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        fontFamily: SANS,
        fontSize: 14,
        color: h ? C.terra : 'rgba(248,244,237,0.60)',
        textDecoration: 'none',
        transition: 'color .35s',
      }}
    >
      {label}
    </a>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   PAGE — Impact291Page
   Assemblage des 10 sous-composants
   ════════════════════════════════════════════════════════════════════════════ */

// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function Impact291Page() {
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
    background: C.ivory,
    color: C.dark,
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
      <MotifSection />
      <ScrollCrossfade />
      <TechniqueSection />
      <TestimonialsSection />
      <PediatricSection />
      <SportSection />
      <AppointmentFormSection />
      <PracticalSection />
      <FooterSection />
    </main>
  );
}
