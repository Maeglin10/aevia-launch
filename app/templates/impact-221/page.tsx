"use client";
// @ts-nocheck

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
  useMotionValue,
} from 'framer-motion';
import {
  Zap,
  Battery,
  Gauge,
  ArrowRight,
  ArrowDown,
  Check,
  ChevronRight,
  MapPin,
  Clock,
  Shield,
  Leaf,
  Star,
  Send,
  Play,
  Menu,
  Globe,
} from 'lucide-react';

// Hoisted above the design tokens: several templates read `brand` in a
// module-level const — declaring it lower caused a TDZ ReferenceError (500).
let brand: any = null;

/* ════════════════════════════════════════════════════════════════════════════
   LUMYX — Premium Electric Urban Mobility
   Real-photography scroll choreography
   ════════════════════════════════════════════════════════════════════════════ */

// ─── Verified Unsplash images ────────────────────────────────────────────────
const IMG = {
  hero:     'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=90&w=2000&auto=format&fit=crop',
  city:     'https://images.unsplash.com/photo-1571068316344-75bc76f77890?q=85&w=1600&auto=format&fit=crop',
  ride:     'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?q=85&w=1600&auto=format&fit=crop',
  detail:   'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=85&w=1600&auto=format&fit=crop',
  bike:     'https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=85&w=1600&auto=format&fit=crop',
  lifestyle:'https://images.unsplash.com/photo-1511994298241-608e28f14fde?q=85&w=1600&auto=format&fit=crop',
};

// ─── Design tokens ───────────────────────────────────────────────────────────
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
  bg:        '#06080d',
  bgSoft:    '#0a0d14',
  bgCard:    '#0d1119',
  border:    '#161d2a',
  borderHi:  '#1e2d44',
  blue:      '#00d4ff',
  blueDeep:  '#0096c7',
  blueDim:   'rgba(0,212,255,0.12)',
  blueGlow:  'rgba(0,212,255,0.4)',
  white:     '#f0f4f8',
  whiteOff:  '#c8d4e0',
  muted:     '#6b7f97',
};

const pageStyle: React.CSSProperties = {
  background: C.bg,
  color: C.white,
  fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
  overflowX: 'hidden',
};

// ─── clamp helper ────────────────────────────────────────────────────────────
const fl = (min: number, max: number) =>
  `clamp(${min}rem, ${min * 0.5 + (max - min) * 0.5}vw + ${min * 0.5}rem, ${max}rem)`;

// ─── Count-up hook ───────────────────────────────────────────────────────────
function useCountUp(target: number, duration: number, active: boolean): number {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(ease * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);
  return value;
}

