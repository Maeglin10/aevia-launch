"use client"

export default function LegalPage() {
  return (
    <div className="pt-32 min-h-dvh px-6 pb-24 max-w-3xl mx-auto">
      <div className="border border-[#00F5D4]/20 bg-[#0D1323] p-8 md:p-12">
        <h1 className="text-3xl md:text-5xl font-bold text-[#00F5D4] mb-8 uppercase tracking-tight">
          // LEGAL_NOTICE
        </h1>

        <div className="space-y-8 text-sm leading-relaxed text-[#94A3B8] font-mono">
          <section className="border-b border-[#00F5D4]/10 pb-6">
            <h2 className="text-white font-bold text-xs uppercase tracking-widest mb-3">01. WEBSITE PUBLISHER</h2>
            <p className="text-white font-semibold">Aevia WS — Valentin Milliand</p>
            <p>SIREN: 852 546 225</p>
            <p>RCS: Bourg-en-Bresse</p>
            <p>Email: contact@aevia.services</p>
            <p className="mt-2 text-xs text-[#475569]">The publisher's physical location details are protected from public crawler collection and are available upon official request.</p>
          </section>

          <section className="border-b border-[#00F5D4]/10 pb-6">
            <h2 className="text-white font-bold text-xs uppercase tracking-widest mb-3">02. HOSTING PROVIDER</h2>
            <p className="text-white font-semibold">Vercel Inc.</p>
            <p>Address: 340 S Lemon Ave #4133 Walnut, CA 91789, USA</p>
            <p>Website: vercel.com</p>
          </section>

          <section className="border-b border-[#00F5D4]/10 pb-6">
            <h2 className="text-white font-bold text-xs uppercase tracking-widest mb-3">03. INTELLECTUAL RIGHTS</h2>
            <p>
              All modules, ASCII illustrations, source references, and content models displayed on this website are protected under international intellectual property codes. Any reproduction or reuse without publisher agreement will be subject to infringement claims.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-xs uppercase tracking-widest mb-3">04. COOKIE STATEMENT</h2>
            <p>
              This website uses no cookies, trackers, or marketing script components. System inputs are kept in browser memory and discarded on reload. For further details, email contact@aevia.services.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
