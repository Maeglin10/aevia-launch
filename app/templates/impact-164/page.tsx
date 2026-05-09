"use client"

import React, { useState, useRef } from "react"
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion"

// BUREAU — Creative agency, brutalist bold. Asymmetric layout, monospace + black, diagonal marquee, no rounded cards.

const SERVICES = [
  { num: "01", name: "Branding & Identité", desc: "Logo, charte graphique, guidelines — une marque qui laisse une empreinte permanente.", tags: ["Logo", "Charte", "Guidelines"] },
  { num: "02", name: "Web Design & Dev", desc: "Sites web sur-mesure en Next.js. Performance, accessibilité, animations premium.", tags: ["Next.js", "Animations", "CMS"] },
  { num: "03", name: "Campagnes Digitales", desc: "Strategy + création + achat média. ROI mesurable, créatif audacieux.", tags: ["Social", "Ads", "Email"] },
  { num: "04", name: "Contenu & Direction Art", desc: "Shoots photo/vidéo, motion design, direction artistique de A à Z.", tags: ["Photo", "Vidéo", "Motion"] },
  { num: "05", name: "UX & Product Design", desc: "Research, wireframes, prototypes. Des produits que les gens adorent utiliser.", tags: ["UX", "Figma", "Tests"] },
  { num: "06", name: "Consulting Stratégique", desc: "Repositionnement, naming, go-to-market. On pense avant d'exécuter.", tags: ["Strategy", "Naming", "GTM"] },
]

const CASES = [
  { name: "Maison Leroux", tag: "Branding / E-Commerce", year: "2025", color: "#ff3d00" },
  { name: "Volta Energy", tag: "Web / Campagne", year: "2025", color: "#7c3aed" },
  { name: "Nude Beauté", tag: "Direction Art / Social", year: "2024", color: "#f59e0b" },
  { name: "Atelier Moreau", tag: "Identité / Print", year: "2024", color: "#10b981" },
  { name: "DataFlux SaaS", tag: "Product Design / UX", year: "2024", color: "#3b82f6" },
]

const TESTIMONIALS = [
  { quote: "Bureau a transformé notre positionnement en 6 semaines. On est passés de «une agence parmi d'autres» à «la référence» dans notre secteur.", name: "Camille Renard", role: "Fondatrice, Maison Leroux" },
  { quote: "Le site qu'ils ont livré convertit à 4.8%. Notre ancienne agence n'avait jamais dépassé 1.2%. Les chiffres parlent d'eux-mêmes.", name: "Théo Marchand", role: "CMO, Volta Energy" },
  { quote: "Créatifs, rigoureux, et ils disent non quand c'est nécessaire. C'est rare et précieux.", name: "Léa Fontaine", role: "CEO, Nude Beauté" },
]

const PLANS = [
  { name: "Lancement", price: "8 900 €", note: "tarif fixe", features: ["Branding complet (logo + charte)", "Site vitrine 5 pages", "Kit réseaux sociaux", "Stratégie contenu 3 mois", "1 session consulting"] },
  { name: "Croissance", price: "2 400 €", note: "/mois — engagement 6 mois", features: ["Tout Lancement inclus", "Gestion social media", "Campagnes ads (budget inclus)", "Reporting mensuel détaillé", "Direction artistique continue"], highlight: true },
  { name: "Partenariat", price: "Sur devis", note: "pour grandes marques", features: ["Équipe dédiée full-time", "C-level access", "Retainer flexible", "PR & influence", "Accès réseau partenaires"] },
]

const FAQS = [
  { q: "Travaillez-vous avec des startups ?", a: "Oui — à condition que la fondation soit solide. On préfère les projets ambitieux aux budgets illimités." },
  { q: "Quels délais pour un projet de branding ?", a: "Entre 4 et 8 semaines pour un branding complet. On ne précipite pas ce qui doit durer 10 ans." },
  { q: "Proposez-vous des paiements échelonnés ?", a: "Oui. 40% à la commande, 30% à mi-parcours, 30% à la livraison finale." },
  { q: "Vous occupez-vous du suivi post-lancement ?", a: "Toujours. Un projet livré sans support, c'est une voiture sans révision. On reste à bord." },
  { q: "Peut-on voir votre processus en détail ?", a: "Oui — réservez un call de 30 min et on vous présente notre playbook complet." },
]

