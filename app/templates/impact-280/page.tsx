"use client";
// @ts-nocheck

import React, {useRef, useState, useEffect} from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useMotionValue,
} from 'framer-motion';
import {
  Heart,
  Sparkles,
  Flower2,
  MapPin,
  Star,
  ChevronDown,
  ArrowRight,
  Camera,
  ExternalLink,
  Check,
  Phone,
  Mail,
  Calendar,
} from 'lucide-react';

/* ════════════════════════════════════════════════════════════════════════════
   LES ÉPOUSAILLES D'ALSACE — Wedding planner & événementiel · Strasbourg
   Romantique, élégant, haut de gamme. Fichier autonome. 'use client'.
   ════════════════════════════════════════════════════════════════════════════ */

/* ── Palette ─────────────────────────────────────────────────────────────── */
const C = {
  rose: '#d4a5a5',
  roseDark: '#b8847e',
  roseLight: '#e8cece',
  rosePale: '#f5eaea',
  sage: '#6b8f71',
  sageDark: '#4e6e54',
  sageLight: '#8aab90',
  ivory: '#faf8f5',
  ivoryDeep: '#f0ece5',
  taupe: '#8a7f7a',
  taupeDark: '#5c5450',
  taupeLight: '#b0a8a3',
  ink: '#2e2825',
  white: '#ffffff',
} as const;

const SERIF = "'Cormorant Garamond', Georgia, serif" as const;
const SANS = "'Jost', system-ui, sans-serif" as const;

/* ── Photos Unsplash (IDs réels — ne pas modifier) ───────────────────────── */
const PHOTO = {
  hero: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop',
  couple: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1600&auto=format&fit=crop',
  decor: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1600&auto=format&fit=crop',
  flowers: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=1600&auto=format&fit=crop',
  ceremony: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop',
  reception: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1600&auto=format&fit=crop',
  bride: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1600&auto=format&fit=crop',
  chateau: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop',
  champetre: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=1600&auto=format&fit=crop',
  laique: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1600&auto=format&fit=crop',
} as const;

/* ── Easing partagé ──────────────────────────────────────────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ════════════════════════════════════════════════════════════════════════════
   Primitives utilitaires
   ════════════════════════════════════════════════════════════════════════════ */

