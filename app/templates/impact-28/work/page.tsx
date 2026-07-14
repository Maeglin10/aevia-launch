"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Reveal, projects, ScrollImage } from "../shared"
import { Layers, ArrowUpRight, ArrowRight } from "lucide-react"

export default function WorkPage() {
  const [filter, setFilter] = useState<string>("All")
  const [selectedWorkId, setSelectedWorkId] = useState<number | null>(null)
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  const filteredProjects = projects.filter((p) => filter === "All" || p.type === filter)

  const featured = projects[0]

  return (
    <div className="min-h-dvh">

      {/* ─── FEATURED PROJECT HERO ──────────────────────────────────────────── */}
      <div className="pt-[72px] relative overflow-hidden min-h-[60vh] flex items-end">
        <ScrollImage
          src={featured.img}
          alt={featured.name}
          width={1600}
          height={900}
          className="absolute inset-0 w-full h-full"
          dir={1}
          yRange={50}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/10" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-16 w-full">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div>
                <div className="text-xs font-bold tracking-[0.4em] uppercase text-white/40 mb-4">
                  Featured Project — {featured.year}
                </div>
                <h2
                  className="font-black text-white uppercase leading-[0.85]"
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: "clamp(36px, 6vw, 80px)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {featured.name}
                </h2>
                <div className="flex items-center gap-4 mt-4">
                  <span className="text-white/50 text-sm font-semibold uppercase tracking-widest">{featured.loc}</span>
                  <span className="w-1 h-1 bg-white/30 rounded-full" />
                  <span className="text-white/50 text-sm font-semibold uppercase tracking-widest">{featured.type}</span>
                  <span className="w-1 h-1 bg-white/30 rounded-full" />
                  <span className="text-white/50 text-sm font-semibold uppercase tracking-widest">{featured.area}</span>
                </div>
              </div>
              <div className="shrink-0">
                <button
                  onClick={() => setSelectedWorkId(0)}
                  className="inline-flex items-center gap-2 bg-white text-black font-black text-sm uppercase tracking-widest px-8 py-4 hover:bg-gray-100 transition-colors cursor-pointer"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  View specs <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

    <div className="pt-12 px-6 pb-24 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b-4 border-black pb-8 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="text-xs font-bold tracking-[0.4em] uppercase text-gray-400 mb-2">Architectural Registry</div>
          <h1 className="font-black text-5xl md:text-8xl uppercase leading-none" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            ALL PROJECTS
          </h1>
        </div>
        <div className="flex flex-col gap-3 text-right">
          <p className="text-gray-500 max-w-sm text-sm font-medium leading-relaxed text-left md:text-right">
            An uncompromising collection of monoliths and structures defined by material honesty.
          </p>
          <div className="flex md:justify-end gap-4">
            <div className="text-center">
              <div className="font-black text-2xl" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{projects.length}</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Listed</div>
            </div>
            <div className="w-px bg-black/10" />
            <div className="text-center">
              <div className="font-black text-2xl" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>140+</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Total Built</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtering */}
      <div className="flex flex-wrap gap-3 mb-12">
        {["All", "Commercial", "Residential", "Cultural", "Mixed Use"].map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setFilter(cat)
              setSelectedWorkId(null)
            }}
            className={`px-6 py-2 border-4 border-black font-bold uppercase tracking-wider text-xs transition-colors ${
              filter === cat ? "bg-black text-white" : "bg-white text-black hover:bg-gray-100"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Dynamic blueprint / layout split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Project List */}
        <div className="lg:col-span-7 space-y-4">
          {filteredProjects.map((p, idx) => (
            <div
              key={p.name}
              onClick={() => setSelectedWorkId(idx)}
              className={`border-4 border-black p-6 cursor-pointer transition-all ${
                selectedWorkId === idx ? "bg-black text-white translate-x-2" : "bg-white hover:bg-gray-50"
              }`}
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest opacity-60">{p.type} — {p.loc}</span>
                  <h3 className="font-black text-2xl uppercase mt-1 leading-none" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                    {p.name}
                  </h3>
                </div>
                <span className="font-black text-lg" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{p.year}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Technical Blueprint Specs */}
        <div className="lg:col-span-5">
          {selectedWorkId !== null && filteredProjects[selectedWorkId] ? (
            <div className="border-4 border-black p-8 bg-black text-white relative sticky top-32">
              {/* Grid overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <span className="font-mono text-xs text-gray-400">PLAN_SPEC_V{selectedWorkId + 1}.EXE</span>
                  <span className="bg-white text-black px-2 py-0.5 text-[10px] font-black uppercase tracking-widest">Selected Monolith</span>
                </div>

                <div className="aspect-[4/3] relative w-full mb-6 border-2 border-white overflow-hidden bg-gray-950">
                  <Image 
                    src={filteredProjects[selectedWorkId].img} 
                    alt={filteredProjects[selectedWorkId].name}
                    fill
                    className="object-cover grayscale opacity-85"
                  />
                  {/* Crosshairs */}
                  <div className="absolute top-2 left-2 text-[10px] font-mono text-white/50">SEC_ELEV_0{selectedWorkId + 1}</div>
                  <div className="absolute bottom-2 right-2 text-[10px] font-mono text-white/50">GRID: B-12</div>
                  <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-white/35 pointer-events-none" />
                  <div className="absolute inset-y-0 left-1/2 border-l border-dashed border-white/35 pointer-events-none" />
                </div>

                <h3 className="font-black text-3xl uppercase leading-none mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  {filteredProjects[selectedWorkId].name}
                </h3>

                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  {filteredProjects[selectedWorkId].description}
                </p>

                <div className="space-y-3 font-mono text-xs border-t border-white/20 pt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">TOPOLOGY:</span>
                    <span>{filteredProjects[selectedWorkId].type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">TOTAL AREA:</span>
                    <span>{filteredProjects[selectedWorkId].area}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">CONCRETE COMPOSITION:</span>
                    <span className="text-right max-w-[200px]">{filteredProjects[selectedWorkId].concrete}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">STRUCTURAL SYSTEM:</span>
                    <span className="text-right max-w-[200px]">{filteredProjects[selectedWorkId].structure}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="border-4 border-black p-8 flex flex-col justify-center items-center text-center bg-gray-50 min-h-[400px]">
              <div className="border-2 border-black border-dashed rounded-full p-4 mb-4">
                <Layers className="w-8 h-8" />
              </div>
              <h4 className="font-black text-xl uppercase mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Select a Structure</h4>
              <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
                Click on any project to view its raw technical specification, blueprint drawings, and material matrix.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ─── CTA ──────────────────────────────────────────────────────────── */}
      <div className="mt-20 border-4 border-black p-10 md:p-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 bg-black text-white">
        <div>
          <div className="text-xs font-bold tracking-[0.4em] uppercase text-white/30 mb-3">Your project</div>
          <h3
            className="font-black text-3xl md:text-4xl uppercase leading-[0.9]"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            WHAT WILL YOU<br />BUILD?
          </h3>
        </div>
        <Link
          href="/templates/impact-28/contact"
          className="inline-flex items-center gap-2 bg-white text-black font-black text-sm uppercase tracking-widest px-8 py-4 hover:bg-gray-100 transition-colors cursor-pointer shrink-0"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          Start a project <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
    </div>
  )
}
