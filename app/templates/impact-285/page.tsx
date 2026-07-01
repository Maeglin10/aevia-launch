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
  ChevronDown,
  Stethoscope,
  Globe,
  Heart,
  MapPin,
  Quote,
  Star,
  Phone,
  Clock,
  CreditCard,
  Shield,
  Video,
  Syringe,
  Pill,
  AlertTriangle,
  CheckCircle,
  Calendar,
  User,
  Users,
} from 'lucide-react';

/* ════════════════════════════════════════════════════════════════════════════
   DR. MARC LECOMTE — Médecin généraliste & médecine du voyage · Nantes Centre
   Chorégraphie de défilement éditoriale. Fichier entièrement autonome.
   'use client'. Aucun import externe sauf react, framer-motion, lucide-react.
   ════════════════════════════════════════════════════════════════════════════ */

/* ── Palette ─────────────────────────────────────────────────────────────── */
const C = {
  emerald: '#1a5c3a',
  emeraldDeep: '#123d27',
  emeraldMid: '#236b45',
  emeraldLight: '#2e8a58',
  salmon: '#e8836a',
  salmonLight: '#f0a090',
  salmonDeep: '#d46a52',
  white: '#ffffff',
  linen: '#f5f0e8',
  linenDeep: '#ece6d8',
  ink: '#1a2e24',
  paper: '#faf8f4',
} as const;

/* ── Typographie ─────────────────────────────────────────────────────────── */
const SERIF = "'Spectral', Georgia, serif" as const;
const SANS = "'DM Sans', system-ui, sans-serif" as const;

/* ── Photographie (URLs Unsplash pré-vérifiées — NE PAS modifier les IDs) ── */
const PHOTO = {
  consultation:
    'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?q=80&w=1600&auto=format&fit=crop',
  medecin:
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=1600&auto=format&fit=crop',
  stethoscope:
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=1600&auto=format&fit=crop',
  cabinet:
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1600&auto=format&fit=crop',
  heroWide:
    'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?q=80&w=2000&auto=format&fit=crop',
  bilan:
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=1600&auto=format&fit=crop',
  vaccination:
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1600&auto=format&fit=crop',
} as const;

/* ── Easing partagé ──────────────────────────────────────────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ════════════════════════════════════════════════════════════════════════════
   Primitives partagées
   ════════════════════════════════════════════════════════════════════════════ */

