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
  Heart,
  Shield,
  Clock,
  MapPin,
  Phone,
  Calendar,
  Quote,
  Star,
  User,
  FileText,
  Video,
  BookOpen,
  CheckCircle,
} from 'lucide-react';

/* ════════════════════════════════════════════════════════════════════════════
   DR. SOPHIE RENARD — Médecin généraliste · Lyon 3e
   Photographie réelle + chorégraphie de défilement éditoriale (style Grand Cru
   × rigueur médicale moderne). Auto-suffisant. 'use client'.
   ════════════════════════════════════════════════════════════════════════════ */

/* ── Palette ─────────────────────────────────────────────────────────────── */
const C = {
  sage: '#2d5a3d',
  sageMid: '#3d7a53',
  sageLite: '#5a9e72',
  plum: '#5c2a4a',
  plumDeep: '#3e1a32',
  plumMid: '#7a3a64',
  ivory: '#f8f5ef',
  cream: '#ede8df',
  creamDeep: '#ddd6ca',
  ink: '#1e1a16',
  paper: '#fdfaf6',
} as const;

const SERIF = 'Lora, Georgia, serif' as const;
const SANS = "'Nunito Sans', system-ui, sans-serif" as const;

/* ── Photographie (URLs Unsplash pré-vérifiées — NE PAS modifier les IDs) ── */
const PHOTO = {
  doctor:
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=1600&auto=format&fit=crop',
  consultation:
    'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?q=80&w=1600&auto=format&fit=crop',
  cabinet:
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1600&auto=format&fit=crop',
  stethoscope:
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=1600&auto=format&fit=crop',
  team:
    'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?q=80&w=1600&auto=format&fit=crop',
} as const;

/* ── Easing partagé ──────────────────────────────────────────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ════════════════════════════════════════════════════════════════════════════
   Primitives
   ════════════════════════════════════════════════════════════════════════════ */

