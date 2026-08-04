'use client';
import { useEffect, useState } from "react";

import { LegalIdentity } from "@/app/templates/LegalIdentity";
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import React from 'react';


// Variables de module lues par toute la page : le contrat les reçoit au rendu.
let sessionData: any = null;
let fd: any = null;
let bp: any = null;
let c: any = null;

export default function MentionsPage() {
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
    <div
      style={{
        background: '#fafafa',
        color: '#0a0a0a',
        minHeight: '100dvh',
        fontFamily: "'Georgia', 'Times New Roman', serif",
        paddingTop: 80,
      }}
    >
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
          Back to Home
        </Link>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ fontFamily: "'Georgia', serif", fontSize: 36, fontWeight: 300, letterSpacing: '-0.02em', color: '#0a0a0a', marginBottom: 40 }}
        >
          Mentions Légales
        </motion.h1>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          style={{ display: 'flex', flexDirection: 'column', gap: 32, fontSize: 14, lineHeight: 1.8, color: 'rgba(10,10,10,0.65)' }}
        >
          <div>
            <h2 style={{ fontFamily: "'Georgia', serif", fontSize: 18, fontWeight: 300, color: '#0a0a0a', marginBottom: 12 }}>Éditeur</h2>
            <p>
              Aevia WS — Valentin Milliand<br />
              Entrepreneur individuel<br />
              SIREN <LegalIdentity /><br />
              RCS Bourg-en-Bresse<br />
              {fd?.email ?? "valentinmilliand@aevia.services"}
            </p>
          </div>
          <div>
            <h2 style={{ fontFamily: "'Georgia', serif", fontSize: 18, fontWeight: 300, color: '#0a0a0a', marginBottom: 12 }}>Hébergeur</h2>
            <p>
              Vercel Inc.<br />
              340 S Lemon Ave #4133<br />
              Walnut, CA 91789, USA
            </p>
          </div>
          <div>
            <h2 style={{ fontFamily: "'Georgia', serif", fontSize: 18, fontWeight: 300, color: '#0a0a0a', marginBottom: 12 }}>Adresse physique</h2>
            <p>Communiquée sur demande.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
