"use client";
import { resolveList } from "@/lib/templates/resolveList";
// @ts-nocheck

import React, {useRef, useState, useEffect} from 'react';
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { C, TextReveal, MagneticButton, CountUp } from "./shared";
import {
  clientAccrocheRestante,
  clientCity,
  clientName,
  clientHeroLine,
  clientPhotos,
  clientReviews,
  clientServices,
  clientTagline,
  clientText,
  clientWorks,
  memoriserSession,
} from "@/lib/templates/clientContent";
import { TitreDeLaPage } from "@/lib/templates/TitreDeLaPage";
let sessionData: any = null;

// Variables de module lues par les sections extraites en composants :
// déclarées ici pour que tout le fichier puisse s'y référer.
// Global state variables for subpage compatibility
let fd: any = null;

// Les prestations, jusqu'ici écrit(e) dans le rendu :
// le client pouvait les saisir, le thème ne les lisait pas.
const PRESTATIONS_INLINE_SOURCE = [
  { num: "01", title: "Résidentiel", desc: "Maisons particulières et ensembles résidentiels, du studio à la villa — attention portée à chaque plan de vie." },
              { num: "02", title: "Tertiaire", desc: "Immeubles de bureaux, hôtels et complexes mixtes. Architecture de représentation, technicité constructive." },
              { num: "03", title: "Culturel & Public", desc: "Médiathèques, musées, équipements sportifs. Architecture au service du collectif et de la transmission." },
              { num: "04", title: "Réhabilitation", desc: "Transformation de bâtiments existants, reconversion de friches, restauration de patrimoine classé ou vernaculaire." }
];
let PRESTATIONS_INLINE = PRESTATIONS_INLINE_SOURCE;

let c: any = null;
let brand: any = null;


// Client-uploaded photo at index i, falling back to the template's stock
// photo when the client did not upload one for that slot.
function photo(i: number, fallback: string): string {
  return fd?.photoUrls?.[i] || fallback;
}
export default function SegmentOS() {
  const [session, setSession] = useState<{
    formData?: {
      businessName?: string; businessType?: string; tagline?: string;
      city?: string; mainService?: string; benefits?: string[];
      priceRange?: string; targetAudience?: string; brandColor?: string;
      email?: string; phone?: string; instagram?: string; linkedin?: string;
    };
    generatedContent?: {
      heroHeadline?: string; heroSubline?: string; aboutTitle?: string;
      aboutText?: string; ctaText?: string; metaTitle?: string;
      metaDescription?: string;
      services?: { title?: string; description?: string }[];
      testimonials?: { name?: string; role?: string; text?: string; rating?: number }[];
    };
  } | null>(null);

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
          if (donnees) { setSession(donnees); return; }
        } catch {}
      }
    })();
  }, []);

  fd = session?.formData;
  sessionData = session;
  memoriserSession(sessionData);
  c = session?.generatedContent;


  PRESTATIONS_INLINE = resolveList(

    clientServices(session)?.map((s: any, i: number) => ({

      ...PRESTATIONS_INLINE_SOURCE[i % PRESTATIONS_INLINE_SOURCE.length],

      title: s.title, desc: s.desc || "",

    })),

    PRESTATIONS_INLINE_SOURCE,

  );
  brand = fd?.brandColor ?? null; // null = keep template's original color

  const quoteRef = useRef<HTMLDivElement>(null);
  const quoteInView = useInView(quoteRef, { once: true, margin: "-60px" });

  
  // Dynamic Services & Testimonials Mutation for Session Data
  
