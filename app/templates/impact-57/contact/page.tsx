'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MapPin, ArrowRight, CheckCircle } from 'lucide-react';
import { C, Reveal, StyleInjector, CustomCursor } from '../shared';

// ── Form field types ─────────────────────────────────────────────────────────
interface FormState {
  nom: string;
  email: string;
  typeProjet: string;
  budget: string;
  message: string;
}

const PROJECT_TYPES = [
  'Brand Identity',
  'Motion Design',
  'Digital Experience',
  'Art Direction',
  'Autre',
];

const BUDGETS = ['< 10k€', '10k–50k€', '50k–150k€', '150k€+'];

// ── Input style helper ───────────────────────────────────────────────────────
const inputBase: React.CSSProperties = {
  width: '100%',
  background: C.bgCard,
  border: `1px solid ${C.border}`,
  color: C.text,
  padding: '0.9rem 1.1rem',
  fontFamily: "'Space Mono', monospace",
  fontSize: '0.8rem',
  outline: 'none',
  transition: 'border-color 0.25s',
  boxSizing: 'border-box' as const,
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: "'Space Mono', monospace",
  fontSize: '0.55rem',
  letterSpacing: '0.2em',
  color: C.textMuted,
  textTransform: 'uppercase' as const,
  marginBottom: '0.6rem',
};

