// @ts-nocheck
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
import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { Shield, Lock, Eye, AlertTriangle, CheckCircle2, Terminal, Zap, ArrowRight, X, Menu, Activity, Server, Globe, Cpu, Database, Search, Radio, ChevronRight, ExternalLink, Mail, Phone, MapPin } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/* ── data ── */
const SERVICES = [
  {
    icon: Shield,
    id: "pentest",
    name: "Penetration Testing",
    score: 97,
    tag: "RED_TEAM",
  },
  {
    icon: Lock,
    id: "soc",
    name: "SOC-as-a-Service",
    score: 91,
    tag: "24/7_OPS",
  },
  {
    icon: Eye,
    id: "ir",
    name: "Incident Response",
    score: 99,
    tag: "ZERO_WAIT",
  },
  {
    icon: Database,
    id: "dlp",
    name: "Data Loss Prevention",
    score: 88,
    tag: "DLP_AI",
  },
  { icon: Globe, id: "cloud", name: "Cloud Hardening", score: 93, tag: "CSPM" },
  { icon: Cpu, id: "xdr", name: "XDR Platform", score: 95, tag: "ML_ENGINE" },
];

const CASE_STUDIES = [
  {
    sector: "Finance",
    title: "Zero-day breach prevention — $2.4B bank",
    result: "0 data exfiltrated",
    ttd: "< 4 min",
  },
  {
    sector: "Healthcare",
    title: "HIPAA infrastructure hardening — 320 clinics",
    result: "Full compliance in 6 weeks",
    ttd: "N/A",
  },
  {
    sector: "Government",
    title: "National election system audit",
    result: "All 14 critical CVEs remediated",
    ttd: "< 2 min",
  },
  {
    sector: "Retail",
    title: "POS network protection — 800 stores",
    result: "Card data fully isolated",
    ttd: "< 6 min",
  },
];

const CERTS = [
  "ISO 27001",
  "SOC 2 Type II",
  "NIST CSF",
  "CISA Certified",
  "GDPR Ready",
  "HIPAA Compliant",
  "PCI DSS",
  "FedRAMP",
];

const FAQS = [
  {
    q: "What is a red team engagement?",
    a: "A simulated, real-world attack executed by our specialists against your organisation with zero advance knowledge. We attempt every technique a nation-state adversary would use.",
  },
  {
    q: "How quickly can you deploy SOC coverage?",
    a: "Full SOC-as-a-Service is deployed in 48 hours. Initial SIEM integration, rule-tuning, and analyst handoff completed within the first 5 business days.",
  },
  {
    q: "What is your mean time to detect?",
    a: "Our platform's median TTD is 3.8 minutes across all customer deployments. The industry average is 194 days.",
  },
  {
    q: "Do you hold client data after an engagement?",
    a: "Never. All engagement data is encrypted, stored in air-gapped infrastructure, and cryptographically destroyed within 30 days of report delivery.",
  },
];

/* ── utils ── */
function Reveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let cur = 0;
    const step = to / 60;
    const t = setInterval(() => {
      cur += step;
      if (cur >= to) {
        setVal(to);
        clearInterval(t);
      } else setVal(Math.floor(cur));
    }, 16);
    return () => clearInterval(t);
  }, [inView, to]);
  return (
    <span ref={ref}>
      {val.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ── live threat ticker ── */
function ThreatTicker() {
  const [count, setCount] = useState(14823);
  useEffect(() => {
    const t = setInterval(
      () => setCount((c) => c + Math.floor(Math.random() * 12) + 3),
      800,
    );
    return () => clearInterval(t);
  }, []);
  return (
    <div className="font-mono text-[#00ffcc] text-5xl md:text-7xl font-black tabular-nums">
      {count.toLocaleString()}
    </div>
  );
}

/* ── terminal log ── */
const LOG_LINES = [
  "[SYS] XDR engine v4.2.1 — online",
  "[SCAN] 192.168.1.0/24 enumeration complete — 0 open critical ports",
  "[ALERT] Brute-force attempt blocked — src: 45.227.253.12",
  "[ML] Anomaly detected: exfil pattern — quarantined in 2.1s",
  "[OK] SOC Analyst notified — ticket #INC-00847 created",
  "[PATCH] CVE-2025-3187 remediation applied automatically",
  "[OK] Compliance sweep: HIPAA — 100% pass",
  "[ALERT] Lateral movement attempt blocked — src: internal node 10.0.0.41",
];

function TerminalLog() {
  const [lines, setLines] = useState<string[]>([]);
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      if (i < LOG_LINES.length) {
        setLines((l) => [...l, LOG_LINES[i]]);
        i++;
      }
    }, 900);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="bg-[#060810] border border-[#00ffcc]/20 rounded-none p-6 font-mono text-xs text-[#00ffcc]/70 h-64 overflow-y-auto space-y-2">
      {lines.map((line, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <span className="text-[#00ffcc]/30 mr-3">
            {String(i + 1).padStart(2, "0")}
          </span>
          {line}
        </motion.div>
      ))}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ repeat: Infinity, duration: 0.8 }}
      >
        ▋
      </motion.span>
    </div>
  );
}

