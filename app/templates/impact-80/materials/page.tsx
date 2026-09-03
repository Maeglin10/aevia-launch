"use client";
import { memoriserSession } from "@/lib/templates/clientContent";
import { useEffect, useState } from "react";

import React from "react";
import { Reveal, ParallaxImg } from "../shared";

// Variables de module lues par toute la page : le contrat les reçoit au rendu.
let sessionData: any = null;
let fd: any = null;
let bp: any = null;
let c: any = null;


export default function MaterialsPage() {
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

  return (
    <section className="py-24 bg-white min-h-dvh">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <Reveal>
          <div className="max-w-2xl mb-20">
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-black/30 block mb-6">
              Expertise & Materials
            </span>
            <h1 className="text-5xl md:text-7xl font-light uppercase tracking-tighter text-[#1a1a1a] leading-none italic pb-4">
              Material <br />{" "}
              <span className="not-italic font-bold opacity-10">Integrity.</span>
            </h1>
            <p className="text-xl text-black/40 font-light mt-6 leading-relaxed italic">
              Raw concrete, structural glass, and weathered steel. We believe in building environments that develop character over centuries.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <Reveal>
            <div className="aspect-[4/5] relative overflow-hidden border border-black/5 p-1 bg-[#fcfcfc] shadow-xl">
              <ParallaxImg
                src="https://images.pexels.com/photos/9808879/pexels-photo-9808879.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt="Concrete Textures"
              />
            </div>
          </Reveal>
          <div className="space-y-12">
            {[
              {
                t: "Brutalist Concrete",
                d: "Indelible forms cast on-site, revealing the organic texture of the wood panels used to mold them.",
              },
              {
                t: "Structural Glass Monoliths",
                d: "Double-glazed structural envelopes that invite absolute light while retaining heat and structural purity.",
              },
              {
                t: "Oxidized Steel Framing",
                d: "High-grade structural steel exposed to the elements to create a natural defensive rust envelope.",
              },
            ].map((item, idx) => (
              <Reveal key={idx} delay={idx * 0.1}>
                <h3 className="text-2xl font-bold uppercase tracking-tight text-black italic mb-4">
                  {item.t}
                </h3>
                <p className="text-black/40 leading-relaxed font-light text-sm italic">
                  {item.d}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
