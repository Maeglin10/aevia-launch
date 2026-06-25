"use client"

import React, { useRef, useState } from "react"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { Phone, Mail, MapPin, Clock, Star, CheckCircle, ArrowRight, Zap } from "lucide-react"

const C = {
  bg: "#f8f6f3", bgSection: "#ede9e3", bgDark: "#130f0a",
  text: "#130f0a", textMuted: "#7a6e60",
  accent: "#2d6b8a", accentDark: "#1e4d66", accentLight: "#d0e8f5",
  warm: "#c4783c", warmLight: "#fdf0e6",
  white: "#ffffff", border: "#ddd5c8",
  shadow: "0 2px 14px rgba(19,15,10,0.07)", shadowLg: "0 16px 48px rgba(45,107,138,0.15)",
}
const FONT = "'Cormorant Garamond', Georgia, serif"
const FONT_BODY = "'Source Sans 3', system-ui, sans-serif"

const STATS = [{ value: "12 ans", label: "D'ostéopathie" }, { value: "800+", label: "Patients par an" }, { value: "1ère séance", label: "En 48h" }, { value: "95%", label: "Patients soulagés" }]

const MOTIFS = [
  { titre: "Douleurs du dos & rachis", desc: "Lombalgie, dorsalgie, cervicalgie aiguë ou chronique. Traitement des blocages vertébraux, des tensions musculaires et des douleurs liées à la posture.", tag: "Dos" },
  { titre: "Maux de tête & migraines", desc: "Céphalées de tension, migraines, vertiges. L'ostéopathie agit sur les tensions cervicales et crâniennes qui en sont souvent la cause.", tag: "Tête" },
  { titre: "Troubles articulaires", desc: "Épaule, genou, cheville, poignet. Entorses, tendinites, blocages articulaires — prise en charge globale et non invasive.", tag: "Articulations" },
  { titre: "Nourrissons & enfants", desc: "Torticolis congénital, plagiocéphalie, coliques, troubles du sommeil, difficultés d'allaitement. Techniques très douces adaptées aux bébés.", tag: "Pédiatrie" },
  { titre: "Grossesse & post-partum", desc: "Douleurs du bassin, sciatique, lombalgies en cours de grossesse. Rééquilibrage pelvien et périnéal après l'accouchement.", tag: "Femmes" },
  { titre: "Ostéopathie du sportif", desc: "Prévention des blessures, récupération après effort, amélioration des performances. Suivi régulier pour amateurs et sportifs de haut niveau.", tag: "Sport" },
]

const APPROCHE = [
  "Bilan postural et fonctionnel complet à chaque séance (50 min)",
  "Techniques mixtes : structurelles, fonctionnelles, tissulaires et viscérales",
  "Conseils posturaux et exercices d'automaintien remis après chaque séance",
  "Collaboration avec votre médecin, kiné et autres professionnels de santé",
]

const AVIS = [
  { texte: "Lombalgie chronique depuis 8 ans, invalidante certains jours. Après 3 séances d'ostéo, je peux travailler sans douleur. C'est la première fois depuis des années. Je m'en veux de ne pas être venu plus tôt.", auteur: "Marc B.", detail: "Lombalgie chronique · 3 séances" },
  { texte: "Mon bébé de 6 semaines pleurait constamment, refusait de tourner la tête à droite. Après une seule séance, il s'est endormi dans mes bras. Une magie que je ne comprends pas mais qui marche.", auteur: "Amélie F.", detail: "Nourrisson · Torticolis" },
  { texte: "Migraines hebdomadaires depuis la fac. Un ami m'a poussée à essayer. 6 séances sur 3 mois et je n'ai eu qu'une seule migraine depuis. Je suis bluffée.", auteur: "Laura M.", detail: "Migraines · Suivi 3 mois" },
]

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  return <motion.div ref={ref} initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}>{children}</motion.div>
}

