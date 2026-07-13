"use client";
// @ts-nocheck
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Truck, ArrowRight, Menu, Zap, Globe, Shield, BarChart3, Clock, Package, MapPin, Gauge, MoveRight } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

function Reveal({ children, delay = 0, y = 40 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }} animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  )
}

const FLEET = [
  { name: "V1 Courier", range: "350km", payload: "1.5 Tons", type: "Electric Van", img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1200" },
  { name: "V2 Hauler", range: "800km", payload: "18 Tons", type: "Semi-Truck", img: "https://images.unsplash.com/photo-1591768793355-74d7c1d1055e?auto=format&fit=crop&q=80&w=1200" },
  { name: "V-Drone X", range: "40km", payload: "25kg", type: "Autonomous Drone", img: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=1200" },
]

const FEATURES = [
  { icon: Gauge, title: "Hyper-Efficiency", desc: "AI-optimized routing that reduces energy consumption by 24% per mile." },
  { icon: Shield, title: "Proof of Transit", desc: "Blockchain-verified delivery milestones with real-time biometric scanning." },
  { icon: Globe, title: "Zero Emission", desc: "100% renewable energy fleet with carbon-neutral operation guaranteed." },
]


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function VoltLogisticsPage() {
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
    <div className="bg-[#0a0a0a] text-white font-sans min-h-screen selection:bg-[#ffb400] selection:text-black overflow-x-hidden">
      
      {/* ── NAVBAR ────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/5 py-4" : "bg-transparent py-8"}`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="#hero" className="flex items-center gap-3">
            {fd?.logoBase64 ? (
              <img
                src={fd.logoBase64}
                alt={fd?.businessName ?? 'logo'}
                style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
              />
            ) : (
              <>
                <div className="w-10 h-10 bg-[#ffb400] flex items-center justify-center -skew-x-12">
                  <Zap className="w-6 h-6 text-black fill-black" />
                </div>
                <span className="text-2xl font-black tracking-tighter uppercase italic">Volt<span className="text-[#ffb400]">Logistics</span></span>
              </>
            )}
          </Link>
          <div className="hidden lg:flex gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
            {["Fleet", "Network", "Technology", "Company"].map(l => (
              <Link key={l} href={l === "Fleet" ? "#fleet" : l === "Technology" ? "#technology" : l === "Company" ? "#contact" : "#hero"} className="hover:text-[#ffb400] transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <button className="hidden md:block px-6 py-2.5 text-white/60 text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors">Client Portal</button>
            <button className="px-8 py-3 bg-white text-black text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#ffb400] transition-all duration-500">Track Cargo</button>
            <Sheet>
              <SheetTrigger className="lg:hidden"><Menu className="w-6 h-6 text-white" /></SheetTrigger>
              <SheetContent side="right" className="bg-[#0a0a0a] border-white/5 p-12">
                <div className="flex flex-col gap-8 mt-16 text-left">
                  {["Our Fleet", "Global Network", "Tech Stack", "Pricing"].map(l => (
                    <Link key={l} href={l === "Our Fleet" ? "#fleet" : l === "Tech Stack" ? "#technology" : l === "Pricing" ? "#contact" : "#hero"} className="text-3xl font-black uppercase tracking-tighter hover:text-[#ffb400] transition-colors italic">{l}</Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      <main>
        {/* ── HERO ──────────────────── */}
        <section id="hero" className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden">
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-20" 
               style={{ backgroundImage: `linear-gradient(#ffb4001a 1px, transparent 1px), linear-gradient(90deg, #ffb4001a 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />
          
          <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <div>
                <Reveal>
                  <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-[#ffb400]/10 border border-[#ffb400]/20 text-[#ffb400] text-[10px] font-bold uppercase tracking-[0.3em] mb-8">
                    <span className="w-2 h-2 rounded-full bg-[#ffb400] animate-pulse" /> Decarbonizing Global Supply Chains
                  </div>
                </Reveal>
                <Reveal delay={0.1}>
                  <h1 className="text-7xl md:text-[9rem] font-black tracking-tighter leading-[0.8] uppercase italic mb-10">{c?.heroHeadline ?? <>
                    The Speed<br/>Of <span className="text-[#ffb400]">Light.</span>
                  </>}</h1>
                </Reveal>
                <Reveal delay={0.25}>
                  <p className="text-xl text-white/40 font-light max-w-lg leading-relaxed mb-12">{c?.heroSubline ?? fd?.tagline ?? <>
                    Autonomous, all-electric, and AI-driven logistics. We don't just deliver packages; we engineer time and efficiency.
                  </>}</p>
                </Reveal>
                <Reveal delay={0.35}>
                  <div className="flex flex-col sm:flex-row gap-6">
                    <button className="px-10 py-5 bg-[#ffb400] text-black font-black uppercase tracking-widest text-xs hover:bg-white transition-all duration-500 shadow-[0_0_30px_rgba(255,180,0,0.2)]">
                      Start Shipping
                    </button>
                    <button className="px-10 py-5 border border-white/10 text-white font-bold uppercase tracking-widest text-xs hover:bg-white/5 transition-all">
                      Watch Logistics Flow
                    </button>
                  </div>
                </Reveal>
              </div>
              
              <Reveal delay={0.5} y={0}>
                <div className="relative">
                  <div className="absolute -inset-10 bg-[#ffb400]/10 blur-[100px] rounded-full" />
                  <div className="relative bg-white/5 border border-white/10 p-1 rounded-2xl overflow-hidden backdrop-blur-sm">
                    <div className="aspect-[4/3] relative">
                      <Image src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1200" alt="E-Mobility" fill className="object-cover opacity-70 group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
                      <div className="absolute bottom-8 left-8 right-8">
                        <div className="flex justify-between items-end">
                          <div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-[#ffb400] mb-1">Vehicle Status</div>
                            <div className="text-2xl font-black italic uppercase">In-Transit: NYC_442</div>
                          </div>
                          <div className="text-right">
                             <div className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-1">Battery</div>
                             <div className="text-2xl font-black text-green-400">88%</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── STATS GRID ────────────── */}
        <section className="py-32 bg-[#0d0d0d] border-y border-white/5">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              {[
                { v: "25M+", l: "Miles Logged", i: Truck },
                { v: "140", l: "Autonomous Hubs", i: Globe },
                { v: "0.0g", l: "CO2 Emissions", i: Zap },
                { v: "24/7", l: "Active Monitoring", i: Gauge },
              ].map((s, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="flex flex-col gap-4 border-l border-white/10 pl-8">
                    <s.i className="w-6 h-6 text-[#ffb400]" />
                    <div className="text-5xl font-black italic tracking-tighter uppercase">{s.v}</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-white/30">{s.l}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── FLEET SHOWCASE ────────── */}
        <section id="fleet" className="py-32 bg-[#0a0a0a]">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-8">
                <div className="max-w-2xl">
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#ffb400] block mb-4">The Fleet</span>
                  <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic">Future <span className="text-white/20">Mobility.</span></h2>
                </div>
                <button className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest hover:text-[#ffb400] transition-colors group">
                  View Specifications <MoveRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {FLEET.map((f, i) => (
                <Reveal key={i} delay={i * 0.15}>
                  <div className="group relative aspect-[3/4] overflow-hidden rounded-2xl">
                    <Image src={f.img} alt={f.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
                    <div className="absolute inset-0 p-10 flex flex-col justify-end">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-[#ffb400] mb-2">{f.type}</div>
                      <h3 className="text-4xl font-black italic uppercase mb-6">{f.name}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/20 pt-6">
                         <div>
                            <div className="text-[8px] font-bold uppercase text-white/40 mb-1">Range</div>
                            <div className="text-lg font-bold italic uppercase">{f.range}</div>
                         </div>
                         <div>
                            <div className="text-[8px] font-bold uppercase text-white/40 mb-1">Payload</div>
                            <div className="text-lg font-bold italic uppercase">{f.payload}</div>
                         </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── TECHNOLOGY ────────────── */}
        <section id="technology" className="py-32 bg-[#0d0d0d]">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <div>
                <Reveal>
                  <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic mb-12 leading-tight">
                    Powered By<br/>The <span className="text-[#ffb400]">Volt Hub.</span>
                  </h2>
                  <div className="space-y-12">
                    {FEATURES.map((f, i) => (
                      <div key={i} className="flex gap-8 group">
                        <div className="w-16 h-16 shrink-0 bg-white/5 flex items-center justify-center -skew-x-12 border border-white/10 group-hover:bg-[#ffb400] group-hover:border-[#ffb400] transition-all duration-500">
                          <f.icon className="w-6 h-6 text-[#ffb400] group-hover:text-black transition-colors" />
                        </div>
                        <div>
                          <h4 className="text-xl font-bold uppercase italic mb-2 tracking-tight">{f.title}</h4>
                          <p className="text-white/40 leading-relaxed text-sm max-w-sm">{f.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Reveal>
              </div>
              <Reveal delay={0.2}>
                 <div className="relative aspect-square bg-white/[0.02] border border-white/5 rounded-3xl p-12 overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] opacity-10">
                       <div className="w-full h-full border border-[#ffb400]/20 rounded-full animate-ping" style={{ animationDuration: '4s' }} />
                       <div className="absolute inset-0 border border-[#ffb400]/10 rounded-full animate-pulse" />
                    </div>
                    <div className="relative h-full flex flex-col justify-between font-mono">
                       <div className="flex justify-between items-start">
                          <div className="text-[10px] text-white/20 uppercase tracking-widest">System Monitor v8.4</div>
                          <div className="text-[10px] text-green-400 uppercase tracking-widest">Live</div>
                       </div>
                       <div className="space-y-4">
                          {[
                            { l: "CPU LOAD", v: "24%", c: "text-white" },
                            { l: "NETWORK THRUPUT", v: "8.4 GB/S", c: "text-white" },
                            { l: "ENCRYPTION", v: "AES-256-GCM", c: "text-[#ffb400]" },
                          ].map((item, idx) => (
                            <div key={idx} className="flex justify-between border-b border-white/5 pb-2">
                               <span className="text-[10px] text-white/30">{item.l}</span>
                               <span className={`text-[10px] font-bold ${item.c}`}>{item.v}</span>
                            </div>
                          ))}
                       </div>
                       <div className="h-32 bg-white/5 rounded-xl border border-white/5 flex items-end gap-1 p-4">
                          {Array.from({ length: 24 }).map((_, i) => (
                            <motion.div key={i} className="flex-1 bg-[#ffb400]/40" 
                              animate={{ height: `${20 + Math.random() * 80}%` }}
                              transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }} />
                          ))}
                       </div>
                    </div>
                 </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── CTA ───────────────────── */}
        <section id="contact" className="py-32 bg-[#ffb400]">
          <div className="max-w-[1000px] mx-auto px-6 text-center">
            <Reveal>
              <h2 className="text-6xl md:text-[8rem] font-black tracking-tighter uppercase italic leading-[0.8] text-black mb-12">
                Shift Your<br/>Strategy.
              </h2>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <button className="px-14 py-6 bg-black text-white font-black uppercase tracking-[0.2em] text-sm hover:px-16 transition-all duration-700">
                   Contact Enterprise
                </button>
                <button className="px-14 py-6 border-2 border-black text-black font-black uppercase tracking-[0.2em] text-sm hover:bg-black hover:text-white transition-all duration-700">
                   See Pricing
                </button>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      {/* ── FOOTER ────────────────── */}
      <footer className="bg-black pt-24 pb-12 px-6">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-5 gap-16 mb-24">
          <div className="md:col-span-2">
            <Link href="#hero" className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 bg-[#ffb400] flex items-center justify-center -skew-x-12">
                <Zap className="w-5 h-5 text-black fill-black" />
              </div>
              <span className="text-2xl font-black tracking-tighter uppercase italic">Volt<span className="text-[#ffb400]">Logistics</span></span>
            </Link>
            <p className="text-white/30 max-w-sm leading-relaxed mb-10 text-sm">{c?.aboutText ?? <>
              Engineering the next generation of autonomous, zero-emission logistics for a world that never stops moving.
            </>}</p>
            <div className="flex gap-6">
               {["LinkedIn", "X", "Vimeo", "GitHub"].map(s => (
                 <Link key={s} href={ s === "LinkedIn" || s === "Linkedin" ? "https://linkedin.com" : s === "Contact" || s === "contact" ? "#contact" : `#${s.toLowerCase().replace(/\s+/g, "").replace(/[éèê]/g, "e").replace(/[àâ]/g, "a")}` } className="text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-[#ffb400] transition-colors">{s}</Link>
               ))}
            </div>
          </div>
          
          {[
            { t: "Solutions", l: ["Last Mile", "Freight", "Autonomous", "Sustainability"] },
            { t: "Platform", l: ["Volt Hub", "Developer API", "Network Map", "Status"] },
            { t: "Legal", l: ["Privacy", "Terms", "SLA", "Compliance"] },
          ].map((col, i) => (
            <div key={i} className="space-y-8">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#ffb400]">{col.t}</h4>
              <ul className="space-y-6">
                {col.l.map(link => <li key={link}><Link href="#hero" className="text-sm text-white/40 hover:text-[#ffb400] transition-colors">{link}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="max-w-[1400px] mx-auto pt-12 border-t border-white/5 flex flex-col md:row justify-between items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-white/20">
          <span>© 2026 VOLT LOGISTICS GLOBAL. ALL SYSTEMS ACTIVE.</span>
          <div className="flex gap-10">
             <Link href="#contact" className="hover:text-white transition-colors flex items-center gap-2"><MapPin className="w-3 h-3" /> NYC HQ</Link>
             <Link href="#contact" className="hover:text-white transition-colors flex items-center gap-2"><Globe className="w-3 h-3" /> GLOBAL NETWORK</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function Lock({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
  )
}
