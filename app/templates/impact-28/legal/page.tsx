"use client"

import { Reveal } from "../shared"

export default function LegalPage() {
  return (
    <div className="pt-32 min-h-dvh px-6 pb-24 max-w-3xl mx-auto">
      <div className="border-4 border-black p-8 md:p-12 bg-white">
        <h1 className="font-black text-4xl md:text-6xl uppercase mb-8" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          LEGAL NOTICE
        </h1>

        <div className="space-y-8 text-sm leading-relaxed text-gray-700">
          <section className="border-b border-black/10 pb-6">
            <h2 className="font-bold text-xs uppercase tracking-widest text-black mb-3">1. Website Publisher</h2>
            <p className="font-semibold text-black">Aevia WS — Valentin Milliand</p>
            <p>SIREN: 852 546 225</p>
            <p>RCS: Bourg-en-Bresse</p>
            <p>Email: contact@aevia.services</p>
            <p className="mt-2 text-xs text-gray-400 font-mono">In compliance with corporate disclosure guidelines, the physical address is not published on this template showcase.</p>
          </section>

          <section className="border-b border-black/10 pb-6">
            <h2 className="font-bold text-xs uppercase tracking-widest text-black mb-3">2. Hosting Provider</h2>
            <p className="font-semibold text-black">Vercel Inc.</p>
            <p>Address: 340 S Lemon Ave #4133 Walnut, CA 91789, USA</p>
            <p>Website: vercel.com</p>
          </section>

          <section className="border-b border-black/10 pb-6">
            <h2 className="font-bold text-xs uppercase tracking-widest text-black mb-3">3. Intellectual Property</h2>
            <p>
              All materials, code architectures, custom layout styles, and images contained on this website are subject to copyright. Any duplication, adaptation, or redistributive use of these elements without direct publisher authorization is strictly prohibited.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-xs uppercase tracking-widest text-black mb-3">4. Privacy Policy & Data Protection</h2>
            <p>
              This showcase template does not configure trackers, profile user behaviors, or set non-essential cookies. Inputs in simulated fields are kept purely in-browser. For data-related concerns, reach out to our team at contact@aevia.services.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
