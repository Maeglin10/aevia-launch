"use client";
/* ════════════════════════════════════════════════════════════════════════════
   HERO KIT — a shared motion vocabulary for premium template heroes.

   Why this exists: the catalogue audit found 35 heroes that were a flat colour
   panel with almost no motion. Rebuilding each one by hand would either take
   forever or produce eight copies of the same hero. This module holds the
   *vocabulary* (easings, timing grid, entrance primitives, stage layers) so
   each hero can compose a genuinely different layout on top of a consistent,
   deliberate motion language.

   The vocabulary is derived from measurements, not taste — see
   docs/SLIDER_REVOLUTION_TEARDOWN.md, where 129 animation steps from a
   best-in-class hero were decoded:

   - easings are power3/power4 **inOut**, not easeOut. Slow start, real
     acceleration, settled landing. This is the single biggest perceptual gap.
   - entrances land on a strict 0 / 300 / 500ms grid. One rhythm for the whole
     hero, rather than scattered per-element delays.
   - layers arrive through a perspective container (rotateY/rotateX), so they
     come from depth instead of sliding up from the bottom.
   - a very slow ambient loop runs underneath the fast entrances.

   Every primitive here honours prefers-reduced-motion.
   ════════════════════════════════════════════════════════════════════════════ */

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

/* ── Easings ─────────────────────────────────────────────────────────────── */
export const EASE_3: [number, number, number, number] = [0.65, 0, 0.35, 1]; // power3.inOut
export const EASE_4: [number, number, number, number] = [0.76, 0, 0.24, 1]; // power4.inOut

/* ════════════════════════════════════════════════════════════════════════════
   alpha — fade a colour token safely.

   Several templates define their accent as `var(--brand,#b8952a)` so a client
   colour can override it. Appending hex alpha to that (`${C.accent}66`)
   produces `var(--brand,#b8952a)66`, which is invalid CSS — the browser drops
   the whole declaration, so borders and glows silently vanish. color-mix
   composes correctly with var().
   ════════════════════════════════════════════════════════════════════════════ */
export function alpha(color: string, percent: number): string {
  return `color-mix(in srgb, ${color} ${percent}%, transparent)`;
}

/* ── The beat grid. Three beats, nothing in between. ─────────────────────── */
export const BEAT = { first: 0, second: 0.3, third: 0.5 } as const;
export type Beat = keyof typeof BEAT;

/* Exits are short on purpose: under AnimatePresence mode="wait" they gate the
   whole re-entry, and a long exit makes the selector and the copy visibly
   disagree for a beat after a click. */
const EXIT = { duration: 0.22, ease: EASE_3 };

/* ════════════════════════════════════════════════════════════════════════════
   useHeroSelector — the state behind a hero that browses a small catalogue.

   Autoplay exists so a hero looks alive on first load, but it must never fight
   the visitor: the first interaction stops it permanently.
   ════════════════════════════════════════════════════════════════════════════ */
export function useHeroSelector(count: number, intervalMs = 7000) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (paused || reduce || count < 2) return;
    const t = setTimeout(() => setActive((i) => (i + 1) % count), intervalMs);
    return () => clearTimeout(t);
  }, [active, paused, reduce, count, intervalMs]);

  const pick = useCallback((i: number) => {
    setPaused(true);
    setActive(i);
  }, []);

  const hold = useCallback(() => setPaused(true), []);

  return { active, paused, pick, hold, reduce: !!reduce };
}

/* ════════════════════════════════════════════════════════════════════════════
   HeroStage — the photographic layer.

   Cross-fades between images and runs a slow scale drift underneath. The drift
   is the "ambient loop" from the teardown: 15s, linear, barely perceptible
   frame to frame, but it stops the hero from ever feeling like a static JPEG.
   ════════════════════════════════════════════════════════════════════════════ */
