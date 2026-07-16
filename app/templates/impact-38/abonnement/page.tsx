"use client";

import React, { useState } from "react";
import { Check, CheckCircle, Star, ArrowRight, Coffee, Package, Truck, Shield, Heart, Award, Users, Leaf, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { C, SERIF, SANS, ABONNEMENT_PLANS, SectionReveal, PageHeader, ORIGINS } from "../shared";

// ─── Page-level constants ─────────────────────────────────────────────────────

const GRIND_OPTIONS = [
  { value: "whole", label: "Grain entier", desc: "Recommandé — fraîcheur maximale" },
  { value: "filter-coarse", label: "Filtre grossier", desc: "French press, cold brew" },
  { value: "filter-medium", label: "Filtre moyen", desc: "V60, Chemex, dripper" },
  { value: "filter-fine", label: "Filtre fin", desc: "AeroPress, Moka" },
  { value: "espresso", label: "Espresso", desc: "Machine à levier ou automatique" },
];

const DELIVERY_OPTIONS = [
  { value: "monthly", label: "Mensuelle", desc: "1 livraison / mois" },
  { value: "bimonthly", label: "Bi-mensuelle", desc: "2 livraisons / mois", badge: "Fraîcheur max" },
  { value: "weekly", label: "Hebdomadaire", desc: "1 livraison / semaine", badge: "Pro" },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    icon: CheckCircle,
    title: "Choisissez votre plan",
    desc: "Découverte (250g), Amateur (500g), ou Connaisseur (1kg). Mensuel ou bi-mensuel.",
  },
  {
    step: "02",
    icon: Coffee,
    title: "Indiquez vos préférences",
    desc: "Méthode de préparation, profil aromatique, mouture. Notre torréfacteur s'adapte à vous.",
  },
  {
    step: "03",
    icon: Package,
    title: "On torréfie à la commande",
    desc: "Votre café part en torréfaction dès confirmation. Il repose, puis est emballé sous azote.",
  },
  {
    step: "04",
    icon: Truck,
    title: "Livraison à domicile",
    desc: "Expédié sous 48h post-torréfaction. Vous recevez le numéro de suivi par email.",
  },
];

const TRUST_SIGNALS = [
  { icon: Shield, title: "Aucun engagement", desc: "Résiliez quand vous voulez, sans justification ni frais." },
  { icon: Heart, title: "Satisfaction garantie", desc: "Premier sac non satisfaisant ? On vous le remplace ou rembourse." },
  { icon: Truck, title: "Livraison offerte", desc: "Gratuite sur tous les abonnements en France métropolitaine." },
  { icon: Award, title: "Sélection curative", desc: "Chaque mois, les meilleurs lots disponibles — moins de 8% des échantillons retenus." },
  { icon: Leaf, title: "Commerce direct", desc: "Payons les producteurs au-dessus des minimums Fair Trade avant la récolte." },
  { icon: Users, title: "Communauté 2 400+", desc: "2 400 abonnés actifs nous font confiance. Rejoignez-les." },
];

const PLAN_COMPARISON_FEATURES = [
  { feature: "Origines par livraison", decouv: "1", amateur: "2", connais: "3" },
  { feature: "Poids total", decouv: "250g", amateur: "500g", connais: "1 kg" },
  { feature: "Prix mensuel", decouv: "18€", amateur: "32€", connais: "55€" },
  { feature: "Prix bimestriel (–10%)", decouv: "16€", amateur: "28€", connais: "48€" },
  { feature: "Grain entier ou moulu", decouv: "✓", amateur: "✓", connais: "✓" },
  { feature: "Notes de dégustation", decouv: "Basiques", amateur: "Détaillées", connais: "Détaillées + histoire producteur" },
  { feature: "Livraison offerte", decouv: "✓", amateur: "✓", connais: "✓ (Express)" },
  { feature: "Accès nouveaux lots en priorité", decouv: "—", amateur: "✓", connais: "✓ (48h avant)" },
  { feature: "Accès réserves exclusives", decouv: "—", amateur: "—", connais: "✓" },
  { feature: "Invitation ateliers tarif préférentiel", decouv: "—", amateur: "—", connais: "✓" },
  { feature: "Pause libre", decouv: "✓", amateur: "✓", connais: "✓" },
  { feature: "Résiliation libre", decouv: "✓", amateur: "✓", connais: "✓" },
];

