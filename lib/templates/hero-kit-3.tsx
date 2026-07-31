"use client";
/* ════════════════════════════════════════════════════════════════════════════
   HERO KIT 3 — les mécaniques que la première passe sur les enregistrements
   n'avait pas extraites.

   Pourquoi ce fichier existe : les dix-huit héros posés avec hero-kit-2 se
   ressemblent tous. En comptant, quinze sur dix-huit utilisent BlurThrough,
   dix-sept HairlineArrows, quinze SlideIndex. La signature est donc partout la
   même — une photo qui se dissout, un compteur, deux flèches filaires — alors
   que les dix-huit enregistrements d'origine ont chacun leur geste propre.

   Ce fichier tient ces gestes-là, un par enregistrement. Règle d'usage :
   **une mécanique de signature par thème, jamais deux thèmes voisins avec la
   même.** Les accessoires (compteur, flèches) peuvent se répéter ; le geste
   central, non.

   Timings : voir docs/SLIDER_REVOLUTION_TEARDOWN_2.md. Les constantes T et
   DWELL de hero-kit-2 restent la référence.
   ════════════════════════════════════════════════════════════════════════════ */

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { EASE_3, EASE_4 } from "./hero-kit";

/* ════════════════════════════════════════════════════════════════════════════
   PortalZoom — v18 (portal-effect-hero-slider).

   Une forme découpée dans la photo — une arche, une porte, une fenêtre —
   laisse voir la slide suivante *à travers* elle. À la transition, la caméra
   traverse : le masque grandit jusqu'à remplir l'écran pendant que la scène
   sortante s'écarte. C'est le geste le plus spectaculaire du corpus et il ne
   coûte qu'un clip-path animé.

   Pour : voyage, hôtel, château, immobilier, tout ce qui vend un lieu.
   ════════════════════════════════════════════════════════════════════════════ */
export function PortalZoom({
  images,
  index,
  /** Forme du seuil, en pourcentages du conteneur. Défaut : une arche. */
  portal = "inset(22% 38% 0% 38% round 50% 50% 0 0 / 40% 40% 0 0)",
  overlay = 0.45,
  className = "",
  children,
}: {
  images: string[];
  index: number;
  portal?: string;
  overlay?: number;
  className?: string;
  /** Titre et CTA. Ils partent avec la scène sortante. */
  children?: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  const cur = images[index % images.length];
  const nxt = images[(index + 1) % images.length];
  return (
    <div className={className} style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      {/* la scène suivante, déjà là, visible seulement par le seuil */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${nxt})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div
          key={index}
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${cur})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            willChange: "clip-path, transform",
          }}
          initial={reduce ? { opacity: 0 } : { clipPath: "inset(0% 0% 0% 0%)", scale: 1 }}
          animate={reduce ? { opacity: 1 } : { clipPath: "inset(0% 0% 0% 0%)", scale: 1 }}
          exit={
            reduce
              ? { opacity: 0, transition: { duration: 0.2 } }
              : {
                  // on traverse : le seuil s'ouvre en grand et la scène recule
                  clipPath: [portal, "inset(0% 0% 0% 0%)"],
                  scale: [1.02, 2.6],
                  opacity: [1, 0],
                  transition: { duration: 1.15, ease: EASE_4, times: [0.35, 1] },
                }
          }
        />
      </AnimatePresence>
      <div style={{ position: "absolute", inset: 0, background: `rgba(0,0,0,${overlay})` }} />
      {children}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   HardCutRebuild — v16 (fitness-gym-website-slider).

   La photographie ne se dissout pas : elle coupe net. Puis un temps où il n'y
   a plus de texte du tout, et le titre, les statistiques et le bouton se
   reconstruisent en décalé. Une barre de couleur reste fixe pendant toute
   l'opération et donne l'axe.

   Le contraire d'un fondu : c'est du montage, pas de la transition.

   Pour : sport, garage, bâtiment, tout ce qui doit frapper.
   ════════════════════════════════════════════════════════════════════════════ */
