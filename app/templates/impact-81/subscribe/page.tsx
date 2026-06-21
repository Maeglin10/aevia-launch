"use client";

import React, { useState } from "react";
import { Reveal } from "../shared";

export default function SubscribePage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="py-24 bg-[#0A0A08] min-h-screen">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <Reveal>
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#C9A86C] mb-4">S&apos;abonner</p>
          <h1 className="text-4xl md:text-5xl font-light mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            L&apos;offre de <em>Vogue Noire</em>
          </h1>
          <p className="text-[#A0988A] text-sm mb-12 max-w-md mx-auto">Rejoignez nos lecteurs et recevez le magazine imprimé chaque mois chez vous, ainsi qu&apos;un accès complet aux archives numériques.</p>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-8 mb-20 max-w-2xl mx-auto text-left">
          <Reveal delay={0.05}>
            <div className="border border-[#2A2A20] p-8 bg-[#0E0E0C]">
              <h2 className="text-2xl font-light text-white mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Annuel</h2>
              <div className="text-3xl font-light text-[#C9A86C] mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>85 € / an</div>
              <p className="text-xs text-[#6A6058] mb-6">12 numéros imprimés + Version numérique + Hors-séries inclus.</p>
              <button onClick={() => setSubmitted(true)} className="w-full py-3 bg-[#C9A86C] text-[#0A0A08] text-xs uppercase tracking-widest hover:bg-[#F0EBE0] transition-colors cursor-pointer">
                S&apos;abonner
              </button>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="border border-[#2A2A20] p-8 bg-[#0E0E0C]">
              <h2 className="text-2xl font-light text-white mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Mensuel</h2>
              <div className="text-3xl font-light text-[#C9A86C] mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>8,50 € / mois</div>
              <p className="text-xs text-[#6A6058] mb-6">Sans engagement. Numéro en cours + Version numérique.</p>
              <button onClick={() => setSubmitted(true)} className="w-full py-3 border border-[#C9A86C] text-[#C9A86C] text-xs uppercase tracking-widest hover:bg-[#C9A86C] hover:text-[#0A0A08] transition-colors cursor-pointer">
                S&apos;abonner
              </button>
            </div>
          </Reveal>
        </div>

        {/* Newsletter */}
        <Reveal>
          <div className="border-t border-[#2A2A20] pt-20">
            <p className="text-[10px] tracking-[0.4em] uppercase text-[#C9A86C] mb-4">Restez informés</p>
            <h2 className="text-3xl font-light mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              La lettre de <em>Vogue Noire</em>
            </h2>
            <p className="text-[#6A6058] text-sm mb-8 max-w-md mx-auto">Actualités des maisons, portfolios exclusifs. Chaque semaine, dans votre boîte mail.</p>
            {submitted ? (
              <p className="text-sm text-[#C9A86C]">Merci, nous vous répondrons sous 24h.</p>
            ) : (
              <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={e => { e.preventDefault(); setSubmitted(true); }}>
                <input type="email" placeholder="Votre adresse email" className="flex-1 bg-transparent border border-[#2A2A20] px-5 py-3.5 text-sm text-[#F0EBE0] focus:outline-none focus:border-[#C9A86C] transition-colors" />
                <button type="submit" className="px-8 py-3.5 bg-[#C9A86C] text-[#0A0A08] text-xs tracking-widest uppercase font-medium hover:bg-[#F0EBE0] transition-colors cursor-pointer">
                  S&apos;abonner
                </button>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
