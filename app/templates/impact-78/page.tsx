// @ts-nocheck
"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import {useRef, useState, useEffect} from 'react';
import Image from "next/image";
import Link from "next/link";
import { Coffee, ArrowUpRight, Quote } from "lucide-react";
import { Reveal, MagneticBtn, Counter } from "./shared";

const WORK_REEL = [
  {
    id: 1,
    title: "VOID_BREW",
    client: "Nespresso Professional",
    tags: ["Branding", "Packaging", "Digital"],
    img: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "SOLAR_ORIGIN",
    client: "Starbucks Reserve",
    tags: ["Campaign", "Art Direction", "Film"],
    img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "DARK_MATTER",
    client: "Blue Bottle Coffee",
    tags: ["Identity", "Motion", "Web"],
    img: "https://images.unsplash.com/photo-1497933321188-91189e3f7f77?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "LUNAR_FREQ",
    client: "Intelligentsia",
    tags: ["Branding", "Retail", "3D"],
    img: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=800&auto=format&fit=crop",
  },
];

const EXPERTISE = [
  {
    code: "DOMAIN_01",
    title: "Creative Technology",
    desc: "Generative visuals, custom tooling, and interactive installations at the intersection of code and sensory experience.",
    items: ["Generative Art", "Interactive Web", "Physical Computing"],
  },
  {
    code: "DOMAIN_02",
    title: "Motion & 3D",
    desc: "Fluid motion design and three-dimensional worldbuilding for film titles, product reveals, and brand campaigns.",
    items: ["Motion Graphics", "3D Render", "Film & VFX"],
  },
  {
    code: "DOMAIN_03",
    title: "Brand Systems",
    desc: "End-to-end brand architecture: identity, tone of voice, touchpoint design, and living system documentation.",
    items: ["Identity Design", "Design Systems", "Brand Strategy"],
  },
];

const PROCESS_STEPS = [
  {
    num: "01",
    title: "Extract",
    desc: "Deep-dive research into your brand DNA, competitors, and target signal. We map the chemical composition of the problem.",
  },
  {
    num: "02",
    title: "Roast",
    desc: "Conceptual development under pressure. We synthesize findings into a series of bold creative directions.",
  },
  {
    num: "03",
    title: "Brew",
    desc: "Iterative production with precision control. Every element calibrated against your brand temperature.",
  },
  {
    num: "04",
    title: "Serve",
    desc: "Flawless delivery across all touchpoints. Post-launch analysis and system documentation included.",
  },
];

const STATS = [
  { value: 86, suffix: "", label: "Projets livrés" },
  { value: 34, suffix: "", label: "Clients actifs" },
  { value: 9, suffix: "", label: "Prix créatifs" },
  { value: 6, suffix: " ans", label: "D'existence" },
];

