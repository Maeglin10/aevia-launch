"use client";
// @ts-nocheck
/*
  impact-35 — Carré Daviel (accueil). Cabinet pluridisciplinaire chiffre &
  droit, vendu aux avocats, experts-comptables et conseillers patrimoniaux.
  Geste : ExpandFrame — la photo du cabinet s'ouvre depuis un petit cadre à
  chaque changement de vue (un index unique : image, légende, compteur).
  Héros H1 : texte à gauche, média à droite.
*/
import {
  clientCity,
  clientEmail,
  clientEyebrow,
  clientHeroLine,
  clientHeroSubtitle,
  clientName,
  clientPhone,
  clientReviews,
  clientServices,
  clientStats,
  clientTagline,
  clientText,
  memoriserSession,
} from "@/lib/templates/clientContent";
import { resolveList } from "@/lib/templates/resolveList";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { DWELL, ExpandFrame, HairlineArrows, SlideIndex, useSlides } from "@/lib/templates/hero-kit-2";
import {
  C,
  SERIF,
  SANS,
  EXPERTISES,
  FORFAITS,
  TEMOIGNAGES,
  FAQS,
  STATS,
  PHOTOS_CABINET,
  SectionReveal,
  FAQItem,
  TitreSection,
} from "./shared";
let sessionData: any = null;

// Variables de module lues par les sections extraites en composants :
// déclarées ici pour que tout le fichier puisse s'y référer.
let fd: any = null;
let c: any = null;
let bp: any = null;
let brand: any = null;

const VUES = [
  { legende: "La salle de réunion du deuxième" },
  { legende: "Les bureaux des associés" },
  { legende: "L'accueil, côté cour" },
];

