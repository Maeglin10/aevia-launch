"use client";
// @ts-nocheck

import { useRef, useState, useEffect } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from 'framer-motion'
import { TemplateIcon } from '@/components/TemplateIcon'
import { CheckCircle2 } from 'lucide-react'

/* ─────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────── */
const C = {
  bg: '#0b0d0a',
  bgAlt: '#111410',
  bgCard: '#161810',
  text: '#e9ead8',
  textMuted: '#9a9a82',
  accent: '#c8a53a',
  accentDark: '#8f7120',
  border: '#2a2c1f',
  borderLight: '#3a3c2a',
  white: '#ffffff',
}

/* ─────────────────────────────────────────────
   GOOGLE FONTS + GLOBAL CSS (with responsive)
───────────────────────────────────────────── */
function FontLoader() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');

      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html { scroll-behavior: smooth; }
      body {
        background: ${C.bg};
        color: ${C.text};
        font-family: 'Inter', sans-serif;
        overflow-x: hidden;
      }
      ::selection { background: ${C.accent}; color: ${C.bg}; }
      ::-webkit-scrollbar { width: 6px; }
      ::-webkit-scrollbar-track { background: ${C.bg}; }
      ::-webkit-scrollbar-thumb { background: ${C.accentDark}; border-radius: 3px; }

      /* ── Responsive grid helpers ── */
      .grid-2 {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 80px;
        align-items: start;
      }
      .grid-3 {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 24px;
      }
      .grid-4 {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
      }
      .grid-footer {
        display: grid;
        grid-template-columns: 1.8fr 1fr 1fr 1fr;
        gap: 48px;
        margin-bottom: 64px;
      }
      .grid-stats {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
      }
      .grid-process {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 0;
      }
      .grid-contact {
        display: grid;
        grid-template-columns: 1fr 1.4fr;
        gap: 80px;
        align-items: start;
      }
      .grid-form-2col {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
      }
      .grid-apropos {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 80px;
        align-items: center;
      }
      .section-padding {
        padding: 120px 40px;
      }
      .nav-desktop-links { display: flex; gap: 36px; align-items: center; }
      .nav-hamburger { display: none; }
      .cta-buttons { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }

      @media (max-width: 1024px) {
        .grid-footer {
          grid-template-columns: 1fr 1fr;
          gap: 32px;
        }
        .grid-process {
          grid-template-columns: repeat(2, 1fr);
          gap: 48px;
        }
        .grid-4 {
          grid-template-columns: repeat(2, 1fr);
        }
        .grid-stats {
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }
      }

      @media (max-width: 900px) {
        .grid-3 {
          grid-template-columns: repeat(2, 1fr);
        }
        .grid-apropos {
          grid-template-columns: 1fr;
          gap: 48px;
        }
        .grid-contact {
          grid-template-columns: 1fr;
          gap: 48px;
        }
        .grid-2 {
          grid-template-columns: 1fr;
          gap: 48px;
        }
      }

      @media (max-width: 768px) {
        .section-padding {
          padding: 72px 20px;
        }
        .nav-desktop-links { display: none !important; }
        .nav-hamburger { display: flex !important; }
        .grid-footer {
          grid-template-columns: 1fr;
          gap: 32px;
        }
        .grid-stats {
          grid-template-columns: repeat(2, 1fr);
          gap: 0;
        }
        .grid-process {
          grid-template-columns: 1fr;
          gap: 40px;
        }
        .grid-form-2col {
          grid-template-columns: 1fr;
        }
        .cta-buttons {
          flex-direction: column;
          align-items: stretch;
          padding: 0 20px;
        }
        .cta-buttons a { text-align: center; }
      }

      @media (max-width: 600px) {
        .grid-3 {
          grid-template-columns: 1fr;
        }
        .grid-4 {
          grid-template-columns: repeat(2, 1fr);
        }
      }

      @media (max-width: 480px) {
        .section-padding {
          padding: 56px 16px;
        }
        .grid-stats {
          grid-template-columns: 1fr 1fr;
        }
      }
    `}</style>
  )
}

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
function useScrolled(threshold = 60) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > threshold)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [threshold])
  return scrolled
}

function useCounter(target: number, duration = 2000) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [inView, target, duration])
  return { count, ref }
}

/* ─────────────────────────────────────────────
   NAV
───────────────────────────────────────────── */
function Nav() {
  const scrolled = useScrolled(60)
  const [mobileOpen, setMobileOpen] = useState(false)

  const links = [
    { label: 'Services', href: '#services' },
    { label: 'Réalisations', href: '#realisations' },
    { label: 'Équipe', href: '#equipe' },
    { label: 'Avis', href: '#avis' },
    { label: 'Contact', href: '#contact' },
  ]

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          padding: scrolled ? '12px 40px' : '22px 40px',
          background: scrolled
            ? 'rgba(11,13,10,0.97)'
            : 'linear-gradient(to bottom, rgba(11,13,10,0.85), transparent)',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? `1px solid ${C.border}` : 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'all 0.4s ease',
        }}
      >
        {/* Logo */}
        <a href="#accueil" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
          {fd?.logoBase64 ? (
            <img src={fd.logoBase64} alt={fd?.businessName ?? 'logo'} style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }} />
          ) : (
            <>
              <div
                style={{
                  width: 38,
                  height: 38,
                  background: C.accent,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'Oswald, sans-serif',
                  fontWeight: 700,
                  fontSize: 18,
                  color: C.bg,
                  letterSpacing: 1,
                  flexShrink: 0,
                }}
              >
                BD
              </div>
              <div>
                <div
                  style={{
                    fontFamily: 'Oswald, sans-serif',
                    fontSize: 17,
                    fontWeight: 600,
                    color: C.text,
                    letterSpacing: 2,
                    lineHeight: 1.1,
                    textTransform: 'uppercase',
                  }}
                >{fd?.businessName ?? "Bâtisseurs Durand"}</div>
                <div style={{ fontSize: 10, color: C.textMuted, letterSpacing: 3, textTransform: 'uppercase' }}>
                  Maçonnerie · BTP · Lyon
                </div>
              </div>
            </>
          )}
        </a>

        {/* Desktop Links */}
        <div className="nav-desktop-links">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              style={{
                color: C.textMuted,
                textDecoration: 'none',
                fontSize: 13,
                letterSpacing: 2,
                textTransform: 'uppercase',
                fontWeight: 500,
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = C.accent)}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = C.textMuted)}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            style={{
              background: C.accent,
              color: C.bg,
              padding: '10px 22px',
              fontFamily: 'Oswald, sans-serif',
              fontWeight: 600,
              fontSize: 13,
              letterSpacing: 2,
              textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.background = '#d9b545')}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.background = C.accent)}
          >
            Devis Gratuit
          </a>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="nav-hamburger"
          onClick={() => setMobileOpen(true)}
          aria-label="Ouvrir le menu"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 8,
            flexDirection: 'column',
            gap: 5,
            alignItems: 'center',
          }}
        >
          <div style={{ width: 24, height: 2, background: C.text }} />
          <div style={{ width: 18, height: 2, background: C.accent }} />
          <div style={{ width: 24, height: 2, background: C.text }} />
        </button>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 1100,
                background: 'rgba(0,0,0,0.7)',
              }}
            />
            <motion.div
              key="drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                width: 280,
                zIndex: 1200,
                background: C.bgCard,
                borderLeft: `1px solid ${C.border}`,
                padding: '80px 32px 40px',
                display: 'flex',
                flexDirection: 'column',
                gap: 28,
              }}
            >
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Fermer le menu"
                style={{
                  position: 'absolute',
                  top: 24,
                  right: 24,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: C.textMuted,
                  fontSize: 22,
                }}
              >
                ✕
              </button>
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    color: C.text,
                    textDecoration: 'none',
                    fontFamily: 'Oswald, sans-serif',
                    fontSize: 22,
                    letterSpacing: 2,
                    textTransform: 'uppercase',
                    fontWeight: 500,
                    borderBottom: `1px solid ${C.border}`,
                    paddingBottom: 16,
                  }}
                >
                  {l.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setMobileOpen(false)}
                style={{
                  background: C.accent,
                  color: C.bg,
                  padding: '14px 24px',
                  fontFamily: 'Oswald, sans-serif',
                  fontWeight: 600,
                  fontSize: 15,
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  textAlign: 'center',
                  marginTop: 12,
                }}
              >
                Devis Gratuit
              </a>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

/* ─────────────────────────────────────────────
   HERO
───────────────────────────────────────────── */
function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section
      ref={ref}
      id="accueil"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: C.bg,
      }}
    >
      {/* Blueprint Grid Background */}
      <BlueprintGrid />

      {/* Diagonal accent stripe */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '45%',
          height: '100%',
          background: `linear-gradient(135deg, transparent 50%, rgba(200,165,58,0.04) 50%)`,
          pointerEvents: 'none',
        }}
      />

      <motion.div
        style={{ y, opacity, position: 'relative', zIndex: 2, textAlign: 'center', padding: '120px 24px 80px', width: '100%', maxWidth: 960, margin: '0 auto' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            background: 'rgba(200,165,58,0.12)',
            border: `1px solid rgba(200,165,58,0.3)`,
            padding: '8px 20px',
            marginBottom: 32,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: C.accent,
              display: 'inline-block',
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 12,
              letterSpacing: 3,
              textTransform: 'uppercase',
              color: C.accent,
              fontWeight: 500,
            }}
          >
            Depuis 2002 · Lyon & Rhône-Alpes
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{
            fontFamily: 'Oswald, sans-serif',
            fontSize: 'clamp(40px, 9vw, 112px)',
            fontWeight: 700,
            lineHeight: 0.95,
            letterSpacing: '-1px',
            color: C.text,
            maxWidth: 900,
            margin: '0 auto 12px',
            textTransform: 'uppercase',
          }}
        >
          Bâtir l'exception,{' '}
          <span style={{ color: C.accent, display: 'block' }}>
            pierre après pierre
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65 }}
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 'clamp(15px, 2.2vw, 20px)',
            color: C.textMuted,
            maxWidth: 600,
            margin: '28px auto 48px',
            lineHeight: 1.7,
            fontWeight: 300,
          }}
        >
          Maçonnerie générale, ravalement de façade et isolation thermique par l'extérieur à Lyon,
          dans le Rhône et l'Isère. Artisans qualifiés, garantie décennale, devis offert en 48h.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.85 }}
          className="cta-buttons"
        >
          <a
            href="#contact"
            style={{
              background: C.accent,
              color: C.bg,
              padding: '18px 40px',
              fontFamily: 'Oswald, sans-serif',
              fontWeight: 600,
              fontSize: 15,
              letterSpacing: 3,
              textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'all 0.25s',
              display: 'inline-block',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget
              el.style.background = '#d9b545'
              el.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget
              el.style.background = C.accent
              el.style.transform = 'translateY(0)'
            }}
          >
            Demander un devis
          </a>
          <a
            href="#realisations"
            style={{
              background: 'transparent',
              color: C.text,
              padding: '17px 40px',
              fontFamily: 'Oswald, sans-serif',
              fontWeight: 500,
              fontSize: 15,
              letterSpacing: 3,
              textTransform: 'uppercase',
              textDecoration: 'none',
              border: `1px solid ${C.borderLight}`,
              transition: 'all 0.25s',
              display: 'inline-block',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget
              el.style.borderColor = C.accent
              el.style.color = C.accent
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget
              el.style.borderColor = C.borderLight
              el.style.color = C.text
            }}
          >
            Voir nos chantiers
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          style={{ marginTop: 80, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
        >
          <span style={{ fontSize: 10, letterSpacing: 3, color: C.textMuted, textTransform: 'uppercase' }}>
            Défiler
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            style={{ width: 1, height: 40, background: `linear-gradient(to bottom, ${C.accent}, transparent)` }}
          />
        </motion.div>
      </motion.div>
    </section>
  )
}

/* Blueprint animated grid */
function BlueprintGrid() {
  return (
    <svg
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        opacity: 0.18,
        pointerEvents: 'none',
      }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="smallGrid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke={C.accent} strokeWidth="0.4" />
        </pattern>
        <pattern id="grid" width="200" height="200" patternUnits="userSpaceOnUse">
          <rect width="200" height="200" fill="url(#smallGrid)" />
          <path d="M 200 0 L 0 0 0 200" fill="none" stroke={C.accent} strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
      <motion.line
        x1="0"
        y1="0"
        x2="100%"
        y2="0"
        stroke={C.accent}
        strokeWidth="1"
        strokeOpacity="0.5"
        animate={{ y1: ['0%', '100%'], y2: ['0%', '100%'] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />
    </svg>
  )
}

/* ─────────────────────────────────────────────
   STATS STRIP
───────────────────────────────────────────── */
function CounterItem({
  target,
  suffix,
  label,
}: {
  target: number
  suffix: string
  label: string
}) {
  const { count, ref } = useCounter(target)
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '24px 16px',
        borderRight: `1px solid ${C.border}`,
      }}
    >
      <div
        style={{
          fontFamily: 'Oswald, sans-serif',
          fontSize: 'clamp(32px, 4vw, 64px)',
          fontWeight: 700,
          color: C.accent,
          lineHeight: 1,
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'center',
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <span ref={ref}>{count}</span>
        <span style={{ fontSize: '0.65em' }}>{suffix}</span>
      </div>
      <div
        style={{
          fontSize: 11,
          letterSpacing: 2,
          textTransform: 'uppercase',
          color: C.textMuted,
          marginTop: 8,
          fontWeight: 500,
        }}
      >
        {label}
      </div>
    </div>
  )
}

function StatsStrip() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true })

  const stats = [
    { target: 1840, suffix: '+', label: 'Chantiers réalisés' },
    { target: 22, suffix: ' ans', label: "D'expérience" },
    { target: 100, suffix: '%', label: 'Garantie décennale' },
    { target: 48, suffix: 'h', label: 'Délai devis offert' },
  ]

  return (
    <section
      ref={ref}
      style={{
        background: C.bgCard,
        borderTop: `1px solid ${C.border}`,
        borderBottom: `1px solid ${C.border}`,
        padding: '48px 40px',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="grid-stats"
        style={{ maxWidth: 1100, margin: '0 auto' }}
      >
        {stats.map((s, i) => (
          <CounterItem key={i} target={s.target} suffix={s.suffix} label={s.label} />
        ))}
      </motion.div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   SERVICES
───────────────────────────────────────────── */
type ServiceCardProps = {
  icon: string
  title: string
  description: string
  price: string
  delay: number
}

function ServiceCard({ icon, title, description, price, delay }: ServiceCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? C.bgAlt : C.bgCard,
        border: `1px solid ${hovered ? C.accent : C.border}`,
        padding: '36px 28px',
        transition: 'all 0.3s ease',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        cursor: 'default',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Corner accent */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: 0,
          height: 0,
          borderTop: `40px solid ${hovered ? C.accent : 'transparent'}`,
          borderLeft: '40px solid transparent',
          transition: 'border-color 0.3s',
        }}
      />
      <div style={{ marginBottom: 20 }}><TemplateIcon emoji={icon} size={36} /></div>
      <h3
        style={{
          fontFamily: 'Oswald, sans-serif',
          fontSize: 20,
          fontWeight: 600,
          color: hovered ? C.accent : C.text,
          letterSpacing: 1,
          textTransform: 'uppercase',
          marginBottom: 12,
          transition: 'color 0.3s',
        }}
      >
        {title}
      </h3>
      <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.7, marginBottom: 24 }}>
        {description}
      </p>
      <div style={{ fontSize: 13, fontWeight: 600, color: C.accent, fontFamily: 'Oswald, sans-serif', letterSpacing: 1 }}>
        {price}
      </div>
    </motion.div>
  )
}

function Services() {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const titleInView = useInView(titleRef, { once: true })

  const services = [
    {
      icon: '🧱',
      title: 'Maçonnerie Générale',
      description:
        "Construction de murs porteurs, ouvertures, extensions de maison, agglos et parpaings. Travail soigné et conforme aux DTU en vigueur. Devis détaillé fourni avant tout démarrage.",
      price: 'À partir de 45 €/m²',
    },
    {
      icon: '🏚️',
      title: 'Ravalement & ITE',
      description:
        "Isolation thermique par l'extérieur, enduits monocouche, projection talochée. Économisez jusqu'à 30 % sur votre facture énergétique. Éligible MaPrimeRénov'.",
      price: 'À partir de 90 €/m²',
    },
    {
      icon: '⬛',
      title: 'Carrelage & Faïence',
      description:
        "Pose de carrelage grand format, faïence salle de bain, terrasses extérieures. Joints époxy, découpe laser. Salle de bain complète rénovée en 5 jours.",
      price: 'À partir de 35 €/m²',
    },
    {
      icon: '🔲',
      title: 'Chape & Dallage',
      description:
        "Chape fluide anhydrite, chape ciment traditionnelle, ragréage. Dalles béton pour garages et entrepôts. Nivellement laser au millimètre.",
      price: 'À partir de 18 €/m²',
    },
    {
      icon: '💧',
      title: 'Étanchéité',
      description:
        "Imperméabilisation de toitures-terrasses, balcons, caves. Membrane EPDM, bitume élastomère, résine polyuréthane. Garantie 10 ans systématique.",
      price: 'À partir de 55 €/m²',
    },
    {
      icon: '⚒️',
      title: 'Démolition & Dépose',
      description:
        "Démolition intérieure sélective, abattage de cloisons, dépollution amiante sous-traitée. Évacuation des gravats incluse. Certificat de destruction fourni.",
      price: 'À partir de 25 €/m²',
    },
  ]

  return (
    <section id="services" className="section-padding" style={{ background: C.bg }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 72 }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <span
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 11,
                letterSpacing: 4,
                textTransform: 'uppercase',
                color: C.accent,
                fontWeight: 600,
              }}
            >
              Nos prestations
            </span>
          </motion.div>
          <h2
            ref={titleRef}
            style={{
              fontFamily: 'Oswald, sans-serif',
              fontSize: 'clamp(30px, 5vw, 58px)',
              fontWeight: 700,
              color: C.text,
              textTransform: 'uppercase',
              marginTop: 12,
              letterSpacing: 1,
            }}
          >
            Des métiers du bâtiment{' '}
            <span style={{ color: C.accent }}>maîtrisés</span>
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 2,
          }}
        >
          {services.map((s, i) => (
            <ServiceCard
              key={i}
              icon={s.icon}
              title={s.title}
              description={s.description}
              price={s.price}
              delay={i * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   PROCESS
───────────────────────────────────────────── */
type ProcessStepProps = {
  number: string
  title: string
  description: string
  delay: number
  isLast: boolean
}

function ProcessStep({ number, title, description, delay, isLast }: ProcessStepProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          border: `2px solid ${C.accent}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Oswald, sans-serif',
          fontSize: 26,
          fontWeight: 700,
          color: C.accent,
          background: 'rgba(200,165,58,0.08)',
          marginBottom: 24,
          position: 'relative',
          zIndex: 1,
          flexShrink: 0,
        }}
      >
        {number}
      </div>
      {!isLast && (
        <div
          style={{
            position: 'absolute',
            top: 36,
            left: 'calc(50% + 36px)',
            width: 'calc(100% - 72px)',
            height: 1,
            background: `linear-gradient(to right, ${C.accent}, ${C.border})`,
          }}
        />
      )}
      <h3
        style={{
          fontFamily: 'Oswald, sans-serif',
          fontSize: 18,
          fontWeight: 600,
          color: C.text,
          letterSpacing: 1,
          textTransform: 'uppercase',
          marginBottom: 10,
          textAlign: 'center',
        }}
      >
        {title}
      </h3>
      <p style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.65, textAlign: 'center', maxWidth: 220 }}>
        {description}
      </p>
    </motion.div>
  )
}

