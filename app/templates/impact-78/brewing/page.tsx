"use client";
// @ts-nocheck

import { Thermometer, CupSoda } from "lucide-react";
import { BREW_METHODS, Reveal, Counter } from "../shared";

export default function BrewingPage() {
  return (
    <div className="py-20 bg-[#0c0a09]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-32 items-center">
          <div className="lg:col-span-5">
            <Reveal>
              <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-orange-900 mb-6 block">
                Extraction Physics
              </span>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.15] mb-12 text-white uppercase italic pb-4">
                Brew <br />{" "}
                <span className="text-orange-900 not-italic">Logic.</span>
              </h2>
              <p className="text-lg text-white/20 leading-relaxed font-bold mb-16 uppercase tracking-tight italic">
                Maximize the genetic potential of your beans. Our
                laboratory-tested protocols ensure peak extraction efficiency.
              </p>

              <div className="space-y-6">
                {[
                  {
                    label: "Extraction Yield",
                    val: 21.4,
                    suffix: "%",
                    desc: "The sweet spot of soluble solids. Balancing acidity and body.",
                  },
                  {
                    label: "Water Purity",
                    val: 80,
                    suffix: " PPM",
                    desc: "Calibrated mineral content for optimal molecular bonding.",
                  },
                  {
                    label: "Brew Precision",
                    val: 0.1,
                    suffix: " G",
                    desc: "Institutional-grade scaling for every single dose.",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="group border-l border-orange-900/20 pl-8 hover:border-orange-900 transition-all"
                  >
                    <h4 className="text-sm font-bold uppercase tracking-tight mb-2 text-white/40">
                      {item.label}
                    </h4>
                    <div className="text-3xl font-black text-orange-900 mb-2 uppercase italic tabular-nums">
                      <Counter to={item.val} suffix={item.suffix} />
                    </div>
                    <p className="text-[10px] text-white/10 leading-relaxed font-bold uppercase tracking-widest">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal className="space-y-6">
              {BREW_METHODS.map((m, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-8 bg-white/[0.02] border border-white/5 hover:border-orange-900/40 transition-all rounded-none group cursor-pointer"
                >
                  <div className="flex items-center gap-8">
                    <div className="w-12 h-12 rounded-full bg-orange-900/10 border border-orange-900/20 flex items-center justify-center text-orange-900 group-hover:bg-orange-900 group-hover:text-white transition-all">
                      <Thermometer className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black uppercase text-white italic">
                        {m.name}
                      </h4>
                      <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
                        Protocol_{i + 1}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-12 text-right">
                    <div>
                      <div className="text-[9px] font-bold text-white/10 uppercase mb-1 tracking-widest">
                        TEMP
                      </div>
                      <div className="text-sm font-black text-orange-900">
                        {m.temp}
                      </div>
                    </div>
                    <div>
                      <div className="text-[9px] font-bold text-white/10 uppercase mb-1 tracking-widest">
                        TIME
                      </div>
                      <div className="text-sm font-black text-orange-900">
                        {m.time}
                      </div>
                    </div>
                    <div>
                      <div className="text-[9px] font-bold text-white/10 uppercase mb-1 tracking-widest">
                        RATIO
                      </div>
                      <div className="text-sm font-black text-orange-900">
                        {m.ratio}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="p-12 bg-orange-900/5 border border-orange-900/20 rounded-none mt-12 text-center">
                <CupSoda className="w-8 h-8 text-orange-900 mx-auto mb-6" />
                <h3 className="text-xl font-black uppercase tracking-tight text-white mb-4 italic">
                  Request Custom Profile
                </h3>
                <p className="text-[10px] text-white/20 uppercase tracking-widest mb-8 leading-relaxed">
                  Our roasters will calculate a custom brew profile based on your
                  local water hardness and equipment.
                </p>
                <button className="px-12 py-4 bg-orange-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-none hover:bg-orange-800 transition-all shadow-xl">
                  CALCULATE_PROFILE
                </button>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}
