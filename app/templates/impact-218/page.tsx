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
  Grape,
  MapPin,
  Quote,
  Star,
  Wine,
} from 'lucide-react';

/* ════════════════════════════════════════════════════════════════════════════
   DOMAINE MIROIR — Domaine viticole français · vente par allocation
   Photographie réelle + chorégraphie de défilement éditoriale (style Grand Cru
   × élégance chapitrée). Auto-suffisant. 'use client'.
   ════════════════════════════════════════════════════════════════════════════ */

/* ── Palette ─────────────────────────────────────────────────────────────── */
const C = {
  burgundy: '#3a0d1c',
  burgundyDeep: '#270a13',
  burgundyMid: '#561627',
  cream: '#f4ece0',
  creamDeep: '#e7dcc9',
  gold: '#c9a24b',
  goldLight: '#dcc079',
  ink: '#1c0a10',
  paper: '#faf5ec',
} as const;

const SERIF = "Georgia, 'Times New Roman', Cambria, serif" as const;
const SANS =
  "'Helvetica Neue', Helvetica, Arial, system-ui, sans-serif" as const;

/* ── Photographie (URLs Unsplash pré-vérifiées — NE PAS modifier les IDs) ── */
const PHOTO = {
  vineyard:
    'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=2000&auto=format&fit=crop',
  vineyardWide:
    'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=1600&auto=format&fit=crop',
  rows:
    'https://images.unsplash.com/photo-1474722883778-792e7990302f?q=80&w=1600&auto=format&fit=crop',
  bottle:
    'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?q=80&w=1600&auto=format&fit=crop',
  glass:
    'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=1600&auto=format&fit=crop',
  cellar:
    'https://images.unsplash.com/photo-1543418219-44e30b057fea?q=80&w=1600&auto=format&fit=crop',
} as const;

/* ── Easing partagé ──────────────────────────────────────────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ════════════════════════════════════════════════════════════════════════════
   Primitives
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
    color: filled ? C.burgundyDeep : C.gold,
    transition: 'all .5s cubic-bezier(.16,1,.3,1)',
    position: 'relative',
  };
  const hov: React.CSSProperties = hover
    ? filled
      ? { background: C.goldLight, transform: 'translateY(-2px)' }
      : { background: 'rgba(201,162,75,0.10)', transform: 'translateY(-2px)' }
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
  React.useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: 'Le Domaine', href: '#domaine' },
    { label: 'Millésimes', href: '#millesimes' },
    { label: 'Terroir', href: '#terroir' },
    { label: 'Le Chai', href: '#chai' },
    { label: 'Allocation', href: '#allocation' }
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
    background: solid ? 'rgba(39,10,19,0.92)' : 'transparent',
    backdropFilter: solid ? 'blur(14px) saturate(120%)' : 'none',
    WebkitBackdropFilter: solid ? 'blur(14px) saturate(120%)' : 'none',
    borderBottom: solid
      ? `1px solid rgba(201,162,75,0.22)`
      : '1px solid transparent',
    transition: 'all .6s cubic-bezier(.16,1,.3,1)',
  };
  const brand: React.CSSProperties = {
    fontFamily: SERIF,
    fontSize: 22,
    letterSpacing: '0.30em',
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
    <nav style={bar}>
      <div style={brand}>
        <Grape size={20} color={C.gold} strokeWidth={1.4} />
        Domaine&nbsp;Miroir
      </div>
      <div style={linkRow} className="dm-navlinks">
        {links.map((l) => (
          <NavLink key={l.label} label={l.label} href={l.href} />
        ))}
      </div>
      <div className="dm-navcta">
        <a href="#allocation" style={{ textDecoration: 'none' }}>
          <GoldButton>Réserver</GoldButton>
        </a>
      </div>
      <style>{`
        @media (max-width: 920px){
          .dm-navlinks{ display:none !important; }
          .dm-navcta{ display:none !important; }
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
        letterSpacing: '0.20em',
        textTransform: 'uppercase',
        color: h ? C.gold : C.cream,
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
          background: C.gold,
          transition: 'width .5s cubic-bezier(.16,1,.3,1)',
        }}
      />
    </a>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   1 · HERO parallaxe
   ════════════════════════════════════════════════════════════════════════════ */
