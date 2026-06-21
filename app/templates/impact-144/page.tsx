// @ts-nocheck
"use client"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Sparkles, ArrowRight, Menu, Star, Layers, Eye, Zap, Megaphone, PenTool, Award, Users, ChevronRight, ArrowUpRight } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

function Reveal({ children, delay = 0, y = 40 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }} animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  )
}

function Marquee({ children, reverse = false }: { children: React.ReactNode; reverse?: boolean }) {
  return (
    <div className="overflow-hidden whitespace-nowrap">
      <motion.div
        className="inline-flex gap-12"
        animate={{ x: reverse ? ["0%", "-50%"] : ["-50%", "0%"] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      >
        {children}
        {children}
      </motion.div>
    </div>
  )
}

const WORDS_1 = ["DESIGN", "MOTION", "IDENTITY", "STRATEGY", "CONTENT", "DIGITAL", "BRAND"]
const WORDS_2 = ["CREATE", "LAUNCH", "SCALE", "DISRUPT", "CONVERT", "ENGAGE", "GROW"]

const WORK = [
  { title: "Neon Drift", client: "Pulse Gaming", type: "Brand Launch", img: "https://picsum.photos/seed/brand/1200/750" },
  { title: "Apex Protocol", client: "Velos Finance", type: "Web3 Campaign", img: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=1200" },
  { title: "Silk Thread", client: "Maison Versa", type: "Motion Design", img: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=1200" },
  { title: "Gravity Shift", client: "Prism Analytics", type: "Product Campaign", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200" },
]

const SERVICES = [
  { icon: PenTool, title: "Brand Identity", desc: "Name, logo, visual system, and tone of voice. A complete brand from scratch." },
  { icon: Layers, title: "Web Experiences", desc: "Immersive websites that convert attention into action." },
  { icon: Megaphone, title: "Campaign Design", desc: "Multi-channel campaigns that amplify your message." },
  { icon: Zap, title: "Motion Design", desc: "Animated content that stops the scroll." },
]

const TESTIMONIALS = [
  { text: "Kinetic doesn't just design — they ignite. Our rebrand generated a 400% increase in social engagement within the first month.", author: "Maya Chen", role: "VP Marketing, Pulse Gaming" },
  { text: "The website they built is an experience. Our bounce rate dropped to 8% and conversions tripled.", author: "Thomas Engström", role: "CEO, Prism Analytics" },
  { text: "Working with Kinetic felt like having the best creative team in-house. Except they're actually good.", author: "Sarah Laurent", role: "Founder, Maison Versa" },
]

export default function KineticMarqueePage() {
  const [scrolled, setScrolled] = useState(false)
  const [contactSubmitted, setContactSubmitted] = useState(false)

  const { scrollYProgress } = useScroll()
  const heroOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0])

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
  }, [])

  return (
    <div className="bg-[#0a0506] text-white font-sans min-h-screen selection:bg-orange-500 selection:text-white overflow-x-hidden">

      {/* ── NAVBAR ──────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? "bg-[#0a0506]/90 backdrop-blur-xl border-b border-orange-500/10 py-4" : "bg-transparent py-8"}`}>
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/templates/impact-144" className="text-2xl font-black tracking-tighter">
            KIN<span className="text-orange-500">ETIC</span>
          </Link>
          <div className="hidden lg:flex gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
            {["Work", "Services", "About", "Contact"].map(l => (
              <Link key={l} href={`#${l.toLowerCase()}`} onClick={(e) => {
                e.preventDefault();
                document.getElementById(l.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
              }} className="hover:text-orange-400 transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              className="hidden md:block px-8 py-3 bg-orange-500 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-white hover:text-black transition-all duration-500"
            >
              Start a Project
            </button>
            <Sheet>
              <SheetTrigger asChild><button className="lg:hidden"><Menu className="w-6 h-6 text-white" /></button></SheetTrigger>
              <SheetContent side="right" className="bg-[#0a0506] border-orange-500/10 p-12">
                <div className="flex flex-col gap-8 mt-16">
                  {["Work", "Services", "About", "Contact"].map(l => (
                    <Link key={l} href={`#${l.toLowerCase()}`} onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(l.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
                    }} className="text-3xl font-light uppercase tracking-widest hover:text-orange-400 transition-colors">{l}</Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      <main>
        {/* ── HERO + MARQUEE ──── */}
        <section className="relative min-h-screen flex flex-col justify-center pt-32 pb-20 overflow-hidden">
          <motion.div style={{ opacity: heroOpacity }} className="max-w-[1600px] mx-auto px-6 md:px-12 w-full mb-20">
            <Reveal>
              <div className="flex items-center gap-4 mb-8">
                <motion.div className="w-3 h-3 rounded-full bg-orange-500" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-orange-400">Creative Agency — Open for Projects</span>
              </div>
            </Reveal>
            <Reveal delay={0.1} y={60}>
              <h1 className="text-7xl md:text-[8rem] lg:text-[11rem] font-black tracking-tighter leading-[0.8] mb-10 uppercase">
                We Make<br/>It <span className="text-orange-500 italic">Move.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.25}>
              <p className="text-xl text-white/40 font-light max-w-lg leading-relaxed">
                Brand identity, web experiences, and motion design for companies that refuse to stand still.
              </p>
            </Reveal>
          </motion.div>

          {/* Marquee bands */}
          <div className="space-y-4">
            <div className="py-4 border-y border-white/5 -rotate-1">
              <Marquee>
                <div className="flex gap-12">
                  {WORDS_1.map((w, i) => (
                    <span key={i} className="text-5xl md:text-7xl font-black tracking-tighter text-white/5 uppercase flex items-center gap-6">
                      {w} <span className="text-orange-500 text-2xl">✦</span>
                    </span>
                  ))}
                </div>
              </Marquee>
            </div>
            <div className="py-4 border-y border-white/5 rotate-1">
              <Marquee reverse>
                <div className="flex gap-12">
                  {WORDS_2.map((w, i) => (
                    <span key={i} className="text-5xl md:text-7xl font-black tracking-tighter text-white/5 uppercase flex items-center gap-6">
                      {w} <span className="text-orange-500 text-2xl">✦</span>
                    </span>
                  ))}
                </div>
              </Marquee>
            </div>
          </div>
        </section>

        {/* ── WORK ─────────── */}
        <section id="work" className="py-32 bg-[#0a0506]">
          <div className="max-w-[1600px] mx-auto px-6 md:px-12">
            <Reveal>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-20">
                Selected <span className="text-orange-500 italic">Work.</span>
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {WORK.map((w, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="group cursor-pointer">
                    <div className="relative aspect-[16/10] overflow-hidden rounded-xl mb-6">
                      <Image src={w.img} alt={w.title} fill className="object-cover group-hover:scale-105 transition-transform duration-1000" />
                      <div className="absolute inset-0 bg-orange-900/0 group-hover:bg-orange-900/10 transition-colors duration-700" />
                      <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowUpRight className="w-5 h-5 text-black" />
                      </div>
                    </div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-2xl font-bold group-hover:text-orange-400 transition-colors">{w.title}</h3>
                        <div className="text-sm text-white/30">{w.client} · {w.type}</div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── SERVICES ─────── */}
        <section id="services" className="py-32 bg-[#0d0708]">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="text-center mb-24">
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase">What We <span className="text-orange-500 italic">Do.</span></h2>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {SERVICES.map((s, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <div className="group p-10 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-orange-500/30 transition-all duration-500">
                    <div className="flex items-start gap-6">
                      <div className="w-14 h-14 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0 group-hover:bg-orange-500 group-hover:border-orange-500 transition-all duration-500">
                        <s.icon className="w-6 h-6 text-orange-400 group-hover:text-white transition-colors" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-3">{s.title}</h3>
                        <p className="text-sm text-white/40 leading-relaxed">{s.desc}</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── ABOUT & TEAM ──── */}
        <section id="about" className="py-32 bg-[#0a0506] border-t border-white/5">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
                <div>
                  <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-8">
                    Moving <span className="text-orange-500 italic">Forward.</span>
                  </h2>
                  <p className="text-lg text-white/50 leading-relaxed font-light">
                    Kinetic is a collective of designers, developers, and strategists obsessed with motion. We believe brands shouldn't just exist — they should move, engage, and inspire. By blending motion design with cutting-edge technology, we craft digital experiences that capture attention and refuse to let go.
                  </p>
                </div>
                <div className="flex flex-col justify-center gap-6">
                  <div className="border-l-2 border-orange-500 pl-6">
                    <h3 className="text-xl font-bold mb-2">Our Manifesto</h3>
                    <p className="text-sm text-white/40 leading-relaxed">
                      If it stands still, it's invisible. In a world of infinite scroll, we design for momentum, impact, and unforgettable digital interactions.
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: "Aki Sato", role: "Creative Director", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600" },
                { name: "Leo Croft", role: "Lead Motion Designer", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600" },
                { name: "Zoë Vane", role: "Head of Brand Strategy", img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600" }
              ].map((member, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="group">
                    <div className="relative aspect-[4/5] overflow-hidden rounded-xl mb-4 bg-white/5">
                      <Image
                        src={member.img}
                        alt={member.name}
                        fill
                        className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                      />
                    </div>
                    <h4 className="text-lg font-bold">{member.name}</h4>
                    <p className="text-xs text-white/30 uppercase tracking-widest mt-1">{member.role}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ──── */}
        <section className="py-32 bg-[#0d0708]">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <Reveal>
              <h2 className="text-4xl font-black tracking-tighter uppercase mb-16 text-center">Client <span className="text-orange-500 italic">Words.</span></h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {TESTIMONIALS.map((t, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="p-8 bg-white/[0.02] border border-white/5 rounded-2xl h-full flex flex-col">
                    <div className="flex gap-1 mb-6">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} className="w-4 h-4 fill-orange-400 text-orange-400" />
                      ))}
                    </div>
                    <p className="text-white/50 leading-relaxed flex-1 mb-6 italic">"{t.text}"</p>
                    <div>
                      <div className="font-bold">{t.author}</div>
                      <div className="text-xs text-white/30">{t.role}</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ───────────── */}
        <section className="py-32 bg-orange-500 text-black">
          <div className="max-w-[800px] mx-auto px-6 text-center">
            <Reveal>
              <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase mb-8">
                Let's Make<br/>Something.
              </h2>
              <button
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                className="px-12 py-5 bg-black text-white font-bold rounded-full hover:bg-white hover:text-black transition-all duration-500"
              >
                Start a Project
              </button>
            </Reveal>
          </div>
        </section>

        {/* ── CONTACT ────────── */}
        <section id="contact" className="py-32 bg-[#0a0506] border-t border-white/5">
          <div className="max-w-[800px] mx-auto px-6">
            <Reveal>
              <div className="text-center mb-16">
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-4">
                  Start a <span className="text-orange-500 italic">Project.</span>
                </h2>
                <p className="text-white/40 font-light">Let's build something unforgettable together.</p>
              </div>

              {contactSubmitted ? (
                <div className="p-12 bg-white/[0.02] border border-orange-500/20 rounded-2xl text-center flex flex-col items-center justify-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-500">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold">Thank You</h3>
                  <p className="text-sm text-white/50">Merci, nous vous répondrons sous 24h.</p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setContactSubmitted(true);
                  }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-2">Name</label>
                      <input
                        type="text"
                        required
                        className="w-full bg-white/[0.02] border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-orange-500 transition-colors"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-2">Email</label>
                      <input
                        type="email"
                        required
                        className="w-full bg-white/[0.02] border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-orange-500 transition-colors"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-2">Project Type</label>
                    <select className="w-full bg-[#0a0506] border border-white/10 rounded-lg px-4 py-3 text-sm text-white/60 focus:outline-none focus:border-orange-500 transition-colors">
                      <option className="bg-[#0a0506]">Brand Identity</option>
                      <option className="bg-[#0a0506]">Web Experience</option>
                      <option className="bg-[#0a0506]">Motion Design</option>
                      <option className="bg-[#0a0506]">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-2">Message</label>
                    <textarea
                      required
                      rows={5}
                      className="w-full bg-white/[0.02] border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-orange-500 transition-colors"
                      placeholder="Tell us about your project..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-4 bg-orange-500 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-lg hover:bg-white hover:text-black transition-colors duration-500"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </Reveal>
          </div>
        </section>
      </main>

      {/* ── FOOTER ─────────── */}
      <footer className="bg-[#050305] pt-24 pb-12 px-6">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div>
            <span className="text-2xl font-black tracking-tighter mb-6 block">KIN<span className="text-orange-500">ETIC</span></span>
            <p className="text-sm text-white/30 leading-relaxed">Creative agency for brands in motion.</p>
          </div>
          {[
            { title: "Studio", links: ["Work", "Services", "Team", "Culture"] },
            { title: "Connect", links: ["Contact", "Careers", "Press", "Newsletter"] },
            { title: "Social", links: ["Camera", "Behance", "X", "LinkedIn"] },
          ].map((col, i) => (
            <div key={i}>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-orange-400 mb-6">{col.title}</h4>
              <ul className="space-y-3 text-sm text-white/30">
                {col.links.map(l => (
                  <li key={l}>
                    {l === "Contact" ? (
                      <Link href="#contact" onClick={(e) => {
                        e.preventDefault();
                        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                      }} className="hover:text-white transition-colors">{l}</Link>
                    ) : (
                      <Link href="#contact" className="hover:text-white transition-colors">{l}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-[1200px] mx-auto pt-8 border-t border-white/5 text-[10px] font-bold uppercase tracking-widest text-white/20 flex flex-col md:flex-row justify-between gap-4">
          <span>© 2026 KINETIC. BRANDS IN MOTION.</span>
          <div className="flex gap-6">
            <Link href="/legal/mentions-legales" className="hover:text-white transition-colors">Mentions légales</Link>
            <Link href="/legal/confidentialite" className="hover:text-white transition-colors">Confidentialité</Link>
            <Link href="/legal/cgu" className="hover:text-white transition-colors">CGU</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
