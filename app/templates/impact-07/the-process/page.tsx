// @ts-nocheck
"use client"

import { motion } from "framer-motion"
import { ArrowLeft, Volume2, Speaker, Waves, Activity } from "lucide-react"
import Link from "next/link"
import "../../premium.css"

export default function TheProcessPage() {
  return (
    <div className="premium-theme min-h-screen bg-[#080808] text-[#d4d4d4] font-sans selection:bg-[#c9a84c] selection:text-black overflow-x-hidden">
      
      {/* ── NAVIGATION ── */}
      <nav className="fixed top-0 left-0 w-full z-50 transition-all duration-700 bg-black/90 backdrop-blur-2xl py-4 border-b border-white/5">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/templates/impact-07" className="group flex flex-col items-center">
             <span className="text-3xl font-black tracking-[0.1em] uppercase leading-none italic">Aether</span>
             <span className="text-[8px] font-bold uppercase tracking-[0.6em] text-[#c9a84c] -mt-1 ml-1">Sound Labs</span>
          </Link>
          
          <Link href="/templates/impact-07" className="flex items-center gap-3 group">
             <ArrowLeft className="w-4 h-4 text-white/40 group-hover:text-[#c9a84c] transition-colors" />
             <span className="text-[10px] font-bold uppercase tracking-widest text-white/60 group-hover:text-[#c9a84c] transition-colors">Return</span>
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-[70svh] flex items-center overflow-hidden pt-32">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-12 w-full">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}>
             <div className="bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/30 text-[10px] font-bold uppercase tracking-[0.5em] mb-10 px-4 py-1.5 rounded-full inline-block">
                Archive // THE PROCESS
             </div>
             <h1 className="text-6xl md:text-[8rem] font-black leading-[0.75] tracking-tighter mb-12 uppercase text-white italic">
               The Process <br/>
               <span className="text-[#c9a84c] not-italic">Archive.</span>
             </h1>
             <p className="max-w-xl text-xl text-white/30 leading-relaxed font-light mb-12 uppercase tracking-widest italic">
               This section explores the acoustic details and engineering philosophy behind our THE PROCESS initiatives. 
             </p>
          </motion.div>
        </div>
      </section>

    </div>
  )
}
