"use client";
// @ts-nocheck

import { Reveal, Counter } from "../shared";

export default function HeritagePage() {
  return (
    <div className="py-20 bg-[#050505]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <Reveal className="text-center mb-24 max-w-4xl mx-auto">
          <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-stone-600 block mb-10 italic">
            Our Heritage
          </span>
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-white leading-[1.15] italic mb-12 pb-4">
            The Manufacture.
          </h1>
          <p className="text-xl text-white/30 italic font-light leading-relaxed">
            Timekeepers of distinction. We calibrate high precision for collectors globally.
          </p>
        </Reveal>

        {/* STATS (Counters) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-16 text-center border-t border-white/5 pt-20">
          {[
            { label: "Boutiques_Global", val: 14, suffix: "" },
            { label: "Pieces_Annual", val: 450, suffix: "" },
            { label: "Master_Watchmakers", val: 8, suffix: "" },
            { label: "Patent_Inventions", val: 124, suffix: "" },
          ].map((stat, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="text-5xl md:text-7xl font-black text-stone-600 mb-4 italic tabular-nums">
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
