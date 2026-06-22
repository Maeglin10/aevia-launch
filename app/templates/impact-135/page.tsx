"use client"

import React, { useRef, useState } from "react"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { Music, Phone, Mail, MapPin, Star, ArrowRight, Disc, Headphones, Calendar } from "lucide-react"

const C = {
  bg: "#09090f",
  bgSection: "#0f0f1a",
  text: "#f0e8ff",
  textMuted: "#9d8fbf",
  accent: "#a855f7",
  accentDark: "#7c3aed",
  accentLight: "#f3e8ff",
  pink: "#ec4899",
  white: "#ffffff",
  border: "rgba(168,85,247,0.15)",
  shadow: "0 2px 14px rgba(168,85,247,0.12)",
  shadowLg: "0 16px 48px rgba(168,85,247,0.22)",
}
const FONT = "'Space Grotesk', system-ui, sans-serif"

const STATS = [
  { value: "10 ans", label: "Sur scène" },
  { value: "650+", label: "Événements" },
  { value: "4.9★", label: "Avis clients" },
  { value: "5h", label: "DJ set max" },
]

const PRESTATIONS = [
  { titre: "Mariage & cérémonie laïque", desc: "Cocktail, vin d'honneur, soirée dansante. Mix adapté à votre story et vos genres préférés. Scénographie lumière intégrée.", tag: "Mariage" },
  { titre: "Soirées privées & anniversaires", desc: "DJ set sur mesure pour 20 à 500 personnes. Consultation préalable pour caler la setlist à votre ambiance et vos musiques fétiches.", tag: "Privé" },
  { titre: "Événements d'entreprise", desc: "Afterwork, gala, lancement de produit, team building — ambiance professionnelle et dynamique. Références : LVMH, Adidas, BNP.", tag: "Corporate" },
  { titre: "Soirées clubs & festivals", desc: "Resident DJ expérimenté House / Afrobeat / Hip-Hop. Open-to-close ou b2b, gestion technique complète du set.", tag: "Club" },
  { titre: "Éclairage & scénographie", desc: "Pack lumière intégré : lyres, lasers, stroboscopes, LED programmables. Installation et régie complètes incluses en option.", tag: "Lumière" },
  { titre: "Sono, sono et encore sono", desc: "Prestation clé en main avec matériel pro (L-Acoustics, Pioneer). Aucun frais cachés, livraison et installation comprises.", tag: "Technique" },
]

const TEMOIGNAGES = [
  { texte: "Notre soirée de mariage a été parfaite. Il a lu la salle mieux que quiconque — passé des ballades au dancefloor sans transition maladroite. Tous nos invités lui ont demandé ses coordonnées.", auteur: "Camille & Thomas", detail: "Mariage, château de Mirabeau" },
  { texte: "On l'a booké pour notre gala annuel d'entreprise. 200 personnes, set de 4h impeccable. Professionnel du début à la fin, ponctuel, matériel de qualité. On renouvelle l'an prochain.", auteur: "Groupe Meridian", detail: "Corporate, Marseille Chanot" },
  { texte: "Resident de notre afterwork mensuel depuis 2 ans. Il connaît nos habitués, fait monter la sauce au bon moment. C'est LA pépite de la scène électro marseillaise.", auteur: "Bar Le Consul", detail: "Resident DJ, Marseille" },
]

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  )
}

