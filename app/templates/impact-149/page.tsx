"use client";
// @ts-nocheck
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Wind, ArrowRight, Menu, Star, Heart, Sun, Waves, Flower2, Moon, ChevronRight, Play, Sparkles } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { resolveList } from "@/lib/templates/resolveList"
import {
  DWELL,
  useSlides,
  AnchoredBackdrop,
  BlurThrough,
  SlideIndex,
  HairlineArrows,
} from "@/lib/templates/hero-kit-2"

/* The hero carried no photography at all — a blurred circle behind centred
   type — which is what made a €11,200 retreat look like a free template.
   Split screen from the bakery lab: the sanctuary is shown, one retreat at a
   time, and the swatches let a visitor choose rather than wait. */
const HERO_SLIDES = [
  {
    n: "Elemental",
    d: "Forest bathing, breathwork, cold immersion. Three days to reset at cellular level.",
    meta: "3 days · from €2,400",
    c: "#7d8f7a",
    img: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1400&q=80",
  },
  {
    n: "Deep Stillness",
    d: "Full sensory withdrawal, never more than four guests. Built for people who cannot switch off alone.",
    meta: "7 days · from €5,800",
    c: "#5a6b7d",
    img: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=1400&q=80",
  },
  {
    n: "Inner Spring",
    d: "The complete Aether passage. Private chef, personalised ceremony, two months of follow-up.",
    meta: "14 days · from €11,200",
    c: "#9a8778",
    img: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=1400&q=80",
  },
]

function AetherHero({ headline, subline }: { headline?: React.ReactNode; subline?: React.ReactNode }) {
  const { i, go, next, prev } = useSlides(HERO_SLIDES.length, DWELL.slow)
  const s = HERO_SLIDES[i]
  return (
    <section id="hero" className="relative min-h-[92svh] md:min-h-dvh overflow-hidden bg-[#faf9f6] text-[#1a1a1a]">
      <div className="h-full grid md:grid-cols-2 min-h-[92svh] md:min-h-dvh">
        {/* the photograph half */}
        <div className="relative overflow-hidden min-h-[42svh] md:min-h-0 order-1 md:order-none">
          <AnchoredBackdrop images={HERO_SLIDES.map((x) => x.img)} index={i} overlay={0.14} />
          {/* the site nav is dark type over this half — a cream veil, not a
              dark scrim, keeps it readable over any photograph */}
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-44 z-[5]"
            style={{ background: "linear-gradient(to bottom, rgba(250,249,246,0.92), rgba(250,249,246,0))" }}
          />
          <div
            className="absolute left-4 bottom-8 z-10 text-[10px] uppercase tracking-[0.3em] text-white/70 hidden md:block"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            Switzerland · Iceland · Japan
          </div>
        </div>

        {/* the type half */}
        <div className="relative flex flex-col justify-center px-6 md:px-14 py-16 md:py-20 pt-28 md:pt-20">
          <SlideIndex i={i} total={HERO_SLIDES.length} variant="fraction" className="text-[15px] mb-8 text-black/40" />
          <h1
            className="uppercase"
            style={{
              fontFamily: "serif",
              fontSize: "clamp(40px, 5.4vw, 84px)",
              lineHeight: 0.92,
              fontWeight: 300,
              letterSpacing: "-0.02em",
            }}
          >
            {headline ?? (
              <>
                Pure <br />
                <span className="italic lowercase">presence.</span>
              </>
            )}
          </h1>
          <p className="mt-7 max-w-[46ch] text-[15px] leading-relaxed text-black/45 italic">
            {subline ?? "A high-fidelity sanctuary for physical and spiritual restoration, on the rhythm of the self."}
          </p>

          <BlurThrough index={i} amount={10}>
            <div className="mt-9 pt-7 border-t border-black/10">
              <div className="text-[10px] font-bold uppercase tracking-[0.34em] text-black/30">
                {s.meta}
              </div>
              <div className="mt-2.5" style={{ fontFamily: "serif", fontSize: 26, fontWeight: 300 }}>
                {s.n}
              </div>
              <p className="mt-2 max-w-[46ch] text-sm leading-relaxed text-black/45">{s.d}</p>
            </div>
          </BlurThrough>

          <a
            href="#contact"
            className="mt-9 self-start min-h-[46px] px-10 grid place-items-center rounded-full text-[10px] font-bold uppercase tracking-[0.28em] text-white transition-colors"
            style={{ background: s.c }}
          >
            Enquire
          </a>

          <div className="mt-9 flex items-center justify-between gap-6">
            <div className="flex gap-2">
              {HERO_SLIDES.map((x, n) => (
                <button
                  key={x.n}
                  type="button"
                  onClick={() => go(n)}
                  aria-label={x.n}
                  aria-current={n === i}
                  className="grid place-items-center cursor-pointer"
                  style={{ width: 44, height: 44, background: "none", border: "none", padding: 0 }}
                >
                  <motion.span
                    className="block rounded-full"
                    style={{ background: x.c }}
                    animate={{
                      width: n === i ? 26 : 16,
                      height: n === i ? 26 : 16,
                      opacity: n === i ? 1 : 0.35,
                    }}
                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  />
                </button>
              ))}
            </div>
            <HairlineArrows onPrev={prev} onNext={next} color="#1a1a1a" className="opacity-50" />
          </div>
        </div>
      </div>
    </section>
  )
}

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

