"use client";

import React, { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Maximize, Box } from "lucide-react";
import { ROOMS, Reveal } from "../shared";

export default function SpacesPage() {
  const [activeRoom, setActiveRoom] = useState(0);

  return (
    <section className="py-20 bg-[#050505] min-h-[70vh]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
          <Reveal>
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.9] text-white italic">
              Spatial <br /> <span className="text-rose-600">Anatomy.</span>
            </h2>
          </Reveal>
          <p className="max-w-sm text-sm text-white/30 leading-relaxed font-bold uppercase tracking-widest italic text-right">
            Explore individual zones of our flagship property. Sub-millimeter
            detail in every shadow.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* LEFT: ROOM LIST */}
          <div className="lg:col-span-4 space-y-6">
            {ROOMS.map((room, i) => (
              <Reveal key={room.id} delay={i * 0.1}>
                <div
                  onClick={() => setActiveRoom(i)}
                  className={`p-8 border transition-all cursor-pointer rounded-none group ${activeRoom === i ? "border-rose-600 bg-rose-600/5" : "border-white/5 bg-white/[0.02] hover:border-white/20"}`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/20">
                      0{i + 1}
                    </span>
                    <Maximize
                      className={`w-4 h-4 transition-all ${activeRoom === i ? "text-rose-600" : "text-white/10 group-hover:text-white/40"}`}
                    />
                  </div>
                  <h4 className="text-2xl font-black uppercase tracking-tighter italic mb-4">
                    {room.name}
                  </h4>
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/30">
                    <span>{room.area}</span>
                    <span>{room.tech}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* RIGHT: VIEWPORT */}
          <div className="lg:col-span-8 relative aspect-video rounded-none overflow-hidden shadow-2xl border border-white/5">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeRoom}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.1, opacity: 0 }}
                transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={ROOMS[activeRoom].img}
                  alt={ROOMS[activeRoom].name}
                  fill
                  className="object-cover brightness-[0.6] grayscale-[20%]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
              </motion.div>
            </AnimatePresence>

            <div className="absolute inset-0 p-12 flex flex-col justify-between pointer-events-none">
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] text-rose-600">
                    SCAN_SEQUENCE_ENABLED
                  </span>
                  <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">
                    Property ID: 0x074F_MK2
                  </span>
                </div>
                <div className="w-12 h-12 rounded-none border border-white/20 flex items-center justify-center">
                  <Box className="w-5 h-5 text-white/40" />
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-black text-white italic mb-2 tabular-nums">
                  {ROOMS[activeRoom].area}
                </div>
                <div className="text-[10px] font-bold text-rose-600 uppercase tracking-[0.3em]">
                  Computed Net Space
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
