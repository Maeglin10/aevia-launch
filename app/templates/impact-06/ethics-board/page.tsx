"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, Brain, Scan } from "lucide-react"

export default function Page() {
  return (
    <div className="premium-theme min-h-screen bg-[#020204] text-[#e0e0e0] font-sans selection:bg-[#00f2ff] selection:text-black overflow-x-hidden flex flex-col">
      <nav className="w-full py-8 border-b border-white/5 bg-transparent">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/templates/impact-06" className="group flex flex-col items-center">
             <span className="text-3xl font-black tracking-[-0.05em] uppercase leading-none">Neuralis</span>
             <span className="text-[8px] font-bold uppercase tracking-[0.5em] text-[#00f2ff] -mt-1 ml-1">Augmentation Lab</span>
          </Link>
          <Link href="/templates/impact-06" className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-white/60 hover:text-[#00f2ff] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Return to Core
          </Link>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center py-40">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl mx-auto px-6 text-center"
        >
          <Scan className="w-16 h-16 text-[#00f2ff] mx-auto mb-10 opacity-50" />
          <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white mb-6">
            <span className="text-[#00f2ff] not-italic">Ethics Board</span>
          </h1>
          <p className="text-white/40 text-sm font-light uppercase tracking-widest italic leading-loose mb-12">
            This sector of the Neuralis grid is currently undergoing biometric synchronization. 
            Full protocol access will be granted in the next iteration cycle.
          </p>
          <div className="flex items-center justify-center gap-4">
             <div className="w-2 h-2 rounded-full bg-[#00f2ff] animate-pulse" />
             <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-[#00f2ff]">Sync in Progress</span>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
