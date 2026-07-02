"use client";
// @ts-nocheck
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Link from "next/link"
import { Code2, ArrowRight, Menu, Star, Terminal, GitBranch, Cpu, Boxes, Download, ChevronRight, Globe, ExternalLink, Copy, Check } from "lucide-react"
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

function CodeBlock({ code, lang = "typescript" }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div className="relative group">
      <div className="absolute top-3 right-3 z-10">
        <button onClick={handleCopy} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
          {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5 text-white/40" />}
        </button>
      </div>
      <div className="bg-[#0d1117] border border-white/5 rounded-xl p-6 overflow-x-auto">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 rounded-full bg-red-500/50" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
          <div className="w-3 h-3 rounded-full bg-green-500/50" />
          <span className="ml-2 text-[10px] font-mono text-white/20">{lang}</span>
        </div>
        <pre className="text-sm font-mono text-white/60 leading-relaxed">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  )
}

const FEATURES = [
  { icon: Cpu, title: "Zero-Copy Transforms", desc: "Process data streams without memory allocation overhead. 10x faster than alternatives." },
  { icon: Boxes, title: "Plugin Architecture", desc: "Extend the core with typed plugins. Community-maintained registry with 200+ packages." },
  { icon: GitBranch, title: "Built-in Versioning", desc: "Track every schema change with automatic migration generation and rollback." },
  { icon: Terminal, title: "CLI First", desc: "Full control from your terminal. Scriptable, composable, and CI/CD-friendly." },
]

const STATS = [
  { value: "14K", label: "GitHub Stars" },
  { value: "2.3M", label: "Weekly Downloads" },
  { value: "450+", label: "Contributors" },
  { value: "99.8%", label: "Test Coverage" },
]

const INSTALL_CODE = `npm install wavefx

# Initialize in your project
npx wavefx init

# Start the dev server
npx wavefx dev`

