"use client";
// @ts-nocheck

import { Reveal, Counter } from "../shared";

export default function StudioPage() {
  return (
    <div className="py-20 bg-[#0a0a0c]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <Reveal className="text-center mb-24 max-w-4xl mx-auto">
          <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-stone-500 block mb-10 italic">
            The Studio
          </span>
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-white leading-[1.15] italic mb-12 pb-4">
            Structura Studio.
          </h1>
          <p className="text-xl text-white/30 italic font-light leading-relaxed">
            A collective of computational designers and engineers pushing the limits of raw volume.
          </p>
        </Reveal>

        {/* STATS (Counters) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-16 text-center border-t border-white/5 pt-20">
          {[
            { label: "Completed_Sites", val: 84, suffix: "+" },
            { label: "Global_Awards", val: 42, suffix: "" },
            { label: "Material_Patents", val: 12, suffix: "" },
            { label: "Square_Meters", val: 1.2, suffix: "M" },
          ].map((stat, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="text-5xl md:text-7xl font-black text-stone-500 mb-4 italic tabular-nums">
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
