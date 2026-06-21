'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from 'framer-motion';
import { TemplateIcon } from '@/components/TemplateIcon';

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
  bg:           '#080a10',
  bgAlt:        '#0d1018',
  bgCard:       '#121620',
  bgCardHover:  '#161c28',
  accent:       '#3b82f6',
  accentDark:   '#1d4ed8',
  accentLight:  '#60a5fa',
  orange:       '#f59e0b',
  orangeDark:   '#d97706',
  text:         '#e8edf8',
  textMuted:    '#8896b0',
  border:       '#1e2638',
  borderLight:  '#2a3550',
  success:      '#10b981',
  fontDisplay:  "'Space Grotesk', sans-serif",
  fontBody:     "'Inter', sans-serif",
  radius:       '12px',
  radiusLg:     '20px',
  shadow:       '0 4px 24px rgba(0,0,0,0.4)',
  shadowAccent: '0 0 40px rgba(59,130,246,0.15)',
  transition:   'all 0.3s cubic-bezier(0.4,0,0.2,1)',
};

// ─── Font Loader ──────────────────────────────────────────────────────────────
function FontLoader() {
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href =
      'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap';
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);
  return null;
}

// ─── Global Styles + Responsive ──────────────────────────────────────────────
function GlobalStyles() {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html { scroll-behavior: smooth; }
      body { background: ${C.bg}; color: ${C.text}; font-family: ${C.fontBody}; overflow-x: hidden; }

      ::-webkit-scrollbar { width: 6px; }
      ::-webkit-scrollbar-track { background: ${C.bgAlt}; }
      ::-webkit-scrollbar-thumb { background: ${C.accent}; border-radius: 3px; }

      /* Keyframes */
      @keyframes pulse-ring {
        0%   { transform: scale(0.8); opacity: 1; }
        100% { transform: scale(2.4); opacity: 0; }
      }
      @keyframes marquee-scroll {
        0%   { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
      @keyframes float-particle {
        0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
        50%       { transform: translateY(-20px) translateX(10px); opacity: 0.8; }
      }
      @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      @keyframes status-pulse {
        0%, 100% { opacity: 1; }
        50%       { opacity: 0.4; }
      }

      /* Responsive layout helpers */
      .mf-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
      .mf-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
      .mf-grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
      .mf-flex-wrap { display: flex; flex-wrap: wrap; gap: 1.5rem; }

      /* Nav */
      .nav-desktop { display: flex !important; }
      .nav-burger  { display: none !important; }

      /* Tracker */
      .tracker-row { display: flex; gap: 1.5rem; overflow-x: auto; padding-bottom: 8px; }
      .tracker-row::-webkit-scrollbar { height: 4px; }
      .tracker-row::-webkit-scrollbar-thumb { background: ${C.accent}; border-radius: 2px; }

      /* Contact 2-col */
      .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: start; }

      /* Form 2-col */
      .form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }

      /* Footer columns */
      .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 3rem; }

      /* Section padding */
      .mf-section { padding: 100px 0; }

      /* ── 768px ─────────────────────────────────────────────────────────── */
      @media (max-width: 768px) {
        .nav-desktop { display: none !important; }
        .nav-burger  { display: flex !important; }

        .mf-grid-2 { grid-template-columns: 1fr; }
        .mf-grid-3 { grid-template-columns: 1fr 1fr; }
        .mf-grid-4 { grid-template-columns: 1fr 1fr; }

        .contact-grid { grid-template-columns: 1fr; gap: 2rem; }
        .form-grid-2  { grid-template-columns: 1fr; }
        .footer-grid  { grid-template-columns: 1fr 1fr; gap: 2rem; }

        .mf-section { padding: 64px 0; }

        .hero-cta-group { flex-direction: column; align-items: flex-start; }
        .hero-cta-group a { width: 100%; text-align: center; }

        .coverage-layout { flex-direction: column; }
        .coverage-map-wrap { display: none !important; }
        .coverage-map-fallback { display: block !important; }
      }

      /* ── 600px ─────────────────────────────────────────────────────────── */
      @media (max-width: 600px) {
        .mf-grid-3 { grid-template-columns: 1fr; }
        .mf-grid-4 { grid-template-columns: 1fr; }
      }

      /* ── 480px ─────────────────────────────────────────────────────────── */
      @media (max-width: 480px) {
        .mf-section { padding: 48px 0; }
        .footer-grid { grid-template-columns: 1fr; }
        .hero-stats-row { flex-direction: column; gap: 16px; }
        .hero-stats-divider { display: none !important; }
      }

      /* Coverage map fallback */
      .coverage-map-fallback { display: none; }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);
  return null;
}

// ─── Utility: Animated Counter ───────────────────────────────────────────────
function useCounter(target: number, duration = 2000, isActive = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!isActive) return;
    const start = performance.now();
    const frame = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }, [target, duration, isActive]);
  return count;
}

// ─── Container ────────────────────────────────────────────────────────────────
function Container({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', ...style }}>
      {children}
    </div>
  );
}

