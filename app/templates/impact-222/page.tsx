"use client";
// @ts-nocheck

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import {
  Building2,
  MapPin,
  ArrowRight,
  ArrowUpRight,
  Quote,
  Mail,
  Phone,
  Clock,
  Check,
  Menu,
  X,
  Maximize2,
  Compass,
  Handshake,
  Search,
  ChevronDown,
} from 'lucide-react';

/* ════════════════════════════════════════════════════════════════════════════
   SOLIS IMMOBILIER — Immobilier & architecture de prestige (France)
   Reference-grade scroll choreography with real photography.
   Palette : blanc chaud / bleu nuit profond / champagne doré.
   Self-contained client component. Only react / framer-motion / lucide-react.
   ════════════════════════════════════════════════════════════════════════════ */

/* ─────────────────────────── DESIGN TOKENS ─────────────────────────── */


// Lightens (positive percent) or darkens (negative) a #rrggbb hex color —
// used to derive companion shades from the client's brand color.
function shadeColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  if (isNaN(num)) return hex;
  const amt = Math.round(2.55 * percent);
  const r = Math.max(0, Math.min(255, (num >> 16) + amt));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amt));
  const b = Math.max(0, Math.min(255, (num & 0x0000ff) + amt));
  return `#${(0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1)}`;
}

let C: Record<string, string> = {
  bg: '#faf9f6',
  bgSoft: '#f2f0ea',
  bgCard: '#ffffff',
  navy: '#11182a',
  navy2: '#1c2540',
  navySoft: '#2c3654',
  gold: '#b8944a',
  goldSoft: '#cdab66',
  goldFaint: '#efe6d4',
  text: '#11182a',
  textSoft: '#4d5366',
  muted: '#8a8f9e',
  line: '#e5e2d9',
  lineDark: '#d4d0c4',
  white: '#ffffff',
  font: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
  serif:
    "'Cormorant Garamond', 'Playfair Display', Georgia, 'Times New Roman', serif",
};

/* Pre-verified Unsplash photo ids (return 200). Only w/q/fit altered. */
const PHOTO = {
  facade:
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop',
  interior:
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1600&auto=format&fit=crop',
  city:
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1600&auto=format&fit=crop',
  pool:
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1600&auto=format&fit=crop',
  living:
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1600&auto=format&fit=crop',
  villa:
    'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1600&auto=format&fit=crop',
  modern:
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1600&auto=format&fit=crop',
} as const;

const hero = (w: number, q = 85): string =>
  `https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=${q}&w=${w}&auto=format&fit=crop`;

/* ─────────────────────────── SHARED PRIMITIVES ─────────────────────────── */

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const MAXW = 1280;

const Section: React.FC<{
  children: React.ReactNode;
  id?: string;
  style?: React.CSSProperties;
}> = ({ children, id, style }) => (
  <section
    id={id}
    style={{
      width: '100%',
      padding: 'clamp(72px, 9vw, 132px) clamp(20px, 5vw, 64px)',
      position: 'relative',
      ...style,
    }}
  >
    <div style={{ maxWidth: MAXW, margin: '0 auto', width: '100%' }}>
      {children}
    </div>
  </section>
);

const Eyebrow: React.FC<{ children: React.ReactNode; light?: boolean }> = ({
  children,
  light,
}) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      fontFamily: C.font,
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: '0.22em',
      textTransform: 'uppercase',
      color: light ? C.goldSoft : C.gold,
    }}
  >
    <span
      style={{
        width: 26,
        height: 1,
        background: light ? C.goldSoft : C.gold,
        display: 'inline-block',
      }}
    />
    {children}
  </span>
);

const Reveal: React.FC<{
  children: React.ReactNode;
  delay?: number;
  y?: number;
  style?: React.CSSProperties;
}> = ({ children, delay = 0, y = 28, style }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-12% 0px' });
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, ease: EASE, delay }}
      style={style}
    >
      {children}
    </motion.div>
  );
};

/* Count-up that triggers on view */
const CountUp: React.FC<{
  to: number;
  decimals?: number;
  duration?: number;
}> = ({ to, decimals = 0, duration = 1900 }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-20% 0px' });
  const [val, setVal] = useState<number>(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number): void => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(to * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setVal(to);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);

  return (
    <span ref={ref} suppressHydrationWarning>
      {val.toLocaleString('fr-FR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
    </span>
  );
};

/* ─────────────────────────── NAV ─────────────────────────── */

const NAV_LINKS: { label: string; href: string }[] = [
  { label: 'Sélection', href: '#selection' },
  { label: 'Signature', href: '#signature' },
  { label: 'Approche', href: '#approche' },
  { label: 'Avis', href: '#avis' },
  { label: 'Contact', href: '#contact' },
];

const Nav: React.FC = () => {
  const [solid, setSolid] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    const onScroll = (): void => setSolid(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -28, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: EASE }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: solid ? 'rgba(17,24,42,0.92)' : 'transparent',
        backdropFilter: solid ? 'blur(14px) saturate(140%)' : 'none',
        WebkitBackdropFilter: solid ? 'blur(14px) saturate(140%)' : 'none',
        borderBottom: `1px solid ${
          solid ? 'rgba(255,255,255,0.08)' : 'transparent'
        }`,
        transition:
          'background .5s ease, border-color .5s ease, backdrop-filter .5s ease',
      }}
    >
      <div
        style={{
          maxWidth: MAXW,
          margin: '0 auto',
          padding: '0 clamp(20px, 5vw, 64px)',
          height: solid ? 68 : 84,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'height .4s ease',
        }}
      >
        {/* Logo */}
        <a
          href="#top"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            textDecoration: 'none',
          }}
        >
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
              <span
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 2,
                  background: C.gold,
                  display: 'grid',
                  placeItems: 'center',
                  boxShadow: '0 4px 18px rgba(184,148,74,0.4)',
                }}
              >
                <Building2 size={20} color={C.navy} strokeWidth={2.2} />
              </span>
              <span style={{ lineHeight: 1 }}>
                <span
                  style={{
                    display: 'block',
                    fontFamily: C.serif,
                    fontSize: 22,
                    fontWeight: 600,
                    color: C.white,
                    letterSpacing: '0.02em',
                  }}
                >
                  Solis
                </span>
                <span
                  style={{
                    display: 'block',
                    fontFamily: C.font,
                    fontSize: 9.5,
                    fontWeight: 600,
                    letterSpacing: '0.34em',
                    textTransform: 'uppercase',
                    color: C.goldSoft,
                    marginTop: 2,
                  }}
                >
                  Immobilier
                </span>
              </span>
            </>
          )}
        </a>

        {/* Desktop links */}
        <div
          className="solis-desktop-nav"
          style={{ display: 'flex', alignItems: 'center', gap: 36 }}
        >
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              style={{
                fontFamily: C.font,
                fontSize: 14,
                fontWeight: 500,
                color: 'rgba(255,255,255,0.82)',
                textDecoration: 'none',
                letterSpacing: '0.01em',
                transition: 'color .25s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = C.goldSoft;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(255,255,255,0.82)';
              }}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            style={{
              fontFamily: C.font,
              fontSize: 13.5,
              fontWeight: 600,
              color: C.navy,
              background: C.gold,
              padding: '11px 22px',
              borderRadius: 2,
              textDecoration: 'none',
              letterSpacing: '0.02em',
              transition: 'background .25s, transform .25s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = C.goldSoft;
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = C.gold;
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Prendre rendez-vous
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="solis-mobile-toggle"
          aria-label="Menu"
          onClick={() => setOpen((o) => !o)}
          style={{
            display: 'none',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: C.white,
            padding: 6,
          }}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.35, ease: EASE }}
          style={{
            background: 'rgba(17,24,42,0.98)',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            padding: '18px clamp(20px,5vw,64px) 28px',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              style={{
                fontFamily: C.font,
                fontSize: 16,
                fontWeight: 500,
                color: 'rgba(255,255,255,0.88)',
                textDecoration: 'none',
                padding: '12px 0',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            style={{
              marginTop: 14,
              textAlign: 'center',
              fontFamily: C.font,
              fontSize: 15,
              fontWeight: 600,
              color: C.navy,
              background: C.gold,
              padding: '14px',
              borderRadius: 2,
              textDecoration: 'none',
            }}
          >
            Prendre rendez-vous
          </a>
        </motion.div>
      )}
    </motion.nav>
  );
};

