// @ts-nocheck
'use client';

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useInView,
  AnimatePresence,
  useMotionTemplate,
} from 'framer-motion';
import { TemplateIcon } from '@/components/TemplateIcon';

/* ==========================================================================
   TYPES
   ========================================================================== */

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
  duration: number;
}

interface Service {
  id: string;
  icon: string;
  name: string;
  nameFr: string;
  description: string;
  price: string;
  duration: string;
  tag?: string;
}

interface Slot {
  id: string;
  day: string;
  time: string;
  booked: boolean;
}

interface PaletteColor {
  name: string;
  hex: string;
  label: string;
}

/* ==========================================================================
   DATA
   ========================================================================== */

const PALETTE_COLORS: PaletteColor[] = [
  { name: 'cream', hex: '#F5ECD7', label: 'Cream' },
  { name: 'nude', hex: '#C8A882', label: 'Nude' },
  { name: 'rose', hex: '#E8A0B0', label: 'Rose' },
  { name: 'red', hex: '#C0392B', label: 'Red' },
  { name: 'coral', hex: '#E07060', label: 'Coral' },
  { name: 'mint', hex: '#89C4B8', label: 'Mint' },
  { name: 'lilac', hex: '#B09EC0', label: 'Lilac' },
  { name: 'black', hex: '#1A0A10', label: 'Noir' },
];

const SERVICES: Service[] = [
  {
    id: 'gel',
    icon: 'nail',
    name: 'Gel Pose',
    nameFr: 'Pose gel',
    description: 'Full gel application with premium products, long-lasting shine up to 4 weeks.',
    price: '75€',
    duration: '90 min',
    tag: 'Best-seller',
  },
  {
    id: 'semi',
    icon: 'nail',
    name: 'Semi-permanent',
    nameFr: 'Semi-permanent',
    description: "Vernis semi-permanent longue durée. Tenue parfaite jusqu\'à 3 semaines.",
    price: '45€',
    duration: '60 min',
  },
  {
    id: 'art',
    icon: 'nail',
    name: 'Nail Art',
    nameFr: 'Nail Art Signature',
    description: 'Custom hand-painted designs, chrome powder, foils & 3D embellishments.',
    price: '95€',
    duration: '120 min',
    tag: 'Premium',
  },
  {
    id: 'russe',
    icon: 'nail',
    name: 'Russian Manicure',
    nameFr: 'Manucure Russe',
    description: 'Dry technique for the most precise, clean result — zero skin damage.',
    price: '65€',
    duration: '75 min',
  },
  {
    id: 'extensions',
    icon: 'nail',
    name: 'Extensions',
    nameFr: 'Extensions ongles',
    description: 'Capsules sur mesure ou construction acrylique — longueur & forme au choix.',
    price: '110€',
    duration: '150 min',
    tag: 'Luxe',
  },
];

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
const TIMES = ['10:00', '11:30', '13:00', '14:30', '16:00', '17:30'];

const generateSlots = (): Slot[] => {
  const booked = new Set([
    "Lun-10:00', 'Lun-14:30', 'Mar-11:30', 'Mar-16:00",
    "Mer-10:00', 'Mer-13:00', 'Mer-17:30', 'Jeu-11:30",
    "Jeu-16:00', 'Ven-10:00', 'Ven-14:30', 'Sam-13:00",
    "Sam-16:00', 'Sam-17:30",
  ]);
  return DAYS.flatMap((day) =>
    TIMES.map((time) => ({
      id: `${day}-${time}`,
      day,
      time,
      booked: booked.has(`${day}-${time}`),
    }))
  );
};

const SLOTS = generateSlots();

const GALLERY_ITEMS = [
  { id: 1, aspect: 'portrait', color: '#E8A0B0', label: 'Cherry Blossom' },
  { id: 2, aspect: 'square', color: '#B09EC0', label: 'Violet Dreams' },
  { id: 3, aspect: 'landscape', color: '#C0392B', label: 'Scarlet' },
  { id: 4, aspect: 'square', color: '#89C4B8', label: 'Mint Cloud' },
  { id: 5, aspect: 'portrait', color: '#F5ECD7', label: 'Ivory Art' },
  { id: 6, aspect: 'square', color: '#C8A882', label: 'Nude Luxe' },
  { id: 7, aspect: 'landscape', color: '#E07060', label: 'Sunset Coral' },
  { id: 8, aspect: 'portrait', color: '#1A0A10', label: 'Minuit' },
];

/* ==========================================================================
   UTILITY: PARTICLE GENERATOR
   ========================================================================== */

const PARTICLE_COLORS = ['#d4356a', '#FFD700', '#FFFFFF', '#FFB6C1', '#FFF0F5', '#FFE4E1'];

const generateParticles = (): Particle[] =>
  Array.from({ length: 38 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 2 + Math.random() * 5,
    color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
    delay: Math.random() * 6,
    duration: 4 + Math.random() * 8,
  }));

