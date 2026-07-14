'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import {
  C,
  TEAM,
  Reveal,
  StyleInjector,
  CustomCursor,
} from '../shared';

// ── Awards data ──────────────────────────────────────────────────────────────
const AWARDS = [
  { n: '01', title: 'AWWWARDS Site of the Year', year: '2023', org: 'AWWWARDS' },
  { n: '02', title: 'D&AD Silver Pencil', year: '2024', org: 'D&AD' },
  { n: '03', title: 'CSS Design Awards', year: '2024', org: 'CSSDA' },
  { n: '04', title: 'Red Dot Award — Communication Design', year: '2023', org: 'Red Dot' },
  { n: '05', title: 'Cannes Lions Bronze', year: '2024', org: 'Cannes Lions' },
];

// ── Avatar initials ──────────────────────────────────────────────────────────
function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('');
}

// ── Team Card ────────────────────────────────────────────────────────────────
function TeamCard({
  member,
  index,
}: {
  member: (typeof TEAM)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: C.bgCard,
        border: `1px solid ${C.border}`,
        padding: '2.5rem',
        transition: 'border-color 0.3s',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.accent; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; }}
    >
      {/* Avatar */}
      <div
        style={{
          width: '60px',
          height: '60px',
          background: index % 2 === 0 ? C.accent : C.accentAlt,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.5rem',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '1rem',
            fontWeight: 700,
            color: C.bg,
            letterSpacing: '-0.02em',
          }}
        >
          {getInitials(member.name)}
        </span>
      </div>

      <div
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '1.1rem',
          fontWeight: 700,
          color: C.text,
          marginBottom: '0.25rem',
        }}
      >
        {member.name}
      </div>
      <div
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: '0.65rem',
          color: C.accent,
          letterSpacing: '0.08em',
          marginBottom: '1.25rem',
        }}
      >
        {member.role}
      </div>

      {/* Specialty tags */}
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
        {member.specialty.split(' · ').map((s) => (
          <span
            key={s}
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '0.5rem',
              letterSpacing: '0.08em',
              padding: '0.3rem 0.6rem',
              border: `1px solid ${C.border}`,
              color: C.textMuted,
            }}
          >
            {s}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

// ── Award Row ────────────────────────────────────────────────────────────────
function AwardRow({
  award,
  index,
}: {
  award: (typeof AWARDS)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      style={{
        display: 'grid',
        gridTemplateColumns: '3rem 1fr auto',
        alignItems: 'center',
        gap: '2rem',
        padding: '1.75rem 0',
        borderBottom: `1px solid ${C.border}`,
        cursor: 'default',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.background = C.bgCard;
        el.style.paddingLeft = '1rem';
        el.style.paddingRight = '1rem';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.background = 'transparent';
        el.style.paddingLeft = '0';
        el.style.paddingRight = '0';
      }}
    >
      <span
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: '0.65rem',
          color: C.textDim,
          letterSpacing: '0.1em',
        }}
      >
        {award.n}
      </span>
      <div>
        <div
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(0.9rem, 1.5vw, 1.2rem)',
            fontWeight: 600,
            color: C.text,
            letterSpacing: '-0.01em',
          }}
        >
          {award.title}
        </div>
        <div
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '0.55rem',
            color: C.textMuted,
            marginTop: '0.2rem',
            letterSpacing: '0.08em',
          }}
        >
          {award.org}
        </div>
      </div>
      <span
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: '0.65rem',
          color: C.accent,
          letterSpacing: '0.05em',
          flexShrink: 0,
          background: `${C.accent}15`,
          padding: '0.3rem 0.7rem',
        }}
      >
        {award.year}
      </span>
    </motion.div>
  );
}

