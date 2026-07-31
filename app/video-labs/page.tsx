"use client";
/* ════════════════════════════════════════════════════════════════════════════
   VIDEO LABS — un sample par enregistrement Slider Revolution.

   /hero-labs et /hero-labs-2 mélangent les mécaniques : un même sample en
   utilise trois ou quatre. Résultat, on ne voit pas *ce que fait* chaque
   enregistrement, et la documentation qui en découle produit des thèmes qui
   se ressemblent.

   Ici, un onglet = un enregistrement = un geste, montré seul, sur un métier
   plausible. C'est la référence à citer quand on documente « comment on fait
   celui-là ».

   Aperçu seulement — rien ici ne part chez un client.
   ════════════════════════════════════════════════════════════════════════════ */

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSlides, DWELL, SlideIndex, HairlineArrows, AnchoredBackdrop, BlurThrough, BentoCascade, Retint, WordFlight, ExpandFrame, LineMask } from "@/lib/templates/hero-kit-2";
import {
  ComposeIn, WipeReveal, DriftShadow, ArcSwap, PushBlur, ScrollSpin, DifferentialExit,
  PanelDrop, PanelRise, ScrollGrow, ParticleOrb, CrossPush, MosaicPush,
  TrackingCollapse, LineScroll, InvertSweep, HardCutRebuild, FixedRail, PortalZoom, StickyProgress,
} from "@/lib/templates/hero-kit-3";
import { EASE_3, EASE_4, alpha } from "@/lib/templates/hero-kit";

const U = (id: string, w = 1400) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&q=85&w=${w}`;

/** Cadrage portrait, pour un produit qui doit tenir debout dans une colonne. */
const UP = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&q=85&w=620&h=1240`;

/* ─────────────────────────────────────────────────────────────────────────────
   v15 · food-presentation-template-slider — ComposeIn

   Ce que fait l'enregistrement, image par image :
   1. la scène reste vide 1,5 s — juste une surface et une ombre qui dérive
   2. le titre se dévoile de gauche à droite
   3. la ligne manuscrite apparaît dessous
   4. une carte de texte entre par la gauche
   5. un aplat de couleur entre par la droite
   6. la photographie du produit arrive en dernier, par la droite

   Le vide initial est le sujet. Sans lui, l'arrivée n'est qu'un chargement.
   ──────────────────────────────────────────────────────────────────────────── */
const DESSERTS = [
  {
    name: "Panna cotta",
    script: "vanille de Madagascar & fraises",
    price: "6,50 €",
    body:
      "Crème entière d'Isigny infusée douze heures, gélifiée à l'agar plutôt qu'à la gélatine. " +
      "Fraises de Carpentras coupées le matin même. Servie en pot de verre consigné.",
    tint: "#b8323f",
    img: U("photo-1488477181946-6428a0291777"),
  },
  {
    name: "Tarte citron",
    script: "meringue à l'italienne, citron de Menton",
    price: "5,80 €",
    body:
      "Pâte sablée cuite à blanc, crème au citron montée au beurre froid, meringue " +
      "brûlée au chalumeau à la commande. Le fond reste croustillant jusqu'au soir.",
    tint: "#c9962c",
    img: U("photo-1519915028121-7d3463d20b13"),
  },
  {
    name: "Opéra",
    script: "biscuit joconde, café, ganache noire",
    price: "6,20 €",
    body:
      "Sept couches montées à la main, café de Colombie infusé à froid, ganache à 70 %. " +
      "La recette de la maison depuis 1978, sans une virgule de changement.",
    tint: "#5c3a22",
    img: U("photo-1571115177098-24ec42ed204d"),
  },
];

function FoodLab() {
  const { i, next, prev } = useSlides(DESSERTS.length, DWELL.slow);
  const d = DESSERTS[i];

  return (
    <section className="lab-hero relative min-h-[640px] overflow-hidden" style={{ background: "#efece7" }}>
      {/* la scène : une surface, et l'ombre qui la traverse lentement */}
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${U("photo-1604147706283-d7119b5b822c", 1800)})`, opacity: 0.85 }}
      />
      <DriftShadow seconds={28} opacity={0.13} />

      <div className="relative z-10 h-full max-w-[1240px] mx-auto px-6 md:px-12 pb-24 md:pb-16 grid md:grid-cols-[1.05fr_0.95fr] items-center gap-4 md:gap-8 content-center">
        <ComposeIn
          index={i}
          hold={1.35}
          beat={0.17}
          className="relative"
          items={[
            {
              from: "none",
              node: (
                <WipeReveal index={i} delay={0} duration={1.05}>
                  <h1
                    style={{
                      fontFamily: "Georgia, serif",
                      fontSize: "clamp(38px, 6.4vw, 92px)",
                      lineHeight: 1.02,
                      color: "#1d1a16",
                      fontWeight: 400,
                    }}
                  >
                    {d.name}
                  </h1>
                </WipeReveal>
              ),
            },
            {
              from: "none",
              style: { marginTop: 10 },
              node: (
                <p
                  style={{
                    fontFamily: "Georgia, serif",
                    fontStyle: "italic",
                    fontSize: "clamp(15px, 1.5vw, 21px)",
                    color: "#1d1a16",
                    opacity: 0.55,
                  }}
                >
                  {d.script}
                </p>
              ),
            },
            {
              from: "left",
              style: { marginTop: 22, maxWidth: 420 },
              node: (
                <div
                  style={{
                    background: "#fbfaf8",
                    padding: "22px 24px",
                    boxShadow: "0 22px 50px rgba(29,26,22,0.10)",
                  }}
                >
                  <p style={{ fontSize: 14, lineHeight: 1.75, color: "rgba(29,26,22,0.62)" }}>{d.body}</p>
                  <div
                    style={{
                      marginTop: 18,
                      paddingTop: 14,
                      borderTop: "1px solid rgba(29,26,22,0.10)",
                      display: "flex",
                      alignItems: "baseline",
                      justifyContent: "space-between",
                      gap: 12,
                    }}
                  >
                    <span style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(29,26,22,0.4)" }}>
                      À la part
                    </span>
                    <span style={{ fontFamily: "Georgia, serif", fontSize: 22, color: "#1d1a16" }}>{d.price}</span>
                  </div>
                </div>
              ),
            },
            {
              from: "bottom",
              style: { marginTop: 20 },
              node: (
                <a
                  href="#carte"
                  className="inline-grid place-items-center min-h-[46px] px-9 text-[10px] uppercase tracking-[0.28em] text-white transition-opacity hover:opacity-90"
                  style={{ background: d.tint }}
                >
                  Voir la carte
                </a>
              ),
            },
          ]}
        />

        <div className="relative grid place-items-center order-first md:order-none h-[30svh] md:h-full">
          <ComposeIn
            index={i}
            hold={1.35}
            beat={0.17}
            className="relative w-full grid place-items-center"
            items={[
              {
                from: "right",
                style: {
                  position: "absolute",
                  right: "6%",
                  width: "min(46%, 210px)",
                  height: "min(70%, 320px)",
                },
                node: <div style={{ background: d.tint, width: "100%", height: "100%" }} />,
              },
              {
                from: "right",
                style: { position: "relative", width: "min(62vw, 400px)", aspectRatio: "1 / 1" },
                node: (
                  <div
                    role="img"
                    aria-label={d.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      backgroundImage: `url(${d.img})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      boxShadow: "0 40px 90px rgba(29,26,22,0.28)",
                    }}
                  />
                ),
              },
            ]}
          />
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-20 px-6 md:px-12 pb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-[10px] uppercase tracking-[0.4em]" style={{ color: "rgba(29,26,22,0.42)" }}>
            Maison Verdier · pâtisserie · Aix-en-Provence
          </div>
          <SlideIndex i={i} total={DESSERTS.length} className="mt-2 text-[11px]" color="rgba(29,26,22,0.6)" />
        </div>
        <HairlineArrows onPrev={prev} onNext={next} color="rgba(29,26,22,0.55)" />
      </div>
    </section>
  );
}