/** Étiquette fine, capitales, interlettrage large, filet sauge. */
function Eyebrow({
  children,
  color = C.sage,
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
    letterSpacing: '0.42em',
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

/** Bouton sauge, contour fin, flèche qui glisse au survol. */
function SageButton({
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
    fontSize: 13,
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    fontWeight: 600,
    cursor: 'pointer',
    border: `1.5px solid ${C.sage}`,
    background: filled ? C.sage : 'transparent',
    color: filled ? '#fff' : C.sage,
    transition: 'all .5s cubic-bezier(.16,1,.3,1)',
    textDecoration: 'none',
  };
  const hov: React.CSSProperties = hover
    ? filled
      ? { background: C.sageMid, borderColor: C.sageMid, transform: 'translateY(-2px)' }
      : { background: 'rgba(45,90,61,0.08)', transform: 'translateY(-2px)' }
    : {};

  if (href) {
    return (
      <a
        href={href}
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
  React.useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: 'Notre approche', href: '#valeurs' },
    { label: 'Consultations', href: '#pratique' },
    { label: 'Équipe', href: '#equipe' },
    { label: 'Infos pratiques', href: '#infos' },
    { label: 'Santé & conseils', href: '#blog' },
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
    background: solid ? 'rgba(248,245,239,0.94)' : 'transparent',
    backdropFilter: solid ? 'blur(14px) saturate(120%)' : 'none',
    WebkitBackdropFilter: solid ? 'blur(14px) saturate(120%)' : 'none',
    borderBottom: solid
      ? `1px solid rgba(45,90,61,0.18)`
      : '1px solid transparent',
    transition: 'all .6s cubic-bezier(.16,1,.3,1)',
  };
  const brand: React.CSSProperties = {
    fontFamily: SERIF,
    fontSize: 20,
    letterSpacing: '0.06em',
    color: solid ? C.sage : '#fff',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    transition: 'color .4s',
  };
  const linkRow: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'clamp(18px,2.4vw,38px)',
  };

  return (
    <nav style={bar} aria-label="Navigation principale">
      <div style={brand}>
        <Heart size={18} color={C.sage} strokeWidth={1.8} />
        Dr. S. Renard
      </div>
      <div style={linkRow} className="r274-navlinks">
        {links.map((l) => (
          <NavLink key={l.label} label={l.label} href={l.href} solid={solid} />
        ))}
      </div>
      <div className="r274-navcta">
        <a href="#rdv" style={{ textDecoration: 'none' }}>
          <SageButton filled>Prendre rendez-vous</SageButton>
        </a>
      </div>
      <style>{`
        @media (max-width: 860px){
          .r274-navlinks{ display:none !important; }
          .r274-navcta{ display:none !important; }
        }
      `}</style>
    </nav>
  );
}

function NavLink({ label, href, solid }: { label: string; href: string; solid: boolean }) {
  const [h, setH] = useState(false);
  return (
    <a
      href={href}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        fontFamily: SANS,
        fontSize: 13,
        fontWeight: 500,
        letterSpacing: '0.06em',
        color: h ? C.sage : solid ? C.ink : 'rgba(255,255,255,0.92)',
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
          height: 1.5,
          width: h ? '100%' : '0%',
          background: C.sage,
          transition: 'width .5s cubic-bezier(.16,1,.3,1)',
        }}
      />
    </a>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   1 · HERO — plein écran avec photo médecin/cabinet
   ════════════════════════════════════════════════════════════════════════════ */
function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '14%']);
  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '-40%']);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);

  const section: React.CSSProperties = {
    position: 'relative',
    height: '100vh',
    minHeight: 640,
    overflow: 'hidden',
    background: C.plumDeep,
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
          src={PHOTO.doctor}
          alt="Dr. Sophie Renard, médecin généraliste à Lyon 3e"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </motion.div>

      {/* Voile dégradé : sauge profond + prune */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(45,90,61,0.30) 0%, rgba(45,90,61,0.08) 35%, rgba(30,26,22,0.50) 70%, rgba(30,26,22,0.90) 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(120% 80% at 50% 30%, transparent 40%, rgba(92,42,74,0.38) 100%)',
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
          <Eyebrow color="rgba(255,255,255,0.8)" align="center">
            Médecin généraliste · Lyon 3e · Secteur 1
          </Eyebrow>
        </Reveal>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.15 }}
          style={{
            fontFamily: SERIF,
            fontWeight: 600,
            color: '#fff',
            fontSize: 'clamp(46px, 8vw, 118px)',
            lineHeight: 1.0,
            letterSpacing: '-0.01em',
            margin: '30px 0 20px',
            textShadow: '0 12px 60px rgba(0,0,0,0.45)',
          }}
        >
          Votre santé,{' '}
          <span style={{ fontStyle: 'italic', color: 'rgba(160,210,170,0.92)' }}>
            notre priorité
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.45 }}
          style={{
            fontFamily: SANS,
            fontSize: 'clamp(16px, 1.8vw, 21px)',
            fontWeight: 400,
            color: 'rgba(255,255,255,0.86)',
            maxWidth: 580,
            lineHeight: 1.65,
          }}
        >
          Un accompagnement médical attentif et personnalisé au cœur de Lyon.
          Consultation, suivi chronique, médecine préventive — pour toute la famille.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.7 }}
          style={{ marginTop: 44, display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <SageButton filled href="#rdv">Prendre rendez-vous</SageButton>
          <SageButton href="#pratique">
            <span style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.7)' }}>
              Nos consultations
            </span>
          </SageButton>
        </motion.div>

        {/* Badges de confiance */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: EASE, delay: 1.0 }}
          style={{
            marginTop: 56,
            display: 'flex',
            gap: 'clamp(16px, 3vw, 40px)',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {[
            { label: 'Carte Vitale acceptée' },
            { label: 'Secteur 1' },
            { label: 'Téléconsultation' },
          ].map((b) => (
            <div
              key={b.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontFamily: SANS,
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.78)',
              }}
            >
              <CheckCircle size={14} color="rgba(160,210,170,0.9)" strokeWidth={2} />
              {b.label}
            </div>
          ))}
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
            color: 'rgba(255,255,255,0.65)',
          }}
        >
          Découvrir
        </span>
        <motion.div
          animate={{ y: [0, 9, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={20} color="rgba(160,210,170,0.9)" strokeWidth={1.5} />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   2 · SCROLL CROSSFADE — section 320vh sticky avec 3 visuels
   ════════════════════════════════════════════════════════════════════════════ */
type CrossSlide = {
  src: string;
  alt: string;
  index: string;
  caption: string;
  sub: string;
};

const CROSS_SLIDES: CrossSlide[] = [
  {
    src: PHOTO.consultation,
    alt: 'Consultation médicale attentive avec le Dr. Renard',
    index: 'I',
    caption: 'L\'écoute',
    sub: 'Chaque consultation commence par comprendre vraiment votre quotidien.',
  },
  {
    src: PHOTO.stethoscope,
    alt: 'Stéthoscope, symbole du soin médical',
    index: 'II',
    caption: 'Le soin',
    sub: 'Un examen clinique rigoureux, adapté à chaque patient.',
  },
  {
    src: PHOTO.cabinet,
    alt: 'Cabinet médical moderne et lumineux',
    index: 'III',
    caption: 'Le cadre',
    sub: 'Un espace pensé pour votre confort et votre sérénité.',
  },
];

function CrossfadeImage({
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
          fontSize: 'clamp(40px, 9vw, 110px)',
          color: 'rgba(45,90,61,0.28)',
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
          fontWeight: 600,
          color: '#fff',
          lineHeight: 1.05,
          margin: 0,
          textShadow: '0 8px 40px rgba(0,0,0,0.5)',
        }}
      >
        {slide.caption}
      </h2>
      <p
        style={{
          fontFamily: SANS,
          fontSize: 'clamp(15px, 1.7vw, 20px)',
          fontWeight: 400,
          color: 'rgba(255,255,255,0.84)',
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
    [0.3, 1, 1, 0.3],
  );
  const width = useTransform(progress, [i * seg, (i + 1) * seg], [10, 34]);
  return (
    <motion.div style={{ height: 2, width, background: 'rgba(160,210,170,0.9)', opacity }} />
  );
}

function ScrollCrossfade() {
  const n = CROSS_SLIDES.length;
  const progress = useMotionValue(0.5 / n);
  const [active, setActive] = useState(0);
  const goTo = (i: number) => {
    setActive(i);
    progress.set((i + 0.5) / n);
  };

  return (
    <section
      style={{ height: '100vh', overflow: 'hidden', position: 'relative', background: C.plumDeep }}
    >
      <div
        style={{
          position: 'relative',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {CROSS_SLIDES.map((s, i) => (
          <CrossfadeImage
            key={s.caption}
            slide={s}
            i={i}
            total={CROSS_SLIDES.length}
            progress={progress}
          />
        ))}
        {/* voile lisibilité */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to bottom, rgba(30,26,22,0.28), rgba(30,26,22,0.08) 45%, rgba(30,26,22,0.60))',
          }}
        />
        {CROSS_SLIDES.map((s, i) => (
          <CrossfadeCaption
            key={s.caption}
            slide={s}
            i={i}
            total={CROSS_SLIDES.length}
            progress={progress}
          />
        ))}

        {/* repère de progression */}
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
          {CROSS_SLIDES.map((s, i) => (
            <ProgressDot
              key={s.index}
              i={i}
              total={CROSS_SLIDES.length}
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
   3 · VALEURS — 3 colonnes : Écoute / Prévention / Suivi
   ════════════════════════════════════════════════════════════════════════════ */
type Value = {
  icon: React.ReactNode;
  title: string;
  body: string;
};

const VALUES: Value[] = [
  {
    icon: <Heart size={36} color={C.sage} strokeWidth={1.4} />,
    title: 'Écoute active',
    body: 'Chaque patient est unique. Nous prenons le temps d\'entendre vos préoccupations, vos antécédents et vos attentes avant toute prescription ou diagnostic.',
  },
  {
    icon: <Shield size={36} color={C.sage} strokeWidth={1.4} />,
    title: 'Médecine préventive',
    body: 'La meilleure maladie est celle qu\'on évite. Bilans réguliers, vaccinations à jour, dépistages adaptés à votre profil — votre santé future se construit aujourd\'hui.',
  },
  {
    icon: <Clock size={36} color={C.sage} strokeWidth={1.4} />,
    title: 'Suivi personnalisé',
    body: 'Un dossier médical vivant, un médecin référent qui vous connaît sur le long terme. La continuité des soins est au cœur de notre pratique.',
  },
];

function ValuesSection() {
  const sec: React.CSSProperties = {
    background: C.paper,
    padding: 'clamp(96px, 14vw, 190px) clamp(24px, 8vw, 120px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 'clamp(32px, 4vw, 64px)',
    maxWidth: 1200,
    margin: '0 auto',
  };

  return (
    <section style={sec} id="valeurs">
      <div style={{ maxWidth: 1200, margin: '0 auto 72px', textAlign: 'center' }}>
        <Reveal>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Eyebrow color={C.plum} align="center">
              Notre approche médicale
            </Eyebrow>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(34px, 5vw, 64px)',
              fontWeight: 600,
              color: C.ink,
              margin: '22px auto 0',
              lineHeight: 1.08,
              maxWidth: 720,
            }}
          >
            Trois piliers pour{' '}
            <span style={{ fontStyle: 'italic', color: C.sage }}>
              votre bien-être
            </span>
          </h2>
        </Reveal>
        <Reveal delay={0.18}>
          <div
            style={{
              width: 1,
              height: 80,
              background: `linear-gradient(${C.sage}, transparent)`,
              margin: '48px auto 0',
            }}
          />
        </Reveal>
      </div>

      <div style={grid} className="r274-values-grid">
        {VALUES.map((v, i) => (
          <ValueCard key={v.title} value={v} index={i} />
        ))}
      </div>
      <style>{`
        @media (max-width: 860px){
          .r274-values-grid{ grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

function ValueCard({ value, index }: { value: Value; index: number }) {
  const [hover, setHover] = useState(false);
  const card: React.CSSProperties = {
    background: hover ? '#fff' : C.ivory,
    border: `1px solid ${hover ? C.sage : C.creamDeep}`,
    padding: 'clamp(32px, 4vw, 52px)',
    transition: 'all .5s cubic-bezier(.16,1,.3,1)',
    transform: hover ? 'translateY(-8px)' : 'none',
    boxShadow: hover
      ? '0 32px 70px -30px rgba(45,90,61,0.25)'
      : '0 8px 30px -20px rgba(30,26,22,0.15)',
    cursor: 'default',
  };

  return (
    <Reveal delay={index * 0.12}>
      <div
        style={card}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div style={{ marginBottom: 28 }}>{value.icon}</div>
        <h3
          style={{
            fontFamily: SERIF,
            fontSize: 'clamp(22px, 2.2vw, 28px)',
            fontWeight: 600,
            color: C.ink,
            margin: '0 0 16px',
          }}
        >
          {value.title}
        </h3>
        <p
          style={{
            fontFamily: SANS,
            fontSize: 16,
            lineHeight: 1.75,
            color: 'rgba(30,26,22,0.7)',
            margin: 0,
          }}
        >
          {value.body}
        </p>
      </div>
    </Reveal>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   4 · PRATIQUE — left sticky photo + right scroll 4 items
   ════════════════════════════════════════════════════════════════════════════ */
type Practice = {
  title: string;
  body: string;
  tag: string;
};

const PRACTICES: Practice[] = [
  {
    title: 'Consultation générale',
    body: 'Diagnostic, ordonnances, certificats médicaux, arrêts de travail. Le Dr. Renard vous reçoit pour toute problématique de santé aiguë ou chronique, des maladies courantes aux situations plus complexes nécessitant une coordination spécialisée.',
    tag: 'Tous patients',
  },
  {
    title: 'Suivi des maladies chroniques',
    body: 'Diabète, hypertension, hypothyroïdie, asthme, maladies cardio-vasculaires. Un suivi structuré avec bilans réguliers, ajustement thérapeutique et coordination avec vos spécialistes pour une prise en charge globale et cohérente.',
    tag: 'Longue durée',
  },
  {
    title: 'Médecine du sport',
    body: 'Certificats d\'aptitude, bilan sportif, traumatologie bénigne, conseils nutritionnels et de récupération. Pour le sportif amateur ou confirmé qui souhaite pratiquer en toute sécurité et optimiser ses performances dans le respect de sa santé.',
    tag: 'Sportifs',
  },
  {
    title: 'Bilan de santé complet',
    body: 'Une consultation approfondie de 45 minutes pour faire le point : évaluation des facteurs de risque, dépistages recommandés selon votre âge, bilan biologique orienté, et mise à jour de votre carnet de vaccination. La prévention au cœur du soin.',
    tag: 'Prévention',
  },
];

function PracticeSection() {
  const sec: React.CSSProperties = {
    background: C.ivory,
    padding: 'clamp(90px, 12vw, 160px) clamp(24px, 6vw, 96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '0.9fr 1.1fr',
    gap: 'clamp(40px, 6vw, 96px)',
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
    <section style={sec} id="pratique">
      <div style={grid} className="r274-practice-grid">
        {/* Visuel collant : photo cabinet */}
        <div style={stickySide} className="r274-practice-sticky">
          <div
            style={{
              overflow: 'hidden',
              border: `1px solid ${C.creamDeep}`,
              aspectRatio: '4 / 5',
              boxShadow: '0 24px 60px -30px rgba(45,90,61,0.2)',
            }}
          >
            <img
              src={PHOTO.cabinet}
              alt="Cabinet médical du Dr. Sophie Renard, Lyon 3e"
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
          <div style={{ marginTop: 22 }}>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 11,
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                color: C.sage,
                fontWeight: 600,
                marginBottom: 8,
              }}
            >
              Cabinet médical · Lyon 3e
            </div>
            <div
              style={{
                fontFamily: SERIF,
                fontStyle: 'italic',
                fontSize: 18,
                color: 'rgba(30,26,22,0.72)',
                lineHeight: 1.6,
              }}
            >
              Un espace calme, équipé et accessible, au cœur du 3e arrondissement.
            </div>
          </div>
        </div>

        {/* Items qui défilent */}
        <div>
          <Reveal>
            <Eyebrow color={C.plum}>Nos consultations</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(34px, 5vw, 64px)',
                fontWeight: 600,
                color: C.ink,
                margin: '20px 0 56px',
                lineHeight: 1.06,
              }}
            >
              Chaque besoin,{' '}
              <span style={{ fontStyle: 'italic', color: C.sage }}>
                une réponse adaptée
              </span>
            </h2>
          </Reveal>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {PRACTICES.map((p, i) => (
              <Reveal key={p.title} delay={0.06 * i}>
                <div
                  style={{
                    padding: 'clamp(28px, 3.5vw, 44px) 0',
                    borderTop: `1px solid ${C.creamDeep}`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 16,
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: SERIF,
                        fontSize: 'clamp(20px, 2.2vw, 27px)',
                        fontWeight: 600,
                        color: C.ink,
                        margin: 0,
                      }}
                    >
                      {p.title}
                    </h3>
                    <span
                      style={{
                        fontFamily: SANS,
                        fontSize: 10.5,
                        fontWeight: 600,
                        letterSpacing: '0.18em',
                        textTransform: 'uppercase',
                        color: C.sage,
                        background: 'rgba(45,90,61,0.10)',
                        padding: '5px 12px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {p.tag}
                    </span>
                  </div>
                  <p
                    style={{
                      fontFamily: SANS,
                      fontSize: 15.5,
                      lineHeight: 1.75,
                      color: 'rgba(30,26,22,0.68)',
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
      </div>
      <style>{`
        @media (max-width: 860px){
          .r274-practice-grid{ grid-template-columns: 1fr !important; }
          .r274-practice-sticky{ position: static !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   5 · TÉMOIGNAGES — 3 patients avec étoiles et guillemets
   ════════════════════════════════════════════════════════════════════════════ */
type Testimonial = { quote: string; name: string; context: string };

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'Le Dr. Renard m\'a diagnostiqué un diabète de type 2 que je n\'avais pas vu venir. Grâce à son suivi rigoureux et ses conseils, j\'ai totalement modifié mes habitudes. Un an plus tard, mes glycémies sont normales. Je lui dois vraiment beaucoup.',
    name: 'Michel T.',
    context: 'Patient suivi pour diabète de type 2',
  },
  {
    quote:
      'J\'ai consulté pour une fatigue persistante que je mettais sur le compte du stress. Elle a insisté pour faire des analyses complémentaires et a trouvé une hypothyroïdie. Le traitement a tout changé. Son écoute et sa rigueur m\'impressionnent à chaque visite.',
    name: 'Camille V.',
    context: 'Patiente suivie pour hypothyroïdie',
  },
  {
    quote:
      'En tant que coureur, j\'avais besoin d\'un médecin qui comprend les besoins des sportifs. Le Dr. Renard m\'a fait un bilan complet, conseillé sur ma nutrition et suivi ma préparation pour le marathon. J\'ai terminé en 3h12 sans blessure. Merci !',
    name: 'Julien M.',
    context: 'Patient suivi en médecine du sport',
  },
];

function TestimonialsSection() {
  const sec: React.CSSProperties = {
    background: C.paper,
    padding: 'clamp(90px, 12vw, 170px) clamp(24px, 6vw, 96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: 'clamp(24px, 3.5vw, 48px)',
    maxWidth: 1240,
    margin: '0 auto',
  };

  return (
    <section style={sec}>
      <div style={{ maxWidth: 1240, margin: '0 auto 64px', textAlign: 'center' }}>
        <Reveal>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Eyebrow color={C.plum} align="center">
              Témoignages
            </Eyebrow>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(34px, 5vw, 66px)',
              fontWeight: 600,
              color: C.ink,
              margin: '22px 0 0',
            }}
          >
            La confiance de{' '}
            <span style={{ fontStyle: 'italic', color: C.plum }}>
              nos patients
            </span>
          </h2>
        </Reveal>
      </div>

      <div style={grid}>
        {TESTIMONIALS.map((t, i) => (
          <TestimonialCard key={t.name} testimonial={t} index={i} />
        ))}
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial, index }: { testimonial: Testimonial; index: number }) {
  return (
    <Reveal delay={index * 0.12} style={{ height: '100%' }}>
      <figure
        style={{
          background: '#fff',
          border: `1px solid ${C.creamDeep}`,
          padding: 'clamp(28px, 3.5vw, 44px)',
          margin: 0,
          height: '100%',
          boxSizing: 'border-box',
          boxShadow: '0 16px 50px -30px rgba(45,90,61,0.18)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Quote size={30} color={C.sage} strokeWidth={1.3} />
        <div style={{ display: 'flex', gap: 4, margin: '18px 0 16px' }}>
          {Array.from({ length: 5 }).map((_, s) => (
            <Star key={s} size={14} fill={C.sage} color={C.sage} strokeWidth={0} />
          ))}
        </div>
        <blockquote
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 'clamp(16px, 1.8vw, 20px)',
            lineHeight: 1.68,
            color: C.ink,
            margin: '0 0 26px',
            flex: 1,
          }}
        >
          &ldquo;{testimonial.quote}&rdquo;
        </blockquote>
        <figcaption style={{ borderTop: `1px solid ${C.creamDeep}`, paddingTop: 18 }}>
          <div style={{ fontFamily: SERIF, fontSize: 18, color: C.sage, fontWeight: 600 }}>
            {testimonial.name}
          </div>
          <div
            style={{
              fontFamily: SANS,
              fontSize: 11.5,
              fontWeight: 500,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'rgba(30,26,22,0.5)',
              marginTop: 5,
            }}
          >
            {testimonial.context}
          </div>
        </figcaption>
      </figure>
    </Reveal>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   6 · FORMULAIRE RDV — avec état "envoyé" personnalisé
   ════════════════════════════════════════════════════════════════════════════ */
function AppointmentFormSection() {
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [motif, setMotif] = useState('');
  const [date, setDate] = useState('');
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prenom || !nom || !telephone || !motif) return;
    setSent(true);
  };

  const sec: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    background: C.plumDeep,
    padding: 'clamp(96px, 13vw, 180px) clamp(24px, 6vw, 96px)',
  };

  const fieldBase: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    background: 'rgba(255,255,255,0.06)',
    border: `1px solid rgba(255,255,255,0.18)`,
    borderRadius: 0,
    padding: '14px 16px',
    fontFamily: SANS,
    fontSize: 16,
    color: '#fff',
    outline: 'none',
    transition: 'border-color .3s',
  };
  const labelStyle: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.24em',
    textTransform: 'uppercase',
    color: 'rgba(160,210,170,0.9)',
    display: 'block',
    marginBottom: 8,
  };

  return (
    <section style={sec} id="rdv">
      {/* Photo de fond subtile */}
      <img
        src={PHOTO.consultation}
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
          maxWidth: 760,
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <Reveal>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Eyebrow color="rgba(160,210,170,0.9)" align="center">
              Prise de rendez-vous
            </Eyebrow>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(36px, 5.5vw, 76px)',
              fontWeight: 600,
              color: '#fff',
              margin: '22px 0 16px',
              lineHeight: 1.06,
            }}
          >
            Réservez votre{' '}
            <span style={{ fontStyle: 'italic', color: 'rgba(160,210,170,0.92)' }}>
              consultation
            </span>
          </h2>
        </Reveal>
        <Reveal delay={0.14}>
          <p
            style={{
              fontFamily: SANS,
              fontSize: 'clamp(15px, 1.6vw, 18px)',
              lineHeight: 1.7,
              color: 'rgba(255,255,255,0.76)',
              maxWidth: 540,
              margin: '0 auto 52px',
            }}
          >
            Remplissez ce formulaire et nous vous confirmerons votre rendez-vous
            par téléphone dans les 24 heures ouvrées.
          </p>
        </Reveal>

        {sent ? (
          <Reveal>
            <div
              style={{
                border: `1px solid rgba(160,210,170,0.5)`,
                padding: 'clamp(36px, 5vw, 56px)',
                background: 'rgba(45,90,61,0.12)',
              }}
            >
              <CheckCircle size={42} color="rgba(160,210,170,0.9)" strokeWidth={1.5} />
              <h3
                style={{
                  fontFamily: SERIF,
                  fontSize: 32,
                  fontWeight: 600,
                  color: '#fff',
                  margin: '20px 0 14px',
                }}
              >
                Merci {prenom}&nbsp;!
              </h3>
              <p
                style={{
                  fontFamily: SANS,
                  fontSize: 17,
                  lineHeight: 1.65,
                  color: 'rgba(255,255,255,0.76)',
                  margin: 0,
                }}
              >
                Votre demande de rendez-vous pour{' '}
                <strong style={{ color: 'rgba(160,210,170,0.9)', fontWeight: 600 }}>
                  {motif}
                </strong>{' '}
                a bien été enregistrée. Nous vous rappellerons au{' '}
                <strong style={{ color: 'rgba(160,210,170,0.9)', fontWeight: 600 }}>
                  {telephone}
                </strong>{' '}
                pour confirmer votre créneau.
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
                gap: 24,
                textAlign: 'left',
              }}
            >
              {/* Ligne prénom + nom */}
              <div
                style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}
                className="r274-form-row"
              >
                <div>
                  <label style={labelStyle} htmlFor="r274-prenom">
                    Prénom
                  </label>
                  <input
                    id="r274-prenom"
                    required
                    style={fieldBase}
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    placeholder="Sophie"
                    autoComplete="given-name"
                  />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="r274-nom">
                    Nom
                  </label>
                  <input
                    id="r274-nom"
                    required
                    style={fieldBase}
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    placeholder="Dupont"
                    autoComplete="family-name"
                  />
                </div>
              </div>

              {/* Téléphone */}
              <div>
                <label style={labelStyle} htmlFor="r274-telephone">
                  Téléphone
                </label>
                <input
                  id="r274-telephone"
                  required
                  type="tel"
                  style={fieldBase}
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  placeholder="06 XX XX XX XX"
                  autoComplete="tel"
                />
              </div>

              {/* Motif */}
              <div>
                <label style={labelStyle} htmlFor="r274-motif">
                  Motif de consultation
                </label>
                <select
                  id="r274-motif"
                  required
                  style={{
                    ...fieldBase,
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    cursor: 'pointer',
                    color: motif ? '#fff' : 'rgba(255,255,255,0.45)',
                  }}
                  value={motif}
                  onChange={(e) => setMotif(e.target.value)}
                >
                  <option value="" style={{ color: '#000' }}>
                    Sélectionner un motif…
                  </option>
                  <option value="Consultation générale" style={{ color: '#000' }}>
                    Consultation générale
                  </option>
                  <option value="Suivi maladie chronique" style={{ color: '#000' }}>
                    Suivi maladie chronique
                  </option>
                  <option value="Médecine du sport" style={{ color: '#000' }}>
                    Médecine du sport
                  </option>
                  <option value="Bilan de santé complet" style={{ color: '#000' }}>
                    Bilan de santé complet
                  </option>
                  <option value="Renouvellement d'ordonnance" style={{ color: '#000' }}>
                    Renouvellement d&apos;ordonnance
                  </option>
                  <option value="Vaccination" style={{ color: '#000' }}>
                    Vaccination
                  </option>
                  <option value="Certificat médical" style={{ color: '#000' }}>
                    Certificat médical
                  </option>
                  <option value="Téléconsultation" style={{ color: '#000' }}>
                    Téléconsultation
                  </option>
                </select>
              </div>

              {/* Date souhaitée */}
              <div>
                <label style={labelStyle} htmlFor="r274-date">
                  Date souhaitée (indicatif)
                </label>
                <input
                  id="r274-date"
                  type="date"
                  style={{
                    ...fieldBase,
                    colorScheme: 'dark',
                  }}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div style={{ marginTop: 8, textAlign: 'center' }}>
                <SageButton filled type="submit">
                  Envoyer ma demande
                </SageButton>
              </div>
            </form>
          </Reveal>
        )}
      </div>
      <style>{`
        @media (max-width: 860px){
          .r274-form-row{ grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   7 · ÉQUIPE — Dr. Renard + infirmière + secrétaire
   ════════════════════════════════════════════════════════════════════════════ */
type TeamMember = {
  name: string;
  role: string;
  bio: string;
  initials: string;
};

const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Dr. Sophie Renard',
    role: 'Médecin généraliste — Praticienne responsable',
    bio: 'Diplômée de la Faculté de Médecine de Lyon en 2008, le Dr. Renard exerce la médecine générale depuis 15 ans avec une spécialisation en médecine du sport et médecine préventive. Membre du Collège National des Généralistes Enseignants (CNGE), elle s\'engage à maintenir ses connaissances à la pointe des recommandations actuelles.',
    initials: 'SR',
  },
  {
    name: 'Marie Beaumont',
    role: 'Infirmière diplômée d\'État',
    bio: 'Marie intervient au cabinet pour les soins infirmiers, les prises de sang, les pansements complexes et les injections. Elle coordonne également les bilans préventifs et le suivi des patients sous traitement de longue durée, assurant le lien entre les différents professionnels de santé.',
    initials: 'MB',
  },
  {
    name: 'Lucie Favre',
    role: 'Secrétaire médicale',
    bio: 'Lucie gère les rendez-vous, l\'accueil des patients et la coordination administrative du cabinet. Présente du lundi au vendredi, elle veille à ce que chaque patient soit orienté rapidement et que les urgences soient prises en compte dans les meilleurs délais.',
    initials: 'LF',
  },
];

function TeamSection() {
  const sec: React.CSSProperties = {
    background: C.ivory,
    padding: 'clamp(90px, 12vw, 165px) clamp(24px, 6vw, 96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 'clamp(28px, 4vw, 56px)',
    maxWidth: 1240,
    margin: '0 auto',
  };

  return (
    <section style={sec} id="equipe">
      <div style={{ maxWidth: 1240, margin: '0 auto 70px', textAlign: 'center' }}>
        <Reveal>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Eyebrow color={C.plum} align="center">
              Notre équipe
            </Eyebrow>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(34px, 5vw, 64px)',
              fontWeight: 600,
              color: C.ink,
              margin: '22px 0 0',
              lineHeight: 1.08,
            }}
          >
            Des professionnels à{' '}
            <span style={{ fontStyle: 'italic', color: C.sage }}>
              votre service
            </span>
          </h2>
        </Reveal>
      </div>

      <div style={grid} className="r274-team-grid">
        {TEAM_MEMBERS.map((m, i) => (
          <TeamCard key={m.name} member={m} index={i} />
        ))}
      </div>
      <style>{`
        @media (max-width: 860px){
          .r274-team-grid{ grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

function TeamCard({ member, index }: { member: TeamMember; index: number }) {
  const [hover, setHover] = useState(false);
  const isMain = index === 0;

  return (
    <Reveal delay={index * 0.12} style={{ height: '100%' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          border: `1px solid ${hover ? C.sage : C.creamDeep}`,
          background: hover ? '#fff' : C.paper,
          padding: 'clamp(28px, 3.5vw, 42px)',
          transition: 'all .5s cubic-bezier(.16,1,.3,1)',
          transform: hover ? 'translateY(-6px)' : 'none',
          boxShadow: hover
            ? '0 28px 60px -25px rgba(45,90,61,0.22)'
            : '0 6px 24px -16px rgba(30,26,22,0.12)',
          cursor: 'default',
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {/* Avatar */}
        <div
          style={{
            width: isMain ? 80 : 64,
            height: isMain ? 80 : 64,
            background: isMain
              ? `linear-gradient(135deg, ${C.sage}, ${C.sageMid})`
              : `linear-gradient(135deg, ${C.plum}, ${C.plumMid})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 24,
          }}
        >
          <span
            style={{
              fontFamily: SERIF,
              fontSize: isMain ? 26 : 20,
              fontWeight: 600,
              color: '#fff',
              letterSpacing: '0.04em',
            }}
          >
            {member.initials}
          </span>
        </div>

        {/* Nom */}
        <h3
          style={{
            fontFamily: SERIF,
            fontSize: isMain ? 'clamp(22px, 2.4vw, 28px)' : 'clamp(19px, 2vw, 24px)',
            fontWeight: 600,
            color: C.ink,
            margin: '0 0 8px',
          }}
        >
          {member.name}
        </h3>

        {/* Rôle */}
        <div
          style={{
            fontFamily: SANS,
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: isMain ? C.sage : C.plum,
            marginBottom: 18,
          }}
        >
          {member.role}
        </div>

        {/* Bio */}
        <p
          style={{
            fontFamily: SANS,
            fontSize: 15,
            lineHeight: 1.72,
            color: 'rgba(30,26,22,0.68)',
            margin: 0,
            flex: 1,
          }}
        >
          {member.bio}
        </p>
      </div>
    </Reveal>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   8 · INFOS PRATIQUES — adresse, horaires, infos utiles
   ════════════════════════════════════════════════════════════════════════════ */
function PracticalInfoSection() {
  const sec: React.CSSProperties = {
    background: C.sage,
    padding: 'clamp(90px, 12vw, 160px) clamp(24px, 6vw, 96px)',
    position: 'relative',
    overflow: 'hidden',
  };

  const horaires = [
    { jour: 'Lundi', heures: '8h00 – 19h00' },
    { jour: 'Mardi', heures: '8h00 – 19h00' },
    { jour: 'Mercredi', heures: '8h00 – 19h00' },
    { jour: 'Jeudi', heures: '8h00 – 19h00' },
    { jour: 'Vendredi', heures: '8h00 – 19h00' },
    { jour: 'Samedi', heures: '9h00 – 12h00' },
  ];

  const infos = [
    { icon: <User size={18} color="#fff" strokeWidth={1.8} />, label: 'Secteur 1 (sans dépassement d\'honoraires)' },
    { icon: <CheckCircle size={18} color="#fff" strokeWidth={1.8} />, label: 'Carte Vitale acceptée, tiers payant pratiqué' },
    { icon: <Video size={18} color="#fff" strokeWidth={1.8} />, label: 'Téléconsultation disponible sur Doctolib' },
    { icon: <Phone size={18} color="#fff" strokeWidth={1.8} />, label: 'Urgences médicales : 15 (SAMU)' },
  ];

  return (
    <section style={sec} id="infos">
      {/* Motif décoratif de fond */}
      <div
        style={{
          position: 'absolute',
          right: -60,
          top: -60,
          width: 400,
          height: 400,
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: 40,
          top: 40,
          width: 280,
          height: 280,
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <div style={{ marginBottom: 64 }}>
          <Reveal>
            <Eyebrow color="rgba(255,255,255,0.75)" align="left">
              Informations pratiques
            </Eyebrow>
          </Reveal>
          <Reveal delay={0.1}>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(34px, 5vw, 64px)',
                fontWeight: 600,
                color: '#fff',
                margin: '22px 0 0',
                lineHeight: 1.08,
              }}
            >
              Nous trouver{' '}
              <span style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.72)' }}>
                facilement
              </span>
            </h2>
          </Reveal>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: 'clamp(32px, 5vw, 70px)',
          }}
          className="r274-infos-grid"
        >
          {/* Adresse */}
          <Reveal delay={0.06}>
            <div>
              <div
                style={{
                  fontFamily: SANS,
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.26em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.65)',
                  marginBottom: 20,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <MapPin size={14} color="rgba(255,255,255,0.65)" strokeWidth={2} />
                Adresse
              </div>
              <div
                style={{
                  fontFamily: SERIF,
                  fontSize: 'clamp(18px, 2vw, 24px)',
                  color: '#fff',
                  lineHeight: 1.55,
                  marginBottom: 16,
                }}
              >
                18, rue de la République
                <br />
                69003 Lyon (3e arr.)
              </div>
              <div
                style={{
                  fontFamily: SANS,
                  fontSize: 14,
                  color: 'rgba(255,255,255,0.72)',
                  lineHeight: 1.6,
                }}
              >
                Métro : Ligne B — Saxe-Gambetta (5 min à pied)
                <br />
                Bus : C13, C14 — Arrêt République
                <br />
                Parking : Antigone (200m)
              </div>
            </div>
          </Reveal>

          {/* Horaires */}
          <Reveal delay={0.12}>
            <div>
              <div
                style={{
                  fontFamily: SANS,
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.26em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.65)',
                  marginBottom: 20,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <Calendar size={14} color="rgba(255,255,255,0.65)" strokeWidth={2} />
                Horaires d&apos;ouverture
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {horaires.map((h) => (
                  <div
                    key={h.jour}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderBottom: '1px solid rgba(255,255,255,0.12)',
                      paddingBottom: 10,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: SANS,
                        fontSize: 14,
                        fontWeight: 600,
                        color: '#fff',
                      }}
                    >
                      {h.jour}
                    </span>
                    <span
                      style={{
                        fontFamily: SERIF,
                        fontStyle: 'italic',
                        fontSize: 15,
                        color: 'rgba(255,255,255,0.8)',
                      }}
                    >
                      {h.heures}
                    </span>
                  </div>
                ))}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span
                    style={{
                      fontFamily: SANS,
                      fontSize: 14,
                      fontWeight: 600,
                      color: 'rgba(255,255,255,0.5)',
                    }}
                  >
                    Dimanche
                  </span>
                  <span
                    style={{
                      fontFamily: SERIF,
                      fontStyle: 'italic',
                      fontSize: 15,
                      color: 'rgba(255,255,255,0.45)',
                    }}
                  >
                    Fermé
                  </span>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Infos utiles */}
          <Reveal delay={0.18}>
            <div>
              <div
                style={{
                  fontFamily: SANS,
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.26em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.65)',
                  marginBottom: 20,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <FileText size={14} color="rgba(255,255,255,0.65)" strokeWidth={2} />
                Informations utiles
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {infos.map((info, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 14,
                    }}
                  >
                    <div style={{ marginTop: 2, flexShrink: 0 }}>{info.icon}</div>
                    <span
                      style={{
                        fontFamily: SANS,
                        fontSize: 14.5,
                        lineHeight: 1.6,
                        color: 'rgba(255,255,255,0.84)',
                      }}
                    >
                      {info.label}
                    </span>
                  </div>
                ))}
              </div>

              <div
                style={{
                  marginTop: 36,
                  padding: '20px 24px',
                  background: 'rgba(255,255,255,0.10)',
                  border: '1px solid rgba(255,255,255,0.20)',
                }}
              >
                <div
                  style={{
                    fontFamily: SANS,
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.65)',
                    marginBottom: 8,
                  }}
                >
                  Téléphone cabinet
                </div>
                <a
                  href="tel:+33478123456"
                  style={{
                    fontFamily: SERIF,
                    fontSize: 24,
                    color: '#fff',
                    textDecoration: 'none',
                    fontWeight: 600,
                  }}
                >
                  04 78 12 34 56
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
      <style>{`
        @media (max-width: 860px){
          .r274-infos-grid{ grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   9 · BLOG — 3 articles santé
   ════════════════════════════════════════════════════════════════════════════ */
type BlogPost = {
  category: string;
  title: string;
  excerpt: string;
  readTime: string;
  img: string;
  imgAlt: string;
};

const BLOG_POSTS: BlogPost[] = [
  {
    category: 'Nutrition',
    title: 'Alimentation équilibrée : les 5 principes clés pour votre santé au quotidien',
    excerpt: 'L\'alimentation est le premier médicament. Découvrez comment composer vos repas pour optimiser votre énergie, prévenir les maladies chroniques et maintenir un poids stable sur le long terme, sans régimes restrictifs.',
    readTime: '5 min de lecture',
    img: PHOTO.stethoscope,
    imgAlt: 'Nutrition et médecine préventive',
  },
  {
    category: 'Prévention',
    title: 'Dépistages indispensables selon votre âge : le calendrier à connaître',
    excerpt: 'Cancer colorectal, mammographie, frottis, dépistage cardiovasculaire… À quel âge faire quoi ? Un guide pratique pour ne manquer aucun dépistage recommandé et détecter les maladies au stade où elles sont encore facilement traitables.',
    readTime: '7 min de lecture',
    img: PHOTO.cabinet,
    imgAlt: 'Dépistage médical et prévention',
  },
  {
    category: 'Activité physique',
    title: 'Bouger 30 minutes par jour change tout : les preuves scientifiques',
    excerpt: 'L\'OMS recommande 150 minutes d\'activité modérée par semaine. Mais comment y arriver avec un emploi du temps chargé ? Nos conseils pratiques pour intégrer l\'activité physique dans votre quotidien et en ressentir les bénéfices rapidement.',
    readTime: '6 min de lecture',
    img: PHOTO.consultation,
    imgAlt: 'Activité physique et santé',
  },
];

function BlogSection() {
  const sec: React.CSSProperties = {
    background: C.paper,
    padding: 'clamp(90px, 12vw, 165px) clamp(24px, 6vw, 96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 'clamp(24px, 3.5vw, 44px)',
    maxWidth: 1240,
    margin: '0 auto',
  };

  return (
    <section style={sec} id="blog">
      <div style={{ maxWidth: 1240, margin: '0 auto 68px', textAlign: 'center' }}>
        <Reveal>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Eyebrow color={C.plum} align="center">
              Santé &amp; conseils
            </Eyebrow>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(34px, 5vw, 64px)',
              fontWeight: 600,
              color: C.ink,
              margin: '22px 0 0',
              lineHeight: 1.08,
            }}
          >
            Articles de{' '}
            <span style={{ fontStyle: 'italic', color: C.sage }}>
              notre équipe
            </span>
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p
            style={{
              fontFamily: SANS,
              fontSize: 17,
              lineHeight: 1.7,
              color: 'rgba(30,26,22,0.65)',
              maxWidth: 560,
              margin: '18px auto 0',
            }}
          >
            Des conseils médicaux fiables et accessibles pour prendre soin de
            vous au quotidien.
          </p>
        </Reveal>
      </div>

      <div style={grid} className="r274-blog-grid">
        {BLOG_POSTS.map((post, i) => (
          <BlogCard key={post.title} post={post} index={i} />
        ))}
      </div>
      <style>{`
        @media (max-width: 860px){
          .r274-blog-grid{ grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

function BlogCard({ post, index }: { post: BlogPost; index: number }) {
  const [hover, setHover] = useState(false);

  return (
    <Reveal delay={index * 0.10} style={{ height: '100%' }}>
      <article
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          border: `1px solid ${hover ? C.sage : C.creamDeep}`,
          background: hover ? '#fff' : C.ivory,
          overflow: 'hidden',
          transition: 'all .5s cubic-bezier(.16,1,.3,1)',
          transform: hover ? 'translateY(-8px)' : 'none',
          boxShadow: hover
            ? '0 32px 70px -25px rgba(45,90,61,0.22)'
            : '0 8px 28px -18px rgba(30,26,22,0.14)',
          cursor: 'pointer',
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {/* Image */}
        <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '16 / 9' }}>
          <img
            src={post.img}
            alt={post.imgAlt}
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: hover ? 'scale(1.06)' : 'scale(1)',
              transition: 'transform .9s cubic-bezier(.16,1,.3,1)',
              display: 'block',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(30,26,22,0.5), transparent 60%)',
            }}
          />
          {/* Catégorie */}
          <span
            style={{
              position: 'absolute',
              top: 16,
              left: 16,
              fontFamily: SANS,
              fontSize: 10.5,
              fontWeight: 700,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#fff',
              background: C.sage,
              padding: '5px 12px',
            }}
          >
            {post.category}
          </span>
        </div>

        {/* Contenu */}
        <div
          style={{
            padding: 'clamp(22px, 3vw, 32px)',
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
          }}
        >
          <div
            style={{
              fontFamily: SANS,
              fontSize: 11.5,
              fontWeight: 500,
              color: 'rgba(30,26,22,0.45)',
              marginBottom: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <BookOpen size={13} strokeWidth={1.8} color="rgba(30,26,22,0.4)" />
            {post.readTime}
          </div>

          <h3
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(18px, 1.8vw, 22px)',
              fontWeight: 600,
              color: C.ink,
              margin: '0 0 14px',
              lineHeight: 1.35,
            }}
          >
            {post.title}
          </h3>

          <p
            style={{
              fontFamily: SANS,
              fontSize: 14.5,
              lineHeight: 1.72,
              color: 'rgba(30,26,22,0.62)',
              margin: '0 0 22px',
              flex: 1,
            }}
          >
            {post.excerpt}
          </p>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontFamily: SANS,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: hover ? C.sageMid : C.sage,
              transition: 'color .4s',
            }}
          >
            Lire l&apos;article
            <ArrowRight
              size={13}
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

/* ════════════════════════════════════════════════════════════════════════════
   10 · FOOTER — Logo texte, liens, mentions légales, RPPS
   ════════════════════════════════════════════════════════════════════════════ */
function FooterSection() {
  const cols: { title: string; items: { label: string; href: string }[] }[] = [
    {
      title: 'Cabinet',
      items: [
        { label: 'Notre approche', href: '#valeurs' },
        { label: 'Consultations', href: '#pratique' },
        { label: 'Notre équipe', href: '#equipe' },
        { label: 'Infos pratiques', href: '#infos' },
      ],
    },
    {
      title: 'Services',
      items: [
        { label: 'Consultation générale', href: '#pratique' },
        { label: 'Suivi chronique', href: '#pratique' },
        { label: 'Médecine du sport', href: '#pratique' },
        { label: 'Téléconsultation', href: '#infos' },
      ],
    },
    {
      title: 'Ressources',
      items: [
        { label: 'Santé &amp; conseils', href: '#blog' },
        { label: 'Prendre RDV', href: '#rdv' },
        { label: 'Contact', href: '#infos' },
        { label: 'Urgences : 15', href: 'tel:15' },
      ],
    },
  ];

  const foot: React.CSSProperties = {
    background: C.plumDeep,
    borderTop: `1px solid rgba(255,255,255,0.08)`,
    padding: 'clamp(70px, 9vw, 110px) clamp(24px, 6vw, 96px) 40px',
  };

  return (
    <footer style={foot} id="footer">
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.5fr repeat(3, 1fr)',
          gap: 'clamp(32px, 5vw, 64px)',
        }}
        className="r274-footgrid"
      >
        {/* Brand */}
        <div>
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 22,
              letterSpacing: '0.06em',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              fontWeight: 600,
            }}
          >
            <Heart size={20} color="rgba(160,210,170,0.9)" strokeWidth={1.8} />
            Dr. S. Renard
          </div>
          <p
            style={{
              fontFamily: SANS,
              fontSize: 15,
              lineHeight: 1.7,
              color: 'rgba(255,255,255,0.58)',
              marginTop: 18,
              maxWidth: 300,
            }}
          >
            Médecin généraliste à Lyon 3e. Secteur 1, carte Vitale acceptée, téléconsultation disponible.
          </p>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              marginTop: 24,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                fontFamily: SANS,
                fontSize: 13,
                color: 'rgba(255,255,255,0.62)',
              }}
            >
              <MapPin size={14} color="rgba(160,210,170,0.75)" strokeWidth={1.8} />
              18 rue de la République, 69003 Lyon
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                fontFamily: SANS,
                fontSize: 13,
                color: 'rgba(255,255,255,0.62)',
              }}
            >
              <Phone size={14} color="rgba(160,210,170,0.75)" strokeWidth={1.8} />
              04 78 12 34 56
            </div>
          </div>
        </div>

        {/* Colonnes de liens */}
        {cols.map((c) => (
          <div key={c.title}>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                color: 'rgba(160,210,170,0.75)',
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
              {c.items.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    dangerouslySetInnerHTML={{ __html: item.label }}
                    style={{
                      fontFamily: SANS,
                      fontSize: 15,
                      color: 'rgba(255,255,255,0.66)',
                      textDecoration: 'none',
                      transition: 'color .3s',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(160,210,170,0.9)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.66)';
                    }}
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Ligne basse : mentions légales + RPPS */}
      <div
        style={{
          maxWidth: 1240,
          margin: '56px auto 0',
          paddingTop: 24,
          borderTop: `1px solid rgba(255,255,255,0.10)`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 14,
          fontFamily: SANS,
          fontSize: 12,
          color: 'rgba(255,255,255,0.38)',
          letterSpacing: '0.06em',
        }}
      >
        <span>
          © 2026 Dr. Sophie Renard — Médecin Généraliste. RPPS : 10 003 456 789
        </span>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>
            Mentions légales
          </a>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>
            Politique de confidentialité
          </a>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>
            CNIL
          </a>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px){
          .r274-footgrid{ grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px){
          .r274-footgrid{ grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   PAGE PRINCIPALE
   ════════════════════════════════════════════════════════════════════════════ */
export default function Impact274Page() {
  const root: React.CSSProperties = {
    background: C.plumDeep,
    color: C.ink,
    fontFamily: SANS,
    overflowX: 'hidden',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
  };

  return (
    <main id="hero" style={root} suppressHydrationWarning>
      <Nav />
      <HeroSection />
      <ScrollCrossfade />
      <ValuesSection />
      <PracticeSection />
      <TestimonialsSection />
      <AppointmentFormSection />
      <TeamSection />
      <PracticalInfoSection />
      <BlogSection />
      <FooterSection />
    </main>
  );
}