/* ==========================================================================
   GLOBAL STYLES (injected once)
   ========================================================================== */

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Syne:wght@700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #fff9f7;
    --text: #1a0a10;
    --accent: #d4356a;
    --accent-soft: #f8d6e3;
    --muted: #7a5060;
    --border: #f0dde5;
    --card: #ffffff;
    --font-body: 'Inter', sans-serif;
    --font-heading: 'Syne', sans-serif;
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--font-body);
    font-weight: 300;
    overflow-x: hidden;
  }

  @keyframes sparkle {
    0%   { opacity: 0; transform: scale(0.4) rotate(0deg); }
    25%  { opacity: 1; transform: scale(1.2) rotate(45deg); }
    50%  { opacity: 0.5; transform: scale(0.9) rotate(90deg); }
    75%  { opacity: 1; transform: scale(1.1) rotate(135deg); }
    100% { opacity: 0; transform: scale(0.4) rotate(180deg); }
  }

  @keyframes floatUp {
    0%   { transform: translateY(0) translateX(0); opacity: 0; }
    10%  { opacity: 1; }
    90%  { opacity: 0.7; }
    100% { transform: translateY(-110vh) translateX(20px); opacity: 0; }
  }

  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }

  @keyframes nailFill {
    from { clip-path: inset(100% 0 0 0); }
    to   { clip-path: inset(0% 0 0 0); }
  }

  @keyframes glow-pulse {
    0%, 100% { box-shadow: 0 0 0px transparent; }
    50%       { box-shadow: 0 0 12px var(--accent); }
  }

  .shimmer-text {
    background: linear-gradient(90deg, var(--text) 0%, var(--accent) 40%, var(--text) 80%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 4s linear infinite;
  }

  .slot-available { animation: glow-pulse 3s ease-in-out infinite; }

  .flip-card { perspective: 1000px; }
  .flip-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .flip-card:hover .flip-inner { transform: rotateY(180deg); }
  .flip-front, .flip-back {
    position: absolute;
    inset: 0;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    border-radius: 20px;
  }
  .flip-back { transform: rotateY(180deg); }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--accent); border-radius: 2px; }
`;

/* ==========================================================================
   COMPONENT: NAV
   ========================================================================== */

function Nav({ accentColor }: { accentColor: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handle, { passive: true });
    return () => window.removeEventListener('scroll', handle);
  }, []);

  const links = ['Services', 'Palette', 'Galerie', 'Booking', 'Contact'];

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: scrolled ? '12px 32px' : '24px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: scrolled ? 'rgba(255, 249, 247, 0.96)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid #f0dde5' : 'none',
        transition: 'all 0.4s ease',
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <TemplateIcon emoji="💅" size={22} />
        <span
          style={{
            fontFamily: 'Syne, sans-serif',
            fontWeight: 700,
            fontSize: 20,
            color: accentColor,
            letterSpacing: '-0.02em',
          }}
        >{fd?.businessName ?? "Studio Nail"}</span>
      </div>

      {/* Desktop links */}
      <div style={{ display: 'flex', gap: 36, alignItems: 'center' }}>
        {links.map((link) => (
          <a
            key={link}
            href={`#${link.toLowerCase()}`}
            style={{color: brand ?? '#1a0a10',
              textDecoration: 'none',
              fontSize: 13,
              fontWeight: 400,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              opacity: 0.7,
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.opacity = '1')}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.opacity = '0.7')}
          >
            {link}
          </a>
        ))}
        <a
          href="#booking"
          style={{
            background: accentColor,
            color: '#fff',
            padding: '10px 22px',
            borderRadius: 50,
            fontSize: 13,
            fontWeight: 500,
            textDecoration: 'none',
            letterSpacing: '0.04em',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLElement).style.transform = 'translateY(-2px)';
            (e.target as HTMLElement).style.boxShadow = `0 8px 24px ${accentColor}55`;
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.transform = 'translateY(0)';
            (e.target as HTMLElement).style.boxShadow = 'none';
          }}
        >
          Réserver
        </a>
      </div>
    </motion.nav>
  );
}

/* ==========================================================================
   COMPONENT: SPARKLE PARTICLES
   ========================================================================== */

function SparkleParticles({ particles }: { particles: Particle[] }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    >
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            animation: `floatUp ${p.duration}s ${p.delay}s ease-in-out infinite, sparkle ${p.duration * 0.6}s ${p.delay}s ease-in-out infinite`,
          }}
        >
          {/* Diamond shape */}
          <div
            style={{
              width: '100%',
              height: '100%',
              background: p.color,
              transform: 'rotate(45deg)',
              borderRadius: 1,
              boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
            }}
          />
        </div>
      ))}
    </div>
  );
}

/* ==========================================================================
   COMPONENT: HERO
   ========================================================================== */

