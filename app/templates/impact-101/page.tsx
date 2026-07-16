"use client";
// @ts-nocheck

import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Terminal, Cpu, Zap, Shield, Layers, Search, Menu, X, ArrowRight, ChevronRight, Code2, Database, Globe, Activity, Lock, Box, Binary, GitBranch, Terminal as TerminalIcon, Server, Cloud } from "lucide-react";

import "../premium.css";

/* ==========================================================================
   DATA MANIFESTS
   ========================================================================== */

const BLOCK_MANIFESTS = {
  hero: {
    version: "v4.2.0-stable",
    status: "SYSTEMS_NOMINAL",
    latency: "1.2ms",
    nodes: 14209,
    throughput: "820k tps",
  },
  products: [
    {
      id: "sdk",
      name: "BLOCK // SDK",
      desc: "Native TypeScript framework for zero-knowledge application development.",
      icon: <Code2 className="w-5 h-5" />,
      specs: ["Type-Safe", "ZK-Proof Native", "Auto-Gas Optimization"],
      code: "npm install @blockbase/sdk",
    },
    {
      id: "api",
      name: "BLOCK // API",
      desc: "Ultra-low latency indexing engine for real-time blockchain telemetry.",
      icon: <Database className="w-5 h-5" />,
      specs: ["100% Uptime SLA", "GraphQL / REST", "Websocket Streams"],
      code: "curl -X GET https://api.blockbase.io/v1",
    },
    {
      id: "node",
      name: "BLOCK // NODE",
      desc: "High-performance validator infrastructure with automated failover.",
      icon: <Server className="w-5 h-5" />,
      specs: ["Global Distribution", "Hot-Swappable", "Zero-Latency Routing"],
      code: "docker pull blockbase/validator",
    },
  ],
  telemetry: [
    { label: "NETWORK_LOAD", val: 42, color: "#00f2ff" },
    { label: "SYNC_ACCURACY", val: 99, color: "#7000ff" },
    { label: "VALIDATOR_UPTIME", val: 100, color: "#00f2ff" },
    { label: "SECURITY_SCORE", val: 94, color: "#7000ff" },
  ],
  logs: [
    { time: "12:40:02", event: "NODE_ALPHA_SYNC", status: "COMPLETE" },
    { time: "12:40:05", event: "ZK_PROOF_GEN", status: "VERIFIED" },
    { time: "12:40:09", event: "BLOCK_PROPOSAL", status: "PENDING" },
    { time: "12:40:12", event: "TX_RECONCILE", status: "ACTIVE" },
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
   BLOCK // BASE COMPONENT
   ========================================================================== */


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function BlockBasePage() {
  const [session, setSession] = useState<{
    formData?: {
      businessName?: string; businessType?: string; tagline?: string;
      city?: string; mainService?: string; benefits?: string[];
      priceRange?: string; targetAudience?: string; brandColor?: string;
      email?: string; phone?: string; instagram?: string; linkedin?: string;
    };
    generatedContent?: {
      heroHeadline?: string; heroSubline?: string; aboutTitle?: string;
      aboutText?: string; ctaText?: string; metaTitle?: string;
      metaDescription?: string;
      services?: { title?: string; description?: string }[];
      testimonials?: { name?: string; role?: string; text?: string; rating?: number }[];
    };
  } | null>(null);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("session");
    if (!id) return;
    fetch(`/api/sessions?id=${id}`)
      .then((r) => r.json())
      .then(setSession)
      .catch(() => {});
  }, []);

  fd = session?.formData;
  c = session?.generatedContent;
  brand = fd?.brandColor ?? null; // null = keep template's original color

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Dynamic Services & Testimonials Mutation for Session Data
  useEffect(() => {
    if (c?.services) {
      const services_arrays = [
        typeof SERVICES !== 'undefined' ? SERVICES : null,
        typeof features !== 'undefined' ? features : null,
        typeof services !== 'undefined' ? services : null,
        typeof FEATURES !== 'undefined' ? FEATURES : null,
      ];
      services_arrays.forEach(arr => {
        if (arr && Array.isArray(arr)) {
          arr.forEach((s, idx) => {
            if (idx < 3 && c.services[idx]) {
              if (s && typeof s === 'object') {
                s.title = c.services[idx].title ?? s.title;
                if ('desc' in s) s.desc = c.services[idx].description ?? s.desc;
                if ('description' in s) s.description = c.services[idx].description ?? s.description;
              }
            }
          });
        }
      });
    }
    if (c?.testimonials) {
      const testimonials_arrays = [
        typeof TESTIMONIALS !== 'undefined' ? TESTIMONIALS : null,
        typeof testimonials !== 'undefined' ? testimonials : null,
        typeof REVIEWS !== 'undefined' ? REVIEWS : null,
        typeof reviews !== 'undefined' ? reviews : null,
      ];
      testimonials_arrays.forEach(arr => {
        if (arr && Array.isArray(arr)) {
          arr.forEach((t, idx) => {
            if (idx < 3 && c.testimonials[idx]) {
              if (t && typeof t === 'object') {
                t.name = c.testimonials[idx].name ?? t.name;
                if ('role' in t) t.role = c.testimonials[idx].role ?? t.role;
                if ('text' in t) t.text = c.testimonials[idx].text ?? t.text;
                if ('quote' in t) t.quote = c.testimonials[idx].text ?? t.quote;
                if ('desc' in t) t.desc = c.testimonials[idx].text ?? t.desc;
              }
            }
          });
        }
      });
    }
  }, [c]);

  return (
    <div className="premium-theme min-h-dvh bg-[#050507] text-white font-mono selection:bg-[#00f2ff] selection:text-black overflow-x-hidden">
      {/* ── BACKGROUND ARCHITECTURE ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#111118_0%,transparent_50%)]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-[#00f2ff]/5 to-transparent" />
      </div>

      {/* ── NAVIGATION ── */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? "bg-[#050507]/90 backdrop-blur-xl py-4 border-b border-white/5 shadow-[0_0_30px_rgba(0,0,0,0.5)]" : "bg-transparent py-10"}`}
      >
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link
            href="#hero"
            className="group flex items-center gap-3 text-xl font-black tracking-tighter"
          >
            {fd?.logoBase64 ? (
              <img src={fd.logoBase64} alt={fd?.businessName ?? 'logo'} style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }} />
            ) : (
              <>
                <div className="w-8 h-8 bg-gradient-to-br from-[#00f2ff] to-[#7000ff] rounded flex items-center justify-center text-black">
                  <Box className="w-5 h-5" />
                </div>
                <span className="group-hover:text-[#00f2ff] transition-colors">
                  BLOCK // <span className="text-white/40">BASE</span>
                </span>
              </>
            )}
          </Link>

          <div className="hidden lg:flex items-center gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
            {["Framework", "Infrastructure", "Developers", "Telemetry"].map(
              (l) => (
                <Link
                  key={l}
                  href="#hero"
                  className="hover:text-[#00f2ff] transition-colors"
                >
                  {l}
                </Link>
              ),
            )}
          </div>

          <div className="flex items-center gap-6">
            <button className="hidden md:block text-white/30 hover:text-white transition-colors">
              <Search className="w-4 h-4" />
            </button>
            <MagneticBtn className="px-6 py-2.5 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-[#00f2ff] transition-all">
              Initialize_API
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
            className="fixed inset-0 z-[100] bg-[#050507] p-8 flex flex-col pt-32"
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-10 right-8 text-white/40"
            >
              <X className="w-10 h-10" />
            </button>
            <div className="flex flex-col gap-10 text-5xl font-black tracking-tighter uppercase">
              {["Framework", "Infrastructure", "Developers", "Telemetry"].map(
                (l) => (
                  <Link key={l} href="#hero" onClick={() => setMenuOpen(false)}>
                    {l}
                  </Link>
                ),
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HERO SECTION ── */}
      <section id="hero" className="relative h-dvh flex flex-col justify-center pt-32 md:pt-20">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-7">
              <Reveal>
                <div className="flex items-center gap-4 mb-8">
                  <div className="px-3 py-1 bg-[#00f2ff]/10 border border-[#00f2ff]/30 text-[#00f2ff] text-[9px] font-bold uppercase tracking-widest">
                    SYSTEMS_NOMINAL
                  </div>
                  <div className="text-[9px] text-white/30 tracking-widest uppercase">
                    v4.2.0-stable // LATENCY: 1.2ms
                  </div>
                </div>
                <h1 className="text-7xl md:text-9xl font-black leading-[0.85] tracking-tighter uppercase mb-10">{c?.heroHeadline ?? <>
                  Zero <br />{" "}
                  <span className="text-[#00f2ff]">Knowledge.</span> <br />{" "}
                  Absolute <br />{" "}
                  <span className="text-white/20">Frictionless.</span>
                </>}</h1>
                <p className="max-w-xl text-lg text-white/40 leading-relaxed font-light mb-12 uppercase tracking-widest">{c?.heroSubline ?? fd?.tagline ?? <>
                  High-performance indexing and indexer infrastructure for the
                  next generation of decentralized computation. Engineering the
                  backbone of zero-knowledge privacy.
                </>}</p>
                <div className="flex flex-col sm:flex-row gap-6">
                  <button className="px-10 py-5 bg-[#00f2ff] text-black text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white transition-all shadow-[0_0_40px_rgba(0,242,255,0.2)]">
                    Explore_The_SDK
                  </button>
                  <button className="px-10 py-5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all">
                    View_Documentation
                  </button>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-5 relative hidden lg:block">
              <Reveal delay={0.2}>
                <div className="relative aspect-square bg-[#0a0a0f] border border-white/5 p-8 rounded-2xl overflow-hidden group">
                  {/* Grid Lines */}
                  <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(90deg,white_1px,transparent_1px),linear-gradient(white_1px,transparent_1px)] bg-[length:40px_40px]" />

                  {/* Terminal Header */}
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                    <div className="flex gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                    </div>
                    <div className="text-[8px] font-bold text-white/20 uppercase tracking-widest">
                      TELEMETRY_STREAM // LIVE
                    </div>
                  </div>

                  {/* Live Stats */}
                  <div className="space-y-10">
                    {BLOCK_MANIFESTS.telemetry.map((stat, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest mb-3">
                          <span className="text-white/40">{stat.label}</span>
                          <span style={{ color: stat.color }}>{stat.val}%</span>
                        </div>
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${stat.val}%` }}
                            transition={{ duration: 2, delay: 0.5 + i * 0.1 }}
                            className="h-full"
                            style={{ backgroundColor: stat.color }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Log Feed */}
                  <div className="mt-12 pt-8 border-t border-white/5 space-y-4">
                    {BLOCK_MANIFESTS.logs.map((log, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center text-[8px] font-bold tracking-widest"
                      >
                        <div className="flex gap-4">
                          <span className="text-white/20">[{log.time}]</span>
                          <span className="text-white/60">{log.event}</span>
                        </div>
                        <span
                          className={
                            log.status === "COMPLETE" ||
                            log.status === "VERIFIED"
                              ? "text-[#00f2ff]"
                              : "text-yellow-500"
                          }
                        >
                          {log.status}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* HUD Scan Effect */}
                  <motion.div
                    animate={{ top: ["0%", "100%", "0%"] }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute left-0 w-full h-20 bg-gradient-to-b from-transparent via-[#00f2ff]/5 to-transparent pointer-events-none"
                  />
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── INFRASTRUCTURE GRID ── */}
      <section className="py-40 bg-[#08080a] border-y border-white/5">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
            <Reveal>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9]">{c?.aboutTitle ?? fd?.businessName ?? <>
                Developer <br />{" "}
                <span className="text-[#00f2ff]">Ecosystem.</span>
              </>}</h2>
            </Reveal>
            <p className="max-w-sm text-sm text-white/30 leading-relaxed uppercase tracking-widest font-light">{c?.aboutText ?? <>
              Architected for scale. Every component of the Blockbase stack is
              built to handle millions of transactions with sub-second latency.
            </>}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {BLOCK_MANIFESTS.products.map((prod, i) => (
              <Reveal key={prod.id} delay={i * 0.1}>
                <div className="group p-10 bg-[#0a0a0f] border border-white/5 hover:border-[#00f2ff]/30 transition-all flex flex-col h-full rounded-2xl overflow-hidden relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00f2ff]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-[#00f2ff] mb-10 group-hover:bg-[#00f2ff] group-hover:text-black transition-all">
                    {prod.icon}
                  </div>
                  <h3 className="text-2xl font-black uppercase mb-4 tracking-tighter group-hover:text-[#00f2ff] transition-colors">
                    {prod.name}
                  </h3>
                  <p className="text-sm text-white/40 leading-relaxed mb-10 flex-1 italic">
                    "{prod.desc}"
                  </p>

                  <div className="space-y-3 mb-10">
                    {prod.specs.map((spec, j) => (
                      <div
                        key={j}
                        className="flex items-center gap-3 text-[9px] font-bold text-white/20 uppercase tracking-widest"
                      >
                        <div className="w-1 h-1 bg-[#00f2ff] rounded-full" />
                        {spec}
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-black/40 rounded-lg border border-white/5 font-mono text-[10px] text-[#00f2ff]/60 group-hover:text-[#00f2ff] transition-colors overflow-hidden">
                    <code>{prod.code}</code>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── LIVE TELEMETRY (Interactive) ── */}
      <section id="realisations" className="py-40 bg-[#050507]">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
            <Reveal>
              <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#00f2ff] mb-6 block">
                Network_Status
              </span>
              <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-12 uppercase">
                Real-Time <br />{" "}
                <span className="text-white/20">Validation.</span>
              </h2>
              <div className="space-y-12">
                {[
                  {
                    title: "Sub-Second Indexing",
                    desc: "Data indexed and available via API in less than 200ms from block finality.",
                    icon: <Activity className="w-5 h-5" />,
                  },
                  {
                    title: "ZK-Proof Verification",
                    desc: "Integrated circuits for ultra-fast zero-knowledge proof generation and validation.",
                    icon: <Lock className="w-5 h-5" />,
                  },
                  {
                    title: "Multi-Chain Mesh",
                    desc: "Seamless indexed data across 40+ L1 and L2 networks via a single unified API.",
                    icon: <Layers className="w-5 h-5" />,
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-8 group">
                    <div className="w-12 h-12 bg-white/5 border border-white/5 flex items-center justify-center text-white/20 group-hover:text-[#00f2ff] transition-colors">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-widest text-white mb-2">
                        {item.title}
                      </h4>
                      <p className="text-xs text-white/40 leading-relaxed font-light uppercase tracking-wider">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="relative aspect-video bg-[#0a0a0f] border border-white/5 rounded-2xl overflow-hidden p-8 group">
                <div className="absolute top-6 left-6 text-[8px] font-bold text-white/20 tracking-widest uppercase">
                  Global_Mesh_Traffic
                </div>
                {/* Simulated Data Points */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-full h-[200px]">
                    <svg viewBox="0 0 400 100" className="w-full h-full overflow-visible">
                      <motion.path
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        d="M 0 50 Q 50 20, 100 50 T 200 50 T 300 50 T 400 50"
                        fill="none"
                        stroke="#00f2ff"
                        strokeWidth="0.5"
                        strokeOpacity="0.3"
                      />
                      <motion.path
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                        d="M 0 50 Q 50 80, 100 50 T 200 50 T 300 50 T 400 50"
                        fill="none"
                        stroke="#7000ff"
                        strokeWidth="0.5"
                        strokeOpacity="0.3"
                      />
                    </svg>
                    {/* Pulsing Nodes */}
                    <div className="absolute top-[20%] left-[25%] w-1.5 h-1.5 bg-[#00f2ff] rounded-full shadow-[0_0_10px_#00f2ff] animate-pulse" />
                    <div className="absolute top-[70%] left-[55%] w-1.5 h-1.5 bg-[#7000ff] rounded-full shadow-[0_0_10px_#7000ff] animate-pulse" />
                    <div className="absolute top-[40%] left-[85%] w-1.5 h-1.5 bg-[#00f2ff] rounded-full shadow-[0_0_10px_#00f2ff] animate-pulse" />
                  </div>
                </div>
                <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center text-[8px] font-bold text-white/20 tracking-widest uppercase">
                  <div className="flex gap-8">
                    <span>TX_PROCESSED: 4.2B</span>
                    <span>ACTIVE_NODES: 14,209</span>
                  </div>
                  <div className="text-[#00f2ff]">ENCRYPTED_STREAM</div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── SECURITY FIRST ── */}
      <section className="py-40 bg-[#0a0a0f] border-y border-white/5 overflow-hidden">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 text-center relative">
          <Reveal>
            <h2 className="text-7xl md:text-9xl font-black tracking-tighter uppercase leading-[0.85] mb-12 text-white/10">
              Battle <br /> Tested.
            </h2>
            <div className="max-w-2xl mx-auto">
              <p className="text-lg text-white/40 leading-relaxed font-light mb-16 uppercase tracking-widest">
                Our infrastructure is audited by leading security firms and
                stress-tested under production loads exceeding 500k tps.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                {[
                  { label: "SOC2 TYPE II", status: "CERTIFIED" },
                  { label: "ISO 27001", status: "VERIFIED" },
                  { label: "TRAIL OF BITS", status: "AUDITED" },
                  { label: "HACKEN", status: "9.8/10" },
                ].map((s, i) => (
                  <div key={i}>
                    <div className="text-[10px] font-black text-white mb-2">
                      {s.label}
                    </div>
                    <div className="text-[9px] font-bold text-[#00f2ff] tracking-[0.2em]">
                      {s.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── CTA / INITIALIZE ── */}
      <section id="contact" className="py-40 bg-[#050507]">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 text-center">
          <Reveal>
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase mb-12">
              Ready to <br />{" "}
              <span className="text-[#00f2ff]">Initialize?</span>
            </h2>
            <p className="max-w-xl mx-auto text-sm text-white/40 leading-relaxed font-light mb-16 uppercase tracking-widest italic">
              Join 42,000+ developers building the future of decentralized computation.
            </p>
            <MagneticBtn className="px-16 py-6 bg-white text-black text-[12px] font-black uppercase tracking-[0.4em] hover:bg-[#00f2ff] transition-all shadow-[0_0_50px_rgba(255,255,255,0.1)]">
              Get_API_Key
            </MagneticBtn>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#050507] border-t border-white/5 py-24 px-6 md:px-12">
        <div className="max-w-[1500px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-20">
          <div className="col-span-1 md:col-span-2">
            <Link href="#hero" className="flex items-center gap-3 text-xl font-black tracking-tighter mb-8">
              <div className="w-8 h-8 bg-white text-black rounded flex items-center justify-center">
                <Box className="w-5 h-5" />
              </div>
              <span>{fd?.businessName ?? "BLOCK // BASE"}</span>
            </Link>
            <p className="text-[10px] text-white/20 uppercase tracking-[0.2em] max-w-sm leading-relaxed mb-12">
              Engineering the foundation of high-performance decentralized systems. Built for the next billion users.
            </p>
            <div className="flex gap-6">
              {[GitBranch, Globe, Search].map((Icon, i) => (
                <button key={i} className="text-white/20 hover:text-[#00f2ff] transition-colors">
                  <Icon className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-8 text-[#00f2ff]">System_Index</h4>
            <ul className="space-y-4 text-[10px] font-bold text-white/30 uppercase tracking-widest">
              <li className="hover:text-white transition-colors"><Link href="#contact">API_Reference</Link></li>
              <li className="hover:text-white transition-colors"><Link href="#contact">SDK_Documentation</Link></li>
              <li className="hover:text-white transition-colors"><Link href="#contact">Node_Operators</Link></li>
              <li className="hover:text-white transition-colors"><Link href="#contact">Security_Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-8 text-[#00f2ff]">Telemetry</h4>
            <ul className="space-y-4 text-[10px] font-bold text-white/30 uppercase tracking-widest">
              <li className="hover:text-white transition-colors"><Link href="#contact">Network_Health</Link></li>
              <li className="hover:text-white transition-colors"><Link href="#contact">Governance_Log</Link></li>
              <li className="hover:text-white transition-colors"><Link href="#contact">Validator_Map</Link></li>
              <li className="hover:text-white transition-colors"><Link href="#contact">Status_Page</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-[1500px] mx-auto mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12 text-[9px] font-bold text-white/10 uppercase tracking-widest">
          <div className="flex items-center gap-8">
            <span>&copy; 2026 BLOCKBASE FOUNDATION. ALL RIGHTS RESERVED.</span>
            <div className="flex gap-8 hidden lg:flex">
              <span>GDPR_COMPLIANT</span>
              <span>SOC2_TYPE_II</span>
            </div>
          </div>
          <div className="flex gap-8 font-mono">
            <span>STABLE_RELDASH_V4</span>
            <span>0x4A...2F9</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
