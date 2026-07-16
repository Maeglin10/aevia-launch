'use client';

import React, { useState } from "react";
import { MapPin, Phone, Mail, Clock, Share2, Volume2, Tv, Check } from "lucide-react";
import { C } from "../shared";

export default function ContactPage() {
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const inputStyle = {
    width: "100%",
    backgroundColor: C.bgCard,
    border: `1px solid ${C.border}`,
    borderRadius: "8px",
    padding: "0.8rem 1rem",
    color: C.text,
    fontFamily: C.bodyFont,
    fontSize: "0.9rem",
    outline: "none",
    boxSizing: "border-box" as const,
  };

  const labelStyle = {
    fontFamily: C.bodyFont,
    fontSize: "0.78rem",
    fontWeight: 600,
    color: C.textLight,
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    marginBottom: "0.4rem",
    display: "block",
  };

  return (
    <div style={{ minHeight: "100dvh", backgroundColor: C.bg, paddingTop: "4rem" }}>
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "3rem 2rem 5rem" }}>
        <span style={{ fontFamily: C.bodyFont, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.accent }}>Nous trouver</span>
        <h1 style={{ fontFamily: C.headingFont, fontSize: "clamp(3rem, 7vw, 5.5rem)", color: C.white, letterSpacing: "0.04em", margin: "0.4rem 0 3rem", lineHeight: 1 }}>CONTACT</h1>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))", gap: "3rem", alignItems: "start" }}>
          {/* Left */}
          <div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginBottom: "2.5rem" }}>
              {[
                { icon: <MapPin size={20} color={C.accent} />, label: "Adresse", value: "Adresse communiquée sur demande", sub: "Contactez-nous à valentinmilliand@aevia.services" },
                { icon: <Phone size={20} color={C.accent} />, label: "Téléphone", value: "+33 1 43 57 88 00", sub: "Lun–Dim, 10h–23h" },
                { icon: <Mail size={20} color={C.accent} />, label: "Email", value: "valentinmilliand@aevia.services", sub: "Réponse sous 2h ouvrées" },
                { icon: <Clock size={20} color={C.accent} />, label: "Horaires", value: "Lundi – Dimanche", sub: "10h00 – 23h00" },
              ].map((item) => (
                <div key={item.label} style={{ display: "flex", gap: "1rem", alignItems: "flex-start", backgroundColor: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "10px", padding: "1.25rem" }}>
                  <div style={{ flexShrink: 0, marginTop: "0.1rem" }}>{item.icon}</div>
                  <div>
                    <div style={{ fontFamily: C.bodyFont, fontSize: "0.7rem", fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.2rem" }}>{item.label}</div>
                    <div style={{ fontFamily: C.bodyFont, fontSize: "0.95rem", color: C.white, fontWeight: 600 }}>{item.value}</div>
                    <div style={{ fontFamily: C.bodyFont, fontSize: "0.8rem", color: C.textMuted, marginTop: "0.15rem" }}>{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Social links */}
            <h3 style={{ fontFamily: C.headingFont, fontSize: "1.2rem", color: C.white, letterSpacing: "0.06em", marginBottom: "1rem" }}>RÉSEAUX SOCIAUX</h3>
            <div style={{ display: "flex", gap: "1rem" }}>
              {[
                { icon: <Share2 size={20} />, label: "Instagram", handle: "@echochamber.studio" },
                { icon: <Volume2 size={20} />, label: "SoundCloud", handle: "echochamber-studio" },
                { icon: <Tv size={20} />, label: "YouTube", handle: "Echo Chamber Studio" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.label === "Instagram" ? "https://instagram.com" : social.label === "SoundCloud" ? "https://soundcloud.com" : "https://youtube.com"}
                  style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", backgroundColor: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "10px", padding: "1rem 0.75rem", textDecoration: "none", transition: "border-color 0.2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.accent)}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.border)}
                >
                  <span style={{ color: C.accent }}>{social.icon}</span>
                  <span style={{ fontFamily: C.bodyFont, fontSize: "0.72rem", color: C.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{social.label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Right — contact form */}
          <div>
            <div style={{ backgroundColor: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "2rem" }}>
              {contactSubmitted ? (
                <div style={{ textAlign: "center", padding: "3rem 1.5rem" }}>
                  <div style={{ width: 64, height: 64, borderRadius: "50%", backgroundColor: `${C.accent}22`, border: `2px solid ${C.accent}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
                    <Check size={28} color={C.accent} />
                  </div>
                  <h3 style={{ fontFamily: C.headingFont, fontSize: "2rem", color: C.white, letterSpacing: "0.04em", marginBottom: "0.75rem" }}>MESSAGE ENVOYÉ</h3>
                  <p style={{ fontFamily: C.bodyFont, color: C.textLight, fontSize: "0.95rem", lineHeight: 1.6 }}>
                    Merci, nous vous répondrons sous 24h.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setContactSubmitted(true);
                  }}
                  style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
                >
                  <h3 style={{ fontFamily: C.headingFont, fontSize: "1.4rem", color: C.white, letterSpacing: "0.06em", marginBottom: "0.5rem" }}>ENVOYER UN MESSAGE</h3>
                  
                  <div>
                    <label style={labelStyle}>Nom complet</label>
                    <input type="text" required style={inputStyle} placeholder="Votre nom" />
                  </div>

                  <div>
                    <label style={labelStyle}>Adresse e-mail</label>
                    <input type="email" required style={inputStyle} placeholder="nom@exemple.com" />
                  </div>

                  <div>
                    <label style={labelStyle}>Sujet</label>
                    <select required style={{ ...inputStyle, appearance: "none" }}>
                      <option value="general">Renseignement général</option>
                      <option value="booking">Question sur une réservation</option>
                      <option value="gear">Équipement & studios</option>
                      <option value="other">Autre</option>
                    </select>
                  </div>

                  <div>
                    <label style={labelStyle}>Message</label>
                    <textarea required rows={4} style={{ ...inputStyle, resize: "vertical" }} placeholder="Votre message..." />
                  </div>

                  <button
                    type="submit"
                    style={{ backgroundColor: C.accent, color: C.white, padding: "0.9rem", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: 700, fontFamily: C.bodyFont, fontSize: "0.95rem", letterSpacing: "0.03em", boxShadow: `0 4px 16px ${C.accentGlow}`, marginTop: "0.5rem" }}
                  >
                    Envoyer
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
