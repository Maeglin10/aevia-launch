"use client";
import { useEffect, useState } from "react";
import { EnteteAnnexe } from "@/lib/templates/EnteteAnnexe";
import {
  clientCity,
  clientName,
  clientServices,
  clientTagline,
  clientText,
  clientTrade,
  memoriserSession,
} from "@/lib/templates/clientContent";
// @ts-nocheck

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Reveal } from "../shared";

// Variables de module lues par toute la page : le contrat les reçoit au rendu.
let sessionData: any = null;
let fd: any = null;
let bp: any = null;
let c: any = null;


export default function AboutPage() {
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
    <div className="py-20 bg-[#08080c] min-h-dvh">
      <EnteteAnnexe session={sessionData} repli="StreamHub" accueil="/templates/impact-73" />
      <div className="max-w-3xl mx-auto px-6">
        <Reveal className="mb-20 text-center">
          <span className="text-[10px] uppercase tracking-[0.5em] font-black text-rose-500 mb-6 block">
            Our Mission
          </span>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic text-white leading-[1.15] pb-4">
            Own the <br /> <span className="text-rose-500">Spectrum.</span>
          </h2>
          <p className="text-sm text-white/40 leading-relaxed font-bold uppercase tracking-widest italic mt-6">
            {/* TEXTE_SECTION */ clientText(sessionData, "apropos.texte") ?? clientTagline(sessionData) ?? "StreamHub provides direct-to-audience broadcasting at 8K resolution with ultra-low glass-to-glass latency. Est. 2026."}
          </p>
        </Reveal>

        <Reveal className="text-center mb-16">
          <h3 className="text-2xl font-black tracking-tighter uppercase italic text-white mb-8">
            Stream_Buffer
          </h3>
        </Reveal>

        <Accordion type="single" collapsible className="space-y-4">
          {[
            {
              q: "What is your payout model?",
              a: "Creators keep 95% of all subscription revenue and 100% of direct tips. We only take a 5% fee to cover infrastructure and global CDN costs.",
            },
            {
              q: "What hardware do I need to stream in 8K?",
              a: "8K streaming requires an NVIDIA 40-series GPU or equivalent, a minimum 100Mbps upload speed, and our proprietary StreamHub Encoder v4.",
            },
            {
              q: "How do you handle moderation?",
              a: "We use a hybrid AI-human moderation system. Our NeuralMod AI flags violations in 50ms, which are then reviewed by our 24/7 global safety team.",
            },
            {
              q: "Can I multi-stream to other platforms?",
              a: "Yes. Our Partner tier allows for simultaneous broadcasting to up to 5 external platforms with zero additional CPU overhead.",
            },
          ].map((faq, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="border-b border-white/5"
            >
              <AccordionTrigger className="text-left text-sm uppercase font-bold tracking-widest py-8 hover:text-rose-500 hover:no-underline text-white">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-white/20 leading-relaxed font-bold uppercase tracking-widest pb-8 italic">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
