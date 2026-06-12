"use client";

import React from "react";
import { motion } from "framer-motion";
import { TemplateIcon } from "@/components/TemplateIcon";

// ─── Design Tokens ─────────────────────────────────────────────────────────────
export const C = {
  bg: "#fdf8f0",
  bgLight: "#f5e6c8",
  bgSection: "#fdf3e3",
  text: "#5c3317",
  textMuted: "#8c6440",
  accent: "#d4832a",
  accentDark: "#b86e1e",
  accentLight: "#fdedc8",
  brown: "#5c3317",
  brownLight: "#8c6440",
  cream: "#f5e6c8",
  white: "#FFFFFF",
  border: "#e8d5b0",
  shadow: "0 4px 24px rgba(92,51,23,0.09)",
  shadowLg: "0 12px 48px rgba(92,51,23,0.15)",
};

export const FONT_HEADING = "'Playfair Display', Georgia, serif";
export const FONT_BODY = "'Source Sans Pro', system-ui, sans-serif";

// ─── Marquee ──────────────────────────────────────────────────────────────────
export function Marquee() {
  const items = [
    { emoji: "🥐", name: "Croissant pur beurre" },
    { emoji: "🍞", name: "Pain de campagne" },
    { emoji: "🥖", name: "Baguette tradition" },
    { emoji: "🧁", name: "Madeleine au miel" },
    { emoji: "🎂", name: "Tarte aux fraises" },
    { emoji: "🥨", name: "Bretzel artisanal" },
    { emoji: "🍰", name: "Mille-feuille" },
    { emoji: "🫓", name: "Fougasse aux olives" },
    { emoji: "🍩", name: "Kouign-amann" },
    { emoji: "🥧", name: "Éclair au chocolat" },
  ];
  const doubled = [...items, ...items];
  return (
    <div style={{ overflow: "hidden", width: "100%", padding: "20px 0" }}>
      <motion.div
        style={{ display: "flex", gap: 20, width: "max-content" }}
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      >
        {doubled.map((item, i) => (
          <div
            key={i}
            style={{
              background: C.white,
              borderRadius: 14,
              padding: "14px 22px",
              display: "flex",
              alignItems: "center",
              gap: 10,
              border: `1px solid ${C.border}`,
              boxShadow: C.shadow,
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            <TemplateIcon emoji={item.emoji} size={22} />
            <span style={{ fontFamily: FONT_HEADING, fontSize: 15, color: C.text, fontWeight: 600 }}>
              {item.name}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

// ─── Static Data lists ────────────────────────────────────────────────────────
export const CATEGORIES = [
  {
    name: "Pains & Miches",
    emoji: "🍞",
    items: [
      { name: "Pain de campagne", desc: "Levain naturel, croûte croustillante, mie alvéolée", price: "5,50 €" },
      { name: "Baguette Tradition", desc: "Farine de blé T65, façonnée à la main", price: "1,40 €" },
      { name: "Pain aux noix", desc: "Mie dense, noix françaises, levain de seigle", price: "4,80 €" },
      { name: "Épi de froment", desc: "Classique festif, idéal pour le partage", price: "2,20 €" },
    ],
  },
  {
    name: "Viennoiseries",
    emoji: "🥐",
    items: [
      { name: "Croissant pur beurre", desc: "Feuilletage 27 couches, beurre AOP Poitou-Charentes", price: "1,80 €" },
      { name: "Pain au chocolat", desc: "Deux barres Valrhona, pâte feuilletée maison", price: "2,10 €" },
      { name: "Kouign-amann", desc: "Spécialité bretonne, caramélisé minute", price: "3,20 €" },
      { name: "Brioche tressée", desc: "Pur beurre, sucre perlé, vanille Bourbon", price: "5,90 €" },
    ],
  },
  {
    name: "Pâtisseries",
    emoji: "🎂",
    items: [
      { name: "Tarte aux fraises", desc: "Fraises Gariguette, crème pâtissière vanille", price: "4,50 €" },
      { name: "Éclair café", desc: "Ganache café, glaçage satiné, crème légère", price: "3,80 €" },
      { name: "Mille-feuille", desc: "Feuilletage caramélisé, crème diplomate vanille", price: "4,20 €" },
      { name: "Opéra maison", desc: "Biscuit joconde, ganache café, praliné", price: "5,00 €" },
    ],
  },
];

export const BOUTIQUE_PRODUCTS = [
  {
    title: "Pains artisanaux",
    emoji: "🍞",
    items: [
      { name: "Pain au levain", price: "6,50 €", desc: "Levain naturel 20 ans, croûte dorée, mie alvéolée. La signature de La Fournée.", img: "photo-1509440159596-0249088772ff" },
      { name: "Pain complet T80", price: "5,20 €", desc: "Farine complète Label Rouge, riche en fibres, saveur de noisette.", img: "photo-1565299585323-38d6b0865b47" },
      { name: "Pain de seigle", price: "5,80 €", desc: "30 % de seigle, mie dense et aromatique, idéal avec du fromage.", img: "photo-1598373182133-52452f7691ef" },
      { name: "Pain à l'épeautre", price: "6,20 €", desc: "Épeautre ancien non hybridé, goût délicat, digestibilité améliorée.", img: "photo-1555507036-ab1f4038808a" },
    ],
  },
  {
    title: "Viennoiseries",
    emoji: "🥐",
    items: [
      { name: "Croissant pur beurre", price: "1,80 €", desc: "Feuilletage 27 couches, beurre AOP Poitou-Charentes, doré au four chaque matin.", img: "photo-1555507036-ab1f4038808a" },
      { name: "Pain au chocolat", price: "2,10 €", desc: "Deux barres Valrhona 70 %, pâte feuilletée maison, fondant garanti.", img: "photo-1604882737254-ed4abb408b44" },
      { name: "Kouign-amann", price: "3,20 €", desc: "Spécialité bretonne, caramélisé minute, croustillant en surface.", img: "photo-1509440159596-0249088772ff" },
      { name: "Brioche tressée", price: "5,90 €", desc: "Pur beurre, sucre perlé, vanille Bourbon de Madagascar.", img: "photo-1606890658317-7d14490b76fd" },
    ],
  },
  {
    title: "Gâteaux de saison",
    emoji: "🎂",
    items: [
      { name: "Tarte Tatin", price: "4,80 €", desc: "Pommes caramélisées, pâte feuilletée inversée, crème fraîche artisanale.", img: "photo-1568051243851-f9b136146e97" },
      { name: "Mille-feuille vanille", price: "4,20 €", desc: "Feuilletage caramélisé 3 couches, crème diplomate vanille Bourbon.", img: "photo-1587248720327-8eb72564be1e" },
      { name: "Financier aux amandes", price: "2,50 €", desc: "Beurre noisette, amandes en poudre, texture moelleuse intense.", img: "photo-1571115177098-24ec42ed204d" },
      { name: "Opéra maison", price: "5,00 €", desc: "Biscuit joconde, ganache café, praliné, glacé au chocolat noir.", img: "photo-1578985545062-69928b1d9587" },
    ],
  },
];

export const TARTES_DATA = [
  {
    name: "Tarte Tatin",
    subtitle: "La classique revisitée",
    price: "4,80 € la part · 28 € entière",
    desc: "Née d'une erreur heureuse en 1889 à Lamotte-Beuvron, la Tarte Tatin est devenue l'un des desserts les plus emblématiques de France. Notre version est préparée avec des pommes Golden caramélisées au beurre demi-sel, posées sur une pâte feuilletée inversée que nous réalisons entièrement à la main. La cuisson à l'envers révèle des pommes confites, fondantes et légèrement acidulées. Servie tiède avec une cuillerée de crème fraîche normande.",
    img: "photo-1568051243851-f9b136146e97",
    badge: "Signature",
  },
  {
    name: "Tarte Citron Meringuée",
    subtitle: "L'équilibre parfait",
    price: "4,50 € la part · 26 € entière",
    desc: "Cette tarte est le résultat de 30 années de perfectionnement. La crème citron est préparée avec des citrons jaunes de Menton, leur zeste râpé à la minute, et des œufs de plein air. La meringue italienne — réalisée au sirop de sucre chaud versé sur les blancs montés — garantit une texture soyeuse en surface et un cœur aérien. Légèrement flambée à la torche, dorée à souhait.",
    img: "photo-1462009006923-605686e02fd7",
    badge: "Coup de cœur",
  },
  {
    name: "Tarte aux Fruits de Saison",
    subtitle: "Selon l'arrivage du marché",
    price: "5,20 € la part · 32 € entière",
    desc: "Camille se rend chaque matin au marché des producteurs pour choisir les meilleurs fruits de saison. Sur un fond de tarte sablée au beurre noisette, elle dispose une crème d'amande légère puis une sélection de fruits : fraises Gariguette au printemps, pêches de vigne en été, figues et raisins muscat en automne. Chaque part est un tableau vivant des saisons.",
    img: "photo-1488477181946-6428a0291777",
    badge: "Saison",
  },
  {
    name: "Tarte Amandine aux Poires",
    subtitle: "L'automne en douceur",
    price: "4,70 € la part · 27 € entière",
    desc: "Notre tarte amandine revisite le grand classique franco-anglais. La crème frangipane est préparée avec des amandes de Provence concassées à la main, du beurre de qualité supérieure et une touche d'extrait d'amande amère. Les poires Williams sont pochées dans un sirop vanillé avant d'être disposées en rosace. Un dessert réconfortant, profond, d'une générosité rare.",
    img: "photo-1519915028121-7d3463d20b13",
    badge: "Automne",
  },
];

export const WORKSHOPS = [
  {
    title: "Initiation Pain Maison",
    duration: "3 heures",
    price: "75 € / personne",
    spots: "Max 8 personnes",
    schedule: "Samedi 9h–12h",
    emoji: "🍞",
    desc: "Apprenez les bases du pain au levain naturel. Pétrissage à la main, façonnage, gestion de la fermentation. Vous repartirez avec votre propre miche de pain et des connaissances pour continuer chez vous. Camille vous enseigne les gestes du boulanger avec patience et précision.",
    includes: ["Tablier fourni", "Votre pain à emporter", "Recette complète", "Petit-déjeuner boulangerie"],
  },
  {
    title: "Atelier Croissants & Feuilletage",
    duration: "2 heures",
    price: "55 € / personne",
    spots: "Max 6 personnes",
    schedule: "Dimanche 10h–12h",
    emoji: "🥐",
    desc: "Le mystère du feuilletage enfin révélé. Réalisez votre propre pâte feuilletée en 27 tours et découvrez les secrets du croissant pur beurre : détrempe, beurrage, tourage. Un atelier technique et gratifiant, qui change le regard sur cette viennoiserie d'apparence simple.",
    includes: ["Matériel professionnel", "Vos viennoiseries à emporter", "Fiche technique illustrée", "Café & jus d'orange"],
  },
  {
    title: "Atelier Enfants — Mon Premier Pain",
    duration: "1h30",
    price: "35 € / enfant",
    spots: "Max 8 enfants (6–12 ans)",
    schedule: "Mercredi 14h–15h30",
    emoji: "👶",
    desc: "Un moment magique pour initier les enfants au monde de la boulangerie artisanale. Dans une ambiance joyeuse et bienveillante, they discover where bread comes from, how flour becomes dough, and shape their own little bread to take home proudly.",
    includes: ["Tablier enfant offert", "Pain façonné à emporter", "Diplôme de petit boulanger", "Goûter offert"],
  },
];

export const FAQS = [
  { q: "Proposez-vous la livraison à domicile ?", a: "Oui, nous livrons dans un rayon de 3 km du mardi au samedi, de 8h à 12h. Commandez en ligne avant 20h la veille. Livraison offerte à partir de 25 € d'achat." },
  { q: "Puis-je commander des pâtisseries personnalisées ?", a: "Absolument ! Camille réalise des gâteaux sur commande pour vos anniversaires, mariages et événements professionnels. Délai minimum : 5 jours ouvrés. Contactez-nous pour un devis gratuit." },
  { q: "Utilisez-vous des farines biologiques ?", a: "Nous utilisons principalement des farines Label Rouge provenant de moulins français. Notre farine de tradition T65 vient du Moulin Decollogne en Bourgogne. Certains pains spéciaux sont en agriculture biologique certifiée." },
  { q: "Avez-vous des produits sans gluten ou végans ?", a: "Nous proposons quelques références véganes (pain aux céréales, brioche végane). Pour le sans gluten, nos équipements partagés ne permettent pas de garantir l'absence totale de contamination croisée." },
];

export const TESTIMONIALS = [
  { name: "Isabelle T.", text: "La meilleure baguette tradition de Paris, sans hésitation. Le croissant est à se damner — feuilleté, aérien, pur beurre. J'y vais chaque samedi matin depuis 8 ans.", stars: 5 },
  { name: "Grégoire M.", text: "L'abonnement hebdomadaire est une révélation. Du pain frais sans y penser, livré directement en boutique avant mon passage. Qualité constante, équipe adorable.", stars: 5 },
  { name: "Sakina B.", text: "J'ai commandé le plateau prestige pour l'anniversaire de ma mère — succès total. Chaque pâtisserie était un chef-d'œuvre de saveurs. Merci Camille !", stars: 5 },
];

