"use client";

import React, { useState } from "react";
import { MapPin, Clock, Mail, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { C, SectionReveal, PageHeader } from "../shared";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const hours = [
    { day: "Lundi – Vendredi", time: "7h – 19h" },
    { day: "Samedi", time: "8h – 18h" },
    { day: "Dimanche", time: "9h – 14h" },
  ];

  return (
    <div>
      <PageHeader
        title="Contact"
        subtitle="Une question sur nos cafés, nos abonnements ou nos ateliers ? Écrivez-nous, nous répondons sous 24h."
      />
      <div style={{ padding: "80px 5%", background: C.bg }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 60, alignItems: "start" }}>

          {/* Info panel */}
          <div>
            <SectionReveal>
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <div style={{ background: C.white, borderRadius: 14, padding: 28, border: `1px solid ${C.border}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                    <div style={{ width: 40, height: 40, background: C.caramelLight, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <MapPin size={18} color={C.caramel} />
                    </div>
                    <h3 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 17, fontWeight: 700, color: C.espresso, margin: 0 }}>Adresse</h3>
                  </div>
                  <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.75, fontWeight: 300 }}>
                    Valentin Milliand, SIREN 852 546 225, RCS Bourg-en-Bresse (adresse communiquée sur demande à{" "}
                    <a href="mailto:contact@aevia.io" style={{ color: C.caramel, fontWeight: 600, textDecoration: "none" }}>contact@aevia.io</a>)
                  </p>
                  <p style={{ fontSize: 13, color: C.textMuted, marginTop: 8, fontWeight: 300 }}>
                    Nos torréfactions ont lieu le <strong>mardi et vendredi matin</strong>.
                  </p>
                </div>

                <div style={{ background: C.white, borderRadius: 14, padding: 28, border: `1px solid ${C.border}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                    <div style={{ width: 40, height: 40, background: C.caramelLight, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Clock size={18} color={C.caramel} />
                    </div>
                    <h3 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 17, fontWeight: 700, color: C.espresso, margin: 0 }}>Horaires</h3>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {hours.map((h) => (
                      <div key={h.day} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 14, color: C.text, fontWeight: 400 }}>{h.day}</span>
                        <span style={{ fontSize: 14, color: C.caramel, fontWeight: 700 }}>{h.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ background: C.white, borderRadius: 14, padding: 28, border: `1px solid ${C.border}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                    <div style={{ width: 40, height: 40, background: C.caramelLight, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Mail size={18} color={C.caramel} />
                    </div>
                    <h3 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 17, fontWeight: 700, color: C.espresso, margin: 0 }}>Email & Téléphone</h3>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <a href="mailto:contact@aevia.io" style={{ fontSize: 14, color: C.caramel, fontWeight: 600, textDecoration: "none" }}>contact@aevia.io</a>
                    <a href="tel:+33600000000" style={{ fontSize: 14, color: C.textMuted, fontWeight: 300, textDecoration: "none" }}>+33 (0)6 00 00 00 00</a>
                  </div>
                </div>
              </div>
            </SectionReveal>
          </div>

          {/* Form */}
          <SectionReveal delay={0.15}>
            {!submitted ? (
              <div style={{ background: C.white, borderRadius: 16, padding: 40, border: `1px solid ${C.border}` }}>
                <h3 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 22, fontWeight: 700, color: C.espresso, marginBottom: 24 }}>
                  Envoyer un message
                </h3>
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: C.text, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Nom</label>
                      <input type="text" required value={formData.name}
                        onChange={(e) => setFormData(f => ({ ...f, name: e.target.value }))}
                        style={{ width: "100%", padding: "12px 16px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 15, fontFamily: "'DM Sans', system-ui", background: C.bg, color: C.text, boxSizing: "border-box" }} />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: C.text, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Email</label>
                      <input type="email" required value={formData.email}
                        onChange={(e) => setFormData(f => ({ ...f, email: e.target.value }))}
                        style={{ width: "100%", padding: "12px 16px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 15, fontFamily: "'DM Sans', system-ui", background: C.bg, color: C.text, boxSizing: "border-box" }} />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: C.text, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Sujet</label>
                    <input type="text" required value={formData.subject}
                      onChange={(e) => setFormData(f => ({ ...f, subject: e.target.value }))}
                      style={{ width: "100%", padding: "12px 16px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 15, fontFamily: "'DM Sans', system-ui", background: C.bg, color: C.text, boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: C.text, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Message</label>
                    <textarea required rows={5} value={formData.message}
                      onChange={(e) => setFormData(f => ({ ...f, message: e.target.value }))}
                      style={{ width: "100%", padding: "12px 16px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 15, fontFamily: "'DM Sans', system-ui", background: C.bg, color: C.text, boxSizing: "border-box", resize: "vertical" }} />
                  </div>
                  <button type="submit"
                    style={{ background: C.caramel, color: C.white, padding: "14px 24px", borderRadius: 8, fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer" }}>
                    Envoyer le message
                  </button>
                </form>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}
                style={{ background: C.white, borderRadius: 16, padding: 40, border: `2px solid ${C.caramel}`, textAlign: "center" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✉️</div>
                <h3 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 24, fontWeight: 700, color: C.espresso, marginBottom: 12 }}>
                  Message envoyé !
                </h3>
                <p style={{ fontSize: 15, color: C.textMuted, fontWeight: 300, lineHeight: 1.75 }}>
                  Nous vous répondons sous 24h ouvrées. À bientôt !
                </p>
              </motion.div>
            )}
          </SectionReveal>
        </div>
      </div>
    </div>
  );
}