// ─── Section Wrapper ──────────────────────────────────────────────────────────
function Section({
  children, id, bg = C.bg, style = {},
}: {
  children: React.ReactNode; id?: string; bg?: string; style?: React.CSSProperties;
}) {
  return (
    <section
      id={id}
      className="mf-section"
      style={{ background: bg, position: 'relative', overflow: 'hidden', ...style }}
    >
      {children}
    </section>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({
  eyebrow, title, subtitle, center = true,
}: {
  eyebrow: string; title: string; subtitle?: string; center?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      style={{ textAlign: center ? 'center' : 'left', marginBottom: 56 }}
    >
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        background: `${C.accent}18`, border: `1px solid ${C.accent}40`,
        borderRadius: 100, padding: '6px 16px', marginBottom: 16,
      }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.accent }} />
        <span style={{ fontFamily: C.fontBody, fontSize: 12, fontWeight: 600, color: C.accentLight, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          {eyebrow}
        </span>
      </div>
      <h2 style={{ fontFamily: C.fontDisplay, fontSize: 'clamp(24px,4vw,46px)', fontWeight: 800, color: C.text, lineHeight: 1.15, marginBottom: 16 }}>
        {title}
      </h2>
      {subtitle && (
        <p style={{ fontFamily: C.fontBody, fontSize: 'clamp(14px,2vw,18px)', color: C.textMuted, maxWidth: 640, margin: center ? '0 auto' : '0', lineHeight: 1.7 }}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

// ─── 1. NAVIGATION ────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: 'Services',      href: '#services' },
  { label: 'Tarifs',        href: '#pricing' },
  { label: 'Couverture',    href: '#coverage' },
  { label: 'Témoignages',   href: '#testimonials' },
  { label: 'FAQ',           href: '#faq' },
];

function NavLink({ label, href }: { label: string; href: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: C.fontBody, fontSize: 14, fontWeight: 500,
        color: hovered ? C.text : C.textMuted, textDecoration: 'none',
        transition: C.transition, position: 'relative', paddingBottom: 2,
      }}
    >
      {label}
      <span style={{
        position: 'absolute', bottom: 0, left: 0,
        width: hovered ? '100%' : '0%', height: 1,
        background: C.accent, transition: 'width 0.3s ease',
      }} />
    </a>
  );
}

function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 998, backdropFilter: 'blur(4px)' }}
          />
          <motion.div
            key="drawer"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            style={{
              position: 'fixed', top: 0, right: 0, bottom: 0, width: 300,
              background: C.bgCard, borderLeft: `1px solid ${C.border}`,
              zIndex: 999, padding: 32, display: 'flex', flexDirection: 'column', gap: 28,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: C.fontDisplay, fontWeight: 700, fontSize: 18, color: C.text }}>Menu</span>
              <button onClick={onClose} style={{ background: 'none', border: 'none', color: C.textMuted, cursor: 'pointer', fontSize: 22 }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {NAV_LINKS.map((link) => (
                <a key={link.href} href={link.href} onClick={onClose}
                  style={{ fontFamily: C.fontBody, fontSize: 17, fontWeight: 500, color: C.text, textDecoration: 'none' }}>
                  {link.label}
                </a>
              ))}
            </div>
            <a href="#contact" onClick={onClose} style={{
              background: `linear-gradient(135deg, ${C.accent}, ${C.accentDark})`,
              color: '#fff', textDecoration: 'none', padding: '14px 24px',
              borderRadius: C.radius, textAlign: 'center', fontFamily: C.fontBody,
              fontWeight: 600, fontSize: 15, marginTop: 'auto',
            }}>
              Demander un devis
            </a>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Nav() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => scrollY.on('change', (v) => setScrolled(v > 60)), [scrollY]);

  return (
    <>
      <motion.nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        borderBottom: scrolled ? `1px solid ${C.border}` : '1px solid transparent',
        background: scrolled ? 'rgba(8,10,16,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        transition: 'all 0.4s ease',
      }}>
        <Container>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 70 }}>
            {/* Logo */}
            <a href="#hero" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8,
                background: `linear-gradient(135deg, ${C.accent}, ${C.accentDark})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}><TemplateIcon emoji="🚚" size={18} color="#fff" /></div>
              <span style={{ fontFamily: C.fontDisplay, fontWeight: 800, fontSize: 18, color: C.text }}>
                Meridian<span style={{ color: C.accent }}>Freight</span>
              </span>
            </a>

            {/* Desktop links */}
            <div className="nav-desktop" style={{ alignItems: 'center', gap: 32 }}>
              {NAV_LINKS.map((l) => <NavLink key={l.href} {...l} />)}
            </div>

            {/* CTA + burger */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <a href="#contact" style={{
                background: `linear-gradient(135deg, ${C.accent}, ${C.accentDark})`,
                color: '#fff', padding: '10px 22px', borderRadius: C.radius,
                fontFamily: C.fontBody, fontWeight: 600, fontSize: 14,
                textDecoration: 'none', boxShadow: `0 0 20px ${C.accent}40`, transition: C.transition,
              }}>
                Devis gratuit
              </a>
              <button
                className="nav-burger"
                onClick={() => setDrawerOpen(true)}
                style={{ background: 'none', border: 'none', color: C.text, cursor: 'pointer', fontSize: 22 }}
              >☰</button>
            </div>
          </div>
        </Container>
      </motion.nav>
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}

// ─── 2. HERO ──────────────────────────────────────────────────────────────────
function HeroParticle({ x, y, delay }: { x: number; y: number; delay: number }) {
  return (
    <div style={{
      position: 'absolute', left: `${x}%`, top: `${y}%`,
      width: 4, height: 4, borderRadius: '50%', background: C.accent,
      opacity: 0.4, animation: `float-particle ${3 + delay}s ease-in-out ${delay}s infinite`,
      pointerEvents: 'none',
    }} />
  );
}

function HeroRouteDot({ cx, cy, delay }: { cx: number; cy: number; delay: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={6} fill={C.accent} opacity={0.9} />
      <circle cx={cx} cy={cy} r={6} fill="none" stroke={C.accent} strokeWidth={2}
        style={{ animation: `pulse-ring 2s ${delay}s ease-out infinite`, transformOrigin: `${cx}px ${cy}px` }} />
    </g>
  );
}

const HERO_PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  x: Math.sin(i * 137.5) * 48 + 50,
  y: Math.cos(i * 137.5) * 43 + 50,
  delay: (i % 5) * 0.6,
}));

const HERO_ROUTE_DOTS = [
  { cx: 320, cy: 160 }, { cx: 480, cy: 240 }, { cx: 600, cy: 340 },
  { cx: 400, cy: 420 }, { cx: 250, cy: 360 }, { cx: 680, cy: 200 }, { cx: 550, cy: 460 },
];

function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 180]);

  return (
    <section style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      position: 'relative', overflow: 'hidden',
      background: `radial-gradient(ellipse at 60% 40%, ${C.accent}12 0%, transparent 60%), ${C.bg}`,
    }}>
      {HERO_PARTICLES.map((p, i) => <HeroParticle key={i} {...p} />)}

      {/* Background route map SVG */}
      <motion.div style={{ position: 'absolute', inset: 0, opacity: 0.12, y }} aria-hidden>
        <svg viewBox="0 0 900 600" style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
          <defs>
            <filter id="hero-glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <path d="M320,160 Q400,200 480,240" stroke={C.accent} strokeWidth={1.5} fill="none" strokeDasharray="6 4" filter="url(#hero-glow)" />
          <path d="M480,240 Q540,290 600,340" stroke={C.accent} strokeWidth={1.5} fill="none" strokeDasharray="6 4" filter="url(#hero-glow)" />
          <path d="M600,340 Q500,380 400,420" stroke={C.accentLight} strokeWidth={1.5} fill="none" strokeDasharray="6 4" />
          <path d="M400,420 Q325,390 250,360" stroke={C.accentLight} strokeWidth={1.5} fill="none" strokeDasharray="6 4" />
          <path d="M320,160 Q500,180 680,200" stroke={C.accent} strokeWidth={1} fill="none" strokeDasharray="4 6" opacity={0.7} />
          <path d="M680,200 Q615,330 550,460" stroke={C.accentLight} strokeWidth={1} fill="none" strokeDasharray="4 6" opacity={0.7} />

          {/* Animated truck dots */}
          <circle r={5} fill={C.orange}>
            <animateMotion dur="6s" repeatCount="indefinite">
              <mpath href="#hr1" />
            </animateMotion>
          </circle>
          <path id="hr1" d="M320,160 Q400,200 480,240 Q540,290 600,340" fill="none" />

          <circle r={5} fill={C.accent}>
            <animateMotion dur="8s" repeatCount="indefinite" begin="2s">
              <mpath href="#hr2" />
            </animateMotion>
          </circle>
          <path id="hr2" d="M600,340 Q500,380 400,420 Q325,390 250,360" fill="none" />

          <circle r={4} fill={C.accentLight}>
            <animateMotion dur="10s" repeatCount="indefinite" begin="4s">
              <mpath href="#hr3" />
            </animateMotion>
          </circle>
          <path id="hr3" d="M320,160 Q500,180 680,200 Q615,330 550,460" fill="none" />

          {HERO_ROUTE_DOTS.map((d, i) => <HeroRouteDot key={i} cx={d.cx} cy={d.cy} delay={i * 0.4} />)}
        </svg>
      </motion.div>

      <Container style={{ position: 'relative', zIndex: 2, paddingTop: 120, paddingBottom: 80 }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: `${C.accent}18`, border: `1px solid ${C.accent}40`,
              borderRadius: 100, padding: '8px 18px', marginBottom: 28,
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.success, boxShadow: `0 0 10px ${C.success}`, animation: 'status-pulse 2s infinite' }} />
            <span style={{ fontFamily: C.fontBody, fontSize: 13, fontWeight: 600, color: C.accentLight, letterSpacing: '0.05em' }}>
              Réseau actif · 340 véhicules en route
            </span>
          </motion.div>

          {/* H1 */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            style={{
              fontFamily: C.fontDisplay,
              fontSize: 'clamp(38px, 7vw, 88px)',
              fontWeight: 800, lineHeight: 1.05,
              color: C.text, maxWidth: 800,
              letterSpacing: '-0.02em', marginBottom: 24,
            }}
          >
            Livraison &{' '}
            <span style={{ background: `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Logistique
            </span>
            <br />
            Sur-Mesure
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.7 }}
            style={{ fontFamily: C.fontBody, fontSize: 'clamp(15px, 2vw, 20px)', color: C.textMuted, maxWidth: 560, lineHeight: 1.75, marginBottom: 40 }}
          >
            Transport routier express, messagerie B2B, logistique e-commerce et entreposage pour les entreprises françaises.
            18 ans d'expertise, 97.8 % de livraisons à temps.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="hero-cta-group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}
          >
            <a href="#contact" style={{
              background: `linear-gradient(135deg, ${C.accent}, ${C.accentDark})`,
              color: '#fff', padding: '16px 36px', borderRadius: C.radius,
              fontFamily: C.fontDisplay, fontWeight: 700, fontSize: 16,
              textDecoration: 'none', boxShadow: `0 0 40px ${C.accent}50`,
              display: 'inline-flex', alignItems: 'center', gap: 8,
            }}>
              Obtenir un devis gratuit →
            </a>
            <a href="#services" style={{
              background: 'transparent', color: C.text, padding: '16px 36px',
              borderRadius: C.radius, fontFamily: C.fontDisplay, fontWeight: 600, fontSize: 16,
              textDecoration: 'none', border: `1px solid ${C.border}`,
            }}>
              Découvrir nos services
            </a>
          </motion.div>

          {/* Trust stats */}
          <motion.div
            className="hero-stats-row"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            style={{ display: 'flex', alignItems: 'center', gap: 32, marginTop: 56, flexWrap: 'wrap' }}
          >
            {[
              { value: '12 000+', label: 'colis/jour' },
              { value: '97.8 %',  label: 'à temps' },
              { value: '18 ans',  label: "d'expertise" },
            ].map((stat, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {i > 0 && <div className="hero-stats-divider" style={{ width: 1, height: 40, background: C.border }} />}
                <div>
                  <div style={{ fontFamily: C.fontDisplay, fontWeight: 800, fontSize: 'clamp(18px,3vw,24px)', color: C.text }}>{stat.value}</div>
                  <div style={{ fontFamily: C.fontBody, fontSize: 12, color: C.textMuted }}>{stat.label}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </Container>

      {/* Bottom gradient fade */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 120, background: `linear-gradient(to bottom, transparent, ${C.bg})`, zIndex: 3 }} />
    </section>
  );
}