/* ─────────────────────────── HERO (PARALLAX) ─────────────────────────── */

const Hero: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '14%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '52%']);
  const subY = useTransform(scrollYProgress, [0, 1], ['0%', '90%']);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scrimO = useTransform(scrollYProgress, [0, 1], [0.55, 0.78]);

  return (
    <div
      ref={ref}
      id="top"
      style={{
        position: 'relative',
        height: '100dvh',
        minHeight: 640,
        overflow: 'hidden',
        background: C.navy,
      }}
    >
      {/* Parallax image */}
      <motion.div
        style={{
          position: 'absolute',
          inset: '-6% 0 -6% 0',
          scale: imgScale,
          y: imgY,
          willChange: 'transform',
        }}
      >
        <img
          src={hero(2000, 85)}
          alt="Architecture résidentielle contemporaine baignée de lumière"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      </motion.div>

      {/* Scrim */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(17,24,42,0.62) 0%, rgba(17,24,42,0.32) 38%, rgba(17,24,42,0.74) 100%)',
          opacity: scrimO,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(120% 80% at 20% 30%, rgba(17,24,42,0.3) 0%, transparent 60%)',
        }}
      />

      {/* Content */}
      <motion.div
        style={{
          position: 'relative',
          zIndex: 3,
          height: '100%',
          maxWidth: MAXW,
          margin: '0 auto',
          padding: '0 clamp(20px, 5vw, 64px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          opacity: fade,
        }}
      >
        <motion.div style={{ y: textY, maxWidth: 880 }}>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.25 }}
          >
            <Eyebrow light>Immobilier &amp; architecture de prestige</Eyebrow>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.05, ease: EASE, delay: 0.38 }}
            style={{
              fontFamily: C.serif,
              fontSize: 'clamp(44px, 7.4vw, 104px)',
              lineHeight: 1.01,
              fontWeight: 500,
              color: C.white,
              margin: '24px 0 0',
              letterSpacing: '-0.015em',
            }}
          >
            Des espaces qui
            <br />
            <span style={{ fontStyle: 'italic', color: C.goldSoft }}>
              transforment
            </span>{' '}
            des vies
          </motion.h1>

          <motion.p
            style={{ y: subY }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.55 }}
          >
            <span
              style={{
                display: 'block',
                fontFamily: C.font,
                fontSize: 'clamp(16px, 2vw, 20px)',
                lineHeight: 1.65,
                color: 'rgba(255,255,255,0.82)',
                maxWidth: 560,
                marginTop: 28,
                fontWeight: 400,
              }}
            >
              Solis accompagne une clientèle exigeante dans l&apos;acquisition et
              la valorisation de biens d&apos;exception, de la Provence aux plus
              belles adresses parisiennes.
            </span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.72 }}
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 16,
              marginTop: 40,
            }}
          >
            <a
              href="#selection"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                fontFamily: C.font,
                fontSize: 15,
                fontWeight: 600,
                color: C.navy,
                background: C.gold,
                padding: '16px 30px',
                borderRadius: 2,
                textDecoration: 'none',
                letterSpacing: '0.01em',
                transition: 'background .25s, transform .25s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = C.goldSoft;
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = C.gold;
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Découvrir la sélection <ArrowRight size={17} />
            </a>
            <a
              href="#contact"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                fontFamily: C.font,
                fontSize: 15,
                fontWeight: 600,
                color: C.white,
                background: 'transparent',
                padding: '16px 30px',
                borderRadius: 2,
                textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.4)',
                letterSpacing: '0.01em',
                transition: 'background .25s, border-color .25s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.7)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)';
              }}
            >
              Estimer mon bien
            </a>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: 30,
          left: '50%',
          x: '-50%',
          zIndex: 4,
          opacity: fade,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span
          style={{
            fontFamily: C.font,
            fontSize: 10.5,
            fontWeight: 600,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.6)',
          }}
        >
          Faites défiler
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={20} color="rgba(255,255,255,0.7)" />
        </motion.div>
      </motion.div>
    </div>
  );
};

/* ─────────────────────────── STATS BAND (COUNT-UP) ─────────────────────────── */

type Stat = {
  to: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  label: string;
};

