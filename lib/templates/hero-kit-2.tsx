"use client";
/* ════════════════════════════════════════════════════════════════════════════
   HERO KIT 2 — the mechanics measured off the Slider Revolution recordings.

   hero-kit.tsx holds the motion *vocabulary*: easings, the beat grid, the
   entrance primitives. This file holds the *mechanics* — the six devices that
   the recordings showed doing the actual work, each one measured rather than
   eyeballed. See docs/SLIDER_REVOLUTION_TEARDOWN_2.md for the frame data.

   The three numbers that matter, and that our catalogue got wrong:

   - transitions run 0.6s to 1.0s, never 0.3s. Nothing in eighteen recordings
     moved faster than half a second unless it was one element on its own.
   - the still time between moves is 3x to 6x the transition, not equal to it.
   - a group's burst peaks late (70-80% through) because its children are
     staggered. A group that moves as one block reads as one flat element.

   Everything here honours prefers-reduced-motion: the mechanic still changes
   state, it just stops travelling.
   ════════════════════════════════════════════════════════════════════════════ */

import React, { useEffect, useId, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { EASE_3, EASE_4, alpha } from "./hero-kit";

/* ── Timings, straight off the motion curves ─────────────────────────────── */
export const T = {
  /** v07 tattoo, v17 property: one element, front-loaded. */
  single: 0.7,
  /** v10 dental, v13 suits: a staggered group, peak lands at ~0.72s. */
  group: 1.0,
  /** v01 wine: the outgoing element leaves before the new one is allowed in. */
  exit: 0.57,
  /** v01 wine: the half second of held emptiness that makes it feel expensive. */
  hold: 0.5,
  /** Per-child offset inside a staggered group. */
  stagger: 0.055,
} as const;

/** Dwell between moves. The recordings never went below 2.5s. */
export const DWELL = { brisk: 3000, normal: 4200, slow: 5600 } as const;

/* ════════════════════════════════════════════════════════════════════════════
   useSlides — index state with autoplay that yields permanently on interaction.

   Same contract as useHeroSelector in hero-kit, but the default dwell comes
   from the measurements above rather than from a round number.
   ════════════════════════════════════════════════════════════════════════════ */
export function useSlides(count: number, dwellMs: number = DWELL.normal) {
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(true);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!auto || reduce || count < 2) return;
    const t = setInterval(() => setI((n) => (n + 1) % count), dwellMs);
    return () => clearInterval(t);
  }, [auto, reduce, count, dwellMs]);

  const go = (n: number) => {
    setAuto(false);
    setI(((n % count) + count) % count);
  };
  return { i, go, next: () => go(i + 1), prev: () => go(i - 1), auto };
}

/* ════════════════════════════════════════════════════════════════════════════
   AnchoredBackdrop — v03 (SHFT) and v17 (Smart Living).

   The headline never moves. Only the photograph behind it dissolves, slowly,
   while a small index ticks over. This is the mechanic behind both of the
   most expensive-looking templates in the corpus, and it is the cheapest one
   here: no layout ever reflows, so nothing can break.

   The outgoing frame holds a slight scale so the dissolve reads as depth
   rather than as two stacked opacities.
   ════════════════════════════════════════════════════════════════════════════ */
