"use client";
// @ts-nocheck

import { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Radio, MessageSquare, Play, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { STREAMS, CHAT_LOGS, Reveal } from "../shared";

export default function BrowsePage() {
  const [activeStream, setActiveStream] = useState<number | null>(null);

  return (
    <div className="py-20 bg-[#08080c] min-h-screen">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
          <Reveal>
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.9] text-white">
              Live <br /> <span className="text-rose-500 italic">Now.</span>
            </h2>
          </Reveal>
          <p className="max-w-sm text-sm text-white/20 leading-relaxed font-bold uppercase tracking-widest italic text-right">
            Real-time content across all spectrums. Instant engagement. No
            delays.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {STREAMS.map((s, i) => (
            <Reveal key={s.id} delay={i * 0.1}>
              <div
                onClick={() => setActiveStream(i)}
                className="group cursor-pointer bg-white/[0.02] border border-white/5 hover:border-rose-500/40 transition-all rounded-2xl p-4 shadow-sm overflow-hidden"
              >
                <div className="relative aspect-video rounded-xl overflow-hidden mb-6">
                  <Image
                    src={s.img}
                    alt={s.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-1000"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-rose-600 text-white border-none text-[8px] font-black tracking-widest uppercase px-3 py-1 animate-pulse">
                      LIVE
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 right-4 text-[9px] font-black text-white/80 bg-black/50 backdrop-blur-md px-2 py-1 rounded">
                    {s.viewers} VIEWERS
                  </div>
                  <div className="absolute inset-0 bg-rose-600/10 mix-blend-overlay" />
                </div>
                <div className="px-2 pb-2">
                  <h3 className="text-sm font-black uppercase tracking-tight mb-2 text-white truncate">
                    {s.title}
                  </h3>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-6 h-6 rounded-full bg-rose-600/10 border border-rose-600/20" />
                    <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">
                      {s.streamer}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {s.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[8px] font-black uppercase tracking-widest text-white/20 bg-white/[0.02] px-2 py-1 rounded border border-white/5"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* STREAM MODAL */}
      <AnimatePresence>
        {activeStream !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6"
            onClick={() => setActiveStream(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="bg-[#0e0e1a] border border-white/10 max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 overflow-hidden rounded-3xl shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveStream(null)}
                className="absolute top-8 right-8 text-white/20 hover:text-rose-500 transition-colors z-10 bg-transparent border-none cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>

              {/* VIDEO AREA */}
              <div className="lg:col-span-8 relative aspect-video lg:aspect-auto bg-black flex items-center justify-center min-h-[400px]">
                <Image
                  src={STREAMS[activeStream].img}
                  alt="Stream"
                  fill
                  className="object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full bg-rose-600/20 border border-rose-600 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 text-rose-500 fill-rose-500" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white mt-6">
                    Connecting to node...
                  </span>
                </div>
                {/* OVERLAYS */}
                <div className="absolute top-8 left-8 flex gap-4">
                  <Badge className="bg-rose-600 text-white border-none text-[10px] font-black uppercase tracking-widest animate-pulse px-4 py-1.5">
                    LIVE
                  </Badge>
                  <div className="px-4 py-1.5 bg-black/50 backdrop-blur-md rounded text-[10px] font-black uppercase tracking-widest text-white/80">
                    {STREAMS[activeStream].viewers} VIEWERS
                  </div>
                </div>
              </div>

              {/* SIDEBAR AREA */}
              <div className="lg:col-span-4 p-8 flex flex-col justify-between bg-[#0e0e1a] border-l border-white/5">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-rose-500 mb-6 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-rose-600" />
                    Real-Time Metadata
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter italic text-white mb-6 leading-[1.15] pb-2">
                    {STREAMS[activeStream].title}
                  </h3>
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-10 h-10 rounded-full bg-rose-600/10 border border-rose-600/20" />
                    <div>
                      <div className="text-sm font-black text-white">
                        {STREAMS[activeStream].streamer}
                      </div>
                      <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest italic">
                        Partner Creator
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 mb-10 h-[200px] overflow-y-auto pr-4 scrollbar-hide">
                    {CHAT_LOGS.map((chat, i) => (
                      <div key={i} className="text-[11px] leading-relaxed">
                        <span
                          className="font-black uppercase tracking-tight mr-2"
                          style={{ color: chat.color }}
                        >
                          {chat.user}:
                        </span>
                        <span className="text-white/60 font-bold uppercase tracking-tight italic">
                          {chat.msg}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <button className="w-full py-5 bg-rose-600 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-rose-500 transition-all cursor-pointer shadow-xl shadow-rose-600/20 border-none">
                    SEND_CRYPTO_GIFT
                  </button>
                  <div className="grid grid-cols-2 gap-4">
                    <button className="py-4 border border-white/10 bg-transparent text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all cursor-pointer">
                      FOLLOW
                    </button>
                    <button className="py-4 border border-white/10 bg-transparent text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all cursor-pointer">
                      SUBSCRIBE
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
