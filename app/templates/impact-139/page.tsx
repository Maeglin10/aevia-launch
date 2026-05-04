"use client";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Gauge, Zap, Timer, Menu, X, ArrowRight, Shield, Fuel, Wind, Settings, Trophy, Car } from "lucide-react";
import "../premium.css";

const MODELS = [
  { id: "gt", name: "APEX GT", tagline: "Grand Touring Perfection", hp: "620", torque: "590", zero: "3.2s", top: "318 km/h", price: "$142,000", status: "CONFIGURE" },
  { id: "rs", name: "APEX RS", tagline: "Track-Bred Intensity", hp: "780", torque: "650", zero: "2.8s", top: "340 km/h", price: "$198,000", status: "PRE-ORDER" },
  { id: "ev", name: "APEX EV", tagline: "Electric Revolution", hp: "950", torque: "1,100", zero: "2.1s", top: "280 km/h", price: "$165,000", status: "RESERVE" },
];

const SPECS = [
  { label: "POWER_HP", val: 780, max: 1000, color: "#dc2626" },
  { label: "TORQUE_NM", val: 650, max: 1200, color: "#dc2626" },
  { label: "DOWNFORCE_KG", val: 420, max: 600, color: "#dc2626" },
  { label: "WEIGHT_KG", val: 1480, max: 2000, color: "#dc2626" },
];

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay }}>{children}</motion.div>;
}

