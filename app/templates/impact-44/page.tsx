"use client"
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion"
import React, { useRef, useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, ChevronDown, Star, MapPin, Clock, CheckCircle, MoveRight, Eye, Layers, Home, Building2, Hotel, ChevronRight } from "lucide-react"

const C = {
  bg: "#faf9f6",
  surface: "#f2ede4",
  card: "#ffffff",
  dark: "#1e1e1e",
  mid: "#3a3530",
  terra: "#c4703a",
  terraLight: "#d4906a",
  beige: "#e8ddd0",
  text: "#1e1e1e",
  muted: "#6b5f55",
  subtle: "#9b8e84",
  border: "#ddd5c8",
}

type ProjectFilter = "All" | "Residential" | "Commercial" | "Hospitality"
const FILTERS: ProjectFilter[] = ["All", "Residential", "Commercial", "Hospitality"]

const PROJECTS = [
  { title: "Villa Montagne", type: "Residential" as ProjectFilter, location: "Megève", year: "2025", desc: "6-bedroom chalet with panoramic Alpine views and integrated wellness suite." },
  { title: "Hôtel Lumière", type: "Hospitality" as ProjectFilter, location: "Paris 8ème", year: "2024", desc: "45-room boutique hotel redesign with French art deco revival." },
  { title: "Bureau Haussmann", type: "Commercial" as ProjectFilter, location: "Paris 9ème", year: "2024", desc: "Open-plan creative offices for a media agency across 3 Haussmann floors." },
  { title: "Maison Arles", type: "Residential" as ProjectFilter, location: "Arles", year: "2023", desc: "Restored 18th-century townhouse with contemporary interiors and original beams." },
  { title: "Spa Thermal Royat", type: "Hospitality" as ProjectFilter, location: "Royat", year: "2023", desc: "Full interior design of a thermal spa including treatment rooms and thermal circuit." },
  { title: "Loft République", type: "Commercial" as ProjectFilter, location: "Paris 11ème", year: "2022", desc: "Industrial loft conversion to co-working and event space for a tech startup." },
]

const SERVICES = [
  { icon: Home, title: "Residential Design", desc: "From Parisian apartments to country estates — we create homes that reflect who you are and how you live." },
  { icon: Building2, title: "Commercial Spaces", desc: "Offices, retail, and creative studios designed for productivity, brand identity, and human comfort." },
  { icon: Hotel, title: "Hospitality", desc: "Restaurants, hotels, and spas where every detail contributes to a memorable guest experience." },
  { icon: Layers, title: "Renovation & Heritage", desc: "Breathing new life into historic properties with contemporary sensibility and structural respect." },
]

const PROCESS = [
  { step: "01", title: "Discovery", desc: "We start with a deep conversation about your vision, lifestyle, and aspirations for the space." },
  { step: "02", title: "Concept", desc: "Mood boards, material palettes, and spatial plans that define the unique identity of your project." },
  { step: "03", title: "Execution", desc: "Precision project management — coordinating artisans, suppliers, and contractors to your schedule." },
  { step: "04", title: "Reveal", desc: "Your space, fully realised. We document every detail and remain available for any follow-up." },
]

const TESTIMONIALS = [
  { name: "Charlotte & Julien M.", type: "Residential client", quote: "Espace Studio transformed our Paris apartment into something we could never have imagined alone. The attention to detail is extraordinary.", rating: 5 },
  { name: "Marc Lefèvre", type: "CEO, Lefèvre Group", quote: "Our new offices have become a genuine recruitment tool. Talent wants to work in this space. ROI in 6 months.", rating: 5 },
  { name: "Hôtel Lumière Management", type: "Hospitality client", quote: "Since the redesign, our average review score went from 4.1 to 4.8. Guests mention the interior in every review.", rating: 5 },
]

const FAQS = [
  { q: "What is your minimum project size?", a: "We typically work on projects from €25,000 upward. For smaller spaces like a single room, we offer a focused consultation package starting at €3,500." },
  { q: "How long does an interior design project take?", a: "Residential projects typically take 3-8 months from first brief to completion. Commercial projects vary from 4-18 months depending on scale." },
  { q: "Do you work outside of France?", a: "Yes — we have completed projects in Switzerland, Belgium, Morocco, and the UAE. We are comfortable managing remote and international projects." },
  { q: "What is included in your fees?", a: "Our fees cover concept design, technical plans, supplier sourcing, project management, and site supervision. Material and artisan costs are separate." },
  { q: "Can I be involved in the design process?", a: "Absolutely — your input is essential at every stage. We offer a collaborative process with regular review sessions and clear approval milestones." },
]

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  )
}