/* ─────────────────────────────────────────────────────────────────────────────
   v01 · oakgrove-wine-slider-template — ArcSwap

   Ce que la première lecture avait manqué : la bouteille ne monte ni ne
   descend, **elle balance**. Sur 2,4 s à 8 im/s on voit l'arc entier — bascule
   vers la droite jusqu'à près de soixante degrés, sortie par la droite, la
   suivante entre par la gauche couchée puis se redresse. Le pied reste presque
   immobile, le col décrit l'arc.
   ──────────────────────────────────────────────────────────────────────────── */
const CUVEES = [
  { name: "CLOS MERIDIEN", place: "Côte-Rôtie", grape: "Syrah", year: "2019", bottle: UP("photo-1545608508-78f351665a1c"), bg: U("photo-1506377247377-2a5b3b417ebb") },
  { name: "PIERRE BLANCHE", place: "Meursault", grape: "Chardonnay", year: "2021", bottle: UP("photo-1598866971869-22782ffd918e"), bg: U("photo-1474722883778-792e7990302f") },
  { name: "TERRE ROUGE", place: "Gigondas", grape: "Grenache", year: "2018", bottle: UP("photo-1714377676631-bef738815d62"), bg: U("photo-1510812431401-41d2bd2722f3") },
];

const arcWord: React.CSSProperties = {
  fontFamily: "Georgia, serif",
  fontSize: "clamp(22px, 4.6vw, 66px)",
  letterSpacing: "clamp(0.08em, 0.26vw, 0.26em)",
  fontWeight: 400,
  whiteSpace: "nowrap",
  lineHeight: 1.1,
};

function WineArcLab() {
  const { i, next, prev } = useSlides(CUVEES.length, DWELL.slow);
  const c = CUVEES[i];
  return (
    <section className="lab-hero relative min-h-[620px] overflow-hidden bg-[#0d0a08] text-[#f0e9dd]">
      <AnchoredBackdrop images={CUVEES.map((x) => x.bg)} index={i} overlay={0.78} blur={3} />
      <div className="relative z-10 h-full flex flex-col">
        <div className="pt-9 text-center">
          <div className="text-[15px] tracking-[0.22em]" style={{ fontFamily: "Georgia, serif" }}>
            Cave Saint-Anselme
          </div>
        </div>

        <div className="relative flex-1 grid place-items-center">
          <div className="absolute inset-x-0 px-4" style={{ zIndex: 3 }}>
            <BlurThrough index={i} amount={10}>
              <h1 className="wine-split">
                <span style={{ ...arcWord, justifySelf: "end", paddingRight: "clamp(0px,1.6vw,26px)" }}>
                  {c.name.split(" ")[0]}
                </span>
                <span aria-hidden />
                <span style={{ ...arcWord, justifySelf: "start", paddingLeft: "clamp(0px,1.6vw,26px)" }}>
                  {c.name.split(" ").slice(1).join(" ")}
                </span>
              </h1>
            </BlurThrough>
          </div>

          {/* le balancier : rotation autour du pied, pas une translation */}
          <div
            aria-hidden
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              bottom: "10%",
              width: "clamp(150px, 18vw, 260px)",
              height: 22,
              borderRadius: "50%",
              background: "radial-gradient(ellipse at center, rgba(0,0,0,0.55), transparent 72%)",
            }}
          />
          <div className="absolute left-1/2 -translate-x-1/2" style={{ zIndex: 2, bottom: "11%" }}>
            <ArcSwap index={i} sweep={52} hold={0.42}>
              <div
                role="img"
                aria-label={`${c.name} ${c.year}`}
                style={{
                  width: "clamp(126px, 15vw, 226px)",
                  height: "clamp(290px, 50vh, 480px)",
                  backgroundImage: `url(${c.bottle})`,
                  backgroundSize: "contain",
                  backgroundPosition: "center bottom",
                  backgroundRepeat: "no-repeat",
                  WebkitMaskImage:
                    "radial-gradient(ellipse 60% 64% at 50% 52%, #000 46%, rgba(0,0,0,0.5) 74%, transparent 94%)",
                  maskImage:
                    "radial-gradient(ellipse 60% 64% at 50% 52%, #000 46%, rgba(0,0,0,0.5) 74%, transparent 94%)",
                  filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.7))",
                }}
              />
            </ArcSwap>
          </div>
        </div>

        <div className="pb-8 px-5 md:px-12 flex flex-wrap items-end justify-between gap-x-3 gap-y-4">
          <div>
            <SlideIndex i={i} total={CUVEES.length} className="text-[11px] opacity-70" />
            <div className="mt-2 text-[11px] opacity-55 whitespace-nowrap" style={{ fontFamily: "Georgia, serif" }}>
              {c.place} · {c.grape} · {c.year}
            </div>
          </div>
          <HairlineArrows onPrev={prev} onNext={next} color="rgba(240,233,221,0.7)" className="ml-auto shrink-0" />
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   v17 · smart-living-one-pager-v3 — PushBlur

   Correction : ce template ne dissout pas son fond derrière un titre fixe.
   Toute la composition part sur le côté, photographie et titre ensemble, avec
   un flou directionnel — sur deux images consécutives on lit deux fois le
   titre, l'un qui sort à droite, l'autre qui entre par la gauche.
   ──────────────────────────────────────────────────────────────────────────── */
const PROGRAMMES = [
  { t: "Les Jardins\nde Meyrargues", k: "Promotion neuve", d: "34 logements du T2 au T4, livraison T3 2027. Vue Sainte-Victoire depuis le troisième étage.", img: U("photo-1545324418-cc1a3fa10c00") },
  { t: "Carré\nSaint-Jean", k: "Réhabilitation", d: "Un hôtel particulier du XVIIIe divisé en neuf appartements. Pierre et parquets d'origine conservés.", img: U("photo-1512917774080-9991f1c4c750") },
  { t: "Le Belvédère\ndes Aygalades", k: "Livré 2025", d: "22 maisons de ville avec jardin privatif. Dernier lot disponible, exposition plein sud.", img: U("photo-1449844908441-8829872d2607") },
];

