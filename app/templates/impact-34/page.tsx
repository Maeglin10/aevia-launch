"use client";
// @ts-nocheck

import React, {useRef, useState, useEffect} from 'react'
import { motion, useScroll, useTransform } from "framer-motion"
import Link from "next/link"
import {
  Mic,
  Play,
  TrendingUp,
  Star,
  ChevronRight,
  ArrowRight,
  Headphones,
  BarChart3,
} from "lucide-react"
import {
  C,
  FEATURES,
  TESTIMONIALS,
  DISTRIBUTION_PLATFORMS,
  MARQUEE_STATS,
  WEEKLY_DATA,
  TOP_EPISODES,
  Reveal,
  GlassCard,
  AnimatedEQ,
  MarqueeStrip,
  WeeklyChart,
} from "./shared"


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function Home() {
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

  const heroRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({ target: heroRef })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 180])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.08])

  
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
    <div className="relative">
      {/* =====================================================================
          1. HERO — OLED DARK + ANIMATED EQ + PARALLAX
          ===================================================================== */}
      <section
        id="hero"
        ref={heroRef}
        className="relative min-h-[115vh] flex flex-col justify-center items-center overflow-hidden pt-12 pb-20"
      >
        {/* Parallax BG */}
        <motion.div
          style={{ y: heroY, scale: heroScale }}
          className="absolute inset-0 pointer-events-none"
        >
          {/* Glow blobs */}
          <div
            className="absolute top-[-15%] left-[5%] w-[700px] h-[700px] rounded-full opacity-20 blur-[120px]"
            style={{ background: `radial-gradient(circle, ${C.accent} 0%, transparent 70%)` }}
          />
          <div
            className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] rounded-full opacity-10 blur-[100px]"
            style={{ background: `radial-gradient(circle, ${C.purple} 0%, transparent 70%)` }}
          />
          <div
            className="absolute bottom-[-10%] left-[40%] w-[600px] h-[600px] rounded-full opacity-15 blur-[120px]"
            style={{ background: `radial-gradient(circle, ${C.accent} 0%, transparent 70%)` }}
          />
          {/* Grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(249,115,22,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(249,115,22,0.03)_1px,transparent_1px)] bg-[size:48px_48px]" />
        </motion.div>

        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          {/* Chip */}
          <Reveal>
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-[#F97316]/30 bg-[#F97316]/10 mb-10">
              <Mic className="w-3.5 h-3.5 text-[#F97316]" />
              <span className="text-xs font-semibold text-[#FB923C]">
                Trusted by 50,000+ podcasters worldwide
              </span>
            </div>
          </Reveal>

          {/* Big EQ visualization */}
          <Reveal delay={0.05}>
            <div className="flex justify-center mb-8">
              <AnimatedEQ barCount={24} color={C.accent} height={90} />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[1.0] tracking-tight mb-6">{c?.heroHeadline ?? <>
              Your Podcast.{" "}
              <span
                className="inline-block"
                style={{
                  background: "linear-gradient(135deg, #F97316, #FB923C, #FDBA74)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Amplified.
              </span>
            </>}</h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="text-lg md:text-xl text-[#94A3B8] max-w-2xl mx-auto leading-relaxed mb-10">{c?.heroSubline ?? fd?.tagline ?? <>
              Host, distribute, and monetize your podcast on 15+ platforms — all from one
              dashboard. No tech skills required. Start in minutes.
            </>}</p>
          </Reveal>

          {/* CTA buttons */}
          <Reveal delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
              <Link href="/templates/impact-34/pricing">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-8 py-4 rounded-2xl text-white font-bold text-base shadow-[0_8px_32px_rgba(249,115,22,0.4)] hover:shadow-[0_12px_40px_rgba(249,115,22,0.5)] transition-all"
                  style={{ backgroundColor: C.accent }}
                >
                  Start Your Podcast Free
                </motion.button>
              </Link>
              <Link href="/templates/impact-34/features">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-8 py-4 rounded-2xl font-bold text-base border border-white/10 text-[#F8FAFC] hover:bg-white/5 transition-all flex items-center gap-2 justify-center"
                >
                  <Play className="w-4 h-4" /> Watch Demo
                </motion.button>
              </Link>
            </div>
          </Reveal>

          {/* Hero stats */}
          <Reveal delay={0.4}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {[
                { value: "50K+", label: "Active Podcasters" },
                { value: "2M+", label: "Episodes Hosted" },
                { value: "100M+", label: "Total Downloads" },
                { value: "98.9%", label: "Uptime SLA" },
              ].map((stat) => (
                <GlassCard key={stat.label} className="py-5 px-4 text-center">
                  <div
                    className="text-2xl font-black mb-1"
                    style={{ color: C.accent }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-xs text-[#64748B]">{stat.label}</div>
                </GlassCard>
              ))}
            </div>
          </Reveal>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-9 border-2 border-[#F97316]/30 rounded-full flex justify-center pt-1.5">
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-[#F97316]"
            />
          </div>
        </motion.div>
      </section>

      {/* =====================================================================
          2. FEATURES HIGHLIGHT — 6 CREATOR TOOLS
          ===================================================================== */}
      <section id="features" className="py-24 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-[#F97316] block mb-2">
                Creator Tools
              </span>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">{c?.aboutTitle ?? fd?.businessName ?? <>
                Everything you need to grow
              </>}</h2>
              <p className="text-lg text-[#64748B] max-w-2xl mx-auto">{c?.aboutText ?? <>
                Professional-grade tools that used to cost thousands a month — now included
                in every WaveForm plan.
              </>}</p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((feature, i) => {
              const IconComponent = feature.icon
              return (
                <Reveal key={feature.title} delay={i * 0.08}>
                  <Link href={feature.href} className="block">
                    <motion.div
                      whileHover={{ y: -4 }}
                      className="p-7 rounded-2xl border border-white/8 hover:border-white/15 transition-all group h-full"
                      style={{ backgroundColor: "rgba(255,255,255,0.03)" }}
                    >
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform"
                        style={{ backgroundColor: feature.color + "20" }}
                      >
                        <IconComponent className="w-6 h-6" style={{ color: feature.color }} />
                      </div>
                      <h3 className="font-bold text-lg text-[#F8FAFC] mb-2">{feature.title}</h3>
                      <p className="text-sm text-[#64748B] leading-relaxed mb-4">{feature.desc}</p>
                      <div
                        className="flex items-center gap-1.5 text-xs font-semibold"
                        style={{ color: feature.color }}
                      >
                        Learn more <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </motion.div>
                  </Link>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* =====================================================================
          3. ANALYTICS PREVIEW — MOCK DASHBOARD
          ===================================================================== */}
      <section id="analytics" className="py-24 px-6 bg-[#0A0A1A]">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <Reveal>
              <span className="text-xs font-bold uppercase tracking-widest text-[#F97316] block mb-3">
                Analytics
              </span>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
                Know your audience<br />
                <span style={{ color: C.accent }}>like never before</span>
              </h2>
              <p className="text-lg text-[#64748B] leading-relaxed mb-8">
                Real-time listener data, episode drop-off analysis, geographic heatmaps, and
                subscriber growth charts — all in one beautiful dashboard.
              </p>
              <ul className="flex flex-col gap-3 mb-8">
                {[
                  "Listener count by episode & date range",
                  "Drop-off points by minute",
                  "Geographic & device breakdown",
                  "Subscriber churn & growth rate",
                  "Revenue attribution per episode",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-[#94A3B8]">
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: "#F9731620" }}
                    >
                      <BarChart3 className="w-3 h-3 text-[#F97316]" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/templates/impact-34/analytics">
                <button
                  className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-white text-sm font-bold transition-all hover:opacity-90"
                  style={{ backgroundColor: C.accent }}
                >
                  Explore Analytics <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </Reveal>

            {/* Mock dashboard */}
            <Reveal delay={0.2} x={40}>
              <GlassCard className="p-6">
                {/* Dashboard header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-xs text-[#64748B] mb-1">Weekly Listeners</p>
                    <p className="text-2xl font-black text-white">51,400</p>
                  </div>
                  <div
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                    style={{ backgroundColor: `${C.green}15` }}
                  >
                    <TrendingUp className="w-3.5 h-3.5 text-[#10B981]" />
                    <span className="text-xs font-bold text-[#10B981]">+24.8%</span>
                  </div>
                </div>

                {/* Chart */}
                <div className="mb-4">
                  <div className="mb-2 flex justify-between">
                    {WEEKLY_DATA.map((d) => (
                      <span key={d.day} className="text-[10px] text-[#475569]">{d.day}</span>
                    ))}
                  </div>
                  <WeeklyChart />
                </div>

                {/* Top episodes */}
                <div className="mt-6">
                  <p className="text-xs font-bold text-[#475569] uppercase tracking-wider mb-3">
                    Top Episodes This Week
                  </p>
                  <div className="flex flex-col gap-2">
                    {TOP_EPISODES.slice(0, 3).map((ep) => (
                      <div
                        key={ep.rank}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03]"
                      >
                        <span className="text-xs font-black text-[#F97316] w-5 text-center">
                          #{ep.rank}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-[#F8FAFC] truncate">{ep.title}</p>
                          <p className="text-[10px] text-[#475569]">{ep.duration}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-[#F8FAFC]">{ep.listens}</p>
                          <p className="text-[10px] text-[#10B981]">{ep.growth}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </GlassCard>
            </Reveal>
          </div>
        </div>
      </section>

      {/* =====================================================================
          4. DISTRIBUTION MARQUEE — FEATURED ON
          ===================================================================== */}
      <section className="py-8 border-y border-white/5 overflow-hidden bg-[#0F0F23]">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-[#475569] mb-6">
          Featured on
        </p>
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="inline-flex gap-12 whitespace-nowrap"
        >
          {[...DISTRIBUTION_PLATFORMS, ...DISTRIBUTION_PLATFORMS].map((platform, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-2 text-sm font-bold text-[#475569] hover:text-[#F97316] transition-colors cursor-pointer"
            >
              <Headphones className="w-4 h-4" />
              {platform}
            </span>
          ))}
        </motion.div>
      </section>

      {/* =====================================================================
          5. CREATOR TESTIMONIALS
          ===================================================================== */}
      <section id="creators" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-[#F97316] block mb-2">
                Success Stories
              </span>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
                Creators who chose WaveForm
              </h2>
              <p className="text-lg text-[#64748B] max-w-xl mx-auto">
                Real results from real podcasters — not marketing copy.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.1}>
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="p-8 rounded-2xl border border-white/8 hover:border-[#F97316]/30 transition-all bg-white/[0.03]"
                >
                  {/* Show info */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Mic className="w-4 h-4 text-[#F97316]" />
                        <span className="text-sm font-bold text-[#F8FAFC]">{t.show}</span>
                      </div>
                      <span className="text-xs text-[#64748B]">{t.niche}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-black text-[#F97316]">{t.listeners}</div>
                      <div className="text-xs text-[#64748B]">listeners/mo</div>
                    </div>
                  </div>

                  {/* Growth badge */}
                  <div
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full mb-5"
                    style={{ backgroundColor: `${C.green}15` }}
                  >
                    <TrendingUp className="w-3.5 h-3.5 text-[#10B981]" />
                    <span className="text-xs font-bold text-[#10B981]">{t.growth} growth with WaveForm</span>
                  </div>

                  <p className="text-[#94A3B8] leading-relaxed mb-6 italic text-sm">
                    "{t.quote}"
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                        style={{ background: `linear-gradient(135deg, ${C.accent}, ${C.accentLight})` }}
                      >
                        {t.avatar}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-[#F8FAFC]">{t.name}</div>
                        <div className="text-xs text-[#64748B]">{t.monthlyListeners}</div>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star key={j} className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
                      ))}
                    </div>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          6. STATS MARQUEE
          ===================================================================== */}
      <section className="py-5 border-y border-white/5 overflow-hidden bg-[#0A0A1A]">
        <MarqueeStrip items={MARQUEE_STATS} />
      </section>

      {/* =====================================================================
          7. CTA SECTION
          ===================================================================== */}
      <section id="contact" className="py-32 px-6 relative overflow-hidden">
        {/* BG glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="w-[600px] h-[600px] rounded-full opacity-20 blur-[120px]"
            style={{ background: `radial-gradient(circle, ${C.accent}, transparent 70%)` }}
          />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <Reveal>
            {/* EQ bars above CTA */}
            <div className="flex justify-center mb-10">
              <AnimatedEQ barCount={16} color={C.accent} height={60} />
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
              Start your podcast <span style={{ color: C.accent }}>in 5 minutes</span>
            </h2>
            <p className="text-lg text-[#64748B] mb-10 max-w-xl mx-auto">
              No experience required. WaveForm handles the tech, you handle the content.
              Your audience is waiting.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/templates/impact-34/pricing">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full sm:w-auto px-10 py-5 rounded-2xl text-white font-black text-base shadow-[0_8px_40px_rgba(249,115,22,0.4)] hover:shadow-[0_16px_56px_rgba(249,115,22,0.5)] transition-all"
                  style={{ backgroundColor: C.accent }}
                >
                  Start Free — No Credit Card
                </motion.button>
              </Link>
              <Link href="/templates/impact-34/pricing">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  className="w-full sm:w-auto px-10 py-5 rounded-2xl font-bold text-base border border-white/10 text-[#F8FAFC] hover:bg-white/5 transition-all"
                >
                  See Pricing Plans
                </motion.button>
              </Link>
            </div>
            <p className="text-sm text-[#475569] mt-6">
              Join 50,000+ podcasters. Free plan available forever.
            </p>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
