"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Zap, ArrowLeft, Shield, Cpu } from "lucide-react";

export default function StatusPage() {
  return (
    <div className="bg-[#09090b] text-white min-h-screen selection:bg-violet-500 font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-[#09090b]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex justify-between items-center">
          <Link href="/templates/impact-05" className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">NovaPlatform</span>
          </Link>
          <Link href="/templates/impact-05" className="text-sm text-zinc-400 hover:text-white transition-all duration-200 flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 z-0">
          <motion.div animate={{ x: [0, 20, 0], y: [0, -15, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px]" />
          <motion.div animate={{ x: [0, -20, 0], y: [0, 15, 0] }} transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[10%] right-[20%] w-[400px] h-[400px] bg-fuchsia-600/10 rounded-full blur-[120px]" />
          <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)", backgroundSize: "56px 56px" }} />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10">
            <Shield className="w-3.5 h-3.5 text-violet-400" />
            <span className="text-xs font-semibold text-violet-300 uppercase tracking-wider">NovaPlatform</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="text-5xl md:text-7xl font-black tracking-tight mb-8">
            Status
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about NovaPlatform's status. Built for speed, security, and developer experience.
          </motion.p>
        </div>
      </section>

      {/* Content Skeleton */}
      <section className="py-20 px-6 md:px-12 bg-[#0b0b0f] border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-invert prose-violet max-w-none">
            <div className="h-64 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center p-8 text-center">
              <div>
                <Cpu className="w-12 h-12 text-violet-500/50 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Content coming soon</h2>
                <p className="text-zinc-500">We are currently working on the detailed documentation and resources for this section.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6 bg-[#07070a]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-sm text-zinc-500">&copy; 2026 NovaPlatform, Inc. All rights reserved.</span>
          <div className="flex gap-6">
            <Link href="/templates/impact-05/privacy" className="text-sm text-zinc-500 hover:text-white transition-colors">Privacy</Link>
            <Link href="/templates/impact-05/terms" className="text-sm text-zinc-500 hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
