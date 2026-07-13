"use client";
// @ts-nocheck

import React, {useState, useEffect, useRef} from 'react';
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, ArrowUpRight, Plus, Minus } from "lucide-react";
import { Reveal, ParallaxImg } from "./shared";

const PROJECTS = [
  {
    name: "The Obsidian Villa",
    loc: "Malibu, CA",
    type: "Residential",
    year: "2024",
    area: "620 m²",
    img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Glass Monolith",
    loc: "Berlin, DE",
    type: "Commercial",
    year: "2024",
    area: "2 400 m²",
    img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Serene Heights",
    loc: "Kyoto, JP",
    type: "Cultural",
    year: "2023",
    area: "1 100 m²",
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Meridian House",
    loc: "Oslo, NO",
    type: "Residential",
    year: "2023",
    area: "480 m²",
    img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop",
  },
];

const SERVICES = [
  {
    num: "01",
    title: "Residential Architecture",
    desc: "Private homes and villas conceived as instruments of pure habitation, calibrated to site and season. We work with a limited number of residential clients per year to ensure uncompromised attention.",
    details: ["Site Analysis", "Concept Design", "Planning Approval", "Construction Documentation", "Site Supervision"],
  },
  {
    num: "02",
    title: "Commercial Design",
    desc: "Workspace environments and flagship buildings that express institutional identity through elemental form. Our commercial practice encompasses offices, galleries, cultural institutions, and mixed-use developments.",
    details: ["Brand Architecture", "Space Programming", "Interior Systems", "Tenant Coordination", "Post-Occupancy Review"],
  },
  {
    num: "03",
    title: "Interiors & Materials",
    desc: "Material studies, spatial sequencing, and bespoke interior programming for each unique commission. We maintain a studio material library of over 800 tested finishes.",
    details: ["Material Curation", "Custom Millwork", "Lighting Design", "Furniture Specification", "Art Integration"],
  },
  {
    num: "04",
    title: "Masterplanning",
    desc: "Large-scale urban interventions and estate planning that subordinate the whole to an overarching organisational logic, creating environments that improve with time.",
    details: ["Site Masterplan", "Infrastructure Strategy", "Phasing", "Landscape Integration", "Community Engagement"],
  },
];

const AWARDS = [
  { year: "2025", title: "Archdaily Building of the Year", category: "Residential" },
  { year: "2024", title: "Wallpaper* Design Award", category: "Architecture" },
  { year: "2024", title: "RIBA International Award", category: "Commercial" },
  { year: "2023", title: "Dezeen Award — Shortlisted", category: "Commercial" },
  { year: "2023", title: "Blueprint Award", category: "Cultural" },
  { year: "2022", title: "Frame Awards — Best Newcomer", category: "Studio" },
];

const STATS = [
  { val: "87", label: "Completed Projects" },
  { val: "23", label: "Countries" },
  { val: "12", label: "Years Practice" },
  { val: "4", label: "RIBA Awards" },
];

const TEAM = [
  {
    name: "Elias Vorn",
    role: "Founding Principal",
    bio: "Trained at the ETH Zürich and the Architectural Association. Elias leads design strategy and maintains relationships with structural engineering consultants across Europe.",
    img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Mara Solis",
    role: "Design Director",
    bio: "Formerly with Herzog & de Meuron. Mara oversees the development of every project from concept through construction administration, with a focus on material authenticity.",
    img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Kenji Arao",
    role: "Technical Director",
    bio: "Structural specialist with a background in parametric engineering. Kenji ensures that the studio's formal ambitions are grounded in rigorous constructional logic.",
    img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=600&auto=format&fit=crop",
  },
];

