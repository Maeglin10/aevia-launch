'use client';

import React, { useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
} from 'framer-motion';
import {
  Scale,
  Home,
  Users,
  ArrowRight,
  Star,
  MapPin,
  Phone,
  Mail,
  Clock,
  ChevronDown,
  BookOpen,
  FileText,
  Shield,
  CheckCircle,
  Quote,
} from 'lucide-react';

/* ════════════════════════════════════════════════════════════════════════════
   CABINET FAURE — Maître Isabelle Faure · Avocate droit de la famille & succession
   Marseille 6e · Barreau de Marseille
   Photographie réelle + chorégraphie de défilement éditoriale.
   Auto-suffisant. 'use client'.
   ════════════════════════════════════════════════════════════════════════════ */

/* ── Palette ─────────────────────────────────────────────────────────────── */
const C = {
  marine: '#1a3a5c',
  marineDark: '#112640',
  marineMid: '#22487a',
  gold: '#c9a84c',
  goldLight: '#dbbe74',
  goldPale: '#f0e0a8',
  white: '#f9f7f2',
  warm: '#e8e4dc',
  warmDark: '#d8d2c6',
  ink: '#0f1f30',
  textBody: '#3a4a5a',
  textMuted: '#6b7c8d',
} as const;

const SERIF = "'Playfair Display', Georgia, serif" as const;
const SANS = 'Raleway, system-ui, sans-serif' as const;

