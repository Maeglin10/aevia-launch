"use client"
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion"
import React, { useRef, useState, useEffect } from "react"
import Link from "next/link"
import { Search, Play, Star, Users, Clock, ChevronDown, ArrowRight, CheckCircle, BookOpen, Zap, Award, BarChart2, Globe, ChevronRight, TrendingUp, Video } from "lucide-react"

const C = {
  bg: "#0d0020",
  surface: "#13002e",
  card: "#1a003d",
  border: "#2d006b",
  accent: "#7c3aed",
  accentLight: "#a78bfa",
  yellow: "#fbbf24",
  teal: "#0d9488",
  tealLight: "#2dd4bf",
  text: "#f8fafc",
  muted: "#94a3b8",
  subtle: "#64748b",
}

const CATEGORIES = [
  { icon: BarChart2, name: "Business & Finance", courses: 1240, color: C.yellow },
  { icon: Zap, name: "Design & Creative", courses: 980, color: "#f472b6" },
  { icon: Globe, name: "Marketing & Growth", courses: 760, color: C.tealLight },
  { icon: BookOpen, name: "Personal Development", courses: 840, color: "#fb923c" },
  { icon: Video, name: "Video & Photo", courses: 560, color: "#a78bfa" },
  { icon: TrendingUp, name: "Investing & Wealth", courses: 420, color: C.yellow },
]

const COURSES = [
  { title: "The Complete Growth Hacking Playbook", instructor: "Marc Dupont", rating: 4.9, students: "12,400", duration: "14h", price: "€89", category: "Marketing", badge: "Bestseller" },
  { title: "UX Design Mastery: From Zero to Senior", instructor: "Sofia Müller", rating: 4.8, students: "8,200", duration: "22h", price: "€94", category: "Design", badge: "New" },
  { title: "Financial Freedom: Build Your Portfolio", instructor: "Thomas Roux", rating: 4.9, students: "21,000", duration: "18h", price: "€79", category: "Investing", badge: "Bestseller" },
  { title: "Storytelling for Leaders", instructor: "Emma Laurent", rating: 4.7, students: "5,600", duration: "8h", price: "€59", category: "Development", badge: null },
]

const PATHS = [
  { name: "Growth Marketer Path", steps: 7, hours: "48h", level: "Beginner → Advanced", color: C.teal, desc: "Master SEO, paid ads, email marketing, and analytics to drive scalable growth." },
  { name: "Product Manager Path", steps: 6, hours: "40h", level: "Mid → Senior", color: C.accent, desc: "From user research to roadmap strategy — become the PM that product teams trust." },
  { name: "Solopreneur Path", steps: 5, hours: "32h", level: "All levels", color: C.yellow, desc: "Launch, grow, and monetize your expertise as an independent professional." },
]

const INSTRUCTORS = [
  { name: "Marc Dupont", specialty: "Growth & Marketing", students: "34K", courses: 8, rating: 4.9 },
  { name: "Sofia Müller", specialty: "UX & Product Design", students: "21K", courses: 5, rating: 4.8 },
  { name: "Thomas Roux", specialty: "Finance & Investing", students: "58K", courses: 12, rating: 4.9 },
]

const PLANS = [
  { name: "Free", price: "€0", period: "forever", highlight: false, features: ["3 free courses/month", "Community access", "Certificate of completion", "Mobile app"] },
  { name: "Pro", price: "€29", period: "/month", highlight: true, features: ["Unlimited courses", "Learning paths", "1:1 mentor sessions (2/mo)", "Offline downloads", "Priority support", "LinkedIn certificate"] },
  { name: "Teams", price: "€19", period: "/user/mo", highlight: false, features: ["Everything in Pro", "Team dashboard", "Progress tracking", "Custom learning paths", "Invoicing & SSO", "Dedicated CSM"] },
]

const FAQS = [
  { q: "Are courses available in French?", a: "Yes — over 60% of our catalog is available in French, with English subtitles available for all courses. New French-language content is added weekly." },
  { q: "Can I get a refund?", a: "Absolutely. We offer a 30-day money-back guarantee on Pro subscriptions, no questions asked." },
  { q: "Will I receive a certificate?", a: "Yes — every completed course generates a verified certificate you can share on LinkedIn or add to your CV." },
  { q: "Can I access courses offline?", a: "Pro subscribers can download any course for offline viewing on iOS or Android. Perfect for travel and commuting." },
  { q: "Do you offer corporate training?", a: "Yes — our Teams plan includes a dedicated customer success manager, custom content, and full analytics. Contact us for a demo." },
]