function PropertyLab() {
  const { i, next, prev } = useSlides(PROGRAMMES.length, DWELL.normal);
  return (
    <section className="lab-hero relative min-h-[620px] overflow-hidden bg-black text-white">
      <PushBlur index={i} amount={16} className="absolute inset-0" style={{ position: "absolute" }}>
        <div className="relative h-full w-full">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${PROGRAMMES[i].img})` }}
            aria-hidden
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, transparent 52%)" }}
            aria-hidden
          />
          <div className="absolute inset-x-0 bottom-0 px-6 md:px-14 pb-28 md:pb-24">
            <div className="text-[10px] uppercase tracking-[0.42em] opacity-65 mb-5">
              {PROGRAMMES[i].k}
            </div>
            <h1
              className="whitespace-pre-line max-w-[16ch]"
              style={{ fontFamily: "Georgia, serif", fontSize: "clamp(32px, 5.4vw, 76px)", lineHeight: 1.03 }}
            >
              {PROGRAMMES[i].t}
            </h1>
            <p className="mt-5 max-w-[54ch] text-sm text-white/60 leading-relaxed">{PROGRAMMES[i].d}</p>
          </div>
        </div>
      </PushBlur>

      <div className="absolute inset-x-0 top-0 z-20 px-6 md:px-14 pt-9 flex items-start justify-between gap-6">
        <div>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 18 }}>Aygalades Promotion</div>
          <div className="text-[9px] uppercase tracking-[0.4em] opacity-55 mt-1.5">Aix-en-Provence</div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-20 px-6 md:px-14 pb-8 flex flex-wrap items-end justify-between gap-4">
        <SlideIndex i={i} total={PROGRAMMES.length} className="text-[11px] opacity-75" />
        <HairlineArrows onPrev={prev} onNext={next} color="rgba(255,255,255,0.8)" />
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   v04 · from-sketch-to-product-slider — ScrollSpin + DifferentialExit

   Le produit tourne pendant qu'on défile — sur l'enregistrement la chaussure
   passe de la pointe à droite à presque horizontale sur la longueur du héros.
   Ce n'est pas une boucle automatique : c'est le défilement qui l'entraîne.
   Et les trois plans — numéro, titre, produit — partent à des vitesses
   différentes.
   ──────────────────────────────────────────────────────────────────────────── */
function ProductLab() {
  return (
    <section className="lab-hero relative min-h-[620px] overflow-hidden bg-[#0a0a0c] text-white">
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${U("photo-1441986300917-64674bd600d8")})`, opacity: 0.22, filter: "blur(3px)" }}
      />
      <div className="relative z-10 h-full max-w-[1240px] mx-auto px-6 md:px-12 grid md:grid-cols-2 items-center gap-8">
        <div>
          <DifferentialExit depth={0.1}>
            <div className="text-[10px] uppercase tracking-[0.45em] text-white/45 mb-6">
              Atelier Vaury · maroquinerie · Millau
            </div>
          </DifferentialExit>
          <DifferentialExit depth={0.55}>
            <h1
              style={{
                fontSize: "clamp(40px, 6.6vw, 96px)",
                fontWeight: 900,
                lineHeight: 0.94,
                letterSpacing: "-0.03em",
                color: "#d94f8a",
              }}
            >
              COUSU
              <br />
              MAIN
            </h1>
          </DifferentialExit>
          <DifferentialExit depth={0.9}>
            <p className="mt-7 max-w-[44ch] text-sm text-white/55 leading-relaxed">
              Point sellier, fil de lin ciré, tranches teintées à la main. Chaque pièce porte
              le numéro de son artisan et l&apos;année de fabrication.
            </p>
            <a
              href="#atelier"
              className="mt-8 inline-grid place-items-center min-h-[46px] px-9 text-[10px] font-bold uppercase tracking-[0.26em] text-black"
              style={{ background: "#d94f8a" }}
            >
              Visiter l&apos;atelier
            </a>
          </DifferentialExit>
        </div>

        <div className="relative grid place-items-center h-[34svh] md:h-full">
          <ScrollSpin degrees={38}>
            <div
              role="img"
              aria-label="Sac cousu main"
              style={{
                width: "min(64vw, 420px)",
                aspectRatio: "1 / 1",
                backgroundImage: `url(${U("photo-1590874103328-eac38a683ce7")})`,
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                WebkitMaskImage:
                  "radial-gradient(ellipse 62% 62% at 50% 50%, #000 50%, rgba(0,0,0,0.45) 76%, transparent 95%)",
                maskImage:
                  "radial-gradient(ellipse 62% 62% at 50% 50%, #000 50%, rgba(0,0,0,0.45) 76%, transparent 95%)",
                filter: "drop-shadow(0 40px 70px rgba(0,0,0,0.6))",
              }}
            />
          </ScrollSpin>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   v02 · coffee-shop-split-screen-slider — PanelDrop
   Le panneau descend comme un rideau, contenu compris. Ici sur une fromagerie :
   le geste n'appartient pas au café.
   ──────────────────────────────────────────────────────────────────────────── */
const FROMAGES = [
  { n: "Comté 30 mois", o: "Jura · fruitière de Chapelle-d'Huin", d: "Croûte brossée à la main, cristaux de tyrosine, finale de noisette grillée. Coupé à la demande.", c: "#c08a2e", img: U("photo-1452195100486-9cc805987862") },
  { n: "Saint-Nectaire fermier", o: "Puy-de-Dôme · 1 050 m", d: "Affiné huit semaines sur paille de seigle. Pâte souple, goût de cave et de champignon frais.", c: "#7d6134", img: U("photo-1486297678162-eb2a19b0a32d") },
  { n: "Bleu de Termignon", o: "Savoie · quatre producteurs", d: "Le bleu qui ne s'ensemence pas : la moisissure vient de la cave. Deux cents meules par an, pas une de plus.", c: "#3d5a7d", img: U("photo-1559561853-08451507cbe7") },
];

