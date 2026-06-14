// @ts-nocheck
"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { PROJECTS, Reveal } from "../shared";

export default function ArchivePage() {
  const [activeProject, setActiveProject] = useState<number | null>(null);

  return (
    <div className="py-20 bg-[#0a0a0c]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
          <Reveal>
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[1.15] text-white italic pb-4">
              Project <br />{" "}
              <span className="text-stone-500 not-italic">Archive.</span>
            </h2>
          </Reveal>
          <p className="max-w-sm text-sm text-white/10 leading-relaxed font-bold uppercase tracking-widest italic text-right">
            A non-exhaustive list of our structural explorations. Pushing
            materials to their absolute elastic limit.
          </p>
        </div>

        <div className="space-y-32">
          {PROJECTS.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.1}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-32 items-center">
                <div
                  className={`lg:col-span-7 ${i % 2 === 1 ? "lg:order-2" : ""}`}
                >
                  <div
                    onClick={() => setActiveProject(i)}
                    className="relative aspect-[16/10] rounded-3xl overflow-hidden cursor-pointer group shadow-2xl border border-white/5"
                  >
                    <Image
                      src={p.img}
                      alt={p.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-1000 grayscale-[0.2]"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all duration-1000" />
                    <div className="absolute bottom-8 left-8 flex items-center gap-4">
                      <Badge className="bg-white text-black border-none text-[10px] font-black tracking-widest uppercase px-4 py-1.5">
                        {p.year}
                      </Badge>
                      <div className="px-4 py-1.5 bg-black/50 backdrop-blur-md rounded-none text-[10px] font-black uppercase tracking-widest text-white/80">
                        {p.area}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-5 flex flex-col justify-center">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-500 mb-6 block">
                    0{i + 1} // ARCH_LOG
                  </span>
                  <h3 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase italic mb-8">
                    {p.title}
                  </h3>
                  <div className="flex gap-12 mb-10 pb-10 border-b border-white/5">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-white/10 uppercase tracking-widest mb-1">
                        Location
                      </span>
                      <span className="text-[11px] font-black text-white uppercase">
                        {p.location}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-white/10 uppercase tracking-widest mb-1">
                        Type
                      </span>
                      <span className="text-[11px] font-black text-white uppercase">
                        {p.type}
                      </span>
                    </div>
                  </div>
                  <p className="text-lg text-white/30 leading-relaxed font-bold uppercase tracking-tight italic mb-12">
                    {p.desc}
                  </p>
                  <button
                    onClick={() => setActiveProject(i)}
                    className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-stone-500 hover:text-white transition-colors group"
                  >
                    TECHNICAL_SPECIFICATIONS{" "}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                  </button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* PROJECT MODAL */}
      <AnimatePresence>
        {activeProject !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/98 backdrop-blur-3xl flex items-center justify-center p-6"
            onClick={() => setActiveProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="bg-[#0e0e11] border border-white/10 max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 overflow-hidden rounded-3xl shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveProject(null)}
                className="absolute top-8 right-8 text-white/20 hover:text-stone-500 transition-colors z-10"
              >
                <X className="w-6 h-6" />
              </button>

              {/* IMAGE AREA */}
              <div className="lg:col-span-8 relative aspect-video lg:aspect-auto bg-black">
                <Image
                  src={PROJECTS[activeProject].img}
                  alt="Project"
                  fill
                  className="object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8">
                  <h3 className="text-4xl font-black text-white italic">
                    {PROJECTS[activeProject].title}
                  </h3>
                </div>
              </div>

              {/* SIDEBAR AREA */}
              <div className="lg:col-span-4 p-8 flex flex-col justify-between bg-[#0e0e11] border-l border-white/5">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-stone-500 mb-6 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-stone-500" />
                    Structural Integrity Report
                  </div>
                  <div className="space-y-6 mb-12">
                    {[
                      { label: "Seismic Rating", val: "A+ Institutional" },
                      {
                        label: "Thermal Efficiency",
                        val: "98.4% Net Positive",
                      },
                      { label: "Material Load", val: "Optimized Composite" },
                      { label: "Generative Seed", val: "0x76_V14" },
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
                    {PROJECTS[activeProject].desc}
                  </p>
                </div>

                <button className="w-full py-5 bg-white text-black text-[10px] font-bold uppercase tracking-widest hover:bg-stone-200 transition-all cursor-pointer shadow-xl">
                  REQUEST_FULL_BLUEPRINTS
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