return (
    <div style={{ background: C.bg, color: C.text }}>
      <style>{`
        /* mobile: stack 2-col grids to single column (added by responsive fix) */
        @media (max-width: 768px) {
          .imx-mobstack { grid-template-columns: 1fr !important; }
        }
      `}</style>
      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section style={{ minHeight: "90vh", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "2rem", paddingTop: "5rem", position: "relative" }}>
        <TitreDeLaPage session={sessionData} />
        {/* Giant number background */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            position: "absolute",
            top: "3rem",
            right: "2rem",
            fontFamily: "'Archivo', sans-serif",
            fontSize: "clamp(8rem, 25vw, 22rem)",
            fontWeight: 900,
            color: C.border,
            lineHeight: 0.85,
            userSelect: "none",
            letterSpacing: "-0.06em",
          }}
        >
          23
        </motion.div>

        <div style={{ position: "relative", zIndex: 1, maxWidth: "900px" }}>
          <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: "clamp(2.5rem, 7vw, 6.5rem)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.04em", color: C.text }}>
            <TextReveal delay={0.3}>{clientHeroLine(sessionData, 0, 3, 10) ?? "FORMES"}</TextReveal>
            <TextReveal delay={0.4} style={{ color: C.gold }}>{clientHeroLine(sessionData, 1, 3, 10) ?? "ET"}</TextReveal>
            <TextReveal delay={0.5}>{clientHeroLine(sessionData, 2, 3, 10) ?? "VIDES"}</TextReveal>
          </div>

          <div className="imx-mobstack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginTop: "2rem", paddingTop: "1.5rem", borderTop: `1px solid ${C.border}` }}>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              style={{ fontSize: "1.05rem", color: C.textMuted, lineHeight: 1.8, maxWidth: "42ch" }}
            >{c?.aboutText ?? clientTagline(sessionData) ?? <>
              Segment est un studio d'architecture fondé sur une conviction : la qualité d'un espace se mesure à ses silences autant qu'à sa matière. Vingt ans de pratique, vingt ans de cette même question.
            </>}</motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <Link href="/templates/impact-61/projets" style={{ textDecoration: "none" }}>
                <MagneticButton
                  style={{
                    background: C.bgDark,
                    color: C.textLight,
                    border: "none",
                    padding: "1rem 2rem",
                    fontFamily: "'Archivo', sans-serif",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    letterSpacing: "0.12em",
                    cursor: "pointer",
                    textAlign: "left",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  VOIR LES PROJETS
                  <span style={{ fontSize: "1.2rem", fontWeight: 300 }}>→</span>
                </MagneticButton>
              </Link>
              <Link href="/templates/impact-61/contact" style={{ textDecoration: "none" }}>
                <MagneticButton
                  style={{
                    background: "transparent",
                    color: C.text,
                    border: `1px solid ${C.border}`,
                    padding: "1rem 2rem",
                    fontFamily: "'Archivo', sans-serif",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    letterSpacing: "0.12em",
                    cursor: "pointer",
                    textAlign: "left",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  TÉLÉCHARGER LE DOSSIER
                  <span style={{ fontSize: "1.2rem", fontWeight: 300 }}>↓</span>
                </MagneticButton>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Stats strip ─────────────────────────────────────────────────── */}
      <section style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(220px, 100%), 1fr))" }}>
          {[
            { n: 23, suffix: "", label: "années d'exercice" },
            { n: 85, suffix: "+", label: "projets réalisés" },
            { n: 42, suffix: "", label: "distinctions" },
            { n: 7, suffix: "", label: "pays d'intervention" },
          ].map((stat, i) => (
            <div
              key={stat.label}
              style={{
                padding: "3rem 2rem",
                borderRight: i < 3 ? `1px solid ${C.border}` : "none",
                textAlign: "center",
              }}
            >
              <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: "3.5rem", fontWeight: 900, color: C.text, letterSpacing: "-0.04em", lineHeight: 1 }}>
                <CountUp target={stat.n} suffix={stat.suffix} />
              </div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.65rem", letterSpacing: "0.2em", color: C.textDim, marginTop: "0.5rem" }}>
                {stat.label.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Projets récents ─────────────────────────────────────────────── */}
      <section style={{ padding: "8rem 3rem", background: C.bgOff }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "4rem", borderBottom: `1px solid ${C.border}`, paddingBottom: "2rem" }}>
            <div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: C.textDim, marginBottom: "0.75rem" }}>PROJETS RÉCENTS</div>
              <h2 style={{ fontFamily: "'Archivo', sans-serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 900, color: C.text, letterSpacing: "-0.03em", lineHeight: 1 }}>{/* ACCROCHE */ clientAccrocheRestante(sessionData) ?? (<>
                Réalisations
              </>)}</h2>
            </div>
            <Link href="/templates/impact-61/projets" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.75rem", color: C.textDim, letterSpacing: "0.1em", textDecoration: "none", display: "flex", alignItems: "center", gap: 8, borderBottom: `1px solid ${C.border}`, paddingBottom: 2 }}>
              VOIR TOUT →
            </Link>
          </div>
          <div className="imx-mobstack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px", background: C.border }}>
            {/* RÉALISATIONS */ resolveList(clientWorks(sessionData)?.map((o: any) => ({ loc: "", type: "",  name: o.title, year: o.detail || undefined, ...(o.imageUrl ? { img: o.imageUrl } : {}) })), [
              { num: "01", name: "Maison C.", type: "Résidentiel privé", loc: (clientCity(sessionData) ?? "Paris 6e"), year: "2024", img: photo(0, (clientPhotos(sessionData)[0] || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80")) },
              { num: "02", name: "Médiathèque Évry", type: "Équipement culturel", loc: "Évry-Courcouronnes", year: "2024", img: photo(1, (clientPhotos(sessionData)[1] || "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80")) },
              { num: "03", name: "Tour Belvedere", type: "Tertiaire — 4 200 m²", loc: "La Défense", year: "2023", img: photo(2, (clientPhotos(sessionData)[2] || "https://images.pexels.com/photos/7587375/pexels-photo-7587375.jpeg?auto=compress&cs=tinysrgb&w=1600")) },
              { num: "04", name: "Abbaye de Senlis", type: "Réhabilitation patrimoniale", loc: "Senlis, Oise", year: "2023", img: photo(3, (clientPhotos(sessionData)[3] || "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=800&q=80")) },
            ]).map((p, i) => (
              <motion.div
                key={p.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.6 }}
                style={{ background: C.bg, position: "relative", overflow: "hidden", cursor: "pointer" }}
              >
                <div style={{ aspectRatio: "3/2", overflow: "hidden", position: "relative" }}>
                  <img src={p.img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(0.7) brightness(0.9)", transition: "all 0.8s" }}
                    onMouseEnter={e => { (e.target as HTMLImageElement).style.filter = "grayscale(0) brightness(1)"; (e.target as HTMLImageElement).style.transform = "scale(1.03)"; }}
                    onMouseLeave={e => { (e.target as HTMLImageElement).style.filter = "grayscale(0.7) brightness(0.9)"; (e.target as HTMLImageElement).style.transform = "scale(1)"; }} />
                  <div style={{ position: "absolute", top: "1rem", left: "1rem", fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.6rem", letterSpacing: "0.2em", color: C.textLight, background: "rgba(23,23,23,0.8)", padding: "3px 8px" }}>{p.num}</div>
                </div>
                <div style={{ padding: "1.5rem 2rem" }}>
                  <h3 style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: "1.1rem", color: C.text, marginBottom: "0.4rem" }}>{p.name}</h3>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.7rem", color: C.textDim }}>{p.type} · {p.loc}</span>
                    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.7rem", color: C.textDim }}>{p.year}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ─────────────────────────────────────────────────────── */}
      <section style={{ padding: "8rem 3rem", background: C.bg, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ marginBottom: "5rem" }}>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: C.textDim, marginBottom: "0.75rem" }}>APPROCHES</div>
            <h2 style={{ fontFamily: "'Archivo', sans-serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 900, color: C.text, letterSpacing: "-0.03em", lineHeight: 1 }}>{/* TEXTE_SECTION */ clientText(sessionData, "section-4.titre") ?? (<>
              Typologies
            </>)}</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(260px, 100%), 1fr))", gap: "2px", background: C.border }}>
            {PRESTATIONS_INLINE.map((s, i) => (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.6 }}
                style={{ background: C.bg, padding: "3.5rem 2.5rem", borderBottom: `1px solid ${C.border}` }}
              >
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.6rem", color: C.gold, letterSpacing: "0.3em", marginBottom: "2rem" }}>{s.num} //</div>
                <h3 style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: "1.1rem", color: C.text, letterSpacing: "-0.02em", marginBottom: "1rem" }}>{s.title.toUpperCase()}</h3>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.85rem", color: C.textMuted, lineHeight: 1.75 }}>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Philosophy ──────────────────────────────────────────────────── */}
      <section ref={quoteRef} style={{ padding: "8rem 3rem", background: C.bgDark, overflow: "hidden", position: "relative" }}>
        {/* Decorative line */}
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "1px", background: C.gold, opacity: 0.3 }} />

        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: C.gold, marginBottom: "3rem" }}>
            PHILOSOPHIE
          </div>

          {[
            { quote: "L'architecture n'est pas l'art de construire des murs. C'est l'art de choisir où ne pas en mettre.", weight: 900 },
            { quote: "Un bâtiment réussi est celui dont les habitants finissent par oublier qu'il a été conçu.", weight: 300 },
            { quote: "La lumière n'est pas un détail. Elle est le matériau principal de tout espace habitable.", weight: 500 },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -30 }}
              animate={quoteInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: "'Archivo', sans-serif",
                fontSize: "clamp(1.2rem, 2.5vw, 2.2rem)",
                fontWeight: item.weight,
                color: i === 0 ? C.textLight : i === 2 ? C.gold : "#666",
                lineHeight: 1.35,
                paddingBottom: "2rem",
                marginBottom: "2rem",
                borderBottom: i < 2 ? `1px solid #222` : "none",
                letterSpacing: "-0.01em",
              }}
            >
              &quot;{item.quote}&quot;
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0 }}
            animate={quoteInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.7rem", letterSpacing: "0.2em", color: "#444", marginTop: "1rem" }}
          >
            — Laurent Segré, Fondateur
          </motion.div>
        </div>
      </section>

      {/* ── Contact CTA ─────────────────────────────────────────────────── */}
      <section style={{ padding: "8rem 3rem", background: C.bgDark, textAlign: "center", position: "relative", overflow: "hidden", borderTop: "1px solid #222" }}>
        <div style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          userSelect: "none",
          pointerEvents: "none",
        }}>
          <div style={{
            fontFamily: "'Archivo', sans-serif",
            fontSize: "clamp(6rem, 22vw, 20rem)",
            fontWeight: 900,
            color: "#111",
            letterSpacing: "-0.06em",
          }}>
            /S/
          </div>
        </div>
        <div style={{ position: "relative", zIndex: 1, maxWidth: "700px", margin: "0 auto" }}>
          <TextReveal style={{ fontFamily: "'Archivo', sans-serif", fontSize: "clamp(2.5rem, 6vw, 5rem)", fontWeight: 900, color: C.textLight, letterSpacing: "-0.03em", lineHeight: 0.95, marginBottom: "2rem" }}>
            Votre projet<br />mérite mieux.
          </TextReveal>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            style={{ fontSize: "1.05rem", color: "#666", lineHeight: 1.75, marginBottom: "3rem" }}
          >{/* TEXTE_SECTION */ clientText(sessionData, "section-6.texte") ?? (<>
            On accepte 4 nouveaux projets par an. Si le vôtre est l'un d'eux, écrivons-nous.
          </>)}</motion.p>
          <Link href="/templates/impact-61/contact" style={{ textDecoration: "none" }}>
            <MagneticButton
              style={{
                background: C.gold,
                color: C.bgDark,
                border: "none",
                padding: "1.1rem 3rem",
                fontFamily: "'Archivo', sans-serif",
                fontSize: "0.8rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                cursor: "pointer",
              }}
            >
              DÉMARRER UN PROJET →
            </MagneticButton>
          </Link>
        </div>
      </section>
      {/* PIED_MINIMAL — ce thème n'affichait le nom du client nulle part */}
      <footer
        style={{
          padding: "40px 24px",
          textAlign: "center",
          fontSize: 13,
          letterSpacing: "0.08em",
          opacity: 0.55,
        }}
      >
        {clientName(sessionData) ?? "SegmentOS"}
        {clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""}
      </footer>
    </div>
  );
}
