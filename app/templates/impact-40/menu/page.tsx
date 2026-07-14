"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, UtensilsCrossed } from "lucide-react";
import { C, SectionReveal } from "../shared";

export default function MenuPage() {
  const menus = [
    {
      name: "Menu Découverte",
      subtitle: "4 plats",
      price: "68€",
      priceNote: "par personne",
      tag: null,
      courses: [
        { label: "Entrée", dish: "Velouté d'asperges vertes, émulsion de parmesan vieilli, chips de jambon Ibérique et ail des ours sauvage" },
        { label: "Poisson", dish: "Filet de sole meunière, risotto aux morilles du Jura, beurre noisette aux câpres et citron confit" },
        { label: "Viande", dish: "Carré d'agneau de lait en croûte d'herbes, jus réduit au thym, légumes primeurs du maraîcher voisin" },
        { label: "Dessert", dish: "Millefeuille croustillant à la vanille de Tahiti, fraises Gariguette marinées au basilic" },
      ],
      bg: C.bg,
      border: C.border,
    },
    {
      name: "Menu Prestige",
      subtitle: "7 plats",
      price: "110€",
      priceNote: "par personne",
      tag: "Accord mets & vins +45€",
      courses: [
        { label: "Amuse-bouche", dish: "Trilogie de la saison : radis glacé au beurre, tartare de tomate ancienne, croquette de chèvre frais" },
        { label: "Première entrée", dish: "Velouté glacé d'asperges blanches, huile de truffe noire du Périgord, œuf mollet poché" },
        { label: "Deuxième entrée", dish: "Carpaccio de saint-jacques en ceviche légère, concombre aux fleurs, caviar d'Aquitaine" },
        { label: "Poisson", dish: "Daurade royale en croûte de sel aux herbes aromatiques, légumes croquants à l'huile d'olive primeur" },
        { label: "Viande", dish: "Agneau de lait des Pyrénées en deux cuissons, jus au romarin, gratin dauphinois à la crème" },
        { label: "Fromages", dish: "Sélection affinée par Maître fromager : Comté 24 mois, Époisses, Roquefort Papillon" },
        { label: "Dessert", dish: "Sphère chocolat Valrhona, cœur coulant au caramel beurre salé, glace vanille maison" },
      ],
      bg: C.bgDark,
      border: "rgba(240,192,64,0.2)",
      dark: true,
    },
    {
      name: "Menu Végétal",
      subtitle: "5 plats",
      price: "78€",
      priceNote: "par personne",
      tag: null,
      courses: [
        { label: "Mise en bouche", dish: "Gaspacho de tomates anciennes au basilic, chantilly au fromage blanc et graines de courge torréfiées" },
        { label: "Première entrée", dish: "Terrine de légumes du moment en gelée d'herbes, vinaigrette aux fleurs de capucine" },
        { label: "Deuxième entrée", dish: "Risotto crémeux aux morilles et parmesan, herbes sauvages, copeaux de truffe de saison" },
        { label: "Plat principal", dish: "Tarte fine de légumes provençaux, pesto de roquette, burrata crémeuse et tomate rôtie lentement" },
        { label: "Dessert", dish: "Pavlova aux fruits rouges, coulis de fraises Gariguette, chantilly légère à la fleur d'oranger" },
      ],
      bg: C.bgAlt,
      border: C.border,
    },
    {
      name: "Formule Déjeuner",
      subtitle: "Mardi – Vendredi",
      price: "38€",
      priceNote: "par personne",
      tag: "Entrée + Plat + Dessert",
      courses: [
        { label: "Entrée au choix", dish: "Salade de saison aux herbes du jardin — ou — Velouté du jour selon arrivages du marché" },
        { label: "Plat au choix", dish: "Poisson du pêcheur local avec légumes de saison — ou — Viande du boucher artisan, sauce maison" },
        { label: "Dessert au choix", dish: "Dessert du chef selon inspiration du matin — ou — Sélection de fromages affinés (supplément 4€)" },
      ],
      bg: C.bg,
      border: C.border,
    },
  ];

  return (
    <div style={{ minHeight: "100dvh", backgroundColor: C.bg, paddingTop: "8rem", paddingBottom: "5rem" }}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 1.5rem" }}>
        <SectionReveal>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <span style={{ fontFamily: C.bodyFont, fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.earth }}>
              Gastronomie saisonnière
            </span>
            <h1 style={{ fontFamily: C.headingFont, fontSize: "clamp(2.2rem, 5vw, 3.5rem)", color: C.text, fontWeight: 700, margin: "0.6rem 0 1rem", lineHeight: 1.15 }}>
              Nos Menus
            </h1>
            <p style={{ fontFamily: C.bodyFont, color: C.textLight, fontSize: "1rem", maxWidth: 540, margin: "0 auto", lineHeight: 1.85 }}>
              Chaque menu est une composition pensée autour des saisons, des producteurs locaux et du dialogue entre la terre et l'assiette.
            </p>
          </div>
        </SectionReveal>

        <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
          {menus.map((m, idx) => (
            <SectionReveal key={m.name} delay={idx * 0.08}>
              <div
                style={{
                  backgroundColor: m.bg,
                  borderRadius: "1.75rem",
                  border: `1px solid ${m.border}`,
                  overflow: "hidden",
                  boxShadow: `0 4px 32px ${C.shadow}`,
                }}
              >
                {/* Header */}
                <div
                  style={{
                    padding: "2rem 2.5rem 1.5rem",
                    borderBottom: `1px solid ${m.dark ? "rgba(240,192,64,0.15)" : C.border}`,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                    gap: "1rem",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.4rem" }}>
                      <UtensilsCrossed size={16} color={C.accent} />
                      <span style={{ fontFamily: C.bodyFont, fontSize: "0.78rem", fontWeight: 700, color: C.accent, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                        {m.subtitle}
                      </span>
                    </div>
                    <h2 style={{ fontFamily: C.headingFont, fontSize: "1.6rem", fontWeight: 700, color: m.dark ? C.bg : C.text, margin: 0 }}>
                      {m.name}
                    </h2>
                    {m.tag && (
                      <span
                        style={{
                          display: "inline-block",
                          marginTop: "0.5rem",
                          backgroundColor: "rgba(240,192,64,0.15)",
                          border: "1px solid rgba(240,192,64,0.35)",
                          color: C.accent,
                          padding: "0.25rem 0.85rem",
                          borderRadius: "2rem",
                          fontSize: "0.76rem",
                          fontWeight: 600,
                          fontFamily: C.bodyFont,
                        }}
                      >
                        {m.tag}
                      </span>
                    )}
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: C.headingFont, fontSize: "2.4rem", fontWeight: 700, color: C.accent, lineHeight: 1 }}>
                      {m.price}
                    </div>
                    <div style={{ fontFamily: C.bodyFont, fontSize: "0.8rem", color: m.dark ? "rgba(253,249,238,0.5)" : C.textMuted, marginTop: "0.2rem" }}>
                      {m.priceNote}
                    </div>
                  </div>
                </div>

                {/* Courses */}
                <div style={{ padding: "1.75rem 2.5rem 2rem" }}>
                  {m.courses.map((course, ci) => (
                    <div
                      key={ci}
                      style={{
                        display: "flex",
                        gap: "1.25rem",
                        alignItems: "flex-start",
                        paddingBottom: ci < m.courses.length - 1 ? "1.25rem" : 0,
                        marginBottom: ci < m.courses.length - 1 ? "1.25rem" : 0,
                        borderBottom: ci < m.courses.length - 1 ? `1px solid ${m.dark ? "rgba(240,192,64,0.08)" : C.border}` : "none",
                      }}
                    >
                      <div
                        style={{
                          minWidth: 110,
                          fontFamily: C.bodyFont,
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          color: C.accent,
                          textTransform: "uppercase",
                          letterSpacing: "0.09em",
                          paddingTop: "0.18rem",
                          flexShrink: 0,
                        }}
                      >
                        {course.label}
                      </div>
                      <p
                        style={{
                          fontFamily: C.bodyFont,
                          fontSize: "0.9rem",
                          color: m.dark ? "rgba(253,249,238,0.72)" : C.textLight,
                          lineHeight: 1.75,
                          margin: 0,
                        }}
                      >
                        {course.dish}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>

        <SectionReveal delay={0.3}>
          <div style={{ textAlign: "center", marginTop: "3.5rem" }}>
            <p style={{ fontFamily: C.bodyFont, fontSize: "0.85rem", color: C.textMuted, marginBottom: "1.5rem", lineHeight: 1.7 }}>
              Tous nos menus sont élaborés avec des produits frais du terroir local. Nous adaptons nos compositions selon les arrivages. Allergies et régimes alimentaires : merci de nous prévenir à la réservation.
            </p>
            <Link href="/templates/impact-40/reservation" style={{ textDecoration: "none" }}>
              <button
                type="button"
                style={{
                  backgroundColor: C.bgDark,
                  color: C.accent,
                  padding: "1rem 2.5rem",
                  borderRadius: "3rem",
                  border: "none",
                  fontWeight: 700,
                  fontFamily: C.bodyFont,
                  fontSize: "0.95rem",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                Réserver une table <ArrowRight size={16} />
              </button>
            </Link>
          </div>
        </SectionReveal>
      </div>
    </div>
  );
}