export function AnchoredBackdrop({
  images,
  index,
  overlay = 0.55,
  blur = 0,
  className = "",
}: {
  images: string[];
  index: number;
  /** 0-1. Dark scrim strength over the photograph. */
  overlay?: number;
  /** Pixels of blur. Use it when a product has to sit in front of the photo. */
  blur?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <div
      className={`overflow-hidden ${className}`}
      style={{ position: "absolute", inset: 0 }}
      aria-hidden
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={index}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${images[index % images.length]})`,
            filter: blur ? `blur(${blur}px)` : undefined,
            // blur samples past the edge, so grow the layer to hide the seam
            inset: blur ? -blur * 2 : 0,
          }}
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.06 }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.02 }}
          transition={{ duration: reduce ? 0.2 : 1.15, ease: EASE_3 }}
        />
      </AnimatePresence>
      <div className="absolute inset-0" style={{ background: `rgba(0,0,0,${overlay})` }} />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   WordFlight — v08 (Justice Row).

   Each word is its own element, entering from a small vertical offset,
   staggered 55ms apart. Mid-flight frames of the original catch two words of
   the same line at different heights, which is the whole effect: the line
   assembles instead of appearing.

   The words are wrapped in per-word masks so nothing is visible above its own
   baseline while travelling.
   ════════════════════════════════════════════════════════════════════════════ */
export function WordFlight({
  text,
  className = "",
  delay = 0,
  keyed,
}: {
  text: string;
  className?: string;
  delay?: number;
  /** Change this to replay the assembly (a slide index, usually). */
  keyed?: string | number;
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((w, n) => (
        <span
          key={`${keyed}-${w}-${n}`}
          style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom" }}
        >
          <motion.span
            style={{ display: "inline-block", willChange: "transform" }}
            initial={reduce ? { opacity: 0 } : { y: "110%", opacity: 0 }}
            animate={reduce ? { opacity: 1 } : { y: "0%", opacity: 1 }}
            transition={{
              duration: reduce ? 0.2 : 0.78,
              ease: EASE_4,
              delay: reduce ? 0 : delay + n * T.stagger,
            }}
          >
            {w}
            {n < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   LineMask — v13 (Suits).

   Each line of a title slides horizontally inside its own clipping mask, so
   the outgoing text is briefly readable as a tail: the original shows
   "egance" and "zation" leaving at different speeds. Far more legible than a
   fade, and the per-line offset does the staggering for free.
   ════════════════════════════════════════════════════════════════════════════ */
export function LineMask({
  lines,
  index,
  className = "",
  lineClassName = "",
}: {
  lines: string[];
  /** Bump to replay. Usually the slide index. */
  index: string | number;
  className?: string;
  lineClassName?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <span className={className} style={{ display: "block" }}>
      {lines.map((l, n) => (
        <span key={n} style={{ display: "block", overflow: "hidden" }}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={`${index}-${n}`}
              className={lineClassName}
              style={{ display: "block", willChange: "transform" }}
              initial={reduce ? { opacity: 0 } : { x: "-102%" }}
              animate={reduce ? { opacity: 1 } : { x: "0%" }}
              exit={
                reduce
                  ? { opacity: 0, transition: { duration: 0.15 } }
                  : { x: "102%", transition: { duration: 0.42, ease: EASE_4, delay: n * 0.05 } }
              }
              transition={{ duration: reduce ? 0.2 : 0.72, ease: EASE_4, delay: n * T.stagger }}
            >
              {l}
            </motion.span>
          </AnimatePresence>
        </span>
      ))}
    </span>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   GhostSolid — v16 (Fitness Gym).

   Line one outlined or barely there, line two solid in the accent. Same face,
   same size, two weights of presence. It reads as a designed lockup rather
   than a headline, and it costs one extra span.

   -webkit-text-stroke is the only reliable way to outline text; where it is
   unsupported the low opacity fill still reads correctly.
   ════════════════════════════════════════════════════════════════════════════ */
export function GhostSolid({
  ghost,
  solid,
  accent,
  className = "",
  strokeWidth = 1,
}: {
  ghost: string;
  solid: string;
  accent: string;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <span className={className} style={{ display: "block" }}>
      <span
        style={{
          display: "block",
          color: "transparent",
          WebkitTextStroke: `${strokeWidth}px ${alpha("#ffffff", 45)}`,
        }}
      >
        {ghost}
      </span>
      <span style={{ display: "block", color: accent }}>{solid}</span>
    </span>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   BlurThrough — v12 (Hair Salon).

   The label does not fade, it blurs out and the next blurs in. One frame of
   the original catches "ENHANCE" half-dissolved and clearly gaussian-blurred.
   Costs a filter and buys a far more physical feeling than opacity alone.
   ════════════════════════════════════════════════════════════════════════════ */
export function BlurThrough({
  children,
  index,
  className = "",
  amount = 14,
}: {
  children: React.ReactNode;
  index: React.Key;
  className?: string;
  amount?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={index}
        className={className}
        initial={reduce ? { opacity: 0 } : { opacity: 0, filter: `blur(${amount}px)`, scale: 1.03 }}
        animate={reduce ? { opacity: 1 } : { opacity: 1, filter: "blur(0px)", scale: 1 }}
        exit={
          reduce
            ? { opacity: 0, transition: { duration: 0.15 } }
            : {
                opacity: 0,
                filter: `blur(${amount}px)`,
                scale: 0.99,
                transition: { duration: 0.3, ease: EASE_3 },
              }
        }
        transition={{ duration: reduce ? 0.2 : T.single, ease: EASE_3 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   HeldSwap — v01 (OakGrove).

   The three-part transition, and the one thing no template in our catalogue
   does. The outgoing element leaves over 0.57s, then there is half a second of
   *held emptiness*, then the new one arrives over 0.88s with its peak late.

   Everything of ours cross-fades: out and in overlap, so there is never a
   moment where the stage is empty. That empty beat is the whole effect.

   AnimatePresence mode="wait" gates re-entry on the exit finishing; the hold
   is the entrance delay on top of that.
   ════════════════════════════════════════════════════════════════════════════ */
export function HeldSwap({
  children,
  index,
  className = "",
  /** Degrees the outgoing element tips as it leaves. The wine bottle tilts. */
  tilt = 14,
}: {
  children: React.ReactNode;
  index: React.Key;
  className?: string;
  tilt?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={index}
        className={className}
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 44, rotate: -tilt / 2, scale: 0.96 }}
        animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, rotate: 0, scale: 1 }}
        exit={
          reduce
            ? { opacity: 0, transition: { duration: 0.15 } }
            : {
                opacity: 0,
                y: -30,
                rotate: tilt,
                scale: 0.97,
                transition: { duration: T.exit, ease: EASE_4 },
              }
        }
        transition={{
          duration: reduce ? 0.2 : 0.88,
          ease: EASE_4,
          delay: reduce ? 0 : T.hold,
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   BentoCascade — v11 (Bento Grid Travel).

   Tiles of unequal size empty in a staggered cascade and refill in the same
   order, so the middle of the transition is mostly bare. The stagger is what
   makes 0.9s feel like one gesture rather than seven separate ones.

   Each tile carries its own grid placement, because the animated element has
   to *be* the grid item: wrapping a placed div in an unplaced motion.div drops
   every tile back into auto-flow and the layout collapses.
   ════════════════════════════════════════════════════════════════════════════ */
export function BentoCascade({
  index,
  tiles,
  className = "",
  style,
}: {
  index: string | number;
  /** `area` is the grid placement, e.g. { gridColumn: "1 / span 2" }. */
  tiles: { node: React.ReactNode; area: React.CSSProperties }[];
  className?: string;
  style?: React.CSSProperties;
}) {
  const reduce = useReducedMotion();
  return (
    <div className={className} style={style}>
      {tiles.map(({ node: child, area }, n) => (
        <AnimatePresence mode="wait" initial={false} key={n}>
          <motion.div
            key={`${index}-${n}`}
            style={{ ...area, overflow: "hidden", willChange: "clip-path, opacity" }}
            initial={reduce ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)", opacity: 0.4 }}
            animate={reduce ? { opacity: 1 } : { clipPath: "inset(0 0 0% 0)", opacity: 1 }}
            exit={
              reduce
                ? { opacity: 0, transition: { duration: 0.15 } }
                : {
                    clipPath: "inset(100% 0 0 0)",
                    opacity: 0.4,
                    transition: { duration: 0.34, ease: EASE_3, delay: n * 0.04 },
                  }
            }
            transition={{
              duration: reduce ? 0.2 : 0.62,
              ease: EASE_3,
              delay: reduce ? 0 : n * T.stagger,
            }}
          >
            {child}
          </motion.div>
        </AnimatePresence>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   ExpandFrame — v08 (Justice Row).

   The image starts as a small rounded rectangle and expands to fill its
   container. Paired with WordFlight it gives the burst its late peak: the
   last word and the last pixels of the image land together.
   ════════════════════════════════════════════════════════════════════════════ */
export function ExpandFrame({
  src,
  alt,
  index,
  className = "",
  radius = 4,
}: {
  src: string;
  alt: string;
  index: React.Key;
  className?: string;
  radius?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <div className={`overflow-hidden ${className}`} style={{ position: "relative" }}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={index}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${src})`, borderRadius: radius }}
          role="img"
          aria-label={alt}
          initial={
            reduce
              ? { opacity: 0 }
              : { clipPath: "inset(34% 30% 34% 30% round 8px)", opacity: 0, scale: 1.12 }
          }
          animate={
            reduce
              ? { opacity: 1 }
              : { clipPath: "inset(0% 0% 0% 0% round 0px)", opacity: 1, scale: 1 }
          }
          exit={
            reduce
              ? { opacity: 0, transition: { duration: 0.15 } }
              : {
                  clipPath: "inset(34% 30% 34% 30% round 8px)",
                  opacity: 0,
                  transition: { duration: 0.36, ease: EASE_3 },
                }
          }
          transition={{ duration: reduce ? 0.2 : 0.95, ease: EASE_4 }}
        />
      </AnimatePresence>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   Retint — v13 (Suits) and v11 (Bento).

   A flat surface takes a colour sampled from the current photograph. The
   layout never changes and the whole page still feels like it did. Highest
   ratio of perceived effort to actual work in the entire corpus.
   ════════════════════════════════════════════════════════════════════════════ */
