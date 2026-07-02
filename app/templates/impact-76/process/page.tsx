"use client";
// @ts-nocheck

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Reveal } from "../shared";

export default function ProcessPage() {
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