function Hero() {
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
    background: C.burgundyDeep,
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
          src={PHOTO.vineyard}
          alt="Vignoble du Domaine Miroir au crépuscule"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </motion.div>

      {/* Voiles : sombre en bas + teinte bourgogne */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(39,10,19,0.42) 0%, rgba(39,10,19,0.08) 38%, rgba(39,10,19,0.40) 70%, rgba(39,10,19,0.88) 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(120% 80% at 50% 30%, transparent 40%, rgba(58,13,28,0.45) 100%)',
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
          <Eyebrow color={C.goldLight} align="center">
            Domaine viticole · Depuis 1834
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
            fontSize: 'clamp(54px, 9vw, 140px)',
            lineHeight: 0.96,
            letterSpacing: '-0.01em',
            margin: '28px 0 22px',
            textShadow: '0 12px 60px rgba(0,0,0,0.5)',
          }}
        >
          L&apos;art du{' '}
          <span style={{ fontStyle: 'italic', color: C.goldLight }}>temps</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.45 }}
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 'clamp(16px, 2vw, 22px)',
            color: 'rgba(244,236,224,0.86)',
            maxWidth: 560,
            lineHeight: 1.6,
          }}
        >
          Des vins de garde nés d&apos;un seul terroir, élevés sans hâte et
          confiés, chaque année, à une poignée d&apos;amateurs.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.7 }}
          style={{ marginTop: 42 }}
        >
          <GoldButton filled>Demander une allocation</GoldButton>
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
            color: 'rgba(244,236,224,0.7)',
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
   2 · Manifeste d'introduction
   ════════════════════════════════════════════════════════════════════════════ */
function Manifesto() {
  const sec: React.CSSProperties = {
    background: C.paper,
    color: C.ink,
    padding: 'clamp(96px, 14vw, 200px) clamp(24px, 8vw, 160px)',
    textAlign: 'center',
  };
  return (
    <section style={sec} id="domaine">
      <Reveal>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 34 }}>
          <Eyebrow color={C.burgundyMid} align="center">
            Le Domaine
          </Eyebrow>
        </div>
      </Reveal>
      <Reveal delay={0.1}>
        <p
          style={{
            fontFamily: SERIF,
            fontSize: 'clamp(26px, 3.6vw, 50px)',
            lineHeight: 1.32,
            fontWeight: 400,
            maxWidth: 1000,
            margin: '0 auto',
            color: C.ink,
          }}
        >
          Au cœur d&apos;un coteau exposé plein sud, le Domaine Miroir cultive{' '}
          <span style={{ fontStyle: 'italic', color: C.burgundy }}>
            douze hectares
          </span>{' '}
          de vieilles vignes. Ici, rien ne presse : la patience est notre
          premier{' '}
          <span style={{ fontStyle: 'italic', color: C.burgundy }}>cépage</span>.
        </p>
      </Reveal>
      <Reveal delay={0.2}>
        <div
          style={{
            width: 1,
            height: 90,
            background: `linear-gradient(${C.gold}, transparent)`,
            margin: '56px auto 0',
          }}
        />
      </Reveal>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   3 · Crossfade chapitré collant (320vh → panneau 100vh)
   ════════════════════════════════════════════════════════════════════════════ */
type Chapter = {
  src: string;
  alt: string;
  index: string;
  caption: string;
  sub: string;
};

const CHAPTERS: Chapter[] = [
  {
    src: PHOTO.rows,
    alt: 'Rangs de vigne du Domaine Miroir',
    index: 'I',
    caption: 'Le Terroir',
    sub: 'Argilo-calcaire, vieilles vignes, exposition sud.',
  },
  {
    src: PHOTO.bottle,
    alt: 'Bouteille du Domaine Miroir',
    index: 'II',
    caption: 'La Vendange',
    sub: 'Récolte manuelle, tri parcelle par parcelle.',
  },
  {
    src: PHOTO.glass,
    alt: 'Verre de vin du Domaine Miroir',
    index: 'III',
    caption: 'La Dégustation',
    sub: 'Un fruit profond, une trame soyeuse, une finale infinie.',
  },
];

function ChapterImage({
  chapter,
  i,
  total,
  progress,
}: {
  chapter: Chapter;
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

function ChapterCaption({
  chapter,
  i,
  total,
  progress,
}: {
  chapter: Chapter;
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
          color: 'rgba(201,162,75,0.32)',
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
          color: 'rgba(244,236,224,0.86)',
          marginTop: 18,
          maxWidth: 460,
        }}
      >
        {chapter.sub}
      </p>
    </motion.div>
  );
}

