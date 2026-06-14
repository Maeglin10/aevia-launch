// @ts-nocheck
"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { WATCHES, Reveal, TiltCard } from "../shared";

export default function CollectionPage() {
  const [activeWatch, setActiveWatch] = useState<number | null>(null);

  return (
    <div className="py-20 bg-[#050505]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
          <Reveal>
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[1.15] text-white pb-4">
              The <br />{" "}
              <span className="text-stone-600 italic">Archive.</span>
            </h2>
          </Reveal>
          <p className="max-w-sm text-sm text-white/10 leading-relaxed font-bold uppercase tracking-widest italic text-right">
            Filter by complication, material, or heritage. Each piece is a
            unique mechanical identity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {WATCHES.map((w, i) => (
            <Reveal key={w.id} delay={i * 0.1}>
              <TiltCard className="group cursor-pointer bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all rounded-none p-6 shadow-sm overflow-hidden">
                <div
                  onClick={() => setActiveWatch(i)}
                  className="relative aspect-[3/4] mb-8 overflow-hidden"
                >
                  <Image
                    src={w.img}
                    alt={w.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-1000 grayscale-[0.3] group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-stone-900/10 mix-blend-overlay" />
                </div>
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-black uppercase tracking-tighter text-white italic">
                      {w.name}
                    </h3>
                    <span className="text-[10px] font-bold text-stone-500 uppercase">
                      {w.collection}
                    </span>
                  </div>
                  <p className="text-[9px] text-white/30 leading-relaxed font-bold uppercase tracking-widest mb-6 italic">
                    {w.desc}
                  </p>
                  <div className="flex justify-between items-end">
                    <span className="text-lg font-black text-white italic">
                      {w.price}
                    </span>
                    <button
                      onClick={() => setActiveWatch(i)}
                      className="text-[9px] font-black uppercase tracking-widest text-stone-500 group-hover:text-white transition-colors"
                    >
                      Inquire_Now
                    </button>
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>

      {/* WATCH MODAL */}
      <AnimatePresence>
        {activeWatch !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/98 backdrop-blur-3xl flex items-center justify-center p-6"
            onClick={() => setActiveWatch(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="bg-[#0e0e11] border border-white/10 max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 overflow-hidden rounded-none shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveWatch(null)}
                className="absolute top-8 right-8 text-white/20 hover:text-stone-500 transition-colors z-10"
              >
                <X className="w-6 h-6" />
              </button>

              {/* IMAGE AREA */}
              <div className="lg:col-span-8 relative aspect-video lg:aspect-auto bg-black">
                <Image
                  src={WATCHES[activeWatch].img}
                  alt="Watch"
                  fill
                  className="object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8">
                  <h3 className="text-4xl font-black text-white italic">
                    {WATCHES[activeWatch].name}
                  </h3>
                </div>
              </div>

              {/* SIDEBAR AREA */}
              <div className="lg:col-span-4 p-8 flex flex-col justify-between bg-[#0e0e11] border-l border-white/5">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-stone-500 mb-6 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-stone-500" />
                    Technical Specification Sheet
                  </div>
                  <div className="space-y-6 mb-12">
                    {[
                      { label: "Movement", val: WATCHES[activeWatch].movement },
                      { label: "Water Resistance", val: "30 Bar / 300M" },
                      { label: "Material", val: "Titanium Grade 5" },
                      {
                        label: "Certification",
                        val: "METAS / Master Chronometer",
                      },
                    ].map((spec, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center border-b border-white/5 pb-4"
                      >
                        <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">
                          {spec.label}
                        </span>
                        <span className="text-[10px] font-black text-white uppercase italic">
                          {spec.val}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-white/40 leading-relaxed font-bold uppercase tracking-tight italic mb-10">
                    {WATCHES[activeWatch].desc}
                  </p>
                </div>

                <button className="w-full py-5 bg-white text-black text-[10px] font-bold uppercase tracking-widest hover:bg-stone-200 transition-all cursor-pointer shadow-xl">
                  RESERVE_SERIAL_UNIT
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
