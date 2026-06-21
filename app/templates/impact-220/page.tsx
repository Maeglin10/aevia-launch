'use client';

import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
} from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
  useMotionValueEvent,
} from 'framer-motion';
import {
  ChevronDown,
  ArrowRight,
  Mail,
  MapPin,
  Phone,
  Check,
  Star,
  Clock,
  Shield,
  Gem,
  ChevronRight,
} from 'lucide-react';

/* ════════════════════════════════════════════════════════════════════════════
   HORA VIVA — Manufacture Horlogère Suisse, Genève
   Luxury Swiss watchmaking · Fondée en 1834
   ════════════════════════════════════════════════════════════════════════════ */

// ─── Design Tokens ──────────────────────────────────────────────────────────
const T = {
  navy:       '#0a0e17',
  navySoft:   '#0e1420',
  navyCard:   '#121926',
  border:     '#1e2637',
  borderGold: '#2e2510',
  gold:       '#c9a24b',
  goldBright: '#e3bd6a',
  goldDim:    '#8a6e33',
  cream:      '#e8d5a3',
  creamDim:   '#b09a72',
  white:      '#f5f0e8',
  text:       '#c8c0b0',
} as const;

// ─── Verified Unsplash Images ────────────────────────────────────────────────
const IMGS = {
  hero:        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1600&auto=format&fit=crop',
  movement:    'https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=1600&auto=format&fit=crop',
  dial:        'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1600&auto=format&fit=crop',
  editorial1:  'https://images.unsplash.com/photo-1620625515032-6ed0c1790c75?q=80&w=1600&auto=format&fit=crop',
  editorial2:  'https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?q=80&w=1600&auto=format&fit=crop',
  collection1: 'https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?q=80&w=1600&auto=format&fit=crop',
  collection2: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?q=80&w=1600&auto=format&fit=crop',
} as const;

