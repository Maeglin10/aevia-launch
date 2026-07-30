"use client";
/* ════════════════════════════════════════════════════════════════════════════
   HERO LABS — six heroes built on the mechanics measured off the Slider
   Revolution recordings. Preview only; nothing here ships to a client site.

   Each one targets a specific theme from the "worst 15" list in
   docs/AUDIT_THEMES_2026-07-27.md, and names the recording it derives from.
   The point is not to copy those templates — it is to run our own layouts on
   the timings the recordings actually use. See
   docs/SLIDER_REVOLUTION_TEARDOWN_2.md for the frame data behind every number.
   ════════════════════════════════════════════════════════════════════════════ */

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  useSlides,
  DWELL,
  AnchoredBackdrop,
  WordFlight,
  LineMask,
  GhostSolid,
  BlurThrough,
  HeldSwap,
  BentoCascade,
  ExpandFrame,
  Retint,
  CircularLabel,
  SlideIndex,
  HairlineArrows,
} from "@/lib/templates/hero-kit-2";
import { EASE_3, EASE_4, alpha } from "@/lib/templates/hero-kit";

const U = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&q=80&w=${w}`;

/** Portrait crop, for a product that has to stand upright in a narrow column. */
const UP = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&q=85&w=620&h=1240`;

/* ─────────────────────────────────────────────────────────────────────────────
   1 · CAVE / BAR À VIN — for impact-37
   From v01 (OakGrove). Three devices: the wordmark split around the bottle so
   the product sits *inside* the type without eating a single letter, the held
   empty beat between exit and entrance, and a circular label that says
   something rather than decorating.

   The bottles are photographs, and a photograph carries its own background.
   Rather than fight that with blend modes, the arch is a real frame that clips
   them: it reads as a deliberate niche instead of a failed cut-out, and a
   client can drop any bottle shot straight in.
   ──────────────────────────────────────────────────────────────────────────── */
const WINES = [
  {
    left: "CLOS",
    right: "MERIDIEN",
    year: "2019",
    grape: "Syrah",
    place: "Côte-Rôtie",
    bg: U("photo-1506377247377-2a5b3b417ebb"),
    bottle: UP("photo-1598866971869-22782ffd918e"),
  },
  {
    left: "PIERRE",
    right: "BLANCHE",
    year: "2021",
    grape: "Chardonnay",
    place: "Meursault",
    bg: U("photo-1474722883778-792e7990302f"),
    bottle: UP("photo-1775144313163-9361d25189c1"),
  },
  {
    left: "TERRE",
    right: "ROUGE",
    year: "2018",
    grape: "Grenache",
    place: "Gigondas",
    bg: U("photo-1510812431401-41d2bd2722f3"),
    bottle: UP("photo-1781942610266-4013e9b78af0"),
  },
];

/** Width of the gap the wordmark leaves for the bottle, and of the bottle itself. */
const BOTTLE_W = "clamp(130px, 17vw, 250px)";

