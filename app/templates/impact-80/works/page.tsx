"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Filter } from "lucide-react";
import { Reveal } from "../shared";

const ALL_PROJECTS = [
  {
    name: "The Obsidian Villa",
    loc: "Malibu, CA",
    type: "Residential",
    year: "2024",
    area: "620 m²",
    status: "Completed",
    img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop",
    desc: "A private residence conceived as a monolithic obsidian form embedded in the Pacific cliff. Every room faces the horizon.",
  },
  {
    name: "Glass Monolith",
    loc: "Berlin, DE",
    type: "Commercial",
    year: "2024",
    area: "2 400 m²",
    status: "Completed",
    img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop",
    desc: "A sixteen-floor headquarters built on a single structural logic: maximum transparency, minimum intervention.",
  },
  {
    name: "Serene Heights",
    loc: "Kyoto, JP",
    type: "Cultural",
    year: "2023",
    area: "1 100 m²",
    status: "Completed",
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
    desc: "A cultural pavilion designed around the choreography of visitor movement. Light changes the space every hour.",
  },
  {
    name: "Meridian House",
    loc: "Oslo, NO",
    type: "Residential",
    year: "2023",
    area: "480 m²",
    status: "Completed",
    img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop",
    desc: "A family residence built on a steep Norwegian hillside. The building is invisible from the road.",
  },
  {
    name: "Tectonic Library",
    loc: "Copenhagen, DK",
    type: "Cultural",
    year: "2023",
    area: "3 200 m²",
    status: "Completed",
    img: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=1200&auto=format&fit=crop",
    desc: "A civic library where every reading zone is carved from a single poured concrete mass.",
  },
  {
    name: "Void Pavilion",
    loc: "Porto, PT",
    type: "Commercial",
    year: "2022",
    area: "860 m²",
    status: "Completed",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1200&auto=format&fit=crop",
    desc: "An office complex where the courtyard void is the primary architectural gesture. All offices face inward.",
  },
  {
    name: "Chalk House",
    loc: "Sussex, UK",
    type: "Residential",
    year: "2022",
    area: "340 m²",
    status: "Completed",
    img: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1200&auto=format&fit=crop",
    desc: "Embedded into the South Downs landscape, this chalk-faced house appears to have grown from the hillside.",
  },
  {
    name: "The Spine Tower",
    loc: "Singapore, SG",
    type: "Commercial",
    year: "2025",
    area: "8 500 m²",
    status: "Under Construction",
    img: "https://images.unsplash.com/photo-1545156521-77bd85671d30?q=80&w=1200&auto=format&fit=crop",
    desc: "A thirty-two storey mixed-use tower structured along a single vertical spine of exposed concrete.",
  },
];

const TYPES = ["All", "Residential", "Commercial", "Cultural"];

export default function WorksPage() {
  const [activeType, setActiveType] = useState("All");
  const [hovered, setHovered] = useState<number | null>(null);

  const filtered = activeType === "All" ? ALL_PROJECTS : ALL_PROJECTS.filter((p) => p.type === activeType);

  return (
    <main className="min-h-screen bg-[#fcfcfc]">
      {/* Header */}
      <section className="py-32 border-b border-black/5">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal>
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-black/20 block mb-6 italic">
              Archive of Form
            </span>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
              <h1 className="text-5xl md:text-8xl font-light uppercase tracking-tighter text-[#1a1a1a] leading-none italic pb-4">
                Silent <br />
                <span className="not-italic font-bold opacity-10">Spaces.</span>
              </h1>
              <p className="text-sm text-black/30 font-light italic max-w-sm leading-relaxed">
                {ALL_PROJECTS.length} commissions across {TYPES.length - 1} typologies since 2012.
                Each project accepted on the basis of design potential, not budget alone.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Filter */}
      <section className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-black/5 py-6">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center gap-8">
          <Filter className="w-4 h-4 text-black/20" />
          <div className="flex gap-6">
            {TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setActiveType(t)}
                className={`text-[10px] font-bold uppercase tracking-widest transition-colors italic pb-1 border-b ${
                  activeType === t
                    ? "text-black border-black"
                    : "text-black/20 border-transparent hover:text-black/40"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="ml-auto text-[9px] font-bold uppercase tracking-widest text-black/10 italic">
            {filtered.length} Project{filtered.length !== 1 ? "s" : ""}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="py-24">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <AnimatePresence mode="popLayout">
            <motion.div layout className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-24">
              {filtered.map((item, i) => (
                <motion.div
                  key={item.name}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: i * 0.04 }}
                >
                  <div
                    className="group cursor-pointer"
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <div className="aspect-video relative mb-8 overflow-hidden border border-black/5 p-1 bg-white shadow-xl shadow-black/[0.02]">
                      <div className={`absolute inset-0 z-10 transition-all duration-1000 ${hovered === i ? "bg-transparent" : "bg-black/20"}`} />
                      <div className={`absolute inset-[-10%] w-[120%] h-[120%] transition-transform duration-1000 ${hovered === i ? "scale-105" : "scale-100"}`}>
                        <Image src={item.img} alt={item.name} fill className={`object-cover transition-all duration-1000 ${hovered === i ? "grayscale-0" : "grayscale"}`} />
                      </div>
                      <div className="absolute top-4 left-4 z-20 flex gap-2">
                        <span className="bg-white/80 backdrop-blur-sm px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-black/40">{item.type}</span>
                        {item.status === "Under Construction" && (
                          <span className="bg-black text-white px-3 py-1 text-[9px] font-bold uppercase tracking-widest">In Progress</span>
                        )}
                      </div>
                      <div className="absolute bottom-4 right-4 z-20 text-[9px] font-bold uppercase tracking-widest text-white/40">{item.area}</div>
                    </div>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="text-[9px] font-bold uppercase tracking-widest text-black/20 mb-2 italic">
                          {item.loc} · {item.year}
                        </div>
                        <h3 className="text-2xl md:text-3xl font-light uppercase tracking-tighter text-black italic group-hover:translate-x-2 transition-transform duration-700">
                          {item.name}
                        </h3>
                      </div>
                      <div className="w-10 h-10 border border-black/10 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-500 flex-shrink-0 mt-1">
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>
                    <p className="text-sm text-black/25 font-light italic leading-relaxed max-w-md">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-white border-t border-black/5">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 text-center">
          <Reveal>
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-black/20 block mb-12 italic">
              New Commission
            </span>
            <h2 className="text-4xl md:text-6xl font-light uppercase tracking-tighter text-[#1a1a1a] italic pb-2 mb-8">
              Your project could be<br />
              <span className="font-bold opacity-10 not-italic">next.</span>
            </h2>
            <Link href="/templates/impact-80/contact">
              <button className="px-16 py-6 bg-black text-white font-bold uppercase tracking-widest text-[10px] hover:px-20 transition-all duration-700 shadow-2xl italic">
                Begin the Conversation
              </button>
            </Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
