"use client";
import { motion, useInView, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Shirt, Scissors, Crown, Menu, X, ArrowRight, Eye, Camera, Sparkles, Heart, ShoppingBag, Star, Gem, Ruler, Palette, Wind } from "lucide-react";
import "../premium.css";

const MANIFESTS = {
  hero: { pieces: "48", ateliers: "Paris", season: "AW26", status: "COLLECTION_LIVE" },
  lookbook: [
    { id: "nocturne", name: "NOCTURNE // 01", desc: "Structured wool overcoat in obsidian black with asymmetric closure and hand-finished lapels. Lined in Japanese cupro.", category: "OUTERWEAR", price: "€2,400" },
    { id: "lumiere", name: "LUMIÈRE // 02", desc: "Bias-cut silk charmeuse gown in champagne gold. Zero-waste draping technique pioneered by the atelier for this collection.", category: "EVENINGWEAR", price: "€3,800" },
    { id: "brut", name: "BRUT // 03", desc: "Deconstructed raw-edge blazer in undyed Italian linen. Exposed construction as design language. Gender-fluid sizing.", category: "TAILORING", price: "€1,600" },
    { id: "veil", name: "VOILE // 04", desc: "Layered organza blouse with hand-painted botanical print. Each piece unique — signed and numbered by the artist.", category: "TOPS", price: "€890" },
  ],
  atelier: [
    { name: "PATTERN // CUT", icon: <Scissors className="w-5 h-5" />, desc: "Every pattern is drafted by hand, cut by master tailors with 30+ years of experience in Parisian haute couture." },
    { name: "FABRIC // SOURCE", icon: <Ruler className="w-5 h-5" />, desc: "Exclusively sourced from heritage mills in Italy, Japan, and Scotland. Full traceability from fiber to finished garment." },
    { name: "FINISH // DETAIL", icon: <Gem className="w-5 h-5" />, desc: "Hand-finished details — bound seams, covered snaps, invisible hems. Garments built to last decades, not seasons." },
  ],
  press: [
    { outlet: "VOGUE", quote: "A masterclass in restraint. Maison redefines luxury for those who know." },
    { outlet: "ELLE", quote: "The collection we've been waiting for — timeless, radical, and impeccably made." },
    { outlet: "BOF", quote: "In an era of excess, Maison's AW26 is a quiet revolution." },
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

export default function MaisonFashionPage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => { const h = () => setScrolled(window.scrollY > 50); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h); }, []);

  return (
    <div className="premium-theme min-h-screen bg-[#0a0908] text-white font-mono selection:bg-[#d4a853] selection:text-black overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,#1a1408_0%,transparent_50%)]" />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 100px, rgba(212,168,83,0.05) 100px, rgba(212,168,83,0.05) 101px)` }} />
      </div>

      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? "bg-[#0a0908]/90 backdrop-blur-xl py-4 border-b border-white/5" : "bg-transparent py-10"}`}>
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="group text-2xl tracking-[0.4em] uppercase">
            <span className="font-light group-hover:text-[#d4a853] transition-colors" style={{ fontFamily: "Georgia, serif" }}>MAISON</span>
          </Link>
          <div className="hidden lg:flex items-center gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
            {["Collection", "Atelier", "Lookbook", "Boutiques"].map(l => <Link key={l} href="#" className="hover:text-[#d4a853] transition-colors">{l}</Link>)}
          </div>
          <div className="flex items-center gap-6">
            <MagneticBtn className="px-6 py-2.5 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-[#d4a853] transition-all">Shop_AW26</MagneticBtn>
            <button onClick={() => setMenuOpen(true)} className="lg:hidden text-white/60"><Menu className="w-6 h-6" /></button>
          </div>
        </div>
      </nav>

      <AnimatePresence>{menuOpen && (
        <motion.div initial={{ opacity: 0, x: "100%" }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: "100%" }} className="fixed inset-0 z-[100] bg-[#0a0908] p-8 flex flex-col pt-32">
          <button onClick={() => setMenuOpen(false)} className="absolute top-10 right-8 text-white/40"><X className="w-10 h-10" /></button>
          <div className="flex flex-col gap-10 text-5xl font-light tracking-wider uppercase" style={{ fontFamily: "Georgia, serif" }}>
            {["Collection", "Atelier", "Lookbook", "Boutiques"].map(l => <Link key={l} href="#" onClick={() => setMenuOpen(false)}>{l}</Link>)}
          </div>
        </motion.div>
      )}</AnimatePresence>

      {/* HERO */}
      <section className="relative h-screen flex flex-col justify-center pt-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-[#d4a853]/5 rounded-full" />
          <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 10, repeat: Infinity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-[#d4a853]/8 rounded-full" />
        </div>
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 w-full relative z-10">
          <Reveal>
            <div className="flex items-center gap-4 mb-8">
              <div className="px-3 py-1 bg-[#d4a853]/10 border border-[#d4a853]/30 text-[#d4a853] text-[9px] font-bold uppercase tracking-widest">{MANIFESTS.hero.season}</div>
              <div className="text-[9px] text-white/30 tracking-widest uppercase">PIECES: {MANIFESTS.hero.pieces} // ATELIER: {MANIFESTS.hero.ateliers}</div>
            </div>
            <h1 className="text-7xl md:text-9xl lg:text-[11rem] leading-[0.8] tracking-tight uppercase mb-10" style={{ fontFamily: "Georgia, serif", fontWeight: 400 }}>
              Autumn <br /> <span className="text-[#d4a853] italic">Winter</span> <br /> <span className="text-white/15">2026.</span>
            </h1>
            <p className="max-w-2xl text-xl text-white/40 leading-relaxed font-light mb-12 uppercase tracking-widest italic">
              A study in restraint. 48 pieces crafted from heritage fabrics, cut by hand in our Paris atelier. Permanence over trend.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <button className="px-12 py-5 bg-[#d4a853] text-black text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white transition-all shadow-[0_0_50px_rgba(212,168,83,0.15)]">View_Lookbook</button>
              <button className="px-12 py-5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all">Shop_Collection</button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* LOOKBOOK */}
      <section className="py-40 bg-[#0d0c0a] border-y border-white/5">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
            <Reveal><h2 className="text-6xl md:text-8xl tracking-tighter uppercase leading-[0.85]" style={{ fontFamily: "Georgia, serif", fontWeight: 400 }}>The <br /> <span className="text-[#d4a853] italic">Lookbook.</span></h2></Reveal>
            <p className="max-w-md text-sm text-white/30 leading-relaxed uppercase tracking-widest font-light italic">Each look photographed in natural light at our 18th-century atelier in the Marais.</p>
          </div>
          <div className="space-y-2">
            {MANIFESTS.lookbook.map((l, i) => (
              <Reveal key={l.id} delay={i * 0.05}>
                <div className="group flex flex-col md:flex-row justify-between items-center p-10 md:p-14 border-b border-white/5 hover:bg-white/2 transition-all cursor-pointer">
                  <div className="flex-1 mb-6 md:mb-0">
                    <div className="flex items-center gap-6 mb-4">
                      <h3 className="text-3xl md:text-4xl uppercase tracking-tighter group-hover:text-[#d4a853] transition-colors" style={{ fontFamily: "Georgia, serif", fontWeight: 400 }}>{l.name}</h3>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-white/20">{l.category}</span>
                    </div>
                    <p className="text-sm text-white/40 leading-relaxed max-w-2xl italic">"{l.desc}"</p>
                  </div>
                  <div className="flex items-center gap-8">
                    <span className="text-lg font-light text-[#d4a853]" style={{ fontFamily: "Georgia, serif" }}>{l.price}</span>
                    <motion.div className="opacity-0 group-hover:opacity-100 transition-opacity"><ArrowRight className="w-5 h-5 text-[#d4a853]" /></motion.div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ATELIER */}
      <section className="py-40 bg-[#0a0908]">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <Reveal>
            <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#d4a853] mb-6 block">Craftsmanship</span>
            <h2 className="text-6xl md:text-8xl tracking-tighter leading-[0.85] mb-24 uppercase" style={{ fontFamily: "Georgia, serif", fontWeight: 400 }}>The <br /> <span className="text-white/15 italic">Atelier.</span></h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {MANIFESTS.atelier.map((a, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="group p-12 bg-[#0d0c0a] border border-white/5 hover:border-[#d4a853]/30 transition-all flex flex-col h-full rounded-3xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#d4a853]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-16 h-16 bg-white/5 border border-white/5 rounded-full flex items-center justify-center text-[#d4a853] mb-12 group-hover:bg-[#d4a853] group-hover:text-black transition-all">{a.icon}</div>
                  <h3 className="text-2xl uppercase mb-6 tracking-tighter group-hover:text-[#d4a853] transition-colors" style={{ fontFamily: "Georgia, serif" }}>{a.name}</h3>
                  <p className="text-sm text-white/40 leading-relaxed italic">"{a.desc}"</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PRESS */}
      <section className="py-40 bg-[#0d0c0a] border-y border-white/5 text-center overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <Reveal>
            <h2 className="text-6xl md:text-8xl tracking-tighter uppercase leading-[0.85] mb-24" style={{ fontFamily: "Georgia, serif", fontWeight: 400 }}>Press <br /> <em className="text-[#d4a853]">Voices.</em></h2>
          </Reveal>
          <div className="space-y-20">
            {MANIFESTS.press.map((p, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="text-center">
                  <p className="text-2xl md:text-3xl text-white/60 leading-relaxed mb-8 italic max-w-3xl mx-auto" style={{ fontFamily: "Georgia, serif" }}>&ldquo;{p.quote}&rdquo;</p>
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#d4a853]">— {p.outlet}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-40 bg-[#0a0908]">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 text-center">
          <Reveal>
            <h2 className="text-6xl md:text-9xl tracking-tighter uppercase mb-12" style={{ fontFamily: "Georgia, serif", fontWeight: 400 }}>Wear <br /> <span className="text-[#d4a853] italic">Forever.</span></h2>
            <p className="max-w-2xl mx-auto text-sm text-white/40 leading-relaxed font-light mb-16 uppercase tracking-widest italic">Garments that outlast trends. Visit our boutique or shop the AW26 collection online.</p>
            <MagneticBtn className="px-16 py-6 bg-white text-black text-[12px] font-black uppercase tracking-[0.4em] hover:bg-[#d4a853] transition-all shadow-[0_0_60px_rgba(212,168,83,0.1)]">Enter_Boutique</MagneticBtn>
          </Reveal>
        </div>
      </section>

      <footer className="bg-[#0a0908] border-t border-white/5 py-32 px-6 md:px-12">
        <div className="max-w-[1500px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-24">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="text-2xl tracking-[0.4em] uppercase mb-10 block" style={{ fontFamily: "Georgia, serif" }}>MAISON</Link>
            <p className="text-[11px] text-white/20 uppercase tracking-[0.2em] max-w-sm leading-relaxed mb-16 italic">Paris, since 1947. Craftsmanship, permanence, restraint.</p>
            <div className="flex gap-8">{[Crown, Heart, Eye].map((Icon, i) => <button key={i} className="text-white/20 hover:text-[#d4a853] transition-colors"><Icon className="w-5 h-5" /></button>)}</div>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-10 text-[#d4a853]">Shop</h4>
            <ul className="space-y-5 text-[10px] font-bold text-white/30 uppercase tracking-widest">
              {["AW26_Collection", "Accessories", "Made_to_Order", "Gift_Guide"].map(l => <li key={l} className="hover:text-white transition-colors"><Link href="#">{l}</Link></li>)}
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-10 text-[#d4a853]">Maison</h4>
            <ul className="space-y-5 text-[10px] font-bold text-white/30 uppercase tracking-widest">
              {["Heritage", "Atelier_Visit", "Sustainability", "Careers"].map(l => <li key={l} className="hover:text-white transition-colors"><Link href="#">{l}</Link></li>)}
            </ul>
          </div>
        </div>
        <div className="max-w-[1500px] mx-auto mt-32 pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12 text-[9px] font-bold text-white/10 uppercase tracking-widest">
          <span>&copy; 2026 MAISON. ALL RIGHTS RESERVED.</span>
          <div className="flex gap-10 font-mono"><span>PARIS_FR</span><span>EST_1947</span></div>
        </div>
      </footer>
    </div>
  );
}