function WineHero() {
  const { i, next, prev } = useSlides(WINES.length, DWELL.slow);
  const w = WINES[i];
  const word: React.CSSProperties = {
    fontFamily: "Georgia, serif",
    fontSize: "clamp(22px, 5.4vw, 78px)",
    letterSpacing: "clamp(0.1em, 0.28vw, 0.28em)",
    lineHeight: 1.1,
    fontWeight: 400,
    whiteSpace: "nowrap",
  };
  return (
    <section className="lab-hero relative min-h-[620px] overflow-hidden bg-[#0d0a08] text-[#f0e9dd]">
      <AnchoredBackdrop images={WINES.map((x) => x.bg)} index={i} overlay={0.76} blur={3} />

      <div className="relative z-10 h-full flex flex-col">
        <div className="pt-10 text-center">
          <div className="text-[15px] tracking-[0.22em]" style={{ fontFamily: "Georgia, serif" }}>
            Cave Saint-Anselme
          </div>
          <div className="mt-2 text-[9px] uppercase tracking-[0.45em] opacity-70">
            Vins de vignerons · Lyon 2e
          </div>
        </div>

        <div className="relative flex-1 grid place-items-center">
          {/* The bottle is a photograph, and a photograph has a background.
              Rather than fight that with blend modes, the arch becomes a real
              frame and clips it — which reads as a deliberate device instead of
              a failed cut-out, and lets any client photo drop straight in. */}
          <div
            className="absolute left-1/2 -translate-x-1/2 overflow-hidden"
            style={{
              zIndex: 2,
              width: BOTTLE_W,
              height: "clamp(300px, 54vh, 540px)",
              bottom: "10%",
              borderRadius: "50% 50% 3px 3px / 26% 26% 3px 3px",
              border: `1px solid ${alpha("#f0e9dd", 22)}`,
              boxShadow: "0 40px 90px rgba(0,0,0,0.6)",
            }}
          >
            <HeldSwap index={i} tilt={8}>
              <div
                style={{
                  width: "100%",
                  height: "clamp(300px, 54vh, 540px)",
                  backgroundImage: `url(${w.bottle})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                role="img"
                aria-label={`${w.left} ${w.right} ${w.year}`}
              />
            </HeldSwap>
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 26%, transparent 62%, rgba(0,0,0,0.55) 100%)",
              }}
            />
          </div>

          {/* the wordmark, split so the frame lands in its own gap */}
          <div className="absolute inset-x-0 grid place-items-center px-4" style={{ zIndex: 3 }}>
            <BlurThrough index={i} amount={10}>
              <h1 className="flex items-baseline justify-center" style={{ textAlign: "center" }}>
                <span style={word}>{w.left}</span>
                <span aria-hidden style={{ display: "inline-block", width: BOTTLE_W }} />
                <span style={word}>{w.right}</span>
              </h1>
            </BlurThrough>
          </div>

          <CircularLabel
            text="dégustation le samedi · dégustation le samedi · "
            className="hidden sm:block"
            style={{ position: "absolute", right: "7%", top: "4%" }}
            size={118}
            color={alpha("#f0e9dd", 62)}
            seconds={26}
          />
        </div>

        <div className="pb-9 px-5 md:px-12 flex flex-wrap items-end justify-between gap-x-3 gap-y-4 md:gap-6">
          <div>
            <SlideIndex i={i} total={WINES.length} className="text-[11px] font-medium opacity-70" />
            <BlurThrough index={i} amount={6}>
              <div className="mt-2 text-[11px] leading-snug opacity-55 whitespace-nowrap" style={{ fontFamily: "Georgia, serif" }}>
                {w.place} · {w.grape} · {w.year}
              </div>
            </BlurThrough>
          </div>
          <a
            href="#carte"
            className="min-h-[44px] px-5 md:px-8 grid place-items-center border text-[10px] uppercase tracking-[0.2em] md:tracking-[0.28em] whitespace-nowrap transition-colors hover:bg-[#f0e9dd] hover:text-[#0d0a08]"
            style={{ borderColor: alpha("#f0e9dd", 35) }}
          >
            Voir la carte
          </a>
          <HairlineArrows
            onPrev={prev}
            onNext={next}
            color={alpha("#f0e9dd", 70)}
            className="ml-auto shrink-0"
          />
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   2 · CABINET D'AVOCATS — for impact-46
   From v08 (Justice Row). The headline assembles word by word while the
   photograph expands out of a small rectangle; both land together, which is
   why the original's motion burst peaks at 75 % of its duration.
   ──────────────────────────────────────────────────────────────────────────── */
const CASES = [
  { t: "Vingt-deux ans de défense pénale des affaires", k: "Pénal des affaires", img: U("photo-1589829545856-d10d557cf95f") },
  { t: "Une équipe qui plaide ses propres dossiers", k: "Contentieux", img: U("photo-1521737604893-d14cc237f11d") },
  { t: "Le premier rendez-vous est sans honoraires", k: "Conseil", img: U("photo-1454165804606-c3d57bc86b40") },
];

function LawHero() {
  const { i, next, prev } = useSlides(CASES.length, DWELL.normal);
  const c = CASES[i];
  return (
    <section className="lab-hero relative min-h-[620px] bg-[#0f1720] text-white overflow-hidden">
      <div className="h-full grid lg:grid-cols-[1.05fr_1fr]">
        <div className="relative z-10 flex flex-col justify-center px-6 md:px-14 py-20">
          <motion.div
            key={`k-${i}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: EASE_3 }}
            className="text-[10px] uppercase tracking-[0.42em] mb-8"
            style={{ color: "var(--brand,#c2a24a)" }}
          >
            {c.k}
          </motion.div>

          <h1
            className="max-w-[16ch]"
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(30px, 4.4vw, 62px)",
              lineHeight: 1.08,
              fontWeight: 400,
            }}
          >
            <WordFlight text={c.t} keyed={i} />
          </h1>

          <motion.p
            key={`p-${i}`}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE_3, delay: 0.34 }}
            className="mt-8 max-w-[52ch] text-[15px] leading-relaxed text-white/45"
          >
            Barreau de Lyon. Nous n&apos;ouvrons pas de dossier que nous ne pourrions pas plaider
            nous-mêmes, et nous le disons au premier rendez-vous.
          </motion.p>

          <div className="mt-11 flex flex-wrap items-center gap-5">
            <a
              href="#contact"
              className="min-h-[46px] px-9 grid place-items-center text-[10px] uppercase tracking-[0.26em] text-[#0f1720]"
              style={{ background: "var(--brand,#c2a24a)" }}
            >
              Prendre rendez-vous
            </a>
            <SlideIndex i={i} total={CASES.length} variant="fraction" className="text-[13px] text-white/60" />
          </div>
        </div>

        <div className="relative min-h-[38svh]">
          <ExpandFrame src={c.img} alt="" index={i} className="h-full w-full" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f1720] via-transparent to-transparent lg:block hidden" />
          <HairlineArrows
            onPrev={prev}
            onNext={next}
            color="rgba(255,255,255,0.8)"
            className="absolute bottom-6 right-6 z-10"
          />
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   3 · BOULANGERIE / RESTAURANT — for impact-33 and impact-83
   From v02 (Coffee Shop Split Screen). The selector is a column of round
   swatches sitting exactly on the seam, each tinted with the colour of the
   thing it selects. Vertical arrows, because the slider moves vertically.
   ──────────────────────────────────────────────────────────────────────────── */
