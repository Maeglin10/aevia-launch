'use client';

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, Calendar, ArrowRight } from "lucide-react";
import { C } from "../shared";

export default function BookingPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    studio: "",
    startDate: "",
    days: "",
    sessionType: "",
    artist: "",
    genre: "",
    description: "",
    engineer: "",
    contactName: "",
    email: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

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

  const fieldGroup = (label: string, children: React.ReactNode) => (
    <div style={{ marginBottom: "1.25rem" }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );

  if (submitted) {
    return (
      <div style={{ minHeight: "100dvh", backgroundColor: C.bg, paddingTop: "4rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: "center", maxWidth: 520, padding: "3rem 2rem" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", backgroundColor: `${C.accent}22`, border: `2px solid ${C.accent}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.75rem" }}>
            <Check size={32} color={C.accent} />
          </div>
          <h2 style={{ fontFamily: C.headingFont, fontSize: "2.5rem", color: C.white, letterSpacing: "0.04em", marginBottom: "1rem" }}>DEMANDE REÇUE</h2>
          <p style={{ fontFamily: C.bodyFont, color: C.textLight, lineHeight: 1.75, fontSize: "1rem" }}>
            Notre équipe vous contacte sous <strong style={{ color: C.accent }}>2h ouvrées</strong> pour confirmer votre session et vous communiquer les détails de réservation.
          </p>
          <p style={{ fontFamily: C.bodyFont, color: C.textMuted, fontSize: "0.85rem", marginTop: "1rem" }}>
            Un email de confirmation vous a été envoyé à l'adresse indiquée.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100dvh", backgroundColor: C.bg, paddingTop: "4rem" }}>
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "3rem 2rem 5rem" }}>
        <span style={{ fontFamily: C.bodyFont, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.accent }}>Réservation</span>
        <h1 style={{ fontFamily: C.headingFont, fontSize: "clamp(3rem, 7vw, 5rem)", color: C.white, letterSpacing: "0.04em", margin: "0.4rem 0 0.5rem", lineHeight: 1 }}>RÉSERVER</h1>
        <p style={{ fontFamily: C.bodyFont, color: C.textLight, fontSize: "1rem", lineHeight: 1.75, marginBottom: "3rem", maxWidth: 520 }}>
          Remplissez le formulaire ci-dessous. Notre équipe valide les disponibilités et revient vers vous sous 2h ouvrées.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
          {/* Studio & dates */}
          <div style={{ backgroundColor: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "2rem", marginBottom: "1.5rem" }}>
            <h3 style={{ fontFamily: C.headingFont, fontSize: "1.2rem", color: C.accent, letterSpacing: "0.08em", marginBottom: "1.5rem" }}>VOTRE SESSION</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
              {fieldGroup("Studio",
                <select name="studio" value={form.studio} onChange={handleChange} required style={{ ...inputStyle, appearance: "none" }}>
                  <option value="">Sélectionner un studio</option>
                  <option value="studio-a">Studio A — 800€/jour</option>
                  <option value="studio-b">Studio B — 500€/jour</option>
                  <option value="mastering">Mastering Suite — 200€/h</option>
                </select>
              )}
              {fieldGroup("Type de session",
                <select name="sessionType" value={form.sessionType} onChange={handleChange} required style={{ ...inputStyle, appearance: "none" }}>
                  <option value="">Sélectionner</option>
                  <option value="recording">Enregistrement</option>
                  <option value="mixing">Mixage</option>
                  <option value="mastering">Mastering</option>
                  <option value="production">Production</option>
                </select>
              )}
              {fieldGroup("Date de début",
                <input type="date" name="startDate" value={form.startDate} onChange={handleChange} required style={inputStyle} />
              )}
              {fieldGroup("Nombre de jours / heures",
                <input type="text" name="days" value={form.days} onChange={handleChange} placeholder="Ex : 2 jours ou 6h" required style={inputStyle} />
              )}
            </div>
            {fieldGroup("Ingénieur du son",
              <select name="engineer" value={form.engineer} onChange={handleChange} required style={{ ...inputStyle, appearance: "none" }}>
                <option value="">Sélectionner</option>
                <option value="yes">Oui, ingénieur Echo Chamber (+200€/jour)</option>
                <option value="no">Non, j'amène mon propre ingénieur</option>
              </select>
            )}
          </div>

          {/* Project info */}
          <div style={{ backgroundColor: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "2rem", marginBottom: "1.5rem" }}>
            <h3 style={{ fontFamily: C.headingFont, fontSize: "1.2rem", color: C.accent, letterSpacing: "0.08em", marginBottom: "1.5rem" }}>VOTRE PROJET</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
              {fieldGroup("Nom artiste / groupe",
                <input type="text" name="artist" value={form.artist} onChange={handleChange} placeholder="Nom de scène ou groupe" required style={inputStyle} />
              )}
              {fieldGroup("Genre musical",
                <input type="text" name="genre" value={form.genre} onChange={handleChange} placeholder="Ex : Hip-Hop, Jazz, Électro…" style={inputStyle} />
              )}
            </div>
            {fieldGroup("Description du projet",
              <textarea name="description" value={form.description} onChange={handleChange} placeholder="Décrivez votre projet, vos besoins spécifiques, le nombre de musiciens…" rows={4} style={{ ...inputStyle, resize: "vertical" }} />
            )}
          </div>

          {/* Contact */}
          <div style={{ backgroundColor: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "2rem", marginBottom: "2rem" }}>
            <h3 style={{ fontFamily: C.headingFont, fontSize: "1.2rem", color: C.accent, letterSpacing: "0.08em", marginBottom: "1.5rem" }}>CONTACT</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.25rem" }}>
              {fieldGroup("Nom complet",
                <input type="text" name="contactName" value={form.contactName} onChange={handleChange} placeholder="Prénom Nom" required style={inputStyle} />
              )}
              {fieldGroup("Email",
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="email@exemple.fr" required style={inputStyle} />
              )}
              {fieldGroup("Téléphone",
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+33 6 00 00 00 00" style={inputStyle} />
              )}
            </div>
          </div>

          <button
            type="submit"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem", backgroundColor: C.accent, color: C.white, padding: "1.1rem 2.5rem", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: 700, fontFamily: C.bodyFont, fontSize: "1rem", boxShadow: `0 8px 30px ${C.accentGlow}`, letterSpacing: "0.03em" }}
          >
            Envoyer ma demande <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