const REVIEW_HIGHLIGHTS = [
  { name: "Tariq H.", avatar: "TH", plan: "Connaisseur", rating: 5, short: "Chaque mois une découverte. Le niveau d'un caviste — mais pour le café." },
  { name: "Sophie L.", avatar: "SL", plan: "Amateur", rating: 5, short: "La régularité est remarquable. Je commande pour mon café aussi." },
  { name: "Hana M.", avatar: "HM", plan: "Connaisseur", rating: 5, short: "Accès aux réserves exclusives — j'ai eu le Kenya AA deux semaines avant tout le monde." },
  { name: "Carlos M.", avatar: "CM", plan: "Amateur", rating: 5, short: "Pour mon restaurant, la qualité justifie largement le prix. Mes clients le remarquent." },
];

const FRESHNESS_TIMELINE = [
  { day: "J", label: "Commande", desc: "Votre prélèvement est confirmé" },
  { day: "J+1", label: "Torréfaction", desc: "Votre lot entre dans le tambour" },
  { day: "J+7", label: "Repos", desc: "Dégazage optimal (5–14j selon procédé)" },
  { day: "J+9", label: "Expédition", desc: "Emballage sous azote, départ colis" },
  { day: "J+10", label: "Livraison", desc: "Reçu chez vous, au pic de fraîcheur" },
];

// ─── Sub-components ────────────────────────────────────────────────────────────