const STATS: Stat[] = [
  { to: 847, label: 'Projets accompagnés' },
  {
    to: 2.3,
    decimals: 1,
    prefix: '€',
    suffix: ' Md',
    label: 'Volume transacté',
  },
  { to: 14, label: 'Villes en France' },
  { to: 96, suffix: ' %', label: 'Clients satisfaits' },
];

const StatsBand: React.FC = () => (
  <Section
    style={{
      background: C.navy,
      padding: 'clamp(56px,7vw,96px) clamp(20px,5vw,64px)',
    }}
  >
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))',
        gap: 'clamp(28px, 4vw, 48px)',
      }}
    >
      {STATS.map((s, i) => (
        <Reveal key={s.label} delay={i * 0.1}>
          <div
            style={{
              textAlign: 'center',
              paddingTop: 20,
              borderTop: '1px solid rgba(184,148,74,0.35)',
            }}
          >
            <div
              style={{
                fontFamily: C.serif,
                fontSize: 'clamp(44px, 6vw, 72px)',
                fontWeight: 500,
                color: C.white,
                lineHeight: 1,
                letterSpacing: '-0.02em',
              }}
            >
              {s.prefix}
              <CountUp to={s.to} decimals={s.decimals} />
              {s.suffix && <span style={{ color: C.goldSoft }}>{s.suffix}</span>}
            </div>
            <div
              style={{
                fontFamily: C.font,
                fontSize: 13.5,
                fontWeight: 500,
                color: 'rgba(255,255,255,0.6)',
                marginTop: 14,
                letterSpacing: '0.05em',
              }}
            >
              {s.label}
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  </Section>
);

/* ─────────────────────────── PROPERTY CARDS ─────────────────────────── */

type Property = {
  name: string;
  img: string;
  surface: string;
  price: string;
  city: string;
  type: string;
};

const PROPERTIES: Property[] = [
  {
    name: 'Le Domaine des Cèdres',
    img: PHOTO.villa,
    surface: '450 m²',
    price: '4 950 000 €',
    city: 'Provence',
    type: 'Villa contemporaine',
  },
  {
    name: 'Tour Lumière',
    img: PHOTO.city,
    surface: '280 m²',
    price: '6 200 000 €',
    city: 'Paris 8ᵉ',
    type: 'Penthouse',
  },
  {
    name: 'Mas Garrigue',
    img: PHOTO.pool,
    surface: '320 m²',
    price: '3 480 000 €',
    city: 'Saint-Rémy',
    type: 'Mas de caractère',
  },
];

const PropertyCard: React.FC<{ p: Property; delay: number }> = ({
  p,
  delay,
}) => {
  const [hover, setHover] = useState<boolean>(false);
  return (
    <Reveal delay={delay} y={36}>
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          background: C.bgCard,
          borderRadius: 2,
          overflow: 'hidden',
          border: `1px solid ${C.line}`,
          transform: hover ? 'translateY(-10px)' : 'translateY(0)',
          boxShadow: hover
            ? '0 30px 60px -24px rgba(17,24,42,0.32)'
            : '0 8px 26px -18px rgba(17,24,42,0.2)',
          transition:
            'transform .55s cubic-bezier(.22,1,.36,1), box-shadow .55s',
          cursor: 'pointer',
        }}
      >
        {/* Image */}
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            aspectRatio: '4 / 3',
          }}
        >
          <img
            src={p.img}
            alt={p.name}
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              transform: hover ? 'scale(1.07)' : 'scale(1)',
              transition: 'transform .9s cubic-bezier(.22,1,.36,1)',
            }}
          />
          {/* City badge */}
          <span
            style={{
              position: 'absolute',
              top: 16,
              left: 16,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(17,24,42,0.82)',
              backdropFilter: 'blur(6px)',
              color: C.white,
              fontFamily: C.font,
              fontSize: 11.5,
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: '7px 12px',
              borderRadius: 2,
            }}
          >
            <MapPin size={12} color={C.goldSoft} />
            {p.city}
          </span>

          {/* Hover overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(180deg, rgba(17,24,42,0) 40%, rgba(17,24,42,0.7) 100%)',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              padding: 22,
              opacity: hover ? 1 : 0,
              transition: 'opacity .45s',
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                color: C.white,
                fontFamily: C.font,
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: '0.02em',
                transform: hover ? 'translateY(0)' : 'translateY(10px)',
                transition: 'transform .45s',
              }}
            >
              Voir le projet <ArrowUpRight size={16} color={C.goldSoft} />
            </span>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '24px 24px 28px' }}>
          <span
            style={{
              fontFamily: C.font,
              fontSize: 11.5,
              fontWeight: 600,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: C.gold,
            }}
          >
            {p.type}
          </span>
          <h3
            style={{
              fontFamily: C.serif,
              fontSize: 27,
              fontWeight: 600,
              color: C.text,
              margin: '8px 0 18px',
              lineHeight: 1.1,
            }}
          >
            {p.name}
          </h3>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: 16,
              borderTop: `1px solid ${C.line}`,
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                fontFamily: C.font,
                fontSize: 14,
                fontWeight: 500,
                color: C.textSoft,
              }}
            >
              <Maximize2 size={15} color={C.muted} />
              {p.surface}
            </span>
            <span
              style={{
                fontFamily: C.serif,
                fontSize: 22,
                fontWeight: 600,
                color: C.text,
              }}
            >
              {p.price}
            </span>
          </div>
        </div>
      </div>
    </Reveal>
  );
};

const Selection: React.FC = () => (
  <Section id="selection" style={{ background: C.bg }}>
    <Reveal>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: 24,
          marginBottom: 'clamp(40px, 5vw, 64px)',
        }}
      >
        <div style={{ maxWidth: 560 }}>
          <Eyebrow>Sélection exclusive</Eyebrow>
          <h2
            style={{
              fontFamily: C.serif,
              fontSize: 'clamp(34px, 4.6vw, 58px)',
              fontWeight: 500,
              color: C.text,
              margin: '18px 0 0',
              lineHeight: 1.04,
              letterSpacing: '-0.015em',
            }}
          >
            Des biens choisis pour
            <br />
            leur singularité
          </h2>
        </div>
        <p
          style={{
            fontFamily: C.font,
            fontSize: 16,
            lineHeight: 1.7,
            color: C.textSoft,
            maxWidth: 380,
          }}
        >
          Chaque adresse de notre portefeuille est sélectionnée pour son
          architecture, son emplacement et son potentiel patrimonial.
        </p>
      </div>
    </Reveal>

    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))',
        gap: 'clamp(24px, 3vw, 36px)',
      }}
    >
      {PROPERTIES.map((p, i) => (
        <PropertyCard key={p.name} p={p} delay={i * 0.12} />
      ))}
    </div>
  </Section>
);

/* ─────────────────────────── STICKY-SIDE SHOWCASE ─────────────────────────── */

type Feature = {
  num: string;
  title: string;
  body: string;
};

const SHOWCASE_FEATURES: Feature[] = [
  {
    num: '01',
    title: 'Une lumière pensée à chaque heure',
    body: "Orientation plein sud, baies vitrées toute hauteur et patios intérieurs : l'architecture capte la lumière naturelle du lever au coucher du soleil pour des volumes qui respirent.",
  },
  {
    num: '02',
    title: 'Matériaux nobles et durables',
    body: 'Pierre de Provence, chêne massif, béton ciré et laiton patiné. Des matières authentiques, choisies pour traverser les décennies et gagner en caractère avec le temps.',
  },
  {
    num: '03',
    title: 'Performance énergétique maîtrisée',
    body: "Géothermie, isolation renforcée et domotique discrète : chaque bien Solis allie l'exigence du confort contemporain à une empreinte environnementale réduite.",
  },
  {
    num: '04',
    title: 'Une intimité préservée',
    body: "Implantation paysagère, jardins clos et espaces de réception séparés des pièces de vie privées. Le luxe discret de se sentir chez soi, à l'abri des regards.",
  },
];

const StickyShowcase: React.FC = () => (
  <Section
    style={{
      background: C.bgSoft,
      paddingTop: 0,
      paddingBottom: 'clamp(40px,6vw,90px)',
    }}
  >
    <div
      className="solis-sticky-grid"
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'clamp(36px, 5vw, 80px)',
        alignItems: 'start',
        paddingTop: 'clamp(72px, 9vw, 132px)',
      }}
    >
      {/* Sticky image side */}
      <div
        className="solis-sticky-img"
        style={{
          position: 'sticky',
          top: 96,
          alignSelf: 'start',
        }}
      >
        <div
          style={{
            position: 'relative',
            borderRadius: 2,
            overflow: 'hidden',
            aspectRatio: '3 / 4',
            boxShadow: '0 40px 80px -40px rgba(17,24,42,0.4)',
          }}
        >
          <img
            src={PHOTO.interior}
            alt="Intérieur d'une villa Solis baigné de lumière naturelle"
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '40px 28px 26px',
              background:
                'linear-gradient(180deg, transparent, rgba(17,24,42,0.82))',
            }}
          >
            <span
              style={{
                fontFamily: C.font,
                fontSize: 11.5,
                fontWeight: 600,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: C.goldSoft,
              }}
            >
              Étude de cas
            </span>
            <h4
              style={{
                fontFamily: C.serif,
                fontSize: 28,
                fontWeight: 600,
                color: C.white,
                margin: '8px 0 0',
                lineHeight: 1.1,
              }}
            >
              Villa Hélios, Aix-en-Provence
            </h4>
          </div>
        </div>
      </div>

      {/* Scrolling text side */}
      <div style={{ paddingTop: 8 }}>
        <Reveal>
          <Eyebrow>L&apos;art de bâtir</Eyebrow>
          <h2
            style={{
              fontFamily: C.serif,
              fontSize: 'clamp(30px, 3.8vw, 50px)',
              fontWeight: 500,
              color: C.text,
              margin: '18px 0 56px',
              lineHeight: 1.08,
              letterSpacing: '-0.015em',
            }}
          >
            Ce qui distingue une
            <br />
            réalisation d&apos;exception
          </h2>
        </Reveal>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'clamp(48px, 7vw, 96px)',
          }}
        >
          {SHOWCASE_FEATURES.map((f, i) => (
            <Reveal key={f.num} delay={i * 0.05} y={40}>
              <div>
                <span
                  style={{
                    fontFamily: C.serif,
                    fontSize: 48,
                    fontWeight: 500,
                    color: C.goldFaint,
                    lineHeight: 1,
                    display: 'block',
                  }}
                >
                  {f.num}
                </span>
                <h3
                  style={{
                    fontFamily: C.serif,
                    fontSize: 'clamp(22px, 2.6vw, 30px)',
                    fontWeight: 600,
                    color: C.text,
                    margin: '12px 0 14px',
                    lineHeight: 1.15,
                  }}
                >
                  {f.title}
                </h3>
                <p
                  style={{
                    fontFamily: C.font,
                    fontSize: 16,
                    lineHeight: 1.75,
                    color: C.textSoft,
                    maxWidth: 480,
                  }}
                >
                  {f.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  </Section>
);

/* ─────────────────────────── SIGNATURE — STICKY CROSSFADE ─────────────────────────── */

type Signature = {
  img: string;
  city: string;
  caption: string;
  detail: string;
};

const SIGNATURES: Signature[] = [
  {
    img: PHOTO.modern,
    city: "Côte d'Azur",
    caption: 'Villa Belvédère',
    detail:
      "Une architecture en porte-à-faux ouverte sur la Méditerranée, où la piscine à débordement prolonge la ligne d'horizon.",
  },
  {
    img: PHOTO.living,
    city: 'Lyon — Presqu’île',
    caption: 'Appartement Confluence',
    detail:
      'Un duplex de 240 m² aux volumes traversants, mariant pierre dorée lyonnaise et design contemporain épuré.',
  },
  {
    img: PHOTO.facade,
    city: 'Bordeaux',
    caption: 'Hôtel particulier Chartrons',
    detail:
      'Une façade classée du XVIIIᵉ siècle entièrement repensée, alliant patrimoine et confort de vie moderne.',
  },
];

const CrossImage: React.FC<{
  src: string;
  active: boolean;
  index: number;
}> = ({ src, active, index }) => (
  <motion.div
    initial={false}
    animate={{ opacity: active ? 1 : 0, scale: active ? 1.04 : 1 }}
    transition={{
      opacity: { duration: 0.9, ease: EASE },
      scale: { duration: 6, ease: 'linear' },
    }}
    style={{
      position: 'absolute',
      inset: 0,
      zIndex: 1,
      willChange: 'opacity, transform',
    }}
  >
    <img
      src={src}
      alt={`Réalisation signature ${index + 1}`}
      loading="lazy"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block',
      }}
    />
  </motion.div>
);

const SignatureCrossfade: React.FC = () => {
  const n = SIGNATURES.length;
  const [active, setActive] = useState(0);
  const goTo = (i: number) => { setActive(i); };

  return (
    <section
      id="signature"
      style={{
        position: 'relative',
        height: '100dvh',
        overflow: 'hidden',
        background: C.navy,
      }}
    >
      <div
        style={{
          position: 'relative',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {/* Crossfading images */}
        {SIGNATURES.map((s, i) => (
          <CrossImage
            key={s.caption}
            src={s.img}
            active={i === active}
            index={i}
          />
        ))}

        {/* Scrim */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(17,24,42,0.55) 0%, rgba(17,24,42,0.2) 40%, rgba(17,24,42,0.8) 100%)',
            zIndex: 2,
          }}
        />

        {/* Header */}
        <div
          style={{
            position: 'absolute',
            top: 'clamp(80px, 12vh, 120px)',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 3,
            textAlign: 'center',
            width: '90%',
            maxWidth: 700,
          }}
        >
          <Eyebrow light>Réalisations signature</Eyebrow>
          <h2
            style={{
              fontFamily: C.serif,
              fontSize: 'clamp(30px, 4.4vw, 56px)',
              fontWeight: 500,
              color: C.white,
              margin: '16px 0 0',
              lineHeight: 1.05,
              letterSpacing: '-0.015em',
            }}
          >
            Quelques adresses qui
            <br />
            ont marqué notre histoire
          </h2>
        </div>

        {/* Caption (animated per slide) */}
        <div
          style={{
            position: 'absolute',
            bottom: 'clamp(56px, 9vh, 96px)',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 3,
            width: '90%',
            maxWidth: 640,
            textAlign: 'center',
          }}
        >
          <div style={{ position: 'relative', minHeight: 168 }}>
            {SIGNATURES.map((s, i) => (
              <motion.div
                key={s.caption}
                initial={false}
                animate={{
                  opacity: i === active ? 1 : 0,
                  y: i === active ? 0 : 16,
                }}
                transition={{ duration: 0.6, ease: EASE }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  pointerEvents: i === active ? 'auto' : 'none',
                }}
              >
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 7,
                    fontFamily: C.font,
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: C.goldSoft,
                  }}
                >
                  <MapPin size={13} /> {s.city}
                </span>
                <h3
                  style={{
                    fontFamily: C.serif,
                    fontSize: 'clamp(28px, 4vw, 44px)',
                    fontWeight: 600,
                    color: C.white,
                    margin: '10px 0 12px',
                    lineHeight: 1.05,
                  }}
                >
                  {s.caption}
                </h3>
                <p
                  style={{
                    fontFamily: C.font,
                    fontSize: 16,
                    lineHeight: 1.7,
                    color: 'rgba(255,255,255,0.82)',
                    maxWidth: 540,
                    margin: '0 auto',
                  }}
                >
                  {s.detail}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Progress dots */}
          <div
            style={{
              display: 'flex',
              gap: 10,
              justifyContent: 'center',
              marginTop: 28,
            }}
          >
            {SIGNATURES.map((s, i) => (
              <span
                key={s.caption}
                style={{
                  height: 3,
                  width: i === active ? 36 : 16,
                  background: i === active ? C.gold : 'rgba(255,255,255,0.35)',
                  borderRadius: 2,
                  transition: 'width .5s ease, background .5s ease',
                }}
              />
            ))}
          </div>
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
};

/* ─────────────────────────── EDITORIAL APPROACH ROWS ─────────────────────────── */

type Row = {
  icon: React.ReactNode;
  step: string;
  title: string;
  body: string;
  img: string;
  reverse: boolean;
};

const ROWS: Row[] = [
  {
    icon: <Search size={20} />,
    step: 'Étape 01',
    title: 'Prospection sur mesure',
    body: "Nous ne diffusons pas, nous sélectionnons. Notre réseau confidentiel et notre connaissance fine des marchés locaux nous donnent accès à des biens off-market, avant qu'ils n'apparaissent ailleurs. Chaque recherche débute par l'écoute de votre projet de vie.",
    img: PHOTO.facade,
    reverse: false,
  },
  {
    icon: <Compass size={20} />,
    step: 'Étape 02',
    title: 'Négociation experte',
    body: "Estimation rigoureuse, analyse patrimoniale et juridique, stratégie d'acquisition : nos négociateurs défendent vos intérêts avec discrétion et exigence. Nous obtenons les meilleures conditions sans jamais compromettre la sérénité de la transaction.",
    img: PHOTO.modern,
    reverse: true,
  },
  {
    icon: <Handshake size={20} />,
    step: 'Étape 03',
    title: 'Accompagnement complet',
    body: "Notaire, financement, architecte d'intérieur, conciergerie : nous orchestrons l'ensemble des intervenants jusqu'à la remise des clés et au-delà. Solis reste votre interlocuteur unique, du premier rendez-vous à l'installation dans votre nouveau lieu de vie.",
    img: PHOTO.pool,
    reverse: false,
  },
];

const ApproachRow: React.FC<{ row: Row }> = ({ row }) => (
  <div
    className="solis-editorial-row"
    style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 'clamp(32px, 5vw, 80px)',
      alignItems: 'center',
      direction: row.reverse ? 'rtl' : 'ltr',
    }}
  >
    {/* Image */}
    <Reveal y={40} style={{ direction: 'ltr' }}>
      <div
        style={{
          position: 'relative',
          borderRadius: 2,
          overflow: 'hidden',
          aspectRatio: '4 / 3',
          boxShadow: '0 30px 70px -40px rgba(17,24,42,0.4)',
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
            display: 'block',
          }}
        />
      </div>
    </Reveal>

    {/* Text */}
    <Reveal y={40} delay={0.1} style={{ direction: 'ltr' }}>
      <div>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 12,
            color: C.gold,
            marginBottom: 20,
          }}
        >
          <span
            style={{
              width: 48,
              height: 48,
              borderRadius: 2,
              border: `1px solid ${C.line}`,
              display: 'grid',
              placeItems: 'center',
              color: C.gold,
              background: C.bgCard,
            }}
          >
            {row.icon}
          </span>
          <span
            style={{
              fontFamily: C.font,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}
          >
            {row.step}
          </span>
        </span>
        <h3
          style={{
            fontFamily: C.serif,
            fontSize: 'clamp(28px, 3.6vw, 44px)',
            fontWeight: 500,
            color: C.text,
            margin: '0 0 18px',
            lineHeight: 1.08,
            letterSpacing: '-0.01em',
          }}
        >
          {row.title}
        </h3>
        <p
          style={{
            fontFamily: C.font,
            fontSize: 16.5,
            lineHeight: 1.78,
            color: C.textSoft,
            maxWidth: 500,
          }}
        >
          {row.body}
        </p>
      </div>
    </Reveal>
  </div>
);

