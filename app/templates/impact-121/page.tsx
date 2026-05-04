"use client";
import { motion, useInView, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Camera, Aperture, Image, Menu, X, ArrowRight, Layers, Grid3X3, Palette, Eye, Pen, Monitor, Figma, Code, Globe, Award } from "lucide-react";
import "../premium.css";

const MANIFESTS = {
  hero: { projects: "148", clients: "60+", years: "12", status: "ACCEPTING_WORK" },
  works: [
    { id: "nova", name: "NOVA // BRAND", desc: "Complete brand identity for a space-tech startup — logo system, motion guidelines, pitch deck, and investor materials.", category: "BRANDING", year: "2026" },
    { id: "terra", name: "TERRA // APP", desc: "Climate monitoring dashboard with real-time satellite data visualization, accessible design system, and responsive PWA.", category: "PRODUCT", year: "2025" },
    { id: "echo", name: "ECHO // WEB", desc: "Award-winning editorial platform for an independent music publication — custom CMS, audio player, and artist profiles.", category: "DEVELOPMENT", year: "2025" },
    { id: "prism", name: "PRISM // FILM", desc: "Title sequence and motion design for an HBO documentary series — 3D typography, data-driven animations, and color grading.", category: "MOTION", year: "2024" },
  ],
  services: [
    { name: "BRAND // IDENTITY", icon: <Palette className="w-5 h-5" />, items: ["Logo Systems", "Visual Language", "Brand Guidelines", "Motion Identity"] },
    { name: "PRODUCT // DESIGN", icon: <Figma className="w-5 h-5" />, items: ["UI/UX Design", "Design Systems", "Prototyping", "User Research"] },
    { name: "DEVELOPMENT", icon: <Code className="w-5 h-5" />, items: ["React / Next.js", "Creative Coding", "WebGL / 3D", "Performance"] },
  ],
  recognition: [
    { award: "AWWWARDS — SOTD", count: "12×" },
    { award: "FWA — SITE OF YEAR", count: "3×" },
    { award: "CSS DESIGN AWARDS", count: "8×" },
    { award: "D&AD PENCIL", count: "2×" },
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

export default function FolioStudioPage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredWork, setHoveredWork] = useState<string | null>(null);
  useEffect(() => { const h = () => setScrolled(window.scrollY > 50); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h); }, []);

  return (
    <div className="premium-theme min-h-screen bg-[#faf9f7] text-[#0a0a0a] font-mono selection:bg-[#0a0a0a] selection:text-white overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)`, backgroundSize: "100px 100px" }} />
      </div>

      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? "bg-[#faf9f7]/90 backdrop-blur-xl py-4 border-b border-black/5" : "bg-transparent py-10"}`}>
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-3 text-xl font-black tracking-tighter">
            <div className="w-8 h-8 bg-black rounded-sm flex items-center justify-center text-white"><Pen className="w-4 h-4" /></div>
            <span className="group-hover:text-black/50 transition-colors">FOLIO // <span className="text-black/30">STUDIO</span></span>
          </Link>
          <div className="hidden lg:flex items-center gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-black/30">
            {["Work", "Services", "About", "Contact"].map(l => <Link key={l} href="#" className="hover:text-black transition-colors">{l}</Link>)}
          </div>
          <div className="flex items-center gap-6">
            <MagneticBtn className="px-6 py-2.5 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-black/80 transition-all">Hire_Us</MagneticBtn>
            <button onClick={() => setMenuOpen(true)} className="lg:hidden text-black/40"><Menu className="w-6 h-6" /></button>
          </div>
        </div>
      </nav>

      <AnimatePresence>{menuOpen && (
        <motion.div initial={{ opacity: 0, x: "100%" }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: "100%" }} className="fixed inset-0 z-[100] bg-[#faf9f7] p-8 flex flex-col pt-32">
          <button onClick={() => setMenuOpen(false)} className="absolute top-10 right-8 text-black/40"><X className="w-10 h-10" /></button>
          <div className="flex flex-col gap-10 text-5xl font-black tracking-tighter uppercase">
            {["Work", "Services", "About", "Contact"].map(l => <Link key={l} href="#" onClick={() => setMenuOpen(false)}>{l}</Link>)}
          </div>
        </motion.div>
      )}</AnimatePresence>

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col justify-center pt-20 overflow-hidden">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 w-full relative z-10">
          <Reveal>
            <div className="flex items-center gap-4 mb-8">
              <div className="px-3 py-1 bg-black/5 border border-black/10 text-black text-[9px] font-bold uppercase tracking-widest">{MANIFESTS.hero.status}</div>
              <div className="text-[9px] text-black/30 tracking-widest uppercase">PROJECTS: {MANIFESTS.hero.projects} // CLIENTS: {MANIFESTS.hero.clients}</div>
            </div>
            <h1 className="text-7xl md:text-9xl lg:text-[12rem] font-black leading-[0.8] tracking-tighter uppercase mb-10">
              We <br /> Design <br /> <span className="text-black/15">& Build.</span>
            </h1>
            <p className="max-w-2xl text-xl text-black/40 leading-relaxed font-light mb-12 uppercase tracking-widest italic">
              An independent creative studio crafting brand identities, digital products, and award-winning web experiences for ambitious companies.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <button className="px-12 py-5 bg-black text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-black/80 transition-all">View_Work</button>
              <button className="px-12 py-5 border border-black/10 text-black text-[10px] font-black uppercase tracking-[0.4em] hover:bg-black hover:text-white transition-all">Our_Process</button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* WORKS */}
      <section className="py-40 bg-[#f4f3f0] border-y border-black/5">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
            <Reveal><h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85]">Selected <br /> <span className="text-black/15">Work.</span></h2></Reveal>
            <p className="max-w-md text-sm text-black/30 leading-relaxed uppercase tracking-widest font-light italic">A curated selection of projects spanning brand, product, web, and motion design.</p>
          </div>
          <div className="space-y-2">
            {MANIFESTS.works.map((w, i) => (
              <Reveal key={w.id} delay={i * 0.05}>
                <div className="group flex flex-col md:flex-row justify-between items-center p-10 md:p-12 border-b border-black/5 hover:bg-black hover:text-white transition-all duration-500 cursor-pointer"
                  onMouseEnter={() => setHoveredWork(w.id)} onMouseLeave={() => setHoveredWork(null)}>
                  <div className="flex-1 mb-6 md:mb-0">
                    <div className="flex items-center gap-6 mb-4">
                      <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">{w.name}</h3>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-black/20 group-hover:text-white/30">{w.category}</span>
                    </div>
                    <p className="text-sm text-black/40 group-hover:text-white/40 leading-relaxed max-w-2xl italic transition-colors">"{w.desc}"</p>
                  </div>
                  <div className="flex items-center gap-8">
                    <span className="text-[10px] font-bold text-black/20 group-hover:text-white/30 uppercase tracking-widest">{w.year}</span>
                    <motion.div animate={{ x: hoveredWork === w.id ? 5 : 0 }} className="opacity-0 group-hover:opacity-100 transition-opacity"><ArrowRight className="w-5 h-5" /></motion.div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-40 bg-[#faf9f7]">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <Reveal>
            <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-black/30 mb-6 block">Capabilities</span>
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-24 uppercase">What We <br /> <span className="text-black/15">Do.</span></h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {MANIFESTS.services.map((s, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="group p-12 bg-[#f4f3f0] border border-black/5 hover:border-black/20 hover:bg-black hover:text-white transition-all flex flex-col h-full rounded-3xl">
                  <div className="w-16 h-16 bg-black/5 group-hover:bg-white/10 border border-black/5 group-hover:border-white/10 rounded-2xl flex items-center justify-center mb-12 transition-all">{s.icon}</div>
                  <h3 className="text-3xl font-black uppercase mb-8 tracking-tighter">{s.name}</h3>
                  <div className="space-y-5 pt-8 border-t border-black/5 group-hover:border-white/10">
                    {s.items.map((item, j) => <div key={j} className="flex items-center gap-4 text-[9px] font-bold text-black/20 group-hover:text-white/30 uppercase tracking-widest"><div className="w-1.5 h-1.5 bg-black/20 group-hover:bg-white/30 rotate-45" />{item}</div>)}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* RECOGNITION */}
      <section className="py-40 bg-[#f4f3f0] border-y border-black/5 text-center overflow-hidden">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <Reveal>
            <h2 className="text-7xl md:text-[12rem] font-black tracking-tighter uppercase leading-[0.85] mb-12 text-black/5">Awards.</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-16 mt-24">
              {MANIFESTS.recognition.map((r, i) => (
                <div key={i} className="group"><div className="text-5xl font-black text-black mb-4 group-hover:text-black/50 transition-colors">{r.count}</div><div className="text-[10px] font-black text-black/20 uppercase tracking-widest">{r.award}</div></div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-40 bg-[#0a0a0a] text-white">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 text-center">
          <Reveal>
            <h2 className="text-6xl md:text-9xl font-black tracking-tighter uppercase mb-12">Let&apos;s <br /> <span className="text-white/20">Talk.</span></h2>
            <p className="max-w-2xl mx-auto text-sm text-white/40 leading-relaxed font-light mb-16 uppercase tracking-widest italic">We take on a limited number of projects each quarter. Tell us about yours and we&apos;ll see if it&apos;s a fit.</p>
            <MagneticBtn className="px-16 py-6 bg-white text-black text-[12px] font-black uppercase tracking-[0.4em] hover:bg-white/90 transition-all">Start_A_Project</MagneticBtn>
          </Reveal>
        </div>
      </section>

      <footer className="bg-[#0a0a0a] border-t border-white/5 py-32 px-6 md:px-12 text-white">
        <div className="max-w-[1500px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-24">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-3 text-xl font-black tracking-tighter mb-10"><div className="w-8 h-8 bg-white text-black rounded-sm flex items-center justify-center"><Pen className="w-4 h-4" /></div><span>FOLIO // STUDIO</span></Link>
            <p className="text-[11px] text-white/20 uppercase tracking-[0.2em] max-w-sm leading-relaxed mb-16 italic">An independent creative studio. Design, build, ship.</p>
            <div className="flex gap-8">{[Globe, Monitor, Award].map((Icon, i) => <button key={i} className="text-white/20 hover:text-white transition-colors"><Icon className="w-5 h-5" /></button>)}</div>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-10 text-white/40">Studio</h4>
            <ul className="space-y-5 text-[10px] font-bold text-white/20 uppercase tracking-widest">
              {["Selected_Work", "Services", "Process", "Careers"].map(l => <li key={l} className="hover:text-white transition-colors"><Link href="#">{l}</Link></li>)}
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-10 text-white/40">Connect</h4>
            <ul className="space-y-5 text-[10px] font-bold text-white/20 uppercase tracking-widest">
              {["Twitter/X", "Dribbble", "GitHub", "LinkedIn"].map(l => <li key={l} className="hover:text-white transition-colors"><Link href="#">{l}</Link></li>)}
            </ul>
          </div>
        </div>
        <div className="max-w-[1500px] mx-auto mt-32 pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12 text-[9px] font-bold text-white/10 uppercase tracking-widest">
          <span>&copy; 2026 FOLIO STUDIO. ALL RIGHTS RESERVED.</span>
          <div className="flex gap-10 font-mono"><span>BROOKLYN_NY</span><span>EST_2014</span></div>
        </div>
      </footer>
    </div>
  );
}
