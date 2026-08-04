"use client";
// @ts-nocheck
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Link from "next/link"
import { Shield, ArrowRight, Menu, Lock, Zap, Activity, Cpu, Globe, Terminal, ChevronRight, Eye, Radar } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { resolveList } from "@/lib/templates/resolveList"
import {
  DWELL,
  useSlides,
  WordFlight,
  ExpandFrame,
  SlideIndex,
  HairlineArrows,
} from "@/lib/templates/hero-kit-2"
import {
  clientCity,
  clientName,
  clientPhotos,
  clientReviews,
  clientServices,
  clientTeam,
  clientText,
} from "@/lib/templates/clientContent";

// Variables de module lues par les sections extraites en composants :
// déclarées ici pour que tout le fichier puisse s'y référer.
// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let bp: any = null;
// La session complète, pour lib/templates/clientContent : même portée
// que fd/c/bp, pour les sous-composants qui n'ont pas de props.
let sessionData: any = null;
let brand: any = null;

/* The old hero was a fake terminal typing to itself — a gadget, and the one
   part of the page that looked free. WordFlight + ExpandFrame from the law
   lab instead: the headline assembles word by word, one practice at a time,
   in the firm's own voice. */
function HERO_CASES_DEMO_LIVE() {
  return [
  {
    k: "Asset Recovery",
    t: "Silent justice, executed across twelve jurisdictions",
    img: (clientPhotos(sessionData)[1] || "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1400&q=80"),
  },
  {
    k: "Cyber-Legal Defense",
    t: "Breaches end in courtrooms, not in headlines",
    img: (clientPhotos(sessionData)[2] || "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1400&q=80"),
  },
  {
    k: "Intelligence",
    t: "We watch the adversary so counsel moves first",
    img: (clientPhotos(sessionData)[3] || "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1400&q=80"),
  },
];
}
let HERO_CASES_DEMO = HERO_CASES_DEMO_LIVE();
let HERO_CASES = HERO_CASES_DEMO;

