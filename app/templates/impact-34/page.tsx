"use client"
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion"
import React, { useRef, useState, useEffect } from "react"
import Link from "next/link"
import { Mic, Headphones, Play, Pause, Radio, BarChart2, Users, Star, ChevronDown, ChevronRight, Rss, Globe, Zap, Shield, Upload, TrendingUp, CheckCircle, ArrowRight } from "lucide-react"

const C = {
  bg: "#0a0a0f",
  surface: "#12121a",
  card: "#1a1a28",
  border: "#2a2a3d",
  accent: "#7c3aed",
  accentLight: "#a78bfa",
  accentGlow: "#7c3aed33",
  yellow: "#f59e0b",
  text: "#f8fafc",
  muted: "#94a3b8",
  subtle: "#64748b",
}

const PLANS = [
  { name: "Starter", price: "0", period: "free forever", highlight: false, features: ["5 episodes/month", "500 MB storage", "Basic analytics", "RSS feed", "Embed player"] },
  { name: "Pro", price: "19", period: "/mo", highlight: true, features: ["Unlimited episodes", "50 GB storage", "Advanced analytics", "Custom domain", "Monetization tools", "Priority support"] },
  { name: "Enterprise", price: "79", period: "/mo", highlight: false, features: ["Unlimited everything", "500 GB storage", "Team collaboration", "White-label player", "API access", "Dedicated support"] },
]

const FEATURES = [
  { icon: Upload, title: "One-click publish", desc: "Drag & drop your audio, fill in metadata, hit publish. Distributed to all major platforms in minutes." },
  { icon: BarChart2, title: "Deep analytics", desc: "Track listens, drop-off points, geographic data, and subscriber growth with real-time dashboards." },
  { icon: Globe, title: "Global CDN", desc: "Your episodes load instantly worldwide thanks to our 200-node content delivery network." },
  { icon: Zap, title: "AI transcriptions", desc: "Automatic, accurate transcripts for every episode. Great for SEO and accessibility." },
  { icon: Shield, title: "Private feeds", desc: "Monetize premium content with password-protected private RSS feeds for paying subscribers." },
  { icon: TrendingUp, title: "Monetization", desc: "Dynamic ad insertion, listener donations, and premium subscriptions — all built in." },
]

const SHOWS = [
  { title: "The Founder Files", category: "Business", listeners: "142K", rating: 4.9, eps: 212, color: "#f59e0b" },
  { title: "Deep Tech Weekly", category: "Technology", listeners: "89K", rating: 4.8, eps: 156, color: "#7c3aed" },
  { title: "Mind & Movement", category: "Wellness", listeners: "201K", rating: 4.9, eps: 88, color: "#10b981" },
  { title: "True Crime Files", category: "True Crime", listeners: "310K", rating: 4.7, eps: 74, color: "#ef4444" },
]

const TESTIMONIALS = [
  { name: "Sarah Chen", role: "Host, 'The Daily Brief'", quote: "WaveForm took my podcast from 200 to 15,000 monthly listeners in 4 months. The analytics alone are worth every penny.", listeners: "15K" },
  { name: "Marcus Webb", role: "Co-host, 'Startup Stories'", quote: "Switching from another platform was seamless. The AI transcriptions save me 3 hours per episode on show notes.", listeners: "42K" },
  { name: "Amira Khalil", role: "Solo creator, 'Mind Matters'", quote: "The monetization features pay for the Pro plan 10x over. I can focus on content, not tech.", listeners: "28K" },
]

const FAQS = [
  { q: "Can I migrate from another platform?", a: "Yes — our import tool pulls all your episodes, artwork, and metadata from Spotify, Anchor, Buzzsprout, or any RSS feed. Migration takes under 5 minutes." },
  { q: "Do you take a cut of my revenue?", a: "Never. Your earnings are 100% yours. We charge a flat monthly fee, never a revenue percentage." },
  { q: "Which platforms will my podcast appear on?", a: "Spotify, Apple Podcasts, Google Podcasts, Amazon Music, Pocket Casts, and 20+ others — automatically, on publish." },
  { q: "How does the free plan work?", a: "Free forever with no credit card required. Just limited to 5 episodes/month and 500 MB. Perfect for testing." },
  { q: "Is there a contract or lock-in?", a: "Monthly billing, cancel any time. Your RSS feed remains yours — you can always take your listeners elsewhere." },
]

