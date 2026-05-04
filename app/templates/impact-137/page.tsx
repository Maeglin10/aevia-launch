"use client";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Coffee, MapPin, Leaf, Menu, X, ArrowRight, Thermometer, Timer, Award, Globe, Heart } from "lucide-react";
import "../premium.css";

const ORIGINS = [
  { id: "eth", name: "YIRGACHEFFE", country: "Ethiopia", altitude: "1,900m", process: "WASHED", notes: "Jasmine, bergamot, honey", score: 92 },
  { id: "col", name: "HUILA", country: "Colombia", altitude: "1,750m", process: "NATURAL", notes: "Dark cherry, chocolate, caramel", score: 89 },
  { id: "ken", name: "NYERI AA", country: "Kenya", altitude: "1,850m", process: "WASHED", notes: "Blackcurrant, grapefruit, brown sugar", score: 91 },
  { id: "gua", name: "ANTIGUA", country: "Guatemala", altitude: "1,500m", process: "HONEY", notes: "Almond, cocoa, tangerine", score: 87 },
  { id: "jpn", name: "GEISHA", country: "Panama", altitude: "1,600m", process: "WASHED", notes: "Tropical fruit, jasmine, white tea", score: 95 },
];

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay }}>{children}</motion.div>;
}

export default function TorrefieCoffeePage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => { const h = () => setScrolled(window.scrollY > 50); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h); }, []);

  return (
    <div className="premium-theme min-h-screen bg-[#f5efe6] text-[#2c1810] font-mono selection:bg-[#8b4513] selection:text-white overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='50' cy='50' r='1' fill='%238b4513'/%3E%3C/svg%3E")`, backgroundSize: "40px 40px" }} />

      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? "bg-[#f5efe6]/90 backdrop-blur-xl py-4 border-b border-[#2c1810]/5" : "bg-transparent py-10"}`}>
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-3 text-xl font-black tracking-tighter">
            <div className="w-8 h-8 bg-[#8b4513] rounded-full flex items-center justify-center text-white"><Coffee className="w-4 h-4" /></div>
            <span className="group-hover:text-[#8b4513] transition-colors">TORRÉFIÉ // <span className="text-[#2c1810]/30">COFFEE</span></span>
          </Link>
          <div className="hidden lg:flex items-center gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-[#2c1810]/30">
            {["Origins", "Roastery", "Subscribe", "Visit"].map(l => <Link key={l} href="#" className="hover:text-[#8b4513] transition-colors">{l}</Link>)}
          </div>
          <button className="px-6 py-2.5 bg-[#2c1810] text-[#f5efe6] text-[10px] font-black uppercase tracking-widest hover:bg-[#8b4513] transition-all hidden md:block">Shop_Beans</button>
          <button onClick={() => setMenuOpen(true)} className="lg:hidden text-[#2c1810]/40"><Menu className="w-6 h-6" /></button>
        </div>
      </nav>

      <AnimatePresence>{menuOpen && (
        <motion.div initial={{ opacity: 0, x: "100%" }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: "100%" }} className="fixed inset-0 z-[100] bg-[#f5efe6] p-8 flex flex-col pt-32">
          <button onClick={() => setMenuOpen(false)} className="absolute top-10 right-8 text-[#2c1810]/40"><X className="w-10 h-10" /></button>
          {["Origins", "Roastery", "Subscribe", "Visit"].map(l => <Link key={l} href="#" onClick={() => setMenuOpen(false)} className="text-5xl font-black tracking-tighter uppercase mb-10">{l}</Link>)}
        </motion.div>
      )}</AnimatePresence>

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col justify-center pt-20">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 w-full relative z-10">
          <Reveal>
            <div className="flex items-center gap-4 mb-8">
              <div className="px-3 py-1 bg-[#8b4513]/10 border border-[#8b4513]/30 text-[#8b4513] text-[9px] font-bold uppercase tracking-widest">ROASTING_DAILY</div>
              <div className="text-[9px] text-[#2c1810]/20 tracking-widest uppercase">EST. 2016 // LYON, FRANCE</div>
            </div>
            <h1 className="text-7xl md:text-9xl lg:text-[11rem] font-black leading-[0.8] tracking-tighter uppercase mb-10">
              From <br /> Seed <br /> To <br /> <span className="text-[#8b4513]">Cup.</span>
            </h1>
            <p className="max-w-xl text-lg text-[#2c1810]/40 leading-relaxed font-light uppercase tracking-widest italic mb-12">
              Single-origin specialty coffee. Roasted daily in small batches. Sourced directly from farmers we know by name.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <button className="px-12 py-5 bg-[#2c1810] text-[#f5efe6] text-[10px] font-black uppercase tracking-[0.4em] hover:bg-[#8b4513] transition-all">Explore_Origins</button>
              <button className="px-12 py-5 border border-[#2c1810]/10 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-[#2c1810] hover:text-[#f5efe6] transition-all">Visit_Roastery</button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ORIGINS GRID */}
      <section className="py-40 bg-white border-y border-[#2c1810]/5">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <Reveal><h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85] mb-24">Current <span className="text-[#8b4513]">Origins.</span></h2></Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {ORIGINS.map((o, i) => (
              <Reveal key={o.id} delay={i * 0.05}>
                <div className="group bg-[#f5efe6] border border-[#2c1810]/5 rounded-3xl p-10 hover:border-[#8b4513]/30 hover:shadow-lg transition-all duration-500 cursor-pointer">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h3 className="text-2xl font-black uppercase tracking-tighter group-hover:text-[#8b4513] transition-colors">{o.name}</h3>
                      <div className="flex items-center gap-2 text-[10px] text-[#2c1810]/30 uppercase tracking-widest mt-2"><MapPin className="w-3 h-3" />{o.country}</div>
                    </div>
                    <div className="text-3xl font-black text-[#8b4513]">{o.score}</div>
                  </div>
                  <p className="text-sm text-[#2c1810]/50 italic mb-8">&ldquo;{o.notes}&rdquo;</p>
                  <div className="flex items-center gap-6 pt-6 border-t border-[#2c1810]/5 text-[9px] font-bold text-[#2c1810]/30 uppercase tracking-widest">
                    <div className="flex items-center gap-2"><Thermometer className="w-3 h-3" />{o.altitude}</div>
                    <div className="flex items-center gap-2"><Leaf className="w-3 h-3" />{o.process}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="py-40 bg-[#f5efe6]">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <Reveal><h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-24 uppercase">Our <span className="text-[#8b4513]">Process.</span></h2></Reveal>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[{ num: "01", name: "SOURCE", desc: "Direct relationships with farmers across 12 origins." },
              { num: "02", name: "CUP", desc: "Every lot cupped and scored before commitment." },
              { num: "03", name: "ROAST", desc: "Small-batch profiles developed for each origin." },
              { num: "04", name: "DELIVER", desc: "Roasted and shipped within 48 hours." }
            ].map((s, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="group p-10 bg-white border border-[#2c1810]/5 hover:border-[#8b4513]/30 rounded-3xl transition-all">
                  <div className="text-5xl font-black text-[#8b4513]/20 mb-6 group-hover:text-[#8b4513] transition-colors">{s.num}</div>
                  <h3 className="text-xl font-black uppercase tracking-tighter mb-4">{s.name}</h3>
                  <p className="text-sm text-[#2c1810]/40">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SUBSCRIPTION */}
      <section className="py-40 bg-[#2c1810] text-[#f5efe6]">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 text-center">
          <Reveal>
            <h2 className="text-6xl md:text-9xl font-black tracking-tighter uppercase mb-12">Never Run <span className="text-[#8b4513]">Out.</span></h2>
            <p className="max-w-xl mx-auto text-sm text-[#f5efe6]/40 leading-relaxed font-light mb-16 uppercase tracking-widest italic">Monthly subscription. Rotating single-origins. Roasted the day we ship.</p>
            <button className="px-16 py-6 bg-[#f5efe6] text-[#2c1810] text-[12px] font-black uppercase tracking-[0.4em] hover:bg-[#8b4513] hover:text-white transition-all">Subscribe_Now</button>
          </Reveal>
        </div>
      </section>

      <footer className="bg-[#2c1810] border-t border-[#f5efe6]/5 py-32 px-6 md:px-12 text-[#f5efe6]">
        <div className="max-w-[1500px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-24">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-3 text-xl font-black tracking-tighter mb-10"><div className="w-8 h-8 bg-[#8b4513] text-white rounded-full flex items-center justify-center"><Coffee className="w-4 h-4" /></div><span>TORRÉFIÉ // COFFEE</span></Link>
            <p className="text-[11px] text-[#f5efe6]/15 uppercase tracking-[0.2em] max-w-sm leading-relaxed italic">Specialty coffee roastery. Small-batch. Single-origin. Lyon, France.</p>
          </div>
          <div><h4 className="text-[10px] font-black uppercase tracking-widest mb-10 text-[#8b4513]">Shop</h4><ul className="space-y-5 text-[10px] font-bold text-[#f5efe6]/20 uppercase tracking-widest">{["All_Beans", "Subscriptions", "Equipment", "Gift_Cards"].map(l => <li key={l}><Link href="#">{l}</Link></li>)}</ul></div>
          <div><h4 className="text-[10px] font-black uppercase tracking-widest mb-10 text-[#8b4513]">Visit</h4><ul className="space-y-5 text-[10px] font-bold text-[#f5efe6]/20 uppercase tracking-widest">{["Roastery", "Café", "Events", "Contact"].map(l => <li key={l}><Link href="#">{l}</Link></li>)}</ul></div>
        </div>
        <div className="max-w-[1500px] mx-auto mt-32 pt-16 border-t border-[#f5efe6]/5 text-center text-[9px] font-bold text-[#f5efe6]/10 uppercase tracking-widest">&copy; 2026 TORRÉFIÉ COFFEE</div>
      </footer>
    </div>
  );
}
