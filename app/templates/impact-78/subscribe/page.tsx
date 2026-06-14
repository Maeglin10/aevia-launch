// @ts-nocheck
"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Reveal } from "../shared";

export default function SubscribePage() {
  return (
    <div className="py-20 bg-[#0c0a09]">
      <div className="max-w-3xl mx-auto px-6">
        <Reveal className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-[1.15] uppercase italic text-white pb-4">
            Extraction_Buffer
          </h2>
        </Reveal>

        <Accordion type="single" collapsible className="space-y-4">
          {[
            {
              q: "What is your ethical sourcing protocol?",
              a: "We pay on average 3.5x the Fairtrade price directly to producers. Our Aevia Trace OS allows you to see the exact transaction and harvest date for every bag.",
            },
            {
              q: "How do you handle roast consistency?",
              a: "We use Loring Smart Roasters connected to our central AI hub. Every roast is profiled against a molecular benchmark to ensure less than 0.5% variance.",
            },
            {
              q: "Can I manage my subscription frequency?",
              a: "Yes. Our Subscription Portal allows for sub-weekly, weekly, or bi-weekly shipments, with instant 'Pause' or 'Flash' options for high-demand periods.",
            },
            {
              q: "What is the shelf-life of your beans?",
              a: "For peak extraction, we recommend brewing between 7 and 28 days post-roast. Every bag is nitrogen-flushed and shipped in recyclable vacuum-seal units.",
            },
          ].map((faq, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="border-b border-white/5"
            >
              <AccordionTrigger className="text-left text-sm uppercase font-bold tracking-widest py-8 hover:text-orange-500 hover:no-underline">
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
