"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Reveal, MODELS } from "../shared";

export default function CollectionsPage() {
  return (
    <div className="bg-black text-[#a0a0a0] min-h-screen pb-24">
      <section className="py-20 max-w-[1400px] mx-auto px-6 md:px-12">
        <Reveal>
          <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-[#c9a96e] mb-6 block">
            The Current Catalog
          </span>
          <h2 className="text-5xl md:text-8xl font-light tracking-tighter uppercase leading-[1.15] pb-4 mb-20 italic text-white">
            Atelier <br />
            <span className="font-bold not-italic opacity-30">Collections.</span>
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 mt-16">
          {MODELS.map((item, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="group border border-white/5 bg-white/[0.01] p-4 flex flex-col justify-between h-full">
                <div>
                  <div className="aspect-[4/5] relative mb-8 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-1000 border border-white/5 p-2 bg-white/[0.02]">
                    <Image
                      src={item.img}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-all duration-[3000ms]"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-all duration-1000" />
                  </div>
                  <div className="px-2">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-[#c9a96e] block mb-2">
                      Ref: 0{i + 1} // Limited Edition
                    </span>
                    <h3 className="text-3xl font-bold uppercase tracking-widest text-white mb-4">
                      {item.name}
                    </h3>
                    <p className="text-sm font-light text-white/30 leading-relaxed italic mb-6">
                      Equipped with Caliber-9 micro-rotor, high frequency escapement, and double barrel system. Hand-finished details.
                    </p>
                  </div>
                </div>

                <div className="px-2 pt-6 border-t border-white/5 flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase tracking-widest text-white/20">EST. PRICE</span>
                    <span className="text-xl font-bold text-white tracking-tighter italic mt-1">{item.price}</span>
                  </div>
                  <Link
                    href="/templates/impact-60/contact"
                    className="px-6 py-3.5 bg-white text-black text-[9px] font-bold uppercase tracking-widest hover:bg-[#c9a96e] hover:text-black transition-all duration-700"
                    style={{ textDecoration: "none" }}
                  >
                    Request
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
