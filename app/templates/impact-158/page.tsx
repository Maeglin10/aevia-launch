"use client"

import React, { useState, useRef } from "react"
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion"

// ATLAS — Travel journal & itinerary blog. Warm off-white + rust + deep teal. Editorial serif, hand-crafted feel.
// Unique: destination cards as postcards, route timeline, animated map pins, subscription-first.

const DESTINATIONS = [
  { country: "Japon", region: "Kyushu & Kyoto", days: 21, season: "Printemps", mood: "Temples, bambous, sources chaudes", accent: "#c45c3a", pin: "JP" },
  { country: "Maroc", region: "Sud & Désert", days: 14, season: "Octobre", mood: "Dunes, kasbahs, nuits étoilées", accent: "#c4a96a", pin: "MA" },
  { country: "Islande", region: "Tour de l'île", days: 12, season: "Été", mood: "Volcans, glaciers, aurores", accent: "#4a8fa8", pin: "IS" },
  { country: "Pérou", region: "Cusco & Amazonie", days: 18, season: "Juin", mood: "Inca, jungle, altitude", accent: "#6b7a5c", pin: "PE" },
  { country: "Portugal", region: "Alentejo & Algarve", days: 10, season: "Mai", mood: "Villages blancs, plages secrètes", accent: "#a87860", pin: "PT" },
  { country: "Éthiopie", region: "Lalibela & Danakil", days: 16, season: "Novembre", mood: "Volcans de sel, iglises rupestres", accent: "#7a6090", pin: "ET" },
]

const LATEST_POSTS = [
  { title: "21 jours au Japon : itinéraire complet sans agence", dest: "Japon", reading: "18 min", category: "Itinéraire", featured: true },
  { title: "Survivre au désert de sel d'Éthiopie : ce qu'on ne vous dit pas", dest: "Éthiopie", reading: "12 min", category: "Aventure", featured: false },
  { title: "Le vrai budget pour un mois au Maroc en 2025", dest: "Maroc", reading: "8 min", category: "Budget", featured: false },
  { title: "Islande en van : locations, routes et erreurs à éviter", dest: "Islande", reading: "15 min", category: "Road trip", featured: false },
  { title: "Machu Picchu sans la foule : le secret des 5h du matin", dest: "Pérou", reading: "6 min", category: "Conseils", featured: false },
]

const TESTIMONIALS = [
  { quote: "L'itinéraire Japon d'Atlas m'a sauvé 3 semaines de recherche. Tout était précis, honnête, avec les vrais prix 2024.", name: "Marie L.", subscribed: "Depuis 14 mois" },
  { quote: "Premier voyage solo organisé 100% grâce aux articles Atlas. 22 jours au Pérou, zéro galère.", name: "Thomas R.", subscribed: "Depuis 8 mois" },
  { quote: "Enfin un blog de voyage qui ne vend pas du rêve mais de l'info. La différence c'est énorme.", name: "Camille B.", subscribed: "Depuis 2 ans" },
]

const CATEGORIES = ["Tous", "Itinéraires", "Budget", "Aventure", "Road Trip", "Conseils Pratiques"]

const FAQS = [
  { q: "À quelle fréquence publiez-vous ?", a: "Un article complet par semaine (lundi), plus une newsletter du vendredi avec les bons plans et actus voyage." },
  { q: "Vos itinéraires sont-ils récents ?", a: "Tous les articles datent de moins de 18 mois. Les prix et infos pratiques sont actualisés à chaque voyage, pas recyclés." },
  { q: "Proposez-vous du contenu en dehors du blog ?", a: "Oui — newsletter hebdo, communauté Discord (membres Premium), et une bibliothèque de spreadsheets de budget téléchargeables." },
  { q: "Êtes-vous sponsorisés ?", a: "Transparence totale : les articles sponsorisés sont clairement identifiés. Moins de 10% de notre contenu est sponsorisé. On décline ce qui ne correspond pas à nos voyages." },
  { q: "Comment accéder aux itinéraires complets ?", a: "Les résumés sont gratuits. Les itinéraires jour par jour avec cartes, hébergements et contacts sont réservés aux membres Premium (9 €/mois)." },
]

