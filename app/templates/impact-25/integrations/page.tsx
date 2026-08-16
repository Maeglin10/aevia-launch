"use client"

import { Globe } from "lucide-react"
import { useEffect, useState } from "react";
import { EnteteAnnexe } from "@/lib/templates/EnteteAnnexe";
import {
  clientCity,
  clientName,
  clientServices,
  clientTagline,
  clientText,
  clientTrade,
  memoriserSession,
} from "@/lib/templates/clientContent";
import { motion } from "framer-motion"
import { Reveal, integrations } from "../shared"

// Variables de module lues par toute la page : le contrat les reçoit au rendu.
let sessionData: any = null;
let fd: any = null;
let bp: any = null;
let c: any = null;


export default function IntegrationsPage() {
  const [__session, __setSession] = useState<any>(null);
  useEffect(() => {
    let id = new URLSearchParams(window.location.search).get("session");
    /* La navigation interne perd le paramètre : on retient la session par thème. */
    try {
      const cleSession = "apercu-session:" + window.location.pathname.split("/")[2];
      if (id) sessionStorage.setItem(cleSession, id);
      else id = sessionStorage.getItem(cleSession);
    } catch {}
    if (!id) return;
    (async () => {
      /* La session vient d'un stockage distant : chargée dans la foulée de sa
         création, elle peut n'être pas encore lisible. Cinq tentatives, jusqu'à
         onze secondes : trois ne suffisaient pas, et une page qui rate la
         dernière garde le repli de la démonstration pour toujours. */
      for (const attente of [0, 500, 1500, 3000, 6000]) {
        if (attente) await new Promise((r) => setTimeout(r, attente));
        try {
          const reponse = await fetch(`/api/sessions?id=${id}`);
          if (!reponse.ok) continue;
          const donnees = await reponse.json();
          if (donnees) { __setSession(donnees); return; }
        } catch {}
      }
    })();
  }, []);

  sessionData = __session;
  memoriserSession(__session);
  fd = __session?.formData;
  bp = __session?.businessProfile;
  c = __session?.generatedContent;

  return (
    <div className="relative w-full overflow-hidden pb-24">
      <EnteteAnnexe session={sessionData} repli="Nexus" accueil="/templates/impact-25" />
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
              {/* TEXTE_SECTION */ clientText(sessionData, "integrations.texte") ?? clientTagline(sessionData) ?? "Prism connects natively to your warehouse, CRM, payments processor, and advertising channels. No custom API integrations required."}
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
