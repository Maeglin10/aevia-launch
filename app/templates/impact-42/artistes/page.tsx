'use client';

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { C, SectionReveal } from "../shared";

export default function ArtistesPage() {
  const artistRoster = [
    { name: "Kova", genre: "R&B / Soul", albums: 3, achievement: "Top 10 FR", desc: "Son dernier album a atteint le Top 10 FR. Voix puissante, production soul moderne enregistrée en Studio A.", tags: ["R&B", "Soul", "Vocals"], img: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80&fit=crop" },
    { name: "Théo Laurent", genre: "Hip-Hop", albums: 2, achievement: "50M streams Spotify", desc: "50M streams cumulés sur Spotify. Textes incisifs, prod trap/boom-bap. Enregistré en Studio B.", tags: ["Hip-Hop", "Trap", "Rap"], img: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&q=80&fit=crop" },
    { name: "MIRA", genre: "Electro / Pop", albums: 1, achievement: "Netflix · Canal+", desc: "Synchronisations sur Netflix et Canal+. Electro-pop aérienne avec des arrangements sophistiqués.", tags: ["Electro", "Pop", "Sync"], img: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80&fit=crop" },
    { name: "Les Frères Vidal", genre: "Jazz", albums: 4, achievement: "Victoires de la Musique", desc: "Nominés aux Victoires de la Musique. Quartet jazz moderne, live en Studio A avec grand piano Steinway D.", tags: ["Jazz", "Acoustic", "Live"], img: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800&q=80&fit=crop" },
    { name: "Lucie Mercer", genre: "Folk / Indie", albums: 1, achievement: "Coup de cœur Fnac", desc: "Coup de cœur Fnac pour son premier album. Folk intime enregistré en Studio B, arrangements cordes sur Studio A.", tags: ["Folk", "Indie", "Acoustic"], img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80&fit=crop" },
    { name: "BLOC", genre: "Metal / Rock", albums: 2, achievement: "Tournée Européenne", desc: "Tournée européenne 2025. Metal alt-rock, drum live room Studio A, guitares et mix en Studio B.", tags: ["Metal", "Rock", "Live"], img: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80&fit=crop" },
  ];

  return (
    <div style={{ minHeight: "100dvh", backgroundColor: C.bg, paddingTop: "4rem" }}>
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "3rem 2rem 2rem" }}>
        <span style={{ fontFamily: C.bodyFont, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.accent }}>Ils ont enregistré ici</span>
        <h1 style={{ fontFamily: C.headingFont, fontSize: "clamp(3rem, 7vw, 5.5rem)", color: C.white, letterSpacing: "0.04em", margin: "0.4rem 0 0.5rem", lineHeight: 1 }}>ARTISTES</h1>
        <p style={{ fontFamily: C.bodyFont, color: C.textLight, fontSize: "1rem", maxWidth: 560, lineHeight: 1.75, marginBottom: "3rem" }}>
          200+ artistes et producteurs ont fait confiance à Echo Chamber depuis notre ouverture. Voici quelques-uns de ceux qui ont gravé leur son entre ces murs.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))", gap: "1.75rem" }}>
          {artistRoster.map((artist, i) => (
            <SectionReveal key={artist.name} delay={i * 0.08}>
              <div
                style={{ backgroundColor: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "12px", overflow: "hidden", transition: "border-color 0.25s" }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.accent)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.border)}
              >
                <div style={{ position: "relative", height: 200, overflow: "hidden" }}>
                  <img src={artist.img} alt={artist.name} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to top, ${C.bg}ee, transparent 50%)` }} />
                  <div style={{ position: "absolute", top: "1rem", right: "1rem", backgroundColor: C.accent, color: C.white, padding: "0.25rem 0.75rem", borderRadius: "4px", fontSize: "0.7rem", fontWeight: 800, fontFamily: C.bodyFont, letterSpacing: "0.06em" }}>
                    {artist.achievement}
                  </div>
                </div>
                <div style={{ padding: "1.5rem" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <div>
                      <h3 style={{ fontFamily: C.headingFont, fontSize: "1.5rem", color: C.white, letterSpacing: "0.04em", margin: 0 }}>{artist.name}</h3>
                      <span style={{ fontFamily: C.bodyFont, fontSize: "0.8rem", color: C.accent, fontWeight: 600 }}>{artist.genre}</span>
                    </div>
                    <span style={{ fontFamily: C.bodyFont, fontSize: "0.72rem", color: C.textMuted }}>{artist.albums} album{artist.albums > 1 ? "s" : ""}</span>
                  </div>
                  <p style={{ fontFamily: C.bodyFont, fontSize: "0.87rem", color: C.textLight, lineHeight: 1.7, margin: "0.75rem 0 1rem" }}>{artist.desc}</p>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    {artist.tags.map((tag) => (
                      <span key={tag} style={{ fontFamily: C.bodyFont, fontSize: "0.7rem", color: C.textMuted, border: `1px solid ${C.border}`, padding: "0.2rem 0.55rem", borderRadius: "4px", letterSpacing: "0.04em" }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center", marginTop: "4rem", padding: "3rem", backgroundColor: C.bgCard, borderRadius: "16px", border: `1px solid ${C.border}` }}>
          <h2 style={{ fontFamily: C.headingFont, fontSize: "2.5rem", color: C.white, letterSpacing: "0.04em", marginBottom: "1rem" }}>VOTRE NOM ICI ?</h2>
          <p style={{ fontFamily: C.bodyFont, color: C.textLight, lineHeight: 1.7, marginBottom: "1.75rem", maxWidth: 480, margin: "0 auto 1.75rem" }}>
            Rejoignez le roster d'artistes qui ont façonné leur son à Echo Chamber.
          </p>
          <Link href="/templates/impact-42/booking" style={{ textDecoration: "none" }}>
            <div
              style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", backgroundColor: C.accent, color: C.white, padding: "1rem 2.5rem", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: 700, fontFamily: C.bodyFont, fontSize: "0.95rem", boxShadow: `0 8px 30px ${C.accentGlow}` }}
            >
              Réserver une session <ArrowRight size={16} />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
