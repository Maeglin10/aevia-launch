"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Scale, ArrowRight } from "lucide-react";
import { C, PageHero, blogPosts } from "../shared";

export default function Blog() {
  const [blogSlug, setBlogSlug] = useState<string | null>(null);
  const post = blogSlug ? blogPosts.find(b => b.slug === blogSlug) : null;

  if (post) {
    return (
      <div>
        <section style={{ background: C.bg, padding: "120px 32px 100px" }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <button
              onClick={() => setBlogSlug(null)}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontFamily: "'Source Sans Pro', system-ui", fontSize: 14, marginBottom: 36 }}
              onMouseEnter={e => (e.currentTarget.style.color = C.accent)}
              onMouseLeave={e => (e.currentTarget.style.color = C.textMuted)}
            >
              <ChevronRight size={16} style={{ transform: "rotate(180deg)" }} /> Tous les articles
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <span style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 11, color: C.accent, letterSpacing: "0.12em", textTransform: "uppercase" as const, border: `1px solid ${C.borderGold}`, padding: "3px 10px" }}>{post.category}</span>
              <span style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 13, color: C.textDim }}>{post.date}</span>
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(34px, 5vw, 54px)", fontWeight: 700, color: C.navy, lineHeight: 1.12, margin: "0 0 32px" }}>{post.title}</h1>
            <div style={{ height: "clamp(200px, 36vw, 340px)", background: `linear-gradient(135deg, ${post.cover}22 0%, ${post.cover}08 100%)`, border: `1px solid ${C.border}`, borderTop: `3px solid ${C.accent}`, marginBottom: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Scale size={48} color={C.accent} style={{ opacity: 0.4 }} />
            </div>
            {post.body.map((paraTxt, i) => (
              <p key={i} style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 17, color: C.textMuted, lineHeight: 1.85, marginBottom: 24 }}>{paraTxt}</p>
            ))}
            <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 24, paddingTop: 24, fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", fontSize: 15, color: C.textMuted }}>
              Article rédigé par l'équipe de Dumont & Associates. Ce contenu est fourni à titre informatif et ne constitue pas un conseil juridique.
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <PageHero
        eyebrow="Le journal du cabinet"
        title="Blog & analyses juridiques"
        subtitle="Nos réflexions sur le droit des affaires : décryptages, points de jurisprudence et conseils pratiques pour les dirigeants et leurs conseils."
      />
      <section style={{ background: C.bg, padding: "100px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
            {blogPosts.map((p, i) => (
              <motion.article
                key={p.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: (i % 3) * 0.1 }}
                whileHover={{ y: -4 }}
                onClick={() => { setBlogSlug(p.slug); if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "auto" }); }}
                style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderTop: `3px solid ${C.accent}`, cursor: "pointer", display: "flex", flexDirection: "column" as const, overflow: "hidden" }}
              >
                <div style={{ height: 170, background: `linear-gradient(135deg, ${p.cover}22 0%, ${p.cover}08 100%)`, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Scale size={32} color={C.accent} style={{ opacity: 0.35 }} />
                </div>
                <div style={{ padding: "26px 28px 30px", display: "flex", flexDirection: "column" as const, flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                    <span style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 10, color: C.accent, letterSpacing: "0.1em", textTransform: "uppercase" as const, fontWeight: 700 }}>{p.category}</span>
                    <span style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 12, color: C.textDim }}>· {p.date}</span>
                  </div>
                  <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 21, color: C.navy, lineHeight: 1.3, margin: "0 0 14px", fontWeight: 700 }}>{p.title}</h2>
                  <p style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 14, color: C.textMuted, lineHeight: 1.65, margin: "0 0 18px", flex: 1 }}>{p.excerpt}</p>
                  <span style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 13, color: C.accent, letterSpacing: "0.04em", display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 600 }}>
                    Lire l'article <ArrowRight size={14} />
                  </span>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
