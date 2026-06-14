"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import Link from "next/link";
import { PRICING, FAQ, C, mono, sans } from "../shared";

export default function TarifsPage() {
  const [hoveredPlan, setHoveredPlan] = useState<number | null>(null);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  return (
    <div style={{ background: C.bg, color: C.text, minHeight: "100vh", padding: "6rem 2.5rem" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: "5rem" }}
        >
          <span style={{ fontFamily: mono, fontSize: "0.7rem", color: C.green, letterSpacing: "0.15em", display: "block", marginBottom: "1rem" }}>// GRILLE TARIFAIRE</span>
          <h1 style={{ fontFamily: mono, fontSize: "clamp(32px, 5vw, 64px)", fontWeight: 700, lineHeight: 1.15, paddingBottom: "0.15em", color: C.text, marginBottom: "2rem" }}>
            Investissez dans votre <span style={{ color: C.green }}>Tranquillité.</span>
          </h1>
          <p style={{ fontFamily: sans, fontSize: "1.1rem", color: C.textMuted, maxWidth: "600px", margin: "0 auto", lineHeight: 1.7 }}>
            Des offres adaptées à la taille de votre organisation, de la PME au Grand Compte OIV.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", marginBottom: "8rem" }}>
          {PRICING.map((plan, i) => {
            const hovered = hoveredPlan === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                onMouseEnter={() => setHoveredPlan(i)}
                onMouseLeave={() => setHoveredPlan(null)}
                style={{
                  background: plan.highlight ? "rgba(0,230,118,0.05)" : C.bgCard,
                  border: `1px solid ${plan.highlight ? C.green : C.greenBorder}`,
                  padding: "3rem 2.5rem",
                  borderRadius: "8px",
                  position: "relative",
                  cursor: "default",
                  transition: "background 0.3s",
                }}
              >
                {plan.highlight && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", background: `linear-gradient(90deg, transparent, ${C.green}, transparent)`, borderRadius: "8px 8px 0 0" }} />}
                {plan.tag && (
                  <div style={{ position: "absolute", top: "1.5rem", right: "1.5rem" }}>
                    <span style={{ fontFamily: mono, fontSize: "0.6rem", color: C.green, background: "rgba(0,230,118,0.1)", border: `1px solid ${C.greenBorder}`, borderRadius: "3px", padding: "0.2rem 0.5rem", letterSpacing: "0.1em" }}>
                      {plan.tag}
                    </span>
                  </div>
                )}
                <div style={{ fontFamily: mono, fontSize: "0.65rem", color: C.textMuted, letterSpacing: "0.12em", marginBottom: "0.5rem" }}>{plan.name.toUpperCase()}</div>
                <div style={{ marginBottom: "0.75rem" }}>
                  <span style={{ fontFamily: mono, fontSize: "clamp(28px, 3vw, 40px)", fontWeight: 700, color: plan.highlight ? C.green : C.text }}>
                    {plan.price === "Sur devis" ? plan.price : `${plan.price} €`}
                  </span>
                  {plan.period && <span style={{ fontFamily: mono, fontSize: "0.75rem", color: C.textMuted }}>{plan.period}</span>}
                </div>
                <p style={{ fontFamily: sans, fontSize: "0.82rem", color: C.textMuted, lineHeight: 1.6, marginBottom: "2.5rem" }}>{plan.desc}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "3rem" }}>
                  {plan.features.map(f => (
                    <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem" }}>
                      <Check size={13} color={C.green} style={{ flexShrink: 0, marginTop: "2px" }} />
                      <span style={{ fontFamily: sans, fontSize: "0.82rem", color: C.textMuted }}>{f}</span>
                    </div>
                  ))}
                </div>
                <Link href="/templates/impact-64/contact" style={{
                  display: "block", textAlign: "center",
                  fontFamily: mono, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em",
                  background: plan.highlight ? C.green : "transparent",
                  color: plan.highlight ? C.bg : C.green,
                  border: `1px solid ${plan.highlight ? C.green : C.greenBorder}`,
                  padding: "0.95rem", borderRadius: "4px", textDecoration: "none",
                  transition: "all 0.2s",
                }}>
                  {plan.price === "Sur devis" ? "CONTACTER L'ÉQUIPE" : "COMMENCER"}
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ marginBottom: "3rem", textAlign: "center" }}
          >
            <span style={{ fontFamily: mono, fontSize: "0.7rem", color: C.green, letterSpacing: "0.15em", display: "block", marginBottom: "1rem" }}>// ASSISTANCE & PROCESS</span>
            <h2 style={{ fontFamily: mono, fontSize: "2rem", fontWeight: 700, color: C.text }}>Foire Aux Questions.</h2>
          </motion.div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: C.greenBorder }}>
            {FAQ.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
                style={{ background: C.bgCard, overflow: "hidden" }}
              >
                <button
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  style={{
                    width: "100%", padding: "1.5rem 2rem",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    background: "none", border: "none", cursor: "pointer", textAlign: "left",
                  }}
                >
                  <span style={{ fontFamily: mono, fontSize: "0.85rem", fontWeight: 700, color: faqOpen === i ? C.green : C.text }}>{item.q}</span>
                  <motion.div animate={{ rotate: faqOpen === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown size={16} color={faqOpen === i ? C.green : C.textMuted} />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {faqOpen === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ overflow: "hidden" }}
                    >
                      <div style={{ padding: "0 2rem 1.5rem", paddingTop: "1.25rem", fontFamily: sans, fontSize: "0.875rem", color: C.textMuted, lineHeight: 1.75, borderTop: `1px solid ${C.greenBorder}` }}>
                        {item.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
