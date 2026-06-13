"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { C, F, PageHero, projects } from "../shared";

export default function Projects() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = projects.find((p) => p.id === selectedId);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedId(null);
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, []);

  // ── Project detail view ──
  if (selected) {
    return (
      <div>
        <PageHero
          eyebrow={selected.category}
          title={selected.title}
          subtitle={`${selected.location} · ${selected.year} · ${selected.area}`}
        />
        <section style={{ background: C.bg, padding: '100px 40px 120px' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <button
              onClick={() => setSelectedId(null)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: F.sans,
                fontSize: 11,
                letterSpacing: '0.16em',
                textTransform: 'uppercase' as const,
                color: C.textMuted,
                marginBottom: 40,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.accent)}
              onMouseLeave={(e) => (e.currentTarget.style.color = C.textMuted)}
            >
              ← Tous les projets
            </button>

            {/* Visual band — blueprint geometry over the project colour */}
            <div
              style={{
                position: 'relative',
                background: selected.color,
                height: 'clamp(260px, 40vw, 420px)',
                border: `1px solid ${C.border}`,
                borderTop: `2px solid ${C.accent}`,
                marginBottom: 56,
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: `
                    repeating-linear-gradient(0deg, transparent 0, transparent 59px, rgba(201,168,76,0.05) 60px),
                    repeating-linear-gradient(90deg, transparent 0, transparent 59px, rgba(201,168,76,0.05) 60px)
                  `,
                }}
              />
              <svg
                viewBox="0 0 400 400"
                style={{ width: '46%', maxWidth: 320, opacity: 0.25, position: 'relative' }}
                fill="none"
              >
                <rect x="40" y="40" width="320" height="320" stroke={C.accent} strokeWidth="1" />
                <rect x="80" y="80" width="240" height="240" stroke={C.accent} strokeWidth="0.5" />
                <line x1="40" y1="200" x2="360" y2="200" stroke={C.accent} strokeWidth="0.5" />
                <line x1="200" y1="40" x2="200" y2="360" stroke={C.accent} strokeWidth="0.5" />
                <circle cx="200" cy="200" r="80" stroke={C.accent} strokeWidth="0.5" />
                <polygon points="200,80 320,320 80,320" stroke={C.accent} strokeWidth="0.5" fill="none" />
              </svg>
            </div>

            <div
              className="two-col"
              style={{
                display: 'grid',
                gridTemplateColumns: '1.6fr 1fr',
                gap: 64,
                alignItems: 'start',
              }}
            >
              <div>
                <p
                  style={{
                    fontFamily: F.sans,
                    fontSize: 16,
                    color: C.textMuted,
                    lineHeight: 1.9,
                    letterSpacing: '0.01em',
                    margin: 0,
                  }}
                >
                  {selected.description}
                </p>
              </div>
              <div>
                <span
                  style={{
                    fontFamily: F.sans,
                    fontSize: 10,
                    letterSpacing: '0.24em',
                    textTransform: 'uppercase' as const,
                    color: C.accent,
                    display: 'block',
                    marginBottom: 18,
                  }}
                >
                  Spécifications
                </span>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column' as const,
                    gap: 12,
                    marginBottom: 32,
                  }}
                >
                  {selected.specs.map((spec) => (
                    <div
                      key={spec}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        fontFamily: F.sans,
                        fontSize: 13,
                        color: C.textMuted,
                        letterSpacing: '0.02em',
                      }}
                    >
                      <div style={{ width: 20, height: 1, background: C.accent, flexShrink: 0 }} />
                      {spec}
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 1,
                    background: C.border,
                    border: `1px solid ${C.border}`,
                  }}
                >
                  {[
                    { label: 'Lieu', val: selected.location },
                    { label: 'Année', val: selected.year },
                    { label: 'Surface', val: selected.area },
                    { label: 'Typologie', val: selected.category },
                  ].map((item) => (
                    <div key={item.label} style={{ background: C.bgCard, padding: '16px 18px' }}>
                      <div
                        style={{
                          fontFamily: F.sans,
                          fontSize: 9,
                          color: C.textDim,
                          letterSpacing: '0.14em',
                          textTransform: 'uppercase' as const,
                          marginBottom: 6,
                        }}
                      >
                        {item.label}
                      </div>
                      <div
                        style={{
                          fontFamily: F.sans,
                          fontSize: 13,
                          color: C.text,
                          fontWeight: 700,
                          letterSpacing: '-0.01em',
                        }}
                      >
                        {item.val}
                      </div>
                    </div>
                  ))}
                </div>

                <Link href="/templates/impact-48/contact" style={{ textDecoration: "none" }}>
                  <button
                    style={{
                      marginTop: 32,
                      width: '100%',
                      background: C.accent,
                      color: C.bgDark,
                      padding: '15px 28px',
                      fontFamily: F.sans,
                      fontSize: 11,
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase' as const,
                      fontWeight: 700,
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'background 0.3s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#d9b85c')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = C.accent)}
                  >
                    Discuter d'un projet similaire
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // ── Portfolio grid ──
  return (
    <div>
      <PageHero
        eyebrow="Œuvres choisies"
        title={
          <>
            Nos <span style={{ color: C.accent }}>projets</span>
          </>
        }
        subtitle="Une sélection de réalisations et de concours, du logement privé à l'équipement public. Cliquez sur un projet pour en découvrir le détail."
      />
      <section style={{ background: C.bgDark, padding: '90px 40px 120px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div
            className="three-col"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 2,
            }}
          >
            {projects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: (i % 3) * 0.08 }}
                whileHover={{ scale: 1.01 }}
                onClick={() => {
                  setSelectedId(project.id);
                  if (typeof window !== 'undefined')
                    window.scrollTo({ top: 0, behavior: 'auto' });
                }}
                style={{
                  background: project.color,
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  aspectRatio: '4/5',
                  display: 'flex',
                  flexDirection: 'column' as const,
                  justifyContent: 'flex-end',
                  padding: 32,
                  borderTop: `1px solid rgba(201,168,76,0.1)`,
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `
                      repeating-linear-gradient(0deg, transparent 0, transparent 39px, rgba(201,168,76,0.04) 40px),
                      repeating-linear-gradient(90deg, transparent 0, transparent 39px, rgba(201,168,76,0.04) 40px)
                    `,
                    pointerEvents: 'none',
                  }}
                />
                <svg
                  viewBox="0 0 200 200"
                  style={{
                    position: 'absolute',
                    top: 20,
                    right: 20,
                    width: 80,
                    opacity: 0.15,
                    pointerEvents: 'none',
                  }}
                  fill="none"
                >
                  <rect x="20" y="20" width="160" height="160" stroke={C.accent} strokeWidth="1" />
                  <line x1="20" y1="100" x2="180" y2="100" stroke={C.accent} strokeWidth="0.5" />
                  <line x1="100" y1="20" x2="100" y2="180" stroke={C.accent} strokeWidth="0.5" />
                  <circle cx="100" cy="100" r="40" stroke={C.accent} strokeWidth="0.5" />
                </svg>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 12,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: F.sans,
                        fontSize: 9,
                        letterSpacing: '0.24em',
                        textTransform: 'uppercase' as const,
                        color: C.accent,
                        fontWeight: 500,
                      }}
                    >
                      {project.category}
                    </span>
                    <span
                      style={{
                        fontFamily: F.sans,
                        fontSize: 9,
                        letterSpacing: '0.16em',
                        color: 'rgba(255,255,255,0.3)',
                      }}
                    >
                      {project.year}
                    </span>
                  </div>
                  <h3
                    style={{
                      fontFamily: F.sans,
                      fontSize: 22,
                      fontWeight: 700,
                      color: C.white,
                      letterSpacing: '-0.02em',
                      margin: '0 0 6px',
                    }}
                  >
                    {project.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: F.sans,
                      fontSize: 11,
                      color: 'rgba(255,255,255,0.35)',
                      letterSpacing: '0.08em',
                      margin: 0,
                    }}
                  >
                    {project.location} · {project.area}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