const Approach: React.FC = () => (
  <Section id="approche" style={{ background: C.bg }}>
    <Reveal>
      <div
        style={{
          textAlign: 'center',
          maxWidth: 620,
          margin: '0 auto clamp(56px, 7vw, 96px)',
        }}
      >
        <Eyebrow>Notre approche</Eyebrow>
        <h2
          style={{
            fontFamily: C.serif,
            fontSize: 'clamp(34px, 4.6vw, 58px)',
            fontWeight: 500,
            color: C.text,
            margin: '18px auto 0',
            lineHeight: 1.04,
            letterSpacing: '-0.015em',
          }}
        >
          Une méthode, trois temps,
          <br />
          une seule exigence
        </h2>
      </div>
    </Reveal>

    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'clamp(64px, 9vw, 128px)',
      }}
    >
      {ROWS.map((row) => (
        <ApproachRow key={row.title} row={row} />
      ))}
    </div>
  </Section>
);

/* ─────────────────────────── TESTIMONIALS ─────────────────────────── */

type Testimonial = {
  quote: string;
  name: string;
  role: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Solis a compris en un rendez-vous ce que d'autres n'avaient pas saisi en six mois. L'acquisition de notre résidence à Saint-Rémy s'est faite avec une fluidité et une discrétion remarquables.",
    name: 'Édouard Vasseur',
    role: 'Directeur financier, groupe coté',
  },
  {
    quote:
      "En tant qu'architecte, je suis exigeant sur la lecture d'un lieu. L'équipe de Solis parle le même langage : celui de la lumière, des proportions et de l'usage. Une collaboration d'une rare intelligence.",
    name: 'Camille Théron',
    role: 'Architecte DPLG, Atelier Théron',
  },
];

