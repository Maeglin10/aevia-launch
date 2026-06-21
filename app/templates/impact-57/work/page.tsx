'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ArrowRight, ExternalLink } from 'lucide-react';
import {
  C,
  PROJECTS,
  Reveal,
  StyleInjector,
  CustomCursor,
} from '../shared';

// ── Project images (Unsplash) ────────────────────────────────────────────────
const PROJECT_IMAGES: Record<string, string> = {
  '01': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1200&auto=format&fit=crop',
  '02': 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1200&auto=format&fit=crop',
  '03': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1200&auto=format&fit=crop',
  '04': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1200&auto=format&fit=crop',
  '05': 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?q=80&w=1200&auto=format&fit=crop',
};

// ── Available filter tags ────────────────────────────────────────────────────
const ALL_TAGS = [
  "All', 'Identity', 'Motion', 'Film', '3D",
  "XR', 'Editorial', 'Campaign', 'CGI', 'Social', 'Web",
];

// ── Project Card ─────────────────────────────────────────────────────────────
function ProjectCard({
  project,
  index,
}: {
  project: (typeof PROJECTS)[0];
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        aspectRatio: '4/3',
        overflow: 'hidden',
        cursor: 'pointer',
        background: C.bgCard,
      }}
    >
      {/* Image */}
      <motion.img
        src={PROJECT_IMAGES[project.id]}
        alt={project.title}
        animate={{ scale: hovered ? 1.06 : 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
        }}
      />

      {/* Gradient overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to top, rgba(5,5,5,0.85) 0%, rgba(5,5,5,0.1) 60%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Project number top-left */}
      <div
        style={{
          position: 'absolute',
          top: '1.5rem',
          left: '1.5rem',
          fontFamily: "'Space Mono', monospace",
          fontSize: '0.65rem',
          color: 'rgba(240,237,232,0.5)',
          letterSpacing: '0.15em',
        }}
      >
        {project.id}
      </div>

      {/* Accent color bar bottom */}
      <motion.div
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: project.color,
          transformOrigin: 'left',
        }}
      />

      {/* Bottom info — always visible */}
      <div
        style={{
          position: 'absolute',
          bottom: '1.5rem',
          left: '1.5rem',
          right: '1.5rem',
        }}
      >
        <h3
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(1.3rem, 2.5vw, 2rem)',
            fontWeight: 700,
            color: C.text,
            letterSpacing: '-0.02em',
            marginBottom: '0.25rem',
          }}
        >
          {project.title}
        </h3>
        <div
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '0.6rem',
            color: 'rgba(240,237,232,0.6)',
          }}
        >
          {project.client}
        </div>
      </div>

      {/* Hover overlay with full details */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(5,5,5,0.9)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '2rem',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: '0.6rem',
                color: C.accent,
                letterSpacing: '0.2em',
                marginBottom: '1rem',
              }}
            >
              {project.id}
            </div>
            <h3
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                fontWeight: 700,
                color: C.text,
                letterSpacing: '-0.03em',
                marginBottom: '0.5rem',
              }}
            >
              {project.title}
            </h3>
            <div
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: '0.65rem',
                color: C.textMuted,
                marginBottom: '0.5rem',
              }}
            >
              {project.client}
            </div>
            <div
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: '0.55rem',
                color: C.textDim,
                letterSpacing: '0.1em',
                marginBottom: '2rem',
              }}
            >
              {project.type} · {project.year}
            </div>

            <div
              style={{
                display: 'flex',
                gap: '0.5rem',
                flexWrap: 'wrap',
                justifyContent: 'center',
                marginBottom: '2rem',
              }}
            >
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: '0.5rem',
                    letterSpacing: '0.1em',
                    padding: '0.3rem 0.7rem',
                    border: `1px solid ${C.accent}`,
                    color: C.accent,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontFamily: "'Space Mono', monospace",
                fontSize: '0.65rem',
                color: C.accent,
                letterSpacing: '0.1em',
              }}
            >
              Voir le projet <ExternalLink size={10} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Main Work Page ────────────────────────────────────────────────────────────
