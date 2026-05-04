"use client";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Type, Sparkles, Zap, Menu, X, ArrowRight, Star, CheckCircle2, Users, Layers, Palette, Globe, Mail } from "lucide-react";
import "../premium.css";

const FEATURES = [
  { icon: <Sparkles className="w-6 h-6" />, title: "Motion Design", desc: "Scroll-linked kinetic typography that responds to user interaction in real-time." },
  { icon: <Layers className="w-6 h-6" />, title: "Variable Fonts", desc: "Dynamic weight, width, and slant axes animated fluidly across scroll positions." },
  { icon: <Palette className="w-6 h-6" />, title: "Brand Systems", desc: "Complete typographic identity systems from logotype to editorial layout." },
  { icon: <Globe className="w-6 h-6" />, title: "Web Performance", desc: "Subsetting, WOFF2 compression, and lazy loading for zero layout shift." },
  { icon: <Zap className="w-6 h-6" />, title: "Animation Runtime", desc: "60fps spring-based type animations with GPU-accelerated transforms." },
  { icon: <Type className="w-6 h-6" />, title: "Custom Typefaces", desc: "Bespoke font design for brands that need a unique voice." },
];

const TESTIMONIALS = [
  { name: "Alex Morgan", role: "Creative Director, Nike", quote: "Kinetic transformed our campaign typography. The scroll interactions are buttery smooth and conversion went up 23%." },
  { name: "Yuki Tanaka", role: "Head of Brand, Spotify", quote: "Finally a studio that understands type as a living system, not static assets. They changed how we think about motion." },
  { name: "Emma Laurent", role: "Founder, Figment Studio", quote: "The variable font system they built for us is years ahead. Our designers can't stop experimenting with it." },
];

const PRICING = [
  { name: "STARTER", price: "$4,900", period: "", desc: "Single project", features: ["Motion type system", "3 revisions", "Web implementation", "30-day support"], cta: "Get_Started" },
  { name: "STUDIO", price: "$12,500", period: "", desc: "Brand system", features: ["Full type identity", "Variable font", "Animation library", "90-day support", "Source files"], cta: "Start_Studio", featured: true },
  { name: "ENTERPRISE", price: "Custom", period: "", desc: "Ongoing partnership", features: ["Custom typeface", "Unlimited revisions", "Dedicated team", "SLA guarantee", "Annual license"], cta: "Contact_Us" },
];

const MARQUEE_WORDS = ["KINETIC", "TYPOGRAPHY", "MOTION", "DESIGN", "VARIABLE", "FONTS", "ANIMATION", "BRAND"];

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay }}>{children}</motion.div>;
}

