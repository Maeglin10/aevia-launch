"use client";

import React from "react";
import Link from "next/link";
import { MapPin, Phone, Mail, Clock, Calendar } from "lucide-react";
import { C, SectionReveal, GoldDivider } from "../shared";

export default function ContactPage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: C.bg, paddingTop: "8rem", paddingBottom: "5rem" }}>
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "0 1.5rem" }}>
        <SectionReveal>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <span style={{ fontFamily: C.bodyFont, fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.earth }}>
              Venez nous rendre visite
            </span>
            <h1 style={{ fontFamily: C.headingFont, fontSize: "clamp(2.2rem, 5vw, 3.5rem)", color: C.text, fontWeight: 700, margin: "0.6rem 0 1rem", lineHeight: 1.15 }}>
              Contact & Accès
            </h1>
          </div>
        </SectionReveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2.5rem", marginBottom: "2.5rem" }}>
          <SectionReveal>
            <div style={{ backgroundColor: C.bgDark, borderRadius: "1.75rem", padding: "2.5rem", height: "100%" }}>
              <h2 style={{ fontFamily: C.headingFont, fontSize: "1.3rem", fontWeight: 700, color: C.bg, marginBottom: "1.75rem" }}>
                Nous trouver
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {[
                  {
                    icon: <MapPin size={18} />,
                    label: "Adresse",
                    value: "Valentin Milliand, SIREN 852 546 225, RCS Bourg-en-Bresse (adresse communiquée sur demande à valentinmilliand@aevia.services) — Beaujolais, France"
                  },
                  { icon: <Phone size={18} />, label: "Téléphone", value: "+33 4 74 XX XX XX" },
                  { icon: <Mail size={18} />, label: "Email", value: "valentinmilliand@aevia.services" },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "0.6rem",
                        backgroundColor: "rgba(240,192,64,0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        color: C.accent,
                      }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <div style={{ fontFamily: C.bodyFont, fontSize: "0.72rem", fontWeight: 700, color: C.accent, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.25rem" }}>
                        {item.label}
                      </div>
                      <div style={{ fontFamily: C.bodyFont, fontSize: "0.9rem", color: "rgba(253,249,238,0.7)", lineHeight: 1.55 }}>
                        {item.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.1}>
            <div style={{ backgroundColor: C.white, borderRadius: "1.75rem", padding: "2.5rem", border: `1px solid ${C.border}`, height: "100%" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.75rem" }}>
                <Clock size={18} color={C.accentDark} />
                <h2 style={{ fontFamily: C.headingFont, fontSize: "1.3rem", fontWeight: 700, color: C.text, margin: 0 }}>
                  Horaires d'ouverture
                </h2>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                {[
                  { day: "Mardi – Samedi", service: "Déjeuner", hours: "12h00 – 14h00" },
                  { day: "Mardi – Samedi", service: "Dîner", hours: "19h30 – 22h00" },
                  { day: "Dimanche", service: "", hours: "Fermé" },
                  { day: "Lundi", service: "", hours: "Fermé" },
                ].map((s, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "1rem 0",
                      borderBottom: i < 3 ? `1px solid ${C.border}` : "none",
                    }}
                  >
                    <div>
                      <div style={{ fontFamily: C.bodyFont, fontSize: "0.88rem", fontWeight: 600, color: C.text }}>{s.day}</div>
                      {s.service && <div style={{ fontFamily: C.bodyFont, fontSize: "0.78rem", color: C.textMuted, marginTop: "0.15rem" }}>{s.service}</div>}
                    </div>
                    <div style={{ fontFamily: C.bodyFont, fontSize: "0.88rem", color: s.hours === "Fermé" ? C.textMuted : C.accentDark, fontWeight: 600 }}>
                      {s.hours}
                    </div>
                  </div>
                ))}
              </div>

              <GoldDivider />

              <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                {[
                  { icon: "🅿️", text: "Parking disponible sur place" },
                  { icon: "♿", text: "Accès PMR — Restaurant de plain-pied" },
                  { icon: "🚗", text: "Service voiturier vendredi et samedi soir" },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                    <span style={{ fontSize: "1rem" }}>{item.icon}</span>
                    <span style={{ fontFamily: C.bodyFont, fontSize: "0.85rem", color: C.textLight }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </SectionReveal>
        </div>

        <SectionReveal delay={0.15}>
          <div style={{ textAlign: "center" }}>
            <Link href="/templates/impact-40/reservation" style={{ textDecoration: "none" }}>
              <button
                type="button"
                style={{
                  backgroundColor: C.bgDark,
                  color: C.accent,
                  padding: "1rem 2.5rem",
                  borderRadius: "3rem",
                  border: "none",
                  fontWeight: 700,
                  fontFamily: C.bodyFont,
                  fontSize: "0.95rem",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                Réserver une table <Calendar size={16} />
              </button>
            </Link>
          </div>
        </SectionReveal>
      </div>
    </div>
  );
}
