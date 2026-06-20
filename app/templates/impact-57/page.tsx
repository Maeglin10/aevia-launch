'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import {
  C,
  PROJECTS,
  SERVICES,
  STATS,
  MaskedTitle,
  ProjectRow,
  Reveal,
  StyleInjector,
  CustomCursor,
} from './shared';

// ── Section 2: Stats Ticker ──────────────────────────────────────────────────
function StatsTicker() {
  const items = [...STATS, ...STATS, ...STATS, ...STATS];

  return (
    <section
      style={{
        background: C.bg,
        borderTop: `1px solid ${C.border}`,
        borderBottom: `1px solid ${C.border}`,
        overflow: 'hidden',
        padding: '3rem 0',
      }}
    >
      <StyleInjector />
      {/* Row 1: left to right */}
      <div style={{ overflow: 'hidden', marginBottom: '2rem' }}>
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          style={{ display: 'flex', gap: '6rem', width: 'max-content' }}
        >
          {items.map((stat, i) => (
            <div
              key={i}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '200px' }}
            >
              <span
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 'clamp(3rem, 6vw, 5rem)',
                  fontWeight: 700,
                  color: C.accent,
                  letterSpacing: '-0.04em',
                  lineHeight: 1,
                }}
              >
                {stat.n}
              </span>
              <span
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '0.6rem',
                  color: C.textMuted,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  marginTop: '0.5rem',
                }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Row 2: right to left */}
      <div style={{ overflow: 'hidden' }}>
        <motion.div
          animate={{ x: ['-50%', '0%'] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
          style={{ display: 'flex', gap: '6rem', width: 'max-content' }}
        >
          {items.map((stat, i) => (
            <div
              key={i}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '200px' }}
            >
              <span
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                  fontWeight: 700,
                  color: C.textDim,
                  letterSpacing: '-0.04em',
                  lineHeight: 1,
                }}
              >
                {stat.n}
              </span>
              <span
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '0.6rem',
                  color: C.textDim,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  marginTop: '0.5rem',
                }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ── Section 3: Selected Work Grid ────────────────────────────────────────────
function SelectedWork() {
  return (
    <section style={{ padding: '8rem 3rem', background: C.bg }}>
      <Reveal>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '4rem',
            borderBottom: `1px solid ${C.border}`,
            paddingBottom: '2rem',
          }}
        >
          <h2
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              fontWeight: 500,
              color: C.textMuted,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}
          >
            Selected Work
          </h2>
          <Link
            href="/templates/impact-57/work"
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '0.7rem',
              color: C.accent,
              textDecoration: 'none',
              letterSpacing: '0.1em',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            Voir tout le travail <ArrowRight size={12} />
          </Link>
        </div>
      </Reveal>

      <div>
        {PROJECTS.map((project, i) => (
          <ProjectRow key={project.id} project={project} index={i} />
        ))}
      </div>

      <Reveal delay={0.3}>
        <div style={{ marginTop: '4rem', display: 'flex', justifyContent: 'center' }}>
          <Link
            href="/templates/impact-57/work"
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '0.75rem',
              color: C.text,
              textDecoration: 'none',
              letterSpacing: '0.12em',
              padding: '1rem 2.5rem',
              border: `1px solid ${C.border}`,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              transition: 'all 0.3s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = C.accent;
              e.currentTarget.style.color = C.accent;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = C.border;
              e.currentTarget.style.color = C.text;
            }}
          >
            View all work <ArrowRight size={12} />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}

