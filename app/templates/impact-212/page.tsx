'use client'
import { useRef, useState, useEffect, useCallback } from "react"
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion"
import { Phone, Mail, MapPin, CheckCircle, Clock, Shield, Zap, Thermometer, Wind, Settings, ArrowRight, Menu, X, ChevronDown, Star, Award, TrendingUp } from "lucide-react"

const C = {
  bg: "#0a0c10",
  bgAlt: "#0f1218",
  bgCard: "#141820",
  text: "#e8edf5",
  textMuted: "#8896aa",
  accent: "#e85c0c",
  accentDark: "#b8440a",
  accentLight: "#ff7a3d",
  border: "rgba(232,92,12,0.18)",
  borderLight: "rgba(232,237,245,0.07)",
  white: "#ffffff",
}

const font = {
  display: `"Barlow Condensed", "Oswald", Impact, sans-serif`,
  body: `"Inter", system-ui, -apple-system, sans-serif`,
}

const SERVICES = [
  { icon: Thermometer, title: "Installation Chaudière", desc: "Pose de chaudières gaz, fioul et condensation. Marques agréées Viessmann, De Dietrich, Saunier Duval. Mise en service et formation incluses.", price: "À partir de 2 400 €", tag: "Populaire" },
  { icon: Wind, title: "Pompe à Chaleur", desc: "Air/air, air/eau, géothermie. Accompagnement MaPrimeRénov' et CEE intégral. Rendement COP jusqu'à 4.5, économies garanties.", price: "À partir de 5 800 €", tag: "Éco+" },
  { icon: Zap, title: "Climatisation Réversible", desc: "Systèmes mono et multi-split. Marques Mitsubishi, Daikin, Atlantic. Installation soignée, garantie pièces et main-d'œuvre.", price: "À partir de 1 800 €", tag: "" },
  { icon: Settings, title: "Entretien & Maintenance", desc: "Contrats annuels avec priorité d'intervention. Rapport d'inspection détaillé, pièces d'origine, garanties constructeur maintenues.", price: "149 € / an", tag: "Indispensable" },
  { icon: Shield, title: "Dépannage Urgence", desc: "Intervention sous 2h, 7j/7, 24h/24. Techniciens certifiés RGE. Diagnostic gratuit et devis transparent avant toute intervention.", price: "Appel gratuit", tag: "24/7" },
  { icon: Thermometer, title: "Plancher Chauffant", desc: "Hydraulique ou électrique, neuf ou rénovation. Thermostat connecté Nest ou Netatmo offert. Pose soignée, dalle respectée.", price: "À partir de 80 €/m²", tag: "" },
]

const STATS = [
  { value: 3200, suffix: "+", label: "Installations réalisées", icon: Zap },
  { value: 98, suffix: "%", label: "Clients satisfaits", icon: Star },
  { value: 15, suffix: " ans", label: "D'expertise terrain", icon: Award },
  { value: 2, suffix: "h max", label: "Délai d'urgence", icon: Clock },
]

const CERTIFICATIONS = [
  { name: "RGE QualiPAC", desc: "Pompes à chaleur & géothermie" },
  { name: "RGE Qualibois", desc: "Poêles bois & chaudières biomasse" },
  { name: "Qualigaz", desc: "Installation & entretien gaz" },
  { name: "MaPrimeRénov'", desc: "Accompagnateur agréé ANAH" },
]

