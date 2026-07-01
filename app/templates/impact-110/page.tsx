// @ts-nocheck
"use client"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Flower2, ArrowRight, Menu, Star, Sparkles, MapPin, Clock, Phone, Heart, Leaf, Wind, Droplets, CheckCircle2 } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

function Reveal({ children, delay = 0, y = 40 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }} animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  )
}

function ParallaxImg({ src, alt }: { src: string; alt: string }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"])
  return (
    <div ref={ref} className="relative w-full h-full overflow-hidden rounded-2xl">
      <motion.div style={{ y }} className="absolute inset-[-20%] w-[140%] h-[140%]">
        <Image src={src} alt={alt} fill className="object-cover" />
      </motion.div>
    </div>
  )
}

const TREATMENTS = [
  { title: "Celestial Stone Massage", duration: "90 min", price: "$210", desc: "Heated volcanic stones and essential oils to release deep muscular tension.", icon: Flame },
  { title: "Botanical Facial", duration: "60 min", price: "$145", desc: "Organic enzymes and cold-pressed floral extracts to restore skin radiance.", icon: Flower2 },
  { title: "Hydro-Oxygen Flow", duration: "75 min", price: "$180", desc: "A combination of mineral baths and high-pressure oxygen therapy.", icon: Droplets },
]

const PHILOSOPHY = [
  { icon: Wind, title: "Mindfulness", text: "Quiet the external noise to hear your inner voice." },
  { icon: Leaf, title: "Organic Purity", text: "100% natural, ethically sourced botanical ingredients." },
  { icon: Droplets, title: "Elemental Flow", text: "Harnessing water and heat for biological restoration." },
]


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function OasisWellnessPage() {
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
  const [contactSubmitted, setContactSubmitted] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", h)
    
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
  }, [c]);
