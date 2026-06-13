"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { C, F, PageHero } from "../shared";

export default function Contact() {
  const [sent, setSent] = useState(false);

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: C.white,
    fontFamily: F.sans,
    fontSize: 16, // ≥16px to avoid iOS zoom on focus
    letterSpacing: '0.01em',
    padding: '14px 18px',
    outline: 'none',
    transition: 'border-color 0.3s',
    display: 'block',
    boxSizing: 'border-box' as const,
    marginBottom: 18,
  };
  const labelStyle: React.CSSProperties = {
    fontFamily: F.sans,
    fontSize: 10,
    color: C.accent,
    letterSpacing: '0.2em',
    textTransform: 'uppercase' as const,
    fontWeight: 500,
    marginBottom: 8,
    display: 'block',
  };

  return (
    <div>
      <PageHero
        eyebrow="Nouvelle demande"
        title={
          <>
            Engageons la
            <br />
            <span style={{ color: C.accent }}>conversation.</span>
          </>
        }
        subtitle="Chaque projet commence par un échange — sans brief, sans honoraires, sans engagement. Parlez-nous de votre projet ; nous organisons un premier rendez-vous sous cinq jours ouvrés."
      />
      <section style={{ background: C.bgDark, padding: '120px 40px' }}>
        <div
          className="two-col"
          style={{
            maxWidth: 1400,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 100,
            alignItems: 'start',
          }}
        >
          {/* Info */}
          <div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column' as const,
                gap: 28,
              }}
            >
              {[
                { label: 'Studio Paris', val: '14 Rue du Dragon, 75006 Paris' },
                { label: 'Bureau Genève', val: '12 Quai du Mont-Blanc, 1201 Genève' },
                { label: 'Email', val: 'contact@aevia.io' },
                { label: 'Horaires', val: 'Lun – Ven · 9h – 19h' },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    display: 'flex',
                    gap: 20,
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    paddingBottom: 24,
                  }}
                >
                  <span
                    style={{
                      fontFamily: F.sans,
                      fontSize: 10,
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase' as const,
                      color: C.accent,
                      minWidth: 110,
                      flexShrink: 0,
                      paddingTop: 4,
                    }}
                  >
                    {item.label}
                  </span>
                  <span
                    style={{
                      fontFamily: F.sans,
                      fontSize: 17,
                      color: C.white,
                      lineHeight: 1.5,
                      letterSpacing: '0.01em',
                    }}
                  >
                    {item.val}
                  </span>
                </div>
              ))}
            </div>
            <p
              style={{
                fontFamily: F.sans,
                fontSize: 14,
                color: 'rgba(255,255,255,0.4)',
                lineHeight: 1.85,
                marginTop: 32,
                maxWidth: 400,
                letterSpacing: '0.01em',
              }}
            >
              Vos informations sont traitées en toute confidentialité et ne sont jamais transmises à des tiers. Nous répondons à toute demande sous cinq jours ouvrés.
            </p>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8 }}
          >
            {sent ? (
              <div
                style={{
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderTop: `2px solid ${C.accent}`,
                  padding: '64px 48px',
                  textAlign: 'center' as const,
                }}
              >
                <div
                  style={{
                    fontFamily: F.sans,
                    fontSize: 24,
                    fontWeight: 700,
                    color: C.white,
                    letterSpacing: '-0.02em',
                    marginBottom: 14,
                  }}
                >
                  Demande envoyée
                </div>
                <p
                  style={{
                    fontFamily: F.sans,
                    fontSize: 15,
                    color: 'rgba(255,255,255,0.45)',
                    lineHeight: 1.8,
                    margin: 0,
                  }}
                >
                  Merci. Un membre de l'atelier vous recontactera sous cinq jours ouvrés.
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
                style={{
                  border: '1px solid rgba(255,255,255,0.07)',
                  padding: 48,
                }}
              >
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 12,
                  }}
                >
                  <div>
                    <label style={labelStyle}>Nom complet</label>
                    <input
                      type="text"
                      required
                      placeholder="Votre nom"
                      style={inputStyle}
                      onFocus={(e) => (e.currentTarget.style.borderColor = C.accentBorder)}
                      onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Email</label>
                    <input
                      type="email"
                      required
                      placeholder="votre@email.fr"
                      style={inputStyle}
                      onFocus={(e) => (e.currentTarget.style.borderColor = C.accentBorder)}
                      onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                    />
                  </div>
                </div>

                <label style={labelStyle}>Type de projet</label>
                <select
                  style={{ ...inputStyle, appearance: 'none' as const, cursor: 'pointer' }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = C.accentBorder)}
                  onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                  defaultValue=""
                >
                  <option value="" style={{ background: C.bgDark }}>
                    Sélectionnez…
                  </option>
                  {[
                    'Maison / villa privée',
                    'Logement collectif',
                    'Équipement culturel',
                    'Bâtiment tertiaire',
                    'Rénovation / patrimoine',
                    'Urbanisme',
                    'Architecture intérieure',
                    'Autre',
                  ].map((t) => (
                    <option key={t} value={t} style={{ background: C.bgDark }}>
                      {t}
                    </option>
                  ))}
                </select>

                <label style={labelStyle}>Votre projet</label>
                <textarea
                  required
                  rows={6}
                  placeholder="Parlez-nous de votre site, de votre programme, de vos délais et de votre budget si vous le connaissez."
                  style={{ ...inputStyle, resize: 'vertical' as const, lineHeight: 1.7, minHeight: 140 }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = C.accentBorder)}
                  onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                />

                <button
                  type="submit"
                  style={{
                    background: C.accent,
                    color: C.bgDark,
                    fontFamily: F.sans,
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase' as const,
                    padding: '16px 32px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background 0.3s',
                    width: '100%',
                    marginTop: 4,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#d9b85c')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = C.accent)}
                >
                  Envoyer la demande
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
