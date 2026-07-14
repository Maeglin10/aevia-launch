"use client";

import React, { useState } from "react";
import { Phone, Mail, MapPin } from "lucide-react";
import {
  C,
  SERIF,
  SANS,
  SectionReveal,
  PageHeader,
  fieldStyle,
  labelStyle,
} from "../shared";

export default function ReservationPage() {
  const [sent, setSent] = useState(false);

  return (
    <section style={{ padding: "140px 5% 100px", background: C.bg, minHeight: "100dvh" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <PageHeader
          kicker="Réserver une table"
          title="Votre soirée au Clos"
          sub="Le service se déroule du mardi au dimanche, de 18h30 à 23h30. Réservation conseillée, en particulier pour les flights de dégustation."
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 56,
            alignItems: "start",
          }}
        >
          <SectionReveal>
            <div
              style={{
                background: C.white,
                border: `1px solid ${C.border}`,
                borderRadius: 4,
                padding: 36,
              }}
            >
              {sent ? (
                <div>
                  <div
                    style={{
                      fontFamily: SERIF,
                      fontSize: 26,
                      fontWeight: 700,
                      color: C.burgundy,
                      marginBottom: 12,
                    }}
                  >
                    Merci
                  </div>
                  <p
                    style={{
                      fontSize: 15,
                      color: C.textMuted,
                      lineHeight: 1.75,
                      fontWeight: 300,
                    }}
                  >
                    Merci, nous vous répondrons sous 24h.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSent(true);
                  }}
                  style={{ display: "flex", flexDirection: "column", gap: 20 }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr",
                      gap: 16,
                    }}
                  >
                    <div>
                      <label style={labelStyle}>Date</label>
                      <input type="date" required style={fieldStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Heure</label>
                      <input type="time" required style={fieldStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Couverts</label>
                      <select required defaultValue="" style={fieldStyle}>
                        <option value="" disabled>
                          —
                        </option>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                          <option key={n} value={n}>
                            {n} {n > 1 ? "personnes" : "personne"}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Nom complet</label>
                    <input
                      type="text"
                      required
                      placeholder="Votre nom"
                      style={fieldStyle}
                    />
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 16,
                    }}
                  >
                    <div>
                      <label style={labelStyle}>Téléphone</label>
                      <input
                        type="tel"
                        required
                        placeholder="06 00 00 00 00"
                        style={fieldStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Email</label>
                      <input
                        type="email"
                        required
                        placeholder="vous@email.com"
                        style={fieldStyle}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Demande particulière</label>
                    <textarea
                      rows={4}
                      placeholder="Occasion, allergies, accord souhaité…"
                      style={{ ...fieldStyle, resize: "none" }}
                    />
                  </div>
                  <button
                    type="submit"
                    style={{
                      alignSelf: "flex-start",
                      background: C.gold,
                      color: C.burgundyDark,
                      padding: "15px 32px",
                      borderRadius: 2,
                      fontWeight: 700,
                      fontSize: 13,
                      border: "none",
                      cursor: "pointer",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      fontFamily: SANS,
                    }}
                  >
                    Demander la réservation
                  </button>
                </form>
              )}
            </div>
          </SectionReveal>

          <SectionReveal delay={0.15}>
            <div
              style={{
                background: C.burgundy,
                borderRadius: 4,
                padding: 36,
              }}
            >
              <div
                style={{
                  fontFamily: SERIF,
                  fontSize: 13,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: C.gold,
                  marginBottom: 24,
                }}
              >
                Horaires & Accès
              </div>
              {[
                ["Mardi – Jeudi", "18h30 – 23h00"],
                ["Vendredi – Samedi", "18h30 – 23h30"],
                ["Dimanche", "18h30 – 22h30"],
                ["Lundi", "Fermé"],
              ].map(([d, h], i) => (
                <div
                  key={d}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 16,
                    paddingBottom: 14,
                    marginBottom: 14,
                    borderBottom:
                      i < 3 ? "1px solid rgba(255,255,255,0.08)" : "none",
                    fontSize: 14,
                    color: "#c4a882",
                    fontWeight: 300,
                  }}
                >
                  <span>{d}</span>
                  <span style={{ color: C.cream }}>{h}</span>
                </div>
              ))}
              <div
                style={{
                  marginTop: 24,
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    fontSize: 14,
                    color: "#c4a882",
                  }}
                >
                  <Phone size={16} color={C.gold} /> +33 1 42 60 80 20
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    fontSize: 14,
                    color: "#c4a882",
                  }}
                >
                  <Mail size={16} color={C.gold} /> valentinmilliand@aevia.services
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    fontSize: 14,
                    color: "#c4a882",
                  }}
                >
                  <MapPin size={16} color={C.gold} style={{ flexShrink: 0, marginTop: 2 }} />{" "}
                  Adresse communiquée sur demande
                </div>
              </div>
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
