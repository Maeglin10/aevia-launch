"use client";

import Image from "next/image";
import { Search, Droplets, Zap, Flower2, Quote } from "lucide-react";
import { Reveal } from "../shared";

export default function RitualsPage() {
  const steps = [
    { title: "Consultation & Mapping", desc: "We analyze your skin bio-type and facial geometry to calibrate custom active serum formulas.", icon: <Search className="w-6 h-6" /> },
    { title: "Thermal Prep", desc: "Ozonated steam opens cellular structures to receive bio-active nutrients.", icon: <Droplets className="w-6 h-6" /> },
    { title: "Micro-current Infusion", desc: "Non-invasive currents deliver active collagen and botanicals directly into deeper layers.", icon: <Zap className="w-6 h-6" /> },
    { title: "Regeneration Shield", desc: "A cold-pressed botanical mask locks in nutrients and cools the dermis for immediate radiance.", icon: <Flower2 className="w-6 h-6" /> }
  ];

  return (
    <div className="bg-white text-[#1a1814] py-24 px-6 md:px-12">
      <div className="max-w-[1400px] mx-auto">

        {/* Header */}
        <Reveal>
          <div className="flex flex-col mb-24 text-center">
            <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-[#c9b7a1] mb-6 block">
              Our Methodology
            </span>
            <h1 className="text-6xl md:text-8xl font-light tracking-tighter uppercase leading-[1.15] pb-4">
              Cellular <span className="italic">Infusion Protocol.</span>
            </h1>
          </div>
        </Reveal>

        {/* Protocol Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-center mb-32">
          <div className="lg:col-span-5 space-y-12">
            {steps.map((s, idx) => (
              <Reveal key={idx} delay={idx * 0.1}>
                <div className="flex gap-8 items-start border-l border-[#c9b7a1]/20 pl-8 hover:border-[#c9b7a1] transition-all">
                  <div className="text-[#c9b7a1]">
                    {s.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-black uppercase tracking-tight mb-2">
                      0{idx + 1}. {s.title}
                    </h3>
                    <p className="text-xs text-[#1a1814]/50 leading-relaxed font-light">
                      {s.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="lg:col-span-7">
            <Reveal className="relative aspect-square md:aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=1200&q=80"
                alt=" skincaere session"
                fill
                className="object-cover"
              />
            </Reveal>
          </div>
        </div>

        {/* Quote Block */}
        <Reveal className="max-w-4xl mx-auto text-center py-20 border-t border-[#1a1814]/5">
          <Quote className="w-12 h-12 text-[#c9b7a1] mx-auto mb-8" />
          <p className="text-2xl md:text-4xl font-light italic leading-relaxed text-[#1a1814]/70 mb-8">
            "Skin behaves like architecture. When the foundations are balanced and the structural components are nourished, the surface achieves timeless symmetry."
          </p>
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#c9b7a1]">
            Sophie Laurent — Founder & Master Esthetician
          </span>
        </Reveal>

      </div>
    </div>
  );
}
