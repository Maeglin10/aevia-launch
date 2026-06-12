"use client"

import { useState } from "react"
import { Zap, CheckCircle } from "lucide-react"
import { Reveal, plans } from "../shared"

export default function PricingPage() {
  const [annual, setAnnual] = useState(false)

  return (
    <div className="relative w-full overflow-hidden pb-24">
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 bg-[#6C47FF]/10 border border-[#6C47FF]/30 text-[#A78BFA] text-sm font-medium px-4 py-2 rounded-full mb-6">
              <Zap className="w-4 h-4" /> Pricing plans
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-5xl md:text-7xl font-extrabold leading-none mb-6">
              Simple, transparent plans for<br />
              <span className="bg-gradient-to-r from-[#6C47FF] to-[#A78BFA] bg-clip-text text-transparent">every scale.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-xl text-white/55 max-w-2xl mx-auto leading-relaxed mb-8">
              Start for free, upgrade as you grow. All plans include 14-day trials. No setup fees or contracts.
            </p>
          </Reveal>
          
          {/* Toggle button */}
          <Reveal delay={0.3}>
            <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-full p-1 mx-auto">
              <button
                onClick={() => setAnnual(false)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${!annual ? "bg-[#6C47FF] text-white" : "text-white/50 hover:text-white"}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setAnnual(true)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${annual ? "bg-[#6C47FF] text-white" : "text-white/50 hover:text-white"}`}
              >
                Annual <span className="text-[#A78BFA] text-xs ml-1">–20%</span>
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Plans grid */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, i) => (
              <Reveal key={plan.name} delay={i * 0.1}>
                <div className={`rounded-3xl p-8 h-full flex flex-col ${plan.highlight ? "bg-[#6C47FF] border border-[#8B6DFF] shadow-2xl relative" : "bg-white/5 border border-white/10"}`}>
                  {plan.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-[#6C47FF] text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                      Popular
                    </div>
                  )}
                  <div className="mb-6">
                    <div className="text-lg font-bold mb-2">{plan.name}</div>
                    <div className="flex items-end gap-1">
                      <span className="text-4xl font-extrabold">{plan.price === "Custom" ? "Custom" : (annual ? `$${parseInt(plan.price.replace("$", "")) * 0.8}` : plan.price)}</span>
                      <span className={`text-sm mb-1 ${plan.highlight ? "text-white/70" : "text-white/40"}`}>{plan.period}</span>
                    </div>
                    {annual && plan.price !== "Custom" && (
                      <div className="text-xs mt-1 opacity-60">Billed annually</div>
                    )}
                    <p className={`text-xs mt-3 leading-relaxed ${plan.highlight ? "text-white/70" : "text-white/40"}`}>
                      Best for {plan.name === "Starter" ? "early stage projects" : plan.name === "Growth" ? "fast-growing scaleups" : "large enterprises & security requirements"}.
                    </p>
                  </div>
                  <ul className="space-y-3 flex-1 mb-8">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-center gap-3 text-sm">
                        <CheckCircle className={`w-4 h-4 shrink-0 ${plan.highlight ? "text-white" : "text-[#6C47FF]"}`} />
                        <span className={plan.highlight ? "text-white/95" : "text-white/70"}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <button className={`w-full py-4 rounded-full font-bold text-sm transition-all cursor-pointer ${plan.highlight ? "bg-white text-[#6C47FF] hover:bg-white/90" : "border border-white/20 hover:border-[#6C47FF]/60 hover:text-white text-white/70"}`}>
                    {plan.cta}
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