export function Retint({
  color,
  children,
  className = "",
  style,
}: {
  color: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      style={style}
      animate={{ backgroundColor: color }}
      transition={{ duration: reduce ? 0.2 : 0.95, ease: EASE_3 }}
    >
      {children}
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   CircularLabel — v01 (OakGrove).

   Text set on a circular path, rotating slowly. A badge that says something
   instead of being a decorative ring. 24s per turn in the original — slow
   enough that you notice it only on the second look.
   ════════════════════════════════════════════════════════════════════════════ */
export function CircularLabel({
  text,
  size = 132,
  color = "#ffffff",
  fontSize = 8.2,
  seconds = 24,
  children,
  className = "",
  style,
}: {
  text: string;
  size?: number;
  color?: string;
  fontSize?: number;
  seconds?: number;
  /** Rendered still, in the middle. The ring turns around it. */
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const reduce = useReducedMotion();
  // useId, not Math.random: a random id differs between the server and client
  // render and React reports it as a hydration mismatch.
  const id = `cl-${useId().replace(/:/g, "")}`;
  const r = 50 - fontSize / 2 - 2;
  return (
    <div
      className={className}
      style={{ position: "relative", width: size, height: size, ...style }}
      aria-hidden
    >
      <motion.svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        style={{ position: "absolute", inset: 0, willChange: "transform" }}
        animate={reduce ? undefined : { rotate: 360 }}
        transition={{ duration: seconds, ease: "linear", repeat: Infinity }}
      >
        <defs>
          <path id={id} d={`M 50,50 m -${r},0 a ${r},${r} 0 1,1 ${r * 2},0 a ${r},${r} 0 1,1 -${r * 2},0`} />
        </defs>
        <text fill={color} fontSize={fontSize} letterSpacing="1.6" style={{ textTransform: "uppercase" }}>
          <textPath href={`#${id}`}>{text}</textPath>
        </text>
      </motion.svg>
      {children ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
            color,
          }}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   SlideIndex — the counter every one of the eighteen templates carries.

   Two forms: the stacked fraction with a diagonal rule (v02, coffee shop) and
   the flat "01 — 06" (v07, tattoo). Both are just type; neither is decorative.
   ════════════════════════════════════════════════════════════════════════════ */
export function SlideIndex({
  i,
  total,
  variant = "flat",
  color = "currentColor",
  className = "",
}: {
  i: number;
  total: number;
  variant?: "flat" | "fraction";
  color?: string;
  className?: string;
}) {
  const pad = (n: number) => String(n).padStart(2, "0");
  if (variant === "fraction") {
    return (
      <div
        className={className}
        style={{ display: "inline-flex", alignItems: "center", gap: 2, color, lineHeight: 1 }}
        aria-label={`Slide ${i + 1} of ${total}`}
      >
        <span style={{ fontVariantNumeric: "tabular-nums", alignSelf: "flex-start" }}>
          {pad(i + 1)}
        </span>
        <span
          aria-hidden
          style={{
            width: 1,
            height: "2.1em",
            background: "currentColor",
            opacity: 0.4,
            transform: "rotate(24deg)",
            margin: "0 6px",
          }}
        />
        <span style={{ fontVariantNumeric: "tabular-nums", opacity: 0.5, alignSelf: "flex-end" }}>
          {pad(total)}
        </span>
      </div>
    );
  }
  return (
    <div
      className={className}
      style={{ color, fontVariantNumeric: "tabular-nums", letterSpacing: "0.18em" }}
      aria-label={`Slide ${i + 1} of ${total}`}
    >
      {pad(i + 1)}
      <span style={{ opacity: 0.4 }}> — {pad(total)}</span>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   HairlineArrows — v01, v07, v13.

   Thin-stroke prev/next. Every recording had them; none of them used a filled
   circular button. Real <button>s with labels and a 44px hit area, because a
   decorative chevron a client cannot press is worse than no control at all.
   ════════════════════════════════════════════════════════════════════════════ */
export function HairlineArrows({
  onPrev,
  onNext,
  color = "currentColor",
  vertical = false,
  className = "",
  labels = { prev: "Précédent", next: "Suivant" },
}: {
  onPrev: () => void;
  onNext: () => void;
  color?: string;
  vertical?: boolean;
  className?: string;
  labels?: { prev: string; next: string };
}) {
  const box: React.CSSProperties = {
    minWidth: 44,
    minHeight: 44,
    display: "grid",
    placeItems: "center",
    background: "none",
    border: "none",
    cursor: "pointer",
    color,
    padding: 0,
  };
  const Arrow = ({ dir }: { dir: "prev" | "next" }) => {
    const rot = vertical ? (dir === "prev" ? -90 : 90) : dir === "prev" ? 180 : 0;
    return (
      <svg width="34" height="12" viewBox="0 0 34 12" style={{ transform: `rotate(${rot}deg)` }} aria-hidden>
        <path d="M0 6 H32 M26 1 L32 6 L26 11" stroke="currentColor" strokeWidth="1" fill="none" />
      </svg>
    );
  };
  return (
    <div
      className={className}
      style={{ display: "flex", flexDirection: vertical ? "column" : "row", gap: 8 }}
    >
      <button type="button" onClick={onPrev} aria-label={labels.prev} style={box}>
        <Arrow dir="prev" />
      </button>
      <button type="button" onClick={onNext} aria-label={labels.next} style={box}>
        <Arrow dir="next" />
      </button>
    </div>
  );
}
