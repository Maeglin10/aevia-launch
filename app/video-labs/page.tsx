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
import { useSlides, DWELL, SlideIndex, HairlineArrows, AnchoredBackdrop, BlurThrough } from "@/lib/templates/hero-kit-2";
import { ComposeIn, WipeReveal, DriftShadow, ArcSwap, PushBlur, ScrollSpin, DifferentialExit } from "@/lib/templates/hero-kit-3";
import { EASE_3, EASE_4 } from "@/lib/templates/hero-kit";

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
          <div
            aria-hidden
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              width: "min(30vw, 300px)",
              height: "min(56vh, 520px)",
              border: "1px solid rgba(240,233,221,0.16)",
              borderRadius: "50% 50% 0 0 / 26% 26% 0 0",
              bottom: "12%",
            }}
          />
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
          <div className="absolute left-1/2 -translate-x-1/2" style={{ zIndex: 2, bottom: "11%" }}>
            <ArcSwap index={i} sweep={52} hold={0.42}>
              <div
                role="img"
                aria-label={`${c.name} ${c.year}`}
                style={{
                  width: "clamp(120px, 15vw, 220px)",
                  height: "clamp(300px, 52vh, 500px)",
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
  { id: "coffee", v: "v02", label: "Torréfacteur", source: "coffee-shop-split-screen-slider", note: "PanelDrop — le panneau descend comme un rideau. Voir /hero-labs-2#coffee" },
  { id: "interior", v: "v03", label: "Architecture", source: "shft-interior-design", note: "PanelRise + StickyProgress. Voir /hero-labs-2#process" },
  { id: "sketch", v: "v04", label: "Produit", source: "from-sketch-to-product-slider",
    note: "ScrollSpin + DifferentialExit — le produit tourne au défilement, les trois plans partent à des vitesses différentes",
    Comp: ProductLab },
  { id: "dj", v: "v05", label: "Club", source: "dj-website-with-scroll-video", note: "ScrollGrow — le titre grandit au défilement. Voir /hero-labs-2#club" },
  { id: "particle", v: "v06", label: "Éditorial", source: "wordpress-hero-image", note: "Sphère de particules en canvas, poussée au défilement — pas encore construit" },
  { id: "tattoo", v: "v07", label: "Tatouage", source: "old-soul-tattoo-studio", note: "CrossPush — les deux photos se croisent. Voir /hero-labs-2#ink" },
  { id: "law", v: "v08", label: "Avocat", source: "justice-row-law-firm-slider", note: "WordFlight + ExpandFrame. Voir /hero-labs#law" },
  { id: "law2", v: "v09", label: "Avocat (2)", source: "justice-row-law-firm-slider", note: "Même template, seconde prise" },
  { id: "dental", v: "v10", label: "Cabinet dentaire", source: "dental-clinic-dentist", note: "MosaicPush. Voir /hero-labs-2#dental" },
  { id: "bento", v: "v11", label: "Événementiel", source: "bento-grid-travel-slider", note: "BentoCascade + Retint. Voir /hero-labs#event" },
  { id: "salon", v: "v12", label: "Coiffure", source: "hair-salon-hairdresser", note: "TrackingCollapse — le mot s'écarte en se floutant. Voir /hero-labs-2#ink" },
  { id: "suits", v: "v13", label: "Costume", source: "suits-product-showcase", note: "LineScroll + Retint. Voir /hero-labs-2#couture" },
  { id: "agency", v: "v14", label: "Agence", source: "modern-web-agency", note: "Inversion complète de la palette au défilement — pas encore construit" },
  { id: "gym", v: "v16", label: "Salle de sport", source: "fitness-gym-website-slider", note: "HardCutRebuild + FixedRail. Voir /hero-labs-2#gym" },
  { id: "property", v: "v17", label: "Immobilier", source: "smart-living-one-pager-v3",
    note: "PushBlur — toute la composition part sur le côté, photo et titre ensemble, avec un flou directionnel",
    Comp: PropertyLab },
  { id: "portal", v: "v18", label: "Chambres d'hôtes", source: "portal-effect-hero-slider", note: "PortalZoom — on traverse l'arche. Voir /hero-labs-2#portal" },
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
        .wine-split{display:flex;justify-content:center;align-items:baseline;gap:.3em;text-align:center}
        @media (min-width:768px){
          .wine-split{display:grid;
            grid-template-columns:minmax(0,1fr) clamp(150px,17vw,250px) minmax(0,1fr);
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
