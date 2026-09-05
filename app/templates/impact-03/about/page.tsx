'use client';
import {
  clientCity,
  clientName,
} from "@/lib/templates/clientContent";
import { EnteteAnnexe } from "@/lib/templates/EnteteAnnexe";
import { useEffect, useState } from "react";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import React from 'react';

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
  fd = __session?.formData;
  bp = __session?.businessProfile;
  c = __session?.generatedContent;

  return (
    <div
      style={{
        background: '#fafafa',
        color: '#0a0a0a',
        minHeight: '100dvh',
        fontFamily: "'Georgia', 'Times New Roman', serif",
        paddingTop: 80,
      }}
    >
      <EnteteAnnexe session={sessionData} repli="Atelier NOIR" accueil="/templates/impact-03" />
      <div style={{ padding: '40px 64px 100px', maxWidth: 800, margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
        <Link
          href="/templates/impact-03"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'system-ui, sans-serif',
            fontSize: 10,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(10,10,10,0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 48,
            textDecoration: 'none',
          }}
        >
          <ArrowLeft size={14} />
          Retour à l'accueil
        </Link>
        <div style={{ textAlign: 'center', marginBottom: 80 }}>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: 48,
              fontWeight: 300,
              letterSpacing: '-0.02em',
              color: '#0a0a0a',
              marginBottom: 16,
            }}
          >
            Our Story
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: 13,
              color: 'rgba(10,10,10,0.45)',
              letterSpacing: '0.05em',
            }}
          >
            Craftsmanship, design, and longevity.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ display: 'flex', flexDirection: 'column', gap: 40, fontSize: 15, lineHeight: 1.8, color: 'rgba(10,10,10,0.65)' }}
        >
          <p>
            Founded in {clientCity(sessionData) ?? "Paris"} in 2021, Atelier NOIR is an independent fashion house dedicated to the art of quiet luxury. We reject the rapid cycles of fast fashion in favor of a slower, more deliberate method of creation.
          </p>
          <p>
            Our garments are defined by architectural simplicity, meticulous tailoring, and exceptional materials. We work exclusively with certified natural fibers—organic cashmere, French flax linen, and Japanese silk—sourced from mills that guarantee raw material traceability and ecological responsibility.
          </p>
          <p>
            Every piece is handcrafted to order in our Parisian atelier by master artisans who bring decades of high-fashion experience. By making only what is ordered, we eliminate excess production and waste, creating garments that are as responsible as they are beautiful.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
