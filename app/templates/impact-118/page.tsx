"use client";
import { motion, useInView, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Building2, Ruler, Compass, Menu, X, ArrowRight, Layers, Grid3X3, PenTool, Square, Triangle, Maximize, Scan, Frame, Warehouse, Mountain } from "lucide-react";
import "../premium.css";

const MANIFESTS = {
  hero: { projects: "340+", sqft: "12M ft²", awards: "47", status: "STUDIO_ACTIVE" },
  portfolio: [
    { id: "meridian", name: "MERIDIAN // TOWER", desc: "52-story mixed-use high-rise with parametric glass curtain wall and sky-bridge connectivity to adjacent transit hub.", icon: <Building2 className="w-5 h-5" />, specs: ["780,000 ft²", "LEED Platinum", "Seismic Zone 4"] },
    { id: "terraform", name: "TERRAFORM // CAMPUS", desc: "Biophilic corporate campus integrating living walls, rainwater harvesting, and mass-timber structural system throughout.", icon: <Mountain className="w-5 h-5" />, specs: ["24-Acre Site", "Net-Zero Energy", "Mass Timber CLT"] },
    { id: "vaulted", name: "VAULT // MUSEUM", desc: "Underground museum complex with natural zenithal lighting through parametric concrete shell roof structures.", icon: <Warehouse className="w-5 h-5" />, specs: ["120,000 ft²", "Subterranean", "Natural Light Only"] },
  ],
  telemetry: [
    { label: "STRUCTURAL_INTEGRITY", val: 99, color: "#38bdf8" },
    { label: "ENERGY_EFFICIENCY", val: 94, color: "#38bdf8" },
    { label: "DAYLIGHTING_RATIO", val: 87, color: "#22c55e" },
    { label: "MATERIAL_SUSTAIN", val: 91, color: "#38bdf8" },
  ],
  timeline: [
    { phase: "CONCEPT", project: "Meridian Tower", status: "Complete", year: "2024" },
    { phase: "SCHEMATIC", project: "Terraform Campus", status: "In Review", year: "2025" },
    { phase: "DD / CD", project: "Vault Museum", status: "Active", year: "2025" },
    { phase: "CONSTRUCTION", project: "Apex Pavilion", status: "On Site", year: "2026" },
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

export default function FormwerkStudioPage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => { const h = () => setScrolled(window.scrollY > 50); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h); }, []);

  return (
    <div className="premium-theme min-h-screen bg-[#050709] text-white font-mono selection:bg-[#38bdf8] selection:text-black overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,#051525_0%,transparent_50%)]" />
        {/* Blueprint grid */}
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `linear-gradient(rgba(56,189,248,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.3) 1px, transparent 1px)`, backgroundSize: "80px 80px" }} />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `linear-gradient(rgba(56,189,248,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.2) 1px, transparent 1px)`, backgroundSize: "16px 16px" }} />
      </div>

      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? "bg-[#050709]/90 backdrop-blur-xl py-4 border-b border-white/5" : "bg-transparent py-10"}`}>
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-3 text-xl font-black tracking-tighter">
            <div className="w-8 h-8 bg-[#38bdf8] rounded-sm flex items-center justify-center text-black"><Compass className="w-5 h-5" /></div>
            <span className="group-hover:text-[#38bdf8] transition-colors">FORMWERK // <span className="text-white/40">STUDIO</span></span>
          </Link>
          <div className="hidden lg:flex items-center gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
            {["Portfolio", "Practice", "Materials", "Contact"].map(l => <Link key={l} href="#" className="hover:text-[#38bdf8] transition-colors">{l}</Link>)}
          </div>
          <div className="flex items-center gap-6">
            <MagneticBtn className="px-6 py-2.5 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-[#38bdf8] transition-all">Commission</MagneticBtn>
            <button onClick={() => setMenuOpen(true)} className="lg:hidden text-white/60"><Menu className="w-6 h-6" /></button>
          </div>
        </div>
      </nav>

      <AnimatePresence>{menuOpen && (
        <motion.div initial={{ opacity: 0, x: "100%" }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: "100%" }} className="fixed inset-0 z-[100] bg-[#050709] p-8 flex flex-col pt-32">
          <button onClick={() => setMenuOpen(false)} className="absolute top-10 right-8 text-white/40"><X className="w-10 h-10" /></button>
          <div className="flex flex-col gap-10 text-5xl font-black tracking-tighter uppercase">
            {["Portfolio", "Practice", "Materials", "Contact"].map(l => <Link key={l} href="#" onClick={() => setMenuOpen(false)}>{l}</Link>)}
          </div>
        </motion.div>
      )}</AnimatePresence>

      {/* HERO */}
      <section className="relative h-screen flex flex-col justify-center pt-20 overflow-hidden">
        {/* Architectural lines */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div key={i} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 2, delay: 0.5 + i * 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="absolute h-px bg-gradient-to-r from-transparent via-[#38bdf8]/20 to-transparent origin-left" style={{ top: `${25 + i * 12}%`, width: "100%" }} />
          ))}
          {[...Array(3)].map((_, i) => (
            <motion.div key={`v${i}`} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 2, delay: 1 + i * 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="absolute w-px bg-gradient-to-b from-transparent via-[#38bdf8]/10 to-transparent origin-top" style={{ left: `${30 + i * 20}%`, height: "100%" }} />
          ))}
        </div>
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-8">
              <Reveal>
                <div className="flex items-center gap-4 mb-8">
                  <div className="px-3 py-1 bg-[#38bdf8]/10 border border-[#38bdf8]/30 text-[#38bdf8] text-[9px] font-bold uppercase tracking-widest">{MANIFESTS.hero.status}</div>
                  <div className="text-[9px] text-white/30 tracking-widest uppercase">PROJECTS: {MANIFESTS.hero.projects} // AREA: {MANIFESTS.hero.sqft}</div>
                </div>
                <h1 className="text-7xl md:text-9xl lg:text-[11rem] font-black leading-[0.8] tracking-tighter uppercase mb-10">
                  Form <br /> <span className="text-[#38bdf8]">Follows.</span> <br /> Force. <br /> <span className="text-white/20">Always.</span>
                </h1>
                <p className="max-w-2xl text-xl text-white/40 leading-relaxed font-light mb-12 uppercase tracking-widest italic">
                  Architecture that performs. Structures engineered for beauty, resilience, and environmental responsibility. Every line has purpose.
                </p>
                <div className="flex flex-col sm:flex-row gap-6">
                  <button className="px-12 py-5 bg-[#38bdf8] text-black text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white transition-all shadow-[0_0_50px_rgba(56,189,248,0.2)]">View_Portfolio</button>
                  <button className="px-12 py-5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all">Our_Practice</button>
                </div>
              </Reveal>
            </div>
            <div className="lg:col-span-4 relative hidden lg:block">
              <Reveal delay={0.2}>
                <div className="relative aspect-square bg-[#080b10] border border-white/5 p-12 rounded-3xl overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#38bdf8]/5 to-transparent" />
                  <div className="relative h-full flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div><div className="text-[8px] font-bold text-white/20 uppercase tracking-widest">AWARDS_WON</div><div className="text-xl font-black text-[#38bdf8]">{MANIFESTS.hero.awards}</div></div>
                      <div className="w-10 h-10 border border-white/5 rounded-full flex items-center justify-center"><Ruler className="w-5 h-5 text-white/20" /></div>
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
                      <span>AIA_GOLD_MEDALIST</span>
                      <div className="flex items-center gap-2 text-[#38bdf8]"><div className="w-1.5 h-1.5 bg-[#38bdf8] rounded-full" /><span>ACTIVE</span></div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* PORTFOLIO */}
      <section className="py-40 bg-[#080b10] border-y border-white/5">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
            <Reveal><h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85]">Selected <br /> <span className="text-[#38bdf8]">Works.</span></h2></Reveal>
            <p className="max-w-md text-sm text-white/30 leading-relaxed uppercase tracking-widest font-light italic">Award-winning structures spanning civic, cultural, and commercial typologies across three continents.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {MANIFESTS.portfolio.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.1}>
                <div className="group p-12 bg-[#080b10] border border-white/5 hover:border-[#38bdf8]/30 transition-all flex flex-col h-full rounded-3xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#38bdf8]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-16 h-16 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center text-[#38bdf8] mb-12 group-hover:bg-[#38bdf8] group-hover:text-black transition-all">{p.icon}</div>
                  <h3 className="text-3xl font-black uppercase mb-6 tracking-tighter group-hover:text-[#38bdf8] transition-colors">{p.name}</h3>
                  <p className="text-sm text-white/40 leading-relaxed mb-12 flex-1 italic">"{p.desc}"</p>
                  <div className="space-y-5 pt-10 border-t border-white/5">
                    {p.specs.map((s, j) => <div key={j} className="flex items-center gap-4 text-[9px] font-bold text-white/20 uppercase tracking-widest"><div className="w-1.5 h-1.5 bg-[#38bdf8] rotate-45" />{s}</div>)}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="py-40 bg-[#050709]">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-32 items-center">
            <div className="lg:col-span-6">
              <Reveal>
                <div className="relative aspect-video bg-[#080b10] border border-white/5 rounded-2xl overflow-hidden p-8">
                  <div className="absolute top-6 left-6 text-[8px] font-bold text-white/20 tracking-widest uppercase">SECTION_DETAIL</div>
                  {/* Architectural section drawing */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-3/4 h-3/4">
                      {/* Floor plates */}
                      {[...Array(6)].map((_, i) => (
                        <motion.div key={i} initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} transition={{ duration: 1, delay: i * 0.15 }} viewport={{ once: true }}
                          className="absolute h-px bg-[#38bdf8]/20 origin-left" style={{ bottom: `${i * 18}%`, width: `${90 - i * 8}%`, left: `${i * 4}%` }} />
                      ))}
                      {/* Columns */}
                      {[...Array(4)].map((_, i) => (
                        <motion.div key={`c${i}`} initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} transition={{ duration: 1.2, delay: 0.5 + i * 0.1 }} viewport={{ once: true }}
                          className="absolute w-px bg-[#38bdf8]/30 origin-bottom" style={{ left: `${15 + i * 22}%`, bottom: 0, height: "90%" }} />
                      ))}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#38bdf8]/20" />
                    </div>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center text-[8px] font-bold text-white/20 tracking-widest uppercase">
                    <span>SCALE: 1:200</span><div className="text-[#38bdf8]">SECTION_A-A</div>
                  </div>
                </div>
              </Reveal>
            </div>
            <div className="lg:col-span-6">
              <Reveal>
                <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#38bdf8] mb-6 block">Project_Timeline</span>
                <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-12 uppercase">Design <br /> <span className="text-white/20">Phases.</span></h2>
                <div className="space-y-8">
                  {MANIFESTS.timeline.map((t, i) => (
                    <div key={i} className="group flex flex-col md:flex-row justify-between items-center p-8 bg-white/2 border border-white/5 hover:border-[#38bdf8]/30 transition-all">
                      <div className="flex items-center gap-10 mb-6 md:mb-0">
                        <div className="text-2xl font-black uppercase tracking-tighter">{t.phase}</div>
                        <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{t.project}</div>
                      </div>
                      <div className="flex items-center gap-8 text-[10px] font-bold uppercase tracking-widest">
                        <span className="text-white/30">{t.year}</span>
                        <div className="flex items-center gap-3">
                          <div className={`w-1.5 h-1.5 rounded-full ${t.status === "Complete" ? "bg-green-500" : t.status === "On Site" ? "bg-yellow-400 animate-pulse" : "bg-[#38bdf8]"}`} />
                          <span>{t.status}</span>
                        </div>
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
      <section className="py-40 bg-[#080b10] border-y border-white/5 text-center overflow-hidden">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <Reveal>
            <h2 className="text-7xl md:text-[12rem] font-black tracking-tighter uppercase leading-[0.85] mb-12 text-white/5">Built <br /> Form.</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-16 mt-24">
              {[{ label: "PROJECTS_BUILT", val: "340+" }, { label: "TOTAL_AREA", val: "12M ft²" }, { label: "AIA_AWARDS", val: "47" }, { label: "COUNTRIES", val: "18" }].map((s, i) => (
                <div key={i} className="group"><div className="text-5xl font-black text-white mb-4 group-hover:text-[#38bdf8] transition-colors">{s.val}</div><div className="text-[10px] font-black text-white/20 uppercase tracking-widest">{s.label}</div></div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-40 bg-[#050709]">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 text-center">
          <Reveal>
            <h2 className="text-6xl md:text-9xl font-black tracking-tighter uppercase mb-12">Build <br /> <span className="text-[#38bdf8]">Forward.</span></h2>
            <p className="max-w-2xl mx-auto text-sm text-white/40 leading-relaxed font-light mb-16 uppercase tracking-widest italic">Every structure is a statement. Commission Formwerk Studio for architecture that endures, inspires, and performs.</p>
            <MagneticBtn className="px-16 py-6 bg-white text-black text-[12px] font-black uppercase tracking-[0.4em] hover:bg-[#38bdf8] transition-all shadow-[0_0_60px_rgba(56,189,248,0.15)]">Start_Commission</MagneticBtn>
          </Reveal>
        </div>
      </section>

      <footer className="bg-[#050709] border-t border-white/5 py-32 px-6 md:px-12">
        <div className="max-w-[1500px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-24">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-3 text-xl font-black tracking-tighter mb-10"><div className="w-8 h-8 bg-white text-black rounded-sm flex items-center justify-center"><Compass className="w-5 h-5" /></div><span>FORMWERK // STUDIO</span></Link>
            <p className="text-[11px] text-white/20 uppercase tracking-[0.2em] max-w-sm leading-relaxed mb-16 italic">Architecture engineered for beauty, resilience, and environmental stewardship.</p>
            <div className="flex gap-8">{[Building2, Layers, Frame].map((Icon, i) => <button key={i} className="text-white/20 hover:text-[#38bdf8] transition-colors"><Icon className="w-5 h-5" /></button>)}</div>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-10 text-[#38bdf8]">Practice</h4>
            <ul className="space-y-5 text-[10px] font-bold text-white/30 uppercase tracking-widest">
              {["Selected_Works", "Design_Process", "Sustainability", "Awards"].map(l => <li key={l} className="hover:text-white transition-colors"><Link href="#">{l}</Link></li>)}
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-10 text-[#38bdf8]">Connect</h4>
            <ul className="space-y-5 text-[10px] font-bold text-white/30 uppercase tracking-widest">
              {["Commissions", "Press_Room", "Careers", "Studio_Visit"].map(l => <li key={l} className="hover:text-white transition-colors"><Link href="#">{l}</Link></li>)}
            </ul>
          </div>
        </div>
        <div className="max-w-[1500px] mx-auto mt-32 pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12 text-[9px] font-bold text-white/10 uppercase tracking-widest">
          <span>&copy; 2026 FORMWERK STUDIO. ALL RIGHTS RESERVED.</span>
          <div className="flex gap-10 font-mono"><span>AIA_MEMBER</span><span>LEED_AP_BD+C</span></div>
        </div>
      </footer>
    </div>
  );
}
