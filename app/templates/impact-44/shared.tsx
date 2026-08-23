"use client";

/*
  impact-44 — Espace Studio · Marseille. Jetons, données de démonstration et
  composants partagés entre l'accueil et les sous-pages (prestations, studio,
  réalisations, sélection, contact). L'ex-organisation esport a été réécrite :
  le catalogue vendait déjà « Espace Studio », studio de décoration.
  Fontes P6 Archivo + Inter · palette #101012 / #d8c8a8 (sable).
*/

import React, { useState, useEffect, useRef } from "react";

// ─── JETONS ──────────────────────────────────────────────────────────────────
export const C = {
  bg: "#101012",
  gray: "#18181c",
  grayAlt: "#1e1e23",
  sable: "var(--brand, #d8c8a8)",
  sableFixe: "#d8c8a8",
  white: "#f2ede4",
  textMid: "#a8a294",
  textDim: "#6d6a62",
  line: "rgba(242,237,228,0.08)",
};

// ─── DONNÉES ─────────────────────────────────────────────────────────────────
export const NAV_LINKS = [
  { label: "Prestations", href: "/templates/impact-44/modes" },
  { label: "Le studio", href: "/templates/impact-44/team" },
  { label: "Réalisations", href: "/templates/impact-44/bracket" },
  { label: "La sélection", href: "/templates/impact-44/merch" },
];

export const PRESTATIONS = [
  {
    id: 1,
    tag: "Prestation 01",
    title: "Conseil couleur & matières",
    sub: "Une visite, un nuancier, une direction",
    desc: "Deux heures chez vous, un carnet de teintes et de matières adapté à votre lumière, et la liste exacte de quoi acheter où. Le plus court chemin vers un lieu cohérent.",
    stat: ["2 h", "chez vous"],
    prix: "dès 320 €",
  },
  {
    id: 2,
    tag: "Prestation 02",
    title: "Décoration pièce par pièce",
    sub: "Du plan d'aménagement à la pose",
    desc: "Plan, mobilier, luminaires, rideaux et accessoires — une pièce entière repensée, chinée et installée. Vous partez un vendredi, vous rentrez dans une autre maison.",
    stat: ["1", "pièce entière"],
    prix: "dès 90 €/m²",
  },
  {
    id: 3,
    tag: "Prestation 03",
    title: "Rénovation & suivi de chantier",
    sub: "Un seul interlocuteur, du croquis aux clés",
    desc: "Plans, artisans, commandes et passage hebdomadaire sur le chantier. Le studio porte le projet en entier — vous décidez, il exécute.",
    stat: ["7-12", "semaines"],
    prix: "sur devis",
  },
  {
    id: 4,
    tag: "Prestation 04",
    title: "Home staging avant vente",
    sub: "Vendre mieux, plus vite",
    desc: "Désencombrement, lumière, touches de couleur : le bien photographié comme il mérite de l'être, en deux semaines maximum.",
    stat: ["2", "semaines max"],
    prix: "dès 590 €",
  },
];

export const STUDIO_STATS = [
  { value: 130, label: "Lieux livrés", suffix: "+" },
  { value: 9, label: "Années de pratique", suffix: "" },
  { value: 40, label: "Artisans partenaires", suffix: "" },
  { value: 96, label: "Clients qui recommandent", suffix: " %" },
];

export const EQUIPE = [
  { nom: "Inès Roman", role: "Fondatrice · direction artistique", detail: "La couleur, la matière, la lumière" },
  { nom: "Paul Berthon", role: "Architecte d'intérieur", detail: "Les plans et les volumes" },
  { nom: "Léa Costa", role: "Cheffe de projet", detail: "Les chantiers et les artisans" },
  { nom: "Marc Aillaud", role: "Ébéniste partenaire", detail: "Le mobilier sur mesure" },
  { nom: "Sofia Njami", role: "Styliste déco", detail: "La couche finale" },
];

export const SELECTION = [
  { name: "Vase grès de Provence", price: "65", tag: "Pièce unique", hot: true },
  { name: "Lampe à poser Ocre", price: "140", tag: "Série courte", hot: false },
  { name: "Plaid laine des Pyrénées", price: "95", tag: "Sélection", hot: true },
  { name: "Miroir laiton brossé", price: "210", tag: "Nouveauté", hot: false },
];

export const REALISATIONS = [
  { nom: "Appartement Vieux-Port", type: "Rénovation complète", duree: "11 semaines" },
  { nom: "Maison du Roucas", type: "Décoration pièce par pièce", duree: "5 semaines" },
  { nom: "Cabinet d'architectes", type: "Espaces professionnels", duree: "7 semaines" },
  { nom: "Studio Cours Julien", type: "Home staging", duree: "2 semaines" },
];

/* Les trois ambiances du moodboard du héros — chacune retint la pièce
   dessinée et change le panneau de matières (PanelDrop). */
export const AMBIANCES = [
  {
    nom: "Minérale",
    teinte: "#b7b2a6",
    fonce: "#8f8a7d",
    desc: "Chaux, pierre et lin : la lumière du sud, sans l'éblouir.",
    matieres: ["Chaux ferrée", "Pierre de Cassis", "Lin lavé"],
  },
  {
    nom: "Terracotta",
    teinte: "#b2643f",
    fonce: "#8a4b2e",
    desc: "Terres cuites et bois blond : la chaleur qui ne se démode pas.",
    matieres: ["Tomette ancienne", "Chêne blond", "Laine bouclée"],
  },
  {
    nom: "Nuit",
    teinte: "#3d4654",
    fonce: "#2c333e",
    desc: "Bleus profonds et laiton : la pièce du soir, feutrée et précise.",
    matieres: ["Zellige nuit", "Laiton brossé", "Velours côtelé"],
  },
];

// ─── COMPOSANTS ──────────────────────────────────────────────────────────────

/* Compteur posé : il grimpe une fois, quand il entre à l'écran. */
export function StatCounter({ value, label, suffix = "", format }: { value: number; label: string; suffix?: string; format?: (v: number) => string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const duration = 1400;
    const steps = 50;
    const increment = value / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      setCount(Math.min(value, Math.round(increment * step)));
      if (step >= steps) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [started, value]);

  const display = format ? format(count) : `${count.toLocaleString("fr-FR")}${suffix}`;

  return (
    <div ref={ref} style={{ textAlign: "center", padding: "32px 24px" }}>
      <div
        className="i44-titre"
        style={{
          fontSize: "clamp(36px, 5vw, 64px)",
          fontWeight: 800,
          letterSpacing: "-0.02em",
          marginBottom: 12,
          color: C.sable,
        }}
      >
        {display}
      </div>
      <div style={{
        fontSize: 11,
        color: C.textDim,
        letterSpacing: "0.3em",
        textTransform: "uppercase",
        fontWeight: 700,
      }}>
        {label}
      </div>
    </div>
  );
}

/* Le nuancier — trois pastilles de matière, dessinées. */
export function Nuancier({ teintes }: { teintes: string[] }) {
  return (
    <div style={{ display: "flex", gap: 10 }} aria-hidden>
      {teintes.map((t, i) => (
        <div key={i} style={{
          width: 26,
          height: 26,
          borderRadius: "50%",
          background: t,
          border: `1px solid ${C.line}`,
          boxShadow: "inset 0 2px 6px rgba(0,0,0,0.25)",
        }} />
      ))}
    </div>
  );
}
