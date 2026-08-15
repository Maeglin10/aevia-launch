"use client";
import {
  clientCity,
  clientName,
  clientServices,
  clientTagline,
  clientText,
  clientTrade,
  memoriserSession,
} from "@/lib/templates/clientContent";
import { EnteteAnnexe } from "@/lib/templates/EnteteAnnexe";
import { resolveList } from "@/lib/templates/resolveList";
import { useEffect, useState } from "react";
// @ts-nocheck

import { Check, Terminal } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Reveal } from "../shared";

// Variables de module lues par toute la page : le contrat les reçoit au rendu.
let sessionData: any = null;
let fd: any = null;
let bp: any = null;
let c: any = null;


export default function PricingPage() {
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
    fetch(`/api/sessions?id=${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((s) => s && __setSession(s))
      .catch(() => {});
  }, []);

  sessionData = __session;
  memoriserSession(__session);
  fd = __session?.formData;
  bp = __session?.businessProfile;
  c = __session?.generatedContent;

  return (
    <div className="py-20 bg-[#05060a]">
      <EnteteAnnexe session={sessionData} repli={`${clientName(sessionData) ?? "Aevia Kitchen"}`} accueil="/templates/impact-74" />
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <Reveal className="text-center mb-24 max-w-2xl mx-auto">
          <span className="text-[10px] uppercase tracking-[0.5em] font-black text-emerald-500 mb-6 block">
            Infrastructure Tiers
          </span>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic text-white leading-[1.15] pb-4">
            {/* TEXTE_SECTION */ clientText(sessionData, "tarifs.titre") ?? "Tier_Select."}
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          {/* PRESTATIONS */ resolveList(clientServices(sessionData)?.map((s: any) => ({ title: s.title, desc: s.desc || "", ...(s.price ? { price: s.price } : {}) })), [
            {
              title: "Standard",
              price: "$1,400",
              desc: "For SME networks and emerging tech stacks.",
              features: [
                "Edge Sentinel WAF",
                "Standard Neural Audit",
                "12h Log Retention",
                "Shared Integrity Node",
              ],
            },
            {
              title: "Institutional",
              price: "$8,500",
              desc: "For high-volume financial and healthcare perimeters.",
              features: [
                "Quantum Shield Layer",
                "Real-time Neural Audit",
                "Infinite Log Retention",
                "Dedicated Integrity Node",
                "24/7 Red Team Support",
              ],
            },
            {
              title: "Sovereign",
              price: "CUSTOM",
              desc: "For government and critical national infrastructure.",
              features: [
                "Full Air-Gap Vaults",
                "Bespoke Neural Models",
                "Physical HSM Deployment",
                "On-Prem Control Plane",
                "Tactical Response Unit",
              ],
            },
          ]).map((tier, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div
                className={`p-12 border ${tier.title === "Institutional" ? "bg-emerald-600/5 border-emerald-500/40 shadow-2xl shadow-emerald-500/5" : "bg-white/[0.02] border-white/5"} rounded-3xl flex flex-col h-full hover:border-emerald-500/20 transition-all`}
              >
                <div className="text-3xl font-black text-emerald-500 mb-6 italic tabular-nums">
                  {tier.price}
                </div>
                <h4 className="text-lg font-black uppercase tracking-widest text-white mb-6 italic">
                  {tier.title}
                </h4>
                <p className="text-[11px] text-white/20 leading-relaxed font-bold uppercase tracking-widest italic mb-10 flex-1">
     {/* TEXTE_SECTION */ clientText(sessionData, "tarifs.texte") ?? clientTagline(sessionData) ?? "{tier.desc}"}</p>
                <ul className="space-y-4 mb-12">
                  {tier.features.map((f, j) => (
                    <li
                      key={j}
                      className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-white/40"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-500" /> {f}
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-5 text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer ${tier.title === "Institutional" ? "bg-emerald-600 text-white hover:bg-emerald-500 shadow-xl shadow-emerald-600/20" : "border border-white/10 text-white hover:bg-white hover:text-black"}`}
                >
                  {tier.title === "Sovereign"
                    ? "REQUEST_BRIEFING"
                    : "INITIALIZE_DEPLOY"}
                </button>
              </div>
            </Reveal>
          ))}
        </div>

        {/* FAQ (The Buffer) */}
        <div className="max-w-3xl mx-auto px-6">
          <Reveal className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-[1.15] uppercase italic text-white pb-4">
              Cyber_Buffer
            </h2>
          </Reveal>

          <Accordion type="single" collapsible className="space-y-4">
            {[
              {
                q: "How does Neural Audit differ from standard logging?",
                a: "Neural Audit uses behavioral models to identify anomalies in system calls, even if the user has legitimate credentials. It detects 'intent' rather than just 'actions'.",
              },
              {
                q: "Can Aevia Cyber be deployed on-premise?",
                a: "Yes. Our Sovereign tier is specifically designed for air-gapped, on-premise environments with local control planes and physical security modules.",
              },
              {
                q: "What is the deployment timeframe?",
                a: "Standard and Institutional tiers can be deployed in under 2 hours via our automated CloudFormation or Terraform modules. Sovereign deployments require a physical site audit.",
              },
              {
                q: "How do you handle zero-day vulnerabilities?",
                a: "Our Quantum Shield layer uses proactive memory isolation to prevent unauthorized instruction execution, mitigating vulnerabilities before they are even discovered.",
              },
            ].map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border-b border-white/5"
              >
                <AccordionTrigger className="text-left text-sm uppercase font-bold tracking-widest py-8 hover:text-emerald-500 hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-white/20 leading-relaxed font-bold uppercase tracking-widest pb-8 italic">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}