// ─── 3. LIVE TRACKER WIDGET ───────────────────────────────────────────────────
const SHIPMENTS = [
  {
    id: 'MF-2406-8821', from: 'Paris CDG', to: 'Lyon Part-Dieu',
    status: 'En transit', progress: 68, eta: "Aujourd'hui 17h30",
    steps: ['Enlèvement', 'Tri CDG', 'En route', 'Livraison'], currentStep: 2,
  },
  {
    id: 'MF-2406-4437', from: 'Bordeaux', to: 'Lille Métropole',
    status: 'En cours de tri', progress: 34, eta: 'Demain 10h00',
    steps: ['Enlèvement', 'Tri Bordeaux', 'En route', 'Livraison'], currentStep: 1,
  },
  {
    id: 'MF-2406-9904', from: 'Strasbourg', to: 'Marseille',
    status: 'Livré', progress: 100, eta: 'Livré 09h14',
    steps: ['Enlèvement', 'Tri Strasbourg', 'En route', 'Livraison'], currentStep: 3,
  },
];

function ShipmentStep({ label, active, done }: { label: string; active: boolean; done: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
      <div style={{
        width: 26, height: 26, borderRadius: '50%',
        background: done ? C.success : active ? C.accent : C.border,
        border: active ? `2px solid ${C.accentLight}` : '2px solid transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 11, transition: 'all 0.5s ease',
        boxShadow: active ? `0 0 12px ${C.accent}80` : done ? `0 0 8px ${C.success}60` : 'none',
        color: '#fff', fontWeight: 700,
      }}>
        {done ? '✓' : active ? '●' : ''}
      </div>
      <span style={{ fontFamily: C.fontBody, fontSize: 9, color: done || active ? C.text : C.textMuted, fontWeight: done ? 600 : 400, textAlign: 'center', maxWidth: 52 }}>
        {label}
      </span>
    </div>
  );
}

function ShipmentCard({ shipment }: { shipment: typeof SHIPMENTS[0] }) {
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => { if (inView) setTimeout(() => setAnimated(true), 300); }, [inView]);

  const isDelivered = shipment.progress === 100;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      style={{
        background: C.bgCard, border: `1px solid ${C.border}`,
        borderRadius: C.radiusLg, padding: 24,
        minWidth: 280, flex: '1 1 280px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <div style={{ fontFamily: C.fontBody, fontSize: 10, color: C.textMuted, marginBottom: 4, letterSpacing: '0.08em' }}>NUMÉRO DE SUIVI</div>
          <div style={{ fontFamily: C.fontDisplay, fontSize: 14, fontWeight: 700, color: C.accent }}>{shipment.id}</div>
        </div>
        <div style={{
          background: isDelivered ? `${C.success}20` : `${C.orange}20`,
          border: `1px solid ${isDelivered ? C.success : C.orange}40`,
          borderRadius: 100, padding: '4px 12px',
          fontFamily: C.fontBody, fontSize: 11, fontWeight: 600,
          color: isDelivered ? C.success : C.orange,
        }}>
          {shipment.status}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <span style={{ fontFamily: C.fontBody, fontSize: 13, fontWeight: 600, color: C.text }}>{shipment.from}</span>
        <div style={{ flex: 1, height: 1, background: C.border, position: 'relative' }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: 14, color: C.textMuted }}>→</div>
        </div>
        <span style={{ fontFamily: C.fontBody, fontSize: 13, fontWeight: 600, color: C.text }}>{shipment.to}</span>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontFamily: C.fontBody, fontSize: 11, color: C.textMuted }}>Progression</span>
          <span style={{ fontFamily: C.fontDisplay, fontSize: 12, fontWeight: 700, color: isDelivered ? C.success : C.accent }}>{shipment.progress}%</span>
        </div>
        <div style={{ height: 6, background: C.border, borderRadius: 100, overflow: 'hidden' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={animated ? { width: `${shipment.progress}%` } : { width: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
            style={{
              height: '100%',
              background: isDelivered ? C.success : `linear-gradient(90deg, ${C.accent}, ${C.accentLight})`,
              borderRadius: 100,
              boxShadow: isDelivered ? `0 0 8px ${C.success}` : `0 0 8px ${C.accent}`,
            }}
          />
        </div>
      </div>

      {/* Steps */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 2, marginBottom: 14 }}>
        {shipment.steps.map((step, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            <ShipmentStep label={step} active={i === shipment.currentStep} done={i < shipment.currentStep || isDelivered} />
            {i < shipment.steps.length - 1 && (
              <div style={{ flex: 1, height: 1, background: i < shipment.currentStep ? C.success : C.border, marginBottom: 20 }} />
            )}
          </div>
        ))}
      </div>

      {/* ETA */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
        <TemplateIcon emoji="🕐" size={14} />
        <span style={{ fontFamily: C.fontBody, fontSize: 12, color: C.textMuted }}>
          ETA : <strong style={{ color: C.text }}>{shipment.eta}</strong>
        </span>
      </div>
    </motion.div>
  );
}

function TrackerSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <Section id="tracker" bg={C.bgAlt}>
      <Container>
        <SectionHeader
          eyebrow="Suivi en temps réel"
          title="Votre cargaison, toujours visible"
          subtitle="Suivez vos expéditions en temps réel depuis notre plateforme. Notifications automatiques à chaque étape."
        />
        {/* Horizontally scrollable on mobile */}
        <div ref={ref} className="tracker-row">
          {SHIPMENTS.map((s) => <ShipmentCard key={s.id} shipment={s} />)}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.5 }}
          style={{ textAlign: 'center', marginTop: 36 }}
        >
          <a href="#contact" style={{ fontFamily: C.fontBody, fontSize: 14, color: C.accentLight, textDecoration: 'none', borderBottom: `1px solid ${C.accentLight}40`, paddingBottom: 2 }}>
            Accéder à la plateforme de suivi complète →
          </a>
        </motion.div>
      </Container>
    </Section>
  );
}

