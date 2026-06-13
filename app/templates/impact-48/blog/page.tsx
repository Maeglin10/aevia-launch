"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { C, F, PageHero, blogPosts } from "../shared";

export default function Blog() {
  const [blogSlug, setBlogSlug] = useState<string | null>(null);
  const post = blogSlug ? blogPosts.find((b) => b.slug === blogSlug) : null;

  if (post) {
    return (
      <div>
        <PageHero eyebrow={post.category} title={post.title} subtitle={post.date} />
        <section style={{ background: C.bg, padding: '90px 40px 120px' }}>
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <button
              onClick={() => setBlogSlug(null)}
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
              ← Tous les articles
            </button>

            <div
              style={{
                position: 'relative',
                height: 'clamp(200px, 34vw, 320px)',
                background: post.cover,
                border: `1px solid ${C.border}`,
                borderTop: `2px solid ${C.accent}`,
                marginBottom: 48,
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
                    repeating-linear-gradient(0deg, transparent 0, transparent 47px, rgba(201,168,76,0.05) 48px),
                    repeating-linear-gradient(90deg, transparent 0, transparent 47px, rgba(201,168,76,0.05) 48px)
                  `,
                }}
              />
              <svg viewBox="0 0 200 200" style={{ width: 120, opacity: 0.2, position: 'relative' }} fill="none">
                <rect x="20" y="20" width="160" height="160" stroke={C.accent} strokeWidth="1" />
                <line x1="20" y1="100" x2="180" y2="100" stroke={C.accent} strokeWidth="0.5" />
                <line x1="100" y1="20" x2="100" y2="180" stroke={C.accent} strokeWidth="0.5" />
                <circle cx="100" cy="100" r="40" stroke={C.accent} strokeWidth="0.5" />
              </svg>
            </div>

            {post.body.map((para, i) => (
              <p
                key={i}
                style={{
                  fontFamily: F.sans,
                  fontSize: 16,
                  color: C.textMuted,
                  lineHeight: 1.9,
                  letterSpacing: '0.01em',
                  marginBottom: 24,
                }}
              >
                {para}
              </p>
            ))}

            <div
              style={{
                borderTop: `1px solid ${C.border}`,
                marginTop: 24,
                paddingTop: 24,
                fontFamily: F.serif,
                fontStyle: 'italic',
                fontSize: 14,
                color: C.textMuted,
                lineHeight: 1.7,
              }}
            >
              Article rédigé par l'équipe de l'Atelier Moreau·Leroy. Ce contenu est publié à titre informatif et reflète la démarche du studio.
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <PageHero
        eyebrow="Le journal de l'atelier"
        title={
          <>
            Blog & <span style={{ color: C.accent }}>réflexions</span>
          </>
        }
        subtitle="Nos prises de position sur l'architecture, les matériaux et la fabrique de la ville. Décryptages et coulisses du studio."
      />
      <section style={{ background: C.bg, padding: '120px 40px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 24,
            }}
          >
            {blogPosts.map((p, i) => (
              <motion.article
                key={p.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: (i % 3) * 0.1 }}
                whileHover={{ y: -4 }}
                onClick={() => {
                  setBlogSlug(p.slug);
                  if (typeof window !== 'undefined')
                    window.scrollTo({ top: 0, behavior: 'auto' });
                }}
                style={{
                  background: C.bgCard,
                  border: `1px solid ${C.border}`,
                  borderTop: `2px solid ${C.accent}`,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column' as const,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    height: 170,
                    background: p.cover,
                    borderBottom: `1px solid ${C.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundImage: `
                        repeating-linear-gradient(0deg, transparent 0, transparent 39px, rgba(201,168,76,0.05) 40px),
                        repeating-linear-gradient(90deg, transparent 0, transparent 39px, rgba(201,168,76,0.04) 40px)
                      `,
                    }}
                  />
                  <svg viewBox="0 0 200 200" style={{ width: 64, opacity: 0.2, position: 'relative' }} fill="none">
                    <rect x="20" y="20" width="160" height="160" stroke={C.accent} strokeWidth="1.2" />
                    <line x1="100" y1="20" x2="100" y2="180" stroke={C.accent} strokeWidth="0.6" />
                    <circle cx="100" cy="100" r="40" stroke={C.accent} strokeWidth="0.6" />
                  </svg>
                </div>
                <div
                  style={{
                    padding: '26px 28px 30px',
                    display: 'flex',
                    flexDirection: 'column' as const,
                    flex: 1,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      marginBottom: 14,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: F.sans,
                        fontSize: 9,
                        color: C.accent,
                        letterSpacing: '0.16em',
                        textTransform: 'uppercase' as const,
                        fontWeight: 700,
                      }}
                    >
                      {p.category}
                    </span>
                    <span
                      style={{
                        fontFamily: F.sans,
                        fontSize: 11,
                        color: C.textDim,
                      }}
                    >
                      · {p.date}
                    </span>
                  </div>
                  <h2
                    style={{
                      fontFamily: F.sans,
                      fontSize: 19,
                      fontWeight: 700,
                      color: C.text,
                      lineHeight: 1.25,
                      letterSpacing: '-0.01em',
                      margin: '0 0 14px',
                    }}
                  >
                    {p.title}
                  </h2>
                  <p
                    style={{
                      fontFamily: F.sans,
                      fontSize: 14,
                      color: C.textMuted,
                      lineHeight: 1.7,
                      margin: '0 0 18px',
                      flex: 1,
                      letterSpacing: '0.01em',
                    }}
                  >
                    {p.excerpt}
                  </p>
                  <span
                    style={{
                      fontFamily: F.sans,
                      fontSize: 11,
                      color: C.accent,
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase' as const,
                      fontWeight: 700,
                    }}
                  >
                    Lire l'article →
                  </span>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
