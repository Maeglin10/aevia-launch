// @ts-nocheck
"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useInView,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, ArrowRight, Shield, Zap, Activity, Globe, Lock, BarChart, Settings, Users, Server, CheckCircle2, Menu, X, Play, Star } from "lucide-react";

import "../premium.css";

/* ==========================================================================
   DATA STRUCTURES
   ========================================================================== */

const FEATURES = [
  {
    icon: <Zap className="w-5 h-5" />,
    title: "Real-time Processing",
    desc: "Process millions of events per second with sub-millisecond latency. Our distributed edge network ensures your data is exactly where it needs to be.",
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: "Enterprise Security",
    desc: "Bank-grade encryption at rest and in transit. SOC2 Type II, HIPAA, and GDPR compliant out of the box.",
  },
  {
    icon: <Globe className="w-5 h-5" />,
    title: "Global Edge Network",
    desc: "Deploy your application logic to 250+ edge locations worldwide. Route users to the nearest node automatically.",
  },
  {
    icon: <Activity className="w-5 h-5" />,
    title: "Deep Observability",
    desc: "Granular metrics, distributed tracing, and structured logging integrated seamlessly without performance overhead.",
  },
  {
    icon: <BarChart className="w-5 h-5" />,
    title: "Predictive Analytics",
    desc: "Leverage embedded machine learning models to forecast capacity needs and identify anomalies before they impact users.",
  },
  {
    icon: <Lock className="w-5 h-5" />,
    title: "Zero-Trust Architecture",
    desc: "Identity-aware access controls for every microservice. Assume breach mentality built into the core infrastructure.",
  },
];

