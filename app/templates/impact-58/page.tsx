'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Play, X, ArrowRight, Award } from 'lucide-react';
import {
  C,
  PROJECTS,
  SERVICES,
  AWARDS_LIST,
  SkewProjectItem,
  DistortedTitle,
  Reveal,
  StyleInjector,
} from './shared';

// ── Showreel Modal ─────────────────────────────────────────────────────────────
function ShowreelModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(7,7,10,0.96)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        style={{ width: '100%', maxWidth: '1080px', position: 'relative' }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '-3rem',
            right: 0,
            background: 'none',
            border: 'none',
            color: C.textMuted,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontFamily: "'Syne Mono', monospace",
            fontSize: '0.65rem',
            letterSpacing: '0.1em',
          }}
        >
          <X size={14} /> FERMER
        </button>

        {/* Simulated player */}
        <div
          style={{
            width: '100%',
            aspectRatio: '16/9',
            background: `linear-gradient(135deg, #0a0a12 0%, #1a1028 40%, ${C.violetDim}55 100%)`,
            border: `1px solid ${C.borderBright}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Scanlines decoration */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, ${C.violet}06 2px, ${C.violet}06 4px)`,
              pointerEvents: 'none',
            }}
          />
          {/* Center play icon (disabled state) */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', zIndex: 1 }}>
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                border: `2px solid ${C.violet}60`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Play size={24} fill={C.violet} color={C.violet} style={{ marginLeft: '3px' }} />
            </div>
            <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: '0.6rem', color: C.textDim, letterSpacing: '0.15em' }}>
              SKEW OS — SHOWREEL 2024
            </div>
          </div>
          {/* Corner labels */}
          <div style={{ position: 'absolute', top: '1rem', left: '1.5rem', fontFamily: "'Syne Mono', monospace", fontSize: '0.5rem', color: C.textDim, letterSpacing: '0.1em' }}>
            REC ●
          </div>
          <div style={{ position: 'absolute', bottom: '1rem', right: '1.5rem', fontFamily: "'Syne Mono', monospace", fontSize: '0.5rem', color: C.textDim }}>
            02:47
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Stats Bar ──────────────────────────────────────────────────────────────────
const STATS = [
  { n: '5 ans', label: "d'existence" },
  { n: '80+', label: 'films livrés' },
  { n: '23', label: 'récompenses' },
  { n: '4', label: 'continents' },
];

// ── Clients ────────────────────────────────────────────────────────────────────
const CLIENTS = ['Adidas', 'Apple', 'Vuitton', 'Spotify', 'Balenciaga', 'Hermès'];

