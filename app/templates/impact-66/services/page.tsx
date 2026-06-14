"use client";

import Image from "next/image";
import { Heart } from "lucide-react";
import { SERVICES, Reveal } from "../shared";

export default function ServicesPage() {
  const handleBook = () => {
    window.dispatchEvent(new Event("open-atelier-booking"));
  };

  return (
    <div className="bg-[#faf9f6] text-[#1a1814] py-24 px-6 md:px-12">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Header */}
        <Reveal>
          <div className="flex flex-col mb-24 text-center">
            <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-[#1a1814]/40 mb-6 block">
              La Carte des Soins
            </span>
            <h1 className="text-6xl md:text-8xl font-light tracking-tighter uppercase leading-[1.15] pb-4">
              Our <span className="italic text-[#c9b7a1]">Rituals & Services.</span>
            </h1>
          </div>
        </Reveal>

        {/* Services List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {SERVICES.map((item, i) => (
            <Reveal key={item.id} delay={i * 0.1}>
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#1a1814]/5 flex flex-col md:flex-row gap-8 items-center">
                <div className="relative w-full md:w-48 aspect-square overflow-hidden rounded-2xl flex-shrink-0">
                  <Image
                    src={item.img}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-grow flex flex-col justify-between h-full">
                  <div>
                    <span className="text-[9px] uppercase tracking-[0.3em] text-[#c9b7a1] font-black block mb-2">
                      {item.tag}
                    </span>
                    <h3 className="text-2xl font-light tracking-tight mb-4">
                      {item.name}
                    </h3>
                    <p className="text-xs text-[#1a1814]/50 leading-relaxed font-light mb-6">
                      {item.desc}
                    </p>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-[#1a1814]/5">
                    <span className="text-base font-bold text-[#1a1814]">
                      {item.price}
                    </span>
                    <button
                      onClick={handleBook}
                      className="px-6 py-2 bg-[#1a1814] text-white text-[9px] font-bold uppercase tracking-widest rounded-full hover:bg-[#c9b7a1] transition-all cursor-pointer border-none"
                    >
                      Réserver
                    </button>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

      </div>
    </div>
  );
}
