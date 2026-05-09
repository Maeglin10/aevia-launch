"use client"

import React, { useState, useRef } from "react"
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion"

// METRIC — SaaS analytics platform. Dark navy + cyan accent. Metrics-first hero, live chart preview, data viz showcase.
// Unique: animated counting numbers, dashboard mockup in hero, horizontal scroll feature strip.

const FEATURES = [
  { name: "Tableaux de bord temps réel", desc: "Données actualisées toutes les 5 secondes. Widgets personnalisables par drag & drop. 40+ types de visualisations.", metric: "< 5s latence" },
  { name: "Alertes intelligentes", desc: "Seuils d'alerte configurables avec IA. Notifications Slack, email, webhook. Prévention avant l'incident.", metric: "99.7% précision" },
  { name: "Rapports automatiques", desc: "Envoi hebdomadaire/mensuel en PDF ou HTML. Branded. Destinataires multiples sans compte nécessaire.", metric: "White-label inclus" },
  { name: "Connecteurs natifs", desc: "200+ intégrations : GA4, Stripe, HubSpot, Salesforce, Postgres, BigQuery. SDK REST pour le reste.", metric: "200+ intégrations" },
  { name: "Segmentation avancée", desc: "Cohortes, entonnoirs, rétention, heatmaps. Analyse comportementale sans code.", metric: "No-code" },
  { name: "Accès équipe & rôles", desc: "Espaces de travail, permissions granulaires, SSO SAML. Audit log complet.", metric: "SOC 2 Type II" },
]

const TESTIMONIALS = [
  { quote: "On a remplacé 4 outils par Metric. Moins de réunions de reporting, plus de décisions basées sur des données réelles.", name: "Camille Roux", role: "Head of Growth, Scale-up B2B (110 pers.)" },
  { quote: "Les alertes IA ont détecté un bug de tracking 48h avant qu'on le remarque. Ça nous a évité de perdre 2 semaines de données propres.", name: "Théo Marchand", role: "Analytics Lead, E-commerce 4M€ CA" },
  { quote: "L'intégration Stripe → Metric m'a donné une visibilité MRR/churn en temps réel que j'avais cherché à construire pendant 6 mois.", name: "Sarah K.", role: "Founder & CEO, SaaS Fintech" },
]

const PLANS = [
  { name: "Starter", price: "79 €", note: "/mois · jusqu'à 3 utilisateurs", features: ["10 sources de données", "Dashboards illimités", "Alertes basiques", "7 jours d'historique", "Support email"] },
  { name: "Growth", price: "299 €", note: "/mois · jusqu'à 15 utilisateurs", features: ["Sources illimitées", "Alertes IA", "Rapports automatiques", "90 jours d'historique", "Intégrations premium", "Support prioritaire"], highlight: true },
  { name: "Enterprise", price: "Sur devis", note: "utilisateurs illimités", features: ["Tout Growth inclus", "SLA 99.9%", "SSO SAML", "Data residency EU", "Onboarding dédié", "Account manager"] },
]

const FAQS = [
  { q: "Vos données sont-elles stockées en Europe ?", a: "Oui — infrastructure 100% EU (AWS Paris + Frankfurt). RGPD natif, DPA disponible, certifié ISO 27001." },
  { q: "Proposez-vous une période d'essai ?", a: "14 jours gratuits sur le plan Growth, sans CB. Données effacées à l'issue si non conversion." },
  { q: "Comment fonctionne l'onboarding ?", a: "Wizard de connexion en 15 min pour les intégrations standards. Pour les setups complexes, un ingénieur solutions vous accompagne (inclus en Enterprise)." },
  { q: "Puis-je importer mes données historiques ?", a: "Oui — import CSV, connexion directe BigQuery/Redshift, ou via notre API REST. Rétention configurable jusqu'à 2 ans." },
  { q: "Existe-t-il une API publique ?", a: "Oui — REST API complète documentée sur docs.metric.io. Webhooks, SDK JavaScript et Python disponibles." },
]

const LIVE_METRICS = [
  { label: "Nouveaux utilisateurs", val: "2 847", change: "+12.4%", up: true },
  { label: "MRR", val: "€ 48 290", change: "+8.1%", up: true },
  { label: "Churn rate", val: "1.8%", change: "-0.3%", up: true },
  { label: "NPS Score", val: "67", change: "+4", up: true },
]