// ─── 4. SERVICES ──────────────────────────────────────────────────────────────
const SERVICES = [
  {
    icon: '⚡', title: 'Transport Express', color: C.accent,
    desc: 'Livraison J+1 garantie sur toute la France métropolitaine. Enlèvement avant 18h, livraison le lendemain matin.',
    features: ['Délai J+1 garanti', 'Suivi GPS temps réel', 'Preuve de livraison digitale'],
  },
  {
    icon: '📦', title: 'Messagerie B2B', color: C.accentLight,
    desc: "Envois réguliers entre entreprises avec tarification dégressive selon volume. Idéal pour les flux récurrents.",
    features: ['Tarifs dégressifs', 'Enlèvements programmés', 'Facture mensuelle unique'],
  },
  {
    icon: '🛒', title: 'Logistique E-commerce', color: C.orange,
    desc: "Solution clé-en-main pour e-commerçants : préparation de commandes, expédition et gestion des retours.",
    features: ['Intégration Shopify/WooCommerce', 'Picking & packing', 'Gestion des retours'],
  },
  {
    icon: '🏭', title: 'Entreposage', color: C.success,
    desc: "250 000 m² d'entrepôts logistiques sur 7 plateformes régionales. Stockage flexible et gestion de stock en temps réel.",
    features: ['250 000 m² capacité', 'WMS intégré', 'FIFO/LIFO sur demande'],
  },
  {
    icon: '🌍', title: 'Transport International', color: '#a78bfa',
    desc: "Imports/exports vers 42 pays européens et mondiaux. Gestion douanière, documents de transport et traçabilité.",
    features: ['42 pays desservis', 'Dédouanement inclus', 'Incoterms sur mesure'],
  },
  {
    icon: '🏠', title: 'Livraison Dernier Km', color: '#fb7185',
    desc: 'Service de livraison au particulier avec RDV, livraison en deux hommes pour articles volumineux et installation.',
    features: ['Livraison sur RDV', 'Installation incluse', 'Reprise anciens appareils'],
  },
];