const PRICING = [
  {
    name: "Developer",
    price: "$0",
    desc: "Perfect for side projects and evaluating Nexus.",
    features: [
      "Up to 10,000 monthly events",
      "3 Edge locations",
      "Community support",
      "1GB Data retention",
      "Standard analytics",
    ],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Pro",
    price: "$49",
    desc: "For production applications with growing traffic.",
    features: [
      "Up to 5M monthly events",
      "50+ Edge locations",
      "Priority email support",
      "100GB Data retention",
      "Advanced analytics & alerting",
      "Custom domains",
    ],
    cta: "Start 14-Day Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    desc: "For mission-critical deployments requiring SLA.",
    features: [
      "Unlimited monthly events",
      "Global edge network (250+ locations)",
      "24/7 Phone & Globe support",
      "Unlimited data retention",
      "Dedicated Technical Account Manager",
      "Custom compliance reporting",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

const TESTIMONIALS = [
  {
    name: "David Chen",
    role: "CTO, FinTech Global",
    text: "Nexus completely transformed our infrastructure. We reduced latency by 80% while simultaneously cutting our AWS bill in half. It's the rare tool that actually delivers on its marketing promises.",
  },
  {
    name: "Sarah Jenkins",
    role: "VP Engineering, HealthSync",
    text: "The security posture out-of-the-box is incredible. Getting our SOC2 certification was a breeze because Nexus handled all the complex compliance requirements natively.",
  },
  {
    name: "Marcus Thorne",
    role: "Lead Architect, DataStream",
    text: "We process over 2 billion events daily. Before Nexus, we needed a team of 5 DevOps engineers just to keep the lights on. Now, it just runs automatically.",
  },
];

const INTEGRATIONS = [
  "AWS",
  "GCP",
  "Azure",
  "Snowflake",
  "Datadog",
  "Globe",
  "PagerDuty",
  "Terraform",
  "Kubernetes",
  "GitHub",
];

const FAQS = [
  {
    question: "How does Nexus compare to traditional cloud providers?",
    answer:
      "Unlike AWS or GCP where you piece together primitives, Nexus provides an opinionated, highly-optimized platform specifically designed for event-driven architectures. We abstract the infrastructure complexity while giving you better performance and lower latency.",
  },
  {
    question: "Can I deploy Nexus on-premise or in my VPC?",
    answer:
      "Yes, our Enterprise tier offers Nexus Dedicated, which allows you to deploy the entire control plane and data plane within your own AWS, GCP, or Azure VPC for maximum security and compliance.",
  },
  {
    question: "What programming languages are supported?",
    answer:
      "Our edge functions support Node.js, Python, Go, and Rust natively via WebAssembly. You can also deploy custom Docker containers for legacy application support.",
  },
  {
    question: "How does billing work if I exceed my tier's limits?",
    answer:
      "We never throttle or drop events. If you exceed your tier limits, you are simply billed for the overage at a flat rate of $0.001 per 10,000 events. You can set hard caps in your dashboard if desired.",
  },
];

/* ==========================================================================
   UTILITY COMPONENTS
   ========================================================================== */

function Reveal({
  children,
  className = "",
  delay = 0,
  y = 30,
}: {
  children: React.ReactNode;
  className?: string;
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
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ==========================================================================
   MAIN PAGE COMPONENT
   ========================================================================== */


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function NexusSaaSPage() {
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

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [annualBilling, setAnnualBilling] = useState(true);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    
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
return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="premium-theme min-h-screen bg-[#05050a] text-white selection:bg-violet-500/30 font-sans overflow-x-hidden">
      {/* Background Gradients */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-violet-600/20 blur-[150px] pointer-events-none z-0" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[150px] pointer-events-none z-0" />

      {/* NAVIGATION */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-[#05050a]/80 backdrop-blur-xl border-b border-white/5 py-4" : "bg-transparent py-6"}`}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="#hero" className="flex items-center gap-3 relative z-50">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-semibold tracking-tight">Nexus.</span>
          </Link>

          <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-white/70">
            <Link href="#hero" className="hover:text-white transition-colors">
              Features
            </Link>
            <Link href="#tarifs" className="hover:text-white transition-colors">
              Solutions
            </Link>
            <Link href="#tarifs" className="hover:text-white transition-colors">
              Docs
            </Link>
            <Link href="#tarifs" className="hover:text-white transition-colors">
              Pricing
            </Link>
            <Link href="#tarifs" className="hover:text-white transition-colors">
              Blog
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-6">
            <Link
              href="#hero"
              className="text-sm font-medium text-white/70 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <button className="px-5 py-2.5 bg-white text-black text-sm font-bold rounded-full hover:bg-violet-50 transition-colors">
              Start Free Trial
            </button>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden relative z-50 text-white"
          >
            {menuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[#05050a]/98 backdrop-blur-2xl flex flex-col pt-32 px-6"
          >
            <div className="flex flex-col gap-6 text-2xl font-medium">
              <Link href="#hero" onClick={() => setMenuOpen(false)}>
                Features
              </Link>
              <Link href="#tarifs" onClick={() => setMenuOpen(false)}>
                Solutions
              </Link>
              <Link href="#tarifs" onClick={() => setMenuOpen(false)}>
                Docs
              </Link>
              <Link href="#tarifs" onClick={() => setMenuOpen(false)}>
                Pricing
              </Link>
            </div>
            <div className="mt-12 pt-8 border-t border-white/10 flex flex-col gap-4">
              <button className="w-full py-4 border border-white/20 rounded-xl font-semibold">
                Sign In
              </button>
              <button className="w-full py-4 bg-white text-black rounded-xl font-semibold">
                Start Free Trial
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==========================================
          1. HERO SECTION
          ========================================== */}
      <section id="hero" className="relative pt-40 pb-20 md:pt-52 md:pb-32 px-6 overflow-hidden">
        <div className="max-w-[1200px] mx-auto text-center relative z-10 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 inline-flex items-center gap-3 px-4 py-2 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm"
          >
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />{" "}
            Introducing Nexus Edge 2.0
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[1.1] mb-8"
          >{c?.heroHeadline ?? <>
            Infrastructure for the <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-300 to-indigo-400">
              Next Generation.
            </span>
          </>}</motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-12 leading-relaxed"
          >{c?.heroSubline ?? fd?.tagline ?? <>
            Build, deploy, and scale globally distributed applications in
            seconds. We handle the infrastructure complexity so you can focus on
            writing code.
          </>}</motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <button className="px-8 py-4 bg-white text-black rounded-full font-bold text-sm hover:scale-105 transition-transform flex items-center justify-center gap-2">
              Start Building Free <ArrowRight className="w-4 h-4" />
            </button>
            <button className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-full font-bold text-sm hover:bg-white/10 transition-colors flex items-center justify-center gap-2 backdrop-blur-sm">
              <Play className="w-4 h-4 fill-current" /> Watch Demo
            </button>
          </motion.div>

          {/* DASHBOARD MOCKUP */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1,
              delay: 0.5,
              type: "spring",
              stiffness: 50,
            }}
            className="mt-20 md:mt-32 relative w-full max-w-5xl"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#05050a] via-transparent to-transparent z-20 h-full w-full pointer-events-none" />

            <div className="rounded-2xl border border-white/10 bg-[#0a0a14]/80 backdrop-blur-xl overflow-hidden shadow-[0_0_80px_rgba(139,92,246,0.15)] relative z-10">
              {/* Fake Browser Header */}
              <div className="h-12 border-b border-white/10 flex items-center px-4 gap-2 bg-white/[0.02]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="ml-4 px-4 py-1.5 rounded-md bg-black/40 text-xs text-white/40 font-mono border border-white/5">
                  app.nexus.dev/dashboard
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                {/* Metrics */}
                <div className="col-span-1 md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    "Requests/sec",
                    "Latency (p99)",
                    "Bandwidth",
                    "Active Nodes",
                  ].map((metric, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl border border-white/5 bg-white/[0.02]"
                    >
                      <div className="text-xs text-white/50 mb-2">{metric}</div>
                      <div className="text-2xl md:text-3xl font-semibold text-white">
                        {i === 0
                          ? "45,212"
                          : i === 1
                            ? "12ms"
                            : i === 2
                              ? "1.2TB/s"
                              : "254"}
                      </div>
                      <div className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
                        <ArrowRight className="w-3 h-3 -rotate-45" /> +12%
                      </div>
                    </div>
                  ))}
                </div>
                {/* Fake Chart */}
                <div className="col-span-1 md:col-span-2 p-6 rounded-xl border border-white/5 bg-white/[0.02] h-64 flex flex-col justify-between relative overflow-hidden">
                  <div className="text-sm font-medium">Global Traffic</div>
                  {/* CSS fake chart lines */}
                  <div className="absolute bottom-0 left-0 w-full h-1/2 flex items-end px-6 pb-6 gap-2 opacity-50">
                    {[40, 70, 45, 90, 65, 80, 100, 85, 60, 75, 50, 95].map(
                      (h, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-violet-500/40 rounded-t-sm transition-all"
                          style={{ height: `${h}%` }}
                        />
                      ),
                    )}
                  </div>
                </div>
                {/* Status List */}
                <div className="col-span-1 p-6 rounded-xl border border-white/5 bg-white/[0.02]">
                  <div className="text-sm font-medium mb-6">
                    Recent Deployments
                  </div>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <div>
                          <div className="text-xs font-medium">
                            api-service-v{4 - i}.2
                          </div>
                          <div className="text-[10px] text-white/40">
                            2 mins ago via GitHub
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==========================================
          2. LOGOS MARQUEE
          ========================================== */}
      <section id="partners" className="py-12 border-y border-white/5 bg-black/20 overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6 mb-8 text-center text-xs font-semibold tracking-widest text-white/40 uppercase">
          Trusted by innovative engineering teams worldwide
        </div>
        <div className="flex whitespace-nowrap opacity-50">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="flex gap-16 px-8 text-xl font-bold tracking-tight"
          >
            {[...Array(10)].map((_, i) => (
              <span key={i} className="flex items-center gap-16">
                ACME Corp <span className="text-white/20">/</span> Globex{" "}
                <span className="text-white/20">/</span> Initech{" "}
                <span className="text-white/20">/</span> Soylent{" "}
                <span className="text-white/20">/</span>
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ==========================================
          3. FEATURES GRID (Bento)
          ========================================== */}
      <section id="apropos" className="py-32 md:py-48 px-6 max-w-[1400px] mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <Reveal>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">{c?.aboutTitle ?? fd?.businessName ?? <>
              Everything you need to scale.
            </>}</h2>
            <p className="text-lg text-white/60">{c?.aboutText ?? <>
              A complete platform combining the speed of the edge with the power
              of serverless, designed for modern development workflows.
            </>}</p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="p-8 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-colors h-full">
                <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-white/60 leading-relaxed text-sm">
                  {feature.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ==========================================
          4. PERFORMANCE HIGHLIGHT
          ========================================== */}
      <section id="realisations" className="py-32 border-y border-white/5 bg-gradient-to-b from-[#0a0a14] to-[#05050a] px-6">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-6">
              <Activity className="w-3 h-3" /> Zero Latency
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Uncompromising speed, everywhere.
            </h2>
            <p className="text-lg text-white/60 mb-8 leading-relaxed">
              Our custom runtime is written in Rust and boots in under 1ms. By
              eliminating cold starts and running your code within our global
              edge network, your users get instant responses no matter where
              they are.
            </p>
            <ul className="space-y-4 mb-10">
              {[
                "0ms Cold starts for edge functions",
                "Global database replication under 50ms",
                "Built-in Redis-compatible distributed cache",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 text-sm font-medium"
                >
                  <CheckCircle2 className="w-5 h-5 text-violet-500" /> {item}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.2}>
            {/* Visual code block representation */}
            <div className="rounded-2xl border border-white/10 bg-[#0a0a14] overflow-hidden shadow-2xl font-mono text-sm">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/[0.02]">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-white/20" />
                  <div className="w-3 h-3 rounded-full bg-white/20" />
                </div>
                <div className="text-white/40 text-xs">api/handler.ts</div>
              </div>
              <div className="p-6 overflow-x-auto text-white/70">
                <div className="text-pink-400">import</div> {"{ Nexus }"}{" "}
                <div className="text-pink-400">from</div>{" "}
                <div className="text-green-400">'@nexus/core'</div>;
                <br />
                <br />
                <div className="text-pink-400">export default</div>{" "}
                <div className="text-blue-400">Nexus.route</div>
                {"({"}
                <br />
                &nbsp;&nbsp;path:{" "}
                <div className="text-green-400">'/api/data'</div>,<br />
                &nbsp;&nbsp;cache:{" "}
                <div className="text-purple-400">"s-maxage=60"</div>,<br />
                &nbsp;&nbsp;<div className="text-blue-400">handler</div>:{" "}
                <div className="text-pink-400">async</div> (req, res) {`=>`}{" "}
                {"{"}
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;
                <div className="text-white/40">
                  // Runs instantly at the edge
                </div>
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;
                <div className="text-pink-400">const</div> data ={" "}
                <div className="text-pink-400">await</div> db.query(
                <div className="text-green-400">'SELECT *'</div>);
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;
                <div className="text-pink-400">return</div> res.json(data);
                <br />
                &nbsp;&nbsp;{"}"}
                <br />
                {"});"}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ==========================================
          5. TESTIMONIALS
          ========================================== */}
      <section className="py-32 px-6 max-w-[1400px] mx-auto">
        <Reveal className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Loved by developers.
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="p-8 rounded-2xl border border-white/10 bg-white/[0.02] h-full flex flex-col justify-between">
                <div>
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, j) => (
                      <Star
                        key={j}
                        className="w-4 h-4 fill-violet-500 text-violet-500"
                      />
                    ))}
                  </div>
                  <p className="text-white/80 leading-relaxed mb-8">
                    "{t.text}"
                  </p>
                </div>
                <div className="flex items-center gap-4 border-t border-white/5 pt-6">
                  <div className="w-10 h-10 rounded-full bg-violet-500/20 text-violet-300 flex items-center justify-center font-bold">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className="text-xs text-white/50">{t.role}</div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ==========================================
          6. PRICING
          ========================================== */}
      <section id="tarifs" className="py-32 bg-[#0a0a14] px-6 border-y border-white/5">
        <div className="max-w-[1200px] mx-auto">
          <Reveal className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Simple, transparent pricing.
            </h2>
            <div className="flex items-center justify-center gap-4">
              <span
                className={`text-sm font-medium ${!annualBilling ? "text-white" : "text-white/50"}`}
              >
                Monthly
              </span>
              <button
                onClick={() => setAnnualBilling(!annualBilling)}
                className="w-14 h-8 rounded-full bg-white/10 p-1 relative transition-colors"
              >
                <motion.div
                  className="w-6 h-6 rounded-full bg-violet-500"
                  animate={{ x: annualBilling ? 24 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
              <span
                className={`text-sm font-medium ${annualBilling ? "text-white" : "text-white/50"}`}
              >
                Annually{" "}
                <span className="text-emerald-400 text-xs ml-1">
                  (Save 20%)
                </span>
              </span>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PRICING.map((plan, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div
                  className={`relative p-8 rounded-3xl border ${plan.popular ? "border-violet-500 bg-violet-500/5 shadow-[0_0_30px_rgba(139,92,246,0.1)]" : "border-white/10 bg-white/[0.02]"} h-full flex flex-col`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-violet-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-sm text-white/50 mb-6 h-10">{plan.desc}</p>
                  <div className="mb-8">
                    <span className="text-5xl font-bold tracking-tighter">
                      {plan.price !== "Custom" &&
                      annualBilling &&
                      plan.price !== "$0"
                        ? `$${parseInt(plan.price.slice(1)) * 0.8}`
                        : plan.price}
                    </span>
                    {plan.price !== "Custom" && (
                      <span className="text-white/50 ml-2">/ month</span>
                    )}
                  </div>

                  <button
                    className={`w-full py-3.5 rounded-xl font-bold text-sm mb-8 transition-colors ${plan.popular ? "bg-violet-500 hover:bg-violet-600 text-white" : "bg-white/10 hover:bg-white/20 text-white"}`}
                  >
                    {plan.cta}
                  </button>

                  <div className="space-y-4 mt-auto">
                    {plan.features.map((feature, j) => (
                      <div
                        key={j}
                        className="flex items-start gap-3 text-sm text-white/80"
                      >
                        <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          7. FAQ
          ========================================== */}
      <section className="py-32 px-6 max-w-[800px] mx-auto">
        <Reveal className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Frequently Asked Questions
          </h2>
        </Reveal>

        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <div className="border border-white/10 rounded-2xl bg-white/[0.02] overflow-hidden">
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-white/[0.02] transition-colors"
                >
                  <span className="font-medium pr-4">{faq.question}</span>
                  <ChevronRight
                    className={`w-5 h-5 text-white/40 transition-transform ${activeFaq === i ? "rotate-90" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {activeFaq === i && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 text-white/60 text-sm leading-relaxed border-t border-white/5 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ==========================================
          8. BOTTOM CTA
          ========================================== */}
      <section id="contact" className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-violet-600/20 blur-[100px] z-0 pointer-events-none rounded-full scale-150" />
        <div className="max-w-[800px] mx-auto text-center relative z-10 border border-white/10 bg-white/[0.02] backdrop-blur-xl rounded-3xl p-12 md:p-20 shadow-2xl">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Ready to scale?
          </h2>
          <p className="text-lg text-white/60 mb-10">
            Join thousands of developers building the future on Nexus. Start for
            free, upgrade when you need to.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="px-8 py-4 bg-white text-black rounded-full font-bold hover:scale-105 transition-transform">
              Start Free Trial
            </button>
            <button className="px-8 py-4 border border-white/20 text-white rounded-full font-bold hover:bg-white/5 transition-colors">
              Read Documentation
            </button>
          </div>
        </div>
      </section>

      {/* ==========================================
          9. MEGA FOOTER
          ========================================== */}
      <footer className="pt-20 pb-10 px-6 border-t border-white/10 bg-[#020205]">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-16">
            <div className="col-span-2">
              <Link href="#hero" className="flex items-center gap-2 mb-6">
                <div className="w-6 h-6 rounded bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                  <Zap className="w-3 h-3 text-white" />
                </div>
                <span className="text-lg font-bold tracking-tight">Nexus.</span>
              </Link>
              <p className="text-white/40 text-sm leading-relaxed mb-8 max-w-xs">
                The global edge platform for modern applications. Build faster,
                scale infinitely, and sleep better at night.
              </p>
              <div className="flex gap-4">
                <a
                  href="/templates/impact-113"
                  className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <Globe className="w-4 h-4" />
                </a>
                <a
                  href="/templates/impact-113"
                  className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <Globe className="w-4 h-4" />
                </a>
                <a
                  href="/templates/impact-113"
                  className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <Globe className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-6 text-sm">Product</h4>
              <ul className="space-y-4 text-sm text-white/50">
                <li>
                  <a href="#contact" className="hover:text-white transition-colors">
                    Edge Functions
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-white transition-colors">
                    Global Database
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-white transition-colors">
                    Analytics
                  </a>
                </li>
                <li>
                  <a href="#tarifs" className="hover:text-white transition-colors">
                    Integrations
                  </a>
                </li>
                <li>
                  <a href="#tarifs" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#tarifs" className="hover:text-white transition-colors">
                    Changelog
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-6 text-sm">Resources</h4>
              <ul className="space-y-4 text-sm text-white/50">
                <li>
                  <a href="#contact" className="hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-white transition-colors">
                    API Reference
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-white transition-colors">
                    Community
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-white transition-colors">
                    Open Source
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-white transition-colors">
                    System Status
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-6 text-sm">Company</h4>
              <ul className="space-y-4 text-sm text-white/50">
                <li>
                  <a href="#apropos" className="hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#apropos" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#partners" className="hover:text-white transition-colors">
                    Customers
                  </a>
                </li>
                <li>
                  <a href="#partners" className="hover:text-white transition-colors">
                    Partners
                  </a>
                </li>
                <li>
                  <a href="#partners" className="hover:text-white transition-colors">
                    Contact Sales
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-6 text-sm">Legal</h4>
              <ul className="space-y-4 text-sm text-white/50">
                <li>
                  <a href="#contact" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-white transition-colors">
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-white transition-colors">
                    Security
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-white transition-colors">
                    DPA
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40">
            <span>
              &copy; {new Date().getFullYear()} Nexus Edge Inc. All rights
              reserved.
            </span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              All systems operational
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