function CheeseLab() {
  const { i, go, next, prev } = useSlides(FROMAGES.length, DWELL.normal);
  const f = FROMAGES[i];
  return (
    <section className="lab-hero relative min-h-[620px] overflow-hidden bg-[#f4f0e8] text-[#241d14]">
      <div className="h-full grid md:grid-cols-2">
        <div className="relative overflow-hidden min-h-[32svh] md:min-h-0">
          <motion.div
            key={i}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${f.img})` }}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, ease: EASE_3 }}
            aria-hidden
          />
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/45 to-transparent" aria-hidden />
          <div className="absolute top-7 left-6 md:left-10 z-10 text-white font-semibold tracking-tight">
            Crèmerie du Pont-Vieux
          </div>
        </div>

        <PanelDrop index={i} className="h-full" style={{ background: "#f4f0e8" }}>
          <div className="h-full flex flex-col justify-center px-6 md:px-12 py-12">
            <SlideIndex i={i} total={FROMAGES.length} variant="fraction" className="text-[15px] mb-6 text-[#241d14]/65" />
            <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(28px, 4.2vw, 58px)", lineHeight: 1.04 }}>{f.n}</h1>
            <div className="mt-2 text-[10px] uppercase tracking-[0.32em]" style={{ color: f.c }}>{f.o}</div>
            <p className="mt-5 max-w-[44ch] text-[15px] leading-relaxed text-[#241d14]/60">{f.d}</p>
            <a href="#plateau" className="mt-8 self-start min-h-[46px] px-9 grid place-items-center text-[10px] uppercase tracking-[0.26em] text-white" style={{ background: f.c }}>
              Composer un plateau
            </a>
            <div className="mt-7 flex gap-3">
              {FROMAGES.map((x, n) => (
                <button key={x.n} type="button" onClick={() => go(n)} aria-label={x.n} aria-current={n === i}
                  className="grid place-items-center cursor-pointer" style={{ width: 44, height: 44, background: "none", border: "none", padding: 0 }}>
                  <motion.span className="block rounded-full" style={{ background: x.c }}
                    animate={{ width: n === i ? 24 : 15, height: n === i ? 24 : 15, opacity: n === i ? 1 : 0.4 }}
                    transition={{ duration: 0.5, ease: EASE_3 }} />
                </button>
              ))}
            </div>
          </div>
        </PanelDrop>
      </div>
      <HairlineArrows onPrev={prev} onNext={next} vertical color="#241d14" className="absolute bottom-6 right-6 z-20 opacity-55" />
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   v03 · shft-interior-design — PanelRise
   Le titre reste fixe, la section suivante monte par-dessus au défilement.
   Ici sur un ébéniste.
   ──────────────────────────────────────────────────────────────────────────── */
function WoodLab() {
  return (
    <section className="lab-hero relative min-h-[620px] overflow-y-auto bg-[#17130f] text-[#f0e9de]">
      <div className="relative" style={{ height: "76vh" }}>
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${U("photo-1497219055242-93359eeed651")})`, opacity: 0.6 }} aria-hidden />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #17130f 0%, transparent 60%)" }} aria-hidden />
        <div className="relative z-10 h-full max-w-[1200px] mx-auto px-6 md:px-12 flex flex-col justify-center">
          <div className="text-[10px] uppercase tracking-[0.44em] opacity-60 mb-6">Atelier Rouvière · ébénisterie · Sarlat</div>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(36px, 6vw, 88px)", lineHeight: 1.02 }}>
            On ne dessine pas
            <br />
            <span style={{ marginLeft: "1.4em", fontStyle: "italic", opacity: 0.72 }}>un meuble.</span>
          </h1>
          <p className="mt-7 max-w-[52ch] text-sm text-white/50 leading-relaxed">
            On regarde d&apos;abord la pièce, la lumière, et ce que la personne y fait tous les jours.
            Le dessin vient après, et il change encore trois fois.
          </p>
        </div>
      </div>

      <PanelRise style={{ background: "#f0e9de", color: "#17130f" }}>
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-16">
          <div className="text-[10px] uppercase tracking-[0.4em] opacity-45 mb-5">Ce qui sort de l&apos;atelier</div>
          <div className="grid md:grid-cols-3 gap-px" style={{ background: "rgba(23,19,15,0.12)" }}>
            {[
              ["Table de ferme", "Noyer massif, 3,20 m, piètement à tenon-mortaise"],
              ["Bibliothèque murale", "Chêne clair, 5,80 m, échelle coulissante en frêne"],
              ["Escalier tournant", "Limon crémaillère, quinze marches, calcul de Blondel"],
            ].map(([t, d]) => (
              <div key={t} style={{ background: "#f0e9de", padding: "26px 24px" }}>
                <h3 style={{ fontFamily: "Georgia, serif", fontSize: 20, marginBottom: 8 }}>{t}</h3>
                <p className="text-sm opacity-55 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </PanelRise>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   v05 · dj-website-with-scroll-video — ScrollGrow
   Le titre grandit au défilement. Ici sur une salle de concert classique :
   le geste ne tient pas à la musique électronique.
   ──────────────────────────────────────────────────────────────────────────── */
function ConcertLab() {
  return (
    <section className="lab-hero relative min-h-[620px] overflow-hidden bg-[#0b0d14] text-white">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${U("photo-1465847899084-d164df4dedc6")})`, opacity: 0.42 }} aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d14] via-transparent to-[#0b0d14]/75" aria-hidden />
      <div className="relative z-10 h-full grid place-items-center px-6">
        <div className="text-center">
          <DifferentialExit depth={0.15}>
            <div className="text-[10px] uppercase tracking-[0.5em] text-white/50 mb-8">Auditorium Sainte-Cécile · saison 2026-2027</div>
          </DifferentialExit>
          <ScrollGrow from={1} to={1.5}>
            <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(42px, 9vw, 138px)", lineHeight: 0.94, letterSpacing: "-0.01em" }}>
              Vingt-deux
              <br />
              <span style={{ fontStyle: "italic", color: "#d4a24a" }}>soirées</span>
            </h1>
          </ScrollGrow>
          <DifferentialExit depth={0.85}>
            <p className="mt-9 text-sm text-white/55 max-w-[48ch] mx-auto leading-relaxed">
              De Purcell à Dutilleux, dans une salle de 640 places où le dernier rang entend
              la respiration des musiciens. Abonnement ouvert le 3 mars.
            </p>
            <a href="#abonnement" className="mt-8 inline-grid place-items-center min-h-[46px] px-9 text-[10px] font-bold uppercase tracking-[0.26em] text-[#0b0d14]" style={{ background: "#d4a24a" }}>
              S&apos;abonner
            </a>
          </DifferentialExit>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   v06 · wordpress-hero-image — ParticleOrb
   Une sphère de poussière qui tourne derrière le titre. Un héros sans
   photographie qui ne soit pas une page vide. Ici sur une maison d'édition.
   ──────────────────────────────────────────────────────────────────────────── */
function EditionLab() {
  return (
    <section className="lab-hero relative min-h-[620px] overflow-hidden bg-[#08070a] text-[#efe7d6]">
      <ParticleOrb count={720} color="#d9b45e" seconds={44} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.85 }} />
      <div className="relative z-10 h-full max-w-[1180px] mx-auto px-6 md:px-12 grid md:grid-cols-[1fr_0.8fr] items-center gap-10">
        <div>
          <div className="text-[10px] uppercase tracking-[0.46em] opacity-55 mb-7">Éditions du Fil · Arles</div>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(38px, 5.6vw, 84px)", lineHeight: 1.04 }}>
            Matière
            <br />
            <span style={{ fontStyle: "italic", opacity: 0.65 }}>du sens</span>
          </h1>
          <p className="mt-7 max-w-[46ch] text-sm text-white/45 leading-relaxed">
            Douze titres par an, tirés à mille exemplaires, cousus et non collés. Poésie
            contemporaine, essais brefs, et deux traductions du portugais chaque printemps.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <a href="#catalogue" className="min-h-[46px] px-8 grid place-items-center text-[10px] uppercase tracking-[0.26em] text-[#08070a]" style={{ background: "#d9b45e" }}>
              Le catalogue
            </a>
            <a href="#manuscrits" className="min-h-[46px] px-8 grid place-items-center border border-white/25 text-[10px] uppercase tracking-[0.26em] hover:bg-white/10 transition-colors">
              Envoyer un manuscrit
            </a>
          </div>
        </div>
        <div className="hidden md:block" />
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   v07 · old-soul-tattoo-studio — CrossPush
   Les deux photographies se croisent, visibles ensemble un instant.
   Ici sur une école de danse.
   ──────────────────────────────────────────────────────────────────────────── */
const COURS_DANSE = [
  { t: "Classique", d: "Barre, milieu, variations. Du premier cours à l'examen de fin de cycle.", img: U("photo-1518834107812-67b0b7c58434") },
  { t: "Contemporain", d: "Travail au sol, poids du corps, improvisation dirigée. À partir de douze ans.", img: U("photo-1541904845547-0eaf866de232") },
  { t: "Hip-hop", d: "Popping, house, break. Trois niveaux, et un plateau chaque juin au théâtre municipal.", img: U("photo-1547153760-18fc86324498") },
];

function DanceLab() {
  const { i, next, prev } = useSlides(COURS_DANSE.length, DWELL.normal);
  return (
    <section className="lab-hero relative min-h-[620px] overflow-hidden bg-[#0c0a10] text-white">
      <CrossPush images={COURS_DANSE.map((x) => x.img)} index={i} overlay={0.52} />
      <div className="relative z-10 h-full flex flex-col justify-between px-6 md:px-14 py-10">
        <div className="text-[10px] uppercase tracking-[0.44em] opacity-70">Studio Pas de Deux · Nancy</div>
        <div>
          <motion.h1
            key={`t-${i}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: EASE_3, delay: 0.32 }}
            style={{ fontFamily: "Georgia, serif", fontSize: "clamp(38px, 6.6vw, 96px)", lineHeight: 1.02 }}
          >
            {COURS_DANSE[i].t}
          </motion.h1>
          <motion.p
            key={`p-${i}`}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE_3, delay: 0.46 }}
            className="mt-5 max-w-[50ch] text-sm text-white/60"
          >
            {COURS_DANSE[i].d}
          </motion.p>
        </div>
        <div className="flex flex-wrap items-end justify-between gap-5">
          <a href="#essai" className="min-h-[46px] px-8 grid place-items-center border border-white/30 text-[10px] uppercase tracking-[0.26em] hover:bg-white hover:text-black transition-colors">
            Cours d&apos;essai gratuit
          </a>
          <div className="flex items-center gap-6">
            <SlideIndex i={i} total={COURS_DANSE.length} className="text-[11px] opacity-70" />
            <HairlineArrows onPrev={prev} onNext={next} color="rgba(255,255,255,0.78)" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   v08 · justice-row-law-firm-slider — WordFlight + ExpandFrame
   Le titre s'assemble mot par mot pendant que la photo s'ouvre depuis un petit
   rectangle ; les deux atterrissent ensemble. Ici sur un notaire.
   ──────────────────────────────────────────────────────────────────────────── */
const ACTES = [
  { t: "Une vente se prépare avant le compromis", k: "Immobilier", img: U("photo-1560518883-ce09059eeffa") },
  { t: "La succession que personne ne veut ouvrir", k: "Famille", img: U("photo-1450101499163-c8848c66ca85") },
  { t: "Transmettre une entreprise sans la casser", k: "Entreprise", img: U("photo-1521737604893-d14cc237f11d") },
];

