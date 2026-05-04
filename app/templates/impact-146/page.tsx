"use client";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Wallet, ArrowUpRight, ArrowDownLeft, TrendingUp, Menu, X, ArrowRight, Shield, Zap, Globe, Star, CheckCircle2, Lock, Smartphone, BarChart3 } from "lucide-react";
import "../premium.css";

const ASSETS = [
  { name: "Bitcoin", symbol: "BTC", price: "$67,842", change: "+3.2%", up: true, holdings: "1.24", value: "$84,124" },
  { name: "Ethereum", symbol: "ETH", price: "$3,524", change: "+5.1%", up: true, holdings: "14.8", value: "$52,155" },
  { name: "Solana", symbol: "SOL", price: "$178", change: "-1.4%", up: false, holdings: "120", value: "$21,360" },
  { name: "Avalanche", symbol: "AVAX", price: "$42", change: "+2.8%", up: true, holdings: "340", value: "$14,280" },
];

const FEATURES = [
  { icon: <Shield className="w-6 h-6" />, title: "Military-Grade Security", desc: "Multi-sig wallets, biometric auth, and hardware key support. Your assets, your control." },
  { icon: <Zap className="w-6 h-6" />, title: "Instant Swaps", desc: "Cross-chain atomic swaps with MEV protection. Best execution across 40+ DEXs." },
  { icon: <Globe className="w-6 h-6" />, title: "Multi-Chain Native", desc: "EVM, Solana, Cosmos, and Bitcoin on one interface. No bridging friction." },
  { icon: <BarChart3 className="w-6 h-6" />, title: "Portfolio Analytics", desc: "Real-time P&L, tax-loss harvesting signals, and DeFi position tracking." },
  { icon: <Lock className="w-6 h-6" />, title: "Self-Custody", desc: "Non-custodial architecture. We never touch your keys. Ever." },
  { icon: <Smartphone className="w-6 h-6" />, title: "Mobile Native", desc: "Full-featured iOS and Android apps with push notifications for price alerts." },
];

const TESTIMONIALS = [
  { name: "David Kim", role: "DeFi Researcher", quote: "Velos is the first wallet that doesn't make me choose between security and convenience. The multi-chain UX is flawless." },
  { name: "Priya Patel", role: "Fund Manager, Paradigm", quote: "We moved our entire portfolio management to Velos. The analytics alone saved us 20 hours per week." },
  { name: "Marco Rossi", role: "Crypto OG", quote: "After trying every wallet on the market, Velos is the one I actually use daily. It just works." },
];

const PRICING = [
  { name: "FREE", price: "$0", period: "/mo", features: ["5 chains supported", "Basic analytics", "Unlimited swaps", "Community support"], cta: "Download_Free" },
  { name: "PRO", price: "$9.99", period: "/mo", features: ["All 40+ chains", "Advanced analytics", "Tax reporting", "Priority support", "API access"], cta: "Start_Pro", featured: true },
  { name: "INSTITUTIONAL", price: "Custom", period: "", features: ["Multi-sig governance", "Compliance tools", "Dedicated infra", "SLA guarantee", "White-label option"], cta: "Contact_Sales" },
];

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay }}>{children}</motion.div>;
}

