"use client"

import React, { useState } from "react"
import { Check, Star, Zap, Calendar, ArrowRight, User, Mail, Shield } from "lucide-react"
import { C, PLANS_FR, SectionReveal, FONT } from "../shared"

export default function PricingPage() {
  const [billing, setBilling] = useState<"mensuel" | "annuel">("mensuel")
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    visiteDate: "",
    visiteTime: "10:00",
    objet: "visite",
  })

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.nom && formData.email) {
      setFormSubmitted(true)
    }
  }

  const plans = [
    {
      name: "Day Pass",
      price: billing === "mensuel" ? "25" : "21",
      period: "jour",
      features: ["Open Space (hot desk)", "Café inclus", "WiFi 1 Gbps", "Accès 9h–19h", "Espace lounge"],
      cta: "Essayer",
      highlight: false,
      note: null,
    },
    {
      name: "Hot Desk",
      price: billing === "mensuel" ? "180" : "153",
      period: "mois",
      features: [
        "5 jours/semaine",
        "Casier dédié",
        "Adresse postale",
        "Café illimité",
        "4h réunion/mois",
        "Événements communauté",
      ],
      cta: "Commencer",
      highlight: true,
      note: "Populaire",
    },
    {
      name: "Bureau Fixe Solo",
      price: billing === "mensuel" ? "350" : "298",
      period: "mois",
      features: [
        "Bureau attitré 24/7",
        "Adresse domiciliation",
        "10h réunion/mois",
        "Café illimité",
        "Impression illimitée",
        "2 accès invités/mois",
      ],
      cta: "Réserver",
      highlight: false,
      note: null,
    },
    {
      name: "Bureau Équipe (2–4p)",
      price: billing === "mensuel" ? "650" : "553",
      period: "mois",
      features: [
        "Bureau privatif fermé",
        "Domiciliation incluse",
        "Réunions illimitées",
        "Support prioritaire",
        "Accès 24/7",
        "Personnalisation espace",
      ],
      cta: "Réserver",
      highlight: false,
      note: null,
    },
  ]

  const meetingRoom = {
    heure: "35",
    demiJournee: "120",
    journee: "200",
  }

  const comparisonFeatures = [
    { feature: "Open Space / hot desk", dayPass: true, hotDesk: true, solo: true, equipe: true },
    { feature: "Café illimité", dayPass: true, hotDesk: true, solo: true, equipe: true },
    { feature: "WiFi 1 Gbps", dayPass: true, hotDesk: true, solo: true, equipe: true },
    { feature: "Casier dédié", dayPass: false, hotDesk: true, solo: true, equipe: true },
    { feature: "Adresse domiciliation", dayPass: false, hotDesk: false, solo: true, equipe: true },
    { feature: "Accès 24/7", dayPass: false, hotDesk: false, solo: true, equipe: true },
    { feature: "Bureau privatif", dayPass: false, hotDesk: false, solo: false, equipe: true },
    { feature: "Réunions illimitées", dayPass: false, hotDesk: false, solo: false, equipe: true },
  ]

  return (
    <div style={{ padding: "60px 5%", background: C.bg, minHeight: "100vh" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Header */}
        <SectionReveal>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: C.accentLight,
                borderRadius: 30,
                padding: "6px 16px",
                marginBottom: 16,
              }}
            >
              <Zap size={14} color={C.accentDark} />
              <span style={{ color: C.accentDark, fontSize: 13, fontWeight: 600 }}>Tarifs transparents</span>
            </div>
            <h1 style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 800, color: C.slate, marginBottom: 16 }}>
              Choisissez votre formule
            </h1>
            <p style={{ fontSize: 17, color: C.textMuted, maxWidth: 500, margin: "0 auto 32px", lineHeight: 1.7 }}>
              Sans frais cachés. Sans engagement annuel obligatoire. Résiliez avec 30 jours de préavis.
            </p>

            {/* Toggle mensuel / annuel */}
            <div
              style={{
                display: "inline-flex",
                background: C.bgAlt,
                borderRadius: 40,
                padding: 4,
                border: `1px solid ${C.border}`,
              }}
            >
              {(["mensuel", "annuel"] as const).map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBilling(b)}
                  style={{
                    padding: "8px 24px",
                    borderRadius: 36,
                    border: "none",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                    background: billing === b ? C.slate : "transparent",
                    color: billing === b ? C.white : C.textMuted,
                    transition: "all 0.2s",
                  }}
                >
                  {b === "mensuel" ? "Mensuel" : "Annuel −15%"}
                </button>
              ))}
            </div>
          </div>
        </SectionReveal>

        {/* Essai gratuit banner */}
        <SectionReveal delay={0.05}>
          <div
            style={{
              background: `linear-gradient(135deg, ${C.accent}, ${C.accentDark})`,
              borderRadius: 16,
              padding: "20px 32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 40,
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Star size={20} color={C.white} fill={C.white} />
              <span style={{ fontWeight: 700, fontSize: 16, color: C.white }}>
                Essai gratuit — 1 journée offerte sur présentation de votre projet
              </span>
            </div>
            <a href="#visite" style={{ textDecoration: "none" }}>
              <button
                type="button"
                style={{
                  background: C.white,
                  color: C.accentDark,
                  padding: "10px 20px",
                  borderRadius: 8,
                  fontWeight: 700,
                  fontSize: 14,
                  border: "none",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                En profiter
              </button>
            </a>
          </div>
        </SectionReveal>

        {/* Plans grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 20,
            marginBottom: 72,
          }}
        >
          {plans.map((plan, i) => (
            <SectionReveal key={plan.name} delay={i * 0.08}>
              <div
                style={{
                  background: plan.highlight ? C.slate : C.white,
                  borderRadius: 20,
                  padding: 32,
                  border: plan.highlight ? `2px solid ${C.accent}` : `1px solid ${C.border}`,
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  overflow: "hidden",
                  height: "100%",
                }}
              >
                {plan.note && (
                  <div
                    style={{
                      position: "absolute",
                      top: 16,
                      right: 16,
                      background: C.accent,
                      color: C.white,
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "4px 12px",
                      borderRadius: 30,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {plan.note}
                  </div>
                )}
                <h3 style={{ fontSize: 17, fontWeight: 700, color: plan.highlight ? C.white : C.slate, marginBottom: 8 }}>
                  {plan.name}
                </h3>
                <div style={{ marginBottom: 24 }}>
                  <span style={{ fontSize: 38, fontWeight: 900, color: plan.highlight ? C.accent : C.slate }}>
                    {plan.price}€
                  </span>
                  <span style={{ fontSize: 13, color: plan.highlight ? "#94a3b8" : C.textMuted, marginLeft: 4 }}>
                    /{plan.period}
                  </span>
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 9, marginBottom: 24 }}>
                  {plan.features.map((f) => (
                    <div key={f} style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      <div
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: "50%",
                          background: plan.highlight ? `${C.accent}30` : C.accentLight,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Check size={10} color={C.accent} />
                      </div>
                      <span style={{ fontSize: 13, color: plan.highlight ? "#cbd5e1" : C.text }}>{f}</span>
                    </div>
                  ))}
                </div>
                <a href="#visite" style={{ textDecoration: "none" }}>
                  <button
                    type="button"
                    style={{
                      width: "100%",
                      textAlign: "center",
                      background: plan.highlight ? C.accent : C.accentLight,
                      color: plan.highlight ? C.white : C.accentDark,
                      padding: "13px 20px",
                      borderRadius: 10,
                      fontWeight: 700,
                      fontSize: 14,
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    {plan.cta}
                  </button>
                </a>
              </div>
            </SectionReveal>
          ))}
        </div>

        {/* Meeting Room Showcase */}
        <SectionReveal delay={0.1}>
          <div style={{ marginBottom: 72 }}>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: C.slate, marginBottom: 24 }}>Salles de Réunion — Tarifs à la carte</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 16 }}>
              {[
                { label: "À l'heure", price: `${meetingRoom.heure}€/h`, desc: "Réservation flexible, disponibilité en temps réel" },
                { label: "Demi-journée", price: `${meetingRoom.demiJournee}€`, desc: "4 heures consécutives, café et thé inclus" },
                { label: "Journée complète", price: `${meetingRoom.journee}€`, desc: "8 heures, déjeuner de notre traiteur partenaire disponible" },
              ].map((r) => (
                <div
                  key={r.label}
                  style={{
                    background: C.white,
                    border: `1px solid ${C.border}`,
                    borderRadius: 16,
                    padding: 28,
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.textMuted, marginBottom: 8 }}>{r.label}</div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: C.slate, marginBottom: 6 }}>{r.price}</div>
                  <div style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.5 }}>{r.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </SectionReveal>

        {/* Detailed Comparison */}
        <SectionReveal delay={0.15}>
          <div style={{ marginBottom: 80 }}>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: C.slate, marginBottom: 24 }}>Comparatif détaillé</h2>
            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 20, overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
                  <thead>
                    <tr style={{ background: C.bgAlt }}>
                      <th style={{ padding: "16px 20px", textAlign: "left", fontSize: 13, fontWeight: 700, color: C.textMuted }}>Fonctionnalité</th>
                      {["Day Pass", "Hot Desk", "Solo", "Équipe"].map((h) => (
                        <th key={h} style={{ padding: "16px 20px", textAlign: "center", fontSize: 13, fontWeight: 700, color: C.slate }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonFeatures.map((row, i) => (
                      <tr key={row.feature} style={{ borderTop: `1px solid ${C.border}`, background: i % 2 === 0 ? C.white : `${C.bg}80` }}>
                        <td style={{ padding: "14px 20px", fontSize: 14, color: C.text }}>{row.feature}</td>
                        {[row.dayPass, row.hotDesk, row.solo, row.equipe].map((val, j) => (
                          <td key={j} style={{ padding: "14px 20px", textAlign: "center" }}>
                            {val ? (
                              <Check size={16} color={C.accent} style={{ margin: "0 auto" }} />
                            ) : (
                              <span style={{ color: C.border, fontSize: 16 }}>—</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </SectionReveal>

        {/* Interactive Booking / Visit Form */}
        <SectionReveal delay={0.2}>
          <div
            id="visite"
            style={{
              maxWidth: 700,
              margin: "0 auto",
              background: C.white,
              border: `1.5px solid ${C.accent}`,
              borderRadius: 24,
              padding: 40,
              boxShadow: "0 10px 40px rgba(0,0,0,0.05)",
            }}
          >
            {!formSubmitted ? (
              <form onSubmit={handleFormSubmit}>
                <div style={{ textAlign: "center", marginBottom: 32 }}>
                  <div style={{ width: 44, height: 44, background: C.accentLight, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                    <Calendar size={20} color={C.accent} />
                  </div>
                  <h2 style={{ fontSize: 24, fontWeight: 800, color: C.slate, margin: 0 }}>
                    Planifier une visite / Demande d'essai
                  </h2>
                  <p style={{ fontSize: 14, color: C.textMuted, marginTop: 6 }}>
                    Venez tester nos espaces gratuitement pendant une journée.
                  </p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 700, color: C.slate, display: "block", marginBottom: 6 }}>Nom complet</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Sophie Marchand"
                        value={formData.nom}
                        onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                        style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: `1px solid ${C.border}`, fontSize: 14, outline: "none", boxSizing: "border-box" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 700, color: C.slate, display: "block", marginBottom: 6 }}>Email professionnel</label>
                      <input
                        type="email"
                        required
                        placeholder="nom@exemple.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: `1px solid ${C.border}`, fontSize: 14, outline: "none", boxSizing: "border-box" }}
                      />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 700, color: C.slate, display: "block", marginBottom: 6 }}>Date souhaitée</label>
                      <input
                        type="date"
                        required
                        value={formData.visiteDate}
                        onChange={(e) => setFormData({ ...formData, visiteDate: e.target.value })}
                        style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: `1px solid ${C.border}`, fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: FONT }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 700, color: C.slate, display: "block", marginBottom: 6 }}>Heure de visite</label>
                      <select
                        value={formData.visiteTime}
                        onChange={(e) => setFormData({ ...formData, visiteTime: e.target.value })}
                        style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: `1px solid ${C.border}`, fontSize: 14, outline: "none", boxSizing: "border-box", background: C.white }}
                      >
                        <option value="09:00">09:00</option>
                        <option value="10:00">10:00 (Recommandé)</option>
                        <option value="11:30">11:30</option>
                        <option value="14:00">14:00</option>
                        <option value="16:00">16:00</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: 13, fontWeight: 700, color: C.slate, display: "block", marginBottom: 6 }}>Votre objectif principal</label>
                    <select
                      value={formData.objet}
                      onChange={(e) => setFormData({ ...formData, objet: e.target.value })}
                      style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: `1px solid ${C.border}`, fontSize: 14, outline: "none", boxSizing: "border-box", background: C.white }}
                    >
                      <option value="visite">Réserver une visite découverte (30 min)</option>
                      <option value="essai">Demander une journée d'essai gratuite</option>
                      <option value="tarif">Demander un devis personnalisé (Bureaux d'équipe)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    style={{
                      background: C.accent,
                      color: C.white,
                      padding: "16px",
                      borderRadius: 12,
                      fontWeight: 700,
                      fontSize: 15,
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      marginTop: 8,
                    }}
                  >
                    Confirmer ma demande <ArrowRight size={16} />
                  </button>
                </div>
              </form>
            ) : (
              <div style={{ textAlign: "center", padding: "30px 0" }}>
                <div style={{ width: 64, height: 64, background: C.accentLight, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                  <Check size={28} color={C.accent} />
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: C.slate, marginBottom: 10 }}>Merci</h3>
                <p style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.6, maxWidth: 460, margin: "0 auto 24px" }}>
                  Merci, nous vous répondrons sous 24h.
                </p>
                <button
                  type="button"
                  onClick={() => setFormSubmitted(false)}
                  style={{ background: "none", border: "none", color: C.accent, fontWeight: 600, fontSize: 14, cursor: "pointer", textDecoration: "underline" }}
                >
                  Faire une autre demande
                </button>
              </div>
            )}
          </div>
        </SectionReveal>
      </div>
    </div>
  )
}
