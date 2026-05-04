"use client";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Leaf, TreePine, Droplets, Menu, X, ArrowRight, Sun, Wind, Recycle, Globe, BarChart3, Heart, Users, CheckCircle2, Star, Mail } from "lucide-react";
import "../premium.css";

const IMPACT_STATS = [
  { label: "CO₂ OFFSET", val: "24K", unit: "TONS", color: "#16a34a" },
  { label: "TREES PLANTED", val: "1.2M", unit: "", color: "#16a34a" },
  { label: "CLEAN ENERGY", val: "840", unit: "GWH", color: "#16a34a" },
  { label: "COMMUNITIES", val: "320", unit: "", color: "#16a34a" },
];

const FEATURES = [
  { icon: <Sun className="w-6 h-6" />, title: "Solar Infrastructure", desc: "Utility-scale solar farms powering 200,000+ homes across three continents." },
  { icon: <Wind className="w-6 h-6" />, title: "Wind Energy", desc: "Offshore and onshore wind projects delivering clean energy at grid parity." },
  { icon: <Droplets className="w-6 h-6" />, title: "Water Restoration", desc: "Watershed protection programs restoring 14 river ecosystems to health." },
  { icon: <Recycle className="w-6 h-6" />, title: "Circular Economy", desc: "Zero-waste manufacturing processes eliminating 98% of industrial byproducts." },
  { icon: <TreePine className="w-6 h-6" />, title: "Reforestation", desc: "1.2 million native trees planted in partnership with indigenous communities." },
  { icon: <Globe className="w-6 h-6" />, title: "Carbon Markets", desc: "Verified carbon credits traded on major exchanges with full chain-of-custody." },
];

const TESTIMONIALS = [
  { name: "Dr. Elena Vasquez", role: "Climate Policy Director, UNEP", quote: "Verdant has set a new standard for corporate environmental accountability. Their transparency is unmatched." },
  { name: "Marcus Chen", role: "CEO, Pacific Renewables", quote: "Working with Verdant transformed our sustainability roadmap from aspiration to measurable action." },
  { name: "Sarah Okafor", role: "Head of ESG, Meridian Capital", quote: "The impact metrics Verdant provides give our investors the confidence they need in green assets." },
];

const PRICING = [
  { name: "SEED", price: "$2,500", period: "/mo", desc: "For growing companies", features: ["Carbon footprint audit", "Quarterly reporting", "5 team members", "Email support"], cta: "Start_Seed" },
  { name: "GROWTH", price: "$8,500", period: "/mo", desc: "For scaling impact", features: ["Full lifecycle analysis", "Monthly reporting", "25 team members", "Dedicated advisor", "Carbon offset program"], cta: "Start_Growth", featured: true },
  { name: "FOREST", price: "Custom", period: "", desc: "Enterprise scale", features: ["Custom frameworks", "Real-time dashboards", "Unlimited team", "SLA guarantee", "Board presentations"], cta: "Contact_Sales" },
];

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay }}>{children}</motion.div>;
}