const Testimonials: React.FC = () => (
  <Section id="avis" style={{ background: C.bgSoft }}>
    <Reveal>
      <div style={{ textAlign: 'center', marginBottom: 'clamp(44px, 6vw, 72px)' }}>
        <Eyebrow>Ils nous ont fait confiance</Eyebrow>
      </div>
    </Reveal>

    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))',
        gap: 'clamp(24px, 3vw, 40px)',
      }}
    >
      {TESTIMONIALS.map((t, i) => (
        <Reveal key={t.name} delay={i * 0.12} y={36}>
          <figure
            style={{
              background: C.bgCard,
              borderRadius: 2,
              border: `1px solid ${C.line}`,
              padding: 'clamp(32px, 4vw, 48px)',
              height: '100%',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              margin: 0,
            }}
          >
            <Quote size={36} color={C.goldFaint} fill={C.goldFaint} />
            <blockquote
              style={{
                fontFamily: C.serif,
                fontSize: 'clamp(20px, 2.2vw, 26px)',
                lineHeight: 1.42,
                color: C.text,
                fontWeight: 500,
                margin: '20px 0 28px',
                fontStyle: 'italic',
                flex: 1,
              }}
            >
              « {t.quote} »
            </blockquote>
            <figcaption
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                paddingTop: 24,
                borderTop: `1px solid ${C.line}`,
              }}
            >
              <span
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: '50%',
                  background: C.navy,
                  color: C.goldSoft,
                  display: 'grid',
                  placeItems: 'center',
                  fontFamily: C.serif,
                  fontSize: 19,
                  fontWeight: 600,
                  flexShrink: 0,
                }}
              >
                {t.name
                  .split(' ')
                  .map((w) => w[0])
                  .join('')}
              </span>
              <span>
                <span
                  style={{
                    display: 'block',
                    fontFamily: C.font,
                    fontSize: 15,
                    fontWeight: 600,
                    color: C.text,
                  }}
                >
                  {t.name}
                </span>
                <span
                  style={{
                    display: 'block',
                    fontFamily: C.font,
                    fontSize: 13,
                    color: C.muted,
                    marginTop: 2,
                  }}
                >
                  {t.role}
                </span>
              </span>
            </figcaption>
          </figure>
        </Reveal>
      ))}
    </div>
  </Section>
);

