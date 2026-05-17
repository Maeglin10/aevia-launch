"use client"

import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import { BarChart3, TrendingUp, Users, Zap, ArrowRight, CheckCircle, ChevronDown, Activity, Globe, Shield } from "lucide-react"

function useFonts() {
  useEffect(() => {
    if (document.getElementById("impact-25-fonts")) return
    const style = document.createElement("style")
    style.id = "impact-25-fonts"
    style.textContent = `@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');`
    document.head.appendChild(style)
  }, [])
}

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

const metrics = [
  { label: "Sessions", value: "2.4M", change: "+18.2%", up: true },
  { label: "Conversion Rate", value: "4.7%", change: "+0.9pts", up: true },
  { label: "Avg. Revenue", value: "$84", change: "-2.1%", up: false },
  { label: "Active Users", value: "128K", change: "+31%", up: true },
]

const integrations = [
  "Stripe", "Shopify", "HubSpot", "Salesforce", "Segment", "BigQuery",
  "PostgreSQL", "Snowflake", "Mixpanel", "Amplitude", "Google Analytics", "Intercom"
]

const plans = [
  {
    name: "Starter", price: "$49", period: "/mo",
    features: ["Up to 100K events/mo", "3 dashboards", "7-day retention", "Email support"],
    cta: "Start free", highlight: false,
  },
  {
    name: "Growth", price: "$199", period: "/mo",
    features: ["Up to 5M events/mo", "Unlimited dashboards", "90-day retention", "Funnels & cohorts", "Slack support"],
    cta: "Start free trial", highlight: true,
  },
  {
    name: "Enterprise", price: "Custom", period: "",
    features: ["Unlimited events", "Custom retention", "SSO & SAML", "SLA guarantee", "Dedicated CSM"],
    cta: "Contact sales", highlight: false,
  },
]

const faqs = [
  { q: "How is event volume calculated?", a: "Each unique user action tracked via our SDK counts as one event. Page views, clicks, and custom events all count." },
  { q: "Can I self-host Prism?", a: "Yes — our Enterprise plan includes a self-hosted option with Docker/Kubernetes deployment guides." },
  { q: "Is there a free trial?", a: "Growth plan comes with a 14-day free trial. No credit card required. Starter is free up to 10K events." },
  { q: "How does data retention work?", a: "Raw events are retained per your plan. Aggregated metrics and dashboards are always available regardless of retention." },
]