export default function EspaceStudioPage() {
  const [activeFilter, setActiveFilter] = useState<ProjectFilter>("All")
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const heroTextX = useTransform(scrollYProgress, [0, 0.3], [0, -40])
  const heroImageX = useTransform(scrollYProgress, [0, 0.3], [0, 40])

  const filtered = activeFilter === "All" ? PROJECTS : PROJECTS.filter(p => p.type === activeFilter)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
  }, [])

  return (
    <div ref={containerRef} style={{ background: C.bg, color: C.text, fontFamily: "'DM Sans', system-ui, sans-serif", minHeight: "100vh" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; }`}</style>

      {/* NAVBAR */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, padding: "0 40px", height: 72, display: "flex", alignItems: "center", justifyContent: "space-between", background: scrolled ? `${C.card}f0` : "transparent", backdropFilter: scrolled ? "blur(12px)" : "none", borderBottom: scrolled ? `1px solid ${C.border}` : "none", transition: "all 0.3s" }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, color: C.dark, letterSpacing: "0.02em" }}>Espace Studio</span>
        </Link>
        <div style={{ display: "flex", gap: 40, alignItems: "center" }}>
          {["Projects", "Services", "Studio", "Contact"].map(l => (
            <Link key={l} href="#" style={{ color: C.muted, textDecoration: "none", fontSize: 14, fontWeight: 500, transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = C.dark)}
              onMouseLeave={e => (e.currentTarget.style.color = C.muted)}>{l}</Link>
          ))}
          <Link href="#" style={{ padding: "10px 24px", background: C.dark, color: "#fff", borderRadius: 2, textDecoration: "none", fontSize: 13, fontWeight: 500, letterSpacing: "0.05em" }}>Book a consultation</Link>
        </div>
      </nav>

      {/* HERO — editorial split */}
      <section style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "1fr 1fr", overflow: "hidden" }}>
        <motion.div style={{ x: heroTextX, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "180px 60px 80px 60px", background: C.bg }}>
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }}>
            <div style={{ fontSize: 11, color: C.terra, letterSpacing: "0.35em", textTransform: "uppercase", marginBottom: 24 }}>Interior Architecture & Design</div>
            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(44px, 6vw, 72px)", fontWeight: 400, lineHeight: 1.08, color: C.dark, marginBottom: 32 }}>
              Spaces that tell<br /><em>your story</em>
            </h1>
            <p style={{ fontSize: 17, color: C.muted, lineHeight: 1.7, maxWidth: 360, marginBottom: 48 }}>
              We design interiors for the way you actually live — blending beauty, function, and identity in every detail.
            </p>
            <div style={{ display: "flex", gap: 16 }}>
              <Link href="#" style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 32px", background: C.terra, color: "#fff", borderRadius: 2, textDecoration: "none", fontSize: 14, fontWeight: 500 }}>
                See our work <ArrowRight size={16} />
              </Link>
              <Link href="#" style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 32px", border: `1px solid ${C.border}`, color: C.dark, borderRadius: 2, textDecoration: "none", fontSize: 14 }}>
                Our process <MoveRight size={16} />
              </Link>
            </div>
          </motion.div>
        </motion.div>

        <motion.div style={{ x: heroImageX, background: C.surface, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "absolute", inset: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, padding: 4 }}>
            {[C.beige, C.terra + "44", C.mid + "22", C.border].map((bg, i) => (
              <div key={i} style={{ background: bg, borderRadius: 2 }} />
            ))}
          </div>
          <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 80, color: C.terra, opacity: 0.15, lineHeight: 1 }}>ES</div>
          </div>
          <div style={{ position: "absolute", bottom: 40, right: 40, padding: "16px 24px", background: C.card, borderRadius: 2, border: `1px solid ${C.border}` }}>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, color: C.dark }}>+120</div>
            <div style={{ fontSize: 12, color: C.muted, letterSpacing: "0.08em" }}>projects delivered</div>
          </div>
        </motion.div>
      </section>

      {/* SERVICES */}
      <section style={{ padding: "100px 60px", background: C.surface }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 64, flexWrap: "wrap", gap: 24 }}>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 400, color: C.dark }}>What we do</h2>
              <Link href="#" style={{ color: C.terra, textDecoration: "none", fontSize: 14, fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}>
                All services <ChevronRight size={16} />
              </Link>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 2 }}>
            {SERVICES.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.08}>
                <div style={{ padding: "40px 32px", background: C.card, cursor: "default", transition: "background 0.3s" }}
                  onMouseEnter={e => (e.currentTarget.style.background = C.bg)}
                  onMouseLeave={e => (e.currentTarget.style.background = C.card)}>
                  <s.icon size={28} color={C.terra} style={{ marginBottom: 24 }} />
                  <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, fontWeight: 400, color: C.dark, marginBottom: 12 }}>{s.title}</h3>
                  <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7 }}>{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section style={{ padding: "100px 60px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48, flexWrap: "wrap", gap: 24 }}>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 400, color: C.dark }}>Our projects</h2>
              <div style={{ display: "flex", gap: 8 }}>
                {FILTERS.map(f => (
                  <button key={f} onClick={() => setActiveFilter(f)}
                    style={{ padding: "8px 20px", border: `1px solid ${activeFilter === f ? C.terra : C.border}`, background: activeFilter === f ? C.terra : "transparent", color: activeFilter === f ? "#fff" : C.muted, borderRadius: 2, fontSize: 13, fontWeight: 500, cursor: "pointer", transition: "all 0.2s" }}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </Reveal>
          <motion.div layout style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
            <AnimatePresence mode="wait">
              {filtered.map((p, i) => (
                <motion.div key={p.title} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.3, delay: i * 0.06 }}>
                  <div style={{ background: C.card, border: `1px solid ${C.border}`, overflow: "hidden", cursor: "pointer", position: "relative", transition: "transform 0.3s" }}
                    onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-4px)")}
                    onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}>
                    <div style={{ height: 200, background: C.surface, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
                      <div style={{ width: 80, height: 80, background: C.beige, borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Eye size={32} color={C.terra} />
                      </div>
                      <div style={{ position: "absolute", top: 12, right: 12, padding: "4px 10px", background: C.terra, color: "#fff", fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>{p.type}</div>
                    </div>
                    <div style={{ padding: 24 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, fontWeight: 400, color: C.dark }}>{p.title}</h3>
                        <span style={{ fontSize: 12, color: C.subtle }}>{p.year}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: C.subtle, marginBottom: 12 }}>
                        <MapPin size={11} />{p.location}
                      </div>
                      <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{p.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* PROCESS */}
      <section style={{ padding: "100px 60px", background: C.dark }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Reveal>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 400, color: C.card, textAlign: "center", marginBottom: 64 }}>Our process</h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 0 }}>
            {PROCESS.map((s, i) => (
              <Reveal key={s.step} delay={i * 0.1}>
                <div style={{ padding: 40, borderLeft: i > 0 ? `1px solid ${C.mid}` : "none" }}>
                  <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 48, color: C.terra, opacity: 0.6, marginBottom: 16 }}>{s.step}</div>
                  <h3 style={{ fontSize: 18, fontWeight: 600, color: C.card, marginBottom: 12 }}>{s.title}</h3>
                  <p style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.7 }}>{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: "100px 60px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Reveal><h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 400, textAlign: "center", marginBottom: 64, color: C.dark }}>Client stories</h2></Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.1}>
                <div style={{ padding: 36, background: C.card, border: `1px solid ${C.border}` }}>
                  <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
                    {[1,2,3,4,5].map(s => <Star key={s} size={14} color={C.terra} fill={C.terra} />)}
                  </div>
                  <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 17, color: C.dark, lineHeight: 1.7, marginBottom: 28, fontStyle: "italic" }}>"{t.quote}"</p>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: C.dark }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: C.subtle }}>{t.type}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "100px 60px", background: C.surface }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <Reveal><h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 400, textAlign: "center", marginBottom: 64, color: C.dark }}>Frequently asked</h2></Reveal>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {FAQS.map((faq, i) => (
              <div key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: "100%", padding: "22px 0", background: "none", border: "none", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", fontSize: 15, fontWeight: 500, color: C.dark, textAlign: "left", fontFamily: "'DM Sans', sans-serif" }}>
                  {faq.q}
                  <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown size={18} color={C.muted} />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} style={{ overflow: "hidden" }}>
                      <div style={{ paddingBottom: 22, fontSize: 14, color: C.muted, lineHeight: 1.8 }}>{faq.a}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: C.mid, padding: "60px 60px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 48 }}>
            <div>
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: C.card, marginBottom: 16 }}>Espace Studio</div>
              <p style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.7, maxWidth: 240 }}>Interior architecture and design for those who know that beauty and function are never opposites.</p>
            </div>
            {[
              { title: "Studio", links: ["Projects", "Services", "Process", "Awards"] },
              { title: "Contact", links: ["Book a consultation", "Press", "Careers", "Paris Studio"] },
              { title: "Legal", links: ["Privacy", "Terms", "Cookies", "RGPD"] },
            ].map(col => (
              <div key={col.title}>
                <h4 style={{ fontSize: 10, color: C.terra, letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 20 }}>{col.title}</h4>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
                  {col.links.map(l => <li key={l}><Link href="#" style={{ color: "#94a3b8", textDecoration: "none", fontSize: 14 }}
                    onMouseEnter={e => (e.currentTarget.style.color = C.card)}
                    onMouseLeave={e => (e.currentTarget.style.color = "#94a3b8")}>{l}</Link></li>)}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ borderTop: `1px solid #ffffff15`, paddingTop: 24, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <span style={{ fontSize: 12, color: "#64748b" }}>© 2026 Espace Studio SAS. All rights reserved.</span>
            <span style={{ fontSize: 12, color: "#64748b" }}>Paris · Lyon · Geneva</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
