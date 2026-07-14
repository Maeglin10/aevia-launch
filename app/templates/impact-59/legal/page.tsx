"use client";

import React from "react";
import { Reveal } from "../shared";

export default function LegalPage() {
  return (
    <div className="min-h-dvh bg-[#f8f5f0] pb-24">
      <section className="py-20 max-w-3xl mx-auto px-6">
        <Reveal>
          <span className="text-[10px] uppercase tracking-[0.5em] font-black text-[#3d7a5e] mb-6 block font-sans">
            Regulatory Disclosures
          </span>
          <h2 className="text-5xl md:text-7xl font-light tracking-tighter uppercase italic font-serif mb-16">
            Legal notice
          </h2>
        </Reveal>

        <div className="space-y-12 font-sans text-sm text-black/60 leading-relaxed">
          <Reveal delay={0.1}>
            <div>
              <h3 className="text-xl font-bold uppercase tracking-tight text-black mb-4 font-serif">
                1. ÉDITEUR DU SITE
              </h3>
              <p style={{ paddingLeft: "1.5rem" }}>
                Le site vitrine LUMINAL RETREATS est édité par Valentin Milliand, micro-entrepreneur.<br />
                SIREN : 852 546 225<br />
                RCS : Bourg-en-Bresse<br />
                Adresse : Valentin Milliand, SIREN 852 546 225, RCS Bourg-en-Bresse (adresse physique communiquée sur simple demande à valentinmilliand@aevia.services).
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div>
              <h3 className="text-xl font-bold uppercase tracking-tight text-black mb-4 font-serif">
                2. HÉBERGEMENT
              </h3>
              <p style={{ paddingLeft: "1.5rem" }}>
                Le site est hébergé par Vercel Inc., 650 2nd St, San Francisco, CA 94107, États-Unis.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <div>
              <h3 className="text-xl font-bold uppercase tracking-tight text-black mb-4 font-serif">
                3. PROPRIÉTÉ INTELLECTUELLE
              </h3>
              <p style={{ paddingLeft: "1.5rem" }}>
                Tous les designs de marque, typographies, designs de page, codes et textes sur ce site sont la propriété intellectuelle exclusive de Valentin Milliand.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.4}>
            <div>
              <h3 className="text-xl font-bold uppercase tracking-tight text-black mb-4 font-serif">
                4. CONTACT
              </h3>
              <p style={{ paddingLeft: "1.5rem" }}>
                Pour toute question ou demande de renseignements complémentaires, vous pouvez nous contacter par courrier électronique à l&apos;adresse suivante : valentinmilliand@aevia.services.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
