"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal } from "./shared";

export default function LuminalHome() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <div>
      {/* ==========================================
          1. HERO (Atmospheric)
          ========================================== */}
      <section
        ref={heroRef}
        className="relative w-full h-[calc(100vh-112px)] flex flex-col justify-center overflow-hidden"
      >
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="absolute inset-0 z-0"
        >
          <Image
            src="https://picsum.photos/seed/wellness/1600/1000"
            alt="Wellness Hero"
            fill
            className="object-cover grayscale brightness-90"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#f8f5f0] via-[#f8f5f0]/30 to-transparent" />
        </motion.div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 w-full">
          <Reveal>
            <span className="text-[10px] md:text-[12px] uppercase tracking-[0.4em] font-bold text-[#3d7a5e] mb-8 block font-sans">
              Maximum 9 Participants · No Devices
            </span>
            <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-bold leading-[1.15] pb-4 tracking-tighter mb-12 uppercase font-serif">
              Rest is <br />{" "}
              <span className="italic font-light">the work.</span>
            </h1>
            <p className="max-w-xl text-lg md:text-xl text-black/50 leading-relaxed font-light mb-12">
              Luminal designs profound retreat experiences in the world&apos;s most
              transformative landscapes. We create the conditions for genuine
              rest through carefully calibrated stillness.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 font-sans">
              <Link href="/templates/impact-59/retreats" className="px-12 py-5 bg-black text-white text-[10px] uppercase tracking-[0.4em] font-bold rounded-full hover:bg-[#3d7a5e] transition-all cursor-pointer shadow-xl text-center" style={{ textDecoration: "none" }}>
                Explore 2026 Programme
              </Link>
              <Link href="/templates/impact-59/method" className="px-12 py-5 border border-black/10 text-black text-[10px] uppercase tracking-[0.4em] font-bold rounded-full hover:bg-black hover:text-white transition-all cursor-pointer text-center" style={{ textDecoration: "none" }}>
                The Luminal Method
              </Link>
            </div>
          </Reveal>
        </div>

        <motion.div
          style={{ opacity: heroOpacity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:block"
        >
          <div className="flex flex-col items-center gap-4">
            <span className="text-[8px] uppercase tracking-[0.3em] text-black/30 font-sans">
              Descend into Stillness
            </span>
            <div className="w-[1px] h-16 bg-gradient-to-b from-black/20 to-transparent" />
          </div>
        </motion.div>
      </section>
    </div>
  );
}
