'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Award, Clock } from 'lucide-react';
import { C, PROJECTS, StyleInjector, Reveal } from '../shared';

// ── Filter tags ────────────────────────────────────────────────────────────────
const ALL_TAGS = ['Tous', '3D', 'Motion', 'Film', 'Installation', 'Social'];

// ── Project Card ───────────────────────────────────────────────────────────────
function ProjectCard({ project, index }: { project: typeof PROJECTS[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: C.bgCard,
        border: `1px solid ${hovered ? project.color + '40' : C.border}`,
        overflow: 'hidden',
        cursor: 'pointer',
        transform: hovered ? 'scale(1.02)' : 'scale(1)',
        transition: 'transform 0.35s cubic-bezier(0.22,1,0.36,1), box-shadow 0.35s, border-color 0.35s',
        boxShadow: hovered ? `0 20px 60px ${project.color}18` : 'none',
      }}
    >
      {/* Color bar */}
      <div
        style={{
          height: '3px',
          background: project.color,
          width: hovered ? '100%' : '30%',
          transition: 'width 0.5s cubic-bezier(0.22,1,0.36,1)',
        }}
      />

      {/* Thumbnail */}
      <div
        style={{
          width: '100%',
          aspectRatio: '16/9',
          background: `linear-gradient(135deg, #09090F 0%, ${project.color}12 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 3px, ${project.color}04 3px, ${project.color}04 6px)`,
          }}
        />
        <div
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: '5rem',
            color: project.color + '18',
            letterSpacing: '-0.05em',
            userSelect: 'none',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {project.id}
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '1rem',
            right: '1rem',
            background: C.bg + 'CC',
            border: `1px solid ${C.border}`,
            padding: '0.3rem 0.7rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          <Clock size={9} color={C.textDim} />
          <span
            style={{
              fontFamily: "'Syne Mono', monospace",
              fontSize: '0.5rem',
              color: C.textMuted,
              letterSpacing: '0.1em',
            }}
          >
            {project.duration}
          </span>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '2rem' }}>
        <div
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: 'clamp(1.4rem, 2.5vw, 2rem)',
            letterSpacing: '-0.03em',
            color: hovered ? project.color : C.text,
            lineHeight: 1.1,
            marginBottom: '0.5rem',
            transition: 'color 0.3s',
          }}
        >
          {project.title}
        </div>
        <div
          style={{
            fontFamily: "'Syne Mono', monospace",
            fontSize: '0.6rem',
            color: C.textMuted,
            letterSpacing: '0.1em',
            marginBottom: '1.5rem',
          }}
        >
          {project.client} · {project.type} · {project.year}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {project.tags.map((tag) => (
            <span
              key={tag}
              style={{
                fontFamily: "'Syne Mono', monospace",
                fontSize: '0.5rem',
                letterSpacing: '0.12em',
                padding: '0.25rem 0.6rem',
                border: `1px solid ${hovered ? project.color + '50' : C.border}`,
                color: hovered ? project.color : C.textDim,
                transition: 'all 0.3s',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
        {project.awards.length > 0 && (
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: '1rem' }}>
            {project.awards.map((award) => (
              <div
                key={award}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.35rem',
                }}
              >
                <Award size={9} color={C.violet} />
                <span
                  style={{
                    fontFamily: "'Syne Mono', monospace",
                    fontSize: '0.5rem',
                    color: C.textDim,
                    letterSpacing: '0.08em',
                  }}
                >
                  {award}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function WorkPage() {
  const [activeFilter, setActiveFilter] = useState('Tous');

  const filteredProjects =
    activeFilter === 'Tous'
      ? PROJECTS
      : PROJECTS.filter((p) => p.tags.includes(activeFilter));

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

        {/* Hero title */}
        <section style={{ padding: '5rem 3rem 4rem' }}>
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
              SKEW OS — PORTFOLIO
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
                margin: 0,
              }}
            >
              TOUS
              <br />
              <span
                style={{
                  color: 'transparent',
                  WebkitTextStroke: `1px ${C.violet}`,
                }}
              >
                LES FILMS
              </span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <div
              style={{
                marginTop: '3rem',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.95rem',
                color: C.textMuted,
                maxWidth: '50ch',
                lineHeight: 1.7,
              }}
            >
              Cinq années de films pour les marques qui refusent le commun. Chaque projet, une obsession.
            </div>
          </Reveal>
        </section>

        {/* Filter row */}
        <div
          style={{
            padding: '0 3rem 3rem',
            display: 'flex',
            gap: '0.6rem',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          {ALL_TAGS.map((tag) => {
            const active = activeFilter === tag;
            return (
              <button
                key={tag}
                onClick={() => setActiveFilter(tag)}
                style={{
                  fontFamily: "'Syne Mono', monospace",
                  fontSize: '0.6rem',
                  letterSpacing: '0.12em',
                  padding: '0.5rem 1.2rem',
                  border: `1px solid ${active ? C.violet : C.border}`,
                  background: active ? C.violet : 'transparent',
                  color: active ? C.white : C.textMuted,
                  cursor: 'pointer',
                  transition: 'all 0.25s',
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.borderColor = C.violet + '60';
                    e.currentTarget.style.color = C.text;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.borderColor = C.border;
                    e.currentTarget.style.color = C.textMuted;
                  }
                }}
              >
                {tag.toUpperCase()}
              </button>
            );
          })}
          <span
            style={{
              fontFamily: "'Syne Mono', monospace",
              fontSize: '0.55rem',
              color: C.textDim,
              letterSpacing: '0.1em',
              marginLeft: 'auto',
            }}
          >
            {filteredProjects.length} FILM{filteredProjects.length !== 1 ? 'S' : ''}
          </span>
        </div>

        {/* Grid */}
        <div style={{ padding: '0 3rem 8rem' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '2px',
              }}
            >
              {filteredProjects.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>

          {filteredProjects.length === 0 && (
            <div
              style={{
                textAlign: 'center',
                padding: '6rem 0',
                fontFamily: "'Syne Mono', monospace",
                fontSize: '0.65rem',
                color: C.textDim,
                letterSpacing: '0.15em',
              }}
            >
              AUCUN FILM DANS CETTE CATÉGORIE
            </div>
          )}
        </div>

        {/* CTA strip */}
        <div
          style={{
            borderTop: `1px solid ${C.border}`,
            padding: '4rem 3rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '2rem',
            background: C.bgCard,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                fontSize: '1.5rem',
                letterSpacing: '-0.02em',
                color: C.text,
                marginBottom: '0.4rem',
              }}
            >
              Travaillons ensemble.
            </div>
            <div
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.875rem',
                color: C.textMuted,
              }}
            >
              Vous avez un projet de film en tête ?
            </div>
          </div>
          <Link
            href="/templates/impact-58/contact"
            style={{
              background: C.violet,
              color: C.white,
              textDecoration: 'none',
              fontFamily: "'Syne Mono', monospace",
              fontSize: '0.65rem',
              letterSpacing: '0.12em',
              padding: '1rem 2rem',
              transition: 'background 0.3s',
              whiteSpace: 'nowrap',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = C.violetLight)}
            onMouseLeave={(e) => (e.currentTarget.style.background = C.violet)}
          >
            BRIEF US <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </>
  );
}
