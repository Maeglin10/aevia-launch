'use client'
import { useRef, useState, useEffect, useCallback } from "react"
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion"
import { HardHat, Phone, Mail, MapPin, CheckCircle, Clock, Shield, Layers, Home, Wrench, ArrowRight, Menu, X, ChevronDown, Star, Award, TrendingUp, Users, Package } from "lucide-react"

const C = {
  bg: "#0b0d0a",
  bgAlt: "#111309",
  bgCard: "#171a0f",
  text: "#e9ead8",
  textMuted: "#8b8c78",
  accent: "#c8a53a",
  accentDark: "#9e811e",
  accentLight: "#e4c060",
  steel: "#3a4a5c",
  steelLight: "#5a6e84",
  border: "rgba(200,165,58,0.18)",
  borderLight: "rgba(233,234,216,0.07)",
  white: "#ffffff",
}

const font = {
  display: `"Oswald", "Barlow Condensed", Impact, sans-serif`,
  body: `"Inter", system-ui, -apple-system, sans-serif`,
}

const SERVICES = [
  { icon: Home, title: "Maçonnerie Générale", desc: "Construction de murs, cloisons, dalles et fondations. Travaux neufs et rénovation. Béton armé, parpaings, briques de parement.", price: "Sur devis", tag: "Expertise" },
  { icon: Layers, title: "Ravalement de Façade", desc: "Nettoyage haute pression, enduits monocouches, isolation thermique par l'extérieur (ITE). Traitement anti-mousse et peinture façade.", price: "À partir de 35 €/m²", tag: "ITE" },
  { icon: Package, title: "Carrelage & Dallage", desc: "Pose de carrelage intérieur et dallage extérieur. Grès cérame, travertin, béton ciré. Préparation des supports garantie.", price: "À partir de 45 €/m²", tag: "" },
  { icon: Wrench, title: "Chape & Ragréage", desc: "Coulage de chapes traditionnelles et fluides. Ragréage autonivelant. Préparation de supports pour tout revêtement.", price: "À partir de 18 €/m²", tag: "" },
  { icon: Shield, title: "Étanchéité & Terrasses", desc: "Imperméabilisation terrasses et toitures-terrasses. Relevés d'étanchéité, nez de dalle, protection anti-fissures.", price: "Sur devis", tag: "Garantie 10 ans" },
  { icon: HardHat, title: "Démolition Contrôlée", desc: "Démolition de murs porteurs avec étude structure, ouvertures, trémies d'escalier. Évacuation des gravats comprise.", price: "Sur devis", tag: "" },
]

const STATS = [
  { value: 1840, suffix: "+", label: "Chantiers terminés", icon: HardHat },
  { value: 22, suffix: " ans", label: "D'expérience terrain", icon: Award },
  { value: 100, suffix: "%", label: "Garantie décennale", icon: Shield },
  { value: 48, suffix: "h", label: "Devis remis sous", icon: Clock },
]

const PROJECTS = [
  { title: "Villa contemporaine R+1", loc: "Caluire-et-Cuire (69)", type: "Construction neuve", surface: "180 m²", year: "2025", color: C.accent },
  { title: "Ravalement ITE complet", loc: "Lyon 7e (69)", type: "Rénovation énergétique", surface: "420 m² façade", year: "2025", color: C.steelLight },
  { title: "Extension BBC garage-bureau", loc: "Meyzieu (69)", type: "Extension", surface: "45 m²", year: "2024", color: C.accentLight },
  { title: "Rénovation complète appartement", loc: "Bron (69)", type: "Rénovation totale", surface: "95 m²", year: "2024", color: C.steel },
  { title: "Carrelage grand format spa", loc: "Écully (69)", type: "Second œuvre", surface: "220 m²", year: "2024", color: C.accent },
  { title: "Chape liquide immeuble", loc: "Vénissieux (69)", type: "Chape & sol", surface: "560 m²", year: "2023", color: C.steelLight },
]

const TESTIMONIALS = [
  { name: "Famille Bertrand", city: "Caluire-et-Cuire", stars: 5, text: "Extension de notre maison en 6 semaines chrono. Équipe sérieuse, chantier propre chaque soir, et finitions soignées. Exactement ce qu'on espérait.", service: "Extension maison" },
  { name: "Copropriété Les Lilas", city: "Lyon 7e", stars: 5, text: "Ravalement ITE complet sur 4 bâtiments. Les travaux ont été réalisés dans les délais contractuels malgré un chantier complexe. Bravo à toute l'équipe.", service: "Ravalement façade" },
  { name: "Sandra Mercier", city: "Bron", stars: 5, text: "Rénovation totale de mon appartement : démolition, maçonnerie, carrelage. Résultat parfait, budget tenu, aucune mauvaise surprise.", service: "Rénovation complète" },
  { name: "Thierry Jourdain", city: "Meyzieu", stars: 5, text: "Ouverture d'un mur porteur réalisée en une journée. Travail propre, remise en état impeccable. Je recommande sans aucune réserve.", service: "Mur porteur" },
  { name: "Restaurant Le Bistreau", city: "Lyon 3e", stars: 5, text: "Carrelage grand format pour notre établissement. Pose parfaite, joint millimétrique. Nos clients remarquent la qualité des finitions.", service: "Carrelage pro" },
  { name: "M. et Mme Fontaine", city: "Ecully", stars: 5, text: "Construction d'un garage et d'une terrasse dallée. Prix juste, délai respecté, maçons polis et compétents. Parfait.", service: "Terrassement & dalle" },
]

