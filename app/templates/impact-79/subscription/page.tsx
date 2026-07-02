"use client";
// @ts-nocheck

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Wheat, Shield, Globe, Activity, Search, Box } from "lucide-react";
import "../../premium.css";

export default function Page() {
  return (
    <div className="premium-theme min-h-screen bg-[#0a0a0a] text-[#d6d3d1] font-mono selection:bg-stone-800 selection:text-white">
      <nav className="fixed top-0 left-0 w-full z-50 bg-black/95 backdrop-blur-xl py-4 border-b border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/templates/impact-79" className="flex items-center gap-3 text-white/50 hover:text-white transition-colors uppercase tracking-[0.3em] text-[10px] font-bold">
            <ArrowLeft className="w-4 h-4" />
            Return_To_Base
          </Link>
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-stone-600 mb-1">
              Artisanal.
            </span>
            <span className="text-xl md:text-2xl font-black tracking-tighter uppercase text-white">
              BOULANGERIE<span className="text-stone-800">.NOIRE</span>
            </span>
          </div>
        </div>
      </nav>

      <main className="pt-40 pb-24 px-6 md:px-12 max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-stone-900/30 rounded-none border border-white/5 text-stone-400 text-[10px] font-bold uppercase tracking-widest mb-10 shadow-sm">
            <Wheat className="w-3.5 h-3.5" />
            BOULANGERIE_NOIRE_SYS // SUBSCRIPTION
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[1.15] text-white italic mb-8">
            Subscription <span className="text-stone-800 not-italic"></span>
          </h1>
          
          <p className="max-w-2xl text-lg md:text-xl text-white/20 leading-relaxed font-bold mb-16 uppercase tracking-tight italic">
            Bake Buffer & Membership
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
            <div className="p-10 bg-white/[0.02] border border-white/5 hover:border-stone-800 transition-all group">
              <Activity className="w-8 h-8 text-stone-600 mb-6" />
              <h3 className="text-xl font-black uppercase text-white italic mb-4">System Status</h3>
              <p className="text-[10px] text-white/20 uppercase tracking-widest leading-relaxed italic">
                All parameters nominal. Fermentation sync active and monitoring.
              </p>
            </div>
            <div className="p-10 bg-white/[0.02] border border-white/5 hover:border-stone-800 transition-all group">
              <Shield className="w-8 h-8 text-stone-600 mb-6" />
              <h3 className="text-xl font-black uppercase text-white italic mb-4">Security Protocol</h3>
              <p className="text-[10px] text-white/20 uppercase tracking-widest leading-relaxed italic">
                Data encrypted. Grain sourcing logs verified.
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
