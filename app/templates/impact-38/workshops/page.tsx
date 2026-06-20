"use client";

import React, { useState } from "react";
import { Check, Calendar, Users } from "lucide-react";
import { motion } from "framer-motion";
import { C, WORKSHOPS, SectionReveal, PageHeader } from "../shared";

export default function WorkshopsPage() {
  const [bookingWorkshop, setBookingWorkshop] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", date: "", workshop: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div>
      <PageHeader
        title="Ateliers"
        subtitle="Des expériences immersives pour mieux comprendre, déguster et préparer le café. Animés par notre équipe de torréfacteurs et baristas."
      />
      <div style={{ padding: "80px 5%", background: C.bg }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 32, marginBottom: 80 }}>
            {WORKSHOPS.map((ws, i) => (
              <SectionReveal key={ws.title} delay={i * 0.1}>
                <div style={{ background: C.white, borderRadius: 16, overflow: "hidden", border: `1px solid ${C.border}`, display: "flex", flexDirection: "column", height: "100%" }}>
                  <div style={{ position: "relative", height: 200, overflow: "hidden" }}>
                    <img src={ws.image} alt={ws.title} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(26,10,0,0.65) 0%, transparent 55%)" }} />
                    <div style={{ position: "absolute", top: 16, left: 16, display: "flex", gap: 8 }}>
                      <span style={{ background: C.caramel, color: C.white, fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20 }}>
                        {ws.duration}
                      </span>
                      <span style={{ background: "rgba(255,255,255,0.15)", color: C.white, fontSize: 11, fontWeight: 600, padding: "4px 12px", borderRadius: 20, backdropFilter: "blur(4px)" }}>
                        {ws.level}
                      </span>
                    </div>
                    <div style={{ position: "absolute", bottom: 16, left: 20, right: 20, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                      <h3 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 20, fontWeight: 700, color: C.white, margin: 0, flex: 1, paddingRight: 12 }}>
                        {ws.title}
                      </h3>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 26, fontWeight: 700, color: C.caramelLight }}>{ws.price}€</div>
                        <div style={{ fontSize: 11, color: C.sand }}>/{ws.unit}</div>
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: 28, flex: 1, display: "flex", flexDirection: "column", gap: 20 }}>
                    <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.8, fontWeight: 300 }}>{ws.description}</p>

                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>
                        Ce que vous apprendrez
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {ws.whatYouLearn.map((item) => (
                          <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                            <Check size={13} color={C.caramel} style={{ marginTop: 2, flexShrink: 0 }} />
                            <span style={{ fontSize: 13, color: C.text, fontWeight: 300, lineHeight: 1.5 }}>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
                        Inclus
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {ws.includes.map((inc) => (
                          <div key={inc} style={{ fontSize: 13, color: C.caramel, fontWeight: 500 }}>• {inc}</div>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: "auto" }}>
                      <Users size={14} color={C.textMuted} />
                      <span style={{ fontSize: 13, color: C.textMuted, fontWeight: 300 }}>{ws.groupSize}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => { setBookingWorkshop(ws.title); setFormData(f => ({ ...f, workshop: ws.title })); }}
                      style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: C.caramel, color: C.white, padding: "13px 20px", borderRadius: 8, fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer", width: "100%" }}
                    >
                      Réserver cet atelier <Calendar size={15} />
                    </button>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>

          {/* Booking form */}
          {bookingWorkshop && !submitted && (
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
              style={{ background: C.white, borderRadius: 16, padding: 40, border: `2px solid ${C.caramel}`, maxWidth: 600, margin: "0 auto" }}>
              <h3 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 24, fontWeight: 700, color: C.espresso, marginBottom: 8 }}>
                Réserver — {bookingWorkshop}
              </h3>
              <p style={{ fontSize: 14, color: C.textMuted, marginBottom: 28, fontWeight: 300 }}>
                Nous vous confirmerons la disponibilité par email sous 24h.
              </p>
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: C.text, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
                    Nom complet
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(f => ({ ...f, name: e.target.value }))}
                    style={{ width: "100%", padding: "12px 16px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 15, fontFamily: "'DM Sans', system-ui", background: C.bg, color: C.text, boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: C.text, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(f => ({ ...f, email: e.target.value }))}
                    style={{ width: "100%", padding: "12px 16px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 15, fontFamily: "'DM Sans', system-ui", background: C.bg, color: C.text, boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: C.text, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
                    Date souhaitée
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData(f => ({ ...f, date: e.target.value }))}
                    style={{ width: "100%", padding: "12px 16px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 15, fontFamily: "'DM Sans', system-ui", background: C.bg, color: C.text, boxSizing: "border-box" }}
                  />
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <button type="submit"
                    style={{ flex: 1, background: C.caramel, color: C.white, padding: "14px 24px", borderRadius: 8, fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer" }}>
                    Envoyer la demande
                  </button>
                  <button type="button" onClick={() => setBookingWorkshop(null)}
                    style={{ background: C.bgAlt, color: C.textMuted, padding: "14px 20px", borderRadius: 8, fontWeight: 600, fontSize: 14, border: "none", cursor: "pointer" }}>
                    Annuler
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {submitted && (
            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}
              style={{ background: C.white, borderRadius: 16, padding: 40, border: `2px solid ${C.caramel}`, maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>☕</div>
              <h3 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 24, fontWeight: 700, color: C.espresso, marginBottom: 12 }}>
                Merci
              </h3>
              <p style={{ fontSize: 15, color: C.textMuted, fontWeight: 300, lineHeight: 1.75 }}>
                Merci, nous vous répondrons sous 24h.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