const RETREATS_DEMO = [
  { name: "Elemental", duration: "3 days", guests: "Solo or couple", price: "€2,400", icon: Sun, desc: "Forest bathing, breathwork, cold immersion. A reset at cellular level.", includes: ["Daily thermal circuit", "2 treatments", "Plant-based cuisine"] },
  { name: "Deep Stillness", duration: "7 days", guests: "Max 4 guests", price: "€5,800", icon: Moon, desc: "Full sensory withdrawal programme for executives and high-performance athletes.", includes: ["Biometric assessment", "Daily guided practice", "Sleep protocol", "Weekly outcomes report"] },
  { name: "Inner Spring", duration: "14 days", guests: "Solo only", price: "€11,200", icon: Flower2, desc: "The complete Aether experience. Curated for transformational depth.", includes: ["Personalised ceremony", "Private chef", "6 modalities daily", "Post-retreat coaching", "2-month follow-up"] },
]

const TESTIMONIALS_DEMO = [
  { quote: "I arrived carrying three years of accumulated burnout. After seven days at Aether, I remembered what it felt like to be in my body.", name: "Dr. Léa Fontaine", role: "Surgeon, Lyon" },
  { quote: "Nothing digital, nothing performative. Just the sound of water and the smell of cedar. It changed my entire relationship with stillness.", name: "M. Okafor", role: "Founder, London" },
  { quote: "The Deep Stillness retreat recalibrated my nervous system in ways I didn't know were possible. I sleep differently now.", name: "Y. Sato", role: "Artist, Tokyo" },
]

// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let bp: any = null;
let brand: any = null;
// Client-uploaded photo at index i, falling back to the template's stock
// photo when the client did not upload one for that slot.
function photo(i: number, fallback: string): string {
  return fd?.photoUrls?.[i] || fallback;
}
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
    businessProfile?: any;
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
  bp = session?.businessProfile;
  brand = fd?.brandColor ?? null; // null = keep template's original color

  const RETREATS = resolveList(
    bp?.services?.map((s: any, i: number) => ({
      name: s.title ?? RETREATS_DEMO[i % RETREATS_DEMO.length].name,
      duration: RETREATS_DEMO[i % RETREATS_DEMO.length].duration,
      guests: RETREATS_DEMO[i % RETREATS_DEMO.length].guests,
      price: s.price ?? RETREATS_DEMO[i % RETREATS_DEMO.length].price,
      icon: RETREATS_DEMO[i % RETREATS_DEMO.length].icon,
      desc: s.description ?? RETREATS_DEMO[i % RETREATS_DEMO.length].desc,
      includes: RETREATS_DEMO[i % RETREATS_DEMO.length].includes,
    })),
    RETREATS_DEMO
  )
  const TESTIMONIALS = resolveList(
    bp?.reputation?.featuredReviews?.map((r: any, i: number) => ({
      quote: r.text ?? TESTIMONIALS_DEMO[i % TESTIMONIALS_DEMO.length].quote,
      name: r.name ?? TESTIMONIALS_DEMO[i % TESTIMONIALS_DEMO.length].name,
      role: r.location ?? TESTIMONIALS_DEMO[i % TESTIMONIALS_DEMO.length].role,
    })),
    TESTIMONIALS_DEMO
  )

  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
  }, []);

  return (
    <div className="bg-[#faf9f6] text-[#3d3d3d] font-sans min-h-dvh selection:bg-[#e5e7eb] selection:text-[#1a1a1a] overflow-x-hidden">
      
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
        <AetherHero headline={c?.heroHeadline} subline={c?.heroSubline ?? fd?.tagline} />

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
                       <Image src={photo(0, "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=1200")} alt="Spa Detail" fill className="object-cover hover:scale-105 transition-transform duration-[2000ms]" />
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
                             <div className="text-[10px] font-bold uppercase tracking-widest text-black/30">Private Chambers</div>
                          </div>
                          <div>
                             <div className="text-4xl font-bold text-[#1a1a1a] mb-2 italic">4</div>
                             <div className="text-[10px] font-bold uppercase tracking-widest text-black/30">Thermal Springs</div>
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
                 {RETREATS.map((r: any, i: number) => (
                    <Reveal key={i} delay={i * 0.12}>
                       <div className="group border border-black/5 rounded-[2rem] p-10 flex flex-col gap-6 hover:shadow-xl transition-all duration-700 h-full">
                          <div className="w-14 h-14 rounded-full border border-black/10 flex items-center justify-center group-hover:bg-[#1a1a1a] group-hover:border-[#1a1a1a] transition-all duration-700">
                             <r.icon className="w-6 h-6 text-black/30 group-hover:text-white transition-colors" />
                          </div>
                          <div>
                             <div className="text-[10px] font-bold uppercase tracking-widest text-black/30 mb-1">{r.duration} · {r.guests}</div>
                             <h3 className="text-2xl font-bold uppercase tracking-widest text-[#1a1a1a] italic" style={{ fontFamily: "serif" }}>{r.name}</h3>
                             <div className="text-xl font-light text-black/40 mt-1">{r.price}</div>
                          </div>
                          <p className="text-sm text-black/40 font-light leading-relaxed italic flex-1">{r.desc}</p>
                          <ul className="space-y-2 border-t border-black/5 pt-6">
                             {r.includes.map((f: any) => <li key={f} className="text-xs text-black/30 flex items-center gap-3"><Sparkles className="w-3 h-3 shrink-0 text-black/20" />{f}</li>)}
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
                 {TESTIMONIALS.map((t: any, i: number) => (
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