export default function WorkPage() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredProjects =
    activeFilter === 'All'
      ? PROJECTS
      : PROJECTS.filter((p) => p.tags.includes(activeFilter));

  return (
    <div style={{ background: C.bg, minHeight: '100vh' }}>
      <CustomCursor />
      <StyleInjector />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section
        style={{
          padding: '8rem 3rem 4rem',
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Reveal>
            <div
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: '0.65rem',
                color: C.textMuted,
                letterSpacing: '0.2em',
                textTransform: 'uppercase' as const,
                marginBottom: '2rem',
              }}
            >
              <Link
                href="/templates/impact-57"
                style={{ color: C.textDim, textDecoration: 'none' }}
              >
                MASK_UNIT
              </Link>{' '}
              / TRAVAUX
            </div>
          </Reveal>

          <div style={{ overflow: 'hidden', marginBottom: '0.5rem' }}>
            <motion.h1
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(4rem, 12vw, 10rem)',
                fontWeight: 700,
                color: C.text,
                letterSpacing: '-0.04em',
                lineHeight: 0.95,
                margin: 0,
              }}
            >
              TOUS LES
            </motion.h1>
          </div>
          <div style={{ overflow: 'hidden' }}>
            <motion.div
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(4rem, 12vw, 10rem)',
                fontWeight: 700,
                color: C.accent,
                letterSpacing: '-0.04em',
                lineHeight: 0.95,
              }}
            >
              PROJETS
            </motion.div>
          </div>

          <Reveal delay={0.4}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                marginTop: '3rem',
              }}
            >
              <p
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '0.8rem',
                  color: C.textMuted,
                  lineHeight: 1.8,
                  maxWidth: '40ch',
                }}
              >
                180+ projets livrés pour les plus grandes maisons du monde.
                Chaque travail, une obsession.
              </p>
              <div
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '0.6rem',
                  color: C.textDim,
                  letterSpacing: '0.1em',
                  flexShrink: 0,
                }}
              >
                {filteredProjects.length} projet
                {filteredProjects.length > 1 ? 's' : ''}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Sticky Filters ────────────────────────────────────────────────── */}
      <section
        style={{
          padding: '2rem 3rem',
          borderBottom: `1px solid ${C.border}`,
          position: 'sticky',
          top: '60px',
          background: C.bg,
          zIndex: 100,
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              flexWrap: 'wrap' as const,
            }}
          >
            {ALL_TAGS.map((tag) => {
              const isActive = activeFilter === tag;
              return (
                <button
                  key={tag}
                  onClick={() => setActiveFilter(tag)}
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: '0.6rem',
                    letterSpacing: '0.1em',
                    padding: '0.5rem 1.2rem',
                    border: `1px solid ${isActive ? C.accent : C.border}`,
                    background: isActive ? C.accent : 'transparent',
                    color: isActive ? C.bg : C.textMuted,
                    cursor: 'pointer',
                    transition: 'all 0.25s',
                    textTransform: 'uppercase' as const,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.borderColor = C.textMuted;
                      e.currentTarget.style.color = C.text;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.borderColor = C.border;
                      e.currentTarget.style.color = C.textMuted;
                    }
                  }}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Project Grid ──────────────────────────────────────────────────── */}
      <section style={{ padding: '4rem 3rem 8rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <AnimatePresence mode="popLayout">
            <motion.div
              layout
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '2px',
              }}
            >
              {filteredProjects.map((project, i) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <ProjectCard project={project} index={i} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {filteredProjects.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                textAlign: 'center',
                padding: '6rem 0',
                fontFamily: "'Space Mono', monospace",
                fontSize: '0.75rem',
                color: C.textDim,
                letterSpacing: '0.1em',
              }}
            >
              Aucun projet pour ce filtre.
            </motion.div>
          )}
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section
        style={{
          borderTop: `1px solid ${C.border}`,
          padding: '6rem 3rem',
          textAlign: 'center',
          background: C.bgLight,
        }}
      >
        <Reveal>
          <p
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
              color: C.text,
              fontWeight: 700,
              letterSpacing: '-0.02em',
              marginBottom: '2rem',
            }}
          >
            Votre projet est le prochain.
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
            onMouseEnter={(e) => {
              e.currentTarget.style.background = C.accentAlt;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = C.accent;
            }}
          >
            Démarrer un projet <ArrowRight size={12} />
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
