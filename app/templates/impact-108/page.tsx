"use client";

import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Clock,
  Zap,
  Shield,
  Layers,
  Search,
  Menu,
  X,
  ArrowRight,
  ChevronRight,
  Cpu,
  Binary,
  Database,
  Lock,
  Box,
  Fingerprint,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Activity,
  History,
  Timer,
  ZapOff,
  Briefcase,
  Globe,
  Coins,
} from "lucide-react";

import "../premium.css";

/* ==========================================================================
   DATA MANIFESTS
   ========================================================================== */

const CHRONOS_MANIFESTS = {
  hero: {
    latency: "0.12μs",
    volume: "$4.8B/sec",
    epoch: "SYNC_COMPLETE",
    status: "TEMPORAL_LOCK_ACTIVE",
  },
  strategies: [
    {
      id: "quantum",
      name: "QUANTUM // ARB",
      desc: "Multi-dimensional arbitrage leveraging temporal micro-drifts across synthetic markets.",
      icon: <Zap className="w-5 h-5" />,
      specs: ["Sub-Nanosecond Exec", "Cross-Chain Sync", "Risk-Neutral Core"],
    },
    {
      id: "neural",
      name: "NEURAL // TICK",
      desc: "Predictive order-flow analysis using high-throughput cortical simulation models.",
      icon: <Cpu className="w-5 h-5" />,
      specs: ["99.4% Accuracy", "Adversarial Shield", "Pattern-Zero Latency"],
    },
    {
      id: "spectral",
      name: "SPECTRAL // LIQ",
      desc: "Liquidity provisioning across dark-pool fragments with spectral wave interference shielding.",
      icon: <Layers className="w-5 h-5" />,
      specs: ["Ghost-Order Matrix", "Adaptive Slippage", "Shadow-Pool Routing"],
    },
  ],
  market_telemetry: [
    { label: "EXECUTION_CLARITY", val: 98, color: "#ffaa00" },
    { label: "TEMPORAL_DRIFT", val: 0.04, color: "#ffaa00" },
    { label: "SHIELD_STABILITY", val: 100, color: "#ffaa00" },
    { label: "YIELD_EFFICIENCY", val: 86, color: "#ffaa00" },
  ],
  live_tickers: [
    { sym: "BTC/USDT", price: "64,281.24", change: "+1.2%", trend: "up" },
    { sym: "ETH/USDT", price: "3,452.18", change: "-0.4%", trend: "down" },
    { sym: "SOL/USDT", price: "142.09", change: "+4.8%", trend: "up" },
    { sym: "AAPL/USD", price: "189.42", change: "+0.1%", trend: "up" },
  ],
};

/* ==========================================================================
   UTILITY COMPONENTS
   ========================================================================== */

function Reveal({
  children,
  delay = 0,
  y = 20,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

function MagneticBtn({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 20 });
  const sy = useSpring(y, { stiffness: 300, damping: 20 });
  const ref = useRef<HTMLButtonElement>(null);

  const handleMouse = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (rect) {
      x.set((e.clientX - rect.left - rect.width / 2) * 0.4);
      y.set((e.clientY - rect.top - rect.height / 2) * 0.4);
    }
  };

  return (
    <motion.button
      ref={ref}
      style={{ x: sx, y: sy }}
      onMouseMove={handleMouse}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      className={className}
    >
      {children}
    </motion.button>
  );
}

/* ==========================================================================
   CHRONOS // ENGINE COMPONENT
   ========================================================================== */

