"use client";
// @ts-nocheck
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Leaf, ArrowRight, Menu, TreePine, Recycle, Droplets, Sun, Heart, Award, BarChart3, ChevronRight, Globe, Users, CheckCircle2 } from "lucide-react"
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

const IMPACT = [
  { value: "2.4M", label: "Tons CO₂ Offset", icon: Leaf },
  { value: "180K", label: "Trees Planted", icon: TreePine },
  { value: "94%", label: "Waste Diverted", icon: Recycle },
  { value: "12", label: "Countries Active", icon: Globe },
]

const PROGRAMS = [
  { icon: TreePine, title: "Reforestation", desc: "Large-scale tree planting programs in deforested regions with indigenous community partnerships.", img: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=800" },
  { icon: Droplets, title: "Ocean Cleanup", desc: "AI-guided autonomous systems removing plastic from waterways before it reaches open ocean.", img: "https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?auto=format&fit=crop&q=80&w=800" },
  { icon: Sun, title: "Clean Energy", desc: "Community solar installations providing renewable energy to underserved populations.", img: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=800" },
]

const PLANS = [
  { name: "Individual", price: "$9", desc: "Personal carbon offset subscription.", features: ["Monthly CO₂ offset", "Impact dashboard", "Quarterly reports", "Community access"] },
  { name: "Business", price: "$99", desc: "For companies serious about sustainability.", features: ["Team offsetting", "Sustainability badges", "API access", "Custom reports", "Priority support"], popular: true },
  { name: "Enterprise", price: "Custom", desc: "Full-scale corporate sustainability.", features: ["Unlimited seats", "White-label reports", "ESG integration", "Dedicated advisor", "Carbon audit"] },
]


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function VerdantImpactPage() {
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
    <div className="bg-[#f6faf4] text-[#1a2e1a] font-sans min-h-dvh selection:bg-emerald-500 selection:text-white overflow-x-hidden">

      {/* ── NAVBAR ────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? "bg-[#f6faf4]/90 backdrop-blur-xl border-b border-emerald-600/10 py-4" : "bg-transparent py-8"}`}>
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
            <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">Verdant</span>
          </>
            )}</Link>
          <div className="hidden lg:flex gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-[#1a2e1a]/40">
            {["Impact", "Programs", "Pricing", "About", "Contact"].map(l => (
              <a key={l} href={`#${l.toLowerCase().replace(" ", "")}`} className="hover:text-emerald-600 transition-colors">{l}</a>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})} className="hidden md:block px-6 py-2.5 text-[#1a2e1a]/60 text-[10px] font-bold uppercase tracking-widest hover:text-emerald-600 transition-colors">Log In</button>
            <button onClick={() => document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})} className="hidden md:block px-6 py-2.5 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-emerald-700 transition-colors">Get Started</button>
            <Sheet>
              <SheetTrigger className="lg:hidden"><Menu className="w-6 h-6" /></SheetTrigger>
              <SheetContent side="right" className="bg-[#f6faf4] p-12">
                <div className="flex flex-col gap-8 mt-16">
                  {["Impact", "Programs", "Pricing", "About", "Contact"].map(l => (
                    <a key={l} href={`#${l.toLowerCase().replace(" ", "")}`} className="text-2xl font-light uppercase tracking-widest hover:text-emerald-600 transition-colors">{l}</a>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      <main>
        {/* ── HERO ────────── */}
        <section id="hero" className="relative h-[110vh] min-h-[800px] flex items-end overflow-hidden">
          <motion.div style={{ y: heroY }} className="absolute inset-0">
            <Image src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=2400" alt="Forest" fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-[#f6faf4] via-[#f6faf4]/20 to-transparent" />
          </motion.div>
          <motion.div style={{ opacity: heroOpacity }} className="relative z-10 max-w-[1400px] w-full mx-auto px-6 md:px-12 pb-24">
            <Reveal>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-[1px] w-12 bg-emerald-600" />
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-emerald-600">Climate Action Platform</span>
              </div>
            </Reveal>
            <Reveal delay={0.15} y={60}>
              <h1 className="text-6xl md:text-8xl lg:text-[9rem] font-black tracking-tighter leading-[0.85] mb-8">{c?.heroHeadline ?? <>
                Offset<br/>Your <span className="text-emerald-600">Impact.</span>
              </>}</h1>
            </Reveal>
            <Reveal delay={0.3}>
              <p className="max-w-lg text-lg text-[#1a2e1a]/50 font-light leading-relaxed mb-8">{c?.heroSubline ?? fd?.tagline ?? <>
                Measurable climate action for individuals and businesses. Track your carbon footprint, offset with verified projects.
              </>}</p>
              <button onClick={() => document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})} className="px-8 py-4 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-emerald-700 transition-colors">
                Offset Now
              </button>
            </Reveal>
          </motion.div>
        </section>

        {/* ── IMPACT STATS ──── */}
        <section id="impact" className="py-20 bg-emerald-600 text-white">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-8">
            {IMPACT.map((s, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="text-center">
                  <s.icon className="w-6 h-6 mx-auto mb-3 text-white/60" />
                  <div className="text-3xl md:text-4xl font-black mb-1">{s.value}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-white/60">{s.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── PROGRAMS ──────── */}
        <section id="programs" className="py-32 bg-[#f6faf4]">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="text-center mb-24">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-emerald-600 block mb-4">Our Programs</span>
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter">Where Your Money <span className="text-emerald-600">Goes.</span></h2>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {PROGRAMS.map((p, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="group cursor-pointer">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-xl mb-6">
                      <ParallaxImg src={p.img} alt={p.title} />
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-emerald-600/10 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 transition-colors duration-500">
                        <p.icon className="w-5 h-5 text-emerald-600 group-hover:text-white transition-colors" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2 group-hover:text-emerald-600 transition-colors">{p.title}</h3>
                        <p className="text-sm text-[#1a2e1a]/40 leading-relaxed">{p.desc}</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRICING ────────── */}
        <section id="pricing" className="py-32 bg-white">
          <div className="max-w-[1000px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="text-center mb-24">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-emerald-600 block mb-4">Pricing</span>
                <h2 className="text-5xl md:text-6xl font-black tracking-tighter">Start Your <span className="text-emerald-600">Journey.</span></h2>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PLANS.map((p, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className={`p-8 rounded-2xl border h-full flex flex-col ${p.popular ? "bg-emerald-50 border-emerald-600/30 relative" : "bg-[#f6faf4] border-emerald-600/10"}`}>
                    {p.popular && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-full">Best Value</div>}
                    <h3 className="text-xl font-bold mb-2">{p.name}</h3>
                    <div className="text-4xl font-black text-emerald-600 mb-2">{p.price}<span className="text-lg text-[#1a2e1a]/30 font-normal">{p.price !== "Custom" ? "/mo" : ""}</span></div>
                    <p className="text-sm text-[#1a2e1a]/40 mb-6">{p.desc}</p>
                    <ul className="space-y-3 flex-1 mb-8">
                      {p.features.map((f, j) => (
                        <li key={j} className="flex items-center gap-2 text-sm text-[#1a2e1a]/60">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {f}
                        </li>
                      ))}
                    </ul>
                    <button onClick={() => document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})} className={`w-full py-4 font-bold rounded-full transition-all duration-500 ${p.popular ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-emerald-600/10 text-emerald-700 hover:bg-emerald-600/20"}`}>
                      {p.price === "Custom" ? "Contact Us" : "Start Free"}
                    </button>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ──────────── */}
        <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <Image src="https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=2400" alt="CTA" fill className="object-cover" />
            <div className="absolute inset-0 bg-emerald-900/60" />
          </div>
          <div className="relative z-10 text-center text-white px-6">
            <Reveal>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
                The Planet<br/>Can't <span className="text-emerald-300">Wait.</span>
              </h2>
              <button onClick={() => document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})} className="px-12 py-5 bg-white text-emerald-800 font-bold rounded-full hover:bg-emerald-300 transition-colors duration-500">
                Take Action Today
              </button>
            </Reveal>
          </div>
        </section>

        {/* ── ABOUT ────────── */}
        <section id="about" className="py-32 bg-[#f0f7ef] border-t border-emerald-600/5">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <Reveal>
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                  <ParallaxImg src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1200" alt="Sustainability work" />
                </div>
              </Reveal>
              <div>
                <Reveal delay={0.2}>
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-emerald-600 block mb-4">Our DNA</span>
                  <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6">{c?.aboutTitle ?? fd?.businessName ?? <>Restoring Balance to the Planet.</>}</h2>
                  <p className="text-sm text-[#1a2e1a]/60 leading-relaxed mb-6">{c?.aboutText ?? <>
                    Founded in 2021, Verdant was built on a simple premise: climate action should be transparent, accessible, and highly measurable. We partner with local communities and leverage cutting-edge technology to verify every ton of carbon offset.
                  </>}</p>
                  <p className="text-sm text-[#1a2e1a]/60 leading-relaxed">
                    By combining community-led reforestation with high-tech ocean reclamation, we ensure your contributions create long-term ecological resilience.
                  </p>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ──── */}
        <section id="tarifs" className="py-32 bg-white border-t border-emerald-600/5">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="text-center mb-24">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-emerald-600 block mb-4">Testimonials</span>
                <h2 className="text-5xl md:text-6xl font-black tracking-tighter">Trusted by Earth Advocates.</h2>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { quote: "Verdant made our corporate ESG reporting completely seamless. The live APIs allow us to display our real-time offset directly to our customers.", author: "Sarah Jenkins", role: "Sustainability Lead · NovaRetail" },
                { quote: "I've subscribed to the Individual plan for two years. The quarterly reports are incredibly detailed, showing exact GPS coordinates of the trees planted.", author: "David Vance", role: "Subscriber since 2024" },
                { quote: "Their focus on indigenous community partnerships is what sets them apart. This isn't just about carbon; it's about social equity.", author: "Dr. Aris Thorne", role: "Climate Researcher · Earth Institute" },
              ].map((t, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="p-8 bg-[#f6faf4] border border-emerald-600/5 rounded-2xl flex flex-col justify-between h-full hover:border-emerald-600/20 transition-all duration-300">
                    <p className="text-[#1a2e1a]/60 leading-relaxed italic mb-8">"{t.quote}"</p>
                    <div>
                      <div className="font-bold text-sm text-[#1a2e1a]">{t.author}</div>
                      <div className="text-xs text-emerald-600 font-medium mt-1">{t.role}</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── CONTACT ────────── */}
        <section id="contact" className="py-32 bg-[#f6faf4] border-t border-emerald-600/10">
          <div className="max-w-[800px] mx-auto px-6 text-center">
            <Reveal>
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-emerald-600 block mb-4">Get In Touch</span>
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter mb-12">Start Your Climate Action.</h2>
            </Reveal>
            <Reveal delay={0.15}>
              {contactSubmitted ? (
                <div className="p-12 bg-white rounded-3xl border border-emerald-600/20 shadow-sm flex flex-col items-center justify-center">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mb-4" />
                  <p className="text-xl font-bold text-[#1a2e1a]">Merci, nous vous répondrons sous 24h.</p>
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); setContactSubmitted(true); }} className="space-y-4 max-w-md mx-auto text-left">
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-[#1a2e1a]/50 mb-2">Name</label>
                    <input required type="text" placeholder="John Doe" className="w-full px-5 py-3.5 bg-white border border-emerald-600/10 rounded-xl text-sm focus:outline-none focus:border-emerald-600 transition-colors text-[#1a2e1a]" />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-[#1a2e1a]/50 mb-2">Email</label>
                    <input required type="email" placeholder="john@example.com" className="w-full px-5 py-3.5 bg-white border border-emerald-600/10 rounded-xl text-sm focus:outline-none focus:border-emerald-600 transition-colors text-[#1a2e1a]" />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-[#1a2e1a]/50 mb-2">Message</label>
                    <textarea required rows={4} placeholder="How can we help your business offset carbon?" className="w-full px-5 py-3.5 bg-white border border-emerald-600/10 rounded-xl text-sm focus:outline-none focus:border-emerald-600 transition-colors text-[#1a2e1a]" />
                  </div>
                  <button type="submit" className="w-full py-4 bg-emerald-600 text-white font-bold rounded-full hover:bg-emerald-700 transition-colors duration-300">
                    Send Message
                  </button>
                </form>
              )}
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="bg-[#1a2e1a] text-white pt-24 pb-12 px-6">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Leaf className="w-5 h-5 text-emerald-400" />
              <span className="font-bold tracking-tight">Verdant</span>
            </div>
            <p className="text-sm text-white/30 leading-relaxed">Measurable climate action for a sustainable future.</p>
          </div>
          {[
            { title: "Platform", links: ["Impact Dashboard", "Programs", "For Business", "API"] },
            { title: "Learn", links: ["Carbon 101", "Blog", "Research", "Partners"] },
            { title: "Company", links: ["About", "Careers", "Press", "Contact"] },
          ].map((col, i) => (
            <div key={i}>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-400 mb-6">{col.title}</h4>
              <ul className="space-y-3 text-sm text-white/30">
                {col.links.map(l => {
                  let href = "#";
                  if (l === "About") href = "#about";
                  if (l === "Contact") href = "#contact";
                  if (l === "Programs") href = "#programs";
                  return <li key={l}><Link href={href} className="hover:text-white transition-colors">{l}</Link></li>;
                })}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-[1200px] mx-auto pt-8 border-t border-white/10 text-[10px] font-bold uppercase tracking-widest text-white/20 flex flex-col sm:flex-row justify-between gap-4">
          <span>© 2026 VERDANT IMPACT. B-CORP CERTIFIED</span>
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