function Hero({ accentColor, particles }: { accentColor: string; particles: Particle[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      id="hero"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        background: `radial-gradient(ellipse 80% 60% at 50% 40%, ${accentColor}18 0%, #fff9f7 70%)`,
        overflow: 'hidden',
        paddingTop: 100,
      }}
    >
      {/* Background orbs */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          right: '5%',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${accentColor}22 0%, transparent 70%)`,
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          left: '0%',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: `radial-gradient(circle, #FFD70022 0%, transparent 70%)`,
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
      />

      <SparkleParticles particles={particles} />

      <motion.div
        style={{ y, opacity, position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 24px' }}
      >
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: `${accentColor}15`,
            border: `1px solid ${accentColor}40`,
            padding: '6px 18px',
            borderRadius: 50,
            marginBottom: 32,
          }}
        >
          <span style={{ fontSize: 14, color: accentColor }}>✦</span>
          <span
            style={{
              fontSize: 11,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: accentColor,
              fontWeight: 500,
            }}
          >
            Studio de Nail Art Premium
          </span>
          <span style={{ fontSize: 14, color: accentColor }}>✦</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{fontFamily: 'Syne, sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(52px, 8vw, 100px)',
            lineHeight: 0.95,
            letterSpacing: '-0.04em',
            color: brand ?? '#1a0a10',
            marginBottom: 24,
          }}
        >
          L&apos;art{' '}
          <span className="shimmer-text">au bout</span>
          <br />
          des ongles.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          style={{
            fontSize: 18,
            color: '#7a5060',
            maxWidth: 520,
            margin: '0 auto 48px',
            lineHeight: 1.7,
            fontWeight: 300,
          }}
        >
          Gel, semi-permanent, nail art sur mesure — every detail crafted
          with precision and a touch of <em>parisian elegance</em>.
        </motion.p>

        {/* CTA group */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}
        >
          <a
            href="#booking"
            style={{
              background: accentColor,
              color: '#fff',
              padding: '16px 36px',
              borderRadius: 50,
              fontSize: 15,
              fontWeight: 500,
              textDecoration: 'none',
              letterSpacing: '0.02em',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: `0 12px 40px ${accentColor}55`,
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
              (e.currentTarget as HTMLElement).style.boxShadow = `0 20px 50px ${accentColor}66`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 40px ${accentColor}55`;
            }}
          >
            Prendre rendez-vous
            <span style={{ fontSize: 18 }}>→</span>
          </a>
          <a
            href="#services"
            style={{background: 'transparent',
              color: brand ?? '#1a0a10',
              padding: '16px 36px',
              borderRadius: 50,
              fontSize: 15,
              fontWeight: 400,
              textDecoration: 'none',
              letterSpacing: '0.02em',
              border: '1px solid #f0dde5',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              transition: 'border-color 0.2s, background 0.2s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = accentColor;
              (e.currentTarget as HTMLElement).style.background = `${accentColor}08`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = '#f0dde5';
              (e.currentTarget as HTMLElement).style.background = 'transparent';
            }}
          >
            Découvrir nos services
          </a>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          style={{
            display: 'flex',
            gap: 48,
            justifyContent: 'center',
            marginTop: 72,
            flexWrap: 'wrap',
          }}
        >
          {[
            { value: '2 000+', label: 'Clients satisfaites' },
            { value: '5★', label: 'Note Google' },
            { value: '7 ans', label: "d'expérience" },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontFamily: 'Syne, sans-serif',
                  fontWeight: 700,
                  fontSize: 28,
                  color: accentColor,
                }}
              >
                {stat.value}
              </div>
              <div style={{ fontSize: 13, color: '#7a5060', marginTop: 4 }}>{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{
          position: 'absolute',
          bottom: 32,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2,
        }}
      >
        <div
          style={{
            width: 28,
            height: 44,
            border: `2px solid ${accentColor}60`,
            borderRadius: 14,
            display: 'flex',
            justifyContent: 'center',
            paddingTop: 8,
          }}
        >
          <div
            style={{
              width: 4,
              height: 8,
              background: accentColor,
              borderRadius: 2,
              animation: 'floatUp 1.8s ease-in-out infinite',
            }}
          />
        </div>
      </motion.div>
    </section>
  );
}

/* ==========================================================================
   COMPONENT: NAIL CSS ICON
   ========================================================================== */

function NailIcon({ color, filled }: { color: string; filled: boolean }) {
  return (
    <svg width="32" height="40" viewBox="0 0 32 40" fill="none">
      {/* Nail body */}
      <rect
        x="6"
        y="14"
        width="20"
        height="24"
        rx="4"
        fill={filled ? color : 'transparent'}
        stroke={color}
        strokeWidth="2"
        style={{ transition: 'fill 0.4s ease' }}
      />
      {/* Nail top / cuticle area */}
      <path
        d="M6 18 Q16 4 26 18"
        fill={filled ? color : 'transparent'}
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
        style={{ transition: 'fill 0.4s ease' }}
      />
      {/* Shine line */}
      {filled && (
        <line
          x1="10"
          y1="20"
          x2="10"
          y2="32"
          stroke="rgba(255,255,255,0.6)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

/* ==========================================================================
   COMPONENT: SERVICE FLIP CARD
   ========================================================================== */

function ServiceCard({
  service,
  accentColor,
  index,
}: {
  service: Service;
  accentColor: string;
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="flip-card"
      style={{ width: '100%', height: 280 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flip-inner">
        {/* FRONT */}
        <div
          className="flip-front"
          style={{
            background: '#ffffff',
            border: `1px solid ${hovered ? accentColor + '40' : '#f0dde5'}`,
            padding: '32px 28px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 16,
            cursor: 'pointer',
            transition: 'border-color 0.3s',
          }}
        >
          {/* Tag */}
          {service.tag && (
            <span
              style={{
                background: `${accentColor}18`,
                color: accentColor,
                fontSize: 10,
                fontWeight: 600,
                padding: '3px 10px',
                borderRadius: 50,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              {service.tag}
            </span>
          )}

          {/* Icon */}
          <NailIcon color={accentColor} filled={hovered} />

          {/* Name */}
          <div>
            <div
              style={{fontFamily: 'Syne, sans-serif',
                fontWeight: 700,
                fontSize: 20,
                color: brand ?? '#1a0a10',
                lineHeight: 1.2,
              }}
            >
              {service.nameFr}
            </div>
            <div style={{ fontSize: 13, color: '#7a5060', marginTop: 4 }}>{service.name}</div>
          </div>

          {/* Description */}
          <p
            style={{
              fontSize: 14,
              color: '#7a5060',
              lineHeight: 1.6,
              fontWeight: 300,
            }}
          >
            {service.description}
          </p>

          {/* Duration */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 'auto' }}>
            <span style={{ fontSize: 12, color: '#7a5060' }}>{service.duration}</span>
          </div>
        </div>

        {/* BACK */}
        <div
          className="flip-back"
          style={{
            background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}cc 100%)`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 20,
            padding: 32,
          }}
        >
          <div
            style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 700,
              fontSize: 56,
              color: '#fff',
              lineHeight: 1,
            }}
          >
            {service.price}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, textAlign: 'center' }}>
            {service.nameFr}
            <br />
            <span style={{ fontSize: 12, opacity: 0.7 }}>{service.duration}</span>
          </div>
          <a
            href="#booking"
            style={{
              background: '#fff',
              color: accentColor,
              padding: '12px 28px',
              borderRadius: 50,
              fontSize: 13,
              fontWeight: 600,
              textDecoration: 'none',
              letterSpacing: '0.04em',
              marginTop: 8,
            }}
          >
            Réserver →
          </a>
        </div>
      </div>
    </motion.div>
  );
}

