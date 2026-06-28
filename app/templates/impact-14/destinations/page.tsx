"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Anchor, Compass, Compass as CompassIcon } from "lucide-react";

const ALL_DESTINATIONS = [
  {
    name: "Monaco",
    region: "French Riviera",
    tagline: "Where glamour meets the open sea",
    image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&q=80",
    desc: "Private moorings right at the Port Hercule, bespoke helicopter transfers, and exclusive access to Monte-Carlo yacht clubs."
  },
  {
    name: "Santorini",
    region: "Greek Islands",
    tagline: "Caldera sunsets from your private deck",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80",
    desc: "Anchor in volcanic waters under dramatic cliffs. Experience private wine tastings in Oia and secluded cove swimming."
  },
  {
    name: "Maldives",
    region: "Indian Ocean",
    tagline: "Atolls of turquoise in perfect silence",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80",
    desc: "Navigate untamed coral reefs, dive with manta rays, and sleep under tropical star constellations on remote sandbanks."
  },
  {
    name: "Amalfi",
    region: "Tyrrhenian Coast",
    tagline: "Cliffside villages draped in legend",
    image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&q=80",
    desc: "Sail past lemon groves and Positano vistas. Dine at Michelin-starred coastal retreats accessible only by sea."
  },
  {
    name: "St. Barths",
    region: "Caribbean",
    tagline: "Pristine white sands and refined luxury",
    image: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80",
    desc: "Exclusive Gustavia port berths, private beach BBQ service, and serene turquoise Caribbean lagoons."
  },
  {
    name: "Fjords of Norway",
    region: "Northern Europe",
    tagline: "Dramatic glaciers and majestic silence",
    image: "https://images.unsplash.com/photo-1505705694340-019e1e335916?w=800&q=80",
    desc: "Glacier expedition cruising with arctic luxury amenities, private heliskiing guides, and aurora viewing decks."
  }
];

export default function DestinationsPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#0a1520", color: "#f0ece0", fontFamily: "'Montserrat', sans-serif", padding: "120px 24px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <Link 
          href="/templates/impact-14"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            color: "#c9a84c",
            fontSize: 11,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            textDecoration: "none",
            marginBottom: 40,
          }}
        >
          <ArrowLeft size={14} />
          Retour au domaine
        </Link>

        <div style={{ marginBottom: 60 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <Anchor size={16} color="#c9a84c" />
            <span style={{ color: "#c9a84c", fontSize: 10, letterSpacing: "0.4em", textTransform: "uppercase" }}>
              Horizon Maritime · Curated Fleet
            </span>
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 300, color: "#f0ece0", marginBottom: 24 }}>
            Private Destinations Catalog
          </h1>
          <p style={{ color: "rgba(240,236,224,0.6)", fontSize: 16, maxWidth: 640, lineHeight: 1.8 }}>
            Explore our 87 exclusive anchorages across the Mediterranean, Caribbean, Indian Ocean, and Arctic fjords.
          </p>
        </div>

        {/* Catalog Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 32 }}>
          {ALL_DESTINATIONS.map((item, i) => (
            <div 
              key={item.name}
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(201,168,76,0.2)",
                borderRadius: 4,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ position: "relative", width: "100%", aspectRatio: "16/10", overflow: "hidden" }}>
                <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,21,32,0.9) 0%, transparent 60%)" }} />
                <span style={{ position: "absolute", bottom: 16, left: 20, color: "#c9a84c", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase" }}>
                  {item.region}
                </span>
              </div>
              <div style={{ padding: 28, flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, color: "#f0ece0", fontWeight: 400, marginBottom: 8 }}>{item.name}</h3>
                  <p style={{ fontSize: 12, color: "#c9a84c", fontStyle: "italic", marginBottom: 16 }}>{item.tagline}</p>
                  <p style={{ fontSize: 13, color: "rgba(240,236,224,0.7)", lineHeight: 1.7, marginBottom: 24 }}>{item.desc}</p>
                </div>
                <Link 
                  href="/templates/impact-14/contact"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    border: "1px solid #c9a84c",
                    color: "#c9a84c",
                    padding: "10px 20px",
                    fontSize: 10,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    textDecoration: "none",
                    borderRadius: 2
                  }}
                >
                  Reserve Anchorage →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