const PROCESS = [
  { step: "01", title: "Commission", body: "An initial conversation to understand the scope, ambitions, and constraints of the project. We take on only commissions where genuine design innovation is possible." },
  { step: "02", title: "Research", body: "Site analysis, contextual study, material investigation, and programme clarification. This phase typically spans four to six weeks and culminates in a concept brief." },
  { step: "03", title: "Design", body: "Schematic design developed through models, drawings, and material samples. We present three distinct concepts and refine the selected direction iteratively." },
  { step: "04", title: "Documentation", body: "Full construction documentation coordinated with structural, mechanical, and electrical engineers. We produce precise, buildable drawings that anticipate every junction." },
  { step: "05", title: "Construction", body: "Site supervision throughout the construction phase. We conduct weekly reviews with the contractor and issue formal site observation reports." },
  { step: "06", title: "Completion", body: "Post-occupancy evaluation at six months to assess performance against the original brief. We consider a project complete only when the client confirms the space exceeds expectation." },
];

const PRESS = [
  { pub: "Wallpaper*", title: "The Return of the Pure Volume", year: "2024" },
  { pub: "Dezeen", title: "Symmetry Studio's Glass Monolith redefines the Berlin skyline", year: "2024" },
  { pub: "Architectural Digest", title: "Inside the Obsidian Villa: restraint as luxury", year: "2024" },
  { pub: "Frame Magazine", title: "Material Memory: how Symmetry Studio chooses its palette", year: "2023" },
  { pub: "Icon", title: "Elias Vorn: 'We subtract until only the essential remains'", year: "2023" },
];

