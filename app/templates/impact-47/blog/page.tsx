"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ArrowRight } from "lucide-react";
import { C, PageHero, BLOG_POSTS } from "../shared";

const SERIF = "'Libre Baskerville', Georgia, serif";
const SANS = "'Poppins', system-ui";

export default function Blog() {
  const [blogSlug, setBlogSlug] = useState<string | null>(null);
  const post = blogSlug ? BLOG_POSTS.find(b => b.slug === blogSlug) : null;

  if (post) {
    return (
      <section style={{ background: C.bg, padding: "120px 24px 100px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <button onClick={() => setBlogSlug(null)}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontFamily: SANS, fontSize: 13, marginBottom: 32 }}
            onMouseEnter={e => (e.currentTarget.style.color = C.accent)}
            onMouseLeave={e => (e.currentTarget.style.color = C.textMuted)}
          ><ChevronLeft size={16} /> Tous les articles</button>
          <div style={{ fontFamily: SANS, fontSize: 11, color: C.sage, letterSpacing: "0.12em", textTransform: "uppercase" as const, marginBottom: 14 }}>{post.category} · {post.date}</div>
          <h1 style={{ fontFamily: SERIF, fontSize: "clamp(32px, 5vw, 52px)", color: C.accent, margin: "0 0 32px", fontWeight: 700, lineHeight: 1.1 }}>{post.title}</h1>
          <div style={{ height: "clamp(220px, 38vw, 360px)", background: `linear-gradient(135deg, ${post.cover}, ${C.blush})`, border: `1px solid ${C.border}`, marginBottom: 40 }} />
          {post.body.map((paraTxt, i) => (
            <p key={i} style={{ fontFamily: SANS, fontSize: 17, color: C.textMuted, lineHeight: 1.9, marginBottom: 24 }}>{paraTxt}</p>
          ))}
          <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 24, paddingTop: 24, fontSize: 13, color: C.textDim, fontFamily: SERIF, fontStyle: "italic" }}>
            Rédigé par l'équipe de Pétales & Co.
          </div>
        </div>
      </section>
    );
  }

  return (
    <div>
      <PageHero eyebrow="Le journal" title="Le Blog de l'atelier" subtitle="Conseils d'entretien, fleurs de saison, inspirations mariage et culture florale, par nos fleuristes." />
      <section style={{ background: C.bg, padding: "72px 24px 100px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
          {BLOG_POSTS.map((post, i) => (
            <motion.article key={post.slug}
              initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 3) * 0.08 }}
              whileHover={{ y: -4 }}
              onClick={() => { setBlogSlug(post.slug); if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "auto" }); }}
              style={{ background: C.bgCard, border: `1px solid ${C.border}`, cursor: "pointer", overflow: "hidden", display: "flex", flexDirection: "column" as const }}
            >
              <div style={{ height: 190, background: `linear-gradient(135deg, ${post.cover}, ${C.blush})` }} />
              <div style={{ padding: "24px 26px 28px" }}>
                <div style={{ fontFamily: SANS, fontSize: 10, color: C.sage, letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 12 }}>{post.category} · {post.date}</div>
                <h2 style={{ fontFamily: SERIF, fontSize: 21, color: C.text, lineHeight: 1.3, margin: "0 0 14px", fontWeight: 700 }}>{post.title}</h2>
                <p style={{ fontFamily: SANS, fontSize: 14, color: C.textMuted, lineHeight: 1.7, margin: "0 0 18px" }}>{post.excerpt}</p>
                <span style={{ fontFamily: SANS, fontSize: 12, color: C.accent, display: "inline-flex", alignItems: "center", gap: 6 }}>Lire l'article <ArrowRight size={13} /></span>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </div>
  );
}