/* ==========================================================================
   COMPONENT: SERVICES SECTION
   ========================================================================== */

function ServicesSection({ accentColor }: { accentColor: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <section
      id="services"
      ref={ref}
      style={{
        padding: '120px 40px',
        maxWidth: 1200,
        margin: '0 auto',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        style={{ textAlign: 'center', marginBottom: 72 }}
      >
        <div
          style={{
            fontSize: 11,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: accentColor,
            marginBottom: 16,
          }}
        >
          — Notre savoir-faire —
        </div>
        <h2
          style={{fontFamily: 'Syne, sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(36px, 5vw, 60px)',
            letterSpacing: '-0.03em',
            color: brand ?? '#1a0a10',
            lineHeight: 1.1,
          }}
        >
          Services &amp;{' '}
          <span style={{ color: accentColor }}>Tarifs</span>
        </h2>
        <p
          style={{
            fontSize: 16,
            color: '#7a5060',
            maxWidth: 480,
            margin: '20px auto 0',
            lineHeight: 1.7,
            fontWeight: 300,
          }}
        >
          Hover a card to reveal pricing. Each treatment is tailored to your style.
        </p>
      </motion.div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 24,
        }}
      >
        {SERVICES.map((service, i) => (
          <ServiceCard key={service.id} service={service} accentColor={accentColor} index={i} />
        ))}
      </div>
    </section>
  );
}

/* ==========================================================================
   COMPONENT: PALETTE SCROLL SWITCHER
   ========================================================================== */

