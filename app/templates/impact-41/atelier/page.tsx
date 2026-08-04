'use client';
import { useEffect, useState } from "react";

import React from 'react';
import { SCENES, AtelierSection, FabricSection } from '../shared';


// Variables de module lues par toute la page : le contrat les reçoit au rendu.
let sessionData: any = null;
let fd: any = null;
let bp: any = null;
let c: any = null;

export default function AtelierPage() {
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

  return (
    <div style={{ minHeight: '100dvh', backgroundColor: SCENES[3].bg }}>
      <FabricSection pattern="diagonal" scene={SCENES[3]}>
        <div style={{ paddingTop: '4rem' }}>
          <AtelierSection scene={SCENES[3]} />
        </div>
      </FabricSection>
    </div>
  );
}