/** Étiquette fine, capitales, interlettrage large, filet rosé. */
function Eyebrow({
  children,
  color = C.rose,
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
    width: 42,
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

/** Bouton rose poudré avec flèche qui glisse au survol. */
function RoseButton({
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
    padding: '15px 32px',
    fontFamily: SANS,
    fontSize: 11.5,
    letterSpacing: '0.24em',
    textTransform: 'uppercase',
    fontWeight: 500,
    cursor: 'pointer',
    border: `1px solid ${C.rose}`,
    background: filled ? C.rose : 'transparent',
    color: filled ? C.white : C.rose,
    transition: 'all .5s cubic-bezier(.16,1,.3,1)',
    borderRadius: 0,
  };
  const hov: React.CSSProperties = hover
    ? filled
      ? { background: C.roseDark, borderColor: C.roseDark, transform: 'translateY(-2px)' }
      : { background: 'rgba(212,165,165,0.12)', transform: 'translateY(-2px)' }
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

/** Étoiles de notation. */
function Stars({ count = 5 }: { count?: number }) {
  return (
    <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
      {Array.from({ length: count }).map((_, i) => (
        <Star
          key={i}
          size={14}
          fill={C.rose}
          color={C.rose}
          strokeWidth={0}
        />
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   Navigation
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
    { label: 'Processus', href: '#processus' },
    { label: 'Réalisations', href: '#realisations' },
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
    padding: solid ? '14px clamp(20px,5vw,60px)' : '24px clamp(20px,5vw,60px)',
    background: solid ? 'rgba(250,248,245,0.94)' : 'transparent',
    backdropFilter: solid ? 'blur(16px) saturate(130%)' : 'none',
    WebkitBackdropFilter: solid ? 'blur(16px) saturate(130%)' : 'none',
    borderBottom: solid ? `1px solid rgba(212,165,165,0.28)` : '1px solid transparent',
    transition: 'all .55s cubic-bezier(.16,1,.3,1)',
  };

  const brand: React.CSSProperties = {
    fontFamily: SERIF,
    fontSize: 20,
    letterSpacing: '0.14em',
    color: solid ? C.ink : C.white,
    fontWeight: 400,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    transition: 'color .5s',
  };

  const linkRow: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'clamp(16px, 2.2vw, 36px)',
  };

  return (
    <>
      <nav style={bar}>
      <div style={brand}>
        <Heart size={18} color={C.rose} strokeWidth={1.4} fill={C.rose} />
        Les Épousailles d&apos;Alsace
      </div>
      <div style={linkRow} className="r280-navlinks">
        {links.map((l) => (
          <NavLink key={l.label} label={l.label} href={l.href} solid={solid} />
        ))}
      </div>
      <div className="r280-navcta">
        <a href="#contact" style={{ textDecoration: 'none' }}>
          <RoseButton filled>Consultation gratuite</RoseButton>
        </a>
      </div>
    
        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="r280-burger"
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

function NavLink({
  label,
  href,
  solid,
}: {
  label: string;
  href: string;
  solid: boolean;
}) {
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
        color: h ? C.rose : solid ? C.taupe : 'rgba(255,255,255,0.85)',
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
          background: C.rose,
          transition: 'width .5s cubic-bezier(.16,1,.3,1)',
        }}
      />
    </a>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   1 · HERO SECTION
   ════════════════════════════════════════════════════════════════════════════ */
function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: progress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const imgScale = useTransform(progress, [0, 1], [1, 1.10]);
  const imgY = useTransform(progress, [0, 1], ['0%', '12%']);
  const titleY = useTransform(progress, [0, 1], ['0%', '-40%']);
  const titleOpacity = useTransform(progress, [0, 0.65], [1, 0]);
  const cueOpacity = useTransform(progress, [0, 0.2], [1, 0]);

  const section: React.CSSProperties = {
    position: 'relative',
    height: '100vh',
    minHeight: 660,
    overflow: 'hidden',
    background: C.taupeDark,
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
          alt="Couple de mariés en Alsace — Les Épousailles d'Alsace"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </motion.div>

      {/* Voiles romantiques */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(46,40,37,0.35) 0%, rgba(46,40,37,0.10) 35%, rgba(46,40,37,0.45) 70%, rgba(46,40,37,0.90) 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(110% 70% at 50% 40%, transparent 35%, rgba(212,165,165,0.15) 100%)',
          mixBlendMode: 'screen',
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
        <Reveal y={18}>
          <Eyebrow color="rgba(255,255,255,0.80)" align="center">
            Wedding planner · Alsace &amp; alentours
          </Eyebrow>
        </Reveal>

        <motion.h1
          initial={{ opacity: 0, y: 44 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: EASE, delay: 0.2 }}
          style={{
            fontFamily: SERIF,
            fontWeight: 400,
            color: C.white,
            fontSize: 'clamp(50px, 8.5vw, 130px)',
            lineHeight: 1.0,
            letterSpacing: '0.02em',
            margin: '26px 0 20px',
            textShadow: '0 10px 50px rgba(0,0,0,0.45)',
          }}
        >
          Votre mariage,{' '}
          <span style={{ fontStyle: 'italic', color: C.roseLight }}>
            notre chef-d&apos;œuvre
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.50 }}
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 'clamp(17px, 2.1vw, 24px)',
            color: 'rgba(255,255,255,0.84)',
            maxWidth: 580,
            lineHeight: 1.6,
          }}
        >
          Nous orchestrons chaque détail de votre grand jour en Alsace, de la
          première idée jusqu&apos;au dernier sourire.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.78 }}
          style={{ marginTop: 46, display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <a href="#contact" style={{ textDecoration: 'none' }}>
            <RoseButton filled>Consultation gratuite</RoseButton>
          </a>
          <a href="#services" style={{ textDecoration: 'none' }}>
            <RoseButton>Nos formules</RoseButton>
          </a>
        </motion.div>

        {/* Badges de confiance */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: EASE, delay: 1.1 }}
          style={{
            marginTop: 52,
            display: 'flex',
            gap: 32,
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {[
            { val: '120+', lab: 'Mariages organisés' },
            { val: '8 ans', lab: "D'expérience" },
            { val: '98%', lab: 'Mariés satisfaits' },
          ].map((b) => (
            <div
              key={b.val}
              style={{ textAlign: 'center' }}
            >
              <div
                style={{
                  fontFamily: SERIF,
                  fontSize: 'clamp(28px, 3.5vw, 42px)',
                  color: C.roseLight,
                  lineHeight: 1,
                  marginBottom: 4,
                }}
              >
                {b.val}
              </div>
              <div
                style={{
                  fontFamily: SANS,
                  fontSize: 10.5,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.65)',
                }}
              >
                {b.lab}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Indice défilement */}
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
            letterSpacing: '0.32em',
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
          <ChevronDown size={20} color={C.roseLight} strokeWidth={1.3} />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   2 · SCROLL CROSSFADE — 3 visuels en sticky
   ════════════════════════════════════════════════════════════════════════════ */
function ScrollCrossfade() {
  
  const panels = [
    {
      img: PHOTO.ceremony,
      label: 'La cérémonie',
      title: 'Un moment suspendu dans le temps',
      desc: 'Chaque cérémonie est une promesse unique, orchestrée dans les plus beaux lieux alsaciens — chapelles médiévales, châteaux des vignes ou jardins en fleurs.',
    },
    {
      img: PHOTO.decor,
      label: 'La décoration florale',
      title: 'Une esthétique qui vous ressemble',
      desc: "Arches de fleurs, compositions de table, voilages et bougies : nous créons l'ambiance visuelle dont vous avez rêvé, en collaboration avec les meilleurs fleuristes de la région.",
    },
    {
      img: PHOTO.reception,
      label: 'La réception',
      title: 'La fête de vos vies commence ici',
      desc: "Dîner gastronomique, scénographie de salle, animation et fin de soirée : nous coordonnons chaque prestataire pour que vous profitiez pleinement de chaque instant.",
    },
  ];
const n = panels.length;
  const progress = useMotionValue(0.5 / n);
  const [active, setActive] = useState(0);
  const goTo = (i: number) => {
    setActive(i);
    progress.set((i + 0.5) / n);
  };

  // Chaque panneau occupe 1/3 de la séquence
  const op0 = useTransform(progress, [0, 0.25, 0.38], [1, 1, 0]);
  const op1 = useTransform(progress, [0.28, 0.40, 0.62, 0.72], [0, 1, 1, 0]);
  const op2 = useTransform(progress, [0.62, 0.76, 1], [0, 1, 1]);

  // Dots progress
  const dot0w = useTransform(progress, [0, 0.33], [34, 10]);
  const dot1w = useTransform(progress, [0.20, 0.50, 0.68], [10, 34, 10]);
  const dot2w = useTransform(progress, [0.62, 1], [10, 34]);


  const opacities = [op0, op1, op2];

  return (
    <div style={{ height: '100vh', overflow: 'hidden', position: 'relative' }}>
      {/* Bloc sticky */}
      <div
        style={{
          position: 'relative',
          height: '100%',
          overflow: 'hidden',
          background: C.ink,
        }}
      >
        {/* Photos en crossfade */}
        {panels.map((p, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: opacities[i],
            }}
          >
            <img
              src={p.img}
              alt={p.label}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(to right, rgba(46,40,37,0.82) 0%, rgba(46,40,37,0.30) 55%, rgba(46,40,37,0.10) 100%)',
              }}
            />
          </motion.div>
        ))}

        {/* Texte de chaque panneau */}
        {panels.map((p, i) => (
          <motion.div
            key={`txt-${i}`}
            style={{
              position: 'absolute',
              left: 'clamp(32px, 8vw, 100px)',
              top: '50%',
              transform: 'translateY(-50%)',
              maxWidth: 520,
              zIndex: 4,
              opacity: opacities[i],
            }}
          >
            <Eyebrow color={C.roseLight} align="left">
              {p.label}
            </Eyebrow>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(36px, 5vw, 68px)',
                fontWeight: 400,
                color: C.white,
                lineHeight: 1.12,
                margin: '20px 0 18px',
              }}
            >
              {p.title}
            </h2>
            <p
              style={{
                fontFamily: SANS,
                fontSize: 'clamp(15px, 1.6vw, 18px)',
                color: 'rgba(255,255,255,0.78)',
                lineHeight: 1.72,
                maxWidth: 440,
              }}
            >
              {p.desc}
            </p>
          </motion.div>
        ))}

        {/* Progress Dots */}
        <div
          style={{
            position: 'absolute',
            bottom: 36,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 5,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          {[dot0w, dot1w, dot2w].map((dw, i) => (
            <motion.div
              key={i}
              style={{
                height: 3,
                width: dw,
                background: C.rose,
                borderRadius: 4,
              }}
            />
          ))}
        </div>

        {/* Numéro de panneau */}
        <div
          style={{
            position: 'absolute',
            right: 'clamp(24px, 4vw, 52px)',
            bottom: 36,
            zIndex: 5,
            fontFamily: SANS,
            fontSize: 10,
            letterSpacing: '0.30em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.45)',
          }}
        >
          {panels.map((_, i) => (
            <motion.span
              key={i}
              style={{ opacity: opacities[i] }}
            >
              0{i + 1} / 03
            </motion.span>
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
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   3 · SERVICES SECTION — 3 formules
   ════════════════════════════════════════════════════════════════════════════ */
function ServicesSection() {
  const services = [
    {
      Icon: Sparkles,
      label: 'Notre formule phare',
      title: 'Organisation complète',
      price: 'À partir de 3 800 €',
      desc: "Vous avez la vision, nous avons l'expertise. De la sélection du lieu à la coordination du jour J, nous prenons en charge l'intégralité de votre mariage pour vous permettre de profiter pleinement de chaque étape.",
      items: [
        'Accompagnement de A à Z sur 12 à 18 mois',
        'Sélection et négociation prestataires',
        'Gestion du budget et des contrats',
        'Moodboard & direction artistique',
        'Répétition de cérémonie',
        'Coordination complète jour J',
      ],
    },
    {
      Icon: Heart,
      label: 'Formule essentielle',
      title: 'Coordination Jour J',
      price: 'À partir de 1 200 €',
      desc: "Vous avez tout organisé mais souhaitez être pleinement présent le jour de votre mariage ? Nous prenons le relais 4 semaines avant pour coordonner chaque prestataire et gérer les imprévus.",
      items: [
        'Reprise en main 4 semaines avant le mariage',
        "Réunion de brief avec l'ensemble des prestataires",
        'Rétroplanning minute par minute',
        'Coordination sur place toute la journée',
        "Gestion des imprévus et des urgences",
        'Présence jusqu&apos;en fin de soirée',
      ],
    },
    {
      Icon: Flower2,
      label: 'Formule créative',
      title: 'Décoration & Fleurs',
      price: 'À partir de 900 €',
      desc: "L'ambiance visuelle de votre mariage mérite une attention particulière. Nous créons une identité esthétique cohérente, des arches florales aux compositions de table, en coordination avec nos fleuristes partenaires.",
      items: [
        'Consultation design & mood board',
        'Direction artistique complète',
        'Coordination avec fleuristes et décorateurs',
        'Plan de salle et scénographie',
        'Supervision montage décoration',
        'Conseils couleurs, matières, éclairages',
      ],
    },
  ];

  return (
    <section
      id="services"
      style={{
        background: C.ivory,
        padding: 'clamp(80px,12vw,160px) clamp(20px,6vw,80px)',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 12 }}>
            <Eyebrow color={C.sage} align="center">
              Nos formules
            </Eyebrow>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(38px, 5vw, 72px)',
              fontWeight: 400,
              color: C.ink,
              textAlign: 'center',
              lineHeight: 1.14,
              margin: '18px 0 14px',
            }}
          >
            Une offre pensée{' '}
            <span style={{ fontStyle: 'italic', color: C.sage }}>pour vous</span>
          </h2>
        </Reveal>
        <Reveal delay={0.14}>
          <p
            style={{
              fontFamily: SANS,
              fontSize: 'clamp(15px, 1.6vw, 18px)',
              color: C.taupe,
              textAlign: 'center',
              maxWidth: 620,
              margin: '0 auto 64px',
              lineHeight: 1.72,
            }}
          >
            Chaque mariage est unique. Nos formules s&apos;adaptent à vos besoins,
            votre budget et votre degré d&apos;implication dans l&apos;organisation.
          </p>
        </Reveal>

        <div
          className="r280-services-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 28,
          }}
        >
          {services.map((s, i) => (
            <ServiceCard key={i} {...s} delay={i * 0.1} featured={i === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({
  Icon,
  label,
  title,
  price,
  desc,
  items,
  delay,
  featured,
}: {
  Icon: React.FC<{ size?: number; color?: string; strokeWidth?: number }>;
  label: string;
  title: string;
  price: string;
  desc: string;
  items: string[];
  delay: number;
  featured: boolean;
}) {
  const [hover, setHover] = useState(false);

  const card: React.CSSProperties = {
    background: featured ? C.sage : C.white,
    border: `1px solid ${featured ? C.sage : 'rgba(212,165,165,0.28)'}`,
    padding: 'clamp(28px, 3.5vw, 44px)',
    transition: 'transform .45s cubic-bezier(.16,1,.3,1), box-shadow .45s',
    transform: hover ? 'translateY(-6px)' : 'none',
    boxShadow: hover
      ? '0 20px 60px rgba(107,143,113,0.16)'
      : '0 4px 24px rgba(0,0,0,0.05)',
    cursor: 'default',
  };

  const titleColor = featured ? C.white : C.ink;
  const textColor = featured ? 'rgba(255,255,255,0.82)' : C.taupe;
  const iconColor = featured ? C.roseLight : C.rose;
  const checkColor = featured ? C.roseLight : C.sage;
  const labelColor = featured ? 'rgba(255,255,255,0.65)' : C.taupeLight;

  return (
    <Reveal delay={delay}>
      <div
        style={card}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div
          style={{
            width: 48,
            height: 48,
            background: featured
              ? 'rgba(255,255,255,0.15)'
              : 'rgba(212,165,165,0.12)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 22,
          }}
        >
          <Icon size={22} color={iconColor} strokeWidth={1.5} />
        </div>

        <div
          style={{
            fontFamily: SANS,
            fontSize: 10.5,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: labelColor,
            marginBottom: 10,
          }}
        >
          {label}
        </div>

        <h3
          style={{
            fontFamily: SERIF,
            fontSize: 'clamp(24px, 2.6vw, 34px)',
            fontWeight: 400,
            color: titleColor,
            lineHeight: 1.18,
            marginBottom: 8,
          }}
        >
          {title}
        </h3>

        <div
          style={{
            fontFamily: SANS,
            fontSize: 13,
            fontWeight: 600,
            color: featured ? C.roseLight : C.sage,
            marginBottom: 16,
            letterSpacing: '0.04em',
          }}
        >
          {price}
        </div>

        <p
          style={{
            fontFamily: SANS,
            fontSize: 14.5,
            color: textColor,
            lineHeight: 1.70,
            marginBottom: 28,
          }}
        >
          {desc}
        </p>

        <div
          style={{
            width: '100%',
            height: 1,
            background: featured ? 'rgba(255,255,255,0.18)' : 'rgba(212,165,165,0.22)',
            marginBottom: 24,
          }}
        />

        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {items.map((item, j) => (
            <li
              key={j}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                fontFamily: SANS,
                fontSize: 13.5,
                color: textColor,
                lineHeight: 1.5,
              }}
            >
              <Check
                size={14}
                color={checkColor}
                strokeWidth={2.5}
                style={{ flexShrink: 0, marginTop: 2 }}
              />
              <span dangerouslySetInnerHTML={{ __html: item }} />
            </li>
          ))}
        </ul>

        <div style={{ marginTop: 32 }}>
          <a href="#contact" style={{ textDecoration: 'none' }}>
            <button
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                padding: '12px 24px',
                fontFamily: SANS,
                fontSize: 11,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                fontWeight: 500,
                cursor: 'pointer',
                border: `1px solid ${featured ? C.roseLight : C.rose}`,
                background: 'transparent',
                color: featured ? C.roseLight : C.rose,
                transition: 'all .4s',
              }}
            >
              En savoir plus
              <ArrowRight size={13} />
            </button>
          </a>
        </div>
      </div>
    </Reveal>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   4 · PROCESS SECTION — left sticky + right scroll
   ════════════════════════════════════════════════════════════════════════════ */
function ProcessSection() {
  const steps = [
    {
      num: '01',
      title: 'Consultation initiale',
      desc: 'Nous nous rencontrons autour d&apos;un thé pour apprendre à vous connaître. Vous nous partagez votre vision, vos envies, votre budget. C&apos;est le point de départ de notre collaboration.',
      duration: 'Réunion de 1h30 — offerte',
    },
    {
      num: '02',
      title: 'Vision & moodboard',
      desc: "Nous créons votre identité visuelle de mariage : planche d'inspiration, palette de couleurs, direction artistique, sélection des lieux et des prestataires. Votre mariage prend forme.",
      duration: 'Livraison sous 2 semaines',
    },
    {
      num: '03',
      title: 'Coordination prestataires',
      desc: "Nous gérons l'intégralité des relations avec vos prestataires : contrats, relances, briefings, confirmations. Vous avez un seul interlocuteur pour tout ce qui concerne votre mariage.",
      duration: 'Suivi continu sur toute la préparation',
    },
    {
      num: '04',
      title: 'Jour J parfait',
      desc: "Le grand jour arrive. Notre équipe est sur place dès le matin pour coordonner chaque détail. Vous profitez pleinement de votre mariage pendant que nous veillons à ce que tout se déroule à la perfection.",
      duration: "Présence de l'équipe de 8h à minuit",
    },
  ];

  return (
    <section
      id="processus"
      style={{
        background: C.ivoryDeep,
        padding: 'clamp(80px,12vw,160px) clamp(20px,6vw,80px)',
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'clamp(40px, 6vw, 100px)',
          alignItems: 'start',
        }}
        className="r280-process-grid"
      >
        {/* Colonne gauche — sticky */}
        <div style={{ position: 'sticky', top: '18vh' }}>
          <Reveal>
            <Eyebrow color={C.rose} align="left">
              Notre méthode
            </Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(38px, 5vw, 66px)',
                fontWeight: 400,
                color: C.ink,
                lineHeight: 1.14,
                margin: '20px 0 22px',
              }}
            >
              Comment nous{' '}
              <span style={{ fontStyle: 'italic', color: C.sage }}>
                travaillons
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.14}>
            <p
              style={{
                fontFamily: SANS,
                fontSize: 'clamp(14.5px, 1.5vw, 17px)',
                color: C.taupe,
                lineHeight: 1.72,
                maxWidth: 400,
                marginBottom: 36,
              }}
            >
              Notre approche est fondée sur l&apos;écoute, la transparence et
              l&apos;attention aux détails. Chaque mariage est traité comme s&apos;il
              était le premier.
            </p>
          </Reveal>

          {/* Photo mariée */}
          <Reveal delay={0.2}>
            <div
              style={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 2,
              }}
            >
              <img
                src={PHOTO.bride}
                alt="Mariée se préparant — Les Épousailles d'Alsace"
                style={{
                  width: '100%',
                  height: 'clamp(260px, 30vw, 400px)',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: 20,
                  left: 20,
                  background: 'rgba(250,248,245,0.92)',
                  padding: '10px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <MapPin size={14} color={C.sage} strokeWidth={1.8} />
                <span
                  style={{
                    fontFamily: SANS,
                    fontSize: 11.5,
                    color: C.ink,
                    letterSpacing: '0.10em',
                  }}
                >
                  Strasbourg & Alsace
                </span>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Colonne droite — étapes en scroll */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 0,
            paddingTop: 12,
          }}
        >
          {steps.map((step, i) => (
            <ProcessStep key={i} {...step} delay={i * 0.1} last={i === steps.length - 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessStep({
  num,
  title,
  desc,
  duration,
  delay,
  last,
}: {
  num: string;
  title: string;
  desc: string;
  duration: string;
  delay: number;
  last: boolean;
}) {
  const [hover, setHover] = useState(false);

  return (
    <Reveal delay={delay}>
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          position: 'relative',
          padding: 'clamp(28px, 3.5vw, 44px) clamp(20px, 2.5vw, 36px)',
          background: hover ? C.white : 'transparent',
          border: `1px solid ${hover ? 'rgba(212,165,165,0.32)' : 'rgba(212,165,165,0.18)'}`,
          marginBottom: last ? 0 : 16,
          transition: 'background .4s, border-color .4s, box-shadow .4s',
          boxShadow: hover ? '0 10px 40px rgba(212,165,165,0.12)' : 'none',
          cursor: 'default',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 20,
          }}
        >
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(36px, 4vw, 56px)',
              color: hover ? C.rose : 'rgba(212,165,165,0.35)',
              lineHeight: 1,
              transition: 'color .4s',
              flexShrink: 0,
              fontWeight: 400,
            }}
          >
            {num}
          </div>
          <div style={{ flex: 1 }}>
            <h3
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(22px, 2.4vw, 30px)',
                fontWeight: 400,
                color: C.ink,
                lineHeight: 1.2,
                marginBottom: 12,
              }}
            >
              {title}
            </h3>
            <p
              style={{
                fontFamily: SANS,
                fontSize: 14.5,
                color: C.taupe,
                lineHeight: 1.70,
                marginBottom: 14,
              }}
              dangerouslySetInnerHTML={{ __html: desc }}
            />
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                padding: '5px 12px',
                background: 'rgba(107,143,113,0.10)',
                border: '1px solid rgba(107,143,113,0.22)',
              }}
            >
              <Calendar size={12} color={C.sage} strokeWidth={1.8} />
              <span
                style={{
                  fontFamily: SANS,
                  fontSize: 11,
                  letterSpacing: '0.14em',
                  color: C.sageDark,
                }}
              >
                {duration}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   5 · TESTIMONIALS SECTION
   ════════════════════════════════════════════════════════════════════════════ */
function TestimonialsSection() {
  const testimonials = [
    {
      couple: 'Sophie & Matthieu R.',
      lieu: 'Château de Kintzheim, Alsace',
      mariage: 'Mariage de château — 180 invités — Juin 2024',
      text: "Camille et son équipe ont transformé notre rêve en réalité. Du premier rendez-vous jusqu'au soir de notre mariage, nous avons été guidés avec une attention et une bienveillance incomparables. Chaque détail était parfait — les fleurs, la lumière, le timing. Nos invités nous en parlent encore des mois après.",
    },
    {
      couple: 'Léa & Thomas G.',
      lieu: 'Domaine du Moulin de Wantzenau, Alsace',
      mariage: 'Mariage champêtre — 95 invités — Août 2024',
      text: "Nous n'aurions pas pu imaginer notre journée sans Les Épousailles d'Alsace. Nous avons opté pour la coordination jour J et c'était la meilleure décision que nous pouvions prendre. Camille a géré chaque imprévu avec un calme absolu. Nous avons pu profiter de chaque minute sans nous soucier de quoi que ce soit.",
    },
    {
      couple: 'Emma & Julien K.',
      lieu: "Prieuré Saint-Nicolas, Haut-Rhin",
      mariage: 'Cérémonie laïque — 65 invités — Septembre 2023',
      text: "La décoration florale que l'équipe a créée pour notre mariage dépassait tout ce que nous aurions pu imaginer. Les arches de roses blanches et d'eucalyptus, les compositions de table, les bougies — tout était en parfaite harmonie avec notre vision. Les Épousailles d'Alsace méritent plus que 5 étoiles.",
    },
  ];

  return (
    <section
      id="temoignages"
      style={{
        background: C.ivory,
        padding: 'clamp(80px,12vw,160px) clamp(20px,6vw,80px)',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 12 }}>
            <Eyebrow color={C.rose} align="center">
              Témoignages
            </Eyebrow>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(36px, 5vw, 68px)',
              fontWeight: 400,
              color: C.ink,
              textAlign: 'center',
              lineHeight: 1.14,
              margin: '18px 0 56px',
            }}
          >
            Ce que disent{' '}
            <span style={{ fontStyle: 'italic', color: C.rose }}>nos mariés</span>
          </h2>
        </Reveal>

        <div
          className="r280-testimonials-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 24,
          }}
        >
          {testimonials.map((t, i) => (
            <TestimonialCard key={i} {...t} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({
  couple,
  lieu,
  mariage,
  text,
  delay,
}: {
  couple: string;
  lieu: string;
  mariage: string;
  text: string;
  delay: number;
}) {
  return (
    <Reveal delay={delay}>
      <div
        style={{
          background: C.white,
          border: '1px solid rgba(212,165,165,0.22)',
          padding: 'clamp(28px, 3vw, 40px)',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Stars />

        <p
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 'clamp(16px, 1.7vw, 19px)',
            color: C.ink,
            lineHeight: 1.68,
            flex: 1,
            marginBottom: 28,
          }}
        >
          &ldquo;{text}&rdquo;
        </p>

        <div
          style={{
            paddingTop: 20,
            borderTop: '1px solid rgba(212,165,165,0.20)',
          }}
        >
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 17,
              fontWeight: 400,
              color: C.ink,
              marginBottom: 5,
            }}
          >
            {couple}
          </div>
          <div
            style={{
              fontFamily: SANS,
              fontSize: 11.5,
              color: C.rose,
              letterSpacing: '0.08em',
              marginBottom: 4,
            }}
          >
            {lieu}
          </div>
          <div
            style={{
              fontFamily: SANS,
              fontSize: 11,
              color: C.taupeLight,
              letterSpacing: '0.06em',
            }}
          >
            {mariage}
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   6 · CONTACT FORM SECTION
   ════════════════════════════════════════════════════════════════════════════ */
function ContactFormSection() {
  const [form, setForm] = useState({
    prenom: '',
    nom: '',
    dateMariage: '',
    nbInvites: '',
    budget: '',
    message: '',
  });
  const [sent, setSent] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 16px',
    fontFamily: SANS,
    fontSize: 14.5,
    color: C.ink,
    background: C.white,
    border: '1px solid rgba(138,127,122,0.25)',
    outline: 'none',
    transition: 'border-color .35s',
    boxSizing: 'border-box',
    borderRadius: 0,
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 11,
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    color: C.taupe,
    marginBottom: 8,
    display: 'block',
  };

  return (
    <section
      id="contact"
      style={{
        background: C.ivoryDeep,
        padding: 'clamp(80px,12vw,160px) clamp(20px,6vw,80px)',
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1.2fr',
          gap: 'clamp(40px, 6vw, 100px)',
          alignItems: 'start',
        }}
        className="r280-contact-grid"
      >
        {/* Colonne de présentation */}
        <div>
          <Reveal>
            <Eyebrow color={C.rose} align="left">
              Rencontrons-nous
            </Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(36px, 4.5vw, 62px)',
                fontWeight: 400,
                color: C.ink,
                lineHeight: 1.14,
                margin: '20px 0 20px',
              }}
            >
              Votre consultation{' '}
              <span style={{ fontStyle: 'italic', color: C.rose }}>
                gratuite
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.14}>
            <p
              style={{
                fontFamily: SANS,
                fontSize: 'clamp(14.5px, 1.5vw, 17px)',
                color: C.taupe,
                lineHeight: 1.72,
                maxWidth: 420,
                marginBottom: 40,
              }}
            >
              La première rencontre est offerte et sans engagement. Nous
              discutons de votre projet, de vos envies et de la façon dont nous
              pouvons vous aider à créer le mariage de vos rêves.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {[
                {
                  Icon: Phone,
                  label: 'Téléphone',
                  val: '+33 3 88 00 00 00',
                },
                {
                  Icon: Mail,
                  label: 'Email',
                  val: 'contact@epousailles-alsace.fr',
                },
                {
                  Icon: MapPin,
                  label: 'Basé à',
                  val: 'Strasbourg, Alsace',
                },
                {
                  Icon: Calendar,
                  label: 'Disponibilités',
                  val: 'Du lundi au vendredi, 9h – 18h',
                },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      background: 'rgba(212,165,165,0.12)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <item.Icon size={16} color={C.rose} strokeWidth={1.6} />
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: SANS,
                        fontSize: 10.5,
                        letterSpacing: '0.18em',
                        textTransform: 'uppercase',
                        color: C.taupeLight,
                        marginBottom: 2,
                      }}
                    >
                      {item.label}
                    </div>
                    <div
                      style={{
                        fontFamily: SANS,
                        fontSize: 14.5,
                        color: C.ink,
                      }}
                    >
                      {item.val}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Formulaire */}
        <Reveal delay={0.15}>
          <div
            style={{
              background: C.white,
              padding: 'clamp(28px, 4vw, 52px)',
              border: '1px solid rgba(212,165,165,0.22)',
            }}
          >
            {sent ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '40px 20px',
                }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    background: 'rgba(107,143,113,0.12)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px',
                  }}
                >
                  <Check size={28} color={C.sage} strokeWidth={2} />
                </div>
                <h3
                  style={{
                    fontFamily: SERIF,
                    fontSize: 'clamp(26px, 3vw, 36px)',
                    fontWeight: 400,
                    color: C.ink,
                    marginBottom: 14,
                  }}
                >
                  Merci, {form.prenom}&nbsp;!
                </h3>
                <p
                  style={{
                    fontFamily: SANS,
                    fontSize: 15,
                    color: C.taupe,
                    lineHeight: 1.68,
                    maxWidth: 380,
                    margin: '0 auto',
                  }}
                >
                  Votre demande a bien été reçue. Nous vous contacterons dans
                  les 24 heures pour organiser votre consultation gratuite.
                </p>
                <div style={{ marginTop: 28 }}>
                  <Heart size={22} color={C.rose} fill={C.rose} strokeWidth={0} />
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3
                  style={{
                    fontFamily: SERIF,
                    fontSize: 'clamp(22px, 2.4vw, 30px)',
                    fontWeight: 400,
                    color: C.ink,
                    marginBottom: 28,
                  }}
                >
                  Parlez-nous de votre projet
                </h3>

                {/* Prénom + Nom */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 16,
                    marginBottom: 16,
                  }}
                >
                  <div>
                    <label style={labelStyle} htmlFor="prenom">Prénom</label>
                    <input
                      id="prenom"
                      name="prenom"
                      type="text"
                      value={form.prenom}
                      onChange={handleChange}
                      placeholder="Sophie"
                      required
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle} htmlFor="nom">Nom de famille</label>
                    <input
                      id="nom"
                      name="nom"
                      type="text"
                      value={form.nom}
                      onChange={handleChange}
                      placeholder="Dupont"
                      required
                      style={inputStyle}
                    />
                  </div>
                </div>

                {/* Date mariage */}
                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle} htmlFor="dateMariage">
                    Date de mariage envisagée
                  </label>
                  <input
                    id="dateMariage"
                    name="dateMariage"
                    type="date"
                    value={form.dateMariage}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>

                {/* Nb invités + Budget */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 16,
                    marginBottom: 16,
                  }}
                >
                  <div>
                    <label style={labelStyle} htmlFor="nbInvites">
                      Nombre d&apos;invités
                    </label>
                    <select
                      id="nbInvites"
                      name="nbInvites"
                      value={form.nbInvites}
                      onChange={handleChange}
                      style={{ ...inputStyle, cursor: 'pointer' }}
                    >
                      <option value="">Sélectionner</option>
                      <option value="moins-30">Moins de 30</option>
                      <option value="30-60">30 – 60 invités</option>
                      <option value="60-100">60 – 100 invités</option>
                      <option value="100-150">100 – 150 invités</option>
                      <option value="150-200">150 – 200 invités</option>
                      <option value="plus-200">Plus de 200</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle} htmlFor="budget">
                      Budget approximatif
                    </label>
                    <select
                      id="budget"
                      name="budget"
                      value={form.budget}
                      onChange={handleChange}
                      style={{ ...inputStyle, cursor: 'pointer' }}
                    >
                      <option value="">Sélectionner</option>
                      <option value="moins-10k">Moins de 10 000 €</option>
                      <option value="10-20k">10 000 – 20 000 €</option>
                      <option value="20-35k">20 000 – 35 000 €</option>
                      <option value="35-50k">35 000 – 50 000 €</option>
                      <option value="50-80k">50 000 – 80 000 €</option>
                      <option value="plus-80k">Plus de 80 000 €</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div style={{ marginBottom: 24 }}>
                  <label style={labelStyle} htmlFor="message">
                    Parlez-nous de votre mariage
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Lieu souhaité, style, ambiance, contraintes particulières..."
                    rows={4}
                    style={{
                      ...inputStyle,
                      resize: 'vertical',
                      minHeight: 110,
                    }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '16px 32px',
                    fontFamily: SANS,
                    fontSize: 12,
                    letterSpacing: '0.26em',
                    textTransform: 'uppercase',
                    fontWeight: 500,
                    cursor: 'pointer',
                    background: C.rose,
                    color: C.white,
                    border: 'none',
                    transition: 'background .4s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = C.roseDark;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = C.rose;
                  }}
                >
                  <Heart size={14} fill={C.white} color={C.white} strokeWidth={0} />
                  Envoyer ma demande
                </button>

                <p
                  style={{
                    fontFamily: SANS,
                    fontSize: 11.5,
                    color: C.taupeLight,
                    textAlign: 'center',
                    marginTop: 14,
                    lineHeight: 1.6,
                  }}
                >
                  Réponse garantie sous 24h · Consultation 100% gratuite
                </p>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   7 · RÉALISATIONS SECTION — 3 mariages
   ════════════════════════════════════════════════════════════════════════════ */
