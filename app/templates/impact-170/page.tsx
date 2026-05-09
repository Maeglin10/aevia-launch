"use client"

import React, { useState, useRef } from "react"
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion"

// RAFAËL MOREAU — Personal portfolio / CV. Dark terminal aesthetic, monospace throughout, vertical timeline scroll.
// Unique: green-on-black terminal, skills as animated bars, timeline career scroll, hover reveals for projects.

const SKILLS = [
  { name: "TypeScript / JavaScript", level: 97, category: "dev" },
  { name: "React / Next.js", level: 95, category: "dev" },
  { name: "Node.js / NestJS", level: 90, category: "dev" },
  { name: "PostgreSQL / Prisma", level: 85, category: "dev" },
  { name: "System Design", level: 88, category: "arch" },
  { name: "API Design (REST/GraphQL)", level: 92, category: "arch" },
  { name: "DevOps (Docker, Render, Vercel)", level: 78, category: "ops" },
  { name: "UI/UX Prototyping", level: 80, category: "design" },
]

const TIMELINE = [
  { year: "2023–Présent", role: "Lead Engineer", company: "Arkéo SaaS", desc: "Architecture full-stack d'une plateforme de gestion documentaire. Équipe de 8 ingénieurs. 0 → 3 200 clients en 18 mois.", tags: ["Next.js 15", "NestJS", "Prisma", "Postgres"], accent: "#00e5b8" },
  { year: "2021–2023", role: "Senior Frontend Engineer", company: "Volta Finance", desc: "Refonte complète du dashboard d'investissement. Réduction de 65% du temps de chargement. Conformité MiFID II.", tags: ["React", "TypeScript", "D3.js", "Jest"], accent: "#818cf8" },
  { year: "2019–2021", role: "Fullstack Developer", company: "Agence Pixel & Co", desc: "Développement de 14 projets web pour des clients PME. Spécialisation e-commerce Shopify + Headless.", tags: ["Vue.js", "Shopify", "PHP", "MySQL"], accent: "#f59e0b" },
  { year: "2018", role: "Freelance", company: "Indépendant", desc: "Premiers projets client — sites vitrine, APIs REST, intégrations tierces.", tags: ["React", "Express", "MongoDB"], accent: "#a3a3a3" },
]

const PROJECTS = [
  { name: "Arkéo Platform", desc: "SaaS B2B de gestion documentaire avec IA. 3 200+ clients, €2.4M ARR.", tech: ["Next.js", "NestJS", "OpenAI"], link: "#", accent: "#00e5b8" },
  { name: "Volta Dashboard", desc: "Dashboard d'investissement temps réel. 120K+ requêtes/jour, latence <80ms.", tech: ["React", "D3.js", "WebSockets"], link: "#", accent: "#818cf8" },
  { name: "Open Source: use-scroll-animation", desc: "Hook React pour animations scroll. 1.4K stars GitHub, 230K téléchargements npm.", tech: ["TypeScript", "Framer Motion"], link: "#", accent: "#f59e0b" },
  { name: "CLI Tool: dbmigrate", desc: "Outil CLI de migration DB safe avec rollback automatique et dry-run.", tech: ["Go", "PostgreSQL"], link: "#", accent: "#10b981" },
]

const TESTIMONIALS = [
  { quote: "Rafaël a livré une architecture qui tiendra 5 ans. Rare de trouver quelqu'un qui pense à la fois en produit et en ingénierie.", name: "Thomas Marchand", role: "CTO, Arkéo SaaS" },
  { quote: "Un développeur qui comprend le business. Il a restructuré notre API en 2 semaines — sans toucher au reste du code.", name: "Léa Fontaine", role: "VP Engineering, Volta Finance" },
]

const FAQS = [
  { q: "Êtes-vous disponible pour des missions freelance ?", a: "Oui, pour des projets d'architecture, de code review ou de développement en parallèle de mon poste principal. Délai de réponse : 24h." },
  { q: "Quelle est votre spécialité technique ?", a: "Architecture full-stack TypeScript (Next.js + NestJS), design systèmes distribués, et refonte de bases de code legacy." },
  { q: "Travaillez-vous en remote ?", a: "Exclusivement. Timezone Paris (CET). Disponible pour des sessions synchrones 9h–18h." },
  { q: "Acceptez-vous les projets court terme ?", a: "Minimum 4 semaines. Pour les revues de code ou audits, je peux intervenir dès 1 semaine." },
]

