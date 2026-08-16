'use client';
import { memoriserSession } from "@/lib/templates/clientContent";
import { useEffect, useState } from "react";

import React from 'react';
import { SCENES, LookbookGrid, FabricSection } from '../shared';

// Variables de module lues par toute la page : le contrat les reçoit au rendu.
let sessionData: any = null;
let fd: any = null;
let bp: any = null;
let c: any = null;


export default function LookbookPage() {
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
    <div style={{ minHeight: '100dvh', backgroundColor: SCENES[2].bg }}>
      <FabricSection pattern="grid" scene={SCENES[2]}>
        <div style={{ padding: '6rem 5rem 3rem' }}>
          <div style={{ marginBottom: '4rem' }}>
            <div
              style={{
                fontFamily: 'monospace',
                fontSize: '0.7rem',
                letterSpacing: '0.3em',
                color: SCENES[2].accent,
                textTransform: 'uppercase',
                marginBottom: '1.25rem',
              }}
            >
              Lookbook
            </div>
            <h1
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 'clamp(2.5rem, 5.5vw, 4.5rem)',
                fontWeight: 300,
                color: SCENES[2].textPrimary,
                letterSpacing: '0.06em',
                lineHeight: 1.05,
              }}
            >
              L'Image Permanente
            </h1>
          </div>
        </div>
        <LookbookGrid scene={SCENES[2]} />
      </FabricSection>
    </div>
  );
}