function EQBar({ delay, height }: { delay: number; height: number }) {
  return (
    <motion.div
      style={{ width: 4, background: C.accent, borderRadius: 2, display: "inline-block", margin: "0 2px" }}
      animate={{ height: [8, height, 8] }}
      transition={{ duration: 0.8 + delay * 0.3, repeat: Infinity, delay, ease: "easeInOut" }}
    />
  )
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 32 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  )
}

export default function WaveFormPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [playing, setPlaying] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -60])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0])

  const barHeights = [16, 40, 28, 56, 36, 48, 20, 60, 32, 52, 24, 44, 36, 56, 28, 40, 20, 52, 36, 48, 28, 44, 32, 56]

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
  }, [])

  return (
    <div ref={containerRef} style={{ background: C.bg, color: C.text, fontFamily: "'Space Grotesk', system-ui, sans-serif", minHeight: "100vh" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; }`}</style>

      {/* NAVBAR */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", background: scrolled ? `${C.surface}ee` : "transparent", backdropFilter: scrolled ? "blur(12px)" : "none", borderBottom: scrolled ? `1px solid ${C.border}` : "none", transition: "all 0.3s" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <div style={{ width: 32, height: 32, background: C.accent, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Mic size={18} color="#fff" />
          </div>
          <span style={{ fontSize: 20, fontWeight: 700, color: C.text }}>WaveForm</span>
        </Link>
        <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {["Features", "Pricing", "Creators", "Blog"].map(l => (
            <Link key={l} href="#" style={{ color: C.muted, textDecoration: "none", fontSize: 14, fontWeight: 500 }}
              onMouseEnter={e => (e.currentTarget.style.color = C.text)}
              onMouseLeave={e => (e.currentTarget.style.color = C.muted)}>{l}</Link>
          ))}
          <Link href="#" style={{ padding: "8px 20px", background: C.accent, color: "#fff", borderRadius: 8, textDecoration: "none", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Start free</Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "100px 24px 60px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${C.accentGlow} 0%, transparent 70%)`, pointerEvents: "none" }} />
        <motion.div style={{ y: heroY, opacity: heroOpacity }}>
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", background: C.accentGlow, border: `1px solid ${C.accent}44`, borderRadius: 20, marginBottom: 32, fontSize: 13, color: C.accentLight, fontWeight: 500 }}>
            <Radio size={14} /> Now hosting 50,000+ shows worldwide
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
            style={{ fontSize: "clamp(40px, 8vw, 80px)", fontWeight: 700, lineHeight: 1.1, marginBottom: 24, maxWidth: 800 }}>
            Your podcast,{" "}<span style={{ color: C.accentLight }}>everywhere</span>{" "}it matters
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            style={{ fontSize: 20, color: C.muted, maxWidth: 520, lineHeight: 1.6, marginBottom: 48 }}>
            Publish once. Reach listeners on every platform. Grow with analytics that actually make sense.
          </motion.p>

          {/* EQ Bars */}
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}
            style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", height: 70, marginBottom: 48, gap: 0 }}>
            {barHeights.map((h, i) => <EQBar key={i} delay={i * 0.05} height={h} />)}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="#" style={{ padding: "14px 32px", background: C.accent, color: "#fff", borderRadius: 10, textDecoration: "none", fontSize: 16, fontWeight: 600, display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
              Start for free <ArrowRight size={18} />
            </Link>
            <button onClick={() => setPlaying(!playing)}
              style={{ padding: "14px 32px", background: C.card, color: C.text, border: `1px solid ${C.border}`, borderRadius: 10, fontSize: 16, fontWeight: 500, display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
              {playing ? <Pause size={18} /> : <Play size={18} />} {playing ? "Pause demo" : "Hear it in action"}
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* STATS */}
      <section style={{ padding: "60px 24px", borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 40, textAlign: "center" }}>
          {[["50K+", "Active shows"], ["12M+", "Monthly listens"], ["200+", "CDN nodes"], ["4.9★", "Average rating"]].map(([num, label]) => (
            <Reveal key={label}>
              <div style={{ fontSize: 44, fontWeight: 700, color: C.accentLight, marginBottom: 8 }}>{num}</div>
              <div style={{ fontSize: 15, color: C.muted }}>{label}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <h2 style={{ fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 700, marginBottom: 16 }}>Everything you need to grow</h2>
              <p style={{ fontSize: 18, color: C.muted, maxWidth: 480, margin: "0 auto" }}>One platform, every tool. No plugins, no integrations to manage.</p>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.08}>
                <div style={{ padding: 32, background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, transition: "border-color 0.3s", cursor: "default" }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = C.accent)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}>
                  <div style={{ width: 44, height: 44, background: C.accentGlow, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                    <f.icon size={22} color={C.accentLight} />
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>{f.title}</h3>
                  <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED SHOWS */}
      <section style={{ padding: "80px 24px", background: C.surface }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 48, flexWrap: "wrap", gap: 16 }}>
              <h2 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 700 }}>Top shows on WaveForm</h2>
              <Link href="#" style={{ color: C.accentLight, textDecoration: "none", fontSize: 14, fontWeight: 500, display: "flex", alignItems: "center", gap: 4 }}>Browse all <ChevronRight size={16} /></Link>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
            {SHOWS.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.1}>
                <div style={{ padding: 24, background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, cursor: "pointer", transition: "transform 0.2s, border-color 0.2s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLElement).style.borderColor = s.color }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.borderColor = C.border }}>
                  <div style={{ width: 56, height: 56, background: `${s.color}22`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, border: `2px solid ${s.color}44` }}>
                    <Headphones size={26} color={s.color} />
                  </div>
                  <div style={{ fontSize: 11, color: s.color, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>{s.category}</div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>{s.title}</h3>
                  <div style={{ display: "flex", gap: 16, fontSize: 13, color: C.muted }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Users size={13} />{s.listeners}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Star size={13} color={C.yellow} />{s.rating}</span>
                    <span>{s.eps} eps</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal><h2 style={{ fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 700, textAlign: "center", marginBottom: 64 }}>Loved by creators</h2></Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.1}>
                <div style={{ padding: 32, background: C.card, border: `1px solid ${C.border}`, borderRadius: 16 }}>
                  <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
                    {[1,2,3,4,5].map(s => <Star key={s} size={16} color={C.yellow} fill={C.yellow} />)}
                  </div>
                  <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.7, marginBottom: 24, fontStyle: "italic" }}>"{t.quote}"</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 40, height: 40, background: C.accentGlow, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Mic size={18} color={C.accentLight} />
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{t.name}</div>
                      <div style={{ fontSize: 12, color: C.subtle }}>{t.role}</div>
                    </div>
                    <div style={{ marginLeft: "auto", padding: "4px 10px", background: C.accentGlow, borderRadius: 6, fontSize: 12, color: C.accentLight, fontWeight: 600 }}>{t.listeners} listeners</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section style={{ padding: "100px 24px", background: C.surface }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <h2 style={{ fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 700, marginBottom: 16 }}>Simple, honest pricing</h2>
              <p style={{ fontSize: 18, color: C.muted }}>No revenue cuts. No surprise fees. Cancel any time.</p>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {PLANS.map((plan, i) => (
              <Reveal key={plan.name} delay={i * 0.1}>
                <div style={{ padding: 32, background: plan.highlight ? `${C.accent}22` : C.card, border: `2px solid ${plan.highlight ? C.accent : C.border}`, borderRadius: 16, position: "relative" }}>
                  {plan.highlight && <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", padding: "4px 16px", background: C.accent, borderRadius: 12, fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>Most popular</div>}
                  <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>{plan.name}</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 24 }}>
                    <span style={{ fontSize: 48, fontWeight: 700, color: plan.highlight ? C.accentLight : C.text }}>€{plan.price}</span>
                    <span style={{ fontSize: 15, color: C.muted }}>{plan.period}</span>
                  </div>
                  <ul style={{ listStyle: "none", marginBottom: 32, display: "flex", flexDirection: "column", gap: 12 }}>
                    {plan.features.map(f => (
                      <li key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: C.muted }}>
                        <CheckCircle size={16} color={plan.highlight ? C.accentLight : C.subtle} />{f}
                      </li>
                    ))}
                  </ul>
                  <Link href="#" style={{ display: "block", textAlign: "center", padding: "12px", background: plan.highlight ? C.accent : C.border, color: "#fff", borderRadius: 10, textDecoration: "none", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>Get started</Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <Reveal><h2 style={{ fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 700, textAlign: "center", marginBottom: 64 }}>Common questions</h2></Reveal>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {FAQS.map((faq, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <div style={{ border: `1px solid ${openFaq === i ? C.accent : C.border}`, borderRadius: 12, overflow: "hidden", transition: "border-color 0.3s" }}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{ width: "100%", padding: "20px 24px", background: C.card, color: C.text, border: "none", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", fontSize: 15, fontWeight: 500, textAlign: "left" }}>
                    {faq.q}
                    <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown size={18} color={C.muted} />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} style={{ overflow: "hidden" }}>
                        <div style={{ padding: "0 24px 20px", fontSize: 14, color: C.muted, lineHeight: 1.7 }}>{faq.a}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 24px", background: `linear-gradient(135deg, ${C.accent}33 0%, transparent 60%)`, borderTop: `1px solid ${C.border}` }}>
        <Reveal>
          <div style={{ textAlign: "center", maxWidth: 600, margin: "0 auto" }}>
            <h2 style={{ fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 700, marginBottom: 16 }}>Ready to launch your show?</h2>
            <p style={{ fontSize: 18, color: C.muted, marginBottom: 40 }}>Join 50,000+ creators. Free forever — upgrade when you're ready.</p>
            <Link href="#" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 40px", background: C.accent, color: "#fff", borderRadius: 12, textDecoration: "none", fontSize: 18, fontWeight: 600, cursor: "pointer" }}>
              Start for free <ArrowRight size={20} />
            </Link>
          </div>
        </Reveal>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "60px 24px 32px", borderTop: `1px solid ${C.border}`, background: C.surface }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 48 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <div style={{ width: 32, height: 32, background: C.accent, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}><Mic size={18} color="#fff" /></div>
                <span style={{ fontSize: 18, fontWeight: 700 }}>WaveForm</span>
              </div>
              <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7, maxWidth: 260 }}>The podcast platform built for creators who want to focus on content, not tech stack.</p>
            </div>
            {[
              { title: "Product", links: ["Features", "Pricing", "Changelog", "Roadmap"] },
              { title: "Resources", links: ["Blog", "Help Center", "API Docs", "Status"] },
              { title: "Company", links: ["About", "Careers", "Press", "Contact"] },
            ].map(col => (
              <div key={col.title}>
                <h4 style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: C.subtle, marginBottom: 16 }}>{col.title}</h4>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                  {col.links.map(l => (
                    <li key={l}><Link href="#" style={{ color: C.muted, textDecoration: "none", fontSize: 14 }}
                      onMouseEnter={e => (e.currentTarget.style.color = C.text)}
                      onMouseLeave={e => (e.currentTarget.style.color = C.muted)}>{l}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <span style={{ fontSize: 13, color: C.subtle }}>© 2026 WaveForm Inc. All rights reserved.</span>
            <div style={{ display: "flex", gap: 16 }}>
              {["Privacy", "Terms", "Cookies"].map(l => <Link key={l} href="#" style={{ color: C.subtle, textDecoration: "none", fontSize: 13 }}>{l}</Link>)}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