function PaletteSection({
  activeIndex,
  onSwatchClick,
  accentColor,
}: {
  activeIndex: number;
  onSwatchClick: (i: number) => void;
  accentColor: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <section
      id="palette"
      ref={ref}
      style={{
        padding: '120px 40px',
        background: `linear-gradient(180deg, #fff9f7 0%, ${accentColor}0d 50%, #fff9f7 100%)`,
        textAlign: 'center',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <div
          style={{
            fontSize: 11,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: accentColor,
            marginBottom: 16,
          }}
        >
          — Choisissez votre teinte —
        </div>
        <h2
          style={{fontFamily: 'Syne, sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(32px, 4vw, 52px)',
            letterSpacing: '-0.03em',
            color: brand ?? '#1a0a10',
            marginBottom: 20,
          }}
        >
          Your Perfect{' '}
          <span style={{ color: accentColor }}>Color</span>
        </h2>
        <p
          style={{
            fontSize: 16,
            color: '#7a5060',
            maxWidth: 420,
            margin: '0 auto 56px',
            lineHeight: 1.7,
            fontWeight: 300,
          }}
        >
          Sélectionnez une teinte — the page adapts to reflect your chosen palette.
        </p>

        {/* Swatches */}
        <div
          style={{
            display: 'flex',
            gap: 20,
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: 56,
          }}
        >
          {PALETTE_COLORS.map((color, i) => (
            <motion.button
              key={color.name}
              onClick={() => onSwatchClick(i)}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              whileHover={{ scale: 1.15, y: -4 }}
              whileTap={{ scale: 0.95 }}
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: color.hex,
                border:
                  activeIndex === i
                    ? `3px solid ${accentColor}`
                    : '3px solid transparent',
                cursor: 'pointer',
                boxShadow:
                  activeIndex === i
                    ? `0 0 0 4px ${accentColor}40, 0 8px 24px ${color.hex}88`
                    : `0 4px 16px ${color.hex}66`,
                outline: 'none',
                transition: 'border 0.2s, box-shadow 0.2s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              {activeIndex === i && (
                <span
                  style={{
                    position: 'absolute',
                    bottom: -28,
                    fontSize: 11,
                    color: accentColor,
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {color.label}
                </span>
              )}
            </motion.button>
          ))}
        </div>

        {/* Selected color display */}
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          style={{
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
            marginTop: 40,
          }}
        >
          {/* Big nail preview */}
          <div
            style={{
              width: 80,
              height: 100,
              background: PALETTE_COLORS[activeIndex].hex,
              borderRadius: '40px 40px 16px 16px',
              boxShadow: `0 20px 60px ${PALETTE_COLORS[activeIndex].hex}88, 0 0 0 1px ${accentColor}30`,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Shine */}
            <div
              style={{
                position: 'absolute',
                top: 8,
                left: 12,
                width: 12,
                height: 36,
                background: 'rgba(255,255,255,0.45)',
                borderRadius: 8,
                filter: 'blur(3px)',
              }}
            />
          </div>
          <span
            style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 700,
              fontSize: 18,
              color: accentColor,
            }}
          >
            {PALETTE_COLORS[activeIndex].label}
          </span>
          <span style={{ fontSize: 12, color: '#7a5060' }}>
            {PALETTE_COLORS[activeIndex].hex}
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ==========================================================================
   COMPONENT: BEFORE / AFTER NAIL REVEAL
   ========================================================================== */

function BeforeAfterSection({ accentColor }: { accentColor: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      ref={ref}
      style={{ padding: '120px 40px', maxWidth: 960, margin: '0 auto', textAlign: 'center' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <div
          style={{
            fontSize: 11,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: accentColor,
            marginBottom: 16,
          }}
        >
          — La transformation —
        </div>
        <h2
          style={{fontFamily: 'Syne, sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(32px, 4vw, 52px)',
            letterSpacing: '-0.03em',
            color: brand ?? '#1a0a10',
            marginBottom: 16,
          }}
        >
          Before &amp; After
        </h2>
        <p
          style={{
            fontSize: 16,
            color: '#7a5060',
            maxWidth: 420,
            margin: '0 auto 64px',
            lineHeight: 1.7,
            fontWeight: 300,
          }}
        >
          Du naturel au sublime — notre nail art révèle votre personnalité.
        </p>
      </motion.div>

      <div
        style={{
          display: 'flex',
          gap: 40,
          justifyContent: 'center',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
        }}
      >
        {/* BEFORE */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}
        >
          <div
            style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#7a5060',
            }}
          >
            Avant
          </div>
          {/* Plain nail */}
          <div style={{ display: 'flex', gap: 8 }}>
            {[1, 2, 3, 4, 5].map((n) => (
              <div
                key={n}
                style={{
                  width: n === 1 || n === 5 ? 28 : n === 3 ? 36 : 32,
                  height: n === 1 || n === 5 ? 70 : n === 3 ? 86 : 78,
                  background: '#C8A882',
                  borderRadius: '50% 50% 20% 20% / 40% 40% 10% 10%',
                  boxShadow: 'inset 2px 2px 8px rgba(255,255,255,0.4), 0 4px 12px rgba(0,0,0,0.1)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 4,
                    left: 4,
                    width: 5,
                    height: 18,
                    background: 'rgba(255,255,255,0.3)',
                    borderRadius: 4,
                  }}
                />
              </div>
            ))}
          </div>
          <p style={{ fontSize: 13, color: '#7a5060', textAlign: 'center' }}>
            Natural — ongles<br />sans préparation
          </p>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: 60,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}88 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 20,
              boxShadow: `0 8px 24px ${accentColor}44`,
            }}
          >
            →
          </div>
        </motion.div>

        {/* AFTER */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}
        >
          <div
            style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: accentColor,
            }}
          >
            Après
          </div>
          {/* Decorated nails */}
          <div style={{ display: 'flex', gap: 8 }}>
            {[1, 2, 3, 4, 5].map((n) => {
              const w = n === 1 || n === 5 ? 28 : n === 3 ? 36 : 32;
              const h = n === 1 || n === 5 ? 70 : n === 3 ? 86 : 78;
              return (
                <motion.div
                  key={n}
                  initial={{ clipPath: 'inset(100% 0 0 0)' }}
                  animate={inView ? { clipPath: 'inset(0% 0 0 0)' } : {}}
                  transition={{ duration: 0.9, delay: 0.5 + n * 0.12, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    width: w,
                    height: h,
                    background: `linear-gradient(160deg, ${accentColor} 0%, ${accentColor}cc 60%, #1a0a10 100%)`,
                    borderRadius: '50% 50% 20% 20% / 40% 40% 10% 10%',
                    boxShadow: `inset 2px 2px 8px rgba(255,255,255,0.3), 0 4px 20px ${accentColor}55`,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Shine */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 4,
                      left: 4,
                      width: 5,
                      height: 18,
                      background: 'rgba(255,255,255,0.5)',
                      borderRadius: 4,
                    }}
                  />
                  {/* Art detail — small star */}
                  {n === 3 && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 12,
                        right: 6,
                        color: '#FFD700',
                        fontSize: 10,
                        lineHeight: 1,
                      }}
                    >
                      ✦
                    </div>
                  )}
                  {n === 2 && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 10,
                        left: 4,
                        width: '60%',
                        height: 1,
                        background: 'rgba(255,255,255,0.5)',
                        borderRadius: 1,
                      }}
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
          <p style={{ fontSize: 13, color: accentColor, textAlign: 'center', fontWeight: 500 }}>
            Nail Art Signature —<br />résultat longue durée
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ==========================================================================
   COMPONENT: GALLERY MASONRY
   ========================================================================== */

