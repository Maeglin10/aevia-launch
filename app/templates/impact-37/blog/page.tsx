"use client";
import { memoriserSession } from "@/lib/templates/clientContent";

import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import {
  C,
  SERIF,
  SANS,
  BLOG_POSTS,
  SectionReveal,
  PageHeader,
} from "../shared";

// Variables de module lues par toute la page : le contrat les reçoit au rendu.
let sessionData: any = null;
let fd: any = null;
let bp: any = null;
let c: any = null;


export default function BlogPage() {
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

  const [slug, setSlug] = useState<string | null>(null);
  const post = slug ? BLOG_POSTS.find((p) => p.slug === slug) : null;

  if (post) {
    return (
      <article style={{ padding: "140px 5% 100px", background: C.bg, minHeight: "100dvh" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <SectionReveal>
            <button
              onClick={() => setSlug(null)}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                color: C.gold,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: 28,
                padding: 0,
                fontFamily: SANS,
              }}
            >
              <ArrowRight size={14} style={{ transform: "rotate(180deg)" }} /> Retour au journal
            </button>
            <div
              style={{
                fontFamily: SERIF,
                fontSize: 13,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: C.gold,
                marginBottom: 16,
              }}
            >
              {post.category} · {post.date}
            </div>
            <h1
              style={{
                fontFamily: SERIF,
                fontSize: "clamp(32px, 5vw, 56px)",
                fontWeight: 700,
                color: C.burgundy,
                lineHeight: 1.1,
                marginBottom: 32,
              }}
            >
              {post.title}
            </h1>
          </SectionReveal>
          <SectionReveal delay={0.1}>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {post.body.map((para, i) => (
                <p
                  key={i}
                  style={{
                    fontSize: 17,
                    color: C.text,
                    lineHeight: 1.9,
                    fontWeight: 300,
                  }}
                >
                  {para}
                </p>
              ))}
            </div>
          </SectionReveal>
        </div>
      </article>
    );
  }

  return (
    <section style={{ padding: "140px 5% 100px", background: C.bg, minHeight: "100dvh" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <PageHeader
          kicker="Le Journal"
          title="Récits de cave & de comptoir"
          sub="Dégustation, accords mets-vins, visites de vignobles — les pages de carnet de notre équipe de sommeliers."
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))",
            gap: 28,
          }}
        >
          {BLOG_POSTS.map((p, i) => (
            <SectionReveal key={p.slug} delay={i * 0.1}>
              <div
                onClick={() => setSlug(p.slug)}
                style={{
                  background: C.white,
                  borderRadius: 4,
                  padding: 32,
                  border: `1px solid ${C.border}`,
                  cursor: "pointer",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    fontFamily: SERIF,
                    fontSize: 12,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: C.gold,
                    marginBottom: 12,
                  }}
                >
                  {p.category} · {p.date}
                </div>
                <h3
                  style={{
                    fontFamily: SERIF,
                    fontSize: 24,
                    fontWeight: 700,
                    color: C.burgundy,
                    lineHeight: 1.15,
                    marginBottom: 14,
                  }}
                >
                  {p.title}
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    color: C.textMuted,
                    lineHeight: 1.75,
                    fontWeight: 300,
                    flex: 1,
                    marginBottom: 18,
                  }}
                >
                  {p.excerpt}
                </p>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 12,
                    fontWeight: 700,
                    color: C.gold,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  Lire l'article <ArrowRight size={14} />
                </span>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