// ── Section 4: Services ──────────────────────────────────────────────────────
function ServicesSection() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <section
      style={{
        padding: '8rem 3rem',
        background: C.bgLight,
        borderTop: `1px solid ${C.border}`,
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '4rem', marginBottom: '4rem' }}>
          <Reveal>
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: '0.65rem',
                color: C.textMuted,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
              }}
            >
              Services
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <p
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(1.2rem, 2vw, 1.5rem)',
                color: C.textMuted,
                lineHeight: 1.6,
                maxWidth: '55ch',
              }}
            >
              Chaque discipline au service d'une seule obsession : créer des marques dont on se souvient.
            </p>
          </Reveal>
        </div>

        <div style={{ borderTop: `1px solid ${C.border}` }}>
          {SERVICES.map((service, i) => {
            const isOpen = expanded === service.n;
            return (
              <Reveal key={service.n} delay={i * 0.08}>
                <div
                  onClick={() => setExpanded(isOpen ? null : service.n)}
                  style={{
                    borderBottom: `1px solid ${C.border}`,
                    padding: '2.5rem 0',
                    cursor: 'pointer',
                  }}
                >
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '5rem 1fr auto',
                      alignItems: 'center',
                      gap: '2rem',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: '0.7rem',
                        color: C.textDim,
                        letterSpacing: '0.1em',
                      }}
                    >
                      {service.n}
                    </span>
                    <h3
                      style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                        fontWeight: 700,
                        color: isOpen ? C.accent : C.text,
                        letterSpacing: '-0.02em',
                        transition: 'color 0.3s',
                      }}
                    >
                      {service.title}
                    </h3>
                    <motion.div
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.3 }}
                      style={{
                        width: '2rem',
                        height: '2rem',
                        border: `1px solid ${isOpen ? C.accent : C.border}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isOpen ? C.accent : C.textMuted,
                        fontSize: '1.2rem',
                        flexShrink: 0,
                        transition: 'border-color 0.3s, color 0.3s',
                      }}
                    >
                      +
                    </motion.div>
                  </div>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        style={{ overflow: 'hidden' }}
                      >
                        <p
                          style={{
                            fontFamily: "'Space Mono', monospace",
                            fontSize: '0.85rem',
                            color: C.textMuted,
                            lineHeight: 1.8,
                            paddingTop: '1.5rem',
                            paddingLeft: '7rem',
                            maxWidth: '60ch',
                          }}
                        >
                          {service.desc}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── Section 5: Process ───────────────────────────────────────────────────────
const PROCESS_STEPS = [
  {
    n: '01',
    title: 'Discover',
    sub: 'Comprendre votre univers',
    desc: "Nous plongeons dans votre marché, vos concurrents, votre culture interne. Pas de brief générique — une immersion totale pour saisir ce qui vous rend unique et ce qui manque à votre catégorie.",
  },
  {
    n: '02',
    title: 'Concept',
    sub: "Architecturer l’idée",
    desc: "L'idée directrice prend forme. Moodboards, direction artistique, systèmes typographiques — tout est exploré, questionné, raffiné jusqu'à ce que le concept soit irréfutable.",
  },
  {
    n: '03',
    title: 'Build',
    sub: "Exécuter à l'obsession",
    desc: "Chaque pixel, chaque image, chaque mouvement est fabriqué avec une précision obsessionnelle. Notre process est itératif, transparent, et toujours orienté vers l'excellence.",
  },
  {
    n: '04',
    title: 'Launch',
    sub: 'Activer & mesurer',
    desc: "Le lancement n'est pas une fin — c'est un départ. Nous vous accompagnons dans le déploiement de votre nouvelle identité et mesurons son impact sur vos cibles.",
  },
];

function ProcessSection() {
  return (
    <section
      style={{
        padding: '8rem 3rem',
        background: C.bg,
        borderTop: `1px solid ${C.border}`,
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Reveal>
          <h2
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(0.8rem, 1.2vw, 1rem)',
              fontWeight: 500,
              color: C.textMuted,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginBottom: '5rem',
            }}
          >
            Processus
          </h2>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2px' }}>
          {PROCESS_STEPS.map((step, i) => (
            <Reveal key={step.n} delay={i * 0.1}>
              <div
                style={{
                  background: C.bgCard,
                  padding: '3rem',
                  border: `1px solid ${C.border}`,
                  minHeight: '280px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = C.accent;
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = C.border;
                }}
              >
                {/* Background number */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-1rem',
                    right: '1.5rem',
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '8rem',
                    fontWeight: 700,
                    color: C.bgLight,
                    lineHeight: 1,
                    userSelect: 'none',
                    pointerEvents: 'none',
                  }}
                >
                  {step.n}
                </div>

                <div style={{ position: 'relative', zIndex: 1 }}>
                  <span
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: '0.6rem',
                      color: C.accent,
                      letterSpacing: '0.15em',
                    }}
                  >
                    {step.n}
                  </span>
                  <h3
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
                      fontWeight: 700,
                      color: C.text,
                      letterSpacing: '-0.02em',
                      marginTop: '0.75rem',
                    }}
                  >
                    {step.title}
                  </h3>
                  <div
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: '0.65rem',
                      color: C.accent,
                      marginTop: '0.25rem',
                      letterSpacing: '0.05em',
                    }}
                  >
                    · {step.sub}
                  </div>
                </div>

                <p
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: '0.75rem',
                    color: C.textMuted,
                    lineHeight: 1.8,
                    marginTop: '2rem',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  {step.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Section 6: Testimonials ──────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    quote: "MASK_UNIT a transformé notre identité visuelle en arme stratégique.",
    name: "Sophie Martin",
    title: "CMO, Balenciaga France",
  },
  {
    quote: "Un niveau d'exigence rare. Chaque pixel a du sens.",
    name: "Alexandre Dubois",
    title: "Brand Director, Nike EMEA",
  },
  {
    quote: "Notre campagne Dior a dépassé tous nos KPIs grâce à leur vision.",
    name: "Marie Lefebvre",
    title: "VP Marketing, Dior Beauty",
  },
];

function TestimonialsSection() {
  return (
    <section
      style={{
        padding: '8rem 3rem',
        background: C.bgLight,
        borderTop: `1px solid ${C.border}`,
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Reveal>
          <h2
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(0.8rem, 1.2vw, 1rem)',
              fontWeight: 500,
              color: C.textMuted,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginBottom: '5rem',
            }}
          >
            Ce qu'ils disent
          </h2>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={i} delay={i * 0.12}>
              <div
                style={{
                  background: C.bgCard,
                  border: `1px solid ${C.border}`,
                  padding: '3rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '280px',
                  transition: 'border-color 0.3s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.accent; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: '4rem',
                      color: C.accent,
                      lineHeight: 0.8,
                      marginBottom: '1.5rem',
                    }}
                  >
                    "
                  </div>
                  <p
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: 'clamp(1rem, 1.5vw, 1.3rem)',
                      color: C.text,
                      lineHeight: 1.5,
                      fontWeight: 500,
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {t.quote}
                  </p>
                </div>
                <div style={{ marginTop: '2rem', borderTop: `1px solid ${C.border}`, paddingTop: '1.5rem' }}>
                  <div
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: '0.9rem',
                      color: C.text,
                      fontWeight: 600,
                    }}
                  >
                    {t.name}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: '0.6rem',
                      color: C.textMuted,
                      marginTop: '0.25rem',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {t.title}
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

// ── Section 7: Studio Teaser ─────────────────────────────────────────────────
function StudioTeaser() {
  return (
    <section
      style={{
        padding: '8rem 3rem',
        background: C.bg,
        borderTop: `1px solid ${C.border}`,
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '6rem',
          alignItems: 'center',
        }}
      >
        {/* Left: text block */}
        <div>
          <Reveal>
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: '0.65rem',
                color: C.textMuted,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '2rem',
              }}
            >
              Le Studio
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                fontWeight: 700,
                color: C.text,
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
                marginBottom: '2rem',
              }}
            >
              Nous sommes une équipe d'obsédés.{' '}
              <span style={{ color: C.accent }}>12 ans</span> à repousser les limites du possible.
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: '0.8rem',
                color: C.textMuted,
                lineHeight: 1.9,
                marginBottom: '3rem',
              }}
            >
              Fondé à Paris en 2012, MASK_UNIT est un studio de design radical spécialisé dans les identités qui marquent les esprits. 4 personnes. 180+ projets. Une seule règle : refuser le médiocre.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div style={{ display: 'flex', gap: '1px' }}>
              <div
                style={{
                  width: '3rem',
                  height: '2px',
                  background: C.accent,
                }}
              />
              <div
                style={{
                  width: '1rem',
                  height: '2px',
                  background: C.textDim,
                }}
              />
            </div>
          </Reveal>
          <Reveal delay={0.4}>
            <Link
              href="/templates/impact-57/studio"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginTop: '2.5rem',
                fontFamily: "'Space Mono', monospace",
                fontSize: '0.7rem',
                color: C.accent,
                textDecoration: 'none',
                letterSpacing: '0.1em',
              }}
            >
              Découvrir le studio <ArrowRight size={12} />
            </Link>
          </Reveal>
        </div>

        {/* Right: photo */}
        <Reveal delay={0.2}>
          <div
            style={{
              position: 'relative',
              aspectRatio: '4/5',
              overflow: 'hidden',
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop"
              alt="MASK_UNIT studio"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'grayscale(30%)',
              }}
            />
            {/* Accent corner detail */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: `linear-gradient(90deg, ${C.accent} 0%, transparent 100%)`,
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                background: C.bg,
                padding: '0.75rem 1.25rem',
                fontFamily: "'Space Mono', monospace",
                fontSize: '0.55rem',
                color: C.accent,
                letterSpacing: '0.15em',
              }}
            >
              PARIS · 2012
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ── Section 8: CTA Banner ────────────────────────────────────────────────────
function CTABanner() {
  return (
    <section
      style={{
        background: C.bgLight,
        borderTop: `1px solid ${C.border}`,
        borderBottom: `1px solid ${C.border}`,
        padding: '8rem 3rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background text watermark */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        <div
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(8rem, 20vw, 18rem)',
            fontWeight: 700,
            color: C.bgCard,
            letterSpacing: '-0.05em',
            lineHeight: 1,
          }}
        >
          Q3
        </div>
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <Reveal>
          <div
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(3rem, 8vw, 7rem)',
              fontWeight: 700,
              color: C.accent,
              letterSpacing: '-0.04em',
              lineHeight: 1,
              marginBottom: '1.5rem',
            }}
          >
            DISPONIBLE Q3 2025
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <p
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(1rem, 2vw, 1.4rem)',
              color: C.textMuted,
              marginBottom: '3rem',
              letterSpacing: '-0.01em',
            }}
          >
            Prêt à créer quelque chose d'exceptionnel ?
          </p>
        </Reveal>
        <Reveal delay={0.3}>
          <Link
            href="/templates/impact-57/contact"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '1rem',
              background: C.accent,
              color: C.bg,
              padding: '1.25rem 3rem',
              fontFamily: "'Space Mono', monospace",
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textDecoration: 'none',
              textTransform: 'uppercase',
              transition: 'background 0.3s, transform 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = C.accentAlt;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = C.accent;
            }}
          >
            Démarrer un projet <ArrowRight size={14} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function MaskUnitHome() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroScale = useTransform(heroScroll, [0, 1], [1, 1.1]);
  const heroOpacity = useTransform(heroScroll, [0, 0.7], [1, 0]);

  return (
    <div style={{ background: C.bg, minHeight: '100vh' }}>
      <CustomCursor />
      <StyleInjector />

      {/* ── Hero (preserved exactly) ──────────────────────────────────────── */}
      <section
        ref={heroRef}
        style={{
          height: 'calc(100vh - 60px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '3rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Massive background text */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            scale: heroScale,
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(8rem, 22vw, 20rem)',
              fontWeight: 700,
              color: '#0A0A0A',
              letterSpacing: '-0.04em',
              lineHeight: 0.95,
              textAlign: 'center',
            }}
          >
            MASK
            <br />
            UNIT
          </div>
        </motion.div>

        {/* Top left counter */}
        <div style={{ position: 'absolute', top: '2rem', left: '3rem' }}>
          <div
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '0.65rem',
              color: C.textDim,
              letterSpacing: '0.2em',
            }}
          >
            CREATIVE STUDIO
          </div>
          <div
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '0.6rem',
              color: C.textDim,
              marginTop: '0.25rem',
            }}
          >
            EST. 2012 · PARIS
          </div>
        </div>

        {/* Top right */}
        <div style={{ position: 'absolute', top: '2rem', right: '3rem', textAlign: 'right' }}>
          <div
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '0.65rem',
              color: C.textDim,
            }}
          >
            AWWWARDS SOTD ×38
          </div>
        </div>

        {/* Bottom content */}
        <motion.div style={{ position: 'relative', zIndex: 1, opacity: heroOpacity }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '4rem',
              alignItems: 'flex-end',
            }}
          >
            <div>
              <h1
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 'clamp(2rem, 4.5vw, 4rem)',
                  fontWeight: 700,
                  lineHeight: 1.2,
                  letterSpacing: '-0.03em',
                  color: C.text,
                  marginBottom: '1.5rem',
                }}
              >
                <MaskedTitle text="We Build" delay={0.3} />
                <MaskedTitle text="Brands That" delay={0.4} />
                <span style={{ color: C.accent }}>
                  <MaskedTitle text="Break Rules." delay={0.5} />
                </span>
              </h1>
              <p
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '0.85rem',
                  color: C.textMuted,
                  lineHeight: 1.8,
                  maxWidth: '45ch',
                }}
              >
                Studio créatif spécialisé dans les identités de marque disruptives, le motion design et les expériences digitales immersives.
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  alignItems: 'flex-end',
                }}
              >
                <Link
                  href="/templates/impact-57/work"
                  style={{
                    background: C.accent,
                    color: C.bg,
                    border: 'none',
                    padding: '1rem 2.5rem',
                    fontFamily: "'Space Mono', monospace",
                    fontSize: '0.75rem',
                    letterSpacing: '0.1em',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textDecoration: 'none',
                    transition: 'background 0.3s',
                    display: 'inline-block',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = C.accentAlt)}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = C.accent)}
                >
                  SEE OUR WORK →
                </Link>
                <span
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: '0.6rem',
                    color: C.textDim,
                  }}
                >
                  Available for Q3 2025
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Additional Sections ───────────────────────────────────────────── */}
      <StatsTicker />
      <SelectedWork />
      <ServicesSection />
      <ProcessSection />
      <TestimonialsSection />
      <StudioTeaser />
      <CTABanner />
    </div>
  );
}
