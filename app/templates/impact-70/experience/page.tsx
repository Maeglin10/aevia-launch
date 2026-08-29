"use client";
import { memoriserSession } from "@/lib/templates/clientContent";
import { useEffect, useState } from "react";

import React from "react";
import { Music, Sparkles, Disc, MapPin, Heart } from "lucide-react";
import { Reveal } from "../shared";

// Variables de module lues par toute la page : le contrat les reçoit au rendu.
let sessionData: any = null;
let fd: any = null;
let bp: any = null;
let c: any = null;


export default function ExperiencePage() {
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
    <section className="py-20 bg-[#050005] min-h-[70vh]">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <Reveal>
          <div className="border-b border-white/5 pb-10 mb-20">
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#ff00ff] block mb-6">Nocturnal Sanctuary</span>
            <h2 className="text-6xl md:text-[8vw] font-light uppercase tracking-tighter text-white leading-none italic">
              The <span className="font-bold not-italic">Scene.</span>
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <Reveal>
            <div className="space-y-8 text-white/50 leading-relaxed italic text-lg font-light">
              <p>
                Velvet Night is not merely a club; it is an sensory sanctuary. We design physical and acoustic architectures that respond to the human nervous system.
              </p>
              <p>
                Our spaces are tuned to specific resonances. Every sound system, from our main arena to the secret chamber, uses handcrafted acoustic arrays calibrated by master engineers from Berlin and Tokyo.
              </p>
            </div>
          </Reveal>

          <div className="space-y-12">
            {[
              { icon: Disc, t: "Sonic Architecture", d: "Hand-wound custom sound systems tuned to 432Hz to encourage emotional release." },
              { icon: Heart, t: "Sensory Anonymity", d: "Strict no-photo policy. Encrypted digital access keys for total visual privacy." },
              { icon: Sparkles, t: "Olfactory Infusions", d: "Custom aromatic signatures diffused dynamically based on atmospheric moisture." }
            ].map((pillar, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="flex gap-6 items-start pl-6 border-l border-white/5 hover:border-[#ff00ff] transition-all">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                    <pillar.icon className="w-5 h-5 text-[#ff00ff]" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white uppercase tracking-wider mb-2">{pillar.t}</h4>
                    <p className="text-white/40 text-sm leading-relaxed italic">{pillar.d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