export default function BasseCulturePage() {
  const heroRef = useRef<HTMLElement>(null)
  const [scrolled, setScrolled] = useState(false)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 170])
  const heroTextY = useTransform(scrollYProgress, [0, 1], [0, -65])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0])

  React.useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
  }, [])

  return (
    <div style={{ background: C.bg, fontFamily: FONT, overflowX: "hidden" }}>
      <style jsx global>{`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');`}</style>

      {/* Navbar */}
      <motion.nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 72,
        display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 64px",
        background: scrolled ? "rgba(9,9,15,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? `1px solid ${C.border}` : "none",
        transition: "all 0.4s ease",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Disc size={20} color={C.accent} />
          <span style={{ fontSize: 18, fontWeight: 700, color: C.text }}>Basse<span style={{ color: C.accent }}>Culture</span></span>
        </div>
        <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {["Prestations", "Réalisations", "Technique", "Contact"].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{ color: C.textMuted, fontSize: 14, fontWeight: 600, textDecoration: "none" }}>{l}</a>
          ))}
          <motion.a href="#contact" style={{ background: `linear-gradient(135deg, ${C.accent}, ${C.pink})`, color: C.white, borderRadius: 8, padding: "9px 22px", fontSize: 14, fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }} whileHover={{ scale: 1.05 }}>
            <Calendar size={14} /> Réserver
          </motion.a>
        </div>
      </motion.nav>

      {/* Hero */}
      <section id="hero" ref={heroRef} style={{ height: "115vh", minHeight: "900px", position: "relative", display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
        <motion.div style={{ y: heroY, position: "absolute", inset: 0 }}>
          <img src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1920&q=80" alt="DJ Basse Culture Marseille" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </motion.div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(5,2,15,0.95) 0%, rgba(5,2,15,0.50) 45%, rgba(5,2,15,0.10) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to right, ${C.accent}15 0%, transparent 60%)` }} />

        <motion.div style={{ position: "relative", zIndex: 1, padding: "0 80px 90px", maxWidth: 780, y: heroTextY, opacity: heroOpacity }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 28, background: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.30)", borderRadius: 20, padding: "7px 18px" }}>
            <Headphones size={12} color={C.accent} />
            <span style={{ color: C.accent, fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>DJ Événementiel · Marseille</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.9 }}
            style={{ fontSize: "clamp(42px, 5.5vw, 72px)", fontWeight: 700, color: "#fff", lineHeight: 1.05, marginBottom: 24 }}>
            La nuit commence<br /><span style={{ background: `linear-gradient(135deg, ${C.accent}, ${C.pink})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>quand la musique parle.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}
            style={{ fontSize: 17, color: "rgba(255,255,255,0.65)", lineHeight: 1.75, marginBottom: 40, maxWidth: 520 }}>
            DJ professionnel basé à Marseille. Mariages, soirées privées, corporate, clubs — 10 ans d'expérience sur scène, matériel haut de gamme et setlists sur mesure.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }} style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <motion.a href="#contact" style={{ background: `linear-gradient(135deg, ${C.accent}, ${C.pink})`, color: C.white, borderRadius: 8, padding: "15px 32px", fontWeight: 700, fontSize: 15, textDecoration: "none", display: "flex", alignItems: "center", gap: 8, boxShadow: `0 8px 32px ${C.accent}44` }} whileHover={{ scale: 1.03 }}>
              <Calendar size={18} /> Vérifier mes dispo
            </motion.a>
            <motion.a href="#prestations" style={{ background: "rgba(255,255,255,0.06)", color: "#fff", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 8, padding: "13px 28px", fontWeight: 600, fontSize: 15, textDecoration: "none" }} whileHover={{ background: "rgba(255,255,255,0.12)" }}>
              Voir les prestations
            </motion.a>
          </motion.div>
        </motion.div>

        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
          style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", zIndex: 2 }}>
          <div style={{ width: 24, height: 36, border: "2px solid rgba(168,85,247,0.40)", borderRadius: 12, display: "flex", justifyContent: "center", paddingTop: 6 }}>
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ width: 6, height: 6, borderRadius: "50%", background: C.accent }} />
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section id="services" style={{ background: "rgba(168,85,247,0.08)", borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: "0 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", maxWidth: 1100, margin: "0 auto" }}>
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div style={{ padding: "30px 0", textAlign: "center", borderRight: i < 3 ? `1px solid ${C.border}` : "none" }}>
                <div style={{ fontSize: 38, fontWeight: 700, background: `linear-gradient(135deg, ${C.accent}, ${C.pink})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 13, color: C.textMuted, marginTop: 6 }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Prestations */}
      <section id="prestations" style={{ padding: "110px 80px", background: C.bg }}>
        <Reveal>
          <div style={{ marginBottom: 60 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>Prestations</span>
            <h2 style={{ fontSize: "clamp(30px, 4vw, 52px)", fontWeight: 700, color: C.text, marginTop: 10, lineHeight: 1.1 }}>
              Chaque événement<br />a sa signature sonore.
            </h2>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20, maxWidth: 1200, margin: "0 auto" }}>
          {PRESTATIONS.map((p, i) => (
            <Reveal key={p.titre} delay={i * 0.07}>
              <motion.div whileHover={{ y: -5, boxShadow: C.shadowLg, borderColor: C.accent }} style={{ background: C.bgSection, borderRadius: 14, padding: "26px 24px", border: `1px solid ${C.border}` }}>
                <span style={{ background: "rgba(168,85,247,0.15)", color: C.accent, borderRadius: 20, padding: "4px 12px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{p.tag}</span>
                <h3 style={{ fontSize: 17, fontWeight: 600, color: C.text, margin: "14px 0 10px" }}>{p.titre}</h3>
                <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.7 }}>{p.desc}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Témoignages */}
      <section style={{ padding: "100px 80px", background: C.bgSection }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>Témoignages</span>
            <h2 style={{ fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 700, color: C.text, marginTop: 10 }}>Ils se souviennent <span style={{ color: C.accent }}>de cette nuit</span>.</h2>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20, maxWidth: 1100, margin: "0 auto" }}>
          {TEMOIGNAGES.map((t, i) => (
            <Reveal key={t.auteur} delay={i * 0.1}>
              <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 14, padding: "28px 24px" }}>
                <div style={{ display: "flex", gap: 3, marginBottom: 12 }}>{[...Array(5)].map((_, j) => <Star key={j} size={13} fill={C.accent} color={C.accent} />)}</div>
                <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.7, marginBottom: 18 }}>"{t.texte}"</p>
                <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14 }}>
                  <div style={{ fontWeight: 600, color: C.text, fontSize: 14 }}>{t.auteur}</div>
                  <div style={{ color: C.accent, fontSize: 12, marginTop: 4 }}>{t.detail}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="contact" style={{ padding: "100px 80px", background: C.bg, textAlign: "center" }}>
        <Reveal>
          <div style={{ display: "inline-block", background: "rgba(168,85,247,0.08)", border: `1px solid ${C.border}`, borderRadius: 24, padding: "60px 80px", maxWidth: 680 }}>
            <Music size={32} color={C.accent} style={{ marginBottom: 20 }} />
            <h2 style={{ fontSize: "clamp(28px, 4vw, 50px)", fontWeight: 700, color: C.text, marginBottom: 16 }}>Votre date est libre ?</h2>
            <p style={{ fontSize: 16, color: C.textMuted, marginBottom: 36, lineHeight: 1.7 }}>
              Vérifiez mes disponibilités et obtenez un devis personnalisé sous 24h. Mariages, soirées, corporate — je m'adapte à votre univers.
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <motion.a href="mailto:book@basseculture.fr" style={{ background: `linear-gradient(135deg, ${C.accent}, ${C.pink})`, color: C.white, borderRadius: 8, padding: "15px 36px", fontWeight: 700, fontSize: 16, textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }} whileHover={{ scale: 1.04 }}>
                <Mail size={18} /> Me contacter
              </motion.a>
              <motion.a href="tel:+33600000000" style={{ background: "transparent", color: C.text, border: `2px solid ${C.border}`, borderRadius: 8, padding: "13px 32px", fontWeight: 600, fontSize: 16, textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }} whileHover={{ borderColor: C.accent, color: C.accent }}>
                <Phone size={18} /> Appeler
              </motion.a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Footer */}
      <footer style={{ background: "#050508", borderTop: `1px solid ${C.border}`, padding: "48px 80px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 32, marginBottom: 36 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: C.accent, marginBottom: 8 }}>BasseCulture</div>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, lineHeight: 1.6 }}>DJ événementiel · Marseille<br />Disponible toute la France</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {[{ icon: <MapPin size={13} />, t: "Marseille — France entière" }, { icon: <Phone size={13} />, t: "06 00 00 00 00" }, { icon: <Mail size={13} />, t: "book@basseculture.fr" }].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, color: "rgba(255,255,255,0.38)", fontSize: 13 }}>
                <span style={{ color: C.accent }}>{item.icon}</span>{item.t}
              </div>
            ))}
          </div>
        </div>
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <span style={{ color: "rgba(255,255,255,0.20)", fontSize: 12 }}>© 2026 BasseCulture — Site par Aevia WS</span>
          <a href="#contact" style={{ color: "rgba(255,255,255,0.20)", fontSize: 12, textDecoration: "none" }}>Mentions légales</a>
        </div>
      </footer>
    </div>
  )
}
