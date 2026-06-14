// @ts-nocheck
"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, ArrowRight, Activity, Terminal } from "lucide-react";
import { Reveal, MagneticBtn } from "./shared";

export default function CyberSecurityPage() {
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
          1. HERO (Cyber-Defensive)
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
            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1600&q=80"
            alt="Cyber Hero"
            fill
            className="object-cover brightness-[0.2] opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#05060a] via-[#05060a]/40 to-transparent" />
        </motion.div>

        {/* EMERALD GRID OVERLAY */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 w-full">
          <Reveal>
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-emerald-600/10 rounded-md border border-emerald-600/30 text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-10 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5" />
              DHS & CISA COMPLIANT INFRASTRUCTURE
            </div>
            <h1 className="text-7xl md:text-9xl lg:text-[11rem] font-black leading-[1.15] tracking-tighter mb-12 uppercase pb-6">
              Defense <br />{" "}
              <span className="text-emerald-500 italic">In Depth.</span>
            </h1>
            <p className="max-w-xl text-lg md:text-xl text-white/30 leading-relaxed font-bold mb-12 uppercase tracking-tight italic">
              Institutional-grade cybersecurity for the digital perimeter.
              Real-time threat detection. Automated auditing. Immutable logs.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <Link href="/templates/impact-74/contact">
                <MagneticBtn className="px-12 py-5 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-[0.4em] rounded-md hover:bg-emerald-500 transition-all cursor-pointer shadow-2xl shadow-emerald-600/20">
                  Secure Onboarding
                </MagneticBtn>
              </Link>
              <Link href="/templates/impact-74/solutions">
                <button className="px-12 py-5 border border-white/10 text-white text-[10px] font-bold uppercase tracking-[0.4em] rounded-md hover:bg-white hover:text-black transition-all cursor-pointer">
                  Technical_Specs
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
              AEVIA_PROTOCOL // CORE_V4.7.4
            </span>
            <div className="w-32 h-[1px] bg-emerald-500/40" />
          </div>
        </motion.div>
      </section>

      {/* QUICK CORE STATS SECTION */}
      <section className="py-24 bg-[#05060a]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-white/5 pt-12">
            <Reveal delay={0.1}>
              <div className="space-y-2">
                <div className="text-emerald-500 text-[10px] font-bold uppercase tracking-widest">01 // INTEGRITY</div>
                <h3 className="text-2xl font-black uppercase text-white">Always-on Monitoring</h3>
                <p className="text-xs text-white/40 uppercase leading-relaxed font-bold">
                  Proactive behavioral analysis with real-time global telemetry streaming.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="space-y-2">
                <div className="text-emerald-500 text-[10px] font-bold uppercase tracking-widest">02 // TRUST</div>
                <h3 className="text-2xl font-black uppercase text-white">Immutable Ledger</h3>
                <p className="text-xs text-white/40 uppercase leading-relaxed font-bold">
                  Zero unauthorized log tampering due to decentralized audit consensus.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="space-y-2">
                <div className="text-emerald-500 text-[10px] font-bold uppercase tracking-widest">03 // SPEED</div>
                <h3 className="text-2xl font-black uppercase text-white">Sub-ms Isolation</h3>
                <p className="text-xs text-white/40 uppercase leading-relaxed font-bold">
                  Quantum hardware-level random address sandboxing for critical perimeters.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