/** Étiquette fine, capitales, interlettrage large, filet émeraude. */
function Eyebrow({
  children,
  color = C.emerald,
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
  const lbl: React.CSSProperties = {
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
      <span style={lbl}>{children}</span>
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

/** Bouton principal émeraude/saumon. */
function PrimaryButton({
  children,
  onClick,
  filled = false,
  type = 'button',
  salmon = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  filled?: boolean;
  type?: 'button' | 'submit';
  salmon?: boolean;
}) {
  const [hover, setHover] = useState(false);
  const accent = salmon ? C.salmon : C.emerald;
  const accentLight = salmon ? C.salmonLight : C.emeraldLight;

  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 12,
    padding: '15px 30px',
    fontFamily: SANS,
    fontSize: 13,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    fontWeight: 600,
    cursor: 'pointer',
    border: `1.5px solid ${accent}`,
    background: filled ? accent : 'transparent',
    color: filled ? C.white : accent,
    transition: 'all .5s cubic-bezier(.16,1,.3,1)',
    borderRadius: 2,
  };
  const hov: React.CSSProperties = hover
    ? filled
      ? { background: accentLight, borderColor: accentLight, transform: 'translateY(-2px)', boxShadow: '0 12px 32px -10px rgba(26,92,58,0.4)' }
      : { background: `${accent}12`, transform: 'translateY(-2px)' }
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
    const onScroll = () => setSolid(window.scrollY > 70);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: 'Le Cabinet', href: '#specialites' },
    { label: 'Consultations', href: '#consultation' },
    { label: 'Voyage', href: '#voyage' },
    { label: 'Infos pratiques', href: '#infos' },
    { label: 'Notre équipe', href: '#equipe' },
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
    background: solid ? 'rgba(18,61,39,0.95)' : 'transparent',
    backdropFilter: solid ? 'blur(16px) saturate(130%)' : 'none',
    WebkitBackdropFilter: solid ? 'blur(16px) saturate(130%)' : 'none',
    borderBottom: solid
      ? `1px solid rgba(232,131,106,0.25)`
      : '1px solid transparent',
    transition: 'all .6s cubic-bezier(.16,1,.3,1)',
  };
  const brand: React.CSSProperties = {
    fontFamily: SERIF,
    fontSize: 19,
    letterSpacing: '0.08em',
    color: C.white,
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  };
  const linkRow: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'clamp(16px,2vw,34px)',
  };

  return (
    <>
      <nav style={bar}>
      <div style={brand}>
        <Stethoscope size={20} color={C.salmon} strokeWidth={1.8} />
        Dr.&nbsp;Lecomte
      </div>
      <div style={linkRow} className="r285-navlinks">
        {links.map((l) => (
          <NavLink key={l.label} label={l.label} href={l.href} />
        ))}
      </div>
      <div className="r285-navcta">
        <a href="#rdv" style={{ textDecoration: 'none' }}>
          <PrimaryButton filled salmon>
            Prendre RDV
          </PrimaryButton>
        </a>
      </div>
      
        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="r285-burger"
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
          <span style={{ width: 22, height: 2, background: '#1a1a1a', borderRadius: 1, display: 'block', transition: 'transform 0.3s', transform: mobileOpen ? 'rotate(45deg) translate(0, 7px)' : 'none' }} />
          <span style={{ width: 22, height: 2, background: '#1a1a1a', borderRadius: 1, display: 'block', opacity: mobileOpen ? 0 : 1, transition: 'opacity 0.3s' }} />
          <span style={{ width: 22, height: 2, background: '#1a1a1a', borderRadius: 1, display: 'block', transition: 'transform 0.3s', transform: mobileOpen ? 'rotate(-45deg) translate(0, -7px)' : 'none' }} />
        </button>
        <style>{`
        @media (max-width: 860px){
          .r285-navlinks{ display:none !important; }
          .r285-burger { display: flex !important; flex-direction: column; }
          .r285-navcta{ display:none !important; }
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
          background: 'rgba(250,248,244,0.98)',
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
                color: '#1a1a1a',
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
        fontSize: 13,
        letterSpacing: '0.06em',
        color: h ? C.salmon : C.linen,
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
          height: 1.5,
          width: h ? '100%' : '0%',
          background: C.salmon,
          transition: 'width .5s cubic-bezier(.16,1,.3,1)',
        }}
      />
    </a>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   1 · HeroSection — Hero professionnel, cabinet lumineux
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
  const titleOpacity = useTransform(scrollYProgress, [0, 0.68], [1, 0]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);

  const section: React.CSSProperties = {
    position: 'relative',
    height: '100vh',
    minHeight: 660,
    overflow: 'hidden',
    background: C.emeraldDeep,
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
          alt="Cabinet lumineux du Dr. Marc Lecomte, médecin généraliste à Nantes Centre"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </motion.div>

      {/* Voiles : émeraude profond en bas */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(18,61,39,0.55) 0%, rgba(18,61,39,0.10) 35%, rgba(18,61,39,0.45) 65%, rgba(18,61,39,0.92) 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(130% 80% at 50% 20%, transparent 35%, rgba(26,92,58,0.50) 100%)',
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
          <Eyebrow color={C.salmonLight} align="center">
            Médecin généraliste · Nantes Centre
          </Eyebrow>
        </Reveal>

        <motion.h1
          initial={{ opacity: 0, y: 44 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.14 }}
          style={{
            fontFamily: SERIF,
            fontWeight: 400,
            color: C.white,
            fontSize: 'clamp(46px, 8vw, 120px)',
            lineHeight: 0.98,
            letterSpacing: '-0.01em',
            margin: '30px 0 24px',
            textShadow: '0 10px 50px rgba(0,0,0,0.45)',
          }}
        >
          Votre santé entre{' '}
          <span style={{ fontStyle: 'italic', color: C.salmonLight }}>
            de bonnes mains
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.42 }}
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 'clamp(16px, 1.9vw, 22px)',
            color: 'rgba(245,240,232,0.88)',
            maxWidth: 580,
            lineHeight: 1.65,
          }}
        >
          Médecine générale & médecine du voyageur — soins de proximité,
          suivi personnalisé et écoute attentive au cœur de Nantes.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.68 }}
          style={{ marginTop: 44, display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <PrimaryButton filled salmon>
            Prendre rendez-vous
          </PrimaryButton>
          <PrimaryButton>
            Nos consultations
          </PrimaryButton>
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
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: 'rgba(245,240,232,0.68)',
          }}
        >
          Découvrir
        </span>
        <motion.div
          animate={{ y: [0, 9, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={20} color={C.salmonLight} strokeWidth={1.4} />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   2 · ScrollCrossfade — 3 visuels (consultation, bilan santé, vaccination)
   ════════════════════════════════════════════════════════════════════════════ */
type CrossfadePanel = {
  src: string;
  alt: string;
  index: string;
  caption: string;
  sub: string;
};

const CROSSFADE_PANELS: CrossfadePanel[] = [
  {
    src: PHOTO.consultation,
    alt: 'Consultation médicale au cabinet du Dr. Lecomte',
    index: 'I',
    caption: 'La Consultation',
    sub: "Un espace d'écoute, un suivi attentif, une médecine centrée sur la personne.",
  },
  {
    src: PHOTO.bilan,
    alt: 'Bilan santé complet au cabinet',
    index: 'II',
    caption: 'Bilan Santé',
    sub: 'Bilan préventif complet : cardiovasculaire, métabolique, dépistages ciblés.',
  },
  {
    src: PHOTO.vaccination,
    alt: 'Vaccination et médecine du voyage',
    index: 'III',
    caption: 'Vaccination',
    sub: 'Vaccins voyage, carnets sanitaires et conseils paludisme avant chaque départ.',
  },
];

function CrossfadeImage({
  panel,
  i,
  total,
  progress,
}: {
  panel: CrossfadePanel;
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
        src={panel.src}
        alt={panel.alt}
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
  panel,
  i,
  total,
  progress,
}: {
  panel: CrossfadePanel;
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
          fontStyle: 'italic',
          fontSize: 'clamp(36px, 8vw, 110px)',
          color: `rgba(232,131,106,0.30)`,
          lineHeight: 1,
          marginBottom: 6,
        }}
      >
        {panel.index}
      </span>
      <h2
        style={{
          fontFamily: SERIF,
          fontSize: 'clamp(38px, 6.5vw, 88px)',
          fontWeight: 400,
          color: C.white,
          lineHeight: 1,
          margin: 0,
          textShadow: '0 6px 36px rgba(0,0,0,0.50)',
        }}
      >
        {panel.caption}
      </h2>
      <p
        style={{
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontSize: 'clamp(15px, 1.7vw, 20px)',
          color: 'rgba(245,240,232,0.88)',
          marginTop: 18,
          maxWidth: 480,
        }}
      >
        {panel.sub}
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
  const width = useTransform(progress, [i * seg, (i + 1) * seg], [10, 36]);
  return (
    <motion.div style={{ height: 2.5, width, background: C.salmon, opacity }} />
  );
}

function ScrollCrossfade() {
  const n = CROSSFADE_PANELS.length;
  const progress = useMotionValue(0.5 / n);
  const [active, setActive] = useState(0);
  const goTo = (i: number) => {
    setActive(i);
    progress.set((i + 0.5) / n);
  };

  return (
    <section
      style={{ height: '100vh', overflow: 'hidden', position: 'relative', background: C.emeraldDeep }}
    >
      <div
        style={{
          position: 'relative',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {CROSSFADE_PANELS.map((p, i) => (
          <CrossfadeImage
            key={p.caption}
            panel={p}
            i={i}
            total={CROSSFADE_PANELS.length}
            progress={progress}
          />
        ))}
        {/* Voile lisibilité */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to bottom, rgba(18,61,39,0.28), rgba(18,61,39,0.08) 42%, rgba(18,61,39,0.62))',
          }}
        />
        {CROSSFADE_PANELS.map((p, i) => (
          <CrossfadeCaption
            key={p.caption}
            panel={p}
            i={i}
            total={CROSSFADE_PANELS.length}
            progress={progress}
          />
        ))}

        {/* ProgressDots */}
        <div
          style={{
            position: 'absolute',
            bottom: 44,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 12,
          }}
        >
          {CROSSFADE_PANELS.map((p, i) => (
            <ProgressDot
              key={p.index}
              i={i}
              total={CROSSFADE_PANELS.length}
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
   3 · SpecialitesSection — 3 domaines médicaux
   ════════════════════════════════════════════════════════════════════════════ */
type Specialite = {
  icon: React.ReactNode;
  titre: string;
  accroche: string;
  details: string[];
};

const SPECIALITES: Specialite[] = [
  {
    icon: <Stethoscope size={32} color={C.emerald} strokeWidth={1.6} />,
    titre: 'Médecine générale',
    accroche: 'Un médecin de famille pour toute la vie',
    details: [
      'Suivi des pathologies courantes',
      'Médecin traitant coordonnateur',
      'Ordonnances et certificats',
      'Prévention & dépistage',
    ],
  },
  {
    icon: <Globe size={32} color={C.salmon} strokeWidth={1.6} />,
    titre: 'Médecine du voyageur',
    accroche: 'Préparer votre santé avant chaque départ',
    details: [
      'Consultation pré-voyage personnalisée',
      'Vaccination internationale',
      'Chimioprophylaxie paludisme',
      'Trousse médicale & conseils terrain',
    ],
  },
  {
    icon: <Heart size={32} color={C.emerald} strokeWidth={1.6} />,
    titre: 'Pathologies chroniques',
    accroche: 'Un suivi rigoureux et humain dans la durée',
    details: [
      'Diabète type 1 & 2',
      'Hypertension artérielle',
      'Maladies cardio-vasculaires',
      'Insuffisance respiratoire',
    ],
  },
];

function SpecialiteCard({
  sp,
  i,
}: {
  sp: Specialite;
  i: number;
}) {
  const [hover, setHover] = useState(false);
  const accent = i === 1 ? C.salmon : C.emerald;

  const card: React.CSSProperties = {
    background: C.white,
    border: `1.5px solid ${hover ? accent : C.linenDeep}`,
    padding: 'clamp(32px,3.5vw,48px)',
    transform: hover ? 'translateY(-10px)' : 'none',
    boxShadow: hover
      ? `0 36px 72px -28px rgba(26,92,58,0.22)`
      : '0 8px 32px -20px rgba(26,92,58,0.14)',
    transition: 'all .6s cubic-bezier(.16,1,.3,1)',
    cursor: 'default',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    boxSizing: 'border-box',
    borderRadius: 4,
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
            width: 62,
            height: 62,
            background: `${accent}12`,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 26,
            transition: 'background .4s',
          }}
        >
          {sp.icon}
        </div>
        <h3
          style={{
            fontFamily: SERIF,
            fontSize: 'clamp(22px,2.4vw,28px)',
            fontWeight: 600,
            color: C.ink,
            margin: '0 0 10px',
          }}
        >
          {sp.titre}
        </h3>
        <p
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 16,
            color: accent,
            margin: '0 0 22px',
            lineHeight: 1.5,
          }}
        >
          {sp.accroche}
        </p>
        <ul
          style={{
            margin: 0,
            padding: 0,
            listStyle: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            flex: 1,
          }}
        >
          {sp.details.map((d) => (
            <li
              key={d}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                fontFamily: SANS,
                fontSize: 14.5,
                color: 'rgba(26,46,36,0.78)',
                lineHeight: 1.5,
              }}
            >
              <CheckCircle size={15} color={accent} strokeWidth={2} />
              {d}
            </li>
          ))}
        </ul>
      </article>
    </Reveal>
  );
}

function SpecialitesSection() {
  const sec: React.CSSProperties = {
    background: C.linen,
    padding: 'clamp(90px,12vw,170px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
    gap: 'clamp(22px,2.8vw,38px)',
    maxWidth: 1200,
    margin: '0 auto',
  };

  return (
    <section style={sec} id="specialites">
      <div style={{ maxWidth: 1200, margin: '0 auto 58px', textAlign: 'center' }}>
        <Reveal>
          <Eyebrow color={C.emeraldMid} align="center">
            Nos domaines d'expertise
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.1}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(34px,5.5vw,68px)',
              fontWeight: 400,
              color: C.ink,
              margin: '22px 0 0',
              lineHeight: 1.06,
            }}
          >
            Un cabinet au service{' '}
            <span style={{ fontStyle: 'italic', color: C.emerald }}>
              de votre santé
            </span>
          </h2>
        </Reveal>
      </div>
      <div style={grid}>
        {SPECIALITES.map((sp, i) => (
          <SpecialiteCard key={sp.titre} sp={sp} i={i} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   4 · ConsultationSection — Left sticky photo + right scroll 4 types
   ════════════════════════════════════════════════════════════════════════════ */
type ConsultType = {
  num: string;
  titre: string;
  body: string;
  duree: string;
};

const CONSULT_TYPES: ConsultType[] = [
  {
    num: '01',
    titre: 'Consultation standard',
    body: "Prise en charge des pathologies courantes, renouvellement d'ordonnances, prescriptions et avis médicaux. Consultation en secteur 1, carte vitale acceptée.",
    duree: '20 min',
  },
  {
    num: '02',
    titre: 'Bilan santé complet',
    body: 'Examen clinique global, analyse des facteurs de risque cardiovasculaire, bilan biologique, dépistages ciblés et plan de prévention personnalisé.',
    duree: '45 min',
  },
  {
    num: '03',
    titre: 'Vaccination voyage',
    body: 'Consultation pré-voyage avec revue de votre carnet vaccinal, recommandations OMS selon la destination, vaccinations sur place et carnet international.',
    duree: '30 min',
  },
  {
    num: '04',
    titre: 'Téléconsultation',
    body: "Consultation vidéo sécurisée depuis chez vous. Idéale pour le renouvellement d'ordonnances, avis médicaux rapides et suivi des pathologies chroniques stables.",
    duree: '15 min',
  },
];

function ConsultationSection() {
  const sec: React.CSSProperties = {
    background: C.paper,
    padding: 'clamp(80px,11vw,150px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '0.9fr 1.1fr',
    gap: 'clamp(40px,6vw,96px)',
    maxWidth: 1220,
    margin: '0 auto',
    alignItems: 'start',
  };
  const stickySide: React.CSSProperties = {
    position: 'sticky',
    top: 90,
    alignSelf: 'start',
  };

  return (
    <section style={sec} id="consultation">
      <div style={grid} className="r285-consultgrid">
        {/* Photo médecin sticky */}
        <div style={stickySide} className="r285-sticky">
          <div
            style={{
              overflow: 'hidden',
              border: `2px solid ${C.linenDeep}`,
              aspectRatio: '4 / 5',
              borderRadius: 4,
            }}
          >
            <img
              src={PHOTO.medecin}
              alt="Dr. Marc Lecomte en consultation"
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
          <div
            style={{
              marginTop: 22,
              padding: '22px 24px',
              background: C.linen,
              borderLeft: `3px solid ${C.salmon}`,
              borderRadius: '0 4px 4px 0',
            }}
          >
            <div
              style={{
                fontFamily: SANS,
                fontSize: 11,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: C.emerald,
                marginBottom: 8,
                fontWeight: 600,
              }}
            >
              Dr. Marc Lecomte
            </div>
            <div
              style={{
                fontFamily: SERIF,
                fontStyle: 'italic',
                fontSize: 16,
                color: 'rgba(26,46,36,0.8)',
                lineHeight: 1.6,
              }}
            >
              « La médecine, c'est avant tout une relation de confiance dans la durée. »
            </div>
          </div>
        </div>

        {/* Types de consultation qui défilent */}
        <div>
          <Reveal>
            <Eyebrow color={C.emeraldMid}>Types de consultations</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(32px,4.8vw,62px)',
                fontWeight: 400,
                color: C.ink,
                margin: '20px 0 52px',
                lineHeight: 1.06,
              }}
            >
              Chaque consultation,{' '}
              <span style={{ fontStyle: 'italic', color: C.emerald }}>
                sur mesure
              </span>
            </h2>
          </Reveal>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {CONSULT_TYPES.map((ct, i) => (
              <Reveal key={ct.num} delay={0.05 * i}>
                <div
                  style={{
                    padding: '32px 0',
                    borderTop: `1px solid ${C.linenDeep}`,
                    display: 'flex',
                    gap: 28,
                    alignItems: 'baseline',
                  }}
                >
                  <span
                    style={{
                      fontFamily: SERIF,
                      fontStyle: 'italic',
                      fontSize: 26,
                      color: `rgba(232,131,106,0.55)`,
                      minWidth: 44,
                    }}
                  >
                    {ct.num}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 10,
                        flexWrap: 'wrap',
                        gap: 8,
                      }}
                    >
                      <h4
                        style={{
                          fontFamily: SERIF,
                          fontSize: 'clamp(18px,2vw,24px)',
                          fontWeight: 600,
                          color: C.ink,
                          margin: 0,
                        }}
                      >
                        {ct.titre}
                      </h4>
                      <span
                        style={{
                          fontFamily: SANS,
                          fontSize: 12,
                          letterSpacing: '0.14em',
                          textTransform: 'uppercase',
                          color: C.salmon,
                          fontWeight: 600,
                          background: `${C.salmon}15`,
                          padding: '4px 12px',
                          borderRadius: 20,
                        }}
                      >
                        {ct.duree}
                      </span>
                    </div>
                    <p
                      style={{
                        fontFamily: SERIF,
                        fontStyle: 'italic',
                        fontSize: 16,
                        lineHeight: 1.72,
                        color: 'rgba(26,46,36,0.72)',
                        margin: 0,
                      }}
                    >
                      {ct.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1} style={{ marginTop: 28 }}>
            <a href="#rdv" style={{ textDecoration: 'none' }}>
              <PrimaryButton filled>
                Réserver une consultation
              </PrimaryButton>
            </a>
          </Reveal>
        </div>
      </div>
      <style>{`
        @media (max-width: 860px){
          .r285-consultgrid{ grid-template-columns: 1fr !important; }
          .r285-sticky{ position: static !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   5 · TestimonialsSection — 3 témoignages patients
   ════════════════════════════════════════════════════════════════════════════ */
type Testimonial = {
  quote: string;
  name: string;
  context: string;
  stars: number;
};

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Le Dr. Lecomte suit mon diabète depuis cinq ans avec une rigueur et une humanité remarquables. Il prend le temps d'expliquer chaque résultat et adapte le traitement sans jamais perdre le contact humain. Je me sens vraiment entre de bonnes mains.",
    name: 'Christine M.',
    context: 'Suivi diabète de type 2 · Nantes',
    stars: 5,
  },
  {
    quote:
      'Avant mon voyage en Asie du Sud-Est, la consultation pré-voyage a été extrêmement complète. Vaccins, chimioprophylaxie, conseils alimentaires, trousse médicale… Je suis parti serein et préparé. Un médecin vraiment à jour sur la médecine du voyage.',
    name: 'Thomas R.',
    context: 'Consultation médecine du voyage · Thaïlande & Vietnam',
    stars: 5,
  },
  {
    quote:
      "Nous avons choisi le Dr. Lecomte comme médecin traitant pour toute la famille. Il connaît nos antécédents, prend en charge les petits comme les adultes, et répond toujours présent. C'est exactement la médecine de famille dont on avait besoin.",
    name: 'Famille Garnier',
    context: 'Médecin traitant famille · Nantes Centre',
    stars: 5,
  },
];

function TestimonialCard({ t, i }: { t: Testimonial; i: number }) {
  return (
    <Reveal delay={i * 0.12} style={{ height: '100%' }}>
      <figure
        style={{
          background: C.white,
          border: `1.5px solid ${C.linenDeep}`,
          padding: 'clamp(30px,3.5vw,48px)',
          margin: 0,
          height: '100%',
          boxSizing: 'border-box',
          boxShadow: '0 20px 56px -36px rgba(26,92,58,0.30)',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 4,
        }}
      >
        <Quote size={30} color={C.salmon} strokeWidth={1.3} />
        <div style={{ display: 'flex', gap: 4, margin: '18px 0 16px' }}>
          {Array.from({ length: t.stars }).map((_, s) => (
            <Star key={s} size={14} fill={C.salmon} color={C.salmon} strokeWidth={0} />
          ))}
        </div>
        <blockquote
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 'clamp(16px,1.8vw,20px)',
            lineHeight: 1.65,
            color: C.ink,
            margin: '0 0 28px',
            flex: 1,
          }}
        >
          "{t.quote}"
        </blockquote>
        <figcaption
          style={{ borderTop: `1px solid ${C.linenDeep}`, paddingTop: 20 }}
        >
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 18,
              color: C.emerald,
              fontWeight: 600,
            }}
          >
            {t.name}
          </div>
          <div
            style={{
              fontFamily: SANS,
              fontSize: 11.5,
              letterSpacing: '0.10em',
              color: 'rgba(26,46,36,0.54)',
              marginTop: 5,
            }}
          >
            {t.context}
          </div>
        </figcaption>
      </figure>
    </Reveal>
  );
}