export function HeroStage({
  src,
  alt,
  reduce,
  driftSeconds = 15,
  from = 1.1,
  to = 1.02,
  objectPosition = "center",
}: {
  src: string;
  alt: string;
  reduce?: boolean;
  driftSeconds?: number;
  from?: number;
  to?: number;
  objectPosition?: string;
}) {
  return (
    <AnimatePresence mode="sync">
      <motion.div
        key={src}
        initial={{ opacity: 0, scale: from + 0.04 }}
        animate={{ opacity: 1, scale: reduce ? to : [from, to] }}
        exit={{ opacity: 0 }}
        transition={{
          opacity: { duration: 1.1, ease: EASE_3 },
          scale: { duration: reduce ? 0 : driftSeconds, ease: "linear" },
        }}
        style={{ position: "absolute", inset: 0, zIndex: 0 }}
      >
        <img
          src={src}
          alt={alt}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition }}
        />
      </motion.div>
    </AnimatePresence>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   Scrim — legibility. Always directional: the copy column must win regardless
   of what the photograph does behind it.
   ════════════════════════════════════════════════════════════════════════════ */
export function Scrim({
  color,
  direction = "left",
  strength = "normal",
}: {
  color: string;
  direction?: "left" | "bottom" | "right";
  strength?: "soft" | "normal" | "heavy";
}) {
  const a = strength === "heavy" ? ["fa", "f2", "b3", "8c"] : strength === "soft" ? ["e6", "cc", "73", "40"] : ["f5", "e6", "99", "66"];
  const angle = direction === "bottom" ? "0deg" : direction === "right" ? "260deg" : "100deg";
  return (
    <>
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          background: `linear-gradient(${angle}, ${color}${a[0]} 0%, ${color}${a[1]} 36%, ${color}${a[2]} 62%, ${color}${a[3]} 82%, ${color}${a[0]} 100%)`,
        }}
      />
      {/* A soft vignette stops the corners from going flat once the drift runs. */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          background: `radial-gradient(125% 95% at 22% 42%, transparent 28%, ${color}a6 100%)`,
        }}
      />
    </>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   GhostMark — the huge, near-invisible numeral or word behind the copy.
   Carries the ambient layer and gives the hero a sense of scale.
   ════════════════════════════════════════════════════════════════════════════ */
