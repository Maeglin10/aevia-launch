"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Compass, ArrowUpRight } from "lucide-react";
import { Reveal, ParallaxImg } from "./shared";

const PROJECTS = [
  {
    name: "The Obsidian Villa",
    loc: "Malibu, CA",
    type: "Residential",
    img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Glass Monolith",
    loc: "Berlin, DE",
    type: "Commercial",
    img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Serene Heights",
    loc: "Kyoto, JP",
    type: "Cultural",
    img: "https://images.unsplash.com/photo-1503387762-592cd5804557?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Meridian House",
    loc: "Oslo, NO",
    type: "Residential",
    img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop",
  },
];

const SERVICES = [
  {
    num: "01",
    title: "Residential Architecture",
    desc: "Private homes and villas conceived as instruments of pure habitation, calibrated to site and season.",
  },
  {
    num: "02",
    title: "Commercial Design",
    desc: "Workspace environments and flagship buildings that express institutional identity through elemental form.",
  },
  {
    num: "03",
    title: "Interiors & Materials",
    desc: "Material studies, spatial sequencing, and bespoke interior programming for each unique commission.",
  },
];

const AWARDS = [
  { year: "2025", title: "Archdaily Building of the Year", category: "Residential" },
  { year: "2024", title: "Wallpaper* Design Award", category: "Architecture" },
  { year: "2023", title: "Dezeen Award — Shortlisted", category: "Commercial" },
  { year: "2022", title: "Frame Awards — Best Newcomer", category: "Studio" },
];

export default function SymmetryStudioPage() {
  const basePath = "/templates/impact-80";

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
              <h1 className="text-7xl md:text-[10rem] font-light tracking-tighter leading-[1.15] text-[#1a1a1a] mb-16 uppercase pb-4">
                Pure <br />{" "}
                <span className="font-bold italic opacity-10">Volume.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.4}>
              <div className="flex flex-col gap-16">
                <p className="text-2xl text-black/40 font-light max-w-lg leading-relaxed italic">
                  Architectural interventions that harmonize human ritual with the
                  absolute geometry of nature.
                </p>
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
                <div className="group cursor-pointer">
                  <div className="relative aspect-video overflow-hidden border border-black/5 p-1 bg-white shadow-xl shadow-black/[0.02] mb-8">
                    <ParallaxImg src={project.img} alt={project.name} />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all duration-1000" />
                    <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-black/40">
                      {project.type}
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
                </div>
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

      {/* ── SERVICES ──────────────── */}
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
              <Reveal key={i} delay={i * 0.1}>
                <div className="py-12 grid grid-cols-12 gap-8 items-start group cursor-pointer hover:bg-white/60 transition-colors -mx-6 px-6">
                  <div className="col-span-1 text-[10px] font-bold text-black/10 italic uppercase tracking-widest pt-1">
                    {svc.num}
                  </div>
                  <div className="col-span-8 md:col-span-7">
                    <h3 className="text-2xl md:text-3xl font-light uppercase tracking-tighter text-[#1a1a1a] italic mb-4 group-hover:translate-x-2 transition-transform duration-700">
                      {svc.title}
                    </h3>
                    <p className="text-sm text-black/30 font-light leading-relaxed italic max-w-lg">
                      {svc.desc}
                    </p>
                  </div>
                  <div className="col-span-3 md:col-span-4 flex justify-end">
                    <div className="w-10 h-10 border border-black/5 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-700">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
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
            <h2 className="text-6xl md:text-8xl lg:text-[9rem] font-light uppercase tracking-tighter text-white leading-[1.05] mb-12 italic pb-4">
              Build The<br />
              <span className="font-bold opacity-10 not-italic">Absolute.</span>
            </h2>
            <p className="max-w-lg mx-auto text-lg text-white/30 font-light leading-relaxed italic mb-16">
              We accept a limited number of commissions each cycle to ensure the
              structural integrity and conceptual purity of every space.
            </p>
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
