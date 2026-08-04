"use client";
import { useEffect, useState } from "react";
// @ts-nocheck

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Reveal } from "../shared";


// Variables de module lues par toute la page : le contrat les reçoit au rendu.
let sessionData: any = null;
let fd: any = null;
let bp: any = null;
let c: any = null;

export default function BoutiquePage() {
  const [__session, __setSession] = useState<any>(null);
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("session");
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
    <div className="py-20 bg-[#050505]">
      <div className="max-w-3xl mx-auto px-6">
        <Reveal className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-[1.15] uppercase italic text-white pb-4">
            Chronos_Buffer
          </h2>
        </Reveal>

        <Accordion type="single" collapsible className="space-y-4">
          {[
            {
              q: "What is your global service protocol?",
              a: "Every Horologs piece includes a lifetime global service plan. You can drop your timepiece at any authorized boutique in Paris, Tokyo, or New York for a full calibration audit.",
            },
            {
              q: "Do you offer bespoke dial commissions?",
              a: "Yes. Our 'Sovereign' tier allows for full customization of dials, hands, and engraving, coordinated directly with our master watchmakers at our Swiss headquarters.",
            },
            {
              q: "What is the lead time for a new reservation?",
              a: "Due to our extremely limited annual production of 450 pieces, standard lead times are currently 6 to 18 months depending on the collection.",
            },
            {
              q: "Are your timepieces cryptocurrency compatible?",
              a: "Every Horologs watch features a discrete NFC chip in the casing that can be linked to your digital identity or secure hardware wallet for authentication.",
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