export default function KineticMarqueePage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => { const h = () => setScrolled(window.scrollY > 50); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h); }, []);

  return (
    <div className="premium-theme min-h-screen bg-[#0a0a0a] text-white font-mono selection:bg-[#f97316] selection:text-black overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.015]" style={{ backgroundImage: `linear-gradient(rgba(249,115,22,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.1) 1px, transparent 1px)`, backgroundSize: "120px 120px" }} />

      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? "bg-[#0a0a0a]/90 backdrop-blur-xl py-4 border-b border-white/5" : "bg-transparent py-10"}`}>
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-3 text-xl font-black tracking-tighter">
            <div className="w-8 h-8 bg-[#f97316] rounded-sm flex items-center justify-center text-black"><Type className="w-4 h-4" /></div>
            <span className="group-hover:text-[#f97316] transition-colors">KINETIC // <span className="text-white/30">MARQUEE</span></span>
          </Link>
          <div className="hidden lg:flex items-center gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">
            {["Work", "Services", "Pricing", "Contact"].map(l => <Link key={l} href="#" className="hover:text-[#f97316] transition-colors">{l}</Link>)}
          </div>
          <button className="px-6 py-2.5 bg-[#f97316] text-black text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all hidden md:block">Start_Project</button>
          <button onClick={() => setMenuOpen(true)} className="lg:hidden text-white/60"><Menu className="w-6 h-6" /></button>
        </div>
      </nav>

      <AnimatePresence>{menuOpen && (
        <motion.div initial={{ opacity: 0, x: "100%" }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: "100%" }} className="fixed inset-0 z-[100] bg-[#0a0a0a] p-8 flex flex-col pt-32">
          <button onClick={() => setMenuOpen(false)} className="absolute top-10 right-8 text-white/40"><X className="w-10 h-10" /></button>
          {["Work", "Services", "Pricing", "Contact"].map(l => <Link key={l} href="#" onClick={() => setMenuOpen(false)} className="text-5xl font-black tracking-tighter uppercase mb-10">{l}</Link>)}
        </motion.div>
      )}</AnimatePresence>

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col justify-center pt-20">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 w-full relative z-10">
          <Reveal>
            <h1 className="text-7xl md:text-9xl lg:text-[11rem] font-black leading-[0.8] tracking-tighter uppercase mb-10">
              Type <br /> In <br /> <span className="text-[#f97316]">Motion.</span>
            </h1>
            <p className="max-w-xl text-lg text-white/30 leading-relaxed font-light uppercase tracking-widest italic mb-12">
              Kinetic typography studio. We make words move, brands breathe, and interfaces dance.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <button className="px-12 py-5 bg-[#f97316] text-black text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white transition-all shadow-[0_0_50px_rgba(249,115,22,0.2)]">View_Work</button>
              <button className="px-12 py-5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all">Start_Project</button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="py-12 border-y border-white/5 overflow-hidden">
        <motion.div animate={{ x: [0, -1920] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="flex gap-12 whitespace-nowrap">
          {[...MARQUEE_WORDS, ...MARQUEE_WORDS, ...MARQUEE_WORDS].map((w, i) => (
            <span key={i} className="text-7xl md:text-9xl font-black uppercase tracking-tighter text-white/[0.03] hover:text-[#f97316]/20 transition-colors">{w}</span>
          ))}
        </motion.div>
        <motion.div animate={{ x: [-1920, 0] }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className="flex gap-12 whitespace-nowrap mt-4">
          {[...MARQUEE_WORDS.reverse(), ...MARQUEE_WORDS, ...MARQUEE_WORDS].map((w, i) => (
            <span key={i} className="text-7xl md:text-9xl font-black uppercase tracking-tighter text-white/[0.03]">{w}</span>
          ))}
        </motion.div>
      </section>

      {/* FEATURES */}
      <section className="py-40 bg-[#0c0c0c]">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <Reveal><h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85] mb-6">What We <span className="text-[#f97316]">Do.</span></h2></Reveal>
          <Reveal delay={0.1}><p className="text-lg text-white/30 max-w-2xl mb-24 uppercase tracking-widest italic font-light">Full-service kinetic type from concept to production-ready code.</p></Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {FEATURES.map((f, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <div className="group p-10 bg-[#111] border border-white/5 hover:border-[#f97316]/30 rounded-3xl transition-all">
                  <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-[#f97316] mb-8 group-hover:bg-[#f97316] group-hover:text-black transition-all">{f.icon}</div>
                  <h3 className="text-xl font-black uppercase tracking-tighter mb-4 group-hover:text-[#f97316] transition-colors">{f.title}</h3>
                  <p className="text-sm text-white/30 leading-relaxed">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-40 bg-[#0a0a0a] border-y border-white/5">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <Reveal><h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85] mb-24">Client <span className="text-[#f97316]">Voices.</span></h2></Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="p-10 bg-[#111] border border-white/5 rounded-3xl h-full flex flex-col">
                  <div className="flex gap-1 mb-6">{[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 text-[#f97316] fill-[#f97316]" />)}</div>
                  <p className="text-base text-white/40 italic leading-relaxed flex-1 mb-8">&ldquo;{t.quote}&rdquo;</p>
                  <div className="pt-6 border-t border-white/5">
                    <div className="font-black uppercase text-sm">{t.name}</div>
                    <div className="text-[10px] text-white/20 uppercase tracking-widest">{t.role}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="py-40 bg-[#0c0c0c]">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <Reveal><h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-24 uppercase text-center">Clear <span className="text-[#f97316]">Pricing.</span></h2></Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {PRICING.map((p, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className={`group p-10 border rounded-3xl transition-all ${p.featured ? "bg-[#f97316]/5 border-[#f97316]/30 scale-105" : "bg-[#111] border-white/5 hover:border-[#f97316]/20"}`}>
                  <div className="text-[9px] font-bold text-[#f97316] uppercase tracking-widest mb-2">{p.name}</div>
                  <div className="text-4xl font-black mb-1">{p.price}<span className="text-lg text-white/30">{p.period}</span></div>
                  <p className="text-[10px] text-white/20 uppercase tracking-widest mb-8">{p.desc}</p>
                  <div className="space-y-4 pt-8 border-t border-white/5">
                    {p.features.map((f, j) => <div key={j} className="flex items-center gap-3 text-[10px] text-white/40"><CheckCircle2 className="w-3.5 h-3.5 text-[#f97316]" />{f}</div>)}
                  </div>
                  <button className={`mt-8 w-full py-3 text-[10px] font-black uppercase tracking-widest transition-all ${p.featured ? "bg-[#f97316] text-black hover:bg-white" : "border border-white/10 hover:bg-[#f97316] hover:text-black hover:border-transparent"}`}>{p.cta}</button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT / CTA */}
      <section className="py-40 bg-[#0a0a0a] text-center">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <Reveal>
            <h2 className="text-6xl md:text-9xl font-black tracking-tighter uppercase mb-12">Let&apos;s <span className="text-[#f97316]">Move.</span></h2>
            <p className="max-w-xl mx-auto text-sm text-white/30 leading-relaxed font-light mb-16 uppercase tracking-widest italic">Ready to bring your type to life? Tell us about your project.</p>
            <div className="max-w-md mx-auto flex gap-4">
              <input type="email" placeholder="your@email.com" className="flex-1 px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-sm font-mono focus:border-[#f97316] focus:outline-none" />
              <button className="px-8 py-4 bg-[#f97316] text-black text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all rounded-xl">Send</button>
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="bg-[#0a0a0a] border-t border-white/5 py-32 px-6 md:px-12">
        <div className="max-w-[1500px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-24">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-3 text-xl font-black tracking-tighter mb-10"><div className="w-8 h-8 bg-[#f97316] text-black rounded-sm flex items-center justify-center"><Type className="w-4 h-4" /></div><span>KINETIC // MARQUEE</span></Link>
            <p className="text-[11px] text-white/15 uppercase tracking-[0.2em] max-w-sm leading-relaxed italic">Kinetic typography studio. Type in motion.</p>
          </div>
          <div><h4 className="text-[10px] font-black uppercase tracking-widest mb-10 text-[#f97316]">Studio</h4><ul className="space-y-5 text-[10px] font-bold text-white/20 uppercase tracking-widest">{["Work", "Services", "Process", "Pricing"].map(l => <li key={l}><Link href="#">{l}</Link></li>)}</ul></div>
          <div><h4 className="text-[10px] font-black uppercase tracking-widest mb-10 text-[#f97316]">Social</h4><ul className="space-y-5 text-[10px] font-bold text-white/20 uppercase tracking-widest">{["Instagram", "Dribbble", "Twitter", "GitHub"].map(l => <li key={l}><Link href="#">{l}</Link></li>)}</ul></div>
        </div>
        <div className="max-w-[1500px] mx-auto mt-32 pt-16 border-t border-white/5 text-center text-[9px] font-bold text-white/10 uppercase tracking-widest">&copy; 2026 KINETIC MARQUEE</div>
      </footer>
    </div>
  );
}
