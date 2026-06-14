// @ts-nocheck
"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Coffee } from "lucide-react";
import { Reveal, MagneticBtn } from "./shared";

export default function AetherRoasteryPage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <div className="relative w-full">
      {/* ==========================================
          1. HERO (Cinematic Coffee)
          ========================================== */}
      <section
        ref={heroRef}
        className="relative w-full h-[85vh] flex flex-col justify-center overflow-hidden"
      >
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="absolute inset-0 z-0"
        >
          <Image
            src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1600&q=80"
            alt="Aether Hero"
            fill
            className="object-cover brightness-50 contrast-125 grayscale-[0.3]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a09] via-transparent to-transparent" />
        </motion.div>

        {/* ORANGE PARTICLE GLOW */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-orange-900/10 rounded-full blur-[150px] pointer-events-none" />

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 w-full">
          <Reveal>
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-orange-900/20 rounded-none border border-orange-900/40 text-orange-500 text-[10px] font-bold uppercase tracking-widest mb-10 shadow-sm">
              <Coffee className="w-3.5 h-3.5" />
              Specialty Grade // 90+ SCA Points
            </div>
            <h1 className="text-7xl md:text-9xl lg:text-[11rem] font-black leading-[1.15] tracking-tighter mb-12 uppercase pb-6">
              The Alchemy <br />{" "}
              <span className="text-orange-900 italic">of Extraction.</span>
            </h1>
            <p className="max-w-xl text-lg md:text-xl text-white/20 leading-relaxed font-bold mb-12 uppercase tracking-tight italic">
              Precision-roasted molecular coffee. Sourced at origin. Analyzed in
              lab. Delivered in spectrum.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <Link href="/templates/impact-78/collection">
                <MagneticBtn className="px-12 py-5 bg-white text-black text-[10px] font-bold uppercase tracking-[0.4em] rounded-none hover:bg-orange-900 hover:text-white transition-all cursor-pointer shadow-2xl">
                  Explore Roast Spectrum
                </MagneticBtn>
              </Link>
              <Link href="/templates/impact-78/brewing">
                <button className="px-12 py-5 border border-white/10 text-white text-[10px] font-bold uppercase tracking-[0.4em] rounded-none hover:bg-white hover:text-black transition-all cursor-pointer">
                  Technical_Brew_Log
                </button>
              </Link>
            </div>
          </Reveal>
        </div>

        <motion.div
          style={{ opacity: heroOpacity }}
          className="absolute bottom-10 left-12 hidden md:block"
        >
          <div className="flex flex-col items-start gap-3">
            <span className="text-[9px] font-bold text-white/10 uppercase tracking-[0.5em]">
              AETHER_ROAST_OS // NODE_078
            </span>
            <div className="w-32 h-[1px] bg-orange-900/40" />
          </div>
        </motion.div>
      </section>
    </div>
  );
}
