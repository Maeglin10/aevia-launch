"use client";
import { resolveList } from "@/lib/templates/resolveList";
// @ts-nocheck
/*
  impact-36 — Apex Talent (accueil). Cabinet de recrutement de dirigeants,
  francisé. Geste : TrackingCollapse — le mot fort du titre arrive très
  espacé puis se resserre à chaque rotation (un index unique pilote le mot
  et le compteur discret). Héros en double colonne : l'argument à gauche,
  le rapport d'adéquation à droite.
*/

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Star, Target, Briefcase, CheckCircle } from "lucide-react"
import { DWELL, useSlides } from "@/lib/templates/hero-kit-2"
import { TrackingCollapse } from "@/lib/templates/hero-kit-3"
import {
  C,
  SERIF,
  SERVICES,
  SECTORS,
  CASE_STUDIES,
  TESTIMONIALS,
  STATS,
  SectionReveal,
  Counter,
  MatchScore,
} from "./shared"
import {
  clientHeroLine,
  clientHeroSubtitle,
  clientWorks,
  clientCity,
  clientName,
  clientReviews,
  clientServices,
  clientStats,
  clientText,
  memoriserSession,
} from "@/lib/templates/clientContent";
let sessionData: any = null;

// Variables de module lues par les sections extraites en composants :
// déclarées ici pour que tout le fichier puisse s'y référer.
let fd: any = null;
let c: any = null;
let brand: any = null;

const MOTS_HEROS = ["les dirigeants.", "les cadres clés.", "les profils rares."];

export default function Home() {
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
    fetch(`/api/sessions?id=${id}`)
      .then((r) => r.json())
      .then(setSession)
      .catch(() => {});
  }, []);

  fd = session?.formData;
  sessionData = session;
  /*
    Les références du client passent devant celles de la démonstration : un
    cabinet qui a saisi ses missions ne montre pas celles du thème.
  */
  const CAS_CLIENTS = resolveList(
    clientWorks(sessionData)?.map((w: any, i: number) => ({
      ...CASE_STUDIES[i % CASE_STUDIES.length],
      company: w.title || w.name,
      challenge: w.desc || w.description || CASE_STUDIES[i % CASE_STUDIES.length].challenge,
      outcome: w.detail || CASE_STUDIES[i % CASE_STUDIES.length].outcome,
    })),
    CASE_STUDIES,
  );
  memoriserSession(sessionData);
  c = session?.generatedContent;
  const SERVICES_DU_CLIENT = resolveList(clientServices(sessionData)?.map((s: any, i: number) => ({ ...SERVICES[i % SERVICES.length], name: s.title, desc: s.desc || SERVICES[i % SERVICES.length].desc })), SERVICES);
  const CHIFFRES = resolveList(
    clientStats(sessionData)?.map((s: any, i: number) => ({
      ...STATS[i % STATS.length],
      end: parseInt(String(s.value).replace(/[^\d]/g, ""), 10) || 0,
      suffix: String(s.value).replace(/^[\d\s ]+/, ""),
      label: s.label,
    })),
    STATS,
  );
  const AVIS = resolveList(
    clientReviews(sessionData)?.slice(0, 3).map((r: any, i: number) => ({
      ...TESTIMONIALS[i % TESTIMONIALS.length],
      text: r.text,
      name: r.author,
      role: r.detail || TESTIMONIALS[i % TESTIMONIALS.length].role,
      avatar: (r.author || "·").split(/\s+/).map((p: string) => p[0]).slice(0, 2).join("").toUpperCase(),
    })),
    TESTIMONIALS,
  );

  brand = fd?.brandColor ?? null; // null = keep template's original color

  /* Un seul index : le mot du titre et son compteur discret. */
  const motsClient = clientServices(sessionData)?.slice(0, 3).map((s: any) => s.title + ".");
  const MOTS = motsClient && motsClient.length >= 2 ? motsClient : MOTS_HEROS;
  const { i: mot } = useSlides(MOTS.length, DWELL.slow);

