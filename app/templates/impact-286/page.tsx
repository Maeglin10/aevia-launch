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
  Briefcase,
  ChevronDown,
  FileText,
  MapPin,
  Phone,
  Quote,
  Scale,
  Shield,
  Star,
} from 'lucide-react';

/* ════════════════════════════════════════════════════════════════════════════
   CABINET VIDAL — Maître Clara Vidal · Avocate droit social & travail
   Lyon Confluence · Design éditorial premium style Grand Palais × Barreau.
   Auto-suffisant. 'use client'. Pas d'imports externes sauf react/framer/lucide.
   ════════════════════════════════════════════════════════════════════════════ */

/* ── Palette ─────────────────────────────────────────────────────────────── */
const C = {
  bordeaux: '#6b1f2a',
  bordeauxDeep: '#4a1420',
  bordeauxMid: '#8c2b38',
  beige: '#f2ead8',
  beigeDeep: '#e5d9c3',
  gold: '#c9a84c',
  goldLight: '#dcc079',
  dark: '#2a2a2a',
  darkMid: '#3d3d3d',
  ink: '#1e1a17',
  paper: '#faf7f1',
} as const;

const SERIF = "'Cormorant Garamond', Georgia, serif" as const;
const SANS = "'DM Sans', system-ui, sans-serif" as const;