function ServiceCard({ service, index }: { service: typeof SERVICES[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? C.bgCardHover : C.bgCard,
        border: `1px solid ${hovered ? service.color + '60' : C.border}`,
        borderRadius: C.radiusLg, padding: 32, cursor: 'default',
        transition: C.transition, position: 'relative', overflow: 'hidden',
        boxShadow: hovered ? `0 8px 40px ${service.color}20` : C.shadow,
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${service.color}, transparent)`, opacity: hovered ? 1 : 0, transition: C.transition }} />
      <div style={{
        width: 52, height: 52, borderRadius: 14, background: `${service.color}18`,
        border: `1px solid ${service.color}30`, display: 'flex', alignItems: 'center',
        justifyContent: 'center', marginBottom: 20, transition: C.transition,
        boxShadow: hovered ? `0 0 20px ${service.color}40` : 'none',
      }}>
        <TemplateIcon emoji={service.icon} size={24} color={service.color} />
      </div>
      <h3 style={{ fontFamily: C.fontDisplay, fontSize: 19, fontWeight: 700, color: C.text, marginBottom: 10 }}>{service.title}</h3>
      <p style={{ fontFamily: C.fontBody, fontSize: 14, color: C.textMuted, lineHeight: 1.7, marginBottom: 20 }}>{service.desc}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {service.features.map((f, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: service.color, flexShrink: 0 }} />
            <span style={{ fontFamily: C.fontBody, fontSize: 13, color: C.textMuted }}>{f}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function ServicesSection() {
  return (
    <Section id="services">
      <Container>
        <SectionHeader
          eyebrow="Nos prestations"
          title="Une solution pour chaque besoin logistique"
          subtitle="De la messagerie express à la logistique e-commerce intégrée, Meridian Freight couvre l'ensemble de votre chaîne d'approvisionnement."
        />
        {/* 3-col desktop → 2-col tablet → 1-col mobile */}
        <div className="mf-grid-3">
          {SERVICES.map((s, i) => <ServiceCard key={i} service={s} index={i} />)}
        </div>
      </Container>
    </Section>
  );
}

// ─── 5. STATS ─────────────────────────────────────────────────────────────────
const STATS_DATA = [
  { value: 12000, suffix: '+',    label: 'colis livrés par jour',    icon: '📦', desc: "Volume quotidien sur l'ensemble du réseau" },
  { value: 97.8,  suffix: ' %',   label: 'livraisons à temps',       icon: '⏱️', desc: 'Taux de ponctualité sur 12 mois glissants', isFloat: true },
  { value: 18,    suffix: ' ans', label: "d'expertise logistique",   icon: '🏆', desc: "Fondée en 2006, présente sur tout le territoire" },
  { value: 340,   suffix: '',     label: 'véhicules en flotte',      icon: '🚛', desc: 'Flotte propre + réseau partenaires certifiés' },
];

function StatCard({ stat, index }: { stat: typeof STATS_DATA[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const intVal = useCounter(Math.floor(stat.value), 2200, inView);
  const display = stat.isFloat ? (inView ? stat.value.toFixed(1) : '0.0') : intVal.toLocaleString('fr-FR');

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12 }}
      style={{
        background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: C.radiusLg,
        padding: 36, textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', top: -20, right: -20, opacity: 0.04 }}><TemplateIcon emoji={stat.icon} size={80} /></div>
      <div style={{ marginBottom: 8 }}><TemplateIcon emoji={stat.icon} size={36} /></div>
      <div style={{ fontFamily: C.fontDisplay, fontSize: 'clamp(32px,5vw,48px)', fontWeight: 800, color: C.text, lineHeight: 1 }}>
        {display}<span style={{ color: C.accent, fontSize: 'clamp(22px,3.5vw,32px)' }}>{stat.suffix}</span>
      </div>
      <div style={{ fontFamily: C.fontBody, fontSize: 15, fontWeight: 600, color: C.text, marginTop: 8, marginBottom: 6 }}>{stat.label}</div>
      <div style={{ fontFamily: C.fontBody, fontSize: 12, color: C.textMuted, lineHeight: 1.5 }}>{stat.desc}</div>
    </motion.div>
  );
}

function StatsSection() {
  return (
    <Section id="stats" bg={C.bgAlt}>
      <Container>
        <SectionHeader
          eyebrow="Nos chiffres clés"
          title="La performance au cœur de notre ADN"
          subtitle="Des indicateurs concrets qui reflètent notre engagement envers l'excellence opérationnelle."
        />
        {/* 4-col → 2-col → 1-col */}
        <div className="mf-grid-4">
          {STATS_DATA.map((s, i) => <StatCard key={i} stat={s} index={i} />)}
        </div>
      </Container>
    </Section>
  );
}

// ─── 6. PRICING ───────────────────────────────────────────────────────────────
const PRICING_PLANS = [
  {
    name: 'Starter', price: '349', period: '/mois', highlighted: false, badge: null,
    volume: "Jusqu'à 500 colis/mois",
    desc: 'Idéal pour les PME et e-commerçants débutants.',
    features: ['Transport express J+2', 'Suivi en ligne basique', 'Enlèvements 2×/semaine', 'Facture mensuelle', 'Support email', '—', '—'],
    cta: 'Commencer',
  },
  {
    name: 'Business', price: '899', period: '/mois', highlighted: true, badge: 'Populaire',
    volume: 'De 500 à 3 000 colis/mois',
    desc: "La solution complète pour les entreprises en croissance.",
    features: ['Transport express J+1', 'Suivi GPS temps réel', 'Enlèvements quotidiens', 'Facture mensuelle + analytics', 'Support téléphonique dédié', 'Retours gérés inclus', 'Intégration API/EDI'],
    cta: 'Choisir Business',
  },
  {
    name: 'Enterprise', price: 'Sur devis', period: '', highlighted: false, badge: null,
    volume: 'Volume illimité',
    desc: "Solution sur-mesure pour les grands comptes et ETI.",
    features: ['Transport prioritaire J+1 matin', 'Tableau de bord custom', 'Enlèvements 2×/jour', 'Reporting avancé + BI', 'Account manager dédié', 'SLA contractuel garanti', 'Intégration ERP complète'],
    cta: 'Contacter les ventes',
  },
];

function PricingCard({ plan, index }: { plan: typeof PRICING_PLANS[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: plan.highlighted ? `linear-gradient(160deg, ${C.accent}18, ${C.bgCard})` : C.bgCard,
        border: `2px solid ${plan.highlighted ? C.accent : hovered ? C.borderLight : C.border}`,
        borderRadius: C.radiusLg, padding: 40, position: 'relative',
        transition: C.transition,
        boxShadow: plan.highlighted ? C.shadowAccent : hovered ? '0 8px 40px rgba(0,0,0,0.3)' : C.shadow,
        transform: plan.highlighted ? 'scale(1.03)' : 'scale(1)',
      }}
    >
      {plan.badge && (
        <div style={{
          position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
          background: `linear-gradient(135deg, ${C.accent}, ${C.accentDark})`,
          color: '#fff', padding: '4px 16px', borderRadius: 100,
          fontFamily: C.fontBody, fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap',
        }}>{plan.badge}</div>
      )}

      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontFamily: C.fontDisplay, fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 8 }}>{plan.name}</h3>
        <p style={{ fontFamily: C.fontBody, fontSize: 13, color: C.textMuted, lineHeight: 1.6 }}>{plan.desc}</p>
      </div>

      <div style={{ marginBottom: 8 }}>
        <span style={{ fontFamily: C.fontDisplay, fontSize: plan.price === 'Sur devis' ? 26 : 44, fontWeight: 800, color: C.text }}>
          {plan.price === 'Sur devis' ? plan.price : `${plan.price} €`}
        </span>
        {plan.period && <span style={{ fontFamily: C.fontBody, fontSize: 14, color: C.textMuted }}>{plan.period}</span>}
      </div>

      <div style={{
        display: 'inline-block', background: `${C.accent}15`, border: `1px solid ${C.accent}30`,
        borderRadius: 8, padding: '6px 12px', fontFamily: C.fontBody, fontSize: 12,
        color: C.accentLight, marginBottom: 28,
      }}>
        {plan.volume}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 36 }}>
        {plan.features.map((f, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 13, color: f === '—' ? C.border : C.success, fontWeight: 700 }}>{f === '—' ? '—' : '✓'}</span>
            <span style={{ fontFamily: C.fontBody, fontSize: 13, color: f === '—' ? `${C.textMuted}60` : C.textMuted }}>{f === '—' ? 'Non inclus' : f}</span>
          </div>
        ))}
      </div>

      <a href="#contact" style={{
        display: 'block', textAlign: 'center', padding: '14px 24px', borderRadius: C.radius,
        fontFamily: C.fontDisplay, fontWeight: 700, fontSize: 15, textDecoration: 'none',
        background: plan.highlighted ? `linear-gradient(135deg, ${C.accent}, ${C.accentDark})` : 'transparent',
        color: plan.highlighted ? '#fff' : C.text,
        border: plan.highlighted ? 'none' : `1px solid ${C.border}`,
        boxShadow: plan.highlighted ? `0 0 24px ${C.accent}40` : 'none',
        transition: C.transition,
      }}>
        {plan.cta}
      </a>
    </motion.div>
  );
}

function PricingSection() {
  return (
    <Section id="pricing" bg={C.bg}>
      <Container>
        <SectionHeader
          eyebrow="Tarification"
          title="Des offres adaptées à votre volume"
          subtitle="Tarifs transparents, sans frais cachés. Tous nos forfaits incluent l'assurance de base et le suivi en temps réel."
        />
        {/* 3-col → 1-col on mobile */}
        <div className="mf-grid-3" style={{ alignItems: 'stretch' }}>
          {PRICING_PLANS.map((p, i) => <PricingCard key={i} plan={p} index={i} />)}
        </div>
        <p style={{ textAlign: 'center', marginTop: 28, fontFamily: C.fontBody, fontSize: 13, color: C.textMuted }}>
          * Prix HT. Engagement mensuel sans reconduction tacite.{' '}
          <a href="#contact" style={{ color: C.accentLight, textDecoration: 'none' }}>Demander un devis personnalisé →</a>
        </p>
      </Container>
    </Section>
  );
}

// ─── 7. COVERAGE MAP ──────────────────────────────────────────────────────────
const AGENCIES = [
  { name: 'Paris',      cx: 370, cy: 210, main: true },
  { name: 'Lyon',       cx: 420, cy: 345, main: true },
  { name: 'Marseille',  cx: 415, cy: 455, main: true },
  { name: 'Bordeaux',   cx: 235, cy: 390, main: false },
  { name: 'Lille',      cx: 355, cy: 130, main: false },
  { name: 'Strasbourg', cx: 525, cy: 195, main: false },
  { name: 'Nantes',     cx: 210, cy: 290, main: false },
];

const MAP_ROUTES = [
  { x1: 370, y1: 210, x2: 355, y2: 130 },
  { x1: 370, y1: 210, x2: 525, y2: 195 },
  { x1: 370, y1: 210, x2: 210, y2: 290 },
  { x1: 370, y1: 210, x2: 420, y2: 345 },
  { x1: 420, y1: 345, x2: 235, y2: 390 },
  { x1: 420, y1: 345, x2: 415, y2: 455 },
];

function AgencyDot({ agency, index }: { agency: typeof AGENCIES[0]; index: number }) {
  return (
    <g>
      <circle cx={agency.cx} cy={agency.cy} r={agency.main ? 14 : 10} fill="none"
        stroke={agency.main ? C.accent : C.accentLight} strokeWidth={1.5} opacity={0.5}
        style={{ animation: `pulse-ring ${2.5 + index * 0.3}s ${index * 0.4}s ease-out infinite`, transformOrigin: `${agency.cx}px ${agency.cy}px` }} />
      <circle cx={agency.cx} cy={agency.cy} r={agency.main ? 7 : 5} fill={agency.main ? C.accent : C.accentLight} />
      <text x={agency.cx} y={agency.cy - (agency.main ? 16 : 12)} textAnchor="middle"
        fill={C.text} fontSize={agency.main ? 11 : 9} fontFamily="Inter, sans-serif" fontWeight={agency.main ? 700 : 500}>
        {agency.name}
      </text>
    </g>
  );
}

function MapRouteLine({ route, index }: { route: typeof MAP_ROUTES[0]; index: number }) {
  return (
    <line x1={route.x1} y1={route.y1} x2={route.x2} y2={route.y2}
      stroke={C.accent} strokeWidth={1} strokeDasharray="6 4" opacity={0.4} />
  );
}

function CoverageSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <Section id="coverage" bg={C.bgAlt}>
      <Container>
        <SectionHeader
          eyebrow="Réseau d'agences"
          title="Présents partout en France"
          subtitle="7 plateformes régionales stratégiquement positionnées pour garantir les délais les plus courts sur tout le territoire."
        />
        <div ref={ref} className="coverage-layout" style={{ display: 'flex', gap: 48, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* SVG Map — hidden on very small screens */}
          <motion.div
            className="coverage-map-wrap"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8 }}
            style={{ flex: '1 1 360px' }}
          >
            <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: C.radiusLg, padding: 24, boxShadow: C.shadowAccent }}>
              <svg viewBox="120 80 480 450" style={{ width: '100%', maxWidth: 520 }}>
                {/* France outline */}
                <path d="M 200 100 L 260 90 L 320 95 L 380 85 L 440 100 L 490 110 L 530 140 L 540 170 L 545 200 L 535 230 L 530 260 L 520 300 L 510 330 L 500 360 L 490 390 L 475 420 L 455 450 L 430 475 L 400 490 L 370 495 L 340 490 L 310 475 L 280 460 L 255 440 L 230 415 L 210 385 L 190 355 L 175 320 L 165 285 L 158 250 L 155 215 L 160 185 L 170 155 L 185 130 L 200 100 Z"
                  fill={`${C.accent}08`} stroke={`${C.accent}30`} strokeWidth={1.5} />
                {MAP_ROUTES.map((r, i) => <MapRouteLine key={i} route={r} index={i} />)}
                {AGENCIES.map((a, i) => <AgencyDot key={i} agency={a} index={i} />)}
                {/* Animated trucks */}
                <circle r={4} fill={C.orange} opacity={0.9}>
                  <animateMotion dur="5s" repeatCount="indefinite">
                    <mpath href="#mr1" />
                  </animateMotion>
                </circle>
                <path id="mr1" d="M370,210 L420,345 L415,455" fill="none" />
                <circle r={4} fill={C.accentLight} opacity={0.9}>
                  <animateMotion dur="7s" repeatCount="indefinite" begin="2s">
                    <mpath href="#mr2" />
                  </animateMotion>
                </circle>
                <path id="mr2" d="M370,210 L210,290 L235,390" fill="none" />
              </svg>
            </div>
          </motion.div>

          {/* Mobile fallback — shown only on small screens */}
          <div className="coverage-map-fallback" style={{ width: '100%', background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: C.radius, padding: 20, marginBottom: 16 }}>
            <p style={{ fontFamily: C.fontBody, fontSize: 14, color: C.textMuted, textAlign: 'center' }}>
              Carte des agences — 7 hubs couvrant toute la France
            </p>
          </div>

          {/* Agency list */}
          <div style={{ flex: '1 1 280px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {AGENCIES.map((agency, i) => (
                <motion.div
                  key={agency.name}
                  initial={{ opacity: 0, x: 30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 16,
                    background: C.bgCard, border: `1px solid ${C.border}`,
                    borderRadius: C.radius, padding: '14px 18px',
                  }}
                >
                  <div style={{
                    width: 11, height: 11, borderRadius: '50%',
                    background: agency.main ? C.accent : C.accentLight,
                    boxShadow: `0 0 10px ${agency.main ? C.accent : C.accentLight}`,
                    flexShrink: 0,
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: C.fontDisplay, fontSize: 14, fontWeight: 700, color: C.text }}>{agency.name}</div>
                    <div style={{ fontFamily: C.fontBody, fontSize: 11, color: C.textMuted }}>
                      {agency.main ? 'Hub principal · Départs 24h/24' : 'Agence régionale · Départs 2×/jour'}
                    </div>
                  </div>
                  {agency.main && (
                    <div style={{
                      background: `${C.accent}18`, border: `1px solid ${C.accent}30`,
                      borderRadius: 6, padding: '2px 8px', fontFamily: C.fontBody,
                      fontSize: 10, fontWeight: 700, color: C.accentLight,
                    }}>HUB</div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

// ─── 8. TESTIMONIALS ──────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    name: 'Élodie Marchand', role: 'Directrice Logistique', company: 'Boutique Nature & Bio', sector: 'E-commerce', rating: 5, initials: 'EM', color: '#10b981',
    text: "Meridian Freight a transformé notre logistique. Grâce à leur intégration Shopify, 98 % de nos commandes partent le jour même. Le taux de retours clients dû aux livraisons a chuté de 40 %.",
  },
  {
    name: 'Frédéric Castellan', role: 'Directeur des Opérations', company: 'Imprimerie Rhône Alpex', sector: 'Industrie', rating: 5, initials: 'FC', color: '#3b82f6',
    text: "Nous expédions des bobines de papier lourdes vers toute la France. Avec Meridian, plus jamais de colis perdus et les délais sont tenus à 99 %. Un vrai partenaire industriel.",
  },
  {
    name: 'Amélie Duponteil', role: 'Responsable Supply Chain', company: 'Pharmagen Distribution', sector: 'Pharmaceutique', rating: 5, initials: 'AD', color: '#a78bfa',
    text: "Le transport sous température contrôlée et la traçabilité médicale sont irréprochables. L'équipe dédiée répond en moins d'une heure. Exactement ce dont nous avions besoin.",
  },
  {
    name: 'Thomas Guerrier', role: 'CEO', company: 'TechRetail France', sector: 'Retail', rating: 5, initials: 'TG', color: '#f59e0b',
    text: "Nous avons switché depuis un grand groupe il y a 8 mois. Dès le premier mois, -22 % sur notre budget transport et un taux de satisfaction client en hausse. Je recommande sans hésiter.",
  },
  {
    name: 'Sandrine Lefèvre', role: 'Acheteuse Principale', company: 'Groupe Déco Prestige', sector: 'Décoration', rating: 5, initials: 'SL', color: '#fb7185',
    text: "La livraison deux hommes pour nos meubles haut de gamme est parfaite. Nos clients adorent le créneau à l'heure et la courtoisie des livreurs. Zéro réclamation depuis 6 mois.",
  },
  {
    name: 'Julien Moreau', role: 'Directeur Achats', company: 'Agro-Industries du Sud', sector: 'Agroalimentaire', rating: 4, initials: 'JM', color: '#34d399',
    text: "Les flux inter-usines sont désormais pilotés en EDI. Les camions arrivent à l'heure, le planning est respecté. Le portail de suivi nous économise 2h de travail par jour.",
  },
];

function TestimonialCard({ t, index }: { t: typeof TESTIMONIALS[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-30px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
      style={{
        background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: C.radiusLg,
        padding: 32, display: 'flex', flexDirection: 'column', gap: 18,
      }}
    >
      <div style={{ display: 'flex', gap: 4 }}>
        {Array.from({ length: t.rating }).map((_, i) => <span key={i} style={{ color: C.orange, fontSize: 13 }}>★</span>)}
        {Array.from({ length: 5 - t.rating }).map((_, i) => <span key={i} style={{ color: C.border, fontSize: 13 }}>★</span>)}
      </div>
      <blockquote style={{ fontFamily: C.fontBody, fontSize: 14, color: C.textMuted, lineHeight: 1.8, fontStyle: 'italic', flex: 1 }}>
        "{t.text}"
      </blockquote>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 14, borderTop: `1px solid ${C.border}` }}>
        <div style={{
          width: 40, height: 40, borderRadius: '50%', background: `${t.color}20`,
          border: `2px solid ${t.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: C.fontDisplay, fontWeight: 700, fontSize: 13, color: t.color, flexShrink: 0,
        }}>{t.initials}</div>
        <div>
          <div style={{ fontFamily: C.fontDisplay, fontSize: 13, fontWeight: 700, color: C.text }}>{t.name}</div>
          <div style={{ fontFamily: C.fontBody, fontSize: 11, color: C.textMuted }}>{t.role} · {t.company}</div>
        </div>
        <div style={{
          marginLeft: 'auto', background: `${t.color}15`, border: `1px solid ${t.color}30`,
          borderRadius: 6, padding: '2px 8px', fontFamily: C.fontBody, fontSize: 10, fontWeight: 600,
          color: t.color, whiteSpace: 'nowrap',
        }}>{t.sector}</div>
      </div>
    </motion.div>
  );
}