function SkillBar({ label, pct, color, delay }: { label: string; pct: number; color: string; delay: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  return (
    <div ref={ref} style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: C.muted, marginBottom: 6 }}>
        <span>{label}</span><span style={{ color }}>{pct}%</span>
      </div>
      <div style={{ height: 6, background: C.border, borderRadius: 3, overflow: "hidden" }}>
        <motion.div initial={{ width: 0 }} animate={{ width: inView ? `${pct}%` : 0 }} transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
          style={{ height: "100%", background: color, borderRadius: 3 }} />
      </div>
    </div>
  )
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  )
}

export default function SkillbridgePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -60])

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
  }, [])

  return (
    <div ref={containerRef} style={{ background: C.bg, color: C.text, fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", minHeight: "100vh" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; }`}</style>

      {/* NAVBAR */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", background: scrolled ? `${C.surface}f0` : "transparent", backdropFilter: scrolled ? "blur(12px)" : "none", borderBottom: scrolled ? `1px solid ${C.border}` : "none", transition: "all 0.3s" }}>
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 32, height: 32, background: `linear-gradient(135deg, ${C.accent}, ${C.teal})`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <BookOpen size={17} color="#fff" />
          </div>
          <span style={{ fontSize: 18, fontWeight: 700, color: C.text }}>Skillbridge</span>
        </Link>
        <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {["Courses", "Paths", "Instructors", "Pricing"].map(l => (
            <Link key={l} href="#" style={{ color: C.muted, textDecoration: "none", fontSize: 14, fontWeight: 500, transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = C.text)}
              onMouseLeave={e => (e.currentTarget.style.color = C.muted)}>{l}</Link>
          ))}
          <Link href="#" style={{ padding: "9px 22px", background: `linear-gradient(135deg, ${C.accent}, ${C.teal})`, color: "#fff", borderRadius: 8, textDecoration: "none", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Start free</Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "100px 24px 60px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 80% 50% at 50% 0%, ${C.accent}33 0%, transparent 65%)`, pointerEvents: "none" }} />
        <motion.div style={{ y: heroY }}>
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", background: `${C.yellow}22`, border: `1px solid ${C.yellow}44`, borderRadius: 20, marginBottom: 28, fontSize: 13, color: C.yellow, fontWeight: 600 }}>
            <Award size={14} /> #1 professional learning platform in France
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
            style={{ fontSize: "clamp(36px, 7vw, 76px)", fontWeight: 800, lineHeight: 1.1, marginBottom: 24, maxWidth: 800 }}>
            Learn the skills<br /><span style={{ background: `linear-gradient(135deg, ${C.accentLight}, ${C.tealLight})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>that actually get you hired</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            style={{ fontSize: 19, color: C.muted, maxWidth: 500, lineHeight: 1.6, marginBottom: 40 }}>
            500+ expert-led courses. Structured learning paths. Certificates that employers recognise.
          </motion.p>

          {/* Search bar */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            style={{ display: "flex", maxWidth: 600, margin: "0 auto 20px", background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", padding: "0 16px" }}><Search size={18} color={C.muted} /></div>
            <input placeholder="What do you want to learn today?" readOnly
              style={{ flex: 1, padding: "16px 0", background: "transparent", border: "none", outline: "none", fontSize: 15, color: C.text, cursor: "pointer" }} />
            <button style={{ padding: "12px 24px", background: `linear-gradient(135deg, ${C.accent}, ${C.teal})`, color: "#fff", border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Search</button>
          </motion.div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            style={{ fontSize: 13, color: C.subtle }}>Popular: Growth Hacking · UX Design · Finance · Python</motion.p>
        </motion.div>
      </section>

      {/* STATS */}
      <section style={{ padding: "60px 24px", borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 32, textAlign: "center" }}>
          {[["500+", "Expert courses"], ["120K+", "Active learners"], ["92%", "Completion rate"], ["4.8★", "Average rating"]].map(([num, label]) => (
            <Reveal key={label}>
              <div style={{ fontSize: 40, fontWeight: 800, color: C.accentLight, marginBottom: 6 }}>{num}</div>
              <div style={{ fontSize: 14, color: C.muted }}>{label}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <h2 style={{ fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 700, textAlign: "center", marginBottom: 56 }}>Browse by category</h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16 }}>
            {CATEGORIES.map((cat, i) => (
              <Reveal key={cat.name} delay={i * 0.07}>
                <div style={{ padding: "28px 20px", background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, textAlign: "center", cursor: "pointer", transition: "border-color 0.2s, transform 0.2s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = cat.color; (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)" }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = C.border; (e.currentTarget as HTMLElement).style.transform = "translateY(0)" }}>
                  <cat.icon size={28} color={cat.color} style={{ marginBottom: 12 }} />
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 4, lineHeight: 1.4 }}>{cat.name}</div>
                  <div style={{ fontSize: 12, color: C.subtle }}>{cat.courses.toLocaleString()} courses</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED COURSES */}
      <section style={{ padding: "80px 24px", background: C.surface }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 48, flexWrap: "wrap", gap: 16 }}>
              <h2 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 700 }}>Featured courses</h2>
              <Link href="#" style={{ color: C.accentLight, textDecoration: "none", fontSize: 14, fontWeight: 500, display: "flex", alignItems: "center", gap: 4 }}>Browse all 500+ <ChevronRight size={16} /></Link>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
            {COURSES.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.08}>
                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", cursor: "pointer", transition: "transform 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-4px)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}>
                  <div style={{ height: 140, background: `linear-gradient(135deg, ${C.accent}44, ${C.teal}44)`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                    <Play size={40} color={C.accentLight} />
                    {c.badge && <div style={{ position: "absolute", top: 12, left: 12, padding: "3px 10px", background: c.badge === "Bestseller" ? C.yellow : C.teal, color: c.badge === "Bestseller" ? "#000" : "#fff", fontSize: 11, fontWeight: 700, borderRadius: 4 }}>{c.badge}</div>}
                  </div>
                  <div style={{ padding: 20 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: C.text, lineHeight: 1.4, marginBottom: 8 }}>{c.title}</h3>
                    <p style={{ fontSize: 12, color: C.subtle, marginBottom: 12 }}>{c.instructor}</p>
                    <div style={{ display: "flex", gap: 12, fontSize: 12, color: C.muted, marginBottom: 16 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Star size={12} color={C.yellow} fill={C.yellow} />{c.rating}</span>
                      <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Users size={12} />{c.students}</span>
                      <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Clock size={12} />{c.duration}</span>
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: C.text }}>{c.price}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SKILL BARS */}
      <section style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
          <Reveal>
            <div>
              <div style={{ fontSize: 11, color: C.yellow, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16 }}>Learning paths</div>
              <h2 style={{ fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 700, marginBottom: 16 }}>Structured paths to your next role</h2>
              <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.7, marginBottom: 32 }}>Not just courses — curated journeys that take you from where you are to where you want to be.</p>
              <Link href="#" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: C.accentLight, textDecoration: "none", fontSize: 14, fontWeight: 600 }}>
                Explore all paths <ArrowRight size={16} />
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div style={{ padding: 32, background: C.card, border: `1px solid ${C.border}`, borderRadius: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 24 }}>Skills you'll build in our Growth Marketer Path</div>
              {[
                ["SEO & Content", 92, C.tealLight],
                ["Paid Acquisition", 85, C.accent],
                ["Email Marketing", 88, C.yellow],
                ["Analytics & Data", 78, "#f472b6"],
              ].map(([label, pct, color], i) => (
                <SkillBar key={String(label)} label={String(label)} pct={Number(pct)} color={String(color)} delay={i * 0.15} />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* INSTRUCTORS */}
      <section style={{ padding: "80px 24px", background: C.surface }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Reveal><h2 style={{ fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 700, textAlign: "center", marginBottom: 56 }}>Learn from the best</h2></Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
            {INSTRUCTORS.map((inst, i) => (
              <Reveal key={inst.name} delay={i * 0.1}>
                <div style={{ padding: 28, background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, textAlign: "center" }}>
                  <div style={{ width: 64, height: 64, background: `linear-gradient(135deg, ${C.accent}44, ${C.teal}44)`, borderRadius: "50%", margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <BookOpen size={28} color={C.accentLight} />
                  </div>
                  <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 4 }}>{inst.name}</h3>
                  <p style={{ fontSize: 13, color: C.subtle, marginBottom: 16 }}>{inst.specialty}</p>
                  <div style={{ display: "flex", gap: 16, justifyContent: "center", fontSize: 13, color: C.muted }}>
                    <span><span style={{ color: C.text, fontWeight: 600 }}>{inst.students}</span> students</span>
                    <span><span style={{ color: C.text, fontWeight: 600 }}>{inst.courses}</span> courses</span>
                    <span><Star size={12} color={C.yellow} fill={C.yellow} style={{ display: "inline", verticalAlign: "middle" }} /> {inst.rating}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <h2 style={{ fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 700, marginBottom: 16 }}>Invest in yourself</h2>
              <p style={{ fontSize: 18, color: C.muted }}>Start free. Upgrade when you're ready. Cancel any time.</p>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {PLANS.map((plan, i) => (
              <Reveal key={plan.name} delay={i * 0.1}>
                <div style={{ padding: 36, background: plan.highlight ? `${C.accent}22` : C.card, border: `2px solid ${plan.highlight ? C.accent : C.border}`, borderRadius: 16, position: "relative" }}>
                  {plan.highlight && <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", padding: "4px 18px", background: `linear-gradient(135deg, ${C.accent}, ${C.teal})`, color: "#fff", borderRadius: 12, fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>Most popular</div>}
                  <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{plan.name}</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 28 }}>
                    <span style={{ fontSize: 44, fontWeight: 800, color: plan.highlight ? C.accentLight : C.text }}>{plan.price}</span>
                    <span style={{ fontSize: 14, color: C.muted }}>{plan.period}</span>
                  </div>
                  <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
                    {plan.features.map(f => (
                      <li key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: C.muted }}>
                        <CheckCircle size={15} color={plan.highlight ? C.accentLight : C.subtle} />{f}
                      </li>
                    ))}
                  </ul>
                  <Link href="#" style={{ display: "block", textAlign: "center", padding: "13px", background: plan.highlight ? `linear-gradient(135deg, ${C.accent}, ${C.teal})` : C.border, color: "#fff", borderRadius: 10, textDecoration: "none", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
                    {plan.price === "€0" ? "Start free" : "Get started"}
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "100px 24px", background: C.surface }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <Reveal><h2 style={{ fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 700, textAlign: "center", marginBottom: 64 }}>Any questions?</h2></Reveal>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {FAQS.map((faq, i) => (
              <div key={i} style={{ border: `1px solid ${openFaq === i ? C.accent : C.border}`, borderRadius: 12, overflow: "hidden", transition: "border-color 0.3s" }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: "100%", padding: "18px 24px", background: C.card, color: C.text, border: "none", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", fontSize: 15, fontWeight: 500, textAlign: "left", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {faq.q}
                  <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown size={18} color={C.muted} />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} style={{ overflow: "hidden" }}>
                      <div style={{ padding: "0 24px 18px", fontSize: 14, color: C.muted, lineHeight: 1.7 }}>{faq.a}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "64px 24px 32px", borderTop: `1px solid ${C.border}`, background: C.bg }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 48 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <div style={{ width: 32, height: 32, background: `linear-gradient(135deg, ${C.accent}, ${C.teal})`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}><BookOpen size={17} color="#fff" /></div>
                <span style={{ fontSize: 18, fontWeight: 700 }}>Skillbridge</span>
              </div>
              <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7, maxWidth: 260 }}>The professional learning platform that turns knowledge into opportunities.</p>
            </div>
            {[
              { title: "Learn", links: ["Browse courses", "Learning paths", "Free courses", "Certifications"] },
              { title: "Teach", links: ["Become an instructor", "Creator tools", "Community", "Resources"] },
              { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
            ].map(col => (
              <div key={col.title}>
                <h4 style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: C.subtle, marginBottom: 16 }}>{col.title}</h4>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                  {col.links.map(l => <li key={l}><Link href="#" style={{ color: C.muted, textDecoration: "none", fontSize: 14 }}
                    onMouseEnter={e => (e.currentTarget.style.color = C.text)}
                    onMouseLeave={e => (e.currentTarget.style.color = C.muted)}>{l}</Link></li>)}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 24, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <span style={{ fontSize: 13, color: C.subtle }}>© 2026 Skillbridge SAS. All rights reserved.</span>
            <div style={{ display: "flex", gap: 20 }}>
              {["Privacy", "Terms", "Accessibility"].map(l => <Link key={l} href="#" style={{ color: C.subtle, textDecoration: "none", fontSize: 13 }}>{l}</Link>)}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
