"use client";
// @ts-nocheck

import { motion } from "framer-motion";
import { Watch } from "lucide-react";
import { Reveal, Counter } from "../shared";

export default function AnatomyPage() {
  return (
    <div className="py-20 bg-[#050505]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-32 items-center">
          <div className="lg:col-span-5">
            <Reveal>
              <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-stone-600 mb-6 block">
                Mechanical Integrity
              </span>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.15] mb-12 text-white uppercase italic pb-4">
                Structural <br />{" "}
                <span className="text-stone-600 not-italic">Anatomy.</span>
              </h2>
              <p className="text-lg text-white/20 leading-relaxed font-bold mb-16 uppercase tracking-tight italic">
                Every Horologs piece consists of over 420 individual components,
                assembled by hand under high-resolution magnification.
              </p>

              <div className="space-y-6">
                {[
                  {
                    label: "Tourbillon Precision",
                    val: 99.99,
                    suffix: "%",
                    desc: "Gravity-corrected escapement for absolute temporal accuracy.",
                  },
                  {
                    label: "Power Reserve",
                    val: 72,
                    suffix: " HR",
                    desc: "Dual-barrel system providing 3 days of autonomous energy.",
                  },
                  {
                    label: "Depth Rating",
                    val: 300,
                    suffix: " M",
                    desc: "Reinforced sapphire casing with structural integrity monitoring.",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="group border-l border-white/5 pl-8 hover:border-stone-600 transition-all"
                  >
                    <h4 className="text-sm font-bold uppercase tracking-tight mb-2 text-white/40">
                      {item.label}
                    </h4>
                    <div className="text-3xl font-black text-stone-500 mb-2 uppercase italic tabular-nums">
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
            <Reveal className="relative aspect-square rounded-full border border-white/5 p-12 flex items-center justify-center group overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,162,158,0.05)_0%,transparent_70%)] animate-pulse" />
              {/* PSEUDO ANATOMY VISUAL */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 60,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-0 border border-white/5 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{
                  duration: 40,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-12 border border-white/5 rounded-full border-dashed"
              />

              <div className="relative z-10 text-center">
                <Watch className="w-32 h-32 text-stone-600 mb-8 mx-auto opacity-20" />
                <div className="text-[10px] font-black text-white/20 uppercase tracking-[1em] mb-4">
                  Internal_View_Enabled
                </div>
                <div className="space-y-2">
                  <div className="h-1 w-32 bg-stone-600 mx-auto rounded-full" />
                  <div className="h-1 w-20 bg-stone-800 mx-auto rounded-full" />
                </div>
              </div>

              {/* CALLOUTS */}
              <div className="absolute top-1/4 right-0 flex items-center gap-4">
                <div className="w-12 h-[1px] bg-stone-600" />
                <span className="text-[8px] font-black text-stone-500 uppercase tracking-widest">
                  Sapphire_Inlay
                </span>
              </div>
              <div className="absolute bottom-1/4 left-0 flex items-center gap-4">
                <span className="text-[8px] font-black text-stone-500 uppercase tracking-widest">
                  Titanium_Core
                </span>
                <div className="w-12 h-[1px] bg-stone-600" />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}