const TESTIMONIALS = [
  {
    quote: "Aether transformed our visual identity into something we are genuinely proud to put in front of the world. The attention to craft is unreal.",
    name: "Mia Chen",
    role: "CMO, Nespresso Professional",
  },
  {
    quote: "They think at a frequency we had never encountered before. The final campaign exceeded every brief metric we set.",
    name: "Jonas Reuter",
    role: "Creative Director, Starbucks Reserve",
  },
  {
    quote: "A rare studio that treats every project like it is their own brand — obsessive, principled, and relentlessly precise.",
    name: "Aya Okafor",
    role: "Founder, Intelligentsia",
  },
];


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function AetherRoasteryPage() {
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

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  
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
    <div className="relative w-full">
      {/* ==========================================
          1. HERO (Cinematic Coffee)
          ========================================== */}
      <section
        ref={heroRef}
        className="relative w-full h-[85vh] flex flex-col justify-center overflow-hidden"
      >
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="absolute inset-0 z-0"
        >
          <Image
            src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1600&q=80"
            alt="Aether Hero"
            fill
            className="object-cover brightness-50 contrast-125 grayscale-[0.3]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a09] via-transparent to-transparent" />
        </motion.div>

        {/* ORANGE PARTICLE GLOW */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-orange-900/10 rounded-full blur-[150px] pointer-events-none" />

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 w-full">
          <Reveal>
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-orange-900/20 rounded-none border border-orange-900/40 text-orange-500 text-[10px] font-bold uppercase tracking-widest mb-10 shadow-sm">
              <Coffee className="w-3.5 h-3.5" />
              Specialty Grade // 90+ SCA Points
            </div>
            <h1 className="text-7xl md:text-9xl lg:text-[11rem] font-black leading-[1.15] tracking-tighter mb-12 uppercase pb-6">{c?.heroHeadline ?? <>
              The Alchemy <br />{" "}
              <span className="text-orange-900 italic">of Extraction.</span>
            </>}</h1>
            <p className="max-w-xl text-lg md:text-xl text-white/20 leading-relaxed font-bold mb-12 uppercase tracking-tight italic">{c?.heroSubline ?? fd?.tagline ?? <>
              Precision-roasted molecular coffee. Sourced at origin. Analyzed in
              lab. Delivered in spectrum.
            </>}</p>
            <div className="flex flex-col sm:flex-row gap-6">
              <Link href="/templates/impact-78/collection">
                <MagneticBtn className="px-12 py-5 bg-white text-black text-[10px] font-bold uppercase tracking-[0.4em] rounded-none hover:bg-orange-900 hover:text-white transition-all cursor-pointer shadow-2xl">
                  Explore Roast Spectrum
                </MagneticBtn>
              </Link>
              <Link href="/templates/impact-78/brewing">
                <button className="px-12 py-5 border border-white/10 text-white text-[10px] font-bold uppercase tracking-[0.4em] rounded-none hover:bg-white hover:text-black transition-all cursor-pointer">
                  Technical_Brew_Log
                </button>
              </Link>
            </div>
          </Reveal>
        </div>

        <motion.div
          style={{ opacity: heroOpacity }}
          className="absolute bottom-10 left-12 hidden md:block"
        >
          <div className="flex flex-col items-start gap-3">
            <span className="text-[9px] font-bold text-white/10 uppercase tracking-[0.5em]">
              AETHER_ROAST_OS // NODE_078
            </span>
            <div className="w-32 h-[1px] bg-orange-900/40" />
          </div>
        </motion.div>
      </section>

      {/* ==========================================
          2. WORK REEL
          ========================================== */}
      <section className="py-32 bg-[#0c0a09] border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal>
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-orange-900 mb-6 block">
              WORK_REEL // SELECTED_PROJECTS
            </span>
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic text-white mb-20 pb-2 leading-[1.1]">
              Projects.
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5">
            {WORK_REEL.map((work, i) => (
              <Reveal key={work.id} delay={i * 0.08}>
                <div className="group relative bg-[#0c0a09] overflow-hidden cursor-pointer">
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={work.img}
                      alt={work.title}
                      fill
                      className="object-cover brightness-50 grayscale-[0.5] group-hover:scale-105 group-hover:brightness-70 group-hover:grayscale-0 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a09] via-transparent to-transparent" />
                    <div className="absolute top-4 left-4 flex gap-2">
                      {work.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-orange-900/30 border border-orange-900/50 px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-orange-500/80"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="p-8 border-t border-white/5">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.4em] mb-2">
                          {work.client}
                        </p>
                        <h3 className="text-2xl font-black uppercase tracking-tighter text-white group-hover:text-orange-500 transition-colors">
                          {work.title}
                        </h3>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-white/10 group-hover:text-orange-900 transition-colors mt-1" />
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          3. EXPERTISE
          ========================================== */}
      <section className="py-32 bg-[#100e0c] border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal>
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-orange-900 mb-6 block">
              EXPERTISE_MATRIX // CORE_DOMAINS
            </span>
            <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter italic text-white mb-20 pb-2 leading-[1.1]">
              What we do.
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5">
            {EXPERTISE.map((exp, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="bg-[#100e0c] p-10 group hover:bg-[#0c0a09] transition-colors border-t-2 border-transparent hover:border-orange-900">
                  <span className="text-[9px] font-black text-orange-900/50 uppercase tracking-[0.5em] mb-6 block">
                    {exp.code}
                  </span>
                  <h3 className="text-2xl font-black uppercase tracking-tighter text-white mb-6">
                    {exp.title}
                  </h3>
                  <p className="text-[11px] text-white/30 uppercase tracking-widest leading-relaxed font-bold italic mb-8">
                    {exp.desc}
                  </p>
                  <ul className="space-y-3">
                    {exp.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-widest text-white/20"
                      >
                        <div className="w-1 h-1 bg-orange-900 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          4. PROCESS
          ========================================== */}
      <section className="py-32 bg-[#0c0a09] border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal>
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-orange-900 mb-6 block">
              PROCESS_SEQUENCE // HOW_WE_WORK
            </span>
            <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter italic text-white mb-20 pb-2 leading-[1.1]">
              Method.
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5">
            {PROCESS_STEPS.map((step, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="bg-[#0c0a09] p-10 h-full group hover:bg-[#100e0c] transition-colors">
                  <div className="text-6xl font-black text-orange-900/20 mb-8 group-hover:text-orange-900/40 transition-colors">
                    {step.num}
                  </div>
                  <h3 className="text-xl font-black uppercase tracking-tighter text-white mb-4">
                    {step.title}
                  </h3>
                  <p className="text-[11px] text-white/30 uppercase tracking-widest leading-relaxed font-bold italic">
                    {step.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          5. STATS
          ========================================== */}
      <section className="py-32 bg-[#100e0c] border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5">
            {STATS.map((stat, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="bg-[#100e0c] p-12 text-center">
                  <div className="text-6xl md:text-7xl font-black tracking-tighter text-orange-900 mb-4 font-mono">
                    <Counter to={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-[9px] font-bold uppercase tracking-[0.5em] text-white/20 italic">
                    {stat.label}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          6. TESTIMONIALS
          ========================================== */}
      <section className="py-32 bg-[#0c0a09] border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal>
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-orange-900 mb-6 block">
              CLIENT_SIGNALS // TESTIMONIALS
            </span>
            <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter italic text-white mb-20 pb-2 leading-[1.1]">
              They said.
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="bg-[#0c0a09] p-10 h-full flex flex-col">
                  <Quote className="w-8 h-8 text-orange-900/40 mb-8 flex-shrink-0" />
                  <p className="text-[11px] text-white/40 uppercase tracking-widest leading-relaxed font-bold italic flex-1 mb-8">
                    "{t.quote}"
                  </p>
                  <div className="pt-6 border-t border-white/5">
                    <p className="text-xs font-black uppercase tracking-widest text-white mb-1">
                      {t.name}
                    </p>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-orange-900/60 italic">
                      {t.role}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          7. AWARDS & PRESS
          ========================================== */}
      <section className="py-32 bg-[#100e0c] border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
            <div>
              <Reveal>
                <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-orange-900 mb-6 block">RECOGNITION_LOG // AWARDS</span>
                <h2 className="text-4xl font-black uppercase tracking-tighter italic text-white mb-16 leading-[1.1] pb-2">Awards.</h2>
              </Reveal>
              <div className="divide-y divide-white/5">
                {[
                  { year: "2025", title: "D&AD Gold Pencil", cat: "Brand Identity" },
                  { year: "2024", title: "Cannes Lions Gold", cat: "Design" },
                  { year: "2024", title: "Type Directors Club Award", cat: "Typography" },
                  { year: "2023", title: "Red Dot Best of Best", cat: "Communication" },
                  { year: "2023", title: "CLIO Award", cat: "Art Direction" },
                  { year: "2022", title: "Young Guns 20", cat: "Studio" },
                ].map((a, i) => (
                  <Reveal key={i} delay={i * 0.06}>
                    <div className="py-5 flex items-center gap-8 group">
                      <span className="text-[9px] font-black text-white/10 uppercase tracking-widest w-10 flex-shrink-0 font-mono">{a.year}</span>
                      <div className="flex-1 text-sm font-black uppercase tracking-tighter text-white/40 italic group-hover:text-white/80 transition-colors">{a.title}</div>
                      <span className="text-[9px] font-bold text-orange-900/60 uppercase tracking-widest flex-shrink-0">{a.cat}</span>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
            <div>
              <Reveal>
                <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-orange-900 mb-6 block">PRESS_LOG // AS_SEEN_IN</span>
                <h2 className="text-4xl font-black uppercase tracking-tighter italic text-white mb-16 leading-[1.1] pb-2">Press.</h2>
              </Reveal>
              <div className="divide-y divide-white/5">
                {[
                  { pub: "Wallpaper*", title: "Aether Studio and the precision of creative systems", year: "2025" },
                  { pub: "It's Nice That", title: "How VOID_BREW became an industry benchmark", year: "2024" },
                  { pub: "Brand New", title: "Aether's visual alchemy for Blue Bottle Coffee", year: "2024" },
                  { pub: "Eye Magazine", title: "When coffee meets computation", year: "2023" },
                  { pub: "Dezeen", title: "Motion, matter, and the molecular brand", year: "2022" },
                ].map((p, i) => (
                  <Reveal key={i} delay={i * 0.06}>
                    <div className="py-5 flex items-start gap-8 group cursor-pointer">
                      <span className="text-[9px] font-black text-orange-900/50 uppercase tracking-widest w-20 flex-shrink-0 mt-0.5">{p.pub}</span>
                      <div className="flex-1 text-sm font-bold text-white/20 italic group-hover:text-white/60 transition-colors leading-snug">{p.title}</div>
                      <ArrowUpRight className="w-3 h-3 text-white/10 group-hover:text-orange-900 transition-colors flex-shrink-0 mt-1" />
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          8. CLIENTS TICKER
          ========================================== */}
      <section className="py-16 bg-[#0c0a09] border-t border-white/5 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="flex flex-wrap items-center gap-x-16 gap-y-4">
              <span className="text-[9px] font-bold text-white/10 uppercase tracking-[0.5em] flex-shrink-0">Trusted by</span>
              {["Nespresso Professional", "Starbucks Reserve", "Blue Bottle Coffee", "Intelligentsia", "La Marzocco", "Oatly", "Pact Coffee", "Matchless Coffee"].map((c) => (
                <span key={c} className="text-base font-black uppercase tracking-tighter text-white/10 hover:text-orange-900/60 transition-colors cursor-default italic">{c}</span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ==========================================
          9. PRICING / ENGAGEMENT
          ========================================== */}
      <section className="py-32 bg-[#100e0c] border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal>
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-orange-900 mb-6 block">ENGAGEMENT_MODEL // PRICING</span>
            <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter italic text-white mb-20 leading-[1.1] pb-2">Investment.</h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5">
            {[
              { tier: "Espresso_Shot", desc: "Brand audit, logo redesign, and core identity system. For startups and early-stage brands.", scope: ["Logo + wordmark", "Color palette", "Typography system", "Brand guidelines PDF"], price: "From €12,000", duration: "4 weeks" },
              { tier: "Full_Extraction", desc: "Complete brand system with motion identity, digital templates, and campaign direction.", scope: ["Everything in Espresso", "Motion identity", "Campaign direction", "Print + digital templates"], price: "From €28,000", duration: "8 weeks" },
              { tier: "Reserve_Roast", desc: "Long-term creative partnership with monthly retainer. Unlimited requests. Priority turnaround.", scope: ["Everything in Full Extraction", "Monthly retainer access", "Dedicated creative team", "Quarterly brand review"], price: "From €6,500/mo", duration: "Ongoing" },
            ].map((p, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="bg-[#0c0a09] p-10 h-full flex flex-col group hover:bg-[#100e0c] transition-colors border-t-2 border-transparent hover:border-orange-900">
                  <span className="text-[9px] font-black text-orange-900/50 uppercase tracking-[0.5em] mb-4 block">{p.tier}</span>
                  <div className="text-3xl font-black text-orange-900 mb-2 tracking-tighter">{p.price}</div>
                  <div className="text-[9px] font-bold text-white/20 uppercase tracking-widest mb-6">{p.duration}</div>
                  <p className="text-[10px] text-white/20 uppercase tracking-widest leading-relaxed font-bold italic mb-8">{p.desc}</p>
                  <ul className="space-y-2 flex-1 mb-8">
                    {p.scope.map((s) => (
                      <li key={s} className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-widest text-white/20">
                        <div className="w-1 h-1 bg-orange-900 flex-shrink-0" />{s}
                      </li>
                    ))}
                  </ul>
                  <button className="w-full py-4 border border-white/10 text-white text-[9px] font-bold uppercase tracking-widest group-hover:bg-orange-900 group-hover:text-white transition-all">
                    Discuss Brief
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          10. PROJECT INQUIRY CTA
          ========================================== */}
      <section className="py-40 bg-[#100e0c] border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 text-center">
          <Reveal>
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-orange-900 mb-8 block">
              NEW_PROJECT // INQUIRY_PORTAL
            </span>
            <h2 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter text-white leading-[1.05] mb-12 pb-4">{c?.aboutTitle ?? fd?.businessName ?? <>
              Start a<br />
              <span className="text-orange-900">project.</span>
            </>}</h2>
            <p className="max-w-md mx-auto text-[11px] text-white/20 uppercase tracking-widest leading-relaxed font-bold italic mb-16">{c?.aboutText ?? <>
              We take on a limited number of new clients each quarter. Submit your brief and we will respond within 48 hours.
            </>}</p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/templates/impact-78/contact">
                <MagneticBtn className="px-16 py-6 bg-white text-black text-[10px] font-bold uppercase tracking-[0.4em] rounded-none hover:bg-orange-900 hover:text-white transition-all cursor-pointer shadow-2xl">
                  Submit Brief
                </MagneticBtn>
              </Link>
              <Link href="/templates/impact-78/collection">
                <button className="px-16 py-6 border border-white/10 text-white text-[10px] font-bold uppercase tracking-[0.4em] rounded-none hover:bg-white hover:text-black transition-all cursor-pointer">
                  View Work
                </button>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
