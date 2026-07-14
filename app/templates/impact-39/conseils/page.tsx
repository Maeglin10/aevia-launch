"use client";

import React, { useState } from "react";
import { BookOpen, Clock, ArrowRight, ChevronLeft } from "lucide-react";
import { C, ARTICLES, SectionReveal } from "../shared";

export default function ConseilsPage() {
  const [openArticle, setOpenArticle] = useState<number | null>(null);

  if (openArticle !== null) {
    const article = ARTICLES.find((a) => a.id === openArticle)!;
    const paragraphs = article.full.split("\n\n");
    return (
      <div style={{ background: C.bg, minHeight: "100dvh" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "60px 5% 80px" }}>
          <button
            type="button"
            onClick={() => setOpenArticle(null)}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.orangeLight, color: C.orange, padding: "10px 20px", borderRadius: 8, fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer", marginBottom: 36, fontFamily: "'Manrope', system-ui" }}
          >
            <ChevronLeft size={16} /> Retour aux guides
          </button>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.orange, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
            {article.category} · {article.readTime} de lecture
          </div>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 900, color: C.navy, lineHeight: 1.15, marginBottom: 32 }}>
            {article.title}
          </h1>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {paragraphs.map((p, idx) => {
              if (p.startsWith("**")) {
                const parts = p.split("\n");
                const title = parts[0].replace(/\*\*/g, "");
                const body = parts.slice(1).join("\n");
                return (
                  <div key={idx} style={{ marginTop: 12 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: C.navy, marginBottom: 8 }}>{title}</h3>
                    <p style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.8, margin: 0 }}>{body}</p>
                  </div>
                );
              }
              return (
                <p key={idx} style={{ fontSize: 16, color: C.textMuted, lineHeight: 1.8, margin: 0 }}>
                  {p}
                </p>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: C.bg }}>
      {/* Hero */}
      <div style={{ background: C.navy, padding: "72px 5% 64px", textAlign: "center" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `${C.orange}20`, border: `1px solid ${C.orange}40`, borderRadius: 30, padding: "6px 16px", marginBottom: 24 }}>
            <BookOpen size={14} color={C.orange} />
            <span style={{ color: C.orange, fontSize: 13, fontWeight: 700 }}>Guides & conseils</span>
          </div>
          <h1 style={{ fontSize: "clamp(30px, 4vw, 52px)", fontWeight: 900, color: C.white, marginBottom: 20 }}>
            Réussir son déménagement
          </h1>
          <p style={{ fontSize: 17, color: "#93c5fd", lineHeight: 1.75 }}>
            Check-lists, astuces d'emballage, démarches administratives. Tout pour vous simplifier la vie.
          </p>
        </div>
      </div>

      {/* Article grid */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 5%" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }} className="grid md:grid-cols-1">
          {ARTICLES.map((article, i) => (
            <SectionReveal key={article.id} delay={i * 0.1}>
              <div
                onClick={() => setOpenArticle(article.id)}
                style={{ background: C.bg, borderRadius: 20, padding: 36, border: `1px solid ${C.border}`, height: "100%", display: "flex", flexDirection: "column", cursor: "pointer", transition: "all 0.2s" }}
                onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = "0 12px 32px rgba(30,58,95,0.06)"; el.style.borderColor = `${C.orange}40`; }}
                onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = "none"; el.style.borderColor = C.border; }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: C.orange, textTransform: "uppercase", letterSpacing: "0.08em" }}>{article.category}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, color: C.textMuted, fontSize: 13 }}>
                    <Clock size={14} /> <span>{article.readTime}</span>
                  </div>
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 900, color: C.navy, marginBottom: 12, lineHeight: 1.3 }}>{article.title}</h3>
                <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.7, flex: 1, marginBottom: 24 }}>{article.excerpt}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: C.orange, fontSize: 14, fontWeight: 800, borderTop: `1px solid ${C.border}`, paddingTop: 20 }}>
                  Lire la suite <ArrowRight size={15} />
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </div>
  );
}