function TestimonialsSection() {
  const sec: React.CSSProperties = {
    background: C.linen,
    padding: 'clamp(90px,12vw,170px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: 'clamp(26px,3.2vw,44px)',
    maxWidth: 1220,
    margin: '0 auto',
  };

  return (
    <section style={sec} id="temoignages">
      <div
        style={{ maxWidth: 1220, margin: '0 auto 60px', textAlign: 'center' }}
      >
        <Reveal>
          <Eyebrow color={C.emeraldMid} align="center">
            Ce que disent nos patients
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
            La confiance,{' '}
            <span style={{ fontStyle: 'italic', color: C.emerald }}>
              notre meilleure référence
            </span>
          </h2>
        </Reveal>
      </div>
      <div style={grid}>
        {TESTIMONIALS.map((t, i) => (
          <TestimonialCard key={t.name} t={t} i={i} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   6 · RdvFormSection — Formulaire de prise de rendez-vous
   ════════════════════════════════════════════════════════════════════════════ */
function RdvFormSection() {
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [typeConsult, setTypeConsult] = useState('');
  const [dateVoulue, setDateVoulue] = useState('');
  const [sent, setSent] = useState(false);

  const onSubmit = () => {
    if (!prenom || !nom || !telephone || !typeConsult) return;
    setSent(true);
  };

  const sec: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    background: C.emeraldDeep,
    padding: 'clamp(90px,12vw,170px) clamp(24px,6vw,96px)',
  };

  const fieldStyle: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    background: 'transparent',
    border: 'none',
    borderBottom: `1px solid rgba(245,240,232,0.30)`,
    padding: '15px 2px',
    fontFamily: SERIF,
    fontSize: '16px',
    color: C.white,
    outline: 'none',
    WebkitAppearance: 'none',
    appearance: 'none',
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 10.5,
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    color: C.salmonLight,
    display: 'block',
    marginBottom: 4,
    fontWeight: 600,
  };

  return (
    <section style={sec} id="rdv">
      <img
        src={PHOTO.cabinet}
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
          <Eyebrow color={C.salmonLight} align="center">
            Prise de rendez-vous
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(36px,5.6vw,76px)',
              fontWeight: 400,
              color: C.white,
              margin: '22px 0 16px',
              lineHeight: 1.04,
            }}
          >
            Consulter{' '}
            <span style={{ fontStyle: 'italic', color: C.salmonLight }}>
              le Dr. Lecomte
            </span>
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: 'clamp(15px,1.7vw,19px)',
              lineHeight: 1.72,
              color: 'rgba(245,240,232,0.80)',
              maxWidth: 540,
              margin: '0 auto 50px',
            }}
          >
            Remplissez ce formulaire pour nous indiquer vos disponibilités.
            Nous vous confirmerons votre rendez-vous par téléphone dans les 24h.
          </p>
        </Reveal>

        {sent ? (
          <Reveal>
            <div
              style={{
                border: `1.5px solid ${C.salmon}`,
                padding: 'clamp(34px,5vw,56px)',
                background: 'rgba(232,131,106,0.07)',
                borderRadius: 4,
                textAlign: 'center',
              }}
            >
              <CheckCircle size={38} color={C.salmonLight} strokeWidth={1.4} />
              <h3
                style={{
                  fontFamily: SERIF,
                  fontSize: 28,
                  fontWeight: 400,
                  color: C.white,
                  margin: '20px 0 12px',
                }}
              >
                Merci {prenom} !
              </h3>
              <p
                style={{
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  fontSize: 17,
                  color: 'rgba(245,240,232,0.78)',
                  margin: 0,
                  lineHeight: 1.65,
                }}
              >
                Votre demande de{' '}
                <strong style={{ color: C.salmonLight, fontStyle: 'normal' }}>
                  {typeConsult}
                </strong>{' '}
                est bien enregistrée.
                {dateVoulue ? ` Date souhaitée : ${dateVoulue}.` : ''}{' '}
                Nous vous contacterons au {telephone} très prochainement.
              </p>
            </div>
          </Reveal>
        ) : (
          <Reveal delay={0.22}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 30,
                textAlign: 'left',
              }}
            >
              {/* Prénom + Nom en ligne */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }} className="r285-formrow">
                <div>
                  <label style={labelStyle} htmlFor="r285-prenom">
                    Prénom
                  </label>
                  <input
                    id="r285-prenom"
                    style={fieldStyle}
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    placeholder="Marie"
                    autoComplete="given-name"
                  />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="r285-nom">
                    Nom
                  </label>
                  <input
                    id="r285-nom"
                    style={fieldStyle}
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    placeholder="Martin"
                    autoComplete="family-name"
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle} htmlFor="r285-telephone">
                  Téléphone
                </label>
                <input
                  id="r285-telephone"
                  style={fieldStyle}
                  type="tel"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  placeholder="06 12 34 56 78"
                  autoComplete="tel"
                />
              </div>

              <div>
                <label style={labelStyle} htmlFor="r285-type">
                  Type de consultation
                </label>
                <select
                  id="r285-type"
                  style={{
                    ...fieldStyle,
                    cursor: 'pointer',
                    color: typeConsult ? C.white : 'rgba(245,240,232,0.42)',
                  }}
                  value={typeConsult}
                  onChange={(e) => setTypeConsult(e.target.value)}
                >
                  <option value="" style={{ color: '#000', background: '#fff' }}>
                    Choisir un type de consultation…
                  </option>
                  <option value="Consultation générale" style={{ color: '#000', background: '#fff' }}>
                    Consultation générale
                  </option>
                  <option value="Bilan santé complet" style={{ color: '#000', background: '#fff' }}>
                    Bilan santé complet
                  </option>
                  <option value="Médecine du voyage" style={{ color: '#000', background: '#fff' }}>
                    Médecine du voyage
                  </option>
                  <option value="Téléconsultation" style={{ color: '#000', background: '#fff' }}>
                    Téléconsultation
                  </option>
                  <option value="Urgence médicale" style={{ color: '#000', background: '#fff' }}>
                    Urgence médicale
                  </option>
                </select>
              </div>

              <div>
                <label style={labelStyle} htmlFor="r285-date">
                  Date souhaitée (optionnel)
                </label>
                <input
                  id="r285-date"
                  style={fieldStyle}
                  type="date"
                  value={dateVoulue}
                  onChange={(e) => setDateVoulue(e.target.value)}
                />
              </div>

              <div style={{ marginTop: 10, textAlign: 'center' }}>
                <PrimaryButton filled salmon onClick={onSubmit} type="button">
                  Envoyer ma demande de RDV
                </PrimaryButton>
              </div>
            </div>
          </Reveal>
        )}
      </div>
      <style>{`
        @media (max-width: 860px){
          .r285-formrow{ grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   7 · VoyageSection — Médecine du voyage : destinations & conseils
   ════════════════════════════════════════════════════════════════════════════ */
type Destination = {
  region: string;
  pays: string;
  vaccins: string[];
  risque: string;
  couleur: string;
};

const DESTINATIONS: Destination[] = [
  {
    region: 'Asie du Sud-Est',
    pays: 'Thaïlande · Vietnam · Cambodge',
    vaccins: ['Hépatite A & B', 'Typhoïde', 'Encéphalite japonaise', 'Rage'],
    risque: 'Paludisme selon zones',
    couleur: C.emerald,
  },
  {
    region: 'Afrique subsaharienne',
    pays: 'Sénégal · Kenya · Madagascar',
    vaccins: ['Fièvre jaune', 'Méningite', 'Hépatite A & B', 'Typhoïde'],
    risque: 'Paludisme — prophylaxie obligatoire',
    couleur: C.salmon,
  },
  {
    region: 'Amérique latine',
    pays: 'Brésil · Pérou · Colombie',
    vaccins: ['Fièvre jaune', 'Hépatite A', 'Rage (zones rurales)'],
    risque: 'Dengue · Zika selon saison',
    couleur: C.emeraldMid,
  },
  {
    region: 'Moyen-Orient & Afrique du Nord',
    pays: 'Maroc · Égypte · Jordanie',
    vaccins: ['Hépatite A', 'Typhoïde', 'Méningite (Hajj)'],
    risque: 'Précautions alimentaires',
    couleur: C.salmonDeep,
  },
];

function VoyageCard({ dest, i }: { dest: Destination; i: number }) {
  const [hover, setHover] = useState(false);

  const card: React.CSSProperties = {
    background: C.white,
    border: `1.5px solid ${hover ? dest.couleur : C.linenDeep}`,
    padding: 'clamp(26px,3vw,38px)',
    borderRadius: 4,
    transform: hover ? 'translateY(-8px)' : 'none',
    boxShadow: hover
      ? `0 30px 60px -22px rgba(26,92,58,0.20)`
      : '0 6px 24px -16px rgba(26,92,58,0.12)',
    transition: 'all .6s cubic-bezier(.16,1,.3,1)',
    cursor: 'default',
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
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 14,
          }}
        >
          <Globe size={22} color={dest.couleur} strokeWidth={1.7} />
          <div>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 10.5,
                letterSpacing: '0.20em',
                textTransform: 'uppercase',
                color: dest.couleur,
                fontWeight: 700,
              }}
            >
              {dest.region}
            </div>
            <div
              style={{
                fontFamily: SERIF,
                fontStyle: 'italic',
                fontSize: 13.5,
                color: 'rgba(26,46,36,0.65)',
              }}
            >
              {dest.pays}
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 18 }}>
          <div
            style={{
              fontFamily: SANS,
              fontSize: 11,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'rgba(26,46,36,0.50)',
              marginBottom: 8,
              fontWeight: 600,
            }}
          >
            Vaccins recommandés
          </div>
          <ul
            style={{
              margin: 0,
              padding: 0,
              listStyle: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            {dest.vaccins.map((v) => (
              <li
                key={v}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontFamily: SANS,
                  fontSize: 13.5,
                  color: C.ink,
                }}
              >
                <Syringe size={13} color={dest.couleur} strokeWidth={2} />
                {v}
              </li>
            ))}
          </ul>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 14px',
            background: `${dest.couleur}10`,
            borderRadius: 3,
            borderLeft: `3px solid ${dest.couleur}`,
          }}
        >
          <AlertTriangle size={14} color={dest.couleur} strokeWidth={2} />
          <span
            style={{
              fontFamily: SANS,
              fontSize: 13,
              color: dest.couleur,
              fontWeight: 600,
            }}
          >
            {dest.risque}
          </span>
        </div>
      </article>
    </Reveal>
  );
}

function VoyageSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);

  const sec: React.CSSProperties = {
    background: C.emeraldDeep,
    padding: 'clamp(90px,12vw,170px) clamp(24px,6vw,96px)',
    position: 'relative',
    overflow: 'hidden',
  };

  const conseils: { icon: React.ReactNode; titre: string; body: string }[] = [
    {
      icon: <Calendar size={20} color={C.salmonLight} strokeWidth={1.8} />,
      titre: 'Consulter 4 à 6 semaines avant',
      body: 'Certains vaccins nécessitent plusieurs injections espacées. Anticipez votre consultation pour être protégé à temps.',
    },
    {
      icon: <Pill size={20} color={C.salmonLight} strokeWidth={1.8} />,
      titre: 'Trousse médicale adaptée',
      body: 'Antidiarrhéiques, antibiotiques à large spectre, antiseptiques, antipaludéens de secours selon la destination.',
    },
    {
      icon: <Shield size={20} color={C.salmonLight} strokeWidth={1.8} />,
      titre: 'Carnet vaccinal international',
      body: 'La fièvre jaune impose un carnet certifié. Nous disposons du tampon officiel centre de vaccination international.',
    },
  ];

  return (
    <section ref={ref} style={sec} id="voyage">
      <motion.div
        style={{ position: 'absolute', inset: '-10% 0', height: '120%', y: imgY, opacity: 0.07 }}
      >
        <img
          src={PHOTO.stethoscope}
          alt="Image de présentation"
          aria-hidden="true"
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </motion.div>

      <div style={{ position: 'relative', zIndex: 2, maxWidth: 1220, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <Reveal>
            <Eyebrow color={C.salmonLight} align="center">
              Médecine du voyageur
            </Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(34px,5.4vw,70px)',
                fontWeight: 400,
                color: C.white,
                margin: '22px 0 0',
                lineHeight: 1.06,
              }}
            >
              Voyager loin,{' '}
              <span style={{ fontStyle: 'italic', color: C.salmonLight }}>
                sans risquer sa santé
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.14}>
            <p
              style={{
                fontFamily: SERIF,
                fontStyle: 'italic',
                fontSize: 'clamp(15px,1.7vw,19px)',
                color: 'rgba(245,240,232,0.78)',
                maxWidth: 600,
                margin: '22px auto 0',
                lineHeight: 1.7,
              }}
            >
              Le Dr. Lecomte est habilité centre de vaccination internationale.
              Chaque consultation voyage est personnalisée selon votre destination,
              votre itinéraire et votre statut vaccinal.
            </p>
          </Reveal>
        </div>

        {/* 4 destinations */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 'clamp(18px,2.4vw,30px)',
            marginBottom: 70,
          }}
          className="r285-destgrid"
        >
          {DESTINATIONS.map((d, i) => (
            <VoyageCard key={d.region} dest={d} i={i} />
          ))}
        </div>

        {/* 3 conseils */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'clamp(20px,2.8vw,36px)',
          }}
          className="r285-conseilsgrid"
        >
          {conseils.map((c, i) => (
            <Reveal key={c.titre} delay={i * 0.10}>
              <div
                style={{
                  padding: '30px 28px',
                  background: 'rgba(245,240,232,0.06)',
                  border: '1px solid rgba(245,240,232,0.14)',
                  borderRadius: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    background: 'rgba(232,131,106,0.15)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {c.icon}
                </div>
                <h4
                  style={{
                    fontFamily: SERIF,
                    fontSize: 19,
                    fontWeight: 600,
                    color: C.white,
                    margin: 0,
                  }}
                >
                  {c.titre}
                </h4>
                <p
                  style={{
                    fontFamily: SANS,
                    fontSize: 14.5,
                    lineHeight: 1.68,
                    color: 'rgba(245,240,232,0.72)',
                    margin: 0,
                  }}
                >
                  {c.body}
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
   8 · InfoSection — Infos pratiques : secteur, tiers payant, téléconsult…
   ════════════════════════════════════════════════════════════════════════════ */
type InfoItem = {
  icon: React.ReactNode;
  titre: string;
  valeur: string;
  detail?: string;
};

const INFO_ITEMS: InfoItem[] = [
  {
    icon: <CreditCard size={22} color={C.emerald} strokeWidth={1.7} />,
    titre: 'Secteur 1',
    valeur: 'Tarifs conventionnés',
    detail: "Pas de dépassement d'honoraires. Consultation à 26,50 €.",
  },
  {
    icon: <Heart size={22} color={C.salmon} strokeWidth={1.7} />,
    titre: 'Médecin traitant',
    valeur: 'Déclaration possible',
    detail: 'Vous pouvez déclarer le Dr. Lecomte comme médecin traitant via votre espace Ameli.',
  },
  {
    icon: <Shield size={22} color={C.emerald} strokeWidth={1.7} />,
    titre: 'Tiers payant CMU',
    valeur: 'CSS & ALD acceptées',
    detail: 'Tiers payant intégral pour les bénéficiaires de la CSS (ancienne CMU-C) et les ALD.',
  },
  {
    icon: <Video size={22} color={C.salmon} strokeWidth={1.7} />,
    titre: 'Téléconsultation',
    valeur: 'Disponible',
    detail: "Via Doctolib Vidéo. Remboursée à 100 % par l'Assurance Maladie avec médecin traitant.",
  },
  {
    icon: <CreditCard size={22} color={C.emerald} strokeWidth={1.7} />,
    titre: 'Carte Vitale',
    valeur: 'Obligatoire',
    detail: "Merci d'apporter votre carte vitale à jour à chaque consultation.",
  },
  {
    icon: <Clock size={22} color={C.salmon} strokeWidth={1.7} />,
    titre: 'Horaires',
    valeur: 'Lundi – Vendredi',
    detail: '8h30 – 12h30 · 14h00 – 18h30. Samedi matin sur rendez-vous urgent.',
  },
];

function InfoSection() {
  const sec: React.CSSProperties = {
    background: C.paper,
    padding: 'clamp(90px,12vw,165px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 'clamp(22px,2.6vw,36px)',
    maxWidth: 1200,
    margin: '0 auto',
  };

  return (
    <section style={sec} id="infos">
      <div style={{ maxWidth: 1200, margin: '0 auto 56px', textAlign: 'center' }}>
        <Reveal>
          <Eyebrow color={C.emeraldMid} align="center">
            Infos pratiques
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(32px,5vw,62px)',
              fontWeight: 400,
              color: C.ink,
              margin: '20px 0 0',
            }}
          >
            Tout ce qu'il faut{' '}
            <span style={{ fontStyle: 'italic', color: C.emerald }}>
              savoir avant de venir
            </span>
          </h2>
        </Reveal>
      </div>
      <div style={grid}>
        {INFO_ITEMS.map((item, i) => (
          <Reveal key={item.titre} delay={i * 0.08}>
            <div
              style={{
                background: C.white,
                border: `1.5px solid ${C.linenDeep}`,
                padding: '28px 30px',
                borderRadius: 4,
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                boxShadow: '0 4px 18px -14px rgba(26,92,58,0.14)',
              }}
            >
              <div
                style={{
                  width: 50,
                  height: 50,
                  background: `${C.linen}`,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </div>
              <div>
                <div
                  style={{
                    fontFamily: SANS,
                    fontSize: 10.5,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: 'rgba(26,46,36,0.50)',
                    marginBottom: 4,
                    fontWeight: 600,
                  }}
                >
                  {item.titre}
                </div>
                <div
                  style={{
                    fontFamily: SERIF,
                    fontSize: 20,
                    fontWeight: 600,
                    color: C.ink,
                  }}
                >
                  {item.valeur}
                </div>
              </div>
              {item.detail && (
                <p
                  style={{
                    fontFamily: SANS,
                    fontSize: 13.5,
                    lineHeight: 1.64,
                    color: 'rgba(26,46,36,0.66)',
                    margin: 0,
                  }}
                >
                  {item.detail}
                </p>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   9 · TeamSection — Dr. Lecomte + secrétaire + infirmière
   ════════════════════════════════════════════════════════════════════════════ */
type TeamMember = {
  nom: string;
  role: string;
  bio: string;
  img: string;
  accent: string;
};

const TEAM: TeamMember[] = [
  {
    nom: 'Dr. Marc Lecomte',
    role: 'Médecin généraliste & médecin du voyageur',
    bio: 'Diplômé de la Faculté de Médecine de Nantes, le Dr. Lecomte exerce en libéral depuis 2008. Titulaire du Diplôme Universitaire de Médecine des Voyages, il assure un suivi global de ses patients et une prise en charge personnalisée des pathologies chroniques.',
    img: PHOTO.medecin,
    accent: C.emerald,
  },
  {
    nom: 'Isabelle Renaud',
    role: 'Secrétaire médicale',
    bio: "Isabelle gère l'accueil et les rendez-vous depuis 2015. Elle est votre premier interlocuteur pour toute prise de contact avec le cabinet, la gestion des dossiers et les formalités administratives.",
    img: PHOTO.cabinet,
    accent: C.salmon,
  },
  {
    nom: 'Sophie Blanchard',
    role: 'Infirmière de cabinet',
    bio: 'Sophie assure les actes techniques au cabinet : prises de sang, injections, pansements et électrocardiogrammes. Elle coordonne également le suivi infirmier des patients sous ALD en lien direct avec le Dr. Lecomte.',
    img: PHOTO.consultation,
    accent: C.emeraldMid,
  },
];

function TeamMemberCard({ member, i }: { member: TeamMember; i: number }) {
  const [hover, setHover] = useState(false);

  const card: React.CSSProperties = {
    background: C.white,
    border: `1.5px solid ${hover ? member.accent : C.linenDeep}`,
    overflow: 'hidden',
    borderRadius: 4,
    transform: hover ? 'translateY(-8px)' : 'none',
    boxShadow: hover
      ? `0 32px 64px -26px rgba(26,92,58,0.20)`
      : '0 8px 28px -18px rgba(26,92,58,0.14)',
    transition: 'all .6s cubic-bezier(.16,1,.3,1)',
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
            position: 'relative',
            overflow: 'hidden',
            aspectRatio: '4 / 3',
          }}
        >
          <img
            src={member.img}
            alt={member.nom}
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: hover ? 'scale(1.06)' : 'scale(1)',
              transition: 'transform 1s cubic-bezier(.16,1,.3,1)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to top, rgba(18,61,39,0.60), transparent 60%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '20px 24px',
            }}
          >
            <div
              style={{
                fontFamily: SERIF,
                fontSize: 20,
                fontWeight: 600,
                color: C.white,
              }}
            >
              {member.nom}
            </div>
          </div>
        </div>

        <div style={{ padding: '24px 26px 28px' }}>
          <div
            style={{
              fontFamily: SANS,
              fontSize: 10.5,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: member.accent,
              marginBottom: 14,
              fontWeight: 700,
            }}
          >
            {member.role}
          </div>
          <p
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: 15,
              lineHeight: 1.72,
              color: 'rgba(26,46,36,0.72)',
              margin: 0,
            }}
          >
            {member.bio}
          </p>
        </div>
      </article>
    </Reveal>
  );
}

function TeamSection() {
  const sec: React.CSSProperties = {
    background: C.linen,
    padding: 'clamp(90px,12vw,170px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: 'clamp(24px,3vw,42px)',
    maxWidth: 1220,
    margin: '0 auto',
  };

  return (
    <section style={sec} id="equipe">
      <div
        style={{ maxWidth: 1220, margin: '0 auto 60px', textAlign: 'center' }}
      >
        <Reveal>
          <Eyebrow color={C.emeraldMid} align="center">
            Notre équipe
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(32px,5vw,62px)',
              fontWeight: 400,
              color: C.ink,
              margin: '22px 0 0',
            }}
          >
            Des professionnels{' '}
            <span style={{ fontStyle: 'italic', color: C.emerald }}>
              à votre écoute
            </span>
          </h2>
        </Reveal>
        <Reveal delay={0.14}>
          <p
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: 'clamp(15px,1.6vw,18px)',
              color: 'rgba(26,46,36,0.68)',
              maxWidth: 580,
              margin: '18px auto 0',
              lineHeight: 1.7,
            }}
          >
            Une équipe soudée autour d'un projet commun : vous offrir un
            accompagnement médical de qualité, dans la proximité et la durée.
          </p>
        </Reveal>
      </div>
      <div style={grid}>
        {TEAM.map((member, i) => (
          <TeamMemberCard key={member.nom} member={member} i={i} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   10 · FooterSection — Logo, RPPS, Conseil de l'Ordre, horaires
   ════════════════════════════════════════════════════════════════════════════ */
function FooterSection() {
  const cols: { titre: string; items: { label: string; href: string }[] }[] = [
    {
      titre: 'Le Cabinet',
      items: [
        { label: 'Médecine générale', href: '#specialites' },
        { label: 'Médecine du voyage', href: '#voyage' },
        { label: 'Pathologies chroniques', href: '#specialites' },
        { label: 'Notre équipe', href: '#equipe' },
      ],
    },
    {
      titre: 'Consultations',
      items: [
        { label: 'Consultation standard', href: '#consultation' },
        { label: 'Bilan santé', href: '#consultation' },
        { label: 'Vaccination', href: '#voyage' },
        { label: 'Téléconsultation', href: '#consultation' },
      ],
    },
    {
      titre: 'Infos pratiques',
      items: [
        { label: 'Secteur 1 & tarifs', href: '#infos' },
        { label: 'Tiers payant', href: '#infos' },
        { label: 'Prendre RDV', href: '#rdv' },
        { label: 'Témoignages', href: '#temoignages' },
      ],
    },
  ];

  const foot: React.CSSProperties = {
    background: C.emeraldDeep,
    borderTop: `1px solid rgba(232,131,106,0.22)`,
    padding: 'clamp(64px,8vw,100px) clamp(24px,6vw,96px) 40px',
  };

  const horaires: { jour: string; heures: string }[] = [
    { jour: 'Lundi', heures: '8h30 – 12h30 · 14h – 18h30' },
    { jour: 'Mardi', heures: '8h30 – 12h30 · 14h – 18h30' },
    { jour: 'Mercredi', heures: '8h30 – 12h30 · 14h – 18h30' },
    { jour: 'Jeudi', heures: '8h30 – 12h30 · 14h – 18h30' },
    { jour: 'Vendredi', heures: '8h30 – 12h30 · 14h – 18h00' },
    { jour: 'Samedi', heures: 'Urgences sur RDV' },
  ];

  return (
    <footer style={foot}>
      <div
        style={{
          maxWidth: 1220,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.5fr repeat(3, 1fr)',
          gap: 'clamp(36px,4.5vw,64px)',
        }}
        className="r285-footgrid"
      >
        {/* Colonne identité */}
        <div>
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 22,
              color: C.white,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 6,
            }}
          >
            <Stethoscope size={20} color={C.salmon} strokeWidth={1.8} />
            Dr. M. Lecomte
          </div>
          <div
            style={{
              fontFamily: SANS,
              fontSize: 11,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'rgba(245,240,232,0.55)',
              marginBottom: 20,
            }}
          >
            Médecin généraliste & voyages
          </div>

          <p
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: 15,
              lineHeight: 1.68,
              color: 'rgba(245,240,232,0.64)',
              maxWidth: 320,
              marginBottom: 20,
            }}
          >
            Cabinet médical au cœur de Nantes — soins de proximité,
            suivi personnalisé et médecine du voyageur.
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontFamily: SANS,
              fontSize: 12,
              letterSpacing: '0.10em',
              color: 'rgba(245,240,232,0.58)',
              marginBottom: 10,
            }}
          >
            <MapPin size={14} color={C.salmon} strokeWidth={1.6} />
            12 Rue Crébillon, 44000 Nantes
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontFamily: SANS,
              fontSize: 12,
              letterSpacing: '0.10em',
              color: 'rgba(245,240,232,0.58)',
              marginBottom: 22,
            }}
          >
            <Phone size={14} color={C.salmon} strokeWidth={1.6} />
            02 40 XX XX XX
          </div>

          {/* Horaires condensés */}
          <div
            style={{
              borderTop: `1px solid rgba(245,240,232,0.12)`,
              paddingTop: 18,
            }}
          >
            <div
              style={{
                fontFamily: SANS,
                fontSize: 10,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: C.salmonLight,
                marginBottom: 12,
                fontWeight: 700,
              }}
            >
              Horaires
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {horaires.map((h) => (
                <div
                  key={h.jour}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontFamily: SANS,
                    fontSize: 12,
                    color: 'rgba(245,240,232,0.60)',
                    gap: 16,
                  }}
                >
                  <span style={{ minWidth: 70 }}>{h.jour}</span>
                  <span>{h.heures}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Colonnes liens */}
        {cols.map((col) => (
          <div key={col.titre}>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 10.5,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: C.salmon,
                marginBottom: 20,
                fontWeight: 700,
              }}
            >
              {col.titre}
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
              {col.items.map((it) => (
                <li key={it.label}>
                  <a
                    href={it.href}
                    style={{
                      fontFamily: SERIF,
                      fontSize: 15.5,
                      color: 'rgba(245,240,232,0.70)',
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

      {/* Bandeau bas : RPPS, Ordre, mentions légales */}
      <div
        style={{
          maxWidth: 1220,
          margin: '56px auto 0',
          paddingTop: 26,
          borderTop: `1px solid rgba(245,240,232,0.12)`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 14,
          fontFamily: SANS,
          fontSize: 11,
          letterSpacing: '0.10em',
          color: 'rgba(245,240,232,0.44)',
        }}
      >
        <span>
          © 2026 Dr. Marc Lecomte · RPPS 10&nbsp;987&nbsp;654&nbsp;321 ·
          Conseil de l'Ordre des Médecins de Loire-Atlantique · Nantes Centre
        </span>
        <span style={{ display: 'flex', gap: 20 }}>
          <a href="#hero" style={{ color: 'inherit', textDecoration: 'none' }}>
            Mentions légales
          </a>
          <a href="#hero" style={{ color: 'inherit', textDecoration: 'none' }}>
            Confidentialité
          </a>
          <a href="#rdv" style={{ color: 'inherit', textDecoration: 'none' }}>
            Prendre RDV
          </a>
        </span>
      </div>
      <style>{`
        @media (max-width: 860px){
          .r285-footgrid{ grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 540px){
          .r285-footgrid{ grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   PAGE RACINE
   ════════════════════════════════════════════════════════════════════════════ */

// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
function Impact285Page() {
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
    background: C.linen,
    color: C.ink,
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
    <main id="hero" style={root} suppressHydrationWarning>
      {/* Chargement des polices système */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        /* Inputs placeholder */
        input::placeholder,
        select::placeholder,
        textarea::placeholder {
          color: rgba(245,240,232,0.38);
          font-family: ${SERIF};
          font-style: italic;
        }

        /* Input date color fix */
        input[type="date"] {
          color-scheme: dark;
        }

        /* Scrollbar discrète */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${C.linenDeep}; }
        ::-webkit-scrollbar-thumb { background: ${C.emerald}; border-radius: 3px; }

        /* Focus visible */
        :focus-visible {
          outline: 2px solid ${C.salmon};
          outline-offset: 3px;
        }

        /* Responsive global */
        @media (max-width: 860px) {
          .r285-navlinks { display: none !important; }
          .r285-navcta { display: none !important; }
          .r285-destgrid { grid-template-columns: 1fr 1fr !important; }
          .r285-conseilsgrid { grid-template-columns: 1fr !important; }
        }

        @media (max-width: 540px) {
          .r285-destgrid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <Nav />
      <HeroSection />
      <SpecialitesSection />
      <ScrollCrossfade />
      <ConsultationSection />
      <TestimonialsSection />
      <RdvFormSection />
      <VoyageSection />
      <InfoSection />
      <TeamSection />
      <FooterSection />
    </main>
  );
}

export default Impact285Page;
