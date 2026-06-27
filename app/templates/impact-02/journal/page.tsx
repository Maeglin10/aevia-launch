"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import "../../premium.css";

const POSTS = [
  { id: 1, title: "The Weight of Light at Dusk", category: "Thoughts", date: "Oct 12, 2026", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800&auto=format&fit=crop" },
  { id: 2, title: "Behind the Lens: Maison Lumière", category: "Behind the Scenes", date: "Sep 28, 2026", image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop" },
  { id: 3, title: "Finding Geometry in the Sahara", category: "Travel", date: "Aug 15, 2026", image: "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?q=80&w=800&auto=format&fit=crop" },
];

export default function JournalPage() {
  return (
    <div className="premium-theme bg-[#0a0a0a] text-white min-h-screen selection:bg-amber-400 selection:text-black overflow-x-hidden font-sans">
      <nav className="fixed top-0 left-0 w-full z-50 mix-blend-difference bg-black/50 backdrop-blur-md">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-8 flex justify-between items-center">
          <Link href="/templates/impact-02" className="relative z-50 group">
            <span className="text-lg font-light tracking-[0.3em] uppercase transition-colors group-hover:text-amber-400">
              Elena<span className="font-black">Korr</span>
            </span>
          </Link>
          <Link href="/templates/impact-02" className="flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] font-medium text-white/50 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Portfolio
          </Link>
        </div>
      </nav>

      <section className="pt-48 pb-32 px-6 md:px-12 relative z-10">
        <div className="max-w-[1400px] mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="mb-24">
            <span className="text-amber-400 text-[11px] uppercase tracking-[0.3em] font-semibold mb-6 block">Thoughts & Stories</span>
            <h1 className="text-5xl md:text-7xl font-extralight tracking-tight leading-none">
              Studio <span className="font-black italic">Journal</span>
            </h1>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {POSTS.map((post, i) => (
              <motion.div key={post.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: i * 0.1 }} className="group cursor-pointer">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6">
                  <Image src={post.image} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out grayscale group-hover:grayscale-0" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                </div>
                <div className="flex items-center gap-4 text-xs font-mono text-white/40 mb-4">
                  <span className="text-amber-400">{post.category}</span>
                  <span>/</span>
                  <span>{post.date}</span>
                </div>
                <h2 className="text-2xl font-light leading-snug group-hover:text-amber-400 transition-colors flex items-start justify-between gap-4">
                  {post.title}
                  <ArrowUpRight className="w-5 h-5 shrink-0 opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300 text-amber-400" />
                </h2>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-[#050505] pt-20 pb-12 px-6 md:px-12 border-t border-white/5">
        <div className="max-w-[1400px] mx-auto text-center">
          <p className="text-white/30 text-xs uppercase tracking-widest font-mono">&copy; {new Date().getFullYear()} Elena Korr Studio. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
