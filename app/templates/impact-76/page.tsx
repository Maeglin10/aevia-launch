"use client";
// @ts-nocheck

import { motion, useScroll, useTransform } from "framer-motion";
import {useRef, useState, useEffect} from 'react';
import Image from "next/image";
import Link from "next/link";
import { Compass, ArrowUpRight, Mail } from "lucide-react";
import { Reveal, MagneticBtn, Counter } from "./shared";

const ARCHIVE_PROJECTS = [
  {
    id: 1,
    title: "VILLA_AETHER",
    location: "Swiss Alps, CH",
    year: "2025",
    type: "Residential",
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "KINETIC_TOWER",
    location: "Dubai, UAE",
    year: "2024",
    type: "Commercial",
    img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "VOID_STUDIO",
    location: "Tokyo, JP",
    year: "2026",
    type: "Cultural",
    img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "MERIDIAN_HOUSE",
    location: "Oslo, NO",
    year: "2023",
    type: "Residential",
    img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 5,
    title: "OBSIDIAN_GATE",
    location: "Seoul, KR",
    year: "2022",
    type: "Commercial",
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
  },
];

const SERVICES = [
  {
    code: "SVC_01",
    title: "Residential Architecture",
    desc: "Private villas, retreats, and luxury residences designed for inhabitation at the intersection of structure and landscape.",
  },
  {
    code: "SVC_02",
    title: "Commercial Design",
    desc: "High-performance commercial towers, adaptive-facade office systems, and branded flagship environments.",
  },
  {
    code: "SVC_03",
    title: "Cultural & Public",
    desc: "Museums, civic institutions, and cultural pavilions that reconfigure the relationship between community and built space.",
  },
];

const STATS = [
  { value: 12, suffix: " ans", label: "D'expertise" },
  { value: 47, suffix: "", label: "Projets livrés" },
  { value: 8, suffix: " pays", label: "D'opérations" },
  { value: 3, suffix: "", label: "Prix internationaux" },
];

