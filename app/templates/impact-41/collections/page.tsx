'use client';
import { memoriserSession } from "@/lib/templates/clientContent";
import { useEffect, useState } from "react";

import React from 'react';
import { SCENES, RunwayCarousel, FabricSection } from '../shared';

// Variables de module lues par toute la page : le contrat les reçoit au rendu.
let sessionData: any = null;
let fd: any = null;
let bp: any = null;
let c: any = null;


export default function CollectionsPage() {
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
    <div style={{ minHeight: '100dvh', backgroundColor: SCENES[1].bg }}>
      <FabricSection pattern="herringbone" scene={SCENES[1]}>
        <div style={{ padding: '6rem 5rem 0' }}>
          <div
            style={{
              fontFamily: 'monospace',
              fontSize: '0.7rem',
              letterSpacing: '0.3em',
              color: SCENES[1].accent,
              textTransform: 'uppercase',
              marginBottom: '1.25rem',
            }}
          >
            Défilé Permanent
          </div>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 'clamp(2.5rem, 5.5vw, 4.5rem)',
              fontWeight: 300,
              color: SCENES[1].textPrimary,
              letterSpacing: '0.06em',
              lineHeight: 1.05,
              marginBottom: '2rem',
            }}
          >
            Les Collections
          </h1>
        </div>
        <RunwayCarousel scene={SCENES[1]} />
      </FabricSection>
    </div>
  );
}