/* ── main ── */
export default function CipherShieldPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeService, setActiveService] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [sector, setSector] = useState("Finance");
  const [contactSubmitted, setContactSubmitted] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const filteredCases = CASE_STUDIES.filter((c) => c.sector === sector);

  return (
    <div
      className="min-h-screen bg-[#060810] text-white overflow-x-hidden font-sans"
      style={{
        backgroundImage: "linear-gradient(135deg,#060810 0%,#0a1628 100%)",
      }}
    >
      {/* grid overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(#00ffcc 1px,transparent 1px),linear-gradient(90deg,#00ffcc 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.015]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg,#00ffcc 0,#00ffcc 1px,transparent 1px,transparent 3px)",
        }}
      />

      {/* NAV */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? "bg-[#060810]/95 backdrop-blur-xl border-b border-[#00ffcc]/10" : "bg-transparent"} px-6 md:px-12 py-5 flex items-center justify-between`}
      >
        <Link href="/" className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-[#00ffcc]" />
          <span className="font-black tracking-tight text-lg font-mono">
            CIPHER<span className="text-[#00ffcc]">_SHIELD</span>
          </span>
        </Link>
        <div className="hidden md:flex gap-10 text-[11px] font-bold uppercase tracking-widest text-white/40">
          {["Services", "Cases", "Testimonials", "Intel", "Contact"].map((l) => (
            <Link
              key={l}
              href={`#${l.toLowerCase()}`}
              className="hover:text-[#00ffcc] transition-colors"
            >
              {l}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-6">
          <button className="hidden md:block text-[10px] font-black uppercase tracking-widest text-[#00ffcc] border border-[#00ffcc]/30 px-6 py-2.5 hover:bg-[#00ffcc] hover:text-[#060810] transition-all">
            GET_AUDIT
          </button>
          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden text-[#00ffcc]"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            className="fixed inset-0 z-[100] bg-[#060810] p-10 flex flex-col gap-10"
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="self-end text-[#00ffcc]"
            >
              <X className="w-8 h-8" />
            </button>
            {["Services", "Cases", "Testimonials", "Intel", "Contact"].map((l) => (
              <Link
                key={l}
                href={`#${l.toLowerCase()}`}
                onClick={() => setMenuOpen(false)}
                className="text-4xl font-black font-mono text-[#00ffcc]/40 hover:text-[#00ffcc] transition-colors uppercase"
              >
                {l}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 1. HERO ── */}
      <section className="relative min-h-[100svh] flex flex-col justify-center px-6 md:px-12 pt-28 overflow-hidden">
        <div className="absolute top-1/3 right-1/4 w-[40vw] h-[40vw] rounded-full blur-[200px] bg-[#00ffcc]/5 pointer-events-none" />

        <div className="max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div>
            <Reveal>
              <div className="inline-flex items-center gap-3 px-4 py-2 border border-[#00ffcc]/20 text-[#00ffcc] text-[10px] font-black uppercase tracking-widest mb-10 font-mono">
                <Radio className="w-3.5 h-3.5 animate-pulse" />{" "}
                LIVE_THREAT_INTELLIGENCE // SYS_ONLINE
              </div>
              <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter mb-10 uppercase">
                Threat <br />
                <span className="text-[#00ffcc]">Eliminated</span> <br />
                <span className="text-white/20">Before Entry.</span>
              </h1>
              <p className="text-white/40 text-lg font-light leading-relaxed mb-12 max-w-md">
                Enterprise-grade autonomous threat detection. 3.8 min median
                TTD. Zero confirmed breaches across 500+ clients.
              </p>
              <div className="flex flex-col sm:flex-row gap-5">
                <button className="px-10 py-4 bg-[#00ffcc] text-[#060810] text-[11px] font-black uppercase tracking-widest hover:bg-white transition-all">
                  SCHEDULE_AUDIT
                </button>
                <button className="px-10 py-4 border border-[#00ffcc]/30 text-[#00ffcc] text-[11px] font-black uppercase tracking-widest hover:bg-[#00ffcc]/10 transition-all">
                  WATCH_DEMO
                </button>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.2}>
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-[10px] text-[#00ffcc]/60 uppercase tracking-widest">
                  // LIVE_THREAT_COUNTER_TODAY
                </span>
                <span className="w-2 h-2 rounded-full bg-[#00ffcc] animate-pulse" />
              </div>
              <ThreatTicker />
              <p className="font-mono text-[10px] text-white/20 uppercase tracking-widest mt-4">
                Threats blocked this session across all deployments.
              </p>
              <div className="mt-10">
                <TerminalLog />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 2. SERVICES ── */}
      <section id="services" className="py-32 px-6 md:px-12 bg-[#0a1628]">
        <div className="max-w-[1400px] mx-auto">
          <Reveal>
            <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
                Core <span className="text-[#00ffcc]">Arsenal.</span>
              </h2>
              <p className="text-white/30 text-[11px] font-black uppercase tracking-widest max-w-xs text-right font-mono">
                Six mission-critical security disciplines. One integrated
                platform.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((svc, i) => {
              const Icon = svc.icon;
              return (
                <Reveal key={svc.id} delay={i * 0.07}>
                  <motion.div
                    whileHover={{ borderColor: "rgba(0,255,204,0.5)" }}
                    onClick={() => setActiveService(svc.id)}
                    className="p-8 bg-[#060810] border border-[#00ffcc]/10 cursor-pointer group transition-all"
                  >
                    <div className="flex justify-between items-start mb-8">
                      <Icon className="w-8 h-8 text-[#00ffcc]" />
                      <Badge className="bg-[#00ffcc]/10 text-[#00ffcc] border border-[#00ffcc]/20 text-[8px] font-black tracking-widest">
                        {svc.tag}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-black uppercase tracking-tight mb-6">
                      {svc.name}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-[9px] font-mono text-white/30 uppercase">
                        <span>Efficacy_Score</span>
                        <span className="text-[#00ffcc]">{svc.score}%</span>
                      </div>
                      <div className="w-full h-[2px] bg-white/5">
                        <motion.div
                          className="h-full bg-[#00ffcc]"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${svc.score}%` }}
                          transition={{ duration: 1.2, delay: i * 0.1 }}
                        />
                      </div>
                    </div>
                    <button className="mt-8 flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-white/20 group-hover:text-[#00ffcc] transition-colors font-mono">
                      INSPECT_MODULE <ArrowRight className="w-4 h-4" />
                    </button>
                  </motion.div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 3. STATS ── */}
      <section className="py-24 px-6 md:px-12 border-y border-[#00ffcc]/5">
        <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
          {[
            { val: 500, suffix: "+", label: "Enterprises Secured" },
            { val: 99, suffix: ".9%", label: "Detection Accuracy" },
            { val: 0, suffix: "", label: "Confirmed Breaches" },
            { val: 3, suffix: ".8m", label: "Median TTD (min)" },
          ].map((s, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="text-center">
                <div className="text-5xl md:text-6xl font-black text-[#00ffcc] font-mono tabular-nums mb-3">
                  <Counter to={s.val} suffix={s.suffix} />
                </div>
                <p className="text-[9px] font-black uppercase tracking-widest text-white/20 font-mono">
                  {s.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── 4. CASE STUDIES ── */}
      <section id="cases" className="py-32 px-6 md:px-12 bg-[#0a1628]">
        <div className="max-w-[1400px] mx-auto">
          <Reveal>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-16">
              Field <span className="text-[#00ffcc]">Ops.</span>
            </h2>
          </Reveal>

          <div className="flex gap-3 flex-wrap mb-12">
            {["Finance", "Healthcare", "Government", "Retail"].map((s) => (
              <button
                key={s}
                onClick={() => setSector(s)}
                className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest font-mono border transition-all
                  ${sector === s ? "bg-[#00ffcc] text-[#060810] border-[#00ffcc]" : "border-[#00ffcc]/20 text-white/30 hover:border-[#00ffcc]/50"}`}
              >
                {s}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={sector}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {CASE_STUDIES.filter((c) => c.sector === sector).map((c, i) => (
                <motion.div
                  key={i}
                  whileHover={{ x: 6 }}
                  className="p-8 bg-[#060810] border border-[#00ffcc]/10 hover:border-[#00ffcc]/40 transition-all"
                >
                  <div className="text-[9px] font-black uppercase tracking-widest text-[#00ffcc] mb-4 font-mono">
                    {c.sector}_SECTOR
                  </div>
                  <h3 className="text-xl font-black mb-6 leading-tight">
                    {c.title}
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-[#0a1628] border border-[#00ffcc]/5">
                      <div className="text-[8px] text-white/20 uppercase tracking-widest font-mono mb-1">
                        OUTCOME
                      </div>
                      <div className="text-sm font-black text-[#00ffcc]">
                        {c.result}
                      </div>
                    </div>
                    <div className="p-4 bg-[#0a1628] border border-[#00ffcc]/5">
                      <div className="text-[8px] text-white/20 uppercase tracking-widest font-mono mb-1">
                        TTD
                      </div>
                      <div className="text-sm font-black text-[#00ffcc]">
                        {c.ttd}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── 5. CERTIFICATIONS ── */}
      <section className="py-24 px-6 md:px-12">
        <div className="max-w-[1400px] mx-auto">
          <Reveal>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-16 text-center">
              Compliance <span className="text-[#00ffcc]">Verified.</span>
            </h2>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CERTS.map((cert, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <div className="p-6 border border-[#00ffcc]/10 flex items-center gap-4 hover:border-[#00ffcc]/40 transition-all">
                  <CheckCircle2 className="w-5 h-5 text-[#00ffcc] shrink-0" />
                  <span className="text-[10px] font-black uppercase tracking-widest font-mono text-white/60">
                    {cert}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" className="py-32 px-6 md:px-12 bg-[#060810]">
        <div className="max-w-[1400px] mx-auto">
          <Reveal>
            <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
                Client <span className="text-[#00ffcc]">Intel.</span>
              </h2>
              <p className="text-white/30 text-[11px] font-black uppercase tracking-widest max-w-xs text-right font-mono">
                // DEPLOYMENT_FEEDBACK_REPORTS
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: "CipherShield's XDR engine flagged and isolated a multi-stage ransomware attack on our database servers within 4 minutes. Absolutely critical for our infrastructure.",
                author: "Marcus Vance",
                role: "CISO",
                company: "Apex Global Finance"
              },
              {
                quote: "The team delivered a complete NIST compliance audit and security hardening for our 320 clinics in record time. Zero breaches since deployment.",
                author: "Dr. Sarah Chen",
                role: "Director of IT",
                company: "CareNet Health"
              },
              {
                quote: "Their simulated red team engagement uncovered vulnerabilities we didn't know existed. The remediation plan was detailed and highly effective.",
                author: "Thomas Wright",
                role: "Head of Security",
                company: "Federal Security Sys"
              }
            ].map((t, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="p-8 bg-[#0a1628]/40 border border-[#00ffcc]/10 hover:border-[#00ffcc]/30 transition-all flex flex-col justify-between h-full group">
                  <div className="mb-8 font-sans font-light text-white/70 leading-relaxed text-sm">
                    "{t.quote}"
                  </div>
                  <div className="font-mono text-left">
                    <div className="text-[11px] font-black uppercase tracking-widest text-[#00ffcc] mb-1">
                      {t.author}
                    </div>
                    <div className="text-[9px] uppercase tracking-wider text-white/30">
                      {t.role} // {t.company}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. FAQ ── */}
      <section id="intel" className="py-32 px-6 md:px-12 bg-[#0a1628]">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <div className="text-center mb-20">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#00ffcc] font-mono mb-4 block">
                // THREAT_INTEL_BUFFER
              </span>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase">
                Protocol FAQ.
              </h2>
            </div>
          </Reveal>
          <Accordion type="single" collapsible className="space-y-3">
            {FAQS.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border border-[#00ffcc]/10 px-6"
              >
                <AccordionTrigger className="text-[11px] font-black uppercase tracking-widest text-white/70 py-6 hover:text-[#00ffcc] hover:no-underline font-mono text-left">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-white/30 leading-relaxed font-light pb-6 font-sans">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ── 7. CTA ── */}
      <section className="py-32 px-6 md:px-12 text-center">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <div className="text-[10px] font-black uppercase tracking-widest text-[#00ffcc] font-mono mb-8">
              // INITIATE_ENGAGEMENT
            </div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-10 leading-none">
              Ready to <br /> <span className="text-[#00ffcc]">Go Dark?</span>
            </h2>
            <p className="text-white/30 font-light mb-12 text-lg">
              Free threat surface assessment delivered in 24 hours. No data
              stored. No contracts.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button className="px-12 py-5 bg-[#00ffcc] text-[#060810] text-[11px] font-black uppercase tracking-widest hover:bg-white transition-all">
                SCHEDULE_RED_TEAM
              </button>
              <button className="px-12 py-5 border border-[#00ffcc]/30 text-[#00ffcc] text-[11px] font-black uppercase tracking-widest hover:bg-[#00ffcc]/10 transition-all">
                DOWNLOAD_THREAT_REPORT
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="py-32 px-6 md:px-12 bg-[#060810] border-t border-[#00ffcc]/10">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <Reveal>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#00ffcc] font-mono mb-4 block">
                // SECURE_COMMUNICATION_CHANNEL
              </span>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-8">
                Get in <span className="text-[#00ffcc]">Touch.</span>
              </h2>
              <p className="text-white/40 leading-relaxed mb-12 text-sm max-w-md">
                Initiate an encrypted connection. Our intelligence officers and threat responders are available 24/7.
              </p>
              
              <div className="space-y-6 text-sm font-mono text-white/50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 border border-[#00ffcc]/20 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-[#00ffcc]" />
                  </div>
                  <div>
                    <div className="text-[9px] text-white/30 uppercase tracking-widest">SECURE_EMAIL</div>
                    <a href="mailto:contact@ciphershield.com" className="text-white hover:text-[#00ffcc] transition-colors">contact@ciphershield.com</a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 border border-[#00ffcc]/20 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-[#00ffcc]" />
                  </div>
                  <div>
                    <div className="text-[9px] text-white/30 uppercase tracking-widest">COMMS_LINE</div>
                    <a href="tel:+33180000000" className="text-white hover:text-[#00ffcc] transition-colors">+33 1 80 00 00 00</a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 border border-[#00ffcc]/20 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-[#00ffcc]" />
                  </div>
                  <div>
                    <div className="text-[9px] text-white/30 uppercase tracking-widest">HQ_COORDINATES</div>
                    <span className="text-white">42 Rue de la Paix, 75002 Paris, France</span>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="border border-[#00ffcc]/20 p-8 bg-[#0a1628]/45 relative">
                <div className="absolute top-0 right-0 p-2 text-[8px] font-mono text-[#00ffcc]/40">// ENCRYPTED_TUNNEL</div>
                {contactSubmitted ? (
                  <div className="text-center py-12 font-mono">
                    <div className="w-12 h-12 border border-[#00ffcc] flex items-center justify-center mx-auto mb-6">
                      <span className="text-[#00ffcc] text-lg font-light">✓</span>
                    </div>
                    <h3 className="text-xl font-black uppercase mb-3 text-white">Transmission Received</h3>
                    <p className="text-[#00ffcc] text-xs leading-relaxed max-w-xs mx-auto text-center">
                      Merci, nous vous répondrons sous 24h.
                    </p>
                    <button
                      onClick={() => setContactSubmitted(false)}
                      className="mt-8 px-6 py-2.5 bg-[#00ffcc] text-[#060810] text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all"
                    >
                      SEND_NEW_SIGNAL
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setContactSubmitted(true);
                    }}
                    className="space-y-6 text-sm font-mono"
                  >
                    <div>
                      <label className="block text-[9px] uppercase tracking-widest text-[#00ffcc]/60 mb-2" htmlFor="c-name">Identity / Company</label>
                      <input
                        id="c-name"
                        type="text"
                        required
                        placeholder="John Doe / Acme Corp"
                        className="w-full bg-[#060810]/60 border border-[#00ffcc]/20 px-4 py-3 text-white outline-none focus:border-[#00ffcc] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase tracking-widest text-[#00ffcc]/60 mb-2" htmlFor="c-email">Comms Endpoint (Email)</label>
                      <input
                        id="c-email"
                        type="email"
                        required
                        placeholder="operator@domain.com"
                        className="w-full bg-[#060810]/60 border border-[#00ffcc]/20 px-4 py-3 text-white outline-none focus:border-[#00ffcc] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase tracking-widest text-[#00ffcc]/60 mb-2" htmlFor="c-message">Payload (Message)</label>
                      <textarea
                        id="c-message"
                        rows={4}
                        required
                        placeholder="Describe threat vector or request details..."
                        className="w-full bg-[#060810]/60 border border-[#00ffcc]/20 px-4 py-3 text-white outline-none focus:border-[#00ffcc] transition-colors resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-4 bg-[#00ffcc] text-[#060810] text-[11px] font-black uppercase tracking-widest hover:bg-white transition-all cursor-pointer"
                    >
                      TRANSMIT_PAYLOAD
                    </button>
                  </form>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-[#00ffcc]/10 pt-24 pb-12 px-6 md:px-12 bg-[#060810]">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-20">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-[#00ffcc]" />
              <span className="font-black font-mono text-xl">
                CIPHER<span className="text-[#00ffcc]">_SHIELD</span>
              </span>
            </div>
            <p className="text-white/20 text-[10px] font-mono uppercase tracking-widest leading-loose max-w-xs mb-10">
              Autonomous enterprise threat elimination. Built for the
              adversarial internet. Zero tolerance for breach.
            </p>
            <div className="flex items-center gap-3 text-[10px] font-mono text-[#00ffcc]">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              ALL_SYSTEMS_OPERATIONAL
            </div>
          </div>
          {[
            {
              title: "Platform",
              links: ["XDR_Engine", "SOC_Portal", "Threat_Intel", "API_Access"],
            },
            {
              title: "Services",
              links: ["Red_Team", "IR_24/7", "Compliance", "Cloud_Sec"],
            },
            {
              title: "Company",
              links: ["About_Mission", "Research_Lab", "Careers", "Press_Kit"],
            },
          ].map((col, i) => (
            <div key={i} className="lg:col-span-2">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-8 font-mono">
                {col.title}
              </h4>
              <ul className="space-y-4">
                {col.links.map((l) => (
                  <li key={l}>
                    <Link
                      href="#"
                      className="text-[10px] font-mono uppercase tracking-widest text-white/20 hover:text-[#00ffcc] transition-colors"
                    >
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-[1400px] mx-auto pt-8 border-t border-[#00ffcc]/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[9px] font-mono uppercase tracking-widest text-white/10">
          <span>
            &copy; {new Date().getFullYear()} CipherShield Corp. All rights
            reserved.
          </span>
          <div className="flex gap-8">
            <Link href="/legal/confidentialite" className="hover:text-[#00ffcc] transition-colors">
              Privacy_Protocol
            </Link>
            <Link href="/legal/cgu" className="hover:text-[#00ffcc] transition-colors">
              Terms_of_Engagement
            </Link>
            <Link href="/legal/mentions-legales" className="hover:text-[#00ffcc] transition-colors">
              Mentions_Legales
            </Link>
          </div>
        </div>
      </footer>

      <style>{`::-webkit-scrollbar{width:4px;background:#060810}::-webkit-scrollbar-thumb{background:#00ffcc33}`}</style>
    </div>
  );
}
