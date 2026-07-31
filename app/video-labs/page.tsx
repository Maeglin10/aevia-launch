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
import { useSlides, DWELL, SlideIndex, HairlineArrows } from "@/lib/templates/hero-kit-2";
import { ComposeIn, WipeReveal, DriftShadow } from "@/lib/templates/hero-kit-3";
import { EASE_3, EASE_4 } from "@/lib/templates/hero-kit";

const U = (id: string, w = 1400) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&q=85&w=${w}`;

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
  { id: "wine", v: "v01", label: "Cave", source: "oakgrove-wine-slider-template", note: "HeldSwap — sortie, un demi-temps de vide tenu, entrée. Voir /hero-labs#wine" },
  { id: "coffee", v: "v02", label: "Torréfacteur", source: "coffee-shop-split-screen-slider", note: "PanelDrop — le panneau descend comme un rideau. Voir /hero-labs-2#coffee" },
  { id: "interior", v: "v03", label: "Architecture", source: "shft-interior-design", note: "PanelRise + StickyProgress. Voir /hero-labs-2#process" },
  { id: "sketch", v: "v04", label: "Produit", source: "from-sketch-to-product-slider", note: "DifferentialExit — trois plans, trois vitesses de sortie" },
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
  { id: "property", v: "v17", label: "Immobilier", source: "smart-living-one-pager-v3", note: "AnchoredBackdrop + vignette du suivant. Voir /hero-labs#chateau" },
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