const PROCESS = [
  { num: "01", title: "Visite & Étude", desc: "Prise de mesures, étude technique du projet, évaluation des contraintes. Devis détaillé et plan de travaux remis sous 48h." },
  { num: "02", title: "Validation & Planning", desc: "Signature du devis, planification du chantier. Demandes administratives si nécessaires (permis de construire, déclaration préalable)." },
  { num: "03", title: "Exécution", desc: "Chef de chantier dédié, équipe qualifiée, matériaux de première qualité. Suivi journalier, point hebdomadaire avec le client." },
  { num: "04", title: "Réception & Garanties", desc: "Visite de réception contradictoire, levée des réserves sous 8 jours. Remise des documents de garanties décennale et assurance." },
]

const FAQ = [
  { q: "Réalisez-vous des devis gratuits ?", a: "Oui, tous nos devis sont gratuits, détaillés et remis sous 48h après visite sur site. Chaque poste est clairement détaillé : main-d'œuvre, fournitures, évacuation des gravats." },
  { q: "Quelle est votre zone d'intervention ?", a: "Nous intervenons sur tout le département du Rhône (69) et les communes limitrophes de l'Isère et de l'Ain, dans un rayon de 80 km autour de Lyon." },
  { q: "Êtes-vous couverts par une assurance décennale ?", a: "Oui, Bâtisseurs Durand est couvert par une garantie décennale complète (RC Pro et décennale) auprès d'AXA Entreprises. L'attestation est fournie dès la signature du devis." },
  { q: "Pouvez-vous gérer les démarches administratives ?", a: "Pour les projets nécessitant un permis de construire ou une déclaration préalable, nous pouvons vous accompagner dans le montage du dossier et le suivi en mairie." },
  { q: "Combien de temps dure un chantier de ravalement ?", a: "Un ravalement de façade de 200 m² prend en général 2 à 3 semaines. Le délai dépend de la surface, de l'état du support et des conditions météorologiques." },
]

function useCounter(target: number, inView: boolean) {
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!inView) return
    let cur = 0
    const step = target / 60
    const t = setInterval(() => { cur += step; if (cur >= target) { setV(target); clearInterval(t) } else setV(Math.floor(cur)) }, 25)
    return () => clearInterval(t)
  }, [inView, target])
  return v
}

function StatCard({ stat, i }: { stat: typeof STATS[0]; i: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const c = useCounter(stat.value, inView)
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: i * 0.1 }}
      style={{ background: C.bgCard, border: `1px solid ${C.borderLight}`, padding: "2rem", position: "relative" }}>
      <div style={{ position: "absolute", top: 0, left: 0, width: 3, height: "100%", background: C.accent }} />
      <stat.icon size={26} style={{ color: C.accent, marginBottom: "1rem", display: "block" }} />
      <div style={{ fontFamily: font.display, fontSize: "2.8rem", fontWeight: 700, color: C.text, lineHeight: 1 }}>
        {c.toLocaleString("fr-FR")}<span style={{ color: C.accent, fontSize: "1.6rem" }}>{stat.suffix}</span>
      </div>
      <p style={{ fontFamily: font.body, fontSize: "0.82rem", color: C.textMuted, marginTop: "0.5rem" }}>{stat.label}</p>
    </motion.div>
  )
}