const MARQUEE_TEXT = "BRANDING — WEB — CAMPAGNES — DIRECTION ART — UX — CONSULTING — "

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeService, setActiveService] = useState<number | null>(null)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [activeCase, setActiveCase] = useState(0)
  const { scrollY } = useScroll()

  // Marquee scroll effect — accelerates with scroll
  const marqueeX = useTransform(scrollY, [0, 2000], ["0%", "-30%"])

  const heroRef = useRef(null)
  const statsRef = useRef(null)
  const casesRef = useRef(null)
  const pricingRef = useRef(null)

  const heroInView = useInView(heroRef, { once: true, margin: "-100px" })
  const statsInView = useInView(statsRef, { once: true, margin: "-100px" })
  const casesInView = useInView(casesRef, { once: true, margin: "-100px" })
  const pricingInView = useInView(pricingRef, { once: true, margin: "-100px" })

  const STATS = [
    { val: "127", label: "Projets livrés" },
    { val: "94%", label: "Clients récurrents" },
    { val: "12×", label: "ROI moyen campagnes" },
    { val: "2019", label: "Fondé en" },
  ]

  const C = {
    bg: "#0a0a0a",
    white: "#f5f5f0",
    accent: "#ff3d00",
    mono: "'JetBrains Mono', 'Courier New', monospace",
    sans: "system-ui, -apple-system, sans-serif",
  }

  return (
    <div style={{ background: C.bg, color: C.white, fontFamily: C.sans, overflowX: "hidden" }}>
      {/* NAV — full-width stark black bar */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        borderBottom: `2px solid ${C.white}`,
        background: C.bg,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 40px", height: 60,
      }}>
        <span style={{ fontFamily: C.mono, fontSize: 13, letterSpacing: 4, textTransform: "uppercase" }}>BUREAU</span>
        <div style={{ display: "flex", gap: 40, alignItems: "center" }}>
          {["Services", "Cas", "Prix", "Contact"].map(l => (
            <motion.a key={l} href={`#${l.toLowerCase()}`} whileHover={{ color: C.accent }}
              style={{ fontFamily: C.mono, fontSize: 11, letterSpacing: 3, textTransform: "uppercase", textDecoration: "none", color: C.white, transition: "color 0.15s", cursor: "pointer" }}>
              {l}
            </motion.a>
          ))}
          <motion.button whileHover={{ background: C.white, color: C.bg }} whileTap={{ scale: 0.97 }}
            style={{ fontFamily: C.mono, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", border: `1.5px solid ${C.white}`, background: "transparent", color: C.white, padding: "8px 20px", cursor: "pointer", transition: "all 0.15s" }}>
            Call →
          </motion.button>
        </div>
      </nav>

      {/* HERO — full-viewport, split asymmetric */}
      <section ref={heroRef} style={{ minHeight: "100vh", paddingTop: 60, display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: `2px solid ${C.white}` }}>
        {/* Left — oversized number + label */}
        <div style={{ borderRight: `2px solid ${C.white}`, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "80px 60px" }}>
          <motion.div initial={{ opacity: 0, y: 40 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }}>
            <div style={{ fontFamily: C.mono, fontSize: 11, letterSpacing: 4, color: C.accent, marginBottom: 32, textTransform: "uppercase" }}>
              Agence Créative — Paris
            </div>
            <div style={{ fontSize: "clamp(64px, 9vw, 130px)", fontWeight: 900, lineHeight: 0.9, letterSpacing: "-2px", marginBottom: 48 }}>
              ON FAIT<br />
              <span style={{ color: C.accent, WebkitTextStroke: "0px", display: "inline-block" }}>DES</span><br />
              CHOSES<br />
              QUI<br />
              MARCHENT
            </div>
            <div style={{ fontFamily: C.mono, fontSize: 13, color: "#999", lineHeight: 1.7, maxWidth: 360 }}>
              Branding, web, campagnes. On ne fait pas joli — on fait efficace. Depuis 2019.
            </div>
          </motion.div>
        </div>
        {/* Right — rotating accent block + CTA */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "80px 60px" }}>
          <motion.div initial={{ opacity: 0 }} animate={heroInView ? { opacity: 1 } : {}} transition={{ delay: 0.4, duration: 0.7 }}>
            <motion.div
              animate={{ rotate: [0, 3, -3, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              style={{
                width: 220, height: 220,
                background: C.accent,
                display: "flex", alignItems: "center", justifyContent: "center",
                marginLeft: "auto",
              }}>
              <span style={{ fontWeight: 900, fontSize: 64, color: C.white }}>→</span>
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.6, duration: 0.7 }}>
            <div style={{ fontFamily: C.mono, fontSize: 11, letterSpacing: 3, color: "#666", marginBottom: 16, textTransform: "uppercase" }}>→ 5 slots disponibles Q3 2025</div>
            <motion.button whileHover={{ background: C.accent, borderColor: C.accent }} whileTap={{ scale: 0.97 }}
              style={{ width: "100%", padding: "24px 40px", background: C.white, color: C.bg, border: `2px solid ${C.white}`, fontWeight: 900, fontSize: 16, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer", transition: "all 0.2s", fontFamily: C.sans }}>
              Réserver un call de 30 min
            </motion.button>
            <div style={{ marginTop: 16, fontFamily: C.mono, fontSize: 11, color: "#555", letterSpacing: 2 }}>SANS ENGAGEMENT — SANS BULLSHIT</div>
          </motion.div>
        </div>
      </section>

      {/* MARQUEE — scroll-driven horizontal text */}
      <div style={{ overflow: "hidden", borderBottom: `2px solid ${C.white}`, background: C.accent, padding: "18px 0" }}>
        <motion.div style={{ x: marqueeX, display: "flex", whiteSpace: "nowrap" }}>
          {[...Array(4)].map((_, i) => (
            <span key={i} style={{ fontFamily: C.mono, fontSize: 13, letterSpacing: 4, textTransform: "uppercase", color: C.white, marginRight: 80 }}>
              {MARQUEE_TEXT}
            </span>
          ))}
        </motion.div>
      </div>

      {/* STATS */}
      <section ref={statsRef} id="stats" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", borderBottom: `2px solid ${C.white}` }}>
        {STATS.map((s, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 20 }} animate={statsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            style={{ padding: "48px 40px", borderRight: i < 3 ? `2px solid ${C.white}` : undefined }}>
            <div style={{ fontSize: "clamp(40px, 5vw, 72px)", fontWeight: 900, lineHeight: 1, letterSpacing: "-1px" }}>{s.val}</div>
            <div style={{ fontFamily: C.mono, fontSize: 11, letterSpacing: 3, color: "#777", marginTop: 12, textTransform: "uppercase" }}>{s.label}</div>
          </motion.div>
        ))}
      </section>

      {/* SERVICES — numbered list, expand on hover */}
      <section id="services" style={{ borderBottom: `2px solid ${C.white}` }}>
        <div style={{ padding: "80px 60px 40px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ fontSize: "clamp(40px, 6vw, 80px)", fontWeight: 900, letterSpacing: "-1px", lineHeight: 1 }}>
            SERVICES
          </div>
          <div style={{ fontFamily: C.mono, fontSize: 11, letterSpacing: 3, color: "#666", textTransform: "uppercase" }}>06 DISCIPLINES</div>
        </div>
        {SERVICES.map((s, i) => (
          <motion.div key={i}
            onHoverStart={() => setActiveService(i)}
            onHoverEnd={() => setActiveService(null)}
            style={{
              borderTop: `1.5px solid ${activeService === i ? C.accent : "#222"}`,
              borderBottom: i === SERVICES.length - 1 ? `1.5px solid #222` : undefined,
              padding: "0 60px",
              cursor: "pointer",
              transition: "border-color 0.2s",
              overflow: "hidden",
            }}>
            <div style={{ display: "flex", alignItems: "center", gap: 40, padding: "28px 0" }}>
              <span style={{ fontFamily: C.mono, fontSize: 11, color: C.accent, minWidth: 24 }}>{s.num}</span>
              <span style={{ fontSize: "clamp(18px, 2.5vw, 28px)", fontWeight: 700, flex: 1, letterSpacing: "-0.5px" }}>{s.name}</span>
              <div style={{ display: "flex", gap: 8 }}>
                {s.tags.map(t => (
                  <span key={t} style={{ fontFamily: C.mono, fontSize: 10, letterSpacing: 2, padding: "4px 10px", border: "1px solid #444", color: "#888", textTransform: "uppercase" }}>{t}</span>
                ))}
              </div>
              <motion.span animate={{ rotate: activeService === i ? 45 : 0 }} transition={{ duration: 0.2 }}
                style={{ fontSize: 24, fontWeight: 300, minWidth: 24, textAlign: "right" }}>+</motion.span>
            </div>
            <AnimatePresence>
              {activeService === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                  <div style={{ paddingBottom: 28, paddingLeft: 64, fontFamily: C.mono, fontSize: 13, color: "#aaa", lineHeight: 1.8, maxWidth: 600 }}>
                    {s.desc}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </section>

      {/* CASE STUDIES */}
      <section ref={casesRef} id="cas" style={{ borderBottom: `2px solid ${C.white}` }}>
        <div style={{ padding: "80px 60px 0" }}>
          <div style={{ fontFamily: C.mono, fontSize: 11, letterSpacing: 4, color: C.accent, marginBottom: 20, textTransform: "uppercase" }}>→ Cas d'usage</div>
          <div style={{ fontSize: "clamp(40px, 6vw, 80px)", fontWeight: 900, letterSpacing: "-1px", marginBottom: 60 }}>NOS TRAVAUX</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "320px 1fr" }}>
          {/* Left list */}
          <div style={{ borderRight: `2px solid ${C.white}` }}>
            {CASES.map((c, i) => (
              <motion.div key={i}
                onClick={() => setActiveCase(i)}
                initial={{ opacity: 0, x: -20 }} animate={casesInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: i * 0.08 }}
                style={{
                  padding: "24px 40px",
                  borderBottom: `1.5px solid ${i < CASES.length - 1 ? "#1a1a1a" : "transparent"}`,
                  cursor: "pointer",
                  background: activeCase === i ? "#111" : "transparent",
                  borderLeft: activeCase === i ? `4px solid ${c.color}` : "4px solid transparent",
                  transition: "all 0.15s",
                }}>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{c.name}</div>
                <div style={{ fontFamily: C.mono, fontSize: 11, color: "#666", letterSpacing: 2, textTransform: "uppercase" }}>{c.tag}</div>
              </motion.div>
            ))}
          </div>
          {/* Right detail */}
          <AnimatePresence mode="wait">
            <motion.div key={activeCase}
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              style={{ padding: "60px 80px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ width: 80, height: 4, background: CASES[activeCase].color, marginBottom: 40 }} />
              <div style={{ fontFamily: C.mono, fontSize: 11, letterSpacing: 4, color: "#777", marginBottom: 16, textTransform: "uppercase" }}>{CASES[activeCase].year} — {CASES[activeCase].tag}</div>
              <div style={{ fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 900, letterSpacing: "-1px", lineHeight: 1.1, marginBottom: 32 }}>{CASES[activeCase].name}</div>
              <div style={{ fontFamily: C.mono, fontSize: 13, color: "#777", lineHeight: 1.8, maxWidth: 500, marginBottom: 48 }}>
                Un projet complet — de la stratégie à l'exécution. Résultats mesurables, identité mémorable, impact durable.
              </div>
              <motion.button whileHover={{ background: CASES[activeCase].color, borderColor: CASES[activeCase].color }} whileTap={{ scale: 0.97 }}
                style={{ alignSelf: "flex-start", padding: "16px 32px", background: "transparent", color: C.white, border: `2px solid ${C.white}`, fontFamily: C.mono, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", transition: "all 0.2s" }}>
                Voir le cas →
              </motion.button>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ borderBottom: `2px solid ${C.white}`, padding: "80px 60px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0 }}>
          {TESTIMONIALS.map((t, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.15, duration: 0.6 }}
              style={{ padding: "0 48px", borderRight: i < 2 ? `2px solid #1a1a1a` : undefined }}>
              <div style={{ fontSize: 48, color: C.accent, fontWeight: 900, lineHeight: 1, marginBottom: 24 }}>"</div>
              <div style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 32, color: "#ccc" }}>{t.quote}</div>
              <div style={{ fontFamily: C.mono, fontSize: 11, letterSpacing: 2, color: "#555", textTransform: "uppercase" }}>
                — {t.name}, {t.role}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PRICING — bold grid, no rounded corners */}
      <section ref={pricingRef} id="prix" style={{ borderBottom: `2px solid ${C.white}` }}>
        <div style={{ padding: "80px 60px 60px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ fontSize: "clamp(40px, 6vw, 80px)", fontWeight: 900, letterSpacing: "-1px" }}>PRICING</div>
          <div style={{ fontFamily: C.mono, fontSize: 11, letterSpacing: 3, color: "#666", textTransform: "uppercase" }}>Transparent. Fixe. Aucune surprise.</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", borderTop: `2px solid ${C.white}` }}>
          {PLANS.map((p, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 40 }} animate={pricingInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              style={{
                borderRight: i < 2 ? `2px solid ${C.white}` : undefined,
                background: p.highlight ? C.accent : "transparent",
                padding: "60px 48px",
              }}>
              <div style={{ fontFamily: C.mono, fontSize: 11, letterSpacing: 4, color: p.highlight ? C.white : "#777", marginBottom: 24, textTransform: "uppercase" }}>{p.name}</div>
              <div style={{ fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 900, letterSpacing: "-1px", lineHeight: 1, marginBottom: 8 }}>{p.price}</div>
              <div style={{ fontFamily: C.mono, fontSize: 11, color: p.highlight ? "rgba(255,255,255,0.7)" : "#555", marginBottom: 48 }}>{p.note}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 48 }}>
                {p.features.map((f, j) => (
                  <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 12, fontFamily: C.mono, fontSize: 12, color: p.highlight ? C.white : "#aaa", lineHeight: 1.5 }}>
                    <span style={{ color: p.highlight ? C.white : C.accent, fontWeight: 700, marginTop: 1 }}>→</span>
                    {f}
                  </div>
                ))}
              </div>
              <motion.button whileHover={{ opacity: 0.85 }} whileTap={{ scale: 0.97 }}
                style={{ width: "100%", padding: "18px", background: p.highlight ? C.white : C.white, color: p.highlight ? C.accent : C.bg, border: "none", fontWeight: 900, fontSize: 14, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer", fontFamily: C.sans }}>
                {p.name === "Partenariat" ? "Nous écrire" : "Démarrer"}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ borderBottom: `2px solid ${C.white}` }}>
        <div style={{ padding: "80px 60px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48 }}>
          <div style={{ fontSize: "clamp(40px, 6vw, 80px)", fontWeight: 900, letterSpacing: "-1px" }}>FAQ</div>
          <div style={{ fontFamily: C.mono, fontSize: 11, letterSpacing: 3, color: "#666", textTransform: "uppercase" }}>{FAQS.length} QUESTIONS</div>
        </div>
        {FAQS.map((f, i) => (
          <div key={i} style={{ borderTop: `1.5px solid #1a1a1a`, borderBottom: i === FAQS.length - 1 ? `1.5px solid #1a1a1a` : undefined }}>
            <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
              style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "28px 60px", background: "none", border: "none", color: C.white, cursor: "pointer", textAlign: "left" }}>
              <span style={{ fontSize: 16, fontWeight: 600, flex: 1 }}>{f.q}</span>
              <motion.span animate={{ rotate: openFaq === i ? 45 : 0 }} transition={{ duration: 0.2 }}
                style={{ fontSize: 24, color: C.accent, fontWeight: 300, minWidth: 24 }}>+</motion.span>
            </button>
            <AnimatePresence>
              {openFaq === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                  <div style={{ padding: "0 60px 28px", fontFamily: C.mono, fontSize: 13, color: "#aaa", lineHeight: 1.8, maxWidth: 700 }}>{f.a}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </section>

      {/* CTA BANNER */}
      <section id="contact" style={{ borderBottom: `2px solid ${C.white}`, display: "grid", gridTemplateColumns: "1fr 1fr" }}>
        <div style={{ borderRight: `2px solid ${C.white}`, padding: "80px 60px" }}>
          <div style={{ fontFamily: C.mono, fontSize: 11, letterSpacing: 4, color: C.accent, marginBottom: 24, textTransform: "uppercase" }}>→ On prend 5 nouveaux clients par trimestre</div>
          <div style={{ fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 900, letterSpacing: "-1px", lineHeight: 1.1, marginBottom: 40 }}>
            Votre prochain<br />projet mérite<br />mieux.
          </div>
          <div style={{ fontFamily: C.mono, fontSize: 13, color: "#777", lineHeight: 1.8 }}>
            Pas de pitch. Pas de slides génériques.<br />
            Un call honnête sur votre situation.
          </div>
        </div>
        <div style={{ padding: "80px 60px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 20 }}>
          <input placeholder="Votre email"
            style={{ width: "100%", padding: "18px 24px", background: "transparent", border: `1.5px solid #333`, color: C.white, fontFamily: C.mono, fontSize: 13, letterSpacing: 1, outline: "none", boxSizing: "border-box" }} />
          <input placeholder="Votre budget approximatif"
            style={{ width: "100%", padding: "18px 24px", background: "transparent", border: `1.5px solid #333`, color: C.white, fontFamily: C.mono, fontSize: 13, letterSpacing: 1, outline: "none", boxSizing: "border-box" }} />
          <textarea placeholder="Dites-nous en plus..." rows={4}
            style={{ width: "100%", padding: "18px 24px", background: "transparent", border: `1.5px solid #333`, color: C.white, fontFamily: C.mono, fontSize: 13, letterSpacing: 1, outline: "none", resize: "none", boxSizing: "border-box" }} />
          <motion.button whileHover={{ background: C.accent, borderColor: C.accent }} whileTap={{ scale: 0.97 }}
            style={{ padding: "20px", background: C.white, color: C.bg, border: `2px solid ${C.white}`, fontWeight: 900, fontSize: 15, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer", transition: "all 0.2s", fontFamily: C.sans }}>
            Envoyer →
          </motion.button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", borderBottom: `2px solid #1a1a1a` }}>
        <div style={{ padding: "48px 40px", borderRight: `2px solid #1a1a1a` }}>
          <div style={{ fontFamily: C.mono, fontSize: 13, letterSpacing: 4, fontWeight: 700, textTransform: "uppercase", marginBottom: 12 }}>BUREAU</div>
          <div style={{ fontFamily: C.mono, fontSize: 11, color: "#555", lineHeight: 1.8 }}>Agence créative indépendante. Paris, France.</div>
        </div>
        {[
          { title: "Services", links: ["Branding", "Web & Dev", "Campagnes", "Direction Art"] },
          { title: "Agence", links: ["À propos", "Travaux", "Blog", "Carrières"] },
          { title: "Contact", links: ["hello@bureau.co", "+33 1 23 45 67 89", "Paris 75011", "Camera"] },
        ].map((col, i) => (
          <div key={i} style={{ padding: "48px 40px", borderRight: i < 2 ? `2px solid #1a1a1a` : undefined }}>
            <div style={{ fontFamily: C.mono, fontSize: 10, letterSpacing: 4, color: C.accent, marginBottom: 20, textTransform: "uppercase" }}>{col.title}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {col.links.map(l => (
                <span key={l} style={{ fontFamily: C.mono, fontSize: 11, color: "#555", letterSpacing: 1 }}>{l}</span>
              ))}
            </div>
          </div>
        ))}
      </footer>
      <div style={{ padding: "20px 40px", display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontFamily: C.mono, fontSize: 10, color: "#444", letterSpacing: 2, textTransform: "uppercase" }}>© 2025 Bureau — Tous droits réservés</span>
        <span style={{ fontFamily: C.mono, fontSize: 10, color: "#444", letterSpacing: 2, textTransform: "uppercase" }}>Mentions légales · Confidentialité</span>
      </div>
    </div>
  )
}