function RealizationsSection() {
  const realisations = [
    {
      img: PHOTO.chateau,
      tag: 'Mariage de château',
      title: 'Sophie & Édouard',
      lieu: 'Château de Fleckenstein, Bas-Rhin',
      annee: '2024',
      nbInvites: '210 invités',
      desc: "Un mariage royal dans un château médiéval alsacien. Décoration baroque en blanc et or, orchestre de chambre, feu d'artifice privé. Une nuit mémorable pour 210 invités venus de toute l'Europe.",
      color: C.rose,
    },
    {
      img: PHOTO.champetre,
      tag: 'Mariage champêtre',
      title: 'Clara & Antoine',
      lieu: 'Domaine des Roses, Colmar',
      annee: '2024',
      nbInvites: '80 invités',
      desc: "Mariage en plein air dans un verger en fleurs. Décoration bohème avec guirlandes lumineuses, vaisselle vintage et compositions florales sauvages. Un après-midi champêtre et authentique.",
      color: C.sage,
    },
    {
      img: PHOTO.laique,
      tag: 'Cérémonie laïque',
      title: 'Lucie & Martin',
      lieu: 'Villa Schützenberger, Strasbourg',
      annee: '2023',
      nbInvites: '55 invités',
      desc: "Une cérémonie laïque intimiste au bord du Rhin. Discours personnalisés, musique live acoustique, dîner à la table d'hôte. Un mariage d'une douceur rare pour 55 proches triés sur le volet.",
      color: C.taupe,
    },
  ];

  return (
    <section
      id="realisations"
      style={{
        background: C.ink,
        padding: 'clamp(80px,12vw,160px) clamp(20px,6vw,80px)',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 12 }}>
            <Eyebrow color={C.roseLight} align="center">
              Nos réalisations
            </Eyebrow>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(36px, 5vw, 68px)',
              fontWeight: 400,
              color: C.white,
              textAlign: 'center',
              lineHeight: 1.14,
              margin: '18px 0 56px',
            }}
          >
            Des mariages{' '}
            <span style={{ fontStyle: 'italic', color: C.rose }}>
              qui restent gravés
            </span>
          </h2>
        </Reveal>

        <div
          className="r280-realisations-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 20,
          }}
        >
          {realisations.map((r, i) => (
            <RealisationCard key={i} {...r} delay={i * 0.12} />
          ))}
        </div>
      </div>
    </section>
  );
}