const BREADS = [
  { n: "Tourte de seigle", d: "Levain naturel, farine du Puy-de-Dôme, 24 h de pointage. Se garde une semaine entière.", c: "#6b4423", img: U("photo-1509440159596-0249088772ff") },
  { n: "Baguette de tradition", d: "Pétrissage lent, façonnage à la main, cuite quatre fois par jour. Jamais avant six heures.", c: "#c89b5e", img: U("photo-1608198093002-ad4e005484ec") },
  { n: "Pain de campagne", d: "Un tiers de seigle, deux tiers de blé T80. La miche que les cuisiniers du quartier viennent chercher.", c: "#8a6234", img: U("photo-1585478259715-1c093a7b70d3") },
  { n: "Brioche feuilletée", d: "Beurre de Charentes, six tours, deux jours de repos au froid. Le samedi uniquement.", c: "#d9ae6c", img: U("photo-1509365465985-25d11c17e812") },
];

function BakeryHero() {
  const { i, go, next, prev } = useSlides(BREADS.length, DWELL.normal);
  const b = BREADS[i];
  return (
    <section className="lab-hero relative min-h-[620px] bg-[#efe9e0] text-[#1e1710] overflow-hidden">
      <div className="h-full grid md:grid-cols-2">
        <div className="relative overflow-hidden min-h-[36svh] md:min-h-0">
          <AnchoredBackdrop images={BREADS.map((x) => x.img)} index={i} overlay={0.06} />
          {/* the wordmark has to survive whatever photograph is behind it */}
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-40 z-[5]"
            style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.55), transparent)" }}
          />
          <div
            aria-hidden
            className="absolute inset-y-0 left-0 w-24 z-[5]"
            style={{ background: "linear-gradient(to right, rgba(0,0,0,0.42), transparent)" }}
          />
          <div className="absolute top-8 left-6 md:left-10 z-10 flex items-center gap-3 text-white">
            <span className="w-6 h-6 rounded-full ring-1 ring-white/40" style={{ background: b.c }} />
            <span className="font-semibold tracking-tight">Fournil Bellecour</span>
          </div>
          <div
            className="absolute left-4 bottom-8 z-10 text-[10px] uppercase tracking-[0.3em] text-white/70"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            Lyon · depuis 1974
          </div>
        </div>

        <div className="relative flex flex-col justify-center px-6 md:px-14 py-16">
          <SlideIndex i={i} total={BREADS.length} variant="fraction" className="text-[15px] mb-8 text-[#1e1710]/70" />
          <BlurThrough index={i} amount={12}>
            <h1
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "clamp(34px, 5vw, 68px)",
                lineHeight: 1.05,
                fontWeight: 400,
              }}
            >
              {b.n}
            </h1>
            <p className="mt-6 max-w-[46ch] text-[15px] leading-relaxed text-[#1e1710]/55">{b.d}</p>
          </BlurThrough>
          <a
            href="#commander"
            className="mt-10 self-start min-h-[46px] px-9 grid place-items-center text-[10px] uppercase tracking-[0.28em] text-white transition-colors"
            style={{ background: b.c }}
          >
            Commander
          </a>

          {/* the seam selector is desktop-only, so a phone gets the same
              swatches laid out horizontally */}
          <div className="md:hidden mt-8 flex gap-3">
            {BREADS.map((x, n) => (
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
                  animate={{
                    width: n === i ? 26 : 16,
                    height: n === i ? 26 : 16,
                    opacity: n === i ? 1 : 0.4,
                  }}
                  transition={{ duration: 0.55, ease: EASE_3 }}
                />
              </button>
            ))}
          </div>
          <HairlineArrows
            onPrev={prev}
            onNext={next}
            vertical
            color="#1e1710"
            className="absolute bottom-8 right-6 md:right-10 opacity-60"
          />
        </div>
      </div>

      {/* the swatch column, straddling the seam */}
      <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex-col gap-4">
        {BREADS.map((x, n) => (
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
              style={{ background: x.c, boxShadow: "0 2px 10px rgba(0,0,0,0.18)" }}
              animate={{
                width: n === i ? 28 : 18,
                height: n === i ? 28 : 18,
                opacity: n === i ? 1 : 0.45,
              }}
              transition={{ duration: 0.55, ease: EASE_3 }}
            />
          </button>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   4 · CHÂTEAU / RÉCEPTION — for impact-131
   From v17 (Smart Living) and v03 (SHFT). The headline never moves. Only the
   photograph dissolves, on a slow beat, with a numbered index ticking over and
   a thumbnail of what comes next.
   ──────────────────────────────────────────────────────────────────────────── */
const ROOMS = [
  { n: "L'Orangerie", d: "180 couverts sous verrière, ouverte sur le parc à la française. Éclairée à la bougie après 21 h.", img: U("photo-1519167758481-83f550bb49b3") },
  { n: "La Grande Salle", d: "Parquet Versailles, six mètres sous plafond, une acoustique qui n'a jamais eu besoin de sonorisation.", img: U("photo-1464366400600-7168b8af9bc3") },
  { n: "Les Communs", d: "Le format intime : 60 personnes, cheminée, et la cuisine qui ouvre directement sur la salle.", img: U("photo-1478146896981-b80fe463b330") },
];

function ChateauHero() {
  const { i, go, next, prev } = useSlides(ROOMS.length, DWELL.slow);
  const nextRoom = ROOMS[(i + 1) % ROOMS.length];
  return (
    <section className="lab-hero relative min-h-[620px] bg-black text-white overflow-hidden">
      <AnchoredBackdrop images={ROOMS.map((r) => r.img)} index={i} overlay={0.5} />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.86) 0%, transparent 48%), linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 26%)",
        }}
      />

      <div className="relative z-10 h-full flex flex-col justify-between px-6 md:px-14 py-10">
        <div className="flex items-start justify-between gap-6">
          <div>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 19, letterSpacing: "0.06em" }}>
              Château de Vaugrenier
            </div>
            <div className="text-[9px] uppercase tracking-[0.4em] opacity-70 mt-1.5">
              Réceptions & mariages · Beaujolais
            </div>
          </div>
          <CircularLabel
            text="visites sur rendez-vous · visites sur rendez-vous · "
            className="hidden sm:block shrink-0"
            size={104}
            color="rgba(255,255,255,0.55)"
            seconds={30}
          />
        </div>

        {/* the anchored title: it is deliberately the one thing that never moves */}
        <h1
          className="max-w-[13ch]"
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "clamp(38px, 6.6vw, 96px)",
            lineHeight: 1.02,
            fontWeight: 400,
          }}
        >
          Recevoir
          <br />
          <span style={{ marginLeft: "1.6em", fontStyle: "italic", opacity: 0.72 }}>autrement.</span>
        </h1>

        <div className="flex flex-wrap items-end justify-between gap-8">
          <div className="flex items-start gap-6 max-w-[62ch]">
            <div
              className="shrink-0"
              style={{ fontFamily: "Georgia, serif", fontSize: 34, lineHeight: 1, opacity: 0.55 }}
            >
              {String(i + 1).padStart(2, "0")}
            </div>
            <BlurThrough index={i} amount={9}>
              <div className="text-[17px]" style={{ fontFamily: "Georgia, serif" }}>
                {ROOMS[i].n}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-white/60 max-w-[62ch]">{ROOMS[i].d}</p>
            </BlurThrough>
          </div>

          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => go(i + 1)}
              className="group relative w-[92px] h-[62px] overflow-hidden cursor-pointer border-0 p-0"
              aria-label={`Salle suivante : ${nextRoom.n}`}
            >
              <span
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url(${nextRoom.img})` }}
              />
              <span className="absolute inset-0 bg-black/35" />
              <span
                className="absolute inset-x-0 bottom-0 py-1 text-[8px] uppercase tracking-[0.24em] text-center"
                style={{ background: "rgba(0,0,0,0.55)" }}
              >
                Suivant
              </span>
            </button>
            <HairlineArrows onPrev={prev} onNext={next} color="rgba(255,255,255,0.75)" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   5 · ÉVÉNEMENTIEL — for impact-47
   From v11 (Bento Grid Travel). Seven tiles of unequal size empty in a
   staggered cascade and refill in the same order; mid-transition the grid is
   half bare, which is what makes 0.9 s feel like one gesture.
   ──────────────────────────────────────────────────────────────────────────── */
const EVENTS = [
  {
    city: "Lyon",
    claim: "Trois jours,\nune halle,\nquatre mille personnes.",
    tint: "#3b1f2b",
    accent: "#e0725f",
    imgs: [U("photo-1492684223066-81342ee5ff30"), U("photo-1511578314322-379afb476865"), U("photo-1470229722913-7ea0d582d8fb"), U("photo-1505236858219-8359eb29e329")],
  },
  {
    city: "Annecy",
    claim: "Un lac,\nun écran d'eau,\nune seule nuit.",
    tint: "#16323d",
    accent: "#5fb3c6",
    imgs: [U("photo-1533174072545-7a4b6ad7a6c3"), U("photo-1519677100203-a0e668c92439"), U("photo-1514525253161-7a46d19cd819"), U("photo-1540039155733-5bb30b53aa14")],
  },
  {
    city: "Marseille",
    claim: "Le port,\nau lever du jour,\nsans une barrière.",
    tint: "#2e2413",
    accent: "#d9a441",
    imgs: [U("photo-1501281668745-f7f57925c3b4"), U("photo-1516450360452-9312f5e86fc7"), U("photo-1459749411175-04bf5292ceea"), U("photo-1493225457124-a3eb161ffa5f")],
  },
];

function EventHero() {
  const { i, next, prev } = useSlides(EVENTS.length, DWELL.slow);
  const e = EVENTS[i];
  const tile = (src: string) => (
    <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${src})` }} />
  );
  return (
    <Retint
      color={e.tint}
      className="lab-hero relative min-h-[640px] overflow-hidden text-white"
      style={{ padding: "clamp(12px,1.6vw,22px)" }}
    >
      <BentoCascade
        index={i}
        className="lab-bento h-full w-full"
        style={{ gap: "clamp(8px,1vw,14px)" }}
        tiles={[
          {
            area: { gridColumn: "1 / span 2", gridRow: "1 / span 2" },
            node: (
              <div
                className="w-full h-full flex flex-col justify-between p-6 md:p-9"
                style={{ background: alpha("#000000", 30) }}
              >
                <div className="text-[9px] uppercase tracking-[0.42em] opacity-60">
                  Édition {e.city} · 2026
                </div>
                <h1
                  className="whitespace-pre-line"
                  style={{
                    fontSize: "clamp(26px,2.9vw,46px)",
                    lineHeight: 1.06,
                    fontWeight: 600,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {e.claim}
                </h1>
              </div>
            ),
          },
          { area: { gridColumn: "3 / span 2", gridRow: "1" }, node: tile(e.imgs[0]) },
          { area: { gridColumn: "3", gridRow: "2" }, node: tile(e.imgs[1]) },
          { area: { gridColumn: "4", gridRow: "2" }, node: tile(e.imgs[2]) },
          {
            area: { gridColumn: "1 / span 2", gridRow: "3 / span 2" },
            node: tile(e.imgs[3]),
          },
          {
            area: { gridColumn: "3 / span 2", gridRow: "3" },
            node: (
              <div
                className="w-full h-full grid place-items-center p-5 text-center"
                style={{ background: e.accent, color: e.tint }}
              >
                <div>
                  <div className="text-[10px] uppercase tracking-[0.3em] font-bold">Billetterie</div>
                  <div className="mt-1.5 text-[13px] opacity-80">Ouverte le 3 mars</div>
                </div>
              </div>
            ),
          },
          {
            area: { gridColumn: "3 / span 2", gridRow: "4" },
            node: (
              <div
                className="w-full h-full flex items-center justify-between px-5"
                style={{ background: alpha("#ffffff", 8) }}
              >
                <SlideIndex i={i} total={EVENTS.length} className="text-[12px]" />
                <span className="text-[10px] uppercase tracking-[0.3em] opacity-45">
                  Halle Girard · Lyon 7<sup>e</sup>
                </span>
              </div>
            ),
          },
        ]}
      />

      <HairlineArrows
        onPrev={prev}
        onNext={next}
        color="rgba(255,255,255,0.85)"
        className="absolute bottom-7 right-7 z-20"
      />
    </Retint>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   6 · ATELIER DE COUTURE — for impact-41
   From v13 (Suits) and v16 (Fitness). A narrow panel takes a colour sampled
   from the current photograph, the title leaves line by line inside its own
   mask, and the lockup pairs an outlined line against a solid one.
   ──────────────────────────────────────────────────────────────────────────── */
const PIECES = [
  { lines: ["Coupé", "sur vous"], k: "Costume trois pièces", tint: "#2c2320", accent: "#c9a227", img: U("photo-1594938298603-c8148c4dae35") },
  { lines: ["Repris", "à la main"], k: "Retouche & reprise", tint: "#1f2a2e", accent: "#7fb2b8", img: U("photo-1521572163474-6864f9cf17ab") },
  { lines: ["Refait", "à neuf"], k: "Restauration", tint: "#33212b", accent: "#d98c9a", img: U("photo-1490114538077-0a7f8cb49891") },
];

function TailorHero() {
  const { i, next, prev } = useSlides(PIECES.length, DWELL.normal);
  const p = PIECES[i];
  return (
    <section className="lab-hero relative min-h-[620px] overflow-hidden bg-black text-white">
      <div className="h-full grid md:grid-cols-[minmax(280px,26%)_1fr]">
        <Retint color={p.tint} className="relative z-10 flex flex-col justify-between px-7 py-10">
          <div>
            <div className="text-[15px]" style={{ fontFamily: "Georgia, serif" }}>
              Maison Vaury
            </div>
            <div className="text-[9px] uppercase tracking-[0.38em] opacity-40 mt-1.5">
              Tailleur · Bordeaux
            </div>
          </div>

          <div>
            <BlurThrough index={i} amount={8}>
              <div
                className="text-[10px] uppercase tracking-[0.32em] mb-6"
                style={{ color: p.accent }}
              >
                {p.k}
              </div>
            </BlurThrough>

            <h1 style={{ fontSize: "clamp(34px,3.4vw,56px)", lineHeight: 1.02, fontWeight: 400, fontFamily: "Georgia, serif" }}>
              <LineMask lines={p.lines} index={i} />
            </h1>

            <p className="mt-6 text-sm leading-relaxed text-white/45 max-w-[36ch]">
              Trois essayages, jamais moins. La toile est montée avant la moindre coupe dans le tissu.
            </p>
          </div>

          <div className="flex items-center justify-between gap-4">
            <SlideIndex i={i} total={PIECES.length} className="text-[11px] opacity-70" />
            <HairlineArrows onPrev={prev} onNext={next} color="rgba(255,255,255,0.75)" />
          </div>
        </Retint>

        <div className="relative min-h-[40svh]">
          <AnchoredBackdrop images={PIECES.map((x) => x.img)} index={i} overlay={0.22} />
          <div className="absolute bottom-8 right-8 z-10">
            <div
              aria-hidden
              className="absolute -inset-x-10 -inset-y-8 -z-10"
              style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0.55), transparent 72%)" }}
            />
            <GhostSolid
              ghost="Sur"
              solid="mesure"
              accent={p.accent}
              className="text-right text-4xl md:text-5xl font-semibold tracking-tight leading-[1.05]"
              strokeWidth={1.4}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   The switcher
   ──────────────────────────────────────────────────────────────────────────── */
const LABS = [
  { id: "wine", label: "Cave / bar à vin", target: "impact-37", from: "v01 OakGrove", Comp: WineHero,
    note: "Titre traversé par la bouteille · temps mort tenu de 0,5 s entre la sortie et l'entrée · label circulaire" },
  { id: "law", label: "Cabinet d'avocats", target: "impact-46", from: "v08 Justice Row", Comp: LawHero,
    note: "Titre assemblé mot par mot (55 ms d'écart) · photo qui s'ouvre depuis un petit rectangle" },
  { id: "bakery", label: "Boulangerie", target: "impact-33 · impact-83", from: "v02 Coffee Shop", Comp: BakeryHero,
    note: "Split 50/50 · pastilles de sélection sur la couture, teintées par le produit · flèches verticales" },
  { id: "chateau", label: "Château / réceptions", target: "impact-131", from: "v17 Smart Living", Comp: ChateauHero,
    note: "Titre fixe, seuls les fonds se dissolvent · index numéroté · vignette du suivant" },
  { id: "event", label: "Événementiel", target: "impact-47", from: "v11 Bento Travel", Comp: EventHero,
    note: "Grille bento qui se vide et se remplit en cascade · palette retintée par ville" },
  { id: "tailor", label: "Atelier de couture", target: "impact-41", from: "v13 Suits", Comp: TailorHero,
    note: "Panneau latéral reteinté par photo · titre qui sort ligne par ligne sous masque · lockup contour/plein" },
];

export default function HeroLabs() {
  const [active, setActive] = useState(0);

  // The hash makes each lab linkable, which also means a screenshot can land on
  // a freshly mounted hero rather than somewhere mid-cycle.
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
      {/* the site-wide chat bubble lands on the arrows of every lab */}
      <style>{`
        #aevia-webchat-widget{display:none!important}
        .lab-hero{height:100svh}
        @media (min-width:768px){.lab-hero{height:calc(100svh - 88px)}}
        /* Four columns on a phone gives 80px tiles; stack instead, and let the
           grid placement on each tile be ignored by flex. */
        .lab-bento{display:flex;flex-direction:column;overflow-y:auto}
        .lab-bento > *{flex:0 0 auto;min-height:clamp(120px,22svh,200px)}
        @media (min-width:768px){
          .lab-bento{display:grid;overflow:visible;
            grid-template-columns:repeat(4,1fr);grid-template-rows:repeat(4,1fr)}
          .lab-bento > *{min-height:0}
        }
      `}</style>
      <header className="relative md:sticky md:top-0 z-50 bg-[#0b0b0c]/95 backdrop-blur border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-5 py-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-white/35 text-[10px] uppercase tracking-[0.3em] mr-3">
              Hero labs
            </span>
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
            <span className="text-white/70">{L.target}</span> · d&apos;après {L.from} — {L.note}
          </p>
        </div>
      </header>

      <motion.div
        key={L.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: EASE_4 }}
      >
        <Comp />
      </motion.div>
    </main>
  );
}
