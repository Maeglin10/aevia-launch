"use client";
import { motion, useInView, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Palette, Image, Grid3X3, Menu, X, ArrowRight, Camera, Eye, Layers, Monitor, Figma, Award, Pen, Globe, Heart, Aperture } from "lucide-react";
import "../premium.css";

const MANIFESTS = {
  hero: { projects: "240+", clients: "90", awards: "28", status: "STUDIO_OPEN" },
  portfolio: [
    { id: "solaris", title: "SOLARIS // IDENTITY", client: "Solaris Energy", category: "BRANDING", year: "2026", desc: "Complete visual identity for a solar energy startup — logo, color system, motion guidelines, and a 200-page investor deck." },
    { id: "meridian", title: "MERIDIAN // PLATFORM", client: "Meridian Health", category: "PRODUCT", year: "2025", desc: "End-to-end design of a telehealth platform — patient dashboard, doctor portal, mobile app, and design system with 400+ components." },
    { id: "vortex", title: "VORTEX // CAMPAIGN", client: "Adidas Originals", category: "CAMPAIGN", year: "2025", desc: "Global digital campaign across 12 markets — art direction, motion assets, social templates, and interactive landing experience." },
    { id: "terra", title: "TERRA // EDITORIAL", client: "National Geographic", category: "EDITORIAL", year: "2024", desc: "Interactive long-form feature for NatGeo's climate series — scroll-driven data visualizations, custom maps, and ambient soundscapes." },
    { id: "prism", title: "PRISM // PACKAGING", client: "Prism Cosmetics", category: "PACKAGING", year: "2024", desc: "Luxury packaging system for a 24-SKU cosmetics line — structural design, material sourcing, and sustainability-first production." },
  ],
  services: [
    { name: "BRAND // STRATEGY", items: ["Identity Systems", "Naming & Verbal", "Guidelines", "Brand Audits"] },
    { name: "DIGITAL // PRODUCT", items: ["UI/UX Design", "Design Systems", "Prototyping", "Accessibility"] },
    { name: "ART // DIRECTION", items: ["Campaigns", "Photography", "Motion", "Editorial"] },
  ],
  recognition: [
    { award: "D&AD", count: "6×" },
    { award: "AWWWARDS SOTD", count: "14×" },
    { award: "CANNES LIONS", count: "3×" },
    { award: "RED DOT", count: "5×" },
  ],
};

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] }}>{children}</motion.div>;
}

function MagneticBtn({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 20 }), sy = useSpring(y, { stiffness: 300, damping: 20 });
  const ref = useRef<HTMLButtonElement>(null);
  return <motion.button ref={ref} style={{ x: sx, y: sy }} onMouseMove={(e) => { const r = ref.current?.getBoundingClientRect(); if (r) { x.set((e.clientX - r.left - r.width / 2) * 0.4); y.set((e.clientY - r.top - r.height / 2) * 0.4); }}} onMouseLeave={() => { x.set(0); y.set(0); }} className={className}>{children}</motion.button>;
}