/* ── Photos Unsplash ─────────────────────────────────────────────────────── */
const PHOTO = {
  tribunal:
    'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=1600&auto=format&fit=crop',
  bureau:
    'https://images.unsplash.com/photo-1521791055366-0d553872952f?q=80&w=1600&auto=format&fit=crop',
  reunion:
    'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1600&auto=format&fit=crop',
  avocate:
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1600&auto=format&fit=crop',
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
  dark = false,
}: {
  children: React.ReactNode;
  color?: string;
  align?: 'left' | 'center';
  dark?: boolean;
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
    padding: '15px 32px',
    fontFamily: SANS,
    fontSize: 12,
    letterSpacing: '0.26em',
    textTransform: 'uppercase',
    fontWeight: 600,
    cursor: 'pointer',
    border: `1px solid ${C.gold}`,
    background: filled ? C.gold : 'transparent',
    color: filled ? C.marineDark : C.gold,
    transition: 'all .5s cubic-bezier(.16,1,.3,1)',
    textDecoration: 'none',
  };
  const hov: React.CSSProperties = hover
    ? filled
      ? { background: C.goldLight, transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(201,168,76,0.28)' }
      : { background: 'rgba(201,168,76,0.10)', transform: 'translateY(-2px)' }
    : {};

  const content = (
    <>
      {children}
      <ArrowRight
        size={15}
        style={{
          transform: hover ? 'translateX(5px)' : 'none',
          transition: 'transform .5s cubic-bezier(.16,1,.3,1)',
        }}
      />
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{ ...base, ...hov }}
      >
        {content}
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
      {content}
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
    { label: 'Expertises', href: '#expertises' },
    { label: 'Notre approche', href: '#process' },
    { label: 'Témoignages', href: '#temoignages' },
    { label: 'Publications', href: '#publications' },
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
    padding: solid ? '16px clamp(20px,5vw,64px)' : '26px clamp(20px,5vw,64px)',
    background: solid ? 'rgba(17,38,64,0.94)' : 'transparent',
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
    letterSpacing: '0.12em',
    color: C.white,
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  };
  const sub: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 9.5,
    letterSpacing: '0.30em',
    color: C.gold,
    textTransform: 'uppercase',
    fontWeight: 500,
    marginTop: 2,
    display: 'block',
  };
  const linkRow: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'clamp(18px,2.2vw,36px)',
  };

  return (
    <nav style={bar}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={brand}>
          <Scale size={18} color={C.gold} strokeWidth={1.4} />
          Cabinet Faure
        </span>
        <span style={sub}>Avocate · Marseille</span>
      </div>
      <div style={linkRow} className="r275-navlinks">
        {links.map((l) => (
          <NavLink key={l.label} label={l.label} href={l.href} />
        ))}
      </div>
      <div className="r275-navcta">
        <GoldButton filled href="#contact">
          Consultation
        </GoldButton>
      </div>
      <style>{`
        @media (max-width: 860px){
          .r275-navlinks{ display:none !important; }
          .r275-navcta{ display:none !important; }
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
        color: h ? C.gold : C.white,
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
   1 · HERO — Bibliothèque juridique en fond, titre conviction
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
  const titleOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.20], [1, 0]);

  const heroWrap: React.CSSProperties = {
    position: 'relative',
    height: '100vh',
    minHeight: 680,
    overflow: 'hidden',
    background: C.marineDark,
  };

  const overlay: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    background: `linear-gradient(
      to bottom,
      rgba(17,38,64,0.52) 0%,
      rgba(17,38,64,0.30) 40%,
      rgba(17,38,64,0.72) 80%,
      rgba(17,38,64,0.95) 100%
    )`,
    zIndex: 2,
  };

  const content: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    zIndex: 3,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'clamp(100px,14vw,160px) clamp(24px,8vw,120px) 80px',
    textAlign: 'center',
  };

  return (
    <section ref={ref} style={heroWrap} id="hero">
      {/* Photo parallaxe */}
      <motion.div
        style={{
          position: 'absolute',
          inset: '-10%',
          scale: imgScale,
          y: imgY,
          zIndex: 1,
        }}
      >
        <img
          src={PHOTO.tribunal}
          alt="Bibliothèque juridique, Cabinet Faure Marseille"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          loading="eager"
        />
      </motion.div>

      {/* Overlay dégradé */}
      <div style={overlay} />

      {/* Filigrane décoratif — colonne gauche */}
      <div
        style={{
          position: 'absolute',
          left: 'clamp(20px,4vw,56px)',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
        }}
        className="r275-hero-side"
      >
        <div style={{ width: 1, height: 80, background: `rgba(201,168,76,0.50)` }} />
        <span
          style={{
            fontFamily: SANS,
            fontSize: 10,
            letterSpacing: '0.34em',
            color: `rgba(201,168,76,0.70)`,
            textTransform: 'uppercase',
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
          }}
        >
          Marseille 6e · Barreau de Marseille
        </span>
        <div style={{ width: 1, height: 80, background: `rgba(201,168,76,0.50)` }} />
      </div>

      {/* Contenu principal */}
      <motion.div style={{ y: titleY, opacity: titleOpacity, ...content }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, ease: EASE, delay: 0.2 }}
          style={{ marginBottom: 28 }}
        >
          <Eyebrow color={C.gold} align="center">
            Cabinet d'avocats · Droit de la famille
          </Eyebrow>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.42 }}
          style={{
            fontFamily: SERIF,
            fontSize: 'clamp(38px,6.5vw,84px)',
            fontWeight: 700,
            color: C.white,
            lineHeight: 1.08,
            letterSpacing: '-0.01em',
            maxWidth: 860,
            margin: '0 auto 24px',
          }}
        >
          Votre droit défendu{' '}
          <em style={{ color: C.gold, fontStyle: 'italic' }}>avec conviction</em>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.62 }}
          style={{
            fontFamily: SANS,
            fontSize: 'clamp(16px,1.8vw,20px)',
            color: 'rgba(249,247,242,0.82)',
            maxWidth: 580,
            margin: '0 auto 48px',
            lineHeight: 1.65,
            fontWeight: 400,
          }}
        >
          Maître Isabelle Faure accompagne familles et particuliers dans les moments
          les plus délicats de la vie. Divorce, succession, garde — avec rigueur et
          humanité.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, ease: EASE, delay: 0.80 }}
          style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <GoldButton filled href="#contact">
            Prendre rendez-vous
          </GoldButton>
          <GoldButton href="#expertises">
            Nos expertises
          </GoldButton>
        </motion.div>
      </motion.div>

      {/* Indicateur de défilement */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: 42,
          left: '50%',
          translateX: '-50%',
          zIndex: 5,
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
            letterSpacing: '0.32em',
            color: 'rgba(249,247,242,0.60)',
            textTransform: 'uppercase',
          }}
        >
          Découvrir
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.0, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={20} color="rgba(201,168,76,0.80)" strokeWidth={1.5} />
        </motion.div>
      </motion.div>

      {/* Badges stats rapides en bas */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 4,
          background: 'rgba(17,38,64,0.88)',
          backdropFilter: 'blur(12px)',
          borderTop: `1px solid rgba(201,168,76,0.18)`,
          display: 'flex',
          justifyContent: 'center',
          gap: 'clamp(24px,5vw,80px)',
          padding: '18px clamp(20px,5vw,60px)',
        }}
        className="r275-hero-stats"
      >
        {[
          { val: '15 ans', label: "d'expérience" },
          { val: '+500', label: 'dossiers traités' },
          { val: '94%', label: 'de satisfaction' },
        ].map((s) => (
          <div key={s.val} style={{ textAlign: 'center' }}>
            <div
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(20px,2.4vw,28px)',
                color: C.gold,
                fontWeight: 700,
                lineHeight: 1,
              }}
            >
              {s.val}
            </div>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 11,
                color: 'rgba(249,247,242,0.64)',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                marginTop: 4,
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 860px){
          .r275-hero-side{ display:none !important; }
          .r275-hero-stats{ gap: 20px !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   2 · SCROLL CROSSFADE — 3 visuels en sticky + progress dots
   ════════════════════════════════════════════════════════════════════════════ */
function ScrollCrossfade() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  const opacity1 = useTransform(scrollYProgress, [0, 0.25, 0.40], [1, 1, 0]);
  const opacity2 = useTransform(scrollYProgress, [0.30, 0.45, 0.62, 0.75], [0, 1, 1, 0]);
  const opacity3 = useTransform(scrollYProgress, [0.65, 0.80, 1.0], [0, 1, 1]);

  const scale1 = useTransform(scrollYProgress, [0, 0.40], [1.0, 1.08]);
  const scale2 = useTransform(scrollYProgress, [0.30, 0.75], [1.0, 1.08]);
  const scale3 = useTransform(scrollYProgress, [0.65, 1.0], [1.0, 1.06]);

  const dot1 = useTransform(scrollYProgress, [0, 0.33], [1, 0]);
  const dot2 = useTransform(scrollYProgress, [0.25, 0.50, 0.67], [0, 1, 0]);
  const dot3 = useTransform(scrollYProgress, [0.60, 0.80], [0, 1]);

  const slides = [
    {
      photo: PHOTO.tribunal,
      alt: 'Salle d\'audience, Palais de Justice de Marseille',
      eyebrow: 'Plaidoirie',
      title: 'La salle d\'audience',
      text: 'Maître Faure plaide avec une rigueur sans faille devant les juridictions marseillaises. Chaque argument est préparé, pesé, défendu avec la conviction que votre dossier mérite.',
      opacity: opacity1,
      scale: scale1,
    },
    {
      photo: PHOTO.bureau,
      alt: 'Bureau de l\'avocat, Cabinet Faure Marseille',
      eyebrow: 'Conseil',
      title: 'Un cabinet à votre écoute',
      text: 'Dans le cadre feutré du cabinet, votre situation est analysée avec précision. Chaque dossier est unique — nous prenons le temps de comprendre vos enjeux humains autant que juridiques.',
      opacity: opacity2,
      scale: scale2,
    },
    {
      photo: PHOTO.reunion,
      alt: 'Réunion avec le client, Cabinet Faure',
      eyebrow: 'Accompagnement',
      title: 'La réunion client',
      text: 'La stratégie se construit ensemble. Maître Faure vous explique chaque étape, clarifie les options et vous accompagne dans chaque décision — sans jargon, avec transparence.',
      opacity: opacity3,
      scale: scale3,
    },
  ];

  const wrapStyle: React.CSSProperties = {
    position: 'relative',
    height: '320vh',
    background: C.marineDark,
  };

  const sticky: React.CSSProperties = {
    position: 'sticky',
    top: 0,
    height: '100vh',
    overflow: 'hidden',
  };

  return (
    <div ref={ref} style={wrapStyle}>
      <div style={sticky}>
        {/* Images empilées */}
        {slides.map((s, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: s.opacity,
            }}
          >
            <motion.img
              src={s.photo}
              alt={s.alt}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                scale: s.scale,
              }}
              loading="lazy"
            />
            {/* Overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `linear-gradient(
                  to right,
                  rgba(17,38,64,0.88) 0%,
                  rgba(17,38,64,0.60) 50%,
                  rgba(17,38,64,0.22) 100%
                )`,
              }}
            />
          </motion.div>
        ))}

        {/* Texte superposé */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            zIndex: 10,
            padding: 'clamp(32px,8vw,120px)',
          }}
        >
          <div style={{ maxWidth: 560 }}>
            {slides.map((s, i) => {
              const txtOpacity = i === 0 ? opacity1 : i === 1 ? opacity2 : opacity3;
              return (
                <motion.div
                  key={i}
                  style={{
                    position: i === 0 ? 'relative' : 'absolute',
                    top: i === 0 ? undefined : 0,
                    left: i === 0 ? undefined : 0,
                    right: i === 0 ? undefined : 0,
                    opacity: txtOpacity,
                    padding: i !== 0 ? 'clamp(32px,8vw,120px)' : undefined,
                    maxWidth: i !== 0 ? 560 : undefined,
                  }}
                >
                  <Eyebrow color={C.gold}>{s.eyebrow}</Eyebrow>
                  <h2
                    style={{
                      fontFamily: SERIF,
                      fontSize: 'clamp(32px,4.5vw,58px)',
                      color: C.white,
                      fontWeight: 700,
                      lineHeight: 1.12,
                      margin: '20px 0 20px',
                    }}
                  >
                    {s.title}
                  </h2>
                  <p
                    style={{
                      fontFamily: SANS,
                      fontSize: 'clamp(15px,1.4vw,18px)',
                      color: 'rgba(249,247,242,0.82)',
                      lineHeight: 1.70,
                    }}
                  >
                    {s.text}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Progress dots */}
        <div
          style={{
            position: 'absolute',
            right: 'clamp(20px,4vw,56px)',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 11,
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          {[dot1, dot2, dot3].map((dotOpacity, i) => (
            <motion.div
              key={i}
              style={{ position: 'relative', width: 10, height: 10 }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  border: `1px solid rgba(201,168,76,0.50)`,
                }}
              />
              <motion.div
                style={{
                  position: 'absolute',
                  inset: 2,
                  borderRadius: '50%',
                  background: C.gold,
                  opacity: dotOpacity,
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* Numéro de slide décoratif */}
        {slides.map((s, i) => {
          const numOpacity = i === 0 ? opacity1 : i === 1 ? opacity2 : opacity3;
          return (
            <motion.div
              key={i}
              style={{
                position: 'absolute',
                bottom: 'clamp(20px,4vw,56px)',
                left: 'clamp(32px,8vw,120px)',
                zIndex: 11,
                opacity: numOpacity,
                fontFamily: SERIF,
                fontSize: 'clamp(64px,10vw,120px)',
                color: 'rgba(201,168,76,0.10)',
                fontWeight: 700,
                lineHeight: 1,
                userSelect: 'none',
              }}
            >
              0{i + 1}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   3 · EXPERTISES — 3 domaines avec icônes lucide-react
   ════════════════════════════════════════════════════════════════════════════ */
function ExpertiseSection() {
  const expertises = [
    {
      icon: Scale,
      title: 'Divorce & Séparation',
      sub: 'Procédure judiciaire et à l\'amiable',
      desc: 'Divorce par consentement mutuel, contentieux, séparation de corps, liquidation du régime matrimonial. Maître Faure défend vos intérêts tout en préservant l\'équilibre familial.',
      items: [
        'Divorce amiable (consentement mutuel)',
        'Divorce contentieux',
        'Prestation compensatoire',
        'Partage des biens immobiliers',
        'Convention de divorce homologuée',
      ],
    },
    {
      icon: Home,
      title: 'Succession & Héritage',
      sub: 'Anticipation et règlement de succession',
      desc: 'Rédaction de testaments, règlement de successions complexes, partage amiable ou judiciaire, contestation de testament. Une expertise reconnue pour sécuriser votre patrimoine.',
      items: [
        'Rédaction de testament',
        'Succession internationale',
        'Déclaration de succession',
        'Partage de l\'indivision',
        'Contestation et action en réduction',
      ],
    },
    {
      icon: Users,
      title: 'Droit de la Famille',
      sub: 'Protection de l\'enfant et de la famille',
      desc: 'Autorité parentale, résidence des enfants, pension alimentaire, adoption, tutelle. Le cabinet place la protection des plus vulnérables au cœur de chaque dossier.',
      items: [
        'Garde et résidence des enfants',
        'Pension alimentaire',
        'Adoption plénière et simple',
        'Tutelle et curatelle',
        'Violence intrafamiliale',
      ],
    },
  ];

  const [activeCard, setActiveCard] = useState<number | null>(null);

  return (
    <section
      id="expertises"
      style={{
        background: C.white,
        padding: 'clamp(72px,10vw,128px) clamp(20px,6vw,80px)',
      }}
    >
      <Reveal>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(48px,6vw,80px)' }}>
          <Eyebrow color={C.marine} align="center">
            Domaines d'expertise
          </Eyebrow>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(32px,4.5vw,56px)',
              color: C.marine,
              fontWeight: 700,
              lineHeight: 1.12,
              margin: '20px auto 18px',
              maxWidth: 700,
            }}
          >
            Trois piliers, une seule conviction
          </h2>
          <p
            style={{
              fontFamily: SANS,
              fontSize: 'clamp(15px,1.4vw,18px)',
              color: C.textBody,
              maxWidth: 580,
              margin: '0 auto',
              lineHeight: 1.65,
            }}
          >
            Le cabinet intervient sur les trois domaines fondamentaux du droit de
            la famille, avec la même exigence et le même engagement humain.
          </p>
        </div>
      </Reveal>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))',
          gap: 28,
          maxWidth: 1200,
          margin: '0 auto',
        }}
      >
        {expertises.map((exp, i) => {
          const Icon = exp.icon;
          const active = activeCard === i;
          return (
            <Reveal key={i} delay={i * 0.12}>
              <div
                onMouseEnter={() => setActiveCard(i)}
                onMouseLeave={() => setActiveCard(null)}
                style={{
                  background: active ? C.marine : C.white,
                  border: `1px solid ${active ? C.marine : C.warm}`,
                  padding: 'clamp(28px,3.5vw,48px)',
                  transition: 'all .5s cubic-bezier(.16,1,.3,1)',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Numéro décoratif */}
                <div
                  style={{
                    position: 'absolute',
                    top: 16,
                    right: 20,
                    fontFamily: SERIF,
                    fontSize: 72,
                    fontWeight: 700,
                    color: active ? 'rgba(201,168,76,0.12)' : 'rgba(26,58,92,0.06)',
                    lineHeight: 1,
                    userSelect: 'none',
                    transition: 'color .5s',
                  }}
                >
                  0{i + 1}
                </div>

                {/* Icône */}
                <div
                  style={{
                    width: 56,
                    height: 56,
                    background: active ? 'rgba(201,168,76,0.18)' : C.warm,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 24,
                    transition: 'background .5s',
                  }}
                >
                  <Icon
                    size={24}
                    color={active ? C.gold : C.marine}
                    strokeWidth={1.4}
                    style={{ transition: 'color .5s' }}
                  />
                </div>

                {/* Texte */}
                <div
                  style={{
                    fontFamily: SANS,
                    fontSize: 11,
                    letterSpacing: '0.28em',
                    textTransform: 'uppercase',
                    color: active ? C.gold : C.textMuted,
                    marginBottom: 10,
                    fontWeight: 600,
                    transition: 'color .5s',
                  }}
                >
                  {exp.sub}
                </div>
                <h3
                  style={{
                    fontFamily: SERIF,
                    fontSize: 'clamp(22px,2.2vw,28px)',
                    color: active ? C.white : C.marine,
                    fontWeight: 700,
                    margin: '0 0 16px',
                    lineHeight: 1.18,
                    transition: 'color .5s',
                  }}
                >
                  {exp.title}
                </h3>
                <p
                  style={{
                    fontFamily: SANS,
                    fontSize: 15,
                    color: active ? 'rgba(249,247,242,0.80)' : C.textBody,
                    lineHeight: 1.65,
                    marginBottom: 24,
                    transition: 'color .5s',
                  }}
                >
                  {exp.desc}
                </p>

                {/* Liste de prestations */}
                <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                  {exp.items.map((item, j) => (
                    <li
                      key={j}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        fontFamily: SANS,
                        fontSize: 13.5,
                        color: active ? 'rgba(249,247,242,0.75)' : C.textBody,
                        padding: '6px 0',
                        borderBottom: `1px solid ${active ? 'rgba(201,168,76,0.15)' : 'rgba(26,58,92,0.08)'}`,
                        transition: 'all .5s',
                      }}
                    >
                      <CheckCircle
                        size={13}
                        color={C.gold}
                        strokeWidth={2}
                        style={{ flexShrink: 0 }}
                      />
                      {item}
                    </li>
                  ))}
                </ul>

                {/* Flèche en bas à droite */}
                <div
                  style={{
                    marginTop: 28,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontFamily: SANS,
                    fontSize: 11.5,
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: C.gold,
                    fontWeight: 600,
                  }}
                >
                  En savoir plus
                  <ArrowRight
                    size={14}
                    color={C.gold}
                    style={{
                      transform: active ? 'translateX(4px)' : 'none',
                      transition: 'transform .4s',
                    }}
                  />
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   4 · PROCESS — Left sticky photo avocate + right scroll 4 étapes
   ════════════════════════════════════════════════════════════════════════════ */
function ProcessSection() {
  const steps = [
    {
      num: '01',
      title: 'Premier entretien',
      sub: 'Écoute et diagnostic',
      desc: 'La première consultation dure en général 60 à 90 minutes. Vous exposez votre situation en toute confidentialité. Maître Faure analyse vos droits, identifie les risques et répond à toutes vos questions sans jargon.',
      detail: 'Tarif fixe · Rendez-vous disponible sous 48h · Visio ou présentiel',
    },
    {
      num: '02',
      title: 'Analyse du dossier',
      sub: 'Constitution et étude des pièces',
      desc: 'Toutes les pièces utiles sont rassemblées : actes d\'état civil, titres de propriété, contrat de mariage, relevés bancaires. Chaque élément est passé au crible pour construire votre stratégie sur des bases solides.',
      detail: 'Devis honoraires transmis par écrit · Convention d\'honoraires signée',
    },
    {
      num: '03',
      title: 'Stratégie juridique',
      sub: 'Construction du plan d\'action',
      desc: 'En fonction des objectifs et des contraintes, Maître Faure définit la stratégie : négociation amiable, médiation familiale ou procédure judiciaire. Chaque option est expliquée avec ses avantages, ses risques et ses délais.',
      detail: 'Réunion de stratégie · Calendrier de procédure · Communication régulière',
    },
    {
      num: '04',
      title: 'Défense active',
      sub: 'Plaidoirie et suivi jusqu\'à l\'issue',
      desc: 'Rédaction des actes, assignations, conclusions, plaidoiries devant le Tribunal Judiciaire de Marseille et les cours d\'appel. Le cabinet vous tient informé à chaque étape et répond à vos messages dans les 24h ouvrées.',
      detail: 'Compte rendu après chaque audience · Accès sécurisé à votre dossier',
    },
  ];

  return (
    <section
      id="process"
      style={{
        background: C.warm,
        padding: 'clamp(72px,10vw,120px) 0',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 clamp(20px,6vw,80px)',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 80,
          alignItems: 'start',
        }}
        className="r275-process-grid"
      >
        {/* Left — sticky photo */}
        <div style={{ position: 'sticky', top: 100 }}>
          <Reveal>
            <Eyebrow color={C.marine}>Notre approche</Eyebrow>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(30px,3.8vw,50px)',
                color: C.marine,
                fontWeight: 700,
                lineHeight: 1.12,
                margin: '20px 0 28px',
              }}
            >
              Quatre étapes pour défendre vos droits
            </h2>
            <p
              style={{
                fontFamily: SANS,
                fontSize: 15.5,
                color: C.textBody,
                lineHeight: 1.68,
                marginBottom: 36,
              }}
            >
              Chaque dossier suit un processus éprouvé, conçu pour vous donner
              clarté et confiance à chaque étape de votre procédure.
            </p>
          </Reveal>

          <Reveal delay={0.14}>
            <div
              style={{
                position: 'relative',
                overflow: 'hidden',
                aspectRatio: '4/5',
              }}
            >
              <img
                src={PHOTO.avocate}
                alt="Maître Isabelle Faure, avocate droit de la famille Marseille"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                loading="lazy"
              />
              {/* Badge sur la photo */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 28,
                  left: 28,
                  background: C.marine,
                  padding: '16px 22px',
                  borderLeft: `3px solid ${C.gold}`,
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
                  Maître Isabelle Faure
                </div>
                <div
                  style={{
                    fontFamily: SANS,
                    fontSize: 11,
                    color: C.gold,
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    marginTop: 4,
                  }}
                >
                  Avocate · Barreau de Marseille
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Right — étapes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {steps.map((step, i) => (
            <Reveal key={i} delay={i * 0.10}>
              <div
                style={{
                  padding: 'clamp(24px,3vw,40px) 0',
                  borderBottom: `1px solid ${C.warmDark}`,
                  position: 'relative',
                }}
              >
                {/* Filet gauche doré */}
                <div
                  style={{
                    position: 'absolute',
                    left: -2,
                    top: 0,
                    bottom: 0,
                    width: 2,
                    background: `linear-gradient(to bottom, ${C.gold}, transparent)`,
                    opacity: 0.4,
                  }}
                />

                <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
                  {/* Numéro */}
                  <div
                    style={{
                      fontFamily: SERIF,
                      fontSize: 'clamp(36px,4.5vw,56px)',
                      color: C.gold,
                      fontWeight: 700,
                      lineHeight: 1,
                      flexShrink: 0,
                      opacity: 0.60,
                    }}
                  >
                    {step.num}
                  </div>

                  {/* Contenu */}
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontFamily: SANS,
                        fontSize: 11,
                        letterSpacing: '0.28em',
                        textTransform: 'uppercase',
                        color: C.textMuted,
                        marginBottom: 6,
                        fontWeight: 600,
                      }}
                    >
                      {step.sub}
                    </div>
                    <h3
                      style={{
                        fontFamily: SERIF,
                        fontSize: 'clamp(20px,2vw,26px)',
                        color: C.marine,
                        fontWeight: 700,
                        margin: '0 0 14px',
                        lineHeight: 1.20,
                      }}
                    >
                      {step.title}
                    </h3>
                    <p
                      style={{
                        fontFamily: SANS,
                        fontSize: 15,
                        color: C.textBody,
                        lineHeight: 1.66,
                        marginBottom: 14,
                      }}
                    >
                      {step.desc}
                    </p>
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        background: C.marineDark,
                        padding: '7px 14px',
                      }}
                    >
                      <CheckCircle size={12} color={C.gold} strokeWidth={2} />
                      <span
                        style={{
                          fontFamily: SANS,
                          fontSize: 11.5,
                          color: 'rgba(249,247,242,0.80)',
                          letterSpacing: '0.10em',
                        }}
                      >
                        {step.detail}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 860px){
          .r275-process-grid{
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   5 · TÉMOIGNAGES — 3 témoignages clients avec étoiles
   ════════════════════════════════════════════════════════════════════════════ */
function TestimonialsSection() {
  const temoignages = [
    {
      initials: 'M.L.',
      situation: 'Divorce contentieux — Région PACA',
      stars: 5,
      text: 'Maître Faure a géré mon divorce avec une efficacité remarquable. Elle a su rester ferme sur l\'essentiel tout en évitant d\'envenimer la situation. En moins de huit mois, tout était réglé. Je lui en suis infiniment reconnaissante.',
      detail: 'Divorce prononcé · Prestation compensatoire obtenue',
    },
    {
      initials: 'T. & R. B.',
      situation: 'Succession internationale — Franco-espagnole',
      stars: 5,
      text: 'Notre succession impliquait deux pays, trois héritiers et un bien immobilier. Maître Faure a démêlé cette complexité avec une clarté que nous n\'espérions plus. Elle nous a guidés pas à pas, sans jamais nous perdre dans le jargon.',
      detail: 'Succession réglée en 14 mois · Partage amiable obtenu',
    },
    {
      initials: 'C.M.',
      situation: 'Garde alternée — Aix-en-Provence',
      stars: 5,
      text: 'Après une séparation difficile, Maître Faure a défendu mes droits parentaux avec une conviction qui m\'a bluffé. Elle comprend que derrière chaque dossier il y a des enfants, et elle n\'oublie jamais de placer leur intérêt au centre.',
      detail: 'Résidence alternée accordée · Pension alimentaire fixée',
    },
  ];

  return (
    <section
      id="temoignages"
      style={{
        background: C.marine,
        padding: 'clamp(72px,10vw,128px) clamp(20px,6vw,80px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Motif décoratif */}
      <div
        style={{
          position: 'absolute',
          top: -80,
          right: -80,
          width: 400,
          height: 400,
          borderRadius: '50%',
          border: `1px solid rgba(201,168,76,0.08)`,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: -40,
          right: -40,
          width: 300,
          height: 300,
          borderRadius: '50%',
          border: `1px solid rgba(201,168,76,0.12)`,
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 'clamp(48px,6vw,72px)' }}>
            <Eyebrow color={C.gold} align="center">
              Témoignages clients
            </Eyebrow>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(30px,4vw,52px)',
                color: C.white,
                fontWeight: 700,
                lineHeight: 1.12,
                margin: '20px auto 0',
                maxWidth: 620,
              }}
            >
              Ce que disent nos clients
            </h2>
          </div>
        </Reveal>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))',
            gap: 24,
          }}
        >
          {temoignages.map((t, i) => (
            <Reveal key={i} delay={i * 0.12}>
              <div
                style={{
                  background: 'rgba(249,247,242,0.04)',
                  border: `1px solid rgba(201,168,76,0.18)`,
                  padding: 'clamp(28px,3vw,40px)',
                  position: 'relative',
                }}
              >
                {/* Guillemet décoratif */}
                <Quote
                  size={36}
                  color={C.gold}
                  strokeWidth={1}
                  style={{
                    opacity: 0.3,
                    position: 'absolute',
                    top: 24,
                    right: 28,
                  }}
                />

                {/* Étoiles */}
                <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
                  {Array.from({ length: t.stars }).map((_, si) => (
                    <Star
                      key={si}
                      size={16}
                      color={C.gold}
                      fill={C.gold}
                      strokeWidth={0}
                    />
                  ))}
                </div>

                {/* Texte témoignage */}
                <p
                  style={{
                    fontFamily: SERIF,
                    fontSize: 'clamp(15px,1.3vw,17px)',
                    color: 'rgba(249,247,242,0.90)',
                    lineHeight: 1.72,
                    fontStyle: 'italic',
                    marginBottom: 28,
                  }}
                >
                  "{t.text}"
                </p>

                {/* Badge résultat */}
                <div
                  style={{
                    background: 'rgba(201,168,76,0.12)',
                    border: `1px solid rgba(201,168,76,0.22)`,
                    padding: '7px 12px',
                    marginBottom: 20,
                    display: 'inline-block',
                  }}
                >
                  <span
                    style={{
                      fontFamily: SANS,
                      fontSize: 11,
                      color: C.gold,
                      letterSpacing: '0.14em',
                    }}
                  >
                    {t.detail}
                  </span>
                </div>

                {/* Identité */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      background: C.marineMid,
                      border: `1px solid rgba(201,168,76,0.28)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: SERIF,
                      fontSize: 14,
                      color: C.gold,
                      fontWeight: 700,
                      flexShrink: 0,
                      borderRadius: '50%',
                    }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: SANS,
                        fontSize: 13,
                        color: C.white,
                        fontWeight: 600,
                        letterSpacing: '0.06em',
                      }}
                    >
                      {t.initials} — Client(e) du cabinet
                    </div>
                    <div
                      style={{
                        fontFamily: SANS,
                        fontSize: 11.5,
                        color: 'rgba(249,247,242,0.55)',
                        marginTop: 2,
                      }}
                    >
                      {t.situation}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Note Google */}
        <Reveal delay={0.20}>
          <div
            style={{
              textAlign: 'center',
              marginTop: 52,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 14,
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', gap: 4 }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={18} color={C.gold} fill={C.gold} strokeWidth={0} />
              ))}
            </div>
            <span
              style={{
                fontFamily: SANS,
                fontSize: 14,
                color: 'rgba(249,247,242,0.70)',
              }}
            >
              4,9 / 5 · 47 avis Google vérifiés
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   6 · FORMULAIRE DE CONSULTATION
   ════════════════════════════════════════════════════════════════════════════ */
