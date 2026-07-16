"use client";

import React from "react";
import { Cpu, Users, Eye, Target } from "lucide-react";
import { Reveal } from "../shared";

export default function AboutPage() {
  const VALUES = [
    {
      icon: Cpu,
      title: "Direct GPU Synthetics",
      desc: "By bypassing traditional abstraction layers, we deliver sub-millisecond creative execution directly to raw metal.",
    },
    {
      icon: Users,
      title: "Atelier Culture",
      desc: "We support creative studios in pushing boundaries, viewing code as paint and pixels as sculpture.",
    },
    {
      icon: Eye,
      title: "Absolute Transparency",
      desc: "Zero hidden usage fees or server-side telemetry caching. You control your creative assets fully.",
    },
    {
      icon: Target,
      title: "Mathematical Precision",
      desc: "Our neural layers are calibrated with pixel-perfect predictability, allowing reproducible synthesis.",
    },
  ];

  return (
    <main style={{ background: "#050510", padding: "120px 24px" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        
        {/* Hero Section */}
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
              Our Manifesto
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
              Sculpting digital infinity.
            </h1>
            <p
              style={{
                fontSize: 18,
                color: "rgba(232,232,255,0.6)",
                lineHeight: 1.6,
                maxWidth: 700,
                margin: "0 auto",
              }}
            >
              At ARTGEN, we build systems that empower creative agencies, developers, and neural artists to generate real-time visual logic without friction.
            </p>
          </div>
        </Reveal>

        {/* Brand Story */}
        <div style={{ marginBottom: 100 }}>
          <Reveal>
            <div
              style={{
                background: "rgba(124, 58, 237, 0.04)",
                border: "1px solid rgba(124, 58, 237, 0.15)",
                borderRadius: 20,
                padding: "48px 40px",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 40,
              }}
              className="grid grid-cols-1 md:grid-cols-2"
            >
              <div>
                <h2
                  style={{
                    fontSize: 28,
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 700,
                    marginBottom: 20,
                  }}
                >
                  The Next Era of Generative Pipelines
                </h2>
                <p
                  style={{
                    fontSize: 14,
                    color: "rgba(232, 232, 255, 0.5)",
                    lineHeight: 1.7,
                    marginBottom: 16,
                  }}
                >
                  Established in 2026, ARTGEN was created by a small collective of creative coders who grew frustrated with heavy, slow web-rendering suites. We sought to build an engine that operates closer to GPU clusters.
                </p>
                <p
                  style={{
                    fontSize: 14,
                    color: "rgba(232, 232, 255, 0.5)",
                    lineHeight: 1.7,
                  }}
                >
                  By optimizing web canvas renders down to 0.3ms, we made it possible for digital canvases to feel as responsive and organic as physical media. Today, thousands of creative teams rely on ARTGEN daily.
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  borderLeft: "2px solid rgba(124, 58, 237, 0.2)",
                  paddingLeft: 40,
                }}
                className="border-l-0 md:border-l pl-0 md:pl-10"
              >
                <div style={{ marginBottom: 24 }}>
                  <span style={{ fontSize: 48, fontFamily: "'Syne', sans-serif", fontWeight: 800, color: "#7c3aed", display: "block" }}>10B+</span>
                  <span style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em", color: "rgba(232, 232, 255, 0.4)" }}>Visual Frames Rendered</span>
                </div>
                <div>
                  <span style={{ fontSize: 48, fontFamily: "'Syne', sans-serif", fontWeight: 800, color: "#00ffd1", display: "block" }}>0.3ms</span>
                  <span style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em", color: "rgba(232, 232, 255, 0.4)" }}>Standard P99 Pipeline Latency</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Values Section */}
        <div>
          <h2
            style={{
              fontSize: 32,
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              textAlign: "center",
              marginBottom: 48,
            }}
          >
            Core Engineering Tenets
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(220px, 100%), 1fr))", gap: 24 }}>
            {VALUES.map((val, idx) => (
              <Reveal key={idx} delay={idx * 0.08}>
                <div
                  style={{
                    background: "rgba(124, 58, 237, 0.02)",
                    border: "1px solid rgba(124, 58, 237, 0.1)",
                    borderRadius: 12,
                    padding: 24,
                    height: "100%",
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 8,
                      background: "rgba(124, 58, 237, 0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#7c3aed",
                      marginBottom: 16,
                    }}
                  >
                    <val.icon size={20} />
                  </div>
                  <h3
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: "#e8e8ff",
                      marginBottom: 8,
                    }}
                  >
                    {val.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 13,
                      color: "rgba(232, 232, 255, 0.45)",
                      lineHeight: 1.6,
                    }}
                  >
                    {val.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
