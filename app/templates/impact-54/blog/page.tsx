"use client";

import React from "react";
import { ArrowRight, Calendar, User, Clock } from "lucide-react";
import Link from "next/link";
import { Reveal } from "../shared";

const BLOG_POSTS = [
  {
    slug: "sub-millisecond-canvas-execution",
    title: "Achieving Sub-Millisecond Execution in WebGL Canvases",
    excerpt: "Exploring the memory models and cache-warming pipelines that allow the ARTGEN rendering suite to hit sub-0.3ms P99 latencies.",
    date: "June 12, 2026",
    author: "Alex Rivers",
    readTime: "6 min read",
    tag: "Engineering",
  },
  {
    slug: "neural-synthesis-iteration",
    title: "How Neural Synthesis Changes Web Design Iteration Cycles",
    excerpt: "Traditional assets are static. Procedural neural generators allow layout frameworks to modify assets in real time to match user context.",
    date: "May 28, 2026",
    author: "Elena Vance",
    readTime: "9 min read",
    tag: "AI Research",
  },
  {
    slug: "optimizing-webgl-shader-stacks",
    title: "Optimizing Custom WebGL Shader Stacks for Mobile Devices",
    excerpt: "Deep dive into fragment shader complexity, precision qualifiers, and texture fetching guidelines to keep frame rates steady at 120 FPS.",
    date: "May 15, 2026",
    author: "Koji Sato",
    readTime: "11 min read",
    tag: "GPU Dev",
  },
  {
    slug: "math-behind-compositional-nodes",
    title: "The Vector Mathematics Behind Infinite Compositional Nodes",
    excerpt: "A look into affine transformation matrix concatenation and pixel-space alignment rules within the ARTGEN composite node editor.",
    date: "April 30, 2026",
    author: "Elena Vance",
    readTime: "7 min read",
    tag: "Mathematics",
  },
];

export default function BlogPage() {
  return (
    <main style={{ background: "#050510", padding: "120px 24px" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        
        {/* Header */}
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 80 }}>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "#00ffd1",
                marginBottom: 12,
                display: "block",
              }}
            >
              Atelier Feed
            </span>
            <h1
              style={{
                fontSize: "clamp(32px, 5vw, 64px)",
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                lineHeight: 1.25,
                paddingBottom: "8px",
                letterSpacing: "-0.03em",
                color: "#e8e8ff",
                marginBottom: 16,
              }}
            >
              Latest from the edge.
            </h1>
            <p
              style={{
                fontSize: 16,
                color: "rgba(232,232,255,0.45)",
                lineHeight: 1.6,
                maxWidth: 600,
                margin: "0 auto",
              }}
            >
              Technical articles, research notes, and updates from the core developers of ARTGEN.
            </p>
          </div>
        </Reveal>

        {/* Featured Post */}
        {BLOG_POSTS.length > 0 && (
          <div style={{ marginBottom: 60 }}>
            <Reveal>
              <div
                style={{
                  background: "rgba(124, 58, 237, 0.04)",
                  border: "1px solid rgba(124, 58, 237, 0.2)",
                  borderRadius: 20,
                  padding: "48px 40px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 24,
                }}
              >
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#00ffd1", background: "rgba(0, 255, 209, 0.1)", border: "1px solid rgba(0, 255, 209, 0.2)", padding: "4px 10px", borderRadius: 100 }}>
                    Featured
                  </span>
                  <span style={{ fontSize: 13, color: "rgba(232, 232, 255, 0.45)" }}>
                    {BLOG_POSTS[0].tag}
                  </span>
                </div>
                <h2
                  style={{
                    fontSize: "clamp(24px, 3.5vw, 36px)",
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 800,
                    color: "#e8e8ff",
                    lineHeight: 1.2,
                  }}
                >
                  <Link href={`/templates/impact-54/blog`} style={{ textDecoration: "none", color: "inherit" }}>
                    {BLOG_POSTS[0].title}
                  </Link>
                </h2>
                <p style={{ fontSize: 15, color: "rgba(232, 232, 255, 0.5)", lineHeight: 1.6, maxWidth: 800 }}>
                  {BLOG_POSTS[0].excerpt}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 24, alignItems: "center", fontSize: 13, color: "rgba(232, 232, 255, 0.35)", borderTop: "1px solid rgba(124, 58, 237, 0.12)", paddingTop: 20 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Calendar size={14} />
                    {BLOG_POSTS[0].date}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <User size={14} />
                    {BLOG_POSTS[0].author}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Clock size={14} />
                    {BLOG_POSTS[0].readTime}
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        )}

        {/* Blog Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: 32 }}>
          {BLOG_POSTS.slice(1).map((post, idx) => (
            <Reveal key={post.slug} delay={idx * 0.1}>
              <div
                style={{
                  background: "rgba(124, 58, 237, 0.02)",
                  border: "1px solid rgba(124, 58, 237, 0.1)",
                  borderRadius: 16,
                  padding: 32,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "#7c3aed" }}>
                      {post.tag}
                    </span>
                    <span style={{ fontSize: 12, color: "rgba(232,232,255,0.3)" }}>
                      {post.readTime}
                    </span>
                  </div>
                  <h3
                    style={{
                      fontSize: 18,
                      fontWeight: 600,
                      color: "#e8e8ff",
                      lineHeight: 1.4,
                      marginBottom: 12,
                    }}
                  >
                    <Link href={`/templates/impact-54/blog`} style={{ textDecoration: "none", color: "inherit" }}>
                      {post.title}
                    </Link>
                  </h3>
                  <p
                    style={{
                      fontSize: 13,
                      color: "rgba(232,232,255,0.45)",
                      lineHeight: 1.6,
                      marginBottom: 24,
                    }}
                  >
                    {post.excerpt}
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid rgba(124, 58, 237, 0.06)", paddingTop: 16 }}>
                  <span style={{ fontSize: 12, color: "rgba(232,232,255,0.3)" }}>
                    {post.date}
                  </span>
                  <Link
                    href={`/templates/impact-54/blog`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#00ffd1",
                      textDecoration: "none",
                    }}
                  >
                    Read <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

      </div>
    </main>
  );
}
