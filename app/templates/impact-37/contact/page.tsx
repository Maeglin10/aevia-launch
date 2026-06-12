"use client";

import React, { useState } from "react";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import {
  C,
  SERIF,
  SANS,
  SectionReveal,
  PageHeader,
  fieldStyle,
  labelStyle,
} from "../shared";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <section style={{ padding: "140px 5% 100px", background: C.bgAlt, minHeight: "100vh" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <PageHeader
          kicker="Nous Joindre"
          title="Prenez contact"
          sub="Pour une réservation, une dégustation privée, un événement ou une question sur la cave — écrivez-nous, nous répondons avec soin."
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
                background: C.burgundy,
                borderRadius: 4,
                padding: 36,
                display: "flex",
                flexDirection: "column",
                gap: 28,
              }}
            >
              {[
                {
                  Icon: MapPin,
                  label: "Adresse",
                  value: "Adresse communiquée sur demande à contact@aevia.io",
                },
                { Icon: Phone, label: "Téléphone", value: "+33 1 42 60 80 20" },
                { Icon: Mail, label: "Email", value: "contact@aevia.io" },
                { Icon: Clock, label: "Horaires", value: "Mardi – Dimanche · 18h30 – 23h30" },
              ].map(({ Icon, label, value }) => (
                <div key={label}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      color: C.gold,
                      marginBottom: 8,
                    }}
                  >
                    <Icon size={16} />
                    <span
                      style={{
                        fontFamily: SERIF,
                        fontSize: 13,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        fontWeight: 700,
                      }}
                    >
                      {label}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: 14,
                      color: "#c4a882",
                      lineHeight: 1.7,
                      fontWeight: 300,
                      margin: 0,
                    }}
                  >
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </SectionReveal>

          <SectionReveal delay={0.15}>
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
                    Message envoyé.
                  </div>
                  <p
                    style={{
                      fontSize: 15,
                      color: C.textMuted,
                      lineHeight: 1.75,
                      fontWeight: 300,
                    }}
                  >
                    Merci de nous avoir écrit. Nous vous répondrons dans les plus
                    brefs délais.
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
                      gridTemplateColumns: "1fr 1fr",
                      gap: 16,
                    }}
                  >
                    <div>
                      <label style={labelStyle}>Nom</label>
                      <input
                        type="text"
                        required
                        placeholder="Votre nom"
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
                    <label style={labelStyle}>Sujet</label>
                    <input
                      type="text"
                      placeholder="Objet de votre message"
                      style={fieldStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Message</label>
                    <textarea
                      rows={6}
                      required
                      placeholder="Votre message…"
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
                    Envoyer le message
                  </button>
                </form>
              )}
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
