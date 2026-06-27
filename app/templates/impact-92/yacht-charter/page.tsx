"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Building2, ArrowLeft } from "lucide-react";
import "../../premium.css";

export default function Page() {
  return (
    <div className="premium-theme min-h-screen bg-[#0a0a0a] text-[#ffffff] font-sans selection:bg-[#c9a96e] selection:text-black overflow-x-hidden">
      {/* ── NAVIGATION ── */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-black/90 backdrop-blur-xl py-4 border-b border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/templates/impact-92" className="group flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#c9a96e] to-[#8c7246] rounded-sm flex items-center justify-center rotate-45 group-hover:rotate-0 transition-transform duration-500">
              <Building2 className="w-5 h-5 text-black -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter uppercase leading-none">
                Skyline
              </span>
              <span className="text-[8px] font-bold uppercase tracking-[0.4em] text-[#c9a96e] -mt-1">
                Concierge Group
              </span>
            </div>
          </Link>
          <Link href="/templates/impact-92" className="text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-[#c9a96e] transition-colors flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Return to Main
          </Link>
        </div>
      </nav>

      {/* ── CONTENT ── */}
      <main className="pt-32 pb-24 px-6 md:px-12 min-h-screen flex items-center">
        <div className="max-w-[800px] mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#c9a96e] mb-4 block">
              Inventory
            </span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic mb-12">
              Yacht <br />
              <span className="not-italic font-thin text-white">Charter.</span>
            </h1>
            
            <div className="space-y-8 text-white/60 font-light italic leading-relaxed">
              <p>
                Bespoke maritime experiences.
              </p>
              <p>
                Access to the world's most distinguished superyachts and exclusive vessels for private charters across global waters.
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer className="bg-[#0a0a0a] py-12 px-6 md:px-12 border-t border-white/5">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-[9px] font-bold uppercase tracking-widest text-white/10">
          <div className="flex items-center gap-10">
            <span>
              &copy; {new Date().getFullYear()} SKYLINE CONCIERGE GROUP. ALL
              RIGHTS RESERVED.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
