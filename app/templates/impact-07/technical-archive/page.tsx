"use client";
import { clientName } from "@/lib/templates/clientContent";
import { useEffect, useState } from "react";
// @ts-nocheck

import { motion } from "framer-motion"
import { ArrowLeft, Volume2, Speaker, Waves, Activity } from "lucide-react"
import Link from "next/link"

// Variables de module lues par toute la page : le contrat les reçoit au rendu.
let sessionData: any = null;
let fd: any = null;
let bp: any = null;
let c: any = null;
import "../../premium.css"


export default function TechnicalArchivePage() {
  const [__session, __setSession] = useState<any>(null);
  useEffect(() => {
    let id = new URLSearchParams(window.location.search).get("session");
    /* La navigation interne perd le paramètre : on retient la session par thème. */
    try {
      const cleSession = "apercu-session:" + window.location.pathname.split("/")[2];
      if (id) sessionStorage.setItem(cleSession, id);
      else id = sessionStorage.getItem(cleSession);
    } catch {}
    if (!id) return;
    fetch(`/api/sessions?id=${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((s) => s && __setSession(s))
      .catch(() => {});
  }, []);

  sessionData = __session;
  fd = __session?.formData;
  bp = __session?.businessProfile;
  c = __session?.generatedContent;

  return (
    <div className="premium-theme min-h-dvh bg-[#080808] text-[#d4d4d4] font-sans selection:bg-[#c9a84c] selection:text-black overflow-x-hidden">
      
      {/* ── NAVIGATION ── */}
      <nav className="fixed top-0 left-0 w-full z-50 transition-all duration-700 bg-black/90 backdrop-blur-2xl py-4 border-b border-white/5">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/templates/impact-07" className="group flex flex-col items-center">
             <span className="text-3xl font-black tracking-[0.1em] uppercase leading-none italic">{clientName(sessionData) ?? "Aether"}</span>
             <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-[#c9a84c] -mt-1 ml-1">{clientName(sessionData) ? "" : "Sound Labs"}</span>
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
                Archive // TECHNICAL ARCHIVE
             </div>
             <h1 className="text-6xl md:text-[8rem] font-black leading-[0.75] tracking-tighter mb-12 uppercase text-white italic">
               Technical Archive <br/>
               <span className="text-[#c9a84c] not-italic">Archive.</span>
             </h1>
             <p className="max-w-xl text-xl text-white/30 leading-relaxed font-light mb-12 uppercase tracking-widest italic">
               This section explores the acoustic details and engineering philosophy behind our TECHNICAL ARCHIVE initiatives. 
             </p>
          </motion.div>
        </div>
      </section>

    </div>
  )
}