// ── Main Component ─────────────────────────────────────────────────────────────
export default function SkewOSHome() {
  const [showreel, setShowreel] = useState(false);
  const [hoveredService, setHoveredService] = useState<string | null>(null);
  const [hoveredClient, setHoveredClient] = useState<string | null>(null);

  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, margin: '-60px' });

  return (
    <>
      <StyleInjector />
      <div style={{ background: C.bg, minHeight: '100vh', color: C.text }}>

        {/* ── Hero (preserved) ──────────────────────────────────────────── */}
        <section
          style={{
            minHeight: 'calc(100vh - 60px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '3rem',
            paddingTop: '8rem',
            position: 'relative',
          }}
        >
          {/* Floating label */}
          <div style={{ position: 'absolute', top: '2rem', right: '3rem' }}>
            <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: '0.6rem', color: C.textDim }}>
              MOTION DESIGN STUDIO · PARIS
            </div>
          </div>

          <div
            style={{
              position: 'relative',
              zIndex: 1,
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              gap: '3rem',
              alignItems: 'flex-end',
            }}
          >
            <DistortedTitle />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              style={{ maxWidth: '300px', paddingBottom: '1rem' }}
            >
              <p style={{ fontSize: '0.9rem', color: C.textMuted, lineHeight: 1.8, marginBottom: '2rem' }}>
                Studio de motion design & réalisation. Nous créons des films de marque, des expériences visuelles et des installations qui perturbent l'attention.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <Link
                  href="/templates/impact-58/work"
                  style={{
                    background: C.violet,
                    color: C.text,
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    fontFamily: "'Syne Mono', monospace",
                    fontSize: '0.65rem',
                    letterSpacing: '0.1em',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    transition: 'background 0.3s',
                    display: 'inline-block',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = C.violetLight)}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = C.violet)}
                >
                  SEE WORK →
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Awards quick bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            style={{
              marginTop: '3rem',
              paddingTop: '1.5rem',
              borderTop: `1px solid ${C.border}`,
              display: 'flex',
              gap: '3rem',
            }}
          >
            {[
              { n: '3×', label: 'Cannes Lions Gold' },
              { n: '1×', label: 'D&AD Black Pencil' },
              { n: '80+', label: 'Brand films livrés' },
            ].map((stat) => (
              <div key={stat.label}>
                <div
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: '1.2rem',
                    fontWeight: 800,
                    color: C.violet,
                  }}
                >
                  {stat.n}
                </div>
                <div
                  style={{
                    fontFamily: "'Syne Mono', monospace",
                    fontSize: '0.55rem',
                    letterSpacing: '0.15em',
                    color: C.textDim,
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </section>

        {/* ── Section 2: Showreel Teaser ─────────────────────────────────── */}
        <section style={{ padding: '8rem 3rem', background: '#06060A' }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <div
                style={{
                  fontFamily: "'Syne Mono', monospace",
                  fontSize: '0.6rem',
                  letterSpacing: '0.2em',
                  color: C.textDim,
                  marginBottom: '1rem',
                }}
              >
                SHOWREEL
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div
              onClick={() => setShowreel(true)}
              style={{
                maxWidth: '900px',
                margin: '0 auto',
                cursor: 'pointer',
                position: 'relative',
                group: 'showreel',
              }}
            >
              {/* 16:9 thumbnail */}
              <div
                style={{
                  width: '100%',
                  aspectRatio: '16/9',
                  background: `linear-gradient(160deg, #0d0d18 0%, #180f2a 60%, ${C.violetDim}40 100%)`,
                  border: `1px solid ${C.borderBright}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'border-color 0.3s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget.style.borderColor = C.violet + '80');
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget.style.borderColor = C.borderBright);
                }}
              >
                {/* Gradient overlay */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: `radial-gradient(ellipse at center, ${C.violet}15 0%, transparent 65%)`,
                    pointerEvents: 'none',
                  }}
                />
                {/* Scanlines */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 3px, ${C.violet}04 3px, ${C.violet}04 6px)`,
                    pointerEvents: 'none',
                  }}
                />
                {/* Subtle corner glow */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '40%',
                    background: `linear-gradient(to top, ${C.violetDim}20, transparent)`,
                    pointerEvents: 'none',
                  }}
                />
                {/* Play button */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: C.violet,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    zIndex: 2,
                    boxShadow: `0 0 40px ${C.violet}60`,
                  }}
                >
                  <Play size={28} fill={C.white} color={C.white} style={{ marginLeft: '4px' }} />
                </motion.div>
                {/* Label on frame */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '1.5rem',
                    left: '1.5rem',
                    fontFamily: "'Syne Mono', monospace",
                    fontSize: '0.5rem',
                    color: C.textDim,
                    letterSpacing: '0.15em',
                  }}
                >
                  02:47
                </div>
              </div>
              {/* Below label */}
              <div
                style={{
                  textAlign: 'center',
                  marginTop: '1.5rem',
                  fontFamily: "'Syne Mono', monospace",
                  fontSize: '0.65rem',
                  letterSpacing: '0.25em',
                  color: C.textMuted,
                }}
              >
                SHOWREEL 2024
              </div>
            </div>
          </Reveal>
        </section>

        {/* ── Section 3: Work Grid ───────────────────────────────────────── */}
        <section style={{ padding: '8rem 3rem' }}>
          <Reveal>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                marginBottom: '4rem',
              }}
            >
              <h2
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: 'clamp(2rem, 5vw, 4rem)',
                  letterSpacing: '-0.03em',
                  color: C.text,
                  margin: 0,
                }}
              >
                TRAVAUX<br />SÉLECTIONNÉS
              </h2>
              <Link
                href="/templates/impact-58/work"
                style={{
                  fontFamily: "'Syne Mono', monospace",
                  fontSize: '0.65rem',
                  letterSpacing: '0.1em',
                  color: C.textMuted,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'color 0.3s',
                  paddingBottom: '0.2rem',
                  borderBottom: `1px solid ${C.border}`,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.violet)}
                onMouseLeave={(e) => (e.currentTarget.style.color = C.textMuted)}
              >
                Voir tout <ArrowRight size={12} />
              </Link>
            </div>
          </Reveal>

          <div>
            {PROJECTS.map((project, i) => (
              <SkewProjectItem key={project.id} project={project} index={i} />
            ))}
          </div>

          <Reveal delay={0.2}>
            <div style={{ marginTop: '3rem', textAlign: 'right' }}>
              <Link
                href="/templates/impact-58/work"
                style={{
                  fontFamily: "'Syne Mono', monospace",
                  fontSize: '0.65rem',
                  letterSpacing: '0.1em',
                  color: C.violet,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.violetLight)}
                onMouseLeave={(e) => (e.currentTarget.style.color = C.violet)}
              >
                Voir tout les films <ArrowRight size={12} />
              </Link>
            </div>
          </Reveal>
        </section>

        {/* ── Section 4: Services ────────────────────────────────────────── */}
        <section style={{ padding: '8rem 3rem', background: '#05050A' }}>
          <Reveal>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '4rem' }}>
              <div style={{ width: '40px', height: '2px', background: C.violet, flexShrink: 0 }} />
              <h2
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: 'clamp(1.5rem, 4vw, 3.5rem)',
                  letterSpacing: '-0.03em',
                  color: C.text,
                  margin: 0,
                }}
              >
                SERVICES
              </h2>
            </div>
          </Reveal>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '1px',
              background: C.border,
            }}
          >
            {SERVICES.map((svc, i) => {
              const hov = hoveredService === svc.code;
              return (
                <Reveal key={svc.code} delay={i * 0.1}>
                  <div
                    onMouseEnter={() => setHoveredService(svc.code)}
                    onMouseLeave={() => setHoveredService(null)}
                    style={{
                      background: C.bgCard,
                      padding: '3rem',
                      cursor: 'default',
                      transition: 'box-shadow 0.35s, transform 0.35s',
                      boxShadow: hov ? `0 8px 48px ${C.violet}30, inset 0 0 0 1px ${C.violet}30` : 'none',
                      transform: hov ? 'translateY(-4px)' : 'translateY(0)',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "'Syne Mono', monospace",
                        fontSize: '0.65rem',
                        color: C.textDim,
                        letterSpacing: '0.15em',
                        marginBottom: '1.5rem',
                      }}
                    >
                      {svc.code}
                    </div>
                    <h3
                      style={{
                        fontFamily: "'Syne', sans-serif",
                        fontWeight: 800,
                        fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)',
                        letterSpacing: '-0.02em',
                        color: hov ? C.violet : C.text,
                        margin: '0 0 1.2rem 0',
                        transition: 'color 0.3s',
                      }}
                    >
                      {svc.title}
                    </h3>
                    <p
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: '0.875rem',
                        color: C.textMuted,
                        lineHeight: 1.7,
                        margin: 0,
                      }}
                    >
                      {svc.desc}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* ── Section 5: Stats Bar ───────────────────────────────────────── */}
        <section
          ref={statsRef}
          style={{ background: C.bgCard, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
            }}
          >
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.n}
                initial={{ opacity: 0, y: 20 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  padding: '4rem 3rem',
                  borderRight: i < 3 ? `1px solid ${C.border}` : 'none',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 800,
                    fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                    letterSpacing: '-0.03em',
                    color: C.text,
                    lineHeight: 1,
                    marginBottom: '0.75rem',
                  }}
                >
                  {stat.n}
                </div>
                <div
                  style={{
                    fontFamily: "'Syne Mono', monospace",
                    fontSize: '0.6rem',
                    letterSpacing: '0.15em',
                    color: C.textDim,
                    textTransform: 'uppercase',
                  }}
                >
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Section 6: Clients ────────────────────────────────────────── */}
        <section style={{ padding: '8rem 3rem' }}>
          <Reveal>
            <div
              style={{
                fontFamily: "'Syne Mono', monospace",
                fontSize: '0.6rem',
                letterSpacing: '0.2em',
                color: C.textDim,
                marginBottom: '3rem',
                textAlign: 'center',
              }}
            >
              ILS NOUS FONT CONFIANCE
            </div>
          </Reveal>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              border: `1px solid ${C.border}`,
            }}
          >
            {CLIENTS.map((client, i) => {
              const hov = hoveredClient === client;
              const col = i % 3;
              const row = Math.floor(i / 3);
              return (
                <Reveal key={client} delay={i * 0.08}>
                  <div
                    onMouseEnter={() => setHoveredClient(client)}
                    onMouseLeave={() => setHoveredClient(null)}
                    style={{
                      padding: '3.5rem 3rem',
                      borderRight: col < 2 ? `1px solid ${C.border}` : 'none',
                      borderBottom: row === 0 ? `1px solid ${C.border}` : 'none',
                      textAlign: 'center',
                      cursor: 'default',
                      transition: 'background 0.3s',
                      background: hov ? `${C.violet}08` : 'transparent',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "'Syne', sans-serif",
                        fontWeight: 800,
                        fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                        letterSpacing: '-0.02em',
                        color: hov ? C.violet : C.text,
                        transition: 'color 0.3s',
                      }}
                    >
                      {client}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* ── Section 7: Awards ─────────────────────────────────────────── */}
        <section style={{ padding: '8rem 3rem', background: C.bg }}>
          <Reveal>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
              <Award size={20} color={C.violet} />
              <h2
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: 'clamp(1.5rem, 4vw, 3rem)',
                  letterSpacing: '-0.03em',
                  color: C.text,
                  margin: 0,
                }}
              >
                PALMARÈS
              </h2>
            </div>
          </Reveal>

          <div>
            {AWARDS_LIST.map((award, i) => (
              <Reveal key={award} delay={i * 0.1}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2rem',
                    padding: '2.5rem 0',
                    borderBottom: `1px solid ${C.border}`,
                  }}
                >
                  <div
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: C.violet,
                      flexShrink: 0,
                    }}
                  />
                  <div
                    style={{
                      fontFamily: "'Syne', sans-serif",
                      fontWeight: 800,
                      fontSize: 'clamp(1rem, 2.5vw, 1.8rem)',
                      letterSpacing: '-0.01em',
                      color: C.text,
                    }}
                  >
                    {award}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── Section 8: CTA ────────────────────────────────────────────── */}
        <section
          style={{
            padding: '10rem 3rem',
            textAlign: 'center',
            background: `linear-gradient(160deg, #08080E 0%, #0E0820 50%, #08080E 100%)`,
            borderTop: `1px solid ${C.border}`,
          }}
        >
          <Reveal>
            <div
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                fontSize: 'clamp(3rem, 10vw, 9rem)',
                letterSpacing: '-0.04em',
                color: C.text,
                lineHeight: 1.05,
                marginBottom: '1.5rem',
              }}
            >
              COMMENÇONS.
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '1.1rem',
                color: C.textMuted,
                marginBottom: '3rem',
              }}
            >
              Vous avez un film à créer ?
            </p>
          </Reveal>

          <Reveal delay={0.25}>
            <Link
              href="/templates/impact-58/contact"
              style={{
                fontFamily: "'Syne Mono', monospace",
                fontSize: '0.75rem',
                letterSpacing: '0.15em',
                color: C.text,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                paddingBottom: '0.4rem',
                borderBottom: `2px solid ${C.violet}`,
                transition: 'color 0.3s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.violet)}
              onMouseLeave={(e) => (e.currentTarget.style.color = C.text)}
            >
              Prendre contact <ArrowRight size={14} />
            </Link>
          </Reveal>
        </section>
      </div>

      {/* ── Showreel Modal ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {showreel && <ShowreelModal onClose={() => setShowreel(false)} />}
      </AnimatePresence>
    </>
  );
}
