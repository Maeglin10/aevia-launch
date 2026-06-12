"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Wine } from "lucide-react";
import { C, SectionReveal } from "../shared";

export default function CartePage() {
  const entrees = [
    { name: "Tartare de légumes du moment", desc: "Concombre, radis, tomate ancienne, herbes du jardin, vinaigrette citronnée à la moutarde de Meaux", price: "18€" },
    { name: "Velouté d'asperges au parmesan", desc: "Asperges vertes du Val de Loire, émulsion de parmesan 24 mois, tuile aux graines de sésame noir", price: "22€" },
    { name: "Foie gras de canard maison", desc: "Terrine mi-cuit, chutney de figues et raisins, brioche toastée au beurre de Normandie", price: "28€" },
    { name: "Saint-Jacques snackées", desc: "Noix de saint-jacques de la Baie de Saint-Brieuc, purée de topinambour, émulsion de beurre fumé", price: "26€" },
    { name: "Œuf parfait du jardin", desc: "Œuf basse température 65°C, crème de morilles, lardons fumés, croûtons maison et persil plat", price: "19€" },
  ];

  const poissons = [
    { name: "Sole meunière", desc: "Sole entière de Bretagne, beurre noisette aux câpres de Pantelleria, persil et citron confit maison", price: "38€" },
    { name: "Daurade en croûte de sel", desc: "Daurade royale de Méditerranée, herbes aromatiques du jardin, légumes primeurs sautés à l'huile d'olive", price: "42€" },
    { name: "Turbot rôti au four", desc: "Filet de turbot sauvage, jus de coquillages réduit, risotto aux courgettes jaunes et fleurs de courgette", price: "44€" },
  ];

  const viandes = [
    { name: "Agneau de lait en deux cuissons", desc: "Carré et épaule confite, jus au romarin et thym du jardin, gratin dauphinois à la crème fraîche", price: "42€" },
    { name: "Filet de bœuf Rossini", desc: "Cœur de filet Charolais, escalope de foie gras poêlé, sauce Périgueux à la truffe noire du Périgord", price: "48€" },
    { name: "Pigeon farci aux champignons", desc: "Pigeon de Racan, farce aux morilles et foie gras, purée de pommes de terre truffée, jus au porto", price: "38€" },
  ];

  const desserts = [
    { name: "Millefeuille à la vanille", desc: "Pâte feuilletée caramélisée maison, crème diplomate vanille de Madagascar, coulis de fraise Gariguette", price: "16€" },
    { name: "Soufflé chaud au Grand Marnier", desc: "Soufflé aérien à l'orange confite, glace vanille maison, crème anglaise légère (20 min de préparation)", price: "18€" },
    { name: "Tarte Tatin revisitée", desc: "Pommes Reinette caramélisées au beurre demi-sel, pâte brisée sablée, crème fraîche épaisse du Calvados", price: "14€" },
    { name: "Assiette de fromages affinés", desc: "Sélection par notre maître fromager : Comté, Époisses, Saint-Nectaire fermier, Roquefort Papillon", price: "18€" },
  ];

  const vins = [
    { name: "Gevrey-Chambertin 1er Cru", producer: "Domaine Rossignol-Trapet", appellation: "Bourgogne Rouge", vintage: "2019", price: "145€" },
    { name: "Puligny-Montrachet Les Pucelles", producer: "Domaine Leflaive", appellation: "Bourgogne Blanc", vintage: "2020", price: "210€" },
    { name: "Côte-Rôtie La Mouline", producer: "Guigal", appellation: "Rhône Nord", vintage: "2018", price: "185€" },
    { name: "Sauternes Premier Cru Classé", producer: "Château d'Yquem", appellation: "Sauternes Liquoreux", vintage: "2017", price: "290€" },
  ];

  const Section = ({ title, items, isWine = false }: { title: string; items: any[]; isWine?: boolean }) => (
    <SectionReveal>
      <div style={{ marginBottom: "3.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.75rem" }}>
          <h2 style={{ fontFamily: C.headingFont, fontSize: "1.8rem", fontWeight: 700, color: C.text, margin: 0 }}>{title}</h2>
          <div style={{ flex: 1, height: 1, backgroundColor: C.border, marginLeft: "0.5rem" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {items.map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "1.5rem",
                padding: "1.35rem 0",
                borderBottom: i < items.length - 1 ? `1px solid ${C.border}` : "none",
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: C.headingFont, fontSize: "1.05rem", fontWeight: 700, color: C.text, marginBottom: "0.35rem" }}>
                  {item.name}
                </div>
                {isWine ? (
                  <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                    <span style={{ fontFamily: C.bodyFont, fontSize: "0.8rem", color: C.textMuted }}>{item.producer}</span>
                    <span style={{ fontFamily: C.bodyFont, fontSize: "0.8rem", color: C.accent }}>·</span>
                    <span style={{ fontFamily: C.bodyFont, fontSize: "0.8rem", color: C.textLight }}>{item.appellation}</span>
                    <span style={{ fontFamily: C.bodyFont, fontSize: "0.8rem", color: C.accent }}>·</span>
                    <span style={{ fontFamily: C.bodyFont, fontSize: "0.8rem", color: C.textLight }}>{item.vintage}</span>
                  </div>
                ) : (
                  <p style={{ fontFamily: C.bodyFont, fontSize: "0.87rem", color: C.textLight, lineHeight: 1.7, margin: 0 }}>
                    {item.desc}
                  </p>
                )}
              </div>
              <div
                style={{
                  fontFamily: C.headingFont,
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: C.accentDark,
                  flexShrink: 0,
                  paddingTop: "0.1rem",
                }}
              >
                {item.price}
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionReveal>
  );

  return (
    <div style={{ minHeight: "100vh", backgroundColor: C.bg, paddingTop: "8rem", paddingBottom: "5rem" }}>
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "0 1.5rem" }}>
        <SectionReveal>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <span style={{ fontFamily: C.bodyFont, fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.earth }}>
              Cuisine à la demande
            </span>
            <h1 style={{ fontFamily: C.headingFont, fontSize: "clamp(2.2rem, 5vw, 3.5rem)", color: C.text, fontWeight: 700, margin: "0.6rem 0 1rem", lineHeight: 1.15 }}>
              À la Carte
            </h1>
            <p style={{ fontFamily: C.bodyFont, color: C.textLight, fontSize: "1rem", maxWidth: 520, margin: "0 auto", lineHeight: 1.85 }}>
              Composez votre repas selon vos envies. Chaque plat est préparé à la minute, avec les meilleurs produits du moment.
            </p>
          </div>
        </SectionReveal>

        <Section title="Entrées" items={entrees} />
        <Section title="Poissons & Fruits de Mer" items={poissons} />
        <Section title="Viandes & Volailles" items={viandes} />
        <Section title="Desserts" items={desserts} />

        <SectionReveal>
          <div
            style={{
              backgroundColor: C.bgDark,
              borderRadius: "1.75rem",
              padding: "2.5rem",
              marginTop: "1rem",
              marginBottom: "3rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.75rem" }}>
              <Wine size={20} color={C.accent} />
              <h2 style={{ fontFamily: C.headingFont, fontSize: "1.6rem", fontWeight: 700, color: C.bg, margin: 0 }}>
                Sélection de la Cave
              </h2>
            </div>
            {vins.map((v, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "1.5rem",
                  padding: "1.25rem 0",
                  borderBottom: i < vins.length - 1 ? "1px solid rgba(240,192,64,0.1)" : "none",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: C.headingFont, fontSize: "1rem", fontWeight: 700, color: C.bg, marginBottom: "0.3", marginTop: 0 }}>
                    {v.name}
                  </div>
                  <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                    <span style={{ fontFamily: C.bodyFont, fontSize: "0.78rem", color: "rgba(253,249,238,0.45)" }}>{v.producer}</span>
                    <span style={{ fontFamily: C.bodyFont, fontSize: "0.78rem", color: C.accent }}>·</span>
                    <span style={{ fontFamily: C.bodyFont, fontSize: "0.78rem", color: "rgba(253,249,238,0.55)" }}>{v.appellation}</span>
                    <span style={{ fontFamily: C.bodyFont, fontSize: "0.78rem", color: C.accent }}>·</span>
                    <span style={{ fontFamily: C.bodyFont, fontSize: "0.78rem", color: "rgba(253,249,238,0.45)" }}>{v.vintage}</span>
                  </div>
                </div>
                <div style={{ fontFamily: C.headingFont, fontSize: "1.1rem", fontWeight: 700, color: C.accent, flexShrink: 0 }}>
                  {v.price}
                </div>
              </div>
            ))}
            <p style={{ fontFamily: C.bodyFont, fontSize: "0.8rem", color: "rgba(253,249,238,0.35)", marginTop: "1.5rem", marginBottom: 0 }}>
              Notre sommelier vous guide dans le choix des accords mets et vins. Carte des vins complète disponible en salle.
            </p>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <div style={{ textAlign: "center" }}>
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