function Process() {
  const steps = [
    {
      number: '01',
      title: 'Visite Technique',
      description:
        'Un chef de chantier se déplace chez vous gratuitement pour évaluer les travaux et prendre les mesures.',
    },
    {
      number: '02',
      title: 'Validation du devis',
      description:
        'Devis détaillé et transparent remis sous 48h. Validation par signature électronique, acompte de 30 %.',
    },
    {
      number: '03',
      title: 'Exécution',
      description:
        "Nos équipes interviennent aux dates convenues. Points d\'avancement hebdomadaires par SMS ou e-mail.",
    },
    {
      number: '04',
      title: 'Réception chantier',
      description:
        'Visite de réception contradictoire avec remise du procès-verbal, des DOE et de la garantie décennale.',
    },
  ]

  const ref = useRef<HTMLHeadingElement>(null)
  const inView = useInView(ref, { once: true })

  return (
    <section className="section-padding" style={{ background: C.bgAlt }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 80 }}>
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 11,
              letterSpacing: 4,
              textTransform: 'uppercase',
              color: C.accent,
              fontWeight: 600,
            }}
          >
            Comment ça marche
          </span>
          <h2
            ref={ref}
            style={{
              fontFamily: 'Oswald, sans-serif',
              fontSize: 'clamp(28px, 4.5vw, 54px)',
              fontWeight: 700,
              color: C.text,
              textTransform: 'uppercase',
              marginTop: 12,
              letterSpacing: 1,
            }}
          >
            Un processus <span style={{ color: C.accent }}>clair</span>{' '}
            du premier contact à la livraison
          </h2>
        </div>
        <div className="grid-process">
          {steps.map((s, i) => (
            <ProcessStep
              key={i}
              number={s.number}
              title={s.title}
              description={s.description}
              delay={i * 0.15}
              isLast={i === steps.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   À PROPOS + BLUEPRINT SVG
───────────────────────────────────────────── */
function BlueprintFloorPlan() {
  const ref = useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <div
      style={{
        background: 'rgba(10,30,50,0.5)',
        border: `1px solid rgba(100,160,220,0.25)`,
        padding: '24px',
        position: 'relative',
      }}
    >
      <div
        style={{
          fontSize: 10,
          letterSpacing: 3,
          color: 'rgba(100,160,220,0.6)',
          textTransform: 'uppercase',
          marginBottom: 16,
          fontFamily: 'Inter, sans-serif',
        }}
      >
        Plan d'architecte — Résidence les Cèdres, Lyon 9e
      </div>
      <svg
        ref={ref}
        viewBox="0 0 420 320"
        style={{ width: '100%', height: 'auto', display: 'block' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="bpGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(80,140,200,0.2)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="420" height="320" fill="rgba(5,20,45,0.8)" />
        <rect width="420" height="320" fill="url(#bpGrid)" />

        {/* Outer walls */}
        <motion.rect
          x="20" y="20" width="380" height="280"
          fill="none"
          stroke="rgba(100,180,255,0.8)"
          strokeWidth="3"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={inView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        />

        {/* Interior walls */}
        <motion.path
          d="M 160 20 L 160 200 M 160 200 L 400 200 M 240 200 L 240 300 M 20 140 L 160 140"
          fill="none"
          stroke="rgba(100,180,255,0.7)"
          strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={inView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 2, delay: 0.8, ease: 'easeInOut' }}
        />

        {/* Doors (arcs) */}
        <motion.path
          d="M 160 140 A 30 30 0 0 1 190 110"
          fill="none"
          stroke="rgba(200,165,58,0.7)"
          strokeWidth="1.5"
          strokeDasharray="4 3"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={inView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 2.0 }}
        />
        <motion.path
          d="M 240 200 A 28 28 0 0 0 212 228"
          fill="none"
          stroke="rgba(200,165,58,0.7)"
          strokeWidth="1.5"
          strokeDasharray="4 3"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={inView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 2.3 }}
        />

        {/* Dimensions + Labels */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 2.8 }}
        >
          <line x1="20" y1="10" x2="400" y2="10" stroke="rgba(200,165,58,0.5)" strokeWidth="0.5" />
          <text x="210" y="8" textAnchor="middle" fill="rgba(200,165,58,0.8)" fontSize="8" fontFamily="Inter,sans-serif">12,65 m</text>
          <line x1="410" y1="20" x2="410" y2="300" stroke="rgba(200,165,58,0.5)" strokeWidth="0.5" />
          <text x="418" y="165" textAnchor="middle" fill="rgba(200,165,58,0.8)" fontSize="8" fontFamily="Inter,sans-serif" transform="rotate(90 418 165)">9,40 m</text>

          <text x="88" y="75" textAnchor="middle" fill="rgba(100,200,255,0.9)" fontSize="10" fontFamily="Oswald,sans-serif">Séjour</text>
          <text x="88" y="88" textAnchor="middle" fill="rgba(100,180,220,0.6)" fontSize="7" fontFamily="Inter,sans-serif">28 m²</text>

          <text x="88" y="175" textAnchor="middle" fill="rgba(100,200,255,0.9)" fontSize="10" fontFamily="Oswald,sans-serif">Cuisine</text>
          <text x="88" y="188" textAnchor="middle" fill="rgba(100,180,220,0.6)" fontSize="7" fontFamily="Inter,sans-serif">14 m²</text>

          <text x="280" y="95" textAnchor="middle" fill="rgba(100,200,255,0.9)" fontSize="10" fontFamily="Oswald,sans-serif">Ch. Principale</text>
          <text x="280" y="108" textAnchor="middle" fill="rgba(100,180,220,0.6)" fontSize="7" fontFamily="Inter,sans-serif">18 m²</text>

          <text x="300" y="255" textAnchor="middle" fill="rgba(100,200,255,0.9)" fontSize="10" fontFamily="Oswald,sans-serif">Ch. 2</text>
          <text x="300" y="268" textAnchor="middle" fill="rgba(100,180,220,0.6)" fontSize="7" fontFamily="Inter,sans-serif">12 m²</text>

          <text x="193" y="255" textAnchor="middle" fill="rgba(100,200,255,0.9)" fontSize="9" fontFamily="Oswald,sans-serif">S.D.B</text>
          <text x="193" y="267" textAnchor="middle" fill="rgba(100,180,220,0.6)" fontSize="7" fontFamily="Inter,sans-serif">8 m²</text>
        </motion.g>

        {/* Animated scan dot */}
        <motion.circle
          r="3"
          fill={C.accent}
          opacity={0.8}
          animate={inView ? {
            cx: [20, 400, 400, 20, 20],
            cy: [20, 20, 300, 300, 20],
          } : { cx: 20, cy: 20 }}
          transition={{ duration: 4, delay: 1, ease: 'linear', repeat: Infinity }}
        />
      </svg>
    </div>
  )
}

function APropos() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} id="apropos" className="section-padding" style={{ background: C.bg }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="grid-apropos">
          {/* Text col */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 11,
                letterSpacing: 4,
                textTransform: 'uppercase',
                color: C.accent,
                fontWeight: 600,
              }}
            >
              Notre histoire
            </span>
            <h2
              style={{
                fontFamily: 'Oswald, sans-serif',
                fontSize: 'clamp(28px, 4vw, 52px)',
                fontWeight: 700,
                color: C.text,
                textTransform: 'uppercase',
                marginTop: 14,
                marginBottom: 28,
                letterSpacing: 1,
              }}
            >
              22 ans au service{' '}
              <span style={{ color: C.accent }}>du bâti lyonnais</span>
            </h2>
            <p style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.8, marginBottom: 20 }}>
              Fondée en 2002 par Marc Durand, compagnon du devoir, l'entreprise Bâtisseurs Durand s'est
              bâtie sur un principe simple : un chantier bien fait, c'est un chantier dont le client est
              fier. Vingt-deux ans plus tard, nos équipes interviennent sur tout le bassin lyonnais, de
              Villefranche-sur-Saône à Vienne, en passant par Bourgoin-Jallieu et l'Isère.
            </p>
            <p style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.8, marginBottom: 36 }}>
              Qualifiés RGE Qualibat, nous maîtrisons aussi bien la maçonnerie traditionnelle que les
              techniques modernes d'isolation thermique par l'extérieur. Notre bureau d'étude interne
              assure le suivi technique de chaque dossier, de la déclaration préalable à la réception
              de chantier.
            </p>

            <div style={{ display: 'flex', gap: 32, marginBottom: 40, flexWrap: 'wrap' }}>
              {[
                { label: 'Qualibat RGE', icon: '🏅' },
                { label: 'Garantie décennale', icon: '📜' },
                { label: 'Artisan certifié', icon: '⭐' },
              ].map((badge) => (
                <div key={badge.label} style={{ textAlign: 'center' }}>
                  <div style={{ marginBottom: 6 }}><TemplateIcon emoji={badge.icon} size={28} /></div>
                  <div style={{ fontSize: 11, color: C.textMuted, letterSpacing: 1, textTransform: 'uppercase' }}>
                    {badge.label}
                  </div>
                </div>
              ))}
            </div>

            <a
              href="#contact"
              style={{
                background: 'transparent',
                color: C.accent,
                padding: '14px 32px',
                border: `1px solid ${C.accent}`,
                fontFamily: 'Oswald, sans-serif',
                fontWeight: 600,
                fontSize: 14,
                letterSpacing: 2,
                textTransform: 'uppercase',
                textDecoration: 'none',
                display: 'inline-block',
                transition: 'all 0.25s',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget
                el.style.background = C.accent
                el.style.color = C.bg
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget
                el.style.background = 'transparent'
                el.style.color = C.accent
              }}
            >
              Nous contacter
            </a>
          </motion.div>

          {/* Blueprint col */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <BlueprintFloorPlan />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   RÉALISATIONS
───────────────────────────────────────────── */
type ProjectCardProps = {
  type: string
  location: string
  surface: string
  year: string
  description: string
  tag: string
  delay: number
}

function BlueprintMiniIcon() {
  return (
    <svg width="80" height="60" viewBox="0 0 80 60" style={{ opacity: 0.25 }}>
      <rect x="5" y="5" width="70" height="50" fill="none" stroke={C.accent} strokeWidth="1.5" />
      <line x1="35" y1="5" x2="35" y2="55" stroke={C.accent} strokeWidth="1" />
      <line x1="5" y1="32" x2="75" y2="32" stroke={C.accent} strokeWidth="1" />
      <rect x="10" y="10" width="20" height="18" fill="none" stroke={C.accent} strokeWidth="0.8" />
      <rect x="40" y="10" width="30" height="18" fill="none" stroke={C.accent} strokeWidth="0.8" />
    </svg>
  )
}

function ProjectCard({ type, location, surface, year, description, tag, delay }: ProjectCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: C.bgCard,
        border: `1px solid ${hovered ? C.accent : C.border}`,
        overflow: 'hidden',
        transition: 'border-color 0.3s',
        cursor: 'default',
      }}
    >
      <div
        style={{
          height: 180,
          background: `linear-gradient(135deg, ${C.bgAlt} 0%, ${hovered ? 'rgba(200,165,58,0.08)' : C.bgCard} 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          borderBottom: `1px solid ${C.border}`,
          transition: 'background 0.3s',
        }}
      >
        <BlueprintMiniIcon />
        <div
          style={{
            position: 'absolute',
            top: 16,
            left: 16,
            background: C.accent,
            color: C.bg,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: 'uppercase',
            padding: '4px 10px',
          }}
        >
          {tag}
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 16,
            right: 16,
            fontSize: 11,
            color: C.textMuted,
            fontFamily: 'Oswald, sans-serif',
            letterSpacing: 1,
          }}
        >
          {year}
        </div>
      </div>

      <div style={{ padding: '24px 24px 28px' }}>
        <div style={{ fontSize: 11, color: C.accent, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8, fontWeight: 600 }}>
          {type}
        </div>
        <h3
          style={{
            fontFamily: 'Oswald, sans-serif',
            fontSize: 18,
            fontWeight: 600,
            color: C.text,
            letterSpacing: 0.5,
            marginBottom: 8,
            textTransform: 'uppercase',
          }}
        >
          {location}
        </h3>
        <p style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.65, marginBottom: 16 }}>{description}</p>
        <div style={{ fontSize: 12, color: C.textMuted }}>
          <span style={{ color: C.accent, fontWeight: 600 }}>{surface}</span>
        </div>
      </div>
    </motion.div>
  )
}

function Realisations() {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const titleInView = useInView(titleRef, { once: true })

  const projects = [
    {
      type: 'Ravalement ITE',
      location: 'Immeuble copropriété — Lyon 8e',
      surface: '620 m² de façade',
      year: '2024',
      description: "Isolation thermique par l\'extérieur sur immeuble R+4, enduit minéral teinté dans la masse. Subvention copropriété obtenue.",
      tag: 'Copropriété',
    },
    {
      type: 'Maçonnerie neuve',
      location: 'Maison individuelle — Caluire-et-Cuire',
      surface: '145 m² SHON',
      year: '2024',
      description: 'Extension double garage et chambre parentale en R+1, structure béton armé, isolation combles perdus.',
      tag: 'Extension',
    },
    {
      type: 'Étanchéité toiture',
      location: 'Restaurant Le Gourmet — Vieux-Lyon',
      surface: '210 m² terrasse',
      year: '2023',
      description: "Reprise complète de l\'étanchéité bitumineuse d\'une toiture-terrasse accessible, relevés carrelés, évacuations refaites.",
      tag: 'Commercial',
    },
    {
      type: 'Chape & Dallage',
      location: 'Entrepôt logistique — Bourgoin-Jallieu',
      surface: '1 850 m²',
      year: '2023',
      description: 'Dallage béton fibré Q150, pré-dalle de 18 cm, finition hélicoptérée, réservations racks et quais de déchargement.',
      tag: 'Industriel',
    },
    {
      type: 'Carrelage grand format',
      location: 'Villa rénovation — Tassin-la-Demi-Lune',
      surface: '340 m²',
      year: '2022',
      description: 'Pose de grès cérame 120×120 sur 5 pièces de vie, salle de bain italienne en marbre de Carrare, joint époxy couleur bronze.',
      tag: 'Particulier',
    },
    {
      type: 'Démolition & Restructuration',
      location: 'Bureaux reconversion — Villeurbanne',
      surface: '480 m²',
      year: '2022',
      description: 'Démolition sélective de 42 cloisons, création de 3 dalles de béton allégé, réhabilitation façade briques apparentes.',
      tag: 'Tertiaire',
    },
  ]

  return (
    <section id="realisations" className="section-padding" style={{ background: C.bgAlt }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 72 }}>
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 11,
              letterSpacing: 4,
              textTransform: 'uppercase',
              color: C.accent,
              fontWeight: 600,
            }}
          >
            Portfolio
          </span>
          <h2
            ref={titleRef}
            style={{
              fontFamily: 'Oswald, sans-serif',
              fontSize: 'clamp(28px, 4.5vw, 56px)',
              fontWeight: 700,
              color: C.text,
              textTransform: 'uppercase',
              marginTop: 12,
              letterSpacing: 1,
            }}
          >
            Nos dernières{' '}
            <span style={{ color: C.accent }}>réalisations</span>
          </h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={titleInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
            style={{ fontSize: 15, color: C.textMuted, maxWidth: 560, margin: '16px auto 0', lineHeight: 1.7 }}
          >
            Du bâti résidentiel aux chantiers industriels, chaque réalisation témoigne de notre exigence.
          </motion.p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 24,
          }}
        >
          {projects.map((p, i) => (
            <ProjectCard
              key={i}
              type={p.type}
              location={p.location}
              surface={p.surface}
              year={p.year}
              description={p.description}
              tag={p.tag}
              delay={i * 0.08}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   TEAM
───────────────────────────────────────────── */
type TeamCardProps = {
  name: string
  role: string
  years: string
  specialty: string
  initials: string
  delay: number
}

function TeamCard({ name, role, years, specialty, initials, delay }: TeamCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: C.bgCard,
        border: `1px solid ${hovered ? C.accent : C.border}`,
        padding: '40px 32px',
        textAlign: 'center',
        transition: 'all 0.3s',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
      }}
    >
      <div
        style={{
          width: 88,
          height: 88,
          borderRadius: '50%',
          background: hovered
            ? `linear-gradient(135deg, ${C.accent}, ${C.accentDark})`
            : 'rgba(200,165,58,0.12)',
          border: `2px solid ${hovered ? C.accent : C.borderLight}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
          fontFamily: 'Oswald, sans-serif',
          fontSize: 28,
          fontWeight: 700,
          color: hovered ? C.bg : C.accent,
          transition: 'all 0.3s',
        }}
      >
        {initials}
      </div>
      <h3
        style={{
          fontFamily: 'Oswald, sans-serif',
          fontSize: 20,
          fontWeight: 600,
          color: C.text,
          letterSpacing: 1,
          textTransform: 'uppercase',
          marginBottom: 4,
        }}
      >
        {name}
      </h3>
      <div style={{ fontSize: 12, color: C.accent, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20, fontWeight: 600 }}>
        {role}
      </div>
      <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <div style={{ fontFamily: 'Oswald, sans-serif', fontSize: 26, fontWeight: 700, color: C.accent }}>
              {years}
            </div>
            <div style={{ fontSize: 10, color: C.textMuted, letterSpacing: 1, textTransform: 'uppercase' }}>
              Ans exp.
            </div>
          </div>
          <div style={{ width: 1, background: C.border }} />
          <div style={{ flex: 1, textAlign: 'left' }}>
            <div style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.5 }}>
              <strong style={{ color: C.text, display: 'block', marginBottom: 2 }}>Spécialité</strong>
              {specialty}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function Team() {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const titleInView = useInView(titleRef, { once: true })

  const members = [
    {
      name: 'Marc Durand',
      role: 'Fondateur & Gérant',
      years: '22',
      specialty: 'Maçonnerie traditionnelle, gros-œuvre, béton armé. Compagnon du devoir.',
      initials: 'MD',
    },
    {
      name: 'Sophie Lenoir',
      role: 'Conductrice de travaux',
      years: '14',
      specialty: "Coordination multi-lots, appels d\'offres, suivi budgétaire, relation MOA.",
      initials: 'SL',
    },
    {
      name: 'Jean Marchand',
      role: 'Chef maçon',
      years: '18',
      specialty: 'Ravalement ITE, enduits de façade, isolation thermique, rénovation énergétique.',
      initials: 'JM',
    },
  ]

  return (
    <section id="equipe" className="section-padding" style={{ background: C.bg }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 72 }}>
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 11,
              letterSpacing: 4,
              textTransform: 'uppercase',
              color: C.accent,
              fontWeight: 600,
            }}
          >
            L'équipe
          </span>
          <h2
            ref={titleRef}
            style={{
              fontFamily: 'Oswald, sans-serif',
              fontSize: 'clamp(28px, 4.5vw, 56px)',
              fontWeight: 700,
              color: C.text,
              textTransform: 'uppercase',
              marginTop: 12,
              letterSpacing: 1,
            }}
          >
            Des experts{' '}
            <span style={{ color: C.accent }}>passionnés</span>
          </h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={titleInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
            style={{ fontSize: 15, color: C.textMuted, maxWidth: 520, margin: '16px auto 0', lineHeight: 1.7 }}
          >
            Chaque chef de chantier est sélectionné pour son savoir-faire, sa rigueur et sa capacité
            à communiquer avec nos clients.
          </motion.p>
        </div>

        <div className="grid-3">
          {members.map((m, i) => (
            <TeamCard
              key={i}
              name={m.name}
              role={m.role}
              years={m.years}
              specialty={m.specialty}
              initials={m.initials}
              delay={i * 0.15}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   TESTIMONIALS
───────────────────────────────────────────── */
type TestimonialCardProps = {
  text: string
  author: string
  role: string
  rating: number
  delay: number
}

function TestimonialCard({ text, author, role, rating, delay }: TestimonialCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay }}
      style={{
        background: C.bgCard,
        border: `1px solid ${C.border}`,
        padding: '32px 28px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      <div style={{ display: 'flex', gap: 4 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} style={{ fontSize: 14, color: i < rating ? C.accent : C.border }}>★</span>
        ))}
      </div>

      <div
        style={{
          fontFamily: 'Georgia, serif',
          fontSize: 56,
          color: C.accent,
          lineHeight: 0.7,
          opacity: 0.4,
          userSelect: 'none',
        }}
      >
        "
      </div>

      <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.75, fontStyle: 'italic', flex: 1 }}>
        {text}
      </p>

      <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16 }}>
        <div style={{ fontWeight: 600, color: C.text, fontSize: 14 }}>{author}</div>
        <div style={{ fontSize: 11, color: C.accent, letterSpacing: 1, textTransform: 'uppercase', marginTop: 2 }}>{role}</div>
      </div>
    </motion.div>
  )
}