export default function Page() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [activeFeature, setActiveFeature] = useState(0)
  const { scrollY } = useScroll()

  const dashY = useTransform(scrollY, [0, 600], [0, 60])

  const featRef = useRef(null)
  const pricingRef = useRef(null)
  const featInView = useInView(featRef, { once: true, margin: "-100px" })
  const pricingInView = useInView(pricingRef, { once: true, margin: "-100px" })

  const C = {
    bg: "#060b18",
    navy: "#0a1628",
    cyan: "#00d4ff",
    cyanDim: "#0088aa",
    text: "#e2eaf5",
    muted: "#4a6080",
    card: "#0d1a2e",
    border: "#132040",
    mono: "'JetBrains Mono', monospace",
    sans: "system-ui, -apple-system, sans-serif",
  }

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: C.sans, overflowX: "hidden" }}>
      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(6,11,24,0.97)", backdropFilter: "blur(16px)", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 60px", height: 60 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, background: `linear-gradient(135deg, ${C.cyan}, #0066aa)`, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          </div>
          <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: -0.5, color: "#fff" }}>Metric</span>
        </div>
        <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
          {["Fonctionnalités", "Intégrations", "Tarifs", "Docs"].map(l => (
            <a key={l} href="#" style={{ fontSize: 13, color: C.muted, textDecoration: "none", fontWeight: 500, transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = C.cyan)}
              onMouseLeave={e => (e.currentTarget.style.color = C.muted)}>
              {l}
            </a>
          ))}
          <motion.button whileHover={{ background: C.cyan, color: C.bg }} whileTap={{ scale: 0.97 }}
            style={{ padding: "8px 22px", background: "transparent", color: C.cyan, border: `1.5px solid ${C.cyan}`, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s", borderRadius: 6, fontFamily: C.sans }}>
            Essai gratuit
          </motion.button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: "100vh", paddingTop: 60, display: "flex", alignItems: "center", padding: "80px 60px", maxWidth: 1280, margin: "0 auto", gap: 80 }}>
        <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} style={{ flex: "0 0 480px" }}>
          <div style={{ display: "inline-flex", gap: 8, alignItems: "center", background: C.cyan + "15", border: `1px solid ${C.cyan}30`, padding: "6px 16px", borderRadius: 50, fontSize: 12, color: C.cyan, marginBottom: 36, fontFamily: C.mono }}>
            <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} style={{ width: 6, height: 6, background: C.cyan, borderRadius: "50%", display: "inline-block" }} />
            Données en temps réel · 99.95% uptime
          </div>
          <h1 style={{ fontSize: "clamp(44px, 5vw, 72px)", fontWeight: 900, letterSpacing: -2.5, lineHeight: 1.05, color: "#fff", marginBottom: 24 }}>
            Vos données.<br />
            <span style={{ color: C.cyan }}>Vos décisions.</span><br />
            Votre avantage.
          </h1>
          <p style={{ fontSize: 18, color: C.muted, lineHeight: 1.75, marginBottom: 48, maxWidth: 420 }}>
            Metric transforme vos données brutes en insights actionnables. Dashboards, alertes et rapports — tout en un.
          </p>
          <div style={{ display: "flex", gap: 16 }}>
            <motion.button whileHover={{ background: "#00b8dd" }} whileTap={{ scale: 0.97 }}
              style={{ padding: "16px 36px", background: C.cyan, color: C.bg, border: "none", borderRadius: 8, fontSize: 16, fontWeight: 700, cursor: "pointer", transition: "background 0.2s", fontFamily: C.sans }}>
              14 jours gratuits
            </motion.button>
            <motion.button whileHover={{ borderColor: C.cyan, color: C.cyan }} whileTap={{ scale: 0.97 }}
              style={{ padding: "16px 36px", background: "transparent", color: C.muted, border: `1.5px solid ${C.border}`, borderRadius: 8, fontSize: 16, cursor: "pointer", transition: "all 0.2s", fontFamily: C.sans }}>
              Voir la démo →
            </motion.button>
          </div>
          <div style={{ display: "flex", gap: 24, marginTop: 40 }}>
            {["SOC 2 Type II", "RGPD", "No credit card"].map(t => (
              <div key={t} style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 12, color: C.muted }}>
                <span style={{ color: C.cyan }}>✓</span> {t}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Dashboard mockup */}
        <motion.div style={{ y: dashY, flex: 1 }} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden", boxShadow: `0 32px 80px rgba(0,212,255,0.08)` }}>
            {/* Topbar */}
            <div style={{ background: C.navy, padding: "12px 20px", display: "flex", alignItems: "center", gap: 8, borderBottom: `1px solid ${C.border}` }}>
              {["#e5534b", "#e3b341", "#3fb950"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
              <div style={{ flex: 1, height: 20, background: C.border, borderRadius: 4, marginLeft: 12, maxWidth: 280 }} />
            </div>
            {/* Metrics row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0, padding: "20px", gap: 12 }}>
              {LIVE_METRICS.map((m, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + i * 0.1 }}
                  style={{ background: C.navy, border: `1px solid ${C.border}`, borderRadius: 8, padding: "16px" }}>
                  <div style={{ fontSize: 10, color: C.muted, fontFamily: C.mono, marginBottom: 8, letterSpacing: 1 }}>{m.label}</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: -0.5, marginBottom: 4 }}>{m.val}</div>
                  <div style={{ fontSize: 11, color: C.cyan, fontFamily: C.mono }}>{m.change}</div>
                </motion.div>
              ))}
            </div>
            {/* Chart area */}
            <div style={{ margin: "0 20px 20px", background: C.navy, border: `1px solid ${C.border}`, borderRadius: 8, padding: "20px", height: 140, position: "relative", overflow: "hidden" }}>
              <div style={{ fontSize: 11, color: C.muted, fontFamily: C.mono, marginBottom: 12 }}>Utilisateurs actifs — 30 derniers jours</div>
              <svg width="100%" height="80" viewBox="0 0 400 80" preserveAspectRatio="none">
                <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.cyan} stopOpacity="0.3"/><stop offset="100%" stopColor={C.cyan} stopOpacity="0"/></linearGradient></defs>
                <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 0.8 }}
                  d="M0,60 C40,50 80,20 120,30 S200,10 240,25 S320,5 400,15" stroke={C.cyan} strokeWidth="2" fill="none"/>
                <path d="M0,60 C40,50 80,20 120,30 S200,10 240,25 S320,5 400,15 L400,80 L0,80Z" fill="url(#g)"/>
              </svg>
            </div>
          </div>
        </motion.div>
      </section>

      {/* STATS BAND */}
      <section style={{ background: C.navy, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", maxWidth: 1280, margin: "0 auto" }}>
          {[{ val: "4 200+", label: "Équipes actives" }, { val: "2B+", label: "Événements trackés/mois" }, { val: "99.95%", label: "Uptime garanti" }, { val: "< 5s", label: "Latence data" }].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              style={{ padding: "48px 40px", borderRight: i < 3 ? `1px solid ${C.border}` : undefined, textAlign: "center" }}>
              <div style={{ fontSize: 44, fontWeight: 900, color: C.cyan, letterSpacing: -1, fontFamily: C.mono }}>{s.val}</div>
              <div style={{ fontSize: 13, color: C.muted, marginTop: 10 }}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section ref={featRef} style={{ padding: "100px 60px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <h2 style={{ fontSize: "clamp(36px, 4vw, 56px)", fontWeight: 900, letterSpacing: -2, color: "#fff" }}>Tout ce dont votre équipe a besoin.</h2>
          <p style={{ fontSize: 18, color: C.muted, marginTop: 16 }}>Analytics, alertes, rapports. Tout en un, sans compromis.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {FEATURES.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={featInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.1 }}
              onClick={() => setActiveFeature(i)}
              whileHover={{ borderColor: C.cyan + "60", background: "#0d1f3a" }}
              style={{ border: `1px solid ${activeFeature === i ? C.cyan + "60" : C.border}`, background: activeFeature === i ? "#0d1f3a" : C.card, padding: "36px 32px", cursor: "pointer", borderRadius: 12, transition: "all 0.2s" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", letterSpacing: -0.3 }}>{f.name}</div>
                <div style={{ fontFamily: C.mono, fontSize: 10, color: C.cyan, letterSpacing: 1, background: C.cyan + "15", padding: "4px 10px", borderRadius: 4, whiteSpace: "nowrap" }}>{f.metric}</div>
              </div>
              <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.75 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ background: C.navy, padding: "100px 60px", borderBottom: `1px solid ${C.border}` }}>
        <h2 style={{ fontSize: "clamp(36px, 4vw, 56px)", fontWeight: 900, letterSpacing: -2, color: "#fff", textAlign: "center", marginBottom: 64 }}>Ils ont choisi Metric.</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32, maxWidth: 1280, margin: "0 auto" }}>
          {TESTIMONIALS.map((t, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
              style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "36px" }}>
              <div style={{ fontSize: 28, color: C.cyan, marginBottom: 16, fontWeight: 900 }}>&ldquo;</div>
              <p style={{ fontSize: 15, color: "rgba(226,234,245,0.7)", lineHeight: 1.75, marginBottom: 24 }}>{t.quote}</p>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{t.name}</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>{t.role}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section ref={pricingRef} style={{ padding: "100px 60px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <h2 style={{ fontSize: "clamp(36px, 4vw, 56px)", fontWeight: 900, letterSpacing: -2, color: "#fff" }}>Tarifs simples et prévisibles.</h2>
          <p style={{ fontSize: 18, color: C.muted, marginTop: 16 }}>14 jours gratuits sur tous les plans. Aucune CB requise.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, maxWidth: 1100, margin: "0 auto" }}>
          {PLANS.map((p, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 36 }} animate={pricingInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.15 }}
              style={{ background: p.highlight ? "#051428" : C.card, border: `1.5px solid ${p.highlight ? C.cyan : C.border}`, borderRadius: 16, padding: "40px 36px", boxShadow: p.highlight ? `0 20px 60px rgba(0,212,255,0.12)` : "none", transform: p.highlight ? "scale(1.03)" : "none" }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: p.highlight ? C.cyan : C.muted, textTransform: "uppercase", marginBottom: 16, fontFamily: C.mono }}>{p.name}</div>
              <div style={{ fontSize: 48, fontWeight: 900, color: "#fff", letterSpacing: -2, lineHeight: 1 }}>{p.price}</div>
              <div style={{ fontSize: 13, color: C.muted, marginBottom: 36, marginTop: 6 }}>{p.note}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 36 }}>
                {p.features.map((f, j) => (
                  <div key={j} style={{ display: "flex", gap: 10, fontSize: 14, color: "#fff", alignItems: "flex-start" }}>
                    <span style={{ color: C.cyan, fontWeight: 700 }}>✓</span> <span style={{ color: p.highlight ? "rgba(226,234,245,0.9)" : C.muted }}>{f}</span>
                  </div>
                ))}
              </div>
              <motion.button whileHover={{ opacity: 0.85 }} whileTap={{ scale: 0.97 }}
                style={{ width: "100%", padding: "14px", background: p.highlight ? C.cyan : "transparent", color: p.highlight ? C.bg : C.cyan, border: p.highlight ? "none" : `1.5px solid ${C.border}`, borderRadius: 8, fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: C.sans }}>
                {p.name === "Enterprise" ? "Nous contacter" : "Commencer gratuitement"}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ maxWidth: 800, margin: "0 auto", padding: "100px 60px" }}>
        <h2 style={{ fontSize: 40, fontWeight: 900, letterSpacing: -1.5, color: "#fff", textAlign: "center", marginBottom: 48 }}>Questions fréquentes</h2>
        {FAQS.map((f, i) => (
          <div key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
            <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
              style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 0", background: "none", border: "none", color: "#fff", cursor: "pointer", textAlign: "left" }}>
              <span style={{ fontSize: 15, fontWeight: 600 }}>{f.q}</span>
              <motion.span animate={{ rotate: openFaq === i ? 45 : 0 }} style={{ fontSize: 22, color: C.cyan, minWidth: 22 }}>+</motion.span>
            </button>
            <AnimatePresence>
              {openFaq === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <p style={{ paddingBottom: 20, fontSize: 14, color: C.muted, lineHeight: 1.8 }}>{f.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section style={{ background: `linear-gradient(135deg, #051428, #0a1f3c)`, borderTop: `1px solid ${C.border}`, padding: "100px 60px", textAlign: "center" }}>
        <h2 style={{ fontSize: "clamp(40px, 5vw, 72px)", fontWeight: 900, letterSpacing: -2.5, color: "#fff", marginBottom: 20 }}>
          Vos données vous attendent.
        </h2>
        <p style={{ fontSize: 18, color: C.muted, marginBottom: 48 }}>14 jours gratuits. Pas de CB. Résultats dès le premier jour.</p>
        <motion.button whileHover={{ background: "#00b8dd" }} whileTap={{ scale: 0.97 }}
          style={{ padding: "20px 56px", background: C.cyan, color: C.bg, border: "none", borderRadius: 10, fontSize: 17, fontWeight: 700, cursor: "pointer", transition: "background 0.2s", fontFamily: C.sans }}>
          Démarrer gratuitement →
        </motion.button>
      </section>

      {/* FOOTER */}
      <footer style={{ background: C.bg, padding: "56px 60px 36px", borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 60, marginBottom: 48 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: C.cyan, marginBottom: 12 }}>Metric</div>
            <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.8 }}>Analytics en temps réel pour les équipes data-driven.</div>
          </div>
          {[{ t: "Produit", ls: ["Fonctionnalités", "Intégrations", "Changelog", "Statut"] },
            { t: "Entreprise", ls: ["À propos", "Blog", "Presse", "Carrières"] },
            { t: "Support", ls: ["Documentation", "API Reference", "Contact", "Security"] }].map((col, i) => (
            <div key={i}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "#2a3a50", textTransform: "uppercase", marginBottom: 16, fontFamily: C.mono }}>{col.t}</div>
              {col.ls.map(l => <div key={l} style={{ fontSize: 13, color: C.muted, marginBottom: 10 }}>{l}</div>)}
            </div>
          ))}
        </div>
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 24, fontSize: 12, color: "#1e2e40", textAlign: "center" }}>
          © 2025 Metric Analytics — Tous droits réservés · RGPD · Mentions légales
        </div>
      </footer>
    </div>
  )
}