function ChapteredCrossfade() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  return (
    <section id="contact"
      ref={ref}
      style={{ height: '320vh', position: 'relative', background: C.burgundyDeep }}
    >
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        {CHAPTERS.map((c, i) => (
          <ChapterImage
            key={c.caption}
            chapter={c}
            i={i}
            total={CHAPTERS.length}
            progress={scrollYProgress}
          />
        ))}
        {/* voile lisibilité */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to bottom, rgba(39,10,19,0.30), rgba(39,10,19,0.10) 45%, rgba(39,10,19,0.62))',
          }}
        />
        {CHAPTERS.map((c, i) => (
          <ChapterCaption
            key={c.caption}
            chapter={c}
            i={i}
            total={CHAPTERS.length}
            progress={scrollYProgress}
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
          {CHAPTERS.map((c, i) => (
            <ProgressDot
              key={c.index}
              i={i}
              total={CHAPTERS.length}
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
    [0.3, 1, 1, 0.3],
  );
  const width = useTransform(progress, [i * seg, (i + 1) * seg], [10, 34]);
  return (
    <motion.div style={{ height: 2, width, background: C.gold, opacity }} />
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   4 · Nos Millésimes — cartes (photo réelle, hover lift)
   ════════════════════════════════════════════════════════════════════════════ */
type Vintage = {
  year: string;
  name: string;
  cepage: string;
  note: string;
  img: string;
  scarcity: string;
};

const VINTAGES: Vintage[] = [
  {
    year: '2018',
    name: 'Cuvée du Miroir',
    cepage: 'Pinot Noir',
    note: 'Cerise noire, sous-bois, tanins de velours.',
    img: PHOTO.bottle,
    scarcity: '480 magnums',
  },
  {
    year: '2019',
    name: 'Clos des Saisons',
    cepage: 'Syrah · Grenache',
    note: 'Poivre, violette, fraîcheur saline persistante.',
    img: PHOTO.glass,
    scarcity: '320 caisses',
  },
  {
    year: '2020',
    name: 'Réserve du Coteau',
    cepage: 'Chardonnay',
    note: 'Amande grillée, agrume confit, minéralité crayeuse.',
    img: PHOTO.cellar,
    scarcity: '210 caisses',
  },
];

function VintageCard({ v, i }: { v: Vintage; i: number }) {
  const [hover, setHover] = useState(false);
  const card: React.CSSProperties = {
    background: C.burgundy,
    border: `1px solid ${hover ? 'rgba(201,162,75,0.6)' : 'rgba(201,162,75,0.22)'}`,
    overflow: 'hidden',
    transform: hover ? 'translateY(-12px)' : 'none',
    boxShadow: hover
      ? '0 40px 80px -30px rgba(0,0,0,0.7)'
      : '0 14px 40px -28px rgba(0,0,0,0.6)',
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
        <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '4 / 5' }}>
          <img
            src={v.img}
            alt={`${v.name} ${v.year}`}
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: hover ? 'scale(1.07)' : 'scale(1)',
              transition: 'transform 1s cubic-bezier(.16,1,.3,1)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to top, rgba(39,10,19,0.85), transparent 55%)',
            }}
          />
          <span
            style={{
              position: 'absolute',
              top: 18,
              left: 18,
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: 30,
              color: C.goldLight,
              textShadow: '0 4px 16px rgba(0,0,0,0.6)',
            }}
          >
            {v.year}
          </span>
          <span
            style={{
              position: 'absolute',
              bottom: 16,
              right: 18,
              fontFamily: SANS,
              fontSize: 10,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(244,236,224,0.75)',
            }}
          >
            {v.scarcity}
          </span>
        </div>

        <div
          style={{
            padding: '26px 26px 30px',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              fontFamily: SANS,
              fontSize: 10.5,
              letterSpacing: '0.26em',
              textTransform: 'uppercase',
              color: C.gold,
              marginBottom: 10,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Grape size={13} strokeWidth={1.5} /> {v.cepage}
          </div>
          <h3
            style={{
              fontFamily: SERIF,
              fontSize: 27,
              fontWeight: 400,
              color: C.cream,
              margin: '0 0 12px',
            }}
          >
            {v.name}
          </h3>
          <p
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: 15,
              lineHeight: 1.6,
              color: 'rgba(244,236,224,0.72)',
              margin: '0 0 24px',
              flex: 1,
            }}
          >
            {v.note}
          </p>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 9,
              fontFamily: SANS,
              fontSize: 11,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: hover ? C.goldLight : C.gold,
              transition: 'color .4s',
            }}
          >
            Demander une allocation
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

function Vintages() {
  const sec: React.CSSProperties = {
    background: C.burgundyDeep,
    padding: 'clamp(96px, 13vw, 180px) clamp(24px, 6vw, 96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
    gap: 'clamp(24px, 3vw, 44px)',
    maxWidth: 1240,
    margin: '0 auto',
  };
  return (
    <section style={sec} id="millesimes">
      <div style={{ maxWidth: 1240, margin: '0 auto 56px' }}>
        <Reveal>
          <Eyebrow>Nos Millésimes</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(38px, 6vw, 78px)',
              fontWeight: 400,
              color: C.cream,
              margin: '20px 0 0',
              lineHeight: 1.04,
            }}
          >
            Une signature,{' '}
            <span style={{ fontStyle: 'italic', color: C.goldLight }}>
              chaque année
            </span>
          </h2>
        </Reveal>
      </div>
      <div style={grid}>
        {VINTAGES.map((v, i) => (
          <VintageCard key={v.year} v={v} i={i} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   5 · Lignes éditoriales alternées (image / texte)
   ════════════════════════════════════════════════════════════════════════════ */
type EditRow = {
  eyebrow: string;
  title: React.ReactNode;
  body: string;
  img: string;
  alt: string;
};

const EDIT_ROWS: EditRow[] = [
  {
    eyebrow: 'Le Terroir',
    title: (
      <>
        Un sol qui <span style={{ fontStyle: 'italic' }}>se souvient</span>
      </>
    ),
    body: 'Nos parcelles reposent sur un socle argilo-calcaire vieux de plusieurs millions d’années. Cette roche imprime aux vins leur tension et leur fraîcheur, signature inimitable du coteau du Miroir.',
    img: PHOTO.vineyardWide,
    alt: 'Vignoble en terrasses du Domaine Miroir',
  },
  {
    eyebrow: 'Le Geste',
    title: (
      <>
        La main avant <span style={{ fontStyle: 'italic' }}>la machine</span>
      </>
    ),
    body: 'Vendanges entièrement manuelles, tri sur table, fermentations en levures indigènes. Chaque cuvée est élevée vingt-quatre mois en fûts de chêne français, dans le silence de nos caves voûtées.',
    img: PHOTO.cellar,
    alt: 'Cave d’élevage du Domaine Miroir',
  },
];

function EditorialRows() {
  const sec: React.CSSProperties = {
    background: C.paper,
    padding: 'clamp(80px, 11vw, 160px) clamp(24px, 6vw, 96px)',
  };
  return (
    <section style={sec} id="terroir">
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(80px,11vw,150px)',
        }}
      >
        {EDIT_ROWS.map((r, i) => (
          <Row key={r.eyebrow} row={r} reverse={i % 2 === 1} />
        ))}
      </div>
    </section>
  );
}

function Row({ row, reverse }: { row: EditRow; reverse: boolean }) {
  const wrap: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 'clamp(36px, 6vw, 90px)',
    alignItems: 'center',
  };
  const imgWrap: React.CSSProperties = {
    overflow: 'hidden',
    order: reverse ? 2 : 1,
    aspectRatio: '5 / 6',
  };
  const txt: React.CSSProperties = { order: reverse ? 1 : 2 };
  return (
    <div style={wrap} className="dm-editrow">
      <Reveal y={50} style={imgWrap}>
        <ParallaxImg src={row.img} alt={row.alt} />
      </Reveal>
      <div style={txt}>
        <Reveal>
          <Eyebrow color={C.burgundyMid}>{row.eyebrow}</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h3
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(32px, 4.4vw, 60px)',
              fontWeight: 400,
              color: C.ink,
              margin: '20px 0 24px',
              lineHeight: 1.08,
            }}
          >
            {row.title}
          </h3>
        </Reveal>
        <Reveal delay={0.16}>
          <p
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(16px, 1.6vw, 19px)',
              lineHeight: 1.78,
              color: 'rgba(28,10,16,0.74)',
              maxWidth: 460,
            }}
          >
            {row.body}
          </p>
        </Reveal>
      </div>
      <style>{`
        @media (max-width: 860px){
          .dm-editrow{ grid-template-columns: 1fr !important; }
          .dm-editrow > *{ order: initial !important; }
        }
      `}</style>
    </div>
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
   6 · Notes de dégustation — visuel collant à côté du texte qui défile
   ════════════════════════════════════════════════════════════════════════════ */
