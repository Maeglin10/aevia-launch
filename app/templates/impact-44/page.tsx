"use client";
// @ts-nocheck
/*
  impact-44 — Espace Studio · Marseille (accueil). L'organisation esport a
  été réécrite en studio de décoration : c'est ce que le catalogue vendait.
  Geste : PanelDrop — le panneau de matières du moodboard tombe comme un
  rideau quand l'ambiance change (137 le porte sur le texte de son héros de
  café ; ici c'est le nuancier). Un seul index pilote la teinte de la pièce
  dessinée, le panneau et le compteur.
*/
import {
  clientCity,
  clientEyebrow,
  clientHeroLine,
  clientHeroSubtitle,
  clientName,
  clientReviews,
  clientServices,
  clientStats,
  clientTagline,
  clientText,
  clientWorks,
  memoriserSession,
} from "@/lib/templates/clientContent";
import { resolveList } from "@/lib/templates/resolveList";

import React, { useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { DWELL, useSlides } from "@/lib/templates/hero-kit-2";
import { PanelDrop } from "@/lib/templates/hero-kit-3";
import {
  C,
  PRESTATIONS,
  STUDIO_STATS,
  SELECTION,
  REALISATIONS,
  AMBIANCES,
  StatCounter,
  Nuancier,
} from "./shared";
let sessionData: any = null;

// Variables de module lues par les sections extraites en composants :
// déclarées ici pour que tout le fichier puisse s'y référer.
let fd: any = null;
let c: any = null;
let bp: any = null;
let brand: any = null;

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function EspaceStudioPage() {
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
    businessProfile?: any;
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
    fetch(`/api/sessions?id=${id}`)
      .then((r) => r.json())
      .then(setSession)
      .catch(() => {});
  }, []);

  fd = session?.formData;
  sessionData = session;
  memoriserSession(sessionData);
  c = session?.generatedContent;
  bp = session?.businessProfile;

  brand = fd?.brandColor ?? null; // null = keep template's original color

  const OFFRES = resolveList(
    clientServices(sessionData)?.slice(0, 4).map((s: any, i: number) => ({
      ...PRESTATIONS[i % PRESTATIONS.length],
      title: s.title,
      desc: s.desc || PRESTATIONS[i % PRESTATIONS.length].desc,
      ...(s.price ? { prix: s.price } : {}),
    })),
    PRESTATIONS,
  );
  const STATS = resolveList(
    clientStats(sessionData)?.map((s: any, i: number) => ({
      ...STUDIO_STATS[i % STUDIO_STATS.length],
      value: parseInt(String(s.value).replace(/[^\d]/g, ""), 10) || 0,
      suffix: String(s.value).replace(/^[\d\s]+/, ""),
      label: s.label,
    })),
    STUDIO_STATS,
  );
  const LIEUX = /* REALISATIONS */ resolveList(
    clientWorks(sessionData)?.slice(0, 4).map((o: any, i: number) => ({
      ...REALISATIONS[i % REALISATIONS.length],
      nom: o.title,
      ...(o.detail ? { type: o.detail } : {}),
    })),
    REALISATIONS,
  );
  const AVIS = resolveList(
    clientReviews(sessionData)?.slice(0, 3).map((r: any) => ({ text: r.text, author: r.author, detail: r.detail || undefined })),
    [
      { text: "Deux heures de conseil, un carnet de teintes — et l'appartement a enfin l'air d'avoir été pensé.", author: "Julie M.", detail: "conseil couleur" },
      { text: "Le studio a tenu le chantier, les artisans et le budget. On n'a décidé que de ce qui nous plaisait.", author: "Famille Garnier", detail: "rénovation" },
      { text: "Vendu en trois semaines, au prix. Le home staging s'est payé tout seul.", author: "R. Fabiani", detail: "home staging" },
    ],
  );

  /* Un seul index : l'ambiance pilote la teinte, le panneau et le compteur. */
  const { i: ambiance, go: choisirAmbiance } = useSlides(AMBIANCES.length, DWELL.slow);
  const A = AMBIANCES[ambiance];

  return (
    <>
      <div style={{ background: C.bg, color: C.white, minHeight: "100dvh", overflowX: "clip" }}>

        {/* ── HÉROS — le moodboard d'ambiance sous PanelDrop ────────────── */}
        <section id="hero" style={{ position: "relative", minHeight: "100dvh", display: "flex", alignItems: "center", padding: "140px 40px 80px", overflow: "hidden" }}>
          {/* Repli dessiné : la lumière du sud sur un mur sombre. */}
          <div aria-hidden style={{ position: "absolute", inset: 0, background: `radial-gradient(90% 70% at 80% 20%, ${A.fonce}33, transparent 60%)`, transition: "background 1.2s ease" }} />
          <div aria-hidden style={{ position: "absolute", inset: 0, opacity: 0.05, backgroundImage: `repeating-linear-gradient(90deg, transparent 0 140px, ${C.sableFixe} 140px 141px)` }} />

          <div className="i44-hero" style={{ position: "relative", zIndex: 2, maxWidth: 1280, margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: "clamp(40px,6vw,90px)", alignItems: "center" }}>
            <div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.15 }}>
                <span style={{ fontSize: 11, letterSpacing: "0.35em", textTransform: "uppercase", color: C.sableFixe, fontWeight: 700 }}>
                  {clientEyebrow(sessionData) ?? `Décoration d'intérieur · ${clientCity(sessionData) ?? "Marseille"}`}
                </span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                style={{ fontSize: "clamp(44px, 6.5vw, 96px)", fontWeight: 800, lineHeight: 0.98, letterSpacing: "-0.02em", textTransform: "uppercase", margin: "26px 0 28px" }}
              >{/* TEXTE_SECTION */ clientText(sessionData, "hero.titre") ?? (<>
                {clientHeroLine(sessionData, 0, 2, 12) ?? "L'intérieur"}<br />
                <span style={{ color: C.sable }}>{clientHeroLine(sessionData, 1, 2, 16) ?? "qui vous ressemble."}</span>
              </>)}</motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                style={{ color: C.textMid, fontSize: 17, lineHeight: 1.75, maxWidth: 480, marginBottom: 36, fontWeight: 300 }}
              >
                {clientHeroSubtitle(sessionData) ?? clientTagline(sessionData) ?? "Conseil couleur, décoration pièce par pièce, rénovation suivie : le studio dessine, chiffre et livre — vous habitez."}
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.68 }} style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <Link href="/templates/impact-44/recruit" style={{ padding: "16px 36px", background: C.sable, color: C.bg, fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none", fontWeight: 800 }}>
                  Prendre rendez-vous
                </Link>
                <Link href="/templates/impact-44/bracket" style={{ padding: "16px 36px", border: `1px solid ${C.line}`, color: C.white, fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none", fontWeight: 700 }}>
                  Voir les réalisations
                </Link>
              </motion.div>
            </div>

            {/* Le moodboard : la pièce dessinée retinte, le panneau tombe. */}
            <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}>
              <div style={{ border: `1px solid ${C.line}`, background: C.gray }}>
                {/* La pièce, en aplats — jamais un trou noir sans photo. */}
                <div aria-hidden style={{ height: "clamp(150px,22vh,220px)", position: "relative", overflow: "hidden", background: `linear-gradient(180deg, ${A.teinte} 0%, ${A.fonce} 100%)`, transition: "background 1.2s ease" }}>
                  <div style={{ position: "absolute", left: "8%", bottom: 0, width: "30%", height: "58%", background: "rgba(16,16,18,0.35)", borderRadius: "6px 6px 0 0" }} />
                  <div style={{ position: "absolute", right: "12%", bottom: 0, width: "16%", height: "78%", background: "rgba(16,16,18,0.25)" }} />
                  <div style={{ position: "absolute", left: "46%", top: "18%", width: 52, height: 52, borderRadius: "50%", background: "rgba(242,237,228,0.75)", boxShadow: "0 0 60px rgba(242,237,228,0.5)" }} />
                </div>
                <div style={{ padding: "26px 28px 30px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 20 }}>
                    <span style={{ fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: C.textDim, fontWeight: 700 }}>Le nuancier du studio</span>
                    <span style={{ fontSize: 10, letterSpacing: "0.2em", color: C.textDim, fontVariantNumeric: "tabular-nums" }}>{ambiance + 1} / {AMBIANCES.length}</span>
                  </div>
                  <div style={{ display: "flex", gap: 8, marginBottom: 22, flexWrap: "wrap" }}>
                    {AMBIANCES.map((amb, i) => (
                      <button
                        key={amb.nom}
                        onClick={() => choisirAmbiance(i)}
                        style={{
                          padding: "11px 18px",
                          minHeight: 44,
                          background: i === ambiance ? C.sable : "transparent",
                          color: i === ambiance ? C.bg : C.textMid,
                          border: `1px solid ${i === ambiance ? C.sable : C.line}`,
                          fontSize: 11,
                          letterSpacing: "0.15em",
                          textTransform: "uppercase",
                          fontWeight: 700,
                          cursor: "pointer",
                          transition: "all 0.25s",
                        }}
                      >
                        {amb.nom}
                      </button>
                    ))}
                  </div>
                  <PanelDrop index={ambiance} style={{ minHeight: 150 }}>
                    <div>
                      <p style={{ color: C.textMid, fontSize: 14.5, lineHeight: 1.7, marginBottom: 18, fontWeight: 300 }}>{A.desc}</p>
                      <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                        <Nuancier teintes={[A.teinte, A.fonce, "#f2ede4"]} />
                        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                          {A.matieres.map((m) => (
                            <span key={m} style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: C.sableFixe, fontWeight: 600 }}>{m}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </PanelDrop>
                </div>
              </div>
            </motion.div>
          </div>
          <style>{`@media (max-width: 960px) { .i44-hero { grid-template-columns: 1fr !important; } }`}</style>
        </section>

        {/* ── CHIFFRES DU STUDIO ────────────────────────────────────────── */}
        <section style={{ background: C.gray, borderTop: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}`, padding: "40px 24px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(200px,100%), 1fr))", gap: 8 }}>
            {STATS.map((s: any, i: number) => (
              <StatCounter key={i} value={s.value} label={s.label} suffix={s.suffix} format={s.format} />
            ))}
          </div>
        </section>

        {/* ── PRESTATIONS (aperçu) ──────────────────────────────────────── */}
        <section style={{ padding: "110px 40px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <Reveal>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 20, marginBottom: 56 }}>
                <div>
                  <div style={{ fontSize: 11, color: C.textDim, letterSpacing: "0.35em", textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>Prestations</div>
                  <h2 style={{ fontSize: "clamp(30px, 4.4vw, 54px)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "-0.015em", lineHeight: 1 }}>{/* TEXTE_SECTION */ clientText(sessionData, "prestations.titre") ?? (<>
                    Quatre façons<br /><span style={{ color: C.sable }}>de travailler ensemble.</span>
                  </>)}</h2>
                </div>
                <Link href="/templates/impact-44/modes" style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: C.sableFixe, textDecoration: "none", fontWeight: 700, borderBottom: `1px solid ${C.sable}`, paddingBottom: 6 }}>
                  Tout le détail →
                </Link>
              </div>
            </Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(260px,100%), 1fr))", gap: 1, background: C.line, border: `1px solid ${C.line}` }}>
              {OFFRES.map((p: any, i: number) => (
                <Reveal key={p.id ?? i} delay={i * 0.08}>
                  <Link href="/templates/impact-44/modes" style={{ display: "flex", flexDirection: "column", height: "100%", background: C.bg, padding: "36px 30px", textDecoration: "none", color: "inherit" }}>
                    <span style={{ fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: C.textDim, fontWeight: 700, marginBottom: 18 }}>{p.tag}</span>
                    <h3 style={{ fontSize: 21, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.01em", lineHeight: 1.15, marginBottom: 12 }}>{p.title}</h3>
                    <p style={{ color: C.textMid, fontSize: 13.5, lineHeight: 1.7, fontWeight: 300, flex: 1, marginBottom: 22 }}>{p.desc}</p>
                    <div style={{ borderTop: `1px solid ${C.line}`, paddingTop: 14, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: C.sableFixe, fontWeight: 700 }}>{p.prix}</div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── RÉALISATIONS (aperçu) ─────────────────────────────────────── */}
        <section style={{ background: C.gray, borderTop: `1px solid ${C.line}`, padding: "110px 40px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <Reveal>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 20, marginBottom: 56 }}>
                <h2 style={{ fontSize: "clamp(30px, 4.4vw, 54px)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "-0.015em", lineHeight: 1 }}>{/* TEXTE_SECTION */ clientText(sessionData, "realisations.titre") ?? (<>
                  Des lieux <span style={{ color: C.sable }}>livrés.</span>
                </>)}</h2>
                <Link href="/templates/impact-44/bracket" style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: C.sableFixe, textDecoration: "none", fontWeight: 700, borderBottom: `1px solid ${C.sable}`, paddingBottom: 6 }}>
                  Toutes les réalisations →
                </Link>
              </div>
            </Reveal>
            <div style={{ borderTop: `1px solid ${C.line}` }}>
              {LIEUX.map((l: any, i: number) => (
                <Reveal key={i} delay={i * 0.06}>
                  <Link href="/templates/impact-44/bracket" style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", justifyContent: "space-between", gap: "8px 24px", padding: "26px 4px", borderBottom: `1px solid ${C.line}`, textDecoration: "none", color: "inherit" }}>
                    <span className="i44-titre" style={{ fontSize: "clamp(20px,2.6vw,30px)", fontWeight: 800, textTransform: "uppercase" }}>{l.nom}</span>
                    <span style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: C.textMid }}>{l.type}</span>
                    <span style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: C.textDim }}>{l.duree}</span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── AVIS ──────────────────────────────────────────────────────── */}
        <section style={{ padding: "110px 40px", borderTop: `1px solid ${C.line}` }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <Reveal>
              <div style={{ fontSize: 11, color: C.textDim, letterSpacing: "0.35em", textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>Ils y vivent</div>
              <h2 style={{ fontSize: "clamp(30px, 4.4vw, 54px)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "-0.015em", lineHeight: 1, marginBottom: 56 }}>{/* TEXTE_SECTION */ clientText(sessionData, "avis.titre") ?? (<>
                Paroles <span style={{ color: C.sable }}>d'habitants.</span>
              </>)}</h2>
            </Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px,100%), 1fr))", gap: 40 }}>
              {AVIS.map((a: any, i: number) => (
                <Reveal key={i} delay={i * 0.08}>
                  <figure style={{ height: "100%", display: "flex", flexDirection: "column", borderLeft: `2px solid ${C.sable}`, paddingLeft: 22, margin: 0 }}>
                    <blockquote style={{ color: C.textMid, fontSize: 16.5, lineHeight: 1.75, fontWeight: 300, fontStyle: "italic", flex: 1, margin: "0 0 18px" }}>« {a.text} »</blockquote>
                    <figcaption style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: C.textDim, fontWeight: 700 }}>
                      {a.author}{a.detail ? <span style={{ display: "block", marginTop: 6, color: C.sableFixe }}>{a.detail}</span> : null}
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── LA SÉLECTION (aperçu) ─────────────────────────────────────── */}
        <section style={{ background: C.gray, borderTop: `1px solid ${C.line}`, padding: "110px 40px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <Reveal>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 20, marginBottom: 56 }}>
                <h2 style={{ fontSize: "clamp(30px, 4.4vw, 54px)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "-0.015em", lineHeight: 1 }}>{/* TEXTE_SECTION */ clientText(sessionData, "selection.titre") ?? (<>
                  La sélection <span style={{ color: C.sable }}>du studio.</span>
                </>)}</h2>
                <Link href="/templates/impact-44/merch" style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: C.sableFixe, textDecoration: "none", fontWeight: 700, borderBottom: `1px solid ${C.sable}`, paddingBottom: 6 }}>
                  Toute la sélection →
                </Link>
              </div>
            </Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(220px,100%), 1fr))", gap: 20 }}>
              {SELECTION.map((m, i) => (
                <Reveal key={m.name} delay={i * 0.07}>
                  <Link href="/templates/impact-44/merch" style={{ display: "block", border: `1px solid ${C.line}`, background: C.bg, textDecoration: "none", color: "inherit" }}>
                    <div aria-hidden style={{ aspectRatio: "4/3", background: `linear-gradient(150deg, ${C.grayAlt} 0%, #26262c 100%)`, position: "relative" }}>
                      <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", width: 46, height: 46, borderRadius: "50%", border: `1px solid ${C.sable}`, opacity: 0.6 }} />
                    </div>
                    <div style={{ padding: "18px 18px 20px" }}>
                      <div style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: C.sableFixe, fontWeight: 700, marginBottom: 8 }}>{m.tag}</div>
                      <div style={{ fontSize: 14.5, fontWeight: 600, marginBottom: 8 }}>{m.name}</div>
                      <div style={{ fontSize: 12, color: C.textMid }}>{m.price} €</div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── APPEL FINAL ───────────────────────────────────────────────── */}
        <section style={{ padding: "120px 40px", textAlign: "center", borderTop: `1px solid ${C.line}` }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <Reveal>
              <h2 style={{ fontSize: "clamp(32px, 5vw, 60px)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "-0.015em", lineHeight: 1.02, marginBottom: 22 }}>{/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (<>
                Et si on parlait<br /><span style={{ color: C.sable }}>de chez vous ?</span>
              </>)}</h2>
              <p style={{ color: C.textMid, fontSize: 16, lineHeight: 1.75, fontWeight: 300, maxWidth: 520, margin: "0 auto 40px" }}>
                {c?.ctaText ?? "Une première visite, un échange sur vos usages et votre budget — et une proposition claire sous une semaine."}
              </p>
              <Link href="/templates/impact-44/recruit" style={{ display: "inline-block", padding: "18px 48px", background: C.sable, color: C.bg, fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase", textDecoration: "none", fontWeight: 800 }}>
                Prendre rendez-vous
              </Link>
            </Reveal>
          </div>
        </section>
      </div>
      {/* PIED_MINIMAL — ce thème n'affichait pas la ville du client */}
      <footer style={{ padding: "40px 24px", textAlign: "center", fontSize: 13, letterSpacing: "0.08em", opacity: 0.9, textShadow: "0 0 2px rgba(0,0,0,0.55), 0 0 10px rgba(255,255,255,0.35)" }}>
        {clientName({ formData: fd }) ?? "impact-44"}
        {clientCity({ formData: fd }) ? ` · ${clientCity({ formData: fd })}` : ""}
      </footer>
    </>
  );
}
