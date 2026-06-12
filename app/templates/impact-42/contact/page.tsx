'use client';

import React from "react";
import { MapPin, Phone, Mail, Clock, Share2, Volume2, Tv, Calendar } from "lucide-react";
import { C } from "../shared";

export default function ContactPage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: C.bg, paddingTop: "4rem" }}>
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "3rem 2rem 5rem" }}>
        <span style={{ fontFamily: C.bodyFont, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.accent }}>Nous trouver</span>
        <h1 style={{ fontFamily: C.headingFont, fontSize: "clamp(3rem, 7vw, 5.5rem)", color: C.white, letterSpacing: "0.04em", margin: "0.4rem 0 3rem", lineHeight: 1 }}>CONTACT</h1>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "3rem", alignItems: "start" }}>
          {/* Left */}
          <div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginBottom: "2.5rem" }}>
              {[
                { icon: <MapPin size={20} color={C.accent} />, label: "Adresse", value: "Adresse communiquée sur demande", sub: "Contactez-nous à contact@aevia.io" },
                { icon: <Phone size={20} color={C.accent} />, label: "Téléphone", value: "+33 1 43 57 88 00", sub: "Lun–Dim, 10h–23h" },
                { icon: <Mail size={20} color={C.accent} />, label: "Email", value: "contact@aevia.io", sub: "Réponse sous 2h ouvrées" },
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
                  href="#"
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

          {/* Right — map placeholder + booking note */}
          <div>
            <div style={{ backgroundColor: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "12px", overflow: "hidden", marginBottom: "1.5rem" }}>
              <img
                src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80&fit=crop"
                alt="Studio exterior"
                loading="lazy"
                style={{ width: "100%", height: 300, objectFit: "cover", display: "block" }}
              />
              <div style={{ padding: "1.5rem" }}>
                <h3 style={{ fontFamily: C.headingFont, fontSize: "1.3rem", color: C.white, letterSpacing: "0.04em", marginBottom: "0.5rem" }}>COMMENT NOUS REJOINDRE</h3>
                <p style={{ fontFamily: C.bodyFont, fontSize: "0.87rem", color: C.textLight, lineHeight: 1.75 }}>
                  Notre adresse précise vous est communiquée après confirmation de réservation. Studio situé à Paris, facilement accessible en métro et avec parking à proximité. Contactez-nous à <strong style={{ color: C.accent }}>contact@aevia.io</strong> pour obtenir les accès.
                </p>
              </div>
            </div>

            <div style={{ backgroundColor: `${C.accent}18`, border: `1px solid ${C.accent}44`, borderRadius: "10px", padding: "1.25rem" }}>
              <div style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start" }}>
                <Calendar size={18} color={C.accent} style={{ flexShrink: 0, marginTop: "0.1rem" }} />
                <div>
                  <div style={{ fontFamily: C.bodyFont, fontSize: "0.85rem", fontWeight: 700, color: C.white, marginBottom: "0.3rem" }}>Réservation prioritaire</div>
                  <div style={{ fontFamily: C.bodyFont, fontSize: "0.82rem", color: C.textLight, lineHeight: 1.65 }}>
                    Pour garantir votre créneau, utilisez notre formulaire de réservation en ligne. Réponse sous 2h ouvrées, confirmation sous 24h.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