return () => window.removeEventListener("scroll", h)
  }, [])

  return (
    <div className="bg-[#faf9f6] text-[#2c3e2d] font-sans min-h-screen selection:bg-[#d4e2d4] selection:text-[#2c3e2d] overflow-x-hidden">
      
      {/* ── NAVBAR ────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-1000 ${scrolled ? "bg-[#faf9f6]/90 backdrop-blur-xl border-b border-[#2c3e2d]/5 py-4" : "bg-transparent py-8"}`}>
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="#hero" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-[#2c3e2d] flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
              <Flower2 className="w-5 h-5 text-[#faf9f6]" />
            </div>
            <span className="text-xl font-light tracking-[0.2em] uppercase">Oasis <span className="font-bold text-[#2c3e2d]">Wellness</span></span>
          </Link>
          <div className="hidden lg:flex gap-12 text-[10px] font-bold uppercase tracking-[0.3em] text-[#2c3e2d]/40">
            {["Treatments", "Sanctuary", "About", "Contact"].map(l => (
              <a key={l} href={`#${l.toLowerCase().replace(" ", "")}`} className="hover:text-[#2c3e2d] transition-colors">{l}</a>
            ))}
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})} className="hidden md:block text-[10px] font-bold uppercase tracking-widest text-[#2c3e2d]/60 hover:text-[#2c3e2d] transition-colors">Member Login</button>
            <button onClick={() => document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})} className="px-8 py-3 bg-[#2c3e2d] text-[#faf9f6] text-[10px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-[#3d523e] transition-all duration-700">Book Ritual</button>
            <Sheet>
              <SheetTrigger className="lg:hidden"><Menu className="w-6 h-6 text-[#2c3e2d]" /></SheetTrigger>
              <SheetContent side="right" className="bg-[#faf9f6] border-[#2c3e2d]/5 p-12">
                <div className="flex flex-col gap-10 mt-16 text-center">
                  {["Treatments", "Sanctuary", "About", "Contact"].map(l => (
                    <a key={l} href={`#${l.toLowerCase().replace(" ", "")}`} onClick={() => document.getElementById(l.toLowerCase().replace(" ", ""))?.scrollIntoView({behavior:"smooth"})} className="text-3xl font-light uppercase tracking-widest hover:text-[#2c3e2d] transition-colors">{l}</a>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      <main>
        {/* ── HERO ──────────────────── */}
        <section id="hero" className="relative h-[110vh] min-h-[800px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <Image src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=2400" alt="Spa Background" fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-b from-[#faf9f6]/20 via-transparent to-[#faf9f6]" />
          </div>

          <div className="relative z-10 max-w-[1200px] mx-auto px-6 text-center">
            <Reveal>
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="h-[1px] w-12 bg-[#2c3e2d]/30" />
                <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#2c3e2d]/50">Quiet the soul, heal the body</span>
                <div className="h-[1px] w-12 bg-[#2c3e2d]/30" />
              </div>
            </Reveal>
            <Reveal delay={0.2} y={70}>
              <h1 className="text-7xl md:text-[8rem] lg:text-[10rem] font-light italic leading-[0.85] tracking-tighter mb-12" style={{ fontFamily: "serif" }}>{c?.heroHeadline ?? <>
                Breath of <br/> <span className="font-bold not-italic">Serenity.</span>
              </>}</h1>
            </Reveal>
            <Reveal delay={0.4}>
              <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                <p className="text-lg text-[#2c3e2d]/60 font-light max-w-sm leading-relaxed">{c?.heroSubline ?? fd?.tagline ?? <>
                  A sanctuary dedicated to biological restoration and deep mindfulness. Rediscover your essence in the heart of the city.
                </>}</p>
                <div className="w-[1px] h-20 bg-[#2c3e2d]/10 hidden md:block" />
                <button onClick={() => document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})} className="px-12 py-5 bg-[#2c3e2d] text-[#faf9f6] font-bold rounded-full hover:px-14 transition-all duration-700 flex items-center gap-3">
                  Begin Journey <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </Reveal>
          </div>
          
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 2 }} className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-[9px] font-bold uppercase tracking-[0.4em] text-[#2c3e2d]/30">
            Scroll to Breathe
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="w-[1px] h-12 bg-[#2c3e2d]/20" />
          </motion.div>
        </section>

        {/* ── PHILOSOPHY ────────────── */}
        <section className="py-32 bg-[#faf9f6]">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
              {PHILOSOPHY.map((p, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="text-center group">
                    <div className="w-20 h-20 mx-auto rounded-full border border-[#2c3e2d]/10 flex items-center justify-center mb-8 group-hover:bg-[#2c3e2d] group-hover:border-[#2c3e2d] transition-all duration-700">
                      <p.icon className="w-6 h-6 text-[#2c3e2d] group-hover:text-[#faf9f6] transition-colors" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 uppercase tracking-tighter" style={{ fontFamily: "serif" }}>{p.title}</h3>
                    <p className="text-[#2c3e2d]/50 leading-relaxed font-light">{p.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── TREATMENTS ────────────── */}
        <section id="treatments" className="py-32 bg-white rounded-[4rem] mx-4">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="flex flex-col lg:flex-row items-end justify-between mb-24 gap-8">
                <div className="max-w-2xl">
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#2c3e2d]/40 block mb-4">The Rituals</span>
                  <h2 className="text-5xl md:text-7xl font-light italic" style={{ fontFamily: "serif" }}>
                    Signature <span className="font-bold not-italic">Healing.</span>
                  </h2>
                </div>
                <p className="text-lg text-[#2c3e2d]/40 font-light max-w-sm mb-4">
                  Each session is tailored to your biometric profile and emotional state of being.
                </p>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {TREATMENTS.map((t, i) => (
                <Reveal key={i} delay={i * 0.15}>
                  <div className="p-10 rounded-3xl border border-[#2c3e2d]/5 hover:border-[#2c3e2d]/20 transition-all duration-700 group cursor-default">
                    <div className="flex justify-between items-start mb-12">
                      <div className="text-3xl font-bold" style={{ fontFamily: "serif" }}>{t.price}</div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#2c3e2d]/40">{t.duration}</span>
                    </div>
                    <h4 className="text-2xl font-bold mb-4 tracking-tight">{t.title}</h4>
                    <p className="text-[#2c3e2d]/50 leading-relaxed text-sm mb-12">{t.desc}</p>
                    <button onClick={() => document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})} className="w-full py-4 border border-[#2c3e2d]/10 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] group-hover:bg-[#2c3e2d] group-hover:text-white transition-all duration-700">
                      Reserve
                    </button>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── PARALLAX SECTION ──────── */}
        <section id="sanctuary" className="py-32 overflow-hidden">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <Reveal>
                <div className="aspect-[4/5] relative">
                  <ParallaxImg src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=1200" alt="Relaxation Area" />
                  <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-[#faf9f6] p-4 hidden lg:block">
                     <Image src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=800" alt="Botanical" fill className="object-cover rounded-xl" />
                  </div>
                </div>
              </Reveal>
              <div className="space-y-12">
                <Reveal delay={0.2}>
                  <h2 className="text-5xl md:text-6xl font-light" style={{ fontFamily: "serif" }}>{c?.aboutTitle ?? fd?.businessName ?? <>
                    The Sanctuary of <br/> <span className="font-bold italic">Stillness.</span>
                  </>}</h2>
                  <p className="text-xl text-[#2c3e2d]/50 font-light leading-relaxed">{c?.aboutText ?? <>
                    Designed by renowned minimalist architects, our sanctuary features sound-dampened clay walls, ionized salt water pools, and botanical gardens that breathe with you.
                  </>}</p>
                </Reveal>
                <Reveal delay={0.3}>
                  <div className="grid grid-cols-2 gap-12 pt-8 border-t border-[#2c3e2d]/5">
                    <div>
                      <div className="text-4xl font-bold text-[#2c3e2d] mb-1">12</div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-[#2c3e2d]/40">Private Suites</div>
                    </div>
                    <div>
                      <div className="text-4xl font-bold text-[#2c3e2d] mb-1">3</div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-[#2c3e2d]/40">Elemental Pools</div>
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ───────────────────── */}
        <section className="py-32 relative text-center px-6">
          <div className="absolute inset-0 bg-[#d4e2d4]/30" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <Reveal>
              <h2 className="text-5xl md:text-8xl font-light mb-12" style={{ fontFamily: "serif" }}>
                Begin Your <span className="italic">Awakening.</span>
              </h2>
              <p className="text-xl text-[#2c3e2d]/60 font-light mb-12 leading-relaxed">
                Experience the profound power of true rest. Book your first consultation and let our practitioners guide you home.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <button onClick={() => document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})} className="px-14 py-6 bg-[#2c3e2d] text-[#faf9f6] font-bold rounded-full hover:bg-[#3d523e] transition-all shadow-xl">
                  Book Initial Ritual
                </button>
                <button onClick={() => document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})} className="px-14 py-6 border border-[#2c3e2d]/20 text-[#2c3e2d] font-bold rounded-full hover:bg-[#2c3e2d] hover:text-[#faf9f6] transition-all">
                  Join Membership
                </button>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── ABOUT & PRACTITIONERS ── */}
        <section id="about" className="py-32 bg-[#faf9f6] border-t border-[#2c3e2d]/5">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
              <div>
                <Reveal>
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#2c3e2d]/40 block mb-4">Our Essence</span>
                  <h2 className="text-5xl font-light mb-8" style={{ fontFamily: "serif" }}>Returning to Your <span className="font-bold italic">Natural Rhythms.</span></h2>
                  <p className="text-lg text-[#2c3e2d]/60 font-light leading-relaxed mb-6">
                    Oasis was created as a refuge from modern acceleration. We believe that true healing begins when we slow down to match the gentle cadence of nature.
                  </p>
                  <p className="text-lg text-[#2c3e2d]/60 font-light leading-relaxed">
                    Our practitioners draw on ancient botanical wisdom and modern biometric insights to design restorative therapies tailored to your nervous system.
                  </p>
                </Reveal>
              </div>
              <Reveal>
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                  <ParallaxImg src="https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&q=80&w=1200" alt="Botanical oils" />
                </div>
              </Reveal>
            </div>

            <Reveal>
              <div className="text-center mb-24">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#2c3e2d]/40 block mb-4">The Practitioners</span>
                <h2 className="text-5xl font-light" style={{ fontFamily: "serif" }}>Healers in <span className="font-bold italic">Residence.</span></h2>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: "Aria Lyre", role: "Reiki Master & Sound Therapist", bio: "Over 12 years guiding vibrational meditation and acoustic resonance healing.", initials: "AL" },
                { name: "Elena Rostova", role: "Botanical Aesthetician", bio: "Specialist in herbal alchemy, customized facial enzymes, and dermal vitality.", initials: "ER" },
                { name: "Kavi Das", role: "Mindfulness & Breathwork Guide", bio: "Trained in Himalayan lineages, focusing on somatic stress reduction.", initials: "KD" },
              ].map((p, i) => (
                <Reveal key={p.name} delay={i * 0.1}>
                  <div className="p-10 bg-white rounded-3xl border border-[#2c3e2d]/5 text-center flex flex-col items-center">
                    <div className="w-16 h-16 bg-[#2c3e2d] rounded-full flex items-center justify-center mb-6">
                      <span className="text-[#faf9f6] font-bold text-lg">{p.initials}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{p.name}</h3>
                    <div className="text-[9px] uppercase tracking-widest text-[#2c3e2d]/50 font-bold mb-4">{p.role}</div>
                    <p className="text-sm text-[#2c3e2d]/60 leading-relaxed font-light">{p.bio}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section className="py-32 bg-white rounded-[4rem] mx-4 border-t border-[#2c3e2d]/5">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="text-center mb-24">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#2c3e2d]/40 block mb-4">Guest Reviews</span>
                <h2 className="text-5xl font-light" style={{ fontFamily: "serif" }}>Voices of <span className="font-bold italic">Sanctuary.</span></h2>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { quote: "The Celestial Stone massage released a year's worth of accumulated stress in ninety minutes. The silence here is physical.", author: "Clara M.", plan: "Sanctuary Guest" },
                { quote: "An absolute masterclass in minimalist design and somatic care. The sound-dampened suites are a dream.", author: "Julien B.", plan: "Member since 2023" },
                { quote: "Oasis has become my weekly anchor. The breathwork sessions with Kavi have completely shifted my high-stress routine.", author: "Sophia T.", plan: "Essential Member" },
              ].map((t, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="p-10 bg-[#faf9f6] rounded-3xl border border-[#2c3e2d]/5 flex flex-col justify-between h-full hover:border-[#2c3e2d]/25 transition-all duration-300">
                    <p className="text-[#2c3e2d]/60 leading-relaxed font-light italic mb-8">"{t.quote}"</p>
                    <div>
                      <div className="font-bold text-sm text-[#2c3e2d]">{t.author}</div>
                      <div className="text-[9px] uppercase tracking-widest text-[#2c3e2d]/50 font-bold mt-1">{t.plan}</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── CONTACT ── */}
        <section id="contact" className="py-32 bg-[#faf9f6] border-t border-[#2c3e2d]/5">
          <div className="max-w-[800px] mx-auto px-6 text-center">
            <Reveal>
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#2c3e2d]/40 block mb-4">Reserve</span>
              <h2 className="text-5xl md:text-6xl font-light mb-12" style={{ fontFamily: "serif" }}>Begin Your <span className="italic">Restoration.</span></h2>
            </Reveal>
            <Reveal delay={0.15}>
              {contactSubmitted ? (
                <div className="p-12 bg-white rounded-3xl border border-[#2c3e2d]/10 flex flex-col items-center justify-center">
                  <CheckCircle2 className="w-12 h-12 text-[#2c3e2d] mb-4" />
                  <p className="text-xl font-bold text-[#2c3e2d]">Merci, nous vous répondrons sous 24h.</p>
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); setContactSubmitted(true); }} className="space-y-4 max-w-md mx-auto text-left">
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-[#2c3e2d]/50 mb-2">Name</label>
                    <input required type="text" placeholder="Your Name" className="w-full px-5 py-3.5 bg-white border border-[#2c3e2d]/10 rounded-full text-sm focus:outline-none focus:border-[#2c3e2d] transition-all text-[#2c3e2d]" />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-[#2c3e2d]/50 mb-2">Email</label>
                    <input required type="email" placeholder="you@example.com" className="w-full px-5 py-3.5 bg-white border border-[#2c3e2d]/10 rounded-full text-sm focus:outline-none focus:border-[#2c3e2d] transition-all text-[#2c3e2d]" />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-[#2c3e2d]/50 mb-2">Message</label>
                    <textarea required rows={4} placeholder="Let us know your treatment preferences or membership questions..." className="w-full px-5 py-3.5 bg-white border border-[#2c3e2d]/10 rounded-3xl text-sm focus:outline-none focus:border-[#2c3e2d] transition-all text-[#2c3e2d]" />
                  </div>
                  <button type="submit" className="w-full py-4 bg-[#2c3e2d] text-[#faf9f6] font-bold rounded-full hover:bg-[#3d523e] transition-all duration-300">
                    Book Initial Consultation
                  </button>
                </form>
              )}
            </Reveal>
          </div>
        </section>
      </main>

      {/* ── FOOTER ────────────────── */}
      <footer className="bg-[#faf9f6] pt-24 pb-12 px-6">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
          <div className="md:col-span-2">
             <Link href="#hero" className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-full bg-[#2c3e2d] flex items-center justify-center">
                <Flower2 className="w-5 h-5 text-[#faf9f6]" />
              </div>
              <span className="text-xl font-light tracking-[0.2em] uppercase">Oasis <span className="font-bold text-[#2c3e2d]">Wellness</span></span>
            </Link>
            <p className="text-[#2c3e2d]/40 max-w-sm leading-relaxed mb-10 italic" style={{ fontFamily: "serif" }}>
              "Wellness is not a destination, but a state of being in harmony with the natural rhythms of life."
            </p>
            <div className="flex gap-8">
               {["Camera", "Journal", "Spotify"].map(s => (
                 <Link key={s} href="#hero" className="text-[10px] font-bold uppercase tracking-widest text-[#2c3e2d]/40 hover:text-[#2c3e2d] transition-colors">{s}</Link>
               ))}
            </div>
          </div>
          
          {[
            { t: "Sanctuary", l: ["Treatments", "Sanctuary", "About", "Contact"] },
          ].map((col, i) => (
            <div key={i}>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#2c3e2d] mb-10">{col.t}</h4>
              <ul className="space-y-6">
                {col.l.map(link => {
                  let href = "#";
                  if (link === "Treatments") href = "#treatments";
                  if (link === "Sanctuary") href = "#sanctuary";
                  if (link === "About") href = "#about";
                  if (link === "Contact") href = "#contact";
                  return <li key={link}><Link href={href} className="text-sm text-[#2c3e2d]/50 hover:text-[#2c3e2d] transition-colors">{link}</Link></li>;
                })}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="max-w-[1600px] mx-auto pt-12 border-t border-[#2c3e2d]/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-[#2c3e2d]/30">
          <span>© 2026 OASIS WELLNESS COLLECTIVE.</span>
          <div className="flex gap-10">
            <Link href="#contact" className="hover:text-[#2c3e2d] transition-colors">Mentions légales</Link>
            <Link href="#contact" className="hover:text-[#2c3e2d] transition-colors">Confidentialité</Link>
            <Link href="#contact" className="hover:text-[#2c3e2d] transition-colors">CGU</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function Flame({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
  )
}
