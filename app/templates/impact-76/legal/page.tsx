"use client";
// @ts-nocheck

import { Reveal } from "../shared";

export default function LegalPage() {
  return (
    <div className="py-20 bg-[#0a0a0c]">
      <div className="max-w-[800px] mx-auto px-6">
        <Reveal>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white mb-12 italic">
            Legal_Mentions
          </h1>

          <div className="space-y-10 text-xs font-bold uppercase tracking-widest text-white/40 leading-relaxed">
            <section className="space-y-4">
              <h3 className="text-sm text-stone-500 font-black">1. Publisher Information</h3>
              <p>
                The website templates are published and owned by Valentin Milliand.
              </p>
              <p>
                SIREN: 852 546 225
              </p>
              <p>
                RCS: Bourg-en-Bresse
              </p>
              <p>
                Physical Address: Valentin Milliand, SIREN 852 546 225, RCS Bourg-en-Bresse (physical address provided upon simple request at <a href="mailto:contact@aevia.io" className="text-stone-400 hover:underline">contact@aevia.io</a>).
              </p>
              <p>
                Status: Micro-entrepreneur (VAT not applicable, art. 293 B of the CGI).
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-sm text-stone-500 font-black">2. Contact</h3>
              <p>
                For any inquiry regarding this service, please contact us at: <a href="mailto:contact@aevia.io" className="text-stone-400 hover:underline">contact@aevia.io</a>
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-sm text-stone-500 font-black">3. Hosting</h3>
              <p>
                This platform is hosted globally.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-sm text-stone-500 font-black">4. Disclaimer</h3>
              <p>
                This computational architectural simulation is for showcase purposes only. Real estate projects require physical inspection, local licensing, and official administrative authorizations.
              </p>
            </section>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
