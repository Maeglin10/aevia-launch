"use client"

import { Globe } from "lucide-react"
import { motion } from "framer-motion"
import { Reveal, integrations } from "../shared"

export default function IntegrationsPage() {
  return (
    <div className="relative w-full overflow-hidden pb-24">
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 bg-[#6C47FF]/10 border border-[#6C47FF]/30 text-[#A78BFA] text-sm font-medium px-4 py-2 rounded-full mb-6">
              <Globe className="w-4 h-4" /> Integrations
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-5xl md:text-7xl font-extrabold leading-none mb-6">
              Connect your stack in<br />
              <span className="bg-gradient-to-r from-[#6C47FF] to-[#A78BFA] bg-clip-text text-transparent">a single click.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-xl text-white/55 max-w-2xl mx-auto leading-relaxed">
              Prism connects natively to your warehouse, CRM, payments processor, and advertising channels. No custom API integrations required.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Categories grid */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Data Sources & Warehouses",
                desc: "Sync raw events natively from databases and query engines.",
                items: ["PostgreSQL", "Snowflake", "BigQuery", "Redshift", "ClickHouse", "MongoDB"]
              },
              {
                title: "Payments & Commerce",
                desc: "Align transaction records with user behavior metrics.",
                items: ["Stripe", "Shopify", "PayPal", "App Store", "Google Play", "Paddle"]
              },
              {
                title: "CRMs & Marketing",
                desc: "Enrich user profiles and trigger messaging based on user actions.",
                items: ["HubSpot", "Salesforce", "Segment", "Intercom", "Mixpanel", "Amplitude"]
              }
            ].map((cat, i) => (
              <Reveal key={cat.title} delay={i * 0.1}>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 h-full flex flex-col">
                  <h3 className="text-xl font-bold mb-3">{cat.title}</h3>
                  <p className="text-white/50 text-xs mb-6 leading-relaxed">{cat.desc}</p>
                  <div className="grid grid-cols-2 gap-2 mt-auto">
                    {cat.items.map(name => (
                      <div key={name} className="bg-white/5 border border-white/5 rounded-xl p-3 text-center text-xs text-white/80 hover:border-[#6C47FF]/30 transition-colors">
                        {name}
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* All integrations list */}
      <section className="py-12 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-3">All Supported Integrations</h3>
            <p className="text-white/50 text-sm">Quick connection through our central portal panel.</p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="flex flex-wrap justify-center gap-3">
              {integrations.map((name, i) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                  viewport={{ once: true }}
                  className="bg-white/5 border border-white/10 rounded-full px-5 py-2.5 text-sm text-white/70 hover:text-white hover:border-[#6C47FF]/40 transition-all cursor-default"
                >
                  {name}
                </motion.div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
