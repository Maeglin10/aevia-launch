"use client";
/* ════════════════════════════════════════════════════════════════════════════
   HERO LABS 2 — les gestes que la première passe avait laissés de côté.

   Les dix-huit héros posés avec hero-kit-2 partagent tous la même signature :
   quinze sur dix-huit se dissolvent en flou, dix-sept portent les mêmes
   flèches filaires. Les dix-huit enregistrements d'origine, eux, ont chacun
   leur geste.

   Cette page tient un geste par onglet. Règle : **une signature par thème.**

   Aperçu seulement — rien ici ne part chez un client.
   ════════════════════════════════════════════════════════════════════════════ */

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSlides, DWELL, SlideIndex, HairlineArrows, Retint } from "@/lib/templates/hero-kit-2";
import {
  PortalZoom,
  HardCutRebuild,
  CrossPush,
  MosaicPush,
  TrackingCollapse,
  PanelDrop,
  ScrollGrow,
  DifferentialExit,
  StickyProgress,
  LineScroll,
  FixedRail,
} from "@/lib/templates/hero-kit-3";
import { EASE_3, EASE_4, alpha } from "@/lib/templates/hero-kit";

const U = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&q=80&w=${w}`;

/* ─────────────────────────────────────────────────────────────────────────────
   1 · PortalZoom — chambres d'hôtes / château
   ──────────────────────────────────────────────────────────────────────────── */
const ROOMS = [
  { n: "La Chambre du Levant", d: "Vue sur le verger, cheminée d'origine, 32 m²", img: U("photo-1618773928121-c32242e63f39") },
  { n: "La Suite des Tilleuls", d: "Deux pièces sous charpente, baignoire îlot", img: U("photo-1590490360182-c33d57733427") },
  { n: "Le Pavillon", d: "Indépendant, terrasse privée, accès direct au parc", img: U("photo-1566665797739-1674de7a421a") },
];

function PortalHero() {
  const { i, next, prev } = useSlides(ROOMS.length, DWELL.slow);
  return (
    <section className="lab-hero relative min-h-[620px] overflow-hidden bg-[#0c0a09] text-[#f3ece1]">
      <PortalZoom images={ROOMS.map((r) => r.img)} index={i} overlay={0.42} />
      <div className="relative z-10 h-full flex flex-col justify-between px-6 md:px-14 py-10 pointer-events-none">
        <div className="pointer-events-auto">
          <div style={{ fontFamily: "Georgia, serif", fontSize: 19, letterSpacing: "0.05em" }}>
            Domaine de Fontlaure
          </div>
          <div className="text-[9px] uppercase tracking-[0.4em] opacity-60 mt-1.5">
            Chambres d&apos;hôtes · Luberon
          </div>
        </div>

        <motion.h1
          key={i}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE_3, delay: 0.35 }}
          className="max-w-[14ch] pointer-events-auto"
          style={{ fontFamily: "Georgia, serif", fontSize: "clamp(34px, 5.6vw, 78px)", lineHeight: 1.04 }}
        >
          {ROOMS[i].n}
        </motion.h1>

        <div className="flex flex-wrap items-end justify-between gap-6 pointer-events-auto">
          <div>
            <SlideIndex i={i} total={ROOMS.length} className="text-[11px] opacity-70" />
            <p className="mt-2 text-sm text-white/60 max-w-[52ch]">{ROOMS[i].d}</p>
          </div>
          <HairlineArrows onPrev={prev} onNext={next} color="rgba(255,255,255,0.78)" />
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   2 · HardCutRebuild + FixedRail — salle de sport
   ──────────────────────────────────────────────────────────────────────────── */
const SESSIONS = [
  { ghost: "PLUS", solid: "FORT", img: U("photo-1534438327276-14e5300c3a48"), tint: "#e0620d", note: "Force athlétique · 3 séances par semaine" },
  { ghost: "PLUS", solid: "ENDURANT", img: U("photo-1517836357463-d25dfeac3438"), tint: "#0d7ee0", note: "Cardio & conditionnement · 45 minutes" },
  { ghost: "PLUS", solid: "MOBILE", img: U("photo-1518611012118-696072aa579a"), tint: "#0da06b", note: "Mobilité et prévention · en petit groupe" },
];

function GymHero() {
  const { i, next, prev } = useSlides(SESSIONS.length, DWELL.brisk);
  const s = SESSIONS[i];
  return (
    <section className="lab-hero relative min-h-[620px] overflow-hidden bg-black text-white">
      {/* la photo coupe net : pas de fondu, c'est un montage */}
      <div
        key={i}
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${s.img})` }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-black/70" aria-hidden />

      <FixedRail color={s.tint}>
        <span
          className="text-[11px] font-bold tracking-[0.24em]"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          {String(i + 1).padStart(2, "0")} / {String(SESSIONS.length).padStart(2, "0")}
        </span>
      </FixedRail>

      <div className="relative z-10 h-full flex flex-col justify-center pl-[clamp(56px,7vw,96px)] pr-6 md:pr-14">
        <HardCutRebuild index={i}>
          {[
            <div key="t" style={{ fontStyle: "italic", fontWeight: 900, lineHeight: 0.92, letterSpacing: "-0.02em" }}>
              <div
                style={{
                  fontSize: "clamp(38px, 7vw, 104px)",
                  color: "transparent",
                  WebkitTextStroke: `1.5px ${alpha("#ffffff", 55)}`,
                }}
              >
                {s.ghost}
              </div>
              <div style={{ fontSize: "clamp(38px, 7vw, 104px)", color: s.tint }}>{s.solid}</div>
            </div>,
            <p key="n" className="mt-6 text-sm text-white/55 max-w-[46ch]">
              {s.note}
            </p>,
            <div key="s" className="mt-8 flex gap-8">
              {[["18", "coachs"], ["6", "salles"], ["24/7", "accès"]].map(([v, l]) => (
                <div key={l}>
                  <div className="text-2xl font-black" style={{ color: s.tint }}>{v}</div>
                  <div className="text-[10px] uppercase tracking-[0.24em] text-white/40">{l}</div>
                </div>
              ))}
            </div>,
            <a
              key="c"
              href="#essai"
              className="mt-9 inline-grid place-items-center min-h-[46px] px-9 text-[10px] font-bold uppercase tracking-[0.26em] text-black"
              style={{ background: s.tint }}
            >
              Séance d&apos;essai offerte
            </a>,
          ]}
        </HardCutRebuild>
      </div>
      <HairlineArrows onPrev={prev} onNext={next} color="rgba(255,255,255,0.8)" className="absolute bottom-7 right-7 z-20" />
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   3 · CrossPush + TrackingCollapse — studio de tatouage
   ──────────────────────────────────────────────────────────────────────────── */
