"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const T = {
  bg: "#0a0a0a",
  text: "#f0f0f0",
  muted: "#666666",
  dimmed: "#333333",
  accent: "#0066ff",
  accentDim: "rgba(0,102,255,0.15)",
  accentBorder: "rgba(0,102,255,0.3)",
  border: "rgba(240,240,240,0.06)",
  surface: "rgba(240,240,240,0.03)",
  surfaceHover: "rgba(240,240,240,0.06)",
};

const FONT_HEADING = "'Syne', sans-serif";
const FONT_BODY = "'Inter', sans-serif";

const BLOG_POSTS = [
  {
    title: "Core Web Vitals: why performance became a selling point",
    date: "June 4, 2026",
    category: "Performance",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
    excerpt: "Beyond SEO, load speed directly shapes how your brand is perceived and how well your site converts.",
  },
  {
    title: "Design systems: the investment that speeds up every release",
    date: "May 22, 2026",
    category: "Design",
    image: "https://images.unsplash.com/photo-1545235617-9465d2a55698?q=80&w=1200&auto=format&fit=crop",
    excerpt: "A well-built design system isn't an agency luxury: it's the tool that aligns design and development and cuts your timelines.",
  },
];

export default function BlogPage() {
  return (
    <div style={{ minHeight: "100dvh", backgroundColor: T.bg, color: T.text, fontFamily: FONT_BODY }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px" }}>
        <Link href="/templates/impact-01" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: T.muted, textDecoration: "none", marginBottom: 60, fontSize: "0.9rem", transition: "color 0.2s" }} onMouseOver={(e) => (e.currentTarget.style.color = T.text)} onMouseOut={(e) => (e.currentTarget.style.color = T.muted)}>
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 style={{ fontFamily: FONT_HEADING, fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 800, margin: "0 0 24px 0", letterSpacing: "-0.02em" }}>
            Our <span style={{ color: T.accent }}>Insights.</span>
          </h1>
          <p style={{ color: T.muted, fontSize: "1.125rem", maxWidth: 600, lineHeight: 1.6, margin: "0 0 60px 0" }}>
            Thoughts, frameworks, and strategies from our team on design, engineering, and digital growth.
          </p>
        </motion.div>

        <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
          {BLOG_POSTS.map((post, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * idx }}
              style={{ display: "flex", gap: 32, padding: 32, backgroundColor: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, alignItems: "center" }}
            >
              <div style={{ flex: 1, minWidth: 300, display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center", fontSize: "0.875rem", color: T.muted }}>
                  <span style={{ color: T.accent, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{post.category}</span>
                  <span>•</span>
                  <span>{post.date}</span>
                </div>
                <h2 style={{ fontFamily: FONT_HEADING, fontSize: "1.75rem", fontWeight: 700, margin: 0, color: T.text, lineHeight: 1.3 }}>{post.title}</h2>
                <p style={{ color: T.muted, lineHeight: 1.6, margin: 0 }}>{post.excerpt}</p>
                <div style={{ marginTop: 8 }}>
                  <button style={{ background: "none", border: "none", color: T.text, fontWeight: 600, fontSize: "0.9rem", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4, padding: 0 }}>
                    Read article <span style={{ color: T.accent }}>→</span>
                  </button>
                </div>
              </div>
              <div style={{ flex: 1, position: "relative", height: 240, borderRadius: 12, overflow: "hidden", display: "none" }} className="blog-image">
                <Image src={post.image} alt={post.title} fill style={{ objectFit: "cover" }} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        @media (min-width: 768px) {
          .blog-image { display: block !important; }
        }
      `}} />
    </div>
  );
}
