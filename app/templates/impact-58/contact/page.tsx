'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Mail, MapPin, CheckCircle } from 'lucide-react';
import { C, StyleInjector, Reveal } from '../shared';

// ── Form data shapes ───────────────────────────────────────────────────────────
type FormData = {
  nom: string;
  email: string;
  typeProjet: string;
  budget: string;
  message: string;
};

const PROJECT_TYPES = [
  'Brand Film',
  'Motion Design',
  'CGI & VFX',
  'Installation',
];

const BUDGETS = [
  '< 20 000 €',
  '20 000 – 80 000 €',
  '80 000 – 200 000 €',
  '200 000 €+',
];

// ── Styled input helper ────────────────────────────────────────────────────────
function InputWrapper({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <label
        style={{
          fontFamily: "'Syne Mono', monospace",
          fontSize: '0.6rem',
          letterSpacing: '0.15em',
          color: C.textMuted,
          textTransform: 'uppercase',
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: C.bgCard,
  border: `1px solid ${C.borderBright}`,
  color: C.text,
  padding: '0.9rem 1.1rem',
  fontFamily: "'DM Sans', sans-serif",
  fontSize: '0.9rem',
  outline: 'none',
  transition: 'border-color 0.25s',
  boxSizing: 'border-box',
};

// ── Success screen ─────────────────────────────────────────────────────────────
function SuccessScreen() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{
        padding: '5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '1.5rem',
        background: C.bgCard,
        border: `1px solid ${C.borderBright}`,
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: C.violet + '20',
          border: `2px solid ${C.violet}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CheckCircle size={28} color={C.violet} />
      </div>
      <div
        style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800,
          fontSize: '2rem',
          letterSpacing: '-0.03em',
          color: C.text,
        }}
      >
        Message transmis.
      </div>
      <p
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '0.95rem',
          color: C.textMuted,
          lineHeight: 1.7,
          maxWidth: '40ch',
          margin: 0,
        }}
      >
        Merci, nous vous répondrons sous 24h.
      </p>
      <div
        style={{
          fontFamily: "'Syne Mono', monospace",
          fontSize: '0.6rem',
          letterSpacing: '0.15em',
          color: C.violet,
          marginTop: '0.5rem',
        }}
      >
        brief@skewos.studio
      </div>
    </motion.div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function ContactPage() {
  const [form, setForm] = useState<FormData>({
    nom: '',
    email: '',
    typeProjet: '',
    budget: '',
    message: '',
  });
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.nom && form.email && form.message) {
      setSubmitted(true);
    }
  };

  const getBorderColor = (field: string) =>
    focusedField === field ? C.violet : C.borderBright;

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
        <section style={{ padding: '5rem 3rem 6rem', position: 'relative', overflow: 'hidden' }}>
          {/* Background decoration */}
          <div
            style={{
              position: 'absolute',
              bottom: '-8rem',
              left: '-8rem',
              width: '500px',
              height: '500px',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${C.violet}10 0%, transparent 65%)`,
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
              SKEW OS — CONTACT
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h1
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                fontSize: 'clamp(4rem, 13vw, 10rem)',
                letterSpacing: '-0.05em',
                color: C.text,
                lineHeight: 0.9,
                margin: '0 0 2.5rem 0',
              }}
            >
              BRIEF
              <br />
              <span
                style={{
                  color: 'transparent',
                  WebkitTextStroke: `1px ${C.violet}`,
                }}
              >
                US
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
                color: C.textMuted,
                lineHeight: 1.7,
                maxWidth: '52ch',
                margin: 0,
              }}
            >
              Dites-nous tout sur votre prochain film. Plus le brief est précis, plus on peut vous surprendre.
            </p>
          </Reveal>
        </section>

        {/* ── 2. Form + Info ─────────────────────────────────────────────── */}
        <section
          style={{
            padding: '0 3rem 8rem',
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: '5rem',
            alignItems: 'start',
          }}
        >
          {/* Form */}
          <div>
            <AnimatePresence mode="wait">
              {submitted ? (
                <SuccessScreen key="success" />
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                  }}
                >
                  {/* Row 1: Nom + Email */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '1.5rem',
                    }}
                  >
                    <InputWrapper label="Nom *">
                      <input
                        type="text"
                        required
                        value={form.nom}
                        onChange={handleChange('nom')}
                        onFocus={() => setFocusedField('nom')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Sophie Martin"
                        style={{ ...inputStyle, borderColor: getBorderColor('nom') }}
                      />
                    </InputWrapper>
                    <InputWrapper label="Email *">
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={handleChange('email')}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="sophie@marque.com"
                        style={{ ...inputStyle, borderColor: getBorderColor('email') }}
                      />
                    </InputWrapper>
                  </div>

                  {/* Row 2: Type de projet + Budget */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '1.5rem',
                    }}
                  >
                    <InputWrapper label="Type de projet">
                      <select
                        value={form.typeProjet}
                        onChange={handleChange('typeProjet')}
                        onFocus={() => setFocusedField('type')}
                        onBlur={() => setFocusedField(null)}
                        style={{
                          ...inputStyle,
                          borderColor: getBorderColor('type'),
                          cursor: 'pointer',
                          appearance: 'none',
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%237A7A90' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'right 1rem center',
                          paddingRight: '2.5rem',
                        }}
                      >
                        <option value="" style={{ background: C.bgCard }}>Sélectionner...</option>
                        {PROJECT_TYPES.map((t) => (
                          <option key={t} value={t} style={{ background: C.bgCard }}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </InputWrapper>

                    <InputWrapper label="Budget estimé">
                      <select
                        value={form.budget}
                        onChange={handleChange('budget')}
                        onFocus={() => setFocusedField('budget')}
                        onBlur={() => setFocusedField(null)}
                        style={{
                          ...inputStyle,
                          borderColor: getBorderColor('budget'),
                          cursor: 'pointer',
                          appearance: 'none',
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%237A7A90' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'right 1rem center',
                          paddingRight: '2.5rem',
                        }}
                      >
                        <option value="" style={{ background: C.bgCard }}>Sélectionner...</option>
                        {BUDGETS.map((b) => (
                          <option key={b} value={b} style={{ background: C.bgCard }}>
                            {b}
                          </option>
                        ))}
                      </select>
                    </InputWrapper>
                  </div>

                  {/* Message */}
                  <InputWrapper label="Votre brief *">
                    <textarea
                      required
                      rows={6}
                      value={form.message}
                      onChange={handleChange('message')}
                      onFocus={() => setFocusedField('message')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Décrivez votre projet, vos objectifs, votre audience, et toute contrainte créative ou technique..."
                      style={{
                        ...inputStyle,
                        borderColor: getBorderColor('message'),
                        resize: 'vertical',
                        minHeight: '140px',
                      }}
                    />
                  </InputWrapper>

                  {/* Submit */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        background: C.violet,
                        color: C.white,
                        border: 'none',
                        padding: '1rem 2.5rem',
                        fontFamily: "'Syne Mono', monospace",
                        fontSize: '0.7rem',
                        letterSpacing: '0.12em',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        transition: 'background 0.3s',
                      }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = C.violetLight)}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = C.violet)}
                    >
                      ENVOYER <ArrowRight size={14} />
                    </motion.button>
                    <span
                      style={{
                        fontFamily: "'Syne Mono', monospace",
                        fontSize: '0.55rem',
                        color: C.textDim,
                        letterSpacing: '0.1em',
                      }}
                    >
                      * champs obligatoires
                    </span>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Info sidebar */}
          <div
            style={{
              width: '280px',
              display: 'flex',
              flexDirection: 'column',
              gap: '3rem',
              paddingTop: '0.5rem',
              flexShrink: 0,
            }}
          >
            {/* Address */}
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  marginBottom: '1rem',
                }}
              >
                <MapPin size={14} color={C.violet} />
                <span
                  style={{
                    fontFamily: "'Syne Mono', monospace",
                    fontSize: '0.6rem',
                    letterSpacing: '0.15em',
                    color: C.textDim,
                  }}
                >
                  ADRESSE
                </span>
              </div>
              <div
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '0.9rem',
                  color: C.text,
                  lineHeight: 1.6,
                }}
              >
                8 Rue de la Paix
                <br />
                75002 Paris, France
              </div>
            </div>

            {/* Email */}
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  marginBottom: '1rem',
                }}
              >
                <Mail size={14} color={C.violet} />
                <span
                  style={{
                    fontFamily: "'Syne Mono', monospace",
                    fontSize: '0.6rem',
                    letterSpacing: '0.15em',
                    color: C.textDim,
                  }}
                >
                  EMAIL
                </span>
              </div>
              <a
                href="mailto:brief@skewos.studio"
                style={{
                  fontFamily: "'Syne Mono', monospace",
                  fontSize: '0.75rem',
                  color: C.violet,
                  textDecoration: 'none',
                  letterSpacing: '0.05em',
                  transition: 'color 0.3s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.violetLight)}
                onMouseLeave={(e) => (e.currentTarget.style.color = C.violet)}
              >
                brief@skewos.studio
              </a>
            </div>

            {/* Availability */}
            <div
              style={{
                background: C.bgCard,
                border: `1px solid ${C.borderBright}`,
                padding: '1.5rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  marginBottom: '0.75rem',
                }}
              >
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#22C55E',
                    boxShadow: '0 0 8px #22C55E80',
                  }}
                />
                <span
                  style={{
                    fontFamily: "'Syne Mono', monospace",
                    fontSize: '0.55rem',
                    letterSpacing: '0.12em',
                    color: '#22C55E',
                  }}
                >
                  DISPONIBLE
                </span>
              </div>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '0.875rem',
                  color: C.textMuted,
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                Disponible dès septembre 2025 pour de nouveaux projets.
              </p>
            </div>

            {/* Response time */}
            <div>
              <div
                style={{
                  fontFamily: "'Syne Mono', monospace",
                  fontSize: '0.6rem',
                  letterSpacing: '0.15em',
                  color: C.textDim,
                  marginBottom: '0.6rem',
                }}
              >
                DÉLAI DE RÉPONSE
              </div>
              <div
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: '1.3rem',
                  letterSpacing: '-0.02em',
                  color: C.text,
                }}
              >
                48 heures
              </div>
              <div
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '0.8rem',
                  color: C.textMuted,
                  marginTop: '0.3rem',
                }}
              >
                ouvrées max
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. Final reassurance ───────────────────────────────────────── */}
        <section
          style={{
            padding: '5rem 3rem',
            background: C.bgCard,
            borderTop: `1px solid ${C.border}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '2rem',
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'Syne Mono', monospace",
                fontSize: '0.6rem',
                letterSpacing: '0.15em',
                color: C.textDim,
                marginBottom: '0.8rem',
              }}
            >
              ON NE TRAVAILLE QU'AVEC 4 CLIENTS EN SIMULTANÉ
            </div>
            <div
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                fontSize: 'clamp(1.2rem, 3vw, 2rem)',
                letterSpacing: '-0.02em',
                color: C.text,
              }}
            >
              Chaque projet reçoit notre attention complète.
            </div>
          </div>
          <div style={{ display: 'flex', gap: '3rem' }}>
            {[
              { n: '4', label: 'clients max' },
              { n: '100%', label: 'sur mesure' },
              { n: '0', label: 'template' },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 800,
                    fontSize: '2rem',
                    color: C.violet,
                    letterSpacing: '-0.03em',
                  }}
                >
                  {s.n}
                </div>
                <div
                  style={{
                    fontFamily: "'Syne Mono', monospace",
                    fontSize: '0.55rem',
                    letterSpacing: '0.12em',
                    color: C.textDim,
                  }}
                >
                  {s.label.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
