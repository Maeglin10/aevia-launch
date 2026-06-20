'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { ArrowLeft, ArrowRight, Award } from 'lucide-react';
import { C, AWARDS_LIST, StyleInjector, Reveal } from '../shared';

// ── Team data ──────────────────────────────────────────────────────────────────
const TEAM = [
  {
    initials: 'MB',
    name: 'Mathieu Blanc',
    role: 'Directeur Créatif',
    bio: 'Ancien directeur artistique chez Wieden+Kennedy Paris. 12 ans à sculpter des univers visuels pour les plus grandes marques mondiales.',
    accent: C.violet,
  },
  {
    initials: 'SP',
    name: 'Seo-yeon Park',
    role: 'Motion Lead',
    bio: 'Formée à la School of Visual Arts de New York. Spécialiste de la 3D temps réel et des systèmes génératifs. Chaque pixel est une décision.',
    accent: C.cyan,
  },
  {
    initials: 'LM',
    name: 'Léa Moreau',
    role: 'Productrice',
    bio: 'Ancienne productrice exécutive chez Partizan. Elle fait en sorte que l\'impossible reste dans les délais et dans le budget.',
    accent: '#FF4DAD',
  },
];

// ── Philosophy pillars ────────────────────────────────────────────────────────
const PILLARS = [
  {
    num: '01',
    title: 'Regard',
    desc: 'Nous regardons le monde différemment. Chaque brief est un prétexte à voir ce que personne n\'a encore montré. Le point de vue avant la technique.',
  },
  {
    num: '02',
    title: 'Précision',
    desc: 'Chaque frame compte. Chaque courbe d\'animation est calibrée. Chaque son est choisi. La précision n\'est pas une obsession — c\'est une marque de respect envers le spectateur.',
  },
  {
    num: '03',
    title: 'Émotion',
    desc: 'Les données ne mémorisent pas. Les émotions, si. Nous créons des films qui restent — pas parce qu\'ils sont beaux, mais parce qu\'ils ressentent juste.',
  },
];

// ── Award item ─────────────────────────────────────────────────────────────────
function AwardItem({ award, index }: { award: string; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -24 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
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
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: C.violet,
          flexShrink: 0,
          boxShadow: `0 0 12px ${C.violet}80`,
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
    </motion.div>
  );
}