function VanguardHero({ headline, subline }: { headline?: string; subline?: React.ReactNode }) {
  const { i, next, prev } = useSlides(HERO_CASES.length, DWELL.normal)
  const s = HERO_CASES[i]
  return (
    <section id="hero" className="relative min-h-dvh overflow-hidden bg-black text-white">
      <div className="min-h-dvh grid lg:grid-cols-[1.05fr_1fr]">
        <div className="relative z-10 flex flex-col justify-center px-6 md:px-14 pt-32 pb-16 lg:py-20">
          <motion.div
            key={`k-${i}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-[10px] font-bold uppercase tracking-[0.42em] mb-8 text-[var(--brand,#00ff41)]"
          >
            {s.k}
          </motion.div>

          <h1
            className="max-w-[16ch] font-black uppercase italic tracking-tighter"
            style={{ fontSize: "clamp(30px, 4.6vw, 66px)", lineHeight: 1.04 }}
          >
            <WordFlight text={headline ?? s.t} keyed={i} />
          </h1>

          <motion.p
            key={`p-${i}`}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.34 }}
            className="mt-8 max-w-[52ch] text-[15px] leading-relaxed text-white/40 uppercase italic font-light"
          >
            {subline ?? "Global asset recovery and cyber-legal defense for the ultra-high-net-worth. We don't just protect; we neutralize."}
          </motion.p>

          <div className="mt-11 flex flex-wrap items-center gap-6">
            <a
              href="#offense"
              className="min-h-[46px] px-9 grid place-items-center bg-white text-black font-black uppercase tracking-widest text-[10px] hover:bg-[var(--brand,#00ff41)] transition-all duration-700"
            >
              Request Strategy Brief
            </a>
            <SlideIndex i={i} total={HERO_CASES.length} variant="fraction" className="text-[13px] text-white/50" />
          </div>
        </div>

        <div className="relative min-h-[38svh]">
          <ExpandFrame src={s.img} alt="" index={i} className="h-full w-full" />
          {/* seam gradient, so the type column never touches a bright pixel */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent lg:block hidden" />
          <div className="absolute inset-0 bg-black/35" aria-hidden />
          <HairlineArrows
            onPrev={prev}
            onNext={next}
            color="rgba(255,255,255,0.8)"
            className="absolute bottom-6 right-6 z-10"
          />
        </div>
      </div>
    </section>
  )
}

// Every navigation entry pointed at #hero, and the mobile sheet carried a
// different set of labels again. Two of the four had no section at all.
const NAV = [
  { l: "Offense", h: "#offense" },
  { l: "Intelligence", h: "#intelligence" },
  { l: "Global Nodes", h: "#nodes" },
  { l: "Archive", h: "#archive" },
];

const INTELLIGENCE = [
  { k: "SIGNALS", t: "Continuous exposure mapping", d: "Every asset you own, and the ones you forgot: expired subdomains, orphaned S3 buckets, staging hosts still answering on port 443." },
  { k: "HUMAN", t: "Adversary tracking", d: "We follow twenty-two groups by tooling and tradecraft, not by press release. When one changes loader, our clients hear about it that week." },
  { k: "LEAKS", t: "Credential surfacing", d: "Combolists, stealer logs and paste sites, matched against your domains. Median time from appearance to your inbox: four hours." },
  { k: "SUPPLY", t: "Third-party watch", d: "Your vendors' breaches become yours. We monitor the ones that hold your data, and we tell you before their disclosure does." },
];

const ARCHIVE = [
  { y: "2025", t: "Lateral path missed for two years", d: "A read-only service account with domain-wide delegation. Found in week one of an engagement that had already passed three audits." },
  { y: "2025", t: "Ransomware negotiation, no payment", d: "Recovery from immutable backups in 61 hours. The full timeline, published with the client's consent." },
  { y: "2024", t: "Supply-chain compromise, contained", d: "A build agent poisoned upstream. Detected on artefact hash drift, four days before the release window." },
  { y: "2024", t: "Insider exfiltration", d: "38 GB staged over nine weeks through a sanctioned file-sharing tool. Behavioural baseline caught the schedule, not the volume." },
];

const SOCIALS = [
  { l: "GitHub", h: "https://github.com" },
  { l: "X", h: "https://x.com" },
  { l: "Signal", h: "https://signal.me" },
  { l: "LinkedIn", h: "https://linkedin.com" },
];


function Reveal({ children, delay = 0, y = 30 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }} animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  )
}

function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03]">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
    </div>
  )
}


export default function VanguardLegalPage() {
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
    businessProfile?: any;
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
  bp = session?.businessProfile;
  sessionData = session;
  HERO_CASES_DEMO = HERO_CASES_DEMO_LIVE();
  HERO_CASES = HERO_CASES_DEMO.map((row, i) => ({
    ...row,
    img: clientPhotos(sessionData)[0 + i] || row.img,
  }));
  brand = fd?.brandColor ?? null; // null = keep template's original color

  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
  }, []);

  return (
    <div className="bg-[#02040a] text-white font-mono min-h-dvh selection:bg-[var(--brand,#00ff41)] selection:text-black overflow-x-hidden">
      
      {/* ── NAVBAR ────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? "bg-[#02040a]/95 backdrop-blur-xl border-b border-white/5 py-4" : "bg-transparent py-10"}`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="#hero" className="flex items-center gap-3 group">
            {fd?.logoBase64 ? (
              <img
                src={fd.logoBase64}
                alt={fd?.businessName ?? 'logo'}
                style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
              />
            ) : (
              <>
            <div className="w-10 h-10 border border-[var(--brand,#00ff41)]/30 flex items-center justify-center group-hover:border-[var(--brand,#00ff41)] transition-all duration-500">
              <Shield className="w-5 h-5 text-[var(--brand,#00ff41)]" />
            </div>
            <span className="text-xl font-bold tracking-tighter uppercase">{/* NOM_LOGO */ clientName(sessionData) ?? (<>Vanguard <span className="text-[var(--brand,#00ff41)]">Legal</span></>)}</span>
          </>
            )}</Link>
          <div className="hidden lg:flex gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">
            {NAV.map(({ l, h }) => (
              <Link key={l} href={h} className="hover:text-[var(--brand,#00ff41)] transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-6">
            <button className="hidden md:block text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-white transition-colors underline underline-offset-8 decoration-[var(--brand,#00ff41)]/20">Secure Portal</button>
            <button className="px-8 py-3 bg-[var(--brand,#00ff41)] text-black text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white transition-all duration-500 shadow-[0_0_20px_rgba(0,255,65,0.2)]">Enlist</button>
            <Sheet>
              <SheetTrigger className="lg:hidden p-2"><Menu className="w-6 h-6 text-white" /></SheetTrigger>
              <SheetContent side="right" className="bg-[#02040a] border-white/5 p-12 text-white font-mono">
                <div className="flex flex-col gap-8 mt-16 text-left">
                  {NAV.map(({ l, h }) => (
                    <Link key={l} href={h} className="text-3xl font-bold uppercase tracking-tighter hover:text-[var(--brand,#00ff41)] transition-all italic">{l}</Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      <main className="relative">
        <GridBackground />
        
        {/* ── HERO ──────────────────── */}
        <VanguardHero headline={c?.heroHeadline} subline={fd?.tagline ?? c?.heroSubline} />

        <section id="offense" className="py-40 bg-[#02040a]">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="flex flex-col md:flex-row items-end justify-between mb-32 gap-8 border-b border-white/5 pb-16">
                <div className="max-w-2xl">
                  <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[var(--brand,#00ff41)] block mb-6">Offensive Protocol</span>
                  <h2 className="text-6xl md:text-[8vw] font-black uppercase tracking-tighter text-white leading-none italic">{/* TEXTE_SECTION */ clientText(sessionData, "offense.titre") ?? (<>Neutralize <br/> <span className="font-light not-italic opacity-20">The Risk.</span></>)}</h2>
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-4">Total Recovered: $2.4B — 2025</div>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-white/5">
              {resolveList(clientServices(sessionData)?.map((s: any, i: number) => ({ icon: [Radar, Lock, Eye][i % 3], t: s.title ?? s.name, d: s.description ?? s.desc })), [
                { icon: Radar, t: "Asset Intelligence", d: "Deep-web tracing and forensic accounting to locate misappropriated holdings globally." },
                { icon: Lock, t: "Extraction Strategy", d: "Surgical legal maneuvers to freeze and extract assets across complex jurisdictions." },
                { icon: Eye, t: "Privacy Cloaking", d: "Digital erasure and physical security protocols to ensure your movements remain invisible." }
              ] as any[]).map((item: any, i: number) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className={`p-16 flex flex-col h-full border-white/5 group ${i < 2 ? "md:border-r" : ""}`}>
                    <div className="w-16 h-16 border border-[var(--brand,#00ff41)]/20 flex items-center justify-center mb-12 group-hover:bg-[var(--brand,#00ff41)] group-hover:text-black transition-all duration-700">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--brand,#00ff41)]/40 mb-4 italic">Protocol: 0{i+1}</div>
                    <h3 className="text-3xl font-black uppercase mb-8 tracking-tighter italic">{item.t}</h3>
                    <p className="text-white/30 leading-relaxed text-sm font-light mb-12 italic">{item.d}</p>
                    <Link href="#hero" className="mt-auto flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest group-hover:gap-8 transition-all">
                       Initialize Protocol <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── INTELLIGENCE ──────────── */}
        <section id="nodes" className="py-40 bg-black relative">
           <div className="max-w-[1400px] mx-auto px-6 md:px-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
                 <div>
                    <Reveal>
                       <h2 className="text-5xl md:text-8xl font-black uppercase mb-12 italic leading-none">{c?.aboutTitle ?? fd?.businessName ?? <>Global <br/> <span className="not-italic font-light opacity-30">Watch.</span></>}</h2>
                       <p className="text-xl text-white/40 font-light leading-relaxed mb-20 uppercase italic">{c?.aboutText ?? <>
                          Our proprietary monitoring grid ensures that no movement goes unnoticed. We operate 24/7/365 across all time zones to ensure perpetual readiness.
                       </>}</p>
                       <div className="space-y-12">
                          {[
                            { t: "REAL-TIME TELEMETRY", d: "Instant alerts on asset movement across digital and physical borders." },
                            { v: "14", l: "SECURE OPERATIONAL HUBS", d: "Strategic locations in London, Zug, Singapore, and Grand Cayman." }
                          ].map((item, i) => (
                            <div key={i} className="flex gap-10 group">
                               <div className="text-4xl font-black italic text-[var(--brand,#00ff41)] shrink-0 w-24">0{i+1}</div>
                               <div>
                                  <h4 className="text-lg font-bold uppercase tracking-widest mb-2 italic">{(item as any).t || (item as any).l}</h4>
                                  <p className="text-xs text-white/20 font-light italic leading-relaxed">{(item as any).d}</p>
                               </div>
                            </div>
                          ))}
                       </div>
                    </Reveal>
                 </div>
                 <Reveal delay={0.3}>
                    <div className="aspect-square relative border border-white/5 bg-[#050505] p-12 overflow-hidden flex items-center justify-center">
                       <div className="relative w-full h-full border border-[var(--brand,#00ff41)]/5 rounded-full flex items-center justify-center">
                          <div className="w-full h-full border border-[var(--brand,#00ff41)]/10 rounded-full animate-[ping_4s_linear_infinite] opacity-20" />
                          <div className="absolute inset-0 flex items-center justify-center">
                             <Globe className="w-32 h-32 text-[var(--brand,#00ff41)]/10" />
                          </div>
                          {/* Node markers */}
                          <div className="absolute top-1/4 right-1/4 w-3 h-3 bg-[var(--brand,#00ff41)] rounded-full shadow-[0_0_15px_#00ff41]" />
                          <div className="absolute bottom-1/3 left-1/4 w-2 h-2 bg-[var(--brand,#00ff41)] rounded-full shadow-[0_0_10px_#00ff41] opacity-50" />
                       </div>
                       <div className="absolute bottom-10 left-10 text-[10px] font-mono text-[var(--brand,#00ff41)]/40 space-y-1">
                          <p>SCANNING_NODE: ZUG_ALPHA</p>
                          <p>STATUS: ACTIVE</p>
                          <p>SIGNAL_STRENGTH: 100%</p>
                       </div>
                    </div>
                 </Reveal>
              </div>
           </div>
        </section>

        {/* ── TESTIMONIALS ──────────── */}
        {/* INTELLIGENCE */}
        <section id="intelligence" className="py-40 bg-black border-t border-white/5">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="mb-32 border-b border-white/5 pb-16 max-w-3xl">
                <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[var(--brand,#00ff41)] block mb-6">Intelligence</span>
                <h2 className="text-6xl md:text-[7vw] font-black uppercase tracking-tighter text-white leading-none italic">{/* TEXTE_SECTION */ clientText(sessionData, "intelligence.titre") ?? (<>Know First. <br/> <span className="font-light not-italic opacity-20">Act Early.</span></>)}</h2>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 border border-white/5">
              {INTELLIGENCE.map((n, i) => (
                <Reveal key={n.t} delay={i * 0.06}>
                  <div className="bg-black p-10 h-full font-mono">
                    <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--brand,#00ff41)] mb-5">// {n.k}</div>
                    <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-4 italic">{n.t}</h3>
                    <p className="text-sm text-white/35 leading-relaxed">{n.d}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ARCHIVE */}
        <section id="archive" className="py-40 bg-[#02040a] border-t border-white/5">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="mb-32 border-b border-white/5 pb-16 max-w-3xl">
                <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[var(--brand,#00ff41)] block mb-6">Archive</span>
                <h2 className="text-6xl md:text-[7vw] font-black uppercase tracking-tighter text-white leading-none italic">{/* TEXTE_SECTION */ clientText(sessionData, "archive.titre") ?? (<>Case <br/> <span className="font-light not-italic opacity-20">Files.</span></>)}</h2>
              </div>
            </Reveal>
            <div className="divide-y divide-white/5 border-y border-white/5 font-mono">
              {ARCHIVE.map((a, i) => (
                <Reveal key={a.t} delay={i * 0.06}>
                  <div className="py-10 grid grid-cols-1 md:grid-cols-[140px_1fr] gap-8">
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--brand,#00ff41)] pt-2">{a.y}</span>
                    <div>
                      <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white mb-3 italic">{a.t}</h3>
                      <p className="text-sm text-white/35 leading-relaxed max-w-[75ch]">{a.d}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/15 mt-14 max-w-[75ch] leading-loose">
                Engagements are summarised with the client&apos;s written consent. Sectors, figures and dates are
                generalised wherever disclosure would identify the party.
              </p>
            </Reveal>
          </div>
        </section>

        <section id="reports" className="py-40 bg-[#02040a] border-t border-[var(--brand,#00ff41)]/10">
          <div className="max-w-6xl mx-auto px-6 md:px-12 font-mono">
            <Reveal>
              <p className="text-[10px] uppercase tracking-[0.5em] text-[var(--brand,#00ff41)]/40 mb-6">// verified operators</p>
              <h2 className="text-4xl md:text-7xl font-black text-white mb-20 leading-none tracking-tighter">{/* TEXTE_SECTION */ clientText(sessionData, "reports.titre") ?? (<>
                FIELD<br /><span className="text-[var(--brand,#00ff41)]/10">REPORTS.</span>
              </>)}</h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--brand,#00ff41)]/5">
              {resolveList(clientReviews(sessionData)?.map((r: any) => ({ quote: r.text ?? r.quote, handle: r.name ?? r.author, org: r.location ?? r.context ?? "" })), [
                { quote: "Our red team couldn't find a single gap after deployment. The threat graph identified a lateral movement path we had missed for two years. Mission critical.", handle: "// SEC_LEAD_ORION", org: "Fortune 500 · Financial Sector" },
                { quote: "Six ransomware attempts blocked in 90 days. Zero successful intrusions. The AI intercepts attacks before our SOC analysts even see the alert.", handle: "// CISO_MERIDIAN", org: "Critical Infrastructure" },
                { quote: "We replaced four separate tools with this single platform. Coverage increased 40%, cost dropped 60%. The ROI conversation with the board was the easiest I've had.", handle: "// INFOSEC_VOSS", org: "Global SaaS · Series C" },
              ] as any[]).map((t: any, i: number) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="bg-[#02040a] p-10 flex flex-col gap-6 hover:bg-black transition-colors border border-[var(--brand,#00ff41)]/5 hover:border-[var(--brand,#00ff41)]/20">
                    <Terminal className="w-4 h-4 text-[var(--brand,#00ff41)]/40" />
                    <p className="text-white/40 leading-relaxed flex-1 text-sm">{t.quote}</p>
                    <div className="border-t border-[var(--brand,#00ff41)]/10 pt-6">
                      <div className="text-[var(--brand,#00ff41)] text-xs font-bold tracking-widest">{t.handle}</div>
                      <div className="text-[10px] text-white/20 mt-1">{t.org}</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── TEAM ──────────────────── */}
        <section id="equipe" className="py-40 bg-black border-t border-[var(--brand,#00ff41)]/10">
          <div className="max-w-6xl mx-auto px-6 md:px-12 font-mono">
            <Reveal>
              <p className="text-[10px] uppercase tracking-[0.5em] text-[var(--brand,#00ff41)]/40 mb-6">// core team</p>
              <h2 className="text-4xl md:text-7xl font-black text-white mb-20 leading-none tracking-tighter">{/* TEXTE_SECTION */ clientText(sessionData, "equipe.titre") ?? (<>
                OPERATORS.
              </>)}</h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-[var(--brand,#00ff41)]/5">
              {resolveList(clientTeam(sessionData)?.map((tm: any, i: number) => ({ handle: (["WRAITH", "CIPHER", "GHOST", "SPECTER"][i % 4]), name: tm.name, role: tm.role ?? tm.specialty ?? "", clearance: (["ALPHA", "BRAVO", "CHARLIE"][i % 3]), years: tm.credentials ?? "" })), [
                { handle: "WRAITH", name: "Elara Voss", role: "Threat Intelligence", clearance: "ALPHA", years: "14yr" },
                { handle: "CIPHER", name: "Ryo Tanaka", role: "Offensive Security", clearance: "BRAVO", years: "11yr" },
                { handle: "GHOST", name: "Omar Al Farsi", role: "AI/ML Defense", clearance: "ALPHA", years: "9yr" },
                { handle: "SPECTER", name: "Nova Chen", role: "Incident Response", clearance: "CHARLIE", years: "7yr" },
              ] as any[]).map((m: any, i: number) => (
                <Reveal key={m.handle} delay={i * 0.08}>
                  <div className="bg-black p-10 hover:bg-[#02040a] transition-colors group">
                    <div className="w-12 h-12 border border-[var(--brand,#00ff41)]/20 flex items-center justify-center mb-6 group-hover:border-[var(--brand,#00ff41)]/60 transition-colors">
                      <span className="text-[var(--brand,#00ff41)] text-xs font-black">{m.handle.slice(0, 2)}</span>
                    </div>
                    <div className="text-[10px] text-[var(--brand,#00ff41)]/40 mb-1">[{m.clearance}] · {m.years}</div>
                    <div className="text-white font-bold text-sm tracking-wider mb-1">{m.name}</div>
                    <div className="text-[10px] text-white/20 uppercase tracking-widest">{m.role}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ───────────────────── */}
        <section className="py-60 bg-[var(--brand,#00ff41)] text-black text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.02]">
             <div className="w-[150%] h-[150%] border-2 border-dashed border-black rounded-full -translate-x-1/4 -translate-y-1/4 animate-[spin_60s_linear_infinite]" />
          </div>
          <div className="max-w-4xl mx-auto px-6 relative z-10">
            <Reveal>
              <h2 className="text-7xl md:text-[14vw] font-black uppercase tracking-tighter leading-[0.75] mb-16 italic">{/* TEXTE_SECTION */ clientText(sessionData, "section-8.titre") ?? (<>
                Secure <br/> <span className="font-light not-italic opacity-30">Your Legacy.</span>
              </>)}</h2>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-10">
                <button className="px-16 py-8 bg-black text-white font-black uppercase tracking-[0.2em] text-xs hover:px-24 transition-all duration-700 italic">
                   Initiate Strategy Session
                </button>
                <button className="px-16 py-8 border-2 border-black text-black font-black uppercase tracking-[0.2em] text-xs hover:bg-black hover:text-white transition-all duration-700 italic">
                   Request Private Audit
                </button>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      {/* ── FOOTER ────────────────── */}
      <footer className="bg-[#02040a] pt-32 pb-12 px-6 border-t border-white/5 font-mono">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-5 gap-20 mb-40">
           <div className="md:col-span-2">
              <Link href="#hero" className="flex items-center gap-4 mb-10 group">
                <div className="w-10 h-10 border border-[var(--brand,#00ff41)]/30 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-[var(--brand,#00ff41)]" />
                </div>
                <span className="text-xl font-bold tracking-tighter uppercase text-white italic">Vanguard <span className="text-[var(--brand,#00ff41)]">Legal</span></span>
              </Link>
              <p className="text-white/20 max-w-sm leading-relaxed mb-12 text-[10px] font-bold uppercase italic">
                 "Conflict is inevitable. Neutralization is an choice. We are the choice of the prepared."
              </p>
              <div className="flex gap-10">
                 {SOCIALS.map(s => (
                   <Link key={s.l} href={s.h} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-[var(--brand,#00ff41)] transition-colors underline underline-offset-8 decoration-[var(--brand,#00ff41)]/10">{s.l}</Link>
                 ))}
              </div>
           </div>
           
           {[
             { t: "PROTOCOLS", l: ["Asset Recovery", "Intelligence", "Defense", "Surveillance"] },
             { t: "NODES", l: ["London Hub", "Zug Office", "Cayman Base", "Singapore"] },
             { t: "RESOURCES", l: ["Portal", "Status", "Manual", "Press"] }
           ].map((col, i) => (
             <div key={i} className="space-y-12">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.5em] text-[var(--brand,#00ff41)]/40">{col.t}</h4>
                <ul className="space-y-6">
                   {col.l.map(link => (
                     <li key={link} className="text-xs font-bold uppercase tracking-widest text-white/20 hover:text-white transition-colors italic">
                        <Link href="#hero">{link}</Link>
                     </li>
                   ))}
                </ul>
             </div>
           ))}
        </div>
        <div className="max-w-[1400px] mx-auto flex flex-col md:row justify-between items-center gap-8 border-t border-white/5 pt-12 text-[10px] font-bold uppercase tracking-[0.4em] text-white/10 italic">
           <span>© 2026 VANGUARD STRATEGIC LEGAL DEFENSE. CONNECTION ENCRYPTED.{/* VILLE_PIED */}{clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""}</span>
           <div className="flex gap-12">
              <span>SYSTEM_STATUS: NOMINAL</span>
              <Link href="/templates/impact-147/legal" className="hover:text-[var(--brand,#00ff41)] transition-all">PRIVACY_PROTOCOL_ENABLED</Link>
           </div>
        </div>
      </footer>
    </div>
  )
}