function ConsultationFormSection() {
  const [form, setForm] = useState({
    prenom: '',
    nom: '',
    email: '',
    nature: '',
    message: '',
  });
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSent(true);
    }, 1400);
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 11,
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    color: C.marine,
    fontWeight: 600,
    display: 'block',
    marginBottom: 8,
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 16px',
    fontFamily: SANS,
    fontSize: 15,
    color: C.ink,
    background: C.white,
    border: `1px solid ${C.warm}`,
    outline: 'none',
    transition: 'border-color .3s',
    boxSizing: 'border-box',
  };

  return (
    <section
      id="contact"
      style={{
        background: C.white,
        padding: 'clamp(72px,10vw,128px) clamp(20px,6vw,80px)',
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'clamp(40px,6vw,100px)',
          alignItems: 'center',
        }}
        className="r275-form-grid"
      >
        {/* Left — Présentation */}
        <Reveal>
          <Eyebrow color={C.marine}>Prise de contact</Eyebrow>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(28px,3.5vw,48px)',
              color: C.marine,
              fontWeight: 700,
              lineHeight: 1.12,
              margin: '20px 0 20px',
            }}
          >
            Prenez rendez-vous pour votre première consultation
          </h2>
          <p
            style={{
              fontFamily: SANS,
              fontSize: 15.5,
              color: C.textBody,
              lineHeight: 1.68,
              marginBottom: 36,
            }}
          >
            La première consultation est l'occasion de faire le point sur votre
            situation. Maître Faure vous reçoit au cabinet de Marseille 6e ou en
            visioconférence, généralement sous 48h.
          </p>

          {/* Engagements */}
          {[
            'Confidentialité garantie dès le premier échange',
            'Réponse sous 24h ouvrées',
            'Honoraires expliqués avant toute intervention',
            'Disponible en présentiel et visioconférence',
          ].map((e, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: 14,
              }}
            >
              <CheckCircle size={16} color={C.gold} strokeWidth={2} />
              <span
                style={{
                  fontFamily: SANS,
                  fontSize: 14.5,
                  color: C.textBody,
                  lineHeight: 1.5,
                }}
              >
                {e}
              </span>
            </div>
          ))}

          {/* Citation */}
          <div
            style={{
              marginTop: 36,
              padding: '20px 24px',
              borderLeft: `3px solid ${C.gold}`,
              background: C.warm,
            }}
          >
            <p
              style={{
                fontFamily: SERIF,
                fontSize: 15,
                color: C.marine,
                fontStyle: 'italic',
                lineHeight: 1.60,
                margin: 0,
              }}
            >
              "Chaque situation familiale est unique. Je m'engage à vous écouter
              vraiment, avant de vous conseiller."
            </p>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 11,
                color: C.textMuted,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                marginTop: 10,
              }}
            >
              — Maître Isabelle Faure
            </div>
          </div>
        </Reveal>

        {/* Right — Formulaire */}
        <Reveal delay={0.14}>
          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: EASE }}
              style={{
                background: C.marine,
                padding: 'clamp(40px,5vw,64px)',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  background: 'rgba(201,168,76,0.15)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                  border: `1px solid ${C.gold}`,
                }}
              >
                <CheckCircle size={28} color={C.gold} strokeWidth={1.5} />
              </div>
              <h3
                style={{
                  fontFamily: SERIF,
                  fontSize: 26,
                  color: C.white,
                  fontWeight: 700,
                  margin: '0 0 14px',
                }}
              >
                Merci, {form.prenom || 'cher client'} !
              </h3>
              <p
                style={{
                  fontFamily: SANS,
                  fontSize: 15,
                  color: 'rgba(249,247,242,0.78)',
                  lineHeight: 1.65,
                  marginBottom: 28,
                }}
              >
                Votre demande a bien été transmise au cabinet. Maître Faure ou son
                assistante vous contactera dans les 24 heures ouvrées pour confirmer
                votre rendez-vous.
              </p>
              <div
                style={{
                  fontFamily: SANS,
                  fontSize: 12,
                  color: C.gold,
                  letterSpacing: '0.20em',
                  textTransform: 'uppercase',
                }}
              >
                Cabinet Faure · Marseille 6e
              </div>
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit}
              style={{
                background: C.warm,
                padding: 'clamp(32px,4vw,52px)',
                display: 'flex',
                flexDirection: 'column',
                gap: 22,
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 16,
                }}
              >
                <div>
                  <label htmlFor="prenom" style={labelStyle}>
                    Prénom *
                  </label>
                  <input
                    id="prenom"
                    name="prenom"
                    type="text"
                    required
                    value={form.prenom}
                    onChange={handleChange}
                    placeholder="Isabelle"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label htmlFor="nom" style={labelStyle}>
                    Nom *
                  </label>
                  <input
                    id="nom"
                    name="nom"
                    type="text"
                    required
                    value={form.nom}
                    onChange={handleChange}
                    placeholder="Martin"
                    style={inputStyle}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" style={labelStyle}>
                  Email *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="votre@email.fr"
                  style={inputStyle}
                />
              </div>

              <div>
                <label htmlFor="nature" style={labelStyle}>
                  Nature du litige *
                </label>
                <select
                  id="nature"
                  name="nature"
                  required
                  value={form.nature}
                  onChange={handleChange}
                  style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' }}
                >
                  <option value="">Sélectionnez une catégorie</option>
                  <option value="divorce">Divorce / Séparation</option>
                  <option value="succession">Succession / Héritage</option>
                  <option value="garde">Garde des enfants</option>
                  <option value="pension">Pension alimentaire</option>
                  <option value="adoption">Adoption</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" style={labelStyle}>
                  Votre message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Décrivez brièvement votre situation…"
                  style={{
                    ...inputStyle,
                    resize: 'vertical',
                    minHeight: 120,
                    fontFamily: SANS,
                  }}
                />
              </div>

              <p
                style={{
                  fontFamily: SANS,
                  fontSize: 11.5,
                  color: C.textMuted,
                  lineHeight: 1.55,
                  margin: 0,
                }}
              >
                * Champs obligatoires. Vos données sont traitées de façon
                confidentielle, conformément au RGPD et aux règles déontologiques
                du Barreau de Marseille.
              </p>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  padding: '16px 32px',
                  background: submitting ? C.marineMid : C.marine,
                  color: C.gold,
                  border: `1px solid ${C.gold}`,
                  fontFamily: SANS,
                  fontSize: 12,
                  letterSpacing: '0.24em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  transition: 'all .4s',
                }}
              >
                {submitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      style={{
                        width: 14,
                        height: 14,
                        border: `2px solid rgba(201,168,76,0.3)`,
                        borderTop: `2px solid ${C.gold}`,
                        borderRadius: '50%',
                      }}
                    />
                    Envoi en cours…
                  </>
                ) : (
                  <>
                    Envoyer ma demande
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>
          )}
        </Reveal>
      </div>

      <style>{`
        @media (max-width: 860px){
          .r275-form-grid{
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   7 · STATS — 4 chiffres clés
   ════════════════════════════════════════════════════════════════════════════ */
function StatsSection() {
  const stats = [
    {
      value: '15',
      unit: 'ans',
      label: "d'expérience",
      sub: 'au Barreau de Marseille',
    },
    {
      value: '+500',
      unit: '',
      label: 'dossiers traités',
      sub: 'familles accompagnées',
    },
    {
      value: '94',
      unit: '%',
      label: 'de satisfaction',
      sub: 'enquête clients 2024',
    },
    {
      value: '3',
      unit: '',
      label: "domaines d'expertise",
      sub: 'Famille · Divorce · Succession',
    },
  ];

  return (
    <section
      style={{
        background: C.marineDark,
        padding: 'clamp(64px,8vw,100px) clamp(20px,6vw,80px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ligne dorée décorative */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 'clamp(20px,6vw,80px)',
          right: 'clamp(20px,6vw,80px)',
          height: 1,
          background: `linear-gradient(to right, transparent, ${C.gold}, transparent)`,
          opacity: 0.40,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 'clamp(20px,6vw,80px)',
          right: 'clamp(20px,6vw,80px)',
          height: 1,
          background: `linear-gradient(to right, transparent, ${C.gold}, transparent)`,
          opacity: 0.40,
        }}
      />

      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(4,1fr)',
          gap: 'clamp(24px,4vw,60px)',
        }}
        className="r275-stats-grid"
      >
        {stats.map((s, i) => (
          <Reveal key={i} delay={i * 0.10}>
            <div
              style={{
                textAlign: 'center',
                padding: '0 clamp(8px,2vw,20px)',
                borderRight:
                  i < 3
                    ? `1px solid rgba(201,168,76,0.15)`
                    : 'none',
              }}
              className={i < 3 ? 'r275-stat-border' : ''}
            >
              <div
                style={{
                  fontFamily: SERIF,
                  fontSize: 'clamp(44px,5.5vw,72px)',
                  color: C.gold,
                  fontWeight: 700,
                  lineHeight: 1,
                  letterSpacing: '-0.02em',
                }}
              >
                {s.value}
                <span style={{ fontSize: '0.55em', verticalAlign: 'top', marginTop: 8, display: 'inline-block' }}>
                  {s.unit}
                </span>
              </div>
              <div
                style={{
                  fontFamily: SANS,
                  fontSize: 'clamp(13px,1.2vw,16px)',
                  color: C.white,
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  marginTop: 8,
                  textTransform: 'uppercase',
                }}
              >
                {s.label}
              </div>
              <div
                style={{
                  fontFamily: SANS,
                  fontSize: 12,
                  color: 'rgba(249,247,242,0.50)',
                  marginTop: 4,
                  letterSpacing: '0.06em',
                }}
              >
                {s.sub}
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <style>{`
        @media (max-width: 860px){
          .r275-stats-grid{
            grid-template-columns: 1fr 1fr !important;
            gap: 32px !important;
          }
          .r275-stat-border{
            border-right: none !important;
            border-bottom: 1px solid rgba(201,168,76,0.15) !important;
            padding-bottom: 32px !important;
          }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   8 · PUBLICATIONS — 3 guides pratiques
   ════════════════════════════════════════════════════════════════════════════ */
function PublicationsSection() {
  const articles = [
    {
      categorie: 'Divorce',
      titre: 'Le divorce par consentement mutuel : guide complet 2024',
      extrait:
        'Depuis la réforme de 2017, le divorce amiable se déroule sans audience devant le juge. Que vous prépare-t-on vraiment ? Délais, coût, pièges à éviter — tout ce qu\'il faut savoir avant de se lancer.',
      lecture: '8 min de lecture',
      date: 'Mars 2024',
      tags: ['Convention', 'Patrimoine', 'Enfants'],
    },
    {
      categorie: 'Succession',
      titre: 'Succession internationale : quand le défunt avait des biens à l\'étranger',
      extrait:
        'Un appartement en Espagne, un compte en Suisse, un héritier en Belgique. Les successions transfrontalières mobilisent le droit européen et les conventions bilatérales. Décryptage des règles applicables et des pièges courants.',
      lecture: '11 min de lecture',
      date: 'Janvier 2024',
      tags: ['UE', 'Règlement 650/2012', 'Testament'],
    },
    {
      categorie: 'Famille',
      titre: 'Pension alimentaire : comment est-elle calculée et peut-on la réviser ?',
      extrait:
        'Le montant de la pension alimentaire est fixé par le juge en fonction des revenus de chacun et des besoins de l\'enfant. Mais les situations changent. Voici comment demander une révision et dans quels délais.',
      lecture: '7 min de lecture',
      date: 'Novembre 2023',
      tags: ['Révision', 'Table de référence', 'Enfants'],
    },
  ];

  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section
      id="publications"
      style={{
        background: C.white,
        padding: 'clamp(72px,10vw,128px) clamp(20px,6vw,80px)',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Reveal>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: 'clamp(40px,5vw,68px)',
              flexWrap: 'wrap',
              gap: 24,
            }}
          >
            <div>
              <Eyebrow color={C.marine}>Guides pratiques</Eyebrow>
              <h2
                style={{
                  fontFamily: SERIF,
                  fontSize: 'clamp(30px,4vw,52px)',
                  color: C.marine,
                  fontWeight: 700,
                  lineHeight: 1.12,
                  margin: '18px 0 0',
                  maxWidth: 580,
                }}
              >
                Comprendre vos droits avant d'agir
              </h2>
            </div>
            <GoldButton href="#publications">
              Toutes les publications
            </GoldButton>
          </div>
        </Reveal>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))',
            gap: 28,
          }}
        >
          {articles.map((art, i) => (
            <Reveal key={i} delay={i * 0.10}>
              <div
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  background: hovered === i ? C.marine : C.warm,
                  border: `1px solid ${hovered === i ? C.marine : C.warmDark}`,
                  padding: 'clamp(24px,3vw,36px)',
                  transition: 'all .5s cubic-bezier(.16,1,.3,1)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                }}
              >
                {/* Catégorie + Date */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 7,
                      background: hovered === i ? 'rgba(201,168,76,0.15)' : C.marineDark,
                      padding: '5px 12px',
                    }}
                  >
                    <BookOpen size={12} color={C.gold} strokeWidth={2} />
                    <span
                      style={{
                        fontFamily: SANS,
                        fontSize: 10.5,
                        color: C.gold,
                        letterSpacing: '0.24em',
                        textTransform: 'uppercase',
                        fontWeight: 600,
                      }}
                    >
                      {art.categorie}
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: SANS,
                      fontSize: 11.5,
                      color: hovered === i ? 'rgba(249,247,242,0.50)' : C.textMuted,
                      transition: 'color .5s',
                    }}
                  >
                    {art.date}
                  </span>
                </div>

                {/* Titre */}
                <h3
                  style={{
                    fontFamily: SERIF,
                    fontSize: 'clamp(18px,1.8vw,22px)',
                    color: hovered === i ? C.white : C.marine,
                    fontWeight: 700,
                    margin: 0,
                    lineHeight: 1.26,
                    transition: 'color .5s',
                  }}
                >
                  {art.titre}
                </h3>

                {/* Extrait */}
                <p
                  style={{
                    fontFamily: SANS,
                    fontSize: 14,
                    color: hovered === i ? 'rgba(249,247,242,0.75)' : C.textBody,
                    lineHeight: 1.65,
                    margin: 0,
                    transition: 'color .5s',
                    flex: 1,
                  }}
                >
                  {art.extrait}
                </p>

                {/* Tags */}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {art.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontFamily: SANS,
                        fontSize: 11,
                        padding: '3px 10px',
                        border: `1px solid ${hovered === i ? 'rgba(201,168,76,0.28)' : 'rgba(26,58,92,0.18)'}`,
                        color: hovered === i ? 'rgba(249,247,242,0.60)' : C.textMuted,
                        letterSpacing: '0.10em',
                        transition: 'all .5s',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Lire la suite */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTop: `1px solid ${hovered === i ? 'rgba(201,168,76,0.18)' : 'rgba(26,58,92,0.10)'}`,
                    paddingTop: 16,
                    transition: 'border-color .5s',
                  }}
                >
                  <span
                    style={{
                      fontFamily: SANS,
                      fontSize: 11.5,
                      color: hovered === i ? 'rgba(249,247,242,0.55)' : C.textMuted,
                      transition: 'color .5s',
                    }}
                  >
                    {art.lecture}
                  </span>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      color: C.gold,
                      fontFamily: SANS,
                      fontSize: 11,
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      fontWeight: 600,
                    }}
                  >
                    Lire
                    <ArrowRight
                      size={13}
                      color={C.gold}
                      style={{
                        transform: hovered === i ? 'translateX(4px)' : 'none',
                        transition: 'transform .4s',
                      }}
                    />
                  </div>
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
   9 · PRATIQUE — Adresse, horaires, honoraires, CARPA, AJ
   ════════════════════════════════════════════════════════════════════════════ */