// ── Contact Page ──────────────────────────────────────────────────────────────
export default function ContactPage() {
  const [form, setForm] = useState<FormState>({
    nom: '',
    email: '',
    typeProjet: '',
    budget: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.nom && form.email && form.message) {
      setSubmitted(true);
    }
  };

  const getBorderColor = (field: string) =>
    focusedField === field ? C.accent : C.border;

  return (
    <div style={{ background: C.bg, minHeight: '100vh' }}>
      <CustomCursor />
      <StyleInjector />

      {/* ── 1. Hero ───────────────────────────────────────────────────────── */}
      <section
        style={{
          padding: '8rem 3rem 5rem',
          borderBottom: `1px solid ${C.border}`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background watermark */}
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
              fontSize: 'clamp(5rem, 15vw, 14rem)',
              fontWeight: 700,
              color: C.bgLight,
              letterSpacing: '-0.05em',
              lineHeight: 1,
              whiteSpace: 'nowrap',
            }}
          >
            CONTACT
          </div>
        </div>

        <div
          style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}
        >
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
              / CONTACT
            </div>
          </Reveal>

          <div style={{ overflow: 'hidden', marginBottom: '0.5rem' }}>
            <motion.h1
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(3rem, 8vw, 7rem)',
                fontWeight: 700,
                color: C.text,
                letterSpacing: '-0.04em',
                lineHeight: 0.95,
                margin: 0,
              }}
            >
              TRAVAILLONS
            </motion.h1>
          </div>
          <div style={{ overflow: 'hidden' }}>
            <motion.div
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(3rem, 8vw, 7rem)',
                fontWeight: 700,
                color: C.accent,
                letterSpacing: '-0.04em',
                lineHeight: 0.95,
              }}
            >
              ENSEMBLE
            </motion.div>
          </div>

          <Reveal delay={0.4}>
            <p
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: '0.82rem',
                color: C.textMuted,
                lineHeight: 1.9,
                maxWidth: '50ch',
                marginTop: '3rem',
              }}
            >
              Nous avons de la place pour 3 nouveaux clients en Q3 2025. Si votre projet nous intrigue, nous pouvons en parler.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── 2. Form + Info ────────────────────────────────────────────────── */}
      <section style={{ padding: '6rem 3rem 8rem' }}>
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '1fr 380px',
            gap: '6rem',
            alignItems: 'start',
          }}
        >
          {/* Left: Form */}
          <div>
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    background: C.bgCard,
                    border: `1px solid ${C.accent}`,
                    padding: '4rem',
                    textAlign: 'center',
                  }}
                >
                  <CheckCircle
                    size={48}
                    color={C.accent}
                    style={{ marginBottom: '1.5rem' }}
                  />
                  <h3
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: '2rem',
                      fontWeight: 700,
                      color: C.text,
                      letterSpacing: '-0.02em',
                      marginBottom: '1rem',
                    }}
                  >
                    Merci, on revient vers vous !
                  </h3>
                  <p
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: '0.75rem',
                      color: C.textMuted,
                      lineHeight: 1.8,
                    }}
                  >
                    Nous avons bien reçu votre message. Nous vous recontactons sous 48h ouvrées.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
                >
                  {/* Row: Nom + Email */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '1.5rem',
                    }}
                  >
                    <div>
                      <label htmlFor="nom" style={labelStyle}>
                        Votre nom
                      </label>
                      <input
                        id="nom"
                        name="nom"
                        type="text"
                        required
                        value={form.nom}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('nom')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Jean Dupont"
                        style={{
                          ...inputBase,
                          borderColor: getBorderColor('nom'),
                        }}
                      />
                    </div>
                    <div>
                      <label htmlFor="email" style={labelStyle}>
                        Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="hello@domain.com"
                        style={{
                          ...inputBase,
                          borderColor: getBorderColor('email'),
                        }}
                      />
                    </div>
                  </div>

                  {/* Row: Type projet + Budget */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '1.5rem',
                    }}
                  >
                    <div>
                      <label htmlFor="typeProjet" style={labelStyle}>
                        Type de projet
                      </label>
                      <select
                        id="typeProjet"
                        name="typeProjet"
                        value={form.typeProjet}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('typeProjet')}
                        onBlur={() => setFocusedField(null)}
                        style={{
                          ...inputBase,
                          borderColor: getBorderColor('typeProjet'),
                          appearance: 'none' as const,
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'right 1rem center',
                          cursor: 'pointer',
                        }}
                      >
                        <option value="" disabled>
                          Sélectionner...
                        </option>
                        {PROJECT_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="budget" style={labelStyle}>
                        Budget estimé
                      </label>
                      <select
                        id="budget"
                        name="budget"
                        value={form.budget}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('budget')}
                        onBlur={() => setFocusedField(null)}
                        style={{
                          ...inputBase,
                          borderColor: getBorderColor('budget'),
                          appearance: 'none' as const,
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'right 1rem center',
                          cursor: 'pointer',
                        }}
                      >
                        <option value="" disabled>
                          Sélectionner...
                        </option>
                        {BUDGETS.map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" style={labelStyle}>
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={form.message}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('message')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Décrivez votre projet, vos objectifs, votre calendrier..."
                      style={{
                        ...inputBase,
                        borderColor: getBorderColor('message'),
                        resize: 'none' as const,
                        lineHeight: 1.7,
                      }}
                    />
                  </div>

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      background: C.accent,
                      color: C.bg,
                      border: 'none',
                      padding: '1.2rem 2.5rem',
                      fontFamily: "'Space Mono', monospace",
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase' as const,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      alignSelf: 'flex-start',
                      transition: 'background 0.3s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = C.accentAlt; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = C.accent; }}
                  >
                    Envoyer le brief <ArrowRight size={14} />
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Right: Info column */}
          <div style={{ position: 'sticky', top: '100px' }}>
            <Reveal>
              {/* Availability badge */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: `${C.accent}18`,
                  border: `1px solid ${C.accent}`,
                  padding: '0.5rem 1rem',
                  marginBottom: '3rem',
                }}
              >
                <div
                  style={{
                    width: '6px',
                    height: '6px',
                    background: C.accent,
                    borderRadius: '50%',
                    animation: 'pulse 2s infinite',
                  }}
                />
                <span
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: '0.55rem',
                    color: C.accent,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase' as const,
                  }}
                >
                  Disponible Q3 2025
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div style={{ marginBottom: '2.5rem' }}>
                <div
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: '0.55rem',
                    color: C.textDim,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase' as const,
                    marginBottom: '0.75rem',
                  }}
                >
                  Adresse
                </div>
                <div
                  style={{
                    display: 'flex',
                    gap: '0.75rem',
                    alignItems: 'flex-start',
                  }}
                >
                  <MapPin size={14} color={C.accent} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div
                      style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontSize: '0.9rem',
                        color: C.text,
                        lineHeight: 1.6,
                        fontWeight: 500,
                      }}
                    >
                      12 Rue du Faubourg Saint-Honoré
                      <br />
                      75008 Paris, France
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <div
                style={{
                  borderTop: `1px solid ${C.border}`,
                  paddingTop: '2rem',
                  marginBottom: '2.5rem',
                }}
              >
                <div
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: '0.55rem',
                    color: C.textDim,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase' as const,
                    marginBottom: '0.75rem',
                  }}
                >
                  Email
                </div>
                <div
                  style={{
                    display: 'flex',
                    gap: '0.75rem',
                    alignItems: 'center',
                  }}
                >
                  <Mail size={14} color={C.accent} style={{ flexShrink: 0 }} />
                  <a
                    href="mailto:hello@mask-unit.com"
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: '0.8rem',
                      color: C.text,
                      textDecoration: 'none',
                      transition: 'color 0.25s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = C.accent; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = C.text; }}
                  >
                    hello@mask-unit.com
                  </a>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div
                style={{
                  borderTop: `1px solid ${C.border}`,
                  paddingTop: '2rem',
                  background: C.bgCard,
                  border: `1px solid ${C.border}`,
                  padding: '1.5rem',
                }}
              >
                <div
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: '0.55rem',
                    color: C.textDim,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase' as const,
                    marginBottom: '1rem',
                  }}
                >
                  Délai de réponse
                </div>
                <p
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: '0.7rem',
                    color: C.textMuted,
                    lineHeight: 1.8,
                  }}
                >
                  Nous répondons à chaque demande sous 48h ouvrées. Si votre projet correspond à nos créneaux disponibles, nous organisons un premier appel découverte.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.25}>
              <style>{`
                @keyframes pulse {
                  0%, 100% { opacity: 1; }
                  50% { opacity: 0.4; }
                }
              `}</style>
              <div
                style={{
                  marginTop: '2rem',
                  display: 'flex',
                  gap: '1rem',
                }}
              >
                {['Instagram', 'LinkedIn', 'Behance'].map((platform) => (
                  <span
                    key={platform}
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: '0.55rem',
                      color: C.textDim,
                      letterSpacing: '0.1em',
                      cursor: 'pointer',
                      transition: 'color 0.25s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = C.accent; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = C.textDim; }}
                  >
                    {platform}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
