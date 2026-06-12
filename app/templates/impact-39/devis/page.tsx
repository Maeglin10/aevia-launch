"use client";

import React, { useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, CheckCircle, Shield, MapPin, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { C } from "../shared";

export default function DevisPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    departCp: "", departEtage: "", departAscenseur: "non",
    arriveeCp: "", arriveeEtage: "", arriveeAscenseur: "non",
    volume: "T2/T3", date: "", flexibilite: "non",
    emballage: false, gardeMeuble: false, nettoyage: false,
    nom: "", email: "", tel: "",
  });

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const inputStyle = { width: "100%", background: C.bgAlt, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 16px", fontSize: 15, color: C.text, fontFamily: "'Manrope', system-ui", outline: "none", boxSizing: "border-box" as const };
  const labelStyle = { display: "block", fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 8 } as const;

  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", background: C.bgAlt, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 5%" }}>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ background: C.white, borderRadius: 24, padding: "64px 48px", maxWidth: 520, textAlign: "center", boxShadow: "0 24px 80px rgba(30,58,95,0.10)" }}>
          <div style={{ width: 72, height: 72, background: C.orangeLight, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
            <CheckCircle size={36} color={C.orange} />
          </div>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: C.navy, marginBottom: 16 }}>Demande envoyée !</h2>
          <p style={{ fontSize: 16, color: C.textMuted, lineHeight: 1.75 }}>
            Votre devis vous sera envoyé sous 24 h. Merci, {form.nom || "cher client"} !
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: C.bgAlt }}>
      <div style={{ background: C.navy, padding: "60px 5% 56px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <h1 style={{ fontSize: "clamp(30px, 4vw, 48px)", fontWeight: 900, color: C.white, marginBottom: 12 }}>
            Votre devis <span style={{ color: C.orange }}>gratuit</span>
          </h1>
          <p style={{ fontSize: 17, color: "#93c5fd", lineHeight: 1.7 }}>Estimation ferme envoyée sous 24 h. Aucun engagement.</p>
          {/* Step indicator */}
          <div style={{ display: "flex", gap: 12, marginTop: 32 }} className="flex-wrap">
            {[1, 2, 3].map((s) => (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: step >= s ? C.orange : "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: step >= s ? C.white : "#93c5fd", transition: "background 0.2s" }}>
                  {s}
                </div>
                <span style={{ fontSize: 13, color: step >= s ? C.orange : "#64748b", fontWeight: 700 }}>
                  {s === 1 ? "Adresses" : s === 2 ? "Votre déménagement" : "Contact"}
                </span>
                {s < 3 && <ChevronRight size={14} color="#64748b" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 5%" }}>
        <div style={{ background: C.white, borderRadius: 20, padding: "48px 40px", boxShadow: "0 8px 40px rgba(30,58,95,0.08)" }}>

          {/* Step 1 */}
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 style={{ fontSize: 22, fontWeight: 900, color: C.navy, marginBottom: 32 }}>Adresses de départ et d'arrivée</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }} className="grid sm:grid-cols-1">
                <div>
                  <label style={labelStyle}>Code postal départ</label>
                  <div style={{ position: "relative" }}>
                    <MapPin size={16} color={C.orange} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
                    <input value={form.departCp} onChange={(e) => set("departCp", e.target.value)} placeholder="75011" style={{ ...inputStyle, paddingLeft: 40 }} required />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Code postal arrivée</label>
                  <div style={{ position: "relative" }}>
                    <MapPin size={16} color={C.orange} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
                    <input value={form.arriveeCp} onChange={(e) => set("arriveeCp", e.target.value)} placeholder="69001" style={{ ...inputStyle, paddingLeft: 40 }} required />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Étage départ</label>
                  <input value={form.departEtage} onChange={(e) => set("departEtage", e.target.value)} placeholder="3" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Étage arrivée</label>
                  <input value={form.arriveeEtage} onChange={(e) => set("arriveeEtage", e.target.value)} placeholder="2" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Ascenseur au départ ?</label>
                  <select value={form.departAscenseur} onChange={(e) => set("departAscenseur", e.target.value)} style={inputStyle}>
                    <option value="oui">Oui</option>
                    <option value="non">Non</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Ascenseur à l'arrivée ?</label>
                  <select value={form.arriveeAscenseur} onChange={(e) => set("arriveeAscenseur", e.target.value)} style={inputStyle}>
                    <option value="oui">Oui</option>
                    <option value="non">Non</option>
                  </select>
                </div>
              </div>
              <button type="button" onClick={() => setStep(2)} style={{ background: C.orange, color: C.white, padding: "14px 32px", borderRadius: 10, fontWeight: 800, fontSize: 16, border: "none", cursor: "pointer", fontFamily: "'Manrope', system-ui", display: "flex", alignItems: "center", gap: 8 }}>
                Étape suivante <ArrowRight size={18} />
              </button>
            </motion.div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 style={{ fontSize: 22, fontWeight: 900, color: C.navy, marginBottom: 32 }}>Votre déménagement</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }} className="grid sm:grid-cols-1">
                <div>
                  <label style={labelStyle}>Volume estimé</label>
                  <select value={form.volume} onChange={(e) => set("volume", e.target.value)} style={inputStyle}>
                    <option>Studio / T1</option>
                    <option>T2 / T3</option>
                    <option>T4 / T5</option>
                    <option>Maison individuelle</option>
                    <option>Bureaux / local pro</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Date souhaitée</label>
                  <div style={{ position: "relative" }}>
                    <Calendar size={16} color={C.orange} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
                    <input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} style={{ ...inputStyle, paddingLeft: 40 }} />
                  </div>
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Flexibilité sur la date ?</label>
                  <select value={form.flexibilite} onChange={(e) => set("flexibilite", e.target.value)} style={inputStyle}>
                    <option value="non">Non, date fixe</option>
                    <option value="semaine">Flexible sur la semaine</option>
                    <option value="mois">Flexible sur le mois</option>
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: 32 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 14 }}>Services additionnels</p>
                {[
                  { key: "emballage", label: "Service emballage (cartons + matériaux fournis)" },
                  { key: "gardeMeuble", label: "Garde-meuble temporaire" },
                  { key: "nettoyage", label: "Nettoyage de fin de bail" },
                ].map(({ key, label }) => (
                  <label key={key} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, cursor: "pointer" }}>
                    <input type="checkbox" checked={form[key as keyof typeof form] as boolean} onChange={(e) => set(key, e.target.checked)} style={{ width: 18, height: 18, accentColor: C.orange }} />
                    <span style={{ fontSize: 15, color: C.text }}>{label}</span>
                  </label>
                ))}
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <button type="button" onClick={() => setStep(1)} style={{ background: C.bgAlt, color: C.navy, padding: "14px 24px", borderRadius: 10, fontWeight: 700, fontSize: 15, border: `1px solid ${C.border}`, cursor: "pointer", fontFamily: "'Manrope', system-ui", display: "flex", alignItems: "center", gap: 8 }}>
                  <ChevronLeft size={16} /> Retour
                </button>
                <button type="button" onClick={() => setStep(3)} style={{ background: C.orange, color: C.white, padding: "14px 28px", borderRadius: 10, fontWeight: 800, fontSize: 15, border: "none", cursor: "pointer", fontFamily: "'Manrope', system-ui", display: "flex", alignItems: "center", gap: 8 }}>
                  Étape suivante <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 style={{ fontSize: 22, fontWeight: 900, color: C.navy, marginBottom: 32 }}>Vos coordonnées</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 32 }}>
                <div>
                  <label style={labelStyle}>Nom complet</label>
                  <input value={form.nom} onChange={(e) => set("nom", e.target.value)} placeholder="Marie Dupont" style={inputStyle} required />
                </div>
                <div>
                  <label style={labelStyle}>Email</label>
                  <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="marie@email.fr" style={inputStyle} required />
                </div>
                <div>
                  <label style={labelStyle}>Téléphone</label>
                  <input type="tel" value={form.tel} onChange={(e) => set("tel", e.target.value)} placeholder="+33 6 12 34 56 78" style={inputStyle} required />
                </div>
              </div>
              <div style={{ background: C.orangeLight, borderRadius: 12, padding: "16px 20px", marginBottom: 28, display: "flex", gap: 12, alignItems: "flex-start" }}>
                <Shield size={18} color={C.orange} style={{ flexShrink: 0, marginTop: 2 }} />
                <p style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.6 }}>Vos données ne sont jamais revendues. Nous les utilisons uniquement pour vous envoyer votre devis.</p>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <button type="button" onClick={() => setStep(2)} style={{ background: C.bgAlt, color: C.navy, padding: "14px 24px", borderRadius: 10, fontWeight: 700, fontSize: 15, border: `1px solid ${C.border}`, cursor: "pointer", fontFamily: "'Manrope', system-ui", display: "flex", alignItems: "center", gap: 8 }}>
                  <ChevronLeft size={16} /> Retour
                </button>
                <button type="submit" onClick={() => setSubmitted(true)} style={{ background: C.orange, color: C.white, padding: "14px 32px", borderRadius: 10, fontWeight: 800, fontSize: 16, border: "none", cursor: "pointer", fontFamily: "'Manrope', system-ui", display: "flex", alignItems: "center", gap: 8 }}>
                  Envoyer ma demande <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
