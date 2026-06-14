"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import { MENUS, WINE_PAIRINGS, Reveal } from "../shared";

export default function MenuPage() {
  const [activeMenuTab, setActiveMenuTab] = useState(0);

  return (
    <div className="bg-[#0f0d0b] text-[#f5efe0] min-h-screen pb-24">
      {/* ── À LA CARTE SECTION ── */}
      <section className="py-20 max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
          <Reveal>
            <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-[#b8860b] mb-6 block">
              À La Carte
            </span>
            <h2 className="text-5xl md:text-8xl font-light tracking-tighter uppercase leading-[1.15] pb-4 text-white">
              The <br />{" "}
              <span className="italic text-[#b8860b]">Curated.</span>
            </h2>
          </Reveal>
          <p className="max-w-xs text-[10px] font-bold uppercase tracking-widest text-[#f5efe0]/30 leading-relaxed italic">
            A hand-picked selection of seasonal masterpieces, updated daily
            based on the morning's harvest.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          <div className="lg:col-span-4">
            <div className="sticky top-40 space-y-4">
              {MENUS.map((menu, i) => (
                <button
                  key={i}
                  onClick={() => setActiveMenuTab(i)}
                  className={`w-full text-left p-10 border transition-all flex items-center justify-between group bg-transparent cursor-pointer ${activeMenuTab === i ? "border-[#b8860b] bg-[#b8860b]/5" : "border-white/5 hover:border-white/10"}`}
                >
                  <span
                    className={`text-xl font-light uppercase tracking-widest ${activeMenuTab === i ? "text-[#b8860b]" : "text-white/40"}`}
                  >
                    {menu.category}
                  </span>
                  <ArrowRight
                    className={`w-5 h-5 transition-transform ${activeMenuTab === i ? "text-[#b8860b] translate-x-2" : "text-white/10"}`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeMenuTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-12"
              >
                {MENUS[activeMenuTab].items.map((item, i) => (
                  <div
                    key={i}
                    className="group border-b border-white/5 pb-10 last:border-0 text-left"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-3xl font-light tracking-tight group-hover:text-[#b8860b] transition-colors text-white">
                        {item.name}
                      </h3>
                      <span className="text-xl font-light text-[#b8860b] italic">
                        {item.price}
                      </span>
                    </div>
                    <p className="text-[#f5efe0]/30 italic font-light max-w-xl">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ── WINE SECTION ── */}
      <section className="py-20 bg-[#0a0806] border-t border-[#b8860b]/5">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <Reveal className="relative aspect-square md:aspect-[4/5] rounded-sm overflow-hidden group">
              <Image
                src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1200&q=80"
                alt="Wine Cellar"
                fill
                className="object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0806] via-transparent to-transparent" />
              <div className="absolute inset-0 p-12 flex flex-col justify-end text-left">
                <div className="bg-[#b8860b] text-black w-fit mb-4 px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm">
                  Maître Caviste
                </div>
                <h3 className="text-4xl font-light italic mb-2 text-white uppercase tracking-tighter">
                  Liquid History.
                </h3>
              </div>
            </Reveal>

            <div className="text-left">
              <Reveal>
                <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#b8860b] mb-6 block">
                  The Oenology Protocol
                </span>
                <h2 className="text-5xl md:text-7xl font-light tracking-tighter leading-tight mb-12 uppercase text-white">
                  The <br /> <span className="italic">Pairing.</span>
                </h2>
                <p className="text-lg text-[#f5efe0]/40 leading-relaxed font-light mb-16 italic max-w-lg">
                  Our cellar houses over 12,000 bottles, including rare vertical
                  collections of Romanée-Conti and Château d'Yquem.
                </p>

                <div className="space-y-8">
                  {WINE_PAIRINGS.map((p, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between border-b border-white/5 pb-8 group"
                    >
                      <div>
                        <h4 className="text-lg font-bold uppercase tracking-widest mb-1 group-hover:text-[#b8860b] transition-colors text-white">
                          {p.title}
                        </h4>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 italic">
                          {p.wines} Glasses // {p.focus}
                        </p>
                      </div>
                      <span className="text-xl font-light italic text-[#b8860b]">
                        {p.price}
                      </span>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
