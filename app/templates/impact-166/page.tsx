"use client"

import React, { useState, useRef } from "react"
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion"

// IRIS STUDIO — Photography portfolio. Dark mode, full-bleed cinematic palette, Cinzel serif headers.
// Unique scroll: images fade+rise on scroll, hero text overlays a dark gradient backdrop.

const SERIES = [
  { title: "Lumière Naturelle", count: "24 clichés", year: "2025", accent: "#d4a96a" },
  { title: "Portraits Urbains", count: "18 clichés", year: "2025", accent: "#a78bfa" },
  { title: "Architecture & Vide", count: "31 clichés", year: "2024", accent: "#6ee7b7" },
  { title: "Instants Éphémères", count: "42 clichés", year: "2024", accent: "#f87171" },
  { title: "Paysages Extrêmes", count: "15 clichés", year: "2023", accent: "#38bdf8" },
  { title: "Monochrome Stories", count: "27 clichés", year: "2023", accent: "#e5e7eb" },
]

const TESTIMONIALS = [
  { quote: "Iris a capturé en une fraction de seconde ce qu'on avait mis 5 ans à construire. Notre campagne a fait x4.", name: "Julien Bernard", role: "Directeur Marketing, Maison Farno" },
  { quote: "Chaque photo raconte une histoire complète. On n'avait pas besoin de légende.", name: "Adèle Marceau", role: "Rédactrice en chef, Numéro Magazine" },
  { quote: "Le shooting de mariage dépassait tout ce qu'on avait imaginé. On pleure encore.", name: "Thomas & Chloé Leroux", role: "Mariés, juin 2024" },
]

const SERVICES = [
  { name: "Éditorial & Mode", desc: "Lookbooks, campagnes saison, portraits de collection. Studio ou extérieur.", price: "À partir de 1 400 €" },
  { name: "Portrait Corporate", desc: "Dirigeants, équipes, personal branding. Retouche professionnelle incluse.", price: "À partir de 480 €" },
  { name: "Mariage & Événements", desc: "Un seul jour, une seule chance. Reportage complet + album imprimé.", price: "À partir de 2 200 €" },
  { name: "Architecture & Intérieur", desc: "Immobilier haut de gamme, hôtels, showrooms. HDR + ambiance naturelle.", price: "À partir de 890 €" },
]

const FAQS = [
  { q: "Quelle est votre disponibilité ?", a: "Les créneaux sont ouverts sur 6 mois glissants. Réservez tôt pour les dates en haute saison (mai–octobre)." },
  { q: "Combien de temps pour recevoir les photos ?", a: "7 jours ouvrés pour un portrait, 14 jours pour un événement. Édition premium disponible en 3 jours (+30%)." },
  { q: "Fournissez-vous les fichiers RAW ?", a: "Non — les fichiers livrés sont les retouches finalisées en TIFF haute résolution. Les RAW restent exclusifs à Iris Studio." },
  { q: "Déplacez-vous en dehors de Paris ?", a: "Oui, France entière et international. Frais de déplacement calculés sur devis selon localisation." },
  { q: "Puis-je utiliser les photos pour un usage commercial ?", a: "Un contrat de licence est inclus dans chaque devis selon l'usage prévu (web, presse, affichage, etc.)." },
]

const PLANS = [
  { name: "Découverte", price: "480 €", note: "portrait solo / 2h", features: ["Session 2h studio ou extérieur", "15 photos retouchées TIFF", "Galerie privée en ligne 30 j", "Droits usage personnel"] },
  { name: "Signature", price: "1 400 €", note: "éditorial / demi-journée", features: ["Session 4h multi-looks", "40 photos retouchées TIFF", "Direction artistique incluse", "Droits usage commercial 1 an", "Livraison express 3j possible"], highlight: true },
  { name: "Production", price: "Sur devis", note: "campagnes & grands formats", features: ["Planification complète", "Équipe (assistants, styliste)", "Licence illimitée", "Post-prod avancée", "Accès prioritaire planning"] },
]