export default function VelosFinTechPage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => { const h = () => setScrolled(window.scrollY > 50); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h); }, []);

  return (
    <div className="premium-theme min-h-screen bg-[#06090f] text-white font-mono selection:bg-[#06b6d4] selection:text-black overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,#06b6d420_0%,transparent_50%)]" />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `radial-gradient(#06b6d4 0.5px, transparent 0.5px)`, backgroundSize: "28px 28px" }} />
      </div>

      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? "bg-[#06090f]/90 backdrop-blur-xl py-4 border-b border-white/5" : "bg-transparent py-10"}`}>
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-3 text-xl font-black tracking-tighter">
            <div className="w-8 h-8 bg-[#06b6d4] rounded-lg flex items-center justify-center text-black"><Wallet className="w-4 h-4" /></div>
            <span className="group-hover:text-[#06b6d4] transition-colors">VELOS // <span className="text-white/30">FINTECH</span></span>
          </Link>
          <div className="hidden lg:flex items-center gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">
            {["Features", "Security", "Pricing", "Download"].map(l => <Link key={l} href="#" className="hover:text-[#06b6d4] transition-colors">{l}</Link>)}
          </div>
          <div className="flex items-center gap-4">
            <button className="px-6 py-2.5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all hidden md:block">Sign_In</button>
            <button className="px-6 py-2.5 bg-[#06b6d4] text-black text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all hidden md:block">Download</button>
          </div>
          <button onClick={() => setMenuOpen(true)} className="lg:hidden text-white/60"><Menu className="w-6 h-6" /></button>
        </div>
      </nav>

      <AnimatePresence>{menuOpen && (
        <motion.div initial={{ opacity: 0, x: "100%" }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: "100%" }} className="fixed inset-0 z-[100] bg-[#06090f] p-8 flex flex-col pt-32">
          <button onClick={() => setMenuOpen(false)} className="absolute top-10 right-8 text-white/40"><X className="w-10 h-10" /></button>
          {["Features", "Security", "Pricing", "Download"].map(l => <Link key={l} href="#" onClick={() => setMenuOpen(false)} className="text-5xl font-black tracking-tighter uppercase mb-10">{l}</Link>)}
        </motion.div>
      )}</AnimatePresence>

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col justify-center pt-20">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 w-full relative z-10">
          <Reveal>
            <div className="flex items-center gap-4 mb-8">
              <div className="px-3 py-1 bg-[#06b6d4]/10 border border-[#06b6d4]/30 text-[#06b6d4] text-[9px] font-bold uppercase tracking-widest">V2.0_RELEASED</div>
            </div>
            <h1 className="text-7xl md:text-9xl lg:text-[10rem] font-black leading-[0.8] tracking-tighter uppercase mb-10">
              Own <br /> Your <br /> <span className="text-[#06b6d4]">Future.</span>
            </h1>
            <p className="max-w-xl text-lg text-white/30 leading-relaxed font-light uppercase tracking-widest italic mb-12">
              The self-custody wallet for serious crypto. Multi-chain. Institutional-grade security. Beautiful UX.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <button className="px-12 py-5 bg-[#06b6d4] text-black text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white transition-all shadow-[0_0_50px_rgba(6,182,212,0.2)]">Download_Now</button>
              <button className="px-12 py-5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all">Watch_Demo</button>
            </div>
          </Reveal>

          {/* Dashboard mockup */}
          <Reveal delay={0.2}>
            <div className="mt-20 p-6 bg-[#0a0e16] border border-white/5 rounded-2xl max-w-3xl">
              <div className="text-[8px] font-bold text-white/20 uppercase tracking-widest mb-6">PORTFOLIO // $171,919</div>
              <div className="space-y-3">
                {ASSETS.map((a, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-[#06b6d4]/10 rounded-lg flex items-center justify-center text-[#06b6d4] text-[10px] font-black">{a.symbol.charAt(0)}</div>
                      <div><div className="text-sm font-black">{a.name}</div><div className="text-[9px] text-white/20">{a.symbol}</div></div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-black">{a.value}</div>
                      <div className={`text-[9px] font-bold ${a.up ? "text-emerald-400" : "text-red-400"}`}>{a.change}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-40 bg-[#080c14] border-y border-white/5">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <Reveal><h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85] mb-24">Built For <span className="text-[#06b6d4]">Builders.</span></h2></Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {FEATURES.map((f, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <div className="group p-10 bg-[#0a0e16] border border-white/5 hover:border-[#06b6d4]/30 rounded-3xl transition-all">
                  <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-[#06b6d4] mb-8 group-hover:bg-[#06b6d4] group-hover:text-black transition-all">{f.icon}</div>
                  <h3 className="text-xl font-black uppercase tracking-tighter mb-4 group-hover:text-[#06b6d4] transition-colors">{f.title}</h3>
                  <p className="text-sm text-white/30 leading-relaxed">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-40 bg-[#06090f]">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <Reveal><h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85] mb-24">Trusted <span className="text-[#06b6d4]">By.</span></h2></Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="p-10 bg-[#0a0e16] border border-white/5 rounded-3xl h-full flex flex-col">
                  <div className="flex gap-1 mb-6">{[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 text-[#06b6d4] fill-[#06b6d4]" />)}</div>
                  <p className="text-base text-white/40 italic leading-relaxed flex-1 mb-8">&ldquo;{t.quote}&rdquo;</p>
                  <div className="pt-6 border-t border-white/5">
                    <div className="font-black uppercase text-sm">{t.name}</div>
                    <div className="text-[10px] text-white/20 uppercase tracking-widest">{t.role}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="py-40 bg-[#080c14] border-y border-white/5">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <Reveal><h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-24 uppercase text-center">Simple <span className="text-[#06b6d4]">Plans.</span></h2></Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {PRICING.map((p, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className={`group p-10 border rounded-3xl transition-all ${p.featured ? "bg-[#06b6d4]/5 border-[#06b6d4]/30 scale-105" : "bg-[#0a0e16] border-white/5 hover:border-[#06b6d4]/20"}`}>
                  <div className="text-[9px] font-bold text-[#06b6d4] uppercase tracking-widest mb-2">{p.name}</div>
                  <div className="text-4xl font-black mb-1">{p.price}<span className="text-lg text-white/30">{p.period}</span></div>
                  <div className="space-y-4 mt-8 pt-8 border-t border-white/5">
                    {p.features.map((f, j) => <div key={j} className="flex items-center gap-3 text-[10px] text-white/40"><CheckCircle2 className="w-3.5 h-3.5 text-[#06b6d4]" />{f}</div>)}
                  </div>
                  <button className={`mt-8 w-full py-3 text-[10px] font-black uppercase tracking-widest transition-all ${p.featured ? "bg-[#06b6d4] text-black hover:bg-white" : "border border-white/10 hover:bg-[#06b6d4] hover:text-black hover:border-transparent"}`}>{p.cta}</button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-40 bg-[#06090f] text-center">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <Reveal>
            <h2 className="text-6xl md:text-9xl font-black tracking-tighter uppercase mb-12">Start <span className="text-[#06b6d4]">Now.</span></h2>
            <p className="max-w-xl mx-auto text-sm text-white/30 leading-relaxed font-light mb-16 uppercase tracking-widest italic">Download Velos. Free forever. Your keys, your crypto.</p>
            <button className="px-16 py-6 bg-[#06b6d4] text-black text-[12px] font-black uppercase tracking-[0.4em] hover:bg-white transition-all shadow-[0_0_60px_rgba(6,182,212,0.15)]">Download_Velos</button>
          </Reveal>
        </div>
      </section>

      <footer className="bg-[#06090f] border-t border-white/5 py-32 px-6 md:px-12">
        <div className="max-w-[1500px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-24">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-3 text-xl font-black tracking-tighter mb-10"><div className="w-8 h-8 bg-[#06b6d4] text-black rounded-lg flex items-center justify-center"><Wallet className="w-4 h-4" /></div><span>VELOS // FINTECH</span></Link>
            <p className="text-[11px] text-white/15 uppercase tracking-[0.2em] max-w-sm leading-relaxed italic">Self-custody crypto wallet. Multi-chain. Secure. Beautiful.</p>
          </div>
          <div><h4 className="text-[10px] font-black uppercase tracking-widest mb-10 text-[#06b6d4]">Product</h4><ul className="space-y-5 text-[10px] font-bold text-white/20 uppercase tracking-widest">{["Features", "Security", "Chains", "API"].map(l => <li key={l}><Link href="#">{l}</Link></li>)}</ul></div>
          <div><h4 className="text-[10px] font-black uppercase tracking-widest mb-10 text-[#06b6d4]">Resources</h4><ul className="space-y-5 text-[10px] font-bold text-white/20 uppercase tracking-widest">{["Docs", "Blog", "Status", "Support"].map(l => <li key={l}><Link href="#">{l}</Link></li>)}</ul></div>
        </div>
        <div className="max-w-[1500px] mx-auto mt-32 pt-16 border-t border-white/5 text-center text-[9px] font-bold text-white/10 uppercase tracking-widest">&copy; 2026 VELOS FINTECH</div>
      </footer>
    </div>
  );
}