export default function ApexAutomotivePage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeModel, setActiveModel] = useState("rs");
  useEffect(() => { const h = () => setScrolled(window.scrollY > 50); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h); }, []);

  const current = MODELS.find(m => m.id === activeModel) || MODELS[1];

  return (
    <div className="premium-theme min-h-screen bg-[#0a0a0a] text-white font-mono selection:bg-[#dc2626] selection:text-black overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,#dc262610_0%,transparent_50%)]" />
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: `linear-gradient(rgba(220,38,38,0.1) 1px, transparent 1px)`, backgroundSize: "1px 80px" }} />
      </div>

      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? "bg-[#0a0a0a]/90 backdrop-blur-xl py-4 border-b border-white/5" : "bg-transparent py-10"}`}>
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-3 text-xl font-black tracking-tighter">
            <div className="w-8 h-8 bg-[#dc2626] rounded-sm flex items-center justify-center text-white"><Gauge className="w-4 h-4" /></div>
            <span className="group-hover:text-[#dc2626] transition-colors">APEX // <span className="text-white/30">MOTORS</span></span>
          </Link>
          <div className="hidden lg:flex items-center gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">
            {["Models", "Performance", "Heritage", "Configure"].map(l => <Link key={l} href="#" className="hover:text-[#dc2626] transition-colors">{l}</Link>)}
          </div>
          <button className="px-6 py-2.5 bg-[#dc2626] text-white text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all hidden md:block">Configure</button>
          <button onClick={() => setMenuOpen(true)} className="lg:hidden text-white/60"><Menu className="w-6 h-6" /></button>
        </div>
      </nav>

      <AnimatePresence>{menuOpen && (
        <motion.div initial={{ opacity: 0, x: "100%" }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: "100%" }} className="fixed inset-0 z-[100] bg-[#0a0a0a] p-8 flex flex-col pt-32">
          <button onClick={() => setMenuOpen(false)} className="absolute top-10 right-8 text-white/40"><X className="w-10 h-10" /></button>
          {["Models", "Performance", "Heritage", "Configure"].map(l => <Link key={l} href="#" onClick={() => setMenuOpen(false)} className="text-5xl font-black tracking-tighter uppercase mb-10">{l}</Link>)}
        </motion.div>
      )}</AnimatePresence>

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col justify-center pt-20">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 w-full relative z-10">
          <Reveal>
            <div className="flex items-center gap-4 mb-8">
              <div className="px-3 py-1 bg-[#dc2626]/10 border border-[#dc2626]/30 text-[#dc2626] text-[9px] font-bold uppercase tracking-widest">2026_LINEUP</div>
              <div className="text-[9px] text-white/20 tracking-widest uppercase">ENGINEERED IN GERMANY</div>
            </div>
            <h1 className="text-7xl md:text-9xl lg:text-[11rem] font-black leading-[0.8] tracking-tighter uppercase mb-10">
              Born <br /> To <br /> <span className="text-[#dc2626]">Perform.</span>
            </h1>
            <p className="max-w-xl text-lg text-white/30 leading-relaxed font-light uppercase tracking-widest italic mb-12">
              Three decades of motorsport heritage. Every curve engineered, every detail obsessed over.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <button className="px-12 py-5 bg-[#dc2626] text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all shadow-[0_0_50px_rgba(220,38,38,0.2)]">Explore_Models</button>
              <button className="px-12 py-5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all">Book_Test_Drive</button>
            </div>
          </Reveal>
        </div>
        {/* RPM gauge animation */}
        <div className="absolute right-12 bottom-32 hidden xl:block opacity-10">
          <motion.div animate={{ rotate: [0, 220] }} transition={{ duration: 3, ease: "easeOut" }} className="w-64 h-64 border-4 border-[#dc2626] rounded-full relative">
            <motion.div animate={{ rotate: [0, 220] }} transition={{ duration: 3, ease: "easeOut" }} className="absolute top-1/2 left-1/2 w-1 h-28 bg-[#dc2626] origin-bottom -translate-x-1/2 -translate-y-full" />
          </motion.div>
        </div>
      </section>

      {/* MODEL SELECTOR */}
      <section className="py-40 bg-[#0c0c0c] border-y border-white/5">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <Reveal><h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85] mb-16">The <span className="text-[#dc2626]">Lineup.</span></h2></Reveal>
          {/* Tabs */}
          <div className="flex gap-2 mb-16">
            {MODELS.map(m => (
              <button key={m.id} onClick={() => setActiveModel(m.id)}
                className={`px-8 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${activeModel === m.id ? "bg-[#dc2626] text-white" : "bg-white/5 text-white/30 hover:text-white"}`}>{m.name}</button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={current.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
                <div>
                  <div className="w-full aspect-video bg-gradient-to-br from-[#dc2626]/10 to-transparent rounded-3xl flex items-center justify-center border border-white/5">
                    <Car className="w-24 h-24 text-[#dc2626]/20" />
                  </div>
                </div>
                <div>
                  <h3 className="text-5xl font-black uppercase tracking-tighter mb-4">{current.name}</h3>
                  <p className="text-lg text-white/30 italic mb-10">{current.tagline}</p>
                  <div className="grid grid-cols-2 gap-8 mb-12">
                    {[{ label: "POWER", val: `${current.hp} HP` }, { label: "TORQUE", val: `${current.torque} NM` }, { label: "0-100", val: current.zero }, { label: "TOP_SPEED", val: current.top }].map((s, i) => (
                      <div key={i} className="p-6 bg-white/[0.03] border border-white/5 rounded-xl">
                        <div className="text-[8px] font-bold text-white/20 uppercase tracking-widest mb-2">{s.label}</div>
                        <div className="text-2xl font-black text-white">{s.val}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-8 border-t border-white/5">
                    <div className="text-3xl font-black text-[#dc2626]">{current.price}</div>
                    <button className="px-10 py-4 bg-[#dc2626] text-white text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">{current.status}</button>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ENGINEERING */}
      <section className="py-40 bg-[#0a0a0a]">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-32">
            <div>
              <Reveal>
                <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#dc2626] mb-6 block">Engineering</span>
                <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-12 uppercase">Built <span className="text-white/15">Different.</span></h2>
              </Reveal>
              <Reveal delay={0.2}>
                <div className="p-10 bg-[#0c0c0c] border border-white/5 rounded-2xl">
                  <div className="text-[8px] font-bold text-white/20 uppercase tracking-widest mb-8">PERFORMANCE_TELEMETRY</div>
                  <div className="space-y-8">
                    {SPECS.map((s, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-[8px] font-bold uppercase tracking-widest mb-3">
                          <span className="text-white/40">{s.label}</span>
                          <span className="text-[#dc2626]">{s.val}</span>
                        </div>
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} whileInView={{ width: `${(s.val / s.max) * 100}%` }} transition={{ duration: 2, delay: 0.3 + i * 0.1 }} viewport={{ once: true }}
                            className="h-full rounded-full bg-[#dc2626]" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
            <div>
              <Reveal delay={0.1}>
                <div className="grid grid-cols-1 gap-8">
                  {[{ icon: <Wind className="w-5 h-5" />, title: "ACTIVE_AERO", desc: "Dynamic spoiler and diffuser adjust in real-time for optimal downforce." },
                    { icon: <Settings className="w-5 h-5" />, title: "DUAL_CLUTCH", desc: "8-speed PDK transmission with launch control and rev-match downshifts." },
                    { icon: <Shield className="w-5 h-5" />, title: "CARBON_MONOCOQUE", desc: "Full carbon fiber tub weighing just 82kg. Stiffest in class." }
                  ].map((f, i) => (
                    <div key={i} className="group p-10 bg-[#0c0c0c] border border-white/5 hover:border-[#dc2626]/30 rounded-2xl transition-all">
                      <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-[#dc2626] mb-6 group-hover:bg-[#dc2626] group-hover:text-white transition-all">{f.icon}</div>
                      <h3 className="text-xl font-black uppercase tracking-tighter mb-3 group-hover:text-[#dc2626] transition-colors">{f.title}</h3>
                      <p className="text-sm text-white/30">{f.desc}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* HERITAGE */}
      <section className="py-40 bg-[#0c0c0c] border-y border-white/5 text-center">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-16">
              {[{ label: "RACE_WINS", val: "147" }, { label: "CHAMPIONSHIPS", val: "12" }, { label: "YEARS_RACING", val: "34" }, { label: "COUNTRIES", val: "28" }].map((s, i) => (
                <div key={i} className="group"><div className="text-4xl md:text-5xl font-black text-white mb-4 group-hover:text-[#dc2626] transition-colors">{s.val}</div><div className="text-[9px] font-black text-white/15 uppercase tracking-widest">{s.label}</div></div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-40 bg-[#0a0a0a] text-center">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <Reveal>
            <h2 className="text-6xl md:text-9xl font-black tracking-tighter uppercase mb-12">Your <span className="text-[#dc2626]">Turn.</span></h2>
            <p className="max-w-xl mx-auto text-sm text-white/30 leading-relaxed font-light mb-16 uppercase tracking-widest italic">Schedule a private viewing or configure your Apex online.</p>
            <button className="px-16 py-6 bg-[#dc2626] text-white text-[12px] font-black uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all shadow-[0_0_60px_rgba(220,38,38,0.15)]">Configure_Yours</button>
          </Reveal>
        </div>
      </section>

      <footer className="bg-[#0a0a0a] border-t border-white/5 py-32 px-6 md:px-12">
        <div className="max-w-[1500px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-24">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-3 text-xl font-black tracking-tighter mb-10"><div className="w-8 h-8 bg-[#dc2626] text-white rounded-sm flex items-center justify-center"><Gauge className="w-4 h-4" /></div><span>APEX // MOTORS</span></Link>
            <p className="text-[11px] text-white/15 uppercase tracking-[0.2em] max-w-sm leading-relaxed italic">Performance engineering since 1992. Born on the track.</p>
          </div>
          <div><h4 className="text-[10px] font-black uppercase tracking-widest mb-10 text-[#dc2626]">Models</h4><ul className="space-y-5 text-[10px] font-bold text-white/20 uppercase tracking-widest">{["Apex_GT", "Apex_RS", "Apex_EV", "Heritage"].map(l => <li key={l}><Link href="#">{l}</Link></li>)}</ul></div>
          <div><h4 className="text-[10px] font-black uppercase tracking-widest mb-10 text-[#dc2626]">Experience</h4><ul className="space-y-5 text-[10px] font-bold text-white/20 uppercase tracking-widest">{["Test_Drive", "Dealers", "Motorsport", "Events"].map(l => <li key={l}><Link href="#">{l}</Link></li>)}</ul></div>
        </div>
        <div className="max-w-[1500px] mx-auto mt-32 pt-16 border-t border-white/5 text-center text-[9px] font-bold text-white/10 uppercase tracking-widest">&copy; 2026 APEX MOTORS</div>
      </footer>
    </div>
  );
}