const PLANS = [
  { name: "Gratuit", price: "0 €", note: "pour toujours", features: ["1 article complet/semaine", "Newsletter vendredi", "Accès aux 30 derniers articles"] },
  { name: "Premium", price: "9 €", note: "/mois · sans engagement", features: ["Archives illimitées (200+ articles)", "Itinéraires jour par jour", "Cartes interactives téléchargeables", "Budget spreadsheets", "Communauté Discord"], highlight: true },
  { name: "Annuel", price: "79 €", note: "/an · économisez 2 mois", features: ["Tout Premium inclus", "Guide PDF imprimable offert", "Accès Q&A mensuel live", "Support prioritaire"] },
]

export default function Page() {
  const [activeCategory, setActiveCategory] = useState(0)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [hoveredDest, setHoveredDest] = useState<number | null>(null)
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)
  const { scrollY } = useScroll()

  const heroY = useTransform(scrollY, [0, 400], [0, -40])

  const postsRef = useRef(null)
  const pricingRef = useRef(null)
  const postsInView = useInView(postsRef, { once: true, margin: "-100px" })
  const pricingInView = useInView(pricingRef, { once: true, margin: "-100px" })

  const C = {
    bg: "#f9f5ef",
    rust: "#c45c3a",
    teal: "#2a6878",
    sand: "#c4a96a",
    text: "#1a1208",
    muted: "#8b7a6b",
    card: "#ffffff",
    border: "#e8ddd0",
    serif: "'Cormorant Garamond', Georgia, serif",
    sans: "system-ui, -apple-system, sans-serif",
    mono: "'JetBrains Mono', monospace",
  }

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: C.sans, overflowX: "hidden" }}>
      {/* NAV — editorial strip */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(249,245,239,0.97)", backdropFilter: "blur(12px)", borderBottom: `2px solid ${C.text}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 60px", height: 60 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ fontFamily: C.serif, fontSize: 24, letterSpacing: 2, fontStyle: "italic", color: C.text }}>Atlas</div>
          <div style={{ width: 1, height: 24, background: C.border }} />
          <div style={{ fontFamily: C.mono, fontSize: 10, letterSpacing: 3, color: C.muted, textTransform: "uppercase" }}>Journal de voyage</div>
        </div>
        <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {["Destinations", "Itinéraires", "Budget", "À propos"].map(l => (
            <a key={l} href="#" style={{ fontSize: 13, color: C.muted, textDecoration: "none", fontWeight: 500, letterSpacing: 0.3 }}>{l}</a>
          ))}
          <motion.button whileHover={{ background: C.text, color: C.bg }} whileTap={{ scale: 0.97 }}
            style={{ padding: "8px 22px", background: C.rust, color: "#fff", border: "none", fontSize: 12, fontWeight: 600, letterSpacing: 0.5, cursor: "pointer", transition: "background 0.2s", fontFamily: C.sans }}>
            Premium →
          </motion.button>
        </div>
      </nav>

      {/* HERO — editorial magazine with postcard cut */}
      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "90vh" }}>
        <motion.div style={{ y: heroY, padding: "80px 80px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <div style={{ fontFamily: C.mono, fontSize: 10, letterSpacing: 5, color: C.rust, textTransform: "uppercase", marginBottom: 36 }}>200+ itinéraires · Depuis 2019</div>
            <h1 style={{ fontFamily: C.serif, fontSize: "clamp(52px, 8vw, 108px)", fontWeight: 400, letterSpacing: -2, lineHeight: 0.92, fontStyle: "italic", color: C.text, marginBottom: 40 }}>
              Voyager mieux,<br />
              pas plus<br />
              <span style={{ color: C.rust }}>loin.</span>
            </h1>
            <p style={{ fontSize: 17, color: C.muted, lineHeight: 1.8, marginBottom: 48, maxWidth: 420 }}>
              Des itinéraires complets, des budgets réels, des conseils honnêtes. Le blog de voyage qui respecte votre temps et votre argent.
            </p>
            <div style={{ display: "flex", gap: 0, maxWidth: 420 }}>
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="votre@email.fr"
                style={{ flex: 1, padding: "14px 20px", background: "transparent", border: `1.5px solid ${C.border}`, borderRight: "none", color: C.text, fontSize: 14, outline: "none", fontFamily: C.sans }} />
              {subscribed ? (
                <div style={{ padding: "14px 20px", background: C.teal, color: "#fff", fontSize: 13, fontWeight: 600 }}>Bienvenue ✓</div>
              ) : (
                <motion.button whileHover={{ background: C.text }} whileTap={{ scale: 0.97 }}
                  onClick={() => { if (email) setSubscribed(true) }}
                  style={{ padding: "14px 24px", background: C.rust, color: "#fff", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "background 0.2s", fontFamily: C.sans }}>
                  S'abonner
                </motion.button>
              )}
            </div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 12 }}>Gratuit · 14 200 abonnés · Sans spam</div>
          </motion.div>
        </motion.div>

        {/* Right — destination postcards stack */}
        <div style={{ background: "#ede8df", padding: "60px", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "relative", width: 340, height: 440 }}>
            {DESTINATIONS.slice(0, 4).map((d, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, rotate: (i % 2 === 0 ? 1 : -1) * (i + 1) * 1.5, y: 20 }}
                animate={{ opacity: 1, rotate: (i % 2 === 0 ? 1 : -1) * (i + 1) * 2, y: i * -8 }}
                whileHover={{ scale: 1.04, rotate: 0, zIndex: 10 }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                style={{ position: "absolute", top: i * 20, left: i * 10, width: 280, background: C.card, border: `1px solid ${C.border}`, padding: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", cursor: "pointer", zIndex: 4 - i }}>
                <div style={{ height: 4, background: d.accent, marginBottom: 16 }} />
                <div style={{ fontFamily: C.mono, fontSize: 9, letterSpacing: 3, color: C.muted, textTransform: "uppercase", marginBottom: 8 }}>{d.pin} · {d.season}</div>
                <div style={{ fontFamily: C.serif, fontSize: 22, fontStyle: "italic", color: C.text, marginBottom: 6 }}>{d.country}</div>
                <div style={{ fontSize: 12, color: C.muted, marginBottom: 12 }}>{d.region} · {d.days} jours</div>
                <div style={{ fontSize: 13, color: d.accent, fontStyle: "italic", fontFamily: C.serif }}>{d.mood}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ background: C.teal, display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
        {[{ val: "200+", label: "Itinéraires publiés" }, { val: "48", label: "Pays couverts" }, { val: "14K+", label: "Abonnés actifs" }, { val: "2019", label: "Fondé en" }].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
            style={{ padding: "48px 40px", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.1)" : undefined, textAlign: "center" }}>
            <div style={{ fontFamily: C.serif, fontSize: 48, fontStyle: "italic", color: "#fff", lineHeight: 1 }}>{s.val}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 10, letterSpacing: 1 }}>{s.label}</div>
          </motion.div>
        ))}
      </section>

      {/* DESTINATIONS GRID */}
      <section style={{ padding: "80px 60px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48 }}>
          <h2 style={{ fontFamily: C.serif, fontSize: "clamp(32px, 4vw, 52px)", fontStyle: "italic", fontWeight: 400 }}>Destinations du moment.</h2>
          <a href="#" style={{ fontSize: 13, color: C.rust, textDecoration: "none", fontWeight: 600 }}>Voir toutes →</a>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {DESTINATIONS.map((d, i) => (
            <motion.div key={i}
              onHoverStart={() => setHoveredDest(i)}
              onHoverEnd={() => setHoveredDest(null)}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              style={{ position: "relative", height: 200, background: hoveredDest === i ? "#ede8df" : C.card, border: `1px solid ${hoveredDest === i ? d.accent : C.border}`, padding: "28px 32px", cursor: "pointer", transition: "all 0.2s" }}>
              <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 3, background: d.accent }} />
              <div style={{ fontFamily: C.mono, fontSize: 9, letterSpacing: 3, color: C.muted, textTransform: "uppercase", marginBottom: 12 }}>{d.pin} · {d.days}j · {d.season}</div>
              <div style={{ fontFamily: C.serif, fontSize: 28, fontStyle: "italic", color: C.text, marginBottom: 8 }}>{d.country}</div>
              <div style={{ fontSize: 13, color: C.muted, marginBottom: 12 }}>{d.region}</div>
              <AnimatePresence>
                {hoveredDest === i && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    style={{ fontSize: 12, color: d.accent, fontStyle: "italic", fontFamily: C.serif }}>
                    {d.mood} →
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>

      {/* LATEST POSTS */}
      <section ref={postsRef} style={{ padding: "80px 60px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
          <h2 style={{ fontFamily: C.serif, fontSize: "clamp(32px, 4vw, 52px)", fontStyle: "italic", fontWeight: 400 }}>Derniers articles.</h2>
          <div style={{ display: "flex", gap: 8 }}>
            {CATEGORIES.map((cat, i) => (
              <button key={i} onClick={() => setActiveCategory(i)}
                style={{ padding: "6px 16px", background: activeCategory === i ? C.text : "transparent", color: activeCategory === i ? "#fff" : C.muted, border: `1px solid ${activeCategory === i ? C.text : C.border}`, fontSize: 12, cursor: "pointer", transition: "all 0.15s", fontFamily: C.sans }}>
                {cat}
              </button>
            ))}
          </div>
        </div>
        {LATEST_POSTS.map((post, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 20 }} animate={postsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.1 }}
            whileHover={{ x: 4 }}
            style={{ borderTop: `1px solid ${C.border}`, padding: "24px 0", display: "flex", alignItems: "center", gap: 40, cursor: "pointer", transition: "all 0.15s" }}>
            {post.featured && <div style={{ fontFamily: C.mono, fontSize: 9, letterSpacing: 3, color: C.rust, textTransform: "uppercase", background: C.rust + "15", padding: "4px 10px", whiteSpace: "nowrap" }}>À la une</div>}
            <div style={{ fontFamily: C.mono, fontSize: 10, letterSpacing: 2, color: C.muted, textTransform: "uppercase", minWidth: 100 }}>{post.category}</div>
            <div style={{ fontFamily: C.serif, fontSize: 20, fontStyle: "italic", color: C.text, flex: 1 }}>{post.title}</div>
            <div style={{ fontFamily: C.mono, fontSize: 11, color: C.muted, whiteSpace: "nowrap" }}>{post.reading} de lecture</div>
            <div style={{ fontSize: 18, color: C.muted }}>→</div>
          </motion.div>
        ))}
      </section>

      {/* TESTIMONIALS */}
      <section style={{ background: "#ede8df", padding: "80px 60px", borderBottom: `1px solid ${C.border}` }}>
        <h2 style={{ fontFamily: C.serif, fontSize: "clamp(32px, 4vw, 52px)", fontStyle: "italic", fontWeight: 400, textAlign: "center", marginBottom: 56 }}>Ce que les voyageurs en disent.</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 40 }}>
          {TESTIMONIALS.map((t, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
              <div style={{ fontFamily: C.serif, fontSize: 48, color: C.rust, lineHeight: 0.8, marginBottom: 20, fontStyle: "italic" }}>"</div>
              <p style={{ fontFamily: C.serif, fontSize: 18, fontStyle: "italic", color: C.text, lineHeight: 1.7, marginBottom: 20 }}>{t.quote}</p>
              <div style={{ fontSize: 12, color: C.muted }}>{t.name} · <span style={{ color: C.teal }}>{t.subscribed}</span></div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section ref={pricingRef} style={{ padding: "80px 60px", borderBottom: `1px solid ${C.border}` }}>
        <h2 style={{ fontFamily: C.serif, fontSize: "clamp(32px, 4vw, 52px)", fontStyle: "italic", fontWeight: 400, textAlign: "center", marginBottom: 16 }}>Accédez à tout Atlas.</h2>
        <p style={{ fontSize: 17, color: C.muted, textAlign: "center", marginBottom: 56 }}>Les meilleurs itinéraires méritent les meilleures informations.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, maxWidth: 1000, margin: "0 auto" }}>
          {PLANS.map((p, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={pricingInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.15 }}
              style={{ background: p.highlight ? C.teal : C.card, border: p.highlight ? "none" : `1px solid ${C.border}`, padding: "40px 36px", boxShadow: p.highlight ? "0 16px 48px rgba(42,104,120,0.25)" : "none", transform: p.highlight ? "scale(1.03)" : "none" }}>
              <div style={{ fontSize: 11, letterSpacing: 3, color: p.highlight ? "rgba(255,255,255,0.6)" : C.muted, textTransform: "uppercase", marginBottom: 16 }}>{p.name}</div>
              <div style={{ fontFamily: C.serif, fontSize: 40, fontStyle: "italic", color: p.highlight ? "#fff" : C.text, lineHeight: 1, marginBottom: 4 }}>{p.price}</div>
              <div style={{ fontSize: 13, color: p.highlight ? "rgba(255,255,255,0.5)" : C.muted, marginBottom: 36 }}>{p.note}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 36 }}>
                {p.features.map((f, j) => (
                  <div key={j} style={{ display: "flex", gap: 10, fontSize: 14, color: p.highlight ? "rgba(255,255,255,0.85)" : C.text, alignItems: "flex-start" }}>
                    <span style={{ color: p.highlight ? "#fff" : C.rust, marginTop: 1 }}>→</span> {f}
                  </div>
                ))}
              </div>
              <motion.button whileHover={{ opacity: 0.85 }} whileTap={{ scale: 0.97 }}
                style={{ width: "100%", padding: "14px", background: p.highlight ? "#fff" : C.rust, color: p.highlight ? C.teal : "#fff", border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: C.sans }}>
                {p.price === "0 €" ? "Accès gratuit" : "Rejoindre Atlas Premium"}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ maxWidth: 800, margin: "0 auto", padding: "80px 60px" }}>
        <h2 style={{ fontFamily: C.serif, fontSize: 48, fontStyle: "italic", fontWeight: 400, textAlign: "center", marginBottom: 48 }}>Questions.</h2>
        {FAQS.map((f, i) => (
          <div key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
            <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
              style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 0", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
              <span style={{ fontFamily: C.serif, fontSize: 17, fontStyle: "italic", color: C.text }}>{f.q}</span>
              <motion.span animate={{ rotate: openFaq === i ? 45 : 0 }} style={{ fontSize: 22, color: C.rust, minWidth: 22 }}>+</motion.span>
            </button>
            <AnimatePresence>
              {openFaq === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <p style={{ paddingBottom: 20, fontSize: 14, color: C.muted, lineHeight: 1.85 }}>{f.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section style={{ background: C.teal, padding: "80px 60px", textAlign: "center" }}>
        <h2 style={{ fontFamily: C.serif, fontSize: "clamp(48px, 7vw, 96px)", fontStyle: "italic", fontWeight: 300, color: "#fff", marginBottom: 40, lineHeight: 1 }}>
          Votre prochain<br />voyage commence ici.
        </h2>
        <div style={{ display: "flex", gap: 0, maxWidth: 480, margin: "0 auto" }}>
          <input placeholder="votre@email.fr" style={{ flex: 1, padding: "16px 20px", background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", fontSize: 14, outline: "none", fontFamily: C.sans }} />
          <motion.button whileHover={{ background: C.text }} whileTap={{ scale: 0.97 }}
            style={{ padding: "16px 28px", background: C.rust, color: "#fff", border: "none", fontWeight: 700, fontSize: 14, cursor: "pointer", transition: "background 0.2s", fontFamily: C.sans }}>
            Rejoindre →
          </motion.button>
        </div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 16 }}>Gratuit · 14 200 abonnés · Désabonnement en 1 clic</div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#1a2a30", padding: "48px 60px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: C.serif, fontSize: 20, fontStyle: "italic", color: "#f9f5ef" }}>Atlas</div>
        <div style={{ fontSize: 12, color: "#3a5a6a" }}>© 2025 · Journal de voyage indépendant · RGPD · Mentions légales</div>
        <div style={{ display: "flex", gap: 20 }}>
          {["Camera", "Bookmark", "YouTube"].map(l => <span key={l} style={{ fontSize: 11, color: "#3a5a6a", letterSpacing: 2, textTransform: "uppercase", cursor: "pointer" }}>{l}</span>)}
        </div>
      </footer>
    </div>
  )
}
