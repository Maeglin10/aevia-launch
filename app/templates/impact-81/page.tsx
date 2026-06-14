"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal, Instagram, Twitter } from "./shared";

export default function VogueNoirePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroImgY = useTransform(heroScroll, [0, 1], ["0%", "30%"]);
  const basePath = "/templates/impact-81";

  return (
    <div className="bg-[#0A0A08] text-[#F0EBE0]">
      {/* Hero — asymmetric mosaic */}
      <section ref={heroRef} className="relative min-h-screen overflow-hidden">
        <motion.div className="absolute inset-0" style={{ y: heroImgY }}>
          <Image src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=85" alt="Vogue Noire" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A08] via-[#0A0A08]/50 to-[#0A0A08]/20" />
        </motion.div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-32 min-h-screen flex flex-col">
          <div className="flex-1 flex flex-col justify-center">
            <Reveal>
              <p className="text-[10px] tracking-[0.4em] uppercase text-[#C9A86C] mb-8">Numéro 214 · Janvier 2025</p>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-light leading-[1.15] mb-8 tracking-tight pb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Corps<br /><em>Céleste</em>
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-[#A0988A] text-lg max-w-md leading-relaxed mb-10">
                La saison Automne / Hiver 2025 porte en elle une nouvelle grammaire du corps. Entre retenue et explosion, les maisons réinventent leur vocabulaire.
              </p>
              <Link href={`${basePath}/editoriaux`} className="inline-flex items-center gap-3 text-sm tracking-widest uppercase border-b border-[#C9A86C] pb-1 text-[#C9A86C] hover:text-[#F0EBE0] hover:border-[#F0EBE0] transition-colors cursor-pointer">
                Explorer le numéro <ArrowRight className="w-4 h-4" />
              </Link>
            </Reveal>
          </div>
          {/* Bottom meta */}
          <div className="pb-12 flex items-center justify-between">
            <div className="flex gap-10 text-xs text-[#6A6058] tracking-wide">
              <span>Couverture : Maison Leroux</span>
              <span>Photo : E. Fontaine</span>
            </div>
            <div className="flex gap-4">
              <Link href="#" className="w-9 h-9 border border-[#3A3028] flex items-center justify-center hover:border-[#F0EBE0] transition-colors cursor-pointer"><Instagram className="w-4 h-4" /></Link>
              <Link href="#" className="w-9 h-9 border border-[#3A3028] flex items-center justify-center hover:border-[#F0EBE0] transition-colors cursor-pointer"><Twitter className="w-4 h-4" /></Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
