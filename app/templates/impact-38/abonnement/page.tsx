"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { C, ABONNEMENT_PLANS, SectionReveal, PageHeader } from "../shared";

export default function AbonnementPage() {
  const [billing, setBilling] = useState<"mensuel" | "bimestriel">("mensuel");
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", plan: "", grind: "whole" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div>
      <PageHeader
        title="Abonnement"
        subtitle="Recevez votre café de spécialité chaque mois, fraîchement torréfié et prêt à brasser. Résiliable à tout moment."
      />
      <div style={{ padding: "80px 5%", background: C.bg }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>

          {/* Billing toggle */}
          <SectionReveal>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 56 }}>
              <div style={{ display: "inline-flex", background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, padding: 4, gap: 4 }}>
                {(["mensuel", "bimestriel"] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setBilling(option)}
                    style={{
                      padding: "10px 28px",
                      borderRadius: 8,
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "'DM Sans', system-ui",
                      fontSize: 14,
                      fontWeight: 700,
                      background: billing === option ? C.caramel : "transparent",
                      color: billing === option ? C.white : C.textMuted,
                      transition: "all 0.2s",
                      position: "relative",
                    }}
                  >
                    {option === "mensuel" ? "Mensuel" : "Bimestriel"}
                    {option === "bimestriel" && (
                      <span style={{ position: "absolute", top: -10, right: -8, background: "#22c55e", color: "#fff", fontSize: 9, fontWeight: 800, padding: "2px 6px", borderRadius: 10, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                        -10%
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </SectionReveal>

          {/* Plans */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 28, marginBottom: 80 }}>
            {ABONNEMENT_PLANS.map((plan, i) => (
              <SectionReveal key={plan.name} delay={i * 0.1}>
                <div style={{
                  background: plan.highlight ? C.espresso : C.white,
                  borderRadius: 16,
                  padding: 36,
                  border: plan.highlight ? `2px solid ${C.caramel}` : `1px solid ${C.border}`,
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}>
                  {plan.badge && (
                    <div style={{ position: "absolute", top: -1, right: 24, background: plan.highlight ? C.caramel : C.caramelLight, color: plan.highlight ? C.espresso : C.caramel, fontSize: 10, fontWeight: 800, padding: "4px 14px", borderRadius: "0 0 8px 8px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      {plan.badge}
                    </div>
                  )}
                  <div style={{ marginBottom: 4, fontFamily: "'Fraunces', Georgia, serif", fontSize: 28, fontWeight: 700, color: plan.highlight ? C.cream : C.espresso }}>
                    {plan.name}
                  </div>
                  <div style={{ fontSize: 13, color: plan.highlight ? C.sand : C.textMuted, marginBottom: 20, fontWeight: 300 }}>
                    {plan.weight} · {plan.origins}
                  </div>
                  <div style={{ marginBottom: 28 }}>
                    <motion.span
                      key={billing + plan.name}
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      style={{ display: "inline-block", fontFamily: "'Fraunces', Georgia, serif", fontSize: 48, fontWeight: 700, color: plan.highlight ? C.caramel : C.espresso }}
                    >
                      {billing === "mensuel" ? plan.price : plan.priceBi}€
                    </motion.span>
                    <span style={{ fontSize: 13, color: plan.highlight ? C.sand : C.textMuted, marginLeft: 6 }}>/{plan.period}</span>
                  </div>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
                    {plan.features.map((f) => (
                      <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                        <Check size={14} color={C.caramel} style={{ marginTop: 1, flexShrink: 0 }} />
                        <span style={{ fontSize: 13, color: plan.highlight ? C.sand : C.text, fontWeight: 300, lineHeight: 1.5 }}>{f}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData(fd => ({ ...fd, plan: plan.name }))}
                    style={{ display: "block", width: "100%", background: plan.highlight ? C.caramel : C.caramelLight, color: plan.highlight ? C.espresso : C.caramel, padding: "14px 24px", borderRadius: 8, fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer" }}
                  >
                    Choisir {plan.name}
                  </button>
                </div>
              </SectionReveal>
            ))}
          </div>

          {/* Subscription form */}
          {formData.plan && !submitted && (
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
              style={{ background: C.white, borderRadius: 16, padding: 40, border: `2px solid ${C.caramel}`, maxWidth: 560, margin: "0 auto" }}>
              <h3 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 24, fontWeight: 700, color: C.espresso, marginBottom: 8 }}>
                Commencer — Plan {formData.plan}
              </h3>
              <p style={{ fontSize: 14, color: C.textMuted, marginBottom: 28, fontWeight: 300 }}>
                Renseignez vos coordonnées et nous vous contacterons pour finaliser votre abonnement.
              </p>
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: C.text, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Nom complet</label>
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
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: C.text, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Mouture souhaitée</label>
                  <select value={formData.grind} onChange={(e) => setFormData(f => ({ ...f, grind: e.target.value }))}
                    style={{ width: "100%", padding: "12px 16px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 15, fontFamily: "'DM Sans', system-ui", background: C.bg, color: C.text, boxSizing: "border-box" }}>
                    <option value="whole">Grain entier (recommandé)</option>
                    <option value="filter-coarse">Filtre grossier (French press)</option>
                    <option value="filter-medium">Filtre moyen (V60, dripper)</option>
                    <option value="espresso">Espresso</option>
                    <option value="aeropress">AeroPress</option>
                  </select>
                </div>
                <button type="submit"
                  style={{ background: C.caramel, color: C.white, padding: "14px 24px", borderRadius: 8, fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer" }}
                >
                  Démarrer mon abonnement
                </button>
              </form>
            </motion.div>
          )}

          {submitted && (
            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}
              style={{ background: C.white, borderRadius: 16, padding: 40, border: `2px solid ${C.caramel}`, maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>☕</div>
              <h3 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 24, fontWeight: 700, color: C.espresso, marginBottom: 12 }}>
                Bienvenue dans la famille Origin Roast !
              </h3>
              <p style={{ fontSize: 15, color: C.textMuted, fontWeight: 300, lineHeight: 1.75 }}>
                Nous vous contacterons dans les 24h pour confirmer votre abonnement et recueillir vos préférences de livraison.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