const USAGE_CODE = `import { createPipeline, transform } from 'wavefx';

const pipeline = createPipeline({
  source: 'postgres://localhost/mydb',
  transforms: [
    transform.deduplicate({ key: 'id' }),
    transform.enrich({ lookup: 'geo_ip' }),
    transform.aggregate({ 
      window: '5m', 
      fn: 'count' 
    }),
  ],
  sink: 'kafka://events',
});

await pipeline.start();`


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function WaveFXPage() {
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
    <div className="bg-[#070a10] text-white font-sans min-h-screen selection:bg-indigo-500 selection:text-white overflow-x-hidden">

      {/* ── NAVBAR ────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? "bg-[#070a10]/90 backdrop-blur-xl border-b border-indigo-500/10 py-4" : "bg-transparent py-8"}`}>
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="#hero" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center">
              <Code2 className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight">Wave<span className="text-indigo-400">FX</span></span>
          </Link>
          <div className="hidden lg:flex gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
            {["Docs", "Examples", "Plugins", "Blog"].map(l => (
              <Link key={l} href={ l === "Blog" ? "#contact" : "#docs" } className="hover:text-indigo-400 transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-4">
             <Link href="#contact" className="hidden md:flex items-center gap-2 text-white/40 hover:text-white transition-colors">
              <Globe className="w-5 h-5" />
            </Link>
            <button className="hidden md:block px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-blue-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:opacity-90 transition-opacity">
              Get Started
            </button>
            <Sheet>
              <SheetTrigger className="lg:hidden"><Menu className="w-6 h-6 text-white" /></SheetTrigger>
              <SheetContent side="right" className="bg-[#070a10] border-indigo-500/10 p-12">
                <div className="flex flex-col gap-8 mt-16">
                   {["Docs", "Examples", "Plugins", "GitHub"].map(l => (
                    <Link key={l} href={ l === "GitHub" ? "https://github.com" : "#docs" } className="text-2xl font-light uppercase tracking-widest hover:text-indigo-400 transition-colors">{l}</Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      <main>
        {/* ── HERO ────── */}
        <section id="hero" className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-indigo-500/8 blur-[200px] rounded-full" />
          </div>

          <div className="relative z-10 max-w-[1000px] mx-auto px-6 md:px-12 w-full text-center">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-widest mb-8">
                <Star className="w-3 h-3 fill-current" /> v3.0 Released — Now with Streaming Support
              </div>
            </Reveal>
            <Reveal delay={0.1} y={60}>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-8">{c?.heroHeadline ?? <>
                Data Pipelines<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-300 to-indigo-500">Without the Pain.</span>
              </>}</h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-xl text-white/40 font-light max-w-lg mx-auto leading-relaxed mb-10">{c?.heroSubline ?? fd?.tagline ?? <>
                The open-source framework for building real-time data pipelines. Type-safe, zero-copy, and absurdly fast.
              </>}</p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="flex flex-wrap gap-4 justify-center mb-16">
                <button className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-indigo-500 hover:text-white transition-all duration-500 flex items-center gap-2">
                  <Download className="w-4 h-4" /> Install
                </button>
                <Link href="#hero" className="px-8 py-4 border border-white/10 text-white/60 font-bold rounded-full hover:border-indigo-500/50 transition-all flex items-center gap-2">
                  <Globe className="w-4 h-4" /> GitHub
                </Link>
              </div>
            </Reveal>

            <Reveal delay={0.4} y={20}>
              <CodeBlock code={INSTALL_CODE} lang="bash" />
            </Reveal>
          </div>
        </section>

        {/* ── STATS ────── */}
        <section className="py-16 border-y border-white/5">
          <div className="max-w-[1000px] mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((s, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="text-center">
                  <div className="text-3xl font-black text-indigo-400 mb-1">{s.value}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-white/30">{s.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── USAGE ────── */}
        <section id="docs" className="py-32 bg-[#070a10]">
          <div className="max-w-[1000px] mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <Reveal>
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-indigo-400 block mb-4">Simple API</span>
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6">{c?.aboutTitle ?? fd?.businessName ?? <>
                  Build Pipelines<br/>in <span className="text-indigo-400">Minutes.</span>
                </>}</h2>
                <p className="text-white/40 leading-relaxed mb-8">{c?.aboutText ?? <>
                  Declarative pipeline definitions with full TypeScript support. Connect any source to any sink with composable transforms.
                </>}</p>
                <Link href="#contact" className="inline-flex items-center gap-2 text-indigo-400 text-[10px] font-bold uppercase tracking-widest hover:gap-4 transition-all">
                  Read the Docs <ArrowRight className="w-4 h-4" />
                </Link>
              </Reveal>
              <Reveal delay={0.15}>
                <CodeBlock code={USAGE_CODE} />
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── FEATURES ──── */}
        <section className="py-32 bg-[#0a0d14]">
          <div className="max-w-[1000px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="text-center mb-24">
                <h2 className="text-5xl md:text-6xl font-black tracking-tighter">Why <span className="text-indigo-400">WaveFX?</span></h2>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {FEATURES.map((f, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <div className="group p-8 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-indigo-500/30 transition-all duration-500 h-full">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6 group-hover:bg-indigo-500 group-hover:border-indigo-500 transition-all duration-500">
                      <f.icon className="w-5 h-5 text-indigo-400 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-lg font-bold mb-3">{f.title}</h3>
                    <p className="text-sm text-white/40 leading-relaxed">{f.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ──────────── */}
        <section id="equipe" className="py-32 bg-[#070a10] border-t border-white/5">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="text-center mb-20">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-indigo-400 block mb-4">Developer Love</span>
                <h2 className="text-5xl md:text-6xl font-black tracking-tighter">Trusted by <span className="text-indigo-400">Builders.</span></h2>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { quote: "Replaced our entire internal CLI tooling in a weekend. The DX is absurd — we shipped a production feature in the time our old flow took to configure.", handle: "@mia_builds", role: "Staff Engineer · Berlin", avatar: "MB" },
                { quote: "The GitBranch integration is effortless. I've been a CLI nerd for 12 years — this is the first time I've felt genuinely excited about tooling.", handle: "@the_real_thorn", role: "Open Source Maintainer", avatar: "TR" },
                { quote: "Our onboarding dropped from 3 days to 4 hours. Every new dev just runs one command and they're in the right environment immediately.", handle: "@priya_dev", role: "CTO, Singapore Startup", avatar: "PD" },
              ].map((t, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="group p-8 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-indigo-500/20 transition-all duration-500 flex flex-col gap-6 h-full">
                    <div className="flex gap-1">{[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-indigo-400 text-indigo-400" />)}</div>
                    <p className="text-sm text-white/50 leading-relaxed italic flex-1">&ldquo;{t.quote}&rdquo;</p>
                    <div className="flex items-center gap-4 border-t border-white/5 pt-6">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/20 flex items-center justify-center text-[10px] font-black text-indigo-400">{t.avatar}</div>
                      <div>
                        <div className="text-sm font-bold text-white font-mono">{t.handle}</div>
                        <div className="text-xs text-white/30">{t.role}</div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── TEAM ────────────────────── */}
        <section className="py-32 bg-[#0d1117] border-t border-white/5">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="text-center mb-20">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-indigo-400 block mb-4">Open Core Team</span>
                <h2 className="text-5xl md:text-6xl font-black tracking-tighter">Built by <span className="text-indigo-400">Engineers.</span></h2>
              </div>
            </Reveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { name: "Noa Stein", role: "Founder & CLI Lead", gh: "noa-s", focus: "Core runtime, DX" },
                { name: "Remi Osei", role: "Platform Engineer", gh: "remi_dev", focus: "Cloud orchestration" },
                { name: "Aiko Park", role: "Developer Relations", gh: "aikopark", focus: "Docs, community" },
                { name: "Lucas Vidal", role: "Security & Infra", gh: "lv_sec", focus: "Zero-trust, audit" },
              ].map((m, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <div className="group p-6 bg-white/[0.02] border border-white/5 rounded-xl hover:border-indigo-500/20 transition-all duration-500 cursor-default flex flex-col gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-blue-500/20 border border-indigo-500/20 flex items-center justify-center">
                      <span className="text-[10px] font-black text-indigo-400">{m.gh.slice(0,2).toUpperCase()}</span>
                    </div>
                    <div>
                      <div className="font-bold text-white mb-0.5">{m.name}</div>
                      <div className="text-xs text-indigo-400/70 font-mono mb-1">@{m.gh}</div>
                      <div className="text-xs text-white/30">{m.role}</div>
                    </div>
                    <div className="text-[9px] font-bold uppercase tracking-widest text-white/15 border-t border-white/5 pt-3">{m.focus}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ──────── */}
        <section id="contact" className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-transparent to-blue-600/10" />
          <div className="relative z-10 max-w-[700px] mx-auto px-6 text-center">
            <Reveal>
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter mb-6">
                Start Building<br/><span className="text-indigo-400">Today.</span>
              </h2>
              <p className="text-lg text-white/40 font-light max-w-md mx-auto mb-10">
                WaveFX is free, open-source, and backed by a community of 450+ contributors.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <button className="px-10 py-4 bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold rounded-full hover:opacity-90 transition-opacity">
                  Get Started Free
                </button>
                <Link href="#contact" className="px-10 py-4 border border-white/10 text-white/60 font-bold rounded-full hover:border-indigo-500/50 transition-all flex items-center gap-2">
                  Star on GitHub <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      {/* ── FOOTER ──────── */}
      <footer className="bg-[#040608] pt-24 pb-12 px-6">
        <div className="max-w-[1000px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center"><Code2 className="w-4 h-4 text-white" /></div>
              <span className="font-black tracking-tight">Wave<span className="text-indigo-400">FX</span></span>
            </div>
            <p className="text-sm text-white/30 leading-relaxed">Open-source data pipeline framework.</p>
          </div>
          {[
            { title: "Product", links: ["Docs", "Examples", "Plugins", "Changelog"] },
            { title: "Community", links: ["GitHub", "Discord", "MessageSquare", "Blog"] },
            { title: "Legal", links: ["MIT License", "Privacy", "Security", "Contact"] },
          ].map((col, i) => (
            <div key={i}>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-indigo-400 mb-6">{col.title}</h4>
              <ul className="space-y-3 text-sm text-white/30">
                {col.links.map(l => <li key={l}><Link href="#contact" className="hover:text-white transition-colors">{l}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-[1000px] mx-auto pt-8 border-t border-white/5 text-[10px] font-bold uppercase tracking-widest text-white/20 flex justify-between">
          <span>© 2026 WAVEFX LABS.</span>
          <span>MIT LICENSE · OPEN SOURCE</span>
        </div>
      </footer>
    </div>
  )
}