function NotaireLab() {
  const { i, next, prev } = useSlides(ACTES.length, DWELL.normal);
  const a = ACTES[i];
  return (
    <section className="lab-hero relative min-h-[620px] bg-[#141a17] text-white overflow-hidden">
      <div className="h-full grid lg:grid-cols-[1.05fr_1fr]">
        <div className="relative z-10 flex flex-col justify-center px-6 md:px-14 py-16">
          <motion.div key={`k-${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
            className="text-[10px] uppercase tracking-[0.42em] mb-8" style={{ color: "#b5a06a" }}>
            {a.k}
          </motion.div>
          <h1 className="max-w-[16ch]" style={{ fontFamily: "Georgia, serif", fontSize: "clamp(28px, 4.2vw, 58px)", lineHeight: 1.08 }}>
            <WordFlight text={a.t} keyed={i} />
          </h1>
          <motion.p key={`p-${i}`} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE_3, delay: 0.36 }}
            className="mt-8 max-w-[52ch] text-[15px] leading-relaxed text-white/45">
            Étude Fabre & Delaunay, Chambéry. Premier rendez-vous sans frais, et un devis écrit
            avant tout acte — émoluments, débours et taxes séparés.
          </motion.p>
          <div className="mt-10 flex flex-wrap items-center gap-5">
            <a href="#rdv" className="min-h-[46px] px-9 grid place-items-center text-[10px] uppercase tracking-[0.26em] text-[#141a17]" style={{ background: "#b5a06a" }}>
              Prendre rendez-vous
            </a>
            <SlideIndex i={i} total={ACTES.length} variant="fraction" className="text-[13px] text-white/60" />
          </div>
        </div>
        <div className="relative min-h-[36svh]">
          <ExpandFrame src={a.img} alt="" index={i} className="h-full w-full" />
          <HairlineArrows onPrev={prev} onNext={next} color="rgba(255,255,255,0.8)" className="absolute bottom-6 right-6 z-10" />
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   v09 · justice-row, seconde prise — LineMask + Retint
   Même template, autre moment : les lignes du titre sortent sous masque et le
   bandeau se reteinte. Ici sur un cabinet de recouvrement.
   ──────────────────────────────────────────────────────────────────────────── */
const DOSSIERS = [
  { lines: ["Recouvrer", "sans rompre"], k: "Amiable", tint: "#1e2a33", accent: "#7fb0c9", d: "Relance, échéancier, médiation. Quatre créances sur cinq se règlent avant toute procédure." },
  { lines: ["Aller", "au titre"], k: "Judiciaire", tint: "#2a1e22", accent: "#c98f7f", d: "Injonction de payer, assignation, exécution. Vous suivez chaque étape depuis votre espace." },
  { lines: ["Prévenir", "l'impayé"], k: "Prévention", tint: "#222a1e", accent: "#a3c97f", d: "Analyse de vos conditions générales et de vos délais. Le meilleur recouvrement est celui qu'on évite." },
];

function RecouvrementLab() {
  const { i, next, prev } = useSlides(DOSSIERS.length, DWELL.slow);
  const d = DOSSIERS[i];
  return (
    <section className="lab-hero relative min-h-[620px] overflow-hidden bg-black text-white">
      <div className="h-full grid md:grid-cols-[minmax(300px,36%)_1fr]">
        <Retint color={d.tint} className="relative z-10 flex flex-col justify-between px-7 py-10">
          <div>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 17 }}>Cabinet Sorel</div>
            <div className="text-[9px] uppercase tracking-[0.38em] opacity-45 mt-1.5">Recouvrement · Rouen</div>
          </div>
          <div>
            <motion.div key={`k-${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.25 }}
              className="text-[10px] uppercase tracking-[0.32em] mb-6" style={{ color: d.accent }}>
              {d.k}
            </motion.div>
            <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(28px, 3vw, 48px)", lineHeight: 1.06 }}>
              <LineMask lines={d.lines} index={i} />
            </h1>
            <p className="mt-6 text-sm text-white/45 max-w-[38ch]">{d.d}</p>
          </div>
          <div className="flex items-center justify-between gap-4">
            <SlideIndex i={i} total={DOSSIERS.length} className="text-[11px] opacity-70" />
            <HairlineArrows onPrev={prev} onNext={next} color="rgba(255,255,255,0.75)" />
          </div>
        </Retint>
        <div className="relative min-h-[34svh]">
          <AnchoredBackdrop images={[U("photo-1454165804606-c3d57bc86b40"), U("photo-1507679799987-c73779587ccf"), U("photo-1589829545856-d10d557cf95f")]} index={i} overlay={0.32} />
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   v10 · dental-clinic — MosaicPush
   La mosaïque sort par la droite tuile par tuile. Ici sur une école privée.
   ──────────────────────────────────────────────────────────────────────────── */
const CYCLES = [
  { t: "Apprendre\nà son rythme", k: "Primaire", imgs: [U("photo-1503676260728-1c00da094a0b"), U("photo-1509062522246-3755977927d7"), U("photo-1509062522246-3755977927d7"), U("photo-1427504494785-3a9ca7044f45")] },
  { t: "Choisir\nsans se fermer de portes", k: "Collège & lycée", imgs: [U("photo-1509062522246-3755977927d7"), U("photo-1427504494785-3a9ca7044f45"), U("photo-1503676260728-1c00da094a0b"), U("photo-1509062522246-3755977927d7")] },
];

function SchoolLab() {
  const { i, next, prev } = useSlides(CYCLES.length, DWELL.normal);
  const c = CYCLES[i];
  const tile = (src: string) => <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${src})` }} />;
  return (
    <section className="lab-hero relative min-h-[620px] overflow-hidden bg-[#f2f1ec] text-[#1c2620]">
      <div className="h-full grid lg:grid-cols-[1.05fr_1fr]">
        <div className="relative z-10 flex flex-col justify-center px-6 md:px-12 py-14">
          <motion.div key={`k-${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
            className="text-[10px] uppercase tracking-[0.4em] text-[#1c2620]/45 mb-6">{c.k}</motion.div>
          <motion.h1 key={`t-${i}`} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE_3, delay: 0.15 }}
            className="whitespace-pre-line font-semibold tracking-tight"
            style={{ fontSize: "clamp(30px, 3.6vw, 54px)", lineHeight: 1.08 }}>
            {c.t}
          </motion.h1>
          <p className="mt-6 max-w-[48ch] text-[15px] text-[#1c2620]/60 leading-relaxed">
            École Sainte-Colombe, Vannes. Vingt-deux élèves par classe au maximum, deux enseignants
            en primaire, et un entretien avec chaque famille avant l&apos;inscription.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-5">
            <a href="#visite" className="min-h-[46px] px-8 grid place-items-center bg-[#1c2620] text-white text-[10px] uppercase tracking-[0.26em]">
              Visiter l&apos;école
            </a>
            <SlideIndex i={i} total={CYCLES.length} variant="fraction" className="text-[13px] text-[#1c2620]/60" />
          </div>
        </div>
        <div className="relative min-h-[34svh] p-3">
          <MosaicPush index={i} className="h-full w-full"
            style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(3, 1fr)", gridTemplateRows: "repeat(3, 1fr)" }}
            tiles={[
              { area: { gridColumn: "1 / span 2", gridRow: "1 / span 2" }, node: tile(c.imgs[0]) },
              { area: { gridColumn: "3", gridRow: "1" }, node: tile(c.imgs[1]) },
              { area: { gridColumn: "3", gridRow: "2 / span 2" }, node: tile(c.imgs[2]) },
              { area: { gridColumn: "1 / span 2", gridRow: "3" }, node: tile(c.imgs[3]) },
            ]} />
          <HairlineArrows onPrev={prev} onNext={next} color="#1c2620" className="absolute bottom-6 right-6 z-10 opacity-65" />
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   v11 · bento-grid-travel-slider — BentoCascade + Retint
   Les tuiles se vident et se remplissent en cascade, la palette se reteinte.
   Ici sur un office de tourisme.
   ──────────────────────────────────────────────────────────────────────────── */
const SAISONS = [
  { s: "Printemps", claim: "Trente-deux\nsentiers rouverts", tint: "#1f3326", accent: "#7fc98f", imgs: [U("photo-1465146344425-f00d5f5c8f07"), U("photo-1441974231531-c6227db76b6e"), U("photo-1476231682828-37e571bc172f"), U("photo-1502082553048-f009c37129b9")] },
  { s: "Automne", claim: "Deux marchés\npar semaine", tint: "#33261f", accent: "#c9a37f", imgs: [U("photo-1507525428034-b723cf961d3e"), U("photo-1476231682828-37e571bc172f"), U("photo-1441974231531-c6227db76b6e"), U("photo-1465146344425-f00d5f5c8f07")] },
];

function TourismLab() {
  const { i, next, prev } = useSlides(SAISONS.length, DWELL.slow);
  const e = SAISONS[i];
  const tile = (src: string) => <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${src})` }} />;
  return (
    <Retint color={e.tint} className="lab-hero relative min-h-[620px] overflow-hidden text-white" style={{ padding: "clamp(12px,1.6vw,22px)" }}>
      <BentoCascade index={i} className="lab-bento h-full w-full" style={{ gap: "clamp(8px,1vw,14px)" }}
        tiles={[
          { area: { gridColumn: "1 / span 2", gridRow: "1 / span 2" },
            node: (
              <div className="w-full h-full flex flex-col justify-between p-6 md:p-9" style={{ background: alpha("#000000", 30) }}>
                <div className="text-[9px] uppercase tracking-[0.42em] opacity-60">Vallée d&apos;Aspe · {e.s}</div>
                <h1 className="whitespace-pre-line" style={{ fontSize: "clamp(26px,2.9vw,46px)", lineHeight: 1.06, fontWeight: 600, letterSpacing: "-0.02em" }}>
                  {e.claim}
                </h1>
              </div>
            ) },
          { area: { gridColumn: "3 / span 2", gridRow: "1" }, node: tile(e.imgs[0]) },
          { area: { gridColumn: "3", gridRow: "2" }, node: tile(e.imgs[1]) },
          { area: { gridColumn: "4", gridRow: "2" }, node: tile(e.imgs[2]) },
          { area: { gridColumn: "1 / span 2", gridRow: "3 / span 2" }, node: tile(e.imgs[3]) },
          { area: { gridColumn: "3 / span 2", gridRow: "3" },
            node: (
              <div className="w-full h-full grid place-items-center p-5 text-center" style={{ background: e.accent, color: e.tint }}>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.3em] font-bold">Carte des sentiers</div>
                  <div className="mt-1.5 text-[13px] opacity-80">Gratuite à l&apos;office</div>
                </div>
              </div>
            ) },
          { area: { gridColumn: "3 / span 2", gridRow: "4" },
            node: (
              <div className="w-full h-full flex items-center justify-between px-5" style={{ background: alpha("#ffffff", 8) }}>
                <SlideIndex i={i} total={SAISONS.length} className="text-[12px]" />
                <span className="text-[10px] uppercase tracking-[0.3em] opacity-45">Bedous · 64490</span>
              </div>
            ) },
        ]} />
      <HairlineArrows onPrev={prev} onNext={next} color="rgba(255,255,255,0.85)" className="absolute bottom-7 right-7 z-20" />
    </Retint>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   v12 · hair-salon-hairdresser — TrackingCollapse
   Le mot s'écarte en se floutant, le suivant arrive très espacé et se resserre.
   Ici sur un institut de beauté.
   ──────────────────────────────────────────────────────────────────────────── */
const SOINS = [
  { w: "VISAGE", d: "Diagnostic de peau, nettoyage profond, massage kobido. Une heure quinze.", img: U("photo-1570172619644-dfd03ed5d881") },
  { w: "CORPS", d: "Gommage au sel de Camargue, enveloppement, modelage aux huiles chaudes.", img: U("photo-1544161515-4ab6ce6db874") },
  { w: "REGARD", d: "Rehaussement de cils, teinture, restructuration du sourcil. Tenue six semaines.", img: U("photo-1674049406467-824ea37c7184") },
];

function BeautyLab() {
  const { i, next, prev } = useSlides(SOINS.length, DWELL.normal);
  return (
    <section className="lab-hero relative min-h-[620px] overflow-hidden bg-[#171114] text-white">
      <AnchoredBackdrop images={SOINS.map((x) => x.img)} index={i} overlay={0.56} />
      <div className="relative z-10 h-full flex flex-col justify-between px-6 md:px-14 py-10">
        <div className="text-[10px] uppercase tracking-[0.44em] opacity-70">Institut Marèse · Pau</div>
        <div>
          <TrackingCollapse word={SOINS[i].w} index={i}
            style={{ fontFamily: "Georgia, serif", fontSize: "clamp(36px, 6.8vw, 100px)", fontWeight: 400 }} />
          <motion.p key={`p-${i}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE_3, delay: 0.42 }} className="mt-5 max-w-[48ch] text-sm text-white/55">
            {SOINS[i].d}
          </motion.p>
        </div>
        <div className="flex flex-wrap items-end justify-between gap-5">
          <a href="#rdv" className="min-h-[46px] px-8 grid place-items-center border border-white/30 text-[10px] uppercase tracking-[0.26em] hover:bg-white hover:text-black transition-colors">
            Réserver
          </a>
          <div className="flex items-center gap-6">
            <SlideIndex i={i} total={SOINS.length} className="text-[11px] opacity-70" />
            <HairlineArrows onPrev={prev} onNext={next} color="rgba(255,255,255,0.78)" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   v13 · suits-product-showcase — LineScroll + Retint
   Les lignes défilent d'un bord à l'autre sous masque, avec chevauchement.
   Ici sur un hôtel.
   ──────────────────────────────────────────────────────────────────────────── */
