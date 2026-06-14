"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { RETREATS, Reveal } from "../shared";

export default function RetreatsPage() {
  const [activeRetreat, setActiveRetreat] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#f8f5f0] pb-24">
      {/* ==========================================
          RETREATS PROGRAMME
          ========================================== */}
      <section className="py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
            <Reveal>
              <h2 className="text-5xl md:text-7xl font-light tracking-tighter uppercase leading-[0.9] font-serif">
                2026 <br /> <span className="italic">Destinations.</span>
              </h2>
            </Reveal>
            <p className="max-w-sm text-sm text-black/40 leading-relaxed italic font-light font-serif">
              Three landscapes chosen because the terrain itself exerts a
              corrective pressure on the depleted mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {RETREATS.map((retreat, i) => (
              <Reveal key={retreat.id} delay={i * 0.1}>
                <div
                  onClick={() => setActiveRetreat(i)}
                  className="group cursor-pointer bg-[#f8f5f0] border border-black/5 hover:border-[#3d7a5e]/30 transition-all p-1"
                >
                  <div className="relative aspect-[4/5] overflow-hidden mb-8">
                    <Image
                      src={retreat.img}
                      alt={retreat.name}
                      fill
                      className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#f8f5f0] via-transparent to-transparent" />
                    <div className="absolute top-6 left-6">
                      <Badge className="bg-[#3d7a5e] text-white rounded-none px-4 py-1 text-[9px] font-bold uppercase tracking-widest font-sans border-none">
                        {retreat.theme}
                      </Badge>
                    </div>
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="text-[9px] uppercase tracking-[0.4em] text-black/40 mb-2 font-sans font-bold">
                        {retreat.location}
                      </div>
                      <h3 className="text-3xl font-bold uppercase tracking-tighter group-hover:text-[#3d7a5e] transition-colors font-serif">
                        {retreat.name}
                      </h3>
                    </div>
                  </div>
                  <div className="p-8 pt-0">
                    <p className="text-sm text-black/50 leading-relaxed font-light mb-8 italic">
                      &quot;{retreat.desc.slice(0, 100)}...&quot;
                    </p>
                    <div className="flex items-center justify-between border-t border-black/5 pt-6 font-sans">
                      <span className="text-xl font-bold text-black font-serif">
                        {retreat.price}
                      </span>
                      <button className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-[#3d7a5e] group-hover:translate-x-2 transition-transform bg-transparent border-none">
                        Enquire <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* RETREAT MODAL */}
      <AnimatePresence>
        {activeRetreat !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
            onClick={() => setActiveRetreat(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="bg-[#f8f5f0] border border-black/10 max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 overflow-hidden rounded-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-square md:aspect-auto">
                <Image
                  src={RETREATS[activeRetreat].img}
                  alt="Retreat"
                  fill
                  className="object-cover grayscale brightness-75"
                />
                <div className="absolute inset-0 bg-[#3d7a5e]/5 mix-blend-screen" />
              </div>
              <div className="p-12 flex flex-col justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-[#3d7a5e] font-bold mb-4 font-sans">
                    {RETREATS[activeRetreat].location} //{" "}
                    {RETREATS[activeRetreat].theme}
                  </div>
                  <h3 className="text-4xl font-bold uppercase tracking-tighter text-black mb-6 leading-none font-serif">
                    {RETREATS[activeRetreat].name}
                  </h3>
                  <p className="text-sm text-black/40 leading-relaxed font-light mb-10 italic">
                    &quot;{RETREATS[activeRetreat].desc}&quot;
                  </p>

                  <div className="grid grid-cols-1 gap-4 mb-10 font-sans">
                    {RETREATS[activeRetreat].details.map(([k, v], i) => (
                      <div
                        key={i}
                        className="flex justify-between text-xs border-b border-black/5 pb-2"
                      >
                        <span className="uppercase tracking-widest text-black/20 font-bold">
                          {k}
                        </span>
                        <span className="font-bold text-black/60">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <Link
                  href="/templates/impact-59/apply"
                  className="w-full py-5 bg-[#3d7a5e] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-all text-center font-sans"
                  style={{ textDecoration: "none" }}
                >
                  Initialize_Intake &mdash; {RETREATS[activeRetreat].price}
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
