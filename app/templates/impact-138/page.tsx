"use client";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { BarChart3, Activity, TrendingUp, Menu, X, ArrowRight, Users, Zap, Globe, Shield, Server, Eye } from "lucide-react";
import "../premium.css";

const METRICS = [
  { label: "ACTIVE USERS", val: "2.4M", change: "+12.3%", up: true },
  { label: "REVENUE", val: "$847K", change: "+8.7%", up: true },
  { label: "CONVERSION", val: "4.2%", change: "+0.3%", up: true },
  { label: "CHURN RATE", val: "1.8%", change: "-0.5%", up: false },
];

const CHART_BARS = [35, 52, 48, 72, 65, 88, 75, 92, 68, 95, 82, 98];

const FEATURES = [
  { icon: <Activity className="w-5 h-5" />, title: "REAL-TIME // STREAMS", desc: "Live data pipelines with sub-second latency. WebSocket-native, auto-reconnecting." },
  { icon: <Shield className="w-5 h-5" />, title: "ANOMALY // DETECTION", desc: "ML-powered anomaly detection across all metrics. Custom alert thresholds and escalation." },
  { icon: <Globe className="w-5 h-5" />, title: "MULTI-SOURCE // FUSION", desc: "Ingest from 200+ sources. Unified schema, automatic normalization, zero-config." },
  { icon: <Users className="w-5 h-5" />, title: "TEAM // COLLABORATION", desc: "Shared dashboards, annotations, scheduled reports. Role-based access control." },
  { icon: <Zap className="w-5 h-5" />, title: "INSTANT // QUERIES", desc: "Sub-100ms query engine over petabyte-scale data. No pre-aggregation needed." },
  { icon: <Eye className="w-5 h-5" />, title: "CUSTOM // DASHBOARDS", desc: "Drag-and-drop builder with 40+ widget types. Embed anywhere with iframes." },
];

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay }}>{children}</motion.div>;
}

