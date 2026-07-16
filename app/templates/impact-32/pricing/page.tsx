"use client";

import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Shield, Send, Phone, Clock } from "lucide-react";
import { TemplateIcon } from "@/components/TemplateIcon";
import { C, FONT, SectionBadge, PLANS } from "../shared";

export default function PricingPage() {
  const ref = useRef<HTMLElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ petName: "", ownerName: "", species: "", date: "", time: "", reason: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inputStyle: React.CSSProperties = { width: "100%", padding: "13px 16px", border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 15, fontFamily: FONT, color: C.text, background: C.white, outline: "none", boxSizing: "border-box" };
  const labelStyle: React.CSSProperties = { fontSize: 14, fontWeight: 700, color: C.text, display: "block", marginBottom: 7 };

  return (
    <div style={{ background: C.bg, fontFamily: FONT, padding: "80px 80px 120px" }}>
      {/* Plans Section */}
      <section ref={ref} style={{ marginBottom: 100 }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <SectionBadge label="Tarifs" />
          <h2 style={{ fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 800, color: C.text, letterSpacing: -1, marginBottom: 14 }}>Plans de soins transparents</h2>
          <p style={{ color: C.textMuted, fontSize: 16 }}>Remboursement assurance animaux partenaires — Sans engagement</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", gap: 28, maxWidth: 980, margin: "0 auto", alignItems: "start" }}>
          {PLANS.map((p, i) => (
            <div key={p.name}
              style={{ background: p.highlight ? C.text : C.bgSection, borderRadius: 24, padding: "38px 32px", border: p.highlight ? "none" : `1.5px solid ${C.border}`, boxShadow: p.highlight ? C.shadowLg : C.shadow, position: "relative", overflow: "hidden" }}>
              {p.highlight && (
                <>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${C.accent}, #52b788)` }} />
                  <div style={{ position: "absolute", top: 20, right: 20, background: C.accent, color: C.white, borderRadius: 20, padding: "4px 14px", fontSize: 12, fontWeight: 700 }}>Le plus choisi</div>
                </>
              )}
              <div style={{ marginBottom: 14 }}><TemplateIcon emoji={p.emoji} size={28} /></div>
              <h3 style={{ fontSize: 22, fontWeight: 800, color: p.highlight ? C.white : C.text, marginBottom: 8 }}>{p.name}</h3>
              <p style={{ fontSize: 14, color: p.highlight ? "rgba(255,255,255,0.6)" : C.textMuted, marginBottom: 24, lineHeight: 1.55 }}>{p.desc}</p>
              <div style={{ marginBottom: 28 }}>
                <span style={{ fontSize: 42, fontWeight: 900, color: p.highlight ? C.white : C.text, letterSpacing: -1 }}>€{p.price}</span>
                <span style={{ fontSize: 14, color: p.highlight ? "rgba(255,255,255,0.55)" : C.textMuted, marginLeft: 6 }}>{p.period}</span>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", display: "flex", flexDirection: "column", gap: 11 }}>
                {p.features.map((f) => (
                  <li key={f} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <CheckCircle size={16} color={p.highlight ? C.sand : C.accent} />
                    <span style={{ fontSize: 14, color: p.highlight ? "rgba(255,255,255,0.82)" : C.text }}>{f}</span>
                  </li>
                ))}
              </ul>
              <button type="button" onClick={() => document.getElementById("reservation-form")?.scrollIntoView({ behavior: "smooth" })}
                style={{ width: "100%", background: p.highlight ? C.accent : "transparent", color: p.highlight ? C.white : C.text, border: p.highlight ? "none" : `1.5px solid ${C.border}`, borderRadius: 10, padding: "14px", fontWeight: 800, fontSize: 15, cursor: "pointer", fontFamily: FONT }}
              >
                {p.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Booking Form Section */}
      <section id="reservation-form">
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <SectionBadge label="Prise de rendez-vous" />
          <h2 style={{ fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 800, color: C.text, letterSpacing: -1.5, marginBottom: 16 }}>Réserver une consultation</h2>
          <p style={{ fontSize: 17, color: C.textMuted, maxWidth: 520, margin: "0 auto" }}>Remplissez ce formulaire, notre équipe confirme votre créneau par email sous 2 heures ouvrées.</p>
        </div>

        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          {submitted ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ background: C.white, borderRadius: 24, padding: "48px 44px", boxShadow: C.shadowLg, border: `1px solid ${C.border}`, textAlign: "center" }}>
              <div style={{ width: 80, height: 80, background: C.accentLight, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px" }}>
                <CheckCircle size={40} color={C.accent} />
              </div>
              <h2 style={{ fontSize: 32, fontWeight: 800, color: C.text, marginBottom: 16 }}>Demande envoyée !</h2>
              <p style={{ fontSize: 16, color: C.textMuted, lineHeight: 1.7, marginBottom: 12 }}>
                Votre demande de rendez-vous pour <strong style={{ color: C.text }}>{form.petName}</strong> a bien été reçue.
              </p>
              <p style={{ fontSize: 15, color: C.textMuted, marginBottom: 32 }}>Notre équipe vous confirme votre créneau par email dans les 2 heures ouvrées.</p>
              <button type="button" onClick={() => setSubmitted(false)}
                style={{ background: C.accent, color: C.white, border: "none", borderRadius: 10, padding: "13px 28px", fontWeight: 800, fontSize: 15, cursor: "pointer", fontFamily: FONT }}
              >
                Nouveau rendez-vous
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} style={{ background: C.white, borderRadius: 24, padding: "48px 44px", boxShadow: C.shadowLg, border: `1px solid ${C.border}` }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
                <div>
                  <label style={labelStyle} htmlFor="ownerName">Votre nom</label>
                  <input id="ownerName" name="ownerName" type="text" required placeholder="Jean Dupont" value={form.ownerName} onChange={handleChange} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="petName">Nom de votre animal</label>
                  <input id="petName" name="petName" type="text" required placeholder="Rex" value={form.petName} onChange={handleChange} style={inputStyle} />
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle} htmlFor="species">Espèce</label>
                <select id="species" name="species" required value={form.species} onChange={handleChange} style={inputStyle}>
                  <option value="">Sélectionner l'espèce…</option>
                  <option value="chien">Chien</option>
                  <option value="chat">Chat</option>
                  <option value="lapin">Lapin / Rongeur</option>
                  <option value="oiseau">Oiseau</option>
                  <option value="reptile">Reptile</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
                <div>
                  <label style={labelStyle} htmlFor="date">Date souhaitée</label>
                  <input id="date" name="date" type="date" required value={form.date} onChange={handleChange} style={inputStyle} min={new Date().toISOString().split("T")[0]} />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="time">Heure souhaitée</label>
                  <select id="time" name="time" required value={form.time} onChange={handleChange} style={inputStyle}>
                    <option value="">Choisir un créneau…</option>
                    {["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00"].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: 32 }}>
                <label style={labelStyle} htmlFor="reason">Motif de la consultation</label>
                <textarea id="reason" name="reason" required placeholder="Décrivez brièvement le motif de votre visite…" value={form.reason} onChange={handleChange}
                  style={{ ...inputStyle, resize: "vertical", minHeight: 110 }} />
              </div>

              <div style={{ background: C.bgSection, borderRadius: 12, padding: "14px 18px", marginBottom: 28, display: "flex", gap: 10, alignItems: "flex-start" }}>
                <Shield size={16} color={C.accent} style={{ marginTop: 2, flexShrink: 0 }} />
                <p style={{ fontSize: 13, color: C.textMuted, margin: 0, lineHeight: 1.55 }}>Vos données sont utilisées uniquement pour la gestion de votre rendez-vous. Aucune donnée n'est partagée avec des tiers. Conformément au RGPD, vous pouvez exercer vos droits à contact@pawcare-bordeaux.fr</p>
              </div>

              <motion.button type="submit"
                style={{ width: "100%", background: C.accent, color: C.white, border: "none", borderRadius: 12, padding: "16px", fontWeight: 800, fontSize: 16, cursor: "pointer", fontFamily: FONT, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}
                whileHover={{ background: C.accentDark, scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                <Send size={18} /> Envoyer ma demande
              </motion.button>
            </form>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 28 }}>
            {[
              { icon: <Phone size={16} color={C.accent} />, title: "Urgences", text: "Ligne 24h/7j" },
              { icon: <Clock size={16} color={C.accent} />, title: "Horaires", text: "Lun–Sam 8h–20h" },
            ].map((item) => (
              <div key={item.title} style={{ background: C.white, borderRadius: 14, padding: "18px 20px", border: `1px solid ${C.border}`, display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ width: 40, height: 40, background: C.accentLight, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{item.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: C.text }}>{item.title}</div>
                  <div style={{ fontSize: 13, color: C.textMuted }}>{item.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
