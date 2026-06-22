// @ts-nocheck
"use client"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ArrowUpRight, Star, Quote, MapPin, Phone, Mail, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

/* ═══════════════════════════════════════════════════════════════════════════
   MAËLLE DUMAS — Architecte d'intérieur (Lyon)
   Palette : blanc chaud / terracotta / lin / noir doux
   Fonts : Cormorant Garamond (titres) + Inter (corps)
   ═══════════════════════════════════════════════════════════════════════════ */

const C = {
  bg: "#faf8f4",
  bgAlt: "#f2ede6",
  terra: "#c2724f",
  terraLight: "#e8a07e",
  dark: "#1c1a18",
  muted: "#8a8070",
  line: "#e0d8cc",
  white: "#ffffff",
  serif: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
  sans: "'Inter', system-ui, sans-serif",
}

function Reveal({ children, delay = 0, y = 30 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-70px" })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }} animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  )
}

function ParallaxImg({ src, alt }: { src: string; alt: string }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"])
  return (
    <div ref={ref} className="relative w-full h-full overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-[-10%] w-[120%] h-[120%]">
        <Image src={src} alt={alt} fill className="object-cover" />
      </motion.div>
    </div>
  )
}

const PROJECTS = [
  { title: "Appartement Presqu'île", city: "Lyon 2ème", surface: "120 m²", style: "Contemporain haussmannien", img: "https://images.unsplash.com/photo-1600210491369-e753d80a41f3?auto=format&fit=crop&q=80&w=1200" },
  { title: "Villa Les Pins", city: "Tassin-la-Demi-Lune", surface: "280 m²", style: "Minimalisme chaleureux", img: "https://images.unsplash.com/photo-1616137466211-f939a420be84?auto=format&fit=crop&q=80&w=1200" },
  { title: "Loft Croix-Rousse", city: "Lyon 4ème", surface: "90 m²", style: "Industriel doux", img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=1200" },
]

const SERVICES = [
  { num: "01", title: "Conception complète", desc: "De l'esquisse au chantier — plans, matériaux, mobilier, suivi d'entreprise. Un projet livré clé en main." },
  { num: "02", title: "Conseil & mood board", desc: "Session de 2h pour définir votre style, palette chromatique, et mobilier cible. Idéal pour les petits budgets." },
  { num: "03", title: "Rénovation partielle", desc: "Salle de bain, cuisine, chambre principale — on réinvente un espace précis avec un impact maximum." },
  { num: "04", title: "Aménagement commercial", desc: "Boutiques, cabinets, restaurants — nous concevons des espaces qui racontent votre marque et convertissent." },
]

export default function MaelleDumasPage() {
  const heroRef = useRef(null)
  const [scrolled, setScrolled] = useState(false)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0])
  const heroTextY = useTransform(scrollYProgress, [0, 1], ["0%", "8%"])

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
  }, [])

  return (
    <div style={{ background: C.bg, color: C.dark, fontFamily: C.sans }}>
      {/* ── NAVBAR ── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, transition: "all 0.6s", background: scrolled ? "rgba(250,248,244,0.95)" : "transparent", backdropFilter: scrolled ? "blur(12px)" : "none", borderBottom: scrolled ? `1px solid ${C.line}` : "none", padding: scrolled ? "1rem 0" : "1.75rem 0" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 2.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: C.serif, fontSize: "1.4rem", fontWeight: 600, letterSpacing: "0.02em", fontStyle: "italic", color: C.dark }}>Maëlle Dumas</span>
          <div style={{ display: "flex", gap: "3rem" }} className="hidden lg:flex">
            {["Projets", "Prestations", "À propos", "Contact"].map(l => (
              <Link key={l} href="#contact" style={{ fontFamily: C.sans, fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.15em", color: C.muted, textDecoration: "none", transition: "color 0.3s" }}
                onMouseEnter={e => (e.target as HTMLElement).style.color = C.terra}
                onMouseLeave={e => (e.target as HTMLElement).style.color = C.muted}>{l}</Link>
            ))}
          </div>
          <a href="tel:0478123456" style={{ display: "none", fontFamily: C.sans, fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: C.terra, textDecoration: "none" }} className="hidden md:block">
            Prendre RDV
          </a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section ref={heroRef} style={{ position: "relative", height: "110vh", minHeight: 900, overflow: "hidden", display: "flex", alignItems: "flex-end" }}>
        <motion.div style={{ y: heroY, position: "absolute", inset: 0 }}>
          <Image src="https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&q=85&w=2400" alt="Architecture intérieure Maëlle Dumas" fill className="object-cover" priority style={{ filter: "brightness(0.75)" }} />
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to top, ${C.dark} 0%, rgba(28,26,24,0.3) 50%, transparent 100%)` }} />
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to right, rgba(28,26,24,0.5) 0%, transparent 60%)` }} />
        </motion.div>

        <motion.div style={{ y: heroTextY, opacity: heroOpacity, position: "relative", zIndex: 10, maxWidth: 1400, width: "100%", margin: "0 auto", padding: "0 2.5rem 7rem" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
              <div style={{ width: 40, height: 1, background: C.terra }} />
              <span style={{ fontFamily: C.sans, fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.35em", color: C.terra }}>Architecte d'intérieur · Lyon</span>
            </div>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontFamily: C.serif, fontSize: "clamp(3.5rem,9vw,8.5rem)", fontWeight: 400, lineHeight: 0.9, letterSpacing: "-0.01em", color: "#fff", marginBottom: "1.5rem", fontStyle: "italic" }}>
            Des intérieurs<br />qui vous<br /><span style={{ color: C.terraLight }}>ressemblent.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontFamily: C.sans, fontSize: "0.9rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.8, maxWidth: 480, marginBottom: "2.5rem" }}>
            Conception et rénovation d'espaces de vie et professionnels en Auvergne-Rhône-Alpes. Du projet à la livraison, une approche sur-mesure et humaine.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <button style={{ padding: "1rem 2.5rem", background: C.terra, color: "#fff", fontFamily: C.sans, fontWeight: 700, fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.2em", border: "none", cursor: "pointer", transition: "background 0.3s" }}
              onMouseEnter={e => (e.target as HTMLElement).style.background = C.terraLight}
              onMouseLeave={e => (e.target as HTMLElement).style.background = C.terra}>
              Voir les projets
            </button>
            <button style={{ padding: "1rem 2.5rem", background: "transparent", color: "#fff", fontFamily: C.sans, fontWeight: 700, fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.2em", border: "1px solid rgba(255,255,255,0.2)", cursor: "pointer", transition: "all 0.3s" }}>
              Prendre rendez-vous
            </button>
          </motion.div>
        </motion.div>

        <div style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, zIndex: 10 }}>
          <span style={{ fontFamily: C.sans, fontSize: "0.55rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.4em", color: "rgba(255,255,255,0.2)" }}>défiler</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2.2 }} style={{ width: 1, height: 40, background: `linear-gradient(to bottom, ${C.terra}60, transparent)` }} />
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ padding: "4rem 0", borderBottom: `1px solid ${C.line}` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 2.5rem", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "2rem" }} className="grid grid-cols-2 md:grid-cols-4">
          {[
            { v: "12+", l: "Années d'exercice" },
            { v: "180+", l: "Projets livrés" },
            { v: "4.9★", l: "Avis Google" },
            { v: "3", l: "Prix de design" },
          ].map((s, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div style={{ textAlign: "center", padding: "1.5rem" }}>
                <div style={{ fontFamily: C.serif, fontSize: "2.5rem", fontWeight: 600, color: C.terra, lineHeight: 1, marginBottom: "0.5rem" }}>{s.v}</div>
                <div style={{ fontFamily: C.sans, fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: C.muted }}>{s.l}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── PROJETS ── */}
      <section style={{ padding: "7rem 0", background: C.bg }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 2.5rem" }}>
          <Reveal>
            <div style={{ marginBottom: "4rem" }}>
              <div style={{ fontFamily: C.sans, fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.4em", color: C.terra, marginBottom: "1rem" }}>Portfolio</div>
              <h2 style={{ fontFamily: C.serif, fontSize: "clamp(2.5rem,5vw,5rem)", fontWeight: 400, color: C.dark, fontStyle: "italic", lineHeight: 1 }}>Projets récents.</h2>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2rem" }}>
            {PROJECTS.map((p, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div style={{ cursor: "pointer" }} className="group">
                  <div style={{ position: "relative", aspectRatio: "4/3", overflow: "hidden", marginBottom: "1.5rem" }}>
                    <ParallaxImg src={p.img} alt={p.title} />
                    <div className="absolute inset-0 transition-all duration-700" style={{ background: `rgba(28,26,24,0)` }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(28,26,24,0.2)"}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "rgba(28,26,24,0)"} />
                    <div style={{ position: "absolute", top: "1rem", left: "1rem", padding: "0.3rem 0.8rem", background: C.terra, fontFamily: C.sans, fontSize: "0.55rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", color: "#fff" }}>{p.style}</div>
                  </div>
                  <div style={{ fontFamily: C.sans, fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", color: C.muted, marginBottom: "0.5rem" }}>
                    <MapPin style={{ display: "inline", width: 10, height: 10, marginRight: 4 }} />{p.city} · {p.surface}
                  </div>
                  <h3 style={{ fontFamily: C.serif, fontSize: "1.5rem", fontWeight: 600, color: C.dark, fontStyle: "italic" }}>{p.title}</h3>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2}>
            <div style={{ textAlign: "center", marginTop: "4rem" }}>
              <button style={{ display: "inline-flex", alignItems: "center", gap: "0.75rem", padding: "1rem 2.5rem", border: `1px solid ${C.line}`, background: "transparent", fontFamily: C.sans, fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", color: C.dark, cursor: "pointer", transition: "all 0.3s" }}>
                Voir tous les projets <ArrowRight style={{ width: 14, height: 14 }} />
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section style={{ padding: "7rem 0", background: C.bgAlt }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 2.5rem" }}>
          <Reveal>
            <div style={{ marginBottom: "4rem" }}>
              <div style={{ fontFamily: C.sans, fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.4em", color: C.terra, marginBottom: "1rem" }}>Prestations</div>
              <h2 style={{ fontFamily: C.serif, fontSize: "clamp(2rem,4vw,4rem)", fontWeight: 400, color: C.dark, fontStyle: "italic" }}>Comment je travaille.</h2>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "0" }}>
            {SERVICES.map((s, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div style={{ padding: "2.5rem", borderLeft: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}` }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "3rem", fontWeight: 300, color: `${C.terra}30`, lineHeight: 1, marginBottom: "1.5rem" }}>{s.num}</div>
                  <h3 style={{ fontFamily: C.serif, fontSize: "1.2rem", fontWeight: 600, color: C.dark, marginBottom: "0.75rem", fontStyle: "italic" }}>{s.title}</h3>
                  <p style={{ fontFamily: C.sans, fontSize: "0.8rem", color: C.muted, lineHeight: 1.7 }}>{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TÉMOIGNAGES ── */}
      <section style={{ padding: "7rem 0", background: C.bg }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 2.5rem" }}>
          <Reveal>
            <div style={{ marginBottom: "4rem", textAlign: "center" }}>
              <div style={{ fontFamily: C.sans, fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.4em", color: C.terra, marginBottom: "1rem" }}>Témoignages</div>
              <h2 style={{ fontFamily: C.serif, fontSize: "clamp(2rem,4vw,4rem)", fontWeight: 400, color: C.dark, fontStyle: "italic" }}>Ce que disent mes clients.</h2>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
            {[
              { quote: "Maëlle a su transformer notre appartement haussmannien en un espace lumineux et moderne, tout en conservant l'âme du bâtiment. Un vrai talent.", name: "Claire & Antoine R.", loc: "Lyon 6ème" },
              { quote: "Écoute parfaite, respect du budget, délais tenus. Notre loft Croix-Rousse est devenu la maison dont on rêvait depuis des années.", name: "Thomas M.", loc: "Lyon 4ème" },
              { quote: "La rénovation de notre cabinet a complètement changé l'accueil des patients. L'espace inspire calme et confiance. Résultat au-delà de nos espérances.", name: "Dr. Sophie L.", loc: "Tassin-la-Demi-Lune" },
            ].map((t, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div style={{ padding: "2.5rem", border: `1px solid ${C.line}`, background: C.bgAlt }}>
                  <Quote style={{ width: 24, height: 24, color: C.terra, marginBottom: "1.5rem", opacity: 0.6 }} />
                  <p style={{ fontFamily: C.serif, fontSize: "1.05rem", fontWeight: 400, color: C.dark, lineHeight: 1.7, fontStyle: "italic", marginBottom: "2rem" }}>{`"${t.quote}"`}</p>
                  <div>
                    <div style={{ fontFamily: C.sans, fontSize: "0.75rem", fontWeight: 700, color: C.dark, textTransform: "uppercase", letterSpacing: "0.1em" }}>{t.name}</div>
                    <div style={{ fontFamily: C.sans, fontSize: "0.65rem", color: C.muted, marginTop: "0.25rem" }}>{t.loc}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "8rem 0", background: C.dark, textAlign: "center" }}>
        <Reveal>
          <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 2.5rem" }}>
            <div style={{ fontFamily: C.sans, fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.4em", color: C.terra, marginBottom: "1.5rem" }}>Démarrer un projet</div>
            <h2 style={{ fontFamily: C.serif, fontSize: "clamp(2.5rem,6vw,5.5rem)", fontWeight: 400, color: "#fff", fontStyle: "italic", lineHeight: 1, marginBottom: "2rem" }}>
              Parlons de votre<br /><span style={{ color: C.terraLight }}>prochain espace.</span>
            </h2>
            <p style={{ fontFamily: C.sans, fontSize: "0.85rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.7, marginBottom: "3rem" }}>
              Premier rendez-vous gratuit (1h). Disponible à Lyon et région Auvergne-Rhône-Alpes.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <button style={{ padding: "1.1rem 2.5rem", background: C.terra, color: "#fff", fontFamily: C.sans, fontWeight: 700, fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.2em", border: "none", cursor: "pointer" }}>
                Prendre rendez-vous
              </button>
              <a href="tel:0478123456" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "1.1rem 2.5rem", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.6)", fontFamily: C.sans, fontWeight: 700, fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.2em", textDecoration: "none" }}>
                <Phone style={{ width: 14, height: 14 }} /> 04 78 12 34 56
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#141210", padding: "4rem 2.5rem 2rem", borderTop: `1px solid rgba(255,255,255,0.05)` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "3rem", marginBottom: "3rem" }}>
          <div>
            <div style={{ fontFamily: C.serif, fontSize: "1.2rem", fontStyle: "italic", color: "#fff", marginBottom: "1rem" }}>Maëlle Dumas</div>
            <p style={{ fontFamily: C.sans, fontSize: "0.75rem", color: "rgba(255,255,255,0.3)", lineHeight: 1.7 }}>Architecte d'intérieur CFAI. Conception et rénovation d'espaces en Auvergne-Rhône-Alpes.</p>
          </div>
          {[
            { t: "Services", ls: ["Conception complète", "Conseil & moodboard", "Rénovation partielle", "Aménagement commercial"] },
            { t: "Contact", ls: ["04 78 12 34 56", "contact@maelledumas.fr", "Lyon · Auvergne-Rhône-Alpes", "RDV sur devis"] },
          ].map((col, i) => (
            <div key={i}>
              <div style={{ fontFamily: C.sans, fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.3em", color: C.terra, marginBottom: "1.25rem" }}>{col.t}</div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {col.ls.map(l => <li key={l} style={{ fontFamily: C.sans, fontSize: "0.75rem", color: "rgba(255,255,255,0.3)", marginBottom: "0.5rem" }}>{l}</li>)}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ maxWidth: 1200, margin: "0 auto", paddingTop: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", gap: "1rem" }}>
          <span style={{ fontFamily: C.sans, fontSize: "0.6rem", color: "rgba(255,255,255,0.15)", textTransform: "uppercase", letterSpacing: "0.15em" }}>© 2026 Maëlle Dumas Design · SIRET 987 654 321 00045</span>
          <span style={{ fontFamily: C.sans, fontSize: "0.6rem", color: C.terra + "60", textTransform: "uppercase", letterSpacing: "0.15em" }}>Architecte d'intérieur certifiée CFAI</span>
        </div>
      </footer>
    </div>
  )
}