export default function ChronosEnginePage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="premium-theme min-h-screen bg-[#080605] text-white font-mono selection:bg-[#ffaa00] selection:text-black overflow-x-hidden">
      {/* ── BACKGROUND ARCHITECTURE ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,#1a0f0a_0%,transparent_50%)]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,170,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,170,0,0.1) 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
          }}
        />
        <div className="absolute top-0 left-0 w-full h-[60vh] bg-gradient-to-b from-[#ffaa00]/5 to-transparent" />
      </div>

      {/* ── NAVIGATION ── */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? "bg-[#080605]/90 backdrop-blur-xl py-4 border-b border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.5)]" : "bg-transparent py-10"}`}
      >
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link
            href="/"
            className="group flex items-center gap-3 text-xl font-black tracking-tighter"
          >
            <div className="w-8 h-8 bg-[#ffaa00] rounded-sm flex items-center justify-center text-black">
              <Clock className="w-5 h-5" />
            </div>
            <span className="group-hover:text-[#ffaa00] transition-colors">
              CHRONOS // <span className="text-white/40">ENGINE</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
            {["Market_Epoch", "Strategies", "Temporal_Logs", "Node_Sync"].map((l) => (
              <Link
                key={l}
                href="#"
                className="hover:text-[#ffaa00] transition-colors"
              >
                {l}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <button className="hidden md:block text-white/30 hover:text-white transition-colors">
              <Search className="w-4 h-4" />
            </button>
            <MagneticBtn className="px-6 py-2.5 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-[#ffaa00] transition-all">
              Initialize_Sync
            </MagneticBtn>
            <button
              onClick={() => setMenuOpen(true)}
              className="lg:hidden text-white/60 hover:text-white transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            className="fixed inset-0 z-[100] bg-[#080605] p-8 flex flex-col pt-32"
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-10 right-8 text-white/40"
            >
              <X className="w-10 h-10" />
            </button>
            <div className="flex flex-col gap-10 text-5xl font-black tracking-tighter uppercase">
              {["Market_Epoch", "Strategies", "Temporal_Logs", "Node_Sync"].map((l) => (
                <Link key={l} href="#" onClick={() => setMenuOpen(false)}>
                  {l}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HERO SECTION ── */}
      <section className="relative h-screen flex flex-col justify-center pt-20 overflow-hidden">
        {/* Ticker Tape Animation (Background) */}
        <div className="absolute inset-0 flex flex-col justify-between py-24 opacity-10 pointer-events-none select-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ x: i % 2 === 0 ? ["0%", "-50%"] : ["-50%", "0%"] }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="whitespace-nowrap text-8xl font-black uppercase tracking-widest text-[#ffaa00]"
            >
              {CHRONOS_MANIFESTS.live_tickers.map((t) => (
                <span key={t.sym} className="mx-20">
                  {t.sym} // {t.price} // {t.change}
                </span>
              ))}
            </motion.div>
          ))}
        </div>

        <div className="max-w-[1500px] mx-auto px-6 md:px-12 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-8">
              <Reveal>
                <div className="flex items-center gap-4 mb-8">
                  <div className="px-3 py-1 bg-[#ffaa00]/10 border border-[#ffaa00]/30 text-[#ffaa00] text-[9px] font-bold uppercase tracking-widest">
                    {CHRONOS_MANIFESTS.hero.status}
                  </div>
                  <div className="text-[9px] text-white/30 tracking-widest uppercase">
                    LATENCY: {CHRONOS_MANIFESTS.hero.latency} // VOLUME:{" "}
                    {CHRONOS_MANIFESTS.hero.volume}
                  </div>
                </div>
                <h1 className="text-7xl md:text-9xl lg:text-[11rem] font-black leading-[0.8] tracking-tighter uppercase mb-10">
                  Temporal <br />{" "}
                  <span className="text-[#ffaa00]">Execution.</span> <br />{" "}
                  Zero <br />{" "}
                  <span className="text-white/20">Latency.</span>
                </h1>
                <p className="max-w-2xl text-xl text-white/40 leading-relaxed font-light mb-12 uppercase tracking-widest italic">
                  Collapsing time-to-execution across global synthetic markets. 
                  High-frequency strategies engineered with sub-microsecond 
                  precision and quantum-resistant temporal shielding.
                </p>
                <div className="flex flex-col sm:flex-row gap-6">
                  <button className="px-12 py-5 bg-[#ffaa00] text-black text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white transition-all shadow-[0_0_50px_rgba(255,170,0,0.2)]">
                    Access_Terminal
                  </button>
                  <button className="px-12 py-5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all">
                    View_Market_Logs
                  </button>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-4 relative hidden lg:block">
              <Reveal delay={0.2}>
                <div className="relative aspect-square bg-[#0a0806] border border-white/5 p-12 rounded-3xl overflow-hidden group shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#ffaa00]/5 to-transparent" />

                  {/* Engine HUD */}
                  <div className="relative h-full flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="text-[8px] font-bold text-white/20 uppercase tracking-widest">
                          EXECUTION_LATENCY
                        </div>
                        <div className="text-xl font-black text-[#ffaa00]">
                          {CHRONOS_MANIFESTS.hero.latency}
                        </div>
                      </div>
                      <div className="w-10 h-10 border border-white/5 rounded-full flex items-center justify-center">
                        <Timer className="w-5 h-5 text-white/20 animate-pulse" />
                      </div>
                    </div>

                    {/* Telemetry Metrics */}
                    <div className="space-y-10 my-10">
                      {CHRONOS_MANIFESTS.market_telemetry.map((stat, i) => (
                        <div key={i}>
                          <div className="flex justify-between text-[8px] font-bold uppercase tracking-widest mb-3">
                            <span className="text-white/40">{stat.label}</span>
                            <span style={{ color: stat.color }}>{stat.val}{stat.label === "TEMPORAL_DRIFT" ? "μs" : "%"}</span>
                          </div>
                          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${stat.val * (stat.label === "TEMPORAL_DRIFT" ? 10 : 1)}%` }}
                              transition={{ duration: 2, delay: 0.5 + i * 0.1 }}
                              className="h-full"
                              style={{ backgroundColor: stat.color }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-6 border-t border-white/5 flex justify-between items-center text-[8px] font-bold text-white/20 uppercase tracking-widest">
                      <span>EPOCH_SYNC_ON</span>
                      <div className="flex items-center gap-2 text-[#ffaa00]">
                        <div className="w-1.5 h-1.5 bg-[#ffaa00] rounded-full animate-ping" />
                        <span>MARKET_OPEN</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── STRATEGIES SECTION ── */}
      <section className="py-40 bg-[#0a0806] border-y border-white/5">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
            <Reveal>
              <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85]">
                Execution <br />{" "}
                <span className="text-[#ffaa00]">Strategies.</span>
              </h2>
            </Reveal>
            <p className="max-w-md text-sm text-white/30 leading-relaxed uppercase tracking-widest font-light italic">
              Algorithms designed for the micro-second domain. Select the strategy optimized for your specific liquidity and risk profile.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {CHRONOS_MANIFESTS.strategies.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.1}>
                <div className="group p-12 bg-[#0a0806] border border-white/5 hover:border-[#ffaa00]/30 transition-all flex flex-col h-full rounded-3xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#ffaa00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="w-16 h-16 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center text-[#ffaa00] mb-12 group-hover:bg-[#ffaa00] group-hover:text-black transition-all">
                    {p.icon}
                  </div>
                  <h3 className="text-3xl font-black uppercase mb-6 tracking-tighter group-hover:text-[#ffaa00] transition-colors">
                    {p.name}
                  </h3>
                  <p className="text-sm text-white/40 leading-relaxed mb-12 flex-1 italic">
                    "{p.desc}"
                  </p>

                  <div className="space-y-5 pt-10 border-t border-white/5">
                    {p.specs.map((s, j) => (
                      <div
                        key={j}
                        className="flex items-center gap-4 text-[9px] font-bold text-white/20 uppercase tracking-widest"
                      >
                        <div className="w-1.5 h-1.5 bg-[#ffaa00] rotate-45" />
                        {s}
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── LIVE DATA (Ticker Stream) ── */}
      <section className="py-40 bg-[#080605]">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-32 items-center">
            <div className="lg:col-span-6">
              <Reveal>
                <div className="relative aspect-video bg-[#0a0806] border border-white/5 rounded-2xl overflow-hidden p-8 group">
                  <div className="absolute top-6 left-6 text-[8px] font-bold text-white/20 tracking-widest uppercase">
                    TICKER_ALPHA_STREAM
                  </div>
                  {/* Candlestick Visualization */}
                  <div className="absolute inset-0 flex items-end justify-around px-10 pb-16 opacity-30">
                    {[...Array(20)].map((_, i) => {
                      const height = Math.random() * 150 + 20;
                      return (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height }}
                          transition={{ duration: 1, delay: i * 0.05 }}
                          className="w-1 bg-[#ffaa00] relative"
                        >
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-10 bg-[#ffaa00] rounded-sm" />
                        </motion.div>
                      );
                    })}
                  </div>
                  <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center text-[8px] font-bold text-white/20 tracking-widest uppercase">
                    <div className="flex gap-10">
                      <span>VOL: 242.1M</span>
                      <span>SPREAD: 0.0012%</span>
                    </div>
                    <div className="text-[#ffaa00]">ORDER_LOCK</div>
                  </div>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-6">
              <Reveal>
                <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#ffaa00] mb-6 block">
                  Active_Tickers
                </span>
                <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-12 uppercase">
                  Market <br />{" "}
                  <span className="text-white/20">Flux.</span>
                </h2>
                <div className="space-y-8">
                  {CHRONOS_MANIFESTS.live_tickers.map((t, i) => (
                    <div
                      key={i}
                      className="group flex flex-col md:flex-row justify-between items-center p-8 bg-white/2 border border-white/5 hover:border-[#ffaa00]/30 transition-all"
                    >
                      <div className="flex items-center gap-10 mb-6 md:mb-0">
                        <div className="text-2xl font-black uppercase tracking-tighter">
                          {t.sym}
                        </div>
                        <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
                          PRICE: {t.price}
                        </div>
                      </div>
                      <div className="flex items-center gap-12 text-[10px] font-bold uppercase tracking-widest">
                        <div className="flex items-center gap-3">
                          {t.trend === "up" ? <TrendingUp className="w-4 h-4 text-green-500" /> : <TrendingDown className="w-4 h-4 text-red-500" />}
                          <span className="text-white/40">CHANGE:</span>
                          <span className={t.trend === "up" ? "text-green-500" : "text-red-500"}>{t.change}</span>
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

      {/* ── PERFORMANCE METRICS ── */}
      <section className="py-40 bg-[#0a0806] border-y border-white/5 text-center overflow-hidden">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 relative">
          <Reveal>
            <h2 className="text-7xl md:text-[12rem] font-black tracking-tighter uppercase leading-[0.85] mb-12 text-white/5">
              Time <br /> Fold.
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-16 mt-24">
              {[
                { label: "MAX_TPS", val: "1.2M" },
                { label: "UPTIME_SLA", val: "99.999%" },
                { label: "NODE_COUNT", val: "4,281" },
                { label: "AVG_YIELD", val: "24.2%" },
              ].map((s, i) => (
                <div key={i} className="group">
                  <div className="text-5xl font-black text-white mb-4 group-hover:text-[#ffaa00] transition-colors">
                    {s.val}
                  </div>
                  <div className="text-[10px] font-black text-white/20 uppercase tracking-widest">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── CTA / INITIALIZE ── */}
      <section className="py-40 bg-[#080605]">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 text-center">
          <Reveal>
            <h2 className="text-6xl md:text-9xl font-black tracking-tighter uppercase mb-12">
              Sync <br />{" "}
              <span className="text-[#ffaa00]">Temporal.</span>
            </h2>
            <p className="max-w-2xl mx-auto text-sm text-white/40 leading-relaxed font-light mb-16 uppercase tracking-widest italic">
              Market edges are measured in microseconds. Initialize your temporal execution strategy today with Chronos Engine Systems.
            </p>
            <MagneticBtn className="px-16 py-6 bg-white text-black text-[12px] font-black uppercase tracking-[0.4em] hover:bg-[#ffaa00] transition-all shadow-[0_0_60px_rgba(255,170,0,0.15)]">
              Initialize_Epoch_Sync
            </MagneticBtn>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#080605] border-t border-white/5 py-32 px-6 md:px-12">
        <div className="max-w-[1500px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-24">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-3 text-xl font-black tracking-tighter mb-10">
              <div className="w-8 h-8 bg-white text-black rounded-sm flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <span>CHRONOS // ENGINE</span>
            </Link>
            <p className="text-[11px] text-white/20 uppercase tracking-[0.2em] max-w-sm leading-relaxed mb-16 italic">
              Engineering the temporal infrastructure for high-frequency execution in the micro-second domain.
            </p>
            <div className="flex gap-8">
              {[TrendingUp, Activity, Timer].map((Icon, i) => (
                <button key={i} className="text-white/20 hover:text-[#ffaa00] transition-colors">
                  <Icon className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-10 text-[#ffaa00]">Engine</h4>
            <ul className="space-y-5 text-[10px] font-bold text-white/30 uppercase tracking-widest">
              <li className="hover:text-white transition-colors"><Link href="#">Strategy_Vault</Link></li>
              <li className="hover:text-white transition-colors"><Link href="#">Latency_Map</Link></li>
              <li className="hover:text-white transition-colors"><Link href="#">Risk_Engine</Link></li>
              <li className="hover:text-white transition-colors"><Link href="#">Liquidity_SLA</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-10 text-[#ffaa00]">Telemetry</h4>
            <ul className="space-y-5 text-[10px] font-bold text-white/30 uppercase tracking-widest">
              <li className="hover:text-white transition-colors"><Link href="#">Live_Tickers</Link></li>
              <li className="hover:text-white transition-colors"><Link href="#">Node_Sync</Link></li>
              <li className="hover:text-white transition-colors"><Link href="#">API_Explorer</Link></li>
              <li className="hover:text-white transition-colors"><Link href="#">System_Status</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-[1500px] mx-auto mt-32 pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12 text-[9px] font-bold text-white/10 uppercase tracking-widest">
          <div className="flex items-center gap-10">
            <span>&copy; 2026 CHRONOS ENGINE TECHNOLOGIES. ALL RIGHTS RESERVED.</span>
            <div className="flex gap-10 hidden lg:flex">
              <span>FINRA_COMPLIANT</span>
              <span>SEC_REGISTERED</span>
            </div>
          </div>
          <div className="flex gap-10 font-mono">
            <span>EPOCH_STABLE</span>
            <span>SYNC_LATENCY_0.12μs</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