export default function Impact25() {
  useFonts()
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -50])
  const [annual, setAnnual] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeMetric, setActiveMetric] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setActiveMetric(m => (m + 1) % metrics.length), 2500)
    return () => clearInterval(t)
  }, [])

  return (
    <div ref={containerRef} className="min-h-screen bg-[#0B0F1A] text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#6C47FF] to-[#A78BFA] origin-left z-50"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Nav */}
      <nav className="fixed top-4 left-4 right-4 z-40">
        <div className="max-w-6xl mx-auto bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#6C47FF] to-[#A78BFA] rounded-lg flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg">Prism</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-white/60">
            <a href="#features" className="hover:text-white transition-colors cursor-pointer">Features</a>
            <a href="#integrations" className="hover:text-white transition-colors cursor-pointer">Integrations</a>
            <a href="#pricing" className="hover:text-white transition-colors cursor-pointer">Pricing</a>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <a href="#" className="text-sm text-white/60 hover:text-white transition-colors cursor-pointer">Log in</a>
            <a href="#pricing" className="bg-[#6C47FF] text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-[#7C5CFF] transition-colors cursor-pointer">
              Start free
            </a>
          </div>
          <button className="md:hidden p-2 cursor-pointer" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <div className="w-5 h-0.5 bg-white mb-1" />
            <div className="w-5 h-0.5 bg-white mb-1" />
            <div className="w-5 h-0.5 bg-white" />
          </button>
        </div>
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-2 bg-[#0F1626] border border-white/10 rounded-2xl p-4 flex flex-col gap-3 text-sm"
            >
              {["Features", "Integrations", "Pricing"].map(item => (
                <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMenuOpen(false)} className="text-white/70 hover:text-white transition-colors cursor-pointer">{item}</a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero */}
      <section className="min-h-screen flex items-center relative overflow-hidden pt-28 pb-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-[#6C47FF]/15 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#A78BFA]/10 rounded-full blur-3xl" />
        </div>
        <motion.div style={{ y: heroY }} className="max-w-6xl mx-auto px-6 relative w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-[#6C47FF]/10 border border-[#6C47FF]/30 text-[#A78BFA] text-sm font-medium px-4 py-2 rounded-full mb-8"
          >
            <Activity className="w-4 h-4" />
            Now with AI-powered insights
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="text-5xl md:text-7xl font-extrabold leading-[1.05] mb-6 max-w-4xl"
          >
            Analytics that actually<br />
            <span className="bg-gradient-to-r from-[#6C47FF] to-[#A78BFA] bg-clip-text text-transparent">drive decisions.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-white/55 max-w-2xl mb-10 leading-relaxed"
          >
            Prism gives your team a single source of truth — real-time dashboards, funnel analysis, cohort retention, and AI summaries. No SQL required.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4 mb-16"
          >
            <a href="#pricing" className="bg-[#6C47FF] hover:bg-[#7C5CFF] text-white font-semibold px-8 py-4 rounded-full transition-colors flex items-center gap-2 cursor-pointer">
              Start for free <ArrowRight className="w-5 h-5" />
            </a>
            <a href="#features" className="border border-white/20 hover:border-white/40 text-white/70 hover:text-white font-medium px-8 py-4 rounded-full transition-colors cursor-pointer">
              See features
            </a>
          </motion.div>

          {/* Live metrics widget */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 max-w-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-sm text-white/50">Live · Last 30 days</span>
              </div>
              <span className="text-xs text-white/30">prism.so/dashboard</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {metrics.map((m, i) => (
                <div
                  key={m.label}
                  className={`p-3 rounded-xl transition-all cursor-default ${activeMetric === i ? "bg-[#6C47FF]/20 border border-[#6C47FF]/30" : "bg-white/5"}`}
                >
                  <div className="text-2xl font-bold mb-1">{m.value}</div>
                  <div className="text-xs text-white/40 mb-2">{m.label}</div>
                  <div className={`text-xs font-medium ${m.up ? "text-emerald-400" : "text-red-400"}`}>{m.change}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-16">
            <p className="text-[#A78BFA] text-sm font-semibold tracking-widest uppercase mb-4">Features</p>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Everything your data team needs.</h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">From real-time monitoring to deep cohort analysis — Prism covers every angle.</p>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Activity className="w-6 h-6" />, title: "Real-time dashboards", desc: "Sub-second data updates. Watch your metrics move as users interact." },
              { icon: <TrendingUp className="w-6 h-6" />, title: "Funnel analysis", desc: "Track conversion across any multi-step flow. Identify exactly where users drop." },
              { icon: <Users className="w-6 h-6" />, title: "Cohort retention", desc: "Group users by behavior or attributes. See which cohorts retain best." },
              { icon: <Zap className="w-6 h-6" />, title: "AI summaries", desc: "Ask Prism AI anything in plain English. Get instant insights, no SQL needed." },
              { icon: <Globe className="w-6 h-6" />, title: "Attribution modeling", desc: "Multi-touch attribution across UTM sources, channels, and campaigns." },
              { icon: <Shield className="w-6 h-6" />, title: "Privacy-first", desc: "GDPR, CCPA compliant. No PII stored by default. SOC 2 Type II certified." },
            ].map((f, i) => (
              <Reveal key={f.title} delay={i * 0.08}>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-7 hover:border-[#6C47FF]/40 hover:bg-[#6C47FF]/5 transition-all group cursor-default">
                  <div className="w-12 h-12 bg-[#6C47FF]/15 text-[#A78BFA] rounded-xl flex items-center justify-center mb-5 group-hover:bg-[#6C47FF]/25 transition-colors">
                    {f.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section id="integrations" className="py-24 px-6 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-12">
            <p className="text-[#A78BFA] text-sm font-semibold tracking-widest uppercase mb-4">Integrations</p>
            <h2 className="text-4xl font-bold mb-4">Works with your stack.</h2>
            <p className="text-white/50 max-w-xl mx-auto">Connect Prism to 60+ tools in one click. Your data, unified.</p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="flex flex-wrap justify-center gap-3">
              {integrations.map((name, i) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                  viewport={{ once: true }}
                  className="bg-white/5 border border-white/10 rounded-full px-5 py-2.5 text-sm text-white/70 hover:text-white hover:border-[#6C47FF]/40 transition-all cursor-default"
                >
                  {name}
                </motion.div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.3} className="text-center mt-8">
            <span className="text-white/40 text-sm">+ 48 more integrations</span>
          </Reveal>
        </div>
      </section>

      {/* Social proof */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-12">
            <div className="text-5xl font-extrabold mb-2">2,400+</div>
            <p className="text-white/50">companies trust Prism to make data-driven decisions</p>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { quote: "Prism replaced 4 different tools. Our team went from 2-day reporting cycles to real-time.", name: "Elena Torres", role: "Head of Growth, Vesper" },
              { quote: "The AI summaries are a game changer. I can ask 'why did churn spike Tuesday?' and get a real answer.", name: "James Woo", role: "CEO, Nori Finance" },
              { quote: "Setup took 20 minutes. We had our first funnel report before lunch.", name: "Priya Shah", role: "Product Lead, Decker" },
            ].map((t, i) => (
              <Reveal key={t.name} delay={i * 0.12}>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-7 h-full">
                  <p className="text-white/70 leading-relaxed mb-6 text-sm">"{t.quote}"</p>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-white/40 text-xs">{t.role}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-12">
            <p className="text-[#A78BFA] text-sm font-semibold tracking-widest uppercase mb-4">Pricing</p>
            <h2 className="text-4xl font-bold mb-8">Simple, transparent pricing.</h2>
            <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-full p-1">
              <button
                onClick={() => setAnnual(false)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${!annual ? "bg-[#6C47FF] text-white" : "text-white/50 hover:text-white"}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setAnnual(true)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${annual ? "bg-[#6C47FF] text-white" : "text-white/50 hover:text-white"}`}
              >
                Annual <span className="text-[#A78BFA] text-xs ml-1">–20%</span>
              </button>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <Reveal key={plan.name} delay={i * 0.1}>
                <div className={`rounded-2xl p-8 h-full flex flex-col ${
                  plan.highlight
                    ? "bg-[#6C47FF] border border-[#8B6DFF]"
                    : "bg-white/5 border border-white/10"
                }`}>
                  <div className="mb-6">
                    <div className="text-sm font-semibold mb-2 opacity-80">{plan.name}</div>
                    <div className="flex items-end gap-1">
                      <span className="text-4xl font-extrabold">{plan.price}</span>
                      <span className={`text-sm mb-1 ${plan.highlight ? "text-white/70" : "text-white/40"}`}>{plan.period}</span>
                    </div>
                    {annual && plan.price !== "Custom" && (
                      <div className="text-xs mt-1 opacity-60">Billed annually</div>
                    )}
                  </div>
                  <ul className="space-y-3 flex-1 mb-8">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-center gap-3 text-sm">
                        <CheckCircle className={`w-4 h-4 shrink-0 ${plan.highlight ? "text-white" : "text-[#6C47FF]"}`} />
                        <span className={plan.highlight ? "text-white/90" : "text-white/70"}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <button className={`w-full py-3 rounded-full font-semibold text-sm transition-colors cursor-pointer ${
                    plan.highlight
                      ? "bg-white text-[#6C47FF] hover:bg-white/90"
                      : "border border-white/20 hover:border-[#6C47FF]/60 hover:text-white text-white/70"
                  }`}>
                    {plan.cta}
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <Reveal className="text-center mb-12">
            <p className="text-[#A78BFA] text-sm font-semibold tracking-widest uppercase mb-4">FAQ</p>
            <h2 className="text-4xl font-bold">Got questions?</h2>
          </Reveal>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <Reveal key={i} delay={i * 0.07}>
                <div
                  className="border border-white/10 rounded-xl overflow-hidden cursor-pointer"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <div className="flex items-center justify-between p-6">
                    <span className="font-medium text-sm">{faq.q}</span>
                    <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.25 }}>
                      <ChevronDown className="w-4 h-4 text-white/40" />
                    </motion.div>
                  </div>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 text-white/55 text-sm leading-relaxed border-t border-white/10 pt-4">
                          {faq.a}
                        </div>
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
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Reveal>
            <div className="bg-gradient-to-br from-[#6C47FF]/20 to-[#A78BFA]/10 border border-[#6C47FF]/30 rounded-3xl p-16">
              <h2 className="text-5xl font-extrabold mb-6">Start knowing your numbers.</h2>
              <p className="text-white/55 text-lg mb-10 max-w-lg mx-auto">
                Free for 14 days. No credit card. Setup in under 20 minutes.
              </p>
              <a href="#" className="inline-flex items-center gap-2 bg-[#6C47FF] hover:bg-[#7C5CFF] text-white font-bold px-10 py-4 rounded-full transition-colors cursor-pointer text-lg">
                Create free account <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-[#6C47FF] to-[#A78BFA] rounded-lg flex items-center justify-center">
              <BarChart3 className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold">Prism Analytics</span>
          </div>
          <div className="flex gap-8 text-sm text-white/40">
            {["Product", "Docs", "Blog", "Privacy", "Status"].map(l => (
              <a key={l} href="#" className="hover:text-white transition-colors cursor-pointer">{l}</a>
            ))}
          </div>
          <p className="text-white/30 text-sm">© 2026 Prism Analytics, Inc.</p>
        </div>
      </footer>
    </div>
  )
}