function PlanComparisonTable({ billing }: { billing: "mensuel" | "bimestriel" }) {
  const highlights = [2, 3, 4, 11];
  return (
    <div style={{ overflowX: "auto", borderRadius: 14, border: `1px solid ${C.border}` }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: C.espresso }}>
            <th style={{ padding: "16px 20px", textAlign: "left", fontFamily: SERIF, fontSize: 13, color: C.sand, fontWeight: 400, width: "40%" }}>
              Fonctionnalités
            </th>
            {ABONNEMENT_PLANS.map((plan) => (
              <th key={plan.name} style={{ padding: "16px 20px", textAlign: "center", fontFamily: SERIF, fontSize: 15, color: plan.highlight ? C.caramel : C.cream, fontWeight: 700 }}>
                {plan.name}
                {plan.badge && (
                  <div style={{ fontSize: 9, fontWeight: 800, color: C.caramel, textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 3 }}>
                    {plan.badge}
                  </div>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {PLAN_COMPARISON_FEATURES.map((row, i) => (
            <tr
              key={row.feature}
              style={{
                background: highlights.includes(i) ? C.bgAlt : C.white,
                borderBottom: `1px solid ${C.borderLight}`,
              }}
            >
              <td style={{ padding: "13px 20px", fontSize: 13, color: C.text, fontWeight: 400 }}>
                {row.feature}
              </td>
              {([row.decouv, row.amateur, row.connais] as const).map((val, j) => (
                <td key={j} style={{ padding: "13px 20px", textAlign: "center", fontSize: 13, color: val === "—" ? C.borderLight : val === "✓" ? C.caramel : C.espresso, fontWeight: val === "✓" ? 700 : 400 }}>
                  {val === "✓" ? <Check size={15} color={C.caramel} style={{ display: "inline" }} /> : val}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FreshnessTimeline() {
  return (
    <div style={{ display: "flex", gap: 0, alignItems: "stretch", position: "relative" }}>
      {FRESHNESS_TIMELINE.map((item, i) => (
        <div key={item.day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
          {i < FRESHNESS_TIMELINE.length - 1 && (
            <div style={{ position: "absolute", top: 20, left: "50%", right: "-50%", height: 2, background: `${C.caramel}30`, zIndex: 0 }} />
          )}
          <div style={{ width: 42, height: 42, borderRadius: "50%", background: C.caramel, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12, zIndex: 1, flexShrink: 0 }}>
            <span style={{ fontFamily: SERIF, fontSize: 10, fontWeight: 800, color: C.espresso }}>{item.day}</span>
          </div>
          <div style={{ textAlign: "center", padding: "0 4px" }}>
            <div style={{ fontFamily: SERIF, fontSize: 13, fontWeight: 700, color: C.espresso, marginBottom: 4 }}>{item.label}</div>
            <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 300, lineHeight: 1.5 }}>{item.desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function AbonnementPage() {
  const [billing, setBilling] = useState<"mensuel" | "bimestriel">("mensuel");
  const [submitted, setSubmitted] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    grind: "whole",
    delivery: "monthly",
    preferences: "",
    address: "",
    city: "",
    postal: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: 8,
    border: `1px solid ${C.border}`,
    fontSize: 15,
    fontFamily: SANS,
    background: C.bg,
    color: C.text,
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 11,
    fontWeight: 700,
    color: C.text,
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    marginBottom: 7,
  };

  return (
    <div style={{ background: C.bg }}>
      <PageHeader
        title="Abonnement café"
        subtitle="Recevez votre café de spécialité chaque mois, fraîchement torréfié et prêt à brasser. Sans engagement, sans surprise."
      />

      {/* ─── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section style={{ padding: "60px 5%", background: C.bgAlt, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: 44 }}>
              <div style={{ fontFamily: SERIF, fontSize: 13, letterSpacing: "0.18em", textTransform: "uppercase", color: C.caramel, marginBottom: 12 }}>
                En 4 étapes simples
              </div>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 900, color: C.espresso }}>
                Comment ça fonctionne ?
              </h2>
            </div>
          </SectionReveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
            {HOW_IT_WORKS.map((step, i) => (
              <SectionReveal key={step.step} delay={i * 0.09}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ width: 56, height: 56, background: C.caramelLight, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                    <step.icon size={24} color={C.caramel} />
                  </div>
                  <div style={{ fontFamily: SERIF, fontSize: 11, fontWeight: 700, color: C.caramel, letterSpacing: "0.1em", marginBottom: 8 }}>
                    {step.step}
                  </div>
                  <div style={{ fontFamily: SERIF, fontSize: 16, fontWeight: 700, color: C.espresso, marginBottom: 8 }}>{step.title}</div>
                  <p style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.7, fontWeight: 300 }}>{step.desc}</p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FRESHNESS TIMELINE ───────────────────────────────────────────── */}
      <section style={{ padding: "60px 5%", background: C.bg }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 900, color: C.espresso, marginBottom: 12 }}>
                Du prélèvement à votre tasse : 10 jours
              </h2>
              <p style={{ fontSize: 14, color: C.textMuted, maxWidth: 440, margin: "0 auto", lineHeight: 1.8, fontWeight: 300 }}>
                Chaque sachet arrive entre J+7 et J+14 post-torréfaction — le pic de fraîcheur pour l'espresso comme pour le filtre.
              </p>
            </div>
          </SectionReveal>
          <SectionReveal delay={0.1}>
            <div style={{ background: C.white, borderRadius: 16, padding: "40px 36px", border: `1px solid ${C.border}` }}>
              <FreshnessTimeline />
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ─── PLANS ────────────────────────────────────────────────────────── */}
      <section style={{ padding: "80px 5%", background: C.bgAlt }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <div style={{ fontFamily: SERIF, fontSize: 13, letterSpacing: "0.18em", textTransform: "uppercase", color: C.caramel, marginBottom: 14 }}>
                Nos formules
              </div>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 900, color: C.espresso }}>
                Choisissez votre rythme
              </h2>
            </div>
          </SectionReveal>

          {/* Billing toggle */}
          <SectionReveal delay={0.05}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 48, marginTop: 28 }}>
              <div style={{ display: "inline-flex", background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, padding: 4, gap: 4 }}>
                {(["mensuel", "bimestriel"] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setBilling(option)}
                    style={{
                      padding: "10px 32px",
                      borderRadius: 8,
                      border: "none",
                      cursor: "pointer",
                      fontFamily: SANS,
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
                      <span style={{
                        position: "absolute",
                        top: -10,
                        right: -8,
                        background: "#22c55e",
                        color: "#fff",
                        fontSize: 9,
                        fontWeight: 800,
                        padding: "2px 6px",
                        borderRadius: 10,
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                      }}>
                        –10%
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </SectionReveal>

          {/* Plans grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))", gap: 28, marginBottom: 48 }}>
            {ABONNEMENT_PLANS.map((plan, i) => (
              <SectionReveal key={plan.name} delay={i * 0.1}>
                <div style={{
                  background: plan.highlight ? C.espresso : C.white,
                  borderRadius: 16,
                  padding: 36,
                  border: selectedPlan === plan.name
                    ? `2px solid ${C.caramel}`
                    : plan.highlight
                    ? `2px solid ${C.caramel}`
                    : `1px solid ${C.border}`,
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  boxShadow: selectedPlan === plan.name ? "0 8px 32px rgba(196,129,58,0.18)" : "none",
                  transition: "box-shadow 0.2s",
                }}>
                  {plan.badge && (
                    <div style={{ position: "absolute", top: -1, right: 24, background: plan.highlight ? C.caramel : C.caramelLight, color: plan.highlight ? C.espresso : C.caramel, fontSize: 10, fontWeight: 800, padding: "4px 14px", borderRadius: "0 0 8px 8px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      {plan.badge}
                    </div>
                  )}
                  <div style={{ marginBottom: 4, fontFamily: SERIF, fontSize: 28, fontWeight: 700, color: plan.highlight ? C.cream : C.espresso }}>
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
                      style={{ display: "inline-block", fontFamily: SERIF, fontSize: 48, fontWeight: 700, color: plan.highlight ? C.caramel : C.espresso }}
                    >
                      {billing === "mensuel" ? plan.price : plan.priceBi}€
                    </motion.span>
                    <span style={{ fontSize: 13, color: plan.highlight ? C.sand : C.textMuted, marginLeft: 6 }}>/{plan.period}</span>
                    {billing === "bimestriel" && (
                      <div style={{ fontSize: 11, color: "#22c55e", fontWeight: 700, marginTop: 4 }}>
                        Économisez {(parseInt(plan.price) - parseInt(plan.priceBi))}€/mois
                      </div>
                    )}
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
                    onClick={() => setSelectedPlan(plan.name)}
                    style={{
                      display: "block",
                      width: "100%",
                      background: selectedPlan === plan.name ? C.caramel : plan.highlight ? C.caramel : C.caramelLight,
                      color: selectedPlan === plan.name ? C.white : plan.highlight ? C.espresso : C.caramel,
                      padding: "14px 24px",
                      borderRadius: 8,
                      fontWeight: 700,
                      fontSize: 15,
                      border: "none",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    {selectedPlan === plan.name ? "✓ Sélectionné" : `Choisir ${plan.name}`}
                  </button>
                </div>
              </SectionReveal>
            ))}
          </div>

          {/* Comparison table toggle */}
          <SectionReveal delay={0.15}>
            <div style={{ textAlign: "center" }}>
              <button
                type="button"
                onClick={() => setShowComparison(!showComparison)}
                style={{ background: "none", border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8, color: C.caramel, fontWeight: 700, fontSize: 14 }}
              >
                Comparer les formules en détail
                <motion.div animate={{ rotate: showComparison ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown size={16} />
                </motion.div>
              </button>
              <AnimatePresence>
                {showComparison && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ overflow: "hidden", marginTop: 24 }}
                  >
                    <PlanComparisonTable billing={billing} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ─── SUBSCRIPTION FORM ────────────────────────────────────────────── */}
      <section style={{ padding: "80px 5%", background: C.bg }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: 44 }}>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 900, color: C.espresso, marginBottom: 12 }}>
                {selectedPlan ? `Démarrer — Plan ${selectedPlan}` : "Démarrer votre abonnement"}
              </h2>
              <p style={{ fontSize: 14, color: C.textMuted, fontWeight: 300 }}>
                {selectedPlan
                  ? "Remplissez le formulaire et nous confirmons sous 24h."
                  : "Sélectionnez un plan ci-dessus, puis remplissez vos informations."}
              </p>
            </div>
          </SectionReveal>

          {!submitted ? (
            <SectionReveal delay={0.1}>
              <div style={{ background: C.white, borderRadius: 16, padding: 44, border: `2px solid ${selectedPlan ? C.caramel : C.border}`, transition: "border-color 0.3s" }}>
                {!selectedPlan && (
                  <div style={{ background: C.caramelLight, borderRadius: 10, padding: "14px 18px", marginBottom: 28 }}>
                    <p style={{ fontSize: 13, color: C.espresso, fontWeight: 400 }}>
                      Sélectionnez un plan ci-dessus pour commencer, ou remplissez directement — nous vous contacterons pour confirmer le plan.
                    </p>
                  </div>
                )}
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                      <label style={labelStyle}>Prénom & Nom</label>
                      <input type="text" required value={formData.name}
                        onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
                        placeholder="Sophie Martin"
                        style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Email</label>
                      <input type="email" required value={formData.email}
                        onChange={(e) => setFormData((f) => ({ ...f, email: e.target.value }))}
                        placeholder="sophie@example.com"
                        style={inputStyle} />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                      <label style={labelStyle}>Téléphone (facultatif)</label>
                      <input type="tel" value={formData.phone}
                        onChange={(e) => setFormData((f) => ({ ...f, phone: e.target.value }))}
                        placeholder="+33 6 12 34 56 78"
                        style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Mouture souhaitée</label>
                      <select value={formData.grind} onChange={(e) => setFormData((f) => ({ ...f, grind: e.target.value }))}
                        style={inputStyle}>
                        {GRIND_OPTIONS.map((g) => (
                          <option key={g.value} value={g.value}>{g.label} — {g.desc}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>Fréquence de livraison</label>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      {DELIVERY_OPTIONS.map((d) => (
                        <button
                          key={d.value}
                          type="button"
                          onClick={() => setFormData((f) => ({ ...f, delivery: d.value }))}
                          style={{
                            flex: 1,
                            padding: "12px 14px",
                            borderRadius: 8,
                            border: `1px solid ${formData.delivery === d.value ? C.caramel : C.border}`,
                            background: formData.delivery === d.value ? C.caramelLight : C.bg,
                            cursor: "pointer",
                            textAlign: "left",
                            position: "relative",
                          }}
                        >
                          {d.badge && (
                            <span style={{ position: "absolute", top: -8, right: 8, background: C.caramel, color: C.white, fontSize: 9, fontWeight: 800, padding: "2px 7px", borderRadius: 10, textTransform: "uppercase" }}>
                              {d.badge}
                            </span>
                          )}
                          <div style={{ fontFamily: SERIF, fontSize: 14, fontWeight: 700, color: C.espresso, marginBottom: 3 }}>{d.label}</div>
                          <div style={{ fontSize: 12, color: C.textMuted, fontWeight: 300 }}>{d.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>Adresse de livraison</label>
                    <input type="text" required value={formData.address}
                      onChange={(e) => setFormData((f) => ({ ...f, address: e.target.value }))}
                      placeholder="12 rue de la République, Bât B"
                      style={inputStyle} />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16 }}>
                    <div>
                      <label style={labelStyle}>Code postal</label>
                      <input type="text" required value={formData.postal}
                        onChange={(e) => setFormData((f) => ({ ...f, postal: e.target.value }))}
                        placeholder="75001"
                        style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Ville</label>
                      <input type="text" required value={formData.city}
                        onChange={(e) => setFormData((f) => ({ ...f, city: e.target.value }))}
                        placeholder="Paris"
                        style={inputStyle} />
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>Préférences & notes</label>
                    <textarea rows={3} value={formData.preferences}
                      onChange={(e) => setFormData((f) => ({ ...f, preferences: e.target.value }))}
                      placeholder="Profil aromatique préféré, allergies, méthode de préparation, cafés que vous aimez déjà..."
                      style={{ ...inputStyle, resize: "vertical" }} />
                  </div>

                  <div style={{ background: C.bgAlt, borderRadius: 10, padding: "16px 20px", display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ fontFamily: SERIF, fontSize: 14, fontWeight: 700, color: C.espresso }}>Récapitulatif</div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                      <span style={{ color: C.textMuted }}>Plan</span>
                      <span style={{ fontWeight: 600, color: C.espresso }}>{selectedPlan || "À définir"}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                      <span style={{ color: C.textMuted }}>Facturation</span>
                      <span style={{ fontWeight: 600, color: C.espresso }}>{billing === "mensuel" ? "Mensuelle" : "Bimestrielle (−10%)"}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                      <span style={{ color: C.textMuted }}>Mouture</span>
                      <span style={{ fontWeight: 600, color: C.espresso }}>{GRIND_OPTIONS.find((g) => g.value === formData.grind)?.label}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                      <span style={{ color: C.textMuted }}>Livraison</span>
                      <span style={{ fontWeight: 600, color: "#22c55e" }}>Offerte</span>
                    </div>
                  </div>

                  <button type="submit" style={{
                    background: C.caramel,
                    color: C.white,
                    padding: "16px 28px",
                    borderRadius: 8,
                    fontWeight: 700,
                    fontSize: 16,
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}>
                    Démarrer mon abonnement <ArrowRight size={18} />
                  </button>
                  <p style={{ fontSize: 11, color: C.textMuted, textAlign: "center", fontWeight: 300 }}>
                    Sans engagement — résiliez à tout moment. Premier prélèvement à la confirmation de votre abonnement.
                  </p>
                </form>
              </div>
            </SectionReveal>
          ) : (
            <SectionReveal>
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                style={{ background: C.white, borderRadius: 16, padding: 52, border: `2px solid ${C.caramel}`, textAlign: "center" }}
              >
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", duration: 0.5, delay: 0.1 }}>
                  <Coffee size={56} color={C.caramel} style={{ marginBottom: 20 }} />
                </motion.div>
                <h3 style={{ fontFamily: SERIF, fontSize: 28, fontWeight: 700, color: C.espresso, marginBottom: 14 }}>
                  Merci
                </h3>
                <p style={{ fontSize: 15, color: C.textMuted, fontWeight: 300, lineHeight: 1.8, marginBottom: 28, maxWidth: 400, margin: "0 auto 28px" }}>
                  Merci, nous vous répondrons sous 24h.
                </p>
                <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                  <Link href="/templates/impact-38/" style={{ textDecoration: "none" }}>
                    <button type="button" style={{ background: C.caramelLight, color: C.caramel, padding: "12px 24px", borderRadius: 8, fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer" }}>
                      Retour à l'accueil
                    </button>
                  </Link>
                  <Link href="/templates/impact-38/workshops" style={{ textDecoration: "none" }}>
                    <button type="button" style={{ background: C.espresso, color: C.cream, padding: "12px 24px", borderRadius: 8, fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer" }}>
                      Voir nos ateliers
                    </button>
                  </Link>
                </div>
              </motion.div>
            </SectionReveal>
          )}
        </div>
      </section>

      {/* ─── TRUST SIGNALS ────────────────────────────────────────────────── */}
      <section style={{ padding: "80px 5%", background: C.espresso }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: 52 }}>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 900, color: C.cream, marginBottom: 12 }}>
                Pourquoi nous faire confiance ?
              </h2>
            </div>
          </SectionReveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {TRUST_SIGNALS.map((signal, i) => (
              <SectionReveal key={signal.title} delay={i * 0.08}>
                <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: 28 }}>
                  <div style={{ width: 44, height: 44, background: `${C.caramel}25`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                    <signal.icon size={20} color={C.caramel} />
                  </div>
                  <div style={{ fontFamily: SERIF, fontSize: 17, fontWeight: 700, color: C.cream, marginBottom: 10 }}>{signal.title}</div>
                  <p style={{ fontSize: 13, color: C.sand, lineHeight: 1.75, fontWeight: 300 }}>{signal.desc}</p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── REVIEW HIGHLIGHTS ────────────────────────────────────────────── */}
      <section style={{ padding: "80px 5%", background: C.bgAlt }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 900, color: C.espresso }}>
                Ils sont déjà abonnés
              </h2>
            </div>
          </SectionReveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
            {REVIEW_HIGHLIGHTS.map((r, i) => (
              <SectionReveal key={r.name} delay={i * 0.08}>
                <div style={{ background: C.white, borderRadius: 14, padding: 28, border: `1px solid ${C.border}`, display: "flex", gap: 18, alignItems: "flex-start" }}>
                  <div style={{ width: 46, height: 46, borderRadius: "50%", background: C.caramelLight, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontWeight: 700, fontSize: 14, color: C.caramel, flexShrink: 0 }}>
                    {r.avatar}
                  </div>
                  <div>
                    <div style={{ display: "flex", gap: 3, marginBottom: 8 }}>
                      {Array.from({ length: r.rating }).map((_, j) => (
                        <Star key={j} size={12} fill={C.caramel} color={C.caramel} />
                      ))}
                    </div>
                    <p style={{ fontFamily: SERIF, fontSize: 14, color: C.espresso, lineHeight: 1.7, fontStyle: "italic", marginBottom: 10 }}>"{r.short}"</p>
                    <div style={{ fontSize: 12, color: C.textMuted }}>
                      <strong style={{ color: C.espresso }}>{r.name}</strong> · Plan {r.plan}
                    </div>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ORIGIN HIGHLIGHTS ────────────────────────────────────────────── */}
      <section style={{ padding: "60px 5% 80px", background: C.bg }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <div style={{ fontFamily: SERIF, fontSize: 13, letterSpacing: "0.18em", textTransform: "uppercase", color: C.caramel, marginBottom: 12 }}>
                Dans votre prochaine box
              </div>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 900, color: C.espresso }}>
                Ces origines pourraient être les vôtres
              </h2>
            </div>
          </SectionReveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {ORIGINS.map((coffee, i) => (
              <SectionReveal key={coffee.name} delay={i * 0.08}>
                <div style={{ background: C.white, borderRadius: 12, overflow: "hidden", border: `1px solid ${C.border}` }}>
                  <div style={{ padding: "20px 20px 16px" }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
                      {coffee.region} · {coffee.roast}
                    </div>
                    <div style={{ fontFamily: SERIF, fontSize: 15, fontWeight: 700, color: C.espresso, marginBottom: 10 }}>{coffee.name}</div>
                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                      {coffee.flavor.slice(0, 2).map((f) => (
                        <span key={f} style={{ background: `${C.caramel}15`, color: C.caramel, fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 20 }}>{f}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ padding: "12px 20px", background: C.bgAlt, borderTop: `1px solid ${C.borderLight}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 700, color: C.caramel }}>{coffee.price}€</span>
                    <span style={{ fontSize: 11, color: C.textMuted }}>/ 250g</span>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