// ─── Global Styles (injected once) ──────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=Jost:wght@200;300;400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: #0a0e17; color: #c8c0b0; font-family: 'Jost', sans-serif; overflow-x: hidden; }
  ::selection { background: rgba(201,162,75,0.3); color: #e8d5a3; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #0a0e17; }
  ::-webkit-scrollbar-thumb { background: #2e2510; border-radius: 2px; }
  ::-webkit-scrollbar-thumb:hover { background: #c9a24b; }
`;

// ─── Reusable Components ─────────────────────────────────────────────────────

function GoldRule({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={className}
      style={{
        height: '1px',
        background: `linear-gradient(90deg, transparent, ${T.gold}, transparent)`,
        opacity: 0.4,
        ...style,
      }}
    />
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        fontFamily: "'Jost', sans-serif",
        fontSize: '10px',
        fontWeight: 300,
        letterSpacing: '0.25em',
        textTransform: 'uppercase' as const,
        color: T.gold,
      }}
    >
      {children}
    </span>
  );
}

function FadeUp({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ─── NAV ─────────────────────────────────────────────────────────────────────

function Nav() {
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useMotionValueEvent(scrollY, 'change', (v) => setSolid(v > 60));

  const navStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    transition: 'background 0.6s ease, box-shadow 0.6s ease',
    background: solid
      ? 'rgba(10,14,23,0.97)'
      : 'transparent',
    boxShadow: solid
      ? '0 1px 0 rgba(201,162,75,0.15)'
      : 'none',
    backdropFilter: solid ? 'blur(20px)' : 'none',
  };

  const links = ['Collections', 'Manufacture', 'Héritage', 'Rendez-vous'];

  return (
    <nav style={navStyle}>
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 40px',
          height: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <span
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '22px',
              fontWeight: 600,
              letterSpacing: '0.15em',
              color: T.cream,
            }}
          >
            HORA VIVA
          </span>
          <span
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: '8px',
              fontWeight: 200,
              letterSpacing: '0.35em',
              color: T.gold,
              marginTop: '2px',
            }}
          >
            GENÈVE · EST. 1834
          </span>
        </div>

        {/* Desktop links */}
        <div
          style={{
            display: 'flex',
            gap: '40px',
            alignItems: 'center',
          }}
          className="nav-links-desktop"
        >
          {links.map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: '11px',
                fontWeight: 300,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: T.creamDim,
                textDecoration: 'none',
                transition: 'color 0.3s',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = T.gold)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = T.creamDim)
              }
            >
              {l}
            </a>
          ))}
          <a
            href="#contact"
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: '10px',
              fontWeight: 400,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: T.navy,
              background: T.gold,
              padding: '10px 24px',
              textDecoration: 'none',
              transition: 'background 0.3s',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = T.goldBright)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = T.gold)
            }
          >
            Atelier
          </a>
        </div>

        {/* Mobile burger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu principal"
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
          }}
          className="nav-burger"
        >
          <div
            style={{
              width: '24px',
              height: '1px',
              background: T.cream,
              marginBottom: '6px',
              transition: 'transform 0.3s',
              transform: menuOpen ? 'rotate(45deg) translate(5px,5px)' : 'none',
            }}
          />
          <div
            style={{
              width: '24px',
              height: '1px',
              background: T.cream,
              transition: 'opacity 0.3s',
              opacity: menuOpen ? 0 : 1,
            }}
          />
          <div
            style={{
              width: '24px',
              height: '1px',
              background: T.cream,
              marginTop: '6px',
              transition: 'transform 0.3s',
              transform: menuOpen ? 'rotate(-45deg) translate(5px,-5px)' : 'none',
            }}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              background: 'rgba(10,14,23,0.98)',
              borderTop: `1px solid ${T.borderGold}`,
              padding: '24px 40px 32px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            {links.map((l) => (
              <a
                key={l}
                href={`#${l.toLowerCase()}`}
                onClick={() => setMenuOpen(false)}
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: '13px',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: T.creamDim,
                  textDecoration: 'none',
                }}
              >
                {l}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .nav-links-desktop { display: none !important; }
          .nav-burger { display: flex !important; flex-direction: column; }
        }
      `}</style>
    </nav>
  );
}

// ─── HERO ────────────────────────────────────────────────────────────────────

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.14]);
  const imgY     = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);
  const textY    = useTransform(scrollYProgress, [0, 1], ['0%', '35%']);
  const scrimO   = useTransform(scrollYProgress, [0, 0.6], [0.85, 0.95]);

  return (
    <section
      ref={ref}
      style={{
        position: 'relative',
        height: '100vh',
        minHeight: '700px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Parallax photo */}
      <motion.div
        style={{
          position: 'absolute',
          inset: '-10% 0',
          scale: imgScale,
          y: imgY,
        }}
      >
        <img
          src={IMGS.hero}
          alt="Montre Hora Viva — manufacture suisse"
          loading="eager"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        />
      </motion.div>

      {/* Dark scrim — strong, the hero photo is light grey so text needs heavy darkening */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at center, rgba(8,11,18,0.62) 0%, rgba(8,11,18,0.9) 100%)',
          opacity: scrimO,
        }}
      />
      {/* Top + bottom gradient for nav and scroll-cue legibility */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(8,11,18,0.75) 0%, transparent 22%, transparent 78%, rgba(8,11,18,0.8) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Gold rule top */}
      <div
        style={{
          position: 'absolute',
          top: '120px',
          left: '60px',
          right: '60px',
          height: '1px',
          background: `linear-gradient(90deg, transparent, ${T.gold}55, transparent)`,
        }}
      />

      {/* Headline */}
      <motion.div
        style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          padding: '0 24px',
          y: textY,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <Label>Manufacture · Genève · Fondée 1834</Label>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(48px, 7vw, 96px)',
            fontWeight: 300,
            color: T.white,
            lineHeight: 1.05,
            marginTop: '20px',
            letterSpacing: '-0.01em',
          }}
        >
          L'art de mesurer
          <br />
          <em style={{ fontStyle: 'italic', color: T.cream }}>le temps</em>
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 1, ease: 'easeOut' }}
          style={{
            height: '1px',
            background: `linear-gradient(90deg, transparent, ${T.gold}, transparent)`,
            margin: '32px auto',
            maxWidth: '200px',
          }}
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          style={{
            fontFamily: "'EB Garamond', serif",
            fontSize: 'clamp(15px, 1.8vw, 20px)',
            fontStyle: 'italic',
            color: T.creamDim,
            maxWidth: '560px',
            margin: '0 auto',
            lineHeight: 1.7,
          }}
        >
          Depuis six générations, nous cisèlerons chaque seconde
          <br />
          avec la rigueur d'un art qui ne souffre aucun compromis.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6 }}
          style={{ marginTop: '48px' }}
        >
          <a
            href="#collections"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              fontFamily: "'Jost', sans-serif",
              fontSize: '11px',
              fontWeight: 300,
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: T.gold,
              textDecoration: 'none',
              border: `1px solid ${T.gold}`,
              padding: '16px 36px',
              transition: 'all 0.4s',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = T.gold;
              e.currentTarget.style.color = T.navy;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = T.gold;
            }}
          >
            Découvrir les collections
            <ArrowRight size={14} />
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        style={{
          position: 'absolute',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <Label>Défiler</Label>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          <ChevronDown size={16} color={T.gold} />
        </motion.div>
      </motion.div>

      {/* Bottom rule */}
      <div
        style={{
          position: 'absolute',
          bottom: '0',
          left: '60px',
          right: '60px',
          height: '1px',
          background: `linear-gradient(90deg, transparent, ${T.gold}44, transparent)`,
        }}
      />
    </section>
  );
}

// ─── MANIFESTO ───────────────────────────────────────────────────────────────

function Manifesto() {
  return (
    <section
      style={{
        background: T.navy,
        padding: 'clamp(80px, 12vw, 160px) clamp(24px, 6vw, 120px)',
        textAlign: 'center',
      }}
    >
      <FadeUp>
        <Label>Notre philosophie</Label>
      </FadeUp>

      <FadeUp delay={0.1}>
        <GoldRule className="" style={{ margin: '28px auto', maxWidth: '120px' } as React.CSSProperties} />
      </FadeUp>

      <FadeUp delay={0.2}>
        <blockquote
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(28px, 4.5vw, 58px)',
            fontWeight: 300,
            fontStyle: 'italic',
            color: T.white,
            lineHeight: 1.25,
            maxWidth: '900px',
            margin: '0 auto',
            letterSpacing: '-0.01em',
          }}
        >
          "Une montre Hora Viva n'est pas un objet que l'on porte.
          <br />
          C'est un héritage que l'on transmet."
        </blockquote>
      </FadeUp>

      <FadeUp delay={0.4}>
        <div
          style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: '10px',
            fontWeight: 300,
            letterSpacing: '0.3em',
            color: T.goldDim,
            marginTop: '32px',
            textTransform: 'uppercase',
          }}
        >
          — Édouard Marchetti, Maître Horloger · 7ème génération
        </div>
      </FadeUp>

      <FadeUp delay={0.5}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1px',
            maxWidth: '800px',
            margin: '80px auto 0',
            background: T.border,
          }}
        >
          {[
            { num: '190', label: 'ans de manufacture' },
            { num: '847', label: 'pièces par an' },
            { num: '312', label: 'composants par calibre' },
          ].map(({ num, label }) => (
            <div
              key={num}
              style={{
                background: T.navySoft,
                padding: '40px 24px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 'clamp(36px, 5vw, 56px)',
                  fontWeight: 300,
                  color: T.gold,
                  lineHeight: 1,
                }}
              >
                {num}
              </div>
              <div
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: '10px',
                  fontWeight: 200,
                  letterSpacing: '0.2em',
                  color: T.creamDim,
                  textTransform: 'uppercase',
                  marginTop: '12px',
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </FadeUp>
    </section>
  );
}

// ─── STICKY CROSSFADE ────────────────────────────────────────────────────────

const CROSSFADE_CHAPTERS = [
  {
    img: IMGS.movement,
    title: 'Le Mouvement',
    subtitle: 'Calibre HV-190 · 72h de réserve',
    desc: "Chaque composant est usiné à une précision de ±2 microns dans nos ateliers de Plan-les-Ouates. Le rotor central en or 18 carats signe chaque rotation d\'un éclat discret.",
  },
  {
    img: IMGS.dial,
    title: 'Le Boîtier',
    subtitle: 'Acier Grand Feu · 41mm',
    desc: "L\'acier inoxydable poli-brossé reçoit trente-sept passes de finition à la main. Les cornes, sculptées dans la masse, épousent le poignet avec une précision anatomique.",
  },
  {
    img: IMGS.editorial1,
    title: "L\'Héritage",
    subtitle: 'Six générations · Une signature',
    desc: "Fondée en 1834 par Léonard Marchetti, la maison a traversé deux siècles sans jamais délocaliser une seule opération. L\'ADN de Genève est inscrit dans chaque pivot.",
  },
] as const;

function StickyCrossfade() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  const [active, setActive] = useState(0);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (v < 0.33) setActive(0);
    else if (v < 0.66) setActive(1);
    else setActive(2);
  });

  return (
    <section
      ref={ref}
      id="manufacture"
      style={{ height: '320vh', position: 'relative' }}
    >
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* Photo crossfade */}
        <div style={{ position: 'absolute', inset: 0 }}>
          {CROSSFADE_CHAPTERS.map((ch, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: active === i ? 1 : 0 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              style={{ position: 'absolute', inset: 0 }}
            >
              <img
                src={ch.img}
                alt={ch.title}
                loading="lazy"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(90deg, rgba(10,14,23,0.9) 40%, rgba(10,14,23,0.3) 100%)',
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* Content panel */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            width: '100%',
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '0 clamp(24px, 6vw, 120px)',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '80px',
            alignItems: 'center',
          }}
        >
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <Label>{CROSSFADE_CHAPTERS[active].subtitle}</Label>
                <h2
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 'clamp(40px, 6vw, 72px)',
                    fontWeight: 300,
                    color: T.white,
                    marginTop: '16px',
                    lineHeight: 1.1,
                  }}
                >
                  {CROSSFADE_CHAPTERS[active].title}
                </h2>
                <GoldRule className="" style={{ margin: '28px 0', maxWidth: '100px' } as React.CSSProperties} />
                <p
                  style={{
                    fontFamily: "'EB Garamond', serif",
                    fontSize: 'clamp(16px, 1.5vw, 19px)',
                    lineHeight: 1.8,
                    color: T.creamDim,
                    maxWidth: '460px',
                  }}
                >
                  {CROSSFADE_CHAPTERS[active].desc}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Progress indicator */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
              alignSelf: 'flex-end',
              paddingBottom: '60px',
            }}
          >
            {CROSSFADE_CHAPTERS.map((ch, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '16px 0',
                  borderTop: i === 0 ? `1px solid ${T.border}` : undefined,
                  borderBottom: `1px solid ${T.border}`,
                  cursor: 'default',
                }}
              >
                <motion.div
                  animate={{
                    height: active === i ? '32px' : '12px',
                    background: active === i ? T.gold : T.border,
                  }}
                  transition={{ duration: 0.4 }}
                  style={{
                    width: '1px',
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    fontSize: '10px',
                    fontWeight: 300,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: active === i ? T.cream : T.creamDim,
                    transition: 'color 0.4s',
                    opacity: active === i ? 1 : 0.5,
                  }}
                >
                  {ch.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── COLLECTIONS ─────────────────────────────────────────────────────────────

const COLLECTIONS = [
  {
    name: 'Perpétuelle',
    ref: 'HV-190 · Cal. 190A',
    img: IMGS.hero,
    desc: 'Calendrier perpétuel mécanique. Le plus abouti de nos savoir-faire, réservé aux passionnés de grande complication.',
    complications: ['Calendrier perpétuel', 'Phases de lune', 'Tourbillon'],
  },
  {
    name: 'Saphir Nuit',
    ref: 'HV-44 · Cal. 44B',
    img: IMGS.collection1,
    desc: 'Cadran saphir translucide laissant apparaître le squelette du mouvement. Une fenêtre ouverte sur la mécanique.',
    complications: ['Squelette', 'Réserve de marche', 'Seconde morte'],
  },
  {
    name: 'Grand Feu',
    ref: 'HV-31 · Cal. 31C',
    img: IMGS.collection2,
    desc: 'Cadran émail Grand Feu, cuit à 850 °C pendant 72 heures. Une technique ancestrale maîtrisée par deux artisans en Europe.',
    complications: ['Émail Grand Feu', 'Heure universelle', 'Guichet date'],
  },
  {
    name: 'Lune Bleue',
    ref: 'HV-28 · Cal. 28D',
    img: IMGS.dial,
    desc: "Boîtier en titane grade 5, cadran en lapis-lazuli naturel. Pour ceux qui cherchent l\'exception absolue dans la discrétion.",
    complications: ['Phases de lune précises', 'Chronographe', 'Bicompax'],
  },
] as const;

function CollectionCard({
  col,
  delay,
}: {
  col: (typeof COLLECTIONS)[number];
  delay: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <FadeUp delay={delay}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: T.navyCard,
          border: `1px solid ${hovered ? T.goldDim : T.border}`,
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'border-color 0.4s, transform 0.4s, box-shadow 0.4s',
          transform: hovered ? 'translateY(-8px)' : 'translateY(0)',
          boxShadow: hovered
            ? `0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px ${T.goldDim}40`
            : '0 4px 20px rgba(0,0,0,0.3)',
        }}
      >
        {/* Image */}
        <div style={{ position: 'relative', overflow: 'hidden', height: '280px' }}>
          <img
            src={col.img}
            alt={col.name}
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              transition: 'transform 0.7s ease',
              transform: hovered ? 'scale(1.08)' : 'scale(1)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(10,14,23,0.6) 0%, transparent 60%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: `${T.navy}cc`,
              border: `1px solid ${T.borderGold}`,
              padding: '4px 10px',
            }}
          >
            <Label>{col.ref}</Label>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '28px 28px 32px' }}>
          <h3
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '28px',
              fontWeight: 400,
              color: T.white,
              marginBottom: '8px',
            }}
          >
            {col.name}
          </h3>
          <p
            style={{
              fontFamily: "'EB Garamond', serif",
              fontSize: '15px',
              lineHeight: 1.75,
              color: T.text,
              marginBottom: '20px',
            }}
          >
            {col.desc}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '24px' }}>
            {col.complications.map((c) => (
              <div
                key={c}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontFamily: "'Jost', sans-serif",
                  fontSize: '11px',
                  fontWeight: 300,
                  letterSpacing: '0.1em',
                  color: T.creamDim,
                }}
              >
                <div
                  style={{
                    width: '4px',
                    height: '4px',
                    background: T.gold,
                    borderRadius: '50%',
                    flexShrink: 0,
                  }}
                />
                {c}
              </div>
            ))}
          </div>

          <GoldRule />

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '20px',
            }}
          >
            <span
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: '10px',
                fontWeight: 300,
                letterSpacing: '0.2em',
                color: T.goldDim,
                textTransform: 'uppercase',
              }}
            >
              Prix sur demande
            </span>
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'none',
                border: 'none',
                fontFamily: "'Jost', sans-serif",
                fontSize: '10px',
                fontWeight: 400,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: T.gold,
                cursor: 'pointer',
                padding: 0,
                transition: 'gap 0.3s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.gap = '14px')}
              onMouseLeave={(e) => (e.currentTarget.style.gap = '8px')}
            >
              Demander un rendez-vous
              <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </FadeUp>
  );
}

function Collections() {
  return (
    <section
      id="collections"
      style={{
        background: T.navySoft,
        padding: 'clamp(80px, 10vw, 140px) clamp(24px, 6vw, 80px)',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <FadeUp>
          <div style={{ textAlign: 'center', marginBottom: '72px' }}>
            <Label>Nos créations</Label>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(36px, 5vw, 64px)',
                fontWeight: 300,
                color: T.white,
                marginTop: '16px',
                marginBottom: '20px',
              }}
            >
              Les Collections
            </h2>
            <GoldRule className="" style={{ maxWidth: '120px', margin: '0 auto' } as React.CSSProperties} />
          </div>
        </FadeUp>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2px',
          }}
        >
          {COLLECTIONS.map((col, i) => (
            <CollectionCard key={col.name} col={col} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CRAFTSMANSHIP EDITORIAL ──────────────────────────────────────────────────

const EDITORIAL_ROWS = [
  {
    img: IMGS.editorial2,
    label: 'Finitions',
    title: 'La main avant la machine',
    text: "Chaque pont de calibre reçoit un anglage manuel. Cette opération, qui nécessite douze années d\'apprentissage, confère au mouvement ses reflets caractéristiques — impossibles à reproduire industriellement. Nos artisans passent jusqu\'à quarante heures sur un seul calibre avant qu\'il ne quitte l\'atelier.",
    side: 'left' as const,
  },
  {
    img: IMGS.collection1,
    label: 'Métallurgie',
    title: "L\'alliage du temps",
    text: "Notre fonderie interne élabore des alliages exclusifs depuis 1912. Le laiton utilisé pour nos platines est enrichi de bismuth pour améliorer l\'usinabilité à l\'échelle micronique. Une propriété de la maison que personne n\'a réussi à reproduire.",
    side: 'right' as const,
  },
] as const;

function EditorialRow({
  row,
  index,
}: {
  row: (typeof EDITORIAL_ROWS)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  const isLeft = row.side === 'left';

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2px',
        direction: isLeft ? 'ltr' : 'rtl',
      }}
    >
      <div
        style={{
          overflow: 'hidden',
          height: 'clamp(300px, 45vw, 560px)',
          direction: 'ltr',
        }}
      >
        <img
          src={row.img}
          alt={row.title}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.8s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        />
      </div>

      <div
        style={{
          background: T.navyCard,
          padding: 'clamp(40px, 6vw, 80px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          direction: 'ltr',
        }}
      >
        <Label>{row.label}</Label>
        <h3
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(28px, 3.5vw, 44px)',
            fontWeight: 300,
            color: T.white,
            marginTop: '16px',
            marginBottom: '24px',
            lineHeight: 1.2,
          }}
        >
          {row.title}
        </h3>
        <GoldRule className="" style={{ maxWidth: '80px', marginBottom: '28px' } as React.CSSProperties} />
        <p
          style={{
            fontFamily: "'EB Garamond', serif",
            fontSize: 'clamp(16px, 1.5vw, 18px)',
            lineHeight: 1.85,
            color: T.text,
          }}
        >
          {row.text}
        </p>
      </div>
    </motion.div>
  );
}

function CraftsmanshipEditorial() {
  return (
    <section
      style={{
        background: T.navy,
        padding: 'clamp(80px, 10vw, 140px) 0',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 clamp(24px, 4vw, 60px)' }}>
        <FadeUp>
          <div style={{ textAlign: 'center', marginBottom: '72px' }}>
            <Label>Artisanat</Label>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(32px, 4.5vw, 56px)',
                fontWeight: 300,
                color: T.white,
                marginTop: '16px',
              }}
            >
              La manufacture en détail
            </h2>
          </div>
        </FadeUp>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {EDITORIAL_ROWS.map((row, i) => (
          <EditorialRow key={row.label} row={row} index={i} />
        ))}
      </div>
    </section>
  );
}

// ─── STICKY-SIDE SPECS ───────────────────────────────────────────────────────

const SPECS = [
  { label: 'Mouvement', value: 'Calibre HV-190A — Manufacture exclusive' },
  { label: 'Fréquence', value: '28 800 alt/h (4 Hz)' },
  { label: 'Réserve de marche', value: '72 heures minimum' },
  { label: 'Composants', value: '312 pièces usinées en interne' },
  { label: 'Boîtier', value: 'Acier inoxydable 316L — 41 mm' },
  { label: 'Étanchéité', value: '50 mètres (5 ATM)' },
  { label: 'Verre', value: 'Saphir anti-reflet double face' },
  { label: 'Bracelet', value: 'Alligator Louisiana — boucle déployante or 18ct' },
  { label: 'Finition', value: '37 étapes manuelles — 6 semaines d\'atelier' },
] as const;

function StickySpecs() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center'],
  });

  return (
    <section
      id="collections"
      style={{
        background: T.navySoft,
        padding: 'clamp(80px, 10vw, 140px) clamp(24px, 6vw, 80px)',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <FadeUp>
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <Label>Spécifications techniques</Label>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(32px, 4.5vw, 56px)',
                fontWeight: 300,
                color: T.white,
                marginTop: '16px',
              }}
            >
              Le Calibre HV-190A
            </h2>
          </div>
        </FadeUp>

        <div
          ref={containerRef}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '80px',
            alignItems: 'start',
          }}
        >
          {/* Sticky watch image */}
          <div style={{ position: 'sticky', top: '100px' }}>
            <FadeUp>
              <div
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '0',
                  border: `1px solid ${T.border}`,
                }}
              >
                <img
                  src={IMGS.movement}
                  alt="Calibre HV-190A — détail du mouvement"
                  loading="lazy"
                  style={{
                    width: '100%',
                    aspectRatio: '4/5',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    display: 'block',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '32px',
                    background: 'linear-gradient(to top, rgba(10,14,23,0.95) 0%, transparent 100%)',
                  }}
                >
                  <Label>Calibre exclusif · 100% manufacture</Label>
                </div>
              </div>
            </FadeUp>
          </div>

          {/* Scrolling specs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {SPECS.map((spec, i) => (
              <FadeUp key={spec.label} delay={i * 0.06}>
                <div
                  style={{
                    padding: '24px 0',
                    borderBottom: `1px solid ${T.border}`,
                    display: 'grid',
                    gridTemplateColumns: '140px 1fr',
                    gap: '24px',
                    alignItems: 'baseline',
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Jost', sans-serif",
                      fontSize: '10px',
                      fontWeight: 300,
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      color: T.gold,
                    }}
                  >
                    {spec.label}
                  </span>
                  <span
                    style={{
                      fontFamily: "'EB Garamond', serif",
                      fontSize: '17px',
                      color: T.cream,
                      lineHeight: 1.5,
                    }}
                  >
                    {spec.value}
                  </span>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── HERITAGE TIMELINE ───────────────────────────────────────────────────────

const TIMELINE = [
  { year: '1834', event: 'Fondation de la maison par Léonard Marchetti à Genève, au cœur du quartier des Eaux-Vives.' },
  { year: '1872', event: 'Premier calibre manufacture entièrement réalisé en interne. Brevets déposés sur l\'échappement à ancre modifié.' },
  { year: '1921', event: 'Création de l\'atelier d\'émail Grand Feu. Hora Viva devient l\'une des trois dernières maisons à maîtriser cette technique.' },
  { year: '1967', event: 'Lancement de la Perpétuelle — premier calendrier perpétuel de petite complication suisse certifié COSC.' },
  { year: '2001', event: 'Ouverture de la nouvelle manufacture à Plan-les-Ouates. 4 200 m² dédiés exclusivement à l\'horlogerie mécanique.' },
  { year: '2024', event: 'Présentation du Calibre HV-190A au SIHH — 312 composants, 72h de réserve, tourbillon volant côtes de Genève.' },
] as const;

function Heritage() {
  return (
    <section
      id="héritage"
      style={{
        background: T.navy,
        padding: 'clamp(80px, 10vw, 140px) clamp(24px, 6vw, 80px)',
      }}
    >
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <FadeUp>
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <Label>Depuis 1834</Label>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(32px, 4.5vw, 56px)',
                fontWeight: 300,
                color: T.white,
                marginTop: '16px',
              }}
            >
              Une chronologie
              <br />
              <em style={{ fontStyle: 'italic' }}>de l'excellence</em>
            </h2>
          </div>
        </FadeUp>

        <div style={{ position: 'relative' }}>
          {/* Vertical gold line */}
          <div
            style={{
              position: 'absolute',
              left: '80px',
              top: 0,
              bottom: 0,
              width: '1px',
              background: `linear-gradient(to bottom, transparent, ${T.gold}44, transparent)`,
            }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {TIMELINE.map((item, i) => (
              <FadeUp key={item.year} delay={i * 0.1}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '160px 1fr',
                    gap: '40px',
                    padding: '32px 0',
                    borderBottom: i < TIMELINE.length - 1 ? `1px solid ${T.border}` : 'none',
                    alignItems: 'start',
                  }}
                >
                  <div style={{ position: 'relative', paddingLeft: '0' }}>
                    {/* Dot */}
                    <div
                      style={{
                        position: 'absolute',
                        left: '76px',
                        top: '8px',
                        width: '9px',
                        height: '9px',
                        background: T.gold,
                        borderRadius: '50%',
                        transform: 'translate(-50%, 0)',
                        boxShadow: `0 0 12px ${T.gold}60`,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: '32px',
                        fontWeight: 300,
                        color: T.gold,
                        display: 'block',
                        paddingLeft: '0',
                      }}
                    >
                      {item.year}
                    </span>
                  </div>
                  <p
                    style={{
                      fontFamily: "'EB Garamond', serif",
                      fontSize: '17px',
                      lineHeight: 1.75,
                      color: T.text,
                      paddingTop: '6px',
                    }}
                  >
                    {item.event}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────

const TESTIMONIALS = [
  {
    quote: "Ma Perpétuelle Hora Viva accompagne chaque décision importante de ma vie depuis vingt-deux ans. Ce n\'est pas une montre — c\'est un compagnon silencieux et fidèle.",
    author: 'Henri de Vauclaire',
    role: 'Collectionneur, Paris',
    stars: 5,
  },
  {
    quote: "J\'ai visité quarante manufactures dans ma vie. Chez Hora Viva, on sent immédiatement que rien n\'est fait pour l\'apparence. Tout est fait pour durer deux siècles.",
    author: 'Kenji Watanabe',
    role: 'Chronobiologiste & Horloger amateur, Tokyo',
    stars: 5,
  },
] as const;

function Testimonials() {
  return (
    <section
      style={{
        background: T.navyCard,
        padding: 'clamp(80px, 10vw, 140px) clamp(24px, 6vw, 80px)',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <FadeUp>
          <div style={{ textAlign: 'center', marginBottom: '72px' }}>
            <Label>Collectionneurs</Label>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(32px, 4.5vw, 56px)',
                fontWeight: 300,
                color: T.white,
                marginTop: '16px',
              }}
            >
              Ils portent Hora Viva
            </h2>
          </div>
        </FadeUp>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
            gap: '2px',
          }}
        >
          {TESTIMONIALS.map((t, i) => (
            <FadeUp key={t.author} delay={i * 0.15}>
              <div
                style={{
                  background: T.navySoft,
                  border: `1px solid ${T.border}`,
                  padding: 'clamp(32px, 4vw, 56px)',
                  position: 'relative',
                }}
              >
                {/* Opening quote mark */}
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '80px',
                    fontWeight: 300,
                    color: T.goldDim,
                    lineHeight: 0.8,
                    marginBottom: '24px',
                    opacity: 0.4,
                  }}
                >
                  "
                </div>

                <div
                  style={{ display: 'flex', gap: '4px', marginBottom: '20px' }}
                >
                  {Array.from({ length: t.stars }).map((_, si) => (
                    <Star key={si} size={12} color={T.gold} fill={T.gold} />
                  ))}
                </div>

                <p
                  style={{
                    fontFamily: "'EB Garamond', serif",
                    fontSize: 'clamp(17px, 1.8vw, 20px)',
                    fontStyle: 'italic',
                    lineHeight: 1.75,
                    color: T.cream,
                    marginBottom: '32px',
                  }}
                >
                  {t.quote}
                </p>

                <GoldRule />

                <div style={{ marginTop: '20px' }}>
                  <div
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: '18px',
                      fontWeight: 500,
                      color: T.white,
                    }}
                  >
                    {t.author}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Jost', sans-serif",
                      fontSize: '11px',
                      fontWeight: 200,
                      letterSpacing: '0.15em',
                      color: T.goldDim,
                      marginTop: '4px',
                    }}
                  >
                    {t.role}
                  </div>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── APPOINTMENT FORM ─────────────────────────────────────────────────────────

function AppointmentForm() {
  const [form, setForm] = useState({
    nom: '',
    email: '',
    collection: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setSubmitted(true);
      }, 1400);
    },
    []
  );

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.03)',
    border: `1px solid ${T.border}`,
    borderRadius: 0,
    padding: '16px 20px',
    fontFamily: "'EB Garamond', serif",
    fontSize: '17px',
    color: T.cream,
    outline: 'none',
    transition: 'border-color 0.3s',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: "'Jost', sans-serif",
    fontSize: '10px',
    fontWeight: 300,
    letterSpacing: '0.25em',
    textTransform: 'uppercase',
    color: T.goldDim,
    marginBottom: '8px',
  };

  return (
    <section
      id="rendez-vous"
      style={{
        background: T.navy,
        padding: 'clamp(80px, 10vw, 140px) clamp(24px, 6vw, 80px)',
      }}
    >
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <FadeUp>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <Label>Contact & Atelier</Label>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(32px, 4.5vw, 56px)',
                fontWeight: 300,
                color: T.white,
                marginTop: '16px',
                marginBottom: '16px',
              }}
            >
              Demander un rendez-vous
            </h2>
            <p
              style={{
                fontFamily: "'EB Garamond', serif",
                fontSize: '17px',
                fontStyle: 'italic',
                color: T.creamDim,
                lineHeight: 1.7,
              }}
            >
              Notre conseiller personnel vous contactera sous 48 heures pour
              organiser une présentation privée dans nos salons genevois.
            </p>
          </div>
        </FadeUp>

        <FadeUp delay={0.1}>
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  textAlign: 'center',
                  padding: '80px 40px',
                  border: `1px solid ${T.goldDim}`,
                  background: `${T.navyCard}`,
                }}
              >
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    border: `1px solid ${T.gold}`,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px',
                  }}
                >
                  <Check size={20} color={T.gold} />
                </div>
                <h3
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '32px',
                    fontWeight: 300,
                    color: T.white,
                    marginBottom: '12px',
                  }}
                >
                  Demande reçue
                </h3>
                <p
                  style={{
                    fontFamily: "'EB Garamond', serif",
                    fontSize: '17px',
                    fontStyle: 'italic',
                    color: T.creamDim,
                    lineHeight: 1.7,
                  }}
                >
                  Notre équipe vous contactera sous 48 heures.
                  <br />
                  Nous vous remercions de votre intérêt pour Hora Viva.
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
              >
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '2px',
                  }}
                >
                  <div>
                    <label htmlFor="nom" style={labelStyle}>
                      Nom complet
                    </label>
                    <input
                      id="nom"
                      name="nom"
                      type="text"
                      required
                      placeholder="Jean-Pierre Müller"
                      value={form.nom}
                      onChange={handleChange}
                      style={inputStyle}
                      onFocus={(e) =>
                        (e.currentTarget.style.borderColor = T.goldDim)
                      }
                      onBlur={(e) =>
                        (e.currentTarget.style.borderColor = T.border)
                      }
                    />
                  </div>
                  <div>
                    <label htmlFor="email" style={labelStyle}>
                      Adresse e-mail
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="vous@exemple.com"
                      value={form.email}
                      onChange={handleChange}
                      style={inputStyle}
                      onFocus={(e) =>
                        (e.currentTarget.style.borderColor = T.goldDim)
                      }
                      onBlur={(e) =>
                        (e.currentTarget.style.borderColor = T.border)
                      }
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="collection" style={labelStyle}>
                    Collection d'intérêt
                  </label>
                  <select
                    id="collection"
                    name="collection"
                    required
                    value={form.collection}
                    onChange={handleChange}
                    style={{
                      ...inputStyle,
                      appearance: 'none',
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238a6e33' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 20px center',
                      paddingRight: '48px',
                      cursor: 'pointer',
                    }}
                    onFocus={(e) =>
                      (e.currentTarget.style.borderColor = T.goldDim)
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderColor = T.border)
                    }
                  >
                    <option value="" style={{ background: T.navyCard }}>
                      Sélectionner une collection
                    </option>
                    <option value="perpetuelle" style={{ background: T.navyCard }}>
                      Perpétuelle — HV-190
                    </option>
                    <option value="saphir" style={{ background: T.navyCard }}>
                      Saphir Nuit — HV-44
                    </option>
                    <option value="grandfeu" style={{ background: T.navyCard }}>
                      Grand Feu — HV-31
                    </option>
                    <option value="lune" style={{ background: T.navyCard }}>
                      Lune Bleue — HV-28
                    </option>
                    <option value="bespoke" style={{ background: T.navyCard }}>
                      Pièce unique sur mesure
                    </option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" style={labelStyle}>
                    Message (optionnel)
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder="Précisez vos souhaits, votre budget indicatif ou toute question particulière..."
                    value={form.message}
                    onChange={handleChange}
                    style={{
                      ...inputStyle,
                      resize: 'vertical',
                      minHeight: '120px',
                    }}
                    onFocus={(e) =>
                      (e.currentTarget.style.borderColor = T.goldDim)
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderColor = T.border)
                    }
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    background: loading ? T.goldDim : T.gold,
                    border: 'none',
                    padding: '20px 40px',
                    fontFamily: "'Jost', sans-serif",
                    fontSize: '11px',
                    fontWeight: 400,
                    letterSpacing: '0.3em',
                    textTransform: 'uppercase',
                    color: T.navy,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'background 0.3s, transform 0.2s',
                    alignSelf: 'flex-start',
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) e.currentTarget.style.background = T.goldBright;
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) e.currentTarget.style.background = T.gold;
                  }}
                >
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                        style={{
                          width: '14px',
                          height: '14px',
                          border: `1px solid ${T.navy}`,
                          borderTopColor: 'transparent',
                          borderRadius: '50%',
                        }}
                      />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      Envoyer la demande
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </FadeUp>
      </div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer
      id="contact"
      style={{
        background: '#070b14',
        borderTop: `1px solid ${T.border}`,
        padding: 'clamp(60px, 8vw, 100px) clamp(24px, 6vw, 80px) 40px',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr',
            gap: '60px',
            marginBottom: '60px',
          }}
        >
          {/* Brand */}
          <div>
            <div
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '24px',
                fontWeight: 400,
                letterSpacing: '0.15em',
                color: T.cream,
                marginBottom: '4px',
              }}
            >
              HORA VIVA
            </div>
            <div
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: '9px',
                fontWeight: 200,
                letterSpacing: '0.4em',
                color: T.gold,
                marginBottom: '24px',
              }}
            >
              GENÈVE · MANUFACTURE HORLOGÈRE
            </div>
            <p
              style={{
                fontFamily: "'EB Garamond', serif",
                fontSize: '15px',
                lineHeight: 1.8,
                color: T.creamDim,
                maxWidth: '280px',
                fontStyle: 'italic',
              }}
            >
              Six générations d'horlogers genevois au service d'un seul idéal :
              l'excellence sans compromis.
            </p>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                marginTop: '32px',
              }}
            >
              {[
                { icon: <MapPin size={12} color={T.goldDim} />, text: '14, rue de Rive · CH-1204 Genève' },
                { icon: <Phone size={12} color={T.goldDim} />, text: '+41 22 310 88 40' },
                { icon: <Mail size={12} color={T.goldDim} />, text: 'atelier@horaviva.ch' },
              ].map(({ icon, text }) => (
                <div
                  key={text}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontFamily: "'Jost', sans-serif",
                    fontSize: '12px',
                    fontWeight: 300,
                    letterSpacing: '0.05em',
                    color: T.creamDim,
                  }}
                >
                  {icon}
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* Collections */}
          <div>
            <div
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: '10px',
                fontWeight: 300,
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: T.gold,
                marginBottom: '24px',
              }}
            >
              Collections
            </div>
            {['Perpétuelle', 'Saphir Nuit', 'Grand Feu', 'Lune Bleue', 'Sur mesure'].map((l) => (
              <div key={l} style={{ marginBottom: '12px' }}>
                <a
                  href="#collections"
                  style={{
                    fontFamily: "'EB Garamond', serif",
                    fontSize: '16px',
                    color: T.creamDim,
                    textDecoration: 'none',
                    transition: 'color 0.3s',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = T.cream)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = T.creamDim)}
                >
                  {l}
                </a>
              </div>
            ))}
          </div>

          {/* Manufacture */}
          <div>
            <div
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: '10px',
                fontWeight: 300,
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: T.gold,
                marginBottom: '24px',
              }}
            >
              La Maison
            </div>
            {['Notre histoire', 'La manufacture', 'Les artisans', 'Certifications COSC', 'Presse'].map((l) => (
              <div key={l} style={{ marginBottom: '12px' }}>
                <a
                  href="#héritage"
                  style={{
                    fontFamily: "'EB Garamond', serif",
                    fontSize: '16px',
                    color: T.creamDim,
                    textDecoration: 'none',
                    transition: 'color 0.3s',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = T.cream)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = T.creamDim)}
                >
                  {l}
                </a>
              </div>
            ))}
          </div>

          {/* Services */}
          <div>
            <div
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: '10px',
                fontWeight: 300,
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: T.gold,
                marginBottom: '24px',
              }}
            >
              Services
            </div>
            {['Rendez-vous atelier', 'Révision & entretien', 'Restauration', 'Expertise & certificat', 'Vente privée'].map((l) => (
              <div key={l} style={{ marginBottom: '12px' }}>
                <a
                  href="#rendez-vous"
                  style={{
                    fontFamily: "'EB Garamond', serif",
                    fontSize: '16px',
                    color: T.creamDim,
                    textDecoration: 'none',
                    transition: 'color 0.3s',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = T.cream)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = T.creamDim)}
                >
                  {l}
                </a>
              </div>
            ))}
          </div>
        </div>

        <GoldRule />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '32px',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <span
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: '10px',
              fontWeight: 200,
              letterSpacing: '0.15em',
              color: T.creamDim,
              opacity: 0.5,
            }}
          >
            © 2024 Hora Viva SA · Genève · Tous droits réservés
          </span>
          <div style={{ display: 'flex', gap: '24px' }}>
            {['Mentions légales', 'Confidentialité', 'CGV'].map((l) => (
              <a
                key={l}
                href="#contact"
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: '9px',
                  fontWeight: 200,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: T.creamDim,
                  opacity: 0.4,
                  textDecoration: 'none',
                  transition: 'opacity 0.3s',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.4')}
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Responsive footer grid */}
      <style>{`
        @media (max-width: 1024px) {
          footer > div > div:first-of-type {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 640px) {
          footer > div > div:first-of-type {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}

// ─── PAGE ROOT ────────────────────────────────────────────────────────────────

export default function HoraVivaPage() {
  // Inject global CSS once
  useEffect(() => {
    const id = 'hora-viva-global-css';
    if (!document.getElementById(id)) {
      const el = document.createElement('style');
      el.id = id;
      el.textContent = GLOBAL_CSS;
      document.head.appendChild(el);
    }
    return () => {
      const el = document.getElementById(id);
      if (el) el.remove();
    };
  }, []);

  return (
    <main
      suppressHydrationWarning
      style={{ background: T.navy, minHeight: '100vh' }}
    >
      <Nav />
      <Hero />
      <Manifesto />
      <StickyCrossfade />
      <Collections />
      <CraftsmanshipEditorial />
      <StickySpecs />
      <Heritage />
      <Testimonials />
      <AppointmentForm />
      <Footer />
    </main>
  );
}
