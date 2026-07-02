"use client";
// @ts-nocheck

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { BEANS, Reveal } from "../shared";

export default function CollectionPage() {
  const [activeBean, setActiveBean] = useState<number | null>(null);

  return (
    <div className="py-20 bg-[#0c0a09]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
          <Reveal>
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[1.15] text-white pb-4">
              Roast <br />{" "}
              <span className="text-orange-900 italic">Spectrum.</span>
            </h2>
          </Reveal>
          <p className="max-w-sm text-sm text-white/10 leading-relaxed font-bold uppercase tracking-widest italic text-right">
            Our selection of rotating micro-lots. Each bean is a unique genetic
            sequence of flavor.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {BEANS.map((b, i) => (
            <Reveal key={b.id} delay={i * 0.1}>
              <div
                onClick={() => setActiveBean(i)}
                className="group cursor-pointer bg-white/[0.02] border border-white/5 hover:border-orange-900/40 transition-all rounded-none p-8 shadow-sm h-full flex flex-col justify-between overflow-hidden"
              >
                <div>
                  <div className="relative aspect-[4/5] mb-10 overflow-hidden">
                    <Image
                      src={b.img}
                      alt={b.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-1000 grayscale-[0.2] group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-orange-900/10 mix-blend-overlay" />
                    <div className="absolute top-6 left-6">
                      <Badge className="bg-orange-900 text-white border-none text-[8px] font-black tracking-widest uppercase px-3 py-1">
                        {b.roast}_ROAST
                      </Badge>
                    </div>
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter text-white italic mb-4">
                    {b.name}
                  </h3>
                  <div className="text-[10px] font-black text-orange-900 uppercase tracking-widest mb-6">
                    {b.origin}
                  </div>
                  <div className="flex flex-wrap gap-2 mb-10">
                    {b.notes.map((n) => (
                      <span
                        key={n}
                        className="text-[8px] font-black uppercase tracking-widest text-white/20 bg-white/[0.02] px-2 py-1 border border-white/5"
                      >
                        {n}
                      </span>
                    ))}
                  </div>
                </div>
                <button className="w-full py-4 border border-white/10 text-[9px] font-black uppercase tracking-widest text-stone-500 group-hover:bg-white group-hover:text-black transition-all">
                  RESERVE_BAG
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* BEAN MODAL */}
      <AnimatePresence>
        {activeBean !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/98 backdrop-blur-3xl flex items-center justify-center p-6"
            onClick={() => setActiveBean(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="bg-[#0e0e11] border border-white/10 max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 overflow-hidden rounded-none shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveBean(null)}
                className="absolute top-8 right-8 text-white/20 hover:text-orange-900 transition-colors z-10"
              >
                <X className="w-6 h-6" />
              </button>

              {/* IMAGE AREA */}
              <div className="lg:col-span-8 relative aspect-video lg:aspect-auto bg-black">
                <Image
                  src={BEANS[activeBean].img}
                  alt="Bean"
                  fill
                  className="object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8">
                  <h3 className="text-4xl font-black text-white italic">
                    {BEANS[activeBean].name}
                  </h3>
                </div>
              </div>

              {/* SIDEBAR AREA */}
              <div className="lg:col-span-4 p-8 flex flex-col justify-between bg-[#0e0e11] border-l border-white/5">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-orange-900 mb-6 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-900" />
                    Roast Profile Technical Sheet
                  </div>
                  <div className="space-y-6 mb-12">
                    {[
                      { label: "Origin", val: BEANS[activeBean].origin },
                      { label: "Process", val: BEANS[activeBean].process },
                      { label: "Roast Level", val: BEANS[activeBean].roast },
                      { label: "SCA Score", val: "91.5" },
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
                  <div className="flex flex-wrap gap-3 mb-10">
                    {BEANS[activeBean].notes.map((n) => (
                      <Badge
                        key={n}
                        className="bg-orange-900/20 text-orange-500 border-none text-[8px] font-black uppercase tracking-widest px-3 py-1"
                      >
                        {n}
                      </Badge>
                    ))}
                  </div>
                </div>

                <button className="w-full py-5 bg-white text-black text-[10px] font-bold uppercase tracking-widest hover:bg-orange-900 hover:text-white transition-all cursor-pointer shadow-xl">
                  ADD_TO_CART_ENVELOPE
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
