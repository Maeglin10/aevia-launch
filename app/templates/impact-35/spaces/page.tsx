"use client";
// @ts-nocheck
/*
  impact-35 / spaces — « Le cabinet ». Les lieux et la façon d'y être reçu.
  Photos du thème (remplacées par celles du client quand il en fournit).
*/

import React, { useEffect, useState } from "react";
import { C, SERIF, SANS, PHOTOS_CABINET, SectionReveal, TitreSection } from "../shared";
import { clientCity, clientCodePostalVille, clientPhotos, clientText } from "@/lib/templates/clientContent";

// Variables de module lues par toute la page : le contrat les reçoit au rendu.
let sessionData: any = null;
let fd: any = null;
let bp: any = null;
let c: any = null;

const LIEUX = [
  {
    titre: "L'accueil",
    texte: "On vous reçoit à l'heure dite — la salle d'attente sert rarement plus de cinq minutes.",
  },
  {
    titre: "Les salles de réunion",
    texte: "Deux salles closes, isolées phoniquement : ce qui s'y dit n'en sort pas.",
  },
  {
    titre: "Les bureaux des associés",
    texte: "Chaque dossier a un associé référent, et une porte à laquelle frapper.",
  },
];

export default function CabinetPage() {
  const [__session, __setSession] = useState<any>(null);
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
      .then((r) => (r.ok ? r.json() : null))
      .then((s) => s && __setSession(s))
      .catch(() => {});
  }, []);

  sessionData = __session;
  fd = __session?.formData;
  bp = __session?.businessProfile;
  c = __session?.generatedContent;

  const photoVue = (i: number) => fd?.photoUrls?.[i] || clientPhotos(sessionData)[i] || PHOTOS_CABINET[i % PHOTOS_CABINET.length];

  return (
    <div style={{ background: C.bg, color: C.text, minHeight: "60dvh", padding: "clamp(48px,7vh,90px) 5% clamp(80px,10vh,130px)" }}>
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        <SectionReveal>
          <TitreSection surtitre="Le cabinet">{/* TEXTE_SECTION */ clientText(sessionData, "cabinet-page.titre") ?? (<>
            Un lieu fait pour <em style={{ color: C.navy }}>parler librement.</em>
          </>)}</TitreSection>
          <p style={{ fontFamily: SANS, fontSize: 16, lineHeight: 1.8, color: C.textMuted, fontWeight: 300, maxWidth: 640, margin: "-20px 0 60px" }}>{/* TEXTE_SECTION */ clientText(sessionData, "cabinet-page.texte") ?? (<>
            À {clientCity(sessionData) ?? "Paris"}, {clientCodePostalVille(sessionData, "75002", "Paris")} — à cinq minutes du métro, avec une entrée discrète sur cour.
          </>)}</p>
        </SectionReveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px,100%), 1fr))", gap: 26 }}>
          {LIEUX.map((l, i) => (
            <SectionReveal key={l.titre} delay={i * 0.08}>
              <figure style={{ margin: 0, background: C.white, border: `1px solid ${C.border}`, borderRadius: 4, overflow: "hidden", height: "100%", display: "flex", flexDirection: "column" }}>
                <div style={{ aspectRatio: "4/3", overflow: "hidden", background: C.bgAlt }}>
                  <img src={photoVue(i)} alt={l.titre} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
                <figcaption style={{ padding: "24px 24px 28px", flex: 1 }}>
                  <h2 style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 600, margin: "0 0 8px" }}>{l.titre}</h2>
                  <p style={{ fontFamily: SANS, fontSize: 14, lineHeight: 1.75, color: C.textMuted, fontWeight: 300, margin: 0 }}>{l.texte}</p>
                </figcaption>
              </figure>
            </SectionReveal>
          ))}
        </div>

        <SectionReveal delay={0.15}>
          <div style={{ marginTop: 60, background: C.navyDark, color: "rgba(255,255,255,0.85)", borderRadius: 4, padding: "clamp(28px,4vw,48px)", display: "flex", flexWrap: "wrap", gap: "18px 48px", fontFamily: SANS, fontSize: 14, lineHeight: 2 }}>
            <div>
              <div style={{ fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: C.or, fontWeight: 700, marginBottom: 10 }}>Accès</div>
              <div>{clientCodePostalVille(sessionData, "75002", "Paris")}</div>
              <div>Sur rendez-vous, du lundi au vendredi, 9 h – 19 h</div>
            </div>
            <div>
              <div style={{ fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: C.or, fontWeight: 700, marginBottom: 10 }}>À distance</div>
              <div>Visioconférence, signature électronique</div>
              <div>Espace documentaire sécurisé pour vos pièces</div>
            </div>
          </div>
        </SectionReveal>
      </div>
    </div>
  );
}