const INKS = [
  { w: "FINELINE", img: U("photo-1542727365-19732a80dcfd"), d: "Traits fins, précision millimétrée. Cicatrisation en huit jours." },
  { w: "BLACKWORK", img: U("photo-1611501275019-9b5cda994e8d"), d: "Aplats denses, contrastes francs. Une à trois séances." },
  { w: "BOTANIQUE", img: U("photo-1598257006458-087169a1f08d"), d: "Feuillages et fleurs, dessinés d'après vos photos." },
];

function InkHero() {
  const { i, next, prev } = useSlides(INKS.length, DWELL.normal);
  return (
    <section className="lab-hero relative min-h-[620px] overflow-hidden bg-[#0b0b0d] text-white">
      <CrossPush images={INKS.map((x) => x.img)} index={i} overlay={0.55} />
      <div className="relative z-10 h-full flex flex-col justify-between px-6 md:px-14 py-10">
        <div className="text-[10px] uppercase tracking-[0.45em] opacity-70">Encre Délicate · Bordeaux</div>

        <div>
          <TrackingCollapse
            word={INKS[i].w}
            index={i}
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(34px, 6.4vw, 92px)",
              fontWeight: 400,
            }}
          />
          <motion.p
            key={`p-${i}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE_3, delay: 0.4 }}
            className="mt-5 max-w-[48ch] text-sm text-white/55"
          >
            {INKS[i].d}
          </motion.p>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-6">
          <a
            href="#rdv"
            className="min-h-[46px] px-8 grid place-items-center border border-white/30 text-[10px] uppercase tracking-[0.26em] hover:bg-white hover:text-black transition-colors"
          >
            Prendre rendez-vous
          </a>
          <div className="flex items-center gap-6">
            <SlideIndex i={i} total={INKS.length} className="text-[11px] opacity-70" />
            <HairlineArrows onPrev={prev} onNext={next} color="rgba(255,255,255,0.75)" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   4 · MosaicPush — cabinet dentaire
   ──────────────────────────────────────────────────────────────────────────── */
const CARES = [
  {
    t: "Des soins qui\nne font pas peur",
    k: "Dentisterie générale",
    imgs: [U("photo-1629909613654-28e377c37b09"), U("photo-1588776814546-1ffcf47267a5"), U("photo-1606811841689-23dfddce3e95"), U("photo-1609840114035-3c981b782dfe")],
  },
  {
    t: "Un plan de traitement\nchiffré avant de commencer",
    k: "Implantologie",
    imgs: [U("photo-1588776814546-1ffcf47267a5"), U("photo-1609840114035-3c981b782dfe"), U("photo-1629909613654-28e377c37b09"), U("photo-1606811841689-23dfddce3e95")],
  },
];

function DentalHero() {
  const { i, next, prev } = useSlides(CARES.length, DWELL.normal);
  const c = CARES[i];
  const tile = (src: string) => (
    <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${src})` }} />
  );
  return (
    <section className="lab-hero relative min-h-[620px] overflow-hidden bg-[#eef4f3] text-[#0e2b2a]">
      <div className="h-full grid lg:grid-cols-[1.05fr_1fr]">
        <div className="relative z-10 flex flex-col justify-center px-6 md:px-12 py-16">
          <motion.div
            key={`k-${i}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-[10px] uppercase tracking-[0.4em] text-[#0e2b2a]/45 mb-6"
          >
            {c.k}
          </motion.div>
          <motion.h1
            key={`t-${i}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE_3, delay: 0.15 }}
            className="whitespace-pre-line font-semibold tracking-tight"
            style={{ fontSize: "clamp(30px, 3.6vw, 54px)", lineHeight: 1.08 }}
          >
            {c.t}
          </motion.h1>
          <p className="mt-6 max-w-[48ch] text-[15px] text-[#0e2b2a]/60 leading-relaxed">
            Cabinet du Parc, Rennes. Urgences reçues le jour même, devis remis avant tout acte,
            tiers payant sur les mutuelles partenaires.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-5">
            <a href="#rdv" className="min-h-[46px] px-8 grid place-items-center bg-[#0e2b2a] text-white text-[10px] uppercase tracking-[0.26em]">
              Prendre rendez-vous
            </a>
            <SlideIndex i={i} total={CARES.length} variant="fraction" className="text-[13px] text-[#0e2b2a]/60" />
          </div>
        </div>

        <div className="relative min-h-[36svh] p-3">
          <MosaicPush
            index={i}
            className="h-full w-full"
            style={{
              display: "grid",
              gap: 10,
              gridTemplateColumns: "repeat(3, 1fr)",
              gridTemplateRows: "repeat(3, 1fr)",
            }}
            tiles={[
              { area: { gridColumn: "1 / span 2", gridRow: "1 / span 2" }, node: tile(c.imgs[0]) },
              { area: { gridColumn: "3", gridRow: "1" }, node: tile(c.imgs[1]) },
              { area: { gridColumn: "3", gridRow: "2 / span 2" }, node: tile(c.imgs[2]) },
              { area: { gridColumn: "1 / span 2", gridRow: "3" }, node: tile(c.imgs[3]) },
            ]}
          />
          <HairlineArrows onPrev={prev} onNext={next} color="#0e2b2a" className="absolute bottom-6 right-6 z-10 opacity-70" />
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   5 · PanelDrop — torréfacteur
   ──────────────────────────────────────────────────────────────────────────── */
