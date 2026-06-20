// @ts-nocheck
"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
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

export default function AetherRoasteryPage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

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
            <h1 className="text-7xl md:text-9xl lg:text-[11rem] font-black leading-[1.15] tracking-tighter mb-12 uppercase pb-6">
              The Alchemy <br />{" "}
              <span className="text-orange-900 italic">of Extraction.</span>
            </h1>
            <p className="max-w-xl text-lg md:text-xl text-white/20 leading-relaxed font-bold mb-12 uppercase tracking-tight italic">
              Precision-roasted molecular coffee. Sourced at origin. Analyzed in
              lab. Delivered in spectrum.
            </p>
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
          7. PROJECT INQUIRY CTA
          ========================================== */}
      <section className="py-40 bg-[#100e0c] border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 text-center">
          <Reveal>
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-orange-900 mb-8 block">
              NEW_PROJECT // INQUIRY_PORTAL
            </span>
            <h2 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter text-white leading-[1.05] mb-12 pb-4">
              Start a<br />
              <span className="text-orange-900">project.</span>
            </h2>
            <p className="max-w-md mx-auto text-[11px] text-white/20 uppercase tracking-widest leading-relaxed font-bold italic mb-16">
              We take on a limited number of new clients each quarter. Submit your brief and we will respond within 48 hours.
            </p>
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