export default function PrismAnalyticsPage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => { const h = () => setScrolled(window.scrollY > 50); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h); }, []);

  return (
    <div className="premium-theme min-h-screen bg-[#0a0a12] text-white font-mono selection:bg-[#8b5cf6] selection:text-black overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,#8b5cf630_0%,#3b82f610_30%,transparent_60%)]" />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `radial-gradient(#8b5cf6 0.5px, transparent 0.5px)`, backgroundSize: "24px 24px" }} />
      </div>

      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? "bg-[#0a0a12]/90 backdrop-blur-xl py-4 border-b border-white/5" : "bg-transparent py-10"}`}>
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-3 text-xl font-black tracking-tighter">
            <div className="w-8 h-8 bg-gradient-to-br from-[#8b5cf6] to-[#3b82f6] rounded-lg flex items-center justify-center text-white"><BarChart3 className="w-4 h-4" /></div>
            <span className="group-hover:text-[#8b5cf6] transition-colors">PRISM // <span className="text-white/30">ANALYTICS</span></span>
          </Link>
          <div className="hidden lg:flex items-center gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">
            {["Product", "Pricing", "Docs", "Enterprise"].map(l => <Link key={l} href="#" className="hover:text-[#8b5cf6] transition-colors">{l}</Link>)}
          </div>
          <div className="flex items-center gap-4">
            <button className="px-6 py-2.5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all hidden md:block">Sign_In</button>
            <button className="px-6 py-2.5 bg-[#8b5cf6] text-white text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all hidden md:block">Start_Free</button>
          </div>
          <button onClick={() => setMenuOpen(true)} className="lg:hidden text-white/60"><Menu className="w-6 h-6" /></button>
        </div>
      </nav>

      <AnimatePresence>{menuOpen && (
        <motion.div initial={{ opacity: 0, x: "100%" }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: "100%" }} className="fixed inset-0 z-[100] bg-[#0a0a12] p-8 flex flex-col pt-32">
          <button onClick={() => setMenuOpen(false)} className="absolute top-10 right-8 text-white/40"><X className="w-10 h-10" /></button>
          {["Product", "Pricing", "Docs", "Enterprise"].map(l => <Link key={l} href="#" onClick={() => setMenuOpen(false)} className="text-5xl font-black tracking-tighter uppercase mb-10">{l}</Link>)}
        </motion.div>
      )}</AnimatePresence>

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col justify-center pt-20">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 w-full relative z-10">
          <Reveal>
            <div className="flex items-center gap-4 mb-8">
              <div className="px-3 py-1 bg-[#8b5cf6]/10 border border-[#8b5cf6]/30 text-[#8b5cf6] text-[9px] font-bold uppercase tracking-widest">GENERAL_AVAILABILITY</div>
            </div>
            <h1 className="text-7xl md:text-9xl lg:text-[10rem] font-black leading-[0.8] tracking-tighter uppercase mb-10">
              See <br /> Every <br /> <span className="text-[#8b5cf6]">Signal.</span>
            </h1>
            <p className="max-w-xl text-lg text-white/30 leading-relaxed font-light uppercase tracking-widest italic mb-12">
              Real-time analytics for teams that move fast. Unified data, instant insights, zero setup.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <button className="px-12 py-5 bg-[#8b5cf6] text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all shadow-[0_0_50px_rgba(139,92,246,0.2)]">Start_Free_Trial</button>
              <button className="px-12 py-5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all">Watch_Demo</button>
            </div>
          </Reveal>

          {/* Dashboard mockup */}
          <Reveal delay={0.2}>
            <div className="mt-20 p-8 bg-[#0e0e1a] border border-white/5 rounded-3xl backdrop-blur-xl">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {METRICS.map((m, i) => (
                  <div key={i} className="p-5 bg-white/[0.03] border border-white/5 rounded-2xl">
                    <div className="text-[8px] font-bold text-white/20 uppercase tracking-widest mb-2">{m.label}</div>
                    <div className="text-2xl font-black text-white">{m.val}</div>
                    <div className={`text-[10px] font-bold mt-1 ${m.up ? "text-emerald-400" : "text-red-400"}`}>{m.change}</div>
                  </div>
                ))}
              </div>
              {/* Chart */}
              <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                <div className="text-[8px] font-bold text-white/20 uppercase tracking-widest mb-6">REVENUE_TREND // 12_MONTHS</div>
                <div className="flex items-end gap-2 h-32">
                  {CHART_BARS.map((h, i) => (
                    <motion.div key={i} initial={{ height: 0 }} whileInView={{ height: `${h}%` }} transition={{ duration: 0.8, delay: i * 0.05 }} viewport={{ once: true }}
                      className="flex-1 rounded-t-sm bg-gradient-to-t from-[#8b5cf6] to-[#3b82f6]" />
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-40 bg-[#08081a] border-y border-white/5">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <Reveal><h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85] mb-24">Built For <span className="text-[#8b5cf6]">Scale.</span></h2></Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {FEATURES.map((f, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <div className="group p-10 bg-[#0e0e1a] border border-white/5 hover:border-[#8b5cf6]/30 rounded-3xl transition-all">
                  <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-[#8b5cf6] mb-6 group-hover:bg-[#8b5cf6] group-hover:text-white transition-all">{f.icon}</div>
                  <h3 className="text-xl font-black uppercase tracking-tighter mb-4 group-hover:text-[#8b5cf6] transition-colors">{f.title}</h3>
                  <p className="text-sm text-white/30">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="py-40 bg-[#0a0a12]">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <Reveal><h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-24 uppercase text-center">Simple <span className="text-[#8b5cf6]">Pricing.</span></h2></Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[{ name: "STARTER", price: "$0", period: "/mo", features: ["10K events/mo", "3 dashboards", "7-day retention", "Email support"], cta: "Start_Free" },
              { name: "PRO", price: "$49", period: "/mo", features: ["1M events/mo", "Unlimited dashboards", "1-year retention", "Priority support"], cta: "Start_Trial", featured: true },
              { name: "ENTERPRISE", price: "Custom", period: "", features: ["Unlimited events", "SSO & SAML", "Dedicated infra", "SLA guarantee"], cta: "Contact_Sales" }
            ].map((p, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className={`group p-10 border rounded-3xl transition-all ${p.featured ? "bg-[#8b5cf6]/10 border-[#8b5cf6]/30" : "bg-[#0e0e1a] border-white/5 hover:border-[#8b5cf6]/20"}`}>
                  <div className="text-[9px] font-bold text-[#8b5cf6] uppercase tracking-widest mb-4">{p.name}</div>
                  <div className="text-4xl font-black mb-1">{p.price}<span className="text-lg text-white/30">{p.period}</span></div>
                  <div className="space-y-4 mt-8 pt-8 border-t border-white/5">
                    {p.features.map((f, j) => <div key={j} className="flex items-center gap-3 text-[10px] text-white/40"><div className="w-1 h-1 bg-[#8b5cf6] rounded-full" />{f}</div>)}
                  </div>
                  <button className={`mt-8 w-full py-3 text-[10px] font-black uppercase tracking-widest transition-all ${p.featured ? "bg-[#8b5cf6] text-white hover:bg-white hover:text-black" : "border border-white/10 hover:bg-white hover:text-black"}`}>{p.cta}</button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-40 bg-[#08081a] border-t border-white/5 text-center">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <Reveal>
            <h2 className="text-6xl md:text-9xl font-black tracking-tighter uppercase mb-12">Start <span className="text-[#8b5cf6]">Seeing.</span></h2>
            <p className="max-w-xl mx-auto text-sm text-white/30 leading-relaxed font-light mb-16 uppercase tracking-widest italic">Free forever plan. No credit card required. Set up in 5 minutes.</p>
            <button className="px-16 py-6 bg-[#8b5cf6] text-white text-[12px] font-black uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all shadow-[0_0_60px_rgba(139,92,246,0.15)]">Create_Account</button>
          </Reveal>
        </div>
      </section>

      <footer className="bg-[#08081a] border-t border-white/5 py-32 px-6 md:px-12">
        <div className="max-w-[1500px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-24">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-3 text-xl font-black tracking-tighter mb-10"><div className="w-8 h-8 bg-gradient-to-br from-[#8b5cf6] to-[#3b82f6] rounded-lg flex items-center justify-center text-white"><BarChart3 className="w-4 h-4" /></div><span>PRISM // ANALYTICS</span></Link>
            <p className="text-[11px] text-white/15 uppercase tracking-[0.2em] max-w-sm leading-relaxed italic">Real-time analytics platform. See every signal.</p>
          </div>
          <div><h4 className="text-[10px] font-black uppercase tracking-widest mb-10 text-[#8b5cf6]">Product</h4><ul className="space-y-5 text-[10px] font-bold text-white/20 uppercase tracking-widest">{["Features", "Pricing", "Integrations", "Changelog"].map(l => <li key={l}><Link href="#">{l}</Link></li>)}</ul></div>
          <div><h4 className="text-[10px] font-black uppercase tracking-widest mb-10 text-[#8b5cf6]">Resources</h4><ul className="space-y-5 text-[10px] font-bold text-white/20 uppercase tracking-widest">{["Docs", "API_Reference", "Blog", "Status"].map(l => <li key={l}><Link href="#">{l}</Link></li>)}</ul></div>
        </div>
        <div className="max-w-[1500px] mx-auto mt-32 pt-16 border-t border-white/5 text-center text-[9px] font-bold text-white/10 uppercase tracking-widest">&copy; 2026 PRISM ANALYTICS</div>
      </footer>
    </div>
  );
}
