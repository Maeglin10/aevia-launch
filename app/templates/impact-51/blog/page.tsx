"use client";
import { memoriserSession } from "@/lib/templates/clientContent";
import { useEffect, useState } from "react";

import React from "react";
import { T, Reveal } from "../shared";

// Variables de module lues par toute la page : le contrat les reçoit au rendu.
let sessionData: any = null;
let fd: any = null;
let bp: any = null;
let c: any = null;

const POSTS = [
  {
    title: "Why we built a unified pipeline analytics solution",
    excerpt: "Product analytics and engineering pipelines shouldn't live in separate databases. Here's how we consolidated them for better performance.",
    date: "10 juin 2026",
    readTime: "5 min read",
    author: "Sofia Andersson",
  },
  {
    title: "Consolidating your SaaS stack for security audits",
    excerpt: "Preparing for SOC 2 or GDPR compliance audits is tough. Consolidating your tools is the easiest way to simplify security compliance.",
    date: "28 mai 2026",
    readTime: "7 min read",
    author: "Lena Fischer",
  },
  {
    title: "How Orbit Labs scaled daily active users by 300%",
    excerpt: "A deep dive into how Orbit Labs utilized custom triggers and Slack integrations to drive engagement and retention.",
    date: "15 avril 2026",
    readTime: "4 min read",
    author: "Marcus Reyes",
  },
];


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

  return (
    <main style={{ background: "#ffffff", paddingTop: 140, paddingBottom: 100 }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 40px" }}>
        <Reveal>
          <div style={{ marginBottom: 80 }}>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: T.accent,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                fontFamily: T.bodyFont,
                marginBottom: 12,
                display: "block",
              }}
            >
              Nexus Blog
            </span>
            <h1
              style={{
                fontSize: "clamp(32px, 5vw, 56px)",
                fontWeight: 700,
                letterSpacing: "-0.04em",
                color: T.text,
                fontFamily: T.headingFont,
                lineHeight: 1.25,
                paddingBottom: "8px",
                marginBottom: 12,
              }}
            >
              Insights & Updates
            </h1>
            <p
              style={{
                fontSize: 16,
                color: T.muted,
                fontFamily: T.bodyFont,
                lineHeight: 1.5,
                maxWidth: 600,
              }}
            >
              Read about SaaS architecture, security best practices, and product engineering from the Nexus core team.
            </p>
          </div>
        </Reveal>

        {/* Blog Posts List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 40, marginBottom: 80 }}>
          {POSTS.map((post, idx) => (
            <Reveal key={idx} delay={idx * 0.1}>
              <article
                style={{
                  borderBottom: `1px solid ${T.border}`,
                  paddingBottom: 40,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <div style={{ display: "flex", gap: 16, fontSize: 13, color: T.muted, fontFamily: T.bodyFont }}>
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
                <h3
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: T.text,
                    fontFamily: T.headingFont,
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => ((e.target as HTMLElement).style.color = T.accent)}
                  onMouseLeave={(e) => ((e.target as HTMLElement).style.color = T.text)}
                >
                  {post.title}
                </h3>
                <p
                  style={{
                    fontSize: 15,
                    color: T.muted,
                    lineHeight: 1.6,
                    fontFamily: T.bodyFont,
                    fontWeight: 400,
                  }}
                >
                  {post.excerpt}
                </p>
                <div style={{ fontSize: 13, fontWeight: 600, color: T.text, fontFamily: T.bodyFont, marginTop: 8 }}>
                  By {post.author}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </main>
  );
}
