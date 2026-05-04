"use client";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Waves, Cpu, Activity, Menu, X, ArrowRight, Zap, Server, Shield, BarChart3, Gauge, Terminal } from "lucide-react";
import "../premium.css";

const PRODUCTS = [
  { id: "engine", title: "WAVE // ENGINE", desc: "Real-time WebGL particle system with GPU-accelerated physics. 60fps at 500K particles. Zero-dependency, tree-shakeable.", version: "v4.2.1", license: "MIT" },
  { id: "audio", title: "WAVE // AUDIO", desc: "Spatial audio synthesis library with 3D positioning, convolution reverb, and real-time spectral analysis. Web Audio API native.", version: "v2.8.0", license: "MIT" },
  { id: "data", title: "WAVE // DATA", desc: "High-performance data visualization for streaming time-series. Canvas-rendered, WebSocket-native, handles 10M+ data points.", version: "v3.1.4", license: "APACHE" },
  { id: "motion", title: "WAVE // MOTION", desc: "Spring-based animation runtime with declarative API. Gesture recognition, layout animations, and scroll-linked transforms.", version: "v5.0.0", license: "MIT" },
];

const TELEMETRY = [
  { label: "RENDER_FPS", val: 60, max: 60, color: "#6366f1" },
  { label: "PARTICLES_K", val: 500, max: 1000, color: "#6366f1" },
  { label: "MEMORY_MB", val: 42, max: 256, color: "#6366f1" },
  { label: "LATENCY_MS", val: 2.1, max: 16, color: "#6366f1" },
];

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay }}>{children}</motion.div>;
}

