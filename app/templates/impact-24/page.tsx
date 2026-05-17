"use client"

import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import { ArrowRight, Zap, Users, TrendingUp, Globe, CheckCircle, ChevronDown, Rocket, Star, Clock } from "lucide-react"

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

  const filtered = activeSector === "All" ? companies : companies.filter(c => c.sector === activeSector)

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
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#A3E635] rounded-lg flex items-center justify-center">
              <Rocket className="w-4 h-4 text-[#060A0F]" />
            </div>
            <span className="font-semibold text-lg">Zero to One</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-white/60">
            <a href="#portfolio" className="hover:text-white transition-colors cursor-pointer">Portfolio</a>
            <a href="#program" className="hover:text-white transition-colors cursor-pointer">Program</a>
            <a href="#mentors" className="hover:text-white transition-colors cursor-pointer">Mentors</a>
            <a href="#apply" className="hover:text-white transition-colors cursor-pointer">Apply</a>
          </div>
          <a href="#apply" className="hidden md:flex bg-[#A3E635] text-[#060A0F] text-sm font-semibold px-5 py-2 rounded-full hover:bg-[#BEF264] transition-colors cursor-pointer">
            Apply Now
          </a>
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
              {["Portfolio", "Program", "Mentors", "Apply"].map(item => (
                <a key={item} href={`#${item.toLowerCase()}`} className="text-white/70 hover:text-white transition-colors cursor-pointer" onClick={() => setMenuOpen(false)}>{item}</a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

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
            <a href="#apply" className="bg-[#A3E635] text-[#060A0F] font-bold text-lg px-8 py-4 rounded-full hover:bg-[#BEF264] transition-colors flex items-center gap-2 cursor-pointer">
              Apply for W24 <ArrowRight className="w-5 h-5" />
            </a>
            <a href="#portfolio" className="text-white/60 hover:text-white transition-colors flex items-center gap-2 text-lg cursor-pointer">
              See portfolio <ArrowRight className="w-4 h-4" />
            </a>
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
                <h2 className="text-4xl md:text-5xl font-bold">Companies we've backed</h2>
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
                <button className="bg-[#A3E635] text-[#060A0F] font-bold px-8 py-4 rounded-full hover:bg-[#BEF264] transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap">
                  Start Application <ArrowRight className="w-5 h-5" />
                </button>
              </div>
              <p className="text-white/30 text-sm mt-6">Deadline: November 15, 2026 · Results by December 1</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#A3E635] rounded-lg flex items-center justify-center">
              <Rocket className="w-3.5 h-3.5 text-[#060A0F]" />
            </div>
            <span className="font-semibold">Zero to One</span>
          </div>
          <div className="flex gap-8 text-sm text-white/40">
            <a href="#" className="hover:text-white transition-colors cursor-pointer">Portfolio</a>
            <a href="#" className="hover:text-white transition-colors cursor-pointer">Team</a>
            <a href="#" className="hover:text-white transition-colors cursor-pointer">Blog</a>
            <a href="#" className="hover:text-white transition-colors cursor-pointer">Contact</a>
          </div>
          <p className="text-white/30 text-sm">© 2026 Zero to One Ventures</p>
        </div>
      </footer>
    </div>
  )
}