const FAQS = [
  { q: "What is your minimum project budget?", a: "Our residential projects typically start at £1.2m in construction value. Commercial commissions vary by complexity and scale. We are happy to discuss feasibility during an initial consultation." },
  { q: "Do you work internationally?", a: "Yes. We currently maintain active projects across Europe, Japan, and North America. Our studio is based in London with a satellite office in Zürich." },
  { q: "How long does a typical project take?", a: "A mid-scale residential project runs 18–24 months from commission to completion. Commercial and cultural projects typically take 24–36 months, depending on planning complexity." },
  { q: "Can I visit your studio?", a: "We welcome site visits by appointment. Our material library and model archive are available for viewing during studio hours, Tuesday through Friday." },
];


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function SymmetryStudioPage() {
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

  const basePath = "/templates/impact-80";
  const [openService, setOpenService] = useState<number | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  
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
    <main>
      {/* ── HERO ──────────────────── */}
      <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="relative z-10">
            <Reveal>
              <div className="flex items-center gap-8 mb-12 opacity-20">
                <div className="w-16 h-[1px] bg-black" />
                <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-black italic">
                  Form Follows Light
                </span>
              </div>
            </Reveal>
            <Reveal delay={0.2} y={70}>
              <h1 className="text-7xl md:text-[10rem] font-light tracking-tighter leading-[1.15] text-[#1a1a1a] mb-16 uppercase pb-4">{c?.heroHeadline ?? <>
                Pure <br />{" "}
                <span className="font-bold italic opacity-10">Volume.</span>
              </>}</h1>
            </Reveal>
            <Reveal delay={0.4}>
              <div className="flex flex-col gap-16">
                <p className="text-2xl text-black/40 font-light max-w-lg leading-relaxed italic">{c?.heroSubline ?? fd?.tagline ?? <>
                  Architectural interventions that harmonize human ritual with the
                  absolute geometry of nature.
                </>}</p>
                <div className="flex flex-wrap gap-12">
                  <Link href={`${basePath}/works`}>
                    <button className="px-16 py-6 bg-black text-white font-bold uppercase tracking-widest text-[10px] hover:px-20 transition-all duration-700 shadow-2xl">
                      Examine Portals
                    </button>
                  </Link>
                  <Link href={`${basePath}/identity`}>
                    <button className="px-16 py-6 border border-black/10 text-black/30 font-bold uppercase tracking-widest text-[10px] hover:text-black transition-all flex items-center gap-4">
                      <Compass className="w-4 h-4" /> View Map Of Silence
                    </button>
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.5} y={0}>
            <div className="relative aspect-[4/5] overflow-hidden group">
              <ParallaxImg
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1400&auto=format&fit=crop"
                alt="Architectural Minimal"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all duration-1000" />
            </div>
          </Reveal>
        </div>

        <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end text-[9px] font-bold uppercase tracking-[0.4em] text-black/10 italic">
          <span>STRUCTURE / LIGHT / MATERIALITY / VOID</span>
          <span>EST. 2012</span>
        </div>
      </section>

      {/* ── STATS ─────────────────── */}
      <section className="py-20 bg-[#1a1a1a] border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/5">
            {STATS.map((s, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="px-8 py-6 text-center">
                  <div className="text-5xl md:text-6xl font-light text-white italic tracking-tighter mb-2">{s.val}</div>
                  <div className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/20 italic">{s.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECTS GRID ─────────── */}
      <section className="py-32 bg-[#fcfcfc] border-t border-black/5">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="flex items-end justify-between mb-20 pb-12 border-b border-black/5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-black/20 mb-4 block italic">
                  Archive of Form
                </span>
                <h2 className="text-5xl md:text-7xl font-light uppercase tracking-tighter text-[#1a1a1a] leading-[1.1] italic pb-2">
                  Selected<br />
                  <span className="font-bold opacity-10 not-italic">Work.</span>
                </h2>
              </div>
              <Link
                href={`${basePath}/works`}
                className="hidden md:flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.4em] text-black/20 hover:text-black transition-colors italic"
              >
                Full Archive <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {PROJECTS.map((project, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <Link href={`${basePath}/works`} className="block group cursor-pointer">
                  <div className="relative aspect-video overflow-hidden border border-black/5 p-1 bg-white shadow-xl shadow-black/[0.02] mb-8">
                    <ParallaxImg src={project.img} alt={project.name} />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all duration-1000" />
                    <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-black/40">
                      {project.type}
                    </div>
                    <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-black/40">
                      {project.area} · {project.year}
                    </div>
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-[9px] font-bold uppercase tracking-widest text-black/20 mb-2 italic">
                        Location: {project.loc}
                      </div>
                      <h3 className="text-2xl font-bold uppercase tracking-tighter text-black italic group-hover:translate-x-2 transition-transform duration-700">
                        {project.name}
                      </h3>
                    </div>
                    <div className="w-10 h-10 rounded-full border border-black/5 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-700 flex-shrink-0">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PHILOSOPHY ────────────── */}
      <section className="py-40 bg-white border-t border-black/5 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal>
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-black/20 mb-16 block italic">
              Manifesto // Core Doctrine
            </span>
          </Reveal>
          <Reveal delay={0.1} y={60}>
            <blockquote className="text-5xl md:text-7xl lg:text-8xl font-light uppercase tracking-tighter leading-[1.05] text-[#1a1a1a] mb-20 italic">
              "We subtract until only the{" "}
              <span className="font-bold opacity-20 not-italic">essential</span>{" "}
              remains."
            </blockquote>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 pt-20 border-t border-black/5">
            {[
              { title: "Light", body: "Every space is designed from its light source outward. Natural illumination is the primary material — all structure serves it." },
              { title: "Materiality", body: "Raw concrete, unfinished oak, and oxidized copper. We select materials for their capacity to age with grace and accumulate meaning." },
              { title: "Void", body: "The absence of form is form. Empty space is designed with the same rigour as occupied volume." },
            ].map((item, i) => (
              <Reveal key={i} delay={0.15 + i * 0.1}>
                <div>
                  <div className="w-8 h-[1px] bg-black/20 mb-6" />
                  <h4 className="text-sm font-bold uppercase tracking-[0.4em] text-black/40 mb-4 italic">
                    {item.title}
                  </h4>
                  <p className="text-sm text-black/30 font-light leading-relaxed italic">
                    {item.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES (accordion) ──── */}
      <section className="py-32 bg-[#fcfcfc] border-t border-black/5">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal>
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-black/20 mb-6 block italic">
              Services // Expertise
            </span>
            <h2 className="text-5xl md:text-6xl font-light uppercase tracking-tighter text-[#1a1a1a] mb-20 italic pb-2 leading-[1.1]">
              What we<br />
              <span className="font-bold opacity-10 not-italic">build.</span>
            </h2>
          </Reveal>

          <div className="divide-y divide-black/5">
            {SERVICES.map((svc, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div
                  className="py-10 group cursor-pointer -mx-6 px-6 hover:bg-white/60 transition-colors"
                  onClick={() => setOpenService(openService === i ? null : i)}
                >
                  <div className="grid grid-cols-12 gap-8 items-start">
                    <div className="col-span-1 text-[10px] font-bold text-black/10 italic uppercase tracking-widest pt-1">
                      {svc.num}
                    </div>
                    <div className="col-span-9 md:col-span-10">
                      <h3 className="text-2xl md:text-3xl font-light uppercase tracking-tighter text-[#1a1a1a] italic mb-0 group-hover:translate-x-2 transition-transform duration-700">
                        {svc.title}
                      </h3>
                    </div>
                    <div className="col-span-2 md:col-span-1 flex justify-end">
                      <div className="w-8 h-8 border border-black/10 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-500">
                        {openService === i ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                      </div>
                    </div>
                  </div>
                  <AnimatePresence>
                    {openService === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="pt-8 grid grid-cols-1 md:grid-cols-2 gap-12 pl-12">
                          <p className="text-sm text-black/30 font-light leading-relaxed italic">{svc.desc}</p>
                          <ul className="space-y-2">
                            {svc.details.map((d, j) => (
                              <li key={j} className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-black/20 italic">
                                <div className="w-4 h-[1px] bg-black/10" />{d}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESS ───────────────── */}
      <section className="py-32 bg-white border-t border-black/5">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal>
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-black/20 mb-6 block italic">
              Method // Process
            </span>
            <h2 className="text-5xl md:text-6xl font-light uppercase tracking-tighter text-[#1a1a1a] mb-20 italic pb-2 leading-[1.1]">
              How we<br />
              <span className="font-bold opacity-10 not-italic">work.</span>
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-20">
            {PROCESS.map((p, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.5em] text-black/10 italic mb-6">{p.step}</div>
                  <div className="w-full h-[1px] bg-black/5 mb-6" />
                  <h4 className="text-xl font-light uppercase tracking-tighter text-[#1a1a1a] italic mb-4">{p.title}</h4>
                  <p className="text-sm text-black/30 font-light leading-relaxed italic">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ──────────────────── */}
      <section className="py-32 bg-[#fcfcfc] border-t border-black/5">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal>
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-black/20 mb-6 block italic">
              People // Studio
            </span>
            <h2 className="text-5xl md:text-6xl font-light uppercase tracking-tighter text-[#1a1a1a] mb-20 italic pb-2 leading-[1.1]">
              The studio.
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {TEAM.map((member, i) => (
              <Reveal key={i} delay={i * 0.12}>
                <div className="group">
                  <div className="relative aspect-[3/4] overflow-hidden mb-8 grayscale group-hover:grayscale-0 transition-all duration-1000">
                    <Image src={member.img} alt={member.name} fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-all duration-1000" />
                  </div>
                  <div className="text-[9px] font-bold uppercase tracking-widest text-black/20 italic mb-2">{member.role}</div>
                  <h3 className="text-xl font-light uppercase tracking-tighter text-[#1a1a1a] italic mb-4">{member.name}</h3>
                  <p className="text-sm text-black/30 font-light leading-relaxed italic">{member.bio}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.3}>
            <div className="mt-20 pt-12 border-t border-black/5 flex justify-end">
              <Link
                href={`${basePath}/identity`}
                className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.4em] text-black/20 hover:text-black transition-colors italic"
              >
                Full Studio Profile <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── AWARDS ────────────────── */}
      <section className="py-32 bg-white border-t border-black/5">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal>
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-black/20 mb-6 block italic">
              Recognition // Awards
            </span>
            <h2 className="text-5xl md:text-6xl font-light uppercase tracking-tighter text-[#1a1a1a] mb-20 italic pb-2 leading-[1.1]">
              Honours.
            </h2>
          </Reveal>
          <div className="divide-y divide-black/5">
            {AWARDS.map((award, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="py-10 flex items-center gap-12 group">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-black/10 italic w-12 flex-shrink-0">
                    {award.year}
                  </span>
                  <div className="flex-1">
                    <h3 className="text-xl font-light uppercase tracking-tighter text-[#1a1a1a] italic group-hover:translate-x-2 transition-transform duration-700">
                      {award.title}
                    </h3>
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-black/10 italic flex-shrink-0">
                    {award.category}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRESS ─────────────────── */}
      <section className="py-32 bg-[#fcfcfc] border-t border-black/5">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal>
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-black/20 mb-6 block italic">
              Press // Publications
            </span>
            <h2 className="text-5xl md:text-6xl font-light uppercase tracking-tighter text-[#1a1a1a] mb-20 italic pb-2 leading-[1.1]">
              As seen<br />
              <span className="font-bold opacity-10 not-italic">in.</span>
            </h2>
          </Reveal>
          <div className="divide-y divide-black/5">
            {PRESS.map((item, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="py-8 flex items-center gap-12 group cursor-pointer">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-black/10 italic w-28 flex-shrink-0">{item.pub}</span>
                  <div className="flex-1 text-lg font-light uppercase tracking-tighter text-[#1a1a1a]/40 italic group-hover:text-[#1a1a1a] transition-colors duration-500">
                    {item.title}
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-black/10 italic flex-shrink-0">{item.year}</span>
                  <ArrowUpRight className="w-4 h-4 text-black/10 group-hover:text-black transition-colors duration-500 flex-shrink-0" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────── */}
      <section className="py-32 bg-white border-t border-black/5">
        <div className="max-w-[900px] mx-auto px-6 md:px-12">
          <Reveal>
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-black/20 mb-6 block italic">
              Questions // Answers
            </span>
            <h2 className="text-5xl font-light uppercase tracking-tighter text-[#1a1a1a] mb-20 italic pb-2 leading-[1.1]">
              Common<br />
              <span className="font-bold opacity-10 not-italic">enquiries.</span>
            </h2>
          </Reveal>
          <div className="divide-y divide-black/5">
            {FAQS.map((faq, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div
                  className="py-8 cursor-pointer group"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <div className="flex items-start justify-between gap-8">
                    <h4 className="text-base font-light uppercase tracking-tighter text-[#1a1a1a]/60 italic group-hover:text-[#1a1a1a] transition-colors duration-300 flex-1">
                      {faq.q}
                    </h4>
                    <div className="w-6 h-6 border border-black/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      {openFaq === i ? <Minus className="w-3 h-3 text-black/40" /> : <Plus className="w-3 h-3 text-black/20" />}
                    </div>
                  </div>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="pt-6 text-sm text-black/30 font-light leading-relaxed italic max-w-xl">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT CTA ───────────── */}
      <section className="py-40 bg-[#1a1a1a] relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 text-center relative z-10">
          <Reveal>
            <div className="flex items-center justify-center gap-8 mb-16 opacity-20">
              <div className="w-16 h-[1px] bg-white" />
              <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-white italic">
                Initiate a Commission
              </span>
              <div className="w-16 h-[1px] bg-white" />
            </div>
            <h2 className="text-6xl md:text-8xl lg:text-[9rem] font-light uppercase tracking-tighter text-white leading-[1.05] mb-12 italic pb-4">{c?.aboutTitle ?? fd?.businessName ?? <>
              Build The<br />
              <span className="font-bold opacity-10 not-italic">Absolute.</span>
            </>}</h2>
            <p className="max-w-lg mx-auto text-lg text-white/30 font-light leading-relaxed italic mb-16">{c?.aboutText ?? <>
              We accept a limited number of commissions each cycle to ensure the
              structural integrity and conceptual purity of every space.
            </>}</p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="flex flex-col sm:flex-row gap-8 justify-center">
              <Link href={`${basePath}/contact`}>
                <button className="px-16 py-6 bg-white text-black font-bold uppercase tracking-widest text-[10px] hover:px-20 transition-all duration-700 shadow-2xl">
                  Initiate Project
                </button>
              </Link>
              <Link href={`${basePath}/works`}>
                <button className="px-16 py-6 border border-white/10 text-white/30 font-bold uppercase tracking-widest text-[10px] hover:text-white hover:border-white transition-all flex items-center gap-4">
                  <Compass className="w-4 h-4" /> View All Work
                </button>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
