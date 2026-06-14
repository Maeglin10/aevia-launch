"use client";

import React, { useState } from "react";
import { Clock, ArrowRight, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { PROTOCOLS, Reveal } from "../shared";

export default function ProtocolesPage() {
  const [active, setActive] = useState(0);
  const ActiveIcon = PROTOCOLS[active].icon;
  const basePath = "/templates/impact-84";

  return (
    <div className="min-h-screen bg-[#0C0C0A] py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <Reveal>
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#C9A86C] mb-4">Catalogue complet</p>
          <h1 className="text-4xl md:text-6xl font-light mb-6" style={{ fontFamily: "'Bodoni Moda', serif" }}>
            Nos <em>protocoles</em>
          </h1>
          <p className="text-[#6A6058] max-w-xl mb-16 leading-relaxed">
            Six protocoles médicaux développés et validés par notre équipe de spécialistes. Chaque approche repose sur des données cliniques publiées et un suivi objectif des résultats.
          </p>
        </Reveal>

        {/* Protocol selector */}
        <div className="grid lg:grid-cols-5 gap-0 border border-[#2A2520] mb-20">
          <div className="lg:col-span-2 border-r border-[#2A2520]">
            {PROTOCOLS.map((p, i) => {
              const Icon = p.icon;
              return (
                <button key={p.id} type="button" onClick={() => setActive(i)}
                  className={`w-full text-left p-6 border-b border-[#2A2520] last:border-b-0 flex items-center gap-4 transition-all duration-200 cursor-pointer group ${active === i ? "bg-[#1A1714]" : "hover:bg-[#141210]"}`}>
                  <div className={`w-9 h-9 border flex items-center justify-center flex-shrink-0 transition-colors ${active === i ? "border-[#C9A86C] text-[#C9A86C]" : "border-[#2A2520] text-[#5A5248]"}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className={`text-sm font-light transition-colors ${active === i ? "text-[#C9A86C]" : "text-[#8A8278]"}`}>{p.label}</div>
                    <div className="text-[10px] text-[#3A3028] mt-0.5">{p.price}</div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div key={active} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}
                className="p-8 md:p-12">
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <div className="w-12 h-12 border border-[#C9A86C] flex items-center justify-center flex-shrink-0">
                    <ActiveIcon className="w-6 h-6 text-[#C9A86C]" />
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="border border-[#2A2520] text-[#8A8278] px-3 py-1.5 flex items-center gap-1.5"><Clock className="w-3 h-3" />{PROTOCOLS[active].duration}</span>
                    <span className="border border-[#2A2520] text-[#8A8278] px-3 py-1.5">Reprise : {PROTOCOLS[active].recovery}</span>
                    <span className="border border-[#C9A86C]/30 text-[#C9A86C] px-3 py-1.5">{PROTOCOLS[active].price}</span>
                  </div>
                </div>
                <h2 className="text-2xl font-light mb-2" style={{ fontFamily: "'Bodoni Moda', serif" }}>{PROTOCOLS[active].title}</h2>
                <p className="text-xs text-[#C9A86C] mb-5 uppercase tracking-widest">{PROTOCOLS[active].results}</p>
                <p className="text-[#6A6058] leading-relaxed mb-6">{PROTOCOLS[active].fullDesc}</p>
                <div className="mb-8">
                  <p className="text-[10px] tracking-[0.2em] uppercase text-[#C9A86C] mb-4">Technologies utilisées</p>
                  {PROTOCOLS[active].detail.map(d => (
                    <div key={d} className="flex items-center gap-3 text-sm py-2 border-b border-[#1A1714]">
                      <div className="w-4 h-[1px] bg-[#C9A86C]" />
                      <span className="text-[#8A8278]">{d}</span>
                    </div>
                  ))}
                </div>
                <Link href={`${basePath}/rdv`}>
                  <button type="button"
                    className="inline-flex items-center gap-2 px-6 py-3 border border-[#C9A86C] text-[#C9A86C] text-xs uppercase tracking-widest hover:bg-[#C9A86C] hover:text-[#0C0C0A] transition-all duration-300 cursor-pointer">
                    Prendre rendez-vous <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Protocol cards grid */}
        <Reveal>
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#C9A86C] mb-8">Vue d&apos;ensemble</p>
        </Reveal>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#2A2520]">
          {PROTOCOLS.map((p, i) => {
            const Icon = p.icon;
            return (
              <Reveal key={p.id} delay={i * 0.06}>
                <div className="bg-[#0C0C0A] p-8 flex flex-col h-full border border-[#2A2520]/50 hover:border-[#C9A86C]/30 transition-colors">
                  <div className="w-10 h-10 border border-[#2A2520] flex items-center justify-center mb-5">
                    <Icon className="w-5 h-5 text-[#C9A86C]" />
                  </div>
                  <h3 className="text-lg font-light mb-2" style={{ fontFamily: "'Bodoni Moda', serif" }}>{p.label}</h3>
                  <p className="text-xs text-[#5A5248] leading-relaxed mb-5 flex-1">{p.desc}</p>
                  <div className="flex items-center justify-between text-xs border-t border-[#1A1714] pt-4">
                    <span className="text-[#C9A86C]">{p.price}</span>
                    <span className="text-[#3A3028]">{p.duration}</span>
                  </div>
                  <button type="button" onClick={() => { setActive(i); window.scrollTo({ top: 0, behavior: "smooth" }) }}
                    className="mt-4 text-xs text-[#8A8278] flex items-center gap-1.5 hover:text-[#C9A86C] transition-colors cursor-pointer">
                    En savoir plus <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </div>
  );
}
