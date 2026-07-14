"use client";

import React from "react";
import Image from "next/image";
import { Utensils, FlaskConical, Flame, Wine } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Reveal, Counter } from "../shared";

export default function ChefPage() {
  return (
    <div className="bg-[#0f0d0b] text-[#f5efe0] min-h-dvh pb-24">
      {/* ── THE CHEF SECTION ── */}
      <section className="py-20 max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-center">
          <div className="lg:col-span-5 order-2 lg:order-1 text-left">
            <Reveal>
              <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#b8860b] mb-6 block">
                The Architect of Fire
              </span>
              <h2 className="text-5xl md:text-8xl font-light tracking-tighter leading-[1.15] pb-4 mb-12 uppercase text-white">
                Anatol <br /> <span className="italic">Voss.</span>
              </h2>
              <p className="text-lg text-[#f5efe0]/40 leading-relaxed font-light mb-12 italic">
                &quot;Gastronomy is the only art form that enters the bloodstream
                directly. We don&apos;t just cook; we manage sensory memory.&quot;
              </p>

              <div className="grid grid-cols-2 gap-8 mb-16">
                {[
                  { label: "Michelin_Stars", val: 3 },
                  { label: "Global_Rank", val: 7, prefix: "#" },
                  { label: "Years_Mastery", val: 18 },
                  { label: "Artisan_Partners", val: 42 },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="flex flex-col gap-2 p-8 border border-white/5 bg-white/[0.02] hover:border-[#b8860b]/30 transition-all"
                  >
                    <div className="text-4xl font-light text-[#b8860b]">
                      <Counter to={stat.val} prefix={stat.prefix} />
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/20">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7 order-1 lg:order-2">
            <Reveal className="relative aspect-square md:aspect-[16/9] rounded-sm overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=1200&auto=format&fit=crop"
                alt="Chef Portrait"
                fill
                className="object-cover grayscale brightness-50"
              />
              <div className="absolute inset-0 bg-[#b8860b]/5 mix-blend-overlay" />
              <div className="absolute bottom-10 right-10 flex gap-4">
                <div className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest">
                  Est. 2006
                </div>
                <div className="px-6 py-3 bg-[#b8860b] text-black text-[10px] font-bold uppercase tracking-widest shadow-xl">
                  Legion d&apos;Honneur
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── GASTRONOMY LABS ── */}
      <section className="py-20 bg-[#0f0d0b] border-t border-[#b8860b]/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-5 pointer-events-none">
          <Utensils className="w-full h-full text-white" />
        </div>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="text-left">
              <Reveal>
                <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#b8860b] mb-6 block">
                  Innovation Hub
                </span>
                <h2 className="text-5xl md:text-7xl font-light tracking-tighter leading-[1.15] pb-4 mb-12 uppercase text-white">
                  The <br /> <span className="italic">Laboratory.</span>
                </h2>
                <p className="text-lg text-[#f5efe0]/30 leading-relaxed font-light italic mb-16">
                  Satori Labs is where we develop our proprietary ferments and
                  charcoal extractions. 30% of our R&D never reaches the plate —
                  it exists solely to push the boundaries of flavor.
                </p>

                <div className="space-y-6">
                  {[
                    {
                      label: "Molecular Extraction",
                      icon: <FlaskConical className="w-4 h-4" />,
                      prog: 92,
                    },
                    {
                      label: "Charcoal Distillation",
                      icon: <Flame className="w-4 h-4" />,
                      prog: 78,
                    },
                    {
                      label: "Oenology Research",
                      icon: <Wine className="w-4 h-4" />,
                      prog: 85,
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="p-8 border border-white/5 bg-white/[0.01]"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="text-[#b8860b]">{item.icon}</div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-white">
                            {item.label}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-[#b8860b]">
                          {item.prog}% COMPLETE
                        </span>
                      </div>
                      <Progress
                        value={item.prog}
                        className="h-0.5 bg-white/5 [&>div]:bg-[#b8860b]"
                      />
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            <Reveal className="relative aspect-square rounded-sm overflow-hidden shadow-2xl border-t border-r border-white/10 p-1">
              <div className="relative h-full w-full overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&q=80"
                  alt="Laboratory"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#b8860b] mb-4 block">
                      Confidential Data
                    </span>
                    <h4 className="text-4xl font-light italic text-white uppercase tracking-tighter">
                      Protocol 042.
                    </h4>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
