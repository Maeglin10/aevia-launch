"use client";

import React, { useState } from "react";
import { Mail, MapPin, Clock, Shield, Check } from "lucide-react";
import { C, PageHero } from "../shared";

export default function Contact() {
  const [sent, setSent] = useState(false);
  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "14px 16px", background: C.bgCard,
    border: `1px solid ${C.border}`, color: C.navy,
    fontSize: 16, // ≥16px to avoid iOS zoom on focus
    outline: "none", fontFamily: "'Source Sans Pro', system-ui", marginBottom: 18,
  };
  const labelStyle: React.CSSProperties = {
    fontFamily: "'Source Sans Pro', system-ui", fontSize: 11, color: C.accent,
    letterSpacing: "0.12em", textTransform: "uppercase" as const, fontWeight: 700,
    marginBottom: 8, display: "block",
  };
  return (
    <div>
      <PageHero
        eyebrow="Engager le cabinet"
        title="Contactez-nous"
        subtitle="Un premier rendez-vous de 45 minutes vous est offert. Nous évaluons votre dossier, identifions la bonne équipe et vous proposons une structure d'honoraires claire."
      />
      <section style={{ background: C.bg, padding: "100px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "clamp(40px, 5vw, 72px)" }}>
          {/* Info */}
          <div>
            {[
              { Icon: Mail, label: "Email", value: "contact@aevia.io" },
              { Icon: MapPin, label: "Cabinet", value: "Paris, France" },
              { Icon: Clock, label: "Horaires", value: "Lun – Ven · 9h – 19h" },
              { Icon: Shield, label: "Confidentialité", value: "Secret professionnel garanti" },
            ].map(({ Icon, label, value }) => (
              <div key={label} style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 28, borderBottom: `1px solid ${C.border}`, paddingBottom: 22 }}>
                <div style={{ width: 44, height: 44, background: C.accentLight, border: `1px solid ${C.borderGold}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={18} color={C.accent} />
                </div>
                <div>
                  <div style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 11, color: C.accent, letterSpacing: "0.12em", textTransform: "uppercase" as const, marginBottom: 6, fontWeight: 700 }}>{label}</div>
                  <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20, color: C.navy }}>{value}</div>
                </div>
              </div>
            ))}
            <p style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 14, color: C.textMuted, lineHeight: 1.7, marginTop: 8 }}>
              Le secret professionnel s'applique dès votre première communication substantielle avec le cabinet, avant même toute lettre de mission.
            </p>
          </div>

          {/* Form */}
          <div>
            {sent ? (
              <div style={{ border: `1px solid ${C.border}`, borderTop: `3px solid ${C.accent}`, padding: "56px 40px", textAlign: "center" as const, background: C.bgCard }}>
                <Check size={30} color={C.accent} style={{ marginBottom: 18 }} />
                <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 24, color: C.navy, marginBottom: 12, fontWeight: 700 }}>Message envoyé</div>
                <p style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 15, color: C.textMuted, lineHeight: 1.7, margin: 0 }}>Merci. Un membre du cabinet vous répondra sous 24 heures ouvrées.</p>
              </div>
            ) : (
              <form onSubmit={e => { e.preventDefault(); setSent(true); }} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderTop: `3px solid ${C.accent}`, padding: "40px 36px" }}>
                <label style={labelStyle}>Nom complet</label>
                <input style={inputStyle} type="text" placeholder="Votre nom" required />
                <label style={labelStyle}>Email</label>
                <input style={inputStyle} type="email" placeholder="votre@email.fr" required />
                <label style={labelStyle}>Société</label>
                <input style={inputStyle} type="text" placeholder="Nom de votre entreprise" />
                <label style={labelStyle}>Nature du dossier</label>
                <input style={inputStyle} type="text" placeholder="Ex. : acquisition, contentieux, droit social…" />
                <label style={labelStyle}>Message</label>
                <textarea style={{ ...inputStyle, minHeight: 140, resize: "vertical" as const }} placeholder="Décrivez brièvement votre situation." required />
                <button type="submit"
                  style={{ width: "100%", padding: "16px", background: C.accent, color: C.white, border: "none", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Source Sans Pro', system-ui", letterSpacing: "0.1em", textTransform: "uppercase" as const }}
                  onMouseEnter={e => (e.currentTarget.style.background = C.accentHover)}
                  onMouseLeave={e => (e.currentTarget.style.background = C.accent)}
                >Demander une consultation</button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
