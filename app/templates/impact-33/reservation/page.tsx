"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, ShoppingBag, MapPin, Phone, Mail, Clock } from "lucide-react";
import { C, FONT_HEADING, FONT_BODY } from "../shared";

export default function ReservationPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    time: "",
    note: "",
    products: [] as string[],
  });

  const availableProducts = [
    "Pain au levain (6,50 €)",
    "Baguette tradition (1,40 €)",
    "Croissant pur beurre (1,80 €)",
    "Pain au chocolat (2,10 €)",
    "Kouign-amann (3,20 €)",
    "Tarte Tatin part (4,80 €)",
    "Tarte citron meringuée part (4,50 €)",
    "Mille-feuille (4,20 €)",
    "Brioche tressée (5,90 €)",
  ];

  const toggleProduct = (p: string) => {
    setForm((prev) => ({
      ...prev,
      products: prev.products.includes(p)
        ? prev.products.filter((x) => x !== p)
        : [...prev.products, p],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inputStyle: React.CSSProperties = { width: "100%", padding: "12px 16px", borderRadius: 10, border: `1.5px solid ${C.border}`, fontSize: 15, fontFamily: FONT_BODY, color: C.text, background: C.white, outline: "none", boxSizing: "border-box" };

  return (
    <section style={{ padding: "80px 80px 120px", background: C.bg, fontFamily: FONT_BODY, minHeight: "100dvh" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 60, maxWidth: 1100, margin: "0 auto", alignItems: "start" }}>
        
        {/* Reservation / Order Form */}
        <div>
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ background: C.white, borderRadius: 24, padding: "48px 44px", border: `1px solid ${C.border}`, boxShadow: C.shadowLg, textAlign: "center" }}
            >
              <div style={{ width: 80, height: 80, background: C.accentLight, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px" }}>
                <CheckCircle size={40} color={C.accent} />
              </div>
              <h2 style={{ fontFamily: FONT_HEADING, fontSize: 30, fontWeight: 700, color: C.text, marginBottom: 16 }}>
                Merci
              </h2>
              <p style={{ fontSize: 16, color: C.textMuted, lineHeight: 1.7, marginBottom: 32 }}>
                Merci, nous vous répondrons sous 24h.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                style={{ background: C.accent, color: C.white, border: "none", borderRadius: 10, padding: "14px 32px", fontWeight: 700, fontSize: 16, cursor: "pointer", fontFamily: FONT_BODY }}
              >
                Passer une autre commande
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} style={{ background: C.white, borderRadius: 24, padding: "44px 38px", border: `1px solid ${C.border}`, boxShadow: C.shadow }}>
              <h2 style={{ fontFamily: FONT_HEADING, fontSize: 26, fontWeight: 700, color: C.text, marginBottom: 24 }}>Réserver en Click & Collect</h2>

              {/* Product selector */}
              <div style={{ marginBottom: 28 }}>
                <label style={{ fontSize: 14, fontWeight: 700, color: C.text, display: "block", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>1. Choisissez vos produits</label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(200px, 100%), 1fr))", gap: 10 }}>
                  {availableProducts.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => toggleProduct(p)}
                      style={{
                        padding: "12px 16px",
                        borderRadius: 10,
                        border: `2px solid ${form.products.includes(p) ? C.accent : C.border}`,
                        background: form.products.includes(p) ? C.accentLight : C.white,
                        color: form.products.includes(p) ? C.accent : C.text,
                        fontWeight: form.products.includes(p) ? 700 : 500,
                        fontSize: 13,
                        cursor: "pointer",
                        textAlign: "left",
                        fontFamily: FONT_BODY,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        boxSizing: "border-box"
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Retrait */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 700, color: C.textMuted, display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Date de retrait</label>
                  <input type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} style={inputStyle} min={new Date().toISOString().split("T")[0]} />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 700, color: C.textMuted, display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Heure de retrait</label>
                  <select required value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} style={inputStyle}>
                    <option value="">Choisir un créneau</option>
                    {["07h00", "08h00", "09h00", "10h00", "11h00", "12h00", "14h00", "15h00", "16h00", "17h00", "18h00"].map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Coordonnees */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 700, color: C.textMuted, display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Nom complet</label>
                  <input type="text" required placeholder="Marie Dupont" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 700, color: C.textMuted, display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Téléphone</label>
                  <input type="tel" required placeholder="06 12 34 56 78" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} style={inputStyle} />
                </div>
              </div>

              <div style={{ marginBottom: 28 }}>
                <label style={{ fontSize: 13, fontWeight: 700, color: C.textMuted, display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Adresse email</label>
                <input type="email" required placeholder="marie@exemple.fr" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={inputStyle} />
              </div>

              <div style={{ marginBottom: 32 }}>
                <label style={{ fontSize: 13, fontWeight: 700, color: C.textMuted, display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Note (optionnel)</label>
                <textarea rows={3} placeholder="Demande de cuisson particulière, etc." value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} style={{ ...inputStyle, resize: "vertical" }} />
              </div>

              <motion.button type="submit"
                style={{ width: "100%", background: C.accent, color: C.white, border: "none", borderRadius: 12, padding: "18px", fontWeight: 700, fontSize: 18, cursor: "pointer", fontFamily: FONT_BODY }}
                whileHover={{ background: C.accentDark, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <ShoppingBag size={20} style={{ marginRight: 10, verticalAlign: "middle" }} />
                Confirmer ma commande
              </motion.button>
            </form>
          )}
        </div>

        {/* Contact Info Column */}
        <div>
          <h2 style={{ fontFamily: FONT_HEADING, fontSize: 24, fontWeight: 700, color: C.text, marginBottom: 24 }}>Notre Boutique</h2>
          
          <div style={{ background: C.bgSection, borderRadius: 18, height: 200, marginBottom: 28, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${C.border}`, flexDirection: "column", gap: 10 }}>
            <MapPin size={32} color={C.accent} />
            <span style={{ fontSize: 14, color: C.textMuted, fontWeight: 600 }}>Paris, Île-de-France</span>
            <span style={{ fontSize: 13, color: C.textMuted }}>Adresse communiquée sur demande à valentinmilliand@aevia.services</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {[
              { icon: <MapPin size={18} />, label: "Adresse", text: "Siège social sur demande à valentinmilliand@aevia.services" },
              { icon: <Phone size={18} />, label: "Téléphone", text: "01 43 55 67 89" },
              { icon: <Mail size={18} />, label: "Email", text: "valentinmilliand@aevia.services" },
              { icon: <Clock size={18} />, label: "Horaires", text: "Mar–Sam 7h–19h | Dim 7h–13h" }
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{ width: 44, height: 44, background: C.accentLight, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ color: C.accent }}>{item.icon}</span>
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 3 }}>{item.label || "Contact"}</div>
                  <div style={{ fontSize: 14, color: C.textMuted }}>{item.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