function PracticalSection() {
  const infos = [
    {
      icon: MapPin,
      label: 'Adresse',
      lines: ['18, rue Breteuil', '13006 Marseille — 6e arrondissement', 'Proche Préfecture · Parking Préfecture'],
    },
    {
      icon: Clock,
      label: 'Horaires',
      lines: [
        'Lundi — Vendredi : 9h00 – 19h00',
        'Samedi : 9h00 – 12h00 (sur RDV)',
        'Visioconférence disponible 7j/7',
      ],
    },
    {
      icon: Phone,
      label: 'Téléphone',
      lines: ['04 91 XX XX XX', 'Du lundi au vendredi', '9h – 18h30'],
    },
    {
      icon: Mail,
      label: 'Email',
      lines: ['contact@cabinet-faure.fr', 'Réponse sous 24h ouvrées'],
    },
  ];

  return (
    <section
      style={{
        background: C.warm,
        padding: 'clamp(72px,10vw,120px) clamp(20px,6vw,80px)',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 'clamp(48px,6vw,72px)' }}>
            <Eyebrow color={C.marine} align="center">
              Informations pratiques
            </Eyebrow>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(30px,4vw,50px)',
                color: C.marine,
                fontWeight: 700,
                lineHeight: 1.12,
                margin: '20px auto 0',
                maxWidth: 560,
              }}
            >
              Le cabinet, au cœur de Marseille
            </h2>
          </div>
        </Reveal>

        {/* Grille 4 blocs */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))',
            gap: 24,
            marginBottom: 56,
          }}
        >
          {infos.map((info, i) => {
            const Icon = info.icon;
            return (
              <Reveal key={i} delay={i * 0.10}>
                <div
                  style={{
                    background: C.white,
                    border: `1px solid ${C.warmDark}`,
                    padding: 'clamp(22px,3vw,32px)',
                  }}
                >
                  <div
                    style={{
                      width: 46,
                      height: 46,
                      background: C.marine,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 16,
                    }}
                  >
                    <Icon size={20} color={C.gold} strokeWidth={1.5} />
                  </div>
                  <div
                    style={{
                      fontFamily: SANS,
                      fontSize: 11,
                      letterSpacing: '0.28em',
                      textTransform: 'uppercase',
                      color: C.textMuted,
                      fontWeight: 600,
                      marginBottom: 10,
                    }}
                  >
                    {info.label}
                  </div>
                  {info.lines.map((line, j) => (
                    <div
                      key={j}
                      style={{
                        fontFamily: SANS,
                        fontSize: 14.5,
                        color: j === 0 ? C.marine : C.textBody,
                        fontWeight: j === 0 ? 600 : 400,
                        lineHeight: 1.55,
                      }}
                    >
                      {line}
                    </div>
                  ))}
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Bloc honoraires */}
        <Reveal>
          <div
            style={{
              background: C.marine,
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 0,
              overflow: 'hidden',
            }}
            className="r275-honos-grid"
          >
            {/* Left — Honoraires */}
            <div
              style={{
                padding: 'clamp(32px,4vw,56px)',
                borderRight: `1px solid rgba(201,168,76,0.18)`,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  marginBottom: 20,
                }}
              >
                <FileText size={20} color={C.gold} strokeWidth={1.5} />
                <span
                  style={{
                    fontFamily: SANS,
                    fontSize: 11,
                    letterSpacing: '0.28em',
                    textTransform: 'uppercase',
                    color: C.gold,
                    fontWeight: 600,
                  }}
                >
                  Honoraires transparents
                </span>
              </div>
              <p
                style={{
                  fontFamily: SANS,
                  fontSize: 15,
                  color: 'rgba(249,247,242,0.82)',
                  lineHeight: 1.65,
                  marginBottom: 24,
                }}
              >
                Les honoraires sont fixés d'un commun accord, par écrit, avant
                toute intervention. Plusieurs modes de facturation sont possibles :
                forfait, taux horaire ou honoraires de résultat.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  'Convention d\'honoraires écrite systématiquement',
                  'Paiement sécurisé via compte CARPA',
                  'Règlement en plusieurs fois possible',
                  'Devis gratuit sur demande',
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <CheckCircle size={13} color={C.gold} strokeWidth={2} />
                    <span
                      style={{
                        fontFamily: SANS,
                        fontSize: 14,
                        color: 'rgba(249,247,242,0.78)',
                      }}
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Aide Juridictionnelle */}
            <div style={{ padding: 'clamp(32px,4vw,56px)' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  marginBottom: 20,
                }}
              >
                <Shield size={20} color={C.gold} strokeWidth={1.5} />
                <span
                  style={{
                    fontFamily: SANS,
                    fontSize: 11,
                    letterSpacing: '0.28em',
                    textTransform: 'uppercase',
                    color: C.gold,
                    fontWeight: 600,
                  }}
                >
                  Aide juridictionnelle
                </span>
              </div>
              <p
                style={{
                  fontFamily: SANS,
                  fontSize: 15,
                  color: 'rgba(249,247,242,0.82)',
                  lineHeight: 1.65,
                  marginBottom: 24,
                }}
              >
                Le cabinet accepte les dossiers pris en charge par l'aide
                juridictionnelle totale ou partielle. Vos ressources ne doivent pas
                être un obstacle à l'accès au droit.
              </p>
              <div
                style={{
                  background: 'rgba(201,168,76,0.10)',
                  border: `1px solid rgba(201,168,76,0.22)`,
                  padding: '16px 20px',
                }}
              >
                <div
                  style={{
                    fontFamily: SANS,
                    fontSize: 13,
                    color: C.gold,
                    fontWeight: 600,
                    marginBottom: 6,
                  }}
                >
                  Plafonds de ressources 2024
                </div>
                <div
                  style={{
                    fontFamily: SANS,
                    fontSize: 13.5,
                    color: 'rgba(249,247,242,0.78)',
                    lineHeight: 1.55,
                  }}
                >
                  AJ totale : revenu fiscal ≤ 12 271 €/an
                  <br />
                  AJ partielle : revenu fiscal ≤ 18 413 €/an
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      <style>{`
        @media (max-width: 860px){
          .r275-honos-grid{
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   10 · FOOTER
   ════════════════════════════════════════════════════════════════════════════ */
function FooterSection() {
  const links = {
    Cabinet: [
      { label: 'Maître Isabelle Faure', href: '#hero' },
      { label: 'Expertises', href: '#expertises' },
      { label: 'Notre approche', href: '#process' },
      { label: 'Publications', href: '#publications' },
    ],
    'Domaines': [
      { label: 'Divorce & Séparation', href: '#expertises' },
      { label: 'Succession & Héritage', href: '#expertises' },
      { label: 'Droit de la famille', href: '#expertises' },
      { label: 'Aide juridictionnelle', href: '#contact' },
    ],
    'Contact': [
      { label: '18, rue Breteuil — 13006', href: '#contact' },
      { label: '04 91 XX XX XX', href: 'tel:0491000000' },
      { label: 'contact@cabinet-faure.fr', href: 'mailto:contact@cabinet-faure.fr' },
      { label: 'Prendre RDV', href: '#contact' },
    ],
  };

  return (
    <footer
      style={{
        background: C.ink,
        padding: 'clamp(60px,8vw,100px) clamp(20px,6vw,80px) 0',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Top — Logo + liens */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr',
            gap: 'clamp(32px,5vw,60px)',
            paddingBottom: 56,
            borderBottom: `1px solid rgba(201,168,76,0.12)`,
          }}
          className="r275-footer-grid"
        >
          {/* Brand */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 6,
              }}
            >
              <Scale size={20} color={C.gold} strokeWidth={1.4} />
              <span
                style={{
                  fontFamily: SERIF,
                  fontSize: 22,
                  color: C.white,
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                }}
              >
                Cabinet Faure
              </span>
            </div>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 11,
                color: C.gold,
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                marginBottom: 20,
              }}
            >
              Barreau de Marseille · RPVA
            </div>
            <p
              style={{
                fontFamily: SANS,
                fontSize: 14,
                color: 'rgba(249,247,242,0.55)',
                lineHeight: 1.65,
                maxWidth: 280,
                marginBottom: 24,
              }}
            >
              Maître Isabelle Faure, avocate inscrite au Barreau de Marseille,
              défend vos droits en droit de la famille et des successions depuis
              plus de 15 ans.
            </p>

            {/* Badges légaux */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                'Barreau de Marseille — Toque DF 1204',
                'CARPA — Maniement de fonds sécurisé',
                'RPVA — Procédure dématérialisée',
              ].map((b, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontFamily: SANS,
                    fontSize: 11.5,
                    color: 'rgba(249,247,242,0.45)',
                  }}
                >
                  <div
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: '50%',
                      background: C.gold,
                      opacity: 0.60,
                      flexShrink: 0,
                    }}
                  />
                  {b}
                </div>
              ))}
            </div>
          </div>

          {/* Colonnes de liens */}
          {Object.entries(links).map(([col, items]) => (
            <div key={col}>
              <div
                style={{
                  fontFamily: SANS,
                  fontSize: 10.5,
                  letterSpacing: '0.30em',
                  textTransform: 'uppercase',
                  color: C.gold,
                  fontWeight: 600,
                  marginBottom: 20,
                }}
              >
                {col}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {items.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    style={{
                      fontFamily: SANS,
                      fontSize: 13.5,
                      color: 'rgba(249,247,242,0.55)',
                      textDecoration: 'none',
                      transition: 'color .3s',
                      lineHeight: 1.45,
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLAnchorElement).style.color = C.white)
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLAnchorElement).style.color =
                        'rgba(249,247,242,0.55)')
                    }
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '22px 0',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <span
            style={{
              fontFamily: SANS,
              fontSize: 12,
              color: 'rgba(249,247,242,0.35)',
            }}
          >
            © {new Date().getFullYear()} Cabinet Faure — Tous droits réservés · Marseille, France
          </span>
          <div style={{ display: 'flex', gap: 24 }}>
            {['Mentions légales', 'Politique de confidentialité', 'RGPD'].map(
              (m) => (
                <a
                  key={m}
                  href="#"
                  style={{
                    fontFamily: SANS,
                    fontSize: 11.5,
                    color: 'rgba(249,247,242,0.32)',
                    textDecoration: 'none',
                    transition: 'color .3s',
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLAnchorElement).style.color =
                      'rgba(249,247,242,0.65)')
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLAnchorElement).style.color =
                      'rgba(249,247,242,0.32)')
                  }
                >
                  {m}
                </a>
              )
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px){
          .r275-footer-grid{
            grid-template-columns: 1fr !important;
            gap: 36px !important;
          }
        }
      `}</style>
    </footer>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   PAGE PRINCIPALE
   ════════════════════════════════════════════════════════════════════════════ */
function Impact275Page() {
  return (
    <main
      id="hero"
      style={{
        background: C.white,
        overflowX: 'hidden',
        fontFamily: SANS,
      }}
    >
      {/* Polices Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=Raleway:wght@300;400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        html { scroll-behavior: smooth; }

        body { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }

        ::selection {
          background: rgba(26,58,92,0.18);
          color: #1a3a5c;
        }

        input:focus, select:focus, textarea:focus {
          outline: none;
          border-color: #1a3a5c !important;
          box-shadow: 0 0 0 2px rgba(26,58,92,0.12);
        }

        img { display: block; max-width: 100%; }

        /* Scrollbar discrète */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #e8e4dc; }
        ::-webkit-scrollbar-thumb { background: #1a3a5c; border-radius: 0; }

        /* Responsive utilitaires r275 */
        @media (max-width: 860px){
          .r275-hero-side{ display: none !important; }
          .r275-navlinks{ display: none !important; }
          .r275-navcta{ display: none !important; }
        }

        /* Accessibilité : reduced-motion */
        @media (prefers-reduced-motion: reduce){
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <Nav />

      <HeroSection />

      <ScrollCrossfade />

      <ExpertiseSection />

      <ProcessSection />

      <TestimonialsSection />

      <StatsSection />

      <ConsultationFormSection />

      <PublicationsSection />

      <PracticalSection />

      <FooterSection />
    </main>
  );
}

export default Impact275Page;
