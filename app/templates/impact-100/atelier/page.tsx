"use client";
import { clientName } from "@/lib/templates/clientContent";
import { useEffect, useState } from "react";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Box, Layout, Sparkles } from "lucide-react";

// Variables de module lues par toute la page : le contrat les reçoit au rendu.
let sessionData: any = null;
let fd: any = null;
let bp: any = null;
let c: any = null;
import "../../premium.css";


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
         création, elle peut n'être pas encore lisible. Trois tentatives. */
      for (const attente of [0, 600, 2000]) {
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
    <div className="premium-theme min-h-dvh bg-[#f7f7f7] text-[#1a1a1a] font-sans selection:bg-[#1a1a1a] selection:text-white overflow-x-hidden">
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-2xl py-4 border-b border-black/5">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/templates/impact-100" className="group flex items-center gap-4">
            <div className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center text-black/40 group-hover:bg-black group-hover:text-white group-hover:border-black transition-all">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-black/60 group-hover:text-black transition-colors">
              Return to Home
            </span>
          </Link>
          
          <div className="group flex flex-col items-center">
            <span className="text-3xl font-light tracking-[0.3em] uppercase leading-none">
              {clientName(sessionData) ?? "Nova"}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.8em] text-black/30 -mt-1 ml-1">
              {clientName(sessionData) ? "" : "Spatial Design"}
            </span>
          </div>
        </div>
      </nav>

      <section className="pt-40 pb-24 px-6 md:px-12 min-h-[60svh] flex flex-col justify-center">
        <div className="max-w-[1600px] mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-black/30 mb-8 block">
              Annex Page
            </span>
            <h1 className="text-6xl md:text-9xl font-light tracking-tighter leading-[0.85] uppercase text-black mb-12">
              The <br /> <span className="font-black italic">Atelier.</span>
            </h1>
            <p className="max-w-xl text-xl text-black/40 leading-relaxed font-light uppercase tracking-widest italic">
              This section is currently under structural refinement. The spatial arrangement is being optimized for maximum clarity.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
