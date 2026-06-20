"use client";

import React, { useState } from "react";
import { ArrowRight, Check, Users, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { C, SectionReveal } from "../shared";

export default function ReservationPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    date: "",
    time: "",
    covers: "2",
    name: "",
    phone: "",
    email: "",
    occasion: "",
    dietary: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.85rem 1.1rem",
    borderRadius: "0.75rem",
    border: `1.5px solid ${C.border}`,
    backgroundColor: C.white,
    fontFamily: C.bodyFont,
    fontSize: "0.92rem",
    color: C.text,
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: C.bodyFont,
    fontSize: "0.8rem",
    fontWeight: 700,
    color: C.textLight,
    letterSpacing: "0.06em",
    textTransform: "uppercase" as const,
    display: "block",
    marginBottom: "0.45rem",
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: C.bg, paddingTop: "8rem", paddingBottom: "5rem" }}>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 1.5rem" }}>
        <SectionReveal>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span style={{ fontFamily: C.bodyFont, fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.earth }}>
              Réserver votre soirée
            </span>
            <h1 style={{ fontFamily: C.headingFont, fontSize: "clamp(2.2rem, 5vw, 3.5rem)", color: C.text, fontWeight: 700, margin: "0.6rem 0 1rem", lineHeight: 1.15 }}>
              Réservation
            </h1>
            <p style={{ fontFamily: C.bodyFont, color: C.textLight, fontSize: "1rem", maxWidth: 480, margin: "0 auto", lineHeight: 1.85 }}>
              Nous serons heureux de vous accueillir. Réservez votre table en ligne, confirmée sous 24h.
            </p>
          </div>
        </SectionReveal>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45 }}
              style={{
                backgroundColor: C.bgDark,
                borderRadius: "1.75rem",
                padding: "3.5rem 2.5rem",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  backgroundColor: "rgba(240,192,64,0.14)",
                  border: `2px solid ${C.accent}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1.5rem",
                }}
              >
                <Check size={28} color={C.accent} />
              </div>
              <h2 style={{ fontFamily: C.headingFont, fontSize: "1.75rem", color: C.bg, fontWeight: 700, marginBottom: "1rem" }}>
                Merci
              </h2>
              <p style={{ fontFamily: C.bodyFont, fontSize: "1rem", color: "rgba(253,249,238,0.65)", lineHeight: 1.8, maxWidth: 400, margin: "0 auto" }}>
                Merci, nous vous répondrons sous 24h.
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div
                style={{
                  backgroundColor: C.white,
                  borderRadius: "1.75rem",
                  padding: "2.5rem",
                  border: `1px solid ${C.border}`,
                  boxShadow: `0 4px 40px ${C.shadow}`,
                }}
              >
                {/* Date, time, covers */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }} className="grid sm:grid-cols-1">
                  <div>
                    <label style={labelStyle}>Date</label>
                    <input type="date" name="date" value={form.date} onChange={handleChange} required style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Heure</label>
                    <select name="time" value={form.time} onChange={handleChange} required style={inputStyle}>
                      <option value="">Choisir</option>
                      <option value="12h30">12h30</option>
                      <option value="13h00">13h00</option>
                      <option value="20h00">20h00</option>
                      <option value="20h30">20h30</option>
                      <option value="21h00">21h00</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Couverts</label>
                    <select name="covers" value={form.covers} onChange={handleChange} required style={inputStyle}>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                        <option key={n} value={n}>{n} {n === 1 ? "personne" : "personnes"}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Name, phone, email */}
                <div style={{ marginBottom: "1.25rem" }}>
                  <label style={labelStyle}>Nom complet</label>
                  <input type="text" name="name" value={form.name} onChange={handleChange} required placeholder="Votre nom" style={inputStyle} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }} className="grid sm:grid-cols-1">
                  <div>
                    <label style={labelStyle}>Téléphone</label>
                    <input type="tel" name="phone" value={form.phone} onChange={handleChange} required placeholder="+33 6 00 00 00 00" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Email</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="vous@exemple.fr" style={inputStyle} />
                  </div>
                </div>

                {/* Occasion */}
                <div style={{ marginBottom: "1.25rem" }}>
                  <label style={labelStyle}>Occasion (optionnel)</label>
                  <select name="occasion" value={form.occasion} onChange={handleChange} style={inputStyle}>
                    <option value="">Aucune occasion particulière</option>
                    <option value="birthday">Anniversaire</option>
                    <option value="anniversary">Anniversaire de mariage</option>
                    <option value="business">Repas d'affaires</option>
                    <option value="other">Autre</option>
                  </select>
                </div>

                {/* Dietary */}
                <div style={{ marginBottom: "2rem" }}>
                  <label style={labelStyle}>Régimes & allergies (optionnel)</label>
                  <textarea
                    name="dietary"
                    value={form.dietary}
                    onChange={handleChange}
                    placeholder="Allergies, intolérances, préférences alimentaires..."
                    rows={3}
                    style={{ ...inputStyle, resize: "vertical" as const }}
                  />
                </div>

                <div
                  style={{
                    backgroundColor: "rgba(240,192,64,0.08)",
                    border: `1px solid rgba(240,192,64,0.25)`,
                    borderRadius: "0.75rem",
                    padding: "0.85rem 1.1rem",
                    marginBottom: "2rem",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.65rem",
                  }}
                >
                  <Users size={15} color={C.accentDark} style={{ flexShrink: 0, marginTop: "0.15rem" }} />
                  <p style={{ fontFamily: C.bodyFont, fontSize: "0.82rem", color: C.earth, lineHeight: 1.6, margin: 0 }}>
                    Pour les groupes de 8 personnes et plus, merci de nous contacter directement par téléphone ou par email.
                  </p>
                </div>

                <button
                  type="submit"
                  style={{
                    width: "100%",
                    backgroundColor: C.bgDark,
                    color: C.accent,
                    padding: "1.1rem",
                    borderRadius: "1rem",
                    border: "none",
                    fontWeight: 700,
                    fontFamily: C.bodyFont,
                    fontSize: "0.95rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    letterSpacing: "0.02em",
                  }}
                >
                  Confirmer ma réservation <ArrowRight size={16} />
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
