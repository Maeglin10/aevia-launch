"use client";
import { memoriserSession } from "@/lib/templates/clientContent";
import { useEffect, useState } from "react";
// @ts-nocheck

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Reveal } from "../shared";

// Variables de module lues par toute la page : le contrat les reçoit au rendu.
let sessionData: any = null;
let fd: any = null;
let bp: any = null;
let c: any = null;


export default function ProcessPage() {
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
      <div className="max-w-3xl mx-auto px-6">
        <Reveal className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-[1.15] uppercase italic text-white pb-4">
            Structural_Audit
          </h2>
        </Reveal>

        <Accordion type="single" collapsible className="space-y-4">
          {[
            {
              q: "How do you integrate generative AI in your process?",
              a: "We use proprietary neural networks to run millions of structural simulations, optimizing for wind resistance and thermal efficiency before the first blueprint is drawn.",
            },
            {
              q: "What is your approach to sustainable materials?",
              a: "We prioritize local, low-carbon materials such as cross-laminated timber (CLT) and recycled geopolymer concrete, aiming for negative carbon footprints in every project.",
            },
            {
              q: "Can you handle international project management?",
              a: "Yes. Our Aevia Cloud OS allows for real-time BIM synchronization across global time zones, ensuring seamless coordination between architects, engineers, and site managers.",
            },
            {
              q: "What are your standard consultation fees?",
              a: "Our fee structure is tiered based on project complexity. We typicaly operate on a percentage-of-cost basis or a flat institutional fee for large-scale urban planning.",
            },
          ].map((faq, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="border-b border-white/5"
            >
              <AccordionTrigger className="text-left text-sm uppercase font-bold tracking-widest py-8 hover:text-stone-500 hover:no-underline">
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
