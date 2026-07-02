"use client";
// @ts-nocheck

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import {useRef, useState, useEffect} from 'react'
import Link from "next/link"
import { ArrowRight, Terminal, GitBranch, ExternalLink, ChevronRight, Code2, Star, Zap, Shield, BookOpen, Users, ArrowUpRight } from "lucide-react"
import Image from "next/image"
import { Reveal, ScrollImage, projects, skills, timeline, stats, services, process, testimonials, clients } from "./shared"


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

  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const [activeProject, setActiveProject] = useState(0)

  const heroY = useTransform(scrollYProgress, [0, 0.25], [0, -40])

  
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
    <div ref={containerRef} className="relative w-full overflow-hidden">
      {/* Hero */}
      <section className="min-h-screen flex items-center relative overflow-hidden pt-20">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 bg-[#00F5D4]/5 rounded-full blur-3xl" />
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `linear-gradient(rgba(0,245,212,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,212,1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px"
          }} />
        </div>
        <motion.div style={{ y: heroY }} className="max-w-6xl mx-auto px-6 relative w-full">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-[#00F5D4] text-xs mb-4">
            <span className="text-[#475569]">$ </span>whoami
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-bold leading-[1.1] mb-6"
            style={{ fontSize: "clamp(42px, 8vw, 96px)" }}
          >{c?.heroHeadline ?? <>
            // Raphaël Genet
          </>}</motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-2 mb-10 text-[#475569] text-base md:text-lg"
          >
            <div><span className="text-[#00F5D4]">const </span>role = <span className="text-emerald-400">"Staff Engineer & Open Source"</span></div>
            <div><span className="text-[#00F5D4]">const </span>location = <span className="text-emerald-400">"Paris, France"</span></div>
            <div><span className="text-[#00F5D4]">const </span>available = <span className="text-emerald-400">"Q3 2026 contracts"</span></div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-4 mb-16"
          >
            <Link href="/templates/impact-29/work" className="bg-[#00F5D4] text-[#0A0E1A] font-bold text-sm px-6 py-3 hover:bg-[#00E5C4] transition-colors flex items-center gap-2 cursor-pointer border border-[#00F5D4]">
              view work() <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="border border-[#00F5D4]/30 text-[#00F5D4] text-sm px-6 py-3 hover:bg-[#00F5D4]/10 transition-colors flex items-center gap-2 cursor-pointer">
              <GitBranch className="w-4 h-4" /> github/glitchdev
            </a>
          </motion.div>

          {/* Terminal widget */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="bg-[#0D1323] border border-[#00F5D4]/20 rounded-lg overflow-hidden max-w-2xl"
          >
            <div className="flex items-center gap-2 px-4 py-3 bg-[#0F1729] border-b border-[#00F5D4]/10">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
              <span className="text-xs text-[#475569] ml-2">glitch.dev — terminal</span>
            </div>
            <div className="p-4 text-sm space-y-2">
              {[
                { p: "$ ", t: "git clone https://github.com/glitchdev/vaultkey", c: "text-[#00F5D4]" },
                { p: "✓ ", t: "Cloned in 0.8s", c: "text-emerald-400" },
                { p: "$ ", t: "cd vaultkey && cargo build --release", c: "text-[#00F5D4]" },
                { p: "  ", t: "Compiling vaultkey v2.1.0 (target/release)", c: "text-[#475569]" },
                { p: "✓ ", t: "Built in 4.2s (3.4k stars on GitHub)", c: "text-emerald-400" },
              ].map((line, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.2 + i * 0.2 }} className="flex">
                  <span className={`${line.c} mr-2 shrink-0`}>{line.p}</span>
                  <span className="text-[#94A3B8]">{line.t}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Selected Work Section */}
      <section className="py-24 px-6 border-t border-[#00F5D4]/10">
        <div className="max-w-6xl mx-auto">
          <Reveal className="mb-12">
            <div className="flex items-end justify-between">
              <div>
                <div className="text-[#00F5D4] text-xs mb-2"><span className="text-[#475569]">// </span>selected_projects</div>
                <h2 className="font-bold text-3xl md:text-4xl">Featured Open Source</h2>
              </div>
              <Link href="/templates/impact-29/work" className="text-xs font-bold text-[#00F5D4] hover:underline flex items-center gap-1">
                View all projects <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </Reveal>
          <div className="flex gap-2 mb-8 flex-wrap">
            {projects.map((p, i) => (
              <button
                key={p.name}
                onClick={() => setActiveProject(i)}
                className={`px-4 py-2 text-sm font-semibold transition-all cursor-pointer border ${
                  activeProject === i
                    ? "bg-[#00F5D4] text-[#0A0E1A] border-[#00F5D4]"
                    : "border-[#00F5D4]/20 text-[#475569] hover:border-[#00F5D4]/50 hover:text-[#E2E8F0]"
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeProject}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
            >
              <ScrollImage
                src={projects[activeProject].img}
                alt={projects[activeProject].name}
                width={800}
                height={500}
                className="w-full aspect-video border border-[#00F5D4]/20"
                dir={activeProject % 2 === 0 ? 1 : -1}
              />
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-2xl font-bold text-[#00F5D4]">{projects[activeProject].name}</h3>
                  <div className="text-yellow-400 text-sm">★ {projects[activeProject].stars}</div>
                </div>
                <p className="text-[#94A3B8] mb-6 leading-relaxed">{c?.heroSubline ?? fd?.tagline ?? <>{projects[activeProject].desc}</>}</p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {projects[activeProject].stack.map(s => (
                    <span key={s} className="border border-[#00F5D4]/20 text-[#00F5D4] text-xs px-3 py-1.5">{s}</span>
                  ))}
                </div>
                <div className="flex gap-4">
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-[#00F5D4] hover:opacity-70 transition-opacity cursor-pointer">
                    <GitBranch className="w-4 h-4" /> View source
                  </a>
                  <Link href="/templates/impact-29/work" className="flex items-center gap-2 text-sm text-[#94A3B8] hover:text-[#E2E8F0] transition-colors cursor-pointer">
                    <ExternalLink className="w-4 h-4" /> Quick setup instructions
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-24 px-6 bg-[#0D1323] border-t border-b border-[#00F5D4]/10">
        <div className="max-w-6xl mx-auto">
          <Reveal className="mb-12">
            <div className="flex items-end justify-between">
              <div>
                <div className="text-[#00F5D4] text-xs mb-2"><span className="text-[#475569]">// </span>tech_stack</div>
                <h2 className="font-bold text-3xl md:text-4xl">Skills & Systems</h2>
              </div>
              <Link href="/templates/impact-29/skills" className="text-xs font-bold text-[#00F5D4] hover:underline flex items-center gap-1">
                Launch Shell Simulator <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {skills.map((s, i) => (
              <Reveal key={s.cat} delay={i * 0.1}>
                <div className="border border-[#00F5D4]/10 p-6 hover:border-[#00F5D4]/30 transition-colors">
                  <div className="text-[#00F5D4] text-xs mb-4 uppercase tracking-widest">{s.cat}</div>
                  <ul className="space-y-2">
                    {s.items.map(item => (
                      <li key={item} className="flex items-center gap-2 text-sm text-[#94A3B8]">
                        <ChevronRight className="w-3 h-3 text-[#00F5D4] shrink-0" />
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

      {/* Environment Gallery */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal className="mb-12">
            <div className="text-[#00F5D4] text-xs mb-2"><span className="text-[#475569]">// </span>the_setup</div>
            <h2 className="font-bold text-3xl">Work Environment</h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ScrollImage src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop&crop=center" alt="Code" width={600} height={400} className="w-full aspect-video" dir={-1} yRange={40} />
            <ScrollImage src="https://images.unsplash.com/photo-1537432376769-00f5c2f4c8d2?w=600&h=400&fit=crop&crop=center" alt="Terminal" width={600} height={400} className="w-full aspect-video mt-8" dir={1} yRange={40} />
            <ScrollImage src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop&crop=center" alt="Monitor" width={600} height={400} className="w-full aspect-video" dir={-1} yRange={40} />
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-24 px-6 bg-[#0D1323] border-t border-[#00F5D4]/10">
        <div className="max-w-6xl mx-auto">
          <Reveal className="mb-12">
            <div className="flex items-end justify-between">
              <div>
                <div className="text-[#00F5D4] text-xs mb-2"><span className="text-[#475569]">// </span>career_timeline</div>
                <h2 className="font-bold text-3xl md:text-4xl">Experience</h2>
              </div>
              <Link href="/templates/impact-29/timeline" className="text-xs font-bold text-[#00F5D4] hover:underline flex items-center gap-1">
                View Full Architecture Impact <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </Reveal>
          <div className="relative border-l border-[#00F5D4]/20 pl-8 space-y-10">
            {timeline.slice(0, 3).map((t, i) => (
              <Reveal key={t.year} delay={i * 0.1}>
                <div className="relative">
                  <div className="absolute -left-[2.6rem] w-3 h-3 border-2 border-[#00F5D4] bg-[#0D1323] rounded-full" />
                  <div className="text-[#00F5D4] text-xs mb-2">{t.year}</div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-lg">{t.role}</h3>
                    <span className="text-[#475569] text-sm">@ {t.co}</span>
                  </div>
                  <p className="text-[#94A3B8] text-sm leading-relaxed">{t.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS TICKER ── */}
      <section className="py-16 px-6 border-t border-[#00F5D4]/10 overflow-hidden">
        <Reveal className="max-w-6xl mx-auto mb-8">
          <div className="text-[#00F5D4] text-xs"><span className="text-[#475569]">// </span>by_the_numbers</div>
        </Reveal>
        <div className="relative">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#0A0E1A] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#0A0E1A] to-transparent z-10 pointer-events-none" />
          <motion.div
            className="flex gap-8"
            animate={{ x: [0, -1800] }}
            transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
            style={{ width: "max-content" }}
          >
            {[...stats, ...stats, ...stats].map((s, i) => (
              <div key={i} className="flex items-center gap-6 shrink-0">
                <div className="border border-[#00F5D4]/20 bg-[#0D1323] px-6 py-4 min-w-[200px]">
                  <div className="text-[#00F5D4] text-2xl font-bold">{s.value}</div>
                  <div className="text-[#94A3B8] text-xs mt-1">{s.label}</div>
                  <div className="text-[#475569] text-xs mt-0.5">{s.detail}</div>
                </div>
                <div className="text-[#00F5D4]/20 text-lg select-none">{"///"}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── SERVICES DEEP-DIVE ── */}
      <section className="py-24 px-6 bg-[#0D1323] border-t border-[#00F5D4]/10">
        <div className="max-w-6xl mx-auto">
          <Reveal className="mb-12">
            <div className="text-[#00F5D4] text-xs mb-2"><span className="text-[#475569]">// </span>what_i_do</div>
            <div className="flex items-end justify-between flex-wrap gap-4">
              <h2 className="font-bold text-3xl md:text-4xl">Services</h2>
              <Link href="/templates/impact-29/contact" className="text-xs font-bold text-[#00F5D4] hover:underline flex items-center gap-1 cursor-pointer">
                Get a quote <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((svc, i) => (
              <Reveal key={svc.id} delay={i * 0.08}>
                <div className="border border-[#00F5D4]/15 p-8 hover:border-[#00F5D4]/40 transition-all group cursor-default h-full flex flex-col">
                  <div className="flex items-start justify-between mb-6">
                    <div className="text-[#475569] text-xs font-bold">{svc.id}</div>
                    <div className="text-[#00F5D4] text-xs font-bold border border-[#00F5D4]/30 px-3 py-1">{svc.rate}</div>
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-[#00F5D4] transition-colors">{svc.name}</h3>
                  <div className="text-[#00F5D4] text-xs mb-4">{svc.short}</div>
                  <p className="text-[#94A3B8] text-sm leading-relaxed mb-6 flex-1">{svc.body}</p>
                  <div className="flex flex-wrap gap-2">
                    {svc.tags.map(tag => (
                      <span key={tag} className="text-xs border border-[#00F5D4]/20 text-[#475569] px-2.5 py-1">{tag}</span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESS STEPS ── */}
      <section className="py-24 px-6 border-t border-[#00F5D4]/10">
        <div className="max-w-6xl mx-auto">
          <Reveal className="mb-12">
            <div className="text-[#00F5D4] text-xs mb-2"><span className="text-[#475569]">// </span>how_it_works</div>
            <h2 className="font-bold text-3xl md:text-4xl">Engagement Process</h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0">
            {process.map((step, i) => (
              <Reveal key={step.step} delay={i * 0.1}>
                <div className="border border-[#00F5D4]/15 p-8 border-r-0 last:border-r border-b md:border-b-0 relative hover:bg-[#0D1323] transition-colors">
                  {/* Connector dot */}
                  {i < process.length - 1 && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-2 h-2 bg-[#00F5D4] z-10 hidden lg:block" />
                  )}
                  <div className="text-[#00F5D4] font-bold text-xs mb-6">{step.step}</div>
                  <h3 className="font-bold text-sm mb-3 text-[#E2E8F0]">{step.name}</h3>
                  <p className="text-[#94A3B8] text-xs leading-relaxed">{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 px-6 bg-[#0D1323] border-t border-[#00F5D4]/10">
        <div className="max-w-6xl mx-auto">
          <Reveal className="mb-12">
            <div className="text-[#00F5D4] text-xs mb-2"><span className="text-[#475569]">// </span>social_proof</div>
            <h2 className="font-bold text-3xl md:text-4xl">What engineers say</h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.08}>
                <div className="border border-[#00F5D4]/15 p-8 hover:border-[#00F5D4]/30 transition-colors h-full flex flex-col">
                  <div className="text-[#00F5D4] text-lg mb-6 select-none">&ldquo;</div>
                  <blockquote className="text-[#E2E8F0] text-sm leading-relaxed flex-1 mb-8">{t.quote}</blockquote>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-[#00F5D4]/20 shrink-0">
                      <Image src={t.avatar} alt={t.name} width={40} height={40} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#E2E8F0]">{t.name}</div>
                      <div className="text-xs text-[#475569]">{t.role}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CLIENTS LOGOS ── */}
      <section className="py-20 px-6 border-t border-[#00F5D4]/10">
        <div className="max-w-6xl mx-auto">
          <Reveal className="mb-12 text-center">
            <div className="text-[#00F5D4] text-xs mb-2"><span className="text-[#475569]">// </span>previous_employers_and_clients</div>
            <p className="text-[#475569] text-sm">Companies I've shipped production code for</p>
          </Reveal>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-px bg-[#00F5D4]/10">
            {clients.map((c, i) => (
              <Reveal key={c.name} delay={i * 0.04}>
                <div className="bg-[#0A0E1A] flex items-center justify-center py-8 px-4 hover:bg-[#0D1323] transition-colors group cursor-default">
                  <span className="text-[#475569] text-xs font-bold tracking-widest group-hover:text-[#00F5D4] transition-colors">{c.logo}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── WORK/PROJECTS PREVIEW GRID ── */}
      <section className="py-24 px-6 bg-[#0D1323] border-t border-[#00F5D4]/10">
        <div className="max-w-6xl mx-auto">
          <Reveal className="mb-12">
            <div className="flex items-end justify-between flex-wrap gap-4">
              <div>
                <div className="text-[#00F5D4] text-xs mb-2"><span className="text-[#475569]">// </span>all_projects</div>
                <h2 className="font-bold text-3xl md:text-4xl">Recent Builds</h2>
              </div>
              <Link href="/templates/impact-29/work" className="text-xs font-bold text-[#00F5D4] hover:underline flex items-center gap-1 cursor-pointer">
                Full project catalogue <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                name: "vaultkey",
                year: "2023",
                category: "Security",
                img: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=600&h=400&fit=crop&crop=center",
                stars: "3.4k",
              },
              {
                name: "noctua.dev",
                year: "2024",
                category: "Collaboration",
                img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop&crop=center",
                stars: "2.1k",
              },
              {
                name: "axon-query",
                year: "2023",
                category: "Infrastructure",
                img: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&h=400&fit=crop&crop=center",
                stars: "1.2k",
              },
            ].map((p, i) => (
              <Reveal key={p.name} delay={i * 0.1}>
                <Link href="/templates/impact-29/work" className="group block border border-[#00F5D4]/15 overflow-hidden hover:border-[#00F5D4]/40 transition-all cursor-pointer">
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={p.img}
                      alt={p.name}
                      width={600}
                      height={400}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E1A]/80 to-transparent" />
                    <div className="absolute top-3 right-3 text-xs border border-[#00F5D4]/40 text-[#00F5D4] px-2 py-1 bg-[#0A0E1A]/80">{p.year}</div>
                    <div className="absolute bottom-3 left-3 text-yellow-400 text-xs font-bold">★ {p.stars}</div>
                  </div>
                  <div className="p-5">
                    <div className="text-[#475569] text-xs mb-1">{p.category}</div>
                    <div className="font-bold text-[#E2E8F0] group-hover:text-[#00F5D4] transition-colors flex items-center gap-2">
                      {p.name}
                      <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-24 px-6 border-t border-[#00F5D4]/10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `linear-gradient(rgba(0,245,212,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,212,1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px"
        }} />
        <div className="absolute top-1/2 left-1/2 w-[800px] h-[400px] -translate-x-1/2 -translate-y-1/2 bg-[#00F5D4]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative">
          <Reveal>
            <div className="text-[#00F5D4] text-xs mb-4"><span className="text-[#475569]">// </span>next_step</div>
            <h2 className="font-bold leading-tight mb-6" style={{ fontSize: "clamp(32px, 6vw, 72px)" }}>{c?.aboutTitle ?? fd?.businessName ?? <>
              Ready to ship something great?
            </>}</h2>
            <p className="text-[#94A3B8] text-lg mb-10 leading-relaxed max-w-xl mx-auto">{c?.aboutText ?? <>
              I take on 1–2 focused engagements per quarter. If your timeline fits, let's figure out if we're a match.
            </>}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/templates/impact-29/contact"
                className="bg-[#00F5D4] text-[#0A0E1A] font-bold text-sm px-8 py-4 hover:bg-[#00E5C4] transition-colors flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center"
              >
                Start a conversation <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/templates/impact-29/work"
                className="border border-[#00F5D4]/30 text-[#00F5D4] text-sm px-8 py-4 hover:bg-[#00F5D4]/10 transition-colors flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center"
              >
                <Code2 className="w-4 h-4" /> Browse the work
              </Link>
            </div>
            <div className="mt-10 text-xs text-[#475569]">
              <span className="text-[#00F5D4]">const </span>availability = <span className="text-emerald-400">"Q3 2026 — 2 slots remaining"</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="py-32 px-6 border-t border-[#00F5D4]/10">
        <div className="max-w-3xl mx-auto text-center">
          <Reveal>
            <div className="text-[#00F5D4] text-xs mb-4"><span className="text-[#475569]">// </span>get_in_touch</div>
            <h2 className="font-bold text-4xl md:text-5xl mb-6">Let's build something great.</h2>
            <p className="text-[#94A3B8] text-lg mb-10 leading-relaxed">
              Available for staff/principal engineering contracts, technical advisory, and open source. Based in Paris, remote-first.
            </p>
            <div className="space-y-4">
              <a href={`mailto:${fd?.email ?? "hello@aevia.ws"}`} className="block w-full bg-[#00F5D4] text-[#0A0E1A] font-bold text-sm py-4 hover:bg-[#00E5C4] transition-colors cursor-pointer text-center">
                hello@aevia.ws →
              </a>
              <div className="grid grid-cols-2 gap-4">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="border border-[#00F5D4]/20 text-[#00F5D4] text-sm py-4 hover:bg-[#00F5D4]/10 transition-colors cursor-pointer flex items-center justify-center gap-2">
                  <GitBranch className="w-4 h-4" /> GitHub
                </a>
                <Link href="/templates/impact-29/timeline" className="border border-[#00F5D4]/20 text-[#00F5D4] text-sm py-4 hover:bg-[#00F5D4]/10 transition-colors cursor-pointer flex items-center justify-center gap-2">
                  <Code2 className="w-4 h-4" /> Project Impact Summary
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
