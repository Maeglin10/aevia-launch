"use client";
import { memoriserSession } from "@/lib/templates/clientContent";
import { useEffect, useState } from "react";
// @ts-nocheck

import { PHILOSOPHY, Reveal } from "../shared";

// Variables de module lues par toute la page : le contrat les reçoit au rendu.
let sessionData: any = null;
let fd: any = null;
let bp: any = null;
let c: any = null;


export default function PhilosophyPage() {
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
  memoriserSession(__session);
  fd = __session?.formData;
  bp = __session?.businessProfile;
  c = __session?.generatedContent;

  return (
    <div className="py-20 bg-[#0a0a0c]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 text-center mb-32">
        <Reveal>
          <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[1.15] text-white pb-4">
            The <span className="text-stone-500 italic">Core.</span>
          </h2>
        </Reveal>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-16">
        {PHILOSOPHY.map((p, i) => (
          <Reveal key={i} delay={i * 0.1}>
            <div className="group p-12 bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all rounded-3xl h-full flex flex-col justify-between items-center text-center">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-10 group-hover:bg-white group-hover:text-black transition-all">
                {p.icon}
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight mb-6 italic">
                {p.title}
              </h3>
              <p className="text-[11px] text-white/20 leading-relaxed font-bold uppercase tracking-widest italic">
                {p.desc}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
