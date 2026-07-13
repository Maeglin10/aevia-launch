"use client";
// @ts-nocheck
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Wind, ArrowRight, Menu, Star, Heart, Sun, Waves, Flower2, Moon, ChevronRight, Play, Sparkles } from "lucide-react"
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

function BreathingCircle() {
  return (
    <motion.div 
      animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      className="w-[600px] h-[600px] bg-blue-100/30 rounded-full blur-[100px]"
    />
  )
}


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function AetherWellnessPage() {
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
    <div className="bg-[#faf9f6] text-[#3d3d3d] font-sans min-h-screen selection:bg-[#e5e7eb] selection:text-[#1a1a1a] overflow-x-hidden">
      
      {/* ── NAVBAR ────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-1000 ${scrolled ? "bg-white/80 backdrop-blur-xl border-b border-black/5 py-4" : "bg-transparent py-10"}`}>
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
            <div className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
              <Wind className="w-5 h-5 text-[#3d3d3d]/60" />
            </div>
            <span className="text-xl font-light tracking-[0.3em] uppercase">Aether <span className="font-bold">Wellness</span></span>
          </>
            )}</Link>
          <div className="hidden lg:flex gap-12 text-[10px] font-bold uppercase tracking-[0.4em] text-black/30">
            {["Sanctuary", "Retreats", "Essence", "Journal"].map(l => (
              <Link key={l} href="#hero" className="hover:text-black transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-8">
            <button className="hidden md:block text-[10px] font-bold uppercase tracking-widest text-black/40 hover:text-black transition-colors">Member Portal</button>
            <button className="px-8 py-3 bg-[#1a1a1a] text-white text-[10px] font-bold uppercase tracking-[0.3em] rounded-full hover:bg-transparent hover:text-black border border-transparent hover:border-black/20 transition-all duration-700">Inquire</button>
            <Sheet>
              <SheetTrigger className="lg:hidden p-2"><Menu className="w-6 h-6 text-black" /></SheetTrigger>
              <SheetContent side="right" className="bg-[#faf9f6] border-none p-12 text-black">
                <div className="flex flex-col gap-10 mt-16 text-left">
                  {["Sanctuary", "Experience", "Philosophy", "Book"].map(l => (
                    <Link key={l} href="#hero" className="text-4xl font-light uppercase tracking-widest hover:italic transition-all">{l}</Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      <main>
        {/* ── HERO ──────────────────── */}
        <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
             <BreathingCircle />
          </div>

          <div className="relative z-10 max-w-[1200px] mx-auto px-6 text-center">
            <Reveal>
              <div className="flex items-center justify-center gap-6 mb-12 opacity-30">
                 <div className="w-12 h-[1px] bg-black" />
                 <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-black">Find Your Center</span>
                 <div className="w-12 h-[1px] bg-black" />
              </div>
            </Reveal>
            <Reveal delay={0.2} y={70}>
              <h1 className="text-7xl md:text-[10rem] font-light tracking-tighter leading-[0.85] text-[#1a1a1a] mb-12 uppercase" style={{ fontFamily: "serif" }}>{c?.heroHeadline ?? <>
                Pure <br/> <span className="italic">Presence.</span>
              </>}</h1>
            </Reveal>
            <Reveal delay={0.4}>
              <div className="flex flex-col items-center justify-center gap-12">
                <p className="text-xl text-black/40 font-light max-w-xl leading-relaxed italic">{c?.heroSubline ?? fd?.tagline ?? <>
                  A high-fidelity sanctuary for spiritual and physical restoration. Reconnect with the rhythm of the self through artisanal wellness.
                </>}</p>
                <div className="flex flex-wrap justify-center gap-10">
                  <button className="px-16 py-6 bg-[#1a1a1a] text-white font-bold uppercase tracking-widest text-[10px] rounded-full hover:px-20 transition-all duration-700">
                    Discover The Sanctuary
                  </button>
                  <button className="px-16 py-6 border border-black/10 text-black/60 font-bold uppercase tracking-widest text-[10px] hover:bg-black/5 transition-all flex items-center gap-4 rounded-full">
                    <Play className="w-3 h-3 fill-current" /> The Experience
                  </button>
                </div>
              </div>
            </Reveal>
          </div>
          
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
             <div className="text-[9px] font-bold uppercase tracking-[0.4em] text-black/20">The First Breath</div>
             <div className="w-[1px] h-12 bg-gradient-to-b from-black/20 to-transparent" />
          </div>
        </section>

        {/* ── PILLARS ───────────────── */}
        <section className="py-40 bg-white border-y border-black/5">
           <div className="max-w-[1400px] mx-auto px-6 md:px-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-24">
                 {[
                   { icon: Waves, t: "Sonic Restoration", d: "Immersion in low-frequency soundscapes designed to align neural pathways." },
                   { icon: Sun, t: "Solar Vitality", d: "Full-spectrum light therapy integrated into private sanctuary chambers." },
                   { icon: Moon, t: "Essential Rest", d: "Curated sleep environments utilizing zero-gravity bedding and oxygen filtration." }
                 ].map((p, i) => (
                   <Reveal key={i} delay={i * 0.1}>
                      <div className="text-center group">
                         <div className="w-20 h-20 mx-auto rounded-full border border-black/10 flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-700">
                            <p.icon className="w-6 h-6 text-black/30" />
                         </div>
                         <h3 className="text-2xl font-bold mb-6 uppercase tracking-tighter" style={{ fontFamily: "serif" }}>{p.t}</h3>
                         <p className="text-black/40 leading-relaxed font-light text-sm italic">{p.d}</p>
                      </div>
                   </Reveal>
                 ))}
              </div>
           </div>
        </section>

        {/* ── GALLERY ────────────────── */}
        <section className="py-40 bg-[#faf9f6]">
           <div className="max-w-[1600px] mx-auto px-6 md:px-12">
              <Reveal>
                 <div className="flex flex-col lg:flex-row items-end justify-between mb-32 gap-8 border-b border-black/5 pb-16">
                    <div className="max-w-2xl">
                       <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-black/30 block mb-6">The Sanctuary</span>
                       <h2 className="text-6xl md:text-8xl font-light uppercase tracking-tighter text-[#1a1a1a] leading-none" style={{ fontFamily: "serif" }}>Architectural <br/> <span className="italic">Healing.</span></h2>
                    </div>
                    <Link href="#hero" className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest hover:text-black text-black/40 transition-colors group italic">
                       View Retreat Schedule <ChevronRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                    </Link>
                 </div>
              </Reveal>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                 <Reveal>
                    <div className="relative aspect-[16/10] overflow-hidden rounded-[2.5rem]">
                       <Image src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=1200" alt="Spa Detail" fill className="object-cover hover:scale-105 transition-transform duration-[2000ms]" />
                       <div className="absolute inset-0 bg-black/5" />
                    </div>
                 </Reveal>
                 <div className="flex flex-col justify-center space-y-12">
                    <Reveal delay={0.2}>
                       <h3 className="text-4xl md:text-6xl font-light uppercase text-[#1a1a1a] italic" style={{ fontFamily: "serif" }}>{c?.aboutTitle ?? fd?.businessName ?? <>A Space <br/> To <span className="not-italic font-bold opacity-20">Be.</span></>}</h3>
                       <p className="text-xl text-black/40 font-light leading-relaxed italic max-w-md">{c?.aboutText ?? <>
                          Designed by award-winning architects, our sanctuary uses local stone and recycled timber to create a seamless transition between the self and nature.
                       </>}</p>
                    </Reveal>
                    <Reveal delay={0.3}>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-16 pt-12 border-t border-black/5">
                          <div>
                             <div className="text-4xl font-bold text-[#1a1a1a] mb-2 italic">12</div>
                             <div className="text-[9px] font-bold uppercase tracking-widest text-black/30">Private Chambers</div>
                          </div>
                          <div>
                             <div className="text-4xl font-bold text-[#1a1a1a] mb-2 italic">4</div>
                             <div className="text-[9px] font-bold uppercase tracking-widest text-black/30">Thermal Springs</div>
                          </div>
                       </div>
                    </Reveal>
                 </div>
              </div>
           </div>
        </section>

        {/* ── RETREATS ──────────────── */}
        <section className="py-40 bg-white border-t border-black/5">
           <div className="max-w-[1400px] mx-auto px-6 md:px-12">
              <Reveal>
                 <div className="flex flex-col md:flex-row items-end justify-between mb-24 border-b border-black/5 pb-12 gap-6">
                    <div>
                       <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-black/30 block mb-4">Immersive Programmes</span>
                       <h2 className="text-5xl md:text-7xl font-light uppercase tracking-tighter text-[#1a1a1a] leading-none" style={{ fontFamily: "serif" }}>Choose Your <span className="italic">Journey.</span></h2>
                    </div>
                 </div>
              </Reveal>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 {[
                    { name: "Elemental", duration: "3 days", guests: "Solo or couple", price: "€2,400", icon: Sun, desc: "Forest bathing, breathwork, cold immersion. A reset at cellular level.", includes: ["Daily thermal circuit", "2 treatments", "Plant-based cuisine"] },
                    { name: "Deep Stillness", duration: "7 days", guests: "Max 4 guests", price: "€5,800", icon: Moon, desc: "Full sensory withdrawal programme for executives and high-performance athletes.", includes: ["Biometric assessment", "Daily guided practice", "Sleep protocol", "Weekly outcomes report"] },
                    { name: "Inner Spring", duration: "14 days", guests: "Solo only", price: "€11,200", icon: Flower2, desc: "The complete Aether experience. Curated for transformational depth.", includes: ["Personalised ceremony", "Private chef", "6 modalities daily", "Post-retreat coaching", "2-month follow-up"] },
                 ].map((r, i) => (
                    <Reveal key={i} delay={i * 0.12}>
                       <div className="group border border-black/5 rounded-[2rem] p-10 flex flex-col gap-6 hover:shadow-xl transition-all duration-700 h-full">
                          <div className="w-14 h-14 rounded-full border border-black/10 flex items-center justify-center group-hover:bg-[#1a1a1a] group-hover:border-[#1a1a1a] transition-all duration-700">
                             <r.icon className="w-6 h-6 text-black/30 group-hover:text-white transition-colors" />
                          </div>
                          <div>
                             <div className="text-[9px] font-bold uppercase tracking-widest text-black/30 mb-1">{r.duration} · {r.guests}</div>
                             <h3 className="text-2xl font-bold uppercase tracking-widest text-[#1a1a1a] italic" style={{ fontFamily: "serif" }}>{r.name}</h3>
                             <div className="text-xl font-light text-black/40 mt-1">{r.price}</div>
                          </div>
                          <p className="text-sm text-black/40 font-light leading-relaxed italic flex-1">{r.desc}</p>
                          <ul className="space-y-2 border-t border-black/5 pt-6">
                             {r.includes.map(f => <li key={f} className="text-xs text-black/30 flex items-center gap-3"><Sparkles className="w-3 h-3 shrink-0 text-black/20" />{f}</li>)}
                          </ul>
                       </div>
                    </Reveal>
                 ))}
              </div>
           </div>
        </section>

        {/* ── TESTIMONIALS ──────────── */}
        <section id="contact" className="py-40 bg-[#faf9f6] border-t border-black/5">
           <div className="max-w-[1400px] mx-auto px-6 md:px-12">
              <Reveal>
                 <div className="text-center mb-20">
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-black/30 block mb-4">Guest Reflections</span>
                    <h2 className="text-5xl md:text-7xl font-light uppercase tracking-tighter text-[#1a1a1a] leading-none" style={{ fontFamily: "serif" }}>Voices of <span className="italic">Rest.</span></h2>
                 </div>
              </Reveal>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 {[
                    { quote: "I arrived carrying three years of accumulated burnout. After seven days at Aether, I remembered what it felt like to be in my body.", name: "Dr. Léa Fontaine", role: "Surgeon, Lyon" },
                    { quote: "Nothing digital, nothing performative. Just the sound of water and the smell of cedar. It changed my entire relationship with stillness.", name: "M. Okafor", role: "Founder, London" },
                    { quote: "The Deep Stillness retreat recalibrated my nervous system in ways I didn't know were possible. I sleep differently now.", name: "Y. Sato", role: "Artist, Tokyo" },
                 ].map((t, i) => (
                    <Reveal key={i} delay={i * 0.12}>
                       <div className="p-12 flex flex-col gap-6 border border-black/5 rounded-[2rem] h-full">
                          <div className="flex gap-1">
                             {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-black/20 text-black/20" />)}
                          </div>
                          <p className="text-base text-black/50 font-light leading-relaxed italic flex-1" style={{ fontFamily: "serif" }}>&ldquo;{t.quote}&rdquo;</p>
                          <div className="pt-6 border-t border-black/5">
                             <div className="font-bold text-sm text-[#1a1a1a]">{t.name}</div>
                             <div className="text-xs text-black/30 tracking-widest uppercase mt-1">{t.role}</div>
                          </div>
                       </div>
                    </Reveal>
                 ))}
              </div>
           </div>
        </section>

        {/* ── CTA ───────────────────── */}
        <section id="equipe" className="py-60 bg-white text-[#1a1a1a] text-center relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center opacity-[0.03] pointer-events-none">
              <Flower2 className="w-[800px] h-[800px] animate-[spin_60s_linear_infinite]" />
           </div>
           <div className="max-w-4xl mx-auto px-6 relative z-10">
              <Reveal>
                 <h2 className="text-7xl md:text-[15vw] font-light uppercase tracking-tighter leading-[0.8] mb-16 italic" style={{ fontFamily: "serif" }}>
                    Hold The <br/> <span className="not-italic font-bold opacity-10">Stillness.</span>
                 </h2>
                 <p className="text-xl text-black/40 font-light mb-20 leading-relaxed italic max-w-2xl mx-auto">
                    Limited memberships available for our 2026 Season. Begin your journey into the Aether today.
                 </p>
                 <div className="flex flex-col sm:flex-row items-center justify-center gap-12">
                    <button className="px-16 py-8 bg-[#1a1a1a] text-white font-bold uppercase tracking-[0.3em] text-[10px] rounded-full hover:px-20 transition-all duration-700 italic">
                       Request Membership Audit
                    </button>
                    <button className="px-16 py-8 border border-black/10 text-black/40 font-bold uppercase tracking-[0.3em] text-[10px] rounded-full hover:text-black transition-all italic">
                       View Retreats
                    </button>
                 </div>
              </Reveal>
           </div>
        </section>
      </main>

      {/* ── FOOTER ────────────────── */}
      <footer className="bg-[#faf9f6] pt-32 pb-12 px-6 border-t border-black/5">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-5 gap-20 mb-40">
           <div className="md:col-span-2">
              <Link href="#hero" className="flex items-center gap-4 mb-10 group">
                <div className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center">
                  <Wind className="w-5 h-5 text-[#3d3d3d]/60" />
                </div>
                <span className="text-xl font-light tracking-[0.3em] uppercase text-black">Aether Wellness</span>
              </Link>
              <p className="text-black/20 max-w-sm leading-relaxed mb-12 text-sm font-light italic" style={{ fontFamily: "serif" }}>
                 "Presence is the ultimate luxury. We provide the architecture to achieve it."
              </p>
              <div className="flex gap-10">
                 {["Camera", "Journal", "Newsletter", "Contact"].map(s => (
                   <Link key={s} href="#contact" className="text-[10px] font-bold uppercase tracking-widest text-black/20 hover:text-black transition-colors italic">{s}</Link>
                 ))}
              </div>
           </div>
           
           {[
             { t: "THE EXPERIENCE", l: ["Sanctuary", "Thermal Baths", "Sonic Lab", "Rituals"] },
             { t: "RETREATS", l: ["Season 2026", "Private Hire", "Corporate Presence", "Journal"] },
             { t: "ENTITY", l: ["Our Ethos", "Locations", "Inner Circle", "Legal"] }
           ].map((col, i) => (
             <div key={i} className="space-y-12">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.6em] text-black/20">{col.t}</h4>
                <ul className="space-y-6">
                   {col.l.map(link => (
                     <li key={link} className="text-xs font-bold uppercase tracking-widest text-black/40 hover:text-black transition-colors italic">
                        <Link href="#contact">{link}</Link>
                     </li>
                   ))}
                </ul>
             </div>
           ))}
        </div>
        <div className="max-w-[1400px] mx-auto flex flex-col md:row justify-between items-center gap-8 border-t border-black/5 pt-12 text-[10px] font-bold uppercase tracking-[0.4em] text-black/10 italic">
           <span>© 2026 AETHER WELLNESS GROUP. BREATHE IN.</span>
           <div className="flex gap-12">
              <Link href="#contact" className="hover:text-black transition-all">SWITZERLAND</Link>
              <Link href="#contact" className="hover:text-black transition-all">ICELAND</Link>
              <Link href="#contact" className="hover:text-black transition-all">JAPAN</Link>
           </div>
        </div>
      </footer>
    </div>
  )
}