const CHAMBRES = [
  { lines: ["Dormir", "au calme"], k: "Chambre Jardin", tint: "#1e2420", accent: "#a8bd9a", img: U("photo-1611892440504-42a792e24d32") },
  { lines: ["Travailler", "puis oublier"], k: "Suite Atelier", tint: "#241f1e", accent: "#bd9f8a", img: U("photo-1631049307264-da0ec9d70304") },
  { lines: ["Rester", "un jour de plus"], k: "Appartement", tint: "#1e2128", accent: "#9aa8bd", img: U("photo-1595576508898-0ad5c879a061") },
];

function HotelLab() {
  const { i, next, prev } = useSlides(CHAMBRES.length, DWELL.slow);
  const h = CHAMBRES[i];
  return (
    <section className="lab-hero relative min-h-[620px] overflow-hidden bg-black text-white">
      <div className="h-full grid md:grid-cols-[minmax(300px,34%)_1fr]">
        <Retint color={h.tint} className="relative z-10 flex flex-col justify-between px-7 py-10">
          <div>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 17 }}>Hôtel des Cordeliers</div>
            <div className="text-[9px] uppercase tracking-[0.38em] opacity-45 mt-1.5">Uzès · 14 chambres</div>
          </div>
          <div>
            <motion.div key={`k-${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.25 }}
              className="text-[10px] uppercase tracking-[0.32em] mb-6" style={{ color: h.accent }}>{h.k}</motion.div>
            <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(28px, 3vw, 48px)", lineHeight: 1.06 }}>
              <LineScroll lines={h.lines} index={i} />
            </h1>
            <p className="mt-6 text-sm text-white/45 max-w-[36ch]">
              Petit-déjeuner servi jusqu&apos;à onze heures. Pas de télévision, pas de minibar.
            </p>
          </div>
          <div className="flex items-center justify-between gap-4">
            <SlideIndex i={i} total={CHAMBRES.length} className="text-[11px] opacity-70" />
            <HairlineArrows onPrev={prev} onNext={next} color="rgba(255,255,255,0.75)" />
          </div>
        </Retint>
        <div className="relative min-h-[36svh]">
          <motion.div key={i} className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${h.img})` }}
            initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, ease: EASE_3 }} aria-hidden />
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   v14 · modern-web-agency — InvertSweep
   Toute la page s'inverse au défilement : le fond passe du noir au blanc et le
   texte du blanc au noir, pendant qu'une forme fluide monte.
   ──────────────────────────────────────────────────────────────────────────── */
