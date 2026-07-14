"use client";
// @ts-nocheck
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Utensils, ArrowRight, Menu, Star, Clock, MapPin, Shield, Heart, Compass, ChevronRight, Play } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

function Reveal({ children, delay = 0, y = 30 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }} animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.5, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  )
}

function ParallaxImg({ src, alt }: { src: string; alt: string }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"])
  return (
    <div ref={ref} className="relative w-full h-full overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-[-15%] w-[130%] h-[130%]">
        <Image src={src} alt={alt} fill className="object-cover" />
      </motion.div>
    </div>
  )
}


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function KuroOmakasePage() {
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
    <div className="bg-[#050505] text-[#d1d1d1] font-sans min-h-dvh selection:bg-white selection:text-black overflow-x-hidden">
      
      {/* ── NAVBAR ────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-1000 ${scrolled ? "bg-black/95 backdrop-blur-xl border-b border-white/5 py-4" : "bg-transparent py-8"}`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="#hero" className="flex items-center gap-4 group">
            {fd?.logoBase64 ? (
              <img
                src={fd.logoBase64}
                alt={fd?.businessName ?? 'logo'}
                style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
              />
            ) : (
              <>
            <div className="w-8 h-8 bg-white flex items-center justify-center group-hover:rotate-90 transition-transform duration-700">
              <span className="text-black font-black text-sm uppercase">K</span>
            </div>
            <span className="text-xl font-light tracking-[0.4em] uppercase text-white italic">Kuro <span className="font-bold not-italic">Omakase</span></span>
          </>
            )}</Link>
          <div className="hidden lg:flex gap-12 text-[10px] font-bold uppercase tracking-[0.5em] text-white/30">
            {["The Ritual", "The Origin", "Reservations", "Legacy"].map(l => (
              <Link key={l} href="#contact" className="hover:text-white transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-8">
            <button className="hidden md:block text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors underline underline-offset-8 decoration-white/10 hover:decoration-white transition-all">Select Seat</button>
            <Sheet>
              <SheetTrigger className="lg:hidden p-2"><Menu className="w-6 h-6 text-white" /></SheetTrigger>
              <SheetContent side="right" className="bg-black border-white/5 p-12 text-white">
                <div className="flex flex-col gap-10 mt-16 text-left">
                  {["Experience", "Menu", "Journal", "Book"].map(l => (
                    <Link key={l} href="#contact" className="text-4xl font-light uppercase tracking-widest hover:italic transition-all">{l}</Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      <main>
        {/* ── HERO ──────────────────── */}
        <section id="hero" className="relative h-dvh flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
             <Image src="https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=2400" alt="Chef Hands" fill className="object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-[2000ms] scale-105" priority />
             <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
             <div className="absolute inset-0 bg-black/40" />
          </div>

          <div className="relative z-10 max-w-[1200px] mx-auto px-6 text-center">
            <Reveal>
              <div className="flex items-center justify-center gap-6 mb-12 opacity-40">
                 <div className="w-12 h-[1px] bg-white" />
                 <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-white">Tokyo — Ginza</span>
                 <div className="w-12 h-[1px] bg-white" />
              </div>
            </Reveal>
            <Reveal delay={0.2} y={70}>
              <motion.h1 className="text-8xl md:text-[12rem] font-black tracking-tighter leading-[0.8] text-white mb-12 uppercase italic">{c?.heroHeadline ?? <>
                Silent <br/> <span className="font-light not-italic">Craft.</span>
              </>}</motion.h1>
            </Reveal>
            <Reveal delay={0.4}>
              <div className="flex flex-col items-center justify-center gap-12">
                <p className="text-xl text-white/40 font-light max-w-xl leading-relaxed italic">{c?.heroSubline ?? fd?.tagline ?? <>
                  An intimate 8-seat sanctuary dedicated to the seasonal purity of Edomae-style sushi. Leave the decision to the Chef.
                </>}</p>
                <div className="flex flex-wrap justify-center gap-10">
                  <button className="px-16 py-6 bg-white text-black font-black uppercase tracking-widest text-[10px] hover:bg-transparent hover:text-white border border-white transition-all duration-700 italic">
                    Request Reservation
                  </button>
                  <button className="px-16 py-6 border border-white/20 text-white font-bold uppercase tracking-widest text-[10px] hover:bg-white/5 transition-all flex items-center gap-4">
                    <Play className="w-3 h-3 fill-current" /> Witness the Ritual
                  </button>
                </div>
              </div>
            </Reveal>
          </div>
          
          <div className="absolute bottom-12 left-12 flex flex-col gap-2">
             <div className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/20">Seating I: 18:00</div>
             <div className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/20">Seating II: 21:00</div>
          </div>
        </section>

        {/* ── THE RITUAL ────────────── */}
        <section className="py-60 bg-[#050505] relative overflow-hidden">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
                <Reveal>
                   <div className="relative aspect-[4/5] p-2 bg-white/[0.02] border border-white/5 overflow-hidden">
                      <ParallaxImg src="https://images.unsplash.com/photo-1591814468924-caf88d1232e1?auto=format&fit=crop&q=80&w=1200" alt="Sushi Close-up" />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all duration-1000" />
                   </div>
                </Reveal>
                <div>
                   <Reveal>
                      <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/30 block mb-12">The Philosophy</span>
                      <h2 className="text-6xl md:text-8xl font-light uppercase tracking-tighter text-white leading-none mb-16 italic">{c?.aboutTitle ?? fd?.businessName ?? <>Elegance <br/> <span className="not-italic font-bold opacity-30">In Zero.</span></>}</h2>
                      <p className="text-2xl font-light text-white/60 leading-relaxed mb-20 italic">{c?.aboutText ?? <>
                         "To find the soul of the fish, we must remove everything that is not the fish." <br/><br/>
                         Kuro Omakase follows the strict principle of Ma (間) — the space between, the silence, the void that allows the flavor to truly exist.
                      </>}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                         {[
                           { t: "EDOMAE TRADITION", d: "Using century-old curing techniques to elevate harmonic profiles." },
                           { t: "LOCAL CULTIVATION", d: "Vinegar and rice sourced from a singular family farm in Akita." }
                         ].map((item, i) => (
                           <div key={i} className="group">
                              <h4 className="text-xs font-black uppercase tracking-widest mb-4 italic text-white/40">{item.t}</h4>
                              <p className="text-sm font-light leading-relaxed text-white/20">{item.d}</p>
                           </div>
                         ))}
                      </div>
                   </Reveal>
                </div>
             </div>
          </div>
        </section>

        {/* ── INGREDIENTS ───────────── */}
        <section id="contact" className="py-60 bg-black">
           <div className="max-w-[1400px] mx-auto px-6 md:px-12">
              <Reveal>
                 <div className="flex flex-col md:flex-row items-end justify-between mb-32 gap-8 border-b border-white/5 pb-16">
                    <div className="max-w-2xl">
                       <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/30 block mb-6">Seasonal Sourcing</span>
                       <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter text-white leading-none italic">The <span className="font-light not-italic opacity-30 text-white">Capture.</span></h2>
                    </div>
                    <div className="flex gap-4">
                       <button className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all"><ArrowRight className="w-5 h-5 rotate-180" /></button>
                       <button className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all"><ArrowRight className="w-5 h-5" /></button>
                    </div>
                 </div>
              </Reveal>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                 {[
                   { t: "Bluefin Otoro", s: "Oma Coast", d: "Triple-marbled belly cut, cured for 48 hours in house-made shoyu.", img: "https://images.unsplash.com/photo-1591814468924-caf88d1232e1?auto=format&fit=crop&q=80&w=1200" },
                   { t: "Hokkaido Uni", s: "Uchiura Bay", d: "Pure, oceanic creaminess harvested daily and served at body temperature.", img: "https://images.unsplash.com/photo-1625944525533-473f1a3d54e7?auto=format&fit=crop&q=80&w=1200" },
                   { t: "Rare Abalone", s: "Mie Prefecture", d: "Slow-steamed for 6 hours in sake and kelp dashi for optimal texture.", img: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=1200" }
                 ].map((item, i) => (
                   <Reveal key={i} delay={i * 0.15}>
                      <div className="group cursor-pointer">
                         <div className="aspect-[3/4] relative mb-10 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-1000">
                            <Image src={item.img} alt={item.t} fill className="object-cover group-hover:scale-110 transition-all duration-[3000ms]" />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-all duration-1000" />
                            <div className="absolute bottom-8 left-8">
                               <div className="text-[10px] font-bold uppercase tracking-widest text-white/60 mb-2 italic">{item.s}</div>
                               <h3 className="text-3xl font-bold uppercase tracking-widest text-white">{item.t}</h3>
                            </div>
                         </div>
                         <p className="text-sm font-light text-white/30 leading-relaxed italic">{item.d}</p>
                      </div>
                   </Reveal>
                 ))}
              </div>
           </div>
        </section>

        {/* ── CHEF PHILOSOPHY ────────── */}
        <section className="py-60 bg-[#050505] border-t border-white/5">
           <div className="max-w-[1400px] mx-auto px-6 md:px-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-40 items-center">
                 <Reveal>
                    <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/30 block mb-8">The Artisan</span>
                    <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter text-white leading-none italic mb-16">Chef<br /><span className="font-light not-italic opacity-30">Hiroshi.</span></h2>
                    <div className="space-y-8">
                       <p className="text-base text-white/40 leading-relaxed font-light italic">
                          Trained under three Michelin-starred masters in Osaka, Kyoto, and Noma Copenhagen, Hiroshi Mori returns to his roots with Kuro — a singular meditation on Japanese restraint at the edge of flavour.
                       </p>
                       <p className="text-base text-white/40 leading-relaxed font-light italic">
                          Every element of the menu changes with the lunar calendar. What you taste tonight has never been served before, and will never be served again.
                       </p>
                    </div>
                    <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-px bg-white/5">
                       {[{ v: "21yr", l: "Training" }, { v: "3★", l: "Michelin" }, { v: "12", l: "Seasons" }].map(s => (
                          <div key={s.l} className="bg-[#050505] p-8 text-center">
                             <div className="text-3xl font-black text-white italic">{s.v}</div>
                             <div className="text-[9px] font-bold uppercase tracking-widest text-white/25 mt-2">{s.l}</div>
                          </div>
                       ))}
                    </div>
                 </Reveal>
                 <Reveal delay={0.2}>
                    <div className="aspect-[3/4] relative overflow-hidden grayscale hover:grayscale-0 transition-all duration-[2000ms]">
                       <Image src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=1200" alt="Chef" fill className="object-cover" />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                 </Reveal>
              </div>
           </div>
        </section>

        {/* ── THE MENU ────────────────── */}
        <section className="py-60 bg-black border-t border-white/5">
           <div className="max-w-[1400px] mx-auto px-6 md:px-12">
              <Reveal>
                 <div className="flex flex-col md:flex-row items-end justify-between mb-32 border-b border-white/5 pb-16 gap-8">
                    <div>
                       <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/30 block mb-6">The Experience</span>
                       <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter text-white leading-none italic">The <span className="font-light not-italic opacity-30">Menu.</span></h2>
                    </div>
                    <div className="text-sm text-white/30 font-light italic max-w-xs leading-relaxed">Courses change nightly. Wine pairings available with two weeks&apos; notice.</div>
                 </div>
              </Reveal>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 {[
                    { tier: "Kuro Omakase", courses: "12 courses", price: "¥88,000", note: "Chef&apos;s full progression. 3.5 hours. Seasonal kaiseki opening.", incl: ["House sake pairing", "Tea ceremony close", "Signed menu card"] },
                    { tier: "Umi Course", courses: "8 courses", price: "¥52,000", note: "Ocean-focused tasting, emphasising sashimi and shellfish.", incl: ["Wine pairing available", "À la carte additions", "Private dining option"] },
                    { tier: "Tsuki Dinner", courses: "5 courses", price: "¥32,000", note: "An introduction to the Kuro kitchen. Ideal for first visits.", incl: ["Non-alcoholic pairing", "Allergen-conscious menu", "Counter seating"] },
                 ].map((m, i) => (
                    <Reveal key={i} delay={i * 0.1}>
                       <div className="border border-white/5 p-12 flex flex-col gap-6 hover:border-white/15 transition-colors duration-700">
                          <div className="text-[9px] font-bold uppercase tracking-widest text-white/30">{m.courses}</div>
                          <h3 className="text-2xl font-bold uppercase tracking-widest text-white italic">{m.tier}</h3>
                          <div className="text-4xl font-light text-white/60">{m.price}</div>
                          <p className="text-sm text-white/30 font-light leading-relaxed italic flex-1">{m.note}</p>
                          <ul className="space-y-2 border-t border-white/5 pt-6">
                             {m.incl.map(f => <li key={f} className="text-xs text-white/25 flex items-center gap-3"><span className="w-1 h-1 rounded-full bg-white/20 shrink-0" />{f}</li>)}
                          </ul>
                       </div>
                    </Reveal>
                 ))}
              </div>
           </div>
        </section>

        {/* ── CTA ───────────────────── */}
        <section className="py-60 bg-[#050505] text-center px-6 border-t border-white/5">
           <div className="max-w-4xl mx-auto">
              <Reveal>
                 <div className="w-16 h-16 bg-white mx-auto mb-20 flex items-center justify-center font-black text-black text-2xl uppercase">K</div>
                 <h2 className="text-7xl md:text-[12vw] font-black uppercase tracking-tighter leading-[0.8] mb-16 italic">
                    TRUST THE <br/> <span className="font-light not-italic opacity-30 text-white">HAND.</span>
                 </h2>
                 <p className="text-xl text-white/40 font-light mb-20 leading-relaxed italic max-w-2xl mx-auto">
                    Reservations are released on the first of every month for the following 30 days. We look forward to your visit.
                 </p>
                 <div className="flex flex-col sm:flex-row items-center justify-center gap-12">
                    <button className="px-16 py-8 bg-white text-black font-black uppercase text-[10px] tracking-[0.3em] hover:bg-transparent hover:text-white border border-white transition-all duration-700 italic shadow-[0_0_40px_rgba(255,255,255,0.1)]">
                       Secure A Seat
                    </button>
                    <button className="px-16 py-8 border border-white/10 text-white/40 font-bold uppercase text-[10px] tracking-[0.3em] hover:text-white transition-all italic">
                       Private Events
                    </button>
                 </div>
              </Reveal>
           </div>
        </section>
      </main>

      {/* ── FOOTER ────────────────── */}
      <footer className="bg-black pt-32 pb-12 px-6 border-t border-white/5">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-5 gap-20 mb-40">
           <div className="md:col-span-2">
              <Link href="#hero" className="flex items-center gap-4 mb-10 group">
                <div className="w-8 h-8 bg-white flex items-center justify-center">
                  <span className="text-black font-black text-sm uppercase">K</span>
                </div>
                <span className="text-xl font-light tracking-[0.4em] uppercase text-white">Kuro Omakase</span>
              </Link>
              <p className="text-white/20 max-w-sm leading-relaxed mb-12 text-sm font-light italic">
                 "In the silence of the room, the only story told is that of the season." Ginza, Tokyo.
              </p>
              <div className="flex gap-10">
                 {["Camera", "Journal", "Technical Paper", "Contact"].map(s => (
                   <Link key={s} href="#contact" className="text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-white transition-colors italic">{s}</Link>
                 ))}
              </div>
           </div>
           
           {[
             { t: "THE ATELIER", l: ["The Chef", "The Ritual", "The Sourcing", "Tsukiji Hub"] },
             { t: "SERVICE", l: ["Evening Session", "Private Event", "Gifting", "Journal"] },
             { t: "LEGAL", l: ["Cancellation", "Privacy", "Allergies", "Terms"] }
           ].map((col, i) => (
             <div key={i} className="space-y-12">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.6em] text-white/30">{col.t}</h4>
                <ul className="space-y-6">
                   {col.l.map(link => (
                     <li key={link} className="text-xs font-bold uppercase tracking-widest text-white/20 hover:text-white transition-colors italic">
                        <Link href="#contact">{link}</Link>
                     </li>
                   ))}
                </ul>
             </div>
           ))}
        </div>
        <div className="max-w-[1400px] mx-auto flex flex-col md:row justify-between items-center gap-8 border-t border-white/5 pt-12 text-[10px] font-bold uppercase tracking-[0.4em] text-white/10 italic">
           <span>© 2026 KURO OMAKASE GROUP. SILENCE IS FLAVOR.</span>
           <div className="flex gap-12">
              <Link href="#contact" className="hover:text-white transition-all">KYOTO</Link>
              <Link href="#contact" className="hover:text-white transition-all">TOKYO</Link>
              <Link href="#contact" className="hover:text-white transition-all">NEW YORK</Link>
           </div>
        </div>
      </footer>
    </div>
  )
}
