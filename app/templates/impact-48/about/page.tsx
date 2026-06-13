"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { C, F, PageHero, teamMembers, studioValues } from "../shared";

export default function About() {
  return (
    <div>
      <PageHero
        eyebrow="Le studio"
        title={
          <>
            Bâtir pour le
            <br />
            <span style={{ color: C.accent }}>siècle à venir.</span>
          </>
        }
        subtitle="Atelier Moreau·Leroy est un studio d'architecture et d'urbanisme fondé à Paris en 2001, animé par une conviction : l'architecture a d'abord un devoir envers la ville qui en hérite."
      />

      {/* Story */}
      <section style={{ background: C.bg, padding: '120px 40px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          {[
            "Fondé en 2001 par Isabelle Moreau au retour de sept années passées chez OMA à Rotterdam, l'atelier s'est construit autour d'une exigence : concevoir des bâtiments capables de résister aux modes et de durer au-delà du programme qui les a fait naître.",
            "Nous travaillons avec des matériaux robustes, une structure assumée et une générosité spatiale. La coupe précède le plan ; la structure est l'ornement. Cette discipline, constante depuis vingt-trois ans, donne à nos projets une cohérence reconnaissable.",
            "En vingt-trois ans, l'atelier a livré 62 bâtiments dans 11 pays, reçu 28 distinctions et participé trois fois à la Biennale de Venise. Mais notre fierté la plus durable reste le taux d'attachement de ceux qui habitent et utilisent nos bâtiments.",
          ].map((para, i) => (
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
        </div>
      </section>

      {/* Values */}
      <section style={{ background: C.bgDark, padding: '120px 40px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div style={{ textAlign: 'center' as const, marginBottom: 72 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 14,
                marginBottom: 24,
              }}
            >
              <div style={{ width: 40, height: 1, background: C.accent }} />
              <span
                style={{
                  fontFamily: F.sans,
                  fontSize: 10,
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase' as const,
                  color: C.accent,
                }}
              >
                Nos valeurs
              </span>
              <div style={{ width: 40, height: 1, background: C.accent }} />
            </div>
            <h2
              style={{
                fontFamily: F.sans,
                fontSize: 'clamp(32px, 4vw, 56px)',
                fontWeight: 700,
                color: C.white,
                letterSpacing: '-0.03em',
                lineHeight: 1.0,
                margin: 0,
              }}
            >
              Pérennité. Honnêteté. Générosité.
            </h2>
          </div>
          <div
            className="three-col"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 2,
            }}
          >
            {studioValues.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  padding: 48,
                  borderTop: `2px solid ${C.accent}`,
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <span
                  style={{
                    fontFamily: F.sans,
                    fontSize: 11,
                    color: C.accent,
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    display: 'block',
                    marginBottom: 20,
                  }}
                >
                  {v.n}
                </span>
                <h3
                  style={{
                    fontFamily: F.sans,
                    fontSize: 20,
                    fontWeight: 700,
                    color: C.white,
                    letterSpacing: '-0.01em',
                    margin: '0 0 14px',
                  }}
                >
                  {v.title}
                </h3>
                <p
                  style={{
                    fontFamily: F.sans,
                    fontSize: 14,
                    color: 'rgba(255,255,255,0.45)',
                    lineHeight: 1.8,
                    margin: 0,
                    letterSpacing: '0.01em',
                  }}
                >
                  {v.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section style={{ background: C.bg, padding: '120px 40px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div style={{ marginBottom: 64 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                marginBottom: 24,
              }}
            >
              <div style={{ width: 40, height: 1, background: C.accent }} />
              <span
                style={{
                  fontFamily: F.sans,
                  fontSize: 10,
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase' as const,
                  color: C.accent,
                }}
              >
                L'équipe
              </span>
            </div>
            <h2
              style={{
                fontFamily: F.sans,
                fontSize: 'clamp(36px, 4.5vw, 56px)',
                fontWeight: 700,
                color: C.text,
                letterSpacing: '-0.03em',
                lineHeight: 1.0,
                margin: 0,
              }}
            >
              Les associés
            </h2>
          </div>

          <div
            className="three-col"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 2,
              background: C.border,
            }}
          >
            {teamMembers.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                style={{
                  background: C.bgCard,
                  padding: 44,
                  borderTop: `2px solid ${i === 0 ? C.accent : 'transparent'}`,
                  transition: 'border-top-color 0.3s',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderTopColor = C.accent)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderTopColor =
                    i === 0 ? C.accent : 'transparent')
                }
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    background: C.accentDim,
                    border: `1px solid ${C.accentBorder}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 28,
                  }}
                >
                  <span
                    style={{
                      fontFamily: F.sans,
                      fontSize: 20,
                      fontWeight: 700,
                      color: C.accent,
                    }}
                  >
                    {member.name
                      .split(' ')
                      .map((w) => w[0])
                      .join('')}
                  </span>
                </div>
                <h3
                  style={{
                    fontFamily: F.sans,
                    fontSize: 18,
                    fontWeight: 700,
                    color: C.text,
                    letterSpacing: '-0.01em',
                    margin: '0 0 6px',
                  }}
                >
                  {member.name}
                </h3>
                <p
                  style={{
                    fontFamily: F.sans,
                    fontSize: 11,
                    color: C.accent,
                    letterSpacing: '0.1em',
                    margin: '0 0 4px',
                    fontWeight: 500,
                  }}
                >
                  {member.title}
                </p>
                <p
                  style={{
                    fontFamily: F.sans,
                    fontSize: 11,
                    color: C.textDim,
                    letterSpacing: '0.06em',
                    margin: '0 0 24px',
                  }}
                >
                  {member.credentials}
                </p>
                <p
                  style={{
                    fontFamily: F.sans,
                    fontSize: 13,
                    color: C.textMuted,
                    lineHeight: 1.8,
                    margin: 0,
                    letterSpacing: '0.01em',
                  }}
                >
                  {member.bio}
                </p>
              </motion.div>
            ))}
          </div>

          <div style={{ textAlign: 'center' as const, marginTop: 64 }}>
            <Link href="/templates/impact-48/contact" style={{ textDecoration: "none" }}>
              <button
                style={{
                  background: C.accent,
                  color: C.bgDark,
                  padding: '15px 40px',
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
                Rencontrer l'atelier
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
