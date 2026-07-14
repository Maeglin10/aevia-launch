"use client";
// @ts-nocheck
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Rocket, ArrowRight, Menu, Globe, Shield, Satellite, Zap, Radio, ChevronRight, Activity, Cpu, Box } from "lucide-react"
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
      <motion.div style={{ y }} className="absolute inset-[-15%] w-[130%] h-[130%]">
        <Image src={src} alt={alt} fill className="object-cover" />
      </motion.div>
    </div>
  )
}

const MISSIONS = [
  { id: "AR-104", target: "Lunar Gateway", payload: "3.2 Tons", type: "Resupply", date: "Sept 12" },
  { id: "AR-105", target: "Low Earth Orbit", payload: "24 Satellites", type: "Deployment", date: "Oct 04" },
  { id: "AR-106", target: "Mars Alpha", payload: "Human Habitat", type: "Exploration", date: "Nov 28" },
]

const FLEET = [
  { name: "Atlas Heavy", capacity: "150 Tons", orbit: "LEO / Lunar", img: "https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&q=80&w=1200" },
  { name: "Nebula One", capacity: "12 Crew", orbit: "LEO / ISS", img: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=1200" },
  { name: "Orbiter X", capacity: "Science Lab", orbit: "Deep Space", img: "https://images.unsplash.com/photo-1454789548928-9efd52dc4031?auto=format&fit=crop&q=80&w=1200" },
]


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function AstrumReachPage() {
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
    <div className="bg-[#02040a] text-white font-sans min-h-dvh selection:bg-cyan-500 selection:text-white overflow-x-hidden">
      
      {/* ── NAVBAR ────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? "bg-[#02040a]/90 backdrop-blur-xl border-b border-cyan-500/20 py-4" : "bg-transparent py-8"}`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="#hero" className="flex items-center gap-3 group">
            {fd?.logoBase64 ? (
              <img
                src={fd.logoBase64}
                alt={fd?.businessName ?? 'logo'}
                style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
              />
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center group-hover:bg-cyan-500 transition-all duration-500">
                  <Rocket className="w-5 h-5 text-cyan-400 group-hover:text-black" />
                </div>
                <span className="text-xl font-light tracking-[0.4em] uppercase">Astrum <span className="text-cyan-500 font-bold">Reach</span></span>
              </>
            )}
          </Link>
          <div className="hidden lg:flex gap-10 text-[10px] font-bold uppercase tracking-[0.4em] text-white/30">
            {["Missions", "Fleet", "Technology", "Control"].map(l => (
              <Link key={l} href="#hero" className="hover:text-cyan-400 transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <button className="hidden md:block px-6 py-2.5 text-white/40 text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors">Command Login</button>
            <button className="px-8 py-3 bg-cyan-600 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-sm hover:bg-cyan-400 transition-all duration-500 shadow-[0_0_20px_rgba(6,182,212,0.3)]">Book Payload</button>
            <Sheet>
              <SheetTrigger className="lg:hidden"><Menu className="w-6 h-6 text-white" /></SheetTrigger>
              <SheetContent side="right" className="bg-[#02040a] border-cyan-500/20 p-12 text-white">
                <div className="flex flex-col gap-8 mt-16 text-left">
                  {["Missions", "Fleet", "Tech", "Support"].map(l => (
                    <Link key={l} href="#hero" className="text-3xl font-light uppercase tracking-widest hover:text-cyan-400 transition-colors">{l}</Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      <main>
        {/* ── HERO ──────────────────── */}
        <section id="hero" className="relative min-h-dvh flex items-center pt-32 pb-20 overflow-hidden">
          {/* Star Field Background */}
          <div className="absolute inset-0 opacity-40">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] bg-repeat" />
             <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-cyan-900/10 blur-[150px] rounded-full animate-pulse" />
          </div>

          <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <div>
                <Reveal>
                  <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-cyan-500/5 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold uppercase tracking-[0.4em] mb-12">
                    <Activity className="w-4 h-4 animate-pulse" /> Orbital Logistics System Active
                  </div>
                </Reveal>
                <Reveal delay={0.1} y={60}>
                  <h1 className="text-6xl md:text-[9rem] font-light tracking-tighter leading-[0.8] uppercase mb-12">{c?.heroHeadline ?? <>
                    Infinite <br/> <span className="text-cyan-500 font-bold">Horizon.</span>
                  </>}</h1>
                </Reveal>
                <Reveal delay={0.3}>
                  <p className="text-xl text-white/40 font-light max-w-lg leading-relaxed mb-12 italic">{c?.heroSubline ?? fd?.tagline ?? <>
                    Reliable, cost-effective orbital transport for the next generation of space exploration. From LEO to deep space, we bridge the gap.
                  </>}</p>
                </Reveal>
                <Reveal delay={0.4}>
                  <div className="flex flex-wrap gap-6">
                    <button className="px-12 py-5 bg-cyan-600 text-white font-bold uppercase tracking-widest text-[10px] hover:bg-cyan-400 transition-all duration-500">
                       Track Current Missions
                    </button>
                    <button className="px-12 py-5 border border-white/10 text-white font-bold uppercase tracking-widest text-[10px] hover:bg-white/5 transition-all flex items-center gap-3">
                       System Status: Green
                    </button>
                  </div>
                </Reveal>
              </div>
              
              <Reveal delay={0.5} y={0}>
                 <div className="relative">
                    <div className="absolute -inset-10 bg-cyan-500/5 blur-[120px] rounded-full" />
                    <div className="relative aspect-square border border-white/5 p-2 bg-white/[0.02] rounded-full overflow-hidden">
                       <Image src="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=1200" alt="Orbital View" fill className="object-cover opacity-60 rounded-full" />
                       <div className="absolute inset-0 bg-gradient-to-t from-[#02040a] via-transparent to-transparent opacity-80" />
                       {/* Overlay HUD */}
                       <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-[80%] h-[80%] border border-cyan-500/20 rounded-full flex items-center justify-center animate-[spin_20s_linear_infinite]">
                             <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.8)] rounded-full" />
                          </div>
                          <div className="absolute w-[60%] h-[60%] border border-cyan-500/10 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                       </div>
                    </div>
                 </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── MISSIONS TABLE ────────── */}
        <section className="py-32 bg-[#02040a] border-y border-white/5">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="mb-20">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-cyan-500 block mb-4">Mission Manifest</span>
                <h2 className="text-5xl md:text-7xl font-light uppercase tracking-tighter">Scheduled <span className="font-bold">Flights.</span></h2>
              </div>
            </Reveal>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/10 text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">
                    <th className="pb-8">Mission ID</th>
                    <th className="pb-8">Target</th>
                    <th className="pb-8">Payload</th>
                    <th className="pb-8">Type</th>
                    <th className="pb-8 text-right">Launch Date</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-light">
                  {MISSIONS.map((m, i) => (
                    <Reveal key={i} delay={i * 0.1}>
                      <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                        <td className="py-8 font-mono text-cyan-400">{m.id}</td>
                        <td className="py-8">{m.target}</td>
                        <td className="py-8 text-white/60">{m.payload}</td>
                        <td className="py-8">
                           <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] uppercase font-bold tracking-widest">{m.type}</span>
                        </td>
                        <td className="py-8 text-right font-bold text-white group-hover:text-cyan-400 transition-colors">{m.date}</td>
                      </tr>
                    </Reveal>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── FLEET ─────────────────── */}
        <section className="py-32 bg-[#02040a]">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-8">
                <div className="max-w-2xl">
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-cyan-500 block mb-4">The Fleet</span>
                  <h2 className="text-6xl md:text-8xl font-light uppercase tracking-tighter italic leading-none">Space <span className="text-white/20">Infrastructure.</span></h2>
                </div>
                <div className="flex gap-4">
                   <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all cursor-pointer"><ArrowRight className="w-5 h-5 rotate-180" /></div>
                   <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all cursor-pointer"><ArrowRight className="w-5 h-5" /></div>
                </div>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {FLEET.map((f, i) => (
                <Reveal key={i} delay={i * 0.15}>
                  <div className="group cursor-pointer">
                    <div className="relative aspect-[3/4] mb-8 overflow-hidden rounded-sm bg-white/[0.02]">
                      <ParallaxImg src={f.img} alt={f.name} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                      <div className="absolute bottom-8 left-8 right-8">
                         <div className="text-[10px] font-bold uppercase tracking-widest text-cyan-500 mb-2">Operational</div>
                         <h3 className="text-3xl font-bold uppercase tracking-widest text-white">{f.name}</h3>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-white/10 pt-8">
                       <div>
                          <div className="text-[8px] font-bold uppercase text-white/30 mb-1">Payload Capacity</div>
                          <div className="text-lg font-bold italic uppercase">{f.capacity}</div>
                       </div>
                       <div>
                          <div className="text-[8px] font-bold uppercase text-white/30 mb-1">Target Orbit</div>
                          <div className="text-lg font-bold italic uppercase">{f.orbit}</div>
                       </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── TECHNOLOGY ────────────── */}
        <section className="py-32 bg-[#05080f] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none">
             <Satellite className="w-[800px] h-[800px] -translate-y-1/4 translate-x-1/4" />
          </div>
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <div>
                <Reveal>
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-cyan-500 block mb-4">Advancements</span>
                  <h2 className="text-5xl md:text-7xl font-light uppercase tracking-tighter mb-12 leading-tight italic">Propelling <br/>The <span className="font-bold text-white not-italic">Future.</span></h2>
                  <div className="space-y-12">
                    {[
                      { icon: Cpu, t: "Autonomous Navigation", d: "Next-gen flight computers capable of sub-meter orbital docking with zero human intervention." },
                      { icon: Shield, t: "Propulsion Safety", d: "Redundant plasma thrusters ensuring mission safety even in the most extreme cosmic conditions." },
                      { icon: Radio, t: "Deep Space Comm", d: "Laser-based communication array providing gigabit-speed connectivity across the solar system." }
                    ].map((f, i) => (
                      <div key={i} className="flex gap-8 group">
                         <div className="w-16 h-16 shrink-0 border border-cyan-500/20 flex items-center justify-center group-hover:bg-cyan-500 group-hover:border-cyan-500 transition-all duration-700">
                            <f.icon className="w-6 h-6 text-cyan-400 group-hover:text-black transition-colors" />
                         </div>
                         <div>
                            <h4 className="text-xl font-bold uppercase tracking-widest mb-2 italic">{f.t}</h4>
                            <p className="text-white/30 leading-relaxed text-sm max-w-sm font-light">{f.d}</p>
                         </div>
                      </div>
                    ))}
                  </div>
                </Reveal>
              </div>
              <Reveal delay={0.2}>
                 <div className="relative aspect-square border border-white/5 bg-white/[0.01] p-12 overflow-hidden flex items-center justify-center">
                    <div className="relative w-full h-full border border-cyan-500/10 rounded-full flex items-center justify-center">
                       <div className="w-3/4 h-3/4 border border-cyan-500/20 rounded-full animate-[ping_4s_linear_infinite]" />
                       <div className="absolute inset-0 flex items-center justify-center">
                          <Globe className="w-24 h-24 text-cyan-400/20" />
                       </div>
                    </div>
                    {/* Telemetry markers */}
                    <div className="absolute top-12 left-12 text-[8px] font-mono text-cyan-400/40 space-y-1">
                       <p>ALT: 402.4 KM</p>
                       <p>VEL: 7.66 KM/S</p>
                       <p>LAT: 28.5721 N</p>
                       <p>LON: 80.6490 W</p>
                    </div>
                 </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── CTA ───────────────────── */}
        <section id="equipe" className="py-40 bg-cyan-600 text-white text-center relative overflow-hidden">
           <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] bg-repeat" />
           </div>
          <div className="max-w-4xl mx-auto px-6 relative z-10">
            <Reveal>
              <h2 className="text-6xl md:text-[9rem] font-light uppercase tracking-tighter leading-[0.8] mb-12 italic">{c?.aboutTitle ?? fd?.businessName ?? <>
                Reach For <br/> <span className="font-bold not-italic">More.</span>
              </>}</h2>
              <p className="text-xl text-white/80 font-light mb-16 leading-relaxed">{c?.aboutText ?? <>
                Our team is ready to handle your most complex orbital logistics. Join the list of space agencies and private firms reaching for the stars.
              </>}</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                <button className="px-16 py-6 bg-black text-white font-bold uppercase tracking-widest text-[10px] hover:bg-white hover:text-black transition-all duration-700 italic">
                   Initiate Mission Audit
                </button>
                <button className="px-16 py-6 border-2 border-white/40 text-white font-bold uppercase tracking-widest text-[10px] hover:bg-white hover:text-black transition-all duration-700 italic">
                   Download Payload Guide
                </button>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      {/* ── FOOTER ────────────────── */}
      <footer id="contact" className="bg-[#02040a] pt-32 pb-12 px-6 border-t border-white/5">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-5 gap-16 mb-32">
          <div className="md:col-span-2">
            <Link href="#hero" className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                <Rocket className="w-5 h-5 text-cyan-400" />
              </div>
              <span className="text-xl font-light tracking-[0.4em] uppercase text-white">Astrum <span className="text-cyan-500 font-bold">Reach</span></span>
            </Link>
            <p className="text-white/20 max-w-sm leading-relaxed mb-10 text-sm font-light italic">
              Empowering the next century of space travel through sustainable, reliable, and frequent orbital access.
            </p>
            <div className="flex gap-8">
               {["Mission Control", "YouTube", "GitHub", "MessageSquare"].map(s => (
                 <Link key={s} href={ s === "LinkedIn" || s === "Linkedin" ? "https://linkedin.com" : s === "Contact" || s === "contact" ? "#contact" : `#${s.toLowerCase().replace(/\s+/g, "").replace(/[éèê]/g, "e").replace(/[àâ]/g, "a")}` } className="text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-cyan-400 transition-colors">{s}</Link>
               ))}
            </div>
          </div>
          
          {[
            { t: "Missions", l: ["Payload Services", "Launch Schedule", "Orbital Mapping", "Lunar Transit"] },
            { t: "Technology", l: ["Atlas Heavy", "Nebula Capsule", "Laser Comms", "Propulsion"] },
            { t: "Resources", l: ["Payload Guide", "Launch Specs", "Safety Manual", "Contact"] },
          ].map((col, i) => (
            <div key={i} className="space-y-10">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-cyan-500">{col.t}</h4>
              <ul className="space-y-6">
                {col.l.map(link => <li key={link}><Link href="#contact" className="text-xs text-white/40 hover:text-white transition-colors">{link}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="max-w-[1400px] mx-auto pt-12 border-t border-white/5 flex flex-col md:row justify-between items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-white/10">
          <span>© 2026 ASTRUM REACH AEROSPACE. ALL STAGES NOMINAL.</span>
          <div className="flex gap-10">
             <Link href="#contact" className="hover:text-white transition-colors flex items-center gap-2">CAPE CANAVERAL, FL</Link>
             <Link href="#contact" className="hover:text-white transition-colors flex items-center gap-2">STARBASE, TX</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