/* ════════════════════════════════════════════════════════════════════════════
   NAV
   ════════════════════════════════════════════════════════════════════════════ */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = ['Modèles', 'Technologie', 'Galerie', 'À propos'];
  const getLinkHref = (l: string) => {
    const norm = l.toLowerCase();
    if (norm.includes('modèle')) return '#modeles';
    if (norm.includes('techno')) return '#technologie';
    if (norm.includes('galerie')) return '#galerie';
    if (norm.includes('propos')) return '#about';
    return '#';
  };

  const navStyle: React.CSSProperties = {
    position:        'fixed',
    top:             0,
    left:            0,
    right:           0,
    zIndex:          100,
    padding:         '0 clamp(1rem, 4vw, 3rem)',
    height:          '72px',
    display:         'flex',
    alignItems:      'center',
    justifyContent:  'space-between',
    transition:      'background 0.4s ease, border-color 0.4s ease',
    background:      scrolled ? 'rgba(6,8,13,0.92)' : 'transparent',
    borderBottom:    scrolled ? `1px solid ${C.border}` : '1px solid transparent',
    backdropFilter:  scrolled ? 'blur(16px)' : 'none',
  };

  const logoMarkStyle: React.CSSProperties = {
    width:     36,
    height:    36,
    background: C.blue,
    clipPath:  'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
    display:   'flex',
    alignItems:'center',
    justifyContent: 'center',
  };

  return (
    <>
      <nav style={navStyle}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
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
              <div style={logoMarkStyle}>
                <Zap size={16} color={C.bg} fill={C.bg} />
              </div>
              <span style={{ fontWeight: 900, fontSize: '1.4rem', letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: C.white }}>
                LU<span style={{ color: C.blue }}>M</span>YX
              </span>
            </>
          )}
        </div>

        {/* Desktop links */}
        <div className="sky-desktop-nav" style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
          {links.map((l) => (
            <a
              key={l}
              href={getLinkHref(l)}
              style={{ color: C.whiteOff, textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, transition: 'color 0.2s', cursor: 'pointer' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = C.blue; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = C.whiteOff; }}
            >
              {l}
            </a>
          ))}
        </div>

        {/* CTA + burger */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <a href="#reserve" style={{ textDecoration: 'none', display: 'inline-block' }}>
            <button
              style={{ background: 'transparent', border: `1px solid ${C.blue}`, color: C.blue, padding: '10px 22px', borderRadius: '2px', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase' as const, cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={(e) => { const b = e.currentTarget; b.style.background = C.blue; b.style.color = C.bg; }}
              onMouseLeave={(e) => { const b = e.currentTarget; b.style.background = 'transparent'; b.style.color = C.blue; }}
            >
              Réserver
            </button>
          </a>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: 'none', border: 'none', color: C.white, cursor: 'pointer' }}
            aria-label="Menu"
          >
            <Menu size={24} />
          </button>
        </div>
        <style>{`@media (max-width: 900px){.sky-desktop-nav{display:none !important}}`}</style>
      </nav>

      {/* Mobile overlay menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{ position: 'fixed', top: 72, left: 0, right: 0, background: 'rgba(6,8,13,0.97)', backdropFilter: 'blur(20px)', zIndex: 99, padding: '2rem', borderBottom: `1px solid ${C.border}` }}
          >
            {links.map((l) => (
              <div key={l} style={{ padding: '1rem 0', borderBottom: `1px solid ${C.border}` }}>
                <a href={getLinkHref(l)} style={{ color: C.white, textDecoration: 'none', fontSize: '1.1rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.1em' }}>{l}</a>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root { scroll-behavior: smooth; }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
      `}</style>
    </>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   HERO — parallax photography
   ════════════════════════════════════════════════════════════════════════════ */
function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });

  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.14]);
  const imgY     = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-28%']);
  const opacity  = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section id="hero"
      ref={ref}
      style={{ position: 'relative', height: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}
    >
      {/* Parallax photo */}
      <motion.div style={{ position: 'absolute', inset: '-12%', scale: imgScale, y: imgY }}>
        <img
          src={IMG.hero}
          alt="Lumyx — scooter électrique premium en ville"
          loading="eager"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
        />
      </motion.div>

      {/* Scrims */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(6,8,13,0.87) 0%, rgba(6,8,13,0.5) 55%, rgba(6,8,13,0.15) 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(6,8,13,0.92) 0%, transparent 50%)' }} />

      {/* Glow */}
      <div style={{ position: 'absolute', bottom: '30%', left: '4%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,255,0.1) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />

      {/* Content */}
      <motion.div
        style={{ position: 'relative', zIndex: 2, maxWidth: '1200px', width: '100%', padding: '0 clamp(1.5rem, 5vw, 4rem)', y: contentY, opacity }}
      >
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: C.blueDim, border: `1px solid rgba(0,212,255,0.3)`, borderRadius: '2px', padding: '6px 14px', marginBottom: '2rem' }}
        >
          <Zap size={12} color={C.blue} />
          <span style={{ color: C.blue, fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase' as const }}>
            Mobilité Électrique Premium
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35 }}
          style={{ fontSize: fl(2.6, 6.5), fontWeight: 900, lineHeight: 1.0, letterSpacing: '-0.03em', textTransform: 'uppercase' as const, marginBottom: '1.5rem', maxWidth: '750px' }}
        >
          Redéfinir<br />le mouvement<br />
          <span style={{ color: C.blue, textShadow: `0 0 40px ${C.blueGlow}` }}>urbain</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          style={{ fontSize: fl(1, 1.25), color: C.whiteOff, maxWidth: '480px', lineHeight: 1.65, marginBottom: '2.5rem' }}
        >
          Lumyx repense la mobilité électrique avec une ingénierie de précision et un design qui impose le respect.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}
        >
          <button
            style={{ background: C.blue, border: 'none', color: C.bg, padding: '16px 36px', fontWeight: 800, fontSize: '0.85rem', letterSpacing: '0.12em', textTransform: 'uppercase' as const, cursor: 'pointer', borderRadius: '2px', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s', boxShadow: `0 0 30px rgba(0,212,255,0.35)` }}
            onMouseEnter={(e) => { const b = e.currentTarget; b.style.background = '#00eeff'; b.style.boxShadow = `0 0 50px rgba(0,212,255,0.6)`; }}
            onMouseLeave={(e) => { const b = e.currentTarget; b.style.background = C.blue; b.style.boxShadow = `0 0 30px rgba(0,212,255,0.35)`; }}
          >
            Découvrir les modèles <ArrowRight size={16} />
          </button>
          <button
            style={{ background: 'rgba(240,244,248,0.08)', border: `1px solid rgba(240,244,248,0.2)`, color: C.white, padding: '16px 32px', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase' as const, cursor: 'pointer', borderRadius: '2px', display: 'flex', alignItems: 'center', gap: '8px', backdropFilter: 'blur(8px)', transition: 'all 0.2s' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(240,244,248,0.15)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(240,244,248,0.08)'; }}
          >
            <Play size={14} fill={C.white} /> Voir en action
          </button>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        style={{ position: 'absolute', bottom: '2.5rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', zIndex: 2 }}
      >
        <span style={{ color: C.muted, fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase' as const }}>Défiler</span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}>
          <ArrowDown size={18} color={C.blue} />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   STATS BAND — count-up on scroll
   ════════════════════════════════════════════════════════════════════════════ */
interface StatItemProps {
  value:  number;
  suffix: string;
  label:  string;
  icon:   React.ReactNode;
  active: boolean;
}

function StatItem({ value, suffix, label, icon, active }: StatItemProps) {
  const count = useCountUp(value, 1800, active);
  return (
    <div style={{ flex: '1 1 200px', textAlign: 'center', padding: '2.5rem 1.5rem', borderRight: `1px solid ${C.border}` }}>
      <div style={{ color: C.blue, marginBottom: '0.75rem', display: 'flex', justifyContent: 'center' }}>{icon}</div>
      <div style={{ fontSize: fl(2.4, 4), fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1 }} suppressHydrationWarning>
        <span style={{ color: C.blue }}>{count}</span>
        <span style={{ color: C.white, fontSize: '0.5em', marginLeft: '2px' }}>{suffix}</span>
      </div>
      <div style={{ color: C.muted, fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, marginTop: '0.6rem' }}>{label}</div>
    </div>
  );
}

function StatsBand() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const stats: Array<{ value: number; suffix: string; label: string; icon: React.ReactNode }> = [
    { value: 230, suffix: ' km',   label: 'Autonomie maximale',  icon: <Battery size={28} /> },
    { value: 45,  suffix: ' km/h', label: 'Vitesse de pointe',   icon: <Gauge size={28} /> },
    { value: 25,  suffix: ' h',    label: 'Charge rapide',       icon: <Zap size={28} /> },
    { value: 95,  suffix: ' %',    label: 'Clients satisfaits',  icon: <Star size={28} /> },
  ];

  return (
    <section ref={ref} style={{ background: C.bgSoft, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap' }}>
        {stats.map((s, i) => <StatItem key={i} {...s} active={inView} />)}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   STICKY CROSSFADE — 320vh, 3 photos
   ════════════════════════════════════════════════════════════════════════════ */
const SLIDES = [
  { img: IMG.city,      caption: 'Autonomie', sub: "Jusqu'à 230 km sur une seule charge. La ville entière est à portée de roue." },
  { img: IMG.ride,      caption: 'Puissance', sub: 'Moteur 750W Peak. Accélération instantanée, silence total.' },
  { img: IMG.lifestyle, caption: 'Liberté',   sub: 'Aucun compromis. Aucun trajet refusé. Votre rythme, votre route.' },
];

function StickyCrossfade() {
  const n = SLIDES.length;
  const progress = useMotionValue(0.5 / n);
  const [active, setActive] = useState(0);
  const op0 = useTransform(progress, [0, 0.28, 0.42], [1, 1, 0]);
  const op1 = useTransform(progress, [0.28, 0.42, 0.70, 0.82], [0, 1, 1, 0]);
  const op2 = useTransform(progress, [0.70, 0.82, 1], [0, 1, 1]);
  const barW = useTransform(progress, [0, 1], ['0%', '100%']);

  const opacities = [op0, op1, op2];
  const goTo = (i: number) => {
    setActive(i);
    progress.set((i + 0.5) / n);
  };

  return (
    <div id="about" style={{ height: '100vh', overflow: 'hidden', position: 'relative' }}>
      <div style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
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
        {/* Progress bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: C.border, zIndex: 10 }}>
          <motion.div style={{ height: '100%', background: C.blue, width: barW, boxShadow: `0 0 10px ${C.blueGlow}` }} />
        </div>

        {SLIDES.map((slide, i) => (
          <motion.div key={i} style={{ position: 'absolute', inset: 0, opacity: opacities[i] }}>
            <img
              src={slide.img}
              alt={slide.caption}
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(6,8,13,0.92) 0%, rgba(6,8,13,0.45) 55%, transparent 100%)' }} />

            <div style={{ position: 'absolute', bottom: 'clamp(3rem, 7vh, 6rem)', left: 'clamp(1.5rem, 6vw, 5rem)', maxWidth: '520px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ width: 3, height: 52, background: C.blue, boxShadow: `0 0 14px ${C.blueGlow}` }} />
                <span style={{ fontSize: fl(2.5, 5.5), fontWeight: 900, textTransform: 'uppercase' as const, letterSpacing: '-0.02em' }}>{slide.caption}</span>
              </div>
              <p style={{ color: C.whiteOff, fontSize: fl(0.95, 1.15), lineHeight: 1.65 }}>{slide.sub}</p>
            </div>

            {/* Slide indicators */}
            <div style={{ position: 'absolute', top: '50%', right: 'clamp(1.5rem, 3vw, 2.5rem)', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {SLIDES.map((_, j) => (
                <div key={j} style={{ width: 3, height: j === i ? 34 : 16, background: j === i ? C.blue : C.muted, borderRadius: 2, transition: 'height 0.3s' }} />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   MODELS
   ════════════════════════════════════════════════════════════════════════════ */
const MODELS = [
  { name: 'Lumyx ONE', tagline: "L'essentiel réinventé",      price: '2 490', range: '120 km', speed: '35 km/h', charge: '3.5 h', img: IMG.bike,     badge: 'Bestseller',      accent: C.blue },
  { name: 'Lumyx PRO', tagline: 'Pour ceux qui vont plus loin',price: '3 890', range: '180 km', speed: '45 km/h', charge: '2.5 h', img: IMG.ride,     badge: 'Recommandé',      accent: '#7c3aed' },
  { name: 'Lumyx GT',  tagline: 'La performance absolue',     price: '5 490', range: '230 km', speed: '45 km/h', charge: '1.8 h', img: IMG.hero,     badge: 'Édition limitée', accent: brand ?? '#f59e0b' },
];

type ModelType = typeof MODELS[0];

function ModelCard({ model, index }: { model: ModelType; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex:         '1 1 300px',
        background:   C.bgCard,
        border:       `1px solid ${hovered ? model.accent : C.border}`,
        borderRadius: '4px',
        overflow:     'hidden',
        cursor:       'pointer',
        transition:   'border-color 0.3s, box-shadow 0.3s, transform 0.3s',
        transform:    hovered ? 'translateY(-8px)' : 'translateY(0)',
        boxShadow:    hovered ? `0 20px 60px rgba(0,0,0,0.5), 0 0 30px ${model.accent}22` : '0 4px 20px rgba(0,0,0,0.3)',
      }}
    >
      <div style={{ position: 'relative', height: '260px', overflow: 'hidden' }}>
        <img
          src={model.img}
          alt={model.name}
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease', transform: hovered ? 'scale(1.06)' : 'scale(1)' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(13,17,25,0.95) 100%)' }} />
        <div style={{ position: 'absolute', top: '1rem', left: '1rem', background: model.accent, color: model.accent === C.blue ? C.bg : '#fff', padding: '4px 12px', fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' as const, borderRadius: '2px' }}>
          {model.badge}
        </div>
      </div>

      <div style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>{model.name}</h3>
        <p style={{ color: C.muted, fontSize: '0.85rem', marginBottom: '1.25rem' }}>{model.tagline}</p>

        <div style={{ display: 'flex', gap: '0.65rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {([['Battery', model.range], ['Gauge', model.speed], ['Zap', model.charge]] as Array<[string, string]>).map(([, val], si) => {
            const icons = [<Battery key="b" size={13} />, <Gauge key="g" size={13} />, <Zap key="z" size={13} />];
            return (
              <div key={si} style={{ display: 'flex', alignItems: 'center', gap: '5px', background: C.bgSoft, border: `1px solid ${C.border}`, padding: '5px 10px', borderRadius: '2px', color: C.whiteOff, fontSize: '0.75rem', fontWeight: 600 }}>
                <span style={{ color: model.accent }}>{icons[si]}</span>{val}
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ color: C.muted, fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>À partir de</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.02em' }}>
              {model.price} <span style={{ fontSize: '1rem' }}>€</span>
            </div>
          </div>
          <button
            style={{ background: model.accent, border: 'none', color: model.accent === C.blue ? C.bg : '#fff', padding: '12px 20px', fontWeight: 800, fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase' as const, cursor: 'pointer', borderRadius: '2px', display: 'flex', alignItems: 'center', gap: '6px', transition: 'opacity 0.2s' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.85'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; }}
          >
            Réserver <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function Models() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <section id="modeles" style={{ background: C.bg, padding: 'clamp(5rem, 10vh, 8rem) clamp(1.5rem, 5vw, 4rem)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ width: 40, height: 2, background: C.blue }} />
            <span style={{ color: C.blue, fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase' as const }}>La gamme</span>
          </div>
          <h2 style={{ fontSize: fl(2, 4), fontWeight: 900, textTransform: 'uppercase' as const, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            Choisissez votre<br /><span style={{ color: C.blue }}>liberté</span>
          </h2>
        </motion.div>
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          {MODELS.map((m, i) => <ModelCard key={m.name} model={m} index={i} />)}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   TECH EDITORIAL
   ════════════════════════════════════════════════════════════════════════════ */
const EDITORIAL = [
  {
    eyebrow: 'Ingénierie',
    title:   'Batterie longue portée Samsung 21700',
    body:    "Nos cellules Samsung 21700 offrent une densité d'énergie supérieure de 20% à la génération précédente. Gestion thermique active pour des performances optimales en toute saison.",
    img:     IMG.detail,
    pills:   ['BMS 3e génération', 'Temp. −20°C → +55°C', '1000+ cycles'],
    reverse: false,
  },
  {
    eyebrow: 'Design',
    title:   'Cadre aluminium 6061-T6 brossé',
    body:    "Chaque ligne du châssis Lumyx est le résultat de 18 mois de conception aérodynamique. Rigidité structurelle maximale pour un poids de 19,5 kg seulement.",
    img:     IMG.city,
    pills:   ['IP67 waterproof', 'Poids 19,5 kg', 'CNC usiné'],
    reverse: true,
  },
];

type EditorialRowType = typeof EDITORIAL[0];

function EditorialRow({ row, index }: { row: EditorialRowType; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      style={{
        display:       'flex',
        gap:           'clamp(2rem, 6vw, 5rem)',
        alignItems:    'center',
        flexDirection: (row.reverse ? 'row-reverse' : 'row') as React.CSSProperties['flexDirection'],
        flexWrap:      'wrap',
        padding:       'clamp(3rem, 6vh, 5rem) 0',
        borderBottom:  `1px solid ${C.border}`,
      }}
    >
      <div style={{ flex: '1 1 360px', position: 'relative', borderRadius: '4px', overflow: 'hidden' }}>
        <img src={row.img} alt={row.title} loading="lazy" style={{ width: '100%', height: '400px', objectFit: 'cover', display: 'block' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,212,255,0.07) 0%, transparent 60%)' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, width: 56, height: 56, borderTop: `3px solid ${C.blue}`, borderLeft: `3px solid ${C.blue}` }} />
        <div style={{ position: 'absolute', bottom: 0, right: 0, width: 56, height: 56, borderBottom: `3px solid ${C.blue}`, borderRight: `3px solid ${C.blue}` }} />
      </div>

      <div style={{ flex: '1 1 320px' }}>
        <div style={{ color: C.blue, fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase' as const, marginBottom: '1rem' }}>{row.eyebrow}</div>
        <h3 style={{ fontSize: fl(1.6, 2.6), fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: '1.25rem' }}>{row.title}</h3>
        <p style={{ color: C.whiteOff, lineHeight: 1.7, fontSize: fl(0.9, 1.05), marginBottom: '2rem' }}>{row.body}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          {row.pills.map((p) => (
            <div key={p} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: C.blueDim, border: `1px solid rgba(0,212,255,0.25)`, padding: '7px 14px', borderRadius: '2px', fontSize: '0.78rem', fontWeight: 700 }}>
              <Check size={12} color={C.blue} /> {p}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function TechEditorial() {
  return (
    <section id="technologie" style={{ background: C.bg, padding: 'clamp(4rem, 8vh, 7rem) clamp(1.5rem, 5vw, 4rem)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {EDITORIAL.map((row, i) => <EditorialRow key={i} row={row} index={i} />)}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   STICKY SPEC
   ════════════════════════════════════════════════════════════════════════════ */
const SPEC_BULLETS = [
  { icon: <Battery size={20} />, title: 'Autonomie 230 km',   desc: 'Batterie 52V 25Ah — la plus longue autonomie du segment.' },
  { icon: <Gauge size={20} />,   title: '45 km/h en pointe',  desc: 'Moteur brushless 750W avec couple de démarrage instantané.' },
  { icon: <Zap size={20} />,     title: 'Charge rapide 1.8h', desc: 'Chargeur GaN 65W inclus. Compatible Fast Charge DC en option.' },
  { icon: <Shield size={20} />,  title: 'IP67 certifié',      desc: 'Résistant à la pluie battante. Traversez la ville en toute saison.' },
  { icon: <Leaf size={20} />,    title: 'Zéro émission',      desc: 'Bilan carbone neutre sur 3 ans vs voiture thermique équivalente.' },
  { icon: <Globe size={20} />,   title: 'App connectée',      desc: 'GPS temps réel, diagnostics live, verrouillage à distance via app Lumyx.' },
];

function SpecBullet({ bullet, index }: { bullet: typeof SPEC_BULLETS[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 30 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      style={{ display: 'flex', gap: '1.25rem', padding: '1.75rem 0', borderBottom: `1px solid ${C.border}`, alignItems: 'flex-start' }}
    >
      <div style={{ width: 44, height: 44, borderRadius: '2px', background: C.blueDim, border: `1px solid rgba(0,212,255,0.25)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: C.blue }}>
        {bullet.icon}
      </div>
      <div>
        <div style={{ fontWeight: 800, fontSize: '1.05rem', marginBottom: '0.4rem' }}>{bullet.title}</div>
        <div style={{ color: C.muted, fontSize: '0.88rem', lineHeight: 1.6 }}>{bullet.desc}</div>
      </div>
    </motion.div>
  );
}

function StickySpec() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);

  return (
    <section ref={containerRef} style={{ background: C.bgSoft, borderTop: `1px solid ${C.border}`, minHeight: '120vh', position: 'relative' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 clamp(1.5rem, 5vw, 4rem)', display: 'flex', gap: 'clamp(2rem, 5vw, 5rem)', alignItems: 'flex-start' }}>
        {/* Sticky vehicle photo */}
        <div style={{ flex: '0 0 45%', position: 'sticky', top: '15vh', overflow: 'hidden', borderRadius: '4px' }}>
          <motion.div style={{ y: imgY }}>
            <img src={IMG.detail} alt="Lumyx GT — détail technique" loading="lazy" style={{ width: '100%', height: '70vh', objectFit: 'cover', display: 'block', borderRadius: '4px' }} />
          </motion.div>
          <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', background: 'rgba(6,8,13,0.88)', backdropFilter: 'blur(12px)', border: `1px solid ${C.border}`, padding: '1rem 1.5rem', borderRadius: '2px' }}>
            <div style={{ color: C.blue, fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase' as const, marginBottom: '0.3rem' }}>Lumyx GT</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 900 }}>Fiche technique complète</div>
          </div>
        </div>

        {/* Scrolling bullets */}
        <div style={{ flex: '1', padding: 'clamp(4rem, 8vh, 7rem) 0' }}>
          <div style={{ marginBottom: '3rem' }}>
            <div style={{ color: C.blue, fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase' as const, marginBottom: '1rem' }}>Spécifications</div>
            <h2 style={{ fontSize: fl(1.8, 3), fontWeight: 900, textTransform: 'uppercase' as const, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              Rien n'a été laissé<br />au hasard
            </h2>
          </div>
          {SPEC_BULLETS.map((b, i) => <SpecBullet key={i} bullet={b} index={i} />)}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   GALLERY
   ════════════════════════════════════════════════════════════════════════════ */
function Gallery() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const grid: Array<{ img: string; span: number; h: number }> = [
    { img: IMG.lifestyle, span: 2, h: 440 },
    { img: IMG.city,      span: 1, h: 200 },
    { img: IMG.ride,      span: 1, h: 220 },
    { img: IMG.detail,    span: 1, h: 260 },
    { img: IMG.bike,      span: 2, h: 360 },
  ];

  return (
    <section id="galerie" style={{ background: C.bg, padding: 'clamp(4rem, 8vh, 7rem) clamp(1.5rem, 5vw, 4rem)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <div style={{ color: C.blue, fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase' as const, marginBottom: '1rem' }}>Galerie</div>
          <h2 style={{ fontSize: fl(1.8, 3.5), fontWeight: 900, textTransform: 'uppercase' as const, letterSpacing: '-0.02em' }}>
            Lumyx dans la <span style={{ color: C.blue }}>vraie vie</span>
          </h2>
        </motion.div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
          {grid.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              style={{ gridColumn: `span ${p.span}`, position: 'relative', overflow: 'hidden', borderRadius: '4px', cursor: 'pointer' }}
              onMouseEnter={(e) => {
                const img = e.currentTarget.querySelector('img') as HTMLImageElement | null;
                if (img) img.style.transform = 'scale(1.06)';
              }}
              onMouseLeave={(e) => {
                const img = e.currentTarget.querySelector('img') as HTMLImageElement | null;
                if (img) img.style.transform = 'scale(1)';
              }}
            >
              <img
                src={p.img}
                alt={`Lumyx — galerie urbaine ${i + 1}`}
                loading="lazy"
                style={{ width: '100%', height: `${p.h}px`, objectFit: 'cover', display: 'block', transition: 'transform 0.5s ease' }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   TESTIMONIALS
   ════════════════════════════════════════════════════════════════════════════ */
const TESTIMONIALS = [
  { quote: '"Je prends le Lumyx PRO tous les matins pour aller au bureau. 22 km aller-retour sans recharge depuis 6 mois. Je n\'ai plus touché ma voiture."', name: 'Camille D.', city: 'Lyon, 69', stars: 5 },
  { quote: '"Le design est dingue. Mes collègues pensaient que c\'était une moto italienne de luxe. Et l\'autonomie est réelle — pas juste sur papier."',  name: 'Thomas M.', city: 'Paris, 75', stars: 5 },
  { quote: '"J\'habite en banlieue de Bordeaux et le Lumyx ONE couvre mes 18 km de trajet chaque jour sans sourciller. La charge rapide le soir en 3h30, c\'est parfait pour mon rythme."', name: 'Sophie L.', city: 'Bordeaux, 33', stars: 5 },
  { quote: '"La qualité de fabrication est bluffante. Cadre aluminium, finitions impeccables. On sent que c\'est fait pour durer. Je recommande sans hésitation."', name: 'Antoine R.', city: 'Strasbourg, 67', stars: 5 },
  { quote: '"Passée du vélo classique au Lumyx GT et je ne reviendrai jamais en arrière. La montée du Vieux-Nantes, les 45 km/h en palier — la liberté absolue."', name: 'Lucie B.', city: 'Nantes, 44', stars: 5 },
  { quote: '"Le GPS intégré et l\'app sont vraiment bien foutus. Suivi temps réel, historique de trajets, verrouillage à distance. J\'ai même retrouvé mon scoot après une fausse alerte vol."', name: 'Maxime P.', city: 'Rennes, 35', stars: 5 },
];

function Testimonials() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section style={{ background: C.bgSoft, borderTop: `1px solid ${C.border}`, padding: 'clamp(4rem, 8vh, 7rem) clamp(1.5rem, 5vw, 4rem)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{ color: C.blue, fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase' as const, marginBottom: '1rem' }}>Témoignages</div>
          <h2 style={{ fontSize: fl(1.8, 3.5), fontWeight: 900, textTransform: 'uppercase' as const, letterSpacing: '-0.02em' }}>
            Ceux qui roulent <span style={{ color: C.blue }}>{fd?.businessName ?? "Lumyx"}</span>
          </h2>
        </motion.div>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.2 }}
              style={{ flex: '1 1 340px', background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: '4px', padding: '2.5rem', position: 'relative' }}
            >
              <div style={{ position: 'absolute', top: '1.5rem', right: '2rem', opacity: 0.05, fontSize: '8rem', fontWeight: 900, color: C.blue, lineHeight: 1 }}>"</div>
              <div style={{ display: 'flex', gap: '3px', marginBottom: '1.5rem' }}>
                {Array.from({ length: t.stars }).map((_, si) => <Star key={si} size={16} color={C.blue} fill={C.blue} />)}
              </div>
              <p style={{ fontSize: fl(0.95, 1.1), lineHeight: 1.7, color: C.whiteOff, marginBottom: '2rem' }}>{t.quote}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: `linear-gradient(135deg, ${C.blue}, ${C.blueDeep})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.1rem', color: C.bg }}>
                  {t.name[0]}
                </div>
                <div>
                  <div style={{ fontWeight: 800 }}>{t.name}</div>
                  <div style={{ color: C.muted, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={11} /> {t.city}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   RESERVE FORM
   ════════════════════════════════════════════════════════════════════════════ */
function ReserveForm() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1400);
    return () => clearTimeout(timer);
  }, [email]);

  return (
    <section
      ref={ref}
      id="reserve"
      style={{ background: `linear-gradient(135deg, #06080d 0%, #0a0e1a 50%, #060d12 100%)`, borderTop: `1px solid ${C.border}`, padding: 'clamp(5rem, 10vh, 9rem) clamp(1.5rem, 5vw, 4rem)', position: 'relative', overflow: 'hidden' }}
    >
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 65%)', pointerEvents: 'none' }} />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center', position: 'relative' }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.35)', borderRadius: '2px', padding: '6px 16px', marginBottom: '2rem' }}>
          <Clock size={13} color="#f59e0b" />
          <span style={{color: brand ?? '#f59e0b', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase' as const }}>Plus que 100 unités disponibles</span>
        </div>

        <h2 style={{ fontSize: fl(2, 4), fontWeight: 900, textTransform: 'uppercase' as const, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: '1.25rem' }}>
          Réservez votre<br /><span style={{ color: C.blue, textShadow: `0 0 30px ${C.blueGlow}` }}>Lumyx maintenant</span>
        </h2>
        <p style={{ color: C.whiteOff, fontSize: fl(0.95, 1.1), lineHeight: 1.65, marginBottom: '2.5rem' }}>
          Réservez avec 0 € d'engagement. Livraison en septembre 2026. Vous serez parmi les premiers à rouler Lumyx en France.
        </p>

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.form key="form" initial={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }} onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre adresse email"
                required
                aria-label="Adresse email"
                style={{ flex: '1 1 280px', background: 'rgba(240,244,248,0.06)', border: `1px solid ${C.borderHi}`, color: C.white, padding: '16px 20px', fontSize: '1rem', borderRadius: '2px', outline: 'none', transition: 'border-color 0.2s', fontFamily: 'inherit' }}
                onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = C.blue; }}
                onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = C.borderHi; }}
              />
              <button
                type="submit"
                disabled={loading}
                style={{ background: loading ? C.borderHi : C.blue, border: 'none', color: loading ? C.muted : C.bg, padding: '16px 32px', fontWeight: 800, fontSize: '0.85rem', letterSpacing: '0.12em', textTransform: 'uppercase' as const, cursor: loading ? 'not-allowed' : 'pointer', borderRadius: '2px', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s', boxShadow: loading ? 'none' : `0 0 25px rgba(0,212,255,0.3)`, minWidth: '160px', justifyContent: 'center', fontFamily: 'inherit' }}
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                    style={{ width: 18, height: 18, border: `2px solid ${C.muted}`, borderTopColor: C.blue, borderRadius: '50%' }}
                  />
                ) : (
                  <><Send size={16} /> Je réserve</>
                )}
              </button>
            </motion.form>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ background: C.blueDim, border: `1px solid rgba(0,212,255,0.4)`, borderRadius: '4px', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}
            >
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: C.blue, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Check size={28} color={C.bg} strokeWidth={3} />
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: 900 }}>Réservation confirmée</div>
              <div style={{ color: C.whiteOff, lineHeight: 1.6 }}>
                Nous vous enverrons un email à <strong>{email}</strong>. Bienvenue dans la révolution Lumyx.
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ marginTop: '1.75rem', display: 'flex', justifyContent: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: C.blueDim, border: `1px solid rgba(0,212,255,0.28)`, borderRadius: '2px', padding: '8px 18px' }}>
            <span style={{ fontSize: '0.88rem' }}>🚀</span>
            <span style={{ color: C.blue, fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em' }}>Livraison estimée : T3 2025 — 312 commandes en attente</span>
          </div>
        </div>

        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          {['Aucun engagement', 'Livraison sept. 2026', 'Garantie 3 ans'].map((item) => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: C.muted, fontSize: '0.8rem' }}>
              <Check size={13} color={C.blue} /> {item}
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   FOOTER
   ════════════════════════════════════════════════════════════════════════════ */
function Footer() {
  const cols = [
    { title: 'Produits',   links: ['Lumyx ONE', 'Lumyx PRO', 'Lumyx GT', 'Accessoires', 'App Lumyx'] },
    { title: 'Entreprise', links: ["Notre vision", 'Presse', 'Partenaires', 'Carrières', 'Contact'] },
    { title: 'Support',    links: ['FAQ', 'Manuel utilisateur', 'Garantie', 'Réparation', 'Stations de charge'] },
  ];

  const socialIcons = [Globe, Send, Play];

  return (
    <footer id="contact" style={{ background: C.bgSoft, borderTop: `1px solid ${C.border}`, padding: 'clamp(3rem, 6vh, 5rem) clamp(1.5rem, 5vw, 4rem) 2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap', marginBottom: '4rem' }}>
          {/* Brand block */}
          <div style={{ flex: '2 1 260px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
              <div style={{ width: 36, height: 36, background: C.blue, clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={16} color={C.bg} fill={C.bg} />
              </div>
              <span style={{ fontWeight: 900, fontSize: '1.4rem', letterSpacing: '0.15em', textTransform: 'uppercase' as const }}>
                LU<span style={{ color: C.blue }}>M</span>YX
              </span>
            </div>
            <p style={{ color: C.muted, fontSize: '0.9rem', lineHeight: 1.7, maxWidth: '280px', marginBottom: '1.5rem' }}>
              La mobilité électrique repensée pour la ville moderne. Fabriqué en Europe, livré partout en France.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {socialIcons.map((Icon, i) => (
                <button
                  key={i}
                  aria-label={`Réseau social ${i + 1}`}
                  style={{ width: 40, height: 40, background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s', color: C.muted }}
                  onMouseEnter={(e) => { const b = e.currentTarget; b.style.borderColor = C.blue; b.style.color = C.blue; }}
                  onMouseLeave={(e) => { const b = e.currentTarget; b.style.borderColor = C.border; b.style.color = C.muted; }}
                >
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>

          {cols.map((col) => {
            const getFooterLinkHref = (l: string) => {
              const norm = l.toLowerCase();
              if (norm.includes('lumyx') || norm.includes('accessoire')) return '#modeles';
              if (norm.includes('vision') || norm.includes('presse') || norm.includes('partenaire') || norm.includes('carrière') || norm.includes('mentions') || norm.includes('politique') || norm.includes('cgv')) return '#about';
              if (norm.includes('contact') || norm.includes('réparation')) return '#reserve';
              if (norm.includes('faq') || norm.includes('manuel') || norm.includes('garantie') || norm.includes('station')) return '#technologie';
              return '#reserve';
            };
            return (
              <div key={col.title} style={{ flex: '1 1 140px' }}>
                <div style={{ fontWeight: 800, fontSize: '0.78rem', letterSpacing: '0.15em', textTransform: 'uppercase' as const, marginBottom: '1.25rem' }}>{col.title}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {col.links.map((l) => (
                    <a key={l} href={getFooterLinkHref(l)} style={{ color: C.muted, textDecoration: 'none', fontSize: '0.88rem', transition: 'color 0.2s', cursor: 'pointer' }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = C.white; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = C.muted; }}
                    >{l}</a>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ color: C.muted, fontSize: '0.8rem' }}>© 2026 Lumyx SAS — Tous droits réservés</div>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            {['Mentions légales', 'Politique de confidentialité', 'CGV'].map((item) => (
              <a key={item} href="#about" style={{ color: C.muted, textDecoration: 'none', fontSize: '0.78rem', transition: 'color 0.2s', cursor: 'pointer' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = C.white; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = C.muted; }}
              >{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   ROOT
   ════════════════════════════════════════════════════════════════════════════ */

// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
export default function LumyxPage() {
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
  if (brand) {
    C = { ...C, blue: brand };
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
    <main style={pageStyle}>
      <Nav />
      <Hero />
      <StatsBand />
      <StickyCrossfade />
      <Models />
      <TechEditorial />
      <StickySpec />
      <Gallery />
      <Testimonials />
      <ReserveForm />
      <Footer />
    </main>
  );
}
