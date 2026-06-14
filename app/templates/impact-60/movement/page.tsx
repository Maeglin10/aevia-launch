"use client";

import React from "react";
import { Reveal, ParallaxImg } from "../shared";
import { Settings, Shield, Cpu, RefreshCw } from "lucide-react";

export default function MovementPage() {
  return (
    <div className="bg-[#0a0c10] text-[#a0a0a0] min-h-screen pb-24">
      <section className="py-20 max-w-[1200px] mx-auto px-6">
        <Reveal>
          <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-[#c9a96e] mb-6 block">
            Inside the Zenith Caliber-9
          </span>
          <h2 className="text-5xl md:text-8xl font-light tracking-tighter uppercase leading-[1.15] pb-4 mb-16 italic text-white">
            Silent <br />
            <span className="font-bold not-italic opacity-30">Mechanics.</span>
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start mt-20">
          <Reveal delay={0.1}>
            <div className="space-y-12">
              <p className="text-2xl font-light text-white/50 leading-relaxed italic">
                Our signature Caliber-9 movement represents a decade of chronometric research. Entirely manufactured and assembled by hand in our Geneva workshops, it represents the absolute apex of contemporary mechanics.
              </p>
              
              <div className="border border-white/5 bg-white/[0.01] p-10 space-y-8">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#c9a96e] border-b border-white/5 pb-4">
                  Technical Specifications
                </h3>
                <div className="grid grid-cols-2 gap-y-6 text-sm font-sans">
                  <span className="text-white/30">Diameter</span>
                  <span className="text-white text-right font-bold">30.00 mm</span>
                  
                  <span className="text-white/30">Thickness</span>
                  <span className="text-white text-right font-bold">4.80 mm</span>
                  
                  <span className="text-white/30">Jewels</span>
                  <span className="text-white text-right font-bold">38 Rubies</span>
                  
                  <span className="text-white/30">Frequency</span>
                  <span className="text-white text-right font-bold">28,800 Alt/h (4 Hz)</span>
                  
                  <span className="text-white/30">Components</span>
                  <span className="text-white text-right font-bold">242 parts</span>
                  
                  <span className="text-white/30">Power Reserve</span>
                  <span className="text-white text-right font-bold">72 Hours (Dual Barrels)</span>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="relative aspect-[4/5] bg-white/[0.02] border border-white/5 p-2 overflow-hidden">
              <ParallaxImg 
                src="https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=1200" 
                alt="Watch movement close up" 
              />
            </div>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-32 border-t border-white/5 pt-20">
          {[
            { icon: Cpu, title: "INTEGRATED ESCAPEMENT", desc: "Crafted from low-friction silicon, eliminating the need for traditional lubrication and minimizing wear." },
            { icon: RefreshCw, title: "BI-DIRECTIONAL ROTOR", desc: "A micro-rotor engineered in solid 22k gold, delivering maximum winding efficiency with minimal thickness." },
            { icon: Shield, title: "INCABLOC SHOCK PROTECTION", desc: "A heavy-duty spring-loaded mounting system protecting the balance wheel pivots from physical shocks." }
          ].map((item, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="space-y-6">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-[#c9a96e]">
                  <item.icon className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-white italic">{item.title}</h4>
                <p className="text-sm font-light text-white/30 leading-relaxed italic">{item.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
