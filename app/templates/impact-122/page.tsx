"use client";
import { motion, useInView, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { BookOpen, Feather, Quote, Menu, X, ArrowRight, Clock, User, Hash, MessageCircle, Share2, Bookmark, TrendingUp, Globe, Newspaper } from "lucide-react";
import "../premium.css";

const MANIFESTS = {
  hero: { stories: "2,400+", readers: "1.2M", writers: "340", status: "ISSUE_147" },
  features: [
    { id: "dispatch", title: "THE LAST DISPATCH FROM STATION ALPHA", author: "Elena Voss", category: "LONG_READ", readTime: "24 min", excerpt: "For forty years, the Arctic research station transmitted data no one questioned. Then the final message arrived — and it changed everything we thought we knew about the ice." },
    { id: "algorithm", title: "WHO OWNS THE ALGORITHM?", author: "Marcus Chen", category: "INVESTIGATION", readTime: "18 min", excerpt: "Inside the fight over AI training data, the artists who refuse to surrender their work, and the legal precedent that could reshape the creative economy." },
    { id: "silence", title: "THE ARCHITECTURE OF SILENCE", author: "Amara Okafor", category: "ESSAY", readTime: "12 min", excerpt: "In a world optimized for noise, a new generation of architects is designing spaces that prioritize acoustic absence. This is their manifesto." },
  ],
  sections: [
    { name: "DISPATCHES", icon: <Globe className="w-5 h-5" />, desc: "Global correspondence from conflict zones, cultural frontlines, and the edges of change." },
    { name: "INVESTIGATIONS", icon: <TrendingUp className="w-5 h-5" />, desc: "Deep-dive accountability journalism. Data-driven, source-verified, consequence-minded." },
    { name: "ESSAYS", icon: <Feather className="w-5 h-5" />, desc: "Long-form personal writing. Meditations, arguments, and the art of the considered opinion." },
  ],
  latest: [
    { title: "The Collapse of Antarctic Shelf C-19", category: "CLIMATE", date: "May 2" },
    { title: "Quantum Computing's Broken Promise", category: "TECHNOLOGY", date: "Apr 28" },
    { title: "Portrait: The Chef Who Feeds a City", category: "PROFILE", date: "Apr 25" },
    { title: "Why We Stopped Listening to Music", category: "CULTURE", date: "Apr 22" },
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

export default function ChronicleEditorialPage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => { const h = () => setScrolled(window.scrollY > 50); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h); }, []);

  const { scrollYProgress } = useScroll();
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div className="premium-theme min-h-screen bg-[#fdfcfa] text-[#1a1a1a] overflow-x-hidden" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.02]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E")` }} />

      {/* Reading progress */}
      <motion.div className="fixed top-0 left-0 h-0.5 bg-[#b45309] z-[60]" style={{ width: progressWidth }} />

      <nav className={`fixed top-0.5 left-0 w-full z-50 transition-all duration-500 ${scrolled ? "bg-[#fdfcfa]/95 backdrop-blur-xl py-3 border-b border-black/5" : "bg-transparent py-8"}`}>
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="group text-2xl tracking-tight">
            <span className="font-bold italic group-hover:text-[#b45309] transition-colors">Chronicle</span>
          </Link>
          <div className="hidden lg:flex items-center gap-8 text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-black/30">
            {["Dispatches", "Investigations", "Essays", "Archive"].map(l => <Link key={l} href="#" className="hover:text-[#b45309] transition-colors">{l}</Link>)}
          </div>
          <div className="flex items-center gap-6">
            <MagneticBtn className="px-5 py-2 bg-[#b45309] text-white text-[10px] font-mono font-bold uppercase tracking-widest hover:bg-black transition-all">Subscribe</MagneticBtn>
            <button onClick={() => setMenuOpen(true)} className="lg:hidden text-black/40"><Menu className="w-6 h-6" /></button>
          </div>
        </div>
      </nav>

      <AnimatePresence>{menuOpen && (
        <motion.div initial={{ opacity: 0, x: "100%" }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: "100%" }} className="fixed inset-0 z-[100] bg-[#fdfcfa] p-8 flex flex-col pt-32">
          <button onClick={() => setMenuOpen(false)} className="absolute top-10 right-8 text-black/40"><X className="w-10 h-10" /></button>
          <div className="flex flex-col gap-8 text-5xl font-bold italic">
            {["Dispatches", "Investigations", "Essays", "Archive"].map(l => <Link key={l} href="#" onClick={() => setMenuOpen(false)}>{l}</Link>)}
          </div>
        </motion.div>
      )}</AnimatePresence>

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col justify-center pt-20 overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 w-full relative z-10">
          <Reveal>
            <div className="flex items-center gap-4 mb-8 font-mono">
              <div className="px-3 py-1 bg-[#b45309]/10 border border-[#b45309]/30 text-[#b45309] text-[9px] font-bold uppercase tracking-widest">{MANIFESTS.hero.status}</div>
              <div className="text-[9px] text-black/30 tracking-widest uppercase">STORIES: {MANIFESTS.hero.stories} // READERS: {MANIFESTS.hero.readers}</div>
            </div>
            <h1 className="text-6xl md:text-8xl lg:text-[9rem] font-bold leading-[0.85] tracking-tight mb-10">
              Stories <br /> that <br /> <em className="text-[#b45309]">matter.</em>
            </h1>
            <p className="max-w-xl text-xl text-black/40 leading-relaxed font-normal mb-12 italic">
              Independent long-form journalism. Investigations, dispatches, and essays from the writers who refuse to look away.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 font-mono">
              <button className="px-12 py-5 bg-black text-white text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-[#b45309] transition-all">Read_Latest</button>
              <button className="px-12 py-5 border border-black/10 text-black text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-black hover:text-white transition-all">Browse_Archive</button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FEATURED STORIES */}
      <section className="py-32 bg-white border-y border-black/5">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <div className="flex justify-between items-end mb-20 gap-12">
            <Reveal><h2 className="text-5xl md:text-7xl font-bold tracking-tight leading-[0.85]">Featured <br /> <em className="text-[#b45309]">Stories.</em></h2></Reveal>
            <p className="max-w-sm text-sm text-black/30 leading-relaxed italic hidden md:block">Editor&apos;s picks from this month&apos;s most compelling journalism.</p>
          </div>
          <div className="space-y-16">
            {MANIFESTS.features.map((f, i) => (
              <Reveal key={f.id} delay={i * 0.1}>
                <article className="group cursor-pointer border-b border-black/5 pb-16 last:border-b-0">
                  <div className="flex items-center gap-6 mb-6 font-mono text-[9px] font-bold uppercase tracking-widest text-black/30">
                    <span className="text-[#b45309]">{f.category}</span>
                    <span>BY {f.author.toUpperCase()}</span>
                    <div className="flex items-center gap-1"><Clock className="w-3 h-3" />{f.readTime}</div>
                  </div>
                  <h3 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 group-hover:text-[#b45309] transition-colors leading-tight">{f.title}</h3>
                  <p className="text-lg text-black/40 leading-relaxed max-w-3xl italic">{f.excerpt}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SECTIONS */}
      <section className="py-32 bg-[#fdfcfa]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <Reveal>
            <span className="text-[10px] font-mono uppercase tracking-[0.4em] font-bold text-[#b45309] mb-6 block">Departments</span>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight leading-[0.85] mb-20">Our <br /> <em className="text-black/15">Sections.</em></h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {MANIFESTS.sections.map((s, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="group p-12 bg-white border border-black/5 hover:border-[#b45309]/30 hover:bg-[#b45309] hover:text-white transition-all flex flex-col h-full rounded-2xl">
                  <div className="w-12 h-12 bg-black/5 group-hover:bg-white/10 rounded-xl flex items-center justify-center mb-10 transition-all">{s.icon}</div>
                  <h3 className="text-2xl font-bold mb-4 font-mono tracking-tight">{s.name}</h3>
                  <p className="text-sm text-black/40 group-hover:text-white/60 leading-relaxed italic transition-colors">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* LATEST */}
      <section className="py-32 bg-white border-y border-black/5">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <Reveal>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight leading-[0.85] mb-20">Latest <br /> <em className="text-[#b45309]">Reads.</em></h2>
          </Reveal>
          <div className="space-y-6">
            {MANIFESTS.latest.map((l, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <div className="group flex justify-between items-center p-8 border border-black/5 hover:border-[#b45309]/30 transition-all cursor-pointer rounded-xl">
                  <div className="flex items-center gap-8">
                    <span className="font-mono text-[9px] font-bold text-[#b45309] uppercase tracking-widest">{l.category}</span>
                    <h3 className="text-xl font-bold tracking-tight group-hover:text-[#b45309] transition-colors">{l.title}</h3>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="font-mono text-[10px] text-black/20 uppercase tracking-widest">{l.date}</span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-[#b45309]" />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-[#1a1a1a] text-white">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 text-center">
          <Reveal>
            <h2 className="text-5xl md:text-8xl font-bold tracking-tight mb-12">Read <br /> <em className="text-[#b45309]">deeply.</em></h2>
            <p className="max-w-xl mx-auto text-lg text-white/40 leading-relaxed mb-16 italic">Join 1.2 million readers who choose substance over speed. Chronicle — delivered weekly to your inbox.</p>
            <MagneticBtn className="px-16 py-6 bg-[#b45309] text-white text-[12px] font-mono font-bold uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all">Subscribe_Free</MagneticBtn>
          </Reveal>
        </div>
      </section>

      <footer className="bg-[#1a1a1a] border-t border-white/5 py-24 px-6 md:px-12 text-white">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-20">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="text-2xl font-bold italic mb-8 block">Chronicle</Link>
            <p className="text-[11px] text-white/20 tracking-wider max-w-sm leading-relaxed mb-12 italic">Independent journalism since 2018. No ads, no investors, reader-funded.</p>
            <div className="flex gap-6">{[BookOpen, Newspaper, Globe].map((Icon, i) => <button key={i} className="text-white/20 hover:text-[#b45309] transition-colors"><Icon className="w-5 h-5" /></button>)}</div>
          </div>
          <div>
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest mb-8 text-[#b45309]">Read</h4>
            <ul className="space-y-4 text-[10px] font-mono font-bold text-white/20 uppercase tracking-widest">
              {["Dispatches", "Investigations", "Essays", "Archive"].map(l => <li key={l} className="hover:text-white transition-colors"><Link href="#">{l}</Link></li>)}
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest mb-8 text-[#b45309]">About</h4>
            <ul className="space-y-4 text-[10px] font-mono font-bold text-white/20 uppercase tracking-widest">
              {["Our_Mission", "Writers", "Ethics", "Contact"].map(l => <li key={l} className="hover:text-white transition-colors"><Link href="#">{l}</Link></li>)}
            </ul>
          </div>
        </div>
        <div className="max-w-[1200px] mx-auto mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[9px] font-mono font-bold text-white/10 uppercase tracking-widest">
          <span>&copy; 2026 CHRONICLE. ALL RIGHTS RESERVED.</span>
          <span>READER-FUNDED. AD-FREE. INDEPENDENT.</span>
        </div>
      </footer>
    </div>
  );
}
