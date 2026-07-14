"use client";

import React from "react";
import { Reveal } from "../shared";

export default function LegalPage() {
  return (
    <section className="py-24 bg-[#0A0A08] min-h-dvh text-[#6A6058] font-sans">
      <div className="max-w-3xl mx-auto px-6">
        <Reveal>
          <h1 className="text-4xl md:text-5xl font-light tracking-tighter uppercase leading-[1.15] text-[#F0EBE0] italic mb-12 pb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Mentions Légales
          </h1>

          <div className="space-y-12 text-sm leading-relaxed">
            <div>
              <h2 className="text-lg font-light text-[#F0EBE0] uppercase tracking-wider mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                1. Éditeur
              </h2>
              <p>
                Ce site internet est édité par Valentin Milliand (propriétaire de l&apos;enseigne Aevia WS).
                <br />
                SIREN : 852 546 225
                <br />
                RCS : Bourg-en-Bresse
                <br />
                Adresse physique : Valentin Milliand, SIREN 852 546 225, RCS Bourg-en-Bresse (adresse physique communiquée sur simple demande à valentinmilliand@aevia.services)
                <br />
                Contact email : valentinmilliand@aevia.services
              </p>
            </div>

            <div>
              <h2 className="text-lg font-light text-[#F0EBE0] uppercase tracking-wider mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                2. Régime Fiscal
              </h2>
              <p>
                Régime micro-entrepreneur.
                <br />
                TVA non applicable, en application de l&apos;article 293 B du Code Général des Impôts (CGI).
              </p>
            </div>

            <div>
              <h2 className="text-lg font-light text-[#F0EBE0] uppercase tracking-wider mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                3. Hébergement
              </h2>
              <p>
                Ce site est hébergé par Vercel Inc., 340 Pine Street, Suite 701, San Francisco, CA 94104, USA.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-light text-[#F0EBE0] uppercase tracking-wider mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                4. Propriété Intellectuelle
              </h2>
              <p>
                L&apos;ensemble des designs, des maquettes, des photographies et des articles publiés sur ce site sont la propriété exclusive de Valentin Milliand ou de ses partenaires. Toute reproduction ou distribution non autorisée fera l&apos;objet de poursuites légales.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
