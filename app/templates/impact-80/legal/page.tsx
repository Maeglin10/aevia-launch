"use client";

import React from "react";
import { Reveal } from "../shared";

export default function LegalPage() {
  return (
    <section className="py-24 bg-[#fcfcfc] min-h-dvh text-black/50 font-sans">
      <div className="max-w-3xl mx-auto px-6">
        <Reveal>
          <h1 className="text-4xl md:text-5xl font-light tracking-tighter uppercase leading-[1.15] text-black italic mb-12 pb-4">
            Legal Mentions
          </h1>

          <div className="space-y-12 text-sm font-light leading-relaxed">
            <div>
              <h2 className="text-lg font-bold text-black uppercase tracking-wider mb-4">
                1. Publisher
              </h2>
              <p>
                Symmetry Studio is an architectural representation platform owned and published by Valentin Milliand, operating under the trade name Aevia WS.
                <br />
                SIREN: 852 546 225
                <br />
                RCS: Bourg-en-Bresse
                <br />
                Physical Address: Valentin Milliand, SIREN 852 546 225, RCS Bourg-en-Bresse (adresse physique communiquée sur simple demande à valentinmilliand@aevia.services)
                <br />
                Email: valentinmilliand@aevia.services
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-black uppercase tracking-wider mb-4">
                2. Business Regime
              </h2>
              <p>
                Micro-entrepreneur regime.
                <br />
                TVA non applicable, conformément à l&apos;article 293 B du Code Général des Impôts (CGI).
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-black uppercase tracking-wider mb-4">
                3. Hosting
              </h2>
              <p>
                This website is hosted by Vercel Inc., 340 Pine Street, Suite 701, San Francisco, CA 94104, USA.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-black uppercase tracking-wider mb-4">
                4. Intellectual Property
              </h2>
              <p>
                All volumetric concepts, geometric patterns, drawings, and images represent conceptual artistic works owned exclusively by Valentin Milliand. Any reproduction without permission is strictly prohibited.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
