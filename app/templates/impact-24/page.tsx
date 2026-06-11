"use client"

import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import { ArrowRight, Zap, Users, TrendingUp, Globe, CheckCircle, ChevronDown, Rocket, Star, Clock, Briefcase, Target, BookOpen, Award, Calendar, MapPin, Mail, Shield } from "lucide-react"

type ActivePage = "home" | "portfolio" | "program" | "mentors" | "apply" | "legal"

function useFonts() {
  useEffect(() => {
    if (document.getElementById("impact-24-fonts")) return
    const style = document.createElement("style")
    style.id = "impact-24-fonts"
    style.textContent = `@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');`
    document.head.appendChild(style)
  }, [])
}

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

const companies = [
  { name: "Flux AI", sector: "AI/ML", raise: "$4.2M", logo: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=80&h=80&fit=crop&crop=center", cohort: "W23" },
  { name: "Vanta Pay", sector: "Fintech", raise: "$8.1M", logo: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=80&h=80&fit=crop&crop=center", cohort: "S23" },
  { name: "NeuraStack", sector: "Developer Tools", raise: "$3.5M", logo: "https://images.unsplash.com/photo-1620287341056-49a2f1ab2fdc?w=80&h=80&fit=crop&crop=center", cohort: "W23" },
  { name: "Clio Health", sector: "HealthTech", raise: "$6.8M", logo: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=80&h=80&fit=crop&crop=center", cohort: "S22" },
  { name: "Arco Climate", sector: "CleanTech", raise: "$12M", logo: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=80&h=80&fit=crop&crop=center", cohort: "W22" },
  { name: "Forma Studio", sector: "Design Tools", raise: "$2.9M", logo: "https://images.unsplash.com/photo-1541462608143-67571c6738dd?w=80&h=80&fit=crop&crop=center", cohort: "S23" },
]

const mentors = [
  { name: "Sarah Chen", role: "Partner @ Sequoia", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face", expertise: "Growth" },
  { name: "Marcus Reid", role: "Founder @ Linear", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face", expertise: "Product" },
  { name: "Priya Nair", role: "CTO @ Stripe", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face", expertise: "Engineering" },
  { name: "Tom Brandt", role: "GP @ a16z", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face", expertise: "GTM" },
]

const faqs = [
  { q: "How much equity do you take?", a: "We take 7% equity in exchange for $500K and access to our full accelerator program." },
  { q: "Is the program remote or in-person?", a: "The 12-week program is primarily in-person in Paris, with optional remote tracks for select cohorts." },
  { q: "What stage do you invest at?", a: "We invest pre-seed and seed — ideally you have an MVP and first users, but exceptional teams can apply earlier." },
  { q: "When is the next application deadline?", a: "Applications for Cohort W24 close November 15th, 2026. We accept ~20 companies per cohort." },
]

const sectors = ["All", "AI/ML", "Fintech", "Developer Tools", "HealthTech", "CleanTech", "Design Tools"]

export default function Impact24() {
  useFonts()
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -60])
  const [activeSector, setActiveSector] = useState("All")
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [page, setPage] = useState<ActivePage>("home")

  const goTo = (p: ActivePage) => {
    setPage(p)
    window.scrollTo({ top: 0, behavior: "auto" })
    setMenuOpen(false)
  }

  const filtered = activeSector === "All" ? companies : companies.filter(c => c.sector === activeSector)

  const navItems: { label: string; target: ActivePage }[] = [
    { label: "Portfolio", target: "portfolio" },
    { label: "Program", target: "program" },
    { label: "Mentors", target: "mentors" },
    { label: "Apply", target: "apply" },
  ]

  return (
    <div ref={containerRef} className="min-h-screen bg-[#060A0F] text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      {/* Scroll bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 bg-[#A3E635] origin-left z-50"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Nav */}
      <nav className="fixed top-4 left-4 right-4 z-40">
        <div className="max-w-6xl mx-auto bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-3 flex items-center justify-between">
          <button onClick={() => goTo("home")} className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 bg-[#A3E635] rounded-lg flex items-center justify-center">
              <Rocket className="w-4 h-4 text-[#060A0F]" />
            </div>
            <span className="font-semibold text-lg">Zero to One</span>
          </button>
          <div className="hidden md:flex items-center gap-8 text-sm text-white/60">
            {navItems.map(item => (
              <button key={item.label} onClick={() => goTo(item.target)} className="hover:text-white transition-colors cursor-pointer bg-transparent border-none text-sm text-white/60">{item.label}</button>
            ))}
          </div>
          <button onClick={() => goTo("apply")} className="hidden md:flex bg-[#A3E635] text-[#060A0F] text-sm font-semibold px-5 py-2 rounded-full hover:bg-[#BEF264] transition-colors cursor-pointer border-none">
            Apply Now
          </button>
          <button
            className="md:hidden p-2 cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
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
              className="mt-2 bg-[#0D1520] border border-white/10 rounded-2xl p-4 flex flex-col gap-3 text-sm"
            >
              {navItems.map(item => (
                <button key={item.label} onClick={() => goTo(item.target)} className="text-white/70 hover:text-white transition-colors cursor-pointer bg-transparent border-none text-left text-sm">{item.label}</button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* === HOME PAGE === */}
      <div style={{ display: page === "home" ? "block" : "none" }}>
          {/* Hero */}
          <section className="min-h-screen flex items-center relative overflow-hidden pt-24 pb-16">
            <div className="absolute inset-0">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#A3E635]/10 rounded-full blur-3xl" />
              <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-[#3B82F6]/10 rounded-full blur-3xl" />
            </div>
            <motion.div style={{ y: heroY }} className="max-w-6xl mx-auto px-6 relative">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 bg-[#A3E635]/10 border border-[#A3E635]/20 text-[#A3E635] text-sm font-medium px-4 py-2 rounded-full mb-8"
              >
                <Zap className="w-4 h-4" />
                Applications open — Cohort W24
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-6xl md:text-8xl font-bold leading-[1.0] mb-6"
              >
                From idea to<br />
                <span className="text-[#A3E635]">funded startup.</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl text-white/60 max-w-2xl mb-10 leading-relaxed"
              >
                Zero to One is a 12-week accelerator for pre-seed founders. We invest €500K, open our network, and help you build the company you imagined.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap items-center gap-4"
              >
                <button onClick={() => goTo("apply")} className="bg-[#A3E635] text-[#060A0F] font-bold text-lg px-8 py-4 rounded-full hover:bg-[#BEF264] transition-colors flex items-center gap-2 cursor-pointer border-none">
                  Apply for W24 <ArrowRight className="w-5 h-5" />
                </button>
                <button onClick={() => goTo("portfolio")} className="text-white/60 hover:text-white transition-colors flex items-center gap-2 text-lg cursor-pointer bg-transparent border-none">
                  See portfolio <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
                className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
              >
                {[
                  { val: "€500K", label: "Invested per startup" },
                  { val: "120+", label: "Portfolio companies" },
                  { val: "€2.1B", label: "Combined valuation" },
                  { val: "84%", label: "Follow-on rate" },
                ].map(({ val, label }) => (
                  <div key={label} className="border border-white/10 rounded-2xl p-6">
                    <div className="text-3xl font-bold text-[#A3E635] mb-1">{val}</div>
                    <div className="text-sm text-white/50">{label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </section>

          {/* Portfolio */}
          <section id="portfolio" className="py-24 px-6">
            <div className="max-w-6xl mx-auto">
              <Reveal>
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                  <div>
                    <p className="text-[#A3E635] text-sm font-semibold tracking-widest uppercase mb-3">Portfolio</p>
                    <h2 className="text-4xl md:text-5xl font-bold">Companies we&apos;ve backed</h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {sectors.map(s => (
                      <button
                        key={s}
                        onClick={() => setActiveSector(s)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                          activeSector === s
                            ? "bg-[#A3E635] text-[#060A0F]"
                            : "border border-white/20 text-white/60 hover:border-[#A3E635]/50 hover:text-white"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </Reveal>

              <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence mode="popLayout">
                  {filtered.map((co, i) => (
                    <motion.div
                      key={co.name}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3, delay: i * 0.04 }}
                      className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#A3E635]/30 hover:bg-white/[0.08] transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl overflow-hidden">
                          <Image src={co.logo} alt={co.name} width={48} height={48} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="font-semibold group-hover:text-[#A3E635] transition-colors">{co.name}</div>
                          <div className="text-sm text-white/50">{co.sector}</div>
                        </div>
                        <div className="ml-auto">
                          <span className="text-xs bg-[#A3E635]/10 text-[#A3E635] border border-[#A3E635]/20 px-2 py-1 rounded-full">{co.cohort}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/40">Raised</span>
                        <span className="font-bold text-white">{co.raise}</span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>
          </section>

          {/* Program */}
          <section id="program" className="py-24 px-6 bg-white/[0.02]">
            <div className="max-w-6xl mx-auto">
              <Reveal className="text-center mb-16">
                <p className="text-[#A3E635] text-sm font-semibold tracking-widest uppercase mb-4">The Program</p>
                <h2 className="text-4xl md:text-5xl font-bold mb-4">12 weeks. Zero fluff.</h2>
                <p className="text-white/50 text-lg max-w-2xl mx-auto">A structured sprint from idea validation to Series A readiness. Every week has a purpose.</p>
              </Reveal>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    phase: "Phase 1", weeks: "Weeks 1–4", title: "Foundation", icon: <Star className="w-5 h-5" />,
                    items: ["Problem-market fit validation", "User interview sprints (50 interviews)", "ICP definition workshop", "Revenue model architecture"]
                  },
                  {
                    phase: "Phase 2", weeks: "Weeks 5–8", title: "Build & Validate", icon: <Zap className="w-5 h-5" />,
                    items: ["MVP development sprints", "First paying customers", "Retention and NPS tracking", "Growth loop identification"]
                  },
                  {
                    phase: "Phase 3", weeks: "Weeks 9–12", title: "Scale & Raise", icon: <TrendingUp className="w-5 h-5" />,
                    items: ["Series A deck preparation", "Investor introductions (200+)", "Pitch coaching with GPs", "Demo Day (500 attendees)"]
                  },
                ].map((phase, i) => (
                  <Reveal key={phase.phase} delay={i * 0.15}>
                    <div className="border border-white/10 rounded-2xl p-8 h-full hover:border-[#A3E635]/30 transition-colors">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-[#A3E635]/10 text-[#A3E635] rounded-lg flex items-center justify-center">
                          {phase.icon}
                        </div>
                        <span className="text-[#A3E635] text-sm font-semibold">{phase.phase}</span>
                      </div>
                      <div className="text-sm text-white/40 mb-2">{phase.weeks}</div>
                      <h3 className="text-2xl font-bold mb-6">{phase.title}</h3>
                      <ul className="space-y-3">
                        {phase.items.map(item => (
                          <li key={item} className="flex items-start gap-3 text-sm text-white/60">
                            <CheckCircle className="w-4 h-4 text-[#A3E635] mt-0.5 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* What you get */}
          <section className="py-24 px-6">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <Reveal>
                  <p className="text-[#A3E635] text-sm font-semibold tracking-widest uppercase mb-4">What you get</p>
                  <h2 className="text-4xl md:text-5xl font-bold mb-6">More than capital.</h2>
                  <p className="text-white/50 text-lg mb-10 leading-relaxed">
                    We built Zero to One because we know what founders actually need. Not just money — but the right introductions, the hard feedback, and the community that keeps you going.
                  </p>
                  <div className="space-y-4">
                    {[
                      { icon: <Globe className="w-5 h-5" />, label: "€500K investment", desc: "No strings, no advisor shares, no board seat required." },
                      { icon: <Users className="w-5 h-5" />, label: "120+ mentor network", desc: "Access to operators who've built $100M+ companies." },
                      { icon: <TrendingUp className="w-5 h-5" />, label: "Investor warm intros", desc: "200+ VCs and angels at Demo Day. Warm intros to the right ones." },
                      { icon: <Clock className="w-5 h-5" />, label: "Lifetime alumni access", desc: "Perks, events, and co-founder matching — forever." },
                    ].map(({ icon, label, desc }) => (
                      <div key={label} className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors cursor-default">
                        <div className="w-10 h-10 bg-[#A3E635]/10 text-[#A3E635] rounded-xl flex items-center justify-center shrink-0">
                          {icon}
                        </div>
                        <div>
                          <div className="font-semibold mb-1">{label}</div>
                          <div className="text-sm text-white/50">{desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Reveal>
                <Reveal delay={0.2}>
                  <div className="relative">
                    <div className="rounded-2xl overflow-hidden aspect-[4/5]">
                      <Image
                        src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=1000&fit=crop&crop=center"
                        alt="Founders at Zero to One"
                        width={800}
                        height={1000}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute bottom-6 left-6 right-6 bg-[#060A0F]/90 backdrop-blur-md border border-white/10 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#A3E635] rounded-full flex items-center justify-center">
                          <Rocket className="w-5 h-5 text-[#060A0F]" />
                        </div>
                        <div>
                          <div className="font-semibold text-sm">Next Demo Day</div>
                          <div className="text-[#A3E635] text-xs">March 14, 2027 · Paris</div>
                        </div>
                        <div className="ml-auto text-xs text-white/40">500 attendees</div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          </section>

          {/* Mentors */}
          <section id="mentors" className="py-24 px-6 bg-white/[0.02]">
            <div className="max-w-6xl mx-auto">
              <Reveal className="text-center mb-16">
                <p className="text-[#A3E635] text-sm font-semibold tracking-widest uppercase mb-4">Mentors</p>
                <h2 className="text-4xl md:text-5xl font-bold">Learn from the best.</h2>
              </Reveal>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {mentors.map((m, i) => (
                  <Reveal key={m.name} delay={i * 0.1}>
                    <div className="group cursor-pointer">
                      <div className="rounded-2xl overflow-hidden mb-4 aspect-square">
                        <Image
                          src={m.img}
                          alt={m.name}
                          width={200}
                          height={200}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                        />
                      </div>
                      <div className="font-semibold">{m.name}</div>
                      <div className="text-sm text-white/50 mb-2">{m.role}</div>
                      <span className="text-xs bg-[#A3E635]/10 text-[#A3E635] border border-[#A3E635]/20 px-2 py-1 rounded-full">{m.expertise}</span>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="py-24 px-6">
            <div className="max-w-3xl mx-auto">
              <Reveal className="text-center mb-16">
                <p className="text-[#A3E635] text-sm font-semibold tracking-widest uppercase mb-4">FAQ</p>
                <h2 className="text-4xl font-bold">Common questions</h2>
              </Reveal>
              <div className="space-y-3">
                {faqs.map((faq, i) => (
                  <Reveal key={i} delay={i * 0.08}>
                    <div
                      className="border border-white/10 rounded-xl overflow-hidden cursor-pointer"
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    >
                      <div className="flex items-center justify-between p-6">
                        <span className="font-medium">{faq.q}</span>
                        <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.3 }}>
                          <ChevronDown className="w-5 h-5 text-white/40" />
                        </motion.div>
                      </div>
                      <AnimatePresence>
                        {openFaq === i && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="px-6 pb-6 text-white/60 text-sm leading-relaxed border-t border-white/10 pt-4">
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

          {/* Apply CTA */}
          <section id="apply" className="py-32 px-6">
            <div className="max-w-4xl mx-auto text-center">
              <Reveal>
                <div className="bg-[#A3E635]/5 border border-[#A3E635]/20 rounded-3xl p-16">
                  <p className="text-[#A3E635] text-sm font-semibold tracking-widest uppercase mb-4">Apply Now</p>
                  <h2 className="text-5xl md:text-6xl font-bold mb-6">Build something<br />that matters.</h2>
                  <p className="text-white/50 text-lg mb-10 max-w-xl mx-auto">
                    Applications for Cohort W24 are open. 20 companies selected. We read every application.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <input
                      type="email"
                      placeholder="your@startup.com"
                      className="bg-white/10 border border-white/20 rounded-full px-6 py-4 text-white placeholder:text-white/30 w-full sm:w-auto sm:min-w-72 focus:outline-none focus:border-[#A3E635]/50"
                    />
                    <button onClick={() => goTo("apply")} className="bg-[#A3E635] text-[#060A0F] font-bold px-8 py-4 rounded-full hover:bg-[#BEF264] transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap border-none">
                      Start Application <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-white/30 text-sm mt-6">Deadline: November 15, 2026 · Results by December 1</p>
                </div>
              </Reveal>
            </div>
          </section>
        </div>

      {/* === PORTFOLIO PAGE === */}
      <div style={{ display: page === "portfolio" ? "block" : "none" }}>
        <section className="pt-32 pb-24 px-6">
          <div className="max-w-6xl mx-auto">
            <Reveal>
              <p className="text-[#A3E635] text-sm font-semibold tracking-widest uppercase mb-4">Portfolio</p>
              <h1 className="text-5xl md:text-7xl font-bold mb-4">Companies we&apos;ve backed</h1>
              <p className="text-white/50 text-lg max-w-3xl mb-6 leading-relaxed">120+ startups across AI, fintech, health, climate, and developer tools. Here are some of the teams we&apos;re proudest to partner with.</p>
            </Reveal>

            {/* Stats banner */}
            <Reveal delay={0.1}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 mt-10">
                {[
                  { val: "120+", label: "Companies funded" },
                  { val: "€2.1B", label: "Combined valuation" },
                  { val: "84%", label: "Follow-on rate" },
                  { val: "6", label: "Unicorn-track startups" },
                ].map(({ val, label }) => (
                  <div key={label} className="border border-white/10 rounded-2xl p-6 bg-white/[0.02]">
                    <div className="text-3xl font-bold text-[#A3E635] mb-1">{val}</div>
                    <div className="text-sm text-white/50">{label}</div>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Company deep-dive cards */}
            <div className="space-y-6">
              {[
                {
                  ...companies[0],
                  description: "Flux AI builds foundational models for real-time video generation. Their diffusion architecture processes 4K frames 12× faster than competitors, powering creative tools for filmmakers and game studios worldwide.",
                  teamSize: 32,
                  growth: "18× ARR YoY",
                  founded: "2022",
                  hq: "San Francisco, CA",
                  investors: "Sequoia, a16z, Zero to One",
                },
                {
                  ...companies[1],
                  description: "Vanta Pay is rebuilding cross-border payments for African merchants. Their instant settlement rails handle $2B+ annually, enabling SMBs across 14 countries to accept payments in local currencies with sub-1% fees.",
                  teamSize: 85,
                  growth: "4.2× transaction volume YoY",
                  founded: "2022",
                  hq: "Lagos & London",
                  investors: "Stripe, Y Combinator, Zero to One",
                },
                {
                  ...companies[2],
                  description: "NeuraStack provides an AI-native observability platform for engineering teams. Their anomaly detection engine surfaces production issues 40 minutes before traditional monitoring, used by 400+ engineering orgs.",
                  teamSize: 28,
                  growth: "320% user growth in 12 months",
                  founded: "2023",
                  hq: "Berlin, Germany",
                  investors: "Index Ventures, Zero to One",
                },
                {
                  ...companies[3],
                  description: "Clio Health uses LLMs to automate clinical documentation for doctors. Physicians save an average of 2 hours per day, reducing burnout and improving patient outcomes across 200+ clinics.",
                  teamSize: 54,
                  growth: "6× clinic partnerships in 6 months",
                  founded: "2021",
                  hq: "Boston, MA",
                  investors: "General Catalyst, Zero to One",
                },
                {
                  ...companies[4],
                  description: "Arco Climate builds carbon accounting software for industrial manufacturers. Their IoT sensor network provides real-time Scope 1-3 emissions tracking, helping Fortune 500 companies meet ESG targets.",
                  teamSize: 72,
                  growth: "$8M ARR, doubling annually",
                  founded: "2021",
                  hq: "Paris, France",
                  investors: "Lowercarbon Capital, Breakthrough Energy, Zero to One",
                },
                {
                  ...companies[5],
                  description: "Forma Studio is a collaborative 3D design tool for product teams. Their browser-based engine renders production-quality models in real-time, replacing legacy desktop CAD software for 15,000+ designers.",
                  teamSize: 19,
                  growth: "200% MoM in first 6 months post-launch",
                  founded: "2023",
                  hq: "Stockholm, Sweden",
                  investors: "Accel, Zero to One",
                },
              ].map((co, i) => (
                <Reveal key={co.name} delay={i * 0.08}>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-[#A3E635]/30 transition-colors">
                    <div className="flex flex-col md:flex-row gap-8">
                      <div className="flex items-start gap-4 md:w-1/3">
                        <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                          <Image src={co.logo} alt={co.name} width={64} height={64} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold mb-1">{co.name}</h3>
                          <div className="text-sm text-white/50 mb-2">{co.sector}</div>
                          <span className="text-xs bg-[#A3E635]/10 text-[#A3E635] border border-[#A3E635]/20 px-2 py-1 rounded-full">Cohort {co.cohort}</span>
                        </div>
                      </div>
                      <div className="md:w-2/3">
                        <p className="text-white/60 text-sm leading-relaxed mb-6">{co.description}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <div className="text-xs text-white/40 mb-1">Raised</div>
                            <div className="font-bold text-[#A3E635]">{co.raise}</div>
                          </div>
                          <div>
                            <div className="text-xs text-white/40 mb-1">Team</div>
                            <div className="font-bold">{co.teamSize} people</div>
                          </div>
                          <div>
                            <div className="text-xs text-white/40 mb-1">Growth</div>
                            <div className="font-bold text-sm">{co.growth}</div>
                          </div>
                          <div>
                            <div className="text-xs text-white/40 mb-1">HQ</div>
                            <div className="font-bold text-sm">{co.hq}</div>
                          </div>
                        </div>
                        <div className="mt-4 text-xs text-white/30">Investors: {co.investors}</div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* CTA */}
            <Reveal delay={0.2}>
              <div className="text-center mt-16">
                <p className="text-white/40 text-sm mb-6">Want to be on this list?</p>
                <button onClick={() => goTo("apply")} className="bg-[#A3E635] text-[#060A0F] font-bold text-lg px-8 py-4 rounded-full hover:bg-[#BEF264] transition-colors inline-flex items-center gap-2 cursor-pointer">
                  Apply for W24 <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </Reveal>
          </div>
        </section>
      </div>

      {/* --- PROGRAM PAGE --- */}
      <div style={{ display: page === "program" ? "block" : "none" }}>
        <section className="pt-32 pb-24 px-6">
          <div className="max-w-6xl mx-auto">
            <Reveal>
              <p className="text-[#A3E635] text-sm font-semibold tracking-widest uppercase mb-4">The Program</p>
              <h1 className="text-5xl md:text-7xl font-bold mb-4">12 weeks that change everything.</h1>
              <p className="text-white/50 text-lg max-w-3xl mb-16 leading-relaxed">Our accelerator is structured around three phases — Foundation, Build, and Scale. Each week has specific deliverables, workshops, and office hours designed to move you forward faster than you thought possible.</p>
            </Reveal>

            {/* What&apos;s included */}
            <Reveal delay={0.1}>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-20">
                {[
                  { icon: <Globe className="w-5 h-5" />, label: "€500K", sub: "Direct investment" },
                  { icon: <Users className="w-5 h-5" />, label: "120+", sub: "Mentors & advisors" },
                  { icon: <Calendar className="w-5 h-5" />, label: "48", sub: "Workshops & sessions" },
                  { icon: <MapPin className="w-5 h-5" />, label: "Paris", sub: "In-person program" },
                ].map(({ icon, label, sub }) => (
                  <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                    <div className="w-10 h-10 bg-[#A3E635]/10 text-[#A3E635] rounded-xl flex items-center justify-center mx-auto mb-3">{icon}</div>
                    <div className="text-2xl font-bold">{label}</div>
                    <div className="text-sm text-white/50">{sub}</div>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Phase 1: Foundation */}
            <Reveal delay={0.1}>
              <div className="mb-16">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-[#A3E635]/10 text-[#A3E635] rounded-xl flex items-center justify-center">
                    <Star className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">Phase 1 — Foundation</h2>
                    <p className="text-white/40 text-sm">Weeks 1–4</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { week: "Week 1", title: "Problem Validation Sprint", items: ["Onboarding & cohort kickoff dinner", "Problem statement workshop with mentors", "Competitive landscape deep-dive", "Set up 25 customer discovery interviews"] },
                    { week: "Week 2", title: "Customer Discovery", items: ["Complete 50 user interviews", "Synthesize pain points into insight map", "ICP (Ideal Customer Profile) definition", "Office hours: Sarah Chen (Growth)"] },
                    { week: "Week 3", title: "Market Sizing & Positioning", items: ["TAM/SAM/SOM analysis workshop", "Positioning & messaging framework", "Pricing strategy fundamentals", "Office hours: Tom Brandt (GTM)"] },
                    { week: "Week 4", title: "Revenue Architecture", items: ["Business model canvas v2", "Unit economics deep-dive", "Revenue model stress-testing", "Phase 1 checkpoint — present to partners"] },
                  ].map((w) => (
                    <div key={w.week} className="border border-white/10 rounded-2xl p-6 hover:border-[#A3E635]/30 transition-colors">
                      <span className="text-xs bg-[#A3E635]/10 text-[#A3E635] border border-[#A3E635]/20 px-2 py-1 rounded-full">{w.week}</span>
                      <h3 className="text-xl font-bold mt-3 mb-4">{w.title}</h3>
                      <ul className="space-y-2">
                        {w.items.map(item => (
                          <li key={item} className="flex items-start gap-3 text-sm text-white/60">
                            <CheckCircle className="w-4 h-4 text-[#A3E635] mt-0.5 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Phase 2: Build & Validate */}
            <Reveal delay={0.1}>
              <div className="mb-16">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-[#A3E635]/10 text-[#A3E635] rounded-xl flex items-center justify-center">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">Phase 2 — Build & Validate</h2>
                    <p className="text-white/40 text-sm">Weeks 5–8</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { week: "Week 5", title: "MVP Sprint Kickoff", items: ["Define MVP scope (max 3 features)", "Technical architecture review with Priya Nair", "Sprint planning & milestone setting", "Cloud credits activation ($100K in AWS/GCP)"] },
                    { week: "Week 6", title: "Build & Ship", items: ["Daily standups with engineering mentor", "UX review session with design partners", "Landing page & waitlist optimization", "Office hours: Marcus Reid (Product)"] },
                    { week: "Week 7", title: "First Customers", items: ["Launch to first 10 paying customers", "Onboarding flow optimization", "Set up retention & NPS tracking", "Customer feedback synthesis workshop"] },
                    { week: "Week 8", title: "Growth Loops", items: ["Identify primary growth loop", "Referral & viral mechanics workshop", "Metrics dashboard setup (key KPIs)", "Phase 2 checkpoint — present metrics to partners"] },
                  ].map((w) => (
                    <div key={w.week} className="border border-white/10 rounded-2xl p-6 hover:border-[#A3E635]/30 transition-colors">
                      <span className="text-xs bg-[#A3E635]/10 text-[#A3E635] border border-[#A3E635]/20 px-2 py-1 rounded-full">{w.week}</span>
                      <h3 className="text-xl font-bold mt-3 mb-4">{w.title}</h3>
                      <ul className="space-y-2">
                        {w.items.map(item => (
                          <li key={item} className="flex items-start gap-3 text-sm text-white/60">
                            <CheckCircle className="w-4 h-4 text-[#A3E635] mt-0.5 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Phase 3: Scale & Raise */}
            <Reveal delay={0.1}>
              <div className="mb-16">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-[#A3E635]/10 text-[#A3E635] rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">Phase 3 — Scale & Raise</h2>
                    <p className="text-white/40 text-sm">Weeks 9–12</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { week: "Week 9", title: "Fundraising Foundations", items: ["Investor narrative crafting workshop", "Financial model & projections review", "Term sheet fundamentals with Tom Brandt", "Build target investor list (200+)"] },
                    { week: "Week 10", title: "Pitch Perfect", items: ["Pitch deck v1 review with all partners", "Story structure coaching session", "Practice pitch (recorded + feedback)", "1:1 investor intro strategy meetings"] },
                    { week: "Week 11", title: "Investor Roadshow", items: ["Warm intros to 50+ target investors", "Back-to-back pitch meetings", "Follow-up & data room preparation", "Live deal negotiation coaching"] },
                    { week: "Week 12", title: "Demo Day & Beyond", items: ["Final pitch rehearsals", "Demo Day — 500 investors & press", "Post-Demo Day investor follow-up", "Alumni onboarding & lifetime access activation"] },
                  ].map((w) => (
                    <div key={w.week} className="border border-white/10 rounded-2xl p-6 hover:border-[#A3E635]/30 transition-colors">
                      <span className="text-xs bg-[#A3E635]/10 text-[#A3E635] border border-[#A3E635]/20 px-2 py-1 rounded-full">{w.week}</span>
                      <h3 className="text-xl font-bold mt-3 mb-4">{w.title}</h3>
                      <ul className="space-y-2">
                        {w.items.map(item => (
                          <li key={item} className="flex items-start gap-3 text-sm text-white/60">
                            <CheckCircle className="w-4 h-4 text-[#A3E635] mt-0.5 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Workshops list */}
            <Reveal delay={0.1}>
              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-8 mb-16">
                <h3 className="text-2xl font-bold mb-6">Weekly Schedule</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                  {[
                    { day: "Monday", time: "9:00 AM", event: "Cohort standup & weekly sprint planning" },
                    { day: "Monday", time: "2:00 PM", event: "Workshop session (rotating topics)" },
                    { day: "Tuesday", time: "10:00 AM", event: "1:1 office hours with assigned mentor" },
                    { day: "Tuesday", time: "4:00 PM", event: "Product review & design critique" },
                    { day: "Wednesday", time: "9:00 AM", event: "Guest speaker fireside chat" },
                    { day: "Wednesday", time: "2:00 PM", event: "Peer feedback & founder roundtable" },
                    { day: "Thursday", time: "10:00 AM", event: "Technical deep-dive (engineering focus)" },
                    { day: "Thursday", time: "3:00 PM", event: "Investor readiness session" },
                    { day: "Friday", time: "10:00 AM", event: "Demo & progress review" },
                    { day: "Friday", time: "6:00 PM", event: "Cohort social & networking dinner" },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center gap-4 py-2 border-b border-white/5">
                      <div className="text-xs text-[#A3E635] font-semibold w-24 shrink-0">{s.day}</div>
                      <div className="text-xs text-white/40 w-16 shrink-0">{s.time}</div>
                      <div className="text-sm text-white/70">{s.event}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* CTA */}
            <Reveal delay={0.2}>
              <div className="text-center">
                <p className="text-white/40 text-sm mb-6">Ready for the most intense 12 weeks of your life?</p>
                <button onClick={() => goTo("apply")} className="bg-[#A3E635] text-[#060A0F] font-bold text-lg px-8 py-4 rounded-full hover:bg-[#BEF264] transition-colors inline-flex items-center gap-2 cursor-pointer">
                  Apply for W24 <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </Reveal>
          </div>
        </section>
      </div>

      {/* --- MENTORS PAGE --- */}
      <div style={{ display: page === "mentors" ? "block" : "none" }}>
        <section className="pt-32 pb-24 px-6">
          <div className="max-w-6xl mx-auto">
            <Reveal>
              <p className="text-[#A3E635] text-sm font-semibold tracking-widest uppercase mb-4">Mentors</p>
              <h1 className="text-5xl md:text-7xl font-bold mb-4">Learn from operators, not observers.</h1>
              <p className="text-white/50 text-lg max-w-3xl mb-16 leading-relaxed">Our mentors have built, scaled, and invested in companies worth billions. They&apos;ve lived through the problems you&apos;re facing — and they&apos;re here every week to help you solve them.</p>
            </Reveal>

            <div className="space-y-8">
              {/* Sarah Chen */}
              <Reveal delay={0.05}>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-[#A3E635]/30 transition-colors">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-1/4 shrink-0">
                      <div className="rounded-2xl overflow-hidden aspect-square max-w-[240px]">
                        <Image src={mentors[0].img} alt={mentors[0].name} width={240} height={240} className="w-full h-full object-cover" />
                      </div>
                    </div>
                    <div className="md:w-3/4">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <h3 className="text-3xl font-bold">{mentors[0].name}</h3>
                        <span className="text-xs bg-[#A3E635]/10 text-[#A3E635] border border-[#A3E635]/20 px-3 py-1 rounded-full">Growth</span>
                      </div>
                      <p className="text-[#A3E635] text-sm font-semibold mb-4">{mentors[0].role}</p>
                      <p className="text-white/60 text-sm leading-relaxed mb-6">
                        Sarah Chen is a Partner at Sequoia Capital, where she leads early-stage investments in consumer and enterprise SaaS. Before joining Sequoia, Sarah was VP of Growth at Notion, where she scaled the product from 1M to 30M users in under three years. She started her career as a product manager at Google, working on Search and YouTube growth. Sarah holds an MBA from Stanford GSB and a BS in Computer Science from MIT. She&apos;s passionate about helping founders find their first 1,000 true fans.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="border border-white/10 rounded-xl p-4">
                          <div className="text-xs text-white/40 mb-1">Companies built</div>
                          <div className="text-sm font-semibold">Notion (VP Growth), Google (PM)</div>
                        </div>
                        <div className="border border-white/10 rounded-xl p-4">
                          <div className="text-xs text-white/40 mb-1">Investment thesis</div>
                          <div className="text-sm font-semibold">PLG, community-driven growth, bottom-up SaaS</div>
                        </div>
                        <div className="border border-white/10 rounded-xl p-4">
                          <div className="text-xs text-white/40 mb-1">Expertise areas</div>
                          <div className="text-sm font-semibold">Growth loops, retention, pricing, GTM</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-white/30">
                        <Briefcase className="w-3.5 h-3.5" /> 15+ years in tech · 40+ portfolio companies · 3 unicorns backed
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Marcus Reid */}
              <Reveal delay={0.1}>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-[#A3E635]/30 transition-colors">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-1/4 shrink-0">
                      <div className="rounded-2xl overflow-hidden aspect-square max-w-[240px]">
                        <Image src={mentors[1].img} alt={mentors[1].name} width={240} height={240} className="w-full h-full object-cover" />
                      </div>
                    </div>
                    <div className="md:w-3/4">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <h3 className="text-3xl font-bold">{mentors[1].name}</h3>
                        <span className="text-xs bg-[#A3E635]/10 text-[#A3E635] border border-[#A3E635]/20 px-3 py-1 rounded-full">Product</span>
                      </div>
                      <p className="text-[#A3E635] text-sm font-semibold mb-4">{mentors[1].role}</p>
                      <p className="text-white/60 text-sm leading-relaxed mb-6">
                        Marcus Reid is the co-founder and CEO of Linear, the project management tool loved by thousands of engineering teams. Before Linear, Marcus spent 6 years at Uber as a Staff Product Manager, where he led the Rider Experience team across 70+ countries. He previously co-founded a developer tools startup that was acquired by Atlassian in 2016. Marcus is known for his obsession with product craft — he believes great products are built through relentless simplification, not feature addition. He advises our founders on product-market fit, user experience, and building opinionated products.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="border border-white/10 rounded-xl p-4">
                          <div className="text-xs text-white/40 mb-1">Companies built</div>
                          <div className="text-sm font-semibold">Linear (CEO), Uber (Staff PM), Atlassian (acquired)</div>
                        </div>
                        <div className="border border-white/10 rounded-xl p-4">
                          <div className="text-xs text-white/40 mb-1">Investment thesis</div>
                          <div className="text-sm font-semibold">Opinionated tools, developer-first products</div>
                        </div>
                        <div className="border border-white/10 rounded-xl p-4">
                          <div className="text-xs text-white/40 mb-1">Expertise areas</div>
                          <div className="text-sm font-semibold">Product-market fit, UX, roadmap prioritization</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-white/30">
                        <Briefcase className="w-3.5 h-3.5" /> 12+ years in product · 2 companies built · 1 acquisition
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Priya Nair */}
              <Reveal delay={0.15}>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-[#A3E635]/30 transition-colors">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-1/4 shrink-0">
                      <div className="rounded-2xl overflow-hidden aspect-square max-w-[240px]">
                        <Image src={mentors[2].img} alt={mentors[2].name} width={240} height={240} className="w-full h-full object-cover" />
                      </div>
                    </div>
                    <div className="md:w-3/4">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <h3 className="text-3xl font-bold">{mentors[2].name}</h3>
                        <span className="text-xs bg-[#A3E635]/10 text-[#A3E635] border border-[#A3E635]/20 px-3 py-1 rounded-full">Engineering</span>
                      </div>
                      <p className="text-[#A3E635] text-sm font-semibold mb-4">{mentors[2].role}</p>
                      <p className="text-white/60 text-sm leading-relaxed mb-6">
                        Priya Nair is the CTO of Stripe, where she oversees a 3,000-person engineering organization building the economic infrastructure for the internet. Before Stripe, Priya was an engineering director at Meta, leading the Payments & Commerce infrastructure team that processed $100B+ in annual transactions. She started her career at Amazon Web Services, where she helped launch DynamoDB. Priya is deeply technical and brings a systems-thinking approach to startups — she helps founders make the right architecture decisions early, build engineering culture, and hire their first 10 engineers.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="border border-white/10 rounded-xl p-4">
                          <div className="text-xs text-white/40 mb-1">Companies built</div>
                          <div className="text-sm font-semibold">Stripe (CTO), Meta (Eng Dir), AWS (DynamoDB)</div>
                        </div>
                        <div className="border border-white/10 rounded-xl p-4">
                          <div className="text-xs text-white/40 mb-1">Investment thesis</div>
                          <div className="text-sm font-semibold">Infrastructure, fintech, deep-tech platforms</div>
                        </div>
                        <div className="border border-white/10 rounded-xl p-4">
                          <div className="text-xs text-white/40 mb-1">Expertise areas</div>
                          <div className="text-sm font-semibold">System design, scaling, eng hiring, tech debt</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-white/30">
                        <Briefcase className="w-3.5 h-3.5" /> 18+ years in engineering · 3,000+ engineers managed · $100B+ infrastructure
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Tom Brandt */}
              <Reveal delay={0.2}>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-[#A3E635]/30 transition-colors">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-1/4 shrink-0">
                      <div className="rounded-2xl overflow-hidden aspect-square max-w-[240px]">
                        <Image src={mentors[3].img} alt={mentors[3].name} width={240} height={240} className="w-full h-full object-cover" />
                      </div>
                    </div>
                    <div className="md:w-3/4">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <h3 className="text-3xl font-bold">{mentors[3].name}</h3>
                        <span className="text-xs bg-[#A3E635]/10 text-[#A3E635] border border-[#A3E635]/20 px-3 py-1 rounded-full">GTM</span>
                      </div>
                      <p className="text-[#A3E635] text-sm font-semibold mb-4">{mentors[3].role}</p>
                      <p className="text-white/60 text-sm leading-relaxed mb-6">
                        Tom Brandt is a General Partner at Andreessen Horowitz, where he focuses on enterprise SaaS and go-to-market strategy. Before a16z, Tom was the co-founder and CEO of Lever (acquired by Employ Inc. in 2022), an ATS used by 5,000+ companies worldwide. He previously led sales at Palantir during its hypergrowth phase, scaling the enterprise team from 15 to 200+ reps. Tom is an expert at helping founders navigate the messy early days of enterprise sales — building pipeline, closing first customers, and figuring out pricing. He runs a weekly office hour on fundraising and GTM for our cohort.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="border border-white/10 rounded-xl p-4">
                          <div className="text-xs text-white/40 mb-1">Companies built</div>
                          <div className="text-sm font-semibold">Lever (CEO, acquired), Palantir (Sales Lead)</div>
                        </div>
                        <div className="border border-white/10 rounded-xl p-4">
                          <div className="text-xs text-white/40 mb-1">Investment thesis</div>
                          <div className="text-sm font-semibold">Enterprise SaaS, vertical software, sales-led growth</div>
                        </div>
                        <div className="border border-white/10 rounded-xl p-4">
                          <div className="text-xs text-white/40 mb-1">Expertise areas</div>
                          <div className="text-sm font-semibold">GTM strategy, enterprise sales, pricing, fundraising</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-white/30">
                        <Briefcase className="w-3.5 h-3.5" /> 14+ years in GTM · 1 exit · $2B+ AUM at a16z
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* CTA */}
            <Reveal delay={0.2}>
              <div className="text-center mt-16">
                <p className="text-white/40 text-sm mb-6">Want to work with these mentors?</p>
                <button onClick={() => goTo("apply")} className="bg-[#A3E635] text-[#060A0F] font-bold text-lg px-8 py-4 rounded-full hover:bg-[#BEF264] transition-colors inline-flex items-center gap-2 cursor-pointer">
                  Apply for W24 <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </Reveal>
          </div>
        </section>
      </div>

      {/* --- APPLY PAGE --- */}
      <div style={{ display: page === "apply" ? "block" : "none" }}>
        <section className="pt-32 pb-24 px-6 min-h-[85vh] flex items-center justify-center">
          <div className="max-w-2xl w-full bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#A3E635]/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-[#3B82F6]/5 rounded-full blur-3xl pointer-events-none" />

            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-[#A3E635]/10 border border-[#A3E635]/20 text-[#A3E635] text-sm font-medium px-4 py-2 rounded-full mb-6">
                <Rocket className="w-4 h-4" /> Cohort W24 — Applications Open
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Start your application</h1>
              <p className="text-white/50 text-sm max-w-md mx-auto">
                Apply to the Zero to One 12-week accelerator. We invest €500K and help you scale. Takes ~15 minutes to complete.
              </p>
            </div>

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-white/60 text-sm font-medium mb-2 block">Startup Name</label>
                  <input type="text" placeholder="Acme Inc." className="w-full bg-white/5 border border-white/20 rounded-xl px-5 py-3.5 text-white placeholder:text-white/20 focus:outline-none focus:border-[#A3E635]/50 transition-colors" />
                </div>
                <div>
                  <label className="text-white/60 text-sm font-medium mb-2 block">Website or Deck Link</label>
                  <input type="url" placeholder="https://mydeck.pdf" className="w-full bg-white/5 border border-white/20 rounded-xl px-5 py-3.5 text-white placeholder:text-white/20 focus:outline-none focus:border-[#A3E635]/50 transition-colors" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-white/60 text-sm font-medium mb-2 block">Contact Email</label>
                  <input type="email" placeholder="founder@startup.com" className="w-full bg-[#060A0F]/50 border border-white/20 rounded-xl px-5 py-3.5 text-white placeholder:text-white/20 focus:outline-none focus:border-[#A3E635]/50 transition-colors" />
                </div>
                <div>
                  <label className="text-white/60 text-sm font-medium mb-2 block">Sector</label>
                  <select className="w-full bg-[#0D1520] border border-white/20 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-[#A3E635]/50 transition-colors">
                    <option>AI/ML</option>
                    <option>Fintech</option>
                    <option>Developer Tools</option>
                    <option>HealthTech</option>
                    <option>CleanTech</option>
                    <option>Design Tools</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-white/60 text-sm font-medium mb-2 block">What is your startup building?</label>
                <textarea rows={4} placeholder="Describe your product, target audience, and current traction..." className="w-full bg-white/5 border border-white/20 rounded-xl px-5 py-3.5 text-white placeholder:text-white/20 focus:outline-none focus:border-[#A3E635]/50 transition-colors resize-none" />
              </div>

              <button type="submit" className="w-full bg-[#A3E635] text-[#060A0F] font-bold py-4 rounded-full hover:bg-[#BEF264] transition-colors flex items-center justify-center gap-2 cursor-pointer border-none">
                Submit Application <ArrowRight className="w-5 h-5" />
              </button>
            </form>

            <p className="text-center text-xs text-white/30 mt-6">
              Deadline: November 15, 2026. Results by December 1, 2026.
            </p>
          </div>
        </section>
      </div>

      {/* --- LEGAL PAGE --- */}
      <div style={{ display: page === "legal" ? "block" : "none" }}>
        <section className="pt-32 pb-24 px-6">
          <div className="max-w-4xl mx-auto">
            <Reveal>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-[#A3E635]/10 text-[#A3E635] rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold">Legal Notice & Privacy</h1>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="space-y-8">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold mb-6 text-[#A3E635]">Site Publisher</h2>
                  <div className="space-y-3 text-white/60 text-sm leading-relaxed">
                    <p><strong className="text-white">Publisher:</strong> Aevia WS — Valentin Milliand, sole proprietor.</p>
                    <p><strong className="text-white">SIREN:</strong> 852 546 225 — RCS Bourg-en-Bresse, France.</p>
                    <p><strong className="text-white">Contact:</strong> <span className="text-[#A3E635]">contact@aevia.ws</span></p>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold mb-6 text-[#A3E635]">Hosting</h2>
                  <div className="space-y-3 text-white/60 text-sm leading-relaxed">
                    <p><strong className="text-white">Provider:</strong> Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA.</p>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold mb-6 text-[#A3E635]">Intellectual Property</h2>
                  <div className="space-y-3 text-white/60 text-sm leading-relaxed">
                    <p>All content (text, images, code, design) present on this site is protected by intellectual property law. Unauthorized reproduction, distribution, or modification is strictly prohibited without prior written consent from Aevia WS.</p>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold mb-6 text-[#A3E635]">Personal Data & Privacy Policy</h2>
                  <div className="space-y-3 text-white/60 text-sm leading-relaxed">
                    <p>No personal data is collected without explicit consent. This site is fully GDPR compliant.</p>
                    <p>When you voluntarily submit your email address through the application form, it is used solely for the purpose of processing your application and communicating regarding program updates. Your data is never sold, shared with third parties for marketing purposes, or used beyond its stated purpose.</p>
                    <p>You have the right to access, modify, or delete your personal data at any time by contacting us at <span className="text-[#A3E635]">contact@aevia.ws</span>.</p>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold mb-6 text-[#A3E635]">Cookies</h2>
                  <div className="space-y-3 text-white/60 text-sm leading-relaxed">
                    <p>This site uses only essential, non-tracking cookies required for basic functionality. No analytics, advertising, or third-party tracking cookies are used without your explicit consent.</p>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold mb-6 text-[#A3E635]">Limitation of Liability</h2>
                  <div className="space-y-3 text-white/60 text-sm leading-relaxed">
                    <p>Aevia WS strives to ensure the accuracy of all information published on this site. However, we cannot guarantee that all content is complete, accurate, or up-to-date. Aevia WS shall not be held liable for any direct or indirect damages arising from the use of this site.</p>
                  </div>
                </div>

                <p className="text-white/30 text-xs text-center pt-4">Last updated: June 2026</p>
              </div>
            </Reveal>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <button onClick={() => goTo("home")} className="flex items-center gap-2 cursor-pointer bg-transparent border-none">
            <div className="w-7 h-7 bg-[#A3E635] rounded-lg flex items-center justify-center">
              <Rocket className="w-3.5 h-3.5 text-[#060A0F]" />
            </div>
            <span className="font-semibold text-white">Zero to One</span>
          </button>
          <div className="flex gap-8 text-sm text-white/40">
            <button onClick={() => goTo("portfolio")} className="hover:text-white transition-colors cursor-pointer bg-transparent border-none text-sm text-white/40">Portfolio</button>
            <button onClick={() => goTo("mentors")} className="hover:text-white transition-colors cursor-pointer bg-transparent border-none text-sm text-white/40">Team</button>
            <button onClick={() => goTo("home")} className="hover:text-white transition-colors cursor-pointer bg-transparent border-none text-sm text-white/40">Blog</button>
            <button onClick={() => goTo("home")} className="hover:text-white transition-colors cursor-pointer bg-transparent border-none text-sm text-white/40">Contact</button>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => goTo("legal")} className="text-white/30 text-sm hover:text-white/60 transition-colors cursor-pointer bg-transparent border-none">Legal</button>
            <p className="text-white/30 text-sm">© 2026 Zero to One Ventures</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