export default function VerdantImpactPage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  useEffect(() => { const h = () => setScrolled(window.scrollY > 50); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h); }, []);

  return (
    <div className="premium-theme min-h-screen bg-[#f8faf5] text-[#1a2e1a] font-mono selection:bg-[#16a34a] selection:text-white overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.02]" style={{ backgroundImage: `radial-gradient(#16a34a 0.5px, transparent 0.5px)`, backgroundSize: "40px 40px" }} />

      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? "bg-[#f8faf5]/90 backdrop-blur-xl py-4 border-b border-[#1a2e1a]/5" : "bg-transparent py-10"}`}>
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-3 text-xl font-black tracking-tighter">
            <div className="w-8 h-8 bg-[#16a34a] rounded-full flex items-center justify-center text-white"><Leaf className="w-4 h-4" /></div>
            <span className="group-hover:text-[#16a34a] transition-colors">VERDANT // <span className="text-[#1a2e1a]/30">IMPACT</span></span>
          </Link>
          <div className="hidden lg:flex items-center gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-[#1a2e1a]/30">
            {["Solutions", "Impact", "Pricing", "Contact"].map(l => <Link key={l} href="#" className="hover:text-[#16a34a] transition-colors">{l}</Link>)}
          </div>
          <button className="px-6 py-2.5 bg-[#16a34a] text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#1a2e1a] transition-all hidden md:block">Get_Started</button>
          <button onClick={() => setMenuOpen(true)} className="lg:hidden text-[#1a2e1a]/40"><Menu className="w-6 h-6" /></button>
        </div>
      </nav>

      <AnimatePresence>{menuOpen && (
        <motion.div initial={{ opacity: 0, x: "100%" }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: "100%" }} className="fixed inset-0 z-[100] bg-[#f8faf5] p-8 flex flex-col pt-32">
          <button onClick={() => setMenuOpen(false)} className="absolute top-10 right-8 text-[#1a2e1a]/40"><X className="w-10 h-10" /></button>
          {["Solutions", "Impact", "Pricing", "Contact"].map(l => <Link key={l} href="#" onClick={() => setMenuOpen(false)} className="text-5xl font-black tracking-tighter uppercase mb-10">{l}</Link>)}
        </motion.div>
      )}</AnimatePresence>

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col justify-center pt-20">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 w-full relative z-10">
          <Reveal>
            <div className="flex items-center gap-4 mb-8">
              <div className="px-3 py-1 bg-[#16a34a]/10 border border-[#16a34a]/30 text-[#16a34a] text-[9px] font-bold uppercase tracking-widest">B_CORP_CERTIFIED</div>
            </div>
            <h1 className="text-7xl md:text-9xl lg:text-[10rem] font-black leading-[0.8] tracking-tighter uppercase mb-10">
              Build A <br /> <span className="text-[#16a34a]">Greener</span> <br /> Future.
            </h1>
            <p className="max-w-xl text-lg text-[#1a2e1a]/40 leading-relaxed font-light uppercase tracking-widest italic mb-12">
              Enterprise sustainability platform. Measure, reduce, and offset your environmental footprint with verified impact.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <button className="px-12 py-5 bg-[#16a34a] text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-[#1a2e1a] transition-all">Start_Free_Trial</button>
              <button className="px-12 py-5 border border-[#1a2e1a]/10 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-[#1a2e1a] hover:text-white transition-all">Watch_Demo</button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FEATURES / BENEFITS */}
      <section className="py-40 bg-white border-y border-[#1a2e1a]/5">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <Reveal><h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85] mb-6">Our <span className="text-[#16a34a]">Solutions.</span></h2></Reveal>
          <Reveal delay={0.1}><p className="text-lg text-[#1a2e1a]/40 max-w-2xl mb-24 uppercase tracking-widest italic font-light">End-to-end sustainability infrastructure for companies that mean it.</p></Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {FEATURES.map((f, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <div className="group p-10 bg-[#f8faf5] border border-[#1a2e1a]/5 hover:border-[#16a34a]/30 rounded-3xl transition-all">
                  <div className="w-14 h-14 bg-[#16a34a]/10 rounded-2xl flex items-center justify-center text-[#16a34a] mb-8 group-hover:bg-[#16a34a] group-hover:text-white transition-all">{f.icon}</div>
                  <h3 className="text-xl font-black uppercase tracking-tighter mb-4 group-hover:text-[#16a34a] transition-colors">{f.title}</h3>
                  <p className="text-sm text-[#1a2e1a]/40 leading-relaxed">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* IMPACT STATS */}
      <section className="py-40 bg-[#1a2e1a] text-white text-center">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <Reveal><h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85] mb-24">Measured <span className="text-[#16a34a]">Impact.</span></h2></Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-16">
            {IMPACT_STATS.map((s, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="group"><div className="text-4xl md:text-6xl font-black text-white mb-2 group-hover:text-[#16a34a] transition-colors">{s.val}</div><div className="text-[9px] font-black text-white/30 uppercase tracking-widest">{s.unit} {s.label}</div></div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-40 bg-[#f8faf5]">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <Reveal><h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85] mb-24">What They <span className="text-[#16a34a]">Say.</span></h2></Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="p-10 bg-white border border-[#1a2e1a]/5 rounded-3xl h-full flex flex-col">
                  <div className="flex gap-1 mb-6">{[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 text-[#16a34a] fill-[#16a34a]" />)}</div>
                  <p className="text-base text-[#1a2e1a]/50 italic leading-relaxed flex-1 mb-8">&ldquo;{t.quote}&rdquo;</p>
                  <div className="pt-6 border-t border-[#1a2e1a]/5">
                    <div className="font-black uppercase text-sm">{t.name}</div>
                    <div className="text-[10px] text-[#1a2e1a]/30 uppercase tracking-widest">{t.role}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="py-40 bg-white border-y border-[#1a2e1a]/5">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <Reveal><h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-24 uppercase text-center">Simple <span className="text-[#16a34a]">Pricing.</span></h2></Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {PRICING.map((p, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className={`group p-10 border rounded-3xl transition-all ${p.featured ? "bg-[#16a34a]/5 border-[#16a34a]/30 scale-105" : "bg-[#f8faf5] border-[#1a2e1a]/5 hover:border-[#16a34a]/20"}`}>
                  <div className="text-[9px] font-bold text-[#16a34a] uppercase tracking-widest mb-2">{p.name}</div>
                  <div className="text-4xl font-black mb-1">{p.price}<span className="text-lg text-[#1a2e1a]/30">{p.period}</span></div>
                  <p className="text-[10px] text-[#1a2e1a]/30 uppercase tracking-widest mb-8">{p.desc}</p>
                  <div className="space-y-4 pt-8 border-t border-[#1a2e1a]/5">
                    {p.features.map((f, j) => <div key={j} className="flex items-center gap-3 text-[10px] text-[#1a2e1a]/50"><CheckCircle2 className="w-3.5 h-3.5 text-[#16a34a]" />{f}</div>)}
                  </div>
                  <button className={`mt-8 w-full py-3 text-[10px] font-black uppercase tracking-widest transition-all rounded-lg ${p.featured ? "bg-[#16a34a] text-white hover:bg-[#1a2e1a]" : "border border-[#1a2e1a]/10 hover:bg-[#16a34a] hover:text-white hover:border-transparent"}`}>{p.cta}</button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="py-40 bg-[#f8faf5]">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
            <div>
              <Reveal>
                <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-12 uppercase">Get In <span className="text-[#16a34a]">Touch.</span></h2>
                <p className="text-lg text-[#1a2e1a]/40 max-w-lg mb-12 uppercase tracking-widest italic font-light">Ready to start your sustainability journey? Let&apos;s talk.</p>
              </Reveal>
            </div>
            <Reveal delay={0.15}>
              <div className="space-y-6">
                <input type="text" placeholder="Your Name" value={contactName} onChange={e => setContactName(e.target.value)}
                  className="w-full p-5 bg-white border border-[#1a2e1a]/10 rounded-xl text-sm font-mono focus:border-[#16a34a] focus:outline-none transition-colors" />
                <input type="email" placeholder="Email Address" value={contactEmail} onChange={e => setContactEmail(e.target.value)}
                  className="w-full p-5 bg-white border border-[#1a2e1a]/10 rounded-xl text-sm font-mono focus:border-[#16a34a] focus:outline-none transition-colors" />
                <textarea placeholder="Tell us about your sustainability goals..." value={contactMessage} onChange={e => setContactMessage(e.target.value)} rows={5}
                  className="w-full p-5 bg-white border border-[#1a2e1a]/10 rounded-xl text-sm font-mono focus:border-[#16a34a] focus:outline-none transition-colors resize-none" />
                <button className="w-full py-5 bg-[#16a34a] text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-[#1a2e1a] transition-all rounded-xl">Send_Message</button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <footer className="bg-[#1a2e1a] text-white py-32 px-6 md:px-12">
        <div className="max-w-[1500px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-24">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-3 text-xl font-black tracking-tighter mb-10"><div className="w-8 h-8 bg-[#16a34a] text-white rounded-full flex items-center justify-center"><Leaf className="w-4 h-4" /></div><span>VERDANT // IMPACT</span></Link>
            <p className="text-[11px] text-white/15 uppercase tracking-[0.2em] max-w-sm leading-relaxed italic">Enterprise sustainability platform. Measure. Reduce. Offset.</p>
          </div>
          <div><h4 className="text-[10px] font-black uppercase tracking-widest mb-10 text-[#16a34a]">Platform</h4><ul className="space-y-5 text-[10px] font-bold text-white/20 uppercase tracking-widest">{["Solutions", "Impact", "Pricing", "API"].map(l => <li key={l}><Link href="#">{l}</Link></li>)}</ul></div>
          <div><h4 className="text-[10px] font-black uppercase tracking-widest mb-10 text-[#16a34a]">Company</h4><ul className="space-y-5 text-[10px] font-bold text-white/20 uppercase tracking-widest">{["About", "Blog", "Careers", "Contact"].map(l => <li key={l}><Link href="#">{l}</Link></li>)}</ul></div>
        </div>
        <div className="max-w-[1500px] mx-auto mt-32 pt-16 border-t border-white/5 text-center text-[9px] font-bold text-white/10 uppercase tracking-widest">&copy; 2026 VERDANT IMPACT</div>
      </footer>
    </div>
  );
}