function ServiceCard({ s, i }: { s: typeof SERVICES[0]; i: number }) {
  const [hov, setHov] = useState(false)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: i * 0.08 }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: hov ? C.bgCard : "transparent", border: `1px solid ${hov ? C.accent : C.borderLight}`, padding: "2rem", cursor: "pointer", transition: "all 0.3s", position: "relative" }}>
      {s.tag && <span style={{ position: "absolute", top: "1rem", right: "1rem", background: s.tag === "Garantie 10 ans" ? C.steel : C.accent, color: C.white, fontFamily: font.body, fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", padding: "0.2rem 0.5rem" }}>{s.tag}</span>}
      <motion.div animate={{ color: hov ? C.accent : C.textMuted }} style={{ marginBottom: "1rem", transition: "color 0.3s" }}>
        <s.icon size={30} />
      </motion.div>
      <h3 style={{ fontFamily: font.display, fontSize: "1.35rem", fontWeight: 600, color: C.text, textTransform: "uppercase", letterSpacing: "0.04em", margin: "0 0 0.75rem" }}>{s.title}</h3>
      <p style={{ fontFamily: font.body, fontSize: "0.85rem", color: C.textMuted, lineHeight: 1.75, margin: "0 0 1.2rem" }}>{s.desc}</p>
      <div style={{ fontFamily: font.display, fontSize: "1.1rem", fontWeight: 600, color: C.accent }}>{s.price}</div>
      <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", marginTop: "0.8rem", color: hov ? C.accent : C.textMuted, fontSize: "0.78rem", transition: "color 0.3s" }}>
        <span>Demander un devis</span><ArrowRight size={13} />
      </div>
    </motion.div>
  )
}

function ProcessStep({ p, i }: { p: typeof PROCESS[0]; i: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: i * 0.12 }} style={{ position: "relative", paddingTop: "1.5rem" }}>
      <div style={{ position: "absolute", top: 0, left: 0, width: 40, height: 3, background: C.accent }} />
      <div style={{ fontFamily: font.display, fontSize: "3.5rem", fontWeight: 700, color: `${C.accent}1e`, lineHeight: 1, marginBottom: "0.5rem" }}>{p.num}</div>
      <h3 style={{ fontFamily: font.display, fontSize: "1.15rem", fontWeight: 600, color: C.text, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "0.75rem" }}>{p.title}</h3>
      <p style={{ fontFamily: font.body, fontSize: "0.85rem", color: C.textMuted, lineHeight: 1.75 }}>{p.desc}</p>
    </motion.div>
  )
}

