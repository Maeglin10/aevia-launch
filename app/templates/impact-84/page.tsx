"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Reveal } from "./shared";

export default function CypherClinicPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroImgY = useTransform(heroScroll, [0, 1], ["0%", "30%"]);
  const basePath = "/templates/impact-84";

  return (
    <div className="bg-[#0C0C0A] text-[#F0EBE0]">
      {/* Hero */}
      <section ref={heroRef} className="relative min-h-[90vh] overflow-hidden flex items-center">
        <motion.div className="absolute inset-0" style={{ y: heroImgY }}>
          <Image src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1600&q=85&fit=crop" alt="Cypher Clinic" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0C0C0A]/95 via-[#0C0C0A]/70 to-[#0C0C0A]/20" />
        </motion.div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-24 w-full flex flex-col justify-center">
          <Reveal>
            <div className="flex items-center gap-2 mb-8">
              <Sparkles className="w-4 h-4 text-[#C9A86C]" />
              <span className="text-xs tracking-[0.3em] uppercase text-[#C9A86C]">Clinique d&apos;excellence médicale</span>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-5xl md:text-7xl font-light text-[#F0EBE0] leading-[1.2] mb-8 max-w-3xl pb-4" style={{ fontFamily: "'Bodoni Moda', serif" }}>
              L&apos;art de la médecine<br />esthétique de <em>précision</em>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-[#8A8278] text-lg max-w-xl mb-12 leading-relaxed">
              Une harmonie mesurée entre rigueur scientifique et vision artistique du visage. Nos protocoles de pointe respectent votre morphologie naturelle pour des résultats invisibles et durables.
            </p>
            <div className="flex flex-col sm:flex-row gap-5">
              <Link href={`${basePath}/protocoles`} className="inline-flex items-center gap-3 px-8 py-4 bg-[#C9A86C] text-[#0C0C0A] font-medium text-sm tracking-wide uppercase hover:bg-[#E0BC70] transition-colors cursor-pointer">
                Découvrir nos protocoles <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href={`${basePath}/rdv`} className="inline-flex items-center gap-3 px-8 py-4 border border-[#C9A86C] text-[#C9A86C] font-light text-sm tracking-wide uppercase hover:bg-[#C9A86C] hover:text-[#0C0C0A] transition-all cursor-pointer">
                Demander un rendez-vous
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
