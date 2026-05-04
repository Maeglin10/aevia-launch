"use client";
import { motion, useInView, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Dumbbell, Flame, Heart, Menu, X, ArrowRight, Timer, Zap, Trophy, Target, Activity, BarChart3, Users, Crown, Footprints, Swords } from "lucide-react";
import "../premium.css";

const MANIFESTS = {
  hero: { members: "18,400", classes: "120/wk", trainers: "85", status: "FACILITY_OPEN" },
  programs: [
    { id: "forge", name: "FORGE // HIIT", desc: "High-intensity interval training combining Olympic lifts, plyometrics, and metabolic conditioning for maximum caloric burn.", icon: <Flame className="w-5 h-5" />, specs: ["45 Min Sessions", "Heart Rate Zones", "600+ Cal Burn"] },
    { id: "iron", name: "IRON // STRENGTH", desc: "Progressive overload strength program with periodized programming, real-time form analysis, and load tracking.", icon: <Dumbbell className="w-5 h-5" />, specs: ["12-Week Cycles", "RPE Tracking", "PR Logging"] },
    { id: "apex", name: "APEX // COMBAT", desc: "Combat conditioning blending Muay Thai, Brazilian Jiu-Jitsu, and boxing fundamentals in a team-based format.", icon: <Swords className="w-5 h-5" />, specs: ["Striking + Grappling", "Sparring Rounds", "Competition Prep"] },
  ],
  telemetry: [
    { label: "MEMBER_RETENTION", val: 94, color: "#ef4444" },
    { label: "CLASS_CAPACITY", val: 87, color: "#ef4444" },
    { label: "TRAINER_RATING", val: 98, color: "#22c55e" },
    { label: "TRANSFORMATION", val: 91, color: "#ef4444" },
  ],
  leaderboard: [
    { rank: "01", name: "ATLAS_GRIND", metric: "2,400 lbs", category: "Total Lifted / Week" },
    { rank: "02", name: "VIPER_CARDIO", metric: "42.8 km", category: "Distance / Week" },
    { rank: "03", name: "TITAN_CORE", metric: "1,200 reps", category: "Core Volume / Week" },
    { rank: "04", name: "BLAZE_HIIT", metric: "8,400 cal", category: "Calories Burned / Week" },
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

export default function IronXFitnessPage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => { const h = () => setScrolled(window.scrollY > 50); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h); }, []);

  return (
    <div className="premium-theme min-h-screen bg-[#0a0404] text-white font-mono selection:bg-[#ef4444] selection:text-black overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,#200808_0%,transparent_50%)]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(239,68,68,0.08) 35px, rgba(239,68,68,0.08) 36px)` }} />
        {/* Pulse lines */}
        {[...Array(3)].map((_, i) => (
          <motion.div key={i} animate={{ opacity: [0, 0.08, 0], x: ["-100%", "100%"] }} transition={{ duration: 4, repeat: Infinity, delay: i * 1.3 }}
            className="absolute h-px bg-gradient-to-r from-transparent via-[#ef4444] to-transparent" style={{ top: `${30 + i * 20}%`, width: "100%" }} />
        ))}
      </div>

      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? "bg-[#0a0404]/90 backdrop-blur-xl py-4 border-b border-white/5" : "bg-transparent py-10"}`}>
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-3 text-xl font-black tracking-tighter">
            <div className="w-8 h-8 bg-[#ef4444] rounded-sm flex items-center justify-center text-white"><Flame className="w-5 h-5" /></div>
            <span className="group-hover:text-[#ef4444] transition-colors">IRON // <span className="text-white/40">X</span></span>
          </Link>
          <div className="hidden lg:flex items-center gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
            {["Programs", "Schedule", "Trainers", "Membership"].map(l => <Link key={l} href="#" className="hover:text-[#ef4444] transition-colors">{l}</Link>)}
          </div>
          <div className="flex items-center gap-6">
            <MagneticBtn className="px-6 py-2.5 bg-[#ef4444] text-white text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">Free_Trial</MagneticBtn>
            <button onClick={() => setMenuOpen(true)} className="lg:hidden text-white/60"><Menu className="w-6 h-6" /></button>
          </div>
        </div>
      </nav>

      <AnimatePresence>{menuOpen && (
        <motion.div initial={{ opacity: 0, x: "100%" }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: "100%" }} className="fixed inset-0 z-[100] bg-[#0a0404] p-8 flex flex-col pt-32">
          <button onClick={() => setMenuOpen(false)} className="absolute top-10 right-8 text-white/40"><X className="w-10 h-10" /></button>
          <div className="flex flex-col gap-10 text-5xl font-black tracking-tighter uppercase">
            {["Programs", "Schedule", "Trainers", "Membership"].map(l => <Link key={l} href="#" onClick={() => setMenuOpen(false)}>{l}</Link>)}
          </div>
        </motion.div>
      )}</AnimatePresence>

      {/* HERO */}
      <section className="relative h-screen flex flex-col justify-center pt-20 overflow-hidden">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-8">
              <Reveal>
                <div className="flex items-center gap-4 mb-8">
                  <div className="px-3 py-1 bg-[#ef4444]/10 border border-[#ef4444]/30 text-[#ef4444] text-[9px] font-bold uppercase tracking-widest">{MANIFESTS.hero.status}</div>
                  <div className="text-[9px] text-white/30 tracking-widest uppercase">MEMBERS: {MANIFESTS.hero.members} // CLASSES: {MANIFESTS.hero.classes}</div>
                </div>
                <h1 className="text-7xl md:text-9xl lg:text-[11rem] font-black leading-[0.8] tracking-tighter uppercase mb-10">
                  No <br /> <span className="text-[#ef4444]">Limits.</span> <br /> No <br /> <span className="text-white/20">Excuses.</span>
                </h1>
                <p className="max-w-2xl text-xl text-white/40 leading-relaxed font-light mb-12 uppercase tracking-widest italic">
                  Elite training facilities. World-class coaches. Data-driven programming. Transform your body and mind with performance science.
                </p>
                <div className="flex flex-col sm:flex-row gap-6">
                  <button className="px-12 py-5 bg-[#ef4444] text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all shadow-[0_0_50px_rgba(239,68,68,0.3)]">Start_Training</button>
                  <button className="px-12 py-5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all">View_Schedule</button>
                </div>
              </Reveal>
            </div>
            <div className="lg:col-span-4 relative hidden lg:block">
              <Reveal delay={0.2}>
                <div className="relative aspect-square bg-[#120606] border border-white/5 p-12 rounded-3xl overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#ef4444]/5 to-transparent" />
                  <div className="relative h-full flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div><div className="text-[8px] font-bold text-white/20 uppercase tracking-widest">ACTIVE_TRAINERS</div><div className="text-xl font-black text-[#ef4444]">{MANIFESTS.hero.trainers}</div></div>
                      <div className="w-10 h-10 border border-white/5 rounded-full flex items-center justify-center"><Activity className="w-5 h-5 text-[#ef4444] animate-pulse" /></div>
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
                      <span>PERFORMANCE_LAB</span>
                      <div className="flex items-center gap-2 text-[#ef4444]"><div className="w-1.5 h-1.5 bg-[#ef4444] rounded-full animate-ping" /><span>LIVE</span></div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* PROGRAMS */}
      <section className="py-40 bg-[#120606] border-y border-white/5">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
            <Reveal><h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85]">Training <br /> <span className="text-[#ef4444]">Programs.</span></h2></Reveal>
            <p className="max-w-md text-sm text-white/30 leading-relaxed uppercase tracking-widest font-light italic">Scientifically designed protocols for strength, conditioning, and combat athleticism.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {MANIFESTS.programs.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.1}>
                <div className="group p-12 bg-[#120606] border border-white/5 hover:border-[#ef4444]/30 transition-all flex flex-col h-full rounded-3xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#ef4444]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-16 h-16 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center text-[#ef4444] mb-12 group-hover:bg-[#ef4444] group-hover:text-white transition-all">{p.icon}</div>
                  <h3 className="text-3xl font-black uppercase mb-6 tracking-tighter group-hover:text-[#ef4444] transition-colors">{p.name}</h3>
                  <p className="text-sm text-white/40 leading-relaxed mb-12 flex-1 italic">"{p.desc}"</p>
                  <div className="space-y-5 pt-10 border-t border-white/5">
                    {p.specs.map((s, j) => <div key={j} className="flex items-center gap-4 text-[9px] font-bold text-white/20 uppercase tracking-widest"><div className="w-1.5 h-1.5 bg-[#ef4444] rotate-45" />{s}</div>)}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* LEADERBOARD */}
      <section className="py-40 bg-[#0a0404]">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-32 items-center">
            <div className="lg:col-span-6">
              <Reveal>
                <div className="relative aspect-video bg-[#120606] border border-white/5 rounded-2xl overflow-hidden p-8 flex items-center justify-center">
                  <div className="absolute top-6 left-6 text-[8px] font-bold text-white/20 tracking-widest uppercase">HEART_RATE_ZONE</div>
                  {/* Heart rate visualization */}
                  <svg viewBox="0 0 300 100" className="w-full h-24 opacity-60">
                    <motion.path d="M0,50 L30,50 L40,50 L50,20 L60,80 L70,10 L80,90 L90,50 L100,50 L130,50 L140,50 L150,25 L160,75 L170,15 L180,85 L190,50 L200,50 L230,50 L240,50 L250,30 L260,70 L270,20 L280,80 L290,50 L300,50"
                      fill="none" stroke="#ef4444" strokeWidth="2"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 3, repeat: Infinity }} />
                  </svg>
                  <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center text-[8px] font-bold text-white/20 tracking-widest uppercase">
                    <span>BPM: 142</span><div className="text-[#ef4444]">ZONE_4_THRESHOLD</div>
                  </div>
                </div>
              </Reveal>
            </div>
            <div className="lg:col-span-6">
              <Reveal>
                <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#ef4444] mb-6 block">Weekly_Rankings</span>
                <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-12 uppercase">Leader <br /> <span className="text-white/20">Board.</span></h2>
                <div className="space-y-8">
                  {MANIFESTS.leaderboard.map((l, i) => (
                    <div key={i} className="group flex flex-col md:flex-row justify-between items-center p-8 bg-white/2 border border-white/5 hover:border-[#ef4444]/30 transition-all">
                      <div className="flex items-center gap-10 mb-6 md:mb-0">
                        <div className="text-3xl font-black text-[#ef4444] tabular-nums">#{l.rank}</div>
                        <div className="text-2xl font-black uppercase tracking-tighter">{l.name}</div>
                      </div>
                      <div className="flex items-center gap-8 text-[10px] font-bold uppercase tracking-widest">
                        <span className="text-white/60 text-lg font-black">{l.metric}</span>
                        <span className="text-white/20">{l.category}</span>
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
      <section className="py-40 bg-[#120606] border-y border-white/5 text-center overflow-hidden">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <Reveal>
            <h2 className="text-7xl md:text-[12rem] font-black tracking-tighter uppercase leading-[0.85] mb-12 text-white/5">Beast <br /> Mode.</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-16 mt-24">
              {[{ label: "ACTIVE_MEMBERS", val: "18,400" }, { label: "CLASSES_WEEKLY", val: "120" }, { label: "ELITE_TRAINERS", val: "85" }, { label: "TRANSFORMATIONS", val: "4,200+" }].map((s, i) => (
                <div key={i} className="group"><div className="text-5xl font-black text-white mb-4 group-hover:text-[#ef4444] transition-colors">{s.val}</div><div className="text-[10px] font-black text-white/20 uppercase tracking-widest">{s.label}</div></div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-40 bg-[#0a0404]">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 text-center">
          <Reveal>
            <h2 className="text-6xl md:text-9xl font-black tracking-tighter uppercase mb-12">Become <br /> <span className="text-[#ef4444]">Iron.</span></h2>
            <p className="max-w-2xl mx-auto text-sm text-white/40 leading-relaxed font-light mb-16 uppercase tracking-widest italic">Your transformation starts with one decision. Join the community that holds you accountable and pushes you beyond limits.</p>
            <MagneticBtn className="px-16 py-6 bg-[#ef4444] text-white text-[12px] font-black uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all shadow-[0_0_60px_rgba(239,68,68,0.2)]">Claim_Free_Week</MagneticBtn>
          </Reveal>
        </div>
      </section>

      <footer className="bg-[#0a0404] border-t border-white/5 py-32 px-6 md:px-12">
        <div className="max-w-[1500px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-24">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-3 text-xl font-black tracking-tighter mb-10"><div className="w-8 h-8 bg-[#ef4444] text-white rounded-sm flex items-center justify-center"><Flame className="w-5 h-5" /></div><span>IRON // X</span></Link>
            <p className="text-[11px] text-white/20 uppercase tracking-[0.2em] max-w-sm leading-relaxed mb-16 italic">Elite performance training for athletes and ambitious individuals.</p>
            <div className="flex gap-8">{[Dumbbell, Trophy, Heart].map((Icon, i) => <button key={i} className="text-white/20 hover:text-[#ef4444] transition-colors"><Icon className="w-5 h-5" /></button>)}</div>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-10 text-[#ef4444]">Train</h4>
            <ul className="space-y-5 text-[10px] font-bold text-white/30 uppercase tracking-widest">
              {["FORGE_HIIT", "IRON_Strength", "APEX_Combat", "Yoga_Flow"].map(l => <li key={l} className="hover:text-white transition-colors"><Link href="#">{l}</Link></li>)}
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-10 text-[#ef4444]">Join</h4>
            <ul className="space-y-5 text-[10px] font-bold text-white/30 uppercase tracking-widest">
              {["Membership", "Free_Trial", "Trainers", "Locations"].map(l => <li key={l} className="hover:text-white transition-colors"><Link href="#">{l}</Link></li>)}
            </ul>
          </div>
        </div>
        <div className="max-w-[1500px] mx-auto mt-32 pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12 text-[9px] font-bold text-white/10 uppercase tracking-widest">
          <span>&copy; 2026 IRONX FITNESS. ALL RIGHTS RESERVED.</span>
          <div className="flex gap-10 font-mono"><span>NASM_CERTIFIED</span><span>24/7_ACCESS</span></div>
        </div>
      </footer>
    </div>
  );
}
