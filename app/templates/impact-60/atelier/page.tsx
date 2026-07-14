"use client";

import React from "react";
import { Reveal, ParallaxImg } from "../shared";

export default function AtelierPage() {
  return (
    <div className="bg-[#0a0c10] text-[#a0a0a0] min-h-dvh pb-24">
      <section className="py-20 max-w-[1200px] mx-auto px-6">
        <Reveal>
          <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-[#c9a96e] mb-6 block">
            The Legacy & Heritage
          </span>
          <h2 className="text-5xl md:text-8xl font-light tracking-tighter uppercase leading-[1.15] pb-4 mb-20 italic text-white">
            Geneva <br />
            <span className="font-bold not-italic opacity-30">Atelier.</span>
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mt-20">
          <Reveal delay={0.1}>
            <div className="relative aspect-[4/3] bg-white/[0.02] border border-white/5 p-2 overflow-hidden">
              <ParallaxImg 
                src="https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&q=80&w=2400" 
                alt="Watch workshop macro" 
              />
            </div>
          </Reveal>
          
          <Reveal delay={0.2}>
            <div className="space-y-10">
              <h3 className="text-xl font-bold uppercase tracking-widest text-[#c9a96e] italic">
                Artisanal Sovereignty
              </h3>
              <p className="text-lg font-light text-white/50 leading-relaxed italic">
                Established in 1892, Zenith Watch has continuously operated on a single core principle: time is not measured, it is curated. In an era of automated scaling, we remain committed to slow, rigorous, individual craftsmanship.
              </p>
              <p className="text-base font-light text-white/30 leading-relaxed italic">
                Our master watchmakers complete their education through decades of mentorship. The assembly of a single Caliber-9 timepiece requires two full months of dedicated workspace focus and microscopic adjustments, culminating in a signature masterpiece.
              </p>
            </div>
          </Reveal>
        </div>

        <div className="mt-32 grid grid-cols-1 md:grid-cols-2 gap-16 border-t border-white/5 pt-20">
          <Reveal>
            <div className="space-y-6">
              <span className="text-[9px] uppercase tracking-widest text-[#c9a96e]">Phase I</span>
              <h4 className="text-lg font-bold uppercase text-white tracking-wider italic">Material Selection</h4>
              <p className="text-sm font-light text-white/30 leading-relaxed italic">
                We source only conflict-free, certified surgical grade titanium, platinum-iridium alloys, and 18k ethical gold for all movements and cases.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="space-y-6">
              <span className="text-[9px] uppercase tracking-widest text-[#c9a96e]">Phase II</span>
              <h4 className="text-lg font-bold uppercase text-white tracking-wider italic">Artisan Decoration</h4>
              <p className="text-sm font-light text-white/30 leading-relaxed italic">
                Every plate and bridge undergoes Côte de Genève striping, perlage, and anglage. Each internal screw is flame-blued by eye to a perfect cobalt shade.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