const TEAM = [
  {
    name: "Elias Vorne",
    role: "Principal Architect",
    specialty: "Computational Design / Parametric Structures",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
  },
  {
    name: "Naomi Sato",
    role: "Design Director",
    specialty: "Cultural Institutions / Material Research",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop",
  },
  {
    name: "Daan Mulder",
    role: "Technical Lead",
    specialty: "Structural Engineering / Sustainability Systems",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
  },
];


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
// Client-uploaded photo at index i, falling back to the template's stock
// photo when the client did not upload one for that slot.
function photo(i: number, fallback: string): string {
  return fd?.photoUrls?.[i] || fallback;
}
export default function StructuraArchPage() {
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

  useEffect(() => {
    if (!fd?.photoUrls?.length) return;
    let n = 1;
    const _photoArrays: any[] = [ARCHIVE_PROJECTS, TEAM];
    _photoArrays.forEach((arr) => {
      if (!Array.isArray(arr)) return;
      arr.forEach((item) => {
        if (!item || typeof item !== "object") return;
        for (const key of ["img", "src", "image", "imgSrc", "photo"]) {
          if (typeof item[key] === "string" && item[key].includes("images.unsplash.com")) {
            if (fd.photoUrls[n]) item[key] = fd.photoUrls[n];
            n++;
          }
        }
      });
    });
  });
  c = session?.generatedContent;
  brand = fd?.brandColor ?? null; // null = keep template's original color

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
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
          1. HERO (Architecture Cinematic)
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
            src={photo(0, "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1600&auto=format&fit=crop")}
            alt="Structura Hero"
            fill
            className="object-cover brightness-50 grayscale-[0.5]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent" />
        </motion.div>

        {/* GLASSMOPHISM HUD ELEMENT */}
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <motion.div
            animate={{ rotate: [0, 1, 0] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="w-[80vw] h-[80vw] border border-white/5 rounded-full absolute"
          />
          <motion.div
            animate={{ rotate: [0, -1, 0] }}
            transition={{ duration: 15, repeat: Infinity }}
            className="w-[60vw] h-[60vw] border border-white/5 rounded-full absolute"
          />
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 w-full">
          <Reveal>
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-md rounded-none border border-white/10 text-white/40 text-[10px] font-bold uppercase tracking-widest mb-10 shadow-sm">
              <Compass className="w-3.5 h-3.5" />
              Structural Intelligence // Generative Design
            </div>
            <h1 className="text-7xl md:text-9xl lg:text-[11rem] font-black leading-[1.15] tracking-tighter mb-12 uppercase pb-6">{c?.heroHeadline ?? <>
              Void & <br />{" "}
              <span className="text-stone-500 italic">Volume.</span>
            </>}</h1>
            <p className="max-w-xl text-lg md:text-xl text-white/20 leading-relaxed font-bold mb-12 uppercase tracking-tight italic">{c?.heroSubline ?? fd?.tagline ?? <>
              Redefining the relationship between structure and environment.
              Pushing the limits of computational architecture.
            </>}</p>
            <div className="flex flex-col sm:flex-row gap-6">
              <Link href="/templates/impact-76/archive">
                <MagneticBtn className="px-12 py-5 bg-white text-black text-[10px] font-bold uppercase tracking-[0.4em] rounded-none hover:bg-stone-200 transition-all cursor-pointer shadow-2xl">
                  View Projects
                </MagneticBtn>
              </Link>
              <Link href="/templates/impact-76/process">
                <button className="px-12 py-5 border border-white/10 text-white text-[10px] font-bold uppercase tracking-[0.4em] rounded-none hover:bg-white hover:text-black transition-all cursor-pointer">
                  Technical_Audit
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
              AEVIA_STRUCTURA // CORE_SYS_076
            </span>
            <div className="w-32 h-[1px] bg-white/10" />
          </div>
        </motion.div>
      </section>

      {/* ==========================================
          2. PROJECTS ARCHIVE
          ========================================== */}
      <section className="py-32 bg-[#0a0a0c] border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="flex items-end justify-between mb-20">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-stone-500 mb-4 block">
                  PROJECT_ARCHIVE // 2022–2026
                </span>
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic text-white leading-[1.1] pb-2">
                  Selected<br />
                  <span className="text-stone-500">Work.</span>
                </h2>
              </div>
              <Link href="/templates/impact-76/archive" className="hidden md:flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.4em] text-white/20 hover:text-white transition-colors">
                Full Archive <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
            {ARCHIVE_PROJECTS.map((project, i) => (
              <Reveal key={project.id} delay={i * 0.08}>
                <div className="group relative bg-[#0a0a0c] overflow-hidden cursor-pointer">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={project.img}
                      alt={project.title}
                      fill
                      className="object-cover brightness-60 grayscale-[0.4] group-hover:scale-105 group-hover:grayscale-0 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent" />
                    <div className="absolute top-4 right-4 bg-white/5 backdrop-blur-md border border-white/10 px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-white/50">
                      {project.type}
                    </div>
                  </div>
                  <div className="p-8 border-t border-white/5">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.4em] mb-2">
                          {project.location} · {project.year}
                        </p>
                        <h3 className="text-xl font-black uppercase tracking-tighter text-white group-hover:text-stone-400 transition-colors">
                          {project.title}
                        </h3>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-white/10 group-hover:text-stone-500 transition-colors mt-1" />
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          3. PHILOSOPHY STATEMENT
          ========================================== */}
      <section className="py-40 bg-[#0e0e11] border-t border-white/5 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal>
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-stone-500 mb-16 block">
              MANIFESTO // CORE_DOCTRINE
            </span>
          </Reveal>
          <Reveal delay={0.1} y={50}>
            <blockquote className="text-5xl md:text-7xl lg:text-8xl font-black uppercase italic tracking-tighter leading-[1.05] text-white mb-20">
              "We do not build structures.<br />
              We engineer{" "}
              <span className="text-stone-500">absences</span>."
            </blockquote>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 pt-16 border-t border-white/5">
            {[
              { title: "Precision", body: "Every millimeter calculated through generative algorithms for structural peak efficiency. No element without computational intent." },
              { title: "Entropy", body: "Embracing the natural aging of raw materials. Concrete, steel, and glass in perpetual dialogue with time and climate." },
              { title: "Sustenance", body: "Autonomous energy systems. Passive cooling. Reclaimed water cycles. Zero-carbon targets on every commission." },
            ].map((item, i) => (
              <Reveal key={i} delay={0.15 + i * 0.1}>
                <div>
                  <div className="w-8 h-[1px] bg-stone-500 mb-6" />
                  <h4 className="text-sm font-black uppercase tracking-[0.4em] text-white mb-4">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-white/30 uppercase tracking-widest leading-relaxed font-bold italic">
                    {item.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          4. SERVICES
          ========================================== */}
      <section className="py-32 bg-[#0a0a0c] border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal>
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-stone-500 mb-6 block">
              SERVICE_MATRIX // ACTIVE
            </span>
            <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter italic text-white mb-20 leading-[1.1] pb-2">
              Expertise.
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5">
            {SERVICES.map((svc, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="bg-[#0a0a0c] p-10 group hover:bg-[#0e0e11] transition-colors border-t-2 border-transparent hover:border-stone-500">
                  <span className="text-[9px] font-black text-stone-500/50 uppercase tracking-[0.5em] mb-6 block">
                    {svc.code}
                  </span>
                  <h3 className="text-2xl font-black uppercase tracking-tighter text-white mb-6">
                    {svc.title}
                  </h3>
                  <p className="text-[11px] text-white/30 uppercase tracking-widest leading-relaxed font-bold italic">
                    {svc.desc}
                  </p>
                  <div className="mt-8 flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.4em] text-stone-500/50 group-hover:text-stone-500 transition-colors">
                    Learn More <ArrowUpRight className="w-3 h-3" />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          5. STUDIO STATS
          ========================================== */}
      <section className="py-32 bg-[#0e0e11] border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5">
            {STATS.map((stat, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="bg-[#0e0e11] p-12 text-center">
                  <div className="text-6xl md:text-7xl font-black tracking-tighter text-white mb-4 font-mono">
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
          6. TEAM
          ========================================== */}
      <section className="py-32 bg-[#0a0a0c] border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal>
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-stone-500 mb-6 block">
              THE_STUDIO // CORE_TEAM
            </span>
            <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter italic text-white mb-20 leading-[1.1] pb-2">
              Architects.
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5">
            {TEAM.map((member, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="bg-[#0a0a0c] group overflow-hidden">
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <Image
                      src={member.img}
                      alt={member.name}
                      fill
                      className="object-cover brightness-50 grayscale group-hover:grayscale-0 group-hover:brightness-70 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent" />
                  </div>
                  <div className="p-8 border-t border-white/5">
                    <p className="text-[9px] font-bold text-stone-500/60 uppercase tracking-[0.4em] mb-2">
                      {member.role}
                    </p>
                    <h3 className="text-xl font-black uppercase tracking-tighter text-white mb-3">
                      {member.name}
                    </h3>
                    <p className="text-[10px] text-white/20 uppercase tracking-widest leading-relaxed font-bold italic">
                      {member.specialty}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          7. PROCESS
          ========================================== */}
      <section className="py-32 bg-[#0e0e11] border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal>
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-stone-500 mb-6 block">PROCESS_SEQUENCE // HOW_WE_WORK</span>
            <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter italic text-white mb-20 leading-[1.1] pb-2">Method.</h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
            {[
              { num: "01", title: "Site_Analysis", body: "We begin with a forensic study of the site — topography, light vectors, wind exposure, subsurface conditions, and contextual syntax. No design decisions before the land speaks." },
              { num: "02", title: "Concept_Generation", body: "Parametric models and structural simulations run concurrently with sketch exploration. We generate up to twelve volumetric proposals before selecting a direction for development." },
              { num: "03", title: "Computational_Design", body: "Every facade panel, structural joint, and material specification is derived through generative algorithms optimized for performance and resource efficiency." },
              { num: "04", title: "Engineering_Coordination", body: "Simultaneous BIM coordination with structural, MEP, and sustainability engineers. Clash detection at every stage. Zero site surprises." },
              { num: "05", title: "Construction_Oversight", body: "Our architects visit the site weekly and issue formal observation reports. Material substitutions require studio approval. We do not accept shortcuts." },
              { num: "06", title: "Post_Occupancy", body: "Six and twelve month evaluations against the original performance brief. Energy consumption, acoustic comfort, and spatial quality are all measured and documented." },
            ].map((s, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="bg-[#0a0a0c] p-10 h-full group hover:bg-[#0e0e11] transition-colors">
                  <div className="text-6xl font-black text-stone-500/15 mb-8 group-hover:text-stone-500/30 transition-colors font-mono">{s.num}</div>
                  <h3 className="text-lg font-black uppercase tracking-tighter text-white mb-4">{s.title}</h3>
                  <p className="text-[11px] text-white/30 uppercase tracking-widest leading-relaxed font-bold italic">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          8. AWARDS & PRESS
          ========================================== */}
      <section className="py-32 bg-[#0a0a0c] border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
            <div>
              <Reveal>
                <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-stone-500 mb-6 block">RECOGNITION_LOG // AWARDS</span>
                <h2 className="text-4xl font-black uppercase tracking-tighter italic text-white mb-16 leading-[1.1] pb-2">Honours.</h2>
              </Reveal>
              <div className="divide-y divide-white/5">
                {[
                  { year: "2025", title: "Archdaily Building of the Year", cat: "Commercial" },
                  { year: "2024", title: "Dezeen Award", cat: "Residential" },
                  { year: "2024", title: "Wallpaper* Award", cat: "Architecture" },
                  { year: "2023", title: "RIBA International Prize — Shortlist", cat: "Cultural" },
                  { year: "2022", title: "Blueprint Award — Best New Practice", cat: "Studio" },
                  { year: "2021", title: "Frame Awards — Special Mention", cat: "Interior" },
                ].map((a, i) => (
                  <Reveal key={i} delay={i * 0.06}>
                    <div className="py-6 flex items-center gap-8 group">
                      <span className="text-[9px] font-black text-white/10 uppercase tracking-widest w-10 flex-shrink-0 font-mono">{a.year}</span>
                      <div className="flex-1 text-sm font-black uppercase tracking-tighter text-white/40 italic group-hover:text-white/80 transition-colors">{a.title}</div>
                      <span className="text-[9px] font-bold text-stone-500/50 uppercase tracking-widest flex-shrink-0">{a.cat}</span>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
            <div>
              <Reveal>
                <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-stone-500 mb-6 block">PRESS_LOG // AS_SEEN_IN</span>
                <h2 className="text-4xl font-black uppercase tracking-tighter italic text-white mb-16 leading-[1.1] pb-2">Press.</h2>
              </Reveal>
              <div className="divide-y divide-white/5">
                {[
                  { pub: "Archdaily", title: "KINETIC_TOWER redefines the Dubai skyline", year: "2024" },
                  { pub: "Dezeen", title: "Inside VOID_STUDIO: architecture as subtraction", year: "2024" },
                  { pub: "Wallpaper*", title: "Elias Vorne and the post-digital built form", year: "2023" },
                  { pub: "Icon Magazine", title: "Structura's parametric manifesto", year: "2023" },
                  { pub: "Frame", title: "When computing becomes material", year: "2022" },
                ].map((p, i) => (
                  <Reveal key={i} delay={i * 0.06}>
                    <div className="py-6 flex items-start gap-8 group cursor-pointer">
                      <span className="text-[9px] font-black text-stone-500/50 uppercase tracking-widest w-20 flex-shrink-0 mt-0.5">{p.pub}</span>
                      <div className="flex-1 text-sm font-bold text-white/20 italic group-hover:text-white/60 transition-colors leading-snug">{p.title}</div>
                      <ArrowUpRight className="w-3 h-3 text-white/10 group-hover:text-stone-500 transition-colors flex-shrink-0 mt-1" />
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          9. CONTACT CTA
          ========================================== */}
      <section className="py-40 bg-[#0e0e11] border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 text-center">
          <Reveal>
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-stone-500 mb-8 block">
              INITIATE_SEQUENCE // NEW_PROJECT
            </span>
            <h2 className="text-6xl md:text-8xl lg:text-[10rem] font-black uppercase italic tracking-tighter text-white leading-[1.05] mb-12 pb-4">{c?.aboutTitle ?? fd?.businessName ?? <>
              Build<br />
              <span className="text-stone-500">with us.</span>
            </>}</h2>
            <p className="max-w-lg mx-auto text-sm text-white/20 uppercase tracking-widest leading-relaxed font-bold italic mb-16">{c?.aboutText ?? <>
              We accept a limited number of commissions each cycle. Submit your site parameters and volumetric objectives.
            </>}</p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/templates/impact-76/contact">
                <MagneticBtn className="px-16 py-6 bg-white text-black text-[10px] font-bold uppercase tracking-[0.4em] rounded-none hover:bg-stone-200 transition-all cursor-pointer shadow-2xl inline-flex items-center gap-4">
                  Initiate Project <Mail className="w-4 h-4" />
                </MagneticBtn>
              </Link>
              <Link href="/templates/impact-76/archive">
                <button className="px-16 py-6 border border-white/10 text-white text-[10px] font-bold uppercase tracking-[0.4em] rounded-none hover:bg-white hover:text-black transition-all cursor-pointer">
                  View Full Archive
                </button>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
