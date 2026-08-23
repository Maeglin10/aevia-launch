"use client"
import { resolveList } from "@/lib/templates/resolveList";
import { clientServices } from "@/lib/templates/clientContent";

import React from "react"
import { useEffect, useState } from "react";
import { Globe, ArrowRight, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { C, SERIF, SectionReveal } from "../shared"
import { clientText } from "@/lib/templates/clientContent";

// Variables de module lues par toute la page : le contrat les reçoit au rendu.
let sessionData: any = null;
let fd: any = null;
let bp: any = null;
let c: any = null;

const SECTORS_DETAIL_DEMO_ANNEXE = [
  {
    name: "Industrie & production",
    desc: "Directeurs de site, responsables production, chefs d'atelier et directions industrielles.",
    placements: "Notre premier secteur",
  },
  {
    name: "Numérique & logiciel",
    desc: "Directions techniques, produits et opérations pour éditeurs et entreprises de services.",
    placements: "Réseau profond",
  },
  {
    name: "Banque & assurance",
    desc: "Directions d'agence et de réseau, conformité, risques et fonctions financières.",
    placements: "Réseau profond",
  },
  {
    name: "Santé",
    desc: "Directions d'établissement, cadres de santé, fonctions support des cliniques et groupes.",
    placements: "Réseau profond",
  },
  {
    name: "BTP & immobilier",
    desc: "Conducteurs de travaux, directions d'agence, promotion et gestion d'actifs.",
    placements: "Pratique régulière",
  },
  {
    name: "Distribution & commerce",
    desc: "Directions de magasin et de réseau, achats, e-commerce et marketing.",
    placements: "Pratique régulière",
  },
  {
    name: "Transport & logistique",
    desc: "Directions d'exploitation, supply chain et responsables de plateforme.",
    placements: "Pratique régulière",
  },
  {
    name: "Énergie & environnement",
    desc: "Chefs de projet renouvelables, directions techniques et fonctions QHSE.",
    placements: "Pratique régulière",
  },
  {
    name: "Agroalimentaire",
    desc: "Directions d'usine, qualité, R&D et directions commerciales.",
    placements: "Pratique régulière",
  },
  {
    name: "Services aux entreprises",
    desc: "Associés, directeurs de mission et responsables de practice.",
    placements: "Pratique régulière",
  },
  {
    name: "Juridique & chiffre",
    desc: "Experts-comptables, juristes d'entreprise, associés de cabinet et directions financières.",
    placements: "Réseau profond",
  },
  {
    name: "Secteur public & associatif",
    desc: "Directions générales, direction de structures et responsables de collecte.",
    placements: "Sur mandat",
  },
];
function SECTORS_DETAIL_LIVE() {
  return resolveList(clientServices(sessionData)?.map((s: any, i: number) => ({ ...SECTORS_DETAIL_DEMO_ANNEXE[i % SECTORS_DETAIL_DEMO_ANNEXE.length], name: s.title, desc: s.desc || SECTORS_DETAIL_DEMO_ANNEXE[i % SECTORS_DETAIL_DEMO_ANNEXE.length].desc })), SECTORS_DETAIL_DEMO_ANNEXE);
}
let SECTORS_DETAIL = SECTORS_DETAIL_DEMO_ANNEXE;



export default function SectorsPage() {
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
  fd = __session?.formData;
  bp = __session?.businessProfile;
  c = __session?.generatedContent;
  SECTORS_DETAIL = SECTORS_DETAIL_LIVE();

  return (
    <div style={{ padding: "60px 5%", background: C.bg, minHeight: "100dvh" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Title */}
        <SectionReveal>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: C.accentLight,
                borderRadius: 30,
                padding: "6px 16px",
                marginBottom: 16,
              }}
            >
              <Globe size={14} color={C.accentFixe} />
              <span style={{ color: C.accentFixe, fontSize: 13, fontWeight: 600 }}>Les secteurs que nous connaissons</span>
            </div>
            <h1 style={{ fontFamily: SERIF, fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 600, color: C.navy, marginBottom: 16 }}>{/* TEXTE_SECTION */ clientText(sessionData, "secteurs-page.titre") ?? (<>
              Nos secteurs
            </>)}</h1>
            <p style={{ fontSize: 17, color: C.textMuted, maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>
              Douze secteurs, des réseaux entretenus depuis dix-huit ans de recrutements spécialisés.
            </p>
          </div>
        </SectionReveal>

        {/* Sectors Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", gap: 24, marginBottom: 64 }}>
          {SECTORS_DETAIL.map((sector, i) => (
            <SectionReveal key={sector.name} delay={i * 0.05}>
              <div
                style={{
                  background: C.white,
                  border: `1px solid ${C.border}`,
                  borderRadius: 16,
                  padding: 28,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "all 0.2s",
                }}
                className="group hover:shadow-md transition-all"
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                    <Globe size={18} color={C.accentFixe} style={{ flexShrink: 0 }} />
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: C.navy, margin: 0 }}>{sector.name}</h3>
                  </div>
                  <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.6, margin: 0, marginBottom: 20 }}>
                    {sector.desc}
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, borderTop: `1px solid ${C.border}`, paddingTop: 14 }}>
                  <CheckCircle2 size={14} color={C.accentFixe} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: C.accentFixe }}>{sector.placements}</span>
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>

        {/* CTA */}
        <SectionReveal delay={0.25}>
          <div
            style={{
              background: C.navy,
              borderRadius: 24,
              padding: "48px 56px",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <h2 style={{ fontFamily: SERIF, fontSize: 28, fontWeight: 600, color: C.white, marginBottom: 16 }}>
              Votre secteur est ici ?
            </h2>
            <p style={{ fontSize: 16, color: C.surMarine, maxWidth: 480, margin: "0 auto 32px", lineHeight: 1.7 }}>
              Nos consultants viennent de ces métiers : ils savent lire un CV de votre secteur — et repérer ce qui n'y figure pas.
            </p>
            <Link href="/templates/impact-36/services#contact-form" style={{ textDecoration: "none" }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: C.surMarine,
                  color: C.navy,
                  padding: "14px 28px",
                  borderRadius: 8,
                  fontWeight: 700,
                  fontSize: 15,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Lancer un mandat <ArrowRight size={16} />
              </span>
            </Link>
          </div>
        </SectionReveal>
      </div>
    </div>
  )
}