const COFFEES = [
  { n: "Yirgacheffe", o: "Éthiopie · 1 950 m", d: "Jasmin, bergamote, thé noir. Torréfaction claire, filtre uniquement.", c: "#b07d4a", img: U("photo-1447933601403-0c6688de566e") },
  { n: "Huila", o: "Colombie · 1 700 m", d: "Cacao, noisette, sucre roux. L'équilibre, en filtre comme en espresso.", c: "#7d4f2e", img: U("photo-1495474472287-4d71bcdd2085") },
  { n: "Antigua", o: "Guatemala · 1 500 m", d: "Épices douces, orange confite, corps long. Notre base d'assemblage.", c: "#5c3a24", img: U("photo-1442512595331-e89e73853f31") },
];

function CoffeeHero() {
  const { i, go, next, prev } = useSlides(COFFEES.length, DWELL.normal);
  const c = COFFEES[i];
  return (
    <section className="lab-hero relative min-h-[620px] overflow-hidden bg-[#f3ede5] text-[#241a12]">
      <div className="h-full grid md:grid-cols-2">
        <div className="relative overflow-hidden min-h-[34svh] md:min-h-0">
          <motion.div
            key={i}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${c.img})` }}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, ease: EASE_3 }}
            aria-hidden
          />
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/45 to-transparent" aria-hidden />
          <div className="absolute top-7 left-6 md:left-10 z-10 text-white font-semibold tracking-tight">
            Brûlerie Sainte-Croix
          </div>
        </div>

        <PanelDrop index={i} className="h-full" style={{ background: "#f3ede5" }}>
          <div className="h-full flex flex-col justify-center px-6 md:px-12 py-14">
            <SlideIndex i={i} total={COFFEES.length} variant="fraction" className="text-[15px] mb-7 text-[#241a12]/65" />
            <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(32px, 4.6vw, 64px)", lineHeight: 1.04 }}>
              {c.n}
            </h1>
            <div className="mt-2 text-[10px] uppercase tracking-[0.34em]" style={{ color: c.c }}>
              {c.o}
            </div>
            <p className="mt-6 max-w-[44ch] text-[15px] leading-relaxed text-[#241a12]/60">{c.d}</p>
            <a
              href="#commander"
              className="mt-9 self-start min-h-[46px] px-9 grid place-items-center text-[10px] uppercase tracking-[0.26em] text-white"
              style={{ background: c.c }}
            >
              Commander 250 g
            </a>
            <div className="mt-8 flex gap-3">
              {COFFEES.map((x, n) => (
                <button
                  key={x.n}
                  type="button"
                  onClick={() => go(n)}
                  aria-label={x.n}
                  aria-current={n === i}
                  className="grid place-items-center cursor-pointer"
                  style={{ width: 44, height: 44, background: "none", border: "none", padding: 0 }}
                >
                  <motion.span
                    className="block rounded-full"
                    style={{ background: x.c }}
                    animate={{ width: n === i ? 26 : 16, height: n === i ? 26 : 16, opacity: n === i ? 1 : 0.4 }}
                    transition={{ duration: 0.5, ease: EASE_3 }}
                  />
                </button>
              ))}
            </div>
          </div>
        </PanelDrop>
      </div>
      <HairlineArrows onPrev={prev} onNext={next} vertical color="#241a12" className="absolute bottom-7 right-6 z-20 opacity-60" />
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   6 · LineScroll + Retint — maison de couture
   ──────────────────────────────────────────────────────────────────────────── */
const HOUSE = [
  { lines: ["Le vestiaire", "d'une vie"], k: "Grande mesure", tint: "#231d1a", accent: "#c9a961", img: U("photo-1594938298603-c8148c4dae35") },
  { lines: ["La coupe", "qui vous suit"], k: "Demi-mesure", tint: "#1b2429", accent: "#8fb6c9", img: U("photo-1603394151492-5e9b974b090b") },
  { lines: ["Reprendre", "ce qui existe"], k: "Retouche d'atelier", tint: "#2a2119", accent: "#d9a066", img: U("photo-1490114538077-0a7f8cb49891") },
];

function CoutureHero() {
  const { i, next, prev } = useSlides(HOUSE.length, DWELL.slow);
  const h = HOUSE[i];
  return (
    <section className="lab-hero relative min-h-[620px] overflow-hidden bg-black text-white">
      <div className="h-full grid md:grid-cols-[minmax(300px,32%)_1fr]">
        <Retint color={h.tint} className="relative z-10 flex flex-col justify-between px-7 py-10">
          <div>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 17 }}>Maison Aubrac</div>
            <div className="text-[9px] uppercase tracking-[0.38em] opacity-45 mt-1.5">Tailleur · Paris 8e</div>
          </div>
          <div>
            <motion.div
              key={`k-${i}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="text-[10px] uppercase tracking-[0.32em] mb-6"
              style={{ color: h.accent }}
            >
              {h.k}
            </motion.div>
            <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(30px, 3vw, 50px)", lineHeight: 1.06 }}>
              <LineScroll lines={h.lines} index={i} />
            </h1>
            <p className="mt-6 text-sm text-white/45 max-w-[34ch]">
              Trois essayages, la toile montée avant toute coupe dans le tissu.
            </p>
          </div>
          <div className="flex items-center justify-between gap-4">
            <SlideIndex i={i} total={HOUSE.length} className="text-[11px] opacity-70" />
            <HairlineArrows onPrev={prev} onNext={next} color="rgba(255,255,255,0.75)" />
          </div>
        </Retint>

        <div className="relative min-h-[36svh]">
          <motion.div
            key={i}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${h.img})` }}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: EASE_3 }}
            aria-hidden
          />
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   7 · ScrollGrow + DifferentialExit — club / événementiel de nuit
   ──────────────────────────────────────────────────────────────────────────── */
function ClubHero() {
  return (
    <section className="lab-hero relative min-h-[620px] overflow-hidden bg-[#07060b] text-white">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${U("photo-1533174072545-7a4b6ad7a6c3")})`, opacity: 0.55 }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#07060b] via-transparent to-[#07060b]/70" aria-hidden />
      <div className="relative z-10 h-full grid place-items-center px-6">
        <div className="text-center">
          <DifferentialExit depth={0.15}>
            <div className="text-[10px] uppercase tracking-[0.5em] text-white/50 mb-8">
              Halle Sonore · saison 2026
            </div>
          </DifferentialExit>
          <ScrollGrow from={1} to={1.6}>
            <h1
              style={{
                fontSize: "clamp(46px, 11vw, 168px)",
                fontWeight: 900,
                lineHeight: 0.9,
                letterSpacing: "-0.03em",
                color: "#d6ff3f",
              }}
            >
              NUIT
              <br />
              BLANCHE
            </h1>
          </ScrollGrow>
          <DifferentialExit depth={0.85}>
            <p className="mt-10 text-sm text-white/55 max-w-[46ch] mx-auto">
              Douze heures, quatre salles, deux cents artistes. Billetterie ouverte le 3 mars à midi.
            </p>
            <a
              href="#billets"
              className="mt-8 inline-grid place-items-center min-h-[46px] px-9 text-[10px] font-bold uppercase tracking-[0.26em] text-black"
              style={{ background: "#d6ff3f" }}
            >
              Billetterie
            </a>
          </DifferentialExit>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   8 · StickyProgress — la section d'après, celle qui fait « cher »
   ──────────────────────────────────────────────────────────────────────────── */
