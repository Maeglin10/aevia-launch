"use client";
// @ts-nocheck

import { useState } from "react";
import Image from "next/image";
import { Plus, X, Check, Leaf } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { CLASSES, Reveal } from "../shared";

export default function PracticesPage() {
  const [activeClass, setActiveClass] = useState<number | null>(null);

  const triggerBooking = () => {
    window.dispatchEvent(new CustomEvent("open-zenspace-booking"));
  };

  return (
    <div className="py-20 bg-[#faf9f6]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
          <Reveal>
            <span className="text-[10px] uppercase tracking-[0.5em] font-black text-[#c9a84c] mb-6 block">
              Our Lineages
            </span>
            <h2 className="text-5xl md:text-8xl font-light tracking-tighter uppercase leading-[1.15] text-[#33302c] italic pb-4">
              The <br /> <span className="text-[#c9a84c]">Practices.</span>
            </h2>
          </Reveal>
          <p className="max-w-sm text-sm text-stone-400 leading-relaxed font-bold uppercase tracking-widest italic text-right">
            Explore our signature lineages. From rigorous Ashtanga to
            restorative Yin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {CLASSES.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.1}>
              <div
                onClick={() => setActiveClass(i)}
                className="group cursor-pointer bg-white border border-stone-200/50 hover:border-[#c9a84c]/40 transition-all rounded-3xl p-4 shadow-sm overflow-hidden"
              >
                <div className="relative aspect-square rounded-2xl overflow-hidden mb-8">
                  <Image
                    src={p.img}
                    alt={p.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-stone-900/10" />
                </div>
                <div className="px-4 pb-4">
                  <span className="text-[10px] uppercase tracking-widest text-[#c9a84c] font-black mb-2 block">
                    {p.level}
                  </span>
                  <h3 className="text-xl font-light tracking-tight mb-4 text-[#33302c] truncate uppercase italic">
                    {p.title}
                  </h3>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-black text-stone-300 italic">
                      {p.duration}
                    </span>
                    <button className="p-3 bg-[#33302c] text-[#faf9f6] rounded-full hover:bg-[#c9a84c] transition-all border-none cursor-pointer">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* GUIDELINES & PREPARATION */}
        <Reveal>
          <div className="bg-white border border-stone-200/50 rounded-3xl p-8 md:p-12 max-w-4xl mx-auto shadow-sm">
            <h3 className="text-2xl font-light uppercase tracking-widest mb-8 text-[#33302c]">
              Sanctuary <span className="text-[#c9a84c]">Preparation</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-stone-400 font-bold uppercase tracking-widest leading-relaxed">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-[#faf9f6] rounded-lg text-[#c9a84c]">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[#33302c] mb-1">Arrive 15m Early</h4>
                    <p className="text-[10px] font-normal leading-normal">
                      Allow time to sign in, change, and settle onto your mat. The sanctuary doors lock exactly at class time.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-[#faf9f6] rounded-lg text-[#c9a84c]">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[#33302c] mb-1">Empty Stomach</h4>
                    <p className="text-[10px] font-normal leading-normal">
                      We recommend avoiding heavy meals 2-3 hours before practicing. Light hydration is encouraged.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-[#faf9f6] rounded-lg text-[#c9a84c]">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[#33302c] mb-1">Silent Zone</h4>
                    <p className="text-[10px] font-normal leading-normal">
                      The sanctuary is a digital-free, silent space. Please leave phones in lockers.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-[#faf9f6] rounded-lg text-[#c9a84c]">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[#33302c] mb-1">Mats & Props Provided</h4>
                    <p className="text-[10px] font-normal leading-normal">
                      We provide state-of-the-art mats, blocks, straps, and bolsters. All sanitized with organic tea tree wash.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* CLASS MODAL */}
      <AnimatePresence>
        {activeClass !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6"
            onClick={() => setActiveClass(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="bg-[#faf9f6] border border-stone-200/50 max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 overflow-hidden rounded-3xl shadow-2xl relative text-[#33302c]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveClass(null)}
                className="absolute top-8 right-8 text-stone-300 hover:text-[#c9a84c] transition-colors z-10 bg-transparent border-none cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="relative aspect-square md:aspect-auto">
                <Image
                  src={CLASSES[activeClass].img}
                  alt="Class"
                  fill
                  className="object-cover brightness-95"
                />
              </div>
              <div className="p-12 flex flex-col justify-between bg-white">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-[#c9a84c] font-black mb-4">
                    Practice Detail // {CLASSES[activeClass].level}
                  </div>
                  <h3 className="text-4xl font-light uppercase tracking-tighter italic text-[#33302c] mb-6 leading-[1.15]">
                    {CLASSES[activeClass].title}
                  </h3>
                  <p className="text-sm text-stone-400 leading-relaxed font-bold mb-10 italic">
                    "{CLASSES[activeClass].desc}"
                  </p>

                  <div className="grid grid-cols-1 gap-4 mb-10">
                    {[
                      { label: "Duration", val: CLASSES[activeClass].duration },
                      {
                        label: "Intensity",
                        val: CLASSES[activeClass].intensity,
                      },
                      { label: "Linéage", val: "Traditional Hatha" },
                      { label: "Props", val: "All Provided" },
                    ].map((s, i) => (
                      <div
                        key={i}
                        className="flex justify-between text-[10px] border-b border-stone-100 pb-2 font-sans"
                      >
                        <span className="uppercase tracking-widest text-stone-300 font-black">
                          {s.label}
                        </span>
                        <span className="font-black text-[#c9a84c] italic">
                          {s.val}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <button
                    onClick={() => {
                      setActiveClass(null);
                      triggerBooking();
                    }}
                    className="w-full py-5 bg-[#33302c] text-[#faf9f6] text-[10px] font-bold uppercase tracking-widest hover:bg-[#c9a84c] transition-all cursor-pointer shadow-xl border-none"
                  >
                    RESERVE_MAT
                  </button>
                  <button
                    onClick={() => setActiveClass(null)}
                    className="w-full py-5 border border-stone-200 text-stone-400 text-[10px] font-bold uppercase tracking-widest hover:bg-[#33302c] hover:text-white transition-all cursor-pointer bg-transparent"
                  >
                    CLOSE_DETAILS
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