return (
    <div>
      {/* HÉROS */}
      <section
        style={{
          background: C.navy,
          minHeight: "85vh",
          display: "flex",
          alignItems: "center",
          paddingTop: 40,
          paddingBottom: 80,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Trame de fond */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `linear-gradient(rgba(169,189,211,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(169,189,211,0.06) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Halo acier */}
        <div
          style={{
            position: "absolute",
            bottom: "-20%",
            left: "30%",
            width: 700,
            height: 700,
            background: `radial-gradient(circle, rgba(169,189,211,0.14) 0%, transparent 60%)`,
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 2,
            maxWidth: 1200,
            margin: "0 auto",
            padding: "40px 5%",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))",
              gap: 80,
              alignItems: "center",
            }}
          >
            {/* Colonne gauche : l'argument */}
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                style={{
                  fontFamily: SERIF,
                  fontSize: "clamp(38px, 4.5vw, 60px)",
                  fontWeight: 600,
                  color: C.white,
                  lineHeight: 1.12,
                  marginBottom: 24,
                }}
              >{/* TEXTE_SECTION */ clientText(sessionData, "hero.titre") ?? (<>
                {clientHeroLine(sessionData, 0, 1, 34) ?? c?.heroHeadline ?? "Recruter celles et ceux qui font grandir"}
                {!clientHeroLine(sessionData, 0, 1, 34) && (
                  <span style={{ color: C.surMarine, display: "block" }}>
                    <TrackingCollapse word={MOTS[mot]} index={mot} />
                  </span>
                )}
              </>)}</motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.25 }}
                style={{
                  fontSize: 18,
                  color: C.surMarine,
                  lineHeight: 1.75,
                  marginBottom: 40,
                  maxWidth: 460,
                }}
              >{clientHeroSubtitle(sessionData) ?? fd?.tagline ?? c?.heroSubline ?? <>
                Chasse de dirigeants, recrutement délégué et conseil RH — pour les entreprises qui ne transigent pas sur les personnes.
              </>}</motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                style={{ display: "flex", gap: 16, flexWrap: "wrap" }}
              >
                <Link href="/templates/impact-36/services#contact-form" style={{ textDecoration: "none" }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      background: C.surMarine,
                      color: C.navy,
                      padding: "16px 32px",
                      borderRadius: 10,
                      fontWeight: 700,
                      fontSize: 16,
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Confier un recrutement <ArrowRight size={18} />
                  </span>
                </Link>
                <Link href="/templates/impact-36/services#contact-form" style={{ textDecoration: "none" }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      background: "transparent",
                      color: C.white,
                      padding: "16px 32px",
                      borderRadius: 10,
                      fontWeight: 600,
                      fontSize: 16,
                      border: "1.5px solid rgba(255,255,255,0.2)",
                      cursor: "pointer",
                    }}
                  >
                    Je suis candidat·e
                  </span>
                </Link>
              </motion.div>
            </div>

            {/* Colonne droite : le rapport d'adéquation */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 20,
                  padding: 32,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 28,
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      background: "rgba(169,189,211,0.18)",
                      borderRadius: 12,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Target size={24} color={C.surMarine} />
                  </div>
                  <div>
                    <div style={{ color: C.white, fontWeight: 700, fontSize: 16 }}>
                      Rapport d'adéquation
                    </div>
                    <div style={{ color: C.surMarine, fontSize: 13, opacity: 0.8 }}>
                      Directeur industriel — mandat en cours
                    </div>
                  </div>
                  <div
                    style={{
                      marginLeft: "auto",
                      background: "#22c55e22",
                      border: "1px solid #22c55e44",
                      borderRadius: 20,
                      padding: "4px 12px",
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#4ade80",
                    }}
                  >
                    PRÉSÉLECTIONNÉ
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                    marginBottom: 24,
                  }}
                >
                  <MatchScore score={97} label="Expertise métier" />
                  <MatchScore score={93} label="Expérience de direction" />
                  <MatchScore score={89} label="Adéquation culturelle" />
                  <MatchScore score={95} label="Cadre de rémunération" />
                  <MatchScore score={91} label="Connaissance du secteur" />
                </div>

                <div
                  style={{
                    background: "rgba(169,189,211,0.1)",
                    border: "1px solid rgba(169,189,211,0.25)",
                    borderRadius: 12,
                    padding: "14px 18px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ color: C.surMarine, fontSize: 14, fontWeight: 600 }}>
                    Adéquation globale
                  </span>
                  <span style={{ fontSize: 24, fontWeight: 900, color: C.white }}>
                    93 %
                  </span>
                </div>

                <div
                  style={{
                    marginTop: 20,
                    paddingTop: 20,
                    borderTop: "1px solid rgba(255,255,255,0.08)",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <CheckCircle size={16} color="#4ade80" />
                  <span style={{ fontSize: 13, color: "#94a3b8" }}>
                    Candidat en poste — approché, pas en recherche
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" style={{ padding: "100px 5%", background: C.bgAlt }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: C.accentLight,
                  borderRadius: 30,
                  padding: "6px 16px",
                  marginBottom: 16,
                }}
              >
                <Briefcase size={14} color={C.accentFixe} />
                <span style={{ color: C.accentFixe, fontSize: 13, fontWeight: 600 }}>
                  Ce que nous faisons
                </span>
              </div>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px, 4vw, 46px)", fontWeight: 600, color: C.navy, marginBottom: 16 }}>{c?.aboutTitle ?? <>
                Trois façons de vous renforcer
              </>}</h2>
              <p style={{ fontSize: 17, color: C.textMuted, maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>{c?.aboutText ?? <>
                D'un poste de direction à pourvoir jusqu'à la refonte complète de votre recrutement — au croisement de la stratégie d'équipe et des résultats.
              </>}</p>
            </div>
          </SectionReveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", gap: 28 }}>
            {SERVICES_DU_CLIENT.map((service, i) => (
              <SectionReveal key={service.name} delay={i * 0.12}>
                <div
                  style={{
                    background: C.white,
                    borderRadius: 20,
                    padding: 36,
                    border: `1px solid ${C.border}`,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                  className="group hover:-translate-y-1 hover:shadow-xl transition-all"
                >
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      background: C.accentLight,
                      borderRadius: 14,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 20,
                    }}
                  >
                    <service.icon size={26} color={C.accentFixe} />
                  </div>
                  <h3 style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 600, color: C.navy, marginBottom: 12 }}>
                    {service.name}
                  </h3>
                  <p style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.7, marginBottom: 24, flex: 1 }}>
                    {service.desc}
                  </p>
                  <Link href="/templates/impact-36/services" style={{ textDecoration: "none" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        color: C.accentFixe,
                        fontWeight: 700,
                        fontSize: 14,
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                      }}
                    >
                      En savoir plus <ArrowRight size={14} />
                    </span>
                  </Link>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* BANDE DE CHIFFRES */}
      <section id="results" style={{ padding: "100px 5%", background: C.navy }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: 72 }}>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px, 4vw, 46px)", fontWeight: 600, color: C.white, marginBottom: 16 }}>{/* TEXTE_SECTION */ clientText(sessionData, "results.titre") ?? (<>
                Dix-huit ans de résultats mesurés
              </>)}</h2>
              <p style={{ fontSize: 17, color: C.surMarine, maxWidth: 480, margin: "0 auto" }}>
                Les chiffres d'un cabinet qui préfère la qualité au volume.
              </p>
            </div>
          </SectionReveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(200px, 100%), 1fr))", gap: 40 }}>
            {CHIFFRES.map((s, i) => (
              <Counter key={s.label} end={s.end} suffix={s.suffix} label={s.label} delay={i * 0.15} />
            ))}
          </div>
        </div>
      </section>

      {/* MISSIONS MENÉES */}
      <section style={{ padding: "100px 5%", background: C.bg }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px, 4vw, 46px)", fontWeight: 600, color: C.navy, marginBottom: 16 }}>{/* TEXTE_SECTION */ clientText(sessionData, "missions.titre") ?? (<>
                Des missions menées au bout
              </>)}</h2>
            </div>
          </SectionReveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: 24 }}>
            {CAS_CLIENTS.map((cs, i) => (
              <SectionReveal key={cs.company} delay={i * 0.1}>
                <div
                  style={{
                    background: C.white,
                    borderRadius: 20,
                    padding: 32,
                    border: `1px solid ${C.border}`,
                    display: "flex",
                    flexDirection: "column",
                    gap: 20,
                    height: "100%",
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: "inline-block",
                        background: C.accentLight,
                        color: C.accentFixe,
                        fontSize: 11,
                        fontWeight: 700,
                        padding: "3px 10px",
                        borderRadius: 20,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        marginBottom: 10,
                      }}
                    >
                      {cs.sector}
                    </div>
                    <h3 style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 600, color: C.navy }}>{cs.company}</h3>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
                      Le besoin
                    </div>
                    <p style={{ fontSize: 14, color: C.text, lineHeight: 1.65 }}>{cs.challenge}</p>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
                      Le résultat
                    </div>
                    <p style={{ fontSize: 14, color: C.text, lineHeight: 1.65 }}>{cs.outcome}</p>
                  </div>
                  <div
                    style={{
                      marginTop: "auto",
                      paddingTop: 20,
                      borderTop: `1px solid ${C.border}`,
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <div style={{ fontFamily: SERIF, fontSize: 32, fontWeight: 700, color: C.accentFixe }}>{cs.metric}</div>
                    <div style={{ fontSize: 13, color: C.textMuted }}>{cs.metricLabel}</div>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 48 }}>
            <Link href="/templates/impact-36/results" style={{ textDecoration: "none" }}>
              <span
                style={{
                  background: C.accent,
                  color: C.white,
                  padding: "14px 28px",
                  borderRadius: 8,
                  fontWeight: 700,
                  fontSize: 15,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Toutes les missions
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* TÉMOIGNAGES */}
      <section style={{ padding: "100px 5%", background: C.navy }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px, 4vw, 46px)", fontWeight: 600, color: C.white, marginBottom: 12 }}>{/* TEXTE_SECTION */ clientText(sessionData, "avis.titre") ?? (<>
                Ce que disent nos clients
              </>)}</h2>
            </div>
          </SectionReveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: 24 }}>
            {AVIS.map((t, i) => (
              <SectionReveal key={i} delay={i * 0.1}>
                <div
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 20,
                    padding: 32,
                    display: "flex",
                    flexDirection: "column",
                    gap: 18,
                    height: "100%",
                  }}
                >
                  <div style={{ display: "flex", gap: 4 }} aria-hidden>
                    {Array.from({ length: t.rating ?? 5 }).map((_, j) => (
                      <Star key={j} size={16} fill={C.surMarine} color={C.surMarine} />
                    ))}
                  </div>
                  <p style={{ fontSize: 15, color: "#cbd5e1", lineHeight: 1.75, flex: 1 }}>« {t.text} »</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: "50%",
                        background: "rgba(169,189,211,0.18)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: 13,
                        color: C.surMarine,
                        flexShrink: 0,
                      }}
                    >
                      {t.avatar}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: C.white }}>{t.name}</div>
                      <div style={{ fontSize: 13, color: C.surMarine, opacity: 0.8 }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* SECTEURS */}
      <section style={{ padding: "100px 5%", background: C.bgAlt }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
          <SectionReveal>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 600, color: C.navy, marginBottom: 16 }}>{/* TEXTE_SECTION */ clientText(sessionData, "secteurs.titre") ?? (<>
              Les secteurs que nous connaissons
            </>)}</h2>
            <p style={{ fontSize: 17, color: C.textMuted, maxWidth: 500, margin: "0 auto 40px", lineHeight: 1.7 }}>
              Douze secteurs, des réseaux entretenus depuis dix-huit ans.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              {SECTORS.slice(0, 4).map((sector) => (
                <div
                  key={sector}
                  style={{
                    background: C.bg,
                    border: `1px solid ${C.border}`,
                    borderRadius: 12,
                    padding: "12px 20px",
                    fontSize: 14,
                    fontWeight: 600,
                    color: C.navy,
                  }}
                >
                  {sector}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 40 }}>
              <Link href="/templates/impact-36/sectors" style={{ textDecoration: "none" }}>
                <span
                  style={{
                    background: C.accent,
                    color: C.white,
                    padding: "14px 28px",
                    borderRadius: 8,
                    fontWeight: 700,
                    fontSize: 15,
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Tous les secteurs
                </span>
              </Link>
            </div>
          </SectionReveal>
        </div>
      </section>
      {/* PIED_MINIMAL — ce thème n'affichait pas la ville du client */}
      <footer style={{ padding: "40px 24px", textAlign: "center", fontSize: 13, letterSpacing: "0.08em", opacity: 0.9, textShadow: "0 0 2px rgba(0,0,0,0.55), 0 0 10px rgba(255,255,255,0.35)" }}>
        {clientName({ formData: fd }) ?? "impact-36"}
        {clientCity({ formData: fd }) ? ` · ${clientCity({ formData: fd })}` : ""}
      </footer>
    </div>
  )
}
