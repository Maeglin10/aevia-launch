// @ts-nocheck
"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Radio, Terminal } from "lucide-react";
import { Reveal, GridBackground } from "./shared";

export default function OrbitAIPage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <div className="relative w-full">
      {/* ── HERO ──────────────────── */}
      <section
        ref={heroRef}
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        <GridBackground />
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="absolute inset-0 z-0"
        >
          <Image
            src="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=2400"
            alt="Earth from Space"
            fill
            className="object-cover opacity-20 scale-110"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050810] via-transparent to-[#050810]/50" />
        </motion.div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 w-full text-center lg:text-left">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div>
              <Reveal>
                <div className="inline-flex items-center gap-4 mb-10 text-cyan-500 text-[10px] font-bold uppercase tracking-[0.5em] italic">
                  <Terminal className="w-4 h-4" /> Global_Uplink_Established
                </div>
              </Reveal>
              <Reveal delay={0.1} y={100}>
                <h1 className="text-7xl md:text-[12vw] font-black tracking-tighter leading-[1.15] uppercase mb-16 italic text-white pb-6">
                  Eyes <br />{" "}
                  <span className="text-white/10 not-italic">Universal.</span>
                </h1>
              </Reveal>
              <Reveal delay={0.3}>
                <p className="text-xl text-white/30 font-light max-w-xl leading-relaxed italic uppercase mb-16">
                  Deploying the world's most advanced autonomous satellite
                  constellation for real-time global intelligence.
                </p>
                <div className="flex flex-col sm:flex-row gap-10 items-center justify-center lg:justify-start">
                  <Link href="/templates/impact-75/contact">
                    <button className="px-16 py-6 bg-cyan-500 text-black font-black uppercase tracking-widest text-[10px] hover:px-20 transition-all duration-700 shadow-[0_0_40px_rgba(6,182,212,0.2)]">
                      Acquire Data Stream
                    </button>
                  </Link>
                  <Link href="/templates/impact-75/telemetry">
                    <div className="text-[10px] font-black uppercase tracking-widest text-white/20 flex items-center gap-4 group cursor-pointer hover:text-white transition-colors">
                      Live Telemetry{" "}
                      <Radio className="w-5 h-5 text-cyan-500 animate-pulse" />
                    </div>
                  </Link>
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.5} y={0}>
              <div className="relative p-10 bg-white/5 border border-white/10 rounded shadow-2xl overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 text-cyan-500/20">
                  <Radio className="w-40 h-40 animate-ping" />
                </div>
                <div className="relative z-10 space-y-12">
                  <div className="flex justify-between border-b border-white/5 pb-8">
                    <div className="text-xs font-black text-cyan-500 tracking-widest uppercase italic">
                      Network Overview
                    </div>
                    <div className="text-[10px] text-white/30 uppercase tracking-widest">
                      v4.0.2
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-12">
                    {[
                      { l: "Satellites Active", v: "1,242" },
                      { l: "Global Latency", v: "14ms" },
                      { l: "Data Throughput", v: "4.2 PB/s" },
                      { l: "Security Level", v: "Quantum" },
                    ].map((stat, i) => (
                      <div key={i}>
                        <div className="text-[8px] font-bold text-white/20 uppercase tracking-widest mb-2 italic">
                          {stat.l}
                        </div>
                        <div className="text-2xl font-black text-white italic tracking-tighter">
                          {stat.v}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-[30%] h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                    />
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
