"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Calculator, FileText } from "lucide-react";
import { C, FONT } from "../shared";

export default function PricingPage() {
  const [proc, setProc] = useState("Consultation");
  const [mutuelle, setMutuelle] = useState("100");

  const procedures = [
    { name: "Consultation", cost: 23, baseSecu: 23, rateSecu: 0.70, desc: "Bilan bucco-dentaire annuel de contrôle." },
    { name: "Détartrage", cost: 43.38, baseSecu: 43.38, rateSecu: 0.70, desc: "Détartrage professionnel des arcades supérieure et inférieure." },
    { name: "Blanchiment Zoom!", cost: 350, baseSecu: 0, rateSecu: 0, desc: "Blanchiment esthétique au fauteuil (non remboursé par la Sécurité Sociale)." },
    { name: "Facette céramique Emax", cost: 800, baseSecu: 0, rateSecu: 0, desc: "Facette esthétique unitaire en porcelaine (non remboursée par la Sécurité Sociale)." },
    { name: "Implant dentaire complet", cost: 1800, baseSecu: 120, rateSecu: 0.70, desc: "Implant titane Straumann + pilier + couronne céramique." },
  ];

  const current = procedures.find(p => p.name === proc) || procedures[0];

  const secuShare = Math.round(current.baseSecu * current.rateSecu * 100) / 100;
  
  let mutuelleShare = 0;
  if (mutuelle !== "0" && current.baseSecu > 0) {
    const pct = parseFloat(mutuelle) / 100;
    const totalMaxCoverage = current.baseSecu * pct;
    mutuelleShare = Math.min(current.cost - secuShare, totalMaxCoverage - secuShare);
    if (mutuelleShare < 0) mutuelleShare = 0;
  }
  mutuelleShare = Math.round(mutuelleShare * 100) / 100;

  const outOfPocket = Math.round((current.cost - secuShare - mutuelleShare) * 100) / 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ padding: "120px 48px 80px", fontFamily: FONT, background: C.bg }}
    >
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ borderBottom: `2px solid ${C.border}`, paddingBottom: 32, marginBottom: 48 }}>
          <span style={{ color: C.accent, fontWeight: 700, textTransform: "uppercase", fontSize: 13, letterSpacing: 1, display: "block", marginBottom: 8 }}>Transparence Clinique</span>
          <h1 style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 800, color: C.text, letterSpacing: -1.5, lineHeight: 1.1 }}>
            Grille Tarifaire & Devis
          </h1>
          <p style={{ color: C.textMuted, fontSize: 16, marginTop: 12, maxWidth: 620 }}>
            Nous pratiquons des tarifs transparents et établissons un devis avant tout traitement. Le cabinet accepte la carte vitale et applique le tiers-payant sur la part Sécurité Sociale.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 40 }} className="grid grid-cols-1 lg:grid-cols-12">
          {/* Prices Table */}
          <div className="lg:col-span-6">
            <h3 style={{ fontSize: 20, fontWeight: 800, color: C.text, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
              <FileText size={20} color={C.accent} /> Tarifs des Soins Courants
            </h3>

            <div style={{ overflowX: "auto", border: `1px solid ${C.border}`, borderRadius: 16 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, textAlign: "left" }}>
                <thead>
                  <tr style={{ background: C.bgSection, borderBottom: `1px solid ${C.border}` }}>
                    <th style={{ padding: "16px 20px", fontWeight: 700, color: C.text }}>Traitement</th>
                    <th style={{ padding: "16px 20px", fontWeight: 700, color: C.text, textAlign: "right" }}>Honoraires</th>
                    <th style={{ padding: "16px 20px", fontWeight: 700, color: C.text, textAlign: "right" }}>Base Sécu</th>
                  </tr>
                </thead>
                <tbody>
                  {procedures.map((p) => (
                    <tr key={p.name} style={{ borderBottom: `1px solid ${C.border}`, cursor: "pointer", background: proc === p.name ? C.accentLight : "transparent" }} onClick={() => setProc(p.name)}>
                      <td style={{ padding: "16px 20px", fontWeight: 600, color: C.text }}>{p.name}</td>
                      <td style={{ padding: "16px 20px", color: C.text, fontWeight: 700, textAlign: "right" }}>€{p.cost.toFixed(2)}</td>
                      <td style={{ padding: "16px 20px", color: C.textMuted, textAlign: "right" }}>{p.baseSecu > 0 ? `€${p.baseSecu.toFixed(2)}` : "Hors nomenc."}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p style={{ fontSize: 13, color: C.textMuted, marginTop: 16, lineHeight: 1.5 }}>
              * Les soins esthétiques (blanchiment, facettes) ne font pas l'objet d'un remboursement Sécurité Sociale obligatoire. Renseignez-vous auprès de votre mutuelle pour d'éventuels forfaits esthétiques.
            </p>
          </div>

          {/* Interactive Simulator */}
          <div className="lg:col-span-6 bg-slate-50 border border-[#dce9f5] p-8 rounded-2xl">
            <h3 style={{ fontSize: 20, fontWeight: 800, color: C.text, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
              <Calculator size={20} color={C.accent} /> Simulateur de Restes à Charge
            </h3>
            <p style={{ color: C.textMuted, fontSize: 14, marginBottom: 24 }}>
              Simulez la prise en charge de vos soins selon votre couverture mutuelle complémentaire.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Select Procedure */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: C.text, display: "block", marginBottom: 8 }}>Sélectionner le Traitement</label>
                <div style={{ position: "relative" }}>
                  <select 
                    value={proc}
                    onChange={(e) => setProc(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: 10,
                      border: `1px solid ${C.border}`,
                      background: C.white,
                      color: C.text,
                      fontSize: 14,
                      fontWeight: 600,
                      appearance: "none",
                      outline: "none"
                    }}
                  >
                    {procedures.map((p) => (
                      <option key={p.name} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} style={{ position: "absolute", right: 16, top: 15, pointerEvents: "none" }} />
                </div>
                <p style={{ fontSize: 13, color: C.textMuted, marginTop: 6 }}>{current.desc}</p>
              </div>

              {/* Select Mutuelle Rate */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: C.text, display: "block", marginBottom: 8 }}>Taux de Remboursement Mutuelle</label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
                  {[
                    { label: "Pas de mutuelle", value: "0" },
                    { label: "100%", value: "100" },
                    { label: "200%", value: "200" },
                    { label: "300%", value: "300" },
                  ].map((m) => (
                    <button
                      key={m.value}
                      onClick={() => setMutuelle(m.value)}
                      style={{
                        padding: "10px 4px",
                        fontSize: 12,
                        fontWeight: 700,
                        borderRadius: 8,
                        border: mutuelle === m.value ? `2px solid ${C.accent}` : `1px solid ${C.border}`,
                        background: mutuelle === m.value ? C.accentLight : C.white,
                        color: mutuelle === m.value ? C.accent : C.text,
                        cursor: "pointer",
                        fontFamily: FONT
                      }}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Simulation Result */}
              <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 20, marginTop: 10 }} className="space-y-4">
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                  <span style={{ color: C.textMuted }}>Honoraires praticien :</span>
                  <span style={{ fontWeight: 700, color: C.text }}>€{current.cost.toFixed(2)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                  <span style={{ color: C.textMuted }}>Part Sécurité Sociale ({current.rateSecu * 100}%) :</span>
                  <span style={{ fontWeight: 600, color: C.text }}>- €{secuShare.toFixed(2)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                  <span style={{ color: C.textMuted }}>Part Mutuelle complémentaire :</span>
                  <span style={{ fontWeight: 600, color: C.text }}>- €{mutuelleShare.toFixed(2)}</span>
                </div>
                
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, borderTop: `2px solid ${C.border}`, paddingTop: 16, marginTop: 8 }}>
                  <span style={{ fontWeight: 800, color: C.text }}>Reste à charge patient :</span>
                  <span style={{ fontWeight: 900, color: C.accent, fontSize: 22 }}>€{outOfPocket.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