function GallerySection({ accentColor }: { accentColor: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      id="galerie"
      ref={ref}
      style={{
        padding: '120px 40px',
        background: `linear-gradient(180deg, #fff9f7 0%, ${accentColor}08 100%)`,
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          style={{ textAlign: 'center', marginBottom: 64 }}
        >
          <div
            style={{
              fontSize: 11,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: accentColor,
              marginBottom: 16,
            }}
          >
            — Nos réalisations —
          </div>
          <h2
            style={{fontFamily: 'Syne, sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(32px, 4vw, 52px)',
              letterSpacing: '-0.03em',
              color: brand ?? '#1a0a10',
            }}
          >
            Galerie <span style={{ color: accentColor }}>d&apos;art</span>
          </h2>
        </motion.div>

        {/* Masonry grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gridAutoRows: 160,
            gap: 16,
          }}
        >
          {GALLERY_ITEMS.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              whileHover={{ scale: 1.03, zIndex: 10 }}
              style={{
                gridColumn:
                  item.aspect === 'landscape'
                    ? 'span 2'
                    : item.aspect === 'portrait'
                      ? 'span 1'
                      : 'span 1',
                gridRow: item.aspect === 'portrait' ? 'span 2' : 'span 1',
                borderRadius: 16,
                background: `linear-gradient(135deg, ${item.color} 0%, ${item.color}88 100%)`,
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                boxShadow: `0 4px 20px ${item.color}44`,
              }}
            >
              {/* Inner content */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(180deg, transparent 50%, rgba(26,10,16,0.8) 100%)',
                  display: 'flex',
                  alignItems: 'flex-end',
                  padding: 16,
                  opacity: 0,
                  transition: 'opacity 0.3s',
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.opacity = '1')
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.opacity = '0')
                }
              >
                <span
                  style={{
                    color: '#fff',
                    fontFamily: 'Syne, sans-serif',
                    fontWeight: 700,
                    fontSize: 14,
                  }}
                >
                  {item.label}
                </span>
              </div>

              {/* Shine overlay */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '-50%',
                  width: '50%',
                  height: '100%',
                  background:
                    'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
                  transform: 'skewX(-20deg)',
                  animation: `shimmer ${4 + i * 0.5}s ${i * 0.3}s linear infinite`,
                  backgroundSize: '200% auto',
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   COMPONENT: BOOKING SLOTS
   ========================================================================== */

function BookingSection({ accentColor }: { accentColor: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [confirmedSlot, setConfirmedSlot] = useState<string | null>(null);

  const handleSlotClick = useCallback(
    (slot: Slot) => {
      if (slot.booked) return;
      setSelectedSlot(slot.id);
      setTimeout(() => {
        setConfirmedSlot(slot.id);
      }, 600);
    },
    []
  );

  return (
    <section
      id="booking"
      ref={ref}
      style={{ padding: '120px 40px', maxWidth: 1100, margin: '0 auto' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        style={{ textAlign: 'center', marginBottom: 64 }}
      >
        <div
          style={{
            fontSize: 11,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: accentColor,
            marginBottom: 16,
          }}
        >
          — Disponibilités —
        </div>
        <h2
          style={{fontFamily: 'Syne, sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(32px, 4vw, 52px)',
            letterSpacing: '-0.03em',
            color: brand ?? '#1a0a10',
            marginBottom: 16,
          }}
        >
          Réservez votre{' '}
          <span style={{ color: accentColor }}>créneau</span>
        </h2>
        <p style={{ fontSize: 16, color: '#7a5060', fontWeight: 300 }}>
          Semaine du 19 au 24 mai — sélectionnez un créneau disponible.
        </p>
      </motion.div>

      {/* Day headers */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `80px repeat(${DAYS.length}, 1fr)`,
          gap: 8,
          marginBottom: 8,
        }}
      >
        <div />
        {DAYS.map((day) => (
          <div
            key={day}
            style={{textAlign: 'center',
              fontFamily: 'Syne, sans-serif',
              fontWeight: 700,
              fontSize: 14,
              color: brand ?? '#1a0a10',
              padding: '8px 0',
            }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Slots grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `80px repeat(${DAYS.length}, 1fr)`,
          gap: 8,
        }}
      >
        {TIMES.map((time, timeIdx) => (
          <React.Fragment key={time}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                paddingRight: 12,
                fontSize: 12,
                color: '#7a5060',
                fontWeight: 400,
              }}
            >
              {time}
            </div>
            {DAYS.map((day, dayIdx) => {
              const slot = SLOTS.find((s) => s.day === day && s.time === time)!;
              const isSelected = selectedSlot === slot.id;
              const isConfirmed = confirmedSlot === slot.id;
              const globalIndex = timeIdx * DAYS.length + dayIdx;

              return (
                <motion.div
                  key={slot.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: globalIndex * 0.02, duration: 0.4 }}
                  onClick={() => handleSlotClick(slot)}
                  className={!slot.booked && !isConfirmed ? 'slot-available' : ''}
                  style={{
                    padding: '10px 8px',
                    borderRadius: 10,
                    textAlign: 'center',
                    fontSize: 12,
                    cursor: slot.booked ? 'not-allowed' : 'pointer',
                    background: isConfirmed
                      ? `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}bb 100%)`
                      : isSelected
                        ? `${accentColor}30`
                        : slot.booked
                          ? '#f0dde5'
                          : '#ffffff',
                    border: isConfirmed
                      ? `1px solid ${accentColor}`
                      : isSelected
                        ? `1px solid ${accentColor}`
                        : slot.booked
                          ? '1px solid #f0dde5'
                          : `1px solid ${accentColor}30`,
                    color: isConfirmed
                      ? '#fff'
                      : slot.booked
                        ? '#7a5060'
                        : '#1a0a10',
                    transition: 'all 0.2s ease',
                    fontWeight: isConfirmed ? 600 : 300,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {slot.booked ? (
                    <span style={{ textDecoration: 'line-through', opacity: 0.5 }}>Complet</span>
                  ) : isConfirmed ? (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                    >
                      ✓ Réservé
                    </motion.span>
                  ) : (
                    <span>Libre</span>
                  )}
                </motion.div>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      {/* Confirmation message */}
      <AnimatePresence>
        {confirmedSlot && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{
              marginTop: 40,
              padding: '24px 32px',
              background: `linear-gradient(135deg, ${accentColor}15 0%, ${accentColor}08 100%)`,
              border: `1px solid ${accentColor}40`,
              borderRadius: 16,
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: 700,
                fontSize: 20,
                color: accentColor,
                marginBottom: 8,
              }}
            >
              ✦ Créneau sélectionné !
            </div>
            <p style={{ fontSize: 14, color: '#7a5060', fontWeight: 300 }}>
              Votre demande de réservation a été enregistrée.
              Nous vous confirmerons par email dans les 24h.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ==========================================================================
   COMPONENT: TESTIMONIALS
   ========================================================================== */

const TESTIMONIALS = [
  {
    name: 'Camille L.',
    text: "Je reviens depuis 3 ans — the nail art quality is simply unmatched in Paris. Chaque pose est un chef-d'œuvre.",
    rating: 5,
    service: 'Nail Art Signature',
  },
  {
    name: 'Sophie M.',
    text: 'La manucure russe a complètement transformé mes ongles. Finally found my go-to nail studio!',
    rating: 5,
    service: 'Manucure Russe',
  },
  {
    name: 'Léa R.',
    text: "Pose gel impeccable, tient 4 semaines sans écailles. Le studio est magnifique et l\'équipe adorable.",
    rating: 5,
    service: 'Pose Gel',
  },
];

function TestimonialsSection({ accentColor }: { accentColor: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <section
      ref={ref}
      style={{
        padding: '120px 40px',
        background: `linear-gradient(180deg, #fff9f7 0%, ${accentColor}0d 100%)`,
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          style={{ textAlign: 'center', marginBottom: 64 }}
        >
          <div
            style={{
              fontSize: 11,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: accentColor,
              marginBottom: 16,
            }}
          >
            — Avis clients —
          </div>
          <h2
            style={{fontFamily: 'Syne, sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(32px, 4vw, 48px)',
              letterSpacing: '-0.03em',
              color: brand ?? '#1a0a10',
            }}
          >
            Elles nous font{' '}
            <span style={{ color: accentColor }}>confiance</span>
          </h2>
        </motion.div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 24,
          }}
        >
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15, duration: 0.7 }}
              style={{
                background: '#fff',
                border: '1px solid #f0dde5',
                borderRadius: 20,
                padding: '32px 28px',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
              }}
            >
              <div style={{ display: 'flex', gap: 2 }}>
                {Array.from({ length: t.rating }).map((_, j) => (
                  <span key={j} style={{ color: '#FFD700', fontSize: 16 }}>
                    ★
                  </span>
                ))}
              </div>
              <p
                style={{fontSize: 15,
                  color: brand ?? '#1a0a10',
                  lineHeight: 1.7,
                  fontStyle: 'italic',
                  fontWeight: 300,
                }}
              >
                &ldquo;{t.text}&rdquo;
              </p>
              <div style={{ borderTop: '1px solid #f0dde5', paddingTop: 16, marginTop: 'auto' }}>
                <div
                  style={{fontWeight: 600, fontSize: 14, color: brand ?? '#1a0a10' }}
                >
                  {t.name}
                </div>
                <div style={{ fontSize: 12, color: accentColor, marginTop: 2 }}>
                  {t.service}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   COMPONENT: CONTACT
   ========================================================================== */

function ContactSection({ accentColor }: { accentColor: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <section
      id="contact"
      ref={ref}
      style={{
        padding: '120px 40px',
        maxWidth: 900,
        margin: '0 auto',
        textAlign: 'center',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <div
          style={{
            fontSize: 11,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: accentColor,
            marginBottom: 16,
          }}
        >
          — Nous trouver —
        </div>
        <h2
          style={{fontFamily: 'Syne, sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(32px, 4vw, 52px)',
            letterSpacing: '-0.03em',
            color: brand ?? '#1a0a10',
            marginBottom: 48,
          }}
        >
          Venez nous rendre{' '}
          <span style={{ color: accentColor }}>visite</span>
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: 24,
            marginBottom: 56,
          }}
        >
          {[
            { icon: '📍', label: 'Adresse', value: '12 Rue du Faubourg\nSaint-Honoré, Paris 8e' },
            { icon: '📞', label: 'Téléphone', value: '+33 1 42 56 78 90' },
            { icon: '🕐', label: 'Horaires', value: 'Mar–Sam : 10h–19h\nDimanche : 11h–17h' },
            { icon: '✉️', label: 'Email', value: 'contact@studionail.fr' },
          ].map((info) => (
            <motion.div
              key={info.label}
              whileHover={{ y: -4 }}
              style={{
                background: '#fff',
                border: '1px solid #f0dde5',
                borderRadius: 16,
                padding: '28px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                transition: 'box-shadow 0.2s',
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px ${accentColor}22`)
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.boxShadow = 'none')
              }
            >
              <TemplateIcon emoji={info.icon} size={28} />
              <div
                style={{
                  fontFamily: 'Syne, sans-serif',
                  fontWeight: 700,
                  fontSize: 13,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: accentColor,
                }}
              >
                {info.label}
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: '#7a5060',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-line',
                }}
              >
                {info.value}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Big CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.4, duration: 0.7 }}
          style={{
            background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}cc 100%)`,
            borderRadius: 24,
            padding: '48px 40px',
            color: '#fff',
          }}
        >
          <div
            style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(24px, 4vw, 40px)',
              letterSpacing: '-0.03em',
              marginBottom: 16,
            }}
          >
            Ready for your glow-up?
          </div>
          <p style={{ fontSize: 16, opacity: 0.85, marginBottom: 32, fontWeight: 300 }}>
            Réservez dès maintenant et transformez vos ongles en œuvre d&apos;art.
          </p>
          <a
            href="#booking"
            style={{
              background: '#fff',
              color: accentColor,
              padding: '16px 40px',
              borderRadius: 50,
              fontSize: 15,
              fontWeight: 600,
              textDecoration: 'none',
              display: 'inline-block',
              letterSpacing: '0.02em',
            }}
          >
            Prendre rendez-vous →
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ==========================================================================
   COMPONENT: FOOTER
   ========================================================================== */

function Footer({ accentColor }: { accentColor: string }) {
  return (
    <footer
      style={{background: brand ?? '#1a0a10',
        padding: '48px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 24,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <TemplateIcon emoji="💅" size={22} />
        <span
          style={{
            fontFamily: 'Syne, sans-serif',
            fontWeight: 700,
            fontSize: 18,
            color: accentColor,
          }}
        >{fd?.businessName ?? "Studio Nail"}</span>
      </div>

      <div style={{ display: 'flex', gap: 32 }}>
        {['Instagram', 'TikTok', 'Pinterest'].map((social) => (
          <a
            key={social}
            href={
              social === 'Instagram'
                ? 'https://instagram.com'
                : social === 'TikTok'
                ? 'https://tiktok.com'
                : 'https://pinterest.com'
            }
            style={{
              color: 'rgba(255,255,255,0.5)',
              textDecoration: 'none',
              fontSize: 13,
              letterSpacing: '0.06em',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = accentColor)}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = 'rgba(255,255,255,0.5)')}
          >
            {social}
          </a>
        ))}
      </div>

      <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>
        © 2025 Studio Nail. All rights reserved.
      </div>
    </footer>
  );
}

/* ==========================================================================
   ROOT COMPONENT
   ========================================================================== */


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function NailStudioTemplate() {
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

  const [particles] = useState<Particle[]>(() => generateParticles());
  const [activePaletteIndex, setActivePaletteIndex] = useState(2); // default rose
  const [accentColor, setAccentColor] = useState(PALETTE_COLORS[2].hex);

  // Inject global CSS once
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'nail-studio-global';
    style.textContent = GLOBAL_CSS;
    if (!document.getElementById('nail-studio-global')) {
      document.head.appendChild(style);
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
return () => {
      const el = document.getElementById('nail-studio-global');
      if (el) el.remove();
    };
  }, []);

  // Palette color updates
  const handlePaletteChange = useCallback((index: number) => {
    setActivePaletteIndex(index);
    setAccentColor(PALETTE_COLORS[index].hex);
  }, []);

  // Scroll-driven palette switcher: as user scrolls palette section, cycle colors
  const paletteRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: paletteScrollProgress } = useScroll({
    target: paletteRef,
    offset: ['start end', 'end start'],
  });

  useEffect(() => {
    const unsubscribe = paletteScrollProgress.on('change', (v) => {
      // Map scroll 0–1 to palette 0–7
      const idx = Math.min(
        PALETTE_COLORS.length - 1,
        Math.floor(v * PALETTE_COLORS.length)
      );
      // Only auto-change if user hasn't manually clicked recently
      // We use the scroll as a suggestion — visual interpolation
    });
    return unsubscribe;
  }, [paletteScrollProgress]);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#fff9f7',
        fontFamily: 'Inter, sans-serif',
        transition: 'background 0.5s ease',
      }}
    >
      <Nav accentColor={accentColor} />

      <main>
        {/* 1. Sparkle Hero */}
        <Hero accentColor={accentColor} particles={particles} />

        {/* 2. Services flip cards */}
        <ServicesSection accentColor={accentColor} />

        {/* 3. Color palette scroll switcher */}
        <div ref={paletteRef}>
          <PaletteSection
            activeIndex={activePaletteIndex}
            onSwatchClick={handlePaletteChange}
            accentColor={accentColor}
          />
        </div>

        {/* 4. Before / After nail reveal */}
        <BeforeAfterSection accentColor={accentColor} />

        {/* 5. Gallery masonry */}
        <GallerySection accentColor={accentColor} />

        {/* 6. Testimonials */}
        <TestimonialsSection accentColor={accentColor} />

        {/* 7. Booking slots grid */}
        <BookingSection accentColor={accentColor} />

        {/* 8. Contact */}
        <ContactSection accentColor={accentColor} />
      </main>

      <Footer accentColor={accentColor} />
    </div>
  );
}
