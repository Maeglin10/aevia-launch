"use client";
import { useEffect, useState } from "react";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { C, ORIGINS, OriginMap, SectionReveal, PageHeader } from "../shared";

// Variables de module lues par toute la page : le contrat les reçoit au rendu.
let sessionData: any = null;
let fd: any = null;
let bp: any = null;
let c: any = null;


export default function OriginsPage() {
  const [__session, __setSession] = useState<any>(null);
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("session");
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

  const roastColor = (level: string) => {
    if (level === "Light") return "#c4813a";
    if (level === "Medium") return "#8B4513";
    return "#1a0a00";
  };

  return (
    <div>
      <PageHeader
        title="Nos Origines"
        subtitle="Chaque café que nous proposons est sélectionné lors de visites directes chez nos producteurs. Moins de 8% des échantillons reçus passent notre sélection."
      />
      <div style={{ padding: "80px 5%", background: C.bg }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ marginBottom: 60 }}>
              <OriginMap />
            </div>
          </SectionReveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))", gap: 32 }}>
            {ORIGINS.map((coffee, i) => (
              <SectionReveal key={coffee.name} delay={i * 0.1}>
                <div style={{ background: C.white, borderRadius: 16, overflow: "hidden", border: `1px solid ${C.border}`, display: "flex", flexDirection: "column", height: "100%" }}>
                  <div style={{ position: "relative", height: 220, overflow: "hidden" }}>
                    <img
                      src={coffee.image}
                      alt={coffee.name}
                      loading="lazy"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(26,10,0,0.6) 0%, transparent 60%)" }} />
                    <div style={{ position: "absolute", bottom: 16, left: 20, right: 20, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                      <div>
                        <div style={{ display: "inline-block", background: `${C.caramel}cc`, color: C.white, fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, marginBottom: 6, letterSpacing: "0.06em" }}>
                          {coffee.region} — {coffee.origin}
                        </div>
                        <h3 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 20, fontWeight: 700, color: C.white, margin: 0 }}>
                          {coffee.name}
                        </h3>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 30, fontWeight: 700, color: C.caramelLight }}>{coffee.price}€</div>
                        <div style={{ fontSize: 11, color: C.sand }}>/ 100g</div>
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: 28, flex: 1, display: "flex", flexDirection: "column", gap: 18 }}>
                    <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.8, fontWeight: 300 }}>
                      {coffee.longDescription}
                    </p>

                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      {[
                        { label: "Traitement", val: coffee.process },
                        { label: "Altitude", val: coffee.altitude },
                      ].map((d) => (
                        <div key={d.label} style={{ background: C.bgAlt, borderRadius: 8, padding: "8px 14px" }}>
                          <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>{d.label}</div>
                          <div style={{ fontSize: 13, color: C.espresso, fontWeight: 600, marginTop: 2 }}>{d.val}</div>
                        </div>
                      ))}
                      <div style={{ background: C.bgAlt, borderRadius: 8, padding: "8px 14px" }}>
                        <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Torréfaction</div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: roastColor(coffee.roast), marginTop: 2 }}>{coffee.roast}</div>
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
                        Notes de dégustation
                      </div>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {coffee.flavor.map((f) => (
                          <span key={f} style={{ background: `${C.caramel}18`, color: C.caramel, fontSize: 12, fontWeight: 600, padding: "5px 12px", borderRadius: 20, border: `1px solid ${C.caramel}30` }}>
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 12, marginTop: "auto" }}>
                      <Link href="/templates/impact-38/abonnement" style={{ textDecoration: "none", flex: 1, display: "flex" }}>
                        <span
                          style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.caramel, color: C.white, padding: "12px 20px", borderRadius: 8, fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer", width: "100%", justifyContent: "center" }}
                        >
                          Ajouter au panier <ArrowRight size={15} />
                        </span>
                      </Link>
                      <Link href="/templates/impact-38/abonnement" style={{ textDecoration: "none", display: "flex" }}>
                        <span
                          style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.caramelLight, color: C.caramel, padding: "12px 16px", borderRadius: 8, fontWeight: 600, fontSize: 13, border: "none", cursor: "pointer" }}
                        >
                          S'abonner
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
