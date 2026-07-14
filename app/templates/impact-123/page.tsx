"use client";
// @ts-nocheck
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Car, ArrowRight, Menu, Zap, Gauge, Shield, Settings, Timer, ChevronRight, Activity, MoveRight } from "lucide-react"
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

function ParallaxImg({ src, alt }: { src: string; alt: string }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"])
  return (
    <div ref={ref} className="relative w-full h-full overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-[-20%] w-[140%] h-[140%]">
        <Image src={src} alt={alt} fill className="object-cover" />
      </motion.div>
    </div>
  )
}

const MODELS = [
  { name: "V1 Prototype", year: "2024", topSpeed: "380 km/h", power: "1,200 hp", img: "https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&q=80&w=1200" },
  { name: "Iron Lung S", year: "2023", topSpeed: "420 km/h", power: "1,600 hp", img: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&q=80&w=1200" },
  { name: "Apex Track", year: "2024", topSpeed: "340 km/h", power: "900 hp", img: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&q=80&w=1200" },
]

const SPECS = [
  { label: "0-100 km/h", value: "2.1s" },
  { label: "Lateral G", value: "1.8G" },
  { label: "Weight", value: "1,240kg" },
  { label: "Aero Downforce", value: "800kg" },
]


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function VulcanMotorsPage() {
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
    <div className="bg-[#050505] text-white font-sans min-h-dvh selection:bg-[#ff3b30] selection:text-white overflow-x-hidden">
      
      {/* ── NAVBAR ────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? "bg-black/90 backdrop-blur-xl border-b border-red-600/20 py-4" : "bg-transparent py-8"}`}>
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
                <div className="w-10 h-10 bg-red-600 flex items-center justify-center -skew-x-12 group-hover:scale-110 transition-transform duration-500">
                  <Car className="w-6 h-6 text-black fill-current" />
                </div>
                <span className="text-2xl font-black tracking-tighter uppercase italic">Vulcan<span className="text-red-600">Motors</span></span>
              </>
            )}
          </Link>
          <div className="hidden lg:flex gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
            {["Atelier", "Collection", "Performance", "Reserve"].map(l => (
              <Link key={l} href="#realisations" className="hover:text-red-500 transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <button className="hidden md:block px-6 py-2.5 text-white/40 text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors">Owner Portal</button>
            <button className="px-8 py-3 bg-red-600 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-sm hover:bg-white hover:text-black transition-all duration-500 italic">Configure</button>
            <Sheet>
              <SheetTrigger className="lg:hidden"><Menu className="w-6 h-6 text-white" /></SheetTrigger>
              <SheetContent side="right" className="bg-black border-red-600/20 p-12 text-white">
                <div className="flex flex-col gap-8 mt-16 text-left">
                  {["The Atelier", "Models", "Tech Specs", "Contact"].map(l => (
                    <Link key={l} href="#contact" className="text-3xl font-black uppercase tracking-tighter hover:text-red-600 transition-colors italic">{l}</Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      <main>
        {/* ── HERO ──────────────────── */}
        <section id="hero" className="relative h-dvh flex items-center pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0">
            <Image src="https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&q=80&w=2400" alt="Hypercar Detail" fill className="object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-1000" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent" />
            <div className="absolute inset-0 bg-black/40" />
          </div>

          <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 w-full">
            <Reveal>
              <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-red-600/10 border border-red-600/20 text-red-500 text-[10px] font-bold uppercase tracking-[0.3em] mb-12 italic">
                <Gauge className="w-4 h-4" /> The Pinnacle of Mechanical Intent
              </div>
            </Reveal>
            <Reveal delay={0.1} y={60}>
              <h1 className="text-7xl md:text-[10rem] font-black tracking-tighter leading-[0.8] uppercase italic mb-12">{c?.heroHeadline ?? <>
                Pure<br/>Kinetic<br/><span className="text-red-600">Soul.</span>
              </>}</h1>
            </Reveal>
            <Reveal delay={0.25}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-12 max-w-4xl border-t border-white/10 pt-12">
                {SPECS.map((s, i) => (
                  <div key={i}>
                    <div className="text-[9px] font-bold uppercase tracking-widest text-white/30 mb-2">{s.label}</div>
                    <div className="text-3xl font-black italic">{s.value}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
          
          <div className="absolute bottom-12 right-12 flex flex-col items-end gap-2 text-[10px] font-bold uppercase tracking-[0.4em] text-white/20">
            <span>Mechanical Audits</span>
            <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
               <motion.div animate={{ x: ["-100%", "100%"] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} className="w-full h-full bg-red-600" />
            </div>
          </div>
        </section>

        {/* ── ATELIER ───────────────── */}
        <section id="realisations" className="py-40 bg-[#050505] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-red-600/5 -skew-x-12 translate-x-1/2" />
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <div>
                <Reveal>
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-red-600 block mb-4">Engineering Manifesto</span>
                  <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic mb-12 leading-tight">Hand-Forged <br/>In <span className="text-white/20 italic">The Dark.</span></h2>
                  <div className="space-y-12">
                    {[
                      { icon: Settings, t: "Mechanical Purity", d: "Naturally aspirated power plants without digital intervention. Raw, unfiltered combustion." },
                      { icon: Shield, t: "Aeronautic Materials", d: "Grade 5 titanium chassis and autoclaved carbon composite bodywork for extreme rigidity." },
                      { icon: Timer, t: "Analog Precision", d: "Each component calibrated by hand in our specialized test cells over 600 hours." }
                    ].map((f, i) => (
                      <div key={i} className="flex gap-8 group">
                         <div className="w-16 h-16 shrink-0 bg-white/5 border border-white/10 flex items-center justify-center -skew-x-12 group-hover:bg-red-600 group-hover:border-red-600 transition-all duration-700">
                            <f.icon className="w-6 h-6 text-red-600 group-hover:text-black transition-colors" />
                         </div>
                         <div>
                            <h4 className="text-xl font-bold uppercase italic mb-2 tracking-tight">{f.t}</h4>
                            <p className="text-white/40 leading-relaxed text-sm max-w-sm">{c?.heroSubline ?? fd?.tagline ?? <>{f.d}</>}</p>
                         </div>
                      </div>
                    ))}
                  </div>
                </Reveal>
              </div>
              <Reveal delay={0.2}>
                <div className="aspect-square relative grayscale hover:grayscale-0 transition-all duration-1000 border border-white/5 p-4 bg-white/[0.02]">
                   <ParallaxImg src="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&q=80&w=1200" alt="Engine Detail" />
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[1px] bg-red-600/20 rotate-45 pointer-events-none" />
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── MODELS ────────────────── */}
        <section className="py-40 bg-[#0a0a0a]">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-8">
                <div className="max-w-2xl">
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-red-600 block mb-4">Active Fleet</span>
                  <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-none">The <span className="text-white/20">Lineup.</span></h2>
                </div>
                <button className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest hover:text-red-600 text-white/40 transition-colors group">
                  Private Inventory <MoveRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {MODELS.map((m, i) => (
                <Reveal key={i} delay={i * 0.15}>
                  <div className="group relative aspect-[3/4] overflow-hidden rounded-sm cursor-pointer">
                    <Image src={m.img} alt={m.name} fill className="object-cover opacity-60 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                    <div className="absolute inset-0 p-10 flex flex-col justify-end">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-red-600 mb-2">{m.year} Production</div>
                      <h3 className="text-4xl font-black italic uppercase mb-8">{m.name}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-white/20 pt-8 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0">
                         <div>
                            <div className="text-[8px] font-bold uppercase text-white/40 mb-1">Top Speed</div>
                            <div className="text-xl font-bold italic uppercase">{m.topSpeed}</div>
                         </div>
                         <div>
                            <div className="text-[8px] font-bold uppercase text-white/40 mb-1">Power</div>
                            <div className="text-xl font-bold italic uppercase">{m.power}</div>
                         </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── SPECS TABLE ───────────── */}
        <section id="contact" className="py-40 bg-[#050505] border-t border-red-600/10">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="flex flex-col md:flex-row items-end justify-between mb-20 border-b border-white/5 pb-12 gap-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-red-600 block mb-4">Performance Data</span>
                  <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-none">The <span className="text-white/20">Numbers.</span></h2>
                </div>
                <div className="text-sm text-white/30 font-light italic">Tested at Portimão circuit under FIA-sanctioned conditions. All figures SAE certified.</div>
              </div>
            </Reveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-red-600/10">
              {[...SPECS,
                { label: "Braking 100-0", value: "28m" },
                { label: "Engine", value: "V12 Biturbo" },
                { label: "Gearbox", value: "7-speed PDK" },
                { label: "Active Aero Modes", value: "5" },
              ].map((s, i) => (
                <Reveal key={i} delay={i * 0.06}>
                  <div className="bg-[#050505] p-12 group hover:bg-red-600/5 transition-colors duration-500">
                    <div className="text-3xl md:text-4xl font-black italic text-white mb-3 group-hover:text-red-500 transition-colors">{s.value}</div>
                    <div className="text-[9px] font-bold uppercase tracking-widest text-white/25">{s.label}</div>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.2}>
              <div className="mt-8 p-10 border border-red-600/10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                  <div className="text-[9px] font-bold uppercase tracking-widest text-red-600 mb-2">Production Run</div>
                  <div className="text-2xl font-black italic text-white">24 units per annum. Each hand-assembled.</div>
                </div>
                <div className="flex gap-12">
                  {[{ v: "24", l: "Units/year" }, { v: "1,800hr", l: "Assembly time" }, { v: "8yr", l: "Delivery wait" }].map(k => (
                    <div key={k.l} className="text-center">
                      <div className="text-2xl font-black italic text-red-500">{k.v}</div>
                      <div className="text-[9px] font-bold uppercase tracking-widest text-white/20 mt-1">{k.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── TRACK EXPERIENCE ──────── */}
        <section className="py-40 bg-black border-t border-white/5">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
              <Reveal>
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-red-600 block mb-8">Beyond the Road</span>
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none mb-12">Born On <br /><span className="font-light not-italic text-white/20">Track.</span></h2>
                <div className="space-y-8">
                  {[
                    { icon: Timer, t: "Owner Track Days", d: "Quarterly invitations to Portimão, Spa, and Suzuka. Vulcan engineering crew on-site." },
                    { icon: Gauge, t: "Tailored Calibration", d: "Every car leaves the atelier pre-mapped to the owner's preferred circuit. Updates over-the-air." },
                    { icon: Activity, t: "Telemetry Suite", d: "Real-time data transmitted to the Vulcan server farm. Lap coaching from ex-F1 engineers." },
                  ].map((f, i) => (
                    <div key={i} className="flex gap-8 group">
                      <div className="w-16 h-16 shrink-0 border border-red-600/20 flex items-center justify-center group-hover:bg-red-600 group-hover:border-red-600 transition-all duration-700 -skew-x-6">
                        <f.icon className="w-5 h-5 text-red-600/60 group-hover:text-white transition-colors skew-x-6" />
                      </div>
                      <div>
                        <h4 className="text-xl font-black uppercase italic mb-2">{f.t}</h4>
                        <p className="text-sm text-white/30 leading-relaxed font-light">{f.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
              <Reveal delay={0.2}>
                <div className="relative aspect-square grayscale hover:grayscale-0 transition-all duration-[2000ms]">
                  <ParallaxImg src="https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?auto=format&fit=crop&q=80&w=1200" alt="Track" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-red-600/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-1000" />
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── CTA ───────────────────── */}
        <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-red-600" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30" />
          <div className="relative z-10 text-center px-6">
            <Reveal>
              <h2 className="text-7xl md:text-[12rem] font-black tracking-tighter uppercase italic leading-[0.75] text-black mb-12">
                Command<br/>Gravity.
              </h2>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                <button className="px-16 py-6 bg-black text-white font-black uppercase tracking-[0.2em] text-[10px] hover:px-20 transition-all duration-700 italic">
                  Book A Test Session
                </button>
                <button className="px-16 py-6 border-2 border-black text-black font-black uppercase tracking-[0.2em] text-[10px] hover:bg-black hover:text-white transition-all duration-700 italic">
                  Configure Yours
                </button>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      {/* ── FOOTER ────────────────── */}
      <footer className="bg-black pt-32 pb-12 px-6 border-t border-white/5">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-5 gap-16 mb-32">
          <div className="md:col-span-2">
            <Link href="#hero" className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 bg-red-600 flex items-center justify-center -skew-x-12">
                <Car className="w-6 h-6 text-black fill-current" />
              </div>
              <span className="text-2xl font-black tracking-tighter uppercase italic">Vulcan<span className="text-red-600">Motors</span></span>
            </Link>
            <p className="text-white/20 max-w-sm leading-relaxed mb-10 text-sm italic font-light">{c?.aboutText ?? <>
              Restoring the past, defining the future. Vulcan Motors is an atelier dedicated to the preservation and evolution of the hypercar.
            </>}</p>
            <div className="flex gap-8">
               {["Camera", "YouTube", "LinkedIn", "Registry"].map(s => (
                 <Link key={s} href={ s === "LinkedIn" || s === "Linkedin" ? "https://linkedin.com" : s === "Contact" || s === "contact" ? "#contact" : `#${s.toLowerCase().replace(/\s+/g, "").replace(/[éèê]/g, "e").replace(/[àâ]/g, "a")}` } className="text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-red-600 transition-colors">{s}</Link>
               ))}
            </div>
          </div>
          
          {[
            { t: "The Atelier", l: ["Restoration", "Bespoke Builds", "Engine Lab", "Carbon Cell"] },
            { t: "Inventory", l: ["V1 Prototype", "Iron Lung S", "Apex Track", "Archive"] },
            { t: "Owners", l: ["Concierge", "Documentation", "Global Track Days", "Contact"] },
          ].map((col, i) => (
            <div key={i} className="space-y-10">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-red-600">{col.t}</h4>
              <ul className="space-y-6">
                {col.l.map(link => <li key={link}><Link href="#contact" className="text-xs text-white/40 hover:text-white transition-colors">{link}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="max-w-[1400px] mx-auto pt-12 border-t border-white/5 flex flex-col md:row justify-between items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-white/10">
          <span>© 2026 VULCAN MOTORS ATELIER. REDLINE ADDICTED.</span>
          <div className="flex gap-10">
             <Link href="#contact" className="hover:text-white transition-colors flex items-center gap-2">MODENA, IT</Link>
             <Link href="#contact" className="hover:text-white transition-colors flex items-center gap-2">SILVERSTONE, UK</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
