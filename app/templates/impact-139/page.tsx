"use client";
// @ts-nocheck
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Dumbbell, ArrowRight, Menu, Star, MapPin, Clock, Users, Flame, ChevronRight, Heart, Trophy, Target, Zap, CheckCircle2 } from "lucide-react"
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

const PROGRAMS = [
  { title: "FORGE", type: "Strength", duration: "60 min", level: "Advanced", desc: "Heavy compound lifts with progressive overload programming.", img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800" },
  { title: "BLITZ", type: "HIIT", duration: "45 min", level: "All Levels", desc: "Heart-rate driven interval training for maximum caloric burn.", img: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=800" },
  { title: "RECOVER", type: "Mobility", duration: "30 min", level: "All Levels", desc: "Active recovery with guided stretching and foam rolling protocols.", img: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800" },
]

const FEATURES = [
  { icon: Target, title: "Personal Programming", desc: "Every member gets a custom training plan based on their goals and baseline assessment." },
  { icon: Flame, title: "Heart Rate Zones", desc: "Live biometric tracking during every session. Train smarter, not just harder." },
  { icon: Trophy, title: "Progress Tracking", desc: "Monthly body composition scans, strength benchmarks, and recovery metrics." },
  { icon: Users, title: "Community Driven", desc: "Small classes of 12 max. You're not a number — you're part of a tribe." },
]

const PLANS = [
  { name: "Essential", price: "$79", desc: "3 sessions/week", features: ["3x Group Sessions", "Open Gym Access", "Monthly Check-in", "Community App"] },
  { name: "Performance", price: "$129", desc: "Unlimited sessions", features: ["Unlimited Sessions", "Monthly Body Scan", "Nutrition Guidance", "Recovery Suite", "Priority Booking"], popular: true },
  { name: "Elite", price: "$249", desc: "1:1 coaching", features: ["Everything in Performance", "2x PT Sessions/week", "Custom Meal Plans", "WhatsApp Support", "Quarterly Assessment"] },
]


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function ApexFitnessPage() {
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
    <div className="bg-[#0a0a0a] text-white font-sans min-h-screen selection:bg-lime-500 selection:text-black overflow-x-hidden">

      {/* ── NAVBAR ────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? "bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-lime-500/10 py-4" : "bg-transparent py-8"}`}>
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
                <div className="w-10 h-10 rounded-lg bg-lime-500 flex items-center justify-center -skew-x-6">
                  <Dumbbell className="w-5 h-5 text-black" />
                </div>
                <span className="text-xl font-black tracking-tight uppercase">Apex</span>
              </>
            )}
          </Link>
          <div className="hidden lg:flex gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
            {["Programs", "Pricing", "Team", "Contact"].map(l => (
              <a key={l} href={`#${l.toLowerCase().replace(" ", "")}`} className="hover:text-lime-400 transition-colors">{l}</a>
            ))}
          </div>
          <button onClick={() => document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})} className="hidden md:block px-8 py-3 bg-lime-500 text-black text-[10px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-white transition-colors duration-500">
            Start Free Trial
          </button>
          <Sheet>
            <SheetTrigger className="lg:hidden"><Menu className="w-6 h-6 text-white" /></SheetTrigger>
            <SheetContent side="right" className="bg-[#0a0a0a] border-lime-500/10 p-12">
              <div className="flex flex-col gap-8 mt-16">
                {["Programs", "Pricing", "Team", "Contact"].map(l => (
                  <a key={l} href={`#${l.toLowerCase().replace(" ", "")}`} className="text-3xl font-bold uppercase tracking-widest hover:text-lime-400 transition-colors">{l}</a>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      <main>
        {/* ── HERO ────── */}
        <section id="hero" className="relative h-[110vh] min-h-[800px] flex items-center overflow-hidden">
          <motion.div style={{ y: heroY }} className="absolute inset-0">
            <Image src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=2400" alt="Gym" fill className="object-cover opacity-40" priority />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent" />
          </motion.div>
          <motion.div style={{ opacity: heroOpacity }} className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 w-full">
            <Reveal>
              <div className="flex items-center gap-4 mb-8">
                <Flame className="w-4 h-4 text-lime-500" />
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-lime-400">Performance Training Studio</span>
              </div>
            </Reveal>
            <Reveal delay={0.1} y={70}>
              <h1 className="text-7xl md:text-[8rem] lg:text-[11rem] font-black tracking-tighter leading-[0.8] uppercase mb-10">{c?.heroHeadline ?? <>
                Train<br/><span className="text-lime-500">Harder.</span>
              </>}</h1>
            </Reveal>
            <Reveal delay={0.25}>
              <p className="text-xl text-white/40 font-light max-w-lg leading-relaxed mb-10">{c?.heroSubline ?? fd?.tagline ?? <>
                Science-backed programming. Expert coaching. A community that pushes you further than you'd go alone.
              </>}</p>
            </Reveal>
            <Reveal delay={0.35}>
              <button onClick={() => document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})} className="px-10 py-5 bg-lime-500 text-black font-bold rounded-full hover:bg-white transition-colors duration-500 flex items-center gap-3">
                <Zap className="w-5 h-5" /> Start Your Free Week
              </button>
            </Reveal>
          </motion.div>
        </section>

        {/* ── STATS ──── */}
        <section id="equipe" className="py-16 bg-lime-500 text-black">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { v: "2,400+", l: "Members" },
              { v: "94%", l: "Retention Rate" },
              { v: "12", l: "Expert Coaches" },
              { v: "6", l: "Programs" },
            ].map((s, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="text-center">
                  <div className="text-3xl font-black mb-1">{s.v}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-black/60">{s.l}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── PROGRAMS ──── */}
        <section id="programs" className="py-32 bg-[#0a0a0a]">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="mb-20">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-lime-400 block mb-4">Programs</span>
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase">Find Your <span className="text-lime-500">Program.</span></h2>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {PROGRAMS.map((p, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="group cursor-pointer">
                    <div className="relative aspect-[3/4] overflow-hidden rounded-xl mb-6">
                      <ParallaxImg src={p.img} alt={p.title} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute top-6 left-6 flex gap-2">
                        <span className="px-3 py-1 bg-lime-500 text-black text-[10px] font-bold uppercase tracking-widest rounded-full">{p.type}</span>
                        <span className="px-3 py-1 bg-black/50 backdrop-blur-md text-white/70 text-[10px] font-bold uppercase tracking-widest rounded-full">{p.level}</span>
                      </div>
                      <div className="absolute bottom-6 left-6 right-6">
                        <h3 className="text-3xl font-black uppercase tracking-tight mb-2">{p.title}</h3>
                        <p className="text-sm text-white/50 mb-3">{p.desc}</p>
                        <div className="flex items-center gap-4 text-xs text-white/40">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {p.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHY APEX ──── */}
        <section id="tarifs" className="py-32 bg-[#0d0d0d]">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="text-center mb-24">
                <h2 className="text-5xl md:text-6xl font-black tracking-tighter uppercase">Why <span className="text-lime-500">Apex?</span></h2>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {FEATURES.map((f, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <div className="group p-8 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-lime-500/30 transition-all duration-500">
                    <div className="flex items-start gap-6">
                      <div className="w-14 h-14 rounded-xl bg-lime-500/10 border border-lime-500/20 flex items-center justify-center shrink-0 group-hover:bg-lime-500 group-hover:border-lime-500 transition-all duration-500">
                        <f.icon className="w-6 h-6 text-lime-400 group-hover:text-black transition-colors" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-3 uppercase">{f.title}</h3>
                        <p className="text-sm text-white/40 leading-relaxed">{f.desc}</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRICING ──── */}
        <section id="pricing" className="py-32 bg-[#0a0a0a]">
          <div className="max-w-[1000px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="text-center mb-24">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-lime-400 block mb-4">Membership</span>
                <h2 className="text-5xl md:text-6xl font-black tracking-tighter uppercase">Choose Your <span className="text-lime-500">Plan.</span></h2>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PLANS.map((p, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className={`p-8 rounded-2xl border h-full flex flex-col ${p.popular ? "bg-lime-500/5 border-lime-500/30 relative" : "bg-white/[0.02] border-white/5"}`}>
                    {p.popular && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-lime-500 text-black text-[10px] font-bold uppercase tracking-widest rounded-full">Most Popular</div>}
                    <h3 className="text-xl font-bold uppercase mb-1">{p.name}</h3>
                    <div className="text-4xl font-black text-lime-400 mb-1">{p.price}<span className="text-lg text-white/30 font-normal">/mo</span></div>
                    <p className="text-sm text-white/40 mb-6">{p.desc}</p>
                    <ul className="space-y-3 flex-1 mb-8">
                      {p.features.map((f, j) => (
                        <li key={j} className="flex items-center gap-2 text-sm text-white/60">
                          <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0" /> {f}
                        </li>
                      ))}
                    </ul>
                    <button onClick={() => document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})} className={`w-full py-4 font-bold rounded-full transition-all duration-500 ${p.popular ? "bg-lime-500 text-black hover:bg-white" : "bg-white/5 text-white hover:bg-white/10"}`}>
                      Start Free Week
                    </button>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ──────── */}
        <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <Image src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=2400" alt="CTA" fill className="object-cover" />
            <div className="absolute inset-0 bg-black/60" />
          </div>
          <div className="relative z-10 text-center px-6">
            <Reveal>
              <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase mb-8">
                Your First<br/>Week Is <span className="text-lime-500">Free.</span>
              </h2>
              <button onClick={() => document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})} className="px-12 py-5 bg-lime-500 text-black font-bold rounded-full hover:bg-white transition-colors duration-500">
                Claim Your Trial
              </button>
            </Reveal>
          </div>
        </section>

        {/* ── TEAM ──── */}
        <section id="team" className="py-32 bg-[#0d0d0d] border-t border-white/5">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="text-center mb-24">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-lime-400 block mb-4">Elite Coaches</span>
                <h2 className="text-5xl md:text-6xl font-black tracking-tighter uppercase">Meet the <span className="text-lime-500">Coaches.</span></h2>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: "Marcus Vane", role: "Strength & Conditioning Lead", bio: "Former Division 1 strength coach with 10+ years training elite athletes.", initials: "MV" },
                { name: "Sarah Chen", role: "HIIT & Athletic Cardio Lead", bio: "Biomedical Science graduate specializing in heart-rate zone optimization.", initials: "SC" },
                { name: "Dimitri Belov", role: "Mobility & Recovery Specialist", bio: "Certified physical therapist assistant focusing on joint health and longevity.", initials: "DB" },
              ].map((c, i) => (
                <Reveal key={c.name} delay={i * 0.1}>
                  <div className="p-8 bg-[#0a0a0a] border border-white/5 rounded-2xl flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-lime-500 rounded-xl flex items-center justify-center -skew-x-6 mb-6">
                      <span className="text-black font-black text-xl">{c.initials}</span>
                    </div>
                    <h3 className="text-xl font-bold uppercase mb-2">{c.name}</h3>
                    <div className="text-xs text-lime-400 font-bold uppercase tracking-widest mb-4">{c.role}</div>
                    <p className="text-sm text-white/40 leading-relaxed">{c.bio}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ──── */}
        <section className="py-32 bg-[#0a0a0a] border-t border-white/5">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="text-center mb-24">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-lime-400 block mb-4">Reviews</span>
                <h2 className="text-5xl md:text-6xl font-black tracking-tighter uppercase">What Our Members <span className="text-lime-500">Say.</span></h2>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { quote: "Apex completely changed my approach to fitness. The heart rate zone tracking keeps me accountable every single workout.", author: "James L.", plan: "Performance Member" },
                { quote: "Small class sizes mean you get personal coach attention even in a group environment. Worth every single cent.", author: "Elena R.", plan: "Elite Member" },
                { quote: "The community is extremely supportive, and the mobility programming has cured my chronic lower back issues.", author: "Marcus D.", plan: "Essential Member" },
              ].map((t, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="p-8 bg-[#0d0d0d] border border-white/5 rounded-2xl flex flex-col justify-between h-full hover:border-lime-500/20 transition-all duration-300">
                    <p className="text-white/60 leading-relaxed italic mb-8">"{t.quote}"</p>
                    <div>
                      <div className="font-bold text-sm text-white uppercase">{t.author}</div>
                      <div className="text-xs text-lime-400 font-medium mt-1 uppercase tracking-wider">{t.plan}</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── CONTACT ──────── */}
        <section id="contact" className="py-32 bg-[#0a0a0a] border-t border-white/5">
          <div className="max-w-[800px] mx-auto px-6 text-center">
            <Reveal>
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-lime-400 block mb-4">Connect</span>
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter mb-12 uppercase">Get Your <span className="text-lime-500">Free Week.</span></h2>
            </Reveal>
            <Reveal delay={0.15}>
              {contactSubmitted ? (
                <div className="p-12 bg-[#0d0d0d] rounded-2xl border border-lime-500/30 flex flex-col items-center justify-center">
                  <CheckCircle2 className="w-12 h-12 text-lime-400 mb-4" />
                  <p className="text-xl font-bold text-white">Merci, nous vous répondrons sous 24h.</p>
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); setContactSubmitted(true); }} className="space-y-4 max-w-md mx-auto text-left">
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-white/50 mb-2">Name</label>
                    <input required type="text" placeholder="Your Name" className="w-full px-5 py-3.5 bg-[#0d0d0d] border border-white/10 rounded-xl text-sm focus:outline-none focus:border-lime-500 transition-colors text-white" />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-white/50 mb-2">Email</label>
                    <input required type="email" placeholder="you@example.com" className="w-full px-5 py-3.5 bg-[#0d0d0d] border border-white/10 rounded-xl text-sm focus:outline-none focus:border-lime-500 transition-colors text-white" />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-white/50 mb-2">Message</label>
                    <textarea required rows={4} placeholder="Tell us about your training history and goals..." className="w-full px-5 py-3.5 bg-[#0d0d0d] border border-white/10 rounded-xl text-sm focus:outline-none focus:border-lime-500 transition-colors text-white" />
                  </div>
                  <button type="submit" className="w-full py-4 bg-lime-500 text-black font-bold rounded-full hover:bg-white transition-colors duration-300">
                    Claim Free Week
                  </button>
                </form>
              )}
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="bg-[#050505] pt-24 pb-12 px-6">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-lime-500 flex items-center justify-center -skew-x-6"><Dumbbell className="w-4 h-4 text-black" /></div>
              <span className="font-black tracking-tight uppercase">Apex</span>
            </div>
            <p className="text-sm text-white/30 leading-relaxed">Performance training studio for serious athletes.</p>
          </div>
          {[
            { title: "Studio", links: ["Programs", "Pricing", "Team", "Contact"] },
            { title: "Follow", links: ["Instagram", "TikTok", "YouTube"] },
          ].map((col, i) => (
            <div key={i}>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-lime-400 mb-6">{col.title}</h4>
              <ul className="space-y-3 text-sm text-white/30">
                {col.links.map(l => {
                  let href = "#";
                  if (l === "Programs") href = "#programs";
                  if (l === "Pricing") href = "#pricing";
                  if (l === "Team") href = "#team";
                  if (l === "Contact") href = "#contact";
                  return <li key={l}><Link href={href} className="hover:text-white transition-colors">{l}</Link></li>;
                })}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-[1200px] mx-auto pt-8 border-t border-white/5 text-[10px] font-bold uppercase tracking-widest text-white/20 flex flex-col sm:flex-row justify-between gap-4">
          <span>© 2026 APEX FITNESS. TRAIN HARDER.</span>
          <div className="flex gap-6">
            <Link href="#contact" className="hover:text-white transition-colors">Mentions légales</Link>
            <Link href="#contact" className="hover:text-white transition-colors">Confidentialité</Link>
            <Link href="#contact" className="hover:text-white transition-colors">CGU</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