export default function CabinetOsteopathiePage() {
  const heroRef = useRef<HTMLElement>(null)
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 170])
  const heroTextY = useTransform(scrollYProgress, [0, 1], [0, -65])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0])
  React.useEffect(() => { const h = () => setScrolled(window.scrollY > 50); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h) }, [])

  return (
    <div style={{ background: C.bg, fontFamily: FONT_BODY, overflowX: "hidden" }}>
      <style jsx global>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=Source+Sans+3:wght@300;400;600;700&display=swap');`}</style>

      <motion.nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 72, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 64px", background: scrolled ? "rgba(248,246,243,0.97)" : "transparent", backdropFilter: scrolled ? "blur(12px)" : "none", borderBottom: scrolled ? `1px solid ${C.border}` : "none", transition: "all 0.4s ease" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Zap size={18} color={scrolled ? C.accent : "#fff"} />
          <span style={{ fontFamily: FONT, fontSize: 21, color: scrolled ? C.text : "#fff" }}>Cabinet <em>Équilibre</em></span>
        </div>
        <div id="mb233-nav" style={{ display: "flex", gap: 32, alignItems: "center" }}>      {["Motifs", "Approche", "Avis", "Contact"].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{ color: scrolled ? C.textMuted : "rgba(255,255,255,0.8)", fontSize: 14, fontWeight: 500, textDecoration: "none" }}>{l}</a>
          ))}
          <motion.a href="tel:+33478000000" style={{ background: C.accent, color: C.white, borderRadius: 6, padding: "9px 22px", fontSize: 14, fontWeight: 600, textDecoration: "none" }} whileHover={{ background: C.accentDark }}>Prendre RDV</motion.a>
      </div>
        <button
          className="mb233-burger"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
          style={{ display: "none", flexDirection: "column", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 4 }}
        >
          <span style={{ display: "block", width: 24, height: 1.5, background: "#fff", transition: "all 0.3s", transform: mobileOpen ? "rotate(45deg) translate(4.5px, 4.5px)" : "none" }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: "#fff", transition: "all 0.3s", opacity: mobileOpen ? 0 : 1 }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: "#fff", transition: "all 0.3s", transform: mobileOpen ? "rotate(-45deg) translate(4.5px, -4.5px)" : "none" }} />
        </button>
      </motion.nav>
      {mobileOpen && (
        <div style={{ position: "fixed", top: 72, left: 0, right: 0, zIndex: 99, background: "rgba(255,255,255,0.98)", borderBottom: "1px solid #e5e5e5", padding: "24px 32px", display: "flex", flexDirection: "column", gap: 20, backdropFilter: "blur(12px)" }}>
          {["Motifs", "Approche", "Avis", "Contact"].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{ color: scrolled ? C.textMuted : "rgba(255,255,255,0.8)", fontSize: 14, fontWeight: 500, textDecoration: "none" }}>{l}</a>
          ))}
          <motion.a href="tel:+33478000000" style={{ background: C.accent, color: C.white, borderRadius: 6, padding: "9px 22px", fontSize: 14, fontWeight: 600, textDecoration: "none" }} whileHover={{ background: C.accentDark }}>Prendre RDV</motion.a>
        </div>
      )}
      <style>{`@media (max-width: 900px) { #mb233-nav { display: none !important; } .mb233-burger { display: flex !important; } }`}</style>

      <section id="hero" ref={heroRef} style={{ height: "115vh", minHeight: "900px", position: "relative", display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
        <motion.div style={{ y: heroY, position: "absolute", inset: 0 }}>
          <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920&q=80" alt="Cabinet ostéopathie Lyon" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </motion.div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(6,5,3,0.93) 0%, rgba(6,5,3,0.40) 45%, rgba(6,5,3,0.08) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to right, ${C.accent}16 0%, transparent 55%)` }} />
        <motion.div style={{ position: "relative", zIndex: 1, padding: "0 80px 90px", maxWidth: 760, y: heroTextY, opacity: heroOpacity }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 28, background: "rgba(45,107,138,0.15)", border: "1px solid rgba(45,107,138,0.30)", borderRadius: 20, padding: "7px 18px" }}>
            <span style={{ color: "#7ec8e0", fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>Ostéopathe D.O. · Lyon 6e</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.9 }}
            style={{ fontFamily: FONT, fontSize: "clamp(40px, 5vw, 68px)", color: "#fff", lineHeight: 1.1, marginBottom: 24 }}>
            Retrouver l'équilibre<br /><em style={{ color: "#7ec8e0" }}>naturellement.</em>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}
            style={{ fontSize: 17, color: "rgba(255,255,255,0.70)", lineHeight: 1.75, marginBottom: 40, maxWidth: 510 }}>
            Lucas Martin, ostéopathe D.O. à Lyon. Prise en charge des douleurs du dos, articulations, migraines, nourrissons et sportifs. RDV disponible sous 48h.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }} style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <motion.a href="tel:+33478000000" style={{ background: C.accent, color: C.white, borderRadius: 6, padding: "15px 32px", fontWeight: 600, fontSize: 15, textDecoration: "none", display: "flex", alignItems: "center", gap: 8, boxShadow: `0 8px 32px ${C.accent}44` }} whileHover={{ scale: 1.03 }}>
              Prendre RDV <ArrowRight size={16} />
            </motion.a>
            <motion.a href="#motifs" style={{ background: "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(255,255,255,0.22)", borderRadius: 6, padding: "13px 28px", fontWeight: 500, fontSize: 15, textDecoration: "none" }} whileHover={{ background: "rgba(255,255,255,0.14)" }}>
              Motifs de consultation
            </motion.a>
          </motion.div>
        </motion.div>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", zIndex: 2 }}>
          <div style={{ width: 24, height: 36, border: "2px solid rgba(255,255,255,0.30)", borderRadius: 12, display: "flex", justifyContent: "center", paddingTop: 6 }}>
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ width: 6, height: 6, borderRadius: "50%", background: "#7ec8e0" }} />
          </div>
        </motion.div>
      </section>

      <section style={{ background: C.bgDark, padding: "0 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", maxWidth: 1100, margin: "0 auto" }}>
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div style={{ padding: "28px 0", textAlign: "center", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.07)" : "none" }}>
                <div style={{ fontFamily: FONT, fontSize: 36, color: "#7ec8e0", lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.42)", marginTop: 6 }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="motifs" style={{ padding: "100px 80px", background: C.bg }}>
        <Reveal><div style={{ marginBottom: 56 }}>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>Motifs de consultation</span>
          <h2 style={{ fontFamily: FONT, fontSize: "clamp(30px, 4vw, 52px)", color: C.text, marginTop: 10, lineHeight: 1.15 }}>Tous les âges,<br /><em>toutes les douleurs.</em></h2>
        </div></Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 18, maxWidth: 1200, margin: "0 auto" }}>
          {MOTIFS.map((s, i) => (
            <Reveal key={s.titre} delay={i * 0.07}>
              <motion.div whileHover={{ y: -5, boxShadow: C.shadowLg }} style={{ background: C.white, borderRadius: 10, padding: "26px 24px", border: `1px solid ${C.border}`, boxShadow: C.shadow }}>
                <span style={{ background: C.accentLight, color: C.accent, borderRadius: 20, padding: "4px 12px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{s.tag}</span>
                <h3 style={{ fontFamily: FONT, fontSize: 20, color: C.text, margin: "14px 0 10px" }}>{s.titre}</h3>
                <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.7 }}>{s.desc}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="approche" style={{ padding: "100px 80px", background: C.bgSection }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <Reveal><img src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80" alt="Séance ostéopathie cabinet" style={{ width: "100%", borderRadius: 10, aspectRatio: "4/3", objectFit: "cover" }} /></Reveal>
          <Reveal delay={0.15}><div>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>Notre approche</span>
            <h2 style={{ fontFamily: FONT, fontSize: "clamp(26px, 3vw, 44px)", color: C.text, margin: "12px 0 28px", lineHeight: 1.2 }}>Une prise en charge<br /><em>globale et précise.</em></h2>
            {APPROCHE.map((e, i) => (
              <div key={i} style={{ display: "flex", gap: 12, marginBottom: 14 }}>
                <CheckCircle size={17} color={C.accent} style={{ flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.65 }}>{e}</span>
              </div>
            ))}
            <motion.a href="tel:+33478000000" style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 28, background: C.accent, color: C.white, borderRadius: 6, padding: "13px 28px", fontWeight: 600, fontSize: 15, textDecoration: "none" }} whileHover={{ background: C.accentDark, scale: 1.02 }}>
              Réserver une séance <ArrowRight size={16} />
            </motion.a>
          </div></Reveal>
        </div>
      </section>

      <section id="avis" style={{ padding: "100px 80px", background: C.bgDark }}>
        <Reveal><div style={{ textAlign: "center", marginBottom: 52 }}>
          <h2 style={{ fontFamily: FONT, fontSize: "clamp(28px, 3.5vw, 48px)", color: "#fff" }}>Ce que disent <em style={{ color: "#7ec8e0" }}>mes patients</em>.</h2>
        </div></Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 18, maxWidth: 1100, margin: "0 auto" }}>
          {AVIS.map((a, i) => (
            <Reveal key={a.auteur} delay={i * 0.1}>
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "26px 24px" }}>
                <div style={{ display: "flex", gap: 3, marginBottom: 12 }}>{[...Array(5)].map((_, j) => <Star key={j} size={13} fill="#7ec8e0" color="#7ec8e0" />)}</div>
                <p style={{ fontFamily: FONT, fontSize: 15, fontStyle: "italic", color: "rgba(255,255,255,0.78)", lineHeight: 1.7, marginBottom: 18 }}>"{a.texte}"</p>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 14 }}>
                  <div style={{ fontWeight: 600, color: "#fff", fontSize: 14 }}>{a.auteur}</div>
                  <div style={{ color: "#7ec8e0", fontSize: 12, marginTop: 4 }}>{a.detail}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="contact" style={{ padding: "100px 80px", background: C.warmLight, textAlign: "center" }}>
        <Reveal>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>Prise de RDV</span>
          <h2 style={{ fontFamily: FONT, fontSize: "clamp(28px, 4vw, 52px)", color: C.text, margin: "14px 0 16px" }}>Votre prochaine séance<br /><em>disponible sous 48h.</em></h2>
          <p style={{ fontSize: 16, color: C.textMuted, maxWidth: 420, margin: "0 auto 36px", lineHeight: 1.7 }}>Cabinet Lyon 6e. Tarif : 65€ la séance. Remboursement partiel selon votre mutuelle.</p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <motion.a href="tel:+33478000000" style={{ background: C.accent, color: C.white, borderRadius: 6, padding: "15px 36px", fontWeight: 600, fontSize: 16, textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }} whileHover={{ scale: 1.03 }}>
              <Phone size={18} /> 04 78 00 00 00
            </motion.a>
            <motion.a href="mailto:contact@cabinet-equilibre.fr" style={{ background: "transparent", color: C.text, border: `2px solid ${C.accent}`, borderRadius: 6, padding: "13px 32px", fontWeight: 600, fontSize: 16, textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }} whileHover={{ background: C.accent, color: C.white }}>
              <Mail size={18} /> Écrire
            </motion.a>
          </div>
        </Reveal>
      </section>

      <footer style={{ background: C.bgDark, padding: "44px 80px 22px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 28, marginBottom: 32 }}>
          <div>
            <div style={{ fontFamily: FONT, fontSize: 18, fontStyle: "italic", color: "#7ec8e0", marginBottom: 8 }}>Cabinet Équilibre</div>
            <p style={{ color: "rgba(255,255,255,0.30)", fontSize: 13, lineHeight: 1.6 }}>Lucas Martin · Ostéopathe D.O.<br />Diplômé IFSO · ADELI N°xxxxxxx</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[{ icon: <MapPin size={13} />, t: "Lyon 6e — Rue de la République" }, { icon: <Phone size={13} />, t: "04 78 00 00 00" }, { icon: <Clock size={13} />, t: "Lun–Sam 8h30–19h30" }].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 10, color: "rgba(255,255,255,0.38)", fontSize: 13 }}>
                <span style={{ color: "#7ec8e0" }}>{item.icon}</span>{item.t}
              </div>
            ))}
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 14, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <span style={{ color: "rgba(255,255,255,0.18)", fontSize: 12 }}>© 2026 Cabinet Équilibre · Lucas Martin — Site par Aevia WS</span>
          <a href="#contact" style={{ color: "rgba(255,255,255,0.18)", fontSize: 12, textDecoration: "none" }}>Mentions légales</a>
        </div>
      </footer>
    </div>
  )
}
