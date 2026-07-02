"use client";
// @ts-nocheck
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Link from "next/link"
import { Cloud, ArrowRight, Menu, Shield, Zap, Globe, Cpu, Database, Server, ChevronRight, Activity, Terminal } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

function Reveal({ children, delay = 0, y = 40 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }} animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  )
}

const NODES = [
  { title: "Edge Compute", desc: "120+ global regions with <5ms latency to end-users.", icon: Cpu, color: "#3b82f6" },
  { title: "Object Storage", desc: "S3-compatible, multi-region replication with 11 nines of durability.", icon: Database, color: "#8b5cf6" },
  { title: "Managed K8s", desc: "Auto-scaling clusters with built-in service mesh and observability.", icon: Server, color: "#ec4899" },
]

const STATS = [
  { value: "99.999%", label: "Uptime SLA" },
  { value: "250TB/s", label: "Network Capacity" },
  { value: "45ms", label: "Global Avg Latency" },
  { value: "24/7", label: "Expert Support" },
]

const INTEGRATIONS = [
  "Terraform", "Kubernetes", "GitHub", "GitLab", "Slack", "Prometheus", "Grafana", "Redis"
]


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function NebulaCloudPage() {
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

  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", h)
    
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
return () => window.removeEventListener("scroll", h)
  }, [])

  return (
    <div className="bg-[#020617] text-white font-sans min-h-screen selection:bg-blue-500 selection:text-white overflow-x-hidden">
      
      {/* ── NAVBAR ────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? "bg-[#020617]/80 backdrop-blur-2xl border-b border-blue-500/10 py-4" : "bg-transparent py-8"}`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="#hero" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
              <Cloud className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tighter">Nebula<span className="text-blue-500">Cloud</span></span>
          </Link>
          <div className="hidden lg:flex gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
            {["Engine", "Infrastructure", "Pricing", "Docs"].map(l => (
              <Link key={l} href="#tarifs" className="hover:text-blue-400 transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <button className="hidden md:block px-6 py-2.5 text-white/60 text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors">Log In</button>
            <button className="hidden md:block px-6 py-2.5 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-blue-500 transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)]">Get Started</button>
            <Sheet>
              <SheetTrigger className="lg:hidden"><Menu className="w-6 h-6 text-white" /></SheetTrigger>
              <SheetContent side="right" className="bg-[#020617] border-blue-500/10 p-12">
                <div className="flex flex-col gap-8 mt-16">
                  {["Engine", "Infrastructure", "Pricing", "Docs"].map(l => (
                    <Link key={l} href="#tarifs" className="text-2xl font-light uppercase tracking-widest hover:text-blue-400 transition-colors">{l}</Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      <main>
        {/* ── HERO ──────────────────── */}
        <section id="hero" className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-violet-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: "1s" }} />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]" />
          </div>

          <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-12 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div>
                <Reveal>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-8">
                    <Zap className="w-3 h-3" /> Next-Gen Cloud Platform
                  </div>
                </Reveal>
                <Reveal delay={0.1} y={60}>
                  <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8">{c?.heroHeadline ?? <>
                    Deploy<br/>Without<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-violet-400 to-blue-500">Limits.</span>
                  </>}</h1>
                </Reveal>
                <Reveal delay={0.2}>
                  <p className="text-xl text-slate-400 font-light max-w-lg leading-relaxed mb-10">{c?.heroSubline ?? fd?.tagline ?? <>
                    High-performance cloud infrastructure designed for modern engineering teams. Bare metal performance with serverless ease.
                  </>}</p>
                </Reveal>
                <Reveal delay={0.3}>
                  <div className="flex flex-wrap gap-4">
                    <button className="px-10 py-4 bg-white text-slate-950 font-bold rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-500 shadow-xl">
                      Deploy Your First Node
                    </button>
                    <button className="px-10 py-4 border border-white/10 text-white font-bold rounded-lg hover:bg-white/5 transition-all flex items-center gap-2">
                      <Terminal className="w-4 h-4" /> View CLI Docs
                    </button>
                  </div>
                </Reveal>
              </div>

              <Reveal delay={0.4} y={30}>
                <div className="relative">
                  <div className="absolute -inset-4 bg-blue-500/20 blur-2xl rounded-3xl" />
                  <div className="relative p-1 bg-gradient-to-br from-blue-500/20 to-violet-500/20 rounded-3xl border border-white/10 backdrop-blur-sm">
                    <div className="bg-slate-900/90 rounded-2xl p-6 border border-white/5 overflow-hidden font-mono text-sm leading-relaxed text-blue-300">
                      <div className="flex gap-1.5 mb-6">
                        <div className="w-3 h-3 rounded-full bg-red-500/50" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                        <div className="w-3 h-3 rounded-full bg-green-500/50" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-slate-500">$ nebula deploy --env production</p>
                        <p className="text-green-400">✔ Resolving dependencies...</p>
                        <p className="text-green-400">✔ Bundling assets (1.2MB)...</p>
                        <p className="text-green-400">✔ Provisioning edge nodes [FRA, SGP, NYC, SFO]...</p>
                        <p className="text-blue-400">⚡ Deployment active at nebula-prod-v2.edge</p>
                        <p className="text-slate-500 mt-4">Stats:</p>
                        <p className="text-slate-300">  Latency: 12ms</p>
                        <p className="text-slate-300">  Cold Start: 0.8ms</p>
                        <p className="text-slate-300">  Availability: 100%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── STATS ─────────────────── */}
        <section className="py-20 border-y border-white/5 bg-slate-950/50">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
              {STATS.map((s, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="text-3xl md:text-4xl font-black text-blue-500 mb-1">{s.value}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{s.label}</div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── INFRASTRUCTURE ────────── */}
        <section className="py-32 relative overflow-hidden">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="text-center mb-24">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-blue-400 block mb-4">Infrastructure</span>
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter">Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">Backbone.</span></h2>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {NODES.map((n, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="group p-10 bg-slate-900/40 border border-white/5 rounded-3xl hover:bg-slate-900/60 hover:border-blue-500/30 transition-all duration-500 h-full relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                      <n.icon className="w-32 h-32" />
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center mb-8 border border-white/5 group-hover:scale-110 transition-transform duration-500">
                      <n.icon className="w-6 h-6 text-blue-400" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">{n.title}</h3>
                    <p className="text-slate-400 leading-relaxed text-sm mb-8">{n.desc}</p>
                    <Link href="#hero" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-blue-400 group-hover:gap-4 transition-all">
                      Learn More <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECURITY ──────────────── */}
        <section className="py-32 bg-gradient-to-b from-slate-950 to-[#020617]">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <Reveal>
                <div className="relative aspect-square">
                  <div className="absolute inset-0 bg-blue-600/20 blur-[100px] rounded-full animate-pulse" />
                  <div className="relative h-full flex items-center justify-center">
                    <div className="w-64 h-64 border border-blue-500/20 rounded-full flex items-center justify-center animate-[spin_20s_linear_infinite]">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center"><Shield className="w-4 h-4" /></div>
                    </div>
                    <div className="absolute w-40 h-40 border border-violet-500/20 rounded-full flex items-center justify-center animate-[spin_15s_linear_infinite_reverse]">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center"><Lock className="w-4 h-4" /></div>
                    </div>
                    <Globe className="w-16 h-16 text-blue-400" />
                  </div>
                </div>
              </Reveal>
              <div>
                <Reveal>
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-blue-400 block mb-4">Compliance</span>
                  <h2 className="text-5xl font-black tracking-tighter mb-8">Hardened by <span className="text-blue-500 italic">Default.</span></h2>
                  <div className="space-y-6">
                    {[
                      { t: "Isolation", d: "Firecracker microVM isolation for every function and node." },
                      { t: "Certifications", d: "SOC2 Type II, ISO 27001, and HIPAA compliant environments." },
                      { t: "Encryption", d: "AES-256 at rest and TLS 1.3 in transit with mTLS between services." }
                    ].map((item, i) => (
                      <div key={i} className="flex gap-4 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                        <div>
                          <h4 className="font-bold mb-1">{item.t}</h4>
                          <p className="text-sm text-slate-500 leading-relaxed">{item.d}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ──────────── */}
        <section id="services" className="py-40 bg-[#020617] border-t border-white/5">
          <div className="max-w-6xl mx-auto px-6 md:px-12">
            <Reveal>
              <p className="text-[10px] uppercase tracking-[0.5em] text-blue-400/50 mb-6">Trusted by Engineering Teams</p>
              <h2 className="text-4xl md:text-7xl font-bold text-white mb-20 leading-tight tracking-tight">
                What teams <span className="text-white/20 font-light">say.</span>
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5">
              {[
                { quote: "We migrated 140 microservices in a single weekend with zero downtime. Their orchestration layer handled the complexity we were dreading. Remarkable.", name: "R. Nakamura", title: "VP Infrastructure · Apex Financial" },
                { quote: "Our p99 latency dropped from 380ms to 22ms after onboarding. The edge routing intelligence is genuinely next-level.", name: "L. Okafor", title: "SRE Lead · Meridian Tech" },
                { quote: "The compliance dashboard alone was worth the migration. SOC 2 audit prep that used to take weeks now takes hours.", name: "C. Voss", title: "CTO · NovaBridge Systems" },
              ].map((t, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="bg-[#020617] p-12 flex flex-col gap-6 hover:bg-slate-950 transition-colors">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, s) => <span key={s} className="text-blue-400 text-xs">★</span>)}
                    </div>
                    <p className="text-white/40 leading-relaxed italic flex-1">{t.quote}</p>
                    <div className="border-t border-white/5 pt-6">
                      <div className="text-xs font-bold text-white uppercase tracking-widest">{t.name}</div>
                      <div className="text-[10px] text-blue-400/50 tracking-wide mt-1">{t.title}</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRICING ───────────────── */}
        <section id="tarifs" className="py-40 bg-slate-950 border-t border-white/5">
          <div className="max-w-6xl mx-auto px-6 md:px-12">
            <Reveal>
              <p className="text-[10px] uppercase tracking-[0.5em] text-blue-400/50 mb-6">Pricing</p>
              <h2 className="text-4xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
                Simple, <span className="text-white/20 font-light">predictable.</span>
              </h2>
              <p className="text-white/30 mb-20 max-w-lg leading-relaxed">No egress fees. No hidden charges. Pay for what you use.</p>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5">
              {[
                { name: "Starter", price: "$299", unit: "/mo", highlight: false, features: ["Up to 10 services", "99.9% uptime SLA", "Edge PoPs in 12 regions", "Basic compliance dashboard", "Community support"] },
                { name: "Scale", price: "$999", unit: "/mo", highlight: true, features: ["Unlimited services", "99.99% uptime SLA", "Edge PoPs in 38 regions", "SOC 2 compliance suite", "Dedicated SRE on-call"] },
                { name: "Enterprise", price: "Custom", unit: "", highlight: false, features: ["White-label infrastructure", "Bespoke SLA", "Private edge PoPs", "Full audit toolchain", "24/7 dedicated team"] },
              ].map((p, i) => (
                <Reveal key={p.name} delay={i * 0.1}>
                  <div className={`p-12 flex flex-col gap-6 ${p.highlight ? "bg-blue-600" : "bg-[#020617]"}`}>
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-white/40 mb-3">{p.name}</div>
                      <div className="text-4xl font-bold text-white">{p.price}<span className="text-base font-light text-white/40">{p.unit}</span></div>
                    </div>
                    <ul className="flex flex-col gap-3 flex-1">
                      {p.features.map(f => (
                        <li key={f} className="flex items-center gap-3 text-sm text-white/60">
                          <Activity className="w-3 h-3 text-blue-400 flex-shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <div className={`text-[10px] uppercase tracking-widest font-bold py-3 px-6 text-center border ${p.highlight ? "border-white text-white hover:bg-white hover:text-blue-600" : "border-blue-500/30 text-blue-400 hover:border-blue-400"} transition-colors cursor-pointer`}>
                      Get started
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ───────────────────── */}
        <section id="contact" className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-600/5" />
          <div className="relative z-10 max-w-[800px] mx-auto px-6 text-center">
            <Reveal>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8">Ready to Scale<br/>Beyond <span className="text-blue-500">Borders?</span></h2>
              <p className="text-xl text-slate-400 font-light mb-12">Start today with $200 in free credits. No credit card required to explore our ecosystem.</p>
              <div className="flex flex-wrap justify-center gap-4">
                <button className="px-12 py-5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-all shadow-2xl shadow-blue-500/20">
                  Create Free Account
                </button>
                <button className="px-12 py-5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/5 transition-all">
                  Contact Enterprise
                </button>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      {/* ── FOOTER ────────────────── */}
      <footer className="bg-slate-950 pt-24 pb-12 px-6">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-5 gap-16 mb-20">
          <div className="md:col-span-2">
            <Link href="#hero" className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center">
                <Cloud className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tighter">Nebula<span className="text-blue-500">Cloud</span></span>
            </Link>
            <p className="text-slate-500 max-w-sm leading-relaxed mb-8">{c?.aboutText ?? <>
              The world's fastest cloud platform for building and scaling high-performance applications at the edge.
            </>}</p>
            <div className="flex gap-4">
              {["github", "twitter", "discord"].map(s => (
                <div key={s} className="w-10 h-10 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center hover:bg-slate-800 transition-colors cursor-pointer text-slate-400 hover:text-white uppercase text-[8px] font-bold tracking-widest">{s}</div>
              ))}
            </div>
          </div>
          {[
            { t: "Platform", l: ["Compute", "Storage", "Network", "Databases"] },
            { t: "Resources", l: ["Documentation", "API Ref", "Status", "Changelog"] },
            { t: "Company", l: ["About", "Blog", "Careers", "Security"] },
          ].map((col, i) => (
            <div key={i}>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-500 mb-8">{col.t}</h4>
              <ul className="space-y-4">
                {col.l.map(link => <li key={link}><Link href={link === "About" ? "#hero" : link === "Blog" || col.t === "Platform" ? "#services" : "#contact"} className="text-sm text-slate-500 hover:text-white transition-colors">{link}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-[1400px] mx-auto pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-slate-600">
          <span>© 2026 NEBULA CLOUD TECHNOLOGIES INC.</span>
          <div className="flex gap-8">
            <Link href="#contact" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#contact" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#contact" className="hover:text-white transition-colors">SLA Status</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function Lock({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
  )
}
