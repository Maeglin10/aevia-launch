"use client";

import React from "react";
import Image from "next/image";
import { Quote font-serif } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SCIENTIFIC_PILLARS, Reveal } from "../shared";

export default function MethodPage() {
  return (
    <div className="min-h-screen bg-[#f8f5f0] pb-24">
      {/* ==========================================
          2. THE PHILOSOPHY (Scientific Pillars)
          ========================================== */}
      <section className="py-24 bg-[#f8f5f0]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-32 items-center">
            <div className="lg:col-span-5">
              <Reveal>
                <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#3d7a5e] mb-6 block font-sans">
                  Deep Inquiry
                </span>
                <h2 className="text-5xl md:text-7xl font-light tracking-tighter leading-tight mb-12 uppercase font-serif">
                  Silence is <br />{" "}
                  <span className="italic font-normal text-[#3d7a5e]">
                    Structural.
                  </span>
                </h2>
                <p className="text-lg text-black/50 leading-relaxed font-light mb-16">
                  We don&apos;t offer spa treatments. We offer nervous system
                  restoration. Every element of a Luminal retreat is backed by
                  neurological research into how the high-functioning mind
                  achieves true baseline reset.
                </p>

                <div className="space-y-10">
                  {SCIENTIFIC_PILLARS.map((pillar, i) => (
                    <div key={i} className="group flex gap-8">
                      <div className="w-14 h-14 bg-white border border-black/5 flex items-center justify-center text-[#3d7a5e] group-hover:bg-[#3d7a5e] group-hover:text-white transition-all shadow-sm shrink-0">
                        {pillar.icon}
                      </div>
                      <div className="font-sans">
                        <h4 className="text-lg font-bold uppercase tracking-tight mb-2 text-black">
                          {pillar.title}
                        </h4>
                        <p className="text-sm text-black/40 leading-relaxed font-light">
                          {pillar.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-7">
              <Reveal className="relative aspect-square md:aspect-[4/5] rounded-sm overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1540555700478-4be709347c63?w=1200&q=80"
                  alt="Meditation Detail"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-[#3d7a5e]/5 mix-blend-multiply" />
                <div className="absolute bottom-10 left-10 right-10">
                  <div className="bg-white/90 backdrop-blur-md p-8 border border-black/5 text-left font-serif">
                    <p className="text-xl italic text-black/70 leading-relaxed">
                      &quot;The quality of your rest determines the quality of your
                      contribution. We do not help you rest. We help you learn
                      how.&quot;
                    </p>
                    <div className="mt-6 text-[10px] font-bold uppercase tracking-widest text-[#3d7a5e] font-sans">
                      Dr. Clara Metz // Founder
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          7. FAQ (The Buffer)
          ========================================== */}
      <section className="py-24 border-t border-black/5 bg-[#f8f5f0]">
        <div className="max-w-3xl mx-auto px-6">
          <Reveal className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-light tracking-tighter leading-none uppercase italic font-serif">
              Intel_Buffer
            </h2>
          </Reveal>

          <Accordion type="single" collapsible className="space-y-4 font-sans">
            {[
              {
                q: "Who is Luminal designed for?",
                a: "Luminal serves high-functioning individuals experiencing burnout or creative depletion. We do not offer clinical therapy. We offer conditions for genuine rest.",
              },
              {
                q: "Is technology permitted during retreats?",
                a: "Devices are surrendered on arrival and returned on departure. This is non-negotiable and constitutes the first transformative act of the retreat.",
              },
              {
                q: "How small are the groups?",
                a: "Every Luminal retreat is capped at nine participants. This is not scalable and is entirely intentional for depth of practice.",
              },
              {
                q: "What does a typical day look like?",
                a: "There is no schedule distributed in advance. Mornings are for somatic practice, afternoons for solitude, evenings for shared inquiry.",
              },
            ].map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border-b border-black/5"
              >
                <AccordionTrigger className="text-left text-sm uppercase font-bold tracking-widest py-8 hover:text-[#3d7a5e] hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-black/40 leading-relaxed font-light italic pb-8">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  );
}
