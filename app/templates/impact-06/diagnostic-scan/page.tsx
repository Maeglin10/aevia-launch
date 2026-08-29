"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react";
import Link from "next/link"
import { ArrowLeft, Brain, Scan } from "lucide-react"

// Variables de module lues par toute la page : le contrat les reçoit au rendu.
let sessionData: any = null;
let fd: any = null;
let bp: any = null;
let c: any = null;


export default function Page() {
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
    (async () => {
      /* La session vient d'un stockage distant : chargée dans la foulée de sa
         création, elle peut n'être pas encore lisible. Cinq tentatives, jusqu'à
         onze secondes : trois ne suffisaient pas, et une page qui rate la
         dernière garde le repli de la démonstration pour toujours. */
      for (const attente of [0, 500, 1500, 3000, 6000]) {
        if (attente) await new Promise((r) => setTimeout(r, attente));
        try {
          const reponse = await fetch(`/api/sessions?id=${id}`);
          if (!reponse.ok) continue;
          const donnees = await reponse.json();
          if (donnees) { __setSession(donnees); return; }
        } catch {}
      }
    })();
  }, []);

  sessionData = __session;
  fd = __session?.formData;
  bp = __session?.businessProfile;
  c = __session?.generatedContent;

  return (
    <div className="premium-theme min-h-dvh bg-[#020204] text-[#e0e0e0] font-sans selection:bg-[#00f2ff] selection:text-black overflow-x-hidden flex flex-col">
      <nav className="w-full py-8 border-b border-white/5 bg-transparent">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/templates/impact-06" className="group flex flex-col items-center">
             <span className="text-3xl font-black tracking-[-0.05em] uppercase leading-none">Neuralis</span>
             <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#00f2ff] -mt-1 ml-1">Augmentation Lab</span>
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
            <span className="text-[#00f2ff] not-italic">Diagnostic Scan</span>
          </h1>
          <p className="text-white/40 text-sm font-light uppercase tracking-widest italic leading-loose mb-12">
            This sector of the Neuralis grid is currently undergoing biometric synchronization. 
            Full protocol access will be granted in the next iteration cycle.
          </p>
          <div className="flex items-center justify-center gap-4">
             <div className="w-2 h-2 rounded-full bg-[#00f2ff] animate-pulse" />
             <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#00f2ff]">Sync in Progress</span>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