/* ─────────────────────────── CONTACT ─────────────────────────── */

type FormState = {
  nom: string;
  email: string;
  telephone: string;
  type: string;
  message: string;
};

const PROJECT_TYPES: string[] = [
  'Acquisition',
  'Vente / Estimation',
  'Investissement patrimonial',
  'Projet architectural',
  'Autre demande',
];

const inputBase: React.CSSProperties = {
  width: '100%',
  fontFamily: C.font,
  fontSize: 15,
  color: C.text,
  background: C.bgCard,
  border: `1px solid ${C.line}`,
  borderRadius: 2,
  padding: '14px 16px',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color .25s, box-shadow .25s',
};

const labelBase: React.CSSProperties = {
  display: 'block',
  fontFamily: C.font,
  fontSize: 12.5,
  fontWeight: 600,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: C.textSoft,
  marginBottom: 8,
};

const Field: React.FC<{
  label: string;
  children: React.ReactNode;
  full?: boolean;
}> = ({ label, children, full }) => (
  <div style={{ gridColumn: full ? '1 / -1' : 'auto' }}>
    <label style={labelBase}>{label}</label>
    {children}
  </div>
);

const Contact: React.FC = () => {
  const [form, setForm] = useState<FormState>({
    nom: '',
    email: '',
    telephone: '',
    type: PROJECT_TYPES[0],
    message: '',
  });
  const [sent, setSent] = useState<boolean>(false);

  const update =
    (key: keyof FormState) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ): void =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const onSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    setSent(true);
  };

  const focus = (e: React.FocusEvent<HTMLElement>): void => {
    e.currentTarget.style.borderColor = C.gold;
    e.currentTarget.style.boxShadow = `0 0 0 3px ${C.goldFaint}`;
  };
  const blur = (e: React.FocusEvent<HTMLElement>): void => {
    e.currentTarget.style.borderColor = C.line;
    e.currentTarget.style.boxShadow = 'none';
  };

  const OFFICE: { icon: React.ReactNode; label: string; value: string }[] = [
    {
      icon: <MapPin size={18} />,
      label: 'Bureau principal',
      value: '18 cours Mirabeau, 13100 Aix-en-Provence',
    },
    {
      icon: <Phone size={18} />,
      label: 'Téléphone',
      value: '+33 4 42 00 18 90',
    },
    {
      icon: <Mail size={18} />,
      label: 'Email',
      value: 'contact@solis-immobilier.fr',
    },
    {
      icon: <Clock size={18} />,
      label: 'Horaires',
      value: 'Lun – Sam · 9h00 – 19h00',
    },
  ];

  return (
    <Section id="contact" style={{ background: C.navy }}>
      <div
        className="solis-contact-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: '0.9fr 1.1fr',
          gap: 'clamp(40px, 6vw, 88px)',
          alignItems: 'start',
        }}
      >
        {/* Left — info */}
        <Reveal>
          <div>
            <Eyebrow light>Parlons de votre projet</Eyebrow>
            <h2
              style={{
                fontFamily: C.serif,
                fontSize: 'clamp(32px, 4.4vw, 54px)',
                fontWeight: 500,
                color: C.white,
                margin: '18px 0 22px',
                lineHeight: 1.06,
                letterSpacing: '-0.015em',
              }}
            >
              Un conseiller dédié,
              <br />
              à votre écoute
            </h2>
            <p
              style={{
                fontFamily: C.font,
                fontSize: 16.5,
                lineHeight: 1.75,
                color: 'rgba(255,255,255,0.72)',
                maxWidth: 420,
                marginBottom: 40,
              }}
            >
              Acquisition, vente ou simple estimation : confiez-nous votre
              projet. Nous vous recontactons sous 24 heures pour un premier
              échange confidentiel.
            </p>

            <div
              style={{ display: 'flex', flexDirection: 'column', gap: 22 }}
            >
              {OFFICE.map((item) => (
                <div
                  key={item.label}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 16,
                  }}
                >
                  <span
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 2,
                      border: '1px solid rgba(184,148,74,0.4)',
                      display: 'grid',
                      placeItems: 'center',
                      color: C.goldSoft,
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </span>
                  <span style={{ paddingTop: 2 }}>
                    <span
                      style={{
                        display: 'block',
                        fontFamily: C.font,
                        fontSize: 11.5,
                        fontWeight: 600,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: C.goldSoft,
                      }}
                    >
                      {item.label}
                    </span>
                    <span
                      style={{
                        display: 'block',
                        fontFamily: C.font,
                        fontSize: 15.5,
                        color: 'rgba(255,255,255,0.9)',
                        marginTop: 4,
                      }}
                    >
                      {item.value}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Right — form */}
        <Reveal delay={0.12}>
          <div
            style={{
              background: C.bg,
              borderRadius: 2,
              padding: 'clamp(28px, 3.5vw, 44px)',
            }}
          >
            {sent ? (
              <div style={{ textAlign: 'center', padding: '40px 12px' }}>
                <span
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    background: C.goldFaint,
                    display: 'grid',
                    placeItems: 'center',
                    margin: '0 auto 24px',
                  }}
                >
                  <Check size={30} color={C.gold} strokeWidth={2.4} />
                </span>
                <h3
                  style={{
                    fontFamily: C.serif,
                    fontSize: 30,
                    fontWeight: 600,
                    color: C.text,
                    margin: '0 0 12px',
                  }}
                >
                  Demande envoyée
                </h3>
                <p
                  style={{
                    fontFamily: C.font,
                    fontSize: 15.5,
                    lineHeight: 1.7,
                    color: C.textSoft,
                    maxWidth: 360,
                    margin: '0 auto',
                  }}
                >
                  Merci {form.nom || ''}. Un conseiller Solis vous recontactera
                  sous 24 heures.
                </p>
              </div>
            ) : (
              <form className="imx-mobstack"
                onSubmit={onSubmit}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 20,
                }}
              >
                <Field label="Nom complet">
                  <input
                    style={inputBase}
                    type="text"
                    required
                    placeholder="Marie Dupont"
                    value={form.nom}
                    onChange={update('nom')}
                    onFocus={focus}
                    onBlur={blur}
                  />
                </Field>
                <Field label="Téléphone">
                  <input
                    style={inputBase}
                    type="tel"
                    placeholder="+33 6 12 34 56 78"
                    value={form.telephone}
                    onChange={update('telephone')}
                    onFocus={focus}
                    onBlur={blur}
                  />
                </Field>
                <Field label="Email" full>
                  <input
                    style={inputBase}
                    type="email"
                    required
                    placeholder="marie.dupont@email.fr"
                    value={form.email}
                    onChange={update('email')}
                    onFocus={focus}
                    onBlur={blur}
                  />
                </Field>
                <Field label="Type de projet" full>
                  <select
                    style={{
                      ...inputBase,
                      appearance: 'none',
                      cursor: 'pointer',
                    }}
                    value={form.type}
                    onChange={update('type')}
                    onFocus={focus}
                    onBlur={blur}
                  >
                    {PROJECT_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Votre message" full>
                  <textarea
                    style={{
                      ...inputBase,
                      resize: 'vertical',
                      minHeight: 120,
                    }}
                    required
                    placeholder="Décrivez votre projet, vos critères, votre calendrier…"
                    value={form.message}
                    onChange={update('message')}
                    onFocus={focus}
                    onBlur={blur}
                  />
                </Field>
                <button
                  type="submit"
                  style={{
                    gridColumn: '1 / -1',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                    fontFamily: C.font,
                    fontSize: 15.5,
                    fontWeight: 600,
                    color: C.navy,
                    background: C.gold,
                    border: 'none',
                    borderRadius: 2,
                    padding: '16px',
                    cursor: 'pointer',
                    letterSpacing: '0.02em',
                    transition: 'background .25s, transform .25s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = C.goldSoft;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = C.gold;
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Envoyer ma demande <ArrowRight size={17} />
                </button>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </Section>
  );
};

/* ─────────────────────────── FOOTER ─────────────────────────── */

const FOOTER_COLS: { head: string; links: string[] }[] = [
  { head: 'Agence', links: ['À propos', 'Notre équipe', 'Carrières', 'Presse'] },
  {
    head: 'Services',
    links: ['Acquisition', 'Vente', 'Estimation', 'Conciergerie'],
  },
  {
    head: 'Adresses',
    links: ['Aix-en-Provence', 'Paris 8ᵉ', 'Lyon', 'Bordeaux'],
  },
];

const Footer: React.FC = () => (
  <footer
    style={{
      background: C.navy2,
      borderTop: '1px solid rgba(255,255,255,0.07)',
    }}
  >
    <div
      style={{
        maxWidth: MAXW,
        margin: '0 auto',
        padding: 'clamp(56px, 7vw, 88px) clamp(20px,5vw,64px) 40px',
      }}
    >
      <div
        className="solis-footer-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr 1fr 1fr',
          gap: 'clamp(32px, 4vw, 56px)',
          paddingBottom: 48,
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {/* Brand */}
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 18,
            }}
          >
            <span
              style={{
                width: 38,
                height: 38,
                borderRadius: 2,
                background: C.gold,
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <Building2 size={20} color={C.navy} strokeWidth={2.2} />
            </span>
            <span
              style={{
                fontFamily: C.serif,
                fontSize: 24,
                fontWeight: 600,
                color: C.white,
              }}
            >
              Solis
            </span>
          </div>
          <p
            style={{
              fontFamily: C.font,
              fontSize: 14.5,
              lineHeight: 1.7,
              color: 'rgba(255,255,255,0.6)',
              maxWidth: 300,
            }}
          >
            Immobilier et architecture de prestige. Nous révélons des lieux
            d&apos;exception, de la Provence aux plus belles adresses de France.
          </p>
        </div>

        {FOOTER_COLS.map((col) => {
          const getFooterLinkHref = (l: string) => {
            const norm = l.toLowerCase();
            if (norm.includes('propos') || norm.includes('équipe') || norm.includes('carrière') || norm.includes('presse')) return '#approche';
            if (norm.includes('acquis') || norm.includes('vente') || norm.includes('estim') || norm.includes('concierg')) return '#selection';
            return '#contact';
          };
          return (
            <div key={col.head}>
              <h5
                style={{
                  fontFamily: C.font,
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: C.goldSoft,
                  margin: '0 0 18px',
                }}
              >
                {col.head}
              </h5>
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
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href={getFooterLinkHref(l)}
                      style={{
                        fontFamily: C.font,
                        fontSize: 14.5,
                        color: 'rgba(255,255,255,0.66)',
                        textDecoration: 'none',
                        transition: 'color .25s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = C.goldSoft;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'rgba(255,255,255,0.66)';
                      }}
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          paddingTop: 28,
        }}
      >
        <span
          style={{
            fontFamily: C.font,
            fontSize: 13,
            color: 'rgba(255,255,255,0.5)',
          }}
        >
          © 2026 Solis Immobilier — Carte professionnelle CPI 1301 2024 000 047
          218
        </span>
        <div style={{ display: 'flex', gap: 24 }}>
          {['Mentions légales', 'Confidentialité', 'Honoraires'].map((l) => (
            <a
              key={l}
              href="#contact"
              style={{
                fontFamily: C.font,
                fontSize: 13,
                color: 'rgba(255,255,255,0.5)',
                textDecoration: 'none',
                transition: 'color .25s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = C.goldSoft;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
              }}
            >
              {l}
            </a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

/* ─────────────────────────── RESPONSIVE STYLES ─────────────────────────── */

const ResponsiveStyles: React.FC = () => (
  <style suppressHydrationWarning>{`
    html { scroll-behavior: smooth; }
    @media (max-width: 920px) {
      .solis-desktop-nav { display: none !important; }
      .solis-mobile-toggle { display: inline-flex !important; }
      .solis-sticky-grid { grid-template-columns: 1fr !important; }
      .solis-sticky-img { position: relative !important; top: 0 !important; }
      .solis-editorial-row { grid-template-columns: 1fr !important; direction: ltr !important; }
      .solis-contact-grid { grid-template-columns: 1fr !important; }
      .solis-footer-grid { grid-template-columns: 1fr 1fr !important; }
    }
    @media (max-width: 560px) {
      .solis-footer-grid { grid-template-columns: 1fr !important; }
    }
  
        /* mobile: stack 2-col grids to single column (added by responsive fix) */
        @media (max-width: 768px) {
          .imx-mobstack { grid-template-columns: 1fr !important; }
        }
      `}</style>
);

/* ─────────────────────────── PAGE ─────────────────────────── */


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function ImpactTemplate(): React.ReactElement {
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

  useEffect(() => {
    if (!fd?.photoUrls?.length) return;
    let n = 0;
    const _photoArrays: any[] = [PHOTO];
    _photoArrays.forEach((arr) => {
      if (!Array.isArray(arr)) return;
      arr.forEach((item) => {
        if (!item || typeof item !== "object") return;
        for (const key of ["img", "src", "image", "imgSrc", "photo"]) {
          if (typeof item[key] === "string" && item[key].includes("images.unsplash.com")) {
            if (fd.photoUrls[n]) item[key] = fd.photoUrls[n];
            n++;
          }
        }
      });
    });
  });
  c = session?.generatedContent;
  brand = fd?.brandColor ?? null; // null = keep template's original color

  if (brand) {
    C = {
      ...C,
      gold: brand,
      goldSoft: shadeColor(brand, 25),
    };
  }

  
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
      style={{
        background: C.bg,
        color: C.text,
        fontFamily: C.font,
        overflowX: 'hidden',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      <ResponsiveStyles />
      <Nav />
      <Hero />
      <StatsBand />
      <Selection />
      <StickyShowcase />
      <SignatureCrossfade />
      <Approach />
      <Testimonials />
      <Contact />
      <Footer />
    </main>
  );
}