function TestimonialsSection() {
  return (
    <Section id="testimonials" bg={C.bg}>
      <Container>
        <SectionHeader
          eyebrow="Témoignages clients"
          title="Ils nous font confiance"
          subtitle="Plus de 4 200 entreprises françaises ont choisi Meridian Freight pour leur logistique."
        />
        {/* 3-col → 2-col → 1-col */}
        <div className="mf-grid-3">
          {TESTIMONIALS.map((t, i) => <TestimonialCard key={i} t={t} index={i} />)}
        </div>
      </Container>
    </Section>
  );
}

// ─── 9. PARTNERS MARQUEE ──────────────────────────────────────────────────────
const PARTNERS = [
  'Geodis Partner', 'DHL Connect', 'La Poste Pro', 'DB Schenker FR',
  'Chronopost B2B', 'GLS France', 'TNT Express', 'UPS Fret',
  'Renault Trucks', 'Volvo FH16', 'Mercedes Actros', 'MAN TGX',
  'Michelin Fleet', 'TotalEnergies Pro', 'Transics GPS', 'Samsara IoT',
];

function PartnerBadge({ name }: { name: string }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      background: C.bgCard, border: `1px solid ${C.border}`,
      borderRadius: 10, padding: '10px 20px', whiteSpace: 'nowrap',
      margin: '0 8px', flexShrink: 0,
    }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.accent }} />
      <span style={{ fontFamily: C.fontBody, fontSize: 13, fontWeight: 600, color: C.textMuted }}>{name}</span>
    </div>
  );
}

function PartnersSection() {
  const doubled = [...PARTNERS, ...PARTNERS];

  return (
    <Section id="partners" bg={C.bgAlt} style={{ padding: '72px 0', overflow: 'hidden' }}>
      <SectionHeader
        eyebrow="Partenaires & Flotte"
        title="Un réseau de partenaires certifiés"
        subtitle="Nous travaillons avec les meilleurs acteurs du transport et de la technologie logistique."
      />
      {/* Row 1 */}
      <div style={{ overflow: 'hidden', marginBottom: 16, position: 'relative' }}>
        <div style={{ display: 'flex', animation: 'marquee-scroll 32s linear infinite', width: 'max-content' }}>
          {doubled.map((p, i) => <PartnerBadge key={`r1-${i}`} name={p} />)}
        </div>
      </div>
      {/* Row 2 */}
      <div style={{ overflow: 'hidden', position: 'relative' }}>
        <div style={{ display: 'flex', animation: 'marquee-scroll 40s linear infinite reverse', width: 'max-content' }}>
          {[...doubled].reverse().map((p, i) => <PartnerBadge key={`r2-${i}`} name={p} />)}
        </div>
      </div>
      {/* Fade edges */}
      <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 100, background: `linear-gradient(to right, ${C.bgAlt}, transparent)`, zIndex: 2, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 100, background: `linear-gradient(to left, ${C.bgAlt}, transparent)`, zIndex: 2, pointerEvents: 'none' }} />
    </Section>
  );
}

