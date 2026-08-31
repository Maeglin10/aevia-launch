"use client";
import {
  clientCityOr,
  clientPhotoAt,
} from "@/lib/templates/clientContent";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

function EDITORIALS_LIVE() {
  return [
  { title: "Corps Céleste", season: "Automne / Hiver 2025", designer: "Maison Leroux", image: clientPhotoAt(6, "https://images.pexels.com/photos/4271613/pexels-photo-4271613.jpeg?auto=compress&cs=tinysrgb&w=1600"), tag: "Couture" },
  { title: "Lumière Froide", season: "Printemps / Été 2025", designer: "Atelier Vidal", image: clientPhotoAt(7, "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80"), tag: "Éditorial" },
  { title: "Ombre et Matière", season: "Resort 2025", designer: "Studio Beaumont", image: clientPhotoAt(8, "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80"), tag: "Art" },
  { title: "Minuit Parisien", season: "Automne / Hiver 2025", designer: "Collectif Nuit", image: clientPhotoAt(9, "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&q=80"), tag: "Exclusif" },
  { title: "Texture Vivante", season: "Couture 2025", designer: "Maison du Fil", image: clientPhotoAt(10, "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80"), tag: "Couture" },
  { title: "Le Grand Geste", season: "Printemps / Été 2025", designer: "Atelier Blanc", image: clientPhotoAt(11, "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&q=80&tag=Éditorial"), tag: "Éditorial" },
];
}
export let EDITORIALS = EDITORIALS_LIVE();

function FEATURES_LIVE() {
  return [
  { issue: "N° 214 · Janvier 2025", title: "Vers un luxe invisible", subtitle: "Comment les grandes maisons réinventent la discrétion comme ultime statut", image: clientPhotoAt(12, "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80") },
  { issue: "N° 213 · Décembre 2024", title: "Les mains qui font", subtitle: "Portrait de six artisans dont le savoir-faire dessine l'avenir de la mode", image: clientPhotoAt(13, "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80") },
  { issue: "N° 212 · Novembre 2024", title: "Corps politiques", subtitle: "La mode comme langage du pouvoir — anatomie d'une saison chargée", image: clientPhotoAt(14, "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=600&q=80") },
];
}
export let FEATURES = FEATURES_LIVE();

export const BOUTIQUES = [
  { city: clientCityOr("Paris"), address: "15 rue du Faubourg Saint-Honoré, 75008", hours: "10h–19h (sf dimanche)" },
  { city: "Milan", address: "Via Montenapoleone 12, 20121", hours: "10h–19h" },
  { city: "New York", address: "720 Fifth Avenue, NY 10019", hours: "10h–20h" },
];

export const Instagram = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="5"/>
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
  </svg>
);

export const Twitter = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

export function Reveal({ children, delay = 0, y = 40 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}


/*
  Rappelé par la page une fois la session retenue : sans cet appel, les
  tableaux ci-dessus gardent la valeur qu'ils avaient à l'import, quand le
  client n'existait pas encore.
*/
export function rafraichirPartage(): void {
  EDITORIALS = EDITORIALS_LIVE();
  FEATURES = FEATURES_LIVE();
}
