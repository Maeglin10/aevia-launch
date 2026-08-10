"use client";
import { clientCity } from "@/lib/templates/clientContent";
import { useEffect, useState } from "react";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// Variables de module lues par toute la page : le contrat les reçoit au rendu.
let sessionData: any = null;
let fd: any = null;
let bp: any = null;
let c: any = null;


export default function AtelierPage() {
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

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#0a0806",
        color: "#f0ece0",
        fontFamily: "Georgia, 'Times New Roman', serif",
        padding: "120px 40px",
      }}
    >
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <Link 
          href="/templates/impact-20"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            color: "rgba(212,175,107,0.7)",
            fontSize: 12,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            textDecoration: "none",
            marginBottom: 60,
          }}
        >
          <ArrowLeft size={16} />
          Retour
        </Link>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p
            style={{
              color: "#d4af6b",
              fontSize: 10,
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            Maison Élara
          </p>
          <h1
            style={{
              color: "#f0ece0",
              fontSize: "clamp(36px, 5vw, 64px)",
              fontStyle: "italic",
              fontWeight: 400,
              marginBottom: 40,
              lineHeight: 1.1,
            }}
          >
            Notre Atelier
          </h1>
          <div style={{ color: "rgba(240,236,224,0.7)", fontSize: 16, lineHeight: 1.8 }}>
            <p style={{ marginBottom: 24 }}>
              Au cœur de {clientCity(sessionData) ?? "Paris"}, notre atelier abrite des artisans joailliers qui perpétuent 
              un savoir-faire d'excellence depuis 1947. Chaque pièce est le fruit de centaines 
              d'heures de travail passionné.
            </p>
            <p>
              Notre dévouement à l'artisanat traditionnel français se marie avec une vision 
              moderne de la joaillerie, offrant des créations uniques et mémorables.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
