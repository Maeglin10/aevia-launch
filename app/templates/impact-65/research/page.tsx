"use client";

import { motion } from "framer-motion";
import { Reveal, GridBackground } from "../shared";

export default function ResearchPage() {
  const sectors = [
    {
      title: "Aerospace & Satellites",
      tag: "ORBITAL SYSTEMS",
      desc: "Ultra-low thermal expansion composites designed for low earth orbit (LEO). We build highly dimensional-stable structures that withstand temperature gradients of over 300°C without warping.",
      specs: ["CTE < 0.1 x 10^-6/K", "Outgassing compliant", "High radiation damping"],
    },
    {
      title: "Formula 1 & Motorsports",
      tag: "DYNAMIC DAMPING",
      desc: "Maximum impact energy dissipation weaves. Our composite monocoques and suspension elements are engineered to meet strict FIA safety margins while shaving vital grams off the racing weight.",
      specs: ["High crash absorption", "Prepreg Autoclave molded", "Stiffness ratio > 2.5x steel"],
    },
    {
      title: "Marine & Hydrafoils",
      tag: "HYDRODYNAMIC STRESS",
      desc: "Corrosion-proof hydrofoils and structural hull panels. Designed to withstand continuous cyclic loads in marine environments while keeping fluid drag to a minimum through high-gloss finish.",
      specs: ["Zero saltwater degradation", "Anti-cavitation profiles", "Integrated load-sensors"],
    },
  ];

  return (
    <div className="bg-[#050505] text-[#888] font-sans min-h-dvh py-24 px-6 relative">
      <GridBackground />
      <div className="max-w-[1200px] mx-auto relative z-10">

        {/* Header */}
        <Reveal>
          <div className="border-b border-white/5 pb-16 mb-24">
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#0070f3] block mb-6">Laboratory R&D</span>
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[1.15] pb-4 text-white italic">
              Sector <br /> <span className="font-light not-italic opacity-20 text-white">Research.</span>
            </h1>
          </div>
        </Reveal>

        {/* Sectors Grid */}
        <div className="space-y-24">
          {sectors.map((sec, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start border-b border-white/5 pb-20">
                <div className="lg:col-span-4">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#0070f3] block mb-4">
                    {sec.tag}
                  </span>
                  <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white italic">
                    {sec.title}
                  </h2>
                </div>
                <div className="lg:col-span-5 text-sm font-light leading-relaxed italic opacity-70">
                  {sec.desc}
                </div>
                <div className="lg:col-span-3 flex flex-col gap-3 font-bold uppercase tracking-wider text-[10px] text-white">
                  {sec.specs.map((spec, specIdx) => (
                    <div key={specIdx} className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded">
                      <span className="w-1.5 h-1.5 bg-[#0070f3] rounded-full" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

      </div>
    </div>
  );
}