// ── Studio Page ───────────────────────────────────────────────────────────────
export default function StudioPage() {
  return (
    <div style={{ background: C.bg, minHeight: '100dvh' }}>
      <CustomCursor />
      <StyleInjector />

      {/* ── 1. Hero ───────────────────────────────────────────────────────── */}
      <section
        style={{
          padding: '8rem 3rem 6rem',
          borderBottom: `1px solid ${C.border}`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background label */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingRight: '3rem',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          <div
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(6rem, 15vw, 14rem)',
              fontWeight: 700,
              color: C.bgLight,
              letterSpacing: '-0.05em',
              lineHeight: 1,
            }}
          >
            STUDIO
          </div>
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <Reveal>
            <div
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: '0.65rem',
                color: C.textMuted,
                letterSpacing: '0.2em',
                textTransform: 'uppercase' as const,
                marginBottom: '3rem',
              }}
            >
              <Link
                href="/templates/impact-57"
                style={{ color: C.textDim, textDecoration: 'none' }}
              >
                MASK_UNIT
              </Link>{' '}
              / STUDIO
            </div>
          </Reveal>

          <div>
            <div style={{ overflow: 'hidden', marginBottom: '0.5rem' }}>
              <motion.div
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 'clamp(3.5rem, 10vw, 9rem)',
                  fontWeight: 700,
                  color: C.text,
                  letterSpacing: '-0.04em',
                  lineHeight: 0.9,
                }}
              >
                NOUS SOMMES
              </motion.div>
            </div>
            <div style={{ overflow: 'hidden' }}>
              <motion.div
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 'clamp(3.5rem, 10vw, 9rem)',
                  fontWeight: 700,
                  color: C.accent,
                  letterSpacing: '-0.04em',
                  lineHeight: 0.9,
                }}
              >
                MASK_UNIT
              </motion.div>
            </div>
          </div>

          <Reveal delay={0.4}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '4rem',
                marginTop: '4rem',
                paddingTop: '3rem',
                borderTop: `1px solid ${C.border}`,
              }}
            >
              <p
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '0.82rem',
                  color: C.textMuted,
                  lineHeight: 1.9,
                }}
              >
                Fondé en 2012 à Paris, MASK_UNIT est un studio de design radical spécialisé dans les identités visuelles qui marquent les esprits. Quatre personnes. Une obsession commune : refuser le médiocre.
              </p>
              <p
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '0.82rem',
                  color: C.textMuted,
                  lineHeight: 1.9,
                }}
              >
                Nos clients opèrent sur 6 continents. Balenciaga, Nike, Hermès, Dior, Maison Margiela. Nous ne cherchons pas à plaire — nous cherchons à marquer. La différence est essentielle.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 2. Team ───────────────────────────────────────────────────────── */}
      <section
        style={{
          padding: '8rem 3rem',
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
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
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 'clamp(0.8rem, 1.2vw, 1rem)',
                  fontWeight: 500,
                  color: C.textMuted,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase' as const,
                }}
              >
                L'équipe
              </h2>
              <span
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '0.6rem',
                  color: C.textDim,
                  letterSpacing: '0.1em',
                }}
              >
                4 personnes
              </span>
            </div>
          </Reveal>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '2px',
            }}
          >
            {TEAM.map((member, i) => (
              <TeamCard key={member.name} member={member} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Manifesto ──────────────────────────────────────────────────── */}
      <section
        style={{
          padding: '8rem 3rem',
          borderBottom: `1px solid ${C.border}`,
          background: C.bgLight,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative line */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '3px',
            background: `linear-gradient(to bottom, transparent, ${C.accent}, transparent)`,
          }}
        />

        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <Reveal>
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: '0.65rem',
                color: C.textMuted,
                letterSpacing: '0.2em',
                textTransform: 'uppercase' as const,
                display: 'block',
                marginBottom: '3rem',
              }}
            >
              Manifeste
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <blockquote
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(1.5rem, 3.5vw, 3rem)',
                fontStyle: 'italic',
                fontWeight: 500,
                color: C.text,
                lineHeight: 1.35,
                letterSpacing: '-0.02em',
                margin: 0,
                borderLeft: `4px solid ${C.accent}`,
                paddingLeft: '2.5rem',
              }}
            >
              "Nous croyons que le design est une arme. Chaque projet est une bataille pour l'attention, la mémoire, et l'émotion."
            </blockquote>
          </Reveal>
          <Reveal delay={0.25}>
            <div
              style={{
                marginTop: '3rem',
                paddingLeft: '2.5rem',
                fontFamily: "'Space Mono', monospace",
                fontSize: '0.65rem',
                color: C.textDim,
                letterSpacing: '0.15em',
              }}
            >
              MASK_UNIT · PARIS · 2012
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 4. Awards ─────────────────────────────────────────────────────── */}
      <section style={{ padding: '8rem 3rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Reveal>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                marginBottom: '2rem',
              }}
            >
              <h2
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 'clamp(0.8rem, 1.2vw, 1rem)',
                  fontWeight: 500,
                  color: C.textMuted,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase' as const,
                }}
              >
                Distinctions
              </h2>
              <span
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '0.6rem',
                  color: C.textDim,
                  letterSpacing: '0.1em',
                }}
              >
                38 AWWWARDS au total
              </span>
            </div>
          </Reveal>

          <div style={{ borderTop: `1px solid ${C.border}` }}>
            {AWARDS.map((award, i) => (
              <AwardRow key={award.n} award={award} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section
        style={{
          borderTop: `1px solid ${C.border}`,
          padding: '6rem 3rem',
          background: C.bgLight,
          textAlign: 'center',
        }}
      >
        <Reveal>
          <p
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(1.3rem, 2.5vw, 2rem)',
              color: C.text,
              fontWeight: 700,
              letterSpacing: '-0.02em',
              marginBottom: '2rem',
            }}
          >
            Envie de travailler avec nous ?
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <Link
            href="/templates/impact-57/contact"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              background: C.accent,
              color: C.bg,
              padding: '1.1rem 2.5rem',
              fontFamily: "'Space Mono', monospace",
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textDecoration: 'none',
              textTransform: 'uppercase' as const,
              transition: 'background 0.3s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = C.accentAlt; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = C.accent; }}
          >
            Démarrer un projet <ArrowRight size={12} />
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
