"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal, MagneticBtn } from "./shared";

export default function SatoriHomePage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <div className="bg-[#0f0d0b] text-[#f5efe0]">
      {/* ── HERO ──────────────────── */}
      <section
        ref={heroRef}
        className="relative w-full h-[85svh] flex flex-col justify-end overflow-hidden pb-32"
      >
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="absolute inset-0 z-0"
        >
          <Image
            src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1600&q=80"
            alt="Fine Dining Hero"
            fill
            className="object-cover brightness-[0.3]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0d0b] via-transparent to-transparent" />
        </motion.div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 w-full">
          <Reveal>
            <h1 className="text-7xl md:text-9xl lg:text-[11rem] font-light leading-[1.15] pb-4 tracking-tighter mb-12 uppercase text-white">
              Surrender <br />{" "}
              <span className="italic font-normal text-[#b8860b]">
                to fire.
              </span>
            </h1>
            <p className="max-w-xl text-lg md:text-xl text-[#f5efe0]/40 leading-relaxed font-light mb-12 italic">
              Chef Anatol Voss transforms memory, season, and flame into a
              dining experience that transcends cuisine.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <Link href="/templates/impact-62/contact" style={{ textDecoration: "none" }}>
                <MagneticBtn
                  className="px-12 py-5 bg-[#b8860b] text-black text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-white transition-all cursor-pointer shadow-2xl border-none"
                >
                  Secure a Table
                </MagneticBtn>
              </Link>
              <Link href="/templates/impact-62/menu" className="px-12 py-5 border border-[#f5efe0]/10 text-[#f5efe0] text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-[#f5efe0] hover:text-black transition-all cursor-pointer text-center" style={{ textDecoration: "none" }}>
                The Tasting Menu
              </Link>
            </div>
          </Reveal>
        </div>

        <motion.div
          style={{ opacity: heroOpacity }}
          className="absolute bottom-10 right-12 hidden md:block"
        >
          <div className="flex flex-col items-end gap-3">
            <span className="text-[9px] font-bold text-[#f5efe0]/20 uppercase tracking-[0.5em]">
              Paris // Geneva // Tokyo
            </span>
            <div className="w-24 h-[1px] bg-[#b8860b]/30" />
          </div>
        </motion.div>
      </section>
    </div>
  );
}
