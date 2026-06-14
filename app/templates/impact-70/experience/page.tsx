"use client";

import React from "react";
import { Music, Sparkles, Disc, MapPin, Heart } from "lucide-react";
import { Reveal } from "../shared";

export default function ExperiencePage() {
  return (
    <section className="py-20 bg-[#050005] min-h-[70vh]">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <Reveal>
          <div className="border-b border-white/5 pb-10 mb-20">
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#ff00ff] block mb-6">Nocturnal Sanctuary</span>
            <h2 className="text-6xl md:text-[8vw] font-light uppercase tracking-tighter text-white leading-none italic">
              The <span className="font-bold not-italic">Scene.</span>
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <Reveal>
            <div className="space-y-8 text-white/50 leading-relaxed italic text-lg font-light">
              <p>
                Velvet Night is not merely a club; it is an sensory sanctuary. We design physical and acoustic architectures that respond to the human nervous system.
              </p>
              <p>
                Our spaces are tuned to specific resonances. Every sound system, from our main arena to the secret chamber, uses handcrafted acoustic arrays calibrated by master engineers from Berlin and Tokyo.
              </p>
            </div>
          </Reveal>

          <div className="space-y-12">
            {[
              { icon: Disc, t: "Sonic Architecture", d: "Hand-wound custom sound systems tuned to 432Hz to encourage emotional release." },
              { icon: Heart, t: "Sensory Anonymity", d: "Strict no-photo policy. Encrypted digital access keys for total visual privacy." },
              { icon: Sparkles, t: "Olfactory Infusions", d: "Custom aromatic signatures diffused dynamically based on atmospheric moisture." }
            ].map((pillar, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="flex gap-6 items-start pl-6 border-l border-white/5 hover:border-[#ff00ff] transition-all">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                    <pillar.icon className="w-5 h-5 text-[#ff00ff]" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white uppercase tracking-wider mb-2">{pillar.t}</h4>
                    <p className="text-white/40 text-sm leading-relaxed italic">{pillar.d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
