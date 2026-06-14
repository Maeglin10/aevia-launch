"use client";

import React, { useState } from "react";
import { CheckCircle } from "lucide-react";
import { Reveal, PLANS } from "../shared";

export default function PricingPage() {
  const [billingAnnual, setBillingAnnual] = useState(false);

  return (
    <main className="pt-40 pb-20 max-w-7xl mx-auto px-6">
      <Reveal>
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-[#6366F1] uppercase tracking-widest block mb-3">
            Tarifs
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#1E1B4B] mb-6">
            Des tarifs transparents, sans engagement
          </h1>
          <p className="text-[#6B7280] font-medium mb-10">
            Choisissez le plan adapté à vos ambitions d'apprentissage et commencez à monter en compétences dès aujourd'hui.
          </p>

          {/* Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span
              className={`text-sm font-semibold ${
                !billingAnnual ? "text-[#1E1B4B]" : "text-[#9CA3AF]"
              }`}
            >
              Mensuel
            </span>
            <button
              onClick={() => setBillingAnnual(!billingAnnual)}
              className="w-14 h-8 rounded-full bg-[#E0E7FF] p-1 flex items-center transition-colors relative"
            >
              <div
                className={`w-6 h-6 rounded-full bg-[#6366F1] shadow-sm transform transition-transform ${
                  billingAnnual ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
            <span
              className={`text-sm font-semibold flex items-center gap-1.5 ${
                billingAnnual ? "text-[#1E1B4B]" : "text-[#9CA3AF]"
              }`}
            >
              Annuel
              <span className="px-2 py-0.5 rounded-md bg-[#10B981] text-white text-[10px] font-bold uppercase">
                -20%
              </span>
            </span>
          </div>
        </div>
      </Reveal>

      {/* Pricing cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-24">
        {PLANS.map((plan, i) => {
          const rawPrice = parseInt(plan.price.replace("€", ""));
          const calculatedPrice = billingAnnual
            ? Math.round(rawPrice * 0.8 * 12)
            : rawPrice;

          return (
            <Reveal key={plan.name} delay={i * 0.1}>
              <div
                style={{
                  borderColor: plan.highlight ? "#6366F1" : "#E5E7EB",
                  backgroundColor: plan.highlight ? "#white" : "rgba(255,255,255,0.6)",
                }}
                className={`p-10 rounded-[2.5rem] bg-white border flex flex-col justify-between h-full relative ${
                  plan.highlight ? "shadow-[0_20px_40px_rgba(99,102,241,0.06)]" : "shadow-sm"
                }`}
              >
                {plan.highlight && (
                  <span className="absolute top-0 right-10 transform -translate-y-1/2 px-4 py-1.5 rounded-full bg-[#6366F1] text-white text-xs font-bold uppercase tracking-wider shadow-md">
                    Recommandé
                  </span>
                )}
                <div>
                  <h3 className="font-extrabold text-2xl mb-2 text-[#1E1B4B]">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-[#6B7280] mb-8 min-h-[32px]">
                    {plan.description}
                  </p>
                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-5xl font-black text-[#1E1B4B]">
                      {billingAnnual && plan.price !== "0€"
                        ? `${Math.round(calculatedPrice / 12)}€`
                        : plan.price}
                    </span>
                    <span className="text-sm font-semibold text-[#6B7280]">
                      /mois
                    </span>
                  </div>

                  <hr className="border-[#EEF2FF] mb-8" />

                  <ul className="space-y-4 mb-10">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-3 text-sm text-[#4B5563]">
                        <CheckCircle className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                        {feat}
                      </li>
                    ))}
                    {plan.missing?.map((feat) => (
                      <li key={feat} className="flex items-start gap-3 text-sm text-[#9CA3AF] line-through">
                        <CheckCircle className="w-5 h-5 text-[#9CA3AF]/40 flex-shrink-0 mt-0.5" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  className={`w-full py-4 rounded-xl text-sm font-bold transition-colors ${
                    plan.highlight
                      ? "bg-[#6366F1] text-white hover:bg-[#4F46E5]"
                      : "bg-[#EEF2FF] text-[#6366F1] hover:bg-[#E0E7FF]"
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            </Reveal>
          );
        })}
      </div>
    </main>
  );
}
