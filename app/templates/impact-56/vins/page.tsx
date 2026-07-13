"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Minus, Plus, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { WINES, Reveal } from "../shared";

export default function VinsPage() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Hero */}
      <section className="relative h-72 flex items-end bg-[#2D1B0E]">
        <Image
          src="https://images.unsplash.com/photo-1559131397-f94da358f7ca?w=1600&q=80&fit=crop"
          alt="Cave à vins"
          fill
          className="object-cover brightness-40"
          loading="lazy"
        />
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-14 w-full">
          <Reveal>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px w-8 bg-[#C4A265]" />
              <span className="text-xs uppercase tracking-[0.3em] text-[#C4A265] font-sans font-bold">Margaux · 1er Grand Cru Classé</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-serif text-white tracking-tight leading-none pb-2">Nos Vins</h1>
          </Reveal>
        </div>
      </section>

      {/* Wine Grid */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {WINES.map((w, i) => (
            <Reveal key={w.id} delay={i * 0.1}>
              <div
                className="group bg-white border border-[#2D1B0E]/8 overflow-hidden cursor-pointer hover:shadow-2xl transition-shadow duration-500"
                onClick={() => setSelected(w.id === selected ? null : w.id)}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={w.image}
                    alt={w.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-1000"
                    loading="lazy"
                  />
                  {w.badge && (
                    <div className="absolute top-4 right-4 bg-[#C4A265] text-[#2D1B0E] text-xs font-bold uppercase tracking-widest px-3 py-1.5 font-sans">
                      {w.badge}
                    </div>
                  )}
                </div>
                <div className="p-8 font-sans">
                  <div className="text-xs uppercase tracking-widest text-[#C4A265] font-bold mb-1">{w.appellation}</div>
                  <h3 className="text-2xl font-serif text-[#2D1B0E] mb-1 leading-snug pb-1">{w.name}</h3>
                  <p className="text-sm text-zinc-500 mb-4">{w.subtitle}</p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {w.millesimes.map(m => (
                      <span key={m} className="px-3 py-1 border border-[#2D1B0E]/20 text-xs font-bold text-[#2D1B0E] tracking-wider">
                        {m}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-serif text-[#2D1B0E]">{w.priceRange}</span>
                    <button
                      type="button"
                      className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#2D1B0E] hover:text-[#C4A265] transition-colors"
                      onClick={(e) => { e.stopPropagation(); setSelected(w.id === selected ? null : w.id) }}
                    >
                      {selected === w.id ? "Fermer" : "Détails"} <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Expanded detail */}
                <AnimatePresence>
                  {selected === w.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden border-t border-[#2D1B0E]/8"
                    >
                      <div className="px-8 pb-8 pt-6 font-sans bg-[#FDFBF7] grid grid-cols-1 sm:grid-cols-2 gap-6" onClick={e => e.stopPropagation()}>
                        <div>
                          <div className="text-xs uppercase tracking-widest text-zinc-400 font-bold mb-1">Cépages</div>
                          <p className="text-sm text-zinc-700">{w.cepages}</p>
                        </div>
                        <div>
                          <div className="text-xs uppercase tracking-widest text-zinc-400 font-bold mb-1">Robe</div>
                          <p className="text-sm text-zinc-700">{w.robe}</p>
                        </div>
                        <div>
                          <div className="text-xs uppercase tracking-widest text-zinc-400 font-bold mb-1">Nez</div>
                          <p className="text-sm text-zinc-700">{w.nez}</p>
                        </div>
                        <div>
                          <div className="text-xs uppercase tracking-widest text-zinc-400 font-bold mb-1">Bouche</div>
                          <p className="text-sm text-zinc-700">{w.bouche}</p>
                        </div>
                        <div>
                          <div className="text-xs uppercase tracking-widest text-zinc-400 font-bold mb-1">Service</div>
                          <p className="text-sm text-zinc-700">{w.service}</p>
                        </div>
                        <div>
                          <div className="text-xs uppercase tracking-widest text-zinc-400 font-bold mb-1">Garde</div>
                          <p className="text-sm text-zinc-700">{w.garde}</p>
                        </div>
                        <div className="sm:col-span-2">
                          <Link
                            href="/templates/impact-56/commande"
                            className="block w-full py-3 bg-[#2D1B0E] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#4A2820] transition-colors text-center"
                            style={{ textDecoration: "none" }}
                          >
                            Commander ce vin
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Note alcool */}
      <div className="max-w-7xl mx-auto px-6 pb-16 font-sans">
        <p className="text-xs text-zinc-400 text-center">
          L'abus d'alcool est dangereux pour la santé. La vente d'alcool est réservée aux personnes majeures (+18 ans). À consommer avec modération.
        </p>
      </div>
    </div>
  );
}
