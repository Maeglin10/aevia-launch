"use client";

import React from "react";
import { T, Reveal } from "../shared";

const POSTS = [
  {
    title: "Why we built a unified pipeline analytics solution",
    excerpt: "Product analytics and engineering pipelines shouldn't live in separate databases. Here's how we consolidated them for better performance.",
    date: "June 10, 2026",
    readTime: "5 min read",
    author: "Sofia Andersson",
  },
  {
    title: "Consolidating your SaaS stack for security audits",
    excerpt: "Preparing for SOC 2 or GDPR compliance audits is tough. Consolidating your tools is the easiest way to simplify security compliance.",
    date: "May 28, 2026",
    readTime: "7 min read",
    author: "Lena Fischer",
  },
  {
    title: "How Orbit Labs scaled daily active users by 300%",
    excerpt: "A deep dive into how Orbit Labs utilized custom triggers and Slack integrations to drive engagement and retention.",
    date: "April 15, 2026",
    readTime: "4 min read",
    author: "Marcus Reyes",
  },
];

export default function BlogPage() {
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
