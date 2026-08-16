"use client";
import { memoriserSession } from "@/lib/templates/clientContent";
import { useEffect, useState } from "react";

import React from "react";
import {
  C,
  SERIF,
  CARTE_SECTIONS,
  SectionReveal,
  PageHeader,
} from "../shared";

// Variables de module lues par toute la page : le contrat les reçoit au rendu.
let sessionData: any = null;
let fd: any = null;
let bp: any = null;
let c: any = null;


export default function CartePage() {
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
         création, elle peut n'être pas encore lisible. Trois tentatives. */
      for (const attente of [0, 600, 2000]) {
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
    <section style={{ padding: "140px 5% 100px", background: C.bg, minHeight: "100dvh" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <PageHeader
          kicker="La Carte des Vins"
          title="Vins au verre & planches"
          sub="Une carte qui tourne au gré des saisons et des rencontres. Vins servis au verre, planches à partager — pour une soirée qui prend son temps."
        />

        <div style={{ display: "flex", flexDirection: "column", gap: 56 }}>
          {CARTE_SECTIONS.map((sec, si) => (
            <SectionReveal key={sec.id} delay={si * 0.06}>
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                    gap: 16,
                    borderBottom: `1px solid ${C.border}`,
                    paddingBottom: 16,
                    marginBottom: 24,
                  }}
                >
                  <h2
                    style={{
                      fontFamily: SERIF,
                      fontSize: "clamp(24px, 3vw, 34px)",
                      fontWeight: 700,
                      color: C.burgundy,
                    }}
                  >
                    {sec.label}
                  </h2>
                  <span
                    style={{
                      fontSize: 12,
                      color: C.gold,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      fontWeight: 600,
                      textAlign: "right",
                      flexShrink: 0,
                    }}
                  >
                    {sec.note}
                  </span>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))",
                    gap: "8px 48px",
                  }}
                >
                  {sec.items.map((item) => (
                    <div
                      key={item.name}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: 16,
                        padding: "14px 0",
                        borderBottom: `1px solid ${C.border}`,
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontFamily: SERIF,
                            fontSize: 17,
                            fontWeight: 600,
                            color: C.text,
                          }}
                        >
                          {item.name}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: C.textMuted,
                            marginTop: 3,
                            fontStyle: "italic",
                          }}
                        >
                          {item.origin}
                          {item.year !== "—" ? ` · ${item.year}` : ""}
                        </div>
                      </div>
                      <div
                        style={{
                          fontFamily: SERIF,
                          fontSize: 18,
                          fontWeight: 700,
                          color: C.burgundy,
                          whiteSpace: "nowrap",
                          flexShrink: 0,
                        }}
                      >
                        {item.price} €
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>

        <SectionReveal>
          <p
            style={{
              marginTop: 56,
              textAlign: "center",
              fontSize: 12,
              color: C.textMuted,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              fontStyle: "italic",
            }}
          >
            Prix nets, service compris · L'abus d'alcool est dangereux pour la santé
          </p>
        </SectionReveal>
      </div>
    </section>
  );
}
