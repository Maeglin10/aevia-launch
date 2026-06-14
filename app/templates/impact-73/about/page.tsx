// @ts-nocheck
"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Reveal } from "../shared";

export default function AboutPage() {
  return (
    <div className="py-20 bg-[#08080c] min-h-screen">
      <div className="max-w-3xl mx-auto px-6">
        <Reveal className="mb-20 text-center">
          <span className="text-[10px] uppercase tracking-[0.5em] font-black text-rose-500 mb-6 block">
            Our Mission
          </span>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic text-white leading-[1.15] pb-4">
            Own the <br /> <span className="text-rose-500">Spectrum.</span>
          </h2>
          <p className="text-sm text-white/40 leading-relaxed font-bold uppercase tracking-widest italic mt-6">
            StreamHub provides direct-to-audience broadcasting at 8K resolution with ultra-low glass-to-glass latency. Est. 2026.
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
