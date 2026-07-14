"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { EDITORIALS, Reveal } from "../shared";

export default function EditoriauxPage() {
  const [activeFilter, setActiveFilter] = useState("Tous");

  const FILTERS = ["Tous", "Couture", "Éditorial", "Art", "Exclusif"];
  const filtered = activeFilter === "Tous" ? EDITORIALS : EDITORIALS.filter(e => e.tag === activeFilter);

  return (
    <section className="py-24 bg-[#0E0E0C] min-h-dvh">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <Reveal>
            <p className="text-[10px] tracking-[0.4em] uppercase text-[#C9A86C] mb-3">Éditoriaux</p>
            <h1 className="text-4xl md:text-5xl font-light mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              La saison en images
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex flex-wrap gap-2">
              {FILTERS.map(f => (
                <button key={f} onClick={() => setActiveFilter(f)}
                  className={`px-4 py-2 text-[10px] tracking-widest uppercase border transition-all duration-200 cursor-pointer ${activeFilter === f ? "bg-[#F0EBE0] text-[#0A0A08] border-[#F0EBE0]" : "bg-transparent text-[#6A6058] border-[#2A2A20] hover:border-[#F0EBE0]"}`}>
                  {f}
                </button>
              ))}
            </div>
          </Reveal>
        </div>

        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-1">
          <AnimatePresence mode="popLayout">
            {filtered.map((editorial, i) => (
              <motion.div key={editorial.title} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="group cursor-pointer relative overflow-hidden">
                <div className="relative aspect-[3/4]">
                  <Image src={editorial.image} alt={editorial.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A08]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-[10px] text-[#C9A86C] tracking-widest uppercase mb-1">{editorial.designer}</p>
                    <h3 className="text-xl font-light text-[#F0EBE0]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{editorial.title}</h3>
                    <p className="text-xs text-[#A0988A] mt-1">{editorial.season}</p>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="text-[10px] tracking-widest uppercase bg-[#0A0A08]/60 text-[#C9A86C] px-2.5 py-1.5 backdrop-blur-sm">{editorial.tag}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