function Testimonials() {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const titleInView = useInView(titleRef, { once: true })

  const testimonials = [
    {
      text: "Ravalement complet de notre immeuble de 12 lots, travaux terminés en avance sur le planning et dans le budget. Marc et son équipe ont été d'une professionnalisme exemplaire. Le syndic a déjà signé pour le prochain chantier.",
      author: 'Isabelle Roux',
      role: 'Présidente du conseil syndical — Lyon 6e',
      rating: 5,
    },
    {
      text: "Extension de notre maison de 45 m² : fondations, murs, toiture et isolation ITE. Délai tenu à la semaine près. Les finitions sont impeccables. Nous recommandons Bâtisseurs Durand à tous nos voisins.",
      author: 'Thierry & Nathalie Blanc',
      role: 'Particuliers — Caluire-et-Cuire',
      rating: 5,
    },
    {
      text: "Rénovation complète de la salle de bain et des WC en 6 jours chrono. Carrelage parfaitement posé, douche italienne réalisée sans aucune fuite. Le chef de chantier était joignable à toute heure.",
      author: 'Léa Fontaine',
      role: 'Propriétaire — Lyon 3e',
      rating: 5,
    },
    {
      text: "Notre restaurant avait des problèmes d'infiltration sur la toiture-terrasse depuis 3 ans. Deux entreprises n'avaient pas réussi. Bâtisseurs Durand a diagnostiqué le problème en une heure et réparé définitivement. Merci !",
      author: 'Aurélien Gastaud',
      role: 'Restaurateur — Vieux-Lyon',
      rating: 5,
    },
    {
      text: "Dallage industriel de notre entrepôt de 2 000 m². Délai incroyablement court (3 semaines), surface parfaitement plane vérifiée au laser. Les équipes Bâtisseurs Durand sont des professionnels du haut niveau.",
      author: 'Directeur exploitation',
      role: 'Société de logistique — Bourgoin-Jallieu',
      rating: 5,
    },
    {
      text: "Nous avons fait appel à Bâtisseurs Durand pour la démolition et restructuration de nos bureaux en open space. Travaux réalisés le week-end pour ne pas perturber l'activité. Propre, rapide et dans les prix.",
      author: 'Marie-Claire Peyroux',
      role: 'Dirigeante PME — Villeurbanne',
      rating: 4,
    },
  ]

  return (
    <section id="avis" className="section-padding" style={{ background: C.bgAlt }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 72 }}>
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 11,
              letterSpacing: 4,
              textTransform: 'uppercase',
              color: C.accent,
              fontWeight: 600,
            }}
          >
            Témoignages clients
          </span>
          <h2
            ref={titleRef}
            style={{
              fontFamily: 'Oswald, sans-serif',
              fontSize: 'clamp(28px, 4.5vw, 56px)',
              fontWeight: 700,
              color: C.text,
              textTransform: 'uppercase',
              marginTop: 12,
              letterSpacing: 1,
            }}
          >
            La confiance de nos{' '}
            <span style={{ color: C.accent }}>clients</span>
          </h2>
          <motion.div
            initial={{ opacity: 0 }}
            animate={titleInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
            style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}
          >
            <div style={{ display: 'flex', gap: 3 }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <span key={s} style={{ fontSize: 18, color: C.accent }}>★</span>
              ))}
            </div>
            <span style={{ fontSize: 14, color: C.textMuted }}>4,9 / 5 · 218 avis Google</span>
          </motion.div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 20,
          }}
        >
          {testimonials.map((t, i) => (
            <TestimonialCard
              key={i}
              text={t.text}
              author={t.author}
              role={t.role}
              rating={t.rating}
              delay={i * 0.09}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   FAQ
───────────────────────────────────────────── */
type FAQItemProps = {
  question: string
  answer: string
  index: number
}

function FAQItem({ question, answer, index }: FAQItemProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      style={{ borderBottom: `1px solid ${C.border}` }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '24px 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 16,
          textAlign: 'left',
        }}
      >
        <span
          style={{
            fontFamily: 'Oswald, sans-serif',
            fontSize: 'clamp(14px, 2vw, 17px)',
            fontWeight: 500,
            color: open ? C.accent : C.text,
            letterSpacing: 0.5,
            textTransform: 'uppercase',
            flex: 1,
            transition: 'color 0.2s',
          }}
        >
          {question}
        </span>
        <motion.div
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.25 }}
          style={{
            width: 28,
            height: 28,
            border: `1px solid ${open ? C.accent : C.borderLight}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: open ? C.accent : C.textMuted,
            fontSize: 18,
            flexShrink: 0,
            transition: 'border-color 0.2s, color 0.2s',
          }}
        >
          +
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <p
              style={{
                fontSize: 14,
                color: C.textMuted,
                lineHeight: 1.8,
                paddingBottom: 24,
                maxWidth: 740,
              }}
            >
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function FAQ() {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const titleInView = useInView(titleRef, { once: true })

  const faqs = [
    {
      question: 'Comment obtenir un devis gratuit ?',
      answer:
        "Remplissez le formulaire de contact ci-dessous ou appelez-nous directement au 04 78 XX XX XX. Un chef de chantier vous rappelle sous 24h pour planifier une visite technique gratuite. Le devis détaillé est remis sous 48h après la visite, sans engagement de votre part.",
    },
    {
      question: "Quelle est votre zone d\'intervention ?",
      answer:
        "Nous intervenons principalement sur Lyon et son agglomération (métropole du Grand Lyon), le département du Rhône (69), le nord de l'Isère (Bourgoin-Jallieu, La Tour-du-Pin, Vienne) et le sud de l'Ain. Pour les gros chantiers industriels ou les copropriétés importantes, nous étudions toute demande hors de cette zone.",
    },
    {
      question: 'Êtes-vous couverts par une assurance décennale ?',
      answer:
        "Oui, Bâtisseurs Durand est assurée en responsabilité décennale (garantie de 10 ans sur les ouvrages réalisés) et en responsabilité civile professionnelle. Nous sommes également qualifiés Qualibat RGE pour les travaux d'isolation thermique par l'extérieur, ce qui vous permet de bénéficier des aides MaPrimeRénov' et de l'Éco-PTZ.",
    },
    {
      question: 'Faut-il un permis de construire pour mon projet ?',
      answer:
        "Cela dépend de la nature et de l'ampleur des travaux. Une extension de moins de 20 m² en zone non protégée nécessite simplement une déclaration préalable. Au-delà, un permis de construire est requis. Notre bureau d'étude interne vous aide à constituer le dossier administratif et à le déposer en mairie, le tout inclus dans notre accompagnement.",
    },
    {
      question: "Quel est le délai moyen d\'un chantier de maçonnerie ?",
      answer:
        "Le délai varie selon l'envergure des travaux. Une ouverture de mur porteur se réalise en 1 à 2 jours. Une rénovation de salle de bain prend 5 à 7 jours. Un ravalement de façade d'un immeuble R+4 demande 4 à 6 semaines. Une extension de maison de 40 m² représente 8 à 12 semaines, fondations et finitions incluses. Nous vous communiquons un planning détaillé avant tout démarrage.",
    },
  ]

  return (
    <section id="faq" className="section-padding" style={{ background: C.bg }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 72 }}>
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 11,
              letterSpacing: 4,
              textTransform: 'uppercase',
              color: C.accent,
              fontWeight: 600,
            }}
          >
            Questions fréquentes
          </span>
          <h2
            ref={titleRef}
            style={{
              fontFamily: 'Oswald, sans-serif',
              fontSize: 'clamp(28px, 4.5vw, 56px)',
              fontWeight: 700,
              color: C.text,
              textTransform: 'uppercase',
              marginTop: 12,
              letterSpacing: 1,
            }}
          >
            Vos questions,{' '}
            <span style={{ color: C.accent }}>nos réponses</span>
          </h2>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={titleInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          style={{ borderTop: `1px solid ${C.border}` }}
        >
          {faqs.map((faq, i) => (
            <FAQItem key={i} question={faq.question} answer={faq.answer} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   CONTACT FORM
───────────────────────────────────────────── */
function ContactForm() {
  const [form, setForm] = useState({
    nom: '',
    tel: '',
    email: '',
    ville: '',
    typeWorkOrder: '',
    description: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    await new Promise((r) => setTimeout(r, 1800))
    setStatus('success')
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: C.bgCard,
    border: `1px solid ${C.border}`,
    borderRadius: 0,
    color: C.text,
    fontSize: 14,
    padding: '14px 16px',
    outline: 'none',
    fontFamily: 'Inter, sans-serif',
    transition: 'border-color 0.2s',
  }

  const labelStyle: React.CSSProperties = {
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: C.textMuted,
    fontWeight: 600,
    display: 'block',
    marginBottom: 8,
    fontFamily: 'Inter, sans-serif',
  }

  return (
    <section ref={ref} id="contact" className="section-padding" style={{ background: C.bgAlt }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div className="grid-contact">
          {/* Left: contact info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <span
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 11,
                letterSpacing: 4,
                textTransform: 'uppercase',
                color: C.accent,
                fontWeight: 600,
              }}
            >
              Contactez-nous
            </span>
            <h2
              style={{
                fontFamily: 'Oswald, sans-serif',
                fontSize: 'clamp(28px, 4vw, 50px)',
                fontWeight: 700,
                color: C.text,
                textTransform: 'uppercase',
                marginTop: 14,
                marginBottom: 28,
                letterSpacing: 1,
                lineHeight: 1.1,
              }}
            >
              Devis gratuit{' '}
              <span style={{ color: C.accent }}>en 48h</span>
            </h2>
            <p style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.8, marginBottom: 48 }}>
              Décrivez votre projet, nous vous rappelons rapidement pour organiser une visite technique
              sans engagement. Chaque devis est détaillé, transparent et gratuit.
            </p>

            {[
              { icon: '📞', label: 'Téléphone', value: '04 78 XX XX XX', sub: 'Du lundi au vendredi, 8h–18h' },
              { icon: '✉️', label: 'E-mail', value: 'contact@batisseurs-durand.fr', sub: 'Réponse sous 24h' },
              { icon: '📍', label: 'Siège social', value: '14 rue des Bâtisseurs, 69009 Lyon', sub: 'Lyon 9e — France' },
            ].map((item) => (
              <div
                key={item.label}
                style={{ display: 'flex', gap: 18, marginBottom: 28, alignItems: 'flex-start' }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    background: 'rgba(200,165,58,0.1)',
                    border: `1px solid rgba(200,165,58,0.25)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <TemplateIcon emoji={item.icon} size={18} />
                </div>
                <div>
                  <div style={{ fontSize: 11, color: C.textMuted, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600, marginBottom: 4 }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: 15, color: C.text, fontWeight: 500 }}>{item.value}</div>
                  <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{item.sub}</div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Right: form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    background: C.bgCard,
                    border: `1px solid ${C.accent}`,
                    padding: '60px 40px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ marginBottom: 20 }}><CheckCircle2 style={{ width: 56, height: 56 }} /></div>
                  <h3
                    style={{
                      fontFamily: 'Oswald, sans-serif',
                      fontSize: 26,
                      fontWeight: 700,
                      color: C.accent,
                      textTransform: 'uppercase',
                      marginBottom: 12,
                      letterSpacing: 1,
                    }}
                  >
                    Demande envoyée !
                  </h3>
                  <p style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.7 }}>
                    Merci pour votre message. Un chef de chantier vous contactera sous 24 à 48h pour organiser
                    la visite technique gratuite.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  style={{
                    background: C.bgCard,
                    border: `1px solid ${C.border}`,
                    padding: '40px 36px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 20,
                  }}
                >
                  <div className="grid-form-2col">
                    <div>
                      <label style={labelStyle} htmlFor="contact-nom">Nom complet *</label>
                      <input
                        id="contact-nom"
                        name="nom"
                        type="text"
                        required
                        placeholder="Jean Dupont"
                        value={form.nom}
                        onChange={handleChange}
                        style={inputStyle}
                        onFocus={(e) => (e.target.style.borderColor = C.accent)}
                        onBlur={(e) => (e.target.style.borderColor = C.border)}
                      />
                    </div>
                    <div>
                      <label style={labelStyle} htmlFor="contact-tel">Téléphone *</label>
                      <input
                        id="contact-tel"
                        name="tel"
                        type="tel"
                        required
                        placeholder="06 XX XX XX XX"
                        value={form.tel}
                        onChange={handleChange}
                        style={inputStyle}
                        onFocus={(e) => (e.target.style.borderColor = C.accent)}
                        onBlur={(e) => (e.target.style.borderColor = C.border)}
                      />
                    </div>
                  </div>

                  <div className="grid-form-2col">
                    <div>
                      <label style={labelStyle} htmlFor="contact-email">E-mail *</label>
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        required
                        placeholder="jean@exemple.fr"
                        value={form.email}
                        onChange={handleChange}
                        style={inputStyle}
                        onFocus={(e) => (e.target.style.borderColor = C.accent)}
                        onBlur={(e) => (e.target.style.borderColor = C.border)}
                      />
                    </div>
                    <div>
                      <label style={labelStyle} htmlFor="contact-ville">Ville des travaux *</label>
                      <input
                        id="contact-ville"
                        name="ville"
                        type="text"
                        required
                        placeholder="Lyon, Villeurbanne…"
                        value={form.ville}
                        onChange={handleChange}
                        style={inputStyle}
                        onFocus={(e) => (e.target.style.borderColor = C.accent)}
                        onBlur={(e) => (e.target.style.borderColor = C.border)}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle} htmlFor="contact-type">Type de travaux *</label>
                    <select
                      id="contact-type"
                      name="typeWorkOrder"
                      required
                      value={form.typeWorkOrder}
                      onChange={handleChange}
                      style={{ ...inputStyle, cursor: 'pointer' }}
                      onFocus={(e) => (e.target.style.borderColor = C.accent)}
                      onBlur={(e) => (e.target.style.borderColor = C.border)}
                    >
                      <option value="" disabled>Sélectionnez une prestation…</option>
                      <option value="maconnerie">Maçonnerie générale</option>
                      <option value="ravalement">Ravalement & ITE</option>
                      <option value="carrelage">Carrelage & faïence</option>
                      <option value="chape">Chape & dallage</option>
                      <option value="etancheite">Étanchéité</option>
                      <option value="demolition">Démolition & dépose</option>
                      <option value="autre">Autre / multi-lots</option>
                    </select>
                  </div>

                  <div>
                    <label style={labelStyle} htmlFor="contact-description">Description du projet</label>
                    <textarea
                      id="contact-description"
                      name="description"
                      rows={5}
                      placeholder="Décrivez brièvement vos travaux (surface, nature, délai souhaité…)"
                      value={form.description}
                      onChange={handleChange}
                      style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                      onFocus={(e) => (e.target.style.borderColor = C.accent)}
                      onBlur={(e) => (e.target.style.borderColor = C.border)}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    style={{
                      background: status === 'loading' ? C.accentDark : C.accent,
                      color: C.bg,
                      border: 'none',
                      padding: '18px 32px',
                      fontFamily: 'Oswald, sans-serif',
                      fontWeight: 700,
                      fontSize: 15,
                      letterSpacing: 3,
                      textTransform: 'uppercase',
                      cursor: status === 'loading' ? 'wait' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 12,
                      transition: 'background 0.25s',
                      width: '100%',
                    }}
                    onMouseEnter={(e) => {
                      if (status !== 'loading') e.currentTarget.style.background = '#d9b545'
                    }}
                    onMouseLeave={(e) => {
                      if (status !== 'loading') e.currentTarget.style.background = C.accent
                    }}
                  >
                    {status === 'loading' ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          style={{
                            width: 16,
                            height: 16,
                            border: `2px solid rgba(0,0,0,0.3)`,
                            borderTop: `2px solid ${C.bg}`,
                            borderRadius: '50%',
                          }}
                        />
                        Envoi en cours…
                      </>
                    ) : (
                      'Envoyer ma demande de devis'
                    )}
                  </button>

                  <p style={{ fontSize: 11, color: C.textMuted, textAlign: 'center', lineHeight: 1.6 }}>
                    En envoyant ce formulaire, vous acceptez que vos données soient utilisées pour vous
                    recontacter dans le cadre de votre demande. Pas de démarchage commercial.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────── */
