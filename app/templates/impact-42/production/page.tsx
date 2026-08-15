'use client';
import { resolveList } from "@/lib/templates/resolveList";
import {
  clientServices,
  memoriserSession,
} from "@/lib/templates/clientContent";
import { useEffect, useState } from "react";

import React from "react";
import Link from "next/link";
import { Music, Layers, Volume2, Radio, Cpu, ArrowRight } from "lucide-react";
import { C, SectionReveal } from "../shared";

// Variables de module lues par toute la page : le contrat les reçoit au rendu.
let sessionData: any = null;
let fd: any = null;
let bp: any = null;
let c: any = null;


export default function ProductionPage() {
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

  const services_DEMO_ANNEXE = [
    {
      icon: <Music size={24} color={C.accent} />,
      title: "Beat Production",
      desc: "Beats exclusifs produits par nos producteurs en résidence. Tous styles — trap, boom-bap, afro, électronique, orchestral.",
      pricing: [
        { label: "Beat exclusif", price: "à partir de 500€" },
        { label: "Leasing (non-exclusif)", price: "à partir de 99€" },
        { label: "Pack 5 beats leasing", price: "399€" },
      ],
      color: C.accent,
    },
    {
      icon: <Layers size={24} color="#f97316" />,
      title: "Arrangement & Orchestration",
      desc: "De l'idée brute à l'arrangement complet — cordes, cuivres, chœurs, arrangements électroniques. Tarif sur devis selon complexité.",
      pricing: [
        { label: "Arrangement simple (1-4 instru.)", price: "sur devis" },
        { label: "Arrangement complet", price: "sur devis" },
        { label: "Orchestration complète", price: "sur devis" },
      ],
      color: "#f97316",
    },
    {
      icon: <Volume2 size={24} color="#8b5cf6" />,
      title: "Mix & Mastering",
      desc: "Mixage et mastering par des ingénieurs certifiés. Délai standard 5–7 jours ouvrés. Retours illimités inclus dans le tarif.",
      pricing: [
        { label: "Mixage — par titre", price: "300€" },
        { label: "Mastering — par titre", price: "150€" },
        { label: "Mix + Master bundle", price: "400€/titre" },
      ],
      color: "#8b5cf6",
    },
    {
      icon: <Radio size={24} color="#22c55e" />,
      title: "Music Sync & Supervision",
      desc: "Placement de vos titres en synchronisation (film, série, publicité, jeu vidéo). Supervision musicale pour productions audiovisuelles.",
      pricing: [
        { label: "Dépôt catalogue sync", price: "gratuit" },
        { label: "Supervision musicale", price: "sur devis" },
        { label: "Commission sync placement", price: "20%" },
      ],
      color: "#22c55e",
    },
    {
      icon: <Cpu size={24} color="#06b6d4" />,
      title: "Sample Packs",
      desc: "Packs de samples originaux enregistrés dans nos studios — drums, basses, synthés, one-shots, loops. Droits libres, utilisation commerciale.",
      pricing: [
        { label: "Pack standard (100 samples)", price: "49€" },
        { label: "Pack premium (300 samples)", price: "99€" },
        { label: "Abonnement mensuel", price: "19€/mois" },
      ],
      color: "#06b6d4",
    },
  ];

  const services = resolveList(clientServices(sessionData)?.map((s: any, i: number) => ({ ...services_DEMO_ANNEXE[i % services_DEMO_ANNEXE.length], title: s.title, desc: s.desc || services_DEMO_ANNEXE[i % services_DEMO_ANNEXE.length].desc })), services_DEMO_ANNEXE);


  return (
    <div style={{ minHeight: "100dvh", backgroundColor: C.bg, paddingTop: "4rem" }}>
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "3rem 2rem 2rem" }}>
        <span style={{ fontFamily: C.bodyFont, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.accent }}>Services</span>
        <h1 style={{ fontFamily: C.headingFont, fontSize: "clamp(3rem, 7vw, 5.5rem)", color: C.white, letterSpacing: "0.04em", margin: "0.4rem 0 0.5rem", lineHeight: 1 }}>PRODUCTION</h1>
        <p style={{ fontFamily: C.bodyFont, color: C.textLight, fontSize: "1rem", maxWidth: 560, lineHeight: 1.75, marginBottom: "3.5rem" }}>
          Au-delà de la location de studio, Echo Chamber propose une suite complète de services de production musicale pour accompagner votre projet de A à Z.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginBottom: "4rem" }}>
          {services.map((svc, i) => (
            <SectionReveal key={svc.title} delay={i * 0.07}>
              <div style={{ backgroundColor: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "2rem", display: "grid", gridTemplateColumns: "1fr auto", gap: "2rem", alignItems: "start" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                    {svc.icon}
                    <h3 style={{ fontFamily: C.headingFont, fontSize: "1.5rem", color: C.white, letterSpacing: "0.04em", margin: 0 }}>{svc.title}</h3>
                  </div>
                  <p style={{ fontFamily: C.bodyFont, fontSize: "0.92rem", color: C.textLight, lineHeight: 1.75, maxWidth: 560 }}>{svc.desc}</p>
                </div>
                <div style={{ minWidth: 220 }}>
                  <div style={{ backgroundColor: C.bg, border: `1px solid ${C.border}`, borderRadius: "8px", overflow: "hidden" }}>
                    {svc.pricing.map((p, j) => (
                      <div key={p.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.7rem 1rem", borderBottom: j < svc.pricing.length - 1 ? `1px solid ${C.border}` : "none" }}>
                        <span style={{ fontFamily: C.bodyFont, fontSize: "0.8rem", color: C.textLight }}>{p.label}</span>
                        <span style={{ fontFamily: C.bodyFont, fontSize: "0.82rem", fontWeight: 700, color: svc.color }}>{p.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>

        {/* Devis CTA */}
        <div style={{ backgroundColor: C.accent, borderRadius: "16px", padding: "3rem", textAlign: "center" }}>
          <h2 style={{ fontFamily: C.headingFont, fontSize: "2.5rem", color: C.white, letterSpacing: "0.04em", marginBottom: "0.75rem" }}>DEMANDER UN DEVIS</h2>
          <p style={{ fontFamily: C.bodyFont, color: "rgba(255,255,255,0.8)", lineHeight: 1.7, marginBottom: "1.75rem", maxWidth: 460, margin: "0 auto 1.75rem" }}>
            Chaque projet est unique. Contactez-nous pour un devis personnalisé adapté à vos besoins et votre budget.
          </p>
          <Link href="/templates/impact-42/contact" style={{ textDecoration: "none" }}>
            <div
              style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", backgroundColor: C.white, color: C.accent, padding: "1rem 2.5rem", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: 800, fontFamily: C.bodyFont, fontSize: "0.95rem", letterSpacing: "0.02em" }}
            >
              Nous contacter <ArrowRight size={16} />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