export function GhostMark({
  children,
  color,
  font,
  side = "right",
  opacity = 0.07,
  size = "clamp(180px, 34vw, 520px)",
}: {
  children: React.ReactNode;
  color: string;
  font: string;
  side?: "right" | "left";
  opacity?: number;
  size?: string;
}) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={String(children)}
        aria-hidden
        initial={{ opacity: 0, x: side === "right" ? 60 : -60 }}
        animate={{ opacity, x: 0 }}
        exit={{ opacity: 0, x: side === "right" ? -40 : 40, transition: EXIT }}
        transition={{ duration: 1.4, ease: EASE_4 }}
        style={{
          position: "absolute",
          [side]: "-2%",
          top: "50%",
          translateY: "-50%",
          zIndex: 1,
          fontFamily: font,
          fontSize: size,
          lineHeight: 0.8,
          color,
          pointerEvents: "none",
          userSelect: "none",
          whiteSpace: "nowrap",
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   Rise — the workhorse entrance. Everything that isn't the title uses this,
   placed on one of the three beats.
   ════════════════════════════════════════════════════════════════════════════ */
export function Rise({
  children,
  beat = "first",
  duration = 0.5,
  y = 20,
  style,
  className,
}: {
  children: React.ReactNode;
  beat?: Beat;
  duration?: number;
  y?: number;
  style?: React.CSSProperties;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10, transition: EXIT }}
      transition={{ duration, ease: EASE_3, delay: BEAT[beat] }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   Wipe — the title treatment. A clip-path reveal combined with a small rotateY
   so the headline arrives out of depth rather than sliding up. Needs a
   perspective ancestor (see heroSectionStyle).
   ════════════════════════════════════════════════════════════════════════════ */
export function Wipe({
  children,
  reduce,
  duration = 0.75,
  style,
  as = "h1",
}: {
  children: React.ReactNode;
  reduce?: boolean;
  duration?: number;
  style?: React.CSSProperties;
  as?: "h1" | "h2" | "div";
}) {
  const M: any = as === "h1" ? motion.h1 : as === "h2" ? motion.h2 : motion.div;
  return (
    <M
      initial={{ opacity: 0, rotateY: reduce ? 0 : -14, clipPath: "inset(0 100% 0 0)" }}
      animate={{ opacity: 1, rotateY: 0, clipPath: "inset(0 0% 0 0)" }}
      exit={{
        opacity: 0,
        rotateY: reduce ? 0 : 10,
        clipPath: "inset(0 0 0 100%)",
        transition: { duration: 0.28, ease: EASE_4 },
      }}
      transition={{ duration, ease: EASE_4 }}
      style={{ transformOrigin: "left center", ...style }}
    >
      {children}
    </M>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   heroSectionStyle — the container every kit hero sits in.

   `perspective` is what makes Wipe's rotateY read as depth. `safe center`
   matters more than it looks: a plain `center` pushes content *above* the
   viewport when the stack outgrows it, which is exactly how heroes end up
   hidden under a fixed navbar.
   ════════════════════════════════════════════════════════════════════════════ */
export function heroSectionStyle(
  bg: string,
  opts?: { bottomRail?: boolean; topOffset?: number },
): React.CSSProperties {
  /* topOffset: some templates pad <main> to clear a fixed navbar, which pushes
     the section down by that much. Without subtracting it a 100dvh hero ends
     exactly one navbar-height below the fold, taking the bottom rail with it. */
  const off = opts?.topOffset ?? 0;
  return {
    position: "relative",
    minHeight: off ? `calc(100dvh - ${off}px)` : "100dvh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "safe center",
    overflow: "hidden",
    background: bg,
    perspective: "1400px",
    /* When <main> already pads for a fixed navbar, the hero must not reserve
       that space a second time — doing so is what pushes the bottom rail off
       screen even after the min-height is corrected. */
    padding: opts?.bottomRail
      ? `${off ? "clamp(52px,7vh,76px)" : "clamp(104px,14vh,150px)"} clamp(20px,5vw,72px) clamp(140px,18vh,180px)`
      : `${off ? "clamp(52px,7vh,76px)" : "clamp(104px,14vh,150px)"} clamp(20px,5vw,72px) clamp(72px,10vh,110px)`,
  };
}

/* ════════════════════════════════════════════════════════════════════════════
   SelectorRail — the catalogue, doubling as the hero's navigation.

   `bottom` pins a numbered row across the foot of the stage.
   `side` stacks a vertical index, for heroes with a tall photo on one side.

   The underline doubles as the autoplay progress meter, so "which one am I on"
   and "how long until it moves" are the same signal.
   ════════════════════════════════════════════════════════════════════════════ */
export function SelectorRail({
  items,
  active,
  onPick,
  onHold,
  accent,
  fg,
  serif,
  sans,
  paused,
  reduce,
  intervalMs = 7000,
  variant = "bottom",
  bg,
  id,
  label = (i: any) => i.name,
  sublabel,
}: {
  items: any[];
  active: number;
  onPick: (i: number) => void;
  onHold?: () => void;
  accent: string;
  fg: string;
  serif: string;
  sans: string;
  paused: boolean;
  reduce: boolean;
  intervalMs?: number;
  variant?: "bottom" | "side";
  bg: string;
  id: string;
  label?: (item: any) => string;
  sublabel?: (item: any) => string;
}) {
  const side = variant === "side";
  return (
    <div
      style={
        side
          ? { position: "relative", zIndex: 4, display: "flex", flexDirection: "column" }
          : {
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 4,
              borderTop: `1px solid ${accent}26`,
              background: `linear-gradient(to top, ${bg}f2, ${bg}00)`,
            }
      }
    >
      <div
        className={`${id}-rail`}
        style={
          side
            ? { display: "flex", flexDirection: "column" }
            : {
                maxWidth: 1200,
                margin: "0 auto",
                display: "grid",
                gridTemplateColumns: `repeat(${items.length}, minmax(0,1fr))`,
              }
        }
      >
        {items.map((it, i) => {
          const on = i === active;
          return (
            <button
              key={label(it) + i}
              onClick={() => onPick(i)}
              onMouseEnter={onHold}
              onFocus={onHold}
              aria-label={`Voir ${label(it)}`}
              aria-current={on}
              style={{
                position: "relative",
                border: "none",
                borderRight: !side && i < items.length - 1 ? `1px solid ${accent}1f` : "none",
                borderBottom: side ? `1px solid ${accent}1f` : "none",
                cursor: "pointer",
                textAlign: "left",
                /* labels wrap to two lines at some widths; top-align so a
                   wrapped item doesn't shunt its neighbours out of line */
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "flex-start",
                padding: side ? "16px 20px 16px 18px" : "20px clamp(10px,1.6vw,22px) 22px",
                minHeight: 44,
                background: on ? `${accent}14` : "transparent",
                transition: "background 600ms cubic-bezier(0.65,0,0.35,1)",
              }}
            >
              <div
                style={{
                  fontFamily: sans,
                  fontSize: 9,
                  letterSpacing: "0.28em",
                  color: on ? accent : `${fg}59`,
                  marginBottom: 7,
                  transition: "color 600ms",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>
              <div
                style={{
                  fontFamily: serif,
                  fontSize: side ? "clamp(14px,1.3vw,17px)" : "clamp(13px,1.5vw,18px)",
                  lineHeight: 1.15,
                  color: on ? fg : `${fg}85`,
                  transition: "color 600ms",
                }}
              >
                {label(it)}
              </div>
              {sublabel && (
                <div
                  style={{
                    fontFamily: sans,
                    fontSize: 10,
                    marginTop: 5,
                    color: `${fg}59`,
                    letterSpacing: "0.06em",
                  }}
                >
                  {sublabel(it)}
                </div>
              )}
              {/* progress meter + active marker in one */}
              <motion.span
                initial={false}
                animate={{ scaleX: on ? 1 : 0 }}
                transition={{
                  duration: on && !paused && !reduce ? intervalMs / 1000 : 0.5,
                  ease: on && !paused && !reduce ? "linear" : EASE_3,
                }}
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: 2,
                  background: accent,
                  transformOrigin: "left center",
                  display: "block",
                }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   railResponsiveCSS — below 640px a five-column rail gives each item ~70px,
   which is unreadable. Scroll it horizontally instead. The hero padding is
   also capped so the section never outgrows the viewport — a bottom-pinned
   rail on an over-tall section falls straight below the fold.
   ════════════════════════════════════════════════════════════════════════════ */
export function railResponsiveCSS(id: string, opts?: { titleClamp?: string }) {
  return `
    @media (max-width: 640px) {
      #${id} { padding-top: 76px !important; padding-bottom: 78px !important; }
      /* the rail itself is ~78px of the 667px budget; trim it too */
      .${id}-rail > button { padding: 11px 16px 13px !important; }
      #${id} a > span { padding-top: 13px !important; padding-bottom: 13px !important; }
      #${id} h1 { font-size: ${opts?.titleClamp ?? "clamp(38px, 11vw, 52px)"} !important; }
      .${id}-rail {
        display: flex !important;
        overflow-x: auto;
        scroll-snap-type: x mandatory;
        -webkit-overflow-scrolling: touch;
      }
      .${id}-rail > button { flex: 0 0 46%; scroll-snap-align: start; }
      .${id}-rail::-webkit-scrollbar { height: 0; }

      /* The block the selector swaps reserves a fixed min-height on desktop so
         the CTAs don't jump between items. On a 667px viewport that reservation
         is what pushes the hero past the fold, and the jump matters far less
         because the rail is scrolled, not clicked in place. */
      #${id} .hero-detail { min-height: 0 !important; margin-bottom: 10px !important; }
      #${id} .hero-detail p { font-size: 14px !important; line-height: 1.6 !important; }
      #${id} .hero-lede { font-size: 14px !important; line-height: 1.5 !important; margin-bottom: 12px !important; }
      #${id} h1 { margin-bottom: 12px !important; }
      #${id} .hero-secondary { display: none !important; }
    }
  `;
}