export function HardCutRebuild({
  index,
  children,
  className = "",
  /** Décalage entre les enfants, en secondes. */
  stagger = 0.09,
}: {
  index: string | number;
  /** Chaque enfant se reconstruit à son tour. */
  children: React.ReactNode[];
  className?: string;
  stagger?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <div className={className}>
      {children.map((child, n) => (
        <AnimatePresence mode="wait" key={n}>
          <motion.div
            key={`${index}-${n}`}
            style={{ willChange: "transform, opacity" }}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 26, skewY: 1.2 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, skewY: 0 }}
            exit={
              reduce
                ? { opacity: 0, transition: { duration: 0.12 } }
                : // la sortie est brutale et simultanée : c'est la coupe
                  { opacity: 0, transition: { duration: 0.12 } }
            }
            transition={{
              duration: reduce ? 0.2 : 0.62,
              ease: EASE_4,
              // le temps mort avant que le texte revienne
              delay: reduce ? 0 : 0.34 + n * stagger,
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
   CrossPush — v07 (old-soul-tattoo-studio-slideshow).

   La photo sortante glisse à gauche pendant que l'entrante arrive par la
   droite, et pendant un instant les deux sujets sont à l'écran en même temps.
   Aucun fondu : deux plans qui se croisent.

   Pour : tatouage, coiffure, portrait, mode — tout ce qui montre des gens.
   ════════════════════════════════════════════════════════════════════════════ */
export function CrossPush({
  images,
  index,
  overlay = 0.5,
  className = "",
}: {
  images: string[];
  index: number;
  overlay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <div className={className} style={{ position: "absolute", inset: 0, overflow: "hidden" }} aria-hidden>
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div
          key={index}
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${images[index % images.length]})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            willChange: "transform",
          }}
          initial={reduce ? { opacity: 0 } : { x: "42%", scale: 1.04 }}
          animate={reduce ? { opacity: 1 } : { x: "0%", scale: 1 }}
          exit={
            reduce
              ? { opacity: 0, transition: { duration: 0.2 } }
              : { x: "-42%", scale: 1.04, transition: { duration: 0.78, ease: EASE_4 } }
          }
          transition={{ duration: reduce ? 0.2 : 0.78, ease: EASE_4 }}
        />
      </AnimatePresence>
      <div style={{ position: "absolute", inset: 0, background: `rgba(0,0,0,${overlay})` }} />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   MosaicPush — v10 (dental-clinic-dentist-website-template).

   Une mosaïque de photos de tailles inégales sort par la droite, tuile par
   tuile avec un décalage, et la suivante entre par la gauche dans le même
   ordre. À mi-course la grille est presque vide : c'est ce vide qui fait
   lire les sept tuiles comme un seul geste.

   Diffère de BentoCascade (hero-kit-2), qui découpe verticalement sur place.

   Pour : santé, clinique, école, agence — les métiers d'équipe.
   ════════════════════════════════════════════════════════════════════════════ */
export function MosaicPush({
  index,
  tiles,
  className = "",
  style,
  stagger = 0.07,
}: {
  index: string | number;
  tiles: { node: React.ReactNode; area: React.CSSProperties }[];
  className?: string;
  style?: React.CSSProperties;
  stagger?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <div className={className} style={style}>
      {tiles.map(({ node, area }, n) => (
        <AnimatePresence mode="wait" key={n}>
          <motion.div
            key={`${index}-${n}`}
            style={{ ...area, overflow: "hidden", willChange: "transform, opacity" }}
            initial={reduce ? { opacity: 0 } : { x: "-115%", opacity: 0 }}
            animate={reduce ? { opacity: 1 } : { x: "0%", opacity: 1 }}
            exit={
              reduce
                ? { opacity: 0, transition: { duration: 0.15 } }
                : {
                    x: "115%",
                    opacity: 0,
                    transition: { duration: 0.42, ease: EASE_3, delay: n * 0.05 },
                  }
            }
            transition={{ duration: reduce ? 0.2 : 0.7, ease: EASE_4, delay: reduce ? 0 : n * stagger }}
          >
            {node}
          </motion.div>
        </AnimatePresence>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   TrackingCollapse — v12 (hair-salon-hairdresser-website-template).

   Le mot ne se contente pas de se flouter : son interlettrage s'écarte
   pendant qu'il disparaît, et le suivant arrive très espacé puis se resserre.
   On lit le mot se construire, pas seulement apparaître.

   Bien plus riche que le BlurThrough de hero-kit-2, et c'est exactement ce
   que fait l'original — visible sur les images 8 et 9 du dépouillement.

   Pour : beauté, coiffure, spa, joaillerie — les métiers du geste.
   ════════════════════════════════════════════════════════════════════════════ */
export function TrackingCollapse({
  word,
  index,
  className = "",
  style,
  /** Interlettrage de départ et d'arrivée. */
  from = "0.42em",
  to = "0.06em",
}: {
  word: string;
  index: string | number;
  className?: string;
  style?: React.CSSProperties;
  from?: string;
  to?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={index}
        className={className}
        style={{ display: "block", whiteSpace: "nowrap", ...style }}
        initial={
          reduce
            ? { opacity: 0 }
            : { opacity: 0, letterSpacing: from, filter: "blur(9px)" }
        }
        animate={
          reduce ? { opacity: 1 } : { opacity: 1, letterSpacing: to, filter: "blur(0px)" }
        }
        exit={
          reduce
            ? { opacity: 0, transition: { duration: 0.15 } }
            : {
                opacity: 0,
                letterSpacing: from,
                filter: "blur(9px)",
                transition: { duration: 0.42, ease: EASE_3 },
              }
        }
        transition={{ duration: reduce ? 0.2 : 0.85, ease: EASE_3 }}
      >
        {word}
      </motion.span>
    </AnimatePresence>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   PanelDrop — v02 (coffee-shop-split-screen-slider).

   Le panneau de texte descend comme un rideau, contenu compris, pendant que
   la photo change derrière. Verticale plutôt qu'horizontale : c'est ce qui
   distingue ce slider de tous les autres du corpus.

   Pour : boulangerie, café, restaurant, boutique — le format catalogue.
   ════════════════════════════════════════════════════════════════════════════ */
export function PanelDrop({
  index,
  children,
  className = "",
  style,
  /** "down" (rideau) ou "up" (le panneau monte). */
  direction = "down",
}: {
  index: string | number;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  direction?: "down" | "up";
}) {
  const reduce = useReducedMotion();
  const sign = direction === "down" ? -1 : 1;
  return (
    <div className={className} style={{ overflow: "hidden", ...style }}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={index}
          style={{ height: "100%", willChange: "transform" }}
          initial={reduce ? { opacity: 0 } : { y: `${sign * 100}%` }}
          animate={reduce ? { opacity: 1 } : { y: "0%" }}
          exit={
            reduce
              ? { opacity: 0, transition: { duration: 0.15 } }
              : { y: `${-sign * 100}%`, transition: { duration: 0.62, ease: EASE_4 } }
          }
          transition={{ duration: reduce ? 0.2 : 0.9, ease: EASE_4 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   PanelRise — v03 (shft-interior-design-website-template).

   Le titre du héros ne bouge jamais. C'est la section suivante qui monte
   par-dessus, comme un volet, et le recouvre. Piloté par le défilement, pas
   par une horloge.

   Pour : architecture, décoration, artisan d'art — les métiers de la matière.
   ════════════════════════════════════════════════════════════════════════════ */
export function PanelRise({
  children,
  className = "",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["18%", "0%"]);
  const radius = useTransform(scrollYProgress, [0, 1], ["36px", "0px"]);
  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        position: "relative",
        zIndex: 2,
        y: reduce ? 0 : y,
        borderTopLeftRadius: reduce ? 0 : radius,
        borderTopRightRadius: reduce ? 0 : radius,
        willChange: "transform",
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   ScrollGrow — v05 (dj-website-template-with-scroll-video).

   Le titre grandit au défilement au lieu de partir. La page donne
   l'impression d'avancer vers lui. À réserver à un titre court : trois
   syllabes maximum, sinon il déborde avant la fin du parcours.

   Pour : musique, événementiel, sport, nuit.
   ════════════════════════════════════════════════════════════════════════════ */
export function ScrollGrow({
  children,
  className = "",
  from = 1,
  to = 1.55,
  fade = true,
}: {
  children: React.ReactNode;
  className?: string;
  from?: number;
  to?: number;
  fade?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [from, to]);
  const opacity = useTransform(scrollYProgress, [0, 0.75, 1], [1, 1, fade ? 0 : 1]);
  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        scale: reduce ? from : scale,
        opacity: reduce ? 1 : opacity,
        transformOrigin: "50% 40%",
        willChange: "transform",
      }}
    >
      {children}
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   DifferentialExit — v04 (from-sketch-to-product-slider-template).

   Au défilement, le titre, le produit et le numéro ne partent pas à la même
   vitesse. Trois plans, trois rythmes : c'est ce qui crée la profondeur, pas
   une ombre portée.

   `depth` va de 0 (le fond, part lentement) à 1 (le premier plan, part vite).

   Pour : produit, e-commerce, artisan, tout héros avec un objet.
   ════════════════════════════════════════════════════════════════════════════ */
export function DifferentialExit({
  children,
  depth = 0.5,
  className = "",
  style,
}: {
  children: React.ReactNode;
  /** 0 = arrière-plan, 1 = premier plan. */
  depth?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", `${-30 - depth * 70}%`]);
  const opacity = useTransform(scrollYProgress, [0, 0.6 + depth * 0.3], [1, 0]);
  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ y: reduce ? 0 : y, opacity: reduce ? 1 : opacity, willChange: "transform", ...style }}
    >
      {children}
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   StickyProgress — v03 (shft), section « Our Process ».

   Un titre collé à gauche, une liste numérotée qui se révèle pas à pas au
   défilement, et une photo à droite qui change à chaque étape. Ce n'est pas
   un héros : c'est la section qui vient juste après, et c'est elle qui fait
   « cher » sur les deux templates les plus aboutis du corpus.

   Pour : n'importe quel métier qui a une méthode en trois à cinq étapes —
   c'est-à-dire à peu près tous.
   ════════════════════════════════════════════════════════════════════════════ */
export function StickyProgress({
  steps,
  renderTitle,
  renderMedia,
  className = "",
  style,
}: {
  steps: { n: string; title: string; body: string }[];
  /** Le bloc collé à gauche. */
  renderTitle: (active: number) => React.ReactNode;
  /** La colonne de droite, redessinée à chaque étape active. */
  renderMedia?: (active: number) => React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const n = refs.current.findIndex((r) => r === e.target);
            if (n >= 0) setActive(n);
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    refs.current.forEach((r) => r && io.observe(r));
    return () => io.disconnect();
  }, []);

  return (
    <div className={className} style={style}>
      <div style={{ position: "sticky", top: "18vh", alignSelf: "start" }}>{renderTitle(active)}</div>
      <div>
        {steps.map((s, n) => (
          <div
            key={s.n}
            ref={(el) => {
              refs.current[n] = el;
            }}
            style={{ minHeight: "58vh", display: "flex", alignItems: "center" }}
          >
            <motion.div
              animate={reduce ? undefined : { opacity: n === active ? 1 : 0.28 }}
              transition={{ duration: 0.55, ease: EASE_3 }}
              style={{ width: "100%" }}
            >
              <div style={{ display: "flex", gap: "clamp(16px,2.5vw,40px)", alignItems: "flex-start" }}>
                <span style={{ opacity: 0.5, fontVariantNumeric: "tabular-nums" }}>{s.n}</span>
                <div>
                  <h3 style={{ marginBottom: 10 }}>{s.title}</h3>
                  <p style={{ maxWidth: "56ch", lineHeight: 1.7 }}>{s.body}</p>
                </div>
              </div>
              {renderMedia ? <div style={{ marginTop: 22 }}>{renderMedia(n)}</div> : null}
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   LineScroll — v13 (suits-product-showcase-slider-template).

   Les lignes du titre défilent horizontalement sous masque : elles entrent
   par la droite et sortent par la gauche, chacune avec son propre décalage.
   On lit un instant la queue de la ligne sortante en même temps que la tête
   de l'entrante — « …ance » et « …lisation » sur l'original.

   LineMask (hero-kit-2) fait l'inverse et sans chevauchement ; celui-ci est
   plus continu, plus proche d'un rouleau qu'd'un remplacement.

   Pour : mode, costume, joaillerie, hôtellerie de luxe.
   ════════════════════════════════════════════════════════════════════════════ */
export function LineScroll({
  lines,
  index,
  className = "",
  lineStyle,
}: {
  lines: string[];
  index: string | number;
  className?: string;
  lineStyle?: React.CSSProperties;
}) {
  const reduce = useReducedMotion();
  return (
    <span className={className} style={{ display: "block" }}>
      {lines.map((l, n) => (
        <span key={n} style={{ display: "block", overflow: "hidden" }}>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={`${index}-${n}`}
              style={{ display: "block", whiteSpace: "nowrap", willChange: "transform", ...lineStyle }}
              initial={reduce ? { opacity: 0 } : { x: "108%" }}
              animate={reduce ? { opacity: 1 } : { x: "0%" }}
              exit={
                reduce
                  ? { opacity: 0, transition: { duration: 0.15 } }
                  : { x: "-108%", transition: { duration: 0.85, ease: EASE_4, delay: n * 0.08 } }
              }
              transition={{ duration: reduce ? 0.2 : 0.85, ease: EASE_4, delay: n * 0.08 }}
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
   FixedRail — v16, v13.

   La barre de couleur qui ne bouge jamais pendant que tout change autour.
   Elle porte le compteur et donne l'axe du héros. Trois pixels de large sur
   l'original du fitness, une colonne entière sur celui des costumes.

   Ce n'est pas une décoration : c'est ce qui permet à la coupe franche de se
   lire comme un montage plutôt que comme un bug.
   ════════════════════════════════════════════════════════════════════════════ */
export function FixedRail({
  color,
  side = "left",
  width = "clamp(34px, 3.4vw, 58px)",
  children,
  className = "",
}: {
  color: string;
  side?: "left" | "right";
  width?: string;
  /** Compteur, mention verticale — ce qui reste immobile. */
  children?: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      animate={{ backgroundColor: color }}
      transition={{ duration: reduce ? 0.2 : 0.9, ease: EASE_3 }}
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        [side]: 0,
        width,
        zIndex: 5,
        display: "grid",
        placeItems: "center",
        gap: 12,
      }}
    >
      {children}
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   CrossFigure — v03.

   Une silhouette qui traverse le cadre, en boucle très lente, par-dessus une
   photo fixe. Sur SHFT c'est une personne qui marche dans la pièce : le héros
   n'a aucune animation d'interface et paraît pourtant vivant.

   À utiliser quand le thème n'a qu'une seule photographie et qu'il faut de la
   vie sans slider.
   ════════════════════════════════════════════════════════════════════════════ */
export function CrossFigure({
  src,
  seconds = 22,
  className = "",
  opacity = 0.5,
  height = "62%",
}: {
  /** Une photographie détourée, ou une simple ombre floue. */
  src: string;
  seconds?: number;
  className?: string;
  opacity?: number;
  height?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <motion.div
      className={className}
      aria-hidden
      style={{
        position: "absolute",
        bottom: 0,
        height,
        aspectRatio: "1 / 2.4",
        backgroundImage: `url(${src})`,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "bottom center",
        filter: "blur(2px)",
        opacity,
        willChange: "transform",
        pointerEvents: "none",
      }}
      initial={{ x: "-30vw" }}
      animate={{ x: "115vw" }}
      transition={{ duration: seconds, ease: "linear", repeat: Infinity, repeatDelay: 6 }}
    />
  );
}