// ── Team card ─────────────────────────────────────────────────────────────────
function TeamCard({ member, index }: { member: typeof TEAM[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: C.bgCard,
        border: `1px solid ${hovered ? member.accent + '40' : C.border}`,
        padding: '2.5rem',
        transition: 'border-color 0.35s, box-shadow 0.35s',
        boxShadow: hovered ? `0 12px 40px ${member.accent}15` : 'none',
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: member.accent,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.5rem',
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800,
          fontSize: '1.1rem',
          color: C.bg,
          letterSpacing: '0.05em',
          boxShadow: `0 0 24px ${member.accent}40`,
        }}
      >
        {member.initials}
      </div>

      {/* Name */}
      <div
        style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800,
          fontSize: '1.4rem',
          letterSpacing: '-0.02em',
          color: C.text,
          marginBottom: '0.4rem',
        }}
      >
        {member.name}
      </div>

      {/* Role */}
      <div
        style={{
          fontFamily: "'Syne Mono', monospace",
          fontSize: '0.6rem',
          letterSpacing: '0.12em',
          color: member.accent,
          marginBottom: '1.2rem',
        }}
      >
        {member.role.toUpperCase()}
      </div>

      {/* Bio */}
      <p
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '0.875rem',
          color: C.textMuted,
          lineHeight: 1.7,
          margin: 0,
        }}
      >
        {member.bio}
      </p>
    </motion.div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function StudioPage() {
  return (
    <>
      <StyleInjector />
      <div style={{ background: C.bg, minHeight: '100vh', color: C.text }}>

        {/* Back link */}
        <div style={{ padding: '2rem 3rem 0' }}>
          <Link
            href="/templates/impact-58"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontFamily: "'Syne Mono', monospace",
              fontSize: '0.6rem',
              color: C.textDim,
              textDecoration: 'none',
              letterSpacing: '0.1em',
              transition: 'color 0.3s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = C.violet)}
            onMouseLeave={(e) => (e.currentTarget.style.color = C.textDim)}
          >
            <ArrowLeft size={12} /> RETOUR
          </Link>
        </div>

        {/* ── 1. Hero ────────────────────────────────────────────────────── */}
        <section
          style={{
            padding: '5rem 3rem 7rem',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Background accent */}
          <div
            style={{
              position: 'absolute',
              top: '-10rem',
              right: '-10rem',
              width: '500px',
              height: '500px',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${C.violet}12 0%, transparent 70%)`,
              pointerEvents: 'none',
            }}
          />

          <Reveal>
            <div
              style={{
                fontFamily: "'Syne Mono', monospace",
                fontSize: '0.6rem',
                letterSpacing: '0.25em',
                color: C.textDim,
                marginBottom: '1.5rem',
              }}
            >
              SKEW OS — STUDIO
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h1
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                fontSize: 'clamp(4rem, 13vw, 11rem)',
                letterSpacing: '-0.05em',
                color: C.text,
                lineHeight: 0.9,
                margin: '0 0 3rem 0',
              }}
            >
              SKEW
              <br />
              <span
                style={{
                  color: 'transparent',
                  WebkitTextStroke: `1px ${C.violet}`,
                }}
              >
                OS
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.25}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '4rem',
                maxWidth: '900px',
              }}
            >
              <p
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)',
                  color: C.text,
                  lineHeight: 1.35,
                  letterSpacing: '-0.01em',
                  margin: 0,
                }}
              >
                Studio de motion design basé à Paris. Nous faisons bouger les marques mondiales.
              </p>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '0.95rem',
                  color: C.textMuted,
                  lineHeight: 1.75,
                  margin: 0,
                }}
              >
                Fondé en 2019, Skew OS est né d'une conviction simple : le mouvement n'est pas une décoration. C'est un langage. Nous le parlons couramment — et nous le traduisons pour les marques qui ont quelque chose à dire.
              </p>
            </div>
          </Reveal>
        </section>

        {/* ── 2. Philosophy ──────────────────────────────────────────────── */}
        <section
          style={{
            padding: '6rem 3rem',
            background: '#05050A',
            borderTop: `1px solid ${C.border}`,
            borderBottom: `1px solid ${C.border}`,
          }}
        >
          <Reveal>
            <div
              style={{
                fontFamily: "'Syne Mono', monospace",
                fontSize: '0.6rem',
                letterSpacing: '0.2em',
                color: C.textDim,
                marginBottom: '3rem',
              }}
            >
              PHILOSOPHIE
            </div>
          </Reveal>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1px',
              background: C.border,
            }}
          >
            {PILLARS.map((pillar, i) => (
              <Reveal key={pillar.num} delay={i * 0.12}>
                <div
                  style={{
                    background: '#05050A',
                    padding: '3rem',
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Syne Mono', monospace",
                      fontSize: '0.65rem',
                      color: C.violet,
                      letterSpacing: '0.15em',
                      marginBottom: '1.5rem',
                    }}
                  >
                    {pillar.num}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Syne', sans-serif",
                      fontWeight: 800,
                      fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
                      letterSpacing: '-0.02em',
                      color: C.text,
                      marginBottom: '1.2rem',
                    }}
                  >
                    {pillar.title}
                  </div>
                  <p
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: '0.875rem',
                      color: C.textMuted,
                      lineHeight: 1.75,
                      margin: 0,
                    }}
                  >
                    {pillar.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── 3. Awards ─────────────────────────────────────────────────── */}
        <section style={{ padding: '7rem 3rem' }}>
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

          <div style={{ borderTop: `1px solid ${C.border}` }}>
            {AWARDS_LIST.map((award, i) => (
              <AwardItem key={award} award={award} index={i} />
            ))}
          </div>

          <Reveal delay={0.3}>
            <div
              style={{
                marginTop: '2rem',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.875rem',
                color: C.textMuted,
              }}
            >
              Et des dizaines d'autres reconnaissances de 2019 à aujourd'hui.
            </div>
          </Reveal>
        </section>

        {/* ── 4. Team ──────────────────────────────────────────────────── */}
        <section
          style={{
            padding: '7rem 3rem 8rem',
            background: '#05050A',
            borderTop: `1px solid ${C.border}`,
          }}
        >
          <Reveal>
            <div
              style={{
                fontFamily: "'Syne Mono', monospace",
                fontSize: '0.6rem',
                letterSpacing: '0.2em',
                color: C.textDim,
                marginBottom: '1rem',
              }}
            >
              L'ÉQUIPE
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <h2
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                fontSize: 'clamp(2rem, 5vw, 4rem)',
                letterSpacing: '-0.03em',
                color: C.text,
                margin: '0 0 4rem 0',
              }}
            >
              TROIS TÊTES.<br />UN SEUL STANDARD.
            </h2>
          </Reveal>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2px',
            }}
          >
            {TEAM.map((member, i) => (
              <TeamCard key={member.name} member={member} index={i} />
            ))}
          </div>
        </section>

        {/* ── CTA strip ─────────────────────────────────────────────────── */}
        <div
          style={{
            padding: '5rem 3rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '2rem',
            borderTop: `1px solid ${C.border}`,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                fontSize: '2rem',
                letterSpacing: '-0.03em',
                color: C.text,
                marginBottom: '0.5rem',
              }}
            >
              Parlons de votre projet.
            </div>
            <div
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.875rem',
                color: C.textMuted,
              }}
            >
              Disponible dès septembre 2025 pour de nouveaux projets.
            </div>
          </div>
          <Link
            href="/templates/impact-58/contact"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontFamily: "'Syne Mono', monospace",
              fontSize: '0.7rem',
              letterSpacing: '0.12em',
              color: C.text,
              textDecoration: 'none',
              paddingBottom: '0.4rem',
              borderBottom: `2px solid ${C.violet}`,
              transition: 'color 0.3s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = C.violet)}
            onMouseLeave={(e) => (e.currentTarget.style.color = C.text)}
          >
            PRENDRE CONTACT <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </>
  );
}
