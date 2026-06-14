// @ts-nocheck
"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Compass } from "lucide-react";
import { Reveal, MagneticBtn } from "./shared";

export default function StructuraArchPage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <div className="relative w-full">
      {/* ==========================================
          1. HERO (Architecture Cinematic)
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
            src="https://picsum.photos/seed/realestate/1600/1000"
            alt="Structura Hero"
            fill
            className="object-cover brightness-50 grayscale-[0.5]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent" />
        </motion.div>

        {/* GLASSMOPHISM HUD ELEMENT */}
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <motion.div
            animate={{ rotate: [0, 1, 0] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="w-[80vw] h-[80vw] border border-white/5 rounded-full absolute"
          />
          <motion.div
            animate={{ rotate: [0, -1, 0] }}
            transition={{ duration: 15, repeat: Infinity }}
            className="w-[60vw] h-[60vw] border border-white/5 rounded-full absolute"
          />
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 w-full">
          <Reveal>
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-md rounded-none border border-white/10 text-white/40 text-[10px] font-bold uppercase tracking-widest mb-10 shadow-sm">
              <Compass className="w-3.5 h-3.5" />
              Structural Intelligence // Generative Design
            </div>
            <h1 className="text-7xl md:text-9xl lg:text-[11rem] font-black leading-[1.15] tracking-tighter mb-12 uppercase pb-6">
              Void & <br />{" "}
              <span className="text-stone-500 italic">Volume.</span>
            </h1>
            <p className="max-w-xl text-lg md:text-xl text-white/20 leading-relaxed font-bold mb-12 uppercase tracking-tight italic">
              Redefining the relationship between structure and environment.
              Pushing the limits of computational architecture.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <Link href="/templates/impact-76/archive">
                <MagneticBtn className="px-12 py-5 bg-white text-black text-[10px] font-bold uppercase tracking-[0.4em] rounded-none hover:bg-stone-200 transition-all cursor-pointer shadow-2xl">
                  View Projects
                </MagneticBtn>
              </Link>
              <Link href="/templates/impact-76/process">
                <button className="px-12 py-5 border border-white/10 text-white text-[10px] font-bold uppercase tracking-[0.4em] rounded-none hover:bg-white hover:text-black transition-all cursor-pointer">
                  Technical_Audit
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
              AEVIA_STRUCTURA // CORE_SYS_076
            </span>
            <div className="w-32 h-[1px] bg-white/10" />
          </div>
        </motion.div>
      </section>
    </div>
  );
}
