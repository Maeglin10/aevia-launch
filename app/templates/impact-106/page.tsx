"use client";
// @ts-nocheck
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { PenTool, ArrowRight, Menu, Star, Layers, Eye, Palette, Zap, Award, Users, ChevronRight, ArrowUpRight } from "lucide-react"
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

function ParallaxImg({ src, alt }: { src: string; alt: string }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"])
  return (
    <div ref={ref} className="relative w-full h-full overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-[-12%] w-[124%] h-[124%]">
        <Image src={src} alt={alt} fill className="object-cover" />
      </motion.div>
    </div>
  )
}

const PROJECTS = [
  { title: "Flux Identity", client: "Flux Labs", type: "Brand System", img: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&q=80&w=1200", year: "2024" },
  { title: "Prism Launch", client: "Prism Analytics", type: "Product Design", img: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=1200", year: "2024" },
  { title: "Ember Editorial", client: "Ember Magazine", type: "Editorial + Web", img: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=1200", year: "2023" },
  { title: "Vertex Motion", client: "Vertex Films", type: "Motion Design", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200", year: "2023" },
]

const CAPABILITIES = [
  { icon: Palette, title: "Visual Identity", desc: "Logo, color system, typography, and brand guidelines that scale from app icon to billboard." },
  { icon: Layers, title: "Product Design", desc: "User research, wireframes, prototypes, and pixel-perfect UI for web and mobile." },
  { icon: PenTool, title: "Art Direction", desc: "Photo shoots, illustration commissions, and visual storytelling for campaigns." },
  { icon: Zap, title: "Motion & 3D", desc: "Animated logos, explainer videos, and three-dimensional brand worlds." },
]


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function StudioVersaPage() {
  const [session, setSession] = useState<{
    formData?: {
      businessName?: string; businessType?: string; tagline?: string;
      city?: string; mainService?: string; benefits?: string[];
      priceRange?: string; targetAudience?: string; brandColor?: string;
      email?: string; phone?: string; instagram?: string; linkedin?: string;
    };
    generatedContent?: {
      heroHeadline?: string; heroSubline?: string; aboutTitle?: string;
      aboutText?: string; ctaText?: string; metaTitle?: string;
      metaDescription?: string;
      services?: { title?: string; description?: string }[];
      testimonials?: { name?: string; role?: string; text?: string; rating?: number }[];
    };
  } | null>(null);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("session");
    if (!id) return;
    fetch(`/api/sessions?id=${id}`)
      .then((r) => r.json())
      .then(setSession)
      .catch(() => {});
  }, []);

  fd = session?.formData;
  c = session?.generatedContent;
  brand = fd?.brandColor ?? null; // null = keep template's original color

  const [scrolled, setScrolled] = useState(false)

  const { scrollYProgress } = useScroll()
  const heroOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0])

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
  }, []);

  // Dynamic Services & Testimonials Mutation for Session Data
  useEffect(() => {
    if (c?.services) {
      const services_arrays = [
        typeof SERVICES !== 'undefined' ? SERVICES : null,
        typeof features !== 'undefined' ? features : null,
        typeof services !== 'undefined' ? services : null,
        typeof FEATURES !== 'undefined' ? FEATURES : null,
      ];
      services_arrays.forEach(arr => {
        if (arr && Array.isArray(arr)) {
          arr.forEach((s, idx) => {
            if (idx < 3 && c.services[idx]) {
              if (s && typeof s === 'object') {
                s.title = c.services[idx].title ?? s.title;
                if ('desc' in s) s.desc = c.services[idx].description ?? s.desc;
                if ('description' in s) s.description = c.services[idx].description ?? s.description;
              }
            }
          });
        }
      });
    }
    if (c?.testimonials) {
      const testimonials_arrays = [
        typeof TESTIMONIALS !== 'undefined' ? TESTIMONIALS : null,
        typeof testimonials !== 'undefined' ? testimonials : null,
        typeof REVIEWS !== 'undefined' ? REVIEWS : null,
        typeof reviews !== 'undefined' ? reviews : null,
      ];
      testimonials_arrays.forEach(arr => {
        if (arr && Array.isArray(arr)) {
          arr.forEach((t, idx) => {
            if (idx < 3 && c.testimonials[idx]) {
              if (t && typeof t === 'object') {
                t.name = c.testimonials[idx].name ?? t.name;
                if ('role' in t) t.role = c.testimonials[idx].role ?? t.role;
                if ('text' in t) t.text = c.testimonials[idx].text ?? t.text;
                if ('quote' in t) t.quote = c.testimonials[idx].text ?? t.quote;
                if ('desc' in t) t.desc = c.testimonials[idx].text ?? t.desc;
              }
            }
          });
        }
      });
    }
  }, [c]);return (
    <div className="bg-[#faf5f0] text-[#1a1a1a] font-sans min-h-screen selection:bg-orange-500 selection:text-white overflow-x-hidden">

      {/* ── NAVBAR ─────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? "bg-[#faf5f0]/90 backdrop-blur-xl border-b border-orange-500/10 py-4" : "bg-transparent py-8"}`}>
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="#hero" className="flex items-center gap-3">
            {fd?.logoBase64 ? (
              <img
                src={fd.logoBase64}
                alt={fd?.businessName ?? 'logo'}
                style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
              />
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
                  <PenTool className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-light tracking-[0.15em] uppercase">Studio <span className="font-black text-orange-500">Versa</span></span>
              </>
            )}
          </Link>
          <div className="hidden lg:flex gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-[#1a1a1a]/40">
            {["Work", "Capabilities", "Team", "Journal"].map(l => (
              <Link key={l} href="#equipe" className="hover:text-orange-500 transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-6">
            <button className="hidden md:block px-8 py-3 bg-[#1a1a1a] text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-orange-500 transition-colors duration-500">
              Start a Project
            </button>
            <Sheet>
              <SheetTrigger className="lg:hidden"><Menu className="w-6 h-6" /></SheetTrigger>
              <SheetContent side="right" className="bg-[#faf5f0] p-12">
                <div className="flex flex-col gap-8 mt-16">
                  {["Work", "Capabilities", "Team", "Contact"].map(l => (
                    <Link key={l} href="#equipe" className="text-3xl font-light uppercase tracking-widest hover:text-orange-500 transition-colors">{l}</Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      <main>
        {/* ── HERO ─────────────────── */}
        <section id="hero" className="relative min-h-[90vh] flex items-center pt-40 pb-20 overflow-hidden">
          <div className="absolute top-0 right-0 w-[50vw] h-full hidden lg:block">
            <ParallaxImg src="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&q=80&w=1600" alt="Studio" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#faf5f0] via-[#faf5f0]/40 to-transparent" />
          </div>

          <motion.div style={{ opacity: heroOpacity }} className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-12 w-full">
            <Reveal>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-[2px] bg-orange-500" />
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-orange-500">Multidisciplinary Creative Studio</span>
              </div>
            </Reveal>
            <Reveal delay={0.1} y={60}>
              <h1 className="text-6xl md:text-8xl lg:text-[9rem] font-black tracking-tighter leading-[0.8] mb-8 max-w-4xl">{c?.heroHeadline ?? <>
                Design<br/>With <span className="text-orange-500 italic">Intent.</span>
              </>}</h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-xl text-[#1a1a1a]/50 font-light max-w-lg leading-relaxed mb-10">{c?.heroSubline ?? fd?.tagline ?? <>
                We craft brand identities, digital products, and visual stories for companies that want to matter.
              </>}</p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="flex flex-wrap gap-6">
                {[
                  { v: "86", l: "Projects" },
                  { v: "14", l: "Awards" },
                  { v: "7yr", l: "Active" },
                ].map((s, i) => (
                  <div key={i} className="border-l-2 border-orange-500/20 pl-4">
                    <div className="text-2xl font-black text-orange-500">{s.v}</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a]/30">{s.l}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </motion.div>
        </section>

        {/* ── WORK ──────────────────── */}
        <section id="realisations" className="py-32 bg-[#faf5f0]">
          <div className="max-w-[1600px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="flex justify-between items-end mb-20">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-orange-500 block mb-4">Portfolio</span>
                  <h2 className="text-5xl md:text-7xl font-black tracking-tighter">Selected <span className="text-orange-500 italic">Work.</span></h2>
                </div>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {PROJECTS.map((p, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="group cursor-pointer">
                    <div className="relative aspect-[16/10] overflow-hidden rounded-xl mb-6">
                      <ParallaxImg src={p.img} alt={p.title} />
                      <div className="absolute inset-0 bg-orange-900/0 group-hover:bg-orange-900/10 transition-colors duration-700" />
                      <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <ArrowUpRight className="w-5 h-5 text-[#1a1a1a]" />
                      </div>
                    </div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-2xl font-bold group-hover:text-orange-500 transition-colors mb-1">{p.title}</h3>
                        <div className="text-sm text-[#1a1a1a]/40">{p.client} · {p.type}</div>
                      </div>
                      <span className="text-xs text-[#1a1a1a]/30 font-mono">{p.year}</span>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── CAPABILITIES ──────────── */}
        <section id="equipe" className="py-32 bg-[#1a1a1a] text-white">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="text-center mb-24">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-orange-400 block mb-4">What We Do</span>
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter">Our <span className="text-orange-400 italic">Craft.</span></h2>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {CAPABILITIES.map((c, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <div className="group p-10 bg-white/[0.03] border border-white/5 rounded-2xl hover:border-orange-500/30 transition-all duration-500 cursor-default">
                    <div className="flex items-start gap-6">
                      <div className="w-14 h-14 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0 group-hover:bg-orange-500 group-hover:border-orange-500 transition-all duration-500">
                        <c.icon className="w-6 h-6 text-orange-400 group-hover:text-white transition-colors" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-3">{c.title}</h3>
                        <p className="text-sm text-white/40 leading-relaxed">{c.desc}</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── TEAM ──────────────────── */}
        <section className="py-32 bg-[#faf5f0]">
          <div className="max-w-[1600px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="mb-20">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-orange-500 block mb-4">The People</span>
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter">Behind the <span className="text-orange-500 italic">Work.</span></h2>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { name: "Mia Versa", role: "Creative Director", yrs: "10yr", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400", tags: ["Brand", "Identity"] },
                { name: "Theo Nakamura", role: "Lead Product Designer", yrs: "7yr", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400", tags: ["UX", "Mobile"] },
                { name: "Sasha Okafor", role: "Art Director", yrs: "8yr", img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=400", tags: ["Campaign", "Photo"] },
                { name: "Remi Blanc", role: "Motion & 3D Lead", yrs: "5yr", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400", tags: ["Motion", "3D"] },
              ].map((m, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <div className="group">
                    <div className="relative aspect-[3/4] overflow-hidden rounded-xl mb-6 bg-[#1a1a1a]">
                      <ParallaxImg src={m.img} alt={m.name} />
                      <div className="absolute inset-0 bg-orange-900/0 group-hover:bg-orange-500/10 transition-colors duration-700" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex gap-2">
                        {m.tags.map(t => <span key={t} className="px-3 py-1 bg-orange-500 text-white text-[9px] font-bold uppercase tracking-widest rounded-full">{t}</span>)}
                      </div>
                    </div>
                    <div className="border-l-2 border-orange-500/20 pl-4">
                      <div className="text-lg font-bold group-hover:text-orange-500 transition-colors">{m.name}</div>
                      <div className="text-xs text-[#1a1a1a]/40 font-bold uppercase tracking-widest mt-1">{m.role}</div>
                      <div className="text-[10px] text-orange-500 font-mono mt-1">{m.yrs}</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── CLIENTS & AWARDS ──────────── */}
        <section className="py-24 bg-[#1a1a1a] text-white">
          <div className="max-w-[1600px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="flex flex-wrap items-center justify-between gap-8 mb-16">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-orange-400">Trusted By</span>
                <div className="flex flex-wrap gap-6">
                  {["Awwwards SOTD", "CSS Design Award", "FWA of the Day", "Cannes Lions Bronze"].map(a => (
                    <span key={a} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-orange-400">
                      <Award className="w-3 h-3" /> {a}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5">
              {["Flux Labs", "Prism Analytics", "Ember Magazine", "Vertex Films", "Arch Studio", "Nova Health", "Kōdo Games", "Dune Capital"].map((c, i) => (
                <Reveal key={c} delay={i * 0.05}>
                  <div className="bg-[#1a1a1a] p-8 flex items-center justify-center group hover:bg-orange-500/5 transition-colors duration-500 cursor-default">
                    <span className="text-sm font-bold tracking-wider text-white/20 group-hover:text-white/60 transition-colors">{c}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ─────────────────── */}
        <section id="contact" className="py-32 bg-[#faf5f0]">
          <div className="max-w-[800px] mx-auto px-6 text-center">
            <Reveal>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">{c?.aboutTitle ?? fd?.businessName ?? <>
                Let's Make<br/><span className="text-orange-500 italic">Something.</span>
              </>}</h2>
              <p className="text-lg text-[#1a1a1a]/40 font-light max-w-md mx-auto mb-10">{c?.aboutText ?? <>
                We're selective about the projects we take on. If you're serious about great design, we should talk.
              </>}</p>
              <button className="px-12 py-5 bg-[#1a1a1a] text-white font-bold rounded-full hover:bg-orange-500 transition-colors duration-500">
                Start a Conversation
              </button>
            </Reveal>
          </div>
        </section>
      </main>

      {/* ── FOOTER ─────────────────── */}
      <footer className="bg-[#1a1a1a] text-white pt-24 pb-12 px-6">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center"><PenTool className="w-4 h-4 text-white" /></div>
              <span className="font-light tracking-[0.15em] uppercase">Studio <span className="font-black text-orange-400">Versa</span></span>
            </div>
            <p className="text-sm text-white/30 leading-relaxed">Multidisciplinary creative studio for ambitious brands.</p>
          </div>
          {[
            { title: "Studio", links: ["Work", "Capabilities", "Awards", "Team"] },
            { title: "Connect", links: ["Contact", "Careers", "Press", "Newsletter"] },
            { title: "Social", links: ["Camera", "Behance", "Dribbble", "LinkedIn"] },
          ].map((col, i) => (
            <div key={i}>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-orange-400 mb-6">{col.title}</h4>
              <ul className="space-y-3 text-sm text-white/30">
                {col.links.map(l => <li key={l}><Link href={ l === "LinkedIn" || l === "Linkedin" ? "https://linkedin.com" : l === "Contact" || l === "contact" ? "#contact" : `#${l.toLowerCase().replace(/\s+/g, "").replace(/[éèê]/g, "e").replace(/[àâ]/g, "a")}` } className="hover:text-white transition-colors">{l}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-[1200px] mx-auto pt-8 border-t border-white/10 text-[10px] font-bold uppercase tracking-widest text-white/20 flex justify-between">
          <span>© 2026 STUDIO VERSA.</span>
          <span>DESIGN WITH INTENT.</span>
        </div>
      </footer>
    </div>
  )
}
