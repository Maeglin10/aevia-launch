'use client';
import { useEffect, useState } from "react";

import React from 'react';
import { SCENES, ContactSection, FabricSection } from '../shared';


// Variables de module lues par toute la page : le contrat les reçoit au rendu.
let sessionData: any = null;
let fd: any = null;
let bp: any = null;
let c: any = null;

export default function ContactPage() {
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
    <div style={{ minHeight: '100dvh', backgroundColor: SCENES[1].bg }}>
      <FabricSection pattern="grid" scene={SCENES[1]}>
        <div style={{ paddingTop: '4rem' }}>
          <ContactSection scene={SCENES[1]} />
        </div>
      </FabricSection>
    </div>
  );
}
