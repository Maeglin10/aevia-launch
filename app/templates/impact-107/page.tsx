"use client";
// @ts-nocheck
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Compass, ArrowRight, Menu, Star, MapPin, Mountain, Camera, Globe, Tent, Flame, Award, Users, ChevronRight } from "lucide-react"
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

const EXPEDITIONS = [
  { title: "Karakoram Traverse", region: "Pakistan", duration: "18 days", difficulty: "Expert", img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200", desc: "Cross the world's most dramatic mountain range through ancient Silk Road passes." },
  { title: "Svalbard Polar", region: "Arctic Norway", duration: "12 days", difficulty: "Moderate", img: "https://images.unsplash.com/photo-1489440543286-a6933013dfc6?q=80&w=1200&auto=format&fit=crop", desc: "Glacier treks and polar wildlife encounters at 78°N latitude." },
  { title: "Namib Desert Crossing", region: "Namibia", duration: "10 days", difficulty: "Challenging", img: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&q=80&w=1200", desc: "Navigate the world's oldest desert, from Deadvlei to the Skeleton Coast." },
]

const CHAPTERS = [
  { num: "01", title: "The Approach", desc: "Every expedition begins months before departure — with research, conditioning, and route reconnaissance.", icon: Globe },
  { num: "02", title: "The Field", desc: "Small teams of 4-8, moving through terrain with purpose. Camps built for recovery, not luxury.", icon: Tent },
  { num: "03", title: "The Summit", desc: "The objective is never the top. It's the transformation that happens on the way.", icon: Mountain },
  { num: "04", title: "The Archive", desc: "Every journey is documented. Photography, field notes, and GPS data become your permanent record.", icon: Camera },
]


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function MeridianJourneyPage() {
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
  const heroY = useTransform(scrollYProgress, [0, 0.2], ["0%", "30%"])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0])

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
    <div className="bg-[#0d1210] text-white font-sans min-h-screen selection:bg-teal-500 selection:text-black overflow-x-hidden">

      {/* ── NAVBAR ──────────────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? "bg-[#0d1210]/90 backdrop-blur-xl border-b border-teal-500/10 py-4" : "bg-transparent py-8"}`}>
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
                <Compass className="w-6 h-6 text-teal-400" />
                <span className="text-xl font-bold tracking-[0.2em] uppercase">Meridian</span>
              </>
            )}
          </Link>
          <div className="hidden lg:flex gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
            {["Expeditions", "Stories", "Gear", "About"].map(l => (
              <Link key={l} href="#about" className="hover:text-teal-400 transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-6">
            <button className="hidden md:block px-8 py-3 bg-teal-500 text-black text-[10px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-white transition-colors duration-500">
              Join Expedition
            </button>
            <Sheet>
              <SheetTrigger className="lg:hidden"><Menu className="w-6 h-6 text-white" /></SheetTrigger>
              <SheetContent side="right" className="bg-[#0d1210] border-teal-500/10 p-12">
                <div className="flex flex-col gap-8 mt-16">
                  {["Expeditions", "Stories", "Gear", "Contact"].map(l => (
                    <Link key={l} href="#contact" className="text-3xl font-light uppercase tracking-widest hover:text-teal-400 transition-colors">{l}</Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      <main>
        {/* ── HERO ──────────────────────────── */}
        <section id="hero" className="relative h-[120vh] min-h-[900px] flex items-end overflow-hidden">
          <motion.div style={{ y: heroY }} className="absolute inset-0">
            <Image src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2400" alt="Mountains" fill className="object-cover opacity-70" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d1210] via-[#0d1210]/30 to-transparent" />
          </motion.div>

          <motion.div style={{ opacity: heroOpacity }} className="relative z-10 max-w-[1600px] w-full mx-auto px-6 md:px-12 pb-24">
            <Reveal>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-[1px] bg-teal-400" />
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-teal-400">Expedition Storytelling</span>
              </div>
            </Reveal>
            <Reveal delay={0.15} y={70}>
              <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-black tracking-tighter leading-[0.8] mb-8 uppercase">{c?.heroHeadline ?? <>
                Into The<br/><span className="text-teal-400">Unknown.</span>
              </>}</h1>
            </Reveal>
            <Reveal delay={0.3}>
              <p className="max-w-lg text-lg text-white/50 font-light leading-relaxed">{c?.heroSubline ?? fd?.tagline ?? <>
                Guided expeditions to the world's most remote landscapes. Small teams, real challenge, permanent transformation.
              </>}</p>
            </Reveal>
          </motion.div>

          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            <span className="text-[8px] font-bold uppercase tracking-[0.4em] text-white/30">Scroll</span>
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}
              className="w-[1px] h-10 bg-gradient-to-b from-teal-400/60 to-transparent" />
          </div>
        </section>

        {/* ── STATS ────────────────────────── */}
        <section className="py-20 border-y border-white/5">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { v: "47", l: "Expeditions led" },
              { v: "26", l: "Countries traversed" },
              { v: "100%", l: "Safety record" },
              { v: "8", l: "Max group size" },
            ].map((s, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="text-center">
                  <div className="text-4xl font-black text-teal-400 mb-1">{s.v}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-white/30">{s.l}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── EXPEDITIONS ──────────────────── */}
        <section className="py-32 bg-[#0d1210]">
          <div className="max-w-[1600px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="mb-20">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-teal-400 block mb-4">Upcoming</span>
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase">Next <span className="text-teal-400">Expeditions.</span></h2>
              </div>
            </Reveal>
            <div className="flex flex-col gap-12">
              {EXPEDITIONS.map((exp, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="group grid grid-cols-1 lg:grid-cols-2 gap-8 cursor-pointer items-center">
                    <div className="relative aspect-[16/9] overflow-hidden rounded-xl">
                      <ParallaxImg src={exp.img} alt={exp.title} />
                      <div className="absolute inset-0 bg-teal-900/10 group-hover:bg-transparent transition-colors duration-700" />
                      <div className="absolute top-6 left-6 flex gap-2">
                        <span className="px-3 py-1 bg-black/50 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest text-teal-300 rounded-full">{exp.duration}</span>
                        <span className="px-3 py-1 bg-black/50 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest text-white/60 rounded-full">{exp.difficulty}</span>
                      </div>
                    </div>
                    <div className="lg:pl-8">
                      <div className="flex items-center gap-2 mb-3 text-xs text-teal-400">
                        <MapPin className="w-3 h-3" /> {exp.region}
                      </div>
                      <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-4 group-hover:text-teal-400 transition-colors">{exp.title}</h3>
                      <p className="text-white/40 leading-relaxed mb-6">{exp.desc}</p>
                      <button className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-teal-400 group-hover:gap-5 transition-all">
                        View Expedition <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── CHAPTERS (PROCESS) ───────────── */}
        <section className="py-32 bg-[#111a16]">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="text-center mb-24">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-teal-400 block mb-4">The Journey</span>
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase">Four <span className="text-teal-400">Chapters.</span></h2>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {CHAPTERS.map((ch, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="text-center group">
                    <div className="text-5xl font-light text-teal-400/15 mb-4">{ch.num}</div>
                    <div className="w-14 h-14 rounded-full border border-teal-400/20 flex items-center justify-center mx-auto mb-6 group-hover:bg-teal-500 group-hover:border-teal-500 transition-all duration-500">
                      <ch.icon className="w-6 h-6 text-teal-400 group-hover:text-black transition-colors" />
                    </div>
                    <h3 className="text-lg font-bold mb-3 uppercase tracking-wide">{ch.title}</h3>
                    <p className="text-sm text-white/40 leading-relaxed">{ch.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ──────────────────── */}
        <section id="about" className="py-32 bg-[#080d0b] border-t border-white/5">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="flex items-end justify-between mb-20 border-b border-white/5 pb-12 gap-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-teal-400 block mb-4">Field Reports</span>
                  <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-2">In Their <span className="text-teal-400">Words.</span></h2>
                </div>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { quote: "The Patagonia expedition changed my life. Not hyperbole — I genuinely made different career and family decisions in the weeks after. Meridian creates that kind of space.", name: "A. Fischer", origin: "Berlin · Software Engineer", exp: "Patagonia Wind Routes" },
                { quote: "I've done 11 expeditions with various companies. Meridian is the only one where the guide knows when to speak and when not to. That's rare and priceless.", name: "P. Nakamura", origin: "Osaka · Surgeon", exp: "Iceland Ice Shelf" },
                { quote: "My son and I did the Greenland coastal route. He's 14. He still talks about it. I'll never find a better investment of two weeks.", name: "D. Morel", origin: "Lyon · Architect", exp: "Greenland Coastal" },
              ].map((t, i) => (
                <Reveal key={i} delay={i * 0.12}>
                  <div className="group border border-white/5 rounded-2xl p-10 flex flex-col gap-6 hover:border-teal-500/20 transition-all duration-500 h-full">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-teal-400 text-teal-400" />)}
                    </div>
                    <p className="text-white/50 font-light leading-relaxed italic flex-1">{`"${t.quote}"`}</p>
                    <div className="border-t border-white/5 pt-6">
                      <div className="font-bold text-sm text-white uppercase tracking-widest">{t.name}</div>
                      <div className="text-xs text-white/25 tracking-widest mt-1">{t.origin}</div>
                      <div className="flex items-center gap-2 text-xs text-teal-400 mt-2"><MapPin className="w-3 h-3" />{t.exp}</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── GUIDES ────────────────────────── */}
        <section className="py-32 bg-[#0d1210] border-t border-white/5">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="mb-20">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-teal-400 block mb-4">Field Experts</span>
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase">The <span className="text-teal-400">Guides.</span></h2>
              </div>
            </Reveal>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { name: "Elin Larsen", spec: "Arctic & Polar", certs: ["IFMGA", "Wilderness First Responder"], exp: "14yr", routes: 41 },
                { name: "Marco Ferreira", spec: "South America", certs: ["UIAGM", "Search & Rescue"], exp: "11yr", routes: 29 },
                { name: "Priya Mehta", spec: "Himalaya & Hindu Kush", certs: ["UIAGM", "High Altitude Medicine"], exp: "9yr", routes: 23 },
                { name: "Jack O'Brien", spec: "Patagonia & Fjords", certs: ["NOLS", "Swift Water Rescue"], exp: "7yr", routes: 18 },
              ].map((g, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="group cursor-default">
                    <div className="aspect-[3/4] rounded-xl overflow-hidden bg-white/[0.02] border border-white/5 mb-6 flex items-end p-8 group-hover:border-teal-500/20 transition-colors duration-500 relative">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[5rem] font-black text-white/[0.03] uppercase">{g.name.split(" ").map(n => n[0]).join("")}</div>
                      <div className="relative z-10">
                        <div className="text-[9px] font-mono text-teal-400/60 mb-1">{g.routes} routes led</div>
                        <div className="text-[8px] font-bold uppercase tracking-widest text-white/20">{g.exp} field</div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold uppercase tracking-widest text-white mb-1">{g.name}</h3>
                      <p className="text-[10px] text-teal-400 uppercase tracking-wider mb-2">{g.spec}</p>
                      <div className="flex flex-wrap gap-2">{g.certs.map(c => <span key={c} className="text-[8px] font-bold uppercase tracking-widest px-2 py-1 border border-white/10 text-white/25">{c}</span>)}</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ─────────────────────────── */}
        <section id="contact" className="relative h-[80vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <Image src="https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&q=80&w=2400" alt="CTA" fill className="object-cover" />
            <div className="absolute inset-0 bg-[#0d1210]/70" />
          </div>
          <div className="relative z-10 text-center px-6">
            <Reveal>
              <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase mb-8">
                Answer The<br/><span className="text-teal-400">Call.</span>
              </h2>
              <p className="text-lg text-white/50 font-light max-w-md mx-auto mb-10">
                Applications for 2026 expeditions are now open. Limited to 8 per journey.
              </p>
              <button className="px-12 py-5 bg-teal-500 text-black font-bold rounded-full hover:bg-white transition-colors duration-500">
                Apply Now
              </button>
            </Reveal>
          </div>
        </section>
      </main>

      {/* ── FOOTER ──────────────────────────── */}
      <footer className="bg-[#080d0b] pt-24 pb-12 px-6">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Compass className="w-5 h-5 text-teal-400" />
              <span className="font-bold tracking-[0.2em] uppercase">Meridian</span>
            </div>
            <p className="text-sm text-white/30 leading-relaxed">Expedition storytelling and guided wilderness journeys since 2017.</p>
          </div>
          {[
            { title: "Explore", links: ["All Expeditions", "Past Journeys", "Photo Archive", "Stories"] },
            { title: "Plan", links: ["Apply", "Gear List", "Training Guide", "FAQ"] },
            { title: "Company", links: ["About", "Guides", "Safety", "Contact"] },
          ].map((col, i) => (
            <div key={i}>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-teal-400 mb-6">{col.title}</h4>
              <ul className="space-y-3 text-sm text-white/30">
                {col.links.map(l => <li key={l}><Link href="#contact" className="hover:text-white transition-colors">{l}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-[1400px] mx-auto pt-8 border-t border-white/5 text-[10px] font-bold uppercase tracking-widest text-white/20 flex justify-between">
          <span>© 2026 MERIDIAN EXPEDITIONS.</span>
          <span>INTO THE UNKNOWN.</span>
        </div>
      </footer>
    </div>
  )
}
