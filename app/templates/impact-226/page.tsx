"use client"

import React, { useRef, useState } from "react"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { Phone, Mail, MapPin, Clock, Star, CheckCircle, ArrowRight, Camera } from "lucide-react"

const C = {
  bg: "#0d0d0d",
  bgSection: "#131313",
  text: "#f5f0e8",
  textMuted: "#8a8070",
  accent: "#e8c97a",
  accentDark: "#c4a44e",
  accentLight: "#2a2518",
  red: "#c0392b",
  white: "#ffffff",
  border: "rgba(232,201,122,0.15)",
  shadow: "0 2px 14px rgba(0,0,0,0.40)",
  shadowLg: "0 16px 48px rgba(232,201,122,0.15)",
}
const FONT = "'DM Serif Display', Georgia, serif"
const FONT_BODY = "'DM Sans', system-ui, sans-serif"

const STATS = [
  { value: "9 ans", label: "De pratique" },
  { value: "4 200+", label: "Tatouages réalisés" },
  { value: "4.9★", label: "Google" },
  { value: "3 artistes", label: "Styles variés" },
]

const STYLES = [
  { titre: "Blackwork & fine line", desc: "Traits fins, géométrie, mandala, ornements. Technique maîtrisée pour des tracés chirurgicaux durables sur toutes carnations.", tag: "Blackwork" },
  { titre: "Réalisme noir & gris", desc: "Portraits, animaux, nature. Travail d'ombres et de lumières pour un rendu photographique sur peau. Spécialité de l'atelier.", tag: "Réalisme" },
  { titre: "Japonais traditionnel", desc: "Koi, dragon, cerisier, lotus — iconographie japonaise classique avec remplissages couleurs denses et contours puissants.", tag: "Japonais" },
  { titre: "Aquarelle & coloré", desc: "Palettes vibrantes, effets d'éclaboussures, rendu artistique unique. Pour ceux qui veulent un tatouage qui ressemble à une peinture.", tag: "Color" },
  { titre: "Lettering & typographie", desc: "Scripts, capitales, calligraphie manuscrite. Chaque police est dessinée à la main pour un résultat exclusif et personnel.", tag: "Lettering" },
  { titre: "Cover-up & retouches", desc: "Recouvrement de tatouages anciens ou ratés. Consultation obligatoire avant devis. Expertise reconnue en transformation de pièces complexes.", tag: "Cover-up" },
]

const PROCESS = [
  "Consultation gratuite et dessin sur mesure pour chaque client",
  "Matériel à usage unique, stérilisation autoclave certifiée",
  "Suivi post-tatouage avec kit de soin offert",
  "Retouche gratuite incluse dans les 3 mois",
]

