"use client";
import { useEffect, useState } from "react";
import {
  clientAddress,
  clientCity,
  clientEmail,
  clientName,
  clientPhone,
  clientTagline,
  clientText,
  clientTrade,
  memoriserSession,
} from "@/lib/templates/clientContent";

import React from "react";
import { TerminalWindow } from "../shared";

// Variables de module lues par toute la page : le contrat les reçoit au rendu.
let sessionData: any = null;
let fd: any = null;
let bp: any = null;
let c: any = null;


export default function AboutPage() {
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
    <section style={{ padding: "80px 40px", minHeight: "calc(100vh - 104px)" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ color: "#008F11", fontSize: "11px", letterSpacing: "0.2em", marginBottom: "8px" }}>
          ■ SECTION_05 // WHOAMI
        </div>
        <h2 style={{ color: "#00FF41", fontSize: "clamp(22px, 3vw, 36px)", marginBottom: "48px", letterSpacing: "0.08em", fontWeight: "normal" }}>
          WHOAMI
        </h2>

        <TerminalWindow title="whoami.sh — identity disclosure">
          <div style={{ marginBottom: "20px" }}>
            <span style={{ color: "#008F11", fontSize: "12px", letterSpacing: "0.06em" }}>ghost@shell:~$ </span>
            <span style={{ color: "#00FF41", fontSize: "12px", letterSpacing: "0.06em" }}>whoami --verbose</span>
          </div>

          <div style={{ borderLeft: "2px solid #003300", paddingLeft: "20px", marginBottom: "28px" }}>
            {[
              /*
                La sortie du terminal décrivait un collectif fictif. Elle décrit
                maintenant l'entreprise du client, dans la même mise en scène :
                le geste du thème est conservé, le contenu est le sien.
              */
              ["identité",  clientName(sessionData) ?? "0(ghost) gid=0(root) groups=0(root),4(adm),27(sudo)"],
              ["métier",    clientTrade(sessionData) ?? "/bin/ghost_shell"],
              ["secteur",   clientCity(sessionData) ?? "ghost-prod-01.internal"],
              ["ancienneté", clientText(sessionData, "identite.anciennete") ?? "847 days, 14:22:09"],
              ["statut",    clientText(sessionData, "identite.statut") ?? "CLASSIFIED / SAP ACCESS"],
            ].map(([key, val]) => (
              <div key={key} style={{ display: "flex", gap: "12px", fontSize: "12px", lineHeight: "1.9", letterSpacing: "0.04em" }}>
                <span style={{ color: "#005500", minWidth: "90px" }}>{key}:</span>
                <span style={{ color: "#008F11" }}>{val}</span>
              </div>
            ))}
          </div>

          <div style={{ color: "#008F11", fontSize: "13px", lineHeight: "1.9", letterSpacing: "0.04em" }}>
            <p style={{ marginBottom: "16px" }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "apropos.texte") ??
                clientTagline(sessionData) ??
                `# Ghost Shell is a stealth-first engineering collective operating at the intersection
              # of offensive security and product design. We build systems that resist adversaries
              # by design — not as an afterthought.`}
            </p>
            <p style={{ marginBottom: "16px" }}>
              # Our team has shipped infrastructure for red-team operations, zero-trust enterprise
              # dashboards, and anonymized deployment pipelines used by 2,847+ clients across
              # 38 jurisdictions.
            </p>
            <p style={{ marginBottom: "0px" }}>
              # We don&apos;t leave traces. <span style={{ color: "#00FF41" }}>That&apos;s the point.</span>
            </p>
          </div>
        </TerminalWindow>
      </div>
    </section>
  );
}
