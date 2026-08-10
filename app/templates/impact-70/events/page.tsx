"use client";
import { useEffect, useState } from "react";

import React from "react";
import { EVENTS, ParallaxImg, Reveal } from "../shared";

// Variables de module lues par toute la page : le contrat les reçoit au rendu.
let sessionData: any = null;
let fd: any = null;
let bp: any = null;
let c: any = null;


export default function EventsPage() {
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
    <section className="py-20 bg-[#050005] min-h-[70vh]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <Reveal>
          <div className="border-b border-white/5 pb-10 mb-20">
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#ff00ff] block mb-6">Archive of Essence</span>
            <h2 className="text-6xl md:text-[8vw] font-light uppercase tracking-tighter text-white leading-none italic">
              Eternal <span className="font-bold not-italic">Moments.</span>
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {EVENTS.map((item, i) => (
            <Reveal key={i} delay={i * 0.15}>
              <div className="group cursor-pointer">
                <div className="aspect-[4/5] relative mb-12 overflow-hidden rounded-[2rem] border border-white/5 bg-white/[0.02]">
                  <ParallaxImg src={item.img} alt={item.name} />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-all duration-1000" />
                  <div className="absolute bottom-12 left-12">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-[#ff00ff] mb-2 italic">{item.cat}</div>
                    <h3 className="text-4xl font-bold uppercase tracking-tighter text-white">{item.name}</h3>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