const TESTIMONIALS = [
  { name: "Martine Leblanc", city: "Lyon 6e", stars: 5, text: "Installation PAC Viessmann en 2 jours chrono. Les aides MaPrimeRénov' ont été entièrement gérées. Économies de 60 % sur ma facture de chauffage dès le premier hiver.", service: "Pompe à chaleur" },
  { name: "Paul Girard", city: "Villeurbanne", stars: 5, text: "Dépannage un dimanche soir, technicien chez moi en 85 minutes. Prix annoncé, respecté. Aucune mauvaise surprise. Service exceptionnel.", service: "Dépannage urgence" },
  { name: "Isabelle Morin", city: "Caluire", stars: 5, text: "Contrat entretien depuis 3 ans. Ponctuel, rapport écrit à chaque visite, technicien qui explique tout. La tranquillité d'esprit au meilleur prix.", service: "Entretien annuel" },
  { name: "Jacques Renaud", city: "Bron", stars: 5, text: "Remplacement chaudière fioul par condensation gaz. Chantier propre, installation au millimètre. Le gain énergétique est réel et mesurable.", service: "Installation chaudière" },
  { name: "Céline Dumont", city: "Décines", stars: 5, text: "Dossier MaPrimeRénov' complexe entièrement pris en charge. 8 400 € d'aides obtenues sans que je touche à la moindre feuille. Incroyable.", service: "Aide financière" },
  { name: "Arnaud Pascal", city: "Vénissieux", stars: 5, text: "Clim Daikin installée proprement, mise en service soignée. Le technicien a pris le temps d'expliquer chaque réglage. Je recommande à 100 %.", service: "Climatisation" },
]

const PROCESS = [
  { num: "01", title: "Diagnostic gratuit", desc: "Visite à domicile, étude thermique de votre logement, recommandations personnalisées et devis détaillé sous 48h. Sans engagement." },
  { num: "02", title: "Financement & Aides", desc: "Simulation complète MaPrimeRénov', CEE, éco-PTZ. Nous déposons tous les dossiers à votre place. Zéro paperasse, aide maximale." },
  { num: "03", title: "Installation certifiée", desc: "Techniciens RGE qualifiés, délai tenu, chantier propre. Mise en service complète avec démonstration et remise des garanties." },
  { num: "04", title: "Suivi & Garantie", desc: "SAV réactif 24/7, garantie décennale, contrat d'entretien optionnel. Vous êtes suivi sur toute la durée de vie de votre équipement." },
]

const FAQ = [
  { q: "Quelles aides financières puis-je obtenir ?", a: "MaPrimeRénov' (jusqu'à 10 000 €), CEE (Certificats d'Économies d'Énergie), éco-PTZ à taux zéro, TVA réduite à 5,5 % et parfois des aides locales de la Région ou Métropole. Nous simulons gratuitement votre montant lors du diagnostic." },
  { q: "Combien de temps dure une installation de PAC ?", a: "En général 1 à 2 jours pour une pompe à chaleur air/eau standard. Nous planifions pour minimiser la gêne et votre chauffage est pleinement opérationnel dès la fin du chantier." },
  { q: "Intervenez-vous le week-end et les jours fériés ?", a: "Oui, notre service de dépannage est actif 7j/7, 24h/24. Délai d'intervention de 2h maximum dans notre zone (Rhône, Isère, Ain). Pas de majorations surprises : le tarif est annoncé avant l'intervention." },
  { q: "Comment est calculé le devis ?", a: "Le devis est 100 % gratuit et détaillé poste par poste : fournitures, main-d'œuvre, déplacement. Aucun coût caché. Valable 3 mois à partir de la date d'émission." },
  { q: "Quelle est la durée de vie d'une chaudière à condensation ?", a: "Entre 15 et 20 ans avec entretien annuel. C'est pourquoi nos contrats d'entretien sont conçus pour protéger votre investissement et maintenir les garanties constructeur actives." },
]

function useCounter(target: number, inView: boolean) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!inView) return
    let v = 0
    const step = target / 60
    const t = setInterval(() => { v += step; if (v >= target) { setCount(target); clearInterval(t) } else setCount(Math.floor(v)) }, 25)
    return () => clearInterval(t)
  }, [inView, target])
  return count
}

function StatCard({ stat, index }: { stat: typeof STATS[0]; index: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const count = useCounter(stat.value, inView)
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      style={{ background: C.bgCard, border: `1px solid ${C.borderLight}`, padding: "2rem", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, width: 4, height: "100%", background: C.accent }} />
      <stat.icon size={26} style={{ color: C.accent, marginBottom: "1rem", display: "block" }} />
      <div style={{ fontFamily: font.display, fontSize: "2.6rem", fontWeight: 700, color: C.text, lineHeight: 1 }}>
        {count.toLocaleString("fr-FR")}<span style={{ color: C.accent, fontSize: "1.6rem" }}>{stat.suffix}</span>
      </div>
      <p style={{ fontFamily: font.body, fontSize: "0.82rem", color: C.textMuted, marginTop: "0.4rem" }}>{stat.label}</p>
    </motion.div>
  )
}