function TestiCard({ t, i }: { t: typeof TESTIMONIALS[0]; i: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: i * 0.08 }}
      style={{ background: C.bgCard, padding: "1.8rem", border: `1px solid ${C.borderLight}`, position: "relative" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${C.accent}, transparent)` }} />
      <div style={{ display: "flex", gap: "0.2rem", marginBottom: "1rem" }}>
        {[...Array(t.stars)].map((_, j) => <Star key={j} size={13} fill={C.accent} color={C.accent} />)}
      </div>
      <p style={{ fontFamily: font.body, fontSize: "0.875rem", color: C.text, lineHeight: 1.8, marginBottom: "1.2rem", fontStyle: "italic" }}>"{t.text}"</p>
      <div style={{ borderTop: `1px solid ${C.borderLight}`, paddingTop: "1rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ fontFamily: font.body, fontSize: "0.875rem", fontWeight: 600, color: C.text }}>{t.name}</div>
          <div style={{ fontFamily: font.body, fontSize: "0.75rem", color: C.textMuted }}>{t.city}</div>
        </div>
        <span style={{ fontFamily: font.body, fontSize: "0.62rem", color: C.accent, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>{t.service}</span>
      </div>
    </motion.div>
  )
}

export default function Impact213Page() {
  const [navOpen, setNavOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeFaq, setActiveFaq] = useState<number | null>(null)
  const [formSent, setFormSent] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0])

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", fn, { passive: true })
    return () => window.removeEventListener("scroll", fn)
  }, [])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault(); setFormLoading(true)
    setTimeout(() => { setFormLoading(false); setFormSent(true) }, 2000)
  }, [])

  const S: React.CSSProperties = { maxWidth: 1200, margin: "0 auto", padding: "0 2rem" }
  const eyebrow: React.CSSProperties = { fontFamily: font.body, fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.28em", textTransform: "uppercase", color: C.accent, display: "block", marginBottom: "1rem" }
  const h2: React.CSSProperties = { fontFamily: font.display, fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 600, color: C.text, textTransform: "uppercase", letterSpacing: "0.02em", lineHeight: 1.1, margin: "0 0 1.5rem" }

  return (
    <div style={{ background: C.bg, color: C.text, minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');
        ::selection { background: ${C.accent}40; color: ${C.white}; }
        input, select, textarea, button { font-family: inherit; }
        select option { background: ${C.bgCard}; }
        @media(min-width:900px) { .nav-lnk { display: block !important; } }
      `}</style>

      {/* NAV */}
      <motion.nav animate={{ background: scrolled ? "rgba(11,13,10,0.96)" : "transparent" }}
        transition={{ duration: 0.3 }}
        style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, borderBottom: scrolled ? `1px solid ${C.borderLight}` : "none", backdropFilter: scrolled ? "blur(16px)" : "none" }}>
        <div style={{ ...S, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.2rem 2rem" }}>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ width: 36, height: 36, background: C.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <HardHat size={20} color={C.bg} />
            </div>
            <div>
              <div style={{ fontFamily: font.display, fontSize: "1.2rem", fontWeight: 600, color: C.text, letterSpacing: "0.08em", textTransform: "uppercase" }}>Bâtisseurs Durand</div>
              <div style={{ fontFamily: font.body, fontSize: "0.58rem", color: C.textMuted, letterSpacing: "0.14em", textTransform: "uppercase" }}>Maçonnerie · Ravalement · BTP</div>
            </div>
          </motion.div>
          <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
            {["Prestations", "Réalisations", "À propos", "Contact"].map((l, i) => (
              <motion.a key={l} href={`#${l.toLowerCase().replace(/[éè]/g, "e").replace(" ", "-").replace("à", "a")}`}
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i + 0.2 }}
                className="nav-lnk"
                style={{ fontFamily: font.body, fontSize: "0.8rem", fontWeight: 500, color: C.textMuted, textDecoration: "none", display: "none" }}
                whileHover={{ color: C.text }}>{l}</motion.a>
            ))}
            <motion.a href="tel:0472123456" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: C.accent, color: C.bg, fontFamily: font.body, fontSize: "0.8rem", fontWeight: 700, padding: "0.6rem 1.2rem", textDecoration: "none" }}
              whileHover={{ background: C.accentLight }}>
              <Phone size={14} /> 04 72 12 34 56
            </motion.a>
            <motion.button onClick={() => setNavOpen(!navOpen)} style={{ background: "none", border: "none", color: C.text, cursor: "pointer", display: "flex" }}>
              {navOpen ? <X size={22} /> : <Menu size={22} />}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {navOpen && (
          <motion.div key="mob" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, zIndex: 99, background: "rgba(11,13,10,0.97)", backdropFilter: "blur(20px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "2rem" }}>
            {["Prestations", "Réalisations", "À propos", "Contact"].map((l, i) => (
              <motion.a key={l} href={`#${l.toLowerCase()}`} onClick={() => setNavOpen(false)}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                style={{ fontFamily: font.display, fontSize: "2.5rem", fontWeight: 600, color: C.text, textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.08em" }}
                whileHover={{ color: C.accent }}>{l}</motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO */}
      <section ref={heroRef} style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
        <motion.div style={{ position: "absolute", inset: 0, y: heroY }}>
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(160deg, #0b0d0a 0%, #1a1400 60%, #0b0d0a 100%)` }} />
          <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(ellipse 55% 45% at 65% 50%, ${C.accent}14 0%, transparent 70%)` }} />
          {/* Construction grid lines */}
          {[...Array(10)].map((_, i) => (
            <motion.div key={i}
              style={{ position: "absolute", left: `${i * 10}%`, top: 0, bottom: 0, width: 1, background: `${C.accent}08` }}
              initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 1.2, delay: i * 0.06 }} />
          ))}
          {[...Array(8)].map((_, i) => (
            <motion.div key={i}
              style={{ position: "absolute", top: `${i * 12.5}%`, left: 0, right: 0, height: 1, background: `${C.accent}06` }}
              initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.4, delay: i * 0.08 }} />
          ))}
        </motion.div>
        <motion.div style={{ position: "relative", zIndex: 2, ...S, opacity: heroOpacity }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
            <span style={eyebrow}>Entreprise de maçonnerie · Lyon &amp; Rhône · Depuis 2002</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.35 }}
            style={{ fontFamily: font.display, fontSize: "clamp(3.5rem,9vw,8rem)", fontWeight: 700, color: C.text, textTransform: "uppercase", lineHeight: 0.9, letterSpacing: "-0.01em", margin: "0 0 1.5rem" }}>
            Bâtir<br /><span style={{ color: C.accent }}>Solide</span><br />Durable
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}
            style={{ fontFamily: font.body, fontSize: "1.05rem", color: C.textMuted, maxWidth: 520, lineHeight: 1.8, marginBottom: "2.5rem", fontWeight: 300 }}>
            Construction, ravalement, carrelage et rénovation par des maçons expérimentés. Devis gratuit sous 48h, garantie décennale, matériaux premium.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.62 }}
            style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <motion.a href="#contact" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              style={{ display: "flex", alignItems: "center", gap: "0.6rem", background: C.accent, color: C.bg, fontFamily: font.display, fontSize: "1rem", fontWeight: 700, padding: "1rem 2rem", textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Devis Gratuit <ArrowRight size={18} />
            </motion.a>
            <motion.a href="tel:0472123456" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              style={{ display: "flex", alignItems: "center", gap: "0.6rem", border: `1px solid ${C.borderLight}`, color: C.text, fontFamily: font.display, fontSize: "1rem", fontWeight: 600, padding: "1rem 2rem", textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              <Phone size={16} /> 04 72 12 34 56
            </motion.a>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
            style={{ display: "flex", gap: "2.5rem", marginTop: "3rem", flexWrap: "wrap" }}>
            {[{ v: "1 840+", l: "Chantiers terminés" }, { v: "22 ans", l: "D'expérience terrain" }, { v: "10 ans", l: "Garantie décennale" }].map(({ v, l }) => (
              <div key={l}>
                <div style={{ fontFamily: font.display, fontSize: "1.6rem", fontWeight: 700, color: C.accent }}>{v}</div>
                <div style={{ fontFamily: font.body, fontSize: "0.72rem", color: C.textMuted, letterSpacing: "0.04em" }}>{l}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* STATS */}
      <section style={{ padding: "5rem 0", background: C.bgAlt }}>
        <div style={S}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "1.5rem" }}>
            {STATS.map((s, i) => <StatCard key={i} stat={s} i={i} />)}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="prestations" style={{ padding: "8rem 0" }}>
        <div style={S}>
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <span style={eyebrow}>Nos prestations</span>
            <h2 style={h2}>Maçonnerie<br /><span style={{ color: C.accent }}>tous corps d'état</span></h2>
          </motion.div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "1.5rem", marginTop: "3rem" }}>
            {SERVICES.map((s, i) => <ServiceCard key={i} s={s} i={i} />)}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="realisations" style={{ padding: "8rem 0", background: C.bgAlt }}>
        <div style={S}>
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <span style={eyebrow}>Nos réalisations</span>
            <h2 style={h2}>Chantiers récents<br /><span style={{ color: C.accent }}>dans votre région</span></h2>
          </motion.div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: "1.5rem", marginTop: "3rem" }}>
            {PROJECTS.map((p, i) => {
              const [hov, setHov] = useState(false)
              const ref = useRef(null)
              const inV = useInView(ref, { once: true, margin: "-40px" })
              return (
                <motion.div key={i} ref={ref} initial={{ opacity: 0, y: 30 }} animate={inV ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.09 }}
                  onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
                  style={{ background: hov ? C.bgCard : "transparent", border: `1px solid ${hov ? p.color : C.borderLight}`, padding: "1.8rem", cursor: "pointer", transition: "all 0.3s" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
                    <div style={{ width: 8, height: 8, background: p.color, borderRadius: "50%" }} />
                    <span style={{ fontFamily: font.body, fontSize: "0.65rem", fontWeight: 600, color: C.textMuted, letterSpacing: "0.15em", textTransform: "uppercase" }}>{p.type}</span>
                    <span style={{ fontFamily: font.body, fontSize: "0.65rem", color: C.textMuted, marginLeft: "auto" }}>{p.year}</span>
                  </div>
                  <h3 style={{ fontFamily: font.display, fontSize: "1.25rem", fontWeight: 600, color: C.text, textTransform: "uppercase", letterSpacing: "0.03em", marginBottom: "0.5rem" }}>{p.title}</h3>
                  <div style={{ fontFamily: font.body, fontSize: "0.8rem", color: C.textMuted, marginBottom: "0.3rem" }}>{p.loc}</div>
                  <div style={{ fontFamily: font.display, fontSize: "1rem", fontWeight: 600, color: p.color, marginTop: "1rem" }}>{p.surface}</div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section style={{ padding: "8rem 0" }}>
        <div style={S}>
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <span style={eyebrow}>Notre méthode</span>
            <h2 style={h2}>Un chantier réussi en<br /><span style={{ color: C.accent }}>4 étapes maîtrisées</span></h2>
          </motion.div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "3rem", marginTop: "4rem" }}>
            {PROCESS.map((p, i) => <ProcessStep key={i} p={p} i={i} />)}
          </div>
        </div>
      </section>

      {/* A PROPOS */}
      <section id="a-propos" style={{ padding: "8rem 0", background: C.bgAlt }}>
        <div style={{ ...S, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6rem", alignItems: "center" }}>
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <span style={eyebrow}>L'entreprise</span>
            <h2 style={h2}>22 ans de passion<br /><span style={{ color: C.accent }}>pour le bâti</span></h2>
            <p style={{ fontFamily: font.body, fontSize: "0.9rem", color: C.textMuted, lineHeight: 1.85, marginBottom: "1.5rem" }}>
              Fondée en 2002 par Marc Durand, compagnon du devoir, l'entreprise Bâtisseurs Durand est aujourd'hui une référence de la maçonnerie artisanale dans le Rhône. Nos 12 maçons qualifiés interviennent sur tous types de chantiers, du particulier à la copropriété.
            </p>
            <p style={{ fontFamily: font.body, fontSize: "0.9rem", color: C.textMuted, lineHeight: 1.85, marginBottom: "2rem" }}>
              Notre philosophie : un travail soigné, des matériaux de qualité et une relation client transparente. Chaque chantier est suivi par un chef d'équipe dédié, disponible à tout moment.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              {[{ v: "12", l: "Maçons qualifiés" }, { v: "3", l: "Chefs de chantier" }, { v: "AAA", l: "Note Banque de France" }, { v: "RGE", l: "Certifié Qualibat" }].map(({ v, l }) => (
                <div key={l} style={{ padding: "1rem 1.2rem", background: C.bgCard, border: `1px solid ${C.borderLight}` }}>
                  <div style={{ fontFamily: font.display, fontSize: "1.6rem", fontWeight: 700, color: C.accent }}>{v}</div>
                  <div style={{ fontFamily: font.body, fontSize: "0.78rem", color: C.textMuted, marginTop: "0.2rem" }}>{l}</div>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.15 }}>
            {/* Visual: blueprint-style illustration */}
            <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, padding: "2rem", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: 0, backgroundImage: `repeating-linear-gradient(0deg, ${C.accent}06 0px, ${C.accent}06 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, ${C.accent}06 0px, ${C.accent}06 1px, transparent 1px, transparent 40px)` }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ fontFamily: font.display, fontSize: "0.75rem", fontWeight: 600, color: C.accent, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1.5rem" }}>Plan type · Maison 120 m²</div>
                <svg viewBox="0 0 360 280" style={{ width: "100%", height: "auto" }}>
                  <rect x="20" y="20" width="320" height="240" fill="none" stroke={C.accent} strokeWidth="2" strokeOpacity="0.5" />
                  <rect x="20" y="20" width="160" height="140" fill="none" stroke={C.accent} strokeWidth="1.5" strokeOpacity="0.4" />
                  <rect x="180" y="20" width="160" height="100" fill="none" stroke={C.accent} strokeWidth="1.5" strokeOpacity="0.4" />
                  <rect x="180" y="120" width="160" height="140" fill="none" stroke={C.accent} strokeWidth="1.5" strokeOpacity="0.4" />
                  <rect x="20" y="160" width="160" height="100" fill="none" stroke={C.accent} strokeWidth="1.5" strokeOpacity="0.4" />
                  <text x="60" y="95" fill={C.accent} fontSize="11" opacity="0.6" fontFamily="monospace">SÉJOUR</text>
                  <text x="60" y="115" fill={C.textMuted} fontSize="9" opacity="0.5" fontFamily="monospace">42 m²</text>
                  <text x="218" y="75" fill={C.accent} fontSize="11" opacity="0.6" fontFamily="monospace">CUISINE</text>
                  <text x="218" y="90" fill={C.textMuted} fontSize="9" opacity="0.5" fontFamily="monospace">18 m²</text>
                  <text x="218" y="185" fill={C.accent} fontSize="11" opacity="0.6" fontFamily="monospace">CHAMBRE</text>
                  <text x="218" y="200" fill={C.textMuted} fontSize="9" opacity="0.5" fontFamily="monospace">22 m²</text>
                  <text x="50" y="215" fill={C.accent} fontSize="11" opacity="0.6" fontFamily="monospace">CHAMBRE</text>
                  <text x="50" y="230" fill={C.textMuted} fontSize="9" opacity="0.5" fontFamily="monospace">18 m²</text>
                  <motion.line x1="20" y1="20" x2="340" y2="20" stroke={C.accentLight} strokeWidth="2" strokeOpacity="0.8"
                    initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.5, ease: "easeInOut" }} />
                </svg>
                <div style={{ fontFamily: font.body, fontSize: "0.72rem", color: C.textMuted, marginTop: "1rem", textAlign: "center" }}>
                  Bâtisseurs Durand · Réf. BD-2025-312 · Confidentiel
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: "8rem 0" }}>
        <div style={S}>
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <span style={eyebrow}>Ce que disent nos clients</span>
            <h2 style={h2}><span style={{ color: C.accent }}>1 840+</span> chantiers,<br />1 840+ clients satisfaits</h2>
          </motion.div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "1.5rem", marginTop: "3rem" }}>
            {TESTIMONIALS.map((t, i) => <TestiCard key={i} t={t} i={i} />)}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "8rem 0", background: C.bgAlt }}>
        <div style={{ ...S, display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "6rem", alignItems: "start" }}>
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <span style={eyebrow}>FAQ</span>
            <h2 style={h2}>Vos questions,<br /><span style={{ color: C.accent }}>nos réponses</span></h2>
            <p style={{ fontFamily: font.body, fontSize: "0.875rem", color: C.textMuted, lineHeight: 1.8, marginTop: "1rem" }}>
              Une question spécifique ? Notre bureau d'études est joignable du lundi au vendredi.
            </p>
            <motion.a href="tel:0472123456" whileHover={{ scale: 1.02 }} style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", marginTop: "2rem", background: C.accent, color: C.bg, fontFamily: font.display, fontWeight: 700, fontSize: "0.9rem", padding: "0.8rem 1.6rem", textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              <Phone size={16} /> 04 72 12 34 56
            </motion.a>
          </motion.div>
          <div>
            {FAQ.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                style={{ borderBottom: `1px solid ${C.borderLight}` }}>
                <button onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  style={{ width: "100%", background: "none", border: "none", color: C.text, textAlign: "left", padding: "1.5rem 0", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
                  <span style={{ fontFamily: font.body, fontSize: "0.9rem", fontWeight: 500, lineHeight: 1.4 }}>{item.q}</span>
                  <motion.span animate={{ rotate: activeFaq === i ? 180 : 0 }} style={{ flexShrink: 0, color: C.accent }}><ChevronDown size={18} /></motion.span>
                </button>
                <AnimatePresence>
                  {activeFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35 }} style={{ overflow: "hidden" }}>
                      <p style={{ fontFamily: font.body, fontSize: "0.85rem", color: C.textMuted, lineHeight: 1.85, paddingBottom: "1.5rem" }}>{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ padding: "8rem 0" }}>
        <div style={S}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "start" }}>
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <span style={eyebrow}>Demande de devis</span>
              <h2 style={h2}>Parlez-nous de<br /><span style={{ color: C.accent }}>votre chantier</span></h2>
              <p style={{ fontFamily: font.body, fontSize: "0.875rem", color: C.textMuted, lineHeight: 1.8, marginTop: "1rem", marginBottom: "2rem" }}>
                Décrivez votre projet, nos chefs de chantier étudient votre demande et vous contactent pour organiser une visite de diagnostic gratuite.
              </p>
              {[{ Icon: Phone, l: "04 72 12 34 56", s: "Lun–Ven 8h–18h" }, { Icon: Mail, l: "devis@batisseurs-durand.fr", s: "Réponse sous 24h" }, { Icon: MapPin, l: "Rhône & limitrophes", s: "Rayon 80 km autour de Lyon" }, { Icon: Users, l: "12 maçons qualifiés", s: "Disponibilité sous 2–3 semaines" }].map(({ Icon, l, s }) => (
                <div key={l} style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.3rem" }}>
                  <div style={{ width: 40, height: 40, background: `${C.accent}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={17} color={C.accent} />
                  </div>
                  <div>
                    <div style={{ fontFamily: font.body, fontSize: "0.875rem", fontWeight: 600, color: C.text }}>{l}</div>
                    <div style={{ fontFamily: font.body, fontSize: "0.75rem", color: C.textMuted }}>{s}</div>
                  </div>
                </div>
              ))}
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.15 }}>
              <AnimatePresence mode="wait">
                {formSent ? (
                  <motion.div key="ok" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    style={{ padding: "3rem", background: `${C.accent}10`, border: `1px solid ${C.accent}30`, textAlign: "center" }}>
                    <CheckCircle size={52} color={C.accent} style={{ marginBottom: "1.5rem" }} />
                    <h3 style={{ fontFamily: font.display, fontSize: "1.6rem", fontWeight: 600, color: C.text, textTransform: "uppercase", marginBottom: "0.8rem" }}>Demande reçue !</h3>
                    <p style={{ fontFamily: font.body, color: C.textMuted, fontSize: "0.9rem", lineHeight: 1.75 }}>Un chef de chantier Bâtisseurs Durand vous rappellera sous 24h pour organiser votre visite de diagnostic.</p>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={handleSubmit} style={{ background: C.bgCard, padding: "2.5rem", border: `1px solid ${C.borderLight}` }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
                      {[{ n: "nom", l: "Nom complet", t: "text" }, { n: "tel", l: "Téléphone", t: "tel" }].map(({ n, l, t }) => (
                        <div key={n}>
                          <label style={{ fontFamily: font.body, fontSize: "0.68rem", fontWeight: 600, color: C.textMuted, letterSpacing: "0.14em", textTransform: "uppercase", display: "block", marginBottom: "0.5rem" }}>{l}</label>
                          <input required type={t} style={{ width: "100%", background: "transparent", border: `1px solid ${C.borderLight}`, color: C.text, fontFamily: font.body, fontSize: "0.9rem", padding: "0.75rem 1rem", outline: "none", transition: "border-color 0.2s" }}
                            onFocus={e => (e.target.style.borderColor = C.accent)} onBlur={e => (e.target.style.borderColor = C.borderLight)} />
                        </div>
                      ))}
                    </div>
                    {["email", "ville"].map((n) => (
                      <div key={n} style={{ marginBottom: "1.5rem" }}>
                        <label style={{ fontFamily: font.body, fontSize: "0.68rem", fontWeight: 600, color: C.textMuted, letterSpacing: "0.14em", textTransform: "uppercase", display: "block", marginBottom: "0.5rem" }}>{n === "email" ? "Email" : "Ville du chantier"}</label>
                        <input required type={n === "email" ? "email" : "text"} style={{ width: "100%", background: "transparent", border: `1px solid ${C.borderLight}`, color: C.text, fontFamily: font.body, fontSize: "0.9rem", padding: "0.75rem 1rem", outline: "none", transition: "border-color 0.2s" }}
                          onFocus={e => (e.target.style.borderColor = C.accent)} onBlur={e => (e.target.style.borderColor = C.borderLight)} />
                      </div>
                    ))}
                    <div style={{ marginBottom: "1.5rem" }}>
                      <label style={{ fontFamily: font.body, fontSize: "0.68rem", fontWeight: 600, color: C.textMuted, letterSpacing: "0.14em", textTransform: "uppercase", display: "block", marginBottom: "0.5rem" }}>Type de travaux</label>
                      <select required style={{ width: "100%", background: C.bgCard, border: `1px solid ${C.borderLight}`, color: C.text, fontFamily: font.body, fontSize: "0.9rem", padding: "0.75rem 1rem", outline: "none" }}>
                        <option value="">Sélectionnez...</option>
                        {["Construction neuve", "Extension / agrandissement", "Ravalement de façade", "Carrelage & dallage", "Démolition / mur porteur", "Chape & ragréage", "Étanchéité terrasse", "Autre"].map(o => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                    <div style={{ marginBottom: "1.5rem" }}>
                      <label style={{ fontFamily: font.body, fontSize: "0.68rem", fontWeight: 600, color: C.textMuted, letterSpacing: "0.14em", textTransform: "uppercase", display: "block", marginBottom: "0.5rem" }}>Description du projet</label>
                      <textarea rows={3} style={{ width: "100%", background: "transparent", border: `1px solid ${C.borderLight}`, color: C.text, fontFamily: font.body, fontSize: "0.9rem", padding: "0.75rem 1rem", outline: "none", resize: "vertical", transition: "border-color 0.2s" }}
                        onFocus={e => (e.target.style.borderColor = C.accent)} onBlur={e => (e.target.style.borderColor = C.borderLight)} />
                    </div>
                    <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={formLoading}
                      style={{ width: "100%", background: C.accent, color: C.bg, border: "none", fontFamily: font.display, fontSize: "1rem", fontWeight: 700, padding: "1.1rem", cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.1em", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.8rem" }}>
                      {formLoading ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} style={{ width: 20, height: 20, border: `2px solid ${C.bg}40`, borderTopColor: C.bg, borderRadius: "50%" }} /> : <><ArrowRight size={18} /> Envoyer ma demande de devis</>}
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "4rem 0", borderTop: `1px solid ${C.borderLight}`, background: C.bgAlt }}>
        <div style={{ ...S, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "3rem" }}>
          <div style={{ maxWidth: 260 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
              <div style={{ width: 30, height: 30, background: C.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <HardHat size={16} color={C.bg} />
              </div>
              <span style={{ fontFamily: font.display, fontSize: "1.1rem", fontWeight: 600, color: C.text, textTransform: "uppercase", letterSpacing: "0.08em" }}>Bâtisseurs Durand</span>
            </div>
            <p style={{ fontFamily: font.body, fontSize: "0.8rem", color: C.textMuted, lineHeight: 1.75 }}>Entreprise de maçonnerie fondée en 2002. Travaux de construction, rénovation et second œuvre dans le Rhône et les départements limitrophes.</p>
            <div style={{ fontFamily: font.body, fontSize: "0.72rem", color: C.textMuted, marginTop: "1rem" }}>SIRET 432 187 654 00021 · RCS Lyon · Qualibat</div>
          </div>
          {[["Prestations", ["Maçonnerie générale", "Ravalement ITE", "Carrelage & dallage", "Étanchéité", "Démolition"]], ["Informations", ["À propos", "Certifications", "Garanties", "Zones d'intervention", "Nos chantiers"]]].map(([title, links]) => (
            <div key={title as string}>
              <div style={{ fontFamily: font.body, fontSize: "0.65rem", fontWeight: 600, color: C.textMuted, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "1.2rem" }}>{title as string}</div>
              {(links as string[]).map(l => <div key={l} style={{ fontFamily: font.body, fontSize: "0.82rem", color: C.textMuted, marginBottom: "0.55rem" }}>{l}</div>)}
            </div>
          ))}
          <div>
            <div style={{ fontFamily: font.body, fontSize: "0.65rem", fontWeight: 600, color: C.textMuted, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "1.2rem" }}>Contact</div>
            <motion.a href="tel:0472123456" whileHover={{ scale: 1.03 }} style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: C.accent, color: C.bg, fontFamily: font.display, fontWeight: 700, fontSize: "0.9rem", padding: "0.75rem 1.2rem", textDecoration: "none", textTransform: "uppercase", marginBottom: "1rem" }}>
              <Phone size={15} /> 04 72 12 34 56
            </motion.a>
            <div style={{ fontFamily: font.body, fontSize: "0.75rem", color: C.textMuted }}>devis@batisseurs-durand.fr</div>
            <div style={{ fontFamily: font.body, fontSize: "0.75rem", color: C.textMuted, marginTop: "0.3rem" }}>Lun–Ven : 8h–18h · Sam : 9h–12h</div>
          </div>
        </div>
        <div style={{ ...S, borderTop: `1px solid ${C.borderLight}`, marginTop: "3rem", paddingTop: "1.5rem", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <span style={{ fontFamily: font.body, fontSize: "0.72rem", color: C.textMuted }}>© 2026 Bâtisseurs Durand. Tous droits réservés.</span>
          <span style={{ fontFamily: font.body, fontSize: "0.72rem", color: C.textMuted }}>Mentions légales · CGV · Politique de confidentialité</span>
        </div>
      </footer>
    </div>
  )
}