export default function StudioVersaPage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredWork, setHoveredWork] = useState<string | null>(null);
  useEffect(() => { const h = () => setScrolled(window.scrollY > 50); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h); }, []);

  return (
    <div className="premium-theme min-h-screen bg-[#faf8f5] text-[#1a1a1a] font-mono selection:bg-[#e07a32] selection:text-white overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.02]" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)`, backgroundSize: "80px 80px" }} />

      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? "bg-[#faf8f5]/90 backdrop-blur-xl py-4 border-b border-black/5" : "bg-transparent py-10"}`}>
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-3 text-xl font-black tracking-tighter">
            <div className="w-8 h-8 bg-[#e07a32] rounded-full flex items-center justify-center text-white"><Palette className="w-4 h-4" /></div>
            <span className="group-hover:text-[#e07a32] transition-colors">STUDIO // <span className="text-black/30">VERSA</span></span>
          </Link>
          <div className="hidden lg:flex items-center gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-black/30">
            {["Work", "Services", "Studio", "Contact"].map(l => <Link key={l} href="#" className="hover:text-[#e07a32] transition-colors">{l}</Link>)}
          </div>
          <div className="flex items-center gap-6">
            <MagneticBtn className="px-6 py-2.5 bg-[#1a1a1a] text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#e07a32] transition-all">Start_Project</MagneticBtn>
            <button onClick={() => setMenuOpen(true)} className="lg:hidden text-black/40"><Menu className="w-6 h-6" /></button>
          </div>
        </div>
      </nav>

      <AnimatePresence>{menuOpen && (
        <motion.div initial={{ opacity: 0, x: "100%" }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: "100%" }} className="fixed inset-0 z-[100] bg-[#faf8f5] p-8 flex flex-col pt-32">
          <button onClick={() => setMenuOpen(false)} className="absolute top-10 right-8 text-black/40"><X className="w-10 h-10" /></button>
          <div className="flex flex-col gap-10 text-5xl font-black tracking-tighter uppercase">
            {["Work", "Services", "Studio", "Contact"].map(l => <Link key={l} href="#" onClick={() => setMenuOpen(false)}>{l}</Link>)}
          </div>
        </motion.div>
      )}</AnimatePresence>

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col justify-center pt-20">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 w-full relative z-10">
          <Reveal>
            <div className="flex items-center gap-4 mb-8">
              <div className="px-3 py-1 bg-[#e07a32]/10 border border-[#e07a32]/30 text-[#e07a32] text-[9px] font-bold uppercase tracking-widest">{MANIFESTS.hero.status}</div>
              <div className="text-[9px] text-black/30 tracking-widest uppercase">PROJECTS: {MANIFESTS.hero.projects} // AWARDS: {MANIFESTS.hero.awards}</div>
            </div>
            <h1 className="text-7xl md:text-9xl lg:text-[12rem] font-black leading-[0.8] tracking-tighter uppercase mb-10">
              We <br /> Make <br /> <span className="text-[#e07a32]">Brands</span> <br /> <span className="text-black/10">Move.</span>
            </h1>
            <p className="max-w-2xl text-xl text-black/40 leading-relaxed font-light mb-12 uppercase tracking-widest italic">
              A multidisciplinary creative studio crafting brand identities, digital products, and campaigns for companies that shape culture.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <button className="px-12 py-5 bg-[#1a1a1a] text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-[#e07a32] transition-all">View_Work</button>
              <button className="px-12 py-5 border border-black/10 text-black text-[10px] font-black uppercase tracking-[0.4em] hover:bg-black hover:text-white transition-all">Our_Process</button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* PORTFOLIO LIST */}
      <section className="py-40 bg-white border-y border-black/5">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
            <Reveal><h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85]">Selected <br /> <span className="text-[#e07a32]">Work.</span></h2></Reveal>
          </div>
          <div className="space-y-2">
            {MANIFESTS.portfolio.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.05}>
                <div className="group flex flex-col md:flex-row justify-between items-center p-10 md:p-12 border-b border-black/5 hover:bg-[#1a1a1a] hover:text-white transition-all duration-500 cursor-pointer"
                  onMouseEnter={() => setHoveredWork(p.id)} onMouseLeave={() => setHoveredWork(null)}>
                  <div className="flex-1 mb-6 md:mb-0">
                    <div className="flex items-center gap-6 mb-3">
                      <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">{p.title}</h3>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-black/20 group-hover:text-white/30">{p.category}</span>
                    </div>
                    <p className="text-sm text-black/40 group-hover:text-white/40 leading-relaxed max-w-2xl italic transition-colors">{p.desc}</p>
                  </div>
                  <div className="flex items-center gap-8">
                    <span className="text-[10px] font-bold text-black/20 group-hover:text-white/30 uppercase tracking-widest">{p.year}</span>
                    <motion.div animate={{ x: hoveredWork === p.id ? 5 : 0 }} className="opacity-0 group-hover:opacity-100 transition-opacity"><ArrowRight className="w-5 h-5 text-[#e07a32]" /></motion.div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-40 bg-[#faf8f5]">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <Reveal><h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-24 uppercase">Capabilities.</h2></Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {MANIFESTS.services.map((s, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="group p-12 bg-white border border-black/5 hover:border-[#e07a32]/30 hover:bg-[#1a1a1a] hover:text-white transition-all rounded-3xl">
                  <h3 className="text-3xl font-black uppercase mb-8 tracking-tighter group-hover:text-[#e07a32] transition-colors">{s.name}</h3>
                  <div className="space-y-5 pt-8 border-t border-black/5 group-hover:border-white/10">
                    {s.items.map((item, j) => <div key={j} className="flex items-center gap-4 text-[9px] font-bold text-black/20 group-hover:text-white/30 uppercase tracking-widest"><div className="w-1.5 h-1.5 bg-[#e07a32] rotate-45" />{item}</div>)}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* AWARDS */}
      <section className="py-40 bg-white border-y border-black/5 text-center">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <Reveal>
            <h2 className="text-7xl md:text-[10rem] font-black tracking-tighter uppercase leading-[0.85] mb-24 text-black/5">Awards.</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-16">
              {MANIFESTS.recognition.map((r, i) => (
                <div key={i} className="group"><div className="text-5xl font-black text-black mb-4 group-hover:text-[#e07a32] transition-colors">{r.count}</div><div className="text-[10px] font-black text-black/20 uppercase tracking-widest">{r.award}</div></div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-40 bg-[#1a1a1a] text-white">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 text-center">
          <Reveal>
            <h2 className="text-6xl md:text-9xl font-black tracking-tighter uppercase mb-12">Let&apos;s <br /> <span className="text-[#e07a32]">Create.</span></h2>
            <p className="max-w-2xl mx-auto text-sm text-white/40 leading-relaxed font-light mb-16 uppercase tracking-widest italic">We take on 6 projects per quarter. Tell us about yours.</p>
            <MagneticBtn className="px-16 py-6 bg-white text-black text-[12px] font-black uppercase tracking-[0.4em] hover:bg-[#e07a32] hover:text-white transition-all">Start_Conversation</MagneticBtn>
          </Reveal>
        </div>
      </section>

      <footer className="bg-[#1a1a1a] border-t border-white/5 py-32 px-6 md:px-12 text-white">
        <div className="max-w-[1500px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-24">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-3 text-xl font-black tracking-tighter mb-10"><div className="w-8 h-8 bg-[#e07a32] text-white rounded-full flex items-center justify-center"><Palette className="w-4 h-4" /></div><span>STUDIO // VERSA</span></Link>
            <p className="text-[11px] text-white/20 uppercase tracking-[0.2em] max-w-sm leading-relaxed mb-16 italic">Multidisciplinary creative studio. Brand, product, campaign.</p>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-10 text-[#e07a32]">Studio</h4>
            <ul className="space-y-5 text-[10px] font-bold text-white/30 uppercase tracking-widest">
              {["Work", "Services", "About", "Careers"].map(l => <li key={l} className="hover:text-white transition-colors"><Link href="#">{l}</Link></li>)}
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-10 text-[#e07a32]">Connect</h4>
            <ul className="space-y-5 text-[10px] font-bold text-white/30 uppercase tracking-widest">
              {["Instagram", "Dribbble", "LinkedIn", "Twitter"].map(l => <li key={l} className="hover:text-white transition-colors"><Link href="#">{l}</Link></li>)}
            </ul>
          </div>
        </div>
        <div className="max-w-[1500px] mx-auto mt-32 pt-16 border-t border-white/5 text-center text-[9px] font-bold text-white/10 uppercase tracking-widest">
          <span>&copy; 2026 STUDIO VERSA. ALL RIGHTS RESERVED.</span>
        </div>
      </footer>
    </div>
  );
}