/* ── Photographie (URLs Unsplash pré-vérifiées) ─────────────────────────── */
const PHOTO = {
  tribunal:
    'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=1600&auto=format&fit=crop',
  bureau:
    'https://images.unsplash.com/photo-1521791055366-0d553872952f?q=80&w=1600&auto=format&fit=crop',
  reunion:
    'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1600&auto=format&fit=crop',
  portrait:
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1600&auto=format&fit=crop',
  contrat:
    'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1600&auto=format&fit=crop',
  audience:
    'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=1600&auto=format&fit=crop',
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
    padding: small ? '12px 22px' : '15px 30px',
    fontFamily: SANS,
    fontSize: small ? 11 : 12,
    letterSpacing: '0.24em',
    textTransform: 'uppercase',
    fontWeight: 500,
    cursor: 'pointer',
    border: `1px solid ${C.gold}`,
    background: filled ? C.gold : 'transparent',
    color: filled ? C.bordeauxDeep : C.gold,
    transition: 'all .5s cubic-bezier(.16,1,.3,1)',
  };
  const hov: React.CSSProperties = hover
    ? filled
      ? { background: C.goldLight, transform: 'translateY(-2px)' }
      : { background: 'rgba(201,168,76,0.10)', transform: 'translateY(-2px)' }
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
        size={small ? 13 : 15}
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
    { label: 'Domaines', href: '#domaines' },
    { label: 'Approche', href: '#processus' },
    { label: 'Témoignages', href: '#temoignages' },
    { label: 'Actualités', href: '#actualites' },
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
    padding: solid
      ? '14px clamp(20px,5vw,64px)'
      : '24px clamp(20px,5vw,64px)',
    background: solid ? 'rgba(74,20,32,0.94)' : 'transparent',
    backdropFilter: solid ? 'blur(14px) saturate(120%)' : 'none',
    WebkitBackdropFilter: solid ? 'blur(14px) saturate(120%)' : 'none',
    borderBottom: solid
      ? `1px solid rgba(201,168,76,0.22)`
      : '1px solid transparent',
    transition: 'all .6s cubic-bezier(.16,1,.3,1)',
  };
  const brand: React.CSSProperties = {
    fontFamily: SERIF,
    fontSize: 20,
    letterSpacing: '0.28em',
    color: C.beige,
    textTransform: 'uppercase',
    fontWeight: 400,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  };
  const linkRow: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'clamp(16px,2.2vw,36px)',
  };

  return (
    <nav style={bar}>
      <div style={brand}>
        <Scale size={18} color={C.gold} strokeWidth={1.4} />
        Cabinet&nbsp;Vidal
      </div>
      <div style={linkRow} className="r286-navlinks">
        {links.map((l) => (
          <NavLink key={l.label} label={l.label} href={l.href} />
        ))}
      </div>
      <div className="r286-navcta">
        <a href="#contact" style={{ textDecoration: 'none' }}>
          <GoldButton small>Consultation urgente</GoldButton>
        </a>
      </div>
      <style>{`
        @media (max-width: 860px){
          .r286-navlinks{ display:none !important; }
          .r286-navcta{ display:none !important; }
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
        color: h ? C.gold : C.beige,
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
   1 · HERO — fond bordeaux profond, palais de justice, CTA consultation
   ════════════════════════════════════════════════════════════════════════════ */
function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.14]);
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '-48%']);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.72], [1, 0]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);

  const section: React.CSSProperties = {
    position: 'relative',
    height: '100vh',
    minHeight: 640,
    overflow: 'hidden',
    background: C.bordeauxDeep,
  };

  return (
    <section id="hero" ref={ref} style={section}>
      {/* Photo plein cadre — palais de justice */}
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
          src={PHOTO.tribunal}
          alt="Palais de justice — Cabinet Vidal, Lyon"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </motion.div>

      {/* Voile bordeaux profond */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(74,20,32,0.55) 0%, rgba(74,20,32,0.10) 38%, rgba(74,20,32,0.50) 68%, rgba(74,20,32,0.92) 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(120% 80% at 50% 30%, transparent 35%, rgba(107,31,42,0.50) 100%)',
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
          padding: '0 clamp(20px,6vw,96px)',
          y: titleY,
          opacity: titleOpacity,
        }}
      >
        <Reveal y={20}>
          <Eyebrow color={C.goldLight} align="center">
            Maître Clara Vidal · Barreau de Lyon
          </Eyebrow>
        </Reveal>

        <motion.h1
          initial={{ opacity: 0, y: 44 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.15 }}
          style={{
            fontFamily: SERIF,
            fontWeight: 400,
            color: C.beige,
            fontSize: 'clamp(46px, 8.5vw, 128px)',
            lineHeight: 0.97,
            letterSpacing: '-0.01em',
            margin: '28px 0 24px',
            textShadow: '0 12px 60px rgba(0,0,0,0.55)',
            maxWidth: 1100,
          }}
        >
          Votre droit du travail{' '}
          <span style={{ fontStyle: 'italic', color: C.goldLight }}>
            défendu
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.44 }}
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 'clamp(16px, 1.9vw, 22px)',
            color: 'rgba(242,234,216,0.88)',
            maxWidth: 580,
            lineHeight: 1.62,
          }}
        >
          Droit social, licenciement, harcèlement moral — une avocate engagée à
          vos côtés, de la consultation à la plaidoirie.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.72 }}
          style={{ marginTop: 44, display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <GoldButton filled>
            Consultation urgente
          </GoldButton>
          <GoldButton>
            Découvrir le cabinet
          </GoldButton>
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
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: 'rgba(242,234,216,0.7)',
          }}
        >
          En savoir plus
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
   2 · SCROLL CROSSFADE — 320vh sticky, 3 visuels : audience / bureau / contrat
   ════════════════════════════════════════════════════════════════════════════ */
type CrossfadeScene = {
  src: string;
  alt: string;
  index: string;
  caption: string;
  sub: string;
};

const SCENES: CrossfadeScene[] = [
  {
    src: PHOTO.audience,
    alt: "Salle d'audience au tribunal de Lyon",
    index: 'I',
    caption: "L'audience",
    sub: 'Plaider avec rigueur, défendre avec conviction.',
  },
  {
    src: PHOTO.bureau,
    alt: "Bureau du cabinet d'avocats",
    index: 'II',
    caption: 'Le cabinet',
    sub: 'Un espace de confiance pour construire votre stratégie.',
  },
  {
    src: PHOTO.contrat,
    alt: "Lecture et négociation d'un contrat",
    index: 'III',
    caption: 'Le contrat',
    sub: 'Analyser, négocier, sécuriser chaque clause.',
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
          fontSize: 'clamp(38px, 8.5vw, 112px)',
          color: 'rgba(201,168,76,0.30)',
          lineHeight: 1,
          marginBottom: 8,
        }}
      >
        {scene.index}
      </span>
      <h2
        style={{
          fontFamily: SERIF,
          fontSize: 'clamp(40px, 7vw, 96px)',
          fontWeight: 400,
          color: C.beige,
          lineHeight: 1,
          margin: 0,
          textShadow: '0 8px 40px rgba(0,0,0,0.58)',
        }}
      >
        {scene.caption}
      </h2>
      <p
        style={{
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontSize: 'clamp(15px, 1.8vw, 21px)',
          color: 'rgba(242,234,216,0.88)',
          marginTop: 18,
          maxWidth: 460,
        }}
      >
        {scene.sub}
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
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  return (
    <div
      ref={ref}
      style={{ height: '320vh', position: 'relative', background: C.bordeauxDeep }}
    >
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        {SCENES.map((s, i) => (
          <CrossfadeImage
            key={s.caption}
            scene={s}
            i={i}
            total={SCENES.length}
            progress={scrollYProgress}
          />
        ))}
        {/* voile lisibilité */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to bottom, rgba(74,20,32,0.30), rgba(74,20,32,0.10) 44%, rgba(74,20,32,0.65))',
          }}
        />
        {SCENES.map((s, i) => (
          <CrossfadeCaption
            key={s.caption}
            scene={s}
            i={i}
            total={SCENES.length}
            progress={scrollYProgress}
          />
        ))}

        {/* Points de progression animés */}
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
          {SCENES.map((s, i) => (
            <ProgressDot
              key={s.index}
              i={i}
              total={SCENES.length}
              progress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   3 · DOMAINES D'EXPERTISE — 3 cartes avec icônes lucide-react
   ════════════════════════════════════════════════════════════════════════════ */
type Domaine = {
  icon: React.ReactNode;
  titre: string;
  sous: string;
  detail: string;
};

const DOMAINES: Domaine[] = [
  {
    icon: <Briefcase size={28} strokeWidth={1.4} />,
    titre: 'Licenciement & rupture',
    sous: 'Contester, négocier, obtenir réparation.',
    detail:
      "Licenciement abusif, économique ou disciplinaire — Maître Vidal analyse votre dossier, identifie les vices de procédure et construit une stratégie adaptée : transaction amiable ou saisine du Conseil de prud'hommes.",
  },
  {
    icon: <Shield size={28} strokeWidth={1.4} />,
    titre: 'Harcèlement moral',
    sous: 'Protéger votre dignité et votre santé.',
    detail:
      'Harcèlement moral ou sexuel, discrimination, burn-out lié aux conditions de travail — le cabinet collecte les preuves, saisit les autorités compétentes et accompagne la victime tout au long de la procédure.',
  },
  {
    icon: <FileText size={28} strokeWidth={1.4} />,
    titre: 'Négociation & accords',
    sous: 'Sécuriser votre départ ou votre accord.',
    detail:
      "Rupture conventionnelle, accord de performance collective, Plan de Sauvegarde de l'Emploi — Maître Vidal négocie les meilleures conditions et rédige ou vérifie chaque clause avant signature.",
  },
];

function DomaineCard({ d, i }: { d: Domaine; i: number }) {
  const [hover, setHover] = useState(false);
  const card: React.CSSProperties = {
    background: hover ? C.bordeauxMid : C.bordeaux,
    border: `1px solid ${hover ? 'rgba(201,168,76,0.55)' : 'rgba(201,168,76,0.18)'}`,
    padding: 'clamp(30px,4vw,50px) clamp(26px,3.5vw,42px)',
    transform: hover ? 'translateY(-10px)' : 'none',
    boxShadow: hover
      ? '0 36px 72px -28px rgba(0,0,0,0.65)'
      : '0 12px 40px -28px rgba(0,0,0,0.5)',
    transition: 'all .6s cubic-bezier(.16,1,.3,1)',
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
            color: C.gold,
            marginBottom: 24,
            transition: 'transform .5s cubic-bezier(.16,1,.3,1)',
            transform: hover ? 'scale(1.1)' : 'none',
            display: 'inline-block',
          }}
        >
          {d.icon}
        </div>
        <h3
          style={{
            fontFamily: SERIF,
            fontSize: 'clamp(22px, 2.6vw, 32px)',
            fontWeight: 400,
            color: C.beige,
            margin: '0 0 12px',
            lineHeight: 1.12,
          }}
        >
          {d.titre}
        </h3>
        <p
          style={{
            fontFamily: SANS,
            fontSize: 13,
            letterSpacing: '0.04em',
            color: C.gold,
            margin: '0 0 18px',
            fontWeight: 500,
          }}
        >
          {d.sous}
        </p>
        <p
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 'clamp(15px, 1.5vw, 17px)',
            lineHeight: 1.72,
            color: 'rgba(242,234,216,0.74)',
            margin: '0 0 28px',
            flex: 1,
          }}
        >
          {d.detail}
        </p>
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
            transition: 'color .4s',
          }}
        >
          En savoir plus
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

function DomainesSection() {
  const sec: React.CSSProperties = {
    background: C.bordeauxDeep,
    padding: 'clamp(90px,13vw,180px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: 'clamp(22px,3vw,40px)',
    maxWidth: 1240,
    margin: '0 auto',
  };

  return (
    <section style={sec} id="domaines">
      <div style={{ maxWidth: 1240, margin: '0 auto 60px' }}>
        <Reveal>
          <Eyebrow>Domaines d'expertise</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(36px, 5.8vw, 78px)',
              fontWeight: 400,
              color: C.beige,
              margin: '20px 0 0',
              lineHeight: 1.04,
            }}
          >
            Trois piliers,{' '}
            <span style={{ fontStyle: 'italic', color: C.goldLight }}>
              un seul engagement
            </span>
          </h2>
        </Reveal>
      </div>
      <div style={grid}>
        {DOMAINES.map((d, i) => (
          <DomaineCard key={d.titre} d={d} i={i} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   4 · PROCESSUS — Photo avocate sticky à gauche, 4 étapes défilent à droite
   ════════════════════════════════════════════════════════════════════════════ */
type Etape = { num: string; titre: string; corps: string };

const ETAPES: Etape[] = [
  {
    num: '01',
    titre: 'Analyse de situation',
    corps:
      "Premier rendez-vous d'écoute — Maître Vidal examine vos contrats, correspondances et courriers de l'employeur. En 60 minutes, vous connaissez la solidité de votre dossier et les options juridiques disponibles.",
  },
  {
    num: '02',
    titre: 'Stratégie juridique',
    corps:
      "Le cabinet construit un plan d'action sur mesure : procédure à suivre, délais à respecter, pièces à rassembler, probabilités de succès selon les décisions prud'homales lyonnaises récentes.",
  },
  {
    num: '03',
    titre: 'Négociation amiable',
    corps:
      "Plus de 92 % des dossiers aboutissent à un accord amiable. Maître Vidal conduit les négociations avec l'employeur ou son conseil, et vous conseille sur chaque proposition avant signature.",
  },
  {
    num: '04',
    titre: 'Défense contentieuse',
    corps:
      "Si le litige va au Conseil de prud'hommes, Maître Vidal plaide votre cause avec la rigueur d'une avocate formée au contentieux social : conclusions détaillées, auditions de témoins, réplique aux exceptions de procédure.",
  },
];

function ProcessSection() {
  const sec: React.CSSProperties = {
    background: C.paper,
    padding: 'clamp(90px,12vw,170px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '0.9fr 1.1fr',
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
      <div style={grid} className="r286-processgrid">
        {/* Photo avocate sticky */}
        <div style={stickySide} className="r286-process-sticky">
          <Reveal y={50}>
            <div
              style={{
                overflow: 'hidden',
                border: `1px solid ${C.beigeDeep}`,
                aspectRatio: '4 / 5',
                boxShadow: '0 32px 72px -36px rgba(107,31,42,0.35)',
              }}
            >
              <img
                src={PHOTO.portrait}
                alt="Maître Clara Vidal, avocate en droit social à Lyon"
                loading="lazy"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div style={{ marginTop: 22 }}>
              <div
                style={{
                  fontFamily: SANS,
                  fontSize: 10.5,
                  letterSpacing: '0.24em',
                  textTransform: 'uppercase',
                  color: C.bordeaux,
                  marginBottom: 8,
                  fontWeight: 500,
                }}
              >
                Maître Clara Vidal
              </div>
              <div
                style={{
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  fontSize: 17,
                  color: 'rgba(30,26,23,0.76)',
                  lineHeight: 1.6,
                }}
              >
                « Mon rôle n'est pas seulement de plaider — c'est de vous redonner la maîtrise de votre situation. »
              </div>
            </div>
          </Reveal>
        </div>

        {/* Étapes défilantes */}
        <div>
          <Reveal>
            <Eyebrow color={C.bordeaux}>Notre approche</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(32px,5vw,64px)',
                fontWeight: 400,
                color: C.ink,
                margin: '20px 0 52px',
                lineHeight: 1.05,
              }}
            >
              Quatre étapes,{' '}
              <span style={{ fontStyle: 'italic', color: C.bordeaux }}>
                un accompagnement total
              </span>
            </h2>
          </Reveal>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {ETAPES.map((e, i) => (
              <Reveal key={e.num} delay={0.06 * i}>
                <div
                  style={{
                    padding: 'clamp(26px,3.5vw,40px) 0',
                    borderTop: `1px solid ${C.beigeDeep}`,
                    display: 'flex',
                    gap: 28,
                    alignItems: 'flex-start',
                  }}
                >
                  <span
                    style={{
                      fontFamily: SERIF,
                      fontStyle: 'italic',
                      fontSize: 32,
                      color: `rgba(201,168,76,0.55)`,
                      lineHeight: 1,
                      minWidth: 56,
                      flexShrink: 0,
                      paddingTop: 2,
                    }}
                  >
                    {e.num}
                  </span>
                  <div>
                    <h4
                      style={{
                        fontFamily: SERIF,
                        fontSize: 'clamp(20px,2.4vw,27px)',
                        fontWeight: 400,
                        color: C.ink,
                        margin: '0 0 12px',
                      }}
                    >
                      {e.titre}
                    </h4>
                    <p
                      style={{
                        fontFamily: SERIF,
                        fontStyle: 'italic',
                        fontSize: 'clamp(15px,1.5vw,17px)',
                        lineHeight: 1.74,
                        color: 'rgba(30,26,23,0.72)',
                        margin: 0,
                      }}
                    >
                      {e.corps}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.28}>
            <div style={{ marginTop: 36 }}>
              <a href="#contact" style={{ textDecoration: 'none' }}>
                <GoldButton filled>
                  Prendre rendez-vous
                </GoldButton>
              </a>
            </div>
          </Reveal>
        </div>
      </div>
      <style>{`
        @media (max-width: 860px){
          .r286-processgrid{ grid-template-columns: 1fr !important; }
          .r286-process-sticky{ position: static !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   5 · TÉMOIGNAGES — 3 cartes avec étoiles
   ════════════════════════════════════════════════════════════════════════════ */
type Temoignage = { quote: string; prenom: string; role: string; domaine: string };

const TEMOIGNAGES: Temoignage[] = [
  {
    quote:
      "Mon employeur m'avait licencié sans cause réelle ni sérieuse. Maître Vidal a démontré devant les prud'hommes l'absence de justification — j'ai obtenu 14 mois de salaire. Tout s'est déroulé avec une clarté et une efficacité remarquables.",
    prenom: 'Thomas L.',
    role: 'Cadre commercial',
    domaine: 'Licenciement abusif',
  },
  {
    quote:
      "Après deux ans de harcèlement moral de la part de mon manager, je ne savais plus quoi faire. Maître Vidal a constitué le dossier, saisi l'inspection du travail et obtenu une transaction qui m'a permis de partir avec dignité.",
    prenom: 'Sandrine M.',
    role: 'Responsable RH',
    domaine: 'Harcèlement moral',
  },
  {
    quote:
      "Je souhaitais négocier ma rupture conventionnelle mais l'employeur bloquait. Maître Vidal a repris les négociations et obtenu une indemnité deux fois supérieure à ce qu'on me proposait. Service impeccable, réponses rapides.",
    prenom: 'Julien B.',
    role: 'Ingénieur senior',
    domaine: 'Rupture conventionnelle',
  },
];

function TemoignageCard({ t, i }: { t: Temoignage; i: number }) {
  return (
    <Reveal delay={i * 0.11} style={{ height: '100%' }}>
      <figure
        style={{
          background: C.paper,
          border: `1px solid ${C.beigeDeep}`,
          padding: 'clamp(32px,4vw,50px)',
          margin: 0,
          height: '100%',
          boxSizing: 'border-box',
          boxShadow: '0 24px 60px -40px rgba(107,31,42,0.30)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 18,
          }}
        >
          <Quote size={30} color={C.gold} strokeWidth={1.2} />
          <span
            style={{
              fontFamily: SANS,
              fontSize: 10,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: C.bordeaux,
              fontWeight: 500,
              background: 'rgba(107,31,42,0.08)',
              padding: '5px 12px',
              border: `1px solid rgba(107,31,42,0.16)`,
            }}
          >
            {t.domaine}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
          {Array.from({ length: 5 }).map((_, s) => (
            <Star key={s} size={13} fill={C.gold} color={C.gold} strokeWidth={0} />
          ))}
        </div>
        <blockquote
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 'clamp(16px, 1.7vw, 19px)',
            lineHeight: 1.68,
            color: C.ink,
            margin: '0 0 28px',
            flex: 1,
          }}
        >
          "{t.quote}"
        </blockquote>
        <figcaption
          style={{
            borderTop: `1px solid ${C.beigeDeep}`,
            paddingTop: 18,
          }}
        >
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 18,
              color: C.bordeaux,
            }}
          >
            {t.prenom}
          </div>
          <div
            style={{
              fontFamily: SANS,
              fontSize: 11,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'rgba(30,26,23,0.50)',
              marginTop: 5,
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
    background: C.beige,
    padding: 'clamp(90px,12vw,170px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: 'clamp(24px,3.2vw,48px)',
    maxWidth: 1240,
    margin: '0 auto',
  };
  return (
    <section style={sec} id="temoignages">
      <div style={{ maxWidth: 1240, margin: '0 auto 60px', textAlign: 'center' }}>
        <Reveal>
          <Eyebrow color={C.bordeaux} align="center">
            Témoignages clients
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(32px,5.2vw,66px)',
              fontWeight: 400,
              color: C.ink,
              margin: '20px 0 0',
              lineHeight: 1.06,
            }}
          >
            Ils ont fait confiance{' '}
            <span style={{ fontStyle: 'italic', color: C.bordeaux }}>
              au cabinet
            </span>
          </h2>
        </Reveal>
      </div>
      <div style={grid}>
        {TEMOIGNAGES.map((t, i) => (
          <TemoignageCard key={t.prenom} t={t} i={i} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   6 · FORMULAIRE DE CONSULTATION — état envoyé personnalisé
   ════════════════════════════════════════════════════════════════════════════ */
type SituationType =
  | ''
  | 'licenciement'
  | 'harcelement'
  | 'rupture'
  | 'accident'
  | 'autre';

function ConsultationFormSection() {
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [situation, setSituation] = useState<SituationType>('');
  const [urgence, setUrgence] = useState<'oui' | 'non' | ''>('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!prenom.trim()) e.prenom = 'Requis';
    if (!nom.trim()) e.nom = 'Requis';
    if (!email.trim() || !email.includes('@')) e.email = 'Email invalide';
    if (!situation) e.situation = 'Requis';
    if (!urgence) e.urgence = 'Requis';
    return e;
  };

  const onSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    setSent(true);
  };

  const situationLabels: Record<string, string> = {
    licenciement: 'licenciement',
    harcelement: 'harcèlement moral',
    rupture: 'rupture conventionnelle',
    accident: 'accident du travail',
    autre: 'votre situation',
  };

  const sec: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    background: C.bordeauxDeep,
    padding: 'clamp(96px,13vw,180px) clamp(24px,6vw,96px)',
  };
  const fieldBase: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    background: 'transparent',
    border: 'none',
    borderBottom: `1px solid rgba(201,168,76,0.38)`,
    padding: '15px 2px',
    fontFamily: SERIF,
    fontSize: 17,
    color: C.beige,
    outline: 'none',
    transition: 'border-color .3s',
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
  const errorStyle: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 11,
    color: '#ff8080',
    marginTop: 4,
    display: 'block',
  };

  return (
    <section style={sec} id="contact">
      {/* Image de fond discrète */}
      <img
        src={PHOTO.tribunal}
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
          maxWidth: 720,
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <Reveal>
          <Eyebrow color={C.goldLight} align="center">
            Consultation juridique
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(36px,6vw,78px)',
              fontWeight: 400,
              color: C.beige,
              margin: '22px 0 18px',
              lineHeight: 1.04,
            }}
          >
            Décrivez{' '}
            <span style={{ fontStyle: 'italic', color: C.goldLight }}>
              votre situation
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
              color: 'rgba(242,234,216,0.82)',
              maxWidth: 540,
              margin: '0 auto 50px',
            }}
          >
            Première consultation sous 48 h. Confidentialité totale garantie.
            En cas d'urgence (convocation disciplinaire, mise à pied), signalez-le
            — le cabinet traitera votre dossier en priorité.
          </p>
        </Reveal>

        {sent ? (
          <Reveal>
            <div
              style={{
                border: `1px solid ${C.gold}`,
                padding: 'clamp(36px,5vw,56px)',
                background: 'rgba(201,168,76,0.06)',
              }}
            >
              <Scale size={36} color={C.goldLight} strokeWidth={1.2} />
              <h3
                style={{
                  fontFamily: SERIF,
                  fontSize: 'clamp(24px,3.5vw,34px)',
                  fontWeight: 400,
                  color: C.beige,
                  margin: '20px 0 14px',
                }}
              >
                Merci{prenom ? `, ${prenom}` : ''} — votre message est bien reçu.
              </h3>
              <p
                style={{
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  fontSize: 'clamp(15px,1.6vw,18px)',
                  color: 'rgba(242,234,216,0.80)',
                  lineHeight: 1.7,
                  margin: '0 0 10px',
                }}
              >
                Maître Vidal vous contactera dans les{' '}
                <strong style={{ color: C.goldLight, fontStyle: 'normal' }}>
                  48 heures
                </strong>{' '}
                concernant{' '}
                <strong style={{ color: C.goldLight, fontStyle: 'normal' }}>
                  {situationLabels[situation] ?? 'votre situation'}
                </strong>.
                {urgence === 'oui' && (
                  <span>
                    {' '}
                    Votre dossier a été marqué{' '}
                    <strong style={{ color: '#ff9999', fontStyle: 'normal' }}>
                      urgent
                    </strong>{' '}
                    — vous serez rappelé en priorité.
                  </span>
                )}
              </p>
              <p
                style={{
                  fontFamily: SANS,
                  fontSize: 12,
                  letterSpacing: '0.10em',
                  color: 'rgba(242,234,216,0.55)',
                  margin: '10px 0 0',
                }}
              >
                Un email de confirmation est envoyé à{' '}
                <span style={{ color: C.gold }}>{email}</span>.
              </p>
            </div>
          </Reveal>
        ) : (
          <Reveal delay={0.22}>
            <form
              onSubmit={onSubmit}
              style={{ display: 'flex', flexDirection: 'column', gap: 30, textAlign: 'left' }}
              noValidate
            >
              {/* Prénom + Nom */}
              <div
                style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}
                className="r286-namegrid"
              >
                <div>
                  <label style={labelStyle} htmlFor="v286-prenom">
                    Prénom
                  </label>
                  <input
                    id="v286-prenom"
                    style={{
                      ...fieldBase,
                      borderBottomColor: errors.prenom
                        ? '#ff8080'
                        : 'rgba(201,168,76,0.38)',
                    }}
                    value={prenom}
                    onChange={(e) => {
                      setPrenom(e.target.value);
                      setErrors((prev) => ({ ...prev, prenom: '' }));
                    }}
                    placeholder="Clara"
                    autoComplete="given-name"
                  />
                  {errors.prenom && (
                    <span style={errorStyle}>{errors.prenom}</span>
                  )}
                </div>
                <div>
                  <label style={labelStyle} htmlFor="v286-nom">
                    Nom
                  </label>
                  <input
                    id="v286-nom"
                    style={{
                      ...fieldBase,
                      borderBottomColor: errors.nom
                        ? '#ff8080'
                        : 'rgba(201,168,76,0.38)',
                    }}
                    value={nom}
                    onChange={(e) => {
                      setNom(e.target.value);
                      setErrors((prev) => ({ ...prev, nom: '' }));
                    }}
                    placeholder="Dupont"
                    autoComplete="family-name"
                  />
                  {errors.nom && <span style={errorStyle}>{errors.nom}</span>}
                </div>
              </div>

              {/* Email */}
              <div>
                <label style={labelStyle} htmlFor="v286-email">
                  Adresse e-mail
                </label>
                <input
                  id="v286-email"
                  style={{
                    ...fieldBase,
                    borderBottomColor: errors.email
                      ? '#ff8080'
                      : 'rgba(201,168,76,0.38)',
                  }}
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((prev) => ({ ...prev, email: '' }));
                  }}
                  placeholder="clara.dupont@email.fr"
                  autoComplete="email"
                />
                {errors.email && <span style={errorStyle}>{errors.email}</span>}
              </div>

              {/* Situation */}
              <div>
                <label style={labelStyle} htmlFor="v286-situation">
                  Votre situation
                </label>
                <select
                  id="v286-situation"
                  style={{
                    ...fieldBase,
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    cursor: 'pointer',
                    color: situation ? C.beige : 'rgba(242,234,216,0.42)',
                    borderBottomColor: errors.situation
                      ? '#ff8080'
                      : 'rgba(201,168,76,0.38)',
                  }}
                  value={situation}
                  onChange={(e) => {
                    setSituation(e.target.value as SituationType);
                    setErrors((prev) => ({ ...prev, situation: '' }));
                  }}
                >
                  <option value="" style={{ color: '#000' }}>
                    Choisir une situation…
                  </option>
                  <option value="licenciement" style={{ color: '#000' }}>
                    Licenciement (abusif, économique, disciplinaire)
                  </option>
                  <option value="harcelement" style={{ color: '#000' }}>
                    Harcèlement moral ou sexuel
                  </option>
                  <option value="rupture" style={{ color: '#000' }}>
                    Rupture conventionnelle
                  </option>
                  <option value="accident" style={{ color: '#000' }}>
                    Accident du travail / maladie professionnelle
                  </option>
                  <option value="autre" style={{ color: '#000' }}>
                    Autre — droit social
                  </option>
                </select>
                {errors.situation && (
                  <span style={errorStyle}>{errors.situation}</span>
                )}
              </div>

              {/* Urgence */}
              <div>
                <span style={labelStyle}>Situation urgente ?</span>
                <div style={{ display: 'flex', gap: 24, marginTop: 8 }}>
                  {(['oui', 'non'] as const).map((opt) => (
                    <label
                      key={opt}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        cursor: 'pointer',
                        fontFamily: SERIF,
                        fontSize: 16,
                        color: urgence === opt ? C.gold : 'rgba(242,234,216,0.65)',
                        transition: 'color .3s',
                      }}
                    >
                      <span
                        style={{
                          width: 18,
                          height: 18,
                          border: `1px solid ${urgence === opt ? C.gold : 'rgba(201,168,76,0.40)'}`,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'border-color .3s',
                          flexShrink: 0,
                        }}
                      >
                        {urgence === opt && (
                          <span
                            style={{
                              width: 9,
                              height: 9,
                              borderRadius: '50%',
                              background: C.gold,
                            }}
                          />
                        )}
                      </span>
                      <input
                        type="radio"
                        name="urgence"
                        value={opt}
                        checked={urgence === opt}
                        onChange={() => {
                          setUrgence(opt);
                          setErrors((prev) => ({ ...prev, urgence: '' }));
                        }}
                        style={{ display: 'none' }}
                      />
                      {opt === 'oui' ? 'Oui, convocation / mise à pied en cours' : 'Non, situation non urgente'}
                    </label>
                  ))}
                </div>
                {errors.urgence && (
                  <span style={errorStyle}>{errors.urgence}</span>
                )}
              </div>

              {/* Message */}
              <div>
                <label style={labelStyle} htmlFor="v286-message">
                  Votre message (facultatif)
                </label>
                <textarea
                  id="v286-message"
                  rows={4}
                  style={{
                    ...fieldBase,
                    resize: 'none',
                    borderBottom: 'none',
                    border: `1px solid rgba(201,168,76,0.38)`,
                    padding: '14px 16px',
                  }}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Décrivez brièvement votre situation…"
                />
              </div>

              <div style={{ textAlign: 'center', marginTop: 8 }}>
                <GoldButton filled type="submit">
                  Envoyer ma demande
                </GoldButton>
              </div>
            </form>
          </Reveal>
        )}
      </div>
      <style>{`
        @media (max-width: 860px){
          .r286-namegrid{ grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   7 · CHIFFRES CLÉS — 4 stats
   ════════════════════════════════════════════════════════════════════════════ */
type Stat = { valeur: string; label: string };

const STATS: Stat[] = [
  { valeur: '12 ans', label: "d'expérience en droit social" },
  { valeur: '+400', label: 'dossiers traités avec succès' },
  { valeur: '92%', label: 'de règlements amiables' },
  { valeur: '3', label: 'spécialités reconnues' },
];

function StatCard({ s, i }: { s: Stat; i: number }) {
  return (
    <Reveal delay={i * 0.10}>
      <div
        style={{
          textAlign: 'center',
          padding: 'clamp(30px,4vw,50px) clamp(20px,3vw,36px)',
          border: `1px solid rgba(201,168,76,0.18)`,
          background: 'rgba(255,255,255,0.04)',
        }}
      >
        <div
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 'clamp(38px,5vw,66px)',
            color: C.goldLight,
            lineHeight: 1,
            marginBottom: 12,
          }}
        >
          {s.valeur}
        </div>
        <div
          style={{
            fontFamily: SANS,
            fontSize: 11,
            letterSpacing: '0.20em',
            textTransform: 'uppercase',
            color: 'rgba(242,234,216,0.62)',
            lineHeight: 1.5,
          }}
        >
          {s.label}
        </div>
      </div>
    </Reveal>
  );
}

function StatsSection() {
  const sec: React.CSSProperties = {
    background: C.bordeaux,
    padding: 'clamp(80px,11vw,150px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 'clamp(18px,2.5vw,32px)',
    maxWidth: 1100,
    margin: '0 auto',
  };
  return (
    <section style={sec}>
      <div style={{ textAlign: 'center', maxWidth: 1100, margin: '0 auto 52px' }}>
        <Reveal>
          <Eyebrow color={C.gold} align="center">
            Le cabinet en chiffres
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(30px,4.8vw,60px)',
              fontWeight: 400,
              color: C.beige,
              margin: '18px 0 0',
              lineHeight: 1.06,
            }}
          >
            Un bilan qui{' '}
            <span style={{ fontStyle: 'italic', color: C.goldLight }}>
              parle pour lui-même
            </span>
          </h2>
        </Reveal>
      </div>
      <div style={grid}>
        {STATS.map((s, i) => (
          <StatCard key={s.label} s={s} i={i} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   8 · ACTUALITÉS DROIT SOCIAL — 3 articles
   ════════════════════════════════════════════════════════════════════════════ */
type Article = { date: string; categorie: string; titre: string; extrait: string };

const ARTICLES: Article[] = [
  {
    date: '15 juin 2026',
    categorie: 'Réforme',
    titre: "La réforme du Conseil de prud'hommes 2026 : ce qui change pour les salariés",
    extrait:
      'Les nouvelles dispositions issues de la loi du 3 mai 2026 modifient les délais de saisine et les conditions de conciliation. Maître Vidal fait le point sur les enjeux pour les dossiers en cours et à venir.',
  },
  {
    date: '2 mai 2026',
    categorie: 'Heures supplémentaires',
    titre: 'Heures supplémentaires non payées : comment les récupérer en 2026 ?',
    extrait:
      "Le décompte des heures supplémentaires reste l'une des sources de litige les plus fréquentes. Avec le développement du forfait-jours et du télétravail, les règles se complexifient. Tour d'horizon des recours disponibles.",
  },
  {
    date: '18 mars 2026',
    categorie: 'Télétravail',
    titre: 'Télétravail imposé et droits des salariés : que dit la loi ?',
    extrait:
      "L'employeur peut-il imposer le télétravail unilatéralement ? Quelle indemnité pour les frais engagés ? Quels recours en cas de refus abusif ? Maître Vidal répond aux questions les plus posées par ses clients.",
  },
];

function ArticleCard({ a, i }: { a: Article; i: number }) {
  const [hover, setHover] = useState(false);
  return (
    <Reveal delay={i * 0.11}>
      <article
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          background: C.paper,
          border: `1px solid ${hover ? 'rgba(107,31,42,0.40)' : C.beigeDeep}`,
          padding: 'clamp(28px,3.5vw,44px)',
          transition: 'border-color .4s, box-shadow .5s',
          boxShadow: hover
            ? '0 28px 60px -36px rgba(107,31,42,0.32)'
            : '0 10px 32px -28px rgba(107,31,42,0.18)',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
          }}
        >
          <span
            style={{
              fontFamily: SANS,
              fontSize: 10,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: C.bordeaux,
              fontWeight: 600,
              background: 'rgba(107,31,42,0.08)',
              padding: '4px 10px',
            }}
          >
            {a.categorie}
          </span>
          <span
            style={{
              fontFamily: SANS,
              fontSize: 11,
              letterSpacing: '0.10em',
              color: 'rgba(30,26,23,0.46)',
            }}
          >
            {a.date}
          </span>
        </div>
        <h3
          style={{
            fontFamily: SERIF,
            fontSize: 'clamp(18px,2.2vw,24px)',
            fontWeight: 400,
            color: C.ink,
            margin: '0 0 14px',
            lineHeight: 1.25,
            flex: 1,
          }}
        >
          {a.titre}
        </h3>
        <p
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 'clamp(14px,1.4vw,16px)',
            lineHeight: 1.7,
            color: 'rgba(30,26,23,0.64)',
            margin: '0 0 22px',
          }}
        >
          {a.extrait}
        </p>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 9,
            fontFamily: SANS,
            fontSize: 11,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: hover ? C.bordeauxMid : C.bordeaux,
            transition: 'color .4s',
          }}
        >
          Lire l'article
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

function ActualiteSection() {
  const sec: React.CSSProperties = {
    background: C.beige,
    padding: 'clamp(90px,12vw,170px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: 'clamp(22px,3vw,40px)',
    maxWidth: 1240,
    margin: '0 auto',
  };
  return (
    <section style={sec} id="actualites">
      <div style={{ maxWidth: 1240, margin: '0 auto 56px' }}>
        <Reveal>
          <Eyebrow color={C.bordeaux}>Actualités droit social</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(32px,5.2vw,64px)',
              fontWeight: 400,
              color: C.ink,
              margin: '18px 0 0',
              lineHeight: 1.06,
            }}
          >
            La loi évolue —{' '}
            <span style={{ fontStyle: 'italic', color: C.bordeaux }}>
              restez informé
            </span>
          </h2>
        </Reveal>
      </div>
      <div style={grid}>
        {ARTICLES.map((a, i) => (
          <ArticleCard key={a.titre} a={a} i={i} />
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   9 · INFORMATIONS PRATIQUES — adresse, honoraires, CARPA, aide juridictionnelle
   ════════════════════════════════════════════════════════════════════════════ */
type InfoBloc = { titre: string; lignes: React.ReactNode[] };

function PracticalSection() {
  const sec: React.CSSProperties = {
    background: C.dark,
    padding: 'clamp(80px,11vw,150px) clamp(24px,6vw,96px)',
  };
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 'clamp(36px,5vw,64px)',
    maxWidth: 1240,
    margin: '0 auto',
  };

  const BLOCS: InfoBloc[] = [
    {
      titre: 'Adresse',
      lignes: [
        <span key="a1" style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <MapPin size={16} color={C.gold} strokeWidth={1.5} style={{ flexShrink: 0, marginTop: 2 }} />
          <span>Cabinet Vidal — Droit Social<br />14, quai Perrache<br />69002 Lyon Confluence</span>
        </span>,
        <span key="a2" style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12 }}>
          <Phone size={16} color={C.gold} strokeWidth={1.5} style={{ flexShrink: 0 }} />
          <a
            href="tel:+33472000000"
            style={{ color: 'inherit', textDecoration: 'none' }}
          >
            04 72 00 00 00
          </a>
        </span>,
        <span key="a3" style={{ display: 'block', marginTop: 8 }}>
          Accès : Métro A/D — Perrache<br />Parking Confluence disponible
        </span>,
      ],
    },
    {
      titre: 'Permanence téléphonique',
      lignes: [
        <span key="p1">Lundi – vendredi : 9h00 – 19h00</span>,
        <span key="p2" style={{ display: 'block', marginTop: 8 }}>
          Urgences disciplinaires :<br />
          <strong style={{ color: C.gold }}>7j/7 sur rendez-vous téléphonique</strong>
        </span>,
        <span key="p3" style={{ display: 'block', marginTop: 8 }}>
          Consultations en visioconférence disponibles pour les clients hors Lyon.
        </span>,
      ],
    },
    {
      titre: 'Honoraires & devis',
      lignes: [
        <span key="h1">Première consultation : <strong style={{ color: C.gold }}>150 € TTC (60 min)</strong></span>,
        <span key="h2" style={{ display: 'block', marginTop: 8 }}>
          Honoraires au forfait ou à l'heure selon la nature du dossier.
          Devis écrit systématique avant toute mission.
        </span>,
        <span key="h3" style={{ display: 'block', marginTop: 8 }}>
          <strong style={{ color: C.goldLight }}>Règlement CARPA</strong> — fonds clients sécurisés via la Caisse des Règlements Pécuniaires des Avocats du Barreau de Lyon.
        </span>,
      ],
    },
    {
      titre: 'Aide juridictionnelle',
      lignes: [
        <span key="aj1">
          Maître Vidal accepte les missions au titre de l'aide juridictionnelle totale et partielle.
        </span>,
        <span key="aj2" style={{ display: 'block', marginTop: 8 }}>
          Plafonds 2026 :<br />
          <strong style={{ color: C.gold }}>AJ totale</strong> — revenus mensuels &lt; 1 123 €<br />
          <strong style={{ color: C.gold }}>AJ partielle</strong> — revenus entre 1 123 € et 1 685 €
        </span>,
        <span key="aj3" style={{ display: 'block', marginTop: 8 }}>
          Constitution du dossier accompagnée par le cabinet sur demande.
        </span>,
      ],
    },
  ];

  return (
    <section style={sec} id="pratique">
      <div style={{ maxWidth: 1240, margin: '0 auto 56px', textAlign: 'center' }}>
        <Reveal>
          <Eyebrow color={C.gold} align="center">
            Informations pratiques
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(30px,4.6vw,58px)',
              fontWeight: 400,
              color: C.beige,
              margin: '18px 0 0',
              lineHeight: 1.06,
            }}
          >
            Tout ce qu'il faut savoir{' '}
            <span style={{ fontStyle: 'italic', color: C.goldLight }}>
              avant de nous appeler
            </span>
          </h2>
        </Reveal>
      </div>
      <div style={grid}>
        {BLOCS.map((b, i) => (
          <Reveal key={b.titre} delay={i * 0.10}>
            <div
              style={{
                borderTop: `2px solid ${C.gold}`,
                paddingTop: 28,
              }}
            >
              <h3
                style={{
                  fontFamily: SANS,
                  fontSize: 12,
                  letterSpacing: '0.26em',
                  textTransform: 'uppercase',
                  color: C.gold,
                  margin: '0 0 20px',
                  fontWeight: 600,
                }}
              >
                {b.titre}
              </h3>
              <div
                style={{
                  fontFamily: SERIF,
                  fontSize: 'clamp(14px,1.4vw,16px)',
                  lineHeight: 1.72,
                  color: 'rgba(242,234,216,0.72)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0,
                }}
              >
                {b.lignes.map((l, li) => (
                  <React.Fragment key={li}>{l}</React.Fragment>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   10 · PIED DE PAGE — Logo Cabinet Vidal, Barreau de Lyon, mentions légales
   ════════════════════════════════════════════════════════════════════════════ */
function FooterSection() {
  const cols: { titre: string; items: { label: string; href: string }[] }[] = [
    {
      titre: 'Domaines',
      items: [
        { label: 'Licenciement & rupture', href: '#domaines' },
        { label: 'Harcèlement moral', href: '#domaines' },
        { label: 'Négociation & accords', href: '#domaines' },
        { label: 'Accident du travail', href: '#domaines' },
      ],
    },
    {
      titre: 'Le cabinet',
      items: [
        { label: 'Notre approche', href: '#processus' },
        { label: 'Témoignages', href: '#temoignages' },
        { label: 'Actualités', href: '#actualites' },
        { label: 'Informations pratiques', href: '#pratique' },
      ],
    },
    {
      titre: 'Contact',
      items: [
        { label: 'Consultation urgente', href: '#contact' },
        { label: 'Prise de rendez-vous', href: '#contact' },
        { label: 'Aide juridictionnelle', href: '#pratique' },
        { label: 'Honoraires & devis', href: '#pratique' },
      ],
    },
  ];

  const foot: React.CSSProperties = {
    background: C.bordeauxDeep,
    borderTop: `1px solid rgba(201,168,76,0.18)`,
    padding: 'clamp(70px,9vw,110px) clamp(24px,6vw,96px) 40px',
  };

  return (
    <footer style={foot}>
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.5fr repeat(3, 1fr)',
          gap: 'clamp(32px,4.5vw,64px)',
        }}
        className="r286-footgrid"
      >
        {/* Bloc identité cabinet */}
        <div>
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 24,
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: C.beige,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <Scale size={20} color={C.gold} strokeWidth={1.4} />
            Cabinet Vidal
          </div>
          <p
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: 15,
              lineHeight: 1.72,
              color: 'rgba(242,234,216,0.62)',
              marginTop: 18,
              maxWidth: 320,
            }}
          >
            Maître Clara Vidal — Avocate inscrite au Barreau de Lyon. Spécialiste
            en droit social et droit du travail depuis 2012.
          </p>
          {/* Barreau de Lyon */}
          <div
            style={{
              marginTop: 24,
              padding: '14px 18px',
              border: `1px solid rgba(201,168,76,0.22)`,
              display: 'inline-flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            <span
              style={{
                fontFamily: SANS,
                fontSize: 9.5,
                letterSpacing: '0.26em',
                textTransform: 'uppercase',
                color: C.gold,
                fontWeight: 600,
              }}
            >
              Membre du
            </span>
            <span
              style={{
                fontFamily: SERIF,
                fontSize: 15,
                color: C.beige,
                letterSpacing: '0.10em',
              }}
            >
              Barreau de Lyon
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginTop: 22,
              fontFamily: SANS,
              fontSize: 11,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'rgba(242,234,216,0.54)',
            }}
          >
            <MapPin size={13} color={C.gold} strokeWidth={1.5} />
            14, quai Perrache · Lyon 69002
          </div>
        </div>

        {/* Colonnes de liens */}
        {cols.map((c) => (
          <div key={c.titre}>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 10.5,
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                color: C.gold,
                marginBottom: 20,
                fontWeight: 600,
              }}
            >
              {c.titre}
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
                      fontFamily: SERIF,
                      fontSize: 15.5,
                      color: 'rgba(242,234,216,0.68)',
                      textDecoration: 'none',
                      transition: 'color .3s',
                    }}
                    onMouseEnter={(e) =>
                      ((e.target as HTMLElement).style.color = C.gold)
                    }
                    onMouseLeave={(e) =>
                      ((e.target as HTMLElement).style.color =
                        'rgba(242,234,216,0.68)')
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

      {/* Barre du bas — mentions légales */}
      <div
        style={{
          maxWidth: 1240,
          margin: '64px auto 0',
          paddingTop: 26,
          borderTop: `1px solid rgba(201,168,76,0.14)`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
          fontFamily: SANS,
          fontSize: 11,
          letterSpacing: '0.10em',
          color: 'rgba(242,234,216,0.46)',
        }}
      >
        <span>
          © 2026 Cabinet Vidal — Maître Clara Vidal, Avocate. Tous droits réservés.
        </span>
        <span style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
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
            Cookies
          </a>
          <a
            href="#hero"
            style={{ color: 'inherit', textDecoration: 'none' }}
          >
            Déontologie
          </a>
        </span>
      </div>
      <style>{`
        @media (max-width: 860px){
          .r286-footgrid{ grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 560px){
          .r286-footgrid{ grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   PAGE PRINCIPALE — Impact286Page
   ════════════════════════════════════════════════════════════════════════════ */
export default function Impact286Page() {
  const root: React.CSSProperties = {
    background: C.bordeauxDeep,
    color: C.beige,
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
      <DomainesSection />
      <ProcessSection />
      <TestimonialsSection />
      <ConsultationFormSection />
      <StatsSection />
      <ActualiteSection />
      <PracticalSection />
      <FooterSection />
    </main>
  );
}
