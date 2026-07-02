"use client";

import React from "react";
import { Reveal } from "../shared";

export default function LegalPage() {
  return (
    <div className="bg-[#0f0d0b] text-[#f5efe0] min-h-screen pb-24">
      <section className="py-20 max-w-3xl mx-auto px-6 text-left">
        <Reveal>
          <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-[#b8860b] mb-6 block">
            Regulatory Disclosures
          </span>
          <h2 className="text-5xl md:text-8xl font-light tracking-tighter uppercase leading-[1.15] pb-4 mb-20 italic text-white">
            Legal <br />
            <span className="font-bold not-italic opacity-30">Notice.</span>
          </h2>
        </Reveal>

        <div className="space-y-16 font-sans text-sm text-[#f5efe0]/40 leading-relaxed mt-20">
          <Reveal delay={0.1}>
            <div>
              <h3 className="text-lg font-bold uppercase tracking-widest text-[#b8860b] mb-6 italic">
                1. Éditeur du site
              </h3>
              <p className="pl-6 border-l border-white/5">
                Le site vitrine SATORI RESTAURANT est édité par Valentin Milliand, micro-entrepreneur.<br />
                SIREN : 852 546 225<br />
                RCS : Bourg-en-Bresse<br />
                Adresse : Valentin Milliand, SIREN 852 546 225, RCS Bourg-en-Bresse (adresse physique communiquée sur simple demande à valentinmilliand@aevia.services).
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div>
              <h3 className="text-lg font-bold uppercase tracking-widest text-[#b8860b] mb-6 italic">
                2. Hébergement
              </h3>
              <p className="pl-6 border-l border-white/5">
                Le site est hébergé par Vercel Inc., 650 2nd St, San Francisco, CA 94107, États-Unis.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <div>
              <h3 className="text-lg font-bold uppercase tracking-widest text-[#b8860b] mb-6 italic">
                3. Propriété intellectuelle
              </h3>
              <p className="pl-6 border-l border-white/5">
                Tous les designs de marque, typographies, designs de page, codes et textes sur ce site sont la propriété intellectuelle exclusive de Valentin Milliand.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.4}>
            <div>
              <h3 className="text-lg font-bold uppercase tracking-widest text-[#b8860b] mb-6 italic">
                4. Contact
              </h3>
              <p className="pl-6 border-l border-white/5">
                Pour toute question ou demande de renseignements complémentaires, vous pouvez nous contacter par courrier électronique à l&apos;adresse suivante : valentinmilliand@aevia.services.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