const STEPS = [
  { n: "01", title: "Relevé sur place", body: "Une visite, des cotes, des photos. On repart avec l'état réel du support — pas avec un devis type." },
  { n: "02", title: "Plan et chiffrage", body: "Un plan coté, une liste de postes, un prix ferme. Deux allers-retours compris pour ajuster." },
  { n: "03", title: "Chantier", body: "Une date de début, une durée, un interlocuteur unique. Le chantier est nettoyé chaque soir." },
  { n: "04", title: "Réception", body: "On repasse ensemble poste par poste. Ce qui ne va pas est repris avant la facture, pas après." },
];

function ProcessLab() {
  return (
    <section className="lab-hero relative min-h-[620px] overflow-y-auto bg-[#f6f4f1] text-[#1a1a18]">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-16">
        <StickyProgress
          steps={STEPS}
          className="grid md:grid-cols-[0.85fr_1.15fr] gap-10"
          renderTitle={(active) => (
            <div>
              <div className="text-[10px] uppercase tracking-[0.4em] text-[#1a1a18]/40 mb-5">Notre méthode</div>
              <h2
                style={{ fontFamily: "Georgia, serif", fontSize: "clamp(30px, 4vw, 58px)", lineHeight: 1.04 }}
              >
                Quatre étapes,
                <br />
                <span className="italic opacity-55">et rien entre les lignes.</span>
              </h2>
              <div className="mt-8 flex gap-2">
                {STEPS.map((s, n) => (
                  <motion.span
                    key={s.n}
                    className="block h-[2px]"
                    animate={{ width: n === active ? 44 : 18, opacity: n === active ? 1 : 0.25 }}
                    transition={{ duration: 0.45, ease: EASE_3 }}
                    style={{ background: "#1a1a18" }}
                  />
                ))}
              </div>
            </div>
          )}
        />
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Le sélecteur
   ──────────────────────────────────────────────────────────────────────────── */
const LABS = [
  { id: "portal", label: "Chambres d'hôtes", from: "v18 Portal effect", Comp: PortalHero,
    note: "PortalZoom — on traverse l'arche : la slide suivante est déjà visible au travers, le masque s'ouvre en grand" },
  { id: "gym", label: "Salle de sport", from: "v16 Fitness gym", Comp: GymHero,
    note: "HardCutRebuild + FixedRail — la photo coupe net, un temps sans texte, puis tout se reconstruit en décalé" },
  { id: "ink", label: "Tatouage", from: "v07 Old Soul + v12 Hair salon", Comp: InkHero,
    note: "CrossPush + TrackingCollapse — les deux photos se croisent ; le mot s'écarte en se floutant puis se resserre" },
  { id: "dental", label: "Cabinet dentaire", from: "v10 Dental clinic", Comp: DentalHero,
    note: "MosaicPush — la mosaïque sort par la droite tuile par tuile, la suivante entre par la gauche" },
  { id: "coffee", label: "Torréfacteur", from: "v02 Coffee split screen", Comp: CoffeeHero,
    note: "PanelDrop — le panneau descend comme un rideau, contenu compris ; pastilles teintées par café" },
  { id: "couture", label: "Maison de couture", from: "v13 Suits showcase", Comp: CoutureHero,
    note: "LineScroll + Retint — les lignes défilent d'un bord à l'autre sous masque, le panneau se reteinte" },
  { id: "club", label: "Club / nuit", from: "v05 DJ scroll video + v04 Sketch", Comp: ClubHero,
    note: "ScrollGrow + DifferentialExit — le titre grandit au défilement, les plans partent à trois vitesses" },
  { id: "process", label: "Méthode (section)", from: "v03 SHFT", Comp: ProcessLab,
    note: "StickyProgress — titre collé, liste qui se révèle pas à pas. Pas un héros : la section d'après" },
];

export default function HeroLabs2() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const read = () => {
      const n = LABS.findIndex((l) => l.id === window.location.hash.slice(1));
      if (n >= 0) setActive(n);
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);

  const L = LABS[active];
  const Comp = L.Comp;
  return (
    <main className="bg-[#0b0b0c] min-h-dvh">
      <style>{`
        #aevia-webchat-widget{display:none!important}
        .lab-hero{height:100svh}
        @media (min-width:768px){.lab-hero{height:calc(100svh - 92px)}}
      `}</style>

      <header className="relative md:sticky md:top-0 z-50 bg-[#0b0b0c]/95 backdrop-blur border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-5 py-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-white/35 text-[10px] uppercase tracking-[0.3em] mr-3">Hero labs 2</span>
            {LABS.map((l, n) => (
              <button
                key={l.id}
                type="button"
                onClick={() => {
                  setActive(n);
                  window.history.replaceState(null, "", `#${l.id}`);
                }}
                className="min-h-[36px] px-3.5 text-[12px] rounded-full border transition-colors cursor-pointer"
                style={{
                  borderColor: n === active ? "#fff" : "rgba(255,255,255,0.18)",
                  color: n === active ? "#0b0b0c" : "rgba(255,255,255,0.6)",
                  background: n === active ? "#fff" : "transparent",
                }}
              >
                {l.label}
              </button>
            ))}
          </div>
          <p className="mt-2.5 text-[12px] text-white/40 leading-relaxed">
            d&apos;après {L.from} — {L.note}
          </p>
        </div>
      </header>

      <motion.div key={L.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, ease: EASE_4 }}>
        <Comp />
      </motion.div>
    </main>
  );
}