// ─── 10. FAQ ──────────────────────────────────────────────────────────────────
const FAQ_ITEMS = [
  {
    q: 'Comment sont calculés vos tarifs de transport ?',
    a: "Nos tarifs sont basés sur le poids réel ou volumétrique (le plus élevé des deux), la distance, le délai choisi et votre volume mensuel. Plus votre volume est élevé, plus nos tarifs sont compétitifs. Demandez une simulation gratuite en 2 minutes.",
  },
  {
    q: 'Quels sont les délais de livraison garantis ?',
    a: "Nos offres Express garantissent J+1 (enlèvement avant 18h). La messagerie standard est en J+2. Pour les zones insulaires et ultra-marines, comptez J+3 à J+5. Tous nos délais sont contractualisés avec indemnisation automatique en cas de retard.",
  },
  {
    q: 'Comment fonctionne le suivi de mes expéditions ?',
    a: "Chaque colis est équipé d'un code-barres unique et tracé à chaque scan. Votre tableau de bord en ligne affiche la position GPS en temps réel, les événements de scan et envoie des notifications automatiques à vous et vos destinataires.",
  },
  {
    q: "Proposez-vous des services à l'international ?",
    a: "Oui, nous opérons vers 42 pays via notre réseau partenaire GLS/DPD Europe et nos correspondants mondiaux. Nous gérons les documents douaniers (DAE, CMR, facture commerciale) et les déclarations d'exportation pour compte de vos clients.",
  },
  {
    q: 'Comment organiser un enlèvement ?',
    a: "Nos clients Business et Enterprise bénéficient d'enlèvements programmés quotidiens. Les nouveaux clients peuvent planifier un premier enlèvement en 24h via notre portail ou par téléphone. Nous intervenons sur toute la France pour le premier passage.",
  },
];

function FAQItem({ item, index }: { item: typeof FAQ_ITEMS[0]; index: number }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      style={{
        border: `1px solid ${open ? C.accent + '50' : C.border}`, borderRadius: C.radius,
        overflow: 'hidden', transition: C.transition,
        background: open ? `${C.accent}06` : C.bgCard,
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', background: 'none', border: 'none',
          padding: '22px 26px', display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', cursor: 'pointer', gap: 16, textAlign: 'left',
        }}
      >
        <span style={{ fontFamily: C.fontDisplay, fontSize: 'clamp(14px,2vw,16px)', fontWeight: 600, color: C.text }}>{item.q}</span>
        <motion.span animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.28 }}
          style={{ fontSize: 22, color: open ? C.accent : C.textMuted, flexShrink: 0, lineHeight: 1 }}>
          +
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.04, 0.62, 0.23, 0.98] }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '0 26px 22px', fontFamily: C.fontBody, fontSize: 14, color: C.textMuted, lineHeight: 1.8 }}>
              {item.a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function FAQSection() {
  return (
    <Section id="faq" bg={C.bg}>
      <Container style={{ maxWidth: 820 }}>
        <SectionHeader
          eyebrow="Questions fréquentes"
          title="Tout savoir sur nos services"
          subtitle="Vous ne trouvez pas la réponse ? Notre équipe est disponible du lundi au vendredi, 8h–19h."
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {FAQ_ITEMS.map((item, i) => <FAQItem key={i} item={item} index={i} />)}
        </div>
      </Container>
    </Section>
  );
}

// ─── 11. CONTACT FORM ─────────────────────────────────────────────────────────
const SERVICE_OPTIONS = [
  'Transport Express J+1', 'Messagerie B2B', 'Logistique E-commerce',
  'Entreposage', 'Transport International', 'Livraison Dernier Km', 'Solution complète',
];
const VOLUME_OPTIONS = [
  'Moins de 100 colis/mois', '100 – 500 colis/mois', '500 – 2 000 colis/mois',
  '2 000 – 10 000 colis/mois', 'Plus de 10 000 colis/mois',
];

function FormInput({ label, type = 'text', placeholder, required = false, id }: {
  label: string; type?: string; placeholder: string; required?: boolean; id: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <label htmlFor={id} style={{ fontFamily: C.fontBody, fontSize: 13, fontWeight: 500, color: C.textMuted }}>
        {label}{required && <span style={{ color: C.accent }}> *</span>}
      </label>
      <input id={id} type={type} placeholder={placeholder} required={required}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          background: C.bgCard, border: `1px solid ${focused ? C.accent : C.border}`,
          borderRadius: C.radius, padding: '13px 16px', fontFamily: C.fontBody,
          fontSize: 14, color: C.text, outline: 'none',
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
          boxShadow: focused ? `0 0 0 3px ${C.accent}15` : 'none', width: '100%',
        }}
      />
    </div>
  );
}

function FormSelect({ label, options, required = false, id }: {
  label: string; options: string[]; required?: boolean; id: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <label htmlFor={id} style={{ fontFamily: C.fontBody, fontSize: 13, fontWeight: 500, color: C.textMuted }}>
        {label}{required && <span style={{ color: C.accent }}> *</span>}
      </label>
      <select id={id} required={required}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          background: C.bgCard, border: `1px solid ${focused ? C.accent : C.border}`,
          borderRadius: C.radius, padding: '13px 16px', fontFamily: C.fontBody,
          fontSize: 14, color: C.text, outline: 'none', cursor: 'pointer',
          transition: 'border-color 0.2s ease', WebkitAppearance: 'none', width: '100%',
          boxShadow: focused ? `0 0 0 3px ${C.accent}15` : 'none',
        }}
      >
        <option value="">Sélectionner…</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function FormTextarea({ label, placeholder, id }: { label: string; placeholder: string; id: string }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <label htmlFor={id} style={{ fontFamily: C.fontBody, fontSize: 13, fontWeight: 500, color: C.textMuted }}>{label}</label>
      <textarea id={id} placeholder={placeholder} rows={5}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          background: C.bgCard, border: `1px solid ${focused ? C.accent : C.border}`,
          borderRadius: C.radius, padding: '13px 16px', fontFamily: C.fontBody,
          fontSize: 14, color: C.text, outline: 'none', resize: 'vertical',
          transition: 'border-color 0.2s ease', width: '100%',
          boxShadow: focused ? `0 0 0 3px ${C.accent}15` : 'none',
        }}
      />
    </div>
  );
}