export default function Page() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [hoveredSeries, setHoveredSeries] = useState<number | null>(null)
  const { scrollY } = useScroll()

  const heroTextY = useTransform(scrollY, [0, 500], [0, -80])
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0])

  const servicesRef = useRef(null)
  const pricingRef = useRef(null)
  const servicesInView = useInView(servicesRef, { once: true, margin: "-100px" })
  const pricingInView = useInView(pricingRef, { once: true, margin: "-100px" })

  const C = {
    bg: "#080808",
    warm: "#e8e0d4",
    gold: "#c4a96a",
    muted: "#666",
    card: "#111",
    serif: "'Cormorant Garamond', 'Garamond', Georgia, serif",
    sans: "system-ui, -apple-system, sans-serif",
  }

  return (
    <div style={{ background: C.bg, color: C.warm, fontFamily: C.sans, overflowX: "hidden" }}>
      {/* NAV — transparent overlay */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "linear-gradient(to bottom, rgba(8,8,8,0.9), transparent)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "32px 60px",
      }}>
        <div style={{ fontFamily: C.serif, fontSize: 22, letterSpacing: 6, color: C.warm, fontStyle: "italic" }}>Iris Studio</div>
        <div style={{ display: "flex", gap: 40, alignItems: "center" }}>
          {["Séries", "Services", "À propos", "Contact"].map(l => (
            <a key={l} href="#" style={{ fontSize: 12, color: "rgba(232,224,212,0.6)", letterSpacing: 3, textTransform: "uppercase", textDecoration: "none", transition: "color 0.2s" }}>{l}</a>
          ))}
        </div>
      </nav>

      {/* HERO — full-viewport dark with overlaid text */}
      <section style={{ height: "100vh", position: "relative", display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
        {/* Simulated dark backdrop with gradient */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #0d0d0d 0%, #1a1208 50%, #0d0d0d 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 70% 30%, rgba(196,169,106,0.08) 0%, transparent 60%)" }} />

        {/* Animated grain overlay */}
        <motion.div animate={{ opacity: [0.03, 0.06, 0.03] }} transition={{ repeat: Infinity, duration: 3 }}
          style={{ position: "absolute", inset: 0, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")", backgroundSize: "150px" }} />

        <motion.div style={{ y: heroTextY, opacity: heroOpacity, position: "relative", zIndex: 10, padding: "0 60px 80px", maxWidth: 900 }}>
          <motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}>
            <div style={{ fontFamily: C.serif, fontSize: 12, letterSpacing: 6, color: C.gold, marginBottom: 32, textTransform: "uppercase" }}>Photographe — Paris</div>
            <h1 style={{ fontFamily: C.serif, fontSize: "clamp(72px, 11vw, 160px)", fontWeight: 400, letterSpacing: "-2px", lineHeight: 0.9, color: C.warm, marginBottom: 48, fontStyle: "italic" }}>
              La lumière<br />
              <span style={{ color: C.gold }}>ne ment</span><br />
              jamais.
            </h1>
            <div style={{ display: "flex", gap: 40, alignItems: "center" }}>
              <motion.button whileHover={{ borderColor: C.gold, color: C.gold }} whileTap={{ scale: 0.97 }}
                style={{ padding: "16px 40px", background: "transparent", color: C.warm, border: `1px solid rgba(232,224,212,0.4)`, fontSize: 12, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer", transition: "all 0.3s", fontFamily: C.sans }}>
                Voir les séries
              </motion.button>
              <motion.button whileHover={{ background: C.warm, color: C.bg }} whileTap={{ scale: 0.97 }}
                style={{ padding: "16px 40px", background: C.gold, color: C.bg, border: "none", fontSize: 12, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer", fontFamily: C.sans, fontWeight: 700, transition: "all 0.3s" }}>
                Demander un devis
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <div style={{ position: "absolute", bottom: 40, right: 60, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }}
            style={{ width: 1, height: 60, background: `linear-gradient(to bottom, transparent, ${C.gold})` }} />
          <span style={{ fontFamily: C.sans, fontSize: 10, letterSpacing: 4, color: "#555", textTransform: "uppercase", writingMode: "vertical-rl" }}>Défiler</span>
        </div>
      </section>

      {/* SERIES GRID — hover reveals accent color */}
      <section style={{ padding: "100px 60px", borderBottom: `1px solid #1a1a1a` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 60 }}>
          <h2 style={{ fontFamily: C.serif, fontSize: "clamp(36px, 4vw, 56px)", fontWeight: 400, fontStyle: "italic", letterSpacing: -1 }}>Séries photographiques</h2>
          <span style={{ fontSize: 12, color: C.muted, letterSpacing: 3, textTransform: "uppercase" }}>6 collections</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
          {SERIES.map((s, i) => (
            <motion.div key={i}
              onHoverStart={() => setHoveredSeries(i)}
              onHoverEnd={() => setHoveredSeries(null)}
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.7 }}
              style={{ position: "relative", height: 280, background: hoveredSeries === i ? "#111" : "#0d0d0d", cursor: "pointer", overflow: "hidden", transition: "background 0.3s" }}>
              <div style={{ position: "absolute", inset: 0, background: hoveredSeries === i ? `linear-gradient(135deg, ${s.accent}18, transparent)` : "transparent", transition: "background 0.4s" }} />
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 28, borderTop: hoveredSeries === i ? `1px solid ${s.accent}40` : "1px solid transparent", transition: "border-color 0.3s" }}>
                <div style={{ fontSize: 10, letterSpacing: 4, color: hoveredSeries === i ? s.accent : C.muted, textTransform: "uppercase", marginBottom: 8, transition: "color 0.3s" }}>{s.year} — {s.count}</div>
                <div style={{ fontFamily: C.serif, fontSize: 22, fontStyle: "italic", color: C.warm }}>{s.title}</div>
              </div>
              <AnimatePresence>
                {hoveredSeries === i && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    style={{ position: "absolute", top: 28, right: 28, fontSize: 11, letterSpacing: 3, color: s.accent, textTransform: "uppercase" }}>
                    Voir →
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section ref={servicesRef} style={{ padding: "100px 60px", borderBottom: `1px solid #1a1a1a`, maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 100, alignItems: "start" }}>
          <div>
            <h2 style={{ fontFamily: C.serif, fontSize: "clamp(36px, 4vw, 56px)", fontWeight: 400, fontStyle: "italic", letterSpacing: -1, lineHeight: 1.1 }}>Ce que je propose.</h2>
            <div style={{ width: 40, height: 1, background: C.gold, marginTop: 32 }} />
          </div>
          <div>
            {SERVICES.map((s, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: 40 }} animate={servicesInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: i * 0.12, duration: 0.6 }}
                style={{ paddingBottom: 36, marginBottom: 36, borderBottom: i < SERVICES.length - 1 ? "1px solid #1a1a1a" : undefined }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div style={{ fontFamily: C.serif, fontSize: 22, fontStyle: "italic", color: C.warm }}>{s.name}</div>
                  <div style={{ fontFamily: C.sans, fontSize: 13, color: C.gold, fontWeight: 600 }}>{s.price}</div>
                </div>
                <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8 }}>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: "100px 60px", background: "#050505", borderBottom: `1px solid #1a1a1a` }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <h2 style={{ fontFamily: C.serif, fontSize: "clamp(36px, 4vw, 56px)", fontWeight: 400, fontStyle: "italic", textAlign: "center", marginBottom: 64 }}>Ce qu'ils en disent.</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 48 }}>
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
                <div style={{ fontFamily: C.serif, fontSize: 48, color: C.gold, lineHeight: 1, marginBottom: 20, fontStyle: "italic" }}>"</div>
                <p style={{ fontFamily: C.serif, fontSize: 18, fontStyle: "italic", color: "rgba(232,224,212,0.8)", lineHeight: 1.8, marginBottom: 28 }}>{t.quote}</p>
                <div style={{ fontSize: 11, color: C.muted, letterSpacing: 2, textTransform: "uppercase" }}>{t.name} · {t.role}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section ref={pricingRef} style={{ padding: "100px 60px", borderBottom: `1px solid #1a1a1a`, maxWidth: 1280, margin: "0 auto" }}>
        <h2 style={{ fontFamily: C.serif, fontSize: "clamp(36px, 4vw, 56px)", fontWeight: 400, fontStyle: "italic", textAlign: "center", marginBottom: 64 }}>Formules & tarifs.</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
          {PLANS.map((p, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={pricingInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15 }}
              style={{ background: p.highlight ? "#111" : C.card, padding: "56px 48px", border: p.highlight ? `1px solid ${C.gold}40` : "1px solid #1a1a1a", position: "relative" }}>
              {p.highlight && <div style={{ position: "absolute", top: -1, left: 0, right: 0, height: 1, background: C.gold }} />}
              <div style={{ fontSize: 10, letterSpacing: 4, color: p.highlight ? C.gold : C.muted, textTransform: "uppercase", marginBottom: 24 }}>{p.name}</div>
              <div style={{ fontFamily: C.serif, fontSize: 48, fontStyle: "italic", color: C.warm, marginBottom: 4 }}>{p.price}</div>
              <div style={{ fontSize: 12, color: C.muted, marginBottom: 40 }}>{p.note}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 40 }}>
                {p.features.map((f, j) => (
                  <div key={j} style={{ fontSize: 13, color: "rgba(232,224,212,0.65)", display: "flex", gap: 10, alignItems: "flex-start", lineHeight: 1.5 }}>
                    <span style={{ color: C.gold, marginTop: 1 }}>—</span> {f}
                  </div>
                ))}
              </div>
              <motion.button whileHover={{ background: C.gold, color: C.bg, borderColor: C.gold }} whileTap={{ scale: 0.97 }}
                style={{ width: "100%", padding: "14px", background: "transparent", color: C.warm, border: `1px solid ${p.highlight ? C.gold : "#333"}`, fontSize: 11, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer", transition: "all 0.25s", fontFamily: C.sans }}>
                Réserver
              </motion.button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ maxWidth: 800, margin: "0 auto", padding: "100px 60px" }}>
        <h2 style={{ fontFamily: C.serif, fontSize: 48, fontStyle: "italic", textAlign: "center", marginBottom: 56 }}>Questions.</h2>
        {FAQS.map((f, i) => (
          <div key={i} style={{ borderBottom: "1px solid #1a1a1a" }}>
            <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
              style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 0", background: "none", border: "none", color: C.warm, cursor: "pointer", textAlign: "left" }}>
              <span style={{ fontFamily: C.serif, fontSize: 18, fontStyle: "italic" }}>{f.q}</span>
              <motion.span animate={{ rotate: openFaq === i ? 45 : 0 }} style={{ fontSize: 20, color: C.gold, minWidth: 20 }}>+</motion.span>
            </button>
            <AnimatePresence>
              {openFaq === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <p style={{ paddingBottom: 24, fontSize: 14, color: C.muted, lineHeight: 1.8 }}>{f.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section style={{ background: "#050505", padding: "100px 60px", textAlign: "center", borderTop: `1px solid #1a1a1a` }}>
        <h2 style={{ fontFamily: C.serif, fontSize: "clamp(48px, 7vw, 100px)", fontStyle: "italic", fontWeight: 300, color: C.warm, marginBottom: 40, lineHeight: 1 }}>
          Parlons de<br /><span style={{ color: C.gold }}>votre projet.</span>
        </h2>
        <motion.a href="#" whileHover={{ letterSpacing: 6 }} whileTap={{ scale: 0.97 }}
          style={{ display: "inline-block", padding: "18px 56px", border: `1px solid ${C.gold}`, color: C.gold, fontSize: 12, letterSpacing: 4, textTransform: "uppercase", textDecoration: "none", transition: "letter-spacing 0.3s", fontFamily: C.sans }}>
          hello@iris-studio.fr
        </motion.a>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "40px 60px", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #111" }}>
        <span style={{ fontFamily: C.serif, fontSize: 16, fontStyle: "italic", color: "#333" }}>Iris Studio</span>
        <span style={{ fontSize: 11, color: "#333", letterSpacing: 2 }}>© 2025 — Paris, France</span>
        <div style={{ display: "flex", gap: 24 }}>
          {["Camera", "Behance", "LinkedIn"].map(l => (
            <span key={l} style={{ fontSize: 11, color: "#444", letterSpacing: 2, textTransform: "uppercase", cursor: "pointer" }}>{l}</span>
          ))}
        </div>
      </footer>
    </div>
  )
}
