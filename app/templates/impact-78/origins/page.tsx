// @ts-nocheck
"use client";

import { Reveal, Counter } from "../shared";

export default function OriginsPage() {
  return (
    <div className="py-20 bg-[#0c0a09]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <Reveal className="text-center mb-24 max-w-4xl mx-auto">
          <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-orange-500 block mb-10 italic">
            Direct Trade Sourcing
          </span>
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-white leading-[1.15] italic mb-12 pb-4">
            Ethical Sourcing.
          </h1>
          <p className="text-xl text-white/30 italic font-light leading-relaxed">
            Trace your cup. Sourced at origin, roasted in Berlin, Ethiopia, Colombia and Sumatra.
          </p>
        </Reveal>

        {/* STATS (Counters) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-16 text-center border-t border-white/5 pt-20">
          {[
            { label: "Active_Origins", val: 24, suffix: "" },
            { label: "Monthly_Roasts", val: 1.2, suffix: " T" },
            { label: "Flavor_Compounds", val: 840, suffix: "+" },
            { label: "SCA_Cup_Score", val: 92, suffix: " AVG" },
          ].map((stat, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="text-5xl md:text-7xl font-black text-orange-900 mb-4 italic tabular-nums">
                <Counter to={stat.val} suffix={stat.suffix} />
              </div>
              <div className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/20">
                {stat.label}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