function RealisationCard({
  img,
  tag,
  title,
  lieu,
  annee,
  nbInvites,
  desc,
  color,
  delay,
}: {
  img: string;
  tag: string;
  title: string;
  lieu: string;
  annee: string;
  nbInvites: string;
  desc: string;
  color: string;
  delay: number;
}) {
  const [hover, setHover] = useState(false);

  return (
    <Reveal delay={delay}>
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          position: 'relative',
          overflow: 'hidden',
          cursor: 'default',
        }}
      >
        {/* Image */}
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <img
            src={img}
            alt={`${title} — ${tag}`}
            style={{
              width: '100%',
              height: 'clamp(260px, 28vw, 380px)',
              objectFit: 'cover',
              display: 'block',
              transform: hover ? 'scale(1.05)' : 'scale(1)',
              transition: 'transform .7s cubic-bezier(.16,1,.3,1)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(to top, ${C.ink} 0%, transparent 50%)`,
            }}
          />
          {/* Tag */}
          <div
            style={{
              position: 'absolute',
              top: 16,
              left: 16,
              padding: '5px 12px',
              background: color,
              fontFamily: SANS,
              fontSize: 10.5,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: C.white,
            }}
          >
            {tag}
          </div>
        </div>

        {/* Contenu */}
        <div
          style={{
            background: 'rgba(46,40,37,0.96)',
            padding: 'clamp(20px, 2.5vw, 30px)',
            borderTop: `2px solid ${color}`,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: 8,
            }}
          >
            <h3
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(20px, 2.2vw, 26px)',
                fontWeight: 400,
                color: C.white,
                lineHeight: 1.2,
              }}
            >
              {title}
            </h3>
            <span
              style={{
                fontFamily: SANS,
                fontSize: 11,
                color: C.taupeLight,
                letterSpacing: '0.14em',
                flexShrink: 0,
                marginLeft: 10,
              }}
            >
              {annee}
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              gap: 14,
              marginBottom: 14,
              flexWrap: 'wrap',
            }}
          >
            <span
              style={{
                fontFamily: SANS,
                fontSize: 11.5,
                color,
                display: 'flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <MapPin size={11} color={color} strokeWidth={1.8} />
              {lieu}
            </span>
            <span
              style={{
                fontFamily: SANS,
                fontSize: 11.5,
                color: C.taupeLight,
              }}
            >
              · {nbInvites}
            </span>
          </div>

          <p
            style={{
              fontFamily: SANS,
              fontSize: 13.5,
              color: 'rgba(255,255,255,0.64)',
              lineHeight: 1.68,
            }}
          >
            {desc}
          </p>
        </div>
      </div>
    </Reveal>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   8 · PARTNERS SECTION — 4 catégories
   ════════════════════════════════════════════════════════════════════════════ */
function PartnersSection() {
  const categories = [
    {
      title: 'Traiteurs',
      icon: Sparkles,
      partners: [
        { name: 'Maison Haeberlin', desc: 'Gastronomie alsacienne · Illhaeusern' },
        { name: 'Le Festin d\'Alsace', desc: 'Banquets & buffets · Strasbourg' },
        { name: 'Saveurs du Rhin', desc: 'Cuisine créative & fusion · Colmar' },
        { name: 'Traiteur Sébastien Bras Jr.', desc: 'Fine dining & cocktail dînatoire' },
      ],
    },
    {
      title: 'Photographes',
      icon: Heart,
      partners: [
        { name: 'Atelier Lumière Rose', desc: 'Photojournalisme de mariage · Strasbourg' },
        { name: 'Hugo Kieffer Photography', desc: 'Style documentaire & émotionnel' },
        { name: 'Céline & Mathieu Studio', desc: 'Duo de photographes · Film argentique' },
        { name: 'Portrait d\'Alsace', desc: 'Mode & portraits contemporains' },
      ],
    },
    {
      title: 'Fleuristes',
      icon: Flower2,
      partners: [
        { name: 'Bloom Alsace', desc: 'Créations florales sur mesure · Strasbourg' },
        { name: 'La Pivoine & Co', desc: 'Compositions romantiques · Colmar' },
        { name: 'Vert de Gris Fleurs', desc: 'Design floral contemporain · Mulhouse' },
        { name: 'Les Jardins de Suzanne', desc: 'Fleurs de saison & naturelles' },
      ],
    },
    {
      title: 'Domaines & Lieux',
      icon: MapPin,
      partners: [
        { name: 'Château de l\'Île', desc: 'Château d\'exception · Ostwald' },
        { name: 'Domaine du Moulin', desc: 'Réceptions & fêtes · Wantzenau' },
        { name: 'Villa Schützenberger', desc: 'Espace événementiel · Strasbourg' },
        { name: 'Hostellerie du Rosenmeer', desc: 'Hôtel & réceptions · Rosheim' },
      ],
    },
  ];

  return (
    <section
      style={{
        background: C.ivory,
        padding: 'clamp(80px,12vw,160px) clamp(20px,6vw,80px)',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 12 }}>
            <Eyebrow color={C.sage} align="center">
              Notre réseau
            </Eyebrow>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(36px, 5vw, 68px)',
              fontWeight: 400,
              color: C.ink,
              textAlign: 'center',
              lineHeight: 1.14,
              margin: '18px 0 14px',
            }}
          >
            Nos prestataires{' '}
            <span style={{ fontStyle: 'italic', color: C.sage }}>partenaires</span>
          </h2>
        </Reveal>
        <Reveal delay={0.14}>
          <p
            style={{
              fontFamily: SANS,
              fontSize: 'clamp(14.5px, 1.5vw, 17px)',
              color: C.taupe,
              textAlign: 'center',
              maxWidth: 580,
              margin: '0 auto 56px',
              lineHeight: 1.72,
            }}
          >
            Nous collaborons uniquement avec des prestataires que nous connaissons
            personnellement et en qui nous avons pleinement confiance.
          </p>
        </Reveal>

        <div
          className="r280-partners-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 24,
          }}
        >
          {categories.map((cat, i) => (
            <PartnerCategory key={i} {...cat} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PartnerCategory({
  title,
  icon: Icon,
  partners,
  delay,
}: {
  title: string;
  icon: React.FC<{ size?: number; color?: string; strokeWidth?: number }>;
  partners: { name: string; desc: string }[];
  delay: number;
}) {
  return (
    <Reveal delay={delay}>
      <div
        style={{
          background: C.white,
          border: '1px solid rgba(212,165,165,0.20)',
          padding: 'clamp(20px, 2.5vw, 32px)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 22,
            paddingBottom: 18,
            borderBottom: '1px solid rgba(212,165,165,0.22)',
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              background: 'rgba(107,143,113,0.10)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Icon size={16} color={C.sage} strokeWidth={1.6} />
          </div>
          <h3
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(18px, 2vw, 22px)',
              fontWeight: 400,
              color: C.ink,
            }}
          >
            {title}
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {partners.map((p, j) => (
            <div key={j}>
              <div
                style={{
                  fontFamily: SANS,
                  fontSize: 13.5,
                  fontWeight: 500,
                  color: C.ink,
                  marginBottom: 2,
                }}
              >
                {p.name}
              </div>
              <div
                style={{
                  fontFamily: SANS,
                  fontSize: 12,
                  color: C.taupeLight,
                  lineHeight: 1.5,
                }}
              >
                {p.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   9 · PRACTICAL SECTION — Zone d'intervention, tarifs, disponibilités
   ════════════════════════════════════════════════════════════════════════════ */
function PracticalSection() {
  const zones = [
    { region: 'Bas-Rhin (67)', villes: 'Strasbourg, Obernai, Haguenau, Sélestat, Saverne' },
    { region: 'Haut-Rhin (68)', villes: 'Colmar, Mulhouse, Guebwiller, Thann, Ribeauvillé' },
    { region: 'Moselle (57)', villes: 'Metz, Sarreguemines, Forbach, Sarrebourg' },
    { region: 'Baden (Allemagne)', villes: 'Freiburg, Baden-Baden, Offenburg' },
  ];

  const disponibilites = [
    { annee: '2025', statut: 'Quelques dates disponibles', color: '#e0975a' },
    { annee: '2026', statut: 'Ouvert aux réservations', color: C.sage },
    { annee: '2027', statut: 'Réservations anticipées', color: C.sage },
  ];

  const modesTravail = [
    {
      title: 'Réunions en présentiel',
      desc: 'Nous vous rencontrons à notre bureau de Strasbourg ou directement sur vos lieux de mariage.',
    },
    {
      title: 'Suivi à distance',
      desc: 'Tous nos échanges sont organisés via notre espace client sécurisé, accessible 24h/24.',
    },
    {
      title: 'Disponibilité étendue',
      desc: 'En période de mariage (avril–novembre), nous sommes joignables 6j/7 pour répondre à vos questions.',
    },
    {
      title: 'Équipe dédiée',
      desc: "Un binôme wedding planner + assistante est attribué à votre mariage dès la signature du contrat.",
    },
  ];

  return (
    <section
      style={{
        background: C.ivoryDeep,
        padding: 'clamp(80px,12vw,160px) clamp(20px,6vw,80px)',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 12 }}>
            <Eyebrow color={C.rose} align="center">
              Informations pratiques
            </Eyebrow>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(36px, 5vw, 68px)',
              fontWeight: 400,
              color: C.ink,
              textAlign: 'center',
              lineHeight: 1.14,
              margin: '18px 0 56px',
            }}
          >
            Tout ce qu&apos;il faut{' '}
            <span style={{ fontStyle: 'italic', color: C.rose }}>savoir</span>
          </h2>
        </Reveal>

        <div
          className="r280-practical-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 36,
          }}
        >
          {/* Zone d'intervention */}
          <Reveal delay={0.1}>
            <div
              style={{
                background: C.white,
                border: '1px solid rgba(212,165,165,0.22)',
                padding: 'clamp(24px, 3vw, 40px)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  marginBottom: 22,
                }}
              >
                <MapPin size={18} color={C.rose} strokeWidth={1.6} />
                <h3
                  style={{
                    fontFamily: SERIF,
                    fontSize: 'clamp(20px, 2.2vw, 26px)',
                    fontWeight: 400,
                    color: C.ink,
                  }}
                >
                  Zone d&apos;intervention
                </h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {zones.map((z, i) => (
                  <div
                    key={i}
                    style={{
                      paddingBottom: 14,
                      borderBottom:
                        i < zones.length - 1 ? '1px solid rgba(212,165,165,0.16)' : 'none',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: SANS,
                        fontSize: 13,
                        fontWeight: 600,
                        color: C.ink,
                        marginBottom: 3,
                      }}
                    >
                      {z.region}
                    </div>
                    <div
                      style={{
                        fontFamily: SANS,
                        fontSize: 12.5,
                        color: C.taupe,
                        lineHeight: 1.5,
                      }}
                    >
                      {z.villes}
                    </div>
                  </div>
                ))}
              </div>
              <div
                style={{
                  marginTop: 20,
                  padding: '12px 16px',
                  background: 'rgba(212,165,165,0.10)',
                  border: '1px solid rgba(212,165,165,0.22)',
                  fontFamily: SANS,
                  fontSize: 12,
                  color: C.taupeDark,
                  lineHeight: 1.6,
                }}
              >
                Frais de déplacement inclus jusqu&apos;à 80 km de Strasbourg. Au-delà, supplément forfaitaire selon distance.
              </div>
            </div>
          </Reveal>

          {/* Tarifs indicatifs */}
          <Reveal delay={0.15}>
            <div
              style={{
                background: C.white,
                border: '1px solid rgba(212,165,165,0.22)',
                padding: 'clamp(24px, 3vw, 40px)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  marginBottom: 22,
                }}
              >
                <Sparkles size={18} color={C.rose} strokeWidth={1.6} />
                <h3
                  style={{
                    fontFamily: SERIF,
                    fontSize: 'clamp(20px, 2.2vw, 26px)',
                    fontWeight: 400,
                    color: C.ink,
                  }}
                >
                  Tarifs indicatifs
                </h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  { label: 'Organisation complète', price: 'À partir de 3 800 €', note: 'Selon nb de prestataires & durée' },
                  { label: 'Coordination jour J', price: 'À partir de 1 200 €', note: 'Journée complète jusqu\'à minuit' },
                  { label: 'Décoration & Fleurs', price: 'À partir de 900 €', note: 'Hors fournitures florales' },
                  { label: 'Consultation seule', price: '0 €', note: 'Première rencontre toujours gratuite' },
                ].map((t, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      paddingBottom: 14,
                      borderBottom: i < 3 ? '1px solid rgba(212,165,165,0.16)' : 'none',
                      gap: 16,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontFamily: SANS,
                          fontSize: 13,
                          fontWeight: 500,
                          color: C.ink,
                          marginBottom: 2,
                        }}
                      >
                        {t.label}
                      </div>
                      <div
                        style={{
                          fontFamily: SANS,
                          fontSize: 11.5,
                          color: C.taupeLight,
                        }}
                      >
                        {t.note}
                      </div>
                    </div>
                    <div
                      style={{
                        fontFamily: SERIF,
                        fontSize: 16,
                        color: C.sage,
                        flexShrink: 0,
                        fontWeight: 400,
                      }}
                    >
                      {t.price}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Disponibilités */}
          <Reveal delay={0.2}>
            <div
              style={{
                background: C.white,
                border: '1px solid rgba(212,165,165,0.22)',
                padding: 'clamp(24px, 3vw, 40px)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  marginBottom: 22,
                }}
              >
                <Calendar size={18} color={C.rose} strokeWidth={1.6} />
                <h3
                  style={{
                    fontFamily: SERIF,
                    fontSize: 'clamp(20px, 2.2vw, 26px)',
                    fontWeight: 400,
                    color: C.ink,
                  }}
                >
                  Disponibilités
                </h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 22 }}>
                {disponibilites.map((d, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: SANS,
                        fontSize: 14,
                        color: C.ink,
                        fontWeight: 500,
                      }}
                    >
                      Saison {d.annee}
                    </span>
                    <span
                      style={{
                        fontFamily: SANS,
                        fontSize: 11.5,
                        color: d.color,
                        padding: '4px 10px',
                        background: `${d.color}18`,
                        border: `1px solid ${d.color}40`,
                        letterSpacing: '0.06em',
                      }}
                    >
                      {d.statut}
                    </span>
                  </div>
                ))}
              </div>
              <p
                style={{
                  fontFamily: SANS,
                  fontSize: 12.5,
                  color: C.taupe,
                  lineHeight: 1.6,
                  padding: '12px 16px',
                  background: 'rgba(107,143,113,0.08)',
                  borderLeft: `3px solid ${C.sage}`,
                }}
              >
                La saison des mariages en Alsace court d&apos;avril à novembre.
                Les week-ends de juin, juillet et septembre sont les plus
                demandés — réservez tôt.
              </p>
            </div>
          </Reveal>

          {/* Mode de travail */}
          <Reveal delay={0.25}>
            <div
              style={{
                background: C.white,
                border: '1px solid rgba(212,165,165,0.22)',
                padding: 'clamp(24px, 3vw, 40px)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  marginBottom: 22,
                }}
              >
                <Heart size={18} color={C.rose} strokeWidth={1.6} />
                <h3
                  style={{
                    fontFamily: SERIF,
                    fontSize: 'clamp(20px, 2.2vw, 26px)',
                    fontWeight: 400,
                    color: C.ink,
                  }}
                >
                  Notre façon de travailler
                </h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {modesTravail.map((m, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      gap: 12,
                      alignItems: 'flex-start',
                    }}
                  >
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        background: C.rose,
                        borderRadius: '50%',
                        flexShrink: 0,
                        marginTop: 6,
                      }}
                    />
                    <div>
                      <div
                        style={{
                          fontFamily: SANS,
                          fontSize: 13,
                          fontWeight: 600,
                          color: C.ink,
                          marginBottom: 4,
                        }}
                      >
                        {m.title}
                      </div>
                      <div
                        style={{
                          fontFamily: SANS,
                          fontSize: 13,
                          color: C.taupe,
                          lineHeight: 1.6,
                        }}
                      >
                        {m.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   10 · FOOTER SECTION
   ════════════════════════════════════════════════════════════════════════════ */
function FooterSection() {
  const footerLinks = [
    {
      heading: 'Services',
      links: [
        { label: 'Organisation complète', href: '#services' },
        { label: 'Coordination Jour J', href: '#services' },
        { label: 'Décoration & Fleurs', href: '#services' },
        { label: 'Consultation gratuite', href: '#contact' },
      ],
    },
    {
      heading: 'À propos',
      links: [
        { label: 'Notre méthode', href: '#processus' },
        { label: 'Nos réalisations', href: '#realisations' },
        { label: 'Témoignages', href: '#temoignages' },
        { label: 'Nos partenaires', href: '#contact' },
      ],
    },
    {
      heading: 'Contact',
      links: [
        { label: '+33 3 88 00 00 00', href: 'tel:+33388000000' },
        { label: 'contact@epousailles-alsace.fr', href: 'mailto:contact@epousailles-alsace.fr' },
        { label: '12 rue du Mariage, Strasbourg', href: "/templates/impact-280" },
        { label: 'Du lundi au vendredi 9h–18h', href: "/templates/impact-280" },
      ],
    },
  ];

  return (
    <footer
      style={{
        background: C.ink,
        padding: 'clamp(60px, 8vw, 100px) clamp(20px, 6vw, 80px) 0',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Partie haute */}
        <div
          className="r280-footer-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1.4fr 1fr 1fr 1fr',
            gap: 'clamp(32px, 4vw, 60px)',
            paddingBottom: 56,
            borderBottom: '1px solid rgba(255,255,255,0.10)',
          }}
        >
          {/* Brand */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 18,
              }}
            >
              <Heart size={20} color={C.rose} fill={C.rose} strokeWidth={0} />
              <span
                style={{
                  fontFamily: SERIF,
                  fontSize: 20,
                  color: C.white,
                  letterSpacing: '0.12em',
                  fontWeight: 400,
                }}
              >
                Les Épousailles<br />d&apos;Alsace
              </span>
            </div>
            <p
              style={{
                fontFamily: SANS,
                fontSize: 13.5,
                color: 'rgba(255,255,255,0.55)',
                lineHeight: 1.70,
                maxWidth: 280,
                marginBottom: 28,
              }}
            >
              Wedding planner & événementiel basé à Strasbourg. Nous créons
              des mariages sur mesure en Alsace et dans les régions voisines
              depuis 2016.
            </p>
            {/* Réseaux sociaux */}
            <div style={{ display: 'flex', gap: 12 }}>
              <a
                href={`https://instagram.com/${fd?.instagram ?? "epousailles_alsace"}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: 38,
                  height: 38,
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.14)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background .4s, border-color .4s',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.background = 'rgba(212,165,165,0.20)';
                  el.style.borderColor = C.rose;
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.background = 'rgba(255,255,255,0.08)';
                  el.style.borderColor = 'rgba(255,255,255,0.14)';
                }}
              >
                <Camera size={16} color={C.roseLight} strokeWidth={1.6} />
              </a>
              <a
                href="https://pinterest.fr/epousaillesalsace"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: 38,
                  height: 38,
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.14)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background .4s, border-color .4s',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.background = 'rgba(212,165,165,0.20)';
                  el.style.borderColor = C.rose;
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.background = 'rgba(255,255,255,0.08)';
                  el.style.borderColor = 'rgba(255,255,255,0.14)';
                }}
              >
                <ExternalLink size={16} color={C.roseLight} strokeWidth={1.6} />
              </a>
            </div>
          </div>

          {/* Colonnes liens */}
          {footerLinks.map((col, i) => (
            <div key={i}>
              <h4
                style={{
                  fontFamily: SANS,
                  fontSize: 10.5,
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase',
                  color: C.rose,
                  marginBottom: 20,
                  fontWeight: 500,
                }}
              >
                {col.heading}
              </h4>
              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                {col.links.map((link, j) => (
                  <li key={j}>
                    <a
                      href={link.href}
                      style={{
                        fontFamily: SANS,
                        fontSize: 13.5,
                        color: 'rgba(255,255,255,0.58)',
                        textDecoration: 'none',
                        transition: 'color .35s',
                        lineHeight: 1.5,
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.color = C.roseLight;
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.58)';
                      }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Partie basse — mentions légales */}
        <div
          className="r280-footer-bottom"
          style={{
            padding: '28px 0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 14,
          }}
        >
          <div
            style={{
              fontFamily: SANS,
              fontSize: 12,
              color: 'rgba(255,255,255,0.35)',
              lineHeight: 1.6,
            }}
          >
            © {new Date().getFullYear()} Les Épousailles d&apos;Alsace · SIRET 852 346 710 00014 ·
            APE 8230Z · Auto-entrepreneur
          </div>
          <div style={{ display: 'flex', gap: 22 }}>
            {[
              { label: 'Mentions légales', href: "/templates/impact-280" },
              { label: 'Politique de confidentialité', href: "/templates/impact-280" },
              { label: 'CGV', href: "/templates/impact-280" },
            ].map((l, i) => (
              <a
                key={i}
                href={l.href}
                style={{
                  fontFamily: SANS,
                  fontSize: 12,
                  color: 'rgba(255,255,255,0.35)',
                  textDecoration: 'none',
                  transition: 'color .35s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = C.roseLight;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.35)';
                }}
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   RESPONSIVE — classes r280-*
   ════════════════════════════════════════════════════════════════════════════ */
const RESPONSIVE_CSS = `
  @media (max-width: 860px) {
    .r280-navlinks { display: none !important; }
          .r280-burger { display: flex !important; flex-direction: column; }
    .r280-navcta { display: none !important; }

    .r280-services-grid {
      grid-template-columns: 1fr !important;
      gap: 20px !important;
    }

    .r280-process-grid {
      grid-template-columns: 1fr !important;
      gap: 32px !important;
    }

    .r280-testimonials-grid {
      grid-template-columns: 1fr !important;
      gap: 20px !important;
    }

    .r280-contact-grid {
      grid-template-columns: 1fr !important;
      gap: 40px !important;
    }

    .r280-realisations-grid {
      grid-template-columns: 1fr !important;
      gap: 20px !important;
    }

    .r280-partners-grid {
      grid-template-columns: repeat(2, 1fr) !important;
      gap: 16px !important;
    }

    .r280-practical-grid {
      grid-template-columns: 1fr !important;
      gap: 20px !important;
    }

    .r280-footer-grid {
      grid-template-columns: 1fr 1fr !important;
      gap: 32px !important;
    }

    .r280-footer-bottom {
      flex-direction: column !important;
      align-items: flex-start !important;
      gap: 12px !important;
    }
  }

  @media (max-width: 520px) {
    .r280-partners-grid {
      grid-template-columns: 1fr !important;
    }

    .r280-footer-grid {
      grid-template-columns: 1fr !important;
    }
  }

  /* Focus visible pour accessibilité */
  button:focus-visible,
  a:focus-visible,
  input:focus-visible,
  select:focus-visible,
  textarea:focus-visible {
    outline: 2px solid #d4a5a5;
    outline-offset: 3px;
  }

  /* Smooth scroll */
  html {
    scroll-behavior: smooth;
  }

  /* Scrollbar discrète */
  ::-webkit-scrollbar {
    width: 6px;
  }
  ::-webkit-scrollbar-track {
    background: #faf8f5;
  }
  ::-webkit-scrollbar-thumb {
    background: #d4a5a5;
    border-radius: 3px;
  }

  /* Input focus states */
  input:focus,
  select:focus,
  textarea:focus {
    border-color: #d4a5a5 !important;
    box-shadow: 0 0 0 3px rgba(212,165,165,0.12);
  }
`;

/* ════════════════════════════════════════════════════════════════════════════
   PAGE PRINCIPALE
   ════════════════════════════════════════════════════════════════════════════ */

// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function Impact280Page() {
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
    <main
      id="hero"
      style={{
        fontFamily: SANS,
        background: C.ivory,
        overflowX: 'hidden',
        margin: 0,
        padding: 0,
      }}
    >
      <style>{RESPONSIVE_CSS}</style>

      {/* Navigation */}
      <Nav />

      {/* 1 — Hero romantique */}
      <HeroSection />

      {/* 2 — Scroll Crossfade 3 visuels */}
      <ScrollCrossfade />

      {/* 3 — Services / Formules */}
      <ServicesSection />

      {/* 4 — Processus de travail */}
      <ProcessSection />

      {/* 7 — Réalisations (avant témoignages pour rythme éditorial) */}
      <RealizationsSection />

      {/* 5 — Témoignages */}
      <TestimonialsSection />

      {/* 6 — Formulaire de contact */}
      <ContactFormSection />

      {/* 8 — Partenaires */}
      <PartnersSection />

      {/* 9 — Informations pratiques */}
      <PracticalSection />

      {/* 10 — Footer */}
      <FooterSection />
    </main>
  );
}
