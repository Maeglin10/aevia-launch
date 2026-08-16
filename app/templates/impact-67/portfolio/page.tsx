"use client";
import { memoriserSession } from "@/lib/templates/clientContent";
import { useEffect, useState } from "react";

import React from "react";
import { Globe, Radio, ArrowUpRight } from "lucide-react";
import { ASSETS, Reveal } from "../shared";

// Variables de module lues par toute la page : le contrat les reçoit au rendu.
let sessionData: any = null;
let fd: any = null;
let bp: any = null;
let c: any = null;


export default function PortfolioPage() {
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
  memoriserSession(__session);
  fd = __session?.formData;
  bp = __session?.businessProfile;
  c = __session?.generatedContent;

  const handleRequestScan = () => {
    window.dispatchEvent(new Event("open-vision-scan"));
  };

  return (
    <section className="py-20 bg-[#050505] relative overflow-hidden min-h-[70vh]">
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <Globe className="w-full h-full text-rose-600" />
      </div>
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-24">
            <span className="text-[10px] uppercase tracking-[0.5em] font-black text-rose-600 mb-6 block">
              Asset Registry
            </span>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic text-white">
              Global Nodes.
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ASSETS.map((asset, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="p-10 bg-white/[0.02] border border-white/5 hover:border-rose-600/40 transition-all rounded-none group text-left">
                <div className="flex justify-between items-start mb-10">
                  <h3 className="text-xl font-black uppercase tracking-widest text-rose-600 italic">
                    {asset.city}
                  </h3>
                  <Radio className="w-4 h-4 text-white/10 group-hover:text-rose-600 transition-colors" />
                </div>
                <h4 className="text-3xl font-black uppercase tracking-tighter mb-4 text-white">
                  {asset.name}
                </h4>
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest mb-10">
                  <span className="text-white/40">{asset.status}</span>
                  <span className="text-white italic">{asset.price}</span>
                </div>
                <button
                  onClick={handleRequestScan}
                  className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-rose-600 hover:text-white transition-colors bg-transparent border-none cursor-pointer p-0"
                >
                  REQUEST_SCAN <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
