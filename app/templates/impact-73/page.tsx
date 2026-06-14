// @ts-nocheck
"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Radio } from "lucide-react";
import { Reveal, MagneticBtn } from "./shared";

export default function StreamHubHome() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <div className="w-full">
      {/* ==========================================
          1. HERO (Cyber-Entertainment)
          ========================================== */}
      <section
        ref={heroRef}
        className="relative w-full h-[calc(100vh-7rem)] flex flex-col justify-center overflow-hidden"
      >
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="absolute inset-0 z-0"
        >
          <Image
            src="https://picsum.photos/seed/gaming/1600/1000"
            alt="StreamHub Hero"
            fill
            className="object-cover brightness-[0.2] opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08080c] via-[#08080c]/40 to-transparent" />
        </motion.div>

        {/* ROSE GRID OVERLAY */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(225,29,72,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(225,29,72,0.05)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent:80%)]" />

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 w-full">
          <Reveal>
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-rose-600/10 rounded-md border border-rose-600/30 text-rose-400 text-[10px] font-bold uppercase tracking-widest mb-10 shadow-sm">
              <Radio className="w-3.5 h-3.5" />
              Live: 8K HDR 120FPS Deployment Complete
            </div>
            <h1 className="text-7xl md:text-9xl lg:text-[11rem] font-black leading-[1.15] tracking-tighter mb-12 uppercase pb-6">
              Own The <br />{" "}
              <span className="text-rose-500 italic">Spectrum.</span>
            </h1>
            <p className="max-w-xl text-lg md:text-xl text-white/30 leading-relaxed font-bold mb-12 uppercase tracking-tight italic">
              Ultra-low latency streaming for the modern creator. Zero
              compression. Infinite scale. Direct-to-creator monetization.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <Link href="/templates/impact-73/browse" className="no-underline">
                <MagneticBtn className="px-12 py-5 bg-rose-600 text-white text-[10px] font-bold uppercase tracking-[0.4em] rounded-md hover:bg-rose-500 transition-all cursor-pointer shadow-2xl shadow-rose-600/20 border-none">
                  Join The Stream
                </MagneticBtn>
              </Link>
              <Link href="/templates/impact-73/contact" className="no-underline">
                <button className="px-12 py-5 border border-white/10 bg-transparent text-white text-[10px] font-bold uppercase tracking-[0.4em] rounded-md hover:bg-white hover:text-black transition-all cursor-pointer">
                  Partner_Inquiry
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
              STREAM_HUB_OS // V8.4.2
            </span>
            <div className="w-32 h-[1px] bg-rose-500/40" />
          </div>
        </motion.div>
      </section>

      {/* ==========================================
          EXTRA CTAS SECTION
          ========================================== */}
      <section className="py-24 bg-[#08080c] border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 text-center">
          <Reveal>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white mb-8 italic">
              Ready to broadcast your <span className="text-rose-500">Talent</span>?
            </h2>
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/templates/impact-73/go-live" className="no-underline">
                <button className="px-10 py-4 bg-rose-600 text-white hover:bg-rose-500 text-[10px] font-bold uppercase tracking-widest rounded-md cursor-pointer transition-all border-none">
                  Start Streaming Now
                </button>
              </Link>
              <Link href="/templates/impact-73/browse" className="no-underline">
                <button className="px-10 py-4 border border-white/10 bg-transparent text-white/60 hover:text-white text-[10px] font-bold uppercase tracking-widest rounded-md cursor-pointer transition-all">
                  Browse Active Channels
                </button>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