export default function CarreDavielPage() {
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

  const DOMAINES = resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({
      ...EXPERTISES[i % EXPERTISES.length],
      title: s.title,
      desc: s.desc || EXPERTISES[i % EXPERTISES.length].desc,
    })),
    EXPERTISES,
  );
  const CHIFFRES = resolveList(clientStats(sessionData), STATS);
  const PACKS = resolveList(
    clientServices(sessionData)?.slice(0, 3).map((s: any, i: number) => ({
      ...FORFAITS[i % FORFAITS.length],
      name: s.title,
      ...(s.price ? { price: String(s.price).replace(/\s*€.*$/, ""), period: String(s.price).includes("/") ? String(s.price).split("/")[1].trim() : undefined } : {}),
    })),
    FORFAITS,
  );
  const AVIS = resolveList(
    clientReviews(sessionData)?.slice(0, 3).map((r: any) => ({ text: r.text, author: r.author, detail: r.detail || undefined })),
    TEMOIGNAGES,
  );

  /* Photo du client à l'emplacement i, sinon celle du thème. */
  const photoVue = (i: number) => fd?.photoUrls?.[i] || PHOTOS_CABINET[i % PHOTOS_CABINET.length];

  /* Un seul index : la photo, la légende et le compteur. */
  const { i: vue, next, prev } = useSlides(VUES.length, DWELL.slow);

  const tel = clientPhone(sessionData) ?? fd?.phone ?? "01 42 61 08 30";
  const telHref = `tel:${tel.replace(/\s/g, "")}`;
  const ville = clientCity(sessionData) ?? "Paris";

  return (
    <div style={{ background: C.bg, color: C.text, overflowX: "clip" }}>

      {/* ── HÉROS — H1 : texte à gauche, ExpandFrame à droite ──────────── */}
      <section style={{ padding: "clamp(56px,8vh,110px) 5% clamp(48px,6vh,80px)" }}>
        <div className="i35-hero" style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "1.02fr 0.98fr", gap: "clamp(36px,5vw,80px)", alignItems: "center" }}>
          <div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 0.1 }}>
              <span style={{ fontFamily: SANS, fontSize: 11, letterSpacing: "0.35em", textTransform: "uppercase", color: C.or, fontWeight: 600 }}>
                {clientEyebrow(sessionData) ?? `Avocats & experts-comptables · ${ville}`}
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.05, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
              style={{ fontFamily: SERIF, fontSize: "clamp(38px,5.4vw,72px)", fontWeight: 600, lineHeight: 1.06, letterSpacing: "-0.015em", margin: "22px 0 24px", color: C.text }}
            >{/* TEXTE_SECTION */ clientText(sessionData, "hero.titre") ?? (<>
              {clientHeroLine(sessionData, 0, 2, 22) ?? "Le chiffre et le droit,"}<br />
              <em style={{ color: C.navy, fontStyle: "italic" }}>{clientHeroLine(sessionData, 1, 2, 22) ?? "sous un même toit."}</em>
            </>)}</motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
              style={{ fontFamily: SANS, fontSize: 16.5, lineHeight: 1.8, color: C.textMuted, maxWidth: 480, marginBottom: 34, fontWeight: 300 }}
            >
              {clientHeroSubtitle(sessionData) ?? clientTagline(sessionData) ?? "Avocats, experts-comptables et conseil patrimonial travaillent votre dossier ensemble — une seule porte, une seule stratégie, des honoraires écrits d'avance."}
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.58 }} style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <a href={telHref} style={{ fontFamily: SANS, padding: "16px 34px", background: C.navy, color: "#fff", fontSize: 12.5, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none", fontWeight: 700, borderRadius: 2 }}>
                Prendre rendez-vous
              </a>
              <Link href="/templates/impact-35/pricing" style={{ fontFamily: SANS, padding: "16px 34px", border: `1px solid ${C.border}`, color: C.text, fontSize: 12.5, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none", fontWeight: 600, borderRadius: 2, background: C.white }}>
                Voir les honoraires
              </Link>
            </motion.div>
          </div>

          {/* Le média : la photo s'ouvre depuis un petit cadre. */}
          <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.05, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}>
            <div style={{ position: "relative" }}>
              {/* Le cadre 4/3 donne sa hauteur ; ExpandFrame peint dedans. */}
              <div style={{ aspectRatio: "4/3", position: "relative", overflow: "hidden", borderRadius: 4, border: `1px solid ${C.border}`, background: C.bgAlt }}>
                <ExpandFrame src={photoVue(vue)} alt={VUES[vue].legende} index={vue} radius={4} className="absolute inset-0" />
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, marginTop: 14 }}>
                <span style={{ fontFamily: SANS, fontSize: 11.5, letterSpacing: "0.12em", textTransform: "uppercase", color: C.textMuted, fontWeight: 600 }}>{VUES[vue].legende}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <SlideIndex i={vue} total={VUES.length} color={C.textMuted} />
                  <HairlineArrows onPrev={prev} onNext={next} color={C.text} />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        <style>{`@media (max-width: 920px) { .i35-hero { grid-template-columns: 1fr !important; } }`}</style>
      </section>

      {/* ── CHIFFRES ───────────────────────────────────────────────────── */}
      <section style={{ background: C.white, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: "34px 5%" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(200px,100%), 1fr))", gap: 24 }}>
          {CHIFFRES.map((s: any, i: number) => (
            <SectionReveal key={i} delay={i * 0.07}>
              <div style={{ textAlign: "center", padding: "10px 6px" }}>
                <div style={{ fontFamily: SERIF, fontSize: "clamp(26px,3vw,38px)", fontWeight: 700, color: C.navy, marginBottom: 6 }}>{s.value}</div>
                <div style={{ fontFamily: SANS, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: C.textMuted, fontWeight: 600 }}>{s.label}</div>
              </div>
            </SectionReveal>
          ))}
        </div>
      </section>

      {/* ── EXPERTISES ─────────────────────────────────────────────────── */}
      <section style={{ padding: "clamp(64px,9vh,110px) 5%" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <SectionReveal>
            <TitreSection surtitre="Expertises">{/* TEXTE_SECTION */ clientText(sessionData, "expertises.titre") ?? (<>Six domaines, <em style={{ color: C.navy }}>une seule stratégie.</em></>)}</TitreSection>
          </SectionReveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px,100%), 1fr))", gap: 22 }}>
            {DOMAINES.map((e: any, i: number) => (
              <SectionReveal key={i} delay={i * 0.06}>
                <Link href="/templates/impact-35/services" style={{ display: "flex", flexDirection: "column", height: "100%", background: C.white, border: `1px solid ${C.border}`, borderRadius: 4, padding: "30px 28px", textDecoration: "none", color: "inherit" }}>
                  <e.icon style={{ width: 26, height: 26, color: C.or, marginBottom: 20 }} />
                  <h3 style={{ fontFamily: SERIF, fontSize: 21, fontWeight: 600, marginBottom: 10 }}>{e.title}</h3>
                  <p style={{ fontFamily: SANS, fontSize: 14, lineHeight: 1.75, color: C.textMuted, fontWeight: 300, margin: 0, flex: 1 }}>{e.desc}</p>
                </Link>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── HONORAIRES (aperçu) ────────────────────────────────────────── */}
      <section style={{ background: C.bgAlt, borderTop: `1px solid ${C.border}`, padding: "clamp(64px,9vh,110px) 5%" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <SectionReveal>
            <TitreSection surtitre="Honoraires" centre>{/* TEXTE_SECTION */ clientText(sessionData, "honoraires.titre") ?? (<>Écrits d'avance, <em style={{ color: C.navy }}>tenus ensuite.</em></>)}</TitreSection>
          </SectionReveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px,100%), 1fr))", gap: 22, alignItems: "stretch" }}>
            {PACKS.map((p: any, i: number) => (
              <SectionReveal key={i} delay={i * 0.08}>
                <div style={{ display: "flex", flexDirection: "column", height: "100%", background: p.highlight ? C.navyDark : C.white, color: p.highlight ? "#fff" : C.text, border: `1px solid ${p.highlight ? C.navyDark : C.border}`, borderRadius: 4, padding: "34px 30px", position: "relative" }}>
                  {p.highlight && (
                    <span style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: C.or, color: "#fff", fontFamily: SANS, fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 700, padding: "5px 14px", borderRadius: 2, whiteSpace: "nowrap" }}>Le plus choisi</span>
                  )}
                  <h3 style={{ fontFamily: SERIF, fontSize: 21, fontWeight: 600, marginBottom: 14 }}>{p.name}</h3>
                  <div style={{ fontFamily: SERIF, fontSize: 40, fontWeight: 700, marginBottom: 22 }}>
                    {p.price} €{p.period ? <span style={{ fontFamily: SANS, fontSize: 13, fontWeight: 400, opacity: 0.6 }}> / {p.period}</span> : null}
                  </div>
                  <ul style={{ listStyle: "none", padding: 0, margin: "0 0 26px", flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
                    {p.features.map((f: string) => (
                      <li key={f} style={{ fontFamily: SANS, fontSize: 13.5, lineHeight: 1.6, fontWeight: 300, display: "flex", gap: 10, opacity: p.highlight ? 0.9 : 1, color: p.highlight ? "rgba(255,255,255,0.9)" : C.textMuted }}>
                        <span aria-hidden style={{ color: C.or }}>—</span> {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/templates/impact-35/pricing" style={{ fontFamily: SANS, display: "block", textAlign: "center", padding: "14px 20px", background: p.highlight ? C.or : "transparent", border: `1px solid ${p.highlight ? C.or : C.navy}`, color: p.highlight ? "#fff" : C.navyFixe, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", textDecoration: "none", fontWeight: 700, borderRadius: 2 }}>
                    {p.cta}
                  </Link>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── AVIS ───────────────────────────────────────────────────────── */}
      <section style={{ padding: "clamp(64px,9vh,110px) 5%" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <SectionReveal>
            <TitreSection surtitre="Ils sont accompagnés">{/* TEXTE_SECTION */ clientText(sessionData, "avis.titre") ?? (<>La confiance <em style={{ color: C.navy }}>se constate.</em></>)}</TitreSection>
          </SectionReveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(290px,100%), 1fr))", gap: 34 }}>
            {AVIS.map((a: any, i: number) => (
              <SectionReveal key={i} delay={i * 0.08}>
                <figure style={{ margin: 0, height: "100%", display: "flex", flexDirection: "column", borderLeft: `2px solid ${C.or}`, paddingLeft: 22 }}>
                  <blockquote style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 18.5, lineHeight: 1.65, color: C.text, margin: "0 0 16px", flex: 1 }}>« {a.text} »</blockquote>
                  <figcaption style={{ fontFamily: SANS, fontSize: 11.5, letterSpacing: "0.14em", textTransform: "uppercase", color: C.textMuted, fontWeight: 600 }}>
                    {a.author}{a.detail ? <span style={{ display: "block", marginTop: 5, color: C.or }}>{a.detail}</span> : null}
                  </figcaption>
                </figure>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────────── */}
      <section style={{ background: C.white, borderTop: `1px solid ${C.border}`, padding: "clamp(64px,9vh,110px) 5%" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <SectionReveal>
            <TitreSection surtitre="Questions" centre>{/* TEXTE_SECTION */ clientText(sessionData, "faq.titre") ?? (<>Avant de <em style={{ color: C.navy }}>pousser la porte.</em></>)}</TitreSection>
          </SectionReveal>
          <div style={{ borderTop: `1px solid ${C.border}` }}>
            {FAQS.map((f, i) => (
              <FAQItem key={i} faq={f} delay={i * 0.05} />
            ))}
          </div>
        </div>
      </section>

      {/* ── APPEL FINAL ────────────────────────────────────────────────── */}
      <section id="contact" style={{ background: C.bgAlt, borderTop: `1px solid ${C.border}`, padding: "clamp(70px,10vh,120px) 5%", textAlign: "center" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <SectionReveal>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px,4.2vw,52px)", fontWeight: 600, lineHeight: 1.1, marginBottom: 18 }}>{/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (<>
              Un dossier ? <em style={{ color: C.navy }}>Une heure suffit pour y voir clair.</em>
            </>)}</h2>
            <p style={{ fontFamily: SANS, fontSize: 15.5, lineHeight: 1.8, color: C.textMuted, fontWeight: 300, maxWidth: 520, margin: "0 auto 36px" }}>
              {c?.ctaText ?? "Première consultation au cabinet ou en visioconférence — vous repartez avec un plan d'action écrit sous 48 heures."}
            </p>
            <a href={telHref} style={{ fontFamily: SANS, display: "inline-block", padding: "18px 46px", background: C.navy, color: "#fff", fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase", textDecoration: "none", fontWeight: 700, borderRadius: 2 }}>
              {tel}
            </a>
          </SectionReveal>
        </div>
      </section>

      {/* PIED_MINIMAL — la ville du client, portée sur chaque page */}
      <footer style={{ padding: "40px 24px", textAlign: "center", fontSize: 13, letterSpacing: "0.08em", opacity: 0.9 }}>
        {clientName({ formData: fd }) ?? "impact-35"}
        {clientCity({ formData: fd }) ? ` · ${clientCity({ formData: fd })}` : ""}
      </footer>
    </div>
  );
}