function AgencyLab() {
  return (
    <section className="lab-hero relative min-h-[620px] overflow-y-auto">
      <InvertSweep className="min-h-[160vh]">
        {(p) => (
          <div className="max-w-[1180px] mx-auto px-6 md:px-12 pt-[18vh] pb-[24vh]">
            <div className="text-[10px] uppercase tracking-[0.46em] opacity-55 mb-8">Studio Bréhat · identité & interfaces</div>
            <h1 style={{ fontSize: "clamp(34px, 5.4vw, 84px)", fontWeight: 700, lineHeight: 1.02, letterSpacing: "-0.025em", maxWidth: "18ch" }}>
              On conçoit des marques
              <br />
              qui tiennent debout
              <br />
              <span style={{ opacity: 0.5 }}>sans nous.</span>
            </h1>
            <p className="mt-9 max-w-[52ch] text-sm opacity-60 leading-relaxed">
              Neuf ans, cinquante-deux marques, aucune refonte imposée. On travaille avec vos
              équipes jusqu&apos;à ce qu&apos;elles n&apos;aient plus besoin de nous appeler.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a href="#travaux" className="min-h-[46px] px-8 grid place-items-center text-[10px] uppercase tracking-[0.26em]"
                style={{ background: p > 0.5 ? "#0a0a0b" : "#f4f2ee", color: p > 0.5 ? "#f4f2ee" : "#0a0a0b" }}>
                Voir les travaux
              </a>
              <a href="#contact" className="min-h-[46px] px-8 grid place-items-center border text-[10px] uppercase tracking-[0.26em]"
                style={{ borderColor: "currentColor", opacity: 0.75 }}>
                Écrire au studio
              </a>
            </div>
            <div className="mt-[26vh] text-[10px] uppercase tracking-[0.4em] opacity-40">
              Défilez — la page bascule
            </div>
          </div>
        )}
      </InvertSweep>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   v16 · fitness-gym-website-slider — HardCutRebuild + FixedRail
   La photo coupe net, un temps sans texte, puis tout se reconstruit en décalé.
   Ici sur une entreprise de déménagement.
   ──────────────────────────────────────────────────────────────────────────── */
const DEMENAGEMENTS = [
  { ghost: "ON", solid: "EMBALLE", img: U("photo-1600518464441-9154a4dea21b"), tint: "#e07a1f", note: "Cartons, papier bulle, housses penderie. Fournis et repris." },
  { ghost: "ON", solid: "PORTE", img: U("photo-1698917414969-feade59e3343"), tint: "#1f7ee0", note: "Monte-meubles jusqu'au sixième. Assurance tous risques incluse." },
  { ghost: "ON", solid: "REMONTE", img: U("photo-1714647211923-a3881cd1300f"), tint: "#1fa06b", note: "Démontage et remontage du mobilier, cuisine comprise." },
];

function MovingLab() {
  const { i, next, prev } = useSlides(DEMENAGEMENTS.length, DWELL.brisk);
  const d = DEMENAGEMENTS[i];
  return (
    <section className="lab-hero relative min-h-[620px] overflow-hidden bg-black text-white">
      <div key={i} className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${d.img})` }} aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-r from-black/88 via-black/50 to-black/70" aria-hidden />
      <FixedRail color={d.tint}>
        <span className="text-[11px] font-bold tracking-[0.24em]" style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
          {String(i + 1).padStart(2, "0")} / {String(DEMENAGEMENTS.length).padStart(2, "0")}
        </span>
      </FixedRail>
      <div className="relative z-10 h-full flex flex-col justify-center pl-[clamp(56px,7vw,96px)] pr-6 md:pr-14">
        <HardCutRebuild index={i}>
          {[
            <div key="t" style={{ fontStyle: "italic", fontWeight: 900, lineHeight: 0.92, letterSpacing: "-0.02em" }}>
              <div style={{ fontSize: "clamp(34px, 6.2vw, 92px)", color: "transparent", WebkitTextStroke: `1.5px ${alpha("#ffffff", 55)}` }}>{d.ghost}</div>
              <div style={{ fontSize: "clamp(34px, 6.2vw, 92px)", color: d.tint }}>{d.solid}</div>
            </div>,
            <p key="n" className="mt-6 text-sm text-white/55 max-w-[46ch]">{d.note}</p>,
            <div key="s" className="mt-8 flex gap-8">
              {[["1 400", "déménagements"], ["18", "ans"], ["0", "casse en 2025"]].map(([v, l]) => (
                <div key={l}>
                  <div className="text-2xl font-black" style={{ color: d.tint }}>{v}</div>
                  <div className="text-[10px] uppercase tracking-[0.24em] text-white/40">{l}</div>
                </div>
              ))}
            </div>,
            <a key="c" href="#devis" className="mt-9 inline-grid place-items-center min-h-[46px] px-9 text-[10px] font-bold uppercase tracking-[0.26em] text-black" style={{ background: d.tint }}>
              Devis gratuit sous 24 h
            </a>,
          ]}
        </HardCutRebuild>
      </div>
      <HairlineArrows onPrev={prev} onNext={next} color="rgba(255,255,255,0.8)" className="absolute bottom-7 right-7 z-20" />
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   v18 · portal-effect-hero-slider — PortalZoom
   On traverse le seuil : la slide suivante est déjà visible au travers.
   Ici sur un monument ouvert à la visite.
   ──────────────────────────────────────────────────────────────────────────── */
const SALLES = [
  { n: "La nef", d: "Trente-deux mètres sous voûte, vitraux du XIIIe restaurés en 2019", img: U("photo-1632489464296-54239e764455") },
  { n: "Le cloître", d: "Quatre galeries, cent douze chapiteaux sculptés, aucun identique", img: U("photo-1660076677934-6c9979ce059e") },
  { n: "La crypte", d: "Ouverte trois fois par an, sur réservation, par groupes de douze", img: U("photo-1623585837434-919067c60de7") },
];

function MonumentLab() {
  const { i, next, prev } = useSlides(SALLES.length, DWELL.slow);
  return (
    <section className="lab-hero relative min-h-[620px] overflow-hidden bg-[#0b0a08] text-[#f2ece0]">
      <PortalZoom images={SALLES.map((r) => r.img)} index={i} overlay={0.44} />
      <div className="relative z-10 h-full flex flex-col justify-between px-6 md:px-14 py-10 pointer-events-none">
        <div className="pointer-events-auto">
          <div style={{ fontFamily: "Georgia, serif", fontSize: 19, letterSpacing: "0.05em" }}>Abbaye de Fontgombault</div>
          <div className="text-[9px] uppercase tracking-[0.4em] opacity-60 mt-1.5">Monument historique · Indre</div>
        </div>
        <motion.h1 key={i} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE_3, delay: 0.35 }} className="max-w-[14ch] pointer-events-auto"
          style={{ fontFamily: "Georgia, serif", fontSize: "clamp(34px, 5.6vw, 78px)", lineHeight: 1.04 }}>
          {SALLES[i].n}
        </motion.h1>
        <div className="flex flex-wrap items-end justify-between gap-6 pointer-events-auto">
          <div>
            <SlideIndex i={i} total={SALLES.length} className="text-[11px] opacity-70" />
            <p className="mt-2 text-sm text-white/60 max-w-[52ch]">{SALLES[i].d}</p>
          </div>
          <HairlineArrows onPrev={prev} onNext={next} color="rgba(255,255,255,0.78)" />
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Le sélecteur — les dix-huit enregistrements, un par onglet
   ──────────────────────────────────────────────────────────────────────────── */
type Lab = {
  id: string;
  v: string;
  label: string;
  source: string;
  note: string;
  Comp?: () => React.JSX.Element;
};

const LABS: Lab[] = [
  { id: "food", v: "v15", label: "Pâtisserie", source: "food-presentation-template-slider",
    note: "ComposeIn — la scène reste vide 1,4 s, puis chaque élément arrive depuis son propre bord. Le vide initial est le sujet",
    Comp: FoodLab },
  { id: "wine", v: "v01", label: "Cave", source: "oakgrove-wine-slider-template",
    note: "ArcSwap — la bouteille balance : rotation de 52° autour du pied, sortie par la droite, la suivante entre par la gauche couchée",
    Comp: WineArcLab },
  { id: "coffee", v: "v02", label: "Torréfacteur", source: "coffee-shop-split-screen-slider",
    note: "PanelDrop — le panneau descend comme un rideau, contenu compris. Sur une fromagerie : le geste n'appartient pas au café",
    Comp: CheeseLab },
  { id: "interior", v: "v03", label: "Architecture", source: "shft-interior-design",
    note: "PanelRise — le titre reste fixe, la section suivante monte par-dessus au défilement",
    Comp: WoodLab },
  { id: "sketch", v: "v04", label: "Produit", source: "from-sketch-to-product-slider",
    note: "ScrollSpin + DifferentialExit — le produit tourne au défilement, les trois plans partent à des vitesses différentes",
    Comp: ProductLab },
  { id: "dj", v: "v05", label: "Club", source: "dj-website-with-scroll-video",
    note: "ScrollGrow — le titre grandit au défilement au lieu de partir",
    Comp: ConcertLab },
  { id: "particle", v: "v06", label: "Éditorial", source: "wordpress-hero-image",
    note: "ParticleOrb — une sphère de poussière en canvas : un héros sans photo qui ne soit pas une page vide",
    Comp: EditionLab },
  { id: "tattoo", v: "v07", label: "Tatouage", source: "old-soul-tattoo-studio",
    note: "CrossPush — les deux photographies se croisent, visibles ensemble un instant. Aucun fondu",
    Comp: DanceLab },
  { id: "law", v: "v08", label: "Avocat", source: "justice-row-law-firm-slider",
    note: "WordFlight + ExpandFrame — le titre s'assemble mot par mot pendant que la photo s'ouvre ; les deux atterrissent ensemble",
    Comp: NotaireLab },
  { id: "law2", v: "v09", label: "Avocat (2)", source: "justice-row-law-firm-slider",
    note: "LineMask + Retint — les lignes sortent sous masque, le bandeau se reteinte",
    Comp: RecouvrementLab },
  { id: "dental", v: "v10", label: "Cabinet dentaire", source: "dental-clinic-dentist",
    note: "MosaicPush — la mosaïque sort par la droite tuile par tuile, la suivante entre par la gauche",
    Comp: SchoolLab },
  { id: "bento", v: "v11", label: "Événementiel", source: "bento-grid-travel-slider",
    note: "BentoCascade + Retint — les tuiles se vident et se remplissent en cascade, la palette se reteinte",
    Comp: TourismLab },
  { id: "salon", v: "v12", label: "Coiffure", source: "hair-salon-hairdresser",
    note: "TrackingCollapse — le mot s'écarte en se floutant, le suivant arrive très espacé et se resserre",
    Comp: BeautyLab },
  { id: "suits", v: "v13", label: "Costume", source: "suits-product-showcase",
    note: "LineScroll — les lignes défilent d'un bord à l'autre sous masque, avec chevauchement",
    Comp: HotelLab },
  { id: "agency", v: "v14", label: "Agence", source: "modern-web-agency",
    note: "InvertSweep — toute la page s'inverse au défilement, une forme fluide monte pendant la bascule",
    Comp: AgencyLab },
  { id: "gym", v: "v16", label: "Salle de sport", source: "fitness-gym-website-slider",
    note: "HardCutRebuild + FixedRail — la photo coupe net, un temps sans texte, puis tout se reconstruit en décalé",
    Comp: MovingLab },
  { id: "property", v: "v17", label: "Immobilier", source: "smart-living-one-pager-v3",
    note: "PushBlur — toute la composition part sur le côté, photo et titre ensemble, avec un flou directionnel",
    Comp: PropertyLab },
  { id: "portal", v: "v18", label: "Chambres d'hôtes", source: "portal-effect-hero-slider",
    note: "PortalZoom — on traverse le seuil : la slide suivante est déjà visible au travers",
    Comp: MonumentLab },
];

export default function VideoLabs() {
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
        /* le titre s'écarte autour de l'objet qui balance ; sur téléphone les
           deux moitiés ne tiennent pas, il repasse sur une ligne au-dessus */
        .lab-bento{display:flex;flex-direction:column;overflow-y:auto}
        .lab-bento > *{flex:0 0 auto;min-height:clamp(120px,22svh,200px)}
        @media (min-width:768px){
          .lab-bento{display:grid;overflow:visible;
            grid-template-columns:repeat(4,1fr);grid-template-rows:repeat(4,1fr)}
          .lab-bento > *{min-height:0}
        }
        .wine-split{display:flex;justify-content:center;align-items:baseline;gap:.3em;text-align:center}
        @media (min-width:768px){
          .wine-split{display:grid;
            grid-template-columns:minmax(0,1fr) clamp(140px,16vw,240px) minmax(0,1fr);
            align-items:center;width:100%;gap:0}
        }
        @media (min-width:768px){.lab-hero{height:calc(100svh - 104px)}}
      `}</style>

      <header className="relative md:sticky md:top-0 z-50 bg-[#0b0b0c]/95 backdrop-blur border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-5 py-3">
          {/* dix-huit pastilles occupent huit lignes sur un téléphone et mangent
              355 px de hauteur : là-bas, une liste déroulante. */}
          <div className="md:hidden flex items-center gap-3">
            <span className="text-white/35 text-[10px] uppercase tracking-[0.3em] shrink-0">Labs</span>
            <select
              value={L.id}
              onChange={(e) => {
                const n = LABS.findIndex((l) => l.id === e.target.value);
                if (n >= 0) {
                  setActive(n);
                  window.history.replaceState(null, "", `#${e.target.value}`);
                }
              }}
              className="flex-1 min-h-[38px] px-3 rounded-lg bg-white/10 text-white text-[13px] border border-white/20"
              aria-label="Choisir un enregistrement"
            >
              {LABS.map((l) => (
                <option key={l.id} value={l.id} style={{ color: "#111" }}>
                  {l.v} · {l.label}
                </option>
              ))}
            </select>
          </div>

          <div className="hidden md:flex flex-wrap items-center gap-1.5">
            <span className="text-white/35 text-[10px] uppercase tracking-[0.3em] mr-3">Video labs</span>
            {LABS.map((l, n) => (
              <button
                key={l.id}
                type="button"
                onClick={() => {
                  setActive(n);
                  window.history.replaceState(null, "", `#${l.id}`);
                }}
                className="min-h-[32px] px-3 text-[11px] rounded-full border transition-colors cursor-pointer"
                style={{
                  borderColor: n === active ? "#fff" : l.Comp ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.1)",
                  color: n === active ? "#0b0b0c" : l.Comp ? "rgba(255,255,255,0.62)" : "rgba(255,255,255,0.28)",
                  background: n === active ? "#fff" : "transparent",
                }}
              >
                {l.v} · {l.label}
              </button>
            ))}
          </div>
          <p className="mt-2.5 text-[12px] text-white/40 leading-relaxed line-clamp-2 md:line-clamp-none">
            <span className="text-white/70">{L.source}</span> — {L.note}
          </p>
        </div>
      </header>

      {Comp ? (
        <motion.div key={L.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, ease: EASE_4 }}>
          <Comp />
        </motion.div>
      ) : (
        <div className="grid place-items-center px-6" style={{ height: "calc(100svh - 104px)" }}>
          <div className="text-center max-w-[52ch]">
            <div className="text-white/30 text-[10px] uppercase tracking-[0.4em] mb-4">{L.v}</div>
            <h2 className="text-2xl text-white/80 mb-4" style={{ fontFamily: "Georgia, serif" }}>
              {L.source}
            </h2>
            <p className="text-sm text-white/40 leading-relaxed">{L.note}</p>
          </div>
        </div>
      )}
    </main>
  );
}