export default function Page() {
  const [activeSkillCat, setActiveSkillCat] = useState<string | null>(null)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [hoveredProject, setHoveredProject] = useState<number | null>(null)
  const { scrollY } = useScroll()

  const terminalY = useTransform(scrollY, [0, 400], [0, -30])

  const skillsRef = useRef(null)
  const skillsInView = useInView(skillsRef, { once: true, margin: "-100px" })

  const C = {
    bg: "#0a0f0a",
    green: "#00e5b8",
    greenDim: "#00b892",
    text: "#c8d8c8",
    muted: "#4a6a4a",
    card: "#0f160f",
    border: "#1a2a1a",
    mono: "'JetBrains Mono', 'Courier New', monospace",
  }

  const cats = ["dev", "arch", "ops", "design"]

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: C.mono, overflowX: "hidden" }}>
      {/* NAV — terminal prompt style */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(10,15,10,0.95)", borderBottom: `1px solid ${C.border}`, padding: "0 60px", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: C.muted }}>~/</span>
          <span style={{ color: C.green, fontWeight: 700 }}>rafael-moreau</span>
          <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 1 }} style={{ color: C.green }}>_</motion.span>
        </div>
        <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {[".skills", ".timeline", ".projects", ".contact"].map(l => (
            <a key={l} href={`#${l.slice(1)}`} style={{ fontSize: 12, color: C.muted, letterSpacing: 1, textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = C.green)}
              onMouseLeave={e => (e.currentTarget.style.color = C.muted)}>
              {l}
            </a>
          ))}
          <a href="mailto:rafael@moreau.dev"
            style={{ padding: "6px 16px", background: "transparent", color: C.green, border: `1px solid ${C.green}`, fontSize: 11, letterSpacing: 2, textDecoration: "none", transition: "all 0.2s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = C.green; (e.currentTarget as HTMLElement).style.color = C.bg }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = C.green }}>
            $ contact
          </a>
        </div>
      </nav>

      {/* HERO — terminal window */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", paddingTop: 52, padding: "80px 60px" }}>
        <motion.div style={{ y: terminalY }}>
          <div style={{ fontFamily: C.mono, marginBottom: 40 }}>
            <div style={{ color: C.muted, fontSize: 12, marginBottom: 8 }}>$ whoami</div>
            <div style={{ fontSize: "clamp(48px, 8vw, 120px)", fontWeight: 700, color: C.green, letterSpacing: -3, lineHeight: 0.95, marginBottom: 20 }}>
              Rafaël<br />Moreau
            </div>
            <div style={{ fontSize: 14, color: C.muted, marginBottom: 4 }}>→ Lead Engineer · Full-Stack TypeScript</div>
            <div style={{ fontSize: 14, color: C.muted, marginBottom: 40 }}>→ Paris, France · Remote only</div>
          </div>

          {/* Terminal block */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}
            style={{ background: C.card, border: `1px solid ${C.border}`, padding: "32px 40px", maxWidth: 680 }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
              {["#e5534b", "#e3b341", "#3fb950"].map(c => <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />)}
            </div>
            {[
              { prompt: "$ node --version", out: "v22.11.0" },
              { prompt: "$ cat about.txt", out: "6 ans d'expérience · 3 200+ clients livrés · 0 incidents production majeurs" },
              { prompt: "$ npx rafael --speciality", out: "Architecture TypeScript, SaaS B2B, Performance & Scalabilité" },
              { prompt: "$ rafael --available", out: "true · Délai: 2 semaines · Open à nouvelles opportunités" },
            ].map((line, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 + i * 0.3 }}>
                <div style={{ color: C.green, fontSize: 13, marginBottom: 4 }}>{line.prompt}</div>
                <div style={{ color: C.text, fontSize: 13, marginBottom: 16, paddingLeft: 16 }}>{line.out}</div>
              </motion.div>
            ))}
            <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 1 }} style={{ color: C.green }}>_</motion.span>
          </motion.div>

          <div style={{ display: "flex", gap: 24, marginTop: 48 }}>
            <motion.a href="#contact" whileHover={{ background: C.green, color: C.bg }} whileTap={{ scale: 0.97 }}
              style={{ padding: "14px 32px", background: "transparent", color: C.green, border: `1px solid ${C.green}`, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", textDecoration: "none", transition: "all 0.2s", display: "inline-block" }}>
              $ ./contact.sh
            </motion.a>
            <motion.a href="#projects" whileHover={{ color: C.green }} whileTap={{ scale: 0.97 }}
              style={{ padding: "14px 32px", color: C.muted, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", textDecoration: "none", transition: "color 0.2s", display: "inline-block" }}>
              ls ./projects →
            </motion.a>
          </div>
        </motion.div>
      </section>

      {/* SKILLS */}
      <section ref={skillsRef} id="skills" style={{ padding: "80px 60px", borderTop: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48 }}>
          <div style={{ fontSize: 13, color: C.muted, marginBottom: 8 }}>$ cat skills.json</div>
          <div style={{ display: "flex", gap: 8 }}>
            {["Tout", ...cats].map((cat, i) => (
              <button key={cat} onClick={() => setActiveSkillCat(cat === "Tout" ? null : cat)}
                style={{ padding: "4px 14px", background: (cat === "Tout" && !activeSkillCat) || activeSkillCat === cat ? C.green : "transparent", color: (cat === "Tout" && !activeSkillCat) || activeSkillCat === cat ? C.bg : C.muted, border: `1px solid ${C.border}`, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer", transition: "all 0.15s", fontFamily: C.mono }}>
                .{cat}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 800 }}>
          {SKILLS.filter(s => !activeSkillCat || s.category === activeSkillCat).map((skill, i) => (
            <motion.div key={skill.name} initial={{ opacity: 0, x: -20 }} animate={skillsInView ? { opacity: 1, x: 0 } : {}} transition={{ delay: i * 0.06 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: C.text }}>{skill.name}</span>
                <span style={{ fontSize: 12, color: C.green }}>{skill.level}%</span>
              </div>
              <div style={{ height: 2, background: C.border, position: "relative" }}>
                <motion.div initial={{ width: 0 }} animate={skillsInView ? { width: `${skill.level}%` } : {}} transition={{ duration: 1.2, delay: i * 0.06, ease: "easeOut" }}
                  style={{ position: "absolute", top: 0, left: 0, height: "100%", background: C.green }} />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TIMELINE */}
      <section id="timeline" style={{ padding: "80px 60px", borderTop: `1px solid ${C.border}` }}>
        <div style={{ fontSize: 13, color: C.muted, marginBottom: 48 }}>$ git log --oneline --career</div>
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: 140, top: 0, bottom: 0, width: 1, background: C.border }} />
          {TIMELINE.map((item, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.12, duration: 0.6 }}
              style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 40, marginBottom: 56, position: "relative" }}>
              <div>
                <div style={{ fontSize: 11, color: item.accent, letterSpacing: 1, lineHeight: 1.5 }}>{item.year}</div>
              </div>
              <div style={{ paddingLeft: 40, position: "relative" }}>
                <div style={{ position: "absolute", left: -5, top: 5, width: 10, height: 10, background: item.accent, borderRadius: "50%", boxShadow: `0 0 12px ${item.accent}60` }} />
                <div style={{ fontSize: 13, color: item.accent, marginBottom: 4 }}>{item.company}</div>
                <div style={{ fontSize: 17, fontWeight: 700, color: C.text, marginBottom: 12 }}>{item.role}</div>
                <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, marginBottom: 16, maxWidth: 560 }}>{item.desc}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {item.tags.map(t => (
                    <span key={t} style={{ padding: "3px 10px", border: `1px solid ${C.border}`, fontSize: 11, color: C.muted, letterSpacing: 1 }}>{t}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" style={{ padding: "80px 60px", borderTop: `1px solid ${C.border}` }}>
        <div style={{ fontSize: 13, color: C.muted, marginBottom: 48 }}>$ ls ./projects --details</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          {PROJECTS.map((p, i) => (
            <motion.div key={i}
              onHoverStart={() => setHoveredProject(i)}
              onHoverEnd={() => setHoveredProject(null)}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              style={{ background: hoveredProject === i ? C.card : "transparent", border: `1px solid ${hoveredProject === i ? p.accent + "40" : C.border}`, padding: "36px 40px", cursor: "pointer", transition: "all 0.2s" }}>
              <div style={{ fontSize: 11, color: p.accent, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>project_{String(i + 1).padStart(2, "0")}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 12 }}>{p.name}</div>
              <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, marginBottom: 20 }}>{p.desc}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
                {p.tech.map(t => <span key={t} style={{ padding: "3px 10px", border: `1px solid ${C.border}`, fontSize: 11, color: p.accent, letterSpacing: 1 }}>{t}</span>)}
              </div>
              <AnimatePresence>
                {hoveredProject === i && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    style={{ fontSize: 12, color: p.accent, letterSpacing: 2 }}>
                    → Voir le projet
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: "80px 60px", borderTop: `1px solid ${C.border}` }}>
        <div style={{ fontSize: 13, color: C.muted, marginBottom: 48 }}>$ cat testimonials.log</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
          {TESTIMONIALS.map((t, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.2 }}
              style={{ border: `1px solid ${C.border}`, padding: "36px 40px" }}>
              <div style={{ fontSize: 13, color: C.text, lineHeight: 1.8, marginBottom: 24, borderLeft: `2px solid ${C.green}`, paddingLeft: 20 }}>"{t.quote}"</div>
              <div style={{ fontSize: 11, color: C.muted, letterSpacing: 1 }}>— {t.name} · {t.role}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PRICING / RATES */}
      <section style={{ padding: "80px 60px", borderTop: `1px solid ${C.border}` }}>
        <div style={{ fontSize: 13, color: C.muted, marginBottom: 48 }}>$ cat rates.json</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
          {[
            { type: "Code Review", rate: "500 €", unit: "/ session", desc: "Audit complet de votre codebase. Rapport détaillé + session Q&A 2h." },
            { type: "Architecture", rate: "1 200 €", unit: "/ jour", desc: "Design système, ADR, migration plan. Remote ou présentiel Paris.", highlight: true },
            { type: "Développement", rate: "720 €", unit: "/ jour", desc: "Développement full-stack TypeScript. Minimum 4 semaines de mission." },
          ].map((r, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.12 }}
              style={{ border: `1px solid ${r.highlight ? C.green + "40" : C.border}`, padding: "48px 40px", background: r.highlight ? "#0a160a" : "transparent" }}>
              <div style={{ fontSize: 11, color: r.highlight ? C.green : C.muted, letterSpacing: 3, textTransform: "uppercase", marginBottom: 24 }}>{r.type}</div>
              <div style={{ fontSize: 40, fontWeight: 700, color: C.text, letterSpacing: -1, lineHeight: 1 }}>{r.rate}</div>
              <div style={{ fontSize: 12, color: C.muted, marginBottom: 24 }}>{r.unit}</div>
              <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.7 }}>{r.desc}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ maxWidth: 800, margin: "0 auto", padding: "80px 60px" }}>
        <div style={{ fontSize: 13, color: C.muted, marginBottom: 48 }}>$ cat faq.txt</div>
        {FAQS.map((f, i) => (
          <div key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
            <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
              style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 0", background: "none", border: "none", color: C.text, cursor: "pointer", textAlign: "left", fontFamily: C.mono }}>
              <span style={{ fontSize: 14 }}>{f.q}</span>
              <motion.span animate={{ rotate: openFaq === i ? 45 : 0 }} style={{ fontSize: 20, color: C.green, minWidth: 20 }}>+</motion.span>
            </button>
            <AnimatePresence>
              {openFaq === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <p style={{ paddingBottom: 20, fontSize: 13, color: C.muted, lineHeight: 1.8 }}>{f.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section id="contact" style={{ borderTop: `2px solid ${C.green}`, padding: "80px 60px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 13, color: C.muted, marginBottom: 16 }}>$ rafael --contact</div>
          <div style={{ fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 700, color: C.green, letterSpacing: -2, lineHeight: 1.1, marginBottom: 24 }}>
            Parlons de<br />votre projet.
          </div>
          <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.8 }}>
            Réponse sous 24h.<br />
            rafael@moreau.dev
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[{ ph: "$ nom --required", type: "text" }, { ph: "$ email --required", type: "email" }, { ph: "$ budget approximatif", type: "text" }].map((inp, i) => (
            <input key={i} placeholder={inp.ph} type={inp.type}
              style={{ padding: "14px 20px", background: C.card, border: `1px solid ${C.border}`, color: C.text, fontFamily: C.mono, fontSize: 13, outline: "none", letterSpacing: 1, transition: "border-color 0.2s" }}
              onFocus={e => (e.currentTarget.style.borderColor = C.green)}
              onBlur={e => (e.currentTarget.style.borderColor = C.border)} />
          ))}
          <textarea placeholder="$ message --your-project" rows={4}
            style={{ padding: "14px 20px", background: C.card, border: `1px solid ${C.border}`, color: C.text, fontFamily: C.mono, fontSize: 13, outline: "none", resize: "none", letterSpacing: 1 }}
            onFocus={e => (e.currentTarget.style.borderColor = C.green)}
            onBlur={e => (e.currentTarget.style.borderColor = C.border)} />
          <motion.button whileHover={{ background: C.green, color: C.bg }} whileTap={{ scale: 0.97 }}
            style={{ padding: "14px", background: "transparent", color: C.green, border: `1px solid ${C.green}`, fontFamily: C.mono, fontSize: 12, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer", transition: "all 0.2s" }}>
            $ ./send-message.sh →
          </motion.button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: `1px solid ${C.border}`, padding: "28px 60px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 12, color: C.muted }}>~/rafael-moreau · © 2025</span>
        <div style={{ display: "flex", gap: 24 }}>
          {["GitHub", "LinkedIn", "MessageSquare"].map(l => (
            <span key={l} style={{ fontSize: 11, color: C.muted, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer" }}>{l}</span>
          ))}
        </div>
      </footer>
    </div>
  )
}