type TastingNote = { step: string; title: string; body: string };

const TASTING: TastingNote[] = [
  {
    step: 'Œil',
    title: 'Robe',
    body: 'Grenat profond aux reflets tuilés, dense et lumineuse, larmes lentes signant la concentration.',
  },
  {
    step: 'Nez',
    title: 'Premier nez',
    body: 'Fruits noirs mûrs, pivoine, une pointe de réglisse et de cuir noble qui s’épanouit à l’aération.',
  },
  {
    step: 'Bouche',
    title: 'Attaque',
    body: 'Soyeuse et ample, portée par des tanins fondus et une acidité ciselée qui tient la ligne.',
  },
  {
    step: 'Finale',
    title: 'Persistance',
    body: 'Une finale interminable, saline et épicée, qui laisse le souvenir du fruit longtemps après.',
  },
];

function TastingSticky() {
  const sec: React.CSSProperties = {
    background: C.burgundy,
    padding: 'clamp(80px, 11vw, 150px) clamp(24px, 6vw, 96px)',
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
    top: 90,
    alignSelf: 'start',
  };

  return (
    <section style={sec} id="degustation">
      <div style={grid} className="dm-tasting">
        {/* Visuel collant : détail du millésime */}
        <div style={stickySide} className="dm-tasting-sticky">
          <div
            style={{
              overflow: 'hidden',
              border: `1px solid rgba(201,162,75,0.3)`,
              aspectRatio: '4 / 5',
            }}
          >
            <img
              src={PHOTO.glass}
              alt="Dégustation d’un verre du Domaine Miroir"
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
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
              }}
            >
              Cuvée du Miroir · 2018
            </div>
            <div
              style={{
                fontFamily: SERIF,
                fontStyle: 'italic',
                fontSize: 18,
                color: 'rgba(244,236,224,0.8)',
              }}
            >
              « Un Pinot Noir d’une rare droiture. » — La Revue du Vin
            </div>
          </div>
        </div>

        {/* Notes qui défilent */}
        <div>
          <Reveal>
            <Eyebrow>Notes de dégustation</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(34px, 5vw, 66px)',
                fontWeight: 400,
                color: C.cream,
                margin: '20px 0 56px',
                lineHeight: 1.05,
              }}
            >
              L&apos;expérience du{' '}
              <span style={{ fontStyle: 'italic', color: C.goldLight }}>
                palais
              </span>
            </h2>
          </Reveal>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {TASTING.map((t, i) => (
              <Reveal key={t.step} delay={0.04 * i}>
                <div
                  style={{
                    padding: '34px 0',
                    borderTop: `1px solid rgba(201,162,75,0.22)`,
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
                      color: 'rgba(201,162,75,0.6)',
                      minWidth: 78,
                    }}
                  >
                    {t.step}
                  </span>
                  <div>
                    <h4
                      style={{
                        fontFamily: SERIF,
                        fontSize: 25,
                        fontWeight: 400,
                        color: C.cream,
                        margin: '0 0 10px',
                      }}
                    >
                      {t.title}
                    </h4>
                    <p
                      style={{
                        fontFamily: SERIF,
                        fontStyle: 'italic',
                        fontSize: 16.5,
                        lineHeight: 1.7,
                        color: 'rgba(244,236,224,0.72)',
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
        @media (max-width: 860px){
          .dm-tasting{ grid-template-columns: 1fr !important; }
          .dm-tasting-sticky{ position: static !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   7 · Le Chai / Expérience — bloc plein cadre
   ════════════════════════════════════════════════════════════════════════════ */
function CellarExperience() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);

  const sec: React.CSSProperties = {
    position: 'relative',
    minHeight: '88vh',
    display: 'flex',
    alignItems: 'center',
    overflow: 'hidden',
    background: C.burgundyDeep,
    padding: 'clamp(80px,12vw,160px) clamp(24px,6vw,96px)',
  };

  const stats: { k: string; v: string }[] = [
    { k: '1834', v: 'Fondation du domaine' },
    { k: '12 ha', v: 'Vignes en culture' },
    { k: '24 mois', v: 'Élevage en fût' },
  ];

  return (
    <section ref={ref} style={sec} id="chai">
      <motion.div
        style={{ position: 'absolute', inset: '-10% 0', height: '120%', y }}
      >
        <img
          src={PHOTO.cellar}
          alt="Le chai d’élevage voûté du Domaine Miroir"
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </motion.div>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to right, rgba(39,10,19,0.92) 0%, rgba(39,10,19,0.62) 45%, rgba(39,10,19,0.30) 100%)',
        }}
      />
      <div style={{ position: 'relative', zIndex: 2, maxWidth: 620 }}>
        <Reveal>
          <Eyebrow>Le Chai · Visites privées</Eyebrow>
        </Reveal>
        <Reveal delay={0.1}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(36px, 5.6vw, 76px)',
              fontWeight: 400,
              color: C.cream,
              margin: '22px 0 26px',
              lineHeight: 1.05,
            }}
          >
            Descendre dans{' '}
            <span style={{ fontStyle: 'italic', color: C.goldLight }}>
              le silence
            </span>
          </h2>
        </Reveal>
        <Reveal delay={0.18}>
          <p
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(16px,1.7vw,20px)',
              lineHeight: 1.8,
              color: 'rgba(244,236,224,0.82)',
              maxWidth: 500,
              marginBottom: 38,
            }}
          >
            Nous recevons, sur rendez-vous, une dizaine d&apos;hôtes par semaine.
            Visite des caves voûtées, dégustation verticale de trois millésimes
            et conversation avec le vigneron, au cœur du domaine.
          </p>
        </Reveal>
        <Reveal delay={0.26}>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <GoldButton filled>Réserver une visite</GoldButton>
            <GoldButton>Le calendrier</GoldButton>
          </div>
        </Reveal>
        <Reveal delay={0.34}>
          <div
            style={{
              display: 'flex',
              gap: 'clamp(28px,4vw,56px)',
              marginTop: 56,
              flexWrap: 'wrap',
            }}
          >
            {stats.map((s) => (
              <div key={s.k}>
                <div
                  style={{
                    fontFamily: SERIF,
                    fontStyle: 'italic',
                    fontSize: 'clamp(30px,3.4vw,46px)',
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
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: 'rgba(244,236,224,0.66)',
                    marginTop: 10,
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
   8 · Témoignages (collectionneurs / sommeliers)
   ════════════════════════════════════════════════════════════════════════════ */
type Testimonial = { quote: string; name: string; role: string };

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'Je suis l’allocation du Domaine Miroir depuis huit ans. Aucun millésime ne ressemble au précédent, et pourtant chacun porte la même signature de droiture. C’est une cave que l’on garde.',
    name: 'Hélène Vasseur',
    role: 'Collectionneuse · Genève',
  },
  {
    quote:
      'Sur ma carte, ces vins partent en un service. Le Pinot 2018 a une tension que l’on cherche en Bourgogne et que l’on trouve rarement ailleurs. Une maison rare.',
    name: 'Marc-Antoine Lefèvre',
    role: 'Chef sommelier · Maison Étoilée, Lyon',
  },
];

function Testimonials() {
  const sec: React.CSSProperties = {
    background: C.paper,
    padding: 'clamp(90px,12vw,170px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: 'clamp(32px,4vw,64px)',
    maxWidth: 1180,
    margin: '0 auto',
  };
  return (
    <section style={sec}>
      <div style={{ maxWidth: 1180, margin: '0 auto 60px', textAlign: 'center' }}>
        <Reveal>
          <Eyebrow color={C.burgundyMid} align="center">
            Ils nous lisent
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
            La parole des{' '}
            <span style={{ fontStyle: 'italic', color: C.burgundy }}>
              amateurs
            </span>
          </h2>
        </Reveal>
      </div>
      <div style={grid}>
        {TESTIMONIALS.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.12} style={{ height: '100%' }}>
            <figure
              style={{
                background: '#fff',
                border: `1px solid ${C.creamDeep}`,
                padding: 'clamp(34px,4vw,52px)',
                margin: 0,
                height: '100%',
                boxSizing: 'border-box',
                boxShadow: '0 24px 60px -42px rgba(58,13,28,0.4)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Quote size={34} color={C.gold} strokeWidth={1.2} />
              <div style={{ display: 'flex', gap: 4, margin: '20px 0 18px' }}>
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} size={14} fill={C.gold} color={C.gold} strokeWidth={0} />
                ))}
              </div>
              <blockquote
                style={{
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  fontSize: 'clamp(18px,2vw,23px)',
                  lineHeight: 1.6,
                  color: C.ink,
                  margin: '0 0 28px',
                  flex: 1,
                }}
              >
                “{t.quote}”
              </blockquote>
              <figcaption style={{ borderTop: `1px solid ${C.creamDeep}`, paddingTop: 20 }}>
                <div style={{ fontFamily: SERIF, fontSize: 19, color: C.burgundy }}>
                  {t.name}
                </div>
                <div
                  style={{
                    fontFamily: SANS,
                    fontSize: 11,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: 'rgba(28,10,16,0.5)',
                    marginTop: 6,
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
   9 · Formulaire de demande d'allocation
   ════════════════════════════════════════════════════════════════════════════ */
function AllocationForm() {
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [millesime, setMillesime] = useState('');
  const [sent, setSent] = useState(false);

  const onSubmit = () => {
    if (!nom || !email || !millesime) return;
    setSent(true);
  };

  const sec: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    background: C.burgundyDeep,
    padding: 'clamp(96px,13vw,180px) clamp(24px,6vw,96px)',
  };
  const field: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    background: 'transparent',
    border: 'none',
    borderBottom: `1px solid rgba(201,162,75,0.4)`,
    padding: '16px 2px',
    fontFamily: SERIF,
    fontSize: 18,
    color: C.cream,
    outline: 'none',
  };
  const label: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 10.5,
    letterSpacing: '0.24em',
    textTransform: 'uppercase',
    color: C.gold,
    display: 'block',
    marginBottom: 4,
  };

  const firstName = nom.split(' ')[0] || '';

  return (
    <section style={sec} id="allocation">
      <img
        src={PHOTO.vineyardWide}
        alt=""
        aria-hidden="true"
        loading="lazy"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.12,
        }}
      />
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: 720,
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <Reveal>
          <Eyebrow color={C.goldLight} align="center">
            Demande d&apos;allocation
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(38px,6vw,80px)',
              fontWeight: 400,
              color: C.cream,
              margin: '22px 0 18px',
              lineHeight: 1.04,
            }}
          >
            Rejoindre la{' '}
            <span style={{ fontStyle: 'italic', color: C.goldLight }}>liste</span>
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: 'clamp(16px,1.7vw,20px)',
              lineHeight: 1.7,
              color: 'rgba(244,236,224,0.8)',
              maxWidth: 520,
              margin: '0 auto 52px',
            }}
          >
            Nos vins se vendent par allocation, à un cercle restreint.
            Laissez-nous vos coordonnées : nous vous écrirons à l&apos;ouverture
            du prochain millésime.
          </p>
        </Reveal>

        {sent ? (
          <Reveal>
            <div
              style={{
                border: `1px solid ${C.gold}`,
                padding: 'clamp(36px,5vw,56px)',
                background: 'rgba(201,162,75,0.06)',
              }}
            >
              <Wine size={34} color={C.goldLight} strokeWidth={1.2} />
              <h3
                style={{
                  fontFamily: SERIF,
                  fontSize: 30,
                  fontWeight: 400,
                  color: C.cream,
                  margin: '18px 0 12px',
                }}
              >
                Merci{firstName ? `, ${firstName}` : ''}.
              </h3>
              <p
                style={{
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  fontSize: 17,
                  color: 'rgba(244,236,224,0.78)',
                  margin: 0,
                }}
              >
                Votre demande pour{' '}
                <strong style={{ color: C.goldLight, fontStyle: 'normal' }}>
                  {millesime}
                </strong>{' '}
                est enregistrée. Nous reviendrons vers vous à {email}.
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
              <div>
                <label style={label} htmlFor="dm-nom">
                  Nom complet
                </label>
                <input
                  id="dm-nom"
                  style={field}
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  placeholder="Jean Dupont"
                  autoComplete="name"
                />
              </div>
              <div>
                <label style={label} htmlFor="dm-email">
                  Adresse e-mail
                </label>
                <input
                  id="dm-email"
                  style={field}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jean@exemple.fr"
                  autoComplete="email"
                />
              </div>
              <div>
                <label style={label} htmlFor="dm-millesime">
                  Millésime souhaité
                </label>
                <select
                  id="dm-millesime"
                  style={{
                    ...field,
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    cursor: 'pointer',
                    color: millesime ? C.cream : 'rgba(244,236,224,0.45)',
                  }}
                  value={millesime}
                  onChange={(e) => setMillesime(e.target.value)}
                >
                  <option value="" style={{ color: '#000' }}>
                    Choisir un millésime…
                  </option>
                  {VINTAGES.map((v) => (
                    <option
                      key={v.year}
                      value={`${v.name} ${v.year}`}
                      style={{ color: '#000' }}
                    >
                      {v.name} — {v.year} ({v.cepage})
                    </option>
                  ))}
                  <option value="Tous les millésimes" style={{ color: '#000' }}>
                    Tous les millésimes
                  </option>
                </select>
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
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   10 · Pied de page
   ════════════════════════════════════════════════════════════════════════════ */
function Footer() {
  const cols: { title: string; items: string[] }[] = [
    { title: 'Le Domaine', items: ['Histoire', 'Le terroir', 'L’équipe', 'Engagements'] },
    { title: 'Les Vins', items: ['Millésimes', 'Allocation', 'Notes de dégustation', 'Garde'] },
    { title: 'Visiter', items: ['Le chai', 'Dégustations', 'Réserver', 'Accès'] },
  ];
  const foot: React.CSSProperties = {
    background: C.burgundy,
    borderTop: `1px solid rgba(201,162,75,0.22)`,
    padding: 'clamp(70px,9vw,110px) clamp(24px,6vw,96px) 40px',
  };

  const getAnchor = (item: string) => {
    const normalized = item.toLowerCase();
    if (normalized.includes('histoire') || normalized.includes('équipe') || normalized.includes('engagement')) {
      return '#domaine';
    }
    if (normalized.includes('terroir')) {
      return '#terroir';
    }
    if (normalized.includes('millésime') || normalized.includes('garde')) {
      return '#millesimes';
    }
    if (normalized.includes('allocation') || normalized.includes('réserver') || normalized.includes('accès')) {
      return '#allocation';
    }
    if (normalized.includes('dégustation')) {
      return '#degustation';
    }
    if (normalized.includes('chai')) {
      return '#chai';
    }
    return '#domaine';
  };

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
        className="dm-footgrid"
      >
        <div>
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 26,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: C.cream,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <Grape size={22} color={C.gold} strokeWidth={1.4} />
            Domaine Miroir
          </div>
          <p
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: 16,
              lineHeight: 1.7,
              color: 'rgba(244,236,224,0.66)',
              marginTop: 22,
              maxWidth: 340,
            }}
          >
            Vins de garde par allocation. Coteau du Miroir, France.
          </p>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginTop: 24,
              fontFamily: SANS,
              fontSize: 11,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'rgba(244,236,224,0.6)',
            }}
          >
            <MapPin size={14} color={C.gold} strokeWidth={1.5} /> Coteau du Miroir · France
          </div>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 10.5,
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                color: C.gold,
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
                gap: 13,
              }}
            >
              {c.items.map((it) => (
                <li key={it}>
                  <a
                    href={getAnchor(it)}
                    style={{
                      fontFamily: SERIF,
                      fontSize: 16,
                      color: 'rgba(244,236,224,0.72)',
                      textDecoration: 'none',
                    }}
                  >
                    {it}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div
        style={{
          maxWidth: 1240,
          margin: '64px auto 0',
          paddingTop: 28,
          borderTop: `1px solid rgba(201,162,75,0.16)`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
          fontFamily: SANS,
          fontSize: 11,
          letterSpacing: '0.12em',
          color: 'rgba(244,236,224,0.5)',
        }}
      >
        <span>
          © 1834–2026 Domaine Miroir. L&apos;abus d&apos;alcool est dangereux pour
          la santé. À consommer avec modération.
        </span>
        <span style={{ display: 'flex', gap: 24 }}>
          <a
            href="#domaine"
            style={{ color: 'inherit', textDecoration: 'none' }}
          >
            Mentions légales
          </a>
          <a
            href="#domaine"
            style={{ color: 'inherit', textDecoration: 'none' }}
          >
            Confidentialité
          </a>
        </span>
      </div>
      <style>{`
        @media (max-width: 760px){
          .dm-footgrid{ grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </footer>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════════════════════════════════════ */
export default function Page() {
  const root: React.CSSProperties = {
    background: C.burgundyDeep,
    color: C.cream,
    fontFamily: SERIF,
    overflowX: 'hidden',
    WebkitFontSmoothing: 'antialiased',
  };
  return (
    <main style={root} suppressHydrationWarning>
      <Nav />
      <Hero />
      <Manifesto />
      <ChapteredCrossfade />
      <Vintages />
      <EditorialRows />
      <TastingSticky />
      <CellarExperience />
      <Testimonials />
      <AllocationForm />
      <Footer />
    </main>
  );
}