export default function WaveFXPage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  useEffect(() => { const h = () => setScrolled(window.scrollY > 50); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h); }, []);

  return (
    <div className="premium-theme min-h-screen bg-[#08080e] text-white font-mono selection:bg-[#6366f1] selection:text-black overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#6366f115_0%,transparent_50%)]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `radial-gradient(#6366f1 0.5px, transparent 0.5px)`, backgroundSize: "30px 30px" }} />
      </div>
      {/* Animated sine waves */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-[0.06]">
        {[...Array(5)].map((_, i) => (
          <motion.div key={i} animate={{ x: ["-100%", "0%"] }} transition={{ duration: 8 + i * 2, repeat: Infinity, ease: "linear" }}
            className="absolute w-[200%] h-px" style={{ top: `${30 + i * 10}%`, background: `linear-gradient(90deg, transparent, #6366f1, transparent, #6366f1, transparent)` }} />
        ))}
      </div>

      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? "bg-[#08080e]/90 backdrop-blur-xl py-4 border-b border-white/5" : "bg-transparent py-10"}`}>
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-3 text-xl font-black tracking-tighter">
            <div className="w-8 h-8 bg-[#6366f1] rounded-full flex items-center justify-center text-white"><Waves className="w-4 h-4" /></div>
            <span className="group-hover:text-[#6366f1] transition-colors">WAVE // <span className="text-white/30">FX</span></span>
          </Link>
          <div className="hidden lg:flex items-center gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">
            {["Products", "Docs", "Playground", "Pricing"].map(l => <Link key={l} href="#" className="hover:text-[#6366f1] transition-colors">{l}</Link>)}
          </div>
          <div className="flex items-center gap-4">
            <button className="px-6 py-2.5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all hidden md:block">Docs</button>
            <button className="px-6 py-2.5 bg-[#6366f1] text-white text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all hidden md:block">Get_Started</button>
          </div>
          <button onClick={() => setMenuOpen(true)} className="lg:hidden text-white/60"><Menu className="w-6 h-6" /></button>
        </div>
      </nav>

      <AnimatePresence>{menuOpen && (
        <motion.div initial={{ opacity: 0, x: "100%" }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: "100%" }} className="fixed inset-0 z-[100] bg-[#08080e] p-8 flex flex-col pt-32">
          <button onClick={() => setMenuOpen(false)} className="absolute top-10 right-8 text-white/40"><X className="w-10 h-10" /></button>
          {["Products", "Docs", "Playground", "Pricing"].map(l => <Link key={l} href="#" onClick={() => setMenuOpen(false)} className="text-5xl font-black tracking-tighter uppercase mb-10">{l}</Link>)}
        </motion.div>
      )}</AnimatePresence>

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col justify-center pt-20">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 w-full relative z-10">
          <Reveal>
            <div className="flex items-center gap-4 mb-8">
              <div className="px-3 py-1 bg-[#6366f1]/10 border border-[#6366f1]/30 text-[#6366f1] text-[9px] font-bold uppercase tracking-widest">v4.2.1_STABLE</div>
              <div className="text-[9px] text-white/20 tracking-widest uppercase">NPM: 2.4M DL/MO // MIT LICENSE</div>
            </div>
            <h1 className="text-7xl md:text-9xl lg:text-[11rem] font-black leading-[0.8] tracking-tighter uppercase mb-10">
              Build <br /> <span className="text-[#6366f1]">Visual</span> <br /> Experiences.
            </h1>
            <p className="max-w-xl text-lg text-white/30 leading-relaxed font-light uppercase tracking-widest italic mb-12">
              GPU-accelerated particle systems, spatial audio, and data visualization. Open source. Production-ready.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <button className="px-12 py-5 bg-[#6366f1] text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all shadow-[0_0_50px_rgba(99,102,241,0.2)]">npm install wave-fx</button>
              <button className="px-12 py-5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all">View_Playground</button>
            </div>
          </Reveal>
          {/* Code snippet */}
          <Reveal delay={0.2}>
            <div className="mt-20 p-8 bg-[#0c0c14] border border-white/5 rounded-2xl max-w-2xl font-mono text-sm">
              <div className="flex items-center gap-2 mb-6"><div className="w-2.5 h-2.5 rounded-full bg-red-500/60" /><div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" /><div className="w-2.5 h-2.5 rounded-full bg-green-500/60" /></div>
              <div className="text-white/30"><span className="text-[#6366f1]">import</span> {"{"} WaveEngine {"}"} <span className="text-[#6366f1]">from</span> <span className="text-green-400">&apos;wave-fx&apos;</span>;</div>
              <div className="text-white/30 mt-2"><span className="text-[#6366f1]">const</span> engine = <span className="text-[#6366f1]">new</span> <span className="text-yellow-300">WaveEngine</span>(canvas, {"{"}</div>
              <div className="text-white/30 ml-4">particles: <span className="text-orange-300">500_000</span>,</div>
              <div className="text-white/30 ml-4">physics: <span className="text-green-400">&apos;gpu&apos;</span>,</div>
              <div className="text-white/30 ml-4">interactive: <span className="text-[#6366f1]">true</span></div>
              <div className="text-white/30">{"})"}.start();</div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="py-40 bg-[#0a0a12] border-y border-white/5">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <Reveal><h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85] mb-24">The <span className="text-[#6366f1]">Suite.</span></h2></Reveal>
          <div className="space-y-2">
            {PRODUCTS.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.05}>
                <div className="group flex flex-col md:flex-row justify-between items-center p-10 md:p-14 border-b border-white/5 hover:bg-[#6366f1] hover:text-white transition-all duration-500 cursor-pointer"
                  onMouseEnter={() => setHoveredProduct(p.id)} onMouseLeave={() => setHoveredProduct(null)}>
                  <div className="flex-1 mb-6 md:mb-0">
                    <div className="flex items-center gap-6 mb-3">
                      <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">{p.title}</h3>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-white/20 group-hover:text-white/50 px-2 py-0.5 border border-white/10 group-hover:border-white/30">{p.version}</span>
                    </div>
                    <p className="text-sm text-white/30 group-hover:text-white/60 transition-colors max-w-2xl">{p.desc}</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-[9px] font-bold text-white/20 group-hover:text-white/40 uppercase tracking-widest">{p.license}</span>
                    <motion.div animate={{ x: hoveredProduct === p.id ? 5 : 0 }} className="opacity-0 group-hover:opacity-100 transition-opacity"><ArrowRight className="w-5 h-5" /></motion.div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TELEMETRY */}
      <section className="py-40 bg-[#08080e]">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-32">
            <div>
              <Reveal>
                <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#6366f1] mb-6 block">Benchmarks</span>
                <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-12 uppercase">Built For <span className="text-white/15">Speed.</span></h2>
              </Reveal>
              <Reveal delay={0.2}>
                <div className="p-10 bg-[#0c0c14] border border-white/5 rounded-2xl">
                  <div className="text-[8px] font-bold text-white/20 uppercase tracking-widest mb-8">RUNTIME_TELEMETRY</div>
                  <div className="space-y-8">
                    {TELEMETRY.map((t, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-[8px] font-bold uppercase tracking-widest mb-3">
                          <span className="text-white/40">{t.label}</span>
                          <span style={{ color: t.color }}>{t.val}</span>
                        </div>
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} whileInView={{ width: `${(t.val / t.max) * 100}%` }} transition={{ duration: 2, delay: 0.5 + i * 0.1 }} viewport={{ once: true }}
                            className="h-full rounded-full" style={{ backgroundColor: t.color }} />
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
                  {[{ icon: <Zap className="w-5 h-5" />, title: "GPU_NATIVE", desc: "WebGL 2.0 compute shaders for massively parallel particle physics." },
                    { icon: <Shield className="w-5 h-5" />, title: "ZERO_DEPS", desc: "No external dependencies. Tree-shakeable ESM bundles under 12KB gzipped." },
                    { icon: <Terminal className="w-5 h-5" />, title: "DX_FIRST", desc: "TypeScript-native, full IntelliSense, comprehensive error messages." }
                  ].map((f, i) => (
                    <div key={i} className="group p-10 bg-[#0c0c14] border border-white/5 hover:border-[#6366f1]/30 rounded-2xl transition-all">
                      <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-[#6366f1] mb-6 group-hover:bg-[#6366f1] group-hover:text-white transition-all">{f.icon}</div>
                      <h3 className="text-xl font-black uppercase tracking-tighter mb-3 group-hover:text-[#6366f1] transition-colors">{f.title}</h3>
                      <p className="text-sm text-white/30">{f.desc}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-40 bg-[#0a0a12] border-y border-white/5 text-center">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-16">
              {[{ label: "NPM_DOWNLOADS", val: "2.4M/mo" }, { label: "GITHUB_STARS", val: "18.6K" }, { label: "CONTRIBUTORS", val: "240+" }, { label: "BUNDLE_SIZE", val: "12KB" }].map((s, i) => (
                <div key={i} className="group"><div className="text-4xl md:text-5xl font-black text-white mb-4 group-hover:text-[#6366f1] transition-colors">{s.val}</div><div className="text-[9px] font-black text-white/15 uppercase tracking-widest">{s.label}</div></div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-40 bg-[#08080e] text-center">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <Reveal>
            <h2 className="text-6xl md:text-9xl font-black tracking-tighter uppercase mb-12">Start <span className="text-[#6366f1]">Building.</span></h2>
            <p className="max-w-xl mx-auto text-sm text-white/30 leading-relaxed font-light mb-16 uppercase tracking-widest italic">Free forever. MIT licensed. Production-ready from day one.</p>
            <button className="px-16 py-6 bg-[#6366f1] text-white text-[12px] font-black uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all shadow-[0_0_60px_rgba(99,102,241,0.15)]">npm install wave-fx</button>
          </Reveal>
        </div>
      </section>

      <footer className="bg-[#08080e] border-t border-white/5 py-32 px-6 md:px-12">
        <div className="max-w-[1500px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-24">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-3 text-xl font-black tracking-tighter mb-10"><div className="w-8 h-8 bg-[#6366f1] text-white rounded-full flex items-center justify-center"><Waves className="w-4 h-4" /></div><span>WAVE // FX</span></Link>
            <p className="text-[11px] text-white/15 uppercase tracking-[0.2em] max-w-sm leading-relaxed italic">Open-source visual computing toolkit. GPU-native. Production-ready.</p>
          </div>
          <div><h4 className="text-[10px] font-black uppercase tracking-widest mb-10 text-[#6366f1]">Resources</h4><ul className="space-y-5 text-[10px] font-bold text-white/20 uppercase tracking-widest">{["Docs", "Examples", "Changelog", "Blog"].map(l => <li key={l}><Link href="#">{l}</Link></li>)}</ul></div>
          <div><h4 className="text-[10px] font-black uppercase tracking-widest mb-10 text-[#6366f1]">Community</h4><ul className="space-y-5 text-[10px] font-bold text-white/20 uppercase tracking-widest">{["GitHub", "Discord", "Twitter", "Stack_Overflow"].map(l => <li key={l}><Link href="#">{l}</Link></li>)}</ul></div>
        </div>
        <div className="max-w-[1500px] mx-auto mt-32 pt-16 border-t border-white/5 text-center text-[9px] font-bold text-white/10 uppercase tracking-widest">&copy; 2026 WAVE FX — MIT LICENSE</div>
      </footer>
    </div>
  );
}
