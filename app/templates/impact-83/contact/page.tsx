"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { C, FONT_HEADING, FONT_LABEL, Reveal } from "../shared";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section style={{ padding: "100px 24px", background: C.bgAlt }} id="contact">
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 60 }}>
          
          {/* Coordinates */}
          <div>
            <Reveal>
              <span style={{ fontFamily: FONT_LABEL, fontSize: 10, letterSpacing: "0.3em", color: C.accent, textTransform: "uppercase" }}>
                Salon Privé
              </span>
              <h1 style={{ fontFamily: FONT_HEADING, fontSize: 44, fontWeight: 300, color: C.text, marginTop: 16, marginBottom: 30, lineHeight: 1.15 }}>
                Rendez-vous <em>Privé</em>
              </h1>
              <p style={{ fontSize: 16, color: C.textMuted, lineHeight: 1.7, marginBottom: 40 }}>
                Afin de préserver la confidentialité absolue de nos échanges, nous accueillons nos clients uniquement sur rendez-vous dans notre salon de la Place Vendôme, ou à domicile dans le monde entier.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                  <MapPin size={20} color={C.accent} />
                  <div>
                    <div style={{ fontFamily: FONT_LABEL, fontSize: 10, color: C.accent, textTransform: "uppercase" }}>Adresse</div>
                    <div style={{ fontSize: 15, color: C.text }}>Place Vendôme, 75001 Paris (Détails sur rdv)</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                  <Phone size={20} color={C.accent} />
                  <div>
                    <div style={{ fontFamily: FONT_LABEL, fontSize: 10, color: C.accent, textTransform: "uppercase" }}>Téléphone</div>
                    <div style={{ fontSize: 15, color: C.text }}>+33 1 42 60 87 00</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                  <Mail size={20} color={C.accent} />
                  <div>
                    <div style={{ fontFamily: FONT_LABEL, fontSize: 10, color: C.accent, textTransform: "uppercase" }}>Email</div>
                    <div style={{ fontSize: 15, color: C.text }}>rendezvous@aureliusheritage.com</div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Form */}
          <div>
            {submitted ? (
              <Reveal>
                <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, padding: 40, textAlign: "center" }}>
                  <h2 style={{ fontFamily: FONT_HEADING, fontSize: 28, color: C.accent, marginBottom: 20 }}>Demande Reçue</h2>
                  <p style={{ fontSize: 16, color: C.textMuted, lineHeight: 1.6 }}>
                    Merci, nous vous répondrons sous 24h.
                  </p>
                </div>
              </Reveal>
            ) : (
              <Reveal delay={0.1}>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSubmitted(true);
                  }}
                  style={{ display: "flex", flexDirection: "column", gap: 20 }}
                >
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                    <div>
                      <label style={{ fontFamily: FONT_LABEL, fontSize: 9, color: C.accent, textTransform: "uppercase", display: "block", marginBottom: 8 }}>Prénom</label>
                      <input required type="text" style={{ width: "100%", background: C.bgCard, border: `1px solid ${C.border}`, color: C.text, padding: "12px 16px", outline: "none" }} />
                    </div>
                    <div>
                      <label style={{ fontFamily: FONT_LABEL, fontSize: 9, color: C.accent, textTransform: "uppercase", display: "block", marginBottom: 8 }}>Nom</label>
                      <input required type="text" style={{ width: "100%", background: C.bgCard, border: `1px solid ${C.border}`, color: C.text, padding: "12px 16px", outline: "none" }} />
                    </div>
                  </div>
                  <div>
                    <label style={{ fontFamily: FONT_LABEL, fontSize: 9, color: C.accent, textTransform: "uppercase", display: "block", marginBottom: 8 }}>Email</label>
                    <input required type="email" style={{ width: "100%", background: C.bgCard, border: `1px solid ${C.border}`, color: C.text, padding: "12px 16px", outline: "none" }} />
                  </div>
                  <div>
                    <label style={{ fontFamily: FONT_LABEL, fontSize: 9, color: C.accent, textTransform: "uppercase", display: "block", marginBottom: 8 }}>Téléphone</label>
                    <input required type="tel" style={{ width: "100%", background: C.bgCard, border: `1px solid ${C.border}`, color: C.text, padding: "12px 16px", outline: "none" }} />
                  </div>
                  <div>
                    <label style={{ fontFamily: FONT_LABEL, fontSize: 9, color: C.accent, textTransform: "uppercase", display: "block", marginBottom: 8 }}>Collection souhaitée</label>
                    <select style={{ width: "100%", background: C.bgCard, border: `1px solid ${C.border}`, color: C.text, padding: "12px 16px", outline: "none" }}>
                      <option>Haute Joaillerie</option>
                      <option>Horlogerie Fine</option>
                      <option>Service Bespoke (Sur Mesure)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontFamily: FONT_LABEL, fontSize: 9, color: C.accent, textTransform: "uppercase", display: "block", marginBottom: 8 }}>Message / Notes</label>
                    <textarea rows={4} style={{ width: "100%", background: C.bgCard, border: `1px solid ${C.border}`, color: C.text, padding: "12px 16px", outline: "none", resize: "none" }} />
                  </div>
                  <button
                    type="submit"
                    style={{
                      fontFamily: FONT_LABEL,
                      fontSize: 11,
                      letterSpacing: "0.25em",
                      textTransform: "uppercase",
                      color: C.bg,
                      background: C.accent,
                      border: "none",
                      padding: "16px",
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    DEMANDER UN RENDEZ-VOUS
                  </button>
                </form>
              </Reveal>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