function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer style={{ background: '#080a07', borderTop: `1px solid ${C.border}`, padding: '64px 40px 32px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Top row */}
        <div className="grid-footer">
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  background: C.accent,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'Oswald, sans-serif',
                  fontWeight: 700,
                  fontSize: 16,
                  color: C.bg,
                  flexShrink: 0,
                }}
              >
                BD
              </div>
              <div
                style={{
                  fontFamily: 'Oswald, sans-serif',
                  fontSize: 15,
                  fontWeight: 600,
                  color: C.text,
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                }}
              >{fd?.businessName ?? "Bâtisseurs Durand"}</div>
            </div>
            <p style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.8, maxWidth: 280, marginBottom: 24 }}>
              Votre partenaire maçonnerie depuis 2002 sur Lyon, le Rhône et l'Isère.
              Qualibat RGE · Garantie décennale · 1 840+ chantiers réalisés.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {['f', 'in', '▶'].map((icon) => (
                <a
                  key={icon}
                  href={
                    icon === 'f'
                      ? 'https://facebook.com'
                      : icon === 'in'
                      ? 'https://linkedin.com'
                      : 'https://youtube.com'
                  }
                  style={{
                    width: 34,
                    height: 34,
                    border: `1px solid ${C.borderLight}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: C.textMuted,
                    textDecoration: 'none',
                    fontSize: 13,
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget
                    el.style.borderColor = C.accent
                    el.style.color = C.accent
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget
                    el.style.borderColor = C.borderLight
                    el.style.color = C.textMuted
                  }}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Services column */}
          <div>
            <h4
              style={{
                fontFamily: 'Oswald, sans-serif',
                fontSize: 13,
                fontWeight: 600,
                color: C.text,
                letterSpacing: 3,
                textTransform: 'uppercase',
                marginBottom: 20,
              }}
            >
              Services
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['Maçonnerie générale', 'Ravalement & ITE', 'Carrelage', 'Chape & dallage', 'Étanchéité', 'Démolition'].map((s) => (
                <a
                  key={s}
                  href="#services"
                  style={{ fontSize: 13, color: C.textMuted, textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => ((e.target as HTMLElement).style.color = C.accent)}
                  onMouseLeave={(e) => ((e.target as HTMLElement).style.color = C.textMuted)}
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Zones column */}
          <div>
            <h4
              style={{
                fontFamily: 'Oswald, sans-serif',
                fontSize: 13,
                fontWeight: 600,
                color: C.text,
                letterSpacing: 3,
                textTransform: 'uppercase',
                marginBottom: 20,
              }}
            >
              Zones
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['Lyon & Métropole', 'Villeurbanne', 'Caluire-et-Cuire', 'Vienne', 'Bourgoin-Jallieu', 'Villefranche-sur-Saône'].map((z) => (
                <span key={z} style={{ fontSize: 13, color: C.textMuted }}>{z}</span>
              ))}
            </div>
          </div>

          {/* Legal column */}
          <div>
            <h4
              style={{
                fontFamily: 'Oswald, sans-serif',
                fontSize: 13,
                fontWeight: 600,
                color: C.text,
                letterSpacing: 3,
                textTransform: 'uppercase',
                marginBottom: 20,
              }}
            >
              Informations
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['Mentions légales', 'Politique de confidentialité', 'CGV', 'Plan du site'].map((l) => (
                <a
                  key={l}
                  href="#contact"
                  style={{ fontSize: 13, color: C.textMuted, textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => ((e.target as HTMLElement).style.color = C.accent)}
                  onMouseLeave={(e) => ((e.target as HTMLElement).style.color = C.textMuted)}
                >
                  {l}
                </a>
              ))}
              <div style={{ marginTop: 16, padding: '12px 16px', background: C.bgCard, border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 10, color: C.textMuted, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>Numéro SIRET</div>
                <div style={{ fontSize: 13, color: C.text, fontFamily: 'Oswald, sans-serif', letterSpacing: 1 }}>502 XXX XXX 00012</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: `1px solid ${C.border}`,
            paddingTop: 28,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 20,
            flexWrap: 'wrap',
          }}
        >
          <p style={{ fontSize: 12, color: C.textMuted }}>
            © {currentYear} Bâtisseurs Durand SARL — Tous droits réservés. Maçonnerie Lyon.
          </p>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            {['Qualibat RGE', 'Décennale', '4.9/5 Google'].map((badge) => (
              <span
                key={badge}
                style={{
                  fontSize: 11,
                  color: C.textMuted,
                  padding: '4px 10px',
                  border: `1px solid ${C.border}`,
                  letterSpacing: 0.5,
                }}
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ─────────────────────────────────────────────
   PAGE EXPORT
───────────────────────────────────────────── */

// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function Impact213Page() {
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
    <>
      <FontLoader />
      <Nav />
      <main>
        <Hero />
        <StatsStrip />
        <Services />
        <Process />
        <APropos />
        <Realisations />
        <Team />
        <Testimonials />
        <FAQ />
        <ContactForm />
      </main>
      <Footer />
    </>
  )
}