const AVIS = [
  { texte: "Je cherchais depuis des mois un artiste capable de faire un réalisme de portrait de mon chien. Le résultat dépasse tout ce que j'imaginais. Une fidélité de dingue. Je reviendrai.", auteur: "Lucie V.", detail: "Réalisme portrait, cuisse" },
  { texte: "Cover-up d'un vieux tatouage raté que je cachais depuis 10 ans. Ils ont transformé ça en quelque chose de magnifique. Merci ! Je ne pouvais plus rêver d'un meilleur résultat.", auteur: "Kevin M.", detail: "Cover-up japonais, bras" },
  { texte: "Fine line fleuri sur la clavicule. Propre, précis, soigné. L'accueil est top, le studio est beau, et on est bien guidé sur les soins après. Je recommande à 100%.", auteur: "Chloé B.", detail: "Fine line floral, clavicule" },
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

export default function EncreNoirePage() {
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
    <div style={{ background: C.bg, fontFamily: FONT_BODY, overflowX: "hidden" }}>
      <style jsx global>{`@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');`}</style>

      <motion.nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 72,
        display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 64px",
        background: scrolled ? "rgba(13,13,13,0.97)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? `1px solid ${C.border}` : "none",
        transition: "all 0.4s ease",
      }}>
        <div style={{ fontFamily: FONT, fontSize: 22, color: C.accent }}>Encre <span style={{ fontStyle: "italic" }}>Noire</span></div>
        <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {["Styles", "Galerie", "Tarifs", "Contact"].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{ color: C.textMuted, fontSize: 14, fontWeight: 500, textDecoration: "none" }}>{l}</a>
          ))}
          <motion.a href="#contact" style={{ background: C.accent, color: "#0d0d0d", borderRadius: 4, padding: "9px 22px", fontSize: 14, fontWeight: 700, textDecoration: "none" }} whileHover={{ background: C.accentDark }}>
            Réserver
          </motion.a>
        </div>
      </motion.nav>

      <section ref={heroRef} style={{ height: "115vh", minHeight: "900px", position: "relative", display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
        <motion.div style={{ y: heroY, position: "absolute", inset: 0 }}>
          <img src="https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?w=1920&q=80" alt="Studio tatouage Encre Noire Paris" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </motion.div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.52) 45%, rgba(0,0,0,0.12) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to right, ${C.accent}10 0%, transparent 55%)` }} />

        <motion.div style={{ position: "relative", zIndex: 1, padding: "0 80px 90px", maxWidth: 780, y: heroTextY, opacity: heroOpacity }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 28, background: "rgba(232,201,122,0.10)", border: `1px solid ${C.border}`, borderRadius: 20, padding: "7px 18px" }}>
            <span style={{ color: C.accent, fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>Studio de tatouage · Paris 11e</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.9 }}
            style={{ fontFamily: FONT, fontSize: "clamp(42px, 5.5vw, 74px)", fontWeight: 400, color: C.text, lineHeight: 1.05, marginBottom: 24 }}>
            L'art sur peau,<br /><em style={{ color: C.accent }}>pour toujours.</em>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}
            style={{ fontSize: 17, color: "rgba(245,240,232,0.65)", lineHeight: 1.75, marginBottom: 40, maxWidth: 520 }}>
            Studio Encre Noire réunit 3 artistes tatoueurs spécialisés — blackwork, réalisme, japonais, aquarelle. Chaque pièce est unique, dessinée sur mesure, réalisée avec obsession du détail.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }} style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <motion.a href="#contact" style={{ background: C.accent, color: "#0d0d0d", borderRadius: 4, padding: "15px 32px", fontWeight: 700, fontSize: 15, textDecoration: "none", display: "flex", alignItems: "center", gap: 8, boxShadow: `0 8px 32px ${C.accent}30` }} whileHover={{ scale: 1.03 }}>
              Prendre RDV <ArrowRight size={16} />
            </motion.a>
            <motion.a href="#styles" style={{ background: "rgba(255,255,255,0.06)", color: C.text, border: `1px solid ${C.border}`, borderRadius: 4, padding: "13px 28px", fontWeight: 500, fontSize: 15, textDecoration: "none" }} whileHover={{ background: "rgba(255,255,255,0.10)" }}>
              Nos styles
            </motion.a>
          </motion.div>
        </motion.div>

        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
          style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", zIndex: 2 }}>
          <div style={{ width: 24, height: 36, border: `2px solid ${C.border}`, borderRadius: 12, display: "flex", justifyContent: "center", paddingTop: 6 }}>
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ width: 6, height: 6, borderRadius: "50%", background: C.accent }} />
          </div>
        </motion.div>
      </section>

      <section style={{ background: C.accentLight, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: "0 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", maxWidth: 1100, margin: "0 auto" }}>
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div style={{ padding: "28px 0", textAlign: "center", borderRight: i < 3 ? `1px solid ${C.border}` : "none" }}>
                <div style={{ fontFamily: FONT, fontSize: 36, color: C.accent, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 13, color: C.textMuted, marginTop: 6 }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="styles" style={{ padding: "110px 80px", background: C.bg }}>
        <Reveal>
          <div style={{ marginBottom: 60 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>Styles & spécialités</span>
            <h2 style={{ fontFamily: FONT, fontSize: "clamp(30px, 4vw, 52px)", color: C.text, marginTop: 10, lineHeight: 1.1 }}>Chaque style,<br /><em>une signature propre.</em></h2>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 18, maxWidth: 1200, margin: "0 auto" }}>
          {STYLES.map((s, i) => (
            <Reveal key={s.titre} delay={i * 0.07}>
              <motion.div whileHover={{ y: -4, borderColor: C.accent }} style={{ background: C.bgSection, borderRadius: 8, padding: "26px 24px", border: `1px solid ${C.border}` }}>
                <span style={{ background: "rgba(232,201,122,0.12)", color: C.accent, borderRadius: 20, padding: "4px 12px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{s.tag}</span>
                <h3 style={{ fontFamily: FONT, fontSize: 18, color: C.text, margin: "14px 0 10px" }}>{s.titre}</h3>
                <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.7 }}>{s.desc}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      <section style={{ padding: "100px 80px", background: C.bgSection }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <Reveal>
            <img src="https://images.unsplash.com/photo-1562962230-16e4623d36e6?w=800&q=80" alt="Artiste tatoueur au travail" style={{ width: "100%", borderRadius: 8, aspectRatio: "4/3", objectFit: "cover" }} />
          </Reveal>
          <Reveal delay={0.15}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>Notre hygiène</span>
            <h2 style={{ fontFamily: FONT, fontSize: "clamp(26px, 3vw, 44px)", color: C.text, margin: "12px 0 28px", lineHeight: 1.2 }}>Sécurité <em>absolue</em>,<br />zéro compromis.</h2>
            {PROCESS.map((p, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 14 }}>
                <CheckCircle size={17} color={C.accent} style={{ flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.65 }}>{p}</span>
              </div>
            ))}
            <motion.a href="#contact" style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 28, background: C.accent, color: "#0d0d0d", borderRadius: 4, padding: "13px 28px", fontWeight: 700, fontSize: 15, textDecoration: "none" }} whileHover={{ background: C.accentDark, scale: 1.02 }}>
              Consultation gratuite <ArrowRight size={16} />
            </motion.a>
          </Reveal>
        </div>
      </section>

      <section style={{ padding: "100px 80px", background: "#090909" }}>
        <Reveal><div style={{ textAlign: "center", marginBottom: 52 }}>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>Avis clients</span>
          <h2 style={{ fontFamily: FONT, fontSize: "clamp(28px, 3.5vw, 48px)", color: C.text, marginTop: 10 }}>Ils portent <em style={{ color: C.accent }}>nos œuvres.</em></h2>
        </div></Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 18, maxWidth: 1100, margin: "0 auto" }}>
          {AVIS.map((a, i) => (
            <Reveal key={a.auteur} delay={i * 0.1}>
              <div style={{ background: C.bgSection, border: `1px solid ${C.border}`, borderRadius: 8, padding: "28px 24px" }}>
                <div style={{ display: "flex", gap: 3, marginBottom: 12 }}>{[...Array(5)].map((_, j) => <Star key={j} size={13} fill={C.accent} color={C.accent} />)}</div>
                <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.7, marginBottom: 18 }}>"{a.texte}"</p>
                <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14 }}>
                  <div style={{ fontWeight: 600, color: C.text, fontSize: 14 }}>{a.auteur}</div>
                  <div style={{ color: C.accent, fontSize: 12, marginTop: 4 }}>{a.detail}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="contact" style={{ padding: "100px 80px", background: C.accentLight, textAlign: "center" }}>
        <Reveal>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>Prise de RDV</span>
          <h2 style={{ fontFamily: FONT, fontSize: "clamp(28px, 4vw, 52px)", color: C.text, margin: "14px 0 16px" }}>Votre projet<br /><em style={{ color: C.accent }}>commence ici.</em></h2>
          <p style={{ fontSize: 16, color: C.textMuted, maxWidth: 440, margin: "0 auto 36px", lineHeight: 1.7 }}>
            Consultation gratuite obligatoire avant chaque tatouage. Décrivez-nous votre projet par email ou Instagram — réponse sous 48h.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <motion.a href="mailto:contact@encrenoire-paris.fr" style={{ background: C.accent, color: "#0d0d0d", borderRadius: 4, padding: "15px 36px", fontWeight: 700, fontSize: 16, textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }} whileHover={{ scale: 1.03 }}>
              <Mail size={18} /> contact@encrenoire-paris.fr
            </motion.a>
            <motion.a href="https://instagram.com/encrenoire.paris" style={{ background: "transparent", color: C.text, border: `2px solid ${C.border}`, borderRadius: 4, padding: "13px 32px", fontWeight: 600, fontSize: 16, textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }} whileHover={{ borderColor: C.accent, color: C.accent }}>
              <Camera size={18} /> @encrenoire.paris
            </motion.a>
          </div>
        </Reveal>
      </section>

      <footer style={{ background: "#050505", borderTop: `1px solid ${C.border}`, padding: "48px 80px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 32, marginBottom: 36 }}>
          <div>
            <div style={{ fontFamily: FONT, fontSize: 20, color: C.accent, marginBottom: 8 }}>Encre <em>Noire</em></div>
            <p style={{ color: "rgba(245,240,232,0.30)", fontSize: 13, lineHeight: 1.6 }}>Studio de tatouage · Paris 11e<br />Mar–Sam 10h–19h</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {[{ icon: <MapPin size={13} />, t: "Paris 11e, Île-de-France" }, { icon: <Mail size={13} />, t: "contact@encrenoire-paris.fr" }, { icon: <Clock size={13} />, t: "Mar–Sam 10h–19h" }].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, color: "rgba(245,240,232,0.35)", fontSize: 13 }}>
                <span style={{ color: C.accent }}>{item.icon}</span>{item.t}
              </div>
            ))}
          </div>
        </div>
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <span style={{ color: "rgba(245,240,232,0.18)", fontSize: 12 }}>© 2026 Encre Noire Studio — Site par Aevia WS</span>
          <a href="/legal/mentions-legales" style={{ color: "rgba(245,240,232,0.18)", fontSize: 12, textDecoration: "none" }}>Mentions légales</a>
        </div>
      </footer>
    </div>
  )
}
