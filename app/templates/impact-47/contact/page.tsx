"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Clock, Check } from "lucide-react";
import { C, PageHero } from "../shared";

const SERIF = "'Libre Baskerville', Georgia, serif";
const SANS = "'Poppins', system-ui";

export default function Contact() {
  const [sent, setSent] = useState(false);
  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "14px 16px", background: C.white, border: `1px solid ${C.border}`, color: C.text,
    fontSize: 16, /* ≥16px to avoid iOS zoom */ outline: "none", fontFamily: SANS, marginBottom: 16, borderRadius: 2,
  };
  const labelStyle: React.CSSProperties = {
    fontSize: 11, color: C.textMuted, letterSpacing: "0.08em", textTransform: "uppercase" as const, fontFamily: SANS, marginBottom: 8, display: "block",
  };
  return (
    <div>
      <PageHero eyebrow="Restons en contact" title="Nous contacter" subtitle="Une question sur une commande, un mariage ou un atelier ? Notre équipe vous répond sous 24h ouvrées." />
      <section style={{ background: C.bg, padding: "72px 24px 100px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", gap: "clamp(32px, 5vw, 64px)" }}>
          <div>
            {[
              { Icon: Mail, label: "Email", value: "valentinmilliand@aevia.services" },
              { Icon: Phone, label: "Téléphone", value: "+33 1 43 00 00 00" },
              { Icon: MapPin, label: "Atelier", value: "18 Rue du Marché, Paris 11e" },
              { Icon: Clock, label: "Horaires", value: "Mar – Sam · 9h – 19h" },
            ].map(({ Icon, label, value }) => (
              <div key={label} style={{ marginBottom: 28, borderBottom: `1px solid ${C.border}`, paddingBottom: 20, display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{ width: 44, height: 44, background: C.accentLight, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon size={18} color={C.accent} /></div>
                <div>
                  <div style={{ fontFamily: SANS, fontSize: 11, color: C.sage, letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 6 }}>{label}</div>
                  <div style={{ fontFamily: SERIF, fontSize: 19, color: C.text, fontWeight: 700 }}>{value}</div>
                </div>
              </div>
            ))}
          </div>
          <div>
            {sent ? (
              <div style={{ border: `1px solid ${C.border}`, padding: "48px 36px", textAlign: "center" as const, background: C.bgCard }}>
                <div style={{ width: 56, height: 56, background: C.sageLight, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}><Check size={26} color={C.sage} /></div>
                <div style={{ fontFamily: SERIF, fontSize: 24, color: C.accent, marginBottom: 10, fontWeight: 700 }}>Message envoyé</div>
                <p style={{ fontFamily: SANS, fontSize: 14, color: C.textMuted, lineHeight: 1.7 }}>Merci, nous vous répondrons sous 24h.</p>
              </div>
            ) : (
              <form onSubmit={e => { e.preventDefault(); setSent(true); }}>
                <label style={labelStyle}>Nom complet</label>
                <input style={inputStyle} type="text" placeholder="Votre nom" required />
                <label style={labelStyle}>Email</label>
                <input style={inputStyle} type="email" placeholder="votre@email.fr" required />
                <label style={labelStyle}>Sujet</label>
                <input style={inputStyle} type="text" placeholder="Objet de votre message" />
                <label style={labelStyle}>Message</label>
                <textarea style={{ ...inputStyle, minHeight: 140, resize: "vertical" as const }} placeholder="Comment pouvons-nous vous aider ?" required />
                <button type="submit"
                  style={{ width: "100%", padding: "16px", background: C.accent, color: C.white, border: "none", fontSize: 13, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" as const, cursor: "pointer", fontFamily: SANS, borderRadius: 2 }}
                  onMouseEnter={e => (e.currentTarget.style.background = C.accentHover)}
                  onMouseLeave={e => (e.currentTarget.style.background = C.accent)}
                >Envoyer le message</button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
