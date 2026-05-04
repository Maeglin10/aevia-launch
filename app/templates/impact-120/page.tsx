"use client";
import { motion, useInView, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Droplets, Wind, Menu, X, ArrowRight, Flower2, Moon, Sun, Star, Gem, Feather, Heart, Eye, Palette } from "lucide-react";
import "../premium.css";

const MANIFESTS = {
  hero: { fragrances: "24", ingredients: "200+", ateliers: "3", status: "COLLECTION_LIVE" },
  collection: [
    { id: "noir", name: "NOIR // ABSOLU", desc: "Deep oud heart wrapped in smoky vetiver, black amber, and a whisper of Calabrian bergamot. The scent of midnight certainty.", icon: <Moon className="w-5 h-5" />, notes: ["Oud Wood", "Black Amber", "Vetiver Smoke"] },
    { id: "aurore", name: "AURORE // DORÉE", desc: "Liquid gold of Grasse rose absolute, saffron threads, and sandalwood cream. Sunrise bottled in Baccarat crystal.", icon: <Sun className="w-5 h-5" />, notes: ["Grasse Rose", "Saffron", "Sandalwood"] },
    { id: "celeste", name: "CELESTE // VOILE", desc: "Ethereal iris pallida from Florence, white musk clouds, and a translucent violet leaf accord. Weightless elegance.", icon: <Wind className="w-5 h-5" />, notes: ["Iris Pallida", "White Musk", "Violet Leaf"] },
  ],
  telemetry: [
    { label: "SILLAGE_INDEX", val: 96, color: "#c084fc" },
    { label: "LONGEVITY_HR", val: 92, color: "#c084fc" },
    { label: "INGREDIENT_PURITY", val: 99, color: "#c084fc" },
    { label: "NOSE_RATING", val: 94, color: "#c084fc" },
  ],
  ingredients: [
    { name: "OUD ASSAM", origin: "India", rarity: "Exceptional", grade: "First Press" },
    { name: "ROSE DE MAI", origin: "Grasse, France", rarity: "Heritage", grade: "Absolute" },
    { name: "IRIS PALLIDA", origin: "Florence, Italy", rarity: "Noble", grade: "Concrete" },
    { name: "SANTAL MYSORE", origin: "Karnataka, India", rarity: "Endangered", grade: "Heartwood" },
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

export default function EclatParfumPage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => { const h = () => setScrolled(window.scrollY > 50); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h); }, []);

  return (
    <div className="premium-theme min-h-screen bg-[#0a060d] text-white font-mono selection:bg-[#c084fc] selection:text-black overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,#1a0d2e_0%,transparent_50%)]" />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `radial-gradient(#c084fc 0.5px, transparent 0.5px)`, backgroundSize: "50px 50px" }} />
        {/* Floating particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div key={i} animate={{ y: [0, -40, 0], opacity: [0, 0.15, 0] }} transition={{ duration: 6 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 5 }}
            className="absolute w-1 h-1 bg-[#c084fc] rounded-full" style={{ left: `${10 + Math.random() * 80}%`, top: `${20 + Math.random() * 60}%` }} />
        ))}
      </div>

      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? "bg-[#0a060d]/90 backdrop-blur-xl py-4 border-b border-white/5" : "bg-transparent py-10"}`}>
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-3 text-xl tracking-[0.3em] uppercase">
            <div className="w-8 h-8 bg-[#c084fc] rounded-full flex items-center justify-center text-black"><Gem className="w-4 h-4" /></div>
            <span className="font-light group-hover:text-[#c084fc] transition-colors" style={{ fontFamily: "Georgia, serif" }}>ÉCLAT</span>
          </Link>
          <div className="hidden lg:flex items-center gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
            {["Collection", "Ingredients", "Atelier", "Maison"].map(l => <Link key={l} href="#" className="hover:text-[#c084fc] transition-colors">{l}</Link>)}
          </div>
          <div className="flex items-center gap-6">
            <MagneticBtn className="px-6 py-2.5 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-[#c084fc] transition-all">Discover</MagneticBtn>
            <button onClick={() => setMenuOpen(true)} className="lg:hidden text-white/60"><Menu className="w-6 h-6" /></button>
          </div>
        </div>
      </nav>

      <AnimatePresence>{menuOpen && (
        <motion.div initial={{ opacity: 0, x: "100%" }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: "100%" }} className="fixed inset-0 z-[100] bg-[#0a060d] p-8 flex flex-col pt-32">
          <button onClick={() => setMenuOpen(false)} className="absolute top-10 right-8 text-white/40"><X className="w-10 h-10" /></button>
          <div className="flex flex-col gap-10 text-5xl font-light tracking-wider uppercase" style={{ fontFamily: "Georgia, serif" }}>
            {["Collection", "Ingredients", "Atelier", "Maison"].map(l => <Link key={l} href="#" onClick={() => setMenuOpen(false)}>{l}</Link>)}
          </div>
        </motion.div>
      )}</AnimatePresence>

      {/* HERO */}
      <section className="relative h-screen flex flex-col justify-center pt-20 overflow-hidden">
        {/* Expanding rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[...Array(4)].map((_, i) => (
            <motion.div key={i} animate={{ scale: [0.5, 2.5], opacity: [0.1, 0] }} transition={{ duration: 6, repeat: Infinity, delay: i * 1.5 }}
              className="absolute w-40 h-40 border border-[#c084fc]/20 rounded-full" />
          ))}
        </div>
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-8">
              <Reveal>
                <div className="flex items-center gap-4 mb-8">
                  <div className="px-3 py-1 bg-[#c084fc]/10 border border-[#c084fc]/30 text-[#c084fc] text-[9px] font-bold uppercase tracking-widest">{MANIFESTS.hero.status}</div>
                  <div className="text-[9px] text-white/30 tracking-widest uppercase">ESSENCES: {MANIFESTS.hero.fragrances} // INGREDIENTS: {MANIFESTS.hero.ingredients}</div>
                </div>
                <h1 className="text-7xl md:text-9xl lg:text-[10rem] leading-[0.8] tracking-tight uppercase mb-10" style={{ fontFamily: "Georgia, serif", fontWeight: 400 }}>
                  The <br /> <span className="text-[#c084fc] italic">Art</span> of <br /> Scent. <br /> <span className="text-white/15">Éclat.</span>
                </h1>
                <p className="max-w-2xl text-xl text-white/40 leading-relaxed font-light mb-12 uppercase tracking-widest italic">
                  Haute parfumerie crafted from the world&apos;s rarest botanicals. Each composition a masterwork of olfactory architecture.
                </p>
                <div className="flex flex-col sm:flex-row gap-6">
                  <button className="px-12 py-5 bg-[#c084fc] text-black text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white transition-all shadow-[0_0_50px_rgba(192,132,252,0.2)]">Explore_Collection</button>
                  <button className="px-12 py-5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all">Book_Consultation</button>
                </div>
              </Reveal>
            </div>
            <div className="lg:col-span-4 relative hidden lg:block">
              <Reveal delay={0.2}>
                <div className="relative aspect-[3/4] bg-[#0d081a] border border-white/5 p-12 rounded-3xl overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-b from-[#c084fc]/5 via-transparent to-[#c084fc]/3" />
                  <div className="relative h-full flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div><div className="text-[8px] font-bold text-white/20 uppercase tracking-widest">ATELIERS</div><div className="text-xl font-light text-[#c084fc]" style={{ fontFamily: "Georgia, serif" }}>{MANIFESTS.hero.ateliers}</div></div>
                      <div className="w-10 h-10 border border-white/5 rounded-full flex items-center justify-center"><Sparkles className="w-5 h-5 text-[#c084fc]/40" /></div>
                    </div>
                    <div className="space-y-10 my-10">
                      {MANIFESTS.telemetry.map((s, i) => (
                        <div key={i}>
                          <div className="flex justify-between text-[8px] font-bold uppercase tracking-widest mb-3"><span className="text-white/40">{s.label}</span><span style={{ color: s.color }}>{s.val}%</span></div>
                          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${s.val}%` }} transition={{ duration: 2, delay: 0.5 + i * 0.1 }} className="h-full" style={{ backgroundColor: s.color }} /></div>
                        </div>
                      ))}
                    </div>
                    <div className="pt-6 border-t border-white/5 flex justify-between items-center text-[8px] font-bold text-white/20 uppercase tracking-widest">
                      <span>GRASSE_CERTIFIED</span>
                      <div className="flex items-center gap-2 text-[#c084fc]"><Flower2 className="w-3 h-3" /><span>MAISON</span></div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* COLLECTION */}
      <section className="py-40 bg-[#0d081a] border-y border-white/5">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
            <Reveal><h2 className="text-6xl md:text-8xl tracking-tighter uppercase leading-[0.85]" style={{ fontFamily: "Georgia, serif", fontWeight: 400 }}>La <br /> <span className="text-[#c084fc] italic">Collection.</span></h2></Reveal>
            <p className="max-w-md text-sm text-white/30 leading-relaxed uppercase tracking-widest font-light italic">Three signature compositions. Each a universe of scent, crafted over years by master perfumers in Grasse.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {MANIFESTS.collection.map((c, i) => (
              <Reveal key={c.id} delay={i * 0.1}>
                <div className="group p-12 bg-[#0d081a] border border-white/5 hover:border-[#c084fc]/30 transition-all flex flex-col h-full rounded-3xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#c084fc]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-16 h-16 bg-white/5 border border-white/5 rounded-full flex items-center justify-center text-[#c084fc] mb-12 group-hover:bg-[#c084fc] group-hover:text-black transition-all">{c.icon}</div>
                  <h3 className="text-3xl uppercase mb-6 tracking-tighter group-hover:text-[#c084fc] transition-colors" style={{ fontFamily: "Georgia, serif", fontWeight: 400 }}>{c.name}</h3>
                  <p className="text-sm text-white/40 leading-relaxed mb-12 flex-1 italic">"{c.desc}"</p>
                  <div className="space-y-5 pt-10 border-t border-white/5">
                    {c.notes.map((n, j) => <div key={j} className="flex items-center gap-4 text-[9px] font-bold text-white/20 uppercase tracking-widest"><div className="w-1.5 h-1.5 bg-[#c084fc] rounded-full" />{n}</div>)}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* INGREDIENTS */}
      <section className="py-40 bg-[#0a060d]">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-32 items-center">
            <div className="lg:col-span-6">
              <Reveal>
                <div className="relative aspect-square bg-[#0d081a] border border-white/5 rounded-3xl overflow-hidden flex items-center justify-center">
                  {/* Scent molecule visualization */}
                  <div className="relative w-48 h-48">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute inset-0">
                      {[...Array(8)].map((_, i) => {
                        const angle = (i / 8) * Math.PI * 2;
                        return <div key={i} className="absolute w-3 h-3 bg-[#c084fc]/20 rounded-full border border-[#c084fc]/30" style={{ left: `calc(50% + ${Math.cos(angle) * 80}px - 6px)`, top: `calc(50% + ${Math.sin(angle) * 80}px - 6px)` }} />;
                      })}
                    </motion.div>
                    <div className="absolute inset-0 flex items-center justify-center"><div className="w-8 h-8 bg-[#c084fc]/30 rounded-full shadow-[0_0_30px_rgba(192,132,252,0.3)] border border-[#c084fc]/40" /></div>
                  </div>
                  <div className="absolute bottom-8 left-8 right-8 flex justify-between text-[8px] font-bold text-white/20 tracking-widest uppercase">
                    <span>MOLECULE: C₁₅H₂₆O</span><span className="text-[#c084fc]">SESQUITERPENE</span>
                  </div>
                </div>
              </Reveal>
            </div>
            <div className="lg:col-span-6">
              <Reveal>
                <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#c084fc] mb-6 block">Rare_Botanicals</span>
                <h2 className="text-6xl md:text-8xl tracking-tighter leading-[0.85] mb-12 uppercase" style={{ fontFamily: "Georgia, serif", fontWeight: 400 }}>Raw <br /> <span className="text-white/20 italic">Materials.</span></h2>
                <div className="space-y-8">
                  {MANIFESTS.ingredients.map((ing, i) => (
                    <div key={i} className="group flex flex-col md:flex-row justify-between items-center p-8 bg-white/2 border border-white/5 hover:border-[#c084fc]/30 transition-all">
                      <div className="flex items-center gap-10 mb-6 md:mb-0">
                        <div className="text-2xl uppercase tracking-tighter" style={{ fontFamily: "Georgia, serif" }}>{ing.name}</div>
                        <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{ing.origin}</div>
                      </div>
                      <div className="flex items-center gap-8 text-[10px] font-bold uppercase tracking-widest">
                        <span className="text-[#c084fc]/60">{ing.rarity}</span>
                        <span className="text-white/20">{ing.grade}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* METRICS */}
      <section className="py-40 bg-[#0d081a] border-y border-white/5 text-center overflow-hidden">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <Reveal>
            <h2 className="text-7xl md:text-[12rem] tracking-tighter uppercase leading-[0.85] mb-12 text-white/5" style={{ fontFamily: "Georgia, serif", fontWeight: 400 }}>Pure <br /> <em>Essence.</em></h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-16 mt-24">
              {[{ label: "COMPOSITIONS", val: "24" }, { label: "RAW_MATERIALS", val: "200+" }, { label: "YEARS_CRAFT", val: "140" }, { label: "ATELIERS", val: "3" }].map((s, i) => (
                <div key={i} className="group"><div className="text-5xl text-white mb-4 group-hover:text-[#c084fc] transition-colors" style={{ fontFamily: "Georgia, serif" }}>{s.val}</div><div className="text-[10px] font-black text-white/20 uppercase tracking-widest">{s.label}</div></div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-40 bg-[#0a060d]">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 text-center">
          <Reveal>
            <h2 className="text-6xl md:text-9xl tracking-tighter uppercase mb-12" style={{ fontFamily: "Georgia, serif", fontWeight: 400 }}>Wear <br /> <span className="text-[#c084fc] italic">Art.</span></h2>
            <p className="max-w-2xl mx-auto text-sm text-white/40 leading-relaxed font-light mb-16 uppercase tracking-widest italic">Each Éclat fragrance is a masterpiece of scent architecture. Visit our atelier or request a private consultation.</p>
            <MagneticBtn className="px-16 py-6 bg-white text-black text-[12px] font-black uppercase tracking-[0.4em] hover:bg-[#c084fc] transition-all shadow-[0_0_60px_rgba(192,132,252,0.15)]">Book_Private_Session</MagneticBtn>
          </Reveal>
        </div>
      </section>

      <footer className="bg-[#0a060d] border-t border-white/5 py-32 px-6 md:px-12">
        <div className="max-w-[1500px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-24">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-3 text-xl tracking-[0.3em] uppercase mb-10" style={{ fontFamily: "Georgia, serif" }}><div className="w-8 h-8 bg-[#c084fc] rounded-full flex items-center justify-center text-black"><Gem className="w-4 h-4" /></div><span className="font-light">ÉCLAT</span></Link>
            <p className="text-[11px] text-white/20 uppercase tracking-[0.2em] max-w-sm leading-relaxed mb-16 italic">Haute parfumerie since 1886. Grasse, Paris, New York.</p>
            <div className="flex gap-8">{[Flower2, Feather, Heart].map((Icon, i) => <button key={i} className="text-white/20 hover:text-[#c084fc] transition-colors"><Icon className="w-5 h-5" /></button>)}</div>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-10 text-[#c084fc]">Maison</h4>
            <ul className="space-y-5 text-[10px] font-bold text-white/30 uppercase tracking-widest">
              {["La_Collection", "Bespoke", "Heritage", "Atelier"].map(l => <li key={l} className="hover:text-white transition-colors"><Link href="#">{l}</Link></li>)}
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-10 text-[#c084fc]">Experience</h4>
            <ul className="space-y-5 text-[10px] font-bold text-white/30 uppercase tracking-widest">
              {["Consultation", "Gift_Sets", "Refills", "Boutiques"].map(l => <li key={l} className="hover:text-white transition-colors"><Link href="#">{l}</Link></li>)}
            </ul>
          </div>
        </div>
        <div className="max-w-[1500px] mx-auto mt-32 pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12 text-[9px] font-bold text-white/10 uppercase tracking-widest">
          <span>&copy; 2026 MAISON ÉCLAT. ALL RIGHTS RESERVED.</span>
          <div className="flex gap-10 font-mono"><span>EST_1886</span><span>GRASSE_FRANCE</span></div>
        </div>
      </footer>
    </div>
  );
}