function ServiceCard({ s, index }: { s: typeof SERVICES[0]; index: number }) {
  const [hov, setHov] = useState(false)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: hov ? C.bgCard : "transparent", border: `1px solid ${hov ? C.accent : C.borderLight}`, padding: "2rem", cursor: "pointer", transition: "all 0.3s", position: "relative" }}>
      {s.tag && <span style={{ position: "absolute", top: "1rem", right: "1rem", background: C.accent, color: C.white, fontFamily: font.body, fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", padding: "0.2rem 0.5rem" }}>{s.tag}</span>}
      <motion.div animate={{ color: hov ? C.accent : C.textMuted }} style={{ marginBottom: "1rem", transition: "color 0.3s" }}>
        <s.icon size={30} />
      </motion.div>
      <h3 style={{ fontFamily: font.display, fontSize: "1.35rem", fontWeight: 700, color: C.text, textTransform: "uppercase", letterSpacing: "0.04em", margin: "0 0 0.75rem" }}>{s.title}</h3>
      <p style={{ fontFamily: font.body, fontSize: "0.85rem", color: C.textMuted, lineHeight: 1.75, margin: "0 0 1.2rem" }}>{s.desc}</p>
      <div style={{ fontFamily: font.display, fontSize: "1.1rem", fontWeight: 700, color: C.accent }}>{s.price}</div>
      <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", marginTop: "0.8rem", color: hov ? C.accent : C.textMuted, fontSize: "0.78rem", fontWeight: 500, transition: "color 0.3s" }}>
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
      transition={{ duration: 0.6, delay: i * 0.12 }}
      style={{ position: "relative", paddingTop: "1.5rem" }}>
      <div style={{ position: "absolute", top: 0, left: 0, width: 40, height: 3, background: C.accent }} />
      <div style={{ fontFamily: font.display, fontSize: "3.5rem", fontWeight: 800, color: `${C.accent}20`, lineHeight: 1, marginBottom: "0.5rem" }}>{p.num}</div>
      <h3 style={{ fontFamily: font.display, fontSize: "1.2rem", fontWeight: 700, color: C.text, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "0.75rem" }}>{p.title}</h3>
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

export default function Impact212Page() {
  const [navOpen, setNavOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeFaq, setActiveFaq] = useState<number | null>(null)
  const [formSent, setFormSent] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 130])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

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
  const h2style: React.CSSProperties = { fontFamily: font.display, fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 700, color: C.text, textTransform: "uppercase", letterSpacing: "0.02em", lineHeight: 1.1, margin: "0 0 1.5rem" }

  return (
    <div style={{ background: C.bg, color: C.text, minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=Inter:wght@300;400;500;600&display=swap');
        ::selection { background: ${C.accent}40; color: ${C.white}; }
        input, select, textarea, button { font-family: inherit; }
        select option { background: ${C.bgCard}; }
        @media(min-width:900px) { .nav-lnk { display: block !important; } }
      `}</style>

      {/* NAV */}
      <motion.nav animate={{ background: scrolled ? "rgba(10,12,16,0.96)" : "transparent" }}
        transition={{ duration: 0.3 }}
        style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, borderBottom: scrolled ? `1px solid ${C.borderLight}` : "none", backdropFilter: scrolled ? "blur(16px)" : "none" }}>
        <div style={{ ...S, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.2rem 2rem" }}>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ width: 36, height: 36, background: C.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Thermometer size={20} color={C.white} />
            </div>
            <div>
              <div style={{ fontFamily: font.display, fontSize: "1.2rem", fontWeight: 700, color: C.text, letterSpacing: "0.06em", textTransform: "uppercase" }}>Therma Pro</div>
              <div style={{ fontFamily: font.body, fontSize: "0.58rem", color: C.textMuted, letterSpacing: "0.14em", textTransform: "uppercase" }}>Chauffage · Climatisation · PAC</div>
            </div>
          </motion.div>
          <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
            {["Services", "Réalisations", "Certifications", "Contact"].map((l, i) => (
              <motion.a key={l} href={`#${l.toLowerCase().replace(/[éè]/g, "e")}`}
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i + 0.2 }}
                className="nav-lnk"
                style={{ fontFamily: font.body, fontSize: "0.8rem", fontWeight: 500, color: C.textMuted, textDecoration: "none", letterSpacing: "0.04em", display: "none" }}
                whileHover={{ color: C.text }}>{l}</motion.a>
            ))}
            <motion.a href="tel:0800123456" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: C.accent, color: C.white, fontFamily: font.body, fontSize: "0.8rem", fontWeight: 600, padding: "0.6rem 1.2rem", textDecoration: "none" }}
              whileHover={{ background: C.accentLight }}>
              <Phone size={14} /> 0800 123 456
            </motion.a>
            <motion.button onClick={() => setNavOpen(!navOpen)}
              style={{ background: "none", border: "none", color: C.text, cursor: "pointer", display: "flex" }}>
              {navOpen ? <X size={22} /> : <Menu size={22} />}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {navOpen && (
          <motion.div key="mob" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, zIndex: 99, background: "rgba(10,12,16,0.97)", backdropFilter: "blur(20px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "2rem" }}>
            {["Services", "Réalisations", "Certifications", "Contact"].map((l, i) => (
              <motion.a key={l} href={`#${l.toLowerCase()}`} onClick={() => setNavOpen(false)}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                style={{ fontFamily: font.display, fontSize: "2.5rem", fontWeight: 700, color: C.text, textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.06em" }}
                whileHover={{ color: C.accent }}>{l}</motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO */}
      <section ref={heroRef} style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
        <motion.div style={{ position: "absolute", inset: 0, y: heroY }}>
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(150deg, #0a0c10 0%, #1c0802 55%, #0a0c10 100%)` }} />
          <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(ellipse 60% 50% at 70% 40%, ${C.accent}16 0%, transparent 70%)` }} />
          {[...Array(22)].map((_, i) => (
            <motion.div key={i}
              style={{ position: "absolute", left: `${4 + i * 4.2}%`, bottom: 0, width: 2, height: `${40 + ((i * 37) % 55)}px`, background: C.accent, opacity: 0.15 + (i % 5) * 0.05, transformOrigin: "bottom" }}
              animate={{ scaleY: [0.3, 1, 0.3], opacity: [0.1, 0.4, 0.1] }}
              transition={{ duration: 1.2 + i * 0.12, repeat: Infinity, delay: i * 0.07, ease: "easeInOut" }} />
          ))}
        </motion.div>
        <motion.div style={{ position: "relative", zIndex: 2, ...S, opacity: heroOpacity }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
            <span style={eyebrow}>Spécialiste RGE certifié · Lyon &amp; Rhône-Alpes · Depuis 2009</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.35 }}
            style={{ fontFamily: font.display, fontSize: "clamp(3.5rem,9vw,8rem)", fontWeight: 800, color: C.text, textTransform: "uppercase", lineHeight: 0.9, letterSpacing: "-0.02em", margin: "0 0 1.5rem" }}>
            Expert<br /><span style={{ color: C.accent }}>Chauffage</span><br />&amp; Climatisation
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}
            style={{ fontFamily: font.body, fontSize: "1.05rem", color: C.textMuted, maxWidth: 500, lineHeight: 1.8, marginBottom: "2.5rem", fontWeight: 300 }}>
            Installation, remplacement et entretien de chaudières, pompes à chaleur et climatisations. Aides financières gérées de A à Z. Devis gratuit sous 48h.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.62 }}
            style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <motion.a href="#contact" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              style={{ display: "flex", alignItems: "center", gap: "0.6rem", background: C.accent, color: C.white, fontFamily: font.display, fontSize: "1rem", fontWeight: 700, padding: "1rem 2rem", textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Devis Gratuit <ArrowRight size={18} />
            </motion.a>
            <motion.a href="tel:0800123456" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              style={{ display: "flex", alignItems: "center", gap: "0.6rem", border: `1px solid ${C.borderLight}`, color: C.text, fontFamily: font.display, fontSize: "1rem", fontWeight: 600, padding: "1rem 2rem", textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              <Phone size={16} /> Urgence 24h/24
            </motion.a>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
            style={{ display: "flex", gap: "2.5rem", marginTop: "3rem", flexWrap: "wrap" }}>
            {[{ v: "< 2h", l: "Délai dépannage" }, { v: "Gratuit", l: "Diagnostic à domicile" }, { v: "10 000 €", l: "Aides max MaPrimeRénov'" }].map(({ v, l }) => (
              <div key={l}>
                <div style={{ fontFamily: font.display, fontSize: "1.6rem", fontWeight: 700, color: C.accent }}>{v}</div>
                <div style={{ fontFamily: font.body, fontSize: "0.72rem", color: C.textMuted, letterSpacing: "0.05em" }}>{l}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
        <div style={{ position: "absolute", bottom: "2.5rem", left: "50%", transform: "translateX(-50%)", zIndex: 3 }}>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}
            style={{ fontFamily: font.body, fontSize: "0.65rem", color: C.textMuted, letterSpacing: "0.2em", textTransform: "uppercase", textAlign: "center" }}>
            Défiler
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ padding: "5rem 0", background: C.bgAlt }}>
        <div style={S}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "1.5rem" }}>
            {STATS.map((s, i) => <StatCard key={i} stat={s} index={i} />)}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" style={{ padding: "8rem 0" }}>
        <div style={S}>
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <span style={eyebrow}>Nos prestations</span>
            <h2 style={h2style}>Solutions de chauffage<br /><span style={{ color: C.accent }}>complètes &amp; certifiées</span></h2>
          </motion.div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "1.5rem", marginTop: "3rem" }}>
            {SERVICES.map((s, i) => <ServiceCard key={i} s={s} index={i} />)}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section style={{ padding: "8rem 0", background: C.bgAlt }}>
        <div style={S}>
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <span style={eyebrow}>Notre méthode</span>
            <h2 style={h2style}>Un projet réussi en<br /><span style={{ color: C.accent }}>4 étapes claires</span></h2>
          </motion.div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "3rem", marginTop: "4rem" }}>
            {PROCESS.map((p, i) => <ProcessStep key={i} p={p} i={i} />)}
          </div>
        </div>
      </section>

      {/* CERTIFICATIONS */}
      <section id="certifications" style={{ padding: "7rem 0" }}>
        <div style={S}>
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <span style={eyebrow}>Agréments &amp; certifications</span>
            <h2 style={h2style}>Reconnus &amp; agréés pour<br /><span style={{ color: C.accent }}>toutes les aides d'état</span></h2>
          </motion.div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "1.5rem", marginTop: "3rem" }}>
            {CERTIFICATIONS.map((c, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                style={{ display: "flex", alignItems: "flex-start", gap: "1rem", padding: "1.5rem", background: C.bgCard, border: `1px solid ${C.borderLight}` }}>
                <CheckCircle size={22} style={{ color: C.accent, flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div style={{ fontFamily: font.display, fontSize: "1rem", fontWeight: 700, color: C.text, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.3rem" }}>{c.name}</div>
                  <div style={{ fontFamily: font.body, fontSize: "0.8rem", color: C.textMuted }}>{c.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
            style={{ marginTop: "3rem", padding: "2rem", background: `${C.accent}10`, border: `1px solid ${C.accent}28`, display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>
            <Zap size={32} style={{ color: C.accent, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: font.display, fontSize: "1.2rem", fontWeight: 700, color: C.text, textTransform: "uppercase", letterSpacing: "0.04em" }}>Jusqu'à 10 000 € d'aides avec MaPrimeRénov'</div>
              <div style={{ fontFamily: font.body, fontSize: "0.85rem", color: C.textMuted, marginTop: "0.3rem" }}>Nous constituons et déposons l'intégralité de vos dossiers, sans frais supplémentaires.</div>
            </div>
            <motion.a href="#contact" whileHover={{ scale: 1.03 }} style={{ background: C.accent, color: C.white, fontFamily: font.display, fontWeight: 700, fontSize: "0.9rem", padding: "0.8rem 1.6rem", textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>
              Simuler mes aides
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="realisations" style={{ padding: "8rem 0", background: C.bgAlt }}>
        <div style={S}>
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <span style={eyebrow}>Avis clients vérifiés</span>
            <h2 style={h2style}><span style={{ color: C.accent }}>+3 200</span> chantiers<br />réalisés avec succès</h2>
          </motion.div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "1.5rem", marginTop: "3rem" }}>
            {TESTIMONIALS.map((t, i) => <TestiCard key={i} t={t} i={i} />)}
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", marginTop: "3rem" }}>
            {[...Array(5)].map((_, i) => <Star key={i} size={22} fill={C.accent} color={C.accent} />)}
            <span style={{ fontFamily: font.body, fontSize: "1rem", fontWeight: 600, color: C.text }}>4,9 / 5 sur Google</span>
            <span style={{ fontFamily: font.body, fontSize: "0.8rem", color: C.textMuted }}>(847 avis)</span>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "8rem 0" }}>
        <div style={{ ...S, display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "6rem", alignItems: "start" }}>
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <span style={eyebrow}>Questions fréquentes</span>
            <h2 style={h2style}>Tout ce que vous<br /><span style={{ color: C.accent }}>devez savoir</span></h2>
            <p style={{ fontFamily: font.body, fontSize: "0.875rem", color: C.textMuted, lineHeight: 1.8, marginTop: "1rem" }}>
              Vous ne trouvez pas votre réponse ? Appelez-nous, disponible du lundi au samedi de 8h à 19h.
            </p>
            <motion.a href="tel:0800123456" whileHover={{ scale: 1.02 }} style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", marginTop: "2rem", background: C.accent, color: C.white, fontFamily: font.display, fontWeight: 700, fontSize: "0.9rem", padding: "0.8rem 1.6rem", textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              <Phone size={16} /> 0800 123 456 — Gratuit
            </motion.a>
            <div style={{ marginTop: "3rem", padding: "1.5rem", background: C.bgCard, border: `1px solid ${C.borderLight}` }}>
              <div style={{ fontFamily: font.display, fontSize: "0.9rem", fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem" }}>Horaires d'ouverture</div>
              {[["Lun – Ven", "8h00 – 19h00"], ["Samedi", "9h00 – 17h00"], ["Urgences", "24h/24 – 7j/7"]].map(([day, hours]) => (
                <div key={day} style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${C.borderLight}`, padding: "0.6rem 0", fontFamily: font.body, fontSize: "0.82rem" }}>
                  <span style={{ color: C.textMuted }}>{day}</span>
                  <span style={{ color: day === "Urgences" ? C.accent : C.text, fontWeight: 500 }}>{hours}</span>
                </div>
              ))}
            </div>
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
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} style={{ overflow: "hidden" }}>
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
      <section id="contact" style={{ padding: "8rem 0", background: C.bgAlt }}>
        <div style={S}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "start" }}>
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <span style={eyebrow}>Devis gratuit</span>
              <h2 style={h2style}>Votre diagnostic<br /><span style={{ color: C.accent }}>offert à domicile</span></h2>
              <p style={{ fontFamily: font.body, fontSize: "0.875rem", color: C.textMuted, lineHeight: 1.8, marginTop: "1rem", marginBottom: "2.5rem" }}>
                Un technicien qualifié se déplace gratuitement chez vous, évalue vos besoins et vous remet un devis détaillé sans engagement.
              </p>
              {[{ Icon: Phone, label: "0800 123 456", sub: "Appel gratuit, 7j/7" }, { Icon: Mail, label: "contact@thermapro.fr", sub: "Réponse sous 24h" }, { Icon: MapPin, label: "Lyon & Rhône-Alpes", sub: "Rayon 60 km autour de Lyon" }].map(({ Icon, label, sub }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                  <div style={{ width: 44, height: 44, background: `${C.accent}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={18} color={C.accent} />
                  </div>
                  <div>
                    <div style={{ fontFamily: font.body, fontSize: "0.9rem", fontWeight: 600, color: C.text }}>{label}</div>
                    <div style={{ fontFamily: font.body, fontSize: "0.75rem", color: C.textMuted }}>{sub}</div>
                  </div>
                </div>
              ))}
              <div style={{ marginTop: "2rem", padding: "1.2rem 1.5rem", background: C.bgCard, border: `1px solid ${C.border}` }}>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <TrendingUp size={18} color={C.accent} />
                  <span style={{ fontFamily: font.body, fontSize: "0.82rem", color: C.text, fontWeight: 500 }}>
                    Éligible MaPrimeRénov' ? Nous le vérifions gratuitement lors du diagnostic.
                  </span>
                </div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.15 }}>
              <AnimatePresence mode="wait">
                {formSent ? (
                  <motion.div key="ok" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    style={{ padding: "3rem", background: `${C.accent}10`, border: `1px solid ${C.accent}30`, textAlign: "center" }}>
                    <CheckCircle size={52} color={C.accent} style={{ marginBottom: "1.5rem" }} />
                    <h3 style={{ fontFamily: font.display, fontSize: "1.6rem", fontWeight: 700, color: C.text, textTransform: "uppercase", marginBottom: "0.8rem" }}>Demande reçue !</h3>
                    <p style={{ fontFamily: font.body, color: C.textMuted, fontSize: "0.9rem", lineHeight: 1.75 }}>Un technicien Therma Pro vous contactera dans la journée pour organiser votre visite gratuite.</p>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={handleSubmit} style={{ background: C.bgCard, padding: "2.5rem", border: `1px solid ${C.borderLight}` }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                      {[{ n: "nom", l: "Nom complet", t: "text" }, { n: "tel", l: "Téléphone", t: "tel" }].map(({ n, l, t }) => (
                        <div key={n}>
                          <label style={{ fontFamily: font.body, fontSize: "0.68rem", fontWeight: 600, color: C.textMuted, letterSpacing: "0.14em", textTransform: "uppercase", display: "block", marginBottom: "0.5rem" }}>{l}</label>
                          <input required type={t} style={{ width: "100%", background: "transparent", border: `1px solid ${C.borderLight}`, color: C.text, fontFamily: font.body, fontSize: "0.9rem", padding: "0.75rem 1rem", outline: "none", transition: "border-color 0.2s" }}
                            onFocus={e => (e.target.style.borderColor = C.accent)} onBlur={e => (e.target.style.borderColor = C.borderLight)} />
                        </div>
                      ))}
                    </div>
                    {[{ n: "email", l: "Email", t: "email" }].map(({ n, l, t }) => (
                      <div key={n} style={{ marginTop: "1.5rem" }}>
                        <label style={{ fontFamily: font.body, fontSize: "0.68rem", fontWeight: 600, color: C.textMuted, letterSpacing: "0.14em", textTransform: "uppercase", display: "block", marginBottom: "0.5rem" }}>{l}</label>
                        <input required type={t} style={{ width: "100%", background: "transparent", border: `1px solid ${C.borderLight}`, color: C.text, fontFamily: font.body, fontSize: "0.9rem", padding: "0.75rem 1rem", outline: "none", transition: "border-color 0.2s" }}
                          onFocus={e => (e.target.style.borderColor = C.accent)} onBlur={e => (e.target.style.borderColor = C.borderLight)} />
                      </div>
                    ))}
                    <div style={{ marginTop: "1.5rem" }}>
                      <label style={{ fontFamily: font.body, fontSize: "0.68rem", fontWeight: 600, color: C.textMuted, letterSpacing: "0.14em", textTransform: "uppercase", display: "block", marginBottom: "0.5rem" }}>Type de prestation</label>
                      <select required style={{ width: "100%", background: C.bgCard, border: `1px solid ${C.borderLight}`, color: C.text, fontFamily: font.body, fontSize: "0.9rem", padding: "0.75rem 1rem", outline: "none" }}>
                        <option value="">Sélectionnez...</option>
                        {["Installation chaudière", "Pompe à chaleur", "Climatisation réversible", "Entretien annuel", "Dépannage urgence", "Plancher chauffant"].map(o => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                    <div style={{ marginTop: "1.5rem" }}>
                      <label style={{ fontFamily: font.body, fontSize: "0.68rem", fontWeight: 600, color: C.textMuted, letterSpacing: "0.14em", textTransform: "uppercase", display: "block", marginBottom: "0.5rem" }}>Message (optionnel)</label>
                      <textarea rows={3} style={{ width: "100%", background: "transparent", border: `1px solid ${C.borderLight}`, color: C.text, fontFamily: font.body, fontSize: "0.9rem", padding: "0.75rem 1rem", outline: "none", resize: "vertical", transition: "border-color 0.2s" }}
                        onFocus={e => (e.target.style.borderColor = C.accent)} onBlur={e => (e.target.style.borderColor = C.borderLight)} />
                    </div>
                    <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      disabled={formLoading}
                      style={{ width: "100%", background: C.accent, color: C.white, border: "none", fontFamily: font.display, fontSize: "1rem", fontWeight: 700, padding: "1.1rem", cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.1em", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.8rem", marginTop: "1.5rem" }}>
                      {formLoading ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} style={{ width: 20, height: 20, border: `2px solid ${C.white}40`, borderTopColor: C.white, borderRadius: "50%" }} /> : <><ArrowRight size={18} /> Demander mon diagnostic gratuit</>}
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "4rem 0", borderTop: `1px solid ${C.borderLight}` }}>
        <div style={{ ...S, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "3rem" }}>
          <div style={{ maxWidth: 260 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
              <div style={{ width: 32, height: 32, background: C.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Thermometer size={18} color={C.white} />
              </div>
              <span style={{ fontFamily: font.display, fontSize: "1.1rem", fontWeight: 700, color: C.text, textTransform: "uppercase", letterSpacing: "0.06em" }}>Therma Pro</span>
            </div>
            <p style={{ fontFamily: font.body, fontSize: "0.8rem", color: C.textMuted, lineHeight: 1.75 }}>Spécialiste chauffage, climatisation et pompes à chaleur depuis 2009. RGE certifié, agréé MaPrimeRénov'.</p>
            <div style={{ fontFamily: font.body, fontSize: "0.72rem", color: C.textMuted, marginTop: "1rem" }}>SIRET 812 345 678 00012</div>
          </div>
          {[["Services", ["Chaudières gaz", "Pompes à chaleur", "Climatisation", "Plancher chauffant", "Entretien annuel"]], ["Zones d'intervention", ["Lyon & Métropole", "Villeurbanne", "Bron • Décines", "Vénissieux • Caluire", "Isère & Ain"]]].map(([title, links]) => (
            <div key={title as string}>
              <div style={{ fontFamily: font.body, fontSize: "0.65rem", fontWeight: 600, color: C.textMuted, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "1.2rem" }}>{title as string}</div>
              {(links as string[]).map(l => (
                <div key={l} style={{ fontFamily: font.body, fontSize: "0.82rem", color: C.textMuted, marginBottom: "0.55rem" }}>{l}</div>
              ))}
            </div>
          ))}
          <div>
            <div style={{ fontFamily: font.body, fontSize: "0.65rem", fontWeight: 600, color: C.textMuted, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "1.2rem" }}>Contact</div>
            <motion.a href="tel:0800123456" whileHover={{ scale: 1.03 }} style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: C.accent, color: C.white, fontFamily: font.display, fontWeight: 700, fontSize: "0.9rem", padding: "0.75rem 1.2rem", textDecoration: "none", textTransform: "uppercase", marginBottom: "1rem" }}>
              <Phone size={15} /> 0800 123 456
            </motion.a>
            <div style={{ fontFamily: font.body, fontSize: "0.75rem", color: C.textMuted }}>contact@thermapro.fr</div>
            <div style={{ fontFamily: font.body, fontSize: "0.75rem", color: C.textMuted, marginTop: "0.3rem" }}>Lun–Sam : 8h–19h</div>
            <div style={{ fontFamily: font.body, fontSize: "0.72rem", color: C.accent, fontWeight: 500, marginTop: "0.3rem" }}>Urgences 24h/24 – 7j/7</div>
          </div>
        </div>
        <div style={{ ...S, borderTop: `1px solid ${C.borderLight}`, marginTop: "3rem", paddingTop: "1.5rem", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <span style={{ fontFamily: font.body, fontSize: "0.72rem", color: C.textMuted }}>© 2026 Therma Pro. Tous droits réservés.</span>
          <span style={{ fontFamily: font.body, fontSize: "0.72rem", color: C.textMuted }}>Mentions légales · Politique de confidentialité · CGV</span>
        </div>
      </footer>
    </div>
  )
}
