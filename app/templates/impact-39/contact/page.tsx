"use client";

import React, { useState } from "react";
import { MapPin, Phone, Mail, Clock, CheckCircle, ArrowRight } from "lucide-react";
import { C, SectionReveal } from "../shared";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  const inputStyle = { width: "100%", background: C.bgAlt, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 16px", fontSize: 15, color: C.text, fontFamily: "'Manrope', system-ui", outline: "none", boxSizing: "border-box" as const };

  return (
    <div style={{ background: C.bg }}>
      {/* Hero band */}
      <div style={{ background: C.navy, padding: "72px 5% 64px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h1 style={{ fontSize: "clamp(34px, 4vw, 56px)", fontWeight: 900, color: C.white, lineHeight: 1.1, marginBottom: 18 }}>
            Contactez-<span style={{ color: C.orange }}>nous</span>
          </h1>
          <p style={{ fontSize: 17, color: "#93c5fd", lineHeight: 1.75, maxWidth: 500 }}>
            Notre équipe répond du lundi au samedi de 8 h à 19 h.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "72px 5%" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60 }} className="grid md:grid-cols-1">
          {/* Info column */}
          <div>
            <SectionReveal>
              <h2 style={{ fontSize: 24, fontWeight: 900, color: C.navy, marginBottom: 32 }}>Informations pratiques</h2>
            </SectionReveal>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {[
                {
                  icon: MapPin,
                  title: "Zone d'intervention",
                  content: "Île-de-France + France entière\nValentin Milliand, SIREN 852 546 225, RCS Bourg-en-Bresse\n(adresse communiquée sur demande à contact@aevia.io)"
                },
                { icon: Phone, title: "Téléphone", content: "+33 1 XX XX XX XX" },
                { icon: Mail, title: "Email", content: "contact@aevia.io" },
                { icon: Clock, title: "Horaires", content: "Lundi – Samedi : 8 h – 19 h\nDimanche : fermé" },
              ].map(({ icon: Icon, title, content }) => (
                <SectionReveal key={title}>
                  <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                    <div style={{ width: 44, height: 44, background: C.orangeLight, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon size={20} color={C.orange} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 15, color: C.navy, marginBottom: 4 }}>{title}</div>
                      {content.split("\n").map((line, i) => (
                        <div key={i} style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.6 }}>{line}</div>
                      ))}
                    </div>
                  </div>
                </SectionReveal>
              ))}
            </div>

            {/* Zone map placeholder */}
            <SectionReveal delay={0.2}>
              <div style={{ marginTop: 36, background: C.bgAlt, borderRadius: 16, padding: "24px", border: `1px solid ${C.border}` }}>
                <div style={{ fontWeight: 800, color: C.navy, marginBottom: 12, fontSize: 15 }}>Zone d'intervention principale</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {["Paris (75)", "Hauts-de-Seine (92)", "Seine-Saint-Denis (93)", "Val-de-Marne (94)", "Yvelines (78)", "Essonne (91)", "Val-d'Oise (95)", "Seine-et-Marne (77)", "France entière sur devis"].map((zone) => (
                    <span key={zone} style={{ background: C.orangeLight, color: C.orange, fontSize: 12, fontWeight: 700, padding: "5px 12px", borderRadius: 20 }}>{zone}</span>
                  ))}
                </div>
              </div>
            </SectionReveal>
          </div>

          {/* Contact form */}
          <SectionReveal delay={0.15}>
            <div style={{ background: C.white, borderRadius: 20, padding: "40px 36px", boxShadow: "0 8px 40px rgba(30,58,95,0.08)", border: `1px solid ${C.border}` }}>
              {sent ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <CheckCircle size={48} color={C.orange} style={{ margin: "0 auto 20px" }} />
                  <h3 style={{ fontSize: 20, fontWeight: 900, color: C.navy, marginBottom: 10 }}>Merci</h3>
                  <p style={{ color: C.textMuted, fontSize: 15 }}>Merci, nous vous répondrons sous 24h.</p>
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
                  <h3 style={{ fontSize: 20, fontWeight: 900, color: C.navy, marginBottom: 24 }}>Envoyez-nous un message</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                    <div>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 8 }}>Nom complet</label>
                      <input placeholder="Marie Dupont" style={inputStyle} required />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 8 }}>Email</label>
                      <input type="email" placeholder="marie@email.fr" style={inputStyle} required />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 8 }}>Téléphone</label>
                      <input type="tel" placeholder="+33 6 12 34 56 78" style={inputStyle} required />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 8 }}>Message</label>
                      <textarea placeholder="Décrivez votre besoin..." rows={4} style={{ ...inputStyle, resize: "vertical" }} required />
                    </div>
                    <button
                      type="submit"
                      style={{ width: "100%", background: C.orange, color: C.white, padding: "14px 28px", borderRadius: 10, fontWeight: 800, fontSize: 16, border: "none", cursor: "pointer", fontFamily: "'Manrope', system-ui", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                    >
                      Envoyer <ArrowRight size={18} />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </SectionReveal>
        </div>
      </div>
    </div>
  );
}