function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  }, []);

  return (
    <Section id="contact" bg={C.bgAlt}>
      <Container>
        {/* Responsive 2-col contact grid */}
        <div ref={ref} className="contact-grid">
          {/* Left panel */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: `${C.accent}18`, border: `1px solid ${C.accent}40`,
              borderRadius: 100, padding: '6px 16px', marginBottom: 20,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.accent }} />
              <span style={{ fontFamily: C.fontBody, fontSize: 12, fontWeight: 600, color: C.accentLight, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Demande de devis
              </span>
            </div>
            <h2 style={{ fontFamily: C.fontDisplay, fontSize: 'clamp(26px,4vw,42px)', fontWeight: 800, color: C.text, lineHeight: 1.2, marginBottom: 20 }}>
              Démarrons votre projet logistique
            </h2>
            <p style={{ fontFamily: C.fontBody, fontSize: 'clamp(14px,1.5vw,16px)', color: C.textMuted, lineHeight: 1.8, marginBottom: 36 }}>
              Remplissez le formulaire et notre équipe commerciale vous contacte sous 2h ouvrées pour une simulation tarifaire personnalisée et sans engagement.
            </p>
            {[
              { icon: '📞', label: 'Téléphone',  value: '+33 1 84 88 92 10' },
              { icon: '✉️', label: 'Email',      value: 'contact@meridian-freight.fr' },
              { icon: '🕐', label: 'Horaires',   value: 'Lun–Ven 8h–19h | Sam 9h–13h' },
            ].map((info, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, background: `${C.accent}15`,
                  border: `1px solid ${C.accent}25`, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', flexShrink: 0,
                }}><TemplateIcon emoji={info.icon} size={18} color={C.accentLight} /></div>
                <div>
                  <div style={{ fontFamily: C.fontBody, fontSize: 11, color: C.textMuted, marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{info.label}</div>
                  <div style={{ fontFamily: C.fontDisplay, fontSize: 15, fontWeight: 600, color: C.text }}>{info.value}</div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Form */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7, delay: 0.1 }}>
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  style={{
                    background: C.bgCard, border: `1px solid ${C.success}40`, borderRadius: C.radiusLg,
                    padding: '48px 36px', textAlign: 'center', boxShadow: `0 0 40px ${C.success}15`,
                  }}
                >
                  <div style={{ marginBottom: 20 }}><TemplateIcon emoji="✅" size={56} color={C.success} /></div>
                  <h3 style={{ fontFamily: C.fontDisplay, fontSize: 24, fontWeight: 700, color: C.text, marginBottom: 12 }}>Demande envoyée !</h3>
                  <p style={{ fontFamily: C.fontBody, fontSize: 15, color: C.textMuted, lineHeight: 1.7 }}>
                    Merci pour votre intérêt. Notre équipe commerciale vous contactera sous{' '}
                    <strong style={{ color: C.text }}>2 heures ouvrées</strong> avec une simulation tarifaire complète.
                  </p>
                </motion.div>
              ) : (
                <motion.form key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleSubmit}
                  style={{
                    background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: C.radiusLg,
                    padding: '36px 32px', display: 'flex', flexDirection: 'column', gap: 18,
                  }}
                >
                  <div className="form-grid-2">
                    <FormInput id="company" label="Raison sociale" placeholder="Acme Industries SAS" required />
                    <FormInput id="contact-name" label="Nom et prénom" placeholder="Jean Dupont" required />
                  </div>
                  <div className="form-grid-2">
                    <FormInput id="email" label="Email professionnel" type="email" placeholder="j.dupont@entreprise.fr" required />
                    <FormInput id="phone" label="Téléphone" type="tel" placeholder="+33 6 00 00 00 00" />
                  </div>
                  <FormSelect id="service-type" label="Type de service" options={SERVICE_OPTIONS} required />
                  <FormSelect id="monthly-volume" label="Volume mensuel estimé" options={VOLUME_OPTIONS} required />
                  <FormTextarea id="message" label="Informations complémentaires" placeholder="Décrivez votre besoin, les villes de départ/destination, les contraintes particulières…" />
                  <button type="submit" style={{
                    background: `linear-gradient(135deg, ${C.accent}, ${C.accentDark})`,
                    color: '#fff', border: 'none', borderRadius: C.radius,
                    padding: '16px 32px', fontFamily: C.fontDisplay, fontWeight: 700,
                    fontSize: 16, cursor: 'pointer', boxShadow: `0 0 30px ${C.accent}40`,
                    transition: C.transition, marginTop: 4, width: '100%',
                  }}>
                    Envoyer ma demande de devis →
                  </button>
                  <p style={{ fontFamily: C.fontBody, fontSize: 11, color: C.textMuted, textAlign: 'center', lineHeight: 1.6 }}>
                    En soumettant ce formulaire, vous acceptez notre politique de confidentialité. Données traitées conformément au RGPD.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </Container>
    </Section>
  );
}

// ─── 12. FOOTER ───────────────────────────────────────────────────────────────
const FOOTER_LINKS: Record<string, { label: string; href: string }[]> = {
  Services: [
    { label: 'Transport Express', href: '#services' },
    { label: 'Messagerie B2B', href: '#services' },
    { label: 'Logistique E-commerce', href: '#services' },
    { label: 'Entreposage', href: '#services' },
    { label: 'Transport International', href: '#services' },
    { label: 'Dernier Km', href: '#services' },
  ],
  Entreprise: [
    { label: 'À propos', href: '#hero' },
    { label: 'Nos agences', href: '#coverage' },
    { label: 'Recrutement', href: '#contact' },
    { label: 'Presse & Médias', href: '#contact' },
    { label: 'RSE', href: '#hero' },
    { label: 'Blog logistique', href: '#hero' },
  ],
  Support: [
    { label: 'Suivi de colis', href: '#tracker' },
    { label: 'Espace client', href: '#contact' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Contact', href: '#contact' },
    { label: 'Signaler un problème', href: '#contact' },
    { label: 'CGV', href: '#contact' },
  ],
};

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h4 style={{ fontFamily: C.fontDisplay, fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 18, letterSpacing: '0.04em' }}>{title}</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
        {links.map((link) => (
          <a key={link.label} href={link.href} style={{ fontFamily: C.fontBody, fontSize: 13, color: C.textMuted, textDecoration: 'none', transition: 'color 0.2s ease' }}
            onMouseEnter={(e) => { (e.target as HTMLElement).style.color = C.text; }}
            onMouseLeave={(e) => { (e.target as HTMLElement).style.color = C.textMuted; }}>
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer style={{ background: C.bgAlt, borderTop: `1px solid ${C.border}` }}>
      <Container>
        <div style={{ padding: '68px 0 36px' }}>
          {/* Footer columns grid: 2fr 1fr 1fr 1fr → stacks on mobile */}
          <div className="footer-grid">
            {/* Brand */}
            <div>
              <a href="#hero" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 9,
                  background: `linear-gradient(135deg, ${C.accent}, ${C.accentDark})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}><TemplateIcon emoji="🚚" size={19} color="#fff" /></div>
                <span style={{ fontFamily: C.fontDisplay, fontWeight: 800, fontSize: 19, color: C.text }}>
                  Meridian<span style={{ color: C.accent }}>Freight</span>
                </span>
              </a>
              <p style={{ fontFamily: C.fontBody, fontSize: 13, color: C.textMuted, lineHeight: 1.8, marginBottom: 24 }}>
                Votre partenaire logistique de confiance depuis 2006. Transport routier, messagerie B2B, logistique e-commerce et entreposage sur toute la France et en Europe.
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                {['in', 'tw', 'fb', 'yt'].map((s) => (
                  <a key={s} href="#hero-glow" style={{
                    width: 34, height: 34, borderRadius: 8, background: C.bgCard,
                    border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: C.fontDisplay, fontSize: 11, fontWeight: 700, color: C.textMuted,
                    textDecoration: 'none', transition: C.transition,
                  }}
                    onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = C.accent; el.style.color = C.accent; }}
                    onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = C.border; el.style.color = C.textMuted; }}
                  >{s}</a>
                ))}
              </div>
            </div>
            {Object.entries(FOOTER_LINKS).map(([title, links]) => (
              <FooterColumn key={title} title={title} links={links} />
            ))}
          </div>

          {/* Bottom bar */}
          <div style={{
            marginTop: 52, paddingTop: 26, borderTop: `1px solid ${C.border}`,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14,
          }}>
            <p style={{ fontFamily: C.fontBody, fontSize: 12, color: C.textMuted }}>
              © 2024 Meridian Freight SAS · RCS Paris 841 234 567 · SIRET 84123456700014
            </p>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              {['Mentions légales', 'CGV', 'Confidentialité', 'Cookies'].map((l) => (
                <a key={l} href="#contact" style={{ fontFamily: C.fontBody, fontSize: 12, color: C.textMuted, textDecoration: 'none' }}>{l}</a>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}

// ─── ROOT PAGE ────────────────────────────────────────────────────────────────
export default function MeridianFreightPage() {
  return (
    <>
      <FontLoader />
      <GlobalStyles />
      <main style={{ background: C.bg, minHeight: '100vh' }}>
        <Nav />
        <Hero />
        <TrackerSection />
        <ServicesSection />
        <StatsSection />
        <PricingSection />
        <CoverageSection />
        <TestimonialsSection />
        <PartnersSection />
        <FAQSection />
        <ContactSection />
        <Footer />
      </main>
    </>
  );
}
